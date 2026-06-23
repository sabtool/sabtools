"use client";
import { useMemo, useState } from "react";

/**
 * CAC to LTV Ratio Calculator — the foundational SaaS / startup
 * unit-economics metric. CAC = customer acquisition cost. LTV =
 * lifetime value. The ratio (LTV ÷ CAC) tells you whether your
 * growth motion is healthy or burning money to buy revenue.
 *
 * Benchmarks (broad SaaS consensus):
 *   < 1.0   Losing money on every customer — pause growth, fix funnel
 *   1.0–3.0 Sub-optimal, eating margin — investors expect 3+
 *   3.0–5.0 Healthy, industry standard
 *   > 5.0   Excellent — probably under-investing in growth
 *
 * Also surfaces:
 *   - CAC Payback period (months to recover acquisition cost)
 *   - Implied customer lifetime (1 / monthly churn)
 *   - Verdict band with India-specific founder advice
 *
 * All math is plain JavaScript — no external data, runs offline.
 */

interface Inputs {
  /** Total monthly marketing + sales spend, in your reporting currency. */
  monthlySpend: number;
  /** New paying customers acquired per month. */
  newCustomers: number;
  /** Average revenue per customer per month. */
  arpu: number;
  /** Gross margin % (revenue − COGS / hosting / support cost). */
  grossMarginPct: number;
  /** Monthly churn rate %. */
  monthlyChurnPct: number;
}

interface Result {
  cac: number;
  ltv: number;
  ratio: number;
  paybackMonths: number;
  lifetimeMonths: number;
  verdict: "danger" | "warn" | "good" | "great";
  verdictTitle: string;
  verdictBody: string;
}

const VERDICTS: Record<Result["verdict"], { color: string; bg: string; border: string }> = {
  danger: { color: "text-red-700", bg: "bg-red-50", border: "border-red-200" },
  warn: { color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200" },
  good: { color: "text-green-700", bg: "bg-green-50", border: "border-green-200" },
  great: { color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
};

function fmtINR(n: number, max = 0): string {
  if (!isFinite(n)) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: max,
  }).format(Math.round(n));
}

function compute(i: Inputs): Result | null {
  if (
    i.monthlySpend <= 0 ||
    i.newCustomers <= 0 ||
    i.arpu <= 0 ||
    i.grossMarginPct <= 0 ||
    i.monthlyChurnPct <= 0
  ) {
    return null;
  }

  const cac = i.monthlySpend / i.newCustomers;
  const gm = i.grossMarginPct / 100;
  const churn = i.monthlyChurnPct / 100;
  const lifetimeMonths = 1 / churn;
  const ltv = i.arpu * gm * lifetimeMonths;
  const ratio = ltv / cac;
  const paybackMonths = cac / (i.arpu * gm);

  let verdict: Result["verdict"] = "good";
  let verdictTitle = "";
  let verdictBody = "";
  if (ratio < 1) {
    verdict = "danger";
    verdictTitle = "Losing money on every customer";
    verdictBody =
      "Each rupee you spend on acquisition is bringing back less than a rupee of margin over the customer's whole lifetime. " +
      "Pause growth spend until the funnel improves — focus on a single channel, raise prices on the next cohort, or attack churn. " +
      "Investors will not fund a sub-1× ratio at any stage.";
  } else if (ratio < 3) {
    verdict = "warn";
    verdictTitle = "Below the 3× benchmark — eating margin";
    verdictBody =
      "You're not bleeding, but every new customer reduces your overall margin pool. " +
      "Indian SaaS investors (Accel, Lightspeed, Peak XV) reference 3× as the floor for a Series A pitch. " +
      "Common levers: increase ARPU through pricing or upsell, cut paid-channel CAC by 30%, or improve net retention to 110%+.";
  } else if (ratio < 5) {
    verdict = "good";
    verdictTitle = "Healthy — at or above industry standard";
    verdictBody =
      "3× to 5× is the consensus healthy band for sustainable SaaS. " +
      "You can keep spending at this efficiency without bleeding margin. " +
      "Next milestone: drive ratio toward 5× by lengthening lifetime (NPS-driven retention) without increasing CAC.";
  } else {
    verdict = "great";
    verdictTitle = "Excellent — likely under-investing in growth";
    verdictBody =
      "Above 5× usually means you're leaving growth on the table. " +
      "Press harder on the channel that's working — a 4× ratio that 10×'s revenue is a better story than a 7× ratio with flat growth. " +
      "Test new paid channels, expand into adjacent markets, or invest in the brand & content moat.";
  }

  return {
    cac,
    ltv,
    ratio,
    paybackMonths,
    lifetimeMonths,
    verdict,
    verdictTitle,
    verdictBody,
  };
}

