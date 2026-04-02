"use client";
import { useState, useMemo } from "react";

const ROOM_TYPES = ["Bedroom", "Kitchen", "Bathroom", "Living Room"] as const;
type RoomType = typeof ROOM_TYPES[number];

const CITY_TIERS = [
  { label: "Tier 1 (Mumbai, Delhi, Bangalore)", factor: 1.4 },
  { label: "Tier 2 (Pune, Jaipur, Lucknow)", factor: 1.0 },
  { label: "Tier 3 (Smaller Cities/Towns)", factor: 0.7 },
];

const QUALITY_LEVELS = [
  { label: "Basic", factor: 0.7 },
  { label: "Standard", factor: 1.0 },
  { label: "Premium", factor: 1.8 },
];

interface CostItem {
  label: string;
  minPerSqft: number;
  maxPerSqft: number;
}

const ROOM_COSTS: Record<RoomType, CostItem[]> = {
  Bedroom: [
    { label: "Flooring", minPerSqft: 40, maxPerSqft: 80 },
    { label: "Painting", minPerSqft: 15, maxPerSqft: 30 },
    { label: "Electrical (Lights & Switches)", minPerSqft: 20, maxPerSqft: 50 },
    { label: "Wardrobe / Storage", minPerSqft: 60, maxPerSqft: 150 },
    { label: "False Ceiling", minPerSqft: 50, maxPerSqft: 120 },
    { label: "Curtains & Fixtures", minPerSqft: 10, maxPerSqft: 30 },
  ],
  Kitchen: [
    { label: "Flooring", minPerSqft: 40, maxPerSqft: 80 },
    { label: "Wall Tiles", minPerSqft: 30, maxPerSqft: 70 },
    { label: "Modular Kitchen Cabinets", minPerSqft: 150, maxPerSqft: 400 },
    { label: "Countertop (Granite/Quartz)", minPerSqft: 50, maxPerSqft: 150 },
    { label: "Plumbing & Fixtures", minPerSqft: 25, maxPerSqft: 60 },
    { label: "Electrical & Chimney", minPerSqft: 30, maxPerSqft: 80 },
  ],
  Bathroom: [
    { label: "Floor Tiles", minPerSqft: 50, maxPerSqft: 100 },
    { label: "Wall Tiles", minPerSqft: 45, maxPerSqft: 90 },
    { label: "Sanitaryware", minPerSqft: 80, maxPerSqft: 200 },
    { label: "Plumbing & Fittings", minPerSqft: 40, maxPerSqft: 100 },
    { label: "Electrical (Geyser, Light)", minPerSqft: 20, maxPerSqft: 50 },
    { label: "Waterproofing", minPerSqft: 15, maxPerSqft: 35 },
  ],
  "Living Room": [
    { label: "Flooring (Vitrified/Marble)", minPerSqft: 50, maxPerSqft: 120 },
    { label: "Painting & Wall Treatment", minPerSqft: 20, maxPerSqft: 50 },
    { label: "False Ceiling & Lighting", minPerSqft: 60, maxPerSqft: 150 },
    { label: "TV Unit & Shelving", minPerSqft: 40, maxPerSqft: 120 },
    { label: "Sofa / Furniture", minPerSqft: 50, maxPerSqft: 150 },
    { label: "Electrical & AC", minPerSqft: 25, maxPerSqft: 60 },
  ],
};

export default function InteriorCostEstimator() {
  const [roomType, setRoomType] = useState<RoomType>("Bedroom");
  const [cityTier, setCityTier] = useState(1);
  const [quality, setQuality] = useState(1);
  const [area, setArea] = useState("");

  const result = useMemo(() => {
    const a = parseFloat(area);
    if (!a || a <= 0) return null;

    const cityFactor = CITY_TIERS[cityTier].factor;
    const qualityFactor = QUALITY_LEVELS[quality].factor;
    const costs = ROOM_COSTS[roomType];

    let totalMin = 0;
    let totalMax = 0;

    const breakdown = costs.map((item) => {
      const min = Math.round(item.minPerSqft * a * cityFactor * qualityFactor);
      const max = Math.round(item.maxPerSqft * a * cityFactor * qualityFactor);
      totalMin += min;
      totalMax += max;
      return { label: item.label, min, max };
    });

    return { breakdown, totalMin, totalMax };
  }, [roomType, cityTier, quality, area]);

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Room Type</label>
        <div className="flex flex-wrap gap-2">
          {ROOM_TYPES.map((r) => (
            <button key={r} onClick={() => setRoomType(r)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${roomType === r ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"}`}>{r}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">City Tier</label>
          <select value={cityTier} onChange={(e) => setCityTier(Number(e.target.value))} className="calc-input">
            {CITY_TIERS.map((c, i) => <option key={i} value={i}>{c.label}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Quality Level</label>
          <select value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="calc-input">
            {QUALITY_LEVELS.map((q, i) => <option key={i} value={i}>{q.label}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Room Area (sq ft)</label>
          <input type="number" placeholder="e.g. 150" value={area} onChange={(e) => setArea(e.target.value)} className="calc-input" />
        </div>
      </div>

      {result && (
        <div className="result-card space-y-4">
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-1">Estimated Interior Cost</div>
            <div className="text-3xl font-extrabold text-indigo-600">
              Rs {result.totalMin.toLocaleString("en-IN")} - Rs {result.totalMax.toLocaleString("en-IN")}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Rs {Math.round(result.totalMin / parseFloat(area)).toLocaleString("en-IN")} - Rs {Math.round(result.totalMax / parseFloat(area)).toLocaleString("en-IN")} per sq ft
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <div className="text-sm font-semibold text-gray-700 mb-3">Cost Breakdown - {roomType}</div>
            <div className="space-y-2">
              {result.breakdown.map((item) => {
                const pct = Math.round(((item.min + item.max) / 2) / ((result.totalMin + result.totalMax) / 2) * 100);
                return (
                  <div key={item.label} className="bg-white rounded-xl p-3 border border-gray-100">
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm font-semibold text-gray-800">{item.label}</div>
                      <div className="text-sm font-bold text-indigo-600">
                        Rs {item.min.toLocaleString("en-IN")} - {item.max.toLocaleString("en-IN")}
                      </div>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div className="h-1.5 rounded-full bg-indigo-400" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">{pct}% of total</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
            <div className="text-xs text-yellow-700">
              <strong>Disclaimer:</strong> These are approximate estimates based on average market rates. Actual costs depend on material brands, labor rates, design complexity, and specific requirements. Get detailed quotes from contractors for accurate pricing.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
