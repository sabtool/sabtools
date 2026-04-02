"use client";
import { useState, useMemo } from "react";

export default function TableGenerator() {
  const [numRows, setNumRows] = useState(3);
  const [numCols, setNumCols] = useState(3);
  const [data, setData] = useState<string[][]>(() =>
    Array.from({ length: 3 }, () => Array(3).fill(""))
  );
  const [sortCol, setSortCol] = useState<number | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [copied, setCopied] = useState("");

  const resize = (r: number, c: number) => {
    const nr = Math.max(1, Math.min(20, r));
    const nc = Math.max(1, Math.min(20, c));
    setNumRows(nr);
    setNumCols(nc);
    setData(prev => {
      const nd: string[][] = [];
      for (let i = 0; i < nr; i++) {
        const row: string[] = [];
        for (let j = 0; j < nc; j++) {
          row.push(prev[i]?.[j] ?? "");
        }
        nd.push(row);
      }
      return nd;
    });
  };

  const updateCell = (r: number, c: number, val: string) => {
    setData(prev => {
      const copy = prev.map(row => [...row]);
      copy[r][c] = val;
      return copy;
    });
  };

  const handleSort = (col: number) => {
    if (sortCol === col) setSortAsc(!sortAsc);
    else { setSortCol(col); setSortAsc(true); }
  };

  const sortedData = useMemo(() => {
    if (sortCol === null || data.length <= 1) return data;
    const header = data[0];
    const body = data.slice(1).sort((a, b) => {
      const va = a[sortCol] || "";
      const vb = b[sortCol] || "";
      const na = parseFloat(va), nb = parseFloat(vb);
      if (!isNaN(na) && !isNaN(nb)) return sortAsc ? na - nb : nb - na;
      return sortAsc ? va.localeCompare(vb) : vb.localeCompare(va);
    });
    return [header, ...body];
  }, [data, sortCol, sortAsc]);

  const htmlCode = useMemo(() => {
    if (data.length === 0) return "";
    const rows = sortedData.map((row, i) => {
      const tag = i === 0 ? "th" : "td";
      const cells = row.map(c => `    <${tag}>${c}</${tag}>`).join("\n");
      return `  <tr>\n${cells}\n  </tr>`;
    });
    return `<table border="1" cellpadding="8" cellspacing="0">\n${rows.join("\n")}\n</table>`;
  }, [sortedData]);

  const mdCode = useMemo(() => {
    if (data.length === 0) return "";
    const header = "| " + sortedData[0].map(c => c || " ").join(" | ") + " |";
    const sep = "| " + sortedData[0].map(() => "---").join(" | ") + " |";
    const body = sortedData.slice(1).map(row => "| " + row.map(c => c || " ").join(" | ") + " |");
    return [header, sep, ...body].join("\n");
  }, [sortedData]);

  const copy = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(""), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-3 items-end">
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">Rows</label>
          <input type="number" min={1} max={20} value={numRows} onChange={e => resize(+e.target.value, numCols)} className="calc-input !py-1.5 w-20 text-sm" />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">Columns</label>
          <input type="number" min={1} max={20} value={numCols} onChange={e => resize(numRows, +e.target.value)} className="calc-input !py-1.5 w-20 text-sm" />
        </div>
        <button onClick={() => resize(numRows + 1, numCols)} className="btn-secondary text-xs !py-1.5">+ Row</button>
        <button onClick={() => resize(numRows, numCols + 1)} className="btn-secondary text-xs !py-1.5">+ Col</button>
        <button onClick={() => resize(numRows - 1, numCols)} className="btn-secondary text-xs !py-1.5">- Row</button>
        <button onClick={() => resize(numRows, numCols - 1)} className="btn-secondary text-xs !py-1.5">- Col</button>
      </div>

      {/* Editable Table */}
      <div className="overflow-x-auto">
        <table className="border-collapse text-sm w-full">
          <tbody>
            {data.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => (
                  <td key={ci} className="border border-gray-300 p-0">
                    <input
                      value={cell}
                      onChange={e => updateCell(ri, ci, e.target.value)}
                      className="w-full px-2 py-1.5 text-sm border-0 outline-none focus:bg-indigo-50"
                      placeholder={ri === 0 ? `Header ${ci + 1}` : ""}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Preview */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-semibold text-gray-700">Preview (click header to sort)</label>
        </div>
        <div className="result-card overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                {sortedData[0]?.map((h, i) => (
                  <th key={i} onClick={() => handleSort(i)} className="bg-indigo-50 text-indigo-700 px-3 py-2 border border-gray-200 cursor-pointer hover:bg-indigo-100 text-left whitespace-nowrap">
                    {h || `Col ${i + 1}`} {sortCol === i ? (sortAsc ? " ↑" : " ↓") : ""}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedData.slice(1).map((row, ri) => (
                <tr key={ri} className={ri % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  {row.map((c, ci) => (
                    <td key={ci} className="px-3 py-2 border border-gray-200">{c}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* HTML Output */}
      <div>
        <div className="flex justify-between mb-2">
          <label className="text-sm font-semibold text-gray-700">HTML Code</label>
          <button onClick={() => copy(htmlCode, "html")} className="text-xs text-indigo-600 font-medium hover:underline">
            {copied === "html" ? "Copied!" : "Copy"}
          </button>
        </div>
        <textarea value={htmlCode} readOnly className="calc-input min-h-[120px] font-mono text-xs bg-gray-50" rows={6} />
      </div>

      {/* Markdown Output */}
      <div>
        <div className="flex justify-between mb-2">
          <label className="text-sm font-semibold text-gray-700">Markdown Code</label>
          <button onClick={() => copy(mdCode, "md")} className="text-xs text-indigo-600 font-medium hover:underline">
            {copied === "md" ? "Copied!" : "Copy"}
          </button>
        </div>
        <textarea value={mdCode} readOnly className="calc-input min-h-[100px] font-mono text-xs bg-gray-50" rows={5} />
      </div>
    </div>
  );
}
