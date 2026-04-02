"use client";
import { useState, useMemo } from "react";

const synonymMap: Record<string, string[]> = {
  "good": ["excellent", "outstanding", "remarkable", "superb", "exceptional"],
  "bad": ["poor", "inadequate", "subpar", "unsatisfactory", "inferior"],
  "big": ["large", "substantial", "considerable", "significant", "immense"],
  "small": ["tiny", "modest", "compact", "minimal", "minute"],
  "important": ["crucial", "vital", "essential", "significant", "paramount"],
  "help": ["assist", "support", "aid", "facilitate", "enable"],
  "make": ["create", "produce", "develop", "generate", "construct"],
  "use": ["utilize", "employ", "leverage", "apply", "implement"],
  "show": ["demonstrate", "illustrate", "reveal", "display", "exhibit"],
  "get": ["obtain", "acquire", "achieve", "secure", "attain"],
  "give": ["provide", "offer", "deliver", "supply", "present"],
  "think": ["believe", "consider", "contemplate", "reflect", "ponder"],
  "need": ["require", "demand", "necessitate", "call for", "warrant"],
  "find": ["discover", "identify", "locate", "uncover", "determine"],
  "know": ["understand", "recognize", "comprehend", "acknowledge", "realize"],
  "want": ["desire", "wish", "aspire", "seek", "aim"],
  "start": ["begin", "commence", "initiate", "launch", "embark on"],
  "end": ["conclude", "finish", "complete", "terminate", "wrap up"],
  "change": ["transform", "modify", "alter", "adjust", "revise"],
  "improve": ["enhance", "boost", "elevate", "refine", "optimize"],
  "increase": ["expand", "grow", "amplify", "escalate", "augment"],
  "decrease": ["reduce", "diminish", "lessen", "lower", "curtail"],
  "problem": ["issue", "challenge", "obstacle", "difficulty", "concern"],
  "solution": ["resolution", "remedy", "answer", "approach", "fix"],
  "result": ["outcome", "consequence", "effect", "impact", "product"],
  "part": ["component", "element", "aspect", "segment", "portion"],
  "way": ["method", "approach", "technique", "strategy", "manner"],
  "work": ["function", "operate", "perform", "execute", "labor"],
  "very": ["extremely", "remarkably", "exceptionally", "incredibly", "profoundly"],
  "many": ["numerous", "several", "countless", "multiple", "various"],
  "fast": ["rapid", "swift", "quick", "speedy", "prompt"],
  "new": ["novel", "fresh", "innovative", "modern", "recent"],
  "old": ["aged", "established", "longstanding", "traditional", "vintage"],
  "easy": ["simple", "straightforward", "effortless", "uncomplicated", "seamless"],
  "hard": ["difficult", "challenging", "demanding", "complex", "arduous"],
  "different": ["distinct", "diverse", "varied", "unique", "alternative"],
  "same": ["identical", "equivalent", "similar", "matching", "comparable"],
  "people": ["individuals", "persons", "professionals", "stakeholders", "community"],
  "world": ["globe", "society", "landscape", "domain", "sphere"],
  "place": ["location", "setting", "area", "venue", "site"],
  "thing": ["item", "object", "element", "entity", "matter"],
  "about": ["regarding", "concerning", "relating to", "with respect to", "pertaining to"],
  "also": ["additionally", "furthermore", "moreover", "likewise", "as well"],
  "however": ["nevertheless", "nonetheless", "yet", "still", "conversely"],
  "because": ["since", "as", "due to the fact that", "given that", "owing to"],
  "although": ["though", "even though", "while", "despite the fact that", "notwithstanding"],
  "therefore": ["consequently", "thus", "hence", "accordingly", "as a result"],
  "usually": ["typically", "generally", "commonly", "ordinarily", "frequently"],
  "always": ["consistently", "invariably", "perpetually", "unfailingly", "without exception"],
  "never": ["at no time", "under no circumstances", "not once", "in no way", "by no means"],
};

type Tone = "Formal" | "Casual" | "Concise";

function replaceSynonyms(text: string, seed: number): string {
  let result = text;
  const words = Object.keys(synonymMap);
  words.forEach((word, i) => {
    const regex = new RegExp(`\\b${word}\\b`, "gi");
    const synIndex = (seed + i) % synonymMap[word].length;
    result = result.replace(regex, synonymMap[word][synIndex]);
  });
  return result;
}

