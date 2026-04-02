"use client";
import { useState, useMemo } from "react";

interface Festival {
  name: string;
  date: string;
  type: "hindu" | "muslim" | "sikh" | "christian" | "national";
  description: string;
}

type ViewMode = "month" | "list";
type FestivalType = "all" | Festival["type"];

const TYPE_COLORS: Record<string, string> = {
  hindu: "bg-orange-100 text-orange-700",
  muslim: "bg-green-100 text-green-700",
  sikh: "bg-yellow-100 text-yellow-700",
  christian: "bg-blue-100 text-blue-700",
  national: "bg-purple-100 text-purple-700",
};

const TYPE_LABELS: Record<string, string> = {
  hindu: "Hindu", muslim: "Muslim", sikh: "Sikh", christian: "Christian", national: "National",
};

// Festival data for 2025-2030
const FESTIVALS: Festival[] = [
  // 2025
  { name: "Republic Day", date: "2025-01-26", type: "national", description: "India's Republic Day, commemorating the Constitution" },
  { name: "Vasant Panchami", date: "2025-02-02", type: "hindu", description: "Festival of Saraswati, onset of spring" },
  { name: "Maha Shivaratri", date: "2025-02-26", type: "hindu", description: "Night dedicated to Lord Shiva" },
  { name: "Holi", date: "2025-03-14", type: "hindu", description: "Festival of colors celebrating spring" },
  { name: "Ramadan Begins", date: "2025-03-01", type: "muslim", description: "Start of holy month of fasting" },
  { name: "Eid ul-Fitr", date: "2025-03-31", type: "muslim", description: "Celebration marking end of Ramadan" },
  { name: "Good Friday", date: "2025-04-18", type: "christian", description: "Crucifixion of Jesus Christ" },
  { name: "Easter", date: "2025-04-20", type: "christian", description: "Resurrection of Jesus Christ" },
  { name: "Baisakhi", date: "2025-04-13", type: "sikh", description: "Sikh New Year and harvest festival" },
  { name: "Ram Navami", date: "2025-04-06", type: "hindu", description: "Birthday of Lord Rama" },
  { name: "Buddha Purnima", date: "2025-05-12", type: "national", description: "Birth anniversary of Gautama Buddha" },
  { name: "Eid ul-Adha", date: "2025-06-07", type: "muslim", description: "Festival of sacrifice" },
  { name: "Muharram", date: "2025-06-27", type: "muslim", description: "Islamic New Year" },
  { name: "Independence Day", date: "2025-08-15", type: "national", description: "India's Independence Day" },
  { name: "Raksha Bandhan", date: "2025-08-09", type: "hindu", description: "Celebration of sibling bond" },
  { name: "Janmashtami", date: "2025-08-16", type: "hindu", description: "Birthday of Lord Krishna" },
  { name: "Milad-un-Nabi", date: "2025-09-05", type: "muslim", description: "Birthday of Prophet Muhammad" },
  { name: "Gandhi Jayanti", date: "2025-10-02", type: "national", description: "Mahatma Gandhi's birthday" },
  { name: "Navratri Begins", date: "2025-10-02", type: "hindu", description: "Nine nights of worship" },
  { name: "Dussehra", date: "2025-10-12", type: "hindu", description: "Victory of good over evil" },
  { name: "Diwali", date: "2025-10-20", type: "hindu", description: "Festival of lights" },
  { name: "Guru Nanak Jayanti", date: "2025-11-05", type: "sikh", description: "Birthday of Guru Nanak Dev Ji" },
  { name: "Christmas", date: "2025-12-25", type: "christian", description: "Birth of Jesus Christ" },
  // 2026
  { name: "Republic Day", date: "2026-01-26", type: "national", description: "India's Republic Day" },
  { name: "Maha Shivaratri", date: "2026-02-15", type: "hindu", description: "Night dedicated to Lord Shiva" },
  { name: "Holi", date: "2026-03-04", type: "hindu", description: "Festival of colors" },
  { name: "Eid ul-Fitr", date: "2026-03-20", type: "muslim", description: "End of Ramadan" },
  { name: "Ram Navami", date: "2026-03-26", type: "hindu", description: "Birthday of Lord Rama" },
  { name: "Baisakhi", date: "2026-04-13", type: "sikh", description: "Sikh New Year" },
  { name: "Good Friday", date: "2026-04-03", type: "christian", description: "Crucifixion of Jesus Christ" },
  { name: "Buddha Purnima", date: "2026-05-01", type: "national", description: "Birth of Gautama Buddha" },
  { name: "Eid ul-Adha", date: "2026-05-27", type: "muslim", description: "Festival of sacrifice" },
  { name: "Independence Day", date: "2026-08-15", type: "national", description: "India's Independence Day" },
  { name: "Raksha Bandhan", date: "2026-08-28", type: "hindu", description: "Sibling bond celebration" },
  { name: "Janmashtami", date: "2026-09-05", type: "hindu", description: "Birthday of Lord Krishna" },
  { name: "Gandhi Jayanti", date: "2026-10-02", type: "national", description: "Mahatma Gandhi's birthday" },
  { name: "Navratri Begins", date: "2026-09-21", type: "hindu", description: "Nine nights of worship" },
  { name: "Dussehra", date: "2026-10-01", type: "hindu", description: "Victory of good over evil" },
  { name: "Diwali", date: "2026-10-09", type: "hindu", description: "Festival of lights" },
  { name: "Guru Nanak Jayanti", date: "2026-10-25", type: "sikh", description: "Birthday of Guru Nanak Dev Ji" },
  { name: "Christmas", date: "2026-12-25", type: "christian", description: "Birth of Jesus Christ" },
  // 2027
  { name: "Republic Day", date: "2027-01-26", type: "national", description: "India's Republic Day" },
  { name: "Holi", date: "2027-03-22", type: "hindu", description: "Festival of colors" },
  { name: "Eid ul-Fitr", date: "2027-03-10", type: "muslim", description: "End of Ramadan" },
  { name: "Baisakhi", date: "2027-04-13", type: "sikh", description: "Sikh New Year" },
  { name: "Independence Day", date: "2027-08-15", type: "national", description: "India's Independence Day" },
  { name: "Gandhi Jayanti", date: "2027-10-02", type: "national", description: "Mahatma Gandhi's birthday" },
  { name: "Diwali", date: "2027-10-29", type: "hindu", description: "Festival of lights" },
  { name: "Christmas", date: "2027-12-25", type: "christian", description: "Birth of Jesus Christ" },
  // 2028
  { name: "Republic Day", date: "2028-01-26", type: "national", description: "India's Republic Day" },
  { name: "Holi", date: "2028-03-11", type: "hindu", description: "Festival of colors" },
  { name: "Eid ul-Fitr", date: "2028-02-27", type: "muslim", description: "End of Ramadan" },
  { name: "Baisakhi", date: "2028-04-13", type: "sikh", description: "Sikh New Year" },
  { name: "Independence Day", date: "2028-08-15", type: "national", description: "India's Independence Day" },
  { name: "Gandhi Jayanti", date: "2028-10-02", type: "national", description: "Mahatma Gandhi's birthday" },
  { name: "Diwali", date: "2028-10-17", type: "hindu", description: "Festival of lights" },
  { name: "Christmas", date: "2028-12-25", type: "christian", description: "Birth of Jesus Christ" },
  // 2029
  { name: "Republic Day", date: "2029-01-26", type: "national", description: "India's Republic Day" },
  { name: "Holi", date: "2029-03-01", type: "hindu", description: "Festival of colors" },
  { name: "Independence Day", date: "2029-08-15", type: "national", description: "India's Independence Day" },
  { name: "Gandhi Jayanti", date: "2029-10-02", type: "national", description: "Mahatma Gandhi's birthday" },
  { name: "Diwali", date: "2029-11-05", type: "hindu", description: "Festival of lights" },
  { name: "Christmas", date: "2029-12-25", type: "christian", description: "Birth of Jesus Christ" },
  // 2030
  { name: "Republic Day", date: "2030-01-26", type: "national", description: "India's Republic Day" },
  { name: "Holi", date: "2030-03-20", type: "hindu", description: "Festival of colors" },
  { name: "Independence Day", date: "2030-08-15", type: "national", description: "India's Independence Day" },
  { name: "Gandhi Jayanti", date: "2030-10-02", type: "national", description: "Mahatma Gandhi's birthday" },
  { name: "Diwali", date: "2030-10-26", type: "hindu", description: "Festival of lights" },
  { name: "Christmas", date: "2030-12-25", type: "christian", description: "Birth of Jesus Christ" },
];

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function IndianFestivalCalendar() {
  const [year, setYear] = useState(2025);
  const [filter, setFilter] = useState<FestivalType>("all");
  const [view, setView] = useState<ViewMode>("list");

  const filtered = useMemo(() => {
    return FESTIVALS.filter((f) => {
      const fYear = parseInt(f.date.split("-")[0]);
      if (fYear !== year) return false;
      if (filter !== "all" && f.type !== filter) return false;
      return true;
    }).sort((a, b) => a.date.localeCompare(b.date));
  }, [year, filter]);

  const now = new Date().toISOString().slice(0, 10);
  const nextFestival = useMemo(() => {
    return FESTIVALS.filter((f) => f.date >= now).sort((a, b) => a.date.localeCompare(b.date))[0];
  }, [now]);

  const byMonth = useMemo(() => {
    const map: Record<number, Festival[]> = {};
    filtered.forEach((f) => {
      const m = parseInt(f.date.split("-")[1]) - 1;
      if (!map[m]) map[m] = [];
      map[m].push(f);
    });
    return map;
  }, [filtered]);

  const dayName = (d: string) => {
    const dt = new Date(d + "T00:00:00");
    return dt.toLocaleDateString("en-IN", { weekday: "long" });
  };

  const formatDate = (d: string) => {
    const dt = new Date(d + "T00:00:00");
    return dt.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  const exportCalendar = () => {
    const text = filtered.map((f) => `${formatDate(f.date)} (${dayName(f.date)}) - ${f.name} [${TYPE_LABELS[f.type]}]\n${f.description}`).join("\n\n");
    const blob = new Blob([text], { type: "text/plain" });
    const link = document.createElement("a");
    link.download = `indian-festivals-${year}.txt`;
    link.href = URL.createObjectURL(blob);
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Next upcoming */}
      {nextFestival && (
        <div className="result-card bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200">
          <div className="text-xs text-indigo-500 font-semibold mb-1">Next Upcoming Festival</div>
          <div className="text-lg font-bold text-indigo-700">{nextFestival.name}</div>
          <div className="text-sm text-gray-600">{formatDate(nextFestival.date)} ({dayName(nextFestival.date)})</div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">Year</label>
          <select className="calc-input" value={year} onChange={(e) => setYear(+e.target.value)}>
            {[2025, 2026, 2027, 2028, 2029, 2030].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">Filter by Type</label>
          <select className="calc-input" value={filter} onChange={(e) => setFilter(e.target.value as FestivalType)}>
            <option value="all">All Festivals</option>
            <option value="hindu">Hindu</option>
            <option value="muslim">Muslim</option>
            <option value="sikh">Sikh</option>
            <option value="christian">Christian</option>
            <option value="national">National</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">View</label>
          <div className="flex gap-2">
            <button className={view === "list" ? "btn-primary" : "btn-secondary"} onClick={() => setView("list")}>List</button>
            <button className={view === "month" ? "btn-primary" : "btn-secondary"} onClick={() => setView("month")}>Monthly</button>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(TYPE_LABELS).map(([key, label]) => (
          <span key={key} className={`px-2 py-1 rounded text-xs font-medium ${TYPE_COLORS[key]}`}>{label}</span>
        ))}
      </div>

      {view === "list" ? (
        <div className="space-y-2">
          {filtered.length === 0 && <div className="text-sm text-gray-500 text-center py-8">No festivals found for the selected filters.</div>}
          {filtered.map((f, i) => (
            <div key={i} className="result-card flex items-start gap-3">
              <div className="text-center shrink-0 w-14">
                <div className="text-lg font-extrabold text-indigo-600">{f.date.split("-")[2]}</div>
                <div className="text-xs text-gray-500">{MONTHS[parseInt(f.date.split("-")[1]) - 1].slice(0, 3)}</div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-800">{f.name}</span>
                  <span className={`px-1.5 py-0.5 rounded text-xs ${TYPE_COLORS[f.type]}`}>{TYPE_LABELS[f.type]}</span>
                </div>
                <div className="text-xs text-gray-500">{dayName(f.date)} &middot; {f.description}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {MONTHS.map((month, mi) =>
            byMonth[mi] ? (
              <div key={mi}>
                <div className="text-sm font-bold text-gray-700 mb-2">{month} {year}</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {byMonth[mi].map((f, i) => (
                    <div key={i} className={`p-3 rounded-lg text-sm ${TYPE_COLORS[f.type]}`}>
                      <span className="font-bold">{f.date.split("-")[2]}</span> &mdash; {f.name}
                    </div>
                  ))}
                </div>
              </div>
            ) : null
          )}
        </div>
      )}

      <button className="btn-secondary" onClick={exportCalendar}>📥 Export Calendar</button>
    </div>
  );
}
