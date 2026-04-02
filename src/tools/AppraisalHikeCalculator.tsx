"use client";
import { useState, useMemo } from "react";

const QUICK_HIKES = [10, 15, 20, 25, 30, 50];
const INDUSTRY_AVG: Record<string, number> = {
  "IT / Software": 12, "Banking / Finance": 10, "Healthcare": 9, "Manufacturing": 8,
  "E-Commerce": 14, "Consulting": 13, "Education": 7, "Pharma": 10,
  "Telecom": 9, "Automobile": 8, "FMCG": 11, "Media": 8,
};

export default function AppraisalHikeCalculator() {
  const [mode, setMode] = useState<"forward" | "reverse">("forward");
  const [currentCTC, setCurrentCTC] = useState("");
  const [hikePercent, setHikePercent] = useState("");
  const [newCTCInput, setNewCTCInput] = useState("");
  const [industry, setIndustry] = useState("IT / Software");

  const result = useMemo(() => {
    if (mode === "forward") {
      const ctc = parseFloat(currentCTC);
      const hike = parseFloat(hikePercent);
      if (!ctc || ctc <= 0 || !hike) return null;
      const increment = (ctc * hike) / 100;
      const newCTC = ctc + increment;
      const newMonthly = newCTC / 12;
      const oldMonthly = ctc / 12;
      const industryAvg = INDUSTRY_AVG[industry] || 10;
      return { ctc, hike, increment, newCTC, newMonthly, oldMonthly, industryAvg, mode: "forward" as const };
    } else {
      const ctc = parseFloat(currentCTC);
      const newCtc = parseFloat(newCTCInput);
      if (!ctc || ctc <= 0 || !newCtc || newCtc <= 0) return null;
      const increment = newCtc - ctc;
      const hike = (increment / ctc) * 100;
      const newMonthly = newCtc / 12;
      const oldMonthly = ctc / 12;
      const industryAvg = INDUSTRY_AVG[industry] || 10;
      return { ctc, hike, increment, newCTC: newCtc, newMonthly, oldMonthly, industryAvg, mode: "reverse" as const };
    }
  }, [mode, currentCTC, hikePercent, newCTCInput, industry]);

  const fmt = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="space-y-6">
      {/* Mode selector */}
      <div className="flex gap-2">
        <button onClick={() => setMode("forward")} className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${mode === "forward" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"}`}>
          Calculate New CTC
        </button>
        <button onClick={() => setMode("reverse")} className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${mode === "reverse" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"}`}>
          Calculate Hike %
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Current CTC (Annual, ₹)</label>
          <input type="number" placeholder="e.g. 800000" value={currentCTC} onChange={e => setCurrentCTC(e.target.value)} className="calc-input" />
        </div>
        {mode === "forward" ? (
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">Hike Percentage (%)</label>
            <input type="number" placeholder="e.g. 20" value={hikePercent} onChange={e => setHikePercent(e.target.value)} className="calc-input" />
            <div className="flex flex-wrap gap-2 mt-2">
              {QUICK_HIKES.map(h => (
                <button key={h} onClick={() => setHikePercent(String(h))}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${hikePercent === String(h) ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"}`}>{h}%</button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">New CTC (Annual, ₹)</label>
            <input type="number" placeholder="e.g. 1000000" value={newCTCInput} onChange={e => setNewCTCInput(e.target.value)} className="calc-input" />
          </div>
        )}
      </div>

      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Industry (for comparison)</label>
        <select value={industry} onChange={e => setIndustry(e.target.value)} className="calc-input">
          {Object.keys(INDUSTRY_AVG).map(i => <option key={i} value={i}>{i}</option>)}
        </select>
      </div>

      {result && (
        <div className="space-y-4">
          {/* Main results */}
          <div className="result-card grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Hike %</div>
              <div className="text-2xl font-extrabold text-green-600">{result.hike.toFixed(1)}%</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Increment Amount</div>
              <div className="text-xl font-bold text-emerald-600">{fmt(result.increment)}</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">New Annual CTC</div>
              <div className="text-xl font-bold text-indigo-600">{fmt(result.newCTC)}</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">New Monthly (CTC/12)</div>
              <div className="text-xl font-bold text-indigo-600">{fmt(result.newMonthly)}</div>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="result-card">
            <h3 className="font-bold text-gray-800 mb-3">Before vs After</h3>
            <div className="table-responsive">
              <table>
                <thead><tr><th></th><th className="text-right">Before</th><th className="text-right">After</th><th className="text-right">Difference</th></tr></thead>
                <tbody>
                  <tr><td>Annual CTC</td><td className="text-right">{fmt(result.ctc)}</td><td className="text-right text-indigo-600 font-semibold">{fmt(result.newCTC)}</td><td className="text-right text-green-600">+{fmt(result.increment)}</td></tr>
                  <tr><td>Monthly CTC</td><td className="text-right">{fmt(result.ctc / 12)}</td><td className="text-right text-indigo-600 font-semibold">{fmt(result.newMonthly)}</td><td className="text-right text-green-600">+{fmt(result.newMonthly - result.ctc / 12)}</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Industry Comparison */}
          <div className="result-card">
            <h3 className="font-bold text-gray-800 mb-3">Industry Average Hike Comparison</h3>
            <div className="space-y-2">
              {Object.entries(INDUSTRY_AVG).map(([ind, avg]) => (
                <div key={ind} className="flex items-center gap-3">
                  <div className="w-32 text-xs text-gray-600 truncate">{ind}</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                    <div className={`h-4 rounded-full ${ind === industry ? "bg-indigo-600" : "bg-gray-400"}`} style={{ width: `${Math.min(100, (avg / 50) * 100)}%` }}></div>
                  </div>
                  <div className={`text-xs font-semibold w-10 text-right ${ind === industry ? "text-indigo-600" : "text-gray-500"}`}>{avg}%</div>
                </div>
              ))}
              <div className="flex items-center gap-3 mt-2 pt-2 border-t">
                <div className="w-32 text-xs text-green-700 font-bold">Your Hike</div>
                <div className="flex-1 bg-gray-200 rounded-full h-4">
                  <div className="h-4 rounded-full bg-green-500" style={{ width: `${Math.min(100, (result.hike / 50) * 100)}%` }}></div>
                </div>
                <div className="text-xs font-bold text-green-600 w-10 text-right">{result.hike.toFixed(1)}%</div>
              </div>
            </div>
            <div className="mt-3 text-sm">
              {result.hike > result.industryAvg
                ? <span className="text-green-600 font-medium">Your hike is {(result.hike - result.industryAvg).toFixed(1)}% above the {industry} industry average!</span>
                : result.hike < result.industryAvg
                  ? <span className="text-red-600 font-medium">Your hike is {(result.industryAvg - result.hike).toFixed(1)}% below the {industry} industry average.</span>
                  : <span className="text-gray-600 font-medium">Your hike matches the {industry} industry average.</span>
              }
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
