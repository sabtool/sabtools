"use client";
import { useState, useMemo } from "react";

type EssayType = "Argumentative" | "Descriptive" | "Narrative" | "Expository" | "Persuasive";
type WordCount = 250 | 500 | 750 | 1000;

const hooks: Record<EssayType, string[]> = {
  Argumentative: [
    "In today's rapidly evolving world, the debate surrounding {topic} has never been more relevant.",
    "Few subjects spark as much controversy as {topic}, yet the evidence points clearly in one direction.",
    "The question of {topic} divides opinion, but a careful analysis reveals compelling truths.",
  ],
  Descriptive: [
    "Picture a world shaped by {topic} — vivid, intricate, and endlessly fascinating.",
    "The essence of {topic} can be felt in every corner of our daily lives, painting a rich tapestry of experience.",
    "To truly understand {topic}, one must observe it through a lens of wonder and curiosity.",
  ],
  Narrative: [
    "It all began with a simple encounter with {topic}, an experience that would change everything.",
    "There comes a moment in every person's life when {topic} takes center stage in an unexpected way.",
    "The story of {topic} is one that resonates across generations and cultures alike.",
  ],
  Expository: [
    "Understanding {topic} requires a systematic examination of its key components and implications.",
    "{topic} is a subject that encompasses multiple dimensions, each worthy of careful analysis.",
    "A thorough exploration of {topic} reveals layers of complexity that demand attention.",
  ],
  Persuasive: [
    "It is time we recognize the undeniable importance of {topic} in shaping our future.",
    "The case for {topic} is overwhelming, supported by evidence, logic, and real-world outcomes.",
    "Consider this: {topic} holds the power to transform society for the better, if only we embrace it.",
  ],
};

const bodyTemplates: Record<EssayType, { topic: string; support: string; example: string }[]> = {
  Argumentative: [
    { topic: "First and foremost, {topic} presents a compelling case when examined through empirical evidence.", support: "Research consistently demonstrates that the impact of {topic} extends far beyond surface-level observations. Scholars and practitioners alike have noted measurable outcomes that support this position.", example: "For instance, numerous studies and real-world cases have shown that embracing {topic} leads to significant improvements in outcomes, efficiency, and overall well-being." },
    { topic: "Furthermore, the societal implications of {topic} cannot be overlooked.", support: "Communities that have actively engaged with {topic} report higher levels of satisfaction and progress. The data reveals a clear correlation between attention to {topic} and positive social outcomes.", example: "A notable example can be seen in regions where {topic} has been prioritized, resulting in measurable gains in quality of life and economic development." },
    { topic: "Critics may argue against {topic}, yet their objections fail to withstand scrutiny.", support: "While opposing viewpoints exist, they often rely on outdated assumptions or incomplete data. A balanced examination shows that the benefits of {topic} far outweigh any perceived drawbacks.", example: "History has repeatedly shown that initial resistance to {topic} gives way to acceptance once the evidence becomes undeniable." },
  ],
  Descriptive: [
    { topic: "The visual and sensory landscape of {topic} is remarkably diverse and captivating.", support: "Every aspect of {topic} carries its own texture, color, and rhythm. From subtle details to grand expressions, it creates a rich sensory experience that engages all who encounter it.", example: "Imagine walking through a scene where {topic} unfolds before you — the sights, sounds, and feelings creating an immersive experience unlike any other." },
    { topic: "Beneath the surface, {topic} reveals intricate patterns and hidden depths.", support: "What may seem simple at first glance becomes increasingly complex upon closer inspection. The layers within {topic} tell stories of history, culture, and human ingenuity.", example: "Like a painting that reveals new details with each viewing, {topic} rewards those who take the time to look deeper." },
    { topic: "The emotional resonance of {topic} is perhaps its most powerful characteristic.", support: "People who have experienced {topic} often describe a profound sense of connection and meaning. It has the ability to evoke memories, stir emotions, and inspire creative expression.", example: "Whether through personal encounters or shared experiences, {topic} leaves an indelible impression on all who engage with it." },
  ],
  Narrative: [
    { topic: "The journey with {topic} began in an unexpected manner, setting the stage for what was to come.", support: "At first, the significance of {topic} was not immediately apparent. It was through gradual exposure and growing understanding that its true nature began to reveal itself.", example: "Looking back, that initial encounter with {topic} was the catalyst for a series of events that would reshape perspectives and open new possibilities." },
    { topic: "As the story of {topic} unfolded, challenges and triumphs emerged in equal measure.", support: "Every step forward brought new lessons and revelations. The path was neither straight nor predictable, but each twist added depth to the narrative of {topic}.", example: "One particularly memorable moment came when {topic} presented an obstacle that seemed insurmountable, only to become the greatest learning opportunity of all." },
    { topic: "The climax of this journey with {topic} arrived when least expected.", support: "All the experiences, lessons, and growth converged at a pivotal moment. It was here that the full significance of {topic} became crystal clear.", example: "In that defining moment, everything about {topic} clicked into place, transforming uncertainty into understanding and doubt into conviction." },
  ],
  Expository: [
    { topic: "The foundational elements of {topic} provide essential context for understanding its significance.", support: "At its core, {topic} operates on principles that have been established through extensive research and practical application. These fundamentals serve as building blocks for deeper comprehension.", example: "Studies conducted across various institutions have identified key factors that drive {topic}, providing a framework for analysis and discussion." },
    { topic: "The mechanisms through which {topic} functions reveal a sophisticated system of interconnected components.", support: "Each element within {topic} plays a specific role, contributing to the overall function and outcome. Understanding these mechanisms is crucial for anyone seeking to grasp the full picture.", example: "When one examines how {topic} operates in practice, the relationship between its various components becomes evident and illuminating." },
    { topic: "The broader implications of {topic} extend across multiple domains and disciplines.", support: "From practical applications to theoretical frameworks, {topic} influences a wide range of fields. Its reach continues to expand as new discoveries and innovations emerge.", example: "The cross-disciplinary impact of {topic} can be observed in fields ranging from education and technology to healthcare and governance." },
  ],
  Persuasive: [
    { topic: "The evidence supporting {topic} is both abundant and compelling.", support: "Multiple credible sources confirm that {topic} delivers measurable benefits to individuals and communities alike. The data speaks for itself, leaving little room for doubt.", example: "Consider the documented cases where {topic} has led to transformative results — improved outcomes, greater efficiency, and enhanced quality of life for all involved." },
    { topic: "Beyond the numbers, the human impact of {topic} tells an even more powerful story.", support: "Real people in real communities have experienced firsthand the positive effects of {topic}. Their testimonies add a vital dimension to the statistical evidence.", example: "Countless individuals have shared how {topic} changed their lives for the better, providing inspiration and proof that action leads to meaningful results." },
    { topic: "The cost of ignoring {topic} far exceeds the investment required to embrace it.", support: "Inaction carries significant risks — missed opportunities, declining outcomes, and growing disparities. Conversely, proactive engagement with {topic} yields returns that multiply over time.", example: "History teaches us that societies which invest in {topic} thrive, while those that neglect it face mounting challenges that become increasingly difficult to address." },
  ],
};

