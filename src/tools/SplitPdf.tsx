"use client";
import { useState } from "react";

export default function SplitPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [pageRange, setPageRange] = useState("");
  const [pageCount, setPageCount] = useState(0);
  const [fullText, setFullText] = useState("");
  const [splitResult, setSplitResult] = useState("");

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f || f.type !== "application/pdf") return;
    setFile(f);
    setSplitResult("");
    setPageRange("");

    const buffer = await f.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    const raw = new TextDecoder("utf-8", { fatal: false }).decode(bytes);

    const pageMatches = raw.match(/\/Type\s*\/Page[^s]/g);
    const pages = pageMatches ? pageMatches.length : Math.max(1, Math.ceil(f.size / 3000));
    setPageCount(pages);

    // Extract text
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

  const parseRanges = (input: string, maxPage: number): number[] => {
    const pages = new Set<number>();
    const parts = input.split(",").map((s) => s.trim());
    for (const part of parts) {
      if (part.includes("-")) {
        const [startStr, endStr] = part.split("-").map((s) => s.trim());
        const start = parseInt(startStr);
        const end = parseInt(endStr);
        if (!isNaN(start) && !isNaN(end)) {
          for (let i = Math.max(1, start); i <= Math.min(maxPage, end); i++) {
            pages.add(i);
          }
        }
      } else {
        const p = parseInt(part);
        if (!isNaN(p) && p >= 1 && p <= maxPage) {
          pages.add(p);
        }
      }
    }
    return Array.from(pages).sort((a, b) => a - b);
  };

  const handleSplit = () => {
    if (!fullText || !pageRange.trim()) return;
    const selectedPages = parseRanges(pageRange, pageCount);
    if (selectedPages.length === 0) {
      setSplitResult("No valid pages selected.");
      return;
    }

    // Estimate page boundaries by dividing text evenly
    const lines = fullText.split("\n");
    const linesPerPage = Math.max(1, Math.ceil(lines.length / pageCount));
    const portions: string[] = [];

    for (const page of selectedPages) {
      const start = (page - 1) * linesPerPage;
      const end = start + linesPerPage;
      const pageLines = lines.slice(start, end);
      if (pageLines.length > 0) {
        portions.push(`--- Page ${page} ---\n${pageLines.join("\n")}`);
      }
    }

    setSplitResult(portions.join("\n\n"));
  };

  const downloadSplit = () => {
    if (!splitResult) return;
    const blob = new Blob([splitResult], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = (file?.name.replace(".pdf", "") || "split") + "-pages.txt";
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
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">
            Page Ranges to Extract (e.g., &quot;1-3, 5, 7-10&quot;)
          </label>
          <input
            type="text"
            placeholder="1-3, 5, 7-10"
            value={pageRange}
            onChange={(e) => setPageRange(e.target.value)}
            className="calc-input"
          />
          <p className="text-xs text-gray-500 mt-1">
            Available pages: 1 to {pageCount}
          </p>
        </div>
      )}

      {file && (
        <div className="flex gap-3">
          <button onClick={handleSplit} disabled={!pageRange.trim()} className="btn-primary disabled:opacity-50">
            Split PDF
          </button>
        </div>
      )}

      {splitResult && (
        <>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">Split Result</label>
            <textarea
              value={splitResult}
              readOnly
              rows={10}
              className="calc-input font-mono text-sm"
            />
          </div>
          <div className="flex gap-3">
            <button onClick={downloadSplit} className="btn-primary">Download Split Text</button>
            <button onClick={() => navigator.clipboard.writeText(splitResult)} className="btn-secondary">
              Copy
            </button>
          </div>
        </>
      )}

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        <strong>Note:</strong> Client-side PDF splitting extracts text content by estimated page boundaries. For exact page-level splitting preserving layout and images, a server-side library (like pdf-lib) is required.
      </div>
    </div>
  );
}
