"use client";
import { useState } from "react";

type Language = "html" | "css" | "javascript" | "json" | "sql";

function beautifyJSON(code: string): string {
  try {
    return JSON.stringify(JSON.parse(code), null, 2);
  } catch {
    return "Error: Invalid JSON";
  }
}

function beautifyCSS(code: string): string {
  let result = code.trim();
  // Remove extra whitespace
  result = result.replace(/\s+/g, " ");
  // Opening brace
  result = result.replace(/\s*\{\s*/g, " {\n  ");
  // Semicolons
  result = result.replace(/;\s*/g, ";\n  ");
  // Closing brace
  result = result.replace(/\s*\}\s*/g, "\n}\n\n");
  // Clean trailing spaces in lines
  result = result.replace(/  \n/g, "\n");
  // Remove empty lines at start/end
  result = result.trim();
  return result;
}

function beautifyHTML(code: string): string {
  let result = code.trim();
  const indent = "  ";
  let level = 0;
  const lines: string[] = [];

  // Split by tags
  const tokens = result.split(/(<[^>]+>)/g).filter(Boolean);

  for (const token of tokens) {
    const trimmed = token.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith("</")) {
      level = Math.max(0, level - 1);
      lines.push(indent.repeat(level) + trimmed);
    } else if (trimmed.startsWith("<") && !trimmed.startsWith("<!") && !trimmed.endsWith("/>") && !trimmed.match(/^<(br|hr|img|input|meta|link)/i)) {
      lines.push(indent.repeat(level) + trimmed);
      level++;
    } else if (trimmed.startsWith("<")) {
      lines.push(indent.repeat(level) + trimmed);
    } else {
      lines.push(indent.repeat(level) + trimmed);
    }
  }

  return lines.join("\n");
}

function beautifyJS(code: string): string {
  let result = code.trim();
  // Basic formatting
  result = result.replace(/\s+/g, " ");
  result = result.replace(/\s*\{\s*/g, " {\n  ");
  result = result.replace(/;\s*/g, ";\n  ");
  result = result.replace(/\s*\}\s*/g, "\n}\n");
  // Fix indentation for nested braces
  const lines = result.split("\n");
  let level = 0;
  const formatted: string[] = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith("}")) level = Math.max(0, level - 1);
    formatted.push("  ".repeat(level) + trimmed);
    if (trimmed.endsWith("{")) level++;
  }
  return formatted.join("\n");
}

function beautifySQL(code: string): string {
  let result = code.trim();
  const keywords = ["SELECT", "FROM", "WHERE", "AND", "OR", "JOIN", "LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "ON", "ORDER BY", "GROUP BY", "HAVING", "LIMIT", "INSERT INTO", "VALUES", "UPDATE", "SET", "DELETE FROM", "CREATE TABLE", "ALTER TABLE", "DROP TABLE", "UNION", "AS"];

  // Uppercase keywords
  for (const kw of keywords) {
    const regex = new RegExp(`\\b${kw}\\b`, "gi");
    result = result.replace(regex, kw);
  }

  // Add newlines before major keywords
  const majorKw = ["SELECT", "FROM", "WHERE", "AND", "OR", "JOIN", "LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "ON", "ORDER BY", "GROUP BY", "HAVING", "LIMIT", "UNION", "SET", "VALUES"];
  for (const kw of majorKw) {
    const regex = new RegExp(`\\s+${kw}\\b`, "gi");
    result = result.replace(regex, `\n${kw}`);
  }

  // Indent after SELECT, SET etc
  result = result.replace(/SELECT\s+/gi, "SELECT\n  ");
  result = result.replace(/,\s*/g, ",\n  ");

  return result.trim();
}

function beautify(code: string, lang: Language): string {
  switch (lang) {
    case "json": return beautifyJSON(code);
    case "css": return beautifyCSS(code);
    case "html": return beautifyHTML(code);
    case "javascript": return beautifyJS(code);
    case "sql": return beautifySQL(code);
    default: return code;
  }
}

export default function CodeBeautifier() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState<Language>("javascript");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const handleBeautify = () => {
    if (!code.trim()) return;
    setOutput(beautify(code, language));
  };

  const copy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 items-center flex-wrap">
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-1 block">Language</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="calc-input"
          >
            <option value="javascript">JavaScript</option>
            <option value="json">JSON</option>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
            <option value="sql">SQL</option>
          </select>
        </div>
        <div className="flex gap-2 mt-5">
          <button onClick={handleBeautify} className="btn-primary">Beautify Code</button>
          <button onClick={copy} className="btn-secondary" disabled={!output}>
            {copied ? "Copied!" : "Copy Output"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-2 block">Input Code</label>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="calc-input w-full h-72 font-mono text-sm"
            placeholder={`Paste your ${language} code here...`}
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-2 block">Beautified Output</label>
          <pre className="calc-input w-full h-72 font-mono text-sm overflow-auto bg-gray-50 whitespace-pre-wrap">
            {output || "Beautified code will appear here..."}
          </pre>
        </div>
      </div>
    </div>
  );
}
