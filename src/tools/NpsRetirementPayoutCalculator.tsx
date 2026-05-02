"use client";
import { useState, useMemo } from "react";

/**
 * NPS Retirement Payout Calculator (India · Tier I)
 *
 * The National Pension System (NPS) is a Govt-of-India retirement scheme
 * regulated by PFRDA. At age 60 (or earlier exit at 50+ with reduced
 * benefits), the accumulated corpus must be split into:
 *
 *  - LUMP-SUM withdrawal: up to 60% of corpus (TAX-FREE)
 *  - ANNUITY purchase: minimum 40% of corpus (taxable as pension income)
 *
 * VERIFIED RULES (FY 2025-26):
 *
 *  - Tier I account is the long-term retirement account (eligible for
 *    80CCD(1), 80CCD(1B) ₹50K, 80CCD(2) employer 10% of salary)
 *  - At age 60: 60% corpus is tax-free withdrawal, 40% MUST go to annuity
 *  - Small corpus rule: if total corpus ≤ ₹5 lakh, 100% can be withdrawn
 *    (no annuity required)
 *  - Annuity is purchased from one of the empanelled life insurance
 *    companies (LIC, HDFC Life, ICICI Pru, SBI Life, Bajaj Allianz, etc.)
 *  - Annuity options:
 *      A. Annuity for life
 *      B. Annuity for life with return of purchase price (ROP)
 *      C. Annuity for life with 50% to spouse + ROP
 *      D. Joint life annuity (both subscriber + spouse)
 *  - Annuity rates currently range 5.5% to 7.5% depending on option chosen
 *    and age at purchase (verify with annuity provider for current rates)
 *
 * NEW NPS WITHDRAWAL RULES (Aug 2024 amendment):
 *  - Subscribers can now opt for SLW (Systematic Lump-sum Withdrawal):
 *    instead of full lump-sum, withdraw the 60% portion in monthly /
 *    quarterly / annual instalments till age 75
 *  - Provides flexibility while keeping money invested
 *
 * Calculation:
 *
 *   Corpus Accumulation (during contribution years):
 *     FV = M × [((1+r)^n - 1) / r] × (1+r)
 *     where M = monthly contribution, r = monthly rate, n = months
 *
 *   At retirement:
 *     LumpSum = corpus × lumpSumPct
 *     AnnuityCorpus = corpus × (1 - lumpSumPct)
 *     MonthlyPension = AnnuityCorpus × (annuityRate / 12)
 *
 * Sources:
 *  - https://npstrust.org.in (PFRDA NPS Trust)
 *  - https://cleartax.in/s/nps-calculator
 *  - https://www.hdfcpension.com/nps-calculator/
 *  - https://1finance.co.in/blog/new-nps-withdrawal-rules-taxation/
 *  - PFRDA notification on SLW (August 2024)
 */

