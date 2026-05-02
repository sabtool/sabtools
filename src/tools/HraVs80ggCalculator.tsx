"use client";
import { useState, useMemo } from "react";

/**
 * HRA (Sec 10(13A)) vs Section 80GG Comparator
 *
 * If you live in rented accommodation in India, you can claim tax exemption
 * via ONE of these two routes (mutually exclusive):
 *
 * SECTION 10(13A) — for SALARIED employees who RECEIVE HRA from employer.
 *
 *   HRA Exemption = MIN of:
 *     1. Actual HRA received
 *     2. 50% of basic salary (metro: Mumbai/Delhi/Kolkata/Chennai)
 *        OR 40% of basic salary (non-metro)
 *     3. Actual rent paid − 10% of basic salary
 *
 *   "Salary" for HRA = Basic + DA (forming part of retirement benefits)
 *   Bangalore, Hyderabad, Pune, Ahmedabad get 40% (NOT classified as metro
 *   under Income Tax for HRA purposes — only the 4 cities above).
 *
 * SECTION 80GG — for those NOT receiving HRA (self-employed, OR salaried
 * without HRA component in CTC).
 *
 *   80GG Deduction = MIN of:
 *     1. ₹5,000 per month (₹60,000 per year)
 *     2. 25% of TOTAL INCOME (after all other deductions but before 80GG)
 *     3. Actual rent paid − 10% of total income
 *
 * KEY CONDITIONS:
 *   - You / spouse / minor child / HUF (where you're a member) must NOT own
 *     a residential property in the city of your work
 *   - You don't own a "self-occupied" house anywhere (other rented property
 *     OK if not in same city as rent paid)
 *   - File Form 10BA before filing ITR if claiming 80GG
 *   - Both routes are NEW REGIME EXCLUDED — only available under OLD regime
 *
 * Sources:
 *  - Income Tax Act, Section 10(13A) and Section 80GG
 *  - https://cleartax.in/s/hra-house-rent-allowance
 *  - https://www.bankbazaar.com/tax/house-rent-allowance.html
 *  - https://www.taxbuddy.com/blog/is-hra-taxable-under-the-new-tax-regime
 */

const METRO_CITIES = [
  "Mumbai",
  "Delhi",
  "Kolkata",
  "Chennai",
];

