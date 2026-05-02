"use client";
import { useState, useMemo } from "react";

/**
 * Professional Tax Calculator (India · State-Wise)
 *
 * Professional tax (P-tax) is levied by STATE governments under Article 276
 * of the Constitution. The MAXIMUM annual P-tax that any state can levy is
 * capped at ₹2,500 (constitutional cap).
 *
 * VERIFIED RULES (FY 2025-26):
 *
 *  - Levied on salaried employees and professionals
 *  - DEDUCTED by employer from salary; deposited to state treasury monthly
 *    (or as per state schedule)
 *  - Not all states impose P-tax (e.g. Delhi, Haryana, UP, Rajasthan,
 *    Uttarakhand, Himachal, J&K do NOT levy P-tax)
 *  - Deductible from gross salary for IT calculation under Section 16(iii)
 *  - Many states give exemption to women, senior citizens, persons with
 *    disabilities, etc.
 *
 * STATE-WISE SLABS (verified across Saral.pro, BankBazaar, ZohoPayroll,
 * Motilal Oswal, AdityaBirlaCapital P-tax compilations for FY 2025-26):
 *
 *  Maharashtra: Nil ≤₹7,500/mo; ₹175 ₹7,501-10K; ₹200 (₹300 Feb) >₹10K
 *               Women: Nil ≤₹25K
 *  Karnataka : Nil <₹25K/mo; ₹200 (₹300 Feb) ≥₹25K
 *  West Bengal: Nil ≤₹10K/mo; ₹110 to ₹40K; ₹130 to ₹25K; ₹150 to ₹40K;
 *               ₹200 above ₹40K (rough monthly equiv)
 *  Gujarat   : Nil ≤₹12K/mo; ₹200 above ₹12K
 *  AP/Telangana: Nil ≤₹15K/mo; ₹150 to ₹20K; ₹200 above
 *  Tamil Nadu (half-yearly basis Aug & Jan):
 *               21K-30K: ₹135 / 6mo; 30K-45K: ₹315; 45K-60K: ₹690;
 *               60K-75K: ₹1025; >75K: ₹1250
 *  Kerala (half-yearly): up to ₹11999/6mo: Nil; ₹120-1250 progressive
 *  Punjab    : Flat ₹200/mo for those earning ≥ ₹250,000/year
 *  Madhya Pradesh: Nil ≤₹2.25L/yr; ₹1500/yr 2.25-3L; ₹2000/yr 3-4L;
 *                  ₹2500/yr above ₹4L
 *  Odisha    : Nil ≤₹1.6L/yr; ₹1500/yr 1.6-3L; ₹2400/yr above ₹3L
 *  Bihar     : Nil ≤₹3L/yr; ₹1000/yr 3-5L; ₹2000/yr 5-10L; ₹2500/yr above
 *  Jharkhand : Nil ≤₹3L/yr; ₹1200/yr 3-5L; ₹1800/yr 5-8L; ₹2100/yr 8-10L;
 *              ₹2500/yr above ₹10L
 *  Assam     : Nil ≤₹15K/mo; ₹180 to ₹25K; ₹208 above
 *  Tripura   : Nil ≤₹7.5K/mo; ₹150 to ₹15K; ₹208 above
 *  Meghalaya : Nil ≤₹50K/yr; ₹200/mo 50-75K; ₹300 75K-1L (progressive to ₹2500/yr)
 *
 *  States with NO P-tax: Delhi, Haryana, UP, Rajasthan, Uttarakhand, J&K,
 *  Himachal Pradesh, Goa, Arunachal Pradesh, Mizoram, Lakshadweep, A&N
 *  Islands, Chandigarh, Dadra & Nagar Haveli, Daman & Diu, Puducherry
 *
 * Sources:
 *  - https://saral.pro/blogs/professional-tax-slab-rates-in-different-states/
 *  - https://www.bankbazaar.com (state-wise)
 *  - https://www.zoho.com/in/payroll/academy/taxes-and-compliance/professional-tax-rules.html
 *  - State government commercial-tax department websites
 */

type SlabBasis = "monthly" | "annual";

type StateRule = {
  name: string;
  imposes: boolean;
  basis?: SlabBasis;
  // Monthly slabs: salary upper bound (₹/mo), monthly P-tax amount
  // Annual slabs: salary upper bound (₹/yr), annual P-tax amount
  slabs?: { upto: number; amount: number; februaryAmount?: number }[];
  womenExempt?: number; // monthly salary up to which women are exempt
  notes?: string;
};

