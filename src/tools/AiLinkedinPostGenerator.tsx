"use client";
import { useState, useMemo } from "react";

type PostType = "Achievement" | "Insight" | "Story" | "Question" | "Announcement";
type Tone = "Professional" | "Casual" | "Inspirational";

const hookTemplates: Record<PostType, Record<Tone, string[]>> = {
  Achievement: {
    Professional: ["Excited to share a significant milestone:", "Proud to announce a major achievement:", "Thrilled to share this professional accomplishment:"],
    Casual: ["Big news! Just hit a major milestone:", "Can't keep this to myself:", "Something amazing just happened:"],
    Inspirational: ["Dreams do come true. Here's proof:", "This is what happens when you never give up:", "Hard work pays off. Here's my story:"],
  },
  Insight: {
    Professional: ["After years in this industry, here's what I've learned:", "A key insight that transformed my approach:", "This changed how I think about my work:"],
    Casual: ["Hot take that might surprise you:", "Here's something I wish I knew earlier:", "Let me share a game-changing realization:"],
    Inspirational: ["The most powerful lesson I've ever learned:", "This single insight changed everything for me:", "Want to level up? Read this carefully:"],
  },
  Story: {
    Professional: ["Let me share a pivotal moment in my career:", "This experience taught me an invaluable lesson:", "A story from my professional journey that shaped me:"],
    Casual: ["Story time! Grab your coffee:", "You won't believe what happened:", "Let me tell you about the day that changed everything:"],
    Inspirational: ["From failure to success - here's my story:", "The moment I almost gave up changed my life:", "Every setback is a setup for a comeback. Here's mine:"],
  },
  Question: {
    Professional: ["I'd love to hear your professional perspective on this:", "A question that's been on my mind lately:", "Let's start a meaningful discussion:"],
    Casual: ["Genuine question for my network:", "I'm curious - what do you all think?", "Help me settle this debate:"],
    Inspirational: ["Here's a question that could change your perspective:", "What would you do differently if you could start over?", "The answer to this question might surprise you:"],
  },
  Announcement: {
    Professional: ["Delighted to make an important announcement:", "Exciting news to share with my professional network:", "A new chapter begins today:"],
    Casual: ["Big announcement time!", "Here's some exciting news I've been sitting on:", "Drumroll please... I have news!"],
    Inspirational: ["Every new beginning comes from some other beginning's end:", "Taking the leap! Here's what's next:", "New doors are opening and I'm walking through:"],
  },
};

const bodyTemplates: Record<PostType, string[]> = {
  Achievement: [
    "{topic} has been a journey of dedication and persistence.\n\nHere's what made it possible:\n\n1. Consistent effort every single day\n2. Learning from every setback\n3. Surrounding myself with the right people\n4. Never losing sight of the goal",
    "Reaching this milestone with {topic} wasn't easy.\n\nThe journey involved:\n\n- Countless hours of hard work\n- Pushing through uncertainty\n- Believing in the process\n- Celebrating small wins along the way",
  ],
  Insight: [
    "When it comes to {topic}, most people get this wrong:\n\nThey focus on the wrong metrics.\n\nHere are 3 things that actually matter:\n\n1. Consistency over intensity\n2. Quality over quantity\n3. Progress over perfection\n\nThe difference between success and failure often comes down to these fundamentals.",
    "After spending significant time with {topic}, I discovered something surprising:\n\nThe conventional wisdom is often backwards.\n\nWhat actually works:\n\n- Start small, scale fast\n- Listen more, talk less\n- Focus on systems, not goals\n\nThis shift in thinking changed everything.",
  ],
  Story: [
    "It all started with {topic}.\n\nI was at a crossroads. The safe choice was clear. But something told me to take the road less traveled.\n\nWhat happened next:\n\n- I faced my biggest fears\n- I learned more in months than years\n- I discovered strengths I never knew I had\n\nThe lesson? Growth happens outside your comfort zone.",
    "Let me take you back to when {topic} first entered my life.\n\nI was skeptical. Uncertain. Even afraid.\n\nBut I took the first step anyway.\n\nAnd then the second. And the third.\n\nBefore I knew it, everything had changed.\n\nThe biggest transformation wasn't in my career - it was in my mindset.",
  ],
  Question: [
    "I've been thinking a lot about {topic} lately.\n\nAnd it made me wonder:\n\nAre we approaching this the right way?\n\nConsider these points:\n\n- The landscape is changing rapidly\n- Old strategies may not work anymore\n- Innovation requires new thinking\n\nWhat's your take on this?",
    "{topic} raises an important question:\n\nWhat would you do differently if you had to start from scratch?\n\nI asked myself this and here's what I realized:\n\n1. I'd focus on relationships first\n2. I'd invest in learning earlier\n3. I'd take more calculated risks\n\nNow I want to hear from you.",
  ],
  Announcement: [
    "Today marks a new chapter in my journey with {topic}.\n\nAfter months of preparation, I'm thrilled to share:\n\n- What we're building\n- Why it matters\n- How it will make a difference\n\nThis is just the beginning, and I couldn't be more excited about what lies ahead.",
    "The moment I've been waiting for is finally here.\n\n{topic} is officially launching!\n\nWhat this means:\n\n- New opportunities for growth\n- A fresh approach to solving real problems\n- A commitment to excellence\n\nStay tuned for more updates!",
  ],
};

