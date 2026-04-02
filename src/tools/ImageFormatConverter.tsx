"use client";
import { useState, useRef, useCallback } from "react";

export default function ImageFormatConverter() {
  const [image, setImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [originalFormat, setOriginalFormat] = useState("");
  const [originalSize, setOriginalSize] = useState(0);
  const [targetFormat, setTargetFormat] = useState("png");
  const [quality, setQuality] = useState(0.92);
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [convertedSize, setConvertedSize] = useState(0);
  const [dimensions, setDimensions] = useState({ w: 0, h: 0 });
  const [converting, setConverting] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const formats = [
    { value: "png", label: "PNG", desc: "Lossless, transparent background", mime: "image/png" },
    { value: "jpeg", label: "JPG / JPEG", desc: "Smallest size, best for photos", mime: "image/jpeg" },
    { value: "webp", label: "WebP", desc: "Modern format, smallest file size", mime: "image/webp" },
    { value: "bmp", label: "BMP", desc: "Uncompressed bitmap", mime: "image/bmp" },
    { value: "gif", label: "GIF", desc: "Supports animation (static here)", mime: "image/gif" },
    { value: "ico", label: "ICO", desc: "Favicon format (32x32)", mime: "image/x-icon" },
    { value: "tiff", label: "TIFF", desc: "High quality for printing", mime: "image/tiff" },
    { value: "avif", label: "AVIF", desc: "Next-gen format, ultra small", mime: "image/avif" },
  ];

  const getExtFromName = (name: string): string => {
    const ext = name.split(".").pop()?.toLowerCase() || "";
    const map: Record<string, string> = {
      jpg: "JPEG", jpeg: "JPEG", png: "PNG", webp: "WebP", bmp: "BMP",
      gif: "GIF", svg: "SVG", ico: "ICO", tiff: "TIFF", tif: "TIFF",
      avif: "AVIF", heic: "HEIC", heif: "HEIF", jfif: "JPEG",
    };
    return map[ext] || ext.toUpperCase();
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(2) + " MB";
  };

  const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setOriginalFormat(getExtFromName(file.name));
    setOriginalSize(file.size);
    setConvertedUrl(null);
    setConvertedSize(0);

    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = ev.target?.result as string;
      setImage(url);
      const img = new Image();
      img.onload = () => setDimensions({ w: img.width, h: img.height });
      img.src = url;
    };
    reader.readAsDataURL(file);
  }, []);

  const convert = useCallback(() => {
    if (!image) return;
    setConverting(true);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      let w = img.width;
      let h = img.height;

      // ICO is typically 32x32
      if (targetFormat === "ico") {
        w = 32;
        h = 32;
      }

      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d")!;

      // Fill white background for formats that don't support transparency
      if (["jpeg", "bmp", "ico"].includes(targetFormat)) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, w, h);
      }

      ctx.drawImage(img, 0, 0, w, h);

      const format = formats.find((f) => f.value === targetFormat);
      const mime = format?.mime || "image/png";

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            setConvertedUrl(url);
            setConvertedSize(blob.size);
          }
          setConverting(false);
        },
        mime,
        ["jpeg", "webp", "avif"].includes(targetFormat) ? quality : undefined
      );
    };
    img.src = image;
  }, [image, targetFormat, quality, formats]);

  const download = () => {
    if (!convertedUrl) return;
    const a = document.createElement("a");
    a.href = convertedUrl;
    const baseName = fileName.replace(/\.[^.]+$/, "");
    const ext = targetFormat === "jpeg" ? "jpg" : targetFormat;
    a.download = `${baseName}-converted.${ext}`;
    a.click();
  };

  const savings = originalSize && convertedSize
    ? (((originalSize - convertedSize) / originalSize) * 100).toFixed(1)
    : null;

  return (
    <div className="space-y-6">
      {/* Upload */}
      <div
        className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center cursor-pointer hover:border-purple-400 hover:bg-purple-50/30 transition"
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*,.heic,.heif,.svg,.ico,.bmp,.tiff,.tif,.avif,.webp"
          onChange={handleUpload}
          className="hidden"
        />
        {image ? (
          <div className="space-y-3">
            <img src={image} alt="Preview" className="max-h-48 mx-auto rounded-lg shadow" />
            <p className="text-sm text-gray-600">
              <span className="font-semibold">{fileName}</span> • {originalFormat} • {formatBytes(originalSize)} • {dimensions.w}×{dimensions.h}px
            </p>
            <p className="text-xs text-purple-500">Click to upload a different image</p>
          </div>
        ) : (
          <div>
            <div className="text-5xl mb-3">🖼️</div>
            <p className="text-lg font-semibold text-gray-700">Upload Any Image</p>
            <p className="text-sm text-gray-500 mt-1">
              Supports JPG, PNG, WebP, BMP, GIF, SVG, HEIC, TIFF, AVIF, ICO & more
            </p>
          </div>
        )}
      </div>

      {image && (
        <>
          {/* Format Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Convert To:</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {formats.map((f) => (
                <button
                  key={f.value}
                  onClick={() => { setTargetFormat(f.value); setConvertedUrl(null); }}
                  className={`p-3 rounded-xl border-2 text-left transition ${
                    targetFormat === f.value
                      ? "border-purple-500 bg-purple-50 shadow-md"
                      : "border-gray-200 hover:border-purple-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="font-bold text-sm">{f.label}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{f.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Quality Slider */}
          {["jpeg", "webp", "avif"].includes(targetFormat) && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Quality: {Math.round(quality * 100)}%
              </label>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.01"
                value={quality}
                onChange={(e) => { setQuality(parseFloat(e.target.value)); setConvertedUrl(null); }}
                className="w-full accent-purple-600"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Smallest file</span>
                <span>Best quality</span>
              </div>
            </div>
          )}

          {/* Convert Button */}
          <button
            onClick={convert}
            disabled={converting}
            className="btn-primary w-full text-lg py-4"
          >
            {converting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Converting...
              </span>
            ) : (
              `Convert ${originalFormat} → ${formats.find(f => f.value === targetFormat)?.label || targetFormat.toUpperCase()}`
            )}
          </button>

          {/* Result */}
          {convertedUrl && (
            <div className="result-card space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-green-600">✅ Conversion Complete!</h3>
                <button onClick={download} className="btn-primary">
                  ⬇️ Download {formats.find(f => f.value === targetFormat)?.label}
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <div className="text-xs text-gray-500">Original</div>
                  <div className="font-bold text-gray-800">{formatBytes(originalSize)}</div>
                  <div className="text-xs text-gray-400">{originalFormat}</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <div className="text-xs text-gray-500">Converted</div>
                  <div className="font-bold text-purple-600">{formatBytes(convertedSize)}</div>
                  <div className="text-xs text-gray-400">{formats.find(f => f.value === targetFormat)?.label}</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <div className="text-xs text-gray-500">Size Change</div>
                  <div className={`font-bold ${Number(savings) > 0 ? "text-green-600" : "text-red-500"}`}>
                    {Number(savings) > 0 ? `↓ ${savings}%` : `↑ ${Math.abs(Number(savings))}%`}
                  </div>
                  <div className="text-xs text-gray-400">{Number(savings) > 0 ? "smaller" : "larger"}</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <div className="text-xs text-gray-500">Dimensions</div>
                  <div className="font-bold text-gray-800">
                    {targetFormat === "ico" ? "32×32" : `${dimensions.w}×${dimensions.h}`}
                  </div>
                  <div className="text-xs text-gray-400">pixels</div>
                </div>
              </div>

              {/* Preview */}
              <div className="text-center">
                <img src={convertedUrl} alt="Converted" className="max-h-64 mx-auto rounded-lg shadow border" />
              </div>
            </div>
          )}
        </>
      )}

      <canvas ref={canvasRef} className="hidden" />

      {/* Info Section */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6">
        <h3 className="font-bold text-gray-800 mb-3">📋 Format Guide</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div><span className="font-semibold text-purple-600">PNG</span> — Best for logos, graphics, screenshots. Supports transparency.</div>
          <div><span className="font-semibold text-purple-600">JPG</span> — Best for photos. Smallest file size. No transparency.</div>
          <div><span className="font-semibold text-purple-600">WebP</span> — Modern web format. 30% smaller than JPG. Supports transparency.</div>
          <div><span className="font-semibold text-purple-600">AVIF</span> — Next-gen format. 50% smaller than JPG. Limited browser support.</div>
          <div><span className="font-semibold text-purple-600">BMP</span> — Uncompressed. Very large files. Use for printing only.</div>
          <div><span className="font-semibold text-purple-600">GIF</span> — Supports animation. Limited to 256 colors.</div>
          <div><span className="font-semibold text-purple-600">ICO</span> — Favicon format for websites. Auto-resized to 32×32.</div>
          <div><span className="font-semibold text-purple-600">TIFF</span> — Professional printing format. Very high quality.</div>
        </div>
      </div>
    </div>
  );
}
