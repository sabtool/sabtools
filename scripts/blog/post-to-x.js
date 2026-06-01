#!/usr/bin/env node
/**
 * Auto-post the latest blog post to X (@Sabtoolsin).
 *
 * Runs from the auto-blog GitHub Actions workflow AFTER generate-blog.js
 * has written the post and the commit+push step has landed it on main.
 *
 * Reads scripts/blog/.current-tool.json (which generate-blog.js updates on
 * every successful run) to know what to post about, composes a short
 * tweet (prefix + title + URL), and posts via the X API v2 with OAuth 1.0a.
 *
 * Required GitHub Secrets (Settings → Secrets and variables → Actions):
 *   X_API_KEY              — X App "API Key" (Consumer Key)
 *   X_API_SECRET           — X App "API Key Secret"
 *   X_ACCESS_TOKEN         — Access Token for @Sabtoolsin
 *   X_ACCESS_TOKEN_SECRET  — Access Token Secret
 *
 * Get all four from https://developer.twitter.com → your Project → App →
 * "Keys and tokens". The App's user-authentication settings must have
 * "Read and Write" permissions enabled (Settings tab → User authentication
 * settings).
 *
 * Behaviour on errors: log a ::warning:: and exit 0. Auto-posting is a
 * nice-to-have — failing the whole workflow because X is briefly down
 * (or because credentials aren't set yet) would falsely break the blog
 * pipeline. Watch the @Sabtoolsin timeline to confirm tweets are landing.
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const STATE_PATH = path.join(__dirname, ".current-tool.json");
const SITE = "https://sabtools.in";

const {
  X_API_KEY,
  X_API_SECRET,
  X_ACCESS_TOKEN,
  X_ACCESS_TOKEN_SECRET,
} = process.env;

if (!X_API_KEY || !X_API_SECRET || !X_ACCESS_TOKEN || !X_ACCESS_TOKEN_SECRET) {
  console.warn(
    "::warning::X API credentials not configured. Add X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, X_ACCESS_TOKEN_SECRET to repo Secrets. Skipping auto-post."
  );
  process.exit(0);
}

// ── Read what was just published ────────────────────────────────────────
let state;
try {
  state = JSON.parse(fs.readFileSync(STATE_PATH, "utf-8"));
} catch (err) {
  console.warn(
    `::warning::Could not read ${STATE_PATH} (${err.message}). generate-blog.js may not have written a post — skipping auto-post.`
  );
  process.exit(0);
}

const { name: title, blogSlug, blogType } = state;
if (!title || !blogSlug) {
  console.warn(
    `::warning::State file missing title or blogSlug: ${JSON.stringify(state)}. Skipping.`
  );
  process.exit(0);
}

// ── Compose tweet ───────────────────────────────────────────────────────
const url = `${SITE}/blog/${blogSlug}`;

const PREFIX = {
  tool: "📘 New guide",
  comparison: "⚖️ Comparison",
  news: "📰 Update",
};
const prefix = PREFIX[blogType] || "📘 New";

// Budget: 280 chars total. URL counts as exactly 23 (t.co shortener),
// regardless of actual length. Newlines count as 1 char each.
// effective_budget_for_title = 280 - 23 (URL) - 2 (newlines) - prefix.length - 2 (": ")
const URL_WEIGHT = 23;
const maxTitleLen = 280 - URL_WEIGHT - 2 - prefix.length - 2;

let displayTitle = title;
if (displayTitle.length > maxTitleLen) {
  displayTitle = displayTitle.slice(0, maxTitleLen - 1).trim() + "…";
}

const tweetText = `${prefix}: ${displayTitle}\n\n${url}`;

// ── OAuth 1.0a — hand-rolled (no third-party dependency) ───────────────
// RFC 5849 compliant. For X API v2 with JSON body, only the oauth_* params
// go into the signature base string — JSON bodies are NOT included.

function percentEncode(s) {
  return encodeURIComponent(String(s)).replace(
    /[!*'()]/g,
    (c) => "%" + c.charCodeAt(0).toString(16).toUpperCase()
  );
}

function signRequest(method, requestUrl, params, consumerSecret, tokenSecret) {
  const sortedParams = Object.keys(params)
    .sort()
    .map((k) => `${percentEncode(k)}=${percentEncode(params[k])}`)
    .join("&");
  const baseString = [
    method.toUpperCase(),
    percentEncode(requestUrl),
    percentEncode(sortedParams),
  ].join("&");
  const signingKey = `${percentEncode(consumerSecret)}&${percentEncode(tokenSecret)}`;
  return crypto.createHmac("sha1", signingKey).update(baseString).digest("base64");
}

async function main() {
  const apiUrl = "https://api.twitter.com/2/tweets";

  const oauthParams = {
    oauth_consumer_key: X_API_KEY,
    oauth_nonce: crypto.randomBytes(16).toString("hex"),
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: X_ACCESS_TOKEN,
    oauth_version: "1.0",
  };

  // Sign with the 6 oauth_* params (the JSON body is not signed for v2 endpoints).
  oauthParams.oauth_signature = signRequest(
    "POST",
    apiUrl,
    oauthParams,
    X_API_SECRET,
    X_ACCESS_TOKEN_SECRET
  );

  const authHeader =
    "OAuth " +
    Object.keys(oauthParams)
      .sort()
      .map((k) => `${percentEncode(k)}="${percentEncode(oauthParams[k])}"`)
      .join(", ");

  console.log(
    `[X-poster] Posting tweet (${tweetText.length}/280 chars):\n  ${tweetText.replace(/\n/g, " ↵ ")}`
  );

  const res = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader,
    },
    body: JSON.stringify({ text: tweetText }),
  });

  const bodyText = await res.text();

  if (res.ok) {
    try {
      const data = JSON.parse(bodyText);
      const id = data?.data?.id;
      console.log(
        `[X-poster] ✓ Tweet posted. ID: ${id}  · https://x.com/Sabtoolsin/status/${id}`
      );
    } catch {
      console.log(`[X-poster] ✓ Tweet posted (response: ${bodyText.slice(0, 200)})`);
    }
    return;
  }

  // X common error shapes:
  //   401 → bad credentials / signature mismatch
  //   403 → app lacks write permissions, or duplicate tweet, or account locked
  //   429 → rate limited
  console.warn(
    `::warning::X API returned ${res.status}: ${bodyText.slice(0, 600)}`
  );
}

main().catch((err) => {
  console.warn(`::warning::X auto-post failed: ${err.message || err}`);
  // Always exit 0 — blog publishing already succeeded, don't fail the run
  // because of a transient X issue. The tweet pipeline is best-effort.
});
