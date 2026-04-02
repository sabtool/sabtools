"use client";
import { useState, useMemo } from "react";

const fmt = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

export default function SwpCalculator() {
  const [corpus, setCorpus] = useState(5000000);
  const [withdrawal, setWithdrawal] = useState(30000);
  const [returnRate, setReturnRate] = useState(10);

  const result = useMemo(() => {
    if (corpus <= 0 || withdrawal <= 0 || returnRate <= 0) return null;

    const monthlyRate = returnRate / 12 / 100;
    let balance = corpus;
    const schedule: { month: number; withdrawn: number; growth: number; balance: number }[] = [];
    let totalWithdrawn = 0;

    for (let m = 1; m <= 600; m++) {
      const growth = balance * monthlyRate;
      balance = balance + growth - withdrawal;
      totalWithdrawn += withdrawal;

      if (m <= 12 || m % 12 === 0 || balance <= 0) {
        schedule.push({ month: m, withdrawn: totalWithdrawn, growth, balance: Math.max(0, balance) });
      }

      if (balance <= 0) {
        return { months: m, years: Math.floor(m / 12), remainingMonths: m % 12, totalWithdrawn, finalBalance: 0, schedule };
      }
    }

    return { months: 600, years: 50, remainingMonths: 0, totalWithdrawn, finalBalance: balance, schedule };
  }, [corpus, withdrawal, returnRate]);

  return (
    <div className="space-y-8">
      {/* Inputs */}
      <div className="space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">Total Corpus</label>
            <span className="text-sm font-bold text-indigo-600">{fmt(corpus)}</span>
          </div>
          <input type="range" min={100000} max={50000000} step={100000} value={corpus} onChange={(e) => setCorpus(+e.target.value)} className="w-full" />
          <div className="flex justify-between text-xs text-gray-400 mt-1"><span>1L</span><span>5Cr</span></div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">Monthly Withdrawal</label>
            <span className="text-sm font-bold text-indigo-600">{fmt(withdrawal)}</span>
          </div>
          <input type="range" min={1000} max={500000} step={1000} value={withdrawal} onChange={(e) => setWithdrawal(+e.target.value)} className="w-full" />
          <div className="flex justify-between text-xs text-gray-400 mt-1"><span>1K</span><span>5L</span></div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">Expected Return Rate (% p.a.)</label>
            <span className="text-sm font-bold text-indigo-600">{returnRate}%</span>
          </div>
          <input type="range" min={1} max={20} step={0.5} value={returnRate} onChange={(e) => setReturnRate(+e.target.value)} className="w-full" />
          <div className="flex justify-between text-xs text-gray-400 mt-1"><span>1%</span><span>20%</span></div>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-6">
          <div className="result-card">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <div className="text-xs font-medium text-gray-500 mb-1">Corpus Lasts For</div>
                <div className="text-2xl font-extrabold text-indigo-600">
                  {result.months >= 600 ? "50+ Years" : `${result.years}Y ${result.remainingMonths}M`}
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <div className="text-xs font-medium text-gray-500 mb-1">Total Withdrawn</div>
                <div className="text-2xl font-extrabold text-green-600">{fmt(result.totalWithdrawn)}</div>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <div className="text-xs font-medium text-gray-500 mb-1">Final Balance</div>
                <div className="text-2xl font-extrabold text-gray-800">{fmt(result.finalBalance)}</div>
              </div>
            </div>
          </div>

          {/* Sustainability indicator */}
          <div className="result-card">
            <div className="text-center">
              {withdrawal <= corpus * (returnRate / 100 / 12) ? (
                <div className="bg-green-100 text-green-700 p-4 rounded-xl">
                  <div className="text-lg font-bold">Sustainable Withdrawal</div>
                  <div className="text-sm mt-1">Your monthly withdrawal ({fmt(withdrawal)}) is less than monthly returns ({fmt(corpus * returnRate / 100 / 12)}). Your corpus will keep growing!</div>
                </div>
              ) : (
                <div className="bg-amber-100 text-amber-700 p-4 rounded-xl">
                  <div className="text-lg font-bold">Corpus Will Deplete</div>
                  <div className="text-sm mt-1">Sustainable withdrawal at {returnRate}% return: {fmt(corpus * returnRate / 100 / 12)}/month</div>
                </div>
              )}
            </div>
          </div>

          {/* Monthly Schedule */}
          <div className="result-card overflow-x-auto">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Withdrawal Schedule</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-3 font-semibold text-gray-600">Month</th>
                  <th className="text-right p-3 font-semibold text-gray-600">Growth</th>
                  <th className="text-right p-3 font-semibold text-gray-600">Total Withdrawn</th>
                  <th className="text-right p-3 font-semibold text-gray-600">Balance</th>
                </tr>
              </thead>
              <tbody>
                {result.schedule.map((row) => (
                  <tr key={row.month} className="border-t">
                    <td className="p-3 font-semibold">{row.month <= 12 ? `Month ${row.month}` : `Year ${Math.ceil(row.month / 12)}`}</td>
                    <td className="p-3 text-right text-green-600">{fmt(row.growth)}</td>
                    <td className="p-3 text-right text-indigo-600">{fmt(row.withdrawn)}</td>
                    <td className="p-3 text-right font-bold">{fmt(row.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
