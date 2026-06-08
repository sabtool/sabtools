"use client";
import { useState, useMemo } from "react";
import {
  INCOME_TAX_NEW_REGIME_FY26_27,
  INCOME_TAX_OLD_REGIME_FY26_27_BELOW_60,
  INCOME_TAX_OLD_REGIME_FY26_27_60_TO_80,
  INCOME_TAX_OLD_REGIME_FY26_27_ABOVE_80,
} from "@/data/rates";
import { RateTrustBadge } from "@/components/RateTrustBadge";

/**
 * Income Tax Calculator — locale-aware labels.
 *
 * Updated for FY 2026-27 / AY 2027-28. Budget 2026 (1 Feb 2026) left the
 * new-regime slab structure UNCHANGED from FY 2025-26 — same ₹4L basic
 * exemption, same Section 87A rebate of ₹60,000 (now placed in Clause 156
 * of the new Income Tax Act 2026), same ₹75,000 standard deduction. So
 * the slab table & math here remain mathematically correct; only the
 * label / disclaimer year has been refreshed.
 *
 * Source verified 2026-06-08 from incometax.gov.in/iec/foportal/help/
 * individual/return-applicable-1 + Budget 2026 release.
 */
type Locale = "en-IN" | "hi-IN";

const LABELS: Record<Locale, {
  taxSlabsBadge: string;
  annualIncome: string;
  taxRegime: string;
  newRegime: string;
  oldRegime: string;
  ageGroup: string;
  ageBelow60: string;
  age60to80: string;
  ageAbove80: string;
  incomeTax: string;
  cess: string;
  totalTax: string;
  netIncome: string;
  effectiveRate: string;
  disclaimer: string;
  disclaimerBody: string;
  enterIncome: string;
}> = {
  "en-IN": {
    taxSlabsBadge: "Tax Slabs: FY 2026-27 (AY 2027-28)",
    annualIncome: "Annual Income (₹)",
    taxRegime: "Tax Regime",
    newRegime: "New Regime",
    oldRegime: "Old Regime",
    ageGroup: "Age Group",
    ageBelow60: "Below 60",
    age60to80: "60-80",
    ageAbove80: "Above 80",
    incomeTax: "Income Tax",
    cess: "Cess (4%)",
    totalTax: "Total Tax",
    netIncome: "Net Income",
    effectiveRate: "Effective Tax Rate",
    disclaimer: "Disclaimer:",
    disclaimerBody: "Tax calculations are based on FY 2026-27 / AY 2027-28 rates (Budget 2026 retained the FY 2025-26 slab structure unchanged). Standard deduction ₹75,000, Section 87A rebate up to ₹60,000 for income ≤ ₹12L (new regime). Surcharge and 4% health & education cess included. For exact tax liability, consult a CA or the official Income Tax portal at",
    enterIncome: "e.g. 1200000",
  },
  "hi-IN": {
    taxSlabsBadge: "टैक्स स्लैब: FY 2026-27 (AY 2027-28)",
    annualIncome: "वार्षिक आय (₹)",
    taxRegime: "टैक्स रिजीम",
    newRegime: "नया रिजीम",
    oldRegime: "पुराना रिजीम",
    ageGroup: "आयु वर्ग",
    ageBelow60: "60 से कम",
    age60to80: "60-80",
    ageAbove80: "80 से ऊपर",
    incomeTax: "इनकम टैक्स",
    cess: "सेस (4%)",
    totalTax: "कुल टैक्स",
    netIncome: "शुद्ध आय",
    effectiveRate: "प्रभावी टैक्स दर",
    disclaimer: "अस्वीकरण:",
    disclaimerBody: "ये गणनाएँ FY 2026-27 / AY 2027-28 की दरों पर आधारित हैं (बजट 2026 ने FY 2025-26 की स्लैब संरचना अपरिवर्तित रखी है)। स्टैंडर्ड डिडक्शन ₹75,000, सेक्शन 87A रिबेट ₹60,000 तक (नई रिजीम, आय ≤ ₹12 लाख)। सरचार्ज और 4% हेल्थ एंड एजुकेशन सेस शामिल हैं। सटीक टैक्स देयता के लिए CA से सलाह लें या आधिकारिक इनकम टैक्स पोर्टल पर जाएँ —",
    enterIncome: "उदा. 1200000",
  },
};

