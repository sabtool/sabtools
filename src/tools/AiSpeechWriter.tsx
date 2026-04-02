"use client";
import { useState } from "react";

type Occasion = "Welcome Speech" | "Farewell" | "Vote of Thanks" | "Motivational" | "Independence Day" | "Republic Day" | "Teachers Day" | "Annual Day" | "Award Ceremony" | "Graduation";
type Duration = 2 | 5 | 10;

interface SpeechData {
  speaker: string;
  audience: string;
  keyPoints: string;
  duration: Duration;
}

const openingHooks: Record<Occasion, string[]> = {
  "Welcome Speech": [
    "A very warm and hearty welcome to each and every one of you gathered here today.",
    "It is my privilege and honor to welcome you all to this wonderful occasion.",
    "Good [morning/afternoon/evening]! What a pleasure it is to see so many familiar and new faces here today.",
  ],
  Farewell: [
    "They say every ending is a new beginning, and today we gather to celebrate just that.",
    "Parting is bittersweet, but the memories we share will last a lifetime.",
    "Today marks not an ending, but a beautiful transition to new adventures and possibilities.",
  ],
  "Vote of Thanks": [
    "As we come to the conclusion of this wonderful event, it is time to express our heartfelt gratitude.",
    "Behind every successful event are countless people whose efforts made it possible. Today, we honor them.",
    "No event succeeds without the collective effort of many, and today we acknowledge those contributions.",
  ],
  Motivational: [
    "What if I told you that the only limit to your achievements is the one you set for yourself?",
    "Every great achievement in history started with a single thought: I can do this.",
    "Today, I want to share something that has the power to transform how you see your potential.",
  ],
  "Independence Day": [
    "On this glorious day, we celebrate the spirit of freedom that defines our great nation.",
    "Seventy-seven years ago, our founding leaders gave us the greatest gift: the gift of freedom.",
    "As the tricolor flies high today, we are reminded of the sacrifices that gave us this liberty.",
  ],
  "Republic Day": [
    "Today we celebrate the day our nation adopted the constitution that guides our democracy.",
    "Republic Day is not just a holiday; it is a reminder of the values that bind us as a nation.",
    "As we witness the parade of our nation's strength and diversity, we are filled with pride.",
  ],
  "Teachers Day": [
    "A teacher affects eternity; no one can tell where their influence stops.",
    "Today we honor those who shape minds, inspire hearts, and build the future of our nation.",
    "Behind every successful person is a teacher who believed in them before they believed in themselves.",
  ],
  "Annual Day": [
    "Welcome to the celebration of another remarkable year of achievements and growth.",
    "As we look back on the past year, we find countless reasons to celebrate and be proud.",
    "Today marks the culmination of a year filled with hard work, dedication, and outstanding accomplishments.",
  ],
  "Award Ceremony": [
    "Excellence deserves recognition, and today we gather to celebrate those who have gone above and beyond.",
    "Behind every award is a story of perseverance, dedication, and the refusal to accept mediocrity.",
    "Today, we shine a spotlight on those whose efforts have made a remarkable difference.",
  ],
  Graduation: [
    "Congratulations, graduates! Today marks the beginning of an extraordinary new chapter in your lives.",
    "You came here as students, and you leave today as graduates ready to change the world.",
    "This moment represents years of hard work, late nights, and unwavering determination.",
  ],
};

const audienceEngagement = [
  "Let me ask you something — {question}?",
  "Take a moment to think about this: {question}?",
  "I want you to turn to the person next to you and ask: {question}?",
  "Show of hands — how many of you have experienced {question}?",
  "Close your eyes for a moment and imagine: {question}.",
];

const closingTemplates: Record<Occasion, string[]> = {
  "Welcome Speech": ["Once again, welcome to all. Let us make this occasion truly memorable together."],
  Farewell: ["We wish you all the very best in your future endeavors. You will always be in our hearts."],
  "Vote of Thanks": ["Thank you all for being part of this wonderful event. Your presence made it special."],
  Motivational: ["Remember, the best time to start was yesterday. The next best time is now. Go out there and make it happen!"],
  "Independence Day": ["Jai Hind! Let us pledge to uphold the values of freedom and work towards a stronger, united nation."],
  "Republic Day": ["Jai Hind! Let us rededicate ourselves to the principles of our constitution and the betterment of our nation."],
  "Teachers Day": ["Happy Teachers Day to all the wonderful educators. Your impact is immeasurable and your legacy is eternal."],
  "Annual Day": ["Here's to another year of excellence, growth, and achievement. Together, we will reach even greater heights."],
  "Award Ceremony": ["Congratulations once again to all the awardees. You inspire us all to aim higher and achieve more."],
  Graduation: ["Congratulations, Class of ${year}! The world is waiting for your brilliance. Go out and make us proud!"],
};

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

