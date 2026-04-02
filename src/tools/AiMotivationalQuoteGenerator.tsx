"use client";
import { useState } from "react";

type Theme = "Success" | "Hustle" | "Love" | "Life" | "Education" | "Health" | "Leadership" | "Friendship";

const quoteTemplates: Record<Theme, string[]> = {
  Success: [
    "Success isn't about the destination, it's about who you become on the journey.",
    "The only limit to your success is the boundary of your own imagination.",
    "Great achievements are born from the courage to begin and the strength to continue.",
    "Success doesn't come to you. You go to it with relentless determination.",
    "Every successful person was once a beginner who refused to give up.",
    "Your success is hidden on the other side of your biggest fear.",
    "The road to success is paved with failures that taught you how to walk.",
    "Success is not final, failure is not fatal. It's the courage to continue that counts.",
    "The difference between ordinary and extraordinary is that little extra effort.",
    "Success is the sum of small efforts repeated day in and day out.",
    "Dream big, start small, but most importantly, start today.",
    "Winners are not people who never fail, but people who never quit.",
    "The only way to guarantee failure is to never try at all.",
    "Behind every great success is a story of persistence and determination.",
    "Success blooms where preparation meets opportunity and action.",
    "The moment you decide to try is the moment success becomes possible.",
    "True success is measured not by what you achieve, but by what you overcome.",
    "The greatest success stories were written by those who refused to accept failure as the ending.",
    "Success isn't given. It's earned through sweat, sacrifice, and sleepless nights.",
    "You don't need to be great to start, but you need to start to be great.",
  ],
  Hustle: [
    "While they sleep, you grind. While they party, you build. That's the difference.",
    "Hustle in silence and let your success make the noise.",
    "The grind doesn't stop because you're tired. It stops when you're done.",
    "Every morning you have two choices: hit snooze or hit your goals.",
    "Work so hard that your idols become your rivals.",
    "Don't wait for opportunity. Create it with your own two hands.",
    "The hustle is real, but so are the results. Keep going.",
    "Your work ethic is your superpower. Use it wisely, use it daily.",
    "Comfortable? Good. Now step outside that comfort zone and get to work.",
    "The only shortcut to success is to outwork everyone in the room.",
    "Rise early, grind late, and watch your dreams materialize.",
    "Nobody cares about your excuses. They only care about your results.",
    "The best time to start was yesterday. The next best time is right now.",
    "Eat like you're broke, grind like you're hungry, live like you're rich in purpose.",
    "While others make plans, you make progress. That's the hustler's way.",
    "If it doesn't challenge you, it doesn't change you. Embrace the grind.",
    "Your future is created by what you do today, not tomorrow.",
    "The difference between a dream and a goal is a deadline and a work ethic.",
    "Don't stop when you're tired. Stop when you're done.",
    "The grind is temporary. The results are permanent. Keep pushing.",
  ],
  Love: [
    "Love is not about finding a perfect person. It's about seeing an imperfect person perfectly.",
    "The greatest thing you'll ever learn is to love and be loved in return.",
    "Love doesn't make the world go round. It makes the ride worthwhile.",
    "In the arithmetic of love, one plus one equals everything.",
    "Love is a language that the deaf can hear and the blind can see.",
    "The best love is the kind that awakens the soul and makes us reach for more.",
    "Love is not about possession. It's about appreciation.",
    "Where there is love, there is life, purpose, and infinite possibility.",
    "True love isn't about being inseparable. It's about being separated and nothing changes.",
    "Love is the bridge between two hearts that distance cannot destroy.",
    "The heart that loves is always young, always brave, always hopeful.",
    "Love is when someone's happiness is essential to your own.",
    "In the story of your life, love is always the most beautiful chapter.",
    "Love doesn't need to be perfect. It just needs to be true.",
    "The best thing to hold onto in life is each other.",
    "Love is not what you say. It's what you do and how you make someone feel.",
    "A single act of love can create a ripple that changes the entire world.",
    "Love is the greatest adventure two souls can ever embark upon.",
    "When you love what you have, you have everything you need.",
    "Love is the light that guides you through the darkest storms of life.",
  ],
  Life: [
    "Life is too short to spend it being anyone other than yourself.",
    "Every day is a new canvas. Paint it with intention, color, and courage.",
    "Life doesn't get easier. You just get stronger and wiser.",
    "The purpose of life is not to be happy. It's to be useful, to make a difference.",
    "Life begins at the end of your comfort zone.",
    "Don't count the days. Make the days count.",
    "Life is 10% what happens to you and 90% how you react to it.",
    "The most beautiful chapters of life are the ones you never planned.",
    "Live life as if everything is rigged in your favor.",
    "Yesterday is history, tomorrow is a mystery, but today is a gift.",
    "Life is short. Smile while you still have teeth.",
    "The only impossible journey is the one you never begin.",
    "Life rewards those who are brave enough to live authentically.",
    "Your life is your message to the world. Make it inspiring.",
    "Difficult roads often lead to beautiful destinations.",
    "Life isn't about waiting for the storm to pass. It's about dancing in the rain.",
    "The quality of your life is determined by the quality of your thoughts.",
    "Life is a collection of moments. Make each one worth remembering.",
    "The biggest adventure you can take is to live the life of your dreams.",
    "Life is what happens when you stop overthinking and start living.",
  ],
  Education: [
    "Education is the most powerful weapon you can use to change the world.",
    "The beautiful thing about learning is that nobody can take it away from you.",
    "An investment in knowledge pays the best interest.",
    "Education is not preparation for life. Education is life itself.",
    "The more you learn, the more you realize how much you don't know.",
    "A mind that is stretched by knowledge never returns to its original size.",
    "Education is the key that unlocks the golden door of freedom.",
    "Learning is a treasure that will follow its owner everywhere.",
    "The roots of education are bitter, but the fruit is sweet.",
    "Knowledge is power, but wisdom is knowing how to use that power.",
    "Education breeds confidence. Confidence breeds hope. Hope breeds peace.",
    "The best teachers are those who show you where to look but don't tell you what to see.",
    "Every expert was once a student. Every master was once a beginner.",
    "Education is not the filling of a pot but the lighting of a fire.",
    "The mind is not a vessel to be filled, but a fire to be kindled.",
    "Study hard, for the well-educated person is the architect of their own future.",
    "Books are the quietest friends, the most patient teachers, and the wisest counselors.",
    "Education is the passport to the future, for tomorrow belongs to those who prepare today.",
    "The desire to learn is the spark that ignites the flame of greatness.",
    "True education is not about memorizing facts. It's about learning how to think.",
  ],
  Health: [
    "Take care of your body. It's the only place you have to live.",
    "Health is not about the weight you lose, but the life you gain.",
    "A healthy mind and body are the foundation of a beautiful life.",
    "Your health is your wealth. Invest in it daily.",
    "The greatest gift you can give yourself is a healthy lifestyle.",
    "Fitness is not about being better than someone else. It's about being better than you used to be.",
    "A healthy outside starts from the inside.",
    "Movement is medicine for the body, mind, and soul.",
    "Your body hears everything your mind says. Stay positive, stay healthy.",
    "Health is a state of body. Wellness is a state of being.",
    "The first wealth is health. Without it, nothing else matters.",
    "Small daily improvements in health lead to stunning long-term results.",
    "Exercise is a celebration of what your body can do, not a punishment for what you ate.",
    "Mental health is just as important as physical health. Nurture both.",
    "Your body is a temple, but only if you treat it as one.",
    "Healthy habits are learned in the same way as unhealthy ones - through practice.",
    "Sleep well, eat well, move well. These three pillars hold up your entire life.",
    "The best project you'll ever work on is you - your health, your mind, your spirit.",
    "Don't wish for a healthier body. Work for it, one step at a time.",
    "A moment of self-care today prevents a lifetime of regret tomorrow.",
  ],
  Leadership: [
    "A true leader doesn't create followers. They create more leaders.",
    "Leadership is not about being in charge. It's about taking care of those in your charge.",
    "The best leaders are the ones who lead by example, not by command.",
    "Great leaders don't set out to be leaders. They set out to make a difference.",
    "Leadership is the art of giving people a platform to spread their wings.",
    "The strength of a leader is measured by the growth of those they inspire.",
    "Lead with empathy, decide with wisdom, and act with courage.",
    "A leader's greatest weapon is not authority, but authenticity.",
    "The mark of a great leader is not perfection, but the ability to rise after every fall.",
    "True leadership is being bold enough to have a vision and humble enough to serve.",
    "Leaders don't create followers. They create conditions for greatness to emerge.",
    "The best leaders listen twice as much as they speak.",
    "Leadership is not a position. It's a mindset and a commitment to serve.",
    "A good leader takes a little more than their share of blame and a little less than their share of credit.",
    "Courage is the foundation of leadership. Without it, nothing else stands.",
    "The difference between a boss and a leader is that a leader walks beside you.",
    "Leadership is the capacity to translate vision into reality.",
    "The greatest leaders are those who empower others to become their best selves.",
    "Lead from the heart, and the mind will follow.",
    "A leader sees greatness in others before they see it in themselves.",
  ],
  Friendship: [
    "A true friend is someone who sees the pain in your eyes while everyone else believes your smile.",
    "Friendship isn't about who you've known the longest. It's about who walked in and never left.",
    "Good friends are like stars. You don't always see them, but you know they're always there.",
    "A real friend is one who walks in when the rest of the world walks out.",
    "The greatest gift in life is friendship, and I have received it in abundance.",
    "Friends are the family you choose for yourself.",
    "True friendship is a plant of slow growth that must weather the storms of adversity.",
    "A friend is someone who gives you total freedom to be yourself.",
    "The most beautiful discovery true friends make is that they can grow separately without growing apart.",
    "Friendship is born at that moment when one person says to another: 'You too? I thought I was the only one.'",
    "A single rose can be my garden. A single friend can be my world.",
    "In the cookie of life, friends are the chocolate chips.",
    "True friends don't judge each other. They judge other people together.",
    "Friends are the therapists you can drink with and the family you can cry with.",
    "A loyal friend laughs at your jokes when they're not so good and sympathizes when your problems aren't so bad.",
    "The language of friendship is not words, but meanings felt and understood.",
    "Friendship is the only cement that will ever hold the world together.",
    "A true friend reaches for your hand and touches your heart.",
    "Some people arrive and make such a beautiful impact on your life, you can barely remember what life was like without them.",
    "The best mirror in the world is an old friend who has seen you at your worst and loves you anyway.",
  ],
};

