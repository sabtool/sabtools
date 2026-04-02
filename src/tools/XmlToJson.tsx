"use client";
import { useState, useMemo } from "react";

export default function XmlToJson() {
  const [xml, setXml] = useState("");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (!xml.trim()) return null;
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(xml, "text/xml");
      const errorNode = doc.querySelector("parsererror");
      if (errorNode) {
        return { error: "Invalid XML: " + errorNode.textContent?.substring(0, 200), json: null };
      }

      const nodeToObj = (node: Element): unknown => {
        const obj: Record<string, unknown> = {};

        // Attributes
        if (node.attributes.length > 0) {
          const attrs: Record<string, string> = {};
          for (let i = 0; i < node.attributes.length; i++) {
            attrs["@" + node.attributes[i].name] = node.attributes[i].value;
          }
          Object.assign(obj, attrs);
        }

        // Child elements
        const children = Array.from(node.children);
        if (children.length === 0) {
          const text = node.textContent?.trim() || "";
          if (Object.keys(obj).length === 0) return text;
          if (text) obj["#text"] = text;
          return obj;
        }

        const groups: Record<string, unknown[]> = {};
        for (const child of children) {
          const name = child.tagName;
          if (!groups[name]) groups[name] = [];
          groups[name].push(nodeToObj(child));
        }

        for (const [name, items] of Object.entries(groups)) {
          obj[name] = items.length === 1 ? items[0] : items;
        }

        return obj;
      };

      const root = doc.documentElement;
      const jsonObj = { [root.tagName]: nodeToObj(root) };
      return { json: JSON.stringify(jsonObj, null, 2), error: null };
    } catch {
      return { error: "Failed to parse XML.", json: null };
    }
  }, [xml]);

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
          <label className="text-sm font-semibold text-gray-700 mb-2 block">XML Input</label>
          <textarea
            value={xml}
            onChange={(e) => setXml(e.target.value)}
            className="calc-input w-full h-72 font-mono text-sm"
            placeholder={'<root>\n  <name>John</name>\n  <age>30</age>\n</root>'}
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
