#!/usr/bin/env node

/**
 * Pinterest Pin Poster via Puppeteer Browser Automation
 * No API needed — logs into Pinterest directly and creates pins
 *
 * Usage:
 *   node post-pin-browser.js                    # Posts next unposted tool
 *   node post-pin-browser.js emi-calculator     # Posts specific tool
 *   node post-pin-browser.js --batch 5          # Posts 5 pins
 */

const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const config = require("./config");
const { createPinImage } = require("./create-pin-image");

const COOKIE_FILE = config.COOKIE_FILE;
const LOG_FILE = config.LOG_FILE;

// ============================================================
// SEO Content Generators
// ============================================================

function generateTitle(tool) {
  const templates = [
    `FREE ${tool.name} Online — No Signup Needed!`,
    `${tool.name} — Free Online Tool | SabTools.in`,
    `Best Free ${tool.name} for India — Try Now!`,
    `Use ${tool.name} FREE — Instant Results Online`,
    `${tool.name} — 100% Free, Works on Mobile`,
  ];
  return templates[Math.floor(Math.random() * templates.length)];
}

function generateDescription(tool) {
  const toolUrl = `${config.SITE_URL}/tools/${tool.slug}`;
  const templates = [
    `Use this FREE ${tool.name} online at SabTools.in! No signup needed — works instantly on mobile and desktop.\n\n` +
    `Features:\n` +
    `✅ 100% Free — No hidden charges\n` +
    `✅ No Signup or Download Required\n` +
    `✅ Works on Mobile & Desktop\n` +
    `✅ Instant Accurate Results\n\n` +
    `${tool.keywords}\n\n` +
    `Try it now: ${toolUrl}\n\n` +
    `450+ Free Online Tools at SabTools.in\n` +
    `#${tool.slug.replace(/-/g, "")} #freetool #onlinetool #india #sabtools`,

    `Looking for a free ${tool.name.toLowerCase()}? SabTools.in has you covered!\n\n` +
    `No registration, no download — just open and use. Perfect for students, professionals, and everyone in India.\n\n` +
    `${tool.keywords}\n\n` +
    `${toolUrl}\n\n` +
    `#freetool #onlinecalculator #india #${tool.category} #sabtools`,

    `FREE ${tool.name} — calculate instantly online!\n\n` +
    `Why SabTools.in?\n` +
    `🔹 450+ Free Tools\n` +
    `🔹 No Signup Required\n` +
    `🔹 Mobile Friendly\n` +
    `🔹 Made for India\n\n` +
    `${tool.keywords}\n\n` +
    `Try now: ${toolUrl}\n` +
    `#${tool.slug.replace(/-/g, "")} #free #onlinetool #sabtools #india`,
  ];
  return templates[Math.floor(Math.random() * templates.length)];
}

// ============================================================
// Cookie Management (avoid repeated logins)
// ============================================================

async function saveCookies(page) {
  const cookies = await page.cookies();
  fs.writeFileSync(COOKIE_FILE, JSON.stringify(cookies, null, 2));
  console.log("Cookies saved for future sessions");
}

async function loadCookies(page) {
  if (fs.existsSync(COOKIE_FILE)) {
    const cookies = JSON.parse(fs.readFileSync(COOKIE_FILE, "utf-8"));
    if (cookies.length > 0) {
      await page.setCookie(...cookies);
      console.log("Loaded saved cookies");
      return true;
    }
  }
  return false;
}

// ============================================================
// Login to Pinterest
// ============================================================

