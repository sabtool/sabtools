"use client";
import { useState } from "react";

export default function JsonToCsv() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const convert = () => {
    try {
      const data = JSON.parse(input);
      const arr = Array.isArray(data) ? data : [data];
      if (arr.length === 0) { setError("Empty array"); return; }
      const headers = Object.keys(arr[0]);
      const csv = [headers.join(","), ...arr.map((row) => headers.map((h) => { const v = String(row[h] ?? ""); return v.includes(",") || v.includes('"') ? `"${v.replace(/"/g, '""')}"` : v; }).join(","))].join("\n");
      setOutput(csv); setError("");
    } catch (e: unknown) { setError((e as Error).message); setOutput(""); }
  };

  return (
    <div className="space-y-4">
      <div><label className="text-sm font-semibold text-gray-700 block mb-2">Input JSON (array of objects)</label><textarea placeholder='[{"name":"John","age":30},{"name":"Jane","age":25}]' value={input} onChange={(e) => setInput(e.target.value)} className="calc-input min-h-[150px] font-mono text-sm" rows={6} /></div>
      <button onClick={convert} className="btn-primary text-sm !py-2 !px-5">Convert to CSV</button>
      {error && <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600">{error}</div>}
      {output && (<div><div className="flex justify-between mb-2"><label className="text-sm font-semibold text-gray-700">CSV Output</label><button onClick={() => navigator.clipboard?.writeText(output)} className="text-xs text-indigo-600 font-medium hover:underline">Copy</button></div><textarea value={output} readOnly className="calc-input min-h-[150px] font-mono text-sm bg-gray-50" rows={6} /></div>)}
    </div>
  );
}
