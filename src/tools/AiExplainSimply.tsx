"use client";
import { useState, useMemo } from "react";

type Level = "ELI5" | "ELI10" | "Simple Adult";

const jargonMap: Record<string, { eli5: string; eli10: string; simple: string }> = {
  "algorithm": { eli5: "a set of steps to follow, like a recipe", eli10: "a step-by-step instruction that a computer follows to solve a problem", simple: "a specific set of instructions for solving a problem" },
  "photosynthesis": { eli5: "how plants make their food using sunshine", eli10: "the process where plants use sunlight, water, and air to make sugar for energy", simple: "the biological process by which plants convert sunlight into chemical energy" },
  "metabolism": { eli5: "how your body turns food into energy to play and grow", eli10: "all the chemical reactions in your body that convert food into energy", simple: "the set of chemical processes in living organisms that maintain life" },
  "cryptocurrency": { eli5: "pretend money that lives inside computers", eli10: "digital money that uses special codes to keep it safe, without needing a bank", simple: "digital currency secured by coding techniques that works without a central bank" },
  "blockchain": { eli5: "a special notebook where everyone can see what's written and nobody can erase it", eli10: "a chain of digital records that everyone can see and verify, making it very hard to cheat", simple: "a distributed digital ledger that records transactions across many computers" },
  "quantum": { eli5: "super tiny things that can be in two places at once, like magic", eli10: "the smallest bits of energy and matter that behave very differently from normal objects", simple: "relating to the smallest discrete units of energy and matter" },
  "neural network": { eli5: "a computer brain that learns by looking at lots of examples", eli10: "a computer system designed to work like the human brain, learning from data", simple: "a computing system inspired by biological neural networks that learns from data" },
  "machine learning": { eli5: "teaching computers to learn from examples, like how you learn from practice", eli10: "a way for computers to get better at tasks by studying lots of examples instead of being told exactly what to do", simple: "a branch of computing where systems improve their performance through experience with data" },
  "artificial intelligence": { eli5: "making computers smart enough to do things humans do", eli10: "computer programs that can think, learn, and make decisions somewhat like humans", simple: "computer systems designed to perform tasks that typically require human intelligence" },
  "DNA": { eli5: "a tiny instruction book inside you that makes you, you", eli10: "the molecule in every cell that contains the instructions for how your body is built and works", simple: "the molecule that carries genetic instructions for development and functioning of organisms" },
  "genome": { eli5: "all the instructions in your body's recipe book", eli10: "the complete set of genetic instructions found in every cell of your body", simple: "the complete set of genetic material present in an organism" },
  "entropy": { eli5: "things getting more and more messy over time", eli10: "a measure of how disorganized or random something is — things naturally tend to become more disordered", simple: "a measure of disorder or randomness in a system, which tends to increase over time" },
  "relativity": { eli5: "time goes slower when you move really fast, and space can bend", eli10: "Einstein's idea that time and space are connected, and they change depending on how fast you're moving or how strong gravity is", simple: "Einstein's theory describing how time, space, mass, and energy are interconnected" },
  "inflation": { eli5: "when the same money buys less stuff than before", eli10: "when prices of things go up over time, so your money can buy less", simple: "the rate at which the general price level of goods and services rises over time" },
  "GDP": { eli5: "counting up everything a country makes and sells", eli10: "the total value of everything a country produces in a year, used to measure how rich a country is", simple: "the total monetary value of all finished goods and services produced within a country" },
  "hypothesis": { eli5: "a smart guess about what might happen", eli10: "an educated guess that scientists test through experiments to see if it's right", simple: "a proposed explanation for a phenomenon that can be tested through experimentation" },
  "paradigm": { eli5: "the way everyone agrees to think about something", eli10: "a set of ideas or a pattern that everyone follows for understanding something", simple: "a standard framework or model for understanding a concept" },
  "ecosystem": { eli5: "all the plants, animals, and nature in a place working together", eli10: "a community of living things and their environment, all connected and depending on each other", simple: "a community of organisms interacting with each other and their physical environment" },
  "osmosis": { eli5: "water sneaking through a wall to balance things out", eli10: "when water moves through a thin barrier from where there's more water to where there's less", simple: "the movement of water through a semipermeable membrane from lower to higher concentration" },
  "catalyst": { eli5: "something that makes things happen faster without being used up", eli10: "a substance that speeds up a chemical reaction without being changed itself", simple: "a substance that increases the rate of a reaction without being consumed" },
  "binary": { eli5: "computers counting using only 0 and 1", eli10: "a number system using only two digits (0 and 1) that computers use to store and process everything", simple: "a base-2 number system using only digits 0 and 1, fundamental to computing" },
  "encryption": { eli5: "turning a message into a secret code only your friend can read", eli10: "scrambling information using a special code so only the right person can unscramble and read it", simple: "the process of encoding information so only authorized parties can access it" },
  "API": { eli5: "a helper that lets two computer programs talk to each other", eli10: "a set of rules that lets different software programs share information and work together", simple: "a set of protocols and tools that allow different software applications to communicate" },
  "variable": { eli5: "a box where you keep a number or word that can change", eli10: "a named container in programming that stores a value which can be changed", simple: "a named storage location in programming that holds a value" },
  "function": { eli5: "a button that does a job when you press it", eli10: "a reusable piece of code that does a specific task when called", simple: "a named block of code designed to perform a particular task" },
  "database": { eli5: "a giant organized cupboard where a computer keeps information", eli10: "an organized collection of data stored electronically, like a super-powered spreadsheet", simple: "an organized collection of structured data stored and accessed electronically" },
  "bandwidth": { eli5: "how much stuff can go through a pipe at once", eli10: "how much data can be sent over an internet connection at the same time", simple: "the maximum rate of data transfer across a network path" },
  "latency": { eli5: "how long you wait after pressing a button before something happens", eli10: "the delay between when you do something and when you see the result on your screen", simple: "the time delay between a cause and its effect in a system" },
  "protocol": { eli5: "rules that everyone follows so things work the same way", eli10: "a set of rules that computers follow to communicate with each other properly", simple: "a set of standardized rules governing data communication between systems" },
  "iteration": { eli5: "doing something again and again, each time a little better", eli10: "repeating a process multiple times, usually to improve the result each time", simple: "the repetition of a process to achieve a desired outcome" },
  "depreciation": { eli5: "things getting worth less money as they get older", eli10: "when something loses value over time because it gets used or outdated", simple: "the decrease in value of an asset over time due to use or obsolescence" },
  "equity": { eli5: "how much of something is really yours after paying what you owe", eli10: "the value of what you own minus what you owe — your real ownership", simple: "the value of ownership in an asset after subtracting all debts" },
  "derivative": { eli5: "measuring how fast something is changing right now", eli10: "a math tool that tells you the rate of change — like how quickly a car's speed is increasing", simple: "a mathematical measure of the rate at which a quantity changes" },
  "integral": { eli5: "adding up lots of tiny pieces to find the total", eli10: "a math operation that adds up an infinite number of tiny parts to find a total area or amount", simple: "a mathematical operation that computes the accumulation of quantities" },
  "vector": { eli5: "an arrow that shows which way and how far to go", eli10: "a quantity that has both a size (magnitude) and a direction, shown as an arrow", simple: "a mathematical quantity with both magnitude and direction" },
  "matrix": { eli5: "numbers arranged in a rectangle shape", eli10: "a grid of numbers arranged in rows and columns that can represent data or transformations", simple: "a rectangular array of numbers organized in rows and columns" },
  "photon": { eli5: "a tiny piece of light", eli10: "the smallest possible amount of light or electromagnetic energy", simple: "a quantum of electromagnetic radiation" },
  "polymer": { eli5: "tiny building blocks linked together in a long chain, like pop beads", eli10: "a large molecule made by linking many small identical units together in a chain", simple: "a large molecule composed of many repeated smaller molecular units" },
  "isotope": { eli5: "atoms of the same thing but some are heavier because they have extra bits inside", eli10: "atoms of the same element that have different numbers of neutrons, making them lighter or heavier", simple: "atoms of the same element with different numbers of neutrons" },
  "mitosis": { eli5: "when one cell copies itself to make two same cells", eli10: "the process where a cell divides to produce two identical copies of itself", simple: "cell division producing two genetically identical daughter cells" },
  "meiosis": { eli5: "special cell splitting that makes cells for making babies", eli10: "a type of cell division that produces four cells with half the DNA, used to make eggs and sperm", simple: "cell division that produces four cells each with half the chromosomal complement" },
  "compound": { eli5: "when two or more different things mix together and become something new", eli10: "a substance made when two or more elements chemically bond together", simple: "a substance formed by the chemical combination of two or more elements" },
  "electromagnetic": { eli5: "invisible waves that include light, radio waves, and X-rays", eli10: "waves of energy that include visible light, radio waves, microwaves, and X-rays", simple: "radiation consisting of oscillating electric and magnetic fields" },
  "semiconductor": { eli5: "a special material that sometimes lets electricity through and sometimes doesn't", eli10: "a material that conducts electricity better than an insulator but not as well as a metal — the key ingredient in computer chips", simple: "a material with conductivity between a conductor and insulator, used in electronics" },
  "amplitude": { eli5: "how big a wave is — bigger means louder for sound", eli10: "the height of a wave — bigger amplitude means more energy", simple: "the maximum displacement of a wave from its equilibrium position" },
  "frequency": { eli5: "how many times something happens in one second", eli10: "the number of times a wave repeats in one second, measured in Hertz", simple: "the number of occurrences of a repeating event per unit of time" },
  "wavelength": { eli5: "the distance from one wave bump to the next", eli10: "the distance between two consecutive peaks of a wave", simple: "the spatial distance between successive wave peaks" },
  "momentum": { eli5: "how hard it is to stop something that's moving", eli10: "a measure of how much motion an object has, based on its mass and speed (p = mv)", simple: "the product of an object's mass and velocity" },
  "velocity": { eli5: "how fast something goes and which way", eli10: "speed in a particular direction — it tells you both how fast and where something is going", simple: "the rate of change of position with respect to time, including direction" },
  "acceleration": { eli5: "getting faster and faster", eli10: "how quickly something speeds up, slows down, or changes direction", simple: "the rate of change of velocity over time" },
  "synthesis": { eli5: "putting different things together to make something new", eli10: "combining different parts or ideas to create something new and complete", simple: "the combination of components to form a connected whole" },
  "correlation": { eli5: "when two things seem to happen together", eli10: "when two things are related — when one changes, the other tends to change too", simple: "a statistical relationship between two variables" },
  "causation": { eli5: "when one thing actually makes another thing happen", eli10: "when one thing directly causes another thing to happen, not just happening at the same time", simple: "a relationship where one event directly produces another" },
  "methodology": { eli5: "the plan for how to do something", eli10: "the organized method or approach used to study or solve something", simple: "a systematic approach or set of methods used in research or work" },
  "optimization": { eli5: "making something work the best it possibly can", eli10: "finding the best possible solution or way to do something as efficiently as possible", simple: "the process of making something as effective or functional as possible" },
  "parameter": { eli5: "a rule or setting you can change", eli10: "a value that you can adjust to change how something works or behaves", simple: "a variable that defines system characteristics or behavior" },
  "scalability": { eli5: "being able to grow bigger without breaking", eli10: "how well something can handle growing larger, like more users or more data", simple: "the ability of a system to handle increasing amounts of work" },
  "sustainability": { eli5: "using things carefully so they last a long time", eli10: "doing things in a way that doesn't use up resources or harm the environment so future generations can thrive too", simple: "meeting present needs without compromising the ability of future generations to meet theirs" },
  "biodiversity": { eli5: "having lots of different plants and animals living together", eli10: "the variety of all living things in an area — more variety means a healthier ecosystem", simple: "the variety of life forms within an ecosystem or biome" },
  "innovation": { eli5: "coming up with a new and clever idea", eli10: "creating something new or finding a better way to do something that already exists", simple: "the introduction of new methods, ideas, or products" },
  "infrastructure": { eli5: "the big things everyone uses, like roads and buildings", eli10: "the basic systems and structures a society needs to work, like roads, power lines, and water systems", simple: "the fundamental facilities and systems serving a society or organization" },
  "equilibrium": { eli5: "when everything is balanced and nothing is changing", eli10: "a state of balance where opposing forces or effects cancel each other out", simple: "a state in which opposing forces or influences are balanced" },
  "volatility": { eli5: "things going up and down really fast and unpredictably", eli10: "how much and how quickly something changes — high volatility means big swings up and down", simple: "the degree of variation of a quantity over time" },
  "amortization": { eli5: "paying back money bit by bit over time", eli10: "spreading the cost of something over time through regular payments", simple: "the gradual repayment of a debt through scheduled installments" },
  "arbitrage": { eli5: "buying something cheap in one place and selling it for more somewhere else", eli10: "taking advantage of different prices for the same thing in different places to make a profit", simple: "exploiting price differences across markets for profit" },
  "congruent": { eli5: "exactly the same shape and size", eli10: "two shapes that are identical in shape and size — they match perfectly when placed on top of each other", simple: "having the same shape and dimensions" },
  "theorem": { eli5: "a math rule that someone proved is always true", eli10: "a mathematical statement that has been proven to be true using logical reasoning", simple: "a mathematical statement proven through rigorous logical deduction" },
  "axiom": { eli5: "a rule everyone agrees is true without proving it", eli10: "a basic truth that is accepted without proof and used as a starting point for reasoning", simple: "a self-evident truth accepted as the basis for reasoning" },
  "corollary": { eli5: "something that naturally follows from what you just proved", eli10: "a result that follows directly from a theorem that has already been proven", simple: "a proposition that follows directly from a proven theorem" },
  "asymptote": { eli5: "a line that a curve gets closer and closer to but never touches", eli10: "a line that a graph approaches but never quite reaches, no matter how far it extends", simple: "a line that a curve approaches but never intersects as it extends to infinity" },
  "recursion": { eli5: "something that keeps calling itself, like looking in a mirror facing another mirror", eli10: "when a function or process calls itself to solve a smaller version of the same problem", simple: "a method where the solution depends on solutions to smaller instances of the same problem" },
  "abstraction": { eli5: "hiding the tricky details and just showing the simple part", eli10: "simplifying something complex by focusing on the important parts and hiding the details", simple: "the process of reducing complexity by focusing on essential features while ignoring irrelevant details" },
  "polymorphism": { eli5: "one thing that can act in different ways depending on the situation", eli10: "a programming concept where the same code can behave differently depending on the type of data it's working with", simple: "the ability of objects to take on multiple forms, responding differently to the same interface" },
  "encapsulation": { eli5: "putting things in a box so nobody can mess with the insides", eli10: "bundling data and the code that uses it together, and hiding the internal details from outside", simple: "the practice of bundling data and methods together while restricting direct access to internal state" },
  "inheritance": { eli5: "getting things from your parents — in code, a new thing gets features from an older thing", eli10: "in programming, when a new class gets all the features of an existing class and can add its own", simple: "an object-oriented mechanism where a class derives properties and behaviors from a parent class" },
  "interpolation": { eli5: "guessing what's in between two things you already know", eli10: "estimating unknown values between two known values using patterns", simple: "estimating values within the range of known data points" },
  "extrapolation": { eli5: "guessing what comes next based on what you already know", eli10: "predicting values beyond the range of known data by extending existing patterns", simple: "estimating values beyond the range of known data by extending trends" },
  "regression": { eli5: "drawing the best line through a bunch of dots", eli10: "a statistical method that finds the best relationship between variables by fitting a line or curve", simple: "a statistical method for modeling the relationship between dependent and independent variables" },
  "normalization": { eli5: "making everything fit on the same scale so you can compare them", eli10: "adjusting values measured on different scales to a common scale for fair comparison", simple: "the process of scaling data to a standard range or distribution" },
  "redundancy": { eli5: "having extra of something just in case", eli10: "having backup copies or extra parts so things still work if something breaks", simple: "the inclusion of additional components to ensure reliability in case of failure" },
  "throughput": { eli5: "how much stuff gets done in a certain amount of time", eli10: "the amount of data or work that passes through a system in a given time period", simple: "the rate at which a system processes or transfers data" },
  "tokenization": { eli5: "cutting a big thing into little pieces", eli10: "breaking text or data into smaller, meaningful pieces called tokens", simple: "the process of dividing data into discrete units for processing" },
  "heuristic": { eli5: "a shortcut way to figure things out that usually works", eli10: "a practical approach to problem-solving that may not be perfect but gives a good enough answer quickly", simple: "a practical problem-solving approach that yields a sufficient solution efficiently" },
  "stochastic": { eli5: "things that happen randomly", eli10: "processes that have randomness or unpredictability built into them", simple: "involving or containing a random element; probabilistic" },
  "deterministic": { eli5: "when the same thing always happens the same way", eli10: "a process where the outcome is completely determined by the starting conditions, with no randomness", simple: "a process whose outcome is entirely determined by initial conditions and inputs" },
  "anisotropic": { eli5: "something that's different depending on which way you look at it", eli10: "a material or property that varies depending on the direction you measure it", simple: "having physical properties that differ depending on direction of measurement" },
  "isotropic": { eli5: "something that's the same no matter which way you look", eli10: "a material or property that is the same in every direction", simple: "having physical properties that are identical in all directions" },
  "homogeneous": { eli5: "everything mixed together so it all looks the same", eli10: "a mixture or group where everything is the same throughout — uniform composition", simple: "uniform in composition or character throughout" },
  "heterogeneous": { eli5: "a mix where you can see the different parts", eli10: "a mixture where different parts are visible and not uniformly distributed", simple: "composed of diverse or dissimilar elements" },
  "exothermic": { eli5: "a reaction that gives off heat — it feels warm", eli10: "a chemical reaction that releases heat energy into its surroundings", simple: "a chemical reaction that releases energy in the form of heat" },
  "endothermic": { eli5: "a reaction that takes in heat — it feels cold", eli10: "a chemical reaction that absorbs heat energy from its surroundings", simple: "a chemical reaction that absorbs energy in the form of heat" },
  "precipitate": { eli5: "when stuff appears in a liquid out of nowhere and sinks", eli10: "a solid that forms and separates from a liquid solution during a chemical reaction", simple: "an insoluble solid formed from a reaction in a solution" },
  "titration": { eli5: "slowly adding drops to figure out how strong a liquid is", eli10: "a lab technique where you carefully add one solution to another to find out its concentration", simple: "a quantitative chemical analysis method for determining solution concentration" },
  "stoichiometry": { eli5: "counting atoms to make sure a recipe is balanced", eli10: "the math of chemical reactions — calculating how much of each substance you need", simple: "the calculation of quantities of substances consumed and produced in chemical reactions" },
  "oxidation": { eli5: "when something reacts with oxygen, like rusting", eli10: "a chemical reaction where a substance loses electrons, often by reacting with oxygen", simple: "a chemical process involving the loss of electrons from a substance" },
  "reduction": { eli5: "the opposite of oxidation — gaining something back", eli10: "a chemical reaction where a substance gains electrons", simple: "a chemical process involving the gain of electrons by a substance" },
};

