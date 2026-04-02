"use client";
import { useState, useMemo } from "react";

// Density: grams per ml
const INGREDIENTS: Record<string, number> = {
  "Water": 1.0,
  "Milk": 1.03,
  "Oil (Vegetable)": 0.92,
  "Butter (melted)": 0.91,
  "Flour (Maida)": 0.53,
  "Flour (Atta)": 0.51,
  "Sugar": 0.85,
  "Powdered Sugar": 0.56,
  "Rice (uncooked)": 0.85,
  "Salt": 1.22,
  "Honey": 1.42,
  "Ghee": 0.91,
  "Curd / Yogurt": 1.03,
  "Cream": 0.98,
  "Besan (Gram Flour)": 0.55,
  "Sooji / Semolina": 0.68,
  "Coconut (desiccated)": 0.35,
};

// All units in ml equivalent (volume) or grams (weight)
type UnitType = "volume" | "weight";
interface Unit { name: string; type: UnitType; factor: number; }

const UNITS: Unit[] = [
  { name: "Cup (240ml)", type: "volume", factor: 240 },
  { name: "Tablespoon (15ml)", type: "volume", factor: 15 },
  { name: "Teaspoon (5ml)", type: "volume", factor: 5 },
  { name: "Milliliter (ml)", type: "volume", factor: 1 },
  { name: "Liter", type: "volume", factor: 1000 },
  { name: "Gram (g)", type: "weight", factor: 1 },
  { name: "Kilogram (kg)", type: "weight", factor: 1000 },
  { name: "Ounce (oz)", type: "weight", factor: 28.3495 },
  { name: "Pound (lb)", type: "weight", factor: 453.592 },
];

export default function RecipeUnitConverter() {
  const [amount, setAmount] = useState(1);
  const [fromUnit, setFromUnit] = useState("Cup (240ml)");
  const [toUnit, setToUnit] = useState("Gram (g)");
  const [ingredient, setIngredient] = useState("Flour (Maida)");

  const result = useMemo(() => {
    if (amount <= 0) return null;

    const from = UNITS.find((u) => u.name === fromUnit)!;
    const to = UNITS.find((u) => u.name === toUnit)!;
    const density = INGREDIENTS[ingredient];

    // Convert input to ml (if volume) or grams (if weight)
    let inMl: number, inGrams: number;

    if (from.type === "volume") {
      inMl = amount * from.factor;
      inGrams = inMl * density;
    } else {
      inGrams = amount * from.factor;
      inMl = inGrams / density;
    }

    let converted: number;
    if (to.type === "volume") {
      converted = inMl / to.factor;
    } else {
      converted = inGrams / to.factor;
    }

    // Convert to all units
    const allConversions = UNITS.map((u) => ({
      name: u.name,
      value: u.type === "volume" ? inMl / u.factor : inGrams / u.factor,
    }));

    return { converted, allConversions };
  }, [amount, fromUnit, toUnit, ingredient]);

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Ingredient</label>
          <select value={ingredient} onChange={(e) => setIngredient(e.target.value)} className="calc-input">
            {Object.keys(INGREDIENTS).map((i) => (
              <option key={i} value={i}>{i} ({INGREDIENTS[i]} g/ml)</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-3 gap-3 items-end">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Amount</label>
            <input type="number" min={0.01} step={0.01} value={amount} onChange={(e) => setAmount(+e.target.value)} className="calc-input" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">From</label>
            <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} className="calc-input">
              {UNITS.map((u) => (
                <option key={u.name} value={u.name}>{u.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">To</label>
            <select value={toUnit} onChange={(e) => setToUnit(e.target.value)} className="calc-input">
              {UNITS.map((u) => (
                <option key={u.name} value={u.name}>{u.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {result && (
        <div className="result-card space-y-4">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-xs font-medium text-gray-500 mb-1">Result</div>
            <div className="text-3xl font-extrabold text-indigo-600">{result.converted.toFixed(4)}</div>
            <div className="text-sm text-gray-500 mt-1">
              {amount} {fromUnit} of {ingredient} = {result.converted.toFixed(4)} {toUnit}
            </div>
          </div>

          <h4 className="text-sm font-bold text-gray-700">All Conversions</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {result.allConversions.map((c) => (
              <div key={c.name} className={`bg-white rounded-lg p-3 shadow-sm ${c.name === toUnit ? "ring-2 ring-indigo-400" : ""}`}>
                <div className="text-xs text-gray-500">{c.name}</div>
                <div className="text-lg font-bold text-gray-800">{c.value < 0.01 ? c.value.toExponential(2) : c.value.toFixed(4)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
