"use client";
import { useState, useMemo } from "react";

type CylinderType = "domestic" | "commercial" | "ftl";
type ConsumerType = "general" | "ujjwala";

/*
 * LPG subsidy rules — reviewed June 2026 against PIB / MoPNG.
 *
 * As of FY 2025-26 the ONLY active cylinder subsidy is the PMUY (Ujjwala)
 * "targeted subsidy": Rs 300 per 14.2 kg domestic refill, for up to 9 refills
 * a year, credited to the beneficiary's linked bank account via DBT (PAHAL).
 * The Rs 300 amount is uniform nationwide.
 *
 * General (non-Ujjwala) consumers receive NO subsidy and pay the full market
 * price — the general-consumer DBT subsidy has been effectively Rs 0 since
 * 2020. Commercial (19 kg) and Free-Trade LPG (FTL, 5 kg) are never subsidised.
 *
 * Sources: PIB PRID 2154117 (Cabinet, FY25-26, Rs 12,000 cr, Rs 300 x up to 9
 * refills); Business Standard; DD News; MoPNG. Market PRICE varies by city and
 * is revised on the 1st of each month, so it is user-editable.
 */
const UJJWALA_SUBSIDY_PER_14_2KG = 300;
const UJJWALA_REFILLS_SUBSIDISED_PER_YEAR = 9;

const CYLINDERS: {
  value: CylinderType;
  label: string;
  weight: string;
  defaultPrice: number;
  subsidisable: boolean;
}[] = [
  // defaultPrice ≈ Delhi, Jun 2026 — editable for your city / latest rate.
  { value: "domestic", label: "Domestic (14.2 kg)", weight: "14.2 kg", defaultPrice: 942, subsidisable: true },
  { value: "commercial", label: "Commercial (19 kg)", weight: "19 kg", defaultPrice: 1750, subsidisable: false },
  { value: "ftl", label: "FTL / Small (5 kg)", weight: "5 kg", defaultPrice: 440, subsidisable: false },
];

