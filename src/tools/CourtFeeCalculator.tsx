"use client";
import { useState, useMemo } from "react";

const STATES = [
  "Maharashtra", "Delhi", "Karnataka", "Tamil Nadu", "Uttar Pradesh",
  "Gujarat", "Rajasthan", "West Bengal", "Madhya Pradesh", "Kerala",
  "Telangana", "Andhra Pradesh", "Punjab", "Haryana", "Bihar",
];

const CASE_TYPES = ["Civil Suit", "Criminal", "Family", "Property", "Consumer"];

// Simplified slab rates per state (percentage of suit value)
const STATE_RATES: Record<string, Record<string, { slabs: { upto: number; rate: number }[]; stampDuty: number }>> = {
  Maharashtra: {
    "Civil Suit": { slabs: [{ upto: 100000, rate: 1 }, { upto: 500000, rate: 0.75 }, { upto: Infinity, rate: 0.5 }], stampDuty: 0.1 },
    Criminal: { slabs: [{ upto: Infinity, rate: 0 }], stampDuty: 0 },
    Family: { slabs: [{ upto: 500000, rate: 0.5 }, { upto: Infinity, rate: 0.3 }], stampDuty: 0.05 },
    Property: { slabs: [{ upto: 100000, rate: 2 }, { upto: 1000000, rate: 1.5 }, { upto: Infinity, rate: 1 }], stampDuty: 0.2 },
    Consumer: { slabs: [{ upto: 500000, rate: 0 }, { upto: 2000000, rate: 0.1 }, { upto: Infinity, rate: 0.15 }], stampDuty: 0 },
  },
  Delhi: {
    "Civil Suit": { slabs: [{ upto: 100000, rate: 1.5 }, { upto: 500000, rate: 1 }, { upto: Infinity, rate: 0.6 }], stampDuty: 0.1 },
    Criminal: { slabs: [{ upto: Infinity, rate: 0 }], stampDuty: 0 },
    Family: { slabs: [{ upto: 500000, rate: 0.5 }, { upto: Infinity, rate: 0.4 }], stampDuty: 0.05 },
    Property: { slabs: [{ upto: 100000, rate: 2.5 }, { upto: 1000000, rate: 2 }, { upto: Infinity, rate: 1.5 }], stampDuty: 0.25 },
    Consumer: { slabs: [{ upto: 500000, rate: 0 }, { upto: 2000000, rate: 0.1 }, { upto: Infinity, rate: 0.2 }], stampDuty: 0 },
  },
  Karnataka: {
    "Civil Suit": { slabs: [{ upto: 100000, rate: 1.2 }, { upto: 500000, rate: 0.8 }, { upto: Infinity, rate: 0.5 }], stampDuty: 0.1 },
    Criminal: { slabs: [{ upto: Infinity, rate: 0 }], stampDuty: 0 },
    Family: { slabs: [{ upto: 500000, rate: 0.5 }, { upto: Infinity, rate: 0.35 }], stampDuty: 0.05 },
    Property: { slabs: [{ upto: 100000, rate: 2 }, { upto: 1000000, rate: 1.5 }, { upto: Infinity, rate: 1 }], stampDuty: 0.2 },
    Consumer: { slabs: [{ upto: 500000, rate: 0 }, { upto: 2000000, rate: 0.1 }, { upto: Infinity, rate: 0.15 }], stampDuty: 0 },
  },
  "Tamil Nadu": {
    "Civil Suit": { slabs: [{ upto: 100000, rate: 1 }, { upto: 500000, rate: 0.75 }, { upto: Infinity, rate: 0.5 }], stampDuty: 0.1 },
    Criminal: { slabs: [{ upto: Infinity, rate: 0 }], stampDuty: 0 },
    Family: { slabs: [{ upto: 500000, rate: 0.5 }, { upto: Infinity, rate: 0.3 }], stampDuty: 0.05 },
    Property: { slabs: [{ upto: 100000, rate: 2 }, { upto: 1000000, rate: 1.5 }, { upto: Infinity, rate: 1 }], stampDuty: 0.15 },
    Consumer: { slabs: [{ upto: 500000, rate: 0 }, { upto: 2000000, rate: 0.1 }, { upto: Infinity, rate: 0.12 }], stampDuty: 0 },
  },
  "Uttar Pradesh": {
    "Civil Suit": { slabs: [{ upto: 100000, rate: 1.5 }, { upto: 500000, rate: 1 }, { upto: Infinity, rate: 0.75 }], stampDuty: 0.1 },
    Criminal: { slabs: [{ upto: Infinity, rate: 0 }], stampDuty: 0 },
    Family: { slabs: [{ upto: 500000, rate: 0.5 }, { upto: Infinity, rate: 0.4 }], stampDuty: 0.05 },
    Property: { slabs: [{ upto: 100000, rate: 2 }, { upto: 1000000, rate: 1.75 }, { upto: Infinity, rate: 1.25 }], stampDuty: 0.2 },
    Consumer: { slabs: [{ upto: 500000, rate: 0 }, { upto: 2000000, rate: 0.1 }, { upto: Infinity, rate: 0.15 }], stampDuty: 0 },
  },
  Gujarat: {
    "Civil Suit": { slabs: [{ upto: 100000, rate: 1.25 }, { upto: 500000, rate: 0.85 }, { upto: Infinity, rate: 0.55 }], stampDuty: 0.1 },
    Criminal: { slabs: [{ upto: Infinity, rate: 0 }], stampDuty: 0 },
    Family: { slabs: [{ upto: 500000, rate: 0.5 }, { upto: Infinity, rate: 0.35 }], stampDuty: 0.05 },
    Property: { slabs: [{ upto: 100000, rate: 2 }, { upto: 1000000, rate: 1.5 }, { upto: Infinity, rate: 1 }], stampDuty: 0.2 },
    Consumer: { slabs: [{ upto: 500000, rate: 0 }, { upto: 2000000, rate: 0.1 }, { upto: Infinity, rate: 0.15 }], stampDuty: 0 },
  },
  Rajasthan: {
    "Civil Suit": { slabs: [{ upto: 100000, rate: 1.5 }, { upto: 500000, rate: 1 }, { upto: Infinity, rate: 0.6 }], stampDuty: 0.1 },
    Criminal: { slabs: [{ upto: Infinity, rate: 0 }], stampDuty: 0 },
    Family: { slabs: [{ upto: 500000, rate: 0.5 }, { upto: Infinity, rate: 0.35 }], stampDuty: 0.05 },
    Property: { slabs: [{ upto: 100000, rate: 2.5 }, { upto: 1000000, rate: 2 }, { upto: Infinity, rate: 1.2 }], stampDuty: 0.2 },
    Consumer: { slabs: [{ upto: 500000, rate: 0 }, { upto: 2000000, rate: 0.1 }, { upto: Infinity, rate: 0.15 }], stampDuty: 0 },
  },
  "West Bengal": {
    "Civil Suit": { slabs: [{ upto: 100000, rate: 1 }, { upto: 500000, rate: 0.75 }, { upto: Infinity, rate: 0.5 }], stampDuty: 0.1 },
    Criminal: { slabs: [{ upto: Infinity, rate: 0 }], stampDuty: 0 },
    Family: { slabs: [{ upto: 500000, rate: 0.5 }, { upto: Infinity, rate: 0.3 }], stampDuty: 0.05 },
    Property: { slabs: [{ upto: 100000, rate: 2 }, { upto: 1000000, rate: 1.5 }, { upto: Infinity, rate: 1 }], stampDuty: 0.2 },
    Consumer: { slabs: [{ upto: 500000, rate: 0 }, { upto: 2000000, rate: 0.1 }, { upto: Infinity, rate: 0.15 }], stampDuty: 0 },
  },
  "Madhya Pradesh": {
    "Civil Suit": { slabs: [{ upto: 100000, rate: 1.25 }, { upto: 500000, rate: 0.9 }, { upto: Infinity, rate: 0.6 }], stampDuty: 0.1 },
    Criminal: { slabs: [{ upto: Infinity, rate: 0 }], stampDuty: 0 },
    Family: { slabs: [{ upto: 500000, rate: 0.5 }, { upto: Infinity, rate: 0.35 }], stampDuty: 0.05 },
    Property: { slabs: [{ upto: 100000, rate: 2 }, { upto: 1000000, rate: 1.75 }, { upto: Infinity, rate: 1.2 }], stampDuty: 0.2 },
    Consumer: { slabs: [{ upto: 500000, rate: 0 }, { upto: 2000000, rate: 0.1 }, { upto: Infinity, rate: 0.15 }], stampDuty: 0 },
  },
  Kerala: {
    "Civil Suit": { slabs: [{ upto: 100000, rate: 1 }, { upto: 500000, rate: 0.75 }, { upto: Infinity, rate: 0.5 }], stampDuty: 0.1 },
    Criminal: { slabs: [{ upto: Infinity, rate: 0 }], stampDuty: 0 },
    Family: { slabs: [{ upto: 500000, rate: 0.5 }, { upto: Infinity, rate: 0.3 }], stampDuty: 0.05 },
    Property: { slabs: [{ upto: 100000, rate: 2 }, { upto: 1000000, rate: 1.5 }, { upto: Infinity, rate: 1 }], stampDuty: 0.2 },
    Consumer: { slabs: [{ upto: 500000, rate: 0 }, { upto: 2000000, rate: 0.1 }, { upto: Infinity, rate: 0.15 }], stampDuty: 0 },
  },
  Telangana: {
    "Civil Suit": { slabs: [{ upto: 100000, rate: 1.2 }, { upto: 500000, rate: 0.8 }, { upto: Infinity, rate: 0.5 }], stampDuty: 0.1 },
    Criminal: { slabs: [{ upto: Infinity, rate: 0 }], stampDuty: 0 },
    Family: { slabs: [{ upto: 500000, rate: 0.5 }, { upto: Infinity, rate: 0.35 }], stampDuty: 0.05 },
    Property: { slabs: [{ upto: 100000, rate: 2 }, { upto: 1000000, rate: 1.5 }, { upto: Infinity, rate: 1 }], stampDuty: 0.2 },
    Consumer: { slabs: [{ upto: 500000, rate: 0 }, { upto: 2000000, rate: 0.1 }, { upto: Infinity, rate: 0.15 }], stampDuty: 0 },
  },
  "Andhra Pradesh": {
    "Civil Suit": { slabs: [{ upto: 100000, rate: 1.2 }, { upto: 500000, rate: 0.8 }, { upto: Infinity, rate: 0.5 }], stampDuty: 0.1 },
    Criminal: { slabs: [{ upto: Infinity, rate: 0 }], stampDuty: 0 },
    Family: { slabs: [{ upto: 500000, rate: 0.5 }, { upto: Infinity, rate: 0.35 }], stampDuty: 0.05 },
    Property: { slabs: [{ upto: 100000, rate: 2 }, { upto: 1000000, rate: 1.5 }, { upto: Infinity, rate: 1 }], stampDuty: 0.2 },
    Consumer: { slabs: [{ upto: 500000, rate: 0 }, { upto: 2000000, rate: 0.1 }, { upto: Infinity, rate: 0.15 }], stampDuty: 0 },
  },
  Punjab: {
    "Civil Suit": { slabs: [{ upto: 100000, rate: 1.5 }, { upto: 500000, rate: 1 }, { upto: Infinity, rate: 0.7 }], stampDuty: 0.1 },
    Criminal: { slabs: [{ upto: Infinity, rate: 0 }], stampDuty: 0 },
    Family: { slabs: [{ upto: 500000, rate: 0.5 }, { upto: Infinity, rate: 0.4 }], stampDuty: 0.05 },
    Property: { slabs: [{ upto: 100000, rate: 2 }, { upto: 1000000, rate: 1.75 }, { upto: Infinity, rate: 1.25 }], stampDuty: 0.2 },
    Consumer: { slabs: [{ upto: 500000, rate: 0 }, { upto: 2000000, rate: 0.1 }, { upto: Infinity, rate: 0.15 }], stampDuty: 0 },
  },
  Haryana: {
    "Civil Suit": { slabs: [{ upto: 100000, rate: 1.5 }, { upto: 500000, rate: 1 }, { upto: Infinity, rate: 0.7 }], stampDuty: 0.1 },
    Criminal: { slabs: [{ upto: Infinity, rate: 0 }], stampDuty: 0 },
    Family: { slabs: [{ upto: 500000, rate: 0.5 }, { upto: Infinity, rate: 0.4 }], stampDuty: 0.05 },
    Property: { slabs: [{ upto: 100000, rate: 2 }, { upto: 1000000, rate: 1.75 }, { upto: Infinity, rate: 1.25 }], stampDuty: 0.2 },
    Consumer: { slabs: [{ upto: 500000, rate: 0 }, { upto: 2000000, rate: 0.1 }, { upto: Infinity, rate: 0.15 }], stampDuty: 0 },
  },
  Bihar: {
    "Civil Suit": { slabs: [{ upto: 100000, rate: 1 }, { upto: 500000, rate: 0.75 }, { upto: Infinity, rate: 0.5 }], stampDuty: 0.1 },
    Criminal: { slabs: [{ upto: Infinity, rate: 0 }], stampDuty: 0 },
    Family: { slabs: [{ upto: 500000, rate: 0.5 }, { upto: Infinity, rate: 0.3 }], stampDuty: 0.05 },
    Property: { slabs: [{ upto: 100000, rate: 2 }, { upto: 1000000, rate: 1.5 }, { upto: Infinity, rate: 1 }], stampDuty: 0.2 },
    Consumer: { slabs: [{ upto: 500000, rate: 0 }, { upto: 2000000, rate: 0.1 }, { upto: Infinity, rate: 0.12 }], stampDuty: 0 },
  },
};

