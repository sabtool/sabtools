"use client";
import { useState, useMemo } from "react";

/**
 * NSC (National Savings Certificate) Calculator
 *
 * NSC is a Government of India small-savings instrument with fixed tenure
 * and government-set interest rate. Issued by Post Offices and authorized
 * banks. NSC VIII Issue is the standard form available today.
 *
 * VERIFIED RULES (FY 2025-26 / 2026-27 Q1):
 *
 *  - Interest rate: 7.7% p.a. (set quarterly by Ministry of Finance;
 *    unchanged since 1 Apr 2025; unchanged for Apr-Jun 2026 quarter)
 *  - Compounding: ANNUAL — but interest is reinvested, paid only at maturity
 *  - Tenure: 5 years (lock-in)
 *  - Min deposit: ₹1,000; no maximum (multiples of ₹100)
 *  - Tax: principal up to ₹1.5L deductible u/s 80C; reinvested annual
 *    interest is also eligible for 80C deduction (years 1-4); year-5 interest
 *    is taxable
 *  - Premature closure: NOT allowed except in case of holder's death,
 *    court order, or forfeiture by gazetted officer
 *  - Loan facility: NSC can be pledged as collateral against bank/NBFC loan
 *  - Transfer: allowed once between holders (e.g. on death) with permission
 *
 * Formula:
 *   Maturity = Principal × (1 + r/100)^5
 *   where r = 7.7
 *
 *   For ₹1L:  Maturity = 1L × 1.077^5 = ₹1,44,903 (interest = ₹44,903)
 *
 * Year-by-year balance:
 *   Yr 1 closing = P × 1.077
 *   Yr 2 closing = Yr1 × 1.077
 *   ...
 *
 * Sources:
 *  - Ministry of Finance, Department of Economic Affairs notification
 *    on quarterly small savings rates
 *  - https://www.indiapost.gov.in (NSC scheme page)
 *  - https://cleartax.in/s/nsc-national-savings-certificate
 *  - https://www.bajajfinserv.in/investments/nsc-interest-rates
 */

const ANNUAL_RATE = 0.077; // 7.7%
const TENURE_YEARS = 5;
const MIN_DEPOSIT = 1_000;

function nscMaturity(principal: number) {
  const maturity = principal * Math.pow(1 + ANNUAL_RATE, TENURE_YEARS);
  return { maturity, interest: maturity - principal };
}

function buildYearlyTable(principal: number) {
  const rows: {
    year: number;
    openingBalance: number;
    interestEarned: number;
    closingBalance: number;
    eligible80C: boolean;
  }[] = [];
  let balance = principal;
  for (let y = 1; y <= TENURE_YEARS; y++) {
    const opening = balance;
    const interest = opening * ANNUAL_RATE;
    balance = opening + interest;
    rows.push({
      year: y,
      openingBalance: opening,
      interestEarned: interest,
      closingBalance: balance,
      eligible80C: y < TENURE_YEARS, // years 1-4 reinvested = 80C eligible
    });
  }
  return rows;
}

