"use client";
import { useState, useMemo } from "react";

interface Question {
  id: string;
  label: string;
  type: "select" | "slider";
  options?: { label: string; value: number }[];
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}

const QUESTIONS: Question[] = [
  { id: "payment", label: "Payment History", type: "select", options: [
    { label: "Always on time", value: 90 },
    { label: "Rarely late (1-2 times)", value: 65 },
    { label: "Sometimes late", value: 40 },
    { label: "Often late", value: 15 },
  ]},
  { id: "utilization", label: "Credit Utilization (%)", type: "slider", min: 0, max: 100, step: 5, unit: "%" },
  { id: "age", label: "Credit History Age (Years)", type: "slider", min: 0, max: 30, step: 1, unit: " years" },
  { id: "accounts", label: "Number of Credit Accounts", type: "slider", min: 0, max: 20, step: 1, unit: "" },
  { id: "inquiries", label: "Recent Credit Inquiries (last 6 months)", type: "slider", min: 0, max: 10, step: 1, unit: "" },
  { id: "mix", label: "Credit Mix", type: "select", options: [
    { label: "Cards + Loans (diverse)", value: 85 },
    { label: "Only credit cards", value: 55 },
    { label: "Only loans", value: 50 },
    { label: "Single account", value: 30 },
  ]},
];

function getRating(score: number) {
  if (score >= 750) return { label: "Excellent", color: "text-green-600", bg: "bg-green-100", barColor: "bg-green-500" };
  if (score >= 650) return { label: "Good", color: "text-blue-600", bg: "bg-blue-100", barColor: "bg-blue-500" };
  if (score >= 550) return { label: "Fair", color: "text-yellow-600", bg: "bg-yellow-100", barColor: "bg-yellow-500" };
  return { label: "Poor", color: "text-red-600", bg: "bg-red-100", barColor: "bg-red-500" };
}

const TIPS: Record<string, string[]> = {
  Excellent: ["Maintain your excellent credit habits", "You qualify for the best loan rates", "Keep utilization below 30%"],
  Good: ["Pay all bills on time consistently", "Reduce credit utilization below 30%", "Avoid applying for multiple cards at once", "You qualify for most loans at competitive rates"],
  Fair: ["Focus on clearing overdue payments", "Reduce credit card balances significantly", "Avoid new credit applications for 6 months", "Set up auto-pay for minimum payments"],
  Poor: ["Prioritize paying overdue accounts immediately", "Consider a secured credit card to rebuild", "Do not close old credit accounts", "Dispute any errors on your credit report", "Seek professional credit counseling"],
};

export default function CreditScoreEstimator() {
  const [answers, setAnswers] = useState<Record<string, number>>({
    payment: 90,
    utilization: 30,
    age: 5,
    accounts: 3,
    inquiries: 1,
    mix: 85,
  });
  const [calculated, setCalculated] = useState(false);

  const score = useMemo(() => {
    // Weighted scoring: payment 35%, utilization 30%, age 15%, mix 10%, inquiries 10%
    const paymentScore = answers.payment; // Already 0-90
    const utilizationScore = Math.max(0, 100 - answers.utilization * 1.2);
    const ageScore = Math.min(100, answers.age * 10);
    const accountScore = answers.accounts >= 3 && answers.accounts <= 10 ? 80 : answers.accounts < 3 ? 40 : 50;
    const inquiryScore = Math.max(0, 100 - answers.inquiries * 20);
    const mixScore = answers.mix;

    const weighted = paymentScore * 0.35 + utilizationScore * 0.30 + ageScore * 0.15 + mixScore * 0.10 + inquiryScore * 0.10;
    return Math.round(300 + weighted * 6);
  }, [answers]);

  const rating = getRating(score);

  return (
    <div className="space-y-8">
      {/* Questions */}
      <div className="space-y-6">
        {QUESTIONS.map((q) => (
          <div key={q.id}>
            <label className="block text-sm font-semibold text-gray-700 mb-2">{q.label}</label>
            {q.type === "select" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {q.options!.map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => setAnswers({ ...answers, [q.id]: opt.value })}
                    className={answers[q.id] === opt.value ? "btn-primary text-sm" : "btn-secondary text-sm"}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            ) : (
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-gray-400">{q.min}</span>
                  <span className="text-sm font-bold text-indigo-600">{answers[q.id]}{q.unit}</span>
                  <span className="text-xs text-gray-400">{q.max}</span>
                </div>
                <input
                  type="range"
                  min={q.min}
                  max={q.max}
                  step={q.step}
                  value={answers[q.id]}
                  onChange={(e) => setAnswers({ ...answers, [q.id]: +e.target.value })}
                  className="w-full"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <button onClick={() => setCalculated(true)} className="btn-primary w-full text-lg py-3">
        Estimate My Credit Score
      </button>

      {calculated && (
        <div className="space-y-6">
          {/* Score Display */}
          <div className="result-card text-center">
            <div className="text-sm text-gray-500 mb-2">Your Estimated CIBIL Score</div>
            <div className="relative inline-flex items-center justify-center">
              <div className="w-40 h-40 rounded-full border-8 border-gray-100 flex items-center justify-center relative">
                <div className={`absolute inset-0 rounded-full border-8 ${rating.barColor} border-opacity-30`} />
                <div>
                  <div className={`text-4xl font-extrabold ${rating.color}`}>{score}</div>
                  <div className={`text-sm font-bold ${rating.color}`}>{rating.label}</div>
                </div>
              </div>
            </div>

            {/* Score bar */}
            <div className="mt-6 max-w-md mx-auto">
              <div className="h-4 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 relative">
                <div
                  className="absolute top-0 w-1 h-6 bg-gray-800 rounded -mt-1 transition-all"
                  style={{ left: `${((score - 300) / 600) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>300</span><span>500</span><span>700</span><span>900</span>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="result-card">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Tips to Improve</h3>
            <ul className="space-y-2">
              {TIPS[rating.label].map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-green-500 mt-0.5">&#10003;</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Score Ranges */}
          <div className="result-card">
            <h3 className="text-lg font-bold text-gray-800 mb-3">CIBIL Score Ranges</h3>
            <div className="space-y-2">
              {[
                { range: "750-900", label: "Excellent", color: "bg-green-100 text-green-700" },
                { range: "650-749", label: "Good", color: "bg-blue-100 text-blue-700" },
                { range: "550-649", label: "Fair", color: "bg-yellow-100 text-yellow-700" },
                { range: "300-549", label: "Poor", color: "bg-red-100 text-red-700" },
              ].map((r) => (
                <div key={r.range} className={`flex justify-between items-center p-3 rounded-lg ${r.color}`}>
                  <span className="font-semibold">{r.label}</span>
                  <span className="font-bold">{r.range}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
