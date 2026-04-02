"use client";
import { useState, useMemo } from "react";

export default function SimpleInterestCalculator() {
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(8);
  const [years, setYears] = useState(5);

  const result = useMemo(() => {
    const interest = (principal * rate * years) / 100;
    const amount = principal + interest;
    return { interest, amount };
  }, [principal, rate, years]);

  const fmt = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="space-y-6">
      <div className="space-y-5">
        <div>
          <div className="flex justify-between mb-2"><label className="text-sm font-semibold text-gray-700">Principal Amount</label><span className="text-sm font-bold text-indigo-600">{fmt(principal)}</span></div>
          <input type="range" min={1000} max={10000000} step={1000} value={principal} onChange={(e) => setPrincipal(+e.target.value)} className="w-full" />
        </div>
        <div>
          <div className="flex justify-between mb-2"><label className="text-sm font-semibold text-gray-700">Rate of Interest (% p.a.)</label><span className="text-sm font-bold text-indigo-600">{rate}%</span></div>
          <input type="range" min={1} max={25} step={0.1} value={rate} onChange={(e) => setRate(+e.target.value)} className="w-full" />
        </div>
        <div>
          <div className="flex justify-between mb-2"><label className="text-sm font-semibold text-gray-700">Time Period (Years)</label><span className="text-sm font-bold text-indigo-600">{years} yrs</span></div>
          <input type="range" min={1} max={30} step={1} value={years} onChange={(e) => setYears(+e.target.value)} className="w-full" />
        </div>
      </div>
      <div className="result-card">
        <div className="bg-gray-50 rounded-xl p-4 mb-4 text-sm text-gray-600 font-mono text-center">
          SI = (P × R × T) / 100 = ({principal.toLocaleString("en-IN")} × {rate} × {years}) / 100
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm"><div className="text-xs font-medium text-gray-500 mb-1">Principal</div><div className="text-2xl font-extrabold text-gray-800">{fmt(principal)}</div></div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm"><div className="text-xs font-medium text-gray-500 mb-1">Simple Interest</div><div className="text-2xl font-extrabold text-green-600">{fmt(result.interest)}</div></div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm"><div className="text-xs font-medium text-gray-500 mb-1">Total Amount</div><div className="text-2xl font-extrabold text-indigo-600">{fmt(result.amount)}</div></div>
        </div>
      </div>
    </div>
  );
}
