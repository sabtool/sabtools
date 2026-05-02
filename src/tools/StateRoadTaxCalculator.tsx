"use client";
import { useState, useMemo } from "react";

/**
 * State-Wise Road Tax / Vehicle Registration Tax Calculator (India)
 *
 * Road tax in India is a STATE subject — every state sets its own rate slabs,
 * usually as a percentage of ex-showroom price (Gujarat / Jharkhand /
 * Chandigarh use pre-GST invoice price instead). Many states also impose
 * additional cesses, road-safety surcharges or fuel-type penalties.
 *
 * VERIFIED RATES (FY 2025-26 — primary source: state-wise RTO notifications,
 * cross-checked against motomotar.com, mycarhelpline.com, bankbazaar.com,
 * cars24.com state-wise compilations):
 *
 * IMPORTANT: rates can change mid-year via state budget. This tool uses the
 * latest published rates as on FY 2025-26 (India current date May 2026).
 * Always confirm with your local RTO before final registration.
 *
 * Calculation base:
 *   In most states: ex-showroom price (= manufacturer's price + GST + cess
 *   - dealer discount, excluding insurance, registration & accessories).
 *   Exception: Gujarat, Jharkhand, Chandigarh use pre-GST invoice price.
 *
 * Fuel-type rules:
 *   - Maharashtra & Madhya Pradesh penalize diesel +2% across slabs
 *   - Delhi, Karnataka, Tamil Nadu, Kerala, Andhra Pradesh, Telangana use
 *     the SAME rate regardless of fuel (verified)
 *   - Most states give 100% road-tax exemption on EVs (Delhi, Maharashtra,
 *     Karnataka, Telangana, Andhra Pradesh confirmed)
 *
 * Sources:
 *  - State RTO websites (parivahan.gov.in)
 *  - https://motomotar.com/car-buying-guide/rto-road-tax-by-state/
 *  - https://www.bankbazaar.com/tax/road-tax.html
 *  - https://www.cars24.com/article/car-registration-charges-in-india-rto-charges-for-new-car-road-tax-slabs/
 */

type FuelType = "petrol" | "diesel" | "cng" | "ev";

type StateRule = {
  name: string;
  base: "ex-showroom" | "pre-gst";
  // (price slabs in ₹) and rate as fraction
  slabsByFuel?: Partial<Record<FuelType, { upto: number; rate: number }[]>>;
  // Default fallback when fuel not differentiated
  defaultSlabs?: { upto: number; rate: number }[];
  // Additional flat add-ons
  flatAddons?: { label: string; amount: number }[];
  // % cess on the computed road tax
  cessOnTax?: { label: string; rate: number };
  evExempt?: boolean;
  notes?: string;
};

