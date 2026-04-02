"use client";
import { useState, useMemo } from "react";

export default function SalaryCalculator() {
  const [ctc, setCtc] = useState("");
  const [bonus, setBonus] = useState("10");
  const [pfPercent, setPfPercent] = useState("12");

  const result = useMemo(() => {
    const c = parseFloat(ctc);
    if (!c || c <= 0) return null;
    const bonusAmt = (c * parseFloat(bonus || "0")) / 100;
    const grossSalary = c - bonusAmt;
    const monthly = grossSalary / 12;
    const basic = monthly * 0.5;
    const hra = basic * 0.4;
    const pf = (basic * parseFloat(pfPercent || "12")) / 100;
    const professionalTax = 200;
    const deductions = pf + professionalTax;
    const inHand = monthly - deductions;
    return {
      monthlyCTC: c / 12,
      grossMonthly: monthly,
      basic,
      hra,
      allowances: monthly - basic - hra,
      pf,
      professionalTax,
      inHand,
      yearlyInHand: inHand * 12,
    };
  }, [ctc, bonus, pfPercent]);

  const fmt = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Annual CTC (₹)</label>
          <input type="number" placeholder="e.g. 1200000" value={ctc} onChange={(e) => setCtc(e.target.value)} className="calc-input" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Bonus (%)</label>
          <input type="number" placeholder="10" value={bonus} onChange={(e) => setBonus(e.target.value)} className="calc-input" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">PF (%)</label>
          <input type="number" placeholder="12" value={pfPercent} onChange={(e) => setPfPercent(e.target.value)} className="calc-input" />
        </div>
      </div>
      {result && (
        <div className="space-y-4">
          <div className="result-card text-center">
            <div className="text-sm text-gray-500">Monthly In-Hand Salary</div>
            <div className="text-4xl font-extrabold text-indigo-600 mt-1">{fmt(result.inHand)}</div>
            <div className="text-sm text-gray-400 mt-1">Yearly: {fmt(result.yearlyInHand)}</div>
          </div>
          <div className="table-responsive">
            <table>
              <thead><tr><th>Component</th><th className="text-right">Monthly</th><th className="text-right">Yearly</th></tr></thead>
              <tbody>
                <tr><td>Basic Salary</td><td className="text-right">{fmt(result.basic)}</td><td className="text-right">{fmt(result.basic * 12)}</td></tr>
                <tr><td>HRA</td><td className="text-right">{fmt(result.hra)}</td><td className="text-right">{fmt(result.hra * 12)}</td></tr>
                <tr><td>Other Allowances</td><td className="text-right">{fmt(result.allowances)}</td><td className="text-right">{fmt(result.allowances * 12)}</td></tr>
                <tr className="font-semibold bg-gray-50"><td>Gross Salary</td><td className="text-right">{fmt(result.grossMonthly)}</td><td className="text-right">{fmt(result.grossMonthly * 12)}</td></tr>
                <tr className="text-red-600"><td>(-) PF Deduction</td><td className="text-right">{fmt(result.pf)}</td><td className="text-right">{fmt(result.pf * 12)}</td></tr>
                <tr className="text-red-600"><td>(-) Professional Tax</td><td className="text-right">{fmt(result.professionalTax)}</td><td className="text-right">{fmt(result.professionalTax * 12)}</td></tr>
                <tr className="font-bold text-indigo-600 bg-indigo-50"><td>In-Hand Salary</td><td className="text-right">{fmt(result.inHand)}</td><td className="text-right">{fmt(result.yearlyInHand)}</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
