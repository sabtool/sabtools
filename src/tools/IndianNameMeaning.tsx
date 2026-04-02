"use client";
import { useState, useMemo } from "react";

interface NameEntry {
  name: string;
  gender: "boy" | "girl" | "unisex";
  origin: string;
  meaning: string;
  luckyNumber: number;
  rashi: string;
}

const NAMES: NameEntry[] = [
  // Hindi/Sanskrit origin
  { name: "Aarav", gender: "boy", origin: "Sanskrit", meaning: "Peaceful, calm, wise", luckyNumber: 7, rashi: "Mesh (Aries)" },
  { name: "Vivaan", gender: "boy", origin: "Sanskrit", meaning: "Full of life, rays of the morning sun", luckyNumber: 5, rashi: "Vrishabh (Taurus)" },
  { name: "Aditya", gender: "boy", origin: "Sanskrit", meaning: "Sun, son of Aditi", luckyNumber: 1, rashi: "Mesh (Aries)" },
  { name: "Vihaan", gender: "boy", origin: "Sanskrit", meaning: "Dawn, morning, beginning of a new era", luckyNumber: 3, rashi: "Vrishabh (Taurus)" },
  { name: "Arjun", gender: "boy", origin: "Sanskrit", meaning: "Bright, shining, white", luckyNumber: 8, rashi: "Mesh (Aries)" },
  { name: "Sai", gender: "unisex", origin: "Sanskrit", meaning: "Divine, saintly", luckyNumber: 1, rashi: "Kumbh (Aquarius)" },
  { name: "Reyansh", gender: "boy", origin: "Sanskrit", meaning: "Ray of light, part of Lord Vishnu", luckyNumber: 9, rashi: "Tula (Libra)" },
  { name: "Ayaan", gender: "boy", origin: "Sanskrit", meaning: "Gift of God, destiny", luckyNumber: 2, rashi: "Mesh (Aries)" },
  { name: "Krishna", gender: "boy", origin: "Sanskrit", meaning: "Dark, black, Lord Krishna", luckyNumber: 3, rashi: "Mithun (Gemini)" },
  { name: "Ishaan", gender: "boy", origin: "Sanskrit", meaning: "Sun, Lord Shiva, ruler", luckyNumber: 9, rashi: "Mesh (Aries)" },
  { name: "Shaurya", gender: "boy", origin: "Sanskrit", meaning: "Bravery, valor, heroism", luckyNumber: 1, rashi: "Kumbh (Aquarius)" },
  { name: "Atharv", gender: "boy", origin: "Sanskrit", meaning: "Lord Ganesh, first Vedas", luckyNumber: 7, rashi: "Mesh (Aries)" },
  { name: "Advait", gender: "boy", origin: "Sanskrit", meaning: "Unique, one of a kind, non-dual", luckyNumber: 4, rashi: "Mesh (Aries)" },
  { name: "Dhruv", gender: "boy", origin: "Sanskrit", meaning: "Pole star, constant, faithful", luckyNumber: 6, rashi: "Dhanu (Sagittarius)" },
  { name: "Kabir", gender: "boy", origin: "Hindi", meaning: "Great, powerful, leader", luckyNumber: 8, rashi: "Mithun (Gemini)" },
  { name: "Rohan", gender: "boy", origin: "Sanskrit", meaning: "Ascending, growing, healing", luckyNumber: 4, rashi: "Tula (Libra)" },
  { name: "Arnav", gender: "boy", origin: "Sanskrit", meaning: "Ocean, sea, stream", luckyNumber: 2, rashi: "Mesh (Aries)" },
  { name: "Lakshya", gender: "boy", origin: "Sanskrit", meaning: "Target, aim, goal", luckyNumber: 5, rashi: "Mesh (Aries)" },
  { name: "Dev", gender: "boy", origin: "Sanskrit", meaning: "God, divine being", luckyNumber: 9, rashi: "Dhanu (Sagittarius)" },
  { name: "Rudra", gender: "boy", origin: "Sanskrit", meaning: "Howler, Lord Shiva, fierce", luckyNumber: 3, rashi: "Tula (Libra)" },
  { name: "Harsh", gender: "boy", origin: "Sanskrit", meaning: "Joy, happiness, delight", luckyNumber: 1, rashi: "Meen (Pisces)" },
  { name: "Yash", gender: "boy", origin: "Sanskrit", meaning: "Fame, glory, success", luckyNumber: 7, rashi: "Vrishchik (Scorpio)" },
  { name: "Manav", gender: "boy", origin: "Sanskrit", meaning: "Human, youth, man", luckyNumber: 6, rashi: "Singh (Leo)" },
  { name: "Rishi", gender: "boy", origin: "Sanskrit", meaning: "Sage, saint, ray of light", luckyNumber: 8, rashi: "Tula (Libra)" },
  { name: "Parth", gender: "boy", origin: "Sanskrit", meaning: "Prince, Arjun", luckyNumber: 4, rashi: "Kanya (Virgo)" },
  // Girls - Sanskrit/Hindi
  { name: "Saanvi", gender: "girl", origin: "Sanskrit", meaning: "Goddess Lakshmi, knowledge", luckyNumber: 1, rashi: "Kumbh (Aquarius)" },
  { name: "Aanya", gender: "girl", origin: "Sanskrit", meaning: "Graceful, inexhaustible", luckyNumber: 3, rashi: "Mesh (Aries)" },
  { name: "Aadhya", gender: "girl", origin: "Sanskrit", meaning: "First power, the beginning, Goddess Durga", luckyNumber: 5, rashi: "Mesh (Aries)" },
  { name: "Aarohi", gender: "girl", origin: "Sanskrit", meaning: "Musical tune, ascending, progressive", luckyNumber: 2, rashi: "Mesh (Aries)" },
  { name: "Ananya", gender: "girl", origin: "Sanskrit", meaning: "Unique, matchless, without equal", luckyNumber: 7, rashi: "Mesh (Aries)" },
  { name: "Diya", gender: "girl", origin: "Hindi", meaning: "Lamp, light, candle", luckyNumber: 4, rashi: "Dhanu (Sagittarius)" },
  { name: "Myra", gender: "girl", origin: "Sanskrit", meaning: "Sweet, admirable, beloved", luckyNumber: 9, rashi: "Singh (Leo)" },
  { name: "Sara", gender: "girl", origin: "Sanskrit", meaning: "Essence, princess, valuable", luckyNumber: 6, rashi: "Kumbh (Aquarius)" },
  { name: "Ishita", gender: "girl", origin: "Sanskrit", meaning: "Mastery, wealth, Goddess Durga", luckyNumber: 8, rashi: "Mesh (Aries)" },
  { name: "Kiara", gender: "girl", origin: "Sanskrit", meaning: "Dark-haired, first ray of sun", luckyNumber: 3, rashi: "Mithun (Gemini)" },
  { name: "Riya", gender: "girl", origin: "Sanskrit", meaning: "Singer, graceful, gem", luckyNumber: 1, rashi: "Tula (Libra)" },
  { name: "Kavya", gender: "girl", origin: "Sanskrit", meaning: "Poetry, poem, wisdom", luckyNumber: 5, rashi: "Mithun (Gemini)" },
  { name: "Navya", gender: "girl", origin: "Sanskrit", meaning: "Young, new, praiseworthy", luckyNumber: 7, rashi: "Dhanu (Sagittarius)" },
  { name: "Prisha", gender: "girl", origin: "Sanskrit", meaning: "Beloved, God's gift, talent", luckyNumber: 4, rashi: "Kanya (Virgo)" },
  { name: "Siya", gender: "girl", origin: "Sanskrit", meaning: "Goddess Sita, white moonlight", luckyNumber: 2, rashi: "Kumbh (Aquarius)" },
  { name: "Pari", gender: "girl", origin: "Hindi", meaning: "Fairy, angel, beautiful", luckyNumber: 8, rashi: "Kanya (Virgo)" },
  { name: "Amaira", gender: "girl", origin: "Sanskrit", meaning: "Eternally beautiful, divine", luckyNumber: 6, rashi: "Mesh (Aries)" },
  { name: "Tara", gender: "girl", origin: "Sanskrit", meaning: "Star, shining, hillside", luckyNumber: 3, rashi: "Singh (Leo)" },
  { name: "Zara", gender: "girl", origin: "Sanskrit", meaning: "Princess, blooming flower", luckyNumber: 9, rashi: "Dhanu (Sagittarius)" },
  { name: "Mira", gender: "girl", origin: "Sanskrit", meaning: "Prosperous, devotee, ocean", luckyNumber: 1, rashi: "Singh (Leo)" },
  // Tamil origin
  { name: "Karthik", gender: "boy", origin: "Tamil", meaning: "Bestower of courage, Lord Murugan", luckyNumber: 5, rashi: "Mithun (Gemini)" },
  { name: "Surya", gender: "boy", origin: "Tamil", meaning: "Sun God, bright", luckyNumber: 1, rashi: "Kumbh (Aquarius)" },
  { name: "Deepika", gender: "girl", origin: "Tamil", meaning: "Light, lamp, illuminating", luckyNumber: 4, rashi: "Dhanu (Sagittarius)" },
  { name: "Meera", gender: "girl", origin: "Tamil", meaning: "Devotee, light, ocean", luckyNumber: 7, rashi: "Singh (Leo)" },
  { name: "Nithya", gender: "girl", origin: "Tamil", meaning: "Eternal, constant, ever-present", luckyNumber: 2, rashi: "Dhanu (Sagittarius)" },
  { name: "Priya", gender: "girl", origin: "Tamil", meaning: "Beloved, dear, loved one", luckyNumber: 8, rashi: "Kanya (Virgo)" },
  { name: "Ravi", gender: "boy", origin: "Tamil", meaning: "Sun, benevolent", luckyNumber: 3, rashi: "Tula (Libra)" },
  { name: "Senthil", gender: "boy", origin: "Tamil", meaning: "Lord Murugan, handsome", luckyNumber: 6, rashi: "Kumbh (Aquarius)" },
  { name: "Anbu", gender: "unisex", origin: "Tamil", meaning: "Love, kindness, affection", luckyNumber: 9, rashi: "Mesh (Aries)" },
  { name: "Malini", gender: "girl", origin: "Tamil", meaning: "Fragrant, gardener, jasmine", luckyNumber: 5, rashi: "Singh (Leo)" },
  // Bengali origin
  { name: "Arnab", gender: "boy", origin: "Bengali", meaning: "Ocean, sea", luckyNumber: 4, rashi: "Mesh (Aries)" },
  { name: "Debashish", gender: "boy", origin: "Bengali", meaning: "Blessed by God", luckyNumber: 7, rashi: "Dhanu (Sagittarius)" },
  { name: "Rina", gender: "girl", origin: "Bengali", meaning: "Melted, dissolved, queen", luckyNumber: 2, rashi: "Tula (Libra)" },
  { name: "Tanisha", gender: "girl", origin: "Bengali", meaning: "Ambition, fairy queen", luckyNumber: 6, rashi: "Singh (Leo)" },
  { name: "Shreya", gender: "girl", origin: "Bengali", meaning: "Auspicious, beautiful, Goddess Lakshmi", luckyNumber: 1, rashi: "Kumbh (Aquarius)" },
  { name: "Subho", gender: "boy", origin: "Bengali", meaning: "Auspicious, good, pure", luckyNumber: 8, rashi: "Kumbh (Aquarius)" },
  { name: "Rajdeep", gender: "boy", origin: "Bengali", meaning: "Best among kings, lamp of the king", luckyNumber: 3, rashi: "Tula (Libra)" },
  // Gujarati origin
  { name: "Jignesh", gender: "boy", origin: "Gujarati", meaning: "Curious, intellectual, seeker", luckyNumber: 5, rashi: "Mithun (Gemini)" },
  { name: "Hetal", gender: "girl", origin: "Gujarati", meaning: "Cheerful, happy, lovable", luckyNumber: 9, rashi: "Meen (Pisces)" },
  { name: "Nisha", gender: "girl", origin: "Gujarati", meaning: "Night, dream, vision", luckyNumber: 4, rashi: "Dhanu (Sagittarius)" },
  { name: "Krish", gender: "boy", origin: "Gujarati", meaning: "Short for Krishna, divine", luckyNumber: 1, rashi: "Mithun (Gemini)" },
  { name: "Mitul", gender: "boy", origin: "Gujarati", meaning: "Friend, moderate, measured", luckyNumber: 6, rashi: "Singh (Leo)" },
  { name: "Sonal", gender: "girl", origin: "Gujarati", meaning: "Golden, beautiful, precious", luckyNumber: 3, rashi: "Kumbh (Aquarius)" },
  // Marathi origin
  { name: "Shrinivas", gender: "boy", origin: "Marathi", meaning: "Abode of Goddess Lakshmi", luckyNumber: 7, rashi: "Kumbh (Aquarius)" },
  { name: "Gauri", gender: "girl", origin: "Marathi", meaning: "White, fair, Goddess Parvati", luckyNumber: 2, rashi: "Meen (Pisces)" },
  { name: "Omkar", gender: "boy", origin: "Marathi", meaning: "Sacred syllable Om, divine sound", luckyNumber: 8, rashi: "Mesh (Aries)" },
  { name: "Sakshi", gender: "girl", origin: "Marathi", meaning: "Witness, evidence", luckyNumber: 5, rashi: "Kumbh (Aquarius)" },
  { name: "Tejas", gender: "boy", origin: "Marathi", meaning: "Bright, lustrous, sharp", luckyNumber: 4, rashi: "Singh (Leo)" },
  { name: "Madhuri", gender: "girl", origin: "Marathi", meaning: "Sweet, beautiful, honey-like", luckyNumber: 1, rashi: "Singh (Leo)" },
  // Punjabi origin
  { name: "Gurpreet", gender: "unisex", origin: "Punjabi", meaning: "Love of the Guru", luckyNumber: 6, rashi: "Meen (Pisces)" },
  { name: "Harpreet", gender: "unisex", origin: "Punjabi", meaning: "Love of God", luckyNumber: 3, rashi: "Meen (Pisces)" },
  { name: "Jasleen", gender: "girl", origin: "Punjabi", meaning: "Absorbed in praise of God", luckyNumber: 9, rashi: "Mithun (Gemini)" },
  { name: "Manpreet", gender: "unisex", origin: "Punjabi", meaning: "One who wins hearts", luckyNumber: 7, rashi: "Singh (Leo)" },
  { name: "Navjot", gender: "unisex", origin: "Punjabi", meaning: "New light, new flame", luckyNumber: 2, rashi: "Dhanu (Sagittarius)" },
  { name: "Simran", gender: "girl", origin: "Punjabi", meaning: "Meditation, remembrance of God", luckyNumber: 5, rashi: "Kumbh (Aquarius)" },
  { name: "Jaspreet", gender: "unisex", origin: "Punjabi", meaning: "Love of fame and glory", luckyNumber: 4, rashi: "Mithun (Gemini)" },
  { name: "Ravinder", gender: "boy", origin: "Punjabi", meaning: "Lord of the Sun", luckyNumber: 8, rashi: "Tula (Libra)" },
  // More diverse additions
  { name: "Rahul", gender: "boy", origin: "Sanskrit", meaning: "Conqueror of miseries, efficient", luckyNumber: 6, rashi: "Tula (Libra)" },
  { name: "Amit", gender: "boy", origin: "Sanskrit", meaning: "Infinite, boundless, immeasurable", luckyNumber: 3, rashi: "Mesh (Aries)" },
  { name: "Neha", gender: "girl", origin: "Hindi", meaning: "Love, affection, rain", luckyNumber: 1, rashi: "Dhanu (Sagittarius)" },
  { name: "Pooja", gender: "girl", origin: "Hindi", meaning: "Prayer, worship, devotion", luckyNumber: 5, rashi: "Kanya (Virgo)" },
  { name: "Ankita", gender: "girl", origin: "Sanskrit", meaning: "Marked, conqueror, decorated", luckyNumber: 9, rashi: "Mesh (Aries)" },
  { name: "Varun", gender: "boy", origin: "Sanskrit", meaning: "Lord of the water, Neptune", luckyNumber: 7, rashi: "Vrishabh (Taurus)" },
  { name: "Naman", gender: "boy", origin: "Sanskrit", meaning: "Salutation, bowing, prayer", luckyNumber: 2, rashi: "Dhanu (Sagittarius)" },
  { name: "Aisha", gender: "girl", origin: "Hindi", meaning: "Alive, living, prosperous", luckyNumber: 4, rashi: "Mesh (Aries)" },
  { name: "Vedant", gender: "boy", origin: "Sanskrit", meaning: "Knowledge of the Vedas, ultimate wisdom", luckyNumber: 8, rashi: "Vrishabh (Taurus)" },
  { name: "Shreyansh", gender: "boy", origin: "Sanskrit", meaning: "Fame, glorious, beautiful", luckyNumber: 6, rashi: "Kumbh (Aquarius)" },
  { name: "Aditi", gender: "girl", origin: "Sanskrit", meaning: "Mother of gods, boundless, free", luckyNumber: 1, rashi: "Mesh (Aries)" },
  { name: "Trisha", gender: "girl", origin: "Sanskrit", meaning: "Noble, desire, thirst", luckyNumber: 3, rashi: "Singh (Leo)" },
  { name: "Aman", gender: "unisex", origin: "Hindi", meaning: "Peace, safety, security", luckyNumber: 9, rashi: "Mesh (Aries)" },
  { name: "Chirag", gender: "boy", origin: "Hindi", meaning: "Lamp, light, illumination", luckyNumber: 7, rashi: "Mithun (Gemini)" },
  { name: "Divya", gender: "girl", origin: "Sanskrit", meaning: "Divine, brilliant, heavenly", luckyNumber: 5, rashi: "Dhanu (Sagittarius)" },
  { name: "Gaurav", gender: "boy", origin: "Sanskrit", meaning: "Pride, honor, dignity", luckyNumber: 2, rashi: "Meen (Pisces)" },
  { name: "Kriti", gender: "girl", origin: "Sanskrit", meaning: "Creation, work of art", luckyNumber: 4, rashi: "Mithun (Gemini)" },
  { name: "Mayank", gender: "boy", origin: "Sanskrit", meaning: "Moon, brilliant", luckyNumber: 6, rashi: "Singh (Leo)" },
  { name: "Nikita", gender: "girl", origin: "Sanskrit", meaning: "Victorious, unconquered", luckyNumber: 8, rashi: "Dhanu (Sagittarius)" },
  { name: "Pranav", gender: "boy", origin: "Sanskrit", meaning: "Sacred syllable Om, life force", luckyNumber: 1, rashi: "Kanya (Virgo)" },
  { name: "Rhea", gender: "girl", origin: "Sanskrit", meaning: "Flowing, singer, river", luckyNumber: 3, rashi: "Tula (Libra)" },
  { name: "Sahil", gender: "boy", origin: "Hindi", meaning: "Shore, beach, guide", luckyNumber: 5, rashi: "Kumbh (Aquarius)" },
  { name: "Tanvi", gender: "girl", origin: "Sanskrit", meaning: "Slender, beautiful, delicate", luckyNumber: 7, rashi: "Singh (Leo)" },
  { name: "Utkarsh", gender: "boy", origin: "Sanskrit", meaning: "Prosperity, awakening, excellence", luckyNumber: 9, rashi: "Mesh (Aries)" },
];

