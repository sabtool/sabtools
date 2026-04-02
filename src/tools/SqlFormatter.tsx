"use client";
import { useState } from "react";

const keywords = ["SELECT", "FROM", "WHERE", "AND", "OR", "ORDER BY", "GROUP BY", "HAVING", "JOIN", "LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "OUTER JOIN", "ON", "INSERT INTO", "VALUES", "UPDATE", "SET", "DELETE", "CREATE TABLE", "ALTER TABLE", "DROP TABLE", "LIMIT", "OFFSET", "UNION", "AS", "DISTINCT", "COUNT", "SUM", "AVG", "MAX", "MIN", "IN", "NOT", "BETWEEN", "LIKE", "IS NULL", "IS NOT NULL", "EXISTS", "CASE", "WHEN", "THEN", "ELSE", "END"];

export default function SqlFormatter() {
  const [input, setInput] = useState("");

  const format = () => {
    let sql = input.trim();
    // Uppercase keywords
    keywords.forEach((kw) => {
      const regex = new RegExp(`\\b${kw.replace(/ /g, "\\s+")}\\b`, "gi");
      sql = sql.replace(regex, kw);
    });
    // Add newlines before keywords
    const breakBefore = ["SELECT", "FROM", "WHERE", "AND", "OR", "ORDER BY", "GROUP BY", "HAVING", "JOIN", "LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "ON", "LIMIT", "UNION", "INSERT INTO", "VALUES", "UPDATE", "SET", "DELETE"];
    breakBefore.forEach((kw) => {
      sql = sql.replace(new RegExp(`\\s*\\b(${kw})\\b`, "g"), `\n${kw}`);
    });
    // Indent
    sql = sql.split("\n").map((line, i) => {
      const trimmed = line.trim();
      if (i === 0) return trimmed;
      if (["AND", "OR", "ON"].some((k) => trimmed.startsWith(k))) return "  " + trimmed;
      return trimmed;
    }).join("\n").trim();
    return sql;
  };

  const [output, setOutput] = useState("");

  return (
    <div className="space-y-4">
      <div><label className="text-sm font-semibold text-gray-700 block mb-2">Input SQL</label><textarea placeholder="Paste your SQL query here..." value={input} onChange={(e) => setInput(e.target.value)} className="calc-input min-h-[150px] font-mono text-sm" rows={6} /></div>
      <button onClick={() => setOutput(format())} className="btn-primary text-sm !py-2 !px-5">Format SQL</button>
      {output && (<div><div className="flex justify-between mb-2"><label className="text-sm font-semibold text-gray-700">Formatted SQL</label><button onClick={() => navigator.clipboard?.writeText(output)} className="text-xs text-indigo-600 font-medium hover:underline">Copy</button></div><pre className="bg-gray-900 text-green-400 rounded-xl p-4 text-sm overflow-auto font-mono">{output}</pre></div>)}
    </div>
  );
}
