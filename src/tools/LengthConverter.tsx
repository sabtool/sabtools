"use client";
import { useState, useMemo } from "react";

const units: Record<string, number> = {
  "Meter (m)": 1,
  "Kilometer (km)": 1000,
  "Centimeter (cm)": 0.01,
  "Millimeter (mm)": 0.001,
  "Mile": 1609.344,
  "Yard": 0.9144,
  "Foot (ft)": 0.3048,
  "Inch (in)": 0.0254,
  "Nautical Mile": 1852,
};

export default function LengthConverter() {
  const [value, setValue] = useState("");
  const [from, setFrom] = useState("Meter (m)");
  const [to, setTo] = useState("Foot (ft)");

  const result = useMemo(() => {
    const v = parseFloat(value);
    if (isNaN(v)) return null;
    return (v * units[from]) / units[to];
  }, [value, from, to]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Value</label>
          <input type="number" placeholder="Enter value" value={value} onChange={(e) => setValue(e.target.value)} className="calc-input" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">From</label>
          <select value={from} onChange={(e) => setFrom(e.target.value)} className="calc-input">
            {Object.keys(units).map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">To</label>
          <select value={to} onChange={(e) => setTo(e.target.value)} className="calc-input">
            {Object.keys(units).map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
      </div>

      {result !== null && value && (
        <div className="result-card text-center">
          <div className="text-sm text-gray-500">{value} {from} =</div>
          <div className="text-3xl font-extrabold text-indigo-600 mt-1">{result.toLocaleString("en-IN", { maximumFractionDigits: 6 })} {to}</div>
        </div>
      )}

      {value && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">All Conversions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {Object.keys(units).map((u) => {
              const v = parseFloat(value);
              if (isNaN(v)) return null;
              const converted = (v * units[from]) / units[u];
              return (
                <div key={u} className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                  <div className="text-xs text-gray-500">{u}</div>
                  <div className="text-sm font-bold text-gray-800">{converted.toLocaleString("en-IN", { maximumFractionDigits: 4 })}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
