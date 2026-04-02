/**
 * Step 2: Screen-record style capture using rapid Puppeteer screenshots
 * Takes screenshots every ~200ms during real interaction to simulate screen recording
 */

const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");
const config = require("./config");

async function captureScreens(tool, demoValues) {
  const tempDir = config.TEMP_DIR;
  fs.mkdirSync(tempDir, { recursive: true });

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    defaultViewport: {
      width: 1080,
      height: 1920,
      deviceScaleFactor: 1,
    },
  });

  const page = await browser.newPage();
  const frames = []; // Array of {path, duration} — duration in seconds per frame
  let frameIndex = 0;

  async function snap(duration = 0.2) {
    frameIndex++;
    const filename = `frame_${String(frameIndex).padStart(4, "0")}.png`;
    const filepath = path.join(tempDir, filename);
    await page.screenshot({ path: filepath, type: "png" });
    frames.push({ path: filepath, duration });
    return filepath;
  }

  try {
    const toolUrl = `${config.SITE_URL}/tools/${tool.slug}`;
    await page.goto(toolUrl, { waitUntil: "networkidle2", timeout: 30000 });
    await page.waitForSelector("h1", { timeout: 10000 });

    // Clean up page — hide non-tool elements
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
      document.body.style.background = "#ffffff";

      // Add animated cursor
      const cursor = document.createElement("div");
      cursor.id = "cursor";
      cursor.style.cssText = `
        position: fixed; z-index: 999999; pointer-events: none;
        width: 24px; height: 24px; border-radius: 50%;
        background: rgba(79,70,229,0.5); border: 3px solid #4f46e5;
        transform: translate(-50%, -50%); display: none;
        box-shadow: 0 0 12px rgba(79,70,229,0.3);
        transition: left 0.3s ease, top 0.3s ease;
      `;
      document.body.appendChild(cursor);
    });

    // Frame 1-5: Show the tool page (hold for ~3s)
    await snap(0.8);
    await snap(0.6);
    await snap(0.6);
    await snap(0.5);
    await snap(0.5);

    // Scroll to bring inputs into view
    await page.evaluate(() => {
      const firstInput = document.querySelector("input[type='number'], input[type='text'], input:not([type='hidden']):not([type='submit'])");
      if (firstInput) {
        firstInput.scrollIntoView({ behavior: "instant", block: "center" });
      }
    });
    await sleep(300);
    await snap(0.3);

    // Find visible input fields
    const inputs = await findVisibleInputs(page);
    const values = getValues(tool, demoValues, inputs.length);

    console.log(`   Found ${inputs.length} inputs, will fill ${Math.min(inputs.length, 4)} fields`);

    // Fill each input field with character-by-character typing
    const maxInputs = Math.min(inputs.length, 4);

    for (let i = 0; i < maxInputs; i++) {
      const input = inputs[i];
      const value = values[i];
      if (!value) continue;

      // Move cursor to the input field
      const box = await input.boundingBox();
      if (!box) continue;

      const cx = box.x + box.width / 2;
      const cy = box.y + box.height / 2;

      // Animate cursor moving to input
      await page.evaluate((x, y) => {
        const c = document.getElementById("cursor");
        c.style.display = "block";
        c.style.left = x + "px";
        c.style.top = y + "px";
      }, cx, cy);
      await sleep(300);
      await snap(0.3);

      // Click the input — show highlight
      await input.click({ clickCount: 3 });
      await page.evaluate((x, y) => {
        const c = document.getElementById("cursor");
        c.style.width = "18px";
        c.style.height = "18px";
        c.style.left = x + "px";
        c.style.top = y + "px";
      }, cx, cy);
      await sleep(150);
      await snap(0.15);

      // Reset cursor size
      await page.evaluate(() => {
        const c = document.getElementById("cursor");
        c.style.width = "24px";
        c.style.height = "24px";
      });

      // Clear existing value
      await page.evaluate((el) => { el.value = ""; el.dispatchEvent(new Event("input", { bubbles: true })); }, input);

      // Type value character by character with screenshots
      const chars = String(value).split("");
      for (let j = 0; j < chars.length; j++) {
        await input.type(chars[j], { delay: 0 });
        // Take screenshot every 1-2 characters to keep frame count manageable
        if (j % 2 === 0 || j === chars.length - 1) {
          await sleep(120);
          await snap(0.2);
        }
      }

      // Pause after finishing this input — let viewer read the value
      await snap(0.5);
      await snap(0.4);

      // Trigger calculation events
      await page.evaluate((el) => {
        el.dispatchEvent(new Event("input", { bubbles: true }));
        el.dispatchEvent(new Event("change", { bubbles: true }));
        el.dispatchEvent(new Event("blur", { bubbles: true }));
      }, input);
    }

    // Hide cursor
    await page.evaluate(() => {
      const c = document.getElementById("cursor");
      if (c) c.style.display = "none";
    });

    // Try clicking Calculate button
    const btnClicked = await clickButton(page);
    if (btnClicked) {
      await sleep(300);
      await snap(0.3);
      await sleep(800);
      await snap(0.5);
      await snap(0.5);
    }

    // Wait for results — hold longer so viewer can read
    await sleep(1000);
    await snap(0.8);
    await snap(0.8);
    await snap(0.6);

    // Scroll down smoothly to show results
    for (let scroll = 0; scroll < 6; scroll++) {
      await page.evaluate(() => window.scrollBy(0, 120));
      await sleep(250);
      await snap(0.3);
    }

    // Hold on results — give viewer time to read
    await snap(0.8);
    await snap(0.8);
    await snap(0.6);
    await snap(0.6);

    // Scroll more if there are charts/tables
    const hasMore = await page.evaluate(() => {
      return document.body.scrollHeight - window.scrollY - window.innerHeight > 200;
    });

    if (hasMore) {
      for (let scroll = 0; scroll < 5; scroll++) {
        await page.evaluate(() => window.scrollBy(0, 150));
        await sleep(250);
        await snap(0.3);
      }
      await snap(0.8);
      await snap(0.6);
      await snap(0.6);
    }

  } catch (err) {
    console.error("Capture error:", err.message);
    if (frames.length === 0) {
      try { await snap(1); } catch {}
    }
  } finally {
    await browser.close();
  }

  console.log(`   Captured ${frames.length} frames (screen recording style)`);
  return frames;
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
      return { type: el.type, name: el.name, id: el.id };
    }, input);
    if (info) visible.push(input);
  }

  return visible;
}

