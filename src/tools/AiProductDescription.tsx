"use client";
import { useState } from "react";

type Tone = "Professional" | "Casual" | "Luxury";
type Length = "Short" | "Medium" | "Long";

function generateDescription(name: string, category: string, features: string[], audience: string, price: string, tone: Tone, length: Length): string {
  const feat = features.length > 0 ? features : ["premium quality", "innovative design"];
  const featStr = feat.length > 2 ? `${feat.slice(0, -1).join(", ")}, and ${feat[feat.length - 1]}` : feat.join(" and ");
  const topFeat = feat.slice(0, 3);
  const aud = audience || "discerning customers";
  const pr = price ? ` at ${price}` : "";

  if (tone === "Professional") {
    if (length === "Short") {
      return `Introducing ${name} — a premium ${category} designed for ${aud}. Featuring ${featStr}, it delivers exceptional performance and reliability${pr}. Order now and experience the difference.`;
    }
    if (length === "Medium") {
      return `${name} is a cutting-edge ${category} engineered to meet the demands of ${aud}. Built with precision and featuring ${featStr}, this product sets a new standard in its class.\n\nKey highlights include ${topFeat[0] || "superior build quality"} for lasting durability, ${topFeat[1] || "intuitive functionality"} for seamless operation, and ${topFeat[2] || "modern aesthetics"} that complement any setting. Available${pr}, ${name} offers outstanding value without compromising on quality.\n\nElevate your experience — choose ${name} today.`;
    }
    return `${name} represents the pinnacle of ${category} engineering, meticulously crafted for ${aud} who refuse to settle for anything less than exceptional. Every detail has been thoughtfully designed to deliver unmatched performance, durability, and satisfaction.\n\nAt its core, ${name} features ${featStr}. The ${topFeat[0] || "advanced technology"} ensures reliable performance day after day, while ${topFeat[1] || "ergonomic design"} provides comfort and ease of use. ${topFeat[2] ? `The inclusion of ${topFeat[2]} further sets it apart from competitors in the ${category} space.` : ""}\n\nWhether you are a first-time buyer or upgrading from an existing product, ${name} delivers on every front. Its competitive pricing${pr} makes it an intelligent investment for anyone seeking long-term value.\n\nDon't miss out — ${name} is the ${category} solution you've been waiting for. Order today and join thousands of satisfied customers who have already made the switch.`;
  }

  if (tone === "Casual") {
    if (length === "Short") {
      return `Meet ${name} — the ${category} that just gets it. With ${featStr}, it's perfect for ${aud} who want quality without the fuss${pr}. Grab yours now!`;
    }
    if (length === "Medium") {
      return `Looking for a ${category} that actually delivers? Say hello to ${name}! Packed with ${featStr}, this bad boy is built for ${aud} who know what they want.\n\nWhat makes it awesome? ${topFeat[0] || "Top-notch quality"} that lasts, ${topFeat[1] || "super easy setup"}, and ${topFeat[2] || "a design you'll love showing off"}. All this${pr} — seriously, what's not to love?\n\nStop scrolling and start ordering. Your future self will thank you!`;
    }
    return `Okay, let's talk about ${name}. If you've been searching for the perfect ${category}, your hunt is officially over. This thing is packed with ${featStr}, and honestly? It's a game-changer for ${aud}.\n\nFirst off, ${topFeat[0] || "the build quality"} is next level. We're talking something that feels premium from the moment you unbox it. Then there's ${topFeat[1] || "the ease of use"} — no complicated manuals, no headaches, just plug in and go. ${topFeat[2] ? `And let's not forget ${topFeat[2]}, which is honestly the cherry on top.` : ""}\n\nNow, about the price — ${pr || "it's incredibly reasonable"} for what you're getting. Compare it to anything else in the ${category} market and you'll see why people are switching over in droves.\n\nBottom line: ${name} is the real deal. Don't just take our word for it — try it yourself and prepare to be impressed. Hit that order button and let's go!`;
  }

  // Luxury
  if (length === "Short") {
    return `${name} — where ${category} artistry meets unparalleled excellence. Crafted with ${featStr} for ${aud} who demand nothing but the finest${pr}. Indulge in perfection.`;
  }
  if (length === "Medium") {
    return `Discover ${name}, a masterpiece of ${category} craftsmanship designed exclusively for ${aud}. Every element, from ${featStr}, has been curated to deliver an experience that transcends the ordinary.\n\nThe ${topFeat[0] || "exquisite materials"} speak of refined taste, while ${topFeat[1] || "meticulous attention to detail"} ensures flawless execution. ${topFeat[2] ? `Complemented by ${topFeat[2]}, ${name} is truly in a class of its own.` : ""} Priced${pr} to reflect its exceptional quality.\n\nEmbrace the extraordinary. ${name} awaits.`;
  }
  return `In a world of mass production, ${name} stands as a testament to the art of ${category} excellence. Conceived for ${aud} with discerning taste and an appreciation for the finer things, this creation embodies sophistication in every dimension.\n\n${name} showcases ${featStr}, each element harmoniously integrated to deliver an experience that is as functional as it is beautiful. The ${topFeat[0] || "hand-selected materials"} evoke a sense of timeless elegance, while ${topFeat[1] || "precision engineering"} ensures performance that never falters. ${topFeat[2] ? `The distinctive ${topFeat[2]} adds an unmistakable signature that sets ${name} apart from all that came before.` : ""}\n\nOwnership of ${name} is not merely a purchase — it is an investment in a lifestyle of excellence. Priced${pr} to reflect its heritage and craftsmanship, this ${category} masterpiece is destined for those who understand that true luxury is never compromised.\n\nWelcome to a new standard of ${category} distinction. Welcome to ${name}.`;
}

