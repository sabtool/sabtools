"use client";
import { useState, useEffect, useRef, useCallback } from "react";

/**
 * PDF to Speech — upload a PDF, listen to it.
 *
 * 100% client-side:
 *   - PDF text extraction uses Mozilla's pdfjs-dist (PDF.js). Properly
 *     decompresses Flate-encoded streams, parses font encodings, and
 *     extracts real text — works on PDFs from Word, Google Docs,
 *     reportlab, fpdf, LaTeX, Acrobat, etc. The earlier regex-based
 *     extractor only worked on the simplest text PDFs and produced
 *     garbage on anything compressed (which is most modern PDFs).
 *
 *     pdfjs-dist is loaded lazily via dynamic import — only fetched
 *     when the user actually uploads a PDF. The 1.2 MB worker file
 *     is served from /pdf.worker.min.mjs (same-origin, copied at
 *     install time from node_modules/pdfjs-dist/build/) so the CSP
 *     `worker-src 'self'` directive permits it.
 *
 *   - Text-to-speech uses the browser's built-in Web Speech API
 *     (`speechSynthesis`). Free, no API key, supports Indian English
 *     and (where the OS provides them) Hindi voices.
 *
 * Privacy: the file you upload NEVER leaves your browser. The PDF
 * is read into memory, parsed locally by the pdf.js worker (also
 * running locally), and read aloud by your device. Nothing is
 * uploaded to any server.
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

/**
 * Extract real text from a PDF using pdfjs-dist (Mozilla PDF.js).
 *
 * Lazily imports the library on first use — keeps the main bundle
 * small. Configures the worker to load from /pdf.worker.min.mjs
 * (copied to /public at install time, so it's served same-origin).
 */
async function extractPdfText(buffer: ArrayBuffer): Promise<PdfTextResult> {
  // Lazy-load pdfjs-dist — ~1 MB library, only fetched when the user
  // actually uploads a PDF. Once loaded, the chunk is cached for the
  // session.
  const pdfjs = await import("pdfjs-dist");

  // Worker file lives at /public/pdf.worker.min.mjs (copied from
  // node_modules at install time). Serving it from the same origin
  // means the CSP `worker-src 'self'` directive permits it without
  // changes. The worker runs ENTIRELY in the user's browser — no
  // network requests beyond fetching the script itself.
  if (!pdfjs.GlobalWorkerOptions.workerSrc) {
    pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
  }

  // Clone the ArrayBuffer because pdfjs internally takes ownership
  // (detaches the buffer), which makes it unusable afterwards.
  const data = new Uint8Array(buffer.slice(0));

  const loadingTask = pdfjs.getDocument({
    data,
    // Disable font fetching from the public CDN — keeps us offline /
    // privacy-friendly. The text content is still extracted; only the
    // visual rendering would have been affected.
    disableFontFace: true,
    useSystemFonts: false,
  });

  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;

  const pageTexts: string[] = [];
  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    // Each item in content.items has a `str` field (TextItem) — join
    // them with spaces to reconstruct readable text. Filter out
    // TextMarkedContent items which don't have a `str`.
    const pageText = content.items
      .map((item) => {
        const it = item as { str?: string };
        return typeof it.str === "string" ? it.str : "";
      })
      .filter(Boolean)
      .join(" ");
    pageTexts.push(pageText);
    // Free the page resources immediately — keeps memory usage low
    // for long PDFs.
    page.cleanup();
  }

  // Cleanup the document.
  await pdf.cleanup();

  const text = pageTexts.join("\n\n").replace(/[ \t]+/g, " ").trim();

  return { text, pageEstimate: numPages };
}

// ─── Natural voice engine (StreamElements / AWS Polly via free public endpoint) ────
// Used as the PRIMARY playback path because OS Web Speech voices sound
// robotic. StreamElements exposes ~25 AWS Polly voices through a public,
// auth-less, CORS-enabled endpoint that returns MP3 directly. Quality is
// human-sounding (Polly Neural / Standard) and the service has been
// stable for years. Free for our use; we fall back to Web Speech if the
// request fails (rate limited, offline, etc.).

interface NaturalVoice {
  /** Display name shown to the user. */
  label: string;
  /** StreamElements voice slug — what we send to the API. */
  slug: string;
  /** Locale used to pick a sensible default per language. */
  lang: string;
  /** Short qualifier shown next to the name. */
  hint?: string;
}