const STATES: Record<string, StateRule> = {
  Maharashtra: {
    name: "Maharashtra",
    imposes: true,
    basis: "monthly",
    slabs: [
      { upto: 7_500, amount: 0 },
      { upto: 10_000, amount: 175 },
      { upto: Infinity, amount: 200, februaryAmount: 300 },
    ],
    womenExempt: 25_000,
    notes: "Women earning ≤₹25,000/mo are fully exempt. February deduction is ₹300 (instead of ₹200) to make annual ₹2,500.",
  },
  Karnataka: {
    name: "Karnataka",
    imposes: true,
    basis: "monthly",
    slabs: [
      { upto: 24_999, amount: 0 },
      { upto: Infinity, amount: 200, februaryAmount: 300 },
    ],
    notes: "Slabs revised w.e.f. 1 April 2025. Threshold raised from ₹15K to ₹25K.",
  },
  "West Bengal": {
    name: "West Bengal",
    imposes: true,
    basis: "monthly",
    slabs: [
      { upto: 10_000, amount: 0 },
      { upto: 15_000, amount: 110 },
      { upto: 25_000, amount: 130 },
      { upto: 40_000, amount: 150 },
      { upto: Infinity, amount: 200 },
    ],
  },
  Gujarat: {
    name: "Gujarat",
    imposes: true,
    basis: "monthly",
    slabs: [
      { upto: 12_000, amount: 0 },
      { upto: Infinity, amount: 200 },
    ],
  },
  "Andhra Pradesh": {
    name: "Andhra Pradesh",
    imposes: true,
    basis: "monthly",
    slabs: [
      { upto: 15_000, amount: 0 },
      { upto: 20_000, amount: 150 },
      { upto: Infinity, amount: 200 },
    ],
  },
  Telangana: {
    name: "Telangana",
    imposes: true,
    basis: "monthly",
    slabs: [
      { upto: 15_000, amount: 0 },
      { upto: 20_000, amount: 150 },
      { upto: Infinity, amount: 200 },
    ],
  },
  Punjab: {
    name: "Punjab",
    imposes: true,
    basis: "annual",
    slabs: [
      { upto: 250_000, amount: 0 },
      { upto: Infinity, amount: 2400 },
    ],
    notes: "Punjab levies ₹200/month flat for those earning ≥ ₹2.5L per year.",
  },
  "Madhya Pradesh": {
    name: "Madhya Pradesh",
    imposes: true,
    basis: "annual",
    slabs: [
      { upto: 225_000, amount: 0 },
      { upto: 300_000, amount: 1500 },
      { upto: 400_000, amount: 2000 },
      { upto: Infinity, amount: 2500 },
    ],
    notes: "Slab bands and tax expressed in annual terms.",
  },
  Odisha: {
    name: "Odisha",
    imposes: true,
    basis: "annual",
    slabs: [
      { upto: 160_000, amount: 0 },
      { upto: 300_000, amount: 1500 },
      { upto: Infinity, amount: 2400 },
    ],
  },
  Bihar: {
    name: "Bihar",
    imposes: true,
    basis: "annual",
    slabs: [
      { upto: 300_000, amount: 0 },
      { upto: 500_000, amount: 1000 },
      { upto: 1_000_000, amount: 2000 },
      { upto: Infinity, amount: 2500 },
    ],
  },
  Jharkhand: {
    name: "Jharkhand",
    imposes: true,
    basis: "annual",
    slabs: [
      { upto: 300_000, amount: 0 },
      { upto: 500_000, amount: 1200 },
      { upto: 800_000, amount: 1800 },
      { upto: 1_000_000, amount: 2100 },
      { upto: Infinity, amount: 2500 },
    ],
  },
  Assam: {
    name: "Assam",
    imposes: true,
    basis: "monthly",
    slabs: [
      { upto: 15_000, amount: 0 },
      { upto: 25_000, amount: 180 },
      { upto: Infinity, amount: 208 },
    ],
  },
  "Tamil Nadu": {
    name: "Tamil Nadu",
    imposes: true,
    basis: "monthly",
    slabs: [
      { upto: 3_500, amount: 0 },
      { upto: 5_000, amount: 22.5 },  // ₹135 / 6mo
      { upto: 7_500, amount: 52.5 },  // ₹315 / 6mo
      { upto: 10_000, amount: 115 },  // ₹690 / 6mo
      { upto: 12_500, amount: 170.83 },// ₹1025 / 6mo
      { upto: Infinity, amount: 208.33 },// ₹1250 / 6mo
    ],
    notes: "TN actually deducts half-yearly (Aug & Jan). Shown here as monthly equivalent for comparison.",
  },
  Delhi: { name: "Delhi", imposes: false, notes: "Delhi does NOT levy professional tax." },
  Haryana: { name: "Haryana", imposes: false, notes: "Haryana does NOT levy professional tax." },
  "Uttar Pradesh": { name: "Uttar Pradesh", imposes: false, notes: "UP does NOT levy professional tax." },
  Rajasthan: { name: "Rajasthan", imposes: false, notes: "Rajasthan does NOT levy professional tax." },
  Uttarakhand: { name: "Uttarakhand", imposes: false, notes: "Uttarakhand does NOT levy professional tax." },
  "Himachal Pradesh": {
    name: "Himachal Pradesh",
    imposes: false,
    notes: "Himachal Pradesh does NOT levy professional tax.",
  },
  Goa: { name: "Goa", imposes: false, notes: "Goa does NOT levy professional tax." },
  Chandigarh: {
    name: "Chandigarh (UT)",
    imposes: false,
    notes: "Chandigarh does NOT levy professional tax.",
  },
};

