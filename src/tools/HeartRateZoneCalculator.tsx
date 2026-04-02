"use client";
import { useState, useMemo } from "react";

const ZONES = [
  { name: "Zone 1 - Warm Up", min: 50, max: 60, color: "bg-blue-100 border-blue-300 text-blue-800", desc: "Very light effort. Recovery, warm-up, cool-down.", exercise: "Walking, gentle stretching" },
  { name: "Zone 2 - Fat Burn", min: 60, max: 70, color: "bg-green-100 border-green-300 text-green-800", desc: "Light effort. Improves endurance and fat burning.", exercise: "Brisk walking, easy cycling, light jogging" },
  { name: "Zone 3 - Cardio", min: 70, max: 80, color: "bg-yellow-100 border-yellow-300 text-yellow-800", desc: "Moderate effort. Improves cardiovascular fitness.", exercise: "Running, swimming, cycling at moderate pace" },
  { name: "Zone 4 - Hard", min: 80, max: 90, color: "bg-orange-100 border-orange-300 text-orange-800", desc: "Hard effort. Improves speed and performance.", exercise: "Interval training, tempo runs, fast cycling" },
  { name: "Zone 5 - Maximum", min: 90, max: 100, color: "bg-red-100 border-red-300 text-red-800", desc: "Maximum effort. Short bursts only.", exercise: "Sprints, HIIT, all-out efforts (1-5 minutes)" },
];

export default function HeartRateZoneCalculator() {
  const [age, setAge] = useState("");
  const [restingHR, setRestingHR] = useState("");

  const result = useMemo(() => {
    const a = parseFloat(age);
    if (!a || a <= 0 || a > 120) return null;

    const maxHR = 220 - a;
    const rhr = parseFloat(restingHR) || 0;
    const useKarvonen = rhr > 0;

    const zones = ZONES.map((zone) => {
      let low: number, high: number;
      if (useKarvonen) {
        // Karvonen formula: Target HR = ((MaxHR - RestHR) * %intensity) + RestHR
        low = Math.round((maxHR - rhr) * (zone.min / 100) + rhr);
        high = Math.round((maxHR - rhr) * (zone.max / 100) + rhr);
      } else {
        low = Math.round(maxHR * (zone.min / 100));
        high = Math.round(maxHR * (zone.max / 100));
      }
      return { ...zone, low, high };
    });

    return { maxHR, rhr, useKarvonen, zones };
  }, [age, restingHR]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Age (years)</label>
          <input type="number" placeholder="e.g. 30" value={age} onChange={(e) => setAge(e.target.value)} className="calc-input" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Resting Heart Rate (optional)</label>
          <input type="number" placeholder="e.g. 65 bpm" value={restingHR} onChange={(e) => setRestingHR(e.target.value)} className="calc-input" />
          <div className="text-xs text-gray-400 mt-1">For more accurate zones using Karvonen method</div>
        </div>
      </div>

      {result && (
        <div className="result-card space-y-4">
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-1">Maximum Heart Rate</div>
            <div className="text-5xl font-extrabold text-indigo-600">{result.maxHR} <span className="text-lg font-normal text-gray-400">bpm</span></div>
            <div className="text-xs text-gray-400 mt-1">Formula: 220 - age{result.useKarvonen ? " (using Karvonen method with resting HR)" : ""}</div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <div className="text-sm font-semibold text-gray-700 mb-3">Heart Rate Zones</div>
            <div className="space-y-2">
              {result.zones.map((zone) => (
                <div key={zone.name} className={`rounded-xl p-3 border ${zone.color}`}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-sm font-bold">{zone.name}</div>
                    <div className="text-lg font-extrabold">{zone.low} - {zone.high} <span className="text-xs font-normal">bpm</span></div>
                  </div>
                  <div className="text-xs opacity-80">{zone.desc}</div>
                  <div className="text-xs font-medium mt-1">Exercises: {zone.exercise}</div>
                  <div className="w-full bg-white/40 rounded-full h-1.5 mt-2">
                    <div className="h-1.5 rounded-full bg-current opacity-40" style={{ width: `${zone.max}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
            <div className="text-xs text-blue-700">
              <strong>Tip:</strong> For weight loss, spend most time in Zone 2-3. For performance, include Zone 4-5 intervals. Always warm up in Zone 1 before intense exercise.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
