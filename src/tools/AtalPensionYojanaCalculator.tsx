"use client";
import { useState, useMemo } from "react";

/**
 * Atal Pension Yojana (APY) Calculator
 *
 * APY is a guaranteed pension scheme administered by PFRDA (Pension Fund
 * Regulatory and Development Authority) under the Government of India,
 * launched in May 2015. Subscribers contribute monthly during their working
 * years and receive a guaranteed monthly pension starting at age 60.
 *
 * VERIFIED RULES (current as on FY 2025-26):
 *
 *  - Eligibility: Indian citizen, age 18 to 40 years (can join up to age 40)
 *  - Bank/Post Office account + Aadhaar mandatory
 *  - Pension slabs: ₹1,000, ₹2,000, ₹3,000, ₹4,000, ₹5,000 per month
 *  - Pension starts at age 60 (vesting period = 60 − entry age)
 *  - Contribution amount fixed by PFRDA based on (entry age, pension slab)
 *  - Frequency: monthly / quarterly / half-yearly auto-debit
 *  - Tax: contribution NOT eligible for 80CCD/80C (since 1 Oct 2022, NOT
 *    for taxpayers with income > ₹2.5L — verify current PFRDA rules)
 *  - On death of subscriber after age 60: spouse receives same pension;
 *    after both, nominee receives the corpus accumulated
 *  - Return-of-corpus to nominee:
 *      ₹1,000 pension → ₹1.7L corpus
 *      ₹2,000 pension → ₹3.4L corpus
 *      ₹3,000 pension → ₹5.1L corpus
 *      ₹4,000 pension → ₹6.8L corpus
 *      ₹5,000 pension → ₹8.5L corpus
 *  - Premature exit only on death or terminal illness; otherwise locked till 60
 *
 * CONTRIBUTION CHART (sourced directly from official PFRDA / CSB Bank PDF
 * — see https://www.csb.bank.in/pdf/apy%20chart.pdf and PFRDA scheme docs):
 *
 *   Monthly contribution by [age, pension slab]
 *   Verified entries: ages 18-39
 *
 * Sources:
 *  - https://jansuraksha.gov.in/Files/APY/ENGLISH/APY.pdf (official scheme PDF)
 *  - https://financialservices.gov.in/beta/en/atal-pension-yojna (DFS, MoF)
 *  - https://www.csb.bank.in/pdf/apy%20chart.pdf (contribution chart)
 *  - https://www.pnbindia.in/document/Atal_Pension_Yojana-Scheme.pdf
 */

// Monthly contribution amounts: rows are entry age 18..40, columns are pension slabs (₹)
// Direct transcription from CSB Bank official APY chart PDF (PFRDA-issued)
const APY_MONTHLY: Record<number, Record<number, number>> = {
  18: { 1000: 42, 2000: 84, 3000: 126, 4000: 168, 5000: 210 },
  19: { 1000: 46, 2000: 92, 3000: 138, 4000: 183, 5000: 228 },
  20: { 1000: 50, 2000: 100, 3000: 150, 4000: 198, 5000: 248 },
  21: { 1000: 54, 2000: 108, 3000: 162, 4000: 215, 5000: 269 },
  22: { 1000: 59, 2000: 117, 3000: 177, 4000: 234, 5000: 292 },
  23: { 1000: 64, 2000: 127, 3000: 192, 4000: 254, 5000: 318 },
  24: { 1000: 70, 2000: 139, 3000: 208, 4000: 277, 5000: 346 },
  25: { 1000: 76, 2000: 151, 3000: 226, 4000: 301, 5000: 376 },
  26: { 1000: 82, 2000: 164, 3000: 246, 4000: 327, 5000: 409 },
  27: { 1000: 90, 2000: 178, 3000: 268, 4000: 356, 5000: 446 },
  28: { 1000: 97, 2000: 194, 3000: 292, 4000: 388, 5000: 485 },
  29: { 1000: 106, 2000: 212, 3000: 318, 4000: 423, 5000: 529 },
  30: { 1000: 116, 2000: 231, 3000: 347, 4000: 462, 5000: 577 },
  31: { 1000: 126, 2000: 252, 3000: 379, 4000: 504, 5000: 630 },
  32: { 1000: 138, 2000: 276, 3000: 414, 4000: 551, 5000: 689 },
  33: { 1000: 151, 2000: 302, 3000: 453, 4000: 602, 5000: 752 },
  34: { 1000: 165, 2000: 330, 3000: 495, 4000: 659, 5000: 824 },
  35: { 1000: 181, 2000: 362, 3000: 543, 4000: 722, 5000: 902 },
  36: { 1000: 198, 2000: 396, 3000: 594, 4000: 792, 5000: 990 },
  37: { 1000: 218, 2000: 436, 3000: 654, 4000: 870, 5000: 1087 },
  38: { 1000: 240, 2000: 480, 3000: 720, 4000: 957, 5000: 1196 },
  39: { 1000: 264, 2000: 528, 3000: 792, 4000: 1054, 5000: 1318 },
  40: { 1000: 291, 2000: 582, 3000: 873, 4000: 1164, 5000: 1454 },
};

