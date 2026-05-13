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

const PAGE_URL = `${SITE_URL}/alternatives/to-cleartax-calculators`;
const PAGE_TITLE = "ClearTax Calculator Alternatives 2026";
const PAGE_DESC =
  "5 ClearTax calculator alternatives — SabTools, Tax2Win, the IT Dept official portal, BankBazaar, HDFC Life. Pick by use case, not brand recall.";

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
    url: `${SITE_URL}/category/tax`,
    internal: true,
    bestFor: "Fast scenario modeling — old vs new regime side-by-side, EMI variants, capital gains, HRA, NPS — without sales-funnel friction",
    description: `SabTools' tax calculator catalog is purpose-built for the calculation step itself: side-by-side old vs new regime comparison on a single screen, FY 2025-26 / AY 2026-27 slabs pre-loaded, all common deductions (80C, 80D, 24B, HRA, 80CCD(1B)) as pre-built input fields, and post-Budget-2024 LTCG 12.5% rates in the capital-gains tool. Pages load in under one second on 4G because there are no third-party scripts on calculator pages. The honest weakness vs ClearTax: SabTools doesn't file ITR — for actual return submission you go to ClearTax (or the official portal). For the calculation phase though, SabTools is meaningfully faster and broader; the ${BRAND.hindiTools}+ Hindi catalog at /hi adds coverage ClearTax doesn't have.`,
  },
  {
    rank: 2,
    name: "Tax2Win",
    url: "https://tax2win.in/tax-calculator",
    internal: false,
    bestFor: "DIY filers who want a calculator with assisted-filing as a fallback if the calculation reveals complexity",
    description: "Tax2Win is the closest to ClearTax in business model — calculator front-end with paid assisted-filing services behind it. The calculator UI is clean and modern; the strongest differentiator is a tax-saving recommendations engine that suggests deductions you may have missed (e.g., \"you've used ₹1.2L of your ₹1.5L 80C limit — consider topping up via PPF\"). Assisted filing tiers are typically lower-cost than ClearTax's. The trade-off: less authoritative content depth than ClearTax (which has more CA-authored explanatory articles), and a smaller tax-services brand presence. For users who want an alternative to ClearTax's ecosystem without losing the calculator → assisted-filing pipeline, Tax2Win is the natural switch.",
  },
  {
    rank: 3,
    name: "Income Tax Department Official Calculator",
    url: "https://incometaxindia.gov.in/Pages/tools/tax-calculator.aspx",
    internal: false,
    bestFor: "The authoritative reference — these slab tables and surcharge tiers ARE the law, not an interpretation",
    description: "The Income Tax Department's own calculator is the canonical source-of-truth for slab rates, surcharges, and rebates. When private platforms like ClearTax, Tax2Win, or SabTools publish tax content, they're implementing the rules this calculator embodies. Updates within days of Budget announcements (faster than most private platforms). No ads, no signup, no upsell. The trade-offs are interface and feature gaps: the UI is dated (built around 2010s government-portal design), the calculator is single-regime per session (no side-by-side comparison), and common implicit deductions like HRA aren't surfaced as input fields. Use this when you need to verify a private-platform calculator's slab figures, or for a no-friction reference computation.",
  },
  {
    rank: 4,
    name: "BankBazaar Income Tax Calculator",
    url: "https://www.bankbazaar.com/tax-calculator.html",
    internal: false,
    bestFor: "Borrowers modeling EMI + Section 24B home-loan-interest deduction together",
    description: "BankBazaar's tax calculator is integrated with their broader loan-comparison product. The differentiator is cross-linking — calculate your tax, then jump to their loan-comparison page to see how home-loan interest deduction (Section 24B, ₹2 lakh cap on self-occupied property) reshapes your effective tax. Strong if you're a first-time home-buyer modeling \"how much loan can I afford\" alongside \"how much tax will I save\". The trade-off: BankBazaar is a lead-capture funnel — every CTA pushes you toward applying for a loan or credit card. Calculator output is shallower than SabTools or ClearTax. For pure tax modeling, this is over-monetized; for combined loan + tax modeling, it's well-suited.",
  },
  {
    rank: 5,
    name: "HDFC Life Tax Calculator",
    url: "https://www.hdfclife.com/financial-tools-calculators/income-tax-calculator",
    internal: false,
    bestFor: "Users modeling tax saved through HDFC Life insurance products specifically",
    description: "HDFC Life's tax calculator is sales-led — pre-fills assumptions based on HDFC Life's term insurance, ULIP, and traditional plans. The strongest use case is when you're already considering HDFC Life products and want to model the Section 80C deduction impact on overall tax. Trusted financial-services brand, clean UI, no signup for the calculator itself. The honest issue: every CTA is \"buy a HDFC Life policy\" — for users not interested in the insurance side, the calculator content feels lead-capture rather than informational. ClearTax's authored content is meaningfully better for general tax planning. Use this only if HDFC Life products are part of your specific decision.",
  },
];

