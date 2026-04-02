"use client";
import { useState, useRef, useCallback, useMemo } from "react";

type CalendarStyle = "classic" | "modern" | "colorful";

const INDIAN_HOLIDAYS: Record<string, string> = {
  "1-1": "New Year",
  "1-15": "Pongal",
  "1-26": "Republic Day",
  "3-29": "Holi",
  "4-14": "Ambedkar Jayanti",
  "5-1": "May Day",
  "8-15": "Independence Day",
  "8-26": "Janmashtami",
  "9-5": "Teachers Day",
  "10-2": "Gandhi Jayanti",
  "10-12": "Dussehra",
  "10-31": "Halloween",
  "11-1": "Diwali",
  "11-14": "Children Day",
  "12-25": "Christmas",
};

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const styleConfigs: Record<CalendarStyle, { bg: string; headerBg: string; headerText: string; dayText: string; sundayText: string; gridLine: string; todayBg: string; holidayBg: string; fontFamily: string }> = {
  classic: { bg: "#FFFFFF", headerBg: "#2C3E50", headerText: "#FFFFFF", dayText: "#333333", sundayText: "#E74C3C", gridLine: "#DDDDDD", todayBg: "#3498DB", holidayBg: "#FFF3CD", fontFamily: "Georgia, serif" },
  modern: { bg: "#F8F9FA", headerBg: "#6C63FF", headerText: "#FFFFFF", dayText: "#2D3436", sundayText: "#FF6B6B", gridLine: "#E9ECEF", todayBg: "#6C63FF", holidayBg: "#E8F5E9", fontFamily: "system-ui, sans-serif" },
  colorful: { bg: "#FFF8E1", headerBg: "#FF6F61", headerText: "#FFFFFF", dayText: "#4A4A4A", sundayText: "#FF1744", gridLine: "#FFE0B2", todayBg: "#FF6F61", holidayBg: "#E1F5FE", fontFamily: "Comic Sans MS, cursive, sans-serif" },
};

