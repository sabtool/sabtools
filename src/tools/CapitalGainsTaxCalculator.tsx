"use client";
import { useState, useMemo } from "react";

/**
 * Capital Gains Tax Calculator (India) — FY 2025-26 / AY 2026-27
 *
 * VERIFIED DATA SOURCES:
 *
 * The Finance (No. 2) Act, 2024 made significant changes to capital gains tax
 * effective 23 July 2024. This calculator implements the post-Budget-2024 rates.
 *
 * 1. Section 111A — STCG on listed equity shares & equity-oriented MFs:
 *    - Rate: 20% (was 15% pre 23-Jul-2024)
 *    - Holding period: ≤ 12 months = STCG; > 12 months = LTCG
 *
 * 2. Section 112A — LTCG on listed equity shares & equity-oriented MFs:
 *    - Rate: 12.5% (was 10% pre 23-Jul-2024)
 *    - Annual exemption: ₹1,25,000 per FY (raised from ₹1L by Finance Act 2024,
 *      confirmed on incometax.gov.in ITR-1 eligibility page)
 *    - No indexation
 *
 * 3. Section 112 — LTCG on immovable property, gold, unlisted shares, etc.:
 *    - Default rate post 23-Jul-2024: 12.5% WITHOUT indexation
 *    - Grandfathering option for resident individuals/HUFs on immovable property
 *      acquired BEFORE 23-Jul-2024: 20% WITH indexation (lower of the two)
 *    - Holding period: > 24 months for property, gold, unlisted shares
 *      (was 36 months earlier; aligned to 24 by Finance Act 2024)
 *
 * 4. Debt mutual funds purchased ON OR AFTER 1-Apr-2023:
 *    - ALWAYS taxed at applicable slab rate regardless of holding period
 *    - No LTCG benefit (Finance Act 2023 change)
 *
 * 5. Surcharge slabs (FY 2025-26):
 *    - Capped at 15% for Section 111A & 112A income (no 25%/37% slab)
 *    - Capped at 25% for Section 112 income (no 37% slab)
 *
 * 6. Health & Education Cess: 4% on (tax + surcharge) per Sec 2(11) Finance Act 2025.
 *
 * Sources cross-verified:
 *   - cleartax.in capital gains guide
 *   - incometax.gov.in ITR-1 eligibility page (₹1.25L exemption confirmed)
 *   - bankbazaar.com STCG guide (older 15% rate, used to confirm pre-Budget 2024)
 *   - Finance Act 2024 amendments to Sections 111A, 112, 112A
 */

type AssetType =
  | "equity_listed" // Section 111A / 112A
  | "property" // Section 112 (with optional grandfathering)
  | "gold_unlisted" // Section 112 — gold, jewellery, unlisted shares
  | "debt_mf_post_apr_2023" // Always slab rate
  | "debt_mf_pre_apr_2023"; // Section 112

function holdingMonths(buy: string, sell: string): number {
  if (!buy || !sell) return 0;
  const bd = new Date(buy);
  const sd = new Date(sell);
  if (isNaN(bd.getTime()) || isNaN(sd.getTime())) return 0;
  const months =
    (sd.getFullYear() - bd.getFullYear()) * 12 +
    (sd.getMonth() - bd.getMonth()) -
    (sd.getDate() < bd.getDate() ? 1 : 0);
  return Math.max(0, months);
}

function isLongTerm(asset: AssetType, months: number): boolean {
  if (asset === "equity_listed") return months > 12;
  if (asset === "debt_mf_post_apr_2023") return false; // never long-term
  // property, gold, unlisted, pre-Apr-2023 debt MF
  return months > 24;
}

function isPropertyPreBudget(asset: AssetType, buyDate: string): boolean {
  if (asset !== "property") return false;
  if (!buyDate) return false;
  const cutoff = new Date("2024-07-23");
  const bd = new Date(buyDate);
  return !isNaN(bd.getTime()) && bd < cutoff;
}

function getEquitySurchargeRate(totalIncome: number): number {
  // Section 111A & 112A income capped at 15% surcharge
  if (totalIncome <= 5_000_000) return 0;
  if (totalIncome <= 10_000_000) return 0.10;
  return 0.15; // capped
}

