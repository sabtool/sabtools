"use client";
import { useState, useMemo } from "react";

const NAKSHATRAS = [
  { name: "Ashwini", hindi: "अश्विनी", deity: "Ashwini Kumaras", symbol: "Horse Head", chars: "Energetic, quick, healing ability, adventurous", compatible: ["Bharani", "Pushya", "Ashlesha"], pada: [0, 13.33] },
  { name: "Bharani", hindi: "भरणी", deity: "Yama", symbol: "Yoni (Female Organ)", chars: "Creative, dutiful, responsible, strong willpower", compatible: ["Ashwini", "Rohini", "Mrigashira"], pada: [13.33, 26.67] },
  { name: "Krittika", hindi: "कृत्तिका", deity: "Agni", symbol: "Razor / Flame", chars: "Sharp intellect, determined, fiery temperament", compatible: ["Rohini", "Uttara Phalguni", "Hasta"], pada: [26.67, 40] },
  { name: "Rohini", hindi: "रोहिणी", deity: "Brahma", symbol: "Chariot / Ox Cart", chars: "Beautiful, artistic, materialistic, grounded", compatible: ["Bharani", "Krittika", "Mrigashira"], pada: [40, 53.33] },
  { name: "Mrigashira", hindi: "मृगशिरा", deity: "Soma (Moon)", symbol: "Deer Head", chars: "Searching, curious, gentle, timid nature", compatible: ["Bharani", "Rohini", "Ardra"], pada: [53.33, 66.67] },
  { name: "Ardra", hindi: "आर्द्रा", deity: "Rudra", symbol: "Teardrop / Diamond", chars: "Intellectual, powerful mind, transformative", compatible: ["Mrigashira", "Punarvasu", "Pushya"], pada: [66.67, 80] },
  { name: "Punarvasu", hindi: "पुनर्वसु", deity: "Aditi", symbol: "Bow & Quiver", chars: "Philosophical, generous, contented, spiritual", compatible: ["Ardra", "Pushya", "Ashlesha"], pada: [80, 93.33] },
  { name: "Pushya", hindi: "पुष्य", deity: "Brihaspati", symbol: "Lotus / Cow Udder", chars: "Nourishing, devout, charitable, wise", compatible: ["Ashwini", "Punarvasu", "Ardra"], pada: [93.33, 106.67] },
  { name: "Ashlesha", hindi: "आश्लेषा", deity: "Nagas (Serpent)", symbol: "Serpent", chars: "Mystical, hypnotic, cunning, intense", compatible: ["Ashwini", "Punarvasu", "Magha"], pada: [106.67, 120] },
  { name: "Magha", hindi: "मघा", deity: "Pitris (Ancestors)", symbol: "Royal Throne", chars: "Regal, authoritative, traditional, proud", compatible: ["Ashlesha", "Purva Phalguni", "Uttara Phalguni"], pada: [120, 133.33] },
  { name: "Purva Phalguni", hindi: "पूर्व फाल्गुनी", deity: "Bhaga", symbol: "Front Legs of Bed", chars: "Romantic, artistic, carefree, luxurious", compatible: ["Magha", "Uttara Phalguni", "Hasta"], pada: [133.33, 146.67] },
  { name: "Uttara Phalguni", hindi: "उत्तर फाल्गुनी", deity: "Aryaman", symbol: "Back Legs of Bed", chars: "Helpful, friendly, generous, sociable", compatible: ["Krittika", "Magha", "Purva Phalguni"], pada: [146.67, 160] },
  { name: "Hasta", hindi: "हस्त", deity: "Savitar (Sun)", symbol: "Open Hand / Fist", chars: "Skillful, clever, industrious, resourceful", compatible: ["Krittika", "Purva Phalguni", "Chitra"], pada: [160, 173.33] },
  { name: "Chitra", hindi: "चित्रा", deity: "Tvashtar", symbol: "Bright Jewel / Pearl", chars: "Charismatic, attractive, creative, elegant", compatible: ["Hasta", "Swati", "Vishakha"], pada: [173.33, 186.67] },
  { name: "Swati", hindi: "स्वाती", deity: "Vayu (Wind)", symbol: "Young Sprout", chars: "Independent, flexible, diplomatic, restless", compatible: ["Chitra", "Vishakha", "Anuradha"], pada: [186.67, 200] },
  { name: "Vishakha", hindi: "विशाखा", deity: "Indra-Agni", symbol: "Triumphal Arch", chars: "Ambitious, determined, focused, competitive", compatible: ["Chitra", "Swati", "Anuradha"], pada: [200, 213.33] },
  { name: "Anuradha", hindi: "अनुराधा", deity: "Mitra", symbol: "Lotus", chars: "Devoted, friendly, successful, organized", compatible: ["Swati", "Vishakha", "Jyeshtha"], pada: [213.33, 226.67] },
  { name: "Jyeshtha", hindi: "ज्येष्ठा", deity: "Indra", symbol: "Circular Amulet", chars: "Protective, courageous, responsible, intense", compatible: ["Anuradha", "Moola", "Purva Ashadha"], pada: [226.67, 240] },
  { name: "Moola", hindi: "मूल", deity: "Nirriti", symbol: "Bundle of Roots", chars: "Investigative, destructive-creative, philosophical", compatible: ["Jyeshtha", "Purva Ashadha", "Uttara Ashadha"], pada: [240, 253.33] },
  { name: "Purva Ashadha", hindi: "पूर्वाषाढ़ा", deity: "Apas (Water)", symbol: "Elephant Tusk / Fan", chars: "Invincible, proud, independent, purifying", compatible: ["Jyeshtha", "Moola", "Uttara Ashadha"], pada: [253.33, 266.67] },
  { name: "Uttara Ashadha", hindi: "उत्तराषाढ़ा", deity: "Vishve Devas", symbol: "Elephant Tusk / Bed", chars: "Righteous, enduring, leadership, committed", compatible: ["Moola", "Purva Ashadha", "Shravana"], pada: [266.67, 280] },
  { name: "Shravana", hindi: "श्रवण", deity: "Vishnu", symbol: "Three Footprints / Ear", chars: "Intellectual, knowledgeable, connected, perceptive", compatible: ["Uttara Ashadha", "Dhanishtha", "Shatabhisha"], pada: [280, 293.33] },
  { name: "Dhanishtha", hindi: "धनिष्ठा", deity: "Eight Vasus", symbol: "Drum", chars: "Wealthy, musical, charitable, bold", compatible: ["Shravana", "Shatabhisha", "Purva Bhadrapada"], pada: [293.33, 306.67] },
  { name: "Shatabhisha", hindi: "शतभिषा", deity: "Varuna", symbol: "Empty Circle / 100 Flowers", chars: "Healing, mysterious, truthful, independent", compatible: ["Shravana", "Dhanishtha", "Purva Bhadrapada"], pada: [306.67, 320] },
  { name: "Purva Bhadrapada", hindi: "पूर्व भाद्रपद", deity: "Aja Ekapada", symbol: "Front of Funeral Cot", chars: "Passionate, intense, spiritual, transformative", compatible: ["Dhanishtha", "Shatabhisha", "Uttara Bhadrapada"], pada: [320, 333.33] },
  { name: "Uttara Bhadrapada", hindi: "उत्तर भाद्रपद", deity: "Ahir Budhnya", symbol: "Back of Funeral Cot", chars: "Wise, deep thinker, compassionate, controlled", compatible: ["Purva Bhadrapada", "Revati", "Ashwini"], pada: [333.33, 346.67] },
  { name: "Revati", hindi: "रेवती", deity: "Pushan", symbol: "Fish / Drum", chars: "Gentle, nurturing, prosperous, creative", compatible: ["Uttara Bhadrapada", "Ashwini", "Bharani"], pada: [346.67, 360] },
];

