"use client";
import { useState, useMemo } from "react";

/**
 * BBMP Property Tax Calculator (Bangalore / Bengaluru)
 *
 * Bruhat Bengaluru Mahanagara Palike (BBMP) computes property tax under the
 * Self Assessment Scheme (SAS) using the Unit Area Value (UAV) system.
 *
 * VERIFIED FORMULA (per Karnataka Municipal Corporation Act & BBMP rules,
 * see bbmptax.karnataka.gov.in):
 *
 *   Step 1: Annual Rateable Value
 *      G  = Built-up Area (sqft) × UAV (₹/sqft/month) × 10 months
 *
 *      (BBMP allows 2 months for vacancy / repairs, so it's 10 not 12.)
 *
 *   Step 2: Depreciation
 *      I  = G × (depreciation % based on age) / 100
 *
 *   Step 3: Net Annual Value
 *      Net = G − I
 *
 *   Step 4: Property Tax
 *      K = Net × 20%             (residential rate)
 *      Cess = K × 24%            (Health & Education Cess on K)
 *
 *      Total Property Tax = K + Cess  =  K × 1.24
 *
 *   Step 5: Optional 5% rebate if full annual tax paid before 30 May.
 *
 * VERIFIED UAV RATES (per BBMP zonal classification):
 *
 *   Zone | Self-Occupied | Tenanted
 *   -----|---------------|---------
 *    A   |   ₹2.50/sqft  |  ₹5.00/sqft
 *    B   |   ₹2.00/sqft  |  ₹4.00/sqft
 *    C   |   ₹1.80/sqft  |  ₹3.60/sqft
 *    D   |   ₹1.60/sqft  |  ₹3.20/sqft
 *    E   |   ₹1.20/sqft  |  ₹2.40/sqft
 *    F   |   ₹1.00/sqft  |  ₹2.00/sqft
 *
 * VERIFIED DEPRECIATION TABLE (BBMP Annexure-III, Schedule under rule 6 —
 * sourced directly from official PDF at bbmptax.karnataka.gov.in):
 *
 *   Age (years)        | Depreciation %
 *   --------------------|--------------
 *   ≤ 3                 |   3
 *   3 < age ≤ 6         |   6
 *   6 < age ≤ 9         |   9
 *   9 < age ≤ 12        |  12
 *   12 < age ≤ 15       |  15
 *   15 < age ≤ 18       |  18
 *   18 < age ≤ 21       |  21
 *   21 < age ≤ 24       |  24
 *   24 < age ≤ 27       |  27
 *   27 < age ≤ 30       |  30
 *   30 < age ≤ 33       |  33
 *   33 < age ≤ 36       |  36
 *   36 < age ≤ 39       |  39
 *   39 < age ≤ 42       |  42
 *   42 < age ≤ 45       |  45
 *   45 < age ≤ 48       |  48
 *   48 < age ≤ 51       |  51
 *   51 < age ≤ 54       |  54
 *   54 < age ≤ 57       |  57
 *   57 < age ≤ 60       |  60
 *   > 60                |  70
 *
 * Sources:
 *  - https://bbmptax.karnataka.gov.in (official portal)
 *  - https://bbmptax.karnataka.gov.in/documents/annexure_III%20Depreciation%20table.pdf
 *  - SAS 2008 Property Tax Handbook
 *  - Cross-referenced ClearTax, BankBazaar, Sevantay BBMP guides 2026
 */

type Zone = "A" | "B" | "C" | "D" | "E" | "F";
type Occupancy = "self" | "tenanted";

const UAV_RATES: Record<Zone, { self: number; tenanted: number }> = {
  A: { self: 2.5, tenanted: 5.0 },
  B: { self: 2.0, tenanted: 4.0 },
  C: { self: 1.8, tenanted: 3.6 },
  D: { self: 1.6, tenanted: 3.2 },
  E: { self: 1.2, tenanted: 2.4 },
  F: { self: 1.0, tenanted: 2.0 },
};