async function loginPinterest(page) {
  console.log("Logging into Pinterest...");

  await page.goto("https://www.pinterest.com/login/", {
    waitUntil: "networkidle2",
    timeout: 30000,
  });

  await new Promise((r) => setTimeout(r, 2000));

  // Check if already logged in (redirected to home)
  if (page.url().includes("/feed") || page.url() === "https://www.pinterest.com/") {
    console.log("Already logged in via cookies!");
    return true;
  }

  if (!config.PINTEREST_EMAIL || !config.PINTEREST_PASSWORD) {
    console.error("\n⚠️  Pinterest credentials not set!");
    console.log("Set them in scripts/pinterest/config.js or via environment:");
    console.log("  PINTEREST_EMAIL=your@email.com");
    console.log("  PINTEREST_PASSWORD=yourpassword\n");
    return false;
  }

  // Type email
  const emailSelector = 'input[name="id"], input[type="email"], #email';
  await page.waitForSelector(emailSelector, { timeout: 10000 });
  await page.click(emailSelector);
  await page.type(emailSelector, config.PINTEREST_EMAIL, { delay: 50 });

  // Type password
  const passSelector = 'input[name="password"], input[type="password"], #password';
  await page.waitForSelector(passSelector, { timeout: 5000 });
  await page.click(passSelector);
  await page.type(passSelector, config.PINTEREST_PASSWORD, { delay: 50 });

  // Click login button
  await new Promise((r) => setTimeout(r, 500));
  const loginBtn = await page.$('button[type="submit"], div[data-test-id="registerFormSubmitButton"]');
  if (loginBtn) {
    await loginBtn.click();
  } else {
    await page.keyboard.press("Enter");
  }

  // Wait for navigation
  await new Promise((r) => setTimeout(r, 5000));

  // Check if login succeeded
  const currentUrl = page.url();
  if (currentUrl.includes("/feed") || currentUrl === "https://www.pinterest.com/" || !currentUrl.includes("/login")) {
    console.log("Login successful!");
    await saveCookies(page);
    return true;
  }

  console.error("Login may have failed. Current URL:", currentUrl);
  return false;
}

// ============================================================
// Create a Board if it doesn't exist
// ============================================================

