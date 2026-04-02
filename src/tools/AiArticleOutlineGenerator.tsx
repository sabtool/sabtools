"use client";
import { useState, useMemo } from "react";

type Audience = "beginner" | "intermediate" | "expert";
type ArticleType = "how-to" | "guide" | "listicle" | "review" | "comparison";

const titleFormulas: Record<ArticleType, ((t: string) => string)[]> = {
  "how-to": [
    (t) => `How to Master ${t}: A Step-by-Step Guide`,
    (t) => `The Complete How-To Guide for ${t}`,
    (t) => `How to Get Started with ${t} (Even If You're a Beginner)`,
  ],
  guide: [
    (t) => `The Ultimate Guide to ${t} in ${new Date().getFullYear()}`,
    (t) => `${t}: Everything You Need to Know`,
    (t) => `A Comprehensive Guide to ${t} for Every Level`,
  ],
  listicle: [
    (t) => `10 Essential Things to Know About ${t}`,
    (t) => `7 Proven Strategies for ${t} Success`,
    (t) => `Top 12 ${t} Tips That Actually Work`,
  ],
  review: [
    (t) => `${t} Review: An Honest and Detailed Analysis`,
    (t) => `Is ${t} Worth It? A Complete Review`,
    (t) => `${t} Review ${new Date().getFullYear()}: Pros, Cons & Verdict`,
  ],
  comparison: [
    (t) => `${t}: Comparing the Best Options Available`,
    (t) => `${t} Comparison: Which One Is Right for You?`,
    (t) => `Head-to-Head: The Ultimate ${t} Comparison Guide`,
  ],
};

const audienceModifiers: Record<Audience, string> = {
  beginner: "with clear explanations and foundational concepts",
  intermediate: "with practical insights and actionable strategies",
  expert: "with advanced techniques and in-depth analysis",
};

const headingTemplates: Record<ArticleType, { h2: string; h3s: string[] }[]> = {
  "how-to": [
    { h2: "Understanding the Basics of {topic}", h3s: ["What Is {topic} and Why Does It Matter?", "Key Concepts You Need to Know", "Common Misconceptions Debunked"] },
    { h2: "Preparing for {topic}: What You Need", h3s: ["Essential Tools and Resources", "Setting Up Your Environment"] },
    { h2: "Step 1: Getting Started with {topic}", h3s: ["Initial Setup and Configuration", "Your First Actions", "Troubleshooting Common Issues"] },
    { h2: "Step 2: Building Your {topic} Foundation", h3s: ["Core Techniques to Master", "Practice Exercises and Drills"] },
    { h2: "Step 3: Advancing Your {topic} Skills", h3s: ["Intermediate Strategies", "Real-World Applications"] },
    { h2: "Step 4: Optimizing Your {topic} Approach", h3s: ["Performance Tips", "Measuring Your Progress"] },
    { h2: "Common Mistakes to Avoid with {topic}", h3s: ["Beginner Pitfalls", "How to Recover from Errors"] },
    { h2: "Next Steps and Continued Learning", h3s: ["Advanced Resources", "Community and Support"] },
  ],
  guide: [
    { h2: "Introduction to {topic}", h3s: ["Definition and Overview", "Historical Context", "Why {topic} Matters Today"] },
    { h2: "Core Components of {topic}", h3s: ["Key Elements Explained", "How They Work Together"] },
    { h2: "Benefits and Advantages of {topic}", h3s: ["Primary Benefits", "Long-Term Value", "Who Benefits Most"] },
    { h2: "Getting Started with {topic}", h3s: ["Prerequisites and Requirements", "Step-by-Step Setup Guide"] },
    { h2: "Best Practices for {topic}", h3s: ["Industry-Standard Approaches", "Tips from Experts"] },
    { h2: "Advanced {topic} Strategies", h3s: ["Taking It to the Next Level", "Specialized Techniques"] },
    { h2: "Tools and Resources for {topic}", h3s: ["Recommended Tools", "Learning Resources"] },
    { h2: "Future of {topic}", h3s: ["Emerging Trends", "Predictions and Outlook"] },
  ],
  listicle: [
    { h2: "1. Understanding the Fundamentals of {topic}", h3s: ["Why This Matters", "Quick Actionable Tip"] },
    { h2: "2. The Most Important Aspect of {topic}", h3s: ["Key Insight", "How to Apply This"] },
    { h2: "3. A Game-Changing Approach to {topic}", h3s: ["The Strategy Explained", "Expected Results"] },
    { h2: "4. Essential {topic} Technique Everyone Should Know", h3s: ["Step-by-Step Breakdown", "Common Variations"] },
    { h2: "5. The Hidden Secret of Successful {topic}", h3s: ["What Experts Do Differently", "Practical Implementation"] },
    { h2: "6. Maximizing Results with {topic}", h3s: ["Optimization Strategies", "Measuring Success"] },
    { h2: "7. Avoiding Common {topic} Mistakes", h3s: ["Top Pitfalls", "Prevention Strategies"] },
    { h2: "8. Future-Proofing Your {topic} Approach", h3s: ["Staying Current", "Adapting to Change"] },
  ],
  review: [
    { h2: "Overview of {topic}", h3s: ["What Is It?", "Who Is It For?", "First Impressions"] },
    { h2: "Key Features of {topic}", h3s: ["Standout Features", "Feature Comparison Table"] },
    { h2: "Performance and Quality", h3s: ["Real-World Testing", "Benchmark Results"] },
    { h2: "User Experience", h3s: ["Ease of Use", "Learning Curve", "Interface Design"] },
    { h2: "Pros and Cons", h3s: ["What We Liked", "What Could Be Better"] },
    { h2: "Pricing and Value", h3s: ["Pricing Breakdown", "Is It Worth the Investment?"] },
    { h2: "Alternatives to Consider", h3s: ["Top Alternatives", "Comparison Summary"] },
    { h2: "Final Verdict on {topic}", h3s: ["Our Rating", "Who Should Choose This?"] },
  ],
  comparison: [
    { h2: "Introduction to the {topic} Landscape", h3s: ["Why This Comparison Matters", "Our Evaluation Criteria"] },
    { h2: "Option A: Detailed Analysis", h3s: ["Key Strengths", "Notable Weaknesses", "Best Use Cases"] },
    { h2: "Option B: Detailed Analysis", h3s: ["Key Strengths", "Notable Weaknesses", "Best Use Cases"] },
    { h2: "Feature-by-Feature Comparison", h3s: ["Core Features", "Advanced Capabilities", "Integration Options"] },
    { h2: "Performance Comparison", h3s: ["Speed and Efficiency", "Reliability and Uptime"] },
    { h2: "Pricing Comparison", h3s: ["Cost Breakdown", "Value for Money Analysis"] },
    { h2: "User Reviews and Community Feedback", h3s: ["What Users Say", "Common Praise and Complaints"] },
    { h2: "Which {topic} Option Should You Choose?", h3s: ["Decision Framework", "Our Recommendation"] },
  ],
};

