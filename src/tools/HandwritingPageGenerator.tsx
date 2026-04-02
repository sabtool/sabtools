"use client";
import { useState, useRef, useCallback } from "react";

type LineType = "fourline" | "twoline" | "ruled";
type Spacing = "narrow" | "medium" | "wide";

const LINE_TYPES: { value: LineType; label: string; desc: string }[] = [
  { value: "fourline", label: "4-Line (Hindi)", desc: "For Devanagari / Hindi writing practice" },
  { value: "twoline", label: "2-Line (English)", desc: "For English cursive and print practice" },
  { value: "ruled", label: "Blank Ruled", desc: "Simple ruled lines for general writing" },
];

const SPACINGS: { value: Spacing; label: string; gap: number }[] = [
  { value: "narrow", label: "Narrow", gap: 24 },
  { value: "medium", label: "Medium", gap: 32 },
  { value: "wide", label: "Wide", gap: 40 },
];

export default function HandwritingPageGenerator() {
  const [lineType, setLineType] = useState<LineType>("fourline");
  const [spacing, setSpacing] = useState<Spacing>("medium");
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [subject, setSubject] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const W = 794;
  const H = 1123;
  const MARGIN = 60;
  const scale = 0.55;

  const gap = SPACINGS.find((s) => s.value === spacing)!.gap;

  const drawPage = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, W, H);

      // Margin
      ctx.strokeStyle = "#f87171";
      ctx.lineWidth = 1;
      ctx.strokeRect(MARGIN, MARGIN, W - 2 * MARGIN, H - 2 * MARGIN);

      // Header
      ctx.fillStyle = "#374151";
      ctx.font = "bold 14px sans-serif";
      let headerY = MARGIN + 20;
      if (name || date || subject) {
        const parts: string[] = [];
        if (name) parts.push(`Name: ${name}`);
        if (date) parts.push(`Date: ${date}`);
        if (subject) parts.push(`Subject: ${subject}`);
        ctx.fillText(parts.join("    |    "), MARGIN + 10, headerY);
        headerY += 20;
        ctx.strokeStyle = "#9ca3af";
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(MARGIN, headerY);
        ctx.lineTo(W - MARGIN, headerY);
        ctx.stroke();
        headerY += 10;
      }

      const left = MARGIN;
      const right = W - MARGIN;
      const startY = headerY + 10;
      const endY = H - MARGIN;

      ctx.strokeStyle = "#93c5fd";
      ctx.lineWidth = 0.5;

      switch (lineType) {
        case "fourline": {
          // 4 lines per set: top, upper-mid, lower-mid, bottom
          const setGap = gap * 3;
          for (let y = startY; y + setGap <= endY; y += setGap + gap * 0.8) {
            for (let i = 0; i < 4; i++) {
              const ly = y + i * gap;
              ctx.strokeStyle = i === 0 || i === 3 ? "#3b82f6" : "#93c5fd";
              ctx.lineWidth = i === 0 || i === 3 ? 0.8 : 0.4;
              ctx.beginPath();
              ctx.moveTo(left, ly);
              ctx.lineTo(right, ly);
              ctx.stroke();
            }
          }
          break;
        }
        case "twoline": {
          const setGap = gap;
          for (let y = startY; y + setGap <= endY; y += setGap + gap * 0.6) {
            ctx.strokeStyle = "#3b82f6";
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(left, y);
            ctx.lineTo(right, y);
            ctx.stroke();
            // Dotted mid line
            ctx.strokeStyle = "#93c5fd";
            ctx.lineWidth = 0.3;
            ctx.setLineDash([3, 3]);
            ctx.beginPath();
            ctx.moveTo(left, y + setGap / 2);
            ctx.lineTo(right, y + setGap / 2);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.strokeStyle = "#3b82f6";
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(left, y + setGap);
            ctx.lineTo(right, y + setGap);
            ctx.stroke();
          }
          break;
        }
        case "ruled": {
          ctx.strokeStyle = "#93c5fd";
          ctx.lineWidth = 0.5;
          for (let y = startY; y <= endY; y += gap) {
            ctx.beginPath();
            ctx.moveTo(left, y);
            ctx.lineTo(right, y);
            ctx.stroke();
          }
          break;
        }
      }
    },
    [lineType, gap, name, date, subject]
  );

  const canvasCallback = useCallback(
    (node: HTMLCanvasElement | null) => {
      if (node) {
        (canvasRef as React.MutableRefObject<HTMLCanvasElement>).current = node;
        node.width = W;
        node.height = H;
        const ctx = node.getContext("2d");
        if (ctx) drawPage(ctx);
      }
    },
    [drawPage]
  );

  const handleDownload = () => {
    const c = canvasRef.current;
    if (!c) return;
    const link = document.createElement("a");
    link.download = `handwriting-${lineType}.png`;
    link.href = c.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">Line Type</label>
          <select className="calc-input" value={lineType} onChange={(e) => setLineType(e.target.value as LineType)}>
            {LINE_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
          <div className="text-xs text-gray-400 mt-1">{LINE_TYPES.find((t) => t.value === lineType)?.desc}</div>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">Line Spacing</label>
          <select className="calc-input" value={spacing} onChange={(e) => setSpacing(e.target.value as Spacing)}>
            {SPACINGS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <input className="calc-input" placeholder="Student Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="calc-input" placeholder="Date" value={date} onChange={(e) => setDate(e.target.value)} />
        <input className="calc-input" placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
      </div>

      <div className="flex gap-3">
        <button className="btn-primary" onClick={() => window.print()}>🖨️ Print</button>
        <button className="btn-secondary" onClick={handleDownload}>⬇️ Download PNG</button>
      </div>

      <div className="result-card flex justify-center overflow-auto">
        <canvas ref={canvasCallback} style={{ width: W * scale, height: H * scale, border: "1px solid #e5e7eb", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }} />
      </div>
    </div>
  );
}
