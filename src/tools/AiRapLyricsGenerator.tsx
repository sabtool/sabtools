"use client";
import { useState } from "react";

type Mood = "Hype" | "Chill" | "Emotional" | "Party";
type RapStyle = "Motivational" | "Street" | "Bollywood";

const rhymePairs: Record<Mood, string[][]> = {
  Hype: [
    ["rise", "skies"], ["fire", "higher"], ["fame", "game"], ["grind", "mind"], ["beast", "feast"],
    ["king", "ring"], ["fly", "high"], ["gold", "bold"], ["throne", "own"], ["fight", "light"],
    ["peak", "speak"], ["chase", "race"], ["blaze", "days"], ["real", "deal"], ["strong", "song"],
  ],
  Chill: [
    ["breeze", "ease"], ["flow", "glow"], ["night", "right"], ["vibe", "tribe"], ["soul", "whole"],
    ["peace", "release"], ["dream", "stream"], ["chill", "still"], ["wave", "save"], ["sky", "fly"],
    ["rain", "lane"], ["moon", "tune"], ["free", "me"], ["calm", "psalm"], ["zone", "tone"],
  ],
  Emotional: [
    ["heart", "start"], ["pain", "rain"], ["tears", "years"], ["soul", "whole"], ["feel", "real"],
    ["cry", "why"], ["gone", "dawn"], ["miss", "bliss"], ["deep", "sleep"], ["break", "ache"],
    ["scars", "stars"], ["lost", "cost"], ["heal", "steal"], ["past", "last"], ["alone", "known"],
  ],
  Party: [
    ["night", "right"], ["dance", "chance"], ["beat", "heat"], ["move", "groove"], ["bass", "place"],
    ["loud", "crowd"], ["fun", "done"], ["wild", "styled"], ["shake", "break"], ["floor", "more"],
    ["lit", "hit"], ["drop", "stop"], ["turn", "burn"], ["sway", "day"], ["bounce", "announce"],
  ],
};