export default function CacLtvRatioCalculator() {
  const [monthlySpend, setMonthlySpend] = useState<string>("500000");
  const [newCustomers, setNewCustomers] = useState<string>("50");
  const [arpu, setArpu] = useState<string>("3000");
  const [grossMarginPct, setGrossMarginPct] = useState<string>("75");
  const [monthlyChurnPct, setMonthlyChurnPct] = useState<string>("3");

  const result = useMemo(
    () =>
      compute({
        monthlySpend: parseFloat(monthlySpend) || 0,
        newCustomers: parseFloat(newCustomers) || 0,
        arpu: parseFloat(arpu) || 0,
        grossMarginPct: parseFloat(grossMarginPct) || 0,
        monthlyChurnPct: parseFloat(monthlyChurnPct) || 0,
      }),
    [monthlySpend, newCustomers, arpu, grossMarginPct, monthlyChurnPct]
  );

  const v = result ? VERDICTS[result.verdict] : VERDICTS.good;

  return (
    <div className="space-y-6">
      {/* Inputs — CAC group */}
      <div className="result-card">
        <h3 className="font-bold text-gray-800 mb-1">📥 Customer Acquisition Cost</h3>
        <p className="text-xs text-gray-500 mb-4">
          Add up the monthly sales + marketing spend that goes into acquiring new paying
          customers — paid ads, sales-team salaries, marketing tool subscriptions, and
          inbound content investment.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">
              Monthly sales + marketing spend (₹)
            </label>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              value={monthlySpend}
              onChange={(e) => setMonthlySpend(e.target.value)}
              className="calc-input"
              placeholder="e.g. 500000"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              Include sales-team salaries + paid ads + content + tools.
            </p>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">
              New paying customers acquired / month
            </label>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              value={newCustomers}
              onChange={(e) => setNewCustomers(e.target.value)}
              className="calc-input"
              placeholder="e.g. 50"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              Net new — exclude free trials that did not convert.
            </p>
          </div>
        </div>
      </div>

      {/* Inputs — LTV group */}
      <div className="result-card">
        <h3 className="font-bold text-gray-800 mb-1">📤 Customer Lifetime Value</h3>
        <p className="text-xs text-gray-500 mb-4">
          ARPU × Gross margin × (1 ÷ Monthly churn). The 1÷churn term is the implied
          average lifetime — if 3% of customers cancel each month, the average customer
          stays ~33 months.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">
              Average revenue / customer / month (₹)
            </label>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              value={arpu}
              onChange={(e) => setArpu(e.target.value)}
              className="calc-input"
              placeholder="e.g. 3000"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              Also called ARPA or MRR per customer.
            </p>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">
              Gross margin (%)
            </label>
            <input
              type="number"
              inputMode="decimal"
              min={0}
              max={100}
              value={grossMarginPct}
              onChange={(e) => setGrossMarginPct(e.target.value)}
              className="calc-input"
              placeholder="e.g. 75"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              SaaS typical: 70–85%. Services: 30–50%.
            </p>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">
              Monthly churn rate (%)
            </label>
            <input
              type="number"
              inputMode="decimal"
              min={0}
              max={100}
              step={0.1}
              value={monthlyChurnPct}
              onChange={(e) => setMonthlyChurnPct(e.target.value)}
              className="calc-input"
              placeholder="e.g. 3"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              Cancellations ÷ active customers. SaaS healthy: 1–3%.
            </p>
          </div>
        </div>
      </div>

      {/* Output */}
      {result ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl p-4 text-center">
              <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                CAC
              </div>
              <div className="text-2xl font-extrabold text-indigo-900 mt-1">
                {fmtINR(result.cac)}
              </div>
              <div className="text-[11px] text-indigo-700 mt-1">
                cost per customer
              </div>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl p-4 text-center">
              <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
                LTV
              </div>
              <div className="text-2xl font-extrabold text-emerald-900 mt-1">
                {fmtINR(result.ltv)}
              </div>
              <div className="text-[11px] text-emerald-700 mt-1">
                margin per customer lifetime
              </div>
            </div>
            <div
              className={`${v.bg} border ${v.border} rounded-2xl p-4 text-center`}
            >
              <div
                className={`text-xs font-semibold uppercase tracking-wider ${v.color}`}
              >
                LTV : CAC ratio
              </div>
              <div className={`text-2xl font-extrabold mt-1 ${v.color}`}>
                {result.ratio.toFixed(2)}×
              </div>
              <div className={`text-[11px] mt-1 ${v.color}`}>
                payback in {result.paybackMonths.toFixed(1)} months
              </div>
            </div>
          </div>

          <div className={`${v.bg} border ${v.border} rounded-2xl p-5`}>
            <h3 className={`font-bold text-lg ${v.color}`}>
              {result.verdict === "danger"
                ? "🚨 "
                : result.verdict === "warn"
                  ? "⚠️ "
                  : result.verdict === "good"
                    ? "✅ "
                    : "🏆 "}
              {result.verdictTitle}
            </h3>
            <p className={`mt-2 text-sm leading-relaxed ${v.color}`}>
              {result.verdictBody}
            </p>
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-white/60 rounded-lg p-2 text-center">
                <div className="font-bold text-gray-800">
                  {result.lifetimeMonths.toFixed(1)} mo
                </div>
                <div className="text-gray-500">avg lifetime</div>
              </div>
              <div className="bg-white/60 rounded-lg p-2 text-center">
                <div className="font-bold text-gray-800">
                  {result.paybackMonths.toFixed(1)} mo
                </div>
                <div className="text-gray-500">CAC payback</div>
              </div>
              <div className="bg-white/60 rounded-lg p-2 text-center">
                <div className="font-bold text-gray-800">
                  {(result.ratio * 100).toFixed(0)}%
                </div>
                <div className="text-gray-500">LTV as % of CAC</div>
              </div>
              <div className="bg-white/60 rounded-lg p-2 text-center">
                <div className="font-bold text-gray-800">
                  {fmtINR(result.ltv - result.cac)}
                </div>
                <div className="text-gray-500">net per customer</div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center text-sm text-gray-500">
          Enter all five inputs above to see your LTV : CAC ratio.
        </div>
      )}

      {/* Benchmarks reference */}
      <div className="result-card">
        <h3 className="font-bold text-gray-800 mb-3">📊 Industry benchmarks (LTV : CAC)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-gray-500 uppercase tracking-wide">
              <tr>
                <th className="text-left py-2 pr-3">Ratio band</th>
                <th className="text-left py-2 pr-3">What it means</th>
                <th className="text-left py-2">Investor view</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              <tr className="border-t border-gray-100">
                <td className="py-2 pr-3 font-bold text-red-700">&lt; 1.0×</td>
                <td className="py-2 pr-3">Bleeding cash on growth</td>
                <td className="py-2">Unfundable at any stage</td>
              </tr>
              <tr className="border-t border-gray-100">
                <td className="py-2 pr-3 font-bold text-amber-700">1.0× – 3.0×</td>
                <td className="py-2 pr-3">Sub-optimal margin</td>
                <td className="py-2">Pre-seed only; needs a path to 3×</td>
              </tr>
              <tr className="border-t border-gray-100">
                <td className="py-2 pr-3 font-bold text-green-700">3.0× – 5.0×</td>
                <td className="py-2 pr-3">Healthy SaaS standard</td>
                <td className="py-2">Series A / B fundable</td>
              </tr>
              <tr className="border-t border-gray-100">
                <td className="py-2 pr-3 font-bold text-emerald-700">&gt; 5.0×</td>
                <td className="py-2 pr-3">Excellent — possibly under-spending</td>
                <td className="py-2">Press harder on growth</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-[11px] text-gray-500 mt-3">
          Benchmarks reflect the SaaS consensus (David Skok, Bessemer, Y Combinator). Marketplace
          and consumer-app businesses run with tighter ratios (often 2×–3×) because of shorter
          customer lifetimes and lower ARPU. India SaaS targeting the US market typically lands
          between 3× and 6× — the higher ARPU offsets the higher ad-platform CAC.
        </p>
      </div>

      {/* Long-form, FAQ-style content for SEO depth + GEO citations */}
      <div className="result-card">
        <h3 className="font-bold text-gray-800 mb-1">
          📐 The exact formulas this calculator uses
        </h3>
        <pre className="bg-gray-900 text-green-200 text-xs sm:text-sm rounded-xl p-4 overflow-x-auto leading-relaxed">
{`CAC                 = (Monthly Sales + Marketing Spend) ÷ New Customers Acquired
Customer Lifetime   = 1 ÷ Monthly Churn Rate                 (months)
LTV                 = ARPU × Gross Margin × Customer Lifetime
LTV : CAC Ratio     = LTV ÷ CAC
CAC Payback Period  = CAC ÷ (ARPU × Gross Margin)            (months)`}
        </pre>
        <p className="text-xs text-gray-600 mt-3 leading-relaxed">
          We use the simple subscription-economics formulation that David Skok&apos;s &quot;SaaS
          metrics 2.0&quot; framework popularised. It assumes the customer&apos;s margin contribution
          each month is roughly ARPU × Gross Margin, and that customers leave at a roughly constant
          monthly rate (so the average customer lifetime = 1 ÷ churn). Both assumptions are
          approximations — for cohort-level precision you&apos;d use a triangle-cohort or
          discounted-cash-flow LTV. For first-pass and board-level reporting, this formula is
          industry standard.
        </p>
      </div>

      {/* FAQ for FAQPage schema + featured snippets */}
      <div className="result-card">
        <h3 className="font-bold text-gray-800 mb-3">❓ FAQs</h3>
        <div className="space-y-4 text-sm">
          <div>
            <h4 className="font-bold text-gray-800">
              What is a good LTV to CAC ratio for a SaaS startup?
            </h4>
            <p className="text-gray-600 mt-1">
              The SaaS-industry consensus is <strong>3× to 5×</strong>. Below 3× and you&apos;re
              eating margin on every customer; above 5× and you&apos;re probably leaving growth on
              the table by under-spending on acquisition. Y Combinator, Bessemer Venture Partners,
              and Indian VCs like Accel and Peak XV all reference 3× as the floor for a Series A
              conversation. Marketplace and consumer apps run tighter ratios (often 2×–3×) because
              of shorter lifetimes and lower ARPU.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">
              Should I use gross margin or revenue when computing LTV?
            </h4>
            <p className="text-gray-600 mt-1">
              <strong>Always gross margin.</strong> The version that uses raw revenue (LTV = ARPU
              ÷ churn) systematically overstates lifetime value by ignoring the cost of serving the
              customer — hosting, customer success, payment processing, support. A 75% gross-margin
              SaaS that ignores margin overstates LTV by 33%, which throws off every downstream
              decision: CAC budgets, channel ROAS targets, and investor pitches. The gross-margin
              formula is what every major SaaS investor and the BVP Cloud Index use.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">
              How is CAC payback period different from LTV : CAC ratio?
            </h4>
            <p className="text-gray-600 mt-1">
              CAC payback is the number of <em>months</em> to recover acquisition cost (CAC ÷
              monthly gross margin per customer). LTV : CAC is a <em>ratio</em> of total customer
              value to acquisition cost. They measure different things: payback is a{" "}
              <strong>cash-flow / capital-efficiency</strong> metric (how fast does your cash come
              back?) and the ratio is a <strong>unit-economics health</strong> metric (is the
              business model fundamentally profitable per customer?). Healthy SaaS targets are
              under 12 months payback and 3×+ ratio.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">
              I&apos;m a B2B SaaS founder in India selling to US customers. Do these benchmarks
              still apply?
            </h4>
            <p className="text-gray-600 mt-1">
              Yes, with one nuance: <strong>your CAC will look higher than US-only competitors</strong>
              {" "}
              because you&apos;re paying US ad-platform CPCs and US-quality SDR salaries in dollars,
              but your team-cost basis is INR. Net-net, India SaaS targeting the US (e.g., Freshworks,
              Zoho, Zerodha-style) lands LTV : CAC at <strong>3× to 6×</strong>. Domestic India
              SaaS targeting Indian SMBs lives in a different ratio band — lower ARPU but much
              lower CAC, so ratios can be similar.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">
              My churn rate fluctuates month to month. What number should I use?
            </h4>
            <p className="text-gray-600 mt-1">
              Use the <strong>trailing 6-month average</strong> rather than the most recent
              month. A single bad month (a price increase, a competitor launch, a billing issue)
              can swing churn 2–3× in either direction. Six months smooths out the noise without
              being so long that it hides a real trend. If you have less than 6 months of data,
              use your best estimate but flag the result as preliminary — early-stage churn
              estimates are notoriously unreliable.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">
              Should marketing tool subscriptions (HubSpot, Marketo) be inside CAC?
            </h4>
            <p className="text-gray-600 mt-1">
              <strong>Yes.</strong> The strict definition of CAC includes every cost that goes
              into acquiring a new customer: SDR salaries, paid ads, marketing-tool stack,
              content production, sales commissions on new business, and the fully-loaded cost
              of the demand-gen team. Excluding tooling costs is one of the most common founder
              errors and inflates CAC efficiency by 15–25%. If you&apos;re reporting to investors,
              you&apos;ll be asked for fully-loaded CAC — there&apos;s no upside to using a
              flattering definition that gets immediately corrected in diligence.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">
              We&apos;re pre-revenue / pre-launch. Can we still use this calculator?
            </h4>
            <p className="text-gray-600 mt-1">
              You can model assumed CAC and LTV based on similar-stage SaaS comparables and then
              stress-test which inputs need to be true for your unit economics to work. This is
              actually one of the most valuable uses of an LTV : CAC calculator pre-launch — it
              forces a founder to be specific about ARPU, churn, and channel CAC assumptions
              before raising money, so the pitch deck&apos;s &quot;LTV : CAC = 5×&quot; line can
              be defended.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">
              How does this calculator compare to ProfitWell / Chargebee&apos;s LTV reporting?
            </h4>
            <p className="text-gray-600 mt-1">
              ProfitWell, Chargebee and Baremetrics pull live billing data from Stripe / Razorpay /
              your billing engine and compute cohorted LTV from actual customer behaviour — far
              more precise than a calculator. Use them for ongoing measurement. Use this
              calculator for <strong>scenario modelling</strong> — &quot;what if we raise prices
              15% and channel CAC stays flat?&quot; — where you don&apos;t want to wait for real
              billing data to play out.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
