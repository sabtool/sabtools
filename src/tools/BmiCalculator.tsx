"use client";
import { useState, useMemo } from "react";

export default function BmiCalculator() {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");

  const result = useMemo(() => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    if (!w || !h || w <= 0 || h <= 0) return null;

    let bmi: number;
    if (unit === "metric") {
      bmi = w / Math.pow(h / 100, 2);
    } else {
      bmi = (w / Math.pow(h, 2)) * 703;
    }

    let category: string, color: string;
    if (bmi < 18.5) { category = "Underweight"; color = "text-blue-600"; }
    else if (bmi < 25) { category = "Normal"; color = "text-green-600"; }
    else if (bmi < 30) { category = "Overweight"; color = "text-orange-600"; }
    else { category = "Obese"; color = "text-red-600"; }

    return { bmi, category, color };
  }, [weight, height, unit]);

  return (
    <div className="space-y-6">
      <div className="flex gap-2 mb-4">
        {(["metric", "imperial"] as const).map((u) => (
          <button key={u} onClick={() => setUnit(u)} className={`px-5 py-2 rounded-xl text-sm font-semibold capitalize transition ${unit === u ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"}`}>{u}</button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Weight ({unit === "metric" ? "kg" : "lbs"})</label>
          <input type="number" placeholder={unit === "metric" ? "e.g. 70" : "e.g. 154"} value={weight} onChange={(e) => setWeight(e.target.value)} className="calc-input" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Height ({unit === "metric" ? "cm" : "inches"})</label>
          <input type="number" placeholder={unit === "metric" ? "e.g. 175" : "e.g. 69"} value={height} onChange={(e) => setHeight(e.target.value)} className="calc-input" />
        </div>
      </div>
      {result && (
        <div className="result-card text-center space-y-3">
          <div className="text-sm text-gray-500">Your BMI</div>
          <div className={`text-5xl font-extrabold ${result.color}`}>{result.bmi.toFixed(1)}</div>
          <div className={`text-xl font-bold ${result.color}`}>{result.category}</div>
          <div className="w-full bg-gray-200 rounded-full h-3 mt-4 relative overflow-hidden">
            <div className="absolute inset-0 flex">
              <div className="bg-blue-400 h-full" style={{ width: "18.5%" }} />
              <div className="bg-green-400 h-full" style={{ width: "6.5%" }} />
              <div className="bg-orange-400 h-full" style={{ width: "5%" }} />
              <div className="bg-red-400 h-full" style={{ width: "70%" }} />
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 w-3 h-5 bg-gray-800 rounded-sm shadow" style={{ left: `${Math.min(result.bmi / 40 * 100, 100)}%` }} />
          </div>
          <div className="flex justify-between text-xs text-gray-400 px-1">
            <span>Underweight</span><span>Normal</span><span>Overweight</span><span>Obese</span>
          </div>
        </div>
      )}
    </div>
  );
}
