"use client";
import { useState, useMemo } from "react";

/**
 * Kisan Vikas Patra (KVP) Calculator
 *
 * KVP is a Government of India small-savings scheme. Money DOUBLES at
 * the prevailing interest rate (currently 7.5% p.a.) over a fixed
 * tenure (currently 115 months = 9 years 5 months).
 *
 * VERIFIED RULES (FY 2025-26 / Q4 Q1 2026-27):
 *
 *  - Interest rate: 7.5% p.a., compounded annually (set quarterly by MoF;
 *    unchanged since 1 Apr 2023)
 *  - Tenure to double: 115 months (9 yrs 5 mo) at 7.5% — verified that
 *    1.075^(115/12) ≈ 2.00
 *  - Min investment: ₹1,000 (multiples of ₹100)
 *  - No maximum cap on investment
 *  - Premature encashment: allowed after 2.5 years (30 months); interest
 *    rate reduced for early closure
 *  - Sole or joint account; minor accounts via guardian
 *  - Tax: NO 80C deduction; interest is taxable as "Income from Other
 *    Sources"; NO TDS deducted by Post Office (subscriber self-declares)
 *  - Transferable: between holders once (e.g. on death) and across post
 *    offices freely
 *  - Loan collateral: KVP can be pledged for bank/NBFC loans
 *
 * Maturity formula:
 *   M = P × (1 + r)^(t/12)
 *
 *   Where t = tenure in months (115), r = annual rate (0.075)
 *   M ≈ 2P (always doubles regardless of P)
 *
 * Sources:
 *  - Ministry of Finance, Department of Economic Affairs (quarterly small
 *    savings rate notification)
 *  - https://www.indiapost.gov.in (KVP scheme page)
 *  - https://cleartax.in/s/kisan-vikas-patra
 *  - https://www.bajajfinserv.in/investments/kvp-interest-rate
 *  - https://upstox.com (Q1 FY 2026-27 KVP rate confirmation)
 */

const ANNUAL_RATE = 0.075; // 7.5%
const TENURE_MONTHS = 115;
const TENURE_YEARS = TENURE_MONTHS / 12;
const MIN_DEPOSIT = 1_000;

function kvpMaturity(principal: number) {
  const maturity = principal * Math.pow(1 + ANNUAL_RATE, TENURE_YEARS);
  return { maturity, interest: maturity - principal };
}

function buildYearlyTable(principal: number) {
  const rows: {
    year: number | string;
    openingBalance: number;
    interestEarned: number;
    closingBalance: number;
  }[] = [];
  let balance = principal;
  // 9 full years
  for (let y = 1; y <= 9; y++) {
    const opening = balance;
    const interest = opening * ANNUAL_RATE;
    balance = opening + interest;
    rows.push({
      year: y,
      openingBalance: opening,
      interestEarned: interest,
      closingBalance: balance,
    });
  }
  // Final 5 months (year 9 to month 115)
  const finalMonths = TENURE_MONTHS - 9 * 12;
  const opening = balance;
  const interest = opening * Math.pow(1 + ANNUAL_RATE, finalMonths / 12) - opening;
  balance = opening + interest;
  rows.push({
    year: `Yr 10 (5mo)`,
    openingBalance: opening,
    interestEarned: interest,
    closingBalance: balance,
  });
  return rows;
}

