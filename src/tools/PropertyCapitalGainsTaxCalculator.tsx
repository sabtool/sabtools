"use client";
import { useState, useMemo } from "react";

const CII: Record<string, number> = {
  "2001-02": 100, "2002-03": 105, "2003-04": 109, "2004-05": 113, "2005-06": 117,
  "2006-07": 122, "2007-08": 129, "2008-09": 137, "2009-10": 148, "2010-11": 167,
  "2011-12": 184, "2012-13": 200, "2013-14": 220, "2014-15": 240, "2015-16": 254,
  "2016-17": 264, "2017-18": 272, "2018-19": 280, "2019-20": 289, "2020-21": 301,
  "2021-22": 317, "2022-23": 331, "2023-24": 348, "2024-25": 363, "2025-26": 377,
};

function getFinancialYear(date: Date): string {
  const month = date.getMonth(); // 0-indexed
  const year = date.getFullYear();
  if (month >= 3) {
    return `${year}-${String(year + 1).slice(2)}`;
  }
  return `${year - 1}-${String(year).slice(2)}`;
}

function monthsBetween(d1: Date, d2: Date): number {
  return (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth());
}

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

const PROPERTY_TYPES = [
  { value: "residential", label: "Residential Property" },
  { value: "commercial", label: "Commercial Property" },
  { value: "land", label: "Land / Plot" },
];

