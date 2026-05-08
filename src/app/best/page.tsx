import { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import { BRAND } from "@/lib/brand";
import {
  SITE_URL,
  BUILD_DATE,
  BUILD_MONTH_YEAR,
  breadcrumbNode,
  buildGraph,
  ORG_ID,
  WEBSITE_ID,
} from "@/lib/schema";

const PAGE_URL = `${SITE_URL}/best`;
// Page-level title is the bare phrase only — the layout's title.template
// (`%s | SabTools.in`) appends the brand suffix exactly once. Setting it
// here with " | SabTools.in" already included would render the suffix
// twice. Keep page-set portion ≤ 46 chars so the final rendered <title>
// stays ≤ 60 chars after the 14-char suffix is appended.
const PAGE_TITLE = "Best Free Online Tools in India (2026)";
const PAGE_DESC =
  "Honest review hub indexing best-of guides for free GST, EMI, income tax, PDF tools, and Hindi calculator platforms for Indian users.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESC,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESC,
    url: PAGE_URL,
    type: "website",
    locale: "en_IN",
    siteName: BRAND.name,
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: PAGE_TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESC,
    images: [`${SITE_URL}/og-image.png`],
    creator: "@sabtools",
    site: "@sabtools",
  },
};

type Listicle = {
  slug: string;
  title: string;
  blurb: string;
  icon: string;
};

const listicles: Listicle[] = [
  {
    slug: "free-gst-calculator-india",
    title: "Best Free GST Calculator in India",
    blurb:
      "Seven calculators tested side-by-side — SabTools, ClearTax, EasyCalculation, UpTools, Toolvala, India Toolkit, GSTGate. Honest call-outs of where ClearTax wins for filers.",
    icon: "🧾",
  },
  {
    slug: "free-emi-calculator-india",
    title: "Best Free EMI Calculator in India",
    blurb:
      "₹50L home loan and ₹6L car loan scenarios across SabTools, BankBazaar, ClearTax, HDFC Life, ET Money, Groww, Paisabazaar. BankBazaar wins for live bank-rate comparison.",
    icon: "🏦",
  },
  {
    slug: "free-pdf-tools-india",
    title: "Best Free PDF Tools for India",
    blurb:
      "Tested against Indian use cases — Aadhaar uploads under 100 KB, KVS application forms, college admission portals. SabTools, iLovePDF, Smallpdf, PDF24, Sejda compared.",
    icon: "📄",
  },
  {
    slug: "free-income-tax-calculator-india",
    title: "Best Free Income Tax Calculator in India",
    blurb:
      "Old vs new regime comparison for FY 2025-26 / AY 2026-27 across SabTools, ClearTax, the Income Tax Department official tool, Tax2Win, BankBazaar, HDFC Life, ET Money.",
    icon: "📋",
  },
  {
    slug: "hindi-calculator-tools",
    title: "Best Hindi Calculator Tools",
    blurb: `Where Hindi calculator coverage actually exists — SabTools' ${BRAND.hindiTools}+ Hindi catalog, Google Search Hindi widgets, government Hindi portals, and dedicated single-purpose tools.`,
    icon: "🇮🇳",
  },
];

export default function BestHubIndex() {
  // CollectionPage anchors the hub identity, BreadcrumbList orients
  // crawlers, ItemList enumerates the 5 child guides by URL so Google
  // can surface this hub as a parent in rich-result groupings. All
  // entities merge into one @graph (constraint #2 — no fighting
  // <script> blocks). Org + WebSite are referenced by @id only since
  // both are mounted globally in src/app/layout.tsx.
  const graph = buildGraph([
    {
      "@type": "CollectionPage",
      "@id": `${PAGE_URL}#collectionpage`,
      url: PAGE_URL,
      name: PAGE_TITLE,
      description: PAGE_DESC,
      inLanguage: "en-IN",
      isPartOf: { "@id": WEBSITE_ID },
      publisher: { "@id": ORG_ID },
      dateModified: BUILD_DATE,
      mainEntity: { "@id": `${PAGE_URL}#itemlist` },
    },
    breadcrumbNode([
      { name: "Home", url: `${SITE_URL}/` },
      { name: "Best of" },
    ]),
    {
      "@type": "ItemList",
      "@id": `${PAGE_URL}#itemlist`,
      name: "Best-of Guides on SabTools.in",
      description:
        "Comprehensive review hub indexing the five best-of guides published on SabTools.in.",
      numberOfItems: listicles.length,
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      itemListElement: listicles.map((l, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: l.title,
        url: `${PAGE_URL}/${l.slug}`,
      })),
    },
    // FAQPage intentionally omitted — this hub doesn't have a FAQ block
    // (it routes to children that each have their own 8-Q&A FAQPage).
  ]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Best of" },
        ]}
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />

      <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3 mt-2">
        Best Free Online Tools in India — Honest Guides
      </h1>
      <p className="text-sm text-gray-500 mb-8">
        Last updated: {BUILD_MONTH_YEAR}
      </p>

      <div className="prose prose-gray max-w-none">
        <p className="text-lg text-gray-700">
          These guides compare the most-used free online tools available to
          Indian users — across GST, EMI, income tax, PDF, and Hindi
          calculator categories. Each guide is structured the same way: we
          test the same scenarios across 7 tools, weight them on speed,
          feature depth, mobile experience, and friction, and then rank them.
          SabTools tools appear because we publish them, but every guide
          explicitly calls out cases where a competitor — ClearTax for tax
          filers, BankBazaar for live bank-rate comparison, Sejda for PDF
          editing, the Income Tax Department for the legal slab reference —
          is the better choice. Biased "we win everything" comparisons get
          down-weighted by both Google's helpful-content system and AI
          search engines, and they fail readers. So we don't write them.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {listicles.map((l) => (
          <Link
            key={l.slug}
            href={`/best/${l.slug}`}
            className="group block bg-white rounded-2xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition p-5 sm:p-6"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-2xl group-hover:bg-indigo-100 transition shrink-0">
                {l.icon}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-indigo-700 transition mb-1.5">
                  {l.title}
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">
                  {l.blurb}
                </p>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 group-hover:text-indigo-800">
                  Read review →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-12 prose prose-gray max-w-none">
        <h2>How we test</h2>
        <p>
          Every guide follows the same protocol: 2-3 real Indian scenarios
          per category (e.g., a ₹2,500 inclusive GST invoice; a ₹50 lakh
          home loan at 8.75%; an Aadhaar PDF compression under 100 KB) run
          on a 4G connection on a mid-range Android phone, then weighted on
          speed (40%), feature depth (30%), mobile experience (20%), and
          signup/sales-funnel friction (10%).
        </p>

        <h2>Why these categories</h2>
        <p>
          GST, EMI, income tax, PDF, and Hindi calculators are the top five
          search categories by volume from Indian users on{" "}
          <Link href="/">SabTools.in</Link>. We will add new guides as new
          high-volume categories emerge.
        </p>
      </div>

      <div className="mt-12 bg-gradient-to-br from-indigo-50 via-white to-purple-50/50 border border-indigo-100 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-2">
          Looking for a specific tool?
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Browse the full SabTools catalogue of {BRAND.totalTools}+ free
          tools across {BRAND.totalCategories} categories — calculators,
          converters, PDF utilities, image editors, AI writing tools, and
          more.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-sm hover:shadow-md transition"
        >
          Browse all SabTools →
        </Link>
      </div>
    </div>
  );
}
