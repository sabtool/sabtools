"use client";
import { useState, useMemo } from "react";

export default function BodyFatCalculator() {
  const [gender, setGender] = useState<"male" | "female">("male");
  const [waist, setWaist] = useState("");
  const [neck, setNeck] = useState("");
  const [height, setHeight] = useState("");
  const [hip, setHip] = useState("");

  const result = useMemo(() => {
    const w = parseFloat(waist);
    const n = parseFloat(neck);
    const h = parseFloat(height);
    const hp = parseFloat(hip);
    if (!w || !n || !h || w <= 0 || n <= 0 || h <= 0) return null;
    if (gender === "female" && (!hp || hp <= 0)) return null;
    if (w <= n) return null;

    let bf: number;
    if (gender === "male") {
      // US Navy formula for men
      bf = 495 / (1.0324 - 0.19077 * Math.log10(w - n) + 0.15456 * Math.log10(h)) - 450;
    } else {
      if (w + hp <= n) return null;
      // US Navy formula for women
      bf = 495 / (1.29579 - 0.35004 * Math.log10(w + hp - n) + 0.22100 * Math.log10(h)) - 450;
    }

    if (bf < 0 || bf > 60) return null;

    let category: string;
    let categoryColor: string;
    if (gender === "male") {
      if (bf < 6) { category = "Essential Fat"; categoryColor = "text-red-600"; }
      else if (bf < 14) { category = "Athletes"; categoryColor = "text-green-600"; }
      else if (bf < 18) { category = "Fitness"; categoryColor = "text-green-500"; }
      else if (bf < 25) { category = "Average"; categoryColor = "text-yellow-600"; }
      else { category = "Obese"; categoryColor = "text-red-600"; }
    } else {
      if (bf < 14) { category = "Essential Fat"; categoryColor = "text-red-600"; }
      else if (bf < 21) { category = "Athletes"; categoryColor = "text-green-600"; }
      else if (bf < 25) { category = "Fitness"; categoryColor = "text-green-500"; }
      else if (bf < 32) { category = "Average"; categoryColor = "text-yellow-600"; }
      else { category = "Obese"; categoryColor = "text-red-600"; }
    }

    const leanMass = 100 - bf;

    return { bf, category, categoryColor, leanMass };
  }, [gender, waist, neck, height, hip]);

  const maleCategories = [
    { label: "Essential Fat", range: "2-5%", color: "bg-red-400" },
    { label: "Athletes", range: "6-13%", color: "bg-green-500" },
    { label: "Fitness", range: "14-17%", color: "bg-green-400" },
    { label: "Average", range: "18-24%", color: "bg-yellow-400" },
    { label: "Obese", range: "25%+", color: "bg-red-500" },
  ];
  const femaleCategories = [
    { label: "Essential Fat", range: "10-13%", color: "bg-red-400" },
    { label: "Athletes", range: "14-20%", color: "bg-green-500" },
    { label: "Fitness", range: "21-24%", color: "bg-green-400" },
    { label: "Average", range: "25-31%", color: "bg-yellow-400" },
    { label: "Obese", range: "32%+", color: "bg-red-500" },
  ];

  const categories = gender === "male" ? maleCategories : femaleCategories;

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
          <label className="text-sm font-semibold text-gray-700 block mb-2">Waist (cm)</label>
          <input type="number" placeholder="e.g. 85" value={waist} onChange={(e) => setWaist(e.target.value)} className="calc-input" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Neck (cm)</label>
          <input type="number" placeholder="e.g. 38" value={neck} onChange={(e) => setNeck(e.target.value)} className="calc-input" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Height (cm)</label>
          <input type="number" placeholder="e.g. 175" value={height} onChange={(e) => setHeight(e.target.value)} className="calc-input" />
        </div>
        {gender === "female" && (
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">Hip (cm)</label>
            <input type="number" placeholder="e.g. 95" value={hip} onChange={(e) => setHip(e.target.value)} className="calc-input" />
          </div>
        )}
      </div>
      {result && (
        <div className="result-card space-y-4">
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-1">Body Fat Percentage</div>
            <div className={`text-5xl font-extrabold ${result.categoryColor}`}>{result.bf.toFixed(1)}%</div>
            <div className={`text-xl font-bold mt-1 ${result.categoryColor}`}>{result.category}</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
              <div className="text-xs font-medium text-gray-500 mb-1">Body Fat</div>
              <div className="text-xl font-bold text-red-500">{result.bf.toFixed(1)}%</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
              <div className="text-xs font-medium text-gray-500 mb-1">Lean Mass</div>
              <div className="text-xl font-bold text-green-600">{result.leanMass.toFixed(1)}%</div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <div className="text-sm font-semibold text-gray-700 mb-3">Body Fat Categories ({gender === "male" ? "Men" : "Women"})</div>
            <div className="space-y-2">
              {categories.map((cat) => (
                <div key={cat.label} className={`flex items-center justify-between rounded-xl p-3 border ${result.category === cat.label ? "border-indigo-300 bg-indigo-50" : "border-gray-100 bg-white"}`}>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${cat.color}`} />
                    <span className="text-sm font-semibold text-gray-800">{cat.label}</span>
                  </div>
                  <span className="text-sm text-gray-500">{cat.range}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
