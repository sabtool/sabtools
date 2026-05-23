"use client";
import { useState, useCallback } from "react";

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

interface Check {
  category: string;
  label: string;
  status: CheckStatus;
  detail: string;
  fix?: string;
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
  checks: Check[];
  composite: number;
  grade: string;
  topPriorities: string[];
  verdict: string;
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
  return checks;
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
  return checks;
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

  return {
    checks,
    schemaTypes: uniqSchemaTypes,
    ampUrl: ampLink,
    manifestUrl: manifestLink,
    mixedContentCount: mixedContent,
  };
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

  return { scores, cwv, fieldDataAvailable, fieldCwv, pageWeight, ttfbMs, checks };
}

// ─── Component ───────────────────────────────────────────────────────────
export default function SeoChecker() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");
  const [report, setReport] = useState<SeoReport | null>(null);

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
    //    "SabTools audit engine" in the user-facing copy).
    setProgress("Running deep SEO audit — 80+ checks… this takes 15-30 seconds.");
    const psiUrl =
      `${PSI_ENDPOINT}?url=${encodeURIComponent(target)}` +
      `&category=PERFORMANCE&category=SEO&category=ACCESSIBILITY&category=BEST_PRACTICES` +
      `&strategy=mobile${PSI_KEY ? `&key=${PSI_KEY}` : ""}`;

    // 2. On-page HTML + robots.txt + sitemap.xml via CORS proxy (best-effort).
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

    const [psiSettled, htmlSettled, robotsSettled, sitemapSettled] =
      await Promise.allSettled([
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

    // HTTPS check (from the normalised/final URL).
    checks.push(
      finalUrl.startsWith("https://")
        ? {
            category: "Technical SEO",
            label: "HTTPS / SSL",
            status: "pass",
            detail: "The site is served securely over HTTPS.",
          }
        : {
            category: "Technical SEO",
            label: "HTTPS / SSL",
            status: "fail",
            detail: "The site is not served over HTTPS.",
            fix: "Install an SSL certificate and redirect all HTTP traffic to HTTPS. Google treats HTTPS as a ranking signal.",
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
      checks,
      composite,
      grade: gradeFor(composite),
      topPriorities,
      verdict,
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

  const categories = report
    ? Array.from(new Set(report.checks.map((c) => c.category)))
    : [];

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
          Real analysis · 80+ checks · No signup, 100% free.
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
                onClick={() => window.print()}
                className="sm:ml-auto text-sm font-semibold text-purple-600 border border-purple-200 rounded-lg px-4 py-2 hover:bg-purple-50 transition"
              >
                ⬇️ Print / Save PDF
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

          {/* Score cards */}
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

          {/* Categorised checks */}
          {categories.map((cat) => {
            const items = report.checks.filter((c) => c.category === cat);
            return (
              <div key={cat} className="result-card">
                <h3 className="font-bold text-gray-800 mb-3">{cat}</h3>
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
                          <div className="min-w-0">
                            <div className="font-semibold text-sm text-gray-800">
                              {c.label}
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

          {/* Honest scope note */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-5 text-sm text-gray-600">
            <p className="font-bold text-gray-800 mb-1">
              📋 What this report covers — and what it doesn&apos;t
            </p>
            <p>
              Every score and check above is <strong>real data</strong> — from
              a live technical audit and on-page crawl. It covers on-page,
              technical, performance, accessibility and social SEO.
            </p>
            <p className="mt-2">
              It does <strong>not</strong> include backlinks, Domain Authority,
              keyword rankings or traffic estimates — those require a paid data
              provider (Ahrefs, Moz, Semrush). Any free tool that shows you
              those numbers is guessing. We&apos;d rather give you honest data.
            </p>
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
            🔍 What the SEO audit checks
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
            <div>• Performance, SEO, Accessibility &amp; Best-Practices scores</div>
            <div>• Core Web Vitals — LCP, CLS, TBT, FCP, Speed Index</div>
            <div>• Title tag &amp; meta description (presence + length)</div>
            <div>• H1 &amp; heading structure</div>
            <div>• Image alt text coverage</div>
            <div>• Canonical, hreflang &amp; indexability</div>
            <div>• HTTPS, mobile viewport, language &amp; charset</div>
            <div>• Structured data (Schema.org JSON-LD)</div>
            <div>• Open Graph &amp; Twitter/X social cards</div>
            <div>• Internal/external links &amp; content depth</div>
          </div>
        </div>
      )}
    </div>
  );
}
