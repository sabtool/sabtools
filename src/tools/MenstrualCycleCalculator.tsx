"use client";
import { useState, useMemo } from "react";

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function formatShort(d: Date): string {
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

interface CycleInfo {
  periodStart: Date;
  periodEnd: Date;
  fertileStart: Date;
  fertileEnd: Date;
  ovulation: Date;
}

export default function MenstrualCycleCalculator() {
  const [lastPeriod, setLastPeriod] = useState("");
  const [cycleLength, setCycleLength] = useState("28");
  const [periodLength, setPeriodLength] = useState("5");

  const result = useMemo(() => {
    if (!lastPeriod) return null;
    const lp = new Date(lastPeriod);
    if (isNaN(lp.getTime())) return null;

    const cl = parseInt(cycleLength) || 28;
    const pl = parseInt(periodLength) || 5;

    // Generate next 3 cycles
    const cycles: CycleInfo[] = [];
    for (let i = 0; i < 3; i++) {
      const periodStart = addDays(lp, cl * (i + 1));
      const periodEnd = addDays(periodStart, pl - 1);
      const ovulation = addDays(periodStart, -14 + cl); // actually from next cycle start
      // Ovulation is typically 14 days before next period
      const ovulationDay = addDays(lp, cl * (i + 1) - 14);
      const fertileStart = addDays(ovulationDay, -5);
      const fertileEnd = addDays(ovulationDay, 1);

      cycles.push({
        periodStart,
        periodEnd,
        fertileStart,
        fertileEnd,
        ovulation: ovulationDay,
      });
    }

    // Current cycle info
    const nextPeriod = addDays(lp, cl);
    const currentOvulation = addDays(lp, cl - 14);
    const currentFertileStart = addDays(currentOvulation, -5);
    const currentFertileEnd = addDays(currentOvulation, 1);

    // Calendar: generate 3 months of days
    const calendarMonths: { month: string; days: { date: Date; type: "period" | "fertile" | "ovulation" | "safe" | "empty" }[] }[] = [];
    const startMonth = new Date(lp.getFullYear(), lp.getMonth(), 1);

    for (let m = 0; m < 3; m++) {
      const monthDate = new Date(startMonth.getFullYear(), startMonth.getMonth() + m, 1);
      const monthName = monthDate.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
      const daysInMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate();
      const firstDay = monthDate.getDay();

      const days: { date: Date; type: "period" | "fertile" | "ovulation" | "safe" | "empty" }[] = [];

      // Empty slots for alignment
      for (let e = 0; e < firstDay; e++) {
        days.push({ date: new Date(0), type: "empty" });
      }

      for (let d = 1; d <= daysInMonth; d++) {
        const date = new Date(monthDate.getFullYear(), monthDate.getMonth(), d);
        let type: "period" | "fertile" | "ovulation" | "safe" = "safe";

        // Check against all cycles including current
        const allPeriodStarts = [lp, ...cycles.map((c) => c.periodStart)];
        const allOvulations = [currentOvulation, ...cycles.map((c) => c.ovulation)];
        const allFertileStarts = [currentFertileStart, ...cycles.map((c) => c.fertileStart)];
        const allFertileEnds = [currentFertileEnd, ...cycles.map((c) => c.fertileEnd)];

        for (let i = 0; i < allPeriodStarts.length; i++) {
          const ps = allPeriodStarts[i];
          const pe = addDays(ps, pl - 1);
          if (date >= ps && date <= pe) { type = "period"; break; }
        }
        if (type === "safe") {
          for (let i = 0; i < allOvulations.length; i++) {
            if (date.toDateString() === allOvulations[i].toDateString()) { type = "ovulation"; break; }
          }
        }
        if (type === "safe") {
          for (let i = 0; i < allFertileStarts.length; i++) {
            if (date >= allFertileStarts[i] && date <= allFertileEnds[i]) { type = "fertile"; break; }
          }
        }

        days.push({ date, type });
      }
      calendarMonths.push({ month: monthName, days });
    }

    return { nextPeriod, currentOvulation, currentFertileStart, currentFertileEnd, cycles, calendarMonths };
  }, [lastPeriod, cycleLength, periodLength]);

  const typeColors: Record<string, string> = {
    period: "bg-red-400 text-white",
    fertile: "bg-green-300 text-green-900",
    ovulation: "bg-purple-500 text-white",
    safe: "bg-gray-50 text-gray-700",
    empty: "",
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Last Period Start Date</label>
          <input type="date" value={lastPeriod} onChange={(e) => setLastPeriod(e.target.value)} className="calc-input" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Cycle Length (days)</label>
          <input type="number" placeholder="28" value={cycleLength} onChange={(e) => setCycleLength(e.target.value)} className="calc-input" min="21" max="40" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Period Length (days)</label>
          <input type="number" placeholder="5" value={periodLength} onChange={(e) => setPeriodLength(e.target.value)} className="calc-input" min="2" max="10" />
        </div>
      </div>

      {result && (
        <div className="result-card space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="bg-red-50 rounded-xl p-3 border border-red-200">
              <div className="text-xs text-gray-500">Next Period</div>
              <div className="text-sm font-bold text-red-600">{formatDate(result.nextPeriod)}</div>
            </div>
            <div className="bg-purple-50 rounded-xl p-3 border border-purple-200">
              <div className="text-xs text-gray-500">Ovulation Day</div>
              <div className="text-sm font-bold text-purple-600">{formatDate(result.currentOvulation)}</div>
            </div>
            <div className="bg-green-50 rounded-xl p-3 border border-green-200">
              <div className="text-xs text-gray-500">Fertile Window</div>
              <div className="text-sm font-bold text-green-600">{formatShort(result.currentFertileStart)} - {formatShort(result.currentFertileEnd)}</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
              <div className="text-xs text-gray-500">Safe Days</div>
              <div className="text-sm font-bold text-gray-600">Other days</div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <div className="text-sm font-semibold text-gray-700 mb-3">Next 3 Cycles</div>
            <div className="space-y-2">
              {result.cycles.map((cycle, i) => (
                <div key={i} className="bg-white rounded-xl p-3 border border-gray-100 flex flex-wrap gap-4 text-xs">
                  <div><span className="text-gray-400">Period:</span> <span className="font-semibold text-red-600">{formatShort(cycle.periodStart)} - {formatShort(cycle.periodEnd)}</span></div>
                  <div><span className="text-gray-400">Fertile:</span> <span className="font-semibold text-green-600">{formatShort(cycle.fertileStart)} - {formatShort(cycle.fertileEnd)}</span></div>
                  <div><span className="text-gray-400">Ovulation:</span> <span className="font-semibold text-purple-600">{formatShort(cycle.ovulation)}</span></div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <div className="text-sm font-semibold text-gray-700 mb-3">Calendar View</div>
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="flex items-center gap-1 text-xs"><span className="w-3 h-3 rounded bg-red-400 inline-block" /> Period</span>
              <span className="flex items-center gap-1 text-xs"><span className="w-3 h-3 rounded bg-green-300 inline-block" /> Fertile</span>
              <span className="flex items-center gap-1 text-xs"><span className="w-3 h-3 rounded bg-purple-500 inline-block" /> Ovulation</span>
              <span className="flex items-center gap-1 text-xs"><span className="w-3 h-3 rounded bg-gray-100 inline-block" /> Safe</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {result.calendarMonths.map((month) => (
                <div key={month.month} className="bg-white rounded-xl p-3 border border-gray-100">
                  <div className="text-xs font-bold text-gray-700 mb-2 text-center">{month.month}</div>
                  <div className="grid grid-cols-7 gap-0.5 text-center">
                    {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                      <div key={i} className="text-[10px] text-gray-400 font-medium">{d}</div>
                    ))}
                    {month.days.map((day, i) => (
                      <div key={i} className={`text-[10px] rounded p-0.5 ${day.type === "empty" ? "" : typeColors[day.type]}`}>
                        {day.type !== "empty" ? day.date.getDate() : ""}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
            <div className="text-xs text-yellow-700">
              <strong>Disclaimer:</strong> This calculator provides estimates based on average cycle patterns. Individual cycles may vary. Not intended as a birth control method. Consult your healthcare provider for personalized advice.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
