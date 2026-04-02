"use client";
import { useState, useMemo } from "react";

const FIXTURES = [
  { label: "Wash Basin Tap", flow: 0.15, units: 1 },
  { label: "Kitchen Sink Tap", flow: 0.2, units: 2 },
  { label: "Shower", flow: 0.2, units: 3 },
  { label: "Bath Tub", flow: 0.3, units: 4 },
  { label: "Toilet (Flush Tank)", flow: 0.1, units: 3 },
  { label: "Toilet (Flush Valve)", flow: 1.0, units: 6 },
  { label: "Washing Machine", flow: 0.2, units: 3 },
  { label: "Garden Tap", flow: 0.3, units: 3 },
];

const PIPE_SIZES = [
  { nominal: '1/2"', diamMm: 15, maxFlow: 0.3, maxUnits: 6 },
  { nominal: '3/4"', diamMm: 20, maxFlow: 0.6, maxUnits: 15 },
  { nominal: '1"', diamMm: 25, maxFlow: 1.2, maxUnits: 35 },
  { nominal: '1 1/4"', diamMm: 32, maxFlow: 1.8, maxUnits: 60 },
  { nominal: '1 1/2"', diamMm: 40, maxFlow: 2.5, maxUnits: 90 },
  { nominal: '2"', diamMm: 50, maxFlow: 4.0, maxUnits: 150 },
];

const PIPE_MATERIALS = [
  { label: "CPVC", pressure: "High (10 kg/cm2)", temp: "Up to 93 deg C", use: "Hot & Cold water", cost: "Medium" },
  { label: "uPVC", pressure: "Medium (6 kg/cm2)", temp: "Up to 45 deg C", use: "Cold water only", cost: "Low" },
  { label: "GI (Galvanized Iron)", pressure: "High (10+ kg/cm2)", temp: "Up to 100 deg C", use: "All purpose", cost: "High" },
  { label: "PPR", pressure: "High (10 kg/cm2)", temp: "Up to 95 deg C", use: "Hot & Cold water", cost: "Medium-High" },
];

export default function PipeSizeCalculator() {
  const [fixtureQtys, setFixtureQtys] = useState<number[]>(FIXTURES.map(() => 0));

  const updateQty = (index: number, val: string) => {
    const n = parseInt(val) || 0;
    setFixtureQtys((prev) => {
      const copy = [...prev];
      copy[index] = Math.max(0, n);
      return copy;
    });
  };

  const result = useMemo(() => {
    let totalFlow = 0;
    let totalUnits = 0;

    FIXTURES.forEach((f, i) => {
      totalFlow += f.flow * fixtureQtys[i];
      totalUnits += f.units * fixtureQtys[i];
    });

    if (totalFlow <= 0) return null;

    // Apply simultaneity factor (not all fixtures used at once)
    const simultaneityFactor = totalUnits <= 10 ? 0.8 : totalUnits <= 30 ? 0.6 : 0.5;
    const designFlow = totalFlow * simultaneityFactor;

    const recommended = PIPE_SIZES.find((p) => p.maxFlow >= designFlow) ?? PIPE_SIZES[PIPE_SIZES.length - 1];

    // Pressure drop estimation (Hazen-Williams, simplified)
    // Assume C=140 (CPVC), velocity ~1.5 m/s, 10m pipe
    const velocity = designFlow / (Math.PI * (recommended.diamMm / 2000) ** 2);
    const pressureDropPer10m = (10.67 * Math.pow(designFlow * 1000, 1.852)) /
      (Math.pow(140, 1.852) * Math.pow(recommended.diamMm / 1000, 4.87));

    return {
      totalFlow: totalFlow.toFixed(2),
      designFlow: designFlow.toFixed(2),
      totalUnits,
      simultaneityFactor: (simultaneityFactor * 100).toFixed(0),
      recommended,
      velocity: velocity.toFixed(2),
      pressureDrop: pressureDropPer10m > 0 ? pressureDropPer10m.toFixed(3) : "< 0.001",
    };
  }, [fixtureQtys]);

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Fixtures & Quantity</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {FIXTURES.map((f, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-sm text-gray-600 flex-1">{f.label} ({f.flow} L/s)</span>
              <input
                type="number"
                min="0"
                value={fixtureQtys[i] || ""}
                placeholder="0"
                onChange={(e) => updateQty(i, e.target.value)}
                className="calc-input w-20 text-center"
              />
            </div>
          ))}
        </div>
      </div>

      {result && (
        <div className="result-card space-y-4">
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-1">Recommended Pipe Size</div>
            <div className="text-5xl font-extrabold text-indigo-600">{result.recommended.nominal}</div>
            <div className="text-sm text-gray-400 mt-1">{result.recommended.diamMm} mm internal diameter</div>
          </div>

          <div className="border-t border-gray-100 pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
              <div className="text-xs text-gray-400">Total Flow</div>
              <div className="text-lg font-bold text-blue-600">{result.totalFlow} L/s</div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
              <div className="text-xs text-gray-400">Design Flow</div>
              <div className="text-lg font-bold text-indigo-600">{result.designFlow} L/s</div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
              <div className="text-xs text-gray-400">Fixture Units</div>
              <div className="text-lg font-bold text-green-600">{result.totalUnits}</div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
              <div className="text-xs text-gray-400">Simultaneity</div>
              <div className="text-lg font-bold text-yellow-600">{result.simultaneityFactor}%</div>
            </div>
          </div>

          {/* Pipe size reference table */}
          <div className="border-t border-gray-100 pt-4">
            <div className="text-sm font-semibold text-gray-700 mb-2">Pipe Size Reference (IS Standard)</div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-2 text-left font-semibold text-gray-600">Size</th>
                    <th className="p-2 text-center font-semibold text-gray-600">Dia (mm)</th>
                    <th className="p-2 text-center font-semibold text-gray-600">Max Flow (L/s)</th>
                    <th className="p-2 text-center font-semibold text-gray-600">Max Units</th>
                  </tr>
                </thead>
                <tbody>
                  {PIPE_SIZES.map((p, i) => (
                    <tr key={i} className={p.nominal === result.recommended.nominal ? "bg-indigo-50 font-semibold" : ""}>
                      <td className="p-2">{p.nominal}</td>
                      <td className="p-2 text-center">{p.diamMm}</td>
                      <td className="p-2 text-center">{p.maxFlow}</td>
                      <td className="p-2 text-center">{p.maxUnits}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Material recommendation */}
          <div className="border-t border-gray-100 pt-4">
            <div className="text-sm font-semibold text-gray-700 mb-2">Pipe Material Comparison</div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-2 text-left font-semibold text-gray-600">Material</th>
                    <th className="p-2 text-center font-semibold text-gray-600">Pressure</th>
                    <th className="p-2 text-center font-semibold text-gray-600">Temp</th>
                    <th className="p-2 text-center font-semibold text-gray-600">Use</th>
                    <th className="p-2 text-center font-semibold text-gray-600">Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {PIPE_MATERIALS.map((m, i) => (
                    <tr key={i}>
                      <td className="p-2 font-medium">{m.label}</td>
                      <td className="p-2 text-center">{m.pressure}</td>
                      <td className="p-2 text-center">{m.temp}</td>
                      <td className="p-2 text-center">{m.use}</td>
                      <td className="p-2 text-center">{m.cost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
