"use client";
import { useState, useRef, useMemo } from "react";

type GridSize = "3x1" | "3x2" | "3x3";

export default function InstagramGridMaker() {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [gridSize, setGridSize] = useState<GridSize>("3x3");
  const inputRef = useRef<HTMLInputElement>(null);

  const gridConfig = useMemo(() => {
    const map: Record<GridSize, { cols: number; rows: number; total: number }> = {
      "3x1": { cols: 3, rows: 1, total: 3 },
      "3x2": { cols: 3, rows: 2, total: 6 },
      "3x3": { cols: 3, rows: 3, total: 9 },
    };
    return map[gridSize];
  }, [gridSize]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        setImage(img);
        setImageUrl(ev.target?.result as string);
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const slicePiece = (index: number): HTMLCanvasElement | null => {
    if (!image) return null;
    const { cols, rows } = gridConfig;
    const pieceW = Math.floor(image.width / cols);
    const pieceH = Math.floor(image.height / rows);
    const col = index % cols;
    const row = Math.floor(index / cols);
    const canvas = document.createElement("canvas");
    canvas.width = pieceW;
    canvas.height = pieceH;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(image, col * pieceW, row * pieceH, pieceW, pieceH, 0, 0, pieceW, pieceH);
    return canvas;
  };

  const downloadPiece = (index: number) => {
    const canvas = slicePiece(index);
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `grid-piece-${index + 1}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const downloadAll = () => {
    for (let i = 0; i < gridConfig.total; i++) {
      setTimeout(() => downloadPiece(i), i * 200);
    }
  };

  const previewPieces = useMemo(() => {
    if (!image) return [];
    const pieces: string[] = [];
    const { cols, rows } = gridConfig;
    const pieceW = Math.floor(image.width / cols);
    const pieceH = Math.floor(image.height / rows);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const canvas = document.createElement("canvas");
        canvas.width = pieceW;
        canvas.height = pieceH;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(image, c * pieceW, r * pieceH, pieceW, pieceH, 0, 0, pieceW, pieceH);
        pieces.push(canvas.toDataURL("image/png"));
      }
    }
    return pieces;
  }, [image, gridConfig]);

  return (
    <div className="space-y-6">
      <div
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition"
      >
        <div className="text-4xl mb-3">🖼️</div>
        <div className="text-sm font-semibold text-gray-700">Click or drag to upload image</div>
        <div className="text-xs text-gray-400 mt-1">Upload a wide or square image for best results</div>
        <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
      </div>

      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Grid Size</label>
        <div className="flex gap-3">
          {(["3x1", "3x2", "3x3"] as GridSize[]).map((size) => (
            <button
              key={size}
              onClick={() => setGridSize(size)}
              className={gridSize === size ? "btn-primary" : "btn-secondary"}
            >
              {size} ({size === "3x1" ? 3 : size === "3x2" ? 6 : 9} posts)
            </button>
          ))}
        </div>
      </div>

      {image && previewPieces.length > 0 && (
        <>
          <div className="result-card">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Grid Preview</h3>
            <div
              className="grid gap-1 mx-auto"
              style={{
                gridTemplateColumns: `repeat(3, 1fr)`,
                maxWidth: 420,
              }}
            >
              {previewPieces.map((src, i) => (
                <div key={i} className="relative group cursor-pointer" onClick={() => downloadPiece(i)}>
                  <img src={src} alt={`Piece ${i + 1}`} className="w-full rounded-md border border-gray-200" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-md opacity-0 group-hover:opacity-100 transition">
                    <span className="text-white font-bold text-lg">{i + 1}</span>
                  </div>
                  <span className="absolute top-1 left-1 bg-black/60 text-white text-xs rounded px-1.5 py-0.5">{i + 1}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="result-card">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Instagram Profile Preview</h3>
            <div className="bg-white border rounded-2xl p-4 max-w-sm mx-auto">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white text-2xl">IG</div>
                <div>
                  <div className="font-bold text-sm">your_username</div>
                  <div className="text-xs text-gray-500">Your Name</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-0.5">
                {previewPieces.map((src, i) => (
                  <img key={i} src={src} alt={`Grid ${i + 1}`} className="w-full aspect-square object-cover" />
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={downloadAll} className="btn-primary">
              Download All {gridConfig.total} Pieces
            </button>
          </div>

          <div className="result-card">
            <h3 className="text-sm font-bold text-gray-700 mb-2">Upload Order</h3>
            <p className="text-xs text-gray-500">
              Upload pieces in reverse order ({gridConfig.total} first, then {gridConfig.total - 1}, ..., then 1) to get the correct grid layout on your Instagram profile.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
