"use client";
import { useState, useMemo } from "react";

export default function WordCounter() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const chars = text.length;
    const charsNoSpace = text.replace(/\s/g, "").length;
    const sentences = trimmed ? (trimmed.match(/[.!?]+/g) || []).length || (trimmed.length > 0 ? 1 : 0) : 0;
    const paragraphs = trimmed ? trimmed.split(/\n\s*\n/).filter(Boolean).length : 0;
    const readingTime = Math.ceil(words / 200);
    const speakingTime = Math.ceil(words / 130);
    return { words, chars, charsNoSpace, sentences, paragraphs, readingTime, speakingTime };
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

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Words", value: stats.words, color: "text-indigo-600" },
          { label: "Characters", value: stats.chars, color: "text-purple-600" },
          { label: "No Spaces", value: stats.charsNoSpace, color: "text-blue-600" },
          { label: "Sentences", value: stats.sentences, color: "text-teal-600" },
          { label: "Paragraphs", value: stats.paragraphs, color: "text-orange-600" },
          { label: "Reading Time", value: `${stats.readingTime} min`, color: "text-pink-600" },
          { label: "Speaking Time", value: `${stats.speakingTime} min`, color: "text-green-600" },
          { label: "Avg Word Length", value: stats.words > 0 ? (stats.charsNoSpace / stats.words).toFixed(1) : "0", color: "text-amber-600" },
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
