# Project Trust — Accuracy & Auto-Freshness Audit
### sabtools.in — the comprehensive plan to verify every one of our 501 tools and keep them fresh forever

**Author:** Rakesh Seervi · **Drafted:** 2026-06-08 · **Status:** Awaiting Phase 0 approval

---

## 1. Executive Summary

We have **501 tools across 38 categories**. Many of them depend on government-set rates, tax slabs, scheme rules, or live data — and right now, **all of those values are hardcoded inside individual tool files**. There's no single source of truth, no freshness signal, and no system that tells us when a rate has been quietly revised by RBI / IT Department / EPFO / GST Council.

A 90-second grep through the codebase today (8 June 2026) confirmed that **several major tools are showing last year's numbers**:

| Tool | Status | Confirmed code snippet |
|---|---|---|
| Income Tax Calculator | 🔴 1 full FY behind | `"Slabs FY 2025-26 (AY 2026-27)"` — Budget 2026 announced new slabs Feb 1, 2026 |
| PPF Calculator | 🔴 Up to 2 quarters stale | `"PPF rate: 7.1% (Q4 FY 2025-26)"` — revised every quarter |
| EPF Calculator | 🔴 Likely 1 FY behind | `"8.25% p.a. (FY 2025-26)"` — EPFO Board sets rate every March |
| Sukanya Samriddhi | 🟡 Stale | Default `8.2%` — same quarterly cycle |
| Mahila Samman Calculator | 🟡 Scheme closed | Tool live, scheme stopped accepting new accounts 31 Mar 2025 |
| Capital Gains Tax | 🟢 Mostly current | Post-Budget 2024 rates; verify against Budget 2026 |

This project — *Project Trust* — fixes that, and prevents it from ever happening again.

**Three pillars:**
1. **Audit** every one of the 501 tools against 3 real competitors and authoritative sources.
2. **Refactor** every rate-driven tool to read from a single central registry — no more hardcoded numbers.
3. **Sustain** freshness with weekly email reminders to verify each rate, organised by review cycle.

---

## 2. The Problem (Why this is urgent)

A tool that quotes the *wrong tax slab* by 5% on a ₹15 lakh salary is wrong by ~₹7,500. A visitor who notices that will never trust us again, will tell others, and will hand the win to ClearTax / Groww / BankBazaar permanently.

**The single biggest threat to our domain isn't competitors — it's drift.** Numbers go stale silently, no error, no log line. Our SEO grows, our traffic grows, more visitors trust wrong numbers. The risk compounds with every passing month.

This plan **eliminates that risk** structurally, not just one-time.

---

## 3. Scope — Every Single Tool, Tiered

All 501 tools across 38 categories. Each tool gets classified into one of six risk tiers based on what kind of data it depends on.

### Risk tiering legend

| Tier | What it means | Audit treatment |
|---|---|---|
| **L0** | Pure math — formulas don't change (% calculator, BMI, age, area, simple interest) | Spot-check formula correctness once; no rate registry needed |
| **L1** | Indian convention checks (₹ symbol, lakh/crore display, hreflang, Hindi mirror) | Visual audit + side-by-side with English |
| **L2** | Government-rate driven (PPF, EPF, NPS, IT slabs, GST, post-office schemes) | Deep audit + central rates registry + weekly review |
| **L3** | Live data-driven (PIN code lookup, IFSC, currency, IPL, stock prices) | API health check + freshness probe |
| **L4** | Annual-rule driven (HRA metro list, gratuity ceiling, capital-gains rules) | Yearly review cycle tied to Budget calendar |
| **L5** | Lookup-database (city list, IFSC codes, festival dates, holidays) | Database freshness check, version-tag the data |

### Categories grouped by risk

#### 🔴 Highest risk — Finance & Tax (62 tools)

**Finance (42 tools, mostly L2/L4):** EMI calculator, SIP, FD, RD, PPF, NPS, EPF, lumpsum, mutual fund, car loan, home loan, personal loan, education loan, gold loan, FD comparison, salary, in-hand salary, goal-based SIP, retirement, sukanya samriddhi, mahila samman, post office savings (MIS, SCSS, KVP, NSC, RD), step-up SIP, SWP, daily/simple/compound interest, inflation, real return, future value, present value, annuity, lease vs buy, credit-card EMI, prepayment, balance transfer, swp planner, dividend yield, brokerage…

