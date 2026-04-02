"use client";
import { useState, useMemo } from "react";

export default function VehicleDepreciationCalculator() {
  const [purchasePrice, setPurchasePrice] = useState(1200000);
  const [purchaseYear, setPurchaseYear] = useState(2020);
  const [vehicleType, setVehicleType] = useState<"car" | "bike" | "commercial">("car");

  const fmt = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  const currentYear = new Date().getFullYear();

  const depRates: Record<string, number> = {
    car: 15,
    bike: 20,
    commercial: 25,
  };

  const result = useMemo(() => {
    if (purchasePrice <= 0 || purchaseYear > currentYear) return null;

    const rate = depRates[vehicleType] / 100;
    const yearsOld = currentYear - purchaseYear;
    const maxYears = Math.max(yearsOld + 5, 15);

    // Written Down Value (WDV) method
    const yearWise: { year: number; openingValue: number; depreciation: number; closingValue: number; totalDepPct: number }[] = [];
    let currentValue = purchasePrice;

    for (let i = 0; i < maxYears; i++) {
      const yr = purchaseYear + i;
      const dep = currentValue * rate;
      const closing = currentValue - dep;
      const totalDepPct = ((purchasePrice - closing) / purchasePrice) * 100;
      yearWise.push({ year: yr, openingValue: currentValue, depreciation: dep, closingValue: Math.max(closing, 0), totalDepPct });
      currentValue = Math.max(closing, 0);
      if (currentValue <= 0) break;
    }

    const currentEntry = yearWise.find((y) => y.year === currentYear);
    const currentMarketValue = currentEntry ? currentEntry.closingValue : yearWise[yearWise.length - 1]?.closingValue || 0;
    const totalDepreciation = purchasePrice - currentMarketValue;
    const depPercent = (totalDepreciation / purchasePrice) * 100;

    return { currentMarketValue, totalDepreciation, depPercent, yearsOld, yearWise, rate: depRates[vehicleType] };
  }, [purchasePrice, purchaseYear, vehicleType, currentYear]);

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-700">Purchase Price</label>
            <input type="number" className="calc-input" value={purchasePrice} onChange={(e) => setPurchasePrice(+e.target.value)} min={0} step={10000} />
            <p className="text-xs text-gray-400 mt-1">{fmt(purchasePrice)}</p>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700">Purchase Year</label>
            <input type="number" className="calc-input" value={purchaseYear} onChange={(e) => setPurchaseYear(+e.target.value)} min={2000} max={currentYear} />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700">Vehicle Type</label>
            <select className="calc-input" value={vehicleType} onChange={(e) => setVehicleType(e.target.value as typeof vehicleType)}>
              <option value="car">Car (15% WDV)</option>
              <option value="bike">Bike/Scooter (20% WDV)</option>
              <option value="commercial">Commercial Vehicle (25% WDV)</option>
            </select>
          </div>
        </div>
      </div>

      {result && (
        <>
          <div className="result-card space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <div className="text-xs font-medium text-gray-500 mb-1">Current Value</div>
                <div className="text-2xl font-extrabold text-indigo-600">{fmt(result.currentMarketValue)}</div>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <div className="text-xs font-medium text-gray-500 mb-1">Total Depreciation</div>
                <div className="text-2xl font-extrabold text-red-500">{fmt(result.totalDepreciation)}</div>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <div className="text-xs font-medium text-gray-500 mb-1">Depreciation %</div>
                <div className="text-2xl font-extrabold text-amber-600">{result.depPercent.toFixed(1)}%</div>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <div className="text-xs font-medium text-gray-500 mb-1">Vehicle Age</div>
                <div className="text-2xl font-extrabold text-gray-800">{result.yearsOld} years</div>
              </div>
            </div>

            {/* Visual Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Current Value: {((result.currentMarketValue / purchasePrice) * 100).toFixed(1)}%</span>
                <span>Depreciation: {result.depPercent.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-red-100 rounded-full h-4 flex overflow-hidden">
                <div className="h-4 bg-gradient-to-r from-indigo-500 to-blue-500 transition-all" style={{ width: `${100 - result.depPercent}%` }} />
              </div>
            </div>
          </div>

          {/* Year-wise Table */}
          <div className="result-card space-y-3">
            <h3 className="text-lg font-bold text-gray-800">Year-wise Depreciation (WDV Method @ {result.rate}%)</h3>
            <div className="overflow-x-auto max-h-96 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-white">
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-2 text-gray-500">Year</th>
                    <th className="text-right py-2 px-2 text-gray-500">Opening Value</th>
                    <th className="text-right py-2 px-2 text-gray-500">Depreciation</th>
                    <th className="text-right py-2 px-2 text-gray-500">Closing Value</th>
                    <th className="text-right py-2 px-2 text-gray-500">Total Dep %</th>
                  </tr>
                </thead>
                <tbody>
                  {result.yearWise.map((y) => (
                    <tr key={y.year} className={`border-b border-gray-100 ${y.year === currentYear ? "bg-indigo-50 font-bold" : ""}`}>
                      <td className="py-2 px-2">{y.year} {y.year === currentYear ? "(Now)" : ""}</td>
                      <td className="text-right py-2 px-2">{fmt(y.openingValue)}</td>
                      <td className="text-right py-2 px-2 text-red-500">{fmt(y.depreciation)}</td>
                      <td className="text-right py-2 px-2">{fmt(y.closingValue)}</td>
                      <td className="text-right py-2 px-2">{y.totalDepPct.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-400 italic">
              * Written Down Value (WDV) method is standard in India for income tax purposes. Actual resale value may differ based on condition, brand, demand and mileage.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
