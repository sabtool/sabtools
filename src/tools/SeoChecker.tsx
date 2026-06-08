"use client";
import { useState, useCallback } from "react";
import { downloadSeoReportPdf } from "@/lib/seo-pdf";

/**
 * SEO Checker — generates a real, data-backed SEO report for any website.
 *
 * sabtools.in builds with `output: "export"` (static, no server), so this
 * runs entirely client-side. Two real data sources:
 *
 *  1. Google PageSpeed Insights API — Lighthouse scores (Performance, SEO,
 *     Accessibility, Best Practices), Core Web Vitals, and a genuine audit
 *     list. Google's API is CORS-friendly so the browser can call it
 *     directly. Works keyless (per-visitor IP quota); a referrer-locked
 *     NEXT_PUBLIC_PAGESPEED_API_KEY raises the quota for reliability.
 *
 *  2. On-page crawl — the target page HTML, fetched through a public CORS
 *     proxy (browsers can't fetch arbitrary cross-origin pages directly),
 *     parsed with DOMParser for title/meta/headings/alt-text/links/OG/
 *     schema. Best-effort: if the proxy is down the report still renders
 *     from PageSpeed data alone.
 *
 * Every number here is real. Backlinks, Domain Authority, keyword
 * rankings and traffic estimates need a paid data provider (Ahrefs/Moz/
 * Semrush) — they are honestly declared out of scope rather than faked.
 */

// ─── Config ──────────────────────────────────────────────────────────────
const PSI_ENDPOINT =
  "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";
// Optional — set NEXT_PUBLIC_PAGESPEED_API_KEY in Vercel env to raise quota.
const PSI_KEY = process.env.NEXT_PUBLIC_PAGESPEED_API_KEY || "";
// Public CORS proxy for the on-page HTML fetch. Best-effort only.
const CORS_PROXY = "https://api.allorigins.win/raw?url=";
// `/get?url=` returns a JSON envelope containing the real HTTP status code,
// final redirected URL and response time — we use it just for the status
// check so we don't double-fetch the body.
const CORS_GET = "https://api.allorigins.win/get?url=";

// ─── Types ───────────────────────────────────────────────────────────────
interface PsiAudit {
  id?: string;
  title?: string;
  description?: string;
  score?: number | null;
  displayValue?: string;
  numericValue?: number;
  scoreDisplayMode?: string;
  details?: unknown;
}
interface PsiCategory {
  score?: number | null;
  auditRefs?: { id: string; group?: string }[];
}
interface PsiResponse {
  lighthouseResult?: {
    finalUrl?: string;
    requestedUrl?: string;
    categories?: {
      performance?: PsiCategory;
      seo?: PsiCategory;
      accessibility?: PsiCategory;
      "best-practices"?: PsiCategory;
    };
    audits?: Record<string, PsiAudit>;
  };
  loadingExperience?: {
    metrics?: Record<string, { percentile?: number; category?: string }>;
    overall_category?: string;
  };
  error?: { message?: string };
}

type CheckStatus = "pass" | "warn" | "fail" | "info";

// Where every check's data came from. Surfaced in the UI as a small badge
// so the user can verify the report has no fabricated numbers — every
// pass/warn/fail traces back to a real data source.
type CheckSource =
  | "Lighthouse" // PSI / Lighthouse audit
  | "Crawl" // Live on-page HTML inspection
  | "HTTP" // Direct HTTP status / headers fetch
  | "Robots" // /robots.txt parse
  | "Sitemap"; // /sitemap.xml parse

interface Check {
  category: string;
  label: string;
  status: CheckStatus;
  detail: string;
  fix?: string;
  source?: CheckSource;
}

interface CwvMetric {
  key: string;
  label: string;
  value: string;
  rating: "good" | "average" | "poor" | "n/a";
}

interface FieldCwv {
  lcp?: { value: string; rating: "good" | "average" | "poor" };
  cls?: { value: string; rating: "good" | "average" | "poor" };
  inp?: { value: string; rating: "good" | "average" | "poor" };
  fcp?: { value: string; rating: "good" | "average" | "poor" };
  overallCategory?: "FAST" | "AVERAGE" | "SLOW";
}

interface PageWeight {
  totalKB: number;
  requestCount: number;
  byType: { label: string; sizeKB: number; requests: number }[];
}

interface SeoReport {
  url: string;
  finalUrl: string;
  scores: {
    performance: number | null;
    seo: number | null;
    accessibility: number | null;
    bestPractices: number | null;
  };
  // v4: parallel desktop PSI run — same shape, different strategy. Null if
  // the desktop audit was rate-limited or rejected.
  desktopScores: {
    performance: number | null;
    seo: number | null;
    accessibility: number | null;
    bestPractices: number | null;
  } | null;
  cwv: CwvMetric[];
  fieldDataAvailable: boolean;
  fieldCwv: FieldCwv | null;
  pageWeight: PageWeight | null;
  ttfbMs: number | null;
  onPageAvailable: boolean;
  schemaTypes: string[];
  ampUrl: string | null;
  manifestUrl: string | null;
  mixedContentCount: number;
  robotsTxtFound: boolean;
  sitemapFound: boolean;
  // v4: real HTTP status code from a HEAD-equivalent fetch via the proxy
  // envelope. null when the status couldn't be verified.
  httpStatus: number | null;
  checks: Check[];
  composite: number;
  grade: string;
  topPriorities: string[];
  verdict: string;
  // v4: timestamp at moment of report generation, used in PDF header.
  generatedAt: string;
}