export default function ProfessionalTaxCalculator() {
  const [stateKey, setStateKey] = useState<string>("Maharashtra");
  const [monthlySalary, setMonthlySalary] = useState<string>("50000");
  const [isWoman, setIsWoman] = useState<boolean>(false);

  const result = useMemo(() => {
    const salary = parseFloat(monthlySalary);
    if (isNaN(salary) || salary <= 0) return null;

    const rule = STATES[stateKey];
    if (!rule) return null;

    if (!rule.imposes) {
      return {
        imposes: false as const,
        rule,
        annualPtax: 0,
        monthlyPtax: 0,
      };
    }

    // Women exemption (e.g. Maharashtra)
    if (isWoman && rule.womenExempt && salary <= rule.womenExempt) {
      return {
        imposes: true as const,
        rule,
        monthlyPtax: 0,
        annualPtax: 0,
        februaryPtax: 0,
        exempt: true,
        slab: null as null | { upto: number; amount: number; februaryAmount?: number },
      };
    }

    const slabs = rule.slabs!;
    const isMonthlyBasis = rule.basis === "monthly";
    // Compare salary to slab boundaries
    const compareValue = isMonthlyBasis ? salary : salary * 12;
    const slab = slabs.find((s) => compareValue <= s.upto)!;

    let monthlyPtax: number;
    let februaryPtax: number;
    let annualPtax: number;

    if (isMonthlyBasis) {
      monthlyPtax = slab.amount;
      februaryPtax = slab.februaryAmount ?? slab.amount;
      annualPtax = monthlyPtax * 11 + februaryPtax;
    } else {
      // annual basis
      annualPtax = slab.amount;
      monthlyPtax = Math.round(annualPtax / 12);
      februaryPtax = monthlyPtax;
    }

    return {
      imposes: true as const,
      rule,
      monthlyPtax,
      februaryPtax,
      annualPtax,
      slab,
      exempt: false,
    };
  }, [stateKey, monthlySalary, isWoman]);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <div className="space-y-6">
      <div className="inline-block bg-teal-100 text-teal-800 text-sm font-semibold px-4 py-1.5 rounded-full">
        💼 Professional Tax · State-Wise · FY 2025-26
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">
            State
          </label>
          <select
            value={stateKey}
            onChange={(e) => setStateKey(e.target.value)}
            className="calc-input"
          >
            <optgroup label="States that impose P-tax">
              {Object.entries(STATES)
                .filter(([, v]) => v.imposes)
                .map(([k, v]) => (
                  <option key={k} value={k}>
                    {v.name}
                  </option>
                ))}
            </optgroup>
            <optgroup label="States that DO NOT impose P-tax">
              {Object.entries(STATES)
                .filter(([, v]) => !v.imposes)
                .map(([k, v]) => (
                  <option key={k} value={k}>
                    {v.name}
                  </option>
                ))}
            </optgroup>
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">
            Monthly Salary (₹)
          </label>
          <input
            type="number"
            value={monthlySalary}
            onChange={(e) => setMonthlySalary(e.target.value)}
            className="calc-input"
            placeholder="50000"
          />
        </div>
      </div>

      {result?.rule.womenExempt && (
        <div className="bg-pink-50 border border-pink-200 rounded-xl p-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isWoman}
              onChange={(e) => setIsWoman(e.target.checked)}
              className="w-4 h-4"
            />
            <div className="text-sm text-pink-900">
              <strong>I am a woman</strong> — applicable for{" "}
              {result.rule.name}&apos;s female-employee exemption (up to ₹
              {result.rule.womenExempt.toLocaleString("en-IN")}/mo).
            </div>
          </label>
        </div>
      )}

      {result && !result.imposes && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-center">
          <div className="text-2xl font-bold text-emerald-700">
            ✓ No Professional Tax
          </div>
          <p className="text-sm text-emerald-800 mt-2">
            {result.rule.notes}
          </p>
        </div>
      )}

      {result && result.imposes && (
        <div className="result-card space-y-4">
          <div className="bg-gradient-to-r from-teal-500 to-cyan-600 rounded-2xl p-6 text-white">
            <div className="text-sm font-medium opacity-80 mb-1">
              {result.exempt
                ? "Exempt from Professional Tax"
                : "Annual Professional Tax in"}{" "}
              {result.rule.name}
            </div>
            <div className="text-4xl font-bold">{fmt(result.annualPtax)}</div>
            {!result.exempt && (
              <div className="text-sm opacity-80 mt-2">
                {fmt(result.monthlyPtax)}/month
                {result.februaryPtax !== result.monthlyPtax &&
                  ` (${fmt(result.februaryPtax)} in February)`}
              </div>
            )}
          </div>

          {!result.exempt && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <div className="text-xs font-medium text-gray-500 mb-1">
                  Monthly Deduction
                </div>
                <div className="text-xl font-bold text-teal-600">
                  {fmt(result.monthlyPtax)}
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <div className="text-xs font-medium text-gray-500 mb-1">
                  February Deduction
                </div>
                <div className="text-xl font-bold text-blue-600">
                  {fmt(result.februaryPtax)}
                </div>
                {result.februaryPtax !== result.monthlyPtax && (
                  <div className="text-[10px] text-gray-500 mt-1">
                    Top-up to make annual ₹2,500
                  </div>
                )}
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <div className="text-xs font-medium text-gray-500 mb-1">
                  Annual Total
                </div>
                <div className="text-xl font-bold text-purple-600">
                  {fmt(result.annualPtax)}
                </div>
              </div>
            </div>
          )}

          {result.rule.notes && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-800">
              📌 {result.rule.notes}
            </div>
          )}
        </div>
      )}

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs text-gray-700 leading-relaxed space-y-2">
        <strong>Professional tax rules at a glance:</strong>
        <ul className="list-disc list-inside ml-2 space-y-1">
          <li>
            <strong>Constitutional cap:</strong> Maximum ₹2,500 per year (Article
            276). No state can charge more.
          </li>
          <li>
            <strong>Levied by:</strong> 17 states + 2 UTs. NOT levied in Delhi,
            Haryana, UP, Rajasthan, Uttarakhand, J&K, HP, Goa, Chandigarh.
          </li>
          <li>
            <strong>Deduction by employer:</strong> P-tax is automatically
            deducted from salary; appears on payslip as &quot;Professional
            Tax&quot; or &quot;PT&quot;.
          </li>
          <li>
            <strong>Tax benefit:</strong> P-tax paid is fully deductible from
            gross salary u/s 16(iii) when computing income tax — both Old
            and New regime.
          </li>
          <li>
            <strong>Self-employed:</strong> professionals (doctors, CAs,
            advocates) need to register and pay directly to state commercial
            tax department.
          </li>
        </ul>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 leading-relaxed">
        <span className="mr-1">⚠️</span>
        <strong>Disclaimer:</strong> State P-tax rates are revised
        periodically. Karnataka revised slabs from 1 Apr 2025 (threshold
        raised to ₹25K). Maharashtra raised exemption for men from ₹7,500 to
        ₹10,000 in 2024. Always verify with your state commercial-tax
        department before filing returns.
      </div>
    </div>
  );
}
