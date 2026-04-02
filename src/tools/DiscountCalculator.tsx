"use client";
import { useState, useMemo } from "react";

export default function DiscountCalculator() {
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");

  const result = useMemo(() => {
    const p = parseFloat(price);
    const d = parseFloat(discount);
    if (!p || !d || p <= 0 || d < 0) return null;
    const saved = (p * d) / 100;
    const final_ = p - saved;
    return { saved, final: final_ };
  }, [price, discount]);

  const fmt = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(n);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Original Price (₹)</label>
          <input type="number" placeholder="e.g. 1999" value={price} onChange={(e) => setPrice(e.target.value)} className="calc-input" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Discount (%)</label>
          <input type="number" placeholder="e.g. 20" value={discount} onChange={(e) => setDiscount(e.target.value)} className="calc-input" />
          <div className="flex gap-2 mt-2">
            {[10, 20, 30, 50, 70].map((d) => (
              <button key={d} onClick={() => setDiscount(String(d))} className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${discount === String(d) ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"}`}>{d}%</button>
            ))}
          </div>
        </div>
      </div>
      {result && (
        <div className="result-card grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-xs font-medium text-gray-500 mb-1">Original Price</div>
            <div className="text-xl font-bold text-gray-400 line-through">{fmt(parseFloat(price))}</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-xs font-medium text-gray-500 mb-1">You Save</div>
            <div className="text-xl font-bold text-green-600">{fmt(result.saved)}</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-xs font-medium text-gray-500 mb-1">Final Price</div>
            <div className="text-2xl font-extrabold text-indigo-600">{fmt(result.final)}</div>
          </div>
        </div>
      )}
    </div>
  );
}
