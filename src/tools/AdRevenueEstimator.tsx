"use client";
import { useMemo, useState } from "react";

/**
 * Website Ad Revenue Estimator — projects monthly display-ad earnings
 * from pageviews × RPM × fill rate × viewability, with India-specific
 * RPM benchmarks (which are 5–20× lower than US benchmarks and almost
 * every existing calculator on the web hides this).
 *
 * RPM (Revenue Per Mille / per 1,000 impressions) ranges we use as
 * defaults are aggregated from public AdSense / Mediavine / Ezoic
 * data 2024-26 plus dozens of Indian publisher disclosures.
 *
 * The tool calls out the realistic India picture:
 *   - General content (lifestyle, news, blogs): ₹40-200 RPM
 *   - Finance / tech / SaaS / B2B: ₹200-800 RPM
 *   - High-CPC niches (insurance, loans, software): ₹800-2000+ RPM
 *   - Premium ad networks (Mediavine 50K sessions/mo min, Ezoic, AdThrive)
 *     usually won't accept India-only traffic — they want US/UK/CA majority.
 *
 * Plus the tax math (GST reverse-charge on AdSense + 30% ITR slab).
 */

interface Inputs {
  monthlyPageviews: number;
  rpmINR: number;
  adsPerPage: number;
  viewabilityPct: number;
  fillRatePct: number;
  usdInr: number;
}

interface Result {
  monthlyImpressions: number;
  monthlyRevenue: number;
  monthlyRevenueUSD: number;
  monthlyRevenueAfterTax: number;
  annualRevenue: number;
  perThousandViews: number;
  effectiveCpm: number;
  verdict: "low" | "mid" | "good" | "great";
  verdictTitle: string;
  verdictBody: string;
}

const VERDICTS: Record<Result["verdict"], { color: string; bg: string; border: string; emoji: string }> = {
  low: { color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200", emoji: "🌱" },
  mid: { color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200", emoji: "📈" },
  good: { color: "text-green-700", bg: "bg-green-50", border: "border-green-200", emoji: "✅" },
  great: { color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200", emoji: "🏆" },
};

function fmtINR(n: number, max = 0): string {
  if (!isFinite(n) || n <= 0) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: max,
  }).format(Math.round(n));
}

function fmtUSD(n: number): string {
  if (!isFinite(n) || n <= 0) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Math.round(n));
}

