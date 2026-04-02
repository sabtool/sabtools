"use client";
import { useState, useMemo } from "react";

export default function ProfitLossCalculator() {
  const [revenue, setRevenue] = useState("1000000");
  const [cogs, setCogs] = useState("400000");
  const [opExpenses, setOpExpenses] = useState("200000");
  const [otherIncome, setOtherIncome] = useState("50000");
  const [taxes, setTaxes] = useState("100000");

  const fmt = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
  const pct = (val: number, base: number) => base !== 0 ? ((val / base) * 100).toFixed(1) : "0.0";

  const result = useMemo(() => {
    const r = parseFloat(revenue) || 0;
    const c = parseFloat(cogs) || 0;
    const op = parseFloat(opExpenses) || 0;
    const oi = parseFloat(otherIncome) || 0;
    const t = parseFloat(taxes) || 0;

    const grossProfit = r - c;
    const operatingProfit = grossProfit - op;
    const profitBeforeTax = operatingProfit + oi;
    const netProfit = profitBeforeTax - t;

    return { revenue: r, grossProfit, operatingProfit, profitBeforeTax, netProfit };
  }, [revenue, cogs, opExpenses, otherIncome, taxes]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Total Revenue</label>
          <input type="number" value={revenue} onChange={(e) => setRevenue(e.target.value)} className="calc-input" placeholder="0" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Cost of Goods Sold (COGS)</label>
          <input type="number" value={cogs} onChange={(e) => setCogs(e.target.value)} className="calc-input" placeholder="0" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Operating Expenses</label>
          <input type="number" value={opExpenses} onChange={(e) => setOpExpenses(e.target.value)} className="calc-input" placeholder="0" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Other Income</label>
          <input type="number" value={otherIncome} onChange={(e) => setOtherIncome(e.target.value)} className="calc-input" placeholder="0" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Taxes</label>
          <input type="number" value={taxes} onChange={(e) => setTaxes(e.target.value)} className="calc-input" placeholder="0" />
        </div>
      </div>

      <div className="result-card space-y-4">
        <h3 className="text-lg font-bold text-gray-800">Profit & Loss Statement</h3>

        {[
          { label: "Gross Profit", value: result.grossProfit, margin: pct(result.grossProfit, result.revenue), desc: "Revenue - COGS", color: result.grossProfit >= 0 ? "text-green-600" : "text-red-600" },
          { label: "Operating Profit (EBIT)", value: result.operatingProfit, margin: pct(result.operatingProfit, result.revenue), desc: "Gross Profit - Operating Expenses", color: result.operatingProfit >= 0 ? "text-green-600" : "text-red-600" },
          { label: "Profit Before Tax", value: result.profitBeforeTax, margin: pct(result.profitBeforeTax, result.revenue), desc: "Operating Profit + Other Income", color: result.profitBeforeTax >= 0 ? "text-green-600" : "text-red-600" },
          { label: "Net Profit", value: result.netProfit, margin: pct(result.netProfit, result.revenue), desc: "Profit Before Tax - Taxes", color: result.netProfit >= 0 ? "text-green-600" : "text-red-600" },
        ].map((item, i) => (
          <div key={i} className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm font-semibold text-gray-700">{item.label}</div>
                <div className="text-xs text-gray-400">{item.desc}</div>
              </div>
              <div className="text-right">
                <div className={`text-xl font-extrabold ${item.color}`}>{fmt(item.value)}</div>
                <div className="text-xs text-gray-500">Margin: {item.margin}%</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
