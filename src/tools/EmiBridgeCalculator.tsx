"use client";
import { useState, useMemo } from "react";

export default function EmiBridgeCalculator() {
  const [outstanding, setOutstanding] = useState("");
  const [currentRate, setCurrentRate] = useState("");
  const [remainingTenure, setRemainingTenure] = useState("");
  const [newRate, setNewRate] = useState("");
  const [processingFee, setProcessingFee] = useState("");

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  const calcEMI = (p: number, r: number, n: number) => {
    if (p <= 0 || r <= 0 || n <= 0) return 0;
    const monthlyRate = r / 12 / 100;
    return (p * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
  };

  const result = useMemo(() => {
    const P = parseFloat(outstanding);
    const oldR = parseFloat(currentRate);
    const tenure = parseFloat(remainingTenure);
    const newR = parseFloat(newRate);
    const fee = parseFloat(processingFee) || 0;

    if (!P || !oldR || !tenure || !newR || P <= 0 || oldR <= 0 || tenure <= 0 || newR <= 0) return null;

    const months = tenure * 12;

    // Current bank calculations
    const oldEMI = calcEMI(P, oldR, months);
    const oldTotalPayment = oldEMI * months;
    const oldTotalInterest = oldTotalPayment - P;

    // New bank calculations
    const newEMI = calcEMI(P, newR, months);
    const newTotalPayment = newEMI * months;
    const newTotalInterest = newTotalPayment - P;

    // Processing fee
    const processingAmount = fee > 0 ? (fee / 100) * P : 0;

    // Total cost comparison
    const totalCostOld = oldTotalPayment;
    const totalCostNew = newTotalPayment + processingAmount;

    const savings = totalCostOld - totalCostNew;
    const emiDifference = oldEMI - newEMI;
    const interestSaved = oldTotalInterest - newTotalInterest;
    const isWorthSwitching = savings > 0;

    // Break-even months (how many months to recover processing fee)
    const breakEvenMonths = emiDifference > 0 && processingAmount > 0
      ? Math.ceil(processingAmount / emiDifference)
      : 0;

    return {
      oldEMI, oldTotalPayment, oldTotalInterest,
      newEMI, newTotalPayment, newTotalInterest,
      processingAmount,
      totalCostOld, totalCostNew,
      savings, emiDifference, interestSaved,
      isWorthSwitching, breakEvenMonths,
      months,
    };
  }, [outstanding, currentRate, remainingTenure, newRate, processingFee]);

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Current Loan Outstanding</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">&#8377;</span>
            <input type="number" placeholder="e.g. 2500000" value={outstanding}
              onChange={(e) => setOutstanding(e.target.value)} className="calc-input pl-8" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Current Interest Rate (% p.a.)</label>
            <input type="number" step="0.1" placeholder="e.g. 9.5" value={currentRate}
              onChange={(e) => setCurrentRate(e.target.value)} className="calc-input" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Remaining Tenure (Years)</label>
            <input type="number" placeholder="e.g. 15" value={remainingTenure}
              onChange={(e) => setRemainingTenure(e.target.value)} className="calc-input" />
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="text-sm font-bold text-indigo-700 mb-3">New Bank Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">New Bank Interest Rate (% p.a.)</label>
              <input type="number" step="0.1" placeholder="e.g. 8.5" value={newRate}
                onChange={(e) => setNewRate(e.target.value)} className="calc-input" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Processing Fee (%)</label>
              <input type="number" step="0.1" placeholder="e.g. 0.5" value={processingFee}
                onChange={(e) => setProcessingFee(e.target.value)} className="calc-input" />
              <p className="text-xs text-gray-400 mt-1">Typically 0.25% - 1% of loan amount</p>
            </div>
          </div>
        </div>
      </div>

      {result && (
        <div className="space-y-6">
          {/* EMI Comparison */}
          <div className="result-card">
            <h3 className="text-lg font-bold text-gray-800 mb-4">EMI Comparison</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-red-50 rounded-xl p-4 text-center">
                <div className="text-xs font-medium text-red-600 mb-1">Current Bank EMI</div>
                <div className="text-2xl font-extrabold text-red-600">{fmt(result.oldEMI)}</div>
                <div className="text-xs text-gray-500 mt-1">@ {currentRate}% p.a.</div>
              </div>
              <div className="bg-green-50 rounded-xl p-4 text-center">
                <div className="text-xs font-medium text-green-600 mb-1">New Bank EMI</div>
                <div className="text-2xl font-extrabold text-green-600">{fmt(result.newEMI)}</div>
                <div className="text-xs text-gray-500 mt-1">@ {newRate}% p.a.</div>
              </div>
            </div>
            {result.emiDifference > 0 && (
              <div className="text-center mt-3 text-sm font-semibold text-green-700">
                You save {fmt(result.emiDifference)} per month on EMI
              </div>
            )}
          </div>

          {/* Total Cost Comparison */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="text-sm font-bold text-gray-700 mb-4">Total Cost Comparison</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 text-gray-600"></th>
                  <th className="text-right py-2 text-red-600">Current Bank</th>
                  <th className="text-right py-2 text-green-600">New Bank</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-2 text-gray-600">Principal</td>
                  <td className="py-2 text-right font-medium">{fmt(parseFloat(outstanding))}</td>
                  <td className="py-2 text-right font-medium">{fmt(parseFloat(outstanding))}</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2 text-gray-600">Total Interest</td>
                  <td className="py-2 text-right font-medium text-red-600">{fmt(result.oldTotalInterest)}</td>
                  <td className="py-2 text-right font-medium text-green-600">{fmt(result.newTotalInterest)}</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2 text-gray-600">Processing Fee</td>
                  <td className="py-2 text-right font-medium">-</td>
                  <td className="py-2 text-right font-medium">{fmt(result.processingAmount)}</td>
                </tr>
                <tr className="border-t-2">
                  <td className="py-2 font-bold text-gray-800">Total Cost</td>
                  <td className="py-2 text-right font-extrabold text-red-600">{fmt(result.totalCostOld)}</td>
                  <td className="py-2 text-right font-extrabold text-green-600">{fmt(result.totalCostNew)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Recommendation */}
          <div className={`rounded-xl p-5 text-center ${result.isWorthSwitching ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
            <div className={`text-3xl font-extrabold ${result.isWorthSwitching ? "text-green-600" : "text-red-600"}`}>
              {result.isWorthSwitching ? `You Save ${fmt(result.savings)}` : `You Lose ${fmt(Math.abs(result.savings))}`}
            </div>
            <p className={`text-sm font-medium mt-2 ${result.isWorthSwitching ? "text-green-700" : "text-red-700"}`}>
              {result.isWorthSwitching
                ? `Switching is recommended! You save ${fmt(result.interestSaved)} in interest.`
                : `Switching is NOT recommended. The processing fee outweighs interest savings.`
              }
            </p>
            {result.breakEvenMonths > 0 && result.isWorthSwitching && (
              <p className="text-xs text-gray-600 mt-2">
                Break-even period: <strong>{result.breakEvenMonths} months</strong> ({(result.breakEvenMonths / 12).toFixed(1)} years) to recover processing fee through EMI savings
              </p>
            )}
          </div>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-800 space-y-1">
        <p><strong>When to consider balance transfer:</strong></p>
        <p>- Interest rate difference of 0.5% or more</p>
        <p>- Remaining tenure of 10+ years (more savings potential)</p>
        <p>- Check for pre-payment penalties at current bank</p>
        <p>- Consider total switching cost (processing fee + legal charges + valuation)</p>
      </div>
    </div>
  );
}
