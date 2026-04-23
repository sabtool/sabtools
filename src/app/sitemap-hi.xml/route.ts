import { tools } from "@/lib/tools";

export const dynamic = "force-static";

/**
 * Hindi sitemap - contains all Hindi tool pages and Hindi homepage
 * Served at /sitemap-hi.xml
 */
export async function GET() {
  const baseUrl = "https://sabtools.in";
  const now = new Date().toISOString();

  const urls = [
    {
      loc: `${baseUrl}/hi`,
      lastmod: now,
      changefreq: "daily",
      priority: "0.9",
    },
    ...tools.map((tool) => ({
      loc: `${baseUrl}/hi/tools/${tool.slug}`,
      lastmod: now,
      changefreq: "weekly",
      priority: "0.7",
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
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
