"use client";
import { useState } from "react";

type Mood = "Happy" | "Inspirational" | "Funny" | "Informative";
type Platform = "Instagram" | "Facebook" | "Twitter" | "LinkedIn";

const hashtagSets: Record<string, string[]> = {
  default: ["trending", "viral", "explore", "instagood", "photooftheday"],
  happy: ["happiness", "goodvibes", "blessed", "grateful", "positiveenergy", "smile"],
  inspirational: ["motivation", "inspiration", "mindset", "success", "grind", "hustle"],
  funny: ["lol", "funny", "humor", "relatable", "memes", "comedy"],
  informative: ["didyouknow", "facts", "knowledge", "learnmore", "tips", "education"],
};

const emojiSets: Record<Mood, string[]> = {
  Happy: ["😊", "🎉", "✨", "💫", "🌟", "❤️", "🥳", "💕"],
  Inspirational: ["💪", "🔥", "🚀", "⭐", "🌈", "🎯", "💡", "🏆"],
  Funny: ["😂", "🤣", "😜", "🫠", "💀", "😅", "🤪", "👀"],
  Informative: ["📌", "💡", "📊", "🔍", "📝", "🧠", "📢", "ℹ️"],
};

const captionTemplates: Record<Mood, Record<Platform, ((topic: string) => string)[]>> = {
  Happy: {
    Instagram: [
      (t) => `Living my best life with ${t}! ✨ Every moment counts, and this one is pure magic. Double tap if you agree! 💕`,
      (t) => `${t} vibes only! 🌟 Grateful for these beautiful moments. Who's feeling the same energy today? ❤️`,
      (t) => `Can't stop smiling about ${t}! 😊 Life has a way of surprising you with the best things.`,
      (t) => `Today's highlight: ${t}! 🎉 Capturing the joy because moments like these deserve to be remembered.`,
      (t) => `${t} making every day brighter! 💫 Tag someone who needs this energy in their feed right now!`,
    ],
    Facebook: [
      (t) => `Just had an amazing experience with ${t}! Had to share this with you all. Life is beautiful when you focus on the good things! 😊❤️`,
      (t) => `Feeling so grateful for ${t} today! It's the little things that make life extraordinary. Who else is having a great day?`,
      (t) => `${t} has truly made my day! Sharing some happiness because the world needs more of it. Drop a ❤️ if you agree!`,
      (t) => `What a wonderful day filled with ${t}! Reminder to appreciate the small moments — they make the biggest difference.`,
      (t) => `Happiness is ${t}! Sharing this feel-good moment because we all deserve some positivity in our feeds today 🌟`,
    ],
    Twitter: [
      (t) => `${t} just made my entire day! ✨ The good vibes are REAL today 😊`,
      (t) => `Happiness = ${t}. That's it. That's the tweet. 💫`,
      (t) => `currently on cloud 9 because of ${t} and I'm not coming down anytime soon 🎉`,
      (t) => `${t} appreciation post 💕 sometimes the best moments are unexpected`,
      (t) => `10/10 would recommend: ${t}. Pure joy. No notes. ❤️`,
    ],
    LinkedIn: [
      (t) => `Thrilled to share an exciting update about ${t}! It's moments like these that remind us why we do what we do. Grateful for the journey and the amazing people along the way. #Grateful #${t.replace(/\s+/g, "")}`,
      (t) => `Today I'm celebrating ${t}! Success is sweeter when shared with a community that supports and inspires. Thank you to everyone who made this possible.`,
      (t) => `Exciting developments in ${t}! This milestone wouldn't have been possible without the incredible team and mentors I'm fortunate to work with. Here's to the next chapter!`,
      (t) => `A moment of gratitude for ${t}. In the midst of our busy professional lives, it's important to pause and celebrate the wins — big and small. What are you celebrating today?`,
      (t) => `Proud to announce progress on ${t}! Every step forward is a testament to hard work, collaboration, and believing in the vision. Onwards and upwards!`,
    ],
  },
  Inspirational: {
    Instagram: [
      (t) => `${t} taught me that the only limit is the one you set for yourself. 💪 Rise, grind, repeat. Your future self will thank you.`,
      (t) => `Chasing ${t} with everything I've got. 🔥 Remember: every expert was once a beginner. Keep pushing!`,
      (t) => `The journey of ${t} isn't easy, but it's worth it. 🚀 Embrace the struggle — that's where growth happens.`,
      (t) => `${t} is my reminder that great things take time. 🎯 Trust the process and stay committed to your vision.`,
      (t) => `Believe in ${t}. Believe in yourself. ⭐ You're closer to your breakthrough than you think.`,
    ],
    Facebook: [
      (t) => `A thought on ${t}: Success isn't about being the best — it's about being better than you were yesterday. Keep going, keep growing. 💪`,
      (t) => `${t} has been a powerful reminder that consistency beats talent when talent doesn't work hard. Share this with someone who needs to hear it today! 🔥`,
      (t) => `Reflecting on ${t} today. The road may be long, but every step matters. Don't compare your chapter 1 to someone else's chapter 20. Your time is coming!`,
      (t) => `${t} proves that when you combine passion with persistence, amazing things happen. What's driving you forward today?`,
      (t) => `Inspired by ${t} to keep pushing boundaries. Remember: diamonds are formed under pressure. Your challenges are shaping your future! 🌈`,
    ],
    Twitter: [
      (t) => `${t} reminder: you didn't come this far to only come this far. keep going 💪🔥`,
      (t) => `the secret to ${t}? show up every single day, even when it's hard. especially when it's hard.`,
      (t) => `${t} taught me: progress > perfection. always. 🚀`,
      (t) => `your ${t} journey is unique. stop comparing, start creating. 🎯`,
      (t) => `hot take: ${t} is 80% mindset, 20% strategy. master your mind first 🧠`,
    ],
    LinkedIn: [
      (t) => `Reflecting on ${t} and the lessons it teaches about professional growth.\n\nThe path to excellence is never linear. There will be setbacks, pivots, and moments of doubt. But every challenge is an opportunity in disguise.\n\nKey takeaway: Stay committed to continuous learning and never underestimate the power of resilience.\n\n#ProfessionalGrowth #${t.replace(/\s+/g, "")} #Leadership`,
      (t) => `${t} has reinforced a belief I hold dear: the best investment you can make is in yourself.\n\nSkills, knowledge, relationships — these are the currencies that compound over time. In a rapidly changing world, adaptability is your greatest asset.\n\nWhat skill are you investing in this quarter?`,
      (t) => `A lesson from ${t}: Leadership isn't about having all the answers — it's about asking the right questions and empowering others to find solutions.\n\nThe most impactful leaders I've encountered share one trait: genuine curiosity. They listen more than they speak and learn from every interaction.`,
      (t) => `${t} reminded me why I started this journey in the first place.\n\nTo everyone building something meaningful: the grind is real, but so is the reward. Stay focused, stay hungry, and most importantly — stay authentic.\n\nYour work matters. Keep going.`,
      (t) => `The power of ${t} lies in its ability to connect, inspire, and transform.\n\nIn business and in life, success often comes down to one thing: showing up with intention every single day. Not perfection — intention.\n\nWhat's your intention for this week?`,
    ],
  },
  Funny: {
    Instagram: [
      (t) => `Me: I should be productive today.\nAlso me: *scrolls through ${t} for 3 hours* 😂\nTag someone who relates!`,
      (t) => `${t} is my personality at this point and I'm not even sorry 🤣💀`,
      (t) => `POV: You just discovered ${t} and your whole life is a lie 😜 Who else?`,
      (t) => `My therapist: What brings you joy?\nMe: ${t}.\nTherapist: That's... actually valid. 😅`,
      (t) => `${t} energy is all I'm bringing to the table this week and honestly? It's enough. 🫠✌️`,
    ],
    Facebook: [
      (t) => `If ${t} was a person, we'd be best friends by now 😂 Tell me I'm not the only one who feels this way!`,
      (t) => `Just tried explaining ${t} to my parents and I think they now have more questions than before 🤣 The generation gap is REAL`,
      (t) => `Hot take: ${t} > sleeping in on weekends. I said what I said. Come at me. 😜`,
      (t) => `Day 247 of pretending I have my life together while actually just obsessing over ${t}. It's going great, thanks for asking! 😅`,
      (t) => `I asked the universe for a sign and it sent me ${t}. Universe has jokes apparently 🤣`,
    ],
    Twitter: [
      (t) => `me: i'll just quickly check ${t}\n*4 hours later*\nme: what year is it 😂`,
      (t) => `${t} is the main character and we're all just NPCs honestly 💀`,
      (t) => `normalize making ${t} your entire personality for at least a week 🤪`,
      (t) => `the way ${t} lives rent free in my head 24/7 is honestly impressive 🧠`,
      (t) => `${t}: 10/10, no notes, would recommend to my enemies too 😂`,
    ],
    LinkedIn: [
      (t) => `Unpopular opinion: ${t} is the most underrated productivity hack.\n\nYes, you read that right. Sometimes the best professional development comes from unexpected places.\n\n(But please don't tell my manager I said this. My quarterly review is next week.) 😄\n\n#WorkLifeBalance #HonestProfessionals`,
      (t) => `Day in the life of a professional who just discovered ${t}:\n\n8 AM: Regular morning routine\n9 AM: Open laptop, check ${t}\n5 PM: Where did the day go?\n\nJust kidding. Mostly. 😅\n\nBut seriously — finding joy in your work (and breaks) is essential for sustainable success.`,
      (t) => `Plot twist: The key to my professional success has been ${t}.\n\nOkay, that might be a slight exaggeration. But in a world that takes itself too seriously, a little humor goes a long way.\n\nRemember: the most effective teams are the ones that can laugh together. 😊`,
      (t) => `Fun Friday thought: If ${t} had a LinkedIn profile, it would have 10M+ followers and still respond to every DM.\n\nBe like ${t}. Be consistent. Be engaging. Be relatable.\n\n(This is career advice, I promise.) 😄`,
      (t) => `I wrote a 6-paragraph analysis of ${t} trends before realizing nobody asked.\n\nBut you know what? I'm posting it anyway. That's what LinkedIn is for, right?\n\n*adjusts professional headshot* 🤓`,
    ],
  },
  Informative: {
    Instagram: [
      (t) => `Did you know? ${t} is more important than most people realize. 📌 Swipe for 5 key facts that will change how you think about it! Save this for later.`,
      (t) => `${t} 101: Here's what you need to know 📊\n\nMost people overlook the basics, but understanding the fundamentals can make all the difference. Drop a 💡 if this was helpful!`,
      (t) => `Breaking down ${t} in simple terms 🧠\n\nKnowledge is power, and sharing it is our mission. Bookmark this and share with someone who needs to see this!`,
      (t) => `Your quick guide to ${t} 📝\n\nWe simplified the complex stuff so you don't have to. Follow for more content like this!`,
      (t) => `${t}: 5 things nobody tells you 🔍\n\nWe did the research so you don't have to. Save this post and thank us later! 📌`,
    ],
    Facebook: [
      (t) => `Everything you need to know about ${t} in one post! 📊\n\nWe've compiled the most important facts and insights to help you make informed decisions. Share this with anyone who might find it useful!`,
      (t) => `${t} explained simply: Here's a comprehensive breakdown of what it means and why it matters. Knowledge is best when shared — hit that share button! 💡`,
      (t) => `Interesting facts about ${t} that might surprise you:\n\nWe dove deep into the research to bring you accurate, up-to-date information. What aspect of ${t} interests you most? Let us know in the comments!`,
      (t) => `Your essential guide to ${t} is here! We've gathered expert insights and reliable data to help you understand this topic better. Save this post for reference! 📌`,
      (t) => `Understanding ${t}: A thread of useful information for everyone. Whether you're a beginner or already familiar with the topic, there's something here for you. Read on! 🔍`,
    ],
    Twitter: [
      (t) => `quick thread on ${t} that everyone should know 🧵📌 RT to spread knowledge`,
      (t) => `${t} fact: most people get this wrong. here's what the data actually shows 📊`,
      (t) => `TIL about ${t} and it genuinely changed my perspective. here's the key takeaway 💡`,
      (t) => `${t} simplified: here's what matters most and what you can safely ignore 🔍`,
      (t) => `your 60-second explainer on ${t}: the what, why, and how 📝`,
    ],
    LinkedIn: [
      (t) => `A comprehensive look at ${t} and its impact on the professional landscape.\n\nAs we navigate an increasingly complex business environment, understanding ${t} has become essential for professionals across industries.\n\nHere are the key insights every professional should consider:\n\n1. The fundamentals are often overlooked\n2. Data-driven approaches yield the best results\n3. Continuous learning is non-negotiable\n\nWhat has your experience with ${t} taught you? I'd love to hear your perspectives in the comments.\n\n#Industry #ProfessionalDevelopment #${t.replace(/\s+/g, "")}`,
      (t) => `${t}: Separating fact from fiction.\n\nThere's a lot of noise around this topic, so I wanted to share some evidence-based insights that have proven valuable in my professional experience.\n\nThe most important takeaway? Context matters more than headlines. Always dig deeper.\n\nWhat reliable resources on ${t} would you recommend to the community?`,
      (t) => `I spent the last week researching ${t} and here's what I found:\n\nThe landscape is evolving rapidly, and professionals who stay informed will have a significant competitive advantage. The data suggests that early adopters of ${t} strategies see measurable improvements in outcomes.\n\nWould anyone be interested in a detailed breakdown? Happy to share my research.`,
      (t) => `Understanding ${t} is no longer optional for professionals in our industry.\n\nHere's a framework I've developed for staying current:\n\n1. Dedicate 30 minutes weekly to ${t} research\n2. Follow thought leaders and practitioners\n3. Apply insights incrementally to your workflow\n4. Share learnings with your team\n\nSmall, consistent investments in knowledge pay exponential dividends.`,
      (t) => `The state of ${t} in 2025: Key trends and what they mean for professionals.\n\nAfter analyzing multiple sources and consulting with industry experts, here are the patterns that stand out:\n\n- Adoption is accelerating across sectors\n- Quality of implementation matters more than speed\n- Cross-functional understanding is becoming a differentiator\n\nI'd welcome a discussion on this. What trends are you seeing in your space?`,
    ],
  },
};

