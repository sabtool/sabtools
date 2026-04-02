"use client";
import { useState } from "react";

const styles: Record<string, (s: string) => string> = {
  "𝗕𝗼𝗹𝗱": (s) => [...s].map((c) => { const code = c.charCodeAt(0); if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D5D4 + code - 65); if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D5EE + code - 97); return c; }).join(""),
  "𝘐𝘵𝘢𝘭𝘪𝘤": (s) => [...s].map((c) => { const code = c.charCodeAt(0); if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D608 + code - 65); if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D622 + code - 97); return c; }).join(""),
  "𝙼𝚘𝚗𝚘": (s) => [...s].map((c) => { const code = c.charCodeAt(0); if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D670 + code - 65); if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D68A + code - 97); return c; }).join(""),
  "🅱🅾🆇": (s) => [...s.toUpperCase()].map((c) => { const code = c.charCodeAt(0); if (code >= 65 && code <= 90) return String.fromCodePoint(0x1F170 + code - 65); return c; }).join(""),
  "Ⓒⓘⓡⓒⓛⓔ": (s) => [...s].map((c) => { const code = c.charCodeAt(0); if (code >= 65 && code <= 90) return String.fromCodePoint(0x24B6 + code - 65); if (code >= 97 && code <= 122) return String.fromCodePoint(0x24D0 + code - 97); return c; }).join(""),
  "U̲n̲d̲e̲r̲l̲i̲n̲e̲": (s) => [...s].map((c) => c + "\u0332").join(""),
  "S̶t̶r̶i̶k̶e̶": (s) => [...s].map((c) => c + "\u0336").join(""),
  "ʇxǝʇ dılɟ": (s) => { const map: Record<string, string> = { a: "ɐ", b: "q", c: "ɔ", d: "p", e: "ǝ", f: "ɟ", g: "ƃ", h: "ɥ", i: "ᴉ", j: "ɾ", k: "ʞ", l: "l", m: "ɯ", n: "u", o: "o", p: "d", q: "b", r: "ɹ", s: "s", t: "ʇ", u: "n", v: "ʌ", w: "ʍ", x: "x", y: "ʎ", z: "z" }; return [...s.toLowerCase()].reverse().map((c) => map[c] || c).join(""); },
  "S P A C E D": (s) => [...s].join(" "),
};

export default function FancyTextGenerator() {
  const [input, setInput] = useState("");

  return (
    <div className="space-y-4">
      <div><label className="text-sm font-semibold text-gray-700 block mb-2">Enter Text</label><input type="text" placeholder="Type your text here..." value={input} onChange={(e) => setInput(e.target.value)} className="calc-input text-lg" /></div>
      {input && (
        <div className="space-y-2">
          {Object.entries(styles).map(([name, fn]) => {
            const result = fn(input);
            return (
              <div key={name} className="flex items-center justify-between bg-gray-50 rounded-xl p-4 border border-gray-100 hover:border-indigo-200 transition">
                <div>
                  <div className="text-xs font-medium text-gray-400">{name}</div>
                  <div className="text-lg mt-1">{result}</div>
                </div>
                <button onClick={() => navigator.clipboard?.writeText(result)} className="btn-primary text-xs !py-1.5 !px-3">Copy</button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
