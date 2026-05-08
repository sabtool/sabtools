/**
 * Long-form YouTube Video — Configuration
 */

const path = require("path");

module.exports = {
  // Site details
  SITE_URL: "https://sabtools.in",
  SITE_NAME: "SabTools.in",
  SITE_TAGLINE: "450+ Free Online Tools for India",

  // Video settings (landscape 1080p)
  VIDEO_WIDTH: 1920,
  VIDEO_HEIGHT: 1080,
  VIDEO_FPS: 30,

  // Paths
  OUTPUT_DIR: path.join(__dirname, "..", "..", "long-video-output"),
  TEMP_DIR: path.join(__dirname, "..", "..", "long-video-output", "temp"),
  YOUTUBE_CREDS: path.join(__dirname, "..", "..", "youtube-oauth.json"),
  YOUTUBE_TOKEN: path.join(__dirname, "..", "..", "youtube-token.json"),

  // Branding colors
  BRAND_COLOR: "#4f46e5",
  BRAND_GRADIENT_START: "#0f0a2e",
  BRAND_GRADIENT_END: "#312e81",

  // Tools to demo in the video (5-6 popular ones across categories)
  DEMO_TOOLS: [
    {
      slug: "emi-calculator",
      name: "EMI Calculator",
      icon: "🏦",
      category: "Finance",
      values: ["2500000", "8.5", "20"],
      narration: "Sabse pehle dekhte hain EMI Calculator. Agar aap home loan le rahe ho 25 lakh ka, 8.5% interest pe, 20 saal ke liye — bas yeh teen values enter karo aur turant pata chal jaayega aapki monthly EMI kitni hogi. Chart bhi dikhata hai kitna interest aur kitna principal pay hoga.",
    },
    {
      slug: "sip-calculator",
      name: "SIP Calculator",
      icon: "📈",
      category: "Finance",
      values: ["5000", "12", "10"],
      narration: "Ab dekhte hain SIP Calculator. Agar har mahine 5000 rupaye invest karo, 12% expected return pe, 10 saal ke liye — dekho kitna paisa ban jaayega! Yeh tool aapko wealth growth ka poora breakdown dikhata hai.",
    },
    {
      slug: "gst-calculator",
      name: "GST Calculator",
      icon: "🧾",
      category: "Finance",
      values: ["10000", "18"],
      narration: "GST Calculator se kisi bhi amount pe GST calculate karo. 10000 rupaye pe 18% GST — CGST, SGST, aur total amount sab turant mil jaata hai. Business owners ke liye bahut useful hai.",
    },
    {
      slug: "age-calculator",
      name: "Age Calculator",
      icon: "🎂",
      category: "Everyday",
      values: ["1995-06-15"],
      narration: "Age Calculator mein apni date of birth enter karo aur exact age pata karo years, months, aur days mein. Government job ke liye age limit check karna ho toh yeh tool perfect hai.",
    },
    {
      slug: "percentage-calculator",
      name: "Percentage Calculator",
      icon: "📊",
      category: "Education",
      values: ["750", "25"],
      narration: "Percentage Calculator se koi bhi percentage 2 second mein calculate karo. Students ke liye exam marks calculate karna ho ya discount calculate karna ho — sab yahan hoga.",
    },
    {
      slug: "qr-code-generator",
      name: "QR Code Generator",
      icon: "📱",
      category: "QR Code",
      values: ["https://sabtools.in"],
      narration: "QR Code Generator se koi bhi link, text, ya UPI ID ka QR code banao. Bas text enter karo aur QR code ready! Download karke kahi bhi use karo — bilkul free.",
    },
  ],

  // Website sections to show
  SECTIONS: [
    { name: "Homepage", url: "/", holdTime: 3 },
    { name: "All Tools", url: "/tools", holdTime: 4 },
    { name: "Finance Tools", url: "/tools?category=finance", holdTime: 3 },
    { name: "Developer Tools", url: "/tools?category=developer", holdTime: 3 },
  ],

  // Full script narration segments
  NARRATION: {
    intro: "Namaste dosto! Aaj main aapko dikhata hoon ek aisi website jo har Indian ke kaam aa sakti hai. SabTools.in pe 460 se zyada free online tools hain — calculators, converters, PDF tools, image tools, developer tools, aur bahut kuch. Aur sabse acchi baat? Koi signup nahi chahiye, koi app download nahi karna, sab kuch browser mein free mein kaam karta hai!",
    homepage: "Yeh hai SabTools.in ka homepage. Yahan se aap koi bhi tool search kar sakte ho ya category wise browse kar sakte ho. Website mobile pe bhi perfectly kaam karti hai.",
    categories: "Website mein 9 categories hain — Finance and Tax mein 20 se zyada tools hain jaise EMI Calculator, SIP Calculator, GST Calculator. Education section mein CGPA converter, Age Calculator hai. Developer tools mein JSON formatter, Base64 encoder, aur bahut kuch hai. PDF tools se aap merge, split, compress kar sakte ho. Image tools se compress aur resize kar sakte ho.",
    toolsDemo: "Ab main aapko kuch popular tools live demo karke dikhata hoon. Dekhiye kitna easy hai use karna!",
    features: "SabTools.in ki kuch special features hain. Number one — sab tools 100% free hain, koi hidden charges nahi. Number two — koi signup ya login nahi chahiye. Number three — aapka data safe hai kyunki sab calculation browser mein hoti hai, server pe kuch nahi jaata. Number four — mobile friendly hai, phone pe bhi achhe se kaam karta hai. Aur number five — 460 se zyada tools ek jagah pe!",
    outro: "Toh dosto, agar aapko yeh website useful lagi toh abhi visit karo sabtools.in. Link comment section mein hai! Like karo, share karo apne doston ke saath, aur channel subscribe karo. Naye tools aur tutorials ke liye bell icon zaroor dabao. Milte hain next video mein!",
  },
};
