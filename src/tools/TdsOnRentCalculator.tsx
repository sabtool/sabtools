"use client";
import { useState, useMemo } from "react";

/**
 * TDS on Rent Calculator (Section 194IB)
 *
 * Section 194IB of the Income Tax Act applies to INDIVIDUALS / HUFs
 * (not subject to tax audit under Section 44AB) who pay rent exceeding
 * ₹50,000 per month for any LAND or BUILDING (residential or commercial).
 *
 * VERIFIED RULES (as on FY 2025-26):
 *
 *  - Threshold: ₹50,000 per month (or part of a month). Rent ≤ ₹50K/month
 *    → no TDS required.
 *  - Rate (from 1 Oct 2024): 2% on the GROSS RENT for the entire FY (or
 *    tenancy period) — NOT 2% per month.
 *  - Rate before 1 Oct 2024: 5% (applicable for tenancies that started or
 *    ended before that date).
 *  - If landlord does NOT have a PAN: rate jumps to 20% (Section 206AA).
 *  - TDS is deducted ONCE per FY: in March (or in the last month of the
 *    tenancy if vacating earlier). NOT every month.
 *  - Cap: TDS amount cannot exceed the rent of the LAST MONTH of the
 *    tenancy. If 2% × annual rent > one month's rent, TDS = one month's rent.
 *  - Tenant does NOT need a TAN (special concession for individuals/HUFs).
 *  - Tenant files Form 26QC with the TDS payment, then issues Form 16C to
 *    the landlord within 15 days.
 *
 * Section 194I (different — for businesses with rent > ₹2.4L per FY):
 *  - 10% on rent of land/building (or furniture & fittings)
 *  - 2% on rent of plant & machinery
 *  - Threshold ₹2,40,000 per FY
 *  - Applies only to entities subject to tax audit
 *  - Requires TAN
 *
 * This tool covers Section 194IB (the rule that affects individuals).
 *
 * Sources:
 *  - https://www.incometax.gov.in
 *  - Tax2win: section-194ib-tds-on-rent-of-property
 *  - ClearTax: tds-rate-chart
 *  - Effective 2% rate confirmed by Finance Act amendment Oct 2024.
 */

