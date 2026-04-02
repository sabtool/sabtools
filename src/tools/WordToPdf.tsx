"use client";
import { useState } from "react";

export default function WordToPdf() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const generatePdf = () => {
    if (!content.trim()) return;

    const lines = content.split("\n");
    const pageHeight = 792;
    const pageWidth = 612;
    const margin = 72;
    const lineHeight = 14;
    const maxLineWidth = pageWidth - 2 * margin;
    const charsPerLine = Math.floor(maxLineWidth / 6.6);

    // Word-wrap lines
    const wrappedLines: string[] = [];
    if (title.trim()) {
      wrappedLines.push("__TITLE__" + title.trim());
      wrappedLines.push("");
    }
    for (const line of lines) {
      if (line.length <= charsPerLine) {
        wrappedLines.push(line);
      } else {
        let remaining = line;
        while (remaining.length > charsPerLine) {
          let breakAt = remaining.lastIndexOf(" ", charsPerLine);
          if (breakAt <= 0) breakAt = charsPerLine;
          wrappedLines.push(remaining.slice(0, breakAt));
          remaining = remaining.slice(breakAt).trimStart();
        }
        if (remaining) wrappedLines.push(remaining);
      }
    }

    const linesPerPage = Math.floor((pageHeight - 2 * margin) / lineHeight);
    const pages: string[][] = [];
    for (let i = 0; i < wrappedLines.length; i += linesPerPage) {
      pages.push(wrappedLines.slice(i, i + linesPerPage));
    }
    if (pages.length === 0) pages.push([""]);

    const escapePdf = (s: string) =>
      s.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");

    const objects: string[] = [];
    let objCount = 0;

    const addObj = (content: string) => {
      objCount++;
      objects.push(content);
      return objCount;
    };

    // Obj 1: Catalog
    addObj("1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj");

    // Obj 2: Pages (placeholder)
    addObj("");

    // Obj 3: Font
    addObj("3 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj");

    // Obj 4: Bold Font
    addObj("4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj");

    const pageObjIds: number[] = [];
    for (const pageLines of pages) {
      let textContent = "BT\n/F1 11 Tf\n";
      let y = pageHeight - margin;
      for (const line of pageLines) {
        if (line.startsWith("__TITLE__")) {
          const titleText = line.replace("__TITLE__", "");
          textContent += `/F2 16 Tf\n${margin} ${y} Td\n(${escapePdf(titleText)}) Tj\n0 -${lineHeight * 1.5} Td\n/F1 11 Tf\n`;
          y -= lineHeight * 1.5;
        } else {
          textContent += `${margin} ${y} Td\n(${escapePdf(line)}) Tj\n0 -${lineHeight} Td\n`;
          y -= lineHeight;
        }
      }
      textContent += "ET";

      const streamObj = addObj(
        `${objCount + 1} 0 obj\n<< /Length ${textContent.length} >>\nstream\n${textContent}\nendstream\nendobj`
      );

      // Fix: re-assign correct obj number
      objects[streamObj - 1] = `${streamObj} 0 obj\n<< /Length ${textContent.length} >>\nstream\n${textContent}\nendstream\nendobj`;

      const pageObj = addObj("");
      objects[pageObj - 1] = `${pageObj} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Contents ${streamObj} 0 R /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> >>\nendobj`;
      pageObjIds.push(pageObj);
    }

    // Fix Pages object
    const kidsStr = pageObjIds.map((id) => `${id} 0 R`).join(" ");
    objects[1] = `2 0 obj\n<< /Type /Pages /Kids [${kidsStr}] /Count ${pageObjIds.length} >>\nendobj`;

    // Build PDF
    let pdf = "%PDF-1.4\n";
    const offsets: number[] = [];
    for (let i = 0; i < objects.length; i++) {
      offsets.push(pdf.length);
      pdf += objects[i] + "\n";
    }
    const xrefOffset = pdf.length;
    pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
    for (const off of offsets) {
      pdf += off.toString().padStart(10, "0") + " 00000 n \n";
    }
    pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

    const blob = new Blob([pdf], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = (title.trim() || "document") + ".pdf";
    a.click();
    URL.revokeObjectURL(url);
  };

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const lineCount = content ? content.split("\n").length : 0;

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Document Title</label>
        <input
          type="text"
          placeholder="Enter document title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="calc-input"
        />
      </div>

      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={14}
          placeholder="Type or paste your text content here..."
          className="calc-input font-mono text-sm"
        />
      </div>

      {content && (
        <div className="result-card">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-xs text-gray-500">Words</div>
              <div className="text-sm font-bold text-gray-800">{wordCount.toLocaleString("en-IN")}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Characters</div>
              <div className="text-sm font-bold text-gray-800">{content.length.toLocaleString("en-IN")}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Lines</div>
              <div className="text-sm font-bold text-gray-800">{lineCount}</div>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={generatePdf}
        disabled={!content.trim()}
        className="btn-primary disabled:opacity-50"
      >
        Generate & Download PDF
      </button>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
        <strong>Tip:</strong> The generated PDF uses Helvetica font with standard formatting. For advanced formatting (tables, images, custom fonts), a server-side solution would be needed.
      </div>
    </div>
  );
}
