"use client";
import { useState, useMemo } from "react";

export default function GasCylinderCalculator() {
  const [cookingHours, setCookingHours] = useState(2);
  const [burnerType, setBurnerType] = useState<"single" | "double">("single");
  const [flameIntensity, setFlameIntensity] = useState<"low" | "medium" | "high">("medium");
  const [cylinderPrice, setCylinderPrice] = useState(900);
  const [electricityRate, setElectricityRate] = useState(8);

  const result = useMemo(() => {
    // Gas consumption in grams per hour by burner and flame
    const consumptionTable: Record<string, Record<string, number>> = {
      single: { low: 80, medium: 120, high: 180 },
      double: { low: 130, medium: 200, high: 300 },
    };

    const gramsPerHour = consumptionTable[burnerType][flameIntensity];
    const dailyGrams = gramsPerHour * cookingHours;
    const cylinderWeight = 14200; // 14.2 kg in grams
    const daysPerCylinder = cylinderWeight / dailyGrams;
    const cylindersPerMonth = 30 / daysPerCylinder;
    const monthlyCostLpg = cylindersPerMonth * cylinderPrice;

    // Induction comparison
    // Average induction: 1400W for same cooking
    const inductionWatts = burnerType === "double" ? 2400 : 1400;
    const dailyKwh = (inductionWatts * cookingHours) / 1000;
    const monthlyCostInduction = dailyKwh * 30 * electricityRate;

    const savings = monthlyCostLpg - monthlyCostInduction;

    return {
      gramsPerHour,
      dailyGrams,
      daysPerCylinder,
      cylindersPerMonth,
      monthlyCostLpg,
      inductionWatts,
      dailyKwh,
      monthlyCostInduction,
      savings,
      inductionCheaper: savings > 0,
    };
  }, [cookingHours, burnerType, flameIntensity, cylinderPrice, electricityRate]);

  const fmt = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">Daily Cooking Hours</label>
            <span className="text-sm font-bold text-indigo-600">{cookingHours} hrs</span>
          </div>
          <input type="range" min={0.5} max={8} step={0.5} value={cookingHours} onChange={(e) => setCookingHours(+e.target.value)} className="w-full" />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>0.5 hr</span><span>8 hrs</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Burner Type</label>
          <div className="flex gap-3">
            <button onClick={() => setBurnerType("single")} className={burnerType === "single" ? "btn-primary" : "btn-secondary"}>Single Burner</button>
            <button onClick={() => setBurnerType("double")} className={burnerType === "double" ? "btn-primary" : "btn-secondary"}>Double Burner</button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Flame Intensity</label>
          <div className="flex gap-3">
            {(["low", "medium", "high"] as const).map((f) => (
              <button key={f} onClick={() => setFlameIntensity(f)} className={flameIntensity === f ? "btn-primary" : "btn-secondary"}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Cylinder Price</label>
            <div className="flex items-center gap-1">
              <span className="text-gray-500">₹</span>
              <input type="number" min={100} step={10} value={cylinderPrice} onChange={(e) => setCylinderPrice(+e.target.value)} className="calc-input" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Electricity Rate</label>
            <div className="flex items-center gap-1">
              <span className="text-gray-500">₹</span>
              <input type="number" min={1} step={0.5} value={electricityRate} onChange={(e) => setElectricityRate(+e.target.value)} className="calc-input" />
              <span className="text-xs text-gray-400">/unit</span>
            </div>
          </div>
        </div>
      </div>

      <div className="result-card space-y-4">
        <h3 className="text-lg font-bold text-gray-800">LPG Gas Cylinder Usage</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-xs font-medium text-gray-500 mb-1">Daily Consumption</div>
            <div className="text-2xl font-extrabold text-indigo-600">{result.dailyGrams.toFixed(0)}g</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-xs font-medium text-gray-500 mb-1">Cylinder Lasts</div>
            <div className="text-2xl font-extrabold text-emerald-600">{result.daysPerCylinder.toFixed(0)} days</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-xs font-medium text-gray-500 mb-1">Cylinders/Month</div>
            <div className="text-2xl font-extrabold text-amber-600">{result.cylindersPerMonth.toFixed(1)}</div>
          </div>
        </div>
      </div>

      {/* Comparison */}
      <div className="result-card space-y-4">
        <h3 className="text-lg font-bold text-gray-800">LPG vs Induction Cooking</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-orange-50 rounded-xl p-4 text-center">
            <div className="text-sm font-semibold text-orange-700 mb-2">LPG Gas</div>
            <div className="text-3xl font-extrabold text-orange-600">{fmt(result.monthlyCostLpg)}</div>
            <div className="text-xs text-orange-500 mt-1">per month</div>
            <div className="text-xs text-gray-500 mt-2">
              {result.gramsPerHour}g/hr | {result.daysPerCylinder.toFixed(0)} days/cylinder
            </div>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <div className="text-sm font-semibold text-blue-700 mb-2">Induction Cooking</div>
            <div className="text-3xl font-extrabold text-blue-600">{fmt(result.monthlyCostInduction)}</div>
            <div className="text-xs text-blue-500 mt-1">per month</div>
            <div className="text-xs text-gray-500 mt-2">
              {result.inductionWatts}W | {result.dailyKwh.toFixed(1)} kWh/day
            </div>
          </div>
        </div>

        <div className={`p-3 rounded-lg text-sm text-center font-semibold ${result.inductionCheaper ? "bg-green-50 text-green-800" : "bg-amber-50 text-amber-800"}`}>
          {result.inductionCheaper
            ? `Induction saves you ${fmt(result.savings)} per month compared to LPG`
            : `LPG saves you ${fmt(Math.abs(result.savings))} per month compared to Induction`}
        </div>
      </div>
    </div>
  );
}
