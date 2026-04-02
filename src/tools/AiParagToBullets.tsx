"use client";
import { useState, useMemo } from "react";

type BulletStyle = "Brief" | "Detailed" | "Action-oriented";

const actionVerbs = [
  "Ensure", "Implement", "Establish", "Develop", "Maintain", "Optimize",
  "Leverage", "Enhance", "Streamline", "Facilitate", "Address", "Achieve",
  "Execute", "Monitor", "Evaluate", "Prioritize",
];

function paragraphToBullets(text: string, style: BulletStyle): string[] {
  // Split into sentences
  const sentences = text
    .replace(/([.!?])\s+/g, "$1|||")
    .split("|||")
    .map((s) => s.trim())
    .filter((s) => s.length > 5);

  if (sentences.length === 0) return [];

  switch (style) {
    case "Brief":
      return sentences.map((sentence) => {
        // Extract key phrase - get the main clause
        let brief = sentence.replace(/[.!?]+$/, "").trim();
        // Remove leading conjunctions/transitions
        brief = brief.replace(/^(However|Moreover|Furthermore|Additionally|In addition|Also|Therefore|Thus|Hence|Consequently|Nevertheless|Meanwhile|Subsequently|In fact|Indeed|Specifically|Particularly|Notably|Importantly),?\s*/i, "").trim();
        // Shorten long sentences to key phrase
        const commaIdx = brief.indexOf(",");
        if (brief.length > 80 && commaIdx > 10 && commaIdx < brief.length - 10) {
          brief = brief.slice(0, commaIdx);
        }
        // Further shorten if still too long
        const words = brief.split(/\s+/);
        if (words.length > 12) {
          brief = words.slice(0, 10).join(" ") + "...";
        }
        return brief;
      });

    case "Detailed":
      return sentences.map((sentence) => {
        let detailed = sentence.replace(/[.!?]+$/, "").trim();
        detailed = detailed.replace(/^(However|Moreover|Furthermore|Additionally|In addition|Also|Therefore|Thus|Hence|Consequently|Nevertheless),?\s*/i, "").trim();
        // Capitalize first letter
        return detailed.charAt(0).toUpperCase() + detailed.slice(1);
      });

    case "Action-oriented":
      return sentences.map((sentence, idx) => {
        let clean = sentence.replace(/[.!?]+$/, "").trim();
        clean = clean.replace(/^(However|Moreover|Furthermore|Additionally|In addition|Also|Therefore|Thus|Hence|Consequently|Nevertheless),?\s*/i, "").trim();
        // Check if already starts with an action verb
        const firstWord = clean.split(/\s+/)[0];
        const isAction = actionVerbs.some((v) => firstWord.toLowerCase() === v.toLowerCase());
        if (isAction) {
          return clean.charAt(0).toUpperCase() + clean.slice(1);
        }
        // Add action verb
        const verb = actionVerbs[idx % actionVerbs.length];
        // Remove subject pronouns for action style
        clean = clean
          .replace(/^(It is |This is |There is |There are |We |They |You |I |The company |The team |The system )/i, "")
          .replace(/^(important to |necessary to |essential to |crucial to )/i, "");
        return `${verb} ${clean.charAt(0).toLowerCase()}${clean.slice(1)}`;
      });

    default:
      return sentences;
  }
}

export default function AiParagToBullets() {
  const [input, setInput] = useState("");
  const [style, setStyle] = useState<BulletStyle>("Brief");
  const [results, setResults] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [copyFormat, setCopyFormat] = useState<"plain" | "markdown">("plain");

  const wordCount = useMemo(() => input.trim().split(/\s+/).filter(Boolean).length, [input]);

  const generate = () => {
    if (!input.trim()) return;
    setResults(paragraphToBullets(input, style));
  };

  const copyText = (format: "plain" | "markdown") => {
    const text = format === "markdown"
      ? results.map((r) => `- ${r}`).join("\n")
      : results.map((r) => `${r}`).join("\n");
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setCopyFormat(format);
    setTimeout(() => setCopied(false), 2000);
  };

  const styles: BulletStyle[] = ["Brief", "Detailed", "Action-oriented"];

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Paragraph</label>
        <textarea className="calc-input min-h-[160px]" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Paste your paragraph here..." />
        <p className="text-xs text-gray-400 mt-1">{wordCount} words</p>
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Bullet Style</label>
        <div className="flex gap-2 flex-wrap">
          {styles.map((s) => (
            <button key={s} onClick={() => setStyle(s)} className={s === style ? "btn-primary" : "btn-secondary"}>{s}</button>
          ))}
        </div>
      </div>
      <button onClick={generate} className="btn-primary">Extract Bullet Points</button>
      {results.length > 0 && (
        <div className="result-card">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-bold text-gray-600">{results.length} Bullet Points ({style})</span>
            <div className="flex gap-2">
              <button onClick={() => copyText("plain")} className="text-xs text-indigo-600 font-medium hover:underline">
                {copied && copyFormat === "plain" ? "Copied!" : "Copy Plain"}
              </button>
              <button onClick={() => copyText("markdown")} className="text-xs text-indigo-600 font-medium hover:underline">
                {copied && copyFormat === "markdown" ? "Copied!" : "Copy Markdown"}
              </button>
            </div>
          </div>
          <ul className="space-y-2">
            {results.map((bullet, i) => (
              <li key={i} className="flex gap-2 text-gray-800 leading-relaxed">
                <span className="text-indigo-500 font-bold shrink-0">&bull;</span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
