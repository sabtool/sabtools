"use client";
import { useState, useMemo } from "react";

export default function DateDifferenceCalculator() {
  const [date1, setDate1] = useState("");
  const [date2, setDate2] = useState("");

  const result = useMemo(() => {
    if (!date1 || !date2) return null;
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const start = d1 < d2 ? d1 : d2;
    const end = d1 < d2 ? d2 : d1;

    const totalDays = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;

    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();
    if (days < 0) { months--; const prev = new Date(end.getFullYear(), end.getMonth(), 0); days += prev.getDate(); }
    if (months < 0) { years--; months += 12; }

    return { years, months, days, totalDays, totalWeeks, totalHours, totalMinutes };
  }, [date1, date2]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="text-sm font-semibold text-gray-700 block mb-2">Start Date</label><input type="date" value={date1} onChange={(e) => setDate1(e.target.value)} className="calc-input" /></div>
        <div><label className="text-sm font-semibold text-gray-700 block mb-2">End Date</label><input type="date" value={date2} onChange={(e) => setDate2(e.target.value)} className="calc-input" /></div>
      </div>
      {result && (
        <div className="space-y-4">
          <div className="result-card text-center">
            <div className="text-sm text-gray-500">Difference</div>
            <div className="text-3xl font-extrabold text-indigo-600 mt-1">
              {result.years > 0 && <>{result.years} <span className="text-lg text-gray-500">years</span> </>}
              {result.months > 0 && <>{result.months} <span className="text-lg text-gray-500">months</span> </>}
              {result.days} <span className="text-lg text-gray-500">days</span>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Total Days", value: result.totalDays.toLocaleString() },
              { label: "Total Weeks", value: result.totalWeeks.toLocaleString() },
              { label: "Total Hours", value: result.totalHours.toLocaleString() },
              { label: "Total Minutes", value: result.totalMinutes.toLocaleString() },
            ].map((item) => (
              <div key={item.label} className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
                <div className="text-xs text-gray-500">{item.label}</div>
                <div className="text-xl font-bold text-gray-800">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
