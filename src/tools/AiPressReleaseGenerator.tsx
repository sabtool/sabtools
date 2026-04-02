"use client";
import { useState } from "react";

type AnnouncementType = "Product Launch" | "Partnership" | "Award" | "Milestone" | "Event";

const leadTemplates: Record<AnnouncementType, string[]> = {
  "Product Launch": [
    "{company}, a leader in its industry, today announced the launch of {headline}. This innovative offering is designed to transform the way customers experience the market, setting new standards for quality and innovation.",
    "{company} is proud to unveil {headline}, a groundbreaking addition to its product lineup. The launch marks a significant milestone in the company's commitment to delivering cutting-edge solutions to its customers.",
  ],
  Partnership: [
    "{company} today announced a strategic partnership with a key industry player, centered around {headline}. This collaboration is expected to create significant synergies and deliver enhanced value to customers of both organizations.",
    "In a move set to reshape the industry landscape, {company} has entered into a strategic alliance focused on {headline}. The partnership combines complementary strengths to drive mutual growth and innovation.",
  ],
  Award: [
    "{company} has been honored with a prestigious recognition for {headline}. The award underscores the company's unwavering commitment to excellence and its impact on the industry.",
    "{company} is proud to announce that it has received distinguished recognition for {headline}, further cementing its position as an industry leader dedicated to innovation and quality.",
  ],
  Milestone: [
    "{company} today celebrated a landmark achievement: {headline}. This milestone reflects the company's sustained growth trajectory and the trust placed in it by customers and stakeholders alike.",
    "Marking a pivotal moment in its journey, {company} has achieved {headline}. This significant milestone demonstrates the company's resilience, vision, and commitment to long-term success.",
  ],
  Event: [
    "{company} has announced {headline}, an event designed to bring together industry leaders, innovators, and stakeholders for meaningful dialogue and collaboration.",
    "{company} is set to host {headline}, gathering thought leaders and professionals to explore the latest trends, share insights, and forge valuable connections.",
  ],
};

const bodyTemplates: Record<AnnouncementType, string[]> = {
  "Product Launch": [
    "The launch comes after months of research, development, and rigorous testing to ensure the highest standards of quality and performance. {details}\n\nThis new offering addresses a growing demand in the market for solutions that combine innovation with reliability. {company} has leveraged its deep industry expertise and customer feedback to create a product that truly meets the needs of today's consumers.\n\nThe product is expected to be available to customers through the company's established distribution channels and is anticipated to generate significant interest from both existing and new customers.",
  ],
  Partnership: [
    "The partnership brings together the unique strengths and capabilities of both organizations to create a more comprehensive offering for their combined customer base. {details}\n\nUnder the terms of the agreement, both parties will collaborate closely on product development, market expansion, and customer service initiatives. The partnership is expected to deliver measurable benefits within the first year of collaboration.\n\nIndustry analysts have noted that this strategic move positions both companies to better compete in an increasingly dynamic market landscape.",
  ],
  Award: [
    "The recognition was awarded based on rigorous evaluation criteria, including innovation, impact, quality, and customer satisfaction. {details}\n\nThis achievement reflects the dedication and hard work of the entire {company} team, whose commitment to excellence has been instrumental in earning this distinguished honor.\n\nThe award adds to {company}'s growing list of accolades and reinforces its reputation as a trusted leader in the industry.",
  ],
  Milestone: [
    "This achievement is the result of years of strategic planning, dedicated execution, and a relentless focus on delivering value to all stakeholders. {details}\n\nThe milestone is particularly significant given the challenging market conditions that the industry has faced in recent years. {company}'s ability to grow and thrive during this period speaks to the strength of its business model and the quality of its team.\n\nLooking ahead, {company} plans to build on this momentum with further investments in innovation, talent development, and market expansion.",
  ],
  Event: [
    "The event will feature keynote presentations, panel discussions, workshops, and networking sessions designed to address the most pressing topics in the industry. {details}\n\nAttendees will have the opportunity to hear from recognized experts, share best practices, and explore collaborative opportunities. The event is expected to attract participants from across the industry and beyond.\n\n{company} has organized this event as part of its ongoing commitment to fostering dialogue, promoting knowledge sharing, and driving positive change in the industry.",
  ],
};

