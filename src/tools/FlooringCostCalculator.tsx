"use client";
import { useState, useMemo } from "react";

const FLOORING_TYPES = [
  { label: "Ceramic Tile (2x2 ft)", rate: 45, unitArea: 4, unitLabel: "tile" },
  { label: "Vitrified Tile (2x2 ft)", rate: 65, unitArea: 4, unitLabel: "tile" },
  { label: "Marble", rate: 120, unitArea: 1, unitLabel: "sq ft" },
  { label: "Granite", rate: 150, unitArea: 1, unitLabel: "sq ft" },
  { label: "Wooden (Plank 4x0.5 ft)", rate: 180, unitArea: 2, unitLabel: "plank" },
  { label: "Vinyl (Plank 4x0.5 ft)", rate: 60, unitArea: 2, unitLabel: "plank" },
  { label: "Laminate (Plank 4x0.67 ft)", rate: 90, unitArea: 2.68, unitLabel: "plank" },
];

const WASTAGE_OPTIONS = [
  { label: "5%", value: 0.05 },
  { label: "10%", value: 0.10 },
  { label: "15%", value: 0.15 },
];

export default function FlooringCostCalculator() {
  const [inputMode, setInputMode] = useState<"dims" | "area">("dims");
  const [roomL, setRoomL] = useState("");
  const [roomW, setRoomW] = useState("");
  const [directArea, setDirectArea] = useState("");
  const [floorType, setFloorType] = useState(0);
  const [customRate, setCustomRate] = useState("");
  const [laborRate, setLaborRate] = useState("15");
  const [wastage, setWastage] = useState(1);

  const result = useMemo(() => {
    let area: number;
    if (inputMode === "dims") {
      const l = parseFloat(roomL);
      const w = parseFloat(roomW);
      if (!l || !w || l <= 0 || w <= 0) return null;
      area = l * w;
    } else {
      area = parseFloat(directArea);
      if (!area || area <= 0) return null;
    }

    const ft = FLOORING_TYPES[floorType];
    const rate = parseFloat(customRate) || ft.rate;
    const labor = parseFloat(laborRate) || 0;
    const wf = WASTAGE_OPTIONS[wastage].value;

    const areaWithWastage = area * (1 + wf);
    const unitsNeeded = Math.ceil(areaWithWastage / ft.unitArea);
    const materialCost = areaWithWastage * rate;
    const laborCost = area * labor;
    const totalCost = materialCost + laborCost;

    return {
      area: area.toFixed(1),
      areaWithWastage: areaWithWastage.toFixed(1),
      unitsNeeded,
      unitLabel: ft.unitLabel,
      materialCost,
      laborCost,
      totalCost,
      rateUsed: rate,
    };
  }, [inputMode, roomL, roomW, directArea, floorType, customRate, laborRate, wastage]);

  const fmtCur = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        <button onClick={() => setInputMode("dims")} className={inputMode === "dims" ? "btn-primary" : "btn-secondary"}>Length x Width</button>
        <button onClick={() => setInputMode("area")} className={inputMode === "area" ? "btn-primary" : "btn-secondary"}>Direct Sq Ft</button>
      </div>

      {inputMode === "dims" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">Room Length (ft)</label>
            <input type="number" placeholder="e.g. 15" value={roomL} onChange={(e) => setRoomL(e.target.value)} className="calc-input" />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">Room Width (ft)</label>
            <input type="number" placeholder="e.g. 12" value={roomW} onChange={(e) => setRoomW(e.target.value)} className="calc-input" />
          </div>
        </div>
      ) : (
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Total Area (sq ft)</label>
          <input type="number" placeholder="e.g. 180" value={directArea} onChange={(e) => setDirectArea(e.target.value)} className="calc-input" />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Flooring Type</label>
          <select value={floorType} onChange={(e) => setFloorType(Number(e.target.value))} className="calc-input">
            {FLOORING_TYPES.map((f, i) => <option key={i} value={i}>{f.label} - ~{f.rate}/sqft</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Wastage Factor</label>
          <select value={wastage} onChange={(e) => setWastage(Number(e.target.value))} className="calc-input">
            {WASTAGE_OPTIONS.map((w, i) => <option key={i} value={i}>{w.label}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Custom Rate / sq ft (optional)</label>
          <input type="number" placeholder={`Default: ${FLOORING_TYPES[floorType].rate}`} value={customRate} onChange={(e) => setCustomRate(e.target.value)} className="calc-input" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Labor Rate / sq ft</label>
          <input type="number" placeholder="15" value={laborRate} onChange={(e) => setLaborRate(e.target.value)} className="calc-input" />
        </div>
      </div>

      {result && (
        <div className="result-card space-y-4">
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-1">Total Estimated Cost</div>
            <div className="text-5xl font-extrabold text-indigo-600">{fmtCur(result.totalCost)}</div>
          </div>

          <div className="border-t border-gray-100 pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
              <div className="text-xs text-gray-400">Room Area</div>
              <div className="text-lg font-bold text-indigo-600">{result.area} sq ft</div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
              <div className="text-xs text-gray-400">With Wastage</div>
              <div className="text-lg font-bold text-yellow-600">{result.areaWithWastage} sq ft</div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
              <div className="text-xs text-gray-400">{result.unitLabel}s Needed</div>
              <div className="text-lg font-bold text-green-600">{result.unitsNeeded.toLocaleString("en-IN")}</div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
              <div className="text-xs text-gray-400">Rate Used</div>
              <div className="text-lg font-bold text-gray-600">{fmtCur(result.rateUsed)}/sqft</div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4 grid grid-cols-2 gap-3">
            <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
              <div className="text-xs text-gray-400">Material Cost</div>
              <div className="text-lg font-bold text-blue-600">{fmtCur(result.materialCost)}</div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
              <div className="text-xs text-gray-400">Labor Cost</div>
              <div className="text-lg font-bold text-orange-600">{fmtCur(result.laborCost)}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
