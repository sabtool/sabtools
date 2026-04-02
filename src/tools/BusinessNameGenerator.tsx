"use client";
import { useState, useMemo } from "react";

const prefixes: Record<string, string[]> = {
  modern: ["Nova", "Apex", "Flux", "Zen", "Vibe", "Pixel", "Sync", "Swift", "Neo", "Edge"],
  classic: ["Royal", "Crown", "Grand", "Heritage", "Legacy", "Prime", "Elite", "Sterling", "Golden", "Noble"],
  creative: ["Spark", "Bloom", "Dream", "Quirky", "Cosmic", "Fuzzy", "Neon", "Wild", "Stellar", "Whiz"],
};

const suffixes: Record<string, string[]> = {
  modern: ["Labs", "Hub", "Stack", "Works", "Space", "Tech", "Cloud", "Logic", "Verse", "Grid"],
  classic: ["Solutions", "Enterprises", "Industries", "Group", "Associates", "Corp", "Partners", "Services", "Trading", "Ventures"],
  creative: ["Studio", "Factory", "Co", "Collective", "Nest", "Den", "Hive", "Forge", "Box", "Lab"],
};

function generateNames(industry: string, keywords: string, style: "modern" | "classic" | "creative"): string[] {
  const kw = keywords.split(",").map((k) => k.trim()).filter(Boolean);
  const ind = industry.trim();
  const pres = prefixes[style];
  const sufs = suffixes[style];
  const names: Set<string> = new Set();

  for (const pre of pres) {
    for (const suf of sufs) {
      if (names.size >= 20) break;
      names.add(`${pre} ${suf}`);
    }
  }

  const results: string[] = [];
  const nameArr = Array.from(names);

  for (let i = 0; i < Math.min(20, nameArr.length); i++) {
    results.push(nameArr[i]);
  }

  if (kw.length > 0) {
    const kwUpper = kw.map((k) => k.charAt(0).toUpperCase() + k.slice(1));
    for (let i = 0; i < Math.min(5, results.length); i++) {
      const parts = results[i].split(" ");
      results[i] = `${kwUpper[i % kwUpper.length]} ${parts[1] || parts[0]}`;
    }
  }

  if (ind) {
    const indWord = ind.charAt(0).toUpperCase() + ind.slice(1);
    for (let i = 5; i < Math.min(10, results.length); i++) {
      const parts = results[i].split(" ");
      results[i] = `${parts[0]} ${indWord}`;
    }
  }

  return results.slice(0, 20);
}

export default function BusinessNameGenerator() {
  const [industry, setIndustry] = useState("");
  const [keywords, setKeywords] = useState("");
  const [style, setStyle] = useState<"modern" | "classic" | "creative">("modern");
  const [copied, setCopied] = useState<number | null>(null);

  const names = useMemo(() => {
    if (!industry.trim() && !keywords.trim()) return [];
    return generateNames(industry, keywords, style);
  }, [industry, keywords, style]);

  const copyName = (name: string, idx: number) => {
    navigator.clipboard.writeText(name);
    setCopied(idx);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Industry</label>
          <input type="text" value={industry} onChange={(e) => setIndustry(e.target.value)} className="calc-input" placeholder="e.g. Technology, Food, Fashion" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Keywords (comma-separated)</label>
          <input type="text" value={keywords} onChange={(e) => setKeywords(e.target.value)} className="calc-input" placeholder="e.g. fast, smart, green" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Style</label>
          <div className="flex gap-2 flex-wrap">
            {(["modern", "classic", "creative"] as const).map((s) => (
              <button key={s} onClick={() => setStyle(s)} className={style === s ? "btn-primary" : "btn-secondary"}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {names.length > 0 && (
        <div className="result-card space-y-3">
          <h3 className="text-lg font-bold text-gray-800">Business Name Ideas (20)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {names.map((name, i) => (
              <div key={i} className="bg-white rounded-xl p-3 shadow-sm flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">{name}</span>
                <button onClick={() => copyName(name, i)} className="btn-secondary text-xs">
                  {copied === i ? "Copied!" : "Copy"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
