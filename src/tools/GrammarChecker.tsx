"use client";
import { useState, useMemo } from "react";

interface Issue {
  type: string;
  message: string;
  context: string;
  suggestion: string;
}

const confusables: Record<string, { pattern: RegExp; message: string; suggestion: string }[]> = {
  "their/there/they're": [
    { pattern: /\btheir\s+(is|are|was|were|going|coming|doing)\b/gi, message: "\"their\" should likely be \"they're\" before a verb", suggestion: "they're" },
    { pattern: /\bthere\s+(car|house|dog|cat|book|phone|name|idea)\b/gi, message: "\"there\" should likely be \"their\" before a noun", suggestion: "their" },
  ],
  "your/you're": [
    { pattern: /\byour\s+(is|are|was|were|going|coming|doing|welcome)\b/gi, message: "\"your\" should likely be \"you're\" before a verb/adjective", suggestion: "you're" },
    { pattern: /\byou're\s+(car|house|dog|cat|book|phone|name|idea)\b/gi, message: "\"you're\" should likely be \"your\" before a noun", suggestion: "your" },
  ],
  "its/it's": [
    { pattern: /\bits\s+(is|are|was|were|going|coming|doing|not)\b/gi, message: "\"its\" should likely be \"it's\" (it is)", suggestion: "it's" },
    { pattern: /\bit's\s+(own|color|size|weight|shape|name)\b/gi, message: "\"it's\" should likely be \"its\" (possessive)", suggestion: "its" },
  ],
};

export default function GrammarChecker() {
  const [text, setText] = useState("");

  const issues = useMemo((): Issue[] => {
    if (!text.trim()) return [];
    const found: Issue[] = [];

    // Double spaces
    const doubleSpaces = text.match(/[^\n] {2,}/g);
    if (doubleSpaces) {
      doubleSpaces.forEach((match) => {
        found.push({
          type: "Spacing",
          message: "Double or multiple spaces found",
          context: `"...${match.trim()}..."`,
          suggestion: "Use a single space",
        });
      });
    }

    // Missing capitalization after period
    const missingCaps = text.match(/[.!?]\s+[a-z]/g);
    if (missingCaps) {
      missingCaps.forEach((match) => {
        found.push({
          type: "Capitalization",
          message: "Sentence should start with a capital letter",
          context: `"${match}"`,
          suggestion: `"${match.slice(0, -1)}${match.slice(-1).toUpperCase()}"`,
        });
      });
    }

    // Repeated words
    const repeatedWords = text.match(/\b(\w+)\s+\1\b/gi);
    if (repeatedWords) {
      repeatedWords.forEach((match) => {
        const word = match.split(/\s+/)[0];
        found.push({
          type: "Repetition",
          message: `Repeated word: "${word}"`,
          context: `"${match}"`,
          suggestion: `Remove the duplicate "${word}"`,
        });
      });
    }

    // Confusable words
    for (const [group, rules] of Object.entries(confusables)) {
      for (const rule of rules) {
        const matches = text.match(rule.pattern);
        if (matches) {
          matches.forEach((match) => {
            found.push({
              type: `Confused Words (${group})`,
              message: rule.message,
              context: `"${match}"`,
              suggestion: rule.suggestion,
            });
          });
        }
      }
    }

    // Missing space after punctuation
    const noSpace = text.match(/[.!?,;:][A-Za-z]/g);
    if (noSpace) {
      noSpace.forEach((match) => {
        found.push({
          type: "Punctuation",
          message: "Missing space after punctuation",
          context: `"${match}"`,
          suggestion: `"${match[0]} ${match[1]}"`,
        });
      });
    }

    return found;
  }, [text]);

  const typeColors: Record<string, string> = {
    Spacing: "bg-yellow-100 text-yellow-800 border-yellow-200",
    Capitalization: "bg-blue-100 text-blue-800 border-blue-200",
    Repetition: "bg-orange-100 text-orange-800 border-orange-200",
    Punctuation: "bg-pink-100 text-pink-800 border-pink-200",
  };

  return (
    <div className="space-y-6">
      <textarea
        placeholder="Enter text to check for grammar issues..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="calc-input min-h-[200px] resize-y font-mono text-sm"
        rows={8}
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
          <div className="text-xs font-medium text-gray-500">Issues Found</div>
          <div className={`text-2xl font-extrabold mt-1 ${issues.length === 0 ? "text-green-600" : "text-red-600"}`}>
            {issues.length}
          </div>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
          <div className="text-xs font-medium text-gray-500">Words</div>
          <div className="text-2xl font-extrabold text-indigo-600 mt-1">
            {text.trim() ? text.trim().split(/\s+/).length : 0}
          </div>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
          <div className="text-xs font-medium text-gray-500">Status</div>
          <div className={`text-lg font-extrabold mt-1 ${!text.trim() ? "text-gray-400" : issues.length === 0 ? "text-green-600" : "text-yellow-600"}`}>
            {!text.trim() ? "Waiting" : issues.length === 0 ? "Clean!" : "Issues"}
          </div>
        </div>
      </div>

      {issues.length > 0 && (
        <div className="space-y-3">
          {issues.map((issue, i) => (
            <div
              key={i}
              className={`rounded-xl p-4 border ${typeColors[issue.type] || "bg-gray-100 text-gray-800 border-gray-200"}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-xs font-bold uppercase opacity-70">{issue.type}</span>
                  <p className="text-sm font-medium mt-1">{issue.message}</p>
                  <p className="text-xs mt-1 opacity-70">Context: {issue.context}</p>
                  <p className="text-xs mt-1 font-semibold">Suggestion: {issue.suggestion}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {text.trim() && issues.length === 0 && (
        <div className="result-card text-center">
          <div className="text-green-600 text-lg font-bold">No issues found!</div>
          <p className="text-sm text-gray-500 mt-1">Your text looks grammatically clean.</p>
        </div>
      )}

      {text && (
        <button onClick={() => setText("")} className="btn-secondary text-sm !py-2 !px-4">Clear</button>
      )}
    </div>
  );
}
