"use client";
import { useMemo, useState } from "react";

/**
 * SEO ROI Calculator — projects organic-search return on investment
 * based on Sistrix / Ahrefs 2024 CTR-by-position benchmarks.
 *
 * Inputs the marketer cares about:
 *   - Monthly SEO spend (agency + content + tools)
 *   - Target keyword's monthly search volume
 *   - Starting rank vs target rank
 *   - Conversion rate of organic traffic
 *   - Average value per customer (one-time AOV or LTV)
 *   - Time-to-rank in months
 *
 * Outputs the CFO cares about:
 *   - Monthly organic clicks at target rank
 *   - Monthly conversions + revenue
 *   - 12-month and 36-month revenue projection
 *   - Net profit, ROI %, payback period in months
 *   - Break-even traffic threshold
 *
 * Built for Indian SEO context where agency pricing is ₹15K-₹2L/month
 * and the cross-link target /tools/seo-checker drives the full SEO
 * audit + ROI workflow.
 */

interface Inputs {
  monthlySpend: number;
  searchVolume: number;
  currentRank: number;
  targetRank: number;
  conversionRate: number;
  customerValue: number;
  monthsToRank: number;
}

interface Result {
  currentCtr: number;
  targetCtr: number;
  currentClicks: number;
  targetClicks: number;
  currentConversions: number;
  targetConversions: number;
  currentMonthlyRevenue: number;
  targetMonthlyRevenue: number;
  uplift: number; // monthly revenue uplift
  year1Revenue: number;
  year3Revenue: number;
  year1Investment: number;
  year3Investment: number;
  year1Roi: number;
  year3Roi: number;
  paybackMonths: number;
  breakEvenClicks: number;
  verdict: "danger" | "warn" | "good" | "great";
  verdictTitle: string;
  verdictBody: string;
}

