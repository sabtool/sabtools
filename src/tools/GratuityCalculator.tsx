"use client";
import { useState, useMemo } from "react";

export default function GratuityCalculator() {
  const [salary, setSalary] = useState("");
  const [years, setYears] = useState("");

  const result = useMemo(() => {
    const s = parseFloat(salary);
    const y = parseFloat(years);
    if (!s || !y || s <= 0 || y < 5) return null;
    const gratuity = (s * 15 * y) / 26;
    return { gratuity };
  }, [salary, years]);

  const fmt = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="space-y-6">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        <strong>Formula:</strong> Gratuity = (Last Drawn Salary × 15 × Years of Service) / 26<br />
        <strong>Note:</strong> Minimum 5 years of continuous service required.
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Last Drawn Salary (Basic + DA) ₹</label>
          <input type="number" placeholder="e.g. 50000" value={salary} onChange={(e) => setSalary(e.target.value)} className="calc-input" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Years of Service</label>
          <input type="number" placeholder="e.g. 10" value={years} onChange={(e) => setYears(e.target.value)} className="calc-input" />
        </div>
      </div>
      {years && parseFloat(years) < 5 && parseFloat(years) > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600">Minimum 5 years of service required for gratuity eligibility.</div>
      )}
      {result && (
        <div className="result-card text-center">
          <div className="text-sm text-gray-500">Gratuity Amount</div>
          <div className="text-4xl font-extrabold text-indigo-600 mt-2">{fmt(result.gratuity)}</div>
          <div className="text-xs text-gray-400 mt-2">Tax-free up to ₹20,00,000 under Payment of Gratuity Act</div>
        </div>
      )}
    </div>
  );
}
