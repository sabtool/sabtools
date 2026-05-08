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

const PAGE_URL = `${SITE_URL}/best/free-emi-calculator-india`;
// Bare title — layout's title.template appends " | SabTools.in" exactly
// once. Final rendered <title> stays ≤ 60 chars (52 chars total here).
const PAGE_TITLE = "Best Free EMI Calculator in India 2026";
const PAGE_DESC =
  "We tested 7 free EMI calculators on the same ₹50L home loan and ₹6L car loan scenarios. Honest comparison of SabTools, BankBazaar, ClearTax, HDFC Life, ET Money, Groww, and Paisabazaar.";

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
    name: "SabTools EMI Calculator",
    url: `${SITE_URL}/tools/emi-calculator`,
    internal: true,
    bestFor: "Comparing scenarios fast — switching between home, car, and personal loans without re-entering data",
    pros: [
      "Year-wise principal-vs-interest breakdown displayed inline (no separate amortization page)",
      "Adjustable interest rate steppers in 0.05% increments — match your bank's exact quote",
      "Loads in <1s on 4G; usable on a 2 GB RAM phone",
      "PDF download of the full schedule, no email required",
      "Hindi version at /hi/tools/emi-calculator",
    ],
    cons: [
      "No bank-comparison feature — you can't see SBI vs HDFC vs ICICI rates side-by-side (use BankBazaar for that)",
      "No pre-approved loan offers or affiliate quotes — pure calculator, no sales funnel",
    ],
  },
  {
    rank: 2,
    name: "BankBazaar EMI Calculator",
    url: "https://www.bankbazaar.com/emi-calculator.html",
    internal: false,
    bestFor: "Comparing live interest rates across 30+ Indian banks before applying",
    pros: [
      "Real-time rate cards for SBI, HDFC, ICICI, Axis, Kotak, PNB, Bank of Baroda, etc.",
      "Pre-approved offers if your CIBIL score qualifies",
      "Detailed amortization with monthly outstanding balance",
    ],
    cons: [
      "Heavy lead-capture funnel — calculator constantly pushes you toward applying",
      "Page weight is ~5 MB on first load",
      "If you just want the EMI number, the rate cards are noise",
    ],
  },
  {
    rank: 3,
    name: "ClearTax EMI Calculator",
    url: "https://cleartax.in/s/emi-calculator",
    internal: false,
    bestFor: "Tax-aware borrowers who want to model the Section 24B home-loan interest deduction alongside EMI",
    pros: [
      "Authored by chartered accountants — content depth on tax interplay is excellent",
      "Direct integration with their income tax calculator",
      "Trusted brand for finance content in India",
    ],
    cons: [
      "Pushes ClearTax Pro signups",
      "Slower initial load than dedicated calculator sites",
      "No bank-rate comparison",
    ],
  },
  {
    rank: 4,
    name: "HDFC Life Home Loan EMI Calculator",
    url: "https://www.hdfclife.com/financial-tools-calculators/home-loan-emi-calculator",
    internal: false,
    bestFor: "Borrowers already banking with HDFC who want HDFC's published rates pre-filled",
    pros: [
      "HDFC's actual home-loan rates pre-populated",
      "Insurance bundling option (HDFC Life is the insurer)",
      "Trusted financial-services brand",
    ],
    cons: [
      "Sales-driven page — every CTA is 'apply for loan' or 'buy insurance'",
      "Calculator is generic — same engine as any other EMI calculator",
      "Only useful if HDFC's rate is what you want; not a true comparison tool",
    ],
  },
  {
    rank: 5,
    name: "ET Money EMI Calculator",
    url: "https://www.etmoney.com/tools-and-calculators/emi-calculator",
    internal: false,
    bestFor: "Investors who use ET Money for SIPs and want loan calculations in the same dashboard",
    pros: [
      "Clean, modern UI",
      "Connects to ET Money's investment dashboard if you have an account",
      "Mobile app version exists",
    ],
    cons: [
      "App push is aggressive on mobile web",
      "No standout feature vs SabTools or BankBazaar for the calculator alone",
    ],
  },
  {
    rank: 6,
    name: "Groww EMI Calculator",
    url: "https://groww.in/calculators/emi-calculator",
    internal: false,
    bestFor: "Existing Groww users who want one ecosystem for investments and loan modeling",
    pros: [
      "Visual chart of principal vs interest over loan tenure",
      "Modern, fast UI",
      "Trusted investment brand among younger Indian users",
    ],
    cons: [
      "Limited customization — interest-rate stepper is coarser than SabTools",
      "Pushes Groww account creation aggressively",
    ],
  },
  {
    rank: 7,
    name: "Paisabazaar EMI Calculator",
    url: "https://www.paisabazaar.com/emi-calculator/",
    internal: false,
    bestFor: "Users comparing personal-loan EMI offers from NBFCs",
    pros: [
      "Strong personal-loan and credit-card comparison content",
      "CIBIL-score-gated pre-approval offers",
    ],
    cons: [
      "Like BankBazaar, heavy lead-capture flow",
      "Calculator output is shallower — no year-wise breakdown",
    ],
  },
];

