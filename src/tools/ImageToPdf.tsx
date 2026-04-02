"use client";
import { useState, useRef } from "react";

interface ImageItem {
  file: File;
  url: string;
  id: string;
  width: number;
  height: number;
}

type PageSize = "A4" | "Letter" | "Legal";

const pageSizes: Record<PageSize, { w: number; h: number; label: string }> = {
  A4: { w: 595.28, h: 841.89, label: "A4 (210 x 297 mm)" },
  Letter: { w: 612, h: 792, label: "Letter (8.5 x 11 in)" },
  Legal: { w: 612, h: 1008, label: "Legal (8.5 x 14 in)" },
};

export default function ImageToPdf() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [pageSize, setPageSize] = useState<PageSize>("A4");
  const [generating, setGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newImages: ImageItem[] = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      if (!f.type.startsWith("image/")) continue;
      const url = URL.createObjectURL(f);
      const dims = await getImageDimensions(url);
      newImages.push({ file: f, url, id: Date.now() + "-" + i, ...dims });
    }
    setImages((prev) => [...prev, ...newImages]);
    e.target.value = "";
  };

  const getImageDimensions = (url: string): Promise<{ width: number; height: number }> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve({ width: img.width, height: img.height });
      img.onerror = () => resolve({ width: 0, height: 0 });
      img.src = url;
    });
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item) URL.revokeObjectURL(item.url);
      return prev.filter((i) => i.id !== id);
    });
  };

  const moveImage = (index: number, direction: "up" | "down") => {
    const newImages = [...images];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newImages.length) return;
    [newImages[index], newImages[swapIndex]] = [newImages[swapIndex], newImages[index]];
    setImages(newImages);
  };

  const generatePdf = async () => {
    if (images.length === 0) return;
    setGenerating(true);

    try {
      const size = pageSizes[pageSize];
      const margin = 36;
      const canvas = canvasRef.current || document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      const scale = 2; // Higher resolution

      // Generate each page as JPEG, then build PDF
      const pageJpegs: string[] = [];

      for (const img of images) {
        canvas.width = size.w * scale;
        canvas.height = size.h * scale;
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const image = new Image();
        await new Promise<void>((resolve) => {
          image.onload = () => resolve();
          image.onerror = () => resolve();
          image.src = img.url;
        });

        // Fit image within page margins
        const maxW = (size.w - 2 * margin) * scale;
        const maxH = (size.h - 2 * margin) * scale;
        const ratio = Math.min(maxW / image.width, maxH / image.height, 1);
        const drawW = image.width * ratio;
        const drawH = image.height * ratio;
        const x = (canvas.width - drawW) / 2;
        const y = (canvas.height - drawH) / 2;
        ctx.drawImage(image, x, y, drawW, drawH);

        pageJpegs.push(canvas.toDataURL("image/jpeg", 0.85));
      }

      // Build minimal PDF with JPEG images
      let pdf = "%PDF-1.4\n";
      const objs: { offset: number; content: string }[] = [];
      let objNum = 0;

      const addObj = (content: string) => {
        objNum++;
        objs.push({ offset: 0, content: `${objNum} 0 obj\n${content}\nendobj\n` });
        return objNum;
      };

      // Catalog
      addObj("<< /Type /Catalog /Pages 2 0 R >>");
      // Pages placeholder
      addObj("");

      const pageRefs: number[] = [];
      const imgObjRefs: number[] = [];

      for (let i = 0; i < pageJpegs.length; i++) {
        const dataUrl = pageJpegs[i];
        const base64 = dataUrl.split(",")[1];
        const binaryStr = atob(base64);
        const imgBytes = new Uint8Array(binaryStr.length);
        for (let j = 0; j < binaryStr.length; j++) {
          imgBytes[j] = binaryStr.charCodeAt(j);
        }

        // Image XObject
        const imgRef = addObj(
          `<< /Type /XObject /Subtype /Image /Width ${Math.round(size.w * 2)} /Height ${Math.round(size.h * 2)} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${imgBytes.length} >>\nstream\n` +
          String.fromCharCode(...imgBytes) +
          "\nendstream"
        );
        imgObjRefs.push(imgRef);

        // Page content stream
        const streamContent = `q ${size.w} 0 0 ${size.h} 0 0 cm /Img${i} Do Q`;
        const contentRef = addObj(
          `<< /Length ${streamContent.length} >>\nstream\n${streamContent}\nendstream`
        );

        // Page
        const pageRef = addObj(
          `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${size.w} ${size.h}] /Contents ${contentRef} 0 R /Resources << /XObject << /Img${i} ${imgRef} 0 R >> >> >>`
        );
        pageRefs.push(pageRef);
      }

      // Fix pages object
      const kids = pageRefs.map((r) => `${r} 0 R`).join(" ");
      objs[1].content = `2 0 obj\n<< /Type /Pages /Kids [${kids}] /Count ${pageRefs.length} >>\nendobj\n`;

      // Build final PDF string
      for (const obj of objs) {
        obj.offset = pdf.length;
        pdf += obj.content;
      }

      const xrefOffset = pdf.length;
      pdf += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n`;
      for (const obj of objs) {
        pdf += obj.offset.toString().padStart(10, "0") + " 00000 n \n";
      }
      pdf += `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

      // Convert to binary blob properly
      const pdfBytes = new Uint8Array(pdf.length);
      for (let i = 0; i < pdf.length; i++) {
        pdfBytes[i] = pdf.charCodeAt(i) & 0xff;
      }

      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "images-to-pdf.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Error generating PDF. Please try with fewer or smaller images.");
    }
    setGenerating(false);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
  };

  return (
    <div className="space-y-6">
      <canvas ref={canvasRef} style={{ display: "none" }} />

      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Upload Images</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFiles}
          className="calc-input"
        />
      </div>

      {images.length > 0 && (
        <>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">Page Size</label>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(e.target.value as PageSize)}
              className="calc-input"
            >
              {Object.entries(pageSizes).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
            </select>
          </div>

          <div className="result-card text-center">
            <div className="text-xs text-gray-500">Total Images</div>
            <div className="text-2xl font-bold text-indigo-600">{images.length}</div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {images.map((img, i) => (
              <div key={img.id} className="bg-gray-50 rounded-xl border border-gray-100 p-2 text-center">
                <img
                  src={img.url}
                  alt={img.file.name}
                  className="w-full h-24 object-contain rounded-lg mb-2"
                />
                <div className="text-xs text-gray-600 truncate">{img.file.name}</div>
                <div className="text-xs text-gray-400">{formatSize(img.file.size)}</div>
                <div className="flex gap-1 mt-2 justify-center">
                  <button
                    onClick={() => moveImage(i, "up")}
                    disabled={i === 0}
                    className="btn-secondary text-xs px-2 py-0.5 disabled:opacity-30"
                  >
                    &larr;
                  </button>
                  <button
                    onClick={() => moveImage(i, "down")}
                    disabled={i === images.length - 1}
                    className="btn-secondary text-xs px-2 py-0.5 disabled:opacity-30"
                  >
                    &rarr;
                  </button>
                  <button
                    onClick={() => removeImage(img.id)}
                    className="text-xs px-2 py-0.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 border border-red-200"
                  >
                    X
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={generatePdf}
              disabled={generating}
              className="btn-primary disabled:opacity-50"
            >
              {generating ? "Generating PDF..." : "Convert to PDF & Download"}
            </button>
            <button onClick={() => { images.forEach((i) => URL.revokeObjectURL(i.url)); setImages([]); }} className="btn-secondary">
              Clear All
            </button>
          </div>
        </>
      )}
    </div>
  );
}
