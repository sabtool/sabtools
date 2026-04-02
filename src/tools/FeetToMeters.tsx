"use client";
import { useState, useMemo } from "react";

export default function FeetToMeters() {
  const [mode, setMode] = useState<"ftToM" | "mToFt">("ftToM");
  const [feet, setFeet] = useState("");
  const [inches, setInches] = useState("");
  const [meters, setMeters] = useState("");
  const [cm, setCm] = useState("");

  const result = useMemo(() => {
    if (mode === "ftToM") {
      const ft = parseFloat(feet) || 0;
      const inc = parseFloat(inches) || 0;
      if (ft === 0 && inc === 0 && !feet && !inches) return null;
      const totalInches = ft * 12 + inc;
      const totalCm = totalInches * 2.54;
      const totalM = totalCm / 100;
      return {
        meters: totalM,
        cm: totalCm,
        feet: ft,
        inches: inc,
        totalInches,
      };
    } else {
      const m = parseFloat(meters) || 0;
      const c = parseFloat(cm) || 0;
      if (m === 0 && c === 0 && !meters && !cm) return null;
      const totalCm = m * 100 + c;
      const totalInches = totalCm / 2.54;
      const ft = Math.floor(totalInches / 12);
      const remainInches = totalInches % 12;
      return {
        meters: m + c / 100,
        cm: totalCm,
        feet: ft,
        inches: remainInches,
        totalInches,
      };
    }
  }, [mode, feet, inches, meters, cm]);

  const fmt = (n: number, d = 2) => n.toLocaleString("en-IN", { maximumFractionDigits: d });

  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        <button onClick={() => setMode("ftToM")} className={mode === "ftToM" ? "btn-primary" : "btn-secondary"}>
          Feet/Inches to Meters
        </button>
        <button onClick={() => setMode("mToFt")} className={mode === "mToFt" ? "btn-primary" : "btn-secondary"}>
          Meters to Feet/Inches
        </button>
      </div>

      {mode === "ftToM" ? (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">Feet</label>
            <input type="number" placeholder="0" value={feet} onChange={(e) => setFeet(e.target.value)} className="calc-input" min="0" />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">Inches</label>
            <input type="number" placeholder="0" value={inches} onChange={(e) => setInches(e.target.value)} className="calc-input" min="0" step="any" />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">Meters</label>
            <input type="number" placeholder="0" value={meters} onChange={(e) => setMeters(e.target.value)} className="calc-input" min="0" step="any" />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">Centimeters</label>
            <input type="number" placeholder="0" value={cm} onChange={(e) => setCm(e.target.value)} className="calc-input" min="0" step="any" />
          </div>
        </div>
      )}

      {result && (
        <div className="result-card">
          <div className="grid grid-cols-2 gap-6 text-center">
            <div>
              <div className="text-xs text-gray-500">Feet & Inches</div>
              <div className="text-2xl font-bold text-gray-800">
                {fmt(result.feet, 0)}&#39; {fmt(result.inches, 1)}&quot;
              </div>
              <div className="text-xs text-gray-400">{fmt(result.totalInches, 2)} total inches</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Meters & CM</div>
              <div className="text-2xl font-bold text-indigo-600">
                {fmt(result.meters, 4)} m
              </div>
              <div className="text-xs text-gray-400">{fmt(result.cm, 2)} cm</div>
            </div>
          </div>
        </div>
      )}

      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Common Conversions (Indian Real Estate)</h3>
        <div className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-100">
                <th className="p-2 text-left text-gray-600">Feet</th>
                <th className="p-2 text-right text-gray-600">Meters</th>
                <th className="p-2 text-right text-gray-600">CM</th>
              </tr>
            </thead>
            <tbody>
              {[1, 3, 5, 6, 8, 10, 12, 15, 20, 25, 30, 40, 50, 60, 100].map((ft) => (
                <tr key={ft} className="border-b border-gray-100 last:border-0">
                  <td className="p-2 font-medium text-gray-800">{ft} ft</td>
                  <td className="p-2 text-right text-indigo-600">{fmt(ft * 0.3048, 3)} m</td>
                  <td className="p-2 text-right text-gray-600">{fmt(ft * 30.48, 1)} cm</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
