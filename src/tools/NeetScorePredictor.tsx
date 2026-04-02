"use client";
import { useState, useMemo } from "react";

export default function NeetScorePredictor() {
  const [correct, setCorrect] = useState(120);
  const [wrong, setWrong] = useState(30);

  const result = useMemo(() => {
    const total = 200;
    const unanswered = total - correct - wrong;
    if (correct < 0 || wrong < 0 || correct + wrong > total) return null;

    const rawScore = correct * 4 - wrong * 1;
    const maxScore = 720;
    const scoreOutOf720 = Math.max(0, rawScore);

    let percentile = 0;
    let category = "";
    if (scoreOutOf720 >= 700) { percentile = 99.99; category = "Top 50 - AIIMS Delhi, JIPMER likely"; }
    else if (scoreOutOf720 >= 680) { percentile = 99.95; category = "Top 200 - Top Govt Medical Colleges"; }
    else if (scoreOutOf720 >= 650) { percentile = 99.8; category = "Top 1,000 - Govt Medical Colleges (General)"; }
    else if (scoreOutOf720 >= 600) { percentile = 99.5; category = "Top 5,000 - Good Govt Medical Colleges"; }
    else if (scoreOutOf720 >= 550) { percentile = 98; category = "Top 15,000 - Govt/Semi-Govt Colleges"; }
    else if (scoreOutOf720 >= 500) { percentile = 95; category = "Top 50,000 - State Govt Colleges possible"; }
    else if (scoreOutOf720 >= 450) { percentile = 90; category = "Private Medical Colleges"; }
    else if (scoreOutOf720 >= 400) { percentile = 80; category = "Deemed/Private Colleges with higher fees"; }
    else if (scoreOutOf720 >= 350) { percentile = 65; category = "Limited options - BAMS/BHMS possible"; }
    else if (scoreOutOf720 >= 300) { percentile = 50; category = "Below cutoff for most MBBS seats"; }
    else if (scoreOutOf720 >= 150) { percentile = 30; category = "Not qualifying for MBBS"; }
    else { percentile = 10; category = "Needs significant improvement"; }

    return { rawScore: scoreOutOf720, maxScore, percentile, category, unanswered, attempted: correct + wrong };
  }, [correct, wrong]);

  const cutoffs = [
    { year: "2024", general: 720, obc: 137, sc: 107, st: 107 },
    { year: "2023", general: 720, obc: 137, sc: 107, st: 107 },
    { year: "2022", general: 715, obc: 137, sc: 107, st: 107 },
    { year: "2021", general: 720, obc: 137, sc: 107, st: 107 },
  ];

  const qualifyingCutoffs = [
    { category: "General / EWS", cutoff: "720-137 (50th percentile)" },
    { category: "OBC / SC / ST", cutoff: "136-107 (40th percentile)" },
    { category: "General-PH", cutoff: "136-121 (45th percentile)" },
    { category: "SC/ST/OBC-PH", cutoff: "120-107 (40th percentile)" },
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-700">Correct Answers</label>
            <input type="number" className="calc-input" value={correct} onChange={(e) => setCorrect(+e.target.value)} min={0} max={200} />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700">Wrong Answers</label>
            <input type="number" className="calc-input" value={wrong} onChange={(e) => setWrong(+e.target.value)} min={0} max={200} />
          </div>
        </div>
        <p className="text-sm text-gray-500">Total Questions: 200 | Scoring: +4 correct, -1 wrong, 0 unanswered</p>
      </div>

      {result && (
        <div className="result-card space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Raw Score</div>
              <div className="text-2xl font-extrabold text-indigo-600">{result.rawScore}/{result.maxScore}</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Estimated Percentile</div>
              <div className="text-2xl font-extrabold text-emerald-600">{result.percentile}%</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Attempted</div>
              <div className="text-2xl font-extrabold text-gray-800">{result.attempted}/200</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Unanswered</div>
              <div className="text-2xl font-extrabold text-amber-600">{result.unanswered}</div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4">
            <div className="text-sm font-semibold text-gray-700 mb-1">Expected Category</div>
            <div className="text-lg font-bold text-indigo-700">{result.category}</div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="h-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all" style={{ width: `${(result.rawScore / result.maxScore) * 100}%` }} />
          </div>
        </div>
      )}

      {/* Qualifying Cutoffs */}
      <div className="result-card space-y-3">
        <h3 className="text-lg font-bold text-gray-800">NEET Qualifying Cutoffs (2024)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-2 text-gray-500">Category</th>
                <th className="text-center py-2 px-2 text-gray-500">Score Range</th>
              </tr>
            </thead>
            <tbody>
              {qualifyingCutoffs.map((c) => (
                <tr key={c.category} className="border-b border-gray-100">
                  <td className="py-2 px-2 font-medium">{c.category}</td>
                  <td className="text-center py-2 px-2">{c.cutoff}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Previous Year Toppers */}
      <div className="result-card space-y-3">
        <h3 className="text-lg font-bold text-gray-800">Previous Year Top Scores</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-2 text-gray-500">Year</th>
                <th className="text-center py-2 px-2 text-gray-500">Highest Score</th>
                <th className="text-center py-2 px-2 text-gray-500">OBC Cutoff</th>
                <th className="text-center py-2 px-2 text-gray-500">SC/ST Cutoff</th>
              </tr>
            </thead>
            <tbody>
              {cutoffs.map((c) => (
                <tr key={c.year} className="border-b border-gray-100">
                  <td className="py-2 px-2 font-medium">{c.year}</td>
                  <td className="text-center py-2 px-2 font-semibold text-indigo-600">{c.general}</td>
                  <td className="text-center py-2 px-2">{c.obc}</td>
                  <td className="text-center py-2 px-2">{c.sc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
