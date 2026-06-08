#!/usr/bin/env node
/**
 * scripts/build-risk-register.mjs
 *
 * Project Trust · Phase 1 — Tool Risk Register generator.
 *
 * Reads src/lib/tools.ts, classifies every one of the 501 tools by
 * risk tier (L0-L5), attaches rate dependencies + competitor URLs +
 * audit status, and writes src/data/tool-risk-register.json.
 *
 * Re-run whenever:
 *   - A new tool is added to tools.ts
 *   - A tier needs adjusting (edit TIER_OVERRIDES below)
 *   - Audit status changes (the script preserves prior auditStatus
 *     for slugs already in the existing JSON)
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const TOOLS_PATH = join(__dirname, "..", "src", "lib", "tools.ts");
const REGISTER_PATH = join(__dirname, "..", "src", "data", "tool-risk-register.json");

/**
 * Risk tier model. Drives audit treatment + freshness expectations.
 *
 *   L0  Pure math — formulas don't change (% calc, BMI, age, simple int).
 *       No rate registry needed. Spot-check formula correctness once.
 *
 *   L1  Indian-convention checks (lakh/crore, ₹ symbol, hreflang).
 *       Quick visual audit per tool.
 *
 *   L2  Government-rate driven (PPF, EPF, NPS, IT slabs, GST, post
 *       office, stamp duty). Deep audit + central rates registry +
 *       weekly review.
 *
 *   L3  Live data-driven (PIN code, IFSC, currency, stock/IPL data).
 *       API health + freshness probe.
 *
 *   L4  Annual-rule driven (HRA metro list, gratuity ceiling, capital
 *       gains rules). Yearly review tied to Budget calendar.
 *
 *   L5  Lookup database (city list, IFSC codes, festival dates).
 *       Database freshness check + version-tag the data.
 */
const DEFAULT_TIER_BY_CATEGORY = {
  finance: "L2", // Most are rate / formula driven — split via overrides
  tax: "L4", // Tax rules revise annually with Budget
  business: "L0", // Profit, margin, ROI — pure math
  career: "L4", // Salary / gratuity — tax-slab dependent
  realestate: "L2", // Stamp duty / registration / EMI — rate-sensitive
  vehicle: "L2", // Toll / road-tax — gov-set
  electrical: "L2", // State tariffs
  construction: "L1", // Material formulas + regional rate notes
  agriculture: "L1", // Seasonal / regional
  indiaguide: "L3", // PIN, IFSC, RTO — live lookups
  legal: "L5", // Templates + lookup
  health: "L1", // BMI, calorie — formulas, Indian guidelines
  // Pure-math / utility-style categories all default L0
  math: "L0",
  science: "L0",
  charts: "L0",
  converters: "L0",
  datetime: "L0",
  utility: "L0",
  ai: "L0",
  image: "L0",
  pdf: "L0",
  developer: "L0",
  security: "L0",
  data: "L0",
  css: "L0",
  text: "L0",
  seo: "L0",
  fun: "L0",
  social: "L0",
  whatsapp: "L0",
  sports: "L0",
  cooking: "L1",
  wedding: "L1",
  astrology: "L1",
  student: "L0",
  shopping: "L0",
  education: "L0",
  exam: "L0",
};

/**
 * Per-slug overrides where the category default isn't quite right.
 * Anything not listed inherits the category default.
 */
