"use client";
import { useState, useMemo } from "react";

export default function SipCalculator() {
  const [monthly, setMonthly] = useState(10000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(15);

  const result = useMemo(() => {
    const p = monthly;
    const r = rate / 12 / 100;
    const n = years * 12;
    if (p <= 0 || r <= 0 || n <= 0) return null;
    const fv = p * (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
    const invested = p * n;
    const gains = fv - invested;
    return { futureValue: fv, invested, gains };
  }, [monthly, rate, years]);

  const fmt = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">Monthly Investment</label>
            <span className="text-sm font-bold text-indigo-600">{fmt(monthly)}</span>
          </div>
          <input type="range" min={500} max={500000} step={500} value={monthly} onChange={(e) => setMonthly(+e.target.value)} className="w-full" />
          <div className="flex justify-between text-xs text-gray-400 mt-1"><span>₹500</span><span>₹5L</span></div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">Expected Return Rate (% p.a.)</label>
            <span className="text-sm font-bold text-indigo-600">{rate}%</span>
          </div>
          <input type="range" min={1} max={30} step={0.5} value={rate} onChange={(e) => setRate(+e.target.value)} className="w-full" />
          <div className="flex justify-between text-xs text-gray-400 mt-1"><span>1%</span><span>30%</span></div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">Time Period (Years)</label>
            <span className="text-sm font-bold text-indigo-600">{years} yrs</span>
          </div>
          <input type="range" min={1} max={40} step={1} value={years} onChange={(e) => setYears(+e.target.value)} className="w-full" />
          <div className="flex justify-between text-xs text-gray-400 mt-1"><span>1 yr</span><span>40 yrs</span></div>
        </div>
      </div>

      {result && (
        <div className="result-card space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Invested Amount</div>
              <div className="text-2xl font-extrabold text-gray-800">{fmt(result.invested)}</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Estimated Returns</div>
              <div className="text-2xl font-extrabold text-green-600">{fmt(result.gains)}</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Total Value</div>
              <div className="text-2xl font-extrabold text-indigo-600">{fmt(result.futureValue)}</div>
            </div>
          </div>
          <div>
            <div className="h-4 rounded-full bg-green-200 overflow-hidden">
              <div className="h-full rounded-full bg-indigo-500 transition-all duration-500" style={{ width: `${(result.invested / result.futureValue) * 100}%` }} />
            </div>
            <div className="flex justify-between text-xs font-medium text-gray-500 mt-2">
              <span>Invested ({((result.invested / result.futureValue) * 100).toFixed(1)}%)</span>
              <span>Returns ({((result.gains / result.futureValue) * 100).toFixed(1)}%)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
