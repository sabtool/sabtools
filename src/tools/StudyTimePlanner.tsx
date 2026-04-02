"use client";
import { useState, useMemo } from "react";

interface Subject {
  id: number;
  name: string;
  hoursNeeded: number;
}

let nextId = 1;

export default function StudyTimePlanner() {
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: nextId++, name: "Mathematics", hoursNeeded: 10 },
    { id: nextId++, name: "Physics", hoursNeeded: 8 },
    { id: nextId++, name: "Chemistry", hoursNeeded: 6 },
  ]);
  const [hoursPerDay, setHoursPerDay] = useState(6);

  const addSubject = () => {
    setSubjects([...subjects, { id: nextId++, name: `Subject ${subjects.length + 1}`, hoursNeeded: 4 }]);
  };

  const removeSubject = (id: number) => {
    if (subjects.length > 1) setSubjects(subjects.filter((s) => s.id !== id));
  };

  const updateSubject = (id: number, field: keyof Subject, value: string | number) => {
    setSubjects(subjects.map((s) => (s.id === id ? { ...s, [field]: field === "name" ? value : Number(value) } : s)));
  };

  const schedule = useMemo(() => {
    const totalHours = subjects.reduce((sum, s) => sum + s.hoursNeeded, 0);
    if (totalHours === 0 || hoursPerDay <= 0) return null;
    const totalDays = Math.ceil(totalHours / hoursPerDay);

    const dailySchedule: { day: number; slots: { name: string; hours: number }[] }[] = [];
    const remaining = subjects.map((s) => ({ name: s.name, left: s.hoursNeeded }));

    let day = 1;
    while (remaining.some((r) => r.left > 0)) {
      let dayHours = hoursPerDay;
      const slots: { name: string; hours: number }[] = [];

      for (const sub of remaining) {
        if (dayHours <= 0) break;
        if (sub.left <= 0) continue;
        const alloc = Math.min(sub.left, dayHours, Math.max(1, Math.round(hoursPerDay / Math.max(subjects.length, 1))));
        slots.push({ name: sub.name, hours: alloc });
        sub.left -= alloc;
        dayHours -= alloc;
      }

      if (slots.length > 0) {
        dailySchedule.push({ day, slots });
      }
      day++;
      if (day > 100) break;
    }

    return { totalHours, totalDays, dailySchedule };
  }, [subjects, hoursPerDay]);

  const colors = ["bg-indigo-100 text-indigo-700", "bg-green-100 text-green-700", "bg-orange-100 text-orange-700", "bg-pink-100 text-pink-700", "bg-cyan-100 text-cyan-700", "bg-yellow-100 text-yellow-700", "bg-purple-100 text-purple-700"];

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-sm font-semibold text-gray-700">Subjects & Hours Needed</label>
          <button onClick={addSubject} className="btn-secondary text-sm">+ Add Subject</button>
        </div>

        {subjects.map((s) => (
          <div key={s.id} className="bg-white rounded-xl p-3 shadow-sm flex flex-wrap items-center gap-2">
            <input type="text" value={s.name} onChange={(e) => updateSubject(s.id, "name", e.target.value)} className="calc-input flex-1 min-w-[120px]" placeholder="Subject" />
            <input type="number" min={1} max={100} value={s.hoursNeeded} onChange={(e) => updateSubject(s.id, "hoursNeeded", e.target.value)} className="calc-input w-24 text-center" />
            <span className="text-xs text-gray-500">hrs</span>
            {subjects.length > 1 && (
              <button onClick={() => removeSubject(s.id)} className="btn-secondary text-sm text-red-500">X</button>
            )}
          </div>
        ))}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Available Hours Per Day</label>
        <input type="number" min={1} max={24} value={hoursPerDay} onChange={(e) => setHoursPerDay(+e.target.value)} className="calc-input" />
      </div>

      {schedule && (
        <div className="result-card space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Total Hours</div>
              <div className="text-2xl font-extrabold text-indigo-600">{schedule.totalHours}h</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Total Days Needed</div>
              <div className="text-2xl font-extrabold text-gray-800">{schedule.totalDays}</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Hours Per Day</div>
              <div className="text-2xl font-extrabold text-gray-800">{hoursPerDay}h</div>
            </div>
          </div>

          <h4 className="text-sm font-semibold text-gray-600">Study Timetable</h4>
          <div className="space-y-2">
            {schedule.dailySchedule.map((d) => (
              <div key={d.day} className="bg-white rounded-xl p-3 shadow-sm">
                <div className="text-sm font-bold text-gray-700 mb-2">Day {d.day}</div>
                <div className="flex flex-wrap gap-2">
                  {d.slots.map((slot, i) => (
                    <span key={i} className={`px-3 py-1 rounded-full text-sm font-medium ${colors[subjects.findIndex((s) => s.name === slot.name) % colors.length]}`}>
                      {slot.name} - {slot.hours}h
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
