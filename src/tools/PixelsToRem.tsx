"use client";
import { useState, useMemo } from "react";

const commonValues = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72, 80, 96];

export default function PixelsToRem() {
  const [mode, setMode] = useState<"px" | "rem">("px");
  const [value, setValue] = useState("");
  const [base, setBase] = useState("16");

  const result = useMemo(() => {
    const v = parseFloat(value);
    const b = parseFloat(base);
    if (isNaN(v) || isNaN(b) || b <= 0) return null;
    if (mode === "px") {
      return { px: v, rem: v / b };
    } else {
      return { px: v * b, rem: v };
    }
  }, [value, base, mode]);

  const baseFontSize = parseFloat(base) || 16;

  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        <button onClick={() => setMode("px")} className={mode === "px" ? "btn-primary" : "btn-secondary"}>
          PX to REM
        </button>
        <button onClick={() => setMode("rem")} className={mode === "rem" ? "btn-primary" : "btn-secondary"}>
          REM to PX
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">
            {mode === "px" ? "Pixels (px)" : "REM"}
          </label>
          <input
            type="number"
            placeholder={mode === "px" ? "Enter pixels" : "Enter rem"}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="calc-input"
            min="0"
            step="any"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Base Font Size (px)</label>
          <input
            type="number"
            placeholder="16"
            value={base}
            onChange={(e) => setBase(e.target.value)}
            className="calc-input"
            min="1"
          />
        </div>
      </div>

      {result && value && (
        <div className="result-card text-center">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-gray-500">Pixels</div>
              <div className="text-2xl font-bold text-gray-800">{result.px}px</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">REM</div>
              <div className="text-2xl font-bold text-indigo-600">{parseFloat(result.rem.toFixed(6))}rem</div>
            </div>
          </div>
        </div>
      )}

      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Conversion Table (Base: {baseFontSize}px)
        </h3>
        <div className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-100">
                <th className="p-2 text-left text-gray-600">Pixels</th>
                <th className="p-2 text-left text-gray-600">REM</th>
                <th className="p-2 text-left text-gray-600">Point (pt)</th>
              </tr>
            </thead>
            <tbody>
              {commonValues.map((px) => (
                <tr key={px} className="border-b border-gray-100 last:border-0">
                  <td className="p-2 font-mono text-gray-800">{px}px</td>
                  <td className="p-2 font-mono text-indigo-600">{parseFloat((px / baseFontSize).toFixed(4))}rem</td>
                  <td className="p-2 font-mono text-gray-600">{(px * 0.75).toFixed(1)}pt</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
