"use client";
import { useState, useEffect, useCallback } from "react";

type Difficulty = "Easy" | "Medium" | "Hard";
type QType = "MCQ" | "True-False" | "Fill-in-blank";

interface Question {
  question: string;
  options?: string[];
  answer: string;
  type: QType;
}

const questionBank: Record<string, { easy: string[]; medium: string[]; hard: string[] }> = {
  Science: {
    easy: [
      "What gas do plants absorb from the atmosphere?|Carbon Dioxide|Oxygen|Nitrogen|Hydrogen|Carbon Dioxide",
      "Water boils at ___ degrees Celsius at sea level.|100",
      "The Earth revolves around the Sun.|True",
      "What is the chemical symbol for water?|H2O|CO2|NaCl|O2|H2O",
      "Humans have ___ pairs of chromosomes.|23",
      "Light travels faster than sound.|True",
      "What planet is known as the Red Planet?|Mars|Venus|Jupiter|Saturn|Mars",
      "The process by which plants make food is called ___.|Photosynthesis",
      "Diamond is the hardest natural substance.|True",
      "What is the largest organ in the human body?|Skin|Heart|Liver|Brain|Skin",
    ],
    medium: [
      "What is the powerhouse of the cell?|Mitochondria|Nucleus|Ribosome|Golgi Body|Mitochondria",
      "The pH value of pure water is ___.|7",
      "Sound can travel through a vacuum.|False",
      "Which vitamin is produced when skin is exposed to sunlight?|Vitamin D|Vitamin A|Vitamin C|Vitamin B12|Vitamin D",
      "The chemical formula for table salt is ___.|NaCl",
      "DNA stands for Deoxyribonucleic Acid.|True",
      "What is the SI unit of force?|Newton|Joule|Watt|Pascal|Newton",
      "The atomic number of Carbon is ___.|6",
      "Electrons are positively charged.|False",
      "Which gas is most abundant in Earth's atmosphere?|Nitrogen|Oxygen|Carbon Dioxide|Argon|Nitrogen",
    ],
    hard: [
      "What is the Heisenberg Uncertainty Principle about?|Position and momentum|Mass and energy|Speed and distance|Force and acceleration|Position and momentum",
      "The speed of light in vacuum is approximately ___ m/s.|3 × 10^8",
      "Mitosis results in four daughter cells.|False",
      "What particle is exchanged in electromagnetic interactions?|Photon|Gluon|W boson|Graviton|Photon",
      "Avogadro's number is approximately ___.|6.022 × 10^23",
      "Entropy of the universe always increases.|True",
      "Which organelle is responsible for protein synthesis?|Ribosome|Lysosome|Mitochondria|Nucleus|Ribosome",
      "The half-life of Carbon-14 is approximately ___ years.|5730",
      "Black holes emit Hawking radiation.|True",
      "What is the most electronegative element?|Fluorine|Oxygen|Chlorine|Nitrogen|Fluorine",
    ],
  },
  Math: {
    easy: [
      "What is 15% of 200?|30|20|40|25|30",
      "The square root of 144 is ___.|12",
      "A triangle has four sides.|False",
      "What is 7 × 8?|56|48|64|54|56",
      "The value of Pi starts with ___.|3.14",
      "Zero is a natural number.|False",
      "What is the next prime number after 7?|11|9|13|10|11",
      "A right angle measures ___ degrees.|90",
      "The sum of angles in a triangle is 180 degrees.|True",
      "What is 25²?|625|525|725|425|625",
    ],
    medium: [
      "What is the derivative of x²?|2x|x|x²|2x²|2x",
      "The factorial of 5 (5!) equals ___.|120",
      "Every prime number is odd.|False",
      "What is the LCM of 12 and 18?|36|24|48|54|36",
      "The integral of 2x dx is ___.|x² + C",
      "Pi is a rational number.|False",
      "What is log₁₀(1000)?|3|2|4|10|3",
      "The sum of first n natural numbers is ___.|n(n+1)/2",
      "The square root of -1 is defined as i.|True",
      "What type of number is √2?|Irrational|Rational|Integer|Whole|Irrational",
    ],
    hard: [
      "What is the Euler's number (e) approximately?|2.718|3.142|1.618|2.236|2.718",
      "The determinant of a 2×2 identity matrix is ___.|1",
      "Every continuous function is differentiable.|False",
      "What is the sum of an infinite geometric series with a=1, r=1/2?|2|1|1.5|Infinity|2",
      "The eigenvalue equation is Av = ___v.|λ",
      "The set of real numbers is countable.|False",
      "What is the Fibonacci sequence's golden ratio approximately?|1.618|1.414|2.718|3.142|1.618",
      "The number of permutations of n objects is ___.|n!",
      "Gödel's incompleteness theorem applies to all consistent formal systems.|True",
      "What is the limit of (1+1/n)^n as n approaches infinity?|e|1|Pi|Infinity|e",
    ],
  },
  History: {
    easy: [
      "In which year did India gain independence?|1947|1950|1942|1945|1947",
      "The first President of India was ___.|Dr. Rajendra Prasad",
      "The Taj Mahal is located in Delhi.|False",
      "Who discovered America in 1492?|Christopher Columbus|Vasco da Gama|Ferdinand Magellan|Marco Polo|Christopher Columbus",
      "World War I started in the year ___.|1914",
      "Mahatma Gandhi was born in Gujarat.|True",
      "What was the ancient name of Iraq?|Mesopotamia|Persia|Babylon|Assyria|Mesopotamia",
      "The French Revolution began in ___.|1789",
      "The Great Wall of China was built in a single dynasty.|False",
      "Who was the first Emperor of Rome?|Augustus|Julius Caesar|Nero|Constantine|Augustus",
    ],
    medium: [
      "What treaty ended World War I?|Treaty of Versailles|Treaty of Paris|Treaty of Vienna|Treaty of Westphalia|Treaty of Versailles",
      "The Berlin Wall fell in the year ___.|1989",
      "The Industrial Revolution started in France.|False",
      "Who was the first woman to win a Nobel Prize?|Marie Curie|Mother Teresa|Florence Nightingale|Rosa Parks|Marie Curie",
      "The Magna Carta was signed in ___.|1215",
      "The Cold War was an actual military war between US and USSR.|False",
      "Which empire was known as the 'Empire on which the sun never sets'?|British Empire|Roman Empire|Ottoman Empire|Spanish Empire|British Empire",
      "The Renaissance began in ___ (country).|Italy",
      "The United Nations was founded in 1945.|True",
      "Who was the last Mughal Emperor of India?|Bahadur Shah Zafar|Aurangzeb|Shah Jahan|Akbar|Bahadur Shah Zafar",
    ],
    hard: [
      "What year was the Treaty of Westphalia signed?|1648|1618|1700|1588|1648",
      "The Rosetta Stone was discovered in ___.|1799",
      "The Hundred Years' War lasted exactly 100 years.|False",
      "Which civilization invented the concept of zero?|Indian/Hindu|Greek|Chinese|Egyptian|Indian/Hindu",
      "The Battle of Thermopylae took place in ___ BC.|480",
      "The Ottoman Empire fell after World War I.|True",
      "What was the primary cause of the Opium Wars?|Trade disputes over opium|Religious conflicts|Territory expansion|Royal succession|Trade disputes over opium",
      "The Silk Road was established during the ___ dynasty.|Han",
      "Napoleon was exiled to Elba before Waterloo.|True",
      "Which ancient wonder was located in Alexandria?|Lighthouse (Pharos)|Colossus|Hanging Gardens|Mausoleum|Lighthouse (Pharos)",
    ],
  },
  Geography: {
    easy: [
      "What is the largest continent?|Asia|Africa|North America|Europe|Asia",
      "The longest river in the world is the ___.|Nile",
      "Mount Everest is in Africa.|False",
      "What is the capital of Japan?|Tokyo|Beijing|Seoul|Bangkok|Tokyo",
      "The largest ocean is the ___ Ocean.|Pacific",
      "Australia is both a country and a continent.|True",
      "What is the smallest country in the world?|Vatican City|Monaco|San Marino|Liechtenstein|Vatican City",
      "India has ___ states.|28",
      "The Sahara Desert is the largest desert.|True",
      "Which country has the largest population?|India|China|USA|Indonesia|India",
    ],
    medium: [
      "What is the deepest point in the ocean?|Mariana Trench|Puerto Rico Trench|Java Trench|Tonga Trench|Mariana Trench",
      "The Amazon Rainforest spans ___ countries.|9",
      "The Dead Sea is actually a lake.|True",
      "Which African country has the most pyramids?|Sudan|Egypt|Libya|Morocco|Sudan",
      "The Ring of Fire is located around the ___ Ocean.|Pacific",
      "Greenland is a continent.|False",
      "What is the longest mountain range in the world?|Andes|Himalayas|Rockies|Alps|Andes",
      "The Bermuda Triangle is in the ___ Ocean.|Atlantic",
      "Iceland is covered mostly in ice.|False",
      "Which strait separates Europe from Africa?|Strait of Gibraltar|Strait of Hormuz|Bosphorus|Malacca|Strait of Gibraltar",
    ],
    hard: [
      "What is the only country that spans all four hemispheres?|Kiribati|Indonesia|Brazil|Russia|Kiribati",
      "Lake Baikal contains approximately ___% of world's fresh surface water.|20",
      "The Prime Meridian passes through Paris.|False",
      "What is the driest inhabited continent?|Australia|Africa|Asia|Europe|Australia",
      "The Caspian Sea has a surface area of approximately ___ sq km.|371,000",
      "Bhutan measures national happiness instead of GDP.|True",
      "Which country has the most time zones?|France|Russia|USA|China|France",
      "The highest waterfall in the world is ___ Falls.|Angel",
      "Mount Chimborazo is closer to space than Everest.|True",
      "What is the largest island in the Mediterranean?|Sicily|Sardinia|Corsica|Crete|Sicily",
    ],
  },
  GK: {
    easy: [
      "How many colors are in a rainbow?|7|6|8|5|7",
      "The national bird of India is the ___.|Peacock",
      "The Sun rises in the West.|False",
      "What is the currency of Japan?|Yen|Won|Yuan|Dollar|Yen",
      "A decade has ___ years.|10",
      "Cricket is the national sport of India.|False",
      "Who painted the Mona Lisa?|Leonardo da Vinci|Michelangelo|Pablo Picasso|Vincent van Gogh|Leonardo da Vinci",
      "The human body has ___ bones.|206",
      "Octopuses have three hearts.|True",
      "What is the national animal of India?|Bengal Tiger|Asiatic Lion|Indian Elephant|Peacock|Bengal Tiger",
    ],
    medium: [
      "Which planet has the most moons?|Saturn|Jupiter|Uranus|Neptune|Saturn",
      "The Nobel Prize was first awarded in ___.|1901",
      "Honey never spoils.|True",
      "What is the hardest natural substance on Earth?|Diamond|Titanium|Steel|Granite|Diamond",
      "The Olympic flag has ___ rings.|5",
      "Tomato is a vegetable.|False",
      "Which blood type is a universal donor?|O negative|AB positive|A positive|B negative|O negative",
      "The Internet was invented in the ___.|1960s",
      "A group of crows is called a murder.|True",
      "What is the most spoken language in the world by native speakers?|Mandarin Chinese|Spanish|English|Hindi|Mandarin Chinese",
    ],
    hard: [
      "What is the only letter that doesn't appear in any US state name?|Q|X|Z|J|Q",
      "The human nose can detect over ___ scents.|1 trillion",
      "Cleopatra lived closer in time to the Moon landing than to the building of the Great Pyramid.|True",
      "Which country consumes the most coffee per capita?|Finland|Brazil|USA|Italy|Finland",
      "The speed of sound at sea level is approximately ___ m/s.|343",
      "Bananas are berries but strawberries are not.|True",
      "What is the rarest blood type?|AB negative|O negative|B negative|A negative|AB negative",
      "The deepest point humans have drilled into Earth is ___ km.|12.2",
      "Venus rotates in the opposite direction to most planets.|True",
      "Which element has the highest melting point?|Tungsten|Carbon|Iron|Titanium|Tungsten",
    ],
  },
  "English Grammar": {
    easy: [
      "What is the plural of 'child'?|Children|Childs|Childrens|Childes|Children",
      "The past tense of 'go' is ___.|went",
      "'Their' and 'There' have the same meaning.|False",
      "Which is a noun?|Happiness|Quickly|Beautiful|Running|Happiness",
      "A sentence must end with a ___.|period/full stop",
      "An adjective describes a verb.|False",
      "What is the opposite of 'ancient'?|Modern|Old|Antique|Classic|Modern",
      "The article used before vowel sounds is ___.|an",
      "'I am going to the store' is in present tense.|True",
      "Which word is a conjunction?|And|Quickly|Beautiful|House|And",
    ],
    medium: [
      "What type of sentence asks a question?|Interrogative|Declarative|Imperative|Exclamatory|Interrogative",
      "The passive voice of 'She writes a letter' is 'A letter ___ by her'.|is written",
      "A dangling modifier is grammatically correct.|False",
      "Which figure of speech compares using 'like' or 'as'?|Simile|Metaphor|Personification|Hyperbole|Simile",
      "The superlative form of 'good' is ___.|best",
      "Split infinitives are always grammatically wrong.|False",
      "What is a group of words that has a subject and predicate called?|Clause|Phrase|Fragment|Modifier|Clause",
      "The plural of 'phenomenon' is ___.|phenomena",
      "Oxford comma is mandatory in all English writing.|False",
      "Which tense: 'She will have been working for 5 hours'?|Future Perfect Continuous|Future Perfect|Past Perfect|Present Perfect|Future Perfect Continuous",
    ],
    hard: [
      "What is the subjunctive mood used for?|Hypothetical situations|Commands|Questions|Past events|Hypothetical situations",
      "The rhetorical device of understatement is called ___.|litotes",
      "A gerund always functions as a verb.|False",
      "Which of these is an example of synecdoche?|Wheels for car|Brave as a lion|Time flies|Break a leg|Wheels for car",
      "The word 'set' has over ___ definitions in English.|430",
      "Prescriptive grammar describes how language is actually used.|False",
      "What is the term for a word that sounds like what it means?|Onomatopoeia|Alliteration|Assonance|Consonance|Onomatopoeia",
      "An anaphora repeats words at the ___ of successive clauses.|beginning",
      "English has more words than any other language.|True",
      "What is the longest one-syllable word in English?|Strengths|Screeched|Stretched|Scratched|Strengths",
    ],
  },
};

