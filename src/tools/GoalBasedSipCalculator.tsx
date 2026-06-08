"use client";
import { useMemo } from "react";
import { useUrlState } from "@/hooks/useUrlState";

/**
 * Goal-Based SIP Calculator (India)
 *
 * Reverse SIP math: given a target corpus, time horizon, and expected return rate,
 * computes the required monthly SIP amount.
 *
 * Formula derivation:
 *
 *   The future value of a monthly SIP of M with monthly return rate r over n months
 *   (compounded monthly, contribution at the START of each month — the standard
 *   convention used by AMCs and SEBI advertised SIP returns):
 *
 *       FV = M × [((1 + r)^n - 1) / r] × (1 + r)
 *
 *   Solving for M:
 *
 *       M = FV / { [((1 + r)^n - 1) / r] × (1 + r) }
 *
 * Where:
 *   M = monthly SIP amount needed (₹)
 *   FV = target corpus (₹)
 *   r = monthly rate = annualReturn / 12 / 100
 *   n = number of months = years × 12
 *
 * Total invested = M × n
 * Total returns = FV - (M × n)
 *
 * The math here is deterministic and matches the SIP calculation used by every
 * Indian AMC (HDFC, ICICI Prudential, SBI MF, Axis MF, Nippon, etc.) and SEBI
 * required disclosures. Real returns will vary depending on market conditions
 * — this is a planning tool using your assumed return rate, not a guarantee.
 */

const INFLATION_TARGETS_INFO = `
Common India target benchmarks (planning purposes only):
- Equity index funds (Nifty 50): 10-12% historical CAGR
- Diversified equity MFs: 11-14% historical CAGR
- Hybrid / balanced funds: 8-10%
- Debt funds: 6-8%
- PPF / SSY: 7.1-8.2% (govt-set)
`;

