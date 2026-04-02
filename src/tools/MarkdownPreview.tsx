"use client";
import { useState } from "react";

function parseMarkdown(md: string): string {
  let html = md;
  html = html.replace(/^### (.*$)/gm, "<h3 class='text-lg font-bold mt-4 mb-2'>$1</h3>");
  html = html.replace(/^## (.*$)/gm, "<h2 class='text-xl font-bold mt-5 mb-2'>$1</h2>");
  html = html.replace(/^# (.*$)/gm, "<h1 class='text-2xl font-bold mt-6 mb-3'>$1</h1>");
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  html = html.replace(/`([^`]+)`/g, "<code class='bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-indigo-600'>$1</code>");
  html = html.replace(/^\- (.*$)/gm, "<li class='ml-4 list-disc'>$1</li>");
  html = html.replace(/^\d+\. (.*$)/gm, "<li class='ml-4 list-decimal'>$1</li>");
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "<a href='$2' class='text-indigo-600 underline'>$1</a>");
  html = html.replace(/^---$/gm, "<hr class='my-4 border-gray-200'>");
  html = html.replace(/\n\n/g, "</p><p class='mb-3'>");
  html = html.replace(/\n/g, "<br>");
  return `<p class='mb-3'>${html}</p>`;
}

export default function MarkdownPreview() {
  const [input, setInput] = useState("# Hello World\n\nThis is **bold** and this is *italic*.\n\n## Features\n\n- Item 1\n- Item 2\n- Item 3\n\n`code here`\n\n[Visit SabTools](https://sabtools.in)");

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Markdown Input</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} className="calc-input min-h-[400px] font-mono text-sm" rows={16} />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Preview</label>
          <div className="calc-input min-h-[400px] bg-white prose prose-sm max-w-none overflow-auto" dangerouslySetInnerHTML={{ __html: parseMarkdown(input) }} />
        </div>
      </div>
      <button onClick={() => navigator.clipboard?.writeText(parseMarkdown(input))} className="btn-secondary text-sm !py-2 !px-4">Copy HTML</button>
    </div>
  );
}
