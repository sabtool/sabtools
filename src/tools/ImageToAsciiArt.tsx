"use client";
import { useState, useRef, useMemo, useCallback } from "react";

export default function ImageToAsciiArt() {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [width, setWidth] = useState(80);
  const [darkMode, setDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState(10);
  const [ascii, setAscii] = useState("");
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Characters from darkest to lightest
  const chars = useMemo(() => "@#S%?*+;:,. ", []);

  const generateAscii = useCallback(
    (img: HTMLImageElement, w: number, dark: boolean) => {
      const canvas = document.createElement("canvas");
      const aspect = img.height / img.width;
      // ASCII chars are roughly 2x taller than wide
      const h = Math.round(w * aspect * 0.5);
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, w, h);
      const data = ctx.getImageData(0, 0, w, h).data;

      let result = "";
      for (let y = 0; y < h; y++) {
        let row = "";
        for (let x = 0; x < w; x++) {
          const i = (y * w + x) * 4;
          const r = data[i], g = data[i + 1], b = data[i + 2];
          const brightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
          const charIndex = dark
            ? Math.floor(brightness * (chars.length - 1))
            : Math.floor((1 - brightness) * (chars.length - 1));
          row += chars[charIndex];
        }
        result += row + "\n";
      }
      setAscii(result);
    },
    [chars]
  );

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        setImage(img);
        generateAscii(img, width, darkMode);
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(ascii);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadTxt = () => {
    const blob = new Blob([ascii], { type: "text/plain" });
    const link = document.createElement("a");
    link.download = "ascii-art.txt";
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="space-y-6">
      <div
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition"
      >
        <div className="text-4xl mb-3">🔤</div>
        <div className="text-sm font-semibold text-gray-700">{image ? "Change image" : "Upload image to convert"}</div>
        <div className="text-xs text-gray-400 mt-1">JPG, PNG, WebP</div>
        <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">Width: {width} chars</label>
          <input
            type="range"
            min={40}
            max={120}
            value={width}
            onChange={(e) => {
              const w = +e.target.value;
              setWidth(w);
              if (image) generateAscii(image, w, darkMode);
            }}
            className="w-full"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">Font Size: {fontSize}px</label>
          <input
            type="range"
            min={4}
            max={16}
            value={fontSize}
            onChange={(e) => setFontSize(+e.target.value)}
            className="w-full"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Mode</label>
          <div className="flex gap-2">
            <button
              onClick={() => { setDarkMode(false); if (image) generateAscii(image, width, false); }}
              className={!darkMode ? "btn-primary" : "btn-secondary"}
            >
              Light
            </button>
            <button
              onClick={() => { setDarkMode(true); if (image) generateAscii(image, width, true); }}
              className={darkMode ? "btn-primary" : "btn-secondary"}
            >
              Dark
            </button>
          </div>
        </div>
      </div>

      {ascii && (
        <>
          <div className="result-card">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-bold text-gray-800">ASCII Art</h3>
              <div className="flex gap-2">
                <button onClick={copyToClipboard} className="btn-secondary text-xs">
                  {copied ? "Copied!" : "Copy"}
                </button>
                <button onClick={downloadTxt} className="btn-secondary text-xs">
                  Download .txt
                </button>
              </div>
            </div>
            <div
              className="overflow-auto rounded-xl border border-gray-200 p-4"
              style={{
                backgroundColor: darkMode ? "#1a1a2e" : "#FFFFFF",
                maxHeight: 500,
              }}
            >
              <pre
                style={{
                  fontFamily: "monospace",
                  fontSize: `${fontSize}px`,
                  lineHeight: `${fontSize}px`,
                  color: darkMode ? "#E0E0E0" : "#333333",
                  whiteSpace: "pre",
                  margin: 0,
                }}
              >
                {ascii}
              </pre>
            </div>
          </div>

          <div className="result-card">
            <p className="text-xs text-gray-500">
              Characters used: <span className="font-mono">{chars.trim()}</span> &middot;
              Brightness is mapped from dark (<span className="font-mono">@</span>) to
              light (<span className="font-mono">.</span> and space)
            </p>
          </div>
        </>
      )}
    </div>
  );
}
