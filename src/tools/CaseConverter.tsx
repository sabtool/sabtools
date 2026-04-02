"use client";
import { useState } from "react";

export default function CaseConverter() {
  const [text, setText] = useState("");

  const convert = (type: string) => {
    switch (type) {
      case "upper": return text.toUpperCase();
      case "lower": return text.toLowerCase();
      case "title": return text.replace(/\w\S*/g, (t) => t.charAt(0).toUpperCase() + t.substring(1).toLowerCase());
      case "sentence": return text.replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase()).replace(/^./, (c) => c.toUpperCase());
      case "toggle": return [...text].map((c) => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join("");
      case "camel": return text.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase());
      case "pascal": return text.toLowerCase().replace(/(^|[^a-zA-Z0-9]+)(.)/g, (_, _s, c) => c.toUpperCase());
      case "snake": return text.toLowerCase().replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "");
      case "kebab": return text.toLowerCase().replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "");
      default: return text;
    }
  };

  const buttons = [
    { label: "UPPERCASE", type: "upper" },
    { label: "lowercase", type: "lower" },
    { label: "Title Case", type: "title" },
    { label: "Sentence case", type: "sentence" },
    { label: "tOGGLE cASE", type: "toggle" },
    { label: "camelCase", type: "camel" },
    { label: "PascalCase", type: "pascal" },
    { label: "snake_case", type: "snake" },
    { label: "kebab-case", type: "kebab" },
  ];

  return (
    <div className="space-y-4">
      <textarea
        placeholder="Type or paste your text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="calc-input min-h-[150px] resize-y"
        rows={5}
      />
      <div className="flex flex-wrap gap-2">
        {buttons.map((btn) => (
          <button key={btn.type} onClick={() => setText(convert(btn.type))} className="px-4 py-2 bg-gray-100 hover:bg-indigo-100 hover:text-indigo-700 text-gray-700 rounded-xl text-sm font-medium transition">
            {btn.label}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <button onClick={() => setText("")} className="btn-secondary text-sm !py-2 !px-4">Clear</button>
        <button onClick={() => navigator.clipboard?.writeText(text)} className="btn-primary text-sm !py-2 !px-4">Copy</button>
      </div>
    </div>
  );
}
