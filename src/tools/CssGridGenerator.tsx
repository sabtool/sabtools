"use client";
import { useState, useMemo } from "react";

interface CellSpan {
  rowStart: number;
  colStart: number;
  rowEnd: number;
  colEnd: number;
  name: string;
}

export default function CssGridGenerator() {
  const [cols, setCols] = useState(3);
  const [rows, setRows] = useState(3);
  const [gap, setGap] = useState("10");
  const [unit, setUnit] = useState<"fr" | "%" | "px">("fr");
  const [colSizes, setColSizes] = useState<string[]>(["1", "1", "1"]);
  const [rowSizes, setRowSizes] = useState<string[]>(["1", "1", "1"]);
  const [areas, setAreas] = useState<CellSpan[]>([]);
  const [showAreas, setShowAreas] = useState(false);
  const [copied, setCopied] = useState(false);

  const updateGrid = (r: number, c: number) => {
    const nr = Math.max(1, Math.min(12, r));
    const nc = Math.max(1, Math.min(12, c));
    setRows(nr);
    setCols(nc);
    setColSizes(prev => {
      const n = [...prev];
      while (n.length < nc) n.push("1");
      return n.slice(0, nc);
    });
    setRowSizes(prev => {
      const n = [...prev];
      while (n.length < nr) n.push("1");
      return n.slice(0, nr);
    });
    setAreas([]);
  };

  const gridTemplateColumns = useMemo(() => colSizes.slice(0, cols).map(s => `${s}${unit}`).join(" "), [colSizes, cols, unit]);
  const gridTemplateRows = useMemo(() => rowSizes.slice(0, rows).map(s => `${s}${unit}`).join(" "), [rowSizes, rows, unit]);

  const areaNames = useMemo(() => {
    if (!showAreas || areas.length === 0) return "";
    const grid: string[][] = Array.from({ length: rows }, () => Array(cols).fill("."));
    areas.forEach(a => {
      for (let r = a.rowStart - 1; r < a.rowEnd - 1; r++) {
        for (let c = a.colStart - 1; c < a.colEnd - 1; c++) {
          if (r < rows && c < cols) grid[r][c] = a.name || ".";
        }
      }
    });
    return grid.map(r => `"${r.join(" ")}"`).join("\n    ");
  }, [areas, rows, cols, showAreas]);

  const cssCode = useMemo(() => {
    let code = `.grid-container {
  display: grid;
  grid-template-columns: ${gridTemplateColumns};
  grid-template-rows: ${gridTemplateRows};
  gap: ${gap}px;`;
    if (showAreas && areaNames) {
      code += `\n  grid-template-areas:\n    ${areaNames};`;
    }
    code += "\n}";

    if (showAreas && areas.length > 0) {
      areas.forEach(a => {
        if (a.name) code += `\n\n.${a.name} {\n  grid-area: ${a.name};\n}`;
      });
    }
    return code;
  }, [gridTemplateColumns, gridTemplateRows, gap, areaNames, showAreas, areas]);

  const addArea = () => {
    setAreas([...areas, { rowStart: 1, colStart: 1, rowEnd: 2, colEnd: 2, name: `area${areas.length + 1}` }]);
    setShowAreas(true);
  };

  const updateArea = (i: number, field: keyof CellSpan, val: string | number) => {
    const copy = [...areas];
    copy[i] = { ...copy[i], [field]: val };
    setAreas(copy);
  };

  const removeArea = (i: number) => setAreas(areas.filter((_, idx) => idx !== i));

  const copy = () => {
    navigator.clipboard?.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Grid Settings */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">Columns</label>
          <input type="number" min={1} max={12} value={cols} onChange={e => updateGrid(rows, +e.target.value)} className="calc-input !py-1.5 text-sm" />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">Rows</label>
          <input type="number" min={1} max={12} value={rows} onChange={e => updateGrid(+e.target.value, cols)} className="calc-input !py-1.5 text-sm" />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">Gap (px)</label>
          <input type="number" min={0} value={gap} onChange={e => setGap(e.target.value)} className="calc-input !py-1.5 text-sm" />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">Unit</label>
          <select value={unit} onChange={e => setUnit(e.target.value as "fr" | "%" | "px")} className="calc-input !py-1.5 text-sm">
            <option value="fr">fr</option>
            <option value="%">%</option>
            <option value="px">px</option>
          </select>
        </div>
      </div>

      {/* Column/Row sizes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">Column Sizes</label>
          <div className="flex flex-wrap gap-2">
            {colSizes.slice(0, cols).map((s, i) => (
              <input key={i} type="text" value={s} onChange={e => { const c = [...colSizes]; c[i] = e.target.value; setColSizes(c); }} className="calc-input !py-1 w-16 text-sm text-center" />
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">Row Sizes</label>
          <div className="flex flex-wrap gap-2">
            {rowSizes.slice(0, rows).map((s, i) => (
              <input key={i} type="text" value={s} onChange={e => { const r = [...rowSizes]; r[i] = e.target.value; setRowSizes(r); }} className="calc-input !py-1 w-16 text-sm text-center" />
            ))}
          </div>
        </div>
      </div>

      {/* Areas */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <label className="text-sm font-semibold text-gray-700">Grid Areas</label>
          <button onClick={addArea} className="btn-secondary text-xs !py-1 !px-2">+ Add Area</button>
        </div>
        {areas.map((a, i) => (
          <div key={i} className="flex flex-wrap gap-2 items-center mb-2">
            <input value={a.name} onChange={e => updateArea(i, "name", e.target.value)} placeholder="Name" className="calc-input !py-1 w-24 text-xs" />
            <span className="text-xs text-gray-500">Row</span>
            <input type="number" min={1} max={rows + 1} value={a.rowStart} onChange={e => updateArea(i, "rowStart", +e.target.value)} className="calc-input !py-1 w-14 text-xs" />
            <span className="text-xs text-gray-500">to</span>
            <input type="number" min={2} max={rows + 1} value={a.rowEnd} onChange={e => updateArea(i, "rowEnd", +e.target.value)} className="calc-input !py-1 w-14 text-xs" />
            <span className="text-xs text-gray-500">Col</span>
            <input type="number" min={1} max={cols + 1} value={a.colStart} onChange={e => updateArea(i, "colStart", +e.target.value)} className="calc-input !py-1 w-14 text-xs" />
            <span className="text-xs text-gray-500">to</span>
            <input type="number" min={2} max={cols + 1} value={a.colEnd} onChange={e => updateArea(i, "colEnd", +e.target.value)} className="calc-input !py-1 w-14 text-xs" />
            <button onClick={() => removeArea(i)} className="text-red-500 hover:text-red-700 text-lg font-bold">&times;</button>
          </div>
        ))}
      </div>

      {/* Live Preview */}
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Live Preview</label>
        <div className="result-card p-4">
          <div style={{ display: "grid", gridTemplateColumns, gridTemplateRows, gap: `${gap}px`, minHeight: 200 }}>
            {Array.from({ length: rows * cols }, (_, i) => (
              <div key={i} className="bg-indigo-100 border-2 border-indigo-300 rounded-lg flex items-center justify-center text-sm text-indigo-600 font-medium p-2">
                {i + 1}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CSS Output */}
      <div>
        <div className="flex justify-between mb-2">
          <label className="text-sm font-semibold text-gray-700">CSS Code</label>
          <button onClick={copy} className="text-xs text-indigo-600 font-medium hover:underline">{copied ? "Copied!" : "Copy"}</button>
        </div>
        <pre className="result-card font-mono text-sm whitespace-pre-wrap bg-gray-900 text-green-400 p-4 rounded-xl overflow-x-auto">{cssCode}</pre>
      </div>
    </div>
  );
}
