"use client";
import { useState, useMemo } from "react";

/**
 * Capital Gains Tax Calculator (India) — FY 2025-26 / AY 2026-27
 *
 * VERIFIED DATA SOURCES:
 *
 * The Finance (No. 2) Act, 2024 made significant changes to capital gains tax
 * effective 23 July 2024. This calculator implements the post-Budget-2024 rates.
 *
 * 1. Section 111A — STCG on listed equity shares & equity-oriented MFs:
 *    - Rate: 20% (was 15% pre 23-Jul-2024)
 *    - Holding period: ≤ 12 months = STCG; > 12 months = LTCG
 *
 * 2. Section 112A — LTCG on listed equity shares & equity-oriented MFs:
 *    - Rate: 12.5% (was 10% pre 23-Jul-2024)
 *    - Annual exemption: ₹1,25,000 per FY (raised from ₹1L by Finance Act 2024)
 *    - No indexation
 *
 * 3. Section 112 — LTCG on immovable property, gold, unlisted shares, etc.:
 *    - Default rate post 23-Jul-2024: 12.5% WITHOUT indexation
 *    - Grandfathering option for resident individuals/HUFs on immovable property
 *      acquired BEFORE 23-Jul-2024: 20% WITH indexation (lower of the two)
 *    - Holding period: > 24 months for property, gold, unlisted shares
 *
 * 4. Debt mutual funds purchased ON OR AFTER 1-Apr-2023:
 *    - ALWAYS taxed at applicable slab rate regardless of holding period
 *    - No LTCG benefit (Finance Act 2023 change)
 *
 * 5. Surcharge slabs (FY 2025-26):
 *    - Capped at 15% for Section 111A & 112A income (no 25%/37% slab)
 *    - Capped at 25% for Section 112 income (no 37% slab)
 *
 * 6. Health & Education Cess: 4% on (tax + surcharge) per Sec 2(11) Finance Act 2025.
 *
 * Phase 6 Round 3b Task B — locale-aware labels. Statutory section numbers,
 * percentages, and date thresholds stay in English/numeric form because they
 * are statutory references — translating "Section 112A" into Devanagari
 * would break the link to the underlying Income Tax Act citation.
 */

type AssetType =
  | "equity_listed"
  | "property"
  | "gold_unlisted"
  | "debt_mf_post_apr_2023"
  | "debt_mf_pre_apr_2023";

type Locale = "en-IN" | "hi-IN";

const ASSET_LABELS: Record<Locale, Record<AssetType, string>> = {
  "en-IN": {
    equity_listed: "Listed Equity / Equity MF (Sec 111A / 112A)",
    property: "Immovable Property (Sec 112)",
    gold_unlisted: "Gold / Jewellery / Unlisted Shares (Sec 112)",
    debt_mf_post_apr_2023: "Debt MF — bought on/after 1 Apr 2023 (slab rate)",
    debt_mf_pre_apr_2023: "Debt MF — bought before 1 Apr 2023 (Sec 112)",
  },
  "hi-IN": {
    equity_listed: "लिस्टेड इक्विटी / इक्विटी MF (धारा 111A / 112A)",
    property: "अचल संपत्ति (धारा 112)",
    gold_unlisted: "सोना / आभूषण / अनलिस्टेड शेयर (धारा 112)",
    debt_mf_post_apr_2023: "डेट MF — 1 अप्रैल 2023 के बाद खरीदा (स्लैब दर)",
    debt_mf_pre_apr_2023: "डेट MF — 1 अप्रैल 2023 से पहले खरीदा (धारा 112)",
  },
};

