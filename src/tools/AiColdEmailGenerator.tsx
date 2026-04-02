"use client";
import { useState } from "react";

type EmailStyle = "Direct" | "Curiosity-based" | "Value-first";

interface EmailResult {
  style: string;
  subject: string;
  body: string;
}

const subjectTemplates: Record<EmailStyle, string[]> = {
  Direct: [
    "Quick question about {recipientCompany}'s {benefit}",
    "{yourName} from {yourCompany} - Let's discuss {offer}",
    "Can we help {recipientCompany} with {benefit}?",
  ],
  "Curiosity-based": [
    "Noticed something interesting about {recipientCompany}...",
    "A thought about {recipientCompany}'s growth",
    "{recipientCompany} + {yourCompany} = ?",
  ],
  "Value-first": [
    "3 ways {recipientCompany} can improve {benefit}",
    "How {yourCompany} helped companies like {recipientCompany}",
    "Free insight: {benefit} for {recipientCompany}",
  ],
};

const bodyTemplates: Record<EmailStyle, string[]> = {
  Direct: [
    `Hi there,

I'm {yourName} from {yourCompany}. I'll keep this brief.

We specialize in {offer}, and I believe it could significantly benefit {recipientCompany}, particularly when it comes to {benefit}.

We've helped similar companies achieve measurable results, and I'd love to explore whether we can do the same for you.

{cta}

Looking forward to connecting.

Best regards,
{yourName}
{yourCompany}`,
    `Hello,

My name is {yourName}, and I lead {offer} at {yourCompany}.

I'm reaching out because I see a strong alignment between what we do and what {recipientCompany} is building. Specifically, I think we can help you {benefit}.

Would you be open to a brief conversation this week?

{cta}

Best,
{yourName}
{yourCompany}`,
  ],
  "Curiosity-based": [
    `Hi,

I've been following {recipientCompany}'s journey, and something caught my attention.

Most companies in your space struggle with {benefit} - but I think {recipientCompany} is positioned to do something different.

At {yourCompany}, we've developed a unique approach to {offer} that has helped businesses unlock results they didn't think were possible.

I'd love to share a quick insight that could be valuable for your team. No strings attached.

{cta}

Cheers,
{yourName}
{yourCompany}`,
    `Hello,

Here's a question I've been thinking about: What if {recipientCompany} could dramatically improve {benefit} with minimal effort?

I'm {yourName} from {yourCompany}, and we've been working on exactly this kind of challenge. Our approach to {offer} has produced some surprising results.

I have a few ideas specifically for {recipientCompany} that I think you'd find interesting.

{cta}

Best,
{yourName}
{yourCompany}`,
  ],
  "Value-first": [
    `Hi,

Before I introduce myself, let me share something valuable:

Companies similar to {recipientCompany} have seen significant improvements in {benefit} by making a few strategic adjustments to their approach. Here are the top areas where the biggest gains tend to come from:

1. Optimizing current workflows for maximum efficiency
2. Leveraging data-driven insights for smarter decisions
3. Implementing proven frameworks that accelerate growth

At {yourCompany}, I'm {yourName}, and we specialize in {offer}. We've helped companies achieve these exact improvements.

I've put together a few specific recommendations for {recipientCompany} that I'd love to share.

{cta}

Looking forward to adding value,
{yourName}
{yourCompany}`,
    `Hello,

I wanted to share something that might be useful for {recipientCompany}.

In our work at {yourCompany}, we've discovered that most businesses leave significant {benefit} on the table simply because they haven't optimized their approach to {offer}.

Here's what we've seen work:
- Companies that focus on this area see measurable improvements within weeks
- The changes required are often simpler than expected
- The ROI typically exceeds expectations

I'd be happy to share a quick analysis specific to {recipientCompany} - completely free, no obligation.

{cta}

Best regards,
{yourName}
{yourCompany}`,
  ],
};

