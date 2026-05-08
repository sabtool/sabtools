/**
 * Step 4: Create YouTube Short video — Screen recording style
 * Takes rapid screenshot frames and stitches them into smooth video
 */

const ffmpeg = require("fluent-ffmpeg");
const ffmpegInstaller = require("@ffmpeg-installer/ffmpeg");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");
const config = require("./config");

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const W = config.VIDEO_WIDTH;
const H = config.VIDEO_HEIGHT;

async function createVideo(tool, script, screenshotFrames, audioPath) {
  const tempDir = config.TEMP_DIR;
  const outputDir = config.OUTPUT_DIR;
  fs.mkdirSync(outputDir, { recursive: true });

  const audioDuration = await getAudioDuration(audioPath);

  // Create intro and outro frames
  const introPath = path.join(tempDir, "frame_intro.png");
  const outroPath = path.join(tempDir, "frame_outro.png");
  await createIntroFrame(tool, script.hook, introPath);
  await createOutroFrame(tool, script, outroPath);

  // Build frame list: intro (4s) + screen recording frames + outro (5s)
  const frameListPath = path.join(tempDir, "framelist.txt");
  let frameList = "";

  // Intro — hold for 4 seconds
  frameList += `file '${introPath}'\nduration 4\n`;

  // Screen recording frames — use their natural durations
  if (Array.isArray(screenshotFrames) && screenshotFrames.length > 0) {
    const isNewFormat = screenshotFrames[0] && typeof screenshotFrames[0] === "object" && screenshotFrames[0].path;

    if (isNewFormat) {
      for (const frame of screenshotFrames) {
        frameList += `file '${frame.path}'\nduration ${frame.duration}\n`;
      }
    } else {
      // Old format — array of file paths
      const durationPer = Math.max(1.5, (audioDuration - 7) / screenshotFrames.length);
      for (const framePath of screenshotFrames) {
        frameList += `file '${framePath}'\nduration ${durationPer}\n`;
      }
    }
  }

  // Outro — hold for 5 seconds
  frameList += `file '${outroPath}'\nduration 5\n`;

  // FFmpeg requires last frame listed without duration
  frameList += `file '${outroPath}'\n`;

  fs.writeFileSync(frameListPath, frameList);

  // Count total frames for progress
  const totalLines = frameList.split("\n").filter((l) => l.startsWith("file")).length;
  console.log(`   ${totalLines} total frames in video`);

  const dateStr = new Date().toISOString().slice(0, 10);
  const videoFilename = `${tool.slug}-${dateStr}.mp4`;
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
        "-b:a", "128k",
        "-shortest",
        "-movflags", "+faststart",
        "-vf", `scale=${W}:${H}:force_original_aspect_ratio=decrease,pad=${W}:${H}:(ow-iw)/2:(oh-ih)/2:color=white`,
        "-preset", "medium",
        "-crf", "23",
      ])
      .output(outputPath)
      .on("start", () => console.log("FFmpeg encoding screen recording..."))
      .on("progress", (p) => {
        if (p.percent) process.stdout.write(`\rEncoding: ${Math.round(p.percent)}%`);
      })
      .on("end", () => {
        console.log("\nVideo created:", outputPath);
        resolve(outputPath);
      })
      .on("error", (err) => {
        console.error("\nFFmpeg error:", err.message);
        reject(err);
      })
      .run();
  });
}

