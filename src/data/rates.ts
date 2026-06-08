/**
 * ═══════════════════════════════════════════════════════════════════════
 *  CENTRAL RATES REGISTRY  ·  Project Trust  ·  src/data/rates.ts
 * ═══════════════════════════════════════════════════════════════════════
 *
 *  The single source of truth for every government-set rate, statutory
 *  ceiling, scheme parameter, and slab table used by any sabtools.in
 *  calculator.
 *
 *  This file replaces hardcoded magic numbers inside individual tool
 *  files. Every L2 / L4 calculator (per the Project Trust risk register)
 *  imports its values from here. One update here → every downstream tool
 *  reflects it instantly, with no risk of drift.
 *
 *  ─── Why this file exists ──────────────────────────────────────────
 *
 *  Before Project Trust, rates lived as inline constants scattered
 *  across ~50 tool files. The PPF rate appeared in 4 different places.
 *  EPF in 3. Income-tax slabs in 5. When the Government revised them
 *  quarterly / annually, somebody had to remember to edit every file —
 *  and inevitably some got missed. Result: drift, stale numbers, lost
 *  user trust.
 *
 *  ─── How every entry is structured ─────────────────────────────────
 *
 *  Every rate carries six fields (RateEntry interface below):
 *
 *    value              The current authoritative value(s).
 *    effectiveFrom      ISO date — when this value kicked in.
 *    source             Official URL we verified against.
 *    lastVerified       ISO date — when we last cross-checked the
 *                       source page and confirmed.
 *    reviewIntervalDays How often to re-verify (90d for quarterly,
 *                       365d for annual, 60d for repo rate, etc.).
 *    notes              Free-form context — caveats, special rules.
 *
 *  Phase 4 of Project Trust uses `lastVerified + reviewIntervalDays` to
 *  email Rakesh every Monday with the list of rates that have aged past
 *  their review window. He clicks each official-source link, glances at
 *  the rate, replies "confirmed" or "updated to X" — done.
 *
 *  ─── How to update a rate ──────────────────────────────────────────
 *
 *  1. Open the `source` URL and read the current value.
 *  2. Edit the `value` field if it changed (otherwise leave it).
 *  3. Update `lastVerified` to today's date.
 *  4. If the rate changed, also update `effectiveFrom`.
 *  5. Commit. Every consuming tool picks up the change automatically.
 *
 *  Last full audit: 8 June 2026.
 */

export interface RateEntry<T = number> {
  /** The current authoritative value(s). */
  value: T;
  /** ISO date (YYYY-MM-DD) — when this value officially kicked in. */
  effectiveFrom: string;
  /** Official source URL — Government of India or statutory body. */
  source: string;
  /** ISO date (YYYY-MM-DD) — when we last cross-checked the source. */
  lastVerified: string;
  /** How often to re-verify (90 = quarterly, 365 = annual, etc.). */
  reviewIntervalDays: number;
  /** Free-form context — caveats, special rules, change history. */
  notes?: string;
}

// ═══════════════════════════════════════════════════════════════════════
//  SMALL-SAVINGS SCHEMES (Ministry of Finance, quarterly revision)
// ═══════════════════════════════════════════════════════════════════════
//
//  Notified by the Department of Economic Affairs ~31st of every quarter
//  (Mar / Jun / Sep / Dec) for the next quarter. nsiindia.gov.in is the
//  primary canonical source; dea.gov.in carries the official OMs.
//
//  As of Q1 FY 2026-27 (Apr-Jun 2026), all small-savings rates were left
//  unchanged for the 8th consecutive quarter (Finance Ministry, 31 Mar
//  2026 notification).

