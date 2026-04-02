"use client";
import { useState, useMemo } from "react";

interface Card {
  id: number;
  front: string;
  back: string;
  known: boolean;
}

export default function FlashcardMaker() {
  const [cards, setCards] = useState<Card[]>([]);
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [mode, setMode] = useState<"edit" | "study">("edit");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [shuffled, setShuffled] = useState(false);

  const studyCards = useMemo(() => {
    const arr = [...cards];
    if (shuffled) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    }
    return arr;
  }, [cards, shuffled, mode]);

  const knownCount = useMemo(() => cards.filter((c) => c.known).length, [cards]);

  const addCard = () => {
    if (!front.trim() || !back.trim()) return;
    setCards((prev) => [...prev, { id: Date.now(), front: front.trim(), back: back.trim(), known: false }]);
    setFront("");
    setBack("");
  };

  const removeCard = (id: number) => setCards((prev) => prev.filter((c) => c.id !== id));

  const toggleKnown = (id: number) => {
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, known: !c.known } : c)));
  };

  const startStudy = () => {
    if (cards.length === 0) return;
    setMode("study");
    setCurrentIdx(0);
    setFlipped(false);
    setScore(0);
    setAnswered(0);
  };

  const markStudy = (correct: boolean) => {
    if (correct) setScore((s) => s + 1);
    setAnswered((a) => a + 1);
    const card = studyCards[currentIdx];
    if (correct) toggleKnown(card.id);
    nextCard();
  };

  const nextCard = () => {
    setFlipped(false);
    if (currentIdx < studyCards.length - 1) {
      setCurrentIdx((i) => i + 1);
    } else {
      setMode("edit");
    }
  };

  const exportCards = () => {
    const text = cards.map((c) => `Q: ${c.front}\nA: ${c.back}\nStatus: ${c.known ? "Known" : "Needs Practice"}`).join("\n\n");
    const blob = new Blob([text], { type: "text/plain" });
    const link = document.createElement("a");
    link.download = "flashcards.txt";
    link.href = URL.createObjectURL(blob);
    link.click();
  };

  if (mode === "study" && studyCards.length > 0) {
    const card = studyCards[currentIdx];
    const isFinished = answered > 0 && currentIdx >= studyCards.length - 1 && flipped;
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold text-gray-600">Card {currentIdx + 1} of {studyCards.length}</span>
          <span className="text-sm font-bold text-indigo-600">Score: {score}/{answered}</span>
          <button className="btn-secondary text-sm" onClick={() => setMode("edit")}>Back to Edit</button>
        </div>

        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${((currentIdx + 1) / studyCards.length) * 100}%` }} />
        </div>

        <div
          onClick={() => setFlipped(!flipped)}
          className="result-card cursor-pointer min-h-[200px] flex items-center justify-center text-center transition-all hover:shadow-lg"
        >
          <div>
            <div className="text-xs uppercase text-gray-400 mb-2">{flipped ? "Answer" : "Question"}</div>
            <div className="text-xl font-bold text-gray-800">{flipped ? card.back : card.front}</div>
            {!flipped && <div className="text-xs text-gray-400 mt-4">Click to flip</div>}
          </div>
        </div>

        {flipped && (
          <div className="flex gap-3 justify-center">
            <button className="btn-primary bg-green-500 hover:bg-green-600" onClick={() => markStudy(true)}>✅ Got it!</button>
            <button className="btn-secondary" onClick={() => markStudy(false)}>❌ Needs Practice</button>
          </div>
        )}

        {answered > 0 && currentIdx >= studyCards.length - 1 && flipped && (
          <div className="result-card text-center">
            <div className="text-lg font-bold text-indigo-600 mb-1">Study Complete!</div>
            <div className="text-2xl font-extrabold text-gray-800">{score}/{answered} correct</div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="result-card">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-gray-700">Progress</span>
          <span className="text-sm font-bold text-indigo-600">{knownCount}/{cards.length} mastered</span>
        </div>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: cards.length > 0 ? `${(knownCount / cards.length) * 100}%` : "0%" }} />
        </div>
      </div>

      {/* Add Card */}
      <div className="space-y-3">
        <input className="calc-input" placeholder="Front (Question / Term)" value={front} onChange={(e) => setFront(e.target.value)} />
        <input className="calc-input" placeholder="Back (Answer / Definition)" value={back} onChange={(e) => setBack(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addCard()} />
        <button className="btn-primary" onClick={addCard}>+ Add Card</button>
      </div>

      {/* Card List */}
      {cards.length > 0 && (
        <div className="space-y-2">
          {cards.map((c, i) => (
            <div key={c.id} className={`result-card flex justify-between items-center ${c.known ? "border-l-4 border-green-400" : "border-l-4 border-yellow-400"}`}>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-gray-800 truncate">{i + 1}. {c.front}</div>
                <div className="text-xs text-gray-500 truncate">{c.back}</div>
              </div>
              <div className="flex gap-2 ml-2 shrink-0">
                <button onClick={() => toggleKnown(c.id)} className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200">{c.known ? "✅ Known" : "📝 Practice"}</button>
                <button onClick={() => removeCard(c.id)} className="text-xs px-2 py-1 rounded bg-red-50 text-red-500 hover:bg-red-100">✕</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button className="btn-primary" onClick={startStudy} disabled={cards.length === 0}>📖 Study Mode</button>
        <button className="btn-secondary" onClick={() => setShuffled(!shuffled)}>{shuffled ? "🔀 Shuffle ON" : "➡️ Sequential"}</button>
        <button className="btn-secondary" onClick={exportCards} disabled={cards.length === 0}>📥 Export as Text</button>
      </div>
    </div>
  );
}
