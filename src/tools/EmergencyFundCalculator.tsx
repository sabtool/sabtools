"use client";
import { useState, useMemo } from "react";

/**
 * Emergency Fund Calculator (India)
 *
 * Standard advice (cross-checked across IndiaBonds, ClearTax, Axis MF,
 * StanChart, FinancialCalculator.io guidance):
 *
 *  Profile                                  | Recommended months
 *  -----------------------------------------|--------------------
 *  Salaried, dual-income, govt/PSU job      | 3 months
 *  Salaried, single-income with dependents  | 6 months
 *  Self-employed / freelancer / business    | 9 months
 *  Single earner with multiple dependents   | 9–12 months
 *  Variable income / sales / commission     | 12 months
 *
 * The fund should cover ESSENTIAL fixed expenses ONLY:
 *  - Rent/EMI, utilities, groceries, transport
 *  - Insurance premiums, school fees, basic medical
 *  - Loan EMIs that CAN'T be paused
 *
 * Should NOT include: discretionary spending, vacations, eating out,
 * subscription bingeing.
 *
 * STORAGE recommendation (most India FIRE / personal finance experts):
 *  - 1 month: Savings account / sweep-in FD
 *  - 1-2 months: Liquid mutual fund (T+1 redemption)
 *  - Rest: Short-term debt fund or Bank FD
 *
 * Sources:
 *  - https://www.indiabonds.com/kuchbhi/emergency-fund-calculator-a-complete-guide/
 *  - https://www.sc.com/in/emergency-calculator/
 *  - https://www.policybazaar.com/income-tax/emergency-fund-rules/
 *  - Cross-referenced across major Indian PFM blogs
 */

type Profile =
  | "salaried-stable"
  | "salaried-single"
  | "self-employed"
  | "single-with-dependents"
  | "variable-income";

const PROFILE_INFO: Record<
  Profile,
  { label: string; months: number; description: string }
> = {
  "salaried-stable": {
    label: "Salaried · Dual Income / Govt / PSU",
    months: 3,
    description:
      "Two earners or rock-solid government/PSU job: 3 months of essential expenses cover most short-term shocks.",
  },
  "salaried-single": {
    label: "Salaried · Single Income with Dependents",
    months: 6,
    description:
      "Most common Indian household profile. 6 months covers a job loss + reasonable search time.",
  },
  "self-employed": {
    label: "Self-Employed / Freelancer / Business Owner",
    months: 9,
    description:
      "Variable monthly income + irregular receivables → 9 months for cushion through dry quarters or client churn.",
  },
  "single-with-dependents": {
    label: "Single Earner · Multiple Dependents",
    months: 9,
    description:
      "Sole breadwinner with parents, kids and spouse depending on you. 9–12 months strongly recommended.",
  },
  "variable-income": {
    label: "Sales / Commission-based / Highly Variable",
    months: 12,
    description:
      "When monthly income swings wildly, you need a full year of cushion to ride out a slow patch.",
  },
};

