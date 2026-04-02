"use client";
import { useState, useMemo } from "react";

interface CropWater {
  name: string;
  waterMM: number; // total water requirement in mm per crop cycle
  daysGrowth: number;
}

const cropWaterData: CropWater[] = [
  { name: "Rice (Paddy)", waterMM: 1200, daysGrowth: 120 },
  { name: "Wheat", waterMM: 450, daysGrowth: 120 },
  { name: "Sugarcane", waterMM: 2000, daysGrowth: 365 },
  { name: "Cotton", waterMM: 700, daysGrowth: 180 },
  { name: "Soybean", waterMM: 500, daysGrowth: 100 },
  { name: "Maize", waterMM: 600, daysGrowth: 110 },
  { name: "Pulses", waterMM: 350, daysGrowth: 90 },
  { name: "Vegetables", waterMM: 500, daysGrowth: 90 },
  { name: "Mustard", waterMM: 300, daysGrowth: 110 },
  { name: "Potato", waterMM: 500, daysGrowth: 100 },
];

type SoilType = "sandy" | "loamy" | "clay";
const soilEfficiency: Record<SoilType, { label: string; factor: number; note: string }> = {
  sandy: { label: "Sandy", factor: 1.3, note: "High drainage, needs 30% more water" },
  loamy: { label: "Loamy", factor: 1.0, note: "Ideal soil, balanced water retention" },
  clay: { label: "Clay", factor: 0.85, note: "High retention, needs 15% less water" },
};

