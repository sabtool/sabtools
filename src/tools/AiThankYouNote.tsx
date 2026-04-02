"use client";
import { useState } from "react";

type Occasion = "Gift Received" | "Job Interview" | "Wedding Gift" | "Business Meeting" | "Teacher Appreciation" | "Customer Thank You" | "Dinner Party" | "Help/Support";
type Style = "Formal" | "Heartfelt" | "Brief";

const occasions: Occasion[] = ["Gift Received", "Job Interview", "Wedding Gift", "Business Meeting", "Teacher Appreciation", "Customer Thank You", "Dinner Party", "Help/Support"];

const templates: Record<Occasion, Record<Style, (name: string, detail: string) => string>> = {
  "Gift Received": {
    Formal: (n, d) => `Dear ${n},\n\nI am writing to express my sincere gratitude for the wonderful gift${d ? ` — ${d}` : ""}. Your thoughtfulness and generosity are truly appreciated.\n\nIt was incredibly kind of you to think of me, and I want you to know that your gift brought me great joy. I will treasure it dearly.\n\nWith heartfelt thanks,`,
    Heartfelt: (n, d) => `Dear ${n},\n\nI can't tell you how much your gift${d ? ` — ${d}` : ""} means to me! From the moment I opened it, I was overwhelmed with happiness. You have such an incredible ability to choose something that is not just beautiful, but deeply meaningful.\n\nYour generosity and the thought you put into this truly touched my heart. Thank you for being such a wonderful person in my life. I feel so lucky to have someone like you.\n\nWith all my love and gratitude,`,
    Brief: (n, d) => `Hi ${n},\n\nThank you so much for the lovely gift${d ? ` — ${d}` : ""}! I absolutely love it. Your thoughtfulness means a lot to me.\n\nWarmly,`,
  },
  "Job Interview": {
    Formal: (n, d) => `Dear ${n},\n\nThank you for taking the time to meet with me${d ? ` regarding ${d}` : " for the interview"}. I greatly appreciate the opportunity to learn more about the role and your organization.\n\nOur conversation reinforced my enthusiasm for the position, and I am confident that my skills and experience would be a strong fit for your team. I was particularly inspired by the company's vision and values.\n\nI look forward to the possibility of contributing to your team and would be happy to provide any additional information.\n\nBest regards,`,
    Heartfelt: (n, d) => `Dear ${n},\n\nI wanted to reach out and express my genuine appreciation for the wonderful conversation we had${d ? ` about ${d}` : " during the interview"}. It was truly a pleasure meeting you and learning about the incredible work being done at your organization.\n\nI left our meeting feeling inspired and excited about the possibility of joining such a dynamic team. The passion and dedication I witnessed during our conversation confirmed that this is exactly the kind of environment where I would thrive.\n\nThank you for your time, warmth, and for sharing your insights with me.\n\nWith sincere gratitude,`,
    Brief: (n, d) => `Dear ${n},\n\nThank you for the interview${d ? ` regarding ${d}` : ""}. I enjoyed our conversation and am excited about the opportunity. Looking forward to hearing from you.\n\nBest,`,
  },
  "Wedding Gift": {
    Formal: (n, d) => `Dear ${n},\n\nWe are deeply grateful for your generous wedding gift${d ? ` — ${d}` : ""}. Your kindness and blessings on our special day mean the world to us.\n\nYour presence at our wedding made the celebration even more memorable, and your thoughtful gift is something we will cherish as we begin this new chapter together.\n\nThank you for being part of our happiness.\n\nWith warm regards,`,
    Heartfelt: (n, d) => `Dear ${n},\n\nWords cannot adequately express how grateful we are for your beautiful wedding gift${d ? ` — ${d}` : ""}. You have always been so special to us, and your generosity on our big day touched our hearts deeply.\n\nEvery time we look at your gift, we will be reminded of the love and blessings you shared with us. Having you celebrate with us made our wedding day truly perfect.\n\nThank you from the bottom of our hearts.\n\nWith all our love,`,
    Brief: (n, d) => `Dear ${n},\n\nThank you for the wonderful wedding gift${d ? ` — ${d}` : ""}! We love it and appreciate your generosity and blessings on our special day.\n\nWith love,`,
  },
  "Business Meeting": {
    Formal: (n, d) => `Dear ${n},\n\nThank you for taking the time to meet with me${d ? ` to discuss ${d}` : " today"}. I found our conversation both productive and insightful.\n\nThe points we discussed have given me a clearer perspective, and I am enthusiastic about the potential for collaboration. I will follow up on the action items we identified and look forward to our continued partnership.\n\nPlease do not hesitate to reach out if you need any additional information.\n\nBest regards,`,
    Heartfelt: (n, d) => `Dear ${n},\n\nI wanted to personally thank you for the wonderful meeting${d ? ` regarding ${d}` : ""}. Your openness, expertise, and willingness to share your insights made it an incredibly valuable experience.\n\nI am genuinely excited about what we discussed and the possibilities ahead. Meetings like these remind me why I love what I do — it is the people and connections that make all the difference.\n\nLooking forward to working together and turning our ideas into reality.\n\nWarm regards,`,
    Brief: (n, d) => `Hi ${n},\n\nThanks for the great meeting${d ? ` on ${d}` : " today"}! I look forward to following up on our discussion and next steps.\n\nBest,`,
  },
  "Teacher Appreciation": {
    Formal: (n, d) => `Dear ${n},\n\nI am writing to express my sincere gratitude for your exceptional dedication as an educator${d ? `, especially regarding ${d}` : ""}. Your commitment to teaching and your students' growth has made a lasting impact.\n\nYour patience, knowledge, and encouragement have been instrumental in shaping my understanding and building my confidence. The lessons I have learned extend far beyond the classroom.\n\nThank you for being an outstanding teacher and mentor.\n\nWith deepest respect,`,
    Heartfelt: (n, d) => `Dear ${n},\n\nSome teachers teach lessons. You teach life. ${d ? `I will never forget ${d} — ` : ""}it is because of educators like you that students like me dare to dream bigger.\n\nYour passion for teaching, your patience with every question (even the silly ones), and your genuine care for each student's success — these are the things that make you extraordinary. You have not just taught me a subject; you have shown me what it means to be dedicated, kind, and inspiring.\n\nThank you for everything, from the bottom of my heart.\n\nWith love and admiration,`,
    Brief: (n, d) => `Dear ${n},\n\nThank you for being an amazing teacher${d ? ` and for ${d}` : ""}! Your guidance and support mean more than you know.\n\nGratefully,`,
  },
  "Customer Thank You": {
    Formal: (n, d) => `Dear ${n},\n\nOn behalf of our team, I would like to extend our sincere thanks for your continued trust and patronage${d ? `, particularly regarding ${d}` : ""}.\n\nYour satisfaction is our top priority, and we are committed to providing you with the highest level of service and quality. We value your feedback and look forward to serving you again.\n\nThank you for choosing us.\n\nBest regards,`,
    Heartfelt: (n, d) => `Dear ${n},\n\nWe want you to know how much your support means to us${d ? `, especially ${d}` : ""}. Every customer matters, but some leave a special mark — and you are one of them.\n\nYour trust in us motivates our entire team to do better every day. We are grateful not just for your business, but for the relationship we have built. It is customers like you who make our work truly meaningful.\n\nThank you for being part of our journey.\n\nWith heartfelt appreciation,`,
    Brief: (n, d) => `Hi ${n},\n\nThank you for your business${d ? ` and ${d}` : ""}! We truly appreciate your support and look forward to serving you again.\n\nBest,`,
  },
  "Dinner Party": {
    Formal: (n, d) => `Dear ${n},\n\nThank you for the delightful dinner party${d ? ` — ${d}` : ""}. The evening was truly memorable, with wonderful food, engaging conversation, and gracious hospitality.\n\nYour attention to detail and warmth as a host made everyone feel welcome and at ease. I thoroughly enjoyed the evening and look forward to the next occasion.\n\nWith sincere appreciation,`,
    Heartfelt: (n, d) => `Dear ${n},\n\nWhat an incredible evening${d ? ` — ${d}` : ""}! I am still thinking about how wonderful everything was. From the amazing food to the laughter-filled conversations, you created an atmosphere that was pure magic.\n\nYou have a true gift for bringing people together and making everyone feel special. Thank you for opening your home and your heart. Evenings like these are rare and precious.\n\nCannot wait for the next one!\n\nWith much love,`,
    Brief: (n, d) => `Hi ${n},\n\nThank you for the wonderful dinner${d ? ` — ${d}` : ""}! Had an amazing time. Your hosting skills are top-notch!\n\nCheers,`,
  },
  "Help/Support": {
    Formal: (n, d) => `Dear ${n},\n\nI am writing to express my sincere gratitude for your assistance${d ? ` with ${d}` : ""}. Your willingness to help and the time you dedicated made a significant difference.\n\nYour support was invaluable, and I want you to know that it did not go unnoticed. Please do not hesitate to reach out if there is ever anything I can do in return.\n\nWith deepest thanks,`,
    Heartfelt: (n, d) => `Dear ${n},\n\nI honestly do not know what I would have done without you${d ? ` when it came to ${d}` : ""}. Your kindness, generosity, and willingness to go above and beyond truly saved the day.\n\nIn a world where everyone is busy with their own lives, you took the time to help me — and that means more than I can express in words. You are one of those rare people who make the world a better place just by being in it.\n\nFrom the depths of my heart, thank you.\n\nForever grateful,`,
    Brief: (n, d) => `Hi ${n},\n\nThank you so much for your help${d ? ` with ${d}` : ""}! I really appreciate it. You are the best!\n\nThanks,`,
  },
};

