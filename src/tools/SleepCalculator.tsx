"use client";
import { useState, useMemo } from "react";

const CYCLE_MINUTES = 90;
const FALL_ASLEEP_MINUTES = 15;

function formatTime(h: number, m: number): string {
  const hh = ((h % 24) + 24) % 24;
  const period = hh >= 12 ? "PM" : "AM";
  const displayH = hh === 0 ? 12 : hh > 12 ? hh - 12 : hh;
  return `${displayH}:${m.toString().padStart(2, "0")} ${period}`;
}

function parseTimeInput(val: string): { h: number; m: number } | null {
  if (!val) return null;
  const [hStr, mStr] = val.split(":");
  const h = parseInt(hStr);
  const m = parseInt(mStr);
  if (isNaN(h) || isNaN(m)) return null;
  return { h, m };
}

export default function SleepCalculator() {
  const [mode, setMode] = useState<"wake" | "sleep">("wake");
  const [timeInput, setTimeInput] = useState("");

  const result = useMemo(() => {
    const parsed = parseTimeInput(timeInput);
    if (!parsed) return null;

    const times: { cycles: number; time: string; hours: number; quality: string; color: string }[] = [];

    if (mode === "wake") {
      // User wants to wake at X, show best bedtimes
      for (let cycles = 6; cycles >= 3; cycles--) {
        const totalMin = cycles * CYCLE_MINUTES + FALL_ASLEEP_MINUTES;
        let h = parsed.h - Math.floor(totalMin / 60);
        let m = parsed.m - (totalMin % 60);
        if (m < 0) { m += 60; h -= 1; }
        h = ((h % 24) + 24) % 24;
        const hours = (cycles * CYCLE_MINUTES) / 60;
        const quality = cycles >= 5 ? "Recommended" : cycles >= 4 ? "Good" : "Minimum";
        const color = cycles >= 5 ? "text-green-600" : cycles >= 4 ? "text-yellow-600" : "text-orange-600";
        times.push({ cycles, time: formatTime(h, m), hours, quality, color });
      }
    } else {
      // User sleeps at X, show best wake times
      for (let cycles = 3; cycles <= 6; cycles++) {
        const totalMin = cycles * CYCLE_MINUTES + FALL_ASLEEP_MINUTES;
        let h = parsed.h + Math.floor(totalMin / 60);
        let m = parsed.m + (totalMin % 60);
        if (m >= 60) { m -= 60; h += 1; }
        h = h % 24;
        const hours = (cycles * CYCLE_MINUTES) / 60;
        const quality = cycles >= 5 ? "Recommended" : cycles >= 4 ? "Good" : "Minimum";
        const color = cycles >= 5 ? "text-green-600" : cycles >= 4 ? "text-yellow-600" : "text-orange-600";
        times.push({ cycles, time: formatTime(h, m), hours, quality, color });
      }
    }

    return times;
  }, [mode, timeInput]);

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Mode</label>
        <div className="flex gap-2">
          <button onClick={() => setMode("wake")} className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${mode === "wake" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"}`}>
            I want to wake up at...
          </button>
          <button onClick={() => setMode("sleep")} className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${mode === "sleep" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"}`}>
            I&apos;m going to sleep at...
          </button>
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">
          {mode === "wake" ? "Wake Up Time" : "Bedtime"}
        </label>
        <input
          type="time"
          value={timeInput}
          onChange={(e) => setTimeInput(e.target.value)}
          className="calc-input"
        />
      </div>

      {result && (
        <div className="result-card space-y-4">
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-1">
              {mode === "wake" ? "Best Bedtimes" : "Best Wake-Up Times"}
            </div>
            <div className="text-xs text-gray-400">Based on 90-minute sleep cycles (includes 15 min to fall asleep)</div>
          </div>

          <div className="space-y-2">
            {result.map((item) => (
              <div key={item.cycles} className={`rounded-xl p-4 border ${item.cycles >= 5 ? "border-green-200 bg-green-50" : item.cycles >= 4 ? "border-yellow-200 bg-yellow-50" : "border-gray-100 bg-white"}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-extrabold text-gray-800">{item.time}</div>
                    <div className="text-xs text-gray-500">{item.cycles} cycles = {item.hours} hours of sleep</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-bold ${item.color}`}>{item.quality}</div>
                    {item.cycles >= 5 && <div className="text-xs text-green-500">Best choice</div>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-4">
            <div className="text-sm font-semibold text-gray-700 mb-2">Sleep Tips</div>
            <ul className="text-xs text-gray-500 space-y-1 list-disc list-inside">
              <li>Adults need 7-9 hours (5-6 cycles) of sleep per night</li>
              <li>Waking between cycles reduces grogginess</li>
              <li>Average time to fall asleep is about 15 minutes</li>
              <li>Maintain a consistent sleep schedule, even on weekends</li>
              <li>Avoid screens 30-60 minutes before bedtime</li>
              <li>Keep your room cool (18-22 degrees C) and dark</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
