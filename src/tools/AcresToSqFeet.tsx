"use client";
import { useState, useMemo } from "react";

// All values in square meters
const units: Record<string, { factor: number; label: string }> = {
  acres: { factor: 4046.8564224, label: "Acres" },
  sqft: { factor: 0.09290304, label: "Square Feet" },
  sqm: { factor: 1, label: "Square Meters" },
  hectares: { factor: 10000, label: "Hectares" },
  bigha: { factor: 2529.2853, label: "Bigha (UP/Bihar)" },
  guntha: { factor: 101.17, label: "Guntha" },
  cent: { factor: 40.4686, label: "Cent" },
  kanal: { factor: 505.857, label: "Kanal" },
  marla: { factor: 25.2929, label: "Marla" },
};

export default function AcresToSqFeet() {
  const [value, setValue] = useState("");
  const [fromUnit, setFromUnit] = useState("acres");

  const conversions = useMemo(() => {
    const v = parseFloat(value);
    if (isNaN(v) || v < 0) return null;
    const sqMeters = v * units[fromUnit].factor;
    const result: Record<string, number> = {};
    for (const [key, { factor }] of Object.entries(units)) {
      result[key] = sqMeters / factor;
    }
    return result;
  }, [value, fromUnit]);

  const fmt = (n: number) => {
    if (n === 0) return "0";
    if (n >= 1) return n.toLocaleString("en-IN", { maximumFractionDigits: 4 });
    if (n >= 0.0001) return n.toFixed(6);
    return n.toExponential(4);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Value</label>
          <input
            type="number"
            placeholder="Enter value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="calc-input"
            min="0"
            step="any"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">From Unit</label>
          <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} className="calc-input">
            {Object.entries(units).map(([key, { label }]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {conversions && value && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">All Conversions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Object.entries(conversions).map(([key, val]) => (
              <div
                key={key}
                className={`rounded-xl p-4 text-center border ${
                  key === fromUnit
                    ? "bg-indigo-50 border-indigo-200"
                    : "bg-gray-50 border-gray-100"
                }`}
              >
                <div className="text-xs text-gray-500 font-semibold">{units[key].label}</div>
                <div className={`text-lg font-bold mt-1 ${key === fromUnit ? "text-indigo-600" : "text-gray-800"}`}>
                  {fmt(val)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Indian Land Units Reference</h3>
        <div className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-100">
                <th className="p-2 text-left text-gray-600">Unit</th>
                <th className="p-2 text-right text-gray-600">Sq Feet</th>
                <th className="p-2 text-right text-gray-600">Sq Meters</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(units).map(([key, { factor, label }]) => (
                <tr key={key} className="border-b border-gray-100 last:border-0">
                  <td className="p-2 font-medium text-gray-800">1 {label}</td>
                  <td className="p-2 text-right text-gray-600">{fmt(factor / 0.09290304)}</td>
                  <td className="p-2 text-right text-indigo-600">{fmt(factor)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
        <strong>Note:</strong> Bigha size varies by state in India. The value used here is approximately 2,529 sq. meters (common in UP/Bihar). Other states may use different measurements.
      </div>
    </div>
  );
}