const conclusions: Record<EssayType, string[]> = {
  Argumentative: [
    "In conclusion, the evidence overwhelmingly supports the importance of {topic}. While alternative viewpoints exist, a thorough examination reveals that the arguments in favor are far more robust and well-supported.",
    "As we have seen through careful analysis, {topic} stands as a matter of significant consequence. It is incumbent upon us to approach this subject with the seriousness and attention it deserves, guided by evidence and reason.",
  ],
  Descriptive: [
    "In the end, {topic} is a subject that defies simple description. Its richness and complexity invite ongoing exploration, and those who take the time to truly see it are rewarded with deeper understanding and appreciation.",
    "The beauty of {topic} lies not just in its outward appearance but in the layers of meaning it contains. It is a reminder that the world around us is filled with wonders waiting to be discovered and described.",
  ],
  Narrative: [
    "And so, the story of {topic} reaches its conclusion — but the lessons learned along the way continue to resonate. Every journey has its end, but the impact of the experience lives on in the choices we make and the perspectives we carry forward.",
    "Reflecting on this journey with {topic}, it becomes clear that the greatest discoveries come not from the destination but from the path itself. The narrative may close, but its influence endures.",
  ],
  Expository: [
    "In summary, {topic} is a multifaceted subject that demands thorough understanding. By examining its foundations, mechanisms, and broader implications, we gain the knowledge necessary to engage with it meaningfully and effectively.",
    "This exploration of {topic} has revealed a subject of considerable depth and significance. Continued study and engagement will undoubtedly yield further insights and applications in the years to come.",
  ],
  Persuasive: [
    "The time for action on {topic} is now. The evidence is clear, the benefits are proven, and the cost of delay grows with each passing day. Let us move forward with conviction and purpose, embracing the change that {topic} demands.",
    "We stand at a crossroads where {topic} offers a path to genuine progress. The question is not whether we can afford to act, but whether we can afford not to. The answer, as the evidence makes abundantly clear, is no.",
  ],
};

