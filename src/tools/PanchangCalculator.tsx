"use client";
import { useState, useMemo } from "react";

const TITHIS = [
  "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami",
  "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
  "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima/Amavasya"
];

const NAKSHATRAS = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu",
  "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta",
  "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha", "Moola", "Purva Ashadha",
  "Uttara Ashadha", "Shravana", "Dhanishtha", "Shatabhisha", "Purva Bhadrapada",
  "Uttara Bhadrapada", "Revati"
];

const YOGAS = [
  "Vishkambha", "Priti", "Ayushman", "Saubhagya", "Shobhana", "Atiganda",
  "Sukarma", "Dhriti", "Shoola", "Ganda", "Vriddhi", "Dhruva",
  "Vyaghata", "Harshana", "Vajra", "Siddhi", "Vyatipata", "Variyan",
  "Parigha", "Shiva", "Siddha", "Sadhya", "Shubha", "Shukla",
  "Brahma", "Indra", "Vaidhriti"
];

const KARANAS = [
  "Bava", "Balava", "Kaulava", "Taitila", "Gara", "Vanija", "Vishti",
  "Shakuni", "Chatushpada", "Nagava", "Kimstughna"
];

const VAARS = [
  { name: "Ravivaar (Sunday)", planet: "Sun (Surya)", color: "from-orange-400 to-red-500" },
  { name: "Somvaar (Monday)", planet: "Moon (Chandra)", color: "from-gray-300 to-gray-500" },
  { name: "Mangalvaar (Tuesday)", planet: "Mars (Mangal)", color: "from-red-500 to-red-700" },
  { name: "Budhvaar (Wednesday)", planet: "Mercury (Budh)", color: "from-green-400 to-emerald-600" },
  { name: "Guruvaar (Thursday)", planet: "Jupiter (Guru)", color: "from-yellow-400 to-amber-500" },
  { name: "Shukravaar (Friday)", planet: "Venus (Shukra)", color: "from-pink-400 to-rose-500" },
  { name: "Shanivaar (Saturday)", planet: "Saturn (Shani)", color: "from-indigo-600 to-purple-700" },
];

const AUSPICIOUS_YOGAS = ["Priti", "Ayushman", "Saubhagya", "Shobhana", "Sukarma", "Dhriti", "Vriddhi", "Harshana", "Siddhi", "Shiva", "Siddha", "Sadhya", "Shubha", "Shukla", "Brahma", "Indra"];
const INAUSPICIOUS_TITHIS = ["Chaturthi", "Navami", "Chaturdashi"];

function julianDay(year: number, month: number, day: number) {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

export default function PanchangCalculator() {
  const [dateStr, setDateStr] = useState(() => new Date().toISOString().split("T")[0]);

  const result = useMemo(() => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const dow = d.getDay();
    const jd = julianDay(year, month, day);

    // Simplified lunar phase calculation
    const lunarCycle = 29.53059;
    // Known new moon reference: Jan 6, 2000
    const refJd = julianDay(2000, 1, 6);
    const daysSinceNew = (jd - refJd) % lunarCycle;
    const lunarDay = ((daysSinceNew + lunarCycle) % lunarCycle);

    const tithiIndex = Math.floor((lunarDay / lunarCycle) * 30) % 30;
    const tithiName = TITHIS[tithiIndex % 15];
    const paksha = tithiIndex < 15 ? "Shukla Paksha (Waxing)" : "Krishna Paksha (Waning)";

    // Nakshatra from day of year
    const dayOfYear = Math.floor(((month - 1) * 30.44) + day);
    const nakshatraIndex = Math.floor(((dayOfYear / 365.25) * 360) / 13.33) % 27;

    // Yoga: sun + moon positions simplified
    const yogaIndex = (tithiIndex + nakshatraIndex) % 27;

    // Karana: half of tithi
    const karanaIndex = (tithiIndex * 2) % 11;

    const vaar = VAARS[dow];
    const yoga = YOGAS[yogaIndex];
    const nakshatra = NAKSHATRAS[nakshatraIndex];
    const karana = KARANAS[karanaIndex];

    const isAuspicious = AUSPICIOUS_YOGAS.includes(yoga) && !INAUSPICIOUS_TITHIS.includes(tithiName);

    return { tithiName, paksha, nakshatra, yoga, karana, vaar, isAuspicious, dateFormatted: d.toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) };
  }, [dateStr]);

  return (
    <div className="space-y-8">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Select Date</label>
        <input type="date" value={dateStr} onChange={(e) => setDateStr(e.target.value)} className="calc-input" />
      </div>

      {result && (
        <div className="space-y-6">
          {/* Date & Auspicious/Inauspicious */}
          <div className="result-card text-center">
            <div className="text-lg font-bold text-gray-800">{result.dateFormatted}</div>
            <div className={`inline-block mt-2 px-4 py-1 rounded-full text-sm font-bold ${result.isAuspicious ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              {result.isAuspicious ? "Shubh (Auspicious)" : "Ashubh (Inauspicious)"}
            </div>
          </div>

          {/* Five Elements of Panchang */}
          <div className="grid grid-cols-1 gap-4">
            {/* Tithi */}
            <div className="result-card">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 flex items-center justify-center text-white text-xl">🌙</div>
                <div>
                  <div className="text-xs font-semibold text-amber-600">Tithi (Lunar Day)</div>
                  <div className="text-lg font-bold text-gray-800">{result.tithiName}</div>
                  <div className="text-xs text-gray-500">{result.paksha}</div>
                </div>
              </div>
            </div>

            {/* Nakshatra */}
            <div className="result-card">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-400 to-violet-500 flex items-center justify-center text-white text-xl">⭐</div>
                <div>
                  <div className="text-xs font-semibold text-purple-600">Nakshatra (Star)</div>
                  <div className="text-lg font-bold text-gray-800">{result.nakshatra}</div>
                </div>
              </div>
            </div>

            {/* Yoga */}
            <div className="result-card">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center text-white text-xl">🙏</div>
                <div>
                  <div className="text-xs font-semibold text-green-600">Yoga</div>
                  <div className="text-lg font-bold text-gray-800">{result.yoga}</div>
                  <div className="text-xs text-gray-500">{AUSPICIOUS_YOGAS.includes(result.yoga) ? "Auspicious Yoga" : "Mixed Yoga"}</div>
                </div>
              </div>
            </div>

            {/* Karana */}
            <div className="result-card">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-cyan-500 flex items-center justify-center text-white text-xl">🔷</div>
                <div>
                  <div className="text-xs font-semibold text-blue-600">Karana (Half Tithi)</div>
                  <div className="text-lg font-bold text-gray-800">{result.karana}</div>
                </div>
              </div>
            </div>

            {/* Vaar */}
            <div className="result-card">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${result.vaar.color} flex items-center justify-center text-white text-xl`}>📅</div>
                <div>
                  <div className="text-xs font-semibold text-indigo-600">Vaar (Weekday)</div>
                  <div className="text-lg font-bold text-gray-800">{result.vaar.name}</div>
                  <div className="text-xs text-gray-500">Ruling Planet: {result.vaar.planet}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
