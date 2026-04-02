"use client";
import { useState, useMemo } from "react";

type CoachType = "sleeper" | "3ac" | "2ac" | "1ac" | "general" | "cc";

interface Berth { num: number; type: string; position: string; }

const COACH_INFO: Record<CoachType, { label: string; berths: number; desc: string; tips: string[] }> = {
  sleeper: { label: "Sleeper (SL)", berths: 72, desc: "8 bays with 8 berths each + side berths", tips: ["Lower berths (1,4,9,12...) are best for elderly/families", "Side Lower is convenient for short journeys", "Avoid berths near toilet (65-72)", "Middle berth can be folded during daytime"] },
  "3ac": { label: "3rd AC (3A)", berths: 64, desc: "8 bays with 6+2 side berths", tips: ["Lower berths cost slightly more in some trains", "3AC has curtains for privacy", "Charging points near Lower and Side Lower", "Side Upper has less headroom"] },
  "2ac": { label: "2nd AC (2A)", berths: 46, desc: "Bays with 4 berths + 2 side berths", tips: ["More spacious than 3AC", "Individual reading lights available", "Lower berth can be used as seat during day", "Side Lower is wider than main berths"] },
  "1ac": { label: "1st AC (1A)", berths: 24, desc: "Private cabins with 2 or 4 berths", tips: ["Most premium class in Indian Railways", "Lockable cabin doors for security", "Includes bedding and meals", "Best for overnight long-distance travel"] },
  general: { label: "General (GN)", berths: 0, desc: "Unreserved seating compartment", tips: ["No reserved seats - first come first served", "Best to board early for seating", "Separate compartments for ladies", "Valid for any general ticket holder"] },
  cc: { label: "Chair Car (CC)", berths: 78, desc: "5 seats per row (3+2 configuration)", tips: ["Window seats: 1,4,6,9,11... for 3-side", "Aisle seats good for legroom", "Rotating chairs in Shatabdi Express", "CC available in Shatabdi/Jan Shatabdi"] },
};

function generateBerths(type: CoachType): Berth[] {
  const berths: Berth[] = [];
  if (type === "general") return [];

  if (type === "cc") {
    for (let i = 1; i <= 78; i++) {
      const row = Math.ceil(i / 5);
      const pos = i % 5;
      const position = pos === 1 || pos === 4 ? "Window" : pos === 0 || pos === 3 ? "Aisle" : "Middle";
      berths.push({ num: i, type: "Seat", position });
    }
    return berths;
  }

  if (type === "sleeper") {
    for (let bay = 0; bay < 8; bay++) {
      const base = bay * 8;
      berths.push({ num: base + 1, type: "Main", position: "Lower" });
      berths.push({ num: base + 2, type: "Main", position: "Middle" });
      berths.push({ num: base + 3, type: "Main", position: "Upper" });
      berths.push({ num: base + 4, type: "Main", position: "Lower" });
      berths.push({ num: base + 5, type: "Main", position: "Middle" });
      berths.push({ num: base + 6, type: "Main", position: "Upper" });
      berths.push({ num: base + 7, type: "Side", position: "Side Lower" });
      berths.push({ num: base + 8, type: "Side", position: "Side Upper" });
    }
    return berths;
  }

  if (type === "3ac") {
    for (let bay = 0; bay < 8; bay++) {
      const base = bay * 8;
      berths.push({ num: base + 1, type: "Main", position: "Lower" });
      berths.push({ num: base + 2, type: "Main", position: "Middle" });
      berths.push({ num: base + 3, type: "Main", position: "Upper" });
      berths.push({ num: base + 4, type: "Main", position: "Lower" });
      berths.push({ num: base + 5, type: "Main", position: "Middle" });
      berths.push({ num: base + 6, type: "Main", position: "Upper" });
      berths.push({ num: base + 7, type: "Side", position: "Side Lower" });
      berths.push({ num: base + 8, type: "Side", position: "Side Upper" });
    }
    return berths;
  }

  if (type === "2ac") {
    for (let bay = 0; bay < 7; bay++) {
      const base = bay * 6;
      berths.push({ num: base + 1, type: "Main", position: "Lower" });
      berths.push({ num: base + 2, type: "Main", position: "Upper" });
      berths.push({ num: base + 3, type: "Main", position: "Lower" });
      berths.push({ num: base + 4, type: "Main", position: "Upper" });
      berths.push({ num: base + 5, type: "Side", position: "Side Lower" });
      berths.push({ num: base + 6, type: "Side", position: "Side Upper" });
    }
    return berths;
  }

  if (type === "1ac") {
    for (let cabin = 0; cabin < 6; cabin++) {
      const base = cabin * 4;
      berths.push({ num: base + 1, type: "Cabin", position: "Lower" });
      berths.push({ num: base + 2, type: "Cabin", position: "Upper" });
      berths.push({ num: base + 3, type: "Cabin", position: "Lower" });
      berths.push({ num: base + 4, type: "Cabin", position: "Upper" });
    }
    return berths;
  }

  return berths;
}

