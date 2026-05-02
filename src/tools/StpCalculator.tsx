"use client";
import { useState, useMemo } from "react";

/**
 * Systematic Transfer Plan (STP) Calculator
 *
 * STP is a mutual-fund facility that AUTOMATICALLY transfers a fixed amount
 * from a SOURCE scheme (typically a debt or liquid fund) to a DESTINATION
 * scheme (typically equity) at regular intervals. It's the "lump-sum
 * version of SIP" — used to deploy a windfall (bonus, sale proceeds, FD
 * maturity) into equity gradually rather than all at once.
 *
 * WHY STP > LUMPSUM into equity:
 *  - Reduces market-timing risk (rupee cost averaging)
 *  - Source fund earns ~6-7% (debt/liquid) vs 4% savings account while waiting
 *  - Discipline: bank-account auto-debit removes the procrastination problem
 *
 * WHY STP > SIP from salary (for a windfall):
 *  - Money is already invested earning debt returns
 *  - You're rupee-cost-averaging from already-deployed capital, not new
 *    earned income
 *
 * Formula (simulation):
 *
 *  Source fund:
 *    Each period: balance grows by debtRate, then transferAmount is deducted
 *    sourceBalance(t+1) = sourceBalance(t) * (1+debtRate) - transferAmount
 *
 *  Destination fund:
 *    Each period: balance grows by equityRate, then transferAmount is added
 *    destBalance(t+1) = destBalance(t) * (1+equityRate) + transferAmount
 *
 *  At end of STP duration:
 *    Final value = sourceBalance(end) + destBalance(end)
 *
 * Sources:
 *  - https://www.sbimf.com/financial-planning-calculators/stp-calculator
 *  - https://www.hdfcfund.com/calculators/stp-calculator
 *  - https://zerodha.com/calculators/stp-calculator/
 *  - SEBI Mutual Fund regulations (no exit load on STP within same AMC
 *    if held for 7 days+ in source — varies by scheme)
 */