function getOtherAssetSurchargeRate(totalIncome: number): number {
  // Section 112 capped at 25%
  if (totalIncome <= 5_000_000) return 0;
  if (totalIncome <= 10_000_000) return 0.10;
  if (totalIncome <= 20_000_000) return 0.15;
  return 0.25;
}

function getSlabTax(income: number): number {
  // FY 2025-26 New Regime slabs (post Budget 2025), no standard deduction here
  // since this function is used for MARGINAL slab tax on debt-MF gains.
  // We compute the tax that the gain ADDS on top of other income.
  // For accuracy, caller should subtract the slab tax on otherIncome alone
  // from slab tax on (otherIncome + gain) to get the marginal tax on the gain.
  const slabs = [
    { upto: 400_000, rate: 0 },
    { upto: 800_000, rate: 0.05 },
    { upto: 1_200_000, rate: 0.10 },
    { upto: 1_600_000, rate: 0.15 },
    { upto: 2_000_000, rate: 0.20 },
    { upto: 2_400_000, rate: 0.25 },
    { upto: Infinity, rate: 0.30 },
  ];
  let tax = 0;
  let prev = 0;
  for (const s of slabs) {
    if (income <= prev) break;
    const taxable = Math.min(income, s.upto) - prev;
    tax += taxable * s.rate;
    prev = s.upto;
    if (income <= s.upto) break;
  }
  return tax;
}

