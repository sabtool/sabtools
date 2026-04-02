"use client";
import { useState, useMemo } from "react";

type Platform = "Instagram" | "Twitter" | "LinkedIn" | "TikTok";

const platformConfig: Record<Platform, { maxTags: number; prefix: string }> = {
  Instagram: { maxTags: 30, prefix: "#" },
  Twitter: { maxTags: 30, prefix: "#" },
  LinkedIn: { maxTags: 30, prefix: "#" },
  TikTok: { maxTags: 30, prefix: "#" },
};

const synonymMap: Record<string, string[]> = {
  business: ["entrepreneur", "startup", "company", "enterprise", "venture", "commerce", "trade"],
  marketing: ["digitalmarketing", "contentmarketing", "branding", "advertising", "promotion", "growth"],
  technology: ["tech", "innovation", "digital", "software", "coding", "programming", "ai"],
  fitness: ["workout", "gym", "exercise", "health", "training", "wellness", "fit"],
  food: ["foodie", "cooking", "recipe", "delicious", "yummy", "homemade", "chef"],
  travel: ["wanderlust", "explore", "adventure", "vacation", "trip", "tourism", "backpacking"],
  fashion: ["style", "outfit", "trendy", "clothing", "wardrobe", "lookbook", "ootd"],
  education: ["learning", "knowledge", "study", "school", "teaching", "edtech", "students"],
  photography: ["photo", "camera", "photographer", "photooftheday", "snapshot", "lens", "capture"],
  motivation: ["inspire", "mindset", "goals", "success", "hustle", "grind", "determination"],
  beauty: ["skincare", "makeup", "cosmetics", "glam", "beautytips", "selfcare", "glow"],
  music: ["musician", "song", "singer", "beats", "melody", "hiphop", "rock"],
  art: ["artist", "creative", "artwork", "design", "illustration", "painting", "drawing"],
  sports: ["athlete", "game", "competition", "team", "championship", "sportslife", "winning"],
  love: ["relationship", "romance", "couple", "heart", "soulmate", "lovestory", "forever"],
  nature: ["outdoor", "landscape", "wildlife", "earth", "green", "environment", "scenic"],
  finance: ["money", "investing", "wealth", "stocks", "crypto", "personalfinance", "savings"],
  lifestyle: ["dailylife", "livingwell", "vibes", "mood", "aesthetic", "happiness", "blessed"],
  realestate: ["property", "home", "housing", "realtor", "investment", "luxury", "dreamhome"],
  india: ["indian", "desi", "bharath", "incredibleindia", "makeinindia", "indianculture"],
};

const popularSuffixes: Record<Platform, string[]> = {
  Instagram: ["ofinstagram", "gram", "daily", "life", "love", "vibes", "community", "world", "inspo", "goals"],
  Twitter: ["twitter", "trending", "viral", "thread", "discussion", "hot", "news", "today", "now", "chat"],
  LinkedIn: ["linkedin", "professional", "career", "networking", "leadership", "growth", "tips", "insights", "jobs", "hiring"],
  TikTok: ["tiktok", "viral", "fyp", "foryou", "trend", "challenge", "duet", "sound", "creator", "content"],
};

const universalPopular: Record<Platform, string[]> = {
  Instagram: ["instagood", "photooftheday", "love", "beautiful", "happy", "followme", "picoftheday", "instadaily", "reels", "explore"],
  Twitter: ["trending", "viral", "breaking", "news", "opinion", "thread", "mustread", "follow", "retweet", "hot"],
  LinkedIn: ["leadership", "innovation", "networking", "career", "growthmindset", "hiring", "jobsearch", "motivation", "success", "professionaldevelopment"],
  TikTok: ["fyp", "foryoupage", "viral", "trending", "tiktokviral", "fypシ", "xyzbca", "blowthisup", "goviral", "tiktoktrend"],
};

