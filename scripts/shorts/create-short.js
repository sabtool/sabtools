#!/usr/bin/env node

/**
 * YouTube Shorts Pipeline — Main Entry Point
 *
 * Usage:
 *   node scripts/shorts/create-short.js                    → Create & upload short for next tool
 *   node scripts/shorts/create-short.js --tool=emi-calculator  → Specific tool
 *   node scripts/shorts/create-short.js --no-upload        → Create only, don't upload
 *   node scripts/shorts/create-short.js --batch=5          → Create 5 shorts
 */

const fs = require("fs");
const path = require("path");
const config = require("./config");
const { generateScript } = require("./generate-script");
const { captureScreens } = require("./capture-screens");
const { generateVoice } = require("./generate-voice");
const { createVideo } = require("./create-video");
const { uploadToYouTube } = require("./upload-youtube");

// Load tools from the project
const toolsPath = path.join(__dirname, "..", "..", "src", "lib", "tools.ts");

function loadTools() {
  const content = fs.readFileSync(toolsPath, "utf-8");
  const tools = [];
  const regex =
    /\{\s*name:\s*"([^"]+)",\s*slug:\s*"([^"]+)",\s*description:\s*"([^"]+)",\s*category:\s*"([^"]+)",\s*icon:\s*"([^"]+)",\s*keywords:\s*\[([^\]]*)\]/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    tools.push({
      name: match[1],
      slug: match[2],
      description: match[3],
      category: match[4],
      icon: match[5],
      keywords: match[6].split(",").map((k) => k.trim().replace(/"/g, "")),
    });
  }
  return tools;
}

function getNextTool(tools) {
  const historyFile = path.join(config.OUTPUT_DIR, "shorts-history.json");
  let history = [];

  if (fs.existsSync(historyFile)) {
    history = JSON.parse(fs.readFileSync(historyFile, "utf-8"));
  }

  const createdSlugs = new Set(history.map((h) => h.slug));

  // Try priority tools first
  for (const slug of config.PRIORITY_TOOLS) {
    if (!createdSlugs.has(slug)) {
      return tools.find((t) => t.slug === slug);
    }
  }

  // Then any tool not yet done
  for (const tool of tools) {
    if (!createdSlugs.has(tool.slug)) {
      return tool;
    }
  }

  // All done — restart from beginning
  console.log("All tools covered! Restarting from priority tools...");
  return tools.find((t) => t.slug === config.PRIORITY_TOOLS[0]);
}

function saveHistory(tool, videoPath, youtubeUrl) {
  const historyFile = path.join(config.OUTPUT_DIR, "shorts-history.json");
  let history = [];

  if (fs.existsSync(historyFile)) {
    history = JSON.parse(fs.readFileSync(historyFile, "utf-8"));
  }

  history.push({
    slug: tool.slug,
    name: tool.name,
    date: new Date().toISOString(),
    videoPath,
    youtubeUrl: youtubeUrl || null,
  });

  fs.writeFileSync(historyFile, JSON.stringify(history, null, 2));
}

function cleanTemp() {
  const tempDir = config.TEMP_DIR;
  if (fs.existsSync(tempDir)) {
    fs.readdirSync(tempDir).forEach((f) => {
      try {
        fs.unlinkSync(path.join(tempDir, f));
      } catch {}
    });
  }
}

async function createShort(tool, shouldUpload = true) {
  console.log("═".repeat(60));
  console.log(`📹 Creating YouTube Short: ${tool.name}`);
  console.log(`   Category: ${tool.category} | Slug: ${tool.slug}`);
  console.log("═".repeat(60));

  // Clean temp directory
  cleanTemp();

  // Step 1: Generate script with AI
  console.log("\n📝 Step 1: Generating script with Gemini AI...");
  const script = await generateScript(tool);
  console.log(`   Title: ${script.title}`);
  console.log(`   Hook: ${script.hook}`);

  // Save script for reference
  const scriptPath = path.join(config.OUTPUT_DIR, `${tool.slug}-script.json`);
  fs.mkdirSync(config.OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(scriptPath, JSON.stringify(script, null, 2));

  // Step 2: Capture screenshots
  console.log("\n📸 Step 2: Capturing tool screenshots...");
  const screenshots = await captureScreens(tool, script.demoValues);
  console.log(`   Captured ${screenshots.length} screenshots`);

  if (screenshots.length === 0) {
    console.error("❌ No screenshots captured. Skipping this tool.");
    return null;
  }

  // Step 3: Generate voiceover
  console.log("\n🎙️  Step 3: Generating voiceover...");
  const voice = await generateVoice(script);
  console.log(`   Audio: ${voice.audioPath}`);

  // Step 4: Create video
  console.log("\n🎬 Step 4: Creating video...");
  const videoPath = await createVideo(tool, script, screenshots, voice.audioPath);
  console.log(`   Video: ${videoPath}`);

  // Step 5: Upload to YouTube
  let youtubeResult = null;
  if (shouldUpload) {
    console.log("\n📤 Step 5: Uploading to YouTube...");
    youtubeResult = await uploadToYouTube(videoPath, script, tool);
  } else {
    console.log("\n⏭️  Step 5: Upload skipped (--no-upload flag)");
  }

  // Save to history
  saveHistory(tool, videoPath, youtubeResult?.videoUrl);

  // Summary
  console.log("\n" + "═".repeat(60));
  console.log("✅ SHORT CREATED SUCCESSFULLY!");
  console.log(`   Tool: ${tool.name}`);
  console.log(`   Video: ${videoPath}`);
  if (youtubeResult) {
    console.log(`   YouTube: ${youtubeResult.videoUrl}`);
  }
  console.log("═".repeat(60));

  return { videoPath, youtubeResult, script };
}

async function main() {
  const args = process.argv.slice(2);
  let targetSlug = null;
  let shouldUpload = true;
  let batchSize = 1;

  for (const arg of args) {
    if (arg.startsWith("--tool=")) targetSlug = arg.split("=")[1];
    if (arg === "--no-upload") shouldUpload = false;
    if (arg.startsWith("--batch=")) batchSize = parseInt(arg.split("=")[1], 10);
  }

  const tools = loadTools();
  console.log(`Loaded ${tools.length} tools from database\n`);

  if (tools.length === 0) {
    console.error("No tools found! Check tools.ts path.");
    process.exit(1);
  }

  for (let i = 0; i < batchSize; i++) {
    let tool;

    if (targetSlug) {
      tool = tools.find((t) => t.slug === targetSlug);
      if (!tool) {
        console.error(`Tool not found: ${targetSlug}`);
        process.exit(1);
      }
    } else {
      tool = getNextTool(tools);
    }

    if (!tool) {
      console.error("No tool available for short creation.");
      break;
    }

    try {
      await createShort(tool, shouldUpload);
    } catch (err) {
      console.error(`\n❌ Error creating short for ${tool.name}:`, err.message);
    }

    // Small delay between batch items
    if (i < batchSize - 1) {
      console.log("\nWaiting 5 seconds before next short...\n");
      await new Promise((r) => setTimeout(r, 5000));
    }
  }

  console.log("\n🎉 All done!");
}

main().catch(console.error);
