"use client";
import { useState, useMemo } from "react";

export default function KeywordDensityChecker() {
  const [text, setText] = useState("");

  const result = useMemo(() => {
    if (!text.trim()) return null;
    const words = text.toLowerCase().replace(/[^\w\s]/g, "").split(/\s+/).filter(Boolean);
    const totalWords = words.length;
    const freq: Record<string, number> = {};
    words.forEach((w) => { freq[w] = (freq[w] || 0) + 1; });
    const sorted = Object.entries(freq).sort(([, a], [, b]) => b - a).slice(0, 20);
    // 2-word phrases
    const phrases: Record<string, number> = {};
    for (let i = 0; i < words.length - 1; i++) { const p = words[i] + " " + words[i + 1]; phrases[p] = (phrases[p] || 0) + 1; }
    const topPhrases = Object.entries(phrases).sort(([, a], [, b]) => b - a).slice(0, 10);
    return { totalWords, sorted, topPhrases };
  }, [text]);

  return (
    <div className="space-y-4">
      <div><label className="text-sm font-semibold text-gray-700 block mb-2">Paste Your Content</label><textarea placeholder="Paste your article or blog post here..." value={text} onChange={(e) => setText(e.target.value)} className="calc-input min-h-[150px]" rows={6} /></div>
      {result && (
        <div className="space-y-4">
          <div className="result-card text-center"><div className="text-sm text-gray-500">Total Words</div><div className="text-3xl font-extrabold text-indigo-600">{result.totalWords}</div></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><h3 className="text-sm font-semibold text-gray-700 mb-3">Top Keywords</h3><div className="table-responsive"><table><thead><tr><th>Keyword</th><th>Count</th><th>Density</th></tr></thead><tbody>{result.sorted.map(([word, count]) => (<tr key={word}><td className="font-mono">{word}</td><td>{count}</td><td className="text-indigo-600 font-bold">{((count / result.totalWords) * 100).toFixed(2)}%</td></tr>))}</tbody></table></div></div>
            <div><h3 className="text-sm font-semibold text-gray-700 mb-3">Top 2-Word Phrases</h3><div className="table-responsive"><table><thead><tr><th>Phrase</th><th>Count</th><th>Density</th></tr></thead><tbody>{result.topPhrases.map(([phrase, count]) => (<tr key={phrase}><td className="font-mono">{phrase}</td><td>{count}</td><td className="text-indigo-600 font-bold">{((count / result.totalWords) * 100).toFixed(2)}%</td></tr>))}</tbody></table></div></div>
          </div>
        </div>
      )}
    </div>
  );
}
