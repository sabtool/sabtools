"use client";
import { useState } from "react";

type Difficulty = "Mild" | "Medium" | "Spicy";

const truths: Record<Difficulty, string[]> = {
  Mild: [
    "What is your favourite food?","What is the last lie you told?","What is your most embarrassing moment?",
    "Who was your first crush?","What is the weirdest dream you have had?","What is the most childish thing you still do?",
    "What is a skill you wish you had?","What is the most boring movie you have watched?","When did you last cry?",
    "What is your guilty pleasure song?","What is your biggest pet peeve?","What is the silliest thing you are afraid of?",
    "What is the worst gift you have received?","What is your hidden talent?","What is the longest you have gone without bathing?",
    "Who do you secretly admire?","What is your most used emoji?","What is the best compliment you ever received?",
    "What is the worst food you have eaten?","What is the most embarrassing thing in your phone?",
  ],
  Medium: [
    "What is the biggest secret you have kept from your parents?","Who in this group do you trust the least?",
    "What is the most awkward date you have been on?","Have you ever cheated on a test?","What is the meanest thing you have said?",
    "What is your most controversial opinion?","Have you ever stalked someone on social media?","What is your biggest regret?",
    "What is the most embarrassing thing you have done in public?","Have you ever pretended to be sick to skip work/school?",
    "What is the worst rumour you have spread?","Have you ever read someone else is messages?","What is your most expensive impulse buy?",
    "Have you ever lied to get out of plans?","What is the most trouble you have been in?","What is your guilty pleasure TV show?",
    "Have you ever been caught doing something you should not?","What is the most desperate thing you have done for attention?",
    "What is the biggest misconception about you?","Have you ever regifted a present?",
  ],
  Spicy: [
    "What is the most embarrassing thing you have searched online?","What is the biggest lie you have told a partner?",
    "Have you ever been jealous of a friend? Why?","What is your most unpopular opinion about relationships?",
    "What is the craziest thing you have done for love?","What is the most embarrassing text you have sent to the wrong person?",
    "If you could date anyone in this room, who would it be?","What is the worst thing about your best friend?",
    "What secret are you keeping right now?","What is the most daring thing on your bucket list?",
    "What is your biggest insecurity?","What is the most romantic thing you have fantasized about?",
    "Have you ever had a crush on a friend is partner?","What is your most embarrassing nickname?",
    "What is the worst advice you have followed?","What would you do if you were invisible for a day?",
    "What is the biggest risk you have ever taken?","What is the most rebellious thing you have done?",
    "Describe your most awkward encounter.","What is something you would never tell your parents?",
  ],
};

const dares: Record<Difficulty, string[]> = {
  Mild: [
    "Do your best impression of a Bollywood actor","Sing the chorus of your favourite song",
    "Talk in an accent for the next 3 rounds","Do 10 pushups right now","Let someone draw on your hand with a pen",
    "Say the alphabet backwards","Make up a poem in 30 seconds","Do a funny dance for 15 seconds",
    "Speak in a baby voice for 2 minutes","Try to lick your elbow","Do your best animal impression",
    "Walk like a penguin across the room","Hold your breath for 30 seconds","Do the moonwalk",
    "Say tongue twister 5 times fast","Make a funny face and let someone take a photo",
    "Pretend to be a news anchor for 1 minute","Do the chicken dance","Hop on one foot for 30 seconds",
    "Tell a joke and make everyone laugh",
  ],
  Medium: [
    "Let the group go through your last 10 photos","Post something embarrassing on your Instagram story",
    "Do a TikTok dance in front of everyone","Text your crush 'hi' right now",
    "Eat a spoonful of hot sauce","Let someone write something on your forehead",
    "Call a random contact and sing happy birthday","Speak only in Hindi/English (opposite of usual) for 5 mins",
    "Do 20 jumping jacks","Let someone style your hair however they want",
    "Send a weird selfie to your last WhatsApp contact","Act like a monkey for 1 minute",
    "Try to juggle 3 items","Let the group choose your profile picture for a day",
    "Mimic another player until someone guesses who","Swap an item of clothing with another player",
    "Do a plank for 1 minute","Act out a Bollywood scene dramatically",
    "Talk without closing your mouth for 1 minute","Walk on your knees for the next 3 rounds",
  ],
  Spicy: [
    "Let the group read your last 5 WhatsApp messages","Call your ex and say you miss them (just kidding!)",
    "Let someone post on your social media","Reveal the last thing you googled on your phone",
    "Do a dramatic Bollywood proposal to a random object","Show the group your screen time report",
    "Let the group compose and send a text from your phone","Do an embarrassing dance and post it on social media",
    "Confess something you have never told anyone here","Let someone go through your search history for 30 seconds",
    "Act like you are in a soap opera for 2 minutes","Prank call a friend and keep a straight face",
    "Show the most embarrassing photo on your phone","Give your phone to someone for 1 minute to do whatever",
    "Sing karaoke in front of everyone with no music","Recreate your most embarrassing moment",
    "Let the group decide your WhatsApp status for 24 hours","Talk in slow motion for 3 minutes",
    "Narrate everything you do for the next 5 minutes","Let someone create a dating profile bio for you",
  ],
};

