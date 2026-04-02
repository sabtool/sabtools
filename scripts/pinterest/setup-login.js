#!/usr/bin/env node

/**
 * ONE-TIME Pinterest Login Setup
 * Opens a visible Chrome window using Puppeteer's own profile.
 * You log in with Google once, and the session is saved for auto-post.js
 *
 * Usage: node setup-login.js
 * After login: close the browser window, session is saved!
 */

const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");

const CHROME_USER_DATA = path.join(__dirname, "puppeteer-profile");

async function main() {
  console.log("=== Pinterest Login Setup ===");
  console.log("This will open a Chrome window.");
  console.log("Please log in to Pinterest with Google.");
  console.log("After login, close the browser window.\n");

  // Create profile directory
  fs.mkdirSync(CHROME_USER_DATA, { recursive: true });

  const browser = await puppeteer.launch({
    headless: false, // VISIBLE browser so user can log in
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-blink-features=AutomationControlled",
      `--user-data-dir=${CHROME_USER_DATA}`,
      "--window-size=1400,900",
    ],
    defaultViewport: { width: 1400, height: 900 },
    ignoreDefaultArgs: ["--enable-automation"],
  });

  const page = await browser.newPage();

  // Set realistic user agent
  await page.setUserAgent(
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  );

  // Go to Pinterest login
  await page.goto("https://www.pinterest.com/login/", {
    waitUntil: "networkidle2",
    timeout: 30000,
  });

  console.log("Browser opened! Please log in to Pinterest now...");
  console.log("After you see your Pinterest homepage, close the browser window.");

  // Wait for the browser to be closed by the user
  await new Promise((resolve) => {
    browser.on("disconnected", resolve);
  });

  // Verify session was saved
  const cookiesExist = fs.existsSync(path.join(CHROME_USER_DATA, "Default", "Cookies")) ||
                       fs.existsSync(path.join(CHROME_USER_DATA, "Cookies"));

  if (cookiesExist) {
    console.log("\n✅ Login session saved successfully!");
    console.log(`Profile: ${CHROME_USER_DATA}`);
    console.log("You can now run: node auto-post.js");
  } else {
    console.log("\n⚠️ Session may not have saved. Try running setup again.");
  }
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
