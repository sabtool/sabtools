"use client";
import { useState, useMemo } from "react";

type PrepaymentType = "reduce-emi" | "reduce-tenure";

interface AmortRow {
  year: number;
  opening: number;
  emiPaid: number;
  interest: number;
  principal: number;
  closing: number;
}

function buildAmortization(principal: number, monthlyRate: number, emi: number, totalMonths: number): AmortRow[] {
  const rows: AmortRow[] = [];
  let balance = principal;
  const years = Math.ceil(totalMonths / 12);
  const cap = Math.min(years, 30);
  let monthsLeft = totalMonths;

  for (let y = 1; y <= cap && balance > 0.5; y++) {
    const opening = balance;
    let yEmi = 0;
    let yInt = 0;
    let yPrin = 0;
    const mInYear = Math.min(12, monthsLeft);

    for (let m = 0; m < mInYear && balance > 0.5; m++) {
      const intPart = balance * monthlyRate;
      const prinPart = Math.min(emi - intPart, balance);
      yInt += intPart;
      yPrin += prinPart;
      yEmi += intPart + prinPart;
      balance -= prinPart;
      monthsLeft--;
    }
    rows.push({
      year: y,
      opening,
      emiPaid: yEmi,
      interest: yInt,
      principal: yPrin,
      closing: Math.max(0, balance),
    });
  }
  return rows;
}