**Tax (20 tools, mostly L4):** Income tax (new/old regime), HRA, TDS, capital gains (LTCG/STCG), stamp duty, gratuity, advance tax, professional tax, tax saving 80C, equity LTCG, debt LTCG, surcharge, marginal relief, perquisites, leave encashment, 80D, 80G, 80E, NPS deduction, set-off & carry forward…

#### 🟡 Medium risk — Indian Utility / Government (40 tools)

**India Guide (10, mostly L3/L5):** PIN code directory, IFSC code lookup, RTO code finder, GST identification number (GSTIN) validator, PAN validator, Aadhaar validator/masked generator…

**Real Estate (8, mostly L2/L4):** Stamp duty, registration fee, EMI affordability, rent vs buy, society maintenance, property tax, builder vs broker, ready reckoner rate…

**Vehicle (6, L2/L3):** Toll calculator, vehicle insurance estimator, EMI for car/bike loans, road tax, RTO fees, mileage calculator…

**Construction (10, L1/L2):** Brick estimator, cement, sand, steel, paint, tile area, roof slope, beam load, plaster — formulas universal but **material rates** vary regionally.

**Electrical (6, L2):** Electricity bill, unit consumption, transformer load, wire size, MCB calculator, solar — **tariffs are state-specific and revised yearly**.

**Business (8, L1/L4):** Profit margin, markup, break-even, ROI, payback period, business loan EMI, depreciation (Companies Act / IT Act methods)…

**Career (7, L4):** Take-home salary, CTC breakdown, gratuity at resignation, notice-period buyout, joining bonus tax…

#### 🟢 Lowest risk — Pure math / Universal (~250 tools)

**Math (10), Science (10), Charts (7), Converters (16), Datetime (9), Utility (8), Cooking (5), Wedding (5), Student (5), Astrology (6), Agriculture (6), Education (5), Shopping (5), Legal (5), Exam (8), Fun (20)…** — formulas don't change, no rate dependency.

#### Special categories

- **AI (50 tools):** Output quality depends on Claude/external models; audit means checking the prompt + sample outputs.
- **Image (45 tools), PDF (8):** 100% client-side; no data accuracy concerns, only feature/UX bugs.
- **Developer (22):** Spec compliance (JSON validator, regex tester, etc.) — audit against language/spec sources.
- **SEO (19):** Tool-specific; audit against real signals.
- **Social, WhatsApp, Text, CSS, Security:** Mostly client-side utilities, formula-free.

### Full risk-register output

I'll produce **`src/data/tool-risk-register.json`** in Phase 1 — every tool tagged with:

```json
{
  "slug": "ppf-calculator",
  "name": "PPF Calculator",
  "category": "finance",
  "tier": "L2",
  "rateKeys": ["ppf"],
  "auditStatus": "pending",
  "lastAudit": null,
  "competitors": [
    "https://groww.in/calculators/ppf-calculator",
    "https://cleartax.in/tools/ppf-calculator",
    "https://www.bankbazaar.com/ppf-calculator.html"
  ],
  "nextReview": "2026-07-01"
}
```

---

## 4. The Six Phases

### **Phase 0 — Emergency fixes (this week)**
> ⏸️ Awaiting your go-ahead, per your reply

Fix the confirmed-stale tools today, ahead of the systematic work:
- Income Tax: update to FY 2026-27 slabs (Budget 2026 source)
- PPF: current quarter's rate
- EPF: FY 2026-27 rate
- SSY, SCSS, KVP, NSC, MIS: current quarter
- Mahila Samman: closure banner
- Capital Gains: verify post-Budget-2026 if any change

**Each commit includes the official source URL it was verified against.** Deliverable: 10-15 fixes, all cited.

### **Phase 1 — Inventory + Risk Register (week 1, ~3 days)**
Output:
- `src/data/tool-risk-register.json` — every one of 501 tools tagged with tier, rate dependencies, competitor URLs, audit status.
- Audit work-order: ordered list of tools to verify in Phase 2.

