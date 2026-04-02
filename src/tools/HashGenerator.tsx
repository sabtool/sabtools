"use client";
import { useState } from "react";

async function hash(algo: string, text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const buffer = await crypto.subtle.digest(algo, data);
  return Array.from(new Uint8Array(buffer)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export default function HashGenerator() {
  const [input, setInput] = useState("");
  const [hashes, setHashes] = useState<Record<string, string>>({});

  const generate = async () => {
    if (!input) return;
    const results: Record<string, string> = {};
    results["SHA-1"] = await hash("SHA-1", input);
    results["SHA-256"] = await hash("SHA-256", input);
    results["SHA-384"] = await hash("SHA-384", input);
    results["SHA-512"] = await hash("SHA-512", input);
    setHashes(results);
  };

  return (
    <div className="space-y-4">
      <div><label className="text-sm font-semibold text-gray-700 block mb-2">Enter Text</label><textarea placeholder="Enter text to hash..." value={input} onChange={(e) => setInput(e.target.value)} className="calc-input min-h-[100px]" rows={3} /></div>
      <button onClick={generate} className="btn-primary text-sm !py-2 !px-5">Generate Hashes</button>
      {Object.keys(hashes).length > 0 && (
        <div className="space-y-3">{Object.entries(hashes).map(([algo, val]) => (
          <div key={algo} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <div className="flex justify-between mb-1"><div className="text-xs font-semibold text-gray-500">{algo}</div><button onClick={() => navigator.clipboard?.writeText(val)} className="text-xs text-indigo-600 font-medium hover:underline">Copy</button></div>
            <div className="text-xs font-mono text-gray-800 break-all">{val}</div>
          </div>
        ))}</div>
      )}
    </div>
  );
}
