#!/usr/bin/env node

/**
 * Automated Weekly Long Video Creator
 * Rotates through tool categories each week
 * Creates walkthrough, uploads, sets thumbnail, posts comment
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..", "..");
const LOG_FILE = path.join(ROOT, "scripts", "scheduler", "run-log.json");
const LOCK_FILE = path.join(ROOT, "scripts", "scheduler", ".lock-long");
const ROTATION_FILE = path.join(ROOT, "scripts", "scheduler", "rotation.json");

// Category rotation — each week features different tools
const CATEGORY_ROTATIONS = [
  {
    label: "Finance Tools Part 1",
    tools: [
      { slug: "emi-calculator", name: "EMI Calculator", icon: "", category: "Finance", values: ["2500000", "8.5", "20"], narration: "EMI Calculator se apne home loan, car loan ki monthly EMI calculate karo. 25 lakh ka loan, 8.5% interest, 20 saal — turant result!" },
      { slug: "sip-calculator", name: "SIP Calculator", icon: "", category: "Finance", values: ["5000", "12", "10"], narration: "SIP Calculator se dekhte hain 5000 monthly invest karne pe 10 saal mein kitna milega. 12% expected return pe — amount dekh ke surprise ho jaoge!" },
      { slug: "fd-calculator", name: "FD Calculator", icon: "", category: "Finance", values: ["100000", "7.5", "5"], narration: "FD Calculator mein 1 lakh ki FD 7.5% pe 5 saal ke liye — maturity amount turant pata chal jaayega." },
      { slug: "gst-calculator", name: "GST Calculator", icon: "", category: "Finance", values: ["10000", "18"], narration: "GST Calculator — 10000 rupaye pe 18% GST calculate karo. CGST aur SGST dono alag alag dikhaata hai." },
      { slug: "compound-interest-calculator", name: "Compound Interest", icon: "", category: "Finance", values: ["100000", "8", "5"], narration: "Compound Interest Calculator — 1 lakh pe 8% compound interest 5 saal mein kitna banega? Yeh tool batayega!" },
      { slug: "simple-interest-calculator", name: "Simple Interest", icon: "", category: "Finance", values: ["50000", "10", "3"], narration: "Simple Interest Calculator se basic interest calculate karo. 50000 pe 10% for 3 years — simple!" },
    ],
  },
  {
    label: "Finance Tools Part 2",
    tools: [
      { slug: "income-tax-calculator", name: "Income Tax Calculator", icon: "", category: "Finance", values: ["1200000"], narration: "Income Tax Calculator se apni salary pe kitna tax lagega calculate karo. Old regime vs New regime comparison bhi milega." },
      { slug: "salary-calculator", name: "Salary Calculator", icon: "", category: "Finance", values: ["50000"], narration: "Salary Calculator se CTC to take-home salary calculate karo. PF, ESI, tax sab deductions dikhaata hai." },
      { slug: "home-loan-calculator", name: "Home Loan Calculator", icon: "", category: "Finance", values: ["5000000", "8.5", "20"], narration: "Home Loan Calculator — 50 lakh ka loan 8.5% pe 20 saal. Total interest aur amortization schedule bhi milega." },
      { slug: "ppf-calculator", name: "PPF Calculator", icon: "", category: "Finance", values: ["150000", "7.1", "15"], narration: "PPF Calculator se Public Provident Fund ka maturity amount calculate karo. Tax saving ke saath safe investment!" },
      { slug: "rd-calculator", name: "RD Calculator", icon: "", category: "Finance", values: ["5000", "7", "3"], narration: "RD Calculator — har mahine 5000 deposit karo 7% pe 3 saal. Maturity amount dekho!" },
      { slug: "discount-calculator", name: "Discount Calculator", icon: "", category: "Finance", values: ["2999", "30"], narration: "Discount Calculator — MRP 2999 pe 30% discount kitna hoga? Shopping ke liye must-have tool!" },
    ],
  },
  {
    label: "Education & Everyday Tools",
    tools: [
      { slug: "age-calculator", name: "Age Calculator", icon: "", category: "Education", values: ["1995-06-15"], narration: "Age Calculator mein DOB enter karo aur exact age jaano years, months, days mein. Government jobs ke liye perfect!" },
      { slug: "percentage-calculator", name: "Percentage Calculator", icon: "", category: "Education", values: ["750", "25"], narration: "Percentage Calculator — koi bhi percentage 2 second mein. Students ke liye marks calculate karna ho ya shopping discount." },
      { slug: "bmi-calculator", name: "BMI Calculator", icon: "", category: "Health", values: ["170", "70"], narration: "BMI Calculator se apna Body Mass Index check karo. Height aur weight enter karo — underweight, normal ya overweight pata chalega." },
      { slug: "love-calculator", name: "Love Calculator", icon: "", category: "Fun", values: ["Rahul", "Priya"], narration: "Love Calculator — apna naam aur partner ka naam enter karo aur compatibility percentage dekho! Fun tool for friends." },
      { slug: "word-counter", name: "Word Counter", icon: "", category: "Text", values: ["SabTools provides 460 free online tools for India"], narration: "Word Counter se words, characters, sentences sab count karo. Content writers ke liye essential tool!" },
      { slug: "password-generator", name: "Password Generator", icon: "", category: "Security", values: ["16"], narration: "Password Generator se strong random passwords banao. Length choose karo aur secure password ready!" },
    ],
  },
  {
    label: "Developer & QR Tools",
    tools: [
      { slug: "json-formatter", name: "JSON Formatter", icon: "", category: "Developer", values: ['{"name":"SabTools","tools":460}'], narration: "JSON Formatter se messy JSON ko beautify karo. Paste karo aur formatted output turant milega. Developers ke liye must-have!" },
      { slug: "qr-code-generator", name: "QR Code Generator", icon: "", category: "QR Code", values: ["https://sabtools.in"], narration: "QR Code Generator — koi bhi link, text ya URL ka QR code banao. Download karke print karo ya share karo." },
      { slug: "image-compressor", name: "Image Compressor", icon: "", category: "Image", values: [], narration: "Image Compressor se photos ki size kam karo. Government form ke liye specific size presets bhi hain — 20KB, 50KB, 100KB." },
      { slug: "percentage-calculator", name: "Percentage Calculator", icon: "", category: "Math", values: ["750", "25"], narration: "Percentage Calculator — quick aur accurate percentage calculations." },
      { slug: "age-calculator", name: "Age Calculator", icon: "", category: "Everyday", values: ["1995-06-15"], narration: "Age Calculator — apni exact age jaano seconds tak!" },
      { slug: "emi-calculator", name: "EMI Calculator", icon: "", category: "Finance", values: ["2500000", "8.5", "20"], narration: "EMI Calculator — loan lene se pehle EMI check karo!" },
    ],
  },
];

// Prevent overlapping runs
if (fs.existsSync(LOCK_FILE)) {
  const lockAge = Date.now() - fs.statSync(LOCK_FILE).mtimeMs;
  if (lockAge < 60 * 60 * 1000) {
    console.log("Another long video run is in progress. Skipping.");
    process.exit(0);
  }
  fs.unlinkSync(LOCK_FILE);
}

fs.writeFileSync(LOCK_FILE, String(Date.now()));

function getNextRotation() {
  let rotation = { index: 0 };
  if (fs.existsSync(ROTATION_FILE)) {
    try { rotation = JSON.parse(fs.readFileSync(ROTATION_FILE, "utf-8")); } catch {}
  }
  const current = rotation.index % CATEGORY_ROTATIONS.length;
  rotation.index = current + 1;
  rotation.lastRun = new Date().toISOString();
  fs.writeFileSync(ROTATION_FILE, JSON.stringify(rotation, null, 2));
  return CATEGORY_ROTATIONS[current];
}

function log(entry) {
  let logs = [];
  if (fs.existsSync(LOG_FILE)) {
    try { logs = JSON.parse(fs.readFileSync(LOG_FILE, "utf-8")); } catch {}
  }
  logs.push({ ...entry, timestamp: new Date().toISOString() });
  if (logs.length > 200) logs = logs.slice(-200);
  fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2));
}

async function main() {
  console.log("=== Automated Weekly Long Video ===");
  console.log("Time:", new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }));

  const rotation = getNextRotation();
  console.log("Category:", rotation.label);
  console.log("Tools:", rotation.tools.map((t) => t.name).join(", "));

  try {
    // Update the long video config with this week's tools
    const configPath = path.join(ROOT, "scripts", "long-video", "config.js");
    const configContent = fs.readFileSync(configPath, "utf-8");

    // Temporarily override DEMO_TOOLS
    const longConfig = require("../long-video/config");
    longConfig.DEMO_TOOLS = rotation.tools;

    // Run capture
    const { captureWebsiteWalkthrough } = require("../long-video/capture-screens");
    const { generateVoiceover } = require("../long-video/generate-voice");
    const { createLongVideo } = require("../long-video/create-video");
    const { uploadLongVideo } = require("../long-video/upload-youtube");
    const { createThumbnail } = require("../long-video/create-thumbnail");

    fs.mkdirSync(longConfig.TEMP_DIR, { recursive: true });
    fs.mkdirSync(longConfig.OUTPUT_DIR, { recursive: true });

    // Clean temp
    if (fs.existsSync(longConfig.TEMP_DIR)) {
      fs.readdirSync(longConfig.TEMP_DIR).forEach((f) => {
        try { fs.unlinkSync(path.join(longConfig.TEMP_DIR, f)); } catch {}
      });
    }

    console.log("\n1. Capturing screenshots...");
    const scenes = await captureWebsiteWalkthrough();

    console.log("\n2. Generating voiceover...");
    const voice = await generateVoiceover(scenes);

    console.log("\n3. Creating video...");
    const videoPath = await createLongVideo(scenes, voice.combinedPath);

    console.log("\n4. Uploading to YouTube...");
    const result = await uploadLongVideo(videoPath);

    if (result) {
      console.log("\n5. Setting thumbnail...");
      const thumbPath = path.join(longConfig.OUTPUT_DIR, "thumbnail.png");
      await createThumbnail(thumbPath);

      const { google } = require("googleapis");
      const creds = JSON.parse(fs.readFileSync(longConfig.YOUTUBE_CREDS, "utf-8"));
      const { client_id, client_secret, redirect_uris } = creds.installed || creds.web || {};
      const oauth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris?.[0]);
      const token = JSON.parse(fs.readFileSync(longConfig.YOUTUBE_TOKEN, "utf-8"));
      oauth2Client.setCredentials(token);
      const youtube = google.youtube({ version: "v3", auth: oauth2Client });

      try {
        await youtube.thumbnails.set({
          videoId: result.videoId,
          media: { mimeType: "image/png", body: fs.createReadStream(thumbPath) },
        });
        console.log("Thumbnail set!");
      } catch (e) {
        console.log("Thumbnail failed:", e.message);
      }

      log({
        type: "long-video",
        status: "success",
        category: rotation.label,
        youtubeUrl: result.videoUrl,
        videoPath,
      });
    }

    console.log("\nLong video done!");
  } catch (err) {
    console.error("Long video failed:", err.message);
    log({
      type: "long-video",
      status: "failed",
      category: rotation.label,
      error: err.message.slice(0, 500),
    });
  } finally {
    try { fs.unlinkSync(LOCK_FILE); } catch {}
  }
}

main().catch((err) => {
  console.error("Fatal:", err.message);
  try { fs.unlinkSync(LOCK_FILE); } catch {}
  process.exit(1);
});
