/**
 * Long Video: Capture website walkthrough screenshots
 * Shows homepage, categories, and demos multiple tools with real interaction
 */

const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");
const config = require("./config");

const W = config.VIDEO_WIDTH;
const H = config.VIDEO_HEIGHT;

async function captureWebsiteWalkthrough() {
  const tempDir = config.TEMP_DIR;
  fs.mkdirSync(tempDir, { recursive: true });

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    defaultViewport: { width: W, height: H, deviceScaleFactor: 1 },
  });

  const page = await browser.newPage();
  const scenes = []; // Array of { frames: [{path, duration}], label, narration }
  let frameIndex = 0;

  async function snap(duration = 0.2) {
    frameIndex++;
    const filename = `frame_${String(frameIndex).padStart(5, "0")}.png`;
    const filepath = path.join(tempDir, filename);
    await page.screenshot({ path: filepath, type: "png" });
    return { path: filepath, duration };
  }

  // Add cursor to page
  async function addCursor() {
    await page.evaluate(() => {
      if (document.getElementById("cursor")) return;
      const cursor = document.createElement("div");
      cursor.id = "cursor";
      cursor.style.cssText = `
        position: fixed; z-index: 999999; pointer-events: none;
        width: 28px; height: 28px; border-radius: 50%;
        background: rgba(79,70,229,0.5); border: 3px solid #4f46e5;
        transform: translate(-50%, -50%); display: none;
        box-shadow: 0 0 16px rgba(79,70,229,0.4);
        transition: left 0.4s ease, top 0.4s ease;
      `;
      document.body.appendChild(cursor);
    });
  }

  // Move cursor to position
  async function moveCursor(x, y) {
    await page.evaluate((cx, cy) => {
      const c = document.getElementById("cursor");
      if (c) {
        c.style.display = "block";
        c.style.left = cx + "px";
        c.style.top = cy + "px";
      }
    }, x, y);
    await sleep(300);
  }

  // Hide cursor
  async function hideCursor() {
    await page.evaluate(() => {
      const c = document.getElementById("cursor");
      if (c) c.style.display = "none";
    });
  }

  // Clean page — remove non-essential elements
  async function cleanPage() {
    await page.evaluate(() => {
      const hide = [
        "header", "footer", "nav",
        '[class*="AdBanner"]', '[class*="ad-"]',
        '[class*="InstallPrompt"]', '[class*="SuggestTool"]',
        '[class*="AskSabTools"]', '[class*="RecentCalculations"]',
        '[class*="BackToTop"]', '[class*="KeyboardShortcuts"]',
        '[class*="ReadingProgress"]', '[class*="Breadcrumb"]',
        '[class*="EmbedCode"]', '[class*="WhatsApp"]',
        '[class*="ShareButtons"]', '[class*="FavoriteButton"]',
        '[class*="DownloadPDF"]', '[class*="ToolUsageCounter"]',
        '[class*="ReviewedBy"]', '[class*="ToolRating"]',
        '[class*="ToolFaq"]', '[class*="RelatedTools"]',
        '[class*="SEOContent"]', '[class*="seo-content"]',
      ];
      hide.forEach((sel) => {
        document.querySelectorAll(sel).forEach((el) => el.remove());
      });
    });
  }

  try {
    // ==========================================
    // SCENE 1: HOMEPAGE
    // ==========================================
    console.log("   Scene 1: Homepage...");
    await page.goto(`${config.SITE_URL}`, { waitUntil: "networkidle2", timeout: 30000 });
    await sleep(1000);

    let frames = [];
    // Hold on homepage — let viewer see it
    for (let i = 0; i < 8; i++) {
      frames.push(await snap(0.5));
    }
    // Slow scroll down to show tools listing
    for (let i = 0; i < 8; i++) {
      await page.evaluate(() => window.scrollBy(0, 200));
      await sleep(300);
      frames.push(await snap(0.4));
    }
    // Hold on tools section
    for (let i = 0; i < 4; i++) {
      frames.push(await snap(0.5));
    }
    scenes.push({
      label: "Homepage",
      narration: config.NARRATION.homepage,
      frames,
    });

    // ==========================================
    // SCENE 2: SCROLL THROUGH CATEGORIES
    // ==========================================
    console.log("   Scene 2: Categories overview...");
    // Scroll more to show categories
    frames = [];
    for (let i = 0; i < 10; i++) {
      await page.evaluate(() => window.scrollBy(0, 250));
      await sleep(300);
      frames.push(await snap(0.35));
    }
    // Hold
    for (let i = 0; i < 6; i++) {
      frames.push(await snap(0.5));
    }
    // Scroll back to top
    await page.evaluate(() => window.scrollTo(0, 0));
    await sleep(500);
    frames.push(await snap(0.5));
    frames.push(await snap(0.5));

    scenes.push({
      label: "Categories",
      narration: config.NARRATION.categories,
      frames,
    });

    // ==========================================
    // SCENE 3-8: TOOL DEMOS
    // ==========================================
    console.log("   Scene 3+: Tool demos...");
    for (const demoTool of config.DEMO_TOOLS) {
      console.log(`     Demoing: ${demoTool.name}...`);
      frames = [];

      // Navigate to tool
      const toolUrl = `${config.SITE_URL}/tools/${demoTool.slug}`;
      await page.goto(toolUrl, { waitUntil: "networkidle2", timeout: 30000 });
      await page.waitForSelector("h1", { timeout: 10000 }).catch(() => {});
      await cleanPage();
      await addCursor();
      await sleep(500);

      // Show the tool page
      for (let i = 0; i < 5; i++) {
        frames.push(await snap(0.5));
      }

      // Scroll to inputs
      await page.evaluate(() => {
        const firstInput = document.querySelector("input[type='number'], input[type='text'], input:not([type='hidden']):not([type='submit'])");
        if (firstInput) firstInput.scrollIntoView({ behavior: "instant", block: "center" });
      });
      await sleep(400);
      frames.push(await snap(0.4));

      // Find inputs and fill them
      const inputs = await findVisibleInputs(page);
      const maxInputs = Math.min(inputs.length, demoTool.values.length);

      for (let i = 0; i < maxInputs; i++) {
        const input = inputs[i];
        const value = demoTool.values[i];
        if (!value) continue;

        const box = await input.boundingBox();
        if (!box) continue;

        const cx = box.x + box.width / 2;
        const cy = box.y + box.height / 2;

        // Move cursor to input
        await moveCursor(cx, cy);
        frames.push(await snap(0.3));

        // Click input
        await input.click({ clickCount: 3 });
        await page.evaluate((x, y) => {
          const c = document.getElementById("cursor");
          if (c) { c.style.width = "20px"; c.style.height = "20px"; }
        }, cx, cy);
        await sleep(150);
        frames.push(await snap(0.2));

        // Reset cursor
        await page.evaluate(() => {
          const c = document.getElementById("cursor");
          if (c) { c.style.width = "28px"; c.style.height = "28px"; }
        });

        // Clear and type
        await page.evaluate((el) => {
          el.value = "";
          el.dispatchEvent(new Event("input", { bubbles: true }));
        }, input);

        const chars = String(value).split("");
        for (let j = 0; j < chars.length; j++) {
          await input.type(chars[j], { delay: 0 });
          if (j % 2 === 0 || j === chars.length - 1) {
            await sleep(100);
            frames.push(await snap(0.2));
          }
        }

        // Hold after typing
        frames.push(await snap(0.5));

        // Trigger events
        await page.evaluate((el) => {
          el.dispatchEvent(new Event("input", { bubbles: true }));
          el.dispatchEvent(new Event("change", { bubbles: true }));
          el.dispatchEvent(new Event("blur", { bubbles: true }));
        }, input);
      }

      // Hide cursor
      await hideCursor();

      // Click calculate button
      const btnClicked = await clickButton(page);
      if (btnClicked) {
        await sleep(400);
        frames.push(await snap(0.4));
        await sleep(800);
        frames.push(await snap(0.5));
      }

      // Wait for results
      await sleep(1000);
      frames.push(await snap(0.8));
      frames.push(await snap(0.6));

      // Scroll to show results
      for (let scroll = 0; scroll < 6; scroll++) {
        await page.evaluate(() => window.scrollBy(0, 150));
        await sleep(250);
        frames.push(await snap(0.35));
      }

      // Hold on results
      frames.push(await snap(0.8));
      frames.push(await snap(0.8));
      frames.push(await snap(0.6));

      // Scroll more if content exists
      const hasMore = await page.evaluate(() => {
        return document.body.scrollHeight - window.scrollY - window.innerHeight > 200;
      });
      if (hasMore) {
        for (let scroll = 0; scroll < 4; scroll++) {
          await page.evaluate(() => window.scrollBy(0, 180));
          await sleep(250);
          frames.push(await snap(0.3));
        }
        frames.push(await snap(0.6));
        frames.push(await snap(0.6));
      }

      scenes.push({
        label: demoTool.name,
        narration: demoTool.narration,
        frames,
      });
    }

    // ==========================================
    // SCENE: FEATURES HIGHLIGHT (homepage scroll)
    // ==========================================
    console.log("   Scene: Features...");
    frames = [];
    await page.goto(`${config.SITE_URL}`, { waitUntil: "networkidle2", timeout: 30000 });
    await sleep(500);

    // Scroll to bottom features section
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight - window.innerHeight));
    await sleep(800);
    for (let i = 0; i < 8; i++) {
      frames.push(await snap(0.6));
    }
    scenes.push({
      label: "Features",
      narration: config.NARRATION.features,
      frames,
    });

  } catch (err) {
    console.error("   Capture error:", err.message);
  } finally {
    await browser.close();
  }

  const totalFrames = scenes.reduce((sum, s) => sum + s.frames.length, 0);
  console.log(`   Total: ${totalFrames} frames across ${scenes.length} scenes`);

  return scenes;
}

async function findVisibleInputs(page) {
  const allInputs = await page.$$("input, select, textarea");
  const visible = [];
  for (const input of allInputs) {
    const info = await page.evaluate((el) => {
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      if (rect.width === 0 || rect.height === 0) return null;
      if (style.display === "none" || style.visibility === "hidden") return null;
      if (el.type === "hidden" || el.type === "submit" || el.type === "button" || el.type === "checkbox" || el.type === "radio" || el.type === "file") return null;
      return { type: el.type };
    }, input);
    if (info) visible.push(input);
  }
  return visible;
}

async function clickButton(page) {
  try {
    return await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button, input[type='submit']"));
      const keywords = ["calculate", "convert", "generate", "check", "compute", "submit", "find", "search"];
      for (const btn of buttons) {
        const text = (btn.textContent || btn.value || "").toLowerCase();
        if (keywords.some((kw) => text.includes(kw))) {
          btn.click();
          return true;
        }
      }
      const primary = document.querySelector("button[type='submit'], button.bg-indigo, button.bg-blue, button[class*='primary']");
      if (primary) { primary.click(); return true; }
      return false;
    });
  } catch { return false; }
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

module.exports = { captureWebsiteWalkthrough };
