"use client";
import { useMemo, useState } from "react";

/**
 * Startup Post-Money Valuation Calculator — handles the full Indian
 * funding-round math, not just the textbook pre/post formula:
 *
 *   - Pre-money & post-money valuation
 *   - Founders' remaining equity after dilution
 *   - ESOP pool top-up (pre-money OR post-money creation — both are
 *     common; the choice materially changes founder dilution)
 *   - Per-share price (if shares outstanding is provided)
 *   - Dilution summary (founders, prior investors, new investors, ESOP)
 *
 * The ESOP "shuffle" — whether the new ESOP pool is created pre-money
 * (founders bear the dilution) or post-money (new investors share the
 * dilution) — is the single most misunderstood part of a term sheet
 * and where founders consistently lose 2-4% of their equity. We surface
 * BOTH scenarios side-by-side so the user can see the real cost.
 */

interface Inputs {
  investment: number; // ₹
  investorEquityPct: number; // %
  existingEsopPct: number; // % already vested/granted before this round
  newEsopTopUpPct: number; // % to add to ESOP pool for the round
  esopPreMoney: boolean; // true = pool created BEFORE investor maths
  sharesOutstanding: number; // optional — for per-share pricing
}

interface Capline {
  label: string;
  pct: number;
  color: string;
}

function fmtCr(n: number): string {
  if (!isFinite(n) || n <= 0) return "—";
  const cr = n / 1_00_00_000;
  if (cr >= 1) return `₹${cr.toFixed(2)} Cr`;
  const lakh = n / 1_00_000;
  if (lakh >= 1) return `₹${lakh.toFixed(2)} L`;
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n) + " ₹";
}

function fmtINR(n: number, max = 0): string {
  if (!isFinite(n)) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: max,
  }).format(Math.round(n));
}

interface Result {
  postMoney: number;
  preMoney: number;
  founderPct: number;
  investorPct: number;
  totalEsopPct: number;
  pricePerShare: number | null;
  newSharesIssued: number | null;
  cap: Capline[];
  warnings: string[];
}

function compute(i: Inputs): Result | null {
  const inv = i.investment;
  const ip = i.investorEquityPct / 100;
  const existingEsop = i.existingEsopPct / 100;
  const newEsop = i.newEsopTopUpPct / 100;
  if (inv <= 0 || ip <= 0 || ip >= 1) return null;

  const postMoney = inv / ip;
  const preMoney = postMoney - inv;

  // Dilution math — depends on whether the new ESOP top-up is pre-money or post-money.
  let founderPct: number, totalEsopPct: number, investorPct: number;

  if (i.esopPreMoney) {
    // Pool created BEFORE the round — founders absorb the full ESOP dilution.
    // Existing founder% (= 100 - existing ESOP) gets diluted by (1 - newEsop - ip).
    const founderBefore = 1 - existingEsop;
    // After pool top-up (pre-money) the founders' share of pre-money becomes
    // founderBefore * (1 - newEsop). Then investor takes ip of post-money.
    founderPct = founderBefore * (1 - newEsop) * (1 - ip);
    totalEsopPct = (existingEsop * (1 - newEsop) + newEsop) * (1 - ip);
    investorPct = ip;
  } else {
    // Pool created AFTER the round — investor shares the dilution too.
    // Existing cap-table is diluted by ip, then everyone is diluted by newEsop.
    const founderBefore = 1 - existingEsop;
    founderPct = founderBefore * (1 - ip) * (1 - newEsop);
    investorPct = ip * (1 - newEsop);
    totalEsopPct = existingEsop * (1 - ip) * (1 - newEsop) + newEsop;
  }

  // Per-share pricing (optional, only if user gave shares outstanding).
  let pricePerShare: number | null = null;
  let newSharesIssued: number | null = null;
  if (i.sharesOutstanding > 0) {
    // Price = pre-money / shares outstanding (pre-round).
    pricePerShare = preMoney / i.sharesOutstanding;
    if (pricePerShare > 0) {
      newSharesIssued = inv / pricePerShare;
    }
  }

  const cap: Capline[] = [
    { label: "Founders & existing team", pct: founderPct * 100, color: "bg-indigo-500" },
    { label: "New investor (this round)", pct: investorPct * 100, color: "bg-emerald-500" },
    { label: "Total ESOP pool", pct: totalEsopPct * 100, color: "bg-amber-500" },
  ];

  const warnings: string[] = [];
  if (founderPct < 0.5 && i.existingEsopPct + i.newEsopTopUpPct < 30) {
    warnings.push(
      "Founder ownership is dropping below 50% — investors will want a strong post-money picture, but founders below 50% lose effective control. Negotiate a smaller round or higher valuation."
    );
  }
  if (i.esopPreMoney && i.newEsopTopUpPct > 0) {
    warnings.push(
      `Pre-money ESOP top-up of ${i.newEsopTopUpPct}% costs YOU (the founders) the full pool — investors pay 0% of it. Indian-stage-A norm is post-money pool creation; push back in negotiation.`
    );
  }
  if (i.investorEquityPct > 30) {
    warnings.push(
      "Giving up >30% in a single round is high. Indian Series A typically lands 15–25%. Above 30% signals weak negotiating position or distressed terms."
    );
  }
  if (i.investorEquityPct < 5 && inv >= 1_00_00_000) {
    warnings.push(
      "Implied valuation looks very high for the cheque size. Make sure the valuation matches your traction — over-valued seed rounds make Series A harder (down-round risk)."
    );
  }

  return {
    postMoney,
    preMoney,
    founderPct: founderPct * 100,
    investorPct: investorPct * 100,
    totalEsopPct: totalEsopPct * 100,
    pricePerShare,
    newSharesIssued,
    cap,
    warnings,
  };
}