function getDepreciationRate(ageYears: number): number {
  if (ageYears <= 3) return 3;
  if (ageYears <= 6) return 6;
  if (ageYears <= 9) return 9;
  if (ageYears <= 12) return 12;
  if (ageYears <= 15) return 15;
  if (ageYears <= 18) return 18;
  if (ageYears <= 21) return 21;
  if (ageYears <= 24) return 24;
  if (ageYears <= 27) return 27;
  if (ageYears <= 30) return 30;
  if (ageYears <= 33) return 33;
  if (ageYears <= 36) return 36;
  if (ageYears <= 39) return 39;
  if (ageYears <= 42) return 42;
  if (ageYears <= 45) return 45;
  if (ageYears <= 48) return 48;
  if (ageYears <= 51) return 51;
  if (ageYears <= 54) return 54;
  if (ageYears <= 57) return 57;
  if (ageYears <= 60) return 60;
  return 70;
}

const ZONE_INFO: Record<Zone, { label: string; examples: string }> = {
  A: { label: "Zone A (Premium)", examples: "MG Road, Brigade Road, Lavelle Road, UB City, Indiranagar 1st-stage" },
  B: { label: "Zone B (High)", examples: "Koramangala 1st-4th Block, Jayanagar 4th Block, HSR Layout sector 1" },
  C: { label: "Zone C (Medium-High)", examples: "Whitefield, Marathahalli, BTM Layout, JP Nagar 1st-3rd Phase" },
  D: { label: "Zone D (Medium)", examples: "Bannerghatta, Hebbal, Yelahanka, Banashankari 3rd Stage" },
  E: { label: "Zone E (Low-Medium)", examples: "Rajajinagar, Vijayanagar, Mahadevapura, KR Puram" },
  F: { label: "Zone F (Low)", examples: "Bommanahalli, Kengeri, Hoodi, peripheral / outer-zone areas" },
};

