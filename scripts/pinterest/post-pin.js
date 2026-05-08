#!/usr/bin/env node

/**
 * Posts a pin to Pinterest with SEO-optimized metadata
 * - Creates/finds the right board for the tool category
 * - Uploads pin image
 * - Adds rich description with keywords and link
 */

const fs = require("fs");
const path = require("path");
const config = require("./config");
const { authenticate } = require("./auth-pinterest");
const { createPinImage } = require("./create-pin-image");

const API_BASE = "https://api.pinterest.com/v5";

async function getAccessToken() {
  // Try existing token first
  if (fs.existsSync(config.PINTEREST_TOKEN_FILE)) {
    const token = JSON.parse(fs.readFileSync(config.PINTEREST_TOKEN_FILE, "utf-8"));
    if (token.access_token) {
      // Check if expired (tokens last 30 days, refresh lasts 365 days)
      const age = Date.now() - (token.obtained_at || 0);
      if (age < 29 * 24 * 60 * 60 * 1000) {
        return token.access_token;
      }
      // Try refresh
      const { refreshToken } = require("./auth-pinterest");
      if (token.refresh_token) {
        const refreshed = await refreshToken(token.refresh_token);
        if (refreshed) return refreshed;
      }
    }
  }
  // Need fresh auth
  return await authenticate();
}

async function apiCall(method, endpoint, token, body = null) {
  const options = {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
  if (body) options.body = JSON.stringify(body);

  const resp = await fetch(`${API_BASE}${endpoint}`, options);
  const data = await resp.json();

  if (!resp.ok) {
    throw new Error(`Pinterest API ${endpoint}: ${resp.status} — ${JSON.stringify(data)}`);
  }
  return data;
}

async function findOrCreateBoard(token, boardName) {
  // List existing boards
  const boards = await apiCall("GET", "/boards?page_size=100", token);
  const existing = boards.items?.find(
    (b) => b.name.toLowerCase() === boardName.toLowerCase()
  );

  if (existing) {
    console.log(`Board found: ${existing.name} (${existing.id})`);
    return existing.id;
  }

  // Create new board
  console.log(`Creating board: ${boardName}`);
  const newBoard = await apiCall("POST", "/boards", token, {
    name: boardName,
    description: `Free online ${boardName.toLowerCase()} at SabTools.in — No signup required! 450+ tools for India.`,
    privacy: "PUBLIC",
  });

  console.log(`Board created: ${newBoard.name} (${newBoard.id})`);
  return newBoard.id;
}

async function uploadImage(token, imagePath) {
  // Pinterest v5 requires image URL, not direct upload
  // We need to either host the image or use base64
  // Using media upload endpoint
  const FormData = (await import("form-data")).default;
  const form = new FormData();
  form.append("file", fs.createReadStream(imagePath));

  const resp = await fetch(`${API_BASE}/media`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      ...form.getHeaders(),
    },
    body: form,
  });

  if (resp.ok) {
    const data = await resp.json();
    return data.media_id;
  }
  return null;
}

function generatePinDescription(tool) {
  const toolUrl = `${config.SITE_URL}/tools/${tool.slug}`;

  const descriptions = [
    `Use this FREE ${tool.name} online at SabTools.in! No signup needed — works instantly on mobile and desktop.\n\n` +
    `${tool.keywords}\n\n` +
    `Try it now: ${toolUrl}\n\n` +
    `#${tool.slug.replace(/-/g, "")} #freetool #onlinetool #india #calculator #sabtools`,

    `Looking for a free ${tool.name.toLowerCase()}? SabTools.in has you covered! 100% free, no registration, instant results.\n\n` +
    `${tool.keywords}\n\n` +
    `${toolUrl}\n\n` +
    `450+ Free Online Tools at SabTools.in\n` +
    `#freetool #onlinecalculator #india #${tool.category} #sabtools`,

    `FREE ${tool.name} — calculate instantly online! Perfect for students, professionals, and everyone.\n\n` +
    `Features:\n` +
    `✅ 100% Free — No hidden charges\n` +
    `✅ No Signup Required\n` +
    `✅ Works on Mobile & Desktop\n` +
    `✅ Instant Results\n\n` +
    `${tool.keywords}\n\n` +
    `Try now: ${toolUrl}\n` +
    `#${tool.slug.replace(/-/g, "")} #free #onlinetool #sabtools #india`,
  ];

  return descriptions[Math.floor(Math.random() * descriptions.length)];
}

