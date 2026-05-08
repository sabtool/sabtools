/**
 * Create YouTube thumbnail for SabTools.in walkthrough video
 * 1280x720 — YouTube recommended thumbnail size
 */

const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const config = require("./config");

async function createThumbnail(outputPath) {
  const W = 1280;
  const H = 720;

  const svg = `
    <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#0f0a2e" />
          <stop offset="40%" style="stop-color:#1e1b4b" />
          <stop offset="100%" style="stop-color:#312e81" />
        </linearGradient>
        <radialGradient id="glow1" cx="25%" cy="40%">
          <stop offset="0%" style="stop-color:#6366f1;stop-opacity:0.35" />
          <stop offset="100%" style="stop-color:#6366f1;stop-opacity:0" />
        </radialGradient>
        <radialGradient id="glow2" cx="80%" cy="70%">
          <stop offset="0%" style="stop-color:#7c3aed;stop-opacity:0.25" />
          <stop offset="100%" style="stop-color:#7c3aed;stop-opacity:0" />
        </radialGradient>
        <linearGradient id="btnGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#ef4444" />
          <stop offset="100%" style="stop-color:#dc2626" />
        </linearGradient>
        <linearGradient id="greenGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#22c55e" />
          <stop offset="100%" style="stop-color:#16a34a" />
        </linearGradient>
        <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="rgba(0,0,0,0.5)" />
        </filter>
        <filter id="textShadow" x="-5%" y="-5%" width="110%" height="110%">
          <feDropShadow dx="2" dy="2" stdDeviation="3" flood-color="rgba(0,0,0,0.7)" />
        </filter>
      </defs>

      <!-- Background -->
      <rect width="${W}" height="${H}" fill="url(#bg)"/>
      <rect width="${W}" height="${H}" fill="url(#glow1)"/>
      <rect width="${W}" height="${H}" fill="url(#glow2)"/>

      <!-- Decorative circles -->
      <circle cx="100" cy="600" r="200" fill="rgba(99,102,241,0.08)" />
      <circle cx="1150" cy="150" r="180" fill="rgba(124,58,237,0.08)" />

      <!-- Left side: Tool category cards -->
      <rect x="60" y="140" width="130" height="55" rx="12" fill="rgba(99,102,241,0.4)" stroke="#818cf8" stroke-width="1.5"/>
      <text x="125" y="175" text-anchor="middle" fill="white" font-size="18" font-weight="bold" font-family="Arial">Finance</text>

      <rect x="200" y="140" width="130" height="55" rx="12" fill="rgba(34,197,94,0.4)" stroke="#4ade80" stroke-width="1.5"/>
      <text x="265" y="175" text-anchor="middle" fill="white" font-size="18" font-weight="bold" font-family="Arial">Education</text>

      <rect x="60" y="210" width="130" height="55" rx="12" fill="rgba(249,115,22,0.4)" stroke="#fb923c" stroke-width="1.5"/>
      <text x="125" y="245" text-anchor="middle" fill="white" font-size="18" font-weight="bold" font-family="Arial">PDF Tools</text>

      <rect x="200" y="210" width="130" height="55" rx="12" fill="rgba(236,72,153,0.4)" stroke="#f472b6" stroke-width="1.5"/>
      <text x="265" y="245" text-anchor="middle" fill="white" font-size="18" font-weight="bold" font-family="Arial">Image</text>

      <rect x="60" y="280" width="130" height="55" rx="12" fill="rgba(14,165,233,0.4)" stroke="#38bdf8" stroke-width="1.5"/>
      <text x="125" y="315" text-anchor="middle" fill="white" font-size="18" font-weight="bold" font-family="Arial">Developer</text>

      <rect x="200" y="280" width="130" height="55" rx="12" fill="rgba(168,85,247,0.4)" stroke="#c084fc" stroke-width="1.5"/>
      <text x="265" y="315" text-anchor="middle" fill="white" font-size="18" font-weight="bold" font-family="Arial">QR Code</text>

      <!-- Connecting line -->
      <rect x="355" y="140" width="4" height="240" rx="2" fill="rgba(129,140,248,0.4)"/>

      <!-- Right side: Main text -->
      <text x="400" y="155" fill="#fbbf24" font-size="32" font-weight="bold" font-family="Arial" filter="url(#textShadow)" letter-spacing="3">450+ FREE TOOLS</text>

      <text x="400" y="235" fill="white" font-size="72" font-weight="bold" font-family="Arial" filter="url(#textShadow)">SabTools.in</text>

      <text x="400" y="305" fill="#c7d2fe" font-size="36" font-family="Arial" filter="url(#textShadow)">India&apos;s Biggest Free Tools Website</text>

      <!-- Tool name tags -->
      <rect x="400" y="340" width="175" height="40" rx="20" fill="rgba(99,102,241,0.3)" stroke="#818cf8" stroke-width="1"/>
      <text x="487" y="367" text-anchor="middle" fill="white" font-size="18" font-weight="bold" font-family="Arial">EMI Calculator</text>

      <rect x="590" y="340" width="170" height="40" rx="20" fill="rgba(99,102,241,0.3)" stroke="#818cf8" stroke-width="1"/>
      <text x="675" y="367" text-anchor="middle" fill="white" font-size="18" font-weight="bold" font-family="Arial">SIP Calculator</text>

      <rect x="775" y="340" width="175" height="40" rx="20" fill="rgba(99,102,241,0.3)" stroke="#818cf8" stroke-width="1"/>
      <text x="862" y="367" text-anchor="middle" fill="white" font-size="18" font-weight="bold" font-family="Arial">GST Calculator</text>

      <rect x="965" y="340" width="175" height="40" rx="20" fill="rgba(99,102,241,0.3)" stroke="#818cf8" stroke-width="1"/>
      <text x="1052" y="367" text-anchor="middle" fill="white" font-size="18" font-weight="bold" font-family="Arial">QR Generator</text>

      <rect x="400" y="395" width="170" height="40" rx="20" fill="rgba(99,102,241,0.3)" stroke="#818cf8" stroke-width="1"/>
      <text x="485" y="422" text-anchor="middle" fill="white" font-size="18" font-weight="bold" font-family="Arial">Age Calculator</text>

      <rect x="585" y="395" width="130" height="40" rx="20" fill="rgba(99,102,241,0.3)" stroke="#818cf8" stroke-width="1"/>
      <text x="650" y="422" text-anchor="middle" fill="white" font-size="18" font-weight="bold" font-family="Arial">PDF Tools</text>

      <rect x="730" y="395" width="160" height="40" rx="20" fill="rgba(99,102,241,0.3)" stroke="#818cf8" stroke-width="1"/>
      <text x="810" y="422" text-anchor="middle" fill="white" font-size="18" font-weight="bold" font-family="Arial">Image Tools</text>

      <rect x="905" y="395" width="175" height="40" rx="20" fill="rgba(99,102,241,0.3)" stroke="#818cf8" stroke-width="1"/>
      <text x="992" y="422" text-anchor="middle" fill="white" font-size="18" font-weight="bold" font-family="Arial">450+ More...</text>

      <!-- Bottom section -->
      <!-- FREE badge -->
      <rect x="80" y="480" width="220" height="65" rx="32" fill="url(#greenGrad)" filter="url(#shadow)"/>
      <text x="190" y="523" text-anchor="middle" fill="white" font-size="34" font-weight="bold" font-family="Arial">100% FREE</text>

      <!-- No Signup badge -->
      <rect x="320" y="480" width="220" height="65" rx="32" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
      <text x="430" y="523" text-anchor="middle" fill="white" font-size="28" font-weight="bold" font-family="Arial">No Signup</text>

      <!-- Made for India badge -->
      <rect x="560" y="480" width="260" height="65" rx="32" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
      <text x="690" y="523" text-anchor="middle" fill="white" font-size="28" font-weight="bold" font-family="Arial">Made for India</text>

      <!-- Bottom bar -->
      <rect y="${H - 100}" width="${W}" height="100" fill="rgba(0,0,0,0.5)"/>

      <!-- Watch Now button -->
      <rect x="60" y="${H - 78}" width="200" height="55" rx="27" fill="url(#btnGrad)" filter="url(#shadow)"/>
      <text x="120" y="${H - 43}" fill="white" font-size="26" font-weight="bold" font-family="Arial">▶ WATCH NOW</text>

      <!-- Bottom text -->
      <text x="300" y="${H - 43}" fill="rgba(255,255,255,0.8)" font-size="24" font-family="Arial">Complete Walkthrough - Calculators, Converters, PDF, Image, Developer Tools</text>

      <!-- Yellow accent border top -->
      <rect y="0" width="${W}" height="5" fill="#fbbf24"/>

      <!-- Red corner badge: FULL TUTORIAL -->
      <rect x="${W - 240}" y="20" width="220" height="50" rx="25" fill="url(#btnGrad)" filter="url(#shadow)"/>
      <text x="${W - 130}" y="53" text-anchor="middle" fill="white" font-size="22" font-weight="bold" font-family="Arial">FULL TUTORIAL</text>
    </svg>
  `;

  await sharp(Buffer.from(svg))
    .png({ quality: 95 })
    .toFile(outputPath);

  console.log("   Thumbnail created:", outputPath);
  return outputPath;
}

