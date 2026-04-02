"use client";
import { useState, useMemo } from "react";

type Category = "domestic" | "commercial" | "industrial" | "agricultural";

interface Slab { upTo: number; rate: number; }
interface StateData { domestic: Slab[]; commercial: Slab[]; industrial: Slab[]; agricultural: Slab[]; }

const STATES: Record<string, StateData> = {
  "Maharashtra": {
    domestic: [{ upTo: 100, rate: 4.71 }, { upTo: 300, rate: 7.88 }, { upTo: 500, rate: 10.41 }, { upTo: Infinity, rate: 12.50 }],
    commercial: [{ upTo: 100, rate: 8.50 }, { upTo: 500, rate: 10.20 }, { upTo: Infinity, rate: 12.00 }],
    industrial: [{ upTo: 500, rate: 7.50 }, { upTo: Infinity, rate: 9.20 }],
    agricultural: [{ upTo: Infinity, rate: 3.50 }],
  },
  "Delhi": {
    domestic: [{ upTo: 200, rate: 3.00 }, { upTo: 400, rate: 4.50 }, { upTo: 800, rate: 6.50 }, { upTo: 1200, rate: 7.00 }, { upTo: Infinity, rate: 8.00 }],
    commercial: [{ upTo: Infinity, rate: 8.50 }],
    industrial: [{ upTo: Infinity, rate: 7.75 }],
    agricultural: [{ upTo: Infinity, rate: 3.00 }],
  },
  "Karnataka": {
    domestic: [{ upTo: 50, rate: 4.10 }, { upTo: 100, rate: 5.55 }, { upTo: 200, rate: 7.10 }, { upTo: Infinity, rate: 8.15 }],
    commercial: [{ upTo: Infinity, rate: 8.50 }],
    industrial: [{ upTo: Infinity, rate: 7.00 }],
    agricultural: [{ upTo: Infinity, rate: 3.85 }],
  },
  "Tamil Nadu": {
    domestic: [{ upTo: 100, rate: 0 }, { upTo: 200, rate: 2.50 }, { upTo: 500, rate: 4.60 }, { upTo: Infinity, rate: 6.60 }],
    commercial: [{ upTo: Infinity, rate: 7.80 }],
    industrial: [{ upTo: Infinity, rate: 6.35 }],
    agricultural: [{ upTo: Infinity, rate: 0 }],
  },
  "Gujarat": {
    domestic: [{ upTo: 50, rate: 3.20 }, { upTo: 200, rate: 3.95 }, { upTo: 400, rate: 4.85 }, { upTo: Infinity, rate: 5.40 }],
    commercial: [{ upTo: Infinity, rate: 6.80 }],
    industrial: [{ upTo: Infinity, rate: 5.60 }],
    agricultural: [{ upTo: Infinity, rate: 2.50 }],
  },
  "Uttar Pradesh": {
    domestic: [{ upTo: 150, rate: 3.85 }, { upTo: 300, rate: 4.90 }, { upTo: 500, rate: 5.85 }, { upTo: Infinity, rate: 6.75 }],
    commercial: [{ upTo: Infinity, rate: 7.50 }],
    industrial: [{ upTo: Infinity, rate: 6.20 }],
    agricultural: [{ upTo: Infinity, rate: 2.80 }],
  },
  "Rajasthan": {
    domestic: [{ upTo: 50, rate: 3.85 }, { upTo: 150, rate: 5.45 }, { upTo: 300, rate: 6.40 }, { upTo: Infinity, rate: 7.60 }],
    commercial: [{ upTo: Infinity, rate: 8.20 }],
    industrial: [{ upTo: Infinity, rate: 6.75 }],
    agricultural: [{ upTo: Infinity, rate: 4.00 }],
  },
  "West Bengal": {
    domestic: [{ upTo: 75, rate: 5.08 }, { upTo: 150, rate: 6.07 }, { upTo: 300, rate: 6.96 }, { upTo: Infinity, rate: 8.52 }],
    commercial: [{ upTo: Infinity, rate: 8.90 }],
    industrial: [{ upTo: Infinity, rate: 7.20 }],
    agricultural: [{ upTo: Infinity, rate: 3.10 }],
  },
  "Madhya Pradesh": {
    domestic: [{ upTo: 100, rate: 4.16 }, { upTo: 300, rate: 5.56 }, { upTo: Infinity, rate: 7.16 }],
    commercial: [{ upTo: Infinity, rate: 7.90 }],
    industrial: [{ upTo: Infinity, rate: 6.65 }],
    agricultural: [{ upTo: Infinity, rate: 2.50 }],
  },
  "Kerala": {
    domestic: [{ upTo: 50, rate: 3.15 }, { upTo: 100, rate: 3.70 }, { upTo: 200, rate: 5.20 }, { upTo: 300, rate: 6.40 }, { upTo: Infinity, rate: 7.60 }],
    commercial: [{ upTo: Infinity, rate: 7.45 }],
    industrial: [{ upTo: Infinity, rate: 5.85 }],
    agricultural: [{ upTo: Infinity, rate: 2.90 }],
  },
  "Punjab": {
    domestic: [{ upTo: 100, rate: 4.19 }, { upTo: 300, rate: 6.17 }, { upTo: Infinity, rate: 7.22 }],
    commercial: [{ upTo: Infinity, rate: 7.80 }],
    industrial: [{ upTo: Infinity, rate: 6.45 }],
    agricultural: [{ upTo: Infinity, rate: 0 }],
  },
  "Andhra Pradesh": {
    domestic: [{ upTo: 50, rate: 1.90 }, { upTo: 100, rate: 3.05 }, { upTo: 200, rate: 4.50 }, { upTo: 300, rate: 6.00 }, { upTo: Infinity, rate: 8.75 }],
    commercial: [{ upTo: Infinity, rate: 8.40 }],
    industrial: [{ upTo: Infinity, rate: 6.95 }],
    agricultural: [{ upTo: Infinity, rate: 2.10 }],
  },
  "Telangana": {
    domestic: [{ upTo: 50, rate: 1.90 }, { upTo: 100, rate: 3.05 }, { upTo: 200, rate: 5.00 }, { upTo: Infinity, rate: 8.00 }],
    commercial: [{ upTo: Infinity, rate: 8.10 }],
    industrial: [{ upTo: Infinity, rate: 6.80 }],
    agricultural: [{ upTo: Infinity, rate: 0 }],
  },
  "Bihar": {
    domestic: [{ upTo: 100, rate: 5.10 }, { upTo: 200, rate: 6.30 }, { upTo: Infinity, rate: 7.20 }],
    commercial: [{ upTo: Infinity, rate: 8.60 }],
    industrial: [{ upTo: Infinity, rate: 7.30 }],
    agricultural: [{ upTo: Infinity, rate: 4.50 }],
  },
  "Odisha": {
    domestic: [{ upTo: 50, rate: 3.10 }, { upTo: 200, rate: 4.80 }, { upTo: 400, rate: 5.80 }, { upTo: Infinity, rate: 6.20 }],
    commercial: [{ upTo: Infinity, rate: 7.10 }],
    industrial: [{ upTo: Infinity, rate: 5.50 }],
    agricultural: [{ upTo: Infinity, rate: 2.00 }],
  },
};