export default function CapitalGainsTaxCalculator() {
  const [assetType, setAssetType] = useState<AssetType>("equity_listed");
  const [purchasePrice, setPurchasePrice] = useState<string>("100000");
  const [salePrice, setSalePrice] = useState<string>("200000");
  const [purchaseDate, setPurchaseDate] = useState<string>("2023-01-01");
  const [saleDate, setSaleDate] = useState<string>("2025-06-01");
  const [otherIncome, setOtherIncome] = useState<string>("1000000");
  const [usedExemption, setUsedExemption] = useState<string>("0"); // ₹ already claimed under 112A this FY
  const [indexedCost, setIndexedCost] = useState<string>(""); // for property pre-budget grandfathering

  const result = useMemo(() => {
    const buy = parseFloat(purchasePrice);
    const sell = parseFloat(salePrice);
    const other = parseFloat(otherIncome) || 0;
    const exUsed = parseFloat(usedExemption) || 0;
    const indexed = parseFloat(indexedCost) || 0;

    if (isNaN(buy) || isNaN(sell) || buy < 0 || sell < 0) return null;

    const months = holdingMonths(purchaseDate, saleDate);
    const lt = isLongTerm(assetType, months);
    const grossGain = sell - buy;
    const isLoss = grossGain < 0;

    // Detect grandfathering eligibility for property
    const propertyGrandfatheringAvailable =
      assetType === "property" && lt && isPropertyPreBudget(assetType, purchaseDate);

    // Compute tax based on asset type + holding period
    let baseRateLabel = "";
    let baseTax = 0;
    let exemptionApplied = 0;
    let surchargeRate = 0;
    let surchargeBaseDescription = "";
    let isSlabTaxed = false;
    let indexationOptionUsed: "none" | "without_indexation" | "with_indexation" =
      "none";

    if (isLoss) {
      // No tax on a loss; capital losses can usually be set off / carried fwd
      baseRateLabel = "No tax (loss)";
    } else if (assetType === "debt_mf_post_apr_2023") {
      // Slab rate on full gain — ALWAYS, regardless of holding period
      isSlabTaxed = true;
      baseRateLabel = "Slab rate (Finance Act 2023)";
      const taxOnTotal = getSlabTax(other + grossGain);
      const taxOnOther = getSlabTax(other);
      baseTax = taxOnTotal - taxOnOther;
      surchargeRate = getOtherAssetSurchargeRate(other + grossGain);
      surchargeBaseDescription = "Standard surcharge slabs";
    } else if (assetType === "equity_listed" && lt) {
      // Section 112A: 12.5% on (gain - ₹1.25L exemption available, less already used)
      const annualExemptionLimit = 125_000;
      const exemptionAvailable = Math.max(0, annualExemptionLimit - exUsed);
      exemptionApplied = Math.min(grossGain, exemptionAvailable);
      const taxableGain = Math.max(0, grossGain - exemptionApplied);
      baseTax = taxableGain * 0.125;
      baseRateLabel = "12.5% LTCG (Section 112A, post-Budget 2024)";
      surchargeRate = getEquitySurchargeRate(other + grossGain);
      surchargeBaseDescription = "Section 111A/112A surcharge cap: 15%";
    } else if (assetType === "equity_listed" && !lt) {
      // Section 111A STCG: 20%
      baseTax = grossGain * 0.20;
      baseRateLabel = "20% STCG (Section 111A, post-Budget 2024)";
      surchargeRate = getEquitySurchargeRate(other + grossGain);
      surchargeBaseDescription = "Section 111A/112A surcharge cap: 15%";
    } else if (lt) {
      // Section 112 LTCG on property / gold / unlisted / pre-Apr-2023 debt MF
      // Default: 12.5% without indexation
      const taxWithoutIndexation = grossGain * 0.125;

      // Grandfathered option for resident individuals/HUFs holding property
      // acquired before 23-Jul-2024: choose lower of 12.5% w/o indexation
      // or 20% with indexation
      if (propertyGrandfatheringAvailable && indexed > 0) {
        const indexedGain = Math.max(0, sell - indexed);
        const taxWithIndexation = indexedGain * 0.20;
        if (taxWithIndexation < taxWithoutIndexation) {
          baseTax = taxWithIndexation;
          baseRateLabel =
            "20% LTCG with indexation (Section 112 — grandfathered choice)";
          indexationOptionUsed = "with_indexation";
        } else {
          baseTax = taxWithoutIndexation;
          baseRateLabel = "12.5% LTCG without indexation (Section 112)";
          indexationOptionUsed = "without_indexation";
        }
      } else {
        baseTax = taxWithoutIndexation;
        baseRateLabel = "12.5% LTCG without indexation (Section 112)";
        indexationOptionUsed = "without_indexation";
      }
      surchargeRate = getOtherAssetSurchargeRate(other + grossGain);
      surchargeBaseDescription = "Section 112 surcharge cap: 25%";
    } else {
      // STCG on property / gold / unlisted / debt MF (pre-Apr-2023): slab rate
      isSlabTaxed = true;
      baseRateLabel = "Slab rate (STCG on non-equity assets)";
      const taxOnTotal = getSlabTax(other + grossGain);
      const taxOnOther = getSlabTax(other);
      baseTax = Math.max(0, taxOnTotal - taxOnOther);
      surchargeRate = getOtherAssetSurchargeRate(other + grossGain);
      surchargeBaseDescription = "Standard surcharge slabs";
    }

    const surcharge = baseTax * surchargeRate;
    const cess = (baseTax + surcharge) * 0.04;
    const totalTax = baseTax + surcharge + cess;
    const netInHand = sell - totalTax;
    const effectiveOnGain = grossGain > 0 ? (totalTax / grossGain) * 100 : 0;

    return {
      months,
      isLongTerm: lt,
      grossGain,
      isLoss,
      exemptionApplied,
      baseRateLabel,
      baseTax,
      isSlabTaxed,
      surchargeRate,
      surchargeBaseDescription,
      surcharge,
      cess,
      totalTax,
      netInHand,
      effectiveOnGain,
      propertyGrandfatheringAvailable,
      indexationOptionUsed,
    };
  }, [
    assetType,
    purchasePrice,
    salePrice,
    purchaseDate,
    saleDate,
    otherIncome,
    usedExemption,
    indexedCost,
  ]);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(n);
  const fmtPercent = (n: number) => `${n.toFixed(2)}%`;

  const assetLabels: Record<AssetType, string> = {
    equity_listed: "Listed Equity / Equity MF (Sec 111A / 112A)",
    property: "Immovable Property (Sec 112)",
    gold_unlisted: "Gold / Jewellery / Unlisted Shares (Sec 112)",
    debt_mf_post_apr_2023: "Debt MF — bought on/after 1 Apr 2023 (slab rate)",
    debt_mf_pre_apr_2023: "Debt MF — bought before 1 Apr 2023 (Sec 112)",
  };

  return (
    <div className="space-y-6">
      <div className="inline-block bg-emerald-100 text-emerald-800 text-sm font-semibold px-4 py-1.5 rounded-full">
        📊 FY 2025-26 · Post-Budget 2024 Rates · Section 111A / 112 / 112A
      </div>

      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">
          Asset Type
        </label>
        <div className="grid grid-cols-1 gap-2">
          {(Object.keys(assetLabels) as AssetType[]).map((a) => (
            <button
              key={a}
              onClick={() => setAssetType(a)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium text-left transition ${
                assetType === a
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {assetLabels[a]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="cg-buy-price"
            className="text-sm font-semibold text-gray-700 block mb-2"
          >
            Purchase Price (₹)
          </label>
          <input
            id="cg-buy-price"
            type="number"
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(e.target.value)}
            className="calc-input"
          />
        </div>
        <div>
          <label
            htmlFor="cg-sell-price"
            className="text-sm font-semibold text-gray-700 block mb-2"
          >
            Sale Price (₹)
          </label>
          <input
            id="cg-sell-price"
            type="number"
            value={salePrice}
            onChange={(e) => setSalePrice(e.target.value)}
            className="calc-input"
          />
        </div>
        <div>
          <label
            htmlFor="cg-buy-date"
            className="text-sm font-semibold text-gray-700 block mb-2"
          >
            Purchase Date
          </label>
          <input
            id="cg-buy-date"
            type="date"
            value={purchaseDate}
            onChange={(e) => setPurchaseDate(e.target.value)}
            className="calc-input"
          />
        </div>
        <div>
          <label
            htmlFor="cg-sell-date"
            className="text-sm font-semibold text-gray-700 block mb-2"
          >
            Sale Date
          </label>
          <input
            id="cg-sell-date"
            type="date"
            value={saleDate}
            onChange={(e) => setSaleDate(e.target.value)}
            className="calc-input"
          />
        </div>
        <div>
          <label
            htmlFor="cg-other-income"
            className="text-sm font-semibold text-gray-700 block mb-2"
          >
            Your Other Annual Income (₹)
          </label>
          <input
            id="cg-other-income"
            type="number"
            value={otherIncome}
            onChange={(e) => setOtherIncome(e.target.value)}
            className="calc-input"
          />
          <p className="text-xs text-gray-500 mt-1">
            Used for surcharge slab determination &amp; for slab-rate STCG.
          </p>
        </div>
        {assetType === "equity_listed" && (
          <div>
            <label
              htmlFor="cg-exemption-used"
              className="text-sm font-semibold text-gray-700 block mb-2"
            >
              ₹1.25L LTCG Exemption Already Used This FY (₹)
            </label>
            <input
              id="cg-exemption-used"
              type="number"
              value={usedExemption}
              onChange={(e) => setUsedExemption(e.target.value)}
              className="calc-input"
            />
            <p className="text-xs text-gray-500 mt-1">
              The ₹1,25,000 Sec 112A exemption is per FY across all listed
              equity LTCG. Enter what you&apos;ve already claimed.
            </p>
          </div>
        )}
      </div>

      {result?.propertyGrandfatheringAvailable && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="font-semibold text-amber-900 text-sm mb-2">
            🏛️ Property bought before 23 July 2024 — Grandfathering Available
          </div>
          <p className="text-sm text-amber-800 mb-3">
            For immovable property acquired before Budget 2024 (23 July 2024),
            resident individuals/HUFs can choose the LOWER of: <br />
            (a) 12.5% on gain WITHOUT indexation, OR <br />
            (b) 20% on gain WITH indexation.
          </p>
          <label className="text-xs font-semibold text-amber-900 block mb-1">
            Indexed Cost of Acquisition (₹) — leave blank if you don&apos;t
            want to apply indexation
          </label>
          <input
            type="number"
            placeholder="Compute via CII (Cost Inflation Index)"
            value={indexedCost}
            onChange={(e) => setIndexedCost(e.target.value)}
            className="calc-input"
          />
          <p className="text-xs text-amber-700 mt-1">
            Indexed cost = Purchase price × (CII of sale year ÷ CII of
            purchase year). The calculator applies whichever option produces
            lower tax.
          </p>
        </div>
      )}

      {result && (
        <div className="result-card space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">
                Holding Period
              </div>
              <div className="text-lg font-bold text-indigo-600">
                {result.months} months
              </div>
              <div className="text-[10px] text-gray-500">
                {result.isLongTerm ? "Long-term" : "Short-term"}
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">
                {result.isLoss ? "Capital Loss" : "Capital Gain"}
              </div>
              <div
                className={`text-xl font-bold ${
                  result.isLoss ? "text-red-600" : "text-emerald-600"
                }`}
              >
                {fmt(Math.abs(result.grossGain))}
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">
                Total Tax
              </div>
              <div className="text-xl font-bold text-red-700">
                {fmt(result.totalTax)}
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">
                Net In Hand
              </div>
              <div className="text-xl font-bold text-green-600">
                {fmt(result.netInHand)}
              </div>
            </div>
          </div>

          {!result.isLoss && (
            <div className="bg-white rounded-xl p-5 shadow-sm space-y-2 text-sm">
              <div className="font-semibold text-gray-700 mb-2">
                Tax Breakdown ({result.baseRateLabel})
              </div>
              {result.exemptionApplied > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>₹1.25L Sec 112A exemption applied</span>
                  <span className="font-semibold">
                    -{fmt(result.exemptionApplied)}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Base tax</span>
                <span className="font-semibold text-gray-900">
                  {fmt(result.baseTax)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">
                  Surcharge ({fmtPercent(result.surchargeRate * 100)} —{" "}
                  {result.surchargeBaseDescription})
                </span>
                <span className="font-semibold text-gray-900">
                  {fmt(result.surcharge)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">
                  Health &amp; Education Cess (4%)
                </span>
                <span className="font-semibold text-gray-900">
                  {fmt(result.cess)}
                </span>
              </div>
              <div className="border-t pt-2 mt-2 flex justify-between">
                <span className="font-bold text-gray-700">Total tax</span>
                <span className="font-bold text-red-700">
                  {fmt(result.totalTax)}
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                Effective tax rate on gain:{" "}
                <strong>{fmtPercent(result.effectiveOnGain)}</strong>
              </div>
              {result.indexationOptionUsed === "with_indexation" && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900 mt-2">
                  <strong>Indexation grandfathering applied:</strong> 20% with
                  indexation produced lower tax than 12.5% without — you
                  should opt for the indexed treatment when filing.
                </div>
              )}
            </div>
          )}

          {result.isLoss && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-900 leading-relaxed">
              <strong>💡 Capital loss treatment:</strong> Unlike crypto
              losses, regular capital losses CAN be set off against capital
              gains (LTCG losses against LTCG only, STCG losses against any
              capital gain) and carried forward up to 8 assessment years.
              Mention this loss in your ITR to preserve carry-forward.
            </div>
          )}
        </div>
      )}

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs text-gray-700 leading-relaxed space-y-2">
        <div>
          <strong>Verified rules (FY 2025-26 / AY 2026-27):</strong>
        </div>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>
            <strong>STCG on listed equity</strong>: 20% (Section 111A, raised
            from 15% by Budget 2024 effective 23-Jul-2024). Holding period:
            ≤12 months.
          </li>
          <li>
            <strong>LTCG on listed equity</strong>: 12.5% (Section 112A, raised
            from 10% by Budget 2024). Annual exemption: ₹1,25,000/FY (raised
            from ₹1L). Holding period: &gt;12 months.
          </li>
          <li>
            <strong>LTCG on property/gold/unlisted</strong>: 12.5% without
            indexation (Section 112). Property bought before 23-Jul-2024 by
            resident individuals/HUFs has the option of 20% with indexation —
            calculator picks the lower automatically. Holding period: &gt;24
            months.
          </li>
          <li>
            <strong>Debt MFs bought on/after 1-Apr-2023</strong>: always taxed
            at slab rates regardless of holding period (Finance Act 2023).
          </li>
          <li>
            Surcharge capped at <strong>15%</strong> for Sec 111A/112A income;
            at <strong>25%</strong> for Sec 112 income. 4% Health &amp;
            Education Cess applies on (tax + surcharge).
          </li>
        </ul>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-800 leading-relaxed">
        <span className="mr-1">ℹ️</span>
        <strong>Disclaimer:</strong> This calculator handles the most common
        scenarios. NOT covered: Section 54/54F home reinvestment exemption,
        Section 54EC bond exemption, set-off and carry-forward of capital
        losses across years, ESOP/RSU specific rules, foreign assets,
        non-resident taxation. For complex cases consult a Chartered
        Accountant. Official reference:{" "}
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
