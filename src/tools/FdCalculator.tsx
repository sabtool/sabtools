"use client";
import { useState, useMemo } from "react";

export default function FdCalculator() {
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(5);
  const [compounding, setCompounding] = useState<"quarterly" | "monthly" | "yearly">("quarterly");

  const result = useMemo(() => {
    const n = compounding === "monthly" ? 12 : compounding === "quarterly" ? 4 : 1;
    const maturity = principal * Math.pow(1 + rate / (n * 100), n * years);
    const interest = maturity - principal;
    return { maturity, interest };
  }, [principal, rate, years, compounding]);

  const fmt = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="space-y-6">
      <div className="space-y-5">
        <div>
          <div className="flex justify-between mb-2"><label className="text-sm font-semibold text-gray-700">Deposit Amount</label><span className="text-sm font-bold text-indigo-600">{fmt(principal)}</span></div>
          <input type="range" min={10000} max={10000000} step={10000} value={principal} onChange={(e) => setPrincipal(+e.target.value)} className="w-full" />
        </div>
        <div>
          <div className="flex justify-between mb-2"><label className="text-sm font-semibold text-gray-700">Interest Rate (% p.a.)</label><span className="text-sm font-bold text-indigo-600">{rate}%</span></div>
          <input type="range" min={1} max={15} step={0.1} value={rate} onChange={(e) => setRate(+e.target.value)} className="w-full" />
        </div>
        <div>
          <div className="flex justify-between mb-2"><label className="text-sm font-semibold text-gray-700">Tenure (Years)</label><span className="text-sm font-bold text-indigo-600">{years} yrs</span></div>
          <input type="range" min={1} max={10} step={1} value={years} onChange={(e) => setYears(+e.target.value)} className="w-full" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Compounding</label>
          <div className="flex gap-2">
            {(["quarterly", "monthly", "yearly"] as const).map((c) => (
              <button key={c} onClick={() => setCompounding(c)} className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition ${compounding === c ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"}`}>{c}</button>
            ))}
          </div>
        </div>
      </div>
      <div className="result-card grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 text-center shadow-sm">
          <div className="text-xs font-medium text-gray-500 mb-1">Invested Amount</div>
          <div className="text-2xl font-extrabold text-gray-800">{fmt(principal)}</div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center shadow-sm">
          <div className="text-xs font-medium text-gray-500 mb-1">Interest Earned</div>
          <div className="text-2xl font-extrabold text-green-600">{fmt(result.interest)}</div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center shadow-sm">
          <div className="text-xs font-medium text-gray-500 mb-1">Maturity Amount</div>
          <div className="text-2xl font-extrabold text-indigo-600">{fmt(result.maturity)}</div>
        </div>
      </div>
    </div>
  );
}