export default function TruthOrDare() {
  const [difficulty, setDifficulty] = useState<Difficulty>("Mild");
  const [current, setCurrent] = useState<{ type: "truth" | "dare"; text: string } | null>(null);
  const [shownTruths, setShownTruths] = useState<Set<string>>(new Set());
  const [shownDares, setShownDares] = useState<Set<string>>(new Set());

  const pick = (type: "truth" | "dare") => {
    const pool = type === "truth" ? truths[difficulty] : dares[difficulty];
    const shown = type === "truth" ? shownTruths : shownDares;
    const available = pool.filter((t) => !shown.has(t));
    if (available.length === 0) {
      if (type === "truth") setShownTruths(new Set());
      else setShownDares(new Set());
      const rand = pool[Math.floor(Math.random() * pool.length)];
      setCurrent({ type, text: rand });
      return;
    }
    const rand = available[Math.floor(Math.random() * available.length)];
    if (type === "truth") setShownTruths((s) => new Set(s).add(rand));
    else setShownDares((s) => new Set(s).add(rand));
    setCurrent({ type, text: rand });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Difficulty Level</label>
        <div className="flex gap-2">
          {(["Mild", "Medium", "Spicy"] as Difficulty[]).map((d) => (
            <button
              key={d}
              onClick={() => { setDifficulty(d); setCurrent(null); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                difficulty === d
                  ? d === "Mild" ? "bg-green-500 text-white" : d === "Medium" ? "bg-yellow-500 text-white" : "bg-red-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => pick("truth")}
          className="p-6 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-center hover:opacity-90 transition-opacity"
        >
          <span className="text-3xl block mb-2">{"\uD83E\uDD14"}</span>
          <span className="text-xl font-bold">Truth</span>
        </button>
        <button
          onClick={() => pick("dare")}
          className="p-6 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 text-white text-center hover:opacity-90 transition-opacity"
        >
          <span className="text-3xl block mb-2">{"\uD83D\uDD25"}</span>
          <span className="text-xl font-bold">Dare</span>
        </button>
      </div>

      {current && (
        <div className={`result-card border-l-4 ${current.type === "truth" ? "border-blue-400" : "border-red-400"}`}>
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-1 rounded text-xs font-bold text-white ${current.type === "truth" ? "bg-blue-500" : "bg-red-500"}`}>
              {current.type.toUpperCase()}
            </span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              difficulty === "Mild" ? "bg-green-100 text-green-700" : difficulty === "Medium" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
            }`}>
              {difficulty}
            </span>
          </div>
          <p className="text-lg font-medium text-gray-800">{current.text}</p>
        </div>
      )}

      <div className="text-xs text-gray-400 text-center">
        Truths shown: {shownTruths.size}/{truths[difficulty].length} | Dares shown: {shownDares.size}/{dares[difficulty].length}
      </div>
    </div>
  );
}
