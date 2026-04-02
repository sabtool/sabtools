"use client";
import { useState, useMemo } from "react";

const units: Record<string, number> = { "Sq Meter": 1, "Sq Kilometer": 1000000, "Sq Feet": 0.092903, "Sq Yard": 0.836127, "Sq Inch": 0.00064516, "Acre": 4046.86, "Hectare": 10000, "Bigha": 2508.38, "Biswa": 125.419, "Gunta": 101.171 };

export default function AreaConverter() {
  const [value, setValue] = useState("");
  const [from, setFrom] = useState("Sq Feet");
  const [to, setTo] = useState("Sq Meter");

  const result = useMemo(() => { const v = parseFloat(value); if (isNaN(v)) return null; return (v * units[from]) / units[to]; }, [value, from, to]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
        <div><label className="text-sm font-semibold text-gray-700 block mb-2">Value</label><input type="number" placeholder="Enter area" value={value} onChange={(e) => setValue(e.target.value)} className="calc-input" /></div>
        <div><label className="text-sm font-semibold text-gray-700 block mb-2">From</label><select value={from} onChange={(e) => setFrom(e.target.value)} className="calc-input">{Object.keys(units).map((u) => <option key={u}>{u}</option>)}</select></div>
        <div><label className="text-sm font-semibold text-gray-700 block mb-2">To</label><select value={to} onChange={(e) => setTo(e.target.value)} className="calc-input">{Object.keys(units).map((u) => <option key={u}>{u}</option>)}</select></div>
      </div>
      {result !== null && value && <div className="result-card text-center"><div className="text-sm text-gray-500">{value} {from} =</div><div className="text-3xl font-extrabold text-indigo-600 mt-1">{result.toLocaleString("en-IN", { maximumFractionDigits: 6 })} {to}</div></div>}
      {value && <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">{Object.keys(units).map((u) => { const v = parseFloat(value); if (isNaN(v)) return null; return (<div key={u} className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100"><div className="text-xs text-gray-500">{u}</div><div className="text-sm font-bold text-gray-800">{((v * units[from]) / units[u]).toLocaleString("en-IN", { maximumFractionDigits: 4 })}</div></div>); })}</div>}
    </div>
  );
}