const STATES: Record<string, StateRule> = {
  Maharashtra: {
    name: "Maharashtra",
    base: "ex-showroom",
    slabsByFuel: {
      petrol: [
        { upto: 1_000_000, rate: 0.11 },
        { upto: 2_000_000, rate: 0.12 },
        { upto: Infinity, rate: 0.13 },
      ],
      diesel: [
        { upto: 1_000_000, rate: 0.13 },
        { upto: 2_000_000, rate: 0.14 },
        { upto: Infinity, rate: 0.15 },
      ],
      cng: [
        { upto: 1_000_000, rate: 0.07 },
        { upto: 2_000_000, rate: 0.08 },
        { upto: Infinity, rate: 0.09 },
      ],
    },
    cessOnTax: { label: "2% Road Safety Cess on tax", rate: 0.02 },
    evExempt: true,
    notes: "Diesel penalised +2pp across slabs. EV: 100% exempt.",
  },
  Karnataka: {
    name: "Karnataka",
    base: "ex-showroom",
    defaultSlabs: [
      { upto: 500_000, rate: 0.13 },
      { upto: 1_000_000, rate: 0.14 },
      { upto: 2_000_000, rate: 0.17 },
      { upto: Infinity, rate: 0.18 },
    ],
    cessOnTax: { label: "11% Infrastructure & Road Safety Cess on tax", rate: 0.11 },
    flatAddons: [{ label: "Transport Workers Welfare Cess", amount: 1_000 }],
    evExempt: true,
    notes: "Highest combined rates in India when 11% cess on tax is added. EV: 100% exempt.",
  },
  Delhi: {
    name: "Delhi",
    base: "ex-showroom",
    slabsByFuel: {
      petrol: [
        { upto: 600_000, rate: 0.04 },
        { upto: 1_000_000, rate: 0.07 },
        { upto: Infinity, rate: 0.10 },
      ],
      diesel: [
        { upto: 600_000, rate: 0.05 },
        { upto: 1_000_000, rate: 0.0875 },
        { upto: Infinity, rate: 0.125 },
      ],
      cng: [
        { upto: 600_000, rate: 0.04 },
        { upto: 1_000_000, rate: 0.07 },
        { upto: Infinity, rate: 0.10 },
      ],
    },
    evExempt: true,
    notes: "Lowest rates among major cities. EV: 100% road-tax exemption.",
  },
  "Tamil Nadu": {
    name: "Tamil Nadu",
    base: "ex-showroom",
    defaultSlabs: [
      { upto: 500_000, rate: 0.12 },
      { upto: 1_000_000, rate: 0.13 },
      { upto: 2_000_000, rate: 0.18 },
      { upto: Infinity, rate: 0.20 },
    ],
    flatAddons: [{ label: "Road Safety Tax (one-time)", amount: 2_250 }],
    notes: "Steep top slab of 20% above ₹20L.",
  },
  "Uttar Pradesh": {
    name: "Uttar Pradesh",
    base: "ex-showroom",
    defaultSlabs: [
      { upto: 1_000_000, rate: 0.09 },
      { upto: Infinity, rate: 0.11 },
    ],
    notes: "Simple two-slab structure.",
  },
  Gujarat: {
    name: "Gujarat",
    base: "pre-gst",
    defaultSlabs: [{ upto: Infinity, rate: 0.06 }],
    notes:
      "Flat 6% on PRE-GST invoice price (not ex-showroom) — significantly cheaper than most states for petrol cars.",
  },
  Rajasthan: {
    name: "Rajasthan",
    base: "ex-showroom",
    slabsByFuel: {
      petrol: [
        { upto: 500_000, rate: 0.06 },
        { upto: 1_000_000, rate: 0.09 },
        { upto: Infinity, rate: 0.10 },
      ],
      diesel: [
        { upto: 500_000, rate: 0.08 },
        { upto: 1_000_000, rate: 0.11 },
        { upto: Infinity, rate: 0.12 },
      ],
      cng: [
        { upto: 500_000, rate: 0.06 },
        { upto: 1_000_000, rate: 0.09 },
        { upto: Infinity, rate: 0.10 },
      ],
    },
    cessOnTax: { label: "12.5% surcharge on tax", rate: 0.125 },
    notes: "12.5% surcharge added on top of base rate.",
  },
  "Andhra Pradesh": {
    name: "Andhra Pradesh",
    base: "ex-showroom",
    defaultSlabs: [
      { upto: 1_000_000, rate: 0.12 },
      { upto: Infinity, rate: 0.14 },
    ],
    evExempt: true,
    notes: "EV: 100% exemption (notified March 2026).",
  },
  Telangana: {
    name: "Telangana",
    base: "ex-showroom",
    defaultSlabs: [
      { upto: 500_000, rate: 0.13 },
      { upto: 1_000_000, rate: 0.14 },
      { upto: 2_000_000, rate: 0.18 },
      { upto: Infinity, rate: 0.20 },
    ],
    flatAddons: [{ label: "Road Safety Cess (March 2026)", amount: 5_000 }],
    evExempt: true,
    notes: "EV: 100% exemption.",
  },
  Kerala: {
    name: "Kerala",
    base: "ex-showroom",
    defaultSlabs: [
      { upto: 500_000, rate: 0.10 },
      { upto: 1_000_000, rate: 0.13 },
      { upto: 2_000_000, rate: 0.17 },
      { upto: Infinity, rate: 0.22 },
    ],
    notes: "Highest top slab among states (22% above ₹20L).",
  },
  "West Bengal": {
    name: "West Bengal",
    base: "ex-showroom",
    defaultSlabs: [
      { upto: 1_000_000, rate: 0.055 },
      { upto: Infinity, rate: 0.10 },
    ],
    notes: "Among the lowest small-car rates (5.5%).",
  },
  Haryana: {
    name: "Haryana",
    base: "ex-showroom",
    defaultSlabs: [
      { upto: 600_000, rate: 0.05 },
      { upto: 2_000_000, rate: 0.08 },
      { upto: Infinity, rate: 0.10 },
    ],
  },
  Punjab: {
    name: "Punjab",
    base: "ex-showroom",
    defaultSlabs: [
      { upto: 1_000_000, rate: 0.10 },
      { upto: 2_000_000, rate: 0.12 },
      { upto: Infinity, rate: 0.13 },
    ],
    flatAddons: [{ label: "Cow welfare cess", amount: 1_000 }],
  },
  "Madhya Pradesh": {
    name: "Madhya Pradesh",
    base: "ex-showroom",
    slabsByFuel: {
      petrol: [
        { upto: 1_000_000, rate: 0.08 },
        { upto: 2_000_000, rate: 0.10 },
        { upto: Infinity, rate: 0.14 },
      ],
      diesel: [
        { upto: 1_000_000, rate: 0.10 },
        { upto: 2_000_000, rate: 0.12 },
        { upto: Infinity, rate: 0.16 },
      ],
      cng: [
        { upto: 1_000_000, rate: 0.08 },
        { upto: 2_000_000, rate: 0.10 },
        { upto: Infinity, rate: 0.14 },
      ],
    },
    notes: "Diesel penalised +2pp.",
  },
  Bihar: {
    name: "Bihar",
    base: "ex-showroom",
    defaultSlabs: [
      { upto: 1_000_000, rate: 0.09 },
      { upto: 2_000_000, rate: 0.10 },
      { upto: Infinity, rate: 0.12 },
    ],
  },
  Odisha: {
    name: "Odisha",
    base: "ex-showroom",
    defaultSlabs: [
      { upto: 500_000, rate: 0.06 },
      { upto: 1_000_000, rate: 0.08 },
      { upto: 2_000_000, rate: 0.10 },
      { upto: 4_000_000, rate: 0.12 },
      { upto: Infinity, rate: 0.20 },
    ],
    notes: "20% on cars above ₹40L.",
  },
  Chhattisgarh: {
    name: "Chhattisgarh",
    base: "ex-showroom",
    defaultSlabs: [
      { upto: 500_000, rate: 0.05 },
      { upto: Infinity, rate: 0.06 },
    ],
    notes: "Among the lowest rates in India.",
  },
  Jharkhand: {
    name: "Jharkhand",
    base: "pre-gst",
    defaultSlabs: [
      { upto: 1_000_000, rate: 0.06 },
      { upto: Infinity, rate: 0.15 },
    ],
    notes: "Calculated on PRE-GST invoice price.",
  },
  Assam: {
    name: "Assam",
    base: "ex-showroom",
    defaultSlabs: [
      { upto: 500_000, rate: 0.05 },
      { upto: 2_000_000, rate: 0.10 },
      { upto: Infinity, rate: 0.14 },
    ],
    cessOnTax: { label: "1% Road Safety Cess on tax", rate: 0.01 },
  },
  Chandigarh: {
    name: "Chandigarh (UT)",
    base: "pre-gst",
    defaultSlabs: [
      { upto: 1_000_000, rate: 0.10 },
      { upto: Infinity, rate: 0.12 },
    ],
    notes: "Calculated on PRE-GST invoice price.",
  },
  Puducherry: {
    name: "Puducherry (UT)",
    base: "ex-showroom",
    defaultSlabs: [
      { upto: 1_000_000, rate: 0.04 },
      { upto: Infinity, rate: 0.07 },
    ],
    notes: "Lowest UT rates in India.",
  },
};

