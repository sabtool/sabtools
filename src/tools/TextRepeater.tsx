"use client";
import { useState } from "react";

export default function TextRepeater() {
  const [text, setText] = useState("");
  const [count, setCount] = useState("5");
  const [separator, setSeparator] = useState("newline");
  const seps: Record<string, string> = { newline: "\n", space: " ", comma: ", ", dash: " - ", none: "" };
  const output = text ? Array(parseInt(count) || 1).fill(text).join(seps[separator] || "\n") : "";

  return (
    <div className="space-y-4">
      <div><label className="text-sm font-semibold text-gray-700 block mb-2">Text to Repeat</label><input type="text" placeholder="Enter text..." value={text} onChange={(e) => setText(e.target.value)} className="calc-input" /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="text-sm font-semibold text-gray-700 block mb-2">Repeat Count</label><input type="number" min={1} max={10000} value={count} onChange={(e) => setCount(e.target.value)} className="calc-input" /></div>
        <div><label className="text-sm font-semibold text-gray-700 block mb-2">Separator</label>
          <select value={separator} onChange={(e) => setSeparator(e.target.value)} className="calc-input">
            {Object.keys(seps).map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>
      {output && (
        <div>
          <div className="flex justify-between mb-2"><label className="text-sm font-semibold text-gray-700">Output</label><button onClick={() => navigator.clipboard?.writeText(output)} className="text-xs text-indigo-600 font-medium hover:underline">Copy</button></div>
          <textarea value={output} readOnly className="calc-input min-h-[150px] text-sm" rows={6} />
        </div>
      )}
    </div>
  );
}
