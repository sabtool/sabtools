"use client";
import { useState, useMemo } from "react";

export default function NoticePeriodCalculator() {
  const [mode, setMode] = useState<"lwd" | "joining">("lwd");
  const [lastWorkingDay, setLastWorkingDay] = useState("");
  const [joiningDate, setJoiningDate] = useState("");
  const [noticePeriod, setNoticePeriod] = useState("30");
  const [monthlySalary, setMonthlySalary] = useState("");

  const result = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (mode === "lwd") {
      if (!lastWorkingDay) return null;
      const lwd = new Date(lastWorkingDay);
      const daysRemaining = Math.ceil((lwd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      const salary = parseFloat(monthlySalary) || 0;
      const dailySalary = salary / 30;
      const buyout = Math.max(0, daysRemaining) * dailySalary;

      // Generate calendar days
      const calendarDays: { date: Date; isNotice: boolean; isToday: boolean }[] = [];
      const start = new Date(today);
      start.setDate(1);
      const end = new Date(lwd);
      end.setMonth(end.getMonth() + 1, 0);
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dt = new Date(d);
        calendarDays.push({
          date: dt,
          isNotice: dt >= today && dt <= lwd,
          isToday: dt.getTime() === today.getTime(),
        });
      }

      return { lwd, daysRemaining: Math.max(0, daysRemaining), buyout, dailySalary, calendarDays, salary };
    } else {
      if (!joiningDate || !noticePeriod) return null;
      const joining = new Date(joiningDate);
      const np = parseInt(noticePeriod);
      const lwd = new Date(today);
      lwd.setDate(lwd.getDate() + np);
      const daysRemaining = np;
      const salary = parseFloat(monthlySalary) || 0;
      const dailySalary = salary / 30;
      const buyout = daysRemaining * dailySalary;

      const calendarDays: { date: Date; isNotice: boolean; isToday: boolean }[] = [];
      const start = new Date(today);
      start.setDate(1);
      const end = new Date(lwd);
      end.setMonth(end.getMonth() + 1, 0);
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dt = new Date(d);
        calendarDays.push({
          date: dt,
          isNotice: dt >= today && dt <= lwd,
          isToday: dt.getTime() === today.getTime(),
        });
      }

      return { lwd, daysRemaining, buyout, dailySalary, calendarDays, salary, joiningDate: joining };
    }
  }, [mode, lastWorkingDay, joiningDate, noticePeriod, monthlySalary]);

  const fmt = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
  const fmtDate = (d: Date) => d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });

  // Group calendar days by month
  const monthGroups = useMemo(() => {
    if (!result) return [];
    const groups: { month: string; days: typeof result.calendarDays }[] = [];
    for (const day of result.calendarDays) {
      const key = day.date.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
      const existing = groups.find(g => g.month === key);
      if (existing) existing.days.push(day);
      else groups.push({ month: key, days: [day] });
    }
    return groups;
  }, [result]);

  return (
    <div className="space-y-6">
      {/* Mode selector */}
      <div className="flex gap-2">
        <button onClick={() => setMode("lwd")} className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${mode === "lwd" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"}`}>
          I know my Last Working Day
        </button>
        <button onClick={() => setMode("joining")} className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${mode === "joining" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"}`}>
          Calculate from Notice Period
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {mode === "lwd" ? (
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">Last Working Day</label>
            <input type="date" value={lastWorkingDay} onChange={e => setLastWorkingDay(e.target.value)} className="calc-input" />
          </div>
        ) : (
          <>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-2">Joining Date (new company)</label>
              <input type="date" value={joiningDate} onChange={e => setJoiningDate(e.target.value)} className="calc-input" />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-2">Notice Period</label>
              <select value={noticePeriod} onChange={e => setNoticePeriod(e.target.value)} className="calc-input">
                {[15, 30, 45, 60, 90].map(d => <option key={d} value={d}>{d} Days</option>)}
              </select>
            </div>
          </>
        )}
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Monthly Salary (for buyout calc)</label>
          <input type="number" placeholder="e.g. 80000" value={monthlySalary} onChange={e => setMonthlySalary(e.target.value)} className="calc-input" />
        </div>
      </div>

      {result && (
        <div className="space-y-4">
          <div className="result-card grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Last Working Day</div>
              <div className="text-lg font-bold text-indigo-600">{fmtDate(result.lwd)}</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Days Remaining</div>
              <div className="text-2xl font-extrabold text-orange-600">{result.daysRemaining}</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Daily Salary</div>
              <div className="text-lg font-bold text-gray-700">{result.salary ? fmt(result.dailySalary) : "-"}</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Buyout Amount</div>
              <div className="text-xl font-extrabold text-red-600">{result.salary ? fmt(result.buyout) : "-"}</div>
            </div>
          </div>

          {/* Calendar View */}
          <div className="result-card">
            <h3 className="font-bold text-gray-800 mb-3">Notice Period Calendar</h3>
            {monthGroups.map(group => (
              <div key={group.month} className="mb-4">
                <h4 className="text-sm font-semibold text-gray-600 mb-2">{group.month}</h4>
                <div className="grid grid-cols-7 gap-1 text-center text-xs">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => <div key={d} className="font-semibold text-gray-400 py-1">{d}</div>)}
                  {/* Padding for first day */}
                  {Array.from({ length: group.days[0].date.getDay() }).map((_, i) => <div key={`pad-${i}`} />)}
                  {group.days.map((day, i) => (
                    <div key={i} className={`py-1.5 rounded-lg ${day.isToday ? "bg-indigo-600 text-white font-bold" : day.isNotice ? "bg-orange-100 text-orange-700 font-medium" : "text-gray-400"}`}>
                      {day.date.getDate()}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className="flex gap-4 text-xs mt-2">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-indigo-600 inline-block"></span> Today</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-orange-100 inline-block"></span> Notice Period</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
