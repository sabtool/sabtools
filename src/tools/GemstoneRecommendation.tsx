"use client";
import { useState, useMemo } from "react";

const GEMSTONES = [
  { rashi: "Mesh", english: "Aries", planet: "Mars", primary: "Red Coral (Moonga)", alt: "Carnelian", weight: "5-7 Ratti", metal: "Gold / Copper", finger: "Ring Finger", day: "Tuesday", mantra: "Om Angarakaya Namaha", color: "#E74C3C", emoji: "♈" },
  { rashi: "Vrishabh", english: "Taurus", planet: "Venus", primary: "Diamond (Heera)", alt: "White Sapphire / Opal", weight: "0.5-1 Carat", metal: "Platinum / Silver", finger: "Ring Finger / Middle Finger", day: "Friday", mantra: "Om Shukraya Namaha", color: "#ECF0F1", emoji: "♉" },
  { rashi: "Mithun", english: "Gemini", planet: "Mercury", primary: "Emerald (Panna)", alt: "Green Tourmaline / Peridot", weight: "3-6 Ratti", metal: "Gold", finger: "Little Finger", day: "Wednesday", mantra: "Om Budhaya Namaha", color: "#2ECC71", emoji: "♊" },
  { rashi: "Kark", english: "Cancer", planet: "Moon", primary: "Pearl (Moti)", alt: "Moonstone", weight: "4-6 Ratti", metal: "Silver", finger: "Ring Finger / Little Finger", day: "Monday", mantra: "Om Chandraya Namaha", color: "#BDC3C7", emoji: "♋" },
  { rashi: "Simha", english: "Leo", planet: "Sun", primary: "Ruby (Manik)", alt: "Garnet / Red Spinel", weight: "3-6 Ratti", metal: "Gold / Copper", finger: "Ring Finger", day: "Sunday", mantra: "Om Suryaya Namaha", color: "#C0392B", emoji: "♌" },
  { rashi: "Kanya", english: "Virgo", planet: "Mercury", primary: "Emerald (Panna)", alt: "Green Tourmaline / Peridot", weight: "3-5 Ratti", metal: "Gold", finger: "Little Finger", day: "Wednesday", mantra: "Om Budhaya Namaha", color: "#27AE60", emoji: "♍" },
  { rashi: "Tula", english: "Libra", planet: "Venus", primary: "Diamond (Heera)", alt: "White Sapphire / Opal", weight: "0.5-1 Carat", metal: "Platinum / Silver", finger: "Ring Finger / Middle Finger", day: "Friday", mantra: "Om Shukraya Namaha", color: "#F8C8DC", emoji: "♎" },
  { rashi: "Vrishchik", english: "Scorpio", planet: "Mars", primary: "Red Coral (Moonga)", alt: "Carnelian", weight: "5-9 Ratti", metal: "Gold / Copper", finger: "Ring Finger", day: "Tuesday", mantra: "Om Angarakaya Namaha", color: "#8E44AD", emoji: "♏" },
  { rashi: "Dhanu", english: "Sagittarius", planet: "Jupiter", primary: "Yellow Sapphire (Pukhraj)", alt: "Citrine / Yellow Topaz", weight: "3-5 Ratti", metal: "Gold", finger: "Index Finger", day: "Thursday", mantra: "Om Gurave Namaha", color: "#F1C40F", emoji: "♐" },
  { rashi: "Makar", english: "Capricorn", planet: "Saturn", primary: "Blue Sapphire (Neelam)", alt: "Amethyst / Lapis Lazuli", weight: "4-7 Ratti", metal: "Silver / Iron", finger: "Middle Finger", day: "Saturday", mantra: "Om Shanaischaraya Namaha", color: "#2980B9", emoji: "♑" },
  { rashi: "Kumbh", english: "Aquarius", planet: "Saturn", primary: "Blue Sapphire (Neelam)", alt: "Amethyst / Lapis Lazuli", weight: "4-7 Ratti", metal: "Silver / Iron", finger: "Middle Finger", day: "Saturday", mantra: "Om Shanaischaraya Namaha", color: "#3498DB", emoji: "♒" },
  { rashi: "Meen", english: "Pisces", planet: "Jupiter", primary: "Yellow Sapphire (Pukhraj)", alt: "Citrine / Yellow Topaz", weight: "3-5 Ratti", metal: "Gold", finger: "Index Finger", day: "Thursday", mantra: "Om Gurave Namaha", color: "#1ABC9C", emoji: "♓" },
];

function getRashiFromDOB(month: number, day: number): string {
  const ranges: [string, number, number, number, number][] = [
    ["Mesh", 3, 21, 4, 19], ["Vrishabh", 4, 20, 5, 20], ["Mithun", 5, 21, 6, 20],
    ["Kark", 6, 21, 7, 22], ["Simha", 7, 23, 8, 22], ["Kanya", 8, 23, 9, 22],
    ["Tula", 9, 23, 10, 22], ["Vrishchik", 10, 23, 11, 21], ["Dhanu", 11, 22, 12, 21],
    ["Makar", 12, 22, 1, 19], ["Kumbh", 1, 20, 2, 18], ["Meen", 2, 19, 3, 20],
  ];
  for (const [name, sm, sd, em, ed] of ranges) {
    if (sm <= em) {
      if ((month === sm && day >= sd) || (month === em && day <= ed) || (month > sm && month < em)) return name;
    } else {
      if ((month === sm && day >= sd) || (month === em && day <= ed) || month > sm || month < em) return name;
    }
  }
  return "Mesh";
}

