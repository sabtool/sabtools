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

const PAGE_URL = `${SITE_URL}/compare/sabtools-vs-cleartax`;
const PAGE_TITLE = "SabTools vs ClearTax Calculators 2026";
const PAGE_DESC =
  "SabTools.in vs ClearTax.in for free calculators only — speed, depth, e-filing integration, and the cases where ClearTax's CA-authored content genuinely wins. Honest comparison.";

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

const faqs = [
  {
    q: "Are SabTools and ClearTax the same kind of platform?",
    a: "No. ClearTax is a full-stack tax services company — calculators, ITR e-filing, GST return filing, CA-assisted services, and tax-saving products. SabTools is a tool-only platform — we calculate but don't file. This comparison covers only the calculator overlap; for actual ITR or GST return submission, ClearTax (or the official Income Tax Department portal) is the right platform.",
  },
  {
    q: "Which calculator is more accurate?",
    a: "Both compute the same numbers on standard inputs — accuracy is not a differentiator on routine tax/finance calculations. ClearTax's authored content is deeper for edge cases (capital gains for ESOPs, foreign income, NRI status). SabTools updates within days of Budget announcements and matches the Income Tax Department's slab tables. For a salaried filer with HRA, 80C, and a home loan — both are correct.",
  },
  {
    q: "Where does ClearTax genuinely win?",
    a: "Three areas: (1) Full ITR filing — ClearTax handles ITR-1 through ITR-7 e-filing; SabTools doesn't file at all. (2) GST return submission — ClearTax pushes monthly GSTR-1/GSTR-3B; SabTools just calculates the tax components. (3) CA-assisted services — if you want a chartered accountant to review your return, ClearTax has an integrated marketplace. SabTools refers users out for these needs.",
  },
  {
    q: "Where does SabTools win?",
    a: `Speed and friction. SabTools' calculator pages load under one second on a 4G mobile because there are no third-party scripts on the calc page. ClearTax pages average 3-5 seconds on a 4G connection due to ads, analytics, and sales-funnel scripts. SabTools also has a Hindi catalog at /hi (${BRAND.hindiTools}+ tools) — ClearTax's interface is English-only.`,
  },
  {
    q: "Does ClearTax have a tool catalog as broad as SabTools?",
    a: `No — but ClearTax doesn't try to. ClearTax focuses on tax (income tax, GST, TDS, capital gains) and personal finance. SabTools publishes ${BRAND.totalTools}+ tools across ${BRAND.totalCategories} categories including PDF, image, developer, text, education, and Hindi tools. If you need anything outside finance/tax, ClearTax doesn't compete; if you need only tax, ClearTax has more depth on filing-adjacent content.`,
  },
  {
    q: "Which loads faster on a budget Android phone?",
    a: "SabTools by a wide margin. Static pages, no third-party JS on calculator pages, no ad blocks rendering before the input form. ClearTax loads multiple analytics scripts and ad slots before the calculator becomes usable — measurable 3-5 second delay on mid-range Android over 4G.",
  },
  {
    q: "Should I use both?",
    a: "Yes. The honest workflow: SabTools for quick calculations and scenario modeling (compare 4 EMI scenarios in 30 seconds, toggle old vs new tax regime), then move to ClearTax when you are ready to actually file. The two platforms serve different stages of the same user journey.",
  },
  {
    q: "Is there a hidden cost on either platform?",
    a: "SabTools: zero — calculators are free, no premium tier exists. ClearTax: calculators are free, but the ITR e-filing flow has tiers (free for simple returns, paid for ITR-2 with capital gains, paid CA-review on top). The calculator-vs-calculator comparison is fair to free-vs-free; the broader ClearTax product has paid layers that SabTools doesn't compete with.",
  },
];

