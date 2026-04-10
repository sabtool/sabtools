"use client";
import { useState, useMemo } from "react";

export default function DailyInterestCalculator() {
  const [amount, setAmount] = useState("");
  const [loanDate, setLoanDate] = useState("");
  const [releaseDate, setReleaseDate] = useState(new Date().toISOString().split("T")[0]);

  const result = useMemo(() => {
    const principal = parseFloat(amount);
    if (!principal || principal <= 0 || !loanDate || !releaseDate) return null;

    const start = new Date(loanDate);
    const end = new Date(releaseDate);
    if (end <= start) return null;

    const diffMs = end.getTime() - start.getTime();
    const totalDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    const dailyRate = 1.14 / 100 / 30;
    const interest = principal * dailyRate * totalDays;
    const totalPayable = principal + interest;

    return { totalDays, interest, totalPayable, dailyRate, dailyInterest: principal * dailyRate };
  }, [amount, loanDate, releaseDate]);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(n);

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-6">
      <div className="inline-block bg-indigo-100 text-indigo-800 text-sm font-semibold px-4 py-1.5 rounded-full">
        Formula: Amount &times; 1.14% &divide; 30 &times; Total Days
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label htmlFor="loan-amount" className="text-sm font-semibold text-gray-700 block mb-2">
            Loan Amount (&#8377;)
          </label>
          <input
            id="loan-amount"
            type="number"
            placeholder="e.g. 10000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="calc-input"
            min="1"
          />
        </div>
        <div>
          <label htmlFor="loan-date" className="text-sm font-semibold text-gray-700 block mb-2">
            Date of Loan
          </label>
          <input
            id="loan-date"
            type="date"
            value={loanDate}
            onChange={(e) => setLoanDate(e.target.value)}
            className="calc-input"
            max={today}
          />
        </div>
        <div>
          <label htmlFor="release-date" className="text-sm font-semibold text-gray-700 block mb-2">
            Date of Release / Repayment
          </label>
          <input
            id="release-date"
            type="date"
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
            className="calc-input"
            min={loanDate || undefined}
          />
        </div>
      </div>

      {result && (
        <div className="space-y-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <p className="text-xs text-blue-600 font-semibold uppercase tracking-wide mb-1">Total Days</p>
              <p className="text-2xl font-extrabold text-blue-800">{result.totalDays}</p>
            </div>
            <div className="bg-red-50 rounded-xl p-4 text-center">
              <p className="text-xs text-red-600 font-semibold uppercase tracking-wide mb-1">Total Interest</p>
              <p className="text-2xl font-extrabold text-red-800">{fmt(result.interest)}</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <p className="text-xs text-green-600 font-semibold uppercase tracking-wide mb-1">Total Payable</p>
              <p className="text-2xl font-extrabold text-green-800">{fmt(result.totalPayable)}</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-4 text-center">
              <p className="text-xs text-purple-600 font-semibold uppercase tracking-wide mb-1">Per Day Interest</p>
              <p className="text-2xl font-extrabold text-purple-800">{fmt(result.dailyInterest)}</p>
            </div>
          </div>

          {/* Calculation Breakdown */}
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-bold text-gray-800 mb-3">Calculation Breakdown</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>Loan Amount</span>
                <span className="font-semibold">{fmt(parseFloat(amount))}</span>
              </div>
              <div className="flex justify-between">
                <span>Interest Rate</span>
                <span className="font-semibold">1.14% per 30 days</span>
              </div>
              <div className="flex justify-between">
                <span>Daily Rate (1.14% &divide; 30)</span>
                <span className="font-semibold">{(result.dailyRate * 100).toFixed(4)}%</span>
              </div>
              <div className="flex justify-between">
                <span>Loan Date</span>
                <span className="font-semibold">{new Date(loanDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
              </div>
              <div className="flex justify-between">
                <span>Release Date</span>
                <span className="font-semibold">{new Date(releaseDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Days</span>
                <span className="font-semibold">{result.totalDays} days</span>
              </div>
              <div className="border-t border-gray-300 pt-2 mt-2">
                <div className="flex justify-between text-gray-500">
                  <span>Formula</span>
                  <span className="font-mono text-xs">{fmt(parseFloat(amount))} &times; 1.14% &divide; 30 &times; {result.totalDays}</span>
                </div>
              </div>
              <div className="flex justify-between text-base font-bold text-indigo-700 border-t border-gray-300 pt-2">
                <span>Interest Payable</span>
                <span>{fmt(result.interest)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-green-700">
                <span>Total Amount Payable</span>
                <span>{fmt(result.totalPayable)}</span>
              </div>
            </div>
          </div>

          {/* Day-wise Table (first 30 days + last entry) */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <h3 className="text-sm font-bold text-gray-800 p-4 pb-2">Day-wise Interest Table</h3>
            <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Day</th>
                    <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Date</th>
                    <th className="text-right px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Daily Interest</th>
                    <th className="text-right px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Cumulative Interest</th>
                    <th className="text-right px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Total Payable</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: Math.min(result.totalDays, 365) }, (_, i) => {
                    const day = i + 1;
                    const date = new Date(loanDate);
                    date.setDate(date.getDate() + day);
                    const cumInterest = parseFloat(amount) * result.dailyRate * day;
                    return (
                      <tr key={day} className={day % 2 === 0 ? "bg-gray-50" : ""}>
                        <td className="px-4 py-2 font-medium">{day}</td>
                        <td className="px-4 py-2 text-gray-600">{date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</td>
                        <td className="px-4 py-2 text-right">{fmt(result.dailyInterest)}</td>
                        <td className="px-4 py-2 text-right font-medium text-red-600">{fmt(cumInterest)}</td>
                        <td className="px-4 py-2 text-right font-medium text-green-700">{fmt(parseFloat(amount) + cumInterest)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {result.totalDays > 365 && (
              <p className="text-xs text-gray-400 p-3 text-center">Showing first 365 days of {result.totalDays} total days</p>
            )}
          </div>
        </div>
      )}

      {!result && amount && loanDate && releaseDate && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800">
          Release date must be after the loan date. Please check your dates.
        </div>
      )}
    </div>
  );
}
