"use client";
import { useState, useMemo } from "react";

interface Subject {
  id: number;
  name: string;
  marks: number;
  total: number;
}

let nextId = 1;

function getGrade(pct: number): { grade: string; color: string } {
  if (pct >= 90) return { grade: "A+", color: "text-green-600" };
  if (pct >= 80) return { grade: "A", color: "text-green-500" };
  if (pct >= 70) return { grade: "B+", color: "text-blue-600" };
  if (pct >= 60) return { grade: "B", color: "text-blue-500" };
  if (pct >= 50) return { grade: "C+", color: "text-yellow-600" };
  if (pct >= 40) return { grade: "C", color: "text-yellow-500" };
  if (pct >= 33) return { grade: "D", color: "text-orange-500" };
  return { grade: "F", color: "text-red-600" };
}

export default function GradeCalculator() {
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: nextId++, name: "Mathematics", marks: 85, total: 100 },
    { id: nextId++, name: "Science", marks: 72, total: 100 },
    { id: nextId++, name: "English", marks: 90, total: 100 },
  ]);

  const addSubject = () => {
    setSubjects([...subjects, { id: nextId++, name: `Subject ${subjects.length + 1}`, marks: 0, total: 100 }]);
  };

  const removeSubject = (id: number) => {
    if (subjects.length > 1) setSubjects(subjects.filter((s) => s.id !== id));
  };

  const updateSubject = (id: number, field: keyof Subject, value: string | number) => {
    setSubjects(subjects.map((s) => (s.id === id ? { ...s, [field]: field === "name" ? value : Number(value) } : s)));
  };

  const result = useMemo(() => {
    let totalMarks = 0;
    let totalMax = 0;
    const subResults = subjects.map((s) => {
      const pct = s.total > 0 ? (s.marks / s.total) * 100 : 0;
      totalMarks += s.marks;
      totalMax += s.total;
      return { ...s, percentage: pct, ...getGrade(pct), passed: pct >= 33 };
    });
    const overallPct = totalMax > 0 ? (totalMarks / totalMax) * 100 : 0;
    const overallGrade = getGrade(overallPct);
    const allPassed = subResults.every((s) => s.passed);
    return { subjects: subResults, overallPct, overallGrade, totalMarks, totalMax, allPassed };
  }, [subjects]);

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-sm font-semibold text-gray-700">Subjects</label>
          <button onClick={addSubject} className="btn-secondary text-sm">+ Add Subject</button>
        </div>

        {subjects.map((s) => (
          <div key={s.id} className="bg-white rounded-xl p-3 shadow-sm flex flex-wrap items-center gap-2">
            <input type="text" value={s.name} onChange={(e) => updateSubject(s.id, "name", e.target.value)} className="calc-input flex-1 min-w-[120px]" placeholder="Subject" />
            <input type="number" min={0} value={s.marks} onChange={(e) => updateSubject(s.id, "marks", e.target.value)} className="calc-input w-20 text-center" placeholder="Marks" />
            <span className="text-gray-500 text-sm">/</span>
            <input type="number" min={1} value={s.total} onChange={(e) => updateSubject(s.id, "total", e.target.value)} className="calc-input w-20 text-center" placeholder="Total" />
            {subjects.length > 1 && (
              <button onClick={() => removeSubject(s.id)} className="btn-secondary text-sm text-red-500">X</button>
            )}
          </div>
        ))}
      </div>

      <div className="result-card space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-xs font-medium text-gray-500 mb-1">Overall Percentage</div>
            <div className="text-3xl font-extrabold text-indigo-600">{result.overallPct.toFixed(1)}%</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-xs font-medium text-gray-500 mb-1">Overall Grade</div>
            <div className={`text-3xl font-extrabold ${result.overallGrade.color}`}>{result.overallGrade.grade}</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-xs font-medium text-gray-500 mb-1">Status</div>
            <div className={`text-2xl font-extrabold ${result.allPassed ? "text-green-600" : "text-red-600"}`}>
              {result.allPassed ? "PASS" : "FAIL"}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-600">Subject-wise Results</h4>
          {result.subjects.map((s) => (
            <div key={s.id} className="bg-white rounded-xl p-3 shadow-sm flex justify-between items-center">
              <span className="text-sm text-gray-700">{s.name}</span>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">{s.percentage.toFixed(1)}%</span>
                <span className={`text-sm font-bold ${s.color}`}>{s.grade}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${s.passed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {s.passed ? "Pass" : "Fail"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
