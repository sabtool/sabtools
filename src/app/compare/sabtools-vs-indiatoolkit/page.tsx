import { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import { BRAND } from "@/lib/brand";
import {
  SITE_URL,
  ORG_ID,
  WEBSITE_ID,
  SUPPORTED_LANGUAGES,
  BUILD_DATE,
  BUILD_MONTH_YEAR,
  breadcrumbNode,
  faqPageNode,
  buildGraph,
} from "@/lib/schema";

const PAGE_URL = `${SITE_URL}/compare/sabtools-vs-indiatoolkit`;
const PAGE_TITLE = "SabTools vs India Toolkit — 2026";
const PAGE_DESC =
  "SabTools.in vs IndiaToolkit.in: catalog claims, finance depth, Hindi support, expert review, and where each platform genuinely wins.";

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
    creator: "@Sabtoolsin",
    site: "@Sabtoolsin",
  },
};

const faqs = [
  {
    q: "What is the catalog size difference between SabTools and India Toolkit?",
    a: `SabTools.in publishes ${BRAND.totalTools}+ tools (verified by a build-time invariant against the canonical tools array). India Toolkit advertises 500+ tools on its homepage. Both numbers include adjacent utilities (text formatters, generators, simple calculators) — the comparison that matters is depth per category, not the total count.`,
  },
  {
    q: "Where does India Toolkit win over SabTools?",
    a: "Catalog breadth — India Toolkit's claimed 500+ tools includes some niche generators and converters SabTools doesn't currently publish (specific image-meme generators, certain code-snippet utilities, and a wider net of single-purpose text tools). If your need is a one-off niche utility, India Toolkit may have it when SabTools doesn't.",
  },
  {
    q: "Where does SabTools win?",
    a: `Finance and tax depth, Hindi catalog (${BRAND.hindiTools}+ tools at /hi), expert-reviewed content, and a build-time invariant guard that prevents the published tool count from drifting away from the actual catalog. Each tool category has a named domain expert (CFP for finance, doctor for health, engineer for math/dev). India Toolkit publishes tools without an equivalent byline-and-review system.`,
  },
  {
    q: "Are the calculations on India Toolkit accurate?",
    a: "For routine calculations (EMI, basic GST, simple interest), yes — the underlying formulas are standard. We didn't find systemic errors in our tests. The risk of inaccuracy is highest at category edges: post-Budget tax-rate updates, GST cess on petroleum, surcharge calculations on incomes above ₹50 lakh. SabTools tracks these because each finance/tax calculator is reviewed by a CFP; verify with a CA on India Toolkit for unusual cases.",
  },
  {
    q: "Which one has better mobile experience?",
    a: "Both load reasonably fast on a mid-range Android over 4G. SabTools is statically generated with no third-party JavaScript on calculator pages, which keeps Time-to-Interactive low. India Toolkit's pages have slightly higher ad density and analytics weight. The difference is noticeable on 3G but not on 4G.",
  },
  {
    q: "Do either require signup?",
    a: "No. Both platforms publish a no-account, no-signup commitment. Every calculator on either site is accessible without registration.",
  },
  {
    q: "Is there a Hindi version on India Toolkit?",
    a: `Not at the catalog scale SabTools publishes. SabTools' Hindi catalog at /hi covers ${BRAND.hindiTools}+ tools with full Devanagari labels, helper text, and FAQs. India Toolkit's UI is primarily English at the time of writing.`,
  },
  {
    q: "Should I bookmark both?",
    a: "Most thorough Indian users bookmark several tool sites. SabTools for finance, tax, PDF, image, and Hindi — the broadest depth in those categories. India Toolkit when you need a specific niche utility neither SabTools nor mainstream sites publish. Cost: zero on either side.",
  },
];

