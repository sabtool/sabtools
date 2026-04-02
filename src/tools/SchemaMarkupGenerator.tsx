"use client";
import { useState } from "react";

export default function SchemaMarkupGenerator() {
  const [type, setType] = useState("Organization");
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [desc, setDesc] = useState("");
  const [logo, setLogo] = useState("");

  const schemas: Record<string, object> = {
    Organization: { "@context": "https://schema.org", "@type": "Organization", name, url, description: desc, logo },
    WebSite: { "@context": "https://schema.org", "@type": "WebSite", name, url, description: desc },
    Article: { "@context": "https://schema.org", "@type": "Article", headline: name, url, description: desc, author: { "@type": "Person", name: "Author" } },
    Product: { "@context": "https://schema.org", "@type": "Product", name, url, description: desc },
    FAQPage: { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [{ "@type": "Question", name: "Sample Question?", acceptedAnswer: { "@type": "Answer", text: "Sample Answer" } }] },
  };

  const code = JSON.stringify(schemas[type], null, 2);

  return (
    <div className="space-y-4">
      <div><label className="text-sm font-semibold text-gray-700 block mb-2">Schema Type</label>
        <div className="flex gap-2 flex-wrap">{Object.keys(schemas).map((t) => (<button key={t} onClick={() => setType(t)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${type === t ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"}`}>{t}</button>))}</div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="text-sm font-semibold text-gray-700 block mb-2">Name</label><input type="text" placeholder="Business name" value={name} onChange={(e) => setName(e.target.value)} className="calc-input" /></div>
        <div><label className="text-sm font-semibold text-gray-700 block mb-2">URL</label><input type="url" placeholder="https://example.com" value={url} onChange={(e) => setUrl(e.target.value)} className="calc-input" /></div>
      </div>
      <div><label className="text-sm font-semibold text-gray-700 block mb-2">Description</label><textarea placeholder="Description..." value={desc} onChange={(e) => setDesc(e.target.value)} className="calc-input" rows={2} /></div>
      {type === "Organization" && <div><label className="text-sm font-semibold text-gray-700 block mb-2">Logo URL</label><input type="url" placeholder="https://example.com/logo.png" value={logo} onChange={(e) => setLogo(e.target.value)} className="calc-input" /></div>}
      <div><div className="flex justify-between mb-2"><label className="text-sm font-semibold text-gray-700">Generated JSON-LD</label><button onClick={() => navigator.clipboard?.writeText(`<script type="application/ld+json">\n${code}\n</script>`)} className="text-xs text-indigo-600 font-medium hover:underline">Copy</button></div><pre className="bg-gray-900 text-green-400 rounded-xl p-4 text-xs overflow-auto font-mono max-h-[300px]">{code}</pre></div>
    </div>
  );
}
