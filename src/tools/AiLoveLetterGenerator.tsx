"use client";
import { useState } from "react";

type LetterTone = "Poetic" | "Heartfelt" | "Playful";

const openings: Record<LetterTone, string[]> = {
  Poetic: [
    "My Dearest {name},\n\nIn the garden of my life, you are the most exquisite bloom that ever graced my days. The stars themselves pale in comparison to the light you bring into my world.",
    "Beloved {name},\n\nIf I could capture the essence of love in words, it would spell your name across the sky. You are the poem my heart has been writing since before I knew the meaning of devotion.",
    "My Darling {name},\n\nLike the moon draws the tide, so does my heart gravitate toward yours. You are the verse that completes the symphony of my existence.",
  ],
  Heartfelt: [
    "Dear {name},\n\nI've been wanting to put my feelings into words for a while now, and today I'm finally letting my heart speak. You mean the world to me, and I need you to know that.",
    "My Dear {name},\n\nSome feelings are too big for everyday words, so I'm writing this letter to tell you what I carry in my heart every single day. You are my everything.",
    "To My One and Only {name},\n\nI'm not always good with words, but when it comes to you, my heart overflows. So here I am, putting my love on paper, hoping it reaches the depths of your soul.",
  ],
  Playful: [
    "Hey {name}!\n\nSo, I've been trying to figure out how to tell you how amazing you are, and apparently a love letter is the way to go. Buckle up, because you're about to get hit with some serious feelings!",
    "Dear {name} (aka the cutest human alive),\n\nThis is your official notice that you have completely and utterly stolen my heart. And honestly? I don't want it back.",
    "To My Favorite Human, {name},\n\nRemember when I said I wasn't the romantic type? Well, surprise! Turns out you bring out a side of me I didn't know existed. So here goes nothing...",
  ],
};

const memoryTemplates: Record<LetterTone, string[]> = {
  Poetic: [
    "\n\nAmong the constellation of our shared moments, {memory} shines the brightest. That memory is etched in the chambers of my heart like an eternal flame that no wind can extinguish. Every time I revisit that moment, I fall in love with you all over again, deeper than before.",
    "\n\nWhen I close my eyes and think of {memory}, time stands still. It was in that moment that I realized our love was not ordinary - it was written in the stars, destined to unfold like the most beautiful story ever told.",
  ],
  Heartfelt: [
    "\n\nDo you remember {memory}? I think about it all the time. It was one of those perfect moments where everything just felt right. I looked at you and thought, 'This is it. This is what happiness feels like.' That memory is one of my most treasured possessions.",
    "\n\nOne of my favorite memories with you is {memory}. It might seem simple to others, but to me, it meant everything. It was a moment that reminded me why loving you is the easiest and most natural thing I've ever done.",
  ],
  Playful: [
    "\n\nOkay, but can we talk about {memory}? Because honestly, that's one of my all-time favorite moments with you. It's the kind of memory that makes me smile randomly in public and look like a complete weirdo. But hey, worth it!",
    "\n\nRemember {memory}? Of course you do! That was peak US right there. If our love story were a movie, that would be the scene everyone quotes. And yes, I replay it in my head more often than I'll admit.",
  ],
};

const qualityTemplates: Record<LetterTone, string[]> = {
  Poetic: [
    "\n\nWhat I adore about you transcends the ordinary. {qualities} - these are but a few strokes of the masterpiece that is you. You are a rare soul, a gentle force of nature that transforms everything around you into something beautiful. To know you is to know grace itself.",
    "\n\nYour essence is woven with threads of {qualities}. You carry within you a light so radiant that it illuminates the darkest corners of my world. You are not just someone I love - you are someone I deeply admire.",
  ],
  Heartfelt: [
    "\n\nThere are so many things I love about you, but let me try: {qualities}. These are the things that make you, you. And it's the real, unfiltered you that I fell in love with. Not a perfect version, but an authentic, beautiful soul who makes my life infinitely better.",
    "\n\nWhat makes you special is {qualities}. You don't even realize how much these things mean to me. The way you show up, the way you care, the way you love - it all makes me fall for you over and over again.",
  ],
  Playful: [
    "\n\nNow, let me list the reasons you're basically the best person ever: {qualities}. And that's just the short list! If I wrote down everything, I'd need a whole notebook. Actually, make that a series of notebooks. You're just THAT amazing.",
    "\n\nHere's why you're my person: {qualities}. I could go on, but I don't want your head to get too big. Just kidding - it should be big. You're incredible and I want you to know it!",
  ],
};

const futureTemplates: Record<LetterTone, string[]> = {
  Poetic: [
    "\n\nAs I gaze upon the horizon of our future, I see a tapestry woven with golden threads of shared dreams and intertwined destinies. With you by my side, {duration} feels like both a beautiful eternity and a fleeting moment. I dream of growing old with you, of watching seasons change while our love only deepens with time.",
    "\n\nOur journey of {duration} is but the prologue of an epic love story. The chapters ahead are filled with adventures waiting to be lived, sunsets waiting to be shared, and dreams waiting to be fulfilled - together, always together.",
  ],
  Heartfelt: [
    "\n\nWe've been together for {duration}, and my love for you has only grown stronger. When I think about our future, I see us building something beautiful together. I see lazy Sunday mornings, adventures big and small, and a love that deepens with every passing year. I want to grow with you, laugh with you, and face whatever comes our way - together.",
    "\n\nThese {duration} with you have been the best of my life. And you know what? I believe the best is yet to come. I want to create a lifetime of memories with you, support your dreams, and walk this path of life hand in hand.",
  ],
  Playful: [
    "\n\n{duration} together and I'm still not tired of you! That's basically a world record for me. But seriously, I can't wait to see what's next for us. More adventures, more inside jokes, more random dance parties in the kitchen, and definitely more food comas on the couch together. Sign me up for a lifetime of this!",
    "\n\nWe've survived {duration} of each other's weirdness, and honestly, I want to sign up for a lifetime more. I'm talking matching rocking chairs, embarrassing our future grandkids, and still fighting over the last slice of pizza at age 80. You in?",
  ],
};

