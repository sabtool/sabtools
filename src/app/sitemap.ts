import { MetadataRoute } from "next";
import { tools, categories } from "@/lib/tools";
import { getAllPosts } from "@/lib/blog";
import { programmaticPages } from "@/lib/programmatic-pages";
import { authors } from "@/lib/authors";
import { hindiToolSlugs } from "@/lib/hindi";
import { categoryPillarsHi } from "@/lib/category-pillars-hi";

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
  // Content stamp for evergreen surfaces (tools / categories / hubs /
  // listicles). Bump ONLY when their content materially changes — using
  // the per-build timestamp here put one identical lastmod on 700+ URLs
  // every deploy, which Google treats as noise and ignores (2026-08 audit).
  // 2026-08-09: fabricated-content removal changed every tool page.
  const contentStamp = "2026-08-09T00:00:00.000Z";

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
      lastModified: contentStamp,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    // Elections and Sports hubs retired on 2026-06-08 — sitemap entries
    // removed so Google de-indexes the URLs naturally. vercel.json
    // additionally 301-redirects /sports/* and /elections/* → /.
    // === /best hub + /best/* listicles (Phase 3 Rounds 1 + 2) ===
    // High-intent comparison guides ranking SabTools tools against
    // competitor calculators. Hub at /best (priority 0.8) sits one
    // step below the homepage in the internal-link graph; child
    // listicles are 0.7 — substantial content pages that should
    // crawl frequently but rank below the hub.
    {
      url: `${baseUrl}/best`,
      lastModified: contentStamp,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    // /compare + /alternatives hub index pages — give the comparison &
    // alternative listicles a valid parent (their breadcrumbs linked to these
    // index URLs which previously 404'd — technical-SEO audit).
    {
      url: `${baseUrl}/compare`,
      lastModified: contentStamp,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/alternatives`,
      lastModified: contentStamp,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/best/free-gst-calculator-india`,
      lastModified: contentStamp,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/best/free-emi-calculator-india`,
      lastModified: contentStamp,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/best/free-pdf-tools-india`,
      lastModified: contentStamp,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/best/free-income-tax-calculator-india`,
      lastModified: contentStamp,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/best/hindi-calculator-tools`,
      lastModified: contentStamp,
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
      lastModified: contentStamp,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/compare/sabtools-vs-indiatoolkit`,
      lastModified: contentStamp,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/compare/sabtools-vs-cleartax`,
      lastModified: contentStamp,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/compare/sabtools-vs-easycalculation`,
      lastModified: contentStamp,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/compare/sabtools-vs-uptools`,
      lastModified: contentStamp,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/alternatives/to-toolvala`,
      lastModified: contentStamp,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/alternatives/to-indiatoolkit`,
      lastModified: contentStamp,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/alternatives/to-cleartax-calculators`,
      lastModified: contentStamp,
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
      lastModified: contentStamp,
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
      lastModified: contentStamp,
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

  // Programmatic calculator pages (/calc/*) — REMOVED from the sitemap
  // 2026-08. The 211 variants measured 85-98.6% text-identical to each
  // other (SEO audit: doorway-page pattern at 4x the safety threshold).
  // They now rel-canonical to their parent /tools/ page and stay live
  // for direct/ad traffic, but are no longer advertised for indexing.
  const calcPages: MetadataRoute.Sitemap = [];
  void programmaticPages; // import retained for the /calc hub page

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
