"use client";
import { useState, useMemo } from "react";

export default function MileageCalculator() {
  const [mode, setMode] = useState<"mileage" | "distance">("mileage");
  const [distance, setDistance] = useState(250);
  const [fuel, setFuel] = useState(18);
  const [fuelType, setFuelType] = useState<"Petrol" | "Diesel" | "CNG">("Petrol");
  const [claimedMileage, setClaimedMileage] = useState(20);
  const [fuelAmount, setFuelAmount] = useState(2000);
  const [vehicleMileage, setVehicleMileage] = useState(15);

  const fuelPrices: Record<string, number> = { Petrol: 104.5, Diesel: 90.5, CNG: 76 };
  const fuelPrice = fuelPrices[fuelType];

  const fmt = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(n);

  const mileageResult = useMemo(() => {
    if (mode !== "mileage" || distance <= 0 || fuel <= 0) return null;
    const mileage = distance / fuel;
    const costPerKm = (fuel * fuelPrice) / distance;
    const totalCost = fuel * fuelPrice;
    const claimedDiff = claimedMileage > 0 ? ((mileage - claimedMileage) / claimedMileage) * 100 : 0;
    return { mileage, costPerKm, totalCost, claimedDiff };
  }, [mode, distance, fuel, fuelPrice, claimedMileage]);

  const distanceResult = useMemo(() => {
    if (mode !== "distance" || fuelAmount <= 0 || vehicleMileage <= 0) return null;
    const liters = fuelAmount / fuelPrice;
    const possibleDistance = liters * vehicleMileage;
    const costPerKm = fuelPrice / vehicleMileage;
    return { liters, possibleDistance, costPerKm };
  }, [mode, fuelAmount, vehicleMileage, fuelPrice]);

  return (
    <div className="space-y-8">
      <div className="flex gap-2">
        <button onClick={() => setMode("mileage")} className={mode === "mileage" ? "btn-primary" : "btn-secondary"}>
          Calculate Mileage
        </button>
        <button onClick={() => setMode("distance")} className={mode === "distance" ? "btn-primary" : "btn-secondary"}>
          Fuel to Distance
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-semibold text-gray-700">Fuel Type</label>
          <select className="calc-input" value={fuelType} onChange={(e) => setFuelType(e.target.value as typeof fuelType)}>
            <option value="Petrol">Petrol ({fmt(fuelPrices.Petrol)}/L)</option>
            <option value="Diesel">Diesel ({fmt(fuelPrices.Diesel)}/L)</option>
            <option value="CNG">CNG ({fmt(fuelPrices.CNG)}/kg)</option>
          </select>
        </div>

        {mode === "mileage" ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700">Distance Traveled (km)</label>
              <input type="number" className="calc-input" value={distance} onChange={(e) => setDistance(+e.target.value)} min={0} />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">Fuel Consumed (liters)</label>
              <input type="number" className="calc-input" value={fuel} onChange={(e) => setFuel(+e.target.value)} min={0} step={0.1} />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">Claimed Mileage (km/l)</label>
              <input type="number" className="calc-input" value={claimedMileage} onChange={(e) => setClaimedMileage(+e.target.value)} min={0} />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700">Fuel Amount (Rs)</label>
              <input type="number" className="calc-input" value={fuelAmount} onChange={(e) => setFuelAmount(+e.target.value)} min={0} />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">Vehicle Mileage (km/l)</label>
              <input type="number" className="calc-input" value={vehicleMileage} onChange={(e) => setVehicleMileage(+e.target.value)} min={0} step={0.1} />
            </div>
          </div>
        )}
      </div>

      {mode === "mileage" && mileageResult && (
        <div className="result-card space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Actual Mileage</div>
              <div className="text-2xl font-extrabold text-indigo-600">{mileageResult.mileage.toFixed(2)} km/l</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Cost per km</div>
              <div className="text-2xl font-extrabold text-emerald-600">{fmt(mileageResult.costPerKm)}</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Total Fuel Cost</div>
              <div className="text-2xl font-extrabold text-gray-800">{fmt(mileageResult.totalCost)}</div>
            </div>
          </div>
          {claimedMileage > 0 && (
            <div className={`rounded-xl p-4 text-center ${mileageResult.claimedDiff >= 0 ? "bg-green-50" : "bg-red-50"}`}>
              <p className="text-sm font-semibold">
                {mileageResult.claimedDiff >= 0 ? "Your vehicle is performing " : "Your vehicle is underperforming by "}
                <span className={`font-bold ${mileageResult.claimedDiff >= 0 ? "text-green-700" : "text-red-700"}`}>
                  {Math.abs(mileageResult.claimedDiff).toFixed(1)}%
                </span>
                {mileageResult.claimedDiff >= 0 ? " better than claimed mileage" : " compared to claimed mileage"}
              </p>
            </div>
          )}
        </div>
      )}

      {mode === "distance" && distanceResult && (
        <div className="result-card space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Fuel You Get</div>
              <div className="text-2xl font-extrabold text-indigo-600">{distanceResult.liters.toFixed(2)} L</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Distance Possible</div>
              <div className="text-2xl font-extrabold text-emerald-600">{distanceResult.possibleDistance.toFixed(1)} km</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Cost per km</div>
              <div className="text-2xl font-extrabold text-gray-800">{fmt(distanceResult.costPerKm)}</div>
            </div>
          </div>
        </div>
      )}

      {/* Mileage comparison */}
      <div className="result-card space-y-3">
        <h3 className="text-lg font-bold text-gray-800">Average Mileage Reference (India)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-2 text-gray-500">Vehicle Type</th>
                <th className="text-center py-2 px-2 text-gray-500">Petrol</th>
                <th className="text-center py-2 px-2 text-gray-500">Diesel</th>
                <th className="text-center py-2 px-2 text-gray-500">CNG</th>
              </tr>
            </thead>
            <tbody>
              {[
                { type: "Small Car (WagonR, i10)", petrol: "18-22", diesel: "22-26", cng: "25-30" },
                { type: "Sedan (City, Verna)", petrol: "14-18", diesel: "18-22", cng: "20-25" },
                { type: "SUV (Creta, Seltos)", petrol: "12-16", diesel: "16-20", cng: "—" },
                { type: "Large SUV (Fortuner)", petrol: "8-12", diesel: "12-15", cng: "—" },
                { type: "Bike (100-150cc)", petrol: "50-70", diesel: "—", cng: "—" },
                { type: "Scooter", petrol: "40-55", diesel: "—", cng: "—" },
              ].map((v) => (
                <tr key={v.type} className="border-b border-gray-100">
                  <td className="py-2 px-2 font-medium">{v.type}</td>
                  <td className="text-center py-2 px-2">{v.petrol} km/l</td>
                  <td className="text-center py-2 px-2">{v.diesel} km/l</td>
                  <td className="text-center py-2 px-2">{v.cng} km/kg</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
