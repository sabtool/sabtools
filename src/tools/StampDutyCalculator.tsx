"use client";
import { useState, useMemo } from "react";

/**
 * Stamp Duty Calculator — locale-aware labels (Phase 6 Round 3b Task B).
 * State names stay in their roman/standard form because they're proper
 * nouns and the registration-department/IGRS portal URLs use them as
 * such. Hindi UI translates the visible labels (शहर, संपत्ति प्रकार,
 * स्टाम्प ड्यूटी, रजिस्ट्रेशन शुल्क, etc.) but the state-name dropdown
 * keeps the canonical English forms users recognise from sale deeds.
 *
 * Result panel renders ALWAYS so the static Devanagari labels (स्टाम्प
 * ड्यूटी, रजिस्ट्रेशन शुल्क, कुल लागत) are present in SSR HTML for AI
 * training crawlers (GPTBot, ClaudeBot, CCBot) without JS execution.
 */
type Locale = "en-IN" | "hi-IN";

const STATE_RATES: Record<string, { residential: number; commercial: number; registration: number }> = {
  "Maharashtra": { residential: 5, commercial: 6, registration: 1 },
  "Delhi": { residential: 4, commercial: 6, registration: 1 },
  "Karnataka": { residential: 5, commercial: 5, registration: 1 },
  "Tamil Nadu": { residential: 7, commercial: 7, registration: 1 },
  "Uttar Pradesh": { residential: 5, commercial: 5, registration: 1 },
  "Gujarat": { residential: 4.9, commercial: 4.9, registration: 1 },
  "Rajasthan": { residential: 5, commercial: 5, registration: 1 },
  "West Bengal": { residential: 5, commercial: 6, registration: 1 },
  "Telangana": { residential: 5, commercial: 5, registration: 0.5 },
  "Andhra Pradesh": { residential: 5, commercial: 5, registration: 0.5 },
  "Kerala": { residential: 8, commercial: 8, registration: 2 },
  "Madhya Pradesh": { residential: 7.5, commercial: 7.5, registration: 3 },
  "Punjab": { residential: 5, commercial: 5, registration: 1 },
  "Haryana": { residential: 5, commercial: 7, registration: 1 },
  "Bihar": { residential: 5.7, commercial: 5.7, registration: 2 },
  "Odisha": { residential: 5, commercial: 5, registration: 1 },
  "Jharkhand": { residential: 4, commercial: 4, registration: 3 },
  "Chhattisgarh": { residential: 5, commercial: 5, registration: 1 },
  "Goa": { residential: 3.5, commercial: 4, registration: 1 },
  "Assam": { residential: 8.25, commercial: 8.25, registration: 0 },
};

const STATES = Object.keys(STATE_RATES).sort();

const LABELS: Record<Locale, {
  noteHeading: string;
  noteBody: string;
  propertyValue: string;
  state: string;
  propertyType: string;
  residential: string;
  commercial: string;
  resultTitle: (state: string) => string;
  propertyValueRow: string;
  stampDutyRow: string;
  registrationRow: string;
  totalDutyTitle: string;
  totalCostTitle: string;
  disclaimerHeading: string;
  disclaimerBody: string;
  ph_value: string;
}> = {
  "en-IN": {
    noteHeading: "Note:",
    noteBody: "Stamp duty rates are approximate and may vary based on gender, property location, and local municipal regulations. Women buyers often get a 1-2% concession in many states.",
    propertyValue: "Property Value ₹",
    state: "State",
    propertyType: "Property Type",
    residential: "Residential",
    commercial: "Commercial",
    resultTitle: (state) => `Stamp Duty & Registration for ${state}`,
    propertyValueRow: "Property Value",
    stampDutyRow: "Stamp Duty",
    registrationRow: "Registration Charges",
    totalDutyTitle: "Total Duty & Registration",
    totalCostTitle: "Total Cost (Property + Charges)",
    disclaimerHeading: "Disclaimer",
    disclaimerBody: "Stamp duty rates are approximate state-level rates. Actual charges vary by property type and location. Consult Sub-Registrar office.",
    ph_value: "e.g. 5000000",
  },
  "hi-IN": {
    noteHeading: "ध्यान दें:",
    noteBody: "स्टाम्प ड्यूटी की दरें अनुमानित हैं और लिंग, संपत्ति के स्थान और स्थानीय नगरपालिका नियमों के आधार पर बदल सकती हैं। कई राज्यों में महिला खरीदारों को 1-2% की छूट मिलती है।",
    propertyValue: "संपत्ति का मूल्य ₹",
    state: "राज्य",
    propertyType: "संपत्ति का प्रकार",
    residential: "आवासीय",
    commercial: "व्यावसायिक",
    resultTitle: (state) => `${state} में स्टाम्प ड्यूटी और रजिस्ट्रेशन`,
    propertyValueRow: "संपत्ति का मूल्य",
    stampDutyRow: "स्टाम्प ड्यूटी",
    registrationRow: "रजिस्ट्रेशन शुल्क",
    totalDutyTitle: "कुल ड्यूटी और रजिस्ट्रेशन",
    totalCostTitle: "कुल लागत (संपत्ति + शुल्क)",
    disclaimerHeading: "अस्वीकरण",
    disclaimerBody: "स्टाम्प ड्यूटी की दरें अनुमानित राज्य-स्तरीय दरें हैं। वास्तविक शुल्क संपत्ति प्रकार और स्थान के अनुसार बदलते हैं। सब-रजिस्ट्रार कार्यालय से सलाह लें।",
    ph_value: "उदा. 5000000",
  },
};

