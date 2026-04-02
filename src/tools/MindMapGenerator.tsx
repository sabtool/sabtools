"use client";
import { useState, useRef, useCallback, useEffect } from "react";

interface Branch {
  id: string;
  text: string;
  children: Branch[];
}

const BRANCH_COLORS = [
  "#6366f1", "#f43f5e", "#10b981", "#f59e0b", "#3b82f6",
  "#8b5cf6", "#ec4899", "#14b8a6", "#ef4444", "#06b6d4",
];

let nextId = 1;

export default function MindMapGenerator() {
  const [topic, setTopic] = useState("Main Topic");
  const [branches, setBranches] = useState<Branch[]>([
    { id: "b1", text: "Branch 1", children: [{ id: "s1", text: "Sub 1.1", children: [] }] },
    { id: "b2", text: "Branch 2", children: [{ id: "s2", text: "Sub 2.1", children: [] }] },
    { id: "b3", text: "Branch 3", children: [] },
  ]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const addBranch = () => {
    nextId++;
    setBranches([...branches, { id: `b${nextId}`, text: `Branch ${branches.length + 1}`, children: [] }]);
  };

  const removeBranch = (idx: number) => setBranches(branches.filter((_, i) => i !== idx));

  const updateBranch = (idx: number, text: string) => {
    const copy = [...branches];
    copy[idx] = { ...copy[idx], text };
    setBranches(copy);
  };

  const addChild = (idx: number) => {
    nextId++;
    const copy = [...branches];
    copy[idx] = { ...copy[idx], children: [...copy[idx].children, { id: `s${nextId}`, text: `Sub ${idx + 1}.${copy[idx].children.length + 1}`, children: [] }] };
    setBranches(copy);
  };

  const removeChild = (bi: number, ci: number) => {
    const copy = [...branches];
    copy[bi] = { ...copy[bi], children: copy[bi].children.filter((_, i) => i !== ci) };
    setBranches(copy);
  };

  const updateChild = (bi: number, ci: number, text: string) => {
    const copy = [...branches];
    const children = [...copy[bi].children];
    children[ci] = { ...children[ci], text };
    copy[bi] = { ...copy[bi], children };
    setBranches(copy);
  };

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = 800, h = 600;
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, w, h);

    const cx = w / 2, cy = h / 2;

    // Draw central topic
    ctx.fillStyle = "#4f46e5";
    ctx.beginPath();
    ctx.ellipse(cx, cy, 80, 40, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "bold 16px sans-serif";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(topic.length > 18 ? topic.slice(0, 18) + "..." : topic, cx, cy);

    if (branches.length === 0) return;

    const angleStep = (Math.PI * 2) / branches.length;
    const branchRadius = 180;
    const childRadius = 100;

    branches.forEach((branch, i) => {
      const angle = angleStep * i - Math.PI / 2;
      const bx = cx + Math.cos(angle) * branchRadius;
      const by = cy + Math.sin(angle) * branchRadius;
      const color = BRANCH_COLORS[i % BRANCH_COLORS.length];

      // Connection line
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(bx, by); ctx.stroke();

      // Branch bubble
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.ellipse(bx, by, 65, 28, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.font = "bold 13px sans-serif";
      ctx.fillText(branch.text.length > 14 ? branch.text.slice(0, 14) + "..." : branch.text, bx, by);

      // Children
      if (branch.children.length > 0) {
        const childAngleSpread = Math.PI / 4;
        const startAngle = angle - childAngleSpread / 2;
        const childStep = branch.children.length > 1 ? childAngleSpread / (branch.children.length - 1) : 0;

        branch.children.forEach((child, ci) => {
          const ca = branch.children.length === 1 ? angle : startAngle + childStep * ci;
          const sx = bx + Math.cos(ca) * childRadius;
          const sy = by + Math.sin(ca) * childRadius;

          ctx.strokeStyle = color;
          ctx.lineWidth = 2;
          ctx.globalAlpha = 0.6;
          ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(sx, sy); ctx.stroke();
          ctx.globalAlpha = 1;

          ctx.fillStyle = color;
          ctx.globalAlpha = 0.2;
          ctx.beginPath();
          ctx.ellipse(sx, sy, 50, 22, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
          ctx.strokeStyle = color;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.ellipse(sx, sy, 50, 22, 0, 0, Math.PI * 2);
          ctx.stroke();

          ctx.fillStyle = "#1f2937";
          ctx.font = "12px sans-serif";
          ctx.fillText(child.text.length > 12 ? child.text.slice(0, 12) + "..." : child.text, sx, sy);
        });
      }
    });
  }, [topic, branches]);

  useEffect(() => { draw(); }, [draw]);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `mindmap-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Central Topic</label>
        <input value={topic} onChange={e => setTopic(e.target.value)} className="calc-input" placeholder="Main Topic" />
      </div>

      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Branches</label>
        <div className="space-y-3">
          {branches.map((b, bi) => (
            <div key={b.id} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
              <div className="flex gap-2 items-center mb-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: BRANCH_COLORS[bi % BRANCH_COLORS.length] }} />
                <input value={b.text} onChange={e => updateBranch(bi, e.target.value)} className="calc-input !py-1 flex-1 text-sm" />
                <button onClick={() => addChild(bi)} className="btn-secondary text-xs !py-1 !px-2">+ Sub</button>
                <button onClick={() => removeBranch(bi)} className="text-red-500 hover:text-red-700 text-lg font-bold px-1">&times;</button>
              </div>
              {b.children.length > 0 && (
                <div className="ml-6 space-y-1">
                  {b.children.map((c, ci) => (
                    <div key={c.id} className="flex gap-2 items-center">
                      <span className="text-gray-400 text-xs">&#8627;</span>
                      <input value={c.text} onChange={e => updateChild(bi, ci, e.target.value)} className="calc-input !py-1 flex-1 text-xs" />
                      <button onClick={() => removeChild(bi, ci)} className="text-red-400 hover:text-red-600 text-sm font-bold px-1">&times;</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        <button onClick={addBranch} className="btn-secondary text-xs mt-2 !py-1.5 !px-3">+ Add Branch</button>
      </div>

      <div className="flex gap-3 flex-wrap">
        <button onClick={draw} className="btn-primary text-sm !py-2 !px-5">Render Mind Map</button>
        <button onClick={download} className="btn-secondary text-sm !py-2 !px-5">Download PNG</button>
      </div>

      <div className="result-card overflow-x-auto">
        <canvas ref={canvasRef} className="mx-auto" />
      </div>
    </div>
  );
}
