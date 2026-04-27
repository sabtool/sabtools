import Link from "next/link";
import { Metadata } from "next";
import { hindiTools } from "@/lib/hindi";
import { tools, categories } from "@/lib/tools";
import { categoryPillarsHi } from "@/lib/category-pillars-hi";
import {
  SITE_URL,
  ORG_ID,
  WEBSITE_ID,
  breadcrumbNode,
  breadcrumbIdFor,
  buildGraph,
  BUILD_DATE,
} from "@/lib/schema";

export const metadata: Metadata = {
  title: `${hindiTools.length}+ मुफ्त ऑनलाइन टूल्स हिंदी में`,
  description: `मुफ्त ऑनलाइन टूल्स — EMI कैलकुलेटर, SIP कैलकुलेटर, GST कैलकुलेटर, शब्द गणक और ${hindiTools.length}+ टूल्स। बिना साइनअप, 100% मुफ्त।`,
  alternates: {
    canonical: "https://sabtools.in/hi",
    languages: { "en-IN": "https://sabtools.in", "hi-IN": "https://sabtools.in/hi", "x-default": "https://sabtools.in" },
  },
  openGraph: {
    title: `SabTools.in - ${hindiTools.length}+ मुफ्त ऑनलाइन टूल्स हिंदी में`,
    description: `मुफ्त ऑनलाइन टूल्स — EMI कैलकुलेटर, SIP कैलकुलेटर, GST कैलकुलेटर और ${hindiTools.length}+ टूल्स। 100% मुफ्त।`,
    url: "https://sabtools.in/hi",
    type: "website",
    locale: "hi_IN",
    alternateLocale: ["en_IN"],
    siteName: "SabTools.in",
    images: [{ url: "https://sabtools.in/og-image.png", width: 1200, height: 630, alt: "SabTools.in - मुफ्त ऑनलाइन टूल्स" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `SabTools.in - ${hindiTools.length}+ मुफ्त ऑनलाइन टूल्स हिंदी में`,
    description: "मुफ्त ऑनलाइन टूल्स — 100% मुफ्त, बिना साइनअप।",
    images: ["https://sabtools.in/og-image.png"],
    creator: "@sabtools",
    site: "@sabtools",
  },
};

export default function HindiHomePage() {
  // JSON-LD schema for the Hindi homepage. Mirrors the structure of the
  // English homepage but with hi-IN inLanguage and Hindi-localised
  // pillar/tool ItemLists. Organization and WebSite are referenced by
  // @id only — they're declared in full on the English homepage so the
  // Knowledge Graph treats both surfaces as the same canonical entities.
  const pageUrl = `${SITE_URL}/hi`;
  const webPageId = `${pageUrl}#webpage`;
  const breadcrumbId = breadcrumbIdFor(pageUrl);
  const pillarListId = `${pageUrl}#pillar-list`;
  const toolListId = `${pageUrl}#tool-list`;

  // Hindi pillars in declared-order (matches the visible UI)
  const hiPillars = Object.keys(categoryPillarsHi)
    .map((slug) => categories.find((c) => c.slug === slug))
    .filter(Boolean) as typeof categories;

  // Top N Hindi tools as the ItemList — capped to keep the schema lean.
  const featuredHiTools = hindiTools.slice(0, 12);

  const hiHomeGraph = buildGraph([
    {
      "@type": "WebPage",
      "@id": webPageId,
      url: pageUrl,
      name: `${hindiTools.length}+ मुफ्त ऑनलाइन टूल्स हिंदी में — SabTools.in`,
      description: `मुफ्त ऑनलाइन टूल्स — EMI कैलकुलेटर, SIP कैलकुलेटर, GST कैलकुलेटर और ${hindiTools.length}+ टूल्स। 100% मुफ्त।`,
      inLanguage: "hi-IN",
      isPartOf: { "@id": WEBSITE_ID },
      publisher: { "@id": ORG_ID },
      breadcrumb: { "@id": breadcrumbId },
      dateModified: BUILD_DATE,
      // The Hindi pillar list is the page's primary entity — the most
      // important content collection a user (and crawler) lands on.
      mainEntity: { "@id": pillarListId },
    },
    {
      "@type": "ItemList",
      "@id": pillarListId,
      name: "विषय गाइड — हिंदी पिलर पेज",
      description: "श्रेणी के अनुसार पूरी जानकारी हिंदी में",
      numberOfItems: hiPillars.length,
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      itemListElement: hiPillars.map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: c.name,
        url: `${SITE_URL}/hi/category/${c.slug}`,
      })),
    },
    {
      "@type": "ItemList",
      "@id": toolListId,
      name: "लोकप्रिय हिंदी टूल्स",
      description: `${hindiTools.length}+ मुफ्त ऑनलाइन टूल्स हिंदी में — SabTools.in पर`,
      numberOfItems: featuredHiTools.length,
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      itemListElement: featuredHiTools.map((ht, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: ht.name,
        url: `${SITE_URL}/hi/tools/${ht.slug}`,
      })),
    },
    breadcrumbNode(
      [
        { name: "Home", url: `${SITE_URL}/` },
        { name: "हिंदी" },
      ],
      breadcrumbId
    ),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(hiHomeGraph) }}
      />
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-orange-50 rounded-full px-4 py-1.5 text-sm font-medium text-orange-600 border border-orange-100 mb-6">
          🇮🇳 हिंदी में उपलब्ध
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
          <span className="text-gray-900">सभी </span>
          <span className="gradient-text">मुफ्त ऑनलाइन टूल्स</span>
          <br />
          <span className="text-gray-900">हिंदी में</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          EMI कैलकुलेटर, SIP कैलकुलेटर, GST कैलकुलेटर, इनकम टैक्स कैलकुलेटर और {hindiTools.length}+ टूल्स। बिल्कुल मुफ्त, बिना साइनअप।
        </p>
      </div>

      {/* Hindi Topic Pillars — entry points into category guides */}
      <section className="mb-14">
        <div className="flex items-end justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">विषय गाइड</h2>
            <p className="text-sm text-gray-500 mt-1">श्रेणी के अनुसार पूरी जानकारी हिंदी में</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {Object.keys(categoryPillarsHi).map((slug) => {
            const c = categories.find((x) => x.slug === slug);
            if (!c) return null;
            const toolCount = tools.filter((t) => t.category === slug).length;
            return (
              <Link
                key={slug}
                href={`/hi/category/${slug}`}
                className="group flex items-start gap-3 bg-white hover:bg-orange-50/70 border border-gray-200 hover:border-orange-300 rounded-xl p-4 transition"
              >
                <div className="text-2xl flex-shrink-0">{c.icon}</div>
                <div className="min-w-0">
                  <div className="font-semibold text-gray-900 group-hover:text-orange-700 text-sm leading-tight">
                    {c.name}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {toolCount} टूल्स
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <h2 className="text-2xl font-bold text-gray-900 mb-4">सभी हिंदी टूल्स</h2>
      {/* Hindi Tools Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {hindiTools.map((ht) => {
          const tool = tools.find((t) => t.slug === ht.slug);
          return (
            <Link
              key={ht.slug}
              href={`/hi/tools/${ht.slug}`}
              className="tool-card group block"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-2xl group-hover:bg-orange-100 transition shrink-0">
                  {tool?.icon || "🔧"}
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-800 group-hover:text-indigo-600 transition text-base">
                    {ht.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1 leading-relaxed line-clamp-2">
                    {ht.description}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* CTA */}
      <div className="text-center mt-12">
        <Link href="/" className="btn-secondary inline-block">
          View All Tools in English →
        </Link>
      </div>
    </div>
  );
}
