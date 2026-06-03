/**
 * Per-tool SEO title + meta-description overrides.
 *
 * Phase 6 Round 4 Push B — post-SEO-audit keyword re-targeting.
 *
 * The default tool-page <title> template in src/app/tools/[slug]/page.tsx
 * produces a safe, short `${tool.name} — Free Online Tool` string for the
 * whole ~500-tool catalog. That template is fine for the long tail, but
 * the top commercial tools were effectively targeting unwinnable HEAD
 * terms — "emi calculator", "gst calculator", "income tax calculator" —
 * search phrases owned by Groww, ClearTax, BankBazaar and calculator.net,
 * domains with millions of backlinks and 10+ years of authority. An
 * 8-week-old site cannot out-rank them for those bare terms.
 *
 * This map hand-writes a long-tail, intent-rich title + description for
 * each high-value tool, so the page targets a more specific query that
 * SabTools can realistically rank for while the domain ages. Keyed by
 * tool slug.
 *
 * Rules:
 *   - title       : the COMPLETE title, applied via Next.js
 *                   `title.absolute` (bypasses the "%s | SabTools.in"
 *                   layout template). Keep ≤ 60 chars — Google truncates
 *                   display titles near there. The brand name is
 *                   deliberately omitted so the whole character budget
 *                   goes to the keyword; Google appends the site name
 *                   itself in the SERP where it chooses to.
 *   - description : ≤ 160 chars, intent-matched to the title.
 *
 * Adding more tools later: just extend this map. Tools NOT listed here
 * fall back to the template — incremental adoption, same pattern as
 * `hindiName` (tools.ts) and `slugFormulas` (tool-content.ts).
 *
 * Batch 1 (this commit): 21 highest-value finance / tax / core-utility
 * tools. Batches 2-3 will extend coverage toward ~40 tools.
 */
export interface ToolSeoOverride {
  /** Complete <title> string, ≤ 60 chars. Applied as title.absolute. */
  title: string;
  /** Meta description, ≤ 160 chars, intent-matched to the title. */
  description: string;
}

