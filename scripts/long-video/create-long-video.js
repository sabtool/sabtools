#!/usr/bin/env node

/**
 * YouTube Long Video Pipeline — Main Entry Point
 *
 * Creates a full website walkthrough video for SabTools.in:
 *   - Intro title card
 *   - Homepage tour
 *   - Categories overview
 *   - Live demos of 6 popular tools (typing, clicking, results)
 *   - Features highlight
 *   - Outro with CTA
 *
 * Usage:
 *   node scripts/long-video/create-long-video.js                → Create & upload
 *   node scripts/long-video/create-long-video.js --no-upload     → Create only
 */

const fs = require("fs");
const path = require("path");
const config = require("./config");
const { captureWebsiteWalkthrough } = require("./capture-screens");
const { generateVoiceover } = require("./generate-voice");
const { createLongVideo } = require("./create-video");
const { uploadLongVideo } = require("./upload-youtube");

async function main() {
  const args = process.argv.slice(2);
  const shouldUpload = !args.includes("--no-upload");

  console.log("═".repeat(60));
  console.log("🎬 Creating YouTube Long Video: SabTools.in Walkthrough");
  console.log("═".repeat(60));

  // Clean temp directory
  const tempDir = config.TEMP_DIR;
  if (fs.existsSync(tempDir)) {
    fs.readdirSync(tempDir).forEach((f) => {
      try { fs.unlinkSync(path.join(tempDir, f)); } catch {}
    });
  }
  fs.mkdirSync(tempDir, { recursive: true });
  fs.mkdirSync(config.OUTPUT_DIR, { recursive: true });

  // Step 1: Capture all screenshots
  console.log("\n📸 Step 1: Capturing website walkthrough...");
  console.log("   This will demo 6 tools with real interaction\n");
  const scenes = await captureWebsiteWalkthrough();
  console.log(`\n   ${scenes.length} scenes captured`);

  if (scenes.length === 0) {
    console.error("   No scenes captured. Aborting.");
    process.exit(1);
  }

  // Step 2: Generate voiceover
  console.log("\n🎙️  Step 2: Generating voiceover...\n");
  const voice = await generateVoiceover(scenes);
  console.log(`\n   Audio: ${voice.combinedPath}`);

  // Step 3: Create video
  console.log("\n🎬 Step 3: Creating video...\n");
  const videoPath = await createLongVideo(scenes, voice.combinedPath);
  console.log(`   Video: ${videoPath}`);

  // Step 4: Upload
  let result = null;
  if (shouldUpload) {
    console.log("\n📤 Step 4: Uploading to YouTube...");
    result = await uploadLongVideo(videoPath);
  } else {
    console.log("\n⏭️  Step 4: Upload skipped (--no-upload flag)");
  }

  // Summary
  console.log("\n" + "═".repeat(60));
  console.log("✅ LONG VIDEO CREATED SUCCESSFULLY!");
  console.log(`   Video: ${videoPath}`);
  if (result) {
    console.log(`   YouTube: ${result.videoUrl}`);
  }
  console.log("═".repeat(60));
}

main().catch((err) => {
  console.error("\nFatal error:", err.message);
  process.exit(1);
});