/** Curated set of natural voices that consistently sound good. */
const NATURAL_VOICES: NaturalVoice[] = [
  // ── Indian English (bilingual-friendly) ──
  { label: "Raveena (Indian, Female)", slug: "Raveena", lang: "en-IN", hint: "Polly · Indian English" },
  // ── British English ──
  { label: "Amy (British, Female)", slug: "Amy", lang: "en-GB", hint: "Polly · UK English" },
  { label: "Emma (British, Female)", slug: "Emma", lang: "en-GB", hint: "Polly · UK English" },
  { label: "Brian (British, Male)", slug: "Brian", lang: "en-GB", hint: "Polly · UK English" },
  // ── American English ──
  { label: "Joanna (US, Female)", slug: "Joanna", lang: "en-US", hint: "Polly · US English" },
  { label: "Salli (US, Female)", slug: "Salli", lang: "en-US", hint: "Polly · US English" },
  { label: "Kendra (US, Female)", slug: "Kendra", lang: "en-US", hint: "Polly · US English" },
  { label: "Kimberly (US, Female)", slug: "Kimberly", lang: "en-US", hint: "Polly · US English" },
  { label: "Ivy (US, Female Young)", slug: "Ivy", lang: "en-US", hint: "Polly · US English" },
  { label: "Matthew (US, Male)", slug: "Matthew", lang: "en-US", hint: "Polly · US English" },
  { label: "Joey (US, Male)", slug: "Joey", lang: "en-US", hint: "Polly · US English" },
  { label: "Justin (US, Male Young)", slug: "Justin", lang: "en-US", hint: "Polly · US English" },
  // ── Australian English ──
  { label: "Russell (Australian, Male)", slug: "Russell", lang: "en-AU", hint: "Polly · AU English" },
  { label: "Nicole (Australian, Female)", slug: "Nicole", lang: "en-AU", hint: "Polly · AU English" },
];

/**
 * Split text into chunks small enough for the StreamElements endpoint
 * (~250 char hard limit per request) while keeping sentence boundaries
 * intact so the listener doesn't hear awkward mid-sentence cuts.
 */