const POS_COLORS: Record<string, string> = {
  Lower: "bg-green-100 border-green-300 text-green-800",
  Middle: "bg-yellow-100 border-yellow-300 text-yellow-800",
  Upper: "bg-red-100 border-red-300 text-red-800",
  "Side Lower": "bg-blue-100 border-blue-300 text-blue-800",
  "Side Upper": "bg-purple-100 border-purple-300 text-purple-800",
  Window: "bg-cyan-100 border-cyan-300 text-cyan-800",
  Aisle: "bg-gray-100 border-gray-300 text-gray-700",
};

export default function TrainSeatLayout() {
  const [coach, setCoach] = useState<CoachType>("sleeper");
  const [selected, setSelected] = useState<Berth | null>(null);

  const berths = useMemo(() => generateBerths(coach), [coach]);
  const info = COACH_INFO[coach];

  // Group into bays/rows
  const baySize = coach === "cc" ? 5 : coach === "2ac" ? 6 : coach === "1ac" ? 4 : 8;
  const bays: Berth[][] = [];
  for (let i = 0; i < berths.length; i += baySize) {
    bays.push(berths.slice(i, i + baySize));
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-1">Select Train Coach Type</label>
        <select className="calc-input" value={coach} onChange={(e) => { setCoach(e.target.value as CoachType); setSelected(null); }}>
          {Object.entries(COACH_INFO).map(([key, val]) => (
            <option key={key} value={key}>{val.label}</option>
          ))}
        </select>
        <div className="text-xs text-gray-500 mt-1">{info.desc} &middot; {info.berths > 0 ? `${info.berths} berths` : "Unreserved"}</div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(POS_COLORS).map(([pos, cls]) => {
          if (coach === "cc" && !["Window", "Aisle", "Middle"].includes(pos)) return null;
          if (coach !== "cc" && ["Window", "Aisle"].includes(pos)) return null;
          return <span key={pos} className={`px-2 py-1 rounded text-xs font-medium border ${cls}`}>{pos}</span>;
        })}
      </div>

      {/* Selected berth info */}
      {selected && (
        <div className="result-card bg-indigo-50 border border-indigo-200">
          <div className="text-sm font-semibold text-indigo-700">Berth #{selected.num}</div>
          <div className="text-xs text-gray-600">Type: {selected.type} &middot; Position: {selected.position}</div>
        </div>
      )}

      {/* Layout */}
      {coach === "general" ? (
        <div className="result-card text-center text-gray-500">
          <div className="text-lg font-bold mb-2">General Compartment</div>
          <div className="text-sm">Unreserved seating - no specific seat layout. Seats are long benches accommodating 3-4 passengers each side.</div>
        </div>
      ) : (
        <div className="result-card overflow-x-auto">
          <div className="space-y-3">
            {bays.map((bay, bi) => (
              <div key={bi} className="flex flex-wrap gap-1.5 pb-2 border-b border-gray-100 last:border-0">
                <span className="text-xs text-gray-400 w-full mb-1">{coach === "cc" ? `Row ${bi + 1}` : coach === "1ac" ? `Cabin ${bi + 1}` : `Bay ${bi + 1}`}</span>
                {bay.map((b) => (
                  <button
                    key={b.num}
                    className={`px-2.5 py-1.5 rounded border text-xs font-bold cursor-pointer transition-all hover:scale-105 ${POS_COLORS[b.position] || "bg-gray-50"} ${selected?.num === b.num ? "ring-2 ring-indigo-500" : ""}`}
                    onClick={() => setSelected(b)}
                  >
                    {b.num}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="result-card bg-yellow-50 border border-yellow-200">
        <div className="text-sm font-semibold text-yellow-800 mb-2">Tips for {info.label}</div>
        <ul className="text-xs text-yellow-700 space-y-1 list-disc list-inside">
          {info.tips.map((t, i) => <li key={i}>{t}</li>)}
        </ul>
      </div>
    </div>
  );
}
