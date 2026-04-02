"use client";
import { useState } from "react";

export default function UrlEncoderDecoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  const process = () => {
    try { setOutput(mode === "encode" ? encodeURIComponent(input) : decodeURIComponent(input)); } catch { setOutput("Error: Invalid input"); }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">{(["encode", "decode"] as const).map((m) => (<button key={m} onClick={() => { setMode(m); setOutput(""); }} className={`px-5 py-2 rounded-xl text-sm font-semibold capitalize transition ${mode === m ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"}`}>{m}</button>))}</div>
      <textarea placeholder={mode === "encode" ? "Enter URL or text to encode..." : "Enter encoded URL to decode..."} value={input} onChange={(e) => setInput(e.target.value)} className="calc-input min-h-[100px] font-mono text-sm" rows={3} />
      <button onClick={process} className="btn-primary text-sm !py-2 !px-5">{mode === "encode" ? "Encode" : "Decode"}</button>
      {output && (<div><div className="flex justify-between mb-2"><label className="text-sm font-semibold text-gray-700">Result</label><button onClick={() => navigator.clipboard?.writeText(output)} className="text-xs text-indigo-600 font-medium hover:underline">Copy</button></div><textarea value={output} readOnly className="calc-input min-h-[100px] font-mono text-sm bg-gray-50" rows={3} /></div>)}
    </div>
  );
}