function generateSpeech(occasion: Occasion, data: SpeechData): string {
  const points = data.keyPoints.split(",").map(p => p.trim()).filter(Boolean);
  const hook = pick(openingHooks[occasion])
    .replace("[morning/afternoon/evening]", new Date().getHours() < 12 ? "morning" : new Date().getHours() < 17 ? "afternoon" : "evening");

  let speech = `${hook}\n\n`;
  speech += `My name is ${data.speaker}, and I am truly honored to stand before ${data.audience || "this distinguished gathering"} today.\n\n`;

  // Body based on key points
  if (points.length > 0) {
    points.forEach((point, i) => {
      speech += `${point.charAt(0).toUpperCase() + point.slice(1)} is something that holds great significance in this context. `;
      if (i === 0) {
        speech += `When we think about ${point}, we realize how it shapes our perspective and influences the way we approach challenges. It is a foundation upon which we build our understanding and our actions.\n\n`;
      } else if (i === points.length - 1) {
        speech += `And perhaps most importantly, ${point} reminds us that our collective efforts matter more than individual accomplishments. Together, with ${point} as our guiding principle, we can achieve extraordinary things.\n\n`;
      } else {
        speech += `The role of ${point} cannot be underestimated. It connects to everything we have discussed and adds another dimension to our understanding. Let us not forget the importance of ${point} as we move forward.\n\n`;
      }
    });
  } else {
    speech += `This occasion holds special significance for all of us gathered here. It is a moment to reflect on our journey, celebrate our achievements, and look forward with hope and determination.\n\n`;
    speech += `Each one of us plays a vital role in shaping the narrative of success. Our collective dedication, hard work, and unwavering commitment have brought us to this point, and they will carry us even further.\n\n`;
  }

  // Audience engagement
  const question = points.length > 0
    ? `what ${points[0]} means to you personally`
    : "what this moment means to you";
  speech += pick(audienceEngagement).replace("{question}", question) + "\n\n";

  // Extra content for longer speeches
  if (data.duration >= 5) {
    speech += `Looking at the broader picture, we can see how this occasion reflects the values we hold dear — integrity, perseverance, and a commitment to excellence. These are not just words; they are the principles that guide our every action.\n\n`;
    speech += `I have had the privilege of witnessing remarkable growth and transformation. The progress we have made is a testament to the spirit of collaboration and the pursuit of a common goal.\n\n`;
  }
  if (data.duration >= 10) {
    speech += `Allow me to share a thought that I believe resonates with all of us. Success is not measured solely by outcomes, but by the journey we undertake and the relationships we build along the way.\n\n`;
    speech += `As we stand at this crossroads, we have the opportunity to define what comes next. Let us approach the future with confidence, armed with the lessons of the past and the energy of the present.\n\n`;
    speech += `I urge each and every one of you to take this moment to heart. Let it inspire you, motivate you, and remind you of the incredible potential that lies within each of you.\n\n`;
  }

  // Closing
  const closing = pick(closingTemplates[occasion]).replace("${year}", String(new Date().getFullYear()));
  speech += closing + "\n\nThank you.";

  return speech;
}

export default function AiSpeechWriter() {
  const [occasion, setOccasion] = useState<Occasion>("Welcome Speech");
  const [speaker, setSpeaker] = useState("");
  const [audience, setAudience] = useState("");
  const [keyPoints, setKeyPoints] = useState("");
  const [duration, setDuration] = useState<Duration>(5);
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);

  const occasions: Occasion[] = ["Welcome Speech", "Farewell", "Vote of Thanks", "Motivational", "Independence Day", "Republic Day", "Teachers Day", "Annual Day", "Award Ceremony", "Graduation"];

  const generate = () => {
    if (!speaker.trim()) return;
    setResult(generateSpeech(occasion, { speaker: speaker.trim(), audience: audience.trim(), keyPoints, duration }));
  };

  const wordCount = result.split(/\s+/).filter(Boolean).length;

  const copy = () => {
    navigator.clipboard?.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    const w = window.open("", "_blank");
    if (w) {
      w.document.write(`<html><head><title>${occasion}</title><style>body{font-family:Georgia,serif;max-width:700px;margin:40px auto;line-height:1.8;color:#222;padding:20px}h1{text-align:center;font-size:1.3em;margin-bottom:20px}</style></head><body><h1>${occasion}</h1>${result.split("\n").map(p => p.trim() ? `<p>${p}</p>` : "").join("")}</body></html>`);
      w.document.close();
      w.print();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Occasion</label>
        <select className="calc-input" value={occasion} onChange={(e) => setOccasion(e.target.value as Occasion)}>
          {occasions.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Speaker Name</label>
          <input className="calc-input" value={speaker} onChange={(e) => setSpeaker(e.target.value)} placeholder="e.g. Priya Sharma" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Audience</label>
          <input className="calc-input" value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="e.g. students and faculty" />
        </div>
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Key Points (comma separated)</label>
        <input className="calc-input" value={keyPoints} onChange={(e) => setKeyPoints(e.target.value)} placeholder="e.g. teamwork, innovation, hard work, gratitude" />
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Duration</label>
        <select className="calc-input" value={duration} onChange={(e) => setDuration(Number(e.target.value) as Duration)}>
          <option value={2}>2 minutes</option>
          <option value={5}>5 minutes</option>
          <option value={10}>10 minutes</option>
        </select>
      </div>
      <button onClick={generate} className="btn-primary">Generate Speech</button>
      {result && (
        <div className="result-card space-y-4">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <span className="text-sm font-bold text-gray-600">{occasion} ({wordCount} words, ~{Math.ceil(wordCount / 130)} min read)</span>
            <div className="flex gap-2">
              <button onClick={copy} className="btn-secondary text-xs">{copied ? "Copied!" : "Copy"}</button>
              <button onClick={handlePrint} className="btn-secondary text-xs">Print</button>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            {result.split("\n").map((line, i) => (
              <p key={i} className={`text-gray-800 leading-relaxed ${line.trim() === "" ? "h-4" : "mb-1"}`}>{line}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