const closings: Record<LetterTone, string[]> = {
  Poetic: [
    "\n\nUntil the stars forget to shine and the oceans cease to embrace the shore, my love for you will endure. You are my forever, my always, my everything.\n\nWith all the love my soul can hold,\nYours eternally",
    "\n\nMay these words find their way to the deepest chambers of your heart, for that is where they were born. I love you beyond the reach of words, beyond the boundaries of time.\n\nForever and always yours,\nWith undying love",
  ],
  Heartfelt: [
    "\n\nI know this letter can't capture everything I feel, but I hope it gives you a glimpse of how much you mean to me. You are my safe place, my best friend, and the love of my life. Today and every day, I choose you.\n\nWith all my love,\nForever yours",
    "\n\nThank you for loving me the way you do. Thank you for being you. I promise to love you louder, hold you tighter, and appreciate you more every single day.\n\nWith all my heart,\nAlways and forever yours",
  ],
  Playful: [
    "\n\nSo yeah, that's my love letter. Pretty impressive, right? But honestly, no amount of words could ever capture how much I love you. You're stuck with me, and I'm pretty happy about it.\n\nLove you more than pizza (and you KNOW that's a lot),\nYours always",
    "\n\nOkay, I'm done being all mushy now. But just know that under all the jokes and sarcasm, there's a heart that beats entirely for you. You're my person, and I love you ridiculously much.\n\nYour biggest fan (and favorite weirdo),\nWith all my love",
  ],
};

export default function AiLoveLetterGenerator() {
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");
  const [memory, setMemory] = useState("");
  const [qualities, setQualities] = useState("");
  const [letterTone, setLetterTone] = useState<LetterTone>("Heartfelt");
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);
  const [seed, setSeed] = useState(0);

  const generate = () => {
    if (!name.trim()) return;
    const n = name.trim();
    const d = duration.trim() || "our time";
    const m = memory.trim() || "our first moments together";
    const q = qualities.trim() || "your kindness, your smile, your warmth";
    const s = seed;

    const opening = openings[letterTone][s % openings[letterTone].length]
      .replace(/\{name\}/g, n);
    const memSection = memoryTemplates[letterTone][s % memoryTemplates[letterTone].length]
      .replace(/\{memory\}/g, m);
    const qualSection = qualityTemplates[letterTone][s % qualityTemplates[letterTone].length]
      .replace(/\{qualities\}/g, q);
    const futureSection = futureTemplates[letterTone][s % futureTemplates[letterTone].length]
      .replace(/\{duration\}/g, d);
    const closing = closings[letterTone][s % closings[letterTone].length];

    setResult(opening + memSection + qualSection + futureSection + closing);
    setSeed((p) => p + 1);
  };

  const copy = () => {
    navigator.clipboard?.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const print = () => {
    const w = window.open("", "_blank");
    if (w) {
      w.document.write(`<html><head><title>Love Letter</title><style>body{font-family:Georgia,serif;max-width:700px;margin:40px auto;padding:20px;line-height:1.8;color:#333;white-space:pre-line;}</style></head><body>${result}</body></html>`);
      w.document.close();
      w.print();
    }
  };

  const tones: LetterTone[] = ["Poetic", "Heartfelt", "Playful"];

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Recipient Name</label>
        <input className="calc-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Their name..." />
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Relationship Duration</label>
        <input className="calc-input" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="e.g., 2 years, 6 months..." />
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Favorite Memory Together</label>
        <input className="calc-input" value={memory} onChange={(e) => setMemory(e.target.value)} placeholder="e.g., our first date at the park..." />
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">What You Love About Them</label>
        <input className="calc-input" value={qualities} onChange={(e) => setQualities(e.target.value)} placeholder="e.g., your laugh, your kindness, your eyes..." />
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Tone</label>
        <div className="flex gap-2 flex-wrap">
          {tones.map((t) => (
            <button key={t} onClick={() => setLetterTone(t)} className={t === letterTone ? "btn-primary" : "btn-secondary"}>{t}</button>
          ))}
        </div>
      </div>
      <div className="flex gap-3 flex-wrap">
        <button onClick={generate} className="btn-primary">Generate Love Letter</button>
      </div>
      {result && (
        <div className="result-card">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-bold text-gray-600">Your Love Letter</span>
            <div className="flex gap-2">
              <button onClick={copy} className="text-xs text-indigo-600 font-medium hover:underline">{copied ? "Copied!" : "Copy"}</button>
              <button onClick={print} className="text-xs text-indigo-600 font-medium hover:underline">Print</button>
            </div>
          </div>
          <p className="text-gray-800 leading-relaxed whitespace-pre-line">{result}</p>
        </div>
      )}
    </div>
  );
}
