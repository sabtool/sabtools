"use client";
import { useState, useMemo } from "react";

interface Subject {
  id: number;
  name: string;
  credits: number;
  grade: string;
}

const gradePoints10: Record<string, number> = {
  "O": 10, "A+": 9, "A": 8, "B+": 7, "B": 6, "C": 5, "P": 4, "F": 0,
};

const gradePoints4: Record<string, number> = {
  "A+": 4.0, "A": 4.0, "A-": 3.7, "B+": 3.3, "B": 3.0, "B-": 2.7,
  "C+": 2.3, "C": 2.0, "C-": 1.7, "D+": 1.3, "D": 1.0, "F": 0,
};

let nextId = 1;

export default function GpaCalculator() {
  const [scale, setScale] = useState<"10" | "4">("10");
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: nextId++, name: "Subject 1", credits: 3, grade: "A+" },
    { id: nextId++, name: "Subject 2", credits: 4, grade: "A" },
    { id: nextId++, name: "Subject 3", credits: 3, grade: "B+" },
  ]);

  const gradeMap = scale === "10" ? gradePoints10 : gradePoints4;

  const addSubject = () => {
    setSubjects([...subjects, { id: nextId++, name: `Subject ${subjects.length + 1}`, credits: 3, grade: "A" }]);
  };

  const removeSubject = (id: number) => {
    if (subjects.length > 1) setSubjects(subjects.filter((s) => s.id !== id));
  };

  const updateSubject = (id: number, field: keyof Subject, value: string | number) => {
    setSubjects(subjects.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const result = useMemo(() => {
    let totalCredits = 0;
    let totalPoints = 0;
    for (const s of subjects) {
      const gp = gradeMap[s.grade] ?? 0;
      totalCredits += s.credits;
      totalPoints += s.credits * gp;
    }
    if (totalCredits === 0) return null;
    const sgpa = totalPoints / totalCredits;
    return { sgpa, totalCredits, totalPoints };
  }, [subjects, gradeMap]);

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Grading Scale</label>
        <div className="flex gap-2">
          <button onClick={() => setScale("10")} className={scale === "10" ? "btn-primary" : "btn-secondary"}>10-Point Scale</button>
          <button onClick={() => setScale("4")} className={scale === "4" ? "btn-primary" : "btn-secondary"}>4-Point Scale</button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-sm font-semibold text-gray-700">Subjects</label>
          <button onClick={addSubject} className="btn-secondary text-sm">+ Add Subject</button>
        </div>

        {subjects.map((s) => (
          <div key={s.id} className="bg-white rounded-xl p-3 shadow-sm flex flex-wrap items-center gap-2">
            <input type="text" value={s.name} onChange={(e) => updateSubject(s.id, "name", e.target.value)} className="calc-input flex-1 min-w-[120px]" placeholder="Subject name" />
            <input type="number" min={1} max={10} value={s.credits} onChange={(e) => updateSubject(s.id, "credits", +e.target.value)} className="calc-input w-20 text-center" placeholder="Credits" />
            <select value={s.grade} onChange={(e) => updateSubject(s.id, "grade", e.target.value)} className="calc-input w-24">
              {Object.keys(gradeMap).map((g) => (
                <option key={g} value={g}>{g} ({gradeMap[g]})</option>
              ))}
            </select>
            {subjects.length > 1 && (
              <button onClick={() => removeSubject(s.id)} className="btn-secondary text-sm text-red-500">X</button>
            )}
          </div>
        ))}
      </div>

      {result && (
        <div className="result-card space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">SGPA / CGPA</div>
              <div className="text-3xl font-extrabold text-indigo-600">{result.sgpa.toFixed(2)}</div>
              <div className="text-xs text-gray-400">out of {scale}</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Total Credits</div>
              <div className="text-2xl font-extrabold text-gray-800">{result.totalCredits}</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Total Grade Points</div>
              <div className="text-2xl font-extrabold text-gray-800">{result.totalPoints.toFixed(1)}</div>
            </div>
          </div>

          {scale === "10" && (
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Equivalent Percentage (CGPA x 9.5)</div>
              <div className="text-xl font-bold text-green-600">{(result.sgpa * 9.5).toFixed(1)}%</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
