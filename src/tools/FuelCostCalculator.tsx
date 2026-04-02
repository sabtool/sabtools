"use client";
import { useState, useMemo } from "react";

const FUEL_PRESETS = [
  { label: "Petrol", price: "105" },
  { label: "Diesel", price: "92" },
  { label: "CNG", price: "76" },
];

export default function FuelCostCalculator() {
  const [distance, setDistance] = useState("");
  const [mileage, setMileage] = useState("");
  const [fuelPrice, setFuelPrice] = useState("105");
  const [fuelType, setFuelType] = useState("Petrol");

  const result = useMemo(() => {
    const d = parseFloat(distance);
    const m = parseFloat(mileage);
    const p = parseFloat(fuelPrice);
    if (!d || !m || !p || d <= 0 || m <= 0 || p <= 0) return null;
    const fuelNeeded = d / m;
    const totalCost = fuelNeeded * p;
    const costPerKm = totalCost / d;
    return { fuelNeeded, totalCost, costPerKm };
  }, [distance, mileage, fuelPrice]);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(n);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Distance (km)</label>
          <input
            type="number"
            placeholder="e.g. 500"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            className="calc-input"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Vehicle Mileage (km/l)</label>
          <input
            type="number"
            placeholder="e.g. 15"
            value={mileage}
            onChange={(e) => setMileage(e.target.value)}
            className="calc-input"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Fuel Price (per litre)</label>
        <div className="flex gap-2 mb-3">
          {FUEL_PRESETS.map((f) => (
            <button
              key={f.label}
              onClick={() => { setFuelPrice(f.price); setFuelType(f.label); }}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
                fuelType === f.label ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {f.label} ({"\u20B9"}{f.price})
            </button>
          ))}
        </div>
        <input
          type="number"
          placeholder="e.g. 105"
          value={fuelPrice}
          onChange={(e) => { setFuelPrice(e.target.value); setFuelType(""); }}
          className="calc-input"
        />
      </div>

      {result && (
        <div className="result-card grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-xs font-medium text-gray-500 mb-1">Fuel Needed</div>
            <div className="text-2xl font-extrabold text-indigo-600">{result.fuelNeeded.toFixed(2)}</div>
            <div className="text-xs text-gray-400">litres</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-xs font-medium text-gray-500 mb-1">Total Cost</div>
            <div className="text-2xl font-extrabold text-green-600">{fmt(result.totalCost)}</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-xs font-medium text-gray-500 mb-1">Cost per km</div>
            <div className="text-2xl font-extrabold text-orange-600">{fmt(result.costPerKm)}</div>
          </div>
        </div>
      )}
    </div>
  );
}
