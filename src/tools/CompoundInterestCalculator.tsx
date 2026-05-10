"use client";
import { useState, useMemo } from "react";

/**
 * Compound Interest Calculator — locale-aware labels (Phase 6 Round 3b Task B).
 * Compounding frequencies use the standard Hindi banking vocabulary:
 *   Yearly → वार्षिक, Half-Yearly → अर्धवार्षिक, Quarterly → त्रैमासिक,
 *   Monthly → मासिक, Daily → दैनिक. Same words appear on RBI Hindi pages
 *   and SBI / HDFC Hindi FD brochures.
 */
type Locale = "en-IN" | "hi-IN";

const LABELS: Record<Locale, {
  principalAmount: string;
  interestRate: string;
  timePeriod: string;
  yrsSuffix: string;
  compoundingFrequency: string;
  yearly: string;
  halfYearly: string;
  quarterly: string;
  monthly: string;
  daily: string;
  principalLabel: string;
  totalInterest: string;
  totalAmount: string;
}> = {
  "en-IN": {
    principalAmount: "Principal Amount",
    interestRate: "Interest Rate (% p.a.)",
    timePeriod: "Time Period (Years)",
    yrsSuffix: "yrs",
    compoundingFrequency: "Compounding Frequency",
    yearly: "Yearly",
    halfYearly: "Half-Yearly",
    quarterly: "Quarterly",
    monthly: "Monthly",
    daily: "Daily",
    principalLabel: "Principal",
    totalInterest: "Total Interest",
    totalAmount: "Total Amount",
  },
  "hi-IN": {
    principalAmount: "मूलधन",
    interestRate: "ब्याज दर (% प्रति वर्ष)",
    timePeriod: "अवधि (वर्ष)",
    yrsSuffix: "वर्ष",
    compoundingFrequency: "चक्रवृद्धि आवृत्ति",
    yearly: "वार्षिक",
    halfYearly: "अर्धवार्षिक",
    quarterly: "त्रैमासिक",
    monthly: "मासिक",
    daily: "दैनिक",
    principalLabel: "मूलधन",
    totalInterest: "कुल ब्याज",
    totalAmount: "कुल राशि",
  },
};

export default function CompoundInterestCalculator({ locale = "en-IN" }: { locale?: Locale } = {}) {
  const t = LABELS[locale] ?? LABELS["en-IN"];
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(8);
  const [years, setYears] = useState(5);
  const [frequency, setFrequency] = useState(4);

  const result = useMemo(() => {
    const amount = principal * Math.pow(1 + rate / (frequency * 100), frequency * years);
    const interest = amount - principal;
    return { amount, interest };
  }, [principal, rate, years, frequency]);

  const fmt = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  const freqOptions = [
    { l: t.yearly, v: 1 },
    { l: t.halfYearly, v: 2 },
    { l: t.quarterly, v: 4 },
    { l: t.monthly, v: 12 },
    { l: t.daily, v: 365 },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-5">
        <div>
          <div className="flex justify-between mb-2"><label className="text-sm font-semibold text-gray-700">{t.principalAmount}</label><span className="text-sm font-bold text-indigo-600">{fmt(principal)}</span></div>
          <input type="range" min={1000} max={10000000} step={1000} value={principal} onChange={(e) => setPrincipal(+e.target.value)} className="w-full" />
        </div>
        <div>
          <div className="flex justify-between mb-2"><label className="text-sm font-semibold text-gray-700">{t.interestRate}</label><span className="text-sm font-bold text-indigo-600">{rate}%</span></div>
          <input type="range" min={1} max={25} step={0.1} value={rate} onChange={(e) => setRate(+e.target.value)} className="w-full" />
        </div>
        <div>
          <div className="flex justify-between mb-2"><label className="text-sm font-semibold text-gray-700">{t.timePeriod}</label><span className="text-sm font-bold text-indigo-600">{years} {t.yrsSuffix}</span></div>
          <input type="range" min={1} max={30} step={1} value={years} onChange={(e) => setYears(+e.target.value)} className="w-full" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">{t.compoundingFrequency}</label>
          <div className="flex gap-2 flex-wrap">
            {freqOptions.map((f) => (
              <button key={f.v} onClick={() => setFrequency(f.v)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${frequency === f.v ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"}`}>{f.l}</button>
            ))}
          </div>
        </div>
      </div>
      {/* Result panel renders ALWAYS — Phase 6 Round 3b SSR pattern.
          Static Devanagari labels (मूलधन, कुल ब्याज, कुल राशि) must be
          in initial SSR HTML for AI training crawlers. */}
      <div className="result-card grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 text-center shadow-sm"><div className="text-xs font-medium text-gray-500 mb-1">{t.principalLabel}</div><div className="text-2xl font-extrabold text-gray-800">{fmt(principal)}</div></div>
        <div className="bg-white rounded-xl p-4 text-center shadow-sm"><div className="text-xs font-medium text-gray-500 mb-1">{t.totalInterest}</div><div className="text-2xl font-extrabold text-green-600">{fmt(result.interest)}</div></div>
        <div className="bg-white rounded-xl p-4 text-center shadow-sm"><div className="text-xs font-medium text-gray-500 mb-1">{t.totalAmount}</div><div className="text-2xl font-extrabold text-indigo-600">{fmt(result.amount)}</div></div>
      </div>
    </div>
  );
}
