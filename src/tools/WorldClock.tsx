"use client";
import { useState, useEffect } from "react";

const cities = [
  { name: "New Delhi", zone: "Asia/Kolkata", flag: "🇮🇳" },
  { name: "New York", zone: "America/New_York", flag: "🇺🇸" },
  { name: "London", zone: "Europe/London", flag: "🇬🇧" },
  { name: "Tokyo", zone: "Asia/Tokyo", flag: "🇯🇵" },
  { name: "Dubai", zone: "Asia/Dubai", flag: "🇦🇪" },
  { name: "Sydney", zone: "Australia/Sydney", flag: "🇦🇺" },
  { name: "Singapore", zone: "Asia/Singapore", flag: "🇸🇬" },
  { name: "Paris", zone: "Europe/Paris", flag: "🇫🇷" },
  { name: "Los Angeles", zone: "America/Los_Angeles", flag: "🇺🇸" },
  { name: "Shanghai", zone: "Asia/Shanghai", flag: "🇨🇳" },
  { name: "Toronto", zone: "America/Toronto", flag: "🇨🇦" },
  { name: "Berlin", zone: "Europe/Berlin", flag: "🇩🇪" },
];

export default function WorldClock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cities.map((city) => {
        const time = now.toLocaleString("en-US", { timeZone: city.zone, hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true });
        const date = now.toLocaleString("en-US", { timeZone: city.zone, weekday: "short", month: "short", day: "numeric" });
        const hour = parseInt(now.toLocaleString("en-US", { timeZone: city.zone, hour: "numeric", hour12: false }));
        const isDay = hour >= 6 && hour < 18;
        return (
          <div key={city.name} className={`rounded-2xl p-5 border ${isDay ? "bg-amber-50 border-amber-100" : "bg-slate-800 border-slate-700"}`}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{city.flag}</span>
              <div>
                <div className={`font-bold ${isDay ? "text-gray-800" : "text-white"}`}>{city.name}</div>
                <div className={`text-xs ${isDay ? "text-gray-500" : "text-gray-400"}`}>{date}</div>
              </div>
              <span className="ml-auto text-xl">{isDay ? "☀️" : "🌙"}</span>
            </div>
            <div className={`text-2xl font-extrabold font-mono ${isDay ? "text-gray-900" : "text-white"}`}>{time}</div>
          </div>
        );
      })}
    </div>
  );
}
