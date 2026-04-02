"use client";
import { useState, useMemo } from "react";

const units: Record<string, number> = { Byte: 1, "KB": 1024, "MB": 1048576, "GB": 1073741824, "TB": 1099511627776, "PB": 1125899906842624, Bit: 0.125, Kilobit: 128, Megabit: 131072 };

export default function DataStorageConverter() {
  const [value, setValue] = useState("");
  const [from, setFrom] = useState("GB");
  const [to, setTo] = useState("MB");

  const result = useMemo(() => { const v = parseFloat(value); if (isNaN(v)) return null; return (v * units[from]) / units[to]; }, [value, from, to]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
        <div><label className="text-sm font-semibold text-gray-700 block mb-2">Value</label><input type="number" placeholder="Enter value" value={value} onChange={(e) => setValue(e.target.value)} className="calc-input" /></div>
        <div><label className="text-sm font-semibold text-gray-700 block mb-2">From</label><select value={from} onChange={(e) => setFrom(e.target.value)} className="calc-input">{Object.keys(units).map((u) => <option key={u}>{u}</option>)}</select></div>
        <div><label className="text-sm font-semibold text-gray-700 block mb-2">To</label><select value={to} onChange={(e) => setTo(e.target.value)} className="calc-input">{Object.keys(units).map((u) => <option key={u}>{u}</option>)}</select></div>
      </div>
      {result !== null && value && <div className="result-card text-center"><div className="text-sm text-gray-500">{value} {from} =</div><div className="text-3xl font-extrabold text-indigo-600 mt-1">{result.toLocaleString("en-IN", { maximumFractionDigits: 6 })} {to}</div></div>}
      {value && <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">{Object.keys(units).map((u) => { const v = parseFloat(value); if (isNaN(v)) return null; return (<div key={u} className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100"><div className="text-xs text-gray-500">{u}</div><div className="text-sm font-bold text-gray-800">{((v * units[from]) / units[u]).toLocaleString("en-IN", { maximumFractionDigits: 4 })}</div></div>); })}</div>}
    </div>
  );
}
