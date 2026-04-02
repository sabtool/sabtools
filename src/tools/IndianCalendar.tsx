"use client";
import { useState, useMemo } from "react";

interface Holiday {
  date: string; // MM-DD
  name: string;
  type: "national" | "festival" | "bank";
}

// Holidays data (fixed dates for 2025-2026; festival dates are approximate)
const HOLIDAYS_2025: Holiday[] = [
  // National Holidays
  { date: "01-26", name: "Republic Day", type: "national" },
  { date: "08-15", name: "Independence Day", type: "national" },
  { date: "10-02", name: "Gandhi Jayanti", type: "national" },
  // Major Festivals
  { date: "01-14", name: "Makar Sankranti / Pongal", type: "festival" },
  { date: "02-26", name: "Maha Shivaratri", type: "festival" },
  { date: "03-14", name: "Holi", type: "festival" },
  { date: "03-30", name: "Id-ul-Fitr (Eid)", type: "festival" },
  { date: "04-06", name: "Ram Navami", type: "festival" },
  { date: "04-10", name: "Mahavir Jayanti", type: "festival" },
  { date: "04-14", name: "Dr. Ambedkar Jayanti / Tamil New Year", type: "festival" },
  { date: "04-18", name: "Good Friday", type: "festival" },
  { date: "05-12", name: "Buddha Purnima", type: "festival" },
  { date: "06-07", name: "Id-ul-Zuha (Bakrid)", type: "festival" },
  { date: "07-06", name: "Muharram", type: "festival" },
  { date: "08-16", name: "Janmashtami", type: "festival" },
  { date: "08-27", name: "Ganesh Chaturthi", type: "festival" },
  { date: "09-05", name: "Milad-un-Nabi", type: "festival" },
  { date: "09-22", name: "Navratri Begins", type: "festival" },
  { date: "10-02", name: "Dussehra / Vijayadashami", type: "festival" },
  { date: "10-20", name: "Diwali", type: "festival" },
  { date: "10-21", name: "Govardhan Puja", type: "festival" },
  { date: "10-23", name: "Bhai Dooj", type: "festival" },
  { date: "11-05", name: "Guru Nanak Jayanti", type: "festival" },
  { date: "11-15", name: "Chhath Puja", type: "festival" },
  { date: "12-25", name: "Christmas", type: "festival" },
  // Bank Holidays
  { date: "01-01", name: "New Year's Day", type: "bank" },
  { date: "03-31", name: "Bank's Closing of Accounts", type: "bank" },
  { date: "04-01", name: "Bank's Annual Closing", type: "bank" },
  { date: "05-01", name: "May Day / Workers' Day", type: "bank" },
  { date: "08-15", name: "Independence Day", type: "bank" },
  { date: "09-07", name: "Onam", type: "festival" },
  { date: "11-01", name: "Kannada Rajyotsava / Kerala Piravi", type: "bank" },
];

const HOLIDAYS_2026: Holiday[] = [
  // National Holidays
  { date: "01-26", name: "Republic Day", type: "national" },
  { date: "08-15", name: "Independence Day", type: "national" },
  { date: "10-02", name: "Gandhi Jayanti", type: "national" },
  // Major Festivals
  { date: "01-14", name: "Makar Sankranti / Pongal", type: "festival" },
  { date: "02-15", name: "Maha Shivaratri", type: "festival" },
  { date: "03-04", name: "Holi", type: "festival" },
  { date: "03-20", name: "Id-ul-Fitr (Eid)", type: "festival" },
  { date: "03-27", name: "Ram Navami", type: "festival" },
  { date: "03-31", name: "Mahavir Jayanti", type: "festival" },
  { date: "04-03", name: "Good Friday", type: "festival" },
  { date: "04-14", name: "Dr. Ambedkar Jayanti / Tamil New Year", type: "festival" },
  { date: "05-01", name: "Buddha Purnima", type: "festival" },
  { date: "05-27", name: "Id-ul-Zuha (Bakrid)", type: "festival" },
  { date: "06-25", name: "Muharram", type: "festival" },
  { date: "08-06", name: "Janmashtami", type: "festival" },
  { date: "08-17", name: "Ganesh Chaturthi", type: "festival" },
  { date: "08-26", name: "Milad-un-Nabi", type: "festival" },
  { date: "09-12", name: "Navratri Begins", type: "festival" },
  { date: "09-21", name: "Dussehra / Vijayadashami", type: "festival" },
  { date: "10-09", name: "Diwali", type: "festival" },
  { date: "10-10", name: "Govardhan Puja", type: "festival" },
  { date: "10-12", name: "Bhai Dooj", type: "festival" },
  { date: "10-25", name: "Guru Nanak Jayanti", type: "festival" },
  { date: "11-04", name: "Chhath Puja", type: "festival" },
  { date: "12-25", name: "Christmas", type: "festival" },
  // Bank Holidays
  { date: "01-01", name: "New Year's Day", type: "bank" },
  { date: "03-31", name: "Bank's Closing of Accounts", type: "bank" },
  { date: "04-01", name: "Bank's Annual Closing", type: "bank" },
  { date: "05-01", name: "May Day / Workers' Day", type: "bank" },
  { date: "08-28", name: "Onam", type: "festival" },
  { date: "11-01", name: "Kannada Rajyotsava / Kerala Piravi", type: "bank" },
];

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const TYPE_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  national: { bg: "bg-orange-100", text: "text-orange-800", label: "National Holiday" },
  festival: { bg: "bg-purple-100", text: "text-purple-800", label: "Festival" },
  bank: { bg: "bg-blue-100", text: "text-blue-800", label: "Bank Holiday" },
};

