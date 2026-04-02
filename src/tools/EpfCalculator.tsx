"use client";
import { useState, useMemo } from "react";

export default function EpfCalculator() {
  const [basicSalary, setBasicSalary] = useState(30000);
  const [employeeContrib, setEmployeeContrib] = useState(12);
  const [employerContrib, setEmployerContrib] = useState(3.67);
  const [currentAge, setCurrentAge] = useState(25);
  const [retirementAge, setRetirementAge] = useState(58);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [annualHike, setAnnualHike] = useState(5);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  const result = useMemo(() => {
    if (basicSalary <= 0 || currentAge >= retirementAge) return null;

    const years = retirementAge - currentAge;
    const monthlyRate = 8.25 / 12 / 100; // EPF interest rate FY 2025-26
    let totalEmployeeContrib = 0;
    let totalEmployerContrib = 0;
    let balance = currentBalance;
    let currentBasic = basicSalary;

    for (let y = 0; y < years; y++) {
      const empMonthly = (currentBasic * employeeContrib) / 100;
      const erMonthly = (currentBasic * employerContrib) / 100;
      for (let m = 0; m < 12; m++) {
        balance = (balance + empMonthly + erMonthly) * (1 + monthlyRate);
        totalEmployeeContrib += empMonthly;
        totalEmployerContrib += erMonthly;
      }
      currentBasic *= 1 + annualHike / 100;
    }

    const totalContrib = totalEmployeeContrib + totalEmployerContrib + currentBalance;
    const interestEarned = balance - totalContrib;

    return { totalEmployeeContrib, totalEmployerContrib, interestEarned, totalCorpus: balance, years };
  }, [basicSalary, employeeContrib, employerContrib, currentAge, retirementAge, currentBalance, annualHike]);

  return (
    <div className="space-y-8">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
        <strong>EPF Interest Rate:</strong> 8.25% p.a. (FY 2025-26). Employer contributes 3.67% to EPF and 8.33% to EPS.
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">Monthly Basic Salary</label>
            <span className="text-sm font-bold text-indigo-600">{fmt(basicSalary)}</span>
          </div>
          <input type="range" min={5000} max={200000} step={1000} value={basicSalary} onChange={(e) => setBasicSalary(+e.target.value)} className="w-full" />
          <div className="flex justify-between text-xs text-gray-400 mt-1"><span>₹5K</span><span>₹2L</span></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">Employee Contribution %</label>
              <span className="text-sm font-bold text-indigo-600">{employeeContrib}%</span>
            </div>
            <input type="range" min={1} max={20} step={0.5} value={employeeContrib} onChange={(e) => setEmployeeContrib(+e.target.value)} className="w-full" />
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">Employer EPF Contribution %</label>
              <span className="text-sm font-bold text-indigo-600">{employerContrib}%</span>
            </div>
            <input type="range" min={1} max={12} step={0.5} value={employerContrib} onChange={(e) => setEmployerContrib(+e.target.value)} className="w-full" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">Current Age</label>
              <span className="text-sm font-bold text-indigo-600">{currentAge} yrs</span>
            </div>
            <input type="range" min={18} max={57} step={1} value={currentAge} onChange={(e) => setCurrentAge(+e.target.value)} className="w-full" />
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">Retirement Age</label>
              <span className="text-sm font-bold text-indigo-600">{retirementAge} yrs</span>
            </div>
            <input type="range" min={40} max={65} step={1} value={retirementAge} onChange={(e) => setRetirementAge(+e.target.value)} className="w-full" />
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">Current EPF Balance</label>
            <span className="text-sm font-bold text-indigo-600">{fmt(currentBalance)}</span>
          </div>
          <input type="range" min={0} max={5000000} step={10000} value={currentBalance} onChange={(e) => setCurrentBalance(+e.target.value)} className="w-full" />
          <div className="flex justify-between text-xs text-gray-400 mt-1"><span>₹0</span><span>₹50L</span></div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">Annual Salary Increase</label>
            <span className="text-sm font-bold text-indigo-600">{annualHike}%</span>
          </div>
          <input type="range" min={0} max={20} step={0.5} value={annualHike} onChange={(e) => setAnnualHike(+e.target.value)} className="w-full" />
          <div className="flex justify-between text-xs text-gray-400 mt-1"><span>0%</span><span>20%</span></div>
        </div>
      </div>

      {result && (
        <div className="result-card space-y-4">
          <div className="text-center mb-2">
            <div className="text-xs font-medium text-gray-500">Total EPF Corpus at Retirement ({result.years} years)</div>
            <div className="text-4xl font-extrabold text-indigo-600 mt-1">{fmt(result.totalCorpus)}</div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Employee Contribution</div>
              <div className="text-xl font-extrabold text-blue-600">{fmt(result.totalEmployeeContrib)}</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Employer Contribution</div>
              <div className="text-xl font-extrabold text-purple-600">{fmt(result.totalEmployerContrib)}</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Interest Earned</div>
              <div className="text-xl font-extrabold text-green-600">{fmt(result.interestEarned)}</div>
            </div>
          </div>
          <div>
            <div className="h-4 rounded-full bg-gray-200 overflow-hidden flex">
              <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${(result.totalEmployeeContrib / result.totalCorpus) * 100}%` }} />
              <div className="h-full bg-purple-500 transition-all duration-500" style={{ width: `${(result.totalEmployerContrib / result.totalCorpus) * 100}%` }} />
              <div className="h-full bg-green-500 transition-all duration-500" style={{ width: `${(result.interestEarned / result.totalCorpus) * 100}%` }} />
            </div>
            <div className="flex justify-between text-xs font-medium text-gray-500 mt-2">
              <span className="text-blue-600">Employee</span>
              <span className="text-purple-600">Employer</span>
              <span className="text-green-600">Interest</span>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
        <div className="flex items-start gap-2">
          <span className="text-lg">{"\u2139\uFE0F"}</span>
          <div>
            <p className="font-semibold mb-1">Disclaimer</p>
            <p>EPF interest rate used: 8.25% (FY 2025-26). Rate set annually by EPFO. Check epfindia.gov.in for latest.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