const STATE_NAMES = Object.keys(STATES).sort();

function calcBill(slabs: Slab[], units: number): number {
  let total = 0;
  let remaining = units;
  let prev = 0;
  for (const slab of slabs) {
    const slabUnits = Math.min(remaining, slab.upTo - prev);
    if (slabUnits <= 0) break;
    total += slabUnits * slab.rate;
    remaining -= slabUnits;
    prev = slab.upTo;
  }
  return total;
}

export default function ElectricityRateFinder() {
  const [state, setState] = useState("Maharashtra");
  const [category, setCategory] = useState<Category>("domestic");
  const [units, setUnits] = useState(200);
  const [compareMode, setCompareMode] = useState(false);

  const data = STATES[state];
  const slabs = data?.[category] || [];
  const bill = useMemo(() => calcBill(slabs, units), [slabs, units]);

  const comparison = useMemo(() => {
    return STATE_NAMES.map((s) => ({
      state: s,
      bill: calcBill(STATES[s][category], units),
    })).sort((a, b) => a.bill - b.bill);
  }, [category, units]);

  const fmt = (n: number) => `Rs ${n.toFixed(0)}`;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">State</label>
          <select className="calc-input" value={state} onChange={(e) => setState(e.target.value)}>
            {STATE_NAMES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">Category</label>
          <select className="calc-input" value={category} onChange={(e) => setCategory(e.target.value as Category)}>
            <option value="domestic">Domestic</option>
            <option value="commercial">Commercial</option>
            <option value="industrial">Industrial</option>
            <option value="agricultural">Agricultural</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">Monthly Units (kWh)</label>
          <input className="calc-input" type="number" min={0} value={units} onChange={(e) => setUnits(+e.target.value)} />
        </div>
      </div>

      {/* Slab Table */}
      <div className="result-card">
        <div className="text-sm font-semibold text-gray-700 mb-3">Rate Slabs - {state} ({category})</div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left p-2 text-gray-600">Slab (Units)</th>
              <th className="text-right p-2 text-gray-600">Rate (Rs/Unit)</th>
            </tr>
          </thead>
          <tbody>
            {slabs.map((s, i) => {
              const from = i === 0 ? 0 : slabs[i - 1].upTo;
              return (
                <tr key={i} className="border-b border-gray-100">
                  <td className="p-2 text-gray-700">{from} - {s.upTo === Infinity ? "Above" : s.upTo}</td>
                  <td className="p-2 text-right font-bold text-indigo-600">Rs {s.rate.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Bill */}
      <div className="result-card">
        <div className="text-center">
          <div className="text-xs text-gray-500 mb-1">Estimated Monthly Bill for {units} units</div>
          <div className="text-3xl font-extrabold text-indigo-600">{fmt(bill)}</div>
          <div className="text-sm text-gray-500 mt-1">Avg rate: Rs {units > 0 ? (bill / units).toFixed(2) : "0"}/unit</div>
        </div>
      </div>

      {/* Compare */}
      <div>
        <button className="btn-secondary" onClick={() => setCompareMode(!compareMode)}>
          {compareMode ? "Hide Comparison" : "Compare Across States"}
        </button>
      </div>

      {compareMode && (
        <div className="result-card">
          <div className="text-sm font-semibold text-gray-700 mb-3">Bill Comparison for {units} units ({category})</div>
          <div className="space-y-1">
            {comparison.map((c, i) => (
              <div key={c.state} className={`flex items-center justify-between p-2 rounded text-sm ${i === 0 ? "bg-green-50" : i === comparison.length - 1 ? "bg-red-50" : "bg-gray-50"}`}>
                <div className="flex items-center gap-2">
                  {i === 0 && <span className="text-green-600 text-xs font-bold">CHEAPEST</span>}
                  {i === comparison.length - 1 && <span className="text-red-600 text-xs font-bold">COSTLIEST</span>}
                  <span className={`font-medium ${c.state === state ? "text-indigo-700 font-bold" : "text-gray-700"}`}>{c.state}</span>
                </div>
                <span className="font-bold text-gray-800">{fmt(c.bill)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
        <div className="flex items-start gap-2">
          <span className="text-lg">{"\u2139\uFE0F"}</span>
          <div>
            <p className="font-semibold mb-1">Disclaimer</p>
            <p>Tariff rates approximate based on published state electricity board rates. Verify with your distribution company.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
