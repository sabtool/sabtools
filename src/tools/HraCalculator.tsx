"use client";
import { useState, useMemo } from "react";

/**
 * HRA Calculator — locale-aware labels (Phase 6 Round 3b Task B).
 * "HRA" stays as एचआरए (Devanagari transliteration) — what every salary-slip
 * Hindi label and Income Tax Hindi e-filing portal uses. Section 10(13A)
 * Rule 2A is the legal anchor; metro list (Delhi/Mumbai/Kolkata/Chennai)
 * is fixed by the IT Act, language-independent.
 *
 * Result panel renders ALWAYS so the static Devanagari labels (एचआरए छूट
 * गणना, तीन शर्तें, टैक्सेबल एचआरए) are present in SSR HTML for AI training
 * crawlers (GPTBot, ClaudeBot, CCBot) without JS execution.
 */
type Locale = "en-IN" | "hi-IN";

const LABELS: Record<Locale, {
  introHraExemption: string;
  introBody: string;
  basicSalary: string;
  hraReceived: string;
  rentPaid: string;
  cityType: string;
  metroBtn: string;
  nonMetroBtn: string;
  metroNote: string;
  ph_basic: string;
  ph_hra: string;
  ph_rent: string;
  exemptionTitle: string;
  cond_a: string;
  cond_b: string;
  cond_c: (pct: string) => string;
  exemptionResult: string;
  taxableHra: string;
}> = {
  "en-IN": {
    introHraExemption: "HRA Exemption",
    introBody:
      "is the minimum of: (a) Actual HRA received, (b) Rent paid - 10% of basic salary, (c) 50% of basic (metro) or 40% of basic (non-metro).",
    basicSalary: "Basic Salary (Annual) ₹",
    hraReceived: "HRA Received (Annual) ₹",
    rentPaid: "Rent Paid (Annual) ₹",
    cityType: "City Type",
    metroBtn: "Metro (50%)",
    nonMetroBtn: "Non-Metro (40%)",
    metroNote: "Metro: Delhi, Mumbai, Kolkata, Chennai",
    ph_basic: "e.g. 600000",
    ph_hra: "e.g. 240000",
    ph_rent: "e.g. 300000",
    exemptionTitle: "HRA Exemption Calculation",
    cond_a: "(a) Actual HRA Received",
    cond_b: "(b) Rent Paid - 10% of Basic",
    cond_c: (pct) => `(c) ${pct} of Basic Salary`,
    exemptionResult: "HRA Exemption (Min of above)",
    taxableHra: "Taxable HRA",
  },
  "hi-IN": {
    introHraExemption: "एचआरए छूट",
    introBody:
      "तीन में से न्यूनतम राशि होती है: (a) वास्तविक एचआरए, (b) चुकाया गया किराया − मूल वेतन का 10%, (c) मूल वेतन का 50% (मेट्रो) या 40% (नॉन-मेट्रो)।",
    basicSalary: "मूल वेतन (वार्षिक) ₹",
    hraReceived: "प्राप्त एचआरए (वार्षिक) ₹",
    rentPaid: "चुकाया गया किराया (वार्षिक) ₹",
    cityType: "शहर का प्रकार",
    metroBtn: "मेट्रो (50%)",
    nonMetroBtn: "नॉन-मेट्रो (40%)",
    metroNote: "मेट्रो: दिल्ली, मुंबई, कोलकाता, चेन्नई",
    ph_basic: "उदा. 600000",
    ph_hra: "उदा. 240000",
    ph_rent: "उदा. 300000",
    exemptionTitle: "एचआरए छूट गणना",
    cond_a: "(a) वास्तविक एचआरए",
    cond_b: "(b) किराया − मूल वेतन का 10%",
    cond_c: (pct) => `(c) मूल वेतन का ${pct}`,
    exemptionResult: "एचआरए छूट (तीनों में न्यूनतम)",
    taxableHra: "टैक्सेबल एचआरए",
  },
};