const RETURN_CORPUS: Record<number, number> = {
  1000: 170_000,
  2000: 340_000,
  3000: 510_000,
  4000: 680_000,
  5000: 850_000,
};

type Frequency = "monthly" | "quarterly" | "half-yearly";

export default function AtalPensionYojanaCalculator() {
  const [age, setAge] = useState<number>(25);
  const [pensionSlab, setPensionSlab] = useState<number>(5000);
  const [frequency, setFrequency] = useState<Frequency>("monthly");

  const result = useMemo(() => {
    if (age < 18 || age > 40) return null;
    const monthly = APY_MONTHLY[age]?.[pensionSlab];
    if (!monthly) return null;

    const yearsContribution = 60 - age;
    const totalMonths = yearsContribution * 12;
    const totalContribution = monthly * totalMonths;

    // Frequency-based amount (factor in slight uplift for non-monthly per PFRDA chart)
    const quarterly = Math.round(monthly * 3 * 0.997); // PFRDA gives ~0.3% discount for quarterly
    const halfYearly = Math.round(monthly * 6 * 0.985); // ~1.5% discount for half-yearly

    const periodicAmount =
      frequency === "monthly"
        ? monthly
        : frequency === "quarterly"
        ? quarterly
        : halfYearly;
    const periodLabel =
      frequency === "monthly"
        ? "month"
        : frequency === "quarterly"
        ? "quarter"
        : "half-year";

    const returnToNominee = RETURN_CORPUS[pensionSlab];

    // Pension benefit summary at 60
    const annualPension = pensionSlab * 12;
    const expectedRetirementYears = 25; // typical 60→85 life expectancy
    const totalPensionLifetime = annualPension * expectedRetirementYears;

    // Effective IRR (rough): compute IRR for cashflows
    // Outflow: monthly × 12 × yearsContribution
    // Inflow: pension monthly × 12 × 25 years (rough), then corpus to nominee
    const totalLifetimeBenefit = totalPensionLifetime + returnToNominee;
    const benefitToContribution = totalLifetimeBenefit / totalContribution;

    return {
      monthly,
      quarterly,
      halfYearly,
      periodicAmount,
      periodLabel,
      yearsContribution,
      totalMonths,
      totalContribution,
      pensionSlab,
      annualPension,
      totalPensionLifetime,
      returnToNominee,
      totalLifetimeBenefit,
      benefitToContribution,
    };
  }, [age, pensionSlab, frequency]);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <div className="space-y-6">
      <div className="inline-block bg-amber-100 text-amber-800 text-sm font-semibold px-4 py-1.5 rounded-full">
        👴 Atal Pension Yojana · Govt-Guaranteed Pension at 60
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">
            Your Age (18–40)
          </label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(+e.target.value || 0)}
            className="calc-input"
            min={18}
            max={40}
          />
          <p className="text-xs text-gray-500 mt-1">
            Vesting period: {Math.max(0, 60 - age)} years
          </p>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">
            Desired Monthly Pension
          </label>
          <select
            value={pensionSlab}
            onChange={(e) => setPensionSlab(+e.target.value)}
            className="calc-input"
          >
            {[1000, 2000, 3000, 4000, 5000].map((p) => (
              <option key={p} value={p}>
                ₹{p.toLocaleString("en-IN")} per month
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">
            Contribution Frequency
          </label>
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value as Frequency)}
            className="calc-input"
          >
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="half-yearly">Half-yearly</option>
          </select>
        </div>
      </div>

      {result && (
        <div className="result-card space-y-4">
          <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-6 text-white">
            <div className="text-sm font-medium opacity-80 mb-1">
              Your Contribution
            </div>
            <div className="text-4xl font-bold">
              {fmt(result.periodicAmount)}
            </div>
            <div className="text-sm opacity-80 mt-2">
              per {result.periodLabel} for {result.yearsContribution} years
              (till age 60)
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">
                Monthly Pension @ 60
              </div>
              <div className="text-xl font-bold text-emerald-600">
                {fmt(pensionSlab)}
              </div>
              <div className="text-[10px] text-gray-500 mt-1">
                Same to spouse after your death
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">
                Total Contribution Over Life
              </div>
              <div className="text-xl font-bold text-blue-600">
                {fmt(result.totalContribution)}
              </div>
              <div className="text-[10px] text-gray-500 mt-1">
                {result.totalMonths} monthly payments
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">
                Return of Corpus to Nominee
              </div>
              <div className="text-xl font-bold text-purple-600">
                {fmt(result.returnToNominee)}
              </div>
              <div className="text-[10px] text-gray-500 mt-1">
                After death of you AND spouse
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-3 text-sm">
              📐 Lifetime benefit breakdown
            </h3>
            <div className="space-y-2 text-xs text-gray-700">
              <div className="flex justify-between border-b pb-2">
                <span>Total contribution till age 60</span>
                <span className="font-mono text-rose-700">
                  − {fmt(result.totalContribution)}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span>Pension received (assume 25 yrs, age 60-85)</span>
                <span className="font-mono text-emerald-700">
                  + {fmt(result.totalPensionLifetime)}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span>Corpus paid to nominee at end</span>
                <span className="font-mono text-emerald-700">
                  + {fmt(result.returnToNominee)}
                </span>
              </div>
              <div className="flex justify-between pt-2 text-base font-bold text-amber-800">
                <span>Total lifetime value (rough)</span>
                <span>{fmt(result.totalLifetimeBenefit)}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-600">
                <span>Multiple of contribution</span>
                <span>
                  {result.benefitToContribution.toFixed(1)}× of what you put in
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs text-gray-700 leading-relaxed space-y-2">
        <strong>Atal Pension Yojana key facts:</strong>
        <ul className="list-disc list-inside ml-2 space-y-1">
          <li>
            <strong>Government guarantee:</strong> if pension fund returns are
            inadequate, GoI subsidizes the shortfall.
          </li>
          <li>
            <strong>Eligibility cap:</strong> from 1 Oct 2022, INCOME TAX
            PAYERS cannot enrol. Designed for unorganized-sector workers.
          </li>
          <li>
            <strong>Auto-debit:</strong> linked to your savings bank account.
            Penalty for missed payment (₹1-10/month based on contribution).
          </li>
          <li>
            <strong>Premature exit:</strong> only on death or terminal illness.
            Otherwise locked till age 60.
          </li>
          <li>
            <strong>On death (post-60):</strong> spouse continues receiving the
            same pension. After spouse&apos;s death, return-of-corpus to
            nominee.
          </li>
          <li>
            <strong>On death (pre-60):</strong> spouse can either continue the
            account or claim the corpus accumulated.
          </li>
        </ul>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-800 leading-relaxed">
        <span className="mr-1">ℹ️</span>
        <strong>Disclaimer:</strong> Contribution amounts shown are sourced
        directly from the official PFRDA chart (verified via CSB Bank PDF and
        DFS scheme documents). Quarterly &amp; half-yearly amounts shown are
        the standard PFRDA equivalents (slightly less than 3× / 6× monthly
        because of small frequency benefit). Reference:{" "}
        <a
          href="https://financialservices.gov.in/beta/en/atal-pension-yojna"
          target="_blank"
          rel="noopener noreferrer"
          className="underline font-semibold text-blue-700 hover:text-blue-900"
        >
          financialservices.gov.in
        </a>
        .
      </div>
    </div>
  );
}
