"use client";
import { useState, useMemo } from "react";

export default function BreakEvenCalculator() {
  const [fixedCosts, setFixedCosts] = useState("500000");
  const [variableCost, setVariableCost] = useState("200");
  const [sellingPrice, setSellingPrice] = useState("500");

  const fmt = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  const result = useMemo(() => {
    const fc = parseFloat(fixedCosts) || 0;
    const vc = parseFloat(variableCost) || 0;
    const sp = parseFloat(sellingPrice) || 0;

    if (sp <= vc) return null;

    const contributionMargin = sp - vc;
    const breakEvenUnits = Math.ceil(fc / contributionMargin);
    const breakEvenRevenue = breakEvenUnits * sp;
    const contributionRatio = (contributionMargin / sp) * 100;

    return { breakEvenUnits, breakEvenRevenue, contributionMargin, contributionRatio };
  }, [fixedCosts, variableCost, sellingPrice]);

  const profitZones = useMemo(() => {
    if (!result) return [];
    const sp = parseFloat(sellingPrice) || 0;
    const vc = parseFloat(variableCost) || 0;
    const fc = parseFloat(fixedCosts) || 0;
    const zones = [];
    const steps = [0.5, 0.75, 1, 1.25, 1.5, 2];
    for (const mult of steps) {
      const units = Math.round(result.breakEvenUnits * mult);
      const revenue = units * sp;
      const totalCost = fc + units * vc;
      const profit = revenue - totalCost;
      zones.push({ units, revenue, totalCost, profit, label: mult === 1 ? "Break-Even" : `${Math.round(mult * 100)}%` });
    }
    return zones;
  }, [result, fixedCosts, variableCost, sellingPrice]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Fixed Costs (Total)</label>
          <input type="number" value={fixedCosts} onChange={(e) => setFixedCosts(e.target.value)} className="calc-input" placeholder="0" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Variable Cost / Unit</label>
          <input type="number" value={variableCost} onChange={(e) => setVariableCost(e.target.value)} className="calc-input" placeholder="0" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Selling Price / Unit</label>
          <input type="number" value={sellingPrice} onChange={(e) => setSellingPrice(e.target.value)} className="calc-input" placeholder="0" />
        </div>
      </div>

      {parseFloat(sellingPrice) <= parseFloat(variableCost) && (
        <div className="result-card">
          <p className="text-sm text-red-500 font-medium">Selling price must be greater than variable cost per unit to calculate break-even.</p>
        </div>
      )}

      {result && (
        <div className="result-card space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Break-Even Units</div>
              <div className="text-2xl font-extrabold text-indigo-600">{result.breakEvenUnits.toLocaleString("en-IN")}</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Break-Even Revenue</div>
              <div className="text-2xl font-extrabold text-gray-800">{fmt(result.breakEvenRevenue)}</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Contribution Margin</div>
              <div className="text-2xl font-extrabold text-green-600">{fmt(result.contributionMargin)}</div>
              <div className="text-xs text-gray-400">per unit</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Contribution Ratio</div>
              <div className="text-2xl font-extrabold text-green-600">{result.contributionRatio.toFixed(1)}%</div>
            </div>
          </div>

          <h4 className="text-sm font-semibold text-gray-600">Profit/Loss at Different Volumes</h4>
          <div className="space-y-2">
            {profitZones.map((z, i) => (
              <div key={i} className={`bg-white rounded-xl p-3 shadow-sm flex justify-between items-center ${z.label === "Break-Even" ? "ring-2 ring-indigo-400" : ""}`}>
                <div>
                  <span className="text-sm font-semibold text-gray-700">{z.units.toLocaleString("en-IN")} units</span>
                  {z.label === "Break-Even" && <span className="ml-2 text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">Break-Even</span>}
                </div>
                <div className="text-right">
                  <div className={`text-sm font-bold ${z.profit >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {z.profit >= 0 ? "Profit" : "Loss"}: {fmt(Math.abs(z.profit))}
                  </div>
                  <div className="text-xs text-gray-400">Revenue: {fmt(z.revenue)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
