"use client";
import { useState, useMemo } from "react";

const presets: Record<string, { label: string; cron: string }> = {
  everyMinute: { label: "Every Minute", cron: "* * * * *" },
  hourly: { label: "Every Hour", cron: "0 * * * *" },
  daily: { label: "Daily at Midnight", cron: "0 0 * * *" },
  weekly: { label: "Weekly (Sunday)", cron: "0 0 * * 0" },
  monthly: { label: "Monthly (1st)", cron: "0 0 1 * *" },
  weekdays: { label: "Weekdays at 9 AM", cron: "0 9 * * 1-5" },
};

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function CronExpressionGenerator() {
  const [minute, setMinute] = useState("*");
  const [hour, setHour] = useState("*");
  const [dayOfMonth, setDayOfMonth] = useState("*");
  const [month, setMonth] = useState("*");
  const [dayOfWeek, setDayOfWeek] = useState("*");
  const [copied, setCopied] = useState(false);

  const cronExpression = `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;

  const applyPreset = (key: string) => {
    const parts = presets[key].cron.split(" ");
    setMinute(parts[0]);
    setHour(parts[1]);
    setDayOfMonth(parts[2]);
    setMonth(parts[3]);
    setDayOfWeek(parts[4]);
  };

  const description = useMemo(() => {
    const parts: string[] = [];
    if (minute === "*" && hour === "*") parts.push("Every minute");
    else if (minute === "*") parts.push(`Every minute of hour ${hour}`);
    else if (hour === "*") parts.push(`At minute ${minute} of every hour`);
    else parts.push(`At ${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`);

    if (dayOfMonth !== "*") parts.push(`on day ${dayOfMonth} of the month`);
    if (month !== "*") parts.push(`in ${monthNames[parseInt(month) - 1] || month}`);
    if (dayOfWeek !== "*") {
      const days = dayOfWeek.split(",").map((d) => {
        if (d.includes("-")) {
          const [s, e] = d.split("-").map(Number);
          return `${dayNames[s]}-${dayNames[e]}`;
        }
        return dayNames[parseInt(d)] || d;
      });
      parts.push(`on ${days.join(", ")}`);
    }
    return parts.join(" ");
  }, [minute, hour, dayOfMonth, month, dayOfWeek]);

  const nextRuns = useMemo(() => {
    // Simple next-run calculation for common patterns
    const runs: string[] = [];
    const now = new Date();

    for (let i = 0; i < 300 && runs.length < 5; i++) {
      const candidate = new Date(now.getTime() + i * 60000);
      const m = candidate.getMinutes();
      const h = candidate.getHours();
      const dom = candidate.getDate();
      const mon = candidate.getMonth() + 1;
      const dow = candidate.getDay();

      const matchField = (field: string, value: number, max: number): boolean => {
        if (field === "*") return true;
        return field.split(",").some((part) => {
          if (part.includes("-")) {
            const [s, e] = part.split("-").map(Number);
            return value >= s && value <= e;
          }
          if (part.includes("/")) {
            const [, step] = part.split("/");
            return value % parseInt(step) === 0;
          }
          return parseInt(part) === value;
        });
      };

      if (
        matchField(minute, m, 59) &&
        matchField(hour, h, 23) &&
        matchField(dayOfMonth, dom, 31) &&
        matchField(month, mon, 12) &&
        matchField(dayOfWeek, dow, 6)
      ) {
        runs.push(candidate.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }));
      }
    }
    return runs;
  }, [minute, hour, dayOfMonth, month, dayOfWeek]);

  const copy = () => {
    navigator.clipboard.writeText(cronExpression);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Presets */}
      <div>
        <label className="text-sm font-semibold text-gray-700 mb-2 block">Quick Presets</label>
        <div className="flex flex-wrap gap-2">
          {Object.entries(presets).map(([key, { label }]) => (
            <button key={key} onClick={() => applyPreset(key)} className="btn-secondary text-sm">
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Fields */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div>
          <label className="text-xs font-semibold text-gray-600 mb-1 block">Minute (0-59)</label>
          <input type="text" value={minute} onChange={(e) => setMinute(e.target.value)} className="calc-input w-full" placeholder="*" />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 mb-1 block">Hour (0-23)</label>
          <input type="text" value={hour} onChange={(e) => setHour(e.target.value)} className="calc-input w-full" placeholder="*" />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 mb-1 block">Day of Month (1-31)</label>
          <input type="text" value={dayOfMonth} onChange={(e) => setDayOfMonth(e.target.value)} className="calc-input w-full" placeholder="*" />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 mb-1 block">Month (1-12)</label>
          <input type="text" value={month} onChange={(e) => setMonth(e.target.value)} className="calc-input w-full" placeholder="*" />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 mb-1 block">Day of Week (0-6)</label>
          <input type="text" value={dayOfWeek} onChange={(e) => setDayOfWeek(e.target.value)} className="calc-input w-full" placeholder="*" />
        </div>
      </div>

      {/* Result */}
      <div className="result-card space-y-4">
        <div className="flex items-center justify-between bg-gray-900 text-green-400 rounded-xl p-4 font-mono text-xl">
          <span>{cronExpression}</span>
          <button onClick={copy} className="btn-secondary text-xs">
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <p className="text-sm text-gray-600 font-medium">{description}</p>

        {nextRuns.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Next 5 Run Times</h4>
            <ul className="space-y-1">
              {nextRuns.map((run, i) => (
                <li key={i} className="text-sm text-gray-600 bg-gray-50 rounded px-3 py-1">{run}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="bg-blue-50 rounded-xl p-4">
          <h4 className="text-sm font-semibold text-blue-800 mb-2">Cron Expression Fields</h4>
          <div className="text-xs text-blue-700 space-y-1">
            <div><strong>*</strong> = any value &nbsp; <strong>,</strong> = list (1,3,5) &nbsp; <strong>-</strong> = range (1-5) &nbsp; <strong>/</strong> = step (*/5)</div>
            <div className="font-mono mt-2">
              ┌───── minute (0-59) &nbsp; ┌───── hour (0-23) &nbsp; ┌───── day of month (1-31)<br />
              │ &nbsp; ┌───── month (1-12) &nbsp; │ &nbsp; ┌───── day of week (0-6, Sun=0)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
