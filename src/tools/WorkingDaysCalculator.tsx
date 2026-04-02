"use client";
import { useState, useMemo } from "react";

export default function WorkingDaysCalculator() {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const result = useMemo(() => {
    if (!start || !end) return null;
    const s = new Date(start);
    const e = new Date(end);
    if (s > e) return null;
    let working = 0, weekends = 0, total = 0;
    const cur = new Date(s);
    while (cur <= e) {
      total++;
      const day = cur.getDay();
      if (day === 0 || day === 6) weekends++;
      else working++;
      cur.setDate(cur.getDate() + 1);
    }
    return { working, weekends, total };
  }, [start, end]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="text-sm font-semibold text-gray-700 block mb-2">Start Date</label><input type="date" value={start} onChange={(e) => setStart(e.target.value)} className="calc-input" /></div>
        <div><label className="text-sm font-semibold text-gray-700 block mb-2">End Date</label><input type="date" value={end} onChange={(e) => setEnd(e.target.value)} className="calc-input" /></div>
      </div>
      {result && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="result-card text-center"><div className="text-xs text-gray-500">Working Days</div><div className="text-3xl font-extrabold text-indigo-600">{result.working}</div></div>
          <div className="result-card text-center"><div className="text-xs text-gray-500">Weekend Days</div><div className="text-3xl font-extrabold text-orange-600">{result.weekends}</div></div>
          <div className="result-card text-center"><div className="text-xs text-gray-500">Total Days</div><div className="text-3xl font-extrabold text-gray-800">{result.total}</div></div>
        </div>
      )}
    </div>
  );
}
