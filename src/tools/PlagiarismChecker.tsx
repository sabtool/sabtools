"use client";
import { useState, useMemo } from "react";

export default function PlagiarismChecker() {
  const [original, setOriginal] = useState("");
  const [toCheck, setToCheck] = useState("");

  const results = useMemo(() => {
    if (!original.trim() || !toCheck.trim()) return null;

    const splitSentences = (text: string) =>
      text
        .split(/(?<=[.!?])\s+/)
        .map((s) => s.trim())
        .filter(Boolean);

    const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim();

    const origSentences = splitSentences(original);
    const checkSentences = splitSentences(toCheck);

    const similarity = (a: string, b: string): number => {
      const wordsA = normalize(a).split(/\s+/);
      const wordsB = normalize(b).split(/\s+/);
      if (wordsA.length === 0 || wordsB.length === 0) return 0;
      const setA = new Set(wordsA);
      const common = wordsB.filter((w) => setA.has(w)).length;
      return common / Math.max(wordsA.length, wordsB.length);
    };

    const checked = checkSentences.map((sentence) => {
      let maxSim = 0;
      let matchedWith = "";
      for (const orig of origSentences) {
        const sim = similarity(sentence, orig);
        if (sim > maxSim) {
          maxSim = sim;
          matchedWith = orig;
        }
      }
      return {
        sentence,
        similarity: maxSim,
        matchedWith,
        isMatch: maxSim >= 0.6,
        isPartial: maxSim >= 0.3 && maxSim < 0.6,
      };
    });

    const matchCount = checked.filter((c) => c.isMatch).length;
    const overallSimilarity =
      checked.length > 0
        ? (checked.reduce((sum, c) => sum + c.similarity, 0) / checked.length) * 100
        : 0;

    return { checked, matchCount, overallSimilarity, total: checked.length };
  }, [original, toCheck]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Original Text</label>
          <textarea
            placeholder="Paste the original text here..."
            value={original}
            onChange={(e) => setOriginal(e.target.value)}
            className="calc-input min-h-[200px] resize-y font-mono text-sm"
            rows={8}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Text to Check</label>
          <textarea
            placeholder="Paste the text to check for plagiarism..."
            value={toCheck}
            onChange={(e) => setToCheck(e.target.value)}
            className="calc-input min-h-[200px] resize-y font-mono text-sm"
            rows={8}
          />
        </div>
      </div>

      {results && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
              <div className="text-xs font-medium text-gray-500">Similarity</div>
              <div className={`text-2xl font-extrabold mt-1 ${results.overallSimilarity > 50 ? "text-red-600" : results.overallSimilarity > 25 ? "text-yellow-600" : "text-green-600"}`}>
                {results.overallSimilarity.toFixed(1)}%
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
              <div className="text-xs font-medium text-gray-500">Matching</div>
              <div className="text-2xl font-extrabold text-red-600 mt-1">{results.matchCount}</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
              <div className="text-xs font-medium text-gray-500">Unique</div>
              <div className="text-2xl font-extrabold text-green-600 mt-1">{results.total - results.matchCount}</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
              <div className="text-xs font-medium text-gray-500">Sentences</div>
              <div className="text-2xl font-extrabold text-indigo-600 mt-1">{results.total}</div>
            </div>
          </div>

          <div className="result-card">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Sentence Analysis</h3>
            <div className="space-y-2">
              {results.checked.map((item, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-lg text-sm ${
                    item.isMatch
                      ? "bg-red-50 border border-red-200 text-red-800"
                      : item.isPartial
                      ? "bg-yellow-50 border border-yellow-200 text-yellow-800"
                      : "bg-green-50 border border-green-200 text-green-800"
                  }`}
                >
                  <div>{item.sentence}</div>
                  <div className="text-xs mt-1 opacity-70">
                    Similarity: {(item.similarity * 100).toFixed(0)}%
                    {item.isMatch && ` — Matches: "${item.matchedWith.slice(0, 60)}..."`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <button onClick={() => { setOriginal(""); setToCheck(""); }} className="btn-secondary text-sm !py-2 !px-4">Clear All</button>
      </div>
    </div>
  );
}
