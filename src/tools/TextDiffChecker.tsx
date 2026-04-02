"use client";
import { useState, useMemo } from "react";

export default function TextDiffChecker() {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");

  const diff = useMemo(() => {
    if (!text1 && !text2) return null;
    const lines1 = text1.split("\n");
    const lines2 = text2.split("\n");
    const maxLen = Math.max(lines1.length, lines2.length);
    const result: { line: number; type: "same" | "added" | "removed" | "changed"; left: string; right: string }[] = [];
    for (let i = 0; i < maxLen; i++) {
      const l = lines1[i] ?? "";
      const r = lines2[i] ?? "";
      if (l === r) result.push({ line: i + 1, type: "same", left: l, right: r });
      else if (!l && r) result.push({ line: i + 1, type: "added", left: "", right: r });
      else if (l && !r) result.push({ line: i + 1, type: "removed", left: l, right: "" });
      else result.push({ line: i + 1, type: "changed", left: l, right: r });
    }
    const changes = result.filter((r) => r.type !== "same").length;
    return { result, changes };
  }, [text1, text2]);

  const colors = { same: "", added: "bg-green-50", removed: "bg-red-50", changed: "bg-yellow-50" };
  const icons = { same: "", added: "+", removed: "-", changed: "~" };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="text-sm font-semibold text-gray-700 block mb-2">Original Text</label><textarea placeholder="Paste original text..." value={text1} onChange={(e) => setText1(e.target.value)} className="calc-input min-h-[180px] font-mono text-sm" rows={8} /></div>
        <div><label className="text-sm font-semibold text-gray-700 block mb-2">Modified Text</label><textarea placeholder="Paste modified text..." value={text2} onChange={(e) => setText2(e.target.value)} className="calc-input min-h-[180px] font-mono text-sm" rows={8} /></div>
      </div>
      {diff && (
        <div>
          <div className="text-sm text-gray-500 mb-3">{diff.changes} difference(s) found</div>
          <div className="border border-gray-200 rounded-xl overflow-hidden text-sm font-mono">
            {diff.result.map((r, i) => (
              <div key={i} className={`flex ${colors[r.type]} border-b border-gray-100 last:border-0`}>
                <div className="w-8 text-center py-1 text-gray-400 text-xs border-r border-gray-100">{r.line}</div>
                <div className="w-6 text-center py-1 font-bold text-xs" style={{ color: r.type === "added" ? "green" : r.type === "removed" ? "red" : r.type === "changed" ? "orange" : "gray" }}>{icons[r.type]}</div>
                <div className="flex-1 py-1 px-2 whitespace-pre-wrap">{r.type === "removed" ? r.left : r.right || r.left}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
