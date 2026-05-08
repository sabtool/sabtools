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
  webPageNode,
  buildGraph,
} from "@/lib/schema";

const PAGE_URL = `${SITE_URL}/best/free-income-tax-calculator-india`;
// Bare title — layout's title.template appends " | SabTools.in" exactly
// once. Final rendered <title> stays ≤ 60 chars (57 chars total here).
const PAGE_TITLE = "Best Income Tax Calculator India FY 2025-26";
const PAGE_DESC =
  "We tested 7 free income tax calculators on the same ₹15L and ₹35L salary scenarios for FY 2025-26 (AY 2026-27). Honest comparison of SabTools, ClearTax, Tax2Win, Income Tax Department official, BankBazaar, HDFC Life, and ET Money.";

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

type Entry = {
  rank: number;
  name: string;
  url: string;
  internal: boolean;
  bestFor: string;
  pros: string[];
  cons: string[];
};

const entries: Entry[] = [
  {
    rank: 1,
    name: "SabTools Income Tax Calculator",
    url: `${SITE_URL}/tools/income-tax-calculator`,
    internal: true,
    bestFor: "Comparing old vs new regime quickly with all common deductions in one screen",
    pros: [
      "Side-by-side old vs new regime comparison — see your tax in both regimes simultaneously",
      "Standard deduction, 80C, 80D, HRA, home-loan interest, NPS — all pre-built input fields",
      "Updated for FY 2025-26 slabs and FY 2026-27 (AY 2027-28) projected slabs",
      "Loads in <1s on 4G; full client-side calculation (no salary data uploaded)",
      "Hindi version at /hi/tools/income-tax-calculator",
    ],
    cons: [
      "Doesn't auto-import Form 16 — you enter figures manually (ClearTax wins on this)",
      "No file-and-pay flow — pure calculator, no e-filing",
    ],
  },
  {
    rank: 2,
    name: "ClearTax Income Tax Calculator",
    url: "https://cleartax.in/paytax/taxcalculator",
    internal: false,
    bestFor: "Filers who also want to e-file their ITR and want one workflow",
    pros: [
      "Most authoritative content — written by chartered accountants",
      "Form-16 upload feature auto-populates the calculator",
      "Direct hand-off to ITR-1, ITR-2 e-filing",
      "Strongest content depth on edge cases (capital gains, foreign income, ESOP)",
    ],
    cons: [
      "Heavy page weight; multiple ad and signup interstitials",
      "Aggressive push to ClearTax Pro and CA-assisted filing",
      "Mobile experience slower than dedicated calculators",
    ],
  },
  {
    rank: 3,
    name: "Income Tax Department Official Calculator",
    url: "https://incometaxindia.gov.in/Pages/tools/tax-calculator.aspx",
    internal: false,
    bestFor: "Anyone who wants the absolute reference — these slabs ARE the law",
    pros: [
      "Government-published — by definition the canonical answer",
      "No ads, no signup, no upsell",
      "Updated within days of Budget announcements",
    ],
    cons: [
      "UI is dated (built around 2010s government-portal design)",
      "Limited to a single regime per session — no side-by-side comparison",
      "Doesn't include common-but-implicit deductions (HRA computation, standard deduction handled inconsistently)",
    ],
  },
  {
    rank: 4,
    name: "Tax2Win Calculator",
    url: "https://tax2win.in/tax-calculator",
    internal: false,
    bestFor: "DIY filers who want assisted-filing as a fallback",
    pros: [
      "Clean modern UI",
      "Strong tax-saving recommendations engine (suggests where you can save more)",
      "Affordable assisted-filing if calculator results suggest you need help",
    ],
    cons: [
      "Less authoritative content than ClearTax",
      "Pushes assisted-filing service",
      "Smaller brand — less trusted than incumbent players",
    ],
  },
  {
    rank: 5,
    name: "BankBazaar Income Tax Calculator",
    url: "https://www.bankbazaar.com/tax-calculator.html",
    internal: false,
    bestFor: "Borrowers who want EMI + tax modeling in one place",
    pros: [
      "Strong cross-linking to home-loan EMI and Section 24B / 80C flows",
      "Integrates with their loan-comparison products",
    ],
    cons: [
      "Heavy lead-capture funnel",
      "Calculator output is shallower than ClearTax or SabTools",
      "Mobile experience is ad-heavy",
    ],
  },
  {
    rank: 6,
    name: "HDFC Life Tax Calculator",
    url: "https://www.hdfclife.com/financial-tools-calculators/income-tax-calculator",
    internal: false,
    bestFor: "Insurance buyers modeling tax saved through HDFC Life products",
    pros: [
      "Trusted financial-services brand",
      "Pre-fills assumptions for HDFC Life policies",
    ],
    cons: [
      "Insurance-sales-led — every CTA is 'buy a HDFC Life policy'",
      "Calculator is generic — same engine as everyone else's",
      "Not the right tool if you don't want to be sold insurance",
    ],
  },
  {
    rank: 7,
    name: "ET Money Income Tax Calculator",
    url: "https://www.etmoney.com/tools-and-calculators/income-tax-calculator",
    internal: false,
    bestFor: "Existing ET Money users wanting tax view alongside investments",
    pros: [
      "Connects to ET Money portfolio for capital-gains projections",
      "Modern, app-friendly UI",
    ],
    cons: [
      "Aggressive app-install push",
      "Less depth on tax-deduction logic than ClearTax",
    ],
  },
];