export default function KvpCalculator() {
  const [principal, setPrincipal] = useState<number>(50_000);

  const result = useMemo(() => {
    if (principal < MIN_DEPOSIT) {
      return { invalid: true as const, reason: `Minimum ₹${MIN_DEPOSIT}.` };
    }
    if (principal % 100 !== 0) {
      return {
        invalid: true as const,
        reason: "KVP deposits must be in multiples of ₹100.",
      };
    }
    const { maturity, interest } = kvpMaturity(principal);
    const yearly = buildYearlyTable(principal);
    return { invalid: false as const, maturity, interest, yearly };
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
      <div className="inline-block bg-yellow-100 text-yellow-800 text-sm font-semibold px-4 py-1.5 rounded-full">
        🌾 KVP · 7.5% p.a. · Doubles in 115 months
      </div>

      <div className="space-y-5">
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">
              Investment Amount
            </label>
            <span className="text-sm font-bold text-yellow-700">
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
          <div className="bg-gradient-to-r from-yellow-500 to-amber-600 rounded-2xl p-6 text-white">
            <div className="text-sm font-medium opacity-80 mb-1">
              Maturity Amount (after 9 years 5 months)
            </div>
            <div className="text-4xl font-bold">{fmt(result.maturity)}</div>
            <div className="text-sm opacity-80 mt-2">
              Principal {fmt(principal)} + Interest{" "}
              <span className="font-bold">{fmt(result.interest)}</span> ·{" "}
              {((result.maturity / principal - 1) * 100).toFixed(1)}% absolute
              return
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">
                Tenure
              </div>
              <div className="text-xl font-bold text-yellow-700">
                115 months
              </div>
              <div className="text-[10px] text-gray-500 mt-1">
                9 years 5 months
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">
                Interest Rate
              </div>
              <div className="text-xl font-bold text-amber-600">7.50%</div>
              <div className="text-[10px] text-gray-500 mt-1">
                Compounded annually
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">
                Money Multiple
              </div>
              <div className="text-xl font-bold text-emerald-600">
                {(result.maturity / principal).toFixed(2)}×
              </div>
              <div className="text-[10px] text-gray-500 mt-1">
                Doubles + a bit
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-3">
              Year-by-Year Compounding
            </h3>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-2 font-semibold text-gray-700">
                      Period
                    </th>
                    <th className="text-right p-2 font-semibold text-gray-700">
                      Opening Balance
                    </th>
                    <th className="text-right p-2 font-semibold text-gray-700">
                      Interest @ 7.5%
                    </th>
                    <th className="text-right p-2 font-semibold text-gray-700">
                      Closing Balance
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {result.yearly.map((y, i) => (
                    <tr key={i} className="border-t hover:bg-gray-50">
                      <td className="p-2 font-medium text-gray-900">
                        {y.year}
                      </td>
                      <td className="p-2 text-right text-gray-700">
                        {fmtDecimal(y.openingBalance)}
                      </td>
                      <td className="p-2 text-right text-blue-600">
                        {fmtDecimal(y.interestEarned)}
                      </td>
                      <td className="p-2 text-right text-yellow-700 font-semibold">
                        {fmtDecimal(y.closingBalance)}
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
        <strong>KVP key features:</strong>
        <ul className="list-disc list-inside ml-2 space-y-1">
          <li>
            <strong>Issuer:</strong> Government of India via Post Office /
            authorized banks. Sovereign credit risk = zero.
          </li>
          <li>
            <strong>Tenure:</strong> 115 months (9 yrs 5 mo). Money doubles at
            current 7.5% rate.
          </li>
          <li>
            <strong>Premature closure:</strong> allowed after 30 months
            (2.5 yrs); reduced effective interest.
          </li>
          <li>
            <strong>No tax benefit:</strong> NOT eligible for 80C. Interest
            taxable as Income from Other Sources at slab rate.
          </li>
          <li>
            <strong>No TDS:</strong> Post Office doesn&apos;t deduct TDS.
            Subscriber declares interest in ITR.
          </li>
          <li>
            <strong>Transfer:</strong> can be transferred between holders
            (death, gift, court order) and across post offices freely.
          </li>
        </ul>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-800 leading-relaxed">
        <span className="mr-1">ℹ️</span>
        <strong>Disclaimer:</strong> Interest rate 7.5% locked at purchase.
        If MoF changes rates next quarter, your KVP unchanged. Compare
        alternatives: NSC at 7.7% (5 yrs, 80C eligible), PPF at 7.1%
        (15 yrs, tax-free), SCSS at 8.2% (5 yrs, seniors only), Bank FD
        at 7-7.5%. Reference:{" "}
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
