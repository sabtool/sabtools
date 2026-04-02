"use client";
import { useState, useMemo } from "react";

export default function PregnancyCalculator() {
  const [lmp, setLmp] = useState("");

  const result = useMemo(() => {
    if (!lmp) return null;
    const lmpDate = new Date(lmp);
    if (isNaN(lmpDate.getTime())) return null;

    const today = new Date();
    const dueDate = new Date(lmpDate);
    dueDate.setDate(dueDate.getDate() + 280);

    const conceptionDate = new Date(lmpDate);
    conceptionDate.setDate(conceptionDate.getDate() + 14);

    const diffMs = today.getTime() - lmpDate.getTime();
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(totalDays / 7);
    const days = totalDays % 7;

    const daysLeft = Math.max(0, Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

    let trimester: string;
    let trimesterColor: string;
    if (weeks < 13) {
      trimester = "First Trimester";
      trimesterColor = "text-indigo-600";
    } else if (weeks < 27) {
      trimester = "Second Trimester";
      trimesterColor = "text-green-600";
    } else {
      trimester = "Third Trimester";
      trimesterColor = "text-orange-600";
    }

    const progress = Math.min((totalDays / 280) * 100, 100);

    const fmt = (d: Date) => d.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

    if (totalDays < 0) return null;

    return { dueDate: fmt(dueDate), conceptionDate: fmt(conceptionDate), weeks, days, trimester, trimesterColor, daysLeft, progress };
  }, [lmp]);

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Last Menstrual Period (LMP)</label>
        <input type="date" value={lmp} onChange={(e) => setLmp(e.target.value)} className="calc-input" />
      </div>
      {result && (
        <div className="result-card space-y-5">
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-1">Estimated Due Date</div>
            <div className="text-2xl font-extrabold text-indigo-600">{result.dueDate}</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
              <div className="text-xs font-medium text-gray-500 mb-1">Current Week</div>
              <div className="text-2xl font-bold text-indigo-600">{result.weeks}w {result.days}d</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
              <div className="text-xs font-medium text-gray-500 mb-1">Trimester</div>
              <div className={`text-lg font-bold ${result.trimesterColor}`}>{result.trimester}</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
              <div className="text-xs font-medium text-gray-500 mb-1">Days Remaining</div>
              <div className="text-2xl font-bold text-orange-600">{result.daysLeft}</div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Progress</span>
              <span>{result.progress.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-indigo-600 transition-all duration-500" style={{ width: `${result.progress}%` }} />
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>Week 0</span>
              <span>Week 13</span>
              <span>Week 27</span>
              <span>Week 40</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-xs font-medium text-gray-500 mb-1">Estimated Conception Date</div>
            <div className="text-sm font-semibold text-gray-800">{result.conceptionDate}</div>
          </div>
        </div>
      )}
    </div>
  );
}
