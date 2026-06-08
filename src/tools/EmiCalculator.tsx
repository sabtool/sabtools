"use client";
import { useMemo } from "react";
import { useUrlState } from "@/hooks/useUrlState";

/**
 * EMI Calculator — locale-aware labels (Phase 6 Round 2 Task B).
 *
 * The English copy is the original strings; the Hindi copy is
 * hand-written Devanagari that matches actual Indian search vocabulary
 * (e.g., "लोन राशि" not the more Sanskritised "ऋण राशि" because the
 * former is what 90%+ of Indian Hindi search queries use). EMI itself
 * is kept as ईएमआई (Devanagari transliteration) since that's the
 * loanword users recognise on bank statements.
 */
type Locale = "en-IN" | "hi-IN";

type Labels = {
  loanAmount: string;
  interestRate: string;
  loanTenureYears: string;
  yrsSuffix: string;
  monthlyEmi: string;
  totalInterest: string;
  totalPayment: string;
  principal: string;
  interestLabel: string;
  compareTitle: string;
  reducingCol: string;
  flatCol: string;
  emiRow: string;
};

const LABELS: Record<Locale, Labels> = {
  "en-IN": {
    loanAmount: "Loan Amount",
    interestRate: "Interest Rate (% p.a.)",
    loanTenureYears: "Loan Tenure (Years)",
    yrsSuffix: "yrs",
    monthlyEmi: "Monthly EMI",
    totalInterest: "Total Interest",
    totalPayment: "Total Payment",
    principal: "Principal",
    interestLabel: "Interest",
    compareTitle: "Flat Rate vs Reducing Balance",
    reducingCol: "Reducing Balance",
    flatCol: "Flat Rate",
    emiRow: "Monthly EMI",
  },
  "hi-IN": {
    loanAmount: "लोन राशि",
    interestRate: "ब्याज दर (% प्रति वर्ष)",
    loanTenureYears: "लोन अवधि (वर्ष)",
    yrsSuffix: "वर्ष",
    monthlyEmi: "मासिक ईएमआई",
    totalInterest: "कुल ब्याज",
    totalPayment: "कुल भुगतान",
    principal: "मूलधन",
    interestLabel: "ब्याज",
    compareTitle: "फ्लैट रेट बनाम रिड्यूसिंग बैलेंस",
    reducingCol: "रिड्यूसिंग बैलेंस",
    flatCol: "फ्लैट रेट",
    emiRow: "मासिक ईएमआई",
  },
};

