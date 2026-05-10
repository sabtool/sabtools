"use client";
import { useState, useMemo } from "react";

/**
 * NPS Calculator — locale-aware labels (Phase 6 Round 3b Task B).
 * "NPS" stays as एनपीएस (Devanagari transliteration) — the form used on
 * PFRDA and NSDL NPS Hindi portals. The 60/40 lump-sum / annuity split is
 * statutory (PFRDA Regulations 2015) and stays uniform across locales.
 */
type Locale = "en-IN" | "hi-IN";

const LABELS: Record<Locale, {
  introHeading: string;
  introBody: string;
  monthlyContribution: string;
  expectedReturn: string;
  currentAge: string;
  retirementAge: string;
  yrsSuffix: string;
  totalCorpusAtRetirement: (years: number) => string;
  totalInvested: string;
  totalReturns: string;
  estMonthlyPension: string;
  lumpSumLabel: string;
  taxFreeNote: string;
  annuityPurchaseLabel: string;
  annuityNote: string;
  invested: string;
  returnsLabel: string;
  disclaimerHeading: string;
  disclaimerBody: string;
}> = {
  "en-IN": {
    introHeading: "NPS (National Pension System):",
    introBody: "At retirement, minimum 40% of corpus must be used to purchase annuity. Remaining 60% can be withdrawn as lump sum (tax-free).",
    monthlyContribution: "Monthly Contribution",
    expectedReturn: "Expected Return Rate (% p.a.)",
    currentAge: "Current Age",
    retirementAge: "Retirement Age",
    yrsSuffix: "yrs",
    totalCorpusAtRetirement: (years) => `Total Corpus at Retirement (${years} years)`,
    totalInvested: "Total Invested",
    totalReturns: "Total Returns",
    estMonthlyPension: "Est. Monthly Pension",
    lumpSumLabel: "Lump Sum (60%)",
    taxFreeNote: "Tax-free withdrawal",
    annuityPurchaseLabel: "Annuity Purchase (40%)",
    annuityNote: "Used for monthly pension",
    invested: "Invested",
    returnsLabel: "Returns",
    disclaimerHeading: "Disclaimer",
    disclaimerBody: "NPS returns are market-linked. Rate shown is an assumption for illustration. Actual returns may vary. Check pfrda.org.in",
  },
  "hi-IN": {
    introHeading: "एनपीएस (राष्ट्रीय पेंशन प्रणाली):",
    introBody: "रिटायरमेंट पर कुल कॉर्पस का न्यूनतम 40% एन्युइटी ख़रीदने में लगाना ज़रूरी है। बाकी 60% एकमुश्त (टैक्स-फ्री) निकाल सकते हैं।",
    monthlyContribution: "मासिक योगदान",
    expectedReturn: "अनुमानित रिटर्न दर (% प्रति वर्ष)",
    currentAge: "वर्तमान आयु",
    retirementAge: "रिटायरमेंट आयु",
    yrsSuffix: "वर्ष",
    totalCorpusAtRetirement: (years) => `रिटायरमेंट पर कुल कॉर्पस (${years} वर्ष)`,
    totalInvested: "कुल निवेश",
    totalReturns: "कुल रिटर्न",
    estMonthlyPension: "अनुमानित मासिक पेंशन",
    lumpSumLabel: "एकमुश्त (60%)",
    taxFreeNote: "टैक्स-फ्री निकासी",
    annuityPurchaseLabel: "एन्युइटी ख़रीद (40%)",
    annuityNote: "मासिक पेंशन के लिए",
    invested: "निवेश",
    returnsLabel: "रिटर्न",
    disclaimerHeading: "अस्वीकरण",
    disclaimerBody: "एनपीएस रिटर्न बाज़ार से जुड़े हैं। दिखाई गई दर केवल उदाहरण के लिए अनुमान है। वास्तविक रिटर्न अलग हो सकता है। pfrda.org.in देखें।",
  },
};

