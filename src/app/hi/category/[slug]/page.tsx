import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { categories, tools } from "@/lib/tools";
import { hindiToolSlugs } from "@/lib/hindi";
import Breadcrumb from "@/components/Breadcrumb";
import AdBanner from "@/components/AdBanner";
import {
  SITE_URL,
  ORG_ID,
  WEBSITE_ID,
  breadcrumbNode,
  breadcrumbIdFor,
  faqPageNode,
  buildGraph,
  personIdFor,
  BUILD_DATE,
  INDIA_AUDIENCE,
} from "@/lib/schema";
import { categoryPillarsHi } from "@/lib/category-pillars-hi";
import { getAuthorByCategory } from "@/lib/authors";

/**
 * Hindi-side category pillar pages. Mirrors the English `/category/{slug}`
 * topic-cluster pattern (Strategy §3.3) but with hand-written Devanagari
 * pillar content from `categoryPillarsHi`. hreflang cross-links to the
 * English pillar so search engines see them as language alternates of the
 * same conceptual page.
 *
 * Tool grid: any tool in this category that already has a Hindi version
 * (in `hindiToolSlugs`) links to `/hi/tools/{slug}`; the rest link to the
 * English tool page so readers can still get to the actual tool — better
 * than hiding 80% of the category.
 */

