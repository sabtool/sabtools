"use client";
import { useState } from "react";

export default function NumberSystemConverter() {
  const [input, setInput] = useState("");
  const [base, setBase] = useState(10);

  const decimal = parseInt(input, base);
  const valid = !isNaN(decimal);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="text-sm font-semibold text-gray-700 block mb-2">Enter Number</label><input type="text" placeholder="Enter number..." value={input} onChange={(e) => setInput(e.target.value)} className="calc-input font-mono" /></div>
        <div><label className="text-sm font-semibold text-gray-700 block mb-2">Input Base</label>
          <div className="flex gap-2">{[{l:"Binary",v:2},{l:"Octal",v:8},{l:"Decimal",v:10},{l:"Hex",v:16}].map((b) => (
            <button key={b.v} onClick={() => setBase(b.v)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${base === b.v ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"}`}>{b.l}</button>
          ))}</div>
        </div>
      </div>
      {valid && input && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: "Binary (Base 2)", value: decimal.toString(2) },
            { label: "Octal (Base 8)", value: decimal.toString(8) },
            { label: "Decimal (Base 10)", value: decimal.toString(10) },
            { label: "Hexadecimal (Base 16)", value: decimal.toString(16).toUpperCase() },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div><div className="text-xs text-gray-500">{item.label}</div><div className="text-lg font-bold text-gray-800 font-mono">{item.value}</div></div>
              <button onClick={() => navigator.clipboard?.writeText(item.value)} className="text-xs text-indigo-600 font-medium hover:underline">Copy</button>
            </div>
          ))}
        </div>
      )}
      {input && !valid && <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600">Invalid number for base {base}</div>}
    </div>
  );
}
