"use client";
import { useState, useMemo } from "react";

const STATES = [
  "Maharashtra",
  "Delhi",
  "Karnataka",
  "Tamil Nadu",
  "Uttar Pradesh",
  "Gujarat",
  "Rajasthan",
  "Madhya Pradesh",
  "West Bengal",
  "Kerala",
  "Telangana",
  "Andhra Pradesh",
  "Bihar",
  "Punjab",
  "Haryana",
] as const;

type StateName = (typeof STATES)[number];

const CASE_TYPES = [
  "Civil Suit - Money Recovery",
  "Civil Suit - Property",
  "Family Court",
  "Consumer Complaint",
  "Appeal",
  "Revision",
  "Writ Petition",
] as const;

type CaseType = (typeof CASE_TYPES)[number];

const FAMILY_COURT_FEES: Record<string, number> = {
  Maharashtra: 500,
  Delhi: 750,
  Karnataka: 500,
  "Tamil Nadu": 600,
  "Uttar Pradesh": 750,
  Gujarat: 500,
  Rajasthan: 500,
  "Madhya Pradesh": 600,
  "West Bengal": 750,
  Kerala: 500,
  Telangana: 600,
  "Andhra Pradesh": 600,
  Bihar: 1000,
  Punjab: 750,
  Haryana: 750,
};

const WRIT_FEES: Record<string, number> = {
  Maharashtra: 1000,
  Delhi: 1500,
  Karnataka: 500,
  "Tamil Nadu": 1000,
  "Uttar Pradesh": 700,
  Gujarat: 1000,
  Rajasthan: 500,
  "Madhya Pradesh": 750,
  "West Bengal": 2000,
  Kerala: 500,
  Telangana: 1000,
  "Andhra Pradesh": 1000,
  Bihar: 500,
  Punjab: 1000,
  Haryana: 1000,
};

function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

