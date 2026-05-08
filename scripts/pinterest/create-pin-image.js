#!/usr/bin/env node

/**
 * Creates Pinterest-optimized pin images (1000x1500, 2:3 ratio)
 * - Takes screenshot of the tool page
 * - Adds branded overlay with title, CTA, and branding
 * - Professional design with gradient backgrounds
 */

const puppeteer = require("puppeteer");
const { createCanvas, loadImage, registerFont } = require("canvas");
const fs = require("fs");
const path = require("path");
const config = require("./config");

// Color schemes for different categories
const CATEGORY_COLORS = {
  finance: { primary: "#1a73e8", secondary: "#4285f4", accent: "#fbbc04" },
  education: { primary: "#0f9d58", secondary: "#34a853", accent: "#fbbc04" },
  health: { primary: "#ea4335", secondary: "#ff6b6b", accent: "#ffffff" },
  developer: { primary: "#673ab7", secondary: "#9c27b0", accent: "#00bcd4" },
  text: { primary: "#ff6f00", secondary: "#ff9800", accent: "#ffffff" },
  image: { primary: "#e91e63", secondary: "#f06292", accent: "#ffffff" },
  pdf: { primary: "#d32f2f", secondary: "#ef5350", accent: "#ffffff" },
  qrcode: { primary: "#00695c", secondary: "#009688", accent: "#ffffff" },
  conversion: { primary: "#0277bd", secondary: "#03a9f4", accent: "#ffffff" },
  math: { primary: "#283593", secondary: "#3f51b5", accent: "#ffeb3b" },
  fun: { primary: "#ad1457", secondary: "#e91e63", accent: "#ffeb3b" },
  everyday: { primary: "#2e7d32", secondary: "#4caf50", accent: "#ffffff" },
};

async function captureToolScreenshot(tool, outputPath) {
  const url = `${config.SITE_URL}/tools/${tool.slug}`;
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--force-device-scale-factor=2"],
  });

  try {
    const page = await browser.newPage();
    // High-res viewport with 2x device scale for crisp screenshot
    await page.setViewport({ width: 1400, height: 1000, deviceScaleFactor: 2 });
    await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });

    // Wait for tool content to load
    await new Promise((r) => setTimeout(r, 3000));

    // Hide nav/footer and enhance readability
    await page.evaluate(() => {
      const nav = document.querySelector("nav, header, .navbar");
      const footer = document.querySelector("footer");
      if (nav) nav.style.display = "none";
      if (footer) footer.style.display = "none";
      // Make text sharper
      document.body.style.webkitFontSmoothing = "antialiased";
      document.body.style.textRendering = "optimizeLegibility";
    });

    await page.screenshot({ path: outputPath, type: "png", captureBeyondViewport: false });
    return outputPath;
  } finally {
    await browser.close();
  }
}

