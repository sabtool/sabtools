"use client";
import { useState, useMemo } from "react";

const RASHIS = [
  { name: "Mesh", english: "Aries", start: [3, 21], end: [4, 19], letters: ["A", "L", "E"], emoji: "♈", planet: "Mars", element: "Fire",
    personality: "Natural born leader with boundless energy and courage. Highly competitive and action-oriented.",
    strengths: "Courageous, determined, confident, enthusiastic, optimistic, honest, passionate",
    weaknesses: "Impatient, moody, short-tempered, impulsive, aggressive" },
  { name: "Vrishabh", english: "Taurus", start: [4, 20], end: [5, 20], letters: ["B", "V", "U"], emoji: "♉", planet: "Venus", element: "Earth",
    personality: "Reliable and patient with a strong appreciation for beauty and comfort. Values stability above all.",
    strengths: "Reliable, patient, practical, devoted, responsible, stable",
    weaknesses: "Stubborn, possessive, uncompromising, materialistic" },
  { name: "Mithun", english: "Gemini", start: [5, 21], end: [6, 20], letters: ["K", "C", "G"], emoji: "♊", planet: "Mercury", element: "Air",
    personality: "Quick-witted communicator who loves learning and sharing ideas. Adaptable and intellectually curious.",
    strengths: "Gentle, affectionate, curious, adaptable, ability to learn quickly",
    weaknesses: "Nervous, inconsistent, indecisive, superficial" },
  { name: "Kark", english: "Cancer", start: [6, 21], end: [7, 22], letters: ["D", "H"], emoji: "♋", planet: "Moon", element: "Water",
    personality: "Deeply intuitive and sentimental. Home and family are of utmost importance. Highly empathetic.",
    strengths: "Tenacious, highly imaginative, loyal, emotional, sympathetic, persuasive",
    weaknesses: "Moody, pessimistic, suspicious, manipulative, insecure" },
  { name: "Simha", english: "Leo", start: [7, 23], end: [8, 22], letters: ["M", "T"], emoji: "♌", planet: "Sun", element: "Fire",
    personality: "Creative and passionate with a flair for drama. Natural performers who love to be in the spotlight.",
    strengths: "Creative, passionate, generous, warm-hearted, cheerful, humorous",
    weaknesses: "Arrogant, stubborn, self-centered, lazy, inflexible" },
  { name: "Kanya", english: "Virgo", start: [8, 23], end: [9, 22], letters: ["P", "T", "N"], emoji: "♍", planet: "Mercury", element: "Earth",
    personality: "Analytical and practical mind with keen attention to detail. Hardworking and methodical in approach.",
    strengths: "Loyal, analytical, kind, hardworking, practical, detail-oriented",
    weaknesses: "Shyness, worry, overly critical, all work and no play" },
  { name: "Tula", english: "Libra", start: [9, 23], end: [10, 22], letters: ["R", "T"], emoji: "♎", planet: "Venus", element: "Air",
    personality: "Fair-minded and diplomatic with a strong sense of justice. Seeks harmony and balance in all things.",
    strengths: "Cooperative, diplomatic, gracious, fair-minded, social",
    weaknesses: "Indecisive, avoids confrontations, self-pity, unreliable" },
  { name: "Vrishchik", english: "Scorpio", start: [10, 23], end: [11, 21], letters: ["N", "Y"], emoji: "♏", planet: "Mars", element: "Water",
    personality: "Intensely passionate and resourceful. Known for fierce determination and deep emotional nature.",
    strengths: "Resourceful, brave, passionate, stubborn, a true friend",
    weaknesses: "Distrusting, jealous, secretive, violent, possessive" },
  { name: "Dhanu", english: "Sagittarius", start: [11, 22], end: [12, 21], letters: ["B", "D", "P"], emoji: "♐", planet: "Jupiter", element: "Fire",
    personality: "Adventurous philosopher who loves to explore the world. Optimistic and freedom-loving.",
    strengths: "Generous, idealistic, great sense of humor, adventurous",
    weaknesses: "Promises more than can deliver, very impatient, will say anything" },
  { name: "Makar", english: "Capricorn", start: [12, 22], end: [1, 19], letters: ["K", "J"], emoji: "♑", planet: "Saturn", element: "Earth",
    personality: "Ambitious and disciplined with a strong sense of responsibility. Patient and persistent achiever.",
    strengths: "Responsible, disciplined, self-control, good managers",
    weaknesses: "Know-it-all, unforgiving, condescending, expecting the worst" },
  { name: "Kumbh", english: "Aquarius", start: [1, 20], end: [2, 18], letters: ["G", "S"], emoji: "♒", planet: "Saturn", element: "Air",
    personality: "Progressive thinker and humanitarian. Independent and original in thought and action.",
    strengths: "Progressive, original, independent, humanitarian, intelligent",
    weaknesses: "Runs from emotional expression, temperamental, uncompromising" },
  { name: "Meen", english: "Pisces", start: [2, 19], end: [3, 20], letters: ["D", "C", "J", "T"], emoji: "♓", planet: "Jupiter", element: "Water",
    personality: "Compassionate and artistic soul with deep empathy. Highly intuitive and emotionally aware.",
    strengths: "Compassionate, artistic, intuitive, gentle, wise, musical",
    weaknesses: "Fearful, overly trusting, sad, desire to escape reality" },
];

