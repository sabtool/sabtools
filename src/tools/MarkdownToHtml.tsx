"use client";
import { useState, useMemo } from "react";

function mdToHtml(md: string): string {
  let html = md;

  // Code blocks (before other processing)
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, "<pre><code>$2</code></pre>");

  // Headings
  html = html.replace(/^######\s+(.+)$/gm, "<h6>$1</h6>");
  html = html.replace(/^#####\s+(.+)$/gm, "<h5>$1</h5>");
  html = html.replace(/^####\s+(.+)$/gm, "<h4>$1</h4>");
  html = html.replace(/^###\s+(.+)$/gm, "<h3>$1</h3>");
  html = html.replace(/^##\s+(.+)$/gm, "<h2>$1</h2>");
  html = html.replace(/^#\s+(.+)$/gm, "<h1>$1</h1>");

  // Horizontal rule
  html = html.replace(/^---$/gm, "<hr />");

  // Bold and italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>");
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");
  html = html.replace(/___(.+?)___/g, "<strong><em>$1</em></strong>");
  html = html.replace(/__(.+?)__/g, "<strong>$1</strong>");
  html = html.replace(/_(.+?)_/g, "<em>$1</em>");

  // Inline code
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");

  // Images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // Blockquotes
  html = html.replace(/^>\s+(.+)$/gm, "<blockquote>$1</blockquote>");

  // Tables
  html = html.replace(/^(\|.+\|)\n(\|[-| :]+\|)\n((?:\|.+\|\n?)*)/gm, (_, header: string, _sep: string, body: string) => {
    const headerCells = header.split("|").filter((c: string) => c.trim()).map((c: string) => `<th>${c.trim()}</th>`).join("");
    const rows = body.trim().split("\n").map((row: string) => {
      const cells = row.split("|").filter((c: string) => c.trim()).map((c: string) => `<td>${c.trim()}</td>`).join("");
      return `<tr>${cells}</tr>`;
    }).join("\n");
    return `<table>\n<thead><tr>${headerCells}</tr></thead>\n<tbody>${rows}</tbody>\n</table>`;
  });

  // Unordered lists
  html = html.replace(/^(?:- (.+)\n?)+/gm, (match) => {
    const items = match.trim().split("\n").map((line) => `<li>${line.replace(/^- /, "")}</li>`).join("\n");
    return `<ul>\n${items}\n</ul>`;
  });

  // Ordered lists
  html = html.replace(/^(?:\d+\. (.+)\n?)+/gm, (match) => {
    const items = match.trim().split("\n").map((line) => `<li>${line.replace(/^\d+\.\s/, "")}</li>`).join("\n");
    return `<ol>\n${items}\n</ol>`;
  });

  // Paragraphs (lines not already wrapped in HTML)
  html = html.replace(/^(?!<[a-z])((?!^\s*$).+)$/gm, (_, line: string) => {
    if (line.trim()) return `<p>${line}</p>`;
    return line;
  });

  // Clean double-wrapped paragraphs
  html = html.replace(/<p><(h[1-6]|ul|ol|table|pre|blockquote|hr)/g, "<$1");
  html = html.replace(/<\/(h[1-6]|ul|ol|table|pre|blockquote)><\/p>/g, "</$1>");

  return html.trim();
}

export default function MarkdownToHtml() {
  const [markdown, setMarkdown] = useState("");
  const [view, setView] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);

  const html = useMemo(() => {
    if (!markdown.trim()) return "";
    return mdToHtml(markdown);
  }, [markdown]);

  const copy = () => {
    navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-2 block">Markdown Input</label>
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            className="calc-input w-full h-72 font-mono text-sm"
            placeholder={"# Hello World\n\nThis is **bold** and *italic*.\n\n- Item 1\n- Item 2\n\n[Link](https://example.com)"}
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-2">
            <div className="flex gap-2">
              <button onClick={() => setView("preview")} className={view === "preview" ? "btn-primary text-xs" : "btn-secondary text-xs"}>Preview</button>
              <button onClick={() => setView("code")} className={view === "code" ? "btn-primary text-xs" : "btn-secondary text-xs"}>HTML Code</button>
            </div>
            <button onClick={copy} className="btn-secondary text-xs" disabled={!html}>
              {copied ? "Copied!" : "Copy HTML"}
            </button>
          </div>
          {view === "preview" ? (
            <div
              className="calc-input w-full h-72 overflow-auto bg-white prose prose-sm max-w-none p-4"
              dangerouslySetInnerHTML={{ __html: html || "<p class='text-gray-400'>Preview will appear here...</p>" }}
            />
          ) : (
            <pre className="calc-input w-full h-72 font-mono text-sm overflow-auto bg-gray-50 whitespace-pre-wrap">
              {html || "HTML code will appear here..."}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