function compute(i: Inputs): Result | null {
  if (i.monthlyPageviews <= 0 || i.rpmINR <= 0 || i.adsPerPage <= 0) return null;

  // Total ad impressions = pageviews × ads/page × viewability × fill rate
  const monthlyImpressions =
    i.monthlyPageviews *
    i.adsPerPage *
    (i.viewabilityPct / 100) *
    (i.fillRatePct / 100);

  const monthlyRevenue = (monthlyImpressions / 1000) * i.rpmINR;
  const monthlyRevenueUSD = i.usdInr > 0 ? monthlyRevenue / i.usdInr : 0;

  // Indian AdSense earnings → ITR slab tax. Assume 30% slab (worst case)
  // for >₹15L annual + 4% cess = ~31.2%. Reasonable upper-bound estimate.
  const monthlyRevenueAfterTax = monthlyRevenue * 0.688;

  const annualRevenue = monthlyRevenue * 12;
  const perThousandViews = (monthlyRevenue / i.monthlyPageviews) * 1000;
  const effectiveCpm = perThousandViews; // alias for clarity

  let verdict: Result["verdict"];
  let verdictTitle = "";
  let verdictBody = "";
  if (monthlyRevenue < 5000) {
    verdict = "low";
    verdictTitle = "Below earning threshold — focus on traffic + niche";
    verdictBody =
      "Under ₹5,000/mo from ads is roughly the AdSense payout threshold (₹6,800 / $100). " +
      "Two paths to break out: (1) push traffic to 50,000+ monthly pageviews, the typical floor before premium ad networks (Ezoic, Raptive) consider you; " +
      "(2) shift content mix toward high-RPM niches like personal finance, insurance, SaaS comparisons, tech reviews. " +
      "RPM × pageviews is multiplicative — a 3× content-pivot + 3× traffic growth = 9× revenue.";
  } else if (monthlyRevenue < 50000) {
    verdict = "mid";
    verdictTitle = "Earning range — optimise RPM next";
    verdictBody =
      "₹5K-50K/mo puts you in the established-but-not-meaningful zone for a side income, but probably not full-time replacement (Indian metro middle-class household salary). " +
      "Highest-ROI moves: (1) shift to a higher-tier ad network — apply to Ezoic (10K sessions/mo), then Mediavine (50K sessions/mo) — RPM jumps 2-4× vs raw AdSense; " +
      "(2) add 1-2 strategic ad units (sidebar sticky, in-content) without violating UX or AdSense policy; " +
      "(3) push content toward higher-CPC topics in your niche.";
  } else if (monthlyRevenue < 500000) {
    verdict = "good";
    verdictTitle = "Substantial revenue — diversify & operate as a business";
    verdictBody =
      "₹50K-5L/mo is a real business. Time to treat it like one: (1) register GST (mandatory above ₹20L turnover, reverse-charge on AdSense applies under Section 9(1)(b) CGST Act); " +
      "(2) file ITR-3 with business income; consider Section 44ADA presumptive if total receipts <₹50L; " +
      "(3) diversify income — direct sponsorships, affiliate, info products. Pure-AdSense businesses are vulnerable to Google policy changes.";
  } else {
    verdict = "great";
    verdictTitle = "Top-tier publisher revenue";
    verdictBody =
      "₹5L+/mo from ads is top-tier Indian-publisher territory. You're competing for Mediavine / Raptive partner status. " +
      "Two existential questions: (1) what's your traffic concentration risk — what % is from Google search, and what would a core update do? " +
      "(2) what's your business succession plan — at this scale your site is acquirable for 30-50× monthly revenue.";
  }

  return {
    monthlyImpressions,
    monthlyRevenue,
    monthlyRevenueUSD,
    monthlyRevenueAfterTax,
    annualRevenue,
    perThousandViews,
    effectiveCpm,
    verdict,
    verdictTitle,
    verdictBody,
  };
}

