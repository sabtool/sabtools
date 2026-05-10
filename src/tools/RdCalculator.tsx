"use client";
import { useState, useMemo } from "react";

/**
 * RD Calculator — locale-aware labels (Phase 6 Round 3b Task B).
 * "RD" stays as आरडी (Devanagari transliteration) — what every post-office
 * RD passbook and SBI Hindi banking page uses.
 */
type Locale = "en-IN" | "hi-IN";

const LABELS: Record<Locale, {
  monthlyDeposit: string;
  interestRate: string;
  tenureMonths: string;
  monthsSuffix: string;
  invested: string;
  interestLabel: string;
  maturity: string;
}> = {
  "en-IN": {
    monthlyDeposit: "Monthly Deposit",
    interestRate: "Interest Rate (% p.a.)",
    tenureMonths: "Tenure (Months)",
    monthsSuffix: "months",
    invested: "Invested",
    interestLabel: "Interest",
    maturity: "Maturity",
  },
  "hi-IN": {
    monthlyDeposit: "मासिक जमा",
    interestRate: "ब्याज दर (% प्रति वर्ष)",
    tenureMonths: "अवधि (महीने)",
    monthsSuffix: "महीने",
    invested: "कुल निवेश",
    interestLabel: "ब्याज",
    maturity: "मैच्योरिटी",
  },
};

export default function RdCalculator({ locale = "en-IN" }: { locale?: Locale } = {}) {
  const t = LABELS[locale] ?? LABELS["en-IN"];
  const [monthly, setMonthly] = useState(5000);
  const [rate, setRate] = useState(7);
  const [months, setMonths] = useState(60);

  const result = useMemo(() => {
    const r = rate / 400;
    const n = months;
    let maturity = 0;
    for (let i = 1; i <= n; i++) {
      maturity += monthly * Math.pow(1 + r, (n - i + 1) / 3);
    }
    const invested = monthly * n;
    const interest = maturity - invested;
    return { maturity, invested, interest };
  }, [monthly, rate, months]);

  const fmt = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="space-y-6">
      <div className="space-y-5">
        <div>
          <div className="flex justify-between mb-2"><label className="text-sm font-semibold text-gray-700">{t.monthlyDeposit}</label><span className="text-sm font-bold text-indigo-600">{fmt(monthly)}</span></div>
          <input type="range" min={500} max={100000} step={500} value={monthly} onChange={(e) => setMonthly(+e.target.value)} className="w-full" />
        </div>
        <div>
          <div className="flex justify-between mb-2"><label className="text-sm font-semibold text-gray-700">{t.interestRate}</label><span className="text-sm font-bold text-indigo-600">{rate}%</span></div>
          <input type="range" min={1} max={12} step={0.1} value={rate} onChange={(e) => setRate(+e.target.value)} className="w-full" />
        </div>
        <div>
          <div className="flex justify-between mb-2"><label className="text-sm font-semibold text-gray-700">{t.tenureMonths}</label><span className="text-sm font-bold text-indigo-600">{months} {t.monthsSuffix}</span></div>
          <input type="range" min={6} max={120} step={6} value={months} onChange={(e) => setMonths(+e.target.value)} className="w-full" />
        </div>
      </div>
      {/* Result panel renders ALWAYS — Phase 6 Round 3b SSR pattern.
          Static Devanagari labels (कुल निवेश, ब्याज, मैच्योरिटी) must be
          in initial SSR HTML for AI training crawlers. */}
      <div className="result-card grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 text-center shadow-sm"><div className="text-xs font-medium text-gray-500 mb-1">{t.invested}</div><div className="text-2xl font-extrabold text-gray-800">{fmt(result.invested)}</div></div>
        <div className="bg-white rounded-xl p-4 text-center shadow-sm"><div className="text-xs font-medium text-gray-500 mb-1">{t.interestLabel}</div><div className="text-2xl font-extrabold text-green-600">{fmt(result.interest)}</div></div>
        <div className="bg-white rounded-xl p-4 text-center shadow-sm"><div className="text-xs font-medium text-gray-500 mb-1">{t.maturity}</div><div className="text-2xl font-extrabold text-indigo-600">{fmt(result.maturity)}</div></div>
      </div>
    </div>
  );
}