function calcCivilFee(state: StateName, amount: number): { fee: number; rate: string; breakdown: string } {
  let fee = 0;
  let rate = "";
  let breakdown = "";

  switch (state) {
    case "Maharashtra":
    case "Gujarat": {
      if (amount <= 500000) {
        fee = amount * 0.05;
        rate = "5%";
        breakdown = `${formatINR(amount)} x 5%`;
      } else if (amount <= 2500000) {
        const base = 500000 * 0.05;
        const extra = (amount - 500000) * 0.04;
        fee = base + extra;
        rate = "5% up to 5L + 4% on balance";
        breakdown = `${formatINR(500000)} x 5% = ${formatINR(base)} + ${formatINR(amount - 500000)} x 4% = ${formatINR(extra)}`;
      } else {
        const base1 = 500000 * 0.05;
        const base2 = 2000000 * 0.04;
        const extra = (amount - 2500000) * 0.03;
        fee = base1 + base2 + extra;
        rate = "5% up to 5L + 4% (5L-25L) + 3% above 25L";
        breakdown = `${formatINR(base1)} + ${formatINR(base2)} + ${formatINR(extra)}`;
      }
      fee = Math.max(fee, 50);
      break;
    }
    case "Delhi": {
      if (amount <= 500000) {
        fee = 500 + amount * 0.03;
        rate = "Flat 500 + 3%";
        breakdown = `500 + ${formatINR(amount)} x 3%`;
      } else if (amount <= 1000000) {
        const base = 500 + 500000 * 0.03;
        const extra = (amount - 500000) * 0.025;
        fee = base + extra;
        rate = "500 + 3% up to 5L + 2.5% on balance";
        breakdown = `${formatINR(base)} + ${formatINR(amount - 500000)} x 2.5%`;
      } else {
        const base = 500 + 500000 * 0.03 + 500000 * 0.025;
        const extra = (amount - 1000000) * 0.02;
        fee = base + extra;
        rate = "500 + 3% (up to 5L) + 2.5% (5L-10L) + 2% above 10L";
        breakdown = `${formatINR(base)} + ${formatINR(amount - 1000000)} x 2%`;
      }
      fee = Math.max(fee, 50);
      break;
    }
    case "Karnataka": {
      if (amount <= 100000) {
        fee = amount * 0.05;
        rate = "5%";
        breakdown = `${formatINR(amount)} x 5%`;
      } else if (amount <= 500000) {
        const base = 100000 * 0.05;
        const extra = (amount - 100000) * 0.04;
        fee = base + extra;
        rate = "5% up to 1L + 4% on balance";
        breakdown = `${formatINR(base)} + ${formatINR(amount - 100000)} x 4%`;
      } else if (amount <= 1000000) {
        const base = 100000 * 0.05 + 400000 * 0.04;
        const extra = (amount - 500000) * 0.03;
        fee = base + extra;
        rate = "5% (up to 1L) + 4% (1L-5L) + 3% (5L-10L)";
        breakdown = `${formatINR(base)} + ${formatINR(amount - 500000)} x 3%`;
      } else {
        const base = 100000 * 0.05 + 400000 * 0.04 + 500000 * 0.03;
        const extra = (amount - 1000000) * 0.02;
        fee = base + extra;
        rate = "5% (up to 1L) + 4% (1L-5L) + 3% (5L-10L) + 2% above 10L";
        breakdown = `${formatINR(base)} + ${formatINR(amount - 1000000)} x 2%`;
      }
      break;
    }
    case "Uttar Pradesh": {
      if (amount <= 250000) {
        fee = 750 + amount * 0.04;
        rate = "Flat 750 + 4%";
        breakdown = `750 + ${formatINR(amount)} x 4%`;
      } else {
        const base = 750 + 250000 * 0.04;
        const extra = (amount - 250000) * 0.03;
        fee = base + extra;
        rate = "750 + 4% up to 2.5L + 3% above";
        breakdown = `${formatINR(base)} + ${formatINR(amount - 250000)} x 3%`;
      }
      break;
    }
    case "Tamil Nadu": {
      if (amount <= 300000) {
        fee = amount * 0.05;
        rate = "5%";
        breakdown = `${formatINR(amount)} x 5%`;
      } else if (amount <= 1000000) {
        const base = 300000 * 0.05;
        const extra = (amount - 300000) * 0.03;
        fee = base + extra;
        rate = "5% up to 3L + 3% on balance";
        breakdown = `${formatINR(base)} + ${formatINR(amount - 300000)} x 3%`;
      } else {
        const base = 300000 * 0.05 + 700000 * 0.03;
        const extra = (amount - 1000000) * 0.02;
        fee = base + extra;
        rate = "5% (up to 3L) + 3% (3L-10L) + 2% above 10L";
        breakdown = `${formatINR(base)} + ${formatINR(amount - 1000000)} x 2%`;
      }
      break;
    }
    case "Rajasthan": {
      if (amount <= 100000) {
        fee = amount * 0.05;
        rate = "5%";
        breakdown = `${formatINR(amount)} x 5%`;
      } else {
        const base = 100000 * 0.05;
        const extra = (amount - 100000) * 0.03;
        fee = base + extra;
        rate = "5% up to 1L + 3% above";
        breakdown = `${formatINR(base)} + ${formatINR(amount - 100000)} x 3%`;
      }
      break;
    }
    default: {
      if (amount <= 500000) {
        fee = amount * 0.05;
        rate = "5%";
        breakdown = `${formatINR(amount)} x 5%`;
      } else {
        const base = 500000 * 0.05;
        const extra = (amount - 500000) * 0.03;
        fee = base + extra;
        rate = "5% up to 5L + 3% above";
        breakdown = `${formatINR(base)} + ${formatINR(amount - 500000)} x 3%`;
      }
      break;
    }
  }

  return { fee, rate, breakdown };
}

function calcConsumerFee(amount: number): { fee: number; breakdown: string } {
  let fee = 0;
  let slab = "";
  if (amount <= 500000) {
    fee = 0;
    slab = "Up to 5 Lakh: Nil";
  } else if (amount <= 1000000) {
    fee = 200;
    slab = "5L - 10L: Flat \u20b9200";
  } else if (amount <= 2000000) {
    fee = 400;
    slab = "10L - 20L: Flat \u20b9400";
  } else if (amount <= 5000000) {
    fee = 1000;
    slab = "20L - 50L: Flat \u20b91,000";
  } else if (amount <= 10000000) {
    fee = 2000;
    slab = "50L - 1Cr: Flat \u20b92,000";
  } else {
    fee = 5000;
    slab = "Above 1Cr: Flat \u20b95,000";
  }
  return { fee, breakdown: slab };
}

