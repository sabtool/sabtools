import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import AdBanner from "@/components/AdBanner";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { tools, categories } from "@/lib/tools";
import { categoryPillars } from "@/lib/category-pillars";
import {
  SITE_URL,
  ORG_ID,
  WEBSITE_ID,
  FOUNDER_ID,
  breadcrumbIdFor,
  breadcrumbNode,
  faqPageNode,
  buildGraph,
  personIdFor,
  INDIA_AUDIENCE,
} from "@/lib/schema";
import { getAuthorByCategory } from "@/lib/authors";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  // Resolve the post's domain expert (E-E-A-T author) — used for both
  // the Twitter `creator` handle and the OG `article:author` URL. When the
  // post is tied to a specific tool, that tool's category drives the
  // lookup; otherwise we fall back to the founder/brand. Same resolution
  // chain matches the Article.author @id emitted in the page component
  // below — keeping the social-card byline and structured-data byline
  // aligned.
  let twitterCreator = "@sabtools";
  let articleAuthorUrl: string | undefined;
  if (post.toolSlug) {
    const t = tools.find((tt) => tt.slug === post.toolSlug);
    if (t) {
      const expert = getAuthorByCategory(t.category);
      if (expert) {
        articleAuthorUrl = `https://sabtools.in/author/${expert.slug}`;
        if (expert.socialLinks?.twitter) {
          twitterCreator = `@${expert.socialLinks.twitter}`;
        }
      }
    }
  }
  // Fall back to founder profile when no expert claims this post —
  // mirrors the schema fallback in the page component.
  if (!articleAuthorUrl) {
    articleAuthorUrl = "https://sabtools.in/author/rakesh-seervi";
  }

  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: `https://sabtools.in/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://sabtools.in/blog/${slug}`,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.date,
      // OG article:author URL points at the resolved expert's profile —
      // social platforms (Facebook, LinkedIn) use this to render an
      // author byline on the share preview, mirroring twitter:creator.
      authors: [articleAuthorUrl],
      // article:section = the post's human-readable category label, and
      // article:tag = its keyword set. Both are read by Facebook for
      // contextual feed targeting and aren't covered by JSON-LD alone.
      section: post.category,
      tags: post.keywords,
      siteName: "SabTools.in",
      locale: "en_IN",
      // Always emit at least one og:image — falls back to the sitewide
      // brand card when the post has no custom hero image. Pages without
      // og:image render with no preview card on social platforms, which
      // tanks click-through (Strategy §2.6 — every URL needs a preview).
      images: post.image
        ? [
            {
              url: `https://sabtools.in${post.image.src}`,
              width: post.image.width,
              height: post.image.height,
              alt: post.image.alt,
            },
          ]
        : [
            {
              url: "https://sabtools.in/og-image.png",
              width: 1200,
              height: 630,
              alt: post.title,
            },
          ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: post.image
        ? [`https://sabtools.in${post.image.src}`]
        : ["https://sabtools.in/og-image.png"],
      creator: twitterCreator,
      site: "@sabtools",
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const allPosts = getAllPosts();
  const postKws = new Set(post.keywords.map((k) => k.toLowerCase()));
  const relatedPosts = allPosts
    .filter((p) => p.slug !== post.slug)
    .map((p) => {
      let score = 0;
      if (p.category === post.category) score += 3;
      p.keywords.forEach((k) => { if (postKws.has(k.toLowerCase())) score += 1; });
      return { ...p, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  // Extract FAQ items from blog content (matches <h3> questions followed by <p> answers)
  const faqMatches = [...post.content.matchAll(/<h3[^>]*>(.*?)<\/h3>\s*<p[^>]*>(.*?)<\/p>/gi)];
  const extractedFaqs = faqMatches.length >= 2
    ? faqMatches.map((m) => ({
        q: m[1].replace(/<[^>]*>/g, ""),
        a: m[2].replace(/<[^>]*>/g, ""),
      }))
    : [];

  // ── Entity-linking: walk the post body for tool-name mentions so we can emit
  //    schema.org `about` (the primary tool) and `mentions` (other tools the
  //    post references). Linking via @id ties this Article into the same
  //    Knowledge-Graph entities declared on tool pages, which is the pattern
  //    Google's Article rich-result docs recommend (Strategy §2.4 / Appendix A).
  const plainText = post.content
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  const wordCount = plainText.split(" ").filter(Boolean).length;

  // Find every tool whose name appears in the body — case-insensitive,
  // word-boundary match. Sort longest-name-first so "Home Loan EMI Calculator"
  // wins over "EMI Calculator" when both are present.
  const sortedTools = [...tools].sort((a, b) => b.name.length - a.name.length);
  const mentionedSlugs = new Set<string>();
  const lower = plainText.toLowerCase();
  for (const t of sortedTools) {
    const needle = t.name.toLowerCase();
    if (needle.length < 6) continue; // skip tiny names that match noise
    // word-boundary check around the match position
    const idx = lower.indexOf(needle);
    if (idx === -1) continue;
    const before = idx === 0 ? " " : lower[idx - 1];
    const after = idx + needle.length >= lower.length ? " " : lower[idx + needle.length];
    if (/[a-z0-9]/.test(before) || /[a-z0-9]/.test(after)) continue;
    mentionedSlugs.add(t.slug);
  }
  // Don't double-count the primary tool (it goes in `about`, not `mentions`).
  if (post.toolSlug) mentionedSlugs.delete(post.toolSlug);
  // Cap mentions at 8 — beyond that the schema bloats without helping discovery.
  const mentionsArray = [...mentionedSlugs].slice(0, 8).map((s) => ({
    "@id": `${SITE_URL}/tools/${s}#application`,
  }));

  // Build the `about` array: primary tool entity + the category pillar (if it
  // exists) — gives Google a clear signal of what this article is "about" at
  // both the specific (tool) and topical (category) level.
  const aboutArray: Record<string, unknown>[] = [];
  if (post.toolSlug) {
    aboutArray.push({ "@id": `${SITE_URL}/tools/${post.toolSlug}#application` });
  }
  // Resolve the post's category to a real Tool category slug (Batch 17). The
  // `post.category` field is a human-readable label like "Finance", "Tax &
  // Salary", or "WhatsApp & UPI". Resolution order:
  //   1. If the post is tied to a specific tool (post.toolSlug), use *that*
  //      tool's category — most accurate, never wrong.
  //   2. Otherwise match the label against `categories[].name` (tolerant
  //      lowercase / contains match).
  //   3. Last resort: try the label as a slug directly.
  // We then use this slug for two things: the schema `about` link to the
  // category pillar, AND the breadcrumb-trail node `Home → Blog → Category
  // → Post` so users and crawlers see the topic-cluster hierarchy.
  const primaryTool = post.toolSlug
    ? tools.find((t) => t.slug === post.toolSlug)
    : undefined;
  const labelLc = post.category.toLowerCase().trim();
  // Multi-pass match — most-specific to least, so "Utility" picks slug
  // "utility" (Everyday Utility) instead of substring-matching the earlier
  // "Fun & Utility" entry. Tool-derived match wins when the post is tied
  // to a specific tool because that's never wrong.
  const resolvedCategorySlug =
    primaryTool?.category ??
    categories.find((c) => c.name.toLowerCase() === labelLc)?.slug ??
    categories.find((c) => c.slug === labelLc)?.slug ??
    // "Tax" → "Tax & Salary", "Math" → "Math & Numbers" (label is the
    // canonical first-segment of the category name).
    categories.find((c) => {
      const head = c.name.toLowerCase().split(/\s+(?:&|and)\s+/)[0];
      return head === labelLc;
    })?.slug ??
    // Tolerant containment as a last resort. Examples this catches:
    //   "Image" → "Image Tools"           (name starts with label)
    //   "Tax & Salary" → "Tax & Salary"   (already exact above)
    //   "Real Estate" → "Real Estate"     (already exact above)
    //   "Construction" → "Construction"   (already exact above)
    categories.find((c) => {
      const cn = c.name.toLowerCase();
      return cn.startsWith(labelLc + " ") || cn.endsWith(" " + labelLc);
    })?.slug;
  const resolvedCategory = resolvedCategorySlug
    ? categories.find((c) => c.slug === resolvedCategorySlug)
    : undefined;
  if (resolvedCategorySlug && categoryPillars[resolvedCategorySlug]) {
    aboutArray.push({
      "@id": `${SITE_URL}/category/${resolvedCategorySlug}#collectionpage`,
    });
  }

  const pageUrl = `${SITE_URL}/blog/${post.slug}`;
  const articleId = `${pageUrl}#article`;
  const webPageId = `${pageUrl}#webpage`;
  const breadcrumbId = breadcrumbIdFor(pageUrl);

  // Single source of truth for the 3- or 4-level breadcrumb trail used by
  // both the visual <Breadcrumb> component AND the BreadcrumbList JSON-LD.
  // When the post resolves to a real tool category, we slot the category in
  // as the third trail node so Google sees the full topic-cluster path:
  //   Home → Blog → {Category Pillar} → {Post Title}
  // This is the pattern Google's BreadcrumbList rich-result spec recommends
  // for category-organised content (Strategy §2.4 / §3.3 internal-link silo).
  const trailNodes: Array<{ name: string; url?: string }> = [
    { name: "Home", url: `${SITE_URL}/` },
    { name: "Blog", url: `${SITE_URL}/blog` },
  ];
  if (resolvedCategory) {
    trailNodes.push({
      name: resolvedCategory.name,
      url: `${SITE_URL}/category/${resolvedCategory.slug}`,
    });
  }
  trailNodes.push({ name: post.title });

  // Same trail expressed for the visual component (uses path-only hrefs).
  const visualTrail: Array<{ label: string; href?: string }> = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
  ];
  if (resolvedCategory) {
    visualTrail.push({
      label: resolvedCategory.name,
      href: `/category/${resolvedCategory.slug}`,
    });
  }
  visualTrail.push({ label: post.title });

  // Single @graph:
  //   WebPage (article hub) → Article (mainEntity, with about/mentions linking
  //   back to tool & pillar entities by @id) → BreadcrumbList → (optional) FAQPage.
  // Author and publisher are linked via @id to the shared entities declared on the homepage.
  const blogNodes: Record<string, unknown>[] = [
    {
      "@type": "WebPage",
      "@id": webPageId,
      url: pageUrl,
      name: post.title,
      description: post.description,
      inLanguage: "en-IN",
      isPartOf: { "@id": WEBSITE_ID },
      publisher: { "@id": ORG_ID },
      breadcrumb: { "@id": breadcrumbId },
      mainEntity: { "@id": articleId },
      datePublished: post.date,
      dateModified: post.date,
      // Voice-search optimisation (Speakable rich-result spec). Articles
      // are read aloud most cleanly when Google Assistant targets the
      // page title + lead paragraph; we mark those with a stable hook
      // (`.blog-article header h1`, `.blog-article header p`) so the
      // assistant skips ads, breadcrumbs, share buttons, etc.
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: [
          ".blog-article header h1",
          ".blog-article header p",
          ...(extractedFaqs.length > 0
            ? [".blog-content h3", ".blog-content h3 + p"]
            : []),
        ],
      },
    },
    {
      "@type": "Article",
      "@id": articleId,
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      dateModified: post.date,
      // Author attribution by domain expertise: walk the resolved category
      // through `authors[].categories` so a Finance post is bylined to
      // Priya Sharma (CFP), a Health post to Dr. Rajesh Kumar (MBBS),
      // etc. Falls back to the founder when no expert claims that category
      // — same E-E-A-T model Google rewards in YMYL rich-results.
      author: {
        "@id":
          (resolvedCategorySlug
            ? personIdFor(getAuthorByCategory(resolvedCategorySlug)?.slug ?? "rakesh-seervi")
            : FOUNDER_ID),
      },
      publisher: { "@id": ORG_ID },
      mainEntityOfPage: { "@id": webPageId },
      isPartOf: { "@id": WEBSITE_ID },
      keywords: post.keywords.join(", "),
      articleSection: post.category,
      wordCount,
      // Geo-targeted audience — every guide is written specifically for
      // Indian users and references INR / RBI / GST / Indian banks.
      // Reinforces Organization.areaServed at the article level.
      audience: INDIA_AUDIENCE,
      ...(aboutArray.length > 0 ? { about: aboutArray } : {}),
      ...(mentionsArray.length > 0 ? { mentions: mentionsArray } : {}),
      // Article rich-results require `image`. Always emit one — use the
      // post's hero image when available, otherwise fall back to the
      // sitewide brand card so Google's eligibility check doesn't fail
      // on posts that never got a custom screenshot.
      image: post.image
        ? {
            "@type": "ImageObject",
            url: `${SITE_URL}${post.image.src}`,
            width: post.image.width,
            height: post.image.height,
            caption: post.image.alt,
          }
        : {
            "@type": "ImageObject",
            url: `${SITE_URL}/og-image.png`,
            width: 1200,
            height: 630,
            caption: post.title,
          },
      inLanguage: "en-IN",
      isAccessibleForFree: true,
    },
    breadcrumbNode(trailNodes, breadcrumbId),
  ];

  if (extractedFaqs.length > 0) {
    blogNodes.push(faqPageNode(extractedFaqs, "en-IN"));
  }

  const blogGraph = buildGraph(blogNodes);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogGraph) }}
      />
      {/* LCP optimization: preload the hero image so the browser starts fetching
          it in parallel with CSS/JS (report §2.3, expected ~300-400ms LCP gain). */}
      {post.image && (
        <link
          rel="preload"
          as="image"
          href={post.image.src}
          fetchPriority="high"
        />
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <Breadcrumb items={visualTrail} />

        <article className="blog-article">
          {/* Header */}
          <header className="mb-10">
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-600 text-white tracking-wide uppercase">
                {post.category}
              </span>
              <span className="text-sm text-gray-500 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {post.readTime}
              </span>
              <time dateTime={post.date} className="text-sm text-gray-500 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                {new Date(post.date).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold text-gray-900 leading-tight tracking-tight">
              {post.title}
            </h1>
            <p className="mt-5 text-lg sm:text-xl text-gray-500 leading-relaxed">
              {post.description}
            </p>
            <div className="mt-8 h-px bg-gradient-to-r from-indigo-500 via-purple-400 to-transparent" />
          </header>

          {/* Hero Image */}
          {post.image && (
            <figure className="mb-8 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
              <img
                src={post.image.src}
                alt={post.image.alt}
                width={post.image.width}
                height={post.image.height}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="w-full h-auto"
              />
              <figcaption className="text-xs text-gray-400 text-center py-2 bg-gray-50">
                {post.image.alt}
              </figcaption>
            </figure>
          )}

          {/* CTA Button */}
          {post.toolSlug && (
            <div className="mb-8 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 flex items-center justify-between flex-wrap gap-3">
              <p className="text-sm text-gray-700 font-medium">Try this tool now — 100% free, no signup required</p>
              <Link
                href={`/tools/${post.toolSlug}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition shadow-sm"
              >
                Open Tool
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </Link>
            </div>
          )}

          {/* Table of Contents */}
          {(() => {
            const tocMatches = [...post.content.matchAll(/<h2[^>]*>(.*?)<\/h2>/gi)];
            if (tocMatches.length < 3) return null;
            return (
              <nav className="mb-8 p-5 bg-gray-50 rounded-xl border border-gray-200" aria-label="Table of Contents">
                <p className="text-sm font-bold text-gray-800 mb-3">Table of Contents</p>
                <ol className="list-decimal list-inside space-y-1.5">
                  {tocMatches.map((m, i) => {
                    const text = m[1].replace(/<[^>]*>/g, "");
                    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
                    return (
                      <li key={i}>
                        <a href={`#${id}`} className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline transition">
                          {text}
                        </a>
                      </li>
                    );
                  })}
                </ol>
              </nav>
            );
          })()}

          <AdBanner format="horizontal" className="mb-8" />

          {/* Blog Content */}
          <div
            className="blog-content"
            dangerouslySetInnerHTML={{
              __html: post.content.replace(
                /<h2([^>]*)>(.*?)<\/h2>/gi,
                (_, attrs, text) => {
                  const plain = text.replace(/<[^>]*>/g, "");
                  const id = plain.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
                  return `<h2${attrs} id="${id}">${text}</h2>`;
                }
              ),
            }}
          />

          <AdBanner format="horizontal" className="mt-10" />

          {/* Share Section */}
          <div className="mt-12 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100">
            <p className="text-sm font-semibold text-gray-700 mb-3">Share this article</p>
            <div className="flex gap-3">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(post.title + ' - https://sabtools.in/blog/' + post.slug)}`}
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp
              </a>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent('https://sabtools.in/blog/' + post.slug)}`}
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                Twitter
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://sabtools.in/blog/' + post.slug)}`}
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                LinkedIn
              </a>
            </div>
          </div>
        </article>

        {/* Related Posts */}
        <section className="mt-16 border-t border-gray-200 pt-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Related Articles
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedPosts.map((rp) => (
              <Link
                key={rp.slug}
                href={`/blog/${rp.slug}`}
                className="group block bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-indigo-200 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="p-5 flex flex-col h-full">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-600">
                      {rp.category}
                    </span>
                    <span className="text-xs text-gray-400">
                      {rp.readTime}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-800 group-hover:text-indigo-600 transition text-[15px] mb-2 line-clamp-2 leading-snug">
                    {rp.title}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-2 flex-grow leading-relaxed">
                    {rp.description}
                  </p>
                  <span className="mt-3 text-xs font-semibold text-indigo-600 group-hover:underline">
                    Read more →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Popular Tools — blog-to-tool internal links */}
        <section className="mt-12 border-t border-gray-200 pt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Popular Free Tools</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {tools
              .filter((t) => {
                const postKw = new Set(post.keywords.map((k) => k.toLowerCase()));
                return (
                  t.slug === post.toolSlug ||
                  t.category === post.category.toLowerCase() ||
                  t.keywords.some((k) => postKw.has(k.toLowerCase()))
                );
              })
              .slice(0, 8)
              .map((t) => (
                <Link
                  key={t.slug}
                  href={`/tools/${t.slug}`}
                  className="flex items-center gap-2 p-3 bg-white rounded-xl border border-gray-100 hover:border-indigo-200 hover:shadow-sm transition group"
                >
                  <span className="text-lg shrink-0">{t.icon}</span>
                  <span className="text-xs font-medium text-gray-700 group-hover:text-indigo-600 transition truncate">
                    {t.name}
                  </span>
                </Link>
              ))}
          </div>
        </section>

        <AdBanner format="rectangle" className="mt-10" />
      </div>
    </>
  );
}
