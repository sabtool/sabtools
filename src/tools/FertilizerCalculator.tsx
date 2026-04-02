"use client";
import { useState, useMemo } from "react";

interface CropNPK {
  name: string;
  n: number; // kg per acre
  p: number;
  k: number;
}

const cropNPK: CropNPK[] = [
  { name: "Rice (Paddy)", n: 120, p: 60, k: 60 },
  { name: "Wheat", n: 120, p: 60, k: 40 },
  { name: "Sugarcane", n: 150, p: 80, k: 60 },
  { name: "Cotton", n: 80, p: 40, k: 40 },
  { name: "Soybean", n: 30, p: 60, k: 30 },
  { name: "Maize", n: 120, p: 60, k: 40 },
  { name: "Pulses (Tur)", n: 25, p: 50, k: 20 },
  { name: "Vegetables", n: 100, p: 50, k: 50 },
  { name: "Mustard", n: 80, p: 40, k: 20 },
  { name: "Potato", n: 150, p: 80, k: 100 },
];

// Fertilizer compositions: Urea = 46% N, DAP = 18% N + 46% P2O5, MOP = 60% K2O
// Bag = 50 kg
const UREA_N_PERCENT = 0.46;
const DAP_N_PERCENT = 0.18;
const DAP_P_PERCENT = 0.46;
const MOP_K_PERCENT = 0.60;

