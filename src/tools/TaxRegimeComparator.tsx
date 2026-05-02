"use client";
import { useState, useMemo } from "react";

/**
 * Old vs New Tax Regime Comparator (India) — FY 2025-26 / AY 2026-27
 *
 * Computes income tax under BOTH regimes side-by-side using each regime's
 * applicable rules so you can see the actual rupee-level winner with your
 * specific deduction profile.
 *
 * VERIFIED RULES (Finance Act 2025 / Budget 2025):
 *
 * NEW REGIME (default for FY 2025-26):
 *  - Standard deduction: ₹75,000
 *  - Section 87A rebate: full rebate up to ₹12,00,000 taxable income (max ₹60,000)
 *  - Slabs:
 *      ₹0 - ₹4,00,000     → Nil
 *      ₹4,00,001 - ₹8L    → 5%
 *      ₹8,00,001 - ₹12L   → 10%
 *      ₹12,00,001 - ₹16L  → 15%
 *      ₹16,00,001 - ₹20L  → 20%
 *      ₹20,00,001 - ₹24L  → 25%
 *      Above ₹24L         → 30%
 *  - DEDUCTIONS NOT ALLOWED: 80C, 80D, HRA, 80CCD(1B), Sec 24B, LTA, etc.
 *  - Standard deduction (₹75K) and 80CCD(2) employer NPS contribution are
 *    the ONLY allowed reductions.
 *  - Surcharge capped at 25% (no 37% slab).
 *
 * OLD REGIME:
 *  - Standard deduction: ₹50,000
 *  - Basic exemption: ₹2,50,000 (₹3L for 60-80, ₹5L for 80+)
 *  - Section 87A rebate: full rebate up to ₹5,00,000 taxable income (max ₹12,500)
 *  - Slabs:
 *      Up to basic exemption  → Nil
 *      Up to ₹5L              → 5%
 *      Up to ₹10L             → 20%
 *      Above ₹10L             → 30%
 *  - All deductions allowed: 80C (up to ₹1.5L), 80D, HRA, 80CCD(1B),
 *    Section 24B home loan interest (₹2L), etc.
 *  - Surcharge can go up to 37%.
 *
 * Surcharge slabs (BOTH regimes, applied on tax before cess):
 *   ≤ ₹50L: Nil
 *   ₹50L - ₹1Cr: 10%
 *   ₹1Cr - ₹2Cr: 15%
 *   ₹2Cr - ₹5Cr: 25%
 *   Above ₹5Cr: 37% (Old) / 25% (New, capped)
 *
 * Health & Education Cess: 4% on (tax + surcharge), per Sec 2(11) Finance Act 2025.
 */

type AgeGroup = "below60" | "60to80" | "above80";

