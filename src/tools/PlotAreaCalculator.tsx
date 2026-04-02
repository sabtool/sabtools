"use client";
import { useState, useMemo } from "react";

const UNITS = ["feet", "meters"] as const;
type Unit = typeof UNITS[number];

export default function PlotAreaCalculator() {
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [unit, setUnit] = useState<Unit>("feet");

  const result = useMemo(() => {
    const l = parseFloat(length);
    const w = parseFloat(width);
    if (!l || !w || l <= 0 || w <= 0) return null;

    const area = l * w; // in input unit squared

    let sqFt: number, sqM: number;
    if (unit === "feet") {
      sqFt = area;
      sqM = area * 0.092903;
    } else {
      sqM = area;
      sqFt = area * 10.7639;
    }

    const sqYards = sqFt / 9;
    const acres = sqFt / 43560;
    const hectares = sqM / 10000;
    const bigha = acres * 1.6; // approximate, varies by state (using Rajasthan/UP)
    const guntha = sqFt / 1089;
    const cents = sqFt / 435.6;

    const conversions = [
      { label: "Square Feet", value: sqFt, suffix: "sq ft" },
      { label: "Square Meters", value: sqM, suffix: "sq m" },
      { label: "Square Yards", value: sqYards, suffix: "sq yd" },
      { label: "Acres", value: acres, suffix: "acres" },
      { label: "Hectares", value: hectares, suffix: "ha" },
      { label: "Bigha (approx.)", value: bigha, suffix: "bigha" },
      { label: "Guntha", value: guntha, suffix: "guntha" },
      { label: "Cents (South India)", value: cents, suffix: "cents" },
    ];

    return { area, conversions };
  }, [length, width, unit]);

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Input Unit</label>
        <div className="flex gap-2">
          {UNITS.map((u) => (
            <button key={u} onClick={() => setUnit(u)} className={`px-6 py-2 rounded-xl text-sm font-semibold capitalize transition ${unit === u ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"}`}>{u}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Length ({unit})</label>
          <input type="number" placeholder="e.g. 40" value={length} onChange={(e) => setLength(e.target.value)} className="calc-input" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Width ({unit})</label>
          <input type="number" placeholder="e.g. 60" value={width} onChange={(e) => setWidth(e.target.value)} className="calc-input" />
        </div>
      </div>

      {result && (
        <div className="result-card space-y-4">
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-1">Plot Area</div>
            <div className="text-5xl font-extrabold text-indigo-600">
              {result.area.toLocaleString("en-IN", { maximumFractionDigits: 2 })} <span className="text-lg font-normal text-gray-400">sq {unit}</span>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <div className="text-sm font-semibold text-gray-700 mb-3">Conversion Table</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {result.conversions.map((c) => (
                <div key={c.label} className="bg-white rounded-xl p-3 border border-gray-100 text-center">
                  <div className="text-xs text-gray-400">{c.label}</div>
                  <div className="text-sm font-bold text-indigo-600">
                    {c.value < 0.01
                      ? c.value.toFixed(6)
                      : c.value < 1
                      ? c.value.toFixed(4)
                      : c.value.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                  </div>
                  <div className="text-[10px] text-gray-400">{c.suffix}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
            <div className="text-xs text-blue-700">
              <strong>Note:</strong> Bigha size varies by state in India. This uses the common North Indian bigha (~2/3 acre). Guntha is commonly used in Maharashtra and Karnataka. Cent is used in South India (mainly Kerala, Tamil Nadu).
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
