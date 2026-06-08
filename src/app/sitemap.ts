import { MetadataRoute } from "next";
import { tools, categories } from "@/lib/tools";
import { getAllPosts } from "@/lib/blog";
import { programmaticPages } from "@/lib/programmatic-pages";
import { authors } from "@/lib/authors";
import { hindiToolSlugs } from "@/lib/hindi";
import { categoryPillarsHi } from "@/lib/category-pillars-hi";
import { IPL_TEAMS, IPL_HISTORY, IPL_RECORDS } from "@/lib/ipl-data";

export const dynamic = "force-static";

/**
 * Main sitemap - English content + non-translated pages (blog, calc, authors, static)
 * This file produces /sitemap.xml
 * Hindi content lives in /sitemap-hi.xml (see src/app/sitemap-hi/route.ts)
 * Both are referenced from /sitemap-index.xml
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://sabtools.in";
  const now = new Date().toISOString();
  const stableDate = "2026-03-15T00:00:00.000Z";

  // Per-URL hreflang in the sitemap is one of the three places Google
  // will accept the alternate-language signal (HTML head, HTTP header,
  // sitemap). For a static export with thousands of URLs the sitemap
  // form is the most reliable — it survives crawl caching better than
  // re-parsing each HTML head on every recrawl. Mirror of the head-level
  // hreflangs declared in Batch 27 (gated identically: only for surfaces
  // that actually have a Hindi counterpart).

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
      alternates: {
        languages: {
          "en-IN": baseUrl,
          "hi-IN": `${baseUrl}/hi`,
          "x-default": baseUrl,
        },
      },
    },
    {
      url: `${baseUrl}/about`,
      lastModified: stableDate,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: stableDate,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: stableDate,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/disclaimer`,
      lastModified: stableDate,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: stableDate,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      // /calc hub — indexes all 200+ programmatic bank/loan/scheme calculators
      // and gives every /calc/* page an incoming internal link (fixes the
      // orphan-page issue flagged in the technical-SEO audit).
      url: `${baseUrl}/calc`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      // Election hub. Updates whenever an election window opens or
      // whenever Lok Sabha / state election data is refreshed.
      url: `${baseUrl}/elections`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      // Sports hub. Live cricket scores refresh every minute on-page;
      // sitemap-level changeFrequency is "daily" because schedules and
      // upcoming-match cards may shift day-to-day.
      url: `${baseUrl}/sports`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    // === IPL Phase 2 — programmatic SEO pages ===
    // Main IPL 2026 hub. High priority because it's the entry point for
    // all IPL traffic and links to teams / history / records.
    {
      url: `${baseUrl}/sports/ipl-2026`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    // 10 team pages — each targets that team's branded queries
    // (e.g. "mumbai indians ipl titles", "csk all winners").
    ...IPL_TEAMS.map((t) => ({
      url: `${baseUrl}/sports/ipl-2026/teams/${t.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    // Records hub
    {
      url: `${baseUrl}/sports/ipl-records`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    // 8 individual record pages — each targets specific record queries
    // (e.g. "highest individual score in ipl", "ipl most wickets ever").
    ...IPL_RECORDS.map((r) => ({
      url: `${baseUrl}/sports/ipl-records/${r.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    // 18 history pages (one per IPL season 2008-2025) — long-tail search
    // (e.g. "ipl 2016 winner", "ipl 2008 final venue").
    ...IPL_HISTORY.map((s) => ({
      url: `${baseUrl}/sports/ipl-history/${s.year}`,
      lastModified: s.finalDate + "T00:00:00.000Z",
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    // === /best hub + /best/* listicles (Phase 3 Rounds 1 + 2) ===
    // High-intent comparison guides ranking SabTools tools against
    // competitor calculators. Hub at /best (priority 0.8) sits one
    // step below the homepage in the internal-link graph; child
    // listicles are 0.7 — substantial content pages that should
    // crawl frequently but rank below the hub.
    {
      url: `${baseUrl}/best`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    // /compare + /alternatives hub index pages — give the comparison &
    // alternative listicles a valid parent (their breadcrumbs linked to these
    // index URLs which previously 404'd — technical-SEO audit).
    {
      url: `${baseUrl}/compare`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/alternatives`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/best/free-gst-calculator-india`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/best/free-emi-calculator-india`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/best/free-pdf-tools-india`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/best/free-income-tax-calculator-india`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/best/hindi-calculator-tools`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    // === /compare/* + /alternatives/* (Phase 3 Round 3) ===
    // Head-to-head comparison pages and alternative-listing pages
    // ranked SabTools alongside the verified competitor list
    // (toolvala, indiatoolkit, cleartax, easycalculation, uptools).
    // Same priority 0.7 as /best/* — they're sibling content surfaces.
    {
      url: `${baseUrl}/compare/sabtools-vs-toolvala`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/compare/sabtools-vs-indiatoolkit`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/compare/sabtools-vs-cleartax`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/compare/sabtools-vs-easycalculation`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/compare/sabtools-vs-uptools`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/alternatives/to-toolvala`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/alternatives/to-indiatoolkit`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/alternatives/to-cleartax-calculators`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
  ];

  // Category pages — declare a Hindi alternate only when a `/hi/category/{slug}`
  // pillar actually exists, mirroring the page-level `hasHindiPillar` gate.
  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => {
    const hasHindiPillar = Boolean(categoryPillarsHi[cat.slug]);
    return {
      url: `${baseUrl}/category/${cat.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
      ...(hasHindiPillar
        ? {
            alternates: {
              languages: {
                "en-IN": `${baseUrl}/category/${cat.slug}`,
                "hi-IN": `${baseUrl}/hi/category/${cat.slug}`,
                "x-default": `${baseUrl}/category/${cat.slug}`,
              },
            },
          }
        : {}),
    };
  });

  // All tool pages (English) — Hindi alternate only when /hi/tools/{slug}
  // exists, mirroring the same gate from Batch 27 (5 EN-only tools).
  const toolPages: MetadataRoute.Sitemap = tools.map((tool) => {
    const hasHindi = hindiToolSlugs.includes(tool.slug);
    return {
      url: `${baseUrl}/tools/${tool.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
      ...(hasHindi
        ? {
            alternates: {
              languages: {
                "en-IN": `${baseUrl}/tools/${tool.slug}`,
                "hi-IN": `${baseUrl}/hi/tools/${tool.slug}`,
                "x-default": `${baseUrl}/tools/${tool.slug}`,
              },
            },
          }
        : {}),
    };
  });

  // Blog listing page
  const blogListPage: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.7,
    },
  ];

  // All blog posts. Posts with a hero screenshot also declare an
  // `<image:image>` entry so Google can pick them up for Image Search —
  // the auto-blog generator captures a 1200×630 WebP per post that's an
  // ideal image-result candidate (high CTR on long-tail tool queries).
  const blogPosts = getAllPosts();
  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.date || now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
    ...(post.image ? { images: [`${baseUrl}${post.image.src}`] } : {}),
  }));

  // Programmatic calculator pages (/calc/*)
  const calcPages: MetadataRoute.Sitemap = programmaticPages.map((page) => ({
    url: `${baseUrl}/calc/${page.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Author profile pages
  const authorPages: MetadataRoute.Sitemap = authors.map((author) => ({
    url: `${baseUrl}/author/${author.slug}`,
    lastModified: stableDate,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [
    ...staticPages,
    ...categoryPages,
    ...toolPages,
    ...calcPages,
    ...blogListPage,
    ...blogPages,
    ...authorPages,
  ];
}