const verseStarters: Record<RapStyle, Record<Mood, string[]>> = {
  Motivational: {
    Hype: [
      "I came from the bottom, now I'm {rhyme1}\nEvery doubter sleeping while I'm touching the {rhyme2}\nThey said I couldn't do it, but they forgot my name\nNow the whole world watching, I'm winning this {rhyme2b}\n\nGrinding every day, never stopping the {rhyme3}\nGot a vision in my head, yeah it's one of a kind\nBroke through every wall, set my spirit on {rhyme4}\nEvery step I take is just climbing {rhyme4b}",
      "Started with a dream and a whole lot of {rhyme1}\nNow I'm burning bright like a ball of {rhyme1b}\nEvery obstacle was fuel for the {rhyme2}\nNow I'm on a streak no one can {rhyme2b}\n\nLook me in my eyes, see the hunger in my {rhyme3}\nI was built for this, yeah it's all by design\nFrom the struggle to the {rhyme4}, watch me take the throne\nEvery victory sweet because I earned it on my {rhyme4b}",
    ],
    Chill: [
      "Take a breath, let the good vibes {rhyme1}\nGot the world in my hands, moving with the {rhyme1b}\nEvery day's a blessing, feeling so {rhyme2}\nWalking my own path, just keeping it {rhyme2b}\n\nLetting go of stress, riding every {rhyme3}\nGot the lessons from the past, that's what I {rhyme3b}\nStaring at the stars, feeling free {rhyme4}\nThis is my moment, it's all about {rhyme4b}",
      "Slow it down, feel the rhythm of the {rhyme1}\nEasy does it, let the good times {rhyme1b}\nPeace of mind is worth more than {rhyme2}\nGot my energy right, that's the real {rhyme2b}\n\nVibing with the {rhyme3}, let the music play\nGratitude is flowing every single {rhyme3b}\nLiving in the moment, feeling {rhyme4}\nSitting back and watching, everything's in {rhyme4b}",
    ],
    Emotional: [
      "Started with a {rhyme1}, didn't know the way\nNow I'm standing tall at the break of {rhyme1b}\nCarried every {rhyme2} like a weight on my back\nTurned my tears to diamonds, that's a {rhyme2b}\n\nEvery scar I carry tells a {rhyme3}\nEvery night I fell, I rose up in the {rhyme3b}\nPain became my teacher, showed me what is {rhyme4}\nNow my spirit shines, nothing can I {rhyme4b}",
      "They don't know the {rhyme1} that I've been through\nSleepless nights and battles, more than just a {rhyme1b}\nBut I kept on pushing through the {rhyme2}\nWiped away the tears and felt the {rhyme2b}\n\nLooking in the mirror, finally see the {rhyme3}\nEvery struggle shaped the person that I {rhyme3b}\nFrom the ashes rising, now I start to {rhyme4}\nBroken but not beaten, heart begins to {rhyme4b}",
    ],
    Party: [
      "Everybody move, feel the beat {rhyme1}\nWe came to celebrate, yeah it's gonna be {rhyme1b}\nHands up in the air, give it one more {rhyme2}\nThis is our moment, let's get up and {rhyme2b}\n\nDJ turn it {rhyme3}, let the speakers blow\nWe're the main event, everybody {rhyme3b}\nLife is good, no reason to {rhyme4}\nKeep the energy up, never gonna {rhyme4b}",
      "Step up on the {rhyme1}, let the music play\nWe've been working hard, now it's time to {rhyme1b}\nFeel the bass drop, shake it all {rhyme2}\nDance like nobody's watching, lose the {rhyme2b}\n\nLights are flashing, mood is getting {rhyme3}\nEvery single person feeling so {rhyme3b}\nRaise your glass up, make a {rhyme4}\nWe're just getting started, watch us {rhyme4b}",
    ],
  },
  Street: {
    Hype: [
      "Real ones know the struggle, where I come from is {rhyme1}\nBut I kept it moving, never stopping for the {rhyme1b}\nStreets taught me lessons that the books could never {rhyme2}\nNow I'm standing tall, every hater gonna {rhyme2b}\n\nRep my block forever, that's where I was {rhyme3}\nFrom the concrete jungle, now the world's my {rhyme3b}\nStacking wins like bricks, building up the {rhyme4}\nEvery day I'm out here showing I'm for {rhyme4b}",
      "Coming from the bottom where the lights are {rhyme1}\nBut I had a vision and a fire in my {rhyme1b}\nEvery corner taught me something new each {rhyme2}\nSurvived the concrete, now I own the {rhyme2b}\n\nLoyalty is everything, keep my circle {rhyme3}\nMoney comes and goes but respect is {rhyme3b}\nStay true to the code, never switch the {rhyme4}\nReal recognize real, that's my only {rhyme4b}",
    ],
    Chill: [
      "Cruising through the city, windows down, feeling {rhyme1}\nGot my people with me, everything is {rhyme1b}\nNo drama, no stress, just the open {rhyme2}\nLiving life my way, rolling down the {rhyme2b}\n\nSunset on the block, golden hour {rhyme3}\nKicking back with family, that's the real {rhyme3b}\nDon't need all the flash, keep it humble, keep it {rhyme4}\nGrateful for the journey, standing in my {rhyme4b}",
      "Late night drives, the city lights all {rhyme1}\nMusic in my ears, everything just {rhyme1b}\nTaking it easy, no need to {rhyme2}\nGot my mind right, life is moving {rhyme2b}\n\nSipping something cold, watching clouds go {rhyme3}\nReal talk with my crew, that's the better {rhyme3b}\nSimple life the wave, feeling so at {rhyme4}\nThis the life I chose, and I'm in my {rhyme4b}",
    ],
    Emotional: [
      "Grew up on these streets, seen the best and {rhyme1}\nLost some real ones, scars upon my {rhyme1b}\nEvery day a battle, but I kept the {rhyme2}\nHeld it down for mine through the {rhyme2b}\n\nMama worked two jobs, never let us {rhyme3}\nThat's the kinda love money couldn't {rhyme3b}\nNow I'm doing this for everyone I {rhyme4}\nPutting on for those who kept my spirit {rhyme4b}",
      "These streets got stories that'll make you {rhyme1}\nEvery broken window whispers reasons {rhyme1b}\nBut from the struggle came a strength so {rhyme2}\nDiamonds form from pressure, and we're built of {rhyme2b}\n\nPour one out for those who didn't make the {rhyme3}\nEvery life that's lost is one we couldn't {rhyme3b}\nBut we carry on, their memory lives {rhyme4}\nIn our hearts forever, that's the {rhyme4b}",
    ],
    Party: [
      "Pull up to the spot, yeah we shutting it {rhyme1}\nEvery head is turning, can't ignore the {rhyme1b}\nMoney well spent, tonight we go {rhyme2}\nVIP section, yeah we run the {rhyme2b}\n\nPop the bottles, let the good times {rhyme3}\nWe came from nothing, now we run the {rhyme3b}\nCelebrate the wins, forget the {rhyme4}\nTonight we living like there is no {rhyme4b}",
      "We in the building, and the energy is {rhyme1}\nEverybody feeling something {rhyme1b}\nFrom the block to the club, we {rhyme2}\nNobody can match us when we {rhyme2b}\n\nSpending time with real ones, that's the {rhyme3}\nGood vibes only, never gonna {rhyme3b}\nRaise your cups up, toast to the {rhyme4}\nThis is what it feels like at the {rhyme4b}",
    ],
  },
  Bollywood: {
    Hype: [
      "Sapno se shuru kiya, ab duniya hai mere {rhyme1}\nHar mushkil mein khada, phir bhi chadha {rhyme1b}\nStruggle ki story hai, par dil hai {rhyme2}\nHar beat pe nachta, ye hai mera {rhyme2b}\n\nIndia se global, dekho kitna {rhyme3}\nHar stage pe fire, ruk nahi sakta {rhyme3b}\nBollywood ki dharkan, desi swag with {rhyme4}\nManzil door nahi, bas thoda aur {rhyme4b}",
      "Desi boy with a dream and a fire in the {rhyme1}\nFrom Mumbai to the world, we rising to the {rhyme1b}\nNacho bc, this is our {rhyme2}\nHindustan ki power, feel the {rhyme2b}\n\nSheraton se seedha airport, flying {rhyme3}\nJugaad is our middle name, always {rhyme3b}\nChai pe charcha turned into {rhyme4}\nApna time aayega, always {rhyme4b}",
    ],
    Chill: [
      "Shaam ki hawayein, chai ki {rhyme1}\nZindagi ke lamhe, chill sa {rhyme1b}\nApni dhun mein rehna, koi tension {rhyme2}\nDesi vibes flowing, that's the {rhyme2b}\n\nPurani yaadein aur naye {rhyme3}\nHar pal mein khushi, sab kuch {rhyme3b}\nAraam se baithke, gaane sun {rhyme4}\nYe wala vibe hai ekdum {rhyme4b}",
      "Mumbai ki baarish, Delhi ki {rhyme1}\nChilling with the homies, life ka {rhyme1b}\nNo drama zone, bus good vibes {rhyme2}\nApni duniya mein, feeling {rhyme2b}\n\nOld Monk aur puraane {rhyme3}\nZindagi mein chahiye bas yahi {rhyme3b}\nSlow motion mein chalte, no {rhyme4}\nDesi chill mode on, feeling {rhyme4b}",
    ],
    Emotional: [
      "Dil ki baat sunlo, aankhon mein hai {rhyme1}\nZindagi ne sikhayi har ek {rhyme1b}\nGhar se door aaye, sapno ke {rhyme2}\nHar raat sochta, woh purane {rhyme2b}\n\nMaa ki duayein saath, baaki sab {rhyme3}\nDard bhi sahaa, phir bhi nahi {rhyme3b}\nApno ke bina zindagi lagti {rhyme4}\nPar unki yaad mein dil rehta {rhyme4b}",
      "Sapne the bade, raasta tha {rhyme1}\nHar mod pe akela, dil tha {rhyme1b}\nGhar ki yaad aati hai raat ko {rhyme2}\nMaa ka haath sar pe, woh {rhyme2b}\n\nStruggle real hai, par give up {rhyme3}\nApno ke liye karte hain yeh {rhyme3b}\nAnkhon mein sapne, dil mein {rhyme4}\nEk din zaroor ayega mera {rhyme4b}",
    ],
    Party: [
      "DJ bajao gaana, let the dhol {rhyme1}\nDesi party mein sab feeling {rhyme1b}\nNachle mere yaar, bhool ja {rhyme2}\nAaj ki raat hai, full on {rhyme2b}\n\nBhangra pa le, put your hands {rhyme3}\nDesi boys and girls, take a {rhyme3b}\nSeeti maar ke, let the crowd go {rhyme4}\nAaj party karenge, bol na {rhyme4b}",
      "Mundeya to bach ke rahin, we in the {rhyme1}\nDesi beats thumping, everybody {rhyme1b}\nSheesha bar to dance floor, we {rhyme2}\nPataka style, sab log {rhyme2b}\n\nThumka laga ke, naach {rhyme3}\nPaisa vasool night, making {rhyme3b}\nDJ wale babu, mera gaana {rhyme4}\nDesi party mein sabka hai {rhyme4b}",
    ],
  },
};