const TIER_OVERRIDES = {
  // ── Finance: most use government rates (L2) but some are pure math
  "emi-calculator": "L0", // standard amortisation formula
  "simple-interest-calculator": "L0",
  "compound-interest-calculator": "L0",
  "daily-interest-calculator": "L0",
  "sip-calculator": "L0",
  "lumpsum-calculator": "L0",
  "step-up-sip-calculator": "L0",
  "swp-calculator": "L0",
  "future-value-calculator": "L0",
  "present-value-calculator": "L0",
  "annuity-calculator": "L0",
  "credit-card-emi-calculator": "L0",
  "loan-prepayment-calculator": "L0",
  "balance-transfer-calculator": "L0",
  "rent-vs-buy-calculator": "L0",
  "inflation-calculator": "L0",
  "real-return-calculator": "L0",
  "lease-vs-buy-calculator": "L0",
  "brokerage-calculator": "L0",
  "margin-calculator": "L0",

  // Finance — explicitly L2 (government rates)
  "ppf-calculator": "L2",
  "epf-calculator": "L2",
  "sukanya-samriddhi-calculator": "L2",
  "post-office-savings-calculator": "L2",
  "fd-calculator": "L2", // bank rates change
  "rd-calculator": "L2",
  "fd-comparison": "L2",
  "nps-calculator": "L2",
  "mahila-samman-calculator": "L2", // closed scheme
  "senior-citizen-savings-calculator": "L2",
  "kisan-vikas-patra-calculator": "L2",
  "national-savings-certificate-calculator": "L2",
  "post-office-monthly-income-scheme-calculator": "L2",

  // Tax — every one is L4
  "income-tax-calculator": "L4",
  "in-hand-salary-calculator": "L4",
  "hra-calculator": "L4",
  "tds-calculator": "L4",
  "capital-gains-tax-calculator": "L4",
  "gst-calculator": "L4",
  "stamp-duty-calculator": "L2", // state-specific, more frequent
  "gratuity-calculator": "L4",
  "advance-tax-calculator": "L4",
  "professional-tax-calculator": "L4",

  // India Guide
  "pin-code-finder": "L3",
  "indian-pin-code-directory": "L3",
  "ifsc-code-lookup": "L3",
  "rto-code-finder": "L5",
  "pan-validator": "L0",
  "aadhaar-validator": "L0",
  "aadhaar-masked-generator": "L0",
  "gstin-validator": "L0",

  // Realestate state-specific stamp duty
  "stamp-duty-by-state": "L2",
  "property-tax-calculator": "L2",

  // Vehicle
  "toll-calculator": "L2",
  "road-tax-calculator": "L2",
  "lpg-subsidy-calculator": "L2",

  // Electrical state tariffs
  "electricity-bill-calculator": "L2",
  "electricity-rate-finder": "L2",
};

/**
 * Authoritative competitor / reference URLs by category — used in
 * Phase 2 audit to compare our result vs theirs.
 */
const COMPETITORS_BY_CATEGORY = {
  finance: [
    "https://groww.in/calculators",
    "https://cleartax.in/calculators",
    "https://www.bankbazaar.com/calculators.html",
  ],
  tax: [
    "https://cleartax.in/paytax/taxcalculator",
    "https://www.incometax.gov.in/iec/foportal/",
    "https://www.bankbazaar.com/calculators.html",
  ],
  business: [
    "https://www.calculator.net/business-calculator.html",
    "https://www.omnicalculator.com/finance",
  ],
  career: [
    "https://www.ambitionbox.com/salaries/india-salary-calculator",
    "https://www.naukri.com/salary-calculator",
  ],
  realestate: [
    "https://www.99acres.com/property-tools",
    "https://housing.com/calculators",
  ],
  vehicle: [
    "https://parivahan.gov.in/",
    "https://tis.nhai.gov.in/tollplazasonmap",
  ],
  electrical: [
    "https://serc.kerala.gov.in/",
    "https://www.mahadiscom.in/",
  ],
  construction: [
    "https://www.civilconcept.com/calculators",
    "https://civilread.com/calculators/",
  ],
  agriculture: [
    "https://farmer.gov.in/",
    "https://krishijagran.com/",
  ],
  indiaguide: [
    "https://www.indiapost.gov.in/",
    "https://www.rbi.org.in/",
  ],
  legal: [
    "https://indiakanoon.org/",
  ],
  health: [
    "https://www.calculator.net/bmi-calculator.html",
    "https://www.omnicalculator.com/health",
  ],
  math: [
    "https://www.calculator.net/math.html",
    "https://www.rapidtables.com/calc/math/",
  ],
  science: [
    "https://www.calculator.net/science.html",
  ],
  charts: [],
  converters: [
    "https://www.calculator.net/conversion-calculator.html",
    "https://www.rapidtables.com/convert/",
  ],
  datetime: [
    "https://www.calculator.net/date-calculator.html",
    "https://www.timeanddate.com/date/calculator.html",
  ],
  utility: [
    "https://www.calculator.net/",
  ],
  ai: [],
  image: [],
  pdf: [],
  developer: [],
  security: [],
  data: [],
  css: [],
  text: [],
  seo: [
    "https://pagespeed.web.dev/",
    "https://search.google.com/test/rich-results",
  ],
  fun: [],
  social: [],
  whatsapp: [],
  sports: [
    "https://www.cricbuzz.com/",
    "https://www.espncricinfo.com/",
  ],
  cooking: [],
  wedding: [],
  astrology: [],
  student: [],
  shopping: [],
  education: [],
  exam: [],
};