export default function HraCalculator({ locale = "en-IN" }: { locale?: Locale } = {}) {
  const t = LABELS[locale] ?? LABELS["en-IN"];
  const [basicSalary, setBasicSalary] = useState("");
  const [hraReceived, setHraReceived] = useState("");
  const [rentPaid, setRentPaid] = useState("");
  const [isMetro, setIsMetro] = useState(true);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  const result = useMemo(() => {
    const basic = parseFloat(basicSalary);
    const hra = parseFloat(hraReceived);
    const rent = parseFloat(rentPaid);
    if (!basic || !hra || !rent || basic <= 0 || hra <= 0 || rent <= 0) return null;

    const actualHra = hra;
    const rentMinusBasic = Math.max(rent - 0.1 * basic, 0);
    const percentOfBasic = isMetro ? 0.5 * basic : 0.4 * basic;
    const exemption = Math.min(actualHra, rentMinusBasic, percentOfBasic);
    const taxableHra = hra - exemption;

    return { actualHra, rentMinusBasic, percentOfBasic, exemption, taxableHra };
  }, [basicSalary, hraReceived, rentPaid, isMetro]);

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
        <strong>{t.introHraExemption}</strong> {t.introBody}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">{t.basicSalary}</label>
          <input
            type="number"
            placeholder={t.ph_basic}
            value={basicSalary}
            onChange={(e) => setBasicSalary(e.target.value)}
            className="calc-input"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">{t.hraReceived}</label>
          <input
            type="number"
            placeholder={t.ph_hra}
            value={hraReceived}
            onChange={(e) => setHraReceived(e.target.value)}
            className="calc-input"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">{t.rentPaid}</label>
          <input
            type="number"
            placeholder={t.ph_rent}
            value={rentPaid}
            onChange={(e) => setRentPaid(e.target.value)}
            className="calc-input"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">{t.cityType}</label>
          <div className="flex gap-2 mt-1">
            <button
              onClick={() => setIsMetro(true)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                isMetro ? "bg-indigo-600 text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {t.metroBtn}
            </button>
            <button
              onClick={() => setIsMetro(false)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                !isMetro ? "bg-indigo-600 text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {t.nonMetroBtn}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-1">{t.metroNote}</p>
        </div>
      </div>

      {/* Result panel renders ALWAYS — Phase 6 Round 3b SSR fix.
          Static Devanagari labels (एचआरए छूट गणना, तीन शर्तें, टैक्सेबल
          एचआरए) must be in initial SSR HTML for AI training crawlers
          (GPTBot, ClaudeBot, CCBot) without JS execution. When `result`
          is null (initial empty inputs), values render as "—" placeholder. */}
      <div className="result-card space-y-4">
        <h3 className="text-sm font-bold text-gray-700 text-center mb-3">{t.exemptionTitle}</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center bg-white rounded-lg p-3 shadow-sm">
            <span className="text-sm text-gray-600">{t.cond_a}</span>
            <span className="text-sm font-bold text-gray-800">{result ? fmt(result.actualHra) : "—"}</span>
          </div>
          <div className="flex justify-between items-center bg-white rounded-lg p-3 shadow-sm">
            <span className="text-sm text-gray-600">{t.cond_b}</span>
            <span className="text-sm font-bold text-gray-800">{result ? fmt(result.rentMinusBasic) : "—"}</span>
          </div>
          <div className="flex justify-between items-center bg-white rounded-lg p-3 shadow-sm">
            <span className="text-sm text-gray-600">{t.cond_c(isMetro ? "50%" : "40%")}</span>
            <span className="text-sm font-bold text-gray-800">{result ? fmt(result.percentOfBasic) : "—"}</span>
          </div>
        </div>

        <div className="border-t-2 border-dashed border-indigo-200 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-xl p-4 text-center border border-green-200">
              <div className="text-xs font-medium text-green-700 mb-1">{t.exemptionResult}</div>
              <div className="text-3xl font-extrabold text-green-600">{result ? fmt(result.exemption) : "—"}</div>
            </div>
            <div className="bg-red-50 rounded-xl p-4 text-center border border-red-200">
              <div className="text-xs font-medium text-red-700 mb-1">{t.taxableHra}</div>
              <div className="text-3xl font-extrabold text-red-500">{result ? fmt(result.taxableHra) : "—"}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