export const PPF: RateEntry = {
  value: 7.1,
  effectiveFrom: "2026-04-01",
  source: "https://www.nsiindia.gov.in/(S(s1ic2au0ml0fwl45cguemd45))/InternalPage.aspx?Id_Pk=53",
  lastVerified: "2026-06-08",
  reviewIntervalDays: 90,
  notes:
    "PPF rate has been 7.1% since 1 April 2020 — unchanged for 7 consecutive years. " +
    "Compounded annually, credited on 31 March. Calculated on the lowest balance " +
    "between the 5th and last day of each month.",
};

export const SCSS: RateEntry = {
  value: 8.2,
  effectiveFrom: "2026-04-01",
  source: "https://www.nsiindia.gov.in/(S(s1ic2au0ml0fwl45cguemd45))/InternalPage.aspx?Id_Pk=89",
  lastVerified: "2026-06-08",
  reviewIntervalDays: 90,
  notes:
    "Senior Citizens Savings Scheme: 8.2% p.a., quarterly payout. " +
    "Unchanged since April 2023. Tax deduction under 80C; interest taxable; " +
    "TDS applies above ₹50k interest/yr. Max ₹30 lakh per depositor.",
};

export const SSY: RateEntry = {
  value: 8.2,
  effectiveFrom: "2026-04-01",
  source: "https://www.nsiindia.gov.in/(S(s1ic2au0ml0fwl45cguemd45))/InternalPage.aspx?Id_Pk=58",
  lastVerified: "2026-06-08",
  reviewIntervalDays: 90,
  notes:
    "Sukanya Samriddhi Yojana: 8.2% p.a., compounded annually. " +
    "For girl child under 10; matures when she turns 21. " +
    "Min ₹250, max ₹1.5 lakh per year. Section 80C eligible.",
};

export const NSC: RateEntry = {
  value: 7.7,
  effectiveFrom: "2026-04-01",
  source: "https://www.nsiindia.gov.in/(S(s1ic2au0ml0fwl45cguemd45))/InternalPage.aspx?Id_Pk=54",
  lastVerified: "2026-06-08",
  reviewIntervalDays: 90,
  notes:
    "National Savings Certificate (5-year): 7.7% p.a., compounded annually, " +
    "paid at maturity. Section 80C eligible. Interest re-investment " +
    "(years 1-4) also counts under 80C limit.",
};

export const KVP: RateEntry<{ rate: number; maturityMonths: number }> = {
  value: { rate: 7.5, maturityMonths: 115 },
  effectiveFrom: "2026-04-01",
  source: "https://www.nsiindia.gov.in/(S(s1ic2au0ml0fwl45cguemd45))/InternalPage.aspx?Id_Pk=58",
  lastVerified: "2026-06-08",
  reviewIntervalDays: 90,
  notes:
    "Kisan Vikas Patra: doubles your money in 115 months (~9 years 7 months) " +
    "at 7.5% p.a. compounded annually. No 80C benefit; interest fully taxable.",
};

export const MIS: RateEntry = {
  value: 7.4,
  effectiveFrom: "2026-04-01",
  source: "https://www.nsiindia.gov.in/(S(s1ic2au0ml0fwl45cguemd45))/InternalPage.aspx?Id_Pk=56",
  lastVerified: "2026-06-08",
  reviewIntervalDays: 90,
  notes:
    "Post Office Monthly Income Scheme: 7.4% p.a., monthly interest payout. " +
    "5-year tenure. Max ₹9 lakh single / ₹15 lakh joint. Principal back at maturity. " +
    "Interest taxable; no 80C; no TDS.",
};

export const POST_OFFICE_RD: RateEntry = {
  value: 6.7,
  effectiveFrom: "2026-04-01",
  source: "https://www.nsiindia.gov.in/(S(s1ic2au0ml0fwl45cguemd45))/InternalPage.aspx?Id_Pk=55",
  lastVerified: "2026-06-08",
  reviewIntervalDays: 90,
  notes: "Post Office 5-year Recurring Deposit: 6.7% p.a., compounded quarterly.",
};

