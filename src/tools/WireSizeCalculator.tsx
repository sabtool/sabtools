"use client";
import { useState, useMemo } from "react";

const WIRE_SIZES = [0.5, 0.75, 1.0, 1.5, 2.5, 4, 6, 10, 16, 25, 35, 50];

const WIRE_TABLE = [
  { size: 0.5, maxCu: 3, maxAl: 2, usage: "Signal wires, small electronics" },
  { size: 0.75, maxCu: 5, maxAl: 3.5, usage: "LED lights, small appliances" },
  { size: 1.0, maxCu: 8, maxAl: 6, usage: "Light circuits, fans" },
  { size: 1.5, maxCu: 10, maxAl: 8, usage: "Light points, fan circuits" },
  { size: 2.5, maxCu: 16, maxAl: 12, usage: "Power sockets, AC (1 ton)" },
  { size: 4, maxCu: 25, maxAl: 18, usage: "AC (1.5-2 ton), geyser" },
  { size: 6, maxCu: 32, maxAl: 24, usage: "Sub-main, heavy AC, motor" },
  { size: 10, maxCu: 45, maxAl: 35, usage: "Main line, 3-phase appliance" },
  { size: 16, maxCu: 60, maxAl: 46, usage: "Main incoming, heavy loads" },
];

export default function WireSizeCalculator() {
  const [current, setCurrent] = useState(10);
  const [voltage, setVoltage] = useState<220 | 440>(220);
  const [length, setLength] = useState(20);
  const [material, setMaterial] = useState<"copper" | "aluminium">("copper");

  const result = useMemo(() => {
    if (current <= 0 || length <= 0) return null;

    // Resistivity: copper = 0.0172, aluminium = 0.0282 ohm.mm2/m
    const resistivity = material === "copper" ? 0.0172 : 0.0282;
    const maxDropPercent = 3;
    const maxDropV = (voltage * maxDropPercent) / 100;

    // Minimum cross section = (2 * resistivity * length * current) / maxDropV
    const minArea = (2 * resistivity * length * current) / maxDropV;

    // Find recommended wire size
    const recommended = WIRE_SIZES.find((s) => s >= minArea) || WIRE_SIZES[WIRE_SIZES.length - 1];

    // Actual voltage drop with recommended size
    const actualDrop = (2 * resistivity * length * current) / recommended;
    const dropPercent = (actualDrop / voltage) * 100;

    return {
      minArea: minArea.toFixed(2),
      recommended,
      voltageDrop: actualDrop.toFixed(2),
      dropPercent: dropPercent.toFixed(2),
      acceptable: dropPercent <= 3,
    };
  }, [current, voltage, length, material]);

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Current (Amps)</label>
          <input type="number" min={0.1} step={0.1} value={current} onChange={(e) => setCurrent(+e.target.value)} className="calc-input" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Voltage</label>
          <div className="flex gap-3">
            <button onClick={() => setVoltage(220)} className={voltage === 220 ? "btn-primary" : "btn-secondary"}>220V (Single Phase)</button>
            <button onClick={() => setVoltage(440)} className={voltage === 440 ? "btn-primary" : "btn-secondary"}>440V (Three Phase)</button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Cable Length (meters, one way)</label>
          <input type="number" min={1} step={1} value={length} onChange={(e) => setLength(+e.target.value)} className="calc-input" />
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
          <h3 className="text-lg font-bold text-gray-800">Result</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Min. Cross Section</div>
              <div className="text-2xl font-extrabold text-indigo-600">{result.minArea} sq mm</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Recommended Wire Size</div>
              <div className="text-2xl font-extrabold text-emerald-600">{result.recommended} sq mm</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Voltage Drop</div>
              <div className="text-2xl font-extrabold text-amber-600">{result.voltageDrop} V</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Voltage Drop %</div>
              <div className={`text-2xl font-extrabold ${result.acceptable ? "text-green-600" : "text-red-500"}`}>
                {result.dropPercent}% {result.acceptable ? "(OK)" : "(Too High!)"}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reference Table */}
      <div className="result-card">
        <h3 className="text-lg font-bold text-gray-800 mb-3">Indian Standard Wire Size Reference</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left rounded-tl-lg">Size (sq mm)</th>
                <th className="p-2 text-center">Max Amps (Cu)</th>
                <th className="p-2 text-center">Max Amps (Al)</th>
                <th className="p-2 text-left rounded-tr-lg">Typical Usage</th>
              </tr>
            </thead>
            <tbody>
              {WIRE_TABLE.map((w) => (
                <tr key={w.size} className={`border-t ${result && w.size === result.recommended ? "bg-indigo-50 font-semibold" : ""}`}>
                  <td className="p-2">{w.size}</td>
                  <td className="p-2 text-center">{w.maxCu}A</td>
                  <td className="p-2 text-center">{w.maxAl}A</td>
                  <td className="p-2 text-gray-600">{w.usage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
