"use client";
import { useState, useRef } from "react";

export default function ImageToBase64() {
  const [result, setResult] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setFileName(file.name);
    setFileSize(file.size);
    const reader = new FileReader();
    reader.onload = () => { setResult(reader.result as string); };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      <div onClick={() => inputRef.current?.click()} className="border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center cursor-pointer hover:border-indigo-400 transition">
        <div className="text-4xl mb-3">🖼️</div>
        <div className="text-sm font-semibold text-gray-700">{fileName || "Click to upload image"}</div>
        {fileSize > 0 && <div className="text-xs text-gray-400 mt-1">{(fileSize / 1024).toFixed(1)} KB</div>}
        <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
      </div>
      {result && (
        <div>
          <div className="text-sm text-gray-500 mb-2">Base64 string length: <strong>{result.length.toLocaleString()}</strong> characters</div>
          <div className="flex justify-between mb-2"><label className="text-sm font-semibold text-gray-700">Base64 Output</label><button onClick={() => navigator.clipboard?.writeText(result)} className="text-xs text-indigo-600 font-medium hover:underline">Copy</button></div>
          <textarea value={result} readOnly className="calc-input min-h-[150px] font-mono text-xs bg-gray-50 break-all" rows={6} />
          <div className="mt-3"><label className="text-sm font-semibold text-gray-700 block mb-2">HTML Tag</label>
            <div className="flex justify-between mb-1"><span className="text-xs text-gray-400">Ready to use in HTML</span><button onClick={() => navigator.clipboard?.writeText(`<img src="${result}" alt="${fileName}" />`)} className="text-xs text-indigo-600 font-medium hover:underline">Copy HTML</button></div>
            <pre className="bg-gray-900 text-green-400 rounded-xl p-3 text-xs font-mono overflow-auto">{`<img src="${result.slice(0, 50)}..." alt="${fileName}" />`}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