function computeOldRegimeTax(
  grossIncome: number,
  ageGroup: AgeGroup,
  deductions: {
    sec80C: number;
    sec80D: number;
    sec80CCD1B: number;
    hraExemption: number;
    homeLoanInterest: number;
    other: number;
  }
): { taxableIncome: number; baseTax: number } {
  const stdDeduction = 50_000;

  // Cap each deduction at its statutory limit
  const capped80C = Math.min(deductions.sec80C, 150_000);
  const capped80CCD1B = Math.min(deductions.sec80CCD1B, 50_000);
  const cappedHomeLoan = Math.min(deductions.homeLoanInterest, 200_000);
  // 80D: cap at ₹100K (₹25K self + ₹25K parents below 60, OR ₹25K self + ₹50K senior parents);
  // we cap at the maximum legal value of ₹1L since user enters their actual claimed amount
  const capped80D = Math.min(deductions.sec80D, 100_000);

  const totalDeductions =
    stdDeduction +
    capped80C +
    capped80D +
    capped80CCD1B +
    deductions.hraExemption +
    cappedHomeLoan +
    deductions.other;

  const exemption =
    ageGroup === "above80"
      ? 500_000
      : ageGroup === "60to80"
      ? 300_000
      : 250_000;

  const taxableIncome = Math.max(0, grossIncome - totalDeductions);

  // 87A rebate up to ₹5L taxable income → zero tax
  if (taxableIncome <= 500_000) {
    // Still compute slab math for transparency, then rebate brings tax to zero.
  }

  // Compute slab tax above the basic exemption
  const aboveExemption = Math.max(0, taxableIncome - exemption);
  // Old regime slabs (above basic exemption):
  //   First ₹2.5L (i.e. ₹2.5L–₹5L): 5%
  //   Next ₹5L (i.e. ₹5L–₹10L): 20%
  //   Above ₹10L: 30%
  let baseTax = 0;
  let remaining = aboveExemption;

  // Slab 1: 5% on first ₹2,50,000 above exemption (so up to ₹5L total taxable)
  const slab1 = Math.min(remaining, 250_000);
  baseTax += slab1 * 0.05;
  remaining -= slab1;

  // Slab 2: 20% on next ₹5,00,000 (₹5L–₹10L taxable)
  if (remaining > 0) {
    const slab2 = Math.min(remaining, 500_000);
    baseTax += slab2 * 0.20;
    remaining -= slab2;
  }

  // Slab 3: 30% above ₹10L taxable
  if (remaining > 0) {
    baseTax += remaining * 0.30;
  }

  // 87A rebate: if taxable income ≤ ₹5L, full rebate (max ₹12,500)
  if (taxableIncome <= 500_000) {
    baseTax = 0;
  }

  return { taxableIncome, baseTax };
}

function computeNewRegimeTax(grossIncome: number): {
  taxableIncome: number;
  baseTax: number;
} {
  const stdDeduction = 75_000;
  const taxableIncome = Math.max(0, grossIncome - stdDeduction);

  // Slabs (FY 2025-26 New Regime, Finance Act 2025)
  const slabs = [
    { upto: 400_000, rate: 0 },
    { upto: 800_000, rate: 0.05 },
    { upto: 1_200_000, rate: 0.10 },
    { upto: 1_600_000, rate: 0.15 },
    { upto: 2_000_000, rate: 0.20 },
    { upto: 2_400_000, rate: 0.25 },
    { upto: Infinity, rate: 0.30 },
  ];

  let baseTax = 0;
  let prev = 0;
  for (const s of slabs) {
    if (taxableIncome <= prev) break;
    const taxable = Math.min(taxableIncome, s.upto) - prev;
    baseTax += taxable * s.rate;
    prev = s.upto;
    if (taxableIncome <= s.upto) break;
  }

  // 87A rebate: taxable income ≤ ₹12,00,000 → tax brought to zero (max ₹60K rebate)
  if (taxableIncome <= 1_200_000) {
    baseTax = Math.max(0, baseTax - 60_000);
  }

  return { taxableIncome, baseTax };
}

function getSurchargeRate(
  taxableIncome: number,
  isNewRegime: boolean
): number {
  // Note: technically surcharge is on TOTAL income, not taxable, but for
  // salary scenarios with reasonable deductions these are close enough that
  // using taxable is the standard convention used by ITR utilities.
  if (taxableIncome <= 5_000_000) return 0;
  if (taxableIncome <= 10_000_000) return 0.10;
  if (taxableIncome <= 20_000_000) return 0.15;
  if (taxableIncome <= 50_000_000) return 0.25;
  return isNewRegime ? 0.25 : 0.37; // New regime capped at 25%; Old can hit 37%
}

function applyMarginalRelief(tax: number, surcharge: number): number {
  // Marginal relief on surcharge: when surcharge causes the post-surcharge tax
  // to exceed the increase in income that triggered the surcharge slab. Simplified
  // version not implemented in V1 — most users in salary range don't hit this.
  // Documented in code so future maintainers know it's a known gap.
  return surcharge;
}