export default function BbmpPropertyTaxCalculator() {
  const [zone, setZone] = useState<Zone>("C");
  const [occupancy, setOccupancy] = useState<Occupancy>("self");
  const [builtUpArea, setBuiltUpArea] = useState<string>("1200");
  const [age, setAge] = useState<string>("5");
  const [carParkArea, setCarParkArea] = useState<string>("100");
  const [earlyPayment, setEarlyPayment] = useState<boolean>(true);

  const result = useMemo(() => {
    const area = parseFloat(builtUpArea);
    const ageYears = parseFloat(age);
    const parking = parseFloat(carParkArea) || 0;

    if (isNaN(area) || area <= 0 || isNaN(ageYears) || ageYears < 0) {
      return null;
    }

    const uavMain = UAV_RATES[zone][occupancy];
    // Car parking is taxed at 50% of the applicable UAV rate
    const uavParking = uavMain * 0.5;

    // Step 1: Gross Unit Area Value
    const G_main = area * uavMain * 10;
    const G_parking = parking * uavParking * 10;
    const G = G_main + G_parking;

    // Step 2: Depreciation
    const depRate = getDepreciationRate(ageYears);
    const I = G * (depRate / 100);

    // Step 3: Net Annual Value
    const netValue = G - I;

    // Step 4: Property Tax
    const K = netValue * 0.20;
    const cess = K * 0.24;
    const totalTax = K + cess; // = K × 1.24

    // Step 5: 5% rebate for early payment
    const rebate = earlyPayment ? totalTax * 0.05 : 0;
    const finalPayable = totalTax - rebate;

    return {
      uavMain,
      uavParking,
      G_main,
      G_parking,
      G,
      depRate,
      I,
      netValue,
      K,
      cess,
      totalTax,
      rebate,
      finalPayable,
    };
  }, [zone, occupancy, builtUpArea, age, carParkArea, earlyPayment]);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <div className="space-y-6">
      <div className="inline-block bg-violet-100 text-violet-800 text-sm font-semibold px-4 py-1.5 rounded-full">
        🏘️ BBMP Property Tax · Bengaluru SAS · UAV Method
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="bbmp-zone"
            className="text-sm font-semibold text-gray-700 block mb-2"
          >
            BBMP Zone
          </label>
          <select
            id="bbmp-zone"
            value={zone}
            onChange={(e) => setZone(e.target.value as Zone)}
            className="calc-input"
          >
            {(Object.keys(UAV_RATES) as Zone[]).map((z) => (
              <option key={z} value={z}>
                {ZONE_INFO[z].label}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            {ZONE_INFO[zone].examples}
          </p>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">
            Property Type
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setOccupancy("self")}
              className={`flex-1 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                occupancy === "self"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              🏡 Self-Occupied
            </button>
            <button
              onClick={() => setOccupancy("tenanted")}
              className={`flex-1 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                occupancy === "tenanted"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              🏠 Tenanted
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label
            htmlFor="bbmp-area"
            className="text-sm font-semibold text-gray-700 block mb-2"
          >
            Built-up Area (sqft)
          </label>
          <input
            id="bbmp-area"
            type="number"
            value={builtUpArea}
            onChange={(e) => setBuiltUpArea(e.target.value)}
            className="calc-input"
            placeholder="1200"
          />
        </div>
        <div>
          <label
            htmlFor="bbmp-age"
            className="text-sm font-semibold text-gray-700 block mb-2"
          >
            Building Age (years)
          </label>
          <input
            id="bbmp-age"
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="calc-input"
            placeholder="5"
          />
        </div>
        <div>
          <label
            htmlFor="bbmp-park"
            className="text-sm font-semibold text-gray-700 block mb-2"
          >
            Car Parking (sqft)
          </label>
          <input
            id="bbmp-park"
            type="number"
            value={carParkArea}
            onChange={(e) => setCarParkArea(e.target.value)}
            className="calc-input"
            placeholder="100"
          />
          <p className="text-xs text-gray-500 mt-1">
            Taxed at 50% of main UAV
          </p>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={earlyPayment}
            onChange={(e) => setEarlyPayment(e.target.checked)}
            className="w-4 h-4"
          />
          <div className="text-sm text-amber-900">
            <strong>Pay full annual tax before 30 May</strong> for 5% rebate.
          </div>
        </label>
      </div>

      {result && (
        <div className="result-card space-y-4">
          <div className="bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl p-6 text-white">
            <div className="text-sm font-medium opacity-80 mb-1">
              Annual BBMP Property Tax Payable
            </div>
            <div className="text-4xl font-bold">
              {fmt(result.finalPayable)}
            </div>
            <div className="text-sm opacity-80 mt-2">
              Tax {fmt(result.K)} + 24% Cess {fmt(result.cess)}
              {result.rebate > 0 && (
                <span> − 5% rebate {fmt(result.rebate)}</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-xl p-3 text-center shadow-sm">
              <div className="text-[10px] font-medium text-gray-500 mb-1">
                UAV Rate
              </div>
              <div className="text-lg font-bold text-violet-600">
                ₹{result.uavMain}/sqft
              </div>
              <div className="text-[10px] text-gray-500 mt-1">monthly</div>
            </div>
            <div className="bg-white rounded-xl p-3 text-center shadow-sm">
              <div className="text-[10px] font-medium text-gray-500 mb-1">
                Gross Annual Value
              </div>
              <div className="text-lg font-bold text-blue-600">
                {fmt(result.G)}
              </div>
              <div className="text-[10px] text-gray-500 mt-1">G</div>
            </div>
            <div className="bg-white rounded-xl p-3 text-center shadow-sm">
              <div className="text-[10px] font-medium text-gray-500 mb-1">
                Depreciation
              </div>
              <div className="text-lg font-bold text-amber-600">
                {result.depRate}%
              </div>
              <div className="text-[10px] text-gray-500 mt-1">
                {fmt(result.I)}
              </div>
            </div>
            <div className="bg-white rounded-xl p-3 text-center shadow-sm">
              <div className="text-[10px] font-medium text-gray-500 mb-1">
                Net Value
              </div>
              <div className="text-lg font-bold text-emerald-600">
                {fmt(result.netValue)}
              </div>
              <div className="text-[10px] text-gray-500 mt-1">G − I</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-3 text-sm">
              📐 Step-by-step calculation
            </h3>
            <div className="space-y-2 text-xs text-gray-700">
              <div className="flex justify-between border-b pb-2">
                <span>Built-up area × UAV × 10 months</span>
                <span className="font-mono">
                  {parseFloat(builtUpArea)} × {result.uavMain} × 10 ={" "}
                  {fmt(result.G_main)}
                </span>
              </div>
              {result.G_parking > 0 && (
                <div className="flex justify-between border-b pb-2">
                  <span>+ Parking area × UAV/2 × 10 months</span>
                  <span className="font-mono">
                    {parseFloat(carParkArea)} × {result.uavParking} × 10 ={" "}
                    {fmt(result.G_parking)}
                  </span>
                </div>
              )}
              <div className="flex justify-between border-b pb-2">
                <span>Gross Annual Rateable Value (G)</span>
                <span className="font-bold">{fmt(result.G)}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span>− Depreciation @ {result.depRate}% (age {age} yrs)</span>
                <span>{fmt(result.I)}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span>Net Annual Value (G − I)</span>
                <span className="font-bold">{fmt(result.netValue)}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span>Property Tax (K = Net × 20%)</span>
                <span>{fmt(result.K)}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span>+ Health &amp; Education Cess (24% of K)</span>
                <span>{fmt(result.cess)}</span>
              </div>
              <div className="flex justify-between border-b pb-2 font-semibold">
                <span>Total before rebate</span>
                <span>{fmt(result.totalTax)}</span>
              </div>
              {result.rebate > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>− 5% early payment rebate</span>
                  <span>− {fmt(result.rebate)}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 text-base font-bold text-violet-700">
                <span>Final tax payable</span>
                <span>{fmt(result.finalPayable)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs text-gray-700 leading-relaxed space-y-2">
        <strong>BBMP UAV system explained:</strong>
        <ul className="list-disc list-inside ml-2 space-y-1">
          <li>
            Bengaluru is divided into 6 zones (A=premium, F=peripheral). UAV
            is the per-sqft per-month notional rental value set by BBMP per
            zone.
          </li>
          <li>
            Tenanted properties pay 2× the rate of self-occupied. Always
            declare correctly — wrong declarations attract penalty + interest.
          </li>
          <li>
            <strong>10 months</strong> (not 12) — BBMP allows 2 months for
            vacancy / repairs, baked into the formula.
          </li>
          <li>
            Depreciation increases by 3 percentage points every 3 years until
            60 years; jumps to 70% above 60 years.
          </li>
          <li>
            Car parking taxed at <strong>half</strong> the main UAV rate of
            the property.
          </li>
          <li>
            <strong>Cess:</strong> 24% Health & Education cess on the property
            tax (K).
          </li>
          <li>
            <strong>Rebate:</strong> 5% if full annual tax paid before 30 May.
            <strong> Penalty:</strong> 2% per month interest if delayed past
            FY end.
          </li>
        </ul>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-800 leading-relaxed">
        <span className="mr-1">ℹ️</span>
        <strong>Disclaimer:</strong> This calculator implements the BBMP UAV
        formula for residential properties. Commercial / industrial / vacant
        land have separate UAV tables and different rate structures. If you
        own multi-storey buildings with mixed self-occupied and tenanted
        portions, calculate each portion separately and add. Always verify
        your zone classification on the official portal before payment.
        Reference:{" "}
        <a
          href="https://bbmptax.karnataka.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="underline font-semibold text-blue-700 hover:text-blue-900"
        >
          bbmptax.karnataka.gov.in
        </a>
        .
      </div>
    </div>
  );
}
