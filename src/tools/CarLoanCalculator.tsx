"use client";
import { useState, useMemo } from "react";

export default function CarLoanCalculator() {
  const [carPrice, setCarPrice] = useState(1000000);
  const [downPayment, setDownPayment] = useState(200000);
  const [rate, setRate] = useState(8.5);
  const [tenure, setTenure] = useState(5);
  const [view, setView] = useState<"monthly" | "yearly">("yearly");

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  const result = useMemo(() => {
    const loanAmount = carPrice - downPayment;
    if (loanAmount <= 0 || rate <= 0 || tenure <= 0) return null;
    const r = rate / 12 / 100;
    const n = tenure * 12;
    const emi = (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - loanAmount;

    // Build amortization schedule
    const schedule: { month: number; principal: number; interest: number; balance: number }[] = [];
    let balance = loanAmount;
    for (let i = 1; i <= n; i++) {
      const intPart = balance * r;
      const prinPart = emi - intPart;
      balance -= prinPart;
      schedule.push({ month: i, principal: prinPart, interest: intPart, balance: Math.max(0, balance) });
    }

    return { loanAmount, emi, totalPayment, totalInterest, schedule };
  }, [carPrice, downPayment, rate, tenure]);

  const yearlyData = useMemo(() => {
    if (!result) return [];
    const yearly: { year: number; principal: number; interest: number; balance: number }[] = [];
    for (let y = 1; y <= tenure; y++) {
      const months = result.schedule.filter((s) => s.month > (y - 1) * 12 && s.month <= y * 12);
      const principal = months.reduce((a, b) => a + b.principal, 0);
      const interest = months.reduce((a, b) => a + b.interest, 0);
      const balance = months[months.length - 1]?.balance ?? 0;
      yearly.push({ year: y, principal, interest, balance });
    }
    return yearly;
  }, [result, tenure]);

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">Car Price</label>
            <span className="text-sm font-bold text-indigo-600">{fmt(carPrice)}</span>
          </div>
          <input type="range" min={100000} max={10000000} step={50000} value={carPrice} onChange={(e) => setCarPrice(+e.target.value)} className="w-full" />
          <div className="flex justify-between text-xs text-gray-400 mt-1"><span>₹1L</span><span>₹1Cr</span></div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">Down Payment</label>
            <span className="text-sm font-bold text-indigo-600">{fmt(downPayment)}</span>
          </div>
          <input type="range" min={0} max={carPrice * 0.9} step={10000} value={downPayment} onChange={(e) => setDownPayment(+e.target.value)} className="w-full" />
          <div className="flex justify-between text-xs text-gray-400 mt-1"><span>₹0</span><span>{fmt(carPrice * 0.9)}</span></div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">Interest Rate (% p.a.)</label>
            <span className="text-sm font-bold text-indigo-600">{rate}%</span>
          </div>
          <input type="range" min={5} max={20} step={0.1} value={rate} onChange={(e) => setRate(+e.target.value)} className="w-full" />
          <div className="flex justify-between text-xs text-gray-400 mt-1"><span>5%</span><span>20%</span></div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">Loan Tenure (Years)</label>
            <span className="text-sm font-bold text-indigo-600">{tenure} yrs</span>
          </div>
          <input type="range" min={1} max={7} step={1} value={tenure} onChange={(e) => setTenure(+e.target.value)} className="w-full" />
          <div className="flex justify-between text-xs text-gray-400 mt-1"><span>1 yr</span><span>7 yrs</span></div>
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

          {/* Breakdown Table */}
          <div>
            <div className="flex gap-2 mb-3">
              <button onClick={() => setView("yearly")} className={view === "yearly" ? "btn-primary" : "btn-secondary"}>Yearly</button>
              <button onClick={() => setView("monthly")} className={view === "monthly" ? "btn-primary" : "btn-secondary"}>Monthly</button>
            </div>
            <div className="overflow-x-auto max-h-64 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 sticky top-0">
                  <tr>
                    <th className="px-3 py-2 text-left">{view === "yearly" ? "Year" : "Month"}</th>
                    <th className="px-3 py-2 text-right">Principal</th>
                    <th className="px-3 py-2 text-right">Interest</th>
                    <th className="px-3 py-2 text-right">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {(view === "yearly" ? yearlyData : result.schedule).map((row, i) => (
                    <tr key={i} className="border-b border-gray-100">
                      <td className="px-3 py-2">{view === "yearly" ? (row as typeof yearlyData[0]).year : (row as typeof result.schedule[0]).month}</td>
                      <td className="px-3 py-2 text-right">{fmt((row as typeof yearlyData[0]).principal)}</td>
                      <td className="px-3 py-2 text-right">{fmt((row as typeof yearlyData[0]).interest)}</td>
                      <td className="px-3 py-2 text-right">{fmt((row as typeof yearlyData[0]).balance)}</td>
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
