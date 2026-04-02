"use client";
import { useState, useMemo } from "react";

interface Appliance {
  id: number;
  name: string;
  wattage: number;
  quantity: number;
  hoursPerDay: number;
}

const PRESETS: Record<string, number> = {
  "Ceiling Fan": 75,
  "AC (1 Ton)": 1000,
  "AC (1.5 Ton)": 1500,
  "AC (2 Ton)": 2000,
  "Refrigerator": 150,
  "LED TV (32\")": 50,
  "LED TV (55\")": 100,
  "Washing Machine": 500,
  "Iron": 1000,
  "Geyser (15L)": 2000,
  "Geyser (25L)": 3000,
  "LED Bulb (9W)": 9,
  "LED Bulb (12W)": 12,
  "Tube Light": 40,
  "Mixer Grinder": 750,
  "Microwave Oven": 1200,
  "Water Purifier (RO)": 60,
  "Computer / Desktop": 200,
  "Laptop": 65,
  "WiFi Router": 15,
  "Mobile Charger": 10,
  "Exhaust Fan": 40,
  "Cooler (Desert)": 200,
  "Induction Cooktop": 2000,
  "Room Heater": 2000,
  "Hair Dryer": 1200,
  "Custom": 0,
};

let nextId = 1;

export default function PowerConsumptionCalculator() {
  const [appliances, setAppliances] = useState<Appliance[]>([
    { id: nextId++, name: "Ceiling Fan", wattage: 75, quantity: 3, hoursPerDay: 10 },
    { id: nextId++, name: "LED Bulb (9W)", wattage: 9, quantity: 5, hoursPerDay: 6 },
    { id: nextId++, name: "Refrigerator", wattage: 150, quantity: 1, hoursPerDay: 24 },
  ]);
  const [rate, setRate] = useState(8);

  const addAppliance = () => {
    setAppliances([...appliances, { id: nextId++, name: "Ceiling Fan", wattage: 75, quantity: 1, hoursPerDay: 5 }]);
  };

  const removeAppliance = (id: number) => {
    setAppliances(appliances.filter((a) => a.id !== id));
  };

  const updateAppliance = (id: number, field: keyof Appliance, value: string | number) => {
    setAppliances(appliances.map((a) => {
      if (a.id !== id) return a;
      if (field === "name") {
        const preset = PRESETS[value as string];
        return { ...a, name: value as string, wattage: preset !== undefined && preset > 0 ? preset : a.wattage };
      }
      return { ...a, [field]: +value };
    }));
  };

  const result = useMemo(() => {
    const breakdown = appliances.map((a) => {
      const dailyKwh = (a.wattage * a.quantity * a.hoursPerDay) / 1000;
      const monthlyKwh = dailyKwh * 30;
      const monthlyCost = monthlyKwh * rate;
      return { ...a, dailyKwh, monthlyKwh, monthlyCost };
    });
    const totalDailyKwh = breakdown.reduce((s, b) => s + b.dailyKwh, 0);
    const totalMonthlyKwh = breakdown.reduce((s, b) => s + b.monthlyKwh, 0);
    const totalMonthlyCost = breakdown.reduce((s, b) => s + b.monthlyCost, 0);
    return { breakdown, totalDailyKwh, totalMonthlyKwh, totalMonthlyCost };
  }, [appliances, rate]);

  const fmt = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="space-y-8">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Electricity Rate (per unit)</label>
        <div className="flex items-center gap-2">
          <span className="text-gray-500">₹</span>
          <input type="number" min={1} step={0.5} value={rate} onChange={(e) => setRate(+e.target.value)} className="calc-input" />
          <span className="text-sm text-gray-500">/kWh</span>
        </div>
      </div>

      {/* Appliance list */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold text-gray-700">Appliances</h3>
          <button onClick={addAppliance} className="btn-primary text-sm">+ Add Appliance</button>
        </div>

        {appliances.map((a) => (
          <div key={a.id} className="bg-white border rounded-xl p-3 space-y-2">
            <div className="flex gap-2 items-center">
              <select value={a.name} onChange={(e) => updateAppliance(a.id, "name", e.target.value)} className="calc-input flex-1 text-sm">
                {Object.keys(PRESETS).map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
              <button onClick={() => removeAppliance(a.id)} className="text-red-400 hover:text-red-600 text-lg font-bold px-2">x</button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-xs text-gray-500">Wattage (W)</label>
                <input type="number" min={1} value={a.wattage} onChange={(e) => updateAppliance(a.id, "wattage", e.target.value)} className="calc-input text-sm" />
              </div>
              <div>
                <label className="text-xs text-gray-500">Quantity</label>
                <input type="number" min={1} value={a.quantity} onChange={(e) => updateAppliance(a.id, "quantity", e.target.value)} className="calc-input text-sm" />
              </div>
              <div>
                <label className="text-xs text-gray-500">Hours/Day</label>
                <input type="number" min={0.5} step={0.5} max={24} value={a.hoursPerDay} onChange={(e) => updateAppliance(a.id, "hoursPerDay", e.target.value)} className="calc-input text-sm" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Results */}
      <div className="result-card space-y-4">
        <h3 className="text-lg font-bold text-gray-800">Total Consumption</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-xs font-medium text-gray-500 mb-1">Daily Usage</div>
            <div className="text-2xl font-extrabold text-indigo-600">{result.totalDailyKwh.toFixed(2)} kWh</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-xs font-medium text-gray-500 mb-1">Monthly Usage</div>
            <div className="text-2xl font-extrabold text-amber-600">{result.totalMonthlyKwh.toFixed(1)} kWh</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-xs font-medium text-gray-500 mb-1">Monthly Cost</div>
            <div className="text-2xl font-extrabold text-emerald-600">{fmt(result.totalMonthlyCost)}</div>
          </div>
        </div>

        {/* Breakdown */}
        <h4 className="text-sm font-bold text-gray-700 mt-4">Per-Appliance Breakdown</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left rounded-tl-lg">Appliance</th>
                <th className="p-2 text-center">Qty</th>
                <th className="p-2 text-center">W</th>
                <th className="p-2 text-center">Hrs</th>
                <th className="p-2 text-center">kWh/day</th>
                <th className="p-2 text-center">kWh/mo</th>
                <th className="p-2 text-right rounded-tr-lg">Cost/mo</th>
              </tr>
            </thead>
            <tbody>
              {result.breakdown.map((b) => (
                <tr key={b.id} className="border-t">
                  <td className="p-2">{b.name}</td>
                  <td className="p-2 text-center">{b.quantity}</td>
                  <td className="p-2 text-center">{b.wattage}</td>
                  <td className="p-2 text-center">{b.hoursPerDay}</td>
                  <td className="p-2 text-center">{b.dailyKwh.toFixed(2)}</td>
                  <td className="p-2 text-center">{b.monthlyKwh.toFixed(1)}</td>
                  <td className="p-2 text-right">{fmt(b.monthlyCost)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