function simplifyText(text: string, level: Level): string {
  let result = text;

  // Replace jargon terms
  const lowerText = result.toLowerCase();
  for (const [term, replacements] of Object.entries(jargonMap)) {
    if (lowerText.includes(term.toLowerCase())) {
      const key = level === "ELI5" ? "eli5" : level === "ELI10" ? "eli10" : "simple";
      const regex = new RegExp(`\\b${term}\\b`, "gi");
      result = result.replace(regex, `${term} (${replacements[key]})`);
    }
  }

  // Split into sentences
  const sentences = result.match(/[^.!?]+[.!?]+/g) || [result];

  if (level === "ELI5") {
    return sentences.map((s) => {
      let simple = s.trim();
      simple = simple.replace(/\b(?:utilize|employ)\b/gi, "use");
      simple = simple.replace(/\b(?:approximately|circa)\b/gi, "about");
      simple = simple.replace(/\b(?:commence|initiate)\b/gi, "start");
      simple = simple.replace(/\b(?:terminate|conclude)\b/gi, "end");
      simple = simple.replace(/\b(?:subsequently)\b/gi, "then");
      simple = simple.replace(/\b(?:therefore|consequently|thus|hence)\b/gi, "so");
      simple = simple.replace(/\b(?:however|nevertheless|nonetheless)\b/gi, "but");
      simple = simple.replace(/\b(?:furthermore|moreover|additionally)\b/gi, "also");
      simple = simple.replace(/\b(?:facilitate)\b/gi, "help");
      simple = simple.replace(/\b(?:acquire|obtain)\b/gi, "get");
      simple = simple.replace(/\b(?:sufficient)\b/gi, "enough");
      simple = simple.replace(/\b(?:demonstrate)\b/gi, "show");
      simple = simple.replace(/\b(?:numerous)\b/gi, "many");
      simple = simple.replace(/\b(?:substantial|significant)\b/gi, "big");
      simple = simple.replace(/\b(?:minimal|negligible)\b/gi, "small");
      return simple;
    }).join(" ").replace(/\s+/g, " ").trim() + "\n\nThink of it like this: Imagine you're explaining this to a 5-year-old using everyday objects they already know about!";
  }

  if (level === "ELI10") {
    return sentences.map((s) => {
      let simple = s.trim();
      simple = simple.replace(/\b(?:utilize)\b/gi, "use");
      simple = simple.replace(/\b(?:approximately)\b/gi, "roughly");
      simple = simple.replace(/\b(?:commence)\b/gi, "begin");
      simple = simple.replace(/\b(?:therefore|consequently)\b/gi, "so");
      simple = simple.replace(/\b(?:furthermore|moreover)\b/gi, "also");
      simple = simple.replace(/\b(?:facilitate)\b/gi, "help with");
      simple = simple.replace(/\b(?:demonstrate)\b/gi, "show");
      return simple;
    }).join(" ").replace(/\s+/g, " ").trim();
  }

  // Simple Adult
  return sentences.map((s) => {
    let simple = s.trim();
    simple = simple.replace(/\b(?:utilize)\b/gi, "use");
    simple = simple.replace(/\b(?:approximately)\b/gi, "about");
    simple = simple.replace(/\b(?:subsequently)\b/gi, "then");
    return simple;
  }).join(" ").replace(/\s+/g, " ").trim();
}

