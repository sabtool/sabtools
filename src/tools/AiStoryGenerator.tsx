"use client";
import { useState } from "react";

type Genre = "Adventure" | "Romance" | "Mystery" | "SciFi" | "Horror" | "Comedy";

const storyTemplates: Record<Genre, { openings: string[]; middles: string[]; twists: string[]; endings: string[] }> = {
  Adventure: {
    openings: [
      "The map was old, torn at the edges, but {name} could still make out the path leading deep into {setting}. It had been years since anyone dared venture this far.",
      "{name} stood at the edge of {setting}, heart pounding with a mix of fear and excitement. The journey ahead would test every ounce of courage.",
      "When {name} discovered the ancient compass hidden in the attic, something about {setting} began calling like a distant drumbeat.",
    ],
    middles: [
      "The terrain grew treacherous. Every step through {setting} brought new challenges — jagged rocks, rushing rivers, and paths that seemed to shift and change. But {name} pressed on, driven by the theme of {theme}. The locals had warned about this place, speaking in hushed tones about what lay beyond the ridge.",
      "Days turned into weeks as {name} navigated the heart of {setting}. Supplies ran low, but the discovery of an ancient temple renewed hope. Inside, murals depicted a story of {theme}, as if the walls themselves were guiding the way forward.",
    ],
    twists: [
      "Then came the revelation that changed everything — the treasure {name} sought was not gold or jewels, but knowledge. The ancient civilization had left behind a message about {theme} that could transform the modern world.",
      "Just when escape seemed certain, the ground trembled. {name} realized {setting} itself was alive, and the only way out was to understand {theme} — the very principle that governed this extraordinary place.",
    ],
    endings: [
      "{name} emerged from {setting} transformed. The adventure had taught a profound lesson about {theme} that no classroom ever could. Looking back one final time, {name} smiled — knowing that the greatest journeys change us from within.",
      "As the sun set over {setting}, {name} knew this was just the beginning. The world was vast, full of mysteries waiting to be uncovered. And now, armed with the wisdom of {theme}, {name} was ready for whatever came next.",
    ],
  },
  Romance: {
    openings: [
      "It was in the quiet corner of {setting} that {name} first noticed them — a stranger with kind eyes and a laugh that seemed to light up the room.",
      "{name} had given up on love. Life in {setting} was busy enough without the complications of romance. But fate, as it often does, had other plans.",
      "The rain came suddenly in {setting}, and {name} ducked under the nearest awning — right next to the person who would change everything.",
    ],
    middles: [
      "What started as chance meetings became deliberate ones. {name} found every excuse to visit {setting}, each encounter revealing a new layer of connection. They talked about {theme} for hours, discovering that their views aligned in ways that felt almost destined.",
      "But love is rarely simple. The pull of {theme} created complications neither had anticipated. {name} wrestled with feelings that grew stronger each day, while the reality of their situation in {setting} demanded difficult choices.",
    ],
    twists: [
      "The letter arrived on a Tuesday. {name} read it three times, hands trembling. Their beloved was leaving {setting} — not by choice, but by circumstance. The theme of {theme} had never felt more real or more urgent.",
      "A secret came to light that threatened to unravel everything. But {name} realized that {theme} was not about perfection — it was about choosing someone, flaws and all, every single day.",
    ],
    endings: [
      "Standing together in {setting}, with the world stretching out before them, {name} understood that {theme} was not a destination but a journey. And this journey, they would take together.",
      "Years later, {name} would return to that same corner of {setting} and smile. What began as an ordinary day had become the first chapter of an extraordinary love story built on {theme}.",
    ],
  },
  Mystery: {
    openings: [
      "The case file landed on {name}'s desk at 3 AM. Something strange was happening in {setting}, and nobody could explain the pattern.",
      "{name} knew {setting} like the back of their hand. So when things started going missing — and then the first body was found — the mystery cut personal.",
      "Everyone in {setting} had a secret. But {name} was about to discover one that would shake the foundations of everything believed to be true.",
    ],
    middles: [
      "The clues led {name} deeper into the labyrinth of {setting}. Each witness had a different story. Each piece of evidence pointed in contradictory directions. The only constant was {theme} — it appeared in every victim's journal, every suspect's alibi.",
      "At the old library in {setting}, {name} found records dating back decades. The pattern was unmistakable: every twenty years, the same events repeated. And this year, the cycle centered on {theme}.",
    ],
    twists: [
      "The real shock came when {name} discovered the culprit was the least likely suspect — someone who had been hiding behind the concept of {theme} all along, using it as both shield and weapon.",
      "{name} stared at the evidence board in disbelief. The mystery of {setting} was not a crime at all — it was a elaborate test centered on {theme}, designed by someone who wanted to find a worthy successor.",
    ],
    endings: [
      "The case was closed, but {name} sat alone in {setting}, contemplating {theme}. Some mysteries, once solved, only reveal deeper questions. And that was perhaps the greatest mystery of all.",
      "As {name} filed the final report, the phone rang again. Another case, another puzzle. But the lessons of {theme} learned in {setting} would prove invaluable in the challenges ahead.",
    ],
  },
  SciFi: {
    openings: [
      "The year was 2847, and {name} was the last person in {setting} who still remembered what Earth looked like before the transformation.",
      "{name} stared at the data streaming across the holographic display. The readings from {setting} defied every known law of physics.",
      "When the signal from {setting} first reached the station, {name} dismissed it as cosmic noise. That was before the message decoded itself.",
    ],
    middles: [
      "The technology was beyond anything {name} had encountered. In {setting}, machines operated on principles that merged {theme} with quantum mechanics. Each discovery raised more questions than answers, pushing the boundaries of human understanding.",
      "{name} worked tirelessly in {setting}'s research facility. The experiment involving {theme} was approaching critical mass. If the calculations were correct, reality itself would need to be redefined.",
    ],
    twists: [
      "The simulation theory was confirmed — {setting} was a construct, but not created by aliens. {name} discovered that humanity itself had built it, erasing the memory to study {theme} without bias. The implications were staggering.",
      "The alien intelligence revealed itself not as a threat, but as a guardian. It had been monitoring {setting} for millennia, waiting for someone like {name} to understand {theme} — the key to joining the galactic community.",
    ],
    endings: [
      "{name} initiated the protocol, watching as {setting} transformed before their eyes. The era of {theme} had begun, and nothing in the universe would ever be the same.",
      "Standing at the observation deck of {setting}, {name} gazed at the stars with new understanding. {theme} was not just a concept — it was the fundamental fabric connecting all conscious beings across the cosmos.",
    ],
  },
  Horror: {
    openings: [
      "{name} should never have returned to {setting}. The locals said the place was cursed, and now, standing in the cold silence, those warnings echoed with terrifying clarity.",
      "The scratching started at midnight. Every night since moving to {setting}, {name} heard it — faint at first, then louder, closer, more insistent.",
      "No one could explain what happened in {setting} twenty years ago. But {name} was about to find out, because the nightmares had started again.",
    ],
    middles: [
      "Each room in {setting} held echoes of something dark. {name} found journals, photographs, and artifacts that told a story of {theme} twisted into something unrecognizable. The walls seemed to breathe, and shadows moved in ways that defied explanation.",
      "Sleep became impossible. {name} wandered {setting} at all hours, piecing together fragments of a horrifying truth about {theme}. The deeper the investigation went, the more the line between reality and nightmare blurred.",
    ],
    twists: [
      "The mirror did not show {name}'s reflection. It showed someone else — someone who had been trapped in {setting} for decades, consumed by {theme}. And that person was trying to switch places.",
      "{name} realized the horror of {setting} was not supernatural at all. It was deeply human — a manifestation of {theme} taken to its darkest extreme. And the most terrifying part was that it was already too late.",
    ],
    endings: [
      "{name} escaped {setting} as dawn broke, vowing never to return. But the experience had left an indelible mark — a understanding of {theme} that made every shadow seem a little deeper, every silence a little too quiet.",
      "The door to {setting} sealed shut for the final time. {name} survived, but the lesson of {theme} would haunt every waking moment. Some doors, once opened, can never truly be closed.",
    ],
  },
  Comedy: {
    openings: [
      "It all started when {name} accidentally sent a reply-all email to everyone in {setting}. The subject line? 'Why I Think the Boss is a Potato.' It was supposed to be a joke. Kind of.",
      "{name} had exactly three talents: making coffee, losing car keys, and somehow ending up in the most ridiculous situations {setting} had ever witnessed.",
      "The day {name} decided to reinvent themselves in {setting} was the same day the universe decided to test exactly how much chaos one person could cause.",
    ],
    middles: [
      "Things escalated quickly. {name}'s attempt to fix the situation in {setting} only made it worse — spectacularly, hilariously worse. The incident involving {theme} became legendary, retold at every gathering with increasing embellishment.",
      "Meanwhile, {name}'s brilliant plan involving {theme} hit a snag. Actually, it hit several snags, a brick wall, and possibly a llama (don't ask about the llama). {setting} had never seen anything quite like it.",
    ],
    twists: [
      "Plot twist: the entire disaster actually worked out because of {theme}. Not because of careful planning — {name} would be the first to admit that — but because sometimes the universe rewards spectacular incompetence with accidental genius.",
      "In a stunning turn of events, {name}'s catastrophic approach to {theme} in {setting} accidentally solved a problem that experts had struggled with for years. The secret ingredient, it turned out, was chaos.",
    ],
    endings: [
      "{name} sat in {setting}, surrounded by the aftermath of the most chaotic week in recorded history. But everyone was laughing, and somehow, {theme} had brought them all closer together. Mission accomplished? Sure, let's go with that.",
      "Looking back, {name} realized that the whole adventure in {setting} taught one important lesson about {theme}: sometimes the best things in life come from the worst plans. And {name}'s plans were consistently, reliably, magnificently terrible.",
    ],
  },
};