export const POST_OFFICE_TD_1Y: RateEntry = {
  value: 6.9,
  effectiveFrom: "2026-04-01",
  source: "https://www.nsiindia.gov.in/(S(s1ic2au0ml0fwl45cguemd45))/InternalPage.aspx?Id_Pk=57",
  lastVerified: "2026-06-08",
  reviewIntervalDays: 90,
  notes: "Post Office Time Deposit 1-year: 6.9% p.a., quarterly compounding.",
};

export const POST_OFFICE_TD_2Y: RateEntry = {
  value: 7.0,
  effectiveFrom: "2026-04-01",
  source: "https://www.nsiindia.gov.in/(S(s1ic2au0ml0fwl45cguemd45))/InternalPage.aspx?Id_Pk=57",
  lastVerified: "2026-06-08",
  reviewIntervalDays: 90,
  notes: "Post Office Time Deposit 2-year: 7.0% p.a., quarterly compounding.",
};

export const POST_OFFICE_TD_3Y: RateEntry = {
  value: 7.1,
  effectiveFrom: "2026-04-01",
  source: "https://www.nsiindia.gov.in/(S(s1ic2au0ml0fwl45cguemd45))/InternalPage.aspx?Id_Pk=57",
  lastVerified: "2026-06-08",
  reviewIntervalDays: 90,
  notes: "Post Office Time Deposit 3-year: 7.1% p.a., quarterly compounding.",
};

export const POST_OFFICE_TD_5Y: RateEntry = {
  value: 7.5,
  effectiveFrom: "2026-04-01",
  source: "https://www.nsiindia.gov.in/(S(s1ic2au0ml0fwl45cguemd45))/InternalPage.aspx?Id_Pk=57",
  lastVerified: "2026-06-08",
  reviewIntervalDays: 90,
  notes:
    "Post Office Time Deposit 5-year: 7.5% p.a., quarterly compounding. " +
    "Section 80C eligible (only the 5-year TD qualifies).",
};

export const POST_OFFICE_SAVINGS: RateEntry = {
  value: 4.0,
  effectiveFrom: "2020-04-01",
  source: "https://www.nsiindia.gov.in/(S(s1ic2au0ml0fwl45cguemd45))/InternalPage.aspx?Id_Pk=52",
  lastVerified: "2026-06-08",
  reviewIntervalDays: 365,
  notes:
    "Post Office Savings Account: 4% p.a. simple interest, calculated on " +
    "minimum balance between 10th and last day of each month. " +
    "Unchanged since April 2020. Interest up to ₹3,500 single / ₹7,000 joint " +
    "is exempt under Section 80TTA.",
};

// ═══════════════════════════════════════════════════════════════════════
//  MAHILA SAMMAN SAVINGS CERTIFICATE — CLOSED SCHEME
// ═══════════════════════════════════════════════════════════════════════

export const MSSC: RateEntry<{ rate: number; isOpen: boolean; closedOn: string }> = {
  value: { rate: 7.5, isOpen: false, closedOn: "2025-03-31" },
  effectiveFrom: "2023-04-01",
  source: "https://www.indiapost.gov.in/Financial/Pages/Content/MSSC.aspx",
  lastVerified: "2026-06-08",
  reviewIntervalDays: 180,
  notes:
    "Mahila Samman Savings Certificate (MSSC, 2023): CLOSED for new deposits " +
    "from 31 March 2025 (SB Order No. 03/2025, Dept. of Posts). " +
    "Budget 2026-27 did NOT extend or relaunch the scheme. " +
    "Existing accounts (opened before 31 Mar 2025) continue to earn 7.5% " +
    "compounded quarterly till their 2-year maturity. " +
    "ECS withdrawals to non-Post-Office bank accounts permitted since " +
    "12 June 2025 (Min. of Communication circular).",
};

// ═══════════════════════════════════════════════════════════════════════
//  EMPLOYEES' PROVIDENT FUND (EPFO, annual revision)
// ═══════════════════════════════════════════════════════════════════════