export default function HomeLoanPrepaymentCalculator() {
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [tenure, setTenure] = useState("");
  const [prepaymentAmount, setPrepaymentAmount] = useState("");
  const [prepaymentType, setPrepaymentType] = useState<PrepaymentType>("reduce-tenure");

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  const fmtNum = (n: number) =>
    new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);

  const result = useMemo(() => {
    const P = parseFloat(loanAmount);
    const annualRate = parseFloat(interestRate);
    const years = parseFloat(tenure);
    const prepay = parseFloat(prepaymentAmount);

    if (!P || P <= 0 || !annualRate || annualRate <= 0 || !years || years <= 0 || !prepay || prepay <= 0) return null;
    if (prepay >= P) return null;

    const r = annualRate / 12 / 100;
    const n = Math.round(years * 12);

    // Current EMI
    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPaymentOld = emi * n;
    const totalInterestOld = totalPaymentOld - P;

    // After prepayment
    const newPrincipal = P - prepay;
    let newEmi: number;
    let newMonths: number;
    let timeSavedMonths = 0;

    if (prepaymentType === "reduce-emi") {
      // Same tenure, new EMI
      newMonths = n;
      newEmi = (newPrincipal * r * Math.pow(1 + r, newMonths)) / (Math.pow(1 + r, newMonths) - 1);
    } else {
      // Same EMI, new tenure
      newEmi = emi;
      // n = -log(1 - (P*r/EMI)) / log(1+r)
      const ratio = (newPrincipal * r) / emi;
      if (ratio >= 1) return null; // EMI can't cover interest on new principal
      newMonths = Math.ceil(-Math.log(1 - ratio) / Math.log(1 + r));
      timeSavedMonths = n - newMonths;
    }

    const totalPaymentNew = newEmi * newMonths;
    const totalInterestNew = totalPaymentNew - newPrincipal;
    const interestSaved = totalInterestOld - totalInterestNew;

    // Amortization tables
    const amortOld = buildAmortization(P, r, emi, n);
    const amortNew = buildAmortization(newPrincipal, r, newEmi, newMonths);

    return {
      emi,
      totalMonths: n,
      totalPaymentOld,
      totalInterestOld,
      newEmi,
      newMonths,
      totalPaymentNew,
      totalInterestNew,
      interestSaved,
      timeSavedMonths,
      newPrincipal,
      prepay,
      amortOld,
      amortNew,
    };
  }, [loanAmount, interestRate, tenure, prepaymentAmount, prepaymentType]);

  const timeSavedLabel = (months: number) => {
    if (months <= 0) return "Same tenure";
    const y = Math.floor(months / 12);
    const m = months % 12;
    const parts: string[] = [];
    if (y > 0) parts.push(`${y} year${y > 1 ? "s" : ""}`);
    if (m > 0) parts.push(`${m} month${m > 1 ? "s" : ""}`);
    return parts.join(" ");
  };

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="hlp-loan" className="block text-sm font-semibold text-gray-700 mb-1">
            Outstanding Loan Amount (₹)
          </label>
          <input
            id="hlp-loan"
            type="number"
            min={0}
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)}
            placeholder="e.g. 5000000"
            className="calc-input w-full"
          />
        </div>

        <div>
          <label htmlFor="hlp-rate" className="block text-sm font-semibold text-gray-700 mb-1">
            Interest Rate (% per annum)
          </label>
          <input
            id="hlp-rate"
            type="number"
            min={0}
            step={0.1}
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            placeholder="e.g. 8.5"
            className="calc-input w-full"
          />
        </div>

        <div>
          <label htmlFor="hlp-tenure" className="block text-sm font-semibold text-gray-700 mb-1">
            Remaining Tenure (years)
          </label>
          <input
            id="hlp-tenure"
            type="number"
            min={1}
            max={30}
            value={tenure}
            onChange={(e) => setTenure(e.target.value)}
            placeholder="e.g. 20"
            className="calc-input w-full"
          />
        </div>

        <div>
          <label htmlFor="hlp-prepay" className="block text-sm font-semibold text-gray-700 mb-1">
            Prepayment Amount (₹)
          </label>
          <input
            id="hlp-prepay"
            type="number"
            min={0}
            value={prepaymentAmount}
            onChange={(e) => setPrepaymentAmount(e.target.value)}
            placeholder="e.g. 500000"
            className="calc-input w-full"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="hlp-type" className="block text-sm font-semibold text-gray-700 mb-1">
            Prepayment Type
          </label>
          <select
            id="hlp-type"
            value={prepaymentType}
            onChange={(e) => setPrepaymentType(e.target.value as PrepaymentType)}
            className="calc-input w-full"
          >
            <option value="reduce-tenure">Reduce Tenure (keep same EMI)</option>
            <option value="reduce-emi">Reduce EMI (keep same tenure)</option>
          </select>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Motivational message */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
            <p className="text-green-800 font-semibold text-lg">
              You save {fmt(result.interestSaved)} by making a one-time prepayment of {fmt(result.prepay)}!
            </p>
          </div>

          {/* 3 big cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5 text-center">
              <p className="text-xs uppercase tracking-wide text-indigo-500 font-semibold mb-1">Interest Saved</p>
              <p className="text-2xl font-bold text-indigo-700">{fmt(result.interestSaved)}</p>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-center">
              <p className="text-xs uppercase tracking-wide text-emerald-500 font-semibold mb-1">Time Saved</p>
              <p className="text-2xl font-bold text-emerald-700">
                {prepaymentType === "reduce-tenure" ? timeSavedLabel(result.timeSavedMonths) : "N/A (EMI reduced)"}
              </p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-center">
              <p className="text-xs uppercase tracking-wide text-amber-500 font-semibold mb-1">New EMI</p>
              <p className="text-2xl font-bold text-amber-700">{fmt(result.newEmi)}</p>
              {prepaymentType === "reduce-emi" && (
                <p className="text-xs text-amber-600 mt-1">
                  was {fmt(result.emi)} (save {fmt(result.emi - result.newEmi)}/mo)
                </p>
              )}
            </div>
          </div>

          {/* Comparison table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-3 font-semibold text-gray-700">Parameter</th>
                  <th className="text-right p-3 font-semibold text-gray-700">Without Prepayment</th>
                  <th className="text-right p-3 font-semibold text-gray-700">With Prepayment</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-100">
                  <td className="p-3 text-gray-600">Monthly EMI</td>
                  <td className="p-3 text-right font-medium">{fmt(result.emi)}</td>
                  <td className="p-3 text-right font-medium text-indigo-700">{fmt(result.newEmi)}</td>
                </tr>
                <tr className="border-t border-gray-100 bg-gray-50">
                  <td className="p-3 text-gray-600">Tenure</td>
                  <td className="p-3 text-right font-medium">
                    {Math.floor(result.totalMonths / 12)}y {result.totalMonths % 12}m ({result.totalMonths} months)
                  </td>
                  <td className="p-3 text-right font-medium text-indigo-700">
                    {Math.floor(result.newMonths / 12)}y {result.newMonths % 12}m ({result.newMonths} months)
                  </td>
                </tr>
                <tr className="border-t border-gray-100">
                  <td className="p-3 text-gray-600">Total Interest</td>
                  <td className="p-3 text-right font-medium">{fmt(result.totalInterestOld)}</td>
                  <td className="p-3 text-right font-medium text-indigo-700">{fmt(result.totalInterestNew)}</td>
                </tr>
                <tr className="border-t border-gray-100 bg-gray-50">
                  <td className="p-3 text-gray-600">Total Payment</td>
                  <td className="p-3 text-right font-medium">{fmt(result.totalPaymentOld)}</td>
                  <td className="p-3 text-right font-medium text-indigo-700">
                    {fmt(result.totalPaymentNew + result.prepay)}
                  </td>
                </tr>
                <tr className="border-t border-gray-200 bg-green-50">
                  <td className="p-3 font-semibold text-green-800">Interest Saved</td>
                  <td className="p-3 text-right">—</td>
                  <td className="p-3 text-right font-bold text-green-700">{fmt(result.interestSaved)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Amortization tables side by side */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800">Year-wise Amortization</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Without prepayment */}
              <div>
                <h4 className="text-sm font-semibold text-gray-600 mb-2">Without Prepayment</h4>
                <div className="overflow-auto max-h-[400px] border border-gray-200 rounded-lg">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-100 sticky top-0">
                      <tr>
                        <th className="p-2 text-left font-semibold">Year</th>
                        <th className="p-2 text-right font-semibold">Opening</th>
                        <th className="p-2 text-right font-semibold">EMI Paid</th>
                        <th className="p-2 text-right font-semibold">Interest</th>
                        <th className="p-2 text-right font-semibold">Principal</th>
                        <th className="p-2 text-right font-semibold">Closing</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.amortOld.map((row) => (
                        <tr key={row.year} className="border-t border-gray-100 even:bg-gray-50">
                          <td className="p-2">{row.year}</td>
                          <td className="p-2 text-right">{fmtNum(row.opening)}</td>
                          <td className="p-2 text-right">{fmtNum(row.emiPaid)}</td>
                          <td className="p-2 text-right">{fmtNum(row.interest)}</td>
                          <td className="p-2 text-right">{fmtNum(row.principal)}</td>
                          <td className="p-2 text-right">{fmtNum(row.closing)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* With prepayment */}
              <div>
                <h4 className="text-sm font-semibold text-indigo-600 mb-2">With Prepayment</h4>
                <div className="overflow-auto max-h-[400px] border border-indigo-200 rounded-lg">
                  <table className="w-full text-xs">
                    <thead className="bg-indigo-50 sticky top-0">
                      <tr>
                        <th className="p-2 text-left font-semibold">Year</th>
                        <th className="p-2 text-right font-semibold">Opening</th>
                        <th className="p-2 text-right font-semibold">EMI Paid</th>
                        <th className="p-2 text-right font-semibold">Interest</th>
                        <th className="p-2 text-right font-semibold">Principal</th>
                        <th className="p-2 text-right font-semibold">Closing</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.amortNew.map((row) => (
                        <tr key={row.year} className="border-t border-gray-100 even:bg-indigo-50/30">
                          <td className="p-2">{row.year}</td>
                          <td className="p-2 text-right">{fmtNum(row.opening)}</td>
                          <td className="p-2 text-right">{fmtNum(row.emiPaid)}</td>
                          <td className="p-2 text-right">{fmtNum(row.interest)}</td>
                          <td className="p-2 text-right">{fmtNum(row.principal)}</td>
                          <td className="p-2 text-right">{fmtNum(row.closing)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!result && loanAmount && prepaymentAmount && (
        <div className="text-center text-gray-400 py-8">
          Fill in all fields to see your prepayment analysis.
        </div>
      )}
    </div>
  );
}
