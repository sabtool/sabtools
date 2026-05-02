"use client";
import { useState, useMemo } from "react";

/**
 * Sovereign Gold Bond (SGB) Returns Calculator
 *
 * SGBs are RBI-issued gold-backed bonds: each unit = 1 gram of gold. Investors
 * earn TWO sources of return: (1) the price appreciation of gold itself
 * between issue and redemption, and (2) a fixed 2.5% p.a. interest paid
 * semi-annually on the original ISSUE PRICE (not on the appreciated value).
 *
 * VERIFIED RULES (FY 2025-26 / current as on May 2026):
 *
 *  - Tenure: 8 years from issue date.
 *  - Early redemption: allowed from end of 5th year on coupon payment dates.
 *  - Interest rate: 2.5% p.a. on issue price, paid semi-annually
 *    (every 6 months) directly to bank account.
 *  - Redemption value: based on simple average of closing gold price (999
 *    purity) of the previous 3 working days published by IBJA (India
 *    Bullion & Jewellers Association).
 *  - Tax treatment:
 *     * Interest (2.5%): TAXABLE under "Income from Other Sources" at slab
 *       rate. No TDS.
 *     * Capital gains at 8-year MATURITY: EXEMPT from capital gains tax
 *       under Sec 47(viic) — but only for ORIGINAL SUBSCRIBERS who hold
 *       continuously till redemption (Budget 2026 amendment).
 *     * Early redemption (5-7 years) or sale before maturity: STCG/LTCG
 *       rules apply (LTCG 12.5% post-Budget-2024 if held > 12 months).
 *  - Indexation benefit: not relevant since post-23-Jul-2024 indexation is
 *    abolished for capital gains tax across asset classes.
 *
 * Calculation:
 *
 *   Total Interest = IssuePrice × 2.5% × Years
 *
 *   Maturity Value = RedemptionPrice × NumberOfGrams
 *
 *   Capital Gain = (RedemptionPrice − IssuePrice) × NumberOfGrams
 *
 *   Total Return = Maturity Value + Total Interest − Investment
 *
 *   CAGR = ((Maturity + AccruedInterest) / Investment) ^ (1/Years) − 1
 *
 * Sources:
 *  - https://rbi.org.in (SGB master direction)
 *  - https://cleartax.in/s/sovereign-gold-bonds
 *  - https://www.paisabazaar.com/bonds/sovereign-gold-bonds/
 *  - https://www.goodreturns.in (matured SGB returns 2026)
 *  - Income Tax Act Sec 47(viic) for capital gains exemption
 */

const INTEREST_RATE = 0.025; // 2.5% p.a.
const STANDARD_TENURE_YEARS = 8;