function getValues(tool, demoValues, numInputs) {
  // Use provided demo values
  if (demoValues && Object.keys(demoValues).length > 0) {
    return Object.values(demoValues).map(String);
  }

  // Tool-specific realistic values
  const toolValues = {
    "emi-calculator": ["2500000", "8.5", "20"],
    "sip-calculator": ["5000", "12", "10"],
    "fd-calculator": ["100000", "7.5", "5"],
    "rd-calculator": ["5000", "7", "3"],
    "ppf-calculator": ["150000", "7.1", "15"],
    "gst-calculator": ["10000", "18"],
    "income-tax-calculator": ["1200000"],
    "salary-calculator": ["50000"],
    "percentage-calculator": ["750", "25"],
    "bmi-calculator": ["170", "70"],
    "age-calculator": ["1995-06-15"],
    "compound-interest-calculator": ["100000", "8", "5"],
    "simple-interest-calculator": ["50000", "10", "3"],
    "discount-calculator": ["2999", "30"],
    "home-loan-calculator": ["5000000", "8.5", "20"],
    "love-calculator": ["Rahul", "Priya"],
    "word-counter": ["SabTools provides 460 free online tools"],
    "json-formatter": ['{"name":"SabTools","tools":460}'],
    "image-compressor": [],
    "qr-code-generator": ["https://sabtools.in"],
    "password-generator": ["16"],
  };

  if (toolValues[tool.slug]) return toolValues[tool.slug];

  // Generic fallback
  return ["10000", "12", "5", "100"].slice(0, numInputs);
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
      // Try first prominent button
      const primary = document.querySelector("button[type='submit'], button.bg-indigo, button.bg-blue, button[class*='primary']");
      if (primary) { primary.click(); return true; }
      return false;
    });
  } catch { return false; }
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

module.exports = { captureScreens };
