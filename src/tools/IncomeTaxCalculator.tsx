"use client";
import { useState, useMemo } from "react";

export default function IncomeTaxCalculator() {
  const [income, setIncome] = useState("");
  const [regime, setRegime] = useState<"old" | "new">("new");
  const [age, setAge] = useState<"below60" | "60to80" | "above80">("below60");

  const result = useMemo(() => {
    const inc = parseFloat(income);
    if (isNaN(inc) || inc <= 0) return null;

    let tax = 0;
    if (regime === "new") {
      // New Regime FY 2025-26 (AY 2026-27)
      // Standard deduction of ₹75,000
      const taxableIncome = Math.max(0, inc - 75000);
      const slabs = [
        { limit: 400000, rate: 0 },
        { limit: 800000, rate: 5 },
        { limit: 1200000, rate: 10 },
        { limit: 1600000, rate: 15 },
        { limit: 2000000, rate: 20 },
        { limit: 2400000, rate: 25 },
        { limit: Infinity, rate: 30 },
      ];
      let remaining = taxableIncome;
      let prev = 0;
      for (const slab of slabs) {
        const taxable = Math.min(remaining, slab.limit - prev);
        if (taxable <= 0) break;
        tax += (taxable * slab.rate) / 100;
        remaining -= taxable;
        prev = slab.limit;
      }
      // Section 87A rebate: Income up to ₹12,00,000 (after standard deduction) = no tax (rebate up to ₹60,000)
      if (taxableIncome <= 1200000) tax = Math.max(0, tax - 60000);
    } else {
      // Old Regime FY 2025-26
      // Standard deduction of ₹50,000
      const stdDeduction = 50000;
      const exemption = age === "below60" ? 250000 : age === "60to80" ? 300000 : 500000;
      const taxable = Math.max(0, inc - stdDeduction - exemption);
      const slabs = [
        { limit: 250000, rate: 5 },
        { limit: 500000, rate: 20 },
        { limit: Infinity, rate: 30 },
      ];
      let remaining = taxable;
      let prev = 0;
      for (const slab of slabs) {
        const t = Math.min(remaining, slab.limit - prev);
        if (t <= 0) break;
        tax += (t * slab.rate) / 100;
        remaining -= t;
        prev = slab.limit;
      }
      // Section 87A rebate for old regime: taxable income up to ₹5,00,000
      if (taxable <= 500000) tax = 0;
    }

    const cess = tax * 0.04;
    const totalTax = tax + cess;
    const netIncome = inc - totalTax;
    const effectiveRate = inc > 0 ? (totalTax / inc) * 100 : 0;

    return { tax, cess, totalTax, netIncome, effectiveRate };
  }, [income, regime, age]);

  const fmt = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="space-y-6">
      <div className="inline-block bg-indigo-100 text-indigo-800 text-sm font-semibold px-4 py-1.5 rounded-full">
        {"\uD83D\uDCC5"} Tax Slabs: FY 2025-26 (AY 2026-27)
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Annual Income (₹)</label>
          <input type="number" placeholder="e.g. 1200000" value={income} onChange={(e) => setIncome(e.target.value)} className="calc-input" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Tax Regime</label>
          <div className="flex gap-2">
            {(["new", "old"] as const).map((r) => (
              <button key={r} onClick={() => setRegime(r)} className={`px-5 py-2.5 rounded-xl text-sm font-semibold capitalize transition ${regime === r ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"}`}>{r} Regime</button>
            ))}
          </div>
        </div>
      </div>

      {regime === "old" && (
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Age Group</label>
          <div className="flex gap-2 flex-wrap">
            {([{l:"Below 60",v:"below60"},{l:"60-80",v:"60to80"},{l:"Above 80",v:"above80"}] as const).map((a) => (
              <button key={a.v} onClick={() => setAge(a.v)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${age === a.v ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"}`}>{a.l}</button>
            ))}
          </div>
        </div>
      )}

      {result && (
        <div className="result-card space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm"><div className="text-xs font-medium text-gray-500 mb-1">Income Tax</div><div className="text-xl font-bold text-red-600">{fmt(result.tax)}</div></div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm"><div className="text-xs font-medium text-gray-500 mb-1">Cess (4%)</div><div className="text-xl font-bold text-orange-600">{fmt(result.cess)}</div></div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm"><div className="text-xs font-medium text-gray-500 mb-1">Total Tax</div><div className="text-xl font-bold text-red-700">{fmt(result.totalTax)}</div></div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm"><div className="text-xs font-medium text-gray-500 mb-1">Net Income</div><div className="text-xl font-bold text-green-600">{fmt(result.netIncome)}</div></div>
          </div>
          <div className="text-center text-sm text-gray-500">Effective Tax Rate: <span className="font-bold text-indigo-600">{result.effectiveRate.toFixed(2)}%</span></div>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-800 leading-relaxed">
        <span className="mr-1">{"\u2139\uFE0F"}</span>
        <strong>Disclaimer:</strong> Tax calculations are based on FY 2025-26 rates as announced in Union Budget 2025. Surcharge and cess (4% health &amp; education cess) are included. For exact tax liability, consult a Chartered Accountant or use the official Income Tax portal at{" "}
        <a href="https://www.incometax.gov.in" target="_blank" rel="noopener noreferrer" className="underline font-semibold text-blue-700 hover:text-blue-900">incometax.gov.in</a>.
      </div>
    </div>
  );
}
