"use client";
import { useState } from "react";

interface TestimonialResult {
  label: string;
  text: string;
}

const shortTemplates = [
  "{product} has been a game-changer for us. {benefit} - couldn't be happier! Highly recommend it.",
  "Absolutely love {product}! {benefit} and the quality is outstanding. {rating} experience!",
  "If you're looking for {benefit}, {product} is the answer. Exceeded all my expectations!",
  "I was skeptical at first, but {product} truly delivers. {benefit} - worth every penny!",
  "{product} does exactly what it promises. {benefit} made all the difference for us.",
];

const mediumTemplates = [
  "I've been using {product} for a few months now, and I have to say, it has completely exceeded my expectations. {benefit} was the main reason I chose it, and it delivers on that promise and more. The team behind it clearly cares about quality. I would absolutely recommend {product} to anyone looking for a reliable solution. {rating} experience overall!",
  "When I first discovered {product}, I wasn't sure it would live up to the hype. But after giving it a try, I'm truly impressed. {benefit} has made a noticeable difference in my daily workflow. The ease of use and the results speak for themselves. If you're on the fence about trying {product}, just go for it - you won't regret it!",
  "As someone who has tried many similar solutions, {product} stands head and shoulders above the rest. {benefit} is exactly what I needed, and the experience has been nothing short of {rating}. The attention to detail and commitment to customer satisfaction is evident in every interaction. Highly recommended!",
  "I can honestly say that {product} has been one of the best decisions I've made. {benefit} was immediate and noticeable. What really sets {product} apart is the consistency and reliability. Whether you're a beginner or an expert, you'll find immense value here. A solid {rating} experience!",
];

const detailedTemplates = [
  "I want to share my experience with {product} because I think it could help others who are in the same situation I was. Before finding {product}, I was struggling with several challenges in my daily routine. I had tried multiple alternatives, but nothing seemed to deliver consistent results.\n\nThen I discovered {product}, and everything changed. From the very first interaction, I could tell this was different. The onboarding process was smooth, the interface was intuitive, and most importantly, {benefit} was evident almost immediately.\n\nWhat truly impressed me was the attention to detail. Every feature felt thoughtfully designed with the end user in mind. Over the past few months, I've seen significant improvements, and I can confidently say this has been a {rating} experience.\n\nI would wholeheartedly recommend {product} to anyone looking for a reliable, effective solution. It's rare to find something that not only meets expectations but consistently exceeds them. Thank you to the team behind {product} for creating something truly special!",
  "Let me tell you about my journey with {product}. I was initially hesitant, having been burned by similar promises in the past. But a friend recommended it, and I decided to give it one more try.\n\nI'm so glad I did. From day one, {product} delivered on its core promise of {benefit}. But what surprised me was everything else it offered. The user experience was seamless, the support team was responsive and genuinely helpful, and the results kept getting better over time.\n\nWhat sets {product} apart from competitors is the genuine quality and consistency. There are no hidden catches, no sudden drops in performance. It just works, reliably, every single time. That kind of dependability is hard to find these days.\n\nAfter months of use, I can confidently give {product} a {rating} rating. It has become an essential part of my toolkit, and I've already recommended it to colleagues and friends. If you're considering {product}, take it from someone who was once a skeptic - it's the real deal. You won't be disappointed!",
];

const ratingWords: Record<number, string> = {
  1: "below-average", 2: "decent", 3: "good", 4: "excellent", 5: "outstanding",
};

const stars = (rating: number) => "★".repeat(rating) + "☆".repeat(5 - rating);

export default function AiTestimonialGenerator() {
  const [product, setProduct] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [benefit, setBenefit] = useState("");
  const [rating, setRating] = useState(5);
  const [results, setResults] = useState<TestimonialResult[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [seed, setSeed] = useState(0);

  const generate = () => {
    const p = product.trim() || "this product";
    const b = benefit.trim() || "great quality and performance";
    const r = ratingWords[rating] || "great";
    const c = customerName.trim();
    const s = seed;

    const fill = (tpl: string) => {
      let text = tpl
        .replace(/\{product\}/g, p)
        .replace(/\{benefit\}/g, b)
        .replace(/\{rating\}/g, r);
      if (c) text += `\n\n- ${c} ${stars(rating)}`;
      else text += `\n\n${stars(rating)}`;
      return text;
    };

    setResults([
      { label: "Short (1-2 sentences)", text: fill(shortTemplates[s % shortTemplates.length]) },
      { label: "Medium (3-4 sentences)", text: fill(mediumTemplates[s % mediumTemplates.length]) },
      { label: "Detailed (paragraph with story)", text: fill(detailedTemplates[s % detailedTemplates.length]) },
    ]);
    setSeed((prev) => prev + 1);
  };

  const copy = (idx: number) => {
    navigator.clipboard?.writeText(results[idx].text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Product / Service Name</label>
          <input className="calc-input" value={product} onChange={(e) => setProduct(e.target.value)} placeholder="e.g., SabTools, XYZ App..." />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Customer Name (optional)</label>
          <input className="calc-input" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="e.g., Rahul Sharma" />
        </div>
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Key Benefit</label>
        <input className="calc-input" value={benefit} onChange={(e) => setBenefit(e.target.value)} placeholder="e.g., improved productivity by 50%, saved hours of work..." />
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Rating: {stars(rating)} ({rating}/5)</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((r) => (
            <button
              key={r}
              onClick={() => setRating(r)}
              className={`text-2xl ${r <= rating ? "text-yellow-500" : "text-gray-300"} hover:scale-110 transition-transform`}
            >
              ★
            </button>
          ))}
        </div>
      </div>
      <button onClick={generate} className="btn-primary">Generate Testimonials</button>
      {results.length > 0 && (
        <div className="space-y-4">
          {results.map((r, i) => (
            <div key={i} className="result-card">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-gray-600">{r.label}</span>
                <button onClick={() => copy(i)} className="text-xs text-indigo-600 font-medium hover:underline">{copiedIdx === i ? "Copied!" : "Copy"}</button>
              </div>
              <p className="text-gray-800 leading-relaxed whitespace-pre-line">{r.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
