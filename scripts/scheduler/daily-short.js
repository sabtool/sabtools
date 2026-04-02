#!/usr/bin/env node

/**
 * Automated YouTube Short Creator
 * Picks the next tool, creates video with thumbnail, uploads, posts comment
 * Logs everything to run-log.json
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const ROOT = path.join(__dirname, "..", "..");
const LOG_FILE = path.join(ROOT, "scripts", "scheduler", "run-log.json");
const LOCK_FILE = path.join(ROOT, "scripts", "scheduler", ".lock");

// Prevent overlapping runs
if (fs.existsSync(LOCK_FILE)) {
  const lockAge = Date.now() - fs.statSync(LOCK_FILE).mtimeMs;
  if (lockAge < 30 * 60 * 1000) {
    console.log("Another run is in progress. Skipping.");
    process.exit(0);
  }
  // Stale lock — remove it
  fs.unlinkSync(LOCK_FILE);
}

fs.writeFileSync(LOCK_FILE, String(Date.now()));

function log(entry) {
  let logs = [];
  if (fs.existsSync(LOG_FILE)) {
    try { logs = JSON.parse(fs.readFileSync(LOG_FILE, "utf-8")); } catch {}
  }
  logs.push({ ...entry, timestamp: new Date().toISOString() });
  // Keep last 200 entries
  if (logs.length > 200) logs = logs.slice(-200);
  fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2));
}

async function main() {
  console.log("=== Automated YouTube Short ===");
  console.log("Time:", new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }));

  try {
    // Run the shorts pipeline
    const output = execSync(
      `node "${path.join(ROOT, "scripts", "shorts", "create-short.js")}"`,
      {
        cwd: ROOT,
        encoding: "utf-8",
        timeout: 10 * 60 * 1000, // 10 min timeout
        stdio: ["pipe", "pipe", "pipe"],
      }
    );

    console.log(output);

    // Extract video URL from output
    const urlMatch = output.match(/YouTube:\s*(https:\/\/youtube\.com\/shorts\/\S+)/);
    const toolMatch = output.match(/Creating YouTube Short:\s*(.+)/);
    const videoMatch = output.match(/Video:\s*(.+\.mp4)/);

    log({
      type: "short",
      status: "success",
      tool: toolMatch ? toolMatch[1].trim() : "unknown",
      youtubeUrl: urlMatch ? urlMatch[1] : null,
      videoPath: videoMatch ? videoMatch[1].trim() : null,
    });

    console.log("\nShort created and uploaded successfully!");

    // Now set thumbnail for the uploaded short
    if (urlMatch) {
      const videoId = urlMatch[1].split("/").pop();
      try {
        await setShortThumbnail(videoId, toolMatch ? toolMatch[1].trim() : "Free Tool");
        console.log("Thumbnail set for short!");
      } catch (thumbErr) {
        console.log("Thumbnail failed (non-critical):", thumbErr.message);
      }
    }
  } catch (err) {
    const stderr = err.stderr || err.message;
    console.error("Short creation failed:", stderr);

    log({
      type: "short",
      status: "failed",
      error: stderr.slice(0, 500),
    });

    // If it's a quota error, don't retry today
    if (stderr.includes("quotaExceeded") || stderr.includes("rateLimitExceeded")) {
      console.log("YouTube quota exceeded. Will retry next scheduled run.");
    }
  } finally {
    // Remove lock
    try { fs.unlinkSync(LOCK_FILE); } catch {}
  }
}

async function setShortThumbnail(videoId, toolName) {
  const { google } = require("googleapis");
  const { createShortsThumbnail } = require("../long-video/create-thumbnail");
  const config = require("../shorts/config");

  const thumbPath = path.join(config.TEMP_DIR, "short_thumbnail.png");
  fs.mkdirSync(config.TEMP_DIR, { recursive: true });

  await createShortsThumbnail({ name: toolName, icon: "" }, thumbPath);

  const creds = JSON.parse(fs.readFileSync(config.YOUTUBE_CREDS, "utf-8"));
  const { client_id, client_secret, redirect_uris } = creds.installed || creds.web || {};
  const oauth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris?.[0]);
  const token = JSON.parse(fs.readFileSync(config.YOUTUBE_TOKEN, "utf-8"));
  oauth2Client.setCredentials(token);

  const youtube = google.youtube({ version: "v3", auth: oauth2Client });

  await youtube.thumbnails.set({
    videoId,
    media: { mimeType: "image/png", body: fs.createReadStream(thumbPath) },
  });
}

main().catch((err) => {
  console.error("Fatal:", err.message);
  try { fs.unlinkSync(LOCK_FILE); } catch {}
  process.exit(1);
});
