"use client";
import { useState, useMemo, useRef } from "react";

export default function CsvViewerEditor() {
  const [rawCsv, setRawCsv] = useState("");
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<string[][]>([]);
  const [sortCol, setSortCol] = useState<number | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [filter, setFilter] = useState("");
  const [visibleCount, setVisibleCount] = useState(100);
  const fileRef = useRef<HTMLInputElement>(null);

  const parseCsv = (text: string) => {
    const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) { setHeaders([]); setRows([]); return; }
    const parse = (line: string) => {
      const result: string[] = [];
      let current = "";
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"') {
          if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
          else inQuotes = !inQuotes;
        } else if (ch === "," && !inQuotes) { result.push(current); current = ""; }
        else current += ch;
      }
      result.push(current);
      return result;
    };
    setHeaders(parse(lines[0]));
    setRows(lines.slice(1).map(parse));
    setVisibleCount(100);
  };

  const handlePaste = (text: string) => {
    setRawCsv(text);
    parseCsv(text);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      setRawCsv(text);
      parseCsv(text);
    };
    reader.readAsText(file);
  };

  const filteredRows = useMemo(() => {
    let r = rows;
    if (filter) {
      const low = filter.toLowerCase();
      r = r.filter(row => row.some(c => c.toLowerCase().includes(low)));
    }
    if (sortCol !== null) {
      r = [...r].sort((a, b) => {
        const va = a[sortCol] || "", vb = b[sortCol] || "";
        const na = parseFloat(va), nb = parseFloat(vb);
        if (!isNaN(na) && !isNaN(nb)) return sortAsc ? na - nb : nb - na;
        return sortAsc ? va.localeCompare(vb) : vb.localeCompare(va);
      });
    }
    return r;
  }, [rows, filter, sortCol, sortAsc]);

  const visibleRows = useMemo(() => filteredRows.slice(0, visibleCount), [filteredRows, visibleCount]);

  const handleSort = (col: number) => {
    if (sortCol === col) setSortAsc(!sortAsc);
    else { setSortCol(col); setSortAsc(true); }
  };

  const updateCell = (ri: number, ci: number, val: string) => {
    const actualIndex = rows.indexOf(filteredRows[ri]);
    if (actualIndex === -1) return;
    const copy = rows.map(r => [...r]);
    copy[actualIndex][ci] = val;
    setRows(copy);
  };

  const addRow = () => setRows([...rows, headers.map(() => "")]);
  const deleteRow = (ri: number) => {
    const actualIndex = rows.indexOf(filteredRows[ri]);
    if (actualIndex === -1) return;
    setRows(rows.filter((_, i) => i !== actualIndex));
  };

  const addColumn = () => {
    const name = `Column ${headers.length + 1}`;
    setHeaders([...headers, name]);
    setRows(rows.map(r => [...r, ""]));
  };

  const deleteColumn = (ci: number) => {
    setHeaders(headers.filter((_, i) => i !== ci));
    setRows(rows.map(r => r.filter((_, i) => i !== ci)));
  };

  const exportCsv = () => {
    const escape = (v: string) => v.includes(",") || v.includes('"') || v.includes("\n") ? `"${v.replace(/"/g, '""')}"` : v;
    const csv = [headers.map(escape).join(","), ...rows.map(r => r.map(escape).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `data-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Input */}
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Upload CSV or Paste Data</label>
        <div className="flex gap-3 flex-wrap mb-3">
          <input ref={fileRef} type="file" accept=".csv,.tsv,.txt" onChange={handleFile} className="hidden" />
          <button onClick={() => fileRef.current?.click()} className="btn-primary text-sm !py-2 !px-5">Upload CSV File</button>
        </div>
        <textarea
          value={rawCsv}
          onChange={e => handlePaste(e.target.value)}
          className="calc-input min-h-[100px] font-mono text-xs"
          rows={4}
          placeholder={"name,age,city\nJohn,30,Mumbai\nJane,25,Delhi"}
        />
        <button onClick={() => parseCsv(rawCsv)} className="btn-secondary text-xs mt-2 !py-1.5 !px-3">Parse CSV</button>
      </div>

      {headers.length > 0 && (
        <>
          {/* Stats */}
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full">{rows.length} rows</span>
            <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full">{headers.length} columns</span>
            {filter && <span className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full">{filteredRows.length} matching</span>}
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="text-xs font-semibold text-gray-600 block mb-1">Search / Filter</label>
              <input value={filter} onChange={e => setFilter(e.target.value)} className="calc-input !py-1.5 text-sm" placeholder="Type to filter rows..." />
            </div>
            <button onClick={addRow} className="btn-secondary text-xs !py-1.5">+ Row</button>
            <button onClick={addColumn} className="btn-secondary text-xs !py-1.5">+ Column</button>
            <button onClick={exportCsv} className="btn-primary text-xs !py-1.5">Export CSV</button>
          </div>

          {/* Table */}
          <div className="result-card overflow-x-auto max-h-[500px] overflow-y-auto">
            <table className="w-full border-collapse text-xs">
              <thead className="sticky top-0 z-10">
                <tr>
                  <th className="bg-gray-100 px-2 py-1.5 border border-gray-200 text-gray-500 w-8">#</th>
                  {headers.map((h, i) => (
                    <th key={i} className="bg-indigo-50 text-indigo-700 px-2 py-1.5 border border-gray-200 cursor-pointer hover:bg-indigo-100 whitespace-nowrap" onClick={() => handleSort(i)}>
                      {h} {sortCol === i ? (sortAsc ? "↑" : "↓") : ""}
                      <button onClick={(e) => { e.stopPropagation(); deleteColumn(i); }} className="ml-1 text-red-400 hover:text-red-600">&times;</button>
                    </th>
                  ))}
                  <th className="bg-gray-100 px-2 py-1.5 border border-gray-200 w-8"></th>
                </tr>
              </thead>
              <tbody>
                {visibleRows.map((row, ri) => (
                  <tr key={ri} className={ri % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-2 py-1 border border-gray-200 text-gray-400 text-center">{ri + 1}</td>
                    {row.map((cell, ci) => (
                      <td key={ci} className="border border-gray-200 p-0">
                        <input value={cell} onChange={e => updateCell(ri, ci, e.target.value)} className="w-full px-2 py-1 text-xs border-0 outline-none focus:bg-indigo-50 bg-transparent" />
                      </td>
                    ))}
                    <td className="px-1 py-1 border border-gray-200 text-center">
                      <button onClick={() => deleteRow(ri)} className="text-red-400 hover:text-red-600 text-sm">&times;</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredRows.length > visibleCount && (
              <button onClick={() => setVisibleCount(v => v + 100)} className="w-full py-2 text-center text-sm text-indigo-600 hover:text-indigo-800 font-medium mt-2">
                Load More ({filteredRows.length - visibleCount} remaining)
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
