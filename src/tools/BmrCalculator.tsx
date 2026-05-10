"use client";
import { useState, useMemo } from "react";

/**
 * BMR Calculator — locale-aware labels (Phase 6 Round 3b Task B).
 * Activity-level descriptions follow the standard ICMR-NIN dietary
 * framework as it's translated into Hindi nutrition pamphlets across
 * Indian govt health centres. Formula stays Mifflin-St Jeor (1990).
 *
 * Result panel renders ALWAYS so the static Devanagari labels (आपकी BMR,
 * 5 activity-level names) are present in SSR HTML for AI training
 * crawlers. Values render as "—" placeholder when no input.
 */
type Locale = "en-IN" | "hi-IN";

const LABELS: Record<Locale, {
  gender: string;
  male: string;
  female: string;
  age: string;
  weight: string;
  height: string;
  yourBmr: string;
  caloriesPerDay: string;
  tdeeHeading: string;
  caloriesShort: string;
  sedentary: string;
  sedentaryDesc: string;
  lightlyActive: string;
  lightlyActiveDesc: string;
  moderatelyActive: string;
  moderatelyActiveDesc: string;
  active: string;
  activeDesc: string;
  veryActive: string;
  veryActiveDesc: string;
}> = {
  "en-IN": {
    gender: "Gender",
    male: "Male",
    female: "Female",
    age: "Age (years)",
    weight: "Weight (kg)",
    height: "Height (cm)",
    yourBmr: "Your Basal Metabolic Rate (BMR)",
    caloriesPerDay: "calories/day",
    tdeeHeading: "Daily Calories (TDEE) by Activity Level",
    caloriesShort: "cal",
    sedentary: "Sedentary",
    sedentaryDesc: "Little or no exercise",
    lightlyActive: "Lightly Active",
    lightlyActiveDesc: "Light exercise 1-3 days/week",
    moderatelyActive: "Moderately Active",
    moderatelyActiveDesc: "Moderate exercise 3-5 days/week",
    active: "Active",
    activeDesc: "Hard exercise 6-7 days/week",
    veryActive: "Very Active",
    veryActiveDesc: "Very hard exercise, physical job",
  },
  "hi-IN": {
    gender: "लिंग",
    male: "पुरुष",
    female: "महिला",
    age: "आयु (साल)",
    weight: "वज़न (किलो)",
    height: "ऊँचाई (सेमी)",
    yourBmr: "आपकी बेसल मेटाबॉलिक रेट (बीएमआर)",
    caloriesPerDay: "कैलोरी/दिन",
    tdeeHeading: "गतिविधि स्तर के अनुसार दैनिक कैलोरी (TDEE)",
    caloriesShort: "कैलोरी",
    sedentary: "गतिहीन",
    sedentaryDesc: "बहुत कम या कोई व्यायाम नहीं",
    lightlyActive: "हल्की गतिविधि",
    lightlyActiveDesc: "हल्का व्यायाम सप्ताह में 1-3 दिन",
    moderatelyActive: "मध्यम गतिविधि",
    moderatelyActiveDesc: "मध्यम व्यायाम सप्ताह में 3-5 दिन",
    active: "सक्रिय",
    activeDesc: "कठिन व्यायाम सप्ताह में 6-7 दिन",
    veryActive: "बहुत सक्रिय",
    veryActiveDesc: "बहुत कठिन व्यायाम, शारीरिक श्रम",
  },
};

export default function BmrCalculator({ locale = "en-IN" }: { locale?: Locale } = {}) {
  const t = LABELS[locale] ?? LABELS["en-IN"];
  const [gender, setGender] = useState<"male" | "female">("male");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");

  const result = useMemo(() => {
    const a = parseFloat(age);
    const w = parseFloat(weight);
    const h = parseFloat(height);
    if (!a || !w || !h || a <= 0 || w <= 0 || h <= 0) return null;
    let bmr: number;
    if (gender === "male") {
      bmr = 10 * w + 6.25 * h - 5 * a + 5;
    } else {
      bmr = 10 * w + 6.25 * h - 5 * a - 161;
    }
    return { bmr };
  }, [gender, age, weight, height]);

  // Activity levels are static — language flips with locale; the multipliers
  // are universal Harris-Benedict / Mifflin-St Jeor activity factors.
  const levels = [
    { label: t.sedentary, desc: t.sedentaryDesc, factor: 1.2 },
    { label: t.lightlyActive, desc: t.lightlyActiveDesc, factor: 1.375 },
    { label: t.moderatelyActive, desc: t.moderatelyActiveDesc, factor: 1.55 },
    { label: t.active, desc: t.activeDesc, factor: 1.725 },
    { label: t.veryActive, desc: t.veryActiveDesc, factor: 1.9 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">{t.gender}</label>
        <div className="flex gap-2">
          {(["male", "female"] as const).map((g) => (
            <button key={g} onClick={() => setGender(g)} className={`px-6 py-2 rounded-xl text-sm font-semibold transition ${gender === g ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"}`}>{g === "male" ? t.male : t.female}</button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">{t.age}</label>
          <input type="number" placeholder="e.g. 25" value={age} onChange={(e) => setAge(e.target.value)} className="calc-input" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">{t.weight}</label>
          <input type="number" placeholder="e.g. 70" value={weight} onChange={(e) => setWeight(e.target.value)} className="calc-input" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">{t.height}</label>
          <input type="number" placeholder="e.g. 175" value={height} onChange={(e) => setHeight(e.target.value)} className="calc-input" />
        </div>
      </div>
      {/* Result panel renders ALWAYS — Phase 6 Round 3b SSR fix.
          Static Devanagari labels (आपकी बीएमआर, 5 activity levels) must
          be in initial SSR HTML for AI training crawlers without JS.
          When result is null, BMR renders as "—" and TDEE values as "—". */}
      <div className="result-card space-y-4">
        <div className="text-center">
          <div className="text-sm text-gray-500 mb-1">{t.yourBmr}</div>
          <div className="text-5xl font-extrabold text-indigo-600">{result ? Math.round(result.bmr) : "—"}</div>
          <div className="text-sm text-gray-500 mt-1">{t.caloriesPerDay}</div>
        </div>
        <div className="border-t border-gray-100 pt-4">
          <div className="text-sm font-semibold text-gray-700 mb-3">{t.tdeeHeading}</div>
          <div className="space-y-2">
            {levels.map((level) => (
              <div key={level.label} className="flex items-center justify-between bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
                <div>
                  <div className="text-sm font-semibold text-gray-800">{level.label}</div>
                  <div className="text-xs text-gray-400">{level.desc}</div>
                </div>
                <div className="text-lg font-bold text-indigo-600">{result ? Math.round(result.bmr * level.factor) : "—"} <span className="text-xs font-normal text-gray-400">{t.caloriesShort}</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
