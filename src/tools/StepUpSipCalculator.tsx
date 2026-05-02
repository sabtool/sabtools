"use client";
import { useState, useMemo } from "react";

/**
 * Step-Up SIP Calculator (Top-Up SIP / SIP with annual increase)
 *
 * In a regular SIP the monthly contribution is constant. In a Step-Up SIP
 * the monthly contribution increases by a fixed percentage every year —
 * matching the typical investor's salary growth and dramatically increasing
 * final corpus without any extra discipline beyond the original commitment.
 *
 * Why step-up matters (rough intuition):
 *   - 10% step-up on a 20-year SIP roughly DOUBLES the final corpus vs flat SIP
 *   - because the bulk of contribution lands in later years when each rupee
 *     has less time to compound — but you're contributing far more rupees
 *
 * Math:
 *
 *   There is no simple closed-form for step-up SIP because the contribution
 *   schedule changes each year. We simulate month-by-month with the standard
 *   SIP convention used by Indian AMCs: contribution at the START of each
 *   month, compounded at monthly rate r = (annualReturn / 12 / 100).
 *
 *   For each month i (1-indexed):
 *     year = floor((i - 1) / 12) + 1
 *     monthlyAmt = startSip × (1 + step)^(year - 1)
 *     balance = (balance + monthlyAmt) × (1 + r)
 *
 *   Total invested = sum of all monthlyAmt across n months
 *   Returns = final balance − total invested
 *
 * This matches the calculation used by Groww, Zerodha, ClearTax, Nippon
 * India MF and other AMC step-up SIP calculators.
 *
 * Sources:
 *  - https://groww.in/calculators/step-up-sip-calculator
 *  - https://zerodha.com/calculators/step-up-sip-calculator/
 *  - https://cleartax.in/s/step-up-sip-calculator
 */

