"use client";
import { useState, useMemo } from "react";

export default function CalorieCalculator() {
  const [gender, setGender] = useState<"male" | "female">("male");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [activity, setActivity] = useState("1.55");
  const [goal, setGoal] = useState<"lose" | "maintain" | "gain">("maintain");

  const result = useMemo(() => {
    const a = parseFloat(age);
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const act = parseFloat(activity);
    if (!a || !w || !h || a <= 0 || w <= 0 || h <= 0) return null;

    let bmr: number;
    if (gender === "male") {
      bmr = 10 * w + 6.25 * h - 5 * a + 5;
    } else {
      bmr = 10 * w + 6.25 * h - 5 * a - 161;
    }

    const tdee = bmr * act;
    let target: number;
    let goalLabel: string;
    let goalColor: string;
    if (goal === "lose") {
      target = tdee - 500;
      goalLabel = "Weight Loss";
      goalColor = "text-red-600";
    } else if (goal === "gain") {
      target = tdee + 500;
      goalLabel = "Weight Gain";
      goalColor = "text-green-600";
    } else {
      target = tdee;
      goalLabel = "Maintain Weight";
      goalColor = "text-indigo-600";
    }

    const protein = Math.round((target * 0.3) / 4);
    const carbs = Math.round((target * 0.4) / 4);
    const fat = Math.round((target * 0.3) / 9);

    return { bmr, tdee, target, goalLabel, goalColor, protein, carbs, fat };
  }, [gender, age, weight, height, activity, goal]);

  const activities = [
    { value: "1.2", label: "Sedentary" },
    { value: "1.375", label: "Lightly Active" },
    { value: "1.55", label: "Moderately Active" },
    { value: "1.725", label: "Active" },
    { value: "1.9", label: "Very Active" },
  ];

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
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Activity Level</label>
        <div className="flex flex-wrap gap-2">
          {activities.map((a) => (
            <button key={a.value} onClick={() => setActivity(a.value)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${activity === a.value ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"}`}>{a.label}</button>
          ))}
        </div>
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Goal</label>
        <div className="flex gap-2">
          {([
            { value: "lose", label: "Lose Weight", emoji: "" },
            { value: "maintain", label: "Maintain", emoji: "" },
            { value: "gain", label: "Gain Weight", emoji: "" },
          ] as const).map((g) => (
            <button key={g.value} onClick={() => setGoal(g.value)} className={`px-5 py-2 rounded-xl text-sm font-semibold transition ${goal === g.value ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"}`}>{g.label}</button>
          ))}
        </div>
      </div>
      {result && (
        <div className="result-card space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
              <div className="text-xs font-medium text-gray-500 mb-1">BMR</div>
              <div className="text-xl font-bold text-gray-700">{Math.round(result.bmr)}</div>
              <div className="text-xs text-gray-400">cal/day</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
              <div className="text-xs font-medium text-gray-500 mb-1">TDEE</div>
              <div className="text-xl font-bold text-gray-700">{Math.round(result.tdee)}</div>
              <div className="text-xs text-gray-400">cal/day</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
              <div className="text-xs font-medium text-gray-500 mb-1">{result.goalLabel}</div>
              <div className={`text-2xl font-extrabold ${result.goalColor}`}>{Math.round(result.target)}</div>
              <div className="text-xs text-gray-400">cal/day</div>
            </div>
          </div>
          <div className="border-t border-gray-100 pt-4">
            <div className="text-sm font-semibold text-gray-700 mb-3">Suggested Macros (30/40/30 split)</div>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white rounded-xl p-3 text-center shadow-sm border border-gray-100">
                <div className="text-xs text-gray-500 mb-1">Protein</div>
                <div className="text-lg font-bold text-red-500">{result.protein}g</div>
              </div>
              <div className="bg-white rounded-xl p-3 text-center shadow-sm border border-gray-100">
                <div className="text-xs text-gray-500 mb-1">Carbs</div>
                <div className="text-lg font-bold text-yellow-500">{result.carbs}g</div>
              </div>
              <div className="bg-white rounded-xl p-3 text-center shadow-sm border border-gray-100">
                <div className="text-xs text-gray-500 mb-1">Fat</div>
                <div className="text-lg font-bold text-green-500">{result.fat}g</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
