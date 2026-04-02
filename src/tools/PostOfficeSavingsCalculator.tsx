"use client";
import { useState, useMemo } from "react";

type Scheme = "nsc" | "kvp" | "scss" | "mis" | "td1" | "td2" | "td3" | "td5";

interface SchemeInfo {
  name: string;
  rate: number;
  tenure: number;
  compounding: string;
  minAmount: number;
  maxAmount: number;
  description: string;
}

const schemes: Record<Scheme, SchemeInfo> = {
  nsc: { name: "National Savings Certificate (NSC)", rate: 7.7, tenure: 5, compounding: "Annually (reinvested)", minAmount: 1000, maxAmount: 100000000, description: "5-year certificate, interest compounded annually but paid at maturity. Tax deduction under 80C." },
  kvp: { name: "Kisan Vikas Patra (KVP)", rate: 7.5, tenure: 9.58, compounding: "Annually", minAmount: 1000, maxAmount: 100000000, description: "Doubles your money. Current rate: doubles in ~115 months (~9.6 years)." },
  scss: { name: "Senior Citizens Savings Scheme", rate: 8.2, tenure: 5, compounding: "Quarterly payout", minAmount: 1000, maxAmount: 3000000, description: "For citizens 60+. Interest paid quarterly. Max limit ₹30 Lakh. Tax deduction under 80C." },
  mis: { name: "Monthly Income Scheme (MIS)", rate: 7.4, tenure: 5, compounding: "Monthly payout", minAmount: 1000, maxAmount: 900000, description: "Monthly interest payout. Max ₹9 Lakh (single), ₹15 Lakh (joint). Principal returned at maturity." },
  td1: { name: "Time Deposit - 1 Year", rate: 6.9, tenure: 1, compounding: "Quarterly", minAmount: 1000, maxAmount: 100000000, description: "1-year fixed deposit with quarterly compounding." },
  td2: { name: "Time Deposit - 2 Year", rate: 7.0, tenure: 2, compounding: "Quarterly", minAmount: 1000, maxAmount: 100000000, description: "2-year fixed deposit with quarterly compounding." },
  td3: { name: "Time Deposit - 3 Year", rate: 7.1, tenure: 3, compounding: "Quarterly", minAmount: 1000, maxAmount: 100000000, description: "3-year fixed deposit with quarterly compounding." },
  td5: { name: "Time Deposit - 5 Year", rate: 7.5, tenure: 5, compounding: "Quarterly", minAmount: 1000, maxAmount: 100000000, description: "5-year fixed deposit with quarterly compounding. Tax deduction under 80C." },
};

export default function PostOfficeSavingsCalculator() {
  const [scheme, setScheme] = useState<Scheme>("nsc");
  const [amount, setAmount] = useState(100000);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  const info = schemes[scheme];

  const result = useMemo(() => {
    if (amount < info.minAmount) return null;
    const r = info.rate / 100;

    let maturityValue: number;
    let interestEarned: number;
    let monthlyIncome = 0;

    if (scheme === "mis") {
      // MIS: monthly interest payout, principal returned at maturity
      monthlyIncome = (amount * r) / 12;
      interestEarned = monthlyIncome * info.tenure * 12;
      maturityValue = amount; // principal returned
    } else if (scheme === "scss") {
      // SCSS: quarterly payout
      const quarterlyIncome = (amount * r) / 4;
      monthlyIncome = quarterlyIncome / 3;
      interestEarned = quarterlyIncome * info.tenure * 4;
      maturityValue = amount;
    } else if (scheme === "kvp") {
      // KVP: compounded annually
      maturityValue = amount * Math.pow(1 + r, info.tenure);
      interestEarned = maturityValue - amount;
    } else if (scheme === "nsc") {
      // NSC: annually compounded, paid at maturity
      maturityValue = amount * Math.pow(1 + r, info.tenure);
      interestEarned = maturityValue - amount;
    } else {
      // Time deposits: quarterly compounding
      const quarters = info.tenure * 4;
      maturityValue = amount * Math.pow(1 + r / 4, quarters);
      interestEarned = maturityValue - amount;
    }

    const effectiveReturn = (Math.pow(maturityValue / amount, 1 / info.tenure) - 1) * 100;

    return { maturityValue, interestEarned, effectiveReturn, monthlyIncome };
  }, [scheme, amount, info]);

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-2 block">Select Scheme</label>
          <select
            value={scheme}
            onChange={(e) => setScheme(e.target.value as Scheme)}
            className="calc-input w-full"
          >
            {Object.entries(schemes).map(([key, s]) => (
              <option key={key} value={key}>{s.name} ({s.rate}%)</option>
            ))}
          </select>
        </div>

        <div className="bg-blue-50 rounded-xl p-4">
          <div className="text-sm font-semibold text-blue-800">{info.name}</div>
          <div className="text-xs text-blue-600 mt-1">{info.description}</div>
          <div className="flex gap-4 mt-2 text-xs text-blue-700">
            <span>Rate: {info.rate}%</span>
            <span>Tenure: {info.tenure} yrs</span>
            <span>Compounding: {info.compounding}</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">Investment Amount</label>
            <span className="text-sm font-bold text-indigo-600">{fmt(amount)}</span>
          </div>
          <input
            type="range"
            min={info.minAmount}
            max={Math.min(info.maxAmount, 5000000)}
            step={1000}
            value={amount}
            onChange={(e) => setAmount(+e.target.value)}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>{fmt(info.minAmount)}</span>
            <span>{fmt(Math.min(info.maxAmount, 5000000))}</span>
          </div>
        </div>
      </div>

      {result && (
        <div className="result-card space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">
                {scheme === "mis" || scheme === "scss" ? "Principal Returned" : "Maturity Value"}
              </div>
              <div className="text-2xl font-extrabold text-indigo-600">{fmt(result.maturityValue)}</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Total Interest Earned</div>
              <div className="text-2xl font-extrabold text-green-600">{fmt(result.interestEarned)}</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Effective Annual Return</div>
              <div className="text-2xl font-extrabold text-purple-600">
                {scheme === "mis" || scheme === "scss" ? info.rate.toFixed(1) : result.effectiveReturn.toFixed(2)}%
              </div>
            </div>
          </div>

          {result.monthlyIncome > 0 && (
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <div className="text-sm font-semibold text-green-800">
                {scheme === "mis" ? "Monthly Income" : "Approx. Monthly Income (from quarterly payout)"}
              </div>
              <div className="text-3xl font-extrabold text-green-600 mt-1">{fmt(result.monthlyIncome)}</div>
            </div>
          )}

          <p className="text-sm text-gray-500">
            Investing {fmt(amount)} in {info.name} at {info.rate}% for {info.tenure} years.
            {scheme !== "mis" && scheme !== "scss" && ` Your money grows to ${fmt(result.maturityValue)}.`}
          </p>
        </div>
      )}

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
        <div className="flex items-start gap-2">
          <span className="text-lg">{"\u2139\uFE0F"}</span>
          <div>
            <p className="font-semibold mb-1">Disclaimer</p>
            <p>Post office rates as of Q4 FY 2025-26. Revised quarterly by GOI. Check indiapost.gov.in</p>
          </div>
        </div>
      </div>
    </div>
  );
}