export default function FertilizerCalculator() {
  const [selectedCrop, setSelectedCrop] = useState(0);
  const [landArea, setLandArea] = useState(5);
  const [ureaPrice, setUreaPrice] = useState(267); // per 50kg bag
  const [dapPrice, setDapPrice] = useState(1350);
  const [mopPrice, setMopPrice] = useState(870);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  const fmtNum = (n: number) => new Intl.NumberFormat("en-IN", { maximumFractionDigits: 1 }).format(n);

  const result = useMemo(() => {
    const crop = cropNPK[selectedCrop];
    const totalN = crop.n * landArea;
    const totalP = crop.p * landArea;
    const totalK = crop.k * landArea;

    // DAP provides both N and P. Calculate DAP for P first.
    const dapKg = totalP / DAP_P_PERCENT;
    const nFromDAP = dapKg * DAP_N_PERCENT;
    const remainingN = Math.max(0, totalN - nFromDAP);
    const ureaKg = remainingN / UREA_N_PERCENT;
    const mopKg = totalK / MOP_K_PERCENT;

    const ureaBags = Math.ceil(ureaKg / 50);
    const dapBags = Math.ceil(dapKg / 50);
    const mopBags = Math.ceil(mopKg / 50);

    const totalCost = ureaBags * ureaPrice + dapBags * dapPrice + mopBags * mopPrice;

    // Application schedule
    const basalUrea = Math.round(ureaKg * 0.33);
    const topDress1 = Math.round(ureaKg * 0.33);
    const topDress2 = Math.round(ureaKg * 0.34);

    return {
      crop, totalN, totalP, totalK,
      ureaKg, dapKg, mopKg,
      ureaBags, dapBags, mopBags,
      totalCost,
      basalUrea, topDress1, topDress2,
      basalDAP: dapKg, basalMOP: mopKg,
    };
  }, [selectedCrop, landArea, ureaPrice, dapPrice, mopPrice]);

  return (
    <div className="space-y-8">
      {/* Crop Selection */}
      <div>
        <label className="text-sm font-semibold text-gray-700 mb-3 block">Select Crop</label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {cropNPK.map((crop, i) => (
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
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">Land Area (Acres)</label>
            <span className="text-sm font-bold text-indigo-600">{landArea} acres</span>
          </div>
          <input type="range" min={1} max={100} step={1} value={landArea} onChange={(e) => setLandArea(+e.target.value)} className="w-full" />
          <div className="flex justify-between text-xs text-gray-400 mt-1"><span>1</span><span>100 acres</span></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Urea Price (₹/50kg bag)</label>
            <input type="number" value={ureaPrice} onChange={(e) => setUreaPrice(+e.target.value)} className="calc-input" />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">DAP Price (₹/50kg bag)</label>
            <input type="number" value={dapPrice} onChange={(e) => setDapPrice(+e.target.value)} className="calc-input" />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">MOP Price (₹/50kg bag)</label>
            <input type="number" value={mopPrice} onChange={(e) => setMopPrice(+e.target.value)} className="calc-input" />
          </div>
        </div>
      </div>

      {/* NPK Requirement */}
      <div className="result-card space-y-4">
        <h3 className="text-lg font-bold text-gray-800">NPK Requirement — {result.crop.name}</h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
            <div className="text-xs font-medium text-blue-600 mb-1">Nitrogen (N)</div>
            <div className="text-2xl font-extrabold text-blue-700">{fmtNum(result.totalN)} kg</div>
            <div className="text-xs text-blue-400">{result.crop.n} kg/acre</div>
          </div>
          <div className="bg-orange-50 rounded-xl p-4 text-center border border-orange-200">
            <div className="text-xs font-medium text-orange-600 mb-1">Phosphorus (P)</div>
            <div className="text-2xl font-extrabold text-orange-700">{fmtNum(result.totalP)} kg</div>
            <div className="text-xs text-orange-400">{result.crop.p} kg/acre</div>
          </div>
          <div className="bg-purple-50 rounded-xl p-4 text-center border border-purple-200">
            <div className="text-xs font-medium text-purple-600 mb-1">Potassium (K)</div>
            <div className="text-2xl font-extrabold text-purple-700">{fmtNum(result.totalK)} kg</div>
            <div className="text-xs text-purple-400">{result.crop.k} kg/acre</div>
          </div>
        </div>
      </div>

      {/* Fertilizer Quantities */}
      <div className="result-card space-y-4">
        <h3 className="text-lg font-bold text-gray-800">Fertilizer Required</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-sm font-semibold text-gray-700 mb-2">Urea (46% N)</div>
            <div className="text-2xl font-extrabold text-indigo-600">{fmtNum(result.ureaKg)} kg</div>
            <div className="text-sm text-gray-500">{result.ureaBags} bags (50kg each)</div>
            <div className="text-sm font-semibold text-emerald-600 mt-1">{fmt(result.ureaBags * ureaPrice)}</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-sm font-semibold text-gray-700 mb-2">DAP (18-46-0)</div>
            <div className="text-2xl font-extrabold text-indigo-600">{fmtNum(result.dapKg)} kg</div>
            <div className="text-sm text-gray-500">{result.dapBags} bags (50kg each)</div>
            <div className="text-sm font-semibold text-emerald-600 mt-1">{fmt(result.dapBags * dapPrice)}</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-sm font-semibold text-gray-700 mb-2">MOP (0-0-60)</div>
            <div className="text-2xl font-extrabold text-indigo-600">{fmtNum(result.mopKg)} kg</div>
            <div className="text-sm text-gray-500">{result.mopBags} bags (50kg each)</div>
            <div className="text-sm font-semibold text-emerald-600 mt-1">{fmt(result.mopBags * mopPrice)}</div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm text-center">
          <div className="text-xs font-medium text-gray-500 mb-1">Total Fertilizer Cost</div>
          <div className="text-2xl font-extrabold text-red-500">{fmt(result.totalCost)}</div>
        </div>
      </div>

      {/* Application Schedule */}
      <div className="result-card space-y-4">
        <h3 className="text-lg font-bold text-gray-800">Application Schedule</h3>
        <div className="space-y-3">
          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <div className="font-semibold text-green-700 mb-1">Basal Dose (At Sowing)</div>
            <div className="text-sm text-green-600">
              Urea: {fmtNum(result.basalUrea)} kg | Full DAP: {fmtNum(result.basalDAP)} kg | Full MOP: {fmtNum(result.basalMOP)} kg
            </div>
          </div>
          <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
            <div className="font-semibold text-yellow-700 mb-1">1st Top Dressing (25-30 days)</div>
            <div className="text-sm text-yellow-600">
              Urea: {fmtNum(result.topDress1)} kg
            </div>
          </div>
          <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
            <div className="font-semibold text-orange-700 mb-1">2nd Top Dressing (45-50 days)</div>
            <div className="text-sm text-orange-600">
              Urea: {fmtNum(result.topDress2)} kg
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
