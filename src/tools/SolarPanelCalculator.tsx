"use client";
import { useState, useMemo } from "react";

const CITIES: Record<string, number> = {
  "Delhi": 5.5,
  "Mumbai": 5.0,
  "Chennai": 5.5,
  "Bangalore": 5.2,
  "Hyderabad": 5.5,
  "Kolkata": 4.5,
  "Pune": 5.3,
  "Ahmedabad": 5.6,
  "Jaipur": 5.8,
  "Lucknow": 5.0,
  "Chandigarh": 5.2,
  "Bhopal": 5.4,
  "Nagpur": 5.5,
  "Indore": 5.4,
  "Coimbatore": 5.3,
  "Thiruvananthapuram": 5.0,
  "Jodhpur": 6.0,
  "Udaipur": 5.7,
};

export default function SolarPanelCalculator() {
  const [monthlyBill, setMonthlyBill] = useState(3000);
  const [rate, setRate] = useState(8);
  const [city, setCity] = useState("Delhi");
  const [roofArea, setRoofArea] = useState(300);

  const result = useMemo(() => {
    if (monthlyBill <= 0 || rate <= 0) return null;

    const monthlyUnits = monthlyBill / rate;
    const dailyUnits = monthlyUnits / 30;
    const sunHours = CITIES[city] || 5;

    // System size = dailyUnits / sunHours / 0.8 (80% efficiency factor)
    const systemSizeKw = dailyUnits / sunHours / 0.8;
    const panelWatt = 400;
    const panelsNeeded = Math.ceil((systemSizeKw * 1000) / panelWatt);

    // Each 1kW panel needs ~100 sq ft
    const areaNeeded = systemSizeKw * 100;
    const fitsOnRoof = roofArea >= areaNeeded;

    // Adjusted system if roof is limiting
    const actualSystemKw = fitsOnRoof ? systemSizeKw : roofArea / 100;
    const actualPanels = Math.ceil((actualSystemKw * 1000) / panelWatt);

    const costPerKw = 50000;
    const estimatedCost = actualSystemKw * costPerKw;

    const monthlyGeneration = actualSystemKw * sunHours * 30 * 0.8;
    const monthlySavings = Math.min(monthlyGeneration * rate, monthlyBill);
    const annualSavings = monthlySavings * 12;
    const paybackYears = estimatedCost / annualSavings;

    // 25 year savings (assuming 5% annual electricity price increase)
    let totalSavings25 = 0;
    let annualSavingsTemp = annualSavings;
    for (let i = 0; i < 25; i++) {
      totalSavings25 += annualSavingsTemp;
      annualSavingsTemp *= 1.05;
    }

    return {
      monthlyUnits,
      dailyUnits,
      sunHours,
      systemSizeKw,
      panelsNeeded,
      areaNeeded: areaNeeded.toFixed(0),
      fitsOnRoof,
      actualSystemKw,
      actualPanels,
      estimatedCost,
      monthlySavings,
      annualSavings,
      paybackYears,
      totalSavings25,
      monthlyGeneration,
    };
  }, [monthlyBill, rate, city, roofArea]);

  const fmt = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Monthly Electricity Bill</label>
          <div className="flex items-center gap-1">
            <span className="text-gray-500">₹</span>
            <input type="number" min={100} step={100} value={monthlyBill} onChange={(e) => setMonthlyBill(+e.target.value)} className="calc-input" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Electricity Rate (per unit)</label>
          <div className="flex items-center gap-1">
            <span className="text-gray-500">₹</span>
            <input type="number" min={1} step={0.5} value={rate} onChange={(e) => setRate(+e.target.value)} className="calc-input" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">City / Location</label>
          <select value={city} onChange={(e) => setCity(e.target.value)} className="calc-input">
            {Object.keys(CITIES).map((c) => (
              <option key={c} value={c}>{c} ({CITIES[c]}h avg sun)</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Available Roof Area (sq ft)</label>
          <input type="number" min={50} step={10} value={roofArea} onChange={(e) => setRoofArea(+e.target.value)} className="calc-input" />
        </div>
      </div>

      {result && (
        <>
          <div className="result-card space-y-4">
            <h3 className="text-lg font-bold text-gray-800">Solar System Recommendation</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <div className="text-xs font-medium text-gray-500 mb-1">System Size</div>
                <div className="text-2xl font-extrabold text-indigo-600">{result.actualSystemKw.toFixed(2)} kW</div>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <div className="text-xs font-medium text-gray-500 mb-1">Panels Needed</div>
                <div className="text-2xl font-extrabold text-amber-600">{result.actualPanels}</div>
                <div className="text-xs text-gray-400">400W each</div>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <div className="text-xs font-medium text-gray-500 mb-1">Estimated Cost</div>
                <div className="text-2xl font-extrabold text-emerald-600">{fmt(result.estimatedCost)}</div>
                <div className="text-xs text-gray-400">at ₹50,000/kW</div>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <div className="text-xs font-medium text-gray-500 mb-1">Monthly Savings</div>
                <div className="text-2xl font-extrabold text-green-600">{fmt(result.monthlySavings)}</div>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <div className="text-xs font-medium text-gray-500 mb-1">Payback Period</div>
                <div className="text-2xl font-extrabold text-blue-600">{result.paybackYears.toFixed(1)} yrs</div>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <div className="text-xs font-medium text-gray-500 mb-1">25-Year Savings</div>
                <div className="text-2xl font-extrabold text-purple-600">{fmt(result.totalSavings25)}</div>
              </div>
            </div>

            {!result.fitsOnRoof && (
              <div className="bg-amber-50 p-3 rounded-lg text-sm text-amber-800">
                Your roof area ({roofArea} sq ft) is smaller than required ({result.areaNeeded} sq ft). System size has been adjusted to fit your roof.
              </div>
            )}
          </div>

          <div className="result-card">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Consumption Analysis</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-gray-500">Monthly consumption</div>
                <div className="font-bold">{result.monthlyUnits.toFixed(0)} units</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-gray-500">Daily consumption</div>
                <div className="font-bold">{result.dailyUnits.toFixed(1)} units</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-gray-500">Avg sun hours ({city})</div>
                <div className="font-bold">{result.sunHours} hours/day</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-gray-500">Monthly generation</div>
                <div className="font-bold">{result.monthlyGeneration.toFixed(0)} units</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-gray-500">Roof area needed</div>
                <div className="font-bold">{result.areaNeeded} sq ft</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-gray-500">Annual savings</div>
                <div className="font-bold">{fmt(result.annualSavings)}</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
