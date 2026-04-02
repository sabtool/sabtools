"use client";
import { useState, useMemo } from "react";

type WritingStyle = "Narrative" | "Professional" | "Academic";

const transitions: Record<WritingStyle, string[]> = {
  Narrative: [
    "To begin with", "Following this", "Building on that", "In addition",
    "What's more", "Along with this", "Equally important", "As a result",
    "On top of that", "This leads to", "Not only that, but", "Taking it further",
    "Continuing with this idea", "In the same vein", "Adding to this",
  ],
  Professional: [
    "Furthermore", "Additionally", "Moreover", "In addition to this",
    "Building upon this", "It is also worth noting that", "Equally significant",
    "As a complementary point", "This is further supported by",
    "Another key consideration is", "From a strategic perspective",
    "On a related note", "This aligns with", "Correspondingly",
    "In a similar capacity",
  ],
  Academic: [
    "Furthermore", "Moreover", "Additionally", "In a similar context",
    "Correspondingly", "Concurrently", "Subsequently", "It is pertinent to note that",
    "From an analytical standpoint", "This is corroborated by the observation that",
    "In conjunction with the aforementioned", "Supplementary to this",
    "This finding is further substantiated by", "Equally noteworthy is",
    "A parallel consideration involves",
  ],
};

const closings: Record<WritingStyle, string[]> = {
  Narrative: [
    "In the end", "All in all", "When you put it all together",
    "Looking at the bigger picture", "Bringing it all together",
  ],
  Professional: [
    "In summary", "To conclude", "In light of the above",
    "Taking all factors into account", "As demonstrated above",
  ],
  Academic: [
    "In summation", "To synthesize the foregoing points",
    "In light of the aforementioned considerations",
    "Drawing upon the evidence presented", "As this analysis demonstrates",
  ],
};

function bulletsToParagraph(input: string, style: WritingStyle): string {
  const bullets = input
    .split("\n")
    .map((line) => line.replace(/^[\s\-\*\u2022\d.]+/, "").trim())
    .filter((line) => line.length > 0);

  if (bullets.length === 0) return "";

  const trans = transitions[style];
  const close = closings[style];

  const sentences: string[] = [];

  bullets.forEach((bullet, idx) => {
    let sentence = bullet;
    // Ensure sentence ends with period
    if (!/[.!?]$/.test(sentence)) sentence += ".";
    // Capitalize first letter
    sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1);

    if (idx === 0) {
      sentences.push(sentence);
    } else if (idx === bullets.length - 1 && bullets.length > 2) {
      const c = close[idx % close.length];
      sentences.push(`${c}, ${sentence.charAt(0).toLowerCase()}${sentence.slice(1)}`);
    } else {
      const t = trans[(idx - 1) % trans.length];
      sentences.push(`${t}, ${sentence.charAt(0).toLowerCase()}${sentence.slice(1)}`);
    }
  });

  return sentences.join(" ");
}

export default function AiBulletsToParag() {
  const [input, setInput] = useState("");
  const [style, setStyle] = useState<WritingStyle>("Professional");
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);

  const inputWordCount = useMemo(() => input.trim().split(/\s+/).filter(Boolean).length, [input]);
  const resultWordCount = useMemo(() => result.trim().split(/\s+/).filter(Boolean).length, [result]);

  const generate = () => {
    if (!input.trim()) return;
    setResult(bulletsToParagraph(input, style));
  };

  const copy = () => {
    navigator.clipboard?.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const styles: WritingStyle[] = ["Narrative", "Professional", "Academic"];

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Bullet Points (one per line)</label>
        <textarea
          className="calc-input min-h-[160px]"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={"- First point here\n- Second point here\n- Third point here\n- Fourth point here"}
        />
        <p className="text-xs text-gray-400 mt-1">{inputWordCount} words</p>
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Style</label>
        <div className="flex gap-2 flex-wrap">
          {styles.map((s) => (
            <button key={s} onClick={() => setStyle(s)} className={s === style ? "btn-primary" : "btn-secondary"}>{s}</button>
          ))}
        </div>
      </div>
      <button onClick={generate} className="btn-primary">Convert to Paragraph</button>
      {result && (
        <div className="result-card">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-gray-600">Paragraph ({resultWordCount} words)</span>
            <button onClick={copy} className="text-xs text-indigo-600 font-medium hover:underline">{copied ? "Copied!" : "Copy"}</button>
          </div>
          <p className="text-gray-800 leading-relaxed">{result}</p>
        </div>
      )}
    </div>
  );
}
