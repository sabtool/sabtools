"use client";
import { useState, useMemo } from "react";

interface Appliance {
  name: string;
  watts: number;
  defaultQty: number;
}

const PRESET_APPLIANCES: Appliance[] = [
  { name: "AC 1.5 Ton", watts: 1500, defaultQty: 0 },
  { name: "AC 1 Ton", watts: 1000, defaultQty: 0 },
  { name: "Geyser / Water Heater", watts: 2000, defaultQty: 0 },
  { name: "Refrigerator", watts: 200, defaultQty: 1 },
  { name: "Washing Machine", watts: 500, defaultQty: 0 },
  { name: "Microwave Oven", watts: 1200, defaultQty: 0 },
  { name: "Mixer Grinder", watts: 750, defaultQty: 0 },
  { name: "Induction Cooktop", watts: 1800, defaultQty: 0 },
  { name: "TV (LED 40\")", watts: 100, defaultQty: 1 },
  { name: "Ceiling Fan", watts: 75, defaultQty: 3 },
  { name: "LED Tube Light", watts: 20, defaultQty: 4 },
  { name: "LED Bulb", watts: 10, defaultQty: 4 },
  { name: "Desktop Computer", watts: 300, defaultQty: 0 },
  { name: "Laptop Charger", watts: 65, defaultQty: 0 },
  { name: "Iron (Press)", watts: 1000, defaultQty: 0 },
  { name: "Hair Dryer", watts: 1200, defaultQty: 0 },
  { name: "Router / WiFi", watts: 15, defaultQty: 1 },
  { name: "Mobile Charger", watts: 20, defaultQty: 2 },
  { name: "Water Pump (0.5 HP)", watts: 375, defaultQty: 0 },
  { name: "Water Pump (1 HP)", watts: 750, defaultQty: 0 },
];

