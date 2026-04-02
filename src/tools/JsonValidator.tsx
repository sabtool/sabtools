"use client";
import { useState, useMemo } from "react";

export default function JsonValidator() {
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (!input.trim()) return null;
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, 2);

      // Calculate stats
      const countKeys = (obj: unknown): number => {
        if (typeof obj !== "object" || obj === null) return 0;
        if (Array.isArray(obj)) return obj.reduce((sum: number, item) => sum + countKeys(item), 0);
        let count = Object.keys(obj).length;
        for (const val of Object.values(obj)) count += countKeys(val);
        return count;
      };

      const getDepth = (obj: unknown, d = 0): number => {
        if (typeof obj !== "object" || obj === null) return d;
        if (Array.isArray(obj)) return Math.max(d, ...obj.map((item) => getDepth(item, d + 1)));
        return Math.max(d, ...Object.values(obj).map((val) => getDepth(val, d + 1)));
      };

      const keys = countKeys(parsed);
      const depth = getDepth(parsed);
      const size = new Blob([input]).size;

      return { valid: true, formatted, keys, depth, size, error: null, line: null };
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Invalid JSON";
      // Try to extract line info
      const posMatch = msg.match(/position (\d+)/);
      let line: number | null = null;
      if (posMatch) {
        const pos = parseInt(posMatch[1]);
        line = input.substring(0, pos).split("\n").length;
      }
      return { valid: false, formatted: null, keys: 0, depth: 0, size: 0, error: msg, line };
    }
  }, [input]);

  const beautify = () => {
    if (result?.formatted) setInput(result.formatted);
  };

  const minify = () => {
    try {
      setInput(JSON.stringify(JSON.parse(input)));
    } catch { /* ignore */ }
  };

  const copy = () => {
    if (result?.formatted) {
      navigator.clipboard.writeText(result.formatted);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 mb-2 block">Paste JSON</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="calc-input w-full h-48 font-mono text-sm"
          placeholder='{"name": "John", "age": 30, "city": "Mumbai"}'
        />
      </div>

      <div className="flex gap-2 flex-wrap">
        <button onClick={beautify} className="btn-primary" disabled={!result?.valid}>Beautify</button>
        <button onClick={minify} className="btn-secondary" disabled={!result?.valid}>Minify</button>
        <button onClick={copy} className="btn-secondary" disabled={!result?.valid}>
          {copied ? "Copied!" : "Copy Formatted"}
        </button>
      </div>

      {result && (
        <div className="result-card space-y-4">
          {result.valid ? (
            <>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-bold">Valid JSON</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                  <div className="text-xs font-medium text-gray-500 mb-1">Total Keys</div>
                  <div className="text-2xl font-extrabold text-indigo-600">{result.keys}</div>
                </div>
                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                  <div className="text-xs font-medium text-gray-500 mb-1">Max Depth</div>
                  <div className="text-2xl font-extrabold text-purple-600">{result.depth}</div>
                </div>
                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                  <div className="text-xs font-medium text-gray-500 mb-1">Size</div>
                  <div className="text-2xl font-extrabold text-cyan-600">
                    {result.size > 1024 ? `${(result.size / 1024).toFixed(1)} KB` : `${result.size} B`}
                  </div>
                </div>
              </div>
              <pre className="bg-gray-50 rounded-xl p-4 text-sm font-mono overflow-x-auto max-h-64 overflow-y-auto">
                {result.formatted}
              </pre>
            </>
          ) : (
            <div className="bg-red-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-bold">Invalid JSON</span>
              </div>
              <p className="text-sm text-red-700">{result.error}</p>
              {result.line && <p className="text-sm text-red-600 mt-1">Error near line: {result.line}</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
