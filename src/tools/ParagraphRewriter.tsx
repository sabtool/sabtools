"use client";
import { useState, useMemo } from "react";

const synonymMap: Record<string, { formal: string; casual: string }> = {
  good: { formal: "excellent", casual: "great" },
  bad: { formal: "inadequate", casual: "awful" },
  big: { formal: "substantial", casual: "huge" },
  small: { formal: "minimal", casual: "tiny" },
  happy: { formal: "pleased", casual: "thrilled" },
  sad: { formal: "disheartened", casual: "bummed" },
  help: { formal: "assist", casual: "give a hand" },
  use: { formal: "utilize", casual: "go with" },
  show: { formal: "demonstrate", casual: "display" },
  get: { formal: "obtain", casual: "grab" },
  make: { formal: "construct", casual: "put together" },
  think: { formal: "consider", casual: "reckon" },
  need: { formal: "require", casual: "gotta have" },
  want: { formal: "desire", casual: "wanna" },
  start: { formal: "commence", casual: "kick off" },
  end: { formal: "conclude", casual: "wrap up" },
  give: { formal: "provide", casual: "hand over" },
  try: { formal: "attempt", casual: "go for" },
  find: { formal: "locate", casual: "spot" },
  buy: { formal: "purchase", casual: "pick up" },
  fast: { formal: "expeditious", casual: "quick" },
  hard: { formal: "challenging", casual: "tough" },
  easy: { formal: "straightforward", casual: "simple" },
  important: { formal: "significant", casual: "key" },
  very: { formal: "exceedingly", casual: "super" },
  also: { formal: "additionally", casual: "plus" },
  but: { formal: "however", casual: "though" },
  because: { formal: "due to the fact that", casual: "since" },
  really: { formal: "genuinely", casual: "totally" },
  many: { formal: "numerous", casual: "tons of" },
  old: { formal: "aged", casual: "ancient" },
  new: { formal: "novel", casual: "fresh" },
  nice: { formal: "pleasant", casual: "cool" },
};

export default function ParagraphRewriter() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState<number | null>(null);

  const versions = useMemo(() => {
    if (!text.trim()) return null;

    const rewrite = (style: "formal" | "casual") => {
      return text.replace(/\b\w+\b/g, (word) => {
        const lower = word.toLowerCase();
        const entry = synonymMap[lower];
        if (entry) {
          const replacement = entry[style];
          if (word[0] === word[0].toUpperCase()) {
            return replacement.charAt(0).toUpperCase() + replacement.slice(1);
          }
          return replacement;
        }
        return word;
      });
    };

    const shorter = text
      .split(/(?<=[.!?])\s+/)
      .filter(Boolean)
      .map((sentence) => {
        const words = sentence.split(/\s+/);
        if (words.length > 10) {
          const fillers = new Set(["very", "really", "actually", "basically", "just", "quite", "simply", "that", "in order to", "the fact that"]);
          return words.filter((w) => !fillers.has(w.toLowerCase().replace(/[^a-z]/g, ""))).join(" ");
        }
        return sentence;
      })
      .join(" ");

    return [
      { label: "Formal Version", text: rewrite("formal"), color: "border-indigo-200 bg-indigo-50" },
      { label: "Casual Version", text: rewrite("casual"), color: "border-orange-200 bg-orange-50" },
      { label: "Shorter Version", text: shorter, color: "border-green-200 bg-green-50" },
    ];
  }, [text]);

  const copy = (i: number, t: string) => {
    navigator.clipboard?.writeText(t);
    setCopied(i);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Original Paragraph</label>
        <textarea
          placeholder="Enter a paragraph to rewrite..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="calc-input min-h-[150px] resize-y font-mono text-sm"
          rows={6}
        />
      </div>

      {versions && (
        <div className="space-y-4">
          {versions.map((v, i) => (
            <div key={i} className={`rounded-xl p-4 border ${v.color}`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-700">{v.label}</h3>
                <button
                  onClick={() => copy(i, v.text)}
                  className="btn-secondary text-xs !py-1 !px-3"
                >
                  {copied === i ? "Copied!" : "Copy"}
                </button>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{v.text}</p>
            </div>
          ))}
        </div>
      )}

      {text && (
        <button onClick={() => setText("")} className="btn-secondary text-sm !py-2 !px-4">Clear</button>
      )}
    </div>
  );
}
