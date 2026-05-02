"use client";
import { useState, useMemo } from "react";

/**
 * RBI Bank Holidays 2026 Calendar (India)
 *
 * Bank holidays are governed by the Negotiable Instruments Act, 1881 and
 * notified by the RBI per state/region. Holidays fall in three categories:
 *
 *  1. NATIONAL — observed pan-India (all branches)
 *  2. REGIONAL — observed only in specific states/cities
 *  3. WEEKEND — every Sunday + 2nd & 4th Saturday of the month
 *
 * Digital banking (UPI, NEFT, IMPS, ATM, internet banking) ALWAYS works
 * on holidays. Only branch banking, cheque clearing, and certain RTGS
 * cycles pause.
 *
 * Sources:
 *  - RBI Holiday Matrix (https://www.rbi.org.in/Scripts/HolidayMatrixDisplay.aspx)
 *  - https://cleartax.in/s/rbi-holidays-2026
 *  - https://www.bankbazaar.com/indian-holiday/rbi-holidays.html
 *  - Negotiable Instruments Act 1881
 *
 * Note: dates marked "regional" are observed in some states only — verify
 * with your branch. Lunar-calendar dates (Eid, Ramzan, Muharram) may shift
 * by a day depending on moon-sighting announcements.
 */

type Holiday = {
  date: string; // YYYY-MM-DD
  name: string;
  scope: "national" | "regional";
};

const HOLIDAYS_2026: Holiday[] = [
  // January
  { date: "2026-01-01", name: "New Year's Day", scope: "regional" },
  { date: "2026-01-14", name: "Makar Sankranti / Pongal / Magh Bihu", scope: "regional" },
  { date: "2026-01-15", name: "Uttarayana Punyakala / Pongal Day 2", scope: "regional" },
  { date: "2026-01-16", name: "Thiruvalluvar Day", scope: "regional" },
  { date: "2026-01-23", name: "Netaji Subhas Chandra Bose Jayanti / Saraswati Puja", scope: "regional" },
  { date: "2026-01-26", name: "Republic Day", scope: "national" },

  // February
  { date: "2026-02-19", name: "Chhatrapati Shivaji Maharaj Jayanti", scope: "regional" },
  { date: "2026-02-20", name: "Statehood Day (various NE states)", scope: "regional" },

  // March
  { date: "2026-03-02", name: "Holika Dahan", scope: "regional" },
  { date: "2026-03-03", name: "Holi (Day 2)", scope: "regional" },
  { date: "2026-03-04", name: "Holi / Dhuleti", scope: "regional" },
  { date: "2026-03-19", name: "Gudhi Padwa / Ugadi / Telugu New Year", scope: "regional" },
  { date: "2026-03-20", name: "Eid-ul-Fitr (Ramzan)", scope: "regional" },
  { date: "2026-03-26", name: "Ram Navami", scope: "regional" },
  { date: "2026-03-31", name: "Mahavir Jayanti", scope: "regional" },

  // April
  { date: "2026-04-01", name: "Banks' Annual Closing (Year-End)", scope: "national" },
  { date: "2026-04-03", name: "Good Friday", scope: "regional" },
  { date: "2026-04-14", name: "Dr Ambedkar Jayanti / Baisakhi", scope: "national" },
  { date: "2026-04-15", name: "Bengali New Year / Vishu", scope: "regional" },
  { date: "2026-04-16", name: "Bohag Bihu", scope: "regional" },
  { date: "2026-04-20", name: "Akshaya Tritiya / Basava Jayanti", scope: "regional" },

  // May
  { date: "2026-05-01", name: "Maharashtra Din / Labour Day / Buddha Purnima", scope: "regional" },
  { date: "2026-05-09", name: "Rabindranath Tagore Jayanti", scope: "regional" },
  { date: "2026-05-27", name: "Eid-ul-Adha (Bakri Eid)", scope: "regional" },

  // June
  { date: "2026-06-15", name: "Raja Sankranti / YMA Day", scope: "regional" },
  { date: "2026-06-25", name: "Muharram", scope: "regional" },
  { date: "2026-06-26", name: "Muharram (alternate)", scope: "regional" },

  // July
  { date: "2026-07-16", name: "Ratha Yatra", scope: "regional" },

  // August
  { date: "2026-08-15", name: "Independence Day / Parsi New Year", scope: "national" },
  { date: "2026-08-25", name: "Milad-un-Nabi / First Onam", scope: "regional" },
  { date: "2026-08-26", name: "Thiruvonam (Onam main day)", scope: "regional" },
  { date: "2026-08-28", name: "Raksha Bandhan", scope: "regional" },

  // September
  { date: "2026-09-04", name: "Janmashtami / Krishna Jayanti", scope: "regional" },
  { date: "2026-09-14", name: "Ganesh Chaturthi", scope: "regional" },
  { date: "2026-09-15", name: "Nuakhai (Odisha)", scope: "regional" },

  // October
  { date: "2026-10-02", name: "Mahatma Gandhi Jayanti", scope: "national" },
  { date: "2026-10-19", name: "Dussehra / Durga Puja Maha Saptami", scope: "regional" },
  { date: "2026-10-20", name: "Dussehra (Maha Ashtami)", scope: "regional" },
  { date: "2026-10-21", name: "Vijaya Dashami / Durga Puja", scope: "regional" },
  { date: "2026-10-29", name: "Karva Chauth", scope: "regional" },
  { date: "2026-10-31", name: "Sardar Vallabhbhai Patel Jayanti", scope: "regional" },

  // November
  { date: "2026-11-09", name: "Diwali / Lakshmi Puja", scope: "regional" },
  { date: "2026-11-10", name: "Bali Pratipada / Deepavali", scope: "regional" },
  { date: "2026-11-11", name: "Bhai Dooj", scope: "regional" },
  { date: "2026-11-16", name: "Chhath Puja", scope: "regional" },
  { date: "2026-11-24", name: "Guru Nanak Jayanti", scope: "regional" },
  { date: "2026-11-27", name: "Kanakadasa Jayanti", scope: "regional" },

  // December
  { date: "2026-12-19", name: "Goa Liberation Day", scope: "regional" },
  { date: "2026-12-25", name: "Christmas", scope: "national" },
  { date: "2026-12-26", name: "Christmas (Day 2)", scope: "regional" },
];

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function dayOfWeek(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][d.getDay()];
}

