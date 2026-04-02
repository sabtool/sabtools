"use client";
import { useState, useMemo } from "react";

const RASHIS = [
  { name: "Mesh", english: "Aries", start: [3, 21], end: [4, 19], planet: "Mars (Mangal)", element: "Fire", color: "Red", number: 9, compatible: ["Simha", "Dhanu", "Mithun"], emoji: "♈", traits: "Courageous, energetic, bold, natural leader" },
  { name: "Vrishabh", english: "Taurus", start: [4, 20], end: [5, 20], planet: "Venus (Shukra)", element: "Earth", color: "Green", number: 6, compatible: ["Kanya", "Makar", "Kark"], emoji: "♉", traits: "Patient, reliable, devoted, strong-willed" },
  { name: "Mithun", english: "Gemini", start: [5, 21], end: [6, 20], planet: "Mercury (Budh)", element: "Air", color: "Yellow", number: 5, compatible: ["Tula", "Kumbh", "Mesh"], emoji: "♊", traits: "Versatile, curious, communicative, witty" },
  { name: "Kark", english: "Cancer", start: [6, 21], end: [7, 22], planet: "Moon (Chandra)", element: "Water", color: "White", number: 2, compatible: ["Vrishchik", "Meen", "Vrishabh"], emoji: "♋", traits: "Nurturing, emotional, intuitive, protective" },
  { name: "Simha", english: "Leo", start: [7, 23], end: [8, 22], planet: "Sun (Surya)", element: "Fire", color: "Gold", number: 1, compatible: ["Mesh", "Dhanu", "Tula"], emoji: "♌", traits: "Confident, dramatic, generous, proud" },
  { name: "Kanya", english: "Virgo", start: [8, 23], end: [9, 22], planet: "Mercury (Budh)", element: "Earth", color: "Green", number: 5, compatible: ["Vrishabh", "Makar", "Kark"], emoji: "♍", traits: "Analytical, practical, diligent, modest" },
  { name: "Tula", english: "Libra", start: [9, 23], end: [10, 22], planet: "Venus (Shukra)", element: "Air", color: "Pink", number: 6, compatible: ["Mithun", "Kumbh", "Simha"], emoji: "♎", traits: "Diplomatic, graceful, fair-minded, social" },
  { name: "Vrishchik", english: "Scorpio", start: [10, 23], end: [11, 21], planet: "Mars (Mangal)", element: "Water", color: "Maroon", number: 9, compatible: ["Kark", "Meen", "Kanya"], emoji: "♏", traits: "Passionate, resourceful, determined, intense" },
  { name: "Dhanu", english: "Sagittarius", start: [11, 22], end: [12, 21], planet: "Jupiter (Guru)", element: "Fire", color: "Purple", number: 3, compatible: ["Mesh", "Simha", "Tula"], emoji: "♐", traits: "Optimistic, adventurous, philosophical, generous" },
  { name: "Makar", english: "Capricorn", start: [12, 22], end: [1, 19], planet: "Saturn (Shani)", element: "Earth", color: "Brown", number: 8, compatible: ["Vrishabh", "Kanya", "Meen"], emoji: "♑", traits: "Ambitious, disciplined, responsible, patient" },
  { name: "Kumbh", english: "Aquarius", start: [1, 20], end: [2, 18], planet: "Saturn (Shani)", element: "Air", color: "Blue", number: 8, compatible: ["Mithun", "Tula", "Dhanu"], emoji: "♒", traits: "Progressive, independent, humanitarian, inventive" },
  { name: "Meen", english: "Pisces", start: [2, 19], end: [3, 20], planet: "Jupiter (Guru)", element: "Water", color: "Sea Green", number: 3, compatible: ["Kark", "Vrishchik", "Makar"], emoji: "♓", traits: "Compassionate, artistic, intuitive, gentle" },
];