export default function AiSocialCaptionGenerator() {
  const [topic, setTopic] = useState("");
  const [mood, setMood] = useState<Mood>("Happy");
  const [platform, setPlatform] = useState<Platform>("Instagram");
  const [captions, setCaptions] = useState<string[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const generate = () => {
    if (!topic.trim()) return;
    const templates = captionTemplates[mood][platform];
    setCaptions(templates.map((fn) => fn(topic.trim())));
  };

  const copy = (idx: number) => {
    navigator.clipboard?.writeText(captions[idx]);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const getHashtags = () => {
    const moodTags = hashtagSets[mood.toLowerCase()] || hashtagSets.default;
    const topicTag = topic.trim().replace(/\s+/g, "").toLowerCase();
    return [`#${topicTag}`, ...moodTags.slice(0, 5).map((t) => `#${t}`)];
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Topic / Occasion</label>
        <input className="calc-input" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. Morning Coffee, New Launch, Team Outing" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Mood</label>
          <div className="flex gap-2 flex-wrap">
            {(["Happy", "Inspirational", "Funny", "Informative"] as Mood[]).map((m) => (
              <button key={m} onClick={() => setMood(m)} className={m === mood ? "btn-primary" : "btn-secondary"}>{m}</button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Platform</label>
          <div className="flex gap-2 flex-wrap">
            {(["Instagram", "Facebook", "Twitter", "LinkedIn"] as Platform[]).map((p) => (
              <button key={p} onClick={() => setPlatform(p)} className={p === platform ? "btn-primary" : "btn-secondary"}>{p}</button>
            ))}
          </div>
        </div>
      </div>
      <button onClick={generate} className="btn-primary">Generate Captions</button>
      {captions.length > 0 && (
        <div className="space-y-4">
          {platform === "Instagram" && (
            <div className="result-card">
              <p className="text-sm font-bold text-gray-600 mb-2">Suggested Hashtags</p>
              <p className="text-indigo-600 text-sm">{getHashtags().join(" ")}</p>
              <p className="text-xs text-gray-400 mt-1">Suggested Emojis: {emojiSets[mood].join(" ")}</p>
            </div>
          )}
          {captions.map((c, i) => (
            <div key={i} className="result-card">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-gray-600">Caption {i + 1}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">{c.length} chars</span>
                  <button onClick={() => copy(i)} className="text-xs text-indigo-600 font-medium hover:underline">{copiedIdx === i ? "Copied!" : "Copy"}</button>
                </div>
              </div>
              <p className="text-gray-800 leading-relaxed whitespace-pre-line">{c}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
