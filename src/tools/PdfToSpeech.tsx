"use client";
import { useState, useEffect, useRef, useCallback } from "react";

/**
 * PDF to Speech — upload a PDF, listen to it.
 *
 * 100% client-side:
 *   - PDF text extraction uses the same regex-based parser as
 *     PdfToWord.tsx (BT/ET text blocks → readable strings). Works
 *     for text-PDFs (study notes, articles, reports, e-books with
 *     selectable text). Image-only / scanned PDFs aren't supported
 *     here — they need OCR which is a separate tool.
 *   - Text-to-speech uses the browser's built-in Web Speech API
 *     (`speechSynthesis`). Free, no API key, supports Indian English
 *     and (where the OS provides them) Hindi voices.
 *
 * Privacy: the file you upload NEVER leaves your browser. The PDF
 * is read into memory, parsed locally, and read aloud by your
 * device. Nothing is uploaded to any server.
 *
 * Download-as-MP3 is NOT supported here because the Web Speech API
 * doesn't expose the synthesised audio as a downloadable buffer.
 * For an MP3 file you'd need a paid TTS service (Google Cloud TTS,
 * AWS Polly, etc.) — out of scope for a free tool. Workaround for
 * users who want offline audio: use a screen-recorder while the
 * page plays.
 */

interface PdfTextResult {
  text: string;
  pageEstimate: number;
}

const MAX_FILE_BYTES = 30 * 1024 * 1024; // 30 MB cap — reasonable for client memory.

function extractPdfText(buffer: ArrayBuffer): PdfTextResult {
  // Reuses the BT/ET text-block extraction from PdfToWord — fast,
  // dependency-free, works on most text PDFs.
  const bytes = new Uint8Array(buffer);
  const raw = new TextDecoder("utf-8", { fatal: false }).decode(bytes);

  const pageMatches = raw.match(/\/Type\s*\/Page[^s]/g);
  const pageEstimate = pageMatches
    ? pageMatches.length
    : Math.max(1, Math.ceil(bytes.length / 3000));

  const extracted: string[] = [];
  const btBlocks = raw.match(/BT[\s\S]*?ET/g) || [];
  for (const block of btBlocks) {
    const parts = block.match(/\(([^)]*)\)/g) || [];
    for (const p of parts) {
      const inner = p.slice(1, -1);
      if (inner.trim().length > 0) extracted.push(inner);
    }
  }

  // Fallback for PDFs with non-standard text encoding.
  if (extracted.length === 0) {
    const streams = raw.match(/stream[\s\S]*?endstream/g) || [];
    for (const s of streams) {
      const readable = s
        .replace(/stream|endstream/g, "")
        .replace(/[^\x20-\x7E\n\r\t]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      if (readable.length > 20) extracted.push(readable);
    }
  }

  return {
    text: extracted.join("\n").replace(/\s+/g, " ").trim(),
    pageEstimate,
  };
}

