"use client";
import { useState, useMemo } from "react";

/**
 * Mahila Samman Savings Certificate (MSSC) Maturity Calculator
 *
 * MSSC was a one-time small savings scheme for Indian women, launched in
 * Budget 2023, available for account opening between 1 April 2023 and
 * 31 March 2025 (per the original notification — no extension as of writing).
 * Existing accounts continue to earn interest till maturity.
 *
 * VERIFIED RULES:
 *  - Interest rate: 7.5% p.a., COMPOUNDED QUARTERLY, credited at maturity
 *  - Tenure: exactly 2 years from date of deposit
 *  - Eligibility: Indian women & girls of any age; minor accounts via
 *    natural/legal guardian
 *  - Min deposit: ₹1,000; max deposit: ₹2,00,000 across all MSSC accounts
 *    of one depositor (multiples of ₹100)
 *  - One-time deposit only — not recurring
 *  - Partial withdrawal: up to 40% of balance after 1 year
 *  - Premature closure: allowed after 6 months but with a 2-percentage-point
 *    penalty on interest (so effectively 5.5% instead of 7.5% in such cases)
 *  - Available at all Post Offices & participating scheduled banks
 *  - Interest is taxable in the depositor's hands (no Section 80C benefit)
 *  - TDS not applicable (small savings scheme)
 *
 * Maturity formula (quarterly compounding):
 *   M = P × (1 + r/4)^(4t)
 *
 *   where P = principal, r = annual rate (0.075), t = years (= 2)
 *   So M = P × (1.01875)^8 = P × 1.16022...
 *
 *   Final maturity value for ₹2,00,000 = ₹232,044 (interest = ₹32,044)
 *
 * Sources:
 *  - Ministry of Finance, Department of Economic Affairs notification
 *  - Post Office (indiapost.gov.in) MSSC scheme page
 *  - SBI MSSC product page; ClearTax MSSC explainer
 *  - Confirmed: scheme open for new deposits till 31 Mar 2025 only
 */

const ANNUAL_RATE = 0.075; // 7.5%
const COMPOUND_FREQ = 4; // quarterly
const TENURE_YEARS = 2;
const MIN_DEPOSIT = 1_000;
const MAX_DEPOSIT = 200_000;

function mssMaturity(principal: number): {
  maturity: number;
  interest: number;
} {
  const maturity =
    principal * Math.pow(1 + ANNUAL_RATE / COMPOUND_FREQ, COMPOUND_FREQ * TENURE_YEARS);
  return { maturity, interest: maturity - principal };
}

function buildQuarterlyTable(principal: number) {
  const rows: {
    quarter: number;
    period: string;
    openingBalance: number;
    interestEarned: number;
    closingBalance: number;
  }[] = [];
  let balance = principal;
  const qRate = ANNUAL_RATE / COMPOUND_FREQ; // 0.01875
  for (let q = 1; q <= COMPOUND_FREQ * TENURE_YEARS; q++) {
    const opening = balance;
    const interest = opening * qRate;
    balance = opening + interest;
    rows.push({
      quarter: q,
      period: `Q${q}`,
      openingBalance: opening,
      interestEarned: interest,
      closingBalance: balance,
    });
  }
  return rows;
}

