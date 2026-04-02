"use client";
import { useState, useMemo } from "react";

export default function VoltageDropCalculator() {
  const [wireSize, setWireSize] = useState(2.5);
  const [length, setLength] = useState(30);
  const [current, setCurrent] = useState(10);
  const [material, setMaterial] = useState<"copper" | "aluminium">("copper");
  const [voltage, setVoltage] = useState(220);

  const result = useMemo(() => {
    if (wireSize <= 0 || length <= 0 || current <= 0 || voltage <= 0) return null;

    // Resistivity in ohm.mm2/m
    const resistivity = material === "copper" ? 0.0172 : 0.0282;

    // Vd = (2 * rho * L * I) / A  (single phase)
    const vDrop = (2 * resistivity * length * current) / wireSize;
    const vDropPercent = (vDrop / voltage) * 100;
    const acceptable = vDropPercent <= 3;
    const receivingEnd = voltage - vDrop;

    return { vDrop, vDropPercent, acceptable, receivingEnd, resistivity };
  }, [wireSize, length, current, material, voltage]);

  const wireSizes = [0.5, 0.75, 1.0, 1.5, 2.5, 4, 6, 10, 16, 25, 35, 50];

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Wire Size (sq mm)</label>
          <select value={wireSize} onChange={(e) => setWireSize(+e.target.value)} className="calc-input">
            {wireSizes.map((s) => (
              <option key={s} value={s}>{s} sq mm</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Cable Length (meters, one way)</label>
          <input type="number" min={1} step={1} value={length} onChange={(e) => setLength(+e.target.value)} className="calc-input" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Current (Amps)</label>
          <input type="number" min={0.1} step={0.1} value={current} onChange={(e) => setCurrent(+e.target.value)} className="calc-input" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Supply Voltage (V)</label>
          <input type="number" min={1} step={1} value={voltage} onChange={(e) => setVoltage(+e.target.value)} className="calc-input" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Cable Material</label>
          <div className="flex gap-3">
            <button onClick={() => setMaterial("copper")} className={material === "copper" ? "btn-primary" : "btn-secondary"}>Copper</button>
            <button onClick={() => setMaterial("aluminium")} className={material === "aluminium" ? "btn-primary" : "btn-secondary"}>Aluminium</button>
          </div>
        </div>
      </div>

      {result && (
        <div className="result-card space-y-4">
          <h3 className="text-lg font-bold text-gray-800">Results</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Voltage Drop</div>
              <div className="text-2xl font-extrabold text-indigo-600">{result.vDrop.toFixed(2)} V</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Voltage Drop %</div>
              <div className={`text-2xl font-extrabold ${result.acceptable ? "text-green-600" : "text-red-500"}`}>
                {result.vDropPercent.toFixed(2)}%
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Receiving End Voltage</div>
              <div className="text-2xl font-extrabold text-amber-600">{result.receivingEnd.toFixed(2)} V</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Status</div>
              <div className={`text-2xl font-extrabold ${result.acceptable ? "text-green-600" : "text-red-500"}`}>
                {result.acceptable ? "Acceptable" : "Not Acceptable"}
              </div>
            </div>
          </div>

          <div className={`p-3 rounded-lg text-sm ${result.acceptable ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
            {result.acceptable
              ? "Voltage drop is within the recommended 3% limit. This wire size is suitable."
              : "Voltage drop exceeds the recommended 3% limit. Consider using a larger wire size or reducing cable length."}
          </div>
        </div>
      )}

      {/* Formula */}
      <div className="result-card">
        <h3 className="text-lg font-bold text-gray-800 mb-3">Formula Used</h3>
        <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
          <p className="font-mono text-center text-base font-semibold">Vd = (2 x p x L x I) / A</p>
          <div className="grid grid-cols-2 gap-2 mt-3 text-gray-600">
            <div><strong>Vd</strong> = Voltage drop (V)</div>
            <div><strong>p</strong> = Resistivity (ohm.mm2/m)</div>
            <div><strong>L</strong> = Cable length (m)</div>
            <div><strong>I</strong> = Current (A)</div>
            <div><strong>A</strong> = Cross-section area (mm2)</div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p>Resistivity values: <strong>Copper</strong> = 0.0172 | <strong>Aluminium</strong> = 0.0282 ohm.mm2/m</p>
            <p className="mt-1">Acceptable voltage drop: <strong>&le; 3%</strong> of supply voltage (Indian standard)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
