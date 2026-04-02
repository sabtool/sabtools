"use client";
import { useState, useMemo } from "react";

export default function AgeCalculator() {
  const [dob, setDob] = useState("");

  const result = useMemo(() => {
    if (!dob) return null;
    const birth = new Date(dob);
    const now = new Date();
    if (birth > now) return null;

    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    const totalDays = Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;
    const totalHours = totalDays * 24;

    const nextBirthday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday <= now) nextBirthday.setFullYear(now.getFullYear() + 1);
    const daysUntilBirthday = Math.ceil((nextBirthday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    return { years, months, days, totalDays, totalWeeks, totalMonths, totalHours, daysUntilBirthday };
  }, [dob]);

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Date of Birth</label>
        <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="calc-input max-w-xs" />
      </div>

      {result && (
        <div className="space-y-4">
          <div className="result-card">
            <div className="text-center mb-4">
              <div className="text-sm text-gray-500">Your Age</div>
              <div className="text-4xl font-extrabold text-indigo-600 mt-1">
                {result.years} <span className="text-lg text-gray-500">years</span>{" "}
                {result.months} <span className="text-lg text-gray-500">months</span>{" "}
                {result.days} <span className="text-lg text-gray-500">days</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Total Months", value: result.totalMonths.toLocaleString("en-IN") },
              { label: "Total Weeks", value: result.totalWeeks.toLocaleString("en-IN") },
              { label: "Total Days", value: result.totalDays.toLocaleString("en-IN") },
              { label: "Total Hours", value: result.totalHours.toLocaleString("en-IN") },
            ].map((item) => (
              <div key={item.label} className="bg-gray-50 rounded-xl p-4 text-center">
                <div className="text-xs font-medium text-gray-500">{item.label}</div>
                <div className="text-xl font-bold text-gray-800 mt-1">{item.value}</div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-4 text-center border border-pink-100">
            <span className="text-2xl">🎂</span>
            <div className="text-sm text-gray-600 mt-1">
              Next birthday in <span className="font-bold text-indigo-600">{result.daysUntilBirthday} days</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
