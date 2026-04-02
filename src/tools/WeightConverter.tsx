"use client";
import { useState, useMemo } from "react";

const units: Record<string, number> = { "Kilogram (kg)": 1, "Gram (g)": 0.001, "Milligram (mg)": 0.000001, "Metric Ton": 1000, "Pound (lb)": 0.453592, "Ounce (oz)": 0.0283495, "Stone": 6.35029, "Quintal": 100 };

export default function WeightConverter() {
  const [value, setValue] = useState("");
  const [from, setFrom] = useState("Kilogram (kg)");
  const [to, setTo] = useState("Pound (lb)");

  const result = useMemo(() => { const v = parseFloat(value); if (isNaN(v)) return null; return (v * units[from]) / units[to]; }, [value, from, to]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
        <div><label className="text-sm font-semibold text-gray-700 block mb-2">Value</label><input type="number" placeholder="Enter value" value={value} onChange={(e) => setValue(e.target.value)} className="calc-input" /></div>
        <div><label className="text-sm font-semibold text-gray-700 block mb-2">From</label><select value={from} onChange={(e) => setFrom(e.target.value)} className="calc-input">{Object.keys(units).map((u) => <option key={u}>{u}</option>)}</select></div>
        <div><label className="text-sm font-semibold text-gray-700 block mb-2">To</label><select value={to} onChange={(e) => setTo(e.target.value)} className="calc-input">{Object.keys(units).map((u) => <option key={u}>{u}</option>)}</select></div>
      </div>
      {result !== null && value && (
        <div className="result-card text-center">
          <div className="text-sm text-gray-500">{value} {from} =</div>
          <div className="text-3xl font-extrabold text-indigo-600 mt-1">{result.toLocaleString("en-IN", { maximumFractionDigits: 6 })} {to}</div>
        </div>
      )}
      {value && (
        <div><h3 className="text-sm font-semibold text-gray-700 mb-3">All Conversions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">{Object.keys(units).map((u) => { const v = parseFloat(value); if (isNaN(v)) return null; const c = (v * units[from]) / units[u]; return (<div key={u} className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100"><div className="text-xs text-gray-500">{u}</div><div className="text-sm font-bold text-gray-800">{c.toLocaleString("en-IN", { maximumFractionDigits: 4 })}</div></div>); })}</div>
        </div>
      )}
    </div>
  );
}
