"use client";
import { useState } from "react";

type Tone = "Professional" | "Casual" | "Urgent" | "Luxury";

interface AdInput {
  product: string;
  benefit: string;
  audience: string;
  tone: Tone;
}

const toneModifiers: Record<Tone, { prefix: string[]; cta: string[]; adjectives: string[] }> = {
  Professional: {
    prefix: ["Discover", "Introducing", "Experience", "Explore", "Unlock"],
    cta: ["Learn More", "Get Started", "Request a Demo", "Contact Us", "Try Now"],
    adjectives: ["reliable", "proven", "trusted", "innovative", "leading"],
  },
  Casual: {
    prefix: ["Hey!", "Check this out:", "You'll love this:", "Ready for", "Time to try"],
    cta: ["Try It Free", "Jump In", "Get Yours", "Start Now", "See For Yourself"],
    adjectives: ["awesome", "amazing", "cool", "fresh", "game-changing"],
  },
  Urgent: {
    prefix: ["Don't Miss Out!", "Limited Time:", "Act Now:", "Last Chance:", "Hurry!"],
    cta: ["Grab It Now", "Order Today", "Claim Yours", "Buy Now", "Don't Wait"],
    adjectives: ["exclusive", "limited", "time-sensitive", "one-time", "ending soon"],
  },
  Luxury: {
    prefix: ["Indulge in", "Elevate with", "Experience the art of", "Crafted for", "Redefine"],
    cta: ["Discover More", "Experience Now", "Explore Collection", "Book Consultation", "Elevate Today"],
    adjectives: ["premium", "exquisite", "refined", "bespoke", "exceptional"],
  },
};

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

function generateAds(input: AdInput): {
  google: { headline1: string; headline2: string; description: string }[];
  facebook: { headline: string; body: string }[];
  instagram: string[];
  emailSubjects: string[];
} {
  const { product, benefit, audience, tone } = input;
  const mod = toneModifiers[tone];

  // Google Ads (30+30+90 char format)
  const google = Array.from({ length: 5 }, () => {
    const h1 = `${pick(mod.prefix)} ${product}`.slice(0, 30);
    const h2 = `${pick(mod.adjectives).charAt(0).toUpperCase() + pick(mod.adjectives).slice(1)} ${benefit}`.slice(0, 30);
    const desc = `${product} offers ${benefit} for ${audience}. ${pick(mod.cta)}! Join thousands who trust ${product}. ${pick(mod.adjectives).charAt(0).toUpperCase() + pick(mod.adjectives).slice(1)} results.`.slice(0, 90);
    return { headline1: h1, headline2: h2, description: desc };
  });

  // Facebook Ads
  const facebook = Array.from({ length: 5 }, (_, i) => {
    const headlines = [
      `${pick(mod.prefix)} ${product} - ${benefit} for ${audience}`,
      `Why ${audience} Choose ${product} for ${benefit}`,
      `${product}: The ${pick(mod.adjectives)} Way to ${benefit}`,
      `Transform Your Experience with ${product}`,
      `${audience}! ${pick(mod.prefix)} ${product} Today`,
    ];
    const bodies = [
      `Looking for ${benefit}? ${product} delivers ${pick(mod.adjectives)} results that ${audience} love. Our solution is designed to meet your exact needs. ${pick(mod.cta)} and see the difference!`,
      `${product} is trusted by thousands of ${audience} worldwide. Get ${benefit} without the hassle. Start your journey today and experience what makes us ${pick(mod.adjectives)}. ${pick(mod.cta)}!`,
      `Stop settling for less. ${product} brings you ${benefit} like never before. Designed specifically for ${audience} who demand the best. ${pick(mod.cta)} — you deserve it!`,
      `Imagine having ${benefit} at your fingertips. ${product} makes it possible for every ${audience}. Our ${pick(mod.adjectives)} approach sets us apart. ${pick(mod.cta)} now!`,
      `${audience}, meet ${product} — your new secret weapon for ${benefit}. Join our growing community and discover ${pick(mod.adjectives)} results. ${pick(mod.cta)}!`,
    ];
    return { headline: headlines[i], body: bodies[i] };
  });

  // Instagram Captions
  const instagram = [
    `${pick(mod.prefix)} ${product}! ✨\n\n${benefit} has never been this ${pick(mod.adjectives)}. Whether you're a ${audience} looking for results or just starting out, we've got you covered.\n\n${pick(mod.cta)} — link in bio!\n\n#${product.replace(/\s+/g, "")} #${benefit.replace(/\s+/g, "")} #${pick(mod.adjectives)}`,
    `Your search for ${benefit} ends here. 🎯\n\n${product} is built for ${audience} who want ${pick(mod.adjectives)} results without compromise.\n\n${pick(mod.cta)} today!\n\n#${product.replace(/\s+/g, "")} #GameChanger #MustHave`,
    `Why settle for ordinary when you can have ${pick(mod.adjectives)}? 💫\n\n${product} delivers ${benefit} that ${audience} love. Try it and see for yourself.\n\n${pick(mod.cta)} — tap the link!\n\n#${product.replace(/\s+/g, "")} #BestChoice`,
    `${product} + ${audience} = ${pick(mod.adjectives)} results! 🚀\n\n${benefit} is just the beginning. Discover everything that makes ${product} the top choice.\n\n${pick(mod.cta)}!\n\n#${product.replace(/\s+/g, "")} #TopRated`,
    `Real ${benefit}. Real results. Real ${audience}. ✅\n\n${product} is here to change the game. ${pick(mod.adjectives).charAt(0).toUpperCase() + pick(mod.adjectives).slice(1)}, reliable, and ready for you.\n\n${pick(mod.cta)} now!\n\n#${product.replace(/\s+/g, "")} #TryNow`,
  ];

  // Email Subject Lines
  const emailSubjects = [
    `${pick(mod.prefix)} ${product} — ${benefit} Awaits!`,
    `${audience}, Here's How to Get ${benefit} with ${product}`,
    `The ${pick(mod.adjectives)} Secret to ${benefit} [${product}]`,
    `Your ${benefit} Journey Starts with ${product}`,
    `${product}: ${pick(mod.adjectives).charAt(0).toUpperCase() + pick(mod.adjectives).slice(1)} ${benefit} for ${audience}`,
  ];

  return { google, facebook, instagram, emailSubjects };
}