function generatePinTitle(tool) {
  const titles = [
    `FREE ${tool.name} Online — No Signup!`,
    `${tool.name} — Free Online Tool | SabTools.in`,
    `Use ${tool.name} FREE — Instant Results!`,
    `Best Free ${tool.name} Online for India`,
    `${tool.name} — 100% Free, No Download`,
  ];
  return titles[Math.floor(Math.random() * titles.length)];
}

async function postPin(tool) {
  console.log(`\n=== Posting Pin: ${tool.name} ===\n`);

  const token = await getAccessToken();

  // 1. Create pin image
  const imagePath = path.join(config.OUTPUT_DIR, `${tool.slug}_pin.png`);
  fs.mkdirSync(config.OUTPUT_DIR, { recursive: true });
  console.log("1. Creating pin image...");
  await createPinImage(tool, imagePath);

  // 2. Find or create the board
  const boardName = config.BOARDS[tool.category] || config.BOARD_NAME;
  console.log(`2. Finding board: ${boardName}`);
  const boardId = await findOrCreateBoard(token, boardName);

  // 3. Generate SEO content
  const title = generatePinTitle(tool);
  const description = generatePinDescription(tool);
  const toolUrl = `${config.SITE_URL}/tools/${tool.slug}`;

  console.log(`3. Title: ${title}`);
  console.log(`4. Link: ${toolUrl}`);

  // 4. Upload pin
  // Pinterest v5 API accepts image URL or base64
  // Convert image to base64 for direct upload
  const imageBase64 = fs.readFileSync(imagePath).toString("base64");

  console.log("5. Uploading pin to Pinterest...");

  try {
    const pin = await apiCall("POST", "/pins", token, {
      title: title.slice(0, 100),
      description: description.slice(0, 500),
      board_id: boardId,
      media_source: {
        source_type: "image_base64",
        content_type: "image/png",
        data: imageBase64,
      },
      link: toolUrl,
      alt_text: `${tool.name} — Free online tool at SabTools.in`,
    });

    console.log(`\nPin posted successfully!`);
    console.log(`Pin ID: ${pin.id}`);
    console.log(`URL: https://pinterest.com/pin/${pin.id}`);

    return {
      pinId: pin.id,
      pinUrl: `https://pinterest.com/pin/${pin.id}`,
      title,
      toolUrl,
      boardId,
    };
  } catch (err) {
    // If base64 fails, try with image_url (need to host image)
    console.log("Base64 upload failed, trying URL method...");

    // Use the sabtools.in og:image as fallback
    const ogImageUrl = `${config.SITE_URL}/api/og?tool=${tool.slug}`;

    const pin = await apiCall("POST", "/pins", token, {
      title: title.slice(0, 100),
      description: description.slice(0, 500),
      board_id: boardId,
      media_source: {
        source_type: "image_url",
        url: ogImageUrl,
      },
      link: toolUrl,
      alt_text: `${tool.name} — Free online tool at SabTools.in`,
    });

    console.log(`\nPin posted successfully (via URL)!`);
    console.log(`Pin ID: ${pin.id}`);
    return {
      pinId: pin.id,
      pinUrl: `https://pinterest.com/pin/${pin.id}`,
      title,
      toolUrl,
      boardId,
    };
  }
}

module.exports = { postPin, findOrCreateBoard, getAccessToken };

if (require.main === module) {
  const slug = process.argv[2] || "emi-calculator";
  const tool = config.PRIORITY_TOOLS.find((t) => t.slug === slug) || {
    slug,
    name: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    category: "finance",
    keywords: "free online tool India",
  };
  postPin(tool)
    .then((result) => console.log("\nResult:", result))
    .catch((err) => console.error("Failed:", err.message));
}
