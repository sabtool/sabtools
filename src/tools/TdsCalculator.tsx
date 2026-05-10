"use client";
import { useState, useMemo } from "react";

/**
 * TDS Calculator — locale-aware labels (Phase 6 Round 3b Task B).
 * "TDS" stays as टीडीएस (Devanagari transliteration) — what every Form 16,
 * Form 26AS, and the Income Tax e-filing portal Hindi UI uses. Section
 * numbers (192, 194-IB, 194A, 194J, 194H, 194C, 194-IA) are language
 * neutral — they're statutory references.
 *
 * Result panel renders ALWAYS so the static Devanagari labels (भुगतान
 * राशि, काटा गया टीडीएस, शुद्ध प्राप्त राशि) are present in SSR HTML for
 * AI training crawlers without JS.
 */
type Locale = "en-IN" | "hi-IN";

type LocLabel = { label: string; description: string };
type LocMap = Record<string, LocLabel>;

const TDS_RATES: { key: string; rate: number }[] = [
  { key: "salary", rate: 10 },
  { key: "rent", rate: 5 },
  { key: "interest", rate: 10 },
  { key: "professional", rate: 10 },
  { key: "commission", rate: 5 },
  { key: "contractor", rate: 1 },
  { key: "contractor_co", rate: 2 },
  { key: "property", rate: 1 },
];

const TDS_LOC: Record<Locale, LocMap> = {
  "en-IN": {
    salary: { label: "Salary (Sec 192)", description: "TDS on salary as per income tax slab" },
    rent: { label: "Rent > ₹50,000/month (Sec 194-IB)", description: "TDS on rent exceeding ₹50,000/month" },
    interest: { label: "Interest on FD (Sec 194A)", description: "TDS on interest income exceeding ₹40,000" },
    professional: { label: "Professional Fees (Sec 194J)", description: "TDS on professional/technical services" },
    commission: { label: "Commission (Sec 194H)", description: "TDS on commission or brokerage" },
    contractor: { label: "Contractor Payment (Sec 194C)", description: "TDS on contractor payments (Individual)" },
    contractor_co: { label: "Contractor - Company (Sec 194C)", description: "TDS on contractor payments (Company)" },
    property: { label: "Property Sale (Sec 194-IA)", description: "TDS on property sale above ₹50 lakh" },
  },
  "hi-IN": {
    salary: { label: "वेतन (धारा 192)", description: "इनकम टैक्स स्लैब के अनुसार वेतन पर टीडीएस" },
    rent: { label: "किराया > ₹50,000/महीना (धारा 194-IB)", description: "₹50,000/महीना से अधिक किराए पर टीडीएस" },
    interest: { label: "एफडी पर ब्याज (धारा 194A)", description: "₹40,000 से अधिक ब्याज आय पर टीडीएस" },
    professional: { label: "पेशेवर फ़ीस (धारा 194J)", description: "पेशेवर/तकनीकी सेवाओं पर टीडीएस" },
    commission: { label: "कमीशन (धारा 194H)", description: "कमीशन या ब्रोकरेज पर टीडीएस" },
    contractor: { label: "ठेकेदार भुगतान (धारा 194C)", description: "ठेकेदार भुगतान पर टीडीएस (व्यक्ति)" },
    contractor_co: { label: "ठेकेदार - कंपनी (धारा 194C)", description: "ठेकेदार भुगतान पर टीडीएस (कंपनी)" },
    property: { label: "संपत्ति बिक्री (धारा 194-IA)", description: "₹50 लाख से ऊपर संपत्ति बिक्री पर टीडीएस" },
  },
};

const UI_LABELS: Record<Locale, {
  introHeading: string;
  introBody: string;
  tdsType: string;
  rateLabel: string;
  paymentAmount: string;
  panAvailable: string;
  yesNormal: string;
  noPenalty: string;
  paymentAmountResult: string;
  tdsDeducted: string;
  netAmountReceived: string;
  netAmountBar: string;
  tdsBar: string;
  noPanWarning: string;
  ph_amount: string;
}> = {
  "en-IN": {
    introHeading: "TDS (Tax Deducted at Source)",
    introBody: "is deducted by the payer at the time of payment. If PAN is not provided, TDS is deducted at 20%.",
    tdsType: "TDS Type",
    rateLabel: "Rate",
    paymentAmount: "Payment Amount ₹",
    panAvailable: "PAN Available?",
    yesNormal: "Yes (Normal Rate)",
    noPenalty: "No (20% TDS)",
    paymentAmountResult: "Payment Amount",
    tdsDeducted: "TDS Deducted",
    netAmountReceived: "Net Amount Received",
    netAmountBar: "Net Amount",
    tdsBar: "TDS",
    noPanWarning: "Higher TDS of 20% applied due to non-availability of PAN (Section 206AA)",
    ph_amount: "e.g. 500000",
  },
  "hi-IN": {
    introHeading: "टीडीएस (स्रोत पर कर कटौती)",
    introBody: "भुगतान के समय भुगतानकर्ता द्वारा काटा जाता है। यदि पैन उपलब्ध नहीं है, तो टीडीएस 20% की दर से काटा जाता है।",
    tdsType: "टीडीएस प्रकार",
    rateLabel: "दर",
    paymentAmount: "भुगतान राशि ₹",
    panAvailable: "क्या पैन उपलब्ध है?",
    yesNormal: "हाँ (सामान्य दर)",
    noPenalty: "नहीं (20% टीडीएस)",
    paymentAmountResult: "भुगतान राशि",
    tdsDeducted: "काटा गया टीडीएस",
    netAmountReceived: "शुद्ध प्राप्त राशि",
    netAmountBar: "शुद्ध राशि",
    tdsBar: "टीडीएस",
    noPanWarning: "पैन की अनुपलब्धता के कारण 20% की उच्च टीडीएस दर लागू (धारा 206AA)",
    ph_amount: "उदा. 500000",
  },
};

