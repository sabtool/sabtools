"use client";
import { useMemo } from "react";
import { useUrlState } from "@/hooks/useUrlState";

/**
 * SIP Calculator — locale-aware labels (Phase 6 Round 2 Task B).
 * SIP itself stays as एसआईपी / SIP because Indian users search both.
 */
type Locale = "en-IN" | "hi-IN";

const LABELS: Record<Locale, {
  monthlyInvestment: string;
  expectedReturn: string;
  timePeriod: string;
  yrs: string;
  invested: string;
  estReturns: string;
  totalValue: string;
  investedShort: string;
  returnsShort: string;
}> = {
  "en-IN": {
    monthlyInvestment: "Monthly Investment",
    expectedReturn: "Expected Return Rate (% p.a.)",
    timePeriod: "Time Period (Years)",
    yrs: "yrs",
    invested: "Invested Amount",
    estReturns: "Estimated Returns",
    totalValue: "Total Value",
    investedShort: "Invested",
    returnsShort: "Returns",
  },
  "hi-IN": {
    monthlyInvestment: "मासिक निवेश",
    expectedReturn: "अनुमानित रिटर्न दर (% प्रति वर्ष)",
    timePeriod: "अवधि (वर्ष)",
    yrs: "वर्ष",
    invested: "कुल निवेश",
    estReturns: "अनुमानित रिटर्न",
    totalValue: "कुल मूल्य",
    investedShort: "निवेश",
    returnsShort: "रिटर्न",
  },
};

export default function SipCalculator({ locale = "en-IN" }: { locale?: Locale } = {}) {
  const t = LABELS[locale] ?? LABELS["en-IN"];
  const [monthly, setMonthly] = useUrlState("m", 10000);
  const [rate, setRate] = useUrlState("r", 12);
  const [years, setYears] = useUrlState("y", 15);

  const result = useMemo(() => {
    const p = monthly;
    const r = rate / 12 / 100;
    const n = years * 12;
    if (p <= 0 || r <= 0 || n <= 0) return null;
    const fv = p * (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
    const invested = p * n;
    const gains = fv - invested;
    return { futureValue: fv, invested, gains };
  }, [monthly, rate, years]);

  const fmt = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">{t.monthlyInvestment}</label>
            <span className="text-sm font-bold text-indigo-600">{fmt(monthly)}</span>
          </div>
          <input type="range" min={500} max={500000} step={500} value={monthly} onChange={(e) => setMonthly(+e.target.value)} className="w-full" />
          <div className="flex justify-between text-xs text-gray-400 mt-1"><span>₹500</span><span>₹5L</span></div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">{t.expectedReturn}</label>
            <span className="text-sm font-bold text-indigo-600">{rate}%</span>
          </div>
          <input type="range" min={1} max={30} step={0.5} value={rate} onChange={(e) => setRate(+e.target.value)} className="w-full" />
          <div className="flex justify-between text-xs text-gray-400 mt-1"><span>1%</span><span>30%</span></div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">{t.timePeriod}</label>
            <span className="text-sm font-bold text-indigo-600">{years} {t.yrs}</span>
          </div>
          <input type="range" min={1} max={40} step={1} value={years} onChange={(e) => setYears(+e.target.value)} className="w-full" />
          <div className="flex justify-between text-xs text-gray-400 mt-1"><span>1 {t.yrs}</span><span>40 {t.yrs}</span></div>
        </div>
      </div>

      {result && (
        <div className="result-card space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">{t.invested}</div>
              <div className="text-2xl font-extrabold text-gray-800">{fmt(result.invested)}</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">{t.estReturns}</div>
              <div className="text-2xl font-extrabold text-green-600">{fmt(result.gains)}</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">{t.totalValue}</div>
              <div className="text-2xl font-extrabold text-indigo-600">{fmt(result.futureValue)}</div>
            </div>
          </div>
          <div>
            <div className="h-4 rounded-full bg-green-200 overflow-hidden">
              <div className="h-full rounded-full bg-indigo-500 transition-all duration-500" style={{ width: `${(result.invested / result.futureValue) * 100}%` }} />
            </div>
            <div className="flex justify-between text-xs font-medium text-gray-500 mt-2">
              <span>{t.investedShort} ({((result.invested / result.futureValue) * 100).toFixed(1)}%)</span>
              <span>{t.returnsShort} ({((result.gains / result.futureValue) * 100).toFixed(1)}%)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
