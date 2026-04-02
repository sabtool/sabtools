"use client";
import { useState, useMemo } from "react";

type Method = "caesar" | "rot13" | "reverse" | "base64" | "atbash";

export default function TextEncryption() {
  const [input, setInput] = useState("");
  const [method, setMethod] = useState<Method>("caesar");
  const [shift, setShift] = useState(3);
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => {
    if (!input) return "";
    const isEncrypt = mode === "encrypt";

    switch (method) {
      case "caesar": {
        const s = isEncrypt ? shift : 26 - shift;
        return input.replace(/[a-zA-Z]/g, (c) => {
          const base = c >= "a" ? 97 : 65;
          return String.fromCharCode(((c.charCodeAt(0) - base + s) % 26) + base);
        });
      }
      case "rot13":
        return input.replace(/[a-zA-Z]/g, (c) => {
          const base = c >= "a" ? 97 : 65;
          return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base);
        });
      case "reverse":
        return input.split("").reverse().join("");
      case "base64":
        try {
          return isEncrypt ? btoa(unescape(encodeURIComponent(input))) : decodeURIComponent(escape(atob(input)));
        } catch {
          return "Invalid Base64 input";
        }
      case "atbash":
        return input.replace(/[a-zA-Z]/g, (c) => {
          const base = c >= "a" ? 97 : 65;
          return String.fromCharCode(base + (25 - (c.charCodeAt(0) - base)));
        });
      default:
        return input;
    }
  }, [input, method, shift, mode]);

  const copy = () => {
    navigator.clipboard?.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const methods: { value: Method; label: string }[] = [
    { value: "caesar", label: "Caesar Cipher" },
    { value: "rot13", label: "ROT13" },
    { value: "reverse", label: "Reverse" },
    { value: "base64", label: "Base64" },
    { value: "atbash", label: "Atbash" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Method</label>
          <select value={method} onChange={(e) => setMethod(e.target.value as Method)} className="calc-input">
            {methods.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Mode</label>
          <div className="flex gap-2">
            <button
              onClick={() => setMode("encrypt")}
              className={`flex-1 ${mode === "encrypt" ? "btn-primary" : "btn-secondary"} text-sm !py-2`}
            >
              Encrypt
            </button>
            <button
              onClick={() => setMode("decrypt")}
              className={`flex-1 ${mode === "decrypt" ? "btn-primary" : "btn-secondary"} text-sm !py-2`}
            >
              Decrypt
            </button>
          </div>
        </div>
      </div>

      {method === "caesar" && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Shift: {shift}
          </label>
          <input
            type="range"
            min="1"
            max="25"
            value={shift}
            onChange={(e) => setShift(parseInt(e.target.value))}
            className="w-full accent-indigo-600"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>1</span>
            <span>13</span>
            <span>25</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Input</label>
          <textarea
            placeholder="Enter text to encrypt or decrypt..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="calc-input min-h-[150px] resize-y font-mono text-sm"
            rows={6}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Output</label>
          <textarea
            readOnly
            value={output}
            className="calc-input min-h-[150px] resize-y font-mono text-sm bg-gray-50"
            rows={6}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={copy} className="btn-primary text-sm !py-2 !px-4" disabled={!output}>
          {copied ? "Copied!" : "Copy Output"}
        </button>
        <button onClick={() => { setInput(output); }} className="btn-secondary text-sm !py-2 !px-4" disabled={!output}>
          Use Output as Input
        </button>
        <button onClick={() => setInput("")} className="btn-secondary text-sm !py-2 !px-4">Clear</button>
      </div>
    </div>
  );
}