export default function CompareSabtoolsVsIndiaToolkit() {
  const graph = buildGraph([
    {
      "@type": "Article",
      "@id": `${PAGE_URL}#article`,
      headline: "SabTools vs India Toolkit — 2026 Honest Comparison",
      description: PAGE_DESC,
      url: PAGE_URL,
      mainEntityOfPage: PAGE_URL,
      inLanguage: "en-IN",
      datePublished: "2026-05-08",
      dateModified: BUILD_DATE,
      author: { "@id": ORG_ID },
      publisher: { "@id": ORG_ID },
      isPartOf: { "@id": WEBSITE_ID },
      image: `${SITE_URL}/og-image.png`,
    },
    breadcrumbNode([
      { name: "Home", url: `${SITE_URL}/` },
      { name: "Compare", url: `${SITE_URL}/compare` },
      { name: "SabTools vs India Toolkit" },
    ]),
    faqPageNode(faqs, SUPPORTED_LANGUAGES[0]),
  ]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Compare", href: "/compare" },
          { label: "SabTools vs India Toolkit" },
        ]}
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />

      <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3 mt-2">
        SabTools vs India Toolkit — 2026 Comparison
      </h1>
      <p className="text-sm text-gray-500 mb-8">
        Last updated: {BUILD_MONTH_YEAR} · ~6 minutes to read
      </p>

      <div className="prose prose-gray max-w-none space-y-5">
        <p className="text-lg text-gray-700">
          SabTools.in and IndiaToolkit.in both market themselves as
          general-purpose free online tool platforms for Indian users. The
          headline difference is catalog size — India Toolkit advertises
          500+ tools, SabTools publishes {BRAND.totalTools}+. The deeper
          difference is editorial discipline: depth per category, expert
          review, Hindi coverage, and how the platforms communicate
          accuracy. We publish SabTools, so this comparison is biased by
          authorship — we have called out specific cases where India
          Toolkit genuinely wins.
        </p>

        <h2>The 30-second answer</h2>
        <ul>
          <li>
            <strong>Use SabTools</strong> for finance, tax, PDF, image,
            developer, and Hindi tools — depth per category and an
            expert-review system.
          </li>
          <li>
            <strong>Use India Toolkit</strong> when you need a niche utility
            (specific generator, converter, or single-purpose text tool)
            that SabTools doesn't publish.
          </li>
          <li>
            Both are free, both no-signup, both client-side for most
            operations.
          </li>
        </ul>

        <h2>Side-by-side</h2>
        <div className="not-prose overflow-x-auto rounded-2xl border border-gray-200 my-6">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3 font-semibold text-gray-700">Dimension</th>
                <th className="text-left p-3 font-semibold text-indigo-700">SabTools.in</th>
                <th className="text-left p-3 font-semibold text-gray-700">IndiaToolkit.in</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr><td className="p-3 font-medium">Tool catalog</td><td className="p-3">{BRAND.totalTools}+ (verified by build invariant)</td><td className="p-3">500+ (advertised)</td></tr>
              <tr><td className="p-3 font-medium">Categories</td><td className="p-3">{BRAND.totalCategories}</td><td className="p-3">15-20</td></tr>
              <tr><td className="p-3 font-medium">Hindi tools</td><td className="p-3">{BRAND.hindiTools}+ at /hi</td><td className="p-3">Limited</td></tr>
              <tr><td className="p-3 font-medium">Finance/tax depth</td><td className="p-3">Deep — old vs new regime, 80C/80D/24B/HRA, capital gains, NPS</td><td className="p-3">Standard calculators</td></tr>
              <tr><td className="p-3 font-medium">PDF tools</td><td className="p-3">Compress (KB-target), merge, split, image-to-PDF, page remover</td><td className="p-3">Basic compress, convert</td></tr>
              <tr><td className="p-3 font-medium">Niche generators</td><td className="p-3">Selective</td><td className="p-3">Wide assortment</td></tr>
              <tr><td className="p-3 font-medium">Expert review</td><td className="p-3">Per-category named domain expert</td><td className="p-3">Generic editorial</td></tr>
              <tr><td className="p-3 font-medium">Client-side processing</td><td className="p-3">Yes, all tools</td><td className="p-3">Yes, most tools</td></tr>
              <tr><td className="p-3 font-medium">Signup required</td><td className="p-3">No</td><td className="p-3">No</td></tr>
            </tbody>
          </table>
        </div>

        <h2>Where SabTools wins</h2>
        <ul>
          <li>
            <strong>Tax depth.</strong>{" "}
            <Link href="/tools/income-tax-calculator">Income tax with old vs new regime side-by-side</Link>,{" "}
            <Link href="/tools/capital-gains-tax-calculator">post-Budget-2024 LTCG calculator</Link>, HRA exemption
            under Section 10(13A),{" "}
            <Link href="/tools/nps-calculator">NPS with Section 80CCD(1B)</Link> deduction modeling. India Toolkit's
            calculators handle the basics; the edges (surcharge tiers,
            marginal relief, FY-specific changes) lag.
          </li>
          <li>
            <strong>Hindi catalog.</strong> {BRAND.hindiTools}+ tools at /hi
            with Devanagari UI. India Toolkit's interface is primarily
            English.
          </li>
          <li>
            <strong>Build-time invariant.</strong> SabTools' published
            "{BRAND.totalTools}+" claim is enforced by an assertion that
            fails the build if the tools array shrinks below the floor —
            preventing drift between the marketing number and the actual
            catalog.
          </li>
          <li>
            <strong>Expert reviewers.</strong> Each category has a named
            reviewer (visible on tool pages and in the about page). India
            Toolkit publishes anonymously.
          </li>
          <li>
            <strong>Honest review hub.</strong>{" "}
            <Link href="/best">/best</Link> publishes head-to-head
            comparisons of SabTools tools against external alternatives,
            including ones that beat us. This kind of self-critical
            editorial is a quality signal both Google and AI search engines
            reward.
          </li>
        </ul>

        <h2>Where India Toolkit wins</h2>
        <p>The honest competitive points where India Toolkit currently beats SabTools:</p>
        <ul>
          <li>
            <strong>Niche utility coverage.</strong> If you need a specific
            random-name generator, a particular code snippet utility, an
            obscure image-meme template, or a specific category of converter
            that isn't in mainstream tool catalogs, India Toolkit's broader
            net catches more of these. SabTools focuses depth on a
            narrower-but-more-Indian set.
          </li>
          <li>
            <strong>Single-purpose text tools.</strong> India Toolkit
            publishes more one-off text generators (case converters,
            decorative text, fancy fonts) than SabTools, which prioritizes
            text tools that map to an Indian work or study use case.
          </li>
          <li>
            <strong>"Long tail" of generators.</strong> If your search
            query is for a very specific tool name, India Toolkit's larger
            catalog has higher hit-rate by sheer volume.
          </li>
        </ul>

        <h2>Use-case matrix</h2>
        <ul>
          <li>
            <strong>EMI on a ₹50 lakh home loan</strong> → SabTools{" "}
            <Link href="/tools/emi-calculator">EMI Calculator</Link> (year-wise
            principal vs interest breakdown).
          </li>
          <li>
            <strong>FY 2025-26 income tax (old vs new)</strong> → SabTools{" "}
            <Link href="/tools/income-tax-calculator">Income Tax Calculator</Link>.
          </li>
          <li>
            <strong>Compress Aadhaar PDF under 100 KB</strong> → SabTools{" "}
            <Link href="/tools/compress-pdf">Compress PDF</Link> (KB-target).
          </li>
          <li>
            <strong>Calculator in Hindi</strong> →{" "}
            <Link href="/hi">SabTools Hindi catalog</Link>.
          </li>
          <li>
            <strong>Niche random-string generator or specific niche
            converter</strong> → Try India Toolkit first.
          </li>
        </ul>

        <h2>Pricing</h2>
        <p>
          Both platforms are 100% free. Both fund through display ads.
          Neither charges per file, per calculation, or per visit. There
          is no premium tier on either side. Cost is not a differentiator.
        </p>

        <h2>The honest bottom line</h2>
        <p>
          For Indian users with finance, tax, PDF, image, or Hindi-language
          needs — SabTools.in is the deeper, more curated, more
          expert-reviewed choice. For niche generators or one-off
          single-purpose utilities, India Toolkit's larger catalog
          sometimes has tools we don't. Bookmark both, use SabTools for
          most repeated tasks, and reach for India Toolkit when SabTools
          doesn't have what you need. The catalog-size difference is
          worth thinking about: 500+ vs {BRAND.totalTools}+ feels like a
          big gap, but the working calculators most Indians use daily —
          EMI, GST, income tax, BMI, age, percentage — exist on both
          platforms with comparable accuracy. The deeper differences are
          in coverage of edge cases (post-Budget tax updates, Section
          80CCD(1B), capital gains across asset classes) and in
          editorial discipline (named experts, build-time invariant
          guards, expert review). Both factors compound over months of
          use. If you are starting on the SabTools side and want to
          validate a calculator before trusting it,{" "}
          <Link href="/best">our review hub</Link> compares SabTools
          tools against external alternatives in five high-volume
          categories.
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
