#!/usr/bin/env node

/**
 * Google Indexing API — Submit new blog URL for fast indexing
 *
 * Requires GOOGLE_SERVICE_ACCOUNT_KEY secret in GitHub Actions
 * (JSON string of the service account key file)
 *
 * Setup:
 * 1. Create a Google Cloud project
 * 2. Enable "Web Search Indexing API"
 * 3. Create a service account → download JSON key
 * 4. Add service account email as owner in Google Search Console
 * 5. Add JSON key as GOOGLE_SERVICE_ACCOUNT_KEY secret in GitHub repo
 */

const fs = require("fs");
const path = require("path");
const https = require("https");
const crypto = require("crypto");

const CURRENT_TOOL_FILE = path.join(__dirname, ".current-tool.json");
const SITE_URL = "https://sabtools.in";

// ─── Create JWT for Google API auth ───
function createJWT(serviceAccount) {
  const header = {
    alg: "RS256",
    typ: "JWT",
  };

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: serviceAccount.client_email,
    scope: "https://www.googleapis.com/auth/indexing",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  };

  const encodedHeader = Buffer.from(JSON.stringify(header)).toString("base64url");
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signatureInput = `${encodedHeader}.${encodedPayload}`;

  const sign = crypto.createSign("RSA-SHA256");
  sign.update(signatureInput);
  const signature = sign.sign(serviceAccount.private_key, "base64url");

  return `${signatureInput}.${signature}`;
}

// ─── Exchange JWT for access token ───
function getAccessToken(jwt) {
  return new Promise((resolve, reject) => {
    const postData = `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`;

    const options = {
      hostname: "oauth2.googleapis.com",
      path: "/token",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": Buffer.byteLength(postData),
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.access_token) {
            resolve(parsed.access_token);
          } else {
            reject(new Error(`Token error: ${data}`));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on("error", reject);
    req.write(postData);
    req.end();
  });
}

// ─── Submit URL to Google Indexing API ───
function submitUrl(accessToken, url) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      url: url,
      type: "URL_UPDATED",
    });

    const options = {
      hostname: "indexing.googleapis.com",
      path: "/v3/urlNotifications:publish",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "Content-Length": Buffer.byteLength(postData),
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ statusCode: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ statusCode: res.statusCode, body: data });
        }
      });
    });

    req.on("error", reject);
    req.write(postData);
    req.end();
  });
}

// ─── Main ───
async function main() {
  console.log("=== Google Indexing API ===");

  // Check for service account key
  const keyEnv = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!keyEnv) {
    console.log("GOOGLE_SERVICE_ACCOUNT_KEY not set — skipping indexing.");
    console.log("This is normal for local development.");
    console.log("Set the secret in GitHub Actions for production indexing.");
    process.exit(0);
  }

  // Read current tool info
  if (!fs.existsSync(CURRENT_TOOL_FILE)) {
    console.log("No .current-tool.json found. Run generate-blog.js first.");
    process.exit(0);
  }

  const toolInfo = JSON.parse(fs.readFileSync(CURRENT_TOOL_FILE, "utf-8"));
  const blogUrl = `${SITE_URL}/blog/${toolInfo.blogSlug}`;

  console.log(`Blog URL: ${blogUrl}`);

  try {
    // Parse service account key
    const serviceAccount = JSON.parse(keyEnv);
    console.log(`Service account: ${serviceAccount.client_email}`);

    // Get access token
    console.log("\n1. Getting access token...");
    const jwt = createJWT(serviceAccount);
    const accessToken = await getAccessToken(jwt);
    console.log("   Token obtained ✓");

    // Submit blog URL
    console.log("\n2. Submitting blog URL...");
    const blogResult = await submitUrl(accessToken, blogUrl);
    console.log(`   Status: ${blogResult.statusCode}`);
    console.log(`   Response:`, JSON.stringify(blogResult.body, null, 2));

    // Also submit the tool page URL (helps tool page ranking too)
    const toolUrl = `${SITE_URL}/tools/${toolInfo.slug}`;
    console.log(`\n3. Submitting tool URL: ${toolUrl}`);
    const toolResult = await submitUrl(accessToken, toolUrl);
    console.log(`   Status: ${toolResult.statusCode}`);
    console.log(`   Response:`, JSON.stringify(toolResult.body, null, 2));

    // Submit sitemap URL for good measure
    const sitemapUrl = `${SITE_URL}/sitemap.xml`;
    console.log(`\n4. Pinging sitemap: ${sitemapUrl}`);
    const sitemapResult = await submitUrl(accessToken, sitemapUrl);
    console.log(`   Status: ${sitemapResult.statusCode}`);

    console.log("\n=== Indexing requests submitted successfully ===");
  } catch (err) {
    console.error(`Indexing failed: ${err.message}`);
    console.log("The blog post was still published — indexing will happen naturally.");
    // Don't exit with error — indexing failure shouldn't block the workflow
  }
}

main().catch((err) => {
  console.error("Indexing script failed:", err);
  // Non-fatal — don't exit with error code
});
