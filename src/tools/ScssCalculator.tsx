"use client";
import { useState, useMemo } from "react";

/**
 * Senior Citizens Savings Scheme (SCSS) Calculator
 *
 * SCSS is the highest-paying small-savings scheme in India, designed for
 * senior citizens. Government-backed, with quarterly interest payouts —
 * perfect for retirees needing regular income.
 *
 * VERIFIED RULES (FY 2025-26):
 *
 *  - Interest rate: 8.2% p.a., paid QUARTERLY (every 3 months)
 *    Set by MoF, unchanged since 1 Apr 2023; carried into Q1 FY 2026-27
 *  - Tenure: 5 years from account-opening date
 *  - Extension: one-time extension of 3 years allowed at maturity
 *  - Min deposit: ₹1,000 (multiples of ₹1,000)
 *  - Max deposit: ₹30,00,000 (₹30 lakh) — Budget 2023 raised it from ₹15L
 *
 * Eligibility:
 *  - Indian residents aged 60+
 *  - Civil retirees aged 55-60 (within 1 month of retirement)
 *  - Defence retirees aged 50-60 (within 1 month of retirement)
 *
 * Tax:
 *  - Principal up to ₹1.5L per year qualifies for Section 80C deduction
 *  - Interest is FULLY TAXABLE at slab rate
 *  - TDS deducted if annual interest > ₹50,000 (raised from ₹40K
 *    via Section 194P / Section 194A senior threshold)
 *
 * Premature closure:
 *  - Before 1 yr: full interest forfeited (only principal returned)
 *  - 1-2 yrs: 1.5% penalty on principal
 *  - 2-5 yrs: 1% penalty on principal
 *
 * Quarterly interest = Principal × (8.2/4)% = Principal × 2.05%
 * (every quarter)
 *
 * Sources:
 *  - Ministry of Finance, Department of Economic Affairs (MoF) notifications
 *  - https://www.indiapost.gov.in (SCSS scheme)
 *  - https://cleartax.in/s/senior-citizen-savings-scheme
 *  - Budget 2023 — limit raised to ₹30L
 */

const ANNUAL_RATE = 0.082; // 8.2% p.a.
const QUARTERS = 20; // 5 years × 4
const MIN_DEPOSIT = 1_000;
const MAX_DEPOSIT = 3_000_000; // ₹30 lakh

