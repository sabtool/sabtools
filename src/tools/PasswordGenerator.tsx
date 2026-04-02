"use client";
import { useState, useMemo } from "react";

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = () => {
    let chars = "";
    if (uppercase) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (lowercase) chars += "abcdefghijklmnopqrstuvwxyz";
    if (numbers) chars += "0123456789";
    if (symbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";
    if (!chars) return;
    const arr = new Uint32Array(length);
    crypto.getRandomValues(arr);
    const pw = Array.from(arr, (v) => chars[v % chars.length]).join("");
    setPassword(pw);
    setCopied(false);
  };

  const strength = useMemo(() => {
    if (!password) return null;
    let score = 0;
    if (password.length >= 12) score++;
    if (password.length >= 20) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;
    if (score <= 2) return { label: "Weak", color: "bg-red-500", text: "text-red-600", pct: 25 };
    if (score <= 3) return { label: "Fair", color: "bg-orange-500", text: "text-orange-600", pct: 50 };
    if (score <= 4) return { label: "Good", color: "bg-yellow-500", text: "text-yellow-600", pct: 75 };
    return { label: "Strong", color: "bg-green-500", text: "text-green-600", pct: 100 };
  }, [password]);

  const copy = () => {
    navigator.clipboard?.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Password Length: <span className="text-indigo-600">{length}</span></label>
        <input type="range" min={8} max={64} value={length} onChange={(e) => setLength(Number(e.target.value))} className="w-full accent-indigo-600" />
        <div className="flex justify-between text-xs text-gray-400 mt-1"><span>8</span><span>64</span></div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Uppercase (A-Z)", checked: uppercase, set: setUppercase },
          { label: "Lowercase (a-z)", checked: lowercase, set: setLowercase },
          { label: "Numbers (0-9)", checked: numbers, set: setNumbers },
          { label: "Symbols (!@#$)", checked: symbols, set: setSymbols },
        ].map((opt) => (
          <label key={opt.label} className="flex items-center gap-2 cursor-pointer bg-gray-50 rounded-xl p-3 border border-gray-100 hover:border-indigo-200 transition">
            <input type="checkbox" checked={opt.checked} onChange={(e) => opt.set(e.target.checked)} className="w-4 h-4 rounded accent-indigo-600" />
            <span className="text-sm text-gray-700">{opt.label}</span>
          </label>
        ))}
      </div>
      <button onClick={generate} className="btn-primary">Generate Password</button>
      {password && (
        <div className="result-card space-y-4">
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-gray-500">Your Password</span>
              <button onClick={copy} className="text-xs text-indigo-600 font-medium hover:underline">{copied ? "Copied!" : "Copy"}</button>
            </div>
            <div className="font-mono text-lg text-indigo-600 font-bold break-all select-all">{password}</div>
          </div>
          {strength && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-semibold text-gray-500">Strength</span>
                <span className={`text-sm font-bold ${strength.text}`}>{strength.label}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-500 ${strength.color}`} style={{ width: `${strength.pct}%` }} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
