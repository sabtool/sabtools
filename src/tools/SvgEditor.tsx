"use client";
import { useState, useRef, useMemo } from "react";

interface Shape {
  id: number;
  type: "rect" | "circle" | "line" | "text";
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  text?: string;
  x2?: number;
  y2?: number;
}

let shapeId = 0;

export default function SvgEditor() {
  const [shapes, setShapes] = useState<Shape[]>([
    { id: ++shapeId, type: "rect", x: 50, y: 50, width: 120, height: 80, fill: "#6366f1", stroke: "#4f46e5", strokeWidth: 2 },
    { id: ++shapeId, type: "circle", x: 300, y: 120, width: 60, height: 60, fill: "#f43f5e", stroke: "#e11d48", strokeWidth: 2 },
  ]);
  const [selected, setSelected] = useState<number | null>(null);
  const [tool, setTool] = useState<"rect" | "circle" | "line" | "text" | "select">("select");
  const [fillColor, setFillColor] = useState("#6366f1");
  const [strokeColor, setStrokeColor] = useState("#1f2937");
  const [importCode, setImportCode] = useState("");
  const [showImport, setShowImport] = useState(false);
  const [copied, setCopied] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const canvasW = 600, canvasH = 400;

  const selectedShape = shapes.find(s => s.id === selected);

  const addShape = (e: React.MouseEvent<SVGSVGElement>) => {
    if (tool === "select") return;
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    shapeId++;
    const newShape: Shape = {
      id: shapeId, type: tool, x, y, width: tool === "line" ? 100 : 80,
      height: tool === "line" ? 0 : 60, fill: fillColor, stroke: strokeColor,
      strokeWidth: 2, text: tool === "text" ? "Text" : undefined,
      x2: tool === "line" ? x + 100 : undefined, y2: tool === "line" ? y : undefined,
    };
    setShapes([...shapes, newShape]);
    setSelected(shapeId);
    setTool("select");
  };

  const updateShape = (id: number, updates: Partial<Shape>) => {
    setShapes(shapes.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteSelected = () => {
    if (selected === null) return;
    setShapes(shapes.filter(s => s.id !== selected));
    setSelected(null);
  };

  const svgCode = useMemo(() => {
    const els = shapes.map(s => {
      switch (s.type) {
        case "rect":
          return `  <rect x="${s.x}" y="${s.y}" width="${s.width}" height="${s.height}" fill="${s.fill}" stroke="${s.stroke}" stroke-width="${s.strokeWidth}" rx="4" />`;
        case "circle":
          return `  <circle cx="${s.x}" cy="${s.y}" r="${s.width}" fill="${s.fill}" stroke="${s.stroke}" stroke-width="${s.strokeWidth}" />`;
        case "line":
          return `  <line x1="${s.x}" y1="${s.y}" x2="${s.x2 ?? s.x + s.width}" y2="${s.y2 ?? s.y}" stroke="${s.stroke}" stroke-width="${s.strokeWidth}" />`;
        case "text":
          return `  <text x="${s.x}" y="${s.y}" fill="${s.fill}" font-size="16" font-family="sans-serif">${s.text || "Text"}</text>`;
      }
    }).join("\n");
    return `<svg width="${canvasW}" height="${canvasH}" xmlns="http://www.w3.org/2000/svg">\n${els}\n</svg>`;
  }, [shapes]);

  const handleImport = () => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(importCode, "image/svg+xml");
      const newShapes: Shape[] = [];
      doc.querySelectorAll("rect").forEach(el => {
        shapeId++;
        newShapes.push({ id: shapeId, type: "rect", x: +(el.getAttribute("x") || 0), y: +(el.getAttribute("y") || 0), width: +(el.getAttribute("width") || 80), height: +(el.getAttribute("height") || 60), fill: el.getAttribute("fill") || "#6366f1", stroke: el.getAttribute("stroke") || "#000", strokeWidth: +(el.getAttribute("stroke-width") || 2) });
      });
      doc.querySelectorAll("circle").forEach(el => {
        shapeId++;
        newShapes.push({ id: shapeId, type: "circle", x: +(el.getAttribute("cx") || 0), y: +(el.getAttribute("cy") || 0), width: +(el.getAttribute("r") || 40), height: +(el.getAttribute("r") || 40), fill: el.getAttribute("fill") || "#f43f5e", stroke: el.getAttribute("stroke") || "#000", strokeWidth: +(el.getAttribute("stroke-width") || 2) });
      });
      doc.querySelectorAll("text").forEach(el => {
        shapeId++;
        newShapes.push({ id: shapeId, type: "text", x: +(el.getAttribute("x") || 0), y: +(el.getAttribute("y") || 0), width: 0, height: 0, fill: el.getAttribute("fill") || "#000", stroke: "none", strokeWidth: 0, text: el.textContent || "Text" });
      });
      if (newShapes.length > 0) setShapes(newShapes);
      setShowImport(false);
    } catch { /* invalid SVG */ }
  };

  const copy = () => {
    navigator.clipboard?.writeText(svgCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 items-center">
        {(["select", "rect", "circle", "line", "text"] as const).map(t => (
          <button key={t} onClick={() => setTool(t)} className={`text-xs px-3 py-1.5 rounded-lg border-2 font-medium capitalize ${tool === t ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "border-gray-200 hover:border-gray-400"}`}>
            {t === "select" ? "Select" : t === "rect" ? "Rectangle" : t === "circle" ? "Circle" : t === "line" ? "Line" : "Text"}
          </button>
        ))}
        <div className="flex items-center gap-2 ml-4">
          <label className="text-xs text-gray-600">Fill:</label>
          <input type="color" value={fillColor} onChange={e => setFillColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
          <label className="text-xs text-gray-600">Stroke:</label>
          <input type="color" value={strokeColor} onChange={e => setStrokeColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
        </div>
        {selected !== null && <button onClick={deleteSelected} className="btn-secondary text-xs !py-1.5 ml-auto text-red-600">Delete Selected</button>}
      </div>

      {/* SVG Canvas */}
      <div className="result-card overflow-x-auto">
        <svg ref={svgRef} width={canvasW} height={canvasH} onClick={addShape} className="border border-gray-200 rounded-lg mx-auto cursor-crosshair" style={{ background: "#fafafa" }}>
          {shapes.map(s => {
            const isSelected = selected === s.id;
            const outline = isSelected ? { stroke: "#4f46e5", strokeWidth: 2, strokeDasharray: "5,3" } : {};
            switch (s.type) {
              case "rect":
                return <g key={s.id} onClick={(e) => { e.stopPropagation(); setSelected(s.id); }}>
                  <rect x={s.x} y={s.y} width={s.width} height={s.height} fill={s.fill} stroke={s.stroke} strokeWidth={s.strokeWidth} rx={4} cursor="pointer" />
                  {isSelected && <rect x={s.x - 2} y={s.y - 2} width={s.width + 4} height={s.height + 4} fill="none" {...outline} />}
                </g>;
              case "circle":
                return <g key={s.id} onClick={(e) => { e.stopPropagation(); setSelected(s.id); }}>
                  <circle cx={s.x} cy={s.y} r={s.width} fill={s.fill} stroke={s.stroke} strokeWidth={s.strokeWidth} cursor="pointer" />
                  {isSelected && <circle cx={s.x} cy={s.y} r={s.width + 4} fill="none" {...outline} />}
                </g>;
              case "line":
                return <g key={s.id} onClick={(e) => { e.stopPropagation(); setSelected(s.id); }}>
                  <line x1={s.x} y1={s.y} x2={s.x2 ?? s.x + s.width} y2={s.y2 ?? s.y} stroke={s.stroke} strokeWidth={s.strokeWidth} cursor="pointer" />
                  {isSelected && <line x1={s.x} y1={s.y} x2={s.x2 ?? s.x + s.width} y2={s.y2 ?? s.y} {...outline} />}
                </g>;
              case "text":
                return <g key={s.id} onClick={(e) => { e.stopPropagation(); setSelected(s.id); }}>
                  <text x={s.x} y={s.y} fill={s.fill} fontSize={16} fontFamily="sans-serif" cursor="pointer">{s.text}</text>
                  {isSelected && <rect x={s.x - 2} y={s.y - 18} width={80} height={22} fill="none" {...outline} />}
                </g>;
            }
          })}
        </svg>
      </div>

      {/* Selected shape properties */}
      {selectedShape && (
        <div className="border border-indigo-200 rounded-xl p-4 bg-indigo-50/50">
          <label className="text-sm font-semibold text-indigo-700 block mb-2">Shape Properties</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div><label className="text-xs text-gray-600 block mb-1">X</label><input type="number" value={selectedShape.x} onChange={e => updateShape(selectedShape.id, { x: +e.target.value })} className="calc-input !py-1 text-sm" /></div>
            <div><label className="text-xs text-gray-600 block mb-1">Y</label><input type="number" value={selectedShape.y} onChange={e => updateShape(selectedShape.id, { y: +e.target.value })} className="calc-input !py-1 text-sm" /></div>
            {selectedShape.type !== "text" && selectedShape.type !== "line" && <div><label className="text-xs text-gray-600 block mb-1">{selectedShape.type === "circle" ? "Radius" : "Width"}</label><input type="number" value={selectedShape.width} onChange={e => updateShape(selectedShape.id, { width: +e.target.value })} className="calc-input !py-1 text-sm" /></div>}
            {selectedShape.type === "rect" && <div><label className="text-xs text-gray-600 block mb-1">Height</label><input type="number" value={selectedShape.height} onChange={e => updateShape(selectedShape.id, { height: +e.target.value })} className="calc-input !py-1 text-sm" /></div>}
            {selectedShape.type === "text" && <div><label className="text-xs text-gray-600 block mb-1">Text</label><input value={selectedShape.text || ""} onChange={e => updateShape(selectedShape.id, { text: e.target.value })} className="calc-input !py-1 text-sm" /></div>}
            <div><label className="text-xs text-gray-600 block mb-1">Fill</label><input type="color" value={selectedShape.fill} onChange={e => updateShape(selectedShape.id, { fill: e.target.value })} className="w-full h-8 rounded cursor-pointer" /></div>
            <div><label className="text-xs text-gray-600 block mb-1">Stroke</label><input type="color" value={selectedShape.stroke} onChange={e => updateShape(selectedShape.id, { stroke: e.target.value })} className="w-full h-8 rounded cursor-pointer" /></div>
          </div>
        </div>
      )}

      {/* Import/Export */}
      <div className="flex gap-3 flex-wrap">
        <button onClick={() => setShowImport(!showImport)} className="btn-secondary text-sm !py-2 !px-4">{showImport ? "Cancel Import" : "Import SVG"}</button>
      </div>

      {showImport && (
        <div>
          <textarea value={importCode} onChange={e => setImportCode(e.target.value)} className="calc-input min-h-[100px] font-mono text-xs" placeholder="Paste SVG code here..." rows={4} />
          <button onClick={handleImport} className="btn-primary text-xs mt-2 !py-1.5 !px-3">Import</button>
        </div>
      )}

      {/* SVG Code Output */}
      <div>
        <div className="flex justify-between mb-2">
          <label className="text-sm font-semibold text-gray-700">SVG Code</label>
          <button onClick={copy} className="text-xs text-indigo-600 font-medium hover:underline">{copied ? "Copied!" : "Copy"}</button>
        </div>
        <pre className="result-card font-mono text-xs whitespace-pre-wrap bg-gray-900 text-green-400 p-4 rounded-xl overflow-x-auto">{svgCode}</pre>
      </div>
    </div>
  );
}