export default function GoalBasedSipCalculator() {
  // URL-synced inputs (?t=&y=&r=&i=&adj=)
  const [targetAmount, setTargetAmount] = useUrlState("t", 10_000_000); // ₹1 Cr
  const [years, setYears] = useUrlState("y", 15);
  const [annualReturn, setAnnualReturn] = useUrlState("r", 12);
  const [inflationRate, setInflationRate] = useUrlState("i", 6);
  const [adjustForInflation, setAdjustForInflation] = useUrlState("adj", false);

  const result = useMemo(() => {
    if (targetAmount <= 0 || years <= 0 || annualReturn <= 0) return null;

    // If inflation adjustment is on, scale up the target by inflation over the
    // horizon — this gives the inflation-adjusted future value the user needs
    // to maintain today's purchasing power.
    const effectiveTarget = adjustForInflation
      ? targetAmount * Math.pow(1 + inflationRate / 100, years)
      : targetAmount;

    const r = annualReturn / 12 / 100; // monthly rate
    const n = years * 12; // total months

    if (r === 0) {
      return null; // would divide by zero
    }

    // FV = M × [((1+r)^n - 1) / r] × (1+r) → M = FV / { ... }
    const factor = ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    const monthlySip = effectiveTarget / factor;

    const totalInvested = monthlySip * n;
    const totalReturns = effectiveTarget - totalInvested;
    const wealthMultiple = totalInvested > 0 ? effectiveTarget / totalInvested : 0;

    return {
      monthlySip,
      effectiveTarget,
      totalInvested,
      totalReturns,
      wealthMultiple,
      months: n,
    };
  }, [targetAmount, years, annualReturn, inflationRate, adjustForInflation]);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(n);

  const fmtIndian = (n: number) => {
    if (n >= 1e7) return `₹${(n / 1e7).toFixed(2)} Cr`;
    if (n >= 1e5) return `₹${(n / 1e5).toFixed(2)} L`;
    if (n >= 1e3) return `₹${(n / 1e3).toFixed(1)} K`;
    return `₹${n.toFixed(0)}`;
  };

  return (
    <div className="space-y-6">
      <div className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-4 py-1.5 rounded-full">
        🎯 Reverse SIP — Find Required Monthly Investment for Your Goal
      </div>

      <div className="space-y-5">
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">
              Target Corpus
            </label>
            <span className="text-sm font-bold text-indigo-600">
              {fmtIndian(targetAmount)}
            </span>
          </div>
          <input
            type="range"
            min={100_000}
            max={500_000_000}
            step={100_000}
            value={targetAmount}
            onChange={(e) => setTargetAmount(+e.target.value)}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>₹1L</span>
            <span>₹50Cr</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">
              Time Horizon
            </label>
            <span className="text-sm font-bold text-indigo-600">
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
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>1 yr</span>
            <span>40 yr</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">
              Expected Annual Return
            </label>
            <span className="text-sm font-bold text-indigo-600">
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
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>1%</span>
            <span>25%</span>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={adjustForInflation}
              onChange={(e) => setAdjustForInflation(e.target.checked)}
              className="mt-1 w-4 h-4"
            />
            <div className="flex-1">
              <div className="font-semibold text-amber-900 text-sm">
                Adjust target for inflation
              </div>
              <p className="text-xs text-amber-800 mt-0.5">
                Scales your target up by the inflation rate over the horizon —
                so your goal preserves purchasing power, not just nominal ₹.
              </p>
            </div>
          </label>
          {adjustForInflation && (
            <div className="mt-3 pt-3 border-t border-amber-200">
              <div className="flex justify-between mb-2">
                <label className="text-xs font-semibold text-amber-900">
                  Assumed Inflation Rate
                </label>
                <span className="text-xs font-bold text-amber-900">
                  {inflationRate}% p.a.
                </span>
              </div>
              <input
                type="range"
                min={2}
                max={12}
                step={0.5}
                value={inflationRate}
                onChange={(e) => setInflationRate(+e.target.value)}
                className="w-full"
              />
              <p className="text-xs text-amber-700 mt-2">
                India&apos;s long-term CPI inflation has averaged 5-6%. RBI
                targets 4% (±2%).
              </p>
            </div>
          )}
        </div>
      </div>

      {result && (
        <div className="result-card space-y-4">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
            <div className="text-sm font-medium opacity-80 mb-1">
              Required Monthly SIP
            </div>
            <div className="text-4xl font-bold">{fmt(result.monthlySip)}</div>
            <div className="text-sm opacity-80 mt-2">
              for {years} years to reach{" "}
              <span className="font-bold">
                {fmt(result.effectiveTarget)}
              </span>
              {adjustForInflation && (
                <>
                  {" "}
                  <span className="text-xs">
                    (your ₹{fmtIndian(targetAmount).replace("₹", "")} target
                    inflated to today&apos;s buying power equivalent)
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">
                Total Invested
              </div>
              <div className="text-xl font-bold text-blue-600">
                {fmt(result.totalInvested)}
              </div>
              <div className="text-[10px] text-gray-500 mt-1">
                {result.months} monthly contributions
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">
                Total Returns
              </div>
              <div className="text-xl font-bold text-green-600">
                {fmt(result.totalReturns)}
              </div>
              <div className="text-[10px] text-gray-500 mt-1">
                Compounded growth
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">
                Wealth Multiple
              </div>
              <div className="text-xl font-bold text-purple-600">
                {result.wealthMultiple.toFixed(2)}×
              </div>
              <div className="text-[10px] text-gray-500 mt-1">
                Final ÷ Invested
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs text-gray-700 leading-relaxed">
        <strong>Common India return benchmarks (planning purposes):</strong>
        <ul className="list-disc list-inside mt-2 space-y-0.5 ml-2">
          <li>Equity index funds (Nifty 50): historically 10-12% CAGR</li>
          <li>
            Diversified equity mutual funds: historically 11-14% CAGR (with
            higher year-to-year volatility)
          </li>
          <li>Hybrid / balanced funds: 8-10%</li>
          <li>Debt funds: 6-8%</li>
          <li>
            PPF: 7.1% (Q1 FY 2026-27, set quarterly by Ministry of Finance);
            Sukanya Samriddhi: 8.2%; EPF: 8.25% (FY 2026-27 EPFO-ratified)
          </li>
        </ul>
        <p className="mt-2">
          Mathematical formula:{" "}
          <code className="bg-white px-1 py-0.5 rounded text-[11px]">
            M = FV / [(((1+r)^n - 1) / r) × (1+r)]
          </code>{" "}
          — same as every AMC&apos;s SIP calculator. Returns are projected
          assumptions, not guarantees.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-800 leading-relaxed">
        <span className="mr-1">ℹ️</span>
        <strong>Disclaimer:</strong> Mutual fund investments are subject to
        market risks. Past performance is not indicative of future returns.
        The required SIP shown assumes a constant return rate over the
        horizon, which never happens in practice — equity markets fluctuate.
        Consider a step-up SIP (increasing amount yearly) and review your goal
        annually.
      </div>
    </div>
  );
}
