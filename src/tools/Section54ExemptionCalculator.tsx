"use client";
import { useState, useMemo } from "react";

/**
 * Section 54 / 54F Capital Gains Exemption Calculator (India)
 *
 * Sections 54 and 54F of the Income Tax Act, 1961 provide exemption from
 * Long-Term Capital Gains (LTCG) tax when the proceeds are reinvested into
 * a residential house property in India.
 *
 * VERIFIED RULES (FY 2025-26 / AY 2026-27):
 *
 * SECTION 54 — LTCG on sale of RESIDENTIAL house property
 *  - Asset sold: residential house held > 24 months
 *  - Reinvest the CAPITAL GAIN (not full proceeds) into:
 *      - Purchase of another residential house: 1 yr before OR 2 yr after sale
 *      - Construction of new house: within 3 yrs of sale
 *  - Exemption = MIN(capital gain, amount reinvested)
 *  - Cap (Budget 2023, applies from FY 2023-24 onwards): exemption capped
 *    at ₹10 crore irrespective of actual reinvestment
 *  - You can buy ONE residential house. (Was earlier 2 houses if gains ≤ ₹2cr,
 *    once-in-lifetime — that option still exists for gains ≤ ₹2cr only)
 *  - If new property sold within 3 yrs: exemption REVERSED (gain reinstated)
 *  - Capital Gains Account Scheme (CGAS): if you can't reinvest by ITR due
 *    date, deposit gain in CGAS account (PSU bank); withdraw for purchase
 *    within deadlines
 *
 * SECTION 54F — LTCG on sale of ANY OTHER long-term capital asset
 *  - Asset sold: anything held > 24 months EXCEPT residential house
 *    (e.g. stocks, gold, bonds, commercial property, plot, MF units)
 *  - Reinvest the SALE CONSIDERATION (not just gain — full proceeds) into:
 *      - Purchase: 1 yr before OR 2 yr after sale
 *      - Construction: within 3 yrs
 *  - Exemption is PROPORTIONAL:
 *      Exemption = LTCG × (Amount Reinvested / Sale Consideration)
 *  - Conditions (stricter than Sec 54):
 *      * Can't own more than ONE other residential house at sale date
 *      * Can't purchase another residential house within 2 yrs of sale
 *      * Can't construct another residential house within 3 yrs of sale
 *  - Cap: ₹10 crore (Budget 2023 onwards)
 *  - If new house sold within 3 yrs OR another house bought/built: full
 *    exemption REVERSED + entire LTCG taxed
 *
 * NOTE: Section 54EC (separate, not in this tool) — invest in NHAI/REC bonds
 * up to ₹50L within 6 months for LTCG exemption on land/building. Bonds
 * locked for 5 years.
 *
 * Sources:
 *  - Income Tax Act 1961, Sec 54 & 54F
 *  - https://incometaxindia.gov.in/tutorials/16.%20exemption%20under%2054.pdf
 *  - https://cleartax.in/s/section-54-capital-gains-exemption
 *  - https://cleartax.in/s/invest-multiple-capital-gains-on-buying-new-house-property
 *  - https://tax2win.in/guide/section-54-of-income-tax-act
 *  - Budget 2023 — ₹10 crore cap
 */

type Section = "54" | "54F";

const LTCG_RATE = 0.125; // 12.5% post-Budget 2024 (no indexation default)
const EXEMPTION_CAP = 100_000_000; // ₹10 crore

