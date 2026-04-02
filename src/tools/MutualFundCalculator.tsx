"use client";
import { useState, useMemo } from "react";

export default function MutualFundCalculator() {
  const [investType, setInvestType] = useState<"sip" | "lumpsum">("sip");
  const [amount, setAmount] = useState(10000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  const result = useMemo(() => {
    if (amount <= 0 || rate <= 0 || years <= 0) return null;
    const r = rate / 100;
    const monthlyRate = r / 12;
    const months = years * 12;

    let totalValue: number;
    let invested: number;

    if (investType === "sip") {
      totalValue = amount * (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
      invested = amount * months;
    } else {
      totalValue = amount * Math.pow(1 + r, years);
      invested = amount;
    }

    const returns = totalValue - invested;
    return { invested, returns, totalValue };
  }, [investType, amount, rate, years]);

  return (
    <div className="space-y-8">
      {/* SIP / Lumpsum Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setInvestType("sip")}
          className={investType === "sip" ? "btn-primary" : "btn-secondary"}
        >
          SIP (Monthly)
        </button>
        <button
          onClick={() => setInvestType("lumpsum")}
          className={investType === "lumpsum" ? "btn-primary" : "btn-secondary"}
        >
          Lumpsum (One-time)
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">
              {investType === "sip" ? "Monthly Investment" : "One-time Investment"}
            </label>
            <span className="text-sm font-bold text-indigo-600">{fmt(amount)}</span>
          </div>
          <input
            type="range"
            min={investType === "sip" ? 500 : 5000}
            max={investType === "sip" ? 500000 : 10000000}
            step={investType === "sip" ? 500 : 5000}
            value={amount}
            onChange={(e) => setAmount(+e.target.value)}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>{investType === "sip" ? "₹500" : "₹5,000"}</span>
            <span>{investType === "sip" ? "₹5L" : "₹1Cr"}</span>
          </div>
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
              <div className="text-2xl font-extrabold text-green-600">{fmt(result.returns)}</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Total Value</div>
              <div className="text-2xl font-extrabold text-indigo-600">{fmt(result.totalValue)}</div>
            </div>
          </div>

          {/* Visual breakdown bar */}
          <div>
            <div className="h-5 rounded-full bg-green-200 overflow-hidden">
              <div
                className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                style={{ width: `${(result.invested / result.totalValue) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-xs font-medium text-gray-500 mt-2">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-indigo-500 inline-block" /> Invested ({((result.invested / result.totalValue) * 100).toFixed(1)}%)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-green-300 inline-block" /> Returns ({((result.returns / result.totalValue) * 100).toFixed(1)}%)
              </span>
            </div>
          </div>

          <p className="text-sm text-gray-500">
            {investType === "sip"
              ? `Investing ${fmt(amount)} every month for ${years} years at ${rate}% expected return.`
              : `Investing ${fmt(amount)} once for ${years} years at ${rate}% expected return.`}
          </p>
        </div>
      )}
    </div>
  );
}
