import { MetadataRoute } from "next";
import { tools, categories } from "@/lib/tools";
import { getAllPosts } from "@/lib/blog";
import { programmaticPages } from "@/lib/programmatic-pages";
import { authors } from "@/lib/authors";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://sabtools.in";
  const now = new Date().toISOString();
  // Stable date for pages that rarely change (avoids misleading Google with build-time dates)
  const stableDate = "2026-03-15T00:00:00.000Z";

  // Homepage
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/hi`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
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
  ];

  // Category pages
  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${baseUrl}/category/${cat.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // All tool pages (English)
  const toolPages: MetadataRoute.Sitemap = tools.map((tool) => ({
    url: `${baseUrl}/tools/${tool.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  // All tool pages (Hindi)
  const hindiToolPages: MetadataRoute.Sitemap = tools.map((tool) => ({
    url: `${baseUrl}/hi/tools/${tool.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Blog listing page
  const blogListPage: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.7,
    },
  ];

  // All blog posts
  const blogPosts = getAllPosts();
  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.date || now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
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

  return [...staticPages, ...categoryPages, ...toolPages, ...hindiToolPages, ...calcPages, ...blogListPage, ...blogPages, ...authorPages];
}
