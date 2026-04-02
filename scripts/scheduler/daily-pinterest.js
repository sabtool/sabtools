#!/usr/bin/env node

/**
 * Automated Daily Pinterest Pin Poster
 * Posts 3 pins per day from the priority tools list, then cycles through all tools
 * Tracks which tools have been posted to avoid duplicates
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..", "..");
const LOG_FILE = path.join(ROOT, "scripts", "scheduler", "run-log.json");
const PINTEREST_HISTORY = path.join(ROOT, "scripts", "scheduler", "pinterest-history.json");
const LOCK_FILE = path.join(ROOT, "scripts", "scheduler", ".lock-pinterest");

// Prevent overlapping runs
if (fs.existsSync(LOCK_FILE)) {
  const lockAge = Date.now() - fs.statSync(LOCK_FILE).mtimeMs;
  if (lockAge < 15 * 60 * 1000) {
    console.log("Another Pinterest run is in progress. Skipping.");
    process.exit(0);
  }
  fs.unlinkSync(LOCK_FILE);
}
fs.writeFileSync(LOCK_FILE, String(Date.now()));

function getHistory() {
  if (fs.existsSync(PINTEREST_HISTORY)) {
    try { return JSON.parse(fs.readFileSync(PINTEREST_HISTORY, "utf-8")); } catch {}
  }
  return { posted: [], lastIndex: 0 };
}

function saveHistory(history) {
  fs.writeFileSync(PINTEREST_HISTORY, JSON.stringify(history, null, 2));
}

function log(entry) {
  let logs = [];
  if (fs.existsSync(LOG_FILE)) {
    try { logs = JSON.parse(fs.readFileSync(LOG_FILE, "utf-8")); } catch {}
  }
  logs.push({ ...entry, timestamp: new Date().toISOString() });
  if (logs.length > 200) logs = logs.slice(-200);
  fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2));
}

async function main() {
  console.log("=== Automated Pinterest Pin ===");
  console.log("Time:", new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }));

  const config = require("../pinterest/config");
  const { postPin } = require("../pinterest/post-pin");

  const history = getHistory();
  const PINS_PER_DAY = 3;

  // Get next tools to post
  const allTools = config.PRIORITY_TOOLS;
  const toolsToPost = [];

  for (let i = 0; i < PINS_PER_DAY; i++) {
    const index = (history.lastIndex + i) % allTools.length;
    const tool = allTools[index];

    // Skip if posted in last 30 days
    const lastPosted = history.posted.find((p) => p.slug === tool.slug);
    if (lastPosted) {
      const daysSince = (Date.now() - new Date(lastPosted.date).getTime()) / (1000 * 60 * 60 * 24);
      if (daysSince < 30) {
        // Find next unposted tool
        let altIndex = (index + 1) % allTools.length;
        while (altIndex !== index) {
          const altTool = allTools[altIndex];
          const altPosted = history.posted.find((p) => p.slug === altTool.slug);
          if (!altPosted || (Date.now() - new Date(altPosted.date).getTime()) > 30 * 24 * 60 * 60 * 1000) {
            toolsToPost.push({ tool: altTool, index: altIndex });
            break;
          }
          altIndex = (altIndex + 1) % allTools.length;
        }
        continue;
      }
    }
    toolsToPost.push({ tool, index });
  }

  console.log(`Posting ${toolsToPost.length} pins today:`);
  toolsToPost.forEach((t) => console.log(`  - ${t.tool.name}`));

  let successCount = 0;

  for (const { tool, index } of toolsToPost) {
    try {
      console.log(`\n--- Posting: ${tool.name} ---`);
      const result = await postPin(tool);

      // Update history
      const existing = history.posted.findIndex((p) => p.slug === tool.slug);
      const record = { slug: tool.slug, date: new Date().toISOString(), pinId: result.pinId };
      if (existing >= 0) {
        history.posted[existing] = record;
      } else {
        history.posted.push(record);
      }
      history.lastIndex = index + 1;
      saveHistory(history);

      log({
        type: "pinterest",
        status: "success",
        tool: tool.name,
        pinUrl: result.pinUrl,
        toolUrl: result.toolUrl,
      });

      successCount++;

      // Wait 30 seconds between pins (avoid rate limits)
      if (toolsToPost.indexOf({ tool, index }) < toolsToPost.length - 1) {
        console.log("Waiting 30s before next pin...");
        await new Promise((r) => setTimeout(r, 30000));
      }
    } catch (err) {
      console.error(`Failed to post ${tool.name}:`, err.message);
      log({
        type: "pinterest",
        status: "failed",
        tool: tool.name,
        error: err.message.slice(0, 300),
      });
    }
  }

  console.log(`\nDone! ${successCount}/${toolsToPost.length} pins posted.`);
}

main()
  .catch((err) => {
    console.error("Fatal:", err.message);
    log({ type: "pinterest", status: "fatal", error: err.message.slice(0, 300) });
  })
  .finally(() => {
    try { fs.unlinkSync(LOCK_FILE); } catch {}
  });