export default function CourtFeeCalculator() {
  const [state, setState] = useState("Maharashtra");
  const [caseType, setCaseType] = useState("Civil Suit");
  const [suitValue, setSuitValue] = useState("");

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  const result = useMemo(() => {
    const val = parseFloat(suitValue);
    if (!val || val <= 0) return null;

    const rateData = STATE_RATES[state]?.[caseType];
    if (!rateData) return null;

    // Calculate court fee using slab rates
    let courtFee = 0;
    let remaining = val;
    let prevUpto = 0;
    for (const slab of rateData.slabs) {
      const slabAmount = Math.min(remaining, slab.upto - prevUpto);
      courtFee += slabAmount * (slab.rate / 100);
      remaining -= slabAmount;
      prevUpto = slab.upto;
      if (remaining <= 0) break;
    }

    // Minimum court fee
    courtFee = Math.max(courtFee, caseType === "Criminal" ? 0 : 100);

    const stampDuty = val * (rateData.stampDuty / 100);

    // Advocate fee estimate (typical range)
    const advocateMin = Math.max(5000, val * 0.01);
    const advocateMax = Math.max(15000, val * 0.05);

    return { courtFee, stampDuty, advocateMin, advocateMax, total: courtFee + stampDuty };
  }, [state, caseType, suitValue]);

  const currentRates = STATE_RATES[state]?.[caseType];

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Select State</label>
          <select value={state} onChange={(e) => setState(e.target.value)} className="calc-input">
            {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Case Type</label>
          <div className="flex flex-wrap gap-2">
            {CASE_TYPES.map((ct) => (
              <button key={ct} onClick={() => setCaseType(ct)}
                className={ct === caseType ? "btn-primary" : "btn-secondary"}>
                {ct}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Suit Value / Claim Amount</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">&#8377;</span>
            <input type="number" placeholder="Enter suit value" value={suitValue}
              onChange={(e) => setSuitValue(e.target.value)} className="calc-input pl-8" />
          </div>
        </div>
      </div>

      {result && (
        <div className="result-card space-y-4">
          <h3 className="text-lg font-bold text-gray-800">Fee Breakdown</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Court Fee</div>
              <div className="text-2xl font-extrabold text-indigo-600">{fmt(result.courtFee)}</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Stamp Duty</div>
              <div className="text-2xl font-extrabold text-orange-500">{fmt(result.stampDuty)}</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Total (Fee + Stamp)</div>
              <div className="text-2xl font-extrabold text-green-600">{fmt(result.total)}</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Advocate Fee (Estimate)</div>
              <div className="text-lg font-bold text-gray-700">
                {fmt(result.advocateMin)} - {fmt(result.advocateMax)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rate Reference Table */}
      {currentRates && (
        <div className="bg-gray-50 rounded-xl p-4">
          <h4 className="text-sm font-bold text-gray-700 mb-3">Rate Reference: {state} - {caseType}</h4>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 text-gray-600">Suit Value Slab</th>
                <th className="text-right py-2 text-gray-600">Court Fee Rate</th>
              </tr>
            </thead>
            <tbody>
              {currentRates.slabs.map((slab, i) => (
                <tr key={i} className="border-b border-gray-200">
                  <td className="py-2 text-gray-700">
                    {i === 0 ? "Up to" : "Above"} {slab.upto === Infinity ? (i === 0 ? "Any" : fmt(currentRates.slabs[i - 1].upto)) : fmt(slab.upto)}
                    {slab.upto !== Infinity && ` to ${fmt(slab.upto)}`}
                  </td>
                  <td className="py-2 text-right font-semibold text-indigo-600">{slab.rate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
          {currentRates.stampDuty > 0 && (
            <p className="text-xs text-gray-500 mt-2">Stamp Duty Rate: {currentRates.stampDuty}% of suit value</p>
          )}
        </div>
      )}

      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-xs text-yellow-800">
        <strong>Disclaimer:</strong> These are approximate rates for reference only. Actual court fees vary based on specific suit details, amendments to state fee schedules, and court discretion. Please consult a legal professional for exact fees.
      </div>
    </div>
  );
}
