"use client";
import { useState, useMemo } from "react";

const ACTIVITY_LEVELS = [
  { label: "Sedentary", desc: "Little or no exercise", factor: 1.2 },
  { label: "Lightly Active", desc: "Light exercise 1-3 days/week", factor: 1.375 },
  { label: "Moderately Active", desc: "Moderate exercise 3-5 days/week", factor: 1.55 },
  { label: "Very Active", desc: "Hard exercise 6-7 days/week", factor: 1.725 },
  { label: "Extra Active", desc: "Very hard exercise, physical job", factor: 1.9 },
];

const GOALS = [
  { label: "Lose Weight", calorieAdj: -500 },
  { label: "Maintain Weight", calorieAdj: 0 },
  { label: "Gain Weight", calorieAdj: 500 },
];

interface DietPlan {
  name: string;
  proteinPct: number;
  carbsPct: number;
  fatPct: number;
}

const DIETS: DietPlan[] = [
  { name: "Balanced", proteinPct: 30, carbsPct: 40, fatPct: 30 },
  { name: "Low Carb", proteinPct: 40, carbsPct: 20, fatPct: 40 },
  { name: "High Protein", proteinPct: 40, carbsPct: 35, fatPct: 25 },
  { name: "Keto", proteinPct: 25, carbsPct: 5, fatPct: 70 },
];

export default function MacroCalculator() {
  const [gender, setGender] = useState<"male" | "female">("male");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [activity, setActivity] = useState(0);
  const [goal, setGoal] = useState(1);

  const result = useMemo(() => {
    const a = parseFloat(age);
    const w = parseFloat(weight);
    const h = parseFloat(height);
    if (!a || !w || !h || a <= 0 || w <= 0 || h <= 0) return null;

    // Mifflin-St Jeor
    let bmr: number;
    if (gender === "male") {
      bmr = 10 * w + 6.25 * h - 5 * a + 5;
    } else {
      bmr = 10 * w + 6.25 * h - 5 * a - 161;
    }

    const tdee = bmr * ACTIVITY_LEVELS[activity].factor;
    const targetCal = Math.max(1200, tdee + GOALS[goal].calorieAdj);

    const diets = DIETS.map((diet) => ({
      name: diet.name,
      protein: Math.round((targetCal * diet.proteinPct / 100) / 4),
      carbs: Math.round((targetCal * diet.carbsPct / 100) / 4),
      fat: Math.round((targetCal * diet.fatPct / 100) / 9),
      proteinPct: diet.proteinPct,
      carbsPct: diet.carbsPct,
      fatPct: diet.fatPct,
    }));

    return { bmr: Math.round(bmr), tdee: Math.round(tdee), targetCal: Math.round(targetCal), diets };
  }, [gender, age, weight, height, activity, goal]);

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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Activity Level</label>
          <select value={activity} onChange={(e) => setActivity(Number(e.target.value))} className="calc-input">
            {ACTIVITY_LEVELS.map((l, i) => <option key={i} value={i}>{l.label} - {l.desc}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Goal</label>
          <select value={goal} onChange={(e) => setGoal(Number(e.target.value))} className="calc-input">
            {GOALS.map((g, i) => <option key={i} value={i}>{g.label}</option>)}
          </select>
        </div>
      </div>

      {result && (
        <div className="result-card space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
            <div className="bg-white rounded-xl p-3 border border-gray-100">
              <div className="text-xs text-gray-400">BMR</div>
              <div className="text-lg font-bold text-indigo-600">{result.bmr.toLocaleString("en-IN")} cal</div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-100">
              <div className="text-xs text-gray-400">TDEE</div>
              <div className="text-lg font-bold text-indigo-600">{result.tdee.toLocaleString("en-IN")} cal</div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-100">
              <div className="text-xs text-gray-400">Target Calories</div>
              <div className="text-lg font-bold text-green-600">{result.targetCal.toLocaleString("en-IN")} cal</div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <div className="text-sm font-semibold text-gray-700 mb-3">Macro Split by Diet Type</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {result.diets.map((diet) => (
                <div key={diet.name} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                  <div className="text-sm font-bold text-gray-800 mb-2">{diet.name}</div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Protein ({diet.proteinPct}%)</span>
                      <span className="text-sm font-bold text-blue-600">{diet.protein}g</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div className="h-1.5 rounded-full bg-blue-500" style={{ width: `${diet.proteinPct}%` }} />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Carbs ({diet.carbsPct}%)</span>
                      <span className="text-sm font-bold text-yellow-600">{diet.carbs}g</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div className="h-1.5 rounded-full bg-yellow-500" style={{ width: `${diet.carbsPct}%` }} />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Fat ({diet.fatPct}%)</span>
                      <span className="text-sm font-bold text-red-600">{diet.fat}g</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div className="h-1.5 rounded-full bg-red-500" style={{ width: `${diet.fatPct}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
