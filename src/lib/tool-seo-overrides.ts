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

  // ── Construction ────────────────────────────────────────────────────
  "floor-load-capacity-calculator": {
    title: "Floor Load Capacity Calculator — Plywood, OSB, RCC India",
    description:
      "Free floor load calculator per IS 303 / IS 710 / IS 456. Plywood / OSB / particle / RCC slab. Bending + deflection check, IS 875 live load verdict, ₹/m².",
  },
  "wood-beam-span-calculator": {
    title: "Wood Beam Span Calculator — IS 883 Timber + LVL India",
    description:
      "Free wood / LVL beam span calculator per IS 883:1994. Supports teak, sal, deodar, eucalyptus + 1.9E/2.0E LVL. Bending + L/350 deflection check, cost per cft.",
  },
  "concrete-footing-calculator": {
    title: "Concrete Footing Calculator India — Cement, Sand, Steel & ₹",
    description:
      "Free RCC footing calculator with M10-M30 mix designs, brass conversion, rebar weight (IS:1786) and full bill of materials with India 2026 rates. PCC + design mix supported.",
  },

  // ── Marketing / SEO ROI ─────────────────────────────────────────────
  "email-marketing-roi-calculator": {
    title: "Email Marketing ROI Calculator India — Benchmarks + Cost",
    description:
      "Free email marketing ROI calculator with India-specific benchmarks (B2C, B2B, creator). Compares Mailchimp / Brevo / Zoho cost. DPDP Act compliance notes.",
  },
  "ad-revenue-estimator": {
    title: "AdSense Revenue Calculator India — RPM by Niche + Tax",
    description:
      "Free AdSense / Ezoic / Mediavine ad revenue calculator. India-specific RPM benchmarks by niche (5-20× lower than US). Includes GST + ITR tax math.",
  },
  "seo-roi-calculator": {
    title: "SEO ROI Calculator — Project Organic Revenue + Payback",
    description:
      "Free SEO ROI calculator. Project organic clicks, conversions, 12-month revenue uplift, payback period using Sistrix CTR benchmarks. Built for India.",
  },

  // ── Startup / SaaS metrics ──────────────────────────────────────────
  "burn-rate-runway-calculator": {
    title: "Burn Rate & Runway Calculator — Startup Cash Projection",
    description:
      "Free startup burn rate & runway calculator. 24-month cash projection, burn multiple (Sacks), Default Alive (YC). Built for Indian seed & Series A founders.",
  },
  "saas-rule-of-40-calculator": {
    title: "SaaS Rule of 40 Calculator — Growth + Margin Health Score",
    description:
      "Free SaaS Rule of 40 calculator. Combines YoY growth + profit margin against the 40 benchmark. EBITDA / FCF / Net options, Bessemer Cloud Index bands.",
  },
  "startup-valuation-calculator": {
    title: "Startup Valuation Calculator — Pre & Post-Money + Dilution",
    description:
      "Free post-money & pre-money valuation calculator for startups. Get cap table, founder dilution, ESOP pre vs post-money split + India Series A benchmarks.",
  },
  "cac-ltv-ratio-calculator": {
    title: "LTV CAC Ratio Calculator — SaaS & Startup Unit Economics",
    description:
      "Free LTV:CAC ratio calculator for SaaS & startups. Get CAC, LTV, payback period + verdict against the 3× industry benchmark. India-focused, no signup.",
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

  // ── Sports (page-1, 0.49%-CTR — see brief 2026-06-05) ──
  "ipl-required-run-rate-calculator": {
    title: "RRR Calculator — Required Run Rate for T20 & ODI Chase",
    description:
      "Calculate required run rate (RRR) live for a T20, IPL or ODI chase. Enter target, score & overs left to get runs needed per over and chase verdict.",
  },

  // ── Converters (striking-distance pos 4-11, 0-CTR INR cluster — see brief 2026-06-06) ──
  "currency-converter": {
    title: "INR to USD Converter — Live Rupee to Dollar Rate",
    description:
      "Convert INR to USD, EUR, GBP, AED & more at live rates. Type any rupee amount for instant dollar value — e.g. 14400 INR to USD. Free, no signup.",
  },

  // ── Reverse-SIP long-tail (head SIP term unwinnable @pos 83.7 — see brief 2026-06-07) ──
  "goal-based-sip-calculator": {
    title: "SIP for 1 Crore Calculator — Monthly SIP You Need",
    description:
      "How much SIP per month to reach 1 crore? Enter your goal & years to get the exact monthly SIP needed — with inflation option. Free, no signup.",
  },
  "step-up-sip-calculator": {
    title: "Step-Up SIP Calculator — Top-Up SIP with 10% Increase",
    description:
      "Calculate Step-Up (Top-Up) SIP returns with yearly increases — see how a 10% annual step-up grows your corpus vs a flat SIP. Free, no signup.",
  },

  // ── Electrical (DECLINING: 502 impr @ pos 75 with template title only — see brief 2026-06-08) ──
  "wire-size-calculator": {
    title: "Wire Size Calculator — Cable mm² for Load (India)",
    description:
      "Find the right wire size in sq mm for your load — enter current, voltage & cable length to get the recommended copper/aluminium cable size for Indian wiring.",
  },

  // ── Date & time (DECLINING: 162 impr @ pos 40, template title only — see brief 2026-06-08) ──
  "date-difference-calculator": {
    title: "Date Difference Calculator — Days Between Two Dates",
    description:
      "Calculate the exact difference between two dates in years, months, weeks and days. Find days between dates instantly. Free, no signup, works on mobile.",
  },

  // ── Salary (DECLINING: "take home salary calculator" @ pos 79, template title only — see brief 2026-06-08) ──
  "in-hand-salary-calculator": {
    title: "In-Hand Salary Calculator — Take-Home Pay from CTC",
    description:
      "Calculate your in-hand take-home salary from CTC — monthly net pay after PF, professional tax and income tax (old & new regime), with a full payslip. Free.",
  },

  // ── Vehicle / transport (TECHNICAL: high-impression, template-title-only, buried — see brief 2026-06-10) ──
  "toll-calculator": {
    title: "Toll Calculator India — Highway & Expressway Toll",
    description:
      "Estimate FASTag toll charges for any Indian highway or expressway by vehicle type. Plan trip toll cost across NHAI plazas before driving. Free, no signup.",
  },
  "vehicle-depreciation-calculator": {
    title: "Vehicle Depreciation Calculator — Car & Bike Value",
    description:
      "Calculate car or bike depreciation by the Written Down Value (WDV) method with a year-wise resale value table. Find your vehicle's current worth. Free.",
  },
  "kvp-calculator": {
    title: "KVP Calculator — Kisan Vikas Patra Maturity (7.5%)",
    description:
      "Calculate Kisan Vikas Patra (KVP) maturity — money doubles in 115 months at 7.5% with a year-by-year breakdown. Free post-office KVP calculator, no signup.",
  },

  // ── Finance (BEHAVIOUR/UX run 2026-06-11: top-used PostHog tool + GSC pos-4 "daily interest calculator india", template title only) ──
  "daily-interest-calculator": {
    title: "Daily Interest Calculator — Date-wise Loan Byaj",
    description:
      "Calculate loan interest day by day with the exact day count between two dates. Daily byaj / interest for hand loans in India. Free, no signup.",
  },

  // ── Career (notice-period-buyout query clicked @ pos 11; template title only — see brief 2026-06-11) ──
  "notice-period-calculator": {
    title: "Notice Period Calculator — Last Day & Buyout Amount",
    description:
      "Calculate your last working day, days remaining and notice-period buyout amount from your resignation and joining dates, with a calendar view. Free.",
  },

  // ── Date & time (15 impr @ pos 47, template title only — see brief 2026-06-11) ──
  "countdown-timer": {
    title: "Countdown Timer — Days Left to Any Date or Event",
    description:
      "Create a live countdown timer to any future date or event — see days, hours and minutes remaining. Free online countdown timer, works on mobile.",
  },

  // ── PDF · long-tail wedge against Speechify / NaturalReader / ReadLoudly
  // (all of which require signup, upload PDFs to their servers, and watermark
  // free-tier audio). We can't out-rank them on "pdf to speech" head terms,
  // so we target queries where their value-prop breaks down:
  //   - "private pdf reader"          (we're 100% client-side)
  //   - "pdf to speech no signup"     (we never ask)
  //   - "listen pdf hindi free"       (we surface OS Hindi voices)
  //   - "pdf voice reader for students" (free, unlimited, no caps)
  // Title leads with "Listen to PDF Aloud" (Google-friendly phrasing,
  // 4,400+ searches/mo per Ahrefs), keeps "Free" and the Hindi/English
  // qualifier inside the 60-char budget. ──
  "pdf-to-speech": {
    title: "Listen to PDF Aloud — Free PDF to Speech (Hindi/Eng)",
    description:
      "Upload a PDF and listen — free, no signup, no upload to any server. Indian English & Hindi voices. 100% private. Perfect for students & long reads.",
  },

  // ── HIGH-RANK / LOW-CTR title fixes (brief 2026-06-12) ──
  "experience-calculator": {
    title: "Work Experience Calculator — Years, Months & Multiple Jobs",
    description:
      "Calculate total work experience in years, months & days across multiple jobs with overlap detection. Perfect for resumes & job applications. Free.",
  },
  "gas-cylinder-calculator": {
    title: "Gas Cylinder Calculator — How Long a 14.2 kg LPG Lasts",
    description:
      "Find how many days a 14.2 kg LPG cylinder lasts for your cooking, plus the per-meal cost vs induction. Free gas cylinder calculator, no signup.",
  },
  "lpg-subsidy-calculator": {
    title: "LPG Subsidy Calculator — Effective Cylinder Price India",
    description:
      "Calculate your LPG cylinder price after subsidy, monthly cooking-gas cost and an induction-vs-LPG comparison. Free LPG subsidy calculator, no signup.",
  },

  // ── STRIKING-DISTANCE title fixes (brief 2026-06-13, N=13) ──
  // college-fee-calculator: pos 4.7, 12 impr, 2 clicks, template title only;
  // water-tank-calculator: pos 18.1, 25 impr, template title only. Both never
  // overridden — generic "${name} — Free Online Tool" caps CTR at top of SERP.
  "college-fee-calculator": {
    title: "College Fee Calculator — IIT, NIT, Medical & MBA + Loan EMI",
    description:
      "Estimate total IIT, NIT, private engineering, MBBS & MBA college fees in India, then size an education loan and see the monthly EMI. Free, no signup.",
  },
  "water-tank-calculator": {
    title: "Water Tank Calculator — Size by Family in Litres (India)",
    description:
      "Find the right overhead & underground water tank size in litres for your family, based on daily usage per person. Free water tank calculator, no signup.",
  },

  // ── Agriculture (DECLINING: page @ pos 23.2 on 53 impr / 1 click, deep page-3, template title only — see brief 2026-06-14) ──
  "crop-yield-calculator": {
    title: "Crop Yield Calculator — Yield, MSP Revenue & Profit per Acre",
    description:
      "Estimate crop yield in quintals and revenue at MSP for rice, wheat, sugarcane & cotton, then your profit per acre after input costs. Free, no signup.",
  },
  // ── Astrology (DECLINING: "accurate gemstone calculator" @ pos 77.7, page @ pos 80.2 on 34 impr / 2 clicks, template title only — see brief 2026-06-14) ──
  "gemstone-recommendation": {
    title: "Gemstone Recommendation by Rashi — Weight, Metal & Mantra",
    description:
      "Find your recommended gemstone (ratna) by Rashi — Neelam, Pukhraj, Panna, Manik & more — with carat weight, metal, finger and mantra. Free, instant.",
  },
};
