"use client";
import { useState } from "react";

export default function PdfToImage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [extractedText, setExtractedText] = useState("");

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(2) + " MB";
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f || f.type !== "application/pdf") return;
    setFile(f);
    setExtractedText("");

    const buffer = await f.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    const raw = new TextDecoder("utf-8", { fatal: false }).decode(bytes);

    const pageMatches = raw.match(/\/Type\s*\/Page[^s]/g);
    const pages = pageMatches ? pageMatches.length : Math.max(1, Math.ceil(f.size / 3000));
    setPageCount(pages);

    // Extract text as fallback content
    const extracted: string[] = [];
    const btBlocks = raw.match(/BT[\s\S]*?ET/g) || [];
    for (const block of btBlocks) {
      const parts = block.match(/\(([^)]*)\)/g) || [];
      for (const p of parts) {
        const inner = p.slice(1, -1).trim();
        if (inner.length > 0) extracted.push(inner);
      }
    }
    setExtractedText(extracted.join("\n") || "No extractable text found in this PDF.");
  };

  const downloadText = () => {
    if (!extractedText) return;
    const blob = new Blob([extractedText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = (file?.name.replace(".pdf", "") || "pdf") + "-text.txt";
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
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-3">
          <h3 className="text-sm font-bold text-blue-800">How to Convert PDF to Images</h3>
          <p className="text-sm text-blue-700">
            Converting PDF pages to images requires rendering the PDF, which needs specialized libraries. Here are your options:
          </p>
          <ul className="text-sm text-blue-700 list-disc pl-5 space-y-1">
            <li><strong>Built-in (Mac):</strong> Open in Preview &rarr; File &rarr; Export &rarr; Choose PNG/JPEG</li>
            <li><strong>Built-in (Windows):</strong> Open in Microsoft Edge &rarr; Print &rarr; Save as Image</li>
            <li><strong>Free Online:</strong> Use smallpdf.com or ilovepdf.com for server-side conversion</li>
            <li><strong>Developer:</strong> Use pdf.js or pdf-to-img libraries for programmatic conversion</li>
          </ul>
          <p className="text-sm text-blue-700">
            As a fallback, you can extract the text content from your PDF below.
          </p>
        </div>
      )}

      {extractedText && (
        <>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">
              Extracted Text Content
            </label>
            <textarea
              value={extractedText}
              readOnly
              rows={10}
              className="calc-input font-mono text-sm"
            />
          </div>
          <div className="flex gap-3">
            <button onClick={downloadText} className="btn-primary">Download Text</button>
            <button onClick={() => navigator.clipboard.writeText(extractedText)} className="btn-secondary">
              Copy Text
            </button>
          </div>
        </>
      )}

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        <strong>Note:</strong> Full PDF-to-image conversion requires rendering each page, which needs a PDF rendering engine (like pdf.js). This tool provides file info and text extraction as a client-side alternative.
      </div>
    </div>
  );
}
