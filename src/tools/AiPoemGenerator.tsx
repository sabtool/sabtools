"use client";
import { useState } from "react";

type PoemType = "Haiku" | "Limerick" | "Sonnet" | "Free Verse" | "Rhyming" | "Acrostic";
type Mood = "Happy" | "Sad" | "Romantic" | "Inspirational" | "Funny";

const moodWords: Record<Mood, { adjectives: string[]; verbs: string[]; nouns: string[] }> = {
  Happy: {
    adjectives: ["bright", "joyful", "golden", "warm", "shining", "cheerful", "radiant", "blissful", "gentle", "sweet"],
    verbs: ["dance", "sing", "bloom", "glow", "shine", "laugh", "soar", "celebrate", "embrace", "flourish"],
    nouns: ["sunshine", "laughter", "flowers", "rainbow", "melody", "garden", "breeze", "morning", "smile", "delight"],
  },
  Sad: {
    adjectives: ["gray", "fading", "quiet", "lonely", "hollow", "weary", "pale", "distant", "broken", "silent"],
    verbs: ["weep", "fade", "drift", "wander", "fall", "ache", "whisper", "crumble", "mourn", "linger"],
    nouns: ["tears", "shadow", "rain", "silence", "memory", "darkness", "echo", "winter", "twilight", "sorrow"],
  },
  Romantic: {
    adjectives: ["tender", "eternal", "passionate", "sweet", "enchanting", "devoted", "warm", "beloved", "precious", "infinite"],
    verbs: ["love", "embrace", "cherish", "adore", "whisper", "dream", "hold", "caress", "promise", "yearn"],
    nouns: ["heart", "rose", "moonlight", "love", "soul", "stars", "kiss", "desire", "devotion", "flame"],
  },
  Inspirational: {
    adjectives: ["brave", "mighty", "unstoppable", "fierce", "brilliant", "bold", "resilient", "powerful", "limitless", "unbreakable"],
    verbs: ["rise", "conquer", "inspire", "overcome", "achieve", "believe", "persevere", "transform", "ignite", "lead"],
    nouns: ["courage", "strength", "dream", "victory", "destiny", "spirit", "horizon", "mountain", "glory", "purpose"],
  },
  Funny: {
    adjectives: ["silly", "wacky", "goofy", "absurd", "bizarre", "peculiar", "nutty", "comical", "zany", "ridiculous"],
    verbs: ["tumble", "giggle", "wobble", "stumble", "juggle", "bounce", "wiggle", "bumble", "fumble", "tickle"],
    nouns: ["pickle", "noodle", "banana", "monkey", "pancake", "bubble", "puddle", "hiccup", "sneeze", "giggle"],
  },
};

const rhymePairs: Record<string, string[]> = {
  day: ["way", "say", "play", "stay", "ray", "may", "gray", "sway"],
  night: ["light", "sight", "bright", "flight", "right", "might", "height", "delight"],
  love: ["above", "dove", "thereof"],
  heart: ["start", "part", "art", "smart", "apart"],
  dream: ["stream", "gleam", "beam", "theme", "seem", "cream"],
  sky: ["high", "fly", "try", "eye", "sigh", "why", "by"],
  fire: ["desire", "higher", "inspire", "admire"],
  time: ["rhyme", "climb", "chime", "prime", "sublime"],
  rain: ["pain", "gain", "plain", "main", "lane", "train", "remain"],
  sun: ["fun", "run", "done", "one", "begun", "won"],
  life: ["strife", "wife", "knife"],
  mind: ["find", "kind", "behind", "wind", "blind", "remind"],
  soul: ["whole", "goal", "role", "control", "toll"],
  sea: ["free", "tree", "be", "key", "me", "see", "agree"],
  song: ["long", "strong", "along", "belong", "wrong"],
  home: ["roam", "poem", "foam", "dome"],
  peace: ["release", "increase", "cease"],
  star: ["far", "are", "bar", "scar"],
  world: ["hurled", "unfurled", "whirled", "curled"],
  gold: ["bold", "told", "hold", "old", "cold", "fold"],
};

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function picks<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

