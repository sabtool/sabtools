/**
 * Long Video: Upload to YouTube (regular video, not Short)
 * Auto-posts comment with website link
 */

const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");
const config = require("./config");

async function uploadLongVideo(videoPath) {
  const credsPath = config.YOUTUBE_CREDS;
  const tokenPath = config.YOUTUBE_TOKEN;

  if (!fs.existsSync(credsPath)) {
    console.log("\n   YouTube OAuth credentials not found!");
    console.log(`   Place your OAuth client JSON at: ${credsPath}`);
    console.log("   Video saved locally. You can upload manually.");
    return null;
  }

  if (!fs.existsSync(tokenPath)) {
    console.log("\n   YouTube token not found! Run auth first:");
    console.log("   node scripts/shorts/auth-youtube.js");
    return null;
  }

  const credentials = JSON.parse(fs.readFileSync(credsPath, "utf-8"));
  const { client_id, client_secret, redirect_uris } = credentials.installed || credentials.web || {};

  const oauth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris?.[0] || "urn:ietf:wg:oauth:2.0:oob"
  );

  const token = JSON.parse(fs.readFileSync(tokenPath, "utf-8"));
  oauth2Client.setCredentials(token);

  // Refresh if expired
  if (token.expiry_date && Date.now() >= token.expiry_date) {
    try {
      const { credentials: newToken } = await oauth2Client.refreshAccessToken();
      oauth2Client.setCredentials(newToken);
      fs.writeFileSync(tokenPath, JSON.stringify(newToken, null, 2));
    } catch (err) {
      console.log("   Token expired. Re-run: node scripts/shorts/auth-youtube.js");
      return null;
    }
  }

  const youtube = google.youtube({ version: "v3", auth: oauth2Client });

  const title = "497+ FREE Online Tools for India — SabTools.in Complete Walkthrough & Tutorial 2026";
  const description = [
    "497+ FREE Online Tools — No Signup, No Download! SabTools.in ka complete walkthrough aur tutorial Hindi mein.",
    "",
    "Is video mein main aapko dikhata hoon SabTools.in ke popular tools kaise use karte hain — EMI Calculator, SIP Calculator, GST Calculator, Age Calculator, Percentage Calculator, QR Code Generator, aur 450+ free tools!",
    "",
    "🔗 Website: https://sabtools.in",
    "",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "⏱️ TIMESTAMPS:",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "0:00 — Introduction — SabTools.in kya hai?",
    "0:05 — Homepage Tour",
    "0:14 — All Categories Overview",
    "0:24 — 🏦 EMI Calculator — Home Loan EMI kaise calculate karein",
    "0:43 — 📈 SIP Calculator — Monthly SIP returns kaise dekhein",
    "1:02 — 🧾 GST Calculator — GST amount calculate karein",
    "1:18 — 🎂 Age Calculator — Exact age years, months, days mein",
    "1:35 — 📊 Percentage Calculator — Koi bhi percentage 2 sec mein",
    "1:50 — 📱 QR Code Generator — Free QR code banayein",
    "2:08 — ⭐ Why SabTools.in? — 5 reasons",
    "2:16 — Subscribe & Visit",
    "",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "🔗 TOOL LINKS (Direct Access):",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "🏦 EMI Calculator: https://sabtools.in/tools/emi-calculator",
    "📈 SIP Calculator: https://sabtools.in/tools/sip-calculator",
    "🧾 GST Calculator: https://sabtools.in/tools/gst-calculator",
    "🎂 Age Calculator: https://sabtools.in/tools/age-calculator",
    "📊 Percentage Calculator: https://sabtools.in/tools/percentage-calculator",
    "📱 QR Code Generator: https://sabtools.in/tools/qr-code-generator",
    "💰 FD Calculator: https://sabtools.in/tools/fd-calculator",
    "💵 RD Calculator: https://sabtools.in/tools/rd-calculator",
    "🏠 Home Loan Calculator: https://sabtools.in/tools/home-loan-calculator",
    "💼 Salary Calculator: https://sabtools.in/tools/salary-calculator",
    "📝 Income Tax Calculator: https://sabtools.in/tools/income-tax-calculator",
    "🔒 Password Generator: https://sabtools.in/tools/password-generator",
    "🖼️ Image Compressor: https://sabtools.in/tools/image-compressor",
    "📄 JSON Formatter: https://sabtools.in/tools/json-formatter",
    "💕 Love Calculator: https://sabtools.in/tools/love-calculator",
    "🔢 Compound Interest: https://sabtools.in/tools/compound-interest-calculator",
    "🏷️ Discount Calculator: https://sabtools.in/tools/discount-calculator",
    "📐 BMI Calculator: https://sabtools.in/tools/bmi-calculator",
    "✍️ Word Counter: https://sabtools.in/tools/word-counter",
    "🔑 PPF Calculator: https://sabtools.in/tools/ppf-calculator",
    "",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "✅ WHY SABTOOLS.IN?",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "✔️ 497+ Free Online Tools",
    "✔️ No Signup / No Login Required",
    "✔️ 100% Free — No Hidden Charges",
    "✔️ Your Data is Safe — All Processing in Browser",
    "✔️ Mobile Friendly — Works on Any Device",
    "✔️ No App Download Needed",
    "✔️ Made for India — Indian Tax Slabs, EMI, GST, etc.",
    "",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "📂 TOOL CATEGORIES:",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "💰 Finance & Tax — EMI, SIP, FD, RD, PPF, GST, Income Tax",
    "📚 Education — CGPA, GPA, Age Calculator, Resume Builder",
    "🔧 Everyday Utilities — Unit Converter, Currency, Percentage",
    "📄 PDF Tools — Merge, Split, Compress, Image to PDF",
    "🖼️ Image Tools — Compress, Resize, Convert, Base64",
    "👨‍💻 Developer Tools — JSON, Base64, URL Encoder, Hash, Regex",
    "📱 QR Code — QR Generator, UPI QR, Barcode",
    "🔍 Lookup — IFSC, Pincode, RTO Code",
    "📝 Text Tools — Word Counter, Case Converter, Diff Checker",
    "",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "",
    "👍 Like this video if you found it useful!",
    "🔔 Subscribe for more free tools tutorials!",
    "📤 Share with friends who need free online tools!",
    "💬 Comment which tool you want me to demo next!",
    "",
    "#SabTools #FreeTools #India #OnlineCalculator #EMICalculator #SIPCalculator #GSTCalculator #AgeCalculator #PercentageCalculator #QRCodeGenerator #FreeOnlineTools #Tutorial #HowTo #FreeToolsIndia #Calculator #OnlineTools #SabToolsIn #NoSignup #FreeSoftware #IndianTools #FinanceCalculator #TaxCalculator",
  ].join("\n");

  const tags = [
    "sabtools", "free online tools", "free tools india",
    "emi calculator", "sip calculator", "gst calculator",
    "age calculator", "percentage calculator", "qr code generator",
    "free calculator", "online calculator", "income tax calculator",
    "fd calculator", "home loan calculator", "salary calculator",
  ];

  console.log(`\n   Uploading to YouTube: "${title}"`);

  try {
    const res = await youtube.videos.insert({
      part: "snippet,status",
      requestBody: {
        snippet: {
          title,
          description,
          tags,
          categoryId: "28", // Science & Technology
          defaultLanguage: "en",
          defaultAudioLanguage: "hi",
        },
        status: {
          privacyStatus: "public",
          selfDeclaredMadeForKids: false,
          embeddable: true,
        },
      },
      media: {
        body: fs.createReadStream(videoPath),
      },
    });

    const videoId = res.data.id;
    const videoUrl = `https://youtube.com/watch?v=${videoId}`;
    console.log(`\n   Uploaded successfully!`);
    console.log(`   URL: ${videoUrl}`);

    // Auto-comment with all tool links (SEO backlinks)
    try {
      const commentText = [
        `🔗 Visit SabTools.in — 497+ FREE Online Tools: https://sabtools.in`,
        ``,
        `━━━ Popular Tools (Click to Use FREE) ━━━`,
        ``,
        `💰 FINANCE & TAX:`,
        `🏦 EMI Calculator: https://sabtools.in/tools/emi-calculator`,
        `📈 SIP Calculator: https://sabtools.in/tools/sip-calculator`,
        `🧾 GST Calculator: https://sabtools.in/tools/gst-calculator`,
        `📝 Income Tax Calculator: https://sabtools.in/tools/income-tax-calculator`,
        `💰 FD Calculator: https://sabtools.in/tools/fd-calculator`,
        `💵 RD Calculator: https://sabtools.in/tools/rd-calculator`,
        `🔑 PPF Calculator: https://sabtools.in/tools/ppf-calculator`,
        `🏠 Home Loan Calculator: https://sabtools.in/tools/home-loan-calculator`,
        `💼 Salary Calculator: https://sabtools.in/tools/salary-calculator`,
        `🔢 Compound Interest: https://sabtools.in/tools/compound-interest-calculator`,
        `🏷️ Discount Calculator: https://sabtools.in/tools/discount-calculator`,
        `📊 Simple Interest: https://sabtools.in/tools/simple-interest-calculator`,
        ``,
        `📚 EDUCATION & EVERYDAY:`,
        `🎂 Age Calculator: https://sabtools.in/tools/age-calculator`,
        `📊 Percentage Calculator: https://sabtools.in/tools/percentage-calculator`,
        `📐 BMI Calculator: https://sabtools.in/tools/bmi-calculator`,
        `💕 Love Calculator: https://sabtools.in/tools/love-calculator`,
        ``,
        `👨‍💻 DEVELOPER & TEXT TOOLS:`,
        `📄 JSON Formatter: https://sabtools.in/tools/json-formatter`,
        `✍️ Word Counter: https://sabtools.in/tools/word-counter`,
        `🔒 Password Generator: https://sabtools.in/tools/password-generator`,
        `📱 QR Code Generator: https://sabtools.in/tools/qr-code-generator`,
        `🖼️ Image Compressor: https://sabtools.in/tools/image-compressor`,
        ``,
        `✅ No Signup | 100% Free | Works on Mobile & Desktop`,
        ``,
        `Like, Share & Subscribe for more! 🙏`,
        `#SabTools #FreeTools #India`,
      ].join("\n");

      await youtube.commentThreads.insert({
        part: "snippet",
        requestBody: {
          snippet: {
            videoId,
            topLevelComment: {
              snippet: { textOriginal: commentText },
            },
          },
        },
      });
      console.log(`   Comment posted with all tool links!`);
    } catch (commentErr) {
      console.log(`   Comment failed: ${commentErr.message}`);
    }

    return { videoId, videoUrl };
  } catch (err) {
    console.error("   Upload failed:", err.message);
    if (err.errors) {
      err.errors.forEach((e) => console.error(`     - ${e.reason}: ${e.message}`));
    }
    return null;
  }
}

module.exports = { uploadLongVideo };