export default function AiThankYouNote() {
  const [occasion, setOccasion] = useState<Occasion>("Gift Received");
  const [name, setName] = useState("");
  const [detail, setDetail] = useState("");
  const [results, setResults] = useState<{ style: Style; text: string }[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const generate = () => {
    if (!name.trim()) return;
    const styles: Style[] = ["Formal", "Heartfelt", "Brief"];
    setResults(styles.map((s) => ({ style: s, text: templates[occasion][s](name.trim(), detail.trim()) })));
  };

  const copy = (idx: number) => {
    navigator.clipboard?.writeText(results[idx].text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
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
          <label className="text-sm font-semibold text-gray-700 block mb-2">Recipient Name</label>
          <input className="calc-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Auntie Meena" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Specific Detail (optional)</label>
          <input className="calc-input" value={detail} onChange={(e) => setDetail(e.target.value)} placeholder="e.g. the beautiful saree" />
        </div>
      </div>
      <button onClick={generate} className="btn-primary">Generate Thank You Notes</button>
      {results.length > 0 && (
        <div className="space-y-4">
          {results.map((r, i) => (
            <div key={i} className="result-card">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-gray-600">{r.style}</span>
                <button onClick={() => copy(i)} className="text-xs text-indigo-600 font-medium hover:underline">{copiedIdx === i ? "Copied!" : "Copy"}</button>
              </div>
              {r.text.split("\n").map((line, j) => (
                <p key={j} className={`text-gray-800 leading-relaxed ${line === "" ? "h-3" : ""}`}>{line}</p>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
