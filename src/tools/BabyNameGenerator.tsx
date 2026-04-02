"use client";
import { useState, useMemo } from "react";

interface NameEntry { name: string; meaning: string }

const babyNames: Record<string, Record<string, NameEntry[]>> = {
  Hindu: {
    Male: [
      {name:"Aarav",meaning:"Peaceful"},{name:"Vivaan",meaning:"Full of life"},{name:"Aditya",meaning:"Sun god"},{name:"Arjun",meaning:"Bright, shining"},{name:"Reyansh",meaning:"Ray of light"},
      {name:"Ayaan",meaning:"Gift of God"},{name:"Krishna",meaning:"Dark, divine"},{name:"Arnav",meaning:"Ocean"},{name:"Dhruv",meaning:"Pole star"},{name:"Kabir",meaning:"Great, powerful"},
      {name:"Ishaan",meaning:"Sun, lord"},{name:"Shaurya",meaning:"Bravery"},{name:"Atharv",meaning:"First Veda"},{name:"Advait",meaning:"Unique, non-dual"},{name:"Vihaan",meaning:"Dawn, morning"},
      {name:"Pranav",meaning:"Sacred syllable Om"},{name:"Rohan",meaning:"Ascending"},{name:"Sahil",meaning:"Shore, guide"},{name:"Yash",meaning:"Fame, glory"},{name:"Harsh",meaning:"Happiness"},
      {name:"Dev",meaning:"God, divine"},{name:"Om",meaning:"Sacred syllable"},{name:"Parth",meaning:"Arjuna"},{name:"Rishi",meaning:"Sage"},{name:"Siddharth",meaning:"One who achieved goals"},
      {name:"Tanmay",meaning:"Absorbed, engrossed"},{name:"Kartik",meaning:"Month of Kartik"},{name:"Naman",meaning:"Salutation"},{name:"Rahul",meaning:"Efficient"},{name:"Tejas",meaning:"Radiance"},
      {name:"Soham",meaning:"I am that"},{name:"Raghav",meaning:"Lord Rama"},{name:"Manas",meaning:"Mind, intellect"},{name:"Chirag",meaning:"Lamp, light"},{name:"Vaibhav",meaning:"Prosperity"},
      {name:"Lakshya",meaning:"Target, aim"},{name:"Ojas",meaning:"Vitality"},{name:"Eklavya",meaning:"Dedicated student"},{name:"Darshan",meaning:"Vision"},{name:"Bhuvan",meaning:"World"},
    ],
    Female: [
      {name:"Aadhya",meaning:"First power"},{name:"Ananya",meaning:"Unique"},{name:"Diya",meaning:"Lamp, light"},{name:"Myra",meaning:"Beloved"},{name:"Aanya",meaning:"Inexhaustible"},
      {name:"Aarohi",meaning:"Musical note"},{name:"Kiara",meaning:"Dark-haired"},{name:"Saanvi",meaning:"Goddess Lakshmi"},{name:"Avni",meaning:"Earth"},{name:"Ira",meaning:"Earth, Saraswati"},
      {name:"Prisha",meaning:"God's gift"},{name:"Navya",meaning:"Young, new"},{name:"Anika",meaning:"Grace"},{name:"Riya",meaning:"Singer"},{name:"Kavya",meaning:"Poetry"},
      {name:"Tanvi",meaning:"Beautiful"},{name:"Ishita",meaning:"Mastery"},{name:"Aria",meaning:"Melody"},{name:"Aditi",meaning:"Mother of gods"},{name:"Lavanya",meaning:"Grace, beauty"},
      {name:"Meera",meaning:"Devotee of Krishna"},{name:"Nandini",meaning:"Daughter, delightful"},{name:"Pallavi",meaning:"New leaves"},{name:"Radhika",meaning:"Prosperous"},{name:"Sakshi",meaning:"Witness"},
      {name:"Tanya",meaning:"Fairy princess"},{name:"Vaishnavi",meaning:"Worshipper of Vishnu"},{name:"Aishwarya",meaning:"Prosperity"},{name:"Gayatri",meaning:"Sacred hymn"},{name:"Harini",meaning:"Deer"},
      {name:"Jyoti",meaning:"Light, flame"},{name:"Kriti",meaning:"Creation"},{name:"Madhuri",meaning:"Sweet"},{name:"Neha",meaning:"Love, rain"},{name:"Prerna",meaning:"Inspiration"},
      {name:"Simran",meaning:"Meditation"},{name:"Trisha",meaning:"Noble"},{name:"Vidya",meaning:"Knowledge"},{name:"Arushi",meaning:"Dawn"},{name:"Disha",meaning:"Direction"},
    ],
  },
  Muslim: {
    Male: [
      {name:"Aariz",meaning:"Respectable"},{name:"Abdullah",meaning:"Servant of God"},{name:"Ahmed",meaning:"Praiseworthy"},{name:"Ali",meaning:"Exalted"},{name:"Ayaan",meaning:"Gift of God"},
      {name:"Bilal",meaning:"Water, freshness"},{name:"Danish",meaning:"Knowledge"},{name:"Faizan",meaning:"Grace, abundance"},{name:"Hamza",meaning:"Lion"},{name:"Ibrahim",meaning:"Father of nations"},
      {name:"Junaid",meaning:"Warrior"},{name:"Kamran",meaning:"Successful"},{name:"Mohammed",meaning:"Praiseworthy"},{name:"Omar",meaning:"Flourishing"},{name:"Saad",meaning:"Happiness"},
      {name:"Tariq",meaning:"Morning star"},{name:"Yusuf",meaning:"God increases"},{name:"Zain",meaning:"Beauty, grace"},{name:"Hassan",meaning:"Handsome"},{name:"Imran",meaning:"Prosperity"},
      {name:"Khalid",meaning:"Eternal"},{name:"Nadeem",meaning:"Friend"},{name:"Rehan",meaning:"Sweet-scented"},{name:"Salman",meaning:"Safe, secure"},{name:"Waqar",meaning:"Dignity"},
      {name:"Adnan",meaning:"Settler"},{name:"Daniyal",meaning:"Intelligent"},{name:"Ehsan",meaning:"Compassion"},{name:"Irfan",meaning:"Knowledge"},{name:"Kashif",meaning:"Discoverer"},
    ],
    Female: [
      {name:"Aisha",meaning:"Alive, well-living"},{name:"Amina",meaning:"Trustworthy"},{name:"Dua",meaning:"Prayer"},{name:"Fatima",meaning:"Captivating"},{name:"Hina",meaning:"Henna"},
      {name:"Inaya",meaning:"Care, concern"},{name:"Khadija",meaning:"Early baby"},{name:"Laiba",meaning:"Angel of heaven"},{name:"Maryam",meaning:"Pious"},{name:"Nadia",meaning:"Caller"},
      {name:"Saba",meaning:"Morning breeze"},{name:"Yasmin",meaning:"Jasmine flower"},{name:"Zainab",meaning:"Father's gem"},{name:"Alina",meaning:"Beautiful"},{name:"Bushra",meaning:"Good news"},
      {name:"Iqra",meaning:"Read"},{name:"Madiha",meaning:"Praiseworthy"},{name:"Rabia",meaning:"Spring"},{name:"Saima",meaning:"Fasting"},{name:"Zahra",meaning:"Flower, bright"},
      {name:"Afreen",meaning:"Beautiful"},{name:"Ghazala",meaning:"Gazelle"},{name:"Humaira",meaning:"Red-colored"},{name:"Mehreen",meaning:"Loving"},{name:"Rukhsar",meaning:"Cheek"},
      {name:"Tanzeela",meaning:"Revelation"},{name:"Wardah",meaning:"Rose"},{name:"Zoya",meaning:"Alive, loving"},{name:"Falak",meaning:"Sky"},{name:"Jannat",meaning:"Paradise"},
    ],
  },
  Sikh: {
    Male: [
      {name:"Gurpreet",meaning:"Love of Guru"},{name:"Harjot",meaning:"God's light"},{name:"Jaspreet",meaning:"Fame of God"},{name:"Kuldeep",meaning:"Light of family"},{name:"Manpreet",meaning:"Love of mind"},
      {name:"Navjot",meaning:"New light"},{name:"Onkar",meaning:"God"},{name:"Paramjit",meaning:"Supreme victory"},{name:"Rajvir",meaning:"Brave king"},{name:"Satnam",meaning:"True name"},
      {name:"Tejvir",meaning:"Radiant brave"},{name:"Amritpal",meaning:"Protector of nectar"},{name:"Bikramjit",meaning:"Victorious valor"},{name:"Daljit",meaning:"Conqueror of forces"},{name:"Fatehvir",meaning:"Brave victory"},
      {name:"Gurbani",meaning:"Guru's word"},{name:"Inderpal",meaning:"Protector"},{name:"Kartar",meaning:"Creator"},{name:"Lovepreet",meaning:"Love of God"},{name:"Ranjit",meaning:"Victor in battle"},
      {name:"Simranjit",meaning:"Victorious meditation"},{name:"Avtar",meaning:"Incarnation"},{name:"Charan",meaning:"Feet of Guru"},{name:"Ekam",meaning:"One, unique"},{name:"Gurnaam",meaning:"Guru's name"},
      {name:"Harpal",meaning:"God's protector"},{name:"Jasvir",meaning:"Brave fame"},{name:"Keerat",meaning:"Praise"},{name:"Mehtab",meaning:"Moonlight"},{name:"Nihal",meaning:"Joyful"},
    ],
    Female: [
      {name:"Amanpreet",meaning:"Love of peace"},{name:"Gurleen",meaning:"Absorbed in Guru"},{name:"Harleen",meaning:"Absorbed in God"},{name:"Jasmeet",meaning:"Famous friend"},{name:"Kiranjot",meaning:"Ray of light"},
      {name:"Loveleen",meaning:"Absorbed in love"},{name:"Manmeet",meaning:"Friend of mind"},{name:"Navneet",meaning:"Ever new"},{name:"Prabhjeet",meaning:"God's victory"},{name:"Simran",meaning:"Meditation"},
      {name:"Amarjeet",meaning:"Victorious immortal"},{name:"Bani",meaning:"Word, speech"},{name:"Chahat",meaning:"Desire"},{name:"Deepkaur",meaning:"Lamp princess"},{name:"Fatehleen",meaning:"Absorbed in victory"},
      {name:"Harpreet",meaning:"Love of God"},{name:"Jasleen",meaning:"Absorbed in fame"},{name:"Kamaljeet",meaning:"Victorious lotus"},{name:"Livleen",meaning:"Absorbed"},{name:"Nirmal",meaning:"Pure"},
      {name:"Palakpreet",meaning:"Love of eyelash"},{name:"Rajleen",meaning:"Absorbed in kingdom"},{name:"Sahibleen",meaning:"Absorbed in master"},{name:"Tajinder",meaning:"God's crown"},{name:"Anmolpreet",meaning:"Love of priceless"},
      {name:"Dilpreet",meaning:"Love of heart"},{name:"Gurdipkaur",meaning:"Guru's lamp"},{name:"Harsimrat",meaning:"God's remembrance"},{name:"Jaskaur",meaning:"Fame princess"},{name:"Kamaldeep",meaning:"Lotus lamp"},
    ],
  },
  Christian: {
    Male: [
      {name:"Aaron",meaning:"High mountain"},{name:"Benjamin",meaning:"Son of right hand"},{name:"Caleb",meaning:"Faithful"},{name:"Daniel",meaning:"God is my judge"},{name:"David",meaning:"Beloved"},
      {name:"Elijah",meaning:"My God is Yahweh"},{name:"Emmanuel",meaning:"God with us"},{name:"Gabriel",meaning:"God is my strength"},{name:"Isaac",meaning:"He will laugh"},{name:"James",meaning:"Supplanter"},
      {name:"John",meaning:"God is gracious"},{name:"Joseph",meaning:"He will add"},{name:"Joshua",meaning:"God is salvation"},{name:"Luke",meaning:"Light-giving"},{name:"Mark",meaning:"Warlike"},
      {name:"Matthew",meaning:"Gift of God"},{name:"Michael",meaning:"Who is like God"},{name:"Nathan",meaning:"He gave"},{name:"Noah",meaning:"Rest, comfort"},{name:"Paul",meaning:"Small, humble"},
      {name:"Peter",meaning:"Rock, stone"},{name:"Philip",meaning:"Horse lover"},{name:"Samuel",meaning:"Heard by God"},{name:"Simon",meaning:"He has heard"},{name:"Stephen",meaning:"Crown"},
      {name:"Thomas",meaning:"Twin"},{name:"Timothy",meaning:"Honoring God"},{name:"William",meaning:"Strong-willed warrior"},{name:"Andrew",meaning:"Manly"},{name:"George",meaning:"Farmer"},
    ],
    Female: [
      {name:"Abigail",meaning:"Father's joy"},{name:"Anna",meaning:"Grace"},{name:"Beatrice",meaning:"She who brings happiness"},{name:"Catherine",meaning:"Pure"},{name:"Diana",meaning:"Divine"},
      {name:"Elizabeth",meaning:"Pledged to God"},{name:"Emily",meaning:"Rival"},{name:"Esther",meaning:"Star"},{name:"Faith",meaning:"Trust, belief"},{name:"Grace",meaning:"Elegance, divine grace"},
      {name:"Hannah",meaning:"Favour, grace"},{name:"Hope",meaning:"Expectation"},{name:"Irene",meaning:"Peace"},{name:"Jessica",meaning:"God beholds"},{name:"Julia",meaning:"Youthful"},
      {name:"Katherine",meaning:"Pure"},{name:"Laura",meaning:"Laurel"},{name:"Lucy",meaning:"Light"},{name:"Mary",meaning:"Beloved"},{name:"Naomi",meaning:"Pleasantness"},
      {name:"Olivia",meaning:"Olive tree"},{name:"Rachel",meaning:"Ewe"},{name:"Rebecca",meaning:"To bind"},{name:"Rose",meaning:"Rose flower"},{name:"Ruth",meaning:"Companion, friend"},
      {name:"Sarah",meaning:"Princess"},{name:"Sophia",meaning:"Wisdom"},{name:"Teresa",meaning:"Harvester"},{name:"Victoria",meaning:"Victory"},{name:"Martha",meaning:"Lady of the house"},
    ],
  },
  Modern: {
    Male: [
      {name:"Aarush",meaning:"First ray of sun"},{name:"Kiaan",meaning:"Grace of God"},{name:"Rehan",meaning:"Star"},{name:"Veer",meaning:"Brave"},{name:"Zian",meaning:"Self-peace"},
      {name:"Ahaan",meaning:"Dawn, morning glory"},{name:"Ivaan",meaning:"Gracious gift"},{name:"Rudra",meaning:"Fierce, Shiva"},{name:"Kayaan",meaning:"King"},{name:"Yuvan",meaning:"Young"},
      {name:"Neil",meaning:"Champion"},{name:"Ryan",meaning:"Little king"},{name:"Aryan",meaning:"Noble"},{name:"Kian",meaning:"Ancient"},{name:"Riaan",meaning:"Little king"},
      {name:"Viraj",meaning:"Resplendent"},{name:"Shaan",meaning:"Pride"},{name:"Zayan",meaning:"Beautiful"},{name:"Ayush",meaning:"Long life"},{name:"Darsh",meaning:"Sight, vision"},
      {name:"Evan",meaning:"Young warrior"},{name:"Ishan",meaning:"Sun"},{name:"Jian",meaning:"Life"},{name:"Kavi",meaning:"Poet"},{name:"Nihaal",meaning:"Blissful"},
      {name:"Prayan",meaning:"Journey"},{name:"Raahi",meaning:"Traveller"},{name:"Samar",meaning:"War"},{name:"Taran",meaning:"Raft, saviour"},{name:"Viaan",meaning:"Full of life"},
    ],
    Female: [
      {name:"Aara",meaning:"Adornment"},{name:"Kyra",meaning:"Throne"},{name:"Misha",meaning:"Smile"},{name:"Nara",meaning:"Happy"},{name:"Ziva",meaning:"Radiance"},
      {name:"Ivana",meaning:"God is gracious"},{name:"Riya",meaning:"Singer"},{name:"Tiya",meaning:"Bird"},{name:"Aahana",meaning:"Inner light"},{name:"Inara",meaning:"Ray of light"},
      {name:"Nyra",meaning:"Beauty of Goddess Saraswati"},{name:"Pihu",meaning:"Sound of bird"},{name:"Sara",meaning:"Princess"},{name:"Vanya",meaning:"Gracious"},{name:"Zara",meaning:"Princess"},
      {name:"Ahana",meaning:"Dawn"},{name:"Kiara",meaning:"Clear, bright"},{name:"Naira",meaning:"Shining"},{name:"Rhea",meaning:"Flowing"},{name:"Sia",meaning:"Goddess Sita"},
      {name:"Eva",meaning:"Life"},{name:"Gia",meaning:"Heart"},{name:"Keya",meaning:"Flower"},{name:"Mira",meaning:"Wonderful"},{name:"Noor",meaning:"Light"},
      {name:"Priya",meaning:"Beloved"},{name:"Ria",meaning:"Earth"},{name:"Siya",meaning:"White"},{name:"Tara",meaning:"Star"},{name:"Yara",meaning:"Friend"},
    ],
  },
};