export default function GemstoneRecommendation() {
  const [mode, setMode] = useState<"select" | "dob">("select");
  const [selectedRashi, setSelectedRashi] = useState("");
  const [dob, setDob] = useState("");

  const result = useMemo(() => {
    let rashiName = "";
    if (mode === "select" && selectedRashi) {
      rashiName = selectedRashi;
    } else if (mode === "dob" && dob) {
      const d = new Date(dob);
      rashiName = getRashiFromDOB(d.getMonth() + 1, d.getDate());
    }
    if (!rashiName) return null;
    return GEMSTONES.find((g) => g.rashi === rashiName) || null;
  }, [mode, selectedRashi, dob]);

  return (
    <div className="space-y-8">
      {/* Mode Toggle */}
      <div className="flex gap-3">
        <button onClick={() => setMode("select")} className={mode === "select" ? "btn-primary" : "btn-secondary"}>Select Rashi</button>
        <button onClick={() => setMode("dob")} className={mode === "dob" ? "btn-primary" : "btn-secondary"}>By Date of Birth</button>
      </div>

      {mode === "select" ? (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Choose Your Rashi</label>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {GEMSTONES.map((g) => (
              <button
                key={g.rashi}
                onClick={() => setSelectedRashi(g.rashi)}
                className={`p-3 rounded-xl text-center transition-all ${selectedRashi === g.rashi ? "bg-indigo-100 border-2 border-indigo-500 shadow-md" : "bg-gray-50 border border-gray-200 hover:bg-gray-100"}`}
              >
                <div className="text-2xl">{g.emoji}</div>
                <div className="text-xs font-bold mt-1">{g.rashi}</div>
                <div className="text-xs text-gray-400">{g.english}</div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Date of Birth</label>
          <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="calc-input" />
        </div>
      )}

      {result && (
        <div className="space-y-6">
          {/* Gemstone Card */}
          <div className="result-card overflow-hidden">
            <div className="relative p-6 rounded-2xl text-center" style={{ background: `linear-gradient(135deg, ${result.color}22, ${result.color}44)` }}>
              <div className="w-20 h-20 mx-auto rounded-full border-4 border-white shadow-lg flex items-center justify-center text-4xl mb-3" style={{ backgroundColor: result.color + "33" }}>
                💎
              </div>
              <div className="text-2xl font-extrabold text-gray-800">{result.primary}</div>
              <div className="text-sm text-gray-500 mt-1">For {result.rashi} ({result.english})</div>
              <div className="text-xs text-gray-400 mt-1">Ruling Planet: {result.planet}</div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="result-card">
              <div className="text-xs font-semibold text-gray-500 mb-1">Primary Gemstone</div>
              <div className="text-lg font-bold text-indigo-600">{result.primary}</div>
            </div>
            <div className="result-card">
              <div className="text-xs font-semibold text-gray-500 mb-1">Alternative Gemstone</div>
              <div className="text-lg font-bold text-gray-700">{result.alt}</div>
            </div>
            <div className="result-card">
              <div className="text-xs font-semibold text-gray-500 mb-1">Recommended Weight</div>
              <div className="text-lg font-bold text-gray-700">{result.weight}</div>
            </div>
            <div className="result-card">
              <div className="text-xs font-semibold text-gray-500 mb-1">Metal</div>
              <div className="text-lg font-bold text-gray-700">{result.metal}</div>
            </div>
            <div className="result-card">
              <div className="text-xs font-semibold text-gray-500 mb-1">Wearing Finger</div>
              <div className="text-lg font-bold text-gray-700">{result.finger}</div>
            </div>
            <div className="result-card">
              <div className="text-xs font-semibold text-gray-500 mb-1">Best Day to Wear</div>
              <div className="text-lg font-bold text-gray-700">{result.day}</div>
            </div>
          </div>

          {/* Mantra */}
          <div className="result-card bg-gradient-to-r from-amber-50 to-yellow-50">
            <div className="text-center">
              <div className="text-xs font-semibold text-amber-600 mb-2">Activation Mantra</div>
              <div className="text-xl font-bold text-amber-800 tracking-wide">{result.mantra}</div>
              <p className="text-xs text-gray-500 mt-2">Chant 108 times before wearing the gemstone for the first time</p>
            </div>
          </div>

          {/* Important Note */}
          <div className="result-card bg-blue-50 border border-blue-200">
            <p className="text-sm text-blue-700">
              <strong>Note:</strong> Gemstone recommendations are based on traditional Vedic astrology. Always consult a qualified astrologer before wearing gemstones. Ensure the gemstone is natural and certified.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
