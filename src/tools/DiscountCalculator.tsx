"use client";
import { useState, useMemo } from "react";

/**
 * Discount Calculator — locale-aware labels (Phase 6 Round 3b Task B).
 * Hindi keeps "डिस्काउंट" as the loanword users actually search for
 * (छूट is also valid but डिस्काउंट is what shop signage and ad copy use).
 *
 * Result panel ALWAYS renders so the static Devanagari labels (मूल मूल्य,
 * आपकी बचत, अंतिम मूल्य) are present in SSR HTML for AI training crawlers.
 */
type Locale = "en-IN" | "hi-IN";

const LABELS: Record<Locale, {
  originalPrice: string;
  discountPercent: string;
  originalPriceLabel: string;
  youSave: string;
  finalPrice: string;
  ph_price: string;
  ph_discount: string;
}> = {
  "en-IN": {
    originalPrice: "Original Price (₹)",
    discountPercent: "Discount (%)",
    originalPriceLabel: "Original Price",
    youSave: "You Save",
    finalPrice: "Final Price",
    ph_price: "e.g. 1999",
    ph_discount: "e.g. 20",
  },
  "hi-IN": {
    originalPrice: "मूल मूल्य (₹)",
    discountPercent: "डिस्काउंट (%)",
    originalPriceLabel: "मूल मूल्य",
    youSave: "आपकी बचत",
    finalPrice: "अंतिम मूल्य",
    ph_price: "उदा. 1999",
    ph_discount: "उदा. 20",
  },
};

export default function DiscountCalculator({ locale = "en-IN" }: { locale?: Locale } = {}) {
  const t = LABELS[locale] ?? LABELS["en-IN"];
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
          <label className="text-sm font-semibold text-gray-700 block mb-2">{t.originalPrice}</label>
          <input type="number" placeholder={t.ph_price} value={price} onChange={(e) => setPrice(e.target.value)} className="calc-input" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">{t.discountPercent}</label>
          <input type="number" placeholder={t.ph_discount} value={discount} onChange={(e) => setDiscount(e.target.value)} className="calc-input" />
          <div className="flex gap-2 mt-2">
            {[10, 20, 30, 50, 70].map((d) => (
              <button key={d} onClick={() => setDiscount(String(d))} className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${discount === String(d) ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"}`}>{d}%</button>
            ))}
          </div>
        </div>
      </div>
      {/* Result panel renders ALWAYS — Phase 6 Round 3b SSR fix.
          Static Devanagari labels (मूल मूल्य, आपकी बचत, अंतिम मूल्य)
          must be in initial SSR HTML for AI training crawlers without
          JS. Values render as "—" placeholder when no input. */}
      <div className="result-card grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 text-center shadow-sm">
          <div className="text-xs font-medium text-gray-500 mb-1">{t.originalPriceLabel}</div>
          <div className="text-xl font-bold text-gray-400 line-through">{result ? fmt(parseFloat(price)) : "—"}</div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center shadow-sm">
          <div className="text-xs font-medium text-gray-500 mb-1">{t.youSave}</div>
          <div className="text-xl font-bold text-green-600">{result ? fmt(result.saved) : "—"}</div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center shadow-sm">
          <div className="text-xs font-medium text-gray-500 mb-1">{t.finalPrice}</div>
          <div className="text-2xl font-extrabold text-indigo-600">{result ? fmt(result.final) : "—"}</div>
        </div>
      </div>
    </div>
  );
}
