"use client";
import { useState, useMemo } from "react";

// Chaldean numerology system
const CHALDEAN: Record<string, number> = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 8, G: 3, H: 5, I: 1,
  J: 1, K: 2, L: 3, M: 4, N: 5, O: 7, P: 8, Q: 1, R: 2,
  S: 3, T: 4, U: 6, V: 6, W: 6, X: 5, Y: 1, Z: 7,
};

const VOWELS = new Set(["A", "E", "I", "O", "U"]);

const MEANINGS: Record<number, { title: string; description: string; color: string }> = {
  1: { title: "The Leader", description: "Independent, ambitious, and pioneering. Natural born leaders with strong willpower and originality. Driven to succeed through innovation and determination.", color: "from-red-400 to-rose-500" },
  2: { title: "The Diplomat", description: "Cooperative, sensitive, and balanced. Natural peacemakers who thrive in partnerships. Gentle, intuitive, and excel at mediation and building harmony.", color: "from-orange-400 to-amber-500" },
  3: { title: "The Creative", description: "Expressive, artistic, and joyful. Gifted communicators with a vibrant personality. Natural entertainers who inspire others through creative expression.", color: "from-yellow-400 to-amber-400" },
  4: { title: "The Builder", description: "Practical, organized, and hardworking. Foundation builders who value stability and order. Methodical approach brings lasting success through discipline.", color: "from-green-400 to-emerald-500" },
  5: { title: "The Adventurer", description: "Dynamic, freedom-loving, and versatile. Embrace change and seek new experiences. Magnetic personality that draws people and opportunities.", color: "from-teal-400 to-cyan-500" },
  6: { title: "The Nurturer", description: "Responsible, loving, and domestic. Natural caregivers who prioritize family and community. Seek beauty, harmony, and comfort in all aspects of life.", color: "from-blue-400 to-indigo-500" },
  7: { title: "The Seeker", description: "Analytical, spiritual, and introspective. Deep thinkers drawn to mystery and knowledge. Wisdom comes through inner reflection and study.", color: "from-indigo-400 to-violet-500" },
  8: { title: "The Powerhouse", description: "Ambitious, authoritative, and material-focused. Strong business acumen and desire for success. Karmic energy of balance between material and spiritual.", color: "from-purple-400 to-fuchsia-500" },
  9: { title: "The Humanitarian", description: "Compassionate, generous, and selfless. Old souls with universal understanding. Drawn to serve humanity and make the world a better place.", color: "from-pink-400 to-rose-500" },
};

function reduceToSingle(num: number): number {
  while (num > 9) {
    num = String(num).split("").reduce((s, d) => s + parseInt(d), 0);
  }
  return num;
}

function getLetterValue(letter: string): number {
  return CHALDEAN[letter.toUpperCase()] || 0;
}

export default function NameNumerologyCalculator() {
  const [name, setName] = useState("");

  const result = useMemo(() => {
    const cleaned = name.replace(/[^a-zA-Z\s]/g, "").toUpperCase();
    if (!cleaned.trim()) return null;

    let destinyTotal = 0;
    let soulTotal = 0;
    let personalityTotal = 0;
    const letterBreakdown: { letter: string; value: number; type: string }[] = [];

    for (const ch of cleaned) {
      if (ch === " ") continue;
      const val = getLetterValue(ch);
      const isVowel = VOWELS.has(ch);
      letterBreakdown.push({ letter: ch, value: val, type: isVowel ? "vowel" : "consonant" });
      destinyTotal += val;
      if (isVowel) soulTotal += val;
      else personalityTotal += val;
    }

    const destiny = reduceToSingle(destinyTotal);
    const soul = reduceToSingle(soulTotal);
    const personality = reduceToSingle(personalityTotal);

    return { destiny, soul, personality, destinyTotal, soulTotal, personalityTotal, letterBreakdown };
  }, [name]);

  return (
    <div className="space-y-8">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Enter Your Full Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Rahul Sharma"
          className="calc-input"
        />
        <p className="text-xs text-gray-400 mt-1">Using Chaldean Numerology System</p>
      </div>

      {result && (
        <div className="space-y-6">
          {/* Three Numbers */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Destiny Number", sublabel: "Full Name", num: result.destiny, total: result.destinyTotal },
              { label: "Soul Number", sublabel: "Vowels Only", num: result.soul, total: result.soulTotal },
              { label: "Personality Number", sublabel: "Consonants Only", num: result.personality, total: result.personalityTotal },
            ].map((item) => (
              <div key={item.label} className="result-card text-center">
                <div className="text-xs font-semibold text-gray-500 mb-1">{item.label}</div>
                <div className="text-xs text-gray-400 mb-2">({item.sublabel}: {item.total})</div>
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${MEANINGS[item.num].color} text-white text-3xl font-extrabold`}>
                  {item.num}
                </div>
                <div className="text-sm font-bold text-gray-800 mt-2">{MEANINGS[item.num].title}</div>
              </div>
            ))}
          </div>

          {/* Letter Breakdown */}
          <div className="result-card">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Letter Breakdown</h3>
            <div className="flex flex-wrap gap-2">
              {result.letterBreakdown.map((lb, i) => (
                <div key={i} className={`flex flex-col items-center px-3 py-2 rounded-lg ${lb.type === "vowel" ? "bg-blue-50 border border-blue-200" : "bg-gray-50 border border-gray-200"}`}>
                  <span className="text-lg font-bold">{lb.letter}</span>
                  <span className={`text-xs font-semibold ${lb.type === "vowel" ? "text-blue-600" : "text-gray-600"}`}>{lb.value}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-4 mt-3 text-xs">
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-100 border border-blue-300 rounded"></span> Vowel</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-gray-100 border border-gray-300 rounded"></span> Consonant</span>
            </div>
          </div>

          {/* Detailed Meanings */}
          {[
            { label: "Destiny Number", num: result.destiny, desc: "Reveals your life purpose and the path you are meant to follow." },
            { label: "Soul Number", num: result.soul, desc: "Represents your inner desires, motivations, and true self." },
            { label: "Personality Number", num: result.personality, desc: "Shows how others perceive you and your outer personality." },
          ].map((item) => (
            <div key={item.label} className="result-card">
              <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r ${MEANINGS[item.num].color} text-white flex items-center justify-center text-xl font-bold`}>
                  {item.num}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">{item.label} - {MEANINGS[item.num].title}</h3>
                  <p className="text-xs text-gray-400 mb-2">{item.desc}</p>
                  <p className="text-sm text-gray-700">{MEANINGS[item.num].description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
