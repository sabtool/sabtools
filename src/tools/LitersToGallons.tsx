"use client";
import { useState, useMemo } from "react";

const US_GALLON = 3.78541;
const IMP_GALLON = 4.54609;

export default function LitersToGallons() {
  const [mode, setMode] = useState<"lToG" | "gToL">("lToG");
  const [value, setValue] = useState("");

  const result = useMemo(() => {
    const v = parseFloat(value);
    if (isNaN(v) || v < 0) return null;
    if (mode === "lToG") {
      return {
        liters: v,
        usGallons: v / US_GALLON,
        impGallons: v / IMP_GALLON,
        ml: v * 1000,
        usOz: v * 33.814,
      };
    } else {
      return {
        liters: v * US_GALLON,
        usGallons: v,
        impGallons: (v * US_GALLON) / IMP_GALLON,
        ml: v * US_GALLON * 1000,
        usOz: v * 128,
      };
    }
  }, [value, mode]);

  const fmt = (n: number, d = 4) => n.toLocaleString("en-IN", { maximumFractionDigits: d });

  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        <button onClick={() => setMode("lToG")} className={mode === "lToG" ? "btn-primary" : "btn-secondary"}>
          Liters to Gallons
        </button>
        <button onClick={() => setMode("gToL")} className={mode === "gToL" ? "btn-primary" : "btn-secondary"}>
          Gallons to Liters
        </button>
      </div>

      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">
          {mode === "lToG" ? "Liters" : "US Gallons"}
        </label>
        <input
          type="number"
          placeholder={mode === "lToG" ? "Enter liters" : "Enter US gallons"}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="calc-input"
          min="0"
          step="any"
        />
      </div>

      {result && value && (
        <div className="result-card">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-xs text-gray-500">Liters</div>
              <div className="text-lg font-bold text-gray-800">{fmt(result.liters, 3)} L</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">US Gallons</div>
              <div className="text-lg font-bold text-indigo-600">{fmt(result.usGallons)} gal</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Imperial Gallons</div>
              <div className="text-lg font-bold text-indigo-600">{fmt(result.impGallons)} gal</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Milliliters</div>
              <div className="text-lg font-bold text-gray-800">{fmt(result.ml, 1)} mL</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">US Fluid Ounces</div>
              <div className="text-lg font-bold text-gray-800">{fmt(result.usOz, 2)} fl oz</div>
            </div>
          </div>
        </div>
      )}

      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Reference Table</h3>
        <div className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-100">
                <th className="p-2 text-left text-gray-600">Liters</th>
                <th className="p-2 text-right text-gray-600">US Gallons</th>
                <th className="p-2 text-right text-gray-600">Imp. Gallons</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5, 10, 15, 20, 25, 50, 100].map((l) => (
                <tr key={l} className="border-b border-gray-100 last:border-0">
                  <td className="p-2 font-medium text-gray-800">{l} L</td>
                  <td className="p-2 text-right text-indigo-600">{fmt(l / US_GALLON, 3)} gal</td>
                  <td className="p-2 text-right text-gray-600">{fmt(l / IMP_GALLON, 3)} gal</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
