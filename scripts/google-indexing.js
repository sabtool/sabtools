/**
 * Google Indexing API — Submit URLs for instant Google crawling
 *
 * Usage:
 *   node scripts/google-indexing.js              → Submit all URLs from sitemap
 *   node scripts/google-indexing.js --top=50     → Submit top 50 priority URLs
 *   node scripts/google-indexing.js --url=URL    → Submit a single URL
 *
 * Limits: 200 URLs per day (Google quota)
 */

const { GoogleAuth } = require("google-auth-library");
const fs = require("fs");
const path = require("path");

const KEY_FILE = path.join(__dirname, "..", "google-indexing-key.json");
const SITEMAP_FILE = path.join(__dirname, "..", "public", "sitemap.xml");
const INDEXING_API = "https://indexing.googleapis.com/v3/urlNotifications:publish";
const DAILY_LIMIT = 200;

// Priority URL patterns (submitted first)
const PRIORITY_PATTERNS = [
  /^https:\/\/sabtools\.in\/$/, // homepage
  /^https:\/\/sabtools\.in\/tools\/emi-calculator$/,
  /^https:\/\/sabtools\.in\/tools\/sip-calculator$/,
  /^https:\/\/sabtools\.in\/tools\/gst-calculator$/,
  /^https:\/\/sabtools\.in\/tools\/income-tax-calculator$/,
  /^https:\/\/sabtools\.in\/tools\/age-calculator$/,
  /^https:\/\/sabtools\.in\/tools\/percentage-calculator$/,
  /^https:\/\/sabtools\.in\/tools\/bmi-calculator$/,
  /^https:\/\/sabtools\.in\/tools\/salary-calculator$/,
  /^https:\/\/sabtools\.in\/tools\/word-counter$/,
  /^https:\/\/sabtools\.in\/tools\/json-formatter$/,
  /^https:\/\/sabtools\.in\/tools\/love-calculator$/,
  /^https:\/\/sabtools\.in\/category\//, // all category pages
  /^https:\/\/sabtools\.in\/blog\/[^/]+$/, // all blog posts
  /^https:\/\/sabtools\.in\/tools\//, // all tool pages
  /^https:\/\/sabtools\.in\/calc\//, // programmatic pages
];

async function getAuthClient() {
  const auth = new GoogleAuth({
    keyFile: KEY_FILE,
    scopes: ["https://www.googleapis.com/auth/indexing"],
  });
  return auth.getClient();
}

function extractUrlsFromSitemap() {
  const xml = fs.readFileSync(SITEMAP_FILE, "utf-8");
  const urls = [];
  const regex = /<loc>(https:\/\/sabtools\.in[^<]+)<\/loc>/g;
  let match;
  while ((match = regex.exec(xml)) !== null) {
    // Skip Hindi and embed pages (focus crawl budget on English pages)
    const url = match[1];
    if (!url.includes("/hi/") && !url.includes("/embed/")) {
      urls.push(url);
    }
  }
  return urls;
}

function sortByPriority(urls) {
  return urls.sort((a, b) => {
    const aPriority = PRIORITY_PATTERNS.findIndex((p) => p.test(a));
    const bPriority = PRIORITY_PATTERNS.findIndex((p) => p.test(b));
    const aScore = aPriority === -1 ? 999 : aPriority;
    const bScore = bPriority === -1 ? 999 : bPriority;
    return aScore - bScore;
  });
}

async function submitUrl(client, url) {
  try {
    const res = await client.request({
      url: INDEXING_API,
      method: "POST",
      data: {
        url: url,
        type: "URL_UPDATED",
      },
    });
    return { url, status: res.status, success: true };
  } catch (err) {
    const status = err.response?.status || "unknown";
    const message = err.response?.data?.error?.message || err.message;
    return { url, status, success: false, error: message };
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  // Parse arguments
  const args = process.argv.slice(2);
  let limit = DAILY_LIMIT;
  let singleUrl = null;

  for (const arg of args) {
    if (arg.startsWith("--top=")) {
      limit = parseInt(arg.split("=")[1], 10);
    } else if (arg.startsWith("--url=")) {
      singleUrl = arg.split("=")[1];
    }
  }

  // Check key file exists
  if (!fs.existsSync(KEY_FILE)) {
    console.error("Error: google-indexing-key.json not found!");
    console.error("Place your Google service account key file at:", KEY_FILE);
    process.exit(1);
  }

  console.log("Authenticating with Google...");
  const client = await getAuthClient();
  console.log("Authenticated successfully!\n");

  let urls;
  if (singleUrl) {
    urls = [singleUrl];
  } else {
    urls = extractUrlsFromSitemap();
    urls = sortByPriority(urls);
    urls = urls.slice(0, limit);
    console.log(`Found ${urls.length} URLs to submit (limit: ${limit})\n`);
  }

  let success = 0;
  let failed = 0;

  for (let i = 0; i < urls.length; i++) {
    const result = await submitUrl(client, urls[i]);

    if (result.success) {
      success++;
      console.log(`[${i + 1}/${urls.length}] ✓ ${result.url}`);
    } else {
      failed++;
      console.log(`[${i + 1}/${urls.length}] ✗ ${result.url} — ${result.status}: ${result.error}`);
    }

    // Rate limit: ~1 request per second to be safe
    if (i < urls.length - 1) {
      await sleep(1000);
    }
  }

  console.log(`\n============================`);
  console.log(`Done! Submitted: ${success} | Failed: ${failed} | Total: ${urls.length}`);
  console.log(`============================`);

  if (success > 0) {
    console.log(`\nGoogle will crawl these ${success} URLs within minutes to hours.`);
    console.log(`You can submit up to ${DAILY_LIMIT} URLs per day.`);
    if (urls.length < limit) {
      console.log(`Run again tomorrow to submit the next batch.`);
    }
  }

  if (failed > 0) {
    console.log(`\nSome URLs failed. Common reasons:`);
    console.log(`- 403: Service account not added as Owner in Search Console`);
    console.log(`- 429: Daily quota exceeded (200/day)`);
    console.log(`- 400: URL format issue`);
  }
}

main().catch(console.error);
