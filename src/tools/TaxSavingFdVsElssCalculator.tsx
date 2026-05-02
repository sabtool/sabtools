"use client";
import { useState, useMemo } from "react";

/**
 * Tax-Saving FD vs ELSS Comparator (India)
 *
 * Both Tax-Saving FD and ELSS qualify for Section 80C deduction (max ₹1.5L
 * per year). Both popular among 80C-seekers. But returns and tax-treatment
 * are very different over 5+ years.
 *
 * VERIFIED RULES (FY 2025-26):
 *
 * TAX-SAVING FIXED DEPOSIT:
 *  - 5-year LOCK-IN, no premature withdrawal
 *  - Interest: 6.5%–7.5% p.a. (varies by bank); compounded quarterly
 *    (typically), paid quarterly OR at maturity (cumulative option)
 *  - Tax: principal up to ₹1.5L deductible u/s 80C
 *  - INTEREST IS FULLY TAXABLE at slab rate
 *  - TDS @ 10% if annual interest > ₹40K (₹50K for seniors)
 *  - Risk: zero (DICGC insurance up to ₹5L per bank per depositor)
 *
 * ELSS (Equity Linked Savings Scheme — diversified equity mutual fund):
 *  - 3-year LOCK-IN (shortest among 80C options)
 *  - Returns: market-linked. Historical category avg 12-14% p.a. CAGR.
 *    Volatility risk: equity drawdowns of 20-30% possible in bad years
 *  - Tax: principal up to ₹1.5L deductible u/s 80C
 *  - Long-Term Capital Gains: ₹1.25L per year EXEMPT (Sec 112A);
 *    above that taxed at 12.5% (post-Budget 2024) — both apply on sale,
 *    not maturity
 *  - No TDS deducted by AMC
 *  - Lock-in is 3 yrs from each SIP installment date (not just first)
 *
 * KEY TAKEAWAY:
 *  - For HIGH SLAB earners (30%): ELSS dominates after-tax (interest taxed
 *    at 30% vs LTCG at 12.5% with ₹1.25L exemption)
 *  - For LOW SLAB / RISK-AVERSE: Tax-saving FD if 0%/5%/10% slab and
 *    can't tolerate equity volatility
 *  - Lock-in: ELSS 3 yrs vs FD 5 yrs — ELSS gives flexibility 2 yrs earlier
 *
 * Sources:
 *  - https://cleartax.in/s/elss-vs-fd
 *  - https://www.bankbazaar.com/fixed-deposit/elss-vs-fd.html
 *  - https://www.5paisa.com/blog/elss-vs-tax-saving-fd-which-is-the-best-tax-saving-option
 *  - Section 112A LTCG taxation; Section 80C deduction provisions
 */

const SECTION_112A_EXEMPTION = 125_000;
const SECTION_112A_RATE = 0.125;

