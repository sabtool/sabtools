"use client";
import { useState, useMemo } from "react";

export default function BmrCalculator() {
  const [gender, setGender] = useState<"male" | "female">("male");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");

  const result = useMemo(() => {
    const a = parseFloat(age);
    const w = parseFloat(weight);
    const h = parseFloat(height);
    if (!a || !w || !h || a <= 0 || w <= 0 || h <= 0) return null;

    // Mifflin-St Jeor Equation
    let bmr: number;
    if (gender === "male") {
      bmr = 10 * w + 6.25 * h - 5 * a + 5;
    } else {
      bmr = 10 * w + 6.25 * h - 5 * a - 161;
    }

    const levels = [
      { label: "Sedentary", desc: "Little or no exercise", factor: 1.2 },
      { label: "Lightly Active", desc: "Light exercise 1-3 days/week", factor: 1.375 },
      { label: "Moderately Active", desc: "Moderate exercise 3-5 days/week", factor: 1.55 },
      { label: "Active", desc: "Hard exercise 6-7 days/week", factor: 1.725 },
      { label: "Very Active", desc: "Very hard exercise, physical job", factor: 1.9 },
    ];

    return { bmr, levels };
  }, [gender, age, weight, height]);

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Gender</label>
        <div className="flex gap-2">
          {(["male", "female"] as const).map((g) => (
            <button key={g} onClick={() => setGender(g)} className={`px-6 py-2 rounded-xl text-sm font-semibold capitalize transition ${gender === g ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"}`}>{g}</button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Age (years)</label>
          <input type="number" placeholder="e.g. 25" value={age} onChange={(e) => setAge(e.target.value)} className="calc-input" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Weight (kg)</label>
          <input type="number" placeholder="e.g. 70" value={weight} onChange={(e) => setWeight(e.target.value)} className="calc-input" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Height (cm)</label>
          <input type="number" placeholder="e.g. 175" value={height} onChange={(e) => setHeight(e.target.value)} className="calc-input" />
        </div>
      </div>
      {result && (
        <div className="result-card space-y-4">
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-1">Your Basal Metabolic Rate (BMR)</div>
            <div className="text-5xl font-extrabold text-indigo-600">{Math.round(result.bmr)}</div>
            <div className="text-sm text-gray-500 mt-1">calories/day</div>
          </div>
          <div className="border-t border-gray-100 pt-4">
            <div className="text-sm font-semibold text-gray-700 mb-3">Daily Calories (TDEE) by Activity Level</div>
            <div className="space-y-2">
              {result.levels.map((level) => (
                <div key={level.label} className="flex items-center justify-between bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
                  <div>
                    <div className="text-sm font-semibold text-gray-800">{level.label}</div>
                    <div className="text-xs text-gray-400">{level.desc}</div>
                  </div>
                  <div className="text-lg font-bold text-indigo-600">{Math.round(result.bmr * level.factor)} <span className="text-xs font-normal text-gray-400">cal</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
