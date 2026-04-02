"use client";
import { useState, useMemo } from "react";

export default function CatPercentileCalculator() {
  const [totalScore, setTotalScore] = useState(150);
  const [varc, setVarc] = useState(50);
  const [dilr, setDilr] = useState(50);
  const [qa, setQa] = useState(50);

  const result = useMemo(() => {
    if (totalScore < 0 || totalScore > 228) return null;

    function getPercentile(score: number, max: number): { percentile: number; label: string } {
      const pct = (score / max) * 100;
      if (pct >= 95) return { percentile: 99.5, label: "Exceptional" };
      if (pct >= 85) return { percentile: 98, label: "Excellent" };
      if (pct >= 75) return { percentile: 95, label: "Very Good" };
      if (pct >= 65) return { percentile: 90, label: "Good" };
      if (pct >= 55) return { percentile: 85, label: "Above Average" };
      if (pct >= 45) return { percentile: 75, label: "Average" };
      if (pct >= 35) return { percentile: 60, label: "Below Average" };
      return { percentile: 40, label: "Needs Improvement" };
    }

    const overall = getPercentile(totalScore, 228);
    const varcResult = getPercentile(varc, 76);
    const dilrResult = getPercentile(dilr, 76);
    const qaResult = getPercentile(qa, 76);

    return { overall, varc: varcResult, dilr: dilrResult, qa: qaResult };
  }, [totalScore, varc, dilr, qa]);

  const iimCutoffs = [
    { college: "IIM Ahmedabad", overall: 80, varc: 70, dilr: 70, qa: 70, cat: "99+" },
    { college: "IIM Bangalore", overall: 85, varc: 75, dilr: 75, qa: 75, cat: "99+" },
    { college: "IIM Calcutta", overall: 80, varc: 75, dilr: 70, qa: 75, cat: "99+" },
    { college: "IIM Lucknow", overall: 90, varc: 80, dilr: 80, qa: 80, cat: "97+" },
    { college: "IIM Kozhikode", overall: 85, varc: 75, dilr: 75, qa: 75, cat: "97+" },
    { college: "IIM Indore", overall: 90, varc: 80, dilr: 80, qa: 80, cat: "96+" },
    { college: "FMS Delhi", overall: 98, varc: 90, dilr: 85, qa: 85, cat: "98+" },
    { college: "XLRI Jamshedpur", overall: 93, varc: 80, dilr: 80, qa: 80, cat: "96+" },
  ];

  const categoryCutoffs = [
    { category: "General", iimA: "99+", iimB: "99+", iimC: "99+", iimL: "97+" },
    { category: "NC-OBC", iimA: "94+", iimB: "95+", iimC: "95+", iimL: "90+" },
    { category: "SC", iimA: "80+", iimB: "80+", iimC: "80+", iimL: "75+" },
    { category: "ST", iimA: "70+", iimB: "70+", iimC: "70+", iimL: "65+" },
    { category: "PwD", iimA: "70+", iimB: "70+", iimC: "70+", iimL: "65+" },
    { category: "EWS", iimA: "90+", iimB: "90+", iimC: "90+", iimL: "85+" },
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-semibold text-gray-700">Total Score (out of 228)</label>
          <input type="number" className="calc-input" value={totalScore} onChange={(e) => setTotalScore(+e.target.value)} min={0} max={228} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-700">VARC Score (out of 76)</label>
            <input type="number" className="calc-input" value={varc} onChange={(e) => setVarc(+e.target.value)} min={0} max={76} />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700">DILR Score (out of 76)</label>
            <input type="number" className="calc-input" value={dilr} onChange={(e) => setDilr(+e.target.value)} min={0} max={76} />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700">QA Score (out of 76)</label>
            <input type="number" className="calc-input" value={qa} onChange={(e) => setQa(+e.target.value)} min={0} max={76} />
          </div>
        </div>
        <p className="text-sm text-gray-500">CAT has 66 questions, 228 marks total (3 marks each, -1 for wrong MCQ, no negative for TITA).</p>
      </div>

      {result && (
        <div className="result-card space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Overall Percentile</div>
              <div className="text-2xl font-extrabold text-indigo-600">{result.overall.percentile}%</div>
              <div className="text-xs text-gray-400">{result.overall.label}</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">VARC Percentile</div>
              <div className="text-2xl font-extrabold text-blue-600">{result.varc.percentile}%</div>
              <div className="text-xs text-gray-400">{result.varc.label}</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">DILR Percentile</div>
              <div className="text-2xl font-extrabold text-purple-600">{result.dilr.percentile}%</div>
              <div className="text-xs text-gray-400">{result.dilr.label}</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">QA Percentile</div>
              <div className="text-2xl font-extrabold text-emerald-600">{result.qa.percentile}%</div>
              <div className="text-xs text-gray-400">{result.qa.label}</div>
            </div>
          </div>
        </div>
      )}

      {/* IIM Cutoff Reference */}
      <div className="result-card space-y-3">
        <h3 className="text-lg font-bold text-gray-800">IIM Sectional Percentile Cutoffs (Approx.)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-2 text-gray-500">College</th>
                <th className="text-center py-2 px-2 text-gray-500">Overall</th>
                <th className="text-center py-2 px-2 text-gray-500">VARC</th>
                <th className="text-center py-2 px-2 text-gray-500">DILR</th>
                <th className="text-center py-2 px-2 text-gray-500">QA</th>
                <th className="text-center py-2 px-2 text-gray-500">CAT %ile</th>
              </tr>
            </thead>
            <tbody>
              {iimCutoffs.map((c) => (
                <tr key={c.college} className="border-b border-gray-100">
                  <td className="py-2 px-2 font-medium">{c.college}</td>
                  <td className="text-center py-2 px-2">{c.overall}</td>
                  <td className="text-center py-2 px-2">{c.varc}</td>
                  <td className="text-center py-2 px-2">{c.dilr}</td>
                  <td className="text-center py-2 px-2">{c.qa}</td>
                  <td className="text-center py-2 px-2 font-bold text-indigo-600">{c.cat}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Category-wise Cutoffs */}
      <div className="result-card space-y-3">
        <h3 className="text-lg font-bold text-gray-800">Category-wise Overall Percentile Cutoffs</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-2 text-gray-500">Category</th>
                <th className="text-center py-2 px-2 text-gray-500">IIM A</th>
                <th className="text-center py-2 px-2 text-gray-500">IIM B</th>
                <th className="text-center py-2 px-2 text-gray-500">IIM C</th>
                <th className="text-center py-2 px-2 text-gray-500">IIM L</th>
              </tr>
            </thead>
            <tbody>
              {categoryCutoffs.map((c) => (
                <tr key={c.category} className="border-b border-gray-100">
                  <td className="py-2 px-2 font-medium">{c.category}</td>
                  <td className="text-center py-2 px-2">{c.iimA}</td>
                  <td className="text-center py-2 px-2">{c.iimB}</td>
                  <td className="text-center py-2 px-2">{c.iimC}</td>
                  <td className="text-center py-2 px-2">{c.iimL}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 italic">* Cutoffs are approximate and change every year. Final selection includes WAT/PI scores, profile, and work experience.</p>
      </div>
    </div>
  );
}