### **Phase 2 — Deep Audit of all 501 tools, against competitors (weeks 2-6)**
Per your scope choice. For every single tool:

1. **Pick 3 representative inputs** (small / medium / large).
2. **Run on our tool** → capture result.
3. **Run on 3 competitor tools** with the same inputs:
   - Finance/Tax → ClearTax, Groww, BankBazaar
   - General calc → Calculator.net, RapidTables, OmniCalculator
   - India-specific lookups → official Govt source (eg. India Post for pincode)
4. **Compute deviation.** Pass criteria: < 1% for calculator tools, exact match for lookup tools.
5. **Document everything** in `AUDIT_REPORT.md` (per tool entry):
   ```
   ## EMI Calculator
   - Input: ₹50L / 8.5% / 20yr
   - Our result: ₹43,391
   - ClearTax: ₹43,391 ✓
   - Groww: ₹43,391 ✓
   - BankBazaar: ₹43,392 (₹1 rounding diff)
   - Deviation: 0.002% ✓ PASS
   - Verified: 2026-06-10, source: live runs
   ```
6. **Fix immediately** on any > 1% deviation. Cite the source.

**Approach:** Batched in groups of ~20 tools, parallelised across categories. Realistic: ~5 weeks for all 501.

**Output:** A public `/audit` page on sabtools.in showing every result. This becomes a **massive trust + SEO asset**.

### **Phase 3 — Central Rates Registry (weeks 3-4, in parallel with audit)**

Build `src/data/rates.ts`:

```typescript
/**
 * Central rates registry — the SINGLE source of truth for every
 * government rate / scheme parameter / regulatory value on sabtools.in.
 *
 * Every L2 / L4 tool imports from here. No more hardcoded numbers in
 * individual tool files. One update here → instantly reflected in every
 * downstream tool.
 *
 * Each entry carries: current value, effective_from date, official
 * source URL, last verified date, next scheduled review date. The
 * weekly-reminder system reads these to know which rates are due for
 * a fresh check.
 */
export interface RateEntry<T = number> {
  value: T;
  effectiveFrom: string;     // ISO date — when this rate kicked in
  source: string;            // Official URL (RBI, IT Dept, EPFO, etc.)
  lastVerified: string;      // ISO date — when we last confirmed
  reviewIntervalDays: number;// How often to re-verify
  notes?: string;
}

export const RATES = {
  // Small-savings schemes (revised quarterly by GOI)
  ppf:  { value: 7.1, effectiveFrom: "2026-04-01", source: "https://nsiindia.gov.in/...", lastVerified: "2026-04-02", reviewIntervalDays: 90 },
  scss: { value: 8.2, /* ... */ },
  ssy:  { value: 8.2, /* ... */ },
  kvp:  { value: 7.5, /* ... */ },
  nsc:  { value: 7.7, /* ... */ },
  mis:  { value: 7.4, /* ... */ },
  poRd: { value: 6.7, /* ... */ },
  poTd1y: { value: 6.9, /* ... */ },
  poTd5y: { value: 7.5, /* ... */ },

  // Statutory rates
  epf:  { value: 8.25, effectiveFrom: "2026-04-01", source: "https://epfindia.gov.in/...", lastVerified: "2026-04-15", reviewIntervalDays: 365 },
  nps:  { value: null, /* market-linked, no fixed rate */ },

  // Income tax slabs (revised annually with Budget)
  incomeTax_NewRegime_FY26_27: {
    slabs: [
      { upTo: 400_000, rate: 0 },
      { upTo: 800_000, rate: 5 },
      { upTo: 1_200_000, rate: 10 },
      // ... from Budget 2026
    ],
    standardDeduction: 75_000,
    rebateUnder87A: 60_000,
    surcharge: [
      { upTo: 5_000_000, rate: 0 },
      // ...
    ],
    cess: 4,
    effectiveFrom: "2026-04-01",
    source: "https://incometax.gov.in/iec/foportal/help/individual/return-applicable",
    lastVerified: "2026-04-01",
    reviewIntervalDays: 365,
  },
  incomeTax_OldRegime_FY26_27: { /* ... */ },

  // GST slabs
  gst: { slabs: [0, 5, 12, 18, 28], lastVerified: "2026-04-01", reviewIntervalDays: 180 },

  // Capital gains
  ltcg_equity: { rate: 12.5, exemption: 125_000, effectiveFrom: "2024-07-23", /* ... */ },
  stcg_equity: { rate: 20, effectiveFrom: "2024-07-23", /* ... */ },

  // Stamp duty (state-wise — separate sub-registry)
  stampDuty: STAMP_DUTY_BY_STATE,

  // Statutory ceilings
  gratuityCeiling: { value: 2_000_000, since: "2018-03-29", /* ... */ },
  epfWageCeiling: { value: 15_000, /* monthly */ },
  professionalTaxByState: PT_BY_STATE,

  // Bank / Repo
  repoRate: { value: 5.5, effectiveFrom: "2026-04-09", source: "https://rbi.org.in/...", lastVerified: "2026-04-10", reviewIntervalDays: 60 },

  // HRA metro list (changes rarely)
  hraMetros: { value: ["Mumbai", "Delhi", "Kolkata", "Chennai"], lastVerified: "2026-04-01", reviewIntervalDays: 365 },

  // ... ~60-80 entries total
} as const;
```

