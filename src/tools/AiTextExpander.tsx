"use client";
import { useState, useMemo } from "react";

type ExpansionLevel = "+50%" | "+100%" | "+200%";

const adjectives = [
  "remarkable", "significant", "notable", "considerable", "substantial",
  "meaningful", "impressive", "comprehensive", "essential", "valuable",
  "important", "critical", "fundamental", "practical", "effective",
];

const elaborations: Record<string, string[]> = {
  "good": ["which demonstrates excellent quality and reliability", "showcasing outstanding performance"],
  "bad": ["which presents notable challenges and areas for improvement", "highlighting concerns that need attention"],
  "important": ["a factor that plays a crucial role in determining outcomes", "an essential consideration that significantly impacts results"],
  "help": ["providing valuable assistance and meaningful support", "offering practical guidance and resources"],
  "improve": ["enhancing performance and delivering measurable progress", "driving positive change and continuous advancement"],
  "work": ["dedicated effort and focused collaboration toward objectives", "systematic execution of tasks and responsibilities"],
  "need": ["a fundamental requirement that must be addressed for success", "an essential necessity that demands attention"],
  "change": ["a transformative shift that brings about meaningful evolution", "a significant transition toward improved outcomes"],
  "use": ["practical application and strategic implementation", "effective utilization of available resources"],
  "make": ["creating and developing with intention and purpose", "producing results through careful effort"],
  "plan": ["a comprehensive strategy with clearly defined objectives", "a well-structured roadmap for achieving goals"],
  "issue": ["a matter requiring careful analysis and resolution", "a concern that warrants thorough examination"],
  "result": ["a measurable outcome that reflects the effectiveness of efforts", "a tangible achievement demonstrating progress"],
  "process": ["a systematic series of steps designed for optimal efficiency", "a structured methodology ensuring consistency"],
  "team": ["a collaborative group of dedicated professionals working in unison", "a skilled workforce committed to shared objectives"],
};

const fillerSentences = [
  "This aspect deserves careful consideration and attention.",
  "It is worth noting that this carries significant implications.",
  "This point is particularly relevant in the current context.",
  "Taking a closer look reveals additional layers of depth.",
  "This serves as an important foundation for further discussion.",
  "Understanding this element provides valuable insight into the broader picture.",
  "This represents a key component in the overall framework.",
  "The significance of this cannot be understated.",
  "This contributes meaningfully to the larger narrative.",
  "Examining this more closely reveals its true importance.",
  "This plays a pivotal role in shaping the outcome.",
  "It is essential to recognize the impact this has.",
  "This warrants thorough examination and thoughtful analysis.",
  "The implications of this extend beyond the immediate scope.",
  "This adds considerable value to the overall discussion.",
];

const examples = [
  "For instance, this can be observed in practical applications.",
  "As an example, many professionals have noted similar patterns.",
  "To illustrate, consider how this applies in real-world scenarios.",
  "For example, this principle has been widely adopted across industries.",
  "A practical demonstration of this can be seen in everyday situations.",
  "This is exemplified by numerous case studies and observations.",
];

