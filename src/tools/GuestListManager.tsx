"use client";
import { useState, useMemo } from "react";

interface Guest {
  id: number;
  name: string;
  side: "bride" | "groom";
  category: "family" | "friends" | "colleagues" | "neighbors";
  rsvp: "pending" | "confirmed" | "declined";
}

const categoryLabels: Record<string, string> = { family: "Family", friends: "Friends", colleagues: "Colleagues", neighbors: "Neighbors" };
const sideLabels: Record<string, string> = { bride: "Bride", groom: "Groom" };
const rsvpLabels: Record<string, string> = { pending: "Pending", confirmed: "Confirmed", declined: "Declined" };
const rsvpColors: Record<string, string> = { pending: "bg-yellow-100 text-yellow-700", confirmed: "bg-green-100 text-green-700", declined: "bg-red-100 text-red-700" };

export default function GuestListManager() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [name, setName] = useState("");
  const [side, setSide] = useState<Guest["side"]>("bride");
  const [category, setCategory] = useState<Guest["category"]>("family");
  const [rsvp, setRsvp] = useState<Guest["rsvp"]>("pending");
  const [search, setSearch] = useState("");
  const [filterSide, setFilterSide] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterRsvp, setFilterRsvp] = useState<string>("all");
  const [nextId, setNextId] = useState(1);

  const addGuest = () => {
    if (!name.trim()) return;
    setGuests((prev) => [...prev, { id: nextId, name: name.trim(), side, category, rsvp }]);
    setNextId((n) => n + 1);
    setName("");
  };

  const removeGuest = (id: number) => {
    setGuests((prev) => prev.filter((g) => g.id !== id));
  };

  const updateRsvp = (id: number, newRsvp: Guest["rsvp"]) => {
    setGuests((prev) => prev.map((g) => (g.id === id ? { ...g, rsvp: newRsvp } : g)));
  };

  const filtered = useMemo(() => {
    return guests.filter((g) => {
      if (search && !g.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (filterSide !== "all" && g.side !== filterSide) return false;
      if (filterCategory !== "all" && g.category !== filterCategory) return false;
      if (filterRsvp !== "all" && g.rsvp !== filterRsvp) return false;
      return true;
    });
  }, [guests, search, filterSide, filterCategory, filterRsvp]);

  const stats = useMemo(() => {
    const total = guests.length;
    const confirmed = guests.filter((g) => g.rsvp === "confirmed").length;
    const pending = guests.filter((g) => g.rsvp === "pending").length;
    const declined = guests.filter((g) => g.rsvp === "declined").length;
    const bySide = { bride: guests.filter((g) => g.side === "bride").length, groom: guests.filter((g) => g.side === "groom").length };
    const byCat = {
      family: guests.filter((g) => g.category === "family").length,
      friends: guests.filter((g) => g.category === "friends").length,
      colleagues: guests.filter((g) => g.category === "colleagues").length,
      neighbors: guests.filter((g) => g.category === "neighbors").length,
    };
    return { total, confirmed, pending, declined, bySide, byCat };
  }, [guests]);

  const exportList = () => {
    const lines = filtered.map((g) => `${g.name} | ${sideLabels[g.side]} Side | ${categoryLabels[g.category]} | ${rsvpLabels[g.rsvp]}`);
    const text = `Wedding Guest List (${filtered.length} guests)\n${"=".repeat(50)}\n${lines.join("\n")}`;
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-8">
      {/* Add Guest Form */}
      <div className="result-card space-y-4">
        <h3 className="text-lg font-bold text-gray-800">Add Guest</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <input
            type="text"
            placeholder="Guest Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addGuest()}
            className="calc-input"
          />
          <select value={side} onChange={(e) => setSide(e.target.value as Guest["side"])} className="calc-input">
            <option value="bride">Bride Side</option>
            <option value="groom">Groom Side</option>
          </select>
          <select value={category} onChange={(e) => setCategory(e.target.value as Guest["category"])} className="calc-input">
            <option value="family">Family</option>
            <option value="friends">Friends</option>
            <option value="colleagues">Colleagues</option>
            <option value="neighbors">Neighbors</option>
          </select>
          <select value={rsvp} onChange={(e) => setRsvp(e.target.value as Guest["rsvp"])} className="calc-input">
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="declined">Declined</option>
          </select>
        </div>
        <button onClick={addGuest} className="btn-primary">Add Guest</button>
      </div>

      {/* Stats */}
      {guests.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
            <div className="text-xs font-medium text-gray-500 mb-1">Total</div>
            <div className="text-2xl font-extrabold text-indigo-600">{stats.total}</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
            <div className="text-xs font-medium text-gray-500 mb-1">Confirmed</div>
            <div className="text-2xl font-extrabold text-green-600">{stats.confirmed}</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
            <div className="text-xs font-medium text-gray-500 mb-1">Pending</div>
            <div className="text-2xl font-extrabold text-yellow-600">{stats.pending}</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
            <div className="text-xs font-medium text-gray-500 mb-1">Declined</div>
            <div className="text-2xl font-extrabold text-red-500">{stats.declined}</div>
          </div>
        </div>
      )}

      {/* By Side & Category */}
      {guests.length > 0 && (
        <div className="result-card">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-white rounded-xl p-3 shadow-sm text-center">
              <div className="text-xs text-gray-500">Bride Side</div>
              <div className="text-lg font-bold text-pink-600">{stats.bySide.bride}</div>
            </div>
            <div className="bg-white rounded-xl p-3 shadow-sm text-center">
              <div className="text-xs text-gray-500">Groom Side</div>
              <div className="text-lg font-bold text-blue-600">{stats.bySide.groom}</div>
            </div>
            {Object.entries(stats.byCat).map(([k, v]) => (
              <div key={k} className="bg-white rounded-xl p-3 shadow-sm text-center">
                <div className="text-xs text-gray-500">{categoryLabels[k]}</div>
                <div className="text-lg font-bold text-gray-700">{v}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter & Search */}
      {guests.length > 0 && (
        <div className="result-card space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-800">Guest List</h3>
            <button onClick={exportList} className="btn-secondary text-xs px-3 py-1">Copy List</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <input type="text" placeholder="Search by name..." value={search} onChange={(e) => setSearch(e.target.value)} className="calc-input" />
            <select value={filterSide} onChange={(e) => setFilterSide(e.target.value)} className="calc-input">
              <option value="all">All Sides</option>
              <option value="bride">Bride Side</option>
              <option value="groom">Groom Side</option>
            </select>
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="calc-input">
              <option value="all">All Categories</option>
              <option value="family">Family</option>
              <option value="friends">Friends</option>
              <option value="colleagues">Colleagues</option>
              <option value="neighbors">Neighbors</option>
            </select>
            <select value={filterRsvp} onChange={(e) => setFilterRsvp(e.target.value)} className="calc-input">
              <option value="all">All RSVP</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="declined">Declined</option>
            </select>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filtered.map((g) => (
              <div key={g.id} className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                <div className="flex-1">
                  <span className="font-semibold text-gray-800">{g.name}</span>
                  <span className="text-xs text-gray-400 ml-2">
                    {sideLabels[g.side]} | {categoryLabels[g.category]}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={g.rsvp}
                    onChange={(e) => updateRsvp(g.id, e.target.value as Guest["rsvp"])}
                    className={`text-xs font-semibold rounded-full px-3 py-1 border-0 ${rsvpColors[g.rsvp]}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="declined">Declined</option>
                  </select>
                  <button onClick={() => removeGuest(g.id)} className="text-red-400 hover:text-red-600 text-sm">✕</button>
                </div>
              </div>
            ))}
            {filtered.length === 0 && <p className="text-center text-gray-400 py-4">No guests found</p>}
          </div>
        </div>
      )}

      {guests.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <div className="text-4xl mb-2">👰🤵</div>
          <p>Add guests to get started with your wedding guest list</p>
        </div>
      )}
    </div>
  );
}
