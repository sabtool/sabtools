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

const PAGE_URL = `${SITE_URL}/alternatives/to-indiatoolkit`;
const PAGE_TITLE = "India Toolkit Alternatives — 4 Tool Sites";
const PAGE_DESC =
  "India Toolkit alternatives ranked by use case — SabTools, Toolvala, UpTools, Calculator.net. Pick by use case, not catalog size.";

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
    bestFor: "Indian users who value depth-per-category, expert review, and Hindi support over raw catalog count",
    description: `SabTools publishes ${BRAND.totalTools}+ tools across ${BRAND.totalCategories} categories — fewer than India Toolkit's claimed 500+ but with substantially more depth per category. Each finance, tax, health, and tech category has a named domain expert who reviews the tools (CFP for finance, doctor for health, engineer for math/dev). The published tool count is enforced by a build-time invariant that fails the deploy if the actual catalog drifts below the floor — preventing the marketing-vs-reality drift that plagues uncurated tool catalogs. ${BRAND.hindiTools}+ tools have full Hindi UI at /hi. Calculator pages load in under one second on 4G with no third-party scripts. Where SabTools loses to India Toolkit: niche generators and one-off long-tail utilities that aren't part of any normal Indian use case.`,
  },
  {
    rank: 2,
    name: "Toolvala.in",
    url: "https://www.toolvala.in/",
    internal: false,
    bestFor: "TET (Teacher Eligibility Test) preparation and a smaller, easier-to-scan catalog",
    description: "Toolvala is a 100+ tool platform with an unusual focus on TET (Teacher Eligibility Test) preparation utilities — practice tools, reference calculators, and study aids that none of the other alternatives match. The catalog is small enough that first-time visitors don't get lost; categories are narrow but well-organized. Toolvala also has baby-and-family tools and household expiry-date trackers as niche mini-suites. The trade-off is depth: outside its core specialties, Toolvala's calculators are functional but don't go as deep as SabTools' finance/tax tools or as broad as India Toolkit's generator catalog. For TET prep specifically, Toolvala wins; for everything else, it's a complement rather than a primary destination.",
  },
  {
    rank: 3,
    name: "UpTools.in",
    url: "https://www.uptools.in/",
    internal: false,
    bestFor: "Curated India-aware catalog with feature touches like GST rounding modes and PAN/IFSC validators",
    description: "UpTools is the most curated platform on this list — roughly 50 tools across 6-8 categories. The narrow scope shows in the polish: GST calculator with rounding-mode controls (bank-style, nearest-rupee) that matter for accounting reconciliation, standalone PAN and IFSC validators well-surfaced as dedicated pages, and consistent privacy-first messaging on every tool. UpTools also includes a small set of mini-games — useful for users who want a brain-break alongside the calculators. The weakness is scale: if the tool you need isn't in UpTools' ~50-tool set, you bounce off-site. No Hindi version. For users who value editorial discipline over catalog count, UpTools is genuinely strong.",
  },
  {
    rank: 4,
    name: "Calculator.net",
    url: "https://www.calculator.net/",
    internal: false,
    bestFor: "Non-India-context calculations — universal math, fitness, science, and global finance",
    description: "Calculator.net is the largest free calculator site by total catalog count — hundreds of calculators across math, finance, fitness, health, science, and conversion categories. The platform isn't India-tuned — finance calculators default to USD, tax calculators target the United States — but for category-agnostic computations (BMI, percentage, compound interest, scientific calculations), it's reliable and stable. Long domain history (since the 2010s), lightweight pages, no signup. Indian users typically reach for Calculator.net when they need a calculation outside Indian regulatory context — converting USD prices, computing imperial-unit measurements, or running statistical tests where Indian-tagged tools don't add value over generic ones.",
  },
];

const faqs = [
  {
    q: "Why look for alternatives to India Toolkit?",
    a: "India Toolkit advertises 500+ tools — the largest claimed catalog among India-focused platforms. Users typically look for alternatives when they want (a) deeper expert-reviewed content per category, (b) better Hindi support, (c) a smaller curated catalog that's easier to scan, or (d) a different category emphasis like TET prep or scientific calculations. Each alternative on this list serves one of these needs better.",
  },
  {
    q: "Which is the best free alternative to India Toolkit?",
    a: `For most Indian users — depth on finance, tax, PDF, image, and Hindi work — SabTools.in is the broadest expert-reviewed alternative. Toolvala wins for TET prep specifically. UpTools wins for editorial curation and feature polish on a smaller catalog. Calculator.net wins for non-Indian-context calculations.`,
  },
  {
    q: "Is catalog size the right thing to compare?",
    a: "Not on its own. India Toolkit's 500+ claim is real but includes many low-effort utilities (text generators, simple converters) that you'd reach for once and forget about. SabTools' smaller catalog has higher depth per tool — calculators reviewed by domain experts, India-specific tax-rate updates within days of Budget announcements, and a build-time invariant that prevents the published count from drifting. Depth matters more than count for tools you'll use repeatedly.",
  },
  {
    q: "Where does India Toolkit still win?",
    a: "Niche utility coverage. If your need is a one-off random-name generator, a specific image-meme template, an obscure code-snippet helper, or a decorative-text generator that mainstream platforms don't publish, India Toolkit's broader catalog increases your hit rate. For these specific niches, India Toolkit stays useful as a complementary bookmark.",
  },
  {
    q: "Are these alternatives all free?",
    a: "Yes. SabTools, Toolvala, UpTools, and Calculator.net are all 100% free with no premium tiers, no signup, and no per-calculation charges. All four fund through display ads.",
  },
  {
    q: "Which has the best Hindi catalog?",
    a: `SabTools, by a wide margin. ${BRAND.hindiTools}+ tools at /hi cover EMI, GST, income tax, SIP, BMI, age, and more — full Devanagari UI. India Toolkit's UI is primarily English; Toolvala has limited Hindi pages; UpTools and Calculator.net are English-only.`,
  },
  {
    q: "Are these platforms safe for sensitive Indian documents?",
    a: "SabTools and UpTools both run client-side for calculator and PDF operations — files and inputs never leave your browser. Verify per-tool on Toolvala, India Toolkit, and Calculator.net before uploading sensitive docs (Aadhaar, PAN, salary slips). As a rule, look for explicit \"runs in your browser\" indicators on the specific tool's page.",
  },
  {
    q: "Should I use multiple platforms?",
    a: "Yes — that's the honest answer. Each platform has a distinct strength: SabTools for depth and Hindi, Toolvala for TET, UpTools for curation, Calculator.net for non-Indian context, India Toolkit for niche generators. Cost is zero on all of them; bookmarking three or four costs nothing.",
  },
];

