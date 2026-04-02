"use client";
import { useState, useMemo } from "react";

const SHEET_W = 8; // feet
const SHEET_H = 4; // feet
const SHEET_AREA = SHEET_W * SHEET_H; // 32 sq ft
const WASTAGE = 0.10; // 10%

const SURFACES = [
  { id: "walls", label: "Walls" },
  { id: "ceiling", label: "Ceiling" },
  { id: "floor", label: "Floor" },
];

export default function PlywoodCalculator() {
  const [roomL, setRoomL] = useState("");
  const [roomW, setRoomW] = useState("");
  const [roomH, setRoomH] = useState("");
  const [surfaces, setSurfaces] = useState<string[]>(["walls"]);
  const [pricePerSheet, setPricePerSheet] = useState("1200");

  const toggleSurface = (id: string) => {
    setSurfaces((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);
  };

  const result = useMemo(() => {
    const l = parseFloat(roomL);
    const w = parseFloat(roomW);
    const h = parseFloat(roomH);
    const pps = parseFloat(pricePerSheet) || 0;
    if (!l || !w || !h || l <= 0 || w <= 0 || h <= 0 || surfaces.length === 0) return null;

    let totalArea = 0;
    if (surfaces.includes("walls")) {
      totalArea += 2 * (l + w) * h;
    }
    if (surfaces.includes("ceiling")) {
      totalArea += l * w;
    }
    if (surfaces.includes("floor")) {
      totalArea += l * w;
    }

    const areaWithWastage = totalArea * (1 + WASTAGE);
    const sheetsExact = areaWithWastage / SHEET_AREA;
    const sheetsNeeded = Math.ceil(sheetsExact);
    const totalCost = sheetsNeeded * pps;

    return {
      totalArea: totalArea.toFixed(1),
      areaWithWastage: areaWithWastage.toFixed(1),
      sheetsExact: sheetsExact.toFixed(1),
      sheetsNeeded,
      totalCost,
    };
  }, [roomL, roomW, roomH, surfaces, pricePerSheet]);

  const fmtCur = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Room Length (ft)</label>
          <input type="number" placeholder="e.g. 15" value={roomL} onChange={(e) => setRoomL(e.target.value)} className="calc-input" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Room Width (ft)</label>
          <input type="number" placeholder="e.g. 12" value={roomW} onChange={(e) => setRoomW(e.target.value)} className="calc-input" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Room Height (ft)</label>
          <input type="number" placeholder="e.g. 10" value={roomH} onChange={(e) => setRoomH(e.target.value)} className="calc-input" />
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Surfaces to Cover</label>
        <div className="flex gap-3 flex-wrap">
          {SURFACES.map((s) => (
            <button
              key={s.id}
              onClick={() => toggleSurface(s.id)}
              className={surfaces.includes(s.id) ? "btn-primary" : "btn-secondary"}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Price per Sheet (8x4 ft)</label>
        <input type="number" placeholder="1200" value={pricePerSheet} onChange={(e) => setPricePerSheet(e.target.value)} className="calc-input" />
      </div>

      {result && (
        <div className="result-card space-y-4">
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-1">Plywood Sheets Needed</div>
            <div className="text-5xl font-extrabold text-indigo-600">{result.sheetsNeeded}</div>
            <div className="text-xs text-gray-400 mt-1">Standard 8&apos; x 4&apos; sheets (incl. 10% wastage)</div>
          </div>

          <div className="border-t border-gray-100 pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
              <div className="text-xs text-gray-400">Net Area</div>
              <div className="text-lg font-bold text-indigo-600">{result.totalArea} sq ft</div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
              <div className="text-xs text-gray-400">With Wastage</div>
              <div className="text-lg font-bold text-yellow-600">{result.areaWithWastage} sq ft</div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
              <div className="text-xs text-gray-400">Sheets (exact)</div>
              <div className="text-lg font-bold text-gray-600">{result.sheetsExact}</div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
              <div className="text-xs text-gray-400">Estimated Cost</div>
              <div className="text-lg font-bold text-green-600">{fmtCur(result.totalCost)}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
