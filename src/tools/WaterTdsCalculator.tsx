"use client";
import { useState, useMemo } from "react";

export default function WaterTdsCalculator() {
  const [tds, setTds] = useState(250);

  const result = useMemo(() => {
    let classification = "";
    let color = "";
    let bgColor = "";
    let purifier = "";
    let purifierDesc = "";
    let drinkable = true;

    if (tds < 50) {
      classification = "Excellent";
      color = "text-emerald-600";
      bgColor = "bg-emerald-50";
      purifier = "No purifier needed / UV if needed";
      purifierDesc = "Water is very pure. A basic UV purifier is enough for biological safety.";
    } else if (tds <= 150) {
      classification = "Good (Ideal for Drinking)";
      color = "text-green-600";
      bgColor = "bg-green-50";
      purifier = "UV Purifier";
      purifierDesc = "TDS is in the ideal range. UV purifier is sufficient to kill bacteria and viruses.";
    } else if (tds <= 250) {
      classification = "Fair";
      color = "text-amber-600";
      bgColor = "bg-amber-50";
      purifier = "RO + UV Purifier";
      purifierDesc = "TDS is moderate. An RO+UV purifier is recommended to reduce dissolved solids.";
    } else if (tds <= 350) {
      classification = "Poor";
      color = "text-orange-600";
      bgColor = "bg-orange-50";
      purifier = "RO + UV + TDS Controller";
      purifierDesc = "High TDS. RO purifier with TDS controller is essential to make water safe.";
    } else if (tds <= 500) {
      classification = "Unacceptable";
      color = "text-red-500";
      bgColor = "bg-red-50";
      purifier = "RO + UV + Mineralizer";
      purifierDesc = "Very high TDS. Multi-stage RO purifier with mineralizer is required.";
      drinkable = false;
    } else {
      classification = "Hazardous";
      color = "text-red-700";
      bgColor = "bg-red-100";
      purifier = "Industrial RO System";
      purifierDesc = "Extremely high TDS. Standard home purifiers may not be sufficient. Consider industrial-grade RO.";
      drinkable = false;
    }

    return { classification, color, bgColor, purifier, purifierDesc, drinkable };
  }, [tds]);

  const tdsRanges = [
    { range: "< 50 ppm", label: "Excellent", color: "bg-emerald-400", desc: "Very pure, low mineral content" },
    { range: "50 - 150 ppm", label: "Good (Ideal)", color: "bg-green-400", desc: "Best for drinking, healthy minerals" },
    { range: "150 - 250 ppm", label: "Fair", color: "bg-amber-400", desc: "Acceptable, slightly high minerals" },
    { range: "250 - 350 ppm", label: "Poor", color: "bg-orange-400", desc: "Not ideal, needs purification" },
    { range: "> 350 ppm", label: "Unacceptable", color: "bg-red-400", desc: "Unsafe, must be purified" },
  ];

  // Visual bar position
  const barPercent = Math.min((tds / 600) * 100, 100);

  return (
    <div className="space-y-8">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Enter TDS Reading (ppm)</label>
        <input type="number" min={0} max={2000} step={1} value={tds} onChange={(e) => setTds(+e.target.value)} className="calc-input" />
        <input type="range" min={0} max={1000} step={5} value={tds} onChange={(e) => setTds(+e.target.value)} className="w-full mt-2" />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>0 ppm</span><span>1000 ppm</span>
        </div>
      </div>

      {/* TDS Meter Visual */}
      <div className="result-card">
        <div className="relative h-6 rounded-full overflow-hidden bg-gradient-to-r from-emerald-400 via-amber-400 to-red-500">
          <div
            className="absolute top-0 w-1 h-full bg-black rounded"
            style={{ left: `${barPercent}%`, transform: "translateX(-50%)" }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>0</span><span>150</span><span>300</span><span>450</span><span>600+</span>
        </div>
      </div>

      <div className="result-card space-y-4">
        <div className="text-center">
          <div className="text-sm text-gray-500 mb-1">Your Water TDS</div>
          <div className="text-4xl font-extrabold text-indigo-600">{tds} ppm</div>
        </div>

        <div className={`${result.bgColor} rounded-xl p-4 text-center`}>
          <div className={`text-2xl font-extrabold ${result.color}`}>{result.classification}</div>
          <div className="text-sm text-gray-600 mt-1">
            {result.drinkable ? "Can be consumed after basic purification" : "Not suitable for direct consumption"}
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h4 className="text-sm font-bold text-gray-700 mb-2">Recommended Purifier</h4>
          <div className="text-lg font-bold text-indigo-600">{result.purifier}</div>
          <p className="text-sm text-gray-600 mt-1">{result.purifierDesc}</p>
        </div>

        <div className="bg-blue-50 rounded-xl p-4">
          <h4 className="text-sm font-bold text-blue-800 mb-1">Ideal TDS for Drinking</h4>
          <p className="text-sm text-blue-700">
            The ideal TDS for drinking water is <strong>50 - 150 ppm</strong>. This range provides essential minerals (calcium, magnesium) while being free from harmful dissolved solids.
          </p>
        </div>
      </div>

      {/* Reference Table */}
      <div className="result-card">
        <h3 className="text-lg font-bold text-gray-800 mb-3">TDS Classification Chart</h3>
        <div className="space-y-2">
          {tdsRanges.map((r) => (
            <div key={r.range} className="flex items-center gap-3 bg-white rounded-lg p-3 shadow-sm">
              <div className={`w-4 h-4 rounded-full ${r.color} flex-shrink-0`} />
              <div className="flex-1">
                <div className="flex justify-between">
                  <span className="text-sm font-semibold">{r.range}</span>
                  <span className="text-sm font-bold text-gray-700">{r.label}</span>
                </div>
                <div className="text-xs text-gray-500">{r.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Purifier Comparison */}
      <div className="result-card">
        <h3 className="text-lg font-bold text-gray-800 mb-3">Purifier Types</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h4 className="font-bold text-green-600">UV Purifier</h4>
            <p className="text-xs text-gray-500 mt-1">Best for: TDS &lt; 200 ppm</p>
            <p className="text-xs text-gray-500 mt-1">Kills bacteria and viruses using UV light. Does not reduce TDS.</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h4 className="font-bold text-blue-600">RO Purifier</h4>
            <p className="text-xs text-gray-500 mt-1">Best for: TDS &gt; 200 ppm</p>
            <p className="text-xs text-gray-500 mt-1">Removes dissolved solids, heavy metals. Reduces TDS significantly.</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h4 className="font-bold text-indigo-600">RO + UV</h4>
            <p className="text-xs text-gray-500 mt-1">Best for: TDS &gt; 300 ppm</p>
            <p className="text-xs text-gray-500 mt-1">Combines RO filtration with UV disinfection for maximum safety.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