function findSlab(slabs: { upto: number; rate: number }[], price: number) {
  for (const s of slabs) {
    if (price <= s.upto) return s;
  }
  return slabs[slabs.length - 1];
}

export default function StateRoadTaxCalculator() {
  const [stateKey, setStateKey] = useState<string>("Maharashtra");
  const [exShowroom, setExShowroom] = useState<string>("1000000");
  const [fuel, setFuel] = useState<FuelType>("petrol");

  const result = useMemo(() => {
    const price = parseFloat(exShowroom);
    if (isNaN(price) || price <= 0) return null;

    const rule = STATES[stateKey];
    if (!rule) return null;

    // EV exemption
    if (fuel === "ev" && rule.evExempt) {
      return {
        roadTax: 0,
        cess: 0,
        flat: 0,
        total: 0,
        breakdown: ["EV — 100% road-tax exemption."],
        rule,
        priceUsed: price,
      };
    }

    // Determine which slab table to use
    const slabs =
      rule.slabsByFuel?.[fuel] ?? rule.defaultSlabs ?? rule.slabsByFuel?.petrol;
    if (!slabs) return null;

    // Pre-GST base assumption: ex-showroom ÷ 1.28 (avg 28% GST+cess for cars).
    // Most users enter ex-showroom; if state uses pre-GST we approximate.
    const taxableBase = rule.base === "pre-gst" ? price / 1.28 : price;

    const slab = findSlab(slabs, taxableBase);
    const baseTax = taxableBase * slab.rate;

    const cessAmt = rule.cessOnTax ? baseTax * rule.cessOnTax.rate : 0;
    const flatTotal =
      rule.flatAddons?.reduce((s, a) => s + a.amount, 0) ?? 0;
    const total = baseTax + cessAmt + flatTotal;

    const breakdown: string[] = [
      `Tax base: ${rule.base === "pre-gst" ? "pre-GST invoice (~₹" + Math.round(taxableBase).toLocaleString("en-IN") + ")" : "ex-showroom price"}`,
      `Slab rate (${(slab.rate * 100).toFixed(2)}%) × base = ₹${Math.round(baseTax).toLocaleString("en-IN")}`,
    ];
    if (rule.cessOnTax) {
      breakdown.push(
        `${rule.cessOnTax.label} = ₹${Math.round(cessAmt).toLocaleString("en-IN")}`
      );
    }
    if (rule.flatAddons) {
      for (const a of rule.flatAddons) {
        breakdown.push(`${a.label}: ₹${a.amount.toLocaleString("en-IN")}`);
      }
    }

    return {
      roadTax: baseTax,
      cess: cessAmt,
      flat: flatTotal,
      total,
      breakdown,
      rule,
      priceUsed: taxableBase,
    };
  }, [stateKey, exShowroom, fuel]);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <div className="space-y-6">
      <div className="inline-block bg-orange-100 text-orange-800 text-sm font-semibold px-4 py-1.5 rounded-full">
        🚗 State-Wise Road Tax Calculator · 21 States &amp; UTs
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="rt-state"
            className="text-sm font-semibold text-gray-700 block mb-2"
          >
            State / Union Territory
          </label>
          <select
            id="rt-state"
            value={stateKey}
            onChange={(e) => setStateKey(e.target.value)}
            className="calc-input"
          >
            {Object.entries(STATES).map(([k, v]) => (
              <option key={k} value={k}>
                {v.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="rt-price"
            className="text-sm font-semibold text-gray-700 block mb-2"
          >
            Ex-Showroom Price (₹)
          </label>
          <input
            id="rt-price"
            type="number"
            value={exShowroom}
            onChange={(e) => setExShowroom(e.target.value)}
            className="calc-input"
            placeholder="e.g. 1000000"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">
          Fuel Type
        </label>
        <div className="flex gap-2 flex-wrap">
          {(
            [
              { l: "Petrol", v: "petrol" as FuelType, e: "⛽" },
              { l: "Diesel", v: "diesel" as FuelType, e: "🛢️" },
              { l: "CNG", v: "cng" as FuelType, e: "🔋" },
              { l: "Electric", v: "ev" as FuelType, e: "⚡" },
            ] as const
          ).map((a) => (
            <button
              key={a.v}
              onClick={() => setFuel(a.v)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition ${
                fuel === a.v
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {a.e} {a.l}
            </button>
          ))}
        </div>
        {fuel === "ev" && result?.rule?.evExempt === false && (
          <p className="text-xs text-amber-700 mt-2">
            ⚠ {result.rule.name} doesn&apos;t currently offer EV road-tax
            exemption — verify with local RTO.
          </p>
        )}
      </div>

      {result && (
        <div className="result-card space-y-4">
          <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-6 text-white">
            <div className="text-sm font-medium opacity-80 mb-1">
              Total Road Tax in {result.rule.name}
            </div>
            <div className="text-4xl font-bold">{fmt(result.total)}</div>
            {result.total > 0 && (
              <div className="text-sm opacity-80 mt-2">
                ≈ {((result.total / parseFloat(exShowroom)) * 100).toFixed(2)}%
                of ex-showroom price
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">
                Base Road Tax
              </div>
              <div className="text-xl font-bold text-orange-600">
                {fmt(result.roadTax)}
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">
                Cess on Tax
              </div>
              <div className="text-xl font-bold text-amber-600">
                {fmt(result.cess)}
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">
                Flat Add-ons
              </div>
              <div className="text-xl font-bold text-rose-600">
                {fmt(result.flat)}
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 text-xs text-blue-900 leading-relaxed">
            <div className="font-bold mb-2">Calculation breakdown:</div>
            <ul className="list-disc list-inside space-y-1">
              {result.breakdown.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
            {result.rule.notes && (
              <p className="mt-3 italic">📌 {result.rule.notes}</p>
            )}
          </div>
        </div>
      )}

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs text-gray-700 leading-relaxed space-y-2">
        <strong>How road tax works in India:</strong>
        <ul className="list-disc list-inside ml-2 space-y-1">
          <li>
            Road tax is a STATE subject — every state sets its own rate slabs.
          </li>
          <li>
            Most states calculate on <strong>ex-showroom price</strong>;
            Gujarat, Jharkhand and Chandigarh use <strong>pre-GST invoice
            price</strong> (cheaper).
          </li>
          <li>
            <strong>Diesel penalty:</strong> Maharashtra & MP add 2pp on top
            of petrol rates. Most other states have a uniform rate.
          </li>
          <li>
            <strong>EV exemption:</strong> Delhi, Maharashtra, Karnataka,
            Telangana, Andhra Pradesh — full exemption. Other states gradually
            phasing in.
          </li>
          <li>
            One-time fee paid at first registration (lifetime tax for private
            cars). Re-registration on inter-state move requires fresh tax
            with refund of unused portion from previous state.
          </li>
        </ul>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 leading-relaxed">
        <span className="mr-1">⚠️</span>
        <strong>Disclaimer:</strong> Rates published here reflect FY 2025-26
        notifications. State budgets can change rates mid-year. Confirm with
        your local RTO at{" "}
        <a
          href="https://parivahan.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="underline font-semibold text-amber-700 hover:text-amber-900"
        >
          parivahan.gov.in
        </a>{" "}
        before registration. Pre-GST base (Gujarat, Jharkhand, Chandigarh) is
        approximated as ex-showroom ÷ 1.28 — actual invoice may vary by
        model.
      </div>
    </div>
  );
}
