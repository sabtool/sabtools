"use client";
import { useState, useMemo } from "react";

export default function EmiAffordabilityCalculator() {
  const [salary, setSalary] = useState("");
  const [existingEMI, setExistingEMI] = useState("");
  const [expenses, setExpenses] = useState("");

  const result = useMemo(() => {
    const s = parseFloat(salary);
    if (!s || s <= 0) return null;
    const emi = parseFloat(existingEMI) || 0;
    const exp = parseFloat(expenses) || 0;

    // 50% rule: total EMIs should not exceed 50% of salary
    const maxTotalEMI = s * 0.5;
    const maxNewEMI = Math.max(0, maxTotalEMI - emi);
    const disposableIncome = s - emi - exp;
    const safeEMI = Math.min(maxNewEMI, disposableIncome * 0.6); // conservative: 60% of disposable

    const emiToIncome = ((emi / s) * 100);
    const isOverextended = emi > maxTotalEMI;

    // Calculate max loan for different tenures and rates
    const rates = [8, 9, 10, 11, 12];
    const tenures = [1, 3, 5, 7, 10, 15, 20, 25, 30];

    const calcMaxLoan = (emiAmt: number, ratePercent: number, tenureYears: number) => {
      const r = ratePercent / 100 / 12;
      const n = tenureYears * 12;
      if (r === 0) return emiAmt * n;
      return emiAmt * (Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n));
    };

    const affordabilityTable = rates.map(rate => ({
      rate,
      loans: tenures.map(tenure => ({
        tenure,
        maxLoan: calcMaxLoan(safeEMI, rate, tenure),
      })),
    }));

    return { maxTotalEMI, maxNewEMI, safeEMI, disposableIncome, emiToIncome, isOverextended, affordabilityTable, salary: s, existingEMI: emi, expenses: exp };
  }, [salary, existingEMI, expenses]);

  const fmt = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
  const fmtL = (n: number) => {
    if (n >= 10000000) return `${(n / 10000000).toFixed(2)} Cr`;
    if (n >= 100000) return `${(n / 100000).toFixed(2)} L`;
    return fmt(n);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Monthly Salary (₹)</label>
          <input type="number" placeholder="e.g. 80000" value={salary} onChange={e => setSalary(e.target.value)} className="calc-input" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Existing EMIs (₹/month)</label>
          <input type="number" placeholder="e.g. 15000" value={existingEMI} onChange={e => setExistingEMI(e.target.value)} className="calc-input" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Monthly Expenses (₹)</label>
          <input type="number" placeholder="e.g. 30000" value={expenses} onChange={e => setExpenses(e.target.value)} className="calc-input" />
        </div>
      </div>

      {result && (
        <div className="space-y-4">
          {/* Warning */}
          {result.isOverextended && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
              <span className="font-bold">Warning:</span> Your existing EMIs ({fmt(result.existingEMI)}) already exceed 50% of your salary ({fmt(result.maxTotalEMI)}). You may be financially overextended.
            </div>
          )}

          {/* Main results */}
          <div className="result-card grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Max Affordable EMI</div>
              <div className="text-2xl font-extrabold text-indigo-600">{fmt(Math.max(0, result.safeEMI))}</div>
              <div className="text-xs text-gray-400">per month</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Disposable Income</div>
              <div className="text-xl font-bold text-green-600">{fmt(result.disposableIncome)}</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">EMI-to-Income Ratio</div>
              <div className={`text-xl font-bold ${result.emiToIncome > 50 ? "text-red-600" : result.emiToIncome > 40 ? "text-orange-600" : "text-green-600"}`}>
                {result.emiToIncome.toFixed(1)}%
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">50% Rule Limit</div>
              <div className="text-xl font-bold text-gray-700">{fmt(result.maxTotalEMI)}</div>
            </div>
          </div>

          {/* EMI Capacity Bar */}
          <div className="result-card">
            <h3 className="font-bold text-gray-800 mb-3">EMI Capacity Overview</h3>
            <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden flex">
              <div className="bg-red-400 h-8 flex items-center justify-center text-xs text-white font-semibold"
                style={{ width: `${Math.min(100, (result.existingEMI / result.salary) * 100)}%` }}>
                {result.existingEMI > 0 ? "Existing EMI" : ""}
              </div>
              <div className="bg-indigo-500 h-8 flex items-center justify-center text-xs text-white font-semibold"
                style={{ width: `${Math.min(100 - (result.existingEMI / result.salary) * 100, (Math.max(0, result.safeEMI) / result.salary) * 100)}%` }}>
                {result.safeEMI > 0 ? "Available" : ""}
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span><span>50% (Safe Limit)</span><span>100%</span>
            </div>
          </div>

          {/* Affordability table */}
          <div className="result-card">
            <h3 className="font-bold text-gray-800 mb-3">Max Loan Amount You Can Afford</h3>
            <p className="text-xs text-gray-500 mb-3">Based on max affordable EMI of {fmt(Math.max(0, result.safeEMI))}/month</p>
            {result.safeEMI > 0 ? (
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>Rate \ Tenure</th>
                      {[1, 5, 10, 15, 20, 30].map(t => <th key={t} className="text-right">{t}Y</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {result.affordabilityTable.map(row => (
                      <tr key={row.rate}>
                        <td className="font-semibold">{row.rate}%</td>
                        {[1, 5, 10, 15, 20, 30].map(t => {
                          const loan = row.loans.find(l => l.tenure === t);
                          return <td key={t} className="text-right text-sm">{loan ? fmtL(loan.maxLoan) : "-"}</td>;
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-red-600">You currently don&apos;t have capacity for additional EMIs. Consider reducing expenses or existing EMIs first.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