export default function AiAdCopyGenerator() {
  const [product, setProduct] = useState("");
  const [benefit, setBenefit] = useState("");
  const [audience, setAudience] = useState("");
  const [tone, setTone] = useState<Tone>("Professional");
  const [result, setResult] = useState<ReturnType<typeof generateAds> | null>(null);
  const [copiedKey, setCopiedKey] = useState("");

  const tones: Tone[] = ["Professional", "Casual", "Urgent", "Luxury"];

  const generate = () => {
    if (!product.trim() || !benefit.trim()) return;
    setResult(generateAds({ product: product.trim(), benefit: benefit.trim(), audience: audience.trim() || "everyone", tone }));
  };

  const copy = (text: string, key: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(""), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Product / Service Name</label>
          <input className="calc-input" value={product} onChange={(e) => setProduct(e.target.value)} placeholder="e.g. CloudTask Pro" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Key Benefit</label>
          <input className="calc-input" value={benefit} onChange={(e) => setBenefit(e.target.value)} placeholder="e.g. save 10 hours every week" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Target Audience</label>
          <input className="calc-input" value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="e.g. small business owners" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Tone</label>
          <select className="calc-input" value={tone} onChange={(e) => setTone(e.target.value as Tone)}>
            {tones.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>
      <button onClick={generate} className="btn-primary">Generate Ad Copy</button>
      {result && (
        <div className="space-y-6">
          {/* Google Ads */}
          <div className="result-card space-y-3">
            <h3 className="text-sm font-bold text-gray-700">Google Ads (30+30+90 format)</h3>
            {result.google.map((ad, i) => (
              <div key={i} className="bg-white rounded-xl p-3 border border-gray-100 space-y-1">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-blue-700 font-semibold text-sm">{ad.headline1} | {ad.headline2}</p>
                    <p className="text-gray-600 text-xs">{ad.description}</p>
                    <p className="text-gray-400 text-xs mt-1">H1: {ad.headline1.length}/30 | H2: {ad.headline2.length}/30 | Desc: {ad.description.length}/90</p>
                  </div>
                  <button onClick={() => copy(`${ad.headline1} | ${ad.headline2}\n${ad.description}`, `g${i}`)} className="btn-secondary text-xs ml-2">{copiedKey === `g${i}` ? "Copied!" : "Copy"}</button>
                </div>
              </div>
            ))}
          </div>

          {/* Facebook Ads */}
          <div className="result-card space-y-3">
            <h3 className="text-sm font-bold text-gray-700">Facebook Ads</h3>
            {result.facebook.map((ad, i) => (
              <div key={i} className="bg-white rounded-xl p-3 border border-gray-100">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-gray-800">{ad.headline}</p>
                    <p className="text-gray-600 text-xs mt-1">{ad.body}</p>
                  </div>
                  <button onClick={() => copy(`${ad.headline}\n\n${ad.body}`, `f${i}`)} className="btn-secondary text-xs ml-2">{copiedKey === `f${i}` ? "Copied!" : "Copy"}</button>
                </div>
              </div>
            ))}
          </div>

          {/* Instagram Captions */}
          <div className="result-card space-y-3">
            <h3 className="text-sm font-bold text-gray-700">Instagram Captions</h3>
            {result.instagram.map((caption, i) => (
              <div key={i} className="bg-white rounded-xl p-3 border border-gray-100">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    {caption.split("\n").map((line, j) => (
                      <p key={j} className={`text-gray-700 text-xs ${line === "" ? "h-2" : ""}`}>{line}</p>
                    ))}
                    <p className="text-gray-400 text-xs mt-1">{caption.length} characters</p>
                  </div>
                  <button onClick={() => copy(caption, `i${i}`)} className="btn-secondary text-xs ml-2">{copiedKey === `i${i}` ? "Copied!" : "Copy"}</button>
                </div>
              </div>
            ))}
          </div>

          {/* Email Subject Lines */}
          <div className="result-card space-y-3">
            <h3 className="text-sm font-bold text-gray-700">Email Subject Lines</h3>
            {result.emailSubjects.map((sub, i) => (
              <div key={i} className="bg-white rounded-xl p-2 border border-gray-100 flex justify-between items-center">
                <p className="text-sm text-gray-700">{sub}</p>
                <button onClick={() => copy(sub, `e${i}`)} className="btn-secondary text-xs ml-2">{copiedKey === `e${i}` ? "Copied!" : "Copy"}</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
