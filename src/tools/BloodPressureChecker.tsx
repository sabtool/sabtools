"use client";
import { useState, useMemo } from "react";

interface BPCategory {
  label: string;
  color: string;
  bgColor: string;
  tips: string[];
}

function classify(systolic: number, diastolic: number): BPCategory {
  if (systolic >= 180 || diastolic >= 120) {
    return {
      label: "Hypertensive Crisis",
      color: "text-red-800",
      bgColor: "bg-red-100 border-red-300",
      tips: [
        "Seek immediate medical attention",
        "Call emergency services if symptoms like chest pain, vision problems or difficulty breathing occur",
        "Do not wait to see if pressure comes down on its own",
      ],
    };
  }
  if (systolic >= 140 || diastolic >= 90) {
    return {
      label: "Stage 2 Hypertension",
      color: "text-red-600",
      bgColor: "bg-red-50 border-red-200",
      tips: [
        "Consult a doctor promptly for medication and lifestyle changes",
        "Monitor blood pressure daily at home",
        "Reduce sodium intake below 1,500 mg/day",
        "Exercise for at least 30 minutes most days",
        "Limit alcohol and quit smoking",
      ],
    };
  }
  if ((systolic >= 130 && systolic <= 139) || (diastolic >= 80 && diastolic <= 89)) {
    return {
      label: "Stage 1 Hypertension",
      color: "text-orange-600",
      bgColor: "bg-orange-50 border-orange-200",
      tips: [
        "Consult a healthcare professional",
        "Lifestyle modifications may help: diet, exercise, weight management",
        "Follow DASH diet (rich in fruits, vegetables, whole grains)",
        "Reduce stress through meditation or yoga",
        "Monitor blood pressure regularly",
      ],
    };
  }
  if (systolic >= 120 && systolic <= 129 && diastolic < 80) {
    return {
      label: "Elevated",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50 border-yellow-200",
      tips: [
        "Make healthy lifestyle changes to prevent progression",
        "Maintain a healthy weight",
        "Exercise regularly (150 min/week)",
        "Reduce sodium and processed foods",
        "Manage stress effectively",
      ],
    };
  }
  if (systolic < 90 || diastolic < 60) {
    return {
      label: "Low Blood Pressure",
      color: "text-blue-600",
      bgColor: "bg-blue-50 border-blue-200",
      tips: [
        "Stay hydrated - drink plenty of water",
        "Stand up slowly to avoid dizziness",
        "Eat small, frequent meals",
        "Slightly increase salt intake if advised by doctor",
        "Consult a doctor if symptoms like fainting or dizziness persist",
      ],
    };
  }
  return {
    label: "Normal",
    color: "text-green-600",
    bgColor: "bg-green-50 border-green-200",
    tips: [
      "Great! Maintain your healthy lifestyle",
      "Continue regular physical activity",
      "Eat a balanced diet rich in fruits and vegetables",
      "Get regular health check-ups",
      "Keep monitoring periodically",
    ],
  };
}

export default function BloodPressureChecker() {
  const [systolic, setSystolic] = useState("");
  const [diastolic, setDiastolic] = useState("");

  const result = useMemo(() => {
    const sys = parseFloat(systolic);
    const dia = parseFloat(diastolic);
    if (!sys || !dia || sys <= 0 || dia <= 0) return null;

    const category = classify(sys, dia);
    return { sys, dia, category };
  }, [systolic, diastolic]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Systolic (top number) mmHg</label>
          <input type="number" placeholder="e.g. 120" value={systolic} onChange={(e) => setSystolic(e.target.value)} className="calc-input" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Diastolic (bottom number) mmHg</label>
          <input type="number" placeholder="e.g. 80" value={diastolic} onChange={(e) => setDiastolic(e.target.value)} className="calc-input" />
        </div>
      </div>

      {result && (
        <div className="result-card space-y-4">
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-1">Your Blood Pressure</div>
            <div className="text-5xl font-extrabold text-indigo-600">{result.sys}/{result.dia}</div>
            <div className={`text-lg font-bold mt-2 ${result.category.color}`}>{result.category.label}</div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <div className="text-sm font-semibold text-gray-700 mb-3">Blood Pressure Categories</div>
            <div className="space-y-1.5">
              {[
                { label: "Normal", range: "< 120/80", active: result.category.label === "Normal" },
                { label: "Elevated", range: "120-129 / < 80", active: result.category.label === "Elevated" },
                { label: "Stage 1 Hypertension", range: "130-139 / 80-89", active: result.category.label === "Stage 1 Hypertension" },
                { label: "Stage 2 Hypertension", range: "140+ / 90+", active: result.category.label === "Stage 2 Hypertension" },
                { label: "Hypertensive Crisis", range: "180+ / 120+", active: result.category.label === "Hypertensive Crisis" },
              ].map((cat) => (
                <div key={cat.label} className={`flex items-center justify-between rounded-lg p-2 border ${cat.active ? "border-indigo-300 bg-indigo-50 font-bold" : "border-gray-100 bg-white"}`}>
                  <span className="text-sm text-gray-700">{cat.label}</span>
                  <span className="text-sm text-gray-500">{cat.range} mmHg</span>
                </div>
              ))}
            </div>
          </div>

          <div className={`rounded-xl p-4 border ${result.category.bgColor}`}>
            <div className={`text-sm font-semibold mb-2 ${result.category.color}`}>Health Tips for {result.category.label}</div>
            <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
              {result.category.tips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
            <div className="text-xs text-yellow-700">
              <strong>Disclaimer:</strong> This tool is for informational purposes only. Always consult a healthcare professional for accurate diagnosis and treatment.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
