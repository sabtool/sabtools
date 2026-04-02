"use client";
import { useState, useMemo } from "react";

export default function EducationLoanCalculator() {
  const [loanAmount, setLoanAmount] = useState(1000000);
  const [rate, setRate] = useState(9);
  const [moratorium, setMoratorium] = useState(4);
  const [repayTenure, setRepayTenure] = useState(10);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  const result = useMemo(() => {
    if (loanAmount <= 0 || rate <= 0 || repayTenure <= 0) return null;
    const r = rate / 100;
    const monthlyRate = r / 12;

    // Interest accrued during moratorium (simple interest on outstanding)
    const interestDuringMoratorium = loanAmount * r * moratorium;
    const principalAfterMoratorium = loanAmount + interestDuringMoratorium;

    // EMI on total amount after moratorium
    const n = repayTenure * 12;
    const emi = (principalAfterMoratorium * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
    const totalRepayment = emi * n;
    const totalInterestDuringRepay = totalRepayment - principalAfterMoratorium;
    const totalCost = totalRepayment;
    const totalInterestPaid = interestDuringMoratorium + totalInterestDuringRepay;

    return { interestDuringMoratorium, principalAfterMoratorium, emi, totalRepayment, totalCost, totalInterestPaid };
  }, [loanAmount, rate, moratorium, repayTenure]);

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">Loan Amount</label>
            <span className="text-sm font-bold text-indigo-600">{fmt(loanAmount)}</span>
          </div>
          <input type="range" min={50000} max={5000000} step={50000} value={loanAmount} onChange={(e) => setLoanAmount(+e.target.value)} className="w-full" />
          <div className="flex justify-between text-xs text-gray-400 mt-1"><span>₹50K</span><span>₹50L</span></div>
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
            <label className="text-sm font-semibold text-gray-700">Moratorium Period (Years during study)</label>
            <span className="text-sm font-bold text-indigo-600">{moratorium} yrs</span>
          </div>
          <input type="range" min={0} max={7} step={1} value={moratorium} onChange={(e) => setMoratorium(+e.target.value)} className="w-full" />
          <div className="flex justify-between text-xs text-gray-400 mt-1"><span>0 yrs</span><span>7 yrs</span></div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">Repayment Tenure (Years after moratorium)</label>
            <span className="text-sm font-bold text-indigo-600">{repayTenure} yrs</span>
          </div>
          <input type="range" min={1} max={15} step={1} value={repayTenure} onChange={(e) => setRepayTenure(+e.target.value)} className="w-full" />
          <div className="flex justify-between text-xs text-gray-400 mt-1"><span>1 yr</span><span>15 yrs</span></div>
        </div>
      </div>

      {result && (
        <div className="result-card space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">EMI After Moratorium</div>
              <div className="text-2xl font-extrabold text-indigo-600">{fmt(result.emi)}</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Interest During Moratorium</div>
              <div className="text-2xl font-extrabold text-orange-500">{fmt(result.interestDuringMoratorium)}</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Total Cost</div>
              <div className="text-2xl font-extrabold text-red-500">{fmt(result.totalCost)}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Outstanding After Moratorium</div>
              <div className="text-lg font-extrabold text-gray-800">{fmt(result.principalAfterMoratorium)}</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Total Interest Paid</div>
              <div className="text-lg font-extrabold text-red-500">{fmt(result.totalInterestPaid)}</div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-blue-800 mb-2">How Education Loan Moratorium Works</h4>
            <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
              <li>During the moratorium period (course duration + 6-12 months), you do not pay any EMI.</li>
              <li>However, interest keeps accruing on the loan during this period.</li>
              <li>The accrued interest is added to the principal, increasing your total outstanding amount.</li>
              <li>After the moratorium ends, EMI repayment starts on the new (higher) outstanding amount.</li>
              <li>Some banks offer the option to pay interest-only during the moratorium, which reduces total cost significantly.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
