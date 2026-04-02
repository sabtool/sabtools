const path = require("path");

const ROOT = path.join(__dirname, "..", "..");

module.exports = {
  // Pinterest Login Credentials (for browser automation)
  PINTEREST_EMAIL: process.env.PINTEREST_EMAIL || "",
  PINTEREST_PASSWORD: process.env.PINTEREST_PASSWORD || "",

  // Pinterest API credentials (optional — for when developer portal is back)
  PINTEREST_APP_ID: process.env.PINTEREST_APP_ID || "",
  PINTEREST_APP_SECRET: process.env.PINTEREST_APP_SECRET || "",
  PINTEREST_ACCESS_TOKEN: process.env.PINTEREST_ACCESS_TOKEN || "",

  // Token file for OAuth
  PINTEREST_TOKEN_FILE: path.join(ROOT, "pinterest-token.json"),

  // Cookie file for browser sessions
  COOKIE_FILE: path.join(__dirname, "cookies.json"),

  // Log file
  LOG_FILE: path.join(__dirname, "pin-log.json"),

  // Board name to post to (will be auto-created if missing)
  BOARD_NAME: "Free Online Tools India",

  // Pin settings
  PIN_WIDTH: 1000,
  PIN_HEIGHT: 1500, // Pinterest optimal 2:3 ratio

  // Paths
  ROOT,
  TEMP_DIR: path.join(ROOT, "temp", "pinterest"),
  OUTPUT_DIR: path.join(ROOT, "output", "pinterest"),

  // Website
  SITE_URL: "https://sabtools.in",
  SITE_NAME: "SabTools.in",

  // All tool categories for board organization
  BOARDS: {
    finance: "Free Finance Calculators India",
    education: "Free Education Tools India",
    health: "Free Health Calculators",
    developer: "Free Developer Tools Online",
    text: "Free Text Tools Online",
    image: "Free Image Tools Online",
    pdf: "Free PDF Tools Online",
    qrcode: "Free QR Code Tools",
    conversion: "Free Conversion Tools",
    math: "Free Math Calculators",
    fun: "Free Fun Tools Online",
    everyday: "Free Everyday Tools India",
  },

  // Priority tools to post first
  PRIORITY_TOOLS: [
    { slug: "emi-calculator", name: "EMI Calculator", category: "finance", keywords: "EMI calculator India, home loan EMI, car loan EMI, loan calculator" },
    { slug: "sip-calculator", name: "SIP Calculator", category: "finance", keywords: "SIP calculator India, mutual fund SIP, SIP returns calculator" },
    { slug: "gst-calculator", name: "GST Calculator", category: "finance", keywords: "GST calculator India, GST calculation online, CGST SGST calculator" },
    { slug: "income-tax-calculator", name: "Income Tax Calculator", category: "finance", keywords: "income tax calculator India 2024, tax calculator old regime new regime" },
    { slug: "fd-calculator", name: "FD Calculator", category: "finance", keywords: "FD calculator India, fixed deposit calculator, FD interest calculator" },
    { slug: "age-calculator", name: "Age Calculator", category: "education", keywords: "age calculator, exact age calculator, age in days months years" },
    { slug: "percentage-calculator", name: "Percentage Calculator", category: "math", keywords: "percentage calculator, percent calculation, marks percentage" },
    { slug: "bmi-calculator", name: "BMI Calculator", category: "health", keywords: "BMI calculator India, body mass index, BMI check online" },
    { slug: "compound-interest-calculator", name: "Compound Interest Calculator", category: "finance", keywords: "compound interest calculator, CI calculator, interest calculator" },
    { slug: "simple-interest-calculator", name: "Simple Interest Calculator", category: "finance", keywords: "simple interest calculator, SI calculator India" },
    { slug: "salary-calculator", name: "Salary Calculator", category: "finance", keywords: "salary calculator India, CTC to take home, in-hand salary calculator" },
    { slug: "home-loan-calculator", name: "Home Loan Calculator", category: "finance", keywords: "home loan calculator, housing loan EMI, home loan interest" },
    { slug: "ppf-calculator", name: "PPF Calculator", category: "finance", keywords: "PPF calculator, public provident fund, PPF maturity amount" },
    { slug: "rd-calculator", name: "RD Calculator", category: "finance", keywords: "RD calculator, recurring deposit calculator, RD maturity" },
    { slug: "love-calculator", name: "Love Calculator", category: "fun", keywords: "love calculator, love percentage, love test online" },
    { slug: "discount-calculator", name: "Discount Calculator", category: "finance", keywords: "discount calculator, percentage off calculator, sale price calculator" },
    { slug: "qr-code-generator", name: "QR Code Generator", category: "qrcode", keywords: "QR code generator free, create QR code online, QR code maker" },
    { slug: "password-generator", name: "Password Generator", category: "developer", keywords: "password generator, strong password, random password generator" },
    { slug: "word-counter", name: "Word Counter", category: "text", keywords: "word counter online, character counter, word count tool" },
    { slug: "json-formatter", name: "JSON Formatter", category: "developer", keywords: "JSON formatter online, JSON beautifier, JSON validator" },
    { slug: "image-compressor", name: "Image Compressor", category: "image", keywords: "image compressor online, reduce image size, compress photo KB" },
    { slug: "pdf-to-jpg", name: "PDF to JPG Converter", category: "pdf", keywords: "PDF to JPG, convert PDF to image, PDF converter online" },
    { slug: "color-picker", name: "Color Picker", category: "developer", keywords: "color picker online, hex color picker, RGB to HEX" },
    { slug: "unit-converter", name: "Unit Converter", category: "conversion", keywords: "unit converter, measurement converter, online converter" },
    { slug: "tip-calculator", name: "Tip Calculator", category: "everyday", keywords: "tip calculator, split bill calculator, tip percentage" },
  ],
};