const chorusTemplates: Record<RapStyle, Record<Mood, string[]>> = {
  Motivational: {
    Hype: [
      "[Chorus]\nWe rise, we shine, we never fall\nStanding on top, yeah we want it all\nGrind don't stop, till we reach the peak\nActions louder than the words we speak!",
      "[Chorus]\nCan't stop, won't stop, we on a mission\nEvery step closer to the vision\nRise up, stand tall, break every wall\nWe were born to fly, we'll never crawl!",
    ],
    Chill: [
      "[Chorus]\nJust breathe, let go, feel the flow\nGood vibes only, let your spirit glow\nNo rush, no stress, take it slow\nLife's a journey, enjoy the show",
      "[Chorus]\nEasy does it, one day at a time\nPeace of mind is the greatest find\nLet the music heal your soul\nRelax and let the good times roll",
    ],
    Emotional: [
      "[Chorus]\nThrough the tears, through the pain\nSunshine always follows rain\nEvery scar tells a story\nFrom the darkness comes the glory",
      "[Chorus]\nI've been broken, I've been low\nBut from the ashes, watch me grow\nEvery tear watered the seed\nOf the person I was meant to be",
    ],
    Party: [
      "[Chorus]\nLet's go! Hands up! Feel the beat!\nEverybody moving to the rhythm of the street!\nTonight we celebrate, no time to waste\nLive life loud, let's pick up the pace!",
      "[Chorus]\nParty people, make some noise!\nGirls and boys, let's bring the joys!\nDance all night, until the dawn\nThe party never stops, keep going on!",
    ],
  },
  Street: {
    Hype: [
      "[Chorus]\nFrom the streets to the stage, we made it real\nEvery bar I spit, every word I feel\nReppin' where I'm from till the very end\nReal recognize real, that's the code, my friend",
      "[Chorus]\nHustle hard, stack tall, that's the way\nSurvive the night, conquer the day\nStreet smart wisdom, can't be bought\nEvery lesson learned, every battle fought",
    ],
    Chill: [
      "[Chorus]\nSlow ride through the city, feeling right\nGood people, good music, good night\nNo beef, no drama, just peace\nStreet life vibe, complete release",
      "[Chorus]\nPosted up, watching life go by\nGrateful for the ground beneath the sky\nReal ones know the simple things\nMean more than what the money brings",
    ],
    Emotional: [
      "[Chorus]\nThese streets raised me, made me strong\nCarried the weight for way too long\nBut I stand tall for those who fell\nTheir stories live, through mine I'll tell",
      "[Chorus]\nPour it out, let the feelings flow\nSome things the world will never know\nBut we carry on, heads held high\nFor every soul beneath the sky",
    ],
    Party: [
      "[Chorus]\nWe in the building, and it's going down\nBaddest crew reppin' every part of town\nPoppin' bottles, living for tonight\nFrom the streets to the club, we shine bright",
      "[Chorus]\nPull up, show up, shut it down\nHottest party in the whole damn town\nMoney talks, but tonight it sings\nCelebrate the hustle, feel the bling",
    ],
  },
  Bollywood: {
    Hype: [
      "[Chorus]\nApna time aayega, dekh le duniya\nDesi boy ka swag hai asli\nHar beat pe fire, har line mein jazbaat\nHindustan ki shaan, yeh hai humari baat!",
      "[Chorus]\nBollywood meets hip-hop, feel the heat\nDesi rhythm making everybody move their feet\nFrom the streets of Mumbai to the global stage\nThis is our era, this is our age!",
    ],
    Chill: [
      "[Chorus]\nChai aur sunset, dil ka sukoon\nApni duniya mein, apna hi tune\nDesi vibes flowing, ekdum chill\nZindagi ka maza, time standing still",
      "[Chorus]\nSlow jam desi style, feel the groove\nNothing to prove, just in the mood\nPeaceful evening, stars above\nThis is what we call desi love",
    ],
    Emotional: [
      "[Chorus]\nDil se dil tak, baat pahunche\nAankhon mein sapne, dard bhi gunche\nZindagi ki raahon mein, akele chale\nPar himmat se, har mushkil tale",
      "[Chorus]\nMaa ki duaayein, dil ka dard\nSapno ki duniya, zindagi ka pard\nHar aansoo mein ek kahani hai\nHar dard ke peeche ek nishani hai",
    ],
    Party: [
      "[Chorus]\nNachle nachle, DJ baja de\nDesi party mein sabko nacha de\nBhangra, garba, bollywood beat\nPaisa vasool, can't take the heat!",
      "[Chorus]\nAaj ki raat, party karenge\nSaari tension ko door karenge\nDJ wale babu, volume high\nDesi style mein, touch the sky!",
    ],
  },
};

