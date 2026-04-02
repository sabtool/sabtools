"use client";
import { useState, useMemo } from "react";

const DRINK_TYPES = [
  { label: "Beer (5%)", alcohol: 0.05, mlPerDrink: 330 },
  { label: "Wine (12%)", alcohol: 0.12, mlPerDrink: 150 },
  { label: "Whisky/Rum (40%)", alcohol: 0.40, mlPerDrink: 30 },
  { label: "Vodka (40%)", alcohol: 0.40, mlPerDrink: 30 },
  { label: "Cocktail (~15%)", alcohol: 0.15, mlPerDrink: 200 },
];

export default function BloodAlcoholCalculator() {
  const [weight, setWeight] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [drinks, setDrinks] = useState("");
  const [drinkType, setDrinkType] = useState(0);
  const [hours, setHours] = useState("");

  const result = useMemo(() => {
    const w = parseFloat(weight);
    const d = parseFloat(drinks);
    const h = parseFloat(hours) || 0;
    if (!w || w <= 0 || !d || d <= 0) return null;

    const drink = DRINK_TYPES[drinkType];
    // Widmark formula: BAC = (alcohol in grams / (body weight in grams * r)) - (0.015 * hours)
    const alcoholGrams = d * drink.mlPerDrink * drink.alcohol * 0.789; // density of ethanol
    const r = gender === "male" ? 0.68 : 0.55;
    const bac = Math.max(0, (alcoholGrams / (w * 1000 * r)) * 100 - 0.015 * h);

    // Time to sober (BAC eliminates at ~0.015 per hour)
    const hoursToSober = bac > 0 ? bac / 0.015 : 0;

    // India legal limit is 0.03% (30mg per 100ml)
    const indiaLegal = bac <= 0.03;

    let status = "";
    let statusColor = "";
    if (bac === 0) { status = "Sober"; statusColor = "text-green-600"; }
    else if (bac <= 0.02) { status = "Minimal Effects"; statusColor = "text-green-600"; }
    else if (bac <= 0.03) { status = "Borderline (India Limit)"; statusColor = "text-yellow-600"; }
    else if (bac <= 0.06) { status = "Mild Impairment"; statusColor = "text-orange-600"; }
    else if (bac <= 0.10) { status = "Significant Impairment"; statusColor = "text-red-600"; }
    else if (bac <= 0.20) { status = "Severe Impairment"; statusColor = "text-red-700"; }
    else { status = "Dangerous Level"; statusColor = "text-red-800"; }

    return { bac, hoursToSober, indiaLegal, status, statusColor, alcoholGrams };
  }, [weight, gender, drinks, drinkType, hours]);

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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Body Weight (kg)</label>
          <input type="number" placeholder="e.g. 70" value={weight} onChange={(e) => setWeight(e.target.value)} className="calc-input" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Number of Drinks</label>
          <input type="number" placeholder="e.g. 3" value={drinks} onChange={(e) => setDrinks(e.target.value)} className="calc-input" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Drink Type</label>
          <select value={drinkType} onChange={(e) => setDrinkType(Number(e.target.value))} className="calc-input">
            {DRINK_TYPES.map((d, i) => <option key={i} value={i}>{d.label}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Hours Since First Drink</label>
          <input type="number" placeholder="e.g. 2" value={hours} onChange={(e) => setHours(e.target.value)} className="calc-input" />
        </div>
      </div>

      {result && (
        <div className="result-card space-y-4">
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-1">Estimated Blood Alcohol Content</div>
            <div className={`text-5xl font-extrabold ${result.statusColor}`}>{result.bac.toFixed(3)}%</div>
            <div className={`text-sm font-semibold mt-1 ${result.statusColor}`}>{result.status}</div>
          </div>

          <div className="border-t border-gray-100 pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className={`rounded-xl p-3 border text-center ${result.indiaLegal ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
              <div className="text-xs text-gray-500">India Legal (0.03%)</div>
              <div className={`text-lg font-bold ${result.indiaLegal ? "text-green-600" : "text-red-600"}`}>{result.indiaLegal ? "Within Limit" : "Over Limit"}</div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
              <div className="text-xs text-gray-400">Time to Sober</div>
              <div className="text-lg font-bold text-indigo-600">{result.hoursToSober.toFixed(1)} hrs</div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
              <div className="text-xs text-gray-400">Alcohol Consumed</div>
              <div className="text-lg font-bold text-indigo-600">{result.alcoholGrams.toFixed(1)} g</div>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-xl p-3">
            <div className="text-xs text-red-700">
              <strong>Disclaimer:</strong> This is an estimate only. Actual BAC varies based on food intake, metabolism, medication, and individual factors. Never drink and drive. India&apos;s legal BAC limit is 0.03% (30 mg/100 ml blood).
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
