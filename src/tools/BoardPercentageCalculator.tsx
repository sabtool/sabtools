"use client";
import { useState, useMemo } from "react";

interface Subject {
  id: number;
  name: string;
  obtained: number;
  maxMarks: number;
}

export default function BoardPercentageCalculator() {
  const [board, setBoard] = useState<"CBSE" | "ICSE" | "State">("CBSE");
  const [classLevel, setClassLevel] = useState<"10" | "12">("12");
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: 1, name: "English", obtained: 85, maxMarks: 100 },
    { id: 2, name: "Mathematics", obtained: 92, maxMarks: 100 },
    { id: 3, name: "Physics", obtained: 78, maxMarks: 100 },
    { id: 4, name: "Chemistry", obtained: 81, maxMarks: 100 },
    { id: 5, name: "Computer Science", obtained: 95, maxMarks: 100 },
  ]);

  const result = useMemo(() => {
    if (subjects.length === 0) return null;

    const subResults = subjects.map((s) => {
      const pct = s.maxMarks > 0 ? (s.obtained / s.maxMarks) * 100 : 0;
      const passed = board === "ICSE" ? pct >= 35 : pct >= 33;
      let grade = "";
      if (board === "CBSE") {
        if (pct >= 91) grade = "A1";
        else if (pct >= 81) grade = "A2";
        else if (pct >= 71) grade = "B1";
        else if (pct >= 61) grade = "B2";
        else if (pct >= 51) grade = "C1";
        else if (pct >= 41) grade = "C2";
        else if (pct >= 33) grade = "D";
        else grade = "E (Fail)";
      } else {
        if (pct >= 90) grade = "A+";
        else if (pct >= 80) grade = "A";
        else if (pct >= 70) grade = "B+";
        else if (pct >= 60) grade = "B";
        else if (pct >= 50) grade = "C";
        else if (pct >= 40) grade = "D";
        else if (pct >= 33) grade = "E";
        else grade = "F (Fail)";
      }
      return { ...s, pct, passed, grade };
    });

    const totalObtained = subjects.reduce((a, s) => a + s.obtained, 0);
    const totalMax = subjects.reduce((a, s) => a + s.maxMarks, 0);
    const overallPct = totalMax > 0 ? (totalObtained / totalMax) * 100 : 0;

    // Best of 5
    const sortedByPct = [...subResults].sort((a, b) => b.pct - a.pct);
    const bestFive = sortedByPct.slice(0, 5);
    const bestFiveObtained = bestFive.reduce((a, s) => a + s.obtained, 0);
    const bestFiveMax = bestFive.reduce((a, s) => a + s.maxMarks, 0);
    const bestFivePct = bestFiveMax > 0 ? (bestFiveObtained / bestFiveMax) * 100 : 0;

    // CGPA for CBSE (percentage / 9.5)
    const cgpa = board === "CBSE" ? overallPct / 9.5 : null;

    const allPassed = subResults.every((s) => s.passed);

    return { subResults, overallPct, bestFivePct, cgpa, totalObtained, totalMax, allPassed };
  }, [subjects, board]);

  function addSubject() {
    setSubjects([...subjects, { id: Date.now(), name: "", obtained: 0, maxMarks: 100 }]);
  }

  function removeSubject(id: number) {
    setSubjects(subjects.filter((s) => s.id !== id));
  }

  function updateSubject(id: number, field: keyof Subject, value: string | number) {
    setSubjects(subjects.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-700">Board</label>
            <select className="calc-input" value={board} onChange={(e) => setBoard(e.target.value as typeof board)}>
              <option value="CBSE">CBSE</option>
              <option value="ICSE">ICSE</option>
              <option value="State">State Board</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700">Class</label>
            <select className="calc-input" value={classLevel} onChange={(e) => setClassLevel(e.target.value as typeof classLevel)}>
              <option value="10">10th</option>
              <option value="12">12th</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          {subjects.map((s, i) => (
            <div key={s.id} className="grid grid-cols-12 gap-2 items-end">
              <div className="col-span-4">
                {i === 0 && <label className="text-xs font-semibold text-gray-500">Subject</label>}
                <input type="text" className="calc-input" placeholder="Subject" value={s.name} onChange={(e) => updateSubject(s.id, "name", e.target.value)} />
              </div>
              <div className="col-span-3">
                {i === 0 && <label className="text-xs font-semibold text-gray-500">Obtained</label>}
                <input type="number" className="calc-input" value={s.obtained} onChange={(e) => updateSubject(s.id, "obtained", +e.target.value)} min={0} />
              </div>
              <div className="col-span-3">
                {i === 0 && <label className="text-xs font-semibold text-gray-500">Max Marks</label>}
                <input type="number" className="calc-input" value={s.maxMarks} onChange={(e) => updateSubject(s.id, "maxMarks", +e.target.value)} min={1} />
              </div>
              <div className="col-span-2 flex justify-center">
                <button onClick={() => removeSubject(s.id)} className="btn-secondary text-red-500 text-sm px-2 py-1">Remove</button>
              </div>
            </div>
          ))}
          <button onClick={addSubject} className="btn-secondary text-sm">+ Add Subject</button>
        </div>
      </div>

      {result && (
        <div className="result-card space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Overall %</div>
              <div className="text-2xl font-extrabold text-indigo-600">{result.overallPct.toFixed(2)}%</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Best of 5 %</div>
              <div className="text-2xl font-extrabold text-blue-600">{result.bestFivePct.toFixed(2)}%</div>
            </div>
            {result.cgpa !== null && (
              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <div className="text-xs font-medium text-gray-500 mb-1">CGPA</div>
                <div className="text-2xl font-extrabold text-purple-600">{result.cgpa.toFixed(1)}</div>
              </div>
            )}
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Status</div>
              <div className={`text-2xl font-extrabold ${result.allPassed ? "text-emerald-600" : "text-red-500"}`}>
                {result.allPassed ? "PASS" : "FAIL"}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-2 text-gray-500">Subject</th>
                  <th className="text-center py-2 px-2 text-gray-500">Marks</th>
                  <th className="text-center py-2 px-2 text-gray-500">%</th>
                  <th className="text-center py-2 px-2 text-gray-500">Grade</th>
                  <th className="text-center py-2 px-2 text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {result.subResults.map((r) => (
                  <tr key={r.id} className="border-b border-gray-100">
                    <td className="py-2 px-2 font-medium">{r.name || "—"}</td>
                    <td className="text-center py-2 px-2">{r.obtained}/{r.maxMarks}</td>
                    <td className="text-center py-2 px-2 font-semibold text-indigo-600">{r.pct.toFixed(1)}%</td>
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
          <p className="text-xs text-gray-400">
            {board === "CBSE" && "CBSE grading: A1 (91-100), A2 (81-90), B1 (71-80), B2 (61-70), C1 (51-60), C2 (41-50), D (33-40), E (below 33). CGPA = Percentage / 9.5"}
            {board === "ICSE" && "ICSE passing marks: 35% per subject and 35% overall."}
            {board === "State" && "State Board passing marks: typically 33% per subject."}
          </p>
        </div>
      )}
    </div>
  );
}
