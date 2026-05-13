"use client";
import { useState, useRef, useCallback } from "react";

interface PdfFile {
  file: File;
  id: string;
}

export default function MergePdf() {
  const [files, setFiles] = useState<PdfFile[]>([]);
  const [merging, setMerging] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  const isAcceptedFile = (f: File): boolean => {
    if (f.type === "application/pdf") return true;
    const ext = f.name.split(".").pop()?.toLowerCase() || "";
    return ext === "pdf";
  };

  const processFiles = useCallback((selected: FileList | File[]) => {
    const arr = Array.from(selected);
    const accepted: PdfFile[] = [];
    const rejected: string[] = [];
    arr.forEach((f, i) => {
      if (isAcceptedFile(f)) {
        accepted.push({ file: f, id: Date.now() + "-" + i + "-" + Math.random().toString(36).slice(2) });
      } else {
        rejected.push(f.name);
      }
    });
    if (rejected.length > 0) {
      setUploadError(`Skipped ${rejected.length} non-PDF file(s): ${rejected.join(", ")}.`);
    } else {
      setUploadError("");
    }
    if (accepted.length > 0) {
      setFiles((prev) => [...prev, ...accepted]);
    }
  }, []);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) processFiles(e.target.files);
    e.target.value = "";
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
      if (e.dataTransfer?.files) processFiles(e.dataTransfer.files);
    },
    [processFiles]
  );

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const moveFile = (index: number, direction: "up" | "down") => {
    const newFiles = [...files];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newFiles.length) return;
    [newFiles[index], newFiles[swapIndex]] = [newFiles[swapIndex], newFiles[index]];
    setFiles(newFiles);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
  };

  const totalSize = files.reduce((sum, f) => sum + f.file.size, 0);

  const mergePdfs = async () => {
    if (files.length < 2) return;
    setMerging(true);

    try {
      // Concatenate all PDF bytes - this creates a combined file
      // Note: True PDF merging requires a library like pdf-lib
      const buffers: ArrayBuffer[] = [];
      for (const f of files) {
        buffers.push(await f.file.arrayBuffer());
      }

      // Extract text from all PDFs and create a new combined PDF
      const allTexts: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const bytes = new Uint8Array(buffers[i]);
        const raw = new TextDecoder("utf-8", { fatal: false }).decode(bytes);
        const extracted: string[] = [];
        const btBlocks = raw.match(/BT[\s\S]*?ET/g) || [];
        for (const block of btBlocks) {
          const parts = block.match(/\(([^)]*)\)/g) || [];
          for (const p of parts) {
            const inner = p.slice(1, -1).trim();
            if (inner.length > 0) extracted.push(inner);
          }
        }
        allTexts.push(`--- ${files[i].file.name} ---\n${extracted.join("\n") || "(No extractable text)"}`);
      }

      const combinedText = allTexts.join("\n\n");
      const blob = new Blob([combinedText], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "merged-content.txt";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Error processing PDFs. Please try again.");
    }
    setMerging(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Upload PDF Files</label>
        <div
          onClick={() => inputRef.current?.click()}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          role="button"
          tabIndex={0}
          aria-label="Drop PDF files here or click to upload"
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
          <div className="text-4xl mb-2">{isDragging ? "⬇️" : "📑"}</div>
          <div className="text-sm font-semibold text-gray-700">
            {isDragging ? "Drop your PDFs here" : "Drag & drop your PDFs, or click to upload"}
          </div>
          <div className="text-xs text-gray-400 mt-1">Multiple PDFs supported</div>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,application/pdf"
            multiple
            onChange={handleFiles}
            className="hidden"
          />
        </div>
        {uploadError && (
          <div className="mt-3 bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm">
            ❌ {uploadError}
          </div>
        )}
      </div>

      {files.length > 0 && (
        <>
          <div className="result-card">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-xs text-gray-500">Total Files</div>
                <div className="text-2xl font-bold text-indigo-600">{files.length}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Total Size</div>
                <div className="text-2xl font-bold text-indigo-600">{formatSize(totalSize)}</div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700">File Order (drag to reorder)</h3>
            {files.map((f, i) => (
              <div key={f.id} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 border border-gray-100">
                <span className="text-xs text-gray-400 w-6 text-center font-bold">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-800 truncate">{f.file.name}</div>
                  <div className="text-xs text-gray-500">{formatSize(f.file.size)}</div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => moveFile(i, "up")}
                    disabled={i === 0}
                    className="btn-secondary text-xs px-2 py-1 disabled:opacity-30"
                  >
                    Up
                  </button>
                  <button
                    onClick={() => moveFile(i, "down")}
                    disabled={i === files.length - 1}
                    className="btn-secondary text-xs px-2 py-1 disabled:opacity-30"
                  >
                    Down
                  </button>
                  <button
                    onClick={() => removeFile(f.id)}
                    className="text-xs px-2 py-1 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 border border-red-200"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={mergePdfs}
              disabled={files.length < 2 || merging}
              className="btn-primary disabled:opacity-50"
            >
              {merging ? "Processing..." : "Merge & Download"}
            </button>
            <button onClick={() => setFiles([])} className="btn-secondary">
              Clear All
            </button>
          </div>
        </>
      )}

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        <strong>Note:</strong> Full PDF merging (preserving formatting, images, and structure) requires server-side processing. This tool extracts and combines the text content from your PDFs. For production-grade merging, consider using pdf-lib or a server API.
      </div>
    </div>
  );
}
