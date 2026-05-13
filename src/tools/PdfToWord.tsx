"use client";
import { useState, useRef, useCallback } from "react";

export default function PdfToWord() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageEstimate, setPageEstimate] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  const isAcceptedFile = (f: File): boolean => {
    if (f.type === "application/pdf") return true;
    const ext = f.name.split(".").pop()?.toLowerCase() || "";
    return ext === "pdf";
  };

  const processFile = useCallback(async (f: File) => {
    if (!isAcceptedFile(f)) {
      setUploadError(`"${f.name}" is not a supported file. Accepted: PDF.`);
      return;
    }
    setUploadError("");
    setFile(f);
    setLoading(true);
    setText("");
    try {
      const buffer = await f.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      const raw = new TextDecoder("utf-8", { fatal: false }).decode(bytes);

      const pageMatches = raw.match(/\/Type\s*\/Page[^s]/g);
      const pages = pageMatches ? pageMatches.length : Math.max(1, Math.ceil(f.size / 3000));
      setPageEstimate(pages);

      const extracted: string[] = [];
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
  }, []);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) processFile(f);
  };

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current += 1;
    if (e.dataTransfer?.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current <= 0) {
      dragCounter.current = 0;
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter.current = 0;
      setIsDragging(false);
      const f = e.dataTransfer?.files?.[0];
      if (f) processFile(f);
    },
    [processFile]
  );

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
        <div
          onClick={() => inputRef.current?.click()}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          role="button"
          tabIndex={0}
          aria-label="Drop a PDF here or click to upload"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition ${
            isDragging
              ? "border-purple-500 bg-purple-50 scale-[1.01] shadow-md"
              : "border-gray-300 hover:border-indigo-400 hover:bg-indigo-50/30"
          }`}
        >
          <div className="text-4xl mb-2">{isDragging ? "⬇️" : "📄"}</div>
          <div className="text-sm font-semibold text-gray-700">
            {isDragging ? "Drop your PDF here" : "Drag & drop your PDF, or click to upload"}
          </div>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFile}
            className="hidden"
          />
        </div>
        {uploadError && (
          <div className="mt-3 bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm">
            ❌ {uploadError}
          </div>
        )}
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
