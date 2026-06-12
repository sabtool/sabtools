"use client";
import { useState, useCallback, useMemo } from "react";

/**
 * Language Translator — free, no signup, runs entirely in the browser.
 *
 * Uses the public MyMemory Translated API (api.mymemory.translated.net):
 *   - free, no API key required for low volume
 *   - 1000 words/day per IP without auth, 10,000/day with `de=` email param
 *   - CORS-enabled — direct browser fetch, no server proxy needed
 *   - supports all major Indian languages (Hindi, Tamil, Telugu, Bengali,
 *     Marathi, Gujarati, Kannada, Malayalam, Punjabi, Urdu, Odia,
 *     Assamese, Sindhi, Nepali) plus 100+ world languages
 *   - auto-detect via `Autodetect` source language
 *
 * Privacy: the text you type IS sent to MyMemory's servers for
 * translation (we tell you that openly in the footer). Nothing is
 * stored on sabtools.in — the browser calls MyMemory directly and the
 * result renders client-side.
 *
 * No tracking, no logs on our side, no signup. If MyMemory's quota is
 * hit (rare), the UI shows a friendly error with the retry-after time.
 */

interface LangOption {
  code: string;
  label: string;
  /** ISO 639-1 code used as the source for `langpair=src|tgt`. */
  apiCode: string;
  /** Native script of the language name, displayed alongside English. */
  native?: string;
  /** Indian-language shortcut — pinned to the top of the picker. */
  isIndian?: boolean;
}

