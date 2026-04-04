import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import AdBanner from "@/components/AdBanner";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { tools } from "@/lib/tools";

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
  return {
    title: `${post.title} — Guide`,
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
      siteName: "SabTools.in",
      locale: "en_IN",
      ...(post.image && {
        images: [{ url: `https://sabtools.in${post.image.src}`, width: post.image.width, height: post.image.height, alt: post.image.alt }],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      ...(post.image && { images: [`https://sabtools.in${post.image.src}`] }),
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

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Person",
      name: "SabTools Team",
      url: "https://sabtools.in/about",
    },
    publisher: {
      "@type": "Organization",
      name: "SabTools.in",
      url: "https://sabtools.in",
      logo: { "@type": "ImageObject", url: "https://sabtools.in/og-image.png" },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://sabtools.in/blog/${post.slug}`,
    },
    keywords: post.keywords.join(", "),
    ...(post.image && {
      image: {
        "@type": "ImageObject",
        url: `https://sabtools.in${post.image.src}`,
        width: post.image.width,
        height: post.image.height,
        caption: post.image.alt,
      },
    }),
    inLanguage: "en",
    isAccessibleForFree: true,
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://sabtools.in" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://sabtools.in/blog" },
      { "@type": "ListItem", position: 3, name: post.title, item: `https://sabtools.in/blog/${post.slug}` },
    ],
  };

  // Extract FAQ items from blog content (matches <h3> questions followed by <p> answers)
  const faqMatches = [...post.content.matchAll(/<h3[^>]*>(.*?)<\/h3>\s*<p[^>]*>(.*?)<\/p>/gi)];
  const faqLd = faqMatches.length >= 2 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqMatches.map((m) => ({
      "@type": "Question",
      name: m[1].replace(/<[^>]*>/g, ""),
      acceptedAnswer: {
        "@type": "Answer",
        text: m[2].replace(/<[^>]*>/g, ""),
      },
    })),
  } : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Blog", href: "/blog" },
            { label: post.title },
          ]}
        />

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
              <span className="text-sm text-gray-500 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                {new Date(post.date).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
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

          <AdBanner format="horizontal" className="mb-8" />

          {/* Blog Content */}
          <div
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <AdBanner format="horizontal" className="mt-10" />

          {/* Share Section */}
          <div className="mt-12 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100">
            <p className="text-sm font-semibold text-gray-700 mb-3">Share this article</p>
            <div className="flex gap-3">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(post.title + ' - https://sabtools.in/blog/' + post.slug)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp
              </a>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent('https://sabtools.in/blog/' + post.slug)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                Twitter
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://sabtools.in/blog/' + post.slug)}`}
                target="_blank"
                rel="noopener noreferrer"
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
