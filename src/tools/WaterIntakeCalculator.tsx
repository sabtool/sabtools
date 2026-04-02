"use client";
import { useState, useMemo } from "react";

export default function WaterIntakeCalculator() {
  const [weight, setWeight] = useState("");
  const [activity, setActivity] = useState("moderate");

  const result = useMemo(() => {
    const w = parseFloat(weight);
    if (!w || w <= 0) return null;

    const activityMultipliers: Record<string, { factor: number; label: string }> = {
      sedentary: { factor: 0.033, label: "Sedentary" },
      light: { factor: 0.037, label: "Lightly Active" },
      moderate: { factor: 0.04, label: "Moderately Active" },
      active: { factor: 0.044, label: "Active" },
      veryActive: { factor: 0.048, label: "Very Active" },
    };

    const mult = activityMultipliers[activity];
    const liters = w * mult.factor;
    const ml = Math.round(liters * 1000);
    const glasses = Math.ceil(ml / 250);

    return { liters, ml, glasses, activityLabel: mult.label };
  }, [weight, activity]);

  const activityOptions = [
    { value: "sedentary", label: "Sedentary", desc: "Desk job, no exercise" },
    { value: "light", label: "Light", desc: "Light exercise 1-2x/week" },
    { value: "moderate", label: "Moderate", desc: "Exercise 3-5x/week" },
    { value: "active", label: "Active", desc: "Daily exercise" },
    { value: "veryActive", label: "Very Active", desc: "Intense daily exercise" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Body Weight (kg)</label>
        <input type="number" placeholder="e.g. 70" value={weight} onChange={(e) => setWeight(e.target.value)} className="calc-input" />
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Activity Level</label>
        <div className="flex flex-wrap gap-2">
          {activityOptions.map((a) => (
            <button key={a.value} onClick={() => setActivity(a.value)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${activity === a.value ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"}`}>{a.label}</button>
          ))}
        </div>
      </div>
      {result && (
        <div className="result-card space-y-4">
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-1">Recommended Daily Water Intake</div>
            <div className="text-5xl font-extrabold text-indigo-600">{result.liters.toFixed(1)} L</div>
            <div className="text-sm text-gray-500 mt-1">{result.ml} ml per day</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
              <div className="text-xs font-medium text-gray-500 mb-1">Glasses of Water</div>
              <div className="text-3xl font-bold text-indigo-600">{result.glasses}</div>
              <div className="text-xs text-gray-400">glasses (250ml each)</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
              <div className="text-xs font-medium text-gray-500 mb-1">Bottles</div>
              <div className="text-3xl font-bold text-green-600">{(result.ml / 500).toFixed(1)}</div>
              <div className="text-xs text-gray-400">bottles (500ml each)</div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-xs font-semibold text-gray-500 mb-2">Hourly Intake (16 waking hours)</div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Drink approximately</span>
              <span className="text-lg font-bold text-indigo-600">{Math.round(result.ml / 16)} ml</span>
              <span className="text-sm text-gray-600">every hour</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