export const EPF: RateEntry = {
  value: 8.25,
  effectiveFrom: "2026-04-01",
  source: "https://www.epfindia.gov.in/site_en/index.php",
  lastVerified: "2026-06-08",
  reviewIntervalDays: 365,
  notes:
    "EPF interest rate for FY 2026-27: 8.25% p.a., ratified by EPFO Central " +
    "Board of Trustees. Same as FY 2025-26 (two consecutive years stable). " +
    "Employer contributes 3.67% of basic to EPF and 8.33% to EPS. " +
    "EPF wage ceiling: ₹15,000/month for mandatory coverage.",
};

export const EPF_WAGE_CEILING: RateEntry = {
  value: 15000,
  effectiveFrom: "2014-09-01",
  source: "https://www.epfindia.gov.in/site_en/PFwage.php",
  lastVerified: "2026-06-08",
  reviewIntervalDays: 180,
  notes:
    "Mandatory EPF coverage wage ceiling: ₹15,000/month. " +
    "Unchanged since Sep 2014. Periodic proposals to raise it to ₹21,000 — " +
    "review this regularly.",
};

// ═══════════════════════════════════════════════════════════════════════
//  INCOME TAX SLABS (Budget, annual revision)
// ═══════════════════════════════════════════════════════════════════════

export interface TaxSlab {
  upTo: number; // Income threshold (₹). Infinity for the top slab.
  rate: number; // Marginal rate (%).
}

export interface IncomeTaxRegime {
  slabs: TaxSlab[];
  standardDeduction: number;
  rebateUnder87A: number;
  rebateMaxIncome: number;
  cessPercent: number;
  notes: string;
}

export const INCOME_TAX_NEW_REGIME_FY26_27: RateEntry<IncomeTaxRegime> = {
  value: {
    slabs: [
      { upTo: 400_000, rate: 0 },
      { upTo: 800_000, rate: 5 },
      { upTo: 1_200_000, rate: 10 },
      { upTo: 1_600_000, rate: 15 },
      { upTo: 2_000_000, rate: 20 },
      { upTo: 2_400_000, rate: 25 },
      { upTo: Infinity, rate: 30 },
    ],
    standardDeduction: 75_000,
    rebateUnder87A: 60_000,
    rebateMaxIncome: 1_200_000,
    cessPercent: 4,
    notes:
      "New regime, FY 2026-27 (AY 2027-28). Budget 2026 retained the FY 2025-26 " +
      "slab structure unchanged. ₹0 tax up to ₹12L (rebate). Section 87A renumbered " +
      "to Clause 156 under new Income Tax Act 2026 (same benefit).",
  },
  effectiveFrom: "2026-04-01",
  source: "https://www.incometax.gov.in/iec/foportal/help/individual/return-applicable-1",
  lastVerified: "2026-06-08",
  reviewIntervalDays: 365,
};

// Old regime has age-banded basic-exemption thresholds. Below 60 gets
// the 5% band starting at ₹2.5L; 60-80 senior citizens get the 5% band
// starting at ₹3L (₹50k bigger 0% slab); above-80 super-senior citizens
// get NO 5% slab at all — straight to 20% above ₹5L. We encode each as
// its own slab table because a single slab table can't represent the
// shifting band start points correctly.
//
// HISTORICAL BUG NOTE (fixed Project Trust Phase 2): the previous
// implementation in IncomeTaxCalculator subtracted the basic exemption
// AND then applied slabs whose first band started at 5% from 0 —
// double-counting the exemption and over-taxing every old-regime user.
// The age-specific slab tables below model the actual law correctly.

