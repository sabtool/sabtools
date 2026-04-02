"use client";
import { useState, useMemo } from "react";

const GRADES: { label: string; cement: number; sand: number; aggregate: number }[] = [
  { label: "M15 (1:2:4)", cement: 1, sand: 2, aggregate: 4 },
  { label: "M20 (1:1.5:3)", cement: 1, sand: 1.5, aggregate: 3 },
  { label: "M25 (1:1:2)", cement: 1, sand: 1, aggregate: 2 },
];

const UNITS = [
  { label: "Feet", factor: 1 },
  { label: "Meters", factor: 3.28084 },
];

export default function ConcreteCalculator() {
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [depth, setDepth] = useState("");
  const [unit, setUnit] = useState(0);
  const [grade, setGrade] = useState(1);
  const [bagPrice, setBagPrice] = useState("350");

  const result = useMemo(() => {
    const l = parseFloat(length);
    const w = parseFloat(width);
    const d = parseFloat(depth);
    const bp = parseFloat(bagPrice) || 350;
    if (!l || !w || !d || l <= 0 || w <= 0 || d <= 0) return null;

    const factor = UNITS[unit].factor;
    const lFt = l * factor;
    const wFt = w * factor;
    const dFt = d * factor;

    const volFt3 = lFt * wFt * dFt;
    const volM3 = volFt3 / 35.3147;

    const g = GRADES[grade];
    const totalParts = g.cement + g.sand + g.aggregate;

    // Dry volume = wet volume * 1.54
    const dryVolFt3 = volFt3 * 1.54;

    const cementVolFt3 = dryVolFt3 * (g.cement / totalParts);
    const sandVolFt3 = dryVolFt3 * (g.sand / totalParts);
    const aggregateVolFt3 = dryVolFt3 * (g.aggregate / totalParts);

    // 1 bag cement = 1.226 cu ft
    const cementBags = Math.ceil(cementVolFt3 / 1.226);
    const totalCost = cementBags * bp;

    return {
      volFt3: volFt3.toFixed(2),
      volM3: volM3.toFixed(3),
      cementBags,
      sandVolFt3: sandVolFt3.toFixed(2),
      aggregateVolFt3: aggregateVolFt3.toFixed(2),
      totalCost,
      gradeLabel: g.label,
    };
  }, [length, width, depth, unit, grade, bagPrice]);

  const fmt = (n: number) => n.toLocaleString("en-IN");
  const fmtCur = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Length</label>
          <input type="number" placeholder="e.g. 10" value={length} onChange={(e) => setLength(e.target.value)} className="calc-input" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Width</label>
          <input type="number" placeholder="e.g. 10" value={width} onChange={(e) => setWidth(e.target.value)} className="calc-input" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Depth</label>
          <input type="number" placeholder="e.g. 0.5" value={depth} onChange={(e) => setDepth(e.target.value)} className="calc-input" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Unit</label>
          <select value={unit} onChange={(e) => setUnit(Number(e.target.value))} className="calc-input">
            {UNITS.map((u, i) => <option key={i} value={i}>{u.label}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Concrete Grade</label>
          <select value={grade} onChange={(e) => setGrade(Number(e.target.value))} className="calc-input">
            {GRADES.map((g, i) => <option key={i} value={i}>{g.label}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Cement Bag Price (50kg)</label>
          <input type="number" placeholder="350" value={bagPrice} onChange={(e) => setBagPrice(e.target.value)} className="calc-input" />
        </div>
      </div>

      {/* Ratio Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-2 text-left font-semibold text-gray-600">Grade</th>
              <th className="p-2 text-center font-semibold text-gray-600">Cement</th>
              <th className="p-2 text-center font-semibold text-gray-600">Sand</th>
              <th className="p-2 text-center font-semibold text-gray-600">Aggregate</th>
            </tr>
          </thead>
          <tbody>
            {GRADES.map((g, i) => (
              <tr key={i} className={i === grade ? "bg-indigo-50 font-semibold" : ""}>
                <td className="p-2">{g.label}</td>
                <td className="p-2 text-center">{g.cement}</td>
                <td className="p-2 text-center">{g.sand}</td>
                <td className="p-2 text-center">{g.aggregate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {result && (
        <div className="result-card space-y-4">
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-1">Concrete Volume</div>
            <div className="text-4xl font-extrabold text-indigo-600">{result.volFt3} cu ft</div>
            <div className="text-sm text-gray-400 mt-1">{result.volM3} cu m</div>
          </div>

          <div className="border-t border-gray-100 pt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
              <div className="text-xs text-gray-400">Cement Bags (50kg)</div>
              <div className="text-lg font-bold text-indigo-600">{fmt(result.cementBags)}</div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
              <div className="text-xs text-gray-400">Sand</div>
              <div className="text-lg font-bold text-yellow-600">{result.sandVolFt3} cu ft</div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
              <div className="text-xs text-gray-400">Aggregate</div>
              <div className="text-lg font-bold text-green-600">{result.aggregateVolFt3} cu ft</div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4 grid grid-cols-2 gap-3">
            <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
              <div className="text-xs text-gray-400">Grade</div>
              <div className="text-lg font-bold text-gray-700">{result.gradeLabel}</div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
              <div className="text-xs text-gray-400">Cement Cost (Est.)</div>
              <div className="text-lg font-bold text-red-600">{fmtCur(result.totalCost)}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
