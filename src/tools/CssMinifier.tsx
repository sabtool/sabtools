"use client";
import { useState } from "react";

export default function CssMinifier() {
  const [input, setInput] = useState("");
  const minified = input.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, " ").replace(/\s*([{}:;,>~+])\s*/g, "$1").replace(/;}/g, "}").trim();
  const saved = input.length > 0 ? ((1 - minified.length / input.length) * 100).toFixed(1) : "0";

  return (
    <div className="space-y-4">
      <div><label className="text-sm font-semibold text-gray-700 block mb-2">Input CSS</label><textarea placeholder="Paste your CSS here..." value={input} onChange={(e) => setInput(e.target.value)} className="calc-input min-h-[180px] font-mono text-sm" rows={8} /></div>
      {input && (
        <div className="flex gap-4 text-sm text-gray-500">
          <span>Original: <strong>{input.length}</strong> chars</span>
          <span>Minified: <strong>{minified.length}</strong> chars</span>
          <span>Saved: <strong className="text-green-600">{saved}%</strong></span>
        </div>
      )}
      {minified && (<div><div className="flex justify-between mb-2"><label className="text-sm font-semibold text-gray-700">Minified CSS</label><button onClick={() => navigator.clipboard?.writeText(minified)} className="text-xs text-indigo-600 font-medium hover:underline">Copy</button></div><textarea value={minified} readOnly className="calc-input min-h-[120px] font-mono text-sm bg-gray-900 text-green-400" rows={4} /></div>)}
    </div>
  );
}
