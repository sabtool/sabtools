"use client";
import { useState, useMemo } from "react";

interface CropData {
  name: string;
  defaultYield: number; // quintals per acre
  defaultMSP: number; // ₹ per quintal
  defaultCost: number; // ₹ per acre cultivation cost
}

const crops: CropData[] = [
  { name: "Rice (Paddy)", defaultYield: 25, defaultMSP: 2300, defaultCost: 25000 },
  { name: "Wheat", defaultYield: 20, defaultMSP: 2275, defaultCost: 22000 },
  { name: "Sugarcane", defaultYield: 350, defaultMSP: 315, defaultCost: 60000 },
  { name: "Cotton", defaultYield: 8, defaultMSP: 7020, defaultCost: 35000 },
  { name: "Soybean", defaultYield: 10, defaultMSP: 4892, defaultCost: 20000 },
  { name: "Maize", defaultYield: 22, defaultMSP: 2090, defaultCost: 18000 },
  { name: "Pulses (Tur/Arhar)", defaultYield: 8, defaultMSP: 7000, defaultCost: 22000 },
  { name: "Vegetables (Mixed)", defaultYield: 60, defaultMSP: 1500, defaultCost: 40000 },
];

type AreaUnit = "acres" | "hectares" | "bigha";

export default function CropYieldCalculator() {
  const [selectedCrop, setSelectedCrop] = useState(0);
  const [landArea, setLandArea] = useState(5);
  const [areaUnit, setAreaUnit] = useState<AreaUnit>("acres");
  const [yieldPerAcre, setYieldPerAcre] = useState(crops[0].defaultYield);
  const [pricePerQuintal, setPricePerQuintal] = useState(crops[0].defaultMSP);
  const [costPerAcre, setCostPerAcre] = useState(crops[0].defaultCost);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  const fmtNum = (n: number) => new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(n);

  const selectCrop = (index: number) => {
    setSelectedCrop(index);
    setYieldPerAcre(crops[index].defaultYield);
    setPricePerQuintal(crops[index].defaultMSP);
    setCostPerAcre(crops[index].defaultCost);
  };

  const result = useMemo(() => {
    // Convert to acres
    let acres = landArea;
    if (areaUnit === "hectares") acres = landArea * 2.471;
    else if (areaUnit === "bigha") acres = landArea * 0.619; // UP/Bihar bigha

    const totalYield = acres * yieldPerAcre;
    const grossRevenue = totalYield * pricePerQuintal;
    const totalCost = acres * costPerAcre;
    const netProfit = grossRevenue - totalCost;
    const profitPerAcre = acres > 0 ? netProfit / acres : 0;
    const roi = totalCost > 0 ? (netProfit / totalCost) * 100 : 0;

    return { acres, totalYield, grossRevenue, totalCost, netProfit, profitPerAcre, roi };
  }, [landArea, areaUnit, yieldPerAcre, pricePerQuintal, costPerAcre]);

  return (
    <div className="space-y-8">
      {/* Crop Selection */}
      <div>
        <label className="text-sm font-semibold text-gray-700 mb-3 block">Select Crop</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {crops.map((crop, i) => (
            <button
              key={crop.name}
              onClick={() => selectCrop(i)}
              className={`p-3 rounded-xl text-sm font-medium transition-all ${
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
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Land Area</label>
            <input
              type="number"
              min={0.1}
              step={0.5}
              value={landArea}
              onChange={(e) => setLandArea(+e.target.value)}
              className="calc-input"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Area Unit</label>
            <select value={areaUnit} onChange={(e) => setAreaUnit(e.target.value as AreaUnit)} className="calc-input">
              <option value="acres">Acres</option>
              <option value="hectares">Hectares</option>
              <option value="bigha">Bigha (UP/Bihar)</option>
            </select>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">Yield per Acre (Quintals)</label>
            <span className="text-sm font-bold text-indigo-600">{yieldPerAcre} qtl</span>
          </div>
          <input
            type="range"
            min={1}
            max={500}
            step={1}
            value={yieldPerAcre}
            onChange={(e) => setYieldPerAcre(+e.target.value)}
            className="w-full"
          />
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">Price per Quintal (MSP/Market Rate)</label>
            <span className="text-sm font-bold text-indigo-600">{fmt(pricePerQuintal)}</span>
          </div>
          <input
            type="range"
            min={100}
            max={20000}
            step={50}
            value={pricePerQuintal}
            onChange={(e) => setPricePerQuintal(+e.target.value)}
            className="w-full"
          />
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">Cultivation Cost per Acre</label>
            <span className="text-sm font-bold text-indigo-600">{fmt(costPerAcre)}</span>
          </div>
          <input
            type="range"
            min={5000}
            max={100000}
            step={1000}
            value={costPerAcre}
            onChange={(e) => setCostPerAcre(+e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      {/* Results */}
      <div className="result-card space-y-4">
        <h3 className="text-lg font-bold text-gray-800">Yield & Revenue Estimate</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-xs font-medium text-gray-500 mb-1">Total Land (Acres)</div>
            <div className="text-2xl font-extrabold text-indigo-600">{fmtNum(result.acres)}</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-xs font-medium text-gray-500 mb-1">Total Expected Yield</div>
            <div className="text-2xl font-extrabold text-amber-600">{fmtNum(result.totalYield)} qtl</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-xs font-medium text-gray-500 mb-1">Gross Revenue</div>
            <div className="text-2xl font-extrabold text-emerald-600">{fmt(result.grossRevenue)}</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-xs font-medium text-gray-500 mb-1">Total Cultivation Cost</div>
            <div className="text-2xl font-extrabold text-red-500">{fmt(result.totalCost)}</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-xs font-medium text-gray-500 mb-1">Net Profit</div>
            <div className={`text-2xl font-extrabold ${result.netProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
              {fmt(result.netProfit)}
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-xs font-medium text-gray-500 mb-1">ROI</div>
            <div className={`text-2xl font-extrabold ${result.roi >= 0 ? "text-green-600" : "text-red-600"}`}>
              {result.roi.toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Profit per acre */}
        <div className="bg-white rounded-xl p-4 shadow-sm text-center">
          <div className="text-xs font-medium text-gray-500 mb-1">Profit per Acre</div>
          <div className={`text-2xl font-extrabold ${result.profitPerAcre >= 0 ? "text-green-600" : "text-red-600"}`}>
            {fmt(result.profitPerAcre)}
          </div>
        </div>

        {/* Visual bar */}
        <div>
          <div className="flex justify-between text-xs font-medium text-gray-500 mb-2">
            <span>Cost ({result.grossRevenue > 0 ? ((result.totalCost / result.grossRevenue) * 100).toFixed(1) : 0}%)</span>
            <span>Profit ({result.grossRevenue > 0 ? Math.max(0, ((result.netProfit / result.grossRevenue) * 100)).toFixed(1) : 0}%)</span>
          </div>
          <div className="h-4 rounded-full bg-green-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-red-400 transition-all duration-500"
              style={{ width: `${result.grossRevenue > 0 ? Math.min(100, (result.totalCost / result.grossRevenue) * 100) : 0}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