function getRashi(month: number, day: number) {
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

// Simplified Moon sign calculation: offset DOB by ~10 days for Vedic sidereal adjustment
function getMoonRashi(month: number, day: number) {
  let d = day + 10;
  let m = month;
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (d > daysInMonth[m - 1]) {
    d -= daysInMonth[m - 1];
    m = m === 12 ? 1 : m + 1;
  }
  return getRashi(m, d);
}

const ELEMENT_COLORS: Record<string, string> = {
  Fire: "from-red-500 to-orange-500",
  Earth: "from-green-600 to-emerald-500",
  Air: "from-sky-400 to-blue-500",
  Water: "from-blue-500 to-indigo-600",
};

export default function KundliCalculator() {
  const [dob, setDob] = useState("");
  const [tob, setTob] = useState("06:00");
  const [gender, setGender] = useState("Male");

  const result = useMemo(() => {
    if (!dob) return null;
    const d = new Date(dob);
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const sun = getRashi(month, day);
    const moon = getMoonRashi(month, day);
    return { sun, moon };
  }, [dob]);

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Date of Birth</label>
          <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="calc-input" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Time of Birth</label>
          <input type="time" value={tob} onChange={(e) => setTob(e.target.value)} className="calc-input" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Gender</label>
          <div className="flex gap-3">
            {["Male", "Female", "Other"].map((g) => (
              <button key={g} onClick={() => setGender(g)} className={gender === g ? "btn-primary" : "btn-secondary"}>
                {g}
              </button>
            ))}
          </div>
        </div>
      </div>

      {result && (
        <div className="space-y-6">
          {/* Sun Sign Card */}
          <div className="result-card">
            <h3 className="text-lg font-bold text-gray-800 mb-4">☀️ Sun Sign (Surya Rashi)</h3>
            <div className={`bg-gradient-to-r ${ELEMENT_COLORS[result.sun.element]} rounded-2xl p-6 text-white`}>
              <div className="text-center">
                <div className="text-5xl mb-2">{result.sun.emoji}</div>
                <div className="text-2xl font-extrabold">{result.sun.name} ({result.sun.english})</div>
                <div className="text-sm mt-1 opacity-90">{result.sun.traits}</div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-white/20 rounded-xl p-3 text-center">
                  <div className="text-xs opacity-80">Ruling Planet</div>
                  <div className="font-bold">{result.sun.planet}</div>
                </div>
                <div className="bg-white/20 rounded-xl p-3 text-center">
                  <div className="text-xs opacity-80">Element</div>
                  <div className="font-bold">{result.sun.element}</div>
                </div>
                <div className="bg-white/20 rounded-xl p-3 text-center">
                  <div className="text-xs opacity-80">Lucky Color</div>
                  <div className="font-bold">{result.sun.color}</div>
                </div>
                <div className="bg-white/20 rounded-xl p-3 text-center">
                  <div className="text-xs opacity-80">Lucky Number</div>
                  <div className="font-bold">{result.sun.number}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Moon Sign Card */}
          <div className="result-card">
            <h3 className="text-lg font-bold text-gray-800 mb-4">🌙 Moon Sign (Chandra Rashi)</h3>
            <div className={`bg-gradient-to-r ${ELEMENT_COLORS[result.moon.element]} rounded-2xl p-6 text-white`}>
              <div className="text-center">
                <div className="text-5xl mb-2">{result.moon.emoji}</div>
                <div className="text-2xl font-extrabold">{result.moon.name} ({result.moon.english})</div>
                <div className="text-sm mt-1 opacity-90">{result.moon.traits}</div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-white/20 rounded-xl p-3 text-center">
                  <div className="text-xs opacity-80">Ruling Planet</div>
                  <div className="font-bold">{result.moon.planet}</div>
                </div>
                <div className="bg-white/20 rounded-xl p-3 text-center">
                  <div className="text-xs opacity-80">Element</div>
                  <div className="font-bold">{result.moon.element}</div>
                </div>
                <div className="bg-white/20 rounded-xl p-3 text-center">
                  <div className="text-xs opacity-80">Lucky Color</div>
                  <div className="font-bold">{result.moon.color}</div>
                </div>
                <div className="bg-white/20 rounded-xl p-3 text-center">
                  <div className="text-xs opacity-80">Lucky Number</div>
                  <div className="font-bold">{result.moon.number}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Compatible Signs */}
          <div className="result-card">
            <h3 className="text-lg font-bold text-gray-800 mb-3">💕 Compatible Signs</h3>
            <div className="flex flex-wrap gap-2">
              {result.sun.compatible.map((c) => {
                const match = RASHIS.find((r) => r.name === c);
                return (
                  <span key={c} className="bg-pink-100 text-pink-700 px-4 py-2 rounded-full text-sm font-semibold">
                    {match?.emoji} {c} ({match?.english})
                  </span>
                );
              })}
            </div>
          </div>

          {/* Info */}
          <div className="result-card">
            <h3 className="text-lg font-bold text-gray-800 mb-3">📋 Basic Details</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-gray-50 rounded-lg p-3"><span className="text-gray-500">Gender:</span> <span className="font-semibold">{gender}</span></div>
              <div className="bg-gray-50 rounded-lg p-3"><span className="text-gray-500">Birth Time:</span> <span className="font-semibold">{tob}</span></div>
              <div className="bg-gray-50 rounded-lg p-3"><span className="text-gray-500">DOB:</span> <span className="font-semibold">{dob}</span></div>
              <div className="bg-gray-50 rounded-lg p-3"><span className="text-gray-500">Day:</span> <span className="font-semibold">{dob ? new Date(dob).toLocaleDateString("en-IN", { weekday: "long" }) : "-"}</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
