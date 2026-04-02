"use client";
import { useState, useMemo } from "react";

type Rating = "highly-auspicious" | "auspicious" | "avoid";

interface MuhuratDate {
  date: string; // YYYY-MM-DD
  rating: Rating;
  note: string;
}

// Preset auspicious dates based on Hindu calendar for 2025-2027
// Avoids Amavasya, prefers Purnima, good nakshatras (Rohini, Mrigashira, Uttara Phalguni, Hasta, Swati, Anuradha, Uttara Ashadha, Uttara Bhadrapada, Revati)
const auspiciousDates: MuhuratDate[] = [
  // 2025
  { date: "2025-01-14", rating: "auspicious", note: "Makar Sankranti — Good muhurat" },
  { date: "2025-01-26", rating: "auspicious", note: "Purnima — Full Moon day" },
  { date: "2025-02-02", rating: "highly-auspicious", note: "Rohini Nakshatra — Excellent for marriage" },
  { date: "2025-02-12", rating: "highly-auspicious", note: "Basant Panchami — Very auspicious" },
  { date: "2025-02-14", rating: "auspicious", note: "Hasta Nakshatra — Good muhurat" },
  { date: "2025-02-23", rating: "auspicious", note: "Uttara Phalguni — Good for weddings" },
  { date: "2025-02-26", rating: "highly-auspicious", note: "Purnima — Full Moon day" },
  { date: "2025-03-02", rating: "auspicious", note: "Swati Nakshatra" },
  { date: "2025-03-08", rating: "highly-auspicious", note: "Maha Shivratri period — Holy muhurat" },
  { date: "2025-03-14", rating: "avoid", note: "Amavasya — New Moon, avoid weddings" },
  { date: "2025-03-28", rating: "auspicious", note: "Purnima — Full Moon" },
  { date: "2025-04-06", rating: "highly-auspicious", note: "Chaitra Navratri — Auspicious period" },
  { date: "2025-04-14", rating: "auspicious", note: "Baisakhi — Good muhurat" },
  { date: "2025-04-17", rating: "highly-auspicious", note: "Akshaya Tritiya — Highly auspicious" },
  { date: "2025-04-20", rating: "auspicious", note: "Uttara Bhadrapada Nakshatra" },
  { date: "2025-04-27", rating: "auspicious", note: "Purnima — Full Moon" },
  { date: "2025-05-02", rating: "highly-auspicious", note: "Rohini Nakshatra — Excellent muhurat" },
  { date: "2025-05-12", rating: "auspicious", note: "Revati Nakshatra" },
  { date: "2025-05-18", rating: "auspicious", note: "Uttara Phalguni — Good" },
  { date: "2025-05-26", rating: "auspicious", note: "Purnima" },
  { date: "2025-06-10", rating: "avoid", note: "Amavasya — Avoid" },
  { date: "2025-06-15", rating: "auspicious", note: "Hasta Nakshatra" },
  { date: "2025-06-25", rating: "auspicious", note: "Purnima" },
  { date: "2025-07-10", rating: "avoid", note: "Amavasya — Avoid" },
  { date: "2025-07-20", rating: "auspicious", note: "Anuradha Nakshatra" },
  { date: "2025-11-05", rating: "highly-auspicious", note: "Post-Diwali — Highly auspicious period" },
  { date: "2025-11-12", rating: "highly-auspicious", note: "Dev Uthani Ekadashi — Wedding season begins" },
  { date: "2025-11-15", rating: "auspicious", note: "Purnima — Full Moon" },
  { date: "2025-11-20", rating: "highly-auspicious", note: "Rohini Nakshatra — Excellent" },
  { date: "2025-11-26", rating: "highly-auspicious", note: "Mrigashira Nakshatra — Very good" },
  { date: "2025-12-02", rating: "highly-auspicious", note: "Uttara Ashadha — Prime wedding date" },
  { date: "2025-12-07", rating: "auspicious", note: "Revati Nakshatra" },
  { date: "2025-12-10", rating: "highly-auspicious", note: "Hasta Nakshatra — Excellent" },
  { date: "2025-12-15", rating: "auspicious", note: "Purnima" },
  { date: "2025-12-20", rating: "auspicious", note: "Swati Nakshatra" },
  // 2026
  { date: "2026-01-04", rating: "highly-auspicious", note: "Rohini Nakshatra" },
  { date: "2026-01-14", rating: "auspicious", note: "Makar Sankranti" },
  { date: "2026-01-18", rating: "highly-auspicious", note: "Uttara Phalguni" },
  { date: "2026-01-25", rating: "auspicious", note: "Hasta Nakshatra" },
  { date: "2026-01-29", rating: "avoid", note: "Amavasya — Avoid" },
  { date: "2026-02-01", rating: "highly-auspicious", note: "Basant Panchami — Very auspicious" },
  { date: "2026-02-08", rating: "auspicious", note: "Mrigashira Nakshatra" },
  { date: "2026-02-13", rating: "auspicious", note: "Purnima" },
  { date: "2026-02-16", rating: "highly-auspicious", note: "Anuradha Nakshatra — Good" },
  { date: "2026-02-22", rating: "highly-auspicious", note: "Uttara Bhadrapada — Excellent" },
  { date: "2026-02-27", rating: "avoid", note: "Amavasya — Avoid" },
  { date: "2026-03-06", rating: "auspicious", note: "Revati Nakshatra" },
  { date: "2026-03-14", rating: "auspicious", note: "Purnima" },
  { date: "2026-03-20", rating: "auspicious", note: "Uttara Phalguni" },
  { date: "2026-04-06", rating: "highly-auspicious", note: "Chaitra Navratri — Auspicious" },
  { date: "2026-04-14", rating: "auspicious", note: "Baisakhi" },
  { date: "2026-04-20", rating: "highly-auspicious", note: "Akshaya Tritiya — Highly auspicious" },
  { date: "2026-04-28", rating: "auspicious", note: "Purnima" },
  { date: "2026-05-05", rating: "highly-auspicious", note: "Rohini Nakshatra" },
  { date: "2026-05-15", rating: "auspicious", note: "Swati Nakshatra" },
  { date: "2026-05-27", rating: "auspicious", note: "Purnima" },
  { date: "2026-06-11", rating: "avoid", note: "Amavasya — Avoid" },
  { date: "2026-11-08", rating: "highly-auspicious", note: "Post-Diwali — Wedding season" },
  { date: "2026-11-14", rating: "highly-auspicious", note: "Dev Uthani Ekadashi" },
  { date: "2026-11-19", rating: "highly-auspicious", note: "Rohini Nakshatra — Excellent" },
  { date: "2026-11-25", rating: "auspicious", note: "Mrigashira Nakshatra" },
  { date: "2026-12-01", rating: "highly-auspicious", note: "Uttara Ashadha — Prime date" },
  { date: "2026-12-08", rating: "auspicious", note: "Hasta Nakshatra" },
  { date: "2026-12-14", rating: "auspicious", note: "Purnima" },
  { date: "2026-12-20", rating: "highly-auspicious", note: "Revati Nakshatra — Excellent" },
  // 2027
  { date: "2027-01-06", rating: "highly-auspicious", note: "Rohini Nakshatra" },
  { date: "2027-01-14", rating: "auspicious", note: "Makar Sankranti" },
  { date: "2027-01-20", rating: "auspicious", note: "Uttara Phalguni" },
  { date: "2027-01-28", rating: "avoid", note: "Amavasya — Avoid" },
  { date: "2027-02-02", rating: "highly-auspicious", note: "Basant Panchami" },
  { date: "2027-02-10", rating: "auspicious", note: "Mrigashira Nakshatra" },
  { date: "2027-02-16", rating: "highly-auspicious", note: "Purnima — Excellent" },
  { date: "2027-02-22", rating: "auspicious", note: "Anuradha Nakshatra" },
  { date: "2027-03-05", rating: "auspicious", note: "Uttara Bhadrapada" },
  { date: "2027-03-14", rating: "auspicious", note: "Purnima" },
  { date: "2027-04-08", rating: "highly-auspicious", note: "Chaitra Navratri" },
  { date: "2027-04-14", rating: "auspicious", note: "Baisakhi" },
  { date: "2027-04-22", rating: "highly-auspicious", note: "Akshaya Tritiya" },
  { date: "2027-05-08", rating: "highly-auspicious", note: "Rohini Nakshatra" },
  { date: "2027-05-18", rating: "auspicious", note: "Swati Nakshatra" },
  { date: "2027-11-10", rating: "highly-auspicious", note: "Post-Diwali — Wedding season begins" },
  { date: "2027-11-16", rating: "highly-auspicious", note: "Dev Uthani Ekadashi" },
  { date: "2027-11-22", rating: "highly-auspicious", note: "Rohini Nakshatra" },
  { date: "2027-11-28", rating: "auspicious", note: "Mrigashira Nakshatra" },
  { date: "2027-12-03", rating: "highly-auspicious", note: "Uttara Ashadha" },
  { date: "2027-12-10", rating: "auspicious", note: "Hasta Nakshatra" },
  { date: "2027-12-18", rating: "highly-auspicious", note: "Revati Nakshatra" },
  { date: "2027-12-24", rating: "auspicious", note: "Uttara Phalguni" },
];

