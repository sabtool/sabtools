"use client";
import { useState, useRef, useCallback } from "react";

type PaperType = "grid5" | "grid10" | "ruled" | "dotgrid" | "isometric" | "blank";
type PageSize = "a4" | "letter";
type GridColor = "#b3d4fc" | "#d1d5db" | "#b8e6c8";

const PAPER_TYPES: { value: PaperType; label: string }[] = [
  { value: "grid5", label: "Grid (5mm)" },
  { value: "grid10", label: "Grid (10mm)" },
  { value: "ruled", label: "Ruled Lines (8mm)" },
  { value: "dotgrid", label: "Dot Grid" },
  { value: "isometric", label: "Isometric" },
  { value: "blank", label: "Blank" },
];

const COLORS: { value: GridColor; label: string }[] = [
  { value: "#b3d4fc", label: "Light Blue" },
  { value: "#d1d5db", label: "Light Gray" },
  { value: "#b8e6c8", label: "Green" },
];

const SIZES: { value: PageSize; label: string; w: number; h: number }[] = [
  { value: "a4", label: "A4", w: 794, h: 1123 },
  { value: "letter", label: "Letter", w: 816, h: 1056 },
];

export default function GraphPaperGenerator() {
  const [paperType, setPaperType] = useState<PaperType>("grid5");
  const [pageSize, setPageSize] = useState<PageSize>("a4");
  const [color, setColor] = useState<GridColor>("#b3d4fc");
  const [showMargin, setShowMargin] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const size = SIZES.find((s) => s.value === pageSize)!;
  const scale = 0.55;

  const drawPaper = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, w, h);

      const margin = showMargin ? 60 : 0;
      const left = margin;
      const top = margin;
      const right = w - margin;
      const bottom = h - margin;

      ctx.strokeStyle = color;
      ctx.lineWidth = 0.5;

      if (showMargin && margin > 0) {
        ctx.strokeStyle = "#f87171";
        ctx.lineWidth = 1;
        ctx.strokeRect(left, top, right - left, bottom - top);
        ctx.strokeStyle = color;
        ctx.lineWidth = 0.5;
      }

      const drawW = right - left;
      const drawH = bottom - top;

      switch (paperType) {
        case "grid5": {
          const gap = 19; // ~5mm at 96dpi
          for (let x = left; x <= right; x += gap) {
            ctx.beginPath(); ctx.moveTo(x, top); ctx.lineTo(x, bottom); ctx.stroke();
          }
          for (let y = top; y <= bottom; y += gap) {
            ctx.beginPath(); ctx.moveTo(left, y); ctx.lineTo(right, y); ctx.stroke();
          }
          break;
        }
        case "grid10": {
          const gap = 38;
          for (let x = left; x <= right; x += gap) {
            ctx.beginPath(); ctx.moveTo(x, top); ctx.lineTo(x, bottom); ctx.stroke();
          }
          for (let y = top; y <= bottom; y += gap) {
            ctx.beginPath(); ctx.moveTo(left, y); ctx.lineTo(right, y); ctx.stroke();
          }
          break;
        }
        case "ruled": {
          const gap = 30;
          for (let y = top; y <= bottom; y += gap) {
            ctx.beginPath(); ctx.moveTo(left, y); ctx.lineTo(right, y); ctx.stroke();
          }
          break;
        }
        case "dotgrid": {
          const gap = 19;
          ctx.fillStyle = color;
          for (let x = left; x <= right; x += gap) {
            for (let y = top; y <= bottom; y += gap) {
              ctx.beginPath(); ctx.arc(x, y, 1.2, 0, Math.PI * 2); ctx.fill();
            }
          }
          break;
        }
        case "isometric": {
          const gap = 30;
          ctx.beginPath();
          for (let y = top; y <= bottom; y += gap * Math.sin(Math.PI / 3)) {
            ctx.moveTo(left, y); ctx.lineTo(right, y);
          }
          ctx.stroke();
          for (let x = left; x <= right; x += gap) {
            for (let y = top; y <= bottom; y += gap * Math.sin(Math.PI / 3) * 2) {
              ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + gap / 2, y + gap * Math.sin(Math.PI / 3)); ctx.stroke();
              ctx.beginPath(); ctx.moveTo(x + gap / 2, y + gap * Math.sin(Math.PI / 3)); ctx.lineTo(x, y + gap * Math.sin(Math.PI / 3) * 2); ctx.stroke();
            }
          }
          break;
        }
        case "blank":
        default:
          break;
      }
    },
    [paperType, color, showMargin]
  );

  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = size.w;
    canvas.height = size.h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    drawPaper(ctx, size.w, size.h);
  }, [drawPaper, size]);

  // Render on mount and changes
  const canvasCallback = useCallback(
    (node: HTMLCanvasElement | null) => {
      if (node) {
        (canvasRef as React.MutableRefObject<HTMLCanvasElement>).current = node;
        renderCanvas();
      }
    },
    [renderCanvas]
  );

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `graph-paper-${paperType}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">Paper Type</label>
          <select className="calc-input" value={paperType} onChange={(e) => setPaperType(e.target.value as PaperType)}>
            {PAPER_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">Page Size</label>
          <select className="calc-input" value={pageSize} onChange={(e) => setPageSize(e.target.value as PageSize)}>
            {SIZES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">Color</label>
          <select className="calc-input" value={color} onChange={(e) => setColor(e.target.value as GridColor)}>
            {COLORS.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2 pt-6">
          <input type="checkbox" id="margin" checked={showMargin} onChange={(e) => setShowMargin(e.target.checked)} className="w-4 h-4" />
          <label htmlFor="margin" className="text-sm font-semibold text-gray-700">Show Margin</label>
        </div>
      </div>

      <div className="flex gap-3">
        <button className="btn-primary" onClick={handlePrint}>🖨️ Print</button>
        <button className="btn-secondary" onClick={handleDownload}>⬇️ Download PNG</button>
      </div>

      <div className="result-card flex justify-center overflow-auto">
        <canvas
          ref={canvasCallback}
          style={{ width: size.w * scale, height: size.h * scale, border: "1px solid #e5e7eb", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
        />
      </div>
    </div>
  );
}