function expandText(text: string, level: ExpansionLevel): string {
  const targetMultiplier = level === "+50%" ? 1.5 : level === "+100%" ? 2.0 : 3.0;
  const originalWords = text.trim().split(/\s+/).filter(Boolean);
  const targetWords = Math.ceil(originalWords.length * targetMultiplier);

  let result = text;
  let currentWords = originalWords.length;
  let iteration = 0;

  // Phase 1: Add adjectives before nouns/key words
  const nounIndicators = ["system", "approach", "method", "solution", "strategy", "project", "task", "goal", "effort", "outcome", "performance", "impact", "quality", "growth", "development"];
  for (const noun of nounIndicators) {
    if (currentWords >= targetWords) break;
    const adj = adjectives[iteration % adjectives.length];
    const regex = new RegExp(`\\b(${noun})\\b`, "gi");
    if (result.match(regex)) {
      result = result.replace(regex, `${adj} $1`);
      currentWords += 1;
      iteration++;
    }
  }

  // Phase 2: Elaborate on key words
  const keys = Object.keys(elaborations);
  for (const key of keys) {
    if (currentWords >= targetWords) break;
    const regex = new RegExp(`\\b(${key})\\b`, "gi");
    if (result.match(regex)) {
      const elab = elaborations[key][iteration % elaborations[key].length];
      result = result.replace(regex, `$1 (${elab})`);
      currentWords += elab.split(/\s+/).length + 1;
      iteration++;
      break; // Only one elaboration per pass
    }
  }

  // Phase 3: Add filler sentences between existing sentences
  const sentences = result.match(/[^.!?]+[.!?]+/g) || [result];
  if (currentWords < targetWords && sentences.length > 1) {
    const expanded: string[] = [];
    let fillerIdx = 0;
    for (let i = 0; i < sentences.length; i++) {
      expanded.push(sentences[i].trim());
      if (currentWords < targetWords && i < sentences.length - 1) {
        const filler = fillerSentences[fillerIdx % fillerSentences.length];
        expanded.push(filler);
        currentWords += filler.split(/\s+/).length;
        fillerIdx++;
        if (level === "+200%" && currentWords < targetWords) {
          const example = examples[fillerIdx % examples.length];
          expanded.push(example);
          currentWords += example.split(/\s+/).length;
          fillerIdx++;
        }
      }
    }
    result = expanded.join(" ");
  }

  // Phase 4: Add more filler at end if still short
  let endIdx = iteration;
  while (result.trim().split(/\s+/).filter(Boolean).length < targetWords) {
    const filler = fillerSentences[endIdx % fillerSentences.length];
    result = result.trim() + " " + filler;
    endIdx++;
    if (endIdx - iteration > 20) break; // Safety cap
  }

  return result;
}

export default function AiTextExpander() {
  const [input, setInput] = useState("");
  const [level, setLevel] = useState<ExpansionLevel>("+100%");
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);

  const inputWordCount = useMemo(() => input.trim().split(/\s+/).filter(Boolean).length, [input]);
  const resultWordCount = useMemo(() => result.trim().split(/\s+/).filter(Boolean).length, [result]);

  const generate = () => {
    if (!input.trim()) return;
    setResult(expandText(input, level));
  };

  const copy = () => {
    navigator.clipboard?.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const levels: ExpansionLevel[] = ["+50%", "+100%", "+200%"];

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Short Text / Notes</label>
        <textarea className="calc-input min-h-[140px]" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter your short text or notes here..." />
        <p className="text-xs text-gray-400 mt-1">{inputWordCount} words</p>
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Expansion Level</label>
        <div className="flex gap-2 flex-wrap">
          {levels.map((l) => (
            <button key={l} onClick={() => setLevel(l)} className={l === level ? "btn-primary" : "btn-secondary"}>{l} Length</button>
          ))}
        </div>
      </div>
      <button onClick={generate} className="btn-primary">Expand Text</button>
      {result && (
        <div className="space-y-4">
          <div className="flex gap-4 text-sm">
            <span className="text-gray-500">Before: <strong>{inputWordCount}</strong> words</span>
            <span className="text-gray-500">After: <strong>{resultWordCount}</strong> words</span>
            <span className="text-green-600 font-semibold">+{resultWordCount - inputWordCount} words ({Math.round(((resultWordCount - inputWordCount) / inputWordCount) * 100)}%)</span>
          </div>
          <div className="result-card">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-gray-600">Expanded Text</span>
              <button onClick={copy} className="text-xs text-indigo-600 font-medium hover:underline">{copied ? "Copied!" : "Copy"}</button>
            </div>
            <p className="text-gray-800 leading-relaxed">{result}</p>
          </div>
        </div>
      )}
    </div>
  );
}