export default function AiProductDescription() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [features, setFeatures] = useState("");
  const [audience, setAudience] = useState("");
  const [price, setPrice] = useState("");
  const [tone, setTone] = useState<Tone>("Professional");
  const [results, setResults] = useState<{ label: string; text: string }[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const generate = () => {
    if (!name.trim() || !category.trim()) return;
    const feat = features.split(",").map((s) => s.trim()).filter(Boolean);
    const lengths: Length[] = ["Short", "Medium", "Long"];
    const wordTargets = { Short: "~50 words", Medium: "~100 words", Long: "~200 words" };
    setResults(lengths.map((l) => ({
      label: `${l} (${wordTargets[l]})`,
      text: generateDescription(name.trim(), category.trim(), feat, audience.trim(), price.trim(), tone, l),
    })));
  };

  const copy = (idx: number) => {
    navigator.clipboard?.writeText(results[idx].text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Product Name</label>
          <input className="calc-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. AirPods Pro Max" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Category</label>
          <input className="calc-input" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Wireless Headphones" />
        </div>
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Key Features (comma separated)</label>
        <input className="calc-input" value={features} onChange={(e) => setFeatures(e.target.value)} placeholder="e.g. Noise cancellation, 30hr battery, Spatial audio" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Target Audience</label>
          <input className="calc-input" value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="e.g. music lovers and professionals" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Price Range</label>
          <input className="calc-input" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="e.g. $299-$349" />
        </div>
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Tone</label>
        <div className="flex gap-2 flex-wrap">
          {(["Professional", "Casual", "Luxury"] as Tone[]).map((t) => (
            <button key={t} onClick={() => setTone(t)} className={t === tone ? "btn-primary" : "btn-secondary"}>{t}</button>
          ))}
        </div>
      </div>
      <button onClick={generate} className="btn-primary">Generate Descriptions</button>
      {results.length > 0 && (
        <div className="space-y-4">
          {results.map((r, i) => (
            <div key={i} className="result-card">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-gray-600">{r.label}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">{r.text.split(/\s+/).length} words</span>
                  <button onClick={() => copy(i)} className="text-xs text-indigo-600 font-medium hover:underline">{copiedIdx === i ? "Copied!" : "Copy"}</button>
                </div>
              </div>
              {r.text.split("\n\n").map((p, j) => <p key={j} className="text-gray-800 leading-relaxed mb-2">{p}</p>)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
