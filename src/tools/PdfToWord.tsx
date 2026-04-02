"use client";
import { useState } from "react";

export default function PdfToWord() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageEstimate, setPageEstimate] = useState(0);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f || f.type !== "application/pdf") return;
    setFile(f);
    setLoading(true);
    setText("");
    try {
      const buffer = await f.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      const raw = new TextDecoder("utf-8", { fatal: false }).decode(bytes);

      // Count pages from PDF structure
      const pageMatches = raw.match(/\/Type\s*\/Page[^s]/g);
      const pages = pageMatches ? pageMatches.length : Math.max(1, Math.ceil(f.size / 3000));
      setPageEstimate(pages);

      // Extract readable text between BT/ET blocks and parentheses
      const extracted: string[] = [];
      // Method 1: text in parentheses within BT..ET
      const btBlocks = raw.match(/BT[\s\S]*?ET/g) || [];
      for (const block of btBlocks) {
        const parts = block.match(/\(([^)]*)\)/g) || [];
        for (const p of parts) {
          const inner = p.slice(1, -1);
          if (inner.trim().length > 0) {
            extracted.push(inner);
          }
        }
      }

      // Method 2: standalone text in stream blocks
      if (extracted.length === 0) {
        const streams = raw.match(/stream[\s\S]*?endstream/g) || [];
        for (const s of streams) {
          const readable = s.replace(/stream|endstream/g, "")
            .replace(/[^\x20-\x7E\n\r\t]/g, " ")
            .replace(/\s+/g, " ")
            .trim();
          if (readable.length > 20) {
            extracted.push(readable);
          }
        }
      }

      const result = extracted.length > 0
        ? extracted.join("\n")
        : "Could not extract readable text from this PDF. The PDF may contain scanned images or use encoded fonts. For best results, try PDFs with selectable text.";
      setText(result);
    } catch {
      setText("Error reading PDF file. Please try another file.");
    }
    setLoading(false);
  };

  const downloadTxt = () => {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = (file?.name.replace(".pdf", "") || "extracted") + ".txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Upload PDF File</label>
        <input
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFile}
          className="calc-input"
        />
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
              <div className="text-sm font-bold text-indigo-600">{pageEstimate}</div>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="text-center py-4 text-gray-500">Extracting text from PDF...</div>
      )}

      {text && (
        <>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">
              Extracted Text ({text.length.toLocaleString("en-IN")} characters)
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={12}
              className="calc-input font-mono text-sm"
            />
          </div>
          <div className="flex gap-3">
            <button onClick={downloadTxt} className="btn-primary">
              Download as .txt
            </button>
            <button onClick={() => navigator.clipboard.writeText(text)} className="btn-secondary">
              Copy Text
            </button>
          </div>
        </>
      )}

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        <strong>Note:</strong> Client-side PDF text extraction works best with text-based PDFs. Scanned PDFs or those with embedded fonts may not extract properly. For full document conversion, a server-side solution is recommended.
      </div>
    </div>
  );
}
