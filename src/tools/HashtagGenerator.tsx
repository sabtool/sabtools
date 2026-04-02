"use client";
import { useState, useMemo } from "react";

const hashtagDB: Record<string, string[]> = {
  travel: ["travel", "wanderlust", "travelgram", "instatravel", "travelphotography", "traveltheworld", "travelblogger", "explore", "adventure", "vacation", "holiday", "backpacking", "roadtrip", "globetrotter", "travelholic", "tourtheplanet", "beautifuldestinations", "traveladdict", "traveling", "passport", "journey", "roamtheplanet", "bucketlist", "getaway", "traveldiary", "exploremore", "travellife", "worldtravel", "travelgoals", "doyoutravel"],
  food: ["food", "foodie", "foodporn", "foodphotography", "instafood", "yummy", "delicious", "foodstagram", "cooking", "recipe", "homemade", "foodlover", "chef", "tasty", "healthyfood", "foodblogger", "dinner", "lunch", "breakfast", "dessert", "baking", "eatclean", "vegan", "vegetarian", "indianfood", "streetfood", "foodgasm", "nom", "yum", "foodies"],
  fitness: ["fitness", "gym", "workout", "fitnessmotivation", "fit", "bodybuilding", "training", "health", "fitfam", "motivation", "exercise", "muscle", "healthylifestyle", "gymlife", "crossfit", "yoga", "personaltrainer", "cardio", "strong", "gains", "fitnessjourney", "weightloss", "transformation", "protein", "running", "abs", "legday", "strength", "wellness", "fitspo"],
  fashion: ["fashion", "style", "ootd", "fashionblogger", "instafashion", "fashionista", "streetstyle", "outfit", "fashionstyle", "trendy", "stylish", "clothing", "model", "beauty", "dress", "shopping", "designer", "accessories", "lookbook", "fashionable", "outfitoftheday", "indianfashion", "ethnic", "saree", "kurta", "mensfashion", "womensfashion", "jewelery", "handmade", "vintage"],
  tech: ["technology", "tech", "coding", "programming", "developer", "software", "innovation", "ai", "startup", "digitalmarketing", "webdevelopment", "machinelearning", "python", "javascript", "datascience", "cybersecurity", "cloud", "iot", "blockchain", "saas", "devops", "techie", "coder", "fullstack", "react", "frontend", "backend", "techstartup", "artificial", "automation"],
  photography: ["photography", "photo", "photooftheday", "photographer", "nature", "instagood", "picoftheday", "art", "portrait", "camera", "canon", "landscape", "photoshoot", "instagram", "naturephotography", "streetphotography", "wildlife", "sunset", "travelphotography", "creative", "editing", "lightroom", "dslr", "mobilephotography", "shotoniphone", "goldenhour", "composition", "raw", "visualart", "aesthetic"],
  business: ["business", "entrepreneur", "marketing", "success", "startup", "motivation", "money", "entrepreneurship", "smallbusiness", "branding", "digitalmarketing", "investment", "finance", "leadership", "hustle", "growth", "mindset", "ceo", "innovation", "wealth", "businessowner", "socialmedia", "onlinebusiness", "ecommerce", "sales", "strategy", "networking", "consulting", "freelancer", "sidehustle"],
  music: ["music", "musician", "singer", "song", "hiphop", "rap", "dj", "producer", "beats", "guitar", "piano", "singing", "artist", "newmusic", "spotify", "soundcloud", "livemusic", "concert", "indie", "band", "vocals", "musicproducer", "studio", "bollywood", "classical", "rock", "pop", "edm", "playlist", "musiclover"],
};

function generateHashtags(topic: string): { high: string[]; medium: string[]; niche: string[] } {
  const lower = topic.toLowerCase().trim();
  const words = lower.split(/\s+/);
  let all: string[] = [];

  for (const w of words) {
    for (const [key, tags] of Object.entries(hashtagDB)) {
      if (key.includes(w) || w.includes(key)) {
        all = [...all, ...tags];
      }
    }
  }

  if (all.length === 0) {
    const base = lower.replace(/\s+/g, "");
    all = [
      base, `${base}life`, `${base}lover`, `${base}gram`, `${base}daily`,
      `${base}oftheday`, `${base}community`, `${base}vibes`, `${base}goals`, `${base}world`,
      `love${base}`, `insta${base}`, `${base}photography`, `${base}blog`, `${base}style`,
      `${base}tips`, `${base}inspiration`, `${base}india`, `${base}lovers`, `${base}addict`,
      `best${base}`, `${base}2024`, `${base}official`, `${base}page`, `${base}hub`,
      `${base}content`, `${base}creator`, `${base}family`, `${base}forever`, `${base}matters`,
    ];
  }

  const unique = [...new Set(all)].slice(0, 30);
  return {
    high: unique.slice(0, 10),
    medium: unique.slice(10, 20),
    niche: unique.slice(20, 30),
  };
}

export default function HashtagGenerator() {
  const [topic, setTopic] = useState("");
  const [copied, setCopied] = useState(false);

  const hashtags = useMemo(() => {
    if (!topic.trim()) return null;
    return generateHashtags(topic);
  }, [topic]);

  const allTags = hashtags ? [...hashtags.high, ...hashtags.medium, ...hashtags.niche].map((t) => `#${t}`).join(" ") : "";

  const copyAll = () => {
    navigator.clipboard.writeText(allTags);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Topic / Keyword</label>
        <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. travel, food, fitness, tech" className="calc-input" />
      </div>

      {hashtags && (
        <div className="result-card space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-800">Generated Hashtags (30)</h3>
            <button onClick={copyAll} className="btn-primary text-sm">{copied ? "Copied!" : "Copy All"}</button>
          </div>

          {([["High Popularity", hashtags.high, "bg-red-50 text-red-700"], ["Medium Popularity", hashtags.medium, "bg-yellow-50 text-yellow-700"], ["Niche / Low Competition", hashtags.niche, "bg-green-50 text-green-700"]] as const).map(([label, tags, cls]) => (
            <div key={label}>
              <h4 className="text-sm font-semibold text-gray-600 mb-2">{label}</h4>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span key={tag} className={`px-3 py-1 rounded-full text-sm font-medium ${cls}`}>#{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