const faqs = [
  {
    q: "Why look for alternatives to ClearTax calculators?",
    a: "ClearTax is the most-cited Indian tax-services brand and its calculators are excellent for what they're designed to do — feed into the ClearTax filing flow. Users typically look for alternatives when they want (a) faster calculator pages without the sales-funnel weight, (b) side-by-side regime comparison on a single screen, (c) Hindi support, (d) authoritative slab data straight from the source, or (e) a different filing-services provider.",
  },
  {
    q: "Which is the best free alternative to ClearTax for tax calculation?",
    a: "For the calculation step alone, SabTools.in is the fastest with side-by-side old vs new regime comparison and a Hindi version available. For the calculator + assisted-filing combo, Tax2Win is the closest direct competitor. For the authoritative slab-rate reference, the Income Tax Department's official calculator. Each wins for a different stage of the workflow.",
  },
  {
    q: "Can these alternatives file ITR like ClearTax does?",
    a: "Tax2Win can — it has a paid e-filing flow comparable to ClearTax. The Income Tax Department's official portal can — and is the canonical, free, authoritative submission channel. SabTools, BankBazaar, and HDFC Life don't file returns; they're calculator-only platforms. If filing is part of your need, narrow to Tax2Win or the official portal.",
  },
  {
    q: "Are these alternatives more accurate than ClearTax?",
    a: "Accuracy on standard salary income with common deductions is identical across all five — same formulas, same slab tables, same Section-by-Section logic. Differences appear at the edges: ESOP perquisites, foreign income, surcharge marginal-relief, capital-gains-with-indexation. ClearTax's CA-authored content is deeper for those edges; the official calculator is the legal reference. For routine cases, all are accurate; for unusual cases, layer multiple references and verify with a CA.",
  },
  {
    q: "Where does ClearTax still win?",
    a: "Two areas. (1) Full ITR e-filing — ClearTax handles ITR-1 through ITR-7 with a tiered pricing model and CA-assist add-on; SabTools, BankBazaar, and HDFC Life can't file. (2) Authored content depth — ClearTax's blog has CA-written explanations of edge cases (capital gains for inherited property, ESOP perquisites, foreign income for NRIs) that go deeper than tool-focused FAQs on other platforms.",
  },
  {
    q: "Are any of these in Hindi?",
    a: `SabTools publishes ${BRAND.hindiTools}+ tools in Hindi at /hi including the income tax calculator. The Income Tax Department's official portal has a Hindi version. ClearTax, Tax2Win, BankBazaar, and HDFC Life are primarily English at the calculator layer.`,
  },
  {
    q: "Cost?",
    a: "All five calculators are free. Where costs appear: ClearTax's ITR e-filing has paid tiers (₹0 - ₹2,500+ depending on complexity); Tax2Win's assisted filing is paid; the Income Tax Department's portal is free for calculation and filing both. SabTools, BankBazaar, and HDFC Life's calculators are free without any paid layer behind them.",
  },
  {
    q: "Which is best for a salaried filer in FY 2025-26?",
    a: "For the calculation: SabTools (side-by-side regime comparison, fast, Hindi available). For the calculation + filing: Tax2Win or the Income Tax Department's official portal. For combined loan + tax modeling: BankBazaar. The right answer depends on whether you're at the modeling stage or the filing stage.",
  },
];

