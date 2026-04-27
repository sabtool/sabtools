import { hindiToolSlugs } from "@/lib/hindi";
import { categoryPillarsHi } from "@/lib/category-pillars-hi";

export const dynamic = "force-static";

/**
 * Hindi sitemap - contains all Hindi tool pages, Hindi category pillars
 * and the Hindi homepage. Served at /sitemap-hi.xml
 *
 * Tools are filtered to `hindiToolSlugs` only — `tools` includes English-
 * only entries that don't have a `/hi/tools/<slug>` page (the route's
 * generateStaticParams emits only hindiTools), and listing them here
 * pointed crawlers at 404 URLs which is a sitemap-quality penalty.
 *
 * Each `<url>` declares its language alternates inline via
 * `<xhtml:link rel="alternate" hreflang="..."/>` — Google's
 * recommended approach for multilingual sitemaps. Mirrors the head-level
 * hreflangs declared in Batch 27 / Batch 30; both signals strengthen
 * each other.
 */

interface HiSitemapItem {
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: string;
  /** Optional English counterpart URL — set only when one actually exists. */
  enLoc: string;
}

export async function GET() {
  const baseUrl = "https://sabtools.in";
  const now = new Date().toISOString();

  const urls: HiSitemapItem[] = [
    {
      loc: `${baseUrl}/hi`,
      enLoc: `${baseUrl}/`,
      lastmod: now,
      changefreq: "daily",
      priority: "0.9",
    },
    // Hindi category pillar pages — topic-cluster anchors for /hi
    ...Object.keys(categoryPillarsHi).map((slug) => ({
      loc: `${baseUrl}/hi/category/${slug}`,
      enLoc: `${baseUrl}/category/${slug}`,
      lastmod: now,
      changefreq: "weekly",
      priority: "0.8",
    })),
    // Only tools with a Hindi version — anything else 404s under /hi/tools.
    // Every Hindi tool has an English counterpart at /tools/{slug}.
    ...hindiToolSlugs.map((slug) => ({
      loc: `${baseUrl}/hi/tools/${slug}`,
      enLoc: `${baseUrl}/tools/${slug}`,
      lastmod: now,
      changefreq: "weekly",
      priority: "0.7",
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
    <xhtml:link rel="alternate" hreflang="en-IN" href="${u.enLoc}" />
    <xhtml:link rel="alternate" hreflang="hi-IN" href="${u.loc}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${u.enLoc}" />
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
