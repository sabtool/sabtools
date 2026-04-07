import { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/_next/image/",
          "/embed/",
          "/api/",
          "/search",
          // Block old WordPress URLs still being crawled (72 ghost pages wasting crawl budget)
          "/product/",
          "/product-category/",
          "/product-tag/",
          "/shop-2/",
          "/checkout/",
          "/brand/",
          "/wp-login.php",
          "/wp-admin/",
          "/*?add-to-cart=",
          "/*?add-to-wishlist=",
          "/*?add-to-compare=",
          "/privacy-policy/",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: ["/", "/_next/static/"],
        disallow: ["/embed/", "/search", "/product/", "/product-category/", "/product-tag/", "/shop-2/", "/checkout/", "/brand/", "/wp-login.php", "/wp-admin/", "/*?add-to-cart=", "/*?add-to-wishlist=", "/*?add-to-compare=", "/privacy-policy/"],
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: ["/embed/", "/search", "/product/", "/product-category/", "/product-tag/", "/shop-2/", "/checkout/", "/brand/", "/wp-login.php", "/wp-admin/", "/*?add-to-cart=", "/*?add-to-wishlist=", "/*?add-to-compare=", "/privacy-policy/"],
      },
      {
        userAgent: "AdsBot-Google",
        allow: "/",
      },
    ],
    sitemap: "https://sabtools.in/sitemap.xml",
  };
}