export default function EmergencyFundCalculator() {
  const [profile, setProfile] = useState<Profile>("salaried-single");
  const [rent, setRent] = useState<number>(25_000);
  const [emis, setEmis] = useState<number>(20_000);
  const [groceries, setGroceries] = useState<number>(12_000);
  const [utilities, setUtilities] = useState<number>(5_000);
  const [insurance, setInsurance] = useState<number>(3_000);
  const [transport, setTransport] = useState<number>(5_000);
  const [education, setEducation] = useState<number>(8_000);
  const [otherEssentials, setOtherEssentials] = useState<number>(7_000);

  const result = useMemo(() => {
    const totalMonthly =
      rent +
      emis +
      groceries +
      utilities +
      insurance +
      transport +
      education +
      otherEssentials;

    const months = PROFILE_INFO[profile].months;
    const target = totalMonthly * months;

    // Allocation suggestion
    const oneMonth = totalMonthly;
    const twoMonths = totalMonthly * 2;
    const remaining = Math.max(0, target - oneMonth - twoMonths);

    return {
      totalMonthly,
      months,
      target,
      profileInfo: PROFILE_INFO[profile],
      allocation: {
        savings: Math.min(oneMonth, target),
        liquidFund: Math.min(twoMonths, Math.max(0, target - oneMonth)),
        debtFund: remaining,
      },
    };
  }, [
    profile,
    rent,
    emis,
    groceries,
    utilities,
    insurance,
    transport,
    education,
    otherEssentials,
  ]);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(n);

  const expenseFields: {
    label: string;
    value: number;
    setter: (v: number) => void;
    icon: string;
  }[] = [
    { label: "Rent / Home loan EMI", value: rent, setter: setRent, icon: "🏠" },
    { label: "Other loan EMIs", value: emis, setter: setEmis, icon: "💳" },
    { label: "Groceries", value: groceries, setter: setGroceries, icon: "🛒" },
    {
      label: "Utilities (electricity, gas, internet)",
      value: utilities,
      setter: setUtilities,
      icon: "💡",
    },
    {
      label: "Insurance premiums",
      value: insurance,
      setter: setInsurance,
      icon: "🛡️",
    },
    { label: "Transport / fuel", value: transport, setter: setTransport, icon: "🚗" },
    { label: "School / college fees", value: education, setter: setEducation, icon: "🎓" },
    {
      label: "Other essentials (healthcare, household help, etc.)",
      value: otherEssentials,
      setter: setOtherEssentials,
      icon: "🧰",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="inline-block bg-emerald-100 text-emerald-800 text-sm font-semibold px-4 py-1.5 rounded-full">
        🆘 Emergency Fund Calculator · India 2026
      </div>

      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">
          Income Profile
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {(Object.entries(PROFILE_INFO) as [Profile, (typeof PROFILE_INFO)[Profile]][]).map(
            ([k, v]) => (
              <button
                key={k}
                onClick={() => setProfile(k)}
                className={`text-left px-3 py-2 rounded-xl text-xs font-semibold transition ${
                  profile === k
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                <div>
                  {v.label} <span className="opacity-80">({v.months}mo)</span>
                </div>
              </button>
            )
          )}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {result.profileInfo.description}
        </p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
        <div className="font-bold text-amber-900 text-sm">
          📋 Essential monthly expenses
        </div>
        <p className="text-xs text-amber-800 -mt-1">
          Include only ESSENTIAL costs. Skip Netflix, dining out, vacations.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {expenseFields.map((f) => (
            <div key={f.label}>
              <label className="text-xs font-semibold text-amber-900 block mb-1">
                {f.icon} {f.label}
              </label>
              <input
                type="number"
                value={f.value}
                onChange={(e) => f.setter(+e.target.value || 0)}
                className="calc-input"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="result-card space-y-4">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 text-white">
          <div className="text-sm font-medium opacity-80 mb-1">
            Your Emergency Fund Target
          </div>
          <div className="text-4xl font-bold">{fmt(result.target)}</div>
          <div className="text-sm opacity-80 mt-2">
            {result.months} months × {fmt(result.totalMonthly)} essential
            monthly expenses
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-3 text-sm">
            💼 Recommended Allocation Strategy
          </h3>
          <div className="space-y-3 text-sm">
            <div className="border-l-4 border-blue-500 pl-3">
              <div className="font-bold text-blue-700">
                Tier 1: Savings Account / Sweep-in FD
              </div>
              <div className="text-xs text-gray-600">
                Covers 1 month of expenses. Instant access for true
                emergencies. Earns 3-4% (savings) or 6-7% (sweep-in FD).
              </div>
              <div className="font-mono text-base mt-1">
                {fmt(result.allocation.savings)}
              </div>
            </div>
            <div className="border-l-4 border-emerald-500 pl-3">
              <div className="font-bold text-emerald-700">
                Tier 2: Liquid Mutual Fund
              </div>
              <div className="text-xs text-gray-600">
                Covers next 2 months. T+1 redemption (24-hour access). Earns
                6.5-7.5% with low risk. No exit load after 7 days.
              </div>
              <div className="font-mono text-base mt-1">
                {fmt(result.allocation.liquidFund)}
              </div>
            </div>
            {result.allocation.debtFund > 0 && (
              <div className="border-l-4 border-purple-500 pl-3">
                <div className="font-bold text-purple-700">
                  Tier 3: Short-term Debt Fund / Bank FD
                </div>
                <div className="text-xs text-gray-600">
                  Covers remaining {result.months - 3} months. 7-8% returns.
                  3-7 day redemption. Use only if emergency outlasts Tiers 1+2.
                </div>
                <div className="font-mono text-base mt-1">
                  {fmt(result.allocation.debtFund)}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-xs font-medium text-gray-500 mb-1">
              Monthly Burn
            </div>
            <div className="text-xl font-bold text-orange-600">
              {fmt(result.totalMonthly)}
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-xs font-medium text-gray-500 mb-1">
              Target Months
            </div>
            <div className="text-xl font-bold text-emerald-600">
              {result.months} months
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-xs font-medium text-gray-500 mb-1">
              Fund Size
            </div>
            <div className="text-xl font-bold text-purple-600">
              {fmt(result.target)}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs text-gray-700 leading-relaxed space-y-2">
        <strong>How to build the emergency fund:</strong>
        <ul className="list-disc list-inside ml-2 space-y-1">
          <li>
            Start small. Even ₹1,000/month for 6 months = ₹6,000 cushion is
            better than zero.
          </li>
          <li>
            Automate with a separate savings account that you don&apos;t see
            on your daily debit card / UPI.
          </li>
          <li>
            Replenish IMMEDIATELY after using. The fund must be back to full
            within 6 months of use.
          </li>
          <li>
            DON&apos;T invest emergency fund in equity / stocks. Volatility
            risk defeats the purpose. Use only liquid debt.
          </li>
          <li>
            Review every year as expenses change (rent rise, new EMI, new
            child, etc.).
          </li>
        </ul>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-800 leading-relaxed">
        <span className="mr-1">ℹ️</span>
        <strong>Why it matters:</strong> Without an emergency fund, every
        unexpected event becomes a credit-card bill (~36% interest) or a
        personal loan (~14% interest). A ₹1L sudden expense on credit
        snowballs into ₹1.4L+ over 18 months. The emergency fund is the
        single highest-ROI &quot;investment&quot; in personal finance — it
        prevents debt that compounds against you.
      </div>
    </div>
  );
}
