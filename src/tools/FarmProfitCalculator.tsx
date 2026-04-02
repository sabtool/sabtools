"use client";
import { useState, useMemo } from "react";

const cropOptions = ["Rice", "Wheat", "Sugarcane", "Cotton", "Soybean", "Maize", "Pulses", "Vegetables", "Mustard", "Potato"];

export default function FarmProfitCalculator() {
  const [crop, setCrop] = useState("Rice");
  const [landArea, setLandArea] = useState(5);
  const [yieldPerAcre, setYieldPerAcre] = useState(25);
  const [sellingPrice, setSellingPrice] = useState(2300);

  // Costs
  const [seeds, setSeeds] = useState(3000);
  const [fertilizer, setFertilizer] = useState(6000);
  const [pesticide, setPesticide] = useState(3000);
  const [labor, setLabor] = useState(8000);
  const [irrigation, setIrrigation] = useState(4000);
  const [transport, setTransport] = useState(2000);
  const [rent, setRent] = useState(5000);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
  const fmtNum = (n: number) => new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(n);

  const result = useMemo(() => {
    const totalYield = landArea * yieldPerAcre;
    const grossRevenue = totalYield * sellingPrice;

    const costPerAcre = seeds + fertilizer + pesticide + labor + irrigation + transport + rent;
    const totalCost = costPerAcre * landArea;
    const netProfit = grossRevenue - totalCost;
    const profitPerAcre = landArea > 0 ? netProfit / landArea : 0;
    const roi = totalCost > 0 ? (netProfit / totalCost) * 100 : 0;

    const costBreakdown = [
      { name: "Seeds", amount: seeds * landArea, color: "bg-blue-500" },
      { name: "Fertilizer", amount: fertilizer * landArea, color: "bg-green-500" },
      { name: "Pesticide", amount: pesticide * landArea, color: "bg-red-500" },
      { name: "Labor", amount: labor * landArea, color: "bg-yellow-500" },
      { name: "Irrigation", amount: irrigation * landArea, color: "bg-cyan-500" },
      { name: "Transport", amount: transport * landArea, color: "bg-purple-500" },
      { name: "Rent/Lease", amount: rent * landArea, color: "bg-orange-500" },
    ];

    return { totalYield, grossRevenue, costPerAcre, totalCost, netProfit, profitPerAcre, roi, costBreakdown };
  }, [landArea, yieldPerAcre, sellingPrice, seeds, fertilizer, pesticide, labor, irrigation, transport, rent]);

  return (
    <div className="space-y-8">
      {/* Crop & Revenue Inputs */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Crop</label>
            <select value={crop} onChange={(e) => setCrop(e.target.value)} className="calc-input">
              {cropOptions.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Land Area (Acres)</label>
            <input type="number" min={0.5} step={0.5} value={landArea} onChange={(e) => setLandArea(+e.target.value)} className="calc-input" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Yield per Acre (Quintals)</label>
            <input type="number" min={1} step={1} value={yieldPerAcre} onChange={(e) => setYieldPerAcre(+e.target.value)} className="calc-input" />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Selling Price (₹/Quintal)</label>
            <input type="number" min={100} step={50} value={sellingPrice} onChange={(e) => setSellingPrice(+e.target.value)} className="calc-input" />
          </div>
        </div>
      </div>

      {/* Cost Inputs */}
      <div className="result-card space-y-4">
        <h3 className="text-lg font-bold text-gray-800">Costs per Acre (₹)</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Seeds", value: seeds, set: setSeeds },
            { label: "Fertilizer", value: fertilizer, set: setFertilizer },
            { label: "Pesticide", value: pesticide, set: setPesticide },
            { label: "Labor", value: labor, set: setLabor },
            { label: "Irrigation", value: irrigation, set: setIrrigation },
            { label: "Transport", value: transport, set: setTransport },
            { label: "Rent/Lease", value: rent, set: setRent },
          ].map((item) => (
            <div key={item.label}>
              <label className="text-xs text-gray-500 mb-1 block">{item.label}</label>
              <input
                type="number"
                min={0}
                step={500}
                value={item.value}
                onChange={(e) => item.set(+e.target.value)}
                className="calc-input"
              />
            </div>
          ))}
          <div className="flex items-end">
            <div className="bg-gray-50 rounded-xl p-3 w-full text-center">
              <div className="text-xs text-gray-500">Total/Acre</div>
              <div className="text-lg font-bold text-red-500">{fmt(result.costPerAcre)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Results */}
      <div className="result-card space-y-4">
        <h3 className="text-lg font-bold text-gray-800">Farm Profit Summary — {crop}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-xs font-medium text-gray-500 mb-1">Total Yield</div>
            <div className="text-2xl font-extrabold text-amber-600">{fmtNum(result.totalYield)} qtl</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-xs font-medium text-gray-500 mb-1">Gross Revenue</div>
            <div className="text-2xl font-extrabold text-emerald-600">{fmt(result.grossRevenue)}</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-xs font-medium text-gray-500 mb-1">Total Cost</div>
            <div className="text-2xl font-extrabold text-red-500">{fmt(result.totalCost)}</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-xs font-medium text-gray-500 mb-1">Net Profit</div>
            <div className={`text-2xl font-extrabold ${result.netProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
              {fmt(result.netProfit)}
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-xs font-medium text-gray-500 mb-1">Profit per Acre</div>
            <div className={`text-2xl font-extrabold ${result.profitPerAcre >= 0 ? "text-green-600" : "text-red-600"}`}>
              {fmt(result.profitPerAcre)}
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-xs font-medium text-gray-500 mb-1">ROI</div>
            <div className={`text-2xl font-extrabold ${result.roi >= 0 ? "text-green-600" : "text-red-600"}`}>
              {result.roi.toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      {/* Cost Breakdown Visual */}
      <div className="result-card space-y-4">
        <h3 className="text-lg font-bold text-gray-800">Cost Breakdown</h3>
        <div className="space-y-2">
          {result.costBreakdown.map((item) => {
            const pct = result.totalCost > 0 ? (item.amount / result.totalCost) * 100 : 0;
            return (
              <div key={item.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{item.name}</span>
                  <span className="font-semibold text-gray-700">{fmt(item.amount)} ({pct.toFixed(1)}%)</span>
                </div>
                <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
                  <div className={`h-full rounded-full ${item.color} transition-all duration-500`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Revenue vs Cost bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs font-medium text-gray-500 mb-2">
            <span>Cost ({result.grossRevenue > 0 ? ((result.totalCost / result.grossRevenue) * 100).toFixed(1) : 0}%)</span>
            <span>Profit ({result.grossRevenue > 0 ? Math.max(0, ((result.netProfit / result.grossRevenue) * 100)).toFixed(1) : 0}%)</span>
          </div>
          <div className="h-5 rounded-full bg-green-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-red-400 transition-all duration-500"
              style={{ width: `${result.grossRevenue > 0 ? Math.min(100, (result.totalCost / result.grossRevenue) * 100) : 0}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