function isSecondOrFourthSaturday(year: number, month: number, day: number): boolean {
  const date = new Date(year, month, day);
  if (date.getDay() !== 6) return false;
  const weekOfMonth = Math.floor((day - 1) / 7) + 1;
  return weekOfMonth === 2 || weekOfMonth === 4;
}

export default function BankHolidays2026Calendar() {
  const [filter, setFilter] = useState<"all" | "national" | "regional">("all");
  const [searchTerm, setSearchTerm] = useState("");

  const grouped = useMemo(() => {
    const filtered = HOLIDAYS_2026.filter((h) => {
      if (filter !== "all" && h.scope !== filter) return false;
      if (
        searchTerm &&
        !h.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
        return false;
      return true;
    });

    const byMonth: Record<number, Holiday[]> = {};
    for (const h of filtered) {
      const m = parseInt(h.date.split("-")[1]) - 1;
      if (!byMonth[m]) byMonth[m] = [];
      byMonth[m].push(h);
    }
    return byMonth;
  }, [filter, searchTerm]);

  const stats = useMemo(() => {
    const national = HOLIDAYS_2026.filter((h) => h.scope === "national").length;
    const regional = HOLIDAYS_2026.filter((h) => h.scope === "regional").length;

    // Count 2nd & 4th Saturdays in 2026
    let saturdays = 0;
    for (let m = 0; m < 12; m++) {
      const daysInMonth = new Date(2026, m + 1, 0).getDate();
      for (let d = 1; d <= daysInMonth; d++) {
        if (isSecondOrFourthSaturday(2026, m, d)) saturdays++;
      }
    }

    return { national, regional, saturdays, sundays: 52 };
  }, []);

  return (
    <div className="space-y-6">
      <div className="inline-block bg-red-100 text-red-800 text-sm font-semibold px-4 py-1.5 rounded-full">
        🏦 RBI Bank Holidays 2026 · India
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-rose-600">{stats.national}</div>
          <div className="text-xs text-gray-500 mt-1">National Holidays</div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-blue-600">{stats.regional}</div>
          <div className="text-xs text-gray-500 mt-1">Regional Holidays</div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-emerald-600">{stats.sundays}</div>
          <div className="text-xs text-gray-500 mt-1">Sundays</div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-purple-600">{stats.saturdays}</div>
          <div className="text-xs text-gray-500 mt-1">2nd &amp; 4th Saturdays</div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">
            Filter by Scope
          </label>
          <div className="flex gap-2">
            {[
              { v: "all", l: "All" },
              { v: "national", l: "National only" },
              { v: "regional", l: "Regional only" },
            ].map((opt) => (
              <button
                key={opt.v}
                onClick={() => setFilter(opt.v as "all" | "national" | "regional")}
                className={`flex-1 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                  filter === opt.v
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {opt.l}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">
            Search Holiday
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="e.g. Diwali, Eid, Holi..."
            className="calc-input"
          />
        </div>
      </div>

      <div className="space-y-4">
        {Array.from({ length: 12 }).map((_, m) => {
          const holidays = grouped[m];
          if (!holidays || holidays.length === 0) return null;
          return (
            <div
              key={m}
              className="bg-white rounded-2xl shadow-sm overflow-hidden"
            >
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-3">
                <h3 className="font-bold">{MONTH_NAMES[m]} 2026</h3>
              </div>
              <div className="p-3">
                {holidays.map((h) => (
                  <div
                    key={h.date}
                    className="flex items-center justify-between py-2 px-2 border-b last:border-0"
                  >
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        {h.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {dayOfWeek(h.date)}, {h.date.split("-")[2]}{" "}
                        {MONTH_NAMES[m]}
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                        h.scope === "national"
                          ? "bg-rose-100 text-rose-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {h.scope.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs text-gray-700 leading-relaxed space-y-2">
        <strong>Bank holiday rules:</strong>
        <ul className="list-disc list-inside ml-2 space-y-1">
          <li>
            <strong>Weekly closures:</strong> All Sundays + 2nd &amp; 4th
            Saturdays. 1st, 3rd, 5th Saturdays are working.
          </li>
          <li>
            <strong>National holidays:</strong> Republic Day (26 Jan),
            Independence Day (15 Aug), Gandhi Jayanti (2 Oct), Banks&apos;
            Annual Closing (1 Apr), Christmas (25 Dec). Observed pan-India.
          </li>
          <li>
            <strong>Regional holidays:</strong> Festivals like Diwali, Holi,
            Pongal, Onam, Eid, Ganesh Chaturthi etc. observed only in states
            where the festival is celebrated.
          </li>
          <li>
            <strong>Digital banking</strong> (UPI, NEFT, IMPS, ATM, internet
            banking) works on bank holidays. Only branch banking and cheque
            clearing pause.
          </li>
          <li>
            <strong>RTGS</strong> works 24×7 since 14 Dec 2020 — no holiday
            impact.
          </li>
        </ul>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-800 leading-relaxed">
        <span className="mr-1">ℹ️</span>
        <strong>Disclaimer:</strong> Many festival dates (Eid, Ramzan,
        Muharram) follow lunar calendars and may shift by a day with
        moon-sighting announcements. Regional holiday observance varies
        between states — always confirm with your branch or check the
        official RBI Holiday Matrix at{" "}
        <a
          href="https://www.rbi.org.in/Scripts/HolidayMatrixDisplay.aspx"
          target="_blank"
          rel="noopener noreferrer"
          className="underline font-semibold text-blue-700 hover:text-blue-900"
        >
          rbi.org.in
        </a>
        .
      </div>
    </div>
  );
}
