#!/usr/bin/env node

/**
 * Creates ULTRA-HD Pinterest pin images using Puppeteer HTML rendering
 * 3x device scale for maximum sharpness
 * Output: 1000x1500 at 3x = 3000x4500 ultra-crisp image
 * Pinterest supports up to 20MB — we use full quality PNG
 */

const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const config = require("./config");

// Color schemes
const CATEGORY_COLORS = {
  finance: { bg1: "#1a73e8", bg2: "#0d47a1", accent: "#FFC107", accentText: "#1a1a2e" },
  education: { bg1: "#0f9d58", bg2: "#1b5e20", accent: "#FFC107", accentText: "#1a1a2e" },
  health: { bg1: "#ea4335", bg2: "#b71c1c", accent: "#ffffff", accentText: "#ea4335" },
  developer: { bg1: "#673ab7", bg2: "#311b92", accent: "#00e5ff", accentText: "#1a1a2e" },
  text: { bg1: "#ff6f00", bg2: "#e65100", accent: "#ffffff", accentText: "#ff6f00" },
  image: { bg1: "#e91e63", bg2: "#880e4f", accent: "#ffffff", accentText: "#e91e63" },
  pdf: { bg1: "#d32f2f", bg2: "#b71c1c", accent: "#ffffff", accentText: "#d32f2f" },
  qrcode: { bg1: "#00897b", bg2: "#004d40", accent: "#ffffff", accentText: "#00897b" },
  conversion: { bg1: "#0277bd", bg2: "#01579b", accent: "#ffffff", accentText: "#0277bd" },
  math: { bg1: "#283593", bg2: "#1a237e", accent: "#ffeb3b", accentText: "#1a1a2e" },
  fun: { bg1: "#c2185b", bg2: "#880e4f", accent: "#ffeb3b", accentText: "#1a1a2e" },
  everyday: { bg1: "#2e7d32", bg2: "#1b5e20", accent: "#ffffff", accentText: "#2e7d32" },
};

async function captureToolScreenshot(tool) {
  const url = `${config.SITE_URL}/tools/${tool.slug}`;
  const screenshotPath = path.join(config.TEMP_DIR, `${tool.slug}_uhd.png`);
  fs.mkdirSync(config.TEMP_DIR, { recursive: true });

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--force-device-scale-factor=3"],
  });

  try {
    const page = await browser.newPage();
    // 3x device scale for ultra-sharp rendering
    await page.setViewport({ width: 1440, height: 960, deviceScaleFactor: 3 });
    await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });
    await new Promise((r) => setTimeout(r, 4000));

    // Clean up page for screenshot
    await page.evaluate(() => {
      const nav = document.querySelector("nav, header, .navbar");
      const footer = document.querySelector("footer");
      const cookie = document.querySelector('[class*="cookie"], [class*="consent"], [id*="cookie"]');
      if (nav) nav.style.display = "none";
      if (footer) footer.style.display = "none";
      if (cookie) cookie.style.display = "none";
      document.body.style.webkitFontSmoothing = "antialiased";
      document.body.style.textRendering = "optimizeLegibility";
      document.body.style.fontSmooth = "always";
    });

    // Full quality PNG screenshot
    await page.screenshot({
      path: screenshotPath,
      type: "png",
      captureBeyondViewport: false,
      omitBackground: false,
    });

    const size = fs.statSync(screenshotPath).size;
    console.log(`  Screenshot: ${(size / 1024 / 1024).toFixed(2)}MB (${screenshotPath})`);
    return screenshotPath;
  } finally {
    await browser.close();
  }
}