export const slugSeoOverrides: Record<string, ToolSeoOverride> = {
  // ── Finance ──────────────────────────────────────────────────────────
  "emi-calculator": {
    title: "EMI Calculator for Home, Car & Personal Loan — India",
    description:
      "Free EMI calculator for home, car & personal loans in India. See monthly EMI, total interest payable & the full amortisation schedule. No signup.",
  },
  "sip-calculator": {
    title: "SIP Calculator — Mutual Fund Return Estimator India",
    description:
      "Calculate SIP returns for mutual funds — maturity value, total invested amount & wealth gained for any monthly amount and tenure. Free, no signup.",
  },
  "gst-calculator": {
    title: "GST Calculator — Add & Reverse GST (5/12/18/28%)",
    description:
      "Free GST calculator for India — add or remove GST at 5%, 12%, 18% & 28% slabs. Get the GST amount, net price and gross price instantly.",
  },
  "fd-calculator": {
    title: "FD Calculator — Bank Fixed Deposit Maturity & Interest",
    description:
      "Calculate fixed deposit maturity amount and interest earned for any bank FD in India. Supports quarterly compounding and all tenures. Free.",
  },
  "rd-calculator": {
    title: "RD Calculator — Recurring Deposit Maturity Estimator",
    description:
      "Calculate recurring deposit maturity for monthly RD savings in any Indian bank or post office. See total deposit, interest earned & maturity value.",
  },
  "ppf-calculator": {
    title: "PPF Calculator — 15-Year Maturity & Interest (India)",
    description:
      "Calculate PPF maturity over 15 years with yearly compounding at the current PPF rate. See year-wise balance, interest & the tax-free corpus.",
  },
  "compound-interest-calculator": {
    title: "Compound Interest Calculator — Monthly & Yearly",
    description:
      "Calculate compound interest with monthly, quarterly, half-yearly or yearly compounding. See total growth, interest earned & maturity value. Free.",
  },
  "simple-interest-calculator": {
    title: "Simple Interest Calculator — P × R × T Formula",
    description:
      "Calculate simple interest on any principal, rate and time period. Instant result with the P×R×T formula shown step by step. Free, no signup.",
  },
  "income-tax-calculator": {
    title: "Income Tax Calculator FY 2025-26 — New & Old Regime",
    description:
      "Calculate income tax for FY 2025-26 under the new and old regime. Compare both, see slab-wise tax, cess and take-home pay. Free, built for India.",
  },
  "nps-calculator": {
    title: "NPS Calculator — Pension & Maturity Corpus Estimator",
    description:
      "Calculate your National Pension System corpus and monthly pension at retirement. See total investment, returns and annuity. Free NPS calculator.",
  },
  "lumpsum-calculator": {
    title: "Lumpsum Calculator — One-time Mutual Fund Investment",
    description:
      "Calculate returns on a one-time lumpsum mutual fund investment. See maturity value and wealth gained for any amount and period. Free, no signup.",
  },
  "car-loan-calculator": {
    title: "Car Loan EMI Calculator — Monthly Payment & Interest",
    description:
      "Calculate car loan EMI, total interest and repayment for any loan amount, rate and tenure. Free car loan EMI calculator for India. No signup.",
  },

  // ── Tax & Salary ─────────────────────────────────────────────────────
  "hra-calculator": {
    title: "HRA Exemption Calculator — Salary Tax Saving India",
    description:
      "Calculate HRA exemption on your salary under Section 10(13A). Handles metro & non-metro rules, taxable HRA and tax saved. Free, no signup.",
  },
  "tds-calculator": {
    title: "TDS Calculator — Section-wise Deduction Estimator",
    description:
      "Calculate TDS deduction for salary, rent, professional fees and more across all sections. See the net amount after tax. Free India TDS tool.",
  },
  "capital-gains-tax-calculator": {
    title: "Capital Gains Tax Calculator — LTCG & STCG (India)",
    description:
      "Calculate capital gains tax on shares, mutual funds & property — long-term and short-term, with indexation. Free, updated for India.",
  },
  "stamp-duty-calculator": {
    title: "Stamp Duty Calculator — State-wise Property Rates",
    description:
      "Calculate stamp duty and registration charges on property purchase across Indian states. See total cost. Free state-wise stamp duty tool.",
  },
  "gratuity-calculator": {
    title: "Gratuity Calculator — Payment of Gratuity Act Formula",
    description:
      "Calculate gratuity payable on resignation or retirement under the Payment of Gratuity Act. Enter last salary and years of service. Free tool.",
  },
  "epf-calculator": {
    title: "EPF Calculator — Provident Fund Maturity Estimator",
    description:
      "Calculate your EPF maturity corpus at retirement with employee and employer contributions at the current interest rate. Free India EPF tool.",
  },

  // ── SEO ──────────────────────────────────────────────────────────────
  "seo-checker": {
    title: "Free SEO Checker — Website Audit & Report Tool",
    description:
      "Free SEO checker & website audit tool — real performance scores, Core Web Vitals, schema detection, robots/sitemap checks and a full on-page SEO report. No signup.",
  },

  // ── Core Utility (high search volume) ────────────────────────────────
  "percentage-calculator": {
    title: "Percentage Calculator — % Of, Increase & Difference",
    description:
      "Calculate percentages fast — percent of a number, percentage increase or decrease, and the difference between two values. Free, instant, no signup.",
  },
  "age-calculator": {
    title: "Age Calculator — Exact Age in Years, Months & Days",
    description:
      "Calculate your exact age in years, months, days, hours and minutes from your date of birth. Free online age calculator. No signup needed.",
  },
  "bmi-calculator": {
    title: "BMI Calculator — Body Mass Index for Indian Adults",
    description:
      "Calculate your Body Mass Index (BMI) and see your category — underweight, normal or overweight. Calibrated for Indian adults. Free, no signup.",
  },

  // ── Math / Number system (page-1, 0-CTR cluster — see brief 2026-06-02) ──
  "lakh-crore-converter": {
    title: "Lakh & Crore to Million & Billion Converter",
    description:
      "Convert lakh & crore to million, billion & arab. 1 lakh crore = 1 trillion = 1,000 billion. 1 crore = 10 million. Free converter, no signup.",
  },
};
