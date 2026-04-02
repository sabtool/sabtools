"use client";
import { useState, useMemo } from "react";

export default function DecimalToBinary() {
  const [mode, setMode] = useState<"dec" | "bin">("dec");
  const [decInput, setDecInput] = useState("");
  const [binInput, setBinInput] = useState("");

  const result = useMemo(() => {
    if (mode === "dec") {
      const v = parseInt(decInput);
      if (isNaN(v) || v < 0) return null;
      return {
        decimal: v,
        binary: v.toString(2),
        octal: v.toString(8),
        hexadecimal: v.toString(16).toUpperCase(),
      };
    } else {
      if (!/^[01]+$/.test(binInput.trim())) return null;
      const v = parseInt(binInput.trim(), 2);
      if (isNaN(v)) return null;
      return {
        decimal: v,
        binary: binInput.trim(),
        octal: v.toString(8),
        hexadecimal: v.toString(16).toUpperCase(),
      };
    }
  }, [mode, decInput, binInput]);

  const copy = (text: string) => navigator.clipboard.writeText(text);

  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        <button onClick={() => setMode("dec")} className={mode === "dec" ? "btn-primary" : "btn-secondary"}>
          Decimal to Others
        </button>
        <button onClick={() => setMode("bin")} className={mode === "bin" ? "btn-primary" : "btn-secondary"}>
          Binary to Decimal
        </button>
      </div>

      {mode === "dec" ? (
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Decimal Number</label>
          <input
            type="number"
            placeholder="Enter decimal number (e.g., 255)"
            value={decInput}
            onChange={(e) => setDecInput(e.target.value)}
            className="calc-input"
            min="0"
          />
        </div>
      ) : (
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Binary Number</label>
          <input
            type="text"
            placeholder="Enter binary number (e.g., 11111111)"
            value={binInput}
            onChange={(e) => setBinInput(e.target.value.replace(/[^01]/g, ""))}
            className="calc-input font-mono"
          />
        </div>
      )}

      {result && (
        <div className="space-y-3">
          {[
            { label: "Decimal (Base 10)", value: result.decimal.toLocaleString("en-IN"), raw: result.decimal.toString() },
            { label: "Binary (Base 2)", value: result.binary, raw: result.binary },
            { label: "Octal (Base 8)", value: result.octal, raw: result.octal },
            { label: "Hexadecimal (Base 16)", value: `0x${result.hexadecimal}`, raw: result.hexadecimal },
          ].map((item) => (
            <div key={item.label} className="result-card">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-500">{item.label}</div>
                  <div className="text-lg font-bold text-gray-800 font-mono">{item.value}</div>
                </div>
                <button onClick={() => copy(item.raw)} className="btn-secondary text-xs">
                  Copy
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Reference</h3>
        <div className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-100">
                <th className="p-2 text-left text-gray-600">Decimal</th>
                <th className="p-2 text-left text-gray-600">Binary</th>
                <th className="p-2 text-left text-gray-600">Octal</th>
                <th className="p-2 text-left text-gray-600">Hex</th>
              </tr>
            </thead>
            <tbody>
              {[0, 1, 2, 4, 8, 10, 16, 32, 64, 128, 255, 256, 1024].map((n) => (
                <tr key={n} className="border-b border-gray-100 last:border-0">
                  <td className="p-2 font-mono text-gray-800">{n}</td>
                  <td className="p-2 font-mono text-gray-600">{n.toString(2)}</td>
                  <td className="p-2 font-mono text-gray-600">{n.toString(8)}</td>
                  <td className="p-2 font-mono text-gray-600">{n.toString(16).toUpperCase()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
