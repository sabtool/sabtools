"use client";
import { useState, useMemo } from "react";

type Tone = "Professional" | "Casual" | "Friendly" | "Formal" | "Persuasive" | "Academic" | "Humorous";

const synonymPairs: Record<string, Record<string, string>> = {
  Professional: {
    "good": "excellent", "bad": "suboptimal", "big": "substantial", "small": "minimal",
    "help": "facilitate", "make": "develop", "use": "utilize", "show": "demonstrate",
    "get": "obtain", "give": "provide", "think": "consider", "need": "require",
    "find": "identify", "know": "acknowledge", "want": "aspire to", "start": "initiate",
    "end": "conclude", "change": "modify", "improve": "enhance", "problem": "challenge",
    "fix": "resolve", "buy": "procure", "ask": "inquire", "try": "endeavor",
    "tell": "inform", "look": "examine", "keep": "maintain", "talk": "communicate",
    "meet": "convene", "send": "dispatch", "build": "construct", "plan": "strategize",
    "check": "verify", "handle": "manage", "deal with": "address", "set up": "establish",
    "work on": "collaborate on", "figure out": "determine", "come up with": "devise",
    "put together": "assemble", "go over": "review", "look into": "investigate",
    "a lot": "considerably", "very": "exceptionally", "really": "significantly",
    "great": "outstanding", "nice": "commendable",
  },
  Casual: {
    "excellent": "great", "substantial": "big", "facilitate": "help", "develop": "make",
    "utilize": "use", "demonstrate": "show", "obtain": "get", "provide": "give",
    "consider": "think about", "require": "need", "identify": "find", "acknowledge": "know",
    "initiate": "start", "conclude": "wrap up", "modify": "change", "enhance": "improve",
    "challenge": "issue", "resolve": "fix", "procure": "buy", "inquire": "ask",
    "endeavor": "try", "inform": "tell", "examine": "look at", "maintain": "keep",
    "communicate": "talk", "convene": "meet", "dispatch": "send", "construct": "build",
    "strategize": "plan", "verify": "check", "manage": "handle", "address": "deal with",
    "establish": "set up", "collaborate on": "work on", "determine": "figure out",
    "devise": "come up with", "assemble": "put together", "review": "go over",
    "investigate": "look into", "considerably": "a lot", "exceptionally": "really",
    "significantly": "pretty", "outstanding": "awesome", "commendable": "nice",
  },
  Friendly: {
    "good": "wonderful", "bad": "not great", "big": "huge", "small": "little",
    "help": "lend a hand", "make": "create", "use": "go with", "show": "share",
    "get": "grab", "give": "offer", "think": "feel", "need": "could use",
    "find": "discover", "know": "realize", "want": "love to", "start": "kick off",
    "end": "finish up", "change": "switch up", "improve": "make better", "problem": "hiccup",
    "fix": "sort out", "buy": "pick up", "ask": "reach out about", "try": "give it a shot",
    "tell": "share with", "look": "take a peek", "keep": "hang onto", "talk": "chat",
    "meet": "catch up", "send": "shoot over", "plan": "map out", "check": "take a look",
    "very": "super", "really": "totally", "great": "amazing", "nice": "lovely",
    "a lot": "tons", "important": "key",
  },
  Formal: {
    "good": "commendable", "bad": "unsatisfactory", "big": "considerable", "small": "negligible",
    "help": "assist", "make": "produce", "use": "employ", "show": "illustrate",
    "get": "acquire", "give": "furnish", "think": "contemplate", "need": "necessitate",
    "find": "ascertain", "know": "comprehend", "want": "desire", "start": "commence",
    "end": "terminate", "change": "alter", "improve": "ameliorate", "problem": "predicament",
    "fix": "rectify", "buy": "purchase", "ask": "request", "try": "attempt",
    "tell": "convey", "look": "observe", "keep": "retain", "talk": "discourse",
    "meet": "assemble", "send": "transmit", "plan": "formulate", "check": "ascertain",
    "very": "exceedingly", "really": "genuinely", "great": "exemplary", "nice": "agreeable",
    "a lot": "substantially", "important": "paramount", "also": "furthermore",
    "but": "however", "so": "therefore", "about": "regarding",
  },
  Persuasive: {
    "good": "remarkable", "bad": "concerning", "big": "transformative", "small": "overlooked",
    "help": "empower", "make": "craft", "use": "leverage", "show": "prove",
    "get": "achieve", "give": "deliver", "think": "envision", "need": "demand",
    "find": "uncover", "know": "recognize", "want": "deserve", "start": "launch",
    "end": "complete", "change": "revolutionize", "improve": "elevate", "problem": "opportunity",
    "fix": "transform", "try": "seize the chance to", "tell": "reveal",
    "look": "discover", "keep": "secure", "important": "critical",
    "very": "undeniably", "really": "truly", "great": "extraordinary", "nice": "impressive",
    "a lot": "immensely", "also": "moreover", "but": "yet",
  },
  Academic: {
    "good": "favorable", "bad": "adverse", "big": "significant", "small": "marginal",
    "help": "contribute to", "make": "formulate", "use": "employ", "show": "elucidate",
    "get": "obtain", "give": "provide", "think": "hypothesize", "need": "necessitate",
    "find": "ascertain", "know": "establish", "want": "seek to", "start": "commence",
    "end": "conclude", "change": "modify", "improve": "augment", "problem": "phenomenon",
    "fix": "remediate", "try": "endeavor to", "tell": "postulate",
    "look": "examine", "keep": "preserve", "important": "salient",
    "very": "notably", "really": "substantively", "great": "considerable",
    "a lot": "extensively", "also": "additionally", "but": "conversely",
    "so": "consequently", "about": "pertaining to", "because": "owing to the fact that",
  },
  Humorous: {
    "good": "chef's kiss", "bad": "tragic", "big": "ginormous", "small": "teensy",
    "help": "rescue", "make": "whip up", "use": "whip out", "show": "flaunt",
    "get": "snag", "give": "toss over", "think": "ponder (strokes chin)", "need": "desperately require",
    "find": "stumble upon", "know": "be painfully aware", "want": "crave",
    "start": "dive headfirst into", "end": "call it quits on", "change": "shake up",
    "improve": "level up", "problem": "plot twist", "fix": "MacGyver",
    "try": "wing it and", "tell": "spill the tea about", "look": "take a gander at",
    "keep": "hoard", "important": "earth-shattering", "talk": "ramble about",
    "very": "ridiculously", "really": "seriously", "great": "legendary",
    "a lot": "a gazillion", "also": "oh, and", "but": "plot twist:",
  },
};

