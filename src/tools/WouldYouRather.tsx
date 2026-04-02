"use client";
import { useState, useMemo } from "react";

const questions: [string, string][] = [
  ["Be able to fly", "Be able to read minds"],
  ["Live without music", "Live without movies"],
  ["Have unlimited money", "Have unlimited time"],
  ["Be invisible", "Be able to teleport"],
  ["Speak every language", "Play every instrument"],
  ["Live in the mountains", "Live on the beach"],
  ["Always be 10 minutes late", "Always be 20 minutes early"],
  ["Have no phone for a year", "Have no internet for a year"],
  ["Be famous but poor", "Be unknown but rich"],
  ["Travel to the past", "Travel to the future"],
  ["Have a personal chef", "Have a personal driver"],
  ["Win the lottery once", "Live twice as long"],
  ["Be the smartest person", "Be the funniest person"],
  ["Have super strength", "Have super speed"],
  ["Only eat Indian food forever", "Never eat Indian food again"],
  ["Be stuck in traffic forever", "Have a slow internet forever"],
  ["Live without AC in summer", "Live without heater in winter"],
  ["Have a rewind button for life", "Have a pause button for life"],
  ["Know when you will die", "Know how you will die"],
  ["Be a famous actor", "Be a famous scientist"],
  ["Always have to tell the truth", "Always have to lie"],
  ["Have no taste buds", "Be color blind"],
  ["Live in Hogwarts", "Live in the MCU"],
  ["Be Batman", "Be Iron Man"],
  ["Have unlimited chai", "Have unlimited coffee"],
  ["Be a Bollywood star", "Be a cricket legend"],
  ["Eat only paneer", "Eat only dal for a year"],
  ["Have a photographic memory", "Be able to forget anything on demand"],
  ["Control fire", "Control water"],
  ["Be the CEO of Google", "Be the PM of India"],
  ["Lose your wallet", "Lose your phone"],
  ["Have 3 extra hours per day", "Have 3 extra days per week"],
  ["Always feel cold", "Always feel hot"],
  ["Give up social media", "Give up watching TV"],
  ["Be able to talk to animals", "Speak all human languages"],
  ["Live in a treehouse", "Live in a houseboat"],
  ["Have free WiFi everywhere", "Have free food everywhere"],
  ["Be a morning person", "Be a night owl forever"],
  ["Travel by train always", "Travel by plane always"],
  ["Win an Olympic gold", "Win a Nobel Prize"],
  ["Have 50 close friends", "Have 3 best friends"],
  ["Be extremely tall", "Be extremely short"],
  ["Eat only street food", "Eat only restaurant food"],
  ["Have the ability to cook perfectly", "Have the ability to fix anything"],
  ["Live in 1950s India", "Live in 2050s India"],
  ["Never get stuck in a queue again", "Never get stuck in traffic again"],
  ["Be a teacher", "Be a doctor"],
  ["Have a pet tiger", "Have a pet eagle"],
  ["Control your dreams", "Never need to sleep"],
  ["Be born into royalty", "Be self-made billionaire"],
];

function deterministicPercent(q: number, choice: number): number {
  const seed = (q * 17 + choice * 31 + 42) % 100;
  return Math.max(25, Math.min(75, seed));
}

export default function WouldYouRather() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answered, setAnswered] = useState<Record<number, number>>({});
  const [order] = useState(() => {
    const arr = questions.map((_, i) => i);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  });

  const qi = order[currentIndex % order.length];
  const q = questions[qi];
  const choice = answered[currentIndex];

  const stats = useMemo(() => {
    if (choice === undefined) return null;
    const p = deterministicPercent(qi, choice);
    return choice === 0 ? [p, 100 - p] : [100 - p, p];
  }, [qi, choice]);

  const totalAnswered = Object.keys(answered).length;

  const next = () => setCurrentIndex((i) => i + 1);
  const choose = (c: number) => setAnswered((prev) => ({ ...prev, [currentIndex]: c }));

  return (
    <div className="space-y-6">
      <div className="text-center text-sm text-gray-500">
        Question {currentIndex + 1} of {questions.length} | Answered: {totalAnswered}
      </div>

      <div className="result-card space-y-4">
        <h3 className="text-lg font-bold text-gray-800 text-center">Would You Rather...</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[0, 1].map((idx) => (
            <button
              key={idx}
              onClick={() => choice === undefined && choose(idx)}
              disabled={choice !== undefined}
              className={`p-6 rounded-xl border-2 text-center transition-all ${
                choice === idx
                  ? "border-blue-500 bg-blue-50 scale-105"
                  : choice !== undefined
                  ? "border-gray-200 bg-gray-50 opacity-70"
                  : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50 cursor-pointer"
              }`}
            >
              <p className="text-lg font-semibold text-gray-800">{q[idx]}</p>
              {stats && (
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${idx === choice ? "bg-blue-500" : "bg-gray-400"}`}
                      style={{ width: `${stats[idx]}%` }}
                    />
                  </div>
                  <p className="text-sm font-bold mt-1" style={{ color: idx === choice ? "#3b82f6" : "#6b7280" }}>
                    {stats[idx]}%
                  </p>
                </div>
              )}
            </button>
          ))}
        </div>

        {choice !== undefined && (
          <div className="text-center">
            <button onClick={next} className="btn-primary">Next Question</button>
          </div>
        )}
      </div>
    </div>
  );
}
