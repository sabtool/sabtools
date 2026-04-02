"use client";
import { useState, useMemo } from "react";

export default function CollegeFeeCalculator() {
  const [collegeType, setCollegeType] = useState("IIT");
  const [duration, setDuration] = useState(4);
  const [hostel, setHostel] = useState(true);
  const [scholarship, setScholarship] = useState(false);
  const [loanTenure, setLoanTenure] = useState(10);

  const fmt = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  const feeData: Record<string, { tuition: number; hostelYear: number; otherYear: number; scholarshipAmt: number; label: string }> = {
    IIT: { tuition: 225000, hostelYear: 50000, otherYear: 30000, scholarshipAmt: 75000, label: "IIT (B.Tech)" },
    NIT: { tuition: 150000, hostelYear: 40000, otherYear: 25000, scholarshipAmt: 62500, label: "NIT (B.Tech)" },
    "Private Engg": { tuition: 350000, hostelYear: 100000, otherYear: 40000, scholarshipAmt: 50000, label: "Private Engineering" },
    "Govt Medical": { tuition: 50000, hostelYear: 30000, otherYear: 20000, scholarshipAmt: 25000, label: "Government Medical (MBBS)" },
    "Pvt Medical": { tuition: 1500000, hostelYear: 150000, otherYear: 60000, scholarshipAmt: 100000, label: "Private Medical (MBBS)" },
    "IIM MBA": { tuition: 1200000, hostelYear: 150000, otherYear: 80000, scholarshipAmt: 200000, label: "IIM (MBA/PGP)" },
    "Pvt MBA": { tuition: 600000, hostelYear: 100000, otherYear: 50000, scholarshipAmt: 50000, label: "Private MBA" },
  };

  const result = useMemo(() => {
    const data = feeData[collegeType];
    if (!data) return null;

    const yearlyTuition = data.tuition;
    const yearlyHostel = hostel ? data.hostelYear : 0;
    const yearlyOther = data.otherYear;
    const yearlyTotal = yearlyTuition + yearlyHostel + yearlyOther;
    const yearlyScholarship = scholarship ? data.scholarshipAmt : 0;
    const yearlyNet = yearlyTotal - yearlyScholarship;
    const totalFee = yearlyTotal * duration;
    const totalScholarship = yearlyScholarship * duration;
    const totalNet = totalFee - totalScholarship;

    // Yearly breakdown
    const breakdown = Array.from({ length: duration }, (_, i) => ({
      year: i + 1,
      tuition: yearlyTuition,
      hostel: yearlyHostel,
      other: yearlyOther,
      total: yearlyTotal,
      scholarship: yearlyScholarship,
      net: yearlyNet,
    }));

    // Education loan EMI at 8.5%
    const loanAmount = totalNet;
    const r = 8.5 / 12 / 100;
    const n = loanTenure * 12;
    const emi = r > 0 ? (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : loanAmount / n;
    const totalRepayment = emi * n;
    const totalInterest = totalRepayment - loanAmount;

    return { yearlyTotal, totalFee, totalScholarship, totalNet, breakdown, emi, totalRepayment, totalInterest, loanAmount, label: data.label };
  }, [collegeType, duration, hostel, scholarship, loanTenure]);

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-700">College Type</label>
            <select className="calc-input" value={collegeType} onChange={(e) => setCollegeType(e.target.value)}>
              {Object.entries(feeData).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700">Course Duration (years)</label>
            <input type="number" className="calc-input" value={duration} onChange={(e) => setDuration(+e.target.value)} min={1} max={6} />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <input type="checkbox" checked={hostel} onChange={(e) => setHostel(e.target.checked)} className="w-4 h-4" id="hostel" />
            <label htmlFor="hostel" className="text-sm font-semibold text-gray-700">Include Hostel</label>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" checked={scholarship} onChange={(e) => setScholarship(e.target.checked)} className="w-4 h-4" id="scholarship" />
            <label htmlFor="scholarship" className="text-sm font-semibold text-gray-700">With Scholarship</label>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700">Loan Tenure (years)</label>
            <input type="number" className="calc-input" value={loanTenure} onChange={(e) => setLoanTenure(+e.target.value)} min={1} max={20} />
          </div>
        </div>
      </div>

      {result && (
        <>
          <div className="result-card space-y-4">
            <h3 className="text-lg font-bold text-gray-800">{result.label} - Fee Estimate</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <div className="text-xs font-medium text-gray-500 mb-1">Total Fee ({duration} yrs)</div>
                <div className="text-2xl font-extrabold text-indigo-600">{fmt(result.totalFee)}</div>
              </div>
              {scholarship && (
                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                  <div className="text-xs font-medium text-gray-500 mb-1">Scholarship Savings</div>
                  <div className="text-2xl font-extrabold text-emerald-600">-{fmt(result.totalScholarship)}</div>
                </div>
              )}
              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <div className="text-xs font-medium text-gray-500 mb-1">Net Payable</div>
                <div className="text-2xl font-extrabold text-gray-800">{fmt(result.totalNet)}</div>
              </div>
            </div>

            {/* Yearly Breakdown */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-2 text-gray-500">Year</th>
                    <th className="text-right py-2 px-2 text-gray-500">Tuition</th>
                    <th className="text-right py-2 px-2 text-gray-500">Hostel</th>
                    <th className="text-right py-2 px-2 text-gray-500">Other</th>
                    {scholarship && <th className="text-right py-2 px-2 text-gray-500">Scholarship</th>}
                    <th className="text-right py-2 px-2 text-gray-500">Net</th>
                  </tr>
                </thead>
                <tbody>
                  {result.breakdown.map((b) => (
                    <tr key={b.year} className="border-b border-gray-100">
                      <td className="py-2 px-2 font-medium">Year {b.year}</td>
                      <td className="text-right py-2 px-2">{fmt(b.tuition)}</td>
                      <td className="text-right py-2 px-2">{fmt(b.hostel)}</td>
                      <td className="text-right py-2 px-2">{fmt(b.other)}</td>
                      {scholarship && <td className="text-right py-2 px-2 text-emerald-600">-{fmt(b.scholarship)}</td>}
                      <td className="text-right py-2 px-2 font-bold">{fmt(b.net)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Loan EMI */}
          <div className="result-card space-y-4">
            <h3 className="text-lg font-bold text-gray-800">Education Loan EMI (at 8.5% p.a.)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <div className="text-xs font-medium text-gray-500 mb-1">Loan Amount</div>
                <div className="text-xl font-extrabold text-indigo-600">{fmt(result.loanAmount)}</div>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <div className="text-xs font-medium text-gray-500 mb-1">Monthly EMI</div>
                <div className="text-xl font-extrabold text-emerald-600">{fmt(result.emi)}</div>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <div className="text-xs font-medium text-gray-500 mb-1">Total Interest</div>
                <div className="text-xl font-extrabold text-red-500">{fmt(result.totalInterest)}</div>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <div className="text-xs font-medium text-gray-500 mb-1">Total Repayment</div>
                <div className="text-xl font-extrabold text-gray-800">{fmt(result.totalRepayment)}</div>
              </div>
            </div>
            <p className="text-xs text-gray-400 italic">* Fee estimates are approximate and vary by institution. Education loan interest is tax deductible under Section 80E.</p>
          </div>
        </>
      )}
    </div>
  );
}