export default function StampDutyCalculator({ locale = "en-IN" }: { locale?: Locale } = {}) {
  const t = LABELS[locale] ?? LABELS["en-IN"];
  const [propertyValue, setPropertyValue] = useState("");
  const [state, setState] = useState("Maharashtra");
  const [propertyType, setPropertyType] = useState<"residential" | "commercial">("residential");

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  const result = useMemo(() => {
    const value = parseFloat(propertyValue);
    if (!value || value <= 0) return null;

    const rates = STATE_RATES[state];
    const stampDutyRate = rates[propertyType];
    const registrationRate = rates.registration;

    const stampDuty = (value * stampDutyRate) / 100;
    const registration = (value * registrationRate) / 100;
    const total = stampDuty + registration;
    const totalWithProperty = value + total;

    return { stampDutyRate, registrationRate, stampDuty, registration, total, totalWithProperty };
  }, [propertyValue, state, propertyType]);

  // For result-section labels we always need the rate-percent text — use
  // the current state's rate even when no property value entered yet.
  const currentRates = STATE_RATES[state];
  const currentStampDutyRate = currentRates[propertyType];
  const currentRegistrationRate = currentRates.registration;

  return (
    <div className="space-y-6">
      {/* State-wise stamp duty changes frequently (mini-budgets, women's
          discounts, festive concessions). Our 20-state table is a
          representative reference but must be verified with the state's
          IGRS / Sub-Registrar portal before any actual property transaction. */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        <strong>{t.noteHeading}</strong> {t.noteBody}
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-2.5 text-xs text-blue-800">
        <span className="font-semibold">📅 Rate-table last reviewed: 8 June 2026</span>{" "}
        · States periodically revise stamp duty (mini-budgets, women&apos;s
        concessions, festive discounts). For any actual transaction,
        verify the current rate with your state&apos;s IGRS / Sub-Registrar
        portal before signing the sale deed.
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">{t.propertyValue}</label>
          <input
            type="number"
            placeholder={t.ph_value}
            value={propertyValue}
            onChange={(e) => setPropertyValue(e.target.value)}
            className="calc-input"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">{t.state}</label>
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="calc-input"
          >
            {STATES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">{t.propertyType}</label>
        <div className="flex gap-2">
          <button
            onClick={() => setPropertyType("residential")}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              propertyType === "residential"
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {t.residential}
          </button>
          <button
            onClick={() => setPropertyType("commercial")}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              propertyType === "commercial"
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {t.commercial}
          </button>
        </div>
      </div>

      {/* Result panel renders ALWAYS — Phase 6 Round 3b SSR fix.
          Static Devanagari labels (स्टाम्प ड्यूटी, रजिस्ट्रेशन शुल्क,
          कुल ड्यूटी, कुल लागत) must be in initial SSR HTML for AI
          training crawlers without JS execution. Values render as "—"
          placeholder when no property value entered. */}
      <div className="result-card space-y-4">
        <h3 className="text-sm font-bold text-gray-700 text-center mb-3">
          {t.resultTitle(state)}
        </h3>

        <div className="space-y-3">
          <div className="flex justify-between items-center bg-white rounded-lg p-3 shadow-sm">
            <span className="text-sm text-gray-600">{t.propertyValueRow}</span>
            <span className="text-sm font-bold text-gray-800">{result ? fmt(parseFloat(propertyValue)) : "—"}</span>
          </div>
          <div className="flex justify-between items-center bg-white rounded-lg p-3 shadow-sm">
            <span className="text-sm text-gray-600">{t.stampDutyRow} ({currentStampDutyRate}%)</span>
            <span className="text-sm font-bold text-red-500">{result ? fmt(result.stampDuty) : "—"}</span>
          </div>
          <div className="flex justify-between items-center bg-white rounded-lg p-3 shadow-sm">
            <span className="text-sm text-gray-600">{t.registrationRow} ({currentRegistrationRate}%)</span>
            <span className="text-sm font-bold text-orange-500">{result ? fmt(result.registration) : "—"}</span>
          </div>
        </div>

        <div className="border-t-2 border-dashed border-indigo-200 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-red-50 rounded-xl p-4 text-center border border-red-200">
              <div className="text-xs font-medium text-red-700 mb-1">{t.totalDutyTitle}</div>
              <div className="text-3xl font-extrabold text-red-500">{result ? fmt(result.total) : "—"}</div>
            </div>
            <div className="bg-indigo-50 rounded-xl p-4 text-center border border-indigo-200">
              <div className="text-xs font-medium text-indigo-700 mb-1">{t.totalCostTitle}</div>
              <div className="text-3xl font-extrabold text-indigo-600">{result ? fmt(result.totalWithProperty) : "—"}</div>
            </div>
          </div>
        </div>
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
