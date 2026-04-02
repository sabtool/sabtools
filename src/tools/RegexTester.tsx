"use client";
import { useState, useMemo } from "react";

export default function RegexTester() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [text, setText] = useState("");

  const result = useMemo(() => {
    if (!pattern || !text) return null;
    try {
      const regex = new RegExp(pattern, flags);
      const matches = [...text.matchAll(regex)];
      return { matches, error: null };
    } catch (e: unknown) {
      return { matches: [], error: (e as Error).message };
    }
  }, [pattern, flags, text]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="sm:col-span-3"><label className="text-sm font-semibold text-gray-700 block mb-2">Regex Pattern</label><input type="text" placeholder="e.g. \d+" value={pattern} onChange={(e) => setPattern(e.target.value)} className="calc-input font-mono" /></div>
        <div><label className="text-sm font-semibold text-gray-700 block mb-2">Flags</label><input type="text" placeholder="g, i, m" value={flags} onChange={(e) => setFlags(e.target.value)} className="calc-input font-mono" /></div>
      </div>
      <div><label className="text-sm font-semibold text-gray-700 block mb-2">Test String</label><textarea placeholder="Enter text to test against..." value={text} onChange={(e) => setText(e.target.value)} className="calc-input min-h-[120px] font-mono text-sm" rows={4} /></div>
      {result?.error && <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600">{result.error}</div>}
      {result && !result.error && (
        <div className="result-card">
          <div className="text-sm font-semibold text-gray-700 mb-3">{result.matches.length} match(es) found</div>
          {result.matches.length > 0 && (
            <div className="space-y-2">{result.matches.map((m, i) => (
              <div key={i} className="bg-white rounded-lg p-3 border border-gray-100 font-mono text-sm">
                <span className="text-xs text-gray-400">Match {i + 1} (index {m.index}):</span> <span className="text-indigo-600 font-bold">{m[0]}</span>
                {m.length > 1 && <div className="text-xs text-gray-500 mt-1">Groups: {m.slice(1).join(", ")}</div>}
              </div>
            ))}</div>
          )}
        </div>
      )}
    </div>
  );
}
