"use client";
import { useState, useMemo } from "react";

const ACTION_VERBS = ["achieved", "built", "created", "delivered", "designed", "developed", "drove", "enhanced", "established", "executed", "generated", "implemented", "improved", "increased", "initiated", "launched", "led", "managed", "optimized", "orchestrated", "reduced", "resolved", "scaled", "spearheaded", "streamlined", "transformed"];
const TECH_TERMS = ["javascript", "typescript", "react", "angular", "vue", "node", "python", "java", "sql", "aws", "docker", "kubernetes", "git", "api", "rest", "graphql", "mongodb", "postgresql", "redis", "ci/cd", "agile", "scrum", "machine learning", "data analysis", "html", "css", "linux", "cloud", "devops", "microservices"];
const SECTIONS = ["summary", "objective", "experience", "education", "skills", "projects", "certifications", "achievements", "awards", "contact"];

export default function ResumeScoreChecker() {
  const [text, setText] = useState("");

  const analysis = useMemo(() => {
    if (!text.trim()) return null;
    const lower = text.toLowerCase();
    const words = text.split(/\s+/).filter(Boolean);
    const wordCount = words.length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length;
    const lines = text.split("\n").filter(l => l.trim());

    // Action verbs
    const foundVerbs = ACTION_VERBS.filter(v => lower.includes(v));
    const verbScore = Math.min(25, (foundVerbs.length / 8) * 25);

    // Technical terms
    const foundTerms = TECH_TERMS.filter(t => lower.includes(t));
    const techScore = Math.min(15, (foundTerms.length / 5) * 15);

    // Sections
    const foundSections = SECTIONS.filter(s => {
      const regex = new RegExp(`(^|\\n)\\s*${s}`, "i");
      return regex.test(text);
    });
    const hasSummary = foundSections.some(s => ["summary", "objective"].includes(s));
    const hasExperience = foundSections.some(s => s === "experience");
    const hasEducation = foundSections.some(s => s === "education");
    const hasSkills = foundSections.some(s => s === "skills");
    const sectionScore = Math.min(25, (foundSections.length / 5) * 25);

    // Length score
    let lengthScore = 0;
    if (wordCount >= 200 && wordCount <= 800) lengthScore = 15;
    else if (wordCount >= 100) lengthScore = 10;
    else if (wordCount >= 50) lengthScore = 5;

    // Formatting
    const hasBullets = text.includes("- ") || text.includes("* ") || text.includes("  ");
    const hasNumbers = /\d+%|\d+ (million|crore|lakh|users|clients|projects)/i.test(text);
    const hasEmail = /[\w.-]+@[\w.-]+\.\w+/.test(text);
    const hasPhone = /(\+91|91)?[\s-]?\d{10}/.test(text);
    let formatScore = 0;
    if (hasBullets) formatScore += 5;
    if (hasNumbers) formatScore += 5;
    if (hasEmail) formatScore += 5;
    if (hasPhone) formatScore += 5;
    formatScore = Math.min(20, formatScore);

    const totalScore = Math.round(verbScore + techScore + sectionScore + lengthScore + formatScore);

    const suggestions: string[] = [];
    if (!hasSummary) suggestions.push("Add a Professional Summary or Objective section at the top.");
    if (!hasExperience) suggestions.push("Include a Work Experience section with detailed bullet points.");
    if (!hasEducation) suggestions.push("Add an Education section with your degrees and institutions.");
    if (!hasSkills) suggestions.push("Include a Skills section listing your technical and soft skills.");
    if (foundVerbs.length < 5) suggestions.push("Use more action verbs (e.g., achieved, implemented, led, optimized).");
    if (!hasNumbers) suggestions.push("Add quantifiable achievements (e.g., 'increased revenue by 25%').");
    if (wordCount < 200) suggestions.push("Your resume seems too short. Aim for 300-600 words for a 1-page resume.");
    if (wordCount > 1000) suggestions.push("Your resume may be too long. Consider condensing to 1-2 pages.");
    if (!hasBullets) suggestions.push("Use bullet points for better readability.");
    if (!hasEmail) suggestions.push("Include your email address for contact.");
    if (!hasPhone) suggestions.push("Include your phone number for contact.");

    const atsTips = [
      "Use standard section headings (Experience, Education, Skills).",
      "Avoid tables, images, and complex formatting.",
      "Use a single-column layout for best ATS parsing.",
      "Include keywords from the job description you're targeting.",
      "Save as .docx or .pdf format for ATS compatibility.",
      "Spell out acronyms at least once (e.g., 'Search Engine Optimization (SEO)').",
    ];

    return {
      wordCount, sentences, lines: lines.length, totalScore,
      verbScore: Math.round(verbScore), techScore: Math.round(techScore),
      sectionScore: Math.round(sectionScore), lengthScore, formatScore: Math.round(formatScore),
      foundVerbs, foundTerms, foundSections,
      hasSummary, hasExperience, hasEducation, hasSkills,
      suggestions, atsTips,
    };
  }, [text]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    if (score >= 40) return "text-orange-600";
    return "text-red-600";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Needs Improvement";
    return "Poor";
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Paste Your Resume Text</label>
        <textarea rows={12} placeholder="Paste your entire resume content here..." value={text} onChange={e => setText(e.target.value)} className="calc-input" />
      </div>

      {analysis && (
        <div className="space-y-4">
          {/* Overall Score */}
          <div className="result-card text-center">
            <div className="text-sm text-gray-500">Resume Score</div>
            <div className={`text-5xl font-extrabold mt-1 ${getScoreColor(analysis.totalScore)}`}>{analysis.totalScore}<span className="text-2xl">/100</span></div>
            <div className={`text-lg font-semibold mt-1 ${getScoreColor(analysis.totalScore)}`}>{getScoreLabel(analysis.totalScore)}</div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-white rounded-xl p-3 text-center shadow-sm"><div className="text-xs text-gray-500">Words</div><div className="text-xl font-bold text-gray-800">{analysis.wordCount}</div></div>
            <div className="bg-white rounded-xl p-3 text-center shadow-sm"><div className="text-xs text-gray-500">Sentences</div><div className="text-xl font-bold text-gray-800">{analysis.sentences}</div></div>
            <div className="bg-white rounded-xl p-3 text-center shadow-sm"><div className="text-xs text-gray-500">Lines</div><div className="text-xl font-bold text-gray-800">{analysis.lines}</div></div>
          </div>

          {/* Score Breakdown */}
          <div className="result-card space-y-3">
            <h3 className="font-bold text-gray-800">Score Breakdown</h3>
            {[
              { label: "Action Verbs", score: analysis.verbScore, max: 25 },
              { label: "Technical Keywords", score: analysis.techScore, max: 15 },
              { label: "Sections Detected", score: analysis.sectionScore, max: 25 },
              { label: "Resume Length", score: analysis.lengthScore, max: 15 },
              { label: "Formatting & Contact", score: analysis.formatScore, max: 20 },
            ].map(item => (
              <div key={item.label}>
                <div className="flex justify-between text-sm"><span className="text-gray-600">{item.label}</span><span className="font-semibold">{item.score}/{item.max}</span></div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div className="bg-indigo-600 h-2 rounded-full transition-all" style={{ width: `${(item.score / item.max) * 100}%` }}></div>
                </div>
              </div>
            ))}
          </div>

          {/* Sections Found */}
          <div className="result-card">
            <h3 className="font-bold text-gray-800 mb-2">Sections Detected</h3>
            <div className="flex flex-wrap gap-2">
              {SECTIONS.map(s => {
                const found = analysis.foundSections.includes(s);
                return <span key={s} className={`px-3 py-1 rounded-full text-xs font-semibold ${found ? "bg-green-100 text-green-700" : "bg-red-100 text-red-500"}`}>
                  {found ? "\u2713" : "\u2717"} {s.charAt(0).toUpperCase() + s.slice(1)}
                </span>;
              })}
            </div>
          </div>

          {/* Keywords Found */}
          {analysis.foundVerbs.length > 0 && (
            <div className="result-card">
              <h3 className="font-bold text-gray-800 mb-2">Action Verbs Found ({analysis.foundVerbs.length})</h3>
              <div className="flex flex-wrap gap-2">
                {analysis.foundVerbs.map(v => <span key={v} className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">{v}</span>)}
              </div>
            </div>
          )}

          {/* Suggestions */}
          {analysis.suggestions.length > 0 && (
            <div className="result-card">
              <h3 className="font-bold text-gray-800 mb-2">Suggestions for Improvement</h3>
              <ul className="space-y-2">
                {analysis.suggestions.map((s, i) => <li key={i} className="text-sm text-gray-700 flex gap-2"><span className="text-orange-500 font-bold shrink-0">!</span>{s}</li>)}
              </ul>
            </div>
          )}

          {/* ATS Tips */}
          <div className="result-card">
            <h3 className="font-bold text-gray-800 mb-2">ATS Compatibility Tips</h3>
            <ul className="space-y-2">
              {analysis.atsTips.map((t, i) => <li key={i} className="text-sm text-gray-700 flex gap-2"><span className="text-indigo-500 font-bold shrink-0">{i + 1}.</span>{t}</li>)}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