const tips = [
  "Keep subject lines under 60 characters for best open rates",
  "Personalize the first line - reference their recent work or achievements",
  "Follow up 3-5 days later if you don't hear back",
  "Best sending times: Tuesday-Thursday, 8-10 AM recipient's timezone",
  "A/B test your subject lines to find what resonates",
  "End with a clear, specific call-to-action",
  "Keep the email under 150 words for better response rates",
];

export default function AiColdEmailGenerator() {
  const [yourName, setYourName] = useState("");
  const [yourCompany, setYourCompany] = useState("");
  const [recipientCompany, setRecipientCompany] = useState("");
  const [offer, setOffer] = useState("");
  const [benefit, setBenefit] = useState("");
  const [cta, setCta] = useState("");
  const [results, setResults] = useState<EmailResult[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [seed, setSeed] = useState(0);

  const fill = (template: string) => {
    return template
      .replace(/\{yourName\}/g, yourName.trim() || "Your Name")
      .replace(/\{yourCompany\}/g, yourCompany.trim() || "Your Company")
      .replace(/\{recipientCompany\}/g, recipientCompany.trim() || "Their Company")
      .replace(/\{offer\}/g, offer.trim() || "our services")
      .replace(/\{benefit\}/g, benefit.trim() || "growth and efficiency")
      .replace(/\{cta\}/g, cta.trim() || "Would you be open to a 15-minute call this week?");
  };

  const generate = () => {
    const s = seed;
    const styles: EmailStyle[] = ["Direct", "Curiosity-based", "Value-first"];
    const emailResults: EmailResult[] = styles.map((style) => {
      const subjects = subjectTemplates[style];
      const bodies = bodyTemplates[style];
      return {
        style,
        subject: fill(subjects[s % subjects.length]),
        body: fill(bodies[s % bodies.length]),
      };
    });
    setResults(emailResults);
    setSeed((p) => p + 1);
  };

  const copy = (idx: number) => {
    const r = results[idx];
    const text = `Subject: ${r.subject}\n\n${r.body}`;
    navigator.clipboard?.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Your Name</label>
          <input className="calc-input" value={yourName} onChange={(e) => setYourName(e.target.value)} placeholder="John Doe" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Your Company</label>
          <input className="calc-input" value={yourCompany} onChange={(e) => setYourCompany(e.target.value)} placeholder="Acme Inc." />
        </div>
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Recipient&apos;s Company</label>
        <input className="calc-input" value={recipientCompany} onChange={(e) => setRecipientCompany(e.target.value)} placeholder="Target Corp." />
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">What You Offer</label>
        <input className="calc-input" value={offer} onChange={(e) => setOffer(e.target.value)} placeholder="e.g., digital marketing services, SaaS solutions..." />
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Key Benefit</label>
        <input className="calc-input" value={benefit} onChange={(e) => setBenefit(e.target.value)} placeholder="e.g., increasing revenue by 30%, reducing costs..." />
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Call to Action</label>
        <input className="calc-input" value={cta} onChange={(e) => setCta(e.target.value)} placeholder="e.g., Can we hop on a 15-min call this week?" />
      </div>
      <button onClick={generate} className="btn-primary">Generate Cold Emails</button>
      {results.length > 0 && (
        <div className="space-y-4">
          {results.map((r, i) => (
            <div key={i} className="result-card">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-gray-600">{r.style} Approach</span>
                <button onClick={() => copy(i)} className="text-xs text-indigo-600 font-medium hover:underline">{copiedIdx === i ? "Copied!" : "Copy"}</button>
              </div>
              <div className="mb-2 p-2 bg-indigo-50 rounded">
                <span className="text-xs font-semibold text-indigo-700">Subject: </span>
                <span className="text-sm text-indigo-900">{r.subject}</span>
              </div>
              <p className="text-gray-800 leading-relaxed whitespace-pre-line text-sm">{r.body}</p>
            </div>
          ))}
          <div className="result-card bg-amber-50 border-amber-200">
            <span className="text-sm font-bold text-amber-700 block mb-2">Pro Tips</span>
            <ul className="space-y-1">
              {tips.map((tip, i) => (
                <li key={i} className="text-sm text-amber-800 flex gap-2">
                  <span className="text-amber-500">&#x2713;</span>{tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
