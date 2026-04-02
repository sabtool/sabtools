"use client";
import { useState, useMemo } from "react";

const zones = ["Asia/Kolkata","America/New_York","America/Los_Angeles","America/Chicago","Europe/London","Europe/Paris","Europe/Berlin","Asia/Tokyo","Asia/Shanghai","Asia/Dubai","Australia/Sydney","Pacific/Auckland","Asia/Singapore","America/Toronto","Asia/Hong_Kong"];

export default function TimezoneConverter() {
  const [time, setTime] = useState("");
  const [fromZone, setFromZone] = useState("Asia/Kolkata");

  const results = useMemo(() => {
    if (!time) return [];
    const [h, m] = time.split(":").map(Number);
    const now = new Date();
    now.setHours(h, m, 0, 0);
    return zones.map((tz) => {
      try {
        const converted = now.toLocaleString("en-US", { timeZone: tz, hour: "2-digit", minute: "2-digit", hour12: true });
        const date = now.toLocaleString("en-US", { timeZone: tz, weekday: "short", month: "short", day: "numeric" });
        return { zone: tz, time: converted, date };
      } catch { return { zone: tz, time: "N/A", date: "" }; }
    });
  }, [time, fromZone]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="text-sm font-semibold text-gray-700 block mb-2">Time</label><input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="calc-input" /></div>
        <div><label className="text-sm font-semibold text-gray-700 block mb-2">From Timezone</label><select value={fromZone} onChange={(e) => setFromZone(e.target.value)} className="calc-input">{zones.map((z) => <option key={z} value={z}>{z.replace(/_/g, " ")}</option>)}</select></div>
      </div>
      {results.length > 0 && (
        <div className="table-responsive"><table><thead><tr><th>Timezone</th><th>Time</th><th>Date</th></tr></thead><tbody>{results.map((r) => (
          <tr key={r.zone} className={r.zone === fromZone ? "bg-indigo-50 font-bold" : ""}><td>{r.zone.replace(/_/g, " ")}</td><td className="text-indigo-600 font-semibold">{r.time}</td><td>{r.date}</td></tr>
        ))}</tbody></table></div>
      )}
    </div>
  );
}
