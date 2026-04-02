"use client";
import { useState } from "react";

export default function UnixTimestampConverter() {
  const [timestamp, setTimestamp] = useState(String(Math.floor(Date.now() / 1000)));
  const [dateStr, setDateStr] = useState("");

  const fromTimestamp = timestamp ? new Date(parseInt(timestamp) * 1000) : null;
  const toTimestamp = dateStr ? Math.floor(new Date(dateStr).getTime() / 1000) : null;
  const now = Math.floor(Date.now() / 1000);

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
        <div className="text-xs text-gray-500">Current Unix Timestamp</div>
        <div className="text-2xl font-extrabold text-indigo-600 font-mono">{now}</div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-gray-700">Timestamp → Date</h3>
          <input type="number" placeholder="Unix timestamp" value={timestamp} onChange={(e) => setTimestamp(e.target.value)} className="calc-input font-mono" />
          {fromTimestamp && !isNaN(fromTimestamp.getTime()) && (
            <div className="result-card">
              <div className="text-xs text-gray-500">Result</div>
              <div className="text-sm font-bold text-gray-800 mt-1">{fromTimestamp.toLocaleString("en-IN", { dateStyle: "full", timeStyle: "long" })}</div>
              <div className="text-xs text-gray-500 mt-1">UTC: {fromTimestamp.toUTCString()}</div>
            </div>
          )}
        </div>
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-gray-700">Date → Timestamp</h3>
          <input type="datetime-local" value={dateStr} onChange={(e) => setDateStr(e.target.value)} className="calc-input" />
          {toTimestamp && (
            <div className="result-card">
              <div className="flex justify-between"><div className="text-xs text-gray-500">Unix Timestamp</div><button onClick={() => navigator.clipboard?.writeText(String(toTimestamp))} className="text-xs text-indigo-600 hover:underline">Copy</button></div>
              <div className="text-2xl font-bold text-indigo-600 font-mono mt-1">{toTimestamp}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
