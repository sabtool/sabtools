"use client";
import { useState, useMemo } from "react";

export default function JsonToTableViewer() {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [filter, setFilter] = useState("");

  const parsed = useMemo(() => {
    if (!input.trim()) return { columns: [] as string[], rows: [] as Record<string, string>[] };
    try {
      const data = JSON.parse(input);
      const arr = Array.isArray(data) ? data : [data];
      if (arr.length === 0) { setError("Empty array"); return { columns: [], rows: [] }; }
      const cols = new Set<string>();
      arr.forEach(item => {
        if (typeof item === "object" && item !== null) Object.keys(item).forEach(k => cols.add(k));
      });
      const columns = Array.from(cols);
      const rows = arr.map(item => {
        const row: Record<string, string> = {};
        columns.forEach(col => {
          const val = item?.[col];
          row[col] = val === undefined || val === null ? "" : typeof val === "object" ? JSON.stringify(val) : String(val);
        });
        return row;
      });
      setError("");
      return { columns, rows };
    } catch (e: unknown) {
      setError((e as Error).message);
      return { columns: [], rows: [] };
    }
  }, [input]);

  const filteredRows = useMemo(() => {
    let r = parsed.rows;
    if (filter) {
      const low = filter.toLowerCase();
      r = r.filter(row => Object.values(row).some(v => v.toLowerCase().includes(low)));
    }
    if (sortCol) {
      r = [...r].sort((a, b) => {
        const va = a[sortCol] || "", vb = b[sortCol] || "";
        const na = parseFloat(va), nb = parseFloat(vb);
        if (!isNaN(na) && !isNaN(nb)) return sortAsc ? na - nb : nb - na;
        return sortAsc ? va.localeCompare(vb) : vb.localeCompare(va);
      });
    }
    return r;
  }, [parsed.rows, filter, sortCol, sortAsc]);

  const handleSort = (col: string) => {
    if (sortCol === col) setSortAsc(!sortAsc);
    else { setSortCol(col); setSortAsc(true); }
  };

  const exportCsv = () => {
    const { columns } = parsed;
    if (columns.length === 0) return;
    const escape = (v: string) => v.includes(",") || v.includes('"') || v.includes("\n") ? `"${v.replace(/"/g, '""')}"` : v;
    const csv = [columns.map(escape).join(","), ...filteredRows.map(r => columns.map(c => escape(r[c] || "")).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `json-table-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Paste JSON (array of objects)</label>
        <textarea value={input} onChange={e => setInput(e.target.value)} className="calc-input min-h-[150px] font-mono text-sm" rows={6} placeholder={'[{"name":"John","age":30,"city":"Mumbai"},{"name":"Jane","age":25,"city":"Delhi"}]'} />
      </div>

      {error && <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600">{error}</div>}

      {parsed.columns.length > 0 && (
        <>
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex gap-3 text-sm">
              <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full">{parsed.rows.length} rows</span>
              <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full">{parsed.columns.length} columns</span>
              {filter && <span className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full">{filteredRows.length} matching</span>}
            </div>
            <div className="flex-1 min-w-[200px]">
              <input value={filter} onChange={e => setFilter(e.target.value)} className="calc-input !py-1.5 text-sm" placeholder="Search / filter rows..." />
            </div>
            <button onClick={exportCsv} className="btn-primary text-xs !py-1.5">Export CSV</button>
          </div>

          <div className="result-card overflow-x-auto max-h-[500px] overflow-y-auto">
            <table className="w-full border-collapse text-xs">
              <thead className="sticky top-0 z-10">
                <tr>
                  <th className="bg-gray-100 px-2 py-1.5 border border-gray-200 text-gray-500 w-8">#</th>
                  {parsed.columns.map(col => (
                    <th key={col} onClick={() => handleSort(col)} className="bg-indigo-50 text-indigo-700 px-2 py-1.5 border border-gray-200 cursor-pointer hover:bg-indigo-100 whitespace-nowrap text-left">
                      {col} {sortCol === col ? (sortAsc ? "↑" : "↓") : ""}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row, ri) => (
                  <tr key={ri} className={ri % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-2 py-1 border border-gray-200 text-gray-400 text-center">{ri + 1}</td>
                    {parsed.columns.map(col => (
                      <td key={col} className="px-2 py-1 border border-gray-200 max-w-[300px] truncate" title={row[col]}>{row[col]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
