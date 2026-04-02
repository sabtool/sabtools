"use client";
import { useState, useMemo } from "react";

export default function RoadTripPlanner() {
  const [distance, setDistance] = useState(500);
  const [mileage, setMileage] = useState(15);
  const [fuelPrice, setFuelPrice] = useState(104.5);
  const [passengers, setPassengers] = useState(4);
  const [tollEstimate, setTollEstimate] = useState(500);
  const [avgSpeed, setAvgSpeed] = useState(60);

  const fmt = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  const result = useMemo(() => {
    if (distance <= 0 || mileage <= 0 || fuelPrice <= 0 || passengers <= 0) return null;

    const fuelNeeded = distance / mileage;
    const fuelCost = fuelNeeded * fuelPrice;
    const totalCost = fuelCost + tollEstimate;
    const costPerPerson = totalCost / passengers;
    const rawHours = distance / avgSpeed;
    // Add breaks: 15 min every 2 hours
    const breakCount = Math.floor(rawHours / 2);
    const breakTime = breakCount * 0.25;
    const totalHours = rawHours + breakTime;
    const hours = Math.floor(totalHours);
    const mins = Math.round((totalHours - hours) * 60);
    const costPerKm = totalCost / distance;

    return { fuelNeeded, fuelCost, totalCost, costPerPerson, hours, mins, breakCount, costPerKm, totalHours };
  }, [distance, mileage, fuelPrice, passengers, tollEstimate, avgSpeed]);

  const tips = [
    "Check tyre pressure before long trips - correct pressure improves mileage by 3-5%",
    "Start early morning (5-6 AM) to avoid traffic and heat",
    "Take a 15-minute break every 2 hours to stay alert",
    "Keep emergency kit: first aid, spare tyre, jack, torch, jumper cables",
    "Download offline maps before the trip in case of poor network",
    "Carry sufficient water and snacks for all passengers",
    "Check vehicle oil, coolant, and brake fluid levels",
    "Keep FASTag balance adequate for toll plazas",
    "Avoid driving at night on unfamiliar routes",
    "Share your live location with family members",
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-700">Distance (km)</label>
            <input type="number" className="calc-input" value={distance} onChange={(e) => setDistance(+e.target.value)} min={1} />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700">Vehicle Mileage (km/l)</label>
            <input type="number" className="calc-input" value={mileage} onChange={(e) => setMileage(+e.target.value)} min={1} step={0.5} />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700">Fuel Price (Rs/L)</label>
            <input type="number" className="calc-input" value={fuelPrice} onChange={(e) => setFuelPrice(+e.target.value)} min={1} step={0.5} />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-700">Passengers</label>
            <input type="number" className="calc-input" value={passengers} onChange={(e) => setPassengers(+e.target.value)} min={1} max={20} />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700">Toll Estimate (Rs)</label>
            <input type="number" className="calc-input" value={tollEstimate} onChange={(e) => setTollEstimate(+e.target.value)} min={0} />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700">Avg Speed (km/h)</label>
            <input type="number" className="calc-input" value={avgSpeed} onChange={(e) => setAvgSpeed(+e.target.value)} min={10} max={120} />
          </div>
        </div>
      </div>

      {result && (
        <div className="result-card space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Fuel Needed</div>
              <div className="text-2xl font-extrabold text-indigo-600">{result.fuelNeeded.toFixed(1)} L</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Fuel Cost</div>
              <div className="text-2xl font-extrabold text-emerald-600">{fmt(result.fuelCost)}</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Total Trip Cost</div>
              <div className="text-2xl font-extrabold text-gray-800">{fmt(result.totalCost)}</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Cost per Person</div>
              <div className="text-2xl font-extrabold text-purple-600">{fmt(result.costPerPerson)}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 text-center">
              <div className="text-xs font-medium text-gray-500 mb-1">Estimated Time</div>
              <div className="text-xl font-extrabold text-blue-700">{result.hours}h {result.mins}m</div>
              <div className="text-xs text-gray-400">(incl. {result.breakCount} break{result.breakCount !== 1 ? "s" : ""})</div>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 text-center">
              <div className="text-xs font-medium text-gray-500 mb-1">Cost per km</div>
              <div className="text-xl font-extrabold text-emerald-700">{fmt(result.costPerKm)}</div>
            </div>
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 text-center">
              <div className="text-xs font-medium text-gray-500 mb-1">Toll Cost</div>
              <div className="text-xl font-extrabold text-amber-700">{fmt(tollEstimate)}</div>
            </div>
          </div>

          {/* Cost Breakdown */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-2 text-gray-500">Item</th>
                  <th className="text-right py-2 px-2 text-gray-500">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-2 px-2">Fuel ({result.fuelNeeded.toFixed(1)}L x {fmt(fuelPrice)})</td>
                  <td className="text-right py-2 px-2">{fmt(result.fuelCost)}</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2 px-2">Tolls</td>
                  <td className="text-right py-2 px-2">{fmt(tollEstimate)}</td>
                </tr>
                <tr className="border-b border-gray-200 font-bold">
                  <td className="py-2 px-2">Total</td>
                  <td className="text-right py-2 px-2 text-indigo-600">{fmt(result.totalCost)}</td>
                </tr>
                <tr>
                  <td className="py-2 px-2 text-gray-500">Per person ({passengers})</td>
                  <td className="text-right py-2 px-2 font-bold text-purple-600">{fmt(result.costPerPerson)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Road Trip Tips */}
      <div className="result-card space-y-3">
        <h3 className="text-lg font-bold text-gray-800">Road Trip Tips</h3>
        <ul className="space-y-2">
          {tips.map((tip, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
              <span className="text-indigo-500 font-bold mt-0.5">{i + 1}.</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
