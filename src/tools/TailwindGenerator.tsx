"use client";
import { useState, useMemo } from "react";

type ElementType = "button" | "card" | "input" | "badge" | "alert";

const PADDING = ["p-0", "p-1", "p-2", "p-3", "p-4", "p-5", "p-6", "p-8", "px-4 py-2", "px-6 py-3", "px-8 py-4"];
const MARGIN = ["m-0", "m-1", "m-2", "m-4", "m-6", "m-8", "mx-auto", "mt-4", "mb-4"];
const BG_COLORS = ["bg-white", "bg-gray-100", "bg-gray-800", "bg-indigo-500", "bg-indigo-600", "bg-blue-500", "bg-blue-600", "bg-green-500", "bg-red-500", "bg-yellow-500", "bg-purple-500", "bg-pink-500", "bg-gradient-to-r from-indigo-500 to-purple-500"];
const TEXT_COLORS = ["text-white", "text-black", "text-gray-700", "text-gray-900", "text-indigo-600", "text-blue-600", "text-green-600", "text-red-600"];
const BORDER_RADIUS = ["rounded-none", "rounded-sm", "rounded", "rounded-md", "rounded-lg", "rounded-xl", "rounded-2xl", "rounded-full"];
const SHADOW = ["shadow-none", "shadow-sm", "shadow", "shadow-md", "shadow-lg", "shadow-xl", "shadow-2xl"];
const FONT_SIZE = ["text-xs", "text-sm", "text-base", "text-lg", "text-xl", "text-2xl"];
const FONT_WEIGHT = ["font-normal", "font-medium", "font-semibold", "font-bold"];
const BORDER = ["border-0", "border", "border-2", "border-gray-200", "border-gray-300", "border-indigo-500"];

export default function TailwindGenerator() {
  const [elementType, setElementType] = useState<ElementType>("button");
  const [padding, setPadding] = useState("px-6 py-3");
  const [margin, setMargin] = useState("m-0");
  const [bgColor, setBgColor] = useState("bg-indigo-600");
  const [textColor, setTextColor] = useState("text-white");
  const [borderRadius, setBorderRadius] = useState("rounded-lg");
  const [shadow, setShadow] = useState("shadow-md");
  const [fontSize, setFontSize] = useState("text-base");
  const [fontWeight, setFontWeight] = useState("font-semibold");
  const [border, setBorder] = useState("border-0");
  const [customText, setCustomText] = useState("Click Me");
  const [copied, setCopied] = useState("");

  const classes = useMemo(() => {
    const parts = [padding, margin, bgColor, textColor, borderRadius, shadow, fontSize, fontWeight, border].filter(c => c && c !== "border-0" && c !== "shadow-none" && c !== "m-0" && c !== "rounded-none" && c !== "p-0");
    return parts.join(" ");
  }, [padding, margin, bgColor, textColor, borderRadius, shadow, fontSize, fontWeight, border]);

  const htmlCode = useMemo(() => {
    switch (elementType) {
      case "button":
        return `<button class="${classes} cursor-pointer hover:opacity-90 transition">${customText}</button>`;
      case "card":
        return `<div class="${classes} max-w-sm">\n  <h3 class="text-lg font-bold mb-2">Card Title</h3>\n  <p class="opacity-80">${customText}</p>\n</div>`;
      case "input":
        return `<input type="text" class="${classes} outline-none focus:ring-2 focus:ring-indigo-400 w-full" placeholder="${customText}" />`;
      case "badge":
        return `<span class="${classes} inline-block">${customText}</span>`;
      case "alert":
        return `<div class="${classes} flex items-center gap-2">\n  <span class="font-bold">Note:</span>\n  <span>${customText}</span>\n</div>`;
    }
  }, [elementType, classes, customText]);

  const copy = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(""), 1500);
  };

  const Select = ({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) => (
    <div>
      <label className="text-xs font-semibold text-gray-600 block mb-1">{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)} className="calc-input !py-1.5 text-xs">
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Element Type */}
      <div className="flex flex-wrap gap-2">
        {(["button", "card", "input", "badge", "alert"] as ElementType[]).map(t => (
          <button key={t} onClick={() => setElementType(t)} className={`text-sm px-4 py-2 rounded-lg border-2 font-medium capitalize ${elementType === t ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "border-gray-200 hover:border-gray-400"}`}>
            {t}
          </button>
        ))}
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-600 block mb-1">Text Content</label>
        <input value={customText} onChange={e => setCustomText(e.target.value)} className="calc-input text-sm" placeholder="Content text" />
      </div>

      {/* Customization */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        <Select label="Padding" value={padding} onChange={setPadding} options={PADDING} />
        <Select label="Margin" value={margin} onChange={setMargin} options={MARGIN} />
        <Select label="Background" value={bgColor} onChange={setBgColor} options={BG_COLORS} />
        <Select label="Text Color" value={textColor} onChange={setTextColor} options={TEXT_COLORS} />
        <Select label="Border Radius" value={borderRadius} onChange={setBorderRadius} options={BORDER_RADIUS} />
        <Select label="Shadow" value={shadow} onChange={setShadow} options={SHADOW} />
        <Select label="Font Size" value={fontSize} onChange={setFontSize} options={FONT_SIZE} />
        <Select label="Font Weight" value={fontWeight} onChange={setFontWeight} options={FONT_WEIGHT} />
        <Select label="Border" value={border} onChange={setBorder} options={BORDER} />
      </div>

      {/* Live Preview */}
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Live Preview</label>
        <div className="result-card p-8 flex items-center justify-center min-h-[120px]" style={{ background: "repeating-conic-gradient(#f3f4f6 0% 25%, #fff 0% 50%) 0 0 / 20px 20px" }}>
          <div dangerouslySetInnerHTML={{ __html: htmlCode }} />
        </div>
      </div>

      {/* Classes */}
      <div>
        <div className="flex justify-between mb-2">
          <label className="text-sm font-semibold text-gray-700">Tailwind Classes</label>
          <button onClick={() => copy(classes, "classes")} className="text-xs text-indigo-600 font-medium hover:underline">{copied === "classes" ? "Copied!" : "Copy"}</button>
        </div>
        <div className="result-card bg-gray-50 p-3 font-mono text-sm break-all">{classes}</div>
      </div>

      {/* HTML */}
      <div>
        <div className="flex justify-between mb-2">
          <label className="text-sm font-semibold text-gray-700">Full HTML</label>
          <button onClick={() => copy(htmlCode, "html")} className="text-xs text-indigo-600 font-medium hover:underline">{copied === "html" ? "Copied!" : "Copy"}</button>
        </div>
        <pre className="result-card font-mono text-xs whitespace-pre-wrap bg-gray-900 text-green-400 p-4 rounded-xl overflow-x-auto">{htmlCode}</pre>
      </div>
    </div>
  );
}
