/**
 * Long Video: Stitch all scenes into a full YouTube video
 * Intro title card → Homepage → Categories → Tool demos → Features → Outro
 */

const ffmpeg = require("fluent-ffmpeg");
const ffmpegInstaller = require("@ffmpeg-installer/ffmpeg");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const config = require("./config");

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const W = config.VIDEO_WIDTH;
const H = config.VIDEO_HEIGHT;

async function createLongVideo(scenes, audioPath) {
  const tempDir = config.TEMP_DIR;
  const outputDir = config.OUTPUT_DIR;
  fs.mkdirSync(outputDir, { recursive: true });

  const audioDuration = await getAudioDuration(audioPath);

  // Create title cards
  const introPath = path.join(tempDir, "title_intro.png");
  const outroPath = path.join(tempDir, "title_outro.png");
  const transitionPath = path.join(tempDir, "title_transition.png");
  const featuresPath = path.join(tempDir, "title_features.png");

  await createIntroCard(introPath);
  await createOutroCard(outroPath);
  await createTransitionCard("Let's See It In Action!", "🎬", transitionPath);
  await createFeaturesCard(featuresPath);

  // Build frame list
  const frameListPath = path.join(tempDir, "framelist.txt");
  let frameList = "";

  // === INTRO TITLE CARD (5 seconds) ===
  frameList += `file '${introPath}'\nduration 5\n`;

  // === SCENE FRAMES ===
  for (let i = 0; i < scenes.length; i++) {
    const scene = scenes[i];

    // Add transition card before tool demos (after categories)
    if (i === 2 && scene.label !== "Features") {
      frameList += `file '${transitionPath}'\nduration 3\n`;
    }

    // Add scene label card before each tool demo
    if (config.DEMO_TOOLS.some((t) => t.name === scene.label)) {
      const labelPath = path.join(tempDir, `label_${i}.png`);
      const demoTool = config.DEMO_TOOLS.find((t) => t.name === scene.label);
      await createToolLabelCard(demoTool, labelPath);
      frameList += `file '${labelPath}'\nduration 2.5\n`;
    }

    // Add features title card
    if (scene.label === "Features") {
      frameList += `file '${featuresPath}'\nduration 3\n`;
    }

    // Add all frames from this scene
    for (const frame of scene.frames) {
      frameList += `file '${frame.path}'\nduration ${frame.duration}\n`;
    }
  }

  // === OUTRO CARD (6 seconds) ===
  frameList += `file '${outroPath}'\nduration 6\n`;

  // FFmpeg requires last frame listed without duration
  frameList += `file '${outroPath}'\n`;

  fs.writeFileSync(frameListPath, frameList);

  const totalFrames = frameList.split("\n").filter((l) => l.startsWith("file")).length;
  console.log(`   ${totalFrames} total frames in video`);

  const dateStr = new Date().toISOString().slice(0, 10);
  const videoFilename = `sabtools-full-walkthrough-${dateStr}.mp4`;
  const outputPath = path.join(outputDir, videoFilename);

  return new Promise((resolve, reject) => {
    ffmpeg()
      .input(frameListPath)
      .inputOptions(["-f", "concat", "-safe", "0"])
      .input(audioPath)
      .outputOptions([
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-r", "30",
        "-c:a", "aac",
        "-b:a", "192k",
        "-shortest",
        "-movflags", "+faststart",
        "-vf", `scale=${W}:${H}:force_original_aspect_ratio=decrease,pad=${W}:${H}:(ow-iw)/2:(oh-ih)/2:color=white`,
        "-preset", "medium",
        "-crf", "20",
      ])
      .output(outputPath)
      .on("start", () => console.log("   FFmpeg encoding long video..."))
      .on("progress", (p) => {
        if (p.percent) process.stdout.write(`\r   Encoding: ${Math.round(p.percent)}%`);
      })
      .on("end", () => {
        console.log("\n   Video created:", outputPath);
        resolve(outputPath);
      })
      .on("error", (err) => {
        console.error("\n   FFmpeg error:", err.message);
        reject(err);
      })
      .run();
  });
}

