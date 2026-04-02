"use client";
import { useState, useEffect, useRef, useCallback } from "react";

type Mode = "work" | "break" | "longBreak";

const DURATIONS: Record<Mode, number> = {
  work: 25 * 60,
  break: 5 * 60,
  longBreak: 15 * 60,
};

const MODE_LABELS: Record<Mode, string> = {
  work: "Work",
  break: "Short Break",
  longBreak: "Long Break",
};

const MODE_COLORS: Record<Mode, string> = {
  work: "#6366f1",
  break: "#22c55e",
  longBreak: "#3b82f6",
};

export default function PomodoroTimer() {
  const [mode, setMode] = useState<Mode>("work");
  const [timeLeft, setTimeLeft] = useState(DURATIONS.work);
  const [running, setRunning] = useState(false);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const playSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 800;
      gain.gain.value = 0.3;
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
      setTimeout(() => {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.frequency.value = 1000;
        gain2.gain.value = 0.3;
        osc2.start();
        osc2.stop(ctx.currentTime + 0.3);
      }, 400);
    } catch {
      // Audio not available
    }
  }, [soundEnabled]);

  useEffect(() => {
    if (running && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && running) {
      setRunning(false);
      playSound();
      if (mode === "work") {
        setCompletedPomodoros((prev) => prev + 1);
      }
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, timeLeft, mode, playSound]);

  const switchMode = (newMode: Mode) => {
    setRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setMode(newMode);
    setTimeLeft(DURATIONS[newMode]);
  };

  const toggleRunning = () => setRunning(!running);

  const resetTimer = () => {
    setRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimeLeft(DURATIONS[mode]);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const totalTime = DURATIONS[mode];
  const progress = ((totalTime - timeLeft) / totalTime) * 100;
  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="space-y-6 text-center">
      {/* Mode selector */}
      <div className="flex gap-2 justify-center flex-wrap">
        {(["work", "break", "longBreak"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => switchMode(m)}
            className={`px-5 py-2 rounded-xl text-sm font-semibold transition ${
              mode === m ? "text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            style={mode === m ? { backgroundColor: MODE_COLORS[m] } : {}}
          >
            {MODE_LABELS[m]}
          </button>
        ))}
      </div>

      {/* Timer circle */}
      <div className="relative w-56 h-56 mx-auto">
        <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
          <circle cx="100" cy="100" r="90" fill="none" stroke="#e5e7eb" strokeWidth="8" />
          <circle
            cx="100" cy="100" r="90"
            fill="none"
            stroke={MODE_COLORS[mode]}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-5xl font-extrabold font-mono text-gray-800">
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </div>
          <div className="text-sm font-medium mt-1" style={{ color: MODE_COLORS[mode] }}>
            {MODE_LABELS[mode]}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-3">
        <button onClick={toggleRunning} className="btn-primary !px-8">
          {running ? "Pause" : timeLeft === DURATIONS[mode] ? "Start" : "Resume"}
        </button>
        <button onClick={resetTimer} className="btn-secondary !px-8">Reset</button>
      </div>

      {/* Sound toggle */}
      <div className="flex justify-center">
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
            soundEnabled ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
          }`}
        >
          Sound: {soundEnabled ? "ON" : "OFF"}
        </button>
      </div>

      {/* Timer complete message */}
      {timeLeft === 0 && (
        <div className="result-card text-center">
          <div className="text-2xl font-bold" style={{ color: MODE_COLORS[mode] }}>
            {mode === "work" ? "Great work! Time for a break." : "Break over! Ready to focus?"}
          </div>
          <div className="flex justify-center gap-3 mt-3">
            {mode === "work" ? (
              <>
                <button onClick={() => switchMode(completedPomodoros % 4 === 0 ? "longBreak" : "break")} className="btn-primary">
                  Start Break
                </button>
              </>
            ) : (
              <button onClick={() => switchMode("work")} className="btn-primary">
                Start Working
              </button>
            )}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="result-card">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-3 text-center shadow-sm border">
            <div className="text-xs font-medium text-gray-500">Completed Pomodoros</div>
            <div className="text-3xl font-extrabold text-indigo-600">{completedPomodoros}</div>
          </div>
          <div className="bg-white rounded-xl p-3 text-center shadow-sm border">
            <div className="text-xs font-medium text-gray-500">Focus Time</div>
            <div className="text-3xl font-extrabold text-green-600">{completedPomodoros * 25}m</div>
          </div>
        </div>
      </div>
    </div>
  );
}
