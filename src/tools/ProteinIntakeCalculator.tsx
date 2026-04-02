"use client";
import { useState, useMemo } from "react";

const ACTIVITY_LEVELS = [
  { label: "Sedentary", desc: "Desk job, minimal exercise", factor: { maintain: 0.8, build: 1.2, lose: 1.0 } },
  { label: "Moderate", desc: "Exercise 3-4 days/week", factor: { maintain: 1.0, build: 1.6, lose: 1.2 } },
  { label: "Active", desc: "Exercise 5-6 days/week", factor: { maintain: 1.2, build: 1.8, lose: 1.4 } },
  { label: "Athlete", desc: "Intense training daily", factor: { maintain: 1.4, build: 2.2, lose: 1.6 } },
];

const GOALS = ["maintain", "build", "lose"] as const;
type Goal = typeof GOALS[number];

const GOAL_LABELS: Record<Goal, string> = {
  maintain: "Maintain Weight",
  build: "Build Muscle",
  lose: "Lose Fat",
};

export default function ProteinIntakeCalculator() {
  const [weight, setWeight] = useState("");
  const [activity, setActivity] = useState(0);
  const [goal, setGoal] = useState<Goal>("maintain");
  const [meals, setMeals] = useState("4");

  const result = useMemo(() => {
    const w = parseFloat(weight);
    if (!w || w <= 0) return null;

    const level = ACTIVITY_LEVELS[activity];
    const proteinPerKg = level.factor[goal];
    const totalProtein = Math.round(w * proteinPerKg);

    const mealCount = Math.max(1, Math.min(8, parseInt(meals) || 4));
    const perMeal = Math.round(totalProtein / mealCount);

    const minProtein = Math.round(w * (proteinPerKg - 0.2));
    const maxProtein = Math.round(w * (proteinPerKg + 0.2));

    return { totalProtein, proteinPerKg, perMeal, mealCount, minProtein, maxProtein };
  }, [weight, activity, goal, meals]);

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Body Weight (kg)</label>
        <input type="number" placeholder="e.g. 70" value={weight} onChange={(e) => setWeight(e.target.value)} className="calc-input" />
      </div>

      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Activity Level</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {ACTIVITY_LEVELS.map((l, i) => (
            <button key={i} onClick={() => setActivity(i)} className={`p-3 rounded-xl text-sm font-semibold transition text-center ${activity === i ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"}`}>
              <div>{l.label}</div>
              <div className={`text-xs mt-0.5 ${activity === i ? "text-indigo-200" : "text-gray-400"}`}>{l.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Goal</label>
          <select value={goal} onChange={(e) => setGoal(e.target.value as Goal)} className="calc-input">
            {GOALS.map((g) => <option key={g} value={g}>{GOAL_LABELS[g]}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Meals Per Day</label>
          <input type="number" placeholder="e.g. 4" value={meals} onChange={(e) => setMeals(e.target.value)} className="calc-input" min="1" max="8" />
        </div>
      </div>

      {result && (
        <div className="result-card space-y-4">
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-1">Daily Protein Intake</div>
            <div className="text-5xl font-extrabold text-indigo-600">{result.totalProtein} <span className="text-lg font-normal text-gray-400">grams</span></div>
            <div className="text-sm text-gray-500 mt-1">{result.proteinPerKg}g per kg body weight</div>
            <div className="text-xs text-gray-400">Range: {result.minProtein}g - {result.maxProtein}g</div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <div className="text-sm font-semibold text-gray-700 mb-3">Meal Distribution ({result.mealCount} meals)</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Array.from({ length: result.mealCount }, (_, i) => (
                <div key={i} className="bg-white rounded-xl p-3 border border-gray-100 text-center">
                  <div className="text-xs text-gray-400">Meal {i + 1}</div>
                  <div className="text-lg font-bold text-indigo-600">{result.perMeal}g</div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <div className="text-sm font-semibold text-gray-700 mb-2">Protein-Rich Indian Foods</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              {[
                { food: "Paneer (100g)", protein: "18g" },
                { food: "Chicken Breast (100g)", protein: "31g" },
                { food: "Eggs (2 whole)", protein: "12g" },
                { food: "Dal/Lentils (1 cup)", protein: "18g" },
                { food: "Greek Yogurt (200g)", protein: "20g" },
                { food: "Tofu (100g)", protein: "8g" },
                { food: "Chana (1 cup)", protein: "15g" },
                { food: "Whey Scoop (30g)", protein: "24g" },
                { food: "Soya Chunks (50g)", protein: "26g" },
              ].map((item) => (
                <div key={item.food} className="bg-white rounded-lg p-2 border border-gray-100 flex justify-between">
                  <span className="text-gray-600">{item.food}</span>
                  <span className="font-bold text-indigo-600">{item.protein}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
