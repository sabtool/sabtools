#!/usr/bin/env node

/**
 * Daily Pinterest Auto-Poster
 * Posts 2 pins per day automatically
 * Uses Chrome profile — no login needed
 * Run via launchd scheduler
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const LOCK_FILE = path.join(__dirname, ".lock-daily");
const LOG_FILE = path.join(__dirname, "daily-log.json");

// Prevent overlapping
if (fs.existsSync(LOCK_FILE)) {
  const age = Date.now() - fs.statSync(LOCK_FILE).mtimeMs;
  if (age < 30 * 60 * 1000) {
    console.log("Already running. Skipping.");
    process.exit(0);
  }
  fs.unlinkSync(LOCK_FILE);
}
fs.writeFileSync(LOCK_FILE, String(Date.now()));

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
  console.log("=== Daily Pinterest Pin ===");
  console.log(new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }));

  try {
    const output = execSync(
      `node "${path.join(__dirname, "auto-post.js")}" --batch 2`,
      {
        cwd: path.join(__dirname, "..", ".."),
        encoding: "utf-8",
        timeout: 10 * 60 * 1000,
        stdio: ["pipe", "pipe", "pipe"],
      }
    );
    console.log(output);
    log({ status: "success", output: output.slice(-300) });
  } catch (err) {
    console.error("Failed:", err.stderr || err.message);
    log({ status: "failed", error: (err.stderr || err.message).slice(0, 300) });
  } finally {
    try { fs.unlinkSync(LOCK_FILE); } catch {}
  }
}

main();