export default function BabyNameGenerator() {
  const [gender, setGender] = useState<"Male" | "Female">("Male");
  const [origin, setOrigin] = useState("Hindu");
  const [letter, setLetter] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [seed, setSeed] = useState(0);

  const results = useMemo(() => {
    const pool = babyNames[origin]?.[gender] || [];
    let filtered = pool;
    if (letter.trim()) {
      filtered = pool.filter((n) => n.name.toUpperCase().startsWith(letter.toUpperCase()));
    }
    const shuffled = [...filtered].sort(() => {
      const x = Math.sin(seed + filtered.indexOf(filtered[0])) * 10000;
      return x - Math.floor(x) - 0.5;
    });
    return shuffled.slice(0, 20);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gender, origin, letter, seed]);

  const toggleFav = (name: string) => {
    setFavorites((prev) => prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Gender</label>
          <select value={gender} onChange={(e) => setGender(e.target.value as "Male"|"Female")} className="calc-input">
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Origin</label>
          <select value={origin} onChange={(e) => setOrigin(e.target.value)} className="calc-input">
            {Object.keys(babyNames).map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Starting Letter (optional)</label>
          <input
            type="text"
            placeholder="e.g. A"
            value={letter}
            onChange={(e) => setLetter(e.target.value.slice(0, 1))}
            className="calc-input uppercase"
            maxLength={1}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={() => setSeed((s) => s + 1)} className="btn-primary">Generate Names</button>
        {results.length > 0 && <button onClick={() => setSeed((s) => s + 1)} className="btn-secondary">Regenerate</button>}
      </div>

      {results.length > 0 && (
        <div className="result-card">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {results.map((entry, i) => (
              <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                <div>
                  <span className="font-semibold text-gray-800">{entry.name}</span>
                  <span className="text-sm text-gray-500 ml-2">- {entry.meaning}</span>
                </div>
                <button
                  onClick={() => toggleFav(entry.name)}
                  className={`text-lg ${favorites.includes(entry.name) ? "text-red-500" : "text-gray-300"}`}
                >
                  {favorites.includes(entry.name) ? "\u2764\uFE0F" : "\u2661"}
                </button>
              </div>
            ))}
          </div>
          {results.length === 0 && letter && (
            <p className="text-gray-500 text-center py-4">No names found starting with &quot;{letter}&quot;. Try another letter.</p>
          )}
        </div>
      )}

      {favorites.length > 0 && (
        <div className="result-card border-l-4 border-red-300">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Your Favorites ({favorites.length})</h3>
          <div className="flex flex-wrap gap-2">
            {favorites.map((name) => (
              <span key={name} className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                {name}
                <button onClick={() => toggleFav(name)} className="ml-1 text-red-400 hover:text-red-600">&times;</button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
