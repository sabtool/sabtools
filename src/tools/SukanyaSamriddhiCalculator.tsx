"use client";
import { useState, useMemo } from "react";

export default function SukanyaSamriddhiCalculator() {
  const [yearlyDeposit, setYearlyDeposit] = useState(150000);
  const [girlAge, setGirlAge] = useState(5);
  const [interestRate, setInterestRate] = useState(8.2);
  const [showTable, setShowTable] = useState(false);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  const result = useMemo(() => {
    if (yearlyDeposit < 250 || yearlyDeposit > 150000 || girlAge < 0 || girlAge > 10) return null;
    const r = interestRate / 100;
    const depositYears = 15; // Deposits for 15 years
    const maturityYear = 21 - girlAge; // Matures when girl turns 21

    const yearWise: { year: number; age: number; deposit: number; interest: number; balance: number }[] = [];
    let balance = 0;
    let totalDeposits = 0;

    for (let y = 1; y <= maturityYear; y++) {
      const age = girlAge + y;
      const deposit = y <= depositYears ? yearlyDeposit : 0;
      totalDeposits += deposit;
      balance += deposit;
      const interest = balance * r;
      balance += interest;
      yearWise.push({ year: y, age, deposit, interest, balance });
    }

    const maturityAmount = balance;
    const interestEarned = maturityAmount - totalDeposits;

    return { totalDeposits, maturityAmount, interestEarned, yearWise, maturityYear };
  }, [yearlyDeposit, girlAge, interestRate]);

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">Yearly Deposit</label>
            <span className="text-sm font-bold text-indigo-600">{fmt(yearlyDeposit)}</span>
          </div>
          <input type="range" min={250} max={150000} step={250} value={yearlyDeposit} onChange={(e) => setYearlyDeposit(+e.target.value)} className="w-full" />
          <div className="flex justify-between text-xs text-gray-400 mt-1"><span>₹250 (min)</span><span>₹1.5L (max)</span></div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">Girl&apos;s Current Age</label>
            <span className="text-sm font-bold text-indigo-600">{girlAge} years</span>
          </div>
          <input type="range" min={0} max={10} step={1} value={girlAge} onChange={(e) => setGirlAge(+e.target.value)} className="w-full" />
          <div className="flex justify-between text-xs text-gray-400 mt-1"><span>0 yrs (birth)</span><span>10 yrs</span></div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">Interest Rate (% p.a.)</label>
            <span className="text-sm font-bold text-indigo-600">{interestRate}%</span>
          </div>
          <input type="range" min={7} max={10} step={0.1} value={interestRate} onChange={(e) => setInterestRate(+e.target.value)} className="w-full" />
          <div className="flex justify-between text-xs text-gray-400 mt-1"><span>7%</span><span>10% (Current: 8.2%)</span></div>
        </div>
      </div>

      {result && (
        <div className="result-card space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Total Deposits (15 yrs)</div>
              <div className="text-2xl font-extrabold text-gray-800">{fmt(result.totalDeposits)}</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Interest Earned</div>
              <div className="text-2xl font-extrabold text-green-600">{fmt(result.interestEarned)}</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Maturity Amount (Age 21)</div>
              <div className="text-2xl font-extrabold text-indigo-600">{fmt(result.maturityAmount)}</div>
            </div>
          </div>

          <div>
            <div className="h-5 rounded-full bg-green-200 overflow-hidden">
              <div className="h-full rounded-full bg-indigo-500 transition-all duration-500" style={{ width: `${(result.totalDeposits / result.maturityAmount) * 100}%` }} />
            </div>
            <div className="flex justify-between text-xs font-medium text-gray-500 mt-2">
              <span>Deposits ({((result.totalDeposits / result.maturityAmount) * 100).toFixed(1)}%)</span>
              <span>Interest ({((result.interestEarned / result.maturityAmount) * 100).toFixed(1)}%)</span>
            </div>
          </div>

          <button onClick={() => setShowTable(!showTable)} className="btn-secondary text-sm">
            {showTable ? "Hide" : "Show"} Year-wise Growth
          </button>

          {showTable && (
            <div className="overflow-x-auto max-h-64 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 sticky top-0">
                  <tr>
                    <th className="px-3 py-2 text-left">Year</th>
                    <th className="px-3 py-2 text-center">Age</th>
                    <th className="px-3 py-2 text-right">Deposit</th>
                    <th className="px-3 py-2 text-right">Interest</th>
                    <th className="px-3 py-2 text-right">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {result.yearWise.map((row) => (
                    <tr key={row.year} className="border-b border-gray-100">
                      <td className="px-3 py-2">{row.year}</td>
                      <td className="px-3 py-2 text-center">{row.age}</td>
                      <td className="px-3 py-2 text-right">{row.deposit > 0 ? fmt(row.deposit) : "-"}</td>
                      <td className="px-3 py-2 text-right text-green-600">{fmt(row.interest)}</td>
                      <td className="px-3 py-2 text-right font-semibold">{fmt(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="bg-pink-50 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-pink-800 mb-2">About Sukanya Samriddhi Yojana</h4>
            <ul className="text-xs text-pink-700 space-y-1 list-disc list-inside">
              <li>Account can be opened for a girl child below 10 years of age.</li>
              <li>Minimum deposit: ₹250/year. Maximum: ₹1.5 Lakh/year.</li>
              <li>Deposits required for 15 years. Account matures when girl turns 21.</li>
              <li>Partial withdrawal (50%) allowed after girl turns 18 for education.</li>
              <li>Tax-free under Section 80C (EEE status - Exempt, Exempt, Exempt).</li>
            </ul>
          </div>
        </div>
      )}

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
        <div className="flex items-start gap-2">
          <span className="text-lg">{"\u2139\uFE0F"}</span>
          <div>
            <p className="font-semibold mb-1">Disclaimer</p>
            <p>SSY rate: 8.2% (Q4 FY 2025-26). Revised quarterly. Check indiapost.gov.in</p>
          </div>
        </div>
      </div>
    </div>
  );
}