export default function IndianCalendar() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const holidays = year === 2025 ? HOLIDAYS_2025 : HOLIDAYS_2026;

  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: (number | null)[] = [];

    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);

    return days;
  }, [year, month]);

  const getHolidaysForDay = (day: number) => {
    const mm = String(month + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    const key = `${mm}-${dd}`;
    return holidays.filter((h) => h.date === key);
  };

  const getHolidaysForMonth = () => {
    const mm = String(month + 1).padStart(2, "0");
    return holidays.filter((h) => h.date.startsWith(mm + "-")).sort((a, b) => a.date.localeCompare(b.date));
  };

  const selectedHolidays = selectedDate
    ? holidays.filter((h) => h.date === selectedDate)
    : null;

  const monthHolidays = getHolidaysForMonth();

  const goToPrev = () => {
    if (month === 0) { setMonth(11); setYear(year - 1); }
    else setMonth(month - 1);
  };

  const goToNext = () => {
    if (month === 11) { setMonth(0); setYear(year + 1); }
    else setMonth(month + 1);
  };

  const isToday = (day: number) =>
    day === now.getDate() && month === now.getMonth() && year === now.getFullYear();

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button onClick={goToPrev} className="btn-secondary">&larr; Prev</button>
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800">{MONTH_NAMES[month]} {year}</h2>
        </div>
        <button onClick={goToNext} className="btn-secondary">Next &rarr;</button>
      </div>

      {/* Year selector */}
      <div className="flex justify-center gap-2">
        {[2025, 2026].map((y) => (
          <button key={y} onClick={() => setYear(y)}
            className={y === year ? "btn-primary" : "btn-secondary"}>
            {y}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 justify-center">
        {Object.entries(TYPE_COLORS).map(([key, val]) => (
          <div key={key} className="flex items-center gap-1.5">
            <span className={`w-3 h-3 rounded-full ${val.bg} border`} />
            <span className="text-xs text-gray-600">{val.label}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-indigo-500 border" />
          <span className="text-xs text-gray-600">Today</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-7">
          {DAY_NAMES.map((d) => (
            <div key={d} className={`text-center py-2 text-xs font-bold ${d === "Sun" ? "text-red-500" : "text-gray-600"} bg-gray-50 border-b`}>
              {d}
            </div>
          ))}
          {calendarDays.map((day, i) => {
            if (day === null) return <div key={`empty-${i}`} className="p-2 border-b border-r border-gray-100" />;
            const dayHolidays = getHolidaysForDay(day);
            const isSunday = new Date(year, month, day).getDay() === 0;
            const mm = String(month + 1).padStart(2, "0");
            const dd = String(day).padStart(2, "0");
            const dateKey = `${mm}-${dd}`;

            return (
              <div
                key={day}
                onClick={() => setSelectedDate(dateKey === selectedDate ? null : dateKey)}
                className={`p-1.5 sm:p-2 border-b border-r border-gray-100 min-h-[50px] sm:min-h-[70px] cursor-pointer transition-colors
                  ${isToday(day) ? "bg-indigo-50 ring-2 ring-indigo-400 ring-inset" : ""}
                  ${selectedDate === dateKey ? "bg-yellow-50" : "hover:bg-gray-50"}
                `}
              >
                <div className={`text-sm font-bold ${isSunday ? "text-red-500" : "text-gray-800"} ${isToday(day) ? "text-indigo-700" : ""}`}>
                  {day}
                </div>
                <div className="flex flex-wrap gap-0.5 mt-0.5">
                  {dayHolidays.map((h, j) => (
                    <span key={j} className={`inline-block w-2 h-2 rounded-full ${TYPE_COLORS[h.type].bg} border`}
                      title={h.name} />
                  ))}
                </div>
                {dayHolidays.length > 0 && (
                  <div className="hidden sm:block text-[10px] leading-tight mt-0.5 text-gray-600 truncate">
                    {dayHolidays[0].name}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected date details */}
      {selectedHolidays && selectedHolidays.length > 0 && (
        <div className="result-card">
          <h3 className="text-sm font-bold text-gray-700 mb-2">
            Holidays on {selectedDate?.split("-")[1]}/{selectedDate?.split("-")[0]}/{year}
          </h3>
          <div className="space-y-2">
            {selectedHolidays.map((h, i) => (
              <div key={i} className={`flex items-center gap-2 p-2 rounded-lg ${TYPE_COLORS[h.type].bg}`}>
                <span className={`text-sm font-bold ${TYPE_COLORS[h.type].text}`}>{h.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${TYPE_COLORS[h.type].bg} ${TYPE_COLORS[h.type].text} border`}>
                  {TYPE_COLORS[h.type].label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Month's holidays list */}
      {monthHolidays.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h3 className="text-sm font-bold text-gray-700 mb-3">
            All Holidays in {MONTH_NAMES[month]} {year}
          </h3>
          <div className="space-y-2">
            {monthHolidays.map((h, i) => {
              const day = parseInt(h.date.split("-")[1]);
              const dayName = DAY_NAMES[new Date(year, month, day).getDay()];
              return (
                <div key={i} className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className={`w-2.5 h-2.5 rounded-full ${TYPE_COLORS[h.type].bg} border flex-shrink-0`} />
                    <span className="text-sm font-medium text-gray-800">{h.name}</span>
                  </div>
                  <span className="text-xs text-gray-500">{day} {MONTH_NAMES[month].slice(0, 3)} ({dayName})</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {monthHolidays.length === 0 && (
        <div className="text-center py-6 text-gray-400 text-sm">No holidays in {MONTH_NAMES[month]} {year}</div>
      )}
    </div>
  );
}