export default function CourtFeeCalculator() {
  const [state, setState] = useState<StateName>("Maharashtra");
  const [caseType, setCaseType] = useState<CaseType>("Civil Suit - Money Recovery");
  const [amount, setAmount] = useState("");

  const result = useMemo(() => {
    const val = parseFloat(amount);
    if (!amount || isNaN(val) || val < 0) return null;

    let fee = 0;
    let rate = "";
    let breakdown = "";
    let label = "Court Fee";

    switch (caseType) {
      case "Civil Suit - Money Recovery":
      case "Civil Suit - Property": {
        const calc = calcCivilFee(state, val);
        fee = calc.fee;
        rate = calc.rate;
        breakdown = calc.breakdown;
        label = "Ad Valorem Court Fee";
        break;
      }
      case "Consumer Complaint": {
        const calc = calcConsumerFee(val);
        fee = calc.fee;
        breakdown = calc.breakdown;
        label = "Consumer Forum Fee";
        break;
      }
      case "Family Court": {
        fee = FAMILY_COURT_FEES[state] ?? 750;
        breakdown = `Flat fee for ${state}`;
        label = "Family Court Fee";
        break;
      }
      case "Appeal": {
        const calc = calcCivilFee(state, val);
        fee = Math.round(calc.fee * 0.5);
        rate = "50% of original court fee";
        breakdown = `Original fee ${formatINR(calc.fee)} x 50%`;
        label = "Appeal Court Fee";
        break;
      }
      case "Revision": {
        const calc = calcCivilFee(state, val);
        fee = Math.round(calc.fee * 0.5);
        rate = "50% of original court fee";
        breakdown = `Original fee ${formatINR(calc.fee)} x 50%`;
        label = "Revision Court Fee";
        break;
      }
      case "Writ Petition": {
        fee = WRIT_FEES[state] ?? 1000;
        breakdown = `Flat fee for ${state}`;
        label = "Writ Petition Fee";
        break;
      }
    }

    return { fee: Math.round(fee), rate, breakdown, label };
  }, [state, caseType, amount]);

  return (
    <div className="space-y-6">
      {/* State */}
      <div>
        <label htmlFor="cfc-state" className="text-sm font-semibold text-gray-700 block mb-2">
          State
        </label>
        <select
          id="cfc-state"
          value={state}
          onChange={(e) => setState(e.target.value as StateName)}
          className="calc-input"
        >
          {STATES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Case Type */}
      <div>
        <label htmlFor="cfc-case-type" className="text-sm font-semibold text-gray-700 block mb-2">
          Case Type
        </label>
        <select
          id="cfc-case-type"
          value={caseType}
          onChange={(e) => setCaseType(e.target.value as CaseType)}
          className="calc-input"
        >
          {CASE_TYPES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Suit Value */}
      <div>
        <label htmlFor="cfc-amount" className="text-sm font-semibold text-gray-700 block mb-2">
          Suit Value / Claim Amount (INR)
        </label>
        <input
          id="cfc-amount"
          type="number"
          min="0"
          placeholder="e.g. 500000"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="calc-input"
        />
        {amount && !isNaN(parseFloat(amount)) && parseFloat(amount) >= 0 && (
          <p className="text-xs text-gray-500 mt-1">{formatINR(parseFloat(amount))}</p>
        )}
      </div>

      {/* Result */}
      {result && (
        <div className="space-y-4">
          <div className="result-card">
            <div className="text-center mb-4">
              <div className="text-sm text-gray-500">{result.label}</div>
              <div className="text-4xl font-extrabold text-indigo-600 mt-1">
                {formatINR(result.fee)}
              </div>
            </div>
          </div>

          {/* Breakdown */}
          <div className="bg-gray-50 rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-semibold text-gray-700">Fee Breakdown</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between sm:flex-col">
                <span className="text-gray-500">State</span>
                <span className="font-medium text-gray-800">{state}</span>
              </div>
              <div className="flex justify-between sm:flex-col">
                <span className="text-gray-500">Case Type</span>
                <span className="font-medium text-gray-800">{caseType}</span>
              </div>
              <div className="flex justify-between sm:flex-col">
                <span className="text-gray-500">Suit Value</span>
                <span className="font-medium text-gray-800">{formatINR(parseFloat(amount))}</span>
              </div>
              {result.rate && (
                <div className="flex justify-between sm:flex-col">
                  <span className="text-gray-500">Rate Applied</span>
                  <span className="font-medium text-gray-800">{result.rate}</span>
                </div>
              )}
              <div className="flex justify-between sm:flex-col sm:col-span-2">
                <span className="text-gray-500">Calculation</span>
                <span className="font-medium text-gray-800">{result.breakdown}</span>
              </div>
              <div className="flex justify-between sm:flex-col sm:col-span-2 pt-2 border-t border-gray-200">
                <span className="text-gray-500 font-semibold">Total Court Fee</span>
                <span className="font-bold text-indigo-600 text-lg">{formatINR(result.fee)}</span>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
            <strong>Disclaimer:</strong> These are approximate calculations based on general court fee schedules.
            Actual court fees may vary depending on the specific court, amendments to the Court Fees Act, and
            additional charges such as process fees, advocate welfare fund contributions, and stamp duties.
            Always consult the relevant State Court Fees Act and verify with your legal counsel before filing.
          </div>
        </div>
      )}
    </div>
  );
}
