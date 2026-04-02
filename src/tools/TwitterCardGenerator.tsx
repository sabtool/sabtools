"use client";
import { useState } from "react";

export default function TwitterCardGenerator() {
  const [card, setCard] = useState("summary_large_image");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState("");
  const [site, setSite] = useState("");

  const code = `<!-- Twitter Card Meta Tags -->\n<meta name="twitter:card" content="${card}">\n<meta name="twitter:title" content="${title}">\n<meta name="twitter:description" content="${desc}">\n<meta name="twitter:image" content="${image}">\n<meta name="twitter:site" content="${site}">`;

  return (
    <div className="space-y-4">
      <div><label className="text-sm font-semibold text-gray-700 block mb-2">Card Type</label><div className="flex gap-2">{["summary","summary_large_image"].map((t) => (<button key={t} onClick={() => setCard(t)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${card === t ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"}`}>{t.replace("_", " ")}</button>))}</div></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="text-sm font-semibold text-gray-700 block mb-2">Title</label><input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="calc-input" placeholder="Page Title" /></div>
        <div><label className="text-sm font-semibold text-gray-700 block mb-2">Twitter @handle</label><input type="text" value={site} onChange={(e) => setSite(e.target.value)} className="calc-input" placeholder="@username" /></div>
      </div>
      <div><label className="text-sm font-semibold text-gray-700 block mb-2">Description</label><textarea value={desc} onChange={(e) => setDesc(e.target.value)} className="calc-input" rows={2} placeholder="Description..." /></div>
      <div><label className="text-sm font-semibold text-gray-700 block mb-2">Image URL</label><input type="url" value={image} onChange={(e) => setImage(e.target.value)} className="calc-input" placeholder="https://example.com/image.jpg" /></div>
      {title && (<div><div className="flex justify-between mb-2"><label className="text-sm font-semibold text-gray-700">Generated Tags</label><button onClick={() => navigator.clipboard?.writeText(code)} className="text-xs text-indigo-600 font-medium hover:underline">Copy</button></div><pre className="bg-gray-900 text-green-400 rounded-xl p-4 text-xs overflow-auto font-mono">{code}</pre></div>)}
    </div>
  );
}