function generateHaiku(topic: string, mood: Mood): string {
  const w = moodWords[mood];
  const a1 = pick(w.adjectives), a2 = pick(w.adjectives);
  const v1 = pick(w.verbs), n1 = pick(w.nouns), n2 = pick(w.nouns);
  // 5-7-5 syllable approximation
  return `${a1} ${topic} glows\n${n1} and ${n2} ${v1} free\n${a2} ${topic}`;
}

function generateLimerick(topic: string, mood: Mood): string {
  const w = moodWords[mood];
  const a1 = pick(w.adjectives), v1 = pick(w.verbs);
  const n1 = pick(w.nouns), n2 = pick(w.nouns);
  const rhymeKey = pick(Object.keys(rhymePairs));
  const rhymes = rhymePairs[rhymeKey];
  const r1 = pick(rhymes), r2 = pick(rhymes.filter(r => r !== r1));
  return `There once was a ${a1} ${topic} so ${rhymeKey},\nThat loved to ${v1} every ${r1},\nWith ${n1} and ${n2},\nAnd a spirit brand new,\nIt danced through the ${r2} all ${rhymeKey}.`;
}

function generateSonnet(topic: string, mood: Mood): string {
  const w = moodWords[mood];
  const lines: string[] = [];
  const usedAdj = picks(w.adjectives, 8);
  const usedVerb = picks(w.verbs, 6);
  const usedNoun = picks(w.nouns, 8);
  lines.push(`Shall I compare thee to a ${usedAdj[0]} ${topic}?`);
  lines.push(`Thou art more ${usedAdj[1]} and more full of ${usedNoun[0]}.`);
  lines.push(`The ${usedNoun[1]} of ${topic} does ${usedVerb[0]} and sway,`);
  lines.push(`And ${usedNoun[2]}'s lease hath all too short a ${usedNoun[3]}.`);
  lines.push(``);
  lines.push(`Sometimes too ${usedAdj[2]} the eye of ${topic} ${usedVerb[1]}s,`);
  lines.push(`And often is the ${usedAdj[3]} complexion dimmed;`);
  lines.push(`And every ${usedNoun[4]} from ${usedNoun[4]} sometimes ${usedVerb[2]}s,`);
  lines.push(`By chance, or nature's changing course, untrimmed.`);
  lines.push(``);
  lines.push(`But thy eternal ${topic} shall not ${usedVerb[3]},`);
  lines.push(`Nor lose possession of that ${usedAdj[4]} thou ow'st;`);
  lines.push(`Nor shall ${usedNoun[5]} brag thou ${usedVerb[4]} in its shade,`);
  lines.push(`When in eternal lines to time thou ${usedVerb[5]}st.`);
  lines.push(``);
  lines.push(`So long as hearts can ${usedVerb[0]}, or eyes can see,`);
  lines.push(`So long lives ${topic}, and gives life to thee.`);
  return lines.join("\n");
}

function generateFreeVerse(topic: string, mood: Mood): string {
  const w = moodWords[mood];
  const lines: string[] = [];
  lines.push(`${topic}`);
  lines.push(`${pick(w.adjectives)} and ${pick(w.adjectives)}`);
  lines.push(`like ${pick(w.nouns)} in the ${pick(w.nouns)}`);
  lines.push(``);
  lines.push(`I ${pick(w.verbs)} through its essence`);
  lines.push(`finding ${pick(w.nouns)}`);
  lines.push(`where others see nothing`);
  lines.push(``);
  lines.push(`${topic} teaches us`);
  lines.push(`to ${pick(w.verbs)} without fear`);
  lines.push(`to ${pick(w.verbs)} without doubt`);
  lines.push(`to hold ${pick(w.nouns)} close`);
  lines.push(``);
  lines.push(`in the end`);
  lines.push(`${topic} is ${pick(w.adjectives)}`);
  lines.push(`${topic} is ${pick(w.nouns)}`);
  lines.push(`${topic} is everything`);
  return lines.join("\n");
}

