"use client";
import { useState, useMemo } from "react";

interface Slab {
  upTo: number;
  rate: number;
  label: string;
}

const STATE_TARIFFS: Record<string, { slabs: Slab[]; fixedCharge: number; duty: number }> = {
  Maharashtra: {
    slabs: [
      { upTo: 100, rate: 4.71, label: "0–100 units" },
      { upTo: 300, rate: 7.88, label: "101–300 units" },
      { upTo: 500, rate: 10.33, label: "301–500 units" },
      { upTo: Infinity, rate: 12.14, label: "Above 500 units" },
    ],
    fixedCharge: 100,
    duty: 16,
  },
  Delhi: {
    slabs: [
      { upTo: 200, rate: 3.0, label: "0–200 units" },
      { upTo: 400, rate: 4.5, label: "201–400 units" },
      { upTo: 800, rate: 6.5, label: "401–800 units" },
      { upTo: Infinity, rate: 7.75, label: "Above 800 units" },
    ],
    fixedCharge: 40,
    duty: 8,
  },
  Karnataka: {
    slabs: [
      { upTo: 50, rate: 4.1, label: "0–50 units" },
      { upTo: 100, rate: 5.55, label: "51–100 units" },
      { upTo: 200, rate: 7.1, label: "101–200 units" },
      { upTo: Infinity, rate: 8.15, label: "Above 200 units" },
    ],
    fixedCharge: 65,
    duty: 9,
  },
  "Tamil Nadu": {
    slabs: [
      { upTo: 100, rate: 0, label: "0–100 units (Free)" },
      { upTo: 200, rate: 2.5, label: "101–200 units" },
      { upTo: 500, rate: 4.6, label: "201–500 units" },
      { upTo: Infinity, rate: 6.6, label: "Above 500 units" },
    ],
    fixedCharge: 30,
    duty: 5,
  },
  "Uttar Pradesh": {
    slabs: [
      { upTo: 150, rate: 3.85, label: "0–150 units" },
      { upTo: 300, rate: 4.9, label: "151–300 units" },
      { upTo: 500, rate: 5.9, label: "301–500 units" },
      { upTo: Infinity, rate: 6.9, label: "Above 500 units" },
    ],
    fixedCharge: 70,
    duty: 15,
  },
  Gujarat: {
    slabs: [
      { upTo: 50, rate: 3.2, label: "0–50 units" },
      { upTo: 100, rate: 3.7, label: "51–100 units" },
      { upTo: 250, rate: 4.75, label: "101–250 units" },
      { upTo: Infinity, rate: 5.5, label: "Above 250 units" },
    ],
    fixedCharge: 45,
    duty: 15,
  },
};

const STATES = Object.keys(STATE_TARIFFS).sort();

export default function ElectricityBillCalculator() {
  const [units, setUnits] = useState("");
  const [state, setState] = useState("Maharashtra");

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  const fmtNum = (n: number) =>
    new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(n);

  const result = useMemo(() => {
    const consumed = parseFloat(units);
    if (!consumed || consumed <= 0) return null;

    const tariff = STATE_TARIFFS[state];
    const breakdown: { label: string; units: number; rate: number; amount: number }[] = [];
    let remaining = consumed;
    let prevUpTo = 0;
    let energyCharge = 0;

    for (const slab of tariff.slabs) {
      if (remaining <= 0) break;
      const slabUnits = Math.min(remaining, slab.upTo - prevUpTo);
      const amount = slabUnits * slab.rate;
      breakdown.push({ label: slab.label, units: slabUnits, rate: slab.rate, amount });
      energyCharge += amount;
      remaining -= slabUnits;
      prevUpTo = slab.upTo;
    }

    const fixedCharge = tariff.fixedCharge;
    const electricityDuty = (energyCharge * tariff.duty) / 100;
    const totalBill = energyCharge + fixedCharge + electricityDuty;

    return { breakdown, energyCharge, fixedCharge, electricityDuty, totalBill, dutyPercent: tariff.duty };
  }, [units, state]);

  return (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800">
        <strong>Note:</strong> Tariff rates are approximate domestic (residential) rates and may vary by distribution
        company and category. Actual bills may include additional surcharges.
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Units Consumed (kWh)</label>
          <input
            type="number"
            placeholder="e.g. 350"
            value={units}
            onChange={(e) => setUnits(e.target.value)}
            className="calc-input"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">State</label>
          <select value={state} onChange={(e) => setState(e.target.value)} className="calc-input">
            {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {result && (
        <div className="result-card space-y-4">
          <div className="text-center mb-2">
            <div className="text-xs font-medium text-gray-500">Estimated Electricity Bill</div>
            <div className="text-4xl font-extrabold text-indigo-600 mt-1">{fmt(result.totalBill)}</div>
          </div>

          <h4 className="text-sm font-bold text-gray-700">Slab-wise Breakdown</h4>
          <div className="space-y-2">
            {result.breakdown.map((slab, i) => (
              <div key={i} className="flex justify-between items-center bg-white rounded-lg p-3 shadow-sm">
                <div>
                  <span className="text-sm text-gray-600">{slab.label}</span>
                  <span className="text-xs text-gray-400 ml-2">({fmtNum(slab.units)} units x ₹{slab.rate})</span>
                </div>
                <span className="text-sm font-bold text-gray-800">{fmt(slab.amount)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-dashed border-gray-300 pt-3 space-y-2">
            <div className="flex justify-between items-center bg-white rounded-lg p-3 shadow-sm">
              <span className="text-sm text-gray-600">Energy Charge</span>
              <span className="text-sm font-bold text-gray-800">{fmt(result.energyCharge)}</span>
            </div>
            <div className="flex justify-between items-center bg-white rounded-lg p-3 shadow-sm">
              <span className="text-sm text-gray-600">Fixed / Demand Charge</span>
              <span className="text-sm font-bold text-gray-800">{fmt(result.fixedCharge)}</span>
            </div>
            <div className="flex justify-between items-center bg-white rounded-lg p-3 shadow-sm">
              <span className="text-sm text-gray-600">Electricity Duty ({result.dutyPercent}%)</span>
              <span className="text-sm font-bold text-gray-800">{fmt(result.electricityDuty)}</span>
            </div>
          </div>

          <div className="bg-indigo-50 rounded-xl p-4 text-center border border-indigo-200">
            <div className="text-xs font-medium text-indigo-700 mb-1">Total Bill Amount</div>
            <div className="text-3xl font-extrabold text-indigo-600">{fmt(result.totalBill)}</div>
            <div className="text-xs text-indigo-400 mt-1">For {units} units in {state}</div>
          </div>
        </div>
      )}
    </div>
  );
}
