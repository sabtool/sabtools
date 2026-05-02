"use client";
import { useState, useMemo } from "react";

/**
 * FIRE Number Calculator (Financial Independence, Retire Early) — India edition
 *
 * The FIRE methodology is built on the Trinity Study's "4% Safe Withdrawal
 * Rate" — a portfolio of stocks/bonds can sustainably support 4% annual
 * withdrawal (inflation-adjusted) for ~30 years with high probability.
 *
 *   FIRE Number = Annual Expenses / SWR
 *
 * For US (4% SWR): FIRE = 25× annual expenses
 *
 * INDIA ADJUSTMENTS (verified across multiple India-focused FIRE blogs and
 * sources — Jiraaf, FinancialCalculator.io, FireCalcPro, Steadygrow,
 * Policybazaar):
 *
 *  - Inflation in India (~6%) is HIGHER than US (~2.5%)
 *  - Healthcare costs not socialized; aging-care entirely private
 *  - Investment returns more volatile but historically higher CAGR
 *
 *  → Recommended SWR for India: 3.0% to 3.5% (instead of 4%)
 *  → Recommended multiplier: 28×–33× annual expenses (instead of 25×)
 *
 * FIRE FLAVOURS (also implemented):
 *
 *  - Lean FIRE  : minimal expenses (~₹3-6L/yr in India)  → 25× lean expenses
 *  - Regular FIRE: standard expenses                      → 30× regular expenses
 *  - Fat FIRE   : luxury lifestyle (~₹50L+/yr)           → 33× fat expenses
 *  - Coast FIRE : portfolio big enough to grow to FIRE without further
 *                  contributions; current corpus × (1+r)^years_to_retire ≥ FIRE
 *  - Barista FIRE: covers ~50% of expenses; rest from part-time work
 *
 * COAST FIRE math:
 *
 *   CoastFireNumber = FIRE / (1 + realReturn)^yearsToRetirement
 *
 *   Where realReturn = (1+nominalReturn) / (1+inflation) − 1
 *
 * Sources:
 *  - Trinity Study (Cooley, Hubbard, Walz, 1998)
 *  - https://www.jiraaf.com/blogs/retirement-planning/financial-independence-retire-early-fire
 *  - https://findmcal.com/fire (India FIRE)
 *  - https://www.policybazaar.com/life-insurance/financial-independence-retire-early-fire/
 *  - "Playing With FIRE" calculator methodology
 */