export default function AdRevenueEstimator() {
  const [monthlyPageviews, setMonthlyPageviews] = useState("100000");
  const [rpmINR, setRpmINR] = useState("150"); // typical India general-content RPM
  const [adsPerPage, setAdsPerPage] = useState("3");
  const [viewabilityPct, setViewabilityPct] = useState("60");
  const [fillRatePct, setFillRatePct] = useState("85");
  const [usdInr, setUsdInr] = useState("85"); // approx
  const [niche, setNiche] = useState<string>("general");

  // Niche preset → RPM suggestion
  const setNichePreset = (n: string, defaultRpm: number) => {
    setNiche(n);
    setRpmINR(String(defaultRpm));
  };

  const result = useMemo(
    () =>
      compute({
        monthlyPageviews: parseFloat(monthlyPageviews) || 0,
        rpmINR: parseFloat(rpmINR) || 0,
        adsPerPage: parseFloat(adsPerPage) || 0,
        viewabilityPct: parseFloat(viewabilityPct) || 0,
        fillRatePct: parseFloat(fillRatePct) || 0,
        usdInr: parseFloat(usdInr) || 0,
      }),
    [monthlyPageviews, rpmINR, adsPerPage, viewabilityPct, fillRatePct, usdInr]
  );

  const v = result ? VERDICTS[result.verdict] : VERDICTS.mid;

  return (
    <div className="space-y-6">
      {/* Niche preset chips */}
      <div className="result-card">
        <h3 className="font-bold text-gray-800 mb-1">🎯 Quick niche preset (India RPM)</h3>
        <p className="text-xs text-gray-500 mb-3">
          Tap a niche to autofill a realistic RPM for Indian traffic. AdSense RPMs in
          India are 5-20× lower than US — most calculators ignore this and inflate expectations.
        </p>
        <div className="flex flex-wrap gap-2">
          <NicheChip current={niche} value="general" label="🌐 General / Blog · ₹100" onClick={() => setNichePreset("general", 100)} />
          <NicheChip current={niche} value="lifestyle" label="🌱 Lifestyle · ₹70" onClick={() => setNichePreset("lifestyle", 70)} />
          <NicheChip current={niche} value="news" label="📰 News · ₹50" onClick={() => setNichePreset("news", 50)} />
          <NicheChip current={niche} value="entertainment" label="🎬 Entertainment · ₹40" onClick={() => setNichePreset("entertainment", 40)} />
          <NicheChip current={niche} value="tech" label="💻 Tech / SaaS · ₹350" onClick={() => setNichePreset("tech", 350)} />
          <NicheChip current={niche} value="finance" label="🏦 Finance · ₹600" onClick={() => setNichePreset("finance", 600)} />
          <NicheChip current={niche} value="insurance" label="🛡️ Insurance / Loans · ₹1200" onClick={() => setNichePreset("insurance", 1200)} />
          <NicheChip current={niche} value="health" label="🩺 Health / Pharma · ₹400" onClick={() => setNichePreset("health", 400)} />
          <NicheChip current={niche} value="business" label="📊 B2B Software · ₹800" onClick={() => setNichePreset("business", 800)} />
        </div>
      </div>

      {/* Inputs */}
      <div className="result-card">
        <h3 className="font-bold text-gray-800 mb-1">📊 Traffic + ad setup</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">
              Monthly pageviews
            </label>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              value={monthlyPageviews}
              onChange={(e) => setMonthlyPageviews(e.target.value)}
              className="calc-input"
              placeholder="e.g. 100000"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              From Google Analytics / Search Console. Not sessions or users.
            </p>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">
              RPM (₹ per 1,000 impressions)
            </label>
            <input
              type="number"
              inputMode="decimal"
              step={0.01}
              min={0}
              value={rpmINR}
              onChange={(e) => setRpmINR(e.target.value)}
              className="calc-input"
              placeholder="e.g. 150"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              From AdSense / Ezoic dashboard. India avg blended: ₹40-300.
            </p>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">
              Ad units per page
            </label>
            <input
              type="number"
              inputMode="decimal"
              step={1}
              min={1}
              value={adsPerPage}
              onChange={(e) => setAdsPerPage(e.target.value)}
              className="calc-input"
              placeholder="e.g. 3"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              AdSense allows up to ~3 display + multiple link units. Mediavine packs 5-7.
            </p>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">
              Viewability rate (%)
            </label>
            <input
              type="number"
              inputMode="decimal"
              step={1}
              min={0}
              max={100}
              value={viewabilityPct}
              onChange={(e) => setViewabilityPct(e.target.value)}
              className="calc-input"
              placeholder="e.g. 60"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              % of ads actually viewed. Industry standard: 50-70%.
            </p>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">
              Fill rate (%)
            </label>
            <input
              type="number"
              inputMode="decimal"
              step={1}
              min={0}
              max={100}
              value={fillRatePct}
              onChange={(e) => setFillRatePct(e.target.value)}
              className="calc-input"
              placeholder="e.g. 85"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              % of ad slots that show a paid ad. AdSense India: 80-95%.
            </p>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">
              USD/INR rate (for USD display)
            </label>
            <input
              type="number"
              inputMode="decimal"
              step={0.01}
              min={0}
              value={usdInr}
              onChange={(e) => setUsdInr(e.target.value)}
              className="calc-input"
              placeholder="e.g. 85"
            />
          </div>
        </div>
      </div>

      {/* Output */}
      {result ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl p-4 text-center">
              <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                Monthly revenue
              </div>
              <div className="text-2xl font-extrabold text-indigo-900 mt-1">
                {fmtINR(result.monthlyRevenue)}
              </div>
              <div className="text-[11px] text-indigo-700 mt-1">
                {fmtUSD(result.monthlyRevenueUSD)} · before tax
              </div>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl p-4 text-center">
              <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
                After tax (30% slab)
              </div>
              <div className="text-2xl font-extrabold text-emerald-900 mt-1">
                {fmtINR(result.monthlyRevenueAfterTax)}
              </div>
              <div className="text-[11px] text-emerald-700 mt-1">
                slab + 4% cess assumption
              </div>
            </div>
            <div className={`${v.bg} border-2 ${v.border} rounded-2xl p-4 text-center`}>
              <div className={`text-xs font-semibold uppercase tracking-wider ${v.color}`}>
                Annual revenue
              </div>
              <div className={`text-2xl font-extrabold mt-1 ${v.color}`}>
                {fmtINR(result.annualRevenue)}
              </div>
              <div className={`text-[11px] mt-1 ${v.color}`}>
                {fmtINR(result.perThousandViews)} per 1k pageviews
              </div>
            </div>
          </div>

          <div className={`${v.bg} border ${v.border} rounded-2xl p-5`}>
            <h3 className={`font-bold text-lg ${v.color}`}>
              {v.emoji} {result.verdictTitle}
            </h3>
            <p className={`mt-2 text-sm leading-relaxed ${v.color}`}>{result.verdictBody}</p>
          </div>

          <div className="result-card">
            <h3 className="font-bold text-gray-800 mb-3">🔢 The math behind the number</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 text-gray-600">Monthly pageviews</td>
                    <td className="py-2 text-right tabular-nums font-bold">
                      {parseInt(monthlyPageviews).toLocaleString("en-IN")}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 text-gray-600">× Ad units per page</td>
                    <td className="py-2 text-right tabular-nums font-bold">
                      {parseFloat(adsPerPage)}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 text-gray-600">× Viewability</td>
                    <td className="py-2 text-right tabular-nums font-bold">
                      {viewabilityPct}%
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 text-gray-600">× Fill rate</td>
                    <td className="py-2 text-right tabular-nums font-bold">
                      {fillRatePct}%
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-2 text-gray-600 font-bold">= Paid impressions / month</td>
                    <td className="py-2 text-right tabular-nums font-bold text-indigo-700">
                      {Math.round(result.monthlyImpressions).toLocaleString("en-IN")}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 text-gray-600">× RPM (per 1,000 impressions)</td>
                    <td className="py-2 text-right tabular-nums font-bold">{fmtINR(parseFloat(rpmINR), 2)}</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-2 text-gray-600 font-bold">= Monthly revenue</td>
                    <td className="py-2 text-right tabular-nums font-bold text-emerald-700">
                      {fmtINR(result.monthlyRevenue)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center text-sm text-gray-500">
          Enter monthly pageviews and RPM to see your projected ad revenue.
        </div>
      )}

      {/* India RPM benchmarks */}
      <div className="result-card">
        <h3 className="font-bold text-gray-800 mb-3">📊 India RPM benchmarks by niche (2024-26)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-gray-500 uppercase tracking-wide">
              <tr>
                <th className="text-left py-2 pr-3">Niche</th>
                <th className="text-left py-2 pr-3">India RPM</th>
                <th className="text-left py-2 pr-3">US RPM (reference)</th>
                <th className="text-left py-2">India / US gap</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {[
                ["Entertainment / memes", "₹30-80", "$8-15", "12-15×"],
                ["News / current affairs", "₹40-100", "$5-12", "8-10×"],
                ["Lifestyle / fashion", "₹50-150", "$8-20", "10-12×"],
                ["General blog / how-to", "₹80-250", "$10-25", "8-10×"],
                ["Travel", "₹100-300", "$15-30", "8-10×"],
                ["Parenting / family", "₹150-400", "$15-35", "8×"],
                ["Health / wellness", "₹200-600", "$20-40", "7-8×"],
                ["Tech / SaaS reviews", "₹250-800", "$20-50", "8×"],
                ["Personal finance / investing", "₹400-1,200", "$30-80", "5-7×"],
                ["B2B software / enterprise", "₹600-1,500", "$40-100", "5-7×"],
                ["Insurance / loans / credit cards", "₹800-2,500", "$50-150", "5-6×"],
              ].map(([niche, india, us, gap], i) => (
                <tr key={i} className="border-t border-gray-100">
                  <td className="py-2 pr-3 font-bold">{niche}</td>
                  <td className="py-2 pr-3">{india}</td>
                  <td className="py-2 pr-3 text-gray-500">{us}</td>
                  <td className="py-2 text-amber-700">{gap}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[11px] text-gray-500 mt-3">
          Aggregated from AdSense disclosures by Indian publishers (multiple sources), Mediavine /
          Ezoic public RPM reports, and Adsterra / PropellerAds India benchmarks 2024-26.
          Premium ad networks (Mediavine, Raptive, AdThrive) typically require US/UK/CA traffic
          majority — India-traffic-only sites usually run AdSense + Ezoic. Direct programmatic
          (Google Ad Manager) can lift RPM 30-60% above raw AdSense at 100K+ pageviews/mo.
        </p>
      </div>

      {/* Formula */}
      <div className="result-card">
        <h3 className="font-bold text-gray-800 mb-1">📐 The exact formula</h3>
        <pre className="bg-gray-900 text-green-200 text-xs sm:text-sm rounded-xl p-4 overflow-x-auto leading-relaxed">
{`Paid impressions    = Pageviews × Ads per page × Viewability % × Fill rate %
Monthly revenue (₹) = (Paid impressions ÷ 1,000) × RPM
Annual revenue      = Monthly revenue × 12
Effective per-1k    = Monthly revenue ÷ Pageviews × 1,000   (often called "page RPM")
After-tax estimate  = Monthly revenue × (1 − 31.2%)    (30% slab + 4% cess assumption)`}
        </pre>
        <p className="text-xs text-gray-600 mt-3 leading-relaxed">
          The four multipliers (ads/page × viewability × fill rate ÷ 1000) is why raw RPM
          quoted on most public dashboards overstates real take. A 100K pageview / month site
          with ₹150 RPM, 3 ads/page, 60% viewability, 85% fill produces ~153K paid
          impressions and ~₹23K monthly revenue — well below the &quot;100K × 150/1000 = ₹15K&quot;
          intuition that ignores ad count, OR the &quot;100K × 3 × 150/1000 = ₹45K&quot;
          intuition that ignores viewability + fill.
        </p>
      </div>

      {/* FAQ */}
      <div className="result-card">
        <h3 className="font-bold text-gray-800 mb-3">❓ FAQs</h3>
        <div className="space-y-4 text-sm">
          <div>
            <h4 className="font-bold text-gray-800">
              Why is AdSense RPM so much lower in India than in the US?
            </h4>
            <p className="text-gray-600 mt-1">
              Three structural reasons. <strong>(1) Advertiser CPC</strong> — Indian advertisers
              bid 5-10× less per click than US advertisers because the underlying purchasing
              power and conversion value is lower (a click that turns into ₹500 in revenue in
              India is worth less than one that turns into $50 / ₹4,200 in the US).
              <strong>(2) Currency translation</strong> — Google pays Indian publishers in INR
              after FX. <strong>(3) Demand-supply</strong> — there are simply fewer Indian
              advertisers with substantial display-ad budgets than US ones, so the auction
              floor is lower. The 5-20× gap is real and isn&apos;t something publishers can
              negotiate away — only changing the audience country mix helps.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">
              What&apos;s a realistic AdSense RPM for an Indian blog in 2026?
            </h4>
            <p className="text-gray-600 mt-1">
              For a content site with majority-India traffic running raw AdSense:{" "}
              <strong>₹40-100 RPM is the floor</strong> (general / entertainment / news),
              <strong> ₹100-400 RPM is healthy</strong> (lifestyle, tech, health),
              <strong> ₹400-1,500 RPM is premium</strong> (finance, insurance, B2B software).
              Above ₹1,500 RPM usually means either (a) you have substantial US/UK traffic
              mix, or (b) you&apos;re running a niche where every click is worth a ₹2,000+
              lead (insurance, mortgages, enterprise SaaS comparisons).
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">
              When does AdSense become worthwhile in India?
            </h4>
            <p className="text-gray-600 mt-1">
              Practically: <strong>at 50,000+ monthly pageviews</strong> for premium niches
              (finance, tech) where you can earn ₹15-50K/month. For general-content sites,
              the practical floor is closer to <strong>200,000+ monthly pageviews</strong>{" "}
              because RPM is lower. Below those thresholds your time-to-payout-threshold
              (₹6,800 / $100 AdSense minimum) is too long and you&apos;re better off
              monetising directly (sponsored content, affiliate, info products). Don&apos;t
              add AdSense to a 10K-pageview blog hoping it&apos;ll pay for hosting —
              it won&apos;t, and the ads will hurt UX and SEO.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">
              How is AdSense income taxed in India?
            </h4>
            <p className="text-gray-600 mt-1">
              <strong>Income tax (ITR)</strong>: AdSense earnings are business income.
              Below ₹50L annual receipts you can use{" "}
              <strong>Section 44ADA (presumptive tax, 50%)</strong> if you fall under the
              professional services category, or Section 44AD (8% / 6% for digital) for
              business income. Above ₹50L you file regular ITR-3 with full books.{" "}
              <strong>GST</strong>: Google AdSense payments are{" "}
              <strong>import of service under Section 9(1)(b) CGST Act</strong> — reverse
              charge applies if your turnover crosses ₹20L. You pay 18% GST on the AdSense
              receipt amount but can claim input credit if you have GST-registered business
              expenses. Most Indian AdSense publishers above ₹20L turnover register and use
              reverse-charge mechanism. Always check with a CA familiar with digital business
              income — penalties for non-compliance are harsh.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">
              Are Mediavine, Raptive (AdThrive) or Ezoic available for Indian publishers?
            </h4>
            <p className="text-gray-600 mt-1">
              <strong>Ezoic</strong>: yes, accepts Indian publishers at 10,000+ monthly sessions.
              RPM typically 2-3× AdSense for the same traffic. Indian publishers commonly land
              ₹200-1,500 Ezoic RPM depending on niche.{" "}
              <strong>Mediavine</strong>: requires 50K monthly sessions and prefers
              US/CA/UK/AU traffic majority — India-only sites are usually rejected. If
              accepted, RPM jumps another 1.5-2× over Ezoic.{" "}
              <strong>Raptive (formerly AdThrive)</strong>: highest tier, 100K+ monthly
              sessions required, US/UK/CA traffic majority strictly enforced. Practical
              path for Indian publishers: start AdSense → migrate to Ezoic at 10K sessions →
              attempt Mediavine at 50K if traffic mix supports it.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">
              How can I increase RPM without writing new content?
            </h4>
            <p className="text-gray-600 mt-1">
              Five proven moves: (1){" "}
              <strong>improve ad placement</strong> — above-fold sidebar sticky, in-content after
              the first paragraph, end-of-article all lift RPM 20-50%; (2){" "}
              <strong>improve page speed</strong> (Core Web Vitals) — fast pages have higher
              viewability, which lifts RPM 15-30%; (3){" "}
              <strong>improve audience country mix</strong> — even small US/UK traffic share
              changes the blended RPM substantially because their per-impression value is 5-10×
              Indian; (4) <strong>switch to a higher-tier ad network</strong> (Ezoic / Mediavine);
              (5) <strong>direct sponsorships</strong> — bypassing programmatic to sell directly
              to advertisers in your niche typically yields 3-5× display-ad RPM but takes
              relationship-building time.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">
              What&apos;s the difference between CPM, RPM, and eCPM?
            </h4>
            <p className="text-gray-600 mt-1">
              <strong>CPM</strong> (cost per mille) is what the advertiser pays per 1,000
              impressions — a buyer-side metric. <strong>RPM</strong> (revenue per mille) is
              what the publisher receives per 1,000 impressions (or per 1,000 pageviews,
              depending on context) — a seller-side metric. <strong>eCPM</strong> (effective
              CPM) is a blended version when revenue comes from CPC + CPM ads mixed — total
              revenue ÷ total impressions × 1,000. AdSense dashboards show "Page RPM"
              (revenue per 1,000 pageviews) and "Impression RPM" (per 1,000 ad impressions);
              this calculator uses Impression RPM as the primary input. Most "$10 RPM" claims
              online are page RPM, not impression RPM — they&apos;ll be lower than they sound
              once you account for ad count per page.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">
              Is going programmatic with Google Ad Manager worth it?
            </h4>
            <p className="text-gray-600 mt-1">
              At 100K+ monthly pageviews and a healthy niche RPM, Google Ad Manager (formerly
              DoubleClick for Publishers) lets you run header bidding (Prebid.js + multiple
              demand partners) which typically lifts RPM 30-60% over raw AdSense. Setup is
              moderately technical and ongoing optimisation matters — most Indian publishers
              outsource this to ad-operations consultants (₹15-50K/month retainer). Below
              100K pageviews / month, the lift doesn&apos;t justify the operational complexity;
              stick with AdSense + Ezoic.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function NicheChip({
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
