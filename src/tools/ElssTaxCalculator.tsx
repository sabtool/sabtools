"use client";
import { useState, useMemo } from "react";

const fmt = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

export default function ElssTaxCalculator() {
  const [investment, setInvestment] = useState(150000);
  const [returnRate, setReturnRate] = useState(14);
  const [taxBracket, setTaxBracket] = useState(30);
  const [fdRate, setFdRate] = useState(7);

  const result = useMemo(() => {
    const lockIn = 3; // years
    const cappedInvestment = Math.min(investment, 150000);

    // ELSS maturity after 3 years (lump sum)
    const elssMaturity = cappedInvestment * Math.pow(1 + returnRate / 100, lockIn);
    const elssGain = elssMaturity - cappedInvestment;

    // LTCG tax on ELSS: gains above 1 lakh taxed at 10%
    const ltcgExemption = 100000;
    const taxableGain = Math.max(0, elssGain - ltcgExemption);
    const ltcgTax = taxableGain * 0.10;
    const elssPostTax = elssMaturity - ltcgTax;

    // Tax saved under 80C
    const taxSaved = cappedInvestment * (taxBracket / 100);
    const cessTaxSaved = taxSaved * 1.04; // Including 4% cess

    // Effective return after tax benefit
    const effectiveInvestment = cappedInvestment - cessTaxSaved;
    const effectiveReturn = ((elssPostTax - effectiveInvestment) / effectiveInvestment) * 100;
    const effectiveCAGR = (Math.pow(elssPostTax / effectiveInvestment, 1 / lockIn) - 1) * 100;

    // FD comparison (taxed at slab rate)
    const fdMaturity = cappedInvestment * Math.pow(1 + fdRate / 400, 4 * lockIn); // quarterly compounding
    const fdInterest = fdMaturity - cappedInvestment;
    const fdTax = fdInterest * (taxBracket / 100);
    const fdPostTax = fdMaturity - fdTax;
    // FD has NO 80C benefit (unless tax-saving FD)
    const taxSavingFdPostTax = fdPostTax; // With 80C, same tax saving applies
    const fdEffectiveReturn = ((fdPostTax - cappedInvestment) / cappedInvestment) * 100;

    return {
      cappedInvestment,
      elssMaturity,
      elssGain,
      ltcgTax,
      elssPostTax,
      taxSaved: cessTaxSaved,
      effectiveInvestment,
      effectiveReturn,
      effectiveCAGR,
      fdMaturity,
      fdInterest,
      fdTax,
      fdPostTax: taxSavingFdPostTax,
      fdEffectiveReturn,
    };
  }, [investment, returnRate, taxBracket, fdRate]);

  return (
    <div className="space-y-8">
      {/* Inputs */}
      <div className="space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">ELSS Investment (max 1.5L under 80C)</label>
            <span className="text-sm font-bold text-indigo-600">{fmt(investment)}</span>
          </div>
          <input type="range" min={10000} max={150000} step={5000} value={investment} onChange={(e) => setInvestment(+e.target.value)} className="w-full" />
          <div className="flex justify-between text-xs text-gray-400 mt-1"><span>10K</span><span>1.5L</span></div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">Expected ELSS Return (% p.a.)</label>
            <span className="text-sm font-bold text-indigo-600">{returnRate}%</span>
          </div>
          <input type="range" min={8} max={25} step={0.5} value={returnRate} onChange={(e) => setReturnRate(+e.target.value)} className="w-full" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Your Tax Bracket</label>
          <div className="grid grid-cols-3 gap-2">
            {[{ label: "5%", value: 5 }, { label: "20%", value: 20 }, { label: "30%", value: 30 }].map((t) => (
              <button key={t.value} onClick={() => setTaxBracket(t.value)} className={taxBracket === t.value ? "btn-primary" : "btn-secondary"}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">FD Rate for Comparison (% p.a.)</label>
            <span className="text-sm font-bold text-indigo-600">{fdRate}%</span>
          </div>
          <input type="range" min={4} max={10} step={0.25} value={fdRate} onChange={(e) => setFdRate(+e.target.value)} className="w-full" />
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Tax Saving */}
          <div className="result-card bg-gradient-to-r from-green-50 to-emerald-50">
            <div className="text-center">
              <div className="text-sm text-green-600 font-semibold">Tax Saved Under Section 80C</div>
              <div className="text-3xl font-extrabold text-green-700 mt-1">{fmt(result.taxSaved)}</div>
              <div className="text-xs text-green-500 mt-1">At {taxBracket}% bracket + 4% cess</div>
            </div>
          </div>

          {/* ELSS Returns */}
          <div className="result-card">
            <h3 className="text-lg font-bold text-gray-800 mb-4">ELSS Returns (3-Year Lock-in)</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-indigo-50 rounded-xl p-3 text-center">
                <div className="text-xs text-indigo-600 font-semibold">Maturity</div>
                <div className="text-lg font-extrabold text-indigo-700">{fmt(result.elssMaturity)}</div>
              </div>
              <div className="bg-green-50 rounded-xl p-3 text-center">
                <div className="text-xs text-green-600 font-semibold">Gain</div>
                <div className="text-lg font-extrabold text-green-700">{fmt(result.elssGain)}</div>
              </div>
              <div className="bg-red-50 rounded-xl p-3 text-center">
                <div className="text-xs text-red-600 font-semibold">LTCG Tax</div>
                <div className="text-lg font-extrabold text-red-600">{fmt(result.ltcgTax)}</div>
              </div>
              <div className="bg-purple-50 rounded-xl p-3 text-center">
                <div className="text-xs text-purple-600 font-semibold">Post-Tax</div>
                <div className="text-lg font-extrabold text-purple-700">{fmt(result.elssPostTax)}</div>
              </div>
            </div>
          </div>

          {/* Effective Returns */}
          <div className="result-card">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Effective Returns (After Tax Benefit)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-emerald-50 rounded-xl p-4 text-center">
                <div className="text-xs text-emerald-600 font-semibold">Effective Cost</div>
                <div className="text-xl font-extrabold text-emerald-700">{fmt(result.effectiveInvestment)}</div>
                <div className="text-xs text-gray-500">Investment - Tax Saved</div>
              </div>
              <div className="bg-emerald-50 rounded-xl p-4 text-center">
                <div className="text-xs text-emerald-600 font-semibold">Effective Return</div>
                <div className="text-xl font-extrabold text-emerald-700">{result.effectiveReturn.toFixed(1)}%</div>
                <div className="text-xs text-gray-500">Total over 3 years</div>
              </div>
              <div className="bg-emerald-50 rounded-xl p-4 text-center">
                <div className="text-xs text-emerald-600 font-semibold">Effective CAGR</div>
                <div className="text-xl font-extrabold text-emerald-700">{result.effectiveCAGR.toFixed(1)}%</div>
                <div className="text-xs text-gray-500">Annualized</div>
              </div>
            </div>
          </div>

          {/* ELSS vs FD Comparison */}
          <div className="result-card">
            <h3 className="text-lg font-bold text-gray-800 mb-4">ELSS vs FD Comparison (3 Years)</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-3 font-semibold text-gray-600">Parameter</th>
                  <th className="text-right p-3 font-semibold text-indigo-600">ELSS</th>
                  <th className="text-right p-3 font-semibold text-amber-600">FD</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t"><td className="p-3">Investment</td><td className="p-3 text-right">{fmt(result.cappedInvestment)}</td><td className="p-3 text-right">{fmt(result.cappedInvestment)}</td></tr>
                <tr className="border-t"><td className="p-3">Maturity (Pre-Tax)</td><td className="p-3 text-right font-semibold">{fmt(result.elssMaturity)}</td><td className="p-3 text-right font-semibold">{fmt(result.fdMaturity)}</td></tr>
                <tr className="border-t"><td className="p-3">Tax on Returns</td><td className="p-3 text-right text-red-500">{fmt(result.ltcgTax)}</td><td className="p-3 text-right text-red-500">{fmt(result.fdTax)}</td></tr>
                <tr className="border-t"><td className="p-3">Post-Tax Value</td><td className="p-3 text-right font-bold text-green-600">{fmt(result.elssPostTax)}</td><td className="p-3 text-right font-bold">{fmt(result.fdPostTax)}</td></tr>
                <tr className="border-t"><td className="p-3">Tax Saved (80C)</td><td className="p-3 text-right font-bold text-green-600">{fmt(result.taxSaved)}</td><td className="p-3 text-right">-</td></tr>
                <tr className="border-t bg-green-50"><td className="p-3 font-bold">Net Benefit</td><td className="p-3 text-right font-extrabold text-green-700">{fmt(result.elssPostTax + result.taxSaved)}</td><td className="p-3 text-right font-extrabold">{fmt(result.fdPostTax)}</td></tr>
              </tbody>
            </table>
          </div>

          {/* Advantages */}
          <div className="result-card bg-indigo-50 border border-indigo-200">
            <h3 className="text-lg font-bold text-indigo-800 mb-3">ELSS Advantages</h3>
            <ul className="space-y-2 text-sm text-indigo-700">
              <li>&#10003; Shortest lock-in among 80C instruments (3 years vs 5 years for FD)</li>
              <li>&#10003; Tax deduction up to Rs 1.5 lakh under Section 80C</li>
              <li>&#10003; Equity exposure with potential for higher returns</li>
              <li>&#10003; LTCG above Rs 1 lakh taxed at only 10% (vs slab rate for FD)</li>
              <li>&#10003; SIP option available for disciplined monthly investing</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
