"use client";
import { useState, useEffect, useRef } from "react";

export default function TextToSpeech() {
  const [text, setText] = useState("");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState("");
  const [speed, setSpeed] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const loadVoices = () => {
      const v = window.speechSynthesis?.getVoices() || [];
      setVoices(v);
      if (v.length > 0 && !selectedVoice) {
        setSelectedVoice(v[0].name);
      }
    };
    loadVoices();
    window.speechSynthesis?.addEventListener("voiceschanged", loadVoices);
    return () => window.speechSynthesis?.removeEventListener("voiceschanged", loadVoices);
  }, [selectedVoice]);

  const handlePlay = () => {
    if (!text.trim()) return;
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    const voice = voices.find((v) => v.name === selectedVoice);
    if (voice) utter.voice = voice;
    utter.rate = speed;
    utter.onend = () => { setIsPlaying(false); setIsPaused(false); };
    utter.onerror = () => { setIsPlaying(false); setIsPaused(false); };
    utterRef.current = utter;
    window.speechSynthesis.speak(utter);
    setIsPlaying(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    window.speechSynthesis.pause();
    setIsPaused(true);
    setIsPlaying(false);
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  return (
    <div className="space-y-6">
      <textarea
        placeholder="Enter text to convert to speech..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="calc-input min-h-[200px] resize-y font-mono text-sm"
        rows={8}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Voice</label>
          <select
            value={selectedVoice}
            onChange={(e) => setSelectedVoice(e.target.value)}
            className="calc-input"
          >
            {voices.map((v) => (
              <option key={v.name} value={v.name}>
                {v.name} ({v.lang})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Speed: {speed.toFixed(1)}x
          </label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            className="w-full accent-indigo-600"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>0.5x</span>
            <span>1x</span>
            <span>2x</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
          <div className="text-xs font-medium text-gray-500">Characters</div>
          <div className="text-2xl font-extrabold text-indigo-600 mt-1">{text.length}</div>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
          <div className="text-xs font-medium text-gray-500">Words</div>
          <div className="text-2xl font-extrabold text-purple-600 mt-1">
            {text.trim() ? text.trim().split(/\s+/).length : 0}
          </div>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
          <div className="text-xs font-medium text-gray-500">Status</div>
          <div className={`text-lg font-extrabold mt-1 ${isPlaying ? "text-green-600" : isPaused ? "text-yellow-600" : "text-gray-400"}`}>
            {isPlaying ? "Playing" : isPaused ? "Paused" : "Stopped"}
          </div>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        <button onClick={handlePlay} className="btn-primary text-sm !py-2 !px-4" disabled={!text.trim()}>
          {isPaused ? "Resume" : "Play"}
        </button>
        <button onClick={handlePause} className="btn-secondary text-sm !py-2 !px-4" disabled={!isPlaying}>
          Pause
        </button>
        <button onClick={handleStop} className="btn-secondary text-sm !py-2 !px-4" disabled={!isPlaying && !isPaused}>
          Stop
        </button>
      </div>
    </div>
  );
}