/** Standard reducing-balance EMI for a given annual rate (%) and months. */
function reducingEmi(p: number, annualRatePct: number, n: number): number {
  const r = annualRatePct / 12 / 100;
  if (r <= 0) return p / n;
  return (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

/**
 * The reducing-balance rate that costs the SAME as a flat-rate loan at the
 * given quoted rate — i.e. the "true" rate hiding behind a flat quote.
 * Solved by binary search since there's no closed form. A flat X% typically
 * lands near a reducing 1.8x–1.9x.
 */
function flatToReducingRate(p: number, flatAnnualPct: number, years: number): number {
  const n = years * 12;
  const flatEmiVal = (p + p * (flatAnnualPct / 100) * years) / n;
  let lo = 0;
  let hi = 100;
  for (let i = 0; i < 80; i++) {
    const mid = (lo + hi) / 2;
    if (reducingEmi(p, mid, n) > flatEmiVal) hi = mid;
    else lo = mid;
  }
  return (lo + hi) / 2;
}

export default function EmiCalculator({ locale = "en-IN" }: { locale?: Locale } = {}) {
  const t = LABELS[locale] ?? LABELS["en-IN"];
  // useUrlState replaces useState — same API, but inputs sync to URL
  // (?p=&r=&t=) so calculations are shareable / bookmarkable.
  const [principal, setPrincipal] = useUrlState("p", 2500000);
  const [rate, setRate] = useUrlState("r", 8.5);
  const [tenure, setTenure] = useUrlState("t", 20);

  const result = useMemo(() => {
    const p = principal;
    const r = rate / 12 / 100;
    const n = tenure * 12;
    if (p <= 0 || r <= 0 || n <= 0) return null;
    const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - p;

    // Flat-rate equivalent at the SAME quoted rate: interest is charged on the
    // full original principal for the whole tenure (how most car / personal /
    // gold / two-wheeler loans are quoted). Looks cheaper, costs more.
    const flatInterest = p * (rate / 100) * tenure;
    const flatTotal = p + flatInterest;
    const flatEmi = flatTotal / n;
    const extraOnFlat = flatInterest - totalInterest;
    const effRateOfFlat = flatToReducingRate(p, rate, tenure);

    return {
      emi, totalPayment, totalInterest,
      flatEmi, flatInterest, flatTotal, extraOnFlat, effRateOfFlat,
    };
  }, [principal, rate, tenure]);

  // Currency formatting: INR with Indian comma grouping (lakhs/crores).
  // The "en-IN" Intl locale produces ₹1,00,000-style output regardless of
  // UI language — Indian Hindi users still read amounts in this format.
  const fmt = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  const interestPercent = result ? (result.totalInterest / result.totalPayment) * 100 : 0;

  return (
    <div className="space-y-8">
      {/* Inputs */}
      <div className="space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">{t.loanAmount}</label>
            <span className="text-sm font-bold text-indigo-600">{fmt(principal)}</span>
          </div>
          <input type="range" min={100000} max={50000000} step={50000} value={principal} onChange={(e) => setPrincipal(+e.target.value)} className="w-full" />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>₹1L</span><span>₹5Cr</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">{t.interestRate}</label>
            <span className="text-sm font-bold text-indigo-600">{rate}%</span>
          </div>
          <input type="range" min={1} max={25} step={0.1} value={rate} onChange={(e) => setRate(+e.target.value)} className="w-full" />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>1%</span><span>25%</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">{t.loanTenureYears}</label>
            <span className="text-sm font-bold text-indigo-600">{tenure} {t.yrsSuffix}</span>
          </div>
          <input type="range" min={1} max={30} step={1} value={tenure} onChange={(e) => setTenure(+e.target.value)} className="w-full" />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>1 {t.yrsSuffix}</span><span>30 {t.yrsSuffix}</span>
          </div>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="result-card space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">{t.monthlyEmi}</div>
              <div className="text-2xl font-extrabold text-indigo-600">{fmt(result.emi)}</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">{t.totalInterest}</div>
              <div className="text-2xl font-extrabold text-red-500">{fmt(result.totalInterest)}</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">{t.totalPayment}</div>
              <div className="text-2xl font-extrabold text-gray-800">{fmt(result.totalPayment)}</div>
            </div>
          </div>

          {/* Visual bar */}
          <div>
            <div className="flex justify-between text-xs font-medium text-gray-500 mb-2">
              <span>{t.principal} ({(100 - interestPercent).toFixed(1)}%)</span>
              <span>{t.interestLabel} ({interestPercent.toFixed(1)}%)</span>
            </div>
            <div className="h-4 rounded-full bg-red-200 overflow-hidden">
              <div
                className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                style={{ width: `${100 - interestPercent}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Flat Rate vs Reducing Balance comparison */}
      {result && (
        <div className="result-card">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-semibold text-gray-700">{t.compareTitle}</div>
            <div className="text-xs text-gray-400">same {rate}% quoted rate</div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-2 text-gray-600"></th>
                  <th className="text-right p-2 text-indigo-600">{t.reducingCol}</th>
                  <th className="text-right p-2 text-red-600">{t.flatCol}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="p-2 text-gray-700">{t.emiRow}</td>
                  <td className="p-2 text-right font-bold text-indigo-600">{fmt(result.emi)}</td>
                  <td className="p-2 text-right font-bold text-red-600">{fmt(result.flatEmi)}</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-2 text-gray-700">{t.totalInterest}</td>
                  <td className="p-2 text-right font-bold text-indigo-600">{fmt(result.totalInterest)}</td>
                  <td className="p-2 text-right font-bold text-red-600">{fmt(result.flatInterest)}</td>
                </tr>
                <tr>
                  <td className="p-2 text-gray-700">{t.totalPayment}</td>
                  <td className="p-2 text-right font-bold text-indigo-600">{fmt(result.totalPayment)}</td>
                  <td className="p-2 text-right font-bold text-red-600">{fmt(result.flatTotal)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-3 text-sm bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-amber-900">
            {locale === "hi-IN" ? (
              <>
                <b>{rate}%</b> फ्लैट रेट असल में लगभग <b>{result.effRateOfFlat.toFixed(1)}%</b> रिड्यूसिंग रेट जितना महंगा है — फ्लैट लोन पर आप <b>{fmt(result.extraOnFlat)}</b> ज़्यादा ब्याज देंगे। हमेशा रिड्यूसिंग बैलेंस के आधार पर तुलना करें।
              </>
            ) : (
              <>
                A <b>{rate}% flat</b> rate actually costs like a <b>{result.effRateOfFlat.toFixed(1)}% reducing-balance</b> rate — you{"'"}d pay <b>{fmt(result.extraOnFlat)}</b> more in interest on a flat-rate loan. Lenders quote flat rates because the number looks smaller; always compare on a reducing-balance basis.
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
