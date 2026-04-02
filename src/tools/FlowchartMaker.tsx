"use client";
import { useState, useRef, useCallback, useEffect } from "react";

type ShapeType = "rectangle" | "diamond" | "oval";

interface Step {
  text: string;
  shape: ShapeType;
}

export default function FlowchartMaker() {
  const [input, setInput] = useState("Start\nProcess Data\nDecision?\nYes Path\nNo Path\nEnd");
  const [steps, setSteps] = useState<Step[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const parseSteps = useCallback(() => {
    const lines = input.split("\n").map(l => l.trim()).filter(Boolean);
    const parsed: Step[] = lines.map((line, i) => {
      let shape: ShapeType = "rectangle";
      if (i === 0 || i === lines.length - 1) shape = "oval";
      else if (line.endsWith("?")) shape = "diamond";
      return { text: line, shape };
    });
    setSteps(parsed);
    return parsed;
  }, [input]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parsed = parseSteps();
    if (parsed.length === 0) return;

    const boxW = 200;
    const boxH = 50;
    const diamondH = 70;
    const gap = 30;
    const arrowLen = gap;

    let totalH = 40;
    parsed.forEach(s => {
      totalH += (s.shape === "diamond" ? diamondH : boxH) + arrowLen;
    });
    totalH += 20;

    const w = Math.max(400, boxW + 120);
    canvas.width = w;
    canvas.height = totalH;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, w, totalH);

    let y = 30;
    const cx = w / 2;

    parsed.forEach((step, i) => {
      const h = step.shape === "diamond" ? diamondH : boxH;
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#4f46e5";

      if (step.shape === "oval") {
        ctx.fillStyle = "#eef2ff";
        ctx.beginPath();
        ctx.ellipse(cx, y + h / 2, boxW / 2, h / 2, 0, 0, Math.PI * 2);
        ctx.fill(); ctx.stroke();
      } else if (step.shape === "diamond") {
        ctx.fillStyle = "#fef3c7";
        ctx.beginPath();
        ctx.moveTo(cx, y);
        ctx.lineTo(cx + boxW / 2, y + h / 2);
        ctx.lineTo(cx, y + h);
        ctx.lineTo(cx - boxW / 2, y + h / 2);
        ctx.closePath();
        ctx.fill(); ctx.stroke();
      } else {
        ctx.fillStyle = "#f0fdf4";
        ctx.beginPath();
        ctx.roundRect(cx - boxW / 2, y, boxW, h, 8);
        ctx.fill(); ctx.stroke();
      }

      ctx.fillStyle = "#1f2937";
      ctx.font = "14px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(step.text, cx, y + h / 2);

      // Arrow to next
      if (i < parsed.length - 1) {
        const startY = y + h;
        const endY = startY + arrowLen;
        ctx.strokeStyle = "#6b7280";
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(cx, startY); ctx.lineTo(cx, endY); ctx.stroke();
        // Arrow head
        ctx.fillStyle = "#6b7280";
        ctx.beginPath();
        ctx.moveTo(cx - 6, endY - 8);
        ctx.lineTo(cx + 6, endY - 8);
        ctx.lineTo(cx, endY);
        ctx.closePath(); ctx.fill();
        y = endY;
      }
    });
  }, [parseSteps]);

  useEffect(() => { draw(); }, [draw]);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `flowchart-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">
          Steps (one per line; lines ending with &quot;?&quot; become diamonds; first/last become ovals)
        </label>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          className="calc-input min-h-[150px] font-mono text-sm"
          rows={8}
          placeholder={"Start\nProcess Data\nIs Valid?\nSave\nEnd"}
        />
      </div>

      <div className="flex gap-3 flex-wrap">
        <button onClick={draw} className="btn-primary text-sm !py-2 !px-5">Render Flowchart</button>
        <button onClick={download} className="btn-secondary text-sm !py-2 !px-5">Download PNG</button>
      </div>

      <div className="result-card overflow-x-auto">
        <canvas ref={canvasRef} className="mx-auto" />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
        <strong>Shape Guide:</strong> First &amp; last lines become ovals (start/end). Lines ending with &quot;?&quot; become diamonds (decisions). All others are rectangles (processes).
      </div>
    </div>
  );
}