export default function IncomeTaxCalculator({ locale = "en-IN" }: { locale?: Locale } = {}) {
  const t = LABELS[locale] ?? LABELS["en-IN"];
  const [income, setIncome] = useState("");
  const [regime, setRegime] = useState<"old" | "new">("new");
  const [age, setAge] = useState<"below60" | "60to80" | "above80">("below60");

  const result = useMemo(() => {
    const inc = parseFloat(income);
    if (isNaN(inc) || inc <= 0) return null;

    let tax = 0;
    if (regime === "new") {
      // New Regime FY 2026-27 — slabs sourced from the central rates
      // registry (src/data/rates.ts) so a single Budget-time update
      // there propagates here automatically.
      const newRegime = INCOME_TAX_NEW_REGIME_FY26_27.value;
      const taxableIncome = Math.max(0, inc - newRegime.standardDeduction);
      let remaining = taxableIncome;
      let prev = 0;
      for (const slab of newRegime.slabs) {
        const taxable = Math.min(remaining, slab.upTo - prev);
        if (taxable <= 0) break;
        tax += (taxable * slab.rate) / 100;
        remaining -= taxable;
        prev = slab.upTo;
      }
      // Section 87A rebate (Clause 156 under new IT Act 2026)
      if (taxableIncome <= newRegime.rebateMaxIncome) {
        tax = Math.max(0, tax - newRegime.rebateUnder87A);
      }
    } else {
      // Old Regime FY 2026-27 — age-specific slab table from the central
      // rates registry. Each age band has a different starting 0% slab
      // that encodes the basic exemption directly, so we DON'T subtract
      // the basic exemption separately — that was the bug in the
      // previous implementation (double-counted the exemption and
      // over-taxed every old-regime user by ~₹20,000 at ₹10L income).
      const oldRegimeEntry =
        age === "above80"
          ? INCOME_TAX_OLD_REGIME_FY26_27_ABOVE_80
          : age === "60to80"
            ? INCOME_TAX_OLD_REGIME_FY26_27_60_TO_80
            : INCOME_TAX_OLD_REGIME_FY26_27_BELOW_60;
      const oldRegime = oldRegimeEntry.value;
      // Only subtract standard deduction — the 0% basic-exemption band
      // is already encoded in the first slab.
      const taxable = Math.max(0, inc - oldRegime.standardDeduction);
      let remaining = taxable;
      let prev = 0;
      for (const slab of oldRegime.slabs) {
        const t = Math.min(remaining, slab.upTo - prev);
        if (t <= 0) break;
        tax += (t * slab.rate) / 100;
        remaining -= t;
        prev = slab.upTo;
      }
      // Section 87A rebate for old regime: taxable income up to ₹5L.
      if (taxable <= oldRegime.rebateMaxIncome) {
        tax = Math.max(0, tax - oldRegime.rebateUnder87A);
      }
    }

    const cess = tax * 0.04;
    const totalTax = tax + cess;
    const netIncome = inc - totalTax;
    const effectiveRate = inc > 0 ? (totalTax / inc) * 100 : 0;

    return { tax, cess, totalTax, netIncome, effectiveRate };
  }, [income, regime, age]);

  const fmt = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="space-y-6">
      <div className="inline-block bg-indigo-100 text-indigo-800 text-sm font-semibold px-4 py-1.5 rounded-full">
        {"\uD83D\uDCC5"} {t.taxSlabsBadge}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="annual-income" className="text-sm font-semibold text-gray-700 block mb-2">{t.annualIncome}</label>
          <input id="annual-income" type="number" placeholder={t.enterIncome} value={income} onChange={(e) => setIncome(e.target.value)} className="calc-input" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">{t.taxRegime}</label>
          <div className="flex gap-2">
            {(["new", "old"] as const).map((r) => (
              <button key={r} onClick={() => setRegime(r)} className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition ${regime === r ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"}`}>{r === "new" ? t.newRegime : t.oldRegime}</button>
            ))}
          </div>
        </div>
      </div>

      {regime === "old" && (
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">{t.ageGroup}</label>
          <div className="flex gap-2 flex-wrap">
            {([{l: t.ageBelow60, v: "below60"}, {l: t.age60to80, v: "60to80"}, {l: t.ageAbove80, v: "above80"}] as const).map((a) => (
              <button key={a.v} onClick={() => setAge(a.v)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${age === a.v ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"}`}>{a.l}</button>
            ))}
          </div>
        </div>
      )}

      {/* Result panel renders ALWAYS — Phase 6 Round 3 SSR fix.
          Static labels (इनकम टैक्स / सेस / कुल टैक्स / शुद्ध आय /
          प्रभावी टैक्स दर) must be in initial SSR HTML for AI
          training crawlers without JS execution. Values render as
          "—" placeholder when no income entered. */}
      <div className="result-card space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm"><div className="text-xs font-medium text-gray-500 mb-1">{t.incomeTax}</div><div className="text-xl font-bold text-red-600">{result ? fmt(result.tax) : "—"}</div></div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm"><div className="text-xs font-medium text-gray-500 mb-1">{t.cess}</div><div className="text-xl font-bold text-orange-600">{result ? fmt(result.cess) : "—"}</div></div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm"><div className="text-xs font-medium text-gray-500 mb-1">{t.totalTax}</div><div className="text-xl font-bold text-red-700">{result ? fmt(result.totalTax) : "—"}</div></div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm"><div className="text-xs font-medium text-gray-500 mb-1">{t.netIncome}</div><div className="text-xl font-bold text-green-600">{result ? fmt(result.netIncome) : "—"}</div></div>
        </div>
        <div className="text-center text-sm text-gray-500">{t.effectiveRate}: <span className="font-bold text-indigo-600">{result ? `${result.effectiveRate.toFixed(2)}%` : "—"}</span></div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-800 leading-relaxed">
        <span className="mr-1">{"\u2139\uFE0F"}</span>
        <strong>{t.disclaimer}</strong> {t.disclaimerBody}{" "}
        <a href="https://www.incometax.gov.in" target="_blank" rel="noopener noreferrer" className="underline font-semibold text-blue-700 hover:text-blue-900">incometax.gov.in</a>.
      </div>
      {/* Phase 5 trust badge \u2014 last-verified date for slab tables. */}
      <RateTrustBadge
        entries={[
          INCOME_TAX_NEW_REGIME_FY26_27,
          INCOME_TAX_OLD_REGIME_FY26_27_BELOW_60,
        ]}
        label="Tax slabs verified"
      />
    </div>
  );
}
