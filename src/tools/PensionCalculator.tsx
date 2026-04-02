"use client";
import { useState, useMemo } from "react";

const fmt = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

export default function PensionCalculator() {
  const [currentSalary, setCurrentSalary] = useState(50000);
  const [age, setAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(60);
  const [increment, setIncrement] = useState(5);
  const [npsReturn, setNpsReturn] = useState(10);
  const [npsContribution, setNpsContribution] = useState(10);

  const result = useMemo(() => {
    const yearsToRetire = retirementAge - age;
    if (yearsToRetire <= 0) return null;

    // Calculate last drawn salary
    let lastSalary = currentSalary;
    for (let i = 0; i < yearsToRetire; i++) {
      lastSalary *= (1 + increment / 100);
    }

    // OPS: 50% of last drawn basic salary
    const opsMonthlyPension = lastSalary * 0.5;
    const opsAnnualPension = opsMonthlyPension * 12;
    // OPS total pension (assuming 20 years post-retirement)
    const opsTotal = opsAnnualPension * 20;

    // NPS Calculation
    const monthlyContribRate = npsContribution / 100;
    let npsCorpus = 0;
    let salary = currentSalary;
    const yearlyBreakdown: { year: number; salary: number; contribution: number; corpus: number }[] = [];

    for (let i = 0; i < yearsToRetire; i++) {
      const monthlyContribution = salary * monthlyContribRate;
      // Employer matches equal contribution
      const totalMonthlyContrib = monthlyContribution * 2; // Employee + Employer

      for (let m = 0; m < 12; m++) {
        npsCorpus = (npsCorpus + totalMonthlyContrib) * (1 + npsReturn / 100 / 12);
      }

      if (i % 5 === 0 || i === yearsToRetire - 1) {
        yearlyBreakdown.push({ year: i + 1, salary, contribution: totalMonthlyContrib, corpus: npsCorpus });
      }
      salary *= (1 + increment / 100);
    }

    // NPS rules: 60% lump sum (tax-free), 40% annuity
    const npsLumpSum = npsCorpus * 0.6;
    const npsAnnuityCorpus = npsCorpus * 0.4;
    // Annuity rate ~6% for lifetime
    const annuityRate = 6;
    const npsMonthlyPension = (npsAnnuityCorpus * annuityRate / 100) / 12;
    const npsAnnualPension = npsMonthlyPension * 12;

    // Total employee contribution over years
    let totalEmployeeContrib = 0;
    let s = currentSalary;
    for (let i = 0; i < yearsToRetire; i++) {
      totalEmployeeContrib += s * monthlyContribRate * 12;
      s *= (1 + increment / 100);
    }

    return {
      yearsToRetire,
      lastSalary,
      opsMonthlyPension,
      opsAnnualPension,
      opsTotal,
      npsCorpus,
      npsLumpSum,
      npsAnnuityCorpus,
      npsMonthlyPension,
      npsAnnualPension,
      totalEmployeeContrib,
      yearlyBreakdown,
    };
  }, [currentSalary, age, retirementAge, increment, npsReturn, npsContribution]);

  return (
    <div className="space-y-8">
      {/* Inputs */}
      <div className="space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">Current Basic Salary (Monthly)</label>
            <span className="text-sm font-bold text-indigo-600">{fmt(currentSalary)}</span>
          </div>
          <input type="range" min={10000} max={500000} step={5000} value={currentSalary} onChange={(e) => setCurrentSalary(+e.target.value)} className="w-full" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">Current Age</label>
              <span className="text-sm font-bold text-indigo-600">{age}</span>
            </div>
            <input type="range" min={20} max={55} value={age} onChange={(e) => setAge(+e.target.value)} className="w-full" />
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">Retirement Age</label>
              <span className="text-sm font-bold text-indigo-600">{retirementAge}</span>
            </div>
            <input type="range" min={55} max={65} value={retirementAge} onChange={(e) => setRetirementAge(+e.target.value)} className="w-full" />
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">Expected Annual Increment (%)</label>
            <span className="text-sm font-bold text-indigo-600">{increment}%</span>
          </div>
          <input type="range" min={1} max={15} step={0.5} value={increment} onChange={(e) => setIncrement(+e.target.value)} className="w-full" />
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">NPS Contribution (% of Basic)</label>
            <span className="text-sm font-bold text-indigo-600">{npsContribution}%</span>
          </div>
          <input type="range" min={5} max={14} step={1} value={npsContribution} onChange={(e) => setNpsContribution(+e.target.value)} className="w-full" />
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">Expected NPS Return (% p.a.)</label>
            <span className="text-sm font-bold text-indigo-600">{npsReturn}%</span>
          </div>
          <input type="range" min={6} max={14} step={0.5} value={npsReturn} onChange={(e) => setNpsReturn(+e.target.value)} className="w-full" />
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Key Info */}
          <div className="result-card">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="text-xs text-gray-500">Years to Retire</div>
                <div className="text-xl font-extrabold text-gray-700">{result.yearsToRetire}</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="text-xs text-gray-500">Last Drawn Salary</div>
                <div className="text-xl font-extrabold text-gray-700">{fmt(result.lastSalary)}</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="text-xs text-gray-500">Your NPS Contribution</div>
                <div className="text-xl font-extrabold text-gray-700">{fmt(result.totalEmployeeContrib)}</div>
              </div>
            </div>
          </div>

          {/* OPS vs NPS Comparison */}
          <div className="result-card">
            <h3 className="text-lg font-bold text-gray-800 mb-4">OPS vs NPS Comparison</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* OPS Card */}
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-6 border border-amber-200">
                <div className="text-center mb-4">
                  <div className="text-sm font-bold text-amber-700">Old Pension Scheme (OPS)</div>
                  <div className="text-xs text-amber-500">50% of Last Drawn Salary</div>
                </div>
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-3 text-center">
                    <div className="text-xs text-gray-500">Monthly Pension</div>
                    <div className="text-2xl font-extrabold text-amber-700">{fmt(result.opsMonthlyPension)}</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center">
                    <div className="text-xs text-gray-500">Annual Pension</div>
                    <div className="text-lg font-bold text-amber-600">{fmt(result.opsAnnualPension)}</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center">
                    <div className="text-xs text-gray-500">Guaranteed</div>
                    <div className="text-sm font-bold text-green-600">Lifetime + DA Benefits</div>
                  </div>
                </div>
              </div>

              {/* NPS Card */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                <div className="text-center mb-4">
                  <div className="text-sm font-bold text-blue-700">New Pension Scheme (NPS)</div>
                  <div className="text-xs text-blue-500">Market-linked Returns</div>
                </div>
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-3 text-center">
                    <div className="text-xs text-gray-500">Total Corpus</div>
                    <div className="text-2xl font-extrabold text-blue-700">{fmt(result.npsCorpus)}</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center">
                    <div className="text-xs text-gray-500">Lump Sum (60%)</div>
                    <div className="text-lg font-bold text-green-600">{fmt(result.npsLumpSum)}</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center">
                    <div className="text-xs text-gray-500">Monthly Pension (40% Annuity)</div>
                    <div className="text-lg font-bold text-blue-600">{fmt(result.npsMonthlyPension)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="result-card overflow-x-auto">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Side-by-Side Comparison</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-3 font-semibold text-gray-600">Parameter</th>
                  <th className="text-right p-3 font-semibold text-amber-600">OPS</th>
                  <th className="text-right p-3 font-semibold text-blue-600">NPS</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t"><td className="p-3">Monthly Pension</td><td className="p-3 text-right font-bold text-amber-700">{fmt(result.opsMonthlyPension)}</td><td className="p-3 text-right font-bold text-blue-700">{fmt(result.npsMonthlyPension)}</td></tr>
                <tr className="border-t"><td className="p-3">Lump Sum at Retirement</td><td className="p-3 text-right">-</td><td className="p-3 text-right font-bold text-green-600">{fmt(result.npsLumpSum)}</td></tr>
                <tr className="border-t"><td className="p-3">Employee Contribution</td><td className="p-3 text-right">Nil</td><td className="p-3 text-right">{fmt(result.totalEmployeeContrib)}</td></tr>
                <tr className="border-t"><td className="p-3">DA Benefit</td><td className="p-3 text-right text-green-600">Yes</td><td className="p-3 text-right text-red-500">No</td></tr>
                <tr className="border-t"><td className="p-3">Guaranteed</td><td className="p-3 text-right text-green-600">Yes (Govt backed)</td><td className="p-3 text-right text-amber-500">Market dependent</td></tr>
                <tr className="border-t"><td className="p-3">Tax on Pension</td><td className="p-3 text-right">Taxable</td><td className="p-3 text-right">60% tax-free lump sum</td></tr>
              </tbody>
            </table>
          </div>

          {/* NPS Corpus Growth */}
          <div className="result-card overflow-x-auto">
            <h3 className="text-lg font-bold text-gray-800 mb-4">NPS Corpus Growth</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-3 font-semibold text-gray-600">Year</th>
                  <th className="text-right p-3 font-semibold text-gray-600">Salary</th>
                  <th className="text-right p-3 font-semibold text-gray-600">Monthly Contrib.</th>
                  <th className="text-right p-3 font-semibold text-gray-600">Corpus</th>
                </tr>
              </thead>
              <tbody>
                {result.yearlyBreakdown.map((row) => (
                  <tr key={row.year} className="border-t">
                    <td className="p-3 font-semibold">{row.year}</td>
                    <td className="p-3 text-right">{fmt(row.salary)}</td>
                    <td className="p-3 text-right">{fmt(row.contribution)}</td>
                    <td className="p-3 text-right font-bold text-indigo-600">{fmt(row.corpus)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