function generatePressRelease(
  company: string,
  type: AnnouncementType,
  headline: string,
  details: string,
  quote: string,
  spokesperson: string,
  seed: number
): string {
  const c = company.trim() || "The Company";
  const h = headline.trim() || "its latest announcement";
  const d = details.trim() || "Further details will be shared in the coming weeks.";
  const q = quote.trim() || "We are incredibly excited about this development and look forward to the positive impact it will have.";
  const sp = spokesperson.trim() || "Company Spokesperson";

  const today = new Date();
  const dateline = `${today.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`;

  const lead = leadTemplates[type][seed % leadTemplates[type].length]
    .replace(/\{company\}/g, c).replace(/\{headline\}/g, h);

  const body = bodyTemplates[type][seed % bodyTemplates[type].length]
    .replace(/\{company\}/g, c).replace(/\{details\}/g, d);

  const quoteSection = `"${q}" said ${sp}, ${c}.`;

  const boilerplate = `About ${c}\n${c} is a forward-thinking organization dedicated to delivering innovative solutions and exceptional value to its customers and stakeholders. With a strong commitment to quality, integrity, and continuous improvement, ${c} continues to set new benchmarks in its industry. For more information, visit the company's official website.`;

  const contact = `Media Contact:\n${c} Communications Department\nEmail: press@${c.toLowerCase().replace(/\s+/g, "")}.com\nPhone: Available upon request`;

  return `FOR IMMEDIATE RELEASE\n\n${h.toUpperCase()}\n\n${c} Announces ${type}: ${h}\n\n${dateline} - ${lead}\n\n${body}\n\n${quoteSection}\n\n###\n\n${boilerplate}\n\n${contact}`;
}

export default function AiPressReleaseGenerator() {
  const [company, setCompany] = useState("");
  const [type, setType] = useState<AnnouncementType>("Product Launch");
  const [headline, setHeadline] = useState("");
  const [details, setDetails] = useState("");
  const [quote, setQuote] = useState("");
  const [spokesperson, setSpokesperson] = useState("");
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);
  const [seed, setSeed] = useState(0);

  const generate = () => {
    setResult(generatePressRelease(company, type, headline, details, quote, spokesperson, seed));
    setSeed((p) => p + 1);
  };

  const copy = () => {
    navigator.clipboard?.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const print = () => {
    const w = window.open("", "_blank");
    if (w) {
      w.document.write(`<html><head><title>Press Release</title><style>body{font-family:Georgia,serif;max-width:750px;margin:40px auto;padding:20px;line-height:1.8;color:#222;white-space:pre-line;}</style></head><body>${result}</body></html>`);
      w.document.close();
      w.print();
    }
  };

  const types: AnnouncementType[] = ["Product Launch", "Partnership", "Award", "Milestone", "Event"];

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Company Name</label>
        <input className="calc-input" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="e.g., TechVision India" />
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Announcement Type</label>
        <div className="flex gap-2 flex-wrap">
          {types.map((t) => (
            <button key={t} onClick={() => setType(t)} className={t === type ? "btn-primary" : "btn-secondary"}>{t}</button>
          ))}
        </div>
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Headline</label>
        <input className="calc-input" value={headline} onChange={(e) => setHeadline(e.target.value)} placeholder="e.g., Revolutionary AI-Powered Platform for Small Businesses" />
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Key Details</label>
        <textarea className="calc-input min-h-[100px]" value={details} onChange={(e) => setDetails(e.target.value)} placeholder="Key facts, features, dates, numbers..." />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Quote</label>
          <textarea className="calc-input min-h-[80px]" value={quote} onChange={(e) => setQuote(e.target.value)} placeholder="A quote from the spokesperson..." />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Spokesperson Name &amp; Title</label>
          <input className="calc-input" value={spokesperson} onChange={(e) => setSpokesperson(e.target.value)} placeholder="e.g., Rahul Kumar, CEO" />
        </div>
      </div>
      <button onClick={generate} className="btn-primary">Generate Press Release</button>
      {result && (
        <div className="result-card">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-bold text-gray-600">Press Release</span>
            <div className="flex gap-2">
              <button onClick={copy} className="text-xs text-indigo-600 font-medium hover:underline">{copied ? "Copied!" : "Copy"}</button>
              <button onClick={print} className="text-xs text-indigo-600 font-medium hover:underline">Print</button>
            </div>
          </div>
          <pre className="text-gray-800 leading-relaxed whitespace-pre-wrap font-sans text-sm">{result}</pre>
        </div>
      )}
    </div>
  );
}
