"use client";
import { useState, useMemo } from "react";

const BANKS = [
  { name: "SBI", rates: { "7d": 3.0, "1y": 6.8, "2y": 7.0, "3y": 6.75, "5y": 6.5, "10y": 6.5 } },
  { name: "HDFC Bank", rates: { "7d": 3.0, "1y": 6.6, "2y": 7.0, "3y": 7.0, "5y": 7.0, "10y": 7.0 } },
  { name: "ICICI Bank", rates: { "7d": 3.0, "1y": 6.7, "2y": 7.0, "3y": 7.0, "5y": 6.9, "10y": 6.9 } },
  { name: "Axis Bank", rates: { "7d": 3.0, "1y": 6.7, "2y": 7.1, "3y": 7.1, "5y": 7.0, "10y": 7.0 } },
  { name: "Kotak Mahindra", rates: { "7d": 3.5, "1y": 6.6, "2y": 7.15, "3y": 7.1, "5y": 6.7, "10y": 6.2 } },
  { name: "PNB", rates: { "7d": 3.0, "1y": 6.8, "2y": 7.0, "3y": 6.5, "5y": 6.5, "10y": 6.5 } },
  { name: "Bank of Baroda", rates: { "7d": 3.0, "1y": 6.85, "2y": 7.05, "3y": 6.5, "5y": 6.5, "10y": 6.5 } },
  { name: "Canara Bank", rates: { "7d": 3.0, "1y": 6.85, "2y": 7.0, "3y": 6.7, "5y": 6.7, "10y": 6.7 } },
  { name: "Union Bank", rates: { "7d": 3.0, "1y": 6.7, "2y": 6.7, "3y": 6.7, "5y": 6.5, "10y": 6.5 } },
  { name: "IndusInd Bank", rates: { "7d": 3.5, "1y": 7.25, "2y": 7.25, "3y": 7.25, "5y": 7.0, "10y": 7.0 } },
];

type Tenure = "7d" | "1y" | "2y" | "3y" | "5y" | "10y";
const TENURES: { label: string; value: Tenure; years: number }[] = [
  { label: "7 Days", value: "7d", years: 7 / 365 },
  { label: "1 Year", value: "1y", years: 1 },
  { label: "2 Years", value: "2y", years: 2 },
  { label: "3 Years", value: "3y", years: 3 },
  { label: "5 Years", value: "5y", years: 5 },
  { label: "10 Years", value: "10y", years: 10 },
];

const fmt = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

export default function FdComparison() {
  const [amount, setAmount] = useState(500000);
  const [tenure, setTenure] = useState<Tenure>("1y");
  const [seniorCitizen, setSeniorCitizen] = useState(false);

  const results = useMemo(() => {
    const t = TENURES.find((tt) => tt.value === tenure)!;
    const bonus = seniorCitizen ? 0.5 : 0;

    return BANKS.map((bank) => {
      const rate = bank.rates[tenure] + bonus;
      const n = 4; // quarterly compounding
      const maturity = amount * Math.pow(1 + rate / (100 * n), n * t.years);
      const interest = maturity - amount;
      return { name: bank.name, rate, interest, maturity };
    }).sort((a, b) => b.maturity - a.maturity);
  }, [amount, tenure, seniorCitizen]);

  const best = results[0];

  return (
    <div className="space-y-8">
      <div className="bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-2 text-sm text-indigo-700 font-semibold text-center">
        📅 FD Rates as of March 2026
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">Investment Amount</label>
            <span className="text-sm font-bold text-indigo-600">{fmt(amount)}</span>
          </div>
          <input type="range" min={10000} max={10000000} step={10000} value={amount} onChange={(e) => setAmount(+e.target.value)} className="w-full" />
          <div className="flex justify-between text-xs text-gray-400 mt-1"><span>10K</span><span>1 Cr</span></div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Select Tenure</label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {TENURES.map((t) => (
              <button key={t.value} onClick={() => setTenure(t.value)} className={tenure === t.value ? "btn-primary text-sm" : "btn-secondary text-sm"}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={seniorCitizen} onChange={(e) => setSeniorCitizen(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
          <span className="text-sm font-semibold text-gray-700">Senior Citizen (+0.5% extra)</span>
        </label>
      </div>

      {/* Best Option */}
      {best && (
        <div className="result-card bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
          <div className="text-center">
            <div className="text-xs font-semibold text-green-600 mb-1">Best Returns</div>
            <div className="text-2xl font-extrabold text-green-700">{best.name}</div>
            <div className="text-sm text-green-600 mt-1">{best.rate}% p.a. | Interest: {fmt(best.interest)}</div>
            <div className="text-lg font-bold text-gray-800 mt-2">Maturity: {fmt(best.maturity)}</div>
          </div>
        </div>
      )}

      {/* Comparison Table */}
      <div className="result-card overflow-x-auto">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Comparison Table</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-3 font-semibold text-gray-600">#</th>
              <th className="text-left p-3 font-semibold text-gray-600">Bank</th>
              <th className="text-right p-3 font-semibold text-gray-600">Rate</th>
              <th className="text-right p-3 font-semibold text-gray-600">Interest</th>
              <th className="text-right p-3 font-semibold text-gray-600">Maturity</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => (
              <tr key={r.name} className={`border-t ${i === 0 ? "bg-green-50" : ""}`}>
                <td className="p-3">{i === 0 ? "🏆" : i + 1}</td>
                <td className="p-3 font-semibold">{r.name}</td>
                <td className="p-3 text-right text-indigo-600 font-bold">{r.rate.toFixed(2)}%</td>
                <td className="p-3 text-right text-green-600 font-semibold">{fmt(r.interest)}</td>
                <td className="p-3 text-right font-bold">{fmt(r.maturity)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
        <div className="flex items-start gap-2">
          <span className="text-lg">{"\u2139\uFE0F"}</span>
          <div>
            <p className="font-semibold mb-1">Disclaimer</p>
            <p>FD rates are approximate as of March 2026. Banks update rates frequently. Verify on your bank{"'"}s website.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