**Then refactor**:
- `PpfCalculator.tsx` reads `RATES.ppf.value` instead of hardcoded `7.1`.
- `IncomeTaxCalculator.tsx` reads `RATES.incomeTax_NewRegime_FY26_27.slabs` instead of inline arrays.
- Etc.

**~50 tools refactored** to import from `rates.ts`. One central PR per category, easy to review.

### **Phase 4 — Weekly review reminder system (week 5)** ← your chosen approach

A scheduled **GitHub Action** that runs every Monday at 9:00 IST.

It reads `src/data/rates.ts`, computes which rates are **due for review** (where `lastVerified + reviewIntervalDays < today`), and sends you an email:

```
Subject: [SabTools Rate Review] 4 rates due this week

📋 4 rates need verification this week:

1. PPF rate
   Current value: 7.1%
   Last verified: 2026-04-02 (95 days ago)
   Review interval: 90 days (quarterly)
   ✅ Verify here → https://nsiindia.gov.in/interest-rate
   📝 Reply "PPF: 7.1 confirmed" or "PPF: 7.3 new" to update.

2. SSY rate
   ...

3. Repo rate
   ...

4. Stamp duty — Karnataka
   ...

After verification, reply to this email with the values. Claude (in
the GitHub workflow) will read your reply, open a PR with the diff,
and tag you to merge in 1 click.

Or update src/data/rates.ts manually — both work.
```

**The user-side workflow:**
- Open email Monday morning (~5 min/week)
- Click each link, glance at the rate, reply with confirmation
- Done. No tool stays stale.

**Cost:** Free — GitHub Actions free tier + GitHub-issued email (or SendGrid free tier).

**Optional automation layer** for later: a reply-to-update flow where Claude reads your email reply and opens the PR for you. Saves another 5 minutes/week. Cost: ~₹100/month Claude Haiku.

### **Phase 5 — User-facing trust signals (week 7)**

On every L2 / L3 / L4 tool, a footer card:

```
┌────────────────────────────────────────────────────┐
│  ✅ Rates updated: 2 July 2026                      │
│     Source: nsiindia.gov.in (GOI quarterly)        │
│     Next scheduled review: 1 Oct 2026              │
│     Verified by SabTools Rate Audit (weekly)       │
└────────────────────────────────────────────────────┘
```

When `lastVerified > reviewIntervalDays + 14`, show amber: *"⚠️ This rate is overdue review — verify on the official source before relying on this number."*

When `> reviewIntervalDays + 60`, show red + add a "Report inaccuracy" link. **The visible date stamp is the single strongest trust signal we can possibly add** — competitors don't do it.

### **Phase 6 — Public Audit Page (week 8)**

