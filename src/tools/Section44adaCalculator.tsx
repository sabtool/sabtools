"use client";
import { useMemo, useState } from "react";

/**
 * Section 44ADA Presumptive Taxation Calculator (India, FY 2025-26)
 *
 * For freelancers, consultants, doctors, lawyers, architects, engineers,
 * accountants and other specified professionals earning up to ₹75 lakh.
 *
 * Statutory framework:
 *   - Section 44ADA, Income Tax Act 1961: presumptive taxation for
 *     SPECIFIED professions (legal, medical, engineering, architecture,
 *     accountancy, technical consultancy, interior decoration, and
 *     other professions notified u/s 44AA(1)).
 *   - Deemed profit: 50% of gross receipts (or the actual profit if
 *     you voluntarily declare higher).
 *   - Eligibility: resident individual or partnership firm (NOT LLP),
 *     gross receipts ≤ ₹50 lakh. Finance Act 2023 enhanced the limit
 *     to ₹75 lakh when cash receipts are ≤ 5% of total receipts.
 *   - Benefits: no books of account (44AA exempt), no tax audit (44AB
 *     exempt), advance tax in ONE installment by 15 March instead of
 *     four quarterly installments.
 *   - Unlike Section 44AD (business presumptive), 44ADA has NO 5-year
 *     lock-in on opting out.
 *
 * Tax slabs FY 2025-26 (AY 2026-27), post Budget-2025:
 *   New regime: 0-4L nil · 4-8L 5% · 8-12L 10% · 12-16L 15% ·
 *               16-20L 20% · 20-24L 25% · above 24L 30%
 *               87A rebate: zero tax up to ₹12L total income
 *               Standard deduction n/a (no salary income assumed here)
 *   Old regime: 0-2.5L nil · 2.5-5L 5% · 5-10L 20% · above 10L 30%
 *               87A rebate up to ₹5L; Chapter VI-A deductions allowed
 *   Cess 4% on tax; surcharge from ₹50L total income (10%).
 */

const SPECIFIED_PROFESSIONS = [
  { key: "it", label: "Software / IT consulting & freelancing (technical consultancy)" },
  { key: "legal", label: "Legal (advocate / lawyer)" },
  { key: "medical", label: "Medical (doctor / dentist / physio)" },
  { key: "engineering", label: "Engineering" },
  { key: "architecture", label: "Architecture" },
  { key: "accountancy", label: "Accountancy (CA / CMA)" },
  { key: "interior", label: "Interior decoration" },
  { key: "film", label: "Film / media artist (notified u/s 44AA)" },
  { key: "company-secretary", label: "Company secretary" },
  { key: "other-notified", label: "Other notified profession u/s 44AA(1)" },
] as const;

interface Inputs {
  grossReceipts: number;
  cashPct: number;
  actualExpenses: number;
  deductions80c: number; // old regime Chapter VI-A total
  declaredPct: number;   // % of receipts declared as profit (min 50)
}

function newRegimeTax(income: number): number {
  // FY 2025-26 new regime slabs
  const slabs: [number, number][] = [
    [400000, 0],
    [800000, 0.05],
    [1200000, 0.10],
    [1600000, 0.15],
    [2000000, 0.20],
    [2400000, 0.25],
    [Infinity, 0.30],
  ];
  let tax = 0;
  let prev = 0;
  for (const [upto, rate] of slabs) {
    if (income > prev) {
      tax += (Math.min(income, upto) - prev) * rate;
      prev = upto;
    } else break;
  }
  // 87A rebate (new regime): total income up to ₹12L → zero tax
  if (income <= 1200000) tax = 0;
  return tax;
}

function oldRegimeTax(income: number): number {
  const slabs: [number, number][] = [
    [250000, 0],
    [500000, 0.05],
    [1000000, 0.20],
    [Infinity, 0.30],
  ];
  let tax = 0;
  let prev = 0;
  for (const [upto, rate] of slabs) {
    if (income > prev) {
      tax += (Math.min(income, upto) - prev) * rate;
      prev = upto;
    } else break;
  }
  // 87A rebate (old regime): income up to ₹5L → rebate up to ₹12,500
  if (income <= 500000) tax = Math.max(0, tax - 12500);
  return tax;
}