// Also create thumbnail for Shorts
async function createShortsThumbnail(tool, outputPath) {
  const W = 1080;
  const H = 1920;

  const svg = `
    <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sbg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#0f0a2e" />
          <stop offset="50%" style="stop-color:#1e1b4b" />
          <stop offset="100%" style="stop-color:#312e81" />
        </linearGradient>
        <radialGradient id="sg1" cx="30%" cy="40%">
          <stop offset="0%" style="stop-color:#6366f1;stop-opacity:0.3" />
          <stop offset="100%" style="stop-color:#6366f1;stop-opacity:0" />
        </radialGradient>
      </defs>
      <rect width="${W}" height="${H}" fill="url(#sbg)"/>
      <rect width="${W}" height="${H}" fill="url(#sg1)"/>

      <text x="${W / 2}" y="${H / 2 - 350}" text-anchor="middle" fill="#fbbf24" font-size="36" font-weight="bold" font-family="Arial" letter-spacing="4">FREE TOOL</text>

      <rect x="${W / 2 - 80}" y="${H / 2 - 280}" width="160" height="160" rx="80" fill="rgba(99,102,241,0.3)" stroke="#818cf8" stroke-width="3"/>
      <text x="${W / 2}" y="${H / 2 - 180}" text-anchor="middle" fill="white" font-size="48" font-weight="bold" font-family="Arial">FREE</text>

      <text x="${W / 2}" y="${H / 2 - 30}" text-anchor="middle" fill="white" font-size="64" font-weight="bold" font-family="Arial">${escapeXml(tool.name || "Free Tool")}</text>

      <text x="${W / 2}" y="${H / 2 + 60}" text-anchor="middle" fill="#a5b4fc" font-size="38" font-family="Arial">How to Use — Tutorial</text>

      <rect x="${W / 2 - 160}" y="${H / 2 + 120}" width="320" height="70" rx="35" fill="#22c55e"/>
      <text x="${W / 2}" y="${H / 2 + 166}" text-anchor="middle" fill="white" font-size="36" font-weight="bold" font-family="Arial">100% FREE</text>

      <text x="${W / 2}" y="${H / 2 + 280}" text-anchor="middle" fill="rgba(255,255,255,0.6)" font-size="30" font-family="Arial">No Signup | No Download</text>

      <rect y="${H - 150}" width="${W}" height="150" fill="rgba(0,0,0,0.5)"/>
      <text x="${W / 2}" y="${H - 80}" text-anchor="middle" fill="white" font-size="44" font-weight="bold" font-family="Arial">sabtools.in</text>
    </svg>
  `;

  await sharp(Buffer.from(svg)).png({ quality: 95 }).toFile(outputPath);
  return outputPath;
}

function escapeXml(str) {
  return String(str || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

module.exports = { createThumbnail, createShortsThumbnail };

// Run directly
if (require.main === module) {
  const outDir = path.join(__dirname, "..", "..", "long-video-output");
  fs.mkdirSync(outDir, { recursive: true });
  createThumbnail(path.join(outDir, "thumbnail.png")).then(() => {
    console.log("Done!");
  });
}