export default function PhotoCalendarMaker() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());
  const [photo, setPhoto] = useState<HTMLImageElement | null>(null);
  const [style, setStyle] = useState<CalendarStyle>("classic");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const img = new Image();
    img.onload = () => setPhoto(img);
    img.src = URL.createObjectURL(file);
  };

  const getDaysInMonth = (m: number, y: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDay = (m: number, y: number) => new Date(y, m, 1).getDay();

  const drawCalendar = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = 1200, H = 1600;
    canvas.width = W;
    canvas.height = H;

    const cfg = styleConfigs[style];
    const photoH = 700;
    const calendarTop = photoH + 20;

    // Background
    ctx.fillStyle = cfg.bg;
    ctx.fillRect(0, 0, W, H);

    // Photo area
    if (photo) {
      const photoAspect = photo.width / photo.height;
      const areaAspect = W / photoH;
      let sx = 0, sy = 0, sw = photo.width, sh = photo.height;
      if (photoAspect > areaAspect) {
        sw = photo.height * areaAspect;
        sx = (photo.width - sw) / 2;
      } else {
        sh = photo.width / areaAspect;
        sy = (photo.height - sh) / 2;
      }
      ctx.drawImage(photo, sx, sy, sw, sh, 0, 0, W, photoH);
    } else {
      ctx.fillStyle = "#E0E0E0";
      ctx.fillRect(0, 0, W, photoH);
      ctx.fillStyle = "#999";
      ctx.font = "24px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Upload a photo", W / 2, photoH / 2);
    }

    // Header
    ctx.fillStyle = cfg.headerBg;
    ctx.fillRect(0, calendarTop, W, 70);
    ctx.fillStyle = cfg.headerText;
    ctx.font = `bold 36px ${cfg.fontFamily}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`${MONTH_NAMES[month]} ${year}`, W / 2, calendarTop + 35);

    // Day headers
    const cellW = W / 7;
    const dayHeaderY = calendarTop + 80;
    ctx.fillStyle = cfg.headerBg;
    ctx.globalAlpha = 0.1;
    ctx.fillRect(0, dayHeaderY, W, 40);
    ctx.globalAlpha = 1;

    DAY_NAMES.forEach((day, i) => {
      ctx.fillStyle = i === 0 ? cfg.sundayText : cfg.dayText;
      ctx.font = `bold 20px ${cfg.fontFamily}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(day, i * cellW + cellW / 2, dayHeaderY + 20);
    });

    // Calendar grid
    const gridTop = dayHeaderY + 50;
    const totalDays = getDaysInMonth(month, year);
    const firstDay = getFirstDay(month, year);
    const rows = Math.ceil((totalDays + firstDay) / 7);
    const cellH = (H - gridTop - 30) / rows;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < 7; col++) {
        const dayNum = row * 7 + col - firstDay + 1;
        const x = col * cellW;
        const y = gridTop + row * cellH;

        // Grid lines
        ctx.strokeStyle = cfg.gridLine;
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, cellW, cellH);

        if (dayNum < 1 || dayNum > totalDays) continue;

        // Holiday check
        const holidayKey = `${month + 1}-${dayNum}`;
        const holiday = INDIAN_HOLIDAYS[holidayKey];

        if (holiday) {
          ctx.fillStyle = cfg.holidayBg;
          ctx.fillRect(x + 1, y + 1, cellW - 2, cellH - 2);
        }

        // Today highlight
        const isToday = dayNum === now.getDate() && month === now.getMonth() && year === now.getFullYear();
        if (isToday) {
          ctx.fillStyle = cfg.todayBg;
          ctx.beginPath();
          ctx.arc(x + cellW / 2, y + 28, 20, 0, Math.PI * 2);
          ctx.fill();
        }

        // Day number
        const isSunday = col === 0;
        ctx.fillStyle = isToday ? "#FFFFFF" : isSunday ? cfg.sundayText : cfg.dayText;
        ctx.font = `bold 24px ${cfg.fontFamily}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(String(dayNum), x + cellW / 2, y + 28);

        // Holiday name
        if (holiday) {
          ctx.fillStyle = "#FF6B6B";
          ctx.font = `11px ${cfg.fontFamily}`;
          ctx.fillText(holiday, x + cellW / 2, y + cellH - 14);
        }
      }
    }

    // Border
    ctx.strokeStyle = cfg.headerBg;
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, W - 4, H - 4);
  }, [photo, month, year, style, now]);

  useMemo(() => { drawCalendar(); }, [drawCalendar]);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `calendar-${MONTH_NAMES[month]}-${year}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const years = useMemo(() => {
    const arr: number[] = [];
    for (let y = now.getFullYear() - 2; y <= now.getFullYear() + 5; y++) arr.push(y);
    return arr;
  }, [now]);

  return (
    <div className="space-y-6">
      {/* Upload */}
      <div
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition"
      >
        <div className="text-4xl mb-3">📷</div>
        <div className="text-sm font-semibold text-gray-700">{photo ? "Photo loaded! Click to change" : "Click to upload photo"}</div>
        <input ref={inputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
      </div>

      {/* Controls */}
      <div className="result-card">
        <h3 className="text-sm font-bold text-gray-800 mb-3">Calendar Settings</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Month</label>
            <select value={month} onChange={(e) => setMonth(+e.target.value)} className="calc-input w-full">
              {MONTH_NAMES.map((m, i) => <option key={i} value={i}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Year</label>
            <select value={year} onChange={(e) => setYear(+e.target.value)} className="calc-input w-full">
              {years.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Style</label>
            <select value={style} onChange={(e) => setStyle(e.target.value as CalendarStyle)} className="calc-input w-full">
              <option value="classic">Classic</option>
              <option value="modern">Modern</option>
              <option value="colorful">Colorful</option>
            </select>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="result-card">
        <h3 className="text-sm font-bold text-gray-800 mb-3">Preview</h3>
        <div className="flex justify-center overflow-auto">
          <canvas ref={canvasRef} className="border rounded-xl shadow-lg" style={{ maxWidth: "100%", height: "auto" }} />
        </div>
      </div>

      {/* Download */}
      <div className="flex gap-3">
        <button onClick={download} className="btn-primary">
          Download Calendar (PNG)
        </button>
        <button onClick={() => { setMonth((m) => (m === 11 ? 0 : m + 1)); if (month === 11) setYear((y) => y + 1); }} className="btn-secondary">
          Next Month
        </button>
        <button onClick={() => { setMonth((m) => (m === 0 ? 11 : m - 1)); if (month === 0) setYear((y) => y - 1); }} className="btn-secondary">
          Prev Month
        </button>
      </div>
    </div>
  );
}