export default function StpCalculator() {
  const [lumpsum, setLumpsum] = useState<number>(1_000_000); // ₹10L
  const [transferAmount, setTransferAmount] = useState<number>(50_000);
  const [stpMonths, setStpMonths] = useState<number>(20);
  const [debtReturn, setDebtReturn] = useState<number>(7);
  const [equityReturn, setEquityReturn] = useState<number>(12);
  const [holdYears, setHoldYears] = useState<number>(3);

  const result = useMemo(() => {
    if (
      lumpsum <= 0 ||
      transferAmount <= 0 ||
      stpMonths <= 0 ||
      debtReturn <= 0 ||
      equityReturn <= 0 ||
      holdYears <= 0
    )
      return null;

    const debtMonthlyRate = debtReturn / 12 / 100;
    const equityMonthlyRate = equityReturn / 12 / 100;

    // Phase 1: STP — transfer monthly from source to destination
    let sourceBalance = lumpsum;
    let destBalance = 0;
    const phase1Rows: {
      month: number;
      sourceBalance: number;
      destBalance: number;
      total: number;
    }[] = [];

    for (let m = 1; m <= stpMonths; m++) {
      // Source grows
      sourceBalance = sourceBalance * (1 + debtMonthlyRate);
      // Transfer (or remaining balance if less than transfer)
      const actualTransfer = Math.min(transferAmount, sourceBalance);
      sourceBalance -= actualTransfer;
      destBalance = destBalance * (1 + equityMonthlyRate) + actualTransfer;

      phase1Rows.push({
        month: m,
        sourceBalance,
        destBalance,
        total: sourceBalance + destBalance,
      });

      if (sourceBalance <= 0) break;
    }

    const stpEndBalance = sourceBalance + destBalance;
    const stpEndMonth = phase1Rows.length;

    // Phase 2: Hold rest in equity (no more transfers)
    const holdMonths = holdYears * 12;
    let finalDest = destBalance;
    let finalSource = sourceBalance;
    for (let m = 1; m <= holdMonths; m++) {
      finalDest = finalDest * (1 + equityMonthlyRate);
      // Source — assume liquidated and invested at debtReturn
      finalSource = finalSource * (1 + debtMonthlyRate);
    }

    const finalCorpus = finalDest + finalSource;
    const totalGain = finalCorpus - lumpsum;
    const cagr =
      Math.pow(finalCorpus / lumpsum, 1 / (stpEndMonth / 12 + holdYears)) - 1;

    // Comparison: lump-sum directly into equity
    const lumpSumIntoEquity =
      lumpsum * Math.pow(1 + equityReturn / 100, stpEndMonth / 12 + holdYears);

    // Comparison: keep all in debt fund
    const allInDebt =
      lumpsum * Math.pow(1 + debtReturn / 100, stpEndMonth / 12 + holdYears);

    return {
      stpEndMonth,
      stpEndBalance,
      finalCorpus,
      finalDest,
      finalSource,
      totalGain,
      cagr,
      phase1Rows,
      lumpSumIntoEquity,
      allInDebt,
      vsLumpsum: finalCorpus - lumpSumIntoEquity,
      vsAllDebt: finalCorpus - allInDebt,
    };
  }, [lumpsum, transferAmount, stpMonths, debtReturn, equityReturn, holdYears]);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(n);
  const fmtCompact = (n: number) => {
    if (n >= 1e7) return `₹${(n / 1e7).toFixed(2)} Cr`;
    if (n >= 1e5) return `₹${(n / 1e5).toFixed(2)} L`;
    if (n >= 1e3) return `₹${(n / 1e3).toFixed(0)}K`;
    return `₹${n.toFixed(0)}`;
  };

  return (
    <div className="space-y-6">
      <div className="inline-block bg-cyan-100 text-cyan-800 text-sm font-semibold px-4 py-1.5 rounded-full">
        🔄 STP Calculator · Systematic Transfer Plan
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-900">
        <strong>Use case:</strong> You have a lump sum (bonus, FD maturity,
        sale proceeds) and want to deploy it into equity gradually to reduce
        market-timing risk. Park it in a DEBT/LIQUID fund earning ~7%, then
        STP a fixed amount monthly into an EQUITY fund.
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">
            Lump Sum (Source Fund — Debt / Liquid)
          </label>
          <input
            type="number"
            value={lumpsum}
            onChange={(e) => setLumpsum(+e.target.value || 0)}
            className="calc-input"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">
            Monthly Transfer to Equity
          </label>
          <input
            type="number"
            value={transferAmount}
            onChange={(e) => setTransferAmount(+e.target.value || 0)}
            className="calc-input"
          />
          <p className="text-xs text-gray-500 mt-1">
            Suggested: lumpsum ÷ stpMonths (= ~₹{Math.round(lumpsum / stpMonths)})
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">
            STP Duration (months)
          </label>
          <input
            type="number"
            value={stpMonths}
            onChange={(e) => setStpMonths(+e.target.value || 0)}
            className="calc-input"
            min={3}
            max={120}
          />
          <p className="text-xs text-gray-500 mt-1">Typical: 6-24 months</p>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">
            Hold Period After STP (years)
          </label>
          <input
            type="number"
            value={holdYears}
            onChange={(e) => setHoldYears(+e.target.value || 0)}
            className="calc-input"
            min={0}
            max={30}
          />
          <p className="text-xs text-gray-500 mt-1">After STP completes</p>
        </div>
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700 text-xs">
              Debt Return %
            </label>
            <span className="text-sm font-bold text-blue-600">
              {debtReturn}%
            </span>
          </div>
          <input
            type="range"
            min={4}
            max={9}
            step={0.5}
            value={debtReturn}
            onChange={(e) => setDebtReturn(+e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      <div>
        <div className="flex justify-between mb-2">
          <label className="text-sm font-semibold text-gray-700">
            Expected Equity Return %
          </label>
          <span className="text-sm font-bold text-emerald-600">
            {equityReturn}%
          </span>
        </div>
        <input
          type="range"
          min={6}
          max={20}
          step={0.5}
          value={equityReturn}
          onChange={(e) => setEquityReturn(+e.target.value)}
          className="w-full"
        />
      </div>

      {result && (
        <div className="result-card space-y-4">
          <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl p-6 text-white">
            <div className="text-sm font-medium opacity-80 mb-1">
              Final Corpus After STP + Hold
            </div>
            <div className="text-4xl font-bold">{fmt(result.finalCorpus)}</div>
            <div className="text-sm opacity-80 mt-2">
              From {fmtCompact(lumpsum)} · CAGR{" "}
              {(result.cagr * 100).toFixed(2)}% · Total gain{" "}
              {fmtCompact(result.totalGain)}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">
                STP Strategy
              </div>
              <div className="text-2xl font-bold text-cyan-600">
                {fmtCompact(result.finalCorpus)}
              </div>
              <div className="text-[10px] text-gray-500 mt-1">
                STP {result.stpEndMonth}mo + hold {holdYears}y
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">
                Direct Lumpsum to Equity
              </div>
              <div className="text-2xl font-bold text-emerald-600">
                {fmtCompact(result.lumpSumIntoEquity)}
              </div>
              <div
                className={`text-[10px] mt-1 ${
                  result.vsLumpsum < 0 ? "text-rose-600" : "text-emerald-600"
                }`}
              >
                {result.vsLumpsum < 0
                  ? `STP ${fmtCompact(Math.abs(result.vsLumpsum))} less`
                  : `STP ${fmtCompact(result.vsLumpsum)} more`}
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">
                All in Debt Fund
              </div>
              <div className="text-2xl font-bold text-amber-600">
                {fmtCompact(result.allInDebt)}
              </div>
              <div className="text-[10px] text-emerald-600 mt-1">
                STP {fmtCompact(result.vsAllDebt)} more
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-3">
              Month-by-Month STP Phase
            </h3>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden max-h-96 overflow-y-auto">
              <table className="w-full text-xs">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="text-left p-2 font-semibold text-gray-700">
                      Month
                    </th>
                    <th className="text-right p-2 font-semibold text-gray-700">
                      Source (Debt)
                    </th>
                    <th className="text-right p-2 font-semibold text-gray-700">
                      Dest (Equity)
                    </th>
                    <th className="text-right p-2 font-semibold text-gray-700">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {result.phase1Rows.map((row) => (
                    <tr key={row.month} className="border-t">
                      <td className="p-2 font-medium text-gray-900">
                        {row.month}
                      </td>
                      <td className="p-2 text-right text-blue-600">
                        {fmtCompact(row.sourceBalance)}
                      </td>
                      <td className="p-2 text-right text-emerald-600">
                        {fmtCompact(row.destBalance)}
                      </td>
                      <td className="p-2 text-right text-purple-700 font-semibold">
                        {fmtCompact(row.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs text-gray-700 leading-relaxed space-y-2">
        <strong>How STP works:</strong>
        <ul className="list-disc list-inside ml-2 space-y-1">
          <li>
            Park lump sum in a <strong>debt/liquid mutual fund</strong>
            (typically same AMC as your destination equity fund).
          </li>
          <li>
            Set up <strong>STP instruction</strong> with the AMC: transfer ₹X
            on the same date every month from source to destination.
          </li>
          <li>
            <strong>Tax:</strong> each transfer is treated as a redemption
            from source fund. Short-term gains (≤24 months for debt) taxed
            at slab rate; long-term debt gains taxed at slab as well
            (post-Apr-2023). Equity LTCG: 12.5% above ₹1.25L (held &gt; 12 mo).
          </li>
          <li>
            <strong>Exit load:</strong> generally NIL within same AMC after
            7 days; verify with scheme document.
          </li>
          <li>
            <strong>STP types:</strong> Fixed (constant ₹), Capital
            Appreciation (only gains transferred), Flex (amount varies with
            destination NAV).
          </li>
        </ul>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-800 leading-relaxed">
        <span className="mr-1">ℹ️</span>
        <strong>Disclaimer:</strong> STP outcome depends on equity-market
        movement during the deployment phase. In a STEADILY RISING market,
        direct lumpsum beats STP. In a CHOPPY / DECLINING market, STP
        averages costs lower. Historic Indian equity data suggests STP wins
        on risk-adjusted basis, lumpsum wins on raw returns ~60% of the time.
        Choose based on your risk tolerance, not pure expected value.
      </div>
    </div>
  );
}