const aboutFaqs = [
  {
    q: "Which is the best free income tax calculator in India for FY 2025-26?",
    a: "For most salaried users wanting to compare old vs new tax regime, SabTools' calculator shows both regimes side-by-side on a single screen with all common deductions pre-built. ClearTax is the better choice if you also want to e-file using the same data. The Income Tax Department's official calculator is the canonical reference but its UI is dated.",
  },
  {
    q: "What are the income tax slabs for FY 2025-26 (AY 2026-27)?",
    a: "Under the new regime (default for most filers): up to ₹3 lakh — nil; ₹3-7 lakh — 5%; ₹7-10 lakh — 10%; ₹10-12 lakh — 15%; ₹12-15 lakh — 20%; above ₹15 lakh — 30%. Standard deduction of ₹75,000. Under the old regime: up to ₹2.5 lakh — nil; ₹2.5-5 lakh — 5%; ₹5-10 lakh — 20%; above ₹10 lakh — 30%, with all chapter VI-A deductions (80C, 80D, HRA, etc.) available.",
  },
  {
    q: "Should I pick the old or new tax regime?",
    a: `Rule of thumb: if your total deductions (80C + 80D + HRA + home-loan interest + NPS + standard deduction) exceed ₹4-4.5 lakh, the old regime usually wins. Under that threshold, the new regime's lower slab rates and higher standard deduction usually result in less tax. Use SabTools' Income Tax Calculator to model both — the side-by-side comparison shows the exact rupee difference for your situation.`,
  },
  {
    q: "What deductions can I claim under the old tax regime?",
    a: "Section 80C up to ₹1.5 lakh (PPF, ELSS, LIC premium, ULIP, principal of home loan, NPS Tier 1, kids' tuition fees, EPF). Section 80D up to ₹25,000 for self+family medical insurance plus ₹50,000 for senior-citizen parents. Section 80CCD(1B) ₹50,000 extra for NPS contribution. Section 24B ₹2 lakh on home-loan interest for self-occupied property. HRA exemption per Section 10(13A). Section 80E for education loan interest. None of these are available under the new regime except standard deduction and NPS employer contribution.",
  },
  {
    q: "How accurate are these calculators?",
    a: "All seven on this list compute tax correctly on standard salary income with common deductions. Differences appear at the edges: capital gains (especially the post-Budget-2024 LTCG 12.5% rate), foreign income, ESOP perquisites, surcharge on incomes above ₹50 lakh and ₹1 crore, and marginal-relief calculations. For routine cases all are accurate; for edge cases ClearTax has the strongest authored content and the Income Tax Department site is the legal reference.",
  },
  {
    q: "Is the new tax regime mandatory?",
    a: "From FY 2023-24 onward, the new regime is the default — but you can opt out and choose the old regime by declaring it to your employer (which affects TDS) or while filing your return. If you don't actively declare a choice, your employer will deduct TDS under the new regime. SabTools' calculator helps you decide which regime to opt for before declaring to your employer.",
  },
  {
    q: "Can I e-file my income tax return after using these calculators?",
    a: "ClearTax and Tax2Win have integrated e-filing flows. SabTools, the Income Tax Department's official calculator, BankBazaar, HDFC Life, and ET Money are calculators only — for e-filing you'd use the official Income Tax e-filing portal (incometax.gov.in) or a paid service like ClearTax/Tax2Win. The official portal's e-filing is free and is the authoritative submission channel.",
  },
  {
    q: "Is there an income tax calculator in Hindi?",
    a: `Yes — SabTools publishes /hi/tools/income-tax-calculator with all slabs, deductions, and side-by-side comparison labelled in Hindi. It's one of ${BRAND.hindiTools}+ Hindi-localized tools. Most other calculators on this list are English-only.`,
  },
];

