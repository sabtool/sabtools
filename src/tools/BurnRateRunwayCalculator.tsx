"use client";
import { useMemo, useState } from "react";

/**
 * Burn Rate & Runway Calculator — the early-stage startup
 * cash-out-countdown calculator.
 *
 * Computes:
 *   - Gross burn rate (total monthly expenses)
 *   - Net burn rate (expenses minus revenue)
 *   - Runway in months (cash ÷ net burn, assuming positive net burn)
 *   - Estimated month + year of zero cash
 *   - Burn multiple (net burn ÷ net new ARR — the David Sacks Series A KPI)
 *   - Default Alive vs Default Dead (Paul Graham YC framework)
 *
 * Plus a 12-month month-by-month projection so the founder can see
 * exactly when the cash runs out and how MoM revenue growth changes
 * the picture.
 */

interface Inputs {
  cash: number;
  monthlyRevenue: number;
  monthlyExpenses: number;
  revenueGrowthMoM: number; // %
  expenseGrowthMoM: number; // %
  newArrPerMonth: number; // for burn multiple (optional)
}

interface Result {
  grossBurn: number;
  netBurn: number;
  runwayMonths: number; // Infinity if profitable
  zeroCashDate: Date | null;
  burnMultiple: number | null;
  defaultAlive: boolean | null;
  verdict: "danger" | "warn" | "good" | "great";
  verdictTitle: string;
  verdictBody: string;
  projection: ProjectionRow[];
}

interface ProjectionRow {
  month: number; // 1..N
  revenue: number;
  expenses: number;
  netBurn: number;
  cashBalance: number;
  dateLabel: string;
}

function fmtCr(n: number): string {
  if (!isFinite(n)) return "∞";
  if (n === 0) return "—";
  const abs = Math.abs(n);
  const cr = abs / 1_00_00_000;
  if (cr >= 1) return (n < 0 ? "-₹" : "₹") + cr.toFixed(2) + " Cr";
  const lakh = abs / 1_00_000;
  if (lakh >= 1) return (n < 0 ? "-₹" : "₹") + lakh.toFixed(2) + " L";
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Math.round(n)) + " ₹";
}

function fmtMonth(d: Date): string {
  return d.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
}

