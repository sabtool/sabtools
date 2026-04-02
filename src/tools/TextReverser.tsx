"use client";
import { useState } from "react";

export default function TextReverser() {
  const [input, setInput] = useState("");
  const charReverse = [...input].reverse().join("");
  const wordReverse = input.split(" ").reverse().join(" ");
  const lineReverse = input.split("\n").reverse().join("\n");

  return (
    <div className="space-y-4">
      <div><label className="text-sm font-semibold text-gray-700 block mb-2">Enter Text</label><textarea placeholder="Type or paste text here..." value={input} onChange={(e) => setInput(e.target.value)} className="calc-input min-h-[120px]" rows={4} /></div>
      {input && (
        <div className="space-y-3">
          {[
            { label: "Reverse Characters", value: charReverse },
            { label: "Reverse Words", value: wordReverse },
            { label: "Reverse Lines", value: lineReverse },
          ].map((item) => (
            <div key={item.label} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="flex justify-between mb-2"><div className="text-xs font-medium text-gray-500">{item.label}</div><button onClick={() => navigator.clipboard?.writeText(item.value)} className="text-xs text-indigo-600 font-medium hover:underline">Copy</button></div>
              <div className="text-sm font-mono text-gray-800">{item.value}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