export default function ClearTaxAlternatives() {
  const graph = buildGraph([
    breadcrumbNode([
      { name: "Home", url: `${SITE_URL}/` },
      { name: "Alternatives", url: `${SITE_URL}/alternatives` },
      { name: "Alternatives to ClearTax Calculators" },
    ]),
    {
      "@type": "ItemList",
      "@id": `${PAGE_URL}#itemlist`,
      name: "Alternatives to ClearTax Calculators 2026",
      description:
        "Five free alternatives to ClearTax's calculator suite ranked by Indian tax workflow stage — calculation, comparison, authoritative reference, and combined loan/tax modeling.",
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
          { label: "Alternatives to ClearTax Calculators" },
        ]}
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />

      <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3 mt-2">
        ClearTax Calculator Alternatives — 5 Free Options
      </h1>
      <p className="text-sm text-gray-500 mb-8">
        Last updated: {BUILD_MONTH_YEAR} · ~7 minutes to read
      </p>

      <div className="prose prose-gray max-w-none space-y-5">
        <p className="text-lg text-gray-700">
          ClearTax's free tax calculators are excellent for what they're
          designed to do — pre-qualify users for the ClearTax filing flow.
          Users look for alternatives when the calculation phase is the
          whole job (no filing handoff needed), when speed matters more
          than depth-of-content, when Hindi UI is required, or when a
          different filing-services provider is preferred. We compared
          five free alternatives, each strong for a specific stage of the
          Indian tax workflow.
        </p>

        <h2>Quick recommendations by use case</h2>
        <ul>
          <li>
            <strong>Fast scenario modeling (old vs new regime, multiple
            deduction toggles)</strong> →{" "}
            <Link href="/tools/income-tax-calculator">SabTools Income Tax Calculator</Link>.
          </li>
          <li>
            <strong>Calculator + assisted filing (ClearTax substitute)</strong>{" "}
            → Tax2Win.
          </li>
          <li>
            <strong>Authoritative slab reference</strong> → Income Tax
            Department's official calculator.
          </li>
          <li>
            <strong>Combined loan + tax modeling (Section 24B)</strong> →
            BankBazaar.
          </li>
          <li>
            <strong>HDFC Life policy purchase decision</strong> → HDFC
            Life Tax Calculator.
          </li>
        </ul>

        <h2>The full ranking</h2>
        <p>
          Each alternative gets a neutral 100-150 word description. The
          ranking reflects breadth-of-fit for typical ClearTax-calculator
          users; your specific use case may push one of the lower-ranked
          options to your personal #1.
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
                <th className="text-left p-3 font-semibold text-gray-700">Side-by-side regime</th>
                <th className="text-left p-3 font-semibold text-gray-700">E-files ITR</th>
                <th className="text-left p-3 font-semibold text-gray-700">Hindi UI</th>
                <th className="text-left p-3 font-semibold text-gray-700">Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr><td className="p-3 font-medium">SabTools.in</td><td className="p-3">Yes</td><td className="p-3">No</td><td className="p-3">{BRAND.hindiTools}+ tools</td><td className="p-3">Free</td></tr>
              <tr><td className="p-3 font-medium">Tax2Win</td><td className="p-3">Partial</td><td className="p-3">Yes (paid)</td><td className="p-3">Limited</td><td className="p-3">Free calc; paid filing</td></tr>
              <tr><td className="p-3 font-medium">IT Dept Official</td><td className="p-3">No</td><td className="p-3">Yes (free)</td><td className="p-3">Yes</td><td className="p-3">Free</td></tr>
              <tr><td className="p-3 font-medium">BankBazaar</td><td className="p-3">Partial</td><td className="p-3">No</td><td className="p-3">Limited</td><td className="p-3">Free</td></tr>
              <tr><td className="p-3 font-medium">HDFC Life</td><td className="p-3">No</td><td className="p-3">No</td><td className="p-3">Limited</td><td className="p-3">Free</td></tr>
            </tbody>
          </table>
        </div>

        <h2>How to pick</h2>
        <p>
          Map your need to the right stage of the Indian tax workflow.
          For modeling and decision-making (am I better off in the old or
          new regime? What's my LTCG hit on this property sale?) → use{" "}
          <Link href="/tools/income-tax-calculator">SabTools' calculator</Link>{" "}
          or the{" "}
          <Link href="/tools/capital-gains-tax-calculator">capital gains tool</Link>.
          For verification of slab tables → the Income Tax Department's
          official calculator. For filing your ITR → Tax2Win or the
          official portal. For combined loan + tax decisions → BankBazaar.
        </p>

        <p>
          ClearTax remains a strong option when you want one ecosystem for
          calculation, content, and filing. The alternatives on this list
          win when one of those three legs is more important than the
          other two for your specific workflow.
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
          <Link href="/best/free-income-tax-calculator-india" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition">
            Read our honest income tax calculator review →
          </Link>
        </p>
      </div>
    </div>
  );
}
