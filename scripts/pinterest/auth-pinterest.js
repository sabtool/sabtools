#!/usr/bin/env node

/**
 * Pinterest OAuth2 Authentication
 * 1. Opens browser for user to authorize
 * 2. Captures callback with auth code
 * 3. Exchanges code for access token
 * 4. Saves token to pinterest-token.json
 */

const http = require("http");
const { URL } = require("url");
const fs = require("fs");
const config = require("./config");

const REDIRECT_URI = "http://localhost:8086/callback";
const SCOPES = ["boards:read", "boards:write", "pins:read", "pins:write"];

async function authenticate() {
  if (!config.PINTEREST_APP_ID || !config.PINTEREST_APP_SECRET) {
    console.log("\n=== Pinterest API Setup ===\n");
    console.log("1. Go to: https://developers.pinterest.com/apps/");
    console.log("2. Click 'Create app'");
    console.log("3. Fill in app name: 'SabTools Pinterest'");
    console.log("4. Add redirect URI: http://localhost:8086/callback");
    console.log("5. Copy your App ID and App Secret");
    console.log("\nThen set them in config.js or as environment variables:");
    console.log("  PINTEREST_APP_ID=your_app_id");
    console.log("  PINTEREST_APP_SECRET=your_app_secret\n");
    process.exit(1);
  }

  // Check if we already have a valid token
  if (fs.existsSync(config.PINTEREST_TOKEN_FILE)) {
    const token = JSON.parse(fs.readFileSync(config.PINTEREST_TOKEN_FILE, "utf-8"));
    if (token.access_token) {
      // Test if token is still valid
      try {
        const resp = await fetch("https://api.pinterest.com/v5/user_account", {
          headers: { Authorization: `Bearer ${token.access_token}` },
        });
        if (resp.ok) {
          console.log("Existing Pinterest token is valid!");
          return token.access_token;
        }
      } catch {}

      // Try refresh
      if (token.refresh_token) {
        console.log("Refreshing Pinterest token...");
        const refreshed = await refreshToken(token.refresh_token);
        if (refreshed) return refreshed;
      }
    }
  }

  // Start OAuth flow
  const authUrl = `https://www.pinterest.com/oauth/?` +
    `client_id=${config.PINTEREST_APP_ID}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&response_type=code` +
    `&scope=${SCOPES.join(",")}` +
    `&state=sabtools_pinterest`;

  console.log("\n=== Pinterest Authorization ===\n");
  console.log("Open this URL in your browser:\n");
  console.log(authUrl);
  console.log("\nWaiting for authorization...\n");

  // Start local server to capture callback
  return new Promise((resolve, reject) => {
    const server = http.createServer(async (req, res) => {
      const url = new URL(req.url, "http://localhost:8086");

      if (url.pathname === "/callback") {
        const code = url.searchParams.get("code");
        const state = url.searchParams.get("state");

        if (code && state === "sabtools_pinterest") {
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end("<h1>Pinterest Connected!</h1><p>You can close this window.</p>");

          server.close();

          // Exchange code for token
          try {
            const token = await exchangeCode(code);
            resolve(token);
          } catch (err) {
            reject(err);
          }
        } else {
          res.writeHead(400);
          res.end("Authorization failed");
          server.close();
          reject(new Error("No code received"));
        }
      }
    });

    server.listen(8086, () => {
      console.log("Listening on http://localhost:8086/callback for Pinterest callback...");
    });

    // Timeout after 5 minutes
    setTimeout(() => {
      server.close();
      reject(new Error("Authorization timed out"));
    }, 5 * 60 * 1000);
  });
}

async function exchangeCode(code) {
  const credentials = Buffer.from(
    `${config.PINTEREST_APP_ID}:${config.PINTEREST_APP_SECRET}`
  ).toString("base64");

  const resp = await fetch("https://api.pinterest.com/v5/oauth/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: REDIRECT_URI,
    }).toString(),
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`Token exchange failed: ${err}`);
  }

  const token = await resp.json();
  token.obtained_at = Date.now();

  fs.writeFileSync(config.PINTEREST_TOKEN_FILE, JSON.stringify(token, null, 2));
  console.log("Pinterest token saved!");
  return token.access_token;
}

async function refreshToken(refreshToken) {
  const credentials = Buffer.from(
    `${config.PINTEREST_APP_ID}:${config.PINTEREST_APP_SECRET}`
  ).toString("base64");

  try {
    const resp = await fetch("https://api.pinterest.com/v5/oauth/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }).toString(),
    });

    if (!resp.ok) return null;

    const token = await resp.json();
    token.obtained_at = Date.now();
    fs.writeFileSync(config.PINTEREST_TOKEN_FILE, JSON.stringify(token, null, 2));
    console.log("Pinterest token refreshed!");
    return token.access_token;
  } catch {
    return null;
  }
}

module.exports = { authenticate, refreshToken };

if (require.main === module) {
  authenticate()
    .then((token) => console.log("\nAuthenticated! Token starts with:", token.slice(0, 20) + "..."))
    .catch((err) => console.error("Auth failed:", err.message));
}