// ============ TITLE CARDS ============

async function createIntroCard(outputPath) {
  const svg = `
    <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#0f0a2e" />
          <stop offset="50%" style="stop-color:#1e1b4b" />
          <stop offset="100%" style="stop-color:#312e81" />
        </linearGradient>
        <radialGradient id="glow" cx="50%" cy="45%">
          <stop offset="0%" style="stop-color:#6366f1;stop-opacity:0.25" />
          <stop offset="100%" style="stop-color:#6366f1;stop-opacity:0" />
        </radialGradient>
      </defs>
      <rect width="${W}" height="${H}" fill="url(#bg)"/>
      <rect width="${W}" height="${H}" fill="url(#glow)"/>

      <text x="${W / 2}" y="280" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-size="24" letter-spacing="10" font-family="Arial">COMPLETE WALKTHROUGH</text>

      <text x="${W / 2}" y="420" text-anchor="middle" fill="white" font-size="90" font-weight="bold" font-family="Arial">SabTools.in</text>
      <text x="${W / 2}" y="510" text-anchor="middle" fill="#a5b4fc" font-size="40" font-family="Arial">450+ Free Online Tools for India</text>

      <rect x="${W / 2 - 60}" y="550" width="120" height="4" rx="2" fill="#818cf8"/>

      <text x="${W / 2}" y="640" text-anchor="middle" fill="#c7d2fe" font-size="32" font-family="Arial">Calculators | Converters | PDF Tools | Image Tools</text>
      <text x="${W / 2}" y="690" text-anchor="middle" fill="#c7d2fe" font-size="32" font-family="Arial">Developer Tools | QR Codes | And Much More</text>

      <rect x="${W / 2 - 180}" y="750" width="360" height="70" rx="35" fill="#22c55e"/>
      <text x="${W / 2}" y="796" text-anchor="middle" fill="white" font-size="34" font-weight="bold" font-family="Arial">100% FREE — No Signup</text>

      <text x="${W / 2}" y="900" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-size="28" font-family="Arial">No App Download Needed — Works in Browser</text>
    </svg>
  `;
  await sharp(Buffer.from(svg)).png().toFile(outputPath);
}

async function createOutroCard(outputPath) {
  const svg = `
    <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="obg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#0f0a2e" />
          <stop offset="100%" style="stop-color:#1e1b4b" />
        </linearGradient>
        <linearGradient id="btn" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#4f46e5" />
          <stop offset="100%" style="stop-color:#7c3aed" />
        </linearGradient>
      </defs>
      <rect width="${W}" height="${H}" fill="url(#obg)"/>
      <circle cx="300" cy="300" r="250" fill="rgba(79,70,229,0.06)"/>
      <circle cx="1600" cy="800" r="350" fill="rgba(124,58,237,0.05)"/>

      <text x="${W / 2}" y="250" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-size="26" letter-spacing="8" font-family="Arial">THANK YOU FOR WATCHING</text>

      <text x="${W / 2}" y="380" text-anchor="middle" fill="white" font-size="72" font-weight="bold" font-family="Arial">Visit SabTools.in Today!</text>
      <text x="${W / 2}" y="450" text-anchor="middle" fill="#a5b4fc" font-size="36" font-family="Arial">450+ Free Tools — No Signup Required</text>

      <rect x="${W / 2 - 220}" y="500" width="440" height="80" rx="40" fill="url(#btn)"/>
      <text x="${W / 2}" y="552" text-anchor="middle" fill="white" font-size="42" font-weight="bold" font-family="Arial">sabtools.in</text>

      <text x="${W / 4}" y="680" text-anchor="middle" fill="#c7d2fe" font-size="30" font-family="Arial">No Signup Needed</text>
      <text x="${W / 2}" y="680" text-anchor="middle" fill="#c7d2fe" font-size="30" font-family="Arial">100% Free Forever</text>
      <text x="${3 * W / 4}" y="680" text-anchor="middle" fill="#c7d2fe" font-size="30" font-family="Arial">Made for India</text>

      <text x="${W / 2}" y="780" text-anchor="middle" fill="#fbbf24" font-size="44" font-weight="bold" font-family="Arial">Link in Comment Section</text>

      <rect x="${W / 2 - 150}" y="830" width="300" height="65" rx="32" fill="#ef4444"/>
      <text x="${W / 2}" y="873" text-anchor="middle" fill="white" font-size="30" font-weight="bold" font-family="Arial">SUBSCRIBE</text>

      <text x="${W / 2}" y="960" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-size="26" font-family="Arial">Like, Share &amp; Subscribe for more free tools!</text>
      <text x="${W / 2}" y="1010" text-anchor="middle" fill="rgba(255,255,255,0.3)" font-size="22" font-family="Arial">SabTools.in — All Free Online Tools for India</text>
    </svg>
  `;
  await sharp(Buffer.from(svg)).png().toFile(outputPath);
}