export const INCOME_TAX_OLD_REGIME_FY26_27_BELOW_60: RateEntry<IncomeTaxRegime> = {
  value: {
    slabs: [
      { upTo: 250_000, rate: 0 },
      { upTo: 500_000, rate: 5 },
      { upTo: 1_000_000, rate: 20 },
      { upTo: Infinity, rate: 30 },
    ],
    standardDeduction: 50_000,
    rebateUnder87A: 12_500,
    rebateMaxIncome: 500_000,
    cessPercent: 4,
    notes:
      "Old regime, FY 2026-27, below 60. Basic exemption ₹2.5L. " +
      "80C / 80D / HRA / LTA / etc. exemptions available.",
  },
  effectiveFrom: "2026-04-01",
  source: "https://www.incometax.gov.in/iec/foportal/help/individual/return-applicable-1",
  lastVerified: "2026-06-08",
  reviewIntervalDays: 365,
};

export const INCOME_TAX_OLD_REGIME_FY26_27_60_TO_80: RateEntry<IncomeTaxRegime> = {
  value: {
    slabs: [
      { upTo: 300_000, rate: 0 },
      { upTo: 500_000, rate: 5 },
      { upTo: 1_000_000, rate: 20 },
      { upTo: Infinity, rate: 30 },
    ],
    standardDeduction: 50_000,
    rebateUnder87A: 12_500,
    rebateMaxIncome: 500_000,
    cessPercent: 4,
    notes:
      "Old regime, FY 2026-27, senior citizens (60-80). " +
      "Basic exemption ₹3L (₹50k higher than below-60).",
  },
  effectiveFrom: "2026-04-01",
  source: "https://www.incometax.gov.in/iec/foportal/help/individual/return-applicable-1",
  lastVerified: "2026-06-08",
  reviewIntervalDays: 365,
};

export const INCOME_TAX_OLD_REGIME_FY26_27_ABOVE_80: RateEntry<IncomeTaxRegime> = {
  value: {
    slabs: [
      { upTo: 500_000, rate: 0 },
      { upTo: 1_000_000, rate: 20 },
      { upTo: Infinity, rate: 30 },
    ],
    standardDeduction: 50_000,
    rebateUnder87A: 12_500,
    rebateMaxIncome: 500_000,
    cessPercent: 4,
    notes:
      "Old regime, FY 2026-27, super-senior citizens (above 80). " +
      "Basic exemption ₹5L; NO 5% slab (skips straight to 20% above ₹5L).",
  },
  effectiveFrom: "2026-04-01",
  source: "https://www.incometax.gov.in/iec/foportal/help/individual/return-applicable-1",
  lastVerified: "2026-06-08",
  reviewIntervalDays: 365,
};

// Convenience alias for the most-common case (below 60). The IT
// calculator picks the right entry based on the user's selected age band.
export const INCOME_TAX_OLD_REGIME_FY26_27 = INCOME_TAX_OLD_REGIME_FY26_27_BELOW_60;

// ═══════════════════════════════════════════════════════════════════════
//  GST (rates revised by GST Council, no fixed schedule)
// ═══════════════════════════════════════════════════════════════════════

export const GST_SLABS: RateEntry<number[]> = {
  value: [0, 5, 12, 18, 28],
  effectiveFrom: "2017-07-01",
  source: "https://cbic-gst.gov.in/",
  lastVerified: "2026-06-08",
  reviewIntervalDays: 180,
  notes:
    "GST slabs (% applicable to goods/services). 0% for essential goods; " +
    "5% for basics like packaged food, footwear under ₹1000; " +
    "12% for processed foods, mobile phones; " +
    "18% for most goods and services (default slab); " +
    "28% for luxury items, tobacco, autos (+ cess for some).",
};

// ═══════════════════════════════════════════════════════════════════════
//  CAPITAL GAINS TAX (Finance Act 2024 — major reform; Budget 2026 unchanged)
// ═══════════════════════════════════════════════════════════════════════

