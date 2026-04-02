"use client";
import { useState, useMemo } from "react";

export default function StatisticsCalculator() {
  const [input, setInput] = useState("");

  const result = useMemo(() => {
    const nums = input
      .split(/[,\s]+/)
      .map((s) => parseFloat(s.trim()))
      .filter((n) => !isNaN(n));
    if (nums.length === 0) return null;

    const sorted = [...nums].sort((a, b) => a - b);
    const n = nums.length;
    const sum = nums.reduce((a, b) => a + b, 0);
    const mean = sum / n;
    const median = n % 2 === 1 ? sorted[Math.floor(n / 2)] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2;

    // Mode
    const freq: Record<number, number> = {};
    nums.forEach((v) => { freq[v] = (freq[v] || 0) + 1; });
    const maxFreq = Math.max(...Object.values(freq));
    const modes = Object.entries(freq)
      .filter(([, f]) => f === maxFreq && f > 1)
      .map(([v]) => parseFloat(v));

    const min = sorted[0];
    const max = sorted[n - 1];
    const range = max - min;

    const variance = nums.reduce((acc, v) => acc + (v - mean) ** 2, 0) / n;
    const stdDev = Math.sqrt(variance);
    const sampleVariance = n > 1 ? nums.reduce((acc, v) => acc + (v - mean) ** 2, 0) / (n - 1) : 0;
    const sampleStdDev = Math.sqrt(sampleVariance);

    // Quartiles
    const q1Idx = (n - 1) * 0.25;
    const q3Idx = (n - 1) * 0.75;
    const q1 = sorted[Math.floor(q1Idx)] + (q1Idx % 1) * (sorted[Math.ceil(q1Idx)] - sorted[Math.floor(q1Idx)]);
    const q3 = sorted[Math.floor(q3Idx)] + (q3Idx % 1) * (sorted[Math.ceil(q3Idx)] - sorted[Math.floor(q3Idx)]);
    const iqr = q3 - q1;

    // Frequency table
    const freqTable = Object.entries(freq).sort(([a], [b]) => parseFloat(a) - parseFloat(b)).map(([v, f]) => ({
      value: parseFloat(v),
      frequency: f,
      relativeFreq: f / n,
    }));

    return { sorted, n, sum, mean, median, modes, min, max, range, variance, stdDev, sampleVariance, sampleStdDev, q1, q3, iqr, freqTable };
  }, [input]);

  const StatRow = ({ label, value }: { label: string; value: string | number }) => (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="text-sm font-bold text-indigo-600 font-mono">{typeof value === "number" ? parseFloat(value.toFixed(6)).toString() : value}</span>
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
        <h3 className="text-sm font-bold text-gray-700 mb-3">Enter Data Set</h3>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter numbers separated by commas or spaces, e.g. 5, 10, 15, 20, 25"
          rows={3}
          className="calc-input w-full"
        />
      </div>

      {result && (
        <>
          <div className="result-card">
            <h3 className="text-sm font-bold text-gray-700 mb-3">Results ({result.n} values)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
              <div>
                <StatRow label="Count" value={result.n} />
                <StatRow label="Sum" value={result.sum} />
                <StatRow label="Mean (Average)" value={result.mean} />
                <StatRow label="Median" value={result.median} />
                <StatRow label="Mode" value={result.modes.length > 0 ? result.modes.join(", ") : "No mode"} />
                <StatRow label="Min" value={result.min} />
                <StatRow label="Max" value={result.max} />
              </div>
              <div>
                <StatRow label="Range" value={result.range} />
                <StatRow label="Variance (Population)" value={result.variance} />
                <StatRow label="Std Deviation (Population)" value={result.stdDev} />
                <StatRow label="Variance (Sample)" value={result.sampleVariance} />
                <StatRow label="Std Deviation (Sample)" value={result.sampleStdDev} />
                <StatRow label="Q1 (25th percentile)" value={result.q1} />
                <StatRow label="Q3 (75th percentile)" value={result.q3} />
                <StatRow label="IQR (Q3 - Q1)" value={result.iqr} />
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
            <h3 className="text-sm font-bold text-gray-700 mb-3">Sorted Data</h3>
            <div className="flex flex-wrap gap-1">
              {result.sorted.map((v, i) => (
                <span key={i} className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-xs font-mono">{v}</span>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
            <h3 className="text-sm font-bold text-gray-700 mb-3">Frequency Table</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-3 text-gray-600">Value</th>
                    <th className="text-left py-2 px-3 text-gray-600">Frequency</th>
                    <th className="text-left py-2 px-3 text-gray-600">Relative Freq</th>
                    <th className="text-left py-2 px-3 text-gray-600">Bar</th>
                  </tr>
                </thead>
                <tbody>
                  {result.freqTable.map((row) => (
                    <tr key={row.value} className="border-b border-gray-50">
                      <td className="py-1 px-3 font-mono">{row.value}</td>
                      <td className="py-1 px-3 font-mono">{row.frequency}</td>
                      <td className="py-1 px-3 font-mono">{(row.relativeFreq * 100).toFixed(1)}%</td>
                      <td className="py-1 px-3">
                        <div className="bg-indigo-200 rounded h-4" style={{ width: `${row.relativeFreq * 100}%`, minWidth: "4px" }} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