async function createPinImage(tool, outputPath) {
  // 2x resolution for crisp output
  const SCALE = 2;
  const W = config.PIN_WIDTH * SCALE;   // 2000px
  const H = config.PIN_HEIGHT * SCALE;  // 3000px
  const colors = CATEGORY_COLORS[tool.category] || CATEGORY_COLORS.finance;

  // Capture tool screenshot first
  const screenshotPath = path.join(config.TEMP_DIR, `${tool.slug}_screenshot.png`);
  fs.mkdirSync(config.TEMP_DIR, { recursive: true });
  await captureToolScreenshot(tool, screenshotPath);

  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext("2d");

  // === Background gradient ===
  const gradient = ctx.createLinearGradient(0, 0, 0, H);
  gradient.addColorStop(0, colors.primary);
  gradient.addColorStop(0.35, colors.secondary);
  gradient.addColorStop(1, "#0d1117");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, W, H);

  // === Subtle pattern overlay ===
  ctx.globalAlpha = 0.05;
  ctx.fillStyle = "#ffffff";
  for (let i = 0; i < 20; i++) {
    const x = Math.random() * W;
    const y = Math.random() * H;
    const r = 20 + Math.random() * 80;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // === Decorative circles ===
  ctx.globalAlpha = 0.08;
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(-100, 200, 400, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(W + 100, 800, 500, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  // === "FREE" badge at top ===
  const badgeY = 80 * SCALE;
  ctx.fillStyle = colors.accent;
  roundRect(ctx, W / 2 - 160, badgeY - 20, 320, 90, 45);
  ctx.fill();
  // Badge shadow
  ctx.shadowColor = "rgba(0,0,0,0.3)";
  ctx.shadowBlur = 20;
  ctx.shadowOffsetY = 5;
  ctx.fillStyle = colors.accent;
  roundRect(ctx, W / 2 - 160, badgeY - 20, 320, 90, 45);
  ctx.fill();
  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  ctx.fillStyle = colors.primary;
  ctx.font = `bold ${48}px Arial, Helvetica, sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText("100% FREE", W / 2, badgeY + 42);

  // === Tool name (large) ===
  ctx.fillStyle = "#ffffff";
  ctx.font = `bold ${96}px Arial, Helvetica, sans-serif`;
  ctx.textAlign = "center";
  // Text shadow for readability
  ctx.shadowColor = "rgba(0,0,0,0.4)";
  ctx.shadowBlur = 10;
  const titleLines = wrapText(ctx, tool.name, W - 200);
  let titleY = badgeY + 160;
  titleLines.forEach((line) => {
    ctx.fillText(line, W / 2, titleY);
    titleY += 110;
  });
  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;

  // === Subtitle ===
  ctx.font = `${44}px Arial, Helvetica, sans-serif`;
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.fillText("No Signup Required!", W / 2, titleY + 20);

  // === Tool screenshot in rounded frame ===
  try {
    const screenshot = await loadImage(screenshotPath);
    const imgX = 80;
    const imgY = titleY + 80;
    const imgW = W - 160;
    const imgH = 1000;

    // Shadow behind frame
    ctx.shadowColor = "rgba(0,0,0,0.5)";
    ctx.shadowBlur = 40;
    ctx.shadowOffsetY = 15;
    ctx.fillStyle = "#ffffff";
    roundRect(ctx, imgX - 4, imgY - 4, imgW + 8, imgH + 8, 30);
    ctx.fill();
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    // Clip and draw screenshot
    ctx.save();
    roundRectPath(ctx, imgX, imgY, imgW, imgH, 24);
    ctx.clip();
    // Scale screenshot to fill the frame properly
    const srcAspect = screenshot.width / screenshot.height;
    const dstAspect = imgW / imgH;
    let sx = 0, sy = 0, sw = screenshot.width, sh = screenshot.height;
    if (srcAspect > dstAspect) {
      sw = screenshot.height * dstAspect;
      sx = (screenshot.width - sw) / 2;
    } else {
      sh = screenshot.width / dstAspect;
    }
    ctx.drawImage(screenshot, sx, sy, sw, sh, imgX, imgY, imgW, imgH);
    ctx.restore();

    // Browser-like top bar
    ctx.fillStyle = "#2d2d2d";
    ctx.save();
    roundRectPath(ctx, imgX, imgY, imgW, 65, 24);
    ctx.clip();
    ctx.fillRect(imgX, imgY, imgW, 65);
    ctx.restore();

    // Traffic light dots
    [imgX + 40, imgX + 75, imgX + 110].forEach((dotX, i) => {
      ctx.fillStyle = ["#ff5f57", "#febc2e", "#28c840"][i];
      ctx.beginPath();
      ctx.arc(dotX, imgY + 32, 10, 0, Math.PI * 2);
      ctx.fill();
    });

    // URL bar
    ctx.fillStyle = "#444";
    roundRect(ctx, imgX + 160, imgY + 14, imgW - 220, 36, 8);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.font = `${22}px Arial, sans-serif`;
    ctx.textAlign = "left";
    ctx.fillText(`sabtools.in/tools/${tool.slug}`, imgX + 180, imgY + 40);
    ctx.textAlign = "center";
  } catch (e) {
    // If screenshot fails, show placeholder
    ctx.fillStyle = "rgba(255,255,255,0.1)";
    roundRect(ctx, 80, titleY + 80, W - 160, 1000, 24);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = `bold ${72}px Arial, sans-serif`;
    ctx.fillText(tool.name, W / 2, titleY + 580);
  }

  // === CTA Button ===
  const ctaY = H - 520;
  // Button shadow
  ctx.shadowColor = "rgba(0,0,0,0.4)";
  ctx.shadowBlur = 25;
  ctx.shadowOffsetY = 8;
  ctx.fillStyle = colors.accent === "#ffffff" ? "#ffeb3b" : colors.accent;
  roundRect(ctx, W / 2 - 380, ctaY, 760, 120, 60);
  ctx.fill();
  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  ctx.fillStyle = "#1a1a2e";
  ctx.font = `bold ${52}px Arial, Helvetica, sans-serif`;
  ctx.fillText("Try It Now - FREE!", W / 2, ctaY + 78);

  // === Features list ===
  const features = [
    "Works on Mobile & Desktop",
    "No Download Required",
    "Instant Accurate Results",
  ];
  ctx.font = `${40}px Arial, Helvetica, sans-serif`;
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  features.forEach((feat, i) => {
    ctx.fillText(`✓  ${feat}`, W / 2, ctaY + 180 + i * 65);
  });

  // === Bottom branding ===
  ctx.fillStyle = "rgba(255,255,255,0.2)";
  ctx.fillRect(60, H - 160, W - 120, 1);

  ctx.fillStyle = "#ffffff";
  ctx.font = `bold ${56}px Arial, Helvetica, sans-serif`;
  ctx.fillText("SabTools.in", W / 2, H - 85);
  ctx.font = `${30}px Arial, Helvetica, sans-serif`;
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  ctx.fillText("450+ Free Online Tools for India", W / 2, H - 35);

  // Save
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync(outputPath, buffer);
  console.log(`Pin image created: ${outputPath}`);
  return outputPath;
}

// Helper: rounded rectangle
function roundRect(ctx, x, y, w, h, r) {
  roundRectPath(ctx, x, y, w, h, r);
}

function roundRectPath(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// Helper: wrap text into lines
function wrapText(ctx, text, maxWidth) {
  const words = text.split(" ");
  const lines = [];
  let current = "";
  words.forEach((word) => {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth) {
      if (current) lines.push(current);
      current = word;
    } else {
      current = test;
    }
  });
  if (current) lines.push(current);
  return lines;
}

module.exports = { createPinImage };

// Run directly
if (require.main === module) {
  const slug = process.argv[2] || "emi-calculator";
  const tool = config.PRIORITY_TOOLS.find((t) => t.slug === slug) || {
    slug,
    name: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    category: "finance",
  };
  const output = path.join(config.OUTPUT_DIR, `${slug}_pin.png`);
  createPinImage(tool, output).then(() => console.log("Done!"));
}
