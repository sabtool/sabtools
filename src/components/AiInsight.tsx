"use client";
import { useState, useCallback } from "react";

/**
 * AiInsight — generates a 3-4 sentence personalized "what this means for you"
 * commentary for the current tool result, using the same Gemini API key
 * already wired up for AskSabTools.
 *
 * Architecture:
 *  - On click, snapshot the result text from the page (.result-card innerText)
 *  - Send to Gemini with the tool name + slug + result snapshot
 *  - Stream response into a clean panel below the result
 *
 * UX rules:
 *  - LAZY (button click) — never auto-fires. No surprise API spend.
 *  - Single response per click; user can re-click to refresh.
 *  - If Gemini key missing or call fails, hides itself (no error UI noise).
 *
 * Cost: each call ≈ 200 input + 150 output tokens via Gemini 2.0 Flash =
 * ~$0.0001. At 10k clicks/day = ~$1/day.
 *
 * Privacy: only the result snippet (numbers + labels) is sent — no PII.
 */

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_KEY || "";
const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

interface AiInsightProps {
  toolName: string;
  toolSlug: string;
  /** Optional category for slightly tailored prompts (finance vs health vs tax). */
  category?: string;
}

function snapshotResultFromPage(): string {
  if (typeof document === "undefined") return "";
  const cards = document.querySelectorAll(".result-card");
  if (!cards.length) return "";
  const lines: string[] = [];
  cards.forEach((c) => {
    const txt = (c as HTMLElement).innerText || "";
    txt
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0 && l.length < 200)
      .forEach((l) => {
        if (!lines.includes(l)) lines.push(l);
      });
  });
  // Truncate to keep prompt bounded
  return lines.slice(0, 30).join("\n");
}

async function callGemini(prompt: string): Promise<string> {
  const resp = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 400,
      },
    }),
  });
  if (!resp.ok) {
    throw new Error(`Gemini ${resp.status}`);
  }
  const data = await resp.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("No text in response");
  return text.trim();
}

export default function AiInsight({ toolName, toolSlug, category }: AiInsightProps) {
  const [insight, setInsight] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleClick = useCallback(async () => {
    if (!GEMINI_API_KEY) {
      setError("AI insights are not configured.");
      return;
    }
    setLoading(true);
    setError("");
    setInsight("");

    const snapshot = snapshotResultFromPage();
    if (!snapshot) {
      setError("Calculate a result first, then click for AI insights.");
      setLoading(false);
      return;
    }

    const ctx = category ? ` This is a ${category} calculator.` : "";

    const prompt = `You are an Indian personal-finance / general-knowledge assistant for SabTools.in.

Tool: ${toolName} (slug: ${toolSlug}).${ctx}

Here is what the user just calculated:
${snapshot}

Write a personalized 3-4 sentence "What this means for you" commentary. Rules:
- Plain English. Indian context (₹, lakhs, crores, India tax/finance norms).
- Reference the actual numbers the user calculated.
- Add ONE actionable next-step or insight (e.g. "Most people in your bracket also do X").
- No generic advice. No marketing. No emojis.
- 3-4 sentences max. Never more.`;

    try {
      const text = await callGemini(prompt);
      setInsight(text);
    } catch (e) {
      console.error("AI insight failed:", e);
      setError("Couldn't generate insight right now. Try again.");
    } finally {
      setLoading(false);
    }
  }, [toolName, toolSlug, category]);

  // If Gemini isn't configured, hide entirely (no broken button on prod).
  if (!GEMINI_API_KEY) return null;

  return (
    <div className="mt-6">
      {!insight && !loading && !error && (
        <button
          onClick={handleClick}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-fuchsia-500 to-violet-600 text-white text-sm font-semibold shadow-sm hover:shadow-md hover:from-fuchsia-600 hover:to-violet-700 transition-all duration-200"
          title="Get a personalized AI explanation of your result"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 3l1.9 5.8L19.6 11l-5.7 2.2L12 19l-1.9-5.8L4.4 11l5.7-2.2L12 3z" />
          </svg>
          What does this mean for me? (AI)
        </button>
      )}

      {loading && (
        <div className="bg-violet-50 border border-violet-200 rounded-xl p-4 text-sm text-violet-900 flex items-center gap-3">
          <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
            <path
              d="M22 12a10 10 0 0 0-10-10"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
          Generating personalized insight…
        </div>
      )}

      {error && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900">
          {error}
        </div>
      )}

      {insight && !loading && (
        <div className="bg-gradient-to-br from-fuchsia-50 via-violet-50 to-indigo-50 border border-violet-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-fuchsia-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold">
              AI
            </div>
            <h3 className="font-bold text-violet-900 text-sm">
              What this means for you
            </h3>
          </div>
          <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
            {insight}
          </p>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-violet-200">
            <button
              onClick={handleClick}
              className="text-xs font-semibold text-violet-700 hover:text-violet-900"
            >
              Refresh
            </button>
            <span className="text-[10px] text-gray-500">
              AI-generated insight · review against your actual situation
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
