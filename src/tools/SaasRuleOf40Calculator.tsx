"use client";
import { useMemo, useState } from "react";

/**
 * SaaS Rule of 40 Calculator — the single most-cited public-SaaS
 * health metric.
 *
 *   Rule of 40 = YoY Revenue Growth % + Profit Margin %
 *
 * Originally popularised by Brad Feld (2015) and adopted by Bessemer
 * Venture Partners' Cloud Index, the rule says a healthy SaaS company
 * should have the SUM of growth + profitability ≥ 40%. A 60%-growth,
 * 0%-margin company passes; so does a 10%-growth, 30%-margin company.
 * The trade-off is the point — high-growth startups are forgiven low
 * margins while mature SaaS is forgiven slower growth.
 *
 * This calculator supports three margin flavours (EBITDA, FCF, Net)
 * because they're each cited by different audiences:
 *
 *   - EBITDA margin: investor / public-market default
 *   - FCF margin: more conservative — what's actually in the bank
 *   - Net margin: GAAP profit — strictest reading
 *
 * Verdict bands are calibrated against the Bessemer Cloud Index
 * 2023-26 cohort (≥ 50 public SaaS companies, quarterly published).
 */

type MarginType = "ebitda" | "fcf" | "net";

const MARGIN_LABELS: Record<MarginType, { label: string; hint: string }> = {
  ebitda: {
    label: "EBITDA Margin",
    hint: "(Earnings before interest, tax, depreciation & amortisation) ÷ Revenue. Public-market default.",
  },
  fcf: {
    label: "FCF Margin",
    hint: "Free cash flow ÷ Revenue — operating cash flow minus capex. Most conservative.",
  },
  net: {
    label: "Net Margin",
    hint: "GAAP Net income ÷ Revenue. Strictest reading — includes SBC and taxes.",
  },
};

interface Inputs {
  growth: number;
  margin: number;
}

interface Result {
  score: number;
  growth: number;
  margin: number;
  verdict: "danger" | "below" | "healthy" | "strong" | "elite";
  verdictTitle: string;
  verdictBody: string;
  classification: string; // "Growth-led" / "Balanced" / "Profit-led"
}

