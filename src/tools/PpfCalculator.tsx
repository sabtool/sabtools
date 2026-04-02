"use client";
import { useState, useMemo } from "react";

export default function PpfCalculator() {
  const [yearly, setYearly] = useState(150000);
  const [rate, setRate] = useState(7.1);
  const [years, setYears] = useState(15);

  const result = useMemo(() => {
    let balance = 0;
    const r = rate / 100;
    for (let i = 0; i < years; i++) {
      balance = (balance + yearly) * (1 + r);
    }
    const invested = yearly * years;
    const interest = balance - invested;
    return { balance, invested, interest };
  }, [yearly, rate, years]);

  const fmt = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="space-y-6">
      <div className="space-y-5">
        <div>
          <div className="flex justify-between mb-2"><label className="text-sm font-semibold text-gray-700">Yearly Investment</label><span className="text-sm font-bold text-indigo-600">{fmt(yearly)}</span></div>
          <input type="range" min={500} max={150000} step={500} value={yearly} onChange={(e) => setYearly(+e.target.value)} className="w-full" />
          <div className="flex justify-between text-xs text-gray-400 mt-1"><span>₹500</span><span>₹1.5L (max)</span></div>
        </div>
        <div>
          <div className="flex justify-between mb-2"><label className="text-sm font-semibold text-gray-700">Interest Rate (% p.a.)</label><span className="text-sm font-bold text-indigo-600">{rate}%</span></div>
          <input type="range" min={5} max={10} step={0.1} value={rate} onChange={(e) => setRate(+e.target.value)} className="w-full" />
        </div>
        <div>
          <div className="flex justify-between mb-2"><label className="text-sm font-semibold text-gray-700">Time Period (Years)</label><span className="text-sm font-bold text-indigo-600">{years} yrs</span></div>
          <input type="range" min={15} max={50} step={5} value={years} onChange={(e) => setYears(+e.target.value)} className="w-full" />
          <div className="text-xs text-gray-400 mt-1">Min 15 years, extendable in blocks of 5</div>
        </div>
      </div>
      <div className="result-card grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 text-center shadow-sm"><div className="text-xs font-medium text-gray-500 mb-1">Invested</div><div className="text-2xl font-extrabold text-gray-800">{fmt(result.invested)}</div></div>
        <div className="bg-white rounded-xl p-4 text-center shadow-sm"><div className="text-xs font-medium text-gray-500 mb-1">Interest</div><div className="text-2xl font-extrabold text-green-600">{fmt(result.interest)}</div></div>
        <div className="bg-white rounded-xl p-4 text-center shadow-sm"><div className="text-xs font-medium text-gray-500 mb-1">Maturity</div><div className="text-2xl font-extrabold text-indigo-600">{fmt(result.balance)}</div></div>
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
        <div className="flex items-start gap-2">
          <span className="text-lg">{"\u2139\uFE0F"}</span>
          <div>
            <p className="font-semibold mb-1">Disclaimer</p>
            <p>PPF rate: 7.1% (Q4 FY 2025-26). Revised quarterly by GOI. Check nsiindia.gov.in for latest.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