function fillTemplate(template: string, topic: string): string {
  return template.replace(/\{topic\}/g, topic);
}

function generateEssay(topic: string, type: EssayType, wordTarget: WordCount): string {
  const hookList = hooks[type];
  const hook = fillTemplate(hookList[Math.floor(Math.random() * hookList.length)], topic);
  const thesis = fillTemplate(`This essay explores the significance of {topic} and argues that it deserves our careful attention and thoughtful engagement.`, topic);
  const intro = `${hook} ${thesis}`;

  const bodies = bodyTemplates[type];
  let bodyParagraphs = bodies.map((b) => {
    const t = fillTemplate(b.topic, topic);
    const s = fillTemplate(b.support, topic);
    const e = fillTemplate(b.example, topic);
    return `${t} ${s} ${e}`;
  });

  const concList = conclusions[type];
  const conclusion = fillTemplate(concList[Math.floor(Math.random() * concList.length)], topic);

  let essay = `${intro}\n\n${bodyParagraphs.join("\n\n")}\n\n${conclusion}`;

  // Trim or pad to approximate word target
  const words = essay.split(/\s+/);
  if (wordTarget <= 250 && words.length > 300) {
    // Use shorter body
    bodyParagraphs = bodies.slice(0, 2).map((b) => fillTemplate(b.topic, topic) + " " + fillTemplate(b.support, topic));
    essay = `${intro}\n\n${bodyParagraphs.join("\n\n")}\n\n${conclusion}`;
  } else if (wordTarget >= 1000 && words.length < 800) {
    const extra = bodies.map((b) => {
      const additional = `Moreover, the significance of ${topic} in this context cannot be overstated. Further analysis reveals that ${topic} continues to influence and shape developments in meaningful ways. Experts in the field consistently point to ${topic} as a driving force behind positive change and innovation.`;
      return fillTemplate(b.topic, topic) + " " + fillTemplate(b.support, topic) + " " + fillTemplate(b.example, topic) + " " + additional;
    });
    essay = `${intro}\n\n${extra.join("\n\n")}\n\n${conclusion}`;
  }

  return essay;
}

export default function AiEssayWriter() {
  const [topic, setTopic] = useState("");
  const [essayType, setEssayType] = useState<EssayType>("Argumentative");
  const [wordCount, setWordCount] = useState<WordCount>(500);
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);

  const essayTypes: EssayType[] = ["Argumentative", "Descriptive", "Narrative", "Expository", "Persuasive"];
  const wordCounts: WordCount[] = [250, 500, 750, 1000];

  const actualWordCount = useMemo(() => result.split(/\s+/).filter(Boolean).length, [result]);

  const generate = () => {
    if (!topic.trim()) return;
    setResult(generateEssay(topic.trim(), essayType, wordCount));
  };

  const copy = () => {
    navigator.clipboard?.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    const w = window.open("", "_blank");
    if (w) {
      w.document.write(`<html><head><title>Essay: ${topic}</title><style>body{font-family:Georgia,serif;max-width:700px;margin:40px auto;line-height:1.8;color:#222;padding:20px}h1{font-size:1.4em;text-align:center;margin-bottom:30px}</style></head><body><h1>${topic}</h1>${result.split("\n").map(p => p.trim() ? `<p>${p}</p>` : "").join("")}</body></html>`);
      w.document.close();
      w.print();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Essay Topic</label>
        <input className="calc-input" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. Climate Change, Artificial Intelligence, Education Reform" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Essay Type</label>
          <select className="calc-input" value={essayType} onChange={(e) => setEssayType(e.target.value as EssayType)}>
            {essayTypes.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Target Word Count</label>
          <select className="calc-input" value={wordCount} onChange={(e) => setWordCount(Number(e.target.value) as WordCount)}>
            {wordCounts.map((w) => <option key={w} value={w}>{w} words</option>)}
          </select>
        </div>
      </div>
      <button onClick={generate} className="btn-primary">Generate Essay</button>
      {result && (
        <div className="result-card space-y-4">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <span className="text-sm font-bold text-gray-600">Generated Essay ({actualWordCount} words)</span>
            <div className="flex gap-2">
              <button onClick={copy} className="btn-secondary text-xs">{copied ? "Copied!" : "Copy"}</button>
              <button onClick={handlePrint} className="btn-secondary text-xs">Print</button>
              <button onClick={generate} className="btn-secondary text-xs">Regenerate</button>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            {result.split("\n").map((line, i) => (
              <p key={i} className={`text-gray-800 leading-relaxed ${line.trim() === "" ? "h-4" : "mb-2"}`}>{line}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