export default function AiStoryGenerator() {
  const [genre, setGenre] = useState<Genre>("Adventure");
  const [name, setName] = useState("");
  const [setting, setSetting] = useState("");
  const [theme, setTheme] = useState("");
  const [story, setStory] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = () => {
    if (!name.trim() || !setting.trim() || !theme.trim()) return;
    const t = storyTemplates[genre];
    const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
    const fill = (s: string) => s.replace(/\{name\}/g, name.trim()).replace(/\{setting\}/g, setting.trim()).replace(/\{theme\}/g, theme.trim());
    const parts = [fill(pick(t.openings)), fill(pick(t.middles)), fill(pick(t.twists)), fill(pick(t.endings))];
    setStory(parts.join("\n\n"));
  };

  const copy = () => { navigator.clipboard?.writeText(story); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Genre</label>
        <div className="flex gap-2 flex-wrap">
          {(["Adventure", "Romance", "Mystery", "SciFi", "Horror", "Comedy"] as Genre[]).map((g) => (
            <button key={g} onClick={() => setGenre(g)} className={g === genre ? "btn-primary" : "btn-secondary"}>{g}</button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Character Name</label>
          <input className="calc-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Alex" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Setting</label>
          <input className="calc-input" value={setting} onChange={(e) => setSetting(e.target.value)} placeholder="e.g. ancient forest" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Theme</label>
          <input className="calc-input" value={theme} onChange={(e) => setTheme(e.target.value)} placeholder="e.g. courage" />
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={generate} className="btn-primary">Generate Story</button>
        {story && <button onClick={generate} className="btn-secondary">Regenerate</button>}
      </div>
      {story && (
        <div className="result-card space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-gray-600">{genre} Story</span>
            <button onClick={copy} className="text-xs text-indigo-600 font-medium hover:underline">{copied ? "Copied!" : "Copy"}</button>
          </div>
          {story.split("\n\n").map((p, i) => <p key={i} className="text-gray-800 leading-relaxed">{p}</p>)}
          <p className="text-xs text-gray-400 pt-2 border-t border-gray-100">{story.split(/\s+/).length} words</p>
        </div>
      )}
    </div>
  );
}