async function createTransitionCard(text, emoji, outputPath) {
  const svg = `
    <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="tbg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1e1b4b" />
          <stop offset="100%" style="stop-color:#312e81" />
        </linearGradient>
      </defs>
      <rect width="${W}" height="${H}" fill="url(#tbg)"/>
      <text x="${W / 2}" y="${H / 2 - 60}" text-anchor="middle" font-size="100">${emoji}</text>
      <text x="${W / 2}" y="${H / 2 + 50}" text-anchor="middle" fill="white" font-size="56" font-weight="bold" font-family="Arial">${escapeXml(text)}</text>
      <text x="${W / 2}" y="${H / 2 + 120}" text-anchor="middle" fill="#a5b4fc" font-size="30" font-family="Arial">Live Demo of Popular Tools</text>
    </svg>
  `;
  await sharp(Buffer.from(svg)).png().toFile(outputPath);
}

async function createToolLabelCard(tool, outputPath) {
  const svg = `
    <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="lbg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1e1b4b" />
          <stop offset="100%" style="stop-color:#0f0a2e" />
        </linearGradient>
      </defs>
      <rect width="${W}" height="${H}" fill="url(#lbg)"/>
      <text x="${W / 2}" y="${H / 2 - 80}" text-anchor="middle" font-size="120">${tool.icon}</text>
      <text x="${W / 2}" y="${H / 2 + 40}" text-anchor="middle" fill="white" font-size="60" font-weight="bold" font-family="Arial">${escapeXml(tool.name)}</text>
      <text x="${W / 2}" y="${H / 2 + 110}" text-anchor="middle" fill="#a5b4fc" font-size="30" font-family="Arial">${escapeXml(tool.category)} | 100% Free</text>
      <rect x="${W / 2 - 40}" y="${H / 2 + 140}" width="80" height="3" rx="2" fill="#818cf8"/>
    </svg>
  `;
  await sharp(Buffer.from(svg)).png().toFile(outputPath);
}

async function createFeaturesCard(outputPath) {
  const svg = `
    <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="fbg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1e1b4b" />
          <stop offset="100%" style="stop-color:#312e81" />
        </linearGradient>
      </defs>
      <rect width="${W}" height="${H}" fill="url(#fbg)"/>
      <text x="${W / 2}" y="${H / 2 - 80}" text-anchor="middle" font-size="80">⭐</text>
      <text x="${W / 2}" y="${H / 2 + 30}" text-anchor="middle" fill="white" font-size="56" font-weight="bold" font-family="Arial">Why SabTools.in?</text>
      <text x="${W / 2}" y="${H / 2 + 100}" text-anchor="middle" fill="#c7d2fe" font-size="30" font-family="Arial">5 Reasons to Use SabTools</text>
    </svg>
  `;
  await sharp(Buffer.from(svg)).png().toFile(outputPath);
}

function escapeXml(str) {
  return String(str || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

function getAudioDuration(audioPath) {
  return new Promise((resolve) => {
    ffmpeg.ffprobe(audioPath, (err, meta) => {
      resolve(err || !meta ? 120 : (meta.format.duration || 120));
    });
  });
}

module.exports = { createLongVideo };
