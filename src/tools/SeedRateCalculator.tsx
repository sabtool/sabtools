"use client";
import { useState, useMemo } from "react";

interface CropSeed {
  name: string;
  seedRateKgPerAcre: number;
  spacingCm: string; // row x plant spacing
  germinationRate: number; // default %
  costPerKg: number; // ₹ approx
}

const cropSeeds: CropSeed[] = [
  { name: "Rice (Paddy)", seedRateKgPerAcre: 30, spacingCm: "20 x 15", germinationRate: 85, costPerKg: 45 },
  { name: "Wheat", seedRateKgPerAcre: 40, spacingCm: "22.5 x 5", germinationRate: 85, costPerKg: 35 },
  { name: "Maize", seedRateKgPerAcre: 8, spacingCm: "60 x 20", germinationRate: 90, costPerKg: 250 },
  { name: "Cotton", seedRateKgPerAcre: 5, spacingCm: "90 x 45", germinationRate: 80, costPerKg: 800 },
  { name: "Soybean", seedRateKgPerAcre: 30, spacingCm: "45 x 5", germinationRate: 85, costPerKg: 80 },
  { name: "Pulses (Tur)", seedRateKgPerAcre: 6, spacingCm: "60 x 20", germinationRate: 85, costPerKg: 150 },
  { name: "Mustard", seedRateKgPerAcre: 2, spacingCm: "30 x 10", germinationRate: 85, costPerKg: 120 },
  { name: "Groundnut", seedRateKgPerAcre: 50, spacingCm: "30 x 10", germinationRate: 80, costPerKg: 80 },
  { name: "Sunflower", seedRateKgPerAcre: 3, spacingCm: "60 x 30", germinationRate: 85, costPerKg: 400 },
  { name: "Bajra (Pearl Millet)", seedRateKgPerAcre: 2, spacingCm: "45 x 15", germinationRate: 85, costPerKg: 60 },
  { name: "Jowar (Sorghum)", seedRateKgPerAcre: 4, spacingCm: "45 x 15", germinationRate: 85, costPerKg: 50 },
  { name: "Potato (Tuber)", seedRateKgPerAcre: 600, spacingCm: "60 x 20", germinationRate: 90, costPerKg: 25 },
];

export default function SeedRateCalculator() {
  const [selectedCrop, setSelectedCrop] = useState(0);
  const [landArea, setLandArea] = useState(5);
  const [germinationRate, setGerminationRate] = useState(cropSeeds[0].germinationRate);
  const [seedCostPerKg, setSeedCostPerKg] = useState(cropSeeds[0].costPerKg);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
  const fmtNum = (n: number) => new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(n);

  const selectCrop = (index: number) => {
    setSelectedCrop(index);
    setGerminationRate(cropSeeds[index].germinationRate);
    setSeedCostPerKg(cropSeeds[index].costPerKg);
  };

  const result = useMemo(() => {
    const crop = cropSeeds[selectedCrop];
    const baseRate = crop.seedRateKgPerAcre;

    // Adjust for germination rate: if germination is lower, need more seed
    const adjustedRate = germinationRate > 0 ? baseRate * (85 / germinationRate) : baseRate;
    const totalSeedNeeded = adjustedRate * landArea;
    const bufferPercent = 10;
    const buffer = totalSeedNeeded * (bufferPercent / 100);
    const totalWithBuffer = totalSeedNeeded + buffer;
    const totalCost = totalWithBuffer * seedCostPerKg;
    const costPerAcre = landArea > 0 ? totalCost / landArea : 0;

    return {
      crop, baseRate, adjustedRate, totalSeedNeeded, buffer, totalWithBuffer, totalCost, costPerAcre,
    };
  }, [selectedCrop, landArea, germinationRate, seedCostPerKg]);

  return (
    <div className="space-y-8">
      {/* Crop Selection */}
      <div>
        <label className="text-sm font-semibold text-gray-700 mb-3 block">Select Crop</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {cropSeeds.map((crop, i) => (
            <button
              key={crop.name}
              onClick={() => selectCrop(i)}
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
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">Land Area (Acres)</label>
            <span className="text-sm font-bold text-indigo-600">{landArea} acres</span>
          </div>
          <input type="range" min={1} max={100} step={1} value={landArea} onChange={(e) => setLandArea(+e.target.value)} className="w-full" />
          <div className="flex justify-between text-xs text-gray-400 mt-1"><span>1</span><span>100</span></div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">Germination Rate (%)</label>
            <span className="text-sm font-bold text-indigo-600">{germinationRate}%</span>
          </div>
          <input type="range" min={50} max={100} step={1} value={germinationRate} onChange={(e) => setGerminationRate(+e.target.value)} className="w-full" />
          <div className="flex justify-between text-xs text-gray-400 mt-1"><span>50%</span><span>100%</span></div>
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700 mb-2 block">Seed Cost (₹/kg)</label>
          <input type="number" min={1} step={5} value={seedCostPerKg} onChange={(e) => setSeedCostPerKg(+e.target.value)} className="calc-input" />
        </div>
      </div>

      {/* Crop Info */}
      <div className="result-card space-y-4">
        <h3 className="text-lg font-bold text-gray-800">Crop Details — {result.crop.name}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-xs font-medium text-gray-500 mb-1">Recommended Seed Rate</div>
            <div className="text-2xl font-extrabold text-indigo-600">{fmtNum(result.crop.seedRateKgPerAcre)} kg/acre</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-xs font-medium text-gray-500 mb-1">Spacing (Row x Plant)</div>
            <div className="text-2xl font-extrabold text-emerald-600">{result.crop.spacingCm} cm</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-xs font-medium text-gray-500 mb-1">Default Germination</div>
            <div className="text-2xl font-extrabold text-amber-600">{result.crop.germinationRate}%</div>
          </div>
        </div>
      </div>

      {/* Calculation Results */}
      <div className="result-card space-y-4">
        <h3 className="text-lg font-bold text-gray-800">Seed Requirement</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-xs font-medium text-gray-500 mb-1">Adjusted Rate</div>
            <div className="text-2xl font-extrabold text-indigo-600">{fmtNum(result.adjustedRate)} kg/acre</div>
            <div className="text-xs text-gray-400">for {germinationRate}% germination</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-xs font-medium text-gray-500 mb-1">Base Seed Needed</div>
            <div className="text-2xl font-extrabold text-gray-700">{fmtNum(result.totalSeedNeeded)} kg</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-xs font-medium text-gray-500 mb-1">10% Buffer</div>
            <div className="text-2xl font-extrabold text-amber-600">+{fmtNum(result.buffer)} kg</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-green-50 rounded-xl p-4 text-center shadow-sm border border-green-200">
            <div className="text-xs font-medium text-green-600 mb-1">Total Seed (with Buffer)</div>
            <div className="text-3xl font-extrabold text-green-700">{fmtNum(result.totalWithBuffer)} kg</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-xs font-medium text-gray-500 mb-1">Estimated Seed Cost</div>
            <div className="text-2xl font-extrabold text-red-500">{fmt(result.totalCost)}</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-xs font-medium text-gray-500 mb-1">Cost per Acre</div>
            <div className="text-2xl font-extrabold text-red-500">{fmt(result.costPerAcre)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
