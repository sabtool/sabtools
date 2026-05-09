"use client";
import { useState, useMemo } from "react";

/**
 * Income Tax Calculator — locale-aware labels (Phase 6 Round 2 Task B).
 * Slab tables are universal (FY 2025-26 / AY 2026-27 from the IT Dept);
 * only the visible labels and category names switch language.
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
    taxSlabsBadge: "Tax Slabs: FY 2025-26 (AY 2026-27)",
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
    disclaimerBody: "Tax calculations are based on FY 2025-26 rates as announced in Union Budget 2025. Surcharge and cess (4% health & education cess) are included. For exact tax liability, consult a Chartered Accountant or use the official Income Tax portal at",
    enterIncome: "e.g. 1200000",
  },
  "hi-IN": {
    taxSlabsBadge: "टैक्स स्लैब: FY 2025-26 (AY 2026-27)",
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
    disclaimerBody: "ये गणनाएँ केंद्रीय बजट 2025 में घोषित FY 2025-26 की दरों पर आधारित हैं। सरचार्ज और सेस (4% हेल्थ एंड एजुकेशन सेस) शामिल हैं। सटीक टैक्स देयता के लिए चार्टर्ड अकाउंटेंट से सलाह लें या आधिकारिक इनकम टैक्स पोर्टल पर जाएँ —",
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
      // New Regime FY 2025-26 (AY 2026-27)
      // Standard deduction of ₹75,000
      const taxableIncome = Math.max(0, inc - 75000);
      const slabs = [
        { limit: 400000, rate: 0 },
        { limit: 800000, rate: 5 },
        { limit: 1200000, rate: 10 },
        { limit: 1600000, rate: 15 },
        { limit: 2000000, rate: 20 },
        { limit: 2400000, rate: 25 },
        { limit: Infinity, rate: 30 },
      ];
      let remaining = taxableIncome;
      let prev = 0;
      for (const slab of slabs) {
        const taxable = Math.min(remaining, slab.limit - prev);
        if (taxable <= 0) break;
        tax += (taxable * slab.rate) / 100;
        remaining -= taxable;
        prev = slab.limit;
      }
      // Section 87A rebate: Income up to ₹12,00,000 (after standard deduction) = no tax (rebate up to ₹60,000)
      if (taxableIncome <= 1200000) tax = Math.max(0, tax - 60000);
    } else {
      // Old Regime FY 2025-26
      // Standard deduction of ₹50,000
      const stdDeduction = 50000;
      const exemption = age === "below60" ? 250000 : age === "60to80" ? 300000 : 500000;
      const taxable = Math.max(0, inc - stdDeduction - exemption);
      const slabs = [
        { limit: 250000, rate: 5 },
        { limit: 500000, rate: 20 },
        { limit: Infinity, rate: 30 },
      ];
      let remaining = taxable;
      let prev = 0;
      for (const slab of slabs) {
        const t = Math.min(remaining, slab.limit - prev);
        if (t <= 0) break;
        tax += (t * slab.rate) / 100;
        remaining -= t;
        prev = slab.limit;
      }
      // Section 87A rebate for old regime: taxable income up to ₹5,00,000
      if (taxable <= 500000) tax = 0;
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

      {result && (
        <div className="result-card space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm"><div className="text-xs font-medium text-gray-500 mb-1">{t.incomeTax}</div><div className="text-xl font-bold text-red-600">{fmt(result.tax)}</div></div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm"><div className="text-xs font-medium text-gray-500 mb-1">{t.cess}</div><div className="text-xl font-bold text-orange-600">{fmt(result.cess)}</div></div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm"><div className="text-xs font-medium text-gray-500 mb-1">{t.totalTax}</div><div className="text-xl font-bold text-red-700">{fmt(result.totalTax)}</div></div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm"><div className="text-xs font-medium text-gray-500 mb-1">{t.netIncome}</div><div className="text-xl font-bold text-green-600">{fmt(result.netIncome)}</div></div>
          </div>
          <div className="text-center text-sm text-gray-500">{t.effectiveRate}: <span className="font-bold text-indigo-600">{result.effectiveRate.toFixed(2)}%</span></div>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-800 leading-relaxed">
        <span className="mr-1">{"\u2139\uFE0F"}</span>
        <strong>{t.disclaimer}</strong> {t.disclaimerBody}{" "}
        <a href="https://www.incometax.gov.in" target="_blank" rel="noopener noreferrer" className="underline font-semibold text-blue-700 hover:text-blue-900">incometax.gov.in</a>.
      </div>
    </div>
  );
}
