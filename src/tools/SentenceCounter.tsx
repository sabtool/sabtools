"use client";
import { useState, useMemo } from "react";

export default function SentenceCounter() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).filter(Boolean) : [];
    const wordCount = words.length;
    const charCount = text.length;
    const charNoSpaces = text.replace(/\s/g, "").length;
    const sentences = trimmed
      ? trimmed.split(/[.!?]+/).filter((s) => s.trim().length > 0)
      : [];
    const sentenceCount = sentences.length;
    const paragraphs = trimmed
      ? trimmed.split(/\n\s*\n/).filter(Boolean)
      : [];
    const paragraphCount = paragraphs.length;
    const avgWordsPerSentence = sentenceCount > 0 ? (wordCount / sentenceCount).toFixed(1) : "0";
    const avgSentenceLength = sentenceCount > 0
      ? (sentences.reduce((sum, s) => sum + s.trim().length, 0) / sentenceCount).toFixed(1)
      : "0";
    const readingTime = Math.ceil(wordCount / 200);
    const speakingTime = Math.ceil(wordCount / 130);

    return {
      sentenceCount,
      wordCount,
      charCount,
      charNoSpaces,
      paragraphCount,
      avgWordsPerSentence,
      avgSentenceLength,
      readingTime,
      speakingTime,
    };
  }, [text]);

  return (
    <div className="space-y-6">
      <textarea
        placeholder="Start typing or paste your text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="calc-input min-h-[200px] resize-y font-mono text-sm"
        rows={8}
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: "Sentences", value: stats.sentenceCount, color: "text-indigo-600" },
          { label: "Words", value: stats.wordCount, color: "text-purple-600" },
          { label: "Characters", value: stats.charCount, color: "text-blue-600" },
          { label: "Chars (no spaces)", value: stats.charNoSpaces, color: "text-teal-600" },
          { label: "Paragraphs", value: stats.paragraphCount, color: "text-orange-600" },
          { label: "Avg Words/Sentence", value: stats.avgWordsPerSentence, color: "text-pink-600" },
          { label: "Avg Sentence Length", value: `${stats.avgSentenceLength} chars`, color: "text-green-600" },
          { label: "Reading Time", value: `${stats.readingTime} min`, color: "text-amber-600" },
          { label: "Speaking Time", value: `${stats.speakingTime} min`, color: "text-red-600" },
        ].map((item) => (
          <div key={item.label} className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
            <div className="text-xs font-medium text-gray-500">{item.label}</div>
            <div className={`text-2xl font-extrabold ${item.color} mt-1`}>{item.value}</div>
          </div>
        ))}
      </div>

      {text && (
        <div className="flex gap-3">
          <button onClick={() => setText("")} className="btn-secondary text-sm !py-2 !px-4">Clear</button>
          <button onClick={() => navigator.clipboard?.writeText(text)} className="btn-primary text-sm !py-2 !px-4">Copy Text</button>
        </div>
      )}
    </div>
  );
}