const UI: Record<Locale, {
  badge: string;
  assetType: string;
  purchasePrice: string;
  salePrice: string;
  purchaseDate: string;
  saleDate: string;
  otherIncome: string;
  otherIncomeNote: string;
  exemptionUsed: string;
  exemptionUsedNote: string;
  grandHeading: string;
  grandBody: string;
  indexedCostLabel: string;
  indexedCostPlaceholder: string;
  indexedCostNote: string;
  holdingPeriod: string;
  monthsSuffix: string;
  longTerm: string;
  shortTerm: string;
  capitalLoss: string;
  capitalGain: string;
  totalTax: string;
  netInHand: string;
  taxBreakdownHeading: (rateLabel: string) => string;
  exemptionApplied: string;
  baseTax: string;
  surchargeRow: (rate: string, base: string) => string;
  cess: string;
  totalTaxRow: string;
  effectiveRate: string;
  indexationApplied: string;
  lossNote: string;
  verifiedHeading: string;
  verifiedRules: string[];
  disclaimerHeading: string;
  disclaimerBody: string;
  rate_111A_LT: string;
  rate_111A_ST: string;
  rate_112A_LT: string;
  rate_112_LT_with_index: string;
  rate_112_LT_no_index: string;
  rate_slab_debt: string;
  rate_slab_other: string;
  rate_no_tax_loss: string;
  surcharge_eq: string;
  surcharge_other: string;
  surcharge_standard: string;
}> = {
  "en-IN": {
    badge: "📊 FY 2025-26 · Post-Budget 2024 Rates · Section 111A / 112 / 112A",
    assetType: "Asset Type",
    purchasePrice: "Purchase Price (₹)",
    salePrice: "Sale Price (₹)",
    purchaseDate: "Purchase Date",
    saleDate: "Sale Date",
    otherIncome: "Your Other Annual Income (₹)",
    otherIncomeNote: "Used for surcharge slab determination & for slab-rate STCG.",
    exemptionUsed: "₹1.25L LTCG Exemption Already Used This FY (₹)",
    exemptionUsedNote: "The ₹1,25,000 Sec 112A exemption is per FY across all listed equity LTCG. Enter what you've already claimed.",
    grandHeading: "🏛️ Property bought before 23 July 2024 — Grandfathering Available",
    grandBody: "For immovable property acquired before Budget 2024 (23 July 2024), resident individuals/HUFs can choose the LOWER of: (a) 12.5% on gain WITHOUT indexation, OR (b) 20% on gain WITH indexation.",
    indexedCostLabel: "Indexed Cost of Acquisition (₹) — leave blank if you don't want to apply indexation",
    indexedCostPlaceholder: "Compute via CII (Cost Inflation Index)",
    indexedCostNote: "Indexed cost = Purchase price × (CII of sale year ÷ CII of purchase year). The calculator applies whichever option produces lower tax.",
    holdingPeriod: "Holding Period",
    monthsSuffix: "months",
    longTerm: "Long-term",
    shortTerm: "Short-term",
    capitalLoss: "Capital Loss",
    capitalGain: "Capital Gain",
    totalTax: "Total Tax",
    netInHand: "Net In Hand",
    taxBreakdownHeading: (rateLabel) => `Tax Breakdown (${rateLabel})`,
    exemptionApplied: "₹1.25L Sec 112A exemption applied",
    baseTax: "Base tax",
    surchargeRow: (rate, base) => `Surcharge (${rate} — ${base})`,
    cess: "Health & Education Cess (4%)",
    totalTaxRow: "Total tax",
    effectiveRate: "Effective tax rate on gain:",
    indexationApplied: "Indexation grandfathering applied: 20% with indexation produced lower tax than 12.5% without — you should opt for the indexed treatment when filing.",
    lossNote: "💡 Capital loss treatment: Unlike crypto losses, regular capital losses CAN be set off against capital gains (LTCG losses against LTCG only, STCG losses against any capital gain) and carried forward up to 8 assessment years. Mention this loss in your ITR to preserve carry-forward.",
    verifiedHeading: "Verified rules (FY 2025-26 / AY 2026-27):",
    verifiedRules: [
      "STCG on listed equity: 20% (Section 111A, raised from 15% by Budget 2024 effective 23-Jul-2024). Holding period: ≤12 months.",
      "LTCG on listed equity: 12.5% (Section 112A, raised from 10% by Budget 2024). Annual exemption: ₹1,25,000/FY (raised from ₹1L). Holding period: >12 months.",
      "LTCG on property/gold/unlisted: 12.5% without indexation (Section 112). Property bought before 23-Jul-2024 by resident individuals/HUFs has the option of 20% with indexation — calculator picks the lower automatically. Holding period: >24 months.",
      "Debt MFs bought on/after 1-Apr-2023: always taxed at slab rates regardless of holding period (Finance Act 2023).",
      "Surcharge capped at 15% for Sec 111A/112A income; at 25% for Sec 112 income. 4% Health & Education Cess applies on (tax + surcharge).",
    ],
    disclaimerHeading: "Disclaimer:",
    disclaimerBody: "This calculator handles the most common scenarios. NOT covered: Section 54/54F home reinvestment exemption, Section 54EC bond exemption, set-off and carry-forward of capital losses across years, ESOP/RSU specific rules, foreign assets, non-resident taxation. For complex cases consult a Chartered Accountant. Official reference:",
    rate_111A_LT: "12.5% LTCG (Section 112A, post-Budget 2024)",
    rate_111A_ST: "20% STCG (Section 111A, post-Budget 2024)",
    rate_112A_LT: "12.5% LTCG (Section 112A, post-Budget 2024)",
    rate_112_LT_with_index: "20% LTCG with indexation (Section 112 — grandfathered choice)",
    rate_112_LT_no_index: "12.5% LTCG without indexation (Section 112)",
    rate_slab_debt: "Slab rate (Finance Act 2023)",
    rate_slab_other: "Slab rate (STCG on non-equity assets)",
    rate_no_tax_loss: "No tax (loss)",
    surcharge_eq: "Section 111A/112A surcharge cap: 15%",
    surcharge_other: "Section 112 surcharge cap: 25%",
    surcharge_standard: "Standard surcharge slabs",
  },
  "hi-IN": {
    badge: "📊 FY 2025-26 · पोस्ट-बजट 2024 दरें · धारा 111A / 112 / 112A",
    assetType: "संपत्ति प्रकार",
    purchasePrice: "खरीद मूल्य (₹)",
    salePrice: "बिक्री मूल्य (₹)",
    purchaseDate: "खरीद तिथि",
    saleDate: "बिक्री तिथि",
    otherIncome: "आपकी अन्य वार्षिक आय (₹)",
    otherIncomeNote: "सरचार्ज स्लैब और स्लैब-दर STCG के लिए इस्तेमाल होती है।",
    exemptionUsed: "इस FY में पहले से इस्तेमाल की गई ₹1.25 लाख LTCG छूट (₹)",
    exemptionUsedNote: "₹1,25,000 की धारा 112A छूट हर FY में लिस्टेड इक्विटी LTCG पर लागू होती है। पहले से जो दावा कर चुके हैं वह दर्ज करें।",
    grandHeading: "🏛️ 23 जुलाई 2024 से पहले खरीदी गई संपत्ति — ग्रैंडफादरिंग उपलब्ध",
    grandBody: "बजट 2024 (23 जुलाई 2024) से पहले खरीदी गई अचल संपत्ति पर निवासी व्यक्ति/HUF दो में से कम वाला विकल्प चुन सकते हैं: (a) इंडेक्सेशन के बिना 12.5%, या (b) इंडेक्सेशन के साथ 20%।",
    indexedCostLabel: "इंडेक्स्ड कॉस्ट ऑफ़ ऐक्विज़िशन (₹) — अगर इंडेक्सेशन नहीं चाहिए तो खाली छोड़ें",
    indexedCostPlaceholder: "CII (कॉस्ट इंफ्लेशन इंडेक्स) से गणना करें",
    indexedCostNote: "इंडेक्स्ड कॉस्ट = खरीद मूल्य × (बिक्री वर्ष का CII ÷ खरीद वर्ष का CII)। कैलकुलेटर वह विकल्प लागू करता है जिसमें कम टैक्स लगे।",
    holdingPeriod: "होल्डिंग अवधि",
    monthsSuffix: "महीने",
    longTerm: "लॉन्ग-टर्म",
    shortTerm: "शॉर्ट-टर्म",
    capitalLoss: "कैपिटल लॉस",
    capitalGain: "कैपिटल गेन",
    totalTax: "कुल टैक्स",
    netInHand: "शुद्ध हाथ में",
    taxBreakdownHeading: (rateLabel) => `टैक्स ब्रेकडाउन (${rateLabel})`,
    exemptionApplied: "₹1.25 लाख धारा 112A छूट लागू",
    baseTax: "बेस टैक्स",
    surchargeRow: (rate, base) => `सरचार्ज (${rate} — ${base})`,
    cess: "हेल्थ एंड एजुकेशन सेस (4%)",
    totalTaxRow: "कुल टैक्स",
    effectiveRate: "गेन पर प्रभावी टैक्स दर:",
    indexationApplied: "इंडेक्सेशन ग्रैंडफादरिंग लागू: इंडेक्सेशन के साथ 20% पर टैक्स, बिना इंडेक्सेशन 12.5% से कम बना — फ़ाइलिंग के समय इंडेक्स्ड ट्रीटमेंट चुनें।",
    lossNote: "💡 कैपिटल लॉस का इलाज: क्रिप्टो लॉस के विपरीत, सामान्य कैपिटल लॉस को कैपिटल गेन के साथ सेट-ऑफ़ किया जा सकता है (LTCG लॉस सिर्फ़ LTCG से, STCG लॉस किसी भी कैपिटल गेन से) और 8 असेसमेंट साल तक कैरी-फ़ॉरवर्ड किया जा सकता है। कैरी-फ़ॉरवर्ड बचाने के लिए ITR में इस लॉस का ज़िक्र करें।",
    verifiedHeading: "सत्यापित नियम (FY 2025-26 / AY 2026-27):",
    verifiedRules: [
      "लिस्टेड इक्विटी पर STCG: 20% (धारा 111A, बजट 2024 में 15% से बढ़ाई गई, 23-जुलाई-2024 से प्रभावी)। होल्डिंग अवधि: ≤12 महीने।",
      "लिस्टेड इक्विटी पर LTCG: 12.5% (धारा 112A, बजट 2024 में 10% से बढ़ाई गई)। वार्षिक छूट: ₹1,25,000/FY (₹1 लाख से बढ़ाई गई)। होल्डिंग अवधि: >12 महीने।",
      "संपत्ति/सोना/अनलिस्टेड पर LTCG: इंडेक्सेशन के बिना 12.5% (धारा 112)। 23-जुलाई-2024 से पहले खरीदी संपत्ति पर निवासी व्यक्ति/HUF को इंडेक्सेशन के साथ 20% का विकल्प मिलता है — कैलकुलेटर अपने आप कम टैक्स वाला चुनता है। होल्डिंग अवधि: >24 महीने।",
      "1-अप्रैल-2023 के बाद खरीदा डेट MF: होल्डिंग अवधि कुछ भी हो, हमेशा स्लैब दर पर टैक्स (फाइनेंस एक्ट 2023)।",
      "धारा 111A/112A आय पर सरचार्ज 15% पर कैप; धारा 112 आय पर 25% कैप। (टैक्स + सरचार्ज) पर 4% हेल्थ एंड एजुकेशन सेस लगता है।",
    ],
    disclaimerHeading: "अस्वीकरण:",
    disclaimerBody: "यह कैलकुलेटर सबसे सामान्य परिस्थितियाँ संभालता है। शामिल नहीं: धारा 54/54F पुनर्निवेश छूट, धारा 54EC बॉन्ड छूट, सालों में कैपिटल लॉस का सेट-ऑफ़ और कैरी-फ़ॉरवर्ड, ESOP/RSU विशेष नियम, विदेशी संपत्ति, अप्रवासी कराधान। जटिल मामलों के लिए चार्टर्ड अकाउंटेंट से सलाह लें। आधिकारिक संदर्भ:",
    rate_111A_LT: "12.5% LTCG (धारा 112A, पोस्ट-बजट 2024)",
    rate_111A_ST: "20% STCG (धारा 111A, पोस्ट-बजट 2024)",
    rate_112A_LT: "12.5% LTCG (धारा 112A, पोस्ट-बजट 2024)",
    rate_112_LT_with_index: "इंडेक्सेशन के साथ 20% LTCG (धारा 112 — ग्रैंडफादरिंग विकल्प)",
    rate_112_LT_no_index: "इंडेक्सेशन के बिना 12.5% LTCG (धारा 112)",
    rate_slab_debt: "स्लैब दर (फाइनेंस एक्ट 2023)",
    rate_slab_other: "स्लैब दर (नॉन-इक्विटी संपत्ति पर STCG)",
    rate_no_tax_loss: "कोई टैक्स नहीं (लॉस)",
    surcharge_eq: "धारा 111A/112A सरचार्ज कैप: 15%",
    surcharge_other: "धारा 112 सरचार्ज कैप: 25%",
    surcharge_standard: "मानक सरचार्ज स्लैब",
  },
};

