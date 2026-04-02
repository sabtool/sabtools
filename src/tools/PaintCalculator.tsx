"use client";
import { useState, useMemo } from "react";

const DOOR_AREA = 7 * 3; // 7ft x 3ft = 21 sq ft
const WINDOW_AREA = 4 * 3; // 4ft x 3ft = 12 sq ft
const COVERAGE_PER_LITER = 100; // sq ft per liter for 1 coat

export default function PaintCalculator() {
  const [roomLength, setRoomLength] = useState("");
  const [roomWidth, setRoomWidth] = useState("");
  const [roomHeight, setRoomHeight] = useState("");
  const [doors, setDoors] = useState("1");
  const [windows, setWindows] = useState("2");
  const [coats, setCoats] = useState("2");
  const [paintPrice, setPaintPrice] = useState("350");

  const result = useMemo(() => {
    const l = parseFloat(roomLength);
    const w = parseFloat(roomWidth);
    const h = parseFloat(roomHeight);
    if (!l || !w || !h || l <= 0 || w <= 0 || h <= 0) return null;

    const d = parseInt(doors) || 0;
    const win = parseInt(windows) || 0;
    const c = parseInt(coats) || 2;
    const price = parseFloat(paintPrice) || 0;

    const totalWallArea = 2 * (l + w) * h;
    const ceilingArea = l * w;
    const doorArea = d * DOOR_AREA;
    const windowArea = win * WINDOW_AREA;
    const paintableWallArea = totalWallArea - doorArea - windowArea;
    const totalPaintableArea = paintableWallArea + ceilingArea;
    const paintNeeded = (totalPaintableArea * c) / COVERAGE_PER_LITER;
    const litersNeeded = Math.ceil(paintNeeded);
    const totalCost = litersNeeded * price;

    return {
      totalWallArea: totalWallArea.toFixed(1),
      ceilingArea: ceilingArea.toFixed(1),
      doorArea: doorArea.toFixed(1),
      windowArea: windowArea.toFixed(1),
      paintableWallArea: paintableWallArea.toFixed(1),
      totalPaintableArea: totalPaintableArea.toFixed(1),
      paintNeeded: paintNeeded.toFixed(1),
      litersNeeded,
      coats: c,
      totalCost,
    };
  }, [roomLength, roomWidth, roomHeight, doors, windows, coats, paintPrice]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Room Length (ft)</label>
          <input type="number" placeholder="e.g. 14" value={roomLength} onChange={(e) => setRoomLength(e.target.value)} className="calc-input" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Room Width (ft)</label>
          <input type="number" placeholder="e.g. 12" value={roomWidth} onChange={(e) => setRoomWidth(e.target.value)} className="calc-input" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Room Height (ft)</label>
          <input type="number" placeholder="e.g. 10" value={roomHeight} onChange={(e) => setRoomHeight(e.target.value)} className="calc-input" />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Doors</label>
          <input type="number" placeholder="1" value={doors} onChange={(e) => setDoors(e.target.value)} className="calc-input" min="0" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Windows</label>
          <input type="number" placeholder="2" value={windows} onChange={(e) => setWindows(e.target.value)} className="calc-input" min="0" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Coats</label>
          <input type="number" placeholder="2" value={coats} onChange={(e) => setCoats(e.target.value)} className="calc-input" min="1" max="4" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Price/Liter (Rs)</label>
          <input type="number" placeholder="350" value={paintPrice} onChange={(e) => setPaintPrice(e.target.value)} className="calc-input" />
        </div>
      </div>

      {result && (
        <div className="result-card space-y-4">
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-1">Paint Required ({result.coats} coats)</div>
            <div className="text-5xl font-extrabold text-indigo-600">{result.litersNeeded} <span className="text-lg font-normal text-gray-400">Liters</span></div>
            {result.totalCost > 0 && (
              <div className="text-lg font-bold text-green-600 mt-1">Estimated Cost: Rs {result.totalCost.toLocaleString("en-IN")}</div>
            )}
          </div>

          <div className="border-t border-gray-100 pt-4">
            <div className="text-sm font-semibold text-gray-700 mb-3">Area Breakdown</div>
            <div className="space-y-2">
              {[
                { label: "Total Wall Area", value: `${result.totalWallArea} sq ft` },
                { label: "Ceiling Area", value: `${result.ceilingArea} sq ft` },
                { label: "Door Area (deducted)", value: `- ${result.doorArea} sq ft` },
                { label: "Window Area (deducted)", value: `- ${result.windowArea} sq ft` },
                { label: "Total Paintable Area", value: `${result.totalPaintableArea} sq ft`, bold: true },
                { label: `Paint Needed (${result.coats} coats)`, value: `${result.paintNeeded} L`, bold: true },
              ].map((row) => (
                <div key={row.label} className={`flex items-center justify-between bg-white rounded-xl p-3 border border-gray-100 ${row.bold ? "shadow-sm" : ""}`}>
                  <div className={`text-sm ${row.bold ? "font-bold text-gray-800" : "text-gray-600"}`}>{row.label}</div>
                  <div className={`text-sm ${row.bold ? "font-bold text-indigo-600" : "text-gray-700"}`}>{row.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
            <div className="text-xs text-blue-700">
              <strong>Note:</strong> Standard door size: 7x3 ft, window size: 4x3 ft. Coverage assumed at ~{COVERAGE_PER_LITER} sq ft per liter per coat. Actual coverage varies by paint brand and surface condition.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
