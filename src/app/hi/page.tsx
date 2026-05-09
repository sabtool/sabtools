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
  faqPageNode,
} from "@/lib/schema";
import { BRAND } from "@/lib/brand";

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
    images: [{ url: "https://sabtools.in/og-image.png", width: 1200, height: 630, alt: "SabTools.in - मुफ्त ऑनलाइन टूल्स", type: "image/png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `SabTools.in - ${hindiTools.length}+ मुफ्त ऑनलाइन टूल्स हिंदी में`,
    description: "मुफ्त ऑनलाइन टूल्स — 100% मुफ्त, बिना साइनअप।",
    images: [
      {
        url: "https://sabtools.in/og-image.png",
        alt: "SabTools.in - मुफ्त ऑनलाइन टूल्स हिंदी में",
      },
    ],
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

  // Hindi homepage FAQ — mirrors the English homepage FAQ block.
  // 6 hand-written Q&As covering pricing, privacy, catalog size, mobile
  // support, signup, and Hindi availability. Numbers derive from BRAND
  // constants (totalTools, hindiTools, totalCategories) so visible text
  // and JSON-LD stay in sync if BRAND values ever change.
  // Phase 6 Round 2 — Task C.
  const hiFaqs: { q: string; a: string }[] = [
    {
      q: "क्या SabTools.in पूरी तरह मुफ्त है?",
      a: `हाँ। SabTools.in पर सभी ${BRAND.totalTools}+ टूल्स पूरी तरह मुफ्त हैं — कोई सब्सक्रिप्शन नहीं, कोई प्रीमियम टियर नहीं, कोई इस्तेमाल की सीमा नहीं। साइट को सिर्फ डिस्प्ले विज्ञापनों से चलाया जाता है, इसलिए कुछ भी अनलॉक करने या भुगतान करने की ज़रूरत नहीं। आप EMI, SIP, GST, इनकम टैक्स — कोई भी टूल बिना भुगतान के असीमित बार इस्तेमाल कर सकते हैं।`,
    },
    {
      q: "क्या मेरा डेटा सुरक्षित है?",
      a: "पूरी तरह। हर टूल आपके ब्राउज़र में ही चलता है — सैलरी, लोन की रकम, Aadhaar PDF, कोई भी इनपुट हमारे सर्वर तक नहीं पहुँचता। आप DevTools के Network टैब में देख सकते हैं कि कोई आउटगोइंग रिक्वेस्ट नहीं जाती। टैब बंद करते ही सब साफ़ हो जाता है। यही वजह है कि निजी वित्तीय जानकारी और सरकारी दस्तावेज़ों के लिए SabTools सुरक्षित है।",
    },
    {
      q: "SabTools.in पर कितने टूल्स हैं?",
      a: `SabTools.in पर ${BRAND.totalTools}+ मुफ्त ऑनलाइन टूल्स ${BRAND.totalCategories} श्रेणियों में उपलब्ध हैं — फाइनेंस, टैक्स, PDF, इमेज, AI लेखन, हेल्थ, शिक्षा और बहुत कुछ। इनमें से ${BRAND.hindiTools}+ टूल्स हिंदी में भी उपलब्ध हैं — EMI, SIP, GST, इनकम टैक्स, BMI, उम्र कैलकुलेटर सहित। हर टूल भारतीय यूज़र्स के लिए विशेष रूप से बनाया गया है।`,
    },
    {
      q: "क्या यह मोबाइल फ़ोन पर काम करता है?",
      a: "हाँ। SabTools.in पूरी तरह मोबाइल-रिस्पॉन्सिव है — Android, iPhone, टैबलेट — सब पर बिना समस्या चलता है। बजट Android फ़ोन (2 GB RAM) पर भी पेज एक सेकंड में लोड होते हैं। आप साइट को PWA (Progressive Web App) के रूप में होम स्क्रीन पर इंस्टॉल भी कर सकते हैं — ऐप जैसा अनुभव बिना Play Store से डाउनलोड किए।",
    },
    {
      q: "क्या मुझे साइनअप या अकाउंट बनाना होगा?",
      a: "नहीं, बिल्कुल नहीं। SabTools.in पर कोई यूज़र-अकाउंट सिस्टम ही नहीं है। हम नाम, ईमेल, फ़ोन नंबर — कुछ भी नहीं माँगते। बस कोई भी टूल खोलिए और तुरंत इस्तेमाल कीजिए। न रजिस्ट्रेशन की झंझट, न पासवर्ड याद रखने का बोझ, न डेटा-लीक का जोखिम।",
    },
    {
      q: "क्या सभी टूल्स हिंदी में उपलब्ध हैं?",
      a: `हाँ, ${BRAND.hindiTools}+ टूल्स हिंदी में पूरी तरह उपलब्ध हैं — UI, हेल्पर टेक्स्ट, FAQs सब देवनागरी में। इसमें EMI कैलकुलेटर, GST कैलकुलेटर, इनकम टैक्स कैलकुलेटर, SIP कैलकुलेटर, BMI कैलकुलेटर शामिल हैं। हर पेज पर "View in English" लिंक है ताकि अंग्रेज़ी संस्करण देख सकें। आप किसी भी क्षण भाषा बदल सकते हैं।`,
    },
  ];

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
    // Hindi FAQPage — same @graph (no parallel <script>), inLanguage hi-IN
    // (Round 1 already plumbed inLanguage support into faqPageNode).
    // Phase 6 Round 2 Task C — closes the gap noted in Round 1 where the
    // English homepage had a 6-question FAQ but the Hindi homepage didn't.
    faqPageNode(hiFaqs, "hi-IN"),
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

      {/* Hindi homepage FAQ block — Phase 6 Round 2 Task C.
          Mirrors the English homepage FAQ structure but with Devanagari
          questions and answers. Same @graph FAQPage entity emitted above
          (no parallel <script>) so visible HTML and JSON-LD stay in sync. */}
      <section className="mt-16 max-w-3xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 text-center">
          अक्सर पूछे जाने वाले प्रश्न
        </h2>
        <p className="text-sm text-gray-500 text-center mb-8">
          आपके सबसे सामान्य सवालों के जवाब
        </p>
        <div className="space-y-3">
          {hiFaqs.map((faq) => (
            <details
              key={faq.q}
              className="group bg-white rounded-xl border border-gray-200 hover:border-orange-300 transition"
            >
              <summary className="cursor-pointer list-none p-5 flex items-start justify-between gap-4">
                <h3 className="font-semibold text-gray-900 text-base sm:text-lg">{faq.q}</h3>
                <svg
                  className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-5 pb-5 text-gray-700 text-sm sm:text-base leading-relaxed">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Reciprocal link to the Hindi-tools review hub. Phase 3 Round 2 —
          closes the loop initiated by /best/hindi-calculator-tools (which
          links here as its primary CTA). Inline within the existing footer
          CTA block rather than a new section, per Round 2 constraint. */}
      <div className="text-center mt-12 space-y-3">
        <p className="text-sm text-gray-500">
          <Link href="/best/hindi-calculator-tools" className="text-indigo-600 hover:text-indigo-800 underline font-medium">
            हिंदी कैलकुलेटर टूल्स की honest review पढ़ें →
          </Link>
        </p>
        <Link href="/" className="btn-secondary inline-block">
          View All Tools in English →
        </Link>
      </div>
    </div>
  );
}
