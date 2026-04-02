"use client";
import { useState, useMemo } from "react";

export default function RentVsBuyCalculator() {
  const [propertyPrice, setPropertyPrice] = useState("5000000");
  const [downPayment, setDownPayment] = useState("1000000");
  const [loanRate, setLoanRate] = useState("8.5");
  const [tenure, setTenure] = useState("20");
  const [monthlyRent, setMonthlyRent] = useState("15000");
  const [rentIncrease, setRentIncrease] = useState("5");

  const fmt = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  const result = useMemo(() => {
    const price = parseFloat(propertyPrice) || 0;
    const dp = parseFloat(downPayment) || 0;
    const rate = (parseFloat(loanRate) || 0) / 12 / 100;
    const months = (parseFloat(tenure) || 0) * 12;
    const rent = parseFloat(monthlyRent) || 0;
    const rentInc = (parseFloat(rentIncrease) || 0) / 100;
    const yrs = parseFloat(tenure) || 0;

    if (price <= 0 || months <= 0) return null;

    const loanAmount = price - dp;
    let emi = 0;
    if (rate > 0 && loanAmount > 0) {
      emi = (loanAmount * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);
    }
    const totalEmi = emi * months;
    const totalBuying = dp + totalEmi;

    let totalRent = 0;
    let currentRent = rent;
    for (let y = 0; y < yrs; y++) {
      totalRent += currentRent * 12;
      currentRent = currentRent * (1 + rentInc);
    }

    const savings = totalBuying - totalRent;
    const betterOption = savings > 0 ? "Renting" : "Buying";

    return { emi, totalBuying, totalRent, loanAmount, savings: Math.abs(savings), betterOption, finalYearRent: currentRent };
  }, [propertyPrice, downPayment, loanRate, tenure, monthlyRent, rentIncrease]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Property Price</label>
          <input type="number" value={propertyPrice} onChange={(e) => setPropertyPrice(e.target.value)} className="calc-input" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Down Payment</label>
          <input type="number" value={downPayment} onChange={(e) => setDownPayment(e.target.value)} className="calc-input" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Loan Interest Rate (% p.a.)</label>
          <input type="number" step={0.1} value={loanRate} onChange={(e) => setLoanRate(e.target.value)} className="calc-input" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Period (Years)</label>
          <input type="number" value={tenure} onChange={(e) => setTenure(e.target.value)} className="calc-input" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Monthly Rent</label>
          <input type="number" value={monthlyRent} onChange={(e) => setMonthlyRent(e.target.value)} className="calc-input" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Annual Rent Increase (%)</label>
          <input type="number" step={0.5} value={rentIncrease} onChange={(e) => setRentIncrease(e.target.value)} className="calc-input" />
        </div>
      </div>

      {result && (
        <div className="result-card space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="text-sm font-semibold text-gray-600 mb-2">Total Cost of Buying</div>
              <div className="text-2xl font-extrabold text-indigo-600">{fmt(result.totalBuying)}</div>
              <div className="text-xs text-gray-400 mt-1">EMI: {fmt(result.emi)}/month | Loan: {fmt(result.loanAmount)}</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="text-sm font-semibold text-gray-600 mb-2">Total Cost of Renting</div>
              <div className="text-2xl font-extrabold text-orange-600">{fmt(result.totalRent)}</div>
              <div className="text-xs text-gray-400 mt-1">Final year rent: {fmt(result.finalYearRent)}/month</div>
            </div>
          </div>

          <div className={`rounded-xl p-4 text-center ${result.betterOption === "Buying" ? "bg-green-50" : "bg-blue-50"}`}>
            <div className="text-sm font-medium text-gray-600">
              {result.betterOption} is cheaper by
            </div>
            <div className={`text-3xl font-extrabold ${result.betterOption === "Buying" ? "text-green-600" : "text-blue-600"}`}>
              {fmt(result.savings)}
            </div>
            <div className="text-xs text-gray-500 mt-1">over {tenure} years (excluding property appreciation)</div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-gray-500 mb-2">
              <span>Buying: {fmt(result.totalBuying)}</span>
              <span>Renting: {fmt(result.totalRent)}</span>
            </div>
            <div className="flex h-6 rounded-full overflow-hidden">
              <div className="bg-indigo-500 transition-all duration-500" style={{ width: `${(result.totalBuying / (result.totalBuying + result.totalRent)) * 100}%` }} />
              <div className="bg-orange-400 transition-all duration-500" style={{ width: `${(result.totalRent / (result.totalBuying + result.totalRent)) * 100}%` }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