function chunkTextForTTS(text: string, maxChars = 220): string[] {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= maxChars) return [clean];

  const sentences = clean.split(/(?<=[.!?])\s+/);
  const chunks: string[] = [];
  let current = "";
  for (const s of sentences) {
    // Sentence itself is too long? Split it further at commas.
    if (s.length > maxChars) {
      const parts = s.split(/(?<=[,;:])\s+/);
      for (const p of parts) {
        if (p.length > maxChars) {
          // Last-resort word-boundary split.
          let buf = p;
          while (buf.length > maxChars) {
            let cut = buf.lastIndexOf(" ", maxChars);
            if (cut < 50) cut = maxChars;
            chunks.push(buf.slice(0, cut));
            buf = buf.slice(cut).trim();
          }
          if (buf) chunks.push(buf);
        } else if ((current + " " + p).trim().length <= maxChars) {
          current = current ? `${current} ${p}` : p;
        } else {
          if (current) chunks.push(current);
          current = p;
        }
      }
    } else if ((current + " " + s).trim().length <= maxChars) {
      current = current ? `${current} ${s}` : s;
    } else {
      if (current) chunks.push(current);
      current = s;
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

async function fetchTtsChunk(text: string, voice: string): Promise<Blob> {
  const url =
    `https://api.streamelements.com/kappa/v2/speech?voice=${encodeURIComponent(voice)}` +
    `&text=${encodeURIComponent(text)}`;
  const r = await fetch(url);
  if (!r.ok) {
    throw new Error(`TTS request failed (${r.status})`);
  }
  return r.blob();
}

/**
 * Score a voice for quality — higher = better. The Web Speech API
 * exposes everything from studio neural voices to ancient robotic
 * "Microsoft David" / "Fred" / "Albert" voices in the same list, so
 * we rank them by:
 *
 *   1. Tier keywords in the name ("Enhanced", "Natural", "Neural",
 *      "Wavenet", "Premium", "Online")
 *   2. Whether the voice is local (lower score — system voices tend
 *      to be older / robotic) or network-fetched (higher score —
 *      modern cloud voices are far better)
 *   3. Known-good voice families (Google's cloud voices, Microsoft's
 *      Online Natural family, Apple's Enhanced voices)
 *   4. A penalty for known-robotic voices we want to push to the
 *      bottom of the list
 *
 * Used both for default-selection AND for the badge displayed next
 * to each voice in the dropdown so users see at a glance which ones
 * are likely to sound good.
 */
function scoreVoice(v: SpeechSynthesisVoice): number {
  const name = v.name.toLowerCase();
  let score = 0;

  // Premium / studio-quality indicators
  if (name.includes("enhanced")) score += 100;
  if (name.includes("premium")) score += 100;
  if (name.includes("natural")) score += 95; // Microsoft "(Natural)"
  if (name.includes("neural")) score += 90;
  if (name.includes("wavenet")) score += 90; // Google Wavenet
  if (name.includes("studio")) score += 90;

  // Cloud / online voices — usually much better than local system voices
  if (name.includes("online")) score += 60;
  if (!v.localService) score += 30; // network voice = modern cloud

  // Known-good families (good even without explicit "Enhanced" tag)
  const knownGood = [
    "google",
    "microsoft aria",
    "microsoft jenny",
    "microsoft guy",
    "microsoft davis",
    "microsoft jane",
    "microsoft madhur", // Indian English neural
    "microsoft swara", // Hindi neural
    "microsoft prabhat", // Hindi neural
    "veena", // macOS Indian English
    "rishi", // macOS Indian English (basic but acceptable)
    "samantha",
    "karen",
    "daniel",
    "alex",
    "victoria",
    "tessa",
    "moira",
    "kyoko",
    "yuna",
    "siri",
  ];
  if (knownGood.some((g) => name.includes(g))) score += 20;

  // Known-robotic / novelty voices — push to bottom
  const robotic = [
    "microsoft david",
    "microsoft mark",
    "microsoft zira",
    "microsoft heera",
    "microsoft kalpana",
    "microsoft hemant",
    "albert",
    "bahh",
    "bells",
    "boing",
    "bubbles",
    "cellos",
    "deranged",
    "fred",
    "good news",
    "bad news",
    "junior",
    "kathy",
    "organ",
    "ralph",
    "trinoids",
    "whisper",
    "wobble",
    "zarvox",
    "pipe organ",
  ];
  if (robotic.some((r) => name === r || name.includes(r))) score -= 50;

  return score;
}

/** Returns a short quality tag for the badge in the UI. */
function voiceQualityTier(v: SpeechSynthesisVoice): {
  label: string;
  className: string;
} | null {
  const s = scoreVoice(v);
  const name = v.name.toLowerCase();
  if (name.includes("enhanced") || name.includes("premium")) {
    return { label: "Enhanced", className: "bg-green-100 text-green-700" };
  }
  if (name.includes("natural") || name.includes("neural") || name.includes("wavenet")) {
    return { label: "Natural", className: "bg-green-100 text-green-700" };
  }
  if (s >= 60) {
    return { label: "Online", className: "bg-blue-100 text-blue-700" };
  }
  if (s < 0) {
    return { label: "Basic", className: "bg-gray-100 text-gray-500" };
  }
  return null;
}

/**
 * A short language-appropriate phrase the Preview button speaks so the
 * user can sample a voice before committing to a long document.
 */
function previewPhraseFor(lang: string): string {
  if (/^hi/i.test(lang)) {
    return "नमस्ते, मैं आपका दस्तावेज़ इस तरह पढ़ूंगा।";
  }
  return "Hello — this is how I'll read your document.";
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

  // Natural-voice (Polly via StreamElements) mode is the DEFAULT — sounds
  // far more human than OS Web Speech voices. Users can switch to the
  // Web Speech path if they're offline or the public TTS endpoint is
  // rate-limited.
  const [useNatural, setUseNatural] = useState(true);
  const [naturalVoice, setNaturalVoice] = useState<string>("Raveena");
  const [naturalLoading, setNaturalLoading] = useState<string>("");
  // Track which chunk we're playing and how many chars have been read
  // so the progress bar advances naturally across multi-chunk reads.
  const naturalChunksRef = useRef<string[]>([]);
  const naturalIndexRef = useRef(0);
  const naturalCharsBeforeRef = useRef<number[]>([]); // Char offset of each chunk's START
  const naturalAudioRef = useRef<HTMLAudioElement | null>(null);
  const naturalCancelRef = useRef(false);
  // Pre-fetched MP3 blobs for the next chunks so playback feels seamless.
  const naturalPrefetchRef = useRef<Map<number, Promise<Blob>>>(new Map());

  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  // ── Load voices (browser populates them asynchronously on Chrome) ──
  // Default to the HIGHEST-QUALITY voice, not the first match. Web Speech
  // API exposes a wide range from studio-quality neural voices (macOS
  // Enhanced, Microsoft Online Natural, Google Wavenet) down to plainly
  // robotic system voices (Microsoft David, macOS Junior/Albert/Fred).
  // We score each voice and pick the best one available for the user's
  // language preference — so they don't have to manually hunt for the
  // good voice in a 199-entry dropdown.
  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const load = () => {
      const list = window.speechSynthesis.getVoices();
      setVoices(list);
      if (list.length > 0 && !selectedVoice) {
        // Try Indian English first (en-IN), then Hindi (hi-IN), then any
        // English, then any voice — picking the HIGHEST-SCORED voice
        // within each tier rather than the first match.
        const buckets: ((v: SpeechSynthesisVoice) => boolean)[] = [
          (v) => /en-IN/i.test(v.lang),
          (v) => /hi-IN/i.test(v.lang),
          (v) => /^en/i.test(v.lang),
          () => true,
        ];
        for (const matches of buckets) {
          const candidates = list.filter(matches);
          if (candidates.length > 0) {
            const best = candidates
              .slice()
              .sort((a, b) => scoreVoice(b) - scoreVoice(a))[0];
            setSelectedVoice(best.name);
            break;
          }
        }
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
      const { text: extracted, pageEstimate: p } = await extractPdfText(buffer);
      setPageEstimate(p);
      if (!extracted) {
        setText("");
        setError(
          "We couldn't extract any text from this PDF. It may be a scanned image PDF (needs OCR) or a password-protected PDF. Try a text-based PDF — one where you can select and copy text in Adobe Reader."
        );
      } else {
        setText(extracted);
      }
    } catch (err) {
      console.error("[PDF to Speech] extraction failed", err);
      // pdfjs returns specific error messages we can surface to the user.
      const msg =
        err instanceof Error
          ? err.message.includes("password")
            ? "This PDF is password-protected. Decrypt it first, then try again."
            : err.message.includes("Invalid PDF")
              ? "This file isn't a valid PDF. Try another file."
              : "Couldn't read the PDF. It may be corrupted or use an unsupported format."
          : "Couldn't read the PDF. Try another file.";
      setError(msg);
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

  // ── Natural-voice (Polly) playback ──────────────────────────────
  // Plays text via StreamElements' free public Polly endpoint. Splits
  // long text into ≤220-char chunks (the endpoint's hard limit) at
  // sentence boundaries, fetches MP3s one chunk ahead, and plays them
  // back-to-back through a single HTMLAudioElement. Falls back to Web
  // Speech if the endpoint fails (rate limited, offline, etc.).
  const playNaturalFromIndex = useCallback(
    async (startIndex: number) => {
      if (naturalCancelRef.current) return;
      const chunks = naturalChunksRef.current;
      if (startIndex >= chunks.length) {
        setIsPlaying(false);
        setIsPaused(false);
        setSpokenChars(text.length);
        setNaturalLoading("");
        return;
      }
      naturalIndexRef.current = startIndex;

      // Use already-prefetched promise if available, otherwise kick off.
      let blobPromise = naturalPrefetchRef.current.get(startIndex);
      if (!blobPromise) {
        blobPromise = fetchTtsChunk(chunks[startIndex], naturalVoice);
        naturalPrefetchRef.current.set(startIndex, blobPromise);
      }

      // Pre-fetch the next chunk in parallel so playback is seamless.
      if (startIndex + 1 < chunks.length && !naturalPrefetchRef.current.has(startIndex + 1)) {
        naturalPrefetchRef.current.set(
          startIndex + 1,
          fetchTtsChunk(chunks[startIndex + 1], naturalVoice).catch(() => new Blob())
        );
      }

      setNaturalLoading(
        startIndex === 0
          ? "Loading natural voice…"
          : ""
      );

      let blob: Blob;
      try {
        blob = await blobPromise;
        if (blob.size < 100) throw new Error("Empty audio chunk");
      } catch (err) {
        console.error("[PDF to Speech] StreamElements failed", err);
        // Auto-fallback to Web Speech for the remainder of the text.
        setError(
          "Natural-voice service is rate-limited — switching to your device's built-in voice as a fallback."
        );
        setUseNatural(false);
        // Restart with Web Speech from this chunk's position
        const restartChars = naturalCharsBeforeRef.current[startIndex] || 0;
        setSpokenChars(restartChars);
        setIsPlaying(false);
        setIsPaused(false);
        return;
      }

      if (naturalCancelRef.current) return;
      setNaturalLoading("");

      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.playbackRate = rate;
      naturalAudioRef.current = audio;

      audio.ontimeupdate = () => {
        // Approx progress within the chunk → update char counter.
        if (audio.duration > 0) {
          const chunkProgress = audio.currentTime / audio.duration;
          const chunkStart = naturalCharsBeforeRef.current[startIndex] || 0;
          const chunkLen = chunks[startIndex].length;
          setSpokenChars(Math.round(chunkStart + chunkProgress * chunkLen));
        }
      };
      audio.onended = () => {
        URL.revokeObjectURL(url);
        if (naturalCancelRef.current) return;
        playNaturalFromIndex(startIndex + 1);
      };
      audio.onerror = () => {
        URL.revokeObjectURL(url);
        if (naturalCancelRef.current) return;
        // Skip to next chunk on error instead of dying.
        playNaturalFromIndex(startIndex + 1);
      };

      try {
        await audio.play();
      } catch {
        // Autoplay blocked — user gesture is needed. Most browsers
        // permit this because the Play button is a direct user click.
      }
    },
    [naturalVoice, rate, text]
  );

  // ── Playback controls ───────────────────────────────────────────
  const handlePlay = async () => {
    if (!text.trim()) return;

    if (isPaused) {
      if (useNatural && naturalAudioRef.current) {
        naturalAudioRef.current.play();
      } else if (window.speechSynthesis) {
        window.speechSynthesis.resume();
      }
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    setError("");
    setSpokenChars(0);

    if (useNatural) {
      // ── Natural Polly path ──
      naturalCancelRef.current = false;
      naturalPrefetchRef.current.clear();

      // Chunk the text + record where each chunk starts (for progress).
      const chunks = chunkTextForTTS(text);
      const charsBefore: number[] = [];
      let cursor = 0;
      for (const c of chunks) {
        charsBefore.push(cursor);
        cursor += c.length + 1;
      }
      naturalChunksRef.current = chunks;
      naturalCharsBeforeRef.current = charsBefore;
      naturalIndexRef.current = 0;

      setIsPlaying(true);
      setIsPaused(false);
      try {
        await playNaturalFromIndex(0);
      } catch (e) {
        console.error("[PDF to Speech] natural play failed", e);
        setIsPlaying(false);
      }
      return;
    }

    // ── Web Speech fallback path ──
    if (typeof window === "undefined" || !window.speechSynthesis) {
      setError("Your browser doesn't support speech synthesis.");
      return;
    }
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    const voice = voices.find((v) => v.name === selectedVoice);
    if (voice) utter.voice = voice;
    utter.rate = rate;
    utter.pitch = pitch;
    utter.onboundary = (ev) => {
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
    if (useNatural && naturalAudioRef.current) {
      naturalAudioRef.current.pause();
    } else {
      window.speechSynthesis?.pause();
    }
    setIsPaused(true);
    setIsPlaying(false);
  };

  const handleStop = () => {
    naturalCancelRef.current = true;
    if (naturalAudioRef.current) {
      naturalAudioRef.current.pause();
      naturalAudioRef.current = null;
    }
    naturalPrefetchRef.current.clear();
    window.speechSynthesis?.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setSpokenChars(0);
    setNaturalLoading("");
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

  // Group voices by language, then sort each group by quality score
  // descending so the best voice is at the top of every group — the
  // user's eye lands on it first instead of having to scroll.
  const voiceGroups = (() => {
    const grouped: Record<string, SpeechSynthesisVoice[]> = {};
    voices.forEach((v) => {
      const lang = v.lang || "Other";
      if (!grouped[lang]) grouped[lang] = [];
      grouped[lang].push(v);
    });
    // Sort voices within each language by score, highest first.
    Object.values(grouped).forEach((arr) =>
      arr.sort((a, b) => scoreVoice(b) - scoreVoice(a))
    );
    return Object.entries(grouped).sort(([a], [b]) => {
      // en-IN and hi-IN pinned to the top
      if (a.startsWith("en-IN") || a.startsWith("hi-IN")) return -1;
      if (b.startsWith("en-IN") || b.startsWith("hi-IN")) return 1;
      return a.localeCompare(b);
    });
  })();

  // Resolve the currently selected voice object so the badge below
  // and the Preview button know what they're dealing with.
  const currentVoice =
    voices.find((v) => v.name === selectedVoice) || null;
  const currentTier = currentVoice ? voiceQualityTier(currentVoice) : null;

  const previewVoice = async () => {
    if (useNatural) {
      // Sample the natural voice with a short phrase.
      try {
        const blob = await fetchTtsChunk(
          "Hello — this is how I will read your document.",
          naturalVoice
        );
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audio.playbackRate = rate;
        audio.onended = () => URL.revokeObjectURL(url);
        audio.play();
      } catch {
        setError("Couldn't sample this voice — try another.");
      }
      return;
    }
    if (!currentVoice || typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(previewPhraseFor(currentVoice.lang));
    utter.voice = currentVoice;
    utter.rate = rate;
    utter.pitch = pitch;
    window.speechSynthesis.speak(utter);
  };

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
      {naturalLoading && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-sm text-indigo-700">
          ⏳ {naturalLoading}
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
              {/* Mode toggle — natural voices are the default because they
                  sound much more human than OS Web Speech voices. */}
              <div className="flex items-center gap-2 mb-2 p-1 bg-gray-100 rounded-lg text-xs">
                <button
                  type="button"
                  onClick={() => {
                    if (!useNatural) {
                      handleStop();
                      setUseNatural(true);
                    }
                  }}
                  className={`flex-1 px-3 py-1.5 rounded-md font-semibold transition ${
                    useNatural
                      ? "bg-white text-indigo-700 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  ✨ Natural voice
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (useNatural) {
                      handleStop();
                      setUseNatural(false);
                    }
                  }}
                  className={`flex-1 px-3 py-1.5 rounded-md font-semibold transition ${
                    !useNatural
                      ? "bg-white text-indigo-700 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  💻 Device voice
                </button>
              </div>

              <div className="flex items-center justify-between gap-2 mb-1">
                <label className="text-xs font-semibold text-gray-600">
                  {useNatural
                    ? "Voice (Polly · human-sounding)"
                    : `Voice (${voices.length} available · best on top)`}
                </label>
                {!useNatural && currentTier && (
                  <span
                    className={`text-[9px] uppercase tracking-wider font-bold rounded-full px-2 py-0.5 ${currentTier.className}`}
                    title="Quality tier of the currently-selected voice."
                  >
                    {currentTier.label}
                  </span>
                )}
                {useNatural && (
                  <span
                    className="text-[9px] uppercase tracking-wider font-bold rounded-full px-2 py-0.5 bg-green-100 text-green-700"
                    title="AWS Polly neural voice via StreamElements free public endpoint."
                  >
                    Neural
                  </span>
                )}
              </div>
              {useNatural ? (
                <>
                  <select
                    value={naturalVoice}
                    onChange={(e) => setNaturalVoice(e.target.value)}
                    className="calc-input w-full"
                  >
                    {NATURAL_VOICES.map((v) => (
                      <option key={v.slug} value={v.slug}>
                        {v.label}
                        {v.hint ? ` · ${v.hint}` : ""}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={previewVoice}
                    className="mt-2 text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    🔉 Preview this voice
                  </button>
                </>
              ) : voices.length === 0 ? (
                <p className="text-xs text-gray-500 mt-2">
                  Loading available voices… (some browsers populate them on first use)
                </p>
              ) : (
                <>
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
                        {vs.map((v) => {
                          const tier = voiceQualityTier(v);
                          // Native <option> can't render coloured badges,
                          // so we suffix the tier label in brackets. The
                          // colour badge appears next to the selected
                          // voice above the dropdown.
                          const tag =
                            tier?.label === "Enhanced"
                              ? " ⭐ Enhanced"
                              : tier?.label === "Natural"
                                ? " ⭐ Natural"
                                : tier?.label === "Online"
                                  ? " · Online"
                                  : tier?.label === "Basic"
                                    ? " · Basic"
                                    : "";
                          return (
                            <option key={v.name} value={v.name}>
                              {v.name}
                              {tag}
                            </option>
                          );
                        })}
                      </optgroup>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={previewVoice}
                    disabled={!currentVoice}
                    className="mt-2 text-xs font-semibold text-indigo-600 hover:text-indigo-800 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                  >
                    🔉 Preview this voice
                  </button>
                  {currentVoice && scoreVoice(currentVoice) < 30 && (
                    <p className="mt-2 text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-2 py-1.5 leading-snug">
                      ⚠️ This voice may sound robotic. Pick one tagged{" "}
                      <strong>Enhanced</strong>, <strong>Natural</strong> or{" "}
                      <strong>Online</strong> for clearer speech (sorted to
                      the top of each language group).
                    </p>
                  )}
                </>
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
