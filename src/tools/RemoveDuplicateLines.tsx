"use client";
import { useState } from "react";

export default function RemoveDuplicateLines() {
  const [input, setInput] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(true);
  const lines = input.split("\n");
  const seen = new Set<string>();
  const unique = lines.filter((line) => { const key = caseSensitive ? line : line.toLowerCase(); if (seen.has(key)) return false; seen.add(key); return true; });
  const removed = lines.length - unique.length;

  return (
    <div className="space-y-4">
      <div><label className="text-sm font-semibold text-gray-700 block mb-2">Input Text</label><textarea placeholder="Paste text with duplicate lines..." value={input} onChange={(e) => setInput(e.target.value)} className="calc-input min-h-[150px] font-mono text-sm" rows={6} /></div>
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={caseSensitive} onChange={(e) => setCaseSensitive(e.target.checked)} className="w-4 h-4 rounded" /><span className="text-sm text-gray-700">Case sensitive</span></label>
        {input && <span className="text-sm text-gray-500 ml-auto">{removed} duplicate(s) found</span>}
      </div>
      {input && (
        <div>
          <div className="flex justify-between mb-2"><label className="text-sm font-semibold text-gray-700">Output ({unique.length} lines)</label><button onClick={() => navigator.clipboard?.writeText(unique.join("\n"))} className="text-xs text-indigo-600 font-medium hover:underline">Copy</button></div>
          <textarea value={unique.join("\n")} readOnly className="calc-input min-h-[150px] font-mono text-sm bg-gray-50" rows={6} />
        </div>
      )}
    </div>
  );
}
