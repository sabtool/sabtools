"use client";
import { useState } from "react";

export default function BorderRadiusGenerator() {
  const [tl, setTl] = useState(16);
  const [tr, setTr] = useState(16);
  const [br, setBr] = useState(16);
  const [bl, setBl] = useState(16);
  const [linked, setLinked] = useState(true);

  const setAll = (v: number) => { setTl(v); setTr(v); setBr(v); setBl(v); };
  const radius = `${tl}px ${tr}px ${br}px ${bl}px`;
  const css = `border-radius: ${radius};`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center py-16 bg-gray-100 rounded-2xl">
        <div className="w-48 h-48 bg-gradient-to-br from-indigo-500 to-purple-600" style={{ borderRadius: radius }} />
      </div>
      <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={linked} onChange={(e) => setLinked(e.target.checked)} className="w-4 h-4 rounded" /><span className="text-sm font-semibold text-gray-700">Link all corners</span></label>
      {linked ? (
        <div><label className="text-sm font-semibold text-gray-700 block mb-2">All Corners: {tl}px</label><input type="range" min={0} max={100} value={tl} onChange={(e) => setAll(+e.target.value)} className="w-full" /></div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div><label className="text-sm font-semibold text-gray-700 block mb-2">Top Left: {tl}px</label><input type="range" min={0} max={100} value={tl} onChange={(e) => setTl(+e.target.value)} className="w-full" /></div>
          <div><label className="text-sm font-semibold text-gray-700 block mb-2">Top Right: {tr}px</label><input type="range" min={0} max={100} value={tr} onChange={(e) => setTr(+e.target.value)} className="w-full" /></div>
          <div><label className="text-sm font-semibold text-gray-700 block mb-2">Bottom Left: {bl}px</label><input type="range" min={0} max={100} value={bl} onChange={(e) => setBl(+e.target.value)} className="w-full" /></div>
          <div><label className="text-sm font-semibold text-gray-700 block mb-2">Bottom Right: {br}px</label><input type="range" min={0} max={100} value={br} onChange={(e) => setBr(+e.target.value)} className="w-full" /></div>
        </div>
      )}
      <div className="flex gap-2 flex-wrap">{[{l:"None",v:0},{l:"Small",v:8},{l:"Medium",v:16},{l:"Large",v:24},{l:"XL",v:40},{l:"Full",v:50}].map((p) => (<button key={p.l} onClick={() => setAll(p.v)} className="px-4 py-2 rounded-xl text-sm font-semibold bg-gray-100 hover:bg-gray-200 transition">{p.l}</button>))}</div>
      <div className="result-card"><div className="flex justify-between mb-2"><label className="text-sm font-semibold text-gray-700">CSS Code</label><button onClick={() => navigator.clipboard?.writeText(css)} className="text-xs text-indigo-600 font-medium hover:underline">Copy</button></div><pre className="bg-gray-900 text-green-400 rounded-xl p-4 text-sm font-mono">{css}</pre></div>
    </div>
  );
}