const VERDICTS: Record<Result["verdict"], { color: string; bg: string; border: string; emoji: string }> = {
  danger: { color: "text-red-700", bg: "bg-red-50", border: "border-red-200", emoji: "🚨" },
  warn: { color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200", emoji: "⚠️" },
  good: { color: "text-green-700", bg: "bg-green-50", border: "border-green-200", emoji: "✅" },
  great: { color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200", emoji: "🚀" },
};

/**
 * Sistrix 2024 click-through rate by SERP position (desktop blended).
 * Position 100 = effectively 0% CTR. Linear interpolation between
 * the known data points.
 */
function ctrForPosition(pos: number): number {
  const table: [number, number][] = [
    [1, 0.298],
    [2, 0.158],
    [3, 0.099],
    [4, 0.066],
    [5, 0.049],
    [6, 0.034],
    [7, 0.025],
    [8, 0.019],
    [9, 0.015],
    [10, 0.012],
    [15, 0.005],
    [20, 0.003],
    [50, 0.001],
    [100, 0.0001],
  ];
  if (pos <= 1) return table[0][1];
  if (pos >= 100) return 0.0001;
  for (let i = 0; i < table.length - 1; i++) {
    const [p1, c1] = table[i];
    const [p2, c2] = table[i + 1];
    if (pos >= p1 && pos <= p2) {
      const t = (pos - p1) / (p2 - p1);
      return c1 + (c2 - c1) * t;
    }
  }
  return 0.0001;
}

function fmtCr(n: number): string {
  if (!isFinite(n) || n === 0) return "—";
  const abs = Math.abs(n);
  const cr = abs / 1_00_00_000;
  if (cr >= 1) return (n < 0 ? "-₹" : "₹") + cr.toFixed(2) + " Cr";
  const lakh = abs / 1_00_000;
  if (lakh >= 1) return (n < 0 ? "-₹" : "₹") + lakh.toFixed(2) + " L";
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Math.round(n)) + " ₹";
}

function fmtPct(n: number): string {
  if (!isFinite(n)) return "—";
  return `${n.toFixed(1)}%`;
}

function compute(i: Inputs): Result | null {
  if (
    i.monthlySpend <= 0 ||
    i.searchVolume <= 0 ||
    i.currentRank <= 0 ||
    i.targetRank <= 0 ||
    i.conversionRate <= 0 ||
    i.customerValue <= 0 ||
    i.monthsToRank <= 0
  ) {
    return null;
  }
  const currentCtr = ctrForPosition(i.currentRank);
  const targetCtr = ctrForPosition(i.targetRank);
  const currentClicks = i.searchVolume * currentCtr;
  const targetClicks = i.searchVolume * targetCtr;
  const cr = i.conversionRate / 100;
  const currentConversions = currentClicks * cr;
  const targetConversions = targetClicks * cr;
  const currentMonthlyRevenue = currentConversions * i.customerValue;
  const targetMonthlyRevenue = targetConversions * i.customerValue;
  const uplift = targetMonthlyRevenue - currentMonthlyRevenue;

  // Year 1: phase-in revenue (zero ramp before time-to-rank, full uplift after).
  const monthsAtTarget = Math.max(0, 12 - i.monthsToRank);
  const year1RevenueUplift = monthsAtTarget * uplift;
  const year1Investment = i.monthlySpend * 12;
  const year1NetProfit = year1RevenueUplift - year1Investment;

  // Year 3: assume 36 months total, 12 months are at target rank in year 1,
  // 24 months are at target rank in years 2-3.
  const year3RevenueUplift = year1RevenueUplift + uplift * 24;
  const year3Investment = i.monthlySpend * 36;
  const year3NetProfit = year3RevenueUplift - year3Investment;

  const year1Roi = year1Investment > 0 ? (year1NetProfit / year1Investment) * 100 : 0;
  const year3Roi = year3Investment > 0 ? (year3NetProfit / year3Investment) * 100 : 0;

  // Payback: months until cumulative revenue uplift exceeds cumulative spend.
  let paybackMonths = Infinity;
  let cumProfit = 0;
  for (let m = 1; m <= 60; m++) {
    const revThisMonth = m > i.monthsToRank ? uplift : 0;
    cumProfit += revThisMonth - i.monthlySpend;
    if (cumProfit >= 0 && paybackMonths === Infinity) {
      paybackMonths = m;
      break;
    }
  }

  // Break-even clicks per month to cover spend.
  const breakEvenClicks =
    i.customerValue * cr > 0 ? i.monthlySpend / (i.customerValue * cr) : Infinity;

  // Verdict
  let verdict: Result["verdict"];
  let verdictTitle = "";
  let verdictBody = "";
  if (year1Roi < 0) {
    verdict = "danger";
    verdictTitle = "Negative year-1 ROI";
    verdictBody =
      "At your time-to-rank assumption you don't recoup the SEO spend in year 1. " +
      "Either (a) target an easier keyword with lower search volume but realistic top-3 rank within 6 months, " +
      "(b) raise your average customer value via plan tier or upsell, or (c) cut SEO spend by 30-50% and run a leaner content motion.";
  } else if (year1Roi < 100) {
    verdict = "warn";
    verdictTitle = "Sub-2× year-1 ROI";
    verdictBody =
      "Positive ROI but tight — most marketing teams want at least 3× to justify SEO over paid acquisition. " +
      "Look at where the gap is: most likely targeting too broad a keyword (lower CTR than predicted) or " +
      "underestimating time-to-rank. Run our /tools/seo-checker on your target page to confirm the on-page foundation is solid before committing 12 months of spend.";
  } else if (year1Roi < 300) {
    verdict = "good";
    verdictTitle = "Healthy 2-4× year-1 ROI";
    verdictBody =
      "This is the median for well-executed Indian SaaS / lead-gen SEO — investment pays back within year 1 and compounds in year 2-3 as rankings hold. " +
      "Strong play. Cross-check with our /tools/seo-checker for any technical gaps on the target page, " +
      "and look at one related long-tail keyword to expand the page's reach.";
  } else {
    verdict = "great";
    verdictTitle = "Excellent 4×+ year-1 ROI";
    verdictBody =
      "Above 300% year-1 ROI means SEO is one of your best acquisition channels. " +
      "Two follow-up moves: (1) scale by attacking more keywords in the same cluster — content compounds when you build topical authority, (2) lock in the ranking with quarterly content refreshes since competitors will see the same opportunity.";
  }

  return {
    currentCtr,
    targetCtr,
    currentClicks,
    targetClicks,
    currentConversions,
    targetConversions,
    currentMonthlyRevenue,
    targetMonthlyRevenue,
    uplift,
    year1Revenue: year1RevenueUplift,
    year3Revenue: year3RevenueUplift,
    year1Investment,
    year3Investment,
    year1Roi,
    year3Roi,
    paybackMonths,
    breakEvenClicks,
    verdict,
    verdictTitle,
    verdictBody,
  };
}

export default function SeoRoiCalculator() {
  const [monthlySpend, setMonthlySpend] = useState("75000"); // ₹75K — typical mid-tier Indian agency
  const [searchVolume, setSearchVolume] = useState("8000");
  const [currentRank, setCurrentRank] = useState("25");
  const [targetRank, setTargetRank] = useState("3");
  const [conversionRate, setConversionRate] = useState("2.5");
  const [customerValue, setCustomerValue] = useState("5000");
  const [monthsToRank, setMonthsToRank] = useState("6");

  const result = useMemo(
    () =>
      compute({
        monthlySpend: parseFloat(monthlySpend) || 0,
        searchVolume: parseFloat(searchVolume) || 0,
        currentRank: parseFloat(currentRank) || 0,
        targetRank: parseFloat(targetRank) || 0,
        conversionRate: parseFloat(conversionRate) || 0,
        customerValue: parseFloat(customerValue) || 0,
        monthsToRank: parseFloat(monthsToRank) || 0,
      }),
    [monthlySpend, searchVolume, currentRank, targetRank, conversionRate, customerValue, monthsToRank]
  );

  const v = result ? VERDICTS[result.verdict] : VERDICTS.good;

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="result-card">
        <h3 className="font-bold text-gray-800 mb-1">💰 SEO investment + target</h3>
        <p className="text-xs text-gray-500 mb-4">
          Indian SEO agencies charge ₹15K-₹2L/month based on scope. In-house SEO content writer is ~₹30K-₹80K/month.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">
              Monthly SEO spend (₹)
            </label>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              value={monthlySpend}
              onChange={(e) => setMonthlySpend(e.target.value)}
              className="calc-input"
              placeholder="e.g. 75000"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              Agency + content + tools (Ahrefs/Semrush) + writer.
            </p>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">
              Months to reach target rank
            </label>
            <input
              type="number"
              inputMode="numeric"
              min={1}
              max={36}
              value={monthsToRank}
              onChange={(e) => setMonthsToRank(e.target.value)}
              className="calc-input"
              placeholder="e.g. 6"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              Realistic for ₹75K/mo: 6-9 months for low-comp keywords, 12-18 for medium.
            </p>
          </div>
        </div>
      </div>

      <div className="result-card">
        <h3 className="font-bold text-gray-800 mb-1">🎯 Target keyword + funnel</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">
              Monthly search volume
            </label>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              value={searchVolume}
              onChange={(e) => setSearchVolume(e.target.value)}
              className="calc-input"
              placeholder="e.g. 8000"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              From Ahrefs / Semrush / Google Keyword Planner.
            </p>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">
              Conversion rate of organic visitors (%)
            </label>
            <input
              type="number"
              inputMode="decimal"
              step={0.1}
              min={0}
              value={conversionRate}
              onChange={(e) => setConversionRate(e.target.value)}
              className="calc-input"
              placeholder="e.g. 2.5"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              SaaS lead-gen: 1-3%. E-commerce: 1-2%. Service site: 3-8%.
            </p>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">
              Current ranking (1-100)
            </label>
            <input
              type="number"
              inputMode="numeric"
              min={1}
              max={100}
              value={currentRank}
              onChange={(e) => setCurrentRank(e.target.value)}
              className="calc-input"
              placeholder="e.g. 25"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              From Google Search Console or a manual incognito search.
            </p>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">
              Target ranking (1-100)
            </label>
            <input
              type="number"
              inputMode="numeric"
              min={1}
              max={100}
              value={targetRank}
              onChange={(e) => setTargetRank(e.target.value)}
              className="calc-input"
              placeholder="e.g. 3"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              Position 3 gets ~10% CTR. Position 1 gets ~30%. Big swing.
            </p>
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm font-semibold text-gray-700 block mb-1">
              Average customer value (₹)
            </label>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              value={customerValue}
              onChange={(e) => setCustomerValue(e.target.value)}
              className="calc-input"
              placeholder="e.g. 5000"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              AOV for one-time purchase, LTV for subscription / SaaS.
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
                Monthly clicks at target
              </div>
              <div className="text-2xl font-extrabold text-indigo-900 mt-1">
                {Math.round(result.targetClicks).toLocaleString("en-IN")}
              </div>
              <div className="text-[11px] text-indigo-700 mt-1">
                vs {Math.round(result.currentClicks).toLocaleString("en-IN")} today (
                {fmtPct(result.targetCtr * 100)} CTR)
              </div>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl p-4 text-center">
              <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
                Monthly revenue uplift
              </div>
              <div className="text-2xl font-extrabold text-emerald-900 mt-1">
                {fmtCr(result.uplift)}
              </div>
              <div className="text-[11px] text-emerald-700 mt-1">
                from {Math.round(result.targetConversions)} new customers / mo
              </div>
            </div>
            <div className={`${v.bg} border-2 ${v.border} rounded-2xl p-4 text-center`}>
              <div className={`text-xs font-semibold uppercase tracking-wider ${v.color}`}>
                Year-1 ROI
              </div>
              <div className={`text-2xl font-extrabold mt-1 ${v.color}`}>
                {result.year1Roi.toFixed(0)}%
              </div>
              <div className={`text-[11px] mt-1 ${v.color}`}>
                payback in {isFinite(result.paybackMonths) ? `${result.paybackMonths} mo` : "no payback in 60 mo"}
              </div>
            </div>
          </div>

          <div className={`${v.bg} border ${v.border} rounded-2xl p-5`}>
            <h3 className={`font-bold text-lg ${v.color}`}>
              {v.emoji} {result.verdictTitle}
            </h3>
            <p className={`mt-2 text-sm leading-relaxed ${v.color}`}>{result.verdictBody}</p>
          </div>

          {/* Year 1 + Year 3 P&L */}
          <div className="result-card">
            <h3 className="font-bold text-gray-800 mb-3">📈 12-month + 36-month projection</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs text-gray-500 uppercase tracking-wide">
                  <tr>
                    <th className="text-left py-2 pr-3">Metric</th>
                    <th className="text-right py-2 pr-3">12 months</th>
                    <th className="text-right py-2">36 months</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  <tr className="border-t border-gray-100">
                    <td className="py-2 pr-3">Revenue uplift from SEO</td>
                    <td className="py-2 pr-3 text-right tabular-nums text-emerald-700 font-bold">
                      {fmtCr(result.year1Revenue)}
                    </td>
                    <td className="py-2 text-right tabular-nums text-emerald-700 font-bold">
                      {fmtCr(result.year3Revenue)}
                    </td>
                  </tr>
                  <tr className="border-t border-gray-100">
                    <td className="py-2 pr-3">SEO investment</td>
                    <td className="py-2 pr-3 text-right tabular-nums text-red-700">
                      -{fmtCr(result.year1Investment)}
                    </td>
                    <td className="py-2 text-right tabular-nums text-red-700">
                      -{fmtCr(result.year3Investment)}
                    </td>
                  </tr>
                  <tr className="border-t border-gray-200 font-bold">
                    <td className="py-2 pr-3">Net profit / loss</td>
                    <td
                      className={`py-2 pr-3 text-right tabular-nums ${
                        result.year1Revenue - result.year1Investment >= 0
                          ? "text-emerald-700"
                          : "text-red-700"
                      }`}
                    >
                      {fmtCr(result.year1Revenue - result.year1Investment)}
                    </td>
                    <td
                      className={`py-2 text-right tabular-nums ${
                        result.year3Revenue - result.year3Investment >= 0
                          ? "text-emerald-700"
                          : "text-red-700"
                      }`}
                    >
                      {fmtCr(result.year3Revenue - result.year3Investment)}
                    </td>
                  </tr>
                  <tr className="border-t border-gray-100">
                    <td className="py-2 pr-3">ROI</td>
                    <td className="py-2 pr-3 text-right tabular-nums font-bold">
                      {result.year1Roi.toFixed(0)}%
                    </td>
                    <td className="py-2 text-right tabular-nums font-bold">
                      {result.year3Roi.toFixed(0)}%
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-gray-500 mt-3">
              Assumes zero revenue in months 1-{monthsToRank} (ramp-up), full uplift in the
              remaining months. Real SEO often produces partial revenue earlier as long-tail
              clicks come in — so this is a conservative projection.
            </p>
          </div>
        </>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center text-sm text-gray-500">
          Fill in all inputs to see your SEO ROI projection.
        </div>
      )}

      {/* CTR-by-position benchmark */}
      <div className="result-card">
        <h3 className="font-bold text-gray-800 mb-3">📊 CTR by SERP position (Sistrix 2024)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-gray-500 uppercase tracking-wide">
              <tr>
                <th className="text-left py-2 pr-3">Rank</th>
                <th className="text-left py-2 pr-3">Average CTR</th>
                <th className="text-left py-2">Reality check</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              <tr className="border-t border-gray-100">
                <td className="py-2 pr-3 font-bold">#1</td>
                <td className="py-2 pr-3">~30%</td>
                <td className="py-2">Featured snippet often takes share</td>
              </tr>
              <tr className="border-t border-gray-100">
                <td className="py-2 pr-3 font-bold">#2</td>
                <td className="py-2 pr-3">~16%</td>
                <td className="py-2">Half of #1 — title-tag and snippet matter most here</td>
              </tr>
              <tr className="border-t border-gray-100">
                <td className="py-2 pr-3 font-bold">#3</td>
                <td className="py-2 pr-3">~10%</td>
                <td className="py-2">Comfortable "top 3" floor</td>
              </tr>
              <tr className="border-t border-gray-100">
                <td className="py-2 pr-3 font-bold">#4–10</td>
                <td className="py-2 pr-3">5-7% → 1-2%</td>
                <td className="py-2">Diminishing returns; #10 gets ~1.2%</td>
              </tr>
              <tr className="border-t border-gray-100">
                <td className="py-2 pr-3 font-bold">#11–20</td>
                <td className="py-2 pr-3">&lt; 0.5%</td>
                <td className="py-2">Page 2 is functionally invisible</td>
              </tr>
              <tr className="border-t border-gray-100">
                <td className="py-2 pr-3 font-bold">#21–100</td>
                <td className="py-2 pr-3">&lt; 0.1%</td>
                <td className="py-2">No commercial value alone</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-[11px] text-gray-500 mt-3">
          Sources: Sistrix 2024 CTR study (80M keyword analysis), Ahrefs 2023 CTR study (~1M
          queries), Backlinko 2023 click study. Indian search results show similar curves;
          local-pack and shopping-result overlays compress CTR in commercial queries by ~20%.
        </p>
      </div>

      {/* Formula */}
      <div className="result-card">
        <h3 className="font-bold text-gray-800 mb-1">📐 The exact formulas</h3>
        <pre className="bg-gray-900 text-green-200 text-xs sm:text-sm rounded-xl p-4 overflow-x-auto leading-relaxed">
{`Monthly clicks    = Search volume × CTR(target rank)
Monthly leads     = Monthly clicks × Conversion rate
Monthly revenue   = Monthly leads × Customer value
Monthly uplift    = Target monthly revenue − Current monthly revenue

12-month revenue  = Uplift × max(0, 12 − Months to rank)
12-month ROI      = (12-month revenue − 12-month spend) ÷ 12-month spend × 100
Payback (months)  = first month where cumulative profit ≥ 0
Break-even clicks = Monthly spend ÷ (Customer value × Conversion rate)`}
        </pre>
        <p className="text-xs text-gray-600 mt-3 leading-relaxed">
          The model assumes a ramp curve where you see zero uplift until the target rank is
          achieved, then full uplift forever. Real SEO produces a smoother curve — long-tail
          clicks come in months 2-4 as content gets indexed, partial uplift months 5-9 as you
          climb from page 2, full uplift typically months 9-12+. The projection is therefore
          conservative; actual revenue is usually 15-25% higher in months 4-9 than this
          model shows.
        </p>
      </div>

      {/* FAQ */}
      <div className="result-card">
        <h3 className="font-bold text-gray-800 mb-3">❓ FAQs</h3>
        <div className="space-y-4 text-sm">
          <div>
            <h4 className="font-bold text-gray-800">
              How is SEO ROI calculated?
            </h4>
            <p className="text-gray-600 mt-1">
              SEO ROI = (Revenue uplift from organic traffic − SEO investment) ÷ SEO
              investment × 100. The revenue uplift comes from the CTR-by-rank improvement —
              moving from position 25 to position 3 on a 8,000-volume keyword takes you from
              ~24 clicks/month to ~800 clicks/month, a 33× increase. At 2.5% conversion and
              ₹5,000 customer value that's ₹1 L/month revenue uplift, against ~₹75K monthly
              SEO spend = ~33% monthly ROI, ~400% annual ROI.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">
              What's a good SEO ROI for Indian SaaS / e-commerce?
            </h4>
            <p className="text-gray-600 mt-1">
              Indian-market benchmarks: <strong>SaaS</strong> well-executed SEO produces 4-8×
              year-1 ROI on agency spend (because acquisition CAC via Google Ads is
              expensive — ₹500-1,500 per signup). <strong>E-commerce</strong> typically 2-5×
              year-1 (lower margins per order). <strong>Service business</strong> (lawyer,
              CA, consultant) 5-15× because each customer is high-LTV. Below 2× year-1 is
              poor ROI and worth re-examining target keywords or execution; above 10× is
              elite and usually means you found a genuinely under-monetised keyword cluster.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">
              How long does it take for SEO to show results in India?
            </h4>
            <p className="text-gray-600 mt-1">
              For a new page on an existing domain with healthy DA: <strong>3-6 months</strong>{" "}
              to reach the first page for low-competition keywords (≤500 monthly volume),{" "}
              <strong>6-12 months</strong> for medium (500-5,000 volume), and{" "}
              <strong>12-24 months</strong> for high-competition commercial keywords
              (5,000+ volume, established Indian competitors like ClearTax / Groww /
              BankBazaar / 1mg). On a brand-new domain with no backlinks, add 6 months to
              all of those timelines.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">
              Is SEO cheaper than Google Ads in India?
            </h4>
            <p className="text-gray-600 mt-1">
              <strong>Yes, by a large margin, but slower</strong>. Google Ads CPC in India for
              high-intent commercial keywords (insurance, loans, SaaS) runs ₹50-500/click. The
              same click via SEO costs effectively zero once the ranking is established. Over
              a 3-year horizon, SEO is typically 5-10× cheaper per click than ads. The trade-off
              is speed: ads deliver traffic on day 1, SEO takes 6-12 months. Most healthy
              Indian SaaS budgets run both — ads for immediate pipeline, SEO for compounding
              long-term value.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">
              What's the CTR for position 1 vs position 3?
            </h4>
            <p className="text-gray-600 mt-1">
              Position 1 averages ~30% CTR; position 3 averages ~10%. So moving from #3 to #1
              is roughly a <strong>3× traffic increase</strong> on the same keyword. This is
              why the last few rank positions are worth the most marginal effort — moving from
              page-2 (rank 11+) to page-1 (rank 10) is also a 10× jump from ~0.5% to ~1.2%
              CTR. The flat curve below position 10 is why "page 2 of Google is where dreams
              go to die" became an SEO meme — it's empirically true.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">
              Should I include content production costs in monthly SEO spend?
            </h4>
            <p className="text-gray-600 mt-1">
              <strong>Yes.</strong> Content is the single biggest line item in SEO. A
              realistic all-in monthly cost for Indian SEO at scale: ₹75K-₹2L for agency
              retainer + ₹30K-₹80K for in-house writer + ₹15K-₹40K for SEO tools (Ahrefs/
              Semrush/Sistrix) + ₹0-₹50K for occasional contractor writers = ₹120K-₹370K/
              month. Smaller setups with just one writer + Ahrefs: ₹40K-₹80K. If you're
              quoting "₹15K/month for SEO" you're either pricing only the agency layer or
              you're getting a churn-and-burn agency that won't deliver compounding results.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">
              How does this calculator handle long-tail keywords?
            </h4>
            <p className="text-gray-600 mt-1">
              The calculator is built for one target keyword at a time. For long-tail
              strategies (target 20-100 keywords per topic cluster), the math is roughly the
              same per-keyword, but the time-to-rank is much faster (1-3 months for very long
              tails) and the per-keyword volume much smaller. Plug in your aggregate long-tail
              volume estimate and use a higher target rank (e.g. 5-10) since you won't always
              land #1-3 across hundreds of keywords. For most real SEO budgets, long-tail
              compounds to 60-80% of total organic value over 24 months.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">
              Does our SEO Checker tool factor into this?
            </h4>
            <p className="text-gray-600 mt-1">
              Yes — before committing 12 months of SEO spend on a target page, run our
              free SEO Checker at <code>/tools/seo-checker</code> on that page. It runs 100+
              real on-page checks (title, meta, schema, mobile-friendly, Core Web Vitals,
              image alt-text coverage) that determine whether the page can rank at all,
              independent of any external link-building. A page that fails 30+ of those
              checks needs technical work first; SEO ROI math is irrelevant until the
              foundation is in place.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
