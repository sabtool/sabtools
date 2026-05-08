#!/usr/bin/env node

/**
 * FULLY AUTOMATED Pinterest Pin Poster
 * Uses Chrome user profile to skip login (already logged in via Google)
 * Posts pins with image, title, description, link, board, tags, alt text
 *
 * Usage:
 *   node auto-post.js                     # Post next unposted tool
 *   node auto-post.js emi-calculator      # Post specific tool
 *   node auto-post.js --batch 3           # Post 3 pins
 *   node auto-post.js --all               # Post all remaining
 */

const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const config = require("./config");

const LOG_FILE = path.join(__dirname, "pin-log.json");
const PINS_DIR = path.join(config.ROOT, "output", "pinterest");

// Puppeteer's own profile — run setup-login.js once to save session
const CHROME_USER_DATA = path.join(__dirname, "puppeteer-profile");

// ============================================================
// SEO Content for each tool
// ============================================================

const TOOL_SEO = {};
config.PRIORITY_TOOLS.forEach((tool) => {
  TOOL_SEO[tool.slug] = {
    title: `FREE ${tool.name} Online — No Signup Needed!`,
    description: generateDescription(tool),
    link: `https://sabtools.in/tools/${tool.slug}`,
    board: getBoardName(tool.category),
    tags: getTagsForCategory(tool.category),
    altText: `Free ${tool.name} online tool at SabTools.in — ${tool.keywords}. 100% free, no signup required, works on mobile and desktop.`,
  };
});

function generateDescription(tool) {
  return `Use this FREE ${tool.name} online at SabTools.in! No signup needed — works instantly on mobile and desktop.

Features:
✅ 100% Free — No hidden charges
✅ No Signup or Download Required
✅ Works on Mobile & Desktop
✅ Instant Accurate Results

${tool.keywords}

Try it now: https://sabtools.in/tools/${tool.slug}

497+ Free Online Tools at SabTools.in
#${tool.slug.replace(/-/g, "")} #freetool #onlinetool #india #calculator #sabtools`;
}

function getBoardName(category) {
  const boards = {
    finance: "Free Finance Calculators India",
    education: "Free Education Tools India",
    health: "Free Health Calculators",
    developer: "Free Developer Tools Online",
    text: "Free Text Tools Online",
    image: "Free Image Tools Online",
    pdf: "Free PDF Tools Online",
    qrcode: "Free QR Code Tools",
    conversion: "Free Conversion Tools",
    math: "Free Math Calculators",
    fun: "Free Fun Tools Online",
    everyday: "Free Everyday Tools India",
  };
  return boards[category] || "Free Online Tools India";
}

function getTagsForCategory(category) {
  const tags = {
    finance: ["Personal Finance", "Money"],
    education: ["Education", "Study Tips"],
    health: ["Health", "Fitness"],
    developer: ["Web Development", "Coding"],
    text: ["Writing", "Content"],
    image: ["Photography", "Design"],
    fun: ["Fun", "Entertainment"],
    everyday: ["Life Hacks", "Productivity"],
    math: ["Mathematics", "Education"],
  };
  return tags[category] || ["Free Tools", "Online Tools"];
}

// ============================================================
// Logging
// ============================================================

function getLog() {
  if (!fs.existsSync(LOG_FILE)) return [];
  try { return JSON.parse(fs.readFileSync(LOG_FILE, "utf-8")); } catch { return []; }
}

function saveLog(logs) {
  if (logs.length > 500) logs = logs.slice(-500);
  fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2));
}

function logResult(entry) {
  const logs = getLog();
  logs.push({ ...entry, timestamp: new Date().toISOString() });
  saveLog(logs);
}

function getPostedSlugs() {
  return getLog().filter((l) => l.status === "success").map((l) => l.slug);
}

function getNextTools(count = 1) {
  const posted = getPostedSlugs();
  const remaining = config.PRIORITY_TOOLS.filter((t) => !posted.includes(t.slug));
  if (remaining.length === 0) {
    console.log("All tools posted! Restarting cycle.");
    return config.PRIORITY_TOOLS.slice(0, count);
  }
  return remaining.slice(0, count);
}

// ============================================================
// Browser automation
// ============================================================

