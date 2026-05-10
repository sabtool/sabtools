"use client";
import { useState, useMemo } from "react";

/**
 * FD Calculator — locale-aware labels (Phase 6 Round 3b Task B).
 * "FD" stays as एफडी (Devanagari transliteration) because that's the
 * loanword every Indian bank passbook, ATM screen, and Hindi news bulletin
 * uses — फिक्स्ड डिपॉज़िट is also recognised but एफडी is what people speak.
 */
type Locale = "en-IN" | "hi-IN";

const LABELS: Record<Locale, {
  depositAmount: string;
  interestRate: string;
  tenureYears: string;
  yrsSuffix: string;
  compounding: string;
  quarterly: string;
  monthly: string;
  yearly: string;
  investedAmount: string;
  interestEarned: string;
  maturityAmount: string;
}> = {
  "en-IN": {
    depositAmount: "Deposit Amount",
    interestRate: "Interest Rate (% p.a.)",
    tenureYears: "Tenure (Years)",
    yrsSuffix: "yrs",
    compounding: "Compounding",
    quarterly: "Quarterly",
    monthly: "Monthly",
    yearly: "Yearly",
    investedAmount: "Invested Amount",
    interestEarned: "Interest Earned",
    maturityAmount: "Maturity Amount",
  },
  "hi-IN": {
    depositAmount: "जमा राशि",
    interestRate: "ब्याज दर (% प्रति वर्ष)",
    tenureYears: "अवधि (वर्ष)",
    yrsSuffix: "वर्ष",
    compounding: "चक्रवृद्धि",
    quarterly: "त्रैमासिक",
    monthly: "मासिक",
    yearly: "वार्षिक",
    investedAmount: "निवेश की राशि",
    interestEarned: "अर्जित ब्याज",
    maturityAmount: "मैच्योरिटी राशि",
  },
};

export default function FdCalculator({ locale = "en-IN" }: { locale?: Locale } = {}) {
  const t = LABELS[locale] ?? LABELS["en-IN"];
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(5);
  const [compounding, setCompounding] = useState<"quarterly" | "monthly" | "yearly">("quarterly");

  const result = useMemo(() => {
    const n = compounding === "monthly" ? 12 : compounding === "quarterly" ? 4 : 1;
    const maturity = principal * Math.pow(1 + rate / (n * 100), n * years);
    const interest = maturity - principal;
    return { maturity, interest };
  }, [principal, rate, years, compounding]);

  const fmt = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  const compOptions: { v: "quarterly" | "monthly" | "yearly"; l: string }[] = [
    { v: "quarterly", l: t.quarterly },
    { v: "monthly", l: t.monthly },
    { v: "yearly", l: t.yearly },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-5">
        <div>
          <div className="flex justify-between mb-2"><label className="text-sm font-semibold text-gray-700">{t.depositAmount}</label><span className="text-sm font-bold text-indigo-600">{fmt(principal)}</span></div>
          <input type="range" min={10000} max={10000000} step={10000} value={principal} onChange={(e) => setPrincipal(+e.target.value)} className="w-full" />
        </div>
        <div>
          <div className="flex justify-between mb-2"><label className="text-sm font-semibold text-gray-700">{t.interestRate}</label><span className="text-sm font-bold text-indigo-600">{rate}%</span></div>
          <input type="range" min={1} max={15} step={0.1} value={rate} onChange={(e) => setRate(+e.target.value)} className="w-full" />
        </div>
        <div>
          <div className="flex justify-between mb-2"><label className="text-sm font-semibold text-gray-700">{t.tenureYears}</label><span className="text-sm font-bold text-indigo-600">{years} {t.yrsSuffix}</span></div>
          <input type="range" min={1} max={10} step={1} value={years} onChange={(e) => setYears(+e.target.value)} className="w-full" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">{t.compounding}</label>
          <div className="flex gap-2">
            {compOptions.map((c) => (
              <button key={c.v} onClick={() => setCompounding(c.v)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${compounding === c.v ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"}`}>{c.l}</button>
            ))}
          </div>
        </div>
      </div>
      {/* Result panel renders ALWAYS — Phase 6 Round 3b SSR pattern.
          Static Devanagari labels (निवेश की राशि, अर्जित ब्याज, मैच्योरिटी
          राशि) must be in initial SSR HTML for AI training crawlers. */}
      <div className="result-card grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 text-center shadow-sm">
          <div className="text-xs font-medium text-gray-500 mb-1">{t.investedAmount}</div>
          <div className="text-2xl font-extrabold text-gray-800">{fmt(principal)}</div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center shadow-sm">
          <div className="text-xs font-medium text-gray-500 mb-1">{t.interestEarned}</div>
          <div className="text-2xl font-extrabold text-green-600">{fmt(result.interest)}</div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center shadow-sm">
          <div className="text-xs font-medium text-gray-500 mb-1">{t.maturityAmount}</div>
          <div className="text-2xl font-extrabold text-indigo-600">{fmt(result.maturity)}</div>
        </div>
      </div>
    </div>
  );
}
