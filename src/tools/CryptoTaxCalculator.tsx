"use client";
import { useState, useMemo } from "react";

/**
 * Crypto Tax Calculator (India) — FY 2025-26 / AY 2026-27
 *
 * VERIFIED DATA SOURCES (as of April 2026):
 *
 * 1. Section 115BBH of the Income Tax Act, 1961 (introduced via Finance Act, 2022,
 *    effective FY 2022-23 onwards):
 *    - Flat 30% tax on income from transfer of any Virtual Digital Asset (VDA)
 *    - No deduction allowed except cost of acquisition
 *    - No set-off of loss from VDA against any other income (including other VDA gains)
 *    - No carry-forward of VDA losses
 *
 * 2. Section 194S of the Income Tax Act (effective 01-Jul-2022):
 *    - 1% TDS on transfer consideration paid to Indian residents
 *    - Threshold ₹50,000/FY for individuals/HUFs not carrying on business with
 *      turnover > ₹1 crore (or profession with gross receipts > ₹50 lakh)
 *    - Threshold ₹10,000/FY for any other person (businesses, specified persons)
 *
 * 3. Section 2(47A): VDA = any cryptographically generated information, code, number
 *    or token, not Indian/foreign currency. Includes Bitcoin, Ethereum, NFTs, etc.
 *
 * 4. Surcharge slabs FY 2025-26 (per Finance Act 2025, applicable on the 30% base tax):
 *    - Total income ≤ ₹50L: NIL
 *    - ₹50L – ₹1Cr: 10%
 *    - ₹1Cr – ₹2Cr: 15%
 *    - ₹2Cr – ₹5Cr: 25%
 *    - Above ₹5Cr: 25% (capped at 25% for VDA-type income; the higher 37% surcharge
 *      slab does not apply to capital-gain-style income under the New Regime)
 *
 * 5. Health & Education Cess: 4% on (tax + surcharge), per Sec 2(11) of Finance Act 2025.
 *
 * 6. Reporting: Schedule VDA in ITR-2 (capital gain) or ITR-3 (business income).
 *
 * Tax math:
 *   gain        = sale - purchase
 *   if gain ≤ 0 → no tax payable (but loss is dead — cannot set off, cannot carry fwd)
 *   baseTax    = gain * 0.30
 *   surcharge  = baseTax * surchargeRate(otherIncome + gain)
 *   cess       = (baseTax + surcharge) * 0.04
 *   totalTax   = baseTax + surcharge + cess
 *   tdsWithheld= sale * 0.01  (if sale ≥ TDS threshold for the FY)
 *   netInHand  = sale - totalTax
 */

type PersonType = "individual" | "specified";

function getSurchargeRate(totalIncome: number): number {
  // FY 2025-26 surcharge slabs. VDA-type income is capped at 25% surcharge under
  // the new regime — the 37% slab on income > ₹5Cr does not apply to crypto gains.
  if (totalIncome <= 5_000_000) return 0; // ₹50L
  if (totalIncome <= 10_000_000) return 0.10; // ₹50L–1Cr
  if (totalIncome <= 20_000_000) return 0.15; // ₹1Cr–2Cr
  return 0.25; // above ₹2Cr (capped)
}

function getTdsThreshold(personType: PersonType): number {
  // Section 194S thresholds (₹/FY of cumulative crypto sale consideration)
  return personType === "specified" ? 10_000 : 50_000;
}

