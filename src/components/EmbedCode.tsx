"use client";

import { useState, useCallback } from "react";

interface EmbedCodeProps {
  slug: string;
}

export default function EmbedCode({ slug }: EmbedCodeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const embedCode = `<iframe src="https://sabtools.in/embed/${slug}" width="100%" height="500" frameborder="0" style="border:1px solid #e2e8f0;border-radius:16px;"></iframe>`;

  const handleCopy = useCallback(() => {
    navigator.clipboard?.writeText(embedCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [embedCode]);

  return (
    <div className="mt-8 border border-gray-200 rounded-2xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{"</>"}</span>
          <span className="font-semibold text-gray-800">Embed this tool on your website</span>
        </div>
        <svg
          className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="px-5 py-4 space-y-4">
          <p className="text-sm text-gray-600">
            Copy the code below and paste it into your website&apos;s HTML to embed this tool. The widget is responsive and works on all screen sizes.
          </p>
          <div className="relative">
            <textarea
              readOnly
              value={embedCode}
              rows={3}
              className="w-full p-3 pr-24 bg-gray-900 text-green-400 text-sm font-mono rounded-xl border border-gray-700 resize-none focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className={`absolute top-3 right-3 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                copied
                  ? "bg-green-500 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
              }`}
            >
              {copied ? "Copied!" : "Copy Code"}
            </button>
          </div>
          <p className="text-xs text-gray-400">
            You can adjust the height attribute to fit your layout. The embed is ad-free and lightweight.
          </p>
        </div>
      )}
    </div>
  );
}