export function generateStaticParams() {
  return Object.keys(categoryPillarsHi).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cat = categories.find((c) => c.slug === slug);
  const pillar = categoryPillarsHi[slug];
  if (!cat || !pillar) return {};
  const toolCount = tools.filter((t) => t.category === slug).length;

  // Twitter byline from the resolved category reviewer (same person the
  // CollectionPage's `reviewedBy` schema field points at).
  const reviewer = getAuthorByCategory(slug);
  const twitterCreator = reviewer?.socialLinks?.twitter
    ? `@${reviewer.socialLinks.twitter}`
    : "@sabtools";

  return {
    title: `${cat.name} — हिंदी में ${toolCount} मुफ्त ऑनलाइन टूल्स`,
    description: `${cat.name} — ${toolCount} मुफ्त ऑनलाइन टूल्स हिंदी में। बिना साइनअप, तुरंत परिणाम। SabTools.in पर।`,
    alternates: {
      canonical: `https://sabtools.in/hi/category/${slug}`,
      languages: {
        "en-IN": `https://sabtools.in/category/${slug}`,
        "hi-IN": `https://sabtools.in/hi/category/${slug}`,
        "x-default": `https://sabtools.in/category/${slug}`,
      },
    },
    openGraph: {
      title: `${cat.name} — हिंदी में मुफ्त टूल्स | SabTools.in`,
      description: `${toolCount} मुफ्त ${cat.name} हिंदी में। बिना साइनअप।`,
      url: `https://sabtools.in/hi/category/${slug}`,
      type: "website",
      locale: "hi_IN",
      alternateLocale: ["en_IN"],
      siteName: "SabTools.in",
      images: [{ url: "https://sabtools.in/og-image.png", width: 1200, height: 630, alt: `${cat.name} — SabTools.in`, type: "image/png" }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${cat.name} — हिंदी में मुफ्त टूल्स`,
      description: `${toolCount} मुफ्त ${cat.name} हिंदी में। बिना साइनअप।`,
      images: ["https://sabtools.in/og-image.png"],
      creator: twitterCreator,
      site: "@sabtools",
    },
  };
}

export default async function HindiCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cat = categories.find((c) => c.slug === slug);
  const pillar = categoryPillarsHi[slug];
  if (!cat || !pillar) notFound();

  const catTools = tools.filter((t) => t.category === slug);
  const hindiSlugSet = new Set(hindiToolSlugs);
  const pageUrl = `${SITE_URL}/hi/category/${slug}`;
  const webPageId = `${pageUrl}#webpage`;
  const collectionPageId = `${pageUrl}#collectionpage`;
  const itemListId = `${pageUrl}#itemlist`;
  const hiBreadcrumbId = breadcrumbIdFor(pageUrl);

  // E-E-A-T reviewer attribution — same domain expert who reviews English
  // category tools also signs off on the Hindi pillar (Strategy §2.4).
  const categoryReviewer = getAuthorByCategory(slug);

  // Single @graph: WebPage → CollectionPage → ItemList (mainEntity) →
  // BreadcrumbList (breadcrumb), all cross-linked via @id, plus FAQPage.
  // Same entity-graph cohesion as the English pillar — Google sees them
  // as language alternates of one CollectionPage entity.
  const graph = buildGraph([
    {
      "@type": "WebPage",
      "@id": webPageId,
      url: pageUrl,
      name: `${cat.name} — हिंदी में`,
      description: pillar.whatIs,
      inLanguage: "hi-IN",
      isPartOf: { "@id": WEBSITE_ID },
      publisher: { "@id": ORG_ID },
      breadcrumb: { "@id": hiBreadcrumbId },
      mainEntity: { "@id": collectionPageId },
      dateModified: BUILD_DATE,
      // Editorial-review pair — same expert that the CollectionPage's
      // reviewedBy field already points at, surfaced on the WebPage so
      // crawlers see the editorial-review signal at the page level too.
      lastReviewed: BUILD_DATE,
      ...(categoryReviewer
        ? { reviewedBy: { "@id": personIdFor(categoryReviewer.slug) } }
        : {}),
      // Voice-search optimisation in Hindi — Google Assistant on
      // Hindi-locale devices reads aloud the H1 + intro paragraph and
      // FAQ pairs. Mirrors the English pillar selectors.
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: [
          "#intro-speakable h1",
          "#intro-speakable p",
          ...(pillar.pillarFaqs.length > 0
            ? ["#faq-speakable .faq-q", "#faq-speakable .faq-a"]
            : []),
        ],
      },
    },
    {
      "@type": "CollectionPage",
      "@id": collectionPageId,
      name: `${cat.name} — हिंदी`,
      url: pageUrl,
      inLanguage: "hi-IN",
      isPartOf: { "@id": WEBSITE_ID },
      publisher: { "@id": ORG_ID },
      mainEntity: { "@id": itemListId },
      breadcrumb: { "@id": hiBreadcrumbId },
      ...(categoryReviewer
        ? { reviewedBy: { "@id": personIdFor(categoryReviewer.slug) } }
        : {}),
      dateModified: BUILD_DATE,
      audience: INDIA_AUDIENCE,
      numberOfItems: catTools.length,
    },
    {
      "@type": "ItemList",
      "@id": itemListId,
      name: `${cat.name} — मुफ्त ऑनलाइन टूल्स`,
      numberOfItems: catTools.length,
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      itemListElement: catTools.map((t, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: t.name,
        url: hindiSlugSet.has(t.slug)
          ? `${SITE_URL}/hi/tools/${t.slug}`
          : `${SITE_URL}/tools/${t.slug}`,
      })),
    },
    breadcrumbNode(
      [
        { name: "होम", url: `${SITE_URL}/hi` },
        { name: cat.name },
      ],
      hiBreadcrumbId,
    ),
    faqPageNode(pillar.pillarFaqs, "hi-IN"),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />
      <Breadcrumb items={[{ label: "होम", href: "/hi" }, { label: cat.name }]} />

      {/* id is a stable hook for the SpeakableSpecification declared
          in the page schema — Google Assistant reads aloud the H1 +
          intro paragraph for Hindi voice queries about this category. */}
      <div id="intro-speakable" className="mb-10">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${cat.color} text-white text-3xl shadow-lg mb-4`}>
          {cat.icon}
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
          {cat.name} — हिंदी में
        </h1>
        <p className="text-lg text-gray-700 leading-relaxed max-w-3xl">{pillar.whatIs}</p>
        <p className="text-sm text-gray-500 mt-3">
          {catTools.length} मुफ्त टूल्स — बिना साइनअप
        </p>
      </div>

      <AdBanner format="horizontal" className="mb-8" />

      {/* Tools grid */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        सभी {cat.name} ({catTools.length} टूल्स)
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {catTools.map((t) => {
          const hasHindi = hindiSlugSet.has(t.slug);
          return (
            <Link
              key={t.slug}
              href={hasHindi ? `/hi/tools/${t.slug}` : `/tools/${t.slug}`}
              className="tool-card group block"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-2xl group-hover:bg-orange-100 transition shrink-0">
                  {t.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-800 group-hover:text-indigo-600 transition text-base">
                    {t.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1 leading-relaxed line-clamp-2">
                    {t.description}
                  </p>
                  {hasHindi && (
                    <span className="inline-block mt-2 px-2 py-0.5 text-[11px] font-medium bg-orange-50 text-orange-700 rounded-full">
                      हिंदी उपलब्ध
                    </span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <AdBanner format="horizontal" className="mt-10" />

      {/* Use cases */}
      <div className="mt-12">
        <h2 className="text-xl font-bold text-gray-900 mb-4">सामान्य उपयोग</h2>
        <div className="space-y-3">
          {pillar.useCases.map((u, i) => (
            <div key={i} className="flex gap-4 bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white font-bold flex items-center justify-center text-sm">
                {i + 1}
              </div>
              <p className="text-gray-700 leading-relaxed text-[15px]">{u}</p>
            </div>
          ))}
        </div>
      </div>

      {/* India context */}
      <div className="mt-10">
        <h2 className="text-xl font-bold text-gray-900 mb-3">भारत के लिए विशेष</h2>
        <p className="text-gray-700 leading-relaxed text-[15px] bg-orange-50/40 border border-orange-100 rounded-xl p-5">
          {pillar.indianContext}
        </p>
      </div>

      {/* Hindi FAQ — id + classes are speakable hooks (see graph schema) */}
      <div className="mt-12">
        <h2 className="text-xl font-bold text-gray-900 mb-4">अक्सर पूछे जाने वाले प्रश्न</h2>
        <div id="faq-speakable" className="space-y-3">
          {pillar.pillarFaqs.map((faq, i) => (
            <details
              key={i}
              className="group bg-white border border-gray-200 rounded-xl overflow-hidden"
            >
              <summary className="cursor-pointer px-5 py-4 font-medium text-gray-900 hover:bg-gray-50 flex items-center justify-between">
                <span className="faq-q pr-4">{faq.q}</span>
                <svg
                  className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="faq-a px-5 pb-4 text-sm text-gray-600 leading-relaxed">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </div>

      {/* Cross-link to English pillar */}
      <div className="mt-12 bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-2">अंग्रेज़ी में और भी जानकारी</h2>
        <p className="text-sm text-gray-600 mb-4">
          {cat.name} पर हमारी पूरी अंग्रेज़ी गाइड में 800+ शब्दों का विवरण, मुख्य फ़ीचर्स, और चयन-गाइड शामिल हैं।
        </p>
        <Link
          href={`/category/${slug}`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-sm transition"
        >
          Read the full English guide →
        </Link>
      </div>

      {/* Browse other Hindi pillars */}
      <div className="mt-10">
        <h2 className="text-lg font-bold text-gray-900 mb-3">अन्य श्रेणियाँ</h2>
        <div className="flex flex-wrap gap-2">
          {Object.keys(categoryPillarsHi)
            .filter((s) => s !== slug)
            .slice(0, 12)
            .map((s) => {
              const c = categories.find((x) => x.slug === s);
              if (!c) return null;
              return (
                <Link
                  key={s}
                  href={`/hi/category/${s}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-orange-50 border border-gray-200 hover:border-orange-200 rounded-full text-xs font-medium text-gray-700 hover:text-orange-700 transition"
                >
                  <span>{c.icon}</span>
                  <span>{c.name}</span>
                </Link>
              );
            })}
        </div>
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/hi"
          className="inline-block text-sm text-indigo-600 hover:text-indigo-700 font-medium"
        >
          ← सभी हिंदी टूल्स देखें
        </Link>
      </div>
    </div>
  );
}
