"use client";
import { useState, useMemo } from "react";

export default function AverageCalculator() {
  const [input, setInput] = useState("");

  const result = useMemo(() => {
    const nums = input.split(/[,\s\n]+/).map(Number).filter((n) => !isNaN(n));
    if (nums.length === 0) return null;
    const sum = nums.reduce((a, b) => a + b, 0);
    const mean = sum / nums.length;
    const sorted = [...nums].sort((a, b) => a - b);
    const median = nums.length % 2 === 0 ? (sorted[nums.length / 2 - 1] + sorted[nums.length / 2]) / 2 : sorted[Math.floor(nums.length / 2)];
    const freq: Record<number, number> = {};
    nums.forEach((n) => { freq[n] = (freq[n] || 0) + 1; });
    const maxFreq = Math.max(...Object.values(freq));
    const modes = Object.entries(freq).filter(([, v]) => v === maxFreq).map(([k]) => +k);
    const range = sorted[sorted.length - 1] - sorted[0];
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    return { mean, median, modes, range, sum, count: nums.length, min, max };
  }, [input]);

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Enter Numbers (comma or space separated)</label>
        <textarea placeholder="e.g. 10, 20, 30, 40, 50" value={input} onChange={(e) => setInput(e.target.value)} className="calc-input min-h-[100px]" rows={3} />
      </div>
      {result && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Mean (Average)", value: result.mean.toFixed(2), color: "text-indigo-600" },
            { label: "Median", value: result.median.toFixed(2), color: "text-purple-600" },
            { label: "Mode", value: result.modes.join(", "), color: "text-pink-600" },
            { label: "Range", value: result.range.toFixed(2), color: "text-teal-600" },
            { label: "Sum", value: result.sum.toFixed(2), color: "text-blue-600" },
            { label: "Count", value: String(result.count), color: "text-orange-600" },
            { label: "Min", value: String(result.min), color: "text-green-600" },
            { label: "Max", value: String(result.max), color: "text-red-600" },
          ].map((item) => (
            <div key={item.label} className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
              <div className="text-xs font-medium text-gray-500">{item.label}</div>
              <div className={`text-xl font-extrabold ${item.color} mt-1`}>{item.value}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
