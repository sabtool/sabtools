"use client";
import { useState, useMemo } from "react";

export default function PercentageToCgpa() {
  const [percentage, setPercentage] = useState("85");

  const conversions = useMemo(() => {
    const val = parseFloat(percentage);
    if (isNaN(val) || val < 0 || val > 100) return null;
    return [
      { name: "CBSE Formula (% / 9.5)", formula: "Percentage / 9.5", result: val / 9.5 },
      { name: "VTU / General Formula", formula: "(Percentage / 10) + 0.75", result: val / 10 + 0.75 },
      { name: "Direct Division (/ 10)", formula: "Percentage / 10", result: val / 10 },
      { name: "University Standard", formula: "(Percentage / 100) x 10", result: (val / 100) * 10 },
      { name: "AICTE Approximation", formula: "(Percentage / 10) + 0.5", result: val / 10 + 0.5 },
    ];
  }, [percentage]);

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Enter Percentage</label>
        <input type="number" min={0} max={100} step={0.01} value={percentage} onChange={(e) => setPercentage(e.target.value)} className="calc-input" placeholder="e.g. 85" />
      </div>

      {conversions && (
        <div className="result-card space-y-3">
          <h3 className="text-lg font-bold text-gray-800">CGPA Conversions (out of 10)</h3>
          {conversions.map((c, i) => {
            const clamped = Math.min(c.result, 10);
            return (
              <div key={i} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <div className="text-sm font-semibold text-gray-700">{c.name}</div>
                    <div className="text-xs text-gray-400">{c.formula}</div>
                  </div>
                  <div className="text-2xl font-extrabold text-indigo-600">{clamped.toFixed(2)}</div>
                </div>
                <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                  <div className="h-full rounded-full bg-indigo-500 transition-all duration-300" style={{ width: `${(clamped / 10) * 100}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