function parseQuestion(raw: string, qType: QType): Question {
  const parts = raw.split("|");
  if (qType === "MCQ" && parts.length >= 6) {
    return { question: parts[0], options: [parts[1], parts[2], parts[3], parts[4]], answer: parts[5], type: "MCQ" };
  } else if (qType === "True-False" && parts.length >= 2) {
    return { question: parts[0], options: ["True", "False"], answer: parts[1], type: "True-False" };
  } else if (qType === "Fill-in-blank" && parts.length >= 2) {
    return { question: parts[0].replace(parts[1], "___"), answer: parts[1], type: "Fill-in-blank" };
  }
  return { question: parts[0], answer: parts[parts.length - 1], type: qType };
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function AiQuizGenerator() {
  const [topic, setTopic] = useState("Science");
  const [difficulty, setDifficulty] = useState<Difficulty>("Medium");
  const [numQ, setNumQ] = useState(5);
  const [qType, setQType] = useState<QType>("MCQ");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showAnswers, setShowAnswers] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [timer, setTimer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  const topics = Object.keys(questionBank);

  const generate = useCallback(() => {
    const bank = questionBank[topic];
    if (!bank) return;
    const diffKey = difficulty.toLowerCase() as "easy" | "medium" | "hard";
    const raw = bank[diffKey] || bank.easy;
    const filtered = raw.filter((r) => {
      const parts = r.split("|");
      if (qType === "MCQ") return parts.length >= 6;
      if (qType === "True-False") return parts.length === 2 && (parts[1] === "True" || parts[1] === "False");
      return parts.length === 2 && parts[1] !== "True" && parts[1] !== "False";
    });
    const selected = shuffle(filtered).slice(0, numQ);
    const qs = selected.map((r) => parseQuestion(r, qType));
    if (qType === "MCQ") qs.forEach((q) => { if (q.options) q.options = shuffle(q.options); });
    setQuestions(qs);
    setShowAnswers(false);
    setUserAnswers({});
    setSubmitted(false);
    if (timer) {
      const secs = numQ * (difficulty === "Easy" ? 30 : difficulty === "Medium" ? 45 : 60);
      setTimeLeft(secs);
      setTimerActive(true);
    }
  }, [topic, difficulty, numQ, qType, timer]);

  useEffect(() => {
    if (!timerActive || timeLeft <= 0) {
      if (timerActive && timeLeft <= 0) { setSubmitted(true); setTimerActive(false); }
      return;
    }
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timerActive, timeLeft]);

  const score = questions.reduce((acc, q, i) => acc + (userAnswers[i]?.toLowerCase() === q.answer.toLowerCase() ? 1 : 0), 0);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Subject</label>
          <select className="calc-input" value={topic} onChange={(e) => setTopic(e.target.value)}>
            {topics.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Difficulty</label>
          <div className="flex gap-2">
            {(["Easy", "Medium", "Hard"] as Difficulty[]).map((d) => (
              <button key={d} onClick={() => setDifficulty(d)} className={d === difficulty ? "btn-primary" : "btn-secondary"}>{d}</button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Number of Questions</label>
          <div className="flex gap-2">
            {[5, 10, 15, 20].map((n) => (
              <button key={n} onClick={() => setNumQ(n)} className={n === numQ ? "btn-primary" : "btn-secondary"}>{n}</button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Question Type</label>
          <div className="flex gap-2 flex-wrap">
            {(["MCQ", "True-False", "Fill-in-blank"] as QType[]).map((t) => (
              <button key={t} onClick={() => setQType(t)} className={t === qType ? "btn-primary" : "btn-secondary"}>{t}</button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input type="checkbox" checked={timer} onChange={(e) => setTimer(e.target.checked)} className="rounded" /> Enable Timer
        </label>
      </div>
      <button onClick={generate} className="btn-primary">Generate Quiz</button>

      {questions.length > 0 && (
        <div className="space-y-4">
          {timerActive && (
            <div className={`text-center font-bold text-lg ${timeLeft < 30 ? "text-red-600" : "text-indigo-600"}`}>
              Time Left: {formatTime(timeLeft)}
            </div>
          )}
          {questions.map((q, i) => (
            <div key={i} className="result-card">
              <p className="font-semibold text-gray-800 mb-2">Q{i + 1}. {q.question}</p>
              {q.type === "MCQ" && q.options && (
                <div className="space-y-2">
                  {q.options.map((opt, j) => (
                    <label key={j} className={`flex items-center gap-2 p-2 rounded cursor-pointer text-sm ${submitted ? (opt.toLowerCase() === q.answer.toLowerCase() ? "bg-green-50 text-green-700" : userAnswers[i] === opt ? "bg-red-50 text-red-700" : "") : userAnswers[i] === opt ? "bg-indigo-50" : ""}`}>
                      <input type="radio" name={`q${i}`} disabled={submitted} checked={userAnswers[i] === opt} onChange={() => setUserAnswers({ ...userAnswers, [i]: opt })} />
                      {opt}
                    </label>
                  ))}
                </div>
              )}
              {q.type === "True-False" && (
                <div className="flex gap-3">
                  {["True", "False"].map((opt) => (
                    <label key={opt} className={`flex items-center gap-2 p-2 rounded cursor-pointer text-sm ${submitted ? (opt === q.answer ? "bg-green-50 text-green-700" : userAnswers[i] === opt ? "bg-red-50 text-red-700" : "") : userAnswers[i] === opt ? "bg-indigo-50" : ""}`}>
                      <input type="radio" name={`q${i}`} disabled={submitted} checked={userAnswers[i] === opt} onChange={() => setUserAnswers({ ...userAnswers, [i]: opt })} />
                      {opt}
                    </label>
                  ))}
                </div>
              )}
              {q.type === "Fill-in-blank" && (
                <input className="calc-input" disabled={submitted} placeholder="Type your answer..." value={userAnswers[i] || ""} onChange={(e) => setUserAnswers({ ...userAnswers, [i]: e.target.value })} />
              )}
              {(showAnswers || submitted) && (
                <p className="mt-2 text-sm text-green-600 font-medium">Answer: {q.answer}</p>
              )}
            </div>
          ))}
          <div className="flex gap-3 flex-wrap">
            {!submitted && <button onClick={() => { setSubmitted(true); setTimerActive(false); }} className="btn-primary">Submit Quiz</button>}
            <button onClick={() => setShowAnswers(!showAnswers)} className="btn-secondary">{showAnswers ? "Hide Answers" : "Show Answer Key"}</button>
          </div>
          {submitted && (
            <div className="result-card bg-indigo-50">
              <p className="text-lg font-bold text-indigo-700">Score: {score} / {questions.length} ({((score / questions.length) * 100).toFixed(0)}%)</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