const aboutFaqs = [
  {
    q: "Which is the best free EMI calculator in India?",
    a: `For a pure calculation experience without sales funnels, the SabTools EMI Calculator is the fastest option with year-wise interest breakdown and 0.05% rate granularity. If you want to compare live bank rates before applying, BankBazaar is the better choice despite the heavier page weight. ClearTax is best when you also need to model the Section 24B tax deduction.`,
  },
  {
    q: "How is EMI calculated?",
    a: "EMI = [P × r × (1+r)ⁿ] / [(1+r)ⁿ − 1], where P is the principal, r is the monthly interest rate (annual rate ÷ 12 ÷ 100), and n is the tenure in months. For a ₹50 lakh home loan at 8.75% over 20 years, that works out to ₹44,186 per month. Every calculator on this list uses the same formula — accuracy is identical; the differences are UX.",
  },
  {
    q: "Are there any hidden costs apart from EMI?",
    a: "Yes. Banks charge a processing fee (0.5%–1% of the loan amount, often ₹10,000–₹50,000), GST on the processing fee, optional loan-protection insurance (₹15,000–₹50,000 lump-sum), and sometimes a legal/valuation fee for home loans. None of the seven calculators on this list factor these in by default — you must add them manually to get your true total cost.",
  },
  {
    q: "Can I prepay my loan to reduce EMI burden?",
    a: `Yes. Most Indian banks allow part-prepayment without penalty on floating-rate loans (RBI rule). Prepaying ₹2 lakh on a ₹50 lakh, 20-year home loan in year 3 typically saves ₹4–6 lakh in total interest depending on the rate. SabTools has a dedicated Home Loan Prepayment Calculator that models EMI-reduction vs tenure-reduction strategies side-by-side.`,
  },
  {
    q: "Should I pick a longer or shorter tenure?",
    a: "Shorter tenures mean higher EMI but dramatically lower total interest. A ₹50 lakh home loan at 8.75% costs ₹56 lakh in interest over 20 years; cutting tenure to 15 years takes EMI from ₹44,186 to ₹49,907 (only ₹5,721 more per month) but saves you ₹16 lakh in lifetime interest. Use whichever calculator on this list you prefer to model both scenarios before signing.",
  },
  {
    q: "Do EMI calculators work for car loans and personal loans too?",
    a: "Yes — the EMI formula is identical regardless of loan type. The differences are interest rates (personal loans are 11–18%, car loans 8–11%, home loans 8–9.5%) and tenures (home loans up to 30 years, car loans 7 years, personal loans 5 years). SabTools has dedicated Car Loan Calculator and Education Loan Calculator pages with type-specific defaults.",
  },
  {
    q: "Are these EMI calculators accurate enough for real loan decisions?",
    a: "All seven produce identical EMI figures to the rupee on standard reducing-balance loans. Where they differ: how they handle moratoriums (education loans), step-up EMIs (some home loans offer this), and floating-rate resets. For routine decisions all are fine; for unusual structures consult your bank's official sanction letter.",
  },
  {
    q: "Is there an EMI calculator in Hindi?",
    a: `Yes — SabTools publishes /hi/tools/emi-calculator with the full interface, labels, and breakdown in Hindi. It is one of ${BRAND.hindiTools}+ tools in our Hindi catalog. Most other calculators on this list are English-only.`,
  },
];