function getNakshatra(month: number, day: number) {
  // Simplified lookup: map DOB to a position in the 360-degree zodiac
  // Each nakshatra spans 13.33 degrees
  const dayOfYear = Math.floor(((month - 1) * 30.44) + day);
  const degree = (dayOfYear / 365.25) * 360;
  const idx = Math.floor(degree / 13.33) % 27;
  return NAKSHATRAS[idx];
}

export default function NakshatraCalculator() {
  const [dob, setDob] = useState("");

  const result = useMemo(() => {
    if (!dob) return null;
    const d = new Date(dob);
    return getNakshatra(d.getMonth() + 1, d.getDate());
  }, [dob]);

  return (
    <div className="space-y-8">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Date of Birth</label>
        <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="calc-input" />
      </div>

      {result && (
        <div className="space-y-6">
          {/* Main Result */}
          <div className="result-card">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white text-center">
              <div className="text-sm opacity-80 mb-1">Your Birth Star (Nakshatra)</div>
              <div className="text-3xl font-extrabold">{result.name}</div>
              <div className="text-xl mt-1">{result.hindi}</div>
            </div>
          </div>

          {/* Details */}
          <div className="result-card">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Nakshatra Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-amber-50 rounded-xl p-4">
                <div className="text-xs font-semibold text-amber-600 mb-1">Deity</div>
                <div className="font-bold text-gray-800">{result.deity}</div>
              </div>
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="text-xs font-semibold text-blue-600 mb-1">Symbol</div>
                <div className="font-bold text-gray-800">{result.symbol}</div>
              </div>
            </div>
          </div>

          {/* Characteristics */}
          <div className="result-card">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Characteristics</h3>
            <p className="text-gray-700">{result.chars}</p>
          </div>

          {/* Compatible Nakshatras */}
          <div className="result-card">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Compatible Nakshatras</h3>
            <div className="flex flex-wrap gap-2">
              {result.compatible.map((c) => (
                <span key={c} className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">⭐ {c}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Reference: All 27 Nakshatras */}
      <div className="result-card">
        <h3 className="text-lg font-bold text-gray-800 mb-4">All 27 Nakshatras</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {NAKSHATRAS.map((n, i) => (
            <div key={n.name} className={`rounded-lg p-3 text-sm ${result?.name === n.name ? "bg-indigo-100 border-2 border-indigo-400" : "bg-gray-50"}`}>
              <span className="font-bold text-gray-700">{i + 1}.</span> {n.name} <span className="text-gray-500">({n.hindi})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
