"use client";
import { useState, useMemo } from "react";

export default function SerpPreview() {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");

  const analysis = useMemo(() => {
    const titleLen = title.length;
    const descLen = description.length;
    const titleOk = titleLen <= 60;
    const descOk = descLen <= 160;

    const displayTitle = titleLen > 60 ? title.slice(0, 57) + "..." : title;
    const displayDesc = descLen > 160 ? description.slice(0, 157) + "..." : description;

    let displayUrl = url;
    try {
      if (url && !url.startsWith("http")) displayUrl = "https://" + url;
      const u = new URL(displayUrl);
      displayUrl = u.origin + u.pathname;
    } catch {
      displayUrl = url || "https://example.com";
    }

    return { titleLen, descLen, titleOk, descOk, displayTitle, displayDesc, displayUrl };
  }, [title, url, description]);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">
            Page Title <span className={`ml-2 text-xs ${analysis.titleOk ? "text-green-600" : "text-red-500"}`}>({analysis.titleLen}/60)</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Best SEO Tools Online - Free & Fast"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="calc-input"
          />
          {!analysis.titleOk && (
            <p className="text-xs text-red-500 mt-1">Title exceeds 60 characters. Google may truncate it.</p>
          )}
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">URL / Slug</label>
          <input
            type="text"
            placeholder="e.g. https://sabtools.in/tools/serp-preview"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="calc-input"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">
            Meta Description <span className={`ml-2 text-xs ${analysis.descOk ? "text-green-600" : "text-red-500"}`}>({analysis.descLen}/160)</span>
          </label>
          <textarea
            placeholder="e.g. Use our free SERP preview tool to see how your page looks in Google search results..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="calc-input"
          />
          {!analysis.descOk && (
            <p className="text-xs text-red-500 mt-1">Description exceeds 160 characters. Google may truncate it.</p>
          )}
        </div>
      </div>

      {(title || url || description) && (
        <div className="result-card space-y-4">
          <div className="text-sm font-semibold text-gray-700 mb-3">Google SERP Preview</div>
          <div className="bg-white rounded-xl p-5 border border-gray-200 max-w-2xl">
            <div className="text-lg text-blue-700 hover:underline cursor-pointer font-medium leading-tight">
              {analysis.displayTitle || "Page Title"}
            </div>
            <div className="text-sm text-green-700 mt-1 truncate">
              {analysis.displayUrl}
            </div>
            <div className="text-sm text-gray-600 mt-1 leading-relaxed">
              {analysis.displayDesc || "Meta description will appear here..."}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <div className="text-sm font-semibold text-gray-700 mb-3">Character Analysis</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className={`rounded-xl p-3 border ${analysis.titleOk ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
                <div className="text-xs text-gray-500">Title Length</div>
                <div className={`text-lg font-bold ${analysis.titleOk ? "text-green-600" : "text-red-600"}`}>{analysis.titleLen} / 60</div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                  <div className={`h-1.5 rounded-full ${analysis.titleOk ? "bg-green-500" : "bg-red-500"}`} style={{ width: `${Math.min(100, (analysis.titleLen / 60) * 100)}%` }} />
                </div>
              </div>
              <div className={`rounded-xl p-3 border ${analysis.descOk ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
                <div className="text-xs text-gray-500">Description Length</div>
                <div className={`text-lg font-bold ${analysis.descOk ? "text-green-600" : "text-red-600"}`}>{analysis.descLen} / 160</div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                  <div className={`h-1.5 rounded-full ${analysis.descOk ? "bg-green-500" : "bg-red-500"}`} style={{ width: `${Math.min(100, (analysis.descLen / 160) * 100)}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <div className="text-sm font-semibold text-gray-700 mb-2">Tips</div>
            <ul className="text-xs text-gray-500 space-y-1 list-disc list-inside">
              <li>Keep titles between 50-60 characters for best display</li>
              <li>Include your primary keyword near the beginning of the title</li>
              <li>Meta descriptions between 120-160 characters perform best</li>
              <li>Use action-oriented language in your description</li>
              <li>Make URLs short, descriptive and keyword-rich</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