export default function FireNumberCalculator() {
  const [monthlyExpense, setMonthlyExpense] = useState<number>(80_000);
  const [swr, setSwr] = useState<number>(3.5); // 3.5% safer for India
  const [currentAge, setCurrentAge] = useState<number>(30);
  const [retireAge, setRetireAge] = useState<number>(50);
  const [currentCorpus, setCurrentCorpus] = useState<number>(2_000_000);
  const [returnPct, setReturnPct] = useState<number>(12);
  const [inflationPct, setInflationPct] = useState<number>(6);

  const result = useMemo(() => {
    if (
      monthlyExpense <= 0 ||
      swr <= 0 ||
      retireAge <= currentAge ||
      returnPct <= 0
    )
      return null;

    const annualExpenses = monthlyExpense * 12;
    const yearsToRetire = retireAge - currentAge;

    // Inflation-adjusted future expenses at retirement
    const futureAnnualExpenses =
      annualExpenses * Math.pow(1 + inflationPct / 100, yearsToRetire);

    // FIRE number at TODAY's expenses (for "regular" FIRE definition)
    const fireToday = annualExpenses / (swr / 100);

    // FIRE number at RETIREMENT'S expenses (more accurate target)
    const fireAtRetirement = futureAnnualExpenses / (swr / 100);

    // Lean / Fat / Regular variants — multipliers based on adjusted expenses
    const leanFire = annualExpenses * 0.5 * 25; // 50% expenses, 25× multiplier
    const regularFire = annualExpenses * (100 / swr); // standard
    const fatFire = annualExpenses * 1.5 * 33; // 1.5× expenses, 33× multiplier

    // Real return rate (after inflation)
    const realReturn = (1 + returnPct / 100) / (1 + inflationPct / 100) - 1;

    // Coast FIRE: corpus grows by itself to fireAtRetirement
    const coastFireNumber =
      fireAtRetirement / Math.pow(1 + realReturn, yearsToRetire);

    // Barista FIRE: 50% expenses covered by portfolio
    const baristaFire = fireAtRetirement / 2;

    // Current progress
    const progressPct = Math.min(
      100,
      (currentCorpus / fireAtRetirement) * 100
    );

    // If they keep their current corpus and add NOTHING, will it reach FIRE?
    const currentToFutureValue =
      currentCorpus * Math.pow(1 + realReturn, yearsToRetire);

    // Monthly SIP needed to bridge gap (if any)
    const r = realReturn / 12;
    const n = yearsToRetire * 12;
    const gap = Math.max(0, fireAtRetirement - currentToFutureValue);
    let monthlySipNeeded = 0;
    if (gap > 0 && r !== 0) {
      const factor = ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
      monthlySipNeeded = gap / factor;
    }

    return {
      annualExpenses,
      futureAnnualExpenses,
      yearsToRetire,
      fireToday,
      fireAtRetirement,
      leanFire,
      regularFire,
      fatFire,
      coastFireNumber,
      baristaFire,
      currentToFutureValue,
      progressPct,
      gap,
      monthlySipNeeded,
      realReturn,
    };
  }, [
    monthlyExpense,
    swr,
    currentAge,
    retireAge,
    currentCorpus,
    returnPct,
    inflationPct,
  ]);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(n);

  const fmtCompact = (n: number) => {
    if (n >= 1e7) return `₹${(n / 1e7).toFixed(2)} Cr`;
    if (n >= 1e5) return `₹${(n / 1e5).toFixed(2)} L`;
    if (n >= 1e3) return `₹${(n / 1e3).toFixed(0)}K`;
    return `₹${n.toFixed(0)}`;
  };

  return (
    <div className="space-y-6">
      <div className="inline-block bg-orange-100 text-orange-800 text-sm font-semibold px-4 py-1.5 rounded-full">
        🔥 FIRE Number Calculator · India-Adjusted SWR
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">
              Monthly Expenses (today)
            </label>
            <span className="text-sm font-bold text-orange-600">
              {fmtCompact(monthlyExpense)}
            </span>
          </div>
          <input
            type="range"
            min={20_000}
            max={500_000}
            step={5_000}
            value={monthlyExpense}
            onChange={(e) => setMonthlyExpense(+e.target.value)}
            className="w-full"
          />
        </div>
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">
              Safe Withdrawal Rate (SWR)
            </label>
            <span className="text-sm font-bold text-orange-600">
              {swr.toFixed(1)}%
            </span>
          </div>
          <input
            type="range"
            min={2.5}
            max={5}
            step={0.1}
            value={swr}
            onChange={(e) => setSwr(+e.target.value)}
            className="w-full"
          />
          <p className="text-xs text-gray-500 mt-1">
            India: 3.0–3.5% safer (high inflation). 4% works for US.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">
            Current Age
          </label>
          <input
            type="number"
            value={currentAge}
            onChange={(e) => setCurrentAge(+e.target.value || 0)}
            className="calc-input"
            min={18}
            max={70}
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">
            Target Retirement Age
          </label>
          <input
            type="number"
            value={retireAge}
            onChange={(e) => setRetireAge(+e.target.value || 0)}
            className="calc-input"
            min={25}
            max={75}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">
            Current Corpus
          </label>
          <input
            type="number"
            value={currentCorpus}
            onChange={(e) => setCurrentCorpus(+e.target.value || 0)}
            className="calc-input"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">
            Expected Return %
          </label>
          <input
            type="number"
            value={returnPct}
            onChange={(e) => setReturnPct(+e.target.value || 0)}
            className="calc-input"
            step={0.5}
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">
            Inflation %
          </label>
          <input
            type="number"
            value={inflationPct}
            onChange={(e) => setInflationPct(+e.target.value || 0)}
            className="calc-input"
            step={0.5}
          />
        </div>
      </div>

      {result && (
        <div className="result-card space-y-4">
          <div className="bg-gradient-to-r from-orange-500 to-rose-600 rounded-2xl p-6 text-white">
            <div className="text-sm font-medium opacity-80 mb-1">
              Your FIRE Number (at retirement, inflation-adjusted)
            </div>
            <div className="text-4xl font-bold">
              {fmt(result.fireAtRetirement)}
            </div>
            <div className="text-sm opacity-80 mt-2">
              Today&apos;s buying power equivalent: {fmt(result.fireToday)} ·
              Annual expenses at age {retireAge}:{" "}
              {fmt(result.futureAnnualExpenses)}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex justify-between mb-2 text-sm">
              <span className="font-semibold text-gray-700">
                Progress: {result.progressPct.toFixed(1)}% of FIRE
              </span>
              <span className="text-gray-600">
                {fmtCompact(currentCorpus)} / {fmtCompact(result.fireAtRetirement)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-orange-500 to-emerald-500 h-3 transition-all"
                style={{ width: `${result.progressPct}%` }}
              />
            </div>

            {result.gap > 0 ? (
              <p className="text-xs text-gray-600 mt-3">
                Even if your current corpus grows to{" "}
                <strong>{fmtCompact(result.currentToFutureValue)}</strong> by
                age {retireAge} (at {((result.realReturn) * 100).toFixed(1)}%
                real return), you need to invest{" "}
                <strong>{fmt(result.monthlySipNeeded)}</strong> per month more
                to bridge the gap of <strong>{fmtCompact(result.gap)}</strong>.
              </p>
            ) : (
              <p className="text-xs text-emerald-700 mt-3 font-semibold">
                🎉 Your current corpus alone will exceed FIRE if it compounds
                at {((result.realReturn) * 100).toFixed(1)}% real return — no
                further contribution needed!
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">
                🪶 Lean FIRE (50% expenses, 25× multiplier)
              </div>
              <div className="text-xl font-bold text-emerald-600">
                {fmtCompact(result.leanFire)}
              </div>
              <div className="text-[10px] text-gray-500 mt-1">
                For minimalist lifestyle / very low cost-of-living city
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">
                🏡 Regular FIRE (current expenses, 1/SWR multiplier)
              </div>
              <div className="text-xl font-bold text-orange-600">
                {fmtCompact(result.regularFire)}
              </div>
              <div className="text-[10px] text-gray-500 mt-1">
                Maintain current lifestyle indefinitely
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">
                🥂 Fat FIRE (1.5× expenses, 33× multiplier)
              </div>
              <div className="text-xl font-bold text-purple-600">
                {fmtCompact(result.fatFire)}
              </div>
              <div className="text-[10px] text-gray-500 mt-1">
                Lifestyle upgrade with travel & luxury
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">
                ☕ Coast FIRE (no contributions till retirement)
              </div>
              <div className="text-xl font-bold text-blue-600">
                {fmtCompact(result.coastFireNumber)}
              </div>
              <div className="text-[10px] text-gray-500 mt-1">
                Hit this corpus today → no more savings needed
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs text-gray-700 leading-relaxed space-y-2">
        <strong>How FIRE math works:</strong>
        <ul className="list-disc list-inside ml-2 space-y-1">
          <li>
            <strong>4% Rule (US):</strong> Save 25× annual expenses → withdraw
            4% per year, inflation-adjusted, lasts 30+ years (Trinity Study).
          </li>
          <li>
            <strong>India variant (3–3.5%):</strong> 28×–33× annual expenses.
            Higher inflation (6% vs US 2.5%) and longer life expectancy demand
            a more conservative withdrawal rate.
          </li>
          <li>
            <strong>Coast FIRE</strong> = the corpus today that compounds
            (real return = nominal − inflation) to your full FIRE number at
            retirement age, without you adding a rupee more.
          </li>
          <li>
            <strong>Lean / Fat / Barista</strong> are lifestyle variations.
            Lean = strict frugality. Fat = luxury cushion. Barista = portfolio
            covers ~50%, you supplement with part-time work.
          </li>
        </ul>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 leading-relaxed">
        <span className="mr-1">⚠️</span>
        <strong>India-specific risks:</strong> healthcare inflation runs at
        ~14% per year (much higher than CPI 6%), aging-care is fully private,
        no social security pension equivalent. Build a separate medical
        emergency fund OR include healthcare in expense projections. Consider
        equity allocation gradually decreasing to bonds/SCSS/PPF as you near
        retirement (glide path strategy).
      </div>
    </div>
  );
}