export default function PdfToSpeech() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [pageEstimate, setPageEstimate] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState("");
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [spokenChars, setSpokenChars] = useState(0); // For the progress bar.

  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  // ── Load voices (browser populates them asynchronously on Chrome) ──
  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const load = () => {
      const list = window.speechSynthesis.getVoices();
      setVoices(list);
      // Prefer Indian English, then Hindi, then any English, then any voice.
      if (list.length > 0 && !selectedVoice) {
        const pick =
          list.find((v) => /en-IN/i.test(v.lang)) ||
          list.find((v) => /hi-IN/i.test(v.lang)) ||
          list.find((v) => /^en/i.test(v.lang)) ||
          list[0];
        if (pick) setSelectedVoice(pick.name);
      }
    };
    load();
    window.speechSynthesis.addEventListener("voiceschanged", load);
    return () =>
      window.speechSynthesis.removeEventListener("voiceschanged", load);
  }, [selectedVoice]);

  // ── Cleanup on unmount: cancel any in-flight speech. ──
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const isAcceptedFile = (f: File): boolean => {
    if (f.type === "application/pdf") return true;
    const ext = f.name.split(".").pop()?.toLowerCase() || "";
    return ext === "pdf";
  };

  const processFile = useCallback(async (f: File) => {
    setError("");
    if (!isAcceptedFile(f)) {
      setError(`"${f.name}" is not a PDF file.`);
      return;
    }
    if (f.size > MAX_FILE_BYTES) {
      setError(
        `File is ${(f.size / 1024 / 1024).toFixed(1)} MB. The limit is 30 MB so the page stays responsive. Split your PDF first.`
      );
      return;
    }
    setFile(f);
    setLoading(true);
    setText("");
    setPageEstimate(0);
    try {
      const buffer = await f.arrayBuffer();
      const { text: extracted, pageEstimate: p } = extractPdfText(buffer);
      setPageEstimate(p);
      if (!extracted) {
        setText("");
        setError(
          "We couldn't extract any text from this PDF. It may be a scanned image PDF (needs OCR) or use a non-standard encoding. Try a text-based PDF — e.g. one you can copy text from in Adobe Reader."
        );
      } else {
        setText(extracted);
      }
    } catch {
      setError("Couldn't read the PDF. Try another file.");
    }
    setLoading(false);
  }, []);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) processFile(f);
  };

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current += 1;
    if (e.dataTransfer?.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current <= 0) {
      dragCounter.current = 0;
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter.current = 0;
      setIsDragging(false);
      const f = e.dataTransfer?.files?.[0];
      if (f) processFile(f);
    },
    [processFile]
  );

  // ── Playback controls ───────────────────────────────────────────
  const handlePlay = () => {
    if (!text.trim()) return;
    if (typeof window === "undefined" || !window.speechSynthesis) {
      setError("Your browser doesn't support speech synthesis.");
      return;
    }
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
    utter.rate = rate;
    utter.pitch = pitch;
    setSpokenChars(0);
    utter.onboundary = (ev) => {
      // ev.charIndex is the start of the next word/sentence being spoken.
      if (typeof ev.charIndex === "number") setSpokenChars(ev.charIndex);
    };
    utter.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setSpokenChars(text.length);
    };
    utter.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };
    utterRef.current = utter;
    window.speechSynthesis.speak(utter);
    setIsPlaying(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    window.speechSynthesis?.pause();
    setIsPaused(true);
    setIsPlaying(false);
  };

  const handleStop = () => {
    window.speechSynthesis?.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setSpokenChars(0);
  };

  const downloadText = () => {
    if (!text) return;
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = file ? file.name.replace(/\.pdf$/i, "") + ".txt" : "pdf-text.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
  };

  // Group voices by language for the dropdown.
  const voiceGroups = (() => {
    const grouped: Record<string, SpeechSynthesisVoice[]> = {};
    voices.forEach((v) => {
      const lang = v.lang || "Other";
      if (!grouped[lang]) grouped[lang] = [];
      grouped[lang].push(v);
    });
    return Object.entries(grouped).sort(([a], [b]) => {
      // en-IN and hi-IN pinned to the top
      if (a.startsWith("en-IN") || a.startsWith("hi-IN")) return -1;
      if (b.startsWith("en-IN") || b.startsWith("hi-IN")) return 1;
      return a.localeCompare(b);
    });
  })();

  const progress =
    text.length > 0 ? Math.min(100, (spokenChars / text.length) * 100) : 0;

  return (
    <div className="space-y-5">
      {/* Upload zone */}
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition ${
          isDragging
            ? "border-indigo-500 bg-indigo-50"
            : "border-gray-300 hover:border-indigo-400 hover:bg-indigo-50/30"
        }`}
      >
        <div className="text-4xl mb-2">📄</div>
        <p className="font-semibold text-gray-800">
          {file ? file.name : "Drop a PDF here, or click to choose"}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {file
            ? `${(file.size / 1024).toFixed(0)} KB · ${pageEstimate || "?"} pages · ${text.length.toLocaleString()} chars extracted`
            : "Up to 30 MB · Text-based PDFs · Stays on your device"}
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          onChange={handleFile}
          className="hidden"
        />
      </div>

      {/* Errors / loading */}
      {loading && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-sm text-indigo-700">
          ⏳ Extracting text from your PDF…
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
          ❌ {error}
        </div>
      )}

      {/* Extracted text — editable so users can clean up garbled lines */}
      {text && (
        <div>
          <div className="flex items-end justify-between mb-1 flex-wrap gap-2">
            <label className="text-xs font-semibold text-gray-600">
              Extracted text (you can edit this before listening)
            </label>
            <span className="text-[11px] text-gray-400 tabular-nums">
              {text.length.toLocaleString()} chars · ~
              {Math.ceil(text.split(/\s+/).length / 150)} min at 1× speed
            </span>
          </div>
          <textarea
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              handleStop(); // Stop playback if text changes mid-read.
            }}
            rows={8}
            className="calc-input w-full min-h-[180px] text-sm leading-relaxed"
          />
        </div>
      )}

      {/* Voice + speed + pitch controls */}
      {text && (
        <div className="result-card">
          <h3 className="font-bold text-gray-800 mb-3">🎙️ Voice settings</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">
                Voice ({voices.length} available)
              </label>
              {voices.length === 0 ? (
                <p className="text-xs text-gray-500 mt-2">
                  Loading available voices… (some browsers populate them on first use)
                </p>
              ) : (
                <select
                  value={selectedVoice}
                  onChange={(e) => setSelectedVoice(e.target.value)}
                  className="calc-input w-full"
                >
                  {voiceGroups.map(([lang, vs]) => (
                    <optgroup
                      key={lang}
                      label={
                        lang === "en-IN"
                          ? "🇮🇳 Indian English"
                          : lang === "hi-IN"
                            ? "🇮🇳 Hindi"
                            : lang
                      }
                    >
                      {vs.map((v) => (
                        <option key={v.name} value={v.name}>
                          {v.name}
                          {v.localService ? "" : " (online)"}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              )}
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-gray-600">Speed</span>
                  <span className="text-indigo-600 font-bold tabular-nums">
                    {rate.toFixed(1)}×
                  </span>
                </div>
                <input
                  type="range"
                  min={0.5}
                  max={2}
                  step={0.1}
                  value={rate}
                  onChange={(e) => setRate(parseFloat(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-gray-600">Pitch</span>
                  <span className="text-indigo-600 font-bold tabular-nums">
                    {pitch.toFixed(1)}
                  </span>
                </div>
                <input
                  type="range"
                  min={0.5}
                  max={2}
                  step={0.1}
                  value={pitch}
                  onChange={(e) => setPitch(parseFloat(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>
            </div>
          </div>

          {/* Playback buttons */}
          <div className="flex flex-wrap gap-2">
            {!isPlaying ? (
              <button
                onClick={handlePlay}
                disabled={!text.trim()}
                className="btn-primary px-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                ▶️ {isPaused ? "Resume" : "Play"}
              </button>
            ) : (
              <button
                onClick={handlePause}
                className="btn-primary px-6 flex items-center gap-2 bg-amber-500 hover:bg-amber-600"
              >
                ⏸️ Pause
              </button>
            )}
            <button
              onClick={handleStop}
              disabled={!isPlaying && !isPaused}
              className="px-4 py-2 text-sm font-semibold text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              ⏹️ Stop
            </button>
            <button
              onClick={downloadText}
              className="px-4 py-2 text-sm font-semibold text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition flex items-center gap-1"
            >
              ⬇️ Download text (.txt)
            </button>
          </div>

          {/* Progress bar (advances as Web Speech fires onboundary) */}
          {(isPlaying || isPaused || progress > 0) && (
            <div className="mt-4">
              <div className="flex justify-between text-[11px] text-gray-500 mb-1">
                <span>{Math.round(progress)}% read</span>
                <span>
                  {spokenChars.toLocaleString()} / {text.length.toLocaleString()} chars
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Honest info panel */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-5 text-xs text-gray-600 leading-relaxed">
        <p className="font-bold text-gray-800 mb-1">How it works</p>
        <p>
          Your PDF stays on your device. We read it in your browser, pull
          out the text, and your operating system&apos;s built-in
          text-to-speech voices read it aloud. Nothing is uploaded to any
          server.
        </p>
        <p className="mt-2">
          <strong>Voice quality varies by device.</strong> Macs and recent
          iPhones / Android phones have natural-sounding Indian English and
          Hindi voices. Windows voices can sound more robotic. Linux may
          have limited voices. If the voice list is empty, your browser is
          still loading voices — wait a few seconds.
        </p>
        <p className="mt-2">
          <strong>What this tool can&apos;t do:</strong> read scanned /
          image-only PDFs (those need OCR — try our PDF to Image tool first
          and a separate OCR step), or download the audio as an MP3 file
          (the browser plays speech but doesn&apos;t expose it as a
          file). For an offline MP3, screen-record the page while it
          plays.
        </p>
      </div>
    </div>
  );
}