function pickRandom<T>(arr: T[], seed: number): T {
  return arr[Math.abs(seed) % arr.length];
}

function fillRhymes(template: string, mood: Mood, seed: number): string {
  const pairs = rhymePairs[mood];
  let result = template;
  let pairIdx = seed;
  const used = new Set<number>();
  const placeholders = result.match(/\{rhyme\d+b?\}/g) || [];
  const pairNeeded = new Set<string>();
  placeholders.forEach((p) => {
    const base = p.replace("b}", "}").replace(/\{rhyme(\d+)\}/, "$1");
    pairNeeded.add(base);
  });
  pairNeeded.forEach((base) => {
    let idx = (pairIdx++) % pairs.length;
    while (used.has(idx) && used.size < pairs.length) idx = (idx + 1) % pairs.length;
    used.add(idx);
    const pair = pairs[idx];
    result = result.replace(new RegExp(`\\{rhyme${base}\\}`, "g"), pair[0]);
    result = result.replace(new RegExp(`\\{rhyme${base}b\\}`, "g"), pair[1]);
  });
  return result;
}

export default function AiRapLyricsGenerator() {
  const [topic, setTopic] = useState("");
  const [mood, setMood] = useState<Mood>("Hype");
  const [style, setStyle] = useState<RapStyle>("Motivational");
  const [hindiMix, setHindiMix] = useState(false);
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);
  const [seed, setSeed] = useState(0);

  const generate = () => {
    const s = seed;
    const effectiveStyle = hindiMix ? "Bollywood" : style;
    const verses = verseStarters[effectiveStyle][mood];
    const choruses = chorusTemplates[effectiveStyle][mood];

    const verse1 = fillRhymes(pickRandom(verses, s), mood, s);
    const verse2 = fillRhymes(pickRandom(verses, s + 7), mood, s + 5);
    const chorus = pickRandom(choruses, s + 3);

    const topicLabel = topic.trim() ? `Topic: ${topic.trim()}\n` : "";
    const full = `${topicLabel}[Verse 1]\n${verse1}\n\n${chorus}\n\n[Verse 2]\n${verse2}\n\n${chorus}`;
    setResult(full);
    setSeed((p) => p + 1);
  };

  const copy = () => {
    navigator.clipboard?.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const moods: Mood[] = ["Hype", "Chill", "Emotional", "Party"];
  const styles: RapStyle[] = ["Motivational", "Street", "Bollywood"];

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Topic / Theme</label>
        <input className="calc-input" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., hustle, love, success..." />
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Mood</label>
        <div className="flex gap-2 flex-wrap">
          {moods.map((m) => (
            <button key={m} onClick={() => setMood(m)} className={m === mood ? "btn-primary" : "btn-secondary"}>{m}</button>
          ))}
        </div>
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Style</label>
        <div className="flex gap-2 flex-wrap">
          {styles.map((s) => (
            <button key={s} onClick={() => { setStyle(s); if (s === "Bollywood") setHindiMix(true); else setHindiMix(false); }} className={s === style ? "btn-primary" : "btn-secondary"}>{s}</button>
          ))}
        </div>
      </div>
      {style !== "Bollywood" && (
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={hindiMix} onChange={(e) => setHindiMix(e.target.checked)} />
          Hindi-English Mix
        </label>
      )}
      <div className="flex gap-3 flex-wrap">
        <button onClick={generate} className="btn-primary">Generate Rap Lyrics</button>
        {result && <button onClick={generate} className="btn-secondary">Regenerate</button>}
      </div>
      {result && (
        <div className="result-card">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-bold text-gray-600">Generated Lyrics</span>
            <button onClick={copy} className="text-xs text-indigo-600 font-medium hover:underline">{copied ? "Copied!" : "Copy"}</button>
          </div>
          <pre className="text-gray-800 leading-relaxed whitespace-pre-wrap font-sans">{result}</pre>
        </div>
      )}
    </div>
  );
}
