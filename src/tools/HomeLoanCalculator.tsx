"use client";
import { useState, useMemo } from "react";

export default function HomeLoanCalculator() {
  const [propertyPrice, setPropertyPrice] = useState(5000000);
  const [downPct, setDownPct] = useState(20);
  const [rate, setRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  const result = useMemo(() => {
    const downPayment = (propertyPrice * downPct) / 100;
    const loanAmount = propertyPrice - downPayment;
    if (loanAmount <= 0 || rate <= 0 || tenure <= 0) return null;
    const r = rate / 12 / 100;
    const n = tenure * 12;
    const emi = (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - loanAmount;

    // Year-wise breakdown
    const yearWise: { year: number; principal: number; interest: number; balance: number }[] = [];
    let balance = loanAmount;
    for (let y = 1; y <= tenure; y++) {
      let yPrin = 0;
      let yInt = 0;
      for (let m = 0; m < 12; m++) {
        const intPart = balance * r;
        const prinPart = emi - intPart;
        yPrin += prinPart;
        yInt += intPart;
        balance -= prinPart;
      }
      yearWise.push({ year: y, principal: yPrin, interest: yInt, balance: Math.max(0, balance) });
    }

    return { loanAmount, downPayment, emi, totalPayment, totalInterest, yearWise };
  }, [propertyPrice, downPct, rate, tenure]);

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">Property Price</label>
            <span className="text-sm font-bold text-indigo-600">{fmt(propertyPrice)}</span>
          </div>
          <input type="range" min={500000} max={100000000} step={100000} value={propertyPrice} onChange={(e) => setPropertyPrice(+e.target.value)} className="w-full" />
          <div className="flex justify-between text-xs text-gray-400 mt-1"><span>₹5L</span><span>₹10Cr</span></div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">Down Payment (%)</label>
            <span className="text-sm font-bold text-indigo-600">{downPct}% ({fmt((propertyPrice * downPct) / 100)})</span>
          </div>
          <input type="range" min={5} max={80} step={1} value={downPct} onChange={(e) => setDownPct(+e.target.value)} className="w-full" />
          <div className="flex justify-between text-xs text-gray-400 mt-1"><span>5%</span><span>80%</span></div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">Interest Rate (% p.a.)</label>
            <span className="text-sm font-bold text-indigo-600">{rate}%</span>
          </div>
          <input type="range" min={5} max={15} step={0.1} value={rate} onChange={(e) => setRate(+e.target.value)} className="w-full" />
          <div className="flex justify-between text-xs text-gray-400 mt-1"><span>5%</span><span>15%</span></div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">Loan Tenure (Years)</label>
            <span className="text-sm font-bold text-indigo-600">{tenure} yrs</span>
          </div>
          <input type="range" min={5} max={30} step={1} value={tenure} onChange={(e) => setTenure(+e.target.value)} className="w-full" />
          <div className="flex justify-between text-xs text-gray-400 mt-1"><span>5 yrs</span><span>30 yrs</span></div>
        </div>
      </div>

      {result && (
        <div className="result-card space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Loan Amount</div>
              <div className="text-xl font-extrabold text-gray-800">{fmt(result.loanAmount)}</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Monthly EMI</div>
              <div className="text-xl font-extrabold text-indigo-600">{fmt(result.emi)}</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Total Interest</div>
              <div className="text-xl font-extrabold text-red-500">{fmt(result.totalInterest)}</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Total Payment</div>
              <div className="text-xl font-extrabold text-green-600">{fmt(result.totalPayment)}</div>
            </div>
          </div>

          {/* Visual bar */}
          <div>
            <div className="h-5 rounded-full bg-red-200 overflow-hidden">
              <div className="h-full rounded-full bg-indigo-500 transition-all duration-500" style={{ width: `${(result.loanAmount / result.totalPayment) * 100}%` }} />
            </div>
            <div className="flex justify-between text-xs font-medium text-gray-500 mt-2">
              <span>Principal ({((result.loanAmount / result.totalPayment) * 100).toFixed(1)}%)</span>
              <span>Interest ({((result.totalInterest / result.totalPayment) * 100).toFixed(1)}%)</span>
            </div>
          </div>

          {/* Year-wise breakdown */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Year-wise Principal vs Interest Breakdown</h3>
            <div className="overflow-x-auto max-h-64 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 sticky top-0">
                  <tr>
                    <th className="px-3 py-2 text-left">Year</th>
                    <th className="px-3 py-2 text-right">Principal</th>
                    <th className="px-3 py-2 text-right">Interest</th>
                    <th className="px-3 py-2 text-right">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {result.yearWise.map((row) => (
                    <tr key={row.year} className="border-b border-gray-100">
                      <td className="px-3 py-2">{row.year}</td>
                      <td className="px-3 py-2 text-right text-green-600">{fmt(row.principal)}</td>
                      <td className="px-3 py-2 text-right text-red-500">{fmt(row.interest)}</td>
                      <td className="px-3 py-2 text-right">{fmt(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
