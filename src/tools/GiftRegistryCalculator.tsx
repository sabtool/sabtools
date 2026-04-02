"use client";
import { useState, useMemo } from "react";

interface GuestCategory {
  label: string;
  key: string;
  count: number;
  minGift: number;
  maxGift: number;
}

export default function GiftRegistryCalculator() {
  const [categories, setCategories] = useState<GuestCategory[]>([
    { label: "Close Family", key: "close", count: 20, minGift: 10000, maxGift: 50000 },
    { label: "Extended Family", key: "extended", count: 50, minGift: 2000, maxGift: 10000 },
    { label: "Friends", key: "friends", count: 40, minGift: 1000, maxGift: 5000 },
    { label: "Colleagues", key: "colleagues", count: 30, minGift: 500, maxGift: 3000 },
  ]);
  const [returnGiftPerGuest, setReturnGiftPerGuest] = useState(300);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  const updateCategory = (index: number, field: keyof GuestCategory, value: number) => {
    setCategories((prev) =>
      prev.map((c, i) => (i === index ? { ...c, [field]: value } : c))
    );
  };

  const results = useMemo(() => {
    const breakdown = categories.map((cat) => {
      const avgGift = (cat.minGift + cat.maxGift) / 2;
      const minTotal = cat.count * cat.minGift;
      const maxTotal = cat.count * cat.maxGift;
      const expectedTotal = cat.count * avgGift;
      return { ...cat, avgGift, minTotal, maxTotal, expectedTotal };
    });

    const totalGuests = categories.reduce((s, c) => s + c.count, 0);
    const totalMinGifts = breakdown.reduce((s, b) => s + b.minTotal, 0);
    const totalMaxGifts = breakdown.reduce((s, b) => s + b.maxTotal, 0);
    const totalExpected = breakdown.reduce((s, b) => s + b.expectedTotal, 0);
    const avgPerGuest = totalGuests > 0 ? totalExpected / totalGuests : 0;
    const returnGiftTotal = totalGuests * returnGiftPerGuest;
    const netGifts = totalExpected - returnGiftTotal;

    return { breakdown, totalGuests, totalMinGifts, totalMaxGifts, totalExpected, avgPerGuest, returnGiftTotal, netGifts };
  }, [categories, returnGiftPerGuest]);

  return (
    <div className="space-y-8">
      {/* Guest Categories Input */}
      <div className="result-card space-y-6">
        <h3 className="text-lg font-bold text-gray-800">Guest Categories & Expected Gifts</h3>
        {categories.map((cat, i) => (
          <div key={cat.key} className="space-y-3 pb-4 border-b border-gray-100 last:border-0">
            <div className="font-semibold text-gray-700">{cat.label}</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Number of Guests</label>
                <input
                  type="number"
                  min={0}
                  max={500}
                  value={cat.count}
                  onChange={(e) => updateCategory(i, "count", +e.target.value)}
                  className="calc-input"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Min Gift (₹)</label>
                <input
                  type="number"
                  min={0}
                  step={500}
                  value={cat.minGift}
                  onChange={(e) => updateCategory(i, "minGift", +e.target.value)}
                  className="calc-input"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Max Gift (₹)</label>
                <input
                  type="number"
                  min={0}
                  step={500}
                  value={cat.maxGift}
                  onChange={(e) => updateCategory(i, "maxGift", +e.target.value)}
                  className="calc-input"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Return Gift */}
      <div className="result-card space-y-3">
        <h3 className="text-lg font-bold text-gray-800">Return Gift Budget</h3>
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">Per Guest Return Gift</label>
            <span className="text-sm font-bold text-indigo-600">{fmt(returnGiftPerGuest)}</span>
          </div>
          <input
            type="range"
            min={100}
            max={500}
            step={25}
            value={returnGiftPerGuest}
            onChange={(e) => setReturnGiftPerGuest(+e.target.value)}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>₹100</span><span>₹500</span>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="result-card space-y-4">
        <h3 className="text-lg font-bold text-gray-800">Gift Estimate by Category</h3>
        <div className="space-y-3">
          {results.breakdown.map((b) => (
            <div key={b.key} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-gray-700">{b.label}</span>
                <span className="text-sm text-gray-500">{b.count} guests</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-xs text-gray-400">Min</div>
                  <div className="text-sm font-bold text-gray-600">{fmt(b.minTotal)}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400">Expected</div>
                  <div className="text-sm font-bold text-indigo-600">{fmt(b.expectedTotal)}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400">Max</div>
                  <div className="text-sm font-bold text-gray-600">{fmt(b.maxTotal)}</div>
                </div>
              </div>
              <div className="text-xs text-gray-400 text-center mt-1">
                Avg gift per guest: {fmt(b.avgGift)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="result-card space-y-4">
        <h3 className="text-lg font-bold text-gray-800">Summary</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-xs font-medium text-gray-500 mb-1">Total Guests</div>
            <div className="text-2xl font-extrabold text-indigo-600">{results.totalGuests}</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-xs font-medium text-gray-500 mb-1">Expected Total Gifts</div>
            <div className="text-2xl font-extrabold text-emerald-600">{fmt(results.totalExpected)}</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-xs font-medium text-gray-500 mb-1">Average per Guest</div>
            <div className="text-2xl font-extrabold text-amber-600">{fmt(results.avgPerGuest)}</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-xs font-medium text-gray-500 mb-1">Gift Range</div>
            <div className="text-lg font-bold text-gray-700">
              {fmt(results.totalMinGifts)} — {fmt(results.totalMaxGifts)}
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-xs font-medium text-gray-500 mb-1">Return Gifts Total</div>
            <div className="text-2xl font-extrabold text-red-500">{fmt(results.returnGiftTotal)}</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-xs font-medium text-gray-500 mb-1">Net Gift Value</div>
            <div className={`text-2xl font-extrabold ${results.netGifts >= 0 ? "text-green-600" : "text-red-500"}`}>
              {fmt(results.netGifts)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
