"use client";
import { useState, useMemo } from "react";

const QUICK_HIKES = [10, 15, 20, 25, 30, 50];

export default function SalaryHikeCalculator() {
  const [currentSalary, setCurrentSalary] = useState("");
  const [hikePercent, setHikePercent] = useState("");

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  const result = useMemo(() => {
    const salary = parseFloat(currentSalary);
    const hike = parseFloat(hikePercent);
    if (!salary || salary <= 0 || !hike) return null;

    const increment = (salary * hike) / 100;
    const newSalary = salary + increment;
    const monthlyIncrease = increment / 12;
    const currentMonthly = salary / 12;
    const newMonthly = newSalary / 12;

    return { increment, newSalary, monthlyIncrease, currentMonthly, newMonthly };
  }, [currentSalary, hikePercent]);

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Current Annual Salary (CTC) ₹</label>
        <input
          type="number"
          placeholder="e.g. 600000"
          value={currentSalary}
          onChange={(e) => setCurrentSalary(e.target.value)}
          className="calc-input"
        />
      </div>

      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Hike Percentage (%)</label>
        <input
          type="number"
          placeholder="e.g. 20"
          value={hikePercent}
          onChange={(e) => setHikePercent(e.target.value)}
          className="calc-input"
        />
      </div>

      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Quick Select</label>
        <div className="flex flex-wrap gap-2">
          {QUICK_HIKES.map((h) => (
            <button
              key={h}
              onClick={() => setHikePercent(h.toString())}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                hikePercent === h.toString()
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {h}%
            </button>
          ))}
        </div>
      </div>

      {result && (
        <div className="result-card space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">New Annual Salary</div>
              <div className="text-3xl font-extrabold text-indigo-600">{fmt(result.newSalary)}</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Annual Increment</div>
              <div className="text-3xl font-extrabold text-green-600">{fmt(result.increment)}</div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center bg-white rounded-lg p-3 shadow-sm">
              <span className="text-sm text-gray-600">Current Monthly Salary</span>
              <span className="text-sm font-bold text-gray-800">{fmt(result.currentMonthly)}</span>
            </div>
            <div className="flex justify-between items-center bg-white rounded-lg p-3 shadow-sm">
              <span className="text-sm text-gray-600">New Monthly Salary</span>
              <span className="text-sm font-bold text-indigo-600">{fmt(result.newMonthly)}</span>
            </div>
            <div className="flex justify-between items-center bg-white rounded-lg p-3 shadow-sm">
              <span className="text-sm text-gray-600">Monthly Increase</span>
              <span className="text-sm font-bold text-green-600">+ {fmt(result.monthlyIncrease)}</span>
            </div>
          </div>

          <div>
            <div className="h-6 rounded-full bg-gray-200 overflow-hidden relative">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-green-500 transition-all duration-500"
                style={{ width: `${Math.min((result.newSalary / (parseFloat(currentSalary) * 2)) * 100, 100)}%` }}
              />
              <div
                className="absolute top-0 h-full border-r-2 border-dashed border-gray-500"
                style={{ left: `${(parseFloat(currentSalary) / (parseFloat(currentSalary) * 2)) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-xs font-medium text-gray-500 mt-2">
              <span>Current: {fmt(parseFloat(currentSalary))}</span>
              <span className="text-green-600">+{hikePercent}% hike</span>
              <span>New: {fmt(result.newSalary)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
