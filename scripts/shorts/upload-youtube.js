/**
 * Step 5: Upload video to YouTube as a Short
 * Uses YouTube Data API v3 with OAuth2
 */

const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");
const readline = require("readline");
const config = require("./config");

const SCOPES = [
  "https://www.googleapis.com/auth/youtube.upload",
  "https://www.googleapis.com/auth/youtube.force-ssl",
];

async function uploadToYouTube(videoPath, script, tool) {
  const credsPath = config.YOUTUBE_CREDS;
  const tokenPath = config.YOUTUBE_TOKEN;

  if (!fs.existsSync(credsPath)) {
    console.log("\n⚠️  YouTube OAuth credentials not found!");
    console.log(`Place your OAuth client JSON at: ${credsPath}`);
    console.log("Download it from Google Cloud Console → Credentials → OAuth 2.0 Client IDs");
    console.log("\nVideo saved locally. You can upload manually to YouTube.");
    return null;
  }

  const credentials = JSON.parse(fs.readFileSync(credsPath, "utf-8"));
  const { client_id, client_secret, redirect_uris } = credentials.installed || credentials.web || {};

  if (!client_id || !client_secret) {
    console.log("Invalid OAuth credentials file.");
    return null;
  }

  const oauth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris?.[0] || "urn:ietf:wg:oauth:2.0:oob"
  );

  // Check for existing token
  if (fs.existsSync(tokenPath)) {
    const token = JSON.parse(fs.readFileSync(tokenPath, "utf-8"));
    oauth2Client.setCredentials(token);

    // Refresh if expired
    if (token.expiry_date && Date.now() >= token.expiry_date) {
      try {
        const { credentials: newToken } = await oauth2Client.refreshAccessToken();
        oauth2Client.setCredentials(newToken);
        fs.writeFileSync(tokenPath, JSON.stringify(newToken, null, 2));
      } catch {
        console.log("Token expired. Need to re-authenticate.");
        await authenticate(oauth2Client, tokenPath);
      }
    }
  } else {
    await authenticate(oauth2Client, tokenPath);
  }

  // Upload video
  const youtube = google.youtube({ version: "v3", auth: oauth2Client });

  const title = (script.title || `${tool.name} — Free Online Tool | SabTools.in`).slice(0, 100);
  const description = [
    script.description || `Use ${tool.name} for free at sabtools.in`,
    "",
    `Try it now: https://sabtools.in/tools/${tool.slug}`,
    "",
    "497+ Free Online Tools — No Signup Required",
    "Visit: https://sabtools.in",
    "",
    "#SabTools #FreeTools #India #OnlineCalculator #FreeTool",
    script.tags?.map((t) => `#${t.replace(/\s+/g, "")}`).join(" ") || "",
  ].join("\n");

  const tags = [
    tool.name,
    "free online tools",
    "sabtools",
    "india",
    "calculator",
    "free",
    ...(script.tags || []),
  ].slice(0, 15);

  console.log(`\nUploading to YouTube: "${title}"`);

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
    const videoUrl = `https://youtube.com/shorts/${videoId}`;
    console.log(`\n✅ Uploaded successfully!`);
    console.log(`URL: ${videoUrl}`);

    // Auto-comment with tool link (pinned comment for backlink)
    try {
      const toolUrl = `https://sabtools.in/tools/${tool.slug}`;
      const commentText = [
        `🔗 Try ${tool.name} FREE: ${toolUrl}`,
        ``,
        `👆 No signup needed — works on mobile & desktop!`,
        `497+ Free Online Tools at https://sabtools.in`,
        ``,
        `⏱️ Timestamps:`,
        `0:00 — Introduction`,
        `0:03 — How to use ${tool.name}`,
        `0:20 — Results & features`,
        `0:28 — Try it yourself!`,
        ``,
        `#SabTools #FreeTools #India`,
      ].join("\n");

      const commentRes = await youtube.commentThreads.insert({
        part: "snippet",
        requestBody: {
          snippet: {
            videoId,
            topLevelComment: {
              snippet: {
                textOriginal: commentText,
              },
            },
          },
        },
      });
      console.log(`📝 Comment posted with tool link: ${toolUrl}`);
    } catch (commentErr) {
      console.log(`⚠️  Comment failed (will retry manually): ${commentErr.message}`);
    }

    return { videoId, videoUrl };
  } catch (err) {
    console.error("Upload failed:", err.message);
    if (err.errors) {
      err.errors.forEach((e) => console.error(`  - ${e.reason}: ${e.message}`));
    }
    return null;
  }
}

async function authenticate(oauth2Client, tokenPath) {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent",
  });

  console.log("\n🔑 First-time YouTube authentication required.");
  console.log("Open this URL in your browser:\n");
  console.log(authUrl);
  console.log("");

  const code = await askQuestion("Enter the authorization code: ");

  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  fs.writeFileSync(tokenPath, JSON.stringify(tokens, null, 2));
  console.log("Authentication successful! Token saved.\n");
}

function askQuestion(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

module.exports = { uploadToYouTube };
