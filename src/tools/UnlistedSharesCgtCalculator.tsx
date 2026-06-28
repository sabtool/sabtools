"use client";
import { useMemo, useState } from "react";

/**
 * Capital Gains Tax Calculator for Unlisted Shares (India)
 *
 * Built for ESOP holders, startup founders, angel investors and
 * employees of unicorns / private companies selling their shares
 * via secondary tender, IPO release, or buyback.
 *
 * Key statutory framework:
 *   - Income Tax Act, Section 2(42A)  : holding period definition
 *   - Section 112                     : LTCG rate on transfer of capital assets
 *   - Section 112A                    : LTCG on listed equity (NOT applicable here)
 *   - Section 48                      : indexation of cost (now defunct for non-property)
 *   - Section 111A                    : 20% STCG (does NOT apply to unlisted)
 *   - Finance Act 2024 (Jul 23 2024)  : LTCG harmonised to 12.5% without indexation
 *   - Finance Act 2024 buy-back rule  : buyback proceeds now taxable in seller's hands
 *
 * Tax rates (FY 2025-26 — Resident individual / HUF):
 *   Unlisted shares LTCG (holding > 24 months):
 *     12.5% on gain (no indexation) — Finance Act 2024
 *   Unlisted shares STCG (holding ≤ 24 months):
 *     Slab rates (added to total income)
 *
 * Surcharge on tax (FY 2025-26):
 *   Income ≤ 50L   : 0%
 *   50L - 1Cr      : 10%
 *   1Cr - 2Cr      : 15%
 *   2Cr - 5Cr      : 25%  (but capped at 15% for LTCG/STCG portion)
 *   > 5Cr          : 37%  (capped at 15% for LTCG/STCG portion)
 *
 * Health & Education Cess: 4% on (tax + surcharge)
 *
 * Cost Inflation Index (informational only — for property comparison):
 *   FY 2024-25 = 363,  FY 2025-26 = 376 (estimated), FY 2026-27 = 390 (est.)
 */

interface Inputs {
  salePrice: number;
  costAcquisition: number;
  purchaseYear: number;
  saleYear: number;
  purchaseMonth: number;
  saleMonth: number;
  improvementCost: number;
  expenses: number;
  otherIncome: number;
  isResident: boolean;
  slabRate: number; // STCG slab rate
}

// CII values from CBDT notifications. 2025-26 + 2026-27 are estimates
const CII: Record<number, number> = {
  2001: 100, 2002: 105, 2003: 109, 2004: 113, 2005: 117, 2006: 122,
  2007: 129, 2008: 137, 2009: 148, 2010: 167, 2011: 184, 2012: 200,
  2013: 220, 2014: 240, 2015: 254, 2016: 264, 2017: 272, 2018: 280,
  2019: 289, 2020: 301, 2021: 317, 2022: 331, 2023: 348, 2024: 363,
  2025: 376, 2026: 390,
};

interface Result {
  holdingMonths: number;
  isLongTerm: boolean;
  rawGain: number;
  indexedCost: number;
  indexedGain: number;
  ltcgTaxNew: number;     // 12.5% without indexation
  ltcgTaxOld: number;     // 20% with indexation (for comparison)
  stcgTax: number;        // slab-rate STCG
  baseTax: number;        // chosen tax
  surcharge: number;
  cess: number;
  totalTax: number;
  netAmount: number;
  effectiveTaxRate: number;
  governing: "ltcg-new" | "stcg";
  totalIncomeForSurcharge: number;
}

function fmtINR(n: number, max = 0): string {
  if (!isFinite(n) || n === 0) return "—";
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: max })
    .format(Math.round(n));
}

function surchargeRateForCG(totalIncome: number): number {
  // For LTCG / STCG: surcharge capped at 15% above ₹2 Cr
  if (totalIncome <= 5_000_000) return 0;
  if (totalIncome <= 10_000_000) return 0.10;
  if (totalIncome <= 20_000_000) return 0.15;
  return 0.15; // capped at 15% for capital gains above ₹2 Cr
}

