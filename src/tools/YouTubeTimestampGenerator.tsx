"use client";
import { useState } from "react";

interface Timestamp {
  hours: number;
  minutes: number;
  seconds: number;
  description: string;
}

export default function YouTubeTimestampGenerator() {
  const [url, setUrl] = useState("");
  const [timestamps, setTimestamps] = useState<Timestamp[]>([
    { hours: 0, minutes: 0, seconds: 0, description: "Intro" },
  ]);
  const [copied, setCopied] = useState(false);

  const addTimestamp = () => {
    setTimestamps([...timestamps, { hours: 0, minutes: 0, seconds: 0, description: "" }]);
  };

  const removeTimestamp = (idx: number) => {
    setTimestamps(timestamps.filter((_, i) => i !== idx));
  };

  const updateTimestamp = (idx: number, field: keyof Timestamp, value: string | number) => {
    const updated = [...timestamps];
    if (field === "description") {
      updated[idx] = { ...updated[idx], [field]: value as string };
    } else {
      updated[idx] = { ...updated[idx], [field]: Number(value) };
    }
    setTimestamps(updated);
  };

  const formatTime = (ts: Timestamp) => {
    const mm = String(ts.minutes).padStart(2, "0");
    const ss = String(ts.seconds).padStart(2, "0");
    if (ts.hours > 0) {
      return `${ts.hours}:${mm}:${ss}`;
    }
    return `${ts.minutes}:${ss}`;
  };

  const generateOutput = () => {
    return timestamps
      .map((ts) => `${formatTime(ts)} ${ts.description}`)
      .join("\n");
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(generateOutput());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">YouTube Video URL (optional)</label>
        <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." className="calc-input" />
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-sm font-semibold text-gray-700">Timestamps</label>
          <button onClick={addTimestamp} className="btn-secondary text-sm">+ Add Timestamp</button>
        </div>

        {timestamps.map((ts, i) => (
          <div key={i} className="bg-white rounded-xl p-3 shadow-sm flex flex-wrap items-center gap-2">
            <input type="number" min={0} max={23} value={ts.hours} onChange={(e) => updateTimestamp(i, "hours", e.target.value)} className="calc-input w-16 text-center" placeholder="H" />
            <span className="font-bold text-gray-500">:</span>
            <input type="number" min={0} max={59} value={ts.minutes} onChange={(e) => updateTimestamp(i, "minutes", e.target.value)} className="calc-input w-16 text-center" placeholder="M" />
            <span className="font-bold text-gray-500">:</span>
            <input type="number" min={0} max={59} value={ts.seconds} onChange={(e) => updateTimestamp(i, "seconds", e.target.value)} className="calc-input w-16 text-center" placeholder="S" />
            <input type="text" value={ts.description} onChange={(e) => updateTimestamp(i, "description", e.target.value)} placeholder="Description" className="calc-input flex-1 min-w-[150px]" />
            {timestamps.length > 1 && (
              <button onClick={() => removeTimestamp(i)} className="btn-secondary text-sm text-red-500">Remove</button>
            )}
          </div>
        ))}
      </div>

      {timestamps.length > 0 && (
        <div className="result-card space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-800">Formatted Timestamps</h3>
            <button onClick={copyOutput} className="btn-primary text-sm">{copied ? "Copied!" : "Copy"}</button>
          </div>
          <pre className="bg-white rounded-xl p-4 shadow-sm text-sm text-gray-700 whitespace-pre-wrap font-mono">
            {generateOutput()}
          </pre>
        </div>
      )}
    </div>
  );
}
