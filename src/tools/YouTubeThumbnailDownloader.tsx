"use client";
import { useState, useMemo } from "react";

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const match = url.match(p);
    if (match) return match[1];
  }
  return null;
}

const thumbnailSizes = [
  { name: "Default", key: "default", width: 120, height: 90 },
  { name: "Medium Quality", key: "mqdefault", width: 320, height: 180 },
  { name: "High Quality", key: "hqdefault", width: 480, height: 360 },
  { name: "Standard Definition", key: "sddefault", width: 640, height: 480 },
  { name: "Max Resolution", key: "maxresdefault", width: 1280, height: 720 },
];

export default function YouTubeThumbnailDownloader() {
  const [url, setUrl] = useState("");

  const videoId = useMemo(() => {
    if (!url.trim()) return null;
    return extractVideoId(url.trim());
  }, [url]);

  const thumbnails = useMemo(() => {
    if (!videoId) return [];
    return thumbnailSizes.map((s) => ({
      ...s,
      url: `https://img.youtube.com/vi/${videoId}/${s.key}.jpg`,
    }));
  }, [videoId]);

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">YouTube Video URL</label>
        <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ" className="calc-input" />
      </div>

      {videoId && (
        <div className="result-card space-y-2">
          <div className="bg-white rounded-xl p-3 shadow-sm">
            <span className="text-sm font-semibold text-gray-600">Video ID:</span>{" "}
            <span className="text-sm font-mono text-indigo-600">{videoId}</span>
          </div>
        </div>
      )}

      {!videoId && url.trim() && (
        <div className="result-card">
          <p className="text-sm text-red-500 font-medium">Could not extract a valid YouTube video ID. Please check the URL.</p>
        </div>
      )}

      {thumbnails.length > 0 && (
        <div className="space-y-4">
          {thumbnails.map((t) => (
            <div key={t.key} className="result-card space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-bold text-gray-800">{t.name}</h4>
                  <p className="text-xs text-gray-500">{t.width} x {t.height}px</p>
                </div>
                <a href={t.url} target="_blank" rel="noopener noreferrer" className="btn-primary text-sm">
                  Open / Download
                </a>
              </div>
              <img src={t.url} alt={t.name} className="w-full rounded-lg shadow-sm" loading="lazy" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
