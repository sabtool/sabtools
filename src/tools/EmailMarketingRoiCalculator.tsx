"use client";
import { useMemo, useState } from "react";

/**
 * Email Marketing ROI Calculator — projects revenue and ROI from an
 * email marketing program based on list size, send frequency, open
 * rate, CTR, conversion rate, AOV, and platform cost. Built to
 * benchmark realistic Indian B2C / B2B numbers, not the US-default
 * DMA "$42 per $1 spent" figure that's quoted everywhere.
 *
 * India benchmarks (sources: HubSpot India 2024 report,
 * MailerLite + Brevo + Mailchimp public India benchmark data,
 * Sender / GetResponse 2025 reports cross-referenced with
 * EmailToolTester ESP comparisons for India):
 *
 *   B2C average open rate           : 22-28%   (e-comm, lifestyle, retail)
 *   B2B average open rate           : 30-38%   (SaaS, professional services)
 *   B2C average CTR                 : 1.5-3%
 *   B2B average CTR                 : 2.5-5%
 *   Email-to-purchase conv (B2C)    : 1-3%
 *   Email-to-lead conv (B2B)        : 2-5%
 *
 * Platform cost benchmarks (₹/month for 10K subscribers, 2026):
 *   Mailchimp     : ₹3,200-4,500   (Essentials → Standard plan)
 *   Brevo         : ₹1,800-2,800   (Starter → Business)
 *   MailerLite    : ₹1,500-2,500
 *   Sender        : ₹1,200-2,000   (often free for ≤2,500 subscribers)
 *   ConvertKit    : ₹3,800-5,500   (creator-focused)
 *   ActiveCampaign: ₹4,200-6,800   (advanced automation)
 *   Zoho Campaigns: ₹1,400-2,200   (India HQ pricing)
 *
 * The Indian DMA-equivalent ROI figure averages out at ~₹36 per ₹1
 * spent for B2C and ~₹42 for B2B, but with massive niche variance.
 */

interface Inputs {
  listSize: number;
  sendsPerMonth: number;
  openRatePct: number;
  ctrPct: number;
  convRatePct: number;
  aovINR: number;
  platformCostMonthly: number;
  copywritingMonthly: number;
}

interface Result {
  monthlyEmailsSent: number;
  monthlyOpens: number;
  monthlyClicks: number;
  monthlyConversions: number;
  monthlyRevenue: number;
  monthlyCost: number;
  monthlyNetProfit: number;
  roiMultiple: number;
  roiPct: number;
  revenuePerSubscriber: number;
  revenuePerEmail: number;
  paybackMonths: number;
  verdict: "bad" | "below" | "good" | "great";
  verdictTitle: string;
  verdictBody: string;
}

