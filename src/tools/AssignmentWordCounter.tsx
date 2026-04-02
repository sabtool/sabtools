"use client";
import { useState, useMemo } from "react";

export default function AssignmentWordCounter() {
  const [text, setText] = useState("");
  const [targetWords, setTargetWords] = useState(500);

  const stats = useMemo(() => {
    if (!text.trim()) {
      return { words: 0, chars: 0, charsNoSpace: 0, sentences: 0, paragraphs: 0, uniqueWords: 0, handwrittenSingle: 0, handwrittenDouble: 0, readingTime: "0 min", speakingTime: "0 min" };
    }
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const chars = text.length;
    const charsNoSpace = text.replace(/\s/g, "").length;
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim()).length;
    const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim()).length || (text.trim() ? 1 : 0);

    const wordList = text.toLowerCase().match(/\b[a-zA-Z\u0900-\u097F]+\b/g) || [];
    const uniqueWords = new Set(wordList).size;

    const handwrittenSingle = Math.ceil(words / 250);
    const handwrittenDouble = Math.ceil(words / 200);

    const readMinutes = Math.ceil(words / 200);
    const speakMinutes = Math.ceil(words / 130);

    return {
      words,
      chars,
      charsNoSpace,
      sentences,
      paragraphs,
      uniqueWords,
      handwrittenSingle,
      handwrittenDouble,
      readingTime: readMinutes < 1 ? "< 1 min" : `${readMinutes} min`,
      speakingTime: speakMinutes < 1 ? "< 1 min" : `${speakMinutes} min`,
    };
  }, [text]);

  const progressPct = targetWords > 0 ? Math.min((stats.words / targetWords) * 100, 100) : 0;
  const progressColor = stats.words >= targetWords ? "bg-green-500" : stats.words >= targetWords * 0.75 ? "bg-yellow-400" : "bg-indigo-500";

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-1">Paste Your Assignment Text</label>
        <textarea
          className="calc-input min-h-[180px]"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type your assignment text here..."
        />
      </div>

      {/* Target Word Count */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">Target Word Count</label>
          <input className="calc-input" type="number" min={0} value={targetWords} onChange={(e) => setTargetWords(+e.target.value)} />
        </div>
        <div className="flex flex-col justify-end">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-500">{stats.words} / {targetWords} words</span>
            <span className={stats.words >= targetWords ? "text-green-600 font-bold" : "text-gray-500"}>{progressPct.toFixed(0)}%</span>
          </div>
          <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
            <div className={`h-full ${progressColor} rounded-full transition-all`} style={{ width: `${progressPct}%` }} />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="result-card">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-extrabold text-indigo-600">{stats.words}</div>
            <div className="text-xs text-gray-500">Words</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-extrabold text-gray-800">{stats.chars}</div>
            <div className="text-xs text-gray-500">Characters</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-extrabold text-gray-800">{stats.charsNoSpace}</div>
            <div className="text-xs text-gray-500">Chars (no space)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-extrabold text-gray-800">{stats.sentences}</div>
            <div className="text-xs text-gray-500">Sentences</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-extrabold text-gray-800">{stats.paragraphs}</div>
            <div className="text-xs text-gray-500">Paragraphs</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-extrabold text-teal-600">{stats.uniqueWords}</div>
            <div className="text-xs text-gray-500">Unique Words</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-extrabold text-purple-600">{stats.readingTime}</div>
            <div className="text-xs text-gray-500">Reading Time</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-extrabold text-orange-500">{stats.speakingTime}</div>
            <div className="text-xs text-gray-500">Speaking Time</div>
          </div>
        </div>
      </div>

      {/* Handwritten Estimate */}
      <div className="result-card">
        <div className="text-sm font-semibold text-gray-700 mb-3">Handwritten Page Estimate</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-2xl font-extrabold text-indigo-600">{stats.handwrittenSingle}</div>
            <div className="text-xs text-gray-500">Single-line spacing (250 words/page)</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-2xl font-extrabold text-purple-600">{stats.handwrittenDouble}</div>
            <div className="text-xs text-gray-500">Double-line spacing (200 words/page)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
