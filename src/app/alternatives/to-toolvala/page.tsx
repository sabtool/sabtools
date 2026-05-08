import { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import { BRAND } from "@/lib/brand";
import {
  SITE_URL,
  SUPPORTED_LANGUAGES,
  BUILD_DATE,
  BUILD_MONTH_YEAR,
  breadcrumbNode,
  faqPageNode,
  buildGraph,
} from "@/lib/schema";

const PAGE_URL = `${SITE_URL}/alternatives/to-toolvala`;
const PAGE_TITLE = "Toolvala Alternatives — 4 Free Tool Sites";
const PAGE_DESC =
  "4 honest Toolvala.in alternatives ranked by use case — SabTools, UpTools, Calculator.net, and India Toolkit. Where each platform genuinely wins for Indian users.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESC,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESC,
    url: PAGE_URL,
    type: "article",
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

type Alt = {
  rank: number;
  name: string;
  url: string;
  internal: boolean;
  bestFor: string;
  description: string;
};

const alternatives: Alt[] = [
  {
    rank: 1,
    name: "SabTools.in",
    url: `${SITE_URL}/`,
    internal: true,
    bestFor: "Indian users wanting deep finance, tax, PDF, image, and Hindi tools in one place",
    description: `SabTools is the broadest India-focused free tools platform with ${BRAND.totalTools}+ tools across ${BRAND.totalCategories} categories. Where Toolvala publishes ~100 tools with a teacher-prep angle, SabTools goes deeper on finance (EMI variants, capital gains, HRA exemption, NPS), maintains a Hindi catalog of ${BRAND.hindiTools}+ tools at /hi, and runs every calculator client-side with no signup. Each category has a named domain expert (CFP for finance, doctor for health, engineer for math/dev). Pages load in under one second on 4G because there are no third-party scripts on calculator pages. The honest weakness vs Toolvala: smaller TET (Teacher Eligibility Test) coverage. For everything except teacher-recruitment exam prep, SabTools has more depth.`,
  },
  {
    rank: 2,
    name: "UpTools.in",
    url: "https://www.uptools.in/",
    internal: false,
    bestFor: "Users wanting a smaller, sharply focused India-aware catalog with feature touches like GST rounding modes",
    description: "UpTools is a smaller curated platform — calculators, converters, formatters, and a small set of mini-games. The catalog is roughly 50 tools across 6-8 categories, which makes the site easier to scan than larger competitors. UpTools' GST calculator includes rounding-mode controls (bank-style, nearest-rupee) that matter for accounting reconciliation — a feature most platforms skip. Standalone PAN and IFSC validators are well-surfaced, and the privacy-first messaging is consistent across the site (every tool says client-side, no logging). The weaknesses are mostly catalog scale: if you need a calculator outside the ~50-tool set, you'll bounce off-site. No Hindi version at this time.",
  },
  {
    rank: 3,
    name: "Calculator.net",
    url: "https://www.calculator.net/",
    internal: false,
    bestFor: "International scope — math, finance, fitness, and science calculators not tied to Indian regulations",
    description: "Calculator.net is one of the most-trafficked free calculator sites globally, with hundreds of calculators across math, finance, fitness, health, science, and conversion categories. The platform isn't India-specific — its tax and finance calculators target the United States by default — but the universal calculators (compound interest, BMI, percentage, distance, temperature) work for any user. Long domain history (since the 2010s), stable URLs, lightweight pages, no signup. For Indian users who need a non-Indian-context calculation (US tax, USD currency conversion, imperial-unit math), Calculator.net is more reliable than India-tagged tools that may not handle non-Indian formats well.",
  },
  {
    rank: 4,
    name: "IndiaToolkit.in",
    url: "https://www.indiatoolkit.in/",
    internal: false,
    bestFor: "Niche generators and one-off utilities not in mainstream tool catalogs",
    description: "India Toolkit advertises 500+ tools — the largest claimed catalog among India-focused platforms. The advantage shows up at the long tail: niche random-string generators, specific image-meme utilities, certain code-snippet helpers, and decorative-text generators that more curated platforms don't publish. Where it falls short is depth per category: finance and tax calculators are functional but don't track the same India-specific edge cases (post-Budget tax updates, Section 80CCD(1B), GST cess on petroleum) that SabTools' expert-reviewed calculators handle. For one-off niche utility hunts, India Toolkit's broader net is useful; for daily finance/tax work, the depth gap matters.",
  },
];

const faqs = [
  {
    q: "Why look for alternatives to Toolvala?",
    a: "Toolvala is a legitimate Indian tool platform with 100+ tools and a strong TET (Teacher Eligibility Test) focus. Users typically look for alternatives when they need (a) a broader tool catalog, (b) deeper India-specific finance/tax depth, (c) Hindi support at scale, or (d) a different category emphasis like academic/scientific calculators. Each alternative on this list serves one of these needs better than Toolvala does.",
  },
  {
    q: "Which is the best free alternative to Toolvala?",
    a: `For most Indian users — especially those who want depth on finance, tax, PDF, image, and Hindi tools — SabTools.in is the broadest free alternative with ${BRAND.totalTools}+ tools across ${BRAND.totalCategories} categories. UpTools is the better choice if you specifically value a smaller curated catalog with privacy-first messaging.`,
  },
  {
    q: "Are these alternatives all free?",
    a: "Yes — every platform on this list is free, no premium tier, no signup required. SabTools, UpTools, India Toolkit, and Calculator.net all fund through display ads. None of them charge per file, per calculation, or per visit.",
  },
  {
    q: "Where does Toolvala still win?",
    a: "TET (Teacher Eligibility Test) preparation utilities — Toolvala has a dedicated section that none of these alternatives match. If your primary use case is TET, CTET, or state teacher-recruitment exam prep, stay with Toolvala for that workflow and use a complementary tool for finance/tax/PDF needs.",
  },
  {
    q: "Are these platforms safe for sensitive documents like Aadhaar?",
    a: "SabTools and UpTools both run PDF and calculator operations client-side — your file or input never leaves your browser. Calculator.net and India Toolkit handle most calculations client-side as well, but verify per-tool for PDF operations. As a rule, look for explicit \"runs in your browser\" notes before uploading sensitive Indian documents.",
  },
  {
    q: "Which has the best Hindi support?",
    a: `SabTools, by a wide margin. ${BRAND.hindiTools}+ tools have full Devanagari UI at /hi covering EMI, GST, income tax, SIP, BMI, age, and more. UpTools, India Toolkit, and Calculator.net are primarily English. Toolvala has limited Hindi coverage — single-tool Hindi pages here and there, no catalog-scale localization.`,
  },
  {
    q: "What about niche utilities Toolvala has — does any alternative match those?",
    a: "Toolvala's baby-and-family tools and expiry-date trackers are niche; SabTools handles these via separate generic tools rather than as a unified mini-suite. India Toolkit's broader catalog catches some adjacent utilities. For these specific niches, no alternative is a perfect 1:1 swap — Toolvala stays useful as a complementary bookmark.",
  },
  {
    q: "Should I use multiple platforms?",
    a: "Yes — most thorough Indian users do. SabTools as the daily-driver for finance/tax/PDF/Hindi, Toolvala when TET prep or its specific niche tools are needed, UpTools for GST rounding-mode work or PAN/IFSC validation, Calculator.net for non-India-context calculations. Cost is zero on all of them; bookmarking multiple platforms costs nothing.",
  },
];

export default function ToolvalaAlternatives() {
  const graph = buildGraph([
    breadcrumbNode([
      { name: "Home", url: `${SITE_URL}/` },
      { name: "Alternatives", url: `${SITE_URL}/alternatives` },
      { name: "Alternatives to Toolvala" },
    ]),
    {
      "@type": "ItemList",
      "@id": `${PAGE_URL}#itemlist`,
      name: "Alternatives to Toolvala for Indian Users 2026",
      description:
        "Four free Toolvala.in alternatives ranked by Indian use case — broadest catalog, smallest curated, international scope, and niche utility coverage.",
      numberOfItems: alternatives.length,
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      itemListElement: alternatives.map((a) => ({
        "@type": "ListItem",
        position: a.rank,
        name: a.name,
        url: a.url,
      })),
    },
    faqPageNode(faqs, SUPPORTED_LANGUAGES[0]),
  ]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Alternatives", href: "/alternatives" },
          { label: "Alternatives to Toolvala" },
        ]}
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />

      <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3 mt-2">
        Toolvala Alternatives — 4 Free Tool Sites Ranked
      </h1>
      <p className="text-sm text-gray-500 mb-8">
        Last updated: {BUILD_MONTH_YEAR} · ~6 minutes to read
      </p>

      <div className="prose prose-gray max-w-none space-y-5">
        <p className="text-lg text-gray-700">
          Toolvala.in is a legitimate Indian tool platform with 100+ tools
          and an unusual TET-prep focus. Users typically look for
          alternatives when they need broader catalog coverage, deeper
          India-specific finance/tax depth, Hindi support, or a different
          category emphasis. We compared four free alternatives — each
          wins for a specific use case. SabTools is on the list because
          we publish it; we're explicit about where the others beat us.
        </p>

        <h2>Quick recommendations by use case</h2>
        <ul>
          <li>
            <strong>Daily finance, tax, PDF, image, Hindi</strong> →
            SabTools.in (broadest catalog, deepest finance, Hindi support).
          </li>
          <li>
            <strong>Smaller, curated, GST rounding modes / PAN+IFSC validators</strong>{" "}
            → UpTools.in.
          </li>
          <li>
            <strong>International / non-Indian-context calculations</strong>{" "}
            → Calculator.net.
          </li>
          <li>
            <strong>Niche generators and long-tail utilities</strong> →
            IndiaToolkit.in.
          </li>
        </ul>

        <h2>The full ranking</h2>
        <p>
          Each alternative gets a neutral 100-150 word description below.
          Ranking reflects breadth-of-fit for typical Toolvala users
          looking to switch or supplement — your specific use case may
          push one of the lower-ranked options to your personal #1.
        </p>

        <div className="not-prose space-y-4 my-8">
          {alternatives.map((a) => (
            <article
              key={a.rank}
              className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6"
            >
              <div className="flex items-start gap-4">
                <span className="shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-bold">
                  {a.rank}
                </span>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {a.internal ? (
                      <Link href={a.url.replace(SITE_URL, "")} className="hover:text-indigo-700">
                        {a.name} →
                      </Link>
                    ) : (
                      <a href={a.url} target="_blank" rel="nofollow noopener noreferrer" className="hover:text-indigo-700">
                        {a.name} ↗
                      </a>
                    )}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    <span className="font-medium text-gray-700">Best for:</span> {a.bestFor}
                  </p>
                  <p className="text-gray-700 text-sm leading-relaxed">{a.description}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <h2>Comparison table</h2>
        <div className="not-prose overflow-x-auto rounded-2xl border border-gray-200 my-6">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3 font-semibold text-gray-700">Platform</th>
                <th className="text-left p-3 font-semibold text-gray-700">Catalog</th>
                <th className="text-left p-3 font-semibold text-gray-700">India focus</th>
                <th className="text-left p-3 font-semibold text-gray-700">Hindi UI</th>
                <th className="text-left p-3 font-semibold text-gray-700">Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr><td className="p-3 font-medium">SabTools.in</td><td className="p-3">{BRAND.totalTools}+</td><td className="p-3">Strong</td><td className="p-3">{BRAND.hindiTools}+ tools</td><td className="p-3">Free</td></tr>
              <tr><td className="p-3 font-medium">UpTools.in</td><td className="p-3">~50</td><td className="p-3">Strong</td><td className="p-3">No</td><td className="p-3">Free</td></tr>
              <tr><td className="p-3 font-medium">Calculator.net</td><td className="p-3">~500+</td><td className="p-3">Generic</td><td className="p-3">No</td><td className="p-3">Free</td></tr>
              <tr><td className="p-3 font-medium">IndiaToolkit.in</td><td className="p-3">500+ claimed</td><td className="p-3">Moderate</td><td className="p-3">Limited</td><td className="p-3">Free</td></tr>
            </tbody>
          </table>
        </div>

        <h2>How to pick from this list</h2>
        <p>
          Start by asking what category of tool you reach for most. If
          it's <Link href="/category/finance">finance</Link>,{" "}
          <Link href="/category/tax">tax</Link>, or{" "}
          <Link href="/tools/compress-pdf">PDF</Link>, SabTools' depth is
          the differentiator. If it's a one-off niche utility, India
          Toolkit's catalog scale is the differentiator. If it's casual
          calculators that don't need Indian context, Calculator.net's
          stability is the differentiator. If you value a small curated
          catalog with privacy-first messaging, UpTools is the
          differentiator.
        </p>

        <p>
          Most thorough users end up with two or three platforms
          bookmarked. There is no single "best" — there are right tools
          for specific tasks, and the cost of having multiple bookmarks
          is zero on all of them.
        </p>

        <h2>Frequently Asked Questions</h2>
        <div className="not-prose space-y-3">
          {faqs.map((faq) => (
            <details key={faq.q} className="group bg-white rounded-xl border border-gray-200 hover:border-indigo-300 transition">
              <summary className="cursor-pointer list-none p-5 flex items-start justify-between gap-4">
                <h3 className="font-semibold text-gray-900 text-base sm:text-lg">{faq.q}</h3>
                <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-5 pb-5 text-gray-700 text-sm sm:text-base leading-relaxed">{faq.a}</div>
            </details>
          ))}
        </div>

        <p className="not-prose mt-8">
          <Link href="/best" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition">
            Browse SabTools' honest review hub →
          </Link>
        </p>
      </div>
    </div>
  );
}
