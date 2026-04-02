"use client";
import { useState, useMemo } from "react";

export default function ScholarshipEligibilityChecker() {
  const [category, setCategory] = useState<"General" | "OBC" | "SC" | "ST">("General");
  const [income, setIncome] = useState(300000);
  const [percentage, setPercentage] = useState(75);
  const [level, setLevel] = useState<"10th" | "12th" | "UG" | "PG">("UG");

  const fmt = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  const scholarships = useMemo(() => {
    const all = [
      {
        name: "National Scholarship Portal (NSP) - Central Sector Scheme",
        amount: "Up to Rs 20,000/year (UG), Rs 20,000/year (PG)",
        eligibility: { minPct: 80, maxIncome: 800000, categories: ["General", "OBC", "SC", "ST"], levels: ["UG", "PG"] },
        where: "scholarships.gov.in",
        details: "For students above 80th percentile of board exam. Renewal based on performance.",
      },
      {
        name: "Post-Matric Scholarship for SC Students",
        amount: "Full tuition + maintenance allowance Rs 550-1200/month",
        eligibility: { minPct: 0, maxIncome: 250000, categories: ["SC"], levels: ["12th", "UG", "PG"] },
        where: "scholarships.gov.in / State SC Welfare Dept",
        details: "Covers tuition fees, maintenance allowance, and other charges for SC students.",
      },
      {
        name: "Post-Matric Scholarship for ST Students",
        amount: "Full tuition + maintenance allowance",
        eligibility: { minPct: 0, maxIncome: 250000, categories: ["ST"], levels: ["12th", "UG", "PG"] },
        where: "scholarships.gov.in / State Tribal Welfare Dept",
        details: "For ST students pursuing post-matric education. Covers fees and monthly allowance.",
      },
      {
        name: "Post-Matric Scholarship for OBC Students",
        amount: "Tuition fee reimbursement + Rs 500-750/month",
        eligibility: { minPct: 0, maxIncome: 300000, categories: ["OBC"], levels: ["12th", "UG", "PG"] },
        where: "scholarships.gov.in / State BC Welfare Dept",
        details: "Non-creamy layer OBC students with family income below Rs 3 lakh.",
      },
      {
        name: "Merit-cum-Means Scholarship (Minorities)",
        amount: "Up to Rs 20,000/year",
        eligibility: { minPct: 50, maxIncome: 250000, categories: ["General", "OBC"], levels: ["UG", "PG"] },
        where: "scholarships.gov.in / Ministry of Minority Affairs",
        details: "For minority community students (Muslim, Christian, Sikh, Buddhist, Jain, Parsi).",
      },
      {
        name: "INSPIRE Scholarship (DST)",
        amount: "Rs 80,000/year for 5 years",
        eligibility: { minPct: 85, maxIncome: 9999999, categories: ["General", "OBC", "SC", "ST"], levels: ["UG"] },
        where: "online-inspire.gov.in",
        details: "For top 1% in 12th board exam, pursuing BSc/BS/Int. MSc in Natural & Basic Sciences.",
      },
      {
        name: "KVPY Fellowship (now part of INSPIRE)",
        amount: "Rs 5,000-7,000/month + annual contingency",
        eligibility: { minPct: 75, maxIncome: 9999999, categories: ["General", "OBC", "SC", "ST"], levels: ["UG", "PG"] },
        where: "kvpy.iisc.ac.in (merged with INSPIRE)",
        details: "For students in Basic Sciences. Now integrated into INSPIRE programme.",
      },
      {
        name: "AICTE Pragati Scholarship (Girls)",
        amount: "Rs 50,000/year for up to 4 years",
        eligibility: { minPct: 0, maxIncome: 800000, categories: ["General", "OBC", "SC", "ST"], levels: ["UG"] },
        where: "aicte-india.org",
        details: "For girl students in AICTE approved technical degree programs. Max 2 girls per family.",
      },
      {
        name: "PM Scholarship Scheme (CAPF/Armed Forces)",
        amount: "Rs 3,000/month (boys), Rs 3,000/month (girls)",
        eligibility: { minPct: 60, maxIncome: 9999999, categories: ["General", "OBC", "SC", "ST"], levels: ["UG", "PG"] },
        where: "scholarships.gov.in / KSB",
        details: "For wards of ex-servicemen, CAPF & Assam Rifles personnel.",
      },
      {
        name: "National Means-cum-Merit Scholarship (NMMSS)",
        amount: "Rs 12,000/year (Class 9 to 12)",
        eligibility: { minPct: 55, maxIncome: 350000, categories: ["General", "OBC", "SC", "ST"], levels: ["10th", "12th"] },
        where: "scholarships.gov.in / State Education Dept",
        details: "For meritorious students from economically weaker sections studying in government schools.",
      },
      {
        name: "Begum Hazrat Mahal Scholarship (Minorities - Girls)",
        amount: "Rs 5,000 (9th-10th), Rs 6,000 (11th-12th)",
        eligibility: { minPct: 50, maxIncome: 200000, categories: ["General", "OBC"], levels: ["10th", "12th"] },
        where: "bhmnsmaef.org",
        details: "For minority girl students in Classes 9-12 with minimum 50% marks.",
      },
    ];

    return all.map((s) => {
      const eligible =
        s.eligibility.categories.includes(category) &&
        income <= s.eligibility.maxIncome &&
        percentage >= s.eligibility.minPct &&
        s.eligibility.levels.includes(level);
      return { ...s, eligible };
    });
  }, [category, income, percentage, level]);

  const eligibleCount = scholarships.filter((s) => s.eligible).length;

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-700">Category</label>
            <select className="calc-input" value={category} onChange={(e) => setCategory(e.target.value as typeof category)}>
              <option value="General">General</option>
              <option value="OBC">OBC</option>
              <option value="SC">SC</option>
              <option value="ST">ST</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700">Current Level</label>
            <select className="calc-input" value={level} onChange={(e) => setLevel(e.target.value as typeof level)}>
              <option value="10th">Class 10th</option>
              <option value="12th">Class 12th</option>
              <option value="UG">Undergraduate (UG)</option>
              <option value="PG">Postgraduate (PG)</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-700">Family Annual Income</label>
            <input type="number" className="calc-input" value={income} onChange={(e) => setIncome(+e.target.value)} min={0} />
            <p className="text-xs text-gray-400 mt-1">{fmt(income)}</p>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700">Percentage / CGPA x 9.5</label>
            <input type="number" className="calc-input" value={percentage} onChange={(e) => setPercentage(+e.target.value)} min={0} max={100} />
          </div>
        </div>
      </div>

      <div className="result-card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">Scholarship Results</h3>
          <span className="px-3 py-1 rounded-full text-sm font-bold bg-indigo-100 text-indigo-700">
            {eligibleCount} Eligible
          </span>
        </div>

        <div className="space-y-4">
          {scholarships.map((s, i) => (
            <div key={i} className={`rounded-xl p-4 border-2 ${s.eligible ? "border-green-200 bg-green-50" : "border-gray-100 bg-gray-50 opacity-60"}`}>
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-gray-800 text-sm">{s.name}</h4>
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${s.eligible ? "bg-green-200 text-green-800" : "bg-gray-200 text-gray-600"}`}>
                  {s.eligible ? "ELIGIBLE" : "NOT ELIGIBLE"}
                </span>
              </div>
              <p className="text-sm text-indigo-700 font-semibold mb-1">{s.amount}</p>
              <p className="text-xs text-gray-600 mb-2">{s.details}</p>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700">Apply: {s.where}</span>
                <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-600">Income: {s.eligibility.maxIncome >= 9999999 ? "No limit" : `Below ${fmt(s.eligibility.maxIncome)}`}</span>
                <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-600">Min %: {s.eligibility.minPct || "None"}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
