"use client";
import { useState, useMemo } from "react";

type SummaryLength = "Short" | "Medium" | "Long";
const lengthMap: Record<SummaryLength, number> = { Short: 3, Medium: 5, Long: 7 };

function splitSentences(text: string): string[] {
  return text.match(/[^.!?]+[.!?]+/g)?.map((s) => s.trim()).filter((s) => s.length > 10) || [];
}

function scoreSentences(sentences: string[]): { sentence: string; score: number }[] {
  const allWords = sentences.join(" ").toLowerCase().split(/\s+/);
  const freq: Record<string, number> = {};
  allWords.forEach((w) => { const clean = w.replace(/[^a-z]/g, ""); if (clean.length > 3) freq[clean] = (freq[clean] || 0) + 1; });

  return sentences.map((sentence, idx) => {
    const words = sentence.toLowerCase().split(/\s+/);
    let wordScore = 0;
    words.forEach((w) => { const clean = w.replace(/[^a-z]/g, ""); wordScore += freq[clean] || 0; });
    wordScore = words.length > 0 ? wordScore / words.length : 0;

    // Position score: first and last sentences are more important
    const posScore = idx === 0 ? 2 : idx === sentences.length - 1 ? 1.5 : idx < 3 ? 1.2 : 1;

    // Length score: medium-length sentences preferred
    const lenScore = words.length >= 8 && words.length <= 25 ? 1.3 : words.length > 25 ? 0.8 : 0.9;

    return { sentence, score: wordScore * posScore * lenScore };
  });
}

export default function AiTextSummarizer() {
  const [text, setText] = useState("");
  const [length, setLength] = useState<SummaryLength>("Medium");
  const [summary, setSummary] = useState("");

  const originalWordCount = useMemo(() => text.trim().split(/\s+/).filter(Boolean).length, [text]);
  const summaryWordCount = useMemo(() => summary.trim().split(/\s+/).filter(Boolean).length, [summary]);
  const reduction = useMemo(() => originalWordCount > 0 ? Math.round((1 - summaryWordCount / originalWordCount) * 100) : 0, [originalWordCount, summaryWordCount]);

  const generate = () => {
    if (!text.trim()) return;
    const sentences = splitSentences(text);
    if (sentences.length === 0) { setSummary(text.trim()); return; }
    const scored = scoreSentences(sentences);
    const topN = lengthMap[length];
    const sorted = [...scored].sort((a, b) => b.score - a.score).slice(0, Math.min(topN, sentences.length));
    // Preserve original order
    const ordered = sorted.sort((a, b) => sentences.indexOf(a.sentence) - sentences.indexOf(b.sentence));
    setSummary(ordered.map((s) => s.sentence).join(" "));
  };

  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard?.writeText(summary); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Paste Your Text</label>
        <textarea className="calc-input min-h-[180px]" value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste a long article, essay, or any text to summarize..." />
        <p className="text-xs text-gray-400 mt-1">{originalWordCount} words</p>
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Summary Length</label>
        <div className="flex gap-2 flex-wrap">
          {(["Short", "Medium", "Long"] as SummaryLength[]).map((l) => (
            <button key={l} onClick={() => setLength(l)} className={l === length ? "btn-primary" : "btn-secondary"}>
              {l} ({lengthMap[l]} sentences)
            </button>
          ))}
        </div>
      </div>
      <button onClick={generate} className="btn-primary">Summarize Text</button>
      {summary && (
        <div className="result-card space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-gray-600">Summary</span>
            <button onClick={copy} className="text-xs text-indigo-600 font-medium hover:underline">{copied ? "Copied!" : "Copy"}</button>
          </div>
          <p className="text-gray-800 leading-relaxed">{summary}</p>
          <div className="flex gap-4 pt-2 border-t border-gray-100">
            <div className="text-center">
              <p className="text-xs text-gray-400">Original</p>
              <p className="text-sm font-bold text-gray-700">{originalWordCount} words</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-400">Summary</p>
              <p className="text-sm font-bold text-gray-700">{summaryWordCount} words</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-400">Reduction</p>
              <p className="text-sm font-bold text-green-600">{reduction}%</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
