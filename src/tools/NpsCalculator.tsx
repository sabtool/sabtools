"use client";
import { useState, useMemo } from "react";

export default function NpsCalculator() {
  const [monthlyContrib, setMonthlyContrib] = useState(5000);
  const [returnRate, setReturnRate] = useState(10);
  const [currentAge, setCurrentAge] = useState(25);
  const [retirementAge, setRetirementAge] = useState(60);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  const result = useMemo(() => {
    if (monthlyContrib <= 0 || returnRate <= 0 || currentAge >= retirementAge) return null;

    const years = retirementAge - currentAge;
    const months = years * 12;
    const r = returnRate / 12 / 100;

    const totalCorpus = monthlyContrib * (((Math.pow(1 + r, months) - 1) / r) * (1 + r));
    const investedAmount = monthlyContrib * months;
    const returns = totalCorpus - investedAmount;

    // At retirement: minimum 40% must buy annuity, rest is lump sum
    const annuityCorpus = totalCorpus * 0.4;
    const lumpSum = totalCorpus * 0.6;
    // Estimated monthly pension from annuity at 6% annual return
    const monthlyPension = (annuityCorpus * 6) / (12 * 100);

    return { totalCorpus, investedAmount, returns, annuityCorpus, lumpSum, monthlyPension, years };
  }, [monthlyContrib, returnRate, currentAge, retirementAge]);

  return (
    <div className="space-y-8">
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm text-emerald-800">
        <strong>NPS (National Pension System):</strong> At retirement, minimum 40% of corpus must be used to purchase annuity.
        Remaining 60% can be withdrawn as lump sum (tax-free).
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">Monthly Contribution</label>
            <span className="text-sm font-bold text-indigo-600">{fmt(monthlyContrib)}</span>
          </div>
          <input type="range" min={500} max={100000} step={500} value={monthlyContrib} onChange={(e) => setMonthlyContrib(+e.target.value)} className="w-full" />
          <div className="flex justify-between text-xs text-gray-400 mt-1"><span>₹500</span><span>₹1L</span></div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">Expected Return Rate (% p.a.)</label>
            <span className="text-sm font-bold text-indigo-600">{returnRate}%</span>
          </div>
          <input type="range" min={4} max={14} step={0.5} value={returnRate} onChange={(e) => setReturnRate(+e.target.value)} className="w-full" />
          <div className="flex justify-between text-xs text-gray-400 mt-1"><span>4%</span><span>14%</span></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">Current Age</label>
              <span className="text-sm font-bold text-indigo-600">{currentAge} yrs</span>
            </div>
            <input type="range" min={18} max={59} step={1} value={currentAge} onChange={(e) => setCurrentAge(+e.target.value)} className="w-full" />
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">Retirement Age</label>
              <span className="text-sm font-bold text-indigo-600">{retirementAge} yrs</span>
            </div>
            <input type="range" min={40} max={75} step={1} value={retirementAge} onChange={(e) => setRetirementAge(+e.target.value)} className="w-full" />
          </div>
        </div>
      </div>

      {result && (
        <div className="result-card space-y-4">
          <div className="text-center mb-2">
            <div className="text-xs font-medium text-gray-500">Total Corpus at Retirement ({result.years} years)</div>
            <div className="text-4xl font-extrabold text-indigo-600 mt-1">{fmt(result.totalCorpus)}</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Total Invested</div>
              <div className="text-xl font-extrabold text-gray-800">{fmt(result.investedAmount)}</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Total Returns</div>
              <div className="text-xl font-extrabold text-green-600">{fmt(result.returns)}</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Est. Monthly Pension</div>
              <div className="text-xl font-extrabold text-orange-600">{fmt(result.monthlyPension)}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
              <div className="text-xs font-medium text-blue-700 mb-1">Lump Sum (60%)</div>
              <div className="text-2xl font-extrabold text-blue-600">{fmt(result.lumpSum)}</div>
              <div className="text-xs text-blue-500 mt-1">Tax-free withdrawal</div>
            </div>
            <div className="bg-amber-50 rounded-xl p-4 text-center border border-amber-200">
              <div className="text-xs font-medium text-amber-700 mb-1">Annuity Purchase (40%)</div>
              <div className="text-2xl font-extrabold text-amber-600">{fmt(result.annuityCorpus)}</div>
              <div className="text-xs text-amber-500 mt-1">Used for monthly pension</div>
            </div>
          </div>

          <div>
            <div className="h-4 rounded-full bg-green-200 overflow-hidden">
              <div className="h-full rounded-full bg-indigo-500 transition-all duration-500" style={{ width: `${(result.investedAmount / result.totalCorpus) * 100}%` }} />
            </div>
            <div className="flex justify-between text-xs font-medium text-gray-500 mt-2">
              <span>Invested ({((result.investedAmount / result.totalCorpus) * 100).toFixed(1)}%)</span>
              <span>Returns ({((result.returns / result.totalCorpus) * 100).toFixed(1)}%)</span>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
        <div className="flex items-start gap-2">
          <span className="text-lg">{"\u2139\uFE0F"}</span>
          <div>
            <p className="font-semibold mb-1">Disclaimer</p>
            <p>NPS returns are market-linked. Rate shown is an assumption for illustration. Actual returns may vary. Check pfrda.org.in</p>
          </div>
        </div>
      </div>
    </div>
  );
}