async function launchBrowser() {
  console.log("Launching Chrome with saved profile...");
  console.log(`Profile: ${CHROME_USER_DATA}`);

  const browser = await puppeteer.launch({
    headless: "new",
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

  return browser;
}

async function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function postPin(page, tool) {
  const seo = TOOL_SEO[tool.slug];
  if (!seo) {
    console.error(`No SEO data for ${tool.slug}`);
    return false;
  }

  const imagePath = path.join(PINS_DIR, `${tool.slug}_pin.png`);
  if (!fs.existsSync(imagePath)) {
    console.log(`Pin image not found for ${tool.slug}, generating...`);
    const { createPinImage } = require("./create-pin-sharp");
    await createPinImage(tool, imagePath);
  }

  console.log(`\n=== Posting: ${tool.name} ===`);
  console.log(`Title: ${seo.title}`);
  console.log(`Link: ${seo.link}`);
  console.log(`Board: ${seo.board}`);

  // Navigate to pin creation
  await page.goto("https://www.pinterest.com/pin-creation-tool/", {
    waitUntil: "networkidle2",
    timeout: 30000,
  });
  await delay(3000);

  // Check if logged in
  const url = page.url();
  if (url.includes("/login")) {
    console.error("Not logged in! Please login to Pinterest in Chrome first.");
    return false;
  }

  // Upload image via file input
  const fileInput = await page.waitForSelector('input[type="file"]', { timeout: 10000 });
  if (fileInput) {
    await fileInput.uploadFile(imagePath);
    console.log("✅ Image uploaded");
  } else {
    console.error("Could not find file input");
    return false;
  }
  await delay(4000);

  // Fill title
  try {
    const titleInput = await page.waitForSelector(
      'input[placeholder="Add a title"], [data-test-id="pin-draft-title"] input',
      { timeout: 5000 }
    );
    if (titleInput) {
      await titleInput.click({ clickCount: 3 });
      await titleInput.type(seo.title.slice(0, 100), { delay: 20 });
      console.log("✅ Title added");
    }
  } catch {
    // Try alternative: find by aria label
    try {
      await page.evaluate((title) => {
        const inputs = document.querySelectorAll('input[type="text"]');
        for (const inp of inputs) {
          if (inp.placeholder && inp.placeholder.toLowerCase().includes("title")) {
            inp.focus();
            inp.value = title;
            inp.dispatchEvent(new Event("input", { bubbles: true }));
            break;
          }
        }
      }, seo.title.slice(0, 100));
      console.log("✅ Title added (alt)");
    } catch (e) {
      console.log("⚠️ Could not set title:", e.message);
    }
  }
  await delay(1000);

  // Fill description
  try {
    const descArea = await page.$('[contenteditable="true"], textarea[placeholder*="description" i]');
    if (descArea) {
      await descArea.click();
      await descArea.type(seo.description.slice(0, 500), { delay: 5 });
      console.log("✅ Description added");
    } else {
      // Try finding by role
      const editables = await page.$$('div[contenteditable="true"]');
      if (editables.length > 0) {
        // First editable is usually the description
        for (const el of editables) {
          const placeholder = await el.evaluate((e) => e.getAttribute("data-placeholder") || e.textContent);
          if (placeholder && (placeholder.includes("description") || placeholder.includes("detail"))) {
            await el.click();
            await el.type(seo.description.slice(0, 500), { delay: 5 });
            console.log("✅ Description added (editable)");
            break;
          }
        }
      }
    }
  } catch (e) {
    console.log("⚠️ Could not set description:", e.message);
  }
  await delay(1000);

  // Fill link
  try {
    const linkInput = await page.waitForSelector(
      'input[placeholder="Add a link"], input[type="url"]',
      { timeout: 5000 }
    );
    if (linkInput) {
      await linkInput.click({ clickCount: 3 });
      await linkInput.type(seo.link, { delay: 20 });
      console.log("✅ Link added");
    }
  } catch {
    try {
      await page.evaluate((link) => {
        const inputs = document.querySelectorAll('input[type="url"], input[placeholder*="link" i]');
        for (const inp of inputs) {
          inp.focus();
          inp.value = link;
          inp.dispatchEvent(new Event("input", { bubbles: true }));
          inp.dispatchEvent(new Event("change", { bubbles: true }));
          break;
        }
      }, seo.link);
      console.log("✅ Link added (alt)");
    } catch (e) {
      console.log("⚠️ Could not set link:", e.message);
    }
  }
  await delay(1000);

  // Select/create board
  try {
    const boardBtn = await page.$('button[data-test-id="board-dropdown-select-button"], [class*="board"] button');
    if (!boardBtn) {
      // Click on "Choose a board" dropdown
      const boardDropdown = await page.evaluateHandle(() => {
        const els = document.querySelectorAll("button, div[role='button']");
        for (const el of els) {
          if (el.textContent.includes("Choose a board") || el.textContent.includes("board")) {
            return el;
          }
        }
        return null;
      });
      if (boardDropdown) await boardDropdown.click();
    } else {
      await boardBtn.click();
    }
    await delay(2000);

    // Search for the board
    const searchInput = await page.$('input[placeholder*="Search" i]');
    if (searchInput) {
      await searchInput.type(seo.board, { delay: 30 });
      await delay(2000);

      // Click first result or create board
      const boardResult = await page.$('[data-test-id="board-row"], [role="option"]');
      if (boardResult) {
        await boardResult.click();
        console.log(`✅ Board selected: ${seo.board}`);
      } else {
        // Create new board
        const createBtn = await page.evaluateHandle(() => {
          const els = document.querySelectorAll("button, div[role='button']");
          for (const el of els) {
            if (el.textContent.includes("Create board") || el.textContent.includes("Create")) {
              return el;
            }
          }
          return null;
        });
        if (createBtn) {
          await createBtn.click();
          await delay(1000);
          // Confirm creation
          const confirmBtn = await page.evaluateHandle(() => {
            const btns = document.querySelectorAll("button");
            for (const b of btns) {
              if (b.textContent.trim() === "Create") return b;
            }
            return null;
          });
          if (confirmBtn) await confirmBtn.click();
          console.log(`✅ Board created: ${seo.board}`);
        }
      }
    }
  } catch (e) {
    console.log("⚠️ Board selection skipped:", e.message);
  }
  await delay(2000);

  // Expand "More options" for alt text
  try {
    const moreOptions = await page.evaluateHandle(() => {
      const els = document.querySelectorAll("button, div[role='button'], summary");
      for (const el of els) {
        if (el.textContent.includes("More options")) return el;
      }
      return null;
    });
    if (moreOptions) {
      await moreOptions.click();
      await delay(1000);
    }

    // Fill alt text
    const altInput = await page.evaluateHandle(() => {
      const textareas = document.querySelectorAll("textarea");
      for (const ta of textareas) {
        if (ta.placeholder && ta.placeholder.toLowerCase().includes("visual")) return ta;
      }
      return null;
    });
    if (altInput) {
      await altInput.click();
      await altInput.type(seo.altText.slice(0, 500), { delay: 5 });
      console.log("✅ Alt text added");
    }
  } catch (e) {
    console.log("⚠️ Alt text skipped:", e.message);
  }
  await delay(1000);

  // Click Publish
  try {
    const publishBtn = await page.evaluateHandle(() => {
      const btns = document.querySelectorAll("button");
      for (const b of btns) {
        if (b.textContent.trim() === "Publish") return b;
      }
      return null;
    });

    if (publishBtn) {
      await publishBtn.click();
      console.log("✅ Publish clicked!");
      await delay(5000);

      // Verify success
      const currentUrl = page.url();
      console.log(`Published! Page: ${currentUrl}`);
      return true;
    } else {
      console.log("⚠️ Publish button not found");
      return false;
    }
  } catch (e) {
    console.log("⚠️ Publish failed:", e.message);
    return false;
  }
}

// ============================================================
// Main
// ============================================================

async function main() {
  const args = process.argv.slice(2);
  let tools = [];

  if (args.includes("--all")) {
    tools = getNextTools(100);
  } else if (args.includes("--batch")) {
    const count = parseInt(args[args.indexOf("--batch") + 1]) || 2;
    tools = getNextTools(count);
  } else if (args[0] && !args[0].startsWith("--")) {
    const slug = args[0];
    const tool = config.PRIORITY_TOOLS.find((t) => t.slug === slug) || {
      slug,
      name: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      category: "finance",
      keywords: "free online tool calculator India",
    };
    tools = [tool];
  } else {
    tools = getNextTools(2); // Default: post 2 pins
  }

  if (tools.length === 0) {
    console.log("No tools to post!");
    return;
  }

  console.log("=== Pinterest Auto-Poster ===");
  console.log(`Date: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`);
  console.log(`Tools: ${tools.map((t) => t.name).join(", ")}\n`);

  let browser;
  try {
    browser = await launchBrowser();
    const page = await browser.newPage();

    // Set user agent
    await page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );

    let successCount = 0;

    for (let i = 0; i < tools.length; i++) {
      const tool = tools[i];
      console.log(`\n--- [${i + 1}/${tools.length}] ${tool.name} ---`);

      try {
        const success = await postPin(page, tool);
        if (success) {
          successCount++;
          logResult({
            slug: tool.slug,
            name: tool.name,
            status: "success",
            link: `https://sabtools.in/tools/${tool.slug}`,
          });
          console.log(`✅ ${tool.name} posted successfully!`);
        } else {
          logResult({
            slug: tool.slug,
            name: tool.name,
            status: "failed",
            error: "Post failed",
          });
        }
      } catch (err) {
        console.error(`❌ ${tool.name} failed:`, err.message);
        logResult({
          slug: tool.slug,
          name: tool.name,
          status: "failed",
          error: err.message,
        });
      }

      // Wait between pins (30-60s random delay to look natural)
      if (i < tools.length - 1) {
        const wait = 30 + Math.floor(Math.random() * 30);
        console.log(`\nWaiting ${wait}s before next pin...`);
        await delay(wait * 1000);
      }
    }

    console.log(`\n=== Done! Posted ${successCount}/${tools.length} pins ===`);
  } catch (err) {
    console.error("Fatal:", err.message);
  } finally {
    if (browser) await browser.close();
  }
}

module.exports = { postPin, launchBrowser };

if (require.main === module) {
  main().catch((err) => {
    console.error("Fatal:", err.message);
    process.exit(1);
  });
}