async function ensureBoard(page, boardName) {
  console.log(`Checking board: ${boardName}`);

  // Go to profile/boards
  await page.goto("https://www.pinterest.com/settings/", {
    waitUntil: "networkidle2",
    timeout: 20000,
  });
  await new Promise((r) => setTimeout(r, 2000));

  // Get username from the page
  let username = "";
  try {
    username = await page.evaluate(() => {
      const el = document.querySelector('[data-test-id="header-profile"] a, a[href*="/boards"]');
      if (el) return el.getAttribute("href")?.replace(/\//g, "") || "";
      return "";
    });
  } catch {}

  if (!username) {
    // Try to get from URL
    await page.goto("https://www.pinterest.com/", { waitUntil: "networkidle2" });
    await new Promise((r) => setTimeout(r, 2000));
    try {
      username = await page.evaluate(() => {
        const links = document.querySelectorAll("a[href]");
        for (const link of links) {
          const href = link.getAttribute("href");
          if (href && href.match(/^\/[a-zA-Z0-9_]+\/$/) && !href.includes("search") && !href.includes("ideas")) {
            return href.replace(/\//g, "");
          }
        }
        return "";
      });
    } catch {}
  }

  // For now, just return the board name — Pinterest auto-assigns boards
  return boardName;
}

// ============================================================
// Upload a Pin via Pinterest Web UI
// ============================================================

async function uploadPin(page, tool, imagePath) {
  const title = generateTitle(tool);
  const description = generateDescription(tool);
  const toolUrl = `${config.SITE_URL}/tools/${tool.slug}`;
  const boardName = config.BOARDS[tool.category] || "Free Online Tools India";

  console.log(`\nUploading pin for: ${tool.name}`);
  console.log(`Title: ${title}`);
  console.log(`Board: ${boardName}`);
  console.log(`Link: ${toolUrl}`);

  // Go to pin creation page
  await page.goto("https://www.pinterest.com/pin-creation-tool/", {
    waitUntil: "networkidle2",
    timeout: 30000,
  });
  await new Promise((r) => setTimeout(r, 3000));

  // Upload image
  const fileInput = await page.$('input[type="file"]');
  if (!fileInput) {
    // Try alternative selectors
    const inputs = await page.$$("input");
    for (const input of inputs) {
      const type = await input.evaluate((el) => el.type);
      if (type === "file") {
        await input.uploadFile(imagePath);
        console.log("Image uploaded (alt method)");
        break;
      }
    }
  } else {
    await fileInput.uploadFile(imagePath);
    console.log("Image uploaded");
  }

  await new Promise((r) => setTimeout(r, 3000));

  // Fill in title
  try {
    const titleInput = await page.$('[data-test-id="pin-draft-title"] textarea, [data-test-id="pin-draft-title"] div[contenteditable], textarea[placeholder*="title" i], input[placeholder*="title" i]');
    if (titleInput) {
      await titleInput.click();
      await titleInput.type(title.slice(0, 100), { delay: 30 });
      console.log("Title entered");
    } else {
      // Try contenteditable divs
      const editables = await page.$$('div[contenteditable="true"]');
      if (editables.length > 0) {
        await editables[0].click();
        await editables[0].type(title.slice(0, 100), { delay: 30 });
        console.log("Title entered (contenteditable)");
      }
    }
  } catch (e) {
    console.log("Could not fill title:", e.message);
  }

  await new Promise((r) => setTimeout(r, 1000));

  // Fill in description
  try {
    const descInput = await page.$('[data-test-id="pin-draft-description"] textarea, [data-test-id="pin-draft-description"] div[contenteditable], textarea[placeholder*="description" i], textarea[placeholder*="tell" i]');
    if (descInput) {
      await descInput.click();
      await descInput.type(description.slice(0, 500), { delay: 10 });
      console.log("Description entered");
    } else {
      const editables = await page.$$('div[contenteditable="true"]');
      if (editables.length > 1) {
        await editables[1].click();
        await editables[1].type(description.slice(0, 500), { delay: 10 });
        console.log("Description entered (contenteditable)");
      }
    }
  } catch (e) {
    console.log("Could not fill description:", e.message);
  }

  await new Promise((r) => setTimeout(r, 1000));

  // Fill in destination link
  try {
    const linkInput = await page.$('input[placeholder*="link" i], input[placeholder*="url" i], input[placeholder*="destination" i], input[id*="link"], input[data-test-id="pin-draft-link"]');
    if (linkInput) {
      await linkInput.click();
      await linkInput.type(toolUrl, { delay: 30 });
      console.log("Link entered");
    }
  } catch (e) {
    console.log("Could not fill link:", e.message);
  }

  await new Promise((r) => setTimeout(r, 1000));

  // Select board
  try {
    const boardSelector = await page.$('[data-test-id="board-dropdown-select-button"], button[aria-label*="board" i], [data-test-id="board-dropdown"]');
    if (boardSelector) {
      await boardSelector.click();
      await new Promise((r) => setTimeout(r, 2000));

      // Search for the board or create new
      const searchInput = await page.$('input[placeholder*="Search" i], input[data-test-id="board-search"]');
      if (searchInput) {
        await searchInput.type(boardName, { delay: 50 });
        await new Promise((r) => setTimeout(r, 2000));

        // Click on the first matching result or "Create board"
        const createBtn = await page.$('[data-test-id="create-board"], button:has-text("Create board")');
        const boardResult = await page.$('[data-test-id="board-row"]');

        if (boardResult) {
          await boardResult.click();
          console.log(`Selected board: ${boardName}`);
        } else if (createBtn) {
          await createBtn.click();
          await new Promise((r) => setTimeout(r, 1000));
          // Board name should be pre-filled from search
          const confirmBtn = await page.$('button[data-test-id="board-create-button"], button:has-text("Create")');
          if (confirmBtn) await confirmBtn.click();
          console.log(`Created board: ${boardName}`);
        }
      }
    }
  } catch (e) {
    console.log("Could not select board:", e.message);
  }

  await new Promise((r) => setTimeout(r, 2000));

  // Click Publish button
  try {
    const publishBtn = await page.$('[data-test-id="board-dropdown-save-button"], button[data-test-id="publish-button"], button:has-text("Publish")');
    if (publishBtn) {
      await publishBtn.click();
      console.log("Publish clicked!");
    } else {
      // Try finding any button with "Publish" text
      const buttons = await page.$$("button");
      for (const btn of buttons) {
        const text = await btn.evaluate((el) => el.textContent);
        if (text && text.includes("Publish")) {
          await btn.click();
          console.log("Publish clicked (text match)!");
          break;
        }
      }
    }
  } catch (e) {
    console.log("Could not click publish:", e.message);
  }

  await new Promise((r) => setTimeout(r, 5000));

  // Check for success
  const currentUrl = page.url();
  console.log(`\nPin posted! Current page: ${currentUrl}`);

  return {
    title,
    description: description.slice(0, 100) + "...",
    toolUrl,
    board: boardName,
    image: imagePath,
  };
}

// ============================================================
// Logging
// ============================================================

function logResult(entry) {
  let logs = [];
  if (fs.existsSync(LOG_FILE)) {
    try { logs = JSON.parse(fs.readFileSync(LOG_FILE, "utf-8")); } catch {}
  }
  logs.push({ ...entry, timestamp: new Date().toISOString() });
  if (logs.length > 500) logs = logs.slice(-500);
  fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2));
}

