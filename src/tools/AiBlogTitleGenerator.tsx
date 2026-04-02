"use client";
import { useState } from "react";

type ContentType = "How-to" | "List" | "Guide" | "Review" | "Comparison";

const formulasByType: Record<ContentType, ((topic: string) => string)[]> = {
  "How-to": [
    (t) => `How to ${t} (Step-by-Step Guide for Beginners)`,
    (t) => `How to ${t} Without Breaking the Bank`,
    (t) => `How to ${t} Like a Pro in 2025`,
    (t) => `How to ${t}: Everything You Need to Know`,
    (t) => `How to ${t} — The Easy Way That Actually Works`,
    (t) => `How to Master ${t} in Just 30 Days`,
    (t) => `How to ${t}: Tips That Experts Won't Tell You`,
    (t) => `How to Start ${t} from Scratch (Complete Guide)`,
    (t) => `How to ${t} and Why It Matters More Than Ever`,
    (t) => `How to ${t}: A Beginner's Roadmap to Success`,
    (t) => `How to ${t} Faster Than You Ever Thought Possible`,
    (t) => `How to ${t}: Common Mistakes and How to Avoid Them`,
    (t) => `How to ${t} Without Any Prior Experience`,
    (t) => `How to ${t}: The Ultimate Cheat Sheet`,
    (t) => `How to ${t}: What Nobody Tells You`,
  ],
  List: [
    (t) => `10 Proven Ways to ${t} That Deliver Results`,
    (t) => `15 ${t} Tips That Will Change Your Life`,
    (t) => `7 Secrets About ${t} Most People Don't Know`,
    (t) => `21 ${t} Ideas You Need to Try in 2025`,
    (t) => `5 ${t} Mistakes That Are Costing You Big`,
    (t) => `12 Must-Know ${t} Strategies for Beginners`,
    (t) => `8 Surprising Facts About ${t} That Will Shock You`,
    (t) => `Top 10 ${t} Resources You Shouldn't Miss`,
    (t) => `6 ${t} Hacks That Save Time and Money`,
    (t) => `20 ${t} Examples to Inspire Your Next Move`,
    (t) => `9 ${t} Trends You Can't Afford to Ignore`,
    (t) => `11 ${t} Tools That Professionals Swear By`,
    (t) => `13 ${t} Lessons Learned the Hard Way`,
    (t) => `7 Quick ${t} Wins You Can Implement Today`,
    (t) => `25 ${t} Stats That Will Blow Your Mind`,
  ],
  Guide: [
    (t) => `The Ultimate Guide to ${t} in 2025`,
    (t) => `${t}: The Complete Beginner's Guide`,
    (t) => `A Comprehensive Guide to ${t} for Professionals`,
    (t) => `${t} 101: Everything You Need to Get Started`,
    (t) => `The Definitive Guide to ${t}: From A to Z`,
    (t) => `Your Essential Guide to ${t} — Updated for 2025`,
    (t) => `The No-BS Guide to ${t} That Actually Works`,
    (t) => `${t}: A Practical Guide for Real Results`,
    (t) => `The Complete ${t} Handbook You've Been Looking For`,
    (t) => `${t} Made Simple: The Only Guide You'll Ever Need`,
    (t) => `The Expert's Guide to ${t}: Tips, Tools & Tactics`,
    (t) => `${t} Simplified: A Step-by-Step Guide for Everyone`,
    (t) => `The Insider's Guide to ${t}: What the Pros Know`,
    (t) => `${t} Masterclass: Your Complete Learning Guide`,
    (t) => `The Smart Person's Guide to ${t}`,
  ],
  Review: [
    (t) => `${t} Review: Is It Worth Your Money in 2025?`,
    (t) => `Honest ${t} Review — Pros, Cons & Verdict`,
    (t) => `${t}: An Unbiased Review After 6 Months of Use`,
    (t) => `${t} Review: The Truth Nobody's Telling You`,
    (t) => `Is ${t} Really That Good? Our Detailed Review`,
    (t) => `${t} Review: Everything You Need to Know Before Buying`,
    (t) => `The Real ${t} Experience: What We Found Surprising`,
    (t) => `${t}: Tested, Reviewed, and Rated by Experts`,
    (t) => `${t} Review 2025: What's New and What's Not`,
    (t) => `Why ${t} Is Getting So Much Attention (Full Review)`,
    (t) => `${t}: A Deep Dive Review with Real-World Testing`,
    (t) => `Our Honest Take on ${t}: Should You Try It?`,
    (t) => `${t} Review: Who Is It Best For?`,
    (t) => `${t} Breakdown: Features, Pricing & Performance`,
    (t) => `${t}: What 1000+ Users Are Saying (Review Roundup)`,
  ],
  Comparison: [
    (t) => `${t}: Which Option Is Best for You?`,
    (t) => `${t} Compared — The Definitive Side-by-Side Analysis`,
    (t) => `${t}: Pros and Cons of Every Major Option`,
    (t) => `${t} Showdown: Which One Wins in 2025?`,
    (t) => `${t} Face-Off: A Detailed Comparison Guide`,
    (t) => `Choosing the Right ${t}: What You Need to Consider`,
    (t) => `${t}: Head-to-Head Comparison for Smart Buyers`,
    (t) => `${t} Battle: We Tested Them All So You Don't Have To`,
    (t) => `The Great ${t} Debate: Making the Right Choice`,
    (t) => `${t}: Which Delivers the Best Value for Money?`,
    (t) => `${t} Comparison Guide: Features, Price & Performance`,
    (t) => `${t}: How the Top Options Stack Up Against Each Other`,
    (t) => `${t} — Free vs Paid: Which Should You Choose?`,
    (t) => `${t}: A No-Nonsense Comparison for Beginners`,
    (t) => `${t} Alternatives Compared: Our Top Picks`,
  ],
};

export default function AiBlogTitleGenerator() {
  const [topic, setTopic] = useState("");
  const [type, setType] = useState<ContentType>("How-to");
  const [titles, setTitles] = useState<string[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const generate = () => {
    if (!topic.trim()) return;
    setTitles(formulasByType[type].map((fn) => fn(topic.trim())));
  };

  const copy = (idx: number) => {
    navigator.clipboard?.writeText(titles[idx]);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Topic / Keyword</label>
        <input className="calc-input" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. Digital Marketing" />
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Content Type</label>
        <div className="flex gap-2 flex-wrap">
          {(["How-to", "List", "Guide", "Review", "Comparison"] as ContentType[]).map((t) => (
            <button key={t} onClick={() => setType(t)} className={t === type ? "btn-primary" : "btn-secondary"}>{t}</button>
          ))}
        </div>
      </div>
      <button onClick={generate} className="btn-primary">Generate Titles</button>
      {titles.length > 0 && (
        <div className="space-y-2">
          {titles.map((t, i) => (
            <div key={i} className="result-card flex justify-between items-center gap-3">
              <div className="flex-1">
                <p className="text-gray-800">{i + 1}. {t}</p>
                <p className="text-xs text-gray-400">{t.length} characters</p>
              </div>
              <button onClick={() => copy(i)} className="text-xs text-indigo-600 font-medium hover:underline shrink-0">{copiedIdx === i ? "Copied!" : "Copy"}</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
