"use client";
import { useState, useMemo } from "react";

export default function CagrCalculator() {
  const [mode, setMode] = useState<"calculate" | "reverse">("calculate");
  // Calculate mode
  const [initialValue, setInitialValue] = useState(100000);
  const [finalValue, setFinalValue] = useState(500000);
  const [timePeriod, setTimePeriod] = useState(5);
  // Reverse mode
  const [revInitial, setRevInitial] = useState(100000);
  const [revCagr, setRevCagr] = useState(15);
  const [revYears, setRevYears] = useState(10);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  const calcResult = useMemo(() => {
    if (mode !== "calculate") return null;
    if (initialValue <= 0 || finalValue <= 0 || timePeriod <= 0) return null;
    const cagr = (Math.pow(finalValue / initialValue, 1 / timePeriod) - 1) * 100;
    const absoluteReturn = ((finalValue - initialValue) / initialValue) * 100;
    const growthMultiple = finalValue / initialValue;
    return { cagr, absoluteReturn, growthMultiple };
  }, [mode, initialValue, finalValue, timePeriod]);

  const reverseResult = useMemo(() => {
    if (mode !== "reverse") return null;
    if (revInitial <= 0 || revCagr <= 0 || revYears <= 0) return null;
    const finalVal = revInitial * Math.pow(1 + revCagr / 100, revYears);
    const totalGain = finalVal - revInitial;
    return { finalValue: finalVal, totalGain };
  }, [mode, revInitial, revCagr, revYears]);

  return (
    <div className="space-y-8">
      <div className="flex gap-2">
        <button onClick={() => setMode("calculate")} className={mode === "calculate" ? "btn-primary" : "btn-secondary"}>
          Calculate CAGR
        </button>
        <button onClick={() => setMode("reverse")} className={mode === "reverse" ? "btn-primary" : "btn-secondary"}>
          Reverse Calculator
        </button>
      </div>

      {mode === "calculate" ? (
        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">Initial Value</label>
              <span className="text-sm font-bold text-indigo-600">{fmt(initialValue)}</span>
            </div>
            <input type="range" min={1000} max={10000000} step={1000} value={initialValue} onChange={(e) => setInitialValue(+e.target.value)} className="w-full" />
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">Final Value</label>
              <span className="text-sm font-bold text-indigo-600">{fmt(finalValue)}</span>
            </div>
            <input type="range" min={1000} max={100000000} step={1000} value={finalValue} onChange={(e) => setFinalValue(+e.target.value)} className="w-full" />
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">Time Period (Years)</label>
              <span className="text-sm font-bold text-indigo-600">{timePeriod} yrs</span>
            </div>
            <input type="range" min={1} max={30} step={1} value={timePeriod} onChange={(e) => setTimePeriod(+e.target.value)} className="w-full" />
          </div>

          {calcResult && (
            <div className="result-card space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                  <div className="text-xs font-medium text-gray-500 mb-1">CAGR</div>
                  <div className="text-3xl font-extrabold text-indigo-600">{calcResult.cagr.toFixed(2)}%</div>
                </div>
                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                  <div className="text-xs font-medium text-gray-500 mb-1">Absolute Return</div>
                  <div className="text-3xl font-extrabold text-green-600">{calcResult.absoluteReturn.toFixed(1)}%</div>
                </div>
                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                  <div className="text-xs font-medium text-gray-500 mb-1">Growth Multiple</div>
                  <div className="text-3xl font-extrabold text-purple-600">{calcResult.growthMultiple.toFixed(2)}x</div>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                Your investment grew from {fmt(initialValue)} to {fmt(finalValue)} in {timePeriod} years, achieving a CAGR of {calcResult.cagr.toFixed(2)}%.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">Initial Investment</label>
              <span className="text-sm font-bold text-indigo-600">{fmt(revInitial)}</span>
            </div>
            <input type="range" min={1000} max={10000000} step={1000} value={revInitial} onChange={(e) => setRevInitial(+e.target.value)} className="w-full" />
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">Expected CAGR (%)</label>
              <span className="text-sm font-bold text-indigo-600">{revCagr}%</span>
            </div>
            <input type="range" min={1} max={50} step={0.5} value={revCagr} onChange={(e) => setRevCagr(+e.target.value)} className="w-full" />
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">Time Period (Years)</label>
              <span className="text-sm font-bold text-indigo-600">{revYears} yrs</span>
            </div>
            <input type="range" min={1} max={30} step={1} value={revYears} onChange={(e) => setRevYears(+e.target.value)} className="w-full" />
          </div>

          {reverseResult && (
            <div className="result-card space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                  <div className="text-xs font-medium text-gray-500 mb-1">Final Value</div>
                  <div className="text-2xl font-extrabold text-indigo-600">{fmt(reverseResult.finalValue)}</div>
                </div>
                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                  <div className="text-xs font-medium text-gray-500 mb-1">Total Gain</div>
                  <div className="text-2xl font-extrabold text-green-600">{fmt(reverseResult.totalGain)}</div>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                Investing {fmt(revInitial)} at {revCagr}% CAGR for {revYears} years will grow to {fmt(reverseResult.finalValue)}.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
