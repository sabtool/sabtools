"use client";
import { useState, useMemo } from "react";

const WORK_TYPES = [
  {
    label: "Plastering (12mm thick)",
    inputLabel: "Wall Area (sq ft)",
    placeholder: "e.g. 200",
    ratios: [
      { label: "1:3 (Rich - Ceiling)", cement: 1, sand: 3 },
      { label: "1:4 (Standard - Inner Wall)", cement: 1, sand: 4 },
      { label: "1:6 (Outer Wall)", cement: 1, sand: 6 },
    ],
    calculate: (area: number, ratioIdx: number) => {
      const thickness = 12 / 304.8; // 12mm in feet
      const wetVol = (area * 0.0929) * (12 / 1000); // in cubic meters
      const dryVol = wetVol * 1.30; // 30% bulking
      const ratios = [{ c: 1, s: 3 }, { c: 1, s: 4 }, { c: 1, s: 6 }];
      const r = ratios[ratioIdx];
      const totalParts = r.c + r.s;
      const cementVol = dryVol * (r.c / totalParts);
      const sandVol = dryVol * (r.s / totalParts);
      const cementBags = Math.ceil(cementVol / 0.035); // 1 bag = 0.035 m3
      const sandCft = sandVol * 35.3147;
      return { cementBags, sandCft: sandCft.toFixed(2), aggregate: null, volume: (area * thickness).toFixed(2) + " cu ft" };
    },
  },
  {
    label: "Brick Work",
    inputLabel: "Wall Volume (cu ft)",
    placeholder: "e.g. 100",
    ratios: [
      { label: "1:4 (Standard)", cement: 1, sand: 4 },
      { label: "1:5 (Lean)", cement: 1, sand: 5 },
      { label: "1:6 (Economy)", cement: 1, sand: 6 },
    ],
    calculate: (volume: number, ratioIdx: number) => {
      const volM3 = volume * 0.0283168;
      // Mortar is ~25% of brickwork volume
      const mortarVol = volM3 * 0.25;
      const dryMortarVol = mortarVol * 1.30;
      const ratios = [{ c: 1, s: 4 }, { c: 1, s: 5 }, { c: 1, s: 6 }];
      const r = ratios[ratioIdx];
      const totalParts = r.c + r.s;
      const cementVol = dryMortarVol * (r.c / totalParts);
      const sandVol = dryMortarVol * (r.s / totalParts);
      const cementBags = Math.ceil(cementVol / 0.035);
      const sandCft = sandVol * 35.3147;
      return { cementBags, sandCft: sandCft.toFixed(2), aggregate: null, volume: volume + " cu ft" };
    },
  },
  {
    label: "Concrete (PCC/RCC)",
    inputLabel: "Concrete Volume (cu ft)",
    placeholder: "e.g. 50",
    ratios: [
      { label: "M10 (1:3:6)", cement: 1, sand: 3, agg: 6 },
      { label: "M15 (1:2:4)", cement: 1, sand: 2, agg: 4 },
      { label: "M20 (1:1.5:3)", cement: 1, sand: 1.5, agg: 3 },
      { label: "M25 (1:1:2)", cement: 1, sand: 1, agg: 2 },
    ],
    calculate: (volume: number, ratioIdx: number) => {
      const volM3 = volume * 0.0283168;
      const dryVol = volM3 * 1.54; // 54% bulking for concrete
      const ratios = [
        { c: 1, s: 3, a: 6 },
        { c: 1, s: 2, a: 4 },
        { c: 1, s: 1.5, a: 3 },
        { c: 1, s: 1, a: 2 },
      ];
      const r = ratios[ratioIdx];
      const totalParts = r.c + r.s + r.a;
      const cementVol = dryVol * (r.c / totalParts);
      const sandVol = dryVol * (r.s / totalParts);
      const aggVol = dryVol * (r.a / totalParts);
      const cementBags = Math.ceil(cementVol / 0.035);
      const sandCft = sandVol * 35.3147;
      const aggCft = aggVol * 35.3147;
      return { cementBags, sandCft: sandCft.toFixed(2), aggregate: aggCft.toFixed(2), volume: volume + " cu ft" };
    },
  },
];

export default function CementCalculator() {
  const [workType, setWorkType] = useState(0);
  const [inputVal, setInputVal] = useState("");
  const [ratioIdx, setRatioIdx] = useState(0);

  const work = WORK_TYPES[workType];

  const result = useMemo(() => {
    const val = parseFloat(inputVal);
    if (!val || val <= 0) return null;
    return work.calculate(val, ratioIdx);
  }, [inputVal, workType, ratioIdx, work]);

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Work Type</label>
        <div className="flex flex-wrap gap-2">
          {WORK_TYPES.map((w, i) => (
            <button
              key={i}
              onClick={() => { setWorkType(i); setRatioIdx(0); }}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${workType === i ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"}`}
            >
              {w.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">{work.inputLabel}</label>
          <input type="number" placeholder={work.placeholder} value={inputVal} onChange={(e) => setInputVal(e.target.value)} className="calc-input" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Mix Ratio</label>
          <select value={ratioIdx} onChange={(e) => setRatioIdx(Number(e.target.value))} className="calc-input">
            {work.ratios.map((r, i) => <option key={i} value={i}>{r.label}</option>)}
          </select>
        </div>
      </div>

      {result && (
        <div className="result-card space-y-4">
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-1">Cement Bags Required (50 kg each)</div>
            <div className="text-5xl font-extrabold text-indigo-600">{result.cementBags}</div>
          </div>

          <div className={`border-t border-gray-100 pt-4 grid grid-cols-2 ${result.aggregate ? "sm:grid-cols-4" : "sm:grid-cols-3"} gap-3`}>
            <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
              <div className="text-xs text-gray-400">Volume</div>
              <div className="text-sm font-bold text-indigo-600">{result.volume}</div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
              <div className="text-xs text-gray-400">Cement Bags</div>
              <div className="text-lg font-bold text-green-600">{result.cementBags}</div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
              <div className="text-xs text-gray-400">Sand</div>
              <div className="text-lg font-bold text-yellow-600">{result.sandCft} cu ft</div>
            </div>
            {result.aggregate && (
              <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
                <div className="text-xs text-gray-400">Aggregate</div>
                <div className="text-lg font-bold text-orange-600">{result.aggregate} cu ft</div>
              </div>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
            <div className="text-xs text-blue-700">
              <strong>Note:</strong> 1 cement bag = 50 kg = 0.035 m&sup3;. Dry volume includes bulking factor (30% for mortar, 54% for concrete). Actual quantities may vary based on site conditions and workmanship.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