export default function TdsCalculator({ locale = "en-IN" }: { locale?: Locale } = {}) {
  const t = UI_LABELS[locale] ?? UI_LABELS["en-IN"];
  const types = TDS_LOC[locale] ?? TDS_LOC["en-IN"];

  const [selectedType, setSelectedType] = useState("salary");
  const [amount, setAmount] = useState("");
  const [hasPan, setHasPan] = useState(true);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  const currentType = TDS_RATES.find((x) => x.key === selectedType)!;
  const currentTypeLoc = types[selectedType];

  const result = useMemo(() => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return null;

    const rate = hasPan ? currentType.rate : 20;
    const tdsAmount = (amt * rate) / 100;
    const netAmount = amt - tdsAmount;

    return { tdsAmount, netAmount, rate };
  }, [amount, hasPan, currentType]);

  return (
    <div className="space-y-6">
      <div className="bg-violet-50 border border-violet-200 rounded-xl p-4 text-sm text-violet-800">
        <strong>{t.introHeading}</strong> {t.introBody}
      </div>

      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">{t.tdsType}</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {TDS_RATES.map((tds) => (
            <button
              key={tds.key}
              onClick={() => setSelectedType(tds.key)}
              className={`text-left p-3 rounded-lg border-2 transition-all text-sm ${
                selectedType === tds.key
                  ? "border-indigo-500 bg-indigo-50 text-indigo-700 font-semibold"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              }`}
            >
              <div className="font-medium">{types[tds.key].label}</div>
              <div className="text-xs mt-0.5 opacity-75">{t.rateLabel}: {tds.rate}%</div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">{t.paymentAmount}</label>
          <input
            type="number"
            placeholder={t.ph_amount}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="calc-input"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">{t.panAvailable}</label>
          <div className="flex gap-2 mt-1">
            <button
              onClick={() => setHasPan(true)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                hasPan ? "bg-green-600 text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {t.yesNormal}
            </button>
            <button
              onClick={() => setHasPan(false)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                !hasPan ? "bg-red-600 text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {t.noPenalty}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600">
        <strong>{currentTypeLoc.label}:</strong> {currentTypeLoc.description}
      </div>

      {/* Result panel renders ALWAYS — Phase 6 Round 3b SSR fix.
          Static Devanagari labels (भुगतान राशि, काटा गया टीडीएस, शुद्ध
          प्राप्त राशि) must be in initial SSR HTML for AI training
          crawlers without JS. Values render as "—" when no input. */}
      <div className="result-card space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-xs font-medium text-gray-500 mb-1">{t.paymentAmountResult}</div>
            <div className="text-2xl font-extrabold text-gray-800">{result ? fmt(parseFloat(amount)) : "—"}</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-xs font-medium text-gray-500 mb-1">{t.tdsDeducted} ({result ? `${result.rate}%` : "—"})</div>
            <div className="text-2xl font-extrabold text-red-500">{result ? fmt(result.tdsAmount) : "—"}</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-xs font-medium text-gray-500 mb-1">{t.netAmountReceived}</div>
            <div className="text-2xl font-extrabold text-green-600">{result ? fmt(result.netAmount) : "—"}</div>
          </div>
        </div>
        {result && (
          <>
            <div>
              <div className="h-4 rounded-full bg-red-200 overflow-hidden">
                <div
                  className="h-full rounded-full bg-green-500 transition-all duration-500"
                  style={{ width: `${(result.netAmount / parseFloat(amount)) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-xs font-medium text-gray-500 mt-2">
                <span className="text-green-600">{t.netAmountBar} ({((result.netAmount / parseFloat(amount)) * 100).toFixed(1)}%)</span>
                <span className="text-red-500">{t.tdsBar} ({result.rate}%)</span>
              </div>
            </div>
            {!hasPan && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600 text-center">
                {t.noPanWarning}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