const ctaTemplates = [
  "Share this article with someone who could benefit from learning about {topic}!",
  "Have questions about {topic}? Drop a comment below and we'll be happy to help!",
  "Ready to take action on {topic}? Start with the first step today and track your progress.",
  "Subscribe to our newsletter for more in-depth guides on {topic} and related subjects.",
  "Found this helpful? Bookmark this page and revisit it as you implement these {topic} strategies.",
];

function fill(s: string, topic: string): string {
  return s.replace(/\{topic\}/g, topic);
}

export default function AiArticleOutlineGenerator() {
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState<Audience>("beginner");
  const [articleType, setArticleType] = useState<ArticleType>("guide");
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const generate = () => {
    if (!topic.trim()) return;
    const t = topic.trim();

    const titles = titleFormulas[articleType].map(fn => fn(t));
    const introPoints = [
      `Hook the reader with a compelling statistic or question about ${t}`,
      `Briefly explain what ${t} is and why it matters ${audienceModifiers[audience]}`,
      `Set expectations for what the reader will learn from this article`,
    ];
    const headings = headingTemplates[articleType].map(h => ({
      h2: fill(h.h2, t),
      h3s: h.h3s.map(s => fill(s, t)),
    }));
    const conclusionPoints = [
      `Summarize the key takeaways about ${t}`,
      `Reinforce the main benefit or insight for the reader`,
      `Encourage the reader to take the next step`,
    ];
    const cta = fill(ctaTemplates[Math.floor(Math.random() * ctaTemplates.length)], t);

    let outline = `ARTICLE OUTLINE: ${t}\n`;
    outline += `Type: ${articleType.charAt(0).toUpperCase() + articleType.slice(1)} | Audience: ${audience.charAt(0).toUpperCase() + audience.slice(1)}\n`;
    outline += `${"=".repeat(60)}\n\n`;
    outline += `TITLE SUGGESTIONS:\n`;
    titles.forEach((title, i) => { outline += `  ${i + 1}. ${title}\n`; });
    outline += `\nINTRODUCTION POINTS:\n`;
    introPoints.forEach(p => { outline += `  - ${p}\n`; });
    outline += `\nMAIN CONTENT:\n`;
    headings.forEach(h => {
      outline += `\n  ## ${h.h2}\n`;
      h.h3s.forEach(s => { outline += `    ### ${s}\n`; });
    });
    outline += `\nCONCLUSION POINTS:\n`;
    conclusionPoints.forEach(p => { outline += `  - ${p}\n`; });
    outline += `\nCALL TO ACTION:\n  ${cta}\n`;

    setResult(outline);
  };

  const headingCount = useMemo(() => {
    if (!result) return 0;
    return (result.match(/## /g) || []).length;
  }, [result]);

  const copy = () => {
    if (!result) return;
    navigator.clipboard?.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Article Topic</label>
        <input className="calc-input" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. Digital Marketing, React.js, Personal Finance" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Target Audience</label>
          <select className="calc-input" value={audience} onChange={(e) => setAudience(e.target.value as Audience)}>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="expert">Expert</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Article Type</label>
          <select className="calc-input" value={articleType} onChange={(e) => setArticleType(e.target.value as ArticleType)}>
            <option value="how-to">How-To</option>
            <option value="guide">Comprehensive Guide</option>
            <option value="listicle">Listicle</option>
            <option value="review">Review</option>
            <option value="comparison">Comparison</option>
          </select>
        </div>
      </div>
      <button onClick={generate} className="btn-primary">Generate Outline</button>
      {result && (
        <div className="result-card space-y-4">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <span className="text-sm font-bold text-gray-600">{headingCount} sections generated</span>
            <button onClick={copy} className="btn-secondary text-xs">{copied ? "Copied!" : "Copy Full Outline"}</button>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 overflow-x-auto">
            <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono leading-relaxed">{result}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