export default function NscCalculator() {
  const [principal, setPrincipal] = useState<number>(100_000);

  const result = useMemo(() => {
    if (principal < MIN_DEPOSIT) {
      return {
        invalid: true as const,
        reason: `Minimum NSC deposit is ₹${MIN_DEPOSIT.toLocaleString("en-IN")}.`,
      };
    }
    if (principal % 100 !== 0) {
      return {
        invalid: true as const,
        reason: "NSC deposits must be in multiples of ₹100.",
      };
    }

    const { maturity, interest } = nscMaturity(principal);
    const yearly = buildYearlyTable(principal);

    // Total 80C eligible amount: principal (year 0) + interest of years 1-4
    const reinvestedInterest = yearly
      .filter((y) => y.eligible80C)
      .reduce((s, y) => s + y.interestEarned, 0);
    const totalEligible80C = Math.min(150_000, principal + reinvestedInterest);
    const taxableYr5Interest = yearly[yearly.length - 1].interestEarned;

    return {
      invalid: false as const,
      maturity,
      interest,
      yearly,
      reinvestedInterest,
      totalEligible80C,
      taxableYr5Interest,
    };
  }, [principal]);

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
      <div className="inline-block bg-green-100 text-green-800 text-sm font-semibold px-4 py-1.5 rounded-full">
        🏦 NSC · 7.7% p.a. · 5-Year Lock-in · 80C Eligible
      </div>

      <div className="space-y-5">
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">
              Investment Amount
            </label>
            <span className="text-sm font-bold text-green-600">
              {fmt(principal)}
            </span>
          </div>
          <input
            type="range"
            min={MIN_DEPOSIT}
            max={1_500_000}
            step={1000}
            value={principal}
            onChange={(e) => setPrincipal(+e.target.value)}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>₹1,000</span>
            <span>₹15L (no upper cap)</span>
          </div>
          <input
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(+e.target.value || 0)}
            className="calc-input mt-2"
            min={MIN_DEPOSIT}
            step={100}
          />
          <p className="text-xs text-gray-500 mt-1">
            Multiples of ₹100. Min ₹1,000. No upper limit.
          </p>
        </div>
      </div>

      {result.invalid ? (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-sm text-rose-800">
          ⚠ {result.reason}
        </div>
      ) : (
        <div className="result-card space-y-4">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
            <div className="text-sm font-medium opacity-80 mb-1">
              Maturity Amount (after 5 years)
            </div>
            <div className="text-4xl font-bold">{fmt(result.maturity)}</div>
            <div className="text-sm opacity-80 mt-2">
              Principal {fmt(principal)} + Interest{" "}
              <span className="font-bold">{fmt(result.interest)}</span>{" "}
              (45.0% absolute return)
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">
                Investment
              </div>
              <div className="text-xl font-bold text-blue-600">
                {fmt(principal)}
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
                CAGR
              </div>
              <div className="text-xl font-bold text-purple-600">7.70%</div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-3">
              Year-by-Year Compounding (Annual)
            </h3>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-2 font-semibold text-gray-700">
                      Year
                    </th>
                    <th className="text-right p-2 font-semibold text-gray-700">
                      Opening Balance
                    </th>
                    <th className="text-right p-2 font-semibold text-gray-700">
                      Interest @ 7.7%
                    </th>
                    <th className="text-right p-2 font-semibold text-gray-700">
                      Closing Balance
                    </th>
                    <th className="text-center p-2 font-semibold text-gray-700">
                      80C Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {result.yearly.map((y) => (
                    <tr key={y.year} className="border-t hover:bg-gray-50">
                      <td className="p-2 font-medium text-gray-900">
                        {y.year}
                      </td>
                      <td className="p-2 text-right text-gray-700">
                        {fmtDecimal(y.openingBalance)}
                      </td>
                      <td className="p-2 text-right text-blue-600">
                        {fmtDecimal(y.interestEarned)}
                      </td>
                      <td className="p-2 text-right text-green-700 font-semibold">
                        {fmtDecimal(y.closingBalance)}
                      </td>
                      <td className="p-2 text-center">
                        {y.eligible80C ? (
                          <span className="text-emerald-700 font-semibold text-[10px]">
                            ✓ Reinvested (80C)
                          </span>
                        ) : (
                          <span className="text-rose-700 font-semibold text-[10px]">
                            Taxable
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-xs text-amber-900 leading-relaxed">
            <div className="font-bold mb-2">
              💰 Tax planning summary (Old regime)
            </div>
            <ul className="list-disc list-inside space-y-1">
              <li>
                Year 0: principal of <strong>{fmt(principal)}</strong> qualifies
                for 80C deduction (within ₹1.5L overall 80C limit).
              </li>
              <li>
                Years 1-4: interest earned (
                <strong>{fmt(result.reinvestedInterest)}</strong> total) is
                deemed reinvested → also 80C eligible.
              </li>
              <li>
                Year 5: final-year interest (
                <strong>{fmt(result.taxableYr5Interest)}</strong>) is TAXABLE
                under &quot;Income from Other Sources&quot;.
              </li>
              <li>
                Effective 80C eligible across 5 years (subject to ₹1.5L
                annual cap):{" "}
                <strong>{fmt(result.totalEligible80C)}</strong>
              </li>
              <li>
                <strong>Note:</strong> 80C is OLD regime only. New regime users
                get NO benefit from NSC (use only for safe accumulation).
              </li>
            </ul>
          </div>
        </div>
      )}

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs text-gray-700 leading-relaxed space-y-2">
        <strong>NSC key features:</strong>
        <ul className="list-disc list-inside ml-2 space-y-1">
          <li>
            <strong>Issuer:</strong> Government of India (Post Office /
            authorized banks). Sovereign credit risk = zero.
          </li>
          <li>
            <strong>Fixed return:</strong> 7.7% p.a. locked at purchase. Even
            if Government cuts rates next quarter, your old NSC unchanged.
          </li>
          <li>
            <strong>Lock-in:</strong> 5 years. Premature closure NOT allowed
            except on death, court order, or forfeiture.
          </li>
          <li>
            <strong>No TDS:</strong> Post Office doesn&apos;t deduct TDS on
            NSC. Subscriber must self-declare interest in ITR.
          </li>
          <li>
            <strong>Transferable:</strong> can be transferred between
            individuals once during the term (with required formalities).
          </li>
          <li>
            <strong>Loan collateral:</strong> can be pledged for loans at most
            banks/NBFCs.
          </li>
        </ul>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-800 leading-relaxed">
        <span className="mr-1">ℹ️</span>
        <strong>Disclaimer:</strong> Interest rate is set quarterly by
        Ministry of Finance. Current 7.7% applies to NSC purchased between 1
        Apr 2025 and 30 Jun 2026 (announced rate). Once you buy, the rate is
        locked till maturity. Reference:{" "}
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
