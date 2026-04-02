"use client";
import { useState, useMemo } from "react";

export default function IdealWeightCalculator() {
  const [gender, setGender] = useState<"male" | "female">("male");
  const [heightCm, setHeightCm] = useState("");
  const [currentWeight, setCurrentWeight] = useState("");

  const result = useMemo(() => {
    const h = parseFloat(heightCm);
    if (!h || h <= 0) return null;

    const inches = h / 2.54;
    const over60 = Math.max(0, inches - 60);

    let devine: number, robinson: number, miller: number, hamwi: number;

    if (gender === "male") {
      devine = 50 + 2.3 * over60;
      robinson = 52 + 1.9 * over60;
      miller = 56.2 + 1.41 * over60;
      hamwi = 48.0 + 2.7 * over60;
    } else {
      devine = 45.5 + 2.3 * over60;
      robinson = 49 + 1.7 * over60;
      miller = 53.1 + 1.36 * over60;
      hamwi = 45.5 + 2.2 * over60;
    }

    const formulas = [
      { name: "Devine (1974)", weight: devine },
      { name: "Robinson (1983)", weight: robinson },
      { name: "Miller (1983)", weight: miller },
      { name: "Hamwi (1964)", weight: hamwi },
    ];

    const allWeights = formulas.map((f) => f.weight);
    const minW = Math.min(...allWeights);
    const maxW = Math.max(...allWeights);
    const avgW = allWeights.reduce((a, b) => a + b, 0) / allWeights.length;

    const cw = parseFloat(currentWeight);
    const diff = cw && cw > 0 ? cw - avgW : null;

    return { formulas, minW, maxW, avgW, currentWeight: cw > 0 ? cw : null, diff };
  }, [gender, heightCm, currentWeight]);

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
          <label className="text-sm font-semibold text-gray-700 block mb-2">Height (cm)</label>
          <input type="number" placeholder="e.g. 170" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} className="calc-input" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Current Weight (kg, optional)</label>
          <input type="number" placeholder="e.g. 75" value={currentWeight} onChange={(e) => setCurrentWeight(e.target.value)} className="calc-input" />
        </div>
      </div>

      {result && (
        <div className="result-card space-y-4">
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-1">Ideal Weight Range</div>
            <div className="text-4xl font-extrabold text-indigo-600">
              {result.minW.toFixed(1)} - {result.maxW.toFixed(1)} <span className="text-lg font-normal text-gray-400">kg</span>
            </div>
            <div className="text-sm text-gray-500 mt-1">Average: {result.avgW.toFixed(1)} kg</div>
          </div>

          {result.diff !== null && (
            <div className={`text-center rounded-xl p-3 border ${result.diff > 5 ? "bg-yellow-50 border-yellow-200" : result.diff < -5 ? "bg-blue-50 border-blue-200" : "bg-green-50 border-green-200"}`}>
              <div className="text-sm text-gray-600">
                Your current weight ({result.currentWeight} kg) is{" "}
                <span className="font-bold">
                  {Math.abs(result.diff).toFixed(1)} kg {result.diff > 0 ? "above" : result.diff < 0 ? "below" : "at"} the average ideal weight
                </span>
              </div>
            </div>
          )}

          <div className="border-t border-gray-100 pt-4">
            <div className="text-sm font-semibold text-gray-700 mb-3">Results by Formula</div>
            <div className="space-y-2">
              {result.formulas.map((f) => (
                <div key={f.name} className="flex items-center justify-between bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
                  <div className="text-sm font-semibold text-gray-800">{f.name}</div>
                  <div className="text-lg font-bold text-indigo-600">{f.weight.toFixed(1)} <span className="text-xs font-normal text-gray-400">kg</span></div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
            <div className="text-xs text-blue-700">
              <strong>Note:</strong> These formulas provide estimates based on height and gender. Individual ideal weight depends on body composition, muscle mass, bone density, and overall health.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