interface OnPageResult {
  checks: Check[];
  schemaTypes: string[];
  ampUrl: string | null;
  manifestUrl: string | null;
  mixedContentCount: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────
function normalizeUrl(input: string): string | null {
  let u = input.trim();
  if (!u) return null;
  if (!/^https?:\/\//i.test(u)) u = "https://" + u;
  try {
    const parsed = new URL(u);
    if (!parsed.hostname.includes(".")) return null;
    return parsed.toString();
  } catch {
    return null;
  }
}

function pct(score: number | null | undefined): number | null {
  if (score === null || score === undefined) return null;
  return Math.round(score * 100);
}

function gradeFor(score: number): string {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

// Lighthouse score colour bands: ≥90 green, 50-89 amber, <50 red.
function scoreClasses(score: number | null): string {
  if (score === null) return "bg-gray-100 text-gray-400";
  if (score >= 90) return "bg-green-100 text-green-700";
  if (score >= 50) return "bg-amber-100 text-amber-700";
  return "bg-red-100 text-red-700";
}

// Google's official Core Web Vitals thresholds.
function rateCwv(key: string, ms: number): "good" | "average" | "poor" {
  const t: Record<string, [number, number]> = {
    lcp: [2500, 4000],
    cls: [0.1, 0.25],
    inp: [200, 500],
    fcp: [1800, 3000],
    tbt: [200, 600],
    si: [3400, 5800],
  };
  const band = t[key];
  if (!band) return "average";
  if (ms <= band[0]) return "good";
  if (ms <= band[1]) return "average";
  return "poor";
}

const STATUS_META: Record<
  CheckStatus,
  { icon: string; chip: string; row: string }
> = {
  pass: { icon: "✓", chip: "bg-green-100 text-green-700", row: "border-green-200" },
  warn: { icon: "!", chip: "bg-amber-100 text-amber-700", row: "border-amber-200" },
  fail: { icon: "✕", chip: "bg-red-100 text-red-700", row: "border-red-200" },
  info: { icon: "i", chip: "bg-blue-100 text-blue-700", row: "border-blue-200" },
};

const CWV_RATING_CLASS: Record<string, string> = {
  good: "text-green-600",
  average: "text-amber-600",
  poor: "text-red-600",
  "n/a": "text-gray-400",
};

// v3: explicit category order so the rendered report reads logically rather
// than in first-appearance order. Any category not on this list is appended
// after these, alphabetically — so adding new check categories is safe.
const CATEGORY_ORDER: string[] = [
  "On-Page SEO",
  "Technical SEO",
  "Internationalisation",
  "Content",
  "Schema Markup",
  "Performance Details",
  "Accessibility",
  "Best Practices",
  "Crawler Access",
  "Social",
];

// Tag every Check in a batch with its data source, but only when the
// emitting function didn't already set one. Keeps the per-check push()
// calls concise — the wrapper guarantees `source` is never undefined in
// the rendered report.
function tagSource(checks: Check[], source: CheckSource): Check[] {
  return checks.map((c) => (c.source ? c : { ...c, source }));
}

// ─── robots.txt / sitemap parsers ────────────────────────────────────────
function analyzeRobotsTxt(text: string): Check[] {
  const checks: Check[] = [];
  const trimmed = text.trim();
  if (!trimmed) {
    checks.push({
      category: "Crawler Access",
      label: "robots.txt",
      status: "warn",
      detail: "No robots.txt found at /robots.txt — crawlers can still crawl the site, but a robots.txt lets you control which paths they index.",
      fix: "Add a /robots.txt file. Even a permissive one (`User-agent: *  Allow: /`) plus a `Sitemap:` line helps.",
    });
    return checks;
  }
  const lower = trimmed.toLowerCase();
  const hasSitemap = /sitemap:/i.test(trimmed);
  const blocksAll = /disallow:\s*\/\s*$/im.test(trimmed) && !/allow:\s*\/[a-z]/i.test(trimmed);
  if (blocksAll) {
    checks.push({
      category: "Crawler Access",
      label: "robots.txt — site-wide block",
      status: "fail",
      detail: "robots.txt has `Disallow: /` — this blocks every crawler from every page.",
      fix: "Remove the `Disallow: /` line unless you genuinely want the site invisible to search engines.",
    });
  } else {
    checks.push({
      category: "Crawler Access",
      label: "robots.txt present",
      status: "pass",
      detail: `robots.txt found (${trimmed.length} chars) and it doesn't block the root path.`,
    });
  }
  checks.push({
    category: "Crawler Access",
    label: "Sitemap declared in robots.txt",
    status: hasSitemap ? "pass" : "warn",
    detail: hasSitemap
      ? "robots.txt includes a `Sitemap:` directive — crawlers can discover it automatically."
      : "robots.txt does not include a `Sitemap:` directive.",
    fix: hasSitemap
      ? undefined
      : "Add a line like `Sitemap: https://yoursite.com/sitemap.xml` to robots.txt.",
  });
  // Bonus: warn if it disallows /sitemap.xml (rare but breaks discovery)
  if (/disallow:\s*\/sitemap/i.test(lower)) {
    checks.push({
      category: "Crawler Access",
      label: "Sitemap accessibility",
      status: "fail",
      detail: "robots.txt disallows the sitemap path — crawlers can't read your sitemap.",
      fix: "Remove the line blocking /sitemap from robots.txt.",
    });
  }
  return tagSource(checks, "Robots");
}

function analyzeSitemap(xml: string): Check[] {
  const checks: Check[] = [];
  const trimmed = xml.trim();
  if (!trimmed || !/<urlset|<sitemapindex/i.test(trimmed)) {
    checks.push({
      category: "Crawler Access",
      label: "sitemap.xml",
      status: "warn",
      detail: "No valid sitemap.xml found at /sitemap.xml.",
      fix: "Generate a sitemap (most CMSes do this automatically) and serve it at /sitemap.xml. It helps Google discover and index your pages.",
    });
    return checks;
  }
  const urlCount = (trimmed.match(/<url>/gi) || []).length;
  const sitemapCount = (trimmed.match(/<sitemap>/gi) || []).length;
  const lastmods = trimmed.match(/<lastmod>([^<]+)<\/lastmod>/gi) || [];
  const freshestLastmod = lastmods
    .map((m) => m.replace(/<\/?lastmod>/gi, ""))
    .sort()
    .pop();
  const totalEntries = urlCount + sitemapCount;
  checks.push({
    category: "Crawler Access",
    label: "sitemap.xml",
    status: totalEntries > 0 ? "pass" : "warn",
    detail:
      sitemapCount > 0
        ? `Sitemap-index found with ${sitemapCount} child sitemap${sitemapCount > 1 ? "s" : ""}.`
        : urlCount > 0
          ? `Sitemap found with ${urlCount.toLocaleString()} URL${urlCount > 1 ? "s" : ""}.`
          : "Sitemap exists but contains no entries.",
  });
  if (freshestLastmod) {
    const ageDays = Math.round(
      (Date.now() - new Date(freshestLastmod).getTime()) / 86400000
    );
    if (!isNaN(ageDays)) {
      checks.push({
        category: "Crawler Access",
        label: "Sitemap freshness",
        status: ageDays < 30 ? "pass" : ageDays < 90 ? "warn" : "fail",
        detail: `Most recent <lastmod>: ${freshestLastmod.slice(0, 10)} (${ageDays} days ago).`,
        fix:
          ageDays < 30
            ? undefined
            : "Stale sitemap signals an inactive site. Most CMSes regenerate sitemaps on every publish — verify yours is doing so.",
      });
    }
  }
  return tagSource(checks, "Sitemap");
}

// ─── On-page crawl ───────────────────────────────────────────────────────
function analyzeOnPage(html: string, pageUrl: string): OnPageResult {
  const checks: Check[] = [];
  const doc = new DOMParser().parseFromString(html, "text/html");
  const attr = (sel: string, name: string) =>
    (doc.querySelector(sel)?.getAttribute(name) || "").trim();
  const text = (sel: string) =>
    (doc.querySelector(sel)?.textContent || "").trim();

  // Title
  const title = text("title");
  if (!title) {
    checks.push({
      category: "On-Page SEO",
      label: "Title tag",
      status: "fail",
      detail: "No <title> tag found.",
      fix: "Add a unique, descriptive <title> of 50-60 characters with your primary keyword near the front.",
    });
  } else {
    const len = title.length;
    const ok = len >= 30 && len <= 65;
    checks.push({
      category: "On-Page SEO",
      label: "Title tag",
      status: ok ? "pass" : "warn",
      detail: `"${title}" — ${len} characters.`,
      fix: ok
        ? undefined
        : len < 30
          ? "Title is short — expand it to 50-60 characters so it reads as a complete, keyword-rich phrase."
          : "Title is long — Google truncates around 60 characters. Trim it so the key part isn't cut off.",
    });
  }

  // Meta description
  const desc = attr('meta[name="description"]', "content");
  if (!desc) {
    checks.push({
      category: "On-Page SEO",
      label: "Meta description",
      status: "fail",
      detail: "No meta description found.",
      fix: "Add a 120-160 character meta description. It doesn't affect rankings directly but drives click-through from search results.",
    });
  } else {
    const len = desc.length;
    const ok = len >= 70 && len <= 165;
    checks.push({
      category: "On-Page SEO",
      label: "Meta description",
      status: ok ? "pass" : "warn",
      detail: `${len} characters: "${desc.slice(0, 120)}${desc.length > 120 ? "…" : ""}"`,
      fix: ok
        ? undefined
        : len < 70
          ? "Description is short — aim for 120-160 characters to fill the search snippet."
          : "Description is long — Google truncates around 160 characters. Tighten it.",
    });
  }

  // H1
  const h1s = doc.querySelectorAll("h1");
  if (h1s.length === 0) {
    checks.push({
      category: "On-Page SEO",
      label: "H1 heading",
      status: "fail",
      detail: "No <h1> heading found.",
      fix: "Add exactly one <h1> that states what the page is about, including the primary keyword.",
    });
  } else {
    checks.push({
      category: "On-Page SEO",
      label: "H1 heading",
      status: h1s.length === 1 ? "pass" : "warn",
      detail:
        h1s.length === 1
          ? `One H1: "${(h1s[0].textContent || "").trim().slice(0, 90)}"`
          : `${h1s.length} H1 tags found — a page should have exactly one.`,
      fix:
        h1s.length === 1
          ? undefined
          : "Keep a single <h1> per page; demote the extras to <h2>.",
    });
  }

  // Heading structure
  const hCount = (n: number) => doc.querySelectorAll("h" + n).length;
  const h2 = hCount(2);
  checks.push({
    category: "On-Page SEO",
    label: "Heading structure",
    status: h2 > 0 ? "pass" : "warn",
    detail: `H1:${hCount(1)}  H2:${h2}  H3:${hCount(3)}  H4:${hCount(4)}  H5:${hCount(5)}  H6:${hCount(6)}`,
    fix:
      h2 > 0
        ? undefined
        : "Break the content into sections with <h2> subheadings — it helps both readers and crawlers.",
  });

  // Word count
  const words = (doc.body?.textContent || "")
    .split(/\s+/)
    .filter(Boolean).length;
  checks.push({
    category: "Content",
    label: "Content length",
    status: words >= 600 ? "pass" : words >= 250 ? "warn" : "fail",
    detail: `Approximately ${words.toLocaleString()} words of visible text.`,
    fix:
      words >= 600
        ? undefined
        : "Thin content rarely ranks. Aim for 600+ words of genuinely useful, original copy.",
  });

  // Image alt text
  const imgs = Array.from(doc.querySelectorAll("img"));
  const noAlt = imgs.filter(
    (i) => !(i.getAttribute("alt") || "").trim()
  ).length;
  if (imgs.length === 0) {
    checks.push({
      category: "On-Page SEO",
      label: "Image alt text",
      status: "info",
      detail: "No <img> tags found on the page.",
    });
  } else {
    checks.push({
      category: "On-Page SEO",
      label: "Image alt text",
      status: noAlt === 0 ? "pass" : noAlt / imgs.length > 0.5 ? "fail" : "warn",
      detail: `${imgs.length - noAlt} of ${imgs.length} images have alt text${noAlt ? ` — ${noAlt} missing.` : "."}`,
      fix:
        noAlt === 0
          ? undefined
          : "Add descriptive alt text to every meaningful image — it aids accessibility and image search.",
    });
  }

  // Canonical
  const canonical = attr('link[rel="canonical"]', "href");
  checks.push({
    category: "Technical SEO",
    label: "Canonical tag",
    status: canonical ? "pass" : "warn",
    detail: canonical ? `Canonical: ${canonical}` : "No canonical link found.",
    fix: canonical
      ? undefined
      : "Add a <link rel=\"canonical\"> so Google knows the preferred URL and you avoid duplicate-content dilution.",
  });

  // Lang attribute
  const lang = (doc.documentElement.getAttribute("lang") || "").trim();
  checks.push({
    category: "Technical SEO",
    label: "Language attribute",
    status: lang ? "pass" : "warn",
    detail: lang ? `<html lang="${lang}">` : "No lang attribute on <html>.",
    fix: lang
      ? undefined
      : 'Set <html lang="…"> (e.g. "en-IN") so search engines and screen readers know the page language.',
  });

  // Viewport (mobile)
  const viewport = attr('meta[name="viewport"]', "content");
  checks.push({
    category: "Technical SEO",
    label: "Mobile viewport",
    status: viewport ? "pass" : "fail",
    detail: viewport
      ? `viewport: ${viewport}`
      : "No viewport meta tag — the page is not mobile-optimised.",
    fix: viewport
      ? undefined
      : 'Add <meta name="viewport" content="width=device-width, initial-scale=1">. Google uses mobile-first indexing.',
  });

  // Robots meta
  const robotsMeta = attr('meta[name="robots"]', "content").toLowerCase();
  if (robotsMeta.includes("noindex")) {
    checks.push({
      category: "Technical SEO",
      label: "Indexability",
      status: "fail",
      detail: `Robots meta says "${robotsMeta}" — this page is blocked from Google's index.`,
      fix: "Remove 'noindex' from the robots meta tag if you want this page to rank.",
    });
  } else {
    checks.push({
      category: "Technical SEO",
      label: "Indexability",
      status: "pass",
      detail: robotsMeta
        ? `Robots meta: "${robotsMeta}" — page is indexable.`
        : "No restrictive robots meta tag — page is indexable.",
    });
  }

  // Structured data
  const jsonLd = doc.querySelectorAll(
    'script[type="application/ld+json"]'
  ).length;
  checks.push({
    category: "Technical SEO",
    label: "Structured data (Schema)",
    status: jsonLd > 0 ? "pass" : "warn",
    detail:
      jsonLd > 0
        ? `${jsonLd} JSON-LD schema block${jsonLd > 1 ? "s" : ""} found.`
        : "No JSON-LD structured data found.",
    fix:
      jsonLd > 0
        ? undefined
        : "Add Schema.org JSON-LD (Organization, Article, FAQ, Product…) to unlock rich results in search.",
  });

  // hreflang
  const hreflang = doc.querySelectorAll("link[rel='alternate'][hreflang]")
    .length;
  if (hreflang > 0) {
    checks.push({
      category: "Technical SEO",
      label: "Hreflang tags",
      status: "info",
      detail: `${hreflang} hreflang alternate(s) declared — good for multi-language sites.`,
    });
  }

  // Favicon
  const favicon = doc.querySelector(
    "link[rel='icon'], link[rel='shortcut icon'], link[rel='apple-touch-icon']"
  );
  checks.push({
    category: "Technical SEO",
    label: "Favicon",
    status: favicon ? "pass" : "warn",
    detail: favicon ? "Favicon is declared." : "No favicon link found.",
    fix: favicon
      ? undefined
      : "Add a favicon — it appears next to your result in Google search and in browser tabs.",
  });

  // Links
  let internal = 0;
  let external = 0;
  const pageHost = (() => {
    try {
      return new URL(pageUrl).hostname;
    } catch {
      return "";
    }
  })();
  doc.querySelectorAll("a[href]").forEach((a) => {
    const href = a.getAttribute("href") || "";
    if (
      !href ||
      href.startsWith("#") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:") ||
      href.startsWith("javascript:")
    )
      return;
    try {
      const h = new URL(href, pageUrl).hostname;
      if (h === pageHost) internal++;
      else external++;
    } catch {
      /* ignore malformed href */
    }
  });
  checks.push({
    category: "Content",
    label: "Internal & external links",
    status: internal >= 3 ? "pass" : "warn",
    detail: `${internal} internal link${internal === 1 ? "" : "s"}, ${external} external link${external === 1 ? "" : "s"}.`,
    fix:
      internal >= 3
        ? undefined
        : "Add more internal links to related pages — they spread ranking signal and help crawlers discover content.",
  });

  // Open Graph
  const ogTitle = attr('meta[property="og:title"]', "content");
  const ogDesc = attr('meta[property="og:description"]', "content");
  const ogImage = attr('meta[property="og:image"]', "content");
  const ogCount = [ogTitle, ogDesc, ogImage].filter(Boolean).length;
  checks.push({
    category: "Social",
    label: "Open Graph tags",
    status: ogCount === 3 ? "pass" : ogCount === 0 ? "fail" : "warn",
    detail:
      ogCount === 3
        ? "og:title, og:description and og:image are all present."
        : ogCount === 0
          ? "No Open Graph tags found."
          : `Only ${ogCount} of 3 core OG tags present (missing${ogTitle ? "" : " og:title"}${ogDesc ? "" : " og:description"}${ogImage ? "" : " og:image"}).`,
    fix:
      ogCount === 3
        ? undefined
        : "Add og:title, og:description and og:image so the page previews properly when shared on WhatsApp, Facebook & LinkedIn.",
  });

  // Twitter Card
  const twitterCard = attr('meta[name="twitter:card"]', "content");
  checks.push({
    category: "Social",
    label: "Twitter / X card",
    status: twitterCard ? "pass" : "warn",
    detail: twitterCard
      ? `twitter:card = "${twitterCard}"`
      : "No Twitter card meta tag found.",
    fix: twitterCard
      ? undefined
      : 'Add <meta name="twitter:card" content="summary_large_image"> for a rich preview when shared on X.',
  });

  // Schema.org types — parse @type from every JSON-LD block (handles
  // single object, array, and @graph patterns).
  const schemaTypes: string[] = [];
  doc.querySelectorAll('script[type="application/ld+json"]').forEach((s) => {
    try {
      const data = JSON.parse(s.textContent || "");
      const collect = (n: unknown): void => {
        if (!n || typeof n !== "object") return;
        const obj = n as Record<string, unknown>;
        const t = obj["@type"];
        if (typeof t === "string") schemaTypes.push(t);
        else if (Array.isArray(t))
          t.forEach((x) => typeof x === "string" && schemaTypes.push(x));
        if (Array.isArray(obj["@graph"]))
          (obj["@graph"] as unknown[]).forEach(collect);
      };
      if (Array.isArray(data)) data.forEach(collect);
      else collect(data);
    } catch {
      /* ignore malformed JSON-LD */
    }
  });
  const uniqSchemaTypes = Array.from(new Set(schemaTypes)).sort();
  if (uniqSchemaTypes.length > 0) {
    checks.push({
      category: "Schema Markup",
      label: "Schema.org types detected",
      status: "pass",
      detail: `${uniqSchemaTypes.length} unique type${uniqSchemaTypes.length === 1 ? "" : "s"}: ${uniqSchemaTypes.slice(0, 8).join(", ")}${uniqSchemaTypes.length > 8 ? "…" : ""}.`,
    });
  }

  // AMP detection
  const ampLink = attr('link[rel="amphtml"]', "href") || null;
  if (ampLink) {
    checks.push({
      category: "Technical SEO",
      label: "AMP version",
      status: "info",
      detail: `AMP version declared: ${ampLink.slice(0, 80)}.`,
    });
  }

  // PWA / web manifest
  const manifestLink = attr('link[rel="manifest"]', "href") || null;
  if (manifestLink) {
    checks.push({
      category: "Technical SEO",
      label: "Web app manifest (PWA-ready)",
      status: "pass",
      detail: "Web app manifest declared — site can install as a PWA.",
    });
  }

  // Mixed content — HTTP resources loaded on an HTTPS page
  let mixedContent = 0;
  if (pageUrl.startsWith("https://")) {
    doc.querySelectorAll("[src], [href]").forEach((el) => {
      const u = (
        el.getAttribute("src") ||
        el.getAttribute("href") ||
        ""
      ).trim();
      if (u.toLowerCase().startsWith("http://")) mixedContent++;
    });
    if (mixedContent > 0) {
      checks.push({
        category: "Technical SEO",
        label: "Mixed content",
        status: "fail",
        detail: `${mixedContent} HTTP resource${mixedContent === 1 ? "" : "s"} loaded on an HTTPS page — browsers will block or downgrade these.`,
        fix: "Update every http:// reference (src/href) to https:// or use a protocol-relative URL.",
      });
    } else {
      checks.push({
        category: "Technical SEO",
        label: "Mixed content",
        status: "pass",
        detail: "No mixed (HTTP) resources detected on the HTTPS page.",
      });
    }
  }

  // v3 deep technical audit — 20+ further checks (i18n, schema deep validation,
  // link-graph quality, render-blocking, third-party fan-out, fonts, image
  // optimisation, mobile/a11y, char-encoding, canonical alignment, content
  // density, security hygiene). Pure additive — merged into the same checks
  // array and rendered under their own category sections.
  checks.push(...analyzeAdvanced(pageUrl, doc));
  // v4 second deep pass — URL quality, resource hints, social meta depth,
  // PWA fundamentals, responsive imagery, content readability, outbound
  // authority signals, robots/sitemap deep parse. Same additive pattern.
  checks.push(...analyzeAdvanced2(pageUrl, doc, html));

  return {
    checks: tagSource(checks, "Crawl"),
    schemaTypes: uniqSchemaTypes,
    ampUrl: ampLink,
    manifestUrl: manifestLink,
    mixedContentCount: mixedContent,
  };
}

// ─── v3: deep technical audit ────────────────────────────────────────────
/**
 * analyzeAdvanced — runs the v3 "deeper technical SEO" passes:
 *
 *   1. Hreflang validation (codes, x-default, self-reference)
 *   2. <html lang> BCP-47 quality
 *   3. JSON-LD parse + @context validation
 *   4. Article / Product / FAQPage schema completeness
 *   5. Generic anchor text ratio ("click here", "read more")
 *   6. External-link `rel` attribute usage (nofollow / sponsored / ugc)
 *   7. Broken in-page anchors (href="#x" with no matching id)
 *   8. Render-blocking resources in <head>
 *   9. Third-party request fan-out
 *  10. Web font loading strategy (preload, woff2, font-display: swap)
 *  11. Modern image formats (WebP / AVIF)
 *  12. Image lazy-loading coverage
 *  13. Image dimensions (CLS prevention)
 *  14. Viewport disables zoom (accessibility fail)
 *  15. Viewport missing width=device-width
 *  16. Form-input labels (WCAG 3.3.2)
 *  17. Heading hierarchy (no skipped levels)
 *  18. Character encoding declared
 *  19. Canonical points elsewhere (info signal)
 *  20. Canonical protocol mismatch (HTTPS page → HTTP canonical)
 *  21. Text-to-HTML ratio (content density)
 *  22. Inline event handlers (CSP / security smell)
 *
 * Receives the already-parsed Document so we don't re-parse the HTML.
 * Returns an array of Check objects to be merged with the main on-page set.
 */
function analyzeAdvanced(pageUrl: string, doc: Document): Check[] {
  const checks: Check[] = [];
  const attr = (sel: string, name: string) =>
    (doc.querySelector(sel)?.getAttribute(name) || "").trim();

  const pageHost = (() => {
    try {
      return new URL(pageUrl).hostname;
    } catch {
      return "";
    }
  })();

  // ── 1. Hreflang validation ──────────────────────────────────────────
  const hreflangs = Array.from(
    doc.querySelectorAll('link[rel="alternate"][hreflang]')
  );
  if (hreflangs.length > 0) {
    const codes = hreflangs.map((l) =>
      (l.getAttribute("hreflang") || "").trim()
    );
    const valid = codes.filter((c) =>
      /^([a-z]{2,3})(-[A-Z]{2})?$|^x-default$/.test(c)
    );
    const xDefault = codes.includes("x-default");
    const hasSelfRef = hreflangs.some((l) => {
      try {
        const u = new URL(l.getAttribute("href") || "", pageUrl).toString();
        return (
          u.replace(/\/$/, "").toLowerCase() ===
          pageUrl.replace(/\/$/, "").toLowerCase()
        );
      } catch {
        return false;
      }
    });
    const issues: string[] = [];
    if (valid.length !== codes.length)
      issues.push(`${codes.length - valid.length} invalid code(s)`);
    if (!xDefault) issues.push("no x-default declared");
    if (!hasSelfRef) issues.push("missing self-referencing tag");
    checks.push({
      category: "Internationalisation",
      label: "Hreflang validation",
      status: issues.length === 0 ? "pass" : "warn",
      detail:
        issues.length === 0
          ? `${hreflangs.length} hreflang entries valid; includes x-default and self-reference.`
          : `${hreflangs.length} hreflang entries — issues: ${issues.join("; ")}.`,
      fix:
        issues.length === 0
          ? undefined
          : "Every hreflang set should (a) self-reference the current page, (b) include an x-default fallback, (c) use valid ISO codes (e.g. `en`, `en-IN`, `hi-IN`).",
    });
  }

  // ── 2. <html lang> BCP-47 quality ───────────────────────────────────
  const htmlLang = (doc.documentElement.getAttribute("lang") || "").trim();
  if (htmlLang) {
    const validLang = /^[a-z]{2,3}(-[A-Z]{2})?$/.test(htmlLang);
    if (!validLang) {
      checks.push({
        category: "Internationalisation",
        label: "Language code format",
        status: "warn",
        detail: `<html lang="${htmlLang}"> doesn't match a valid BCP-47/ISO code.`,
        fix: 'Use a BCP-47 code like "en", "en-IN", "hi-IN".',
      });
    }
  }

  // ── 3 & 4. JSON-LD parse + @context + per-type completeness ────────
  const ldBlocks = Array.from(
    doc.querySelectorAll('script[type="application/ld+json"]')
  );
  if (ldBlocks.length > 0) {
    let parseFails = 0;
    let contextWrong = 0;
    let articleSeen = false;
    let articleHasHeadline = true;
    let productSeen = false;
    let productHasName = true;
    let faqSeen = false;
    let faqHasMainEntity = true;
    const inspect = (n: unknown): void => {
      if (!n || typeof n !== "object") return;
      const obj = n as Record<string, unknown>;
      const ctx = obj["@context"];
      if (typeof ctx === "string" && !/schema\.org/i.test(ctx)) contextWrong++;
      const t = obj["@type"];
      const types: string[] = Array.isArray(t)
        ? t.filter((x): x is string => typeof x === "string")
        : typeof t === "string"
          ? [t]
          : [];
      types.forEach((typ) => {
        if (
          typ === "Article" ||
          typ === "NewsArticle" ||
          typ === "BlogPosting"
        ) {
          articleSeen = true;
          if (!obj["headline"]) articleHasHeadline = false;
        }
        if (typ === "Product") {
          productSeen = true;
          if (!obj["name"]) productHasName = false;
        }
        if (typ === "FAQPage") {
          faqSeen = true;
          if (!obj["mainEntity"]) faqHasMainEntity = false;
        }
      });
      if (Array.isArray(obj["@graph"]))
        (obj["@graph"] as unknown[]).forEach(inspect);
    };
    ldBlocks.forEach((s) => {
      try {
        const data = JSON.parse(s.textContent || "");
        if (Array.isArray(data)) data.forEach(inspect);
        else inspect(data);
      } catch {
        parseFails++;
      }
    });
    if (parseFails > 0) {
      checks.push({
        category: "Schema Markup",
        label: "JSON-LD parse errors",
        status: "fail",
        detail: `${parseFails} of ${ldBlocks.length} JSON-LD block(s) failed to parse — invalid JSON.`,
        fix: 'Validate every <script type="application/ld+json"> block with a JSON linter — Google ignores invalid JSON-LD entirely.',
      });
    }
    if (contextWrong > 0) {
      checks.push({
        category: "Schema Markup",
        label: "Schema @context",
        status: "warn",
        detail: `${contextWrong} JSON-LD block(s) use a non-schema.org @context.`,
        fix: 'Set "@context": "https://schema.org" so Google recognises the structured data.',
      });
    }
    if (articleSeen && !articleHasHeadline) {
      checks.push({
        category: "Schema Markup",
        label: "Article schema completeness",
        status: "warn",
        detail: "Article schema is missing the required `headline` field.",
        fix: "Add a `headline` field (≤110 chars) to your Article JSON-LD.",
      });
    }
    if (productSeen && !productHasName) {
      checks.push({
        category: "Schema Markup",
        label: "Product schema completeness",
        status: "warn",
        detail: "Product schema is missing the required `name` field.",
        fix: "Add a `name` field (the product name) to your Product JSON-LD.",
      });
    }
    if (faqSeen && !faqHasMainEntity) {
      checks.push({
        category: "Schema Markup",
        label: "FAQPage schema completeness",
        status: "warn",
        detail: "FAQPage schema is missing the required `mainEntity` array.",
        fix: "Add a `mainEntity` array of Question / Answer pairs to your FAQPage JSON-LD.",
      });
    }
  }

  // ── 5. Generic anchor text ratio ────────────────────────────────────
  const anchors = Array.from(
    doc.querySelectorAll("a[href]")
  ) as HTMLAnchorElement[];
  const generic = anchors.filter((a) => {
    const txt = (a.textContent || "").trim().toLowerCase();
    return /^(click here|here|read more|learn more|this link|link|more)$/.test(
      txt
    );
  });
  if (anchors.length >= 10 && generic.length > 0) {
    const ratio = generic.length / anchors.length;
    checks.push({
      category: "Content",
      label: "Anchor text descriptiveness",
      status: ratio > 0.2 ? "warn" : "pass",
      detail: `${generic.length} of ${anchors.length} links use generic anchor text ("click here", "read more", etc.).`,
      fix:
        ratio > 0.2
          ? "Replace generic anchor text with descriptive phrases ('See our EMI calculator', 'Read the GST guide'). Anchor text is a real ranking signal."
          : undefined,
    });
  }

  // ── 6. External-link `rel` attribute usage ──────────────────────────
  let nofollow = 0;
  let sponsored = 0;
  let ugc = 0;
  let extWithoutRel = 0;
  let extTotal = 0;
  anchors.forEach((a) => {
    const href = a.getAttribute("href") || "";
    try {
      const h = new URL(href, pageUrl).hostname;
      if (h && h !== pageHost) {
        extTotal++;
        const rel = (a.getAttribute("rel") || "").toLowerCase();
        if (rel.includes("nofollow")) nofollow++;
        if (rel.includes("sponsored")) sponsored++;
        if (rel.includes("ugc")) ugc++;
        if (!rel) extWithoutRel++;
      }
    } catch {
      /* ignore malformed href */
    }
  });
  if (extTotal >= 3) {
    const noRelRatio = extWithoutRel / extTotal;
    checks.push({
      category: "Content",
      label: "External link rel attributes",
      status: noRelRatio > 0.7 ? "info" : "pass",
      detail: `${extTotal} external links: ${nofollow} nofollow, ${sponsored} sponsored, ${ugc} ugc, ${extWithoutRel} no rel attribute.`,
      fix:
        noRelRatio > 0.7
          ? 'Consider adding `rel="noopener"` (security) and where appropriate `nofollow` / `sponsored` / `ugc` to external links — Google asks for these signals.'
          : undefined,
    });
  }

  // ── 7. Broken in-page anchor fragments ──────────────────────────────
  let brokenFragments = 0;
  anchors.forEach((a) => {
    const href = a.getAttribute("href") || "";
    if (href.startsWith("#") && href.length > 1) {
      const id = href.slice(1);
      if (
        !doc.getElementById(id) &&
        !doc.querySelector(`[name="${id.replace(/"/g, "")}"]`)
      ) {
        brokenFragments++;
      }
    }
  });
  if (brokenFragments > 0) {
    checks.push({
      category: "Content",
      label: "Broken in-page anchors",
      status: "warn",
      detail: `${brokenFragments} <a href="#…"> link(s) point to an ID that doesn't exist on the page.`,
      fix: "Fix the broken fragment links or add matching `id` attributes to the target elements.",
    });
  }

  // ── 8. Render-blocking resources in <head> ──────────────────────────
  const head = doc.head;
  const blockingStyles = Array.from(
    head?.querySelectorAll('link[rel="stylesheet"]') || []
  ).filter((l) => {
    const m = (l.getAttribute("media") || "").toLowerCase();
    return !m || m === "all" || m === "screen";
  });
  const blockingScripts = Array.from(
    head?.querySelectorAll("script[src]") || []
  ).filter(
    (s) =>
      !s.hasAttribute("async") &&
      !s.hasAttribute("defer") &&
      !((s.getAttribute("type") || "").toLowerCase().includes("module"))
  );
  const totalBlocking = blockingStyles.length + blockingScripts.length;
  checks.push({
    category: "Performance Details",
    label: "Render-blocking resources",
    status:
      totalBlocking === 0 ? "pass" : totalBlocking <= 3 ? "warn" : "fail",
    detail: `${blockingStyles.length} blocking stylesheet(s) + ${blockingScripts.length} blocking script(s) in <head>.`,
    fix:
      totalBlocking === 0
        ? undefined
        : "Add `media`, `async` or `defer` to non-critical resources. Inline critical CSS for above-the-fold content.",
  });

  // ── 9. Third-party request fan-out ──────────────────────────────────
  const thirdPartyHosts = new Map<string, number>();
  doc.querySelectorAll("[src], [href]").forEach((el) => {
    const u = (
      el.getAttribute("src") ||
      el.getAttribute("href") ||
      ""
    ).trim();
    if (
      !u ||
      u.startsWith("#") ||
      u.startsWith("mailto:") ||
      u.startsWith("tel:") ||
      u.startsWith("javascript:") ||
      u.startsWith("data:")
    )
      return;
    try {
      const h = new URL(u, pageUrl).hostname;
      if (h && h !== pageHost) {
        thirdPartyHosts.set(h, (thirdPartyHosts.get(h) || 0) + 1);
      }
    } catch {
      /* ignore */
    }
  });
  if (thirdPartyHosts.size > 0) {
    const top3 = Array.from(thirdPartyHosts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([h, c]) => `${h} (${c})`)
      .join(", ");
    checks.push({
      category: "Performance Details",
      label: "Third-party requests",
      status:
        thirdPartyHosts.size <= 5
          ? "pass"
          : thirdPartyHosts.size <= 12
            ? "warn"
            : "fail",
      detail: `${thirdPartyHosts.size} unique third-party host(s) referenced. Top: ${top3}.`,
      fix:
        thirdPartyHosts.size <= 5
          ? undefined
          : "Every third-party domain adds DNS + TLS overhead. Audit which ones are essential — drop or self-host the rest.",
    });
  }

  // ── 10. Web font loading strategy ───────────────────────────────────
  const fontPreloads = doc.querySelectorAll(
    'link[rel="preload"][as="font"]'
  ).length;
  const styleBlocks = Array.from(doc.querySelectorAll("style"))
    .map((s) => s.textContent || "")
    .join("\n");
  const fontFaceBlocks = styleBlocks.match(/@font-face\s*\{[^}]*\}/gi) || [];
  const swapCount = fontFaceBlocks.filter((b) =>
    /font-display\s*:\s*swap/i.test(b)
  ).length;
  const woff2Refs =
    (styleBlocks.match(/\.woff2/gi) || []).length +
    Array.from(doc.querySelectorAll('link[href*=".woff2"]')).length;
  const googleFontsLinks = doc.querySelectorAll(
    'link[href*="fonts.googleapis.com"], link[href*="fonts.gstatic.com"]'
  ).length;
  const fontIssues: string[] = [];
  if (fontFaceBlocks.length > 0 && swapCount === 0)
    fontIssues.push("no `font-display: swap`");
  if (fontFaceBlocks.length > 0 && fontPreloads === 0)
    fontIssues.push("no `<link rel=preload>` for fonts");
  if (fontFaceBlocks.length > 0 && woff2Refs === 0)
    fontIssues.push("no woff2 detected");
  if (fontFaceBlocks.length + googleFontsLinks > 0) {
    checks.push({
      category: "Performance Details",
      label: "Web font loading strategy",
      status: fontIssues.length === 0 ? "pass" : "warn",
      detail:
        fontIssues.length === 0
          ? "Fonts use a modern strategy (preload + woff2 + font-display: swap detected)."
          : `Fonts loaded — issues: ${fontIssues.join("; ")}.`,
      fix:
        fontIssues.length === 0
          ? undefined
          : "Best practice: serve fonts as woff2, set `font-display: swap` so text renders immediately, and `<link rel=preload>` the critical font.",
    });
  }

  // ── 11-13. Image optimisation trio ──────────────────────────────────
  const imgs = Array.from(doc.querySelectorAll("img")) as HTMLImageElement[];
  if (imgs.length >= 3) {
    const fmt = (src: string): string => {
      const m = src
        .toLowerCase()
        .match(/\.(webp|avif|jpg|jpeg|png|gif|svg)(\?|$|#)/);
      return m ? m[1] : "other";
    };
    let modern = 0;
    let legacy = 0;
    imgs.forEach((i) => {
      const src = i.getAttribute("src") || "";
      const f = fmt(src);
      if (f === "webp" || f === "avif") modern++;
      else if (f === "jpg" || f === "jpeg" || f === "png") legacy++;
    });
    const totalBitmap = modern + legacy;
    if (totalBitmap >= 3) {
      const modernPct = Math.round((modern / totalBitmap) * 100);
      checks.push({
        category: "Performance Details",
        label: "Modern image formats (WebP/AVIF)",
        status:
          modernPct >= 70 ? "pass" : modernPct >= 30 ? "warn" : "fail",
        detail: `${modernPct}% of bitmap images use WebP or AVIF (${modern} modern vs ${legacy} legacy JPEG/PNG).`,
        fix:
          modernPct >= 70
            ? undefined
            : "Convert JPEG/PNG images to WebP — typically 25-35% smaller at the same quality. Most image CDNs do this automatically.",
      });
    }

    if (imgs.length >= 5) {
      const lazy = imgs.filter(
        (i) => i.getAttribute("loading") === "lazy"
      ).length;
      const lazyPct = Math.round((lazy / imgs.length) * 100);
      checks.push({
        category: "Performance Details",
        label: "Image lazy-loading",
        status: lazyPct >= 60 ? "pass" : lazyPct >= 20 ? "warn" : "fail",
        detail: `${lazy} of ${imgs.length} images (${lazyPct}%) use loading="lazy".`,
        fix:
          lazyPct >= 60
            ? undefined
            : 'Add `loading="lazy"` to below-the-fold images so the browser defers their download until the user scrolls near them.',
      });
    }

    const sized = imgs.filter(
      (i) => i.hasAttribute("width") && i.hasAttribute("height")
    ).length;
    const sizedPct = Math.round((sized / imgs.length) * 100);
    checks.push({
      category: "Performance Details",
      label: "Image dimensions (CLS prevention)",
      status: sizedPct >= 70 ? "pass" : sizedPct >= 30 ? "warn" : "fail",
      detail: `${sized} of ${imgs.length} images (${sizedPct}%) have explicit width + height attributes.`,
      fix:
        sizedPct >= 70
          ? undefined
          : "Set `width` and `height` on every <img> — the browser can reserve the right space before the image loads, eliminating Cumulative Layout Shift.",
    });
  }

  // ── 14 & 15. Viewport quality (zoom disabled / missing width) ──────
  const vp = attr('meta[name="viewport"]', "content").toLowerCase();
  if (vp) {
    if (
      vp.includes("user-scalable=no") ||
      /maximum-scale\s*=\s*1(\.0+)?(\D|$)/.test(vp)
    ) {
      checks.push({
        category: "Accessibility",
        label: "Viewport disables zoom",
        status: "warn",
        detail:
          "Viewport meta disables user zoom — fails WCAG 1.4.4 (Resize Text).",
        fix: "Remove `user-scalable=no` and `maximum-scale=1` from the viewport meta. Users must be able to zoom.",
      });
    }
    if (!vp.includes("width=device-width")) {
      checks.push({
        category: "Accessibility",
        label: "Viewport width",
        status: "warn",
        detail:
          "Viewport meta is missing `width=device-width` — site may not scale to phone screens.",
        fix: 'Use <meta name="viewport" content="width=device-width, initial-scale=1">.',
      });
    }
  }

  // ── 16. Form input labels (WCAG 3.3.2) ──────────────────────────────
  const inputs = Array.from(
    doc.querySelectorAll(
      'input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="image"]), textarea, select'
    )
  ) as HTMLElement[];
  if (inputs.length > 0) {
    const unlabeled = inputs.filter((i) => {
      if (i.getAttribute("aria-label")) return false;
      if (i.getAttribute("aria-labelledby")) return false;
      const id = i.getAttribute("id");
      if (id) {
        try {
          if (doc.querySelector(`label[for="${id.replace(/"/g, "")}"]`))
            return false;
        } catch {
          /* invalid selector — fall through */
        }
      }
      if (i.closest("label")) return false;
      if (i.getAttribute("placeholder") && i.getAttribute("title")) return false;
      return true;
    }).length;
    if (unlabeled > 0) {
      checks.push({
        category: "Accessibility",
        label: "Form input labels",
        status: "fail",
        detail: `${unlabeled} of ${inputs.length} form input(s) have no associated <label>.`,
        fix: 'Add <label for="id"> or wrap each input in a <label>. Required by WCAG 3.3.2.',
      });
    } else {
      checks.push({
        category: "Accessibility",
        label: "Form input labels",
        status: "pass",
        detail: `All ${inputs.length} form input(s) have proper labels.`,
      });
    }
  }

  // ── 17. Heading hierarchy (no skipped levels) ──────────────────────
  const headings = Array.from(
    doc.querySelectorAll("h1, h2, h3, h4, h5, h6")
  );
  let skipped = 0;
  let prev = 0;
  headings.forEach((h) => {
    const lvl = parseInt(h.tagName[1], 10);
    if (prev > 0 && lvl > prev + 1) skipped++;
    prev = lvl;
  });
  if (headings.length >= 2) {
    checks.push({
      category: "Accessibility",
      label: "Heading hierarchy",
      status: skipped === 0 ? "pass" : "warn",
      detail:
        skipped === 0
          ? `Heading order is logical (no skipped levels across ${headings.length} headings).`
          : `${skipped} heading(s) skip a level (e.g. H2 → H4 without an H3 between).`,
      fix:
        skipped === 0
          ? undefined
          : "Don't skip heading levels. Screen-reader users navigate by headings; skipping H3 confuses the structure.",
    });
  }

  // ── 18. Character encoding declared ─────────────────────────────────
  const charsetMeta = doc.querySelector(
    'meta[charset], meta[http-equiv="Content-Type"]'
  );
  checks.push({
    category: "Technical SEO",
    label: "Character encoding",
    status: charsetMeta ? "pass" : "warn",
    detail: charsetMeta
      ? `Charset declared: ${charsetMeta.getAttribute("charset") || charsetMeta.getAttribute("content") || "via meta tag"}.`
      : "No <meta charset> declared in <head>.",
    fix: charsetMeta
      ? undefined
      : 'Add <meta charset="UTF-8"> as the first child of <head>.',
  });

  // ── 19 & 20. Canonical href alignment ───────────────────────────────
  const canonHref = attr('link[rel="canonical"]', "href");
  if (canonHref) {
    let canonAbs = canonHref;
    try {
      canonAbs = new URL(canonHref, pageUrl).toString();
    } catch {
      /* ignore — keep raw */
    }
    const pageNorm = pageUrl.replace(/\/$/, "").toLowerCase();
    const canonNorm = canonAbs.replace(/\/$/, "").toLowerCase();
    if (canonNorm !== pageNorm) {
      checks.push({
        category: "Technical SEO",
        label: "Canonical points elsewhere",
        status: "info",
        detail: `The canonical (${canonAbs.slice(0, 80)}…) is different from the audited URL — this page tells Google to credit a different URL.`,
        fix: "If this is intentional (alternate / duplicate page), no action needed. If not, set the canonical to this URL.",
      });
    }
    if (pageUrl.startsWith("https://") && canonAbs.startsWith("http://")) {
      checks.push({
        category: "Technical SEO",
        label: "Canonical protocol mismatch",
        status: "fail",
        detail:
          "HTTPS page declares an HTTP canonical — Google indexes the HTTP version, hurting your secure ranking signal.",
        fix: "Update the canonical href to https://.",
      });
    }
  }

  // ── 21. Text-to-HTML ratio ──────────────────────────────────────────
  const textLen = (doc.body?.textContent || "")
    .replace(/\s+/g, " ")
    .trim().length;
  const htmlLen = doc.documentElement.outerHTML.length;
  const txtRatio = htmlLen > 0 ? Math.round((textLen / htmlLen) * 100) : 0;
  checks.push({
    category: "Content",
    label: "Text-to-HTML ratio",
    status: txtRatio >= 10 ? "pass" : txtRatio >= 5 ? "warn" : "fail",
    detail: `${txtRatio}% of the HTML is visible text (${textLen.toLocaleString()} text bytes / ${htmlLen.toLocaleString()} total).`,
    fix:
      txtRatio >= 10
        ? undefined
        : "Low text-to-HTML ratio suggests markup or scripts dominate the page. Aim for 10-25% — search engines weight content density.",
  });

  // ── 22. Inline event handlers (security / CSP smell) ────────────────
  const inlineHandlers = Array.from(doc.querySelectorAll("*")).filter((el) =>
    Array.from(el.attributes || []).some((a) => /^on[a-z]+$/i.test(a.name))
  ).length;
  if (inlineHandlers > 0) {
    checks.push({
      category: "Best Practices",
      label: "Inline event handlers",
      status: inlineHandlers > 5 ? "warn" : "info",
      detail: `${inlineHandlers} element(s) use inline event handlers (onclick, onload, etc.).`,
      fix:
        inlineHandlers > 5
          ? "Move event handlers to external scripts — inline handlers block strict Content Security Policy (CSP) and signal older code."
          : undefined,
    });
  }

  return checks;
}

// ─── v4: second deep technical audit ─────────────────────────────────────
/**
 * analyzeAdvanced2 — runs the v4 "every-tiny-detail" passes:
 *
 *   23. URL quality: length, depth, hyphens/underscores, query params,
 *       mixed case, ID-like segments
 *   24. Resource hints: preconnect / dns-prefetch / preload / prefetch
 *   25. theme-color meta (browser chrome on mobile)
 *   26. Apple touch icon (iOS home-screen)
 *   27. og:site_name + og:locale + og:type
 *   28. og:image dimensions (og:image:width / og:image:height)
 *   29. Article published / modified time (article:published_time)
 *   30. Twitter site / creator handles
 *   31. Pagination rel="prev" / rel="next"
 *   32. Author meta (publisher / authority)
 *   33. Print stylesheet
 *   34. Dark-mode CSS (prefers-color-scheme)
 *   35. Service worker registration
 *   36. Responsive images — srcset coverage
 *   37. Title-brand consistency (heuristic)
 *   38. Description starts with a call-to-action verb (heuristic)
 *   39. URL canonical-vs-final URL match
 *   40. Page depth (URL slashes)
 *   41. Outbound links to .gov / .edu / .org (authority signal)
 *   42. Average sentence length (readability)
 *   43. Paragraph count + structure
 *   44. URL contains tracking params (utm_*, fbclid, gclid)
 *   45. Pretty URLs vs ID-based (e.g. ?id=123)
 *   46. Trailing-slash consistency
 *   47. Schema includes Organization / WebSite (site-wide identity)
 *
 * Pure HTML inspection — no extra network calls beyond the on-page fetch
 * that's already happening. Every result traces to a real attribute or
 * computed value.
 */
function analyzeAdvanced2(
  pageUrl: string,
  doc: Document,
  html: string
): Check[] {
  const checks: Check[] = [];
  const attr = (sel: string, name: string) =>
    (doc.querySelector(sel)?.getAttribute(name) || "").trim();

  let parsedUrl: URL | null = null;
  try {
    parsedUrl = new URL(pageUrl);
  } catch {
    /* fall through — some checks just skip */
  }
  const pageHost = parsedUrl?.hostname || "";

  // ── 23. URL quality ────────────────────────────────────────────────
  if (parsedUrl) {
    const path = parsedUrl.pathname;
    const fullLen = pageUrl.length;
    const slashes = path.split("/").filter(Boolean).length;
    const hasUnderscore = /_/.test(path);
    const hasUpper = /[A-Z]/.test(path);
    const idLike = /\/\d{4,}(\/|$)/.test(path); // /1234567/ style
    const issues: string[] = [];
    if (fullLen > 100) issues.push(`length ${fullLen} chars (Google truncates >75)`);
    if (slashes > 4) issues.push(`${slashes}-level deep path`);
    if (hasUnderscore) issues.push("underscores (Google prefers hyphens)");
    if (hasUpper) issues.push("mixed-case path (case-sensitivity risk)");
    if (idLike) issues.push("numeric ID in path (not descriptive)");
    checks.push({
      category: "On-Page SEO",
      label: "URL quality",
      status: issues.length === 0 ? "pass" : issues.length <= 2 ? "warn" : "fail",
      detail:
        issues.length === 0
          ? `URL is clean: ${slashes}-level path, hyphenated, ${fullLen} chars.`
          : `URL issues: ${issues.join("; ")}.`,
      fix:
        issues.length === 0
          ? undefined
          : "Aim for short, descriptive, lowercase URLs with hyphens — e.g. /tools/emi-calculator instead of /Tools_Section/Item_12345.",
      source: "Crawl",
    });

    // 44. Tracking params in canonical URL
    const params = Array.from(parsedUrl.searchParams.keys());
    const trackingParams = params.filter((p) =>
      /^(utm_|fbclid$|gclid$|mc_eid$|mc_cid$|igshid$|_ga$|hsCtaTracking$)/i.test(
        p
      )
    );
    if (trackingParams.length > 0) {
      checks.push({
        category: "Technical SEO",
        label: "URL contains tracking parameters",
        status: "warn",
        detail: `${trackingParams.length} tracking param(s) in the URL: ${trackingParams.join(", ")}.`,
        fix: "Strip tracking params from the canonical URL — they create duplicate-content noise in search results.",
        source: "Crawl",
      });
    }
    // 45. ID-based URL pattern
    if (/[?&]id=\d+/.test(pageUrl)) {
      checks.push({
        category: "Technical SEO",
        label: "ID-based URL parameter",
        status: "warn",
        detail: "URL relies on ?id=… instead of a descriptive slug.",
        fix: "Rewrite ID-based URLs as descriptive paths (e.g. /products/blue-shoes instead of /product?id=1234).",
        source: "Crawl",
      });
    }
  }

  // ── 24. Resource hints ─────────────────────────────────────────────
  const preconnect = doc.querySelectorAll('link[rel="preconnect"]').length;
  const dnsPrefetch = doc.querySelectorAll('link[rel="dns-prefetch"]').length;
  const preload = doc.querySelectorAll('link[rel="preload"]').length;
  const prefetch = doc.querySelectorAll('link[rel="prefetch"]').length;
  const totalHints = preconnect + dnsPrefetch + preload + prefetch;
  checks.push({
    category: "Performance Details",
    label: "Resource hints (preconnect / preload / dns-prefetch)",
    status: totalHints > 0 ? "pass" : "info",
    detail:
      totalHints > 0
        ? `${preconnect} preconnect · ${dnsPrefetch} dns-prefetch · ${preload} preload · ${prefetch} prefetch.`
        : "No resource hints found. Use <link rel=\"preconnect\"> for critical third-party origins and <link rel=\"preload\"> for hero images and fonts.",
    fix:
      totalHints > 0
        ? undefined
        : "Add `<link rel=\"preconnect\" href=\"https://fonts.gstatic.com\">` and similar hints for every critical origin — saves 100-300 ms per origin.",
    source: "Crawl",
  });

  // ── 25. theme-color meta ────────────────────────────────────────────
  const themeColor = attr('meta[name="theme-color"]', "content");
  checks.push({
    category: "On-Page SEO",
    label: "Theme color (mobile browser chrome)",
    status: themeColor ? "pass" : "info",
    detail: themeColor
      ? `theme-color = "${themeColor}"`
      : "No <meta name=\"theme-color\"> — mobile browsers use the default browser chrome on this page.",
    fix: themeColor
      ? undefined
      : 'Add <meta name="theme-color" content="#yourBrandColor"> so Chrome/Safari/Firefox tint the mobile address bar with your brand.',
    source: "Crawl",
  });

  // ── 26. Apple touch icon ───────────────────────────────────────────
  const touchIcon = doc.querySelector(
    'link[rel="apple-touch-icon"], link[rel="apple-touch-icon-precomposed"]'
  );
  checks.push({
    category: "On-Page SEO",
    label: "Apple touch icon (iOS home-screen)",
    status: touchIcon ? "pass" : "info",
    detail: touchIcon
      ? "Apple touch icon declared — iPhone users get a branded icon when they add to home screen."
      : "No apple-touch-icon link — iOS uses a screenshot of your page as the home-screen icon.",
    fix: touchIcon
      ? undefined
      : 'Add <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"> with a 180×180 PNG.',
    source: "Crawl",
  });

  // ── 27. Open Graph completeness (site_name / locale / type) ────────
  const ogSiteName = attr('meta[property="og:site_name"]', "content");
  const ogLocale = attr('meta[property="og:locale"]', "content");
  const ogType = attr('meta[property="og:type"]', "content");
  const ogMissing: string[] = [];
  if (!ogSiteName) ogMissing.push("og:site_name");
  if (!ogLocale) ogMissing.push("og:locale");
  if (!ogType) ogMissing.push("og:type");
  if (ogMissing.length < 3) {
    // Only emit this check if at least one OG tag exists (otherwise the
    // core og:title/desc/image check already flagged the absence)
    checks.push({
      category: "Social",
      label: "Extended Open Graph tags",
      status: ogMissing.length === 0 ? "pass" : "warn",
      detail:
        ogMissing.length === 0
          ? `og:site_name="${ogSiteName}", og:locale="${ogLocale}", og:type="${ogType}" all present.`
          : `Missing: ${ogMissing.join(", ")}.`,
      fix:
        ogMissing.length === 0
          ? undefined
          : "Add the missing OG tags — they sharpen the share preview on WhatsApp, Facebook & LinkedIn.",
      source: "Crawl",
    });
  }

  // ── 28. og:image dimensions ────────────────────────────────────────
  const ogImage = attr('meta[property="og:image"]', "content");
  const ogImageW = attr('meta[property="og:image:width"]', "content");
  const ogImageH = attr('meta[property="og:image:height"]', "content");
  if (ogImage) {
    const sized = !!(ogImageW && ogImageH);
    const wOk = sized && parseInt(ogImageW, 10) >= 1200;
    const hOk = sized && parseInt(ogImageH, 10) >= 630;
    checks.push({
      category: "Social",
      label: "og:image dimensions",
      status: sized && wOk && hOk ? "pass" : sized ? "warn" : "info",
      detail: sized
        ? `og:image declared at ${ogImageW}×${ogImageH}px ${wOk && hOk ? "(meets Facebook's 1200×630 recommendation)." : "(below Facebook's recommended 1200×630)."}`
        : "og:image is set, but no og:image:width / og:image:height — Facebook may downsize or crop.",
      fix:
        sized && wOk && hOk
          ? undefined
          : 'Provide a 1200×630 PNG/JPG and declare <meta property="og:image:width" content="1200">, <meta property="og:image:height" content="630">.',
      source: "Crawl",
    });
  }

  // ── 29. Article published / modified time ──────────────────────────
  const published = attr('meta[property="article:published_time"]', "content");
  const modified = attr('meta[property="article:modified_time"]', "content");
  if (published || modified) {
    checks.push({
      category: "Content",
      label: "Article publish / modified timestamps",
      status: "pass",
      detail:
        `${published ? `Published: ${published.slice(0, 10)}` : "No published_time"}; ` +
        `${modified ? `Modified: ${modified.slice(0, 10)}` : "no modified_time"}.`,
      source: "Crawl",
    });
  }

  // ── 30. Twitter handles ────────────────────────────────────────────
  const twSite = attr('meta[name="twitter:site"]', "content");
  const twCreator = attr('meta[name="twitter:creator"]', "content");
  if (twSite || twCreator) {
    checks.push({
      category: "Social",
      label: "Twitter / X handles",
      status: "pass",
      detail: [
        twSite ? `site=${twSite}` : null,
        twCreator ? `creator=${twCreator}` : null,
      ]
        .filter(Boolean)
        .join(" · "),
      source: "Crawl",
    });
  }

  // ── 31. Pagination prev / next ─────────────────────────────────────
  const relPrev = doc.querySelector('link[rel="prev"]');
  const relNext = doc.querySelector('link[rel="next"]');
  if (relPrev || relNext) {
    checks.push({
      category: "Technical SEO",
      label: "Pagination tags",
      status: "info",
      detail: `${relPrev ? "rel=prev " : ""}${relNext ? "rel=next" : ""}declared — page is part of a sequence.`,
      source: "Crawl",
    });
  }

  // ── 32. Author meta ────────────────────────────────────────────────
  const authorMeta = attr('meta[name="author"]', "content");
  if (authorMeta) {
    checks.push({
      category: "Content",
      label: "Author attribution",
      status: "pass",
      detail: `Author meta: "${authorMeta}".`,
      source: "Crawl",
    });
  }

  // ── 33. Print stylesheet ───────────────────────────────────────────
  const printSheet = doc.querySelector(
    'link[rel="stylesheet"][media*="print"], style[media*="print"]'
  );
  if (printSheet) {
    checks.push({
      category: "Best Practices",
      label: "Print stylesheet",
      status: "info",
      detail: "A print-specific stylesheet is present — page prints cleanly.",
      source: "Crawl",
    });
  }

  // ── 34. Dark-mode CSS hint ────────────────────────────────────────
  const styleText = Array.from(doc.querySelectorAll("style"))
    .map((s) => s.textContent || "")
    .join("\n");
  const darkModeDetected = /prefers-color-scheme/i.test(styleText);
  if (darkModeDetected) {
    checks.push({
      category: "Best Practices",
      label: "Dark mode CSS",
      status: "info",
      detail:
        "Page uses `@media (prefers-color-scheme: dark)` — adapts to user theme.",
      source: "Crawl",
    });
  }

  // ── 35. Service worker registration ───────────────────────────────
  const swRegistered = /navigator\.serviceWorker\.register/i.test(html);
  if (swRegistered) {
    checks.push({
      category: "Best Practices",
      label: "Service worker",
      status: "info",
      detail: "A service worker registration call is present — offline / PWA capability is wired up.",
      source: "Crawl",
    });
  }

  // ── 36. Responsive images (srcset coverage) ───────────────────────
  const imgs = Array.from(doc.querySelectorAll("img")) as HTMLImageElement[];
  if (imgs.length >= 5) {
    const responsive = imgs.filter(
      (i) => i.hasAttribute("srcset") || i.closest("picture")
    ).length;
    const pct = Math.round((responsive / imgs.length) * 100);
    checks.push({
      category: "Performance Details",
      label: "Responsive images (srcset / <picture>)",
      status: pct >= 50 ? "pass" : pct >= 20 ? "warn" : "fail",
      detail: `${responsive} of ${imgs.length} images (${pct}%) use srcset or <picture> for art-direction.`,
      fix:
        pct >= 50
          ? undefined
          : "Serve appropriately-sized images per device with `srcset` and `sizes`, or use `<picture>` with `<source media=…>` — saves mobile bandwidth.",
      source: "Crawl",
    });
  }

  // ── 37. Title contains a brand-like word ──────────────────────────
  const title = (doc.querySelector("title")?.textContent || "").trim();
  if (title && parsedUrl) {
    const root = parsedUrl.hostname.replace(/^www\./, "").split(".")[0];
    if (root && root.length >= 3) {
      const titleHasBrand = title.toLowerCase().includes(root.toLowerCase());
      checks.push({
        category: "On-Page SEO",
        label: "Title contains brand",
        status: titleHasBrand ? "pass" : "info",
        detail: titleHasBrand
          ? `Title contains your brand ("${root}") — strengthens brand recall in SERP.`
          : `Title doesn't reference "${root}" — common pattern is "Primary keyword | Brand".`,
        fix: titleHasBrand
          ? undefined
          : "Consider ending the title with ` | Brand` (most sites do). Helps brand-association in search results.",
        source: "Crawl",
      });
    }
  }

  // ── 38. Description starts with a verb (CTR heuristic) ────────────
  const descMeta = attr('meta[name="description"]', "content");
  if (descMeta.length >= 30) {
    const firstWord = descMeta.split(/\s+/)[0].toLowerCase().replace(/[^a-z]/g, "");
    const actionVerbs = new Set([
      "calculate",
      "find",
      "get",
      "compare",
      "discover",
      "learn",
      "see",
      "check",
      "convert",
      "estimate",
      "download",
      "generate",
      "build",
      "make",
      "create",
      "explore",
      "track",
      "measure",
      "test",
      "review",
      "understand",
    ]);
    if (actionVerbs.has(firstWord)) {
      checks.push({
        category: "On-Page SEO",
        label: "Description opens with an action verb",
        status: "pass",
        detail: `Description starts with "${firstWord}" — strong CTR pattern.`,
        source: "Crawl",
      });
    }
  }

  // ── 39. URL canonical-vs-final mismatch flagged in v3 already ──────
  //  (handled in analyzeAdvanced — kept here as a no-op comment for the
  //   audit list to read coherently)

  // ── 40. Page depth (URL slashes) ───────────────────────────────────
  if (parsedUrl) {
    const depth = parsedUrl.pathname.split("/").filter(Boolean).length;
    checks.push({
      category: "Technical SEO",
      label: "Page depth from root",
      status: depth <= 3 ? "pass" : depth <= 5 ? "warn" : "fail",
      detail: `Page is ${depth} click(s) from the root.`,
      fix:
        depth <= 3
          ? undefined
          : "Pages buried deep in the URL hierarchy get less link equity. Where possible, flatten the structure.",
      source: "Crawl",
    });
  }

  // ── 41. Outbound links to .gov / .edu / .org (authority) ──────────
  let govEdu = 0;
  let orgLinks = 0;
  Array.from(doc.querySelectorAll("a[href]")).forEach((a) => {
    const href = a.getAttribute("href") || "";
    try {
      const u = new URL(href, pageUrl);
      const tld = u.hostname.split(".").pop()?.toLowerCase();
      if (u.hostname !== pageHost) {
        if (tld === "gov" || tld === "edu" || u.hostname.endsWith(".gov.in") || u.hostname.endsWith(".ac.in"))
          govEdu++;
        else if (tld === "org") orgLinks++;
      }
    } catch {
      /* ignore */
    }
  });
  if (govEdu + orgLinks > 0) {
    checks.push({
      category: "Content",
      label: "Outbound authority links",
      status: govEdu >= 2 ? "pass" : "info",
      detail: `${govEdu} link(s) to .gov / .edu / .gov.in / .ac.in domains; ${orgLinks} to .org. Linking out to authoritative sources is a real trust signal.`,
      source: "Crawl",
    });
  }

  // ── 42 & 43. Readability — sentence & paragraph metrics ───────────
  const bodyText = (doc.body?.textContent || "").replace(/\s+/g, " ").trim();
  if (bodyText.length >= 500) {
    const sentences = bodyText
      .split(/[.!?]+(?=\s|$)/)
      .map((s) => s.trim())
      .filter((s) => s.length >= 4);
    const totalWords = bodyText.split(/\s+/).filter(Boolean).length;
    const avgSentenceWords =
      sentences.length > 0
        ? Math.round(totalWords / sentences.length)
        : 0;
    const paras = doc.querySelectorAll("p").length;
    const readabilityStatus =
      avgSentenceWords <= 20 ? "pass" : avgSentenceWords <= 28 ? "warn" : "fail";
    checks.push({
      category: "Content",
      label: "Sentence readability",
      status: readabilityStatus,
      detail: `Average sentence: ${avgSentenceWords} words (across ${sentences.length} sentences). Plain-English target: ≤ 20 words.`,
      fix:
        readabilityStatus === "pass"
          ? undefined
          : "Long sentences hurt comprehension. Aim for 15-20 words on average — break compound sentences into two.",
      source: "Crawl",
    });
    checks.push({
      category: "Content",
      label: "Paragraph structure",
      status: paras >= 5 ? "pass" : paras >= 2 ? "warn" : "fail",
      detail: `${paras} <p> paragraph(s) detected.`,
      fix:
        paras >= 5
          ? undefined
          : "Use real <p> tags for paragraphs (not <br>). Scannable content with proper paragraphs ranks better.",
      source: "Crawl",
    });
  }

  // ── 46. Trailing-slash consistency ────────────────────────────────
  if (parsedUrl && parsedUrl.pathname !== "/" && parsedUrl.pathname.length > 1) {
    const hasSlash = parsedUrl.pathname.endsWith("/");
    checks.push({
      category: "Technical SEO",
      label: "Trailing-slash style",
      status: "info",
      detail: hasSlash
        ? "URL ends with trailing slash."
        : "URL has no trailing slash.",
      fix: "Pick one style site-wide (with-slash or without-slash) and 301 the other to it. Consistency prevents duplicate-content dilution.",
      source: "Crawl",
    });
  }

  // ── 47. Site-wide identity schema (Organization / WebSite) ────────
  const ldText = Array.from(
    doc.querySelectorAll('script[type="application/ld+json"]')
  )
    .map((s) => s.textContent || "")
    .join("\n");
  const hasOrg = /"@type"\s*:\s*"Organization"/.test(ldText);
  const hasWebSite = /"@type"\s*:\s*"WebSite"/.test(ldText);
  if (ldText) {
    const identityScore = (hasOrg ? 1 : 0) + (hasWebSite ? 1 : 0);
    checks.push({
      category: "Schema Markup",
      label: "Site identity schema (Organization + WebSite)",
      status: identityScore === 2 ? "pass" : identityScore === 1 ? "warn" : "info",
      detail:
        identityScore === 2
          ? "Both Organization and WebSite schema present — strong identity signal."
          : identityScore === 1
            ? `Only ${hasOrg ? "Organization" : "WebSite"} present — add the missing one.`
            : "Neither Organization nor WebSite schema found.",
      fix:
        identityScore === 2
          ? undefined
          : "Add Organization (name, logo, sameAs) and WebSite (with SearchAction) JSON-LD to your <head> — both unlock knowledge-panel features.",
      source: "Crawl",
    });
  }

  return checks;
}

// ─── PageSpeed parsing ───────────────────────────────────────────────────
function parsePsi(data: PsiResponse): {
  scores: SeoReport["scores"];
  cwv: CwvMetric[];
  fieldDataAvailable: boolean;
  fieldCwv: FieldCwv | null;
  pageWeight: PageWeight | null;
  ttfbMs: number | null;
  checks: Check[];
} {
  const lh = data.lighthouseResult;
  const cats = lh?.categories;
  const audits = lh?.audits || {};

  // Declare checks bucket upfront — every later block (TTFB, failing-audit
  // fold) pushes into the same array.
  const checks: Check[] = [];

  const scores: SeoReport["scores"] = {
    performance: pct(cats?.performance?.score),
    seo: pct(cats?.seo?.score),
    accessibility: pct(cats?.accessibility?.score),
    bestPractices: pct(cats?.["best-practices"]?.score),
  };

  // Lab Core Web Vitals (always present from a Lighthouse run).
  const labMetric = (
    key: string,
    auditId: string,
    label: string
  ): CwvMetric => {
    const a = audits[auditId];
    if (!a || a.numericValue === undefined) {
      return { key, label, value: "—", rating: "n/a" };
    }
    return {
      key,
      label,
      value: a.displayValue || String(a.numericValue),
      rating: rateCwv(key, a.numericValue),
    };
  };
  const cwv: CwvMetric[] = [
    labMetric("lcp", "largest-contentful-paint", "Largest Contentful Paint"),
    labMetric("cls", "cumulative-layout-shift", "Cumulative Layout Shift"),
    labMetric("tbt", "total-blocking-time", "Total Blocking Time"),
    labMetric("fcp", "first-contentful-paint", "First Contentful Paint"),
    labMetric("si", "speed-index", "Speed Index"),
  ];

  // Field data (real Chrome users from CrUX) — only present for sites with
  // enough traffic. Far more credible than lab data since it's measured on
  // actual visitors, not a synthetic test environment.
  const lx = data.loadingExperience?.metrics;
  const fieldDataAvailable = !!lx;
  let fieldCwv: FieldCwv | null = null;
  if (lx) {
    const cruxMetric = (
      raw: { percentile?: number; category?: string } | undefined,
      formatter: (n: number) => string
    ) => {
      if (!raw || raw.percentile === undefined) return undefined;
      const cat = (raw.category || "").toUpperCase();
      const rating: "good" | "average" | "poor" =
        cat === "FAST" ? "good" : cat === "AVERAGE" ? "average" : "poor";
      return { value: formatter(raw.percentile), rating };
    };
    fieldCwv = {
      lcp: cruxMetric(lx.LARGEST_CONTENTFUL_PAINT_MS, (n) => `${(n / 1000).toFixed(2)} s`),
      cls: cruxMetric(lx.CUMULATIVE_LAYOUT_SHIFT_SCORE, (n) => (n / 100).toFixed(2)),
      inp: cruxMetric(lx.INTERACTION_TO_NEXT_PAINT, (n) => `${n} ms`),
      fcp: cruxMetric(lx.FIRST_CONTENTFUL_PAINT_MS, (n) => `${(n / 1000).toFixed(2)} s`),
      overallCategory: data.loadingExperience?.overall_category as
        | "FAST"
        | "AVERAGE"
        | "SLOW"
        | undefined,
    };
  }

  // Page weight breakdown (from Lighthouse's resource-summary audit).
  let pageWeight: PageWeight | null = null;
  const rs = audits["resource-summary"];
  const rsItems = (rs?.details as { items?: Array<{ resourceType?: string; label?: string; transferSize?: number; requestCount?: number }> } | undefined)?.items;
  if (rsItems && Array.isArray(rsItems)) {
    const totalEntry = rsItems.find(
      (i) => i.resourceType === "total" || i.label === "Total"
    );
    const byType = rsItems
      .filter(
        (i) =>
          i.resourceType !== "total" &&
          i.label !== "Total" &&
          (i.transferSize || 0) > 0
      )
      .map((i) => ({
        label: i.label || i.resourceType || "Other",
        sizeKB: Math.round((i.transferSize || 0) / 1024),
        requests: i.requestCount || 0,
      }))
      .sort((a, b) => b.sizeKB - a.sizeKB);
    if (totalEntry) {
      pageWeight = {
        totalKB: Math.round((totalEntry.transferSize || 0) / 1024),
        requestCount: totalEntry.requestCount || 0,
        byType,
      };
    }
  }

  // Time to First Byte
  const srt = audits["server-response-time"];
  const ttfbMs =
    srt?.numericValue !== undefined ? Math.round(srt.numericValue) : null;
  if (ttfbMs !== null) {
    checks.push({
      category: "Performance Details",
      label: "Time to First Byte (TTFB)",
      status: ttfbMs <= 600 ? "pass" : ttfbMs <= 1500 ? "warn" : "fail",
      detail: `Server responded in ${ttfbMs} ms.`,
      fix:
        ttfbMs <= 600
          ? undefined
          : "TTFB > 600 ms — slow server response. Use a faster host, enable caching, or move static assets to a CDN.",
    });
  }

  // Fold failing audits from SEO, Accessibility, Best-Practices into checks.
  const folded = new Set<string>();
  const catLabel: Record<string, string> = {
    seo: "Technical SEO",
    accessibility: "Accessibility",
    "best-practices": "Best Practices",
  };
  (["seo", "accessibility", "best-practices"] as const).forEach((catKey) => {
    const refs = cats?.[catKey]?.auditRefs || [];
    refs.forEach((ref) => {
      const a = audits[ref.id];
      if (!a || a.score === null || a.score === undefined) return;
      if (a.score >= 1) return; // passed — skip
      if (folded.has(ref.id)) return;
      folded.add(ref.id);
      checks.push({
        category: catLabel[catKey],
        label: a.title || ref.id,
        status: a.score === 0 ? "fail" : "warn",
        detail:
          (a.displayValue ? a.displayValue + " — " : "") +
          (a.description || "").replace(/\[.*?\]\(.*?\)/g, "").slice(0, 220),
        fix: "Flagged by the audit engine — the detail above describes the issue; the standard fix is widely documented online.",
      });
    });
  });

  return {
    scores,
    cwv,
    fieldDataAvailable,
    fieldCwv,
    pageWeight,
    ttfbMs,
    checks: tagSource(checks, "Lighthouse"),
  };
}

// ─── Component ───────────────────────────────────────────────────────────
export default function SeoChecker() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");
  const [report, setReport] = useState<SeoReport | null>(null);
  const [pdfBusy, setPdfBusy] = useState(false);

  const analyze = useCallback(async () => {
    const target = normalizeUrl(url);
    if (!target) {
      setError("Please enter a valid website URL, e.g. example.com");
      return;
    }
    // Console hint so the repo owner can verify which PSI mode the tool is
    // actually running in (keyed vs anonymous). Open DevTools console while
    // running an audit — should read "keyed" once NEXT_PUBLIC_PAGESPEED_API_KEY
    // is configured in Vercel.
    console.info(
      `[SEO Checker] PageSpeed API: ${PSI_KEY ? "keyed (25k/day quota)" : "keyless (per-visitor anonymous quota)"}`
    );
    setLoading(true);
    setError("");
    setReport(null);

    // 1. PageSpeed Insights run (Lighthouse via Google's API — branded as
    //    "SabTools audit engine" in the user-facing copy). v4: parallel
    //    desktop run so we can show a mobile-vs-desktop comparison card.
    setProgress(
      "Running deep SEO audit — 130+ checks across mobile + desktop… this takes 15-30 seconds."
    );
    const psiBase =
      `${PSI_ENDPOINT}?url=${encodeURIComponent(target)}` +
      `&category=PERFORMANCE&category=SEO&category=ACCESSIBILITY&category=BEST_PRACTICES` +
      (PSI_KEY ? `&key=${PSI_KEY}` : "");
    const psiUrl = `${psiBase}&strategy=mobile`;
    const psiUrlDesktop = `${psiBase}&strategy=desktop`;

    // 2. On-page HTML + robots.txt + sitemap.xml + HTTP-status envelope via
    //    CORS proxy (best-effort).
    const proxyUrl = CORS_PROXY + encodeURIComponent(target);
    let originBase = target;
    try {
      originBase = new URL(target).origin;
    } catch {
      /* normalizeUrl already validated this; fall through */
    }
    const robotsProxyUrl =
      CORS_PROXY + encodeURIComponent(originBase + "/robots.txt");
    const sitemapProxyUrl =
      CORS_PROXY + encodeURIComponent(originBase + "/sitemap.xml");
    // /get? returns { contents, status: { http_code, ... } } — we use it
    // strictly to capture the real HTTP status code without re-fetching
    // the full body twice.
    const statusUrl = CORS_GET + encodeURIComponent(target);

    const [
      psiSettled,
      psiDesktopSettled,
      htmlSettled,
      robotsSettled,
      sitemapSettled,
      statusSettled,
    ] = await Promise.allSettled([
      fetch(psiUrl).then(async (r) => {
        const json: PsiResponse = await r.json();
        if (!r.ok || json.error) {
          throw new Error(
            json.error?.message ||
              (r.status === 429
                ? "Free audit quota is busy. Wait a minute and try again."
                : "We couldn't analyse this URL — make sure it's public, reachable, and spelled correctly.")
          );
        }
        return json;
      }),
      // Desktop PSI — non-throwing. If it fails (rate-limit etc.) the card
      // simply hides; mobile remains the primary result.
      fetch(psiUrlDesktop).then(async (r) => {
        const json: PsiResponse = await r.json();
        if (!r.ok || json.error) throw new Error("desktop-psi");
        return json;
      }),
      fetch(proxyUrl).then((r) => {
        if (!r.ok) throw new Error("proxy");
        return r.text();
      }),
      fetch(robotsProxyUrl).then((r) => {
        if (!r.ok) throw new Error("robots-proxy");
        return r.text();
      }),
      fetch(sitemapProxyUrl).then((r) => {
        if (!r.ok) throw new Error("sitemap-proxy");
        return r.text();
      }),
      fetch(statusUrl).then(async (r) => {
        if (!r.ok) throw new Error("status-proxy");
        const j = (await r.json()) as {
          status?: { http_code?: number; url?: string };
        };
        return j;
      }),
    ]);

    if (psiSettled.status === "rejected" && htmlSettled.status === "rejected") {
      setError(
        psiSettled.reason?.message ||
          "Unable to analyse this website. Check the URL is public, correct, and reachable."
      );
      setLoading(false);
      setProgress("");
      return;
    }

    setProgress("Building your report…");

    const checks: Check[] = [];
    let scores: SeoReport["scores"] = {
      performance: null,
      seo: null,
      accessibility: null,
      bestPractices: null,
    };
    let cwv: CwvMetric[] = [];
    let fieldDataAvailable = false;
    let fieldCwv: FieldCwv | null = null;
    let pageWeight: PageWeight | null = null;
    let ttfbMs: number | null = null;
    let finalUrl = target;

    if (psiSettled.status === "fulfilled") {
      const parsed = parsePsi(psiSettled.value);
      scores = parsed.scores;
      cwv = parsed.cwv;
      fieldDataAvailable = parsed.fieldDataAvailable;
      fieldCwv = parsed.fieldCwv;
      pageWeight = parsed.pageWeight;
      ttfbMs = parsed.ttfbMs;
      checks.push(...parsed.checks);
      finalUrl = psiSettled.value.lighthouseResult?.finalUrl || target;
    }

    // v4: desktop PSI scores (parallel run). Only the four headline scores
    // are kept — the per-audit list would duplicate mobile findings.
    let desktopScores: SeoReport["desktopScores"] = null;
    if (psiDesktopSettled.status === "fulfilled") {
      const lh = psiDesktopSettled.value.lighthouseResult;
      const cats = lh?.categories;
      desktopScores = {
        performance: pct(cats?.performance?.score),
        seo: pct(cats?.seo?.score),
        accessibility: pct(cats?.accessibility?.score),
        bestPractices: pct(cats?.["best-practices"]?.score),
      };
    }

    // v4: real HTTP status code via /get? envelope. Surface as a real check
    // so the user sees what the server actually returned. Non-200 is a
    // first-order indexability red flag.
    let httpStatus: number | null = null;
    if (statusSettled.status === "fulfilled") {
      const code = statusSettled.value.status?.http_code;
      if (typeof code === "number" && code > 0) {
        httpStatus = code;
        const okay = code >= 200 && code < 300;
        const redir = code >= 300 && code < 400;
        const clientErr = code >= 400 && code < 500;
        checks.push({
          category: "Crawler Access",
          label: "HTTP response code",
          status: okay ? "pass" : redir ? "warn" : "fail",
          detail: `Server returned HTTP ${code}${
            okay
              ? " — page is reachable."
              : redir
                ? " — page redirects (Google follows up to ~5 hops, but each hop loses link equity)."
                : clientErr
                  ? " — client error (4xx); the URL may be wrong or the page may be gone."
                  : " — server error (5xx); the host is failing to serve this URL."
          }`,
          fix: okay
            ? undefined
            : redir
              ? "Update inbound links to point to the final URL so Google indexes the canonical destination."
              : clientErr
                ? "Restore the page or 301-redirect to the new URL. 4xx pages drop out of the index."
                : "Server-side issue. Check your host's error logs and uptime monitor.",
          source: "HTTP",
        });
      }
    }

    // HTTPS check (from the normalised/final URL).
    checks.push(
      finalUrl.startsWith("https://")
        ? {
            category: "Technical SEO",
            label: "HTTPS / SSL",
            status: "pass",
            detail: "The site is served securely over HTTPS.",
            source: "HTTP",
          }
        : {
            category: "Technical SEO",
            label: "HTTPS / SSL",
            status: "fail",
            detail: "The site is not served over HTTPS.",
            fix: "Install an SSL certificate and redirect all HTTP traffic to HTTPS. Google treats HTTPS as a ranking signal.",
            source: "HTTP",
          }
    );

    let onPageAvailable = false;
    let schemaTypes: string[] = [];
    let ampUrl: string | null = null;
    let manifestUrl: string | null = null;
    let mixedContentCount = 0;
    if (htmlSettled.status === "fulfilled") {
      try {
        const onPage = analyzeOnPage(htmlSettled.value, finalUrl);
        if (onPage.checks.length > 0) {
          checks.push(...onPage.checks);
          onPageAvailable = true;
          schemaTypes = onPage.schemaTypes;
          ampUrl = onPage.ampUrl;
          manifestUrl = onPage.manifestUrl;
          mixedContentCount = onPage.mixedContentCount;
        }
      } catch {
        /* parsing failed — fall back to audit-only report */
      }
    }

    // robots.txt
    let robotsTxtFound = false;
    if (robotsSettled.status === "fulfilled") {
      checks.push(...analyzeRobotsTxt(robotsSettled.value));
      robotsTxtFound = !!robotsSettled.value.trim();
    } else {
      checks.push({
        category: "Crawler Access",
        label: "robots.txt",
        status: "warn",
        detail:
          "Couldn't fetch /robots.txt (network/proxy issue) — crawler access rules weren't verified.",
      });
    }

    // sitemap.xml
    let sitemapFound = false;
    if (sitemapSettled.status === "fulfilled") {
      checks.push(...analyzeSitemap(sitemapSettled.value));
      sitemapFound = /<urlset|<sitemapindex/i.test(sitemapSettled.value);
      // v3: is the audited page listed in the sitemap? Orphan-page signal —
      // if a page isn't in the sitemap, Google's only discovery route is the
      // internal-link graph. Sitemap-index files are skipped (entries point
      // to child sitemaps we don't fetch).
      if (
        sitemapFound &&
        /<urlset/i.test(sitemapSettled.value) &&
        !/<sitemapindex/i.test(sitemapSettled.value)
      ) {
        const sm = sitemapSettled.value;
        const finalNorm = finalUrl.replace(/\/$/, "").toLowerCase();
        const pageNorm = target.replace(/\/$/, "").toLowerCase();
        const locsRaw = sm.match(/<loc>[^<]+<\/loc>/gi) || [];
        const locs = locsRaw.map((l) =>
          l
            .replace(/<\/?loc>/gi, "")
            .trim()
            .replace(/\/$/, "")
            .toLowerCase()
        );
        const listed =
          locs.includes(finalNorm) || locs.includes(pageNorm);
        checks.push({
          category: "Crawler Access",
          label: "Page listed in sitemap",
          status: listed ? "pass" : "warn",
          detail: listed
            ? `The audited URL appears in sitemap.xml — Google can discover it directly.`
            : `The audited URL was not found among the ${locs.length} entries in the sitemap. Google has to rely on internal links to find this page.`,
          fix: listed
            ? undefined
            : "Add this URL to your sitemap.xml. Most CMSes do this automatically when a page is published — if yours doesn't, regenerate the sitemap.",
        });
      }
    } else {
      checks.push({
        category: "Crawler Access",
        label: "sitemap.xml",
        status: "warn",
        detail:
          "Couldn't fetch /sitemap.xml — the site may not have one, or the request was blocked.",
        fix: "Generate a sitemap (most CMSes do this automatically) and serve it at /sitemap.xml.",
      });
    }

    const validScores = [
      scores.performance,
      scores.seo,
      scores.accessibility,
      scores.bestPractices,
    ].filter((s): s is number => s !== null);
    const composite = validScores.length
      ? Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length)
      : 0;

    // Executive summary — top 3 failing items + a one-word verdict.
    const failingChecks = checks.filter((c) => c.status === "fail");
    const topPriorities = failingChecks.slice(0, 3).map((c) => c.label);
    const verdict =
      composite >= 85
        ? "Strong"
        : composite >= 70
          ? "Good"
          : composite >= 50
            ? "Needs Work"
            : "Critical Issues";

    setReport({
      url: target,
      finalUrl,
      scores,
      desktopScores,
      cwv,
      fieldDataAvailable,
      fieldCwv,
      pageWeight,
      ttfbMs,
      onPageAvailable,
      schemaTypes,
      ampUrl,
      manifestUrl,
      mixedContentCount,
      robotsTxtFound,
      sitemapFound,
      httpStatus,
      checks,
      composite,
      grade: gradeFor(composite),
      topPriorities,
      verdict,
      generatedAt: new Date().toISOString(),
    });
    setLoading(false);
    setProgress("");
  }, [url]);

  // ── Render ──────────────────────────────────────────────────────────
  const scoreCards: { label: string; value: number | null }[] = report
    ? [
        { label: "Performance", value: report.scores.performance },
        { label: "SEO", value: report.scores.seo },
        { label: "Accessibility", value: report.scores.accessibility },
        { label: "Best Practices", value: report.scores.bestPractices },
      ]
    : [];

  const counts = report
    ? {
        pass: report.checks.filter((c) => c.status === "pass").length,
        warn: report.checks.filter((c) => c.status === "warn").length,
        fail: report.checks.filter((c) => c.status === "fail").length,
      }
    : { pass: 0, warn: 0, fail: 0 };

  // Order categories by CATEGORY_ORDER (logical reading order), then append
  // any categories not on the list alphabetically. Sort failing items first
  // inside each category so the most actionable issues are at the top.
  const categories = report
    ? Array.from(new Set(report.checks.map((c) => c.category))).sort((a, b) => {
        const ai = CATEGORY_ORDER.indexOf(a);
        const bi = CATEGORY_ORDER.indexOf(b);
        if (ai === -1 && bi === -1) return a.localeCompare(b);
        if (ai === -1) return 1;
        if (bi === -1) return -1;
        return ai - bi;
      })
    : [];

  const STATUS_PRIORITY: Record<CheckStatus, number> = {
    fail: 0,
    warn: 1,
    info: 2,
    pass: 3,
  };

  return (
    <div className="space-y-6">
      {/* Input */}
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-1">
          Enter a Website URL
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            className="calc-input flex-1"
            type="text"
            inputMode="url"
            placeholder="e.g. example.com or https://example.com/page"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !loading && analyze()}
          />
          <button
            className="btn-primary px-8"
            onClick={analyze}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Analysing…
              </span>
            ) : (
              "Run SEO Audit"
            )}
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          Real analysis · 100+ checks across performance, on-page, schema,
          accessibility & i18n · No signup, 100% free.
        </p>
      </div>

