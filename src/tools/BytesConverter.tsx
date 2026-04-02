"use client";
import { useState, useMemo } from "react";

const units: Record<string, number> = {
  Bytes: 1,
  KB: 1024,
  MB: 1024 ** 2,
  GB: 1024 ** 3,
  TB: 1024 ** 4,
  PB: 1024 ** 5,
};

export default function BytesConverter() {
  const [value, setValue] = useState("");
  const [unit, setUnit] = useState("MB");

  const conversions = useMemo(() => {
    const v = parseFloat(value);
    if (isNaN(v) || v < 0) return null;
    const bytes = v * units[unit];
    const result: Record<string, number> = {};
    for (const [u, factor] of Object.entries(units)) {
      result[u] = bytes / factor;
    }
    return result;
  }, [value, unit]);

  const formatNum = (n: number) => {
    if (n === 0) return "0";
    if (n >= 1) return n.toLocaleString("en-IN", { maximumFractionDigits: 2 });
    if (n >= 0.001) return n.toFixed(6);
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
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Unit</label>
          <select value={unit} onChange={(e) => setUnit(e.target.value)} className="calc-input">
            {Object.keys(units).map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </div>
      </div>

      {conversions && value && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Conversions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Object.entries(conversions).map(([u, val]) => (
              <div
                key={u}
                className={`rounded-xl p-4 text-center border ${
                  u === unit
                    ? "bg-indigo-50 border-indigo-200"
                    : "bg-gray-50 border-gray-100"
                }`}
              >
                <div className="text-xs text-gray-500 font-semibold">{u}</div>
                <div className={`text-lg font-bold ${u === unit ? "text-indigo-600" : "text-gray-800"}`}>
                  {formatNum(val)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Reference</h3>
        <div className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-100">
                <th className="p-2 text-left text-gray-600">Unit</th>
                <th className="p-2 text-right text-gray-600">Bytes</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(units).map(([u, bytes]) => (
                <tr key={u} className="border-b border-gray-100 last:border-0">
                  <td className="p-2 font-medium text-gray-800">1 {u}</td>
                  <td className="p-2 text-right text-gray-600">{bytes.toLocaleString("en-IN")} Bytes</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