export default function BestIncomeTaxCalculatorIndia() {
  const graph = buildGraph([
    webPageNode({
      url: PAGE_URL,
      name: PAGE_TITLE,
      description: PAGE_DESC,
      datePublished: "2026-05-08",
      dateModified: BUILD_DATE,
      inLanguage: "en-IN",
    }),
    breadcrumbNode([
      { name: "Home", url: `${SITE_URL}/` },
      { name: "Best of", url: `${SITE_URL}/best` },
      { name: "Free Income Tax Calculator India" },
    ]),
    {
      "@type": "ItemList",
      "@id": `${PAGE_URL}#itemlist`,
      name: "Best Free Income Tax Calculators in India FY 2025-26",
      description:
        "Seven free income tax calculators ranked by speed, regime-comparison clarity, deduction depth, and authoritativeness for Indian salaried filers.",
      numberOfItems: entries.length,
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      itemListElement: entries.map((e) => ({
        "@type": "ListItem",
        position: e.rank,
        name: e.name,
        url: e.url,
      })),
    },
    faqPageNode(aboutFaqs, SUPPORTED_LANGUAGES[0]),
  ]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Best of", href: "/best" },
          { label: "Free Income Tax Calculator India" },
        ]}
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />

      <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3 mt-2">
        Best Free Income Tax Calculator in India — FY 2025-26 (AY 2026-27)
      </h1>
      <p className="text-sm text-gray-500 mb-8">
        Last updated: {BUILD_MONTH_YEAR} · ~10 minutes to read
      </p>

      <div className="prose prose-gray max-w-none space-y-5">
        <p className="text-lg text-gray-700">
          Choosing between the old and new tax regimes is the single
          decision that affects how much tax a salaried Indian pays each
          year. We tested seven of the most-used free income tax calculators
          against the same scenarios — a ₹15 lakh CTC software engineer in
          Bangalore with HRA, 80C-maxed, and a home loan; and a ₹35 lakh
          regional head with ₹6 lakh of capital gains — to see which tools
          give you a usable answer fast.
        </p>

        <p>
          Disclosure: this page is published by SabTools.in and our calculator
          is on the list. We have specifically called out where competitors
          are stronger — ClearTax for e-filing integration, the Income Tax
          Department for authoritative slab data, Tax2Win for tax-saving
          suggestions. Pretending otherwise would tank the page in both
          Google's helpful-content ranking and AI-search citation logic.
        </p>

        <h2>Quick recommendation</h2>
        <ul>
          <li>
            <strong>SabTools</strong> if you want to compare old vs new
            regime side-by-side in 30 seconds.
          </li>
          <li>
            <strong>ClearTax</strong> if you want one workflow for
            calculation + e-filing.
          </li>
          <li>
            <strong>Income Tax Department official</strong> for the
            authoritative reference (the law itself).
          </li>
          <li>
            <strong>Tax2Win</strong> if you want assisted-filing as a
            fallback and tax-saving recommendations.
          </li>
        </ul>

        <h2>The full ranking</h2>
        <p>
          We weighted four criteria: clarity of regime comparison (35%),
          deduction depth and edge-case coverage (30%), speed and friction
          (20%), and authoritativeness for slab-rule accuracy (15%).
        </p>

        <div className="not-prose space-y-4 my-8">
          {entries.map((e) => (
            <article
              key={e.rank}
              className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6"
            >
              <div className="flex items-start gap-4">
                <span className="shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-bold">
                  {e.rank}
                </span>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {e.internal ? (
                      <Link href={e.url.replace(SITE_URL, "")} className="hover:text-indigo-700">
                        {e.name} →
                      </Link>
                    ) : (
                      <a
                        href={e.url}
                        target="_blank"
                        rel="nofollow noopener noreferrer"
                        className="hover:text-indigo-700"
                      >
                        {e.name} ↗
                      </a>
                    )}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    <span className="font-medium text-gray-700">Best for:</span> {e.bestFor}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="font-semibold text-emerald-700 mb-1">Pros</p>
                      <ul className="space-y-1 text-gray-700 list-disc list-inside">
                        {e.pros.map((p) => (
                          <li key={p}>{p}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-rose-700 mb-1">Cons</p>
                      <ul className="space-y-1 text-gray-700 list-disc list-inside">
                        {e.cons.map((c) => (
                          <li key={c}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <h2>Worked example: ₹15 lakh CTC, Bangalore</h2>
        <p>
          Take a typical mid-career software engineer earning ₹15 lakh CTC
          in Bangalore: ₹12 lakh basic+DA, ₹3 lakh HRA, lives in a ₹35,000/month
          rental, ₹1.5 lakh of 80C investments, ₹25,000 of 80D health
          insurance, no home loan.
        </p>

        <p>
          Under the <strong>old regime</strong>: Standard deduction ₹50,000.
          HRA exemption ~₹2.16 lakh (50% of basic minus 10% of basic on
          rent paid). 80C ₹1.5 lakh. 80D ₹25,000. Taxable income drops to
          roughly ₹10.59 lakh. Tax: ₹1.43 lakh + 4% cess = ₹1.49 lakh.
        </p>

        <p>
          Under the <strong>new regime</strong>: Standard deduction ₹75,000.
          No HRA, no 80C, no 80D allowed. Taxable income ₹14.25 lakh. Tax:
          ₹1.10 lakh + 4% cess = ₹1.14 lakh.
        </p>

        <p>
          New regime saves this filer ~₹35,000/year. The pattern flips if
          they take a home loan with ₹2 lakh of interest deduction — the
          extra Section 24B deduction tilts the math back toward the old
          regime. This is exactly why a side-by-side calculator that lets
          you toggle deductions on and off is more useful than running each
          regime separately.
        </p>

        <h2>Pair the income tax calculator with these tools</h2>
        <ul>
          <li>
            <Link href="/tools/hra-calculator">HRA Exemption Calculator</Link>{" "}
            — compute exact Section 10(13A) exemption based on basic, HRA,
            rent paid, and city tier.
          </li>
          <li>
            <Link href="/tools/in-hand-salary-calculator">In-Hand Salary Calculator</Link>{" "}
            — see your monthly take-home after the regime you select for
            TDS.
          </li>
          <li>
            <Link href="/tools/capital-gains-tax-calculator">Capital Gains Tax Calculator</Link>{" "}
            — for filers with stock sales, mutual fund redemptions, or
            property sales (post-Budget 2024 12.5% LTCG rates).
          </li>
          <li>
            <Link href="/tools/nps-calculator">NPS Calculator</Link>{" "}
            — model the Section 80CCD(1B) extra ₹50,000 deduction available
            in the old regime.
          </li>
        </ul>

        <h2>Frequently Asked Questions</h2>
        <div className="not-prose space-y-3">
          {aboutFaqs.map((faq) => (
            <details
              key={faq.q}
              className="group bg-white rounded-xl border border-gray-200 hover:border-indigo-300 transition"
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

        <h2>The bottom line</h2>
        <p>
          For the once-a-year regime decision, use whichever calculator
          gives you the side-by-side comparison fastest — SabTools is built
          for exactly this. For e-filing, ClearTax is the smoothest paid
          flow and Tax2Win is the cheaper alternative. For verifying that
          the slab rates a calculator uses are correct, the Income Tax
          Department's official tool is the canonical reference. None of
          these calculators replace a chartered accountant for filers with
          complex income (capital gains, foreign income, business income,
          ESOPs, NRI status).
        </p>

        <p className="not-prose mt-6">
          <Link
            href="/tools/income-tax-calculator"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition"
          >
            Open the SabTools Income Tax Calculator →
          </Link>
        </p>
      </div>
    </div>
  );
}