const hashtagSets: Record<PostType, string[]> = {
  Achievement: ["#milestone", "#achievement", "#success", "#growth", "#proud"],
  Insight: ["#leadership", "#insight", "#learning", "#mindset", "#growth"],
  Story: ["#story", "#journey", "#inspiration", "#lessons", "#growth"],
  Question: ["#discussion", "#community", "#thoughts", "#networking", "#opinions"],
  Announcement: ["#announcement", "#newbeginnings", "#exciting", "#launch", "#growth"],
};

const ctaTemplates: Record<PostType, string[]> = {
  Achievement: ["Like this post if you believe in celebrating wins, no matter how small!", "Share your biggest achievement this year in the comments!"],
  Insight: ["Agree or disagree? I'd love to hear your perspective in the comments.", "Save this post for later and share it with someone who needs to hear this."],
  Story: ["What's a story from your career that taught you an unforgettable lesson? Share below!", "If this resonated with you, share it with someone who might need this today."],
  Question: ["Drop your answer in the comments - I read every single one!", "Tag someone who would have an interesting perspective on this!"],
  Announcement: ["Follow me for updates on this exciting journey!", "If you're as excited as I am, drop a reaction and let me know!"],
};

const emojiSuggestions: Record<PostType, string[]> = {
  Achievement: ["🎯", "🏆", "🚀", "💪", "🎉", "✨", "⭐"],
  Insight: ["💡", "🧠", "📊", "🔑", "💎", "📌", "🎯"],
  Story: ["📖", "🌟", "💫", "🔥", "❤️", "🙏", "✊"],
  Question: ["🤔", "💬", "❓", "🗣️", "👇", "💭", "🤝"],
  Announcement: ["📢", "🎉", "🚀", "✨", "🔔", "🎊", "💥"],
};

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

function fill(s: string, topic: string): string {
  return s.replace(/\{topic\}/g, topic);
}

export default function AiLinkedinPostGenerator() {
  const [topic, setTopic] = useState("");
  const [postType, setPostType] = useState<PostType>("Achievement");
  const [tone, setTone] = useState<Tone>("Professional");
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);

  const postTypes: PostType[] = ["Achievement", "Insight", "Story", "Question", "Announcement"];
  const tones: Tone[] = ["Professional", "Casual", "Inspirational"];

  const charCount = useMemo(() => result.length, [result]);

  const generate = () => {
    if (!topic.trim()) return;
    const t = topic.trim();
    const hook = pick(hookTemplates[postType][tone]);
    const body = fill(pick(bodyTemplates[postType]), t);
    const hashtags = hashtagSets[postType].join(" ");
    const cta = pick(ctaTemplates[postType]);

    const post = `${hook}\n\n${body}\n\n${cta}\n\n${hashtags}`;
    setResult(post);
  };

  const copy = () => {
    navigator.clipboard?.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Topic</label>
        <input className="calc-input" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. launching my startup, career growth, industry trends" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Post Type</label>
          <select className="calc-input" value={postType} onChange={(e) => setPostType(e.target.value as PostType)}>
            {postTypes.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Tone</label>
          <select className="calc-input" value={tone} onChange={(e) => setTone(e.target.value as Tone)}>
            {tones.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>
      <button onClick={generate} className="btn-primary">Generate LinkedIn Post</button>
      {result && (
        <div className="result-card space-y-4">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <div>
              <span className={`text-sm font-bold ${charCount > 3000 ? "text-red-600" : "text-gray-600"}`}>{charCount} / 3,000 characters</span>
            </div>
            <div className="flex gap-2">
              <button onClick={copy} className="btn-secondary text-xs">{copied ? "Copied!" : "Copy"}</button>
              <button onClick={generate} className="btn-secondary text-xs">Regenerate</button>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            {result.split("\n").map((line, i) => (
              <p key={i} className={`text-gray-800 leading-relaxed ${line.trim() === "" ? "h-3" : ""}`}>{line}</p>
            ))}
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-2">Suggested Emojis for {postType}:</p>
            <div className="flex gap-2 flex-wrap">
              {emojiSuggestions[postType].map((emoji, i) => (
                <button key={i} onClick={() => { navigator.clipboard?.writeText(emoji); }} className="text-2xl hover:scale-125 transition-transform cursor-pointer" title="Click to copy">{emoji}</button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
