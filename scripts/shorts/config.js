/**
 * YouTube Shorts Pipeline — Configuration
 */

const path = require("path");

module.exports = {
  // Gemini API for script generation
  GEMINI_API_KEY: "AIzaSyCSIMV-VmC4XODdx8QhsZcxA5e2H3ehLH4",
  GEMINI_MODEL: "gemini-2.0-flash",

  // Site details
  SITE_URL: "https://sabtools.in",
  SITE_NAME: "SabTools.in",

  // Video settings
  VIDEO_WIDTH: 1080,
  VIDEO_HEIGHT: 1920,
  VIDEO_FPS: 30,
  VIDEO_DURATION_TARGET: 50, // seconds

  // Paths
  OUTPUT_DIR: path.join(__dirname, "..", "..", "shorts-output"),
  TEMP_DIR: path.join(__dirname, "..", "..", "shorts-output", "temp"),
  YOUTUBE_CREDS: path.join(__dirname, "..", "..", "youtube-oauth.json"),
  YOUTUBE_TOKEN: path.join(__dirname, "..", "..", "youtube-token.json"),

  // YouTube channel details
  CHANNEL_DESCRIPTION: "Free online tools for India — Calculators, Converters, AI Tools & more. Visit sabtools.in",

  // Background music (royalty-free)
  // Will be generated as a simple tone if not provided
  BG_MUSIC: path.join(__dirname, "silence.mp3"),

  // Branding colors
  BRAND_COLOR: "#4f46e5", // indigo
  BRAND_COLOR_LIGHT: "#e0e7ff",
  TEXT_COLOR: "#1e1b4b",

  // Popular tools to prioritize for shorts
  PRIORITY_TOOLS: [
    "emi-calculator", "sip-calculator", "gst-calculator", "age-calculator",
    "income-tax-calculator", "percentage-calculator", "bmi-calculator",
    "salary-calculator", "love-calculator", "word-counter", "json-formatter",
    "fd-calculator", "rd-calculator", "ppf-calculator", "image-compressor",
    "qr-code-generator", "password-generator", "discount-calculator",
    "compound-interest-calculator", "home-loan-calculator",
  ],
};