export const CG_STCG_EQUITY_RATE: RateEntry = {
  value: 20,
  effectiveFrom: "2024-07-23",
  source: "https://www.incometax.gov.in/iec/foportal/",
  lastVerified: "2026-06-08",
  reviewIntervalDays: 365,
  notes:
    "Section 111A: STCG on listed equity / equity MFs at 20% (raised from 15% " +
    "by Finance Act 2024 effective 23 July 2024). Unchanged in Budget 2026.",
};

export const CG_LTCG_EQUITY_RATE: RateEntry = {
  value: 12.5,
  effectiveFrom: "2024-07-23",
  source: "https://www.incometax.gov.in/iec/foportal/",
  lastVerified: "2026-06-08",
  reviewIntervalDays: 365,
  notes:
    "Section 112A: LTCG on listed equity / equity MFs at 12.5% (raised from 10% " +
    "by Finance Act 2024 effective 23 July 2024). No indexation. Unchanged in Budget 2026.",
};

export const CG_LTCG_EQUITY_EXEMPTION: RateEntry = {
  value: 125_000,
  effectiveFrom: "2024-07-23",
  source: "https://www.incometax.gov.in/iec/foportal/",
  lastVerified: "2026-06-08",
  reviewIntervalDays: 365,
  notes:
    "Annual LTCG exemption on listed equity / equity MFs: ₹1,25,000 per FY " +
    "(raised from ₹1,00,000 by Finance Act 2024). Unchanged in Budget 2026.",
};

export const CG_LTCG_OTHER_RATE: RateEntry = {
  value: 12.5,
  effectiveFrom: "2024-07-23",
  source: "https://www.incometax.gov.in/iec/foportal/",
  lastVerified: "2026-06-08",
  reviewIntervalDays: 365,
  notes:
    "Section 112: LTCG on immovable property, gold, unlisted shares at 12.5% " +
    "WITHOUT indexation (Finance Act 2024). Grandfathering option for residents " +
    "on pre-23-Jul-2024 property: 20% with indexation (lower of the two).",
};

// ═══════════════════════════════════════════════════════════════════════
//  STATUTORY CEILINGS (rarely change, but track them)
// ═══════════════════════════════════════════════════════════════════════

export const GRATUITY_CEILING: RateEntry = {
  value: 2_000_000,
  effectiveFrom: "2018-03-29",
  source: "https://labour.gov.in/whatsnew/payment-gratuity-amendment-act-2018",
  lastVerified: "2026-06-08",
  reviewIntervalDays: 365,
  notes:
    "Payment of Gratuity Act, 1972 — tax-exempt gratuity ceiling. " +
    "₹20,00,000 since the 2018 amendment (raised from ₹10L). " +
    "Formula: (15 × last drawn salary × years of service) ÷ 26.",
};

export const PROFESSIONAL_TAX_DEFAULT: RateEntry = {
  value: 2400,
  effectiveFrom: "2009-04-01",
  source: "https://incometaxindia.gov.in/Pages/acts/income-tax-act.aspx",
  lastVerified: "2026-06-08",
  reviewIntervalDays: 365,
  notes:
    "Professional tax: maximum ₹2,500/year (constitutional cap). " +
    "Default ~₹200/month = ₹2,400/year in metros (Karnataka, Maharashtra, etc.). " +
    "Varies by state — see PROFESSIONAL_TAX_BY_STATE for state-wise schedules.",
};

// ═══════════════════════════════════════════════════════════════════════
//  RBI POLICY RATES
// ═══════════════════════════════════════════════════════════════════════

export const RBI_REPO_RATE: RateEntry = {
  value: 5.5,
  effectiveFrom: "2026-04-09",
  source: "https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx",
  lastVerified: "2026-06-08",
  reviewIntervalDays: 60,
  notes:
    "RBI repo rate (key policy rate). Revised by MPC bi-monthly. " +
    "Affects bank FD, home-loan, and personal-loan rates downstream. " +
    "Watch this every MPC meeting (Apr / Jun / Aug / Oct / Dec / Feb).",
};