export default function AiMotivationalQuoteGenerator() {
  const [theme, setTheme] = useState<Theme>("Success");
  const [results, setResults] = useState<string[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [seed, setSeed] = useState(0);

  const generate = () => {
    const pool = quoteTemplates[theme];
    const shuffled = [...pool].sort((a, b) => {
      const ha = Math.sin(seed * 9301 + a.length) * 10000;
      const hb = Math.sin(seed * 9301 + b.length) * 10000;
      return ha - hb;
    });
    setResults(shuffled.slice(0, 10));
    setSeed((p) => p + 1);
  };

  const copy = (idx: number) => {
    navigator.clipboard?.writeText(results[idx]);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const copyForWhatsapp = (idx: number) => {
    const text = `*${results[idx]}*\n\n_- Motivational Quote_`;
    navigator.clipboard?.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const themes: Theme[] = ["Success", "Hustle", "Love", "Life", "Education", "Health", "Leadership", "Friendship"];

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Theme</label>
        <div className="flex gap-2 flex-wrap">
          {themes.map((t) => (
            <button key={t} onClick={() => setTheme(t)} className={t === theme ? "btn-primary" : "btn-secondary"}>{t}</button>
          ))}
        </div>
      </div>
      <div className="flex gap-3 flex-wrap">
        <button onClick={generate} className="btn-primary">Generate Quotes</button>
        {results.length > 0 && <button onClick={generate} className="btn-secondary">Regenerate</button>}
      </div>
      {results.length > 0 && (
        <div className="space-y-3">
          {results.map((q, i) => (
            <div key={i} className="result-card">
              <div className="flex justify-between items-start gap-3">
                <p className="text-gray-800 leading-relaxed text-lg italic">&ldquo;{q}&rdquo;</p>
                <div className="flex flex-col gap-1 shrink-0">
                  <button onClick={() => copy(i)} className="text-xs text-indigo-600 font-medium hover:underline">{copiedIdx === i ? "Copied!" : "Copy"}</button>
                  <button onClick={() => copyForWhatsapp(i)} className="text-xs text-green-600 font-medium hover:underline">WhatsApp</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