export default function StepUpSipCalculator() {
  const [startSip, setStartSip] = useState<number>(10_000);
  const [years, setYears] = useState<number>(15);
  const [annualReturn, setAnnualReturn] = useState<number>(12);
  const [stepUpPct, setStepUpPct] = useState<number>(10);

  const result = useMemo(() => {
    if (startSip <= 0 || years <= 0 || annualReturn <= 0) return null;

    const r = annualReturn / 12 / 100; // monthly rate
    const n = years * 12; // total months
    const step = stepUpPct / 100;

    let balance = 0;
    let totalInvested = 0;
    const yearlyRows: {
      year: number;
      monthlySip: number;
      contributedThisYear: number;
      cumulativeInvested: number;
      yearEndBalance: number;
    }[] = [];

    for (let year = 1; year <= years; year++) {
      const monthlyAmt = startSip * Math.pow(1 + step, year - 1);
      let yearContribution = 0;

      // Run 12 months (or fewer if last partial year — not needed here)
      for (let m = 0; m < 12; m++) {
        balance = (balance + monthlyAmt) * (1 + r);
        totalInvested += monthlyAmt;
        yearContribution += monthlyAmt;
      }

      yearlyRows.push({
        year,
        monthlySip: monthlyAmt,
        contributedThisYear: yearContribution,
        cumulativeInvested: totalInvested,
        yearEndBalance: balance,
      });
    }

    // Compare to flat SIP for the same starting amount
    let flatBalance = 0;
    let flatInvested = 0;
    for (let i = 0; i < n; i++) {
      flatBalance = (flatBalance + startSip) * (1 + r);
      flatInvested += startSip;
    }
    const flatReturns = flatBalance - flatInvested;

    return {
      finalBalance: balance,
      totalInvested,
      returns: balance - totalInvested,
      yearlyRows,
      flatBalance,
      flatInvested,
      flatReturns,
      extraCorpus: balance - flatBalance,
    };
  }, [startSip, years, annualReturn, stepUpPct]);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(n);

  const fmtCompact = (n: number) => {
    if (n >= 1e7) return `₹${(n / 1e7).toFixed(2)} Cr`;
    if (n >= 1e5) return `₹${(n / 1e5).toFixed(2)} L`;
    if (n >= 1e3) return `₹${(n / 1e3).toFixed(1)}K`;
    return `₹${n.toFixed(0)}`;
  };

  return (
    <div className="space-y-6">
      <div className="inline-block bg-emerald-100 text-emerald-800 text-sm font-semibold px-4 py-1.5 rounded-full">
        🚀 Step-Up SIP / Top-Up SIP Calculator
      </div>

      <div className="space-y-5">
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">
              Starting Monthly SIP
            </label>
            <span className="text-sm font-bold text-emerald-600">
              {fmtCompact(startSip)}
            </span>
          </div>
          <input
            type="range"
            min={500}
            max={500_000}
            step={500}
            value={startSip}
            onChange={(e) => setStartSip(+e.target.value)}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>₹500</span>
            <span>₹5L</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">
              Investment Duration
            </label>
            <span className="text-sm font-bold text-emerald-600">
              {years} years
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={40}
            step={1}
            value={years}
            onChange={(e) => setYears(+e.target.value)}
            className="w-full"
          />
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">
              Expected Annual Return
            </label>
            <span className="text-sm font-bold text-emerald-600">
              {annualReturn}% p.a.
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={25}
            step={0.5}
            value={annualReturn}
            onChange={(e) => setAnnualReturn(+e.target.value)}
            className="w-full"
          />
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">
              Annual Step-Up %
            </label>
            <span className="text-sm font-bold text-emerald-600">
              {stepUpPct}% per year
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={30}
            step={1}
            value={stepUpPct}
            onChange={(e) => setStepUpPct(+e.target.value)}
            className="w-full"
          />
          <p className="text-xs text-gray-500 mt-1">
            Recommended: 5–10% per year matches typical Indian salary growth.
          </p>
        </div>
      </div>

      {result && (
        <div className="result-card space-y-4">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 text-white">
            <div className="text-sm font-medium opacity-80 mb-1">
              Maturity Corpus After {years} years
            </div>
            <div className="text-4xl font-bold">
              {fmt(result.finalBalance)}
            </div>
            <div className="text-sm opacity-80 mt-2">
              Invested {fmt(result.totalInvested)} · Earned{" "}
              <span className="font-bold">{fmt(result.returns)}</span> in
              returns
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">
                Total Invested
              </div>
              <div className="text-xl font-bold text-blue-600">
                {fmtCompact(result.totalInvested)}
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">
                Total Returns
              </div>
              <div className="text-xl font-bold text-green-600">
                {fmtCompact(result.returns)}
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">
                Wealth Multiple
              </div>
              <div className="text-xl font-bold text-purple-600">
                {(result.finalBalance / result.totalInvested).toFixed(2)}×
              </div>
            </div>
          </div>

          {stepUpPct > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
              <div className="text-sm font-bold text-amber-900 mb-2">
                💡 Step-Up Bonus
              </div>
              <div className="text-xs text-amber-800 leading-relaxed">
                With {stepUpPct}% annual step-up your corpus is{" "}
                <strong>{fmtCompact(result.extraCorpus)}</strong> bigger than a
                flat ₹{fmtCompact(startSip).replace("₹", "")}/month SIP for the
                same {years} years. Flat SIP would give only{" "}
                <strong>{fmtCompact(result.flatBalance)}</strong>.
              </div>
            </div>
          )}

          <div>
            <h3 className="font-semibold text-gray-800 mb-3">
              Year-by-Year Breakdown
            </h3>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-2 font-semibold text-gray-700">
                        Year
                      </th>
                      <th className="text-right p-2 font-semibold text-gray-700">
                        Monthly SIP
                      </th>
                      <th className="text-right p-2 font-semibold text-gray-700">
                        Contributed
                      </th>
                      <th className="text-right p-2 font-semibold text-gray-700">
                        Cumulative Invested
                      </th>
                      <th className="text-right p-2 font-semibold text-gray-700">
                        Year-End Balance
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.yearlyRows.map((row) => (
                      <tr
                        key={row.year}
                        className="border-t hover:bg-gray-50"
                      >
                        <td className="p-2 font-medium text-gray-900">
                          {row.year}
                        </td>
                        <td className="p-2 text-right text-gray-700">
                          {fmtCompact(row.monthlySip)}
                        </td>
                        <td className="p-2 text-right text-blue-600">
                          {fmtCompact(row.contributedThisYear)}
                        </td>
                        <td className="p-2 text-right text-gray-600">
                          {fmtCompact(row.cumulativeInvested)}
                        </td>
                        <td className="p-2 text-right text-emerald-700 font-semibold">
                          {fmtCompact(row.yearEndBalance)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs text-gray-700 leading-relaxed space-y-2">
        <strong>How step-up SIP math works:</strong>
        <ul className="list-disc list-inside ml-2 space-y-1">
          <li>
            Year 1 SIP = your starting amount. Each subsequent year,
            multiply by (1 + step%).
          </li>
          <li>
            Standard convention: contribution at start of each month,
            compounded monthly at r = (annual return ÷ 12). Same as every
            Indian AMC&apos;s SIP calculator.
          </li>
          <li>
            10% step-up on a 20-year SIP roughly doubles final corpus vs flat
            SIP — because total rupees contributed increases significantly
            even though later contributions have less time to compound.
          </li>
          <li>
            Practical implementation: most AMCs (HDFC, SBI, ICICI, Axis,
            Nippon, Kotak) accept step-up SIP via SIP Plus / SIP Top-Up.
            Set & forget — bank auto-debit increases each year.
          </li>
        </ul>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-800 leading-relaxed">
        <span className="mr-1">ℹ️</span>
        <strong>Disclaimer:</strong> Mutual fund investments are subject to
        market risk. Past returns don&apos;t guarantee future returns. The
        constant return assumption never matches reality — equity markets
        fluctuate ±20% per year. Consider step-up % aligned with your
        expected salary growth (typically 8–12% in India). Review yearly.
      </div>
    </div>
  );
}