// Curated list — Indian languages first (matching the brand's India
// focus), then the world languages most commonly translated to/from in
// India (English, Arabic, Chinese, Spanish, French, German, Japanese,
// Korean, Russian, etc.).
const LANGUAGES: LangOption[] = [
  { code: "auto", label: "Detect language", apiCode: "Autodetect" },

  // ── Indian languages (pinned) ────────────────────────────────────
  { code: "en", label: "English", apiCode: "en", native: "English", isIndian: true },
  { code: "hi", label: "Hindi", apiCode: "hi", native: "हिन्दी", isIndian: true },
  { code: "bn", label: "Bengali", apiCode: "bn", native: "বাংলা", isIndian: true },
  { code: "ta", label: "Tamil", apiCode: "ta", native: "தமிழ்", isIndian: true },
  { code: "te", label: "Telugu", apiCode: "te", native: "తెలుగు", isIndian: true },
  { code: "mr", label: "Marathi", apiCode: "mr", native: "मराठी", isIndian: true },
  { code: "gu", label: "Gujarati", apiCode: "gu", native: "ગુજરાતી", isIndian: true },
  { code: "kn", label: "Kannada", apiCode: "kn", native: "ಕನ್ನಡ", isIndian: true },
  { code: "ml", label: "Malayalam", apiCode: "ml", native: "മലയാളം", isIndian: true },
  { code: "pa", label: "Punjabi", apiCode: "pa", native: "ਪੰਜਾਬੀ", isIndian: true },
  { code: "ur", label: "Urdu", apiCode: "ur", native: "اردو", isIndian: true },
  { code: "or", label: "Odia", apiCode: "or", native: "ଓଡ଼ିଆ", isIndian: true },
  { code: "as", label: "Assamese", apiCode: "as", native: "অসমীয়া", isIndian: true },
  { code: "ne", label: "Nepali", apiCode: "ne", native: "नेपाली", isIndian: true },
  { code: "sd", label: "Sindhi", apiCode: "sd", native: "سنڌي", isIndian: true },

  // ── World languages ──────────────────────────────────────────────
  { code: "ar", label: "Arabic", apiCode: "ar", native: "العربية" },
  { code: "zh", label: "Chinese (Simplified)", apiCode: "zh-CN", native: "中文" },
  { code: "ja", label: "Japanese", apiCode: "ja", native: "日本語" },
  { code: "ko", label: "Korean", apiCode: "ko", native: "한국어" },
  { code: "ru", label: "Russian", apiCode: "ru", native: "Русский" },
  { code: "es", label: "Spanish", apiCode: "es", native: "Español" },
  { code: "fr", label: "French", apiCode: "fr", native: "Français" },
  { code: "de", label: "German", apiCode: "de", native: "Deutsch" },
  { code: "it", label: "Italian", apiCode: "it", native: "Italiano" },
  { code: "pt", label: "Portuguese", apiCode: "pt", native: "Português" },
  { code: "nl", label: "Dutch", apiCode: "nl", native: "Nederlands" },
  { code: "tr", label: "Turkish", apiCode: "tr", native: "Türkçe" },
  { code: "vi", label: "Vietnamese", apiCode: "vi", native: "Tiếng Việt" },
  { code: "th", label: "Thai", apiCode: "th", native: "ไทย" },
  { code: "id", label: "Indonesian", apiCode: "id", native: "Bahasa Indonesia" },
  { code: "ms", label: "Malay", apiCode: "ms", native: "Bahasa Melayu" },
  { code: "fa", label: "Persian", apiCode: "fa", native: "فارسی" },
  { code: "he", label: "Hebrew", apiCode: "he", native: "עברית" },
  { code: "pl", label: "Polish", apiCode: "pl", native: "Polski" },
  { code: "uk", label: "Ukrainian", apiCode: "uk", native: "Українська" },
  { code: "sv", label: "Swedish", apiCode: "sv", native: "Svenska" },
  { code: "el", label: "Greek", apiCode: "el", native: "Ελληνικά" },
  { code: "cs", label: "Czech", apiCode: "cs", native: "Čeština" },
  { code: "ro", label: "Romanian", apiCode: "ro", native: "Română" },
  { code: "hu", label: "Hungarian", apiCode: "hu", native: "Magyar" },
  { code: "fi", label: "Finnish", apiCode: "fi", native: "Suomi" },
  { code: "no", label: "Norwegian", apiCode: "no", native: "Norsk" },
  { code: "da", label: "Danish", apiCode: "da", native: "Dansk" },
  { code: "bg", label: "Bulgarian", apiCode: "bg", native: "Български" },
  { code: "hr", label: "Croatian", apiCode: "hr", native: "Hrvatski" },
  { code: "sk", label: "Slovak", apiCode: "sk", native: "Slovenčina" },
  { code: "sl", label: "Slovenian", apiCode: "sl", native: "Slovenščina" },
  { code: "sr", label: "Serbian", apiCode: "sr", native: "Српски" },
  { code: "lv", label: "Latvian", apiCode: "lv", native: "Latviešu" },
  { code: "lt", label: "Lithuanian", apiCode: "lt", native: "Lietuvių" },
  { code: "et", label: "Estonian", apiCode: "et", native: "Eesti" },
  { code: "sw", label: "Swahili", apiCode: "sw", native: "Kiswahili" },
  { code: "am", label: "Amharic", apiCode: "am", native: "አማርኛ" },
  { code: "fil", label: "Filipino", apiCode: "tl", native: "Filipino" },
];

const MAX_LENGTH = 5000; // MyMemory's hard cap per request.

interface ApiResponse {
  responseData?: { translatedText?: string; match?: number };
  responseDetails?: string;
  responseStatus?: number;
  quotaFinished?: boolean;
}

interface TranslationResult {
  text: string;
  detectedLang?: string;
  /** Quality score 0-1 (1 = perfect match) from MyMemory. */
  match?: number;
}

