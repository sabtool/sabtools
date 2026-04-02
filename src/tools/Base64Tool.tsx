"use client";
import { useState } from "react";

export default function Base64Tool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [error, setError] = useState("");

  const process = () => {
    setError("");
    try {
      if (mode === "encode") {
        setOutput(btoa(unescape(encodeURIComponent(input))));
      } else {
        setOutput(decodeURIComponent(escape(atob(input))));
      }
    } catch {
      setError("Invalid input for " + (mode === "encode" ? "encoding" : "decoding"));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(["encode", "decode"] as const).map((m) => (
          <button key={m} onClick={() => { setMode(m); setOutput(""); setError(""); }} className={`px-5 py-2 rounded-xl text-sm font-semibold capitalize transition ${mode === m ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"}`}>{m}</button>
        ))}
      </div>
      <textarea placeholder={mode === "encode" ? "Enter text to encode..." : "Enter Base64 to decode..."} value={input} onChange={(e) => setInput(e.target.value)} className="calc-input min-h-[120px] font-mono text-sm resize-y" rows={4} />
      <button onClick={process} className="btn-primary text-sm !py-2 !px-5">{mode === "encode" ? "Encode" : "Decode"}</button>
      {error && <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600">{error}</div>}
      {output && (
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">Result</label>
            <button onClick={() => navigator.clipboard?.writeText(output)} className="text-xs text-indigo-600 font-medium hover:underline">Copy</button>
          </div>
          <textarea value={output} readOnly className="calc-input min-h-[120px] font-mono text-sm bg-gray-50" rows={4} />
        </div>
      )}
    </div>
  );
}