async function createIntroFrame(tool, hookText, outputPath) {
  const wrappedHook = wrapText(hookText || `${tool.name} — 100% Free!`, 22);
  const hookLines = wrappedHook.split("\n");

  const svg = `
    <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#0f0a2e" />
          <stop offset="50%" style="stop-color:#1e1b4b" />
          <stop offset="100%" style="stop-color:#312e81" />
        </linearGradient>
        <radialGradient id="g1" cx="30%" cy="40%">
          <stop offset="0%" style="stop-color:#6366f1;stop-opacity:0.3" />
          <stop offset="100%" style="stop-color:#6366f1;stop-opacity:0" />
        </radialGradient>
      </defs>
      <rect width="${W}" height="${H}" fill="url(#bg)"/>
      <rect width="${W}" height="${H}" fill="url(#g1)"/>

      <text x="${W / 2}" y="${H / 2 - 400}" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-size="28" letter-spacing="8" font-family="Arial">WATCH THIS</text>
      <rect x="${W / 2 - 40}" y="${H / 2 - 370}" width="80" height="3" rx="2" fill="#818cf8"/>

      <text x="${W / 2}" y="${H / 2 - 220}" text-anchor="middle" font-size="120">${tool.icon}</text>

      <text x="${W / 2}" y="${H / 2 - 80}" text-anchor="middle" fill="white" font-size="56" font-weight="bold" font-family="Arial">${escapeXml(tool.name)}</text>

      ${hookLines.map((line, i) =>
        `<text x="${W / 2}" y="${H / 2 + 40 + i * 58}" text-anchor="middle" fill="#fbbf24" font-size="44" font-weight="bold" font-family="Arial">${escapeXml(line)}</text>`
      ).join("")}

      <rect x="${W / 2 - 130}" y="${H / 2 + 220}" width="260" height="70" rx="35" fill="#22c55e"/>
      <text x="${W / 2}" y="${H / 2 + 266}" text-anchor="middle" fill="white" font-size="36" font-weight="bold" font-family="Arial">100% FREE</text>

      <text x="${W / 2}" y="${H - 280}" text-anchor="middle" fill="rgba(255,255,255,0.7)" font-size="30" font-family="Arial">Let me show you how it works ↓</text>

      <rect y="${H - 120}" width="${W}" height="120" fill="rgba(0,0,0,0.4)"/>
      <text x="${W / 2}" y="${H - 62}" text-anchor="middle" fill="white" font-size="36" font-weight="bold" font-family="Arial">sabtools.in</text>
    </svg>
  `;
  await sharp(Buffer.from(svg)).png().toFile(outputPath);
}

async function createOutroFrame(tool, script, outputPath) {
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
      <circle cx="200" cy="400" r="300" fill="rgba(79,70,229,0.08)"/>
      <circle cx="880" cy="1500" r="400" fill="rgba(124,58,237,0.06)"/>

      <text x="${W / 2}" y="${H / 2 - 420}" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-size="28" letter-spacing="6" font-family="Arial">YOUR TURN</text>
      <text x="${W / 2}" y="${H / 2 - 320}" text-anchor="middle" fill="white" font-size="64" font-weight="bold" font-family="Arial">Try It Now!</text>
      <text x="${W / 2}" y="${H / 2 - 240}" text-anchor="middle" fill="#a5b4fc" font-size="36" font-family="Arial">${escapeXml(tool.name)} — 100% Free</text>

      <rect x="${W / 2 - 300}" y="${H / 2 - 170}" width="600" height="100" rx="50" fill="url(#btn)"/>
      <text x="${W / 2}" y="${H / 2 - 108}" text-anchor="middle" fill="white" font-size="48" font-weight="bold" font-family="Arial">sabtools.in</text>

      <text x="${W / 2}" y="${H / 2 + 10}" text-anchor="middle" fill="#c7d2fe" font-size="34" font-family="Arial">497+ Free Online Tools</text>
      <text x="${W / 2}" y="${H / 2 + 70}" text-anchor="middle" fill="#c7d2fe" font-size="34" font-family="Arial">No Signup Required</text>
      <text x="${W / 2}" y="${H / 2 + 130}" text-anchor="middle" fill="#c7d2fe" font-size="34" font-family="Arial">Made for India</text>

      <text x="${W / 2}" y="${H / 2 + 280}" text-anchor="middle" fill="#fbbf24" font-size="44" font-weight="bold" font-family="Arial">🔗 Link in Comment Section</text>

      <rect x="${W / 2 - 200}" y="${H - 280}" width="400" height="80" rx="40" fill="#ef4444"/>
      <text x="${W / 2}" y="${H - 228}" text-anchor="middle" fill="white" font-size="34" font-weight="bold" font-family="Arial">SUBSCRIBE</text>

      <text x="${W / 2}" y="${H - 140}" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-size="28" font-family="Arial">Like and Share with friends</text>
      <text x="${W / 2}" y="${H - 60}" text-anchor="middle" fill="rgba(255,255,255,0.3)" font-size="22" font-family="Arial">SabTools.in — All Free Online Tools for India</text>
    </svg>
  `;
  await sharp(Buffer.from(svg)).png().toFile(outputPath);
}

function wrapText(text, maxChars) {
  const words = text.split(" ");
  const lines = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length > maxChars) {
      if (cur) lines.push(cur.trim());
      cur = w;
    } else {
      cur = (cur + " " + w).trim();
    }
  }
  if (cur) lines.push(cur.trim());
  return lines.slice(0, 4).join("\n");
}

function escapeXml(str) {
  return String(str || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

function getAudioDuration(audioPath) {
  return new Promise((resolve) => {
    ffmpeg.ffprobe(audioPath, (err, meta) => {
      resolve(err || !meta ? config.VIDEO_DURATION_TARGET : (meta.format.duration || config.VIDEO_DURATION_TARGET));
    });
  });
}

module.exports = { createVideo };