function surchargeRateForSlab(totalIncome: number): number {
  if (totalIncome <= 5_000_000) return 0;
  if (totalIncome <= 10_000_000) return 0.10;
  if (totalIncome <= 20_000_000) return 0.15;
  if (totalIncome <= 50_000_000) return 0.25;
  return 0.37;
}

function compute(i: Inputs): Result | null {
  if (i.salePrice <= 0 || i.costAcquisition <= 0) return null;

  // Holding period in months
  const purchaseDate = i.purchaseYear * 12 + i.purchaseMonth;
  const saleDate = i.saleYear * 12 + i.saleMonth;
  const holdingMonths = Math.max(0, saleDate - purchaseDate);
  const isLongTerm = holdingMonths > 24;

  // Net cost
  const netCost = i.costAcquisition + i.improvementCost;
  const rawGain = i.salePrice - netCost - i.expenses;

  // Indexed cost (FY-based, using purchaseYear and saleYear)
  const ciiPurchase = CII[i.purchaseYear] || 100;
  const ciiSale = CII[i.saleYear] || 363;
  const indexedCost = (netCost * ciiSale) / ciiPurchase;
  const indexedGain = i.salePrice - indexedCost - i.expenses;

  // LTCG calculations
  let ltcgTaxNew = 0;
  let ltcgTaxOld = 0;
  let stcgTax = 0;

  if (isLongTerm) {
    ltcgTaxNew = Math.max(0, rawGain) * 0.125;
    ltcgTaxOld = Math.max(0, indexedGain) * 0.20;
  } else {
    stcgTax = Math.max(0, rawGain) * (i.slabRate / 100);
  }

  let governing: Result["governing"] = isLongTerm ? "ltcg-new" : "stcg";
  const baseTax = isLongTerm ? ltcgTaxNew : stcgTax;

  // Surcharge: based on total income including capital gain
  const totalIncomeForSurcharge = i.otherIncome + Math.max(0, rawGain);
  const surchargeRate = isLongTerm
    ? surchargeRateForCG(totalIncomeForSurcharge)
    : surchargeRateForSlab(totalIncomeForSurcharge);
  const surcharge = baseTax * surchargeRate;

  // Cess 4%
  const cess = (baseTax + surcharge) * 0.04;

  const totalTax = baseTax + surcharge + cess;
  const netAmount = i.salePrice - totalTax - i.expenses;
  const effectiveTaxRate = i.salePrice > 0 ? (totalTax / Math.max(1, rawGain)) * 100 : 0;

  return {
    holdingMonths,
    isLongTerm,
    rawGain,
    indexedCost,
    indexedGain,
    ltcgTaxNew,
    ltcgTaxOld,
    stcgTax,
    baseTax,
    surcharge,
    cess,
    totalTax,
    netAmount,
    effectiveTaxRate,
    governing,
    totalIncomeForSurcharge,
  };
}