function holdingMonths(buy: string, sell: string): number {
  if (!buy || !sell) return 0;
  const bd = new Date(buy);
  const sd = new Date(sell);
  if (isNaN(bd.getTime()) || isNaN(sd.getTime())) return 0;
  const months =
    (sd.getFullYear() - bd.getFullYear()) * 12 +
    (sd.getMonth() - bd.getMonth()) -
    (sd.getDate() < bd.getDate() ? 1 : 0);
  return Math.max(0, months);
}

function isLongTerm(asset: AssetType, months: number): boolean {
  if (asset === "equity_listed") return months > 12;
  if (asset === "debt_mf_post_apr_2023") return false;
  return months > 24;
}

function isPropertyPreBudget(asset: AssetType, buyDate: string): boolean {
  if (asset !== "property") return false;
  if (!buyDate) return false;
  const cutoff = new Date("2024-07-23");
  const bd = new Date(buyDate);
  return !isNaN(bd.getTime()) && bd < cutoff;
}

function getEquitySurchargeRate(totalIncome: number): number {
  if (totalIncome <= 5_000_000) return 0;
  if (totalIncome <= 10_000_000) return 0.10;
  return 0.15;
}

function getOtherAssetSurchargeRate(totalIncome: number): number {
  if (totalIncome <= 5_000_000) return 0;
  if (totalIncome <= 10_000_000) return 0.10;
  if (totalIncome <= 20_000_000) return 0.15;
  return 0.25;
}

