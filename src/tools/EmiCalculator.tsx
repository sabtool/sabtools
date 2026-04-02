"use client";
import { useState, useMemo } from "react";

export default function EmiCalculator() {
  const [principal, setPrincipal] = useState(2500000);
  const [rate, setRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);

  const result = useMemo(() => {
    const p = principal;
    const r = rate / 12 / 100;
    const n = tenure * 12;
    if (p <= 0 || r <= 0 || n <= 0) return null;
    const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - p;
    return { emi, totalPayment, totalInterest };
  }, [principal, rate, tenure]);

  const fmt = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  const interestPercent = result ? (result.totalInterest / result.totalPayment) * 100 : 0;

  return (
    <div className="space-y-8">
      {/* Inputs */}
      <div className="space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">Loan Amount</label>
            <span className="text-sm font-bold text-indigo-600">{fmt(principal)}</span>
          </div>
          <input type="range" min={100000} max={50000000} step={50000} value={principal} onChange={(e) => setPrincipal(+e.target.value)} className="w-full" />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>₹1L</span><span>₹5Cr</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">Interest Rate (% p.a.)</label>
            <span className="text-sm font-bold text-indigo-600">{rate}%</span>
          </div>
          <input type="range" min={1} max={25} step={0.1} value={rate} onChange={(e) => setRate(+e.target.value)} className="w-full" />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>1%</span><span>25%</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">Loan Tenure (Years)</label>
            <span className="text-sm font-bold text-indigo-600">{tenure} yrs</span>
          </div>
          <input type="range" min={1} max={30} step={1} value={tenure} onChange={(e) => setTenure(+e.target.value)} className="w-full" />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>1 yr</span><span>30 yrs</span>
          </div>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="result-card space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Monthly EMI</div>
              <div className="text-2xl font-extrabold text-indigo-600">{fmt(result.emi)}</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Total Interest</div>
              <div className="text-2xl font-extrabold text-red-500">{fmt(result.totalInterest)}</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Total Payment</div>
              <div className="text-2xl font-extrabold text-gray-800">{fmt(result.totalPayment)}</div>
            </div>
          </div>

          {/* Visual bar */}
          <div>
            <div className="flex justify-between text-xs font-medium text-gray-500 mb-2">
              <span>Principal ({(100 - interestPercent).toFixed(1)}%)</span>
              <span>Interest ({interestPercent.toFixed(1)}%)</span>
            </div>
            <div className="h-4 rounded-full bg-red-200 overflow-hidden">
              <div
                className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                style={{ width: `${100 - interestPercent}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
