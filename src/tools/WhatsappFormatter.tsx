"use client";
import { useState, useMemo } from "react";

const COMMON_EMOJIS = [
  "\ud83d\ude00", "\ud83d\ude02", "\ud83d\ude0d", "\ud83e\udd23", "\ud83d\ude4f", "\ud83d\udc4d", "\ud83d\udc4e", "\u2764\ufe0f", "\ud83d\udd25", "\ud83c\udf89",
  "\ud83d\ude22", "\ud83d\ude31", "\ud83e\udd14", "\ud83d\ude0e", "\ud83d\udc4b", "\ud83d\ude4c", "\ud83d\udcaf", "\u2705", "\u274c", "\ud83d\udca1",
  "\ud83d\udc40", "\ud83d\udcaa", "\ud83c\udf1f", "\ud83d\udc96", "\ud83d\ude4b", "\ud83e\udd29", "\ud83d\ude0a", "\ud83e\udd71", "\ud83d\udcf1", "\ud83c\udf0d",
];

export default function WhatsappFormatter() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const charCount = text.length;

  const applyFormat = (prefix: string, suffix: string) => {
    const textarea = document.getElementById("wa-text") as HTMLTextAreaElement;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    if (start === end) {
      // No selection - wrap placeholder
      const newText = text.slice(0, start) + prefix + "text" + suffix + text.slice(end);
      setText(newText);
    } else {
      const selected = text.slice(start, end);
      const newText = text.slice(0, start) + prefix + selected + suffix + text.slice(end);
      setText(newText);
    }
  };

  const makeBulletList = () => {
    const lines = text.split("\n").filter((l) => l.trim());
    setText(lines.map((l) => `\u2022 ${l.replace(/^[\u2022\-\*]\s*/, "")}`).join("\n"));
  };

  const makeNumberedList = () => {
    const lines = text.split("\n").filter((l) => l.trim());
    setText(lines.map((l, i) => `${i + 1}. ${l.replace(/^\d+\.\s*/, "").replace(/^[\u2022\-\*]\s*/, "")}`).join("\n"));
  };

  const addEmoji = (emoji: string) => {
    setText((prev) => prev + emoji);
  };

  const preview = useMemo(() => {
    if (!text) return "";
    let formatted = text;
    // Bold
    formatted = formatted.replace(/\*([^*]+)\*/g, '<strong>$1</strong>');
    // Italic
    formatted = formatted.replace(/_([^_]+)_/g, '<em>$1</em>');
    // Strikethrough
    formatted = formatted.replace(/~([^~]+)~/g, '<del>$1</del>');
    // Monospace
    formatted = formatted.replace(/```([^`]+)```/g, '<code class="bg-gray-200 px-1 rounded font-mono text-sm">$1</code>');
    // Line breaks
    formatted = formatted.replace(/\n/g, '<br/>');
    return formatted;
  }, [text]);

  const copyText = () => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Enter Your Text</label>
        <textarea
          id="wa-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your WhatsApp message here..."
          className="calc-input min-h-[120px]"
        />
        <div className="flex justify-between mt-1">
          <p className="text-xs text-gray-400">{charCount} characters</p>
          <p className="text-xs text-gray-400">WhatsApp single message limit: ~65,536 chars</p>
        </div>
      </div>

      {/* Formatting Buttons */}
      <div className="result-card">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Format Text</h3>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => applyFormat("*", "*")} className="btn-secondary text-sm font-bold">B Bold</button>
          <button onClick={() => applyFormat("_", "_")} className="btn-secondary text-sm italic">I Italic</button>
          <button onClick={() => applyFormat("~", "~")} className="btn-secondary text-sm line-through">S Strikethrough</button>
          <button onClick={() => applyFormat("```", "```")} className="btn-secondary text-sm font-mono">&lt;/&gt; Mono</button>
          <button onClick={makeBulletList} className="btn-secondary text-sm">{"\u2022"} Bullet List</button>
          <button onClick={makeNumberedList} className="btn-secondary text-sm">1. Numbered List</button>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          Select text first, then click a format button. Or click to insert placeholder.
        </div>
      </div>

      {/* Emoji Picker */}
      <div className="result-card">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Emojis</h3>
        <div className="flex flex-wrap gap-1.5">
          {COMMON_EMOJIS.map((emoji, i) => (
            <button
              key={i}
              onClick={() => addEmoji(emoji)}
              className="w-9 h-9 text-lg hover:bg-gray-100 rounded transition-colors flex items-center justify-center"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Preview */}
      {text && (
        <div className="result-card">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Preview (as seen in WhatsApp)</h3>
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="text-sm text-gray-800" dangerouslySetInnerHTML={{ __html: preview }} />
              <p className="text-xs text-gray-400 text-right mt-1">Now</p>
            </div>
          </div>
        </div>
      )}

      {/* Copy */}
      {text && (
        <div className="flex gap-3">
          <button onClick={copyText} className="btn-primary flex-1">{copied ? "Copied!" : "Copy Formatted Text"}</button>
          <button onClick={() => setText("")} className="btn-secondary">Clear</button>
        </div>
      )}

      {/* Formatting Reference */}
      <div className="result-card">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">WhatsApp Formatting Reference</h3>
        <div className="space-y-2 text-sm">
          {[
            { syntax: "*bold*", result: "bold", desc: "Surround with asterisks" },
            { syntax: "_italic_", result: "italic", desc: "Surround with underscores" },
            { syntax: "~strikethrough~", result: "strikethrough", desc: "Surround with tildes" },
            { syntax: "```monospace```", result: "monospace", desc: "Surround with triple backticks" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 bg-gray-50 rounded p-2">
              <code className="text-xs bg-gray-200 px-2 py-0.5 rounded font-mono shrink-0">{item.syntax}</code>
              <span className="text-gray-600">{item.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
