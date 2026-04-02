"use client";
import { useState, useMemo } from "react";

export default function OhmsLawCalculator() {
  const [voltageStr, setVoltageStr] = useState("");
  const [currentStr, setCurrentStr] = useState("");
  const [resistanceStr, setResistanceStr] = useState("");
  const [powerStr, setPowerStr] = useState("");

  const result = useMemo(() => {
    const V = voltageStr ? parseFloat(voltageStr) : null;
    const I = currentStr ? parseFloat(currentStr) : null;
    const R = resistanceStr ? parseFloat(resistanceStr) : null;
    const P = powerStr ? parseFloat(powerStr) : null;

    const given: string[] = [];
    if (V !== null && !isNaN(V)) given.push("V");
    if (I !== null && !isNaN(I)) given.push("I");
    if (R !== null && !isNaN(R)) given.push("R");
    if (P !== null && !isNaN(P)) given.push("P");

    if (given.length < 2) return null;

    let calcV = V, calcI = I, calcR = R, calcP = P;
    let formula = "";

    const has = (a: string, b: string) => given.includes(a) && given.includes(b);

    if (has("V", "I")) {
      calcR = (V as number) / (I as number);
      calcP = (V as number) * (I as number);
      formula = "R = V / I, P = V x I";
    } else if (has("V", "R")) {
      calcI = (V as number) / (R as number);
      calcP = (V as number) * (V as number) / (R as number);
      formula = "I = V / R, P = V2 / R";
    } else if (has("V", "P")) {
      calcI = (P as number) / (V as number);
      calcR = (V as number) * (V as number) / (P as number);
      formula = "I = P / V, R = V2 / P";
    } else if (has("I", "R")) {
      calcV = (I as number) * (R as number);
      calcP = (I as number) * (I as number) * (R as number);
      formula = "V = I x R, P = I2 x R";
    } else if (has("I", "P")) {
      calcV = (P as number) / (I as number);
      calcR = (P as number) / ((I as number) * (I as number));
      formula = "V = P / I, R = P / I2";
    } else if (has("R", "P")) {
      calcV = Math.sqrt((P as number) * (R as number));
      calcI = Math.sqrt((P as number) / (R as number));
      formula = "V = sqrt(P x R), I = sqrt(P / R)";
    }

    return {
      voltage: calcV,
      current: calcI,
      resistance: calcR,
      power: calcP,
      formula,
    };
  }, [voltageStr, currentStr, resistanceStr, powerStr]);

  const clearAll = () => {
    setVoltageStr("");
    setCurrentStr("");
    setResistanceStr("");
    setPowerStr("");
  };

  const filledCount = [voltageStr, currentStr, resistanceStr, powerStr].filter(Boolean).length;

  return (
    <div className="space-y-8">
      <p className="text-sm text-gray-600">Enter any <strong>2 values</strong> and the other 2 will be calculated automatically.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Voltage (V)</label>
          <input
            type="number" step="any" placeholder="Enter voltage"
            value={voltageStr} onChange={(e) => setVoltageStr(e.target.value)}
            className="calc-input"
            disabled={filledCount >= 2 && !voltageStr}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Current (A)</label>
          <input
            type="number" step="any" placeholder="Enter current"
            value={currentStr} onChange={(e) => setCurrentStr(e.target.value)}
            className="calc-input"
            disabled={filledCount >= 2 && !currentStr}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Resistance (ohm)</label>
          <input
            type="number" step="any" placeholder="Enter resistance"
            value={resistanceStr} onChange={(e) => setResistanceStr(e.target.value)}
            className="calc-input"
            disabled={filledCount >= 2 && !resistanceStr}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Power (W)</label>
          <input
            type="number" step="any" placeholder="Enter power"
            value={powerStr} onChange={(e) => setPowerStr(e.target.value)}
            className="calc-input"
            disabled={filledCount >= 2 && !powerStr}
          />
        </div>
      </div>

      <button onClick={clearAll} className="btn-secondary text-sm">Clear All</button>

      {result && (
        <div className="result-card space-y-4">
          <h3 className="text-lg font-bold text-gray-800">Results</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Voltage</div>
              <div className="text-xl font-extrabold text-indigo-600">{result.voltage?.toFixed(4)} V</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Current</div>
              <div className="text-xl font-extrabold text-emerald-600">{result.current?.toFixed(4)} A</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Resistance</div>
              <div className="text-xl font-extrabold text-amber-600">{result.resistance?.toFixed(4)} ohm</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Power</div>
              <div className="text-xl font-extrabold text-red-500">{result.power?.toFixed(4)} W</div>
            </div>
          </div>
          <p className="text-sm text-gray-600">Formula used: <strong>{result.formula}</strong></p>
        </div>
      )}

      {/* Ohm's Law Formulas */}
      <div className="result-card">
        <h3 className="text-lg font-bold text-gray-800 mb-3">Ohm&apos;s Law Formulas</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-center mb-4">
            <div className="inline-block bg-white rounded-xl p-4 shadow-sm">
              <div className="text-sm text-gray-500 mb-2">Ohm&apos;s Law Triangle</div>
              <div className="text-2xl font-bold text-indigo-600 mb-1">V</div>
              <div className="border-t-2 border-gray-300 w-24 mx-auto"></div>
              <div className="flex justify-center gap-6 text-2xl font-bold mt-1">
                <span className="text-emerald-600">I</span>
                <span className="text-gray-400">x</span>
                <span className="text-amber-600">R</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-white rounded-lg p-3">
              <p className="font-semibold">V = I x R</p>
              <p className="text-gray-500">Voltage = Current x Resistance</p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <p className="font-semibold">I = V / R</p>
              <p className="text-gray-500">Current = Voltage / Resistance</p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <p className="font-semibold">R = V / I</p>
              <p className="text-gray-500">Resistance = Voltage / Current</p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <p className="font-semibold">P = V x I</p>
              <p className="text-gray-500">Power = Voltage x Current</p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <p className="font-semibold">P = I&#178; x R</p>
              <p className="text-gray-500">Power = Current&#178; x Resistance</p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <p className="font-semibold">P = V&#178; / R</p>
              <p className="text-gray-500">Power = Voltage&#178; / Resistance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
