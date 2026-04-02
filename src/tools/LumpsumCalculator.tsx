"use client";
import { useState, useMemo } from "react";

export default function LumpsumCalculator() {
  const [amount, setAmount] = useState(500000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);

  const result = useMemo(() => {
    const fv = amount * Math.pow(1 + rate / 100, years);
    const gains = fv - amount;
    return { futureValue: fv, gains };
  }, [amount, rate, years]);

  const fmt = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="space-y-6">
      <div className="space-y-5">
        <div>
          <div className="flex justify-between mb-2"><label className="text-sm font-semibold text-gray-700">Investment Amount</label><span className="text-sm font-bold text-indigo-600">{fmt(amount)}</span></div>
          <input type="range" min={10000} max={10000000} step={10000} value={amount} onChange={(e) => setAmount(+e.target.value)} className="w-full" />
        </div>
        <div>
          <div className="flex justify-between mb-2"><label className="text-sm font-semibold text-gray-700">Expected Return Rate (% p.a.)</label><span className="text-sm font-bold text-indigo-600">{rate}%</span></div>
          <input type="range" min={1} max={30} step={0.5} value={rate} onChange={(e) => setRate(+e.target.value)} className="w-full" />
        </div>
        <div>
          <div className="flex justify-between mb-2"><label className="text-sm font-semibold text-gray-700">Time Period (Years)</label><span className="text-sm font-bold text-indigo-600">{years} yrs</span></div>
          <input type="range" min={1} max={30} step={1} value={years} onChange={(e) => setYears(+e.target.value)} className="w-full" />
        </div>
      </div>
      <div className="result-card grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 text-center shadow-sm"><div className="text-xs font-medium text-gray-500 mb-1">Invested</div><div className="text-2xl font-extrabold text-gray-800">{fmt(amount)}</div></div>
        <div className="bg-white rounded-xl p-4 text-center shadow-sm"><div className="text-xs font-medium text-gray-500 mb-1">Est. Returns</div><div className="text-2xl font-extrabold text-green-600">{fmt(result.gains)}</div></div>
        <div className="bg-white rounded-xl p-4 text-center shadow-sm"><div className="text-xs font-medium text-gray-500 mb-1">Total Value</div><div className="text-2xl font-extrabold text-indigo-600">{fmt(result.futureValue)}</div></div>
      </div>
    </div>
  );
}