function generateHashtags(topic: string, platform: Platform): { popular: string[]; medium: string[]; niche: string[] } {
  const words = topic.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/).filter(Boolean);
  const baseTag = words.join("");
  const allTags = new Set<string>();

  // Popular tier - broad reach
  const popular: string[] = [];
  universalPopular[platform].forEach(t => { if (popular.length < 10) popular.push(t); allTags.add(t); });

  // Medium tier - topic-related
  const medium: string[] = [];
  words.forEach(word => {
    if (synonymMap[word]) {
      synonymMap[word].forEach(syn => {
        if (medium.length < 10 && !allTags.has(syn)) { medium.push(syn); allTags.add(syn); }
      });
    }
  });
  // Fill medium with combinations
  const suffixes = popularSuffixes[platform];
  words.forEach(word => {
    suffixes.forEach(suf => {
      const tag = `${word}${suf}`;
      if (medium.length < 10 && !allTags.has(tag)) { medium.push(tag); allTags.add(tag); }
    });
  });
  // Pad medium if needed
  while (medium.length < 10) {
    const tag = `${words[0] || "content"}${suffixes[medium.length % suffixes.length]}`;
    if (!allTags.has(tag)) { medium.push(tag); allTags.add(tag); } else { medium.push(`${baseTag}${medium.length}`); }
  }

  // Niche tier - very specific
  const niche: string[] = [];
  if (baseTag && !allTags.has(baseTag)) { niche.push(baseTag); allTags.add(baseTag); }
  words.forEach((w, i) => {
    const next = words[i + 1];
    if (next) {
      const combo = `${w}${next}`;
      if (!allTags.has(combo)) { niche.push(combo); allTags.add(combo); }
    }
  });
  // Add specific niche tags
  const nicheSuffixes = ["tips", "hacks", "guide", "101", "expert", "pro", "secrets", "strategy", "mastery", "insights"];
  nicheSuffixes.forEach(suf => {
    const tag = `${words[0] || "content"}${suf}`;
    if (niche.length < 10 && !allTags.has(tag)) { niche.push(tag); allTags.add(tag); }
  });
  while (niche.length < 10) {
    niche.push(`${baseTag}niche${niche.length}`);
  }

  return { popular: popular.slice(0, 10), medium: medium.slice(0, 10), niche: niche.slice(0, 10) };
}

export default function AiHashtagGeneratorPro() {
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState<Platform>("Instagram");
  const [result, setResult] = useState<{ popular: string[]; medium: string[]; niche: string[] } | null>(null);
  const [copiedTier, setCopiedTier] = useState("");

  const platforms: Platform[] = ["Instagram", "Twitter", "LinkedIn", "TikTok"];

  const generate = () => {
    if (!topic.trim()) return;
    setResult(generateHashtags(topic.trim(), platform));
  };

  const copyTier = (tags: string[], tier: string) => {
    navigator.clipboard?.writeText(tags.map(t => `#${t}`).join(" "));
    setCopiedTier(tier);
    setTimeout(() => setCopiedTier(""), 2000);
  };

  const copyAll = () => {
    if (!result) return;
    const all = [...result.popular, ...result.medium, ...result.niche].map(t => `#${t}`).join(" ");
    navigator.clipboard?.writeText(all);
    setCopiedTier("all");
    setTimeout(() => setCopiedTier(""), 2000);
  };

  const totalTags = useMemo(() => {
    if (!result) return 0;
    return result.popular.length + result.medium.length + result.niche.length;
  }, [result]);

  const tiers = [
    { key: "popular", label: "Popular (High Reach)", color: "text-red-600", bg: "bg-red-50", tags: result?.popular },
    { key: "medium", label: "Medium (Balanced)", color: "text-yellow-600", bg: "bg-yellow-50", tags: result?.medium },
    { key: "niche", label: "Niche (Targeted)", color: "text-green-600", bg: "bg-green-50", tags: result?.niche },
  ];

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Topic / Description</label>
        <input className="calc-input" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. fitness motivation, digital marketing, food photography" />
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Platform</label>
        <select className="calc-input" value={platform} onChange={(e) => setPlatform(e.target.value as Platform)}>
          {platforms.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>
      <button onClick={generate} className="btn-primary">Generate Hashtags</button>
      {result && (
        <div className="space-y-4">
          <div className="result-card">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-bold text-gray-600">{totalTags} hashtags for {platform}</span>
              <button onClick={copyAll} className="btn-primary text-xs">{copiedTier === "all" ? "Copied All!" : "Copy All 30"}</button>
            </div>
            {tiers.map(({ key, label, color, bg, tags }) => (
              <div key={key} className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-sm font-bold ${color}`}>{label}</span>
                  <button onClick={() => copyTier(tags || [], key)} className="btn-secondary text-xs">
                    {copiedTier === key ? "Copied!" : "Copy Tier"}
                  </button>
                </div>
                <div className={`${bg} rounded-xl p-3 flex flex-wrap gap-2`}>
                  {tags?.map((tag, i) => (
                    <span key={i} className="inline-block bg-white px-3 py-1 rounded-full text-sm text-gray-700 border border-gray-200">#{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
