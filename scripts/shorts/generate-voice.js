/**
 * Step 3: Generate voiceover using Google Text-to-Speech API (free tier)
 * Falls back to saving script text for manual TTS if API unavailable
 */

const fs = require("fs");
const path = require("path");
const config = require("./config");

async function generateVoice(script) {
  const tempDir = config.TEMP_DIR;
  fs.mkdirSync(tempDir, { recursive: true });

  const fullNarration = [
    script.hook,
    script.narration1,
    script.narration2,
    script.cta,
  ].join(". ");

  // Try Google Cloud TTS first
  const audioPath = path.join(tempDir, "narration.mp3");

  // Use Gemini to generate SSML-optimized text
  const ssmlText = `<speak>
    <prosody rate="medium" pitch="+1st">
      <emphasis level="strong">${escapeXml(script.hook)}</emphasis>
      <break time="800ms"/>
      ${escapeXml(script.narration1)}
      <break time="600ms"/>
      ${escapeXml(script.narration2)}
      <break time="500ms"/>
      <emphasis level="moderate">${escapeXml(script.cta)}</emphasis>
    </prosody>
  </speak>`;

  // Try free TTS APIs
  let success = false;

  // Method 1: Google Translate TTS (free, no API key needed)
  try {
    const segments = [script.hook, script.narration1, script.narration2, script.cta];
    const audioBuffers = [];

    for (const segment of segments) {
      if (!segment) continue;
      // Google Translate TTS — free, supports Hindi
      const encodedText = encodeURIComponent(segment.slice(0, 200));
      const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodedText}&tl=hi&client=tw-ob`;

      const response = await fetch(ttsUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      });

      if (response.ok) {
        const buffer = Buffer.from(await response.arrayBuffer());
        audioBuffers.push(buffer);
      }
    }

    if (audioBuffers.length > 0) {
      // Combine all audio segments
      const combined = Buffer.concat(audioBuffers);
      fs.writeFileSync(audioPath, combined);
      success = true;
      console.log("Voice generated via Google Translate TTS");
    }
  } catch (err) {
    console.log("Google Translate TTS failed:", err.message);
  }

  // Method 2: Generate silent audio + save script for manual voiceover
  if (!success) {
    console.log("TTS unavailable. Generating silent audio + script file.");
    console.log("You can add voiceover manually or use any TTS tool.");

    // Save the script text for manual recording
    const scriptPath = path.join(tempDir, "narration_script.txt");
    fs.writeFileSync(scriptPath, fullNarration);

    // Generate silent audio (will be replaced by music)
    await generateSilentAudio(audioPath, config.VIDEO_DURATION_TARGET);
  }

  return {
    audioPath,
    narrationText: fullNarration,
    ssml: ssmlText,
  };
}

async function generateSilentAudio(outputPath, durationSec) {
  // Create a minimal valid MP3 file (silent)
  // This is a tiny valid MP3 frame repeated
  const ffmpeg = require("fluent-ffmpeg");
  const ffmpegInstaller = require("@ffmpeg-installer/ffmpeg");
  ffmpeg.setFfmpegPath(ffmpegInstaller.path);

  return new Promise((resolve, reject) => {
    ffmpeg()
      .input("anullsrc=r=44100:cl=mono")
      .inputFormat("lavfi")
      .duration(durationSec)
      .audioCodec("libmp3lame")
      .audioBitrate("128k")
      .output(outputPath)
      .on("end", resolve)
      .on("error", (err) => {
        // If ffmpeg fails, create a minimal file
        console.log("FFmpeg silent audio failed, creating placeholder");
        fs.writeFileSync(outputPath, Buffer.alloc(1024));
        resolve();
      })
      .run();
  });
}

function escapeXml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

module.exports = { generateVoice };