export default function NpsRetirementPayoutCalculator() {
  const [currentAge, setCurrentAge] = useState<number>(30);
  const [retireAge, setRetireAge] = useState<number>(60);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(10_000);
  const [existingCorpus, setExistingCorpus] = useState<number>(0);
  const [returnPct, setReturnPct] = useState<number>(10);
  const [lumpSumPct, setLumpSumPct] = useState<number>(60);
  const [annuityRate, setAnnuityRate] = useState<number>(6.5);

  const result = useMemo(() => {
    if (
      currentAge < 18 ||
      retireAge <= currentAge ||
      retireAge > 75 ||
      monthlyContribution < 0 ||
      returnPct <= 0
    )
      return null;

    const yearsToRetire = retireAge - currentAge;
    const r = returnPct / 12 / 100;
    const n = yearsToRetire * 12;

    // FV of monthly SIP (start-of-month convention)
    let fvContributions = 0;
    if (r === 0) {
      fvContributions = monthlyContribution * n;
    } else {
      fvContributions =
        monthlyContribution * (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
    }

    // FV of existing corpus (annual compounding)
    const fvExisting =
      existingCorpus * Math.pow(1 + returnPct / 100, yearsToRetire);

    const totalCorpus = fvContributions + fvExisting;

    // Small corpus rule: if ≤ ₹5L, 100% withdrawable
    const smallCorpus = totalCorpus <= 500_000;
    const effectiveLumpSumPct = smallCorpus ? 100 : lumpSumPct;
    const lumpSum = totalCorpus * (effectiveLumpSumPct / 100);
    const annuityCorpus = totalCorpus - lumpSum;

    // Monthly pension = annuity corpus × annuity rate / 12
    const monthlyPension = annuityCorpus * (annuityRate / 100 / 12);
    const annualPension = monthlyPension * 12;

    // Total contribution
    const totalContribution = monthlyContribution * n + existingCorpus;
    const wealthMultiple = totalCorpus / totalContribution;

    return {
      totalCorpus,
      fvContributions,
      fvExisting,
      lumpSum,
      annuityCorpus,
      monthlyPension,
      annualPension,
      effectiveLumpSumPct,
      smallCorpus,
      yearsToRetire,
      totalContribution,
      wealthMultiple,
    };
  }, [
    currentAge,
    retireAge,
    monthlyContribution,
    existingCorpus,
    returnPct,
    lumpSumPct,
    annuityRate,
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
      <div className="inline-block bg-indigo-100 text-indigo-800 text-sm font-semibold px-4 py-1.5 rounded-full">
        🏛️ NPS Retirement Payout · 60% Lumpsum + 40% Annuity
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
            Retirement Age
          </label>
          <input
            type="number"
            value={retireAge}
            onChange={(e) => setRetireAge(+e.target.value || 0)}
            className="calc-input"
            min={50}
            max={75}
          />
          <p className="text-xs text-gray-500 mt-1">
            Standard: 60. Early exit: 50-60 (reduced benefits)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">
            Monthly Contribution
          </label>
          <input
            type="number"
            value={monthlyContribution}
            onChange={(e) => setMonthlyContribution(+e.target.value || 0)}
            className="calc-input"
          />
          <p className="text-xs text-gray-500 mt-1">
            Min ₹500/contribution; ₹1,000/year minimum
          </p>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">
            Existing NPS Corpus
          </label>
          <input
            type="number"
            value={existingCorpus}
            onChange={(e) => setExistingCorpus(+e.target.value || 0)}
            className="calc-input"
          />
          <p className="text-xs text-gray-500 mt-1">If you already have NPS</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">
              Expected NPS Return %
            </label>
            <span className="text-sm font-bold text-indigo-600">
              {returnPct}%
            </span>
          </div>
          <input
            type="range"
            min={6}
            max={15}
            step={0.5}
            value={returnPct}
            onChange={(e) => setReturnPct(+e.target.value)}
            className="w-full"
          />
          <p className="text-xs text-gray-500 mt-1">
            Equity-tilt portfolios: 10-12% historic
          </p>
        </div>
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">
              Lump-Sum Withdrawal %
            </label>
            <span className="text-sm font-bold text-indigo-600">
              {lumpSumPct}%
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={60}
            step={5}
            value={lumpSumPct}
            onChange={(e) => setLumpSumPct(+e.target.value)}
            className="w-full"
          />
          <p className="text-xs text-gray-500 mt-1">
            Max 60% (PFRDA cap). Higher annuity → higher pension.
          </p>
        </div>
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">
              Annuity Rate %
            </label>
            <span className="text-sm font-bold text-indigo-600">
              {annuityRate}%
            </span>
          </div>
          <input
            type="range"
            min={5}
            max={8}
            step={0.1}
            value={annuityRate}
            onChange={(e) => setAnnuityRate(+e.target.value)}
            className="w-full"
          />
          <p className="text-xs text-gray-500 mt-1">
            Typical 5.5-7.5% based on option chosen
          </p>
        </div>
      </div>

      {result && (
        <div className="result-card space-y-4">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
            <div className="text-sm font-medium opacity-80 mb-1">
              Total NPS Corpus at Age {retireAge}
            </div>
            <div className="text-4xl font-bold">{fmt(result.totalCorpus)}</div>
            <div className="text-sm opacity-80 mt-2">
              From {fmtCompact(result.totalContribution)} invested over{" "}
              {result.yearsToRetire} years (wealth multiple{" "}
              {result.wealthMultiple.toFixed(2)}×)
            </div>
          </div>

          {result.smallCorpus && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm text-emerald-900">
              <strong>✓ Small Corpus Rule applies:</strong> Since corpus ≤ ₹5L,
              you can withdraw 100% (no annuity required).
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-white rounded-xl p-5 shadow-sm border-2 border-emerald-200">
              <div className="text-xs font-medium text-gray-500 mb-1">
                {result.effectiveLumpSumPct}% Tax-Free Lump Sum
              </div>
              <div className="text-3xl font-bold text-emerald-700">
                {fmt(result.lumpSum)}
              </div>
              <div className="text-xs text-gray-600 mt-2">
                Withdraw at retirement, fully tax-free under Sec 10(12A).
                Or opt for SLW (monthly/quarterly drawdown) till age 75.
              </div>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border-2 border-purple-200">
              <div className="text-xs font-medium text-gray-500 mb-1">
                {100 - result.effectiveLumpSumPct}% Annuity Purchase
              </div>
              <div className="text-3xl font-bold text-purple-700">
                {fmt(result.annuityCorpus)}
              </div>
              <div className="text-xs text-gray-600 mt-2">
                Buys annuity giving you{" "}
                <strong>{fmt(result.monthlyPension)}/month</strong> for life
                (₹{(result.annualPension / 100000).toFixed(2)}L per year).
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-3 text-sm">
              📐 Complete payout structure
            </h3>
            <div className="space-y-2 text-xs text-gray-700">
              <div className="flex justify-between border-b pb-2">
                <span>Total NPS corpus at age {retireAge}</span>
                <span className="font-mono font-bold">
                  {fmt(result.totalCorpus)}
                </span>
              </div>
              <div className="flex justify-between text-emerald-700">
                <span>
                  Lump-sum ({result.effectiveLumpSumPct}%, tax-free)
                </span>
                <span className="font-mono">{fmt(result.lumpSum)}</span>
              </div>
              <div className="flex justify-between text-purple-700">
                <span>
                  Annuity corpus ({100 - result.effectiveLumpSumPct}%)
                </span>
                <span className="font-mono">{fmt(result.annuityCorpus)}</span>
              </div>
              <div className="flex justify-between text-indigo-700 pt-2 border-t">
                <span>→ Monthly pension @ {annuityRate}% rate (taxable)</span>
                <span className="font-mono font-bold">
                  {fmt(result.monthlyPension)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs text-gray-700 leading-relaxed space-y-2">
        <strong>NPS withdrawal rules:</strong>
        <ul className="list-disc list-inside ml-2 space-y-1">
          <li>
            <strong>At 60:</strong> Up to 60% lump-sum (tax-free), minimum
            40% to annuity. Annuity income is taxable as pension.
          </li>
          <li>
            <strong>Small corpus:</strong> If total ≤ ₹5L, 100% withdrawable
            with no annuity requirement.
          </li>
          <li>
            <strong>Premature exit (before 60):</strong> Only 20% lump-sum,
            80% must go to annuity.
          </li>
          <li>
            <strong>Death before 60:</strong> Nominee can withdraw 100%.
          </li>
          <li>
            <strong>SLW (NEW since Aug 2024):</strong> Instead of upfront 60%
            lump-sum, draw it down systematically (monthly/quarterly/annual)
            till age 75. Money keeps earning returns.
          </li>
          <li>
            <strong>Tax benefits during contribution:</strong> 80CCD(1) up to
            ₹1.5L (within 80C); 80CCD(1B) additional ₹50K (NPS-only deduction);
            80CCD(2) employer&apos;s 10% of salary contribution.
          </li>
        </ul>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-800 leading-relaxed">
        <span className="mr-1">ℹ️</span>
        <strong>Disclaimer:</strong> NPS returns vary by asset allocation
        (Equity / Corp Bonds / Govt Bonds / Alt Inv) and chosen pension fund
        manager. Annuity rates change frequently — always check live quotes
        from PFRDA-empanelled annuity providers (LIC, HDFC, ICICI, SBI, Bajaj
        Allianz, Star Union, etc.) before purchasing. Reference:{" "}
        <a
          href="https://www.npscra.nsdl.co.in"
          target="_blank"
          rel="noopener noreferrer"
          className="underline font-semibold text-blue-700 hover:text-blue-900"
        >
          npscra.nsdl.co.in
        </a>
        .
      </div>
    </div>
  );
}