export default function TaxSavingFdVsElssCalculator() {
  const [investment, setInvestment] = useState<number>(150_000); // ₹1.5L typical 80C
  const [years, setYears] = useState<number>(5);
  const [fdRate, setFdRate] = useState<number>(7);
  const [elssReturn, setElssReturn] = useState<number>(13);
  const [slabRate, setSlabRate] = useState<number>(30);

  const result = useMemo(() => {
    if (
      investment <= 0 ||
      years <= 0 ||
      fdRate <= 0 ||
      elssReturn <= 0 ||
      slabRate < 0
    )
      return null;

    // ====== Tax-Saving FD ======
    // Compounded quarterly, paid at maturity (cumulative)
    const fdQuarterlyRate = fdRate / 4 / 100;
    const fdQuarters = years * 4;
    const fdMaturity = investment * Math.pow(1 + fdQuarterlyRate, fdQuarters);
    const fdInterest = fdMaturity - investment;
    const fdTaxOnInterest = fdInterest * (slabRate / 100);
    const fdNetCorpus = fdMaturity - fdTaxOnInterest;

    // ====== ELSS (lump-sum) ======
    const elssMaturity = investment * Math.pow(1 + elssReturn / 100, years);
    const elssGain = elssMaturity - investment;
    // 112A: ₹1.25L exempt, balance @ 12.5%
    const elssTaxableGain = Math.max(0, elssGain - SECTION_112A_EXEMPTION);
    const elssTaxOnGain = elssTaxableGain * SECTION_112A_RATE;
    const elssNetCorpus = elssMaturity - elssTaxOnGain;

    const winner: "fd" | "elss" | "tie" =
      fdNetCorpus < elssNetCorpus
        ? "elss"
        : fdNetCorpus > elssNetCorpus
        ? "fd"
        : "tie";
    const difference = Math.abs(elssNetCorpus - fdNetCorpus);

    return {
      fdMaturity,
      fdInterest,
      fdTaxOnInterest,
      fdNetCorpus,
      elssMaturity,
      elssGain,
      elssTaxableGain,
      elssTaxOnGain,
      elssNetCorpus,
      winner,
      difference,
    };
  }, [investment, years, fdRate, elssReturn, slabRate]);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <div className="space-y-6">
      <div className="inline-block bg-indigo-100 text-indigo-800 text-sm font-semibold px-4 py-1.5 rounded-full">
        ⚖️ Tax-Saving FD vs ELSS · 80C Comparison
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">
            Investment Amount
          </label>
          <input
            type="number"
            value={investment}
            onChange={(e) => setInvestment(+e.target.value || 0)}
            className="calc-input"
          />
          <p className="text-xs text-gray-500 mt-1">Typical 80C cap: ₹1,50,000</p>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">
            Investment Horizon (years)
          </label>
          <input
            type="number"
            value={years}
            onChange={(e) => setYears(+e.target.value || 0)}
            className="calc-input"
            min={3}
            max={20}
          />
          <p className="text-xs text-gray-500 mt-1">
            FD lock-in 5y · ELSS lock-in 3y
          </p>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">
            Your Tax Slab %
          </label>
          <input
            type="number"
            value={slabRate}
            onChange={(e) => setSlabRate(+e.target.value || 0)}
            className="calc-input"
            min={0}
            max={42}
          />
          <p className="text-xs text-gray-500 mt-1">
            For taxing FD interest (ELSS uses 12.5% LTCG)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">
              Tax-Saving FD Rate %
            </label>
            <span className="text-sm font-bold text-blue-600">{fdRate}%</span>
          </div>
          <input
            type="range"
            min={5}
            max={9}
            step={0.1}
            value={fdRate}
            onChange={(e) => setFdRate(+e.target.value)}
            className="w-full"
          />
        </div>
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">
              ELSS Expected Return %
            </label>
            <span className="text-sm font-bold text-emerald-600">
              {elssReturn}%
            </span>
          </div>
          <input
            type="range"
            min={6}
            max={20}
            step={0.5}
            value={elssReturn}
            onChange={(e) => setElssReturn(+e.target.value)}
            className="w-full"
          />
          <p className="text-xs text-gray-500 mt-1">
            Historic ELSS category avg: 12-14%
          </p>
        </div>
      </div>

      {result && (
        <div className="result-card space-y-4">
          <div
            className={`bg-gradient-to-r ${
              result.winner === "elss"
                ? "from-emerald-500 to-teal-600"
                : result.winner === "fd"
                ? "from-blue-500 to-indigo-600"
                : "from-gray-500 to-gray-600"
            } rounded-2xl p-6 text-white`}
          >
            <div className="text-sm font-medium opacity-80 mb-1">
              {result.winner === "tie"
                ? "Both produce identical net corpus"
                : `${
                    result.winner === "elss" ? "ELSS" : "Tax-Saving FD"
                  } wins by`}
            </div>
            {result.winner !== "tie" && (
              <div className="text-4xl font-bold">{fmt(result.difference)}</div>
            )}
            <div className="text-sm opacity-80 mt-2">
              after {years} years, post-tax — for your inputs
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              className={`bg-white rounded-2xl p-5 shadow-sm border-2 ${
                result.winner === "fd" ? "border-blue-400" : "border-gray-200"
              }`}
            >
              <div className="font-bold text-blue-700 mb-3">
                Tax-Saving FD
                {result.winner === "fd" && (
                  <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                    WINNER
                  </span>
                )}
              </div>
              <div className="space-y-2 text-xs text-gray-700">
                <div className="flex justify-between">
                  <span>Investment</span>
                  <span>{fmt(investment)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Maturity @ {fdRate}% (qly compound)</span>
                  <span className="font-semibold">{fmt(result.fdMaturity)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Interest earned</span>
                  <span className="text-emerald-700">
                    + {fmt(result.fdInterest)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>− Tax @ {slabRate}% slab on interest</span>
                  <span className="text-rose-700">
                    − {fmt(result.fdTaxOnInterest)}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-2 text-base font-bold text-blue-700">
                  <span>Net post-tax corpus</span>
                  <span>{fmt(result.fdNetCorpus)}</span>
                </div>
              </div>
            </div>

            <div
              className={`bg-white rounded-2xl p-5 shadow-sm border-2 ${
                result.winner === "elss"
                  ? "border-emerald-400"
                  : "border-gray-200"
              }`}
            >
              <div className="font-bold text-emerald-700 mb-3">
                ELSS Mutual Fund
                {result.winner === "elss" && (
                  <span className="ml-2 text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    WINNER
                  </span>
                )}
              </div>
              <div className="space-y-2 text-xs text-gray-700">
                <div className="flex justify-between">
                  <span>Investment</span>
                  <span>{fmt(investment)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Maturity @ {elssReturn}% CAGR</span>
                  <span className="font-semibold">
                    {fmt(result.elssMaturity)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Long-term capital gain</span>
                  <span className="text-emerald-700">
                    + {fmt(result.elssGain)}
                  </span>
                </div>
                <div className="flex justify-between text-[10px] text-gray-500">
                  <span>(₹1.25L exempt, rest @ 12.5% LTCG)</span>
                  <span>—</span>
                </div>
                <div className="flex justify-between">
                  <span>− LTCG tax</span>
                  <span className="text-rose-700">
                    − {fmt(result.elssTaxOnGain)}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-2 text-base font-bold text-emerald-700">
                  <span>Net post-tax corpus</span>
                  <span>{fmt(result.elssNetCorpus)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs text-gray-700 leading-relaxed space-y-2">
        <strong>Key differences:</strong>
        <table className="w-full mt-2">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">Feature</th>
              <th className="p-2">Tax-Saving FD</th>
              <th className="p-2">ELSS</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="p-2 font-semibold">Lock-in</td>
              <td className="p-2">5 years</td>
              <td className="p-2 text-emerald-700">3 years (shortest 80C)</td>
            </tr>
            <tr className="border-t">
              <td className="p-2 font-semibold">Returns</td>
              <td className="p-2">6.5–7.5% fixed</td>
              <td className="p-2">12-14% historic avg (variable)</td>
            </tr>
            <tr className="border-t">
              <td className="p-2 font-semibold">Risk</td>
              <td className="p-2 text-emerald-700">Zero (DICGC insured)</td>
              <td className="p-2 text-rose-700">Equity market risk</td>
            </tr>
            <tr className="border-t">
              <td className="p-2 font-semibold">Interest tax</td>
              <td className="p-2 text-rose-700">Slab rate (up to 30%)</td>
              <td className="p-2">N/A — only on sale</td>
            </tr>
            <tr className="border-t">
              <td className="p-2 font-semibold">Capital gains tax</td>
              <td className="p-2">N/A</td>
              <td className="p-2 text-emerald-700">
                12.5% LTCG (₹1.25L exempt)
              </td>
            </tr>
            <tr className="border-t">
              <td className="p-2 font-semibold">TDS</td>
              <td className="p-2">10% if interest &gt; ₹40K</td>
              <td className="p-2 text-emerald-700">No TDS</td>
            </tr>
            <tr className="border-t">
              <td className="p-2 font-semibold">Liquidity</td>
              <td className="p-2 text-rose-700">Locked, no premature</td>
              <td className="p-2">Sell after 3 yrs anytime</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-800 leading-relaxed">
        <span className="mr-1">ℹ️</span>
        <strong>Disclaimer:</strong> ELSS returns are MARKET-LINKED and not
        guaranteed. The 12-14% number is HISTORICAL CATEGORY AVERAGE — actual
        future returns may be lower (or higher). Don&apos;t invest in ELSS if
        you can&apos;t tolerate equity drawdowns of 20-30% in bad years.
        80C benefit is only under OLD regime.
      </div>
    </div>
  );
}