export default function ScssCalculator() {
  const [deposit, setDeposit] = useState<number>(1_500_000); // ₹15L

  const result = useMemo(() => {
    if (deposit < MIN_DEPOSIT) {
      return {
        invalid: true as const,
        reason: `Minimum SCSS deposit is ₹${MIN_DEPOSIT.toLocaleString("en-IN")}.`,
      };
    }
    if (deposit > MAX_DEPOSIT) {
      return {
        invalid: true as const,
        reason: `Maximum SCSS deposit is ₹${MAX_DEPOSIT.toLocaleString("en-IN")} per depositor.`,
      };
    }
    if (deposit % 1000 !== 0) {
      return {
        invalid: true as const,
        reason: "SCSS deposits must be in multiples of ₹1,000.",
      };
    }

    // Quarterly interest
    const quarterlyInterest = (deposit * ANNUAL_RATE) / 4;
    const annualInterest = quarterlyInterest * 4;
    const totalInterestOver5Years = annualInterest * 5;

    // Maturity = principal + (5 years × annual interest paid out)
    // Note: SCSS pays interest every quarter; principal returned at maturity
    const maturityPrincipal = deposit;
    const totalReceivedOver5Yrs = deposit + totalInterestOver5Years;

    // Effective net of TDS for income > ₹50K (Section 194A senior threshold)
    const tdsThreshold = 50_000;
    const tdsAmount =
      annualInterest > tdsThreshold ? annualInterest * 0.10 : 0;
    const annualNetAfterTds = annualInterest - tdsAmount;

    // 80C eligibility (within ₹1.5L cap)
    const eighty80C = Math.min(deposit, 150_000);

    // Quarter-by-quarter payout
    const quarters: { quarter: number; payout: number; cumulative: number }[] = [];
    let cumulative = 0;
    for (let q = 1; q <= QUARTERS; q++) {
      cumulative += quarterlyInterest;
      quarters.push({
        quarter: q,
        payout: quarterlyInterest,
        cumulative,
      });
    }

    return {
      invalid: false as const,
      quarterlyInterest,
      annualInterest,
      totalInterestOver5Years,
      totalReceivedOver5Yrs,
      tdsAmount,
      annualNetAfterTds,
      eighty80C,
      quarters,
    };
  }, [deposit]);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <div className="space-y-6">
      <div className="inline-block bg-rose-100 text-rose-800 text-sm font-semibold px-4 py-1.5 rounded-full">
        👴 SCSS · 8.2% p.a. · Quarterly Payout · 5-Year Lock-in
      </div>

      <div className="space-y-5">
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">
              Deposit Amount
            </label>
            <span className="text-sm font-bold text-rose-600">
              {fmt(deposit)}
            </span>
          </div>
          <input
            type="range"
            min={MIN_DEPOSIT}
            max={MAX_DEPOSIT}
            step={10_000}
            value={deposit}
            onChange={(e) => setDeposit(+e.target.value)}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>₹1,000</span>
            <span>₹30L (max)</span>
          </div>
          <input
            type="number"
            value={deposit}
            onChange={(e) => setDeposit(+e.target.value || 0)}
            className="calc-input mt-2"
            min={MIN_DEPOSIT}
            max={MAX_DEPOSIT}
            step={1000}
          />
          <p className="text-xs text-gray-500 mt-1">
            Multiples of ₹1,000. Min ₹1,000, max ₹30,00,000 (Budget 2023 cap).
          </p>
        </div>
      </div>

      {result.invalid ? (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-sm text-rose-800">
          ⚠ {result.reason}
        </div>
      ) : (
        <div className="result-card space-y-4">
          <div className="bg-gradient-to-r from-rose-500 to-pink-600 rounded-2xl p-6 text-white">
            <div className="text-sm font-medium opacity-80 mb-1">
              Quarterly Interest Payout (every 3 months)
            </div>
            <div className="text-4xl font-bold">
              {fmt(result.quarterlyInterest)}
            </div>
            <div className="text-sm opacity-80 mt-2">
              Annual income {fmt(result.annualInterest)} (≈{" "}
              {fmt(result.annualInterest / 12)}/month)
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">
                Annual Interest
              </div>
              <div className="text-xl font-bold text-rose-600">
                {fmt(result.annualInterest)}
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">
                Interest over 5 years
              </div>
              <div className="text-xl font-bold text-emerald-600">
                {fmt(result.totalInterestOver5Years)}
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">
                Total Received
              </div>
              <div className="text-xl font-bold text-purple-600">
                {fmt(result.totalReceivedOver5Yrs)}
              </div>
              <div className="text-[10px] text-gray-500 mt-1">
                Principal + Interest
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-xs text-amber-900 leading-relaxed">
            <div className="font-bold mb-2">💰 Tax planning</div>
            <ul className="list-disc list-inside space-y-1">
              <li>
                Principal {fmt(result.eighty80C)} qualifies for{" "}
                <strong>Section 80C deduction</strong> (within ₹1.5L overall
                cap; Old regime only).
              </li>
              <li>
                Annual interest {fmt(result.annualInterest)} is{" "}
                <strong>FULLY TAXABLE</strong> at slab rate.
              </li>
              <li>
                {result.tdsAmount > 0 ? (
                  <>
                    TDS @ 10% = <strong>{fmt(result.tdsAmount)}</strong>{" "}
                    (since interest exceeds ₹50,000 senior threshold). Net
                    received: <strong>{fmt(result.annualNetAfterTds)}</strong>.
                  </>
                ) : (
                  <>
                    No TDS (annual interest ≤ ₹50,000 senior threshold).
                  </>
                )}
              </li>
              <li>
                Submit Form 15H (senior citizen) to avoid TDS if total income
                is below the basic exemption limit.
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-3">
              Quarterly Payout Schedule (5 years × 4 quarters)
            </h3>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden max-h-96 overflow-y-auto">
              <table className="w-full text-xs">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="text-left p-2 font-semibold text-gray-700">
                      Quarter
                    </th>
                    <th className="text-right p-2 font-semibold text-gray-700">
                      Payout
                    </th>
                    <th className="text-right p-2 font-semibold text-gray-700">
                      Cumulative Interest
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {result.quarters.map((q) => (
                    <tr key={q.quarter} className="border-t hover:bg-gray-50">
                      <td className="p-2 font-medium text-gray-900">
                        Q{q.quarter} (
                        {Math.ceil(q.quarter / 4)}-yr-{((q.quarter - 1) % 4) + 1}q)
                      </td>
                      <td className="p-2 text-right text-rose-600">
                        {fmt(q.payout)}
                      </td>
                      <td className="p-2 text-right text-purple-700 font-semibold">
                        {fmt(q.cumulative)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs text-gray-700 leading-relaxed space-y-2">
        <strong>SCSS rules at a glance:</strong>
        <ul className="list-disc list-inside ml-2 space-y-1">
          <li>
            <strong>Eligibility:</strong> Indian residents aged 60+; civil
            retirees 55-60 (within 1 month of retirement); defence retirees
            50-60.
          </li>
          <li>
            <strong>Interest credited:</strong> 1st of April / July / October
            / January every year.
          </li>
          <li>
            <strong>Extension:</strong> at maturity, one-time 3-year
            extension allowed at the prevailing rate (or current rate,
            whichever is HIGHER).
          </li>
          <li>
            <strong>Premature closure penalties:</strong>
            <ul className="list-circle list-inside ml-4 mt-1 space-y-0.5">
              <li>&lt; 1 yr: no interest paid</li>
              <li>1-2 yrs: 1.5% deducted from principal</li>
              <li>2-5 yrs: 1% deducted from principal</li>
            </ul>
          </li>
          <li>
            <strong>Joint account:</strong> with spouse only (and only first
            holder counts for ₹30L limit).
          </li>
          <li>
            <strong>Multiple accounts:</strong> allowed across Post Offices /
            banks but ₹30L is the AGGREGATE limit per person.
          </li>
        </ul>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-800 leading-relaxed">
        <span className="mr-1">ℹ️</span>
        <strong>Disclaimer:</strong> 8.2% interest is among the highest
        government-backed yields in India. Compare with PPF (7.1%, tax-free,
        15 yrs), SSY (8.2%, girl-child only), tax-saver FDs (6.5-7.5%).
        Reference:{" "}
        <a
          href="https://www.indiapost.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="underline font-semibold text-blue-700 hover:text-blue-900"
        >
          indiapost.gov.in
        </a>
        .
      </div>
    </div>
  );
}