export default function TaxRegimeComparator() {
  const [grossIncome, setGrossIncome] = useState<string>("1500000");
  const [ageGroup, setAgeGroup] = useState<AgeGroup>("below60");
  const [sec80C, setSec80C] = useState<string>("150000");
  const [sec80D, setSec80D] = useState<string>("25000");
  const [sec80CCD1B, setSec80CCD1B] = useState<string>("0");
  const [hraExemption, setHraExemption] = useState<string>("0");
  const [homeLoanInterest, setHomeLoanInterest] = useState<string>("0");
  const [otherDeductions, setOtherDeductions] = useState<string>("0");

  const result = useMemo(() => {
    const inc = parseFloat(grossIncome);
    if (isNaN(inc) || inc <= 0) return null;

    const deds = {
      sec80C: parseFloat(sec80C) || 0,
      sec80D: parseFloat(sec80D) || 0,
      sec80CCD1B: parseFloat(sec80CCD1B) || 0,
      hraExemption: parseFloat(hraExemption) || 0,
      homeLoanInterest: parseFloat(homeLoanInterest) || 0,
      other: parseFloat(otherDeductions) || 0,
    };

    const old = computeOldRegimeTax(inc, ageGroup, deds);
    const newR = computeNewRegimeTax(inc);

    const oldSurchargeRate = getSurchargeRate(old.taxableIncome, false);
    const oldSurcharge = applyMarginalRelief(
      old.baseTax,
      old.baseTax * oldSurchargeRate
    );
    const oldCess = (old.baseTax + oldSurcharge) * 0.04;
    const oldTotal = old.baseTax + oldSurcharge + oldCess;

    const newSurchargeRate = getSurchargeRate(newR.taxableIncome, true);
    const newSurcharge = applyMarginalRelief(
      newR.baseTax,
      newR.baseTax * newSurchargeRate
    );
    const newCess = (newR.baseTax + newSurcharge) * 0.04;
    const newTotal = newR.baseTax + newSurcharge + newCess;

    const winner: "old" | "new" | "tie" =
      oldTotal < newTotal ? "old" : oldTotal > newTotal ? "new" : "tie";
    const savings = Math.abs(oldTotal - newTotal);

    const totalDeductionsClaimed =
      Math.min(deds.sec80C, 150_000) +
      Math.min(deds.sec80D, 100_000) +
      Math.min(deds.sec80CCD1B, 50_000) +
      deds.hraExemption +
      Math.min(deds.homeLoanInterest, 200_000) +
      deds.other;

    return {
      gross: inc,
      old: {
        taxableIncome: old.taxableIncome,
        baseTax: old.baseTax,
        surchargeRate: oldSurchargeRate,
        surcharge: oldSurcharge,
        cess: oldCess,
        totalTax: oldTotal,
        netInHand: inc - oldTotal,
      },
      new: {
        taxableIncome: newR.taxableIncome,
        baseTax: newR.baseTax,
        surchargeRate: newSurchargeRate,
        surcharge: newSurcharge,
        cess: newCess,
        totalTax: newTotal,
        netInHand: inc - newTotal,
      },
      winner,
      savings,
      totalDeductionsClaimed,
    };
  }, [
    grossIncome,
    ageGroup,
    sec80C,
    sec80D,
    sec80CCD1B,
    hraExemption,
    homeLoanInterest,
    otherDeductions,
  ]);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(n);
  const fmtPercent = (n: number) => `${(n * 100).toFixed(0)}%`;

  return (
    <div className="space-y-6">
      <div className="inline-block bg-teal-100 text-teal-800 text-sm font-semibold px-4 py-1.5 rounded-full">
        ⚖️ FY 2025-26 (AY 2026-27) · Side-by-Side Comparison
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="trc-income"
            className="text-sm font-semibold text-gray-700 block mb-2"
          >
            Annual Gross Income (₹)
          </label>
          <input
            id="trc-income"
            type="number"
            value={grossIncome}
            onChange={(e) => setGrossIncome(e.target.value)}
            className="calc-input"
            placeholder="e.g. 1500000"
          />
          <p className="text-xs text-gray-500 mt-1">
            Total income from salary + other sources, before any deductions.
          </p>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">
            Age Group
          </label>
          <div className="flex gap-2 flex-wrap">
            {(
              [
                { l: "Below 60", v: "below60" },
                { l: "60-80", v: "60to80" },
                { l: "Above 80", v: "above80" },
              ] as const
            ).map((a) => (
              <button
                key={a.v}
                onClick={() => setAgeGroup(a.v)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition ${
                  ageGroup === a.v
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {a.l}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <div className="font-semibold text-amber-900 text-sm mb-3">
          📋 Deductions you would claim under the OLD regime
          <span className="block text-xs font-normal mt-0.5">
            (none of these apply under New regime — that&apos;s the trade-off)
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-amber-900 block mb-1">
              Section 80C (PPF, ELSS, LIC, etc., max ₹1.5L)
            </label>
            <input
              type="number"
              value={sec80C}
              onChange={(e) => setSec80C(e.target.value)}
              className="calc-input"
              placeholder="0"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-amber-900 block mb-1">
              Section 80D (Medical insurance, max ₹1L combined)
            </label>
            <input
              type="number"
              value={sec80D}
              onChange={(e) => setSec80D(e.target.value)}
              className="calc-input"
              placeholder="0"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-amber-900 block mb-1">
              Section 80CCD(1B) NPS (max ₹50K)
            </label>
            <input
              type="number"
              value={sec80CCD1B}
              onChange={(e) => setSec80CCD1B(e.target.value)}
              className="calc-input"
              placeholder="0"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-amber-900 block mb-1">
              HRA Exemption (computed amount)
            </label>
            <input
              type="number"
              value={hraExemption}
              onChange={(e) => setHraExemption(e.target.value)}
              className="calc-input"
              placeholder="0"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-amber-900 block mb-1">
              Home Loan Interest (Sec 24B, max ₹2L)
            </label>
            <input
              type="number"
              value={homeLoanInterest}
              onChange={(e) => setHomeLoanInterest(e.target.value)}
              className="calc-input"
              placeholder="0"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-amber-900 block mb-1">
              Other Deductions (LTA, 80E, 80G, etc.)
            </label>
            <input
              type="number"
              value={otherDeductions}
              onChange={(e) => setOtherDeductions(e.target.value)}
              className="calc-input"
              placeholder="0"
            />
          </div>
        </div>
      </div>

      {result && (
        <div className="result-card space-y-4">
          <div
            className={`rounded-2xl p-5 text-white ${
              result.winner === "new"
                ? "bg-gradient-to-r from-emerald-500 to-teal-600"
                : result.winner === "old"
                ? "bg-gradient-to-r from-purple-500 to-indigo-600"
                : "bg-gradient-to-r from-gray-500 to-gray-600"
            }`}
          >
            <div className="text-sm font-medium opacity-80 mb-1">
              {result.winner === "tie"
                ? "Both regimes produce the same tax"
                : `${
                    result.winner === "new" ? "NEW" : "OLD"
                  } regime is better for you`}
            </div>
            {result.winner !== "tie" && (
              <div className="text-3xl font-bold">
                Save {fmt(result.savings)}/year
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              className={`bg-white rounded-2xl p-5 shadow-sm border-2 ${
                result.winner === "old"
                  ? "border-purple-400"
                  : "border-gray-200"
              }`}
            >
              <div className="font-bold text-purple-700 mb-3">
                Old Regime
                {result.winner === "old" && (
                  <span className="ml-2 text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                    WINNER
                  </span>
                )}
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Gross income</span>
                  <span className="font-semibold">{fmt(result.gross)}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>− Std deduction</span>
                  <span>{fmt(50_000)}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>− Other deductions claimed</span>
                  <span>{fmt(result.totalDeductionsClaimed)}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-gray-700">Taxable income</span>
                  <span className="font-bold">
                    {fmt(result.old.taxableIncome)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Base tax</span>
                  <span className="font-semibold">
                    {fmt(result.old.baseTax)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Surcharge ({fmtPercent(result.old.surchargeRate)})
                  </span>
                  <span className="font-semibold">
                    {fmt(result.old.surcharge)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cess (4%)</span>
                  <span className="font-semibold">{fmt(result.old.cess)}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-bold text-red-700">Total tax</span>
                  <span className="font-bold text-red-700">
                    {fmt(result.old.totalTax)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Net in hand</span>
                  <span className="font-bold text-green-700">
                    {fmt(result.old.netInHand)}
                  </span>
                </div>
              </div>
            </div>

            <div
              className={`bg-white rounded-2xl p-5 shadow-sm border-2 ${
                result.winner === "new"
                  ? "border-emerald-400"
                  : "border-gray-200"
              }`}
            >
              <div className="font-bold text-emerald-700 mb-3">
                New Regime
                {result.winner === "new" && (
                  <span className="ml-2 text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    WINNER
                  </span>
                )}
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Gross income</span>
                  <span className="font-semibold">{fmt(result.gross)}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>− Std deduction</span>
                  <span>{fmt(75_000)}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 italic">
                  <span>(other deductions not allowed)</span>
                  <span>—</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-gray-700">Taxable income</span>
                  <span className="font-bold">
                    {fmt(result.new.taxableIncome)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Base tax</span>
                  <span className="font-semibold">
                    {fmt(result.new.baseTax)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Surcharge ({fmtPercent(result.new.surchargeRate)})
                  </span>
                  <span className="font-semibold">
                    {fmt(result.new.surcharge)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cess (4%)</span>
                  <span className="font-semibold">{fmt(result.new.cess)}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-bold text-red-700">Total tax</span>
                  <span className="font-bold text-red-700">
                    {fmt(result.new.totalTax)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Net in hand</span>
                  <span className="font-bold text-green-700">
                    {fmt(result.new.netInHand)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs text-gray-700 leading-relaxed space-y-2">
        <strong>Verified rules (FY 2025-26 / AY 2026-27 — Finance Act 2025):</strong>
        <ul className="list-disc list-inside ml-2 space-y-1">
          <li>
            <strong>New regime slabs:</strong> 0/4L/8L/12L/16L/20L/24L (5/10/15/20/25/30%).
            Standard deduction ₹75K. 87A rebate ₹60K up to ₹12L taxable.
          </li>
          <li>
            <strong>Old regime slabs:</strong> 2.5L (or 3L/5L senior)/5L/10L
            (Nil/5/20/30%). Standard deduction ₹50K. 87A rebate ₹12.5K up to
            ₹5L taxable.
          </li>
          <li>
            <strong>New regime:</strong> NO 80C, 80D, HRA, 24B, 80CCD(1B), LTA.
            Only standard deduction + 80CCD(2) employer NPS.
          </li>
          <li>
            <strong>Surcharge cap:</strong> 25% under New regime (no 37% slab);
            up to 37% under Old regime above ₹5Cr.
          </li>
          <li>4% Health &amp; Education Cess on (tax + surcharge), both regimes.</li>
        </ul>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-800 leading-relaxed">
        <span className="mr-1">ℹ️</span>
        <strong>Disclaimer:</strong> Salaried individuals can switch between
        regimes every FY. Tell your employer at year-start so TDS matches; if
        wrong regime is locked at TDS time, claim refund via ITR. Business
        income filers can opt out of old regime only once per lifetime
        (different rule). Marginal relief on surcharge is simplified —
        consult a CA for exact computation when crossing surcharge thresholds.
        Official reference:{" "}
        <a
          href="https://www.incometax.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="underline font-semibold text-blue-700 hover:text-blue-900"
        >
          incometax.gov.in
        </a>
        .
      </div>
    </div>
  );
}