function generateRhyming(topic: string, mood: Mood): string {
  const w = moodWords[mood];
  const pairs = Object.entries(rhymePairs);
  const [k1, v1] = pick(pairs);
  const [k2, v2] = pick(pairs.filter(p => p[0] !== k1));
  const r1 = pick(v1), r2 = pick(v2);
  return [
    `In the world of ${topic}, ${pick(w.adjectives)} as ${k1},`,
    `Where ${pick(w.nouns)} and ${pick(w.nouns)} forever ${r1},`,
    `The ${pick(w.adjectives)} ${pick(w.nouns)} ${pick(w.verbs)}s with ${k2},`,
    `As ${topic} ${pick(w.verbs)}s beyond all ${r2}.`,
    ``,
    `Oh ${pick(w.adjectives)} ${topic}, hear our call,`,
    `Through ${pick(w.nouns)} and ${pick(w.nouns)}, through rise and fall,`,
    `You ${pick(w.verbs)} within our hearts so ${pick(w.adjectives)},`,
    `A ${pick(w.nouns)} that burns forever bright.`,
  ].join("\n");
}

function generateAcrostic(topic: string, mood: Mood): string {
  const w = moodWords[mood];
  const word = topic.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 10) || "POEM";
  return word.split("").map(letter => {
    const adj = pick(w.adjectives);
    const noun = pick(w.nouns);
    const verb = pick(w.verbs);
    return `${letter} - ${adj.charAt(0).toUpperCase() === letter ? adj.charAt(0).toUpperCase() + adj.slice(1) : letter + adj.slice(1)} ${noun} ${verb}s`;
  }).join("\n");
}

const generators: Record<PoemType, (t: string, m: Mood) => string> = {
  Haiku: generateHaiku,
  Limerick: generateLimerick,
  Sonnet: generateSonnet,
  "Free Verse": generateFreeVerse,
  Rhyming: generateRhyming,
  Acrostic: generateAcrostic,
};

export default function AiPoemGenerator() {
  const [topic, setTopic] = useState("");
  const [poemType, setPoemType] = useState<PoemType>("Free Verse");
  const [mood, setMood] = useState<Mood>("Inspirational");
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);

  const poemTypes: PoemType[] = ["Haiku", "Limerick", "Sonnet", "Free Verse", "Rhyming", "Acrostic"];
  const moods: Mood[] = ["Happy", "Sad", "Romantic", "Inspirational", "Funny"];

  const generate = () => {
    if (!topic.trim()) return;
    setResult(generators[poemType](topic.trim(), mood));
  };

  const copy = () => {
    navigator.clipboard?.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">
          {poemType === "Acrostic" ? "Word for Acrostic" : "Theme / Topic"}
        </label>
        <input className="calc-input" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder={poemType === "Acrostic" ? "e.g. DREAM, HOPE, NATURE" : "e.g. Nature, Love, Courage, Friendship"} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Poem Type</label>
          <select className="calc-input" value={poemType} onChange={(e) => setPoemType(e.target.value as PoemType)}>
            {poemTypes.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Mood</label>
          <select className="calc-input" value={mood} onChange={(e) => setMood(e.target.value as Mood)}>
            {moods.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>
      <div className="flex gap-3">
        <button onClick={generate} className="btn-primary">Generate Poem</button>
      </div>
      {result && (
        <div className="result-card space-y-4">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <span className="text-sm font-bold text-gray-600">{poemType} - {mood} Mood</span>
            <div className="flex gap-2">
              <button onClick={copy} className="btn-secondary text-xs">{copied ? "Copied!" : "Copy"}</button>
              <button onClick={generate} className="btn-secondary text-xs">Regenerate</button>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-100">
            {result.split("\n").map((line, i) => (
              <p key={i} className={`text-gray-800 font-serif text-lg leading-relaxed ${line.trim() === "" ? "h-4" : ""}`}>{line}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