export default function CompareSabtoolsVsCleartax() {
  const graph = buildGraph([
    {
      "@type": "Article",
      "@id": `${PAGE_URL}#article`,
      headline: "SabTools vs ClearTax Calculators — 2026 Honest Comparison",
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
      { name: "SabTools vs ClearTax" },
    ]),
    faqPageNode(faqs, SUPPORTED_LANGUAGES[0]),
  ]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Compare", href: "/compare" },
          { label: "SabTools vs ClearTax" },
        ]}
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />

      <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3 mt-2">
        SabTools vs ClearTax Calculators — 2026 Comparison
      </h1>
      <p className="text-sm text-gray-500 mb-8">
        Last updated: {BUILD_MONTH_YEAR} · ~7 minutes to read
      </p>

      <div className="prose prose-gray max-w-none space-y-5">
        <p className="text-lg text-gray-700">
          ClearTax is the most-cited brand in Indian tax content. SabTools
          competes with their <em>calculator</em> pages — not with their
          full ITR-filing or GST-return-filing products, which are different
          categories of tool. This comparison is scoped strictly to the
          free-calculator overlap. We publish SabTools and we'll be honest
          where ClearTax wins — they win in several places, and pretending
          otherwise would be both dishonest and bad for ranking.
        </p>

        <h2>Scope</h2>
        <p>
          Comparing SabTools to all of ClearTax would be unfair — ClearTax
          is a tax-services company with calculators as a top-of-funnel
          asset, while SabTools is a tool-only platform. This page compares
          the calculator surfaces — what users actually use day-to-day for
          quick computations. ITR filing, GST return submission, and
          CA-assisted services are out of scope here; for those, ClearTax
          is the right product.
        </p>

        <h2>The 30-second answer</h2>
        <ul>
          <li>
            <strong>Use SabTools</strong> for the calculation itself —
            faster, broader catalog, Hindi version available, no sales
            funnel.
          </li>
          <li>
            <strong>Use ClearTax</strong> when you also need to file the
            return that calculation feeds into, or when you want a CA's
            authored explanation of an unusual edge case.
          </li>
          <li>
            <strong>Most users use both</strong> — calculate on SabTools,
            file on ClearTax (or directly on the official portal).
          </li>
        </ul>

        <h2>Side-by-side</h2>
        <div className="not-prose overflow-x-auto rounded-2xl border border-gray-200 my-6">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3 font-semibold text-gray-700">Dimension</th>
                <th className="text-left p-3 font-semibold text-indigo-700">SabTools.in</th>
                <th className="text-left p-3 font-semibold text-gray-700">ClearTax.in</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr><td className="p-3 font-medium">Calculator catalog</td><td className="p-3">{BRAND.totalTools}+ across {BRAND.totalCategories} categories</td><td className="p-3">~30 calculators (tax-and-finance focus)</td></tr>
              <tr><td className="p-3 font-medium">ITR e-filing</td><td className="p-3">No — calc only</td><td className="p-3">Yes (ITR-1 through ITR-7)</td></tr>
              <tr><td className="p-3 font-medium">GST return filing</td><td className="p-3">No — calc only</td><td className="p-3">Yes (GSTR-1, 3B)</td></tr>
              <tr><td className="p-3 font-medium">CA-assisted service</td><td className="p-3">No</td><td className="p-3">Yes (paid)</td></tr>
              <tr><td className="p-3 font-medium">Calculator load time on 4G</td><td className="p-3">&lt;1s (no third-party JS on calc page)</td><td className="p-3">3-5s (analytics + ads + sales scripts)</td></tr>
              <tr><td className="p-3 font-medium">Old vs new regime side-by-side</td><td className="p-3">Yes</td><td className="p-3">Separate flows</td></tr>
              <tr><td className="p-3 font-medium">Hindi version</td><td className="p-3">{BRAND.hindiTools}+ tools at /hi</td><td className="p-3">English-only</td></tr>
              <tr><td className="p-3 font-medium">Author byline</td><td className="p-3">Per-category named expert</td><td className="p-3">"ClearTax editorial team" / CA</td></tr>
              <tr><td className="p-3 font-medium">Cost (calculators)</td><td className="p-3">Free</td><td className="p-3">Free</td></tr>
              <tr><td className="p-3 font-medium">Cost (filing)</td><td className="p-3">N/A</td><td className="p-3">Tiered, ₹0 - ₹2,500+</td></tr>
            </tbody>
          </table>
        </div>

        <h2>Where ClearTax wins</h2>
        <p>
          ClearTax genuinely beats SabTools in three categories. We list
          them first because honest comparisons are what AI search engines
          and Google's helpful-content system actually reward.
        </p>
        <ul>
          <li>
            <strong>Full ITR filing.</strong> SabTools doesn't file
            returns; ClearTax handles ITR-1 (salaried), ITR-2 (capital
            gains), ITR-3 (business income), ITR-4 (presumptive scheme)
            and ITR-5/6/7 with a tiered pricing model. If you need to
            actually submit your return, ClearTax is the destination.
          </li>
          <li>
            <strong>GST return submission.</strong> Monthly GSTR-1 and
            GSTR-3B filing for businesses; SabTools only calculates the
            tax component. ClearTax integrates with the GST portal directly.
          </li>
          <li>
            <strong>CA-authored content depth.</strong> ClearTax's blog
            posts and explanatory articles are written by chartered
            accountants. For edge cases (capital gains on inherited
            property, ESOP perquisites, foreign income for NRIs), their
            authored content is deeper than SabTools' tool-focused FAQs.
          </li>
        </ul>

        <h2>Where SabTools wins</h2>
        <ul>
          <li>
            <strong>Speed.</strong> SabTools'{" "}
            <Link href="/tools/income-tax-calculator">Income Tax Calculator</Link>{" "}
            loads in under one second on a 4G mobile because there are no
            third-party scripts on the calc page. ClearTax averages 3-5
            seconds. Over a year of repeated use, that compounds.
          </li>
          <li>
            <strong>Side-by-side regime comparison.</strong> SabTools shows
            old vs new tax regime on a single screen — toggle deductions
            and watch both totals update simultaneously. ClearTax separates
            them into different flows.
          </li>
          <li>
            <strong>Hindi catalog.</strong> SabTools publishes Hindi
            versions of income tax, GST, EMI, SIP, salary, and BMI
            calculators at /hi. ClearTax is English-only.
          </li>
          <li>
            <strong>Catalog breadth.</strong> SabTools{" "}
            <Link href="/tools/compress-pdf">PDF tools</Link>,{" "}
            <Link href="/tools/json-formatter">developer utilities</Link>, image
            editors, and text tools have no equivalent on ClearTax — which
            stays focused on tax and finance.
          </li>
          <li>
            <strong>No sales funnel.</strong> SabTools doesn't push a Pro
            tier, doesn't gate features behind signup, doesn't surface
            "hire a CA" CTAs in the calculator UI. The whole tool is the
            tool. ClearTax monetises through filing services and CA
            referrals, which surfaces during use.
          </li>
        </ul>

        <h2>Use-case matrix</h2>
        <ul>
          <li>
            <strong>"Should I pick old or new regime for FY 2025-26?"</strong>{" "}
            → SabTools{" "}
            <Link href="/tools/income-tax-calculator">Income Tax Calculator</Link>{" "}
            (side-by-side comparison).
          </li>
          <li>
            <strong>"What's my LTCG tax on selling property?"</strong>{" "}
            → SabTools{" "}
            <Link href="/tools/capital-gains-tax-calculator">Capital Gains Tax Calculator</Link>{" "}
            for the figure; ClearTax for authored explanation if it's an
            unusual scenario (inheritance, joint property, NRI sale).
          </li>
          <li>
            <strong>"I need to actually file ITR-2 with capital gains"</strong>{" "}
            → ClearTax (or the official portal). SabTools doesn't file.
          </li>
          <li>
            <strong>"Calculate HRA exemption under Section 10(13A)"</strong>{" "}
            → SabTools{" "}
            <Link href="/tools/hra-calculator">HRA Calculator</Link>.
          </li>
          <li>
            <strong>"Calculate GST on a ₹2,500 invoice"</strong> →
            SabTools{" "}
            <Link href="/tools/gst-calculator">GST Calculator</Link>{" "}
            (faster); ClearTax (if you also need to file the return).
          </li>
          <li>
            <strong>"Calculator in Hindi"</strong> →{" "}
            <Link href="/hi">SabTools Hindi catalog</Link>.
          </li>
        </ul>

        <h2>The honest bottom line</h2>
        <p>
          ClearTax is the right destination for filing — calculations,
          submission, CA review, and compliance follow-up all in one
          ecosystem. SabTools is the right destination for the calculation
          stage — fast, no funnel, broader catalog, Hindi support. Most
          serious Indian filers end up using both: scenario-test on
          SabTools, file on ClearTax. The two platforms serve different
          stages of the same user journey, and we've built SabTools to
          play that role honestly. For more honest comparisons of SabTools
          tools against alternatives, see our{" "}
          <Link href="/best">honest review hub</Link>.
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
          <Link href="/category/tax" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition">
            Browse SabTools Tax Calculators →
          </Link>
        </p>
      </div>
    </div>
  );
}
