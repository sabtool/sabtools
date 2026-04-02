"use client";
import { useState, useMemo } from "react";

export default function InHandSalaryCalculator() {
  const [ctc, setCtc] = useState("");
  const [basicPercent, setBasicPercent] = useState("40");
  const [regime, setRegime] = useState<"new" | "old">("new");
  const [metroCity, setMetroCity] = useState(true);

  const result = useMemo(() => {
    const annual = parseFloat(ctc);
    if (!annual || annual <= 0) return null;

    const basicPct = parseFloat(basicPercent) || 40;
    const basic = (annual * basicPct) / 100;
    const hra = basic * 0.5;
    const pfBasic = Math.min(basic, 15000 * 12); // PF cap at 15000/month basic
    const employeePF = pfBasic * 0.12;
    const employerPF = pfBasic * 0.12;
    const specialAllowance = annual - basic - hra - employerPF;

    const monthlyBasic = basic / 12;
    const monthlyHRA = hra / 12;
    const monthlySpecial = specialAllowance / 12;
    const monthlyPF = employeePF / 12;
    const professionalTax = 200; // per month
    const annualPT = professionalTax * 12;

    // Gross salary (excluding employer PF)
    const grossAnnual = annual - employerPF;
    const grossMonthly = grossAnnual / 12;

    // Income Tax calculation (FY 2025-26 / AY 2026-27)
    let taxableIncome = grossAnnual - employeePF - annualPT;
    if (regime === "old") {
      // Old regime with 80C, HRA etc.
      const sec80C = Math.min(150000, employeePF);
      const hraExempt = metroCity ? Math.min(hra, monthlyBasic * 12 * 0.5, hra) : Math.min(hra, monthlyBasic * 12 * 0.4, hra);
      taxableIncome = grossAnnual - employeePF - annualPT - sec80C - hraExempt * 0.5 - 50000; // Standard deduction ₹50,000
    } else {
      taxableIncome = grossAnnual - 75000; // Standard deduction ₹75,000 new regime
    }

    let tax = 0;
    if (regime === "new") {
      // New Tax Regime FY 2025-26 (AY 2026-27)
      const slabs = [
        { limit: 400000, rate: 0 },
        { limit: 800000, rate: 5 },
        { limit: 1200000, rate: 10 },
        { limit: 1600000, rate: 15 },
        { limit: 2000000, rate: 20 },
        { limit: 2400000, rate: 25 },
        { limit: Infinity, rate: 30 },
      ];
      let remaining = Math.max(0, taxableIncome);
      let prev = 0;
      for (const slab of slabs) {
        const taxable = Math.min(remaining, slab.limit - prev);
        tax += (taxable * slab.rate) / 100;
        remaining -= taxable;
        prev = slab.limit;
        if (remaining <= 0) break;
      }
      // Section 87A rebate: Income up to ₹12,00,000 (after standard deduction) = no tax (rebate up to ₹60,000)
      if (taxableIncome <= 1200000) tax = Math.max(0, tax - 60000);
    } else {
      // Old Tax Regime FY 2025-26
      const slabs = [
        { limit: 250000, rate: 5 },
        { limit: 500000, rate: 20 },
        { limit: Infinity, rate: 30 },
      ];
      let remaining = Math.max(0, taxableIncome);
      let prev = 0;
      for (const slab of slabs) {
        const taxable = Math.min(remaining, slab.limit - prev);
        tax += (taxable * slab.rate) / 100;
        remaining -= taxable;
        prev = slab.limit;
        if (remaining <= 0) break;
      }
      // Section 87A rebate for old regime: taxable income up to ₹5,00,000
      if (taxableIncome <= 500000) tax = 0;
    }
    const cess = tax * 0.04;
    const totalTax = tax + cess;
    const monthlyTax = totalTax / 12;

    const totalDeductions = monthlyPF + professionalTax + monthlyTax;
    const inHand = grossMonthly - totalDeductions;
    const annualInHand = inHand * 12;

    return {
      annual, basic, hra, specialAllowance, employeePF, employerPF,
      monthlyBasic, monthlyHRA, monthlySpecial, monthlyPF, professionalTax,
      grossAnnual, grossMonthly, taxableIncome: Math.max(0, taxableIncome),
      tax, cess, totalTax, monthlyTax, totalDeductions, inHand, annualInHand,
    };
  }, [ctc, basicPercent, regime, metroCity]);

  const fmt = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="space-y-6">
      <div className="inline-block bg-indigo-100 text-indigo-800 text-sm font-semibold px-4 py-1.5 rounded-full">
        {"\uD83D\uDCC5"} Tax Slabs: FY 2025-26 (AY 2026-27)
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Annual CTC (₹)</label>
          <input type="number" placeholder="e.g. 1200000" value={ctc} onChange={e => setCtc(e.target.value)} className="calc-input" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Basic Salary % of CTC</label>
          <input type="number" placeholder="40" value={basicPercent} onChange={e => setBasicPercent(e.target.value)} className="calc-input" />
          <div className="flex gap-2 mt-2">
            {[40, 45, 50].map(p => (
              <button key={p} onClick={() => setBasicPercent(String(p))}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${basicPercent === String(p) ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"}`}>{p}%</button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Tax Regime</label>
          <div className="flex gap-2">
            <button onClick={() => setRegime("new")} className={`px-4 py-2 rounded-lg text-sm font-semibold transition flex-1 ${regime === "new" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"}`}>New Regime</button>
            <button onClick={() => setRegime("old")} className={`px-4 py-2 rounded-lg text-sm font-semibold transition flex-1 ${regime === "old" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"}`}>Old Regime</button>
          </div>
        </div>
        {regime === "old" && (
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">Metro City?</label>
            <div className="flex gap-2">
              <button onClick={() => setMetroCity(true)} className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${metroCity ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"}`}>Yes (50% HRA)</button>
              <button onClick={() => setMetroCity(false)} className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${!metroCity ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"}`}>No (40% HRA)</button>
            </div>
          </div>
        )}
      </div>

      {result && (
        <div className="space-y-4">
          {/* Main result */}
          <div className="result-card text-center">
            <div className="text-sm text-gray-500">Monthly In-Hand Salary</div>
            <div className="text-4xl font-extrabold text-indigo-600 mt-1">{fmt(result.inHand)}</div>
            <div className="text-sm text-gray-400 mt-1">Annual In-Hand: {fmt(result.annualInHand)}</div>
          </div>

          {/* Payslip */}
          <div className="result-card">
            <h3 className="font-bold text-gray-800 mb-3">Detailed Payslip</h3>
            <div className="table-responsive">
              <table>
                <thead><tr><th>Component</th><th className="text-right">Monthly</th><th className="text-right">Annual</th></tr></thead>
                <tbody>
                  <tr className="bg-green-50"><td colSpan={3} className="font-bold text-green-700">EARNINGS</td></tr>
                  <tr><td>Basic Salary</td><td className="text-right">{fmt(result.monthlyBasic)}</td><td className="text-right">{fmt(result.basic)}</td></tr>
                  <tr><td>House Rent Allowance (HRA)</td><td className="text-right">{fmt(result.monthlyHRA)}</td><td className="text-right">{fmt(result.hra)}</td></tr>
                  <tr><td>Special Allowance</td><td className="text-right">{fmt(result.monthlySpecial)}</td><td className="text-right">{fmt(result.specialAllowance)}</td></tr>
                  <tr className="font-semibold bg-gray-50"><td>Gross Salary</td><td className="text-right">{fmt(result.grossMonthly)}</td><td className="text-right">{fmt(result.grossAnnual)}</td></tr>

                  <tr className="bg-red-50"><td colSpan={3} className="font-bold text-red-700">DEDUCTIONS</td></tr>
                  <tr className="text-red-600"><td>Employee PF (12%)</td><td className="text-right">{fmt(result.monthlyPF)}</td><td className="text-right">{fmt(result.employeePF)}</td></tr>
                  <tr className="text-red-600"><td>Professional Tax</td><td className="text-right">{fmt(result.professionalTax)}</td><td className="text-right">{fmt(result.professionalTax * 12)}</td></tr>
                  <tr className="text-red-600"><td>Income Tax ({regime === "new" ? "New" : "Old"} Regime)</td><td className="text-right">{fmt(result.monthlyTax)}</td><td className="text-right">{fmt(result.totalTax)}</td></tr>
                  <tr className="font-semibold bg-red-50 text-red-700"><td>Total Deductions</td><td className="text-right">{fmt(result.totalDeductions)}</td><td className="text-right">{fmt(result.totalDeductions * 12)}</td></tr>

                  <tr className="bg-indigo-50"><td colSpan={3} className="font-bold text-indigo-700">EMPLOYER CONTRIBUTION</td></tr>
                  <tr><td>Employer PF (12%)</td><td className="text-right">{fmt(result.employerPF / 12)}</td><td className="text-right">{fmt(result.employerPF)}</td></tr>

                  <tr className="font-bold text-indigo-600 bg-indigo-100 text-lg">
                    <td>NET IN-HAND SALARY</td><td className="text-right">{fmt(result.inHand)}</td><td className="text-right">{fmt(result.annualInHand)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Tax breakdown */}
          <div className="result-card">
            <h3 className="font-bold text-gray-800 mb-3">Tax Breakdown ({regime === "new" ? "New" : "Old"} Regime)</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white rounded-xl p-3 text-center shadow-sm">
                <div className="text-xs text-gray-500">Taxable Income</div>
                <div className="text-lg font-bold text-gray-700">{fmt(result.taxableIncome)}</div>
              </div>
              <div className="bg-white rounded-xl p-3 text-center shadow-sm">
                <div className="text-xs text-gray-500">Income Tax</div>
                <div className="text-lg font-bold text-red-600">{fmt(result.tax)}</div>
              </div>
              <div className="bg-white rounded-xl p-3 text-center shadow-sm">
                <div className="text-xs text-gray-500">Health & Edu Cess (4%)</div>
                <div className="text-lg font-bold text-red-600">{fmt(result.cess)}</div>
              </div>
              <div className="bg-white rounded-xl p-3 text-center shadow-sm">
                <div className="text-xs text-gray-500">Total Tax</div>
                <div className="text-lg font-bold text-red-700">{fmt(result.totalTax)}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
        <div className="flex items-start gap-2">
          <span className="text-lg">{"\u2139\uFE0F"}</span>
          <div>
            <p className="font-semibold mb-1">Disclaimer</p>
            <p>Tax calculations are based on FY 2025-26 slabs as announced in Union Budget 2025. This is an estimate for illustration purposes. For exact tax liability, consult a Chartered Accountant or use the official Income Tax portal at{" "}
              <a href="https://www.incometax.gov.in" target="_blank" rel="noopener noreferrer" className="underline font-semibold text-blue-700 hover:text-blue-900">incometax.gov.in</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
