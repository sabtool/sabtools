"use client";
import { useState, useMemo } from "react";

const ROLES = [
  "Software Engineer", "Senior Software Engineer", "Data Analyst", "Data Scientist", "Product Manager",
  "Marketing Manager", "HR Manager", "Business Analyst", "UI/UX Designer", "DevOps Engineer",
  "Full Stack Developer", "Frontend Developer", "Backend Developer", "Mobile App Developer",
  "Teacher", "Doctor", "Chartered Accountant (CA)", "Civil Engineer", "Mechanical Engineer",
  "Electrical Engineer", "Financial Analyst", "Content Writer", "Graphic Designer", "Sales Manager",
];

const CITIES = ["Mumbai", "Bangalore", "Delhi", "Hyderabad", "Pune", "Chennai", "Kolkata"];

// Salary data: role -> city -> [min, avg, max] in LPA
const SALARY_DATA: Record<string, Record<string, [number, number, number]>> = {
  "Software Engineer":        { Mumbai: [4, 8, 16], Bangalore: [5, 9, 18], Delhi: [4, 7.5, 15], Hyderabad: [4, 8, 16], Pune: [3.5, 7, 14], Chennai: [3.5, 7, 14], Kolkata: [3, 6, 12] },
  "Senior Software Engineer": { Mumbai: [12, 20, 35], Bangalore: [14, 22, 40], Delhi: [11, 18, 32], Hyderabad: [12, 19, 34], Pune: [10, 17, 30], Chennai: [10, 16, 28], Kolkata: [8, 14, 25] },
  "Data Analyst":             { Mumbai: [4, 7, 14], Bangalore: [4.5, 8, 15], Delhi: [3.5, 6.5, 13], Hyderabad: [4, 7, 13], Pune: [3.5, 6, 12], Chennai: [3, 6, 11], Kolkata: [2.5, 5, 10] },
  "Data Scientist":           { Mumbai: [8, 15, 28], Bangalore: [9, 17, 32], Delhi: [7, 13, 25], Hyderabad: [8, 14, 27], Pune: [7, 13, 24], Chennai: [6, 12, 22], Kolkata: [5, 10, 20] },
  "Product Manager":          { Mumbai: [10, 18, 35], Bangalore: [12, 20, 38], Delhi: [9, 16, 30], Hyderabad: [9, 16, 30], Pune: [8, 15, 28], Chennai: [8, 14, 26], Kolkata: [6, 12, 22] },
  "Marketing Manager":        { Mumbai: [6, 12, 22], Bangalore: [6, 11, 20], Delhi: [5.5, 11, 20], Hyderabad: [5, 10, 18], Pune: [5, 9, 17], Chennai: [4.5, 9, 16], Kolkata: [4, 8, 15] },
  "HR Manager":               { Mumbai: [6, 11, 20], Bangalore: [6, 10, 18], Delhi: [5, 10, 18], Hyderabad: [5, 9, 16], Pune: [4.5, 8, 15], Chennai: [4.5, 8, 15], Kolkata: [4, 7, 13] },
  "Business Analyst":         { Mumbai: [5, 10, 18], Bangalore: [6, 11, 20], Delhi: [5, 9, 17], Hyderabad: [5, 9, 17], Pune: [4.5, 8, 16], Chennai: [4, 8, 15], Kolkata: [3.5, 7, 13] },
  "UI/UX Designer":           { Mumbai: [4, 8, 16], Bangalore: [5, 9, 18], Delhi: [4, 7, 14], Hyderabad: [4, 7.5, 15], Pune: [3.5, 7, 13], Chennai: [3.5, 6.5, 13], Kolkata: [3, 5.5, 11] },
  "DevOps Engineer":          { Mumbai: [6, 12, 24], Bangalore: [7, 14, 28], Delhi: [6, 11, 22], Hyderabad: [6, 12, 23], Pune: [5, 10, 20], Chennai: [5, 10, 19], Kolkata: [4, 8, 16] },
  "Full Stack Developer":     { Mumbai: [5, 10, 20], Bangalore: [6, 12, 24], Delhi: [5, 9, 18], Hyderabad: [5, 10, 20], Pune: [4.5, 9, 18], Chennai: [4, 8, 16], Kolkata: [3.5, 7, 14] },
  "Frontend Developer":       { Mumbai: [4, 8, 16], Bangalore: [4.5, 9, 18], Delhi: [3.5, 7, 14], Hyderabad: [4, 8, 15], Pune: [3.5, 7, 14], Chennai: [3, 6.5, 13], Kolkata: [3, 5.5, 11] },
  "Backend Developer":        { Mumbai: [5, 10, 18], Bangalore: [5.5, 11, 20], Delhi: [4.5, 9, 17], Hyderabad: [5, 9.5, 18], Pune: [4, 8.5, 16], Chennai: [4, 8, 15], Kolkata: [3.5, 7, 13] },
  "Mobile App Developer":     { Mumbai: [4, 9, 18], Bangalore: [5, 10, 20], Delhi: [4, 8, 16], Hyderabad: [4, 8.5, 17], Pune: [3.5, 8, 15], Chennai: [3.5, 7.5, 14], Kolkata: [3, 6.5, 12] },
  "Teacher":                  { Mumbai: [2.5, 4.5, 8], Bangalore: [2.5, 4.5, 8], Delhi: [3, 5, 9], Hyderabad: [2, 4, 7], Pune: [2, 4, 7], Chennai: [2, 3.5, 6.5], Kolkata: [1.5, 3.5, 6] },
  "Doctor":                   { Mumbai: [6, 15, 40], Bangalore: [6, 14, 38], Delhi: [6, 15, 42], Hyderabad: [5, 12, 35], Pune: [5, 12, 32], Chennai: [5, 12, 35], Kolkata: [4, 10, 28] },
  "Chartered Accountant (CA)":{ Mumbai: [7, 14, 30], Bangalore: [7, 13, 28], Delhi: [7, 14, 30], Hyderabad: [6, 12, 25], Pune: [5.5, 11, 22], Chennai: [5, 10, 22], Kolkata: [5, 10, 20] },
  "Civil Engineer":           { Mumbai: [3, 5.5, 12], Bangalore: [3, 5.5, 11], Delhi: [3, 5.5, 12], Hyderabad: [2.5, 5, 10], Pune: [2.5, 5, 10], Chennai: [2.5, 4.5, 9], Kolkata: [2, 4, 8] },
  "Mechanical Engineer":      { Mumbai: [3, 5, 10], Bangalore: [3, 5.5, 11], Delhi: [3, 5, 10], Hyderabad: [2.5, 4.5, 9], Pune: [3, 5.5, 11], Chennai: [2.5, 5, 10], Kolkata: [2, 4, 8] },
  "Electrical Engineer":      { Mumbai: [3, 5.5, 11], Bangalore: [3, 5.5, 11], Delhi: [3, 5, 10], Hyderabad: [2.5, 5, 9.5], Pune: [2.5, 5, 10], Chennai: [2.5, 4.5, 9], Kolkata: [2, 4, 8] },
  "Financial Analyst":        { Mumbai: [5, 10, 20], Bangalore: [5, 9, 18], Delhi: [5, 9.5, 18], Hyderabad: [4, 8, 16], Pune: [4, 8, 15], Chennai: [4, 7.5, 14], Kolkata: [3.5, 7, 13] },
  "Content Writer":           { Mumbai: [2.5, 5, 10], Bangalore: [3, 5.5, 11], Delhi: [2.5, 5, 10], Hyderabad: [2, 4.5, 9], Pune: [2, 4.5, 9], Chennai: [2, 4, 8], Kolkata: [1.8, 3.5, 7] },
  "Graphic Designer":         { Mumbai: [2.5, 5, 10], Bangalore: [3, 5.5, 11], Delhi: [2.5, 5, 10], Hyderabad: [2, 4.5, 9], Pune: [2, 4.5, 9], Chennai: [2, 4, 8], Kolkata: [1.8, 3.5, 7] },
  "Sales Manager":            { Mumbai: [5, 10, 20], Bangalore: [5, 9, 18], Delhi: [5, 10, 20], Hyderabad: [4, 8, 16], Pune: [4, 8, 15], Chennai: [4, 7.5, 14], Kolkata: [3.5, 7, 13] },
};