export default function IrrigationCalculator() {
  const [selectedCrop, setSelectedCrop] = useState(0);
  const [landArea, setLandArea] = useState(5);
  const [soilType, setSoilType] = useState<SoilType>("loamy");
  const [pumpHP, setPumpHP] = useState(5);
  const [electricityRate, setElectricityRate] = useState(6); // ₹ per unit (kWh)

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
  const fmtNum = (n: number) => new Intl.NumberFormat("en-IN", { maximumFractionDigits: 1 }).format(n);

  const result = useMemo(() => {
    const crop = cropWaterData[selectedCrop];
    const soil = soilEfficiency[soilType];

    // 1 mm of water on 1 acre = 4046.86 liters
    const litersPerMM = 4046.86;
    const totalWaterMM = crop.waterMM * soil.factor;
    const totalLiters = totalWaterMM * landArea * litersPerMM;

    // Irrigation schedule (number of irrigations)
    const irrigationsPerCycle = Math.ceil(crop.daysGrowth / 10); // roughly every 10 days
    const litersPerIrrigation = totalLiters / irrigationsPerCycle;

    // Pump capacity: 1 HP pump delivers ~3600 liters/hour (approx)
    const litersPerHourPerHP = 3600;
    const totalPumpHours = totalLiters / (pumpHP * litersPerHourPerHP);
    const hoursPerIrrigation = totalPumpHours / irrigationsPerCycle;

    // Electricity cost: 1 HP = 0.746 kW
    const kw = pumpHP * 0.746;
    const totalKWh = kw * totalPumpHours;
    const totalElecCost = totalKWh * electricityRate;
    const costPerIrrigation = totalElecCost / irrigationsPerCycle;

    // Recommended pump HP
    const recommendedHP = Math.ceil((totalLiters / irrigationsPerCycle) / (litersPerHourPerHP * 6)); // 6 hours per session

    return {
      crop, totalWaterMM, totalLiters, irrigationsPerCycle, litersPerIrrigation,
      totalPumpHours, hoursPerIrrigation, totalKWh, totalElecCost, costPerIrrigation,
      recommendedHP,
    };
  }, [selectedCrop, landArea, soilType, pumpHP, electricityRate]);

  return (
    <div className="space-y-8">
      {/* Crop Selection */}
      <div>
        <label className="text-sm font-semibold text-gray-700 mb-3 block">Select Crop</label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {cropWaterData.map((crop, i) => (
            <button
              key={crop.name}
              onClick={() => setSelectedCrop(i)}
              className={`p-2 rounded-xl text-xs font-medium transition-all ${
                selectedCrop === i ? "btn-primary" : "btn-secondary"
              }`}
            >
              {crop.name}
            </button>
          ))}
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">Land Area (Acres)</label>
              <span className="text-sm font-bold text-indigo-600">{landArea} acres</span>
            </div>
            <input type="range" min={1} max={100} step={1} value={landArea} onChange={(e) => setLandArea(+e.target.value)} className="w-full" />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Soil Type</label>
            <select value={soilType} onChange={(e) => setSoilType(e.target.value as SoilType)} className="calc-input">
              {Object.entries(soilEfficiency).map(([key, s]) => (
                <option key={key} value={key}>{s.label} — {s.note}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">Pump Capacity (HP)</label>
              <span className="text-sm font-bold text-indigo-600">{pumpHP} HP</span>
            </div>
            <input type="range" min={1} max={25} step={0.5} value={pumpHP} onChange={(e) => setPumpHP(+e.target.value)} className="w-full" />
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">Electricity Rate (₹/kWh)</label>
              <span className="text-sm font-bold text-indigo-600">₹{electricityRate}</span>
            </div>
            <input type="range" min={1} max={15} step={0.5} value={electricityRate} onChange={(e) => setElectricityRate(+e.target.value)} className="w-full" />
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="result-card space-y-4">
        <h3 className="text-lg font-bold text-gray-800">Water Requirement — {result.crop.name}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-xs font-medium text-gray-500 mb-1">Total Water Needed</div>
            <div className="text-2xl font-extrabold text-blue-600">{fmtNum(result.totalLiters / 1000)} KL</div>
            <div className="text-xs text-gray-400">{fmtNum(result.totalLiters)} liters</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-xs font-medium text-gray-500 mb-1">Water Depth</div>
            <div className="text-2xl font-extrabold text-blue-600">{fmtNum(result.totalWaterMM)} mm</div>
            <div className="text-xs text-gray-400">per crop cycle</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-xs font-medium text-gray-500 mb-1">Growth Period</div>
            <div className="text-2xl font-extrabold text-green-600">{result.crop.daysGrowth} days</div>
          </div>
        </div>
      </div>

      {/* Irrigation Schedule */}
      <div className="result-card space-y-4">
        <h3 className="text-lg font-bold text-gray-800">Irrigation Schedule</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-xs font-medium text-gray-500 mb-1">No. of Irrigations</div>
            <div className="text-2xl font-extrabold text-indigo-600">{result.irrigationsPerCycle}</div>
            <div className="text-xs text-gray-400">approx. every 10 days</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-xs font-medium text-gray-500 mb-1">Water per Irrigation</div>
            <div className="text-2xl font-extrabold text-blue-600">{fmtNum(result.litersPerIrrigation / 1000)} KL</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-xs font-medium text-gray-500 mb-1">Pump Hours / Session</div>
            <div className="text-2xl font-extrabold text-amber-600">{fmtNum(result.hoursPerIrrigation)} hrs</div>
          </div>
        </div>
      </div>

      {/* Pump & Electricity */}
      <div className="result-card space-y-4">
        <h3 className="text-lg font-bold text-gray-800">Pump & Electricity</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-xs font-medium text-gray-500 mb-1">Recommended Pump</div>
            <div className="text-2xl font-extrabold text-indigo-600">{Math.max(result.recommendedHP, 1)} HP</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-xs font-medium text-gray-500 mb-1">Total Pump Hours</div>
            <div className="text-2xl font-extrabold text-amber-600">{fmtNum(result.totalPumpHours)} hrs</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-xs font-medium text-gray-500 mb-1">Total kWh Used</div>
            <div className="text-2xl font-extrabold text-gray-700">{fmtNum(result.totalKWh)} kWh</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-xs font-medium text-gray-500 mb-1">Total Electricity Cost</div>
            <div className="text-2xl font-extrabold text-red-500">{fmt(result.totalElecCost)}</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-xs font-medium text-gray-500 mb-1">Cost per Irrigation</div>
            <div className="text-2xl font-extrabold text-red-500">{fmt(result.costPerIrrigation)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
