"use client";
import { useState, useMemo } from "react";

export default function JeeRankPredictor() {
  const [score, setScore] = useState(180);

  const result = useMemo(() => {
    if (score < 0 || score > 300) return null;
    const pct = (score / 300) * 100;

    let percentile = 0;
    let rankRange = "";
    let category = "";

    if (score >= 280) { percentile = 99.99; rankRange = "1 - 20"; category = "IIT Bombay CSE, IIT Delhi CSE"; }
    else if (score >= 250) { percentile = 99.95; rankRange = "20 - 200"; category = "Top IIT branches (CSE/ECE)"; }
    else if (score >= 220) { percentile = 99.8; rankRange = "200 - 1,000"; category = "IIT - Good branches"; }
    else if (score >= 200) { percentile = 99.5; rankRange = "1,000 - 3,000"; category = "IIT - Most branches"; }
    else if (score >= 180) { percentile = 99; rankRange = "3,000 - 8,000"; category = "Old IITs / Top NITs CSE"; }
    else if (score >= 150) { percentile = 98; rankRange = "8,000 - 20,000"; category = "New IITs / NITs popular branches"; }
    else if (score >= 120) { percentile = 96; rankRange = "20,000 - 50,000"; category = "NITs / IIITs good branches"; }
    else if (score >= 100) { percentile = 93; rankRange = "50,000 - 80,000"; category = "NITs / IIITs available branches"; }
    else if (score >= 80) { percentile = 88; rankRange = "80,000 - 1,50,000"; category = "IIITs / GFTIs"; }
    else if (score >= 50) { percentile = 75; rankRange = "1,50,000 - 3,00,000"; category = "State colleges / Private"; }
    else { percentile = 50; rankRange = "3,00,000+"; category = "State level counselling"; }

    return { score, pct, percentile, rankRange, category };
  }, [score]);

  const iitCutoffs = [
    { college: "IIT Bombay - CSE", general: "< 70", obc: "< 120", sc: "< 700", st: "< 350" },
    { college: "IIT Delhi - CSE", general: "< 100", obc: "< 180", sc: "< 900", st: "< 450" },
    { college: "IIT Madras - CSE", general: "< 120", obc: "< 200", sc: "< 1,000", st: "< 500" },
    { college: "IIT Kanpur - CSE", general: "< 200", obc: "< 350", sc: "< 1,500", st: "< 700" },
    { college: "IIT Kharagpur - CSE", general: "< 300", obc: "< 500", sc: "< 2,000", st: "< 900" },
    { college: "IIT Roorkee - CSE", general: "< 500", obc: "< 800", sc: "< 2,500", st: "< 1,200" },
  ];

  const nitCutoffs = [
    { college: "NIT Trichy - CSE", general: "< 3,000", obc: "< 5,000", sc: "< 15,000", st: "< 8,000" },
    { college: "NIT Warangal - CSE", general: "< 4,000", obc: "< 7,000", sc: "< 18,000", st: "< 10,000" },
    { college: "NIT Surathkal - CSE", general: "< 4,500", obc: "< 8,000", sc: "< 20,000", st: "< 12,000" },
    { college: "IIIT Hyderabad - CSE", general: "< 2,000", obc: "< 4,000", sc: "< 12,000", st: "< 6,000" },
    { college: "IIIT Allahabad - IT", general: "< 8,000", obc: "< 15,000", sc: "< 35,000", st: "< 20,000" },
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">JEE Main Score (out of 300)</label>
            <span className="text-sm font-bold text-indigo-600">{score}/300</span>
          </div>
          <input type="range" min={0} max={300} step={1} value={score} onChange={(e) => setScore(+e.target.value)} className="w-full" />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>0</span><span>300</span>
          </div>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700">Or enter score:</label>
          <input type="number" className="calc-input" value={score} onChange={(e) => setScore(+e.target.value)} min={0} max={300} />
        </div>
      </div>

      {result && (
        <div className="result-card space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Estimated Percentile</div>
              <div className="text-2xl font-extrabold text-indigo-600">{result.percentile}%</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Estimated Rank Range</div>
              <div className="text-2xl font-extrabold text-emerald-600">{result.rankRange}</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Score Percentage</div>
              <div className="text-2xl font-extrabold text-gray-800">{result.pct.toFixed(1)}%</div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4">
            <div className="text-sm font-semibold text-gray-700 mb-1">Expected College Tier</div>
            <div className="text-lg font-bold text-indigo-700">{result.category}</div>
          </div>
        </div>
      )}

      {/* IIT Cutoffs */}
      <div className="result-card space-y-3">
        <h3 className="text-lg font-bold text-gray-800">IIT Closing Rank Reference (Approx.)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-2 text-gray-500">College</th>
                <th className="text-center py-2 px-2 text-gray-500">General</th>
                <th className="text-center py-2 px-2 text-gray-500">OBC</th>
                <th className="text-center py-2 px-2 text-gray-500">SC</th>
                <th className="text-center py-2 px-2 text-gray-500">ST</th>
              </tr>
            </thead>
            <tbody>
              {iitCutoffs.map((c) => (
                <tr key={c.college} className="border-b border-gray-100">
                  <td className="py-2 px-2 font-medium">{c.college}</td>
                  <td className="text-center py-2 px-2">{c.general}</td>
                  <td className="text-center py-2 px-2">{c.obc}</td>
                  <td className="text-center py-2 px-2">{c.sc}</td>
                  <td className="text-center py-2 px-2">{c.st}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* NIT/IIIT Cutoffs */}
      <div className="result-card space-y-3">
        <h3 className="text-lg font-bold text-gray-800">NIT / IIIT Closing Rank Reference (Approx.)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-2 text-gray-500">College</th>
                <th className="text-center py-2 px-2 text-gray-500">General</th>
                <th className="text-center py-2 px-2 text-gray-500">OBC</th>
                <th className="text-center py-2 px-2 text-gray-500">SC</th>
                <th className="text-center py-2 px-2 text-gray-500">ST</th>
              </tr>
            </thead>
            <tbody>
              {nitCutoffs.map((c) => (
                <tr key={c.college} className="border-b border-gray-100">
                  <td className="py-2 px-2 font-medium">{c.college}</td>
                  <td className="text-center py-2 px-2">{c.general}</td>
                  <td className="text-center py-2 px-2">{c.obc}</td>
                  <td className="text-center py-2 px-2">{c.sc}</td>
                  <td className="text-center py-2 px-2">{c.st}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 italic">* Ranks are approximate and vary each year. Check JoSAA for official cutoffs.</p>
      </div>
    </div>
  );
}
