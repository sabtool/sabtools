"use client";
import { useState, useMemo } from "react";

export default function GateScoreCalculator() {
  const [marks, setMarks] = useState(55);
  const [qualifyingMarks, setQualifyingMarks] = useState(25);

  const result = useMemo(() => {
    if (marks < 0 || marks > 100) return null;

    // Simplified GATE score calculation
    // GATE Score = S_q + (S_t - S_q) * (M - M_q) / (M_t - M_q)
    // Where S_q=350 (qualifying score), S_t=900 (topper score), M_t=mean of top 0.1%, M_q=qualifying marks
    const Sq = 350;
    const St = 900;
    const Mt = 85; // Assumed mean of top 0.1%
    const Mq = qualifyingMarks;

    let gateScore: number;
    if (marks >= Mt) {
      gateScore = St;
    } else if (marks <= Mq) {
      gateScore = Sq * (marks / Mq);
    } else {
      gateScore = Sq + (St - Sq) * ((marks - Mq) / (Mt - Mq));
    }
    gateScore = Math.round(Math.min(1000, Math.max(0, gateScore)));

    const qualified = marks >= qualifyingMarks;

    let estimatedPercentile = 0;
    if (marks >= 80) estimatedPercentile = 99.9;
    else if (marks >= 70) estimatedPercentile = 99.5;
    else if (marks >= 60) estimatedPercentile = 98;
    else if (marks >= 50) estimatedPercentile = 95;
    else if (marks >= 40) estimatedPercentile = 88;
    else if (marks >= 30) estimatedPercentile = 75;
    else if (marks >= 25) estimatedPercentile = 60;
    else estimatedPercentile = 40;

    return { gateScore, qualified, marks, estimatedPercentile };
  }, [marks, qualifyingMarks]);

  const psuCutoffs = [
    { psu: "IOCL", general: 700, obc: 630, sc: 500, st: 500 },
    { psu: "BPCL", general: 650, obc: 585, sc: 460, st: 460 },
    { psu: "NTPC", general: 600, obc: 540, sc: 430, st: 430 },
    { psu: "BHEL", general: 550, obc: 495, sc: 400, st: 400 },
    { psu: "GAIL", general: 680, obc: 612, sc: 490, st: 490 },
    { psu: "ONGC", general: 650, obc: 585, sc: 460, st: 460 },
    { psu: "HPCL", general: 670, obc: 603, sc: 480, st: 480 },
    { psu: "PGCIL", general: 620, obc: 558, sc: 445, st: 445 },
  ];

  const qualifyingRef = [
    { category: "General", marks: "25 or 25% of highest (whichever higher)" },
    { category: "OBC (NCL)", marks: "22.5 or 22.5% of highest" },
    { category: "SC / ST / PwD", marks: "16.67 or 16.67% of highest" },
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">Marks Obtained (out of 100)</label>
              <span className="text-sm font-bold text-indigo-600">{marks}</span>
            </div>
            <input type="range" min={0} max={100} step={0.5} value={marks} onChange={(e) => setMarks(+e.target.value)} className="w-full" />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700">Qualifying Marks</label>
            <input type="number" className="calc-input" value={qualifyingMarks} onChange={(e) => setQualifyingMarks(+e.target.value)} min={0} max={100} />
            <p className="text-xs text-gray-400 mt-1">General: 25, OBC: 22.5, SC/ST: 16.67</p>
          </div>
        </div>
      </div>

      {result && (
        <div className="result-card space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Estimated GATE Score</div>
              <div className="text-2xl font-extrabold text-indigo-600">{result.gateScore}/1000</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Qualifying Status</div>
              <div className={`text-2xl font-extrabold ${result.qualified ? "text-emerald-600" : "text-red-500"}`}>
                {result.qualified ? "QUALIFIED" : "NOT QUALIFIED"}
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Estimated Percentile</div>
              <div className="text-2xl font-extrabold text-gray-800">{result.estimatedPercentile}%</div>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="h-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all" style={{ width: `${(result.gateScore / 1000) * 100}%` }} />
          </div>
        </div>
      )}

      {/* Qualifying Marks Reference */}
      <div className="result-card space-y-3">
        <h3 className="text-lg font-bold text-gray-800">Qualifying Marks Reference</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-2 text-gray-500">Category</th>
                <th className="text-left py-2 px-2 text-gray-500">Qualifying Marks</th>
              </tr>
            </thead>
            <tbody>
              {qualifyingRef.map((q) => (
                <tr key={q.category} className="border-b border-gray-100">
                  <td className="py-2 px-2 font-medium">{q.category}</td>
                  <td className="py-2 px-2">{q.marks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PSU Cutoffs */}
      <div className="result-card space-y-3">
        <h3 className="text-lg font-bold text-gray-800">PSU GATE Score Cutoffs (Approx.)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-2 text-gray-500">PSU</th>
                <th className="text-center py-2 px-2 text-gray-500">General</th>
                <th className="text-center py-2 px-2 text-gray-500">OBC</th>
                <th className="text-center py-2 px-2 text-gray-500">SC</th>
                <th className="text-center py-2 px-2 text-gray-500">ST</th>
              </tr>
            </thead>
            <tbody>
              {psuCutoffs.map((p) => (
                <tr key={p.psu} className="border-b border-gray-100">
                  <td className="py-2 px-2 font-medium">{p.psu}</td>
                  <td className={`text-center py-2 px-2 ${result && result.gateScore >= p.general ? "text-emerald-600 font-bold" : ""}`}>{p.general}</td>
                  <td className={`text-center py-2 px-2 ${result && result.gateScore >= p.obc ? "text-emerald-600 font-bold" : ""}`}>{p.obc}</td>
                  <td className={`text-center py-2 px-2 ${result && result.gateScore >= p.sc ? "text-emerald-600 font-bold" : ""}`}>{p.sc}</td>
                  <td className={`text-center py-2 px-2 ${result && result.gateScore >= p.st ? "text-emerald-600 font-bold" : ""}`}>{p.st}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 italic">* Green = your estimated score meets this cutoff. Actual cutoffs vary by year and branch.</p>
      </div>
    </div>
  );
}
