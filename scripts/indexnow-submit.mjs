#!/usr/bin/env node

/**
 * IndexNow submitter — pushes URLs to api.indexnow.org so Bing, Yandex,
 * Seznam, Naver (and the AI engines that read the Bing index, e.g.
 * Copilot / ChatGPT search) discover new or changed pages within minutes
 * instead of waiting for a crawl.
 *
 * Usage:
 *   node scripts/indexnow-submit.mjs <url> [<url> ...]     # specific URLs
 *   node scripts/indexnow-submit.mjs --sitemap             # every sitemap URL
 *
 * The key file lives at public/<KEY>.txt (deployed to the site root),
 * which is how IndexNow verifies domain ownership. Keep KEY in sync
 * with that filename if it is ever rotated.
 *
 * Wired into .github/workflows/auto-blog.yml so each new blog post is
 * submitted right after it is pushed. Safe to run manually any time —
 * IndexNow ignores duplicate submissions.
 */

const KEY = "1dc1f435f6284af915dd9c4ad6ffbf53";
const HOST = "sabtools.in";
const SITE = `https://${HOST}`;

async function getSitemapUrls() {
  const res = await fetch(`${SITE}/sitemap.xml`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

async function main() {
  const args = process.argv.slice(2);
  let urls;
  if (args.includes("--sitemap")) {
    urls = await getSitemapUrls();
  } else if (args.length > 0) {
    urls = args.filter((a) => a.startsWith("http"));
  } else {
    console.error("Usage: indexnow-submit.mjs <url> [...] | --sitemap");
    process.exit(1);
  }

  if (urls.length === 0) {
    console.log("No URLs to submit.");
    return;
  }

  // IndexNow accepts up to 10,000 URLs per POST.
  const body = {
    host: HOST,
    key: KEY,
    keyLocation: `${SITE}/${KEY}.txt`,
    urlList: urls.slice(0, 10000),
  };

  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });

  // 200 = submitted, 202 = accepted (key validation pending) — both fine.
  console.log(`IndexNow: submitted ${body.urlList.length} URL(s) — HTTP ${res.status}`);
  if (res.status >= 400) {
    console.error(await res.text());
    process.exit(1);
  }
}

main().catch((e) => {
  console.error("IndexNow submission failed:", e.message);
  process.exit(1);
});