export default function ElectricalLoadCalculator() {
  const [quantities, setQuantities] = useState<number[]>(PRESET_APPLIANCES.map((a) => a.defaultQty));
  const [hoursPerDay, setHoursPerDay] = useState("8");
  const [unitRate, setUnitRate] = useState("7");

  const updateQty = (index: number, val: string) => {
    const n = parseInt(val) || 0;
    setQuantities((prev) => {
      const copy = [...prev];
      copy[index] = Math.max(0, n);
      return copy;
    });
  };

  const result = useMemo(() => {
    let totalWatts = 0;
    const breakdown: { name: string; watts: number; qty: number; subtotal: number }[] = [];

    PRESET_APPLIANCES.forEach((a, i) => {
      if (quantities[i] > 0) {
        const sub = a.watts * quantities[i];
        totalWatts += sub;
        breakdown.push({ name: a.name, watts: a.watts, qty: quantities[i], subtotal: sub });
      }
    });

    if (totalWatts === 0) return null;

    const totalKW = totalWatts / 1000;
    const hrs = parseFloat(hoursPerDay) || 8;
    const rate = parseFloat(unitRate) || 7;

    // Diversity factor (not all appliances run simultaneously)
    const diversityFactor = totalKW <= 5 ? 0.8 : totalKW <= 10 ? 0.7 : 0.6;
    const demandKW = totalKW * diversityFactor;

    // MCB recommendation
    const currentAt230V = (demandKW * 1000) / 230;
    let mcbRating: number;
    if (currentAt230V <= 16) mcbRating = 16;
    else if (currentAt230V <= 25) mcbRating = 25;
    else if (currentAt230V <= 32) mcbRating = 32;
    else if (currentAt230V <= 40) mcbRating = 40;
    else mcbRating = 63;

    // Wire size
    let wireSize: string;
    if (currentAt230V <= 10) wireSize = "1.5 sq mm";
    else if (currentAt230V <= 16) wireSize = "2.5 sq mm";
    else if (currentAt230V <= 25) wireSize = "4 sq mm";
    else if (currentAt230V <= 32) wireSize = "6 sq mm";
    else wireSize = "10 sq mm";

    // Phase recommendation
    const phase = demandKW > 5 ? "Three Phase" : "Single Phase";

    // Monthly cost
    const dailyUnits = totalKW * hrs;
    const monthlyUnits = dailyUnits * 30;
    const monthlyCost = monthlyUnits * rate;

    return {
      totalWatts,
      totalKW: totalKW.toFixed(2),
      demandKW: demandKW.toFixed(2),
      currentAt230V: currentAt230V.toFixed(1),
      mcbRating,
      wireSize,
      phase,
      dailyUnits: dailyUnits.toFixed(1),
      monthlyUnits: monthlyUnits.toFixed(0),
      monthlyCost,
      breakdown,
    };
  }, [quantities, hoursPerDay, unitRate]);

  const fmtCur = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Appliances & Quantity</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PRESET_APPLIANCES.map((a, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-sm text-gray-600 flex-1">{a.name} <span className="text-gray-400">({a.watts}W)</span></span>
              <input
                type="number"
                min="0"
                value={quantities[i] || ""}
                placeholder="0"
                onChange={(e) => updateQty(i, e.target.value)}
                className="calc-input w-20 text-center"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Avg. Usage Hours / Day</label>
          <input type="number" placeholder="8" value={hoursPerDay} onChange={(e) => setHoursPerDay(e.target.value)} className="calc-input" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Electricity Rate (per unit)</label>
          <input type="number" placeholder="7" value={unitRate} onChange={(e) => setUnitRate(e.target.value)} className="calc-input" />
        </div>
      </div>

      {result && (
        <div className="result-card space-y-4">
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-1">Total Connected Load</div>
            <div className="text-5xl font-extrabold text-indigo-600">{result.totalKW} kW</div>
            <div className="text-sm text-gray-400 mt-1">{result.totalWatts.toLocaleString("en-IN")} Watts | Demand: {result.demandKW} kW</div>
          </div>

          <div className="border-t border-gray-100 pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
              <div className="text-xs text-gray-400">MCB Rating</div>
              <div className="text-lg font-bold text-indigo-600">{result.mcbRating} A</div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
              <div className="text-xs text-gray-400">Wire Size</div>
              <div className="text-lg font-bold text-green-600">{result.wireSize}</div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
              <div className="text-xs text-gray-400">Meter Type</div>
              <div className="text-lg font-bold text-blue-600">{result.phase}</div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
              <div className="text-xs text-gray-400">Current</div>
              <div className="text-lg font-bold text-yellow-600">{result.currentAt230V} A</div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4 grid grid-cols-3 gap-3">
            <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
              <div className="text-xs text-gray-400">Daily Units</div>
              <div className="text-lg font-bold text-gray-600">{result.dailyUnits} kWh</div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
              <div className="text-xs text-gray-400">Monthly Units</div>
              <div className="text-lg font-bold text-gray-600">{result.monthlyUnits} kWh</div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
              <div className="text-xs text-gray-400">Monthly Cost (Est.)</div>
              <div className="text-lg font-bold text-red-600">{fmtCur(result.monthlyCost)}</div>
            </div>
          </div>

          {/* Load breakdown */}
          <div className="border-t border-gray-100 pt-4">
            <div className="text-sm font-semibold text-gray-700 mb-2">Load Breakdown</div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-2 text-left font-semibold text-gray-600">Appliance</th>
                    <th className="p-2 text-center font-semibold text-gray-600">Watts</th>
                    <th className="p-2 text-center font-semibold text-gray-600">Qty</th>
                    <th className="p-2 text-right font-semibold text-gray-600">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {result.breakdown.map((b, i) => (
                    <tr key={i}>
                      <td className="p-2">{b.name}</td>
                      <td className="p-2 text-center">{b.watts}</td>
                      <td className="p-2 text-center">{b.qty}</td>
                      <td className="p-2 text-right font-medium">{b.subtotal.toLocaleString("en-IN")} W</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
