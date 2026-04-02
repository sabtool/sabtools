"use client";
import { useState } from "react";

const continuationTemplates = {
  natural: [
    "Building on this idea, {keyword} plays a crucial role in shaping how we understand the broader context. The interplay between various factors creates a dynamic that continues to evolve over time.",
    "This naturally leads to a deeper consideration of {keyword} and its many implications. As more evidence comes to light, the connection between these elements becomes increasingly clear.",
    "Following this line of reasoning, {keyword} emerges as a central theme worth exploring further. The relationship between cause and effect in this area is both fascinating and instructive.",
    "Extending this thought, {keyword} reveals patterns that are both consistent and illuminating. When we look at the wider picture, these connections become impossible to ignore.",
    "Taking this further, {keyword} demonstrates a complexity that rewards careful examination. Each new perspective adds depth to our understanding and opens doors to fresh insights.",
  ],
  detail: [
    "Specifically, {keyword} encompasses several important aspects that deserve attention. These include the practical applications, the theoretical underpinnings, and the real-world outcomes that can be observed and measured.",
    "To elaborate, {keyword} can be broken down into distinct components. The first relates to its foundational principles, while the second concerns its practical implementation in everyday scenarios.",
    "In greater detail, {keyword} involves multiple interconnected processes. Research has shown that each of these processes contributes uniquely to the overall outcome, creating a system of remarkable efficiency.",
    "Looking more closely at {keyword}, we find layers of nuance that are often overlooked. The specific mechanisms at work include both direct and indirect influences that shape results in measurable ways.",
    "Drilling deeper into {keyword}, the specifics reveal a rich landscape of detail. From quantitative metrics to qualitative observations, the evidence paints a comprehensive picture of this subject.",
  ],
  conclude: [
    "Ultimately, {keyword} stands as a testament to the importance of thoughtful engagement with this subject. The insights gained from this exploration provide a solid foundation for future inquiry and action.",
    "In summary, {keyword} represents a significant area of consideration that merits ongoing attention. The evidence and reasoning presented here underscore the value of continued exploration and discussion.",
    "All things considered, {keyword} offers valuable lessons and perspectives. As we move forward, the understanding gained here will serve as a guiding framework for future decisions and developments.",
    "To bring this together, {keyword} illustrates the broader themes at play in this discussion. The key takeaways point toward a clear direction for those seeking to engage meaningfully with this topic.",
    "In closing, {keyword} encapsulates the essential ideas explored in this passage. These ideas, taken together, form a cohesive argument that invites both reflection and purposeful action.",
  ],
};

function extractKeywords(text: string): string[] {
  const stopWords = new Set(["the", "a", "an", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "do", "does", "did", "will", "would", "could", "should", "may", "might", "shall", "can", "need", "dare", "ought", "used", "to", "of", "in", "for", "on", "with", "at", "by", "from", "as", "into", "through", "during", "before", "after", "above", "below", "between", "out", "off", "over", "under", "again", "further", "then", "once", "here", "there", "when", "where", "why", "how", "all", "each", "every", "both", "few", "more", "most", "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so", "than", "too", "very", "just", "because", "but", "and", "or", "if", "while", "that", "this", "it", "its", "they", "them", "their", "we", "us", "our", "he", "him", "his", "she", "her", "i", "me", "my", "you", "your"]);
  const words = text.toLowerCase().replace(/[^a-z\s]/g, "").split(/\s+/).filter(w => w.length > 3 && !stopWords.has(w));
  const freq: Record<string, number> = {};
  words.forEach(w => { freq[w] = (freq[w] || 0) + 1; });
  return Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 5).map(e => e[0]);
}

function fillTemplate(template: string, keyword: string): string {
  return template.replace(/\{keyword\}/g, keyword);
}

export default function AiParagraphCompleter() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<{ natural: string; detail: string; conclude: string } | null>(null);
  const [copiedKey, setCopiedKey] = useState("");

  const generate = () => {
    if (!input.trim()) return;
    const keywords = extractKeywords(input);
    const keyword = keywords.length > 0 ? keywords[0] : "this topic";

    const pick = (arr: string[]) => fillTemplate(arr[Math.floor(Math.random() * arr.length)], keyword);

    setResults({
      natural: pick(continuationTemplates.natural),
      detail: pick(continuationTemplates.detail),
      conclude: pick(continuationTemplates.conclude),
    });
  };

  const copy = (text: string, key: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(""), 2000);
  };

  const options = [
    { key: "natural", label: "Continue Naturally", color: "text-blue-600" },
    { key: "detail", label: "Add Detail", color: "text-green-600" },
    { key: "conclude", label: "Conclude Paragraph", color: "text-purple-600" },
  ] as const;

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Your Incomplete Paragraph</label>
        <textarea
          className="calc-input min-h-[150px]"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your incomplete paragraph here. The tool will analyze the topic and generate continuation options..."
        />
        <p className="text-xs text-gray-400 mt-1">{input.split(/\s+/).filter(Boolean).length} words</p>
      </div>
      <button onClick={generate} className="btn-primary">Generate Continuations</button>
      {results && (
        <div className="space-y-4">
          {options.map(({ key, label, color }) => (
            <div key={key} className="result-card space-y-3">
              <div className="flex justify-between items-center">
                <span className={`text-sm font-bold ${color}`}>{label}</span>
                <button onClick={() => copy(results[key], key)} className="btn-secondary text-xs">
                  {copiedKey === key ? "Copied!" : "Copy"}
                </button>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <p className="text-gray-800 leading-relaxed">{results[key]}</p>
              </div>
            </div>
          ))}
          <button onClick={generate} className="btn-secondary w-full">Regenerate All</button>
        </div>
      )}
    </div>
  );
}
