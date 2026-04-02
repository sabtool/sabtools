"use client";
import { useState, useMemo } from "react";

export default function CgpaToPercentage() {
  const [cgpa, setCgpa] = useState("8.5");

  const conversions = useMemo(() => {
    const val = parseFloat(cgpa);
    if (isNaN(val) || val < 0 || val > 10) return null;
    return [
      { name: "CBSE Formula (CGPA x 9.5)", formula: "CGPA x 9.5", result: val * 9.5 },
      { name: "VTU / General Formula", formula: "(CGPA - 0.75) x 10", result: (val - 0.75) * 10 },
      { name: "Direct Multiplication (x 10)", formula: "CGPA x 10", result: val * 10 },
      { name: "University Standard", formula: "(CGPA / 10) x 100", result: (val / 10) * 100 },
      { name: "AICTE Approximation", formula: "(CGPA - 0.5) x 10", result: (val - 0.5) * 10 },
    ];
  }, [cgpa]);

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Enter CGPA (out of 10)</label>
        <input type="number" min={0} max={10} step={0.01} value={cgpa} onChange={(e) => setCgpa(e.target.value)} className="calc-input" placeholder="e.g. 8.5" />
      </div>

      {conversions && (
        <div className="result-card space-y-3">
          <h3 className="text-lg font-bold text-gray-800">Percentage Conversions</h3>
          {conversions.map((c, i) => (
            <div key={i} className="bg-white rounded-xl p-4 shadow-sm flex justify-between items-center">
              <div>
                <div className="text-sm font-semibold text-gray-700">{c.name}</div>
                <div className="text-xs text-gray-400">{c.formula}</div>
              </div>
              <div className="text-2xl font-extrabold text-indigo-600">{c.result.toFixed(2)}%</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