async function createPinImage(tool, outputPath) {
  const colors = CATEGORY_COLORS[tool.category] || CATEGORY_COLORS.finance;

  // Step 1: Ultra-HD tool screenshot
  console.log(`Capturing UHD screenshot for ${tool.name}...`);
  const screenshotPath = await captureToolScreenshot(tool);
  const screenshotBase64 = fs.readFileSync(screenshotPath).toString("base64");

  // Step 2: Render pin as HTML at 3x scale
  console.log("Rendering ultra-HD pin...");

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    width: 1000px;
    height: 1500px;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
    overflow: hidden;
    background: linear-gradient(165deg, ${colors.bg1} 0%, ${colors.bg2} 45%, #0d1117 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }

  /* Decorative elements */
  .deco-circle {
    position: absolute;
    border-radius: 50%;
    background: rgba(255,255,255,0.05);
  }
  .dc1 { top: -100px; left: -100px; width: 350px; height: 350px; }
  .dc2 { top: 350px; right: -120px; width: 400px; height: 400px; }
  .dc3 { bottom: 250px; left: -80px; width: 250px; height: 250px; }
  .dc4 { top: 200px; left: 50%; width: 500px; height: 500px; opacity: 0.02; }

  .badge {
    margin-top: 48px;
    background: ${colors.accent};
    color: ${colors.accentText};
    padding: 12px 36px;
    border-radius: 30px;
    font-size: 24px;
    font-weight: 900;
    letter-spacing: 2px;
    box-shadow: 0 6px 20px rgba(0,0,0,0.3);
    z-index: 2;
    text-transform: uppercase;
  }

  .tool-name {
    margin-top: 24px;
    font-size: 52px;
    font-weight: 900;
    color: #ffffff;
    text-align: center;
    padding: 0 50px;
    line-height: 1.15;
    text-shadow: 0 3px 15px rgba(0,0,0,0.35);
    z-index: 2;
    letter-spacing: -0.5px;
  }

  .subtitle {
    margin-top: 12px;
    font-size: 21px;
    font-weight: 500;
    color: rgba(255,255,255,0.8);
    z-index: 2;
    letter-spacing: 0.3px;
  }

  .screenshot-wrapper {
    margin-top: 30px;
    width: 900px;
    z-index: 2;
    position: relative;
  }

  /* Glow effect behind screenshot */
  .screenshot-wrapper::before {
    content: '';
    position: absolute;
    top: 20px; left: 20px; right: 20px; bottom: -10px;
    background: rgba(0,0,0,0.4);
    border-radius: 20px;
    filter: blur(30px);
    z-index: -1;
  }

  .screenshot-frame {
    width: 100%;
    background: #ffffff;
    border-radius: 16px;
    overflow: hidden;
    border: 2px solid rgba(255,255,255,0.15);
  }

  .browser-bar {
    height: 40px;
    background: linear-gradient(180deg, #3a3a3a 0%, #2d2d2d 100%);
    display: flex;
    align-items: center;
    padding: 0 16px;
    gap: 8px;
    border-bottom: 1px solid #222;
  }

  .dot { width: 13px; height: 13px; border-radius: 50%; box-shadow: inset 0 -1px 2px rgba(0,0,0,0.2); }
  .dot.red { background: linear-gradient(180deg, #ff6058 0%, #e04040 100%); }
  .dot.yellow { background: linear-gradient(180deg, #ffc02e 0%, #dda020 100%); }
  .dot.green { background: linear-gradient(180deg, #2aca44 0%, #1fa835 100%); }

  .url-bar {
    margin-left: 20px;
    background: #1a1a1a;
    border-radius: 6px;
    padding: 6px 16px;
    color: rgba(255,255,255,0.65);
    font-size: 13px;
    font-family: 'Inter', monospace;
    flex: 1;
    max-width: 550px;
    border: 1px solid #444;
  }

  .url-bar .lock { color: #4ade80; margin-right: 6px; }

  .screenshot-img {
    width: 100%;
    height: 600px;
    object-fit: cover;
    object-position: top center;
    display: block;
    image-rendering: -webkit-optimize-contrast;
    image-rendering: crisp-edges;
  }

  .cta-button {
    margin-top: 36px;
    background: ${colors.accent};
    color: ${colors.accentText};
    padding: 22px 80px;
    border-radius: 50px;
    font-size: 30px;
    font-weight: 900;
    letter-spacing: 0.5px;
    box-shadow: 0 8px 30px rgba(0,0,0,0.35);
    z-index: 2;
    text-transform: none;
  }

  .features {
    margin-top: 28px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    z-index: 2;
  }

  .feature {
    font-size: 21px;
    color: rgba(255,255,255,0.92);
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .feature .icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background: #4ade80;
    color: #0d1117;
    font-size: 15px;
    font-weight: 900;
    flex-shrink: 0;
  }

  .stats-row {
    margin-top: 24px;
    display: flex;
    gap: 20px;
    z-index: 2;
  }

  .stat-box {
    text-align: center;
    padding: 16px 28px;
    background: rgba(255,255,255,0.08);
    border-radius: 16px;
    border: 1px solid rgba(255,255,255,0.12);
    backdrop-filter: blur(10px);
  }

  .stat-number {
    font-size: 30px;
    font-weight: 900;
    color: ${colors.accent};
    line-height: 1;
  }

  .stat-label {
    font-size: 11px;
    color: rgba(255,255,255,0.55);
    margin-top: 4px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  .bottom-brand {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 22px;
    text-align: center;
    border-top: 1px solid rgba(255,255,255,0.12);
    background: rgba(0,0,0,0.25);
    backdrop-filter: blur(10px);
  }

  .brand-name {
    font-size: 32px;
    font-weight: 900;
    color: #ffffff;
    letter-spacing: 1px;
  }

  .brand-tagline {
    font-size: 14px;
    color: rgba(255,255,255,0.5);
    margin-top: 4px;
    font-weight: 500;
  }
</style>
</head>
<body>
  <div class="deco-circle dc1"></div>
  <div class="deco-circle dc2"></div>
  <div class="deco-circle dc3"></div>
  <div class="deco-circle dc4"></div>

  <div class="badge">100% FREE</div>
  <div class="tool-name">${tool.name}</div>
  <div class="subtitle">No Signup Required!</div>

  <div class="screenshot-wrapper">
    <div class="screenshot-frame">
      <div class="browser-bar">
        <div class="dot red"></div>
        <div class="dot yellow"></div>
        <div class="dot green"></div>
        <div class="url-bar"><span class="lock">🔒</span> sabtools.in/tools/${tool.slug}</div>
      </div>
      <img class="screenshot-img" src="data:image/png;base64,${screenshotBase64}" />
    </div>
  </div>

  <div class="cta-button">Try It Now — FREE!</div>

  <div class="features">
    <div class="feature"><span class="icon">✓</span> Works on Mobile & Desktop</div>
    <div class="feature"><span class="icon">✓</span> No Download Required</div>
    <div class="feature"><span class="icon">✓</span> Instant Accurate Results</div>
  </div>

  <div class="stats-row">
    <div class="stat-box">
      <div class="stat-number">460+</div>
      <div class="stat-label">Free Tools</div>
    </div>
    <div class="stat-box">
      <div class="stat-number">100%</div>
      <div class="stat-label">Free Forever</div>
    </div>
    <div class="stat-box">
      <div class="stat-number">0</div>
      <div class="stat-label">Signup Needed</div>
    </div>
  </div>

  <div class="bottom-brand">
    <div class="brand-name">SabTools.in</div>
    <div class="brand-tagline">460+ Free Online Tools for India</div>
  </div>
</body>
</html>`;

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--force-device-scale-factor=3"],
  });

  try {
    const page = await browser.newPage();
    // 3x device scale = 3000x4500 output
    await page.setViewport({ width: 1000, height: 1500, deviceScaleFactor: 3 });
    await page.setContent(html, { waitUntil: "domcontentloaded", timeout: 15000 });

    // Wait for fonts and images
    await new Promise((r) => setTimeout(r, 5000));

    fs.mkdirSync(path.dirname(outputPath), { recursive: true });

    // Full quality PNG — no compression
    await page.screenshot({
      path: outputPath,
      type: "png",
      omitBackground: false,
    });

    const size = fs.statSync(outputPath).size;
    console.log(`Pin image created: ${outputPath} (${(size / 1024 / 1024).toFixed(2)}MB)`);
    return outputPath;
  } finally {
    await browser.close();
  }
}

// Export
async function createShortsThumbnail(tool, outputPath) {
  return createPinImage(tool, outputPath);
}

module.exports = { createPinImage, createShortsThumbnail };

// Run directly
if (require.main === module) {
  const slug = process.argv[2] || "emi-calculator";
  const tool = config.PRIORITY_TOOLS.find((t) => t.slug === slug) || {
    slug,
    name: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    category: "finance",
    keywords: "free online tool India",
  };
  const output = path.join(config.OUTPUT_DIR, `${slug}_pin.png`);
  createPinImage(tool, output).then(() => console.log("Done!")).catch((e) => console.error(e));
}