function withSurchargeCess(baseTax: number, income: number): number {
  let surchargeRate = 0;
  if (income > 5_000_000 && income <= 10_000_000) surchargeRate = 0.10;
  else if (income > 10_000_000) surchargeRate = 0.15;
  const surcharge = baseTax * surchargeRate;
  return (baseTax + surcharge) * 1.04; // +4% cess
}

function fmtINR(n: number, max = 0): string {
  if (!isFinite(n)) return "—";
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: max })
    .format(Math.round(n));
}

interface Result {
  eligible: boolean;
  enhancedLimit: boolean;
  limitApplied: number;
  deemedIncome: number;
  taxNew: number;
  taxOld: number;
  bestRegime: "new" | "old";
  bestTax: number;
  effectiveRatePct: number;
  // ITR-3 actual route comparison
  actualProfit: number;
  actualTaxNew: number;
  adaBetter: boolean;
  advantage: number;
  monthlyInHand: number;
}

function compute(i: Inputs): Result | null {
  if (i.grossReceipts <= 0) return null;

  const enhancedLimit = i.cashPct <= 5;
  const limitApplied = enhancedLimit ? 7_500_000 : 5_000_000;
  const eligible = i.grossReceipts <= limitApplied;

  const declaredPct = Math.max(50, i.declaredPct || 50);
  const deemedIncome = (i.grossReceipts * declaredPct) / 100;

  // 44ADA route: no further expense deduction. Old regime allows VI-A.
  const taxNew = withSurchargeCess(newRegimeTax(deemedIncome), deemedIncome);
  const oldTaxable = Math.max(0, deemedIncome - Math.min(i.deductions80c, 350000));
  const taxOld = withSurchargeCess(oldRegimeTax(oldTaxable), oldTaxable);

  const bestRegime = taxNew <= taxOld ? "new" : "old";
  const bestTax = Math.min(taxNew, taxOld);
  const effectiveRatePct = (bestTax / i.grossReceipts) * 100;

  // ITR-3 actual-expenses route (new regime, no VI-A assumed)
  const actualProfit = Math.max(0, i.grossReceipts - i.actualExpenses);
  const actualTaxNew = withSurchargeCess(newRegimeTax(actualProfit), actualProfit);
  const adaBetter = bestTax <= actualTaxNew;
  const advantage = Math.abs(actualTaxNew - bestTax);

  const monthlyInHand = (i.grossReceipts - bestTax) / 12;

  return {
    eligible,
    enhancedLimit,
    limitApplied,
    deemedIncome,
    taxNew,
    taxOld,
    bestRegime,
    bestTax,
    effectiveRatePct,
    actualProfit,
    actualTaxNew,
    adaBetter,
    advantage,
    monthlyInHand,
  };
}

