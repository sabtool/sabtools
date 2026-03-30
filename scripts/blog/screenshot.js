#!/usr/bin/env node

/**
 * Screenshot Generator
 * 1. Reads .current-tool.json to know which tool to screenshot
 * 2. Launches Puppeteer, navigates to live tool page
 * 3. Captures screenshot, optimizes with Sharp to WebP (1200x630)
 * 4. Saves to public/blog/{slug}.webp
 *
 * Fallback: If screenshot fails, copies a category placeholder image.
 */

const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");

const ROOT = path.join(__dirname, "..", "..");
const CURRENT_TOOL_FILE = path.join(__dirname, ".current-tool.json");
const BLOG_IMAGE_DIR = path.join(ROOT, "public", "blog");

const TARGET_WIDTH = 1200;
const TARGET_HEIGHT = 630;

// ─── Ensure output directory exists ───
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// ─── Take screenshot of live tool page ───
async function captureScreenshot(slug) {
  const url = `https://sabtools.in/tools/${slug}`;
  console.log(`   Navigating to: ${url}`);

  const browser = await puppeteer.launch({
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
    ],
  });

  try {
    const page = await browser.newPage();

    // Set viewport to desktop size
    await page.setViewport({ width: 1280, height: 800 });

    // Navigate and wait for page to fully load
    await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: 30000,
    });

    // Wait extra 2s for hydration and animations
    await new Promise((r) => setTimeout(r, 2000));

    // Remove header, footer, ads, and cookie banners for a clean screenshot
    await page.evaluate(() => {
      const selectors = [
        "header",
        "nav",
        "footer",
        ".cookie-banner",
        ".ad-container",
        "[class*='cookie']",
        "[class*='banner']",
        "[id*='cookie']",
        "[class*='popup']",
        "[class*='modal']",
      ];
      selectors.forEach((sel) => {
        document.querySelectorAll(sel).forEach((el) => {
          el.style.display = "none";
        });
      });
    });

    // Try to find and screenshot just the tool area
    const toolContainer = await page.$("main") || await page.$("[class*='tool']") || await page.$("#__next");

    const rawScreenshotPath = path.join(BLOG_IMAGE_DIR, `${slug}-raw.png`);

    if (toolContainer) {
      await toolContainer.screenshot({ path: rawScreenshotPath });
    } else {
      await page.screenshot({ path: rawScreenshotPath, fullPage: false });
    }

    console.log(`   Raw screenshot saved: ${rawScreenshotPath}`);
    return rawScreenshotPath;
  } finally {
    await browser.close();
  }
}

// ─── Optimize image with Sharp → WebP 1200x630 ───
async function optimizeImage(inputPath, outputPath) {
  let sharp;
  try {
    sharp = require("sharp");
  } catch (e) {
    // If sharp is not available, just copy the raw PNG and rename
    console.log("   Sharp not available — using raw screenshot as fallback");
    fs.copyFileSync(inputPath, outputPath.replace(".webp", ".png"));
    // Clean up raw
    if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
    return outputPath.replace(".webp", ".png");
  }

  await sharp(inputPath)
    .resize(TARGET_WIDTH, TARGET_HEIGHT, {
      fit: "cover",
      position: "top",
    })
    .webp({ quality: 82 })
    .toFile(outputPath);

  console.log(`   Optimized WebP saved: ${outputPath}`);

  // Clean up raw PNG
  if (fs.existsSync(inputPath)) {
    fs.unlinkSync(inputPath);
  }

  return outputPath;
}

// ─── Generate a simple SVG placeholder as fallback ───
function generatePlaceholder(slug, toolName, category) {
  const colors = {
    finance: "#2563eb",
    math: "#7c3aed",
    text: "#059669",
    developer: "#dc2626",
    image: "#ea580c",
    seo: "#0891b2",
    health: "#16a34a",
    tax: "#4f46e5",
    converters: "#0d9488",
    security: "#b91c1c",
    pdf: "#e11d48",
    default: "#6366f1",
  };

  const bgColor = colors[category] || colors.default;
  const displayName = toolName || slug.replace(/-/g, " ");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${TARGET_WIDTH}" height="${TARGET_HEIGHT}" viewBox="0 0 ${TARGET_WIDTH} ${TARGET_HEIGHT}">
  <rect width="100%" height="100%" fill="${bgColor}"/>
  <rect x="40" y="40" width="${TARGET_WIDTH - 80}" height="${TARGET_HEIGHT - 80}" rx="20" fill="white" opacity="0.15"/>
  <text x="50%" y="42%" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="52" font-weight="700" fill="white">${displayName}</text>
  <text x="50%" y="58%" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="28" fill="white" opacity="0.8">Free Online Tool — SabTools.in</text>
  <text x="50%" y="72%" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="20" fill="white" opacity="0.6">460+ Free Tools for India</text>
</svg>`;

  return svg;
}

// ─── Main ───
async function main() {
  console.log("=== Screenshot Generator ===");

  // Read current tool info
  if (!fs.existsSync(CURRENT_TOOL_FILE)) {
    console.log("No .current-tool.json found. Run generate-blog.js first.");
    process.exit(0);
  }

  const toolInfo = JSON.parse(fs.readFileSync(CURRENT_TOOL_FILE, "utf-8"));
  console.log(`Tool: ${toolInfo.name} (${toolInfo.slug})`);

  ensureDir(BLOG_IMAGE_DIR);

  const outputPath = path.join(BLOG_IMAGE_DIR, `${toolInfo.slug}.webp`);

  try {
    // Capture screenshot from live site
    console.log("\n1. Capturing screenshot...");
    const rawPath = await captureScreenshot(toolInfo.slug);

    // Optimize to WebP
    console.log("\n2. Optimizing image...");
    await optimizeImage(rawPath, outputPath);

    console.log(`\n✓ Screenshot ready: public/blog/${toolInfo.slug}.webp`);
  } catch (err) {
    console.error(`\n✗ Screenshot failed: ${err.message}`);
    console.log("   Generating SVG placeholder instead...");

    // Save SVG placeholder
    const svgPath = path.join(BLOG_IMAGE_DIR, `${toolInfo.slug}.svg`);
    const svg = generatePlaceholder(toolInfo.slug, toolInfo.name, toolInfo.category);
    fs.writeFileSync(svgPath, svg);

    // Also try to convert SVG to WebP with Sharp if available
    try {
      const sharp = require("sharp");
      await sharp(Buffer.from(svg))
        .resize(TARGET_WIDTH, TARGET_HEIGHT)
        .webp({ quality: 82 })
        .toFile(outputPath);
      // Remove SVG if WebP conversion succeeded
      fs.unlinkSync(svgPath);
      console.log(`   Placeholder WebP saved: public/blog/${toolInfo.slug}.webp`);
    } catch (e) {
      console.log(`   SVG placeholder saved: public/blog/${toolInfo.slug}.svg`);
      // Update blog.ts image path to use .svg
      const blogFile = path.join(ROOT, "src", "lib", "blog.ts");
      let blogContent = fs.readFileSync(blogFile, "utf-8");
      blogContent = blogContent.replace(
        `/blog/${toolInfo.slug}.webp`,
        `/blog/${toolInfo.slug}.svg`
      );
      fs.writeFileSync(blogFile, blogContent);
    }
  }

  console.log("\n=== Screenshot step complete ===");
}

main().catch((err) => {
  console.error("Screenshot generation failed:", err);
  process.exit(1);
});
