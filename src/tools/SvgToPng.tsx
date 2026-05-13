"use client";
import { useState, useRef, useCallback } from "react";

export default function SvgToPng() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);
  const [svgCode, setSvgCode] = useState("");
  const [width, setWidth] = useState(1024);
  const [height, setHeight] = useState(1024);
  const [bgType, setBgType] = useState<"transparent" | "white">("transparent");
  const [rendered, setRendered] = useState(false);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const isAcceptedFile = (file: File): boolean => {
    if (file.type === "image/svg+xml") return true;
    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    return ext === "svg";
  };

  const processFile = useCallback((file: File) => {
    if (!isAcceptedFile(file)) {
      setUploadError(`"${file.name}" is not a supported file. Accepted: SVG.`);
      return;
    }
    setUploadError("");
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      setSvgCode(text);
    };
    reader.readAsText(file);
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
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
      const file = e.dataTransfer?.files?.[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const renderSvg = useCallback(() => {
    if (!svgCode.trim()) {
      setError("Please provide SVG code or upload an SVG file");
      return;
    }
    setError("");

    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear with background
    if (bgType === "white") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
    } else {
      ctx.clearRect(0, 0, width, height);
    }

    const img = new Image();
    const blob = new Blob([svgCode], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    img.onload = () => {
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
      setRendered(true);
    };

    img.onerror = () => {
      setError("Failed to render SVG. Please check the SVG code is valid.");
      URL.revokeObjectURL(url);
    };

    img.src = url;
  }, [svgCode, width, height, bgType]);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "svg-converted.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Upload SVG File</label>
        <div
          onClick={() => inputRef.current?.click()}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          role="button"
          tabIndex={0}
          aria-label="Drop an SVG file here or click to upload"
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
          <div className="text-4xl mb-2">{isDragging ? "⬇️" : "🎨"}</div>
          <div className="text-sm font-semibold text-gray-700">
            {isDragging ? "Drop your SVG file here" : "Drag & drop your SVG file, or click to upload"}
          </div>
          <input ref={inputRef} type="file" accept=".svg" onChange={handleFileUpload} className="hidden" />
        </div>
        {uploadError && (
          <div className="mt-3 bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm">
            ❌ {uploadError}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Or Paste SVG Code</label>
        <textarea
          value={svgCode}
          onChange={(e) => setSvgCode(e.target.value)}
          placeholder="<svg xmlns=&quot;http://www.w3.org/2000/svg&quot; ...>...</svg>"
          className="calc-input text-sm font-mono"
          rows={8}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Width (px)</label>
          <input
            type="number"
            value={width}
            onChange={(e) => setWidth(Math.max(1, parseInt(e.target.value) || 1))}
            className="calc-input text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Height (px)</label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(Math.max(1, parseInt(e.target.value) || 1))}
            className="calc-input text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Background</label>
          <select
            value={bgType}
            onChange={(e) => setBgType(e.target.value as "transparent" | "white")}
            className="calc-input text-sm"
          >
            <option value="transparent">Transparent</option>
            <option value="white">White</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="text-red-600 text-sm font-medium">{error}</div>
      )}

      <div className="flex gap-3 flex-wrap">
        <button onClick={renderSvg} className="btn-primary text-sm !py-2 !px-4">
          Convert to PNG
        </button>
        {rendered && (
          <button onClick={download} className="btn-primary text-sm !py-2 !px-4">
            Download PNG
          </button>
        )}
      </div>

      {rendered ? (
        <div className="result-card flex justify-center" style={{ background: bgType === "transparent" ? "repeating-conic-gradient(#e5e7eb 0% 25%, transparent 0% 50%) 50% / 20px 20px" : undefined }}>
          <canvas ref={canvasRef} className="max-w-full h-auto rounded-lg" />
        </div>
      ) : (
        <div className="result-card text-center text-gray-400 py-12">
          Paste SVG code or upload a file, then click Convert
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}
    </div>
  );
}