export default function Section44adaCalculator() {
  const [profession, setProfession] = useState("it");
  const [grossReceipts, setGrossReceipts] = useState("3000000");
  const [cashPct, setCashPct] = useState("0");
  const [declaredPct, setDeclaredPct] = useState("50");
  const [actualExpenses, setActualExpenses] = useState("600000");
  const [deductions80c, setDeductions80c] = useState("150000");

  const result = useMemo(
    () =>
      compute({
        grossReceipts: parseFloat(grossReceipts) || 0,
        cashPct: parseFloat(cashPct) || 0,
        actualExpenses: parseFloat(actualExpenses) || 0,
        deductions80c: parseFloat(deductions80c) || 0,
        declaredPct: parseFloat(declaredPct) || 50,
      }),
    [grossReceipts, cashPct, actualExpenses, deductions80c, declaredPct]
  );

  return (
    <div className="space-y-6">
      {/* Profession + receipts */}
      <div className="result-card">
        <h3 className="font-bold text-gray-800 mb-1">💼 Profession + receipts (FY 2025-26)</h3>
        <p className="text-xs text-gray-500 mb-3">
          Section 44ADA covers the professions specified u/s 44AA(1). Most Indian freelancers
          (software, design, content for foreign or Indian clients) qualify under technical
          consultancy — confirm your specific case with a CA if unsure.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Your profession</label>
            <select value={profession} onChange={(e) => setProfession(e.target.value)} className="calc-input">
              {SPECIFIED_PROFESSIONS.map((p) => (
                <option key={p.key} value={p.key}>{p.label}</option>
              ))}
            </select>
          </div>
          <Field label="Gross annual receipts (₹)" value={grossReceipts} setValue={setGrossReceipts} hint="Total professional income before ANY expenses — FY total" />
          <Field label="Cash receipts (% of total)" value={cashPct} setValue={setCashPct} hint="≤ 5% unlocks the enhanced ₹75L limit (Finance Act 2023). Bank/UPI = 0%" />
          <Field label="Profit % you will declare" value={declaredPct} setValue={setDeclaredPct} hint="Minimum 50%. You may declare higher if your real margin is higher" />
        </div>
      </div>

      {/* Comparison inputs */}
      <div className="result-card">
        <h3 className="font-bold text-gray-800 mb-1">⚖️ For the ITR-3 comparison</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Your ACTUAL annual expenses (₹)" value={actualExpenses} setValue={setActualExpenses} hint="Laptop, rent, internet, software, travel, staff — what you could prove with bills" />
          <Field label="Chapter VI-A deductions (₹, old regime)" value={deductions80c} setValue={setDeductions80c} hint="80C + 80D + NPS etc. Used only for the old-regime column" />
        </div>
      </div>

      {result && (
        <>
          {/* Eligibility verdict */}
          <div className={`border-2 rounded-2xl p-5 ${result.eligible ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"}`}>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{result.eligible ? "✅" : "❌"}</span>
              <div>
                <h3 className={`text-lg font-extrabold ${result.eligible ? "text-emerald-900" : "text-red-900"}`}>
                  {result.eligible
                    ? `Eligible for Section 44ADA (limit ${fmtINR(result.limitApplied)})`
                    : `NOT eligible — receipts exceed ${fmtINR(result.limitApplied)}`}
                </h3>
                <p className={`text-sm mt-1 ${result.eligible ? "text-emerald-800" : "text-red-800"}`}>
                  {result.eligible
                    ? result.enhancedLimit
                      ? "Enhanced ₹75 lakh limit applies because cash receipts are ≤ 5% of total receipts."
                      : "Standard ₹50 lakh limit applies. Keep cash receipts ≤ 5% to unlock the ₹75 lakh limit."
                    : "Above the limit you must maintain books (Section 44AA), get a tax audit if applicable (44AB), and file ITR-3 with actual profit & loss."}
                </p>
              </div>
            </div>
          </div>

          {result.eligible && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl p-4 text-center">
                  <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Deemed taxable income</div>
                  <div className="text-2xl font-extrabold text-indigo-900 mt-1">{fmtINR(result.deemedIncome)}</div>
                  <div className="text-[11px] text-indigo-700 mt-1">{declaredPct}% of receipts · no books needed</div>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-rose-50 border border-red-200 rounded-2xl p-4 text-center">
                  <div className="text-xs font-semibold text-red-700 uppercase tracking-wider">Tax payable ({result.bestRegime} regime)</div>
                  <div className="text-2xl font-extrabold text-red-900 mt-1">{fmtINR(result.bestTax)}</div>
                  <div className="text-[11px] text-red-700 mt-1">
                    Effective {result.effectiveRatePct.toFixed(1)}% of gross receipts
                  </div>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl p-4 text-center">
                  <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Monthly in hand</div>
                  <div className="text-2xl font-extrabold text-emerald-900 mt-1">{fmtINR(result.monthlyInHand)}</div>
                  <div className="text-[11px] text-emerald-700 mt-1">After income tax (before GST, if any)</div>
                </div>
              </div>

              {/* Regime + route comparison */}
              <div className="result-card">
                <h3 className="font-bold text-gray-800 mb-3">🧮 44ADA vs ITR-3 (actual expenses) — full comparison</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-xs text-gray-500 uppercase tracking-wide">
                      <tr>
                        <th className="text-left py-2 pr-3">Route</th>
                        <th className="text-right py-2 pr-3">Taxable income</th>
                        <th className="text-right py-2 pr-3">Tax (incl. cess)</th>
                        <th className="text-left py-2 pl-3">Compliance burden</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-700">
                      <tr className={`border-t border-gray-100 ${result.bestRegime === "new" && result.adaBetter ? "bg-emerald-50/60" : ""}`}>
                        <td className="py-2 pr-3 font-bold">44ADA — new regime</td>
                        <td className="py-2 pr-3 text-right tabular-nums">{fmtINR(result.deemedIncome)}</td>
                        <td className="py-2 pr-3 text-right tabular-nums font-bold">{fmtINR(result.taxNew)}</td>
                        <td className="py-2 pl-3 text-gray-500">No books · no audit · 1 advance-tax date</td>
                      </tr>
                      <tr className={`border-t border-gray-100 ${result.bestRegime === "old" && result.adaBetter ? "bg-emerald-50/60" : ""}`}>
                        <td className="py-2 pr-3 font-bold">44ADA — old regime</td>
                        <td className="py-2 pr-3 text-right tabular-nums">{fmtINR(Math.max(0, result.deemedIncome - Math.min(parseFloat(deductions80c) || 0, 350000)))}</td>
                        <td className="py-2 pr-3 text-right tabular-nums font-bold">{fmtINR(result.taxOld)}</td>
                        <td className="py-2 pl-3 text-gray-500">Same + your 80C/80D proofs</td>
                      </tr>
                      <tr className={`border-t border-gray-100 ${!result.adaBetter ? "bg-emerald-50/60" : ""}`}>
                        <td className="py-2 pr-3 font-bold">ITR-3 — actual P&L</td>
                        <td className="py-2 pr-3 text-right tabular-nums">{fmtINR(result.actualProfit)}</td>
                        <td className="py-2 pr-3 text-right tabular-nums font-bold">{fmtINR(result.actualTaxNew)}</td>
                        <td className="py-2 pl-3 text-gray-500">Full books · possible audit · 4 advance-tax dates</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className={`text-sm mt-3 font-semibold ${result.adaBetter ? "text-emerald-700" : "text-amber-700"}`}>
                  {result.adaBetter
                    ? `✅ Section 44ADA saves you ${fmtINR(result.advantage)} vs the actual-expenses route — and removes the bookkeeping burden.`
                    : `⚠️ Your actual expenses are high enough that ITR-3 would save ${fmtINR(result.advantage)} — but weigh that against books + audit costs (typically ₹15,000-40,000/year in CA fees).`}
                </p>
              </div>
            </>
          )}
        </>
      )}

      {/* Reference: how 44ADA compares */}
      <div className="result-card">
        <h3 className="font-bold text-gray-800 mb-3">📋 44ADA vs 44AD vs regular ITR-3</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-gray-500 uppercase tracking-wide">
              <tr>
                <th className="text-left py-2 pr-3">Feature</th>
                <th className="text-left py-2 pr-3">44ADA (professionals)</th>
                <th className="text-left py-2 pr-3">44AD (business)</th>
                <th className="text-left py-2">ITR-3 (actual)</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {[
                ["Who", "Specified professions u/s 44AA(1)", "Eligible businesses (not professions)", "Anyone"],
                ["Turnover limit", "₹50L (₹75L if cash ≤ 5%)", "₹2Cr (₹3Cr if cash ≤ 5%)", "No limit"],
                ["Deemed profit", "50% of receipts", "8% (6% digital receipts)", "Actual P&L"],
                ["Books of account", "Not required", "Not required", "Required (44AA)"],
                ["Tax audit", "Not required", "Not required", "If turnover/conditions trigger 44AB"],
                ["Advance tax", "One installment — 15 March", "One installment — 15 March", "Four quarterly installments"],
                ["Opt-out lock-in", "None", "5-year bar u/s 44AD(4)", "n/a"],
                ["ITR form", "ITR-4 Sugam", "ITR-4 Sugam", "ITR-3"],
              ].map(([f, a, b, c], idx) => (
                <tr key={idx} className="border-t border-gray-100">
                  <td className="py-2 pr-3 font-bold">{f}</td>
                  <td className="py-2 pr-3">{a}</td>
                  <td className="py-2 pr-3">{b}</td>
                  <td className="py-2">{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Formula */}
      <div className="result-card">
        <h3 className="font-bold text-gray-800 mb-1">📐 The exact computation</h3>
        <pre className="bg-gray-900 text-green-200 text-xs sm:text-sm rounded-xl p-4 overflow-x-auto leading-relaxed">
{`Eligibility:
  Specified profession u/s 44AA(1)  AND  resident individual / firm (not LLP)
  Gross receipts ≤ ₹50,00,000
  (₹75,00,000 if cash receipts ≤ 5% of total — Finance Act 2023)

Deemed income  = Gross receipts × 50%   (or higher, if declared)

Tax (new regime, FY 2025-26):
  0-4L nil · 4-8L 5% · 8-12L 10% · 12-16L 15%
  16-20L 20% · 20-24L 25% · above 24L 30%
  Section 87A: zero tax when total income ≤ ₹12,00,000

Tax (old regime):
  0-2.5L nil · 2.5-5L 5% · 5-10L 20% · above 10L 30%
  Chapter VI-A deductions (80C, 80D, NPS...) reduce taxable income

+ Surcharge (if total income > ₹50L: 10%; > ₹1Cr: 15%)
+ Health & Education Cess: 4%

Advance tax: 100% by 15 March (single installment — Section 211 proviso)`}
        </pre>
      </div>

      {/* FAQ */}
      <div className="result-card">
        <h3 className="font-bold text-gray-800 mb-3">❓ FAQs</h3>
        <div className="space-y-4 text-sm">
          <div>
            <h4 className="font-bold text-gray-800">Who qualifies for Section 44ADA?</h4>
            <p className="text-gray-600 mt-1">
              Resident individuals and partnership firms (but NOT LLPs) carrying on a{" "}
              <strong>specified profession under Section 44AA(1)</strong>: legal, medical,
              engineering, architecture, accountancy, technical consultancy, interior decoration,
              and other notified professions (company secretaries, film artists, authorised
              representatives). <strong>Software freelancers and IT consultants</strong> generally
              fall under {"\""}technical consultancy{"\""} — this is the most common route for
              India&apos;s freelance developers, designers and content professionals billing
              foreign or domestic clients. Commission agents and brokers are explicitly NOT
              eligible (nor under 44AD).
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">What are the ₹50 lakh and ₹75 lakh limits?</h4>
            <p className="text-gray-600 mt-1">
              The base limit is <strong>₹50 lakh of gross receipts</strong> in the financial year.
              Finance Act 2023 added an <strong>enhanced ₹75 lakh limit</strong> that applies when
              your <strong>cash receipts are at most 5% of total receipts</strong> — payments by
              bank transfer, UPI, cheque and card all count as non-cash. A freelancer billing
              everything through bank transfers qualifies for the full ₹75 lakh. Cross the
              applicable limit and 44ADA is unavailable for that year: you file ITR-3 with books
              and, where triggered, a tax audit.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">What does {"\""}50% deemed profit{"\""} actually mean?</h4>
            <p className="text-gray-600 mt-1">
              The law <strong>presumes</strong> your taxable profit is 50% of gross receipts — you
              pay tax on that amount regardless of what you actually spent. If your real expenses
              are only 10-20% of receipts (typical for solo software freelancers: a laptop,
              internet, software subscriptions), the presumption is generous — you effectively get
              a 50% flat deduction with zero paperwork. You may declare a{" "}
              <strong>higher</strong> profit than 50% if your books would show more.
              Declaring <strong>lower</strong> than 50% while your income exceeds the basic
              exemption means losing the presumption: books become mandatory and a tax audit
              applies.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">Can I still claim 80C, 80D and NPS deductions?</h4>
            <p className="text-gray-600 mt-1">
              <strong>Under the old regime, yes</strong> — Chapter VI-A deductions (80C up to
              ₹1.5L, 80D health insurance, 80CCD(1B) NPS ₹50K, etc.) apply on top of the 50%
              presumption. <strong>Under the new regime</strong> (default from FY 2023-24) most
              VI-A deductions are unavailable, but slab rates are lower and the Section 87A
              rebate makes total income up to <strong>₹12 lakh completely tax-free in FY
              2025-26</strong>. Practical consequence: a freelancer with ₹24 lakh receipts →
              deemed income ₹12 lakh → <strong>zero income tax</strong> under the new regime.
              This calculator computes both regimes and highlights the cheaper one.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">What about advance tax under 44ADA?</h4>
            <p className="text-gray-600 mt-1">
              Presumptive taxpayers get a major simplification: instead of four quarterly
              installments (15 June / 15 Sep / 15 Dec / 15 Mar), you pay{" "}
              <strong>100% of advance tax in a single installment by 15 March</strong> of the
              financial year. Miss it and interest under Sections 234B/234C applies. Pay online
              via the e-filing portal (e-Pay Tax → Advance Tax, minor head 100) using your PAN.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">How does GST interact with 44ADA?</h4>
            <p className="text-gray-600 mt-1">
              They are <strong>independent laws</strong>. 44ADA is income tax; GST registration
              is required once aggregate turnover crosses <strong>₹20 lakh for services</strong>{" "}
              (₹10 lakh in special-category states) regardless of your income-tax route.
              Freelancers exporting services (foreign clients, payment in forex) can register and
              file a <strong>LUT (Letter of Undertaking)</strong> to zero-rate exports — no GST
              charged, input credits refundable. Many ₹20L+ freelancers therefore run 44ADA for
              income tax AND a GST registration with LUT simultaneously. GST turnover and 44ADA
              receipts should reconcile — mismatches between GSTR filings and ITR receipts are a
              common notice trigger.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">44ADA or ITR-3 with actual expenses — which is better?</h4>
            <p className="text-gray-600 mt-1">
              Compare your <strong>real expense ratio</strong> against the 50% presumption. Solo
              professionals with laptop-and-internet cost structures (10-25% expenses) are almost
              always better off under 44ADA — the presumption deducts more than reality, with
              zero compliance. Professionals with heavy genuine costs — a clinic with staff and
              equipment, an architecture firm with office rent and juniors — may cross 50% real
              expenses, making ITR-3 cheaper on tax but costlier in compliance (books, possible
              audit, four advance-tax dates, higher CA fees). The comparison table above puts
              rupee numbers on exactly this trade-off. Unlike 44AD, there is{" "}
              <strong>no 5-year lock-in</strong>: you can switch between 44ADA and ITR-3
              year-by-year as your economics change.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">Do I need to maintain any records at all?</h4>
            <p className="text-gray-600 mt-1">
              Formal books of account under Section 44AA are <strong>not required</strong>, and no
              tax audit applies while you declare ≥ 50%. Practically, still keep:{" "}
              <strong>invoices raised, bank statements, and GST returns (if registered)</strong> —
              the department can ask you to substantiate the receipts figure itself, and FIRC/
              remittance advices matter for export-of-services claims. File{" "}
              <strong>ITR-4 (Sugam)</strong> by the normal due date (typically 31 July for
              non-audit cases). Consider a CA review in your first presumptive year — the setup
              (profession classification, GST-ITR reconciliation) is where mistakes happen, not
              the ongoing math.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, setValue, hint, step = 1 }: { label: string; value: string; setValue: (v: string) => void; hint?: string; step?: number }) {
  return (
    <div>
      <label className="text-sm font-semibold text-gray-700 block mb-1">{label}</label>
      <input
        type="number"
        inputMode="decimal"
        step={step}
        min={0}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="calc-input"
      />
      {hint && <p className="text-[11px] text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}
