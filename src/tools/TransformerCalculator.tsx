"use client";
import { useState, useMemo } from "react";

export default function TransformerCalculator() {
  const [primaryVoltage, setPrimaryVoltage] = useState(230);
  const [secondaryVoltage, setSecondaryVoltage] = useState(12);
  const [primaryTurns, setPrimaryTurns] = useState(1000);
  const [secondaryTurnsStr, setSecondaryTurnsStr] = useState("");
  const [vaRating, setVaRating] = useState(100);
  const [calcMode, setCalcMode] = useState<"secTurns" | "secVoltage" | "priVoltage">("secTurns");

  const result = useMemo(() => {
    if (primaryVoltage <= 0 || secondaryVoltage <= 0 || primaryTurns <= 0 || vaRating <= 0) return null;

    let Vp = primaryVoltage, Vs = secondaryVoltage, Np = primaryTurns, Ns = 0;
    let turnsRatio = 0;

    if (calcMode === "secTurns") {
      // Ns = Np * Vs / Vp
      Ns = Math.round((Np * Vs) / Vp);
      turnsRatio = Vp / Vs;
    } else if (calcMode === "secVoltage") {
      Ns = secondaryTurnsStr ? parseInt(secondaryTurnsStr) : 0;
      if (Ns <= 0) return null;
      Vs = (Ns * Vp) / Np;
      turnsRatio = Vp / Vs;
    } else {
      Ns = secondaryTurnsStr ? parseInt(secondaryTurnsStr) : 0;
      if (Ns <= 0) return null;
      Vp = (Np * Vs) / Ns;
      turnsRatio = Vp / Vs;
    }

    const primaryCurrent = vaRating / Vp;
    const secondaryCurrent = vaRating / Vs;

    return {
      Vp, Vs, Np, Ns, turnsRatio,
      primaryCurrent,
      secondaryCurrent,
      vaRating,
      isStepDown: Vp > Vs,
    };
  }, [primaryVoltage, secondaryVoltage, primaryTurns, secondaryTurnsStr, vaRating, calcMode]);

  return (
    <div className="space-y-8">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">What to Calculate?</label>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setCalcMode("secTurns")} className={calcMode === "secTurns" ? "btn-primary" : "btn-secondary"}>Secondary Turns</button>
          <button onClick={() => setCalcMode("secVoltage")} className={calcMode === "secVoltage" ? "btn-primary" : "btn-secondary"}>Secondary Voltage</button>
          <button onClick={() => setCalcMode("priVoltage")} className={calcMode === "priVoltage" ? "btn-primary" : "btn-secondary"}>Primary Voltage</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Primary Voltage (V) {calcMode === "priVoltage" && <span className="text-indigo-500">(calculated)</span>}
          </label>
          <input
            type="number" min={1} value={primaryVoltage}
            onChange={(e) => setPrimaryVoltage(+e.target.value)}
            className="calc-input"
            disabled={calcMode === "priVoltage"}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Secondary Voltage (V) {calcMode === "secVoltage" && <span className="text-indigo-500">(calculated)</span>}
          </label>
          <input
            type="number" min={1} value={secondaryVoltage}
            onChange={(e) => setSecondaryVoltage(+e.target.value)}
            className="calc-input"
            disabled={calcMode === "secVoltage"}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Primary Turns (Np)</label>
          <input type="number" min={1} value={primaryTurns} onChange={(e) => setPrimaryTurns(+e.target.value)} className="calc-input" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Secondary Turns (Ns) {calcMode === "secTurns" && <span className="text-indigo-500">(calculated)</span>}
          </label>
          <input
            type="number" min={1}
            value={calcMode === "secTurns" ? (result?.Ns ?? "") : secondaryTurnsStr}
            onChange={(e) => setSecondaryTurnsStr(e.target.value)}
            className="calc-input"
            disabled={calcMode === "secTurns"}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1">VA Rating (Apparent Power)</label>
          <input type="number" min={1} value={vaRating} onChange={(e) => setVaRating(+e.target.value)} className="calc-input" />
        </div>
      </div>

      {result && (
        <div className="result-card space-y-4">
          <h3 className="text-lg font-bold text-gray-800">Transformer Specifications</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Turns Ratio</div>
              <div className="text-2xl font-extrabold text-indigo-600">{result.turnsRatio.toFixed(2)} : 1</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Type</div>
              <div className="text-xl font-extrabold text-amber-600">{result.isStepDown ? "Step-Down" : "Step-Up"}</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Secondary Turns</div>
              <div className="text-2xl font-extrabold text-emerald-600">{result.Ns}</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Primary Voltage</div>
              <div className="text-xl font-extrabold text-gray-700">{result.Vp.toFixed(2)} V</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Secondary Voltage</div>
              <div className="text-xl font-extrabold text-gray-700">{result.Vs.toFixed(2)} V</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">VA Rating</div>
              <div className="text-xl font-extrabold text-gray-700">{result.vaRating} VA</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Primary Current</div>
              <div className="text-xl font-extrabold text-blue-600">{result.primaryCurrent.toFixed(3)} A</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Secondary Current</div>
              <div className="text-xl font-extrabold text-blue-600">{result.secondaryCurrent.toFixed(3)} A</div>
            </div>
          </div>
        </div>
      )}

      <div className="result-card">
        <h3 className="text-lg font-bold text-gray-800 mb-3">Transformer Formula</h3>
        <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
          <p className="font-mono text-center text-base font-semibold">Vp / Vs = Np / Ns</p>
          <div className="grid grid-cols-2 gap-2 mt-3 text-gray-600">
            <div><strong>Vp</strong> = Primary voltage</div>
            <div><strong>Vs</strong> = Secondary voltage</div>
            <div><strong>Np</strong> = Primary turns</div>
            <div><strong>Ns</strong> = Secondary turns</div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-200 text-gray-600">
            <p><strong>Power:</strong> Pp = Ps (ideal transformer)</p>
            <p><strong>Current:</strong> Ip = VA / Vp, Is = VA / Vs</p>
          </div>
        </div>
      </div>
    </div>
  );
}