export default function TdsOnRentCalculator() {
  const [monthlyRent, setMonthlyRent] = useState<string>("60000");
  const [tenancyMonths, setTenancyMonths] = useState<string>("12");
  const [landlordHasPan, setLandlordHasPan] = useState<boolean>(true);
  const [tenancyStart, setTenancyStart] = useState<string>(
    "after-oct-2024"
  );

  const result = useMemo(() => {
    const rent = parseFloat(monthlyRent);
    const months = parseFloat(tenancyMonths);
    if (isNaN(rent) || rent <= 0 || isNaN(months) || months <= 0) return null;

    const totalRent = rent * months;

    // Threshold check: rent must EXCEED ₹50K per month for 194IB to apply
    if (rent <= 50_000) {
      return {
        tdsApplicable: false as const,
        reason: "Monthly rent is ₹50,000 or less — no TDS required under Section 194IB.",
        totalRent,
      };
    }

    // Determine applicable rate
    let rate: number;
    let rateExplanation: string;
    if (!landlordHasPan) {
      rate = 0.20;
      rateExplanation = "20% (Section 206AA — landlord has no PAN)";
    } else if (tenancyStart === "before-oct-2024") {
      rate = 0.05;
      rateExplanation =
        "5% (tenancy started before 1 Oct 2024 — old rate applies)";
    } else {
      rate = 0.02;
      rateExplanation = "2% (effective 1 Oct 2024 onwards)";
    }

    const tdsRaw = totalRent * rate;
    // Statutory cap: TDS cannot exceed 1 month's rent
    const cap = rent;
    const tdsCapped = Math.min(tdsRaw, cap);
    const wasCapped = tdsRaw > cap;

    const netToLandlord = totalRent - tdsCapped;

    return {
      tdsApplicable: true as const,
      totalRent,
      rate,
      rateExplanation,
      tdsRaw,
      tdsCapped,
      wasCapped,
      cap,
      netToLandlord,
      months,
    };
  }, [monthlyRent, tenancyMonths, landlordHasPan, tenancyStart]);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <div className="space-y-6">
      <div className="inline-block bg-rose-100 text-rose-800 text-sm font-semibold px-4 py-1.5 rounded-full">
        🏠 Section 194IB · TDS on Rent (Individuals & HUFs)
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="tdsr-rent"
            className="text-sm font-semibold text-gray-700 block mb-2"
          >
            Monthly Rent (₹)
          </label>
          <input
            id="tdsr-rent"
            type="number"
            value={monthlyRent}
            onChange={(e) => setMonthlyRent(e.target.value)}
            className="calc-input"
            placeholder="e.g. 60000"
          />
        </div>
        <div>
          <label
            htmlFor="tdsr-months"
            className="text-sm font-semibold text-gray-700 block mb-2"
          >
            Tenancy Duration (months)
          </label>
          <input
            id="tdsr-months"
            type="number"
            value={tenancyMonths}
            onChange={(e) => setTenancyMonths(e.target.value)}
            className="calc-input"
            placeholder="e.g. 12"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">
          Tenancy Start Date
        </label>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setTenancyStart("after-oct-2024")}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition ${
              tenancyStart === "after-oct-2024"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            On/After 1 Oct 2024 (2% rate)
          </button>
          <button
            onClick={() => setTenancyStart("before-oct-2024")}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition ${
              tenancyStart === "before-oct-2024"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            Before 1 Oct 2024 (5% rate)
          </button>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={!landlordHasPan}
            onChange={(e) => setLandlordHasPan(!e.target.checked)}
            className="mt-1 w-4 h-4"
          />
          <div className="flex-1">
            <div className="font-semibold text-amber-900 text-sm">
              Landlord has NOT provided PAN
            </div>
            <p className="text-xs text-amber-800 mt-0.5">
              Under Section 206AA, if the landlord doesn&apos;t furnish PAN,
              TDS rate jumps to <strong>20%</strong> regardless of the
              date-based rate.
            </p>
          </div>
        </label>
      </div>

      {result && (
        <div className="result-card space-y-4">
          {!result.tdsApplicable ? (
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 text-white">
              <div className="text-sm font-medium opacity-80 mb-1">
                ✓ No TDS Required
              </div>
              <div className="text-2xl font-bold">{result.reason}</div>
              <div className="text-sm opacity-80 mt-2">
                Total annual rent: {fmt(result.totalRent)}
              </div>
            </div>
          ) : (
            <>
              <div className="bg-gradient-to-r from-rose-500 to-pink-600 rounded-2xl p-6 text-white">
                <div className="text-sm font-medium opacity-80 mb-1">
                  TDS to be deducted (once a year, in March)
                </div>
                <div className="text-4xl font-bold">
                  {fmt(result.tdsCapped)}
                </div>
                <div className="text-sm opacity-80 mt-2">
                  at {(result.rate * 100).toFixed(0)}% on{" "}
                  {fmt(result.totalRent)} ({result.months} months)
                  {result.wasCapped && (
                    <span className="block text-xs italic mt-1">
                      ⚠ Capped at one month&apos;s rent ({fmt(result.cap)}) —
                      raw 2% would have been {fmt(result.tdsRaw)}.
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                  <div className="text-xs font-medium text-gray-500 mb-1">
                    Total Annual Rent
                  </div>
                  <div className="text-xl font-bold text-blue-600">
                    {fmt(result.totalRent)}
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                  <div className="text-xs font-medium text-gray-500 mb-1">
                    TDS Rate
                  </div>
                  <div className="text-xl font-bold text-rose-600">
                    {(result.rate * 100).toFixed(0)}%
                  </div>
                  <div className="text-[10px] text-gray-500 mt-1">
                    {result.rateExplanation}
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                  <div className="text-xs font-medium text-gray-500 mb-1">
                    Net to Landlord
                  </div>
                  <div className="text-xl font-bold text-emerald-600">
                    {fmt(result.netToLandlord)}
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 text-xs text-blue-900 leading-relaxed">
                <div className="font-bold mb-2">📋 Compliance checklist:</div>
                <ol className="list-decimal list-inside space-y-1">
                  <li>
                    Deduct {fmt(result.tdsCapped)} from the LAST month&apos;s
                    rent payment (or in March of the FY).
                  </li>
                  <li>
                    Deposit TDS via{" "}
                    <strong>Form 26QC</strong> on the income-tax portal within
                    30 days of deduction.
                  </li>
                  <li>
                    Issue <strong>Form 16C</strong> to the landlord within 15
                    days of Form 26QC filing.
                  </li>
                  <li>
                    No TAN needed — use your own PAN as the deductor.
                  </li>
                </ol>
              </div>
            </>
          )}
        </div>
      )}

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs text-gray-700 leading-relaxed space-y-2">
        <strong>Section 194IB rules at a glance:</strong>
        <ul className="list-disc list-inside ml-2 space-y-1">
          <li>
            Applies to <strong>individuals/HUFs</strong> NOT subject to tax
            audit under Sec 44AB. (Companies/firms use Section 194I instead.)
          </li>
          <li>
            <strong>Threshold:</strong> rent must EXCEED ₹50,000 per month.
            ₹50K or less → no TDS.
          </li>
          <li>
            <strong>Rate:</strong> 2% (from 1 Oct 2024) or 5% (before).
            Without PAN: 20%.
          </li>
          <li>
            <strong>Frequency:</strong> deduct ONCE per FY (March or last
            month of tenancy). NOT every month.
          </li>
          <li>
            <strong>Cap:</strong> TDS ≤ one month&apos;s rent. Statutory
            safety valve so 2% × 12 months can never exceed one month&apos;s
            rent.
          </li>
          <li>
            <strong>No TAN required</strong> — quote your own PAN. File Form
            26QC, issue Form 16C.
          </li>
        </ul>
      </div>

      <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-xs text-rose-800 leading-relaxed">
        <span className="mr-1">⚠️</span>
        <strong>Why this matters:</strong> Failing to deduct TDS attracts
        interest @ 1% per month (Sec 201), late-filing fee @ ₹200/day (Sec
        234E), and penalty up to the TDS amount (Sec 271H). Most tenants
        paying high rent (Bangalore, Mumbai, Delhi) miss this and face
        notices later. Reference:{" "}
        <a
          href="https://www.incometax.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="underline font-semibold text-rose-700 hover:text-rose-900"
        >
          incometax.gov.in
        </a>
        .
      </div>
    </div>
  );
}