function getSlabTax(income: number): number {
  const slabs = [
    { upto: 400_000, rate: 0 },
    { upto: 800_000, rate: 0.05 },
    { upto: 1_200_000, rate: 0.10 },
    { upto: 1_600_000, rate: 0.15 },
    { upto: 2_000_000, rate: 0.20 },
    { upto: 2_400_000, rate: 0.25 },
    { upto: Infinity, rate: 0.30 },
  ];
  let tax = 0;
  let prev = 0;
  for (const s of slabs) {
    if (income <= prev) break;
    const taxable = Math.min(income, s.upto) - prev;
    tax += taxable * s.rate;
    prev = s.upto;
    if (income <= s.upto) break;
  }
  return tax;
}

export default function CapitalGainsTaxCalculator({ locale = "en-IN" }: { locale?: Locale } = {}) {
  const t = UI[locale] ?? UI["en-IN"];
  const assetLabels = ASSET_LABELS[locale] ?? ASSET_LABELS["en-IN"];

  const [assetType, setAssetType] = useState<AssetType>("equity_listed");
  const [purchasePrice, setPurchasePrice] = useState<string>("100000");
  const [salePrice, setSalePrice] = useState<string>("200000");
  const [purchaseDate, setPurchaseDate] = useState<string>("2023-01-01");
  const [saleDate, setSaleDate] = useState<string>("2025-06-01");
  const [otherIncome, setOtherIncome] = useState<string>("1000000");
  const [usedExemption, setUsedExemption] = useState<string>("0");
  const [indexedCost, setIndexedCost] = useState<string>("");

  const result = useMemo(() => {
    const buy = parseFloat(purchasePrice);
    const sell = parseFloat(salePrice);
    const other = parseFloat(otherIncome) || 0;
    const exUsed = parseFloat(usedExemption) || 0;
    const indexed = parseFloat(indexedCost) || 0;

    if (isNaN(buy) || isNaN(sell) || buy < 0 || sell < 0) return null;

    const months = holdingMonths(purchaseDate, saleDate);
    const lt = isLongTerm(assetType, months);
    const grossGain = sell - buy;
    const isLoss = grossGain < 0;

    const propertyGrandfatheringAvailable =
      assetType === "property" && lt && isPropertyPreBudget(assetType, purchaseDate);

    let baseRateLabel = "";
    let baseTax = 0;
    let exemptionApplied = 0;
    let surchargeRate = 0;
    let surchargeBaseDescription = "";
    let isSlabTaxed = false;
    let indexationOptionUsed: "none" | "without_indexation" | "with_indexation" = "none";

    if (isLoss) {
      baseRateLabel = t.rate_no_tax_loss;
    } else if (assetType === "debt_mf_post_apr_2023") {
      isSlabTaxed = true;
      baseRateLabel = t.rate_slab_debt;
      const taxOnTotal = getSlabTax(other + grossGain);
      const taxOnOther = getSlabTax(other);
      baseTax = taxOnTotal - taxOnOther;
      surchargeRate = getOtherAssetSurchargeRate(other + grossGain);
      surchargeBaseDescription = t.surcharge_standard;
    } else if (assetType === "equity_listed" && lt) {
      const annualExemptionLimit = 125_000;
      const exemptionAvailable = Math.max(0, annualExemptionLimit - exUsed);
      exemptionApplied = Math.min(grossGain, exemptionAvailable);
      const taxableGain = Math.max(0, grossGain - exemptionApplied);
      baseTax = taxableGain * 0.125;
      baseRateLabel = t.rate_111A_LT;
      surchargeRate = getEquitySurchargeRate(other + grossGain);
      surchargeBaseDescription = t.surcharge_eq;
    } else if (assetType === "equity_listed" && !lt) {
      baseTax = grossGain * 0.20;
      baseRateLabel = t.rate_111A_ST;
      surchargeRate = getEquitySurchargeRate(other + grossGain);
      surchargeBaseDescription = t.surcharge_eq;
    } else if (lt) {
      const taxWithoutIndexation = grossGain * 0.125;

      if (propertyGrandfatheringAvailable && indexed > 0) {
        const indexedGain = Math.max(0, sell - indexed);
        const taxWithIndexation = indexedGain * 0.20;
        if (taxWithIndexation < taxWithoutIndexation) {
          baseTax = taxWithIndexation;
          baseRateLabel = t.rate_112_LT_with_index;
          indexationOptionUsed = "with_indexation";
        } else {
          baseTax = taxWithoutIndexation;
          baseRateLabel = t.rate_112_LT_no_index;
          indexationOptionUsed = "without_indexation";
        }
      } else {
        baseTax = taxWithoutIndexation;
        baseRateLabel = t.rate_112_LT_no_index;
        indexationOptionUsed = "without_indexation";
      }
      surchargeRate = getOtherAssetSurchargeRate(other + grossGain);
      surchargeBaseDescription = t.surcharge_other;
    } else {
      isSlabTaxed = true;
      baseRateLabel = t.rate_slab_other;
      const taxOnTotal = getSlabTax(other + grossGain);
      const taxOnOther = getSlabTax(other);
      baseTax = Math.max(0, taxOnTotal - taxOnOther);
      surchargeRate = getOtherAssetSurchargeRate(other + grossGain);
      surchargeBaseDescription = t.surcharge_standard;
    }

    const surcharge = baseTax * surchargeRate;
    const cess = (baseTax + surcharge) * 0.04;
    const totalTax = baseTax + surcharge + cess;
    const netInHand = sell - totalTax;
    const effectiveOnGain = grossGain > 0 ? (totalTax / grossGain) * 100 : 0;

    return {
      months,
      isLongTerm: lt,
      grossGain,
      isLoss,
      exemptionApplied,
      baseRateLabel,
      baseTax,
      isSlabTaxed,
      surchargeRate,
      surchargeBaseDescription,
      surcharge,
      cess,
      totalTax,
      netInHand,
      effectiveOnGain,
      propertyGrandfatheringAvailable,
      indexationOptionUsed,
    };
  }, [
    assetType,
    purchasePrice,
    salePrice,
    purchaseDate,
    saleDate,
    otherIncome,
    usedExemption,
    indexedCost,
    t,
  ]);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(n);
  const fmtPercent = (n: number) => `${n.toFixed(2)}%`;

  return (
    <div className="space-y-6">
      <div className="inline-block bg-emerald-100 text-emerald-800 text-sm font-semibold px-4 py-1.5 rounded-full">
        {t.badge}
      </div>

      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">
          {t.assetType}
        </label>
        <div className="grid grid-cols-1 gap-2">
          {(Object.keys(assetLabels) as AssetType[]).map((a) => (
            <button
              key={a}
              onClick={() => setAssetType(a)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium text-left transition ${
                assetType === a
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {assetLabels[a]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="cg-buy-price" className="text-sm font-semibold text-gray-700 block mb-2">
            {t.purchasePrice}
          </label>
          <input id="cg-buy-price" type="number" value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)} className="calc-input" />
        </div>
        <div>
          <label htmlFor="cg-sell-price" className="text-sm font-semibold text-gray-700 block mb-2">
            {t.salePrice}
          </label>
          <input id="cg-sell-price" type="number" value={salePrice} onChange={(e) => setSalePrice(e.target.value)} className="calc-input" />
        </div>
        <div>
          <label htmlFor="cg-buy-date" className="text-sm font-semibold text-gray-700 block mb-2">
            {t.purchaseDate}
          </label>
          <input id="cg-buy-date" type="date" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} className="calc-input" />
        </div>
        <div>
          <label htmlFor="cg-sell-date" className="text-sm font-semibold text-gray-700 block mb-2">
            {t.saleDate}
          </label>
          <input id="cg-sell-date" type="date" value={saleDate} onChange={(e) => setSaleDate(e.target.value)} className="calc-input" />
        </div>
        <div>
          <label htmlFor="cg-other-income" className="text-sm font-semibold text-gray-700 block mb-2">
            {t.otherIncome}
          </label>
          <input id="cg-other-income" type="number" value={otherIncome} onChange={(e) => setOtherIncome(e.target.value)} className="calc-input" />
          <p className="text-xs text-gray-500 mt-1">{t.otherIncomeNote}</p>
        </div>
        {assetType === "equity_listed" && (
          <div>
            <label htmlFor="cg-exemption-used" className="text-sm font-semibold text-gray-700 block mb-2">
              {t.exemptionUsed}
            </label>
            <input id="cg-exemption-used" type="number" value={usedExemption} onChange={(e) => setUsedExemption(e.target.value)} className="calc-input" />
            <p className="text-xs text-gray-500 mt-1">{t.exemptionUsedNote}</p>
          </div>
        )}
      </div>

      {result?.propertyGrandfatheringAvailable && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="font-semibold text-amber-900 text-sm mb-2">
            {t.grandHeading}
          </div>
          <p className="text-sm text-amber-800 mb-3">{t.grandBody}</p>
          <label className="text-xs font-semibold text-amber-900 block mb-1">
            {t.indexedCostLabel}
          </label>
          <input
            type="number"
            placeholder={t.indexedCostPlaceholder}
            value={indexedCost}
            onChange={(e) => setIndexedCost(e.target.value)}
            className="calc-input"
          />
          <p className="text-xs text-amber-700 mt-1">{t.indexedCostNote}</p>
        </div>
      )}

      {/* Result panel — defaults (purchasePrice="100000", salePrice="200000",
          purchaseDate="2023-01-01", saleDate="2025-06-01") yield a valid
          result on initial SSR, so the static Devanagari labels (होल्डिंग
          अवधि, कैपिटल गेन, कुल टैक्स, शुद्ध हाथ में, टैक्स ब्रेकडाउन)
          render server-side for AI training crawlers without JS execution. */}
      {result && (
        <div className="result-card space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">{t.holdingPeriod}</div>
              <div className="text-lg font-bold text-indigo-600">{result.months} {t.monthsSuffix}</div>
              <div className="text-[10px] text-gray-500">{result.isLongTerm ? t.longTerm : t.shortTerm}</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">{result.isLoss ? t.capitalLoss : t.capitalGain}</div>
              <div className={`text-xl font-bold ${result.isLoss ? "text-red-600" : "text-emerald-600"}`}>
                {fmt(Math.abs(result.grossGain))}
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">{t.totalTax}</div>
              <div className="text-xl font-bold text-red-700">{fmt(result.totalTax)}</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">{t.netInHand}</div>
              <div className="text-xl font-bold text-green-600">{fmt(result.netInHand)}</div>
            </div>
          </div>

          {!result.isLoss && (
            <div className="bg-white rounded-xl p-5 shadow-sm space-y-2 text-sm">
              <div className="font-semibold text-gray-700 mb-2">
                {t.taxBreakdownHeading(result.baseRateLabel)}
              </div>
              {result.exemptionApplied > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>{t.exemptionApplied}</span>
                  <span className="font-semibold">-{fmt(result.exemptionApplied)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">{t.baseTax}</span>
                <span className="font-semibold text-gray-900">{fmt(result.baseTax)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {t.surchargeRow(fmtPercent(result.surchargeRate * 100), result.surchargeBaseDescription)}
                </span>
                <span className="font-semibold text-gray-900">{fmt(result.surcharge)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t.cess}</span>
                <span className="font-semibold text-gray-900">{fmt(result.cess)}</span>
              </div>
              <div className="border-t pt-2 mt-2 flex justify-between">
                <span className="font-bold text-gray-700">{t.totalTaxRow}</span>
                <span className="font-bold text-red-700">{fmt(result.totalTax)}</span>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                {t.effectiveRate} <strong>{fmtPercent(result.effectiveOnGain)}</strong>
              </div>
              {result.indexationOptionUsed === "with_indexation" && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900 mt-2">
                  {t.indexationApplied}
                </div>
              )}
            </div>
          )}

          {result.isLoss && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-900 leading-relaxed">
              {t.lossNote}
            </div>
          )}
        </div>
      )}

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs text-gray-700 leading-relaxed space-y-2">
        <div>
          <strong>{t.verifiedHeading}</strong>
        </div>
        <ul className="list-disc list-inside space-y-1 ml-2">
          {t.verifiedRules.map((rule, i) => (
            <li key={i}>{rule}</li>
          ))}
        </ul>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-800 leading-relaxed">
        <span className="mr-1">ℹ️</span>
        <strong>{t.disclaimerHeading}</strong> {t.disclaimerBody}{" "}
        <a
          href="https://www.incometax.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="underline font-semibold text-blue-700 hover:text-blue-900"
        >
          incometax.gov.in
        </a>
        .
      </div>
    </div>
  );
}