export default function AiExplainSimply() {
  const [text, setText] = useState("");
  const [level, setLevel] = useState<Level>("ELI5");
  const [results, setResults] = useState<Record<Level, string>>({} as Record<Level, string>);
  const [copied, setCopied] = useState<Level | null>(null);

  const generate = () => {
    if (!text.trim()) return;
    setResults({
      ELI5: simplifyText(text, "ELI5"),
      ELI10: simplifyText(text, "ELI10"),
      "Simple Adult": simplifyText(text, "Simple Adult"),
    });
  };

  const copy = (lv: Level) => {
    navigator.clipboard?.writeText(results[lv] || "");
    setCopied(lv);
    setTimeout(() => setCopied(null), 2000);
  };

  const wordCount = useMemo(() => text.trim().split(/\s+/).filter(Boolean).length, [text]);

  const levelLabels: Record<Level, { title: string; desc: string }> = {
    ELI5: { title: "ELI5 (Explain Like I'm 5)", desc: "Super simple with everyday examples" },
    ELI10: { title: "ELI10 (Explain Like I'm 10)", desc: "Simple but with more detail" },
    "Simple Adult": { title: "Simple Adult", desc: "Clear language, no jargon" },
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Complex Topic or Concept</label>
        <textarea className="calc-input min-h-[140px]" value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste a complex paragraph, scientific concept, or technical explanation..." />
        <p className="text-xs text-gray-400 mt-1">{wordCount} words</p>
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Simplification Level</label>
        <div className="flex gap-2 flex-wrap">
          {(["ELI5", "ELI10", "Simple Adult"] as Level[]).map((lv) => (
            <button key={lv} onClick={() => setLevel(lv)} className={lv === level ? "btn-primary" : "btn-secondary"}>{lv}</button>
          ))}
        </div>
      </div>
      <button onClick={generate} className="btn-primary">Explain Simply</button>

      {Object.keys(results).length > 0 && (
        <div className="space-y-4">
          {(["ELI5", "ELI10", "Simple Adult"] as Level[]).map((lv) => (
            <div key={lv} className={`result-card ${lv === level ? "ring-2 ring-indigo-300" : ""}`}>
              <div className="flex justify-between items-center mb-2">
                <div>
                  <span className="text-sm font-bold text-gray-700">{levelLabels[lv].title}</span>
                  <span className="text-xs text-gray-400 ml-2">{levelLabels[lv].desc}</span>
                </div>
                <button onClick={() => copy(lv)} className="text-xs text-indigo-600 font-medium hover:underline">{copied === lv ? "Copied!" : "Copy"}</button>
              </div>
              <p className="text-gray-800 leading-relaxed whitespace-pre-line">{results[lv]}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
