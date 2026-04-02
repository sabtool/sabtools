"use client";
import { useState, useMemo } from "react";

const POWER_WORDS = ["free", "ultimate", "proven", "secret", "instant", "guaranteed", "exclusive", "powerful", "amazing", "incredible", "essential", "best", "top", "new", "easy", "simple", "fast", "quick", "now", "limited", "bonus", "save", "discover", "learn", "master", "boost", "hack", "win", "complete", "guide"];
const EMOTIONAL_WORDS = ["love", "hate", "fear", "joy", "anger", "surprise", "trust", "disgust", "happy", "sad", "beautiful", "terrible", "awesome", "horrible", "brilliant", "shocking", "heartbreaking", "exciting", "inspiring", "devastating", "stunning", "thrilling", "painful", "wonderful", "nightmare"];
const COMMON_WORDS = ["the", "a", "an", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "do", "does", "did", "will", "would", "could", "should", "may", "might", "can", "shall", "to", "of", "in", "for", "on", "with", "at", "by", "from", "as", "into", "through", "during", "before", "after", "above", "below", "between", "under", "and", "but", "or", "nor", "not", "so", "yet", "both", "either", "neither", "each", "every", "all", "any", "few", "more", "most", "other", "some", "such", "no", "only", "own", "same", "than", "too", "very", "just", "because", "if", "when", "where", "how", "what", "which", "who", "whom", "this", "that", "these", "those", "it", "its", "i", "me", "my", "we", "our", "you", "your", "he", "him", "his", "she", "her", "they", "them", "their"];

export default function HeadlineAnalyzer() {
  const [headline, setHeadline] = useState("");

  const analysis = useMemo(() => {
    if (!headline.trim()) return null;

    const words = headline.trim().split(/\s+/);
    const wordCount = words.length;
    const charCount = headline.length;
    const lowerWords = words.map((w) => w.toLowerCase().replace(/[^a-z]/g, ""));

    const powerFound = lowerWords.filter((w) => POWER_WORDS.includes(w));
    const emotionalFound = lowerWords.filter((w) => EMOTIONAL_WORDS.includes(w));
    const uncommonFound = lowerWords.filter((w) => w.length > 2 && !COMMON_WORDS.includes(w));

    let headlineType = "Statement";
    const lower = headline.toLowerCase();
    if (lower.startsWith("how to") || lower.startsWith("how ")) headlineType = "How-to";
    else if (/^\d+/.test(headline) || lower.includes("top ") || lower.includes("best ")) headlineType = "List / Listicle";
    else if (headline.includes("?")) headlineType = "Question";
    else if (lower.startsWith("why ")) headlineType = "Reason / Why";
    else if (lower.startsWith("what ")) headlineType = "Explainer";

    const hasNumber = /\d/.test(headline);
    const startsWithNumber = /^\d/.test(headline);

    // Score calculation
    let score = 30;
    if (wordCount >= 6 && wordCount <= 12) score += 15;
    else if (wordCount >= 4 && wordCount <= 15) score += 8;
    if (charCount >= 40 && charCount <= 70) score += 10;
    if (powerFound.length > 0) score += Math.min(15, powerFound.length * 5);
    if (emotionalFound.length > 0) score += Math.min(10, emotionalFound.length * 5);
    if (uncommonFound.length / wordCount > 0.3) score += 10;
    if (hasNumber) score += 5;
    if (startsWithNumber) score += 5;
    if (headlineType !== "Statement") score += 5;
    score = Math.min(100, Math.max(0, score));

    const suggestions: string[] = [];
    if (wordCount < 6) suggestions.push("Add more words. Aim for 6-12 words.");
    if (wordCount > 15) suggestions.push("Shorten your headline. Aim for 6-12 words.");
    if (powerFound.length === 0) suggestions.push("Add a power word like 'ultimate', 'proven', or 'free'.");
    if (emotionalFound.length === 0) suggestions.push("Consider adding emotional appeal.");
    if (!hasNumber) suggestions.push("Headlines with numbers tend to perform better.");
    if (charCount > 70) suggestions.push("Keep under 70 characters for better social media sharing.");

    const scoreColor = score >= 70 ? "text-green-600" : score >= 40 ? "text-yellow-600" : "text-red-600";
    const scoreLabel = score >= 70 ? "Great" : score >= 40 ? "Average" : "Needs Work";

    return { wordCount, charCount, powerFound, emotionalFound, uncommonFound, headlineType, score, scoreColor, scoreLabel, suggestions, hasNumber };
  }, [headline]);

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Enter Your Headline</label>
        <input
          type="text"
          placeholder="e.g. 10 Proven Ways to Boost Your Website Traffic in 2025"
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
          className="calc-input"
        />
      </div>

      {analysis && (
        <div className="result-card space-y-4">
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-1">Headline Score</div>
            <div className={`text-5xl font-extrabold ${analysis.scoreColor}`}>{analysis.score}</div>
            <div className={`text-sm font-semibold mt-1 ${analysis.scoreColor}`}>{analysis.scoreLabel}</div>
          </div>

          <div className="border-t border-gray-100 pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
              <div className="text-xs text-gray-400">Words</div>
              <div className="text-lg font-bold text-indigo-600">{analysis.wordCount}</div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
              <div className="text-xs text-gray-400">Characters</div>
              <div className="text-lg font-bold text-indigo-600">{analysis.charCount}</div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
              <div className="text-xs text-gray-400">Type</div>
              <div className="text-sm font-bold text-indigo-600">{analysis.headlineType}</div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
              <div className="text-xs text-gray-400">Has Number</div>
              <div className={`text-sm font-bold ${analysis.hasNumber ? "text-green-600" : "text-gray-400"}`}>{analysis.hasNumber ? "Yes" : "No"}</div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white rounded-xl p-3 border border-gray-100">
              <div className="text-xs text-gray-400 mb-1">Power Words ({analysis.powerFound.length})</div>
              <div className="flex flex-wrap gap-1">
                {analysis.powerFound.length > 0 ? analysis.powerFound.map((w, i) => (
                  <span key={i} className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{w}</span>
                )) : <span className="text-xs text-gray-400">None found</span>}
              </div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-100">
              <div className="text-xs text-gray-400 mb-1">Emotional Words ({analysis.emotionalFound.length})</div>
              <div className="flex flex-wrap gap-1">
                {analysis.emotionalFound.length > 0 ? analysis.emotionalFound.map((w, i) => (
                  <span key={i} className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">{w}</span>
                )) : <span className="text-xs text-gray-400">None found</span>}
              </div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-100">
              <div className="text-xs text-gray-400 mb-1">Uncommon Words ({analysis.uncommonFound.length})</div>
              <div className="flex flex-wrap gap-1">
                {analysis.uncommonFound.length > 0 ? analysis.uncommonFound.slice(0, 8).map((w, i) => (
                  <span key={i} className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{w}</span>
                )) : <span className="text-xs text-gray-400">None found</span>}
              </div>
            </div>
          </div>

          {analysis.suggestions.length > 0 && (
            <div className="border-t border-gray-100 pt-4">
              <div className="text-sm font-semibold text-gray-700 mb-2">Suggestions for Improvement</div>
              <ul className="text-sm text-gray-600 space-y-1">
                {analysis.suggestions.map((s, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-yellow-500 mt-0.5">*</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