export default function CryptoTaxCalculator() {
  const [purchasePrice, setPurchasePrice] = useState<string>("100000");
  const [salePrice, setSalePrice] = useState<string>("150000");
  const [otherIncome, setOtherIncome] = useState<string>("1000000");
  const [personType, setPersonType] = useState<PersonType>("individual");
  const [ytdSales, setYtdSales] = useState<string>("0");

  const result = useMemo(() => {
    const purchase = parseFloat(purchasePrice);
    const sale = parseFloat(salePrice);
    const otherInc = parseFloat(otherIncome) || 0;
    const ytd = parseFloat(ytdSales) || 0;

    if (
      isNaN(purchase) ||
      isNaN(sale) ||
      purchase < 0 ||
      sale < 0
    ) {
      return null;
    }

    const gain = sale - purchase;
    const isLoss = gain < 0;
    const totalIncomeForSurcharge = otherInc + Math.max(0, gain);

    // Tax computation per Section 115BBH (only applies on positive gains)
    const baseTax = isLoss ? 0 : gain * 0.30;
    const surchargeRate = getSurchargeRate(totalIncomeForSurcharge);
    const surcharge = baseTax * surchargeRate;
    const cess = (baseTax + surcharge) * 0.04;
    const totalTax = baseTax + surcharge + cess;

    // TDS check (Section 194S) — applies once cumulative FY sale consideration
    // (this transaction + prior YTD) crosses the threshold for the person type.
    const tdsThreshold = getTdsThreshold(personType);
    const cumulativeSales = ytd + sale;
    const tdsApplies = cumulativeSales > tdsThreshold;
    const tdsWithheldThisTxn = tdsApplies ? sale * 0.01 : 0;

    const netInHand = sale - totalTax;
    const effectiveTaxRateOnGain = gain > 0 ? (totalTax / gain) * 100 : 0;
    const effectiveTaxRateOnSale = sale > 0 ? (totalTax / sale) * 100 : 0;

    return {
      gain,
      isLoss,
      baseTax,
      surchargeRate,
      surcharge,
      cess,
      totalTax,
      tdsApplies,
      tdsWithheldThisTxn,
      tdsThreshold,
      netInHand,
      effectiveTaxRateOnGain,
      effectiveTaxRateOnSale,
      totalIncomeForSurcharge,
    };
  }, [purchasePrice, salePrice, otherIncome, personType, ytdSales]);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(n);

  const fmtPercent = (n: number) => `${n.toFixed(2)}%`;

  return (
    <div className="space-y-6">
      <div className="inline-block bg-purple-100 text-purple-800 text-sm font-semibold px-4 py-1.5 rounded-full">
        🪙 FY 2025-26 (AY 2026-27) · Section 115BBH · Section 194S
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="purchase-price"
            className="text-sm font-semibold text-gray-700 block mb-2"
          >
            Cost of Acquisition (₹)
          </label>
          <input
            id="purchase-price"
            type="number"
            placeholder="What you paid to buy the crypto"
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(e.target.value)}
            className="calc-input"
          />
          <p className="text-xs text-gray-500 mt-1">
            Only purchase price counts. No deduction for transaction fees, gas
            fees, electricity, or infrastructure under Sec 115BBH.
          </p>
        </div>

        <div>
          <label
            htmlFor="sale-price"
            className="text-sm font-semibold text-gray-700 block mb-2"
          >
            Sale / Transfer Consideration (₹)
          </label>
          <input
            id="sale-price"
            type="number"
            placeholder="What you received on sale or exchange"
            value={salePrice}
            onChange={(e) => setSalePrice(e.target.value)}
            className="calc-input"
          />
          <p className="text-xs text-gray-500 mt-1">
            Total ₹ value received. For crypto-to-crypto exchanges, use FMV of
            received asset.
          </p>
        </div>

        <div>
          <label
            htmlFor="other-income"
            className="text-sm font-semibold text-gray-700 block mb-2"
          >
            Your Other Annual Income (₹)
          </label>
          <input
            id="other-income"
            type="number"
            placeholder="Salary + other taxable income (excluding this gain)"
            value={otherIncome}
            onChange={(e) => setOtherIncome(e.target.value)}
            className="calc-input"
          />
          <p className="text-xs text-gray-500 mt-1">
            Used to determine surcharge slab. Surcharge kicks in only if total
            income (including this gain) exceeds ₹50L.
          </p>
        </div>

        <div>
          <label
            htmlFor="ytd-sales"
            className="text-sm font-semibold text-gray-700 block mb-2"
          >
            Prior Crypto Sales This FY (₹)
          </label>
          <input
            id="ytd-sales"
            type="number"
            placeholder="0"
            value={ytdSales}
            onChange={(e) => setYtdSales(e.target.value)}
            className="calc-input"
          />
          <p className="text-xs text-gray-500 mt-1">
            Cumulative crypto sale consideration earlier in FY 2025-26. Used
            for the Section 194S TDS threshold check.
          </p>
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">
          Person Type (for TDS threshold)
        </label>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setPersonType("individual")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
              personType === "individual"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            Individual / HUF (₹50,000 threshold)
          </button>
          <button
            onClick={() => setPersonType("specified")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
              personType === "specified"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            Business / Specified (₹10,000 threshold)
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Specified persons = those with business turnover &gt; ₹1 crore or
          professional gross receipts &gt; ₹50 lakh in the immediately
          preceding FY.
        </p>
      </div>

      {result && (
        <div className="result-card space-y-4">
          {result.isLoss ? (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <div className="font-bold text-red-900 mb-1">
                    Loss of {fmt(Math.abs(result.gain))} on this transaction
                  </div>
                  <p className="text-sm text-red-800 leading-relaxed">
                    No tax is payable since the transaction resulted in a loss.{" "}
                    <strong>However</strong>, under Section 115BBH:
                  </p>
                  <ul className="list-disc list-inside text-sm text-red-800 mt-2 space-y-1">
                    <li>
                      This loss <strong>cannot be set off</strong> against any
                      other income (salary, business, capital gains, anything).
                    </li>
                    <li>
                      It cannot even be set off against gains from{" "}
                      <strong>other</strong> Virtual Digital Assets in the same
                      year.
                    </li>
                    <li>
                      It cannot be carried forward to subsequent FYs — the loss
                      is permanently dead.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                  <div className="text-xs font-medium text-gray-500 mb-1">
                    Capital Gain
                  </div>
                  <div className="text-xl font-bold text-emerald-600">
                    {fmt(result.gain)}
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                  <div className="text-xs font-medium text-gray-500 mb-1">
                    Tax (30% flat)
                  </div>
                  <div className="text-xl font-bold text-red-600">
                    {fmt(result.baseTax)}
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                  <div className="text-xs font-medium text-gray-500 mb-1">
                    Total Tax
                    <br />
                    <span className="text-[10px] font-normal">
                      (incl. surcharge + cess)
                    </span>
                  </div>
                  <div className="text-xl font-bold text-red-700">
                    {fmt(result.totalTax)}
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                  <div className="text-xs font-medium text-gray-500 mb-1">
                    Net In Hand
                  </div>
                  <div className="text-xl font-bold text-green-600">
                    {fmt(result.netInHand)}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm space-y-2">
                <div className="font-semibold text-gray-700 mb-2">
                  Tax Breakdown
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Base tax (30% × ₹{result.gain.toLocaleString("en-IN")})
                  </span>
                  <span className="font-semibold text-gray-900">
                    {fmt(result.baseTax)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Surcharge ({fmtPercent(result.surchargeRate * 100)} of base
                    tax)
                  </span>
                  <span className="font-semibold text-gray-900">
                    {fmt(result.surcharge)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Health &amp; Education Cess (4% of tax + surcharge)
                  </span>
                  <span className="font-semibold text-gray-900">
                    {fmt(result.cess)}
                  </span>
                </div>
                <div className="border-t pt-2 mt-2 flex justify-between text-sm">
                  <span className="font-bold text-gray-700">
                    Total tax payable
                  </span>
                  <span className="font-bold text-red-700">
                    {fmt(result.totalTax)}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Effective tax rate on this gain:{" "}
                  <strong>
                    {fmtPercent(result.effectiveTaxRateOnGain)}
                  </strong>{" "}
                  · Effective on sale value:{" "}
                  <strong>
                    {fmtPercent(result.effectiveTaxRateOnSale)}
                  </strong>
                </div>
              </div>

              {result.tdsApplies && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <div className="font-semibold text-amber-900 text-sm mb-1">
                    📌 Section 194S TDS Notice
                  </div>
                  <p className="text-sm text-amber-800 leading-relaxed">
                    Your cumulative FY crypto sales (
                    {fmt(parseFloat(ytdSales || "0") + parseFloat(salePrice))})
                    exceed the {fmt(result.tdsThreshold)} threshold. The
                    exchange must withhold{" "}
                    <strong>{fmt(result.tdsWithheldThisTxn)}</strong> (1% of
                    sale value) as TDS. This is{" "}
                    <strong>credited against your total tax liability</strong>{" "}
                    when you file your ITR — you don&apos;t pay it on top.
                  </p>
                </div>
              )}

              {!result.tdsApplies && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="font-semibold text-blue-900 text-sm mb-1">
                    ℹ️ No TDS triggered yet
                  </div>
                  <p className="text-sm text-blue-800 leading-relaxed">
                    Your cumulative FY crypto sales (
                    {fmt(parseFloat(ytdSales || "0") + parseFloat(salePrice))})
                    are below the {fmt(result.tdsThreshold)} threshold for{" "}
                    {personType === "individual"
                      ? "individuals/HUFs"
                      : "specified persons"}
                    . No 194S TDS is deducted on this transaction. (TDS will
                    apply once cumulative sales cross the threshold within FY
                    2025-26.)
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      )}

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs text-gray-700 leading-relaxed space-y-2">
        <div>
          <strong>Verified rules (FY 2025-26 / AY 2026-27):</strong>
        </div>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>
            <strong>30% flat tax</strong> on VDA gains — Section 115BBH,
            Income Tax Act 1961.
          </li>
          <li>
            <strong>1% TDS</strong> on sale consideration — Section 194S.
            Threshold ₹50K/FY for individuals/HUFs (without large business),
            ₹10K/FY for others.
          </li>
          <li>
            <strong>No deductions</strong> except cost of acquisition. No
            transaction fees, gas fees, electricity, or platform charges.
          </li>
          <li>
            <strong>Losses are dead.</strong> No set-off against any income
            (including other VDAs); no carry-forward.
          </li>
          <li>
            Mining / staking / airdrop receipts are taxed at slab rates on
            receipt (not 30%) per FMV — not covered by this calculator.
            Subsequent sale of those tokens is at 30%.
          </li>
          <li>
            Report under <strong>Schedule VDA</strong> in ITR-2 (capital gain)
            or ITR-3 (business income).
          </li>
        </ul>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-800 leading-relaxed">
        <span className="mr-1">ℹ️</span>
        <strong>Disclaimer:</strong> Calculations are based on Section 115BBH,
        Section 194S, and FY 2025-26 surcharge/cess rates as per Finance Act
        2025. For complex scenarios (gifts, mining income, multiple lots with
        FIFO, peer-to-peer transactions, foreign exchanges) consult a Chartered
        Accountant. Official reference:{" "}
        <a
          href="https://www.incometax.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="underline font-semibold text-blue-700 hover:text-blue-900"
        >
          incometax.gov.in
        </a>
        .
      </div>
    </div>
  );
}