const VERDICTS: Record<Result["verdict"], { color: string; bg: string; border: string; emoji: string }> = {
  danger: { color: "text-red-700", bg: "bg-red-50", border: "border-red-200", emoji: "🚨" },
  warn: { color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200", emoji: "⚠️" },
  good: { color: "text-green-700", bg: "bg-green-50", border: "border-green-200", emoji: "✅" },
  great: { color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200", emoji: "🏆" },
};

function compute(i: Inputs): Result | null {
  if (i.cash <= 0 || i.monthlyExpenses <= 0) return null;

  const grossBurn = i.monthlyExpenses;
  const netBurn = i.monthlyExpenses - i.monthlyRevenue;

  // If net burn is zero/negative the company is profitable, runway = Infinity.
  const runwayMonths = netBurn <= 0 ? Infinity : i.cash / netBurn;

  // 24-month month-by-month projection (with MoM growth).
  const projection: ProjectionRow[] = [];
  let cashBalance = i.cash;
  let rev = i.monthlyRevenue;
  let exp = i.monthlyExpenses;
  const rg = i.revenueGrowthMoM / 100;
  const eg = i.expenseGrowthMoM / 100;
  const today = new Date();
  for (let m = 1; m <= 24; m++) {
    rev = rev * (1 + rg);
    exp = exp * (1 + eg);
    const monthNetBurn = exp - rev;
    cashBalance -= monthNetBurn;
    const d = new Date(today.getFullYear(), today.getMonth() + m, 1);
    projection.push({
      month: m,
      revenue: rev,
      expenses: exp,
      netBurn: monthNetBurn,
      cashBalance,
      dateLabel: fmtMonth(d),
    });
    if (cashBalance <= 0) break;
  }

  // Find the month where cash goes negative.
  const zeroCashRow = projection.find((r) => r.cashBalance <= 0);
  const zeroCashDate = zeroCashRow ? new Date(today.getFullYear(), today.getMonth() + zeroCashRow.month, 1) : null;

  // Default Alive — if MoM revenue growth, do we cross profitability before cash runs out?
  let defaultAlive: boolean | null = null;
  if (i.revenueGrowthMoM > 0 || i.expenseGrowthMoM !== 0) {
    const breakEvenRow = projection.find((r) => r.netBurn <= 0);
    defaultAlive = !!breakEvenRow;
  }

  // Burn multiple (David Sacks framework): net burn / net new ARR added in same period.
  let burnMultiple: number | null = null;
  if (i.newArrPerMonth > 0 && netBurn > 0) {
    burnMultiple = netBurn / i.newArrPerMonth;
  }

  // Verdict band based on runway.
  let verdict: Result["verdict"];
  let verdictTitle = "";
  let verdictBody = "";
  if (!isFinite(runwayMonths)) {
    verdict = "great";
    verdictTitle = "Profitable — infinite runway";
    verdictBody =
      "Net burn is zero or negative — you're cash-flow positive. You don't need to raise. " +
      "If you do raise, it's for acceleration (hiring, channel expansion) rather than survival. " +
      "Top Indian SaaS examples here: Zoho (bootstrapped to billions), Zerodha, profitable Tally.";
  } else if (runwayMonths < 6) {
    verdict = "danger";
    verdictTitle = "Critical — less than 6 months";
    verdictBody =
      "You're in the emergency zone. Three options, all painful: (1) cut burn by 30-50% in 30 days, " +
      "(2) raise bridge financing via SAFE/CCD from existing investors, or (3) accelerate revenue " +
      "via paid customer prepayments. Indian seed founders in this zone typically negotiate bridge " +
      "rounds at flat or 10-20% down valuation. Do NOT wait — every month of indecision costs " +
      "more equity at the eventual round.";
  } else if (runwayMonths < 12) {
    verdict = "warn";
    verdictTitle = "Below benchmark — start raising now";
    verdictBody =
      "Indian seed/Series A norm is 18-24 months runway. At 6-12 months you're in the start-raising-yesterday " +
      "zone. Most Indian VCs (Accel, Lightspeed, Peak XV) take 3-4 months from first call to wire, " +
      "so you need to launch the round at 9-12 months runway minimum. Below 9 months you're " +
      "negotiating from weakness — the 'desperate founder' tax can be 20-30% of valuation.";
  } else if (runwayMonths < 18) {
    verdict = "good";
    verdictTitle = "Healthy runway — plan next round";
    verdictBody =
      "12-18 months is the standard Indian Series A runway. You're in the comfortable zone — " +
      "next move is to start mapping which VCs you'll talk to and what your numbers need to " +
      "look like at first call. The right time to start raising is when you have 12-15 months " +
      "left; that gives you 3-4 months of process time and lands the wire with 6-9 months in " +
      "the tank.";
  } else {
    verdict = "great";
    verdictTitle = "Strong runway — execution focus";
    verdictBody =
      "18+ months is the post-Series-A target most Indian VCs design rounds around. You have " +
      "the cash to execute without raising-distraction. Best use of this period: drive metrics " +
      "(growth, gross margin, NRR) to the levels that get you 30-40% premium on your next round.";
  }

  return {
    grossBurn,
    netBurn,
    runwayMonths,
    zeroCashDate,
    burnMultiple,
    defaultAlive,
    verdict,
    verdictTitle,
    verdictBody,
    projection,
  };
}

export default function BurnRateRunwayCalculator() {
  const [cash, setCash] = useState("20000000"); // ₹2 Cr default
  const [monthlyRevenue, setMonthlyRevenue] = useState("300000"); // ₹3 L MRR
  const [monthlyExpenses, setMonthlyExpenses] = useState("1500000"); // ₹15 L
  const [revenueGrowthMoM, setRevenueGrowthMoM] = useState("10");
  const [expenseGrowthMoM, setExpenseGrowthMoM] = useState("3");
  const [newArrPerMonth, setNewArrPerMonth] = useState("");

  const result = useMemo(
    () =>
      compute({
        cash: parseFloat(cash) || 0,
        monthlyRevenue: parseFloat(monthlyRevenue) || 0,
        monthlyExpenses: parseFloat(monthlyExpenses) || 0,
        revenueGrowthMoM: parseFloat(revenueGrowthMoM) || 0,
        expenseGrowthMoM: parseFloat(expenseGrowthMoM) || 0,
        newArrPerMonth: parseFloat(newArrPerMonth) || 0,
      }),
    [cash, monthlyRevenue, monthlyExpenses, revenueGrowthMoM, expenseGrowthMoM, newArrPerMonth]
  );

  const v = result ? VERDICTS[result.verdict] : VERDICTS.good;

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="result-card">
        <h3 className="font-bold text-gray-800 mb-1">💰 Cash position + monthly flows</h3>
        <p className="text-xs text-gray-500 mb-4">
          Enter today's cash balance and your monthly revenue / expense run rate. Indian seed
          benchmark: ~₹2 Cr raised, ~₹15-20 L monthly burn, ~24 months runway target.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">
              Current cash balance (₹)
            </label>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              value={cash}
              onChange={(e) => setCash(e.target.value)}
              className="calc-input"
              placeholder="e.g. 20000000 (₹2 Cr)"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              Bank balance + bank-equivalent. Exclude receivables.
            </p>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">
              Monthly revenue (₹)
            </label>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              value={monthlyRevenue}
              onChange={(e) => setMonthlyRevenue(e.target.value)}
              className="calc-input"
              placeholder="e.g. 300000"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              Cash-basis MRR. Use 0 if pre-revenue.
            </p>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">
              Monthly total expenses (₹)
            </label>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              value={monthlyExpenses}
              onChange={(e) => setMonthlyExpenses(e.target.value)}
              className="calc-input"
              placeholder="e.g. 1500000"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              All-in: salaries + tools + ads + rent + tax.
            </p>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">
              New ARR added per month (₹) — optional
            </label>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              value={newArrPerMonth}
              onChange={(e) => setNewArrPerMonth(e.target.value)}
              className="calc-input"
              placeholder="e.g. 100000"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              Net new ARR added monthly — for the burn-multiple metric.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">
              MoM revenue growth (%) — optional
            </label>
            <input
              type="number"
              inputMode="decimal"
              step={0.1}
              value={revenueGrowthMoM}
              onChange={(e) => setRevenueGrowthMoM(e.target.value)}
              className="calc-input"
              placeholder="e.g. 10"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              Series A healthy: 10-15% MoM. Compound effect over 24 months is enormous.
            </p>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">
              MoM expense growth (%) — optional
            </label>
            <input
              type="number"
              inputMode="decimal"
              step={0.1}
              value={expenseGrowthMoM}
              onChange={(e) => setExpenseGrowthMoM(e.target.value)}
              className="calc-input"
              placeholder="e.g. 3"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              Hiring + tool stack growth. Most startups: 2-5% MoM.
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
                Gross burn
              </div>
              <div className="text-2xl font-extrabold text-indigo-900 mt-1">
                {fmtCr(result.grossBurn)}
              </div>
              <div className="text-[11px] text-indigo-700 mt-1">total monthly expenses</div>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 text-center">
              <div className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
                Net burn
              </div>
              <div className="text-2xl font-extrabold text-amber-900 mt-1">
                {fmtCr(result.netBurn)}
              </div>
              <div className="text-[11px] text-amber-700 mt-1">
                {result.netBurn <= 0 ? "profitable" : "expenses − revenue / month"}
              </div>
            </div>
            <div className={`${v.bg} border-2 ${v.border} rounded-2xl p-4 text-center`}>
              <div className={`text-xs font-semibold uppercase tracking-wider ${v.color}`}>
                Runway
              </div>
              <div className={`text-2xl font-extrabold mt-1 ${v.color}`}>
                {isFinite(result.runwayMonths) ? `${result.runwayMonths.toFixed(1)} mo` : "∞"}
              </div>
              <div className={`text-[11px] mt-1 ${v.color}`}>
                {result.zeroCashDate ? `zero cash by ${fmtMonth(result.zeroCashDate)}` : "no cash-out date"}
              </div>
            </div>
          </div>

          <div className={`${v.bg} border ${v.border} rounded-2xl p-5`}>
            <h3 className={`font-bold text-lg ${v.color}`}>
              {v.emoji} {result.verdictTitle}
            </h3>
            <p className={`mt-2 text-sm leading-relaxed ${v.color}`}>{result.verdictBody}</p>

            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-white/60 rounded-lg p-2 text-center">
                <div className="font-bold text-gray-800">
                  {result.burnMultiple !== null
                    ? `${result.burnMultiple.toFixed(2)}×`
                    : "—"}
                </div>
                <div className="text-gray-500">burn multiple</div>
              </div>
              <div className="bg-white/60 rounded-lg p-2 text-center">
                <div className="font-bold text-gray-800">
                  {result.defaultAlive === null
                    ? "—"
                    : result.defaultAlive
                      ? "✅ Alive"
                      : "❌ Dead"}
                </div>
                <div className="text-gray-500">default status</div>
              </div>
              <div className="bg-white/60 rounded-lg p-2 text-center">
                <div className="font-bold text-gray-800">
                  {isFinite(result.runwayMonths)
                    ? Math.max(0, Math.floor(result.runwayMonths - 3))
                    : "—"}
                </div>
                <div className="text-gray-500">months to raise</div>
              </div>
              <div className="bg-white/60 rounded-lg p-2 text-center">
                <div className="font-bold text-gray-800">
                  {fmtCr(result.grossBurn * 12)}
                </div>
                <div className="text-gray-500">annual burn</div>
              </div>
            </div>
          </div>

          {/* 24-month projection table */}
          <div className="result-card">
            <h3 className="font-bold text-gray-800 mb-3">📅 24-month cash projection</h3>
            <p className="text-xs text-gray-500 mb-3">
              Month-by-month projection assuming your MoM revenue and expense growth
              continue. The row where the cash balance turns red is the month you run out.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="text-gray-500 uppercase tracking-wide">
                  <tr>
                    <th className="text-left py-2 pr-2">Month</th>
                    <th className="text-left py-2 pr-2">Date</th>
                    <th className="text-right py-2 pr-2">Revenue</th>
                    <th className="text-right py-2 pr-2">Expenses</th>
                    <th className="text-right py-2 pr-2">Net burn</th>
                    <th className="text-right py-2">Cash balance</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  {result.projection.slice(0, 24).map((row, idx) => {
                    const negative = row.cashBalance <= 0;
                    const lowAlert =
                      row.cashBalance > 0 && row.cashBalance < result.grossBurn * 3;
                    return (
                      <tr
                        key={idx}
                        className={`border-t border-gray-100 ${
                          negative ? "bg-red-50" : lowAlert ? "bg-amber-50" : ""
                        }`}
                      >
                        <td className="py-1.5 pr-2 font-bold">M{row.month}</td>
                        <td className="py-1.5 pr-2">{row.dateLabel}</td>
                        <td className="py-1.5 pr-2 text-right tabular-nums">
                          {fmtCr(row.revenue)}
                        </td>
                        <td className="py-1.5 pr-2 text-right tabular-nums">
                          {fmtCr(row.expenses)}
                        </td>
                        <td
                          className={`py-1.5 pr-2 text-right tabular-nums ${
                            row.netBurn <= 0 ? "text-green-700 font-bold" : ""
                          }`}
                        >
                          {fmtCr(row.netBurn)}
                        </td>
                        <td
                          className={`py-1.5 text-right font-bold tabular-nums ${
                            negative ? "text-red-700" : lowAlert ? "text-amber-700" : ""
                          }`}
                        >
                          {fmtCr(row.cashBalance)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center text-sm text-gray-500">
          Enter your cash balance and monthly expenses to see runway, burn rate and the
          24-month projection.
        </div>
      )}

      {/* Runway benchmarks */}
      <div className="result-card">
        <h3 className="font-bold text-gray-800 mb-3">📊 Indian startup runway benchmarks</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-gray-500 uppercase tracking-wide">
              <tr>
                <th className="text-left py-2 pr-3">Stage</th>
                <th className="text-left py-2 pr-3">Typical runway</th>
                <th className="text-left py-2 pr-3">Burn multiple target</th>
                <th className="text-left py-2">Cash raised</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              <tr className="border-t border-gray-100">
                <td className="py-2 pr-3 font-bold">Pre-seed / Angel</td>
                <td className="py-2 pr-3">12–18 months</td>
                <td className="py-2 pr-3">N/A (pre-revenue)</td>
                <td className="py-2">₹50 L – ₹3 Cr</td>
              </tr>
              <tr className="border-t border-gray-100">
                <td className="py-2 pr-3 font-bold">Seed</td>
                <td className="py-2 pr-3">18–24 months</td>
                <td className="py-2 pr-3">&lt; 3.0 (early days)</td>
                <td className="py-2">₹3 Cr – ₹10 Cr</td>
              </tr>
              <tr className="border-t border-gray-100">
                <td className="py-2 pr-3 font-bold">Series A</td>
                <td className="py-2 pr-3">24–30 months</td>
                <td className="py-2 pr-3">&lt; 2.0</td>
                <td className="py-2">₹15 Cr – ₹50 Cr</td>
              </tr>
              <tr className="border-t border-gray-100">
                <td className="py-2 pr-3 font-bold">Series B</td>
                <td className="py-2 pr-3">24–36 months</td>
                <td className="py-2 pr-3">&lt; 1.5 (Sacks "amazing" zone)</td>
                <td className="py-2">₹50 Cr – ₹200 Cr</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-[11px] text-gray-500 mt-3">
          Benchmarks from Indian VC fund decks (3one4, Blume, India Quotient, Accel India, Peak XV) and the
          David Sacks "Burn Multiple" Series A framework. Bear-market rounds typically design for
          even longer runway (30-36 months) to skip a fundraise cycle.
        </p>
      </div>

      {/* Formula */}
      <div className="result-card">
        <h3 className="font-bold text-gray-800 mb-1">📐 The exact formulas</h3>
        <pre className="bg-gray-900 text-green-200 text-xs sm:text-sm rounded-xl p-4 overflow-x-auto leading-relaxed">
{`Gross burn           = Total monthly expenses
Net burn             = Monthly expenses − Monthly revenue
Runway (months)      = Current cash ÷ Net burn
Zero-cash date       = Today + Runway months
Burn multiple        = Net burn ÷ Net new ARR (same period)
Default Alive (YC)   = Will you cross break-even before cash runs out?`}
        </pre>
        <p className="text-xs text-gray-600 mt-3 leading-relaxed">
          The two frameworks built into this calculator: <strong>Paul Graham's Default Alive vs Dead</strong>
          {" "}(YC 2015 essay) projects MoM revenue growth forward and asks whether you reach break-even before
          running out of cash. <strong>David Sacks' Burn Multiple</strong> (Craft Ventures 2020) divides net
          burn by net new ARR added in the same period — under 1.0 is "amazing", 1-2 "great", 2-3 "okay", and
          above 3 is "suspect". Both are the standard Indian VC questions at every board meeting.
        </p>
      </div>

      {/* FAQ */}
      <div className="result-card">
        <h3 className="font-bold text-gray-800 mb-3">❓ FAQs</h3>
        <div className="space-y-4 text-sm">
          <div>
            <h4 className="font-bold text-gray-800">
              What's the difference between gross burn and net burn?
            </h4>
            <p className="text-gray-600 mt-1">
              <strong>Gross burn</strong> is your total monthly expenses — what leaves the bank
              account regardless of revenue. <strong>Net burn</strong> is gross burn minus revenue —
              how much cash you're actually losing. A SaaS with ₹15 L monthly expenses and ₹3 L MRR
              has a gross burn of ₹15 L but a net burn of ₹12 L. Indian VCs always ask for both —
              net for runway math, gross for cost structure understanding. If you only quote one, quote
              net.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">
              What's a healthy runway for an Indian seed-stage startup?
            </h4>
            <p className="text-gray-600 mt-1">
              <strong>18-24 months</strong> is the Indian seed-fund standard (3one4, Blume, India Quotient,
              Lightspeed seed). Most seed rounds in India are structured to give the founder exactly that —
              if you're raising ₹5 Cr at ₹20 L monthly burn, that's exactly 25 months of runway. Anything
              under 18 months at seed is considered "too tight" and forces a back-to-back Series A fundraise
              before the metrics have time to mature.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">
              When should I start raising my next round?
            </h4>
            <p className="text-gray-600 mt-1">
              <strong>When you have 9-12 months runway left</strong>. Indian VC processes take 3-4
              months from first call to wire transfer (longer in bear markets). Below 9 months and
              you're negotiating from weakness — the "desperate founder" tax is real and typically
              costs 20-30% of valuation. Below 6 months and existing investors usually have to bridge
              you with a SAFE/CCD, which sets a punitive valuation floor for the next round. The rule:
              raise when you don't need to, not when you do.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">
              What is the burn multiple and why does it matter?
            </h4>
            <p className="text-gray-600 mt-1">
              The burn multiple (David Sacks, Craft Ventures 2020) is{" "}
              <code className="bg-gray-100 px-1.5 py-0.5 rounded">net burn ÷ net new ARR</code> in the
              same period. It tells you how efficiently you're converting cash into recurring revenue.
              Sacks' bands: <strong>&lt;1.0 amazing, 1-1.5 great, 1.5-2 good, 2-3 suspect, &gt;3
              bad</strong>. It became the dominant SaaS efficiency metric post-2022 when growth-at-all-costs
              fell out of favour. A startup with ₹12 L net burn adding ₹6 L of new ARR per month
              has a burn multiple of 2.0 — okay but worth optimising.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">
              What is "Default Alive" vs "Default Dead"?
            </h4>
            <p className="text-gray-600 mt-1">
              From Paul Graham's 2015 YC essay: a startup is <strong>Default Alive</strong> if,
              assuming current growth and expense trajectories continue, it reaches profitability
              before cash runs out. <strong>Default Dead</strong> means cash runs out first. The
              critical insight is that <em>most founders don't know which side they're on</em> — they
              assume "we'll raise" without checking the math. This calculator's 24-month projection
              shows you exactly which side of the line you're on, given your current numbers.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">
              How do I cut burn quickly without killing growth?
            </h4>
            <p className="text-gray-600 mt-1">
              Indian seed-stage burn typically sits in 3 buckets: <strong>(60%) salaries</strong>,
              <strong> (20%) ads</strong>, <strong>(10%) tools + cloud</strong>, <strong>(10%) rent +
              other</strong>. The fastest cuts: (1) pause all paid acquisition above your CAC payback
              threshold — usually 30-40% of ads spend is below the ROI line; (2) audit the tool stack —
              ~40% of SaaS tools at most startups are under-used; (3) move team to remote-first / hybrid
              and exit the lease at next break point; (4) defer hires by 90 days. These typically recover
              25-40% of monthly burn without touching the growth motion.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">
              Should I include founder salaries in burn?
            </h4>
            <p className="text-gray-600 mt-1">
              <strong>Yes</strong>. If founders are drawing a salary (even a token ₹50 K/month), that's
              gross burn. Investors will ask. Indian seed-founders typically draw ₹25 K – ₹1 L per month;
              Series A founders draw ₹1.5 L – ₹3 L. The bigger question is whether founders are skipping
              salary entirely (capex-style equity-only mode) — that's not sustainable past 6-12 months
              and creates personal financial stress that distorts decision-making. Most India VCs
              actively encourage paying founders enough to remove the survival distraction.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">
              What if my revenue is lumpy (annual contracts paid upfront)?
            </h4>
            <p className="text-gray-600 mt-1">
              Use <strong>cash-basis MRR</strong> (annual contract value ÷ 12), not the upfront-payment
              spike. The cash spike improves your cash balance but doesn't change your underlying
              burn picture. Many Indian SaaS founders look at a bank balance spike and conclude they
              don't need to raise, then 6 months later realise they were paying out ₹15 L/mo against
              ₹2 L of monthly recognized revenue. This calculator assumes you've already smoothed
              annual contracts into monthly revenue.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
