"use client";
import { useState } from "react";

export default function RandomNumberGenerator() {
  const [min, setMin] = useState("1");
  const [max, setMax] = useState("100");
  const [count, setCount] = useState("1");
  const [unique, setUnique] = useState(false);
  const [results, setResults] = useState<number[]>([]);

  const generate = () => {
    const lo = parseInt(min), hi = parseInt(max), cnt = parseInt(count);
    if (isNaN(lo) || isNaN(hi) || isNaN(cnt) || lo >= hi || cnt <= 0) return;
    if (unique && cnt > hi - lo + 1) return;
    const nums: number[] = [];
    if (unique) {
      const pool = Array.from({ length: hi - lo + 1 }, (_, i) => i + lo);
      for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[pool[i], pool[j]] = [pool[j], pool[i]]; }
      nums.push(...pool.slice(0, cnt));
    } else {
      for (let i = 0; i < cnt; i++) nums.push(Math.floor(Math.random() * (hi - lo + 1)) + lo);
    }
    setResults(nums);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div><label className="text-sm font-semibold text-gray-700 block mb-2">Min</label><input type="number" value={min} onChange={(e) => setMin(e.target.value)} className="calc-input" /></div>
        <div><label className="text-sm font-semibold text-gray-700 block mb-2">Max</label><input type="number" value={max} onChange={(e) => setMax(e.target.value)} className="calc-input" /></div>
        <div><label className="text-sm font-semibold text-gray-700 block mb-2">Count</label><input type="number" value={count} onChange={(e) => setCount(e.target.value)} className="calc-input" /></div>
      </div>
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={unique} onChange={(e) => setUnique(e.target.checked)} className="w-4 h-4 rounded" />
          <span className="text-sm text-gray-700">Unique numbers only</span>
        </label>
      </div>
      <button onClick={generate} className="btn-primary">Generate</button>
      {results.length > 0 && (
        <div className="result-card">
          <div className="flex flex-wrap gap-3 justify-center">
            {results.map((n, i) => (
              <div key={i} className="bg-white rounded-xl px-5 py-3 shadow-sm text-xl font-extrabold text-indigo-600 border border-indigo-100">{n}</div>
            ))}
          </div>
          <div className="text-center mt-4">
            <button onClick={() => navigator.clipboard?.writeText(results.join(", "))} className="text-xs text-indigo-600 font-medium hover:underline">Copy All</button>
          </div>
        </div>
      )}
    </div>
  );
}
