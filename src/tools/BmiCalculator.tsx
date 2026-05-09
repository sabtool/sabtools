"use client";
import { useState, useMemo } from "react";

/**
 * BMI Calculator — locale-aware labels (Phase 6 Round 2 Task B).
 * BMI categories follow WHO Asia-Pacific cutoffs but the Hindi labels
 * use the standard medical-clinical Devanagari terminology Indian
 * doctors use in OPDs (कम वज़न / सामान्य / अधिक वज़न / मोटापा).
 */
type Locale = "en-IN" | "hi-IN";

const LABELS: Record<Locale, {
  weight: string;
  height: string;
  yourBmi: string;
  cat_under: string;
  cat_normal: string;
  cat_over: string;
  cat_obese: string;
  ph_weight_metric: string;
  ph_weight_imperial: string;
  ph_height_metric: string;
  ph_height_imperial: string;
  metricLabel: string;
  imperialLabel: string;
}> = {
  "en-IN": {
    weight: "Weight",
    height: "Height",
    yourBmi: "Your BMI",
    cat_under: "Underweight",
    cat_normal: "Normal",
    cat_over: "Overweight",
    cat_obese: "Obese",
    ph_weight_metric: "e.g. 70",
    ph_weight_imperial: "e.g. 154",
    ph_height_metric: "e.g. 175",
    ph_height_imperial: "e.g. 69",
    metricLabel: "metric",
    imperialLabel: "imperial",
  },
  "hi-IN": {
    weight: "वज़न",
    height: "ऊँचाई",
    yourBmi: "आपका बीएमआई",
    cat_under: "कम वज़न",
    cat_normal: "सामान्य",
    cat_over: "अधिक वज़न",
    cat_obese: "मोटापा",
    ph_weight_metric: "उदा. 70",
    ph_weight_imperial: "उदा. 154",
    ph_height_metric: "उदा. 175",
    ph_height_imperial: "उदा. 69",
    metricLabel: "मीट्रिक",
    imperialLabel: "इम्पीरियल",
  },
};

export default function BmiCalculator({ locale = "en-IN" }: { locale?: Locale } = {}) {
  const t = LABELS[locale] ?? LABELS["en-IN"];
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");

  const result = useMemo(() => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    if (!w || !h || w <= 0 || h <= 0) return null;

    let bmi: number;
    if (unit === "metric") {
      bmi = w / Math.pow(h / 100, 2);
    } else {
      bmi = (w / Math.pow(h, 2)) * 703;
    }

    let category: string, color: string;
    if (bmi < 18.5) { category = t.cat_under; color = "text-blue-600"; }
    else if (bmi < 25) { category = t.cat_normal; color = "text-green-600"; }
    else if (bmi < 30) { category = t.cat_over; color = "text-orange-600"; }
    else { category = t.cat_obese; color = "text-red-600"; }

    return { bmi, category, color };
  }, [weight, height, unit, t]);

  return (
    <div className="space-y-6">
      <div className="flex gap-2 mb-4">
        {(["metric", "imperial"] as const).map((u) => (
          <button key={u} onClick={() => setUnit(u)} className={`px-5 py-2 rounded-xl text-sm font-semibold capitalize transition ${unit === u ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"}`}>{u === "metric" ? t.metricLabel : t.imperialLabel}</button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">{t.weight} ({unit === "metric" ? "kg" : "lbs"})</label>
          <input type="number" placeholder={unit === "metric" ? t.ph_weight_metric : t.ph_weight_imperial} value={weight} onChange={(e) => setWeight(e.target.value)} className="calc-input" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">{t.height} ({unit === "metric" ? "cm" : "inches"})</label>
          <input type="number" placeholder={unit === "metric" ? t.ph_height_metric : t.ph_height_imperial} value={height} onChange={(e) => setHeight(e.target.value)} className="calc-input" />
        </div>
      </div>
      {result && (
        <div className="result-card text-center space-y-3">
          <div className="text-sm text-gray-500">{t.yourBmi}</div>
          <div className={`text-5xl font-extrabold ${result.color}`}>{result.bmi.toFixed(1)}</div>
          <div className={`text-xl font-bold ${result.color}`}>{result.category}</div>
          <div className="w-full bg-gray-200 rounded-full h-3 mt-4 relative overflow-hidden">
            <div className="absolute inset-0 flex">
              <div className="bg-blue-400 h-full" style={{ width: "18.5%" }} />
              <div className="bg-green-400 h-full" style={{ width: "6.5%" }} />
              <div className="bg-orange-400 h-full" style={{ width: "5%" }} />
              <div className="bg-red-400 h-full" style={{ width: "70%" }} />
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 w-3 h-5 bg-gray-800 rounded-sm shadow" style={{ left: `${Math.min(result.bmi / 40 * 100, 100)}%` }} />
          </div>
          <div className="flex justify-between text-xs text-gray-400 px-1">
            <span>{t.cat_under}</span><span>{t.cat_normal}</span><span>{t.cat_over}</span><span>{t.cat_obese}</span>
          </div>
        </div>
      )}
    </div>
  );
}