export default function HraVs80ggCalculator() {
  const [annualBasicDA, setAnnualBasicDA] = useState<number>(600_000);
  const [annualHra, setAnnualHra] = useState<number>(240_000);
  const [annualRent, setAnnualRent] = useState<number>(360_000);
  const [city, setCity] = useState<string>("Mumbai");
  const [hasHra, setHasHra] = useState<boolean>(true);
  const [annualTotalIncome, setAnnualTotalIncome] = useState<number>(1_200_000);

  const isMetro = METRO_CITIES.includes(city);

  const result = useMemo(() => {
    if (annualBasicDA < 0 || annualRent < 0) return null;

    // ====== HRA Calculation (Section 10(13A)) ======
    const cityPctSalary = (isMetro ? 0.5 : 0.4) * annualBasicDA;
    const rentMinus10pct = Math.max(0, annualRent - 0.1 * annualBasicDA);
    const hraExemption = hasHra
      ? Math.min(annualHra, cityPctSalary, rentMinus10pct)
      : 0;

    // ====== 80GG Calculation ======
    // Total Income (before 80GG) — proxy with provided value
    const cap60k = 60_000;
    const cap25pctIncome = 0.25 * annualTotalIncome;
    const rent80GG = Math.max(0, annualRent - 0.1 * annualTotalIncome);
    const eightyGgDeduction = !hasHra
      ? Math.min(cap60k, cap25pctIncome, rent80GG)
      : 0;

    // Determine which is applicable
    const applicable: "hra" | "80gg" | "both-disabled" = hasHra
      ? "hra"
      : "80gg";
    const exemptionAmount =
      applicable === "hra" ? hraExemption : eightyGgDeduction;

    // Tax saved (approx 30% slab)
    const taxSaved30 = exemptionAmount * 0.30;
    const taxSaved20 = exemptionAmount * 0.20;

    return {
      hraExemption,
      eightyGgDeduction,
      cityPctSalary,
      rentMinus10pct,
      cap60k,
      cap25pctIncome,
      rent80GG,
      applicable,
      exemptionAmount,
      taxSaved30,
      taxSaved20,
      isMetro,
    };
  }, [annualBasicDA, annualHra, annualRent, city, hasHra, annualTotalIncome, isMetro]);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <div className="space-y-6">
      <div className="inline-block bg-purple-100 text-purple-800 text-sm font-semibold px-4 py-1.5 rounded-full">
        🏠 HRA (Sec 10(13A)) vs Section 80GG · Old Regime Only
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900">
        <strong>⚠ Old regime only:</strong> Both HRA exemption (Sec 10(13A))
        and 80GG deduction are unavailable under the New Tax Regime. Use this
        only if you opt for Old Regime.
      </div>

      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">
          Do you receive HRA from employer?
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => setHasHra(true)}
            className={`flex-1 px-3 py-3 rounded-xl text-xs font-semibold transition ${
              hasHra
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            <div className="font-bold">Yes — Salaried with HRA</div>
            <div className="text-[10px] opacity-80 mt-1">
              Use Section 10(13A) exemption
            </div>
          </button>
          <button
            onClick={() => setHasHra(false)}
            className={`flex-1 px-3 py-3 rounded-xl text-xs font-semibold transition ${
              !hasHra
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            <div className="font-bold">No — Self-employed or no HRA</div>
            <div className="text-[10px] opacity-80 mt-1">
              Use Section 80GG deduction
            </div>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {hasHra && (
          <>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-2">
                Annual Basic Salary + DA (₹)
              </label>
              <input
                type="number"
                value={annualBasicDA}
                onChange={(e) => setAnnualBasicDA(+e.target.value || 0)}
                className="calc-input"
              />
              <p className="text-xs text-gray-500 mt-1">
                Basic + Dearness Allowance forming retirement benefits
              </p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-2">
                Annual HRA Received (₹)
              </label>
              <input
                type="number"
                value={annualHra}
                onChange={(e) => setAnnualHra(+e.target.value || 0)}
                className="calc-input"
              />
            </div>
          </>
        )}
        {!hasHra && (
          <div className="sm:col-span-2">
            <label className="text-sm font-semibold text-gray-700 block mb-2">
              Annual Total Income (after other deductions)
            </label>
            <input
              type="number"
              value={annualTotalIncome}
              onChange={(e) => setAnnualTotalIncome(+e.target.value || 0)}
              className="calc-input"
            />
            <p className="text-xs text-gray-500 mt-1">
              Used for the 25%-of-income and 10% rent cap calculations
            </p>
          </div>
        )}
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">
            Annual Rent Paid (₹)
          </label>
          <input
            type="number"
            value={annualRent}
            onChange={(e) => setAnnualRent(+e.target.value || 0)}
            className="calc-input"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">
            City of Residence
          </label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="calc-input"
          >
            <optgroup label="Metro (50% of salary)">
              {METRO_CITIES.map((c) => (
                <option key={c} value={c}>
                  {c} (Metro)
                </option>
              ))}
            </optgroup>
            <optgroup label="Non-Metro (40% of salary)">
              <option value="Bangalore">Bangalore</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Pune">Pune</option>
              <option value="Ahmedabad">Ahmedabad</option>
              <option value="Other">Other Non-Metro</option>
            </optgroup>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Income Tax Rules classify only Mumbai/Delhi/Kolkata/Chennai as
            &quot;Metro&quot; for HRA purposes.
          </p>
        </div>
      </div>

      {result && (
        <div className="result-card space-y-4">
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-6 text-white">
            <div className="text-sm font-medium opacity-80 mb-1">
              {result.applicable === "hra"
                ? "HRA Exemption (Sec 10(13A))"
                : "80GG Deduction"}{" "}
              You Can Claim
            </div>
            <div className="text-4xl font-bold">
              {fmt(result.exemptionAmount)}
            </div>
            <div className="text-sm opacity-80 mt-2">
              Estimated tax saved: {fmt(result.taxSaved20)} (20% slab) /{" "}
              {fmt(result.taxSaved30)} (30% slab)
            </div>
          </div>

          {hasHra ? (
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-3 text-sm">
                📐 HRA Exemption — minimum of these three
              </h3>
              <div className="space-y-2 text-xs text-gray-700">
                <div className="flex justify-between border-b pb-2">
                  <span>1. Actual HRA received</span>
                  <span className="font-mono font-semibold">
                    {fmt(annualHra)}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span>
                    2. {result.isMetro ? "50%" : "40%"} of Basic+DA (
                    {result.isMetro ? "metro" : "non-metro"})
                  </span>
                  <span className="font-mono font-semibold">
                    {fmt(result.cityPctSalary)}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span>3. Annual rent − 10% of Basic+DA</span>
                  <span className="font-mono font-semibold">
                    {fmt(result.rentMinus10pct)}
                  </span>
                </div>
                <div className="flex justify-between pt-2 text-base font-bold text-purple-700">
                  <span>HRA Exemption (lowest of above)</span>
                  <span>{fmt(result.hraExemption)}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-3 text-sm">
                📐 80GG Deduction — minimum of these three
              </h3>
              <div className="space-y-2 text-xs text-gray-700">
                <div className="flex justify-between border-b pb-2">
                  <span>1. ₹5,000 per month (₹60,000 per year)</span>
                  <span className="font-mono font-semibold">
                    {fmt(result.cap60k)}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span>2. 25% of total income</span>
                  <span className="font-mono font-semibold">
                    {fmt(result.cap25pctIncome)}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span>3. Annual rent − 10% of total income</span>
                  <span className="font-mono font-semibold">
                    {fmt(result.rent80GG)}
                  </span>
                </div>
                <div className="flex justify-between pt-2 text-base font-bold text-pink-700">
                  <span>80GG Deduction (lowest of above)</span>
                  <span>{fmt(result.eightyGgDeduction)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs text-gray-700 leading-relaxed space-y-2">
        <strong>HRA vs 80GG comparison:</strong>
        <table className="w-full mt-2">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">Criterion</th>
              <th className="p-2">Sec 10(13A) - HRA</th>
              <th className="p-2">Sec 80GG</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="p-2 font-semibold">Eligibility</td>
              <td className="p-2">Salaried with HRA in CTC</td>
              <td className="p-2">Self-employed or salaried without HRA</td>
            </tr>
            <tr className="border-t">
              <td className="p-2 font-semibold">Max benefit</td>
              <td className="p-2">No upper cap</td>
              <td className="p-2">₹60,000 per year</td>
            </tr>
            <tr className="border-t">
              <td className="p-2 font-semibold">Form to file</td>
              <td className="p-2">Submit rent receipts to employer</td>
              <td className="p-2">Form 10BA before ITR</td>
            </tr>
            <tr className="border-t">
              <td className="p-2 font-semibold">Property ownership</td>
              <td className="p-2">No restriction</td>
              <td className="p-2">No self-occupied house in same city</td>
            </tr>
            <tr className="border-t">
              <td className="p-2 font-semibold">New Regime</td>
              <td className="p-2 text-rose-700">Not available</td>
              <td className="p-2 text-rose-700">Not available</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-800 leading-relaxed">
        <span className="mr-1">ℹ️</span>
        <strong>Documentation tips:</strong> Keep rent agreement on stamp paper
        + monthly rent receipts (with revenue stamp if rent ≥ ₹5K/mo) +
        landlord PAN (mandatory if annual rent &gt; ₹1L). For rent above ₹50K
        per month, deduct TDS @ 2% under Section 194IB. Reference:{" "}
        <a
          href="https://www.incometax.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="underline font-semibold text-blue-700 hover:text-blue-900"
        >
          incometax.gov.in
        </a>
        .
      </div>
    </div>
  );
}
