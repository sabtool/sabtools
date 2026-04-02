"use client";
import { useState, useEffect, useRef, useCallback } from "react";

const PARAGRAPHS = [
  "The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump. The five boxing wizards jump quickly at dawn.",
  "Technology is best when it brings people together. Innovation distinguishes between a leader and a follower. The advance of technology is based on making it fit in so that you do not really even notice it.",
  "Success is not final and failure is not fatal. It is the courage to continue that counts. The only way to do great work is to love what you do. Stay hungry and stay foolish always.",
  "Programming is the art of telling another human what one wants the computer to do. Code is like humor. When you have to explain it then it is bad. First solve the problem then write the code.",
  "India is a land of diverse cultures and traditions. From the snow capped Himalayas to the sunny beaches of Goa every corner tells a unique story. Unity in diversity is what makes India truly incredible.",
];

export default function TypingSpeedTest() {
  const [paragraph, setParagraph] = useState("");
  const [input, setInput] = useState("");
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const pickParagraph = useCallback(() => {
    setParagraph(PARAGRAPHS[Math.floor(Math.random() * PARAGRAPHS.length)]);
  }, []);

  useEffect(() => { pickParagraph(); }, [pickParagraph]);

  useEffect(() => {
    if (started && !finished) {
      timerRef.current = setInterval(() => {
        setElapsed(Date.now() - startTime);
      }, 100);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [started, finished, startTime]);

  const getStats = useCallback(() => {
    const chars = input.length;
    let correct = 0;
    for (let i = 0; i < chars; i++) {
      if (input[i] === paragraph[i]) correct++;
    }
    const errors = chars - correct;
    const accuracy = chars > 0 ? (correct / chars) * 100 : 0;
    const minutes = elapsed / 60000;
    const words = correct / 5;
    const wpm = minutes > 0 ? Math.round(words / minutes) : 0;
    return { wpm, accuracy, errors, correct, chars };
  }, [input, paragraph, elapsed]);

  const handleInput = (val: string) => {
    if (finished) return;
    if (!started) {
      setStarted(true);
      setStartTime(Date.now());
    }
    if (val.length <= paragraph.length) {
      setInput(val);
    }
    if (val.length === paragraph.length) {
      setFinished(true);
      setElapsed(Date.now() - (startTime || Date.now()));
    }
  };

  const reset = () => {
    setInput("");
    setStarted(false);
    setFinished(false);
    setElapsed(0);
    setStartTime(0);
    pickParagraph();
    if (timerRef.current) clearInterval(timerRef.current);
    inputRef.current?.focus();
  };

  const stats = getStats();
  const timeSeconds = (elapsed / 1000).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Paragraph display */}
      <div className="result-card">
        <p className="text-lg leading-relaxed font-mono tracking-wide select-none">
          {paragraph.split("").map((char, i) => {
            let cls = "text-gray-400";
            if (i < input.length) {
              cls = input[i] === char ? "text-green-600 bg-green-50" : "text-red-600 bg-red-100";
            } else if (i === input.length) {
              cls = "text-gray-800 border-b-2 border-indigo-500";
            }
            return <span key={i} className={cls}>{char}</span>;
          })}
        </p>
      </div>

      {/* Input area */}
      <textarea
        ref={inputRef}
        value={input}
        onChange={(e) => handleInput(e.target.value)}
        placeholder="Start typing here..."
        disabled={finished}
        className="calc-input !h-28 font-mono resize-none"
        autoFocus
        onPaste={(e) => e.preventDefault()}
      />

      {/* Real-time stats */}
      {started && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white rounded-xl p-3 text-center shadow-sm border">
            <div className="text-xs font-medium text-gray-500">WPM</div>
            <div className="text-2xl font-extrabold text-indigo-600">{stats.wpm}</div>
          </div>
          <div className="bg-white rounded-xl p-3 text-center shadow-sm border">
            <div className="text-xs font-medium text-gray-500">Accuracy</div>
            <div className="text-2xl font-extrabold text-green-600">{stats.accuracy.toFixed(1)}%</div>
          </div>
          <div className="bg-white rounded-xl p-3 text-center shadow-sm border">
            <div className="text-xs font-medium text-gray-500">Errors</div>
            <div className="text-2xl font-extrabold text-red-500">{stats.errors}</div>
          </div>
          <div className="bg-white rounded-xl p-3 text-center shadow-sm border">
            <div className="text-xs font-medium text-gray-500">Time</div>
            <div className="text-2xl font-extrabold text-gray-700">{timeSeconds}s</div>
          </div>
        </div>
      )}

      {/* Final result */}
      {finished && (
        <div className="result-card text-center space-y-4">
          <div className="text-2xl font-bold text-indigo-600">Test Complete!</div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-xs text-gray-500">Speed</div>
              <div className="text-3xl font-extrabold text-indigo-600">{stats.wpm}</div>
              <div className="text-xs text-gray-400">WPM</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Accuracy</div>
              <div className="text-3xl font-extrabold text-green-600">{stats.accuracy.toFixed(1)}%</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Time</div>
              <div className="text-3xl font-extrabold text-gray-700">{timeSeconds}s</div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-center">
        <button onClick={reset} className="btn-primary">
          {finished ? "Try Again" : "New Paragraph"}
        </button>
      </div>
    </div>
  );
}