const VERDICTS: Record<Result["verdict"], { color: string; bg: string; border: string; emoji: string }> = {
  bad: { color: "text-red-700", bg: "bg-red-50", border: "border-red-200", emoji: "⚠️" },
  below: { color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200", emoji: "🌱" },
  good: { color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200", emoji: "✅" },
  great: { color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200", emoji: "🏆" },
};

function fmtINR(n: number, max = 0): string {
  if (!isFinite(n) || n === 0) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: max,
  }).format(Math.round(n));
}

function compute(i: Inputs): Result | null {
  if (i.listSize <= 0 || i.sendsPerMonth <= 0) return null;

  const monthlyEmailsSent = i.listSize * i.sendsPerMonth;
  const monthlyOpens = monthlyEmailsSent * (i.openRatePct / 100);
  const monthlyClicks = monthlyOpens * (i.ctrPct / 100);
  const monthlyConversions = monthlyClicks * (i.convRatePct / 100);
  const monthlyRevenue = monthlyConversions * i.aovINR;
  const monthlyCost = i.platformCostMonthly + i.copywritingMonthly;
  const monthlyNetProfit = monthlyRevenue - monthlyCost;
  const roiMultiple = monthlyCost > 0 ? monthlyRevenue / monthlyCost : 0;
  const roiPct = monthlyCost > 0 ? ((monthlyRevenue - monthlyCost) / monthlyCost) * 100 : 0;
  const revenuePerSubscriber = i.listSize > 0 ? monthlyRevenue / i.listSize : 0;
  const revenuePerEmail = monthlyEmailsSent > 0 ? monthlyRevenue / monthlyEmailsSent : 0;
  const paybackMonths = monthlyNetProfit > 0 ? monthlyCost / monthlyNetProfit : 0;

  let verdict: Result["verdict"];
  let verdictTitle = "";
  let verdictBody = "";
  if (roiMultiple < 1) {
    verdict = "bad";
    verdictTitle = "Losing money — fix something before scaling";
    verdictBody =
      "Your email program costs more than it earns. Three diagnostic questions: " +
      "(1) Is your list a real opted-in subscriber list, or scraped/bought? Bought lists never convert. " +
      "(2) Are open rates above 15%? If not, deliverability or subject lines are broken. " +
      "(3) Is your offer relevant to the list? Email ROI requires a tight fit between segment and offer. " +
      "Pause sends, audit the basics, then resume.";
  } else if (roiMultiple < 10) {
    verdict = "below";
    verdictTitle = "Working — but below the email-marketing benchmark";
    verdictBody =
      "Indian B2C email programs typically earn ₹20-50 per ₹1 spent (multiple of 20-50x). You're below " +
      "that range. Three highest-ROI fixes: (1) Segment the list — sending the same email to all " +
      "subscribers crushes CTR. Segment by purchase recency / source / preferences and lift CTR 2-4x. " +
      "(2) Add 3-5 automated journeys (welcome series, abandoned cart, post-purchase) — these typically " +
      "generate 50%+ of all email revenue. (3) Improve subject lines — A/B test 2 versions for every " +
      "campaign and lift open rates 15-30%.";
  } else if (roiMultiple < 40) {
    verdict = "good";
    verdictTitle = "Healthy ROI — typical of a well-run program";
    verdictBody =
      "A 10-40x ROI multiple puts you in the range of mature, well-optimised email programs. Next moves: " +
      "(1) Lift the ceiling with predictive sends (send at the time each subscriber typically opens). " +
      "(2) Add an SMS / WhatsApp channel — Indian B2C lifts cross-channel revenue 30-60% when emailing + " +
      "WhatsApp / SMS coordinated. (3) Tighten subscriber acquisition — focus on quality (organic / " +
      "referral / content) over quantity (paid lead-gen). 1,000 engaged subscribers usually beats " +
      "10,000 cold ones.";
  } else {
    verdict = "great";
    verdictTitle = "Top-tier ROI — treat email like the core business it is";
    verdictBody =
      "A 40x+ ROI multiple is top-decile for any market and exceptional for Indian benchmarks. Risks at " +
      "this scale: (1) Concentration risk — if email drives more than 30% of revenue, deliverability or " +
      "platform changes are existential. Diversify channels. (2) Subscriber-acquisition cost matters more " +
      "than ROI multiple — pour into growing the list 2-3x without diluting engagement. (3) Compliance — " +
      "DPDP Act (India), DPDPB rules, and CAN-SPAM still apply. Document consent, honor unsubscribes " +
      "instantly, and audit segmentation logic quarterly.";
  }

  return {
    monthlyEmailsSent,
    monthlyOpens,
    monthlyClicks,
    monthlyConversions,
    monthlyRevenue,
    monthlyCost,
    monthlyNetProfit,
    roiMultiple,
    roiPct,
    revenuePerSubscriber,
    revenuePerEmail,
    paybackMonths,
    verdict,
    verdictTitle,
    verdictBody,
  };
}

export default function EmailMarketingRoiCalculator() {
  const [listSize, setListSize] = useState("10000");
  const [sendsPerMonth, setSendsPerMonth] = useState("4");
  const [openRatePct, setOpenRatePct] = useState("24");
  const [ctrPct, setCtrPct] = useState("2.2");
  const [convRatePct, setConvRatePct] = useState("2");
  const [aovINR, setAovINR] = useState("1500");
  const [platformCostMonthly, setPlatformCostMonthly] = useState("3200");
  const [copywritingMonthly, setCopywritingMonthly] = useState("15000");
  const [businessType, setBusinessType] = useState<string>("b2c");

  // Business type preset → tweaks open/CTR/conv defaults
  const setBizPreset = (type: string, open: string, ctr: string, conv: string, aov: string) => {
    setBusinessType(type);
    setOpenRatePct(open);
    setCtrPct(ctr);
    setConvRatePct(conv);
    setAovINR(aov);
  };

  const result = useMemo(
    () =>
      compute({
        listSize: parseFloat(listSize) || 0,
        sendsPerMonth: parseFloat(sendsPerMonth) || 0,
        openRatePct: parseFloat(openRatePct) || 0,
        ctrPct: parseFloat(ctrPct) || 0,
        convRatePct: parseFloat(convRatePct) || 0,
        aovINR: parseFloat(aovINR) || 0,
        platformCostMonthly: parseFloat(platformCostMonthly) || 0,
        copywritingMonthly: parseFloat(copywritingMonthly) || 0,
      }),
    [listSize, sendsPerMonth, openRatePct, ctrPct, convRatePct, aovINR, platformCostMonthly, copywritingMonthly]
  );

  const v = result ? VERDICTS[result.verdict] : VERDICTS.good;

  return (
    <div className="space-y-6">
      {/* Business type preset */}
      <div className="result-card">
        <h3 className="font-bold text-gray-800 mb-1">🎯 Quick business type preset</h3>
        <p className="text-xs text-gray-500 mb-3">
          Autofills realistic open / CTR / conversion / AOV for your model. Adjust manually after.
          Indian benchmarks differ meaningfully from US — most calculators silently use US defaults.
        </p>
        <div className="flex flex-wrap gap-2">
          <BizChip current={businessType} value="b2c" label="🛒 B2C e-commerce" onClick={() => setBizPreset("b2c", "24", "2.2", "2", "1500")} />
          <BizChip current={businessType} value="b2b" label="🏢 B2B SaaS / services" onClick={() => setBizPreset("b2b", "34", "3.5", "3", "8500")} />
          <BizChip current={businessType} value="info" label="🎓 Course / info product" onClick={() => setBizPreset("info", "28", "3", "1.5", "4500")} />
          <BizChip current={businessType} value="newsletter" label="📰 Paid newsletter" onClick={() => setBizPreset("newsletter", "42", "5", "0.5", "999")} />
          <BizChip current={businessType} value="subscription" label="📦 Subscription box" onClick={() => setBizPreset("subscription", "26", "2.5", "2.2", "2400")} />
        </div>
      </div>

      {/* Inputs */}
      <div className="result-card">
        <h3 className="font-bold text-gray-800 mb-1">📨 Email program inputs</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Subscribers on list</label>
            <input type="number" inputMode="numeric" min={0} value={listSize}
              onChange={(e) => setListSize(e.target.value)} className="calc-input" placeholder="e.g. 10000" />
            <p className="text-[11px] text-gray-400 mt-1">Active opted-in subscribers, not cold/bought list.</p>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Email sends per subscriber per month</label>
            <input type="number" inputMode="decimal" step={0.5} min={0} value={sendsPerMonth}
              onChange={(e) => setSendsPerMonth(e.target.value)} className="calc-input" placeholder="e.g. 4" />
            <p className="text-[11px] text-gray-400 mt-1">Newsletter weekly = 4. Daily = 30. Higher ≠ better.</p>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Open rate (%)</label>
            <input type="number" inputMode="decimal" step={0.1} min={0} max={100} value={openRatePct}
              onChange={(e) => setOpenRatePct(e.target.value)} className="calc-input" placeholder="e.g. 24" />
            <p className="text-[11px] text-gray-400 mt-1">India B2C: 22-28%, B2B: 30-38%. Apple MPP inflates this slightly.</p>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Click-through rate (% of opens)</label>
            <input type="number" inputMode="decimal" step={0.1} min={0} max={100} value={ctrPct}
              onChange={(e) => setCtrPct(e.target.value)} className="calc-input" placeholder="e.g. 2.2" />
            <p className="text-[11px] text-gray-400 mt-1">India B2C: 1.5-3%, B2B: 2.5-5%.</p>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Conversion rate (% of clicks)</label>
            <input type="number" inputMode="decimal" step={0.1} min={0} max={100} value={convRatePct}
              onChange={(e) => setConvRatePct(e.target.value)} className="calc-input" placeholder="e.g. 2" />
            <p className="text-[11px] text-gray-400 mt-1">India e-comm: 1-3%, B2B lead → SQL: 2-5%.</p>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Average order value or lead value (₹)</label>
            <input type="number" inputMode="decimal" step={1} min={0} value={aovINR}
              onChange={(e) => setAovINR(e.target.value)} className="calc-input" placeholder="e.g. 1500" />
            <p className="text-[11px] text-gray-400 mt-1">For B2B: blended deal size × close rate.</p>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">ESP / platform cost per month (₹)</label>
            <input type="number" inputMode="decimal" step={1} min={0} value={platformCostMonthly}
              onChange={(e) => setPlatformCostMonthly(e.target.value)} className="calc-input" placeholder="e.g. 3200" />
            <p className="text-[11px] text-gray-400 mt-1">Mailchimp 10K subs ≈ ₹3,200. Brevo ≈ ₹1,800. Zoho ≈ ₹1,400.</p>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Copywriting + design per month (₹)</label>
            <input type="number" inputMode="decimal" step={1} min={0} value={copywritingMonthly}
              onChange={(e) => setCopywritingMonthly(e.target.value)} className="calc-input" placeholder="e.g. 15000" />
            <p className="text-[11px] text-gray-400 mt-1">Solo founder: 0. Freelancer: 8K-25K. Agency: 35K+.</p>
          </div>
        </div>
      </div>

      {/* Output */}
      {result ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl p-4 text-center">
              <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Monthly revenue</div>
              <div className="text-2xl font-extrabold text-indigo-900 mt-1">{fmtINR(result.monthlyRevenue)}</div>
              <div className="text-[11px] text-indigo-700 mt-1">{Math.round(result.monthlyConversions).toLocaleString("en-IN")} conversions</div>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl p-4 text-center">
              <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">ROI multiple</div>
              <div className="text-2xl font-extrabold text-emerald-900 mt-1">{result.roiMultiple.toFixed(1)}×</div>
              <div className="text-[11px] text-emerald-700 mt-1">₹{result.roiMultiple.toFixed(1)} earned per ₹1 spent</div>
            </div>
            <div className={`${v.bg} border-2 ${v.border} rounded-2xl p-4 text-center`}>
              <div className={`text-xs font-semibold uppercase tracking-wider ${v.color}`}>Net monthly profit</div>
              <div className={`text-2xl font-extrabold mt-1 ${v.color}`}>{fmtINR(result.monthlyNetProfit)}</div>
              <div className={`text-[11px] mt-1 ${v.color}`}>Annual: {fmtINR(result.monthlyNetProfit * 12)}</div>
            </div>
          </div>

          <div className={`${v.bg} border ${v.border} rounded-2xl p-5`}>
            <h3 className={`font-bold text-lg ${v.color}`}>{v.emoji} {result.verdictTitle}</h3>
            <p className={`mt-2 text-sm leading-relaxed ${v.color}`}>{result.verdictBody}</p>
          </div>

          <div className="result-card">
            <h3 className="font-bold text-gray-800 mb-3">📊 Per-email unit economics</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <Stat label="Revenue / subscriber / month" value={fmtINR(result.revenuePerSubscriber, 2)} />
              <Stat label="Revenue per email sent" value={fmtINR(result.revenuePerEmail, 2)} />
              <Stat label="Total monthly cost" value={fmtINR(result.monthlyCost)} />
              <Stat label="Monthly conversions" value={Math.round(result.monthlyConversions).toLocaleString("en-IN")} />
            </div>
          </div>

          <div className="result-card">
            <h3 className="font-bold text-gray-800 mb-3">🔢 The funnel</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 text-gray-600">Emails sent per month</td>
                    <td className="py-2 text-right tabular-nums font-bold">{Math.round(result.monthlyEmailsSent).toLocaleString("en-IN")}</td>
                    <td className="py-2 text-right text-xs text-gray-400">{parseInt(listSize).toLocaleString("en-IN")} × {sendsPerMonth}</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 text-gray-600">→ Opens ({openRatePct}%)</td>
                    <td className="py-2 text-right tabular-nums font-bold">{Math.round(result.monthlyOpens).toLocaleString("en-IN")}</td>
                    <td className="py-2 text-right text-xs text-gray-400">opens</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 text-gray-600">→ Clicks ({ctrPct}% of opens)</td>
                    <td className="py-2 text-right tabular-nums font-bold">{Math.round(result.monthlyClicks).toLocaleString("en-IN")}</td>
                    <td className="py-2 text-right text-xs text-gray-400">visits</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 text-gray-600">→ Conversions ({convRatePct}% of clicks)</td>
                    <td className="py-2 text-right tabular-nums font-bold">{Math.round(result.monthlyConversions).toLocaleString("en-IN")}</td>
                    <td className="py-2 text-right text-xs text-gray-400">orders / leads</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-2 text-gray-600 font-bold">× AOV / value</td>
                    <td className="py-2 text-right tabular-nums font-bold text-emerald-700">{fmtINR(parseFloat(aovINR))}</td>
                    <td className="py-2 text-right text-xs text-gray-400">→ {fmtINR(result.monthlyRevenue)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center text-sm text-gray-500">
          Enter your list size and send frequency to see email program ROI.
        </div>
      )}

      {/* India ESP cost comparison */}
      <div className="result-card">
        <h3 className="font-bold text-gray-800 mb-3">💰 ESP cost benchmarks for India (10K subscribers, 2026)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-gray-500 uppercase tracking-wide">
              <tr>
                <th className="text-left py-2 pr-3">Platform</th>
                <th className="text-left py-2 pr-3">₹/month (10K subs)</th>
                <th className="text-left py-2 pr-3">Best for</th>
                <th className="text-left py-2">Free tier?</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {[
                ["Mailchimp", "₹3,200-4,500", "Brand-recognition; mainstream B2C", "≤500 subs"],
                ["Brevo (Sendinblue)", "₹1,800-2,800", "Transactional + marketing combo", "≤300 emails/day"],
                ["MailerLite", "₹1,500-2,500", "Newsletters, creators", "≤1,000 subs"],
                ["Sender", "₹1,200-2,000", "Lean budgets, e-comm", "≤2,500 subs"],
                ["ConvertKit (Kit)", "₹3,800-5,500", "Creators, course launches", "≤1,000 subs"],
                ["ActiveCampaign", "₹4,200-6,800", "Advanced automation, B2B", "No"],
                ["Zoho Campaigns", "₹1,400-2,200", "India HQ, integrated with Zoho stack", "Yes (limited)"],
                ["Mailmodo", "₹2,800-4,800", "Interactive AMP emails, B2B India", "≤2,000 subs"],
                ["MoEngage", "Enterprise quote", "Multi-channel B2C at scale", "No"],
              ].map(([platform, cost, best, free], i) => (
                <tr key={i} className="border-t border-gray-100">
                  <td className="py-2 pr-3 font-bold">{platform}</td>
                  <td className="py-2 pr-3">{cost}</td>
                  <td className="py-2 pr-3 text-gray-500">{best}</td>
                  <td className="py-2 text-amber-700">{free}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[11px] text-gray-500 mt-3">
          Prices estimated from each ESP&apos;s public pricing page (June 2026) at 10,000 subscriber
          tier with marketing-plan features. Actual cost varies by send volume, contacts vs sends
          model, region, and annual vs monthly billing.
        </p>
      </div>

      {/* Formula */}
      <div className="result-card">
        <h3 className="font-bold text-gray-800 mb-1">📐 The exact formula</h3>
        <pre className="bg-gray-900 text-green-200 text-xs sm:text-sm rounded-xl p-4 overflow-x-auto leading-relaxed">
{`Emails sent / month  = List size × Sends per month
Opens               = Emails sent × Open rate %
Clicks              = Opens × CTR %
Conversions         = Clicks × Conversion rate %
Revenue             = Conversions × AOV (or lead value)
Cost                = ESP cost + Copywriting cost
ROI multiple        = Revenue ÷ Cost
ROI %               = (Revenue − Cost) ÷ Cost × 100
Net profit          = Revenue − Cost`}
        </pre>
        <p className="text-xs text-gray-600 mt-3 leading-relaxed">
          The compounding effect of the funnel is why small lifts at the top translate into
          large revenue changes downstream. Lifting open rate from 22% → 26% (subject-line
          A/B tests) and CTR from 2% → 2.5% (better preview text + CTA) at the same conversion
          rate doubles total revenue from the same list and send volume.
        </p>
      </div>

      {/* FAQ */}
      <div className="result-card">
        <h3 className="font-bold text-gray-800 mb-3">❓ FAQs</h3>
        <div className="space-y-4 text-sm">
          <div>
            <h4 className="font-bold text-gray-800">
              What&apos;s a realistic email marketing ROI for an Indian business?
            </h4>
            <p className="text-gray-600 mt-1">
              The famous DMA figure of $42 per $1 spent is a US average across all industries
              and skews heavily toward mature e-commerce. For Indian businesses, realistic
              ranges based on 2024-26 benchmarks: <strong>B2C e-commerce ₹20-50 per ₹1 spent</strong>{" "}
              (multiple of 20-50×), <strong>B2B SaaS ₹30-70 per ₹1 spent</strong>,{" "}
              <strong>creators / info products ₹15-40 per ₹1 spent</strong>. The variance is
              driven mostly by AOV (Average Order Value) and conversion rate, not by list size.
              A 5,000-subscriber list with ₹5,000 AOV often outperforms a 50,000-subscriber list
              with ₹500 AOV.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">
              What&apos;s a good open rate in India in 2026?
            </h4>
            <p className="text-gray-600 mt-1">
              <strong>B2C: 22-28% benchmark, 30%+ is great.</strong>{" "}
              <strong>B2B: 30-38% benchmark, 42%+ is great.</strong> Apple Mail Privacy
              Protection (MPP, launched 2021) artificially inflates open rates by 5-15% for
              Apple-device subscribers because it pre-fetches images. Don&apos;t use opens
              as a sole engagement metric — track click rate and revenue per subscriber for
              the real picture. For India-specific contexts: Hindi / regional-language emails
              often see 15-25% higher opens than English-only sends in tier-2/3 cities.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">
              Which ESP (email service provider) is best for an Indian business?
            </h4>
            <p className="text-gray-600 mt-1">
              <strong>For solo founders / sub-1,000 subscribers</strong>: Sender or
              MailerLite — both have generous free tiers and low costs at scale.{" "}
              <strong>For Indian e-comm 1K-50K subscribers</strong>: Brevo or Zoho Campaigns
              (Indian HQ pricing, ₹2-3K/month) or Mailmodo (AMP emails for engagement).{" "}
              <strong>For B2B SaaS with automation needs</strong>: ActiveCampaign or HubSpot
              Email (if you already use HubSpot CRM). <strong>For large-scale multi-channel
              (email + push + WhatsApp)</strong>: MoEngage (Indian unicorn, enterprise pricing)
              or CleverTap. <strong>For creators / newsletter</strong>: Beehiiv or ConvertKit
              (Kit). Avoid Mailchimp at scale — India-INR pricing has gotten expensive
              vs alternatives.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">
              How does the DPDP Act 2023 affect email marketing in India?
            </h4>
            <p className="text-gray-600 mt-1">
              The Digital Personal Data Protection Act 2023 requires{" "}
              <strong>explicit consent for marketing emails</strong> (no pre-ticked boxes,
              no implied consent), a clear <strong>purpose statement</strong> at signup, an
              <strong> easily accessible unsubscribe / withdrawal mechanism</strong>, and{" "}
              <strong>record-keeping of consent</strong> (timestamp, IP, mechanism). Penalties
              run up to ₹250 crore per breach. Practical compliance: (1) use double opt-in for
              all new subscribers; (2) keep a consent log per subscriber in your ESP; (3) honor
              unsubscribes within 48 hours (most ESPs do this automatically); (4) include a
              clear &quot;why you&apos;re receiving this&quot; line in every campaign. The DPDP
              rules notified 2024 added specifics around children&apos;s data and sensitive
              personal data — separate consent flows required. Most international ESPs
              (Mailchimp, Brevo, ActiveCampaign) auto-handle the technical bits but the consent
              capture is on you.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">
              What&apos;s the highest-ROI move I can make on an existing email program?
            </h4>
            <p className="text-gray-600 mt-1">
              <strong>Automated journeys</strong>, by a wide margin. A welcome series (3-5
              emails over 7-14 days), abandoned-cart series (3 emails over 24 hours), and
              post-purchase series (3-5 emails over 30 days) typically generate{" "}
              <strong>50-70% of all email revenue</strong> for an e-commerce business while
              being &quot;set once, earn forever&quot;. Most Indian e-comm sites haven&apos;t
              set these up. Implementation cost: ~₹50-80K with a freelancer or ~₹25-40 hours
              of founder time. Payback: usually under 60 days. Second-highest ROI move: list
              segmentation by purchase recency / source / lifecycle stage and customising
              the same campaign by segment.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">
              How many emails per month is too many?
            </h4>
            <p className="text-gray-600 mt-1">
              There&apos;s no fixed answer. The signal is <strong>unsubscribe rate per send</strong>:
              if it stays under 0.3%, you can probably send more. If it climbs above 0.5%, you&apos;re
              over-mailing. Most Indian B2C businesses optimise at 4-8 sends per subscriber per
              month (weekly to bi-weekly newsletters + 1-2 promo campaigns). Daily senders are
              rare in India outside news/content publishers. The right cadence is driven by:
              (1) genuine value per email — if every email is a sale pitch, even 2/month is too
              many; (2) segmentation — sending different cadences to engaged vs lapsed segments
              outperforms one-size-fits-all; (3) preference centres — letting subscribers
              choose &quot;weekly, monthly, only big deals&quot; lifts retention 30-40%.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">
              Is buying an email list ever a good idea?
            </h4>
            <p className="text-gray-600 mt-1">
              <strong>No.</strong> Three reasons: (1) Bought lists violate the DPDP Act — these
              contacts haven&apos;t consented to receive your emails, so penalties apply.
              (2) Open rates from bought lists are usually under 5% and unsubscribe rates over
              2%, which damages your sender reputation and reduces deliverability to your
              legitimate subscribers. (3) ROI is almost always negative because spam complaints
              get your IP / domain blacklisted, which costs months to recover. The only
              legitimate &quot;list acquisition&quot; is partnerships (where both parties&apos;
              subscribers explicitly consent) and lead-gen campaigns with explicit
              opt-in. Pour money into list growth via content, lead magnets, and referrals
              instead.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">
              How long should the email be? Plain-text vs HTML / image-heavy?
            </h4>
            <p className="text-gray-600 mt-1">
              For India in 2026: <strong>plain-text-styled emails (single column, minimal
              images, 200-400 words)</strong> consistently outperform image-heavy HTML
              templates in deliverability AND CTR. Reasons: (1) Gmail / Outlook spam filters
              are stricter on image-heavy emails; (2) Indian mobile users are often on data-
              metered plans and don&apos;t load images; (3) Apple MPP and image blocking break
              CTAs in image-heavy designs. Exceptions: e-commerce product showcases and
              launch emails where the product image IS the value. For everything else
              (newsletters, transactional, B2B nurture), text-heavy beats design-heavy in
              measured outcomes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-3">
      <div className="text-[10px] uppercase tracking-wide text-gray-500 font-semibold">{label}</div>
      <div className="text-base font-extrabold text-gray-800 mt-1">{value}</div>
    </div>
  );
}

function BizChip({
  current,
  value,
  label,
  onClick,
}: {
  current: string;
  value: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
        current === value
          ? "bg-indigo-600 text-white border-indigo-600"
          : "bg-white text-gray-700 border-gray-200 hover:border-indigo-300"
      }`}
    >
      {label}
    </button>
  );
}
