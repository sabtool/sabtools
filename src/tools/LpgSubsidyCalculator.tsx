"use client";
import { useState, useMemo } from "react";

type CylinderType = "domestic" | "commercial" | "ftl";

const CYLINDERS: { value: CylinderType; label: string; weight: string; defaultPrice: number; subsidy: number }[] = [
  { value: "domestic", label: "Domestic (14.2 kg)", weight: "14.2 kg", defaultPrice: 903, subsidy: 200 },
  { value: "commercial", label: "Commercial (19 kg)", weight: "19 kg", defaultPrice: 1865, subsidy: 0 },
  { value: "ftl", label: "FTL / Small (5 kg)", weight: "5 kg", defaultPrice: 435, subsidy: 0 },
];

export default function LpgSubsidyCalculator() {
  const [cylinderType, setCylinderType] = useState<CylinderType>("domestic");
  const [marketPrice, setMarketPrice] = useState(903);
  const [cylindersPerMonth, setCylindersPerMonth] = useState(1);

  const cyl = CYLINDERS.find((c) => c.value === cylinderType)!;

  const result = useMemo(() => {
    const subsidy = cyl.subsidy;
    const effectivePrice = marketPrice - subsidy;
    const monthly = effectivePrice * cylindersPerMonth;
    const yearly = monthly * 12;

    // Induction cooking comparison (avg Rs 3/unit, 1 kWh ~= 0.05 kg LPG)
    // ~14.2 kg = ~284 kWh equivalent but induction is ~90% efficient vs LPG ~55%
    // Roughly 1 cylinder = 160 kWh on induction at Rs 3/unit = Rs 480
    const inductionEquivalentPerCylinder = cylinderType === "domestic" ? 480 : cylinderType === "commercial" ? 640 : 170;
    const inductionMonthly = inductionEquivalentPerCylinder * cylindersPerMonth;
    const inductionYearly = inductionMonthly * 12;
    const savings = yearly - inductionYearly;

    return { subsidy, effectivePrice, monthly, yearly, inductionMonthly, inductionYearly, savings };
  }, [marketPrice, cylindersPerMonth, cyl, cylinderType]);

  const fmt = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  const handleTypeChange = (val: CylinderType) => {
    setCylinderType(val);
    const c = CYLINDERS.find((c) => c.value === val)!;
    setMarketPrice(c.defaultPrice);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">Cylinder Type</label>
          <select className="calc-input" value={cylinderType} onChange={(e) => handleTypeChange(e.target.value as CylinderType)}>
            {CYLINDERS.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">Market Price (Rs)</label>
          <input className="calc-input" type="number" min={0} value={marketPrice} onChange={(e) => setMarketPrice(+e.target.value)} />
          <div className="text-xs text-gray-400 mt-1">Edit to use latest price</div>
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
            <div className="text-xs text-gray-500">Subsidy</div>
            <div className="text-xl font-extrabold text-green-600">{fmt(result.subsidy)}</div>
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
      </div>

      <div className="result-card">
        <div className="text-sm font-semibold text-gray-700 mb-3">Household Cost Estimate</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-xs text-gray-500">Monthly ({cylindersPerMonth} cylinder{cylindersPerMonth > 1 ? "s" : ""})</div>
            <div className="text-2xl font-extrabold text-indigo-600">{fmt(result.monthly)}</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-xs text-gray-500">Yearly ({cylindersPerMonth * 12} cylinders)</div>
            <div className="text-2xl font-extrabold text-purple-600">{fmt(result.yearly)}</div>
          </div>
        </div>
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
        <div className="text-xs text-gray-400 mt-2">* Induction estimate based on avg electricity rate of Rs 3/unit and 90% thermal efficiency</div>
      </div>
    </div>
  );
}