export default function IndiaToolkitAlternatives() {
  const graph = buildGraph([
    breadcrumbNode([
      { name: "Home", url: `${SITE_URL}/` },
      { name: "Alternatives", url: `${SITE_URL}/alternatives` },
      { name: "Alternatives to India Toolkit" },
    ]),
    {
      "@type": "ItemList",
      "@id": `${PAGE_URL}#itemlist`,
      name: "Alternatives to India Toolkit for Indian Users 2026",
      description:
        "Four free India Toolkit alternatives ranked by Indian use case — depth per category, TET prep, curated catalog, and international scope.",
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
          { label: "Alternatives to India Toolkit" },
        ]}
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />

      <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3 mt-2">
        India Toolkit Alternatives — 4 Free Tool Sites
      </h1>
      <p className="text-sm text-gray-500 mb-8">
        Last updated: {BUILD_MONTH_YEAR} · ~6 minutes to read
      </p>

      <div className="prose prose-gray max-w-none space-y-5">
        <p className="text-lg text-gray-700">
          IndiaToolkit.in advertises 500+ free tools — the largest claimed
          catalog among India-focused platforms. Users typically look for
          alternatives when they want depth-per-category over raw count,
          better Hindi coverage, expert-reviewed content, or a smaller and
          more curated experience. We compared four free alternatives,
          each strong for a specific use case. SabTools is on the list
          because we publish it; we're explicit about where the others
          beat us.
        </p>

        <h2>Quick recommendations by use case</h2>
        <ul>
          <li>
            <strong>Daily depth-per-category, Hindi support, expert review</strong>{" "}
            → SabTools.in.
          </li>
          <li>
            <strong>TET (Teacher Eligibility Test) prep, smaller curated catalog</strong>{" "}
            → Toolvala.in.
          </li>
          <li>
            <strong>Editorial polish, GST rounding modes, PAN/IFSC validators</strong>{" "}
            → UpTools.in.
          </li>
          <li>
            <strong>Non-India-context math, fitness, science calculations</strong>{" "}
            → Calculator.net.
          </li>
        </ul>

        <h2>The full ranking</h2>
        <p>
          Each alternative gets a neutral 100-150 word description below.
          Ranking reflects breadth-of-fit for typical India Toolkit users
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
                <th className="text-left p-3 font-semibold text-gray-700">Depth/category</th>
                <th className="text-left p-3 font-semibold text-gray-700">Hindi UI</th>
                <th className="text-left p-3 font-semibold text-gray-700">Expert review</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr><td className="p-3 font-medium">SabTools.in</td><td className="p-3">{BRAND.totalTools}+</td><td className="p-3">High</td><td className="p-3">{BRAND.hindiTools}+ tools</td><td className="p-3">Per-category expert</td></tr>
              <tr><td className="p-3 font-medium">Toolvala.in</td><td className="p-3">100+</td><td className="p-3">Medium (TET strong)</td><td className="p-3">Limited</td><td className="p-3">Generic editorial</td></tr>
              <tr><td className="p-3 font-medium">UpTools.in</td><td className="p-3">~50</td><td className="p-3">High (curated)</td><td className="p-3">No</td><td className="p-3">Generic editorial</td></tr>
              <tr><td className="p-3 font-medium">Calculator.net</td><td className="p-3">~500+</td><td className="p-3">High (universal)</td><td className="p-3">No</td><td className="p-3">Generic editorial</td></tr>
            </tbody>
          </table>
        </div>

        <h2>How to pick</h2>
        <p>
          The category you reach for most should drive the choice. For{" "}
          <Link href="/category/finance">finance</Link>,{" "}
          <Link href="/category/tax">tax</Link>,{" "}
          <Link href="/tools/compress-pdf">PDF</Link>, or anything in
          Hindi — SabTools' depth and Hindi catalog wins. For TET prep,
          Toolvala. For polished GST/PAN/IFSC use, UpTools. For
          non-India-context calculations, Calculator.net. For one-off
          niche utilities not in mainstream catalogs, India Toolkit
          itself remains useful.
        </p>

        <p>
          Most thorough Indian users end up with two or three platforms
          bookmarked. Cost is zero on all of them, and there is no single
          "best" — there are right tools for specific tasks.
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
          <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition">
            Browse SabTools' full catalog →
          </Link>
        </p>
      </div>
    </div>
  );
}
