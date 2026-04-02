"use client";
import { useState } from "react";

export default function MetaTagGenerator() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [keywords, setKeywords] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const code = `<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<title>${title}</title>\n<meta name="description" content="${desc}">\n<meta name="keywords" content="${keywords}">\n<meta name="author" content="${author}">\n<link rel="canonical" href="${url}">\n<meta name="robots" content="index, follow">\n\n<!-- Open Graph -->\n<meta property="og:title" content="${title}">\n<meta property="og:description" content="${desc}">\n<meta property="og:url" content="${url}">\n<meta property="og:type" content="website">\n\n<!-- Twitter Card -->\n<meta name="twitter:card" content="summary_large_image">\n<meta name="twitter:title" content="${title}">\n<meta name="twitter:description" content="${desc}">`;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="text-sm font-semibold text-gray-700 block mb-2">Page Title ({title.length}/60)</label><input type="text" placeholder="My Website" value={title} onChange={(e) => setTitle(e.target.value)} className="calc-input" maxLength={60} /></div>
        <div><label className="text-sm font-semibold text-gray-700 block mb-2">Author</label><input type="text" placeholder="John Doe" value={author} onChange={(e) => setAuthor(e.target.value)} className="calc-input" /></div>
      </div>
      <div><label className="text-sm font-semibold text-gray-700 block mb-2">Description ({desc.length}/160)</label><textarea placeholder="Brief description of your page..." value={desc} onChange={(e) => setDesc(e.target.value)} className="calc-input" maxLength={160} rows={2} /></div>
      <div><label className="text-sm font-semibold text-gray-700 block mb-2">Keywords (comma separated)</label><input type="text" placeholder="web, tools, free" value={keywords} onChange={(e) => setKeywords(e.target.value)} className="calc-input" /></div>
      <div><label className="text-sm font-semibold text-gray-700 block mb-2">URL</label><input type="url" placeholder="https://example.com" value={url} onChange={(e) => setUrl(e.target.value)} className="calc-input" /></div>
      {title && (
        <div><div className="flex justify-between mb-2"><label className="text-sm font-semibold text-gray-700">Generated Meta Tags</label><button onClick={() => navigator.clipboard?.writeText(code)} className="text-xs text-indigo-600 font-medium hover:underline">Copy</button></div><pre className="bg-gray-900 text-green-400 rounded-xl p-4 text-xs overflow-auto font-mono max-h-[400px]">{code}</pre></div>
      )}
    </div>
  );
}