// Rate dependencies — which entries in rates.ts each tool relies on.
const RATE_DEPS = {
  "ppf-calculator": ["ppf"],
  "epf-calculator": ["epf"],
  "sukanya-samriddhi-calculator": ["ssy"],
  "post-office-savings-calculator": [
    "nsc", "kvp", "scss", "mis", "postOfficeRd", "postOfficeTd1y",
    "postOfficeTd2y", "postOfficeTd3y", "postOfficeTd5y", "postOfficeSavings",
  ],
  "mahila-samman-calculator": ["mssc"],
  "income-tax-calculator": [
    "incomeTaxNewRegimeFy26_27", "incomeTaxOldRegimeFy26_27",
  ],
  "in-hand-salary-calculator": [
    "incomeTaxNewRegimeFy26_27", "incomeTaxOldRegimeFy26_27",
  ],
  "gst-calculator": ["gstSlabs"],
  "capital-gains-tax-calculator": [
    "cgStcgEquityRate", "cgLtcgEquityRate", "cgLtcgEquityExemption", "cgLtcgOtherRate",
  ],
  "gratuity-calculator": ["gratuityCeiling"],
  "hra-calculator": ["hraMetros", "incomeTaxOldRegimeFy26_27"],
};

// Parse tools.ts via regex — same shape the blogger-automation pipeline uses.
const src = readFileSync(TOOLS_PATH, "utf8");
const toolRe = /name:\s*"([^"]+)"\s*,\s*slug:\s*"([^"]+)"[^}]*?category:\s*"([^"]+)"/g;
const tools = [];
let m;
while ((m = toolRe.exec(src)) !== null) {
  tools.push({ name: m[1], slug: m[2], category: m[3] });
}

// Preserve auditStatus from any prior register.
let prior = {};
if (existsSync(REGISTER_PATH)) {
  try {
    const prev = JSON.parse(readFileSync(REGISTER_PATH, "utf8"));
    for (const e of prev.tools || []) prior[e.slug] = e;
  } catch {
    /* ignore — first run */
  }
}

const today = new Date().toISOString().slice(0, 10);

const entries = tools.map((t) => {
  const tier =
    TIER_OVERRIDES[t.slug] ||
    DEFAULT_TIER_BY_CATEGORY[t.category] ||
    "L0";
  const competitors = COMPETITORS_BY_CATEGORY[t.category] || [];
  const rateDeps = RATE_DEPS[t.slug] || [];
  const previous = prior[t.slug] || {};
  return {
    slug: t.slug,
    name: t.name,
    category: t.category,
    tier,
    rateDeps,
    competitors,
    auditStatus: previous.auditStatus || "pending",
    lastAudit: previous.lastAudit || null,
    deviationVsCompetitors: previous.deviationVsCompetitors || null,
    notes: previous.notes || null,
  };
});

// Tier counts for the summary
const tierCounts = entries.reduce((acc, e) => {
  acc[e.tier] = (acc[e.tier] || 0) + 1;
  return acc;
}, {});

const register = {
  generatedAt: today,
  totalTools: entries.length,
  tierCounts,
  notes:
    "Project Trust Phase 1 — risk register for every sabtools.in tool. " +
    "Each entry is tagged with a tier (L0-L5) that drives its audit " +
    "treatment in Phase 2. rateDeps lists the keys this tool consumes " +
    "from src/data/rates.ts. competitors lists the URLs Phase 2 audit " +
    "will compare our result against. Re-run scripts/build-risk-register.mjs " +
    "to rebuild this file after editing tier overrides.",
  tools: entries.sort((a, b) => {
    if (a.tier !== b.tier) return a.tier.localeCompare(b.tier);
    if (a.category !== b.category) return a.category.localeCompare(b.category);
    return a.slug.localeCompare(b.slug);
  }),
};

writeFileSync(REGISTER_PATH, JSON.stringify(register, null, 2) + "\n");

console.log(`✅ Wrote ${REGISTER_PATH}`);
console.log(`   ${entries.length} tools across ${Object.keys(tierCounts).length} tiers`);
for (const [tier, count] of Object.entries(tierCounts).sort()) {
  console.log(`   ${tier}: ${count} tools`);
}