export default function StartupValuationCalculator() {
  const [investment, setInvestment] = useState("50000000"); // ₹5 Cr default — typical India seed
  const [investorEquityPct, setInvestorEquityPct] = useState("20");
  const [existingEsopPct, setExistingEsopPct] = useState("0");
  const [newEsopTopUpPct, setNewEsopTopUpPct] = useState("10");
  const [esopPreMoney, setEsopPreMoney] = useState(true); // Conservative default — investor-preferred
  const [sharesOutstanding, setSharesOutstanding] = useState("10000");

  const result = useMemo(
    () =>
      compute({
        investment: parseFloat(investment) || 0,
        investorEquityPct: parseFloat(investorEquityPct) || 0,
        existingEsopPct: parseFloat(existingEsopPct) || 0,
        newEsopTopUpPct: parseFloat(newEsopTopUpPct) || 0,
        esopPreMoney,
        sharesOutstanding: parseFloat(sharesOutstanding) || 0,
      }),
    [
      investment,
      investorEquityPct,
      existingEsopPct,
      newEsopTopUpPct,
      esopPreMoney,
      sharesOutstanding,
    ]
  );

  // Compute the OTHER ESOP scenario in parallel so we can compare them side-by-side.
  const other = useMemo(
    () =>
      compute({
        investment: parseFloat(investment) || 0,
        investorEquityPct: parseFloat(investorEquityPct) || 0,
        existingEsopPct: parseFloat(existingEsopPct) || 0,
        newEsopTopUpPct: parseFloat(newEsopTopUpPct) || 0,
        esopPreMoney: !esopPreMoney,
        sharesOutstanding: parseFloat(sharesOutstanding) || 0,
      }),
    [
      investment,
      investorEquityPct,
      existingEsopPct,
      newEsopTopUpPct,
      esopPreMoney,
      sharesOutstanding,
    ]
  );

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="result-card">
        <h3 className="font-bold text-gray-800 mb-1">💼 Round terms</h3>
        <p className="text-xs text-gray-500 mb-4">
          Enter the cheque size, equity %, and ESOP details from your term sheet. Indian
          Series A typically lands at ₹15-50 Cr for 15-25% equity.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">
              Investment amount (₹)
            </label>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              value={investment}
              onChange={(e) => setInvestment(e.target.value)}
              className="calc-input"
              placeholder="e.g. 50000000 (5 Cr)"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              In rupees. Use 50000000 for ₹5 crore.
            </p>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">
              Equity given to new investor (%)
            </label>
            <input
              type="number"
              inputMode="decimal"
              min={0}
              max={99}
              step={0.1}
              value={investorEquityPct}
              onChange={(e) => setInvestorEquityPct(e.target.value)}
              className="calc-input"
              placeholder="e.g. 20"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              Pre-seed: 10–20%, Seed: 15–25%, Series A: 15–25%.
            </p>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">
              Existing ESOP pool (%)
            </label>
            <input
              type="number"
              inputMode="decimal"
              min={0}
              max={50}
              step={0.5}
              value={existingEsopPct}
              onChange={(e) => setExistingEsopPct(e.target.value)}
              className="calc-input"
              placeholder="e.g. 0"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              0% if first round. Otherwise current pool size.
            </p>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">
              New ESOP top-up (%)
            </label>
            <input
              type="number"
              inputMode="decimal"
              min={0}
              max={30}
              step={0.5}
              value={newEsopTopUpPct}
              onChange={(e) => setNewEsopTopUpPct(e.target.value)}
              className="calc-input"
              placeholder="e.g. 10"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              Investors usually require pool of 10–15% post-round.
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
          <input
            id="esop-pre"
            type="checkbox"
            checked={esopPreMoney}
            onChange={(e) => setEsopPreMoney(e.target.checked)}
            className="h-4 w-4"
          />
          <label htmlFor="esop-pre" className="text-xs text-amber-800 leading-tight">
            <strong>Create new ESOP pool pre-money</strong> (founders absorb the dilution).
            Uncheck if pool is created post-money — investors share the dilution. This single
            choice typically costs founders 2-4% of equity. We compare both scenarios below.
          </label>
        </div>

        <div className="mt-3">
          <label className="text-sm font-semibold text-gray-700 block mb-1">
            Shares outstanding (optional, for per-share price)
          </label>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            value={sharesOutstanding}
            onChange={(e) => setSharesOutstanding(e.target.value)}
            className="calc-input"
            placeholder="e.g. 10000"
          />
          <p className="text-[11px] text-gray-400 mt-1">
            Total shares outstanding BEFORE this round. Leave 0 to skip per-share math.
          </p>
        </div>
      </div>

      {/* Output */}
      {result ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl p-4 text-center">
              <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                Pre-money valuation
              </div>
              <div className="text-2xl font-extrabold text-indigo-900 mt-1">
                {fmtCr(result.preMoney)}
              </div>
              <div className="text-[11px] text-indigo-700 mt-1">
                what your company was worth BEFORE the cheque
              </div>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl p-4 text-center">
              <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
                Post-money valuation
              </div>
              <div className="text-2xl font-extrabold text-emerald-900 mt-1">
                {fmtCr(result.postMoney)}
              </div>
              <div className="text-[11px] text-emerald-700 mt-1">
                what your company is worth AFTER the cheque lands
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-4 text-center">
              <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                Founders' stake after
              </div>
              <div className="text-2xl font-extrabold text-blue-900 mt-1">
                {result.founderPct.toFixed(1)}%
              </div>
              <div className="text-[11px] text-blue-700 mt-1">
                your remaining equity after dilution
              </div>
            </div>
          </div>

          {/* Cap-table bar */}
          <div className="result-card">
            <h3 className="font-bold text-gray-800 mb-3">📊 Post-round cap table</h3>
            <div className="h-6 rounded-full overflow-hidden flex">
              {result.cap.map((c) => (
                <div
                  key={c.label}
                  className={c.color}
                  style={{ width: `${c.pct}%` }}
                  title={`${c.label}: ${c.pct.toFixed(1)}%`}
                />
              ))}
            </div>
            <div className="mt-3 space-y-1 text-sm">
              {result.cap.map((c) => (
                <div key={c.label} className="flex items-center gap-2">
                  <span className={`inline-block h-3 w-3 rounded ${c.color}`} />
                  <span className="flex-1 text-gray-700">{c.label}</span>
                  <span className="font-bold text-gray-900 tabular-nums">
                    {c.pct.toFixed(2)}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Per-share + ESOP scenario comparison */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {result.pricePerShare !== null && (
              <div className="result-card">
                <h3 className="font-bold text-gray-800 mb-3">💵 Per-share math</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price per share</span>
                    <span className="font-bold">{fmtINR(result.pricePerShare, 2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">New shares issued</span>
                    <span className="font-bold">
                      {result.newSharesIssued !== null
                        ? Math.round(result.newSharesIssued).toLocaleString("en-IN")
                        : "—"}
                    </span>
                  </div>
                </div>
              </div>
            )}
            {other && (
              <div className="result-card">
                <h3 className="font-bold text-gray-800 mb-2">
                  🔄 If ESOP pool was {esopPreMoney ? "post-money" : "pre-money"} instead
                </h3>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Founders'</span>
                    <span
                      className={`font-bold tabular-nums ${
                        other.founderPct > result.founderPct
                          ? "text-green-700"
                          : "text-red-700"
                      }`}
                    >
                      {other.founderPct.toFixed(2)}% (
                      {other.founderPct > result.founderPct ? "+" : ""}
                      {(other.founderPct - result.founderPct).toFixed(2)})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Investor's</span>
                    <span className="font-bold tabular-nums">
                      {other.investorPct.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total ESOP</span>
                    <span className="font-bold tabular-nums">
                      {other.totalEsopPct.toFixed(2)}%
                    </span>
                  </div>
                </div>
                <p className="text-[10px] text-gray-500 mt-3">
                  Negotiate the side you prefer — investors push pre-money; founders push
                  post-money. The choice is worth real percentage points of your company.
                </p>
              </div>
            )}
          </div>

          {/* Warnings */}
          {result.warnings.length > 0 && (
            <div className="result-card bg-amber-50 border-amber-200">
              <h3 className="font-bold text-amber-900 mb-2">⚠️ Watch out</h3>
              <ul className="space-y-2 text-sm text-amber-800 list-disc list-inside">
                {result.warnings.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center text-sm text-gray-500">
          Enter the investment amount and investor equity % to see the valuation, cap table
          and dilution.
        </div>
      )}

      {/* Indian benchmarks table */}
      <div className="result-card">
        <h3 className="font-bold text-gray-800 mb-3">
          📊 Indian startup funding benchmarks (2024-26)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-gray-500 uppercase tracking-wide">
              <tr>
                <th className="text-left py-2 pr-3">Stage</th>
                <th className="text-left py-2 pr-3">Typical cheque</th>
                <th className="text-left py-2 pr-3">Equity given</th>
                <th className="text-left py-2">Typical post-money</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              <tr className="border-t border-gray-100">
                <td className="py-2 pr-3 font-bold">Pre-seed / Angel</td>
                <td className="py-2 pr-3">₹50 L – ₹3 Cr</td>
                <td className="py-2 pr-3">10–20%</td>
                <td className="py-2">₹3–15 Cr</td>
              </tr>
              <tr className="border-t border-gray-100">
                <td className="py-2 pr-3 font-bold">Seed</td>
                <td className="py-2 pr-3">₹3 Cr – ₹10 Cr</td>
                <td className="py-2 pr-3">15–25%</td>
                <td className="py-2">₹15–60 Cr</td>
              </tr>
              <tr className="border-t border-gray-100">
                <td className="py-2 pr-3 font-bold">Series A</td>
                <td className="py-2 pr-3">₹15 Cr – ₹50 Cr</td>
                <td className="py-2 pr-3">15–25%</td>
                <td className="py-2">₹75 Cr – ₹3 Cr</td>
              </tr>
              <tr className="border-t border-gray-100">
                <td className="py-2 pr-3 font-bold">Series B</td>
                <td className="py-2 pr-3">₹50 Cr – ₹200 Cr</td>
                <td className="py-2 pr-3">10–20%</td>
                <td className="py-2">₹250 Cr – ₹2,000 Cr</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-[11px] text-gray-500 mt-3">
          Benchmarks aggregated from Tracxn, Inc42, YourStory deal data and public Series A
          deck filings (2024–26). Bullish-market multiples skew 20–40% higher; bear markets
          tighten 30–50%. SaaS commands a 2–3× valuation premium vs services / commerce.
        </p>
      </div>

      {/* Formula block */}
      <div className="result-card">
        <h3 className="font-bold text-gray-800 mb-1">📐 The exact formulas</h3>
        <pre className="bg-gray-900 text-green-200 text-xs sm:text-sm rounded-xl p-4 overflow-x-auto leading-relaxed">
{`Post-money valuation = Investment ÷ Investor's equity %
Pre-money valuation  = Post-money − Investment
Price per share      = Pre-money ÷ Shares outstanding (pre-round)
New shares issued    = Investment ÷ Price per share

ESOP pre-money:
  Founder % = (1 − Existing ESOP) × (1 − New ESOP) × (1 − Investor %)

ESOP post-money:
  Founder % = (1 − Existing ESOP) × (1 − Investor %) × (1 − New ESOP)
  Investor % = Investor's equity × (1 − New ESOP)`}
        </pre>
        <p className="text-xs text-gray-600 mt-3 leading-relaxed">
          The ESOP-pool placement (pre-money vs post-money) is the single most contested
          clause in an Indian term sheet. Investors prefer pre-money creation because
          founders absorb the full pool dilution. Founders should push for post-money
          creation, where investors share the pool cost proportionally. For a ₹50 Cr round
          at 20% with a 10% pool top-up, the difference is roughly 2 percentage points of
          founder equity — material money on a 7-year horizon.
        </p>
      </div>

      {/* FAQ */}
      <div className="result-card">
        <h3 className="font-bold text-gray-800 mb-3">❓ FAQs</h3>
        <div className="space-y-4 text-sm">
          <div>
            <h4 className="font-bold text-gray-800">
              What's the difference between pre-money and post-money valuation?
            </h4>
            <p className="text-gray-600 mt-1">
              <strong>Pre-money</strong> is what the company is worth right before the
              investor's cheque clears. <strong>Post-money</strong> is pre-money plus the
              investment. If your company is pre-money valued at ₹40 Cr and an investor
              puts in ₹10 Cr for 20% equity, your post-money is ₹50 Cr. Term sheets
              quote post-money in India almost universally because that's what gets reported
              in TechCrunch / Inc42 headlines and what investor returns are calculated
              against at exit.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">
              Should the new ESOP pool be created pre-money or post-money? (India context)
            </h4>
            <p className="text-gray-600 mt-1">
              Term sheets default to <strong>pre-money pool creation</strong> — which means
              founders absorb the full ESOP dilution and investors don&apos;t. Indian VCs
              from Accel, Peak XV, Lightspeed, Matrix all push for this. The founder
              push-back: &quot;the pool exists to attract talent that helps me grow YOUR
              investment too — share the cost proportionally.&quot; A reasonable compromise
              is <strong>splitting the dilution 50/50</strong> — half pre-money, half
              post-money. On a ₹50 Cr round at 20% with a 10% pool, that 50/50 split
              recovers roughly 1 percentage point of founder equity vs pure pre-money —
              over 7 years that compounds to real money.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">
              What's a fair Series A valuation for an Indian SaaS startup in 2026?
            </h4>
            <p className="text-gray-600 mt-1">
              Indian SaaS Series A 2025-26 reality: <strong>₹75 Cr – ₹250 Cr post-money</strong>
              {" "}
              for ₹15-50 Cr cheques at 15-25% equity. Multiples depend on traction — ₹1 Cr
              ARR with strong NRR (110%+) and reasonable LTV:CAC (3x+) commands ~30-40× ARR
              post-money. ₹2-3 Cr ARR with the same metrics: 20-30× ARR. SMB/India-only
              SaaS multiplies lower (10-20× ARR) because the TAM ceiling is smaller. Lower
              multiples than 2021 peak — that bubble is over and term sheets reflect it.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">
              Is a SAFE the same as a Compulsorily Convertible Debenture (CCD) in India?
            </h4>
            <p className="text-gray-600 mt-1">
              No. <strong>SAFE</strong> (Simple Agreement for Future Equity) is the US YC
              format — not formally enforceable under Indian Companies Act, so SAFEs that
              get used in India are usually pursued as best-efforts with a CCD or equity
              backstop. <strong>CCD</strong> (Compulsorily Convertible Debenture) is the
              Indian instrument that does the same job — debt today that mandatorily
              converts to equity at the next priced round. CCDs avoid valuation negotiation
              at the early stage and let the next round&apos;s investor set the price. CCDs
              are FEMA-compliant for foreign investors; SAFEs are not, so foreign-investor
              rounds in India structure as CCDs.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">
              What happens to founder ownership after a Series A, B, C?
            </h4>
            <p className="text-gray-600 mt-1">
              Typical Indian SaaS founder dilution path: <strong>seed</strong> (20% to
              investor + 10% ESOP) = founders at ~63%. <strong>Series A</strong> (20% to
              new investor + 5% ESOP top-up) = founders at ~48%. <strong>Series B</strong>
              {" "}
              (15% to new investor + 5% ESOP) = founders at ~38%. <strong>Series C</strong>
              {" "}
              (10% to new investor) = founders at ~34%. At IPO, public-market founders
              typically hold 12-25% (Zerodha, Zomato, Nykaa filings show the range). The
              steepest dilution is at seed + Series A — protect that by maximising valuation
              and minimising pool top-ups in those rounds.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">
              How do anti-dilution clauses change this math?
            </h4>
            <p className="text-gray-600 mt-1">
              Anti-dilution protection (full ratchet or weighted average) ONLY triggers in a
              <strong> down round</strong> — i.e., when the next round&apos;s share price is
              lower than the current round&apos;s. If you raise at progressively higher
              valuations (the goal!), anti-dilution is dormant. If you raise a down round,
              broad-based weighted-average is the standard Indian protection — it&apos;s
              less punitive than full ratchet. Either way, the down-round causes founder
              dilution above what this calculator shows; in that case you&apos;d recompute
              with the new lower per-share price.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">
              Capital gains tax on founder dilution — do I owe anything when investors come in?
            </h4>
            <p className="text-gray-600 mt-1">
              <strong>No — issuance of fresh shares to a new investor is not a transfer
              event for the founder</strong>, so no LTCG or STCG is triggered. The investor
              pays for new shares the company issues. You only pay capital gains tax when
              YOU sell shares — in a secondary sale, OSOP exercise + sale, or an exit
              (acquisition / IPO). Indian LTCG on unlisted shares: 12.5% (post-23-Jul-2024
              rules, no indexation), with the holding period requirement of 24 months for
              LTCG classification. Talk to a CA before any secondary sale — Section 50CA
              (deemed sale value) and FMV rules can surprise founders.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
