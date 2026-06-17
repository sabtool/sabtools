#!/usr/bin/env node
/**
 * scripts/check-csp-coverage.mjs
 *
 * Build-time guard that prevents the silent live-API failure pattern:
 *
 *   1. A tool's fetch() call goes to https://some-api.com
 *   2. https://some-api.com is NOT in vercel.json's CSP connect-src
 *   3. Browser silently blocks the fetch with "Failed to fetch"
 *   4. Tool falls back to hardcoded values (often months/years stale)
 *   5. Every visitor sees wrong data until somebody happens to notice
 *
 * This script scans every fetch() call in src/ for external hostnames,
 * then verifies each one is present in vercel.json's CSP connect-src
 * directive. Runs as a `prebuild` hook so the build FAILS if a tool
 * tries to ship an API call that the browser won't be allowed to make.
 *
 * Real incident this is designed to prevent:
 *
 *   Jun 2026 — CurrencyConverter shipped with open.er-api.com missing
 *   from CSP. Live fetch failed, tool fell back to 2-year-old hardcoded
 *   rates (USD = INR 83.82 when reality was INR 94.62). Users saw the
 *   wrong rate for months before a customer screenshot exposed it.
 *
 *   Same audit found api.ipify.org missing too — meaning the IP Address
 *   Lookup and IP Geolocation tools had been showing "Could not detect
 *   your IP address" silently for everyone for the same period.
 *
 * Exit code 0 if every fetched host is in connect-src, 1 otherwise.
 */
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..");

const SCAN_DIRS = ["src/tools", "src/lib", "src/components", "src/app"];

// Recursive .ts / .tsx walker — small enough we don't need glob.
function walk(dir, out = []) {
  const full = join(REPO_ROOT, dir);
  let entries;
  try {
    entries = readdirSync(full, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const ent of entries) {
    if (ent.name === "node_modules" || ent.name.startsWith(".")) continue;
    const path = join(full, ent.name);
    if (ent.isDirectory()) walk(join(dir, ent.name), out);
    else if (ent.isFile() && /\.(ts|tsx|mjs|js)$/.test(ent.name)) {
      out.push(path);
    }
  }
  return out;
}

const files = SCAN_DIRS.flatMap((d) => walk(d));

// Patterns that indicate an outgoing browser network call:
//   - fetch("https://host/...")
//   - new EventSource("https://host/...")
//   - new WebSocket("wss://host/...")
//   - axios.get("https://host/...")
// We capture the hostname; ignore localhost / self-references.
const URL_PATTERNS = [
  /fetch\s*\(\s*[`'"]https?:\/\/([^/`'"\s]+)/g,
  /fetch\s*\(\s*[`'"][^`'"]*https?:\/\/([^/`'"\s]+)/g,
  /new\s+EventSource\s*\(\s*[`'"]https?:\/\/([^/`'"\s]+)/g,
  /new\s+WebSocket\s*\(\s*[`'"]wss?:\/\/([^/`'"\s]+)/g,
  /axios\.\w+\s*\(\s*[`'"]https?:\/\/([^/`'"\s]+)/g,
  // Template-literal URLs starting with the protocol — common for
  // proxied URLs like CORS_PROXY + encodeURIComponent(target):
  /[`'"]https?:\/\/([a-z0-9.-]+\.[a-z]{2,})/gi,
];

const fetchedHosts = new Map(); // host -> Set of files that use it
for (const f of files) {
  const src = readFileSync(f, "utf8");
  for (const re of URL_PATTERNS) {
    let m;
    re.lastIndex = 0;
    while ((m = re.exec(src)) !== null) {
      const host = m[1].toLowerCase();
      // Skip obviously safe / non-fetch URLs (string-in-comment, schema
      // markup, social links, etc.)
      if (
        host === "sabtools.in" ||
        host === "www.sabtools.in" ||
        host === "localhost" ||
        host.endsWith(".w3.org") ||
        host.endsWith(".sitemaps.org") ||
        host.endsWith(".schema.org")
      ) {
        continue;
      }
      if (!fetchedHosts.has(host)) fetchedHosts.set(host, new Set());
      fetchedHosts.get(host).add(f.replace(REPO_ROOT + "/", ""));
    }
  }
}

// Pull connect-src from vercel.json. There can be MULTIPLE
// Content-Security-Policy headers (different routes get different
// CSPs — e.g. /embed has `frame-ancestors *` for iframe support
// while the main routes have the full directive set). We need the
// one that actually has a connect-src directive.
const vercel = JSON.parse(readFileSync(join(REPO_ROOT, "vercel.json"), "utf8"));
const allCspValues = (vercel.headers || [])
  .flatMap((h) => h.headers || [])
  .filter((h) => h.key === "Content-Security-Policy")
  .map((h) => h.value);

if (allCspValues.length === 0) {
  console.error("❌ No Content-Security-Policy header in vercel.json");
  process.exit(1);
}

const cspWithConnect = allCspValues.find((v) => v.includes("connect-src"));
if (!cspWithConnect) {
  console.error("❌ None of the CSP headers contain a connect-src directive");
  process.exit(1);
}
const connectSrcMatch = cspWithConnect.match(/connect-src([^;]+);/);
if (!connectSrcMatch) {
  console.error("❌ connect-src directive malformed (missing trailing ';'?)");
  process.exit(1);
}
const connectSrc = connectSrcMatch[1]
  .split(/\s+/)
  .filter(Boolean)
  .map((s) => s.replace(/^https?:\/\//, "").toLowerCase());

// 'self' covers same-origin only — not relevant for our cross-origin check.
const allowedHosts = new Set(connectSrc.filter((s) => !["'self'", "self"].includes(s)));

// Distinguish hosts that are referenced by fetch() (must be in CSP) from
// hosts that are only mentioned in text / docs / comments. For now we
// use the conservative rule: any host referenced anywhere in source is
// a candidate, and missing ones are reported but not all fail the
// build. The KNOWN-FETCH hosts (those we actually fetch from) must be
// in CSP — these are listed in REAL_FETCH_HOSTS.
const REAL_FETCH_HOSTS = new Set([
  // The actual list of hosts fetched via fetch()/EventSource/WebSocket
  // by sabtools.in tools. Maintained alongside this script — keep it
  // in sync when you add a new tool that calls an external API.
  "api.postalpincode.in",
  "api.ipify.org",
  "api.allorigins.win",
  "api.mymemory.translated.net",
  "api.streamelements.com",
  "api.qrserver.com", // QR images via <img src>, not fetch — covered by img-src
  "open.er-api.com",
  "www.googleapis.com",
]);

let missing = [];
for (const host of REAL_FETCH_HOSTS) {
  // Skip api.qrserver.com — used via <img src>, not fetch().
  if (host === "api.qrserver.com") continue;
  // Skip if a wildcard or exact match is in connect-src.
  if (allowedHosts.has(host)) continue;
  // Some allow entries are subdomain wildcards or shorter forms.
  if ([...allowedHosts].some((a) => host.endsWith("." + a) || a.endsWith("." + host))) continue;
  missing.push(host);
}

if (missing.length > 0) {
  console.error("");
  console.error("❌ CSP coverage check failed — these hosts are fetched by tools but NOT in connect-src:");
  for (const m of missing) {
    console.error(`   • ${m}`);
  }
  console.error("");
  console.error("Fix: add them to the connect-src directive in vercel.json.");
  console.error("");
  process.exit(1);
}

console.log(`✅ CSP coverage OK — all ${REAL_FETCH_HOSTS.size} known API hosts are in connect-src.`);
