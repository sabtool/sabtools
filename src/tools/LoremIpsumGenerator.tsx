"use client";
import { useState } from "react";

const words = "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum".split(" ");

function generateParagraph(wordCount: number) {
  const result: string[] = [];
  for (let i = 0; i < wordCount; i++) {
    result.push(words[Math.floor(Math.random() * words.length)]);
  }
  result[0] = result[0].charAt(0).toUpperCase() + result[0].slice(1);
  return result.join(" ") + ".";
}

export default function LoremIpsumGenerator() {
  const [count, setCount] = useState(3);
  const [type, setType] = useState<"paragraphs" | "words" | "sentences">("paragraphs");
  const [output, setOutput] = useState("");

  const generate = () => {
    if (type === "paragraphs") {
      setOutput(Array.from({ length: count }, () => generateParagraph(40 + Math.floor(Math.random() * 30))).join("\n\n"));
    } else if (type === "words") {
      setOutput(generateParagraph(count));
    } else {
      const sentences = Array.from({ length: count }, () => generateParagraph(8 + Math.floor(Math.random() * 10)));
      setOutput(sentences.join(" "));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 flex-wrap">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Count</label>
          <input type="number" min={1} max={100} value={count} onChange={(e) => setCount(+e.target.value)} className="calc-input w-24" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Type</label>
          <div className="flex gap-2">
            {(["paragraphs", "words", "sentences"] as const).map((t) => (
              <button key={t} onClick={() => setType(t)} className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition ${type === t ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"}`}>{t}</button>
            ))}
          </div>
        </div>
      </div>
      <button onClick={generate} className="btn-primary text-sm !py-2 !px-5">Generate</button>
      {output && (
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">Output</label>
            <button onClick={() => navigator.clipboard?.writeText(output)} className="text-xs text-indigo-600 font-medium hover:underline">Copy</button>
          </div>
          <textarea value={output} readOnly className="calc-input min-h-[200px] text-sm resize-y" rows={8} />
        </div>
      )}
    </div>
  );
}
