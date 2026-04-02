"use client";
import { useState, useEffect } from "react";

export default function CountdownTimer() {
  const [targetDate, setTargetDate] = useState("");
  const [diff, setDiff] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 });

  useEffect(() => {
    if (!targetDate) return;
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const total = target - now;
      if (total <= 0) { setDiff({ days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 }); return; }
      setDiff({
        days: Math.floor(total / (1000 * 60 * 60 * 24)),
        hours: Math.floor((total % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((total % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((total % (1000 * 60)) / 1000),
        total,
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="space-y-6">
      <div><label className="text-sm font-semibold text-gray-700 block mb-2">Select Target Date & Time</label><input type="datetime-local" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} className="calc-input max-w-xs" /></div>
      {targetDate && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Days", value: diff.days, color: "text-indigo-600" },
            { label: "Hours", value: diff.hours, color: "text-purple-600" },
            { label: "Minutes", value: diff.minutes, color: "text-blue-600" },
            { label: "Seconds", value: diff.seconds, color: "text-teal-600" },
          ].map((item) => (
            <div key={item.label} className="result-card text-center">
              <div className={`text-5xl font-extrabold ${item.color}`}>{String(item.value).padStart(2, "0")}</div>
              <div className="text-sm text-gray-500 mt-2">{item.label}</div>
            </div>
          ))}
        </div>
      )}
      {diff.total <= 0 && targetDate && <div className="text-center text-2xl font-bold text-green-600">🎉 Time is up!</div>}
    </div>
  );
}