`https://sabtools.in/audit` — a public, indexable page listing:
- All 501 tools, their tier, last audit date, last result-verified date
- Deviation vs competitors (e.g. "EMI calc: 0.002% vs ClearTax/Groww/BankBazaar")
- Last rate refresh per category
- Open methodology (how we test, what we cite, what we don't cover)

This page is **gold for SEO** ("most transparent calculator audit in India"), gold for **backlinks** (writers love linking to honest methodology), and a **direct trust signal** to a worried visitor.

---

## 5. Timeline

| Week | Work |
|---|---|
| **W0 (now)** | Phase 0 emergency fixes — *awaiting your go* |
| **W1** | Phase 1 — Inventory + risk register |
| **W2-3** | Phase 2 audit starts (categories: Finance, Tax) + Phase 3 registry build (parallel) |
| **W3-4** | Phase 2 audit (India Guide, Real Estate, Business, Career) + Phase 3 wraps |
| **W4-5** | Phase 2 audit (Math, Science, Converters, Construction, Electrical) + Phase 4 reminder system |
| **W5-6** | Phase 2 audit (AI, Image, PDF, Developer, SEO, Misc) — long tail |
| **W7** | Phase 5 — user-facing trust signals shipped |
| **W8** | Phase 6 — public /audit page live + final review |

**~8 weeks total** for the complete delivery.

I will publish weekly progress updates in `AUDIT_PROGRESS.md` so you can see exactly which tools have been verified each week.

---

## 6. Costs

| Item | Cost |
|---|---|
| GitHub Actions (rate-reminder workflow) | **Free** (well within free tier) |
| Email service for weekly reminders (SendGrid / GitHub-issued / Gmail SMTP) | **Free** |
| Domain / hosting / Vercel | No change |
| Claude API for optional reply-to-update layer | ~**₹100 / month** (Haiku, opt-in) |
| My time (Claude) — all phases | No cost to you |

**Total ongoing: ₹0** (or ₹100/month if you want the reply-to-update auto-PR layer later)

---

## 7. Success Metrics

How we'll know this worked:

1. **Zero stale rates** in any tool after Phase 3 (every L2/L4 number reads from `rates.ts`).
2. **All 501 tools verified** against ≥ 3 competitors, deviation < 1% — published in `/audit`.
3. **Weekly review compliance**: every rate verified within its `reviewIntervalDays` window.
4. **Visible trust signal** on every rate-driven tool's footer.
5. **Public audit page** live and indexed.

**Bonus SEO outcome:** an indexable methodology page is a magnet for "how trustworthy is X tool" queries — likely brings in 2-5k organic visits/month over time.

---

## 8. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Competitor sites have different methodology (e.g. compounding frequency) | Document the methodology difference in audit notes; only flag genuine errors |
| Government source URL changes / 404s | Reminder workflow detects 404 and emails you — manual fallback every time |
| Rate changes between Monday emails (e.g. unscheduled RBI move) | `reviewIntervalDays` set conservatively (60d for repo rate); add a public form for visitors to report stale rates |
| 5-week audit window is long; rates change during audit | Phase 0 fixes the worst now; Phase 3 registry built parallel so we update once, not per-tool |
| ChatGPT / Claude-generated audit data could itself drift | All competitor comparisons are real live runs, not LLM estimates. Output is reproducible. |

---

## 9. Phase 0 — Ready to start today

The moment you reply "go", I'll begin Phase 0:

- Verify the current FY 2026-27 IT slabs from incometax.gov.in/budget
- Verify the current PPF / SSY / SCSS / KVP / NSC / MIS / RD rates from nsiindia.gov.in
- Verify the current EPF rate from epfindia.gov.in
- Add a clear "scheme closed" banner to Mahila Samman Calculator
- Verify capital-gains rules vs Budget 2026 changes (if any)
- Open one commit per fix, each citing the official source URL
- Push to production within ~4-6 hours

That's ~10-15 of our most-trafficked tools quietly going from *wrong* to *right* today, before we even begin the larger plan.

---

## 10. What I need from you (final asks)

1. **Approval to start Phase 0 now** — every day we wait, more visitors see stale numbers.
2. **Email address** to use for the weekly review reminders (sabtools@ / your personal address — your call).
3. **Permission** to spend up to ₹100/month on the optional reply-to-update layer in Phase 4 (skip if you'd rather click 4 links per Monday morning manually).

That's it. Once Phase 0 ships, the systematic work begins.

---

*This document lives at `PROJECT_TRUST_PLAN.md` in the sabtools repo so you can re-read it any time. I'll keep `AUDIT_PROGRESS.md` updated weekly with the actual work completed.*
