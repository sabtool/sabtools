"use client";
import { useState } from "react";

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [indent, setIndent] = useState(2);

  const format = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, indent));
      setError("");
    } catch (e: unknown) {
      setError((e as Error).message);
      setOutput("");
    }
  };

  const minify = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError("");
    } catch (e: unknown) {
      setError((e as Error).message);
      setOutput("");
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Input JSON</label>
        <textarea
          placeholder='{"name": "SabTools", "type": "utility"}'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="calc-input min-h-[180px] font-mono text-sm resize-y"
          rows={8}
        />
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <button onClick={format} className="btn-primary text-sm !py-2 !px-5">Format / Beautify</button>
        <button onClick={minify} className="btn-secondary text-sm !py-2 !px-5">Minify</button>
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs text-gray-500">Indent:</span>
          {[2, 4].map((n) => (
            <button key={n} onClick={() => setIndent(n)} className={`px-3 py-1 rounded-lg text-xs font-semibold ${indent === n ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"}`}>
              {n} spaces
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600">
          <span className="font-semibold">Error:</span> {error}
        </div>
      )}

      {output && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-semibold text-gray-700">Output</label>
            <button onClick={() => navigator.clipboard?.writeText(output)} className="text-xs text-indigo-600 font-medium hover:underline">
              Copy to clipboard
            </button>
          </div>
          <pre className="bg-gray-900 text-green-400 rounded-xl p-4 text-sm overflow-auto max-h-[400px] font-mono">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}