export default function NpsCalculator({ locale = "en-IN" }: { locale?: Locale } = {}) {
  const t = LABELS[locale] ?? LABELS["en-IN"];
  const [monthlyContrib, setMonthlyContrib] = useState(5000);
  const [returnRate, setReturnRate] = useState(10);
  const [currentAge, setCurrentAge] = useState(25);
  const [retirementAge, setRetirementAge] = useState(60);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  const result = useMemo(() => {
    if (monthlyContrib <= 0 || returnRate <= 0 || currentAge >= retirementAge) return null;

    const years = retirementAge - currentAge;
    const months = years * 12;
    const r = returnRate / 12 / 100;

    const totalCorpus = monthlyContrib * (((Math.pow(1 + r, months) - 1) / r) * (1 + r));
    const investedAmount = monthlyContrib * months;
    const returns = totalCorpus - investedAmount;

    const annuityCorpus = totalCorpus * 0.4;
    const lumpSum = totalCorpus * 0.6;
    const monthlyPension = (annuityCorpus * 6) / (12 * 100);

    return { totalCorpus, investedAmount, returns, annuityCorpus, lumpSum, monthlyPension, years };
  }, [monthlyContrib, returnRate, currentAge, retirementAge]);

  const years = retirementAge - currentAge;

  return (
    <div className="space-y-8">
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm text-emerald-800">
        <strong>{t.introHeading}</strong> {t.introBody}
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">{t.monthlyContribution}</label>
            <span className="text-sm font-bold text-indigo-600">{fmt(monthlyContrib)}</span>
          </div>
          <input type="range" min={500} max={100000} step={500} value={monthlyContrib} onChange={(e) => setMonthlyContrib(+e.target.value)} className="w-full" />
          <div className="flex justify-between text-xs text-gray-400 mt-1"><span>₹500</span><span>₹1L</span></div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">{t.expectedReturn}</label>
            <span className="text-sm font-bold text-indigo-600">{returnRate}%</span>
          </div>
          <input type="range" min={4} max={14} step={0.5} value={returnRate} onChange={(e) => setReturnRate(+e.target.value)} className="w-full" />
          <div className="flex justify-between text-xs text-gray-400 mt-1"><span>4%</span><span>14%</span></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">{t.currentAge}</label>
              <span className="text-sm font-bold text-indigo-600">{currentAge} {t.yrsSuffix}</span>
            </div>
            <input type="range" min={18} max={59} step={1} value={currentAge} onChange={(e) => setCurrentAge(+e.target.value)} className="w-full" />
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">{t.retirementAge}</label>
              <span className="text-sm font-bold text-indigo-600">{retirementAge} {t.yrsSuffix}</span>
            </div>
            <input type="range" min={40} max={75} step={1} value={retirementAge} onChange={(e) => setRetirementAge(+e.target.value)} className="w-full" />
          </div>
        </div>
      </div>

      {/* Result panel renders ALWAYS — Phase 6 Round 3b SSR pattern.
          Static Devanagari labels (कुल कॉर्पस, कुल निवेश, कुल रिटर्न,
          अनुमानित मासिक पेंशन, एकमुश्त 60%, एन्युइटी 40%) must be in
          initial SSR HTML for AI training crawlers. Default ages
          (25 < 60) yield a valid result, but the always-render shape
          covers edge cases where currentAge >= retirementAge. */}
      <div className="result-card space-y-4">
        <div className="text-center mb-2">
          <div className="text-xs font-medium text-gray-500">{t.totalCorpusAtRetirement(result ? result.years : years)}</div>
          <div className="text-4xl font-extrabold text-indigo-600 mt-1">{result ? fmt(result.totalCorpus) : "—"}</div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-xs font-medium text-gray-500 mb-1">{t.totalInvested}</div>
            <div className="text-xl font-extrabold text-gray-800">{result ? fmt(result.investedAmount) : "—"}</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-xs font-medium text-gray-500 mb-1">{t.totalReturns}</div>
            <div className="text-xl font-extrabold text-green-600">{result ? fmt(result.returns) : "—"}</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-xs font-medium text-gray-500 mb-1">{t.estMonthlyPension}</div>
            <div className="text-xl font-extrabold text-orange-600">{result ? fmt(result.monthlyPension) : "—"}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
            <div className="text-xs font-medium text-blue-700 mb-1">{t.lumpSumLabel}</div>
            <div className="text-2xl font-extrabold text-blue-600">{result ? fmt(result.lumpSum) : "—"}</div>
            <div className="text-xs text-blue-500 mt-1">{t.taxFreeNote}</div>
          </div>
          <div className="bg-amber-50 rounded-xl p-4 text-center border border-amber-200">
            <div className="text-xs font-medium text-amber-700 mb-1">{t.annuityPurchaseLabel}</div>
            <div className="text-2xl font-extrabold text-amber-600">{result ? fmt(result.annuityCorpus) : "—"}</div>
            <div className="text-xs text-amber-500 mt-1">{t.annuityNote}</div>
          </div>
        </div>

        {result && (
          <div>
            <div className="h-4 rounded-full bg-green-200 overflow-hidden">
              <div className="h-full rounded-full bg-indigo-500 transition-all duration-500" style={{ width: `${(result.investedAmount / result.totalCorpus) * 100}%` }} />
            </div>
            <div className="flex justify-between text-xs font-medium text-gray-500 mt-2">
              <span>{t.invested} ({((result.investedAmount / result.totalCorpus) * 100).toFixed(1)}%)</span>
              <span>{t.returnsLabel} ({((result.returns / result.totalCorpus) * 100).toFixed(1)}%)</span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
        <div className="flex items-start gap-2">
          <span className="text-lg">{"ℹ️"}</span>
          <div>
            <p className="font-semibold mb-1">{t.disclaimerHeading}</p>
            <p>{t.disclaimerBody}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
