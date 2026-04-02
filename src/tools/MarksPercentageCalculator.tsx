"use client";
import { useState, useMemo } from "react";

interface Subject {
  id: number;
  name: string;
  obtained: number;
  total: number;
}

export default function MarksPercentageCalculator() {
  const [mode, setMode] = useState<"simple" | "multi">("simple");
  const [obtained, setObtained] = useState(425);
  const [total, setTotal] = useState(500);
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: 1, name: "Mathematics", obtained: 85, total: 100 },
    { id: 2, name: "Science", obtained: 78, total: 100 },
    { id: 3, name: "English", obtained: 72, total: 100 },
    { id: 4, name: "Hindi", obtained: 68, total: 100 },
    { id: 5, name: "Social Science", obtained: 80, total: 100 },
  ]);

  const simpleResult = useMemo(() => {
    if (total <= 0) return null;
    const pct = (obtained / total) * 100;
    return { percentage: pct, grade: getGrade(pct) };
  }, [obtained, total]);

  const multiResult = useMemo(() => {
    if (subjects.length === 0) return null;
    const results = subjects.map((s) => {
      const pct = s.total > 0 ? (s.obtained / s.total) * 100 : 0;
      return { ...s, percentage: pct, grade: getGrade(pct), passed: pct >= 33 };
    });
    const totalObtained = subjects.reduce((a, s) => a + s.obtained, 0);
    const totalMax = subjects.reduce((a, s) => a + s.total, 0);
    const overallPct = totalMax > 0 ? (totalObtained / totalMax) * 100 : 0;
    return { results, overallPct, overallGrade: getGrade(overallPct), totalObtained, totalMax };
  }, [subjects]);

  function getGrade(pct: number): string {
    if (pct >= 90) return "A+";
    if (pct >= 80) return "A";
    if (pct >= 70) return "B+";
    if (pct >= 60) return "B";
    if (pct >= 50) return "C";
    if (pct >= 40) return "D";
    if (pct >= 33) return "E";
    return "F (Fail)";
  }

  function addSubject() {
    setSubjects([...subjects, { id: Date.now(), name: "", obtained: 0, total: 100 }]);
  }

  function removeSubject(id: number) {
    setSubjects(subjects.filter((s) => s.id !== id));
  }

  function updateSubject(id: number, field: keyof Subject, value: string | number) {
    setSubjects(subjects.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  }

  return (
    <div className="space-y-8">
      {/* Mode Toggle */}
      <div className="flex gap-2">
        <button onClick={() => setMode("simple")} className={mode === "simple" ? "btn-primary" : "btn-secondary"}>
          Simple Mode
        </button>
        <button onClick={() => setMode("multi")} className={mode === "multi" ? "btn-primary" : "btn-secondary"}>
          Multi-Subject Mode
        </button>
      </div>

      {mode === "simple" ? (
        <>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-700">Marks Obtained</label>
              <input type="number" className="calc-input" value={obtained} onChange={(e) => setObtained(+e.target.value)} min={0} />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">Total Marks</label>
              <input type="number" className="calc-input" value={total} onChange={(e) => setTotal(+e.target.value)} min={1} />
            </div>
          </div>
          {simpleResult && (
            <div className="result-card space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                  <div className="text-xs font-medium text-gray-500 mb-1">Percentage</div>
                  <div className="text-3xl font-extrabold text-indigo-600">{simpleResult.percentage.toFixed(2)}%</div>
                </div>
                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                  <div className="text-xs font-medium text-gray-500 mb-1">Grade</div>
                  <div className="text-3xl font-extrabold text-emerald-600">{simpleResult.grade}</div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div className="h-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all" style={{ width: `${Math.min(simpleResult.percentage, 100)}%` }} />
              </div>
              <p className="text-center text-sm text-gray-500">
                {simpleResult.percentage >= 33 ? "Status: PASS" : "Status: FAIL (below 33%)"}
              </p>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="space-y-3">
            {subjects.map((s, i) => (
              <div key={s.id} className="grid grid-cols-12 gap-2 items-end">
                <div className="col-span-4">
                  {i === 0 && <label className="text-xs font-semibold text-gray-500">Subject</label>}
                  <input type="text" className="calc-input" placeholder="Subject name" value={s.name} onChange={(e) => updateSubject(s.id, "name", e.target.value)} />
                </div>
                <div className="col-span-3">
                  {i === 0 && <label className="text-xs font-semibold text-gray-500">Obtained</label>}
                  <input type="number" className="calc-input" value={s.obtained} onChange={(e) => updateSubject(s.id, "obtained", +e.target.value)} min={0} />
                </div>
                <div className="col-span-3">
                  {i === 0 && <label className="text-xs font-semibold text-gray-500">Total</label>}
                  <input type="number" className="calc-input" value={s.total} onChange={(e) => updateSubject(s.id, "total", +e.target.value)} min={1} />
                </div>
                <div className="col-span-2 flex justify-center">
                  <button onClick={() => removeSubject(s.id)} className="btn-secondary text-red-500 text-sm px-2 py-1">Remove</button>
                </div>
              </div>
            ))}
            <button onClick={addSubject} className="btn-secondary text-sm">+ Add Subject</button>
          </div>

          {multiResult && (
            <div className="result-card space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                  <div className="text-xs font-medium text-gray-500 mb-1">Overall Percentage</div>
                  <div className="text-2xl font-extrabold text-indigo-600">{multiResult.overallPct.toFixed(2)}%</div>
                </div>
                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                  <div className="text-xs font-medium text-gray-500 mb-1">Grade</div>
                  <div className="text-2xl font-extrabold text-emerald-600">{multiResult.overallGrade}</div>
                </div>
                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                  <div className="text-xs font-medium text-gray-500 mb-1">Total Marks</div>
                  <div className="text-2xl font-extrabold text-gray-800">{multiResult.totalObtained}/{multiResult.totalMax}</div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-2 text-gray-500">Subject</th>
                      <th className="text-center py-2 px-2 text-gray-500">Marks</th>
                      <th className="text-center py-2 px-2 text-gray-500">Percentage</th>
                      <th className="text-center py-2 px-2 text-gray-500">Grade</th>
                      <th className="text-center py-2 px-2 text-gray-500">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {multiResult.results.map((r) => (
                      <tr key={r.id} className="border-b border-gray-100">
                        <td className="py-2 px-2 font-medium">{r.name || "—"}</td>
                        <td className="text-center py-2 px-2">{r.obtained}/{r.total}</td>
                        <td className="text-center py-2 px-2 font-semibold text-indigo-600">{r.percentage.toFixed(1)}%</td>
                        <td className="text-center py-2 px-2">{r.grade}</td>
                        <td className="text-center py-2 px-2">
                          <span className={`px-2 py-0.5 rounded text-xs font-bold ${r.passed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                            {r.passed ? "PASS" : "FAIL"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
