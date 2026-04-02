"use client";
import { useState, useMemo } from "react";

export default function EmiVsRentCalculator() {
  const [propertyPrice, setPropertyPrice] = useState(5000000);
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [loanRate, setLoanRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);
  const [currentRent, setCurrentRent] = useState(15000);
  const [rentIncrease, setRentIncrease] = useState(5);
  const [registrationPct, setRegistrationPct] = useState(7);

  const result = useMemo(() => {
    const downPayment = (propertyPrice * downPaymentPct) / 100;
    const loanAmount = propertyPrice - downPayment;
    const registration = (propertyPrice * registrationPct) / 100;
    const r = loanRate / 12 / 100;
    const n = tenure * 12;

    // EMI calculation
    let emi = 0;
    if (r > 0 && n > 0 && loanAmount > 0) {
      emi = (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }
    const totalEmiPaid = emi * n;
    const totalBuyingCost = totalEmiPaid + downPayment + registration;

    // Rent over same period with annual increase
    let totalRent = 0;
    let rent = currentRent;
    const monthlyRents: number[] = [];
    for (let year = 0; year < tenure; year++) {
      for (let m = 0; m < 12; m++) {
        totalRent += rent;
        monthlyRents.push(rent);
      }
      rent = rent * (1 + rentIncrease / 100);
    }

    // Break-even year: when cumulative rent > cumulative buying cost up to that point
    let cumBuy = downPayment + registration;
    let cumRent = 0;
    let breakEvenYear = -1;
    let rentM = currentRent;
    for (let year = 0; year < tenure; year++) {
      for (let m = 0; m < 12; m++) {
        cumBuy += emi;
        cumRent += rentM;
      }
      rentM = rentM * (1 + rentIncrease / 100);
      if (cumRent >= cumBuy && breakEvenYear === -1) {
        breakEvenYear = year + 1;
      }
    }

    // Yearly comparison for chart
    const yearlyComparison: { year: number; cumBuy: number; cumRent: number }[] = [];
    let cb = downPayment + registration;
    let cr = 0;
    let rm = currentRent;
    for (let y = 0; y < tenure; y++) {
      for (let m = 0; m < 12; m++) { cb += emi; cr += rm; }
      rm = rm * (1 + rentIncrease / 100);
      yearlyComparison.push({ year: y + 1, cumBuy: cb, cumRent: cr });
    }

    const recommendation = totalRent > totalBuyingCost
      ? "Buying is more cost-effective over this period."
      : "Renting is more cost-effective over this period.";

    return { downPayment, loanAmount, registration, emi, totalEmiPaid, totalBuyingCost, totalRent, breakEvenYear, yearlyComparison, recommendation, lastMonthRent: monthlyRents[monthlyRents.length - 1] || currentRent };
  }, [propertyPrice, downPaymentPct, loanRate, tenure, currentRent, rentIncrease, registrationPct]);

  const fmt = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  const maxVal = Math.max(result.totalBuyingCost, result.totalRent);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">Property Price</label>
          <input className="calc-input" type="number" min={100000} step={100000} value={propertyPrice} onChange={(e) => setPropertyPrice(+e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">Down Payment (%)</label>
          <input className="calc-input" type="number" min={0} max={100} value={downPaymentPct} onChange={(e) => setDownPaymentPct(+e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">Loan Interest Rate (%)</label>
          <input className="calc-input" type="number" min={1} max={20} step={0.1} value={loanRate} onChange={(e) => setLoanRate(+e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">Loan Tenure (Years)</label>
          <input className="calc-input" type="number" min={1} max={30} value={tenure} onChange={(e) => setTenure(+e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">Current Monthly Rent</label>
          <input className="calc-input" type="number" min={0} step={500} value={currentRent} onChange={(e) => setCurrentRent(+e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">Annual Rent Increase (%)</label>
          <input className="calc-input" type="number" min={0} max={20} step={0.5} value={rentIncrease} onChange={(e) => setRentIncrease(+e.target.value)} />
        </div>
      </div>

      {/* Key Numbers */}
      <div className="result-card">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-xs text-gray-500">Monthly EMI</div>
            <div className="text-xl font-extrabold text-indigo-600">{fmt(result.emi)}</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-xs text-gray-500">Down Payment</div>
            <div className="text-xl font-extrabold text-gray-800">{fmt(result.downPayment)}</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-xs text-gray-500">Registration & Stamp</div>
            <div className="text-xl font-extrabold text-orange-500">{fmt(result.registration)}</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-xs text-gray-500">Rent in Year {tenure}</div>
            <div className="text-xl font-extrabold text-purple-600">{fmt(result.lastMonthRent)}/mo</div>
          </div>
        </div>
      </div>

      {/* Total Comparison */}
      <div className="result-card">
        <div className="text-sm font-semibold text-gray-700 mb-4">Total Cost over {tenure} Years</div>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium text-blue-700">Buying (EMI + Down + Registration)</span>
              <span className="font-bold text-blue-700">{fmt(result.totalBuyingCost)}</span>
            </div>
            <div className="w-full h-6 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-400 rounded-full" style={{ width: `${(result.totalBuyingCost / maxVal) * 100}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium text-orange-700">Renting (Total Rent Paid)</span>
              <span className="font-bold text-orange-700">{fmt(result.totalRent)}</span>
            </div>
            <div className="w-full h-6 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-orange-400 rounded-full" style={{ width: `${(result.totalRent / maxVal) * 100}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Break Even */}
      <div className="result-card text-center">
        <div className="text-xs text-gray-500 mb-1">Break-even Year</div>
        <div className="text-3xl font-extrabold text-indigo-600">
          {result.breakEvenYear > 0 ? `Year ${result.breakEvenYear}` : "Rent stays cheaper for entire tenure"}
        </div>
        <div className="text-sm text-gray-600 mt-2 font-medium">{result.recommendation}</div>
      </div>

      {/* Year-by-year */}
      <div className="result-card">
        <div className="text-sm font-semibold text-gray-700 mb-3">Year-wise Comparison</div>
        <div className="overflow-x-auto max-h-[300px]">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-white">
              <tr className="border-b border-gray-200">
                <th className="text-left p-2 text-gray-600">Year</th>
                <th className="text-right p-2 text-blue-600">Cum. Buying Cost</th>
                <th className="text-right p-2 text-orange-600">Cum. Rent Paid</th>
                <th className="text-right p-2 text-gray-600">Difference</th>
              </tr>
            </thead>
            <tbody>
              {result.yearlyComparison.map((row) => {
                const diff = row.cumRent - row.cumBuy;
                return (
                  <tr key={row.year} className="border-b border-gray-100">
                    <td className="p-2 font-medium">{row.year}</td>
                    <td className="p-2 text-right text-blue-600">{fmt(row.cumBuy)}</td>
                    <td className="p-2 text-right text-orange-600">{fmt(row.cumRent)}</td>
                    <td className={`p-2 text-right font-bold ${diff > 0 ? "text-green-600" : "text-red-500"}`}>
                      {diff > 0 ? "+" : ""}{fmt(diff)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