function transformText(text: string, tone: Tone): string {
  const map = synonymPairs[tone];
  if (!map) return text;
  let result = text;

  // Sort phrases by length (longer first) to handle multi-word phrases first
  const phrases = Object.keys(map).sort((a, b) => b.length - a.length);

  for (const phrase of phrases) {
    const regex = new RegExp(`\\b${phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi");
    result = result.replace(regex, (match) => {
      const replacement = map[phrase.toLowerCase()];
      if (!replacement) return match;
      // Preserve case
      if (match[0] === match[0].toUpperCase()) {
        return replacement.charAt(0).toUpperCase() + replacement.slice(1);
      }
      return replacement;
    });
  }

  // Tone-specific sentence adjustments
  if (tone === "Formal" || tone === "Academic") {
    result = result.replace(/\bdon't\b/gi, "do not").replace(/\bcan't\b/gi, "cannot")
      .replace(/\bwon't\b/gi, "will not").replace(/\bisn't\b/gi, "is not")
      .replace(/\baren't\b/gi, "are not").replace(/\bI'm\b/g, "I am")
      .replace(/\bthey're\b/gi, "they are").replace(/\bwe're\b/gi, "we are")
      .replace(/\bit's\b/gi, "it is").replace(/\bdidn't\b/gi, "did not")
      .replace(/\bwouldn't\b/gi, "would not").replace(/\bcouldn't\b/gi, "could not");
  }
  if (tone === "Casual" || tone === "Friendly") {
    result = result.replace(/\bdo not\b/gi, "don't").replace(/\bcannot\b/gi, "can't")
      .replace(/\bwill not\b/gi, "won't").replace(/\bit is\b/gi, "it's")
      .replace(/\bthey are\b/gi, "they're").replace(/\bwe are\b/gi, "we're");
  }

  return result;
}

export default function AiToneChanger() {
  const [text, setText] = useState("");
  const [tone, setTone] = useState<Tone>("Professional");
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);

  const wordCount = useMemo(() => text.trim().split(/\s+/).filter(Boolean).length, [text]);

  const generate = () => {
    if (!text.trim()) return;
    setResult(transformText(text, tone));
  };

  const copy = () => {
    navigator.clipboard?.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tones: Tone[] = ["Professional", "Casual", "Friendly", "Formal", "Persuasive", "Academic", "Humorous"];

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Original Text</label>
        <textarea className="calc-input min-h-[140px]" value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter your text here..." />
        <p className="text-xs text-gray-400 mt-1">{wordCount} words</p>
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Target Tone</label>
        <div className="flex gap-2 flex-wrap">
          {tones.map((t) => (
            <button key={t} onClick={() => setTone(t)} className={t === tone ? "btn-primary" : "btn-secondary"}>{t}</button>
          ))}
        </div>
      </div>
      <button onClick={generate} className="btn-primary">Change Tone</button>
      {result && (
        <div className="grid md:grid-cols-2 gap-4">
          <div className="result-card">
            <span className="text-sm font-bold text-gray-600 block mb-2">Original</span>
            <p className="text-gray-800 leading-relaxed">{text}</p>
          </div>
          <div className="result-card">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-gray-600">{tone} Tone</span>
              <button onClick={copy} className="text-xs text-indigo-600 font-medium hover:underline">{copied ? "Copied!" : "Copy"}</button>
            </div>
            <p className="text-gray-800 leading-relaxed">{result}</p>
          </div>
        </div>
      )}
    </div>
  );
}