export default function UnlistedSharesCgtCalculator() {
  const [salePrice, setSalePrice] = useState("10000000");
  const [costAcquisition, setCostAcquisition] = useState("1000000");
  const [purchaseYear, setPurchaseYear] = useState("2020");
  const [saleYear, setSaleYear] = useState("2026");
  const [purchaseMonth, setPurchaseMonth] = useState("4");
  const [saleMonth, setSaleMonth] = useState("6");
  const [improvementCost, setImprovementCost] = useState("0");
  const [expenses, setExpenses] = useState("0");
  const [otherIncome, setOtherIncome] = useState("1500000");
  const [slabRate, setSlabRate] = useState("30");

  const inputs: Inputs = {
    salePrice: parseFloat(salePrice) || 0,
    costAcquisition: parseFloat(costAcquisition) || 0,
    purchaseYear: parseInt(purchaseYear) || 2020,
    saleYear: parseInt(saleYear) || 2026,
    purchaseMonth: parseInt(purchaseMonth) || 4,
    saleMonth: parseInt(saleMonth) || 6,
    improvementCost: parseFloat(improvementCost) || 0,
    expenses: parseFloat(expenses) || 0,
    otherIncome: parseFloat(otherIncome) || 0,
    isResident: true,
    slabRate: parseFloat(slabRate) || 30,
  };

  const result = useMemo(() => compute(inputs), [
    salePrice, costAcquisition, purchaseYear, saleYear, purchaseMonth, saleMonth,
    improvementCost, expenses, otherIncome, slabRate,
  ]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-6">
      {/* Sale + cost */}
      <div className="result-card">
        <h3 className="font-bold text-gray-800 mb-1">💰 Sale + acquisition details</h3>
        <p className="text-xs text-gray-500 mb-3">
          For ESOP exits, use the <strong>FMV at exercise date</strong> as Cost of Acquisition
          (because perquisite tax was already paid on FMV-minus-exercise-price difference at vesting).
          For founder shares, use the original subscription price.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Sale price (₹ total consideration)" value={salePrice} setValue={setSalePrice} hint="What you received from the buyer / company" />
          <Field label="Cost of acquisition (₹)" value={costAcquisition} setValue={setCostAcquisition} hint="ESOPs: FMV at exercise; founders: subscription price" />
          <Field label="Improvement cost (₹)" value={improvementCost} setValue={setImprovementCost} hint="Rare for shares — usually 0" />
          <Field label="Transfer expenses (₹)" value={expenses} setValue={setExpenses} hint="Brokerage, legal, advisor fees" />
        </div>
      </div>

      {/* Dates */}
      <div className="result-card">
        <h3 className="font-bold text-gray-800 mb-1">📅 Holding period</h3>
        <p className="text-xs text-gray-500 mb-3">
          More than 24 months = Long-term capital gain (LTCG @ 12.5%). 24 months or less =
          Short-term capital gain (STCG @ slab rate). For ESOPs, the holding period starts from
          the date of <strong>exercise</strong>, not grant or vest.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Purchase month</label>
            <select value={purchaseMonth} onChange={(e) => setPurchaseMonth(e.target.value)} className="calc-input">
              {["Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar"].map((m, i) => (
                <option key={i} value={i + 1}>{m}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Purchase financial year</label>
            <select value={purchaseYear} onChange={(e) => setPurchaseYear(e.target.value)} className="calc-input">
              {Object.keys(CII).map((y) => (
                <option key={y} value={y}>FY {y}-{(parseInt(y) + 1).toString().slice(-2)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Sale month</label>
            <select value={saleMonth} onChange={(e) => setSaleMonth(e.target.value)} className="calc-input">
              {["Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar"].map((m, i) => (
                <option key={i} value={i + 1}>{m}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Sale financial year</label>
            <select value={saleYear} onChange={(e) => setSaleYear(e.target.value)} className="calc-input">
              {Object.keys(CII).map((y) => (
                <option key={y} value={y}>FY {y}-{(parseInt(y) + 1).toString().slice(-2)}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Other income */}
      <div className="result-card">
        <h3 className="font-bold text-gray-800 mb-1">📊 Other income (for surcharge calculation)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Your other annual income (₹)" value={otherIncome} setValue={setOtherIncome} hint="Salary, business, interest — determines surcharge slab" />
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Your slab rate % (for STCG only)</label>
            <select value={slabRate} onChange={(e) => setSlabRate(e.target.value)} className="calc-input">
              <option value="5">5% slab (income ₹3-7L new regime)</option>
              <option value="10">10% slab</option>
              <option value="15">15% slab</option>
              <option value="20">20% slab</option>
              <option value="30">30% slab (income above ₹15L)</option>
            </select>
            <p className="text-[11px] text-gray-400 mt-1">Only used if holding ≤ 24 months. LTCG ignores slab.</p>
          </div>
        </div>
      </div>

      {/* Result */}
      {result ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl p-4 text-center">
              <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Capital gain</div>
              <div className="text-2xl font-extrabold text-indigo-900 mt-1">{fmtINR(result.rawGain)}</div>
              <div className="text-[11px] text-indigo-700 mt-1">
                {result.isLongTerm ? "Long-term" : "Short-term"} · {result.holdingMonths} months
              </div>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-rose-50 border border-red-200 rounded-2xl p-4 text-center">
              <div className="text-xs font-semibold text-red-700 uppercase tracking-wider">Total tax payable</div>
              <div className="text-2xl font-extrabold text-red-900 mt-1">{fmtINR(result.totalTax)}</div>
              <div className="text-[11px] text-red-700 mt-1">
                Effective {result.effectiveTaxRate.toFixed(1)}% of gain
              </div>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl p-4 text-center">
              <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Net in hand</div>
              <div className="text-2xl font-extrabold text-emerald-900 mt-1">{fmtINR(result.netAmount)}</div>
              <div className="text-[11px] text-emerald-700 mt-1">
                After tax + expenses
              </div>
            </div>
          </div>

          <div className={`border rounded-2xl p-5 ${result.isLongTerm ? "bg-emerald-50 border-emerald-200" : "bg-amber-50 border-amber-200"}`}>
            <h3 className={`font-bold text-lg ${result.isLongTerm ? "text-emerald-900" : "text-amber-900"}`}>
              {result.isLongTerm ? "✅ Long-term capital gain" : "⚠️ Short-term capital gain"}
            </h3>
            <p className={`mt-2 text-sm leading-relaxed ${result.isLongTerm ? "text-emerald-800" : "text-amber-800"}`}>
              {result.isLongTerm
                ? `Held for ${result.holdingMonths} months (> 24 months). Section 112 LTCG @ 12.5% applies. Finance Act 2024 removed indexation benefit for non-property assets — for unlisted shares, indexation is no longer available. You pay 12.5% on the raw gain.`
                : `Held for ${result.holdingMonths} months (≤ 24 months). Section 111A does NOT apply to unlisted shares — the gain is added to your total income and taxed at your slab rate of ${slabRate}%. Selling 1-2 months later would change this to 12.5% LTCG.`}
            </p>
          </div>

          <div className="result-card">
            <h3 className="font-bold text-gray-800 mb-3">🧮 Tax computation breakdown</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 text-gray-600">Sale price</td>
                    <td className="py-2 text-right tabular-nums font-bold">{fmtINR(parseFloat(salePrice))}</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 text-gray-600">− Cost of acquisition</td>
                    <td className="py-2 text-right tabular-nums">({fmtINR(parseFloat(costAcquisition))})</td>
                  </tr>
                  {parseFloat(improvementCost) > 0 && (
                    <tr className="border-b border-gray-100">
                      <td className="py-2 text-gray-600">− Improvement cost</td>
                      <td className="py-2 text-right tabular-nums">({fmtINR(parseFloat(improvementCost))})</td>
                    </tr>
                  )}
                  {parseFloat(expenses) > 0 && (
                    <tr className="border-b border-gray-100">
                      <td className="py-2 text-gray-600">− Transfer expenses</td>
                      <td className="py-2 text-right tabular-nums">({fmtINR(parseFloat(expenses))})</td>
                    </tr>
                  )}
                  <tr className="border-b border-gray-200 bg-indigo-50/30">
                    <td className="py-2 text-gray-800 font-bold">= Capital gain</td>
                    <td className="py-2 text-right tabular-nums font-bold text-indigo-700">{fmtINR(result.rawGain)}</td>
                  </tr>
                  {result.isLongTerm ? (
                    <tr className="border-b border-gray-100">
                      <td className="py-2 text-gray-600">× LTCG rate (12.5% — Finance Act 2024)</td>
                      <td className="py-2 text-right tabular-nums font-bold text-red-700">{fmtINR(result.ltcgTaxNew)}</td>
                    </tr>
                  ) : (
                    <tr className="border-b border-gray-100">
                      <td className="py-2 text-gray-600">× STCG rate (your {slabRate}% slab)</td>
                      <td className="py-2 text-right tabular-nums font-bold text-red-700">{fmtINR(result.stcgTax)}</td>
                    </tr>
                  )}
                  {result.surcharge > 0 && (
                    <tr className="border-b border-gray-100">
                      <td className="py-2 text-gray-600">+ Surcharge</td>
                      <td className="py-2 text-right tabular-nums font-bold text-red-700">{fmtINR(result.surcharge)}</td>
                    </tr>
                  )}
                  <tr className="border-b border-gray-100">
                    <td className="py-2 text-gray-600">+ Health & Education Cess (4%)</td>
                    <td className="py-2 text-right tabular-nums font-bold text-red-700">{fmtINR(result.cess)}</td>
                  </tr>
                  <tr className="border-b-2 border-gray-300 bg-red-50/40">
                    <td className="py-3 text-gray-900 font-extrabold">Total tax payable</td>
                    <td className="py-3 text-right tabular-nums font-extrabold text-red-800 text-base">{fmtINR(result.totalTax)}</td>
                  </tr>
                  <tr className="bg-emerald-50/40">
                    <td className="py-3 text-gray-900 font-extrabold">Net amount in your hand</td>
                    <td className="py-3 text-right tabular-nums font-extrabold text-emerald-800 text-base">{fmtINR(result.netAmount)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {result.isLongTerm && (
            <div className="result-card">
              <h3 className="font-bold text-gray-800 mb-3">📊 New vs Old regime — informational comparison</h3>
              <p className="text-xs text-gray-500 mb-3">
                <strong>For unlisted shares, the new 12.5% rate is mandatory.</strong> Indexation
                isn&apos;t allowed any more. This comparison shows what your tax would have been
                under the pre-23-July-2024 regime — useful for context.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                  <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">NEW regime (mandatory)</div>
                  <div className="text-xl font-extrabold text-emerald-900 mt-1">12.5% × {fmtINR(result.rawGain)}</div>
                  <div className="text-sm text-emerald-800 mt-2">Tax = {fmtINR(result.ltcgTaxNew)}</div>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider">OLD regime (no longer available)</div>
                  <div className="text-xl font-extrabold text-gray-700 mt-1">20% × {fmtINR(result.indexedGain)}</div>
                  <div className="text-sm text-gray-700 mt-2">Tax = {fmtINR(result.ltcgTaxOld)}</div>
                  <div className="text-[11px] text-gray-500 mt-1">Indexed cost was {fmtINR(result.indexedCost)}</div>
                </div>
              </div>
              <p className="text-[11px] text-gray-500 mt-3">
                {result.ltcgTaxNew > result.ltcgTaxOld
                  ? `You would have paid ${fmtINR(result.ltcgTaxOld - result.ltcgTaxNew * -1)} less under the old indexation regime. Finance Act 2024 has hurt you in this case — common when costs were old and asset appreciated less aggressively.`
                  : `The new 12.5% rate is favourable for you — you would have paid more under indexation. Common when asset appreciated faster than CII inflation (typical for hot growth stocks).`}
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center text-sm text-gray-500">
          Enter sale price, cost of acquisition, and dates to compute capital gains tax.
        </div>
      )}

      {/* Formula */}
      <div className="result-card">
        <h3 className="font-bold text-gray-800 mb-1">📐 Tax computation formulas</h3>
        <pre className="bg-gray-900 text-green-200 text-xs sm:text-sm rounded-xl p-4 overflow-x-auto leading-relaxed">
{`Holding period:
  Months = (Sale FY × 12 + Sale month) − (Purchase FY × 12 + Purchase month)
  > 24 months → Long-term capital gain (LTCG)
  ≤ 24 months → Short-term capital gain (STCG)

Capital gain:
  Gain = Sale price − Cost of acquisition − Improvement − Expenses

LTCG tax (Finance Act 2024, FY 2024-25 onwards):
  Tax = 12.5% × Gain
  (Indexation NO LONGER allowed for unlisted shares)

STCG tax (unlisted shares):
  Tax = Slab rate × Gain   (Section 111A does NOT apply to unlisted)

Surcharge on LTCG / STCG:
  Income ≤ 50L     : 0%
  50L − 1Cr        : 10%
  1Cr − 2Cr        : 15%
  > 2Cr            : 15% (capped for capital gains, vs 25-37% for regular)

Cess: 4% on (Tax + Surcharge)

Total tax = Base tax + Surcharge + Cess

Net in hand = Sale price − Total tax − Transfer expenses`}
        </pre>
        <p className="text-xs text-gray-600 mt-3 leading-relaxed">
          <strong>Finance Act 2024 change:</strong> Effective 23 July 2024, LTCG on most capital
          assets (except real estate acquired before this date) is taxed at a flat 12.5% without
          indexation. The earlier 20%-with-indexation regime no longer applies to unlisted shares,
          gold, debt mutual funds, or other long-term financial assets.
        </p>
      </div>

      {/* FAQ */}
      <div className="result-card">
        <h3 className="font-bold text-gray-800 mb-3">❓ FAQs</h3>
        <div className="space-y-4 text-sm">
          <div>
            <h4 className="font-bold text-gray-800">How are ESOPs taxed in India?</h4>
            <p className="text-gray-600 mt-1">
              <strong>Two tax events</strong>. (1) <strong>At exercise</strong>: the difference
              between Fair Market Value (FMV) on exercise date and your exercise price is treated
              as a perquisite under {"\""}Salary{"\""} and taxed at your slab rate. Employer
              deducts TDS. (2) <strong>At sale</strong>: capital gain = sale price minus FMV at
              exercise (which becomes your new cost basis). Holding period starts from exercise
              date. If over 24 months: 12.5% LTCG; if 24 months or less: STCG at slab. <strong>Key
              tactical note:</strong> for many ESOP holders, the exercise tax bill is the bigger
              problem (paid out-of-pocket without liquidity). Some employers offer
              {"\""}sell-to-cover{"\""} or company-funded exercise. DPIIT-recognised startups can
              defer this perquisite tax up to 4 years under Section 17(2) — a major benefit.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">What changed with Finance Act 2024 for unlisted shares?</h4>
            <p className="text-gray-600 mt-1">
              <strong>Two big changes effective 23 July 2024</strong>: (1) LTCG rate reduced from
              <strong> 20% with indexation</strong> to <strong>12.5% without indexation</strong>.
              For most unlisted-share holders this is favourable because their gains compound
              faster than CII inflation. For very long-held shares purchased before 2018, the old
              indexation regime would have been better — but it&apos;s no longer available.
              (2) <strong>Buy-back proceeds now taxable in seller&apos;s hands</strong> — earlier
              the company paid distribution tax of 23.296% and seller got tax-free amount. Now the
              full buy-back is dividend income taxed at the seller&apos;s slab rate, which can be
              up to 39% effective for high earners. This change made buy-backs significantly less
              attractive vs secondary sales.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">Can I save tax under Section 54F (residential property)?</h4>
            <p className="text-gray-600 mt-1">
              Yes — <strong>Section 54F</strong> lets you exempt LTCG from sale of any long-term
              capital asset (including unlisted shares) by investing the <strong>net sale
              consideration</strong> in a residential house. Important conditions: (1) you must
              not own more than one other residential house at the time of sale; (2) investment
              must be within 1 year before or 2 years after sale (3 years if under construction);
              (3) the new house must not be sold for 3 years; (4) cap of ₹10 crore on the exempt
              investment (introduced FY 2023-24). Partial investment gets proportional exemption.
              For example: ₹5 Cr ESOP gain → invest ₹4 Cr in flat → 80% exemption = save ₹50L
              tax. Section 54F + 54EC can be combined.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">What about Section 54EC bonds?</h4>
            <p className="text-gray-600 mt-1">
              <strong>Section 54EC</strong>: invest LTCG (up to ₹50L) in NHAI / REC / IRFC /
              PFC / RECL bonds within 6 months of sale → exempt from capital gains tax. Bonds
              have 5-year lock-in, ~5-5.5% interest (taxable), and ₹50L cap per financial year.
              For an ESOP holder with ₹30L LTCG and 12.5% tax (₹3.75L payable), investing ₹30L in
              REC bonds saves the entire ₹3.75L tax but locks ₹30L for 5 years. Useful if you
              don&apos;t need the cash; otherwise the locked-up opportunity cost (5% in bonds vs
              10-15% potential return elsewhere) makes it borderline. Many high-income founders
              combine 54EC with 54F (residential property) to fully shield large exit windfalls.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">How is TDS deducted on sale of unlisted shares?</h4>
            <p className="text-gray-600 mt-1">
              <strong>To a resident buyer</strong>: no TDS is automatically deducted on sale of
              unlisted shares between residents. The seller pays advance tax or self-assessment
              at the time of filing ITR. <strong>To a non-resident buyer</strong> (NRI / foreign
              fund): the buyer must deduct <strong>TDS at 10% on the total consideration</strong>{" "}
              under Section 195 — not on the gain, on the full sale amount. The seller files for
              refund of excess if actual tax is lower. This often creates cash-flow strain for
              founders selling to foreign investors. To avoid this, file Form 13 with the AO
              before sale to get a lower-TDS or nil-TDS certificate based on your real expected
              tax liability.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">Can I offset capital losses against this gain?</h4>
            <p className="text-gray-600 mt-1">
              Yes — Section 70/71/74 set-off rules. <strong>LTCG can be set off against</strong>:
              (1) LTCL (long-term capital loss) from any asset in same year, (2) brought-forward
              LTCL from prior 8 years. <strong>STCG can be set off against</strong>: STCL or LTCL.
              <strong> LTCL cannot be set off against</strong> STCG (loss is the {"\""}lower{"\""}
              flexibility). Example: ESOP LTCG ₹50L + LTCL from mutual fund ₹15L = net taxable
              LTCG ₹35L → tax @ 12.5% = ₹4.375L (vs ₹6.25L without offset). To carry forward
              losses you must file ITR before due date (typically 31 July) — late filers lose the
              carry-forward benefit. STCL can be carried forward 8 years too.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">How is FMV determined for unlisted shares?</h4>
            <p className="text-gray-600 mt-1">
              For tax purposes, FMV is determined by <strong>Rule 11UA of the Income Tax
              Rules</strong>. Two methods: (1) <strong>Book value method</strong>: FMV = (Net
              asset value of company × Equity %); (2) <strong>Discounted Cash Flow (DCF) method</strong>:
              taxpayer&apos;s choice, but must be supported by a merchant banker&apos;s certificate.
              Companies typically use the book value method which is conservative. For tender-offer
              secondaries, the offer price itself is treated as FMV. <strong>Section 50CA</strong>:
              if you sell below FMV, you&apos;re still taxed on FMV (deemed consideration). This
              prevents under-pricing tricks. <strong>Section 56(2)(viib)</strong>: if buyer
              acquires above FMV, the excess is taxed as income in the company&apos;s hands —
              affects pricing of fresh issuances (was the {"\""}angel tax{"\""} until partially
              repealed Apr 2024).
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">What if I&apos;m an NRI selling unlisted shares?</h4>
            <p className="text-gray-600 mt-1">
              NRIs follow same LTCG rate of 12.5% post Finance Act 2024 — but the TDS mechanism is
              stricter (Section 195: 10% TDS on full consideration, not just gain). <strong>Tax
              treaty (DTAA)</strong> may give relief — most India tax treaties have a {"\""}capital
              gains{"\""} article that varies by country. With <strong>Mauritius and Singapore</strong>:
              old treaties (pre-2017 acquired shares) had favourable Mauritius/Singapore-based tax;
              the protocols since have brought parity with Indian rates. NRIs investing in startups
              now use mostly transparent vehicles and pay tax at 12.5% in India, then offset
              against home-country tax. Always engage a CA familiar with NRI capital gains —
              filing ITR is mandatory even with TDS, to claim refund of excess withheld.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, setValue, hint, step = 1 }: { label: string; value: string; setValue: (v: string) => void; hint?: string; step?: number }) {
  return (
    <div>
      <label className="text-sm font-semibold text-gray-700 block mb-1">{label}</label>
      <input
        type="number"
        inputMode="decimal"
        step={step}
        min={0}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="calc-input"
      />
      {hint && <p className="text-[11px] text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}
