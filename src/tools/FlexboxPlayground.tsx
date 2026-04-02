"use client";
import { useState, useMemo } from "react";

interface FlexItem {
  id: number;
  flexGrow: number;
  flexShrink: number;
  flexBasis: string;
  alignSelf: string;
  order: number;
}

let itemId = 4;

export default function FlexboxPlayground() {
  const [direction, setDirection] = useState("row");
  const [justifyContent, setJustifyContent] = useState("flex-start");
  const [alignItems, setAlignItems] = useState("stretch");
  const [flexWrap, setFlexWrap] = useState("nowrap");
  const [gap, setGap] = useState("10");
  const [items, setItems] = useState<FlexItem[]>([
    { id: 1, flexGrow: 0, flexShrink: 1, flexBasis: "auto", alignSelf: "auto", order: 0 },
    { id: 2, flexGrow: 0, flexShrink: 1, flexBasis: "auto", alignSelf: "auto", order: 0 },
    { id: 3, flexGrow: 0, flexShrink: 1, flexBasis: "auto", alignSelf: "auto", order: 0 },
  ]);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const addItem = () => {
    itemId++;
    setItems([...items, { id: itemId, flexGrow: 0, flexShrink: 1, flexBasis: "auto", alignSelf: "auto", order: 0 }]);
  };

  const removeItem = (id: number) => {
    setItems(items.filter(i => i.id !== id));
    if (selectedItem === id) setSelectedItem(null);
  };

  const updateItem = (id: number, field: keyof FlexItem, value: number | string) => {
    setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  const selectedItemData = items.find(i => i.id === selectedItem);

  const cssCode = useMemo(() => {
    let code = `.flex-container {
  display: flex;
  flex-direction: ${direction};
  justify-content: ${justifyContent};
  align-items: ${alignItems};
  flex-wrap: ${flexWrap};
  gap: ${gap}px;
}`;
    items.forEach((item, idx) => {
      const props: string[] = [];
      if (item.flexGrow !== 0) props.push(`flex-grow: ${item.flexGrow}`);
      if (item.flexShrink !== 1) props.push(`flex-shrink: ${item.flexShrink}`);
      if (item.flexBasis !== "auto") props.push(`flex-basis: ${item.flexBasis}`);
      if (item.alignSelf !== "auto") props.push(`align-self: ${item.alignSelf}`);
      if (item.order !== 0) props.push(`order: ${item.order}`);
      if (props.length > 0) {
        code += `\n\n.item-${idx + 1} {\n  ${props.join(";\n  ")};\n}`;
      }
    });
    return code;
  }, [direction, justifyContent, alignItems, flexWrap, gap, items]);

  const copy = () => {
    navigator.clipboard?.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const COLORS = ["#6366f1", "#f43f5e", "#10b981", "#f59e0b", "#3b82f6", "#8b5cf6", "#ec4899", "#14b8a6"];

  return (
    <div className="space-y-6">
      {/* Container Properties */}
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Container Properties</label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div>
            <label className="text-xs text-gray-600 block mb-1">flex-direction</label>
            <select value={direction} onChange={e => setDirection(e.target.value)} className="calc-input !py-1.5 text-sm">
              {["row", "row-reverse", "column", "column-reverse"].map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-600 block mb-1">justify-content</label>
            <select value={justifyContent} onChange={e => setJustifyContent(e.target.value)} className="calc-input !py-1.5 text-sm">
              {["flex-start", "flex-end", "center", "space-between", "space-around", "space-evenly"].map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-600 block mb-1">align-items</label>
            <select value={alignItems} onChange={e => setAlignItems(e.target.value)} className="calc-input !py-1.5 text-sm">
              {["stretch", "flex-start", "flex-end", "center", "baseline"].map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-600 block mb-1">flex-wrap</label>
            <select value={flexWrap} onChange={e => setFlexWrap(e.target.value)} className="calc-input !py-1.5 text-sm">
              {["nowrap", "wrap", "wrap-reverse"].map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-600 block mb-1">gap (px)</label>
            <input type="number" min={0} value={gap} onChange={e => setGap(e.target.value)} className="calc-input !py-1.5 text-sm" />
          </div>
        </div>
      </div>

      {/* Items */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <label className="text-sm font-semibold text-gray-700">Flex Items ({items.length})</label>
          <button onClick={addItem} className="btn-secondary text-xs !py-1 !px-2">+ Add Item</button>
        </div>
        <div className="flex flex-wrap gap-2">
          {items.map((item, idx) => (
            <div key={item.id} className="flex items-center gap-1">
              <button onClick={() => setSelectedItem(item.id === selectedItem ? null : item.id)} className={`text-xs px-3 py-1.5 rounded-lg border-2 font-medium ${selectedItem === item.id ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "border-gray-200 hover:border-gray-400"}`}>
                Item {idx + 1}
              </button>
              <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600 text-sm">&times;</button>
            </div>
          ))}
        </div>
      </div>

      {/* Selected item properties */}
      {selectedItemData && (
        <div className="border border-indigo-200 rounded-xl p-4 bg-indigo-50/50">
          <label className="text-sm font-semibold text-indigo-700 block mb-2">Item {items.findIndex(i => i.id === selectedItem) + 1} Properties</label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div>
              <label className="text-xs text-gray-600 block mb-1">flex-grow</label>
              <input type="number" min={0} value={selectedItemData.flexGrow} onChange={e => updateItem(selectedItem!, "flexGrow", +e.target.value)} className="calc-input !py-1.5 text-sm" />
            </div>
            <div>
              <label className="text-xs text-gray-600 block mb-1">flex-shrink</label>
              <input type="number" min={0} value={selectedItemData.flexShrink} onChange={e => updateItem(selectedItem!, "flexShrink", +e.target.value)} className="calc-input !py-1.5 text-sm" />
            </div>
            <div>
              <label className="text-xs text-gray-600 block mb-1">flex-basis</label>
              <input value={selectedItemData.flexBasis} onChange={e => updateItem(selectedItem!, "flexBasis", e.target.value)} className="calc-input !py-1.5 text-sm" placeholder="auto" />
            </div>
            <div>
              <label className="text-xs text-gray-600 block mb-1">align-self</label>
              <select value={selectedItemData.alignSelf} onChange={e => updateItem(selectedItem!, "alignSelf", e.target.value)} className="calc-input !py-1.5 text-sm">
                {["auto", "flex-start", "flex-end", "center", "stretch", "baseline"].map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-600 block mb-1">order</label>
              <input type="number" value={selectedItemData.order} onChange={e => updateItem(selectedItem!, "order", +e.target.value)} className="calc-input !py-1.5 text-sm" />
            </div>
          </div>
        </div>
      )}

      {/* Live Preview */}
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Live Preview</label>
        <div className="result-card p-4">
          <div style={{
            display: "flex", flexDirection: direction as React.CSSProperties["flexDirection"],
            justifyContent, alignItems, flexWrap: flexWrap as React.CSSProperties["flexWrap"],
            gap: `${gap}px`, minHeight: 200, border: "2px dashed #e5e7eb", borderRadius: 12, padding: 16,
          }}>
            {items.map((item, idx) => (
              <div key={item.id} onClick={() => setSelectedItem(item.id)} style={{
                flexGrow: item.flexGrow, flexShrink: item.flexShrink,
                flexBasis: item.flexBasis === "auto" ? undefined : item.flexBasis,
                alignSelf: item.alignSelf === "auto" ? undefined : item.alignSelf as React.CSSProperties["alignSelf"],
                order: item.order,
                backgroundColor: COLORS[idx % COLORS.length],
                minWidth: 60, minHeight: 60, borderRadius: 8,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer",
                border: selectedItem === item.id ? "3px solid #1e1b4b" : "none",
              }}>
                {idx + 1}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CSS Output */}
      <div>
        <div className="flex justify-between mb-2">
          <label className="text-sm font-semibold text-gray-700">CSS Code</label>
          <button onClick={copy} className="text-xs text-indigo-600 font-medium hover:underline">{copied ? "Copied!" : "Copy"}</button>
        </div>
        <pre className="result-card font-mono text-sm whitespace-pre-wrap bg-gray-900 text-green-400 p-4 rounded-xl overflow-x-auto">{cssCode}</pre>
      </div>
    </div>
  );
}
