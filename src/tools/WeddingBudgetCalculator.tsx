"use client";
import { useState, useMemo } from "react";

const defaultCategories = [
  { name: "Venue", percent: 30, icon: "🏛️" },
  { name: "Catering", percent: 25, icon: "🍽️" },
  { name: "Decoration", percent: 10, icon: "🌸" },
  { name: "Photography", percent: 8, icon: "📸" },
  { name: "Clothing", percent: 10, icon: "👗" },
  { name: "Jewelry", percent: 7, icon: "💍" },
  { name: "Music/DJ", percent: 3, icon: "🎵" },
  { name: "Invitation", percent: 2, icon: "💌" },
  { name: "Miscellaneous", percent: 5, icon: "📦" },
];

export default function WeddingBudgetCalculator() {
  const [totalBudget, setTotalBudget] = useState(2000000);
  const [guestCount, setGuestCount] = useState(300);
  const [categories, setCategories] = useState(defaultCategories.map((c) => ({ ...c })));

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  const totalPercent = useMemo(() => categories.reduce((s, c) => s + c.percent, 0), [categories]);

  const breakdown = useMemo(() => {
    return categories.map((c) => ({
      ...c,
      amount: Math.round((c.percent / 100) * totalBudget),
    }));
  }, [categories, totalBudget]);

  const perPlate = useMemo(() => {
    const cateringBudget = breakdown.find((b) => b.name === "Catering")?.amount || 0;
    return guestCount > 0 ? cateringBudget / guestCount : 0;
  }, [breakdown, guestCount]);

  const updatePercent = (index: number, value: number) => {
    setCategories((prev) => prev.map((c, i) => (i === index ? { ...c, percent: value } : c)));
  };

  const resetDefaults = () => {
    setCategories(defaultCategories.map((c) => ({ ...c })));
  };

  return (
    <div className="space-y-8">
      {/* Budget Input */}
      <div className="space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">Total Wedding Budget</label>
            <span className="text-sm font-bold text-indigo-600">{fmt(totalBudget)}</span>
          </div>
          <input
            type="range"
            min={100000}
            max={20000000}
            step={50000}
            value={totalBudget}
            onChange={(e) => setTotalBudget(+e.target.value)}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>₹1L</span><span>₹2Cr</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">Guest Count</label>
            <span className="text-sm font-bold text-indigo-600">{guestCount} guests</span>
          </div>
          <input
            type="range"
            min={50}
            max={2000}
            step={10}
            value={guestCount}
            onChange={(e) => setGuestCount(+e.target.value)}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>50</span><span>2,000</span>
          </div>
        </div>
      </div>

      {/* Percentage Adjustment */}
      <div className="result-card space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800">Customize Allocation</h3>
          <div className="flex items-center gap-3">
            <span className={`text-sm font-semibold ${totalPercent === 100 ? "text-green-600" : "text-red-500"}`}>
              Total: {totalPercent}%
            </span>
            <button onClick={resetDefaults} className="btn-secondary text-xs px-3 py-1">
              Reset
            </button>
          </div>
        </div>

        {categories.map((cat, i) => (
          <div key={cat.name}>
            <div className="flex justify-between mb-1">
              <label className="text-sm text-gray-600">
                {cat.icon} {cat.name}
              </label>
              <span className="text-sm font-semibold text-indigo-600">{cat.percent}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={60}
              step={1}
              value={cat.percent}
              onChange={(e) => updatePercent(i, +e.target.value)}
              className="w-full"
            />
          </div>
        ))}
      </div>

      {/* Budget Breakdown */}
      <div className="result-card space-y-4">
        <h3 className="text-lg font-bold text-gray-800">Budget Breakdown</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {breakdown.map((item) => (
            <div key={item.name} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm font-medium text-gray-600">{item.name}</span>
              </div>
              <div className="text-xl font-extrabold text-indigo-600">{fmt(item.amount)}</div>
              <div className="text-xs text-gray-400">{item.percent}% of budget</div>
            </div>
          ))}
        </div>

        {/* Visual bar */}
        <div className="mt-4">
          <div className="h-6 rounded-full overflow-hidden flex">
            {breakdown.map((item, i) => {
              const colors = [
                "bg-indigo-500", "bg-emerald-500", "bg-pink-500", "bg-amber-500",
                "bg-violet-500", "bg-yellow-500", "bg-cyan-500", "bg-orange-500", "bg-gray-400",
              ];
              return (
                <div
                  key={item.name}
                  className={`${colors[i % colors.length]} transition-all duration-300`}
                  style={{ width: `${item.percent}%` }}
                  title={`${item.name}: ${item.percent}%`}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Per Plate Estimate */}
      <div className="result-card">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-xs font-medium text-gray-500 mb-1">Total Budget</div>
            <div className="text-2xl font-extrabold text-indigo-600">{fmt(totalBudget)}</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-xs font-medium text-gray-500 mb-1">Per Guest Cost</div>
            <div className="text-2xl font-extrabold text-emerald-600">{fmt(totalBudget / (guestCount || 1))}</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-xs font-medium text-gray-500 mb-1">Per Plate (Catering)</div>
            <div className="text-2xl font-extrabold text-amber-600">{fmt(perPlate)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
