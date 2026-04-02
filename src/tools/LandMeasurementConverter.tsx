"use client";
import { useState, useMemo } from "react";

type State = "UP/Bihar" | "Rajasthan" | "HP" | "Assam" | "Gujarat" | "MP" | "WB" | "Punjab";

// All conversions relative to 1 square foot
const baseUnits: Record<string, { label: string; sqft: number; note?: string }> = {
  sqft: { label: "Square Feet", sqft: 1 },
  sqm: { label: "Square Meters", sqft: 10.7639 },
  acre: { label: "Acre", sqft: 43560 },
  hectare: { label: "Hectare", sqft: 107639.1 },
  guntha: { label: "Guntha", sqft: 1089 },
  cent: { label: "Cent", sqft: 435.6 },
  ground: { label: "Ground", sqft: 2400 },
  kanal: { label: "Kanal", sqft: 5445 },
  marla: { label: "Marla", sqft: 272.25 },
  biswa: { label: "Biswa (UP)", sqft: 1350 },
  katha: { label: "Katha (Bihar)", sqft: 1361.25 },
  dismil: { label: "Dismil / Decimal", sqft: 435.6 },
};

// Bigha varies by state
const bighaByState: Record<State, { sqft: number; note: string }> = {
  "UP/Bihar": { sqft: 27000, note: "1 Bigha = 20 Biswa = 27,000 sq ft" },
  Rajasthan: { sqft: 27225, note: "1 Bigha = 27,225 sq ft (Pucca Bigha)" },
  HP: { sqft: 8712, note: "1 Bigha = 8,712 sq ft" },
  Assam: { sqft: 14400, note: "1 Bigha = 14,400 sq ft" },
  Gujarat: { sqft: 17424, note: "1 Bigha = 17,424 sq ft" },
  MP: { sqft: 12000, note: "1 Bigha = 12,000 sq ft (Kachha Bigha)" },
  WB: { sqft: 14400, note: "1 Bigha = 14,400 sq ft" },
  Punjab: { sqft: 9070, note: "1 Bigha = 9,070 sq ft" },
};

export default function LandMeasurementConverter() {
  const [value, setValue] = useState(1);
  const [fromUnit, setFromUnit] = useState("acre");
  const [toUnit, setToUnit] = useState("hectare");
  const [bighaState, setBighaState] = useState<State>("UP/Bihar");

  const allUnits = useMemo(() => {
    const units = { ...baseUnits };
    units["bigha"] = {
      label: `Bigha (${bighaState})`,
      sqft: bighaByState[bighaState].sqft,
      note: bighaByState[bighaState].note,
    };
    return units;
  }, [bighaState]);

  const result = useMemo(() => {
    const fromSqft = allUnits[fromUnit]?.sqft || 1;
    const toSqft = allUnits[toUnit]?.sqft || 1;
    const totalSqft = value * fromSqft;
    const converted = totalSqft / toSqft;
    const factor = fromSqft / toSqft;
    return { converted, factor, totalSqft };
  }, [value, fromUnit, toUnit, allUnits]);

  const allConversions = useMemo(() => {
    const totalSqft = value * (allUnits[fromUnit]?.sqft || 1);
    return Object.entries(allUnits).map(([key, unit]) => ({
      key,
      label: unit.label,
      value: totalSqft / unit.sqft,
    }));
  }, [value, fromUnit, allUnits]);

  const fmtNum = (n: number) => {
    if (n >= 1) return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 4 }).format(n);
    return n.toPrecision(6);
  };

  const swap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  return (
    <div className="space-y-8">
      {/* State Selector for Bigha */}
      <div>
        <label className="text-sm font-semibold text-gray-700 mb-2 block">Bigha State Variant</label>
        <select value={bighaState} onChange={(e) => setBighaState(e.target.value as State)} className="calc-input">
          {Object.keys(bighaByState).map((s) => (
            <option key={s} value={s}>{s} — {bighaByState[s as State].note}</option>
          ))}
        </select>
      </div>

      {/* Converter */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Value</label>
            <input
              type="number"
              min={0}
              step={0.01}
              value={value}
              onChange={(e) => setValue(+e.target.value)}
              className="calc-input"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">From</label>
            <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} className="calc-input">
              {Object.entries(allUnits).map(([key, unit]) => (
                <option key={key} value={key}>{unit.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">To</label>
            <select value={toUnit} onChange={(e) => setToUnit(e.target.value)} className="calc-input">
              {Object.entries(allUnits).map(([key, unit]) => (
                <option key={key} value={key}>{unit.label}</option>
              ))}
            </select>
          </div>
        </div>
        <button onClick={swap} className="btn-secondary text-sm px-4 py-2">Swap Units</button>
      </div>

      {/* Main Result */}
      <div className="result-card space-y-4">
        <div className="bg-white rounded-xl p-6 text-center shadow-sm">
          <div className="text-sm text-gray-500 mb-2">
            {fmtNum(value)} {allUnits[fromUnit]?.label} =
          </div>
          <div className="text-3xl font-extrabold text-indigo-600">
            {fmtNum(result.converted)} {allUnits[toUnit]?.label}
          </div>
          <div className="text-xs text-gray-400 mt-2">
            Conversion factor: 1 {allUnits[fromUnit]?.label} = {fmtNum(result.factor)} {allUnits[toUnit]?.label}
          </div>
        </div>
      </div>

      {/* All Conversions */}
      <div className="result-card space-y-3">
        <h3 className="text-lg font-bold text-gray-800">All Conversions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {allConversions.map((conv) => (
            <div
              key={conv.key}
              className={`bg-white rounded-xl p-3 shadow-sm border ${
                conv.key === toUnit ? "border-indigo-300 bg-indigo-50" : "border-gray-100"
              }`}
            >
              <div className="text-xs text-gray-500">{conv.label}</div>
              <div className="text-lg font-bold text-gray-800">{fmtNum(conv.value)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bigha Info */}
      <div className="text-xs text-gray-400 text-center">
        Note: Bigha size varies by state. Selected: {bighaByState[bighaState].note}
      </div>
    </div>
  );
}
