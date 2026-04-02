"use client";
import { useState } from "react";

export default function OpenGraphGenerator() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [url, setUrl] = useState("");
  const [image, setImage] = useState("");
  const [type, setType] = useState("website");
  const [siteName, setSiteName] = useState("");

  const code = `<!-- Open Graph Meta Tags -->\n<meta property="og:title" content="${title}">\n<meta property="og:description" content="${desc}">\n<meta property="og:url" content="${url}">\n<meta property="og:image" content="${image}">\n<meta property="og:type" content="${type}">\n<meta property="og:site_name" content="${siteName}">\n<meta property="og:locale" content="en_IN">`;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="text-sm font-semibold text-gray-700 block mb-2">Title</label><input type="text" placeholder="Page Title" value={title} onChange={(e) => setTitle(e.target.value)} className="calc-input" /></div>
        <div><label className="text-sm font-semibold text-gray-700 block mb-2">Site Name</label><input type="text" placeholder="My Website" value={siteName} onChange={(e) => setSiteName(e.target.value)} className="calc-input" /></div>
      </div>
      <div><label className="text-sm font-semibold text-gray-700 block mb-2">Description</label><textarea placeholder="Description..." value={desc} onChange={(e) => setDesc(e.target.value)} className="calc-input" rows={2} /></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="text-sm font-semibold text-gray-700 block mb-2">URL</label><input type="url" placeholder="https://example.com/page" value={url} onChange={(e) => setUrl(e.target.value)} className="calc-input" /></div>
        <div><label className="text-sm font-semibold text-gray-700 block mb-2">Image URL</label><input type="url" placeholder="https://example.com/image.jpg" value={image} onChange={(e) => setImage(e.target.value)} className="calc-input" /></div>
      </div>
      <div><label className="text-sm font-semibold text-gray-700 block mb-2">Type</label><select value={type} onChange={(e) => setType(e.target.value)} className="calc-input">{["website","article","product","profile"].map((t) => <option key={t}>{t}</option>)}</select></div>
      {title && (<div><div className="flex justify-between mb-2"><label className="text-sm font-semibold text-gray-700">Generated Tags</label><button onClick={() => navigator.clipboard?.writeText(code)} className="text-xs text-indigo-600 font-medium hover:underline">Copy</button></div><pre className="bg-gray-900 text-green-400 rounded-xl p-4 text-xs overflow-auto font-mono">{code}</pre></div>)}
    </div>
  );
}
