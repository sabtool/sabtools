"use client";
import { useState, useMemo } from "react";

export default function RoiCalculator() {
  const [mode, setMode] = useState<"simple" | "annual">("simple");
  const [initialInvestment, setInitialInvestment] = useState("100000");
  const [finalValue, setFinalValue] = useState("150000");
  const [annualReturn, setAnnualReturn] = useState("12");
  const [years, setYears] = useState("5");

  const fmt = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  const result = useMemo(() => {
    const inv = parseFloat(initialInvestment) || 0;
    if (inv <= 0) return null;

    if (mode === "simple") {
      const fv = parseFloat(finalValue) || 0;
      const profit = fv - inv;
      const roi = (profit / inv) * 100;
      const y = parseFloat(years) || 1;
      const annualized = (Math.pow(fv / inv, 1 / y) - 1) * 100;
      return { profit, roi, finalValue: fv, annualizedReturn: annualized, years: y };
    } else {
      const r = (parseFloat(annualReturn) || 0) / 100;
      const y = parseFloat(years) || 1;
      const fv = inv * Math.pow(1 + r, y);
      const profit = fv - inv;
      const roi = (profit / inv) * 100;
      return { profit, roi, finalValue: fv, annualizedReturn: parseFloat(annualReturn) || 0, years: y };
    }
  }, [mode, initialInvestment, finalValue, annualReturn, years]);

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Calculation Mode</label>
        <div className="flex gap-2">
          <button onClick={() => setMode("simple")} className={mode === "simple" ? "btn-primary" : "btn-secondary"}>Simple ROI</button>
          <button onClick={() => setMode("annual")} className={mode === "annual" ? "btn-primary" : "btn-secondary"}>Annual Return</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Initial Investment</label>
          <input type="number" value={initialInvestment} onChange={(e) => setInitialInvestment(e.target.value)} className="calc-input" placeholder="0" />
        </div>

        {mode === "simple" ? (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Final Value</label>
            <input type="number" value={finalValue} onChange={(e) => setFinalValue(e.target.value)} className="calc-input" placeholder="0" />
          </div>
        ) : (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Annual Return Rate (%)</label>
            <input type="number" value={annualReturn} onChange={(e) => setAnnualReturn(e.target.value)} className="calc-input" placeholder="0" />
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Investment Period (Years)</label>
          <input type="number" value={years} onChange={(e) => setYears(e.target.value)} className="calc-input" placeholder="1" />
        </div>
      </div>

      {result && (
        <div className="result-card space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">ROI</div>
              <div className={`text-3xl font-extrabold ${result.roi >= 0 ? "text-green-600" : "text-red-600"}`}>
                {result.roi.toFixed(1)}%
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Annualized Return</div>
              <div className={`text-2xl font-extrabold ${result.annualizedReturn >= 0 ? "text-green-600" : "text-red-600"}`}>
                {result.annualizedReturn.toFixed(2)}%
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">{result.profit >= 0 ? "Total Profit" : "Total Loss"}</div>
              <div className={`text-2xl font-extrabold ${result.profit >= 0 ? "text-green-600" : "text-red-600"}`}>
                {fmt(Math.abs(result.profit))}
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Final Value</div>
              <div className="text-2xl font-extrabold text-indigo-600">{fmt(result.finalValue)}</div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-gray-500 mb-2">
              <span>Investment ({fmt(parseFloat(initialInvestment) || 0)})</span>
              <span>{result.profit >= 0 ? "Profit" : "Loss"} ({fmt(Math.abs(result.profit))})</span>
            </div>
            <div className="h-4 rounded-full bg-red-200 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${result.profit >= 0 ? "bg-indigo-500" : "bg-red-500"}`}
                style={{ width: `${Math.min(((parseFloat(initialInvestment) || 0) / result.finalValue) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
