"use client";
import { useState, useMemo } from "react";

interface Summary {
  decisions: string[];
  actionItems: string[];
  attendees: string[];
  nextSteps: string[];
  keyPoints: string[];
}

function extractSummary(text: string): Summary {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const sentences = text.match(/[^.!?\n]+[.!?\n]*/g)?.map((s) => s.trim()) || lines;

  const decisions: string[] = [];
  const actionItems: string[] = [];
  const attendees: string[] = [];
  const nextSteps: string[] = [];
  const keyPoints: string[] = [];

  const decisionWords = /\b(decided|agreed|approved|confirmed|resolved|concluded|finalized|voted|determined)\b/i;
  const actionWords = /\b(will|need to|should|must|has to|going to|assigned to|responsible for|action item|todo|task|deadline|by \w+ \d+)\b/i;
  const nextStepWords = /\b(next step|follow up|follow-up|moving forward|going forward|upcoming|plan to|schedule|arrange)\b/i;

  // Extract attendees - look for "Attendees:", "Present:", names at start
  const attendeeLine = lines.find((l) => /^(attendees|present|participants|members|people)\s*[:=]/i.test(l));
  if (attendeeLine) {
    const names = attendeeLine.replace(/^(attendees|present|participants|members|people)\s*[:=]\s*/i, "").split(/[,;&]+/).map((n) => n.trim()).filter(Boolean);
    attendees.push(...names);
  }

  // Also look for @mentions or "Name:" patterns
  const namePatterns = text.match(/@(\w+)/g);
  if (namePatterns) {
    namePatterns.forEach((n) => {
      const name = n.replace("@", "");
      if (!attendees.includes(name)) attendees.push(name);
    });
  }

  sentences.forEach((s) => {
    const cleaned = s.replace(/^[-*•]\s*/, "").trim();
    if (!cleaned) return;

    if (decisionWords.test(cleaned)) {
      decisions.push(cleaned.replace(/\.$/, ""));
    }
    if (actionWords.test(cleaned)) {
      actionItems.push(cleaned.replace(/\.$/, ""));
    }
    if (nextStepWords.test(cleaned)) {
      nextSteps.push(cleaned.replace(/\.$/, ""));
    }
  });

  // Key points: first sentence of each paragraph or bullet points
  lines.forEach((l) => {
    if (/^[-*•]\s/.test(l) || /^\d+[.)]\s/.test(l)) {
      const point = l.replace(/^[-*•\d.)\s]+/, "").trim();
      if (point && !decisions.includes(point) && !actionItems.includes(point)) {
        keyPoints.push(point);
      }
    }
  });

  // If no structured extraction, extract first sentences of paragraphs
  if (keyPoints.length === 0) {
    const paragraphs = text.split(/\n\s*\n/);
    paragraphs.forEach((p) => {
      const firstSentence = p.trim().match(/^[^.!?]+[.!?]/);
      if (firstSentence) keyPoints.push(firstSentence[0].trim());
    });
  }

  return {
    decisions: decisions.length > 0 ? decisions : ["No explicit decisions found. Look for agreed-upon outcomes."],
    actionItems: actionItems.length > 0 ? actionItems : ["No explicit action items found. Review notes for implicit tasks."],
    attendees: attendees.length > 0 ? attendees : ["No attendees detected. Add names at the top of your notes."],
    nextSteps: nextSteps.length > 0 ? nextSteps : ["No explicit next steps found. Review action items for follow-ups."],
    keyPoints: keyPoints.slice(0, 10),
  };
}

export default function AiMeetingNotesSummarizer() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState<Summary | null>(null);
  const [copied, setCopied] = useState(false);

  const generate = () => {
    if (!text.trim()) return;
    setSummary(extractSummary(text));
  };

  const fullText = useMemo(() => {
    if (!summary) return "";
    let out = "MEETING SUMMARY\n\n";
    out += "ATTENDEES\n" + summary.attendees.map((a) => `- ${a}`).join("\n") + "\n\n";
    out += "KEY DECISIONS\n" + summary.decisions.map((d) => `- ${d}`).join("\n") + "\n\n";
    out += "ACTION ITEMS\n" + summary.actionItems.map((a) => `- ${a}`).join("\n") + "\n\n";
    out += "KEY POINTS\n" + summary.keyPoints.map((k) => `- ${k}`).join("\n") + "\n\n";
    out += "NEXT STEPS\n" + summary.nextSteps.map((n) => `- ${n}`).join("\n");
    return out;
  }, [summary]);

  const copy = () => {
    navigator.clipboard?.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const wordCount = useMemo(() => text.trim().split(/\s+/).filter(Boolean).length, [text]);

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Paste Meeting Notes</label>
        <textarea className="calc-input min-h-[200px]" value={text} onChange={(e) => setText(e.target.value)} placeholder={"Attendees: John, Sarah, Mike\n\nDiscussed Q4 targets. Decided to increase marketing budget by 20%.\nSarah will prepare the updated budget proposal by Friday.\nAgreed to launch the new feature next sprint.\nNext step: Schedule follow-up meeting with the design team.\nAction item: Mike needs to complete the API documentation."} />
        <p className="text-xs text-gray-400 mt-1">{wordCount} words</p>
      </div>
      <button onClick={generate} className="btn-primary">Summarize Meeting Notes</button>

      {summary && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={copy} className="text-xs text-indigo-600 font-medium hover:underline">{copied ? "Copied!" : "Copy Summary"}</button>
          </div>
          <div className="result-card">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Meeting Summary</h3>

            <div className="mb-4">
              <h4 className="font-semibold text-blue-700 mb-2">Attendees</h4>
              <div className="flex flex-wrap gap-2">
                {summary.attendees.map((a, i) => (
                  <span key={i} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">{a}</span>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold text-green-700 mb-2">Key Decisions</h4>
              <ul className="space-y-1">
                {summary.decisions.map((d, i) => (
                  <li key={i} className="text-sm text-gray-700 flex items-start gap-2"><span className="text-green-500 mt-0.5">&#10003;</span>{d}</li>
                ))}
              </ul>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold text-orange-700 mb-2">Action Items</h4>
              <ul className="space-y-1">
                {summary.actionItems.map((a, i) => (
                  <li key={i} className="text-sm text-gray-700 flex items-start gap-2"><span className="text-orange-500 mt-0.5">&#9654;</span>{a}</li>
                ))}
              </ul>
            </div>

            {summary.keyPoints.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold text-purple-700 mb-2">Key Points</h4>
                <ul className="space-y-1">
                  {summary.keyPoints.map((k, i) => (
                    <li key={i} className="text-sm text-gray-700 flex items-start gap-2"><span className="text-purple-400">&#8226;</span>{k}</li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <h4 className="font-semibold text-indigo-700 mb-2">Next Steps</h4>
              <ul className="space-y-1">
                {summary.nextSteps.map((n, i) => (
                  <li key={i} className="text-sm text-gray-700 flex items-start gap-2"><span className="text-indigo-500 mt-0.5">&#10148;</span>{n}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