export default function MahilaSammanCalculator() {
  const [deposit, setDeposit] = useState<number>(200_000);

  const result = useMemo(() => {
    if (deposit < MIN_DEPOSIT || deposit > MAX_DEPOSIT) {
      return {
        invalid: true as const,
        reason:
          deposit < MIN_DEPOSIT
            ? `Minimum deposit is ₹${MIN_DEPOSIT.toLocaleString("en-IN")}.`
            : `Maximum deposit is ₹${MAX_DEPOSIT.toLocaleString(
                "en-IN"
              )} across all MSSC accounts of one depositor.`,
      };
    }
    if (deposit % 100 !== 0) {
      return {
        invalid: true as const,
        reason: "Deposits must be in multiples of ₹100.",
      };
    }

    const { maturity, interest } = mssMaturity(deposit);
    const quarterly = buildQuarterlyTable(deposit);

    // Premature closure scenarios (effective ~5.5%)
    const prematureRate = ANNUAL_RATE - 0.02; // 5.5%
    const oneYearMaturity =
      deposit * Math.pow(1 + prematureRate / 4, 4 * 1);
    const eighteenMoMaturity =
      deposit * Math.pow(1 + prematureRate / 4, 4 * 1.5);

    return {
      invalid: false as const,
      maturity,
      interest,
      quarterly,
      premature: {
        sixMonths: deposit * Math.pow(1 + prematureRate / 4, 4 * 0.5),
        oneYear: oneYearMaturity,
        eighteenMonths: eighteenMoMaturity,
      },
    };
  }, [deposit]);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(n);
  const fmtDecimal = (n: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(n);

  return (
    <div className="space-y-6">
      <div className="inline-block bg-pink-100 text-pink-800 text-sm font-semibold px-4 py-1.5 rounded-full">
        👩 MSSC · 7.5% p.a. · Quarterly Compounding · 2-Year Lock-in
      </div>

      {/* High-visibility closure notice. The scheme officially stopped
          accepting new deposits on 31 March 2025 (SB Order No. 03/2025,
          Dept. of Posts). Budget 2026 did not extend it. Verified from
          ClearTax + India Post + Ministry of Communication notification
          (8 Jun 2026). This banner must be loud — a first-time visitor
          must understand they CANNOT open a fresh MSSC account today. */}
      <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 text-sm text-red-900 leading-relaxed">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🚫</span>
          <div>
            <p className="font-bold text-base text-red-800 mb-1">
              Scheme Closed for New Accounts
            </p>
            <p className="mb-2">
              The Mahila Samman Savings Certificate (MSSC) scheme stopped
              accepting new deposits on{" "}
              <strong>31 March 2025</strong> per SB Order No. 03/2025
              issued by the Department of Posts. Budget 2026-27 did{" "}
              <strong>not</strong> extend or relaunch the scheme.
            </p>
            <p className="text-xs text-red-800">
              <strong>What this calculator is for:</strong> existing MSSC
              account holders (opened before 31 Mar 2025) can use this to
              compute their maturity at end of the 2-year tenure. The
              7.5% rate, quarterly compounding and all other terms
              continue till each existing account's maturity date.
              Withdrawals via ECS to non-Post-Office bank accounts are
              now permitted (Min. of Communication circular, 12 Jun 2025).
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">
              Deposit Amount
            </label>
            <span className="text-sm font-bold text-pink-600">
              {fmt(deposit)}
            </span>
          </div>
          <input
            type="range"
            min={MIN_DEPOSIT}
            max={MAX_DEPOSIT}
            step={1000}
            value={deposit}
            onChange={(e) => setDeposit(+e.target.value)}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>₹1,000</span>
            <span>₹2,00,000 (max)</span>
          </div>
          <div className="mt-2">
            <input
              type="number"
              min={MIN_DEPOSIT}
              max={MAX_DEPOSIT}
              step={100}
              value={deposit}
              onChange={(e) => setDeposit(+e.target.value || 0)}
              className="calc-input"
            />
            <p className="text-xs text-gray-500 mt-1">
              Multiples of ₹100. Min ₹1,000, max ₹2,00,000 across all
              accounts.
            </p>
          </div>
        </div>
      </div>

      {result.invalid ? (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-sm text-rose-800">
          ⚠ {result.reason}
        </div>
      ) : (
        <div className="result-card space-y-4">
          <div className="bg-gradient-to-r from-pink-500 to-rose-600 rounded-2xl p-6 text-white">
            <div className="text-sm font-medium opacity-80 mb-1">
              Maturity Value (after 2 years)
            </div>
            <div className="text-4xl font-bold">{fmt(result.maturity)}</div>
            <div className="text-sm opacity-80 mt-2">
              Principal {fmt(deposit)} + Interest{" "}
              <span className="font-bold">{fmt(result.interest)}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">
                Principal
              </div>
              <div className="text-xl font-bold text-blue-600">
                {fmt(deposit)}
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">
                Total Interest
              </div>
              <div className="text-xl font-bold text-green-600">
                {fmt(result.interest)}
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">
                Effective Yield
              </div>
              <div className="text-xl font-bold text-purple-600">
                {((result.maturity / deposit - 1) * 100).toFixed(2)}%
              </div>
              <div className="text-[10px] text-gray-500 mt-1">
                over 2 years (≈7.71% APY)
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-3">
              Quarterly Compounding Breakdown
            </h3>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-2 font-semibold text-gray-700">
                      Quarter
                    </th>
                    <th className="text-right p-2 font-semibold text-gray-700">
                      Opening Balance
                    </th>
                    <th className="text-right p-2 font-semibold text-gray-700">
                      Interest @ 1.875%
                    </th>
                    <th className="text-right p-2 font-semibold text-gray-700">
                      Closing Balance
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {result.quarterly.map((q) => (
                    <tr key={q.quarter} className="border-t hover:bg-gray-50">
                      <td className="p-2 font-medium text-gray-900">
                        {q.period}
                      </td>
                      <td className="p-2 text-right text-gray-700">
                        {fmtDecimal(q.openingBalance)}
                      </td>
                      <td className="p-2 text-right text-blue-600">
                        {fmtDecimal(q.interestEarned)}
                      </td>
                      <td className="p-2 text-right text-pink-700 font-semibold">
                        {fmtDecimal(q.closingBalance)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-xs text-amber-900 leading-relaxed">
            <div className="font-bold mb-2">
              ⚠ Premature closure (after 6 months — penalty 2pp lower rate):
            </div>
            <ul className="list-disc list-inside space-y-1">
              <li>
                Close at 6 months → approx{" "}
                <strong>{fmt(result.premature.sixMonths)}</strong>
              </li>
              <li>
                Close at 1 year → approx{" "}
                <strong>{fmt(result.premature.oneYear)}</strong>
              </li>
              <li>
                Close at 18 months → approx{" "}
                <strong>{fmt(result.premature.eighteenMonths)}</strong>
              </li>
            </ul>
            <p className="mt-2">
              Premature interest is computed at 5.5% (7.5% − 2pp penalty).
              You can also withdraw up to 40% of balance after 1 year
              without closing the account.
            </p>
          </div>
        </div>
      )}

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs text-gray-700 leading-relaxed space-y-2">
        <strong>Mahila Samman Savings Certificate — Key Rules:</strong>
        <ul className="list-disc list-inside ml-2 space-y-1">
          <li>
            <strong>Eligibility:</strong> Indian women and girls of any age.
            Minors via natural / legal guardian.
          </li>
          <li>
            <strong>Interest:</strong> 7.5% p.a., compounded quarterly, paid
            at maturity along with principal.
          </li>
          <li>
            <strong>Tenure:</strong> exactly 2 years from date of deposit.
          </li>
          <li>
            <strong>Limits:</strong> ₹1,000 to ₹2,00,000 per depositor (sum
            across all MSSC accounts).
          </li>
          <li>
            <strong>Tax:</strong> interest is taxable; <em>no Section 80C
            deduction</em>; TDS not applicable.
          </li>
          <li>
            <strong>Where:</strong> any Post Office or participating
            scheduled bank (SBI, BoB, Canara, PNB, Union Bank, ICICI etc.).
          </li>
        </ul>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-800 leading-relaxed">
        <span className="mr-1">ℹ️</span>
        <strong>Disclaimer:</strong> 7.5% interest is fixed for all MSSC
        deposits for the entire 2-year tenure (locked-in at deposit time).
        Even if government changes small-savings rates later, your account
        rate is unchanged. Compare with Senior Citizen Savings Scheme
        (8.2%), Sukanya Samriddhi (8.2%), PPF (7.1%) for alternative tax-free
        / tax-saving options. Reference:{" "}
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