const VERDICTS: Record<Result["verdict"], { color: string; bg: string; border: string; emoji: string }> = {
  danger: { color: "text-red-700", bg: "bg-red-50", border: "border-red-200", emoji: "🚨" },
  below: { color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200", emoji: "⚠️" },
  healthy: { color: "text-green-700", bg: "bg-green-50", border: "border-green-200", emoji: "✅" },
  strong: { color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200", emoji: "🚀" },
  elite: { color: "text-purple-700", bg: "bg-purple-50", border: "border-purple-200", emoji: "🏆" },
};

function compute(i: Inputs): Result | null {
  if (!isFinite(i.growth) || !isFinite(i.margin)) return null;
  const score = i.growth + i.margin;
  let verdict: Result["verdict"];
  let verdictTitle = "";
  let verdictBody = "";
  if (score < 20) {
    verdict = "danger";
    verdictTitle = "Far below benchmark — existential pressure";
    verdictBody =
      "Below 20 is where public SaaS companies usually only sit briefly, before they cut costs aggressively, raise emergency capital, or get acquired. Either growth needs to accelerate meaningfully or you need to drive margin expansion — a 30% margin shift takes 4-6 quarters even with aggressive cost cuts.";
  } else if (score < 40) {
    verdict = "below";
    verdictTitle = "Below the 40 benchmark";
    verdictBody =
      "Below 40 means investors will mark you down vs peers. Public SaaS at this score trades at ~3-5× ARR vs ~8-15× for Rule-of-40 passers. For a private startup, this score still raises during a hot market but at lower-than-peer multiples. Top two interventions: accelerate growth via new channel/segment OR cut spend on the lowest-ROI 20% of the team and tooling.";
  } else if (score < 60) {
    verdict = "healthy";
    verdictTitle = "Healthy — passes the Rule of 40";
    verdictBody =
      "Rule of 40 passing. This is where ~30% of the Bessemer Cloud Index sits and it earns a healthy public multiple. Next milestone: push toward 60 — every additional point of score is worth roughly 0.5× ARR in your private-market valuation at Series B+. Strong-growth bias is more rewarded than profit improvement at this level.";
  } else if (score < 80) {
    verdict = "strong";
    verdictTitle = "Strong — top quartile of public SaaS";
    verdictBody =
      "Above 60 is roughly top quartile of the Bessemer Cloud Index. You're commanding premium multiples on private secondary and would IPO at strong valuations. Don't ease off — companies that drift from 60+ to 40-60 see immediate multiple compression.";
  } else {
    verdict = "elite";
    verdictTitle = "Elite — top decile (Snowflake / CrowdStrike / Datadog tier)";
    verdictBody =
      "Above 80 is the top decile — Snowflake, CrowdStrike, Datadog, Cloudflare zone. This is where SaaS gets its 15-30× ARR public multiples. The next constraint is usually TAM ceiling rather than execution: how big can the addressable market actually get?";
  }

  // Classification by where the score comes from.
  let classification = "Balanced (growth + margin)";
  if (i.growth >= i.margin * 2) classification = "Growth-led (typical for Series A–C SaaS)";
  else if (i.margin >= i.growth * 2) classification = "Profit-led (typical for mature / public SaaS)";

  return { score, growth: i.growth, margin: i.margin, verdict, verdictTitle, verdictBody, classification };
}

export default function SaasRuleOf40Calculator() {
  const [growth, setGrowth] = useState("40");
  const [margin, setMargin] = useState("10");
  const [marginType, setMarginType] = useState<MarginType>("ebitda");

  // Optional auto-compute paths
  const [currentArr, setCurrentArr] = useState("");
  const [lastYearArr, setLastYearArr] = useState("");
  const [revenue, setRevenue] = useState("");
  const [profit, setProfit] = useState("");

  // If user fills the auto-compute inputs, override the manual values
  const effectiveGrowth = useMemo(() => {
    const c = parseFloat(currentArr);
    const l = parseFloat(lastYearArr);
    if (c > 0 && l > 0) return ((c - l) / l) * 100;
    return parseFloat(growth) || 0;
  }, [currentArr, lastYearArr, growth]);

  const effectiveMargin = useMemo(() => {
    const r = parseFloat(revenue);
    const p = parseFloat(profit);
    if (r > 0) return (p / r) * 100;
    return parseFloat(margin) || 0;
  }, [revenue, profit, margin]);

  const result = useMemo(
    () => compute({ growth: effectiveGrowth, margin: effectiveMargin }),
    [effectiveGrowth, effectiveMargin]
  );

  const v = result ? VERDICTS[result.verdict] : VERDICTS.healthy;

  return (
    <div className="space-y-6">
      {/* Manual inputs */}
      <div className="result-card">
        <h3 className="font-bold text-gray-800 mb-1">📊 Manual entry</h3>
        <p className="text-xs text-gray-500 mb-4">
          Enter YoY revenue growth and the margin you're tracking. Or scroll down to compute
          both from ARR + financials automatically.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">
              YoY Revenue Growth (%)
            </label>
            <input
              type="number"
              inputMode="decimal"
              step={0.1}
              value={growth}
              onChange={(e) => setGrowth(e.target.value)}
              className="calc-input"
              placeholder="e.g. 40"
              disabled={!!(parseFloat(currentArr) && parseFloat(lastYearArr))}
            />
            <p className="text-[11px] text-gray-400 mt-1">
              Current period ARR vs same period 1 year ago.
            </p>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">
              {MARGIN_LABELS[marginType].label} (%)
            </label>
            <input
              type="number"
              inputMode="decimal"
              step={0.1}
              value={margin}
              onChange={(e) => setMargin(e.target.value)}
              className="calc-input"
              placeholder="e.g. 10"
              disabled={!!(parseFloat(revenue) && parseFloat(profit) !== 0)}
            />
            <p className="text-[11px] text-gray-400 mt-1">
              Negative is fine (e.g. -20). High-growth startups often have negative margin.
            </p>
          </div>
        </div>
        <div className="mt-3">
          <label className="text-xs font-semibold text-gray-600 block mb-1">Margin type</label>
          <div className="flex gap-2 flex-wrap">
            {(Object.keys(MARGIN_LABELS) as MarginType[]).map((m) => (
              <button
                key={m}
                onClick={() => setMarginType(m)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                  marginType === m
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-gray-700 border-gray-200 hover:border-indigo-300"
                }`}
              >
                {MARGIN_LABELS[m].label}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-gray-400 mt-1">
            {MARGIN_LABELS[marginType].hint}
          </p>
        </div>
      </div>

      {/* Optional auto-compute */}
      <div className="result-card">
        <h3 className="font-bold text-gray-800 mb-1">⚡ Auto-compute (optional)</h3>
        <p className="text-xs text-gray-500 mb-4">
          Provide your ARR / financials and we'll compute growth and margin for you. These
          override the manual values above when filled.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">
              Last year ARR (₹ or $)
            </label>
            <input
              type="number"
              inputMode="numeric"
              value={lastYearArr}
              onChange={(e) => setLastYearArr(e.target.value)}
              className="calc-input"
              placeholder="e.g. 50000000"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">
              Current ARR (₹ or $)
            </label>
            <input
              type="number"
              inputMode="numeric"
              value={currentArr}
              onChange={(e) => setCurrentArr(e.target.value)}
              className="calc-input"
              placeholder="e.g. 75000000"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">
              Annual revenue (₹ or $)
            </label>
            <input
              type="number"
              inputMode="numeric"
              value={revenue}
              onChange={(e) => setRevenue(e.target.value)}
              className="calc-input"
              placeholder="e.g. 70000000"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">
              {MARGIN_LABELS[marginType].label} ₹ ($)
            </label>
            <input
              type="number"
              inputMode="numeric"
              value={profit}
              onChange={(e) => setProfit(e.target.value)}
              className="calc-input"
              placeholder="e.g. 7000000 (positive) or -14000000 (negative)"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              Use a negative number for losses (e.g., -14000000 for -₹1.4 Cr loss).
            </p>
          </div>
        </div>
      </div>

      {/* Output */}
      {result ? (
        <>
          <div
            className={`${v.bg} border-2 ${v.border} rounded-2xl p-6 text-center`}
          >
            <div className={`text-xs font-semibold uppercase tracking-wider ${v.color}`}>
              Rule of 40 Score
            </div>
            <div className={`text-5xl font-extrabold mt-1 ${v.color}`}>
              {result.score.toFixed(1)}
            </div>
            <div className={`text-sm mt-2 ${v.color}`}>
              {result.growth.toFixed(1)}% growth + {result.margin.toFixed(1)}% margin
            </div>
            <div className={`text-xs mt-3 font-semibold ${v.color}`}>
              {v.emoji} {result.verdictTitle}
            </div>
            <p className={`text-sm mt-2 leading-relaxed ${v.color} max-w-2xl mx-auto`}>
              {result.verdictBody}
            </p>
            <div className="mt-4 inline-block px-3 py-1 rounded-full bg-white/60 text-xs font-semibold text-gray-700">
              Profile: {result.classification}
            </div>
          </div>

          {/* Visual bar showing your score against the 40 line */}
          <div className="result-card">
            <h3 className="font-bold text-gray-800 mb-3">📈 Where you sit vs the benchmark</h3>
            <div className="relative h-10 bg-gradient-to-r from-red-100 via-amber-100 via-green-100 via-emerald-100 to-purple-200 rounded-full overflow-hidden">
              <div
                className="absolute h-full w-1 bg-gray-900"
                style={{ left: `${Math.min(100, Math.max(0, 40))}%` }}
                title="The 40 line"
              />
              <div
                className="absolute h-full w-2 bg-indigo-600 rounded"
                style={{
                  left: `calc(${Math.min(100, Math.max(0, result.score))}% - 4px)`,
                }}
                title={`Your score: ${result.score.toFixed(1)}`}
              />
            </div>
            <div className="grid grid-cols-5 text-[10px] mt-2 text-gray-500">
              <div>0 — Existential</div>
              <div className="text-center">20</div>
              <div className="text-center font-bold text-gray-700">40 ← benchmark</div>
              <div className="text-center">60</div>
              <div className="text-right">80+ Elite</div>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              The black tick is the 40 line. The indigo bar is your score. Above the black
              line = passing.
            </p>
          </div>
        </>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center text-sm text-gray-500">
          Enter growth and margin (or fill the auto-compute inputs) to see your Rule of 40
          score.
        </div>
      )}

      {/* Benchmarks */}
      <div className="result-card">
        <h3 className="font-bold text-gray-800 mb-3">
          📊 Public SaaS Rule of 40 benchmarks
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-gray-500 uppercase tracking-wide">
              <tr>
                <th className="text-left py-2 pr-3">Score band</th>
                <th className="text-left py-2 pr-3">What it means</th>
                <th className="text-left py-2">Typical companies (2024-26)</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              <tr className="border-t border-gray-100">
                <td className="py-2 pr-3 font-bold text-red-700">&lt; 20</td>
                <td className="py-2 pr-3">Existential pressure</td>
                <td className="py-2">Distressed SaaS pre-restructure</td>
              </tr>
              <tr className="border-t border-gray-100">
                <td className="py-2 pr-3 font-bold text-amber-700">20–40</td>
                <td className="py-2 pr-3">Below benchmark</td>
                <td className="py-2">~30% of Bessemer Cloud Index</td>
              </tr>
              <tr className="border-t border-gray-100">
                <td className="py-2 pr-3 font-bold text-green-700">40–60</td>
                <td className="py-2 pr-3">Healthy / median</td>
                <td className="py-2">HubSpot, Atlassian, Workday</td>
              </tr>
              <tr className="border-t border-gray-100">
                <td className="py-2 pr-3 font-bold text-emerald-700">60–80</td>
                <td className="py-2 pr-3">Strong / top quartile</td>
                <td className="py-2">ServiceNow, Adobe, Salesforce</td>
              </tr>
              <tr className="border-t border-gray-100">
                <td className="py-2 pr-3 font-bold text-purple-700">&gt; 80</td>
                <td className="py-2 pr-3">Elite — top decile</td>
                <td className="py-2">Snowflake, CrowdStrike, Datadog, Cloudflare</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-[11px] text-gray-500 mt-3">
          Benchmarks aggregated from the Bessemer Cloud Index (publicly published quarterly),
          Meritech SaaS reports and the BVP Emerging Cloud Index. Indian listed SaaS (Freshworks
          on NASDAQ) currently sits in the 30-50 band. Indian-private SaaS at Series A/B is
          typically 30-50 too, with high-growth outliers like Postman, Razorpay (pre-IPO)
          reaching 60+.
        </p>
      </div>

      {/* Formula */}
      <div className="result-card">
        <h3 className="font-bold text-gray-800 mb-1">📐 The exact formula</h3>
        <pre className="bg-gray-900 text-green-200 text-xs sm:text-sm rounded-xl p-4 overflow-x-auto leading-relaxed">
{`Rule of 40 Score = YoY Revenue Growth % + Profit Margin %

Healthy benchmark    ≥ 40
Top quartile         ≥ 60
Top decile           ≥ 80

Auto-compute helpers:
  Growth %  = (Current ARR − Last-year ARR) ÷ Last-year ARR × 100
  Margin %  = Profit ÷ Revenue × 100      (use EBITDA, FCF or Net)`}
        </pre>
        <p className="text-xs text-gray-600 mt-3 leading-relaxed">
          The Rule of 40 was popularised by Brad Feld in 2015 and adopted as the standard SaaS
          health metric by Bessemer Venture Partners' Cloud Index. The mathematical insight is
          that high-growth SaaS justifies low or negative margins (because growth compounds
          into future revenue), and mature SaaS justifies slow growth (because high margins
          deliver cash today). The 40 threshold is the rough break-even between the two —
          companies below it are either growing too slowly OR burning too much.
        </p>
      </div>

      {/* FAQ */}
      <div className="result-card">
        <h3 className="font-bold text-gray-800 mb-3">❓ FAQs</h3>
        <div className="space-y-4 text-sm">
          <div>
            <h4 className="font-bold text-gray-800">
              What is the Rule of 40 in SaaS?
            </h4>
            <p className="text-gray-600 mt-1">
              The Rule of 40 is a SaaS health metric stating that a healthy software company
              should have YoY revenue growth + profit margin ≥ <strong>40%</strong>. The trade-off
              between growth and profitability is the key insight: high-growth startups
              justify negative margins, mature SaaS justifies slower growth. Brad Feld
              published the original article in 2015; Bessemer Venture Partners adopted it as
              their core public-SaaS benchmark.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">
              Should I use EBITDA, FCF, or Net margin?
            </h4>
            <p className="text-gray-600 mt-1">
              All three are cited in different contexts. <strong>EBITDA margin</strong> is the
              public-market default — investors use it for cross-company comparison because it
              normalises for capital structure. <strong>FCF margin</strong> is more conservative
              and what cash-flow-focused investors (Bessemer&apos;s preferred) cite — it
              captures what&apos;s actually in the bank. <strong>Net margin</strong> is GAAP
              profit and the strictest reading — typically the worst of the three because it
              includes stock-based compensation and tax. For board reporting, use EBITDA. For
              fundraising at growth-stage and beyond, prepare to be asked about FCF.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">
              I&apos;m at 30%. Should I cut spend to boost margin or grow faster?
            </h4>
            <p className="text-gray-600 mt-1">
              At Series A-C stage: <strong>grow faster, almost always</strong>. Growth points
              are worth more than margin points at private-market valuation — investors pay
              7-15× ARR for high-growth Rule-of-40 passers and only 3-5× for stalled / profitable
              ones. At public SaaS / Series D+ stage, the calculus flips: margin starts mattering
              equally because growth is structurally harder to accelerate. The exact lever depends
              on your funnel constraint: if you can&apos;t hire enough SDRs / customer success
              fast, you can&apos;t accelerate growth and the only Rule-of-40 lever is margin.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">
              Does the Rule of 40 work for Indian SaaS?
            </h4>
            <p className="text-gray-600 mt-1">
              Yes — Indian SaaS investors (Accel, Lightspeed, Peak XV, Matrix) reference the
              Rule of 40 explicitly in board decks and investor updates. Indian SaaS selling
              to global markets (Freshworks, Postman, Razorpay) competes for global multiples
              and is benchmarked against the same Bessemer Cloud Index. India-only SaaS targets
              get a small adjustment — the Indian TAM ceiling means a 40 score on Indian
              revenue is held to a slightly lower bar than 40 on US revenue. For a pre-Series-A
              founder, focus on growth first and worry about margin later — almost all Indian
              SaaS at that stage runs 30-60% growth with negative 10-30% margin, which puts the
              Rule of 40 score in the 20-40 band.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">
              How does the Rule of 40 compare to LTV : CAC ratio?
            </h4>
            <p className="text-gray-600 mt-1">
              They measure different things. <strong>Rule of 40</strong> is a{" "}
              <em>company-level</em> health metric — overall growth + profitability.{" "}
              <strong>LTV : CAC</strong> is a <em>unit-economics</em> metric — health of a
              single customer relationship. A company can pass Rule of 40 with weak LTV : CAC
              if they&apos;re monetising existing customers heavily, and pass LTV : CAC with
              weak Rule of 40 if their TAM is small. Best practice is to report BOTH — Rule of
              40 to investors, LTV : CAC internally to the growth team.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">
              What&apos;s the highest Rule of 40 score ever?
            </h4>
            <p className="text-gray-600 mt-1">
              At their 2021 peak Snowflake briefly hit ~120 (110%+ growth + ~10% margin) and
              CrowdStrike sat above 100 for several quarters. Datadog has held 80+ for most of
              its public life. The numbers have compressed since 2022 as growth slowed
              market-wide — even the top-decile companies are 70-90 today. Anything sustained
              above 100 is genuinely rare; it requires both elite-growth and positive-margin in
              the same quarter, which the unit economics of most SaaS don&apos;t allow at any
              meaningful scale.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">
              Can a private startup actually compute this?
            </h4>
            <p className="text-gray-600 mt-1">
              Yes — exactly the same formula. The two ingredients are (1) YoY revenue growth,
              measured from accounting books or Stripe / Razorpay / your billing engine, and
              (2) profit margin, measured from your P&L. Private companies usually use EBITDA
              margin since the Net-margin GAAP rules are designed for public-company
              comparability. Many Indian YC / Sequoia-portfolio startups now include their
              Rule of 40 in monthly investor updates — it&apos;s the single most-cited line in
              a SaaS board deck after ARR.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">
              How does the Rule of 40 affect my valuation multiple?
            </h4>
            <p className="text-gray-600 mt-1">
              Roughly: every 10-point improvement in Rule of 40 score is worth a 1× ARR
              multiple uplift in public markets and 0.5-1× ARR in private secondaries. At
              public SaaS scale, a company at 60 trades around 10× ARR while a company at 30
              trades around 4× ARR — a 6× spread. For an Indian private SaaS at Series B with
              ₹50 Cr ARR, that&apos;s the difference between a ₹200 Cr valuation and a
              ₹500 Cr valuation. The score is a leading indicator of where the multiple is
              heading.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