export default function PropertyCapitalGainsTaxCalculator() {
  const [propertyType, setPropertyType] = useState("residential");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [saleDate, setSaleDate] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [improvementCost, setImprovementCost] = useState("");
  const [registrationCost, setRegistrationCost] = useState("");
  const [brokerage, setBrokerage] = useState("");

  const result = useMemo(() => {
    const purchase = purchaseDate ? new Date(purchaseDate) : null;
    const sale = saleDate ? new Date(saleDate) : null;
    const pp = parseFloat(purchasePrice) || 0;
    const sp = parseFloat(salePrice) || 0;
    const imp = parseFloat(improvementCost) || 0;
    const reg = parseFloat(registrationCost) || 0;
    const brk = parseFloat(brokerage) || 0;

    if (!purchase || !sale || pp <= 0 || sp <= 0 || sale <= purchase) return null;

    const totalMonths = monthsBetween(purchase, sale);
    const holdingYears = Math.floor(totalMonths / 12);
    const holdingMonths = totalMonths % 12;

    // Long-term threshold is 24 months for property (both before and after July 23, 2024)
    const isLongTerm = totalMonths >= 24;

    const budgetCutoff = new Date("2024-07-23");
    const purchasedBeforeBudget = purchase < budgetCutoff;

    const purchaseFY = getFinancialYear(purchase);
    const saleFY = getFinancialYear(sale);
    const purchaseCII = CII[purchaseFY] || null;
    const saleCII = CII[saleFY] || null;

    if (!isLongTerm) {
      // Short-Term Capital Gains
      const stcg = sp - (pp + imp + reg + brk);
      const cess = stcg > 0 ? stcg * 0.04 : 0; // cess on estimated tax (slab rate, shown as note)
      return {
        type: "STCG" as const,
        holdingYears,
        holdingMonths,
        totalMonths,
        gain: stcg,
        purchaseFY,
        saleFY,
        breakdown: { purchasePrice: pp, salePrice: sp, improvementCost: imp, registrationCost: reg, brokerage: brk },
      };
    }

    // Long-Term Capital Gains — compute both options

    // Option B: New Regime (12.5% without indexation) — always available
    const ltcgNew = sp - pp - imp - reg - brk;
    const taxNew = ltcgNew > 0 ? ltcgNew * 0.125 : 0;
    const cessNew = taxNew * 0.04;
    const totalTaxNew = taxNew + cessNew;

    // Option A: Old Regime (20% with indexation) — only if purchased before July 23, 2024 & CII available
    let optionA = null;
    if (purchasedBeforeBudget && purchaseCII && saleCII) {
      const indexedPurchase = pp * (saleCII / purchaseCII);
      const indexedImprovement = imp * (saleCII / purchaseCII);
      const ltcgOld = sp - indexedPurchase - indexedImprovement - brk;
      const taxOld = ltcgOld > 0 ? ltcgOld * 0.20 : 0;
      const cessOld = taxOld * 0.04;
      const totalTaxOld = taxOld + cessOld;

      optionA = {
        indexedPurchase,
        indexedImprovement,
        ltcg: ltcgOld,
        taxRate: 20,
        tax: taxOld,
        cess: cessOld,
        totalTax: totalTaxOld,
        purchaseCII,
        saleCII,
      };
    }

    const optionB = {
      ltcg: ltcgNew,
      taxRate: 12.5,
      tax: taxNew,
      cess: cessNew,
      totalTax: totalTaxNew,
    };

    const betterOption =
      optionA && optionA.totalTax < optionB.totalTax ? "A" : "B";

    return {
      type: "LTCG" as const,
      holdingYears,
      holdingMonths,
      totalMonths,
      purchaseFY,
      saleFY,
      purchasedBeforeBudget,
      optionA,
      optionB,
      betterOption,
      breakdown: { purchasePrice: pp, salePrice: sp, improvementCost: imp, registrationCost: reg, brokerage: brk },
    };
  }, [purchaseDate, saleDate, purchasePrice, salePrice, improvementCost, registrationCost, brokerage]);

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        <strong>Property Capital Gains Tax (India):</strong> Calculate Short-Term or Long-Term Capital Gains on sale of property. Compare Old Regime (20% with indexation) vs New Regime (12.5% without indexation) as per Budget 2024.
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Property Type */}
        <div>
          <label htmlFor="pcg-property-type" className="text-sm font-semibold text-gray-700 block mb-2">Property Type</label>
          <select
            id="pcg-property-type"
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            className="calc-input"
          >
            {PROPERTY_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        {/* Purchase Date */}
        <div>
          <label htmlFor="pcg-purchase-date" className="text-sm font-semibold text-gray-700 block mb-2">Purchase Date</label>
          <input
            type="date"
            id="pcg-purchase-date"
            value={purchaseDate}
            onChange={(e) => setPurchaseDate(e.target.value)}
            className="calc-input"
          />
        </div>

        {/* Sale Date */}
        <div>
          <label htmlFor="pcg-sale-date" className="text-sm font-semibold text-gray-700 block mb-2">Sale Date</label>
          <input
            type="date"
            id="pcg-sale-date"
            value={saleDate}
            onChange={(e) => setSaleDate(e.target.value)}
            className="calc-input"
          />
        </div>

        {/* Purchase Price */}
        <div>
          <label htmlFor="pcg-purchase-price" className="text-sm font-semibold text-gray-700 block mb-2">Purchase Price (₹)</label>
          <input
            type="number"
            id="pcg-purchase-price"
            placeholder="e.g. 5000000"
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(e.target.value)}
            className="calc-input"
          />
        </div>

        {/* Sale Price */}
        <div>
          <label htmlFor="pcg-sale-price" className="text-sm font-semibold text-gray-700 block mb-2">Sale Price (₹)</label>
          <input
            type="number"
            id="pcg-sale-price"
            placeholder="e.g. 8000000"
            value={salePrice}
            onChange={(e) => setSalePrice(e.target.value)}
            className="calc-input"
          />
        </div>

        {/* Improvement Cost */}
        <div>
          <label htmlFor="pcg-improvement" className="text-sm font-semibold text-gray-700 block mb-2">Improvement Cost (₹) <span className="text-gray-400 font-normal">Optional</span></label>
          <input
            type="number"
            id="pcg-improvement"
            placeholder="e.g. 200000"
            value={improvementCost}
            onChange={(e) => setImprovementCost(e.target.value)}
            className="calc-input"
          />
        </div>

        {/* Registration & Stamp Duty */}
        <div>
          <label htmlFor="pcg-registration" className="text-sm font-semibold text-gray-700 block mb-2">Registration & Stamp Duty on Purchase (₹) <span className="text-gray-400 font-normal">Optional</span></label>
          <input
            type="number"
            id="pcg-registration"
            placeholder="e.g. 300000"
            value={registrationCost}
            onChange={(e) => setRegistrationCost(e.target.value)}
            className="calc-input"
          />
        </div>

        {/* Brokerage */}
        <div>
          <label htmlFor="pcg-brokerage" className="text-sm font-semibold text-gray-700 block mb-2">Brokerage on Sale (₹) <span className="text-gray-400 font-normal">Optional</span></label>
          <input
            type="number"
            id="pcg-brokerage"
            placeholder="e.g. 100000"
            value={brokerage}
            onChange={(e) => setBrokerage(e.target.value)}
            className="calc-input"
          />
        </div>
      </div>

      {/* Results */}
      {result && result.type === "STCG" && (
        <div className="space-y-4">
          {/* STCG Badge */}
          <div className="result-card text-center">
            <span className="inline-block bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full mb-3">SHORT-TERM CAPITAL GAIN</span>
            <div className="text-sm text-gray-500 mb-1">Holding Period: {result.holdingYears} year{result.holdingYears !== 1 ? "s" : ""} {result.holdingMonths} month{result.holdingMonths !== 1 ? "s" : ""}</div>
            <div className={`text-4xl font-extrabold mt-2 ${result.gain >= 0 ? "text-red-600" : "text-green-600"}`}>
              {result.gain >= 0 ? fmt(result.gain) : `- ${fmt(Math.abs(result.gain))} (Loss)`}
            </div>
            <div className="text-sm text-gray-500 mt-3">Taxed at your applicable income tax slab rate</div>
          </div>

          {/* Breakdown */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm space-y-2">
            <div className="font-semibold text-gray-700 mb-2">Calculation Breakdown</div>
            <div className="flex justify-between"><span className="text-gray-500">Sale Price</span><span className="font-medium">{fmt(result.breakdown.salePrice)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">(-) Purchase Price</span><span className="font-medium">{fmt(result.breakdown.purchasePrice)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">(-) Improvement Cost</span><span className="font-medium">{fmt(result.breakdown.improvementCost)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">(-) Registration & Stamp Duty</span><span className="font-medium">{fmt(result.breakdown.registrationCost)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">(-) Brokerage</span><span className="font-medium">{fmt(result.breakdown.brokerage)}</span></div>
            <hr className="border-gray-300" />
            <div className="flex justify-between font-bold text-gray-800"><span>Short-Term Capital Gain</span><span>{fmt(result.gain)}</span></div>
          </div>
        </div>
      )}

      {result && result.type === "LTCG" && (
        <div className="space-y-4">
          {/* LTCG Badge */}
          <div className="result-card text-center">
            <span className="inline-block bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full mb-3">LONG-TERM CAPITAL GAIN</span>
            <div className="text-sm text-gray-500">Holding Period: {result.holdingYears} year{result.holdingYears !== 1 ? "s" : ""} {result.holdingMonths} month{result.holdingMonths !== 1 ? "s" : ""}</div>
          </div>

          {/* Side-by-side comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Option A: Old Regime */}
            {result.optionA ? (
              <div className={`rounded-xl border-2 p-4 text-sm space-y-2 ${result.betterOption === "A" ? "border-green-500 bg-green-50" : "border-gray-200 bg-white"}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-gray-800">Option A: Old Regime</span>
                  {result.betterOption === "A" && <span className="text-xs font-bold bg-green-600 text-white px-2 py-0.5 rounded-full">SAVES MORE TAX</span>}
                </div>
                <div className="text-xs text-gray-500 mb-2">20% tax with CII indexation</div>
                <div className="flex justify-between"><span className="text-gray-500">Purchase CII ({result.purchaseFY})</span><span className="font-medium">{result.optionA.purchaseCII}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Sale CII ({result.saleFY})</span><span className="font-medium">{result.optionA.saleCII}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Indexed Purchase Cost</span><span className="font-medium">{fmt(result.optionA.indexedPurchase)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Indexed Improvement</span><span className="font-medium">{fmt(result.optionA.indexedImprovement)}</span></div>
                <hr className="border-gray-300" />
                <div className="flex justify-between"><span className="text-gray-500">Long-Term Capital Gain</span><span className="font-bold">{fmt(result.optionA.ltcg)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Tax @ 20%</span><span className="font-medium">{fmt(result.optionA.tax)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Cess @ 4%</span><span className="font-medium">{fmt(result.optionA.cess)}</span></div>
                <hr className="border-gray-300" />
                <div className="flex justify-between font-bold text-gray-800"><span>Total Tax Payable</span><span>{fmt(result.optionA.totalTax)}</span></div>
              </div>
            ) : (
              <div className="rounded-xl border-2 border-gray-200 bg-gray-50 p-4 text-sm flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <div className="font-bold text-gray-500 mb-1">Option A: Old Regime</div>
                  <div className="text-xs">Not available for properties purchased on or after July 23, 2024</div>
                </div>
              </div>
            )}

            {/* Option B: New Regime */}
            <div className={`rounded-xl border-2 p-4 text-sm space-y-2 ${result.betterOption === "B" ? "border-green-500 bg-green-50" : "border-gray-200 bg-white"}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-gray-800">Option B: New Regime</span>
                {result.betterOption === "B" && <span className="text-xs font-bold bg-green-600 text-white px-2 py-0.5 rounded-full">SAVES MORE TAX</span>}
              </div>
              <div className="text-xs text-gray-500 mb-2">12.5% tax without indexation (Budget 2024)</div>
              <div className="flex justify-between"><span className="text-gray-500">Sale Price</span><span className="font-medium">{fmt(result.breakdown.salePrice)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">(-) Purchase Price</span><span className="font-medium">{fmt(result.breakdown.purchasePrice)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">(-) Improvement Cost</span><span className="font-medium">{fmt(result.breakdown.improvementCost)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">(-) Registration & Stamp Duty</span><span className="font-medium">{fmt(result.breakdown.registrationCost)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">(-) Brokerage</span><span className="font-medium">{fmt(result.breakdown.brokerage)}</span></div>
              <hr className="border-gray-300" />
              <div className="flex justify-between"><span className="text-gray-500">Long-Term Capital Gain</span><span className="font-bold">{fmt(result.optionB.ltcg)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Tax @ 12.5%</span><span className="font-medium">{fmt(result.optionB.tax)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Cess @ 4%</span><span className="font-medium">{fmt(result.optionB.cess)}</span></div>
              <hr className="border-gray-300" />
              <div className="flex justify-between font-bold text-gray-800"><span>Total Tax Payable</span><span>{fmt(result.optionB.totalTax)}</span></div>
            </div>
          </div>

          {/* Tax Saving Note */}
          {result.optionA && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
              <strong>Tax Saving:</strong> {result.betterOption === "A"
                ? `Option A (Old Regime) saves you ${fmt(result.optionB.totalTax - result.optionA.totalTax)} compared to Option B.`
                : `Option B (New Regime) saves you ${fmt(result.optionA.totalTax - result.optionB.totalTax)} compared to Option A.`
              }
            </div>
          )}
        </div>
      )}

      {/* Section 54 Exemption Note */}
      {result && result.type === "LTCG" && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-800">
          <strong>Section 54 Exemption:</strong> You can save tax by reinvesting the capital gains in another residential property within 2 years of sale (or 3 years for under-construction property). You can also invest in Capital Gain Bonds under Section 54EC (up to ₹50 lakh).
        </div>
      )}

      {/* Disclaimer */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs text-gray-500">
        <strong>Disclaimer:</strong> For educational purposes only. Tax laws are subject to change. Consult a Chartered Accountant (CA) for actual tax filing and personalized advice. Surcharge is not included in this calculation.
      </div>
    </div>
  );
}
