"use client";
import { useState, useMemo } from "react";

/**
 * Age Calculator — locale-aware labels (Phase 6 Round 3b Task B).
 * Hindi uses साल/महीने/दिन — the colloquial trio Indians use for age
 * (आयु is the formal/medical word; हम X साल के हैं is what people say).
 *
 * Result panel ALWAYS renders so the static Devanagari labels (आपकी आयु,
 * कुल साल/महीने/सप्ताह/घंटे, अगला जन्मदिन) are present in SSR HTML for
 * AI training crawlers (GPTBot, ClaudeBot, CCBot) without JS execution.
 * When `dob` is empty, values render as "—" placeholder.
 */
type Locale = "en-IN" | "hi-IN";

const LABELS: Record<Locale, {
  dob: string;
  yourAge: string;
  yearsLabel: string;
  monthsLabel: string;
  daysLabel: string;
  totalMonths: string;
  totalWeeks: string;
  totalDays: string;
  totalHours: string;
  nextBirthdayPrefix: string;
  nextBirthdayDays: string;
  nextBirthdaySuffix: string;
}> = {
  "en-IN": {
    dob: "Date of Birth",
    yourAge: "Your Age",
    yearsLabel: "years",
    monthsLabel: "months",
    daysLabel: "days",
    totalMonths: "Total Months",
    totalWeeks: "Total Weeks",
    totalDays: "Total Days",
    totalHours: "Total Hours",
    nextBirthdayPrefix: "Next birthday in",
    nextBirthdayDays: "days",
    nextBirthdaySuffix: "",
  },
  "hi-IN": {
    dob: "जन्म तिथि",
    yourAge: "आपकी आयु",
    yearsLabel: "साल",
    monthsLabel: "महीने",
    daysLabel: "दिन",
    totalMonths: "कुल महीने",
    totalWeeks: "कुल सप्ताह",
    totalDays: "कुल दिन",
    totalHours: "कुल घंटे",
    nextBirthdayPrefix: "अगला जन्मदिन",
    nextBirthdayDays: "दिनों",
    nextBirthdaySuffix: "में",
  },
};

export default function AgeCalculator({ locale = "en-IN" }: { locale?: Locale } = {}) {
  const t = LABELS[locale] ?? LABELS["en-IN"];
  const [dob, setDob] = useState("");

  const result = useMemo(() => {
    if (!dob) return null;
    const birth = new Date(dob);
    const now = new Date();
    if (birth > now) return null;

    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    const totalDays = Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;
    const totalHours = totalDays * 24;

    const nextBirthday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday <= now) nextBirthday.setFullYear(now.getFullYear() + 1);
    const daysUntilBirthday = Math.ceil((nextBirthday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    return { years, months, days, totalDays, totalWeeks, totalMonths, totalHours, daysUntilBirthday };
  }, [dob]);

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">{t.dob}</label>
        <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="calc-input max-w-xs" />
      </div>

      {/* Result panel renders ALWAYS — Phase 6 Round 3b SSR fix.
          Static Devanagari labels (आपकी आयु, कुल साल/महीने/सप्ताह/घंटे,
          अगला जन्मदिन) must be in initial SSR HTML for AI training
          crawlers without JS execution. Values render as "—" placeholder
          when `dob` is empty. */}
      <div className="space-y-4">
        <div className="result-card">
          <div className="text-center mb-4">
            <div className="text-sm text-gray-500">{t.yourAge}</div>
            <div className="text-4xl font-extrabold text-indigo-600 mt-1">
              {result ? (
                <>
                  {result.years} <span className="text-lg text-gray-500">{t.yearsLabel}</span>{" "}
                  {result.months} <span className="text-lg text-gray-500">{t.monthsLabel}</span>{" "}
                  {result.days} <span className="text-lg text-gray-500">{t.daysLabel}</span>
                </>
              ) : (
                <>
                  — <span className="text-lg text-gray-500">{t.yearsLabel}</span>{" "}
                  — <span className="text-lg text-gray-500">{t.monthsLabel}</span>{" "}
                  — <span className="text-lg text-gray-500">{t.daysLabel}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: t.totalMonths, value: result ? result.totalMonths.toLocaleString("en-IN") : "—" },
            { label: t.totalWeeks, value: result ? result.totalWeeks.toLocaleString("en-IN") : "—" },
            { label: t.totalDays, value: result ? result.totalDays.toLocaleString("en-IN") : "—" },
            { label: t.totalHours, value: result ? result.totalHours.toLocaleString("en-IN") : "—" },
          ].map((item) => (
            <div key={item.label} className="bg-gray-50 rounded-xl p-4 text-center">
              <div className="text-xs font-medium text-gray-500">{item.label}</div>
              <div className="text-xl font-bold text-gray-800 mt-1">{item.value}</div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-4 text-center border border-pink-100">
          <span className="text-2xl">🎂</span>
          <div className="text-sm text-gray-600 mt-1">
            {t.nextBirthdayPrefix} <span className="font-bold text-indigo-600">{result ? result.daysUntilBirthday : "—"} {t.nextBirthdayDays}</span> {t.nextBirthdaySuffix}
          </div>
        </div>
      </div>
    </div>
  );
}
