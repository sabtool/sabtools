"use client";
import { useState } from "react";

type Duration = "5" | "10" | "15" | "20";

interface Section { title: string; duration: string; points: string[] }

function generateOutline(topic: string, duration: Duration): Section[] {
  const mins = parseInt(duration);
  const numMainPoints = mins <= 5 ? 3 : mins <= 10 ? 4 : 5;

  const hookTime = "0:00 - 0:30";
  const introTime = mins <= 5 ? "0:30 - 1:00" : "0:30 - 1:30";
  const introEnd = mins <= 5 ? 1 : 1.5;
  const ctaStart = mins - (mins <= 5 ? 0.5 : 1);
  const outroStart = mins - 0.5;
  const mainTime = ctaStart - introEnd;
  const perPoint = mainTime / numMainPoints;

  const sections: Section[] = [];

  sections.push({
    title: "Hook (First 30 Seconds)",
    duration: hookTime,
    points: [
      `Open with a bold statement or surprising fact about ${topic}`,
      `Ask a thought-provoking question: "Have you ever wondered about ${topic}?"`,
      "Create curiosity gap — tell viewers what they'll learn by staying",
      "Pattern interrupt: Start with an unexpected visual or statement",
    ],
  });

  sections.push({
    title: "Introduction",
    duration: introTime,
    points: [
      `Introduce yourself and establish why you're qualified to talk about ${topic}`,
      `Brief overview of what this video covers about ${topic}`,
      "Tell viewers why this matters to them RIGHT NOW",
      `Ask viewers to like and subscribe if they find ${topic} interesting`,
    ],
  });

  const mainPointTitles = [
    `The Foundation: Understanding ${topic} Basics`,
    `Key Strategies for ${topic} Success`,
    `Common Mistakes to Avoid with ${topic}`,
    `Advanced Tips for Mastering ${topic}`,
    `Real-World Applications of ${topic}`,
  ];

  const mainPointDetails: string[][] = [
    [
      `Define the core concepts of ${topic} in simple terms`,
      "Use an analogy or real-life example to make it relatable",
      "Address the biggest misconception people have",
      "Engagement: Ask viewers to comment their experience with this aspect",
    ],
    [
      `Share 2-3 actionable strategies related to ${topic}`,
      "Provide step-by-step guidance for each strategy",
      "Include a personal story or case study for credibility",
      "Show before/after or comparison to illustrate the impact",
    ],
    [
      `Highlight the top 3 mistakes people make with ${topic}`,
      "Explain WHY each mistake happens (not just what it is)",
      "Provide the correct approach for each mistake",
      "Engagement: Ask viewers if they've made any of these mistakes",
    ],
    [
      `Share insider tips that aren't commonly known about ${topic}`,
      "Demonstrate a technique or tool that gives an edge",
      "Reference data or expert opinions to back up claims",
      "Challenge viewers to try one advanced technique this week",
    ],
    [
      `Show practical, real-world examples of ${topic} in action`,
      "Walk through a complete example from start to finish",
      "Discuss variations and how to adapt to different situations",
      "Engagement: Ask viewers to share their own examples in comments",
    ],
  ];

  let currentTime = introEnd;
  for (let i = 0; i < numMainPoints; i++) {
    const endTime = currentTime + perPoint;
    sections.push({
      title: `Main Point ${i + 1}: ${mainPointTitles[i]}`,
      duration: `${Math.floor(currentTime)}:${(currentTime % 1 >= 0.5 ? "30" : "00")} - ${Math.floor(endTime)}:${(endTime % 1 >= 0.5 ? "30" : "00")}`,
      points: mainPointDetails[i],
    });
    currentTime = endTime;
  }

  sections.push({
    title: "Call to Action (CTA)",
    duration: `${Math.floor(ctaStart)}:${ctaStart % 1 >= 0.5 ? "30" : "00"} - ${Math.floor(outroStart)}:${outroStart % 1 >= 0.5 ? "30" : "00"}`,
    points: [
      "Summarize the 3 biggest takeaways from the video",
      `Challenge viewers to take one specific action related to ${topic}`,
      "Ask a question to drive comments and engagement",
      "Mention a related video they should watch next (link in description)",
    ],
  });

  sections.push({
    title: "Outro",
    duration: `${Math.floor(outroStart)}:${outroStart % 1 >= 0.5 ? "30" : "00"} - ${mins}:00`,
    points: [
      "Quick recap of the value provided",
      "Remind to like, subscribe, and hit the notification bell",
      "Tease upcoming content to keep them coming back",
      "End with an end screen promoting related videos",
    ],
  });

  return sections;
}

export default function AiYoutubeScriptOutline() {
  const [topic, setTopic] = useState("");
  const [duration, setDuration] = useState<Duration>("10");
  const [outline, setOutline] = useState<Section[]>([]);
  const [copied, setCopied] = useState(false);

  const generate = () => {
    if (!topic.trim()) return;
    setOutline(generateOutline(topic.trim(), duration));
  };

  const copy = () => {
    const text = outline.map((s) =>
      `## ${s.title} (${s.duration})\n${s.points.map((p) => `- ${p}`).join("\n")}`
    ).join("\n\n");
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Video Topic</label>
        <input className="calc-input" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. How to Start a YouTube Channel" />
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Target Length</label>
        <div className="flex gap-2 flex-wrap">
          {(["5", "10", "15", "20"] as Duration[]).map((d) => (
            <button key={d} onClick={() => setDuration(d)} className={d === duration ? "btn-primary" : "btn-secondary"}>{d} min</button>
          ))}
        </div>
      </div>
      <button onClick={generate} className="btn-primary">Generate Script Outline</button>
      {outline.length > 0 && (
        <div className="result-card space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-gray-600">Script Outline ({duration} min video)</span>
            <button onClick={copy} className="text-xs text-indigo-600 font-medium hover:underline">{copied ? "Copied!" : "Copy All"}</button>
          </div>
          {outline.map((section, i) => (
            <div key={i} className="bg-white rounded-xl p-4 border border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-gray-800">{section.title}</h3>
                <span className="text-xs text-indigo-600 font-mono bg-indigo-50 px-2 py-1 rounded">{section.duration}</span>
              </div>
              <ul className="space-y-1">
                {section.points.map((p, j) => (
                  <li key={j} className="text-sm text-gray-600 flex gap-2">
                    <span className="text-indigo-400 shrink-0">-</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
            <p className="text-sm font-bold text-amber-800 mb-2">Engagement Tips</p>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>- Ask questions every 2-3 minutes to boost engagement</li>
              <li>- Use pattern interrupts (graphics, B-roll, zoom cuts) to retain attention</li>
              <li>- Front-load value in the first 30 seconds to reduce bounce rate</li>
              <li>- Add chapters in your video description using timestamps</li>
              <li>- Keep energy high and vary your pacing throughout</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