export default function Section54ExemptionCalculator() {
  const [section, setSection] = useState<Section>("54");
  // Common inputs
  const [salePrice, setSalePrice] = useState<number>(20_000_000); // ₹2cr
  const [costOfAcquisition, setCostOfAcquisition] = useState<number>(8_000_000); // ₹80L
  const [reinvested, setReinvested] = useState<number>(15_000_000); // ₹1.5cr

  const result = useMemo(() => {
    if (salePrice <= 0 || costOfAcquisition < 0 || reinvested < 0) return null;

    const ltcg = Math.max(0, salePrice - costOfAcquisition);
    if (ltcg === 0) {
      return {
        ltcg: 0,
        exemption: 0,
        cappedExemption: 0,
        taxableGain: 0,
        taxPayable: 0,
        taxSaved: 0,
        ifNoExemption: 0,
      };
    }

    let rawExemption: number;
    let calcExplanation: string;

    if (section === "54") {
      // Sec 54: exemption = min(gain, reinvested)
      rawExemption = Math.min(ltcg, reinvested);
      calcExplanation = `Sec 54: exemption = min(LTCG ₹${ltcg.toLocaleString(
        "en-IN"
      )}, reinvested ₹${reinvested.toLocaleString("en-IN")})`;
    } else {
      // Sec 54F: proportional exemption
      // Exemption = LTCG × (Amount Reinvested / Sale Consideration)
      rawExemption = (ltcg * Math.min(reinvested, salePrice)) / salePrice;
      calcExplanation = `Sec 54F: exemption = LTCG × (reinvested / sale consideration) = ₹${ltcg.toLocaleString(
        "en-IN"
      )} × (${reinvested.toLocaleString("en-IN")} / ${salePrice.toLocaleString(
        "en-IN"
      )})`;
    }

    // Apply ₹10 cr cap
    const cappedExemption = Math.min(rawExemption, EXEMPTION_CAP);
    const wasCapped = rawExemption > EXEMPTION_CAP;

    const taxableGain = ltcg - cappedExemption;
    const taxPayable = taxableGain * LTCG_RATE;
    const ifNoExemption = ltcg * LTCG_RATE;
    const taxSaved = ifNoExemption - taxPayable;

    return {
      ltcg,
      rawExemption,
      cappedExemption,
      wasCapped,
      taxableGain,
      taxPayable,
      ifNoExemption,
      taxSaved,
      calcExplanation,
    };
  }, [section, salePrice, costOfAcquisition, reinvested]);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <div className="space-y-6">
      <div className="inline-block bg-cyan-100 text-cyan-800 text-sm font-semibold px-4 py-1.5 rounded-full">
        🏠 Section 54 / 54F · LTCG Exemption Calculator
      </div>

      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">
          Which section applies to your sale?
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => setSection("54")}
            className={`flex-1 px-3 py-3 rounded-xl text-xs font-semibold transition ${
              section === "54"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            <div className="font-bold">Section 54</div>
            <div className="text-[10px] opacity-80 mt-1">
              Sold a residential house
            </div>
          </button>
          <button
            onClick={() => setSection("54F")}
            className={`flex-1 px-3 py-3 rounded-xl text-xs font-semibold transition ${
              section === "54F"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            <div className="font-bold">Section 54F</div>
            <div className="text-[10px] opacity-80 mt-1">
              Sold stocks, gold, plot, commercial, etc.
            </div>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">
            Sale Consideration (₹)
          </label>
          <input
            type="number"
            value={salePrice}
            onChange={(e) => setSalePrice(+e.target.value || 0)}
            className="calc-input"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">
            Cost of Acquisition (₹)
          </label>
          <input
            type="number"
            value={costOfAcquisition}
            onChange={(e) => setCostOfAcquisition(+e.target.value || 0)}
            className="calc-input"
          />
          <p className="text-xs text-gray-500 mt-1">
            Original purchase price + improvement cost
          </p>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">
            Amount Reinvested (₹)
          </label>
          <input
            type="number"
            value={reinvested}
            onChange={(e) => setReinvested(+e.target.value || 0)}
            className="calc-input"
          />
          <p className="text-xs text-gray-500 mt-1">
            Into new residential house
          </p>
        </div>
      </div>

      {result && (
        <div className="result-card space-y-4">
          <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl p-6 text-white">
            <div className="text-sm font-medium opacity-80 mb-1">
              LTCG Tax Saved with Exemption
            </div>
            <div className="text-4xl font-bold">{fmt(result.taxSaved)}</div>
            <div className="text-sm opacity-80 mt-2">
              You pay {fmt(result.taxPayable)} instead of{" "}
              {fmt(result.ifNoExemption)} (without exemption)
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">
                Total LTCG
              </div>
              <div className="text-xl font-bold text-orange-600">
                {fmt(result.ltcg)}
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">
                Exemption Allowed
              </div>
              <div className="text-xl font-bold text-emerald-600">
                {fmt(result.cappedExemption)}
              </div>
              {result.wasCapped && (
                <div className="text-[10px] text-amber-700 mt-1">
                  Capped at ₹10 cr
                </div>
              )}
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">
                Taxable Gain
              </div>
              <div className="text-xl font-bold text-rose-600">
                {fmt(result.taxableGain)}
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">
                Tax @ 12.5% LTCG
              </div>
              <div className="text-xl font-bold text-blue-600">
                {fmt(result.taxPayable)}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-2 text-sm">
              📐 Calculation
            </h3>
            <p className="text-xs text-gray-700 mb-2">
              {result.calcExplanation}
            </p>
            <div className="text-xs text-gray-700 mt-3 space-y-1">
              <div>
                Sale price − Cost = {fmt(result.ltcg)} (LTCG before exemption)
              </div>
              <div>
                After exemption: ₹{result.taxableGain.toLocaleString("en-IN")}
                taxable
              </div>
              <div>
                LTCG tax @ 12.5% (no indexation, post-Budget-2024) ={" "}
                {fmt(result.taxPayable)}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 leading-relaxed space-y-2">
        <strong>
          {section === "54" ? "Section 54" : "Section 54F"} key conditions:
        </strong>
        {section === "54" ? (
          <ul className="list-disc list-inside ml-2 space-y-1">
            <li>
              Asset sold: <strong>residential house</strong> held more than 24
              months.
            </li>
            <li>
              Reinvest the <strong>CAPITAL GAIN</strong> (not full sale price)
              into ONE residential house in India.
            </li>
            <li>
              <strong>Time limits:</strong> Purchase 1 yr before / 2 yrs after
              sale; or construct within 3 yrs.
            </li>
            <li>
              Exemption = min(LTCG, reinvested). Capped at <strong>₹10 cr</strong>.
            </li>
            <li>
              <strong>2-house option:</strong> if LTCG ≤ ₹2 cr, you can buy 2
              houses (once-in-lifetime).
            </li>
            <li>
              If new house sold within 3 yrs → exemption REVERSED.
            </li>
            <li>
              Can&apos;t reinvest by ITR due date? Park gain in <strong>Capital
              Gains Account Scheme (CGAS)</strong> at PSU bank.
            </li>
          </ul>
        ) : (
          <ul className="list-disc list-inside ml-2 space-y-1">
            <li>
              Asset sold: <strong>any LT asset</strong> EXCEPT residential
              house (stocks, gold, plot, commercial, etc.) held more than 24
              months.
            </li>
            <li>
              Reinvest the <strong>FULL SALE CONSIDERATION</strong> into ONE
              residential house. Exemption is PROPORTIONAL to amount reinvested.
            </li>
            <li>
              <strong>Time limits:</strong> Purchase 1 yr before / 2 yrs after
              sale; or construct within 3 yrs.
            </li>
            <li>
              At sale date: <strong>can&apos;t own &gt; 1</strong> other
              residential house.
            </li>
            <li>
              Within 2 yrs (purchase) / 3 yrs (construction) of sale: cannot
              buy/build another residential house — else full exemption
              reversed.
            </li>
            <li>
              Capped at <strong>₹10 cr</strong>. CGAS available if reinvestment
              delayed.
            </li>
          </ul>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-800 leading-relaxed">
        <span className="mr-1">ℹ️</span>
        <strong>Other related sections:</strong>{" "}
        <strong>Section 54EC</strong> — invest LTCG (up to ₹50L) in NHAI/REC
        bonds within 6 months for full exemption (5-yr lock-in).{" "}
        <strong>Section 54B</strong> — agricultural land. <strong>54D
        </strong> — compulsory acquisition. Always consult a CA for transactions
        above ₹50L; CA fees pay for themselves on first audit. Reference:{" "}
        <a
          href="https://incometaxindia.gov.in/tutorials/16.%20exemption%20under%2054.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="underline font-semibold text-blue-700 hover:text-blue-900"
        >
          incometaxindia.gov.in (Sec 54 PDF)
        </a>
        .
      </div>
    </div>
  );
}
