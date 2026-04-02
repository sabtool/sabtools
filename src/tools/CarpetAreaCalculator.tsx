"use client";
import { useState, useMemo } from "react";

export default function CarpetAreaCalculator() {
  const [superBuiltUp, setSuperBuiltUp] = useState("1200");
  const [loadingFactor, setLoadingFactor] = useState("30");

  const result = useMemo(() => {
    const sba = parseFloat(superBuiltUp) || 0;
    const lf = parseFloat(loadingFactor) || 0;
    if (sba <= 0) return null;

    const builtUp = sba / (1 + lf / 100);
    const carpetArea = builtUp * 0.85;
    const commonArea = sba - builtUp;
    const wallArea = builtUp - carpetArea;
    const carpetPercent = (carpetArea / sba) * 100;

    return { sba, builtUp, carpetArea, commonArea, wallArea, carpetPercent };
  }, [superBuiltUp, loadingFactor]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Super Built-up Area (sq. ft.)</label>
          <input type="number" value={superBuiltUp} onChange={(e) => setSuperBuiltUp(e.target.value)} className="calc-input" placeholder="1200" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Loading Factor (%)</label>
          <input type="number" min={0} max={60} step={1} value={loadingFactor} onChange={(e) => setLoadingFactor(e.target.value)} className="calc-input" placeholder="30" />
          <div className="text-xs text-gray-400 mt-1">Typical range: 25% - 35% for apartments in India</div>
        </div>
      </div>

      <div className="bg-blue-50 rounded-xl p-3 text-sm text-blue-700">
        Super Built-up Area = Built-up Area + Common Area (loading). Built-up Area = Carpet Area + Wall Area (~15% of built-up). As per RERA guidelines, carpet area is the net usable area.
      </div>

      {result && (
        <div className="result-card space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Carpet Area</div>
              <div className="text-3xl font-extrabold text-indigo-600">{result.carpetArea.toFixed(0)}</div>
              <div className="text-xs text-gray-400">sq. ft.</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Built-up Area</div>
              <div className="text-2xl font-extrabold text-gray-800">{result.builtUp.toFixed(0)}</div>
              <div className="text-xs text-gray-400">sq. ft.</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Super Built-up Area</div>
              <div className="text-2xl font-extrabold text-gray-800">{result.sba.toFixed(0)}</div>
              <div className="text-xs text-gray-400">sq. ft.</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="bg-white rounded-xl p-3 shadow-sm flex justify-between">
              <span className="text-sm text-gray-600">Common Area (Loading)</span>
              <span className="text-sm font-bold text-gray-800">{result.commonArea.toFixed(0)} sq. ft.</span>
            </div>
            <div className="bg-white rounded-xl p-3 shadow-sm flex justify-between">
              <span className="text-sm text-gray-600">Wall Area (approx.)</span>
              <span className="text-sm font-bold text-gray-800">{result.wallArea.toFixed(0)} sq. ft.</span>
            </div>
            <div className="bg-white rounded-xl p-3 shadow-sm flex justify-between">
              <span className="text-sm text-gray-600">Carpet-to-Super Built-up Ratio</span>
              <span className="text-sm font-bold text-indigo-600">{result.carpetPercent.toFixed(1)}%</span>
            </div>
          </div>

          <div>
            <div className="text-xs font-medium text-gray-500 mb-2">Area Breakdown</div>
            <div className="flex h-6 rounded-full overflow-hidden">
              <div className="bg-indigo-500" style={{ width: `${(result.carpetArea / result.sba) * 100}%` }} title="Carpet Area" />
              <div className="bg-yellow-400" style={{ width: `${(result.wallArea / result.sba) * 100}%` }} title="Wall Area" />
              <div className="bg-gray-300" style={{ width: `${(result.commonArea / result.sba) * 100}%` }} title="Common Area" />
            </div>
            <div className="flex gap-4 text-xs text-gray-500 mt-1">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-indigo-500 inline-block" /> Carpet</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-yellow-400 inline-block" /> Walls</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-gray-300 inline-block" /> Common</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