export default function SgbReturnsCalculator() {
  const [grams, setGrams] = useState<number>(10);
  const [issuePrice, setIssuePrice] = useState<number>(6_000);
  const [redemptionPrice, setRedemptionPrice] = useState<number>(11_000);
  const [holdingYears, setHoldingYears] = useState<number>(STANDARD_TENURE_YEARS);
  const [originalSubscriber, setOriginalSubscriber] = useState<boolean>(true);
  const [slabRate, setSlabRate] = useState<number>(30);

  const result = useMemo(() => {
    if (
      grams <= 0 ||
      issuePrice <= 0 ||
      redemptionPrice <= 0 ||
      holdingYears <= 0
    )
      return null;

    const investment = issuePrice * grams;
    const maturityValue = redemptionPrice * grams;
    const capitalGain = maturityValue - investment;

    // Interest: 2.5% p.a. on issue price, paid semi-annually
    const annualInterest = investment * INTEREST_RATE;
    const totalInterest = annualInterest * holdingYears;

    // Tax on interest (always taxable at slab rate)
    const interestTax = totalInterest * (slabRate / 100);
    const netInterest = totalInterest - interestTax;

    // Tax on capital gains:
    //  - If held to 8-year maturity AS ORIGINAL SUBSCRIBER: ZERO (Sec 47(viic))
    //  - Otherwise: 12.5% LTCG (if held > 12 months) post-Budget-2024
    const heldToMaturity = holdingYears >= STANDARD_TENURE_YEARS;
    const exemptCapGains = heldToMaturity && originalSubscriber;
    const cgTaxRate = exemptCapGains ? 0 : 0.125;
    const capitalGainsTax = Math.max(0, capitalGain) * cgTaxRate;
    const netCapitalGain = capitalGain - capitalGainsTax;

    // Total absolute return after all tax
    const totalReturn = netCapitalGain + netInterest;
    const finalCorpus = investment + totalReturn;

    // CAGR (using TOTAL pre-tax return for like-for-like benchmark with funds)
    const totalPretax = capitalGain + totalInterest;
    const cagr =
      Math.pow((investment + totalPretax) / investment, 1 / holdingYears) - 1;

    return {
      investment,
      maturityValue,
      capitalGain,
      totalInterest,
      annualInterest,
      interestTax,
      netInterest,
      capitalGainsTax,
      cgTaxRate,
      exemptCapGains,
      netCapitalGain,
      totalReturn,
      finalCorpus,
      cagr,
    };
  }, [
    grams,
    issuePrice,
    redemptionPrice,
    holdingYears,
    originalSubscriber,
    slabRate,
  ]);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <div className="space-y-6">
      <div className="inline-block bg-yellow-100 text-yellow-800 text-sm font-semibold px-4 py-1.5 rounded-full">
        🥇 Sovereign Gold Bond Calculator · 2.5% p.a. + Gold Appreciation
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="sgb-grams"
            className="text-sm font-semibold text-gray-700 block mb-2"
          >
            Quantity (grams of gold)
          </label>
          <input
            id="sgb-grams"
            type="number"
            value={grams}
            onChange={(e) => setGrams(+e.target.value || 0)}
            className="calc-input"
            placeholder="10"
            min={1}
            step={0.1}
          />
          <p className="text-xs text-gray-500 mt-1">
            Min: 1g · Max: 4 kg/FY for individuals & HUFs
          </p>
        </div>
        <div>
          <label
            htmlFor="sgb-years"
            className="text-sm font-semibold text-gray-700 block mb-2"
          >
            Holding Period (years)
          </label>
          <input
            id="sgb-years"
            type="number"
            value={holdingYears}
            onChange={(e) => setHoldingYears(+e.target.value || 0)}
            className="calc-input"
            placeholder="8"
            min={5}
            max={8}
            step={0.5}
          />
          <p className="text-xs text-gray-500 mt-1">
            5–7 yrs: early redemption window · 8 yrs: full maturity
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="sgb-issue"
            className="text-sm font-semibold text-gray-700 block mb-2"
          >
            Issue Price per gram (₹)
          </label>
          <input
            id="sgb-issue"
            type="number"
            value={issuePrice}
            onChange={(e) => setIssuePrice(+e.target.value || 0)}
            className="calc-input"
            placeholder="6000"
          />
          <p className="text-xs text-gray-500 mt-1">
            E.g. SGB 2018-I issue price was ₹3,114; subscription series price
            published in RBI press release.
          </p>
        </div>
        <div>
          <label
            htmlFor="sgb-redeem"
            className="text-sm font-semibold text-gray-700 block mb-2"
          >
            Redemption Price per gram (₹)
          </label>
          <input
            id="sgb-redeem"
            type="number"
            value={redemptionPrice}
            onChange={(e) => setRedemptionPrice(+e.target.value || 0)}
            className="calc-input"
            placeholder="11000"
          />
          <p className="text-xs text-gray-500 mt-1">
            Use IBJA 999 gold avg of past 3 days (or current spot price as
            estimate)
          </p>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={originalSubscriber}
            onChange={(e) => setOriginalSubscriber(e.target.checked)}
            className="mt-1 w-4 h-4"
          />
          <div className="flex-1">
            <div className="font-semibold text-amber-900 text-sm">
              I&apos;m the original subscriber (held continuously)
            </div>
            <p className="text-xs text-amber-800 mt-0.5">
              <strong>Budget 2026 change:</strong> capital gains exemption at
              maturity now applies ONLY to the original subscriber. If you
              bought SGB on the secondary market, LTCG @ 12.5% applies.
            </p>
          </div>
        </label>
        <div>
          <label className="text-xs font-semibold text-amber-900 block mb-1">
            Your income tax slab rate (for interest tax) — %
          </label>
          <input
            type="number"
            value={slabRate}
            onChange={(e) => setSlabRate(+e.target.value || 0)}
            className="calc-input"
            min={0}
            max={42}
          />
        </div>
      </div>

      {result && (
        <div className="result-card space-y-4">
          <div className="bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl p-6 text-white">
            <div className="text-sm font-medium opacity-80 mb-1">
              Final Corpus After {holdingYears} years
            </div>
            <div className="text-4xl font-bold">{fmt(result.finalCorpus)}</div>
            <div className="text-sm opacity-80 mt-2">
              Investment {fmt(result.investment)} → CAGR{" "}
              <span className="font-bold">
                {(result.cagr * 100).toFixed(2)}%
              </span>{" "}
              p.a.
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">
                Capital Gain (Gold Price Appreciation)
              </div>
              <div className="text-2xl font-bold text-yellow-700">
                {fmt(result.capitalGain)}
              </div>
              <div className="text-xs text-gray-600 mt-2">
                Maturity value {fmt(result.maturityValue)} − Investment{" "}
                {fmt(result.investment)}
              </div>
              <div className="text-xs mt-2">
                {result.exemptCapGains ? (
                  <span className="text-emerald-700 font-semibold">
                    ✓ Tax-exempt at maturity (Sec 47(viic))
                  </span>
                ) : (
                  <span className="text-rose-700">
                    LTCG {(result.cgTaxRate * 100).toFixed(1)}% ={" "}
                    {fmt(result.capitalGainsTax)}
                  </span>
                )}
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">
                Total Interest (2.5% p.a. semi-annual)
              </div>
              <div className="text-2xl font-bold text-blue-700">
                {fmt(result.totalInterest)}
              </div>
              <div className="text-xs text-gray-600 mt-2">
                Annual interest {fmt(result.annualInterest)} × {holdingYears}{" "}
                yrs
              </div>
              <div className="text-xs mt-2 text-rose-700">
                Tax @ {slabRate}% slab = {fmt(result.interestTax)} (taxable
                always)
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-3 text-sm">
              📐 Total return breakdown
            </h3>
            <div className="space-y-2 text-xs text-gray-700">
              <div className="flex justify-between border-b pb-2">
                <span>Investment</span>
                <span className="font-mono">{fmt(result.investment)}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span>+ Maturity (gold appreciation)</span>
                <span className="font-mono text-emerald-700">
                  + {fmt(result.capitalGain)}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span>+ Interest (2.5% × {holdingYears} yrs)</span>
                <span className="font-mono text-emerald-700">
                  + {fmt(result.totalInterest)}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span>− Capital gains tax</span>
                <span className="font-mono text-rose-700">
                  − {fmt(result.capitalGainsTax)}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span>− Tax on interest @ {slabRate}%</span>
                <span className="font-mono text-rose-700">
                  − {fmt(result.interestTax)}
                </span>
              </div>
              <div className="flex justify-between pt-2 text-base font-bold text-yellow-800">
                <span>Net post-tax return</span>
                <span>{fmt(result.totalReturn)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs text-gray-700 leading-relaxed space-y-2">
        <strong>SGB key facts:</strong>
        <ul className="list-disc list-inside ml-2 space-y-1">
          <li>
            <strong>Tenure:</strong> 8 years. Early redemption from year 5 on
            coupon dates.
          </li>
          <li>
            <strong>Interest:</strong> 2.5% p.a. on issue price, paid every 6
            months. Always taxable at slab rate, no TDS.
          </li>
          <li>
            <strong>Capital gains at maturity (8 yrs):</strong> EXEMPT for
            original subscribers (Sec 47(viic), Budget 2026 change).
            Secondary buyers pay 12.5% LTCG.
          </li>
          <li>
            <strong>Limits:</strong> 1g min, 4 kg/FY max for individuals & HUFs;
            20 kg/FY for trusts.
          </li>
          <li>
            <strong>Loan collateral:</strong> SGBs accepted by banks at LTV
            similar to physical gold.
          </li>
          <li>
            <strong>No issues since FY 2024-25:</strong> RBI hasn&apos;t
            announced new SGB tranches. Existing holders continue earning
            2.5% till maturity.
          </li>
        </ul>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-800 leading-relaxed">
        <span className="mr-1">ℹ️</span>
        <strong>Disclaimer:</strong> Redemption price uses IBJA 999 gold avg
        of last 3 working days from RBI&apos;s payment date. Use the latest
        spot price as a planning estimate — actual maturity payout may
        differ. Reference:{" "}
        <a
          href="https://www.rbi.org.in"
          target="_blank"
          rel="noopener noreferrer"
          className="underline font-semibold text-blue-700 hover:text-blue-900"
        >
          rbi.org.in
        </a>
        .
      </div>
    </div>
  );
}
