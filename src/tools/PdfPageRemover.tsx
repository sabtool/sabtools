"use client";
import { useState, useMemo } from "react";

export default function PdfPageRemover() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [removePagesInput, setRemovePagesInput] = useState("");
  const [fullText, setFullText] = useState("");
  const [result, setResult] = useState("");

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(2) + " MB";
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f || f.type !== "application/pdf") return;
    setFile(f);
    setResult("");
    setRemovePagesInput("");

    const buffer = await f.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    const raw = new TextDecoder("utf-8", { fatal: false }).decode(bytes);

    const pageMatches = raw.match(/\/Type\s*\/Page[^s]/g);
    const pages = pageMatches ? pageMatches.length : Math.max(1, Math.ceil(f.size / 3000));
    setPageCount(pages);

    const extracted: string[] = [];
    const btBlocks = raw.match(/BT[\s\S]*?ET/g) || [];
    for (const block of btBlocks) {
      const parts = block.match(/\(([^)]*)\)/g) || [];
      for (const p of parts) {
        const inner = p.slice(1, -1).trim();
        if (inner.length > 0) extracted.push(inner);
      }
    }
    setFullText(extracted.join("\n"));
  };

  const pagesToRemove = useMemo(() => {
    const pages = new Set<number>();
    const parts = removePagesInput.split(",").map((s) => s.trim());
    for (const part of parts) {
      if (part.includes("-")) {
        const [s, e] = part.split("-").map((x) => parseInt(x.trim()));
        if (!isNaN(s) && !isNaN(e)) {
          for (let i = Math.max(1, s); i <= Math.min(pageCount, e); i++) pages.add(i);
        }
      } else {
        const p = parseInt(part);
        if (!isNaN(p) && p >= 1 && p <= pageCount) pages.add(p);
      }
    }
    return Array.from(pages).sort((a, b) => a - b);
  }, [removePagesInput, pageCount]);

  const remainingPages = useMemo(() => {
    const all = Array.from({ length: pageCount }, (_, i) => i + 1);
    return all.filter((p) => !pagesToRemove.includes(p));
  }, [pageCount, pagesToRemove]);

  const processRemoval = () => {
    if (!fullText || remainingPages.length === 0) {
      setResult("No pages remaining after removal.");
      return;
    }

    const lines = fullText.split("\n");
    const linesPerPage = Math.max(1, Math.ceil(lines.length / pageCount));
    const portions: string[] = [];

    for (const page of remainingPages) {
      const start = (page - 1) * linesPerPage;
      const end = start + linesPerPage;
      const pageLines = lines.slice(start, end);
      if (pageLines.length > 0) {
        portions.push(`--- Page ${page} ---\n${pageLines.join("\n")}`);
      }
    }

    setResult(portions.join("\n\n") || "No content extracted from remaining pages.");
  };

  const downloadResult = () => {
    if (!result) return;
    const blob = new Blob([result], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = (file?.name.replace(".pdf", "") || "pdf") + "-pages-removed.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Upload PDF File</label>
        <input type="file" accept=".pdf,application/pdf" onChange={handleFile} className="calc-input" />
      </div>

      {file && (
        <div className="result-card">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-xs text-gray-500">File Name</div>
              <div className="text-sm font-bold text-gray-800 truncate">{file.name}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">File Size</div>
              <div className="text-sm font-bold text-gray-800">{formatSize(file.size)}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Est. Pages</div>
              <div className="text-sm font-bold text-indigo-600">{pageCount}</div>
            </div>
          </div>
        </div>
      )}

      {file && (
        <>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">
              Pages to Remove (e.g., &quot;2, 5, 8&quot; or &quot;2-4, 7&quot;)
            </label>
            <input
              type="text"
              placeholder="2, 5, 8"
              value={removePagesInput}
              onChange={(e) => setRemovePagesInput(e.target.value)}
              className="calc-input"
            />
          </div>

          {removePagesInput && (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                <div className="text-xs text-red-500 font-semibold mb-1">Removing ({pagesToRemove.length})</div>
                <div className="text-sm font-bold text-red-700">
                  {pagesToRemove.length > 0 ? pagesToRemove.join(", ") : "None"}
                </div>
              </div>
              <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                <div className="text-xs text-green-500 font-semibold mb-1">Keeping ({remainingPages.length})</div>
                <div className="text-sm font-bold text-green-700">
                  {remainingPages.length > 0 ? remainingPages.join(", ") : "None"}
                </div>
              </div>
            </div>
          )}

          <button
            onClick={processRemoval}
            disabled={pagesToRemove.length === 0}
            className="btn-primary disabled:opacity-50"
          >
            Remove Pages & Extract
          </button>
        </>
      )}

      {result && (
        <>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">Result</label>
            <textarea value={result} readOnly rows={10} className="calc-input font-mono text-sm" />
          </div>
          <div className="flex gap-3">
            <button onClick={downloadResult} className="btn-primary">Download Result</button>
            <button onClick={() => navigator.clipboard.writeText(result)} className="btn-secondary">Copy</button>
          </div>
        </>
      )}

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        <strong>Note:</strong> This tool extracts text from remaining pages. For exact PDF page removal preserving layout and formatting, server-side processing with pdf-lib is recommended.
      </div>
    </div>
  );
}
