"use client";
import { useState } from "react";

export default function CsvToJson() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const convert = () => {
    const lines = input.trim().split("\n");
    if (lines.length < 2) { setOutput("[]"); return; }
    const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));
    const data = lines.slice(1).map((line) => {
      const values = line.split(",").map((v) => v.trim().replace(/^"|"$/g, ""));
      const obj: Record<string, string> = {};
      headers.forEach((h, i) => { obj[h] = values[i] || ""; });
      return obj;
    });
    setOutput(JSON.stringify(data, null, 2));
  };

  return (
    <div className="space-y-4">
      <div><label className="text-sm font-semibold text-gray-700 block mb-2">Input CSV</label><textarea placeholder="name,age,city&#10;John,30,Mumbai&#10;Jane,25,Delhi" value={input} onChange={(e) => setInput(e.target.value)} className="calc-input min-h-[150px] font-mono text-sm" rows={6} /></div>
      <button onClick={convert} className="btn-primary text-sm !py-2 !px-5">Convert to JSON</button>
      {output && (<div><div className="flex justify-between mb-2"><label className="text-sm font-semibold text-gray-700">JSON Output</label><button onClick={() => navigator.clipboard?.writeText(output)} className="text-xs text-indigo-600 font-medium hover:underline">Copy</button></div><pre className="bg-gray-900 text-green-400 rounded-xl p-4 text-sm overflow-auto font-mono max-h-[300px]">{output}</pre></div>)}
    </div>
  );
}
