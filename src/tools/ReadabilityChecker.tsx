"use client";
import { useState, useMemo } from "react";

export default function ReadabilityChecker() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const trimmed = text.trim();
    if (!trimmed) return null;

    const words = trimmed.split(/\s+/).filter(Boolean);
    const wordCount = words.length;
    const sentences = trimmed.split(/[.!?]+/).filter((s) => s.trim().length > 0);
    const sentenceCount = sentences.length || 1;
    const syllableCount = words.reduce((sum, word) => {
      const w = word.toLowerCase().replace(/[^a-z]/g, "");
      if (w.length <= 3) return sum + 1;
      let count = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "").match(/[aeiouy]{1,2}/g)?.length || 1;
      if (count === 0) count = 1;
      return sum + count;
    }, 0);

    const avgSentenceLen = wordCount / sentenceCount;
    const avgSyllablesPerWord = syllableCount / (wordCount || 1);
    const avgWordLength = words.reduce((sum, w) => sum + w.replace(/[^a-z]/gi, "").length, 0) / (wordCount || 1);
    const charCount = trimmed.length;

    // Flesch Reading Ease
    const fleschEase = 206.835 - 1.015 * avgSentenceLen - 84.6 * avgSyllablesPerWord;

    // Flesch-Kincaid Grade Level
    const fleschKincaid = 0.39 * avgSentenceLen + 11.8 * avgSyllablesPerWord - 15.59;

    let level = "";
    let color = "";
    if (fleschEase >= 90) { level = "Very Easy — 5th Grade"; color = "text-green-600"; }
    else if (fleschEase >= 80) { level = "Easy — 6th Grade"; color = "text-green-600"; }
    else if (fleschEase >= 70) { level = "Fairly Easy — 7th Grade"; color = "text-teal-600"; }
    else if (fleschEase >= 60) { level = "Standard — 8th-9th Grade"; color = "text-blue-600"; }
    else if (fleschEase >= 50) { level = "Fairly Difficult — 10th-12th Grade"; color = "text-yellow-600"; }
    else if (fleschEase >= 30) { level = "Difficult — College Level"; color = "text-orange-600"; }
    else { level = "Very Difficult — Graduate Level"; color = "text-red-600"; }

    return {
      wordCount,
      sentenceCount,
      charCount,
      syllableCount,
      avgSentenceLen: avgSentenceLen.toFixed(1),
      avgWordLength: avgWordLength.toFixed(1),
      fleschEase: Math.max(0, Math.min(100, fleschEase)).toFixed(1),
      fleschKincaid: Math.max(0, fleschKincaid).toFixed(1),
      level,
      color,
    };
  }, [text]);

  return (
    <div className="space-y-6">
      <textarea
        placeholder="Paste your text here to check readability..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="calc-input min-h-[200px] resize-y font-mono text-sm"
        rows={8}
      />

      {stats && (
        <div className="space-y-4">
          <div className="result-card text-center">
            <div className="text-xs font-medium text-gray-500 mb-1">Flesch Reading Ease</div>
            <div className={`text-4xl font-extrabold ${stats.color}`}>{stats.fleschEase}</div>
            <div className={`text-sm font-semibold mt-1 ${stats.color}`}>{stats.level}</div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "F-K Grade Level", value: stats.fleschKincaid, color: "text-indigo-600" },
              { label: "Words", value: stats.wordCount, color: "text-purple-600" },
              { label: "Sentences", value: stats.sentenceCount, color: "text-blue-600" },
              { label: "Characters", value: stats.charCount, color: "text-teal-600" },
              { label: "Syllables", value: stats.syllableCount, color: "text-orange-600" },
              { label: "Avg Sentence Length", value: stats.avgSentenceLen, color: "text-pink-600" },
              { label: "Avg Word Length", value: stats.avgWordLength, color: "text-green-600" },
            ].map((item) => (
              <div key={item.label} className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
                <div className="text-xs font-medium text-gray-500">{item.label}</div>
                <div className={`text-2xl font-extrabold ${item.color} mt-1`}>{item.value}</div>
              </div>
            ))}
          </div>

          <div className="result-card">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Score Guide</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-gray-600">
              <div>90-100: Very Easy (5th grade)</div>
              <div>80-89: Easy (6th grade)</div>
              <div>70-79: Fairly Easy (7th grade)</div>
              <div>60-69: Standard (8th-9th grade)</div>
              <div>50-59: Fairly Difficult (10th-12th)</div>
              <div>30-49: Difficult (College)</div>
              <div>0-29: Very Difficult (Graduate)</div>
            </div>
          </div>
        </div>
      )}

      {text && (
        <button onClick={() => setText("")} className="btn-secondary text-sm !py-2 !px-4">Clear</button>
      )}
    </div>
  );
}
