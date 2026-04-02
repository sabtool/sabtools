"use client";
import { useState, useMemo } from "react";

interface Card {
  front: string;
  back: string;
  known: boolean;
}

function parseNotesToCards(text: string): Card[] {
  const lines = text.split("\n").filter((l) => l.trim());
  const cards: Card[] = [];

  for (const line of lines) {
    // Try colon separator: "Term: Definition"
    let sep = line.indexOf(":");
    if (sep === -1) sep = line.indexOf(" - ");
    if (sep === -1) sep = line.indexOf(" = ");
    if (sep === -1) sep = line.indexOf("\t");

    if (sep > 0) {
      const front = line.slice(0, sep).replace(/^[-*•#\d.)\s]+/, "").trim();
      const back = line.slice(sep + (line[sep] === "\t" ? 1 : line.substring(sep, sep + 3) === " - " || line.substring(sep, sep + 3) === " = " ? 3 : 1)).trim();
      if (front && back) {
        cards.push({ front, back, known: false });
      }
    } else if (line.trim().length > 10) {
      // Turn sentence into Q&A
      const cleaned = line.replace(/^[-*•#\d.)\s]+/, "").trim();
      if (cleaned.includes(" is ")) {
        const [subject, definition] = cleaned.split(/ is (.+)/);
        if (subject && definition) {
          cards.push({ front: `What is ${subject.trim()}?`, back: definition.replace(/\.$/, "").trim(), known: false });
        }
      } else if (cleaned.includes(" are ")) {
        const [subject, definition] = cleaned.split(/ are (.+)/);
        if (subject && definition) {
          cards.push({ front: `What are ${subject.trim()}?`, back: definition.replace(/\.$/, "").trim(), known: false });
        }
      } else {
        cards.push({ front: cleaned.endsWith("?") ? cleaned : `Explain: ${cleaned.substring(0, 50)}...`, back: cleaned, known: false });
      }
    }
  }
  return cards;
}

const topicCards: Record<string, Card[]> = {
  "Photosynthesis": [
    { front: "What is Photosynthesis?", back: "The process by which green plants use sunlight to synthesize food from CO2 and water", known: false },
    { front: "What is the equation for photosynthesis?", back: "6CO2 + 6H2O + Light Energy → C6H12O6 + 6O2", known: false },
    { front: "Where does photosynthesis occur?", back: "In the chloroplasts, specifically in the thylakoid membranes and stroma", known: false },
    { front: "What pigment is essential for photosynthesis?", back: "Chlorophyll - it absorbs light energy, especially red and blue wavelengths", known: false },
    { front: "What are the two stages of photosynthesis?", back: "Light-dependent reactions (in thylakoids) and Calvin Cycle/Light-independent reactions (in stroma)", known: false },
    { front: "What is the role of water in photosynthesis?", back: "Water is split during light reactions to provide electrons, protons, and oxygen as a byproduct", known: false },
  ],
  "Newton's Laws": [
    { front: "What is Newton's First Law?", back: "An object at rest stays at rest, and an object in motion stays in motion unless acted upon by an external force (Law of Inertia)", known: false },
    { front: "What is Newton's Second Law?", back: "Force equals mass times acceleration (F = ma). The acceleration is directly proportional to net force and inversely proportional to mass", known: false },
    { front: "What is Newton's Third Law?", back: "For every action, there is an equal and opposite reaction", known: false },
    { front: "What is inertia?", back: "The tendency of an object to resist changes in its state of motion. Mass is a measure of inertia", known: false },
    { front: "What is the unit of force?", back: "Newton (N) = kg·m/s²", known: false },
    { front: "Give an example of Newton's Third Law", back: "When you push a wall, the wall pushes back on you with equal force. A rocket pushes gases backward, gases push rocket forward", known: false },
  ],
  "World War II": [
    { front: "When did World War II start and end?", back: "Started September 1, 1939 (Germany invaded Poland) and ended September 2, 1945 (Japan's surrender)", known: false },
    { front: "What were the two main alliance groups?", back: "Allies (US, UK, USSR, France, China) vs Axis Powers (Germany, Italy, Japan)", known: false },
    { front: "What was D-Day?", back: "June 6, 1944 - The Allied invasion of Normandy, France. The largest seaborne invasion in history", known: false },
    { front: "What was the Holocaust?", back: "The systematic genocide of approximately 6 million Jews and millions of others by Nazi Germany", known: false },
    { front: "How did WWII end in Europe?", back: "Germany surrendered on May 8, 1945 (V-E Day) after Allied forces captured Berlin", known: false },
    { front: "How did WWII end in the Pacific?", back: "Japan surrendered after atomic bombs were dropped on Hiroshima (Aug 6) and Nagasaki (Aug 9), 1945", known: false },
  ],
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function AiFlashcardGenerator() {
  const [mode, setMode] = useState<"topic" | "notes">("topic");
  const [topic, setTopic] = useState("");
  const [notes, setNotes] = useState("");
  const [cards, setCards] = useState<Card[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const generate = () => {
    if (mode === "topic") {
      const key = Object.keys(topicCards).find((k) => k.toLowerCase() === topic.trim().toLowerCase());
      if (key) {
        setCards(topicCards[key].map((c) => ({ ...c })));
      } else {
        // Generate generic cards from topic
        setCards([
          { front: `What is ${topic}?`, back: `${topic} is a concept/subject. Enter custom notes for better flashcards.`, known: false },
          { front: `Why is ${topic} important?`, back: `${topic} is important because of its applications and significance in the field.`, known: false },
          { front: `Key components of ${topic}?`, back: `The main components include core concepts, principles, and practical applications.`, known: false },
          { front: `Who discovered/developed ${topic}?`, back: `Paste your notes about ${topic} for personalized flashcards with accurate details.`, known: false },
        ]);
      }
    } else {
      const parsed = parseNotesToCards(notes);
      if (parsed.length === 0) {
        setCards([{ front: "No cards could be parsed", back: "Try using format: Term: Definition (one per line)", known: false }]);
      } else {
        setCards(parsed);
      }
    }
    setCurrentIdx(0);
    setFlipped(false);
  };

  const toggleKnown = (idx: number) => {
    setCards((prev) => prev.map((c, i) => i === idx ? { ...c, known: !c.known } : c));
  };

  const shuffleCards = () => {
    setCards((prev) => shuffle(prev));
    setCurrentIdx(0);
    setFlipped(false);
  };

  const progress = useMemo(() => {
    if (cards.length === 0) return { known: 0, unknown: 0, total: 0, pct: 0 };
    const known = cards.filter((c) => c.known).length;
    return { known, unknown: cards.length - known, total: cards.length, pct: Math.round((known / cards.length) * 100) };
  }, [cards]);

  const current = cards[currentIdx];

  return (
    <div className="space-y-6">
      <div className="flex gap-2 mb-4">
        <button onClick={() => setMode("topic")} className={mode === "topic" ? "btn-primary" : "btn-secondary"}>By Topic</button>
        <button onClick={() => setMode("notes")} className={mode === "notes" ? "btn-primary" : "btn-secondary"}>Paste Notes</button>
      </div>

      {mode === "topic" ? (
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Topic</label>
          <input className="calc-input" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., Photosynthesis, Newton's Laws, World War II" />
          <div className="flex gap-2 mt-2 flex-wrap">
            {Object.keys(topicCards).map((t) => (
              <button key={t} onClick={() => setTopic(t)} className="btn-secondary text-xs">{t}</button>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Paste Your Notes</label>
          <textarea className="calc-input min-h-[160px]" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={"Term: Definition\nConcept - Explanation\nOr plain sentences..."} />
        </div>
      )}

      <button onClick={generate} className="btn-primary">Generate Flashcards</button>

      {cards.length > 0 && current && (
        <div className="space-y-4">
          {/* Progress bar */}
          <div className="result-card">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress: {progress.known}/{progress.total} known ({progress.pct}%)</span>
              <span>Card {currentIdx + 1} of {cards.length}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full transition-all" style={{ width: `${progress.pct}%` }} />
            </div>
          </div>

          {/* Flashcard */}
          <div onClick={() => setFlipped(!flipped)} className="cursor-pointer min-h-[200px] result-card flex items-center justify-center text-center transition-all hover:shadow-lg" style={{ perspective: "1000px" }}>
            <div>
              <p className="text-xs font-medium text-gray-400 mb-3">{flipped ? "ANSWER" : "QUESTION"} (click to flip)</p>
              <p className="text-lg font-semibold text-gray-800">{flipped ? current.back : current.front}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-between items-center gap-3 flex-wrap">
            <button onClick={() => { setCurrentIdx(Math.max(0, currentIdx - 1)); setFlipped(false); }} disabled={currentIdx === 0} className="btn-secondary disabled:opacity-50">Previous</button>
            <div className="flex gap-2">
              <button onClick={() => toggleKnown(currentIdx)} className={current.known ? "btn-primary bg-green-600" : "btn-secondary"}>
                {current.known ? "Known" : "Mark as Known"}
              </button>
              <button onClick={shuffleCards} className="btn-secondary">Shuffle</button>
            </div>
            <button onClick={() => { setCurrentIdx(Math.min(cards.length - 1, currentIdx + 1)); setFlipped(false); }} disabled={currentIdx === cards.length - 1} className="btn-secondary disabled:opacity-50">Next</button>
          </div>

          {/* Card list */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {cards.map((c, i) => (
              <button key={i} onClick={() => { setCurrentIdx(i); setFlipped(false); }} className={`text-xs p-2 rounded border text-left ${i === currentIdx ? "border-indigo-500 bg-indigo-50" : c.known ? "border-green-300 bg-green-50" : "border-gray-200"}`}>
                {i + 1}. {c.front.substring(0, 30)}...
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
