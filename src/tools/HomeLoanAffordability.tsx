"use client";
import { useState, useMemo } from "react";

export default function HomeLoanAffordability() {
  const [monthlyIncome, setMonthlyIncome] = useState("80000");
  const [existingEmis, setExistingEmis] = useState("5000");
  const [interestRate, setInterestRate] = useState("8.5");
  const [tenure, setTenure] = useState("20");

  const fmt = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  const result = useMemo(() => {
    const income = parseFloat(monthlyIncome) || 0;
    const existing = parseFloat(existingEmis) || 0;
    const rate = (parseFloat(interestRate) || 0) / 12 / 100;
    const months = (parseFloat(tenure) || 0) * 12;

    if (income <= 0 || rate <= 0 || months <= 0) return null;

    const maxEmiAllowed = income * 0.4 - existing;
    if (maxEmiAllowed <= 0) return null;

    const maxLoan = maxEmiAllowed * (Math.pow(1 + rate, months) - 1) / (rate * Math.pow(1 + rate, months));
    const totalPayment = maxEmiAllowed * months;
    const totalInterest = totalPayment - maxLoan;
    const emiToIncome = ((maxEmiAllowed + existing) / income) * 100;

    return { maxLoan, maxEmiAllowed, totalPayment, totalInterest, emiToIncome };
  }, [monthlyIncome, existingEmis, interestRate, tenure]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Monthly Income</label>
          <input type="number" value={monthlyIncome} onChange={(e) => setMonthlyIncome(e.target.value)} className="calc-input" placeholder="0" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Existing EMIs (monthly)</label>
          <input type="number" value={existingEmis} onChange={(e) => setExistingEmis(e.target.value)} className="calc-input" placeholder="0" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Interest Rate (% p.a.)</label>
          <input type="number" step={0.1} value={interestRate} onChange={(e) => setInterestRate(e.target.value)} className="calc-input" placeholder="8.5" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Loan Tenure (Years)</label>
          <input type="number" value={tenure} onChange={(e) => setTenure(e.target.value)} className="calc-input" placeholder="20" />
        </div>
      </div>

      <div className="bg-blue-50 rounded-xl p-3 text-sm text-blue-700">
        Based on 40% EMI-to-Income ratio (standard banking guideline for home loan eligibility in India).
      </div>

      {result && (
        <div className="result-card space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Maximum Loan Amount</div>
              <div className="text-3xl font-extrabold text-indigo-600">{fmt(result.maxLoan)}</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Maximum EMI Affordable</div>
              <div className="text-2xl font-extrabold text-green-600">{fmt(result.maxEmiAllowed)}</div>
              <div className="text-xs text-gray-400">per month</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Total Interest Payable</div>
              <div className="text-2xl font-extrabold text-red-500">{fmt(result.totalInterest)}</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">EMI-to-Income Ratio</div>
              <div className="text-2xl font-extrabold text-gray-800">{result.emiToIncome.toFixed(1)}%</div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-gray-500 mb-2">
              <span>Principal ({fmt(result.maxLoan)})</span>
              <span>Interest ({fmt(result.totalInterest)})</span>
            </div>
            <div className="h-4 rounded-full bg-red-200 overflow-hidden">
              <div className="h-full rounded-full bg-indigo-500 transition-all duration-500" style={{ width: `${(result.maxLoan / result.totalPayment) * 100}%` }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
