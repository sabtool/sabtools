"use client";
import { useState, useMemo } from "react";

const DEFAULT_DAILY_USAGE = 135; // liters per person (Indian standard IS 1172)

const STANDARD_TANKS = [500, 750, 1000, 1500, 2000, 3000, 5000];

export default function WaterTankCalculator() {
  const [members, setMembers] = useState("4");
  const [usagePerPerson, setUsagePerPerson] = useState(String(DEFAULT_DAILY_USAGE));

  const result = useMemo(() => {
    const m = parseInt(members);
    const u = parseFloat(usagePerPerson);
    if (!m || !u || m <= 0 || u <= 0) return null;

    const dailyLiters = m * u;
    const dailyGallons = dailyLiters / 3.785;

    // Overhead tank: 1 day storage
    const overheadNeeded = dailyLiters;
    const overheadTank = STANDARD_TANKS.find((t) => t >= overheadNeeded) ?? STANDARD_TANKS[STANDARD_TANKS.length - 1];

    // Underground tank: 2 days storage
    const undergroundNeeded = dailyLiters * 2;
    const undergroundTank = STANDARD_TANKS.find((t) => t >= undergroundNeeded) ?? STANDARD_TANKS[STANDARD_TANKS.length - 1];

    return {
      dailyLiters: dailyLiters.toFixed(0),
      dailyGallons: dailyGallons.toFixed(1),
      overheadNeeded: overheadNeeded.toFixed(0),
      overheadTank,
      undergroundNeeded: undergroundNeeded.toFixed(0),
      undergroundTank,
    };
  }, [members, usagePerPerson]);

  const fmt = (n: number) => n.toLocaleString("en-IN");

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Number of Family Members</label>
          <input type="number" placeholder="4" value={members} onChange={(e) => setMembers(e.target.value)} className="calc-input" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Daily Usage per Person (liters)</label>
          <input type="number" placeholder="135" value={usagePerPerson} onChange={(e) => setUsagePerPerson(e.target.value)} className="calc-input" />
          <div className="text-xs text-gray-400 mt-1">Indian standard: 135 L/person/day (IS 1172)</div>
        </div>
      </div>

      {result && (
        <div className="result-card space-y-4">
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-1">Daily Water Requirement</div>
            <div className="text-5xl font-extrabold text-indigo-600">{fmt(parseInt(result.dailyLiters))} L</div>
            <div className="text-sm text-gray-400 mt-1">{result.dailyGallons} gallons / day</div>
          </div>

          <div className="border-t border-gray-100 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <div className="text-sm font-semibold text-blue-700 mb-2">Overhead Tank (1-day)</div>
              <div className="text-3xl font-bold text-blue-600">{fmt(result.overheadTank)} L</div>
              <div className="text-xs text-blue-400 mt-1">Need: {result.overheadNeeded} L</div>
            </div>
            <div className="bg-green-50 rounded-xl p-4 border border-green-100">
              <div className="text-sm font-semibold text-green-700 mb-2">Underground Tank (2-day)</div>
              <div className="text-3xl font-bold text-green-600">{fmt(result.undergroundTank)} L</div>
              <div className="text-xs text-green-400 mt-1">Need: {result.undergroundNeeded} L</div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <div className="text-sm font-semibold text-gray-700 mb-2">Standard Tank Sizes</div>
            <div className="flex flex-wrap gap-2">
              {STANDARD_TANKS.map((t) => {
                const isOverhead = t === result.overheadTank;
                const isUnderground = t === result.undergroundTank;
                return (
                  <span
                    key={t}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border ${
                      isOverhead
                        ? "bg-blue-100 text-blue-700 border-blue-300"
                        : isUnderground
                        ? "bg-green-100 text-green-700 border-green-300"
                        : "bg-gray-50 text-gray-600 border-gray-200"
                    }`}
                  >
                    {fmt(t)} L
                    {isOverhead && " (OH)"}
                    {isUnderground && !isOverhead && " (UG)"}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <div className="text-sm font-semibold text-gray-700 mb-2">Usage Breakdown (per person/day)</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              {[
                { label: "Drinking & Cooking", liters: "10 L" },
                { label: "Bathing", liters: "55 L" },
                { label: "Washing Clothes", liters: "20 L" },
                { label: "Cleaning / Utensils", liters: "15 L" },
                { label: "Toilet Flushing", liters: "30 L" },
                { label: "Other", liters: "5 L" },
              ].map((item) => (
                <div key={item.label} className="bg-white rounded-lg p-2 border border-gray-100">
                  <span className="text-gray-400">{item.label}:</span> <span className="font-semibold">{item.liters}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