// Cost of living index relative to Bangalore = 100
const COL_INDEX: Record<string, number> = { Mumbai: 110, Bangalore: 100, Delhi: 105, Hyderabad: 85, Pune: 88, Chennai: 90, Kolkata: 78 };

export default function SalaryComparisonTool() {
  const [role, setRole] = useState(ROLES[0]);
  const [city1, setCity1] = useState("Bangalore");
  const [city2, setCity2] = useState("Mumbai");

  const data = useMemo(() => {
    const roleData = SALARY_DATA[role];
    if (!roleData) return null;
    const c1 = roleData[city1];
    const c2 = roleData[city2];
    if (!c1 || !c2) return null;

    const col1 = COL_INDEX[city1] || 100;
    const col2 = COL_INDEX[city2] || 100;
    const adjusted1 = c1.map(v => Math.round((v / col1) * 100 * 10) / 10) as [number, number, number];
    const adjusted2 = c2.map(v => Math.round((v / col2) * 100 * 10) / 10) as [number, number, number];

    return { c1, c2, col1, col2, adjusted1, adjusted2 };
  }, [role, city1, city2]);

  const fmt = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 1 }).format(n * 100000);
  const fmtL = (n: number) => `${n} LPA`;

  return (
    <div className="space-y-6">
      {/* Role selector */}
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Select Role</label>
        <select value={role} onChange={e => setRole(e.target.value)} className="calc-input">
          {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      {/* City selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">City 1</label>
          <select value={city1} onChange={e => setCity1(e.target.value)} className="calc-input">
            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">City 2</label>
          <select value={city2} onChange={e => setCity2(e.target.value)} className="calc-input">
            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {data && (
        <div className="space-y-4">
          {/* Comparison Table */}
          <div className="result-card">
            <h3 className="font-bold text-gray-800 mb-3">Salary Comparison: {role}</h3>
            <div className="table-responsive">
              <table>
                <thead>
                  <tr><th></th><th className="text-center">{city1}</th><th className="text-center">{city2}</th><th className="text-center">Difference</th></tr>
                </thead>
                <tbody>
                  {(["Minimum", "Average", "Maximum"] as const).map((label, i) => (
                    <tr key={label}>
                      <td className="font-semibold">{label}</td>
                      <td className="text-center">{fmtL(data.c1[i])}</td>
                      <td className="text-center">{fmtL(data.c2[i])}</td>
                      <td className={`text-center font-semibold ${data.c2[i] - data.c1[i] > 0 ? "text-green-600" : data.c2[i] - data.c1[i] < 0 ? "text-red-600" : "text-gray-600"}`}>
                        {data.c2[i] - data.c1[i] > 0 ? "+" : ""}{(data.c2[i] - data.c1[i]).toFixed(1)} LPA
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Visual Bar Chart */}
          <div className="result-card">
            <h3 className="font-bold text-gray-800 mb-3">Visual Comparison (Average Salary)</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1"><span className="font-medium">{city1}</span><span>{fmtL(data.c1[1])}</span></div>
                <div className="w-full bg-gray-200 rounded-full h-6"><div className="bg-indigo-600 h-6 rounded-full flex items-center justify-end pr-2 text-white text-xs font-bold" style={{ width: `${Math.min(100, (data.c1[1] / Math.max(data.c1[2], data.c2[2])) * 100)}%` }}>{fmt(data.c1[1])}</div></div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1"><span className="font-medium">{city2}</span><span>{fmtL(data.c2[1])}</span></div>
                <div className="w-full bg-gray-200 rounded-full h-6"><div className="bg-emerald-600 h-6 rounded-full flex items-center justify-end pr-2 text-white text-xs font-bold" style={{ width: `${Math.min(100, (data.c2[1] / Math.max(data.c1[2], data.c2[2])) * 100)}%` }}>{fmt(data.c2[1])}</div></div>
              </div>
            </div>
          </div>

          {/* Cost of Living Adjusted */}
          <div className="result-card">
            <h3 className="font-bold text-gray-800 mb-3">Cost of Living Adjusted Salary</h3>
            <p className="text-xs text-gray-500 mb-3">Adjusted to a baseline index of 100. Higher adjusted salary = better purchasing power.</p>
            <div className="table-responsive">
              <table>
                <thead>
                  <tr><th></th><th className="text-center">{city1} (COL: {data.col1})</th><th className="text-center">{city2} (COL: {data.col2})</th></tr>
                </thead>
                <tbody>
                  {(["Minimum", "Average", "Maximum"] as const).map((label, i) => (
                    <tr key={label}>
                      <td className="font-semibold">{label}</td>
                      <td className="text-center">{fmtL(data.adjusted1[i])}</td>
                      <td className="text-center">{fmtL(data.adjusted2[i])}</td>
                    </tr>
                  ))}
                  <tr className="bg-indigo-50 font-bold text-indigo-700">
                    <td>Better Value</td>
                    <td className="text-center" colSpan={2}>
                      {data.adjusted1[1] > data.adjusted2[1] ? `${city1} offers ${((data.adjusted1[1] - data.adjusted2[1]) / data.adjusted2[1] * 100).toFixed(1)}% better purchasing power` : data.adjusted2[1] > data.adjusted1[1] ? `${city2} offers ${((data.adjusted2[1] - data.adjusted1[1]) / data.adjusted1[1] * 100).toFixed(1)}% better purchasing power` : "Both cities offer similar purchasing power"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
        <div className="flex items-start gap-2">
          <span className="text-lg">{"\u2139\uFE0F"}</span>
          <div>
            <p className="font-semibold mb-1">Disclaimer</p>
            <p>Salary ranges are estimates. Actual salaries vary by experience, company, and skills. Check glassdoor.co.in for current data.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
