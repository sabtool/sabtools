import { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/_next/image/", "/embed/", "/api/", "/search"],
      },
      {
        userAgent: "Googlebot",
        allow: ["/", "/_next/static/"],
        disallow: ["/embed/", "/search"],
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: ["/embed/", "/search"],
      },
      {
        userAgent: "AdsBot-Google",
        allow: "/",
      },
    ],
    sitemap: "https://sabtools.in/sitemap.xml",
  };
}