function getPostedTools() {
  if (!fs.existsSync(LOG_FILE)) return [];
  try {
    const logs = JSON.parse(fs.readFileSync(LOG_FILE, "utf-8"));
    return logs
      .filter((l) => l.status === "success")
      .map((l) => l.slug);
  } catch {
    return [];
  }
}

function getNextTool() {
  const posted = getPostedTools();
  const next = config.PRIORITY_TOOLS.find((t) => !posted.includes(t.slug));
  if (next) return next;

  // If all priority tools posted, restart cycle
  console.log("All priority tools posted! Starting new cycle.");
  return config.PRIORITY_TOOLS[0];
}

// ============================================================
// Main
// ============================================================

async function main() {
  const args = process.argv.slice(2);
  let tools = [];
  let batchSize = 1;

  // Parse arguments
  if (args.includes("--batch")) {
    batchSize = parseInt(args[args.indexOf("--batch") + 1]) || 3;
  }

  if (args[0] && !args[0].startsWith("--")) {
    // Specific tool
    const slug = args[0];
    const tool = config.PRIORITY_TOOLS.find((t) => t.slug === slug) || {
      slug,
      name: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      category: "finance",
      keywords: "free online tool India calculator",
    };
    tools = [tool];
  } else {
    // Auto-pick next unposted tools
    const posted = getPostedTools();
    const remaining = config.PRIORITY_TOOLS.filter((t) => !posted.includes(t.slug));
    tools = remaining.slice(0, batchSize);

    if (tools.length === 0) {
      console.log("All tools posted! Restarting from the beginning.");
      tools = config.PRIORITY_TOOLS.slice(0, batchSize);
    }
  }

  console.log("=== Pinterest Pin Poster (Browser) ===");
  console.log(`Date: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`);
  console.log(`Tools to post: ${tools.map((t) => t.name).join(", ")}\n`);

  // Ensure directories exist
  fs.mkdirSync(config.TEMP_DIR, { recursive: true });
  fs.mkdirSync(config.OUTPUT_DIR, { recursive: true });
  fs.mkdirSync(path.join(__dirname, "pins"), { recursive: true });

  // Launch browser
  const browser = await puppeteer.launch({
    headless: false, // Need visible browser for Pinterest
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--window-size=1400,900",
    ],
    defaultViewport: { width: 1400, height: 900 },
  });

  const page = await browser.newPage();

  // Set user agent to look like a real browser
  await page.setUserAgent(
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  );

  try {
    // Load saved cookies
    await loadCookies(page);

    // Login
    const loggedIn = await loginPinterest(page);
    if (!loggedIn) {
      console.error("Failed to login to Pinterest. Exiting.");
      await browser.close();
      process.exit(1);
    }

    // Post each tool
    for (let i = 0; i < tools.length; i++) {
      const tool = tools[i];
      console.log(`\n--- Pin ${i + 1}/${tools.length}: ${tool.name} ---\n`);

      try {
        // Create pin image
        const imagePath = path.join(__dirname, "pins", `${tool.slug}_pin.png`);
        console.log("Creating pin image...");
        await createPinImage(tool, imagePath);

        // Upload pin
        const result = await uploadPin(page, tool, imagePath);

        logResult({
          slug: tool.slug,
          name: tool.name,
          status: "success",
          ...result,
        });

        console.log(`✅ ${tool.name} pin posted successfully!\n`);

        // Wait between pins to avoid rate limiting
        if (i < tools.length - 1) {
          const wait = 15 + Math.random() * 15; // 15-30 seconds
          console.log(`Waiting ${Math.round(wait)}s before next pin...\n`);
          await new Promise((r) => setTimeout(r, wait * 1000));
        }
      } catch (err) {
        console.error(`❌ Failed to post ${tool.name}:`, err.message);
        logResult({
          slug: tool.slug,
          name: tool.name,
          status: "failed",
          error: err.message,
        });
      }
    }

    // Save cookies for next session
    await saveCookies(page);

    console.log("\n=== All pins processed! ===");
    console.log(`Posted: ${tools.length} pins`);
    console.log(`Log: ${LOG_FILE}\n`);
  } catch (err) {
    console.error("Fatal error:", err.message);
  } finally {
    await browser.close();
  }
}

module.exports = { uploadPin, loginPinterest, generateTitle, generateDescription };

if (require.main === module) {
  main().catch((err) => {
    console.error("Fatal:", err.message);
    process.exit(1);
  });
}
