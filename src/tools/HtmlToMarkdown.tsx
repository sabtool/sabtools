"use client";
import { useState, useMemo } from "react";

function htmlToMd(html: string): string {
  let md = html;

  // Remove scripts and styles
  md = md.replace(/<script[\s\S]*?<\/script>/gi, "");
  md = md.replace(/<style[\s\S]*?<\/style>/gi, "");

  // Headings
  md = md.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, "\n# $1\n");
  md = md.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, "\n## $1\n");
  md = md.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, "\n### $1\n");
  md = md.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, "\n#### $1\n");
  md = md.replace(/<h5[^>]*>([\s\S]*?)<\/h5>/gi, "\n##### $1\n");
  md = md.replace(/<h6[^>]*>([\s\S]*?)<\/h6>/gi, "\n###### $1\n");

  // Bold and italic
  md = md.replace(/<(strong|b)[^>]*>([\s\S]*?)<\/(strong|b)>/gi, "**$2**");
  md = md.replace(/<(em|i)[^>]*>([\s\S]*?)<\/(em|i)>/gi, "*$2*");

  // Code
  md = md.replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, "\n```\n$1\n```\n");
  md = md.replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, "\n```\n$1\n```\n");
  md = md.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, "`$1`");

  // Links and images
  md = md.replace(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, "[$2]($1)");
  md = md.replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/gi, "![$2]($1)");
  md = md.replace(/<img[^>]*alt="([^"]*)"[^>]*src="([^"]*)"[^>]*\/?>/gi, "![$1]($2)");
  md = md.replace(/<img[^>]*src="([^"]*)"[^>]*\/?>/gi, "![]($1)");

  // Lists
  md = md.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (_, content) => {
    return content.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, "- $1\n");
  });
  md = md.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (_, content) => {
    let i = 0;
    return content.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, () => {
      i++;
      return `${i}. ${arguments[1] || ""}\n`;
    });
  });
  // Fix ordered list items
  md = md.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (_, content: string) => {
    let idx = 0;
    return content.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (__, text: string) => {
      idx++;
      return `${idx}. ${text}\n`;
    });
  });

  // Table
  md = md.replace(/<table[^>]*>([\s\S]*?)<\/table>/gi, (_, tableContent: string) => {
    const rows: string[] = [];
    const rowMatches = tableContent.match(/<tr[^>]*>([\s\S]*?)<\/tr>/gi) || [];
    rowMatches.forEach((row: string, idx: number) => {
      const cells: string[] = [];
      const cellRegex = /<(td|th)[^>]*>([\s\S]*?)<\/(td|th)>/gi;
      let match;
      while ((match = cellRegex.exec(row)) !== null) {
        cells.push(match[2].trim());
      }
      rows.push("| " + cells.join(" | ") + " |");
      if (idx === 0) {
        rows.push("| " + cells.map(() => "---").join(" | ") + " |");
      }
    });
    return "\n" + rows.join("\n") + "\n";
  });

  // Paragraphs and breaks
  md = md.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, "\n$1\n");
  md = md.replace(/<br\s*\/?>/gi, "\n");
  md = md.replace(/<hr\s*\/?>/gi, "\n---\n");

  // Blockquote
  md = md.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_, content: string) => {
    return content.split("\n").map((line: string) => "> " + line.trim()).join("\n");
  });

  // Remove remaining tags
  md = md.replace(/<[^>]+>/g, "");

  // Decode HTML entities
  md = md.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ");

  // Clean up whitespace
  md = md.replace(/\n{3,}/g, "\n\n").trim();

  return md;
}

export default function HtmlToMarkdown() {
  const [html, setHtml] = useState("");
  const [copied, setCopied] = useState(false);

  const markdown = useMemo(() => {
    if (!html.trim()) return "";
    return htmlToMd(html);
  }, [html]);

  const copy = () => {
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-2 block">HTML Input</label>
          <textarea
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            className="calc-input w-full h-72 font-mono text-sm"
            placeholder="<h1>Hello World</h1>\n<p>This is a <strong>paragraph</strong> with a <a href='#'>link</a>.</p>"
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-semibold text-gray-700">Markdown Output</label>
            <button onClick={copy} className="btn-secondary text-xs" disabled={!markdown}>
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <pre className="calc-input w-full h-72 font-mono text-sm overflow-auto bg-gray-50 whitespace-pre-wrap">
            {markdown || "Converted Markdown will appear here..."}
          </pre>
        </div>
      </div>
    </div>
  );
}
