"use client";
import { useState } from "react";

export default function TextToSlug() {
  const [input, setInput] = useState("");
  const slug = input.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");

  return (
    <div className="space-y-4">
      <div><label className="text-sm font-semibold text-gray-700 block mb-2">Enter Text</label><input type="text" placeholder="e.g. My Blog Post Title!" value={input} onChange={(e) => setInput(e.target.value)} className="calc-input" /></div>
      {slug && (
        <div className="result-card">
          <div className="flex justify-between mb-2"><div className="text-xs font-medium text-gray-500">URL Slug</div><button onClick={() => navigator.clipboard?.writeText(slug)} className="text-xs text-indigo-600 font-medium hover:underline">Copy</button></div>
          <div className="text-lg font-bold text-indigo-600 font-mono bg-white rounded-xl p-4">{slug}</div>
          <div className="text-xs text-gray-400 mt-2">Full URL preview: https://example.com/{slug}</div>
        </div>
      )}
    </div>
  );
}
