"use client";
import { useState, useMemo } from "react";

export default function MarginCalculator() {
  const [cost, setCost] = useState("");
  const [selling, setSelling] = useState("");

  const result = useMemo(() => {
    const c = parseFloat(cost);
    const s = parseFloat(selling);
    if (!c || !s || c <= 0 || s <= 0) return null;
    const profit = s - c;
    const margin = (profit / s) * 100;
    const markup = (profit / c) * 100;
    return { profit, margin, markup };
  }, [cost, selling]);

  const fmt = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(n);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="text-sm font-semibold text-gray-700 block mb-2">Cost Price (₹)</label><input type="number" placeholder="e.g. 800" value={cost} onChange={(e) => setCost(e.target.value)} className="calc-input" /></div>
        <div><label className="text-sm font-semibold text-gray-700 block mb-2">Selling Price (₹)</label><input type="number" placeholder="e.g. 1000" value={selling} onChange={(e) => setSelling(e.target.value)} className="calc-input" /></div>
      </div>
      {result && (
        <div className="result-card grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm"><div className="text-xs font-medium text-gray-500 mb-1">Profit</div><div className={`text-2xl font-extrabold ${result.profit >= 0 ? "text-green-600" : "text-red-600"}`}>{fmt(result.profit)}</div></div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm"><div className="text-xs font-medium text-gray-500 mb-1">Profit Margin</div><div className="text-2xl font-extrabold text-indigo-600">{result.margin.toFixed(2)}%</div></div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm"><div className="text-xs font-medium text-gray-500 mb-1">Markup</div><div className="text-2xl font-extrabold text-purple-600">{result.markup.toFixed(2)}%</div></div>
        </div>
      )}
    </div>
  );
}