export default function BestEmiCalculatorIndia() {
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
      { name: "Free EMI Calculator India" },
    ]),
    {
      "@type": "ItemList",
      "@id": `${PAGE_URL}#itemlist`,
      name: "Best Free EMI Calculators in India 2026",
      description:
        "Seven free EMI calculators ranked by speed, depth of breakdown, mobile experience, and amount of sales-funnel friction.",
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
          { label: "Free EMI Calculator India" },
        ]}
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />

      <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3 mt-2">
        Best Free EMI Calculator in India ({new Date().getFullYear()})
      </h1>
      <p className="text-sm text-gray-500 mb-8">
        Last updated: {BUILD_MONTH_YEAR} · ~8 minutes to read
      </p>

      <div className="prose prose-gray max-w-none space-y-5">
        <p className="text-lg text-gray-700">
          A reliable EMI calculator is the difference between knowing what
          you can afford and getting surprised by your loan officer. We
          tested seven of the most-used free EMI calculators in India
          against two real-world scenarios — a ₹50 lakh home loan at 8.75%
          over 20 years, and a ₹6 lakh car loan at 9.5% over 5 years — to
          see which ones give you the answer fast and which ones make you
          fight through a sales funnel.
        </p>

        <p>
          Disclosure: this comparison is published by SabTools.in. Our own
          calculator is on the list. We have specifically called out cases
          where competitors (BankBazaar for live rate comparison, ClearTax
          for tax integration) are the better choice. Pretending otherwise
          would tank the page in both Google's helpful-content rankings and
          AI search engines.
        </p>

        <h2>Quick recommendation</h2>
        <ul>
          <li>
            <strong>SabTools</strong> if you want to model 4–5 loan
            scenarios in 30 seconds without bouncing through ads.
          </li>
          <li>
            <strong>BankBazaar</strong> if you are loan-shopping and want
            live SBI / HDFC / ICICI rates pre-filled.
          </li>
          <li>
            <strong>ClearTax</strong> if Section 24B home-loan-interest tax
            deductions are part of your decision.
          </li>
          <li>
            <strong>Groww or ET Money</strong> if you already use them for
            SIPs and want the calculator alongside your investment
            dashboard.
          </li>
        </ul>

        <h2>The full ranking</h2>
        <p>
          Scoring weighted four factors: speed to first usable input (40%),
          depth of breakdown — year-wise schedule, principal vs interest
          curves, prepayment modeling (30%), mobile experience on a 4 GB
          phone (20%), and signup/sales-funnel friction (10%).
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

        <h2>What "good" looks like in an EMI calculator</h2>
        <p>
          Three things separate a useful calculator from a bad one. First, a
          fine-grained interest-rate stepper. Indian home-loan rates change
          in 0.05% increments — your bank may quote 8.75% one day and 8.80%
          the next. A calculator that only lets you pick whole percentages
          forces you to round, which on a ₹50 lakh loan over 20 years can
          mis-estimate total interest by ₹1.5–2 lakh.
        </p>

        <p>
          Second, year-wise breakdown of principal vs interest. In the first
          5 years of a 20-year home loan at 8.75%, you pay roughly 70% of
          each EMI as interest and only 30% as principal. By year 15 the
          ratio flips. Without seeing this curve, borrowers under-estimate
          how much prepayment in early years saves.
        </p>

        <p>
          Third, no friction. The best calculator is the one you actually
          open. If you have to dismiss two pop-ups, scroll past three ad
          blocks, and ignore an "apply now" CTA before reaching the input
          box, you'll stop running scenarios. That is the real failure mode
          of BankBazaar's tool — it is feature-rich but you use it less
          than you should.
        </p>

        <h2>Real-world example: ₹50 lakh home loan, three scenarios</h2>
        <p>
          Take a base case: ₹50 lakh at 8.75% over 20 years. EMI is ₹44,186.
          Total interest paid is ₹56.04 lakh. Cut the rate to 8.50% — EMI
          drops to ₹43,391, total interest to ₹54.14 lakh (savings: ₹1.9
          lakh). Now go the other direction: bump the rate to 9.00%. EMI
          rises to ₹44,986, total interest to ₹57.97 lakh (extra cost: ₹1.93
          lakh). A 0.50% swing on a 20-year home loan moves total cost by
          ₹3.83 lakh — which is why the rate-stepper granularity matters.
        </p>

        <h2>Pair your EMI calculator with these tools</h2>
        <ul>
          <li>
            <Link href="/tools/home-loan-calculator">Home Loan Calculator</Link>{" "}
            — same engine as the general EMI calculator but defaulted to
            home-loan tenure ranges (10–30 years) and includes a year-wise
            outstanding-balance graph.
          </li>
          <li>
            <Link href="/tools/car-loan-calculator">Car Loan Calculator</Link>{" "}
            — defaulted to car-loan rate ranges and 5–7 year tenures, with
            a down-payment vs loan-amount slider.
          </li>
          <li>
            <Link href="/tools/in-hand-salary-calculator">In-Hand Salary Calculator</Link>{" "}
            — to check whether your projected EMI fits the 40-50% debt-to-income
            ratio most banks require for sanction.
          </li>
          <li>
            <Link href="/tools/income-tax-calculator">Income Tax Calculator</Link>{" "}
            — to model the Section 24B home-loan interest deduction
            (₹2 lakh/year cap on self-occupied property) and Section 80C
            principal repayment deduction in the old tax regime.
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
          The "best" EMI calculator depends on what you are doing. For
          modeling — adjusting tenure, rate, and amount across multiple
          scenarios in one sitting — pick the one with the least friction
          (SabTools or Groww). For comparing actual bank rates before
          applying, BankBazaar's lead-capture pain is worth tolerating
          because no other free tool gives you live rate cards across 30+
          banks. For combining EMI with tax planning, ClearTax has no peer.
        </p>

        <p className="not-prose mt-6">
          <Link
            href="/tools/emi-calculator"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition"
          >
            Open the SabTools EMI Calculator →
          </Link>
        </p>
      </div>
    </div>
  );
}