const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const ratingStyles: Record<Rating, { bg: string; label: string; badge: string }> = {
  "highly-auspicious": { bg: "bg-green-50 border-green-300", label: "Highly Auspicious", badge: "bg-green-100 text-green-700" },
  auspicious: { bg: "bg-yellow-50 border-yellow-300", label: "Auspicious", badge: "bg-yellow-100 text-yellow-700" },
  avoid: { bg: "bg-red-50 border-red-300", label: "Avoid", badge: "bg-red-100 text-red-700" },
};

export default function WeddingDateFinder() {
  const [year, setYear] = useState(2025);
  const [month, setMonth] = useState(11); // November
  const [filterRating, setFilterRating] = useState<string>("all");

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const filtered = useMemo(() => {
    return auspiciousDates.filter((d) => {
      const dt = new Date(d.date);
      if (dt.getFullYear() !== year) return false;
      if (dt.getMonth() + 1 !== month) return false;
      if (filterRating !== "all" && d.rating !== filterRating) return false;
      return true;
    });
  }, [year, month, filterRating]);

  const stats = useMemo(() => {
    const monthDates = auspiciousDates.filter((d) => {
      const dt = new Date(d.date);
      return dt.getFullYear() === year && dt.getMonth() + 1 === month;
    });
    return {
      total: monthDates.length,
      highly: monthDates.filter((d) => d.rating === "highly-auspicious").length,
      auspicious: monthDates.filter((d) => d.rating === "auspicious").length,
      avoid: monthDates.filter((d) => d.rating === "avoid").length,
    };
  }, [year, month]);

  return (
    <div className="space-y-8">
      {/* Selectors */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Year</label>
            <select value={year} onChange={(e) => setYear(+e.target.value)} className="calc-input">
              <option value={2025}>2025</option>
              <option value={2026}>2026</option>
              <option value={2027}>2027</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Month</label>
            <select value={month} onChange={(e) => setMonth(+e.target.value)} className="calc-input">
              {months.map((m, i) => (
                <option key={i} value={i + 1}>{m}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Filter</label>
            <select value={filterRating} onChange={(e) => setFilterRating(e.target.value)} className="calc-input">
              <option value="all">All Dates</option>
              <option value="highly-auspicious">Highly Auspicious Only</option>
              <option value="auspicious">Auspicious Only</option>
              <option value="avoid">Dates to Avoid</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
          <div className="text-xs font-medium text-gray-500 mb-1">Total Dates</div>
          <div className="text-2xl font-extrabold text-indigo-600">{stats.total}</div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
          <div className="text-xs font-medium text-gray-500 mb-1">Highly Auspicious</div>
          <div className="text-2xl font-extrabold text-green-600">{stats.highly}</div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
          <div className="text-xs font-medium text-gray-500 mb-1">Auspicious</div>
          <div className="text-2xl font-extrabold text-yellow-600">{stats.auspicious}</div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
          <div className="text-xs font-medium text-gray-500 mb-1">Avoid</div>
          <div className="text-2xl font-extrabold text-red-500">{stats.avoid}</div>
        </div>
      </div>

      {/* Date List */}
      <div className="result-card space-y-3">
        <h3 className="text-lg font-bold text-gray-800">
          Shubh Muhurat — {months[month - 1]} {year}
        </h3>
        {filtered.length === 0 ? (
          <p className="text-center text-gray-400 py-8">No dates found for this month. Try selecting a peak wedding month (Nov-Feb, Apr-May).</p>
        ) : (
          <div className="space-y-3">
            {filtered.map((d) => {
              const dt = new Date(d.date);
              const day = dt.getDate();
              const weekday = weekdays[dt.getDay()];
              const style = ratingStyles[d.rating];
              return (
                <div key={d.date} className={`rounded-xl p-4 border ${style.bg} flex flex-col sm:flex-row sm:items-center gap-3`}>
                  <div className="flex items-center gap-3 flex-1">
                    <div className="text-3xl font-extrabold text-gray-800 w-12 text-center">{day}</div>
                    <div>
                      <div className="font-semibold text-gray-800">{weekday}</div>
                      <div className="text-sm text-gray-600">{d.note}</div>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${style.badge} whitespace-nowrap`}>
                    {d.rating === "highly-auspicious" ? "⭐ " : d.rating === "avoid" ? "⚠️ " : "✅ "}
                    {style.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="text-xs text-gray-400 text-center">
        Note: Dates are based on commonly referenced Hindu Panchang. Always consult a local pandit for exact muhurat timings.
      </div>
    </div>
  );
}