type Gender = "all" | "boy" | "girl" | "unisex";
const ORIGINS = ["All", "Sanskrit", "Hindi", "Tamil", "Bengali", "Gujarati", "Marathi", "Punjabi"];

export default function IndianNameMeaning() {
  const [search, setSearch] = useState("");
  const [gender, setGender] = useState<Gender>("all");
  const [origin, setOrigin] = useState("All");
  const [showPopular, setShowPopular] = useState(false);

  const filtered = useMemo(() => {
    return NAMES.filter((n) => {
      if (search && !n.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (gender !== "all" && n.gender !== gender) return false;
      if (origin !== "All" && n.origin !== origin) return false;
      return true;
    });
  }, [search, gender, origin]);

  const popular = useMemo(() => NAMES.slice(0, 20), []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">Search Name</label>
          <input className="calc-input" placeholder="Type a name..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">Gender</label>
          <select className="calc-input" value={gender} onChange={(e) => setGender(e.target.value as Gender)}>
            <option value="all">All</option>
            <option value="boy">Boy</option>
            <option value="girl">Girl</option>
            <option value="unisex">Unisex</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">Origin</label>
          <select className="calc-input" value={origin} onChange={(e) => setOrigin(e.target.value)}>
            {ORIGINS.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
      </div>

      <div className="flex gap-2">
        <button className={showPopular ? "btn-primary" : "btn-secondary"} onClick={() => setShowPopular(!showPopular)}>
          Popular Names
        </button>
        <span className="text-sm text-gray-500 self-center">{filtered.length} names found</span>
      </div>

      {showPopular && (
        <div className="result-card">
          <div className="text-sm font-semibold text-gray-700 mb-2">Popular Indian Names</div>
          <div className="flex flex-wrap gap-2">
            {popular.map((n) => (
              <button key={n.name} className="px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium hover:bg-indigo-100" onClick={() => setSearch(n.name)}>
                {n.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        {filtered.length === 0 && <div className="text-center text-gray-500 py-8">No names found. Try different filters.</div>}
        {filtered.slice(0, 50).map((n) => (
          <div key={n.name + n.origin} className="result-card">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-800">{n.name}</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${n.gender === "boy" ? "bg-blue-100 text-blue-700" : n.gender === "girl" ? "bg-pink-100 text-pink-700" : "bg-purple-100 text-purple-700"}`}>
                    {n.gender === "boy" ? "Boy" : n.gender === "girl" ? "Girl" : "Unisex"}
                  </span>
                  <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">{n.origin}</span>
                </div>
                <div className="text-sm text-gray-600 mt-1">{n.meaning}</div>
              </div>
              <div className="text-right shrink-0 ml-4">
                <div className="text-xs text-gray-500">Lucky #</div>
                <div className="text-lg font-bold text-indigo-600">{n.luckyNumber}</div>
              </div>
            </div>
            <div className="text-xs text-gray-400 mt-2">Rashi: {n.rashi}</div>
          </div>
        ))}
        {filtered.length > 50 && <div className="text-center text-sm text-gray-400">Showing first 50 results. Refine your search to see more.</div>}
      </div>
    </div>
  );
}