function getRashiByDate(month: number, day: number) {
  for (const r of RASHIS) {
    const [sm, sd] = r.start;
    const [em, ed] = r.end;
    if (sm <= em) {
      if ((month === sm && day >= sd) || (month === em && day <= ed) || (month > sm && month < em)) return r;
    } else {
      if ((month === sm && day >= sd) || (month === em && day <= ed) || month > sm || month < em) return r;
    }
  }
  return RASHIS[0];
}

function getRashiByLetter(letter: string) {
  const upper = letter.toUpperCase();
  return RASHIS.filter((r) => r.letters.includes(upper));
}

export default function RashiCalculator() {
  const [mode, setMode] = useState<"dob" | "name">("dob");
  const [dob, setDob] = useState("");
  const [nameLetter, setNameLetter] = useState("");

  const result = useMemo(() => {
    if (mode === "dob" && dob) {
      const d = new Date(dob);
      return [getRashiByDate(d.getMonth() + 1, d.getDate())];
    }
    if (mode === "name" && nameLetter.trim()) {
      return getRashiByLetter(nameLetter.trim());
    }
    return null;
  }, [mode, dob, nameLetter]);

  return (
    <div className="space-y-8">
      {/* Mode Toggle */}
      <div className="flex gap-3">
        <button onClick={() => setMode("dob")} className={mode === "dob" ? "btn-primary" : "btn-secondary"}>By Date of Birth</button>
        <button onClick={() => setMode("name")} className={mode === "name" ? "btn-primary" : "btn-secondary"}>By Name Letter</button>
      </div>

      {mode === "dob" ? (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Date of Birth</label>
          <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="calc-input" />
        </div>
      ) : (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">First Letter of Name</label>
          <input type="text" maxLength={1} value={nameLetter} onChange={(e) => setNameLetter(e.target.value)} placeholder="Enter first letter..." className="calc-input" />
        </div>
      )}

      {result && result.length > 0 && (
        <div className="space-y-6">
          {result.length > 1 && (
            <p className="text-sm text-gray-500">Multiple rashis found for letter &quot;{nameLetter.toUpperCase()}&quot;:</p>
          )}
          {result.map((r) => (
            <div key={r.name} className="result-card">
              <div className="text-center mb-4">
                <div className="text-5xl mb-2">{r.emoji}</div>
                <h3 className="text-2xl font-extrabold text-indigo-600">{r.name} ({r.english})</h3>
                <p className="text-sm text-gray-500 mt-1">{r.planet} | {r.element}</p>
              </div>

              <div className="bg-indigo-50 rounded-xl p-4 mb-4">
                <h4 className="text-sm font-bold text-indigo-700 mb-1">Personality</h4>
                <p className="text-sm text-gray-700">{r.personality}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-green-50 rounded-xl p-4">
                  <h4 className="text-sm font-bold text-green-700 mb-1">Strengths</h4>
                  <p className="text-sm text-gray-700">{r.strengths}</p>
                </div>
                <div className="bg-red-50 rounded-xl p-4">
                  <h4 className="text-sm font-bold text-red-700 mb-1">Weaknesses</h4>
                  <p className="text-sm text-gray-700">{r.weaknesses}</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {r.letters.map((l) => (
                  <span key={l} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-semibold">Letter: {l}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {result && result.length === 0 && (
        <div className="result-card text-center text-gray-500">
          No rashi found for letter &quot;{nameLetter.toUpperCase()}&quot;. Try another letter.
        </div>
      )}

      {/* All 12 Rashis Reference */}
      <div className="result-card">
        <h3 className="text-lg font-bold text-gray-800 mb-4">All 12 Rashis</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {RASHIS.map((r) => (
            <div key={r.name} className="bg-gray-50 rounded-xl p-3 text-center hover:bg-indigo-50 transition-colors">
              <div className="text-2xl">{r.emoji}</div>
              <div className="text-sm font-bold text-gray-800">{r.name}</div>
              <div className="text-xs text-gray-500">{r.english}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
