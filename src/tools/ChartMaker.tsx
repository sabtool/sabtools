"use client";
import { useState, useRef, useMemo, useCallback, useEffect } from "react";

interface DataRow {
  label: string;
  value: string;
}

const CHART_COLORS = [
  "#6366f1", "#f43f5e", "#10b981", "#f59e0b", "#3b82f6",
  "#8b5cf6", "#ec4899", "#14b8a6", "#ef4444", "#22c55e",
  "#a855f7", "#0ea5e9", "#eab308", "#d946ef", "#06b6d4",
];

type ChartType = "bar" | "horizontal-bar" | "pie" | "doughnut" | "line";

export default function ChartMaker() {
  const [rows, setRows] = useState<DataRow[]>([
    { label: "Jan", value: "40" },
    { label: "Feb", value: "65" },
    { label: "Mar", value: "50" },
    { label: "Apr", value: "80" },
    { label: "May", value: "55" },
  ]);
  const [chartType, setChartType] = useState<ChartType>("bar");
  const [title, setTitle] = useState("My Chart");
  const [showLegend, setShowLegend] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [chartSize, setChartSize] = useState<"small" | "medium" | "large">("medium");
  const [animated, setAnimated] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animProgress = useRef(1);
  const animFrame = useRef<number>(0);

  const sizeMap = { small: { w: 400, h: 300 }, medium: { w: 600, h: 400 }, large: { w: 800, h: 500 } };

  const parsedData = useMemo(() => rows.map((r, i) => ({
    label: r.label || `Item ${i + 1}`,
    value: parseFloat(r.value) || 0,
    color: CHART_COLORS[i % CHART_COLORS.length],
  })), [rows]);

  const addRow = () => setRows([...rows, { label: "", value: "" }]);
  const removeRow = (i: number) => setRows(rows.filter((_, idx) => idx !== i));
  const updateRow = (i: number, field: keyof DataRow, val: string) => {
    const copy = [...rows];
    copy[i] = { ...copy[i], [field]: val };
    setRows(copy);
  };

  const drawChart = useCallback((progress: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { w, h } = sizeMap[chartSize];
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, w, h);

    const data = parsedData;
    if (data.length === 0) return;
    const maxVal = Math.max(...data.map(d => d.value), 1);

    // Title
    if (title) {
      ctx.fillStyle = "#1f2937";
      ctx.font = "bold 16px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(title, w / 2, 24);
    }

    const pad = { top: title ? 44 : 20, right: 20, bottom: 50, left: 60 };
    const cw = w - pad.left - pad.right;
    const ch = h - pad.top - pad.bottom;

    if (chartType === "bar") {
      if (showGrid) {
        ctx.strokeStyle = "#e5e7eb";
        ctx.lineWidth = 1;
        for (let i = 0; i <= 5; i++) {
          const y = pad.top + ch - (ch * i) / 5;
          ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(pad.left + cw, y); ctx.stroke();
          ctx.fillStyle = "#9ca3af"; ctx.font = "11px sans-serif"; ctx.textAlign = "right";
          ctx.fillText(((maxVal * i) / 5).toFixed(0), pad.left - 8, y + 4);
        }
      }
      const barW = (cw / data.length) * 0.6;
      const gap = (cw / data.length) * 0.4;
      data.forEach((d, i) => {
        const barH = (d.value / maxVal) * ch * progress;
        const x = pad.left + i * (barW + gap) + gap / 2;
        const y = pad.top + ch - barH;
        ctx.fillStyle = d.color;
        ctx.beginPath();
        ctx.roundRect(x, y, barW, barH, [4, 4, 0, 0]);
        ctx.fill();
        ctx.fillStyle = "#374151"; ctx.font = "11px sans-serif"; ctx.textAlign = "center";
        ctx.fillText(d.label, x + barW / 2, pad.top + ch + 18);
      });
    } else if (chartType === "horizontal-bar") {
      const barH = (ch / data.length) * 0.6;
      const gap = (ch / data.length) * 0.4;
      if (showGrid) {
        ctx.strokeStyle = "#e5e7eb"; ctx.lineWidth = 1;
        for (let i = 0; i <= 5; i++) {
          const x = pad.left + (cw * i) / 5;
          ctx.beginPath(); ctx.moveTo(x, pad.top); ctx.lineTo(x, pad.top + ch); ctx.stroke();
          ctx.fillStyle = "#9ca3af"; ctx.font = "11px sans-serif"; ctx.textAlign = "center";
          ctx.fillText(((maxVal * i) / 5).toFixed(0), x, pad.top + ch + 18);
        }
      }
      data.forEach((d, i) => {
        const bw = (d.value / maxVal) * cw * progress;
        const y = pad.top + i * (barH + gap) + gap / 2;
        ctx.fillStyle = d.color;
        ctx.beginPath();
        ctx.roundRect(pad.left, y, bw, barH, [0, 4, 4, 0]);
        ctx.fill();
        ctx.fillStyle = "#374151"; ctx.font = "11px sans-serif"; ctx.textAlign = "right";
        ctx.fillText(d.label, pad.left - 8, y + barH / 2 + 4);
      });
    } else if (chartType === "line") {
      if (showGrid) {
        ctx.strokeStyle = "#e5e7eb"; ctx.lineWidth = 1;
        for (let i = 0; i <= 5; i++) {
          const y = pad.top + ch - (ch * i) / 5;
          ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(pad.left + cw, y); ctx.stroke();
          ctx.fillStyle = "#9ca3af"; ctx.font = "11px sans-serif"; ctx.textAlign = "right";
          ctx.fillText(((maxVal * i) / 5).toFixed(0), pad.left - 8, y + 4);
        }
      }
      const stepX = cw / Math.max(data.length - 1, 1);
      ctx.strokeStyle = CHART_COLORS[0]; ctx.lineWidth = 3;
      ctx.beginPath();
      data.forEach((d, i) => {
        const x = pad.left + i * stepX;
        const y = pad.top + ch - (d.value / maxVal) * ch * progress;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      });
      ctx.stroke();
      // Fill area
      ctx.globalAlpha = 0.1; ctx.fillStyle = CHART_COLORS[0];
      ctx.lineTo(pad.left + (data.length - 1) * stepX, pad.top + ch);
      ctx.lineTo(pad.left, pad.top + ch);
      ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1;
      // Points
      data.forEach((d, i) => {
        const x = pad.left + i * stepX;
        const y = pad.top + ch - (d.value / maxVal) * ch * progress;
        ctx.fillStyle = CHART_COLORS[0];
        ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#374151"; ctx.font = "11px sans-serif"; ctx.textAlign = "center";
        ctx.fillText(d.label, x, pad.top + ch + 18);
      });
    } else if (chartType === "pie" || chartType === "doughnut") {
      const cx = w / 2 - (showLegend ? 60 : 0);
      const cy = pad.top + ch / 2;
      const r = Math.min(cw, ch) / 2 - 20;
      const total = data.reduce((s, d) => s + d.value, 0) || 1;
      let startAngle = -Math.PI / 2;
      data.forEach((d) => {
        const sliceAngle = (d.value / total) * Math.PI * 2 * progress;
        ctx.fillStyle = d.color;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, r, startAngle, startAngle + sliceAngle);
        ctx.closePath(); ctx.fill();
        startAngle += sliceAngle;
      });
      if (chartType === "doughnut") {
        ctx.fillStyle = "#fff";
        ctx.beginPath(); ctx.arc(cx, cy, r * 0.55, 0, Math.PI * 2); ctx.fill();
      }
      // Legend for pie
      if (showLegend) {
        const lx = w - 140;
        data.forEach((d, i) => {
          const ly = pad.top + 10 + i * 22;
          ctx.fillStyle = d.color;
          ctx.fillRect(lx, ly, 12, 12);
          ctx.fillStyle = "#374151"; ctx.font = "12px sans-serif"; ctx.textAlign = "left";
          ctx.fillText(`${d.label} (${d.value})`, lx + 18, ly + 10);
        });
      }
      return;
    }

    // Legend for bar/line
    if (showLegend && (chartType === "bar" || chartType === "horizontal-bar" || chartType === "line")) {
      const lx = pad.left;
      const ly = h - 14;
      ctx.font = "11px sans-serif"; ctx.textAlign = "left";
      let ox = lx;
      data.forEach((d) => {
        ctx.fillStyle = d.color;
        ctx.fillRect(ox, ly - 8, 10, 10);
        ctx.fillStyle = "#374151";
        ctx.fillText(d.label, ox + 14, ly);
        ox += ctx.measureText(d.label).width + 30;
      });
    }
  }, [parsedData, chartType, title, showLegend, showGrid, chartSize]);

  const triggerDraw = useCallback((animate: boolean) => {
    cancelAnimationFrame(animFrame.current);
    if (animate) {
      setAnimated(true);
      animProgress.current = 0;
      const start = performance.now();
      const dur = 800;
      const step = (now: number) => {
        const p = Math.min((now - start) / dur, 1);
        animProgress.current = p;
        drawChart(p);
        if (p < 1) animFrame.current = requestAnimationFrame(step);
        else setAnimated(false);
      };
      animFrame.current = requestAnimationFrame(step);
    } else {
      drawChart(1);
    }
  }, [drawChart]);

  useEffect(() => { triggerDraw(false); }, [triggerDraw]);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `chart-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Data Input */}
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Data (Label, Value)</label>
        <div className="space-y-2">
          {rows.map((r, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input value={r.label} onChange={e => updateRow(i, "label", e.target.value)} placeholder="Label" className="calc-input !py-1.5 flex-1" />
              <input value={r.value} onChange={e => updateRow(i, "value", e.target.value)} placeholder="Value" type="number" className="calc-input !py-1.5 w-28" />
              <button onClick={() => removeRow(i)} className="text-red-500 hover:text-red-700 text-lg font-bold px-2">&times;</button>
            </div>
          ))}
        </div>
        <button onClick={addRow} className="btn-secondary text-xs mt-2 !py-1.5 !px-3">+ Add Row</button>
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">Chart Type</label>
          <select value={chartType} onChange={e => setChartType(e.target.value as ChartType)} className="calc-input !py-1.5 text-sm">
            <option value="bar">Bar</option>
            <option value="horizontal-bar">Horizontal Bar</option>
            <option value="pie">Pie</option>
            <option value="doughnut">Doughnut</option>
            <option value="line">Line</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">Size</label>
          <select value={chartSize} onChange={e => setChartSize(e.target.value as "small"|"medium"|"large")} className="calc-input !py-1.5 text-sm">
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">Title</label>
          <input value={title} onChange={e => setTitle(e.target.value)} className="calc-input !py-1.5 text-sm" placeholder="Chart Title" />
        </div>
        <div className="flex items-end gap-4">
          <label className="flex items-center gap-1.5 text-sm">
            <input type="checkbox" checked={showLegend} onChange={e => setShowLegend(e.target.checked)} /> Legend
          </label>
          <label className="flex items-center gap-1.5 text-sm">
            <input type="checkbox" checked={showGrid} onChange={e => setShowGrid(e.target.checked)} /> Grid
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 flex-wrap">
        <button onClick={() => triggerDraw(true)} disabled={animated} className="btn-primary text-sm !py-2 !px-5">
          {animated ? "Animating..." : "Render Chart"}
        </button>
        <button onClick={download} className="btn-secondary text-sm !py-2 !px-5">Download PNG</button>
      </div>

      {/* Canvas */}
      <div className="result-card overflow-x-auto">
        <canvas ref={canvasRef} className="mx-auto border border-gray-200 rounded-lg" />
      </div>
    </div>
  );
}
