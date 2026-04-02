/**
 * Long Video: Generate voiceover for each scene
 * Uses Google Translate TTS (free)
 */

const fs = require("fs");
const path = require("path");
const config = require("./config");

async function generateVoiceover(scenes) {
  const tempDir = config.TEMP_DIR;
  fs.mkdirSync(tempDir, { recursive: true });

  const audioSegments = [];

  // Generate audio for intro
  console.log("     Generating intro voiceover...");
  const introAudio = await generateTTS(config.NARRATION.intro, path.join(tempDir, "voice_intro.mp3"));
  audioSegments.push({ label: "Intro", path: introAudio });

  // Generate audio for each scene
  for (let i = 0; i < scenes.length; i++) {
    const scene = scenes[i];
    if (!scene.narration) continue;
    console.log(`     Generating voice for: ${scene.label}...`);
    const audioPath = path.join(tempDir, `voice_scene_${i}.mp3`);
    const result = await generateTTS(scene.narration, audioPath);
    audioSegments.push({ label: scene.label, path: result });
    scene.audioPath = result;
  }

  // Generate audio for outro
  console.log("     Generating outro voiceover...");
  const outroAudio = await generateTTS(config.NARRATION.outro, path.join(tempDir, "voice_outro.mp3"));
  audioSegments.push({ label: "Outro", path: outroAudio });

  // Combine all audio into one file
  const combinedPath = path.join(tempDir, "full_narration.mp3");
  await combineAudio(audioSegments.map((s) => s.path), combinedPath);

  console.log(`     ${audioSegments.length} audio segments combined`);

  return {
    combinedPath,
    segments: audioSegments,
  };
}

async function generateTTS(text, outputPath) {
  try {
    // Split long text into chunks (Google Translate TTS limit ~200 chars)
    const chunks = splitText(text, 180);
    const buffers = [];

    for (const chunk of chunks) {
      const encodedText = encodeURIComponent(chunk);
      const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodedText}&tl=hi&client=tw-ob`;

      const response = await fetch(ttsUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      });

      if (response.ok) {
        const buffer = Buffer.from(await response.arrayBuffer());
        buffers.push(buffer);
      }

      // Small delay to avoid rate limiting
      await new Promise((r) => setTimeout(r, 300));
    }

    if (buffers.length > 0) {
      fs.writeFileSync(outputPath, Buffer.concat(buffers));
      return outputPath;
    }
  } catch (err) {
    console.log(`     TTS failed for segment: ${err.message}`);
  }

  // Fallback: generate silent audio
  await generateSilentAudio(outputPath, 5);
  return outputPath;
}

function splitText(text, maxLen) {
  const sentences = text.split(/(?<=[।.!?])\s+/);
  const chunks = [];
  let current = "";

  for (const sentence of sentences) {
    if ((current + " " + sentence).length > maxLen && current) {
      chunks.push(current.trim());
      current = sentence;
    } else {
      current = (current + " " + sentence).trim();
    }
  }
  if (current) chunks.push(current.trim());
  return chunks;
}

async function combineAudio(audioPaths, outputPath) {
  const ffmpeg = require("fluent-ffmpeg");
  const ffmpegInstaller = require("@ffmpeg-installer/ffmpeg");
  ffmpeg.setFfmpegPath(ffmpegInstaller.path);

  // Create file list for concat
  const listPath = path.join(config.TEMP_DIR, "audio_list.txt");
  const listContent = audioPaths
    .filter((p) => fs.existsSync(p) && fs.statSync(p).size > 100)
    .map((p) => `file '${p}'`)
    .join("\n");
  fs.writeFileSync(listPath, listContent);

  return new Promise((resolve, reject) => {
    ffmpeg()
      .input(listPath)
      .inputOptions(["-f", "concat", "-safe", "0"])
      .audioCodec("libmp3lame")
      .audioBitrate("128k")
      .output(outputPath)
      .on("end", () => resolve(outputPath))
      .on("error", (err) => {
        console.log("     Audio combine failed, using first segment:", err.message);
        // Fallback: just use first segment
        if (audioPaths[0] && fs.existsSync(audioPaths[0])) {
          fs.copyFileSync(audioPaths[0], outputPath);
        }
        resolve(outputPath);
      })
      .run();
  });
}

async function generateSilentAudio(outputPath, durationSec) {
  const ffmpeg = require("fluent-ffmpeg");
  const ffmpegInstaller = require("@ffmpeg-installer/ffmpeg");
  ffmpeg.setFfmpegPath(ffmpegInstaller.path);

  return new Promise((resolve) => {
    ffmpeg()
      .input("anullsrc=r=44100:cl=mono")
      .inputFormat("lavfi")
      .duration(durationSec)
      .audioCodec("libmp3lame")
      .audioBitrate("128k")
      .output(outputPath)
      .on("end", resolve)
      .on("error", () => {
        fs.writeFileSync(outputPath, Buffer.alloc(1024));
        resolve();
      })
      .run();
  });
}

module.exports = { generateVoiceover };
