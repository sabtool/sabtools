"use client";
import { useState, useMemo } from "react";

export default function InflationCalculator() {
  const [currentAmount, setCurrentAmount] = useState(100000);
  const [inflationRate, setInflationRate] = useState(6);
  const [years, setYears] = useState(10);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  const result = useMemo(() => {
    if (currentAmount <= 0 || inflationRate <= 0 || years <= 0) return null;
    const r = inflationRate / 100;
    const futureValueNeeded = currentAmount * Math.pow(1 + r, years);
    const realValue = currentAmount / Math.pow(1 + r, years);
    const purchasingPowerLoss = currentAmount - realValue;
    const lossPercentage = (purchasingPowerLoss / currentAmount) * 100;

    // Year-wise breakdown
    const yearWise: { year: number; futureNeeded: number; realValue: number }[] = [];
    for (let y = 1; y <= years; y++) {
      yearWise.push({
        year: y,
        futureNeeded: currentAmount * Math.pow(1 + r, y),
        realValue: currentAmount / Math.pow(1 + r, y),
      });
    }

    return { futureValueNeeded, realValue, purchasingPowerLoss, lossPercentage, yearWise };
  }, [currentAmount, inflationRate, years]);

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">Current Amount</label>
            <span className="text-sm font-bold text-indigo-600">{fmt(currentAmount)}</span>
          </div>
          <input type="range" min={1000} max={10000000} step={1000} value={currentAmount} onChange={(e) => setCurrentAmount(+e.target.value)} className="w-full" />
          <div className="flex justify-between text-xs text-gray-400 mt-1"><span>₹1K</span><span>₹1Cr</span></div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">Inflation Rate (% p.a.)</label>
            <span className="text-sm font-bold text-indigo-600">{inflationRate}%</span>
          </div>
          <input type="range" min={1} max={15} step={0.5} value={inflationRate} onChange={(e) => setInflationRate(+e.target.value)} className="w-full" />
          <div className="flex justify-between text-xs text-gray-400 mt-1"><span>1%</span><span>15%</span></div>
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
              <div className="text-xs font-medium text-gray-500 mb-1">Future Value Needed</div>
              <div className="text-2xl font-extrabold text-indigo-600">{fmt(result.futureValueNeeded)}</div>
              <div className="text-xs text-gray-400 mt-1">To buy the same things after {years} yrs</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Purchasing Power Loss</div>
              <div className="text-2xl font-extrabold text-red-500">{fmt(result.purchasingPowerLoss)}</div>
              <div className="text-xs text-gray-400 mt-1">{result.lossPercentage.toFixed(1)}% value eroded</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Real Value of {fmt(currentAmount)}</div>
              <div className="text-2xl font-extrabold text-orange-500">{fmt(result.realValue)}</div>
              <div className="text-xs text-gray-400 mt-1">In today&apos;s purchasing power</div>
            </div>
          </div>

          {/* Visual bar */}
          <div>
            <div className="h-5 rounded-full bg-red-200 overflow-hidden">
              <div className="h-full rounded-full bg-green-500 transition-all duration-500" style={{ width: `${(result.realValue / currentAmount) * 100}%` }} />
            </div>
            <div className="flex justify-between text-xs font-medium text-gray-500 mt-2">
              <span>Retained Value ({((result.realValue / currentAmount) * 100).toFixed(1)}%)</span>
              <span>Value Lost ({result.lossPercentage.toFixed(1)}%)</span>
            </div>
          </div>

          <div className="bg-amber-50 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-amber-800 mb-2">Understanding Inflation Impact</h4>
            <ul className="text-xs text-amber-700 space-y-1 list-disc list-inside">
              <li>If something costs {fmt(currentAmount)} today, it will cost {fmt(result.futureValueNeeded)} after {years} years at {inflationRate}% inflation.</li>
              <li>Your {fmt(currentAmount)} today will only be worth {fmt(result.realValue)} in terms of purchasing power after {years} years.</li>
              <li>India&apos;s average inflation rate has historically been around 5-7% per year.</li>
              <li>To beat inflation, investments should earn returns higher than the inflation rate.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
