"use client";
import { useState, useMemo } from "react";

const LOAN_TYPES = [
  { type: "Home Loan", maxTenure: 30, rate: 8.5, maxMultiplier: 60, icon: "🏠" },
  { type: "Personal Loan", maxTenure: 5, rate: 12, maxMultiplier: 25, icon: "💰" },
  { type: "Car Loan", maxTenure: 7, rate: 9, maxMultiplier: 20, icon: "🚗" },
  { type: "Education Loan", maxTenure: 15, rate: 9.5, maxMultiplier: 40, icon: "🎓" },
];

const fmt = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

function calcEMI(p: number, r: number, n: number) {
  const monthlyRate = r / 12 / 100;
  if (monthlyRate === 0) return p / n;
  return (p * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
}

function maxLoanForEMI(maxEmi: number, r: number, n: number) {
  const monthlyRate = r / 12 / 100;
  if (monthlyRate === 0) return maxEmi * n;
  return maxEmi * (Math.pow(1 + monthlyRate, n) - 1) / (monthlyRate * Math.pow(1 + monthlyRate, n));
}

export default function LoanEligibilityCalculator() {
  const [income, setIncome] = useState(75000);
  const [existingEmi, setExistingEmi] = useState(0);
  const [loanType, setLoanType] = useState("Home Loan");

  const result = useMemo(() => {
    const loan = LOAN_TYPES.find((l) => l.type === loanType)!;
    const maxEmiAllowed = income * 0.5 - existingEmi;
    if (maxEmiAllowed <= 0) return null;

    // Calculate for 3 tenures
    const tenures = [
      Math.min(Math.ceil(loan.maxTenure * 0.4), loan.maxTenure),
      Math.min(Math.ceil(loan.maxTenure * 0.7), loan.maxTenure),
      loan.maxTenure,
    ];
    // Remove duplicates
    const uniqueTenures = [...new Set(tenures)];

    const options = uniqueTenures.map((t) => {
      const months = t * 12;
      const maxLoan = maxLoanForEMI(maxEmiAllowed, loan.rate, months);
      const emi = calcEMI(maxLoan, loan.rate, months);
      const totalPayment = emi * months;
      const totalInterest = totalPayment - maxLoan;
      return { tenure: t, maxLoan, emi, totalInterest, totalPayment };
    });

    return { loan, maxEmiAllowed, options };
  }, [income, existingEmi, loanType]);

  return (
    <div className="space-y-8">
      {/* Loan Type */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Loan Type</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {LOAN_TYPES.map((l) => (
            <button
              key={l.type}
              onClick={() => setLoanType(l.type)}
              className={`p-3 rounded-xl text-center transition-all ${loanType === l.type ? "bg-indigo-100 border-2 border-indigo-500 shadow-md" : "bg-gray-50 border border-gray-200 hover:bg-gray-100"}`}
            >
              <div className="text-2xl">{l.icon}</div>
              <div className="text-xs font-bold mt-1">{l.type}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Income */}
      <div>
        <div className="flex justify-between mb-2">
          <label className="text-sm font-semibold text-gray-700">Monthly Income (Net)</label>
          <span className="text-sm font-bold text-indigo-600">{fmt(income)}</span>
        </div>
        <input type="range" min={10000} max={1000000} step={5000} value={income} onChange={(e) => setIncome(+e.target.value)} className="w-full" />
        <div className="flex justify-between text-xs text-gray-400 mt-1"><span>10K</span><span>10L</span></div>
      </div>

      {/* Existing EMIs */}
      <div>
        <div className="flex justify-between mb-2">
          <label className="text-sm font-semibold text-gray-700">Existing Monthly EMIs</label>
          <span className="text-sm font-bold text-indigo-600">{fmt(existingEmi)}</span>
        </div>
        <input type="range" min={0} max={200000} step={1000} value={existingEmi} onChange={(e) => setExistingEmi(+e.target.value)} className="w-full" />
        <div className="flex justify-between text-xs text-gray-400 mt-1"><span>0</span><span>2L</span></div>
      </div>

      {/* Results */}
      {result ? (
        <div className="space-y-6">
          {/* Key Info */}
          <div className="result-card">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="text-xs text-blue-600 font-semibold">Max EMI Available</div>
                <div className="text-xl font-extrabold text-blue-700">{fmt(result.maxEmiAllowed)}</div>
              </div>
              <div className="bg-indigo-50 rounded-xl p-4">
                <div className="text-xs text-indigo-600 font-semibold">Interest Rate</div>
                <div className="text-xl font-extrabold text-indigo-700">{result.loan.rate}%</div>
              </div>
              <div className="bg-purple-50 rounded-xl p-4">
                <div className="text-xs text-purple-600 font-semibold">Max Tenure</div>
                <div className="text-xl font-extrabold text-purple-700">{result.loan.maxTenure} Years</div>
              </div>
            </div>
          </div>

          {/* Eligibility for different tenures */}
          <div className="result-card">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Loan Eligibility by Tenure</h3>
            <div className="space-y-4">
              {result.options.map((opt, i) => (
                <div key={opt.tenure} className={`p-4 rounded-xl border-2 ${i === result.options.length - 1 ? "border-green-300 bg-green-50" : "border-gray-200 bg-white"}`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-gray-600">{opt.tenure} Year{opt.tenure > 1 ? "s" : ""}</span>
                    {i === result.options.length - 1 && <span className="text-xs bg-green-200 text-green-700 px-2 py-0.5 rounded-full font-semibold">Max Eligible</span>}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div>
                      <div className="text-xs text-gray-500">Max Loan</div>
                      <div className="text-lg font-extrabold text-indigo-600">{fmt(opt.maxLoan)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">EMI</div>
                      <div className="text-sm font-bold text-gray-700">{fmt(opt.emi)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Total Interest</div>
                      <div className="text-sm font-bold text-red-500">{fmt(opt.totalInterest)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Total Payment</div>
                      <div className="text-sm font-bold text-gray-700">{fmt(opt.totalPayment)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rule */}
          <div className="result-card bg-amber-50 border border-amber-200">
            <p className="text-sm text-amber-700"><strong>Bank Rule:</strong> Total EMIs (existing + new) should not exceed 50% of monthly net income. Your available EMI capacity is {fmt(result.maxEmiAllowed)}/month.</p>
          </div>
        </div>
      ) : (
        <div className="result-card text-center text-red-500 font-semibold">
          Your existing EMIs exceed 50% of income. No additional loan can be approved.
        </div>
      )}
    </div>
  );
}