export default function LpgSubsidyCalculator() {
  const [cylinderType, setCylinderType] = useState<CylinderType>("domestic");
  const [consumerType, setConsumerType] = useState<ConsumerType>("general");
  const [marketPrice, setMarketPrice] = useState(942);
  const [cylindersPerMonth, setCylindersPerMonth] = useState(1);

  const cyl = CYLINDERS.find((c) => c.value === cylinderType)!;

  const result = useMemo(() => {
    // Subsidy applies ONLY to a domestic 14.2 kg refill for an Ujjwala (PMUY)
    // beneficiary. Everyone/everything else = Rs 0 (market price).
    const isSubsidised = cyl.subsidisable && consumerType === "ujjwala";
    const subsidy = isSubsidised ? UJJWALA_SUBSIDY_PER_14_2KG : 0;

    const effectivePrice = marketPrice - subsidy; // per subsidised refill
    const perYear = cylindersPerMonth * 12;

    // The Rs 300 subsidy is capped at 9 refills/year; refills beyond the cap
    // are billed at full market price.
    const subsidisedCount = subsidy > 0 ? Math.min(perYear, UJJWALA_REFILLS_SUBSIDISED_PER_YEAR) : 0;
    const fullPriceCount = perYear - subsidisedCount;
    const yearlySubsidy = subsidy * subsidisedCount;

    const yearly = marketPrice * perYear - yearlySubsidy;
    const monthly = yearly / 12;

    // Induction cooking comparison (avg Rs 3/unit, ~90% thermal efficiency).
    // Roughly 1 x 14.2 kg cylinder of cooking ≈ Rs 480 of electricity.
    const inductionPerCylinder = cylinderType === "domestic" ? 480 : cylinderType === "commercial" ? 640 : 170;
    const inductionYearly = inductionPerCylinder * perYear;
    const inductionMonthly = inductionYearly / 12;
    const savings = yearly - inductionYearly;

    return {
      isSubsidised,
      subsidy,
      effectivePrice,
      perYear,
      subsidisedCount,
      fullPriceCount,
      yearlySubsidy,
      monthly,
      yearly,
      inductionMonthly,
      inductionYearly,
      savings,
    };
  }, [marketPrice, cylindersPerMonth, cyl, cylinderType, consumerType]);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  const handleTypeChange = (val: CylinderType) => {
    setCylinderType(val);
    const c = CYLINDERS.find((c) => c.value === val)!;
    setMarketPrice(c.defaultPrice);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">Cylinder Type</label>
          <select className="calc-input" value={cylinderType} onChange={(e) => handleTypeChange(e.target.value as CylinderType)}>
            {CYLINDERS.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">Consumer Type</label>
          <select
            className="calc-input"
            value={consumerType}
            onChange={(e) => setConsumerType(e.target.value as ConsumerType)}
            disabled={!cyl.subsidisable}
            title={!cyl.subsidisable ? "Subsidy applies to domestic 14.2 kg cylinders only" : undefined}
          >
            <option value="general">General (no subsidy)</option>
            <option value="ujjwala">Ujjwala / PMUY beneficiary</option>
          </select>
          <div className="text-xs text-gray-400 mt-1">
            {cyl.subsidisable ? "Only PMUY beneficiaries are subsidised" : "Not subsidised"}
          </div>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">Market Price (₹)</label>
          <input className="calc-input" type="number" min={0} value={marketPrice} onChange={(e) => setMarketPrice(+e.target.value)} />
          <div className="text-xs text-gray-400 mt-1">Delhi, Jun 2026 — edit for your city</div>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">Cylinders Per Month</label>
          <input className="calc-input" type="number" min={1} max={12} value={cylindersPerMonth} onChange={(e) => setCylindersPerMonth(+e.target.value)} />
        </div>
      </div>

      <div className="result-card">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-xs text-gray-500">Market Price</div>
            <div className="text-xl font-extrabold text-gray-800">{fmt(marketPrice)}</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-xs text-gray-500">Subsidy / Cylinder</div>
            <div className={`text-xl font-extrabold ${result.subsidy > 0 ? "text-green-600" : "text-gray-400"}`}>{fmt(result.subsidy)}</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-xs text-gray-500">Effective Price</div>
            <div className="text-xl font-extrabold text-indigo-600">{fmt(result.effectivePrice)}</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-xs text-gray-500">Weight</div>
            <div className="text-xl font-extrabold text-gray-700">{cyl.weight}</div>
          </div>
        </div>

        {result.isSubsidised && (
          <div className="mt-4 text-sm text-green-800 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
            As a PMUY beneficiary you get <strong>{fmt(UJJWALA_SUBSIDY_PER_14_2KG)}</strong> back per refill on up to{" "}
            <strong>{UJJWALA_REFILLS_SUBSIDISED_PER_YEAR} refills a year</strong>, paid into your linked bank account (DBT).
            {result.perYear > UJJWALA_REFILLS_SUBSIDISED_PER_YEAR && (
              <>
                {" "}At {cylindersPerMonth}/month you{"'"}d use {result.perYear} refills — so {result.subsidisedCount} are
                subsidised and the other {result.fullPriceCount} are at full market price.
              </>
            )}
          </div>
        )}
        {!result.isSubsidised && cyl.subsidisable && (
          <div className="mt-4 text-sm text-gray-600 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
            General (non-Ujjwala) consumers currently receive <strong>no LPG subsidy</strong> — you pay the full market
            price. Only Pradhan Mantri Ujjwala Yojana (PMUY) beneficiaries get the ₹300/cylinder subsidy.
          </div>
        )}
      </div>

      <div className="result-card">
        <div className="text-sm font-semibold text-gray-700 mb-3">Household Cost Estimate</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-xs text-gray-500">Monthly (avg, {cylindersPerMonth} cylinder{cylindersPerMonth > 1 ? "s" : ""})</div>
            <div className="text-2xl font-extrabold text-indigo-600">{fmt(result.monthly)}</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-xs text-gray-500">Yearly ({result.perYear} cylinders)</div>
            <div className="text-2xl font-extrabold text-purple-600">{fmt(result.yearly)}</div>
          </div>
        </div>
        {result.yearlySubsidy > 0 && (
          <div className="text-xs text-gray-500 mt-2">
            Net of {fmt(result.yearlySubsidy)} subsidy/year ({result.subsidisedCount} × {fmt(result.subsidy)}), credited to your bank account.
          </div>
        )}
      </div>

      {/* Comparison */}
      <div className="result-card">
        <div className="text-sm font-semibold text-gray-700 mb-3">LPG vs Induction Cooking Cost</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left p-2 text-gray-600">Parameter</th>
                <th className="text-right p-2 text-orange-600">LPG</th>
                <th className="text-right p-2 text-blue-600">Induction</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="p-2 text-gray-700">Monthly Cost</td>
                <td className="p-2 text-right font-bold text-orange-600">{fmt(result.monthly)}</td>
                <td className="p-2 text-right font-bold text-blue-600">{fmt(result.inductionMonthly)}</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="p-2 text-gray-700">Yearly Cost</td>
                <td className="p-2 text-right font-bold text-orange-600">{fmt(result.yearly)}</td>
                <td className="p-2 text-right font-bold text-blue-600">{fmt(result.inductionYearly)}</td>
              </tr>
              <tr>
                <td className="p-2 text-gray-700 font-semibold">Yearly Savings with Induction</td>
                <td colSpan={2} className="p-2 text-right font-extrabold text-green-600">{fmt(result.savings)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="text-xs text-gray-400 mt-2">* Induction estimate based on avg electricity rate of ₹3/unit and 90% thermal efficiency</div>
      </div>

      {/* Accuracy / source note */}
      <div className="text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 space-y-1">
        <p>
          <strong>How LPG subsidy works (FY 2025-26):</strong> The only active cylinder subsidy is the PMUY (Ujjwala)
          targeted subsidy — ₹300 per 14.2 kg domestic refill for up to 9 refills a year, paid into the beneficiary{"'"}s
          bank account via DBT (PAHAL). You pay the market price at delivery and the subsidy is credited afterwards.
          General (non-Ujjwala) consumers and all commercial/FTL cylinders are not subsidised.
        </p>
        <p>
          Market prices are revised on the 1st of each month and vary by city and oil company (IOCL/BPCL/HPCL) — edit the
          price field for your exact rate. Subsidy figures reviewed June 2026; this tool is not affiliated with any oil
          company — confirm details in your gas provider{"'"}s app or at mylpg.in.
        </p>
      </div>
    </div>
  );
}