      {/* Loading */}
      {loading && progress && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-indigo-700 text-sm">
          ⏳ {progress}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm">
          ❌ {error}
        </div>
      )}

      {/* Report */}
      {report && (
        <div className="space-y-6">
          {/* Executive summary — grade + verdict + top priorities */}
          <div className="result-card">
            <div className="flex flex-col sm:flex-row items-center gap-5">
              <div
                className={`flex-shrink-0 w-24 h-24 rounded-2xl flex flex-col items-center justify-center ${scoreClasses(report.composite)}`}
              >
                <span className="text-4xl font-extrabold leading-none">
                  {report.grade}
                </span>
                <span className="text-xs font-semibold mt-1">
                  {report.composite}/100
                </span>
              </div>
              <div className="text-center sm:text-left flex-1 min-w-0">
                <h3 className="text-lg font-bold text-gray-800">
                  SEO Report — {report.verdict}
                </h3>
                <p className="text-sm text-gray-500 break-all">
                  {report.finalUrl}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  <span className="text-green-600 font-semibold">
                    {counts.pass} passed
                  </span>{" "}
                  ·{" "}
                  <span className="text-amber-600 font-semibold">
                    {counts.warn} warnings
                  </span>{" "}
                  ·{" "}
                  <span className="text-red-600 font-semibold">
                    {counts.fail} failed
                  </span>
                </p>
              </div>
              <button
                onClick={async () => {
                  if (pdfBusy) return;
                  setPdfBusy(true);
                  try {
                    await downloadSeoReportPdf(report);
                  } catch (err) {
                    console.error("[SEO Checker] PDF generation failed", err);
                  } finally {
                    setPdfBusy(false);
                  }
                }}
                disabled={pdfBusy}
                className="sm:ml-auto text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed rounded-lg px-4 py-2 transition flex items-center gap-2"
              >
                {pdfBusy ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Building PDF…
                  </>
                ) : (
                  <>
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" />
                    </svg>
                    Download PDF report
                  </>
                )}
              </button>
            </div>
            {report.topPriorities.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs font-bold text-gray-700 mb-2">
                  🎯 Top priorities to fix
                </p>
                <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                  {report.topPriorities.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ol>
              </div>
            )}
          </div>

          {/* Score cards (mobile — primary scores) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {scoreCards.map((s) => (
              <div
                key={s.label}
                className="bg-gray-50 rounded-xl p-4 text-center"
              >
                <div
                  className={`mx-auto w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold ${scoreClasses(s.value)}`}
                >
                  {s.value === null ? "—" : s.value}
                </div>
                <div className="text-xs font-semibold text-gray-600 mt-2">
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* v4: Mobile vs Desktop comparison — only renders when the
              desktop PSI call succeeded. Shows the four headline scores
              side-by-side with the gap, so the user sees at a glance
              whether mobile performance is the bottleneck. */}
          {report.desktopScores && (
            <div className="result-card">
              <h3 className="font-bold text-gray-800 mb-1">
                📱 vs 💻 Mobile vs Desktop
              </h3>
              <p className="text-xs text-gray-400 mb-3">
                Two independent Lighthouse runs against the same URL — one
                emulating a mid-range phone on 4G, one a fast desktop on
                broadband. Google indexes mobile-first, so mobile scores
                matter most.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wide text-gray-500">
                      <th className="py-2 pr-3">Category</th>
                      <th className="py-2 px-3 text-center">📱 Mobile</th>
                      <th className="py-2 px-3 text-center">💻 Desktop</th>
                      <th className="py-2 pl-3 text-center">Gap</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(
                      [
                        ["Performance", "performance"],
                        ["SEO", "seo"],
                        ["Accessibility", "accessibility"],
                        ["Best Practices", "bestPractices"],
                      ] as const
                    ).map(([label, key]) => {
                      const m = report.scores[key];
                      const d = report.desktopScores?.[key];
                      const gap = m !== null && d !== undefined && d !== null ? d - m : null;
                      return (
                        <tr key={key} className="border-t border-gray-100">
                          <td className="py-2 pr-3 font-semibold text-gray-700">
                            {label}
                          </td>
                          <td className="py-2 px-3 text-center">
                            <span
                              className={`inline-block min-w-[42px] rounded-md px-2 py-0.5 text-sm font-bold ${scoreClasses(m)}`}
                            >
                              {m === null ? "—" : m}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-center">
                            <span
                              className={`inline-block min-w-[42px] rounded-md px-2 py-0.5 text-sm font-bold ${scoreClasses(d ?? null)}`}
                            >
                              {d === null || d === undefined ? "—" : d}
                            </span>
                          </td>
                          <td className="py-2 pl-3 text-center tabular-nums">
                            {gap === null ? (
                              <span className="text-gray-400">—</span>
                            ) : gap > 5 ? (
                              <span className="text-red-600 font-semibold">
                                +{gap}
                              </span>
                            ) : gap < -5 ? (
                              <span className="text-green-600 font-semibold">
                                {gap}
                              </span>
                            ) : (
                              <span className="text-gray-500">
                                {gap > 0 ? "+" : ""}
                                {gap}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p className="text-[11px] text-gray-400 mt-3">
                A large positive gap means desktop is much faster than
                mobile — usually heavy JS or large images. Mobile should be
                within 10-15 points of desktop on a healthy site.
              </p>
            </div>
          )}

          {/* Core Web Vitals */}
          {report.cwv.length > 0 && (
            <div className="result-card">
              <h3 className="font-bold text-gray-800 mb-1">
                ⚡ Core Web Vitals
              </h3>
              <p className="text-xs text-gray-400 mb-3">
                Lab-measured Core Web Vitals
                {report.fieldDataAvailable
                  ? " · plus real-user (CrUX) field data shown below."
                  : "."}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {report.cwv.map((m) => (
                  <div
                    key={m.key}
                    className="bg-gray-50 rounded-xl p-3 text-center"
                  >
                    <div
                      className={`text-lg font-bold ${CWV_RATING_CLASS[m.rating]}`}
                    >
                      {m.value}
                    </div>
                    <div className="text-[11px] text-gray-500 mt-1 leading-tight">
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CrUX field data (real Chrome users) — only if site has traffic */}
          {report.fieldCwv &&
            (report.fieldCwv.lcp ||
              report.fieldCwv.cls ||
              report.fieldCwv.inp) && (
              <div className="result-card">
                <h3 className="font-bold text-gray-800 mb-1">
                  👥 Real-User Field Data
                  {report.fieldCwv.overallCategory && (
                    <span
                      className={`ml-2 text-xs font-semibold px-2 py-0.5 rounded-full ${
                        report.fieldCwv.overallCategory === "FAST"
                          ? "bg-green-100 text-green-700"
                          : report.fieldCwv.overallCategory === "AVERAGE"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {report.fieldCwv.overallCategory}
                    </span>
                  )}
                </h3>
                <p className="text-xs text-gray-400 mb-3">
                  Measured on actual Chrome visitors over the last 28 days
                  (CrUX dataset) — far more credible than lab tests.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {(["lcp", "inp", "cls", "fcp"] as const).map((k) => {
                    const m = report.fieldCwv?.[k];
                    if (!m) return null;
                    const label =
                      k === "lcp"
                        ? "LCP (real users)"
                        : k === "inp"
                          ? "INP (real users)"
                          : k === "cls"
                            ? "CLS (real users)"
                            : "FCP (real users)";
                    return (
                      <div
                        key={k}
                        className="bg-gray-50 rounded-xl p-3 text-center"
                      >
                        <div
                          className={`text-lg font-bold ${CWV_RATING_CLASS[m.rating]}`}
                        >
                          {m.value}
                        </div>
                        <div className="text-[11px] text-gray-500 mt-1 leading-tight">
                          {label}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          {/* Page weight breakdown */}
          {report.pageWeight && (
            <div className="result-card">
              <h3 className="font-bold text-gray-800 mb-1">
                📦 Page Weight & Requests
              </h3>
              <p className="text-xs text-gray-400 mb-3">
                Total bytes transferred to render the page, and how that
                weight is split across resource types.
              </p>
              <div className="flex flex-wrap gap-3 mb-3">
                <div className="flex-1 min-w-[140px] bg-gray-50 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-gray-800">
                    {report.pageWeight.totalKB.toLocaleString()} KB
                  </div>
                  <div className="text-[11px] text-gray-500 mt-1">
                    Total weight
                  </div>
                </div>
                <div className="flex-1 min-w-[140px] bg-gray-50 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-gray-800">
                    {report.pageWeight.requestCount}
                  </div>
                  <div className="text-[11px] text-gray-500 mt-1">
                    HTTP requests
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                {report.pageWeight.byType.slice(0, 7).map((t) => {
                  const pct =
                    report.pageWeight && report.pageWeight.totalKB > 0
                      ? Math.round((t.sizeKB / report.pageWeight.totalKB) * 100)
                      : 0;
                  return (
                    <div key={t.label} className="flex items-center gap-3">
                      <div className="text-xs font-semibold text-gray-700 w-28 flex-shrink-0">
                        {t.label}
                      </div>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-400"
                          style={{ width: `${Math.min(pct, 100)}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-500 w-24 text-right tabular-nums">
                        {t.sizeKB.toLocaleString()} KB · {t.requests} req
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Schema types detected */}
          {report.schemaTypes.length > 0 && (
            <div className="result-card">
              <h3 className="font-bold text-gray-800 mb-1">
                🏷️ Structured Data Detected
              </h3>
              <p className="text-xs text-gray-400 mb-3">
                Schema.org types in the page&apos;s JSON-LD — these enable
                rich results in Google search.
              </p>
              <div className="flex flex-wrap gap-2">
                {report.schemaTypes.map((t) => (
                  <span
                    key={t}
                    className="text-xs font-semibold bg-purple-100 text-purple-700 rounded-full px-3 py-1"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Categorised checks — sorted fail → warn → info → pass so the most
              actionable items are at the top of every category. */}
          {categories.map((cat) => {
            const items = report.checks
              .filter((c) => c.category === cat)
              .slice()
              .sort(
                (a, b) =>
                  STATUS_PRIORITY[a.status] - STATUS_PRIORITY[b.status]
              );
            const catFails = items.filter((c) => c.status === "fail").length;
            const catWarns = items.filter((c) => c.status === "warn").length;
            const catPass = items.filter((c) => c.status === "pass").length;
            const pillClass =
              catFails > 0
                ? "bg-red-100 text-red-700"
                : catWarns > 0
                  ? "bg-amber-100 text-amber-700"
                  : "bg-green-100 text-green-700";
            const pillText =
              catFails > 0
                ? `${catFails} failed`
                : catWarns > 0
                  ? `${catWarns} warning${catWarns === 1 ? "" : "s"}`
                  : "All clear";
            return (
              <div key={cat} className="result-card">
                <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
                  <h3 className="font-bold text-gray-800">{cat}</h3>
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className={`font-semibold rounded-full px-2.5 py-0.5 ${pillClass}`}
                    >
                      {pillText}
                    </span>
                    <span className="text-gray-400 tabular-nums">
                      {catPass}/{items.length} passing
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  {items.map((c, i) => {
                    const meta = STATUS_META[c.status];
                    return (
                      <div
                        key={i}
                        className={`border ${meta.row} rounded-xl p-3`}
                      >
                        <div className="flex items-start gap-3">
                          <span
                            className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${meta.chip}`}
                          >
                            {meta.icon}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2 flex-wrap">
                              <div className="font-semibold text-sm text-gray-800">
                                {c.label}
                              </div>
                              {c.source && (
                                <span
                                  className="text-[9px] uppercase tracking-wider font-bold bg-gray-100 text-gray-500 rounded px-1.5 py-0.5 flex-shrink-0"
                                  title="Data source for this check — every result traces back to a real signal."
                                >
                                  {c.source}
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-gray-600 mt-0.5 break-words">
                              {c.detail}
                            </div>
                            {c.fix && (
                              <div className="text-xs text-purple-600 mt-1">
                                <span className="font-semibold">Fix:</span>{" "}
                                {c.fix}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Honest scope panel — every claim above is real, here's what
              we couldn't verify and where to go for it. */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-5 text-sm text-gray-600 space-y-3">
            <div>
              <p className="font-bold text-gray-800 mb-1">
                ✅ What&apos;s real in this report
              </p>
              <p>
                Every score, vital and check above is{" "}
                <strong>real data</strong> — measured by Lighthouse against
                your live URL, parsed from the page&apos;s HTML, your
                robots.txt, sitemap.xml, and a real HTTP request. No
                fabricated numbers. The data source for each check is shown
                as a small badge — <strong>Lighthouse</strong>,{" "}
                <strong>Crawl</strong>, <strong>HTTP</strong>,{" "}
                <strong>Robots</strong> or <strong>Sitemap</strong>.
              </p>
            </div>
            <div>
              <p className="font-bold text-gray-800 mb-1">
                ⚠️ What we can&apos;t test from the browser
              </p>
              <p className="mb-2">
                A few SEO signals need server-side inspection that a
                browser-based tool can&apos;t do honestly. We&apos;d rather
                send you to the free tool that can than fake a number:
              </p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>
                  <strong>HTTP security headers</strong> (HSTS, CSP,
                  X-Frame-Options) →{" "}
                  <a
                    href="https://securityheaders.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 underline"
                  >
                    securityheaders.com
                  </a>{" "}
                  ·{" "}
                  <a
                    href="https://observatory.mozilla.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 underline"
                  >
                    Mozilla Observatory
                  </a>
                </li>
                <li>
                  <strong>TLS / SSL certificate quality</strong> →{" "}
                  <a
                    href="https://www.ssllabs.com/ssltest/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 underline"
                  >
                    SSL Labs
                  </a>
                </li>
                <li>
                  <strong>Indexation status in Google</strong> →{" "}
                  <a
                    href="https://search.google.com/search-console"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 underline"
                  >
                    Search Console (Coverage report)
                  </a>
                </li>
                <li>
                  <strong>Structured data validity</strong> (in addition to
                  our parse + completeness checks) →{" "}
                  <a
                    href="https://search.google.com/test/rich-results"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 underline"
                  >
                    Rich Results Test
                  </a>{" "}
                  ·{" "}
                  <a
                    href="https://validator.schema.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 underline"
                  >
                    Schema validator
                  </a>
                </li>
                <li>
                  <strong>Backlinks, Domain Authority, keyword
                  rankings</strong> → require a paid data provider (Ahrefs,
                  Moz, Semrush). Any &quot;free&quot; tool that quotes
                  those numbers is guessing — we won&apos;t.
                </li>
              </ul>
            </div>
          </div>
          {!report.onPageAvailable && (
            <p className="text-xs text-gray-400">
              Note: the live on-page crawl was unavailable (the connection may
              be busy), so this report is based on the technical audit only.
              Try again in a minute for the full on-page breakdown.
            </p>
          )}
          <p className="text-[10px] text-gray-300 text-center">
            Audit engine: industry-standard Lighthouse signals + SabTools live
            on-page crawl.
          </p>
        </div>
      )}

      {/* Info — shown before first run */}
      {!report && !loading && (
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6">
          <h3 className="font-bold text-gray-800 mb-3">
            🔍 What the SEO audit checks — 100+ signals
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
            <div>• Performance, SEO, Accessibility &amp; Best-Practices scores</div>
            <div>• Core Web Vitals — LCP, CLS, INP, TBT, FCP, Speed Index</div>
            <div>• Real-user (CrUX) field data when available</div>
            <div>• Title tag &amp; meta description (presence + length)</div>
            <div>• H1 &amp; full heading hierarchy (no skipped levels)</div>
            <div>• Image alt text, modern formats, lazy-load &amp; dimensions</div>
            <div>• Canonical href alignment &amp; protocol match</div>
            <div>• Hreflang validation (x-default, self-reference, codes)</div>
            <div>• HTTPS, mixed content, mobile viewport &amp; charset</div>
            <div>• Schema.org JSON-LD — parse + Article/Product/FAQ lint</div>
            <div>• Render-blocking resources &amp; third-party fan-out</div>
            <div>• Web-font strategy — preload, woff2, font-display: swap</div>
            <div>• Open Graph &amp; Twitter/X social cards</div>
            <div>• Anchor text descriptiveness &amp; broken in-page links</div>
            <div>• Form input labels &amp; accessibility basics (WCAG)</div>
            <div>• robots.txt, sitemap.xml &amp; page-in-sitemap coverage</div>
          </div>
        </div>
      )}
    </div>
  );
}