export default function LanguageTranslator() {
  const [sourceLang, setSourceLang] = useState<string>("auto");
  const [targetLang, setTargetLang] = useState<string>("hi");
  const [sourceText, setSourceText] = useState<string>("");
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const langByCode = useMemo(() => {
    const m: Record<string, LangOption> = {};
    LANGUAGES.forEach((l) => (m[l.code] = l));
    return m;
  }, []);

  const indianLanguages = useMemo(
    () => LANGUAGES.filter((l) => l.isIndian),
    []
  );
  const worldLanguages = useMemo(
    () => LANGUAGES.filter((l) => !l.isIndian && l.code !== "auto"),
    []
  );

  const translate = useCallback(async () => {
    setError("");
    setResult(null);
    const text = sourceText.trim();
    if (!text) {
      setError("Please enter some text to translate.");
      return;
    }
    if (text.length > MAX_LENGTH) {
      setError(
        `Text is too long (${text.length} chars). MyMemory accepts up to ${MAX_LENGTH} characters per request — split your text into chunks.`
      );
      return;
    }
    if (sourceLang !== "auto" && sourceLang === targetLang) {
      setError("Source and target languages are the same.");
      return;
    }

    setBusy(true);
    try {
      const srcApi = langByCode[sourceLang]?.apiCode || "Autodetect";
      const tgtApi = langByCode[targetLang]?.apiCode || "en";
      const url =
        "https://api.mymemory.translated.net/get?q=" +
        encodeURIComponent(text) +
        `&langpair=${encodeURIComponent(srcApi)}|${encodeURIComponent(tgtApi)}` +
        // de= raises the daily quota from 1000 → 10,000 words per IP at
        // no cost. The address is generic & matches our brand contact.
        `&de=hello@sabtools.in`;

      const r = await fetch(url);
      const data: ApiResponse = await r.json();

      if (data.quotaFinished) {
        throw new Error(
          "Free daily translation quota reached for this IP. Try again in 24 hours, or use a smaller chunk of text."
        );
      }
      if (data.responseStatus && data.responseStatus !== 200) {
        throw new Error(
          data.responseDetails ||
            `Translation service returned status ${data.responseStatus}. Please try again.`
        );
      }
      const translated = data.responseData?.translatedText?.trim();
      if (!translated) {
        throw new Error(
          "We couldn't translate this text — try shorter input or a different language pair."
        );
      }

      setResult({
        text: translated,
        match: data.responseData?.match,
      });
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Translation failed. Check your internet connection and try again."
      );
    } finally {
      setBusy(false);
    }
  }, [sourceText, sourceLang, targetLang, langByCode]);

  const swapLanguages = useCallback(() => {
    if (sourceLang === "auto") return; // Can't swap into Autodetect.
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    if (result) {
      setSourceText(result.text);
      setResult(null);
    }
  }, [sourceLang, targetLang, result]);

  const copyResult = useCallback(async () => {
    if (!result?.text) return;
    try {
      await navigator.clipboard.writeText(result.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore — old browsers without clipboard API */
    }
  }, [result]);

  const clearAll = useCallback(() => {
    setSourceText("");
    setResult(null);
    setError("");
  }, []);

  return (
    <div className="space-y-5">
      {/* Language pickers */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex-1 min-w-[140px]">
          <label className="text-xs font-semibold text-gray-600 block mb-1">
            From
          </label>
          <select
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
            className="calc-input w-full"
          >
            <option value="auto">🌐 Detect language</option>
            <optgroup label="Indian languages">
              {indianLanguages.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                  {l.native && l.label !== l.native ? ` (${l.native})` : ""}
                </option>
              ))}
            </optgroup>
            <optgroup label="World languages">
              {worldLanguages.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                  {l.native && l.label !== l.native ? ` (${l.native})` : ""}
                </option>
              ))}
            </optgroup>
          </select>
        </div>

        <button
          type="button"
          onClick={swapLanguages}
          disabled={sourceLang === "auto"}
          aria-label="Swap source and target languages"
          title="Swap languages"
          className="mt-5 sm:mt-6 h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          ⇄
        </button>

        <div className="flex-1 min-w-[140px]">
          <label className="text-xs font-semibold text-gray-600 block mb-1">
            To
          </label>
          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className="calc-input w-full"
          >
            <optgroup label="Indian languages">
              {indianLanguages.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                  {l.native && l.label !== l.native ? ` (${l.native})` : ""}
                </option>
              ))}
            </optgroup>
            <optgroup label="World languages">
              {worldLanguages.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                  {l.native && l.label !== l.native ? ` (${l.native})` : ""}
                </option>
              ))}
            </optgroup>
          </select>
        </div>
      </div>

      {/* Source text */}
      <div>
        <div className="flex items-end justify-between mb-1">
          <label className="text-xs font-semibold text-gray-600">
            Your text
          </label>
          <span
            className={`text-[11px] tabular-nums ${
              sourceText.length > MAX_LENGTH
                ? "text-red-600 font-semibold"
                : sourceText.length > MAX_LENGTH * 0.8
                  ? "text-amber-600"
                  : "text-gray-400"
            }`}
          >
            {sourceText.length.toLocaleString()} / {MAX_LENGTH.toLocaleString()}
          </span>
        </div>
        <textarea
          value={sourceText}
          onChange={(e) => setSourceText(e.target.value)}
          placeholder={`Enter the text you want to translate…\n\nTip: Try "Hello, how are you?" or paste a paragraph in any language.`}
          rows={5}
          className="calc-input w-full min-h-[120px]"
          maxLength={MAX_LENGTH + 100}
        />
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={translate}
          disabled={busy || !sourceText.trim()}
          className="btn-primary px-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {busy ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Translating…
            </>
          ) : (
            <>🌐 Translate</>
          )}
        </button>
        {sourceText && (
          <button
            onClick={clearAll}
            className="px-4 py-2 text-sm font-semibold text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Clear
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
          ❌ {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="result-card">
          <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
            <h3 className="font-bold text-gray-800">
              Translation ({langByCode[targetLang]?.label})
            </h3>
            <div className="flex items-center gap-2">
              {typeof result.match === "number" && result.match > 0 && (
                <span
                  className={`text-[10px] uppercase tracking-wider font-bold rounded-full px-2 py-0.5 ${
                    result.match >= 0.9
                      ? "bg-green-100 text-green-700"
                      : result.match >= 0.7
                        ? "bg-amber-100 text-amber-700"
                        : "bg-gray-100 text-gray-600"
                  }`}
                  title="Quality match score reported by the translation engine"
                >
                  Match {Math.round(result.match * 100)}%
                </span>
              )}
              <button
                onClick={copyResult}
                className="text-xs font-semibold text-indigo-600 border border-indigo-200 rounded-lg px-3 py-1.5 hover:bg-indigo-50 transition flex items-center gap-1"
              >
                {copied ? (
                  <>
                    <span className="text-green-600">✓</span> Copied!
                  </>
                ) : (
                  <>📋 Copy</>
                )}
              </button>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200 text-base text-gray-800 leading-relaxed whitespace-pre-wrap break-words">
            {result.text}
          </div>
        </div>
      )}

      {/* Honest info panel */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-5 text-xs text-gray-600 leading-relaxed">
        <p className="font-bold text-gray-800 mb-1">How it works</p>
        <p>
          Your text is sent to{" "}
          <a
            href="https://mymemory.translated.net/doc/spec.php"
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-semibold text-indigo-600"
          >
            MyMemory Translated
          </a>{" "}
          — a free public translation service that supports{" "}
          {LANGUAGES.length - 1}+ languages. SabTools.in itself does NOT
          store, log, or read your text. The translation happens directly
          between your browser and MyMemory&apos;s servers.
        </p>
        <p className="mt-2">
          <strong>Free tier:</strong> 1,000 words per IP per day (10,000 with
          our pre-filled identifier). For sensitive or confidential text,
          consider an enterprise translation service instead. For absolute
          privacy, use an offline translator app.
        </p>
        <p className="mt-2">
          <strong>Quality:</strong> Translations between major language pairs
          (English ↔ Hindi/Spanish/French/German/Chinese) are typically
          90%+ accurate. Rarer pairs (Sanskrit, regional Indian dialects,
          archaic forms) may need manual review.
        </p>
      </div>
    </div>
  );
}
