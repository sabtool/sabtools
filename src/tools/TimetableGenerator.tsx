"use client";
import { useState, useMemo, useRef, useCallback } from "react";

type Template = "school" | "college" | "custom";

const DEFAULT_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const SCHOOL_SLOTS = ["8:00 AM", "8:45 AM", "9:30 AM", "10:15 AM", "11:00 AM", "11:45 AM", "12:30 PM", "1:15 PM", "2:00 PM"];
const COLLEGE_SLOTS = ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"];

const SUBJECT_COLORS: Record<string, string> = {};
const PALETTE = [
  "#dbeafe", "#dcfce7", "#fef3c7", "#fce7f3", "#e0e7ff", "#ccfbf1",
  "#fde68a", "#fbcfe8", "#c7d2fe", "#a7f3d0", "#fed7aa", "#d9f99d",
];

function getSubjectColor(subject: string): string {
  const key = subject.toLowerCase().trim();
  if (!key) return "#f3f4f6";
  if (!SUBJECT_COLORS[key]) {
    SUBJECT_COLORS[key] = PALETTE[Object.keys(SUBJECT_COLORS).length % PALETTE.length];
  }
  return SUBJECT_COLORS[key];
}

export default function TimetableGenerator() {
  const [template, setTemplate] = useState<Template>("school");
  const [days, setDays] = useState<string[]>(DEFAULT_DAYS);
  const [slots, setSlots] = useState<string[]>(SCHOOL_SLOTS);
  const [grid, setGrid] = useState<Record<string, string>>({});
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const tableRef = useRef<HTMLDivElement>(null);

  const applyTemplate = (t: Template) => {
    setTemplate(t);
    if (t === "school") { setDays(DEFAULT_DAYS); setSlots(SCHOOL_SLOTS); }
    else if (t === "college") { setDays(DEFAULT_DAYS.slice(0, 5)); setSlots(COLLEGE_SLOTS); }
    setGrid({});
  };

  const cellKey = (day: string, slot: string) => `${day}|${slot}`;

  const startEdit = (key: string) => {
    setEditingCell(key);
    setEditValue(grid[key] || "");
  };

  const saveEdit = () => {
    if (editingCell) {
      setGrid((prev) => ({ ...prev, [editingCell]: editValue }));
      setEditingCell(null);
    }
  };

  const handleDownload = () => {
    const el = tableRef.current;
    if (!el) return;
    const canvas = document.createElement("canvas");
    const rect = el.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(2, 2);
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Simple text rendering of the table
    const cellW = rect.width / (slots.length + 1);
    const cellH = 36;
    ctx.font = "bold 11px sans-serif";
    ctx.fillStyle = "#4f46e5";

    // Header row
    days.forEach((day, i) => {
      ctx.fillText(day, 4, (i + 1) * cellH + cellH / 2 + 4);
    });
    slots.forEach((slot, j) => {
      ctx.fillStyle = "#374151";
      ctx.font = "bold 9px sans-serif";
      ctx.fillText(slot, (j + 1) * cellW + 4, cellH / 2 + 4);
    });

    days.forEach((day, i) => {
      slots.forEach((slot, j) => {
        const val = grid[cellKey(day, slot)] || "";
        if (val) {
          ctx.fillStyle = getSubjectColor(val);
          ctx.fillRect((j + 1) * cellW, (i + 1) * cellH, cellW, cellH);
          ctx.fillStyle = "#1f2937";
          ctx.font = "10px sans-serif";
          ctx.fillText(val, (j + 1) * cellW + 4, (i + 1) * cellH + cellH / 2 + 4);
        }
      });
    });

    const link = document.createElement("a");
    link.download = "timetable.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const uniqueSubjects = useMemo(() => {
    const set = new Set(Object.values(grid).filter(Boolean).map((v) => v.toLowerCase().trim()));
    return [...set];
  }, [grid]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">Template</label>
          <select className="calc-input" value={template} onChange={(e) => applyTemplate(e.target.value as Template)}>
            <option value="school">School (8AM-3PM, Mon-Sat)</option>
            <option value="college">College (9AM-4PM, Mon-Fri)</option>
            <option value="custom">Custom</option>
          </select>
        </div>
      </div>

      {/* Color Legend */}
      {uniqueSubjects.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {uniqueSubjects.map((s) => (
            <span key={s} className="px-2 py-1 rounded text-xs font-medium" style={{ backgroundColor: getSubjectColor(s) }}>
              {s}
            </span>
          ))}
        </div>
      )}

      {/* Timetable */}
      <div className="result-card overflow-x-auto" ref={tableRef}>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <th className="border border-gray-200 bg-indigo-50 p-2 text-left text-indigo-700">Day/Time</th>
              {slots.map((s) => (
                <th key={s} className="border border-gray-200 bg-indigo-50 p-2 text-center text-xs text-indigo-700 whitespace-nowrap">{s}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {days.map((day) => (
              <tr key={day}>
                <td className="border border-gray-200 bg-gray-50 p-2 font-bold text-gray-700">{day}</td>
                {slots.map((slot) => {
                  const key = cellKey(day, slot);
                  const val = grid[key] || "";
                  return (
                    <td
                      key={key}
                      className="border border-gray-200 p-1 text-center cursor-pointer hover:bg-gray-50 min-w-[80px]"
                      style={{ backgroundColor: val ? getSubjectColor(val) : undefined }}
                      onClick={() => startEdit(key)}
                    >
                      {editingCell === key ? (
                        <input
                          className="w-full text-xs p-1 border rounded text-center"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={saveEdit}
                          onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                          autoFocus
                        />
                      ) : (
                        <span className="text-xs font-medium text-gray-700">{val || "—"}</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-3">
        <button className="btn-primary" onClick={() => window.print()}>🖨️ Print</button>
        <button className="btn-secondary" onClick={handleDownload}>⬇️ Download PNG</button>
      </div>
    </div>
  );
}
