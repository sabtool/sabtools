"use client";
import { useState, useRef, useCallback } from "react";

export default function Stopwatch() {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef(0);

  const start = useCallback(() => {
    setRunning(true);
    startTimeRef.current = Date.now() - time;
    intervalRef.current = setInterval(() => { setTime(Date.now() - startTimeRef.current); }, 10);
  }, [time]);

  const stop = () => { setRunning(false); if (intervalRef.current) clearInterval(intervalRef.current); };
  const reset = () => { stop(); setTime(0); setLaps([]); };
  const lap = () => { setLaps((prev) => [...prev, time]); };

  const formatTime = (ms: number) => {
    const m = Math.floor(ms / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    const cs = Math.floor((ms % 1000) / 10);
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(cs).padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6 text-center">
      <div className="text-6xl sm:text-8xl font-extrabold font-mono text-indigo-600 tracking-wider">{formatTime(time)}</div>
      <div className="flex justify-center gap-3">
        {!running ? (<button onClick={start} className="btn-primary !px-8">{time === 0 ? "Start" : "Resume"}</button>) : (<button onClick={stop} className="btn-secondary !px-8 !border-red-500 !text-red-500">Stop</button>)}
        {running && <button onClick={lap} className="btn-secondary !px-8">Lap</button>}
        {time > 0 && !running && <button onClick={reset} className="btn-secondary !px-8">Reset</button>}
      </div>
      {laps.length > 0 && (
        <div className="max-w-sm mx-auto"><div className="table-responsive"><table><thead><tr><th>Lap</th><th>Time</th><th>Split</th></tr></thead><tbody>{laps.map((t, i) => (<tr key={i}><td>Lap {i + 1}</td><td className="font-mono text-indigo-600">{formatTime(t)}</td><td className="font-mono">{formatTime(i === 0 ? t : t - laps[i - 1])}</td></tr>))}</tbody></table></div></div>
      )}
    </div>
  );
}