function swapClauses(sentence: string): string {
  const commaIdx = sentence.indexOf(",");
  if (commaIdx > 10 && commaIdx < sentence.length - 10) {
    const before = sentence.slice(0, commaIdx).trim();
    const after = sentence.slice(commaIdx + 1).trim();
    const capAfter = after.charAt(0).toUpperCase() + after.slice(1);
    const lowerBefore = before.charAt(0).toLowerCase() + before.slice(1);
    return `${capAfter}, ${lowerBefore}.`;
  }
  return sentence;
}

function rewriteFormal(text: string): string {
  let r = replaceSynonyms(text, 0);
  const sentences = r.match(/[^.!?]+[.!?]+/g) || [r];
  return sentences.map((s) => {
    let t = s.trim();
    t = t.replace(/\bdon't\b/gi, "do not").replace(/\bcan't\b/gi, "cannot")
      .replace(/\bwon't\b/gi, "will not").replace(/\bisn't\b/gi, "is not")
      .replace(/\baren't\b/gi, "are not").replace(/\bI'm\b/g, "I am")
      .replace(/\bthey're\b/gi, "they are").replace(/\bwe're\b/gi, "we are")
      .replace(/\bit's\b/gi, "it is").replace(/\bdidn't\b/gi, "did not");
    return t;
  }).join(" ");
}

function rewriteCasual(text: string): string {
  let r = replaceSynonyms(text, 2);
  const sentences = r.match(/[^.!?]+[.!?]+/g) || [r];
  return sentences.map((s) => {
    let t = s.trim();
    t = t.replace(/\bdo not\b/gi, "don't").replace(/\bcannot\b/gi, "can't")
      .replace(/\bwill not\b/gi, "won't").replace(/\bIt is\b/g, "It's")
      .replace(/\bthey are\b/gi, "they're").replace(/\bwe are\b/gi, "we're");
    return t;
  }).join(" ");
}

function rewriteConcise(text: string): string {
  let r = replaceSynonyms(text, 4);
  const fillers = ["actually", "basically", "really", "just", "quite", "rather", "simply", "very much", "in order to", "the fact that", "it should be noted that", "as a matter of fact"];
  fillers.forEach((f) => {
    r = r.replace(new RegExp(`\\b${f}\\b`, "gi"), "");
  });
  r = r.replace(/\s{2,}/g, " ").trim();
  const sentences = r.match(/[^.!?]+[.!?]+/g) || [r];
  return sentences.map((s) => swapClauses(s.trim())).join(" ");
}

export default function AiParagraphRewriter() {
  const [text, setText] = useState("");
  const [tone, setTone] = useState<Tone>("Formal");
  const [results, setResults] = useState<string[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const generate = () => {
    if (!text.trim()) return;
    const versions: string[] = [];
    if (tone === "Formal") {
      versions.push(rewriteFormal(text));
      versions.push(rewriteFormal(swapClauses(text)));
      versions.push(replaceSynonyms(text, 1).replace(/\bdon't\b/gi, "do not").replace(/\bcan't\b/gi, "cannot"));
    } else if (tone === "Casual") {
      versions.push(rewriteCasual(text));
      versions.push(rewriteCasual(swapClauses(text)));
      versions.push(replaceSynonyms(text, 3));
    } else {
      versions.push(rewriteConcise(text));
      versions.push(rewriteConcise(swapClauses(text)));
      const short = replaceSynonyms(text, 5);
      const sentences = short.match(/[^.!?]+[.!?]+/g) || [short];
      versions.push(sentences.slice(0, Math.max(2, Math.ceil(sentences.length * 0.6))).join(" "));
    }
    setResults(versions);
  };

  const copy = (idx: number) => {
    navigator.clipboard?.writeText(results[idx]);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const wordCount = useMemo(() => text.trim().split(/\s+/).filter(Boolean).length, [text]);

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Original Paragraph</label>
        <textarea className="calc-input min-h-[140px]" value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste your paragraph here..." />
        <p className="text-xs text-gray-400 mt-1">{wordCount} words</p>
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Tone</label>
        <div className="flex gap-2 flex-wrap">
          {(["Formal", "Casual", "Concise"] as Tone[]).map((t) => (
            <button key={t} onClick={() => setTone(t)} className={t === tone ? "btn-primary" : "btn-secondary"}>{t}</button>
          ))}
        </div>
      </div>
      <button onClick={generate} className="btn-primary">Rewrite Paragraph</button>
      {results.length > 0 && (
        <div className="space-y-4">
          {results.map((r, i) => (
            <div key={i} className="result-card">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-gray-600">Version {i + 1}</span>
                <button onClick={() => copy(i)} className="text-xs text-indigo-600 font-medium hover:underline">{copiedIdx === i ? "Copied!" : "Copy"}</button>
              </div>
              <p className="text-gray-800 leading-relaxed">{r}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
