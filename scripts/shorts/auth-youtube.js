#!/usr/bin/env node

/**
 * YouTube OAuth2 Authentication Helper
 * Starts a local server to capture the OAuth callback
 */

const { google } = require("googleapis");
const http = require("http");
const fs = require("fs");
const url = require("url");
const config = require("./config");

const PORT = 8085;

async function main() {
  const creds = JSON.parse(fs.readFileSync(config.YOUTUBE_CREDS, "utf-8"));
  const { client_id, client_secret } = creds.web || creds.installed;

  // Use localhost with specific port as redirect URI
  const redirectUri = `http://localhost:${PORT}`;

  const oauth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirectUri
  );

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/youtube.upload",
      "https://www.googleapis.com/auth/youtube.force-ssl",
      "https://www.googleapis.com/auth/youtube",
    ],
    prompt: "consent",
  });

  console.log("\n🔑 YouTube Authentication");
  console.log("=".repeat(50));
  console.log("\nOpen this URL in your browser:\n");
  console.log(authUrl);
  console.log("\nWaiting for authentication...\n");

  // Start local server to capture the callback
  const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);

    if (parsedUrl.pathname === "/" && parsedUrl.query.code) {
      const code = parsedUrl.query.code;

      try {
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);
        fs.writeFileSync(config.YOUTUBE_TOKEN, JSON.stringify(tokens, null, 2));

        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(`
          <html>
            <body style="font-family: sans-serif; text-align: center; padding: 50px; background: #1a1a2e; color: white;">
              <h1>✅ Authentication Successful!</h1>
              <p>YouTube upload access granted for SabTools Shorts.</p>
              <p>You can close this window now.</p>
            </body>
          </html>
        `);

        console.log("✅ Authentication successful!");
        console.log("   Token saved to:", config.YOUTUBE_TOKEN);
        console.log("   Access token:", tokens.access_token ? "YES" : "NO");
        console.log("   Refresh token:", tokens.refresh_token ? "YES" : "NO");

        setTimeout(() => {
          server.close();
          process.exit(0);
        }, 1000);
      } catch (err) {
        res.writeHead(500, { "Content-Type": "text/html" });
        res.end(`
          <html>
            <body style="font-family: sans-serif; text-align: center; padding: 50px; background: #1a1a2e; color: white;">
              <h1>❌ Authentication Failed</h1>
              <p>${err.message}</p>
            </body>
          </html>
        `);
        console.error("Error:", err.message);
      }
    } else if (parsedUrl.query.error) {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(`
        <html>
          <body style="font-family: sans-serif; text-align: center; padding: 50px; background: #1a1a2e; color: white;">
            <h1>❌ Authentication Denied</h1>
            <p>${parsedUrl.query.error}</p>
          </body>
        </html>
      `);
      console.error("Auth denied:", parsedUrl.query.error);
      setTimeout(() => process.exit(1), 1000);
    } else {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("Waiting for OAuth callback...");
    }
  });

  server.listen(PORT, () => {
    console.log(`Local server listening on http://localhost:${PORT}`);
  });
}

main().catch(console.error);