// ═══════════════════════════════════════════════════════════════════════
//  HRA EXEMPTION RULES (Section 10(13A))
// ═══════════════════════════════════════════════════════════════════════

export const HRA_METROS: RateEntry<readonly string[]> = {
  value: ["Mumbai", "Delhi", "Kolkata", "Chennai"] as const,
  effectiveFrom: "1961-04-01",
  source: "https://www.incometax.gov.in/iec/foportal/help/section-10-13a",
  lastVerified: "2026-06-08",
  reviewIntervalDays: 365,
  notes:
    "Section 10(13A) defines 'metro' for HRA exemption as ONLY these four " +
    "cities. Bangalore, Hyderabad, Pune, Ahmedabad are NOT metros under the " +
    "IT Act despite being large cities. Metro = 50% of basic, non-metro = 40%.",
};

// ═══════════════════════════════════════════════════════════════════════
//  CONSOLIDATED EXPORT — handy for the weekly-review GitHub Action
// ═══════════════════════════════════════════════════════════════════════
//
//  Phase 4's reminder workflow reads ALL_RATES, computes which entries
//  have aged past their `reviewIntervalDays`, and emails Rakesh the list.

export const ALL_RATES = {
  // Small-savings (quarterly)
  ppf: PPF,
  scss: SCSS,
  ssy: SSY,
  nsc: NSC,
  kvp: KVP,
  mis: MIS,
  postOfficeRd: POST_OFFICE_RD,
  postOfficeTd1y: POST_OFFICE_TD_1Y,
  postOfficeTd2y: POST_OFFICE_TD_2Y,
  postOfficeTd3y: POST_OFFICE_TD_3Y,
  postOfficeTd5y: POST_OFFICE_TD_5Y,
  postOfficeSavings: POST_OFFICE_SAVINGS,
  mssc: MSSC,
  // EPF
  epf: EPF,
  epfWageCeiling: EPF_WAGE_CEILING,
  // Income tax (annual)
  incomeTaxNewRegimeFy26_27: INCOME_TAX_NEW_REGIME_FY26_27,
  incomeTaxOldRegimeFy26_27: INCOME_TAX_OLD_REGIME_FY26_27,
  // GST
  gstSlabs: GST_SLABS,
  // Capital gains
  cgStcgEquityRate: CG_STCG_EQUITY_RATE,
  cgLtcgEquityRate: CG_LTCG_EQUITY_RATE,
  cgLtcgEquityExemption: CG_LTCG_EQUITY_EXEMPTION,
  cgLtcgOtherRate: CG_LTCG_OTHER_RATE,
  // Statutory ceilings
  gratuityCeiling: GRATUITY_CEILING,
  professionalTaxDefault: PROFESSIONAL_TAX_DEFAULT,
  // RBI
  rbiRepoRate: RBI_REPO_RATE,
  // HRA
  hraMetros: HRA_METROS,
} as const;

/**
 * Compute days since last verification for a given rate entry.
 * Used by the weekly reminder workflow + by tool-page "freshness"
 * badges (Phase 5 of Project Trust).
 */
export function daysSinceVerified(entry: RateEntry<unknown>, today = new Date()): number {
  const last = new Date(entry.lastVerified);
  return Math.floor((today.getTime() - last.getTime()) / 86_400_000);
}

/**
 * Is a rate entry OVERDUE for review?
 * Returns true once `lastVerified + reviewIntervalDays` is in the past.
 */
export function isOverdue(entry: RateEntry<unknown>, today = new Date()): boolean {
  return daysSinceVerified(entry, today) > entry.reviewIntervalDays;
}

/**
 * "Updated DD MMM YYYY" string for tool footers. Localised to en-IN
 * date order. Matches the trust-badge convention in Phase 5.
 */
export function formatVerifiedDate(entry: RateEntry<unknown>): string {
  const d = new Date(entry.lastVerified);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
