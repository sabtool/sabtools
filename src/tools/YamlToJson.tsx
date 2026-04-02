"use client";
import { useState, useMemo } from "react";

function parseBasicYaml(yamlStr: string): unknown {
  const lines = yamlStr.split("\n");
  const result: Record<string, unknown> = {};
  const stack: { indent: number; obj: Record<string, unknown> }[] = [{ indent: -1, obj: result }];
  let currentArray: unknown[] | null = null;
  let currentArrayKey = "";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim() || line.trim().startsWith("#")) continue;

    const indent = line.search(/\S/);
    const trimmed = line.trim();

    // Array item
    if (trimmed.startsWith("- ")) {
      const value = trimmed.substring(2).trim();
      if (currentArray && currentArrayKey) {
        currentArray.push(parseValue(value));
      }
      continue;
    }

    currentArray = null;

    const colonIdx = trimmed.indexOf(":");
    if (colonIdx === -1) continue;

    const key = trimmed.substring(0, colonIdx).trim();
    const rawValue = trimmed.substring(colonIdx + 1).trim();

    // Pop stack to correct parent
    while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
      stack.pop();
    }
    const parent = stack[stack.length - 1].obj;

    if (rawValue === "" || rawValue === "|" || rawValue === ">") {
      // Check if next line is an array or nested object
      const nextLine = lines[i + 1];
      if (nextLine && nextLine.trim().startsWith("- ")) {
        const arr: unknown[] = [];
        parent[key] = arr;
        currentArray = arr;
        currentArrayKey = key;
      } else {
        const nested: Record<string, unknown> = {};
        parent[key] = nested;
        stack.push({ indent, obj: nested });
      }
    } else {
      parent[key] = parseValue(rawValue);
    }
  }

  return result;
}

function parseValue(val: string): unknown {
  if (val === "true" || val === "True") return true;
  if (val === "false" || val === "False") return false;
  if (val === "null" || val === "~") return null;
  if (/^-?\d+$/.test(val)) return parseInt(val);
  if (/^-?\d+\.\d+$/.test(val)) return parseFloat(val);
  // Remove quotes
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
    return val.slice(1, -1);
  }
  // Inline array [a, b, c]
  if (val.startsWith("[") && val.endsWith("]")) {
    return val.slice(1, -1).split(",").map((s) => parseValue(s.trim()));
  }
  return val;
}

export default function YamlToJson() {
  const [yaml, setYaml] = useState("");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (!yaml.trim()) return null;
    try {
      const parsed = parseBasicYaml(yaml);
      return { json: JSON.stringify(parsed, null, 2), error: null };
    } catch {
      return { json: null, error: "Failed to parse YAML. Check your syntax." };
    }
  }, [yaml]);

  const copy = () => {
    if (result?.json) {
      navigator.clipboard.writeText(result.json);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-2 block">YAML Input</label>
          <textarea
            value={yaml}
            onChange={(e) => setYaml(e.target.value)}
            className="calc-input w-full h-72 font-mono text-sm"
            placeholder={"name: John Doe\nage: 30\naddress:\n  city: Mumbai\n  state: Maharashtra\nskills:\n  - JavaScript\n  - Python"}
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-semibold text-gray-700">JSON Output</label>
            <button onClick={copy} className="btn-secondary text-xs" disabled={!result?.json}>
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          {result?.error ? (
            <div className="bg-red-50 rounded-xl p-4 text-sm text-red-700 h-72 overflow-auto">{result.error}</div>
          ) : (
            <pre className="calc-input w-full h-72 font-mono text-sm overflow-auto bg-gray-50">
              {result?.json || "Converted JSON will appear here..."}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
