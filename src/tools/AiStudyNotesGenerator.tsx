"use client";
import { useState, useMemo } from "react";

const subjects = ["Science", "Math", "History", "Geography", "English", "Economics", "Computer Science", "Physics", "Chemistry", "Biology"] as const;
const levels = ["School", "College", "Competitive Exam"] as const;
type Subject = (typeof subjects)[number];
type Level = (typeof levels)[number];

interface Notes {
  keyConcepts: string[];
  definitions: string[];
  formulas: string[];
  mnemonics: string[];
  commonQuestions: string[];
  revisionPoints: string[];
}

const templates: Record<string, Partial<Record<Level, Notes>>> = {
  Science: {
    School: {
      keyConcepts: ["Matter exists in three states: Solid, Liquid, and Gas", "Energy can neither be created nor destroyed (Law of Conservation)", "Cells are the basic unit of life", "Photosynthesis converts sunlight to chemical energy in plants", "Newton's three laws describe motion and forces", "Atoms are made of protons, neutrons, and electrons", "The periodic table organizes elements by atomic number"],
      definitions: ["Atom: The smallest unit of an element that retains chemical properties", "Molecule: Two or more atoms bonded together", "Force: A push or pull that can change an object's motion", "Energy: The ability to do work", "Ecosystem: A community of organisms and their environment"],
      formulas: ["Speed = Distance / Time", "Force = Mass x Acceleration (F = ma)", "Density = Mass / Volume", "Kinetic Energy = 1/2 mv^2", "Potential Energy = mgh"],
      mnemonics: ["ROY G BIV - Colors of rainbow (Red, Orange, Yellow, Green, Blue, Indigo, Violet)", "My Very Educated Mother Just Served Us Nachos - Planet order", "Kings Play Chess On Fine Green Silk - Taxonomy hierarchy", "OIL RIG - Oxidation Is Loss, Reduction Is Gain"],
      commonQuestions: ["What is the difference between speed and velocity?", "How does photosynthesis work?", "What are the states of matter and how do they change?", "Explain Newton's three laws of motion", "What is the water cycle?"],
      revisionPoints: ["Review the periodic table first 20 elements", "Practice unit conversions", "Draw diagrams of cell structure", "Memorize key formulas for physics", "Understand the difference between physical and chemical changes"],
    },
    College: {
      keyConcepts: ["Quantum mechanics describes behavior at atomic scale", "Thermodynamics governs energy transfer in systems", "Organic chemistry focuses on carbon-based compounds", "Genetics explains heredity through DNA and genes", "Electromagnetic spectrum includes all forms of radiation", "Statistical mechanics bridges microscopic and macroscopic physics"],
      definitions: ["Entropy: Measure of disorder in a system", "Catalyst: Substance that speeds up reaction without being consumed", "Polymer: Large molecule made of repeating subunits", "Genome: Complete set of genetic material in an organism", "Wave-particle duality: Light exhibits both wave and particle properties"],
      formulas: ["E = mc^2 (Mass-energy equivalence)", "PV = nRT (Ideal gas law)", "Schrodinger equation: H|psi> = E|psi>", "Gibbs free energy: G = H - TS", "Beer-Lambert Law: A = epsilon * l * c"],
      mnemonics: ["LEO says GER - Lose Electrons Oxidation, Gain Electrons Reduction", "HOMES - Great Lakes (Huron, Ontario, Michigan, Erie, Superior)", "STP = Standard Temperature and Pressure (0C, 1 atm)", "SOHCAHTOA for trigonometry"],
      commonQuestions: ["Explain wave-particle duality", "How do catalysts affect reaction rates?", "What determines protein structure?", "Describe the laws of thermodynamics", "How does nuclear fission differ from fusion?"],
      revisionPoints: ["Focus on derivations and their physical meaning", "Practice numerical problems daily", "Understand laboratory techniques and safety", "Connect theoretical concepts to real applications", "Review previous year exam papers"],
    },
    "Competitive Exam": {
      keyConcepts: ["Advanced organic reaction mechanisms (SN1, SN2, E1, E2)", "Quantum numbers and electronic configuration", "Thermodynamic potentials and Maxwell relations", "Molecular orbital theory vs Valence bond theory", "Bioenergetics and metabolic pathways", "Electromagnetic induction and Maxwell's equations", "Chemical kinetics and order of reactions", "Modern physics: Photoelectric effect, Compton scattering"],
      definitions: ["Enthalpy: Total heat content of a system at constant pressure", "Molarity: Moles of solute per liter of solution", "Buffer: Solution that resists pH change", "Resonance: Delocalization of electrons across bonds", "Isomerism: Same molecular formula, different structural arrangement"],
      formulas: ["Nernst equation: E = E0 - (RT/nF)lnQ", "Henderson-Hasselbalch: pH = pKa + log([A-]/[HA])", "de Broglie wavelength: lambda = h/mv", "Clausius-Clapeyron equation", "Arrhenius equation: k = Ae^(-Ea/RT)"],
      mnemonics: ["Please Send Charlie's Monkeys And Zebras In Lovely Big Cages - s-block elements", "BRNO - Bond order = (Bonding - Antibonding)/2", "LIPID - Lithium, Potassium (K), Sodium (Na) - Alkali metals reactivity", "Aufbau principle: Fill lowest energy first (1s, 2s, 2p, 3s...)"],
      commonQuestions: ["Compare SN1 and SN2 mechanisms with examples", "Derive expression for equilibrium constant", "Explain band theory of solids", "Calculate molar conductivity at infinite dilution", "Solve problems on chemical equilibrium using ICE tables"],
      revisionPoints: ["Practice 50+ numerical problems per topic", "Focus on exception-based questions", "Time yourself during practice tests", "Review NCERT thoroughly for conceptual clarity", "Make formula sheets for quick revision"],
    },
  },
  Math: {
    School: {
      keyConcepts: ["Number systems: Natural, Whole, Integer, Rational, Irrational, Real", "Basic geometry: Angles, triangles, circles, area, perimeter", "Algebra: Variables, expressions, equations, inequalities", "Statistics: Mean, Median, Mode, Range", "Probability: Likelihood of events occurring", "Fractions, decimals, and percentages are interconvertible"],
      definitions: ["Variable: A symbol representing an unknown quantity", "Equation: A mathematical statement with an equals sign", "Polygon: A closed figure with straight sides", "Probability: Number of favorable outcomes / Total outcomes", "Ratio: Comparison of two quantities by division"],
      formulas: ["Area of circle = pi*r^2", "Area of triangle = 1/2 * base * height", "Pythagorean theorem: a^2 + b^2 = c^2", "Percentage = (Part/Whole) * 100", "Simple Interest = PRT/100"],
      mnemonics: ["PEMDAS/BODMAS - Order of operations", "SOH CAH TOA - Sin=Opp/Hyp, Cos=Adj/Hyp, Tan=Opp/Adj", "All Stations To Central - Trig positive quadrants", "Please Excuse My Dear Aunt Sally - Parentheses, Exponents, Multiply, Divide, Add, Subtract"],
      commonQuestions: ["How to find the HCF and LCM of two numbers?", "Solve linear equations in one variable", "Calculate area and perimeter of common shapes", "What is the Pythagorean theorem and how to apply it?", "How to calculate probability of simple events?"],
      revisionPoints: ["Practice multiplication tables up to 20", "Learn all geometry formulas by heart", "Solve word problems daily", "Draw geometric figures for better understanding", "Check answers by substitution method"],
    },
    College: {
      keyConcepts: ["Calculus: Limits, derivatives, integrals, series", "Linear algebra: Matrices, vectors, eigenvalues", "Differential equations: Ordinary and partial", "Abstract algebra: Groups, rings, fields", "Real analysis: Sequences, series, continuity", "Probability theory and distributions"],
      definitions: ["Limit: Value a function approaches as input approaches a point", "Derivative: Rate of change of a function", "Integral: Accumulation of quantities", "Matrix: Rectangular array of numbers", "Eigenvalue: Scalar associated with a linear transformation"],
      formulas: ["Integration by parts: integral(u dv) = uv - integral(v du)", "Taylor series: f(x) = sum of f^(n)(a)/n! * (x-a)^n", "Euler's formula: e^(ix) = cos(x) + i*sin(x)", "Determinant (2x2): ad - bc", "Quadratic formula: x = (-b +/- sqrt(b^2-4ac)) / 2a"],
      mnemonics: ["LIATE for integration by parts (Log, Inverse trig, Algebraic, Trig, Exponential)", "ILATE - same as LIATE, different order for Indian syllabi", "Cramer's Rule: D_x/D for solving systems", "Row Echelon Form: REF for Gaussian elimination"],
      commonQuestions: ["Prove the Fundamental Theorem of Calculus", "Find eigenvalues and eigenvectors of a matrix", "Solve a system of differential equations", "Determine convergence of infinite series", "Apply Green's/Stokes' theorem"],
      revisionPoints: ["Practice integration techniques daily", "Understand proofs, not just memorize", "Solve previous year exam papers", "Create summary sheets for each chapter", "Work through at least 20 problems per topic"],
    },
    "Competitive Exam": {
      keyConcepts: ["Number theory: Divisibility, modular arithmetic, Euler's function", "Combinatorics: Permutations, combinations, pigeonhole principle", "Inequalities: AM-GM, Cauchy-Schwarz, Chebyshev", "Coordinate geometry: Conics, straight lines, circles", "Complex numbers and their geometric interpretation", "Sequences and series: Telescoping, partial fractions", "Advanced calculus: Multiple integrals, vector calculus", "Probability: Conditional, Bayes theorem, distributions"],
      definitions: ["Congruence: a ≡ b (mod n) means n divides (a-b)", "Bijection: A function that is both injective and surjective", "Convergence: A sequence approaches a finite limit", "Determinant: Scalar value from a square matrix encoding certain properties", "Rank: Maximum number of linearly independent rows/columns"],
      formulas: ["Euler's totient: phi(n) = n * product(1 - 1/p) for prime p|n", "Binomial theorem: (a+b)^n = sum C(n,k) a^(n-k) b^k", "AM >= GM >= HM for positive reals", "Rotation matrix: [[cos,-sin],[sin,cos]]", "Catalan number: C_n = C(2n,n)/(n+1)"],
      mnemonics: ["For limits: 0/0 is indeterminate, use L'Hopital", "Divisibility by 11: Alternate sum of digits", "For series: Ratio test, Root test, Comparison test (RRC)", "Trigonometric identities: sin^2 + cos^2 = 1 family"],
      commonQuestions: ["Find the number of divisors of a large number", "Solve problems using AM-GM inequality", "Find area bounded by curves using integration", "Probability problems with Bayes theorem", "Maximize/minimize functions with constraints (Lagrange multipliers)"],
      revisionPoints: ["Solve 100+ problems from previous competitive exams", "Time management: Allocate fixed time per problem", "Focus on trick-based shortcuts", "Create a formula book with all identities", "Practice mental math for speed"],
    },
  },
};

function getNotesForTopic(topic: string, subject: Subject, level: Level): Notes {
  const subjectNotes = templates[subject]?.[level];
  if (subjectNotes) {
    return {
      keyConcepts: subjectNotes.keyConcepts.map((c) => c.replace(/the topic/gi, topic)),
      definitions: subjectNotes.definitions,
      formulas: subjectNotes.formulas,
      mnemonics: subjectNotes.mnemonics,
      commonQuestions: subjectNotes.commonQuestions.map((q) => q.replace(/the topic/gi, topic)),
      revisionPoints: subjectNotes.revisionPoints,
    };
  }
  // Generic fallback
  return {
    keyConcepts: [`${topic} is a key concept in ${subject}`, `Understanding ${topic} requires knowledge of foundational principles`, `${topic} has multiple real-world applications`, `${topic} connects to several other areas in ${subject}`, `Current research continues to expand our understanding of ${topic}`],
    definitions: [`${topic}: A fundamental concept in ${subject}`, "Related terms should be studied alongside", "Key terminology varies by context and level"],
    formulas: ["Refer to your textbook for subject-specific formulas", "Practice applying formulas to different problem types"],
    mnemonics: ["Create your own acronyms for key lists", "Use visual associations for better retention", "Connect new concepts to things you already know"],
    commonQuestions: [`Define ${topic} and explain its significance`, `What are the key components of ${topic}?`, `How does ${topic} apply in real-world scenarios?`, `Compare and contrast different aspects of ${topic}`],
    revisionPoints: ["Review class notes and textbook chapters", "Practice problems from multiple sources", "Create mind maps connecting related concepts", "Teach the concept to someone else", "Take practice tests under timed conditions"],
  };
}

export default function AiStudyNotesGenerator() {
  const [topic, setTopic] = useState("");
  const [subject, setSubject] = useState<Subject>("Science");
  const [level, setLevel] = useState<Level>("School");
  const [notes, setNotes] = useState<Notes | null>(null);
  const [copied, setCopied] = useState(false);

  const generate = () => {
    if (!topic.trim()) return;
    setNotes(getNotesForTopic(topic, subject, level));
  };

  const fullText = useMemo(() => {
    if (!notes) return "";
    let text = `Study Notes: ${topic}\nSubject: ${subject} | Level: ${level}\n\n`;
    text += "KEY CONCEPTS\n" + notes.keyConcepts.map((c, i) => `${i + 1}. ${c}`).join("\n") + "\n\n";
    text += "IMPORTANT DEFINITIONS\n" + notes.definitions.map((d) => `- ${d}`).join("\n") + "\n\n";
    if (notes.formulas.length > 0) {
      text += "FORMULAS\n" + notes.formulas.map((f) => `- ${f}`).join("\n") + "\n\n";
    }
    text += "MNEMONICS & MEMORY TRICKS\n" + notes.mnemonics.map((m) => `- ${m}`).join("\n") + "\n\n";
    text += "COMMON QUESTIONS\n" + notes.commonQuestions.map((q, i) => `${i + 1}. ${q}`).join("\n") + "\n\n";
    text += "QUICK REVISION POINTS\n" + notes.revisionPoints.map((r) => `- ${r}`).join("\n");
    return text;
  }, [notes, topic, subject, level]);

  const copy = () => {
    navigator.clipboard?.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const printNotes = () => {
    const w = window.open("", "_blank");
    if (w) {
      w.document.write(`<html><head><title>Study Notes - ${topic}</title><style>body{font-family:system-ui;max-width:700px;margin:40px auto;line-height:1.6}h1{font-size:20px}h2{font-size:16px;margin-top:20px;border-bottom:1px solid #ccc;padding-bottom:4px}li{margin-bottom:4px}</style></head><body>`);
      w.document.write(`<h1>Study Notes: ${topic}</h1><p><strong>${subject}</strong> | ${level}</p>`);
      const sections = [
        { title: "Key Concepts", items: notes?.keyConcepts || [] },
        { title: "Important Definitions", items: notes?.definitions || [] },
        { title: "Formulas", items: notes?.formulas || [] },
        { title: "Mnemonics & Memory Tricks", items: notes?.mnemonics || [] },
        { title: "Common Questions", items: notes?.commonQuestions || [] },
        { title: "Quick Revision Points", items: notes?.revisionPoints || [] },
      ];
      sections.forEach((s) => {
        if (s.items.length > 0) {
          w.document.write(`<h2>${s.title}</h2><ul>${s.items.map((i) => `<li>${i}</li>`).join("")}</ul>`);
        }
      });
      w.document.write("</body></html>");
      w.document.close();
      w.print();
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Subject</label>
          <select className="calc-input" value={subject} onChange={(e) => setSubject(e.target.value as Subject)}>
            {subjects.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Level</label>
          <div className="flex gap-2 flex-wrap">
            {levels.map((l) => (
              <button key={l} onClick={() => setLevel(l)} className={l === level ? "btn-primary" : "btn-secondary"}>{l}</button>
            ))}
          </div>
        </div>
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Topic</label>
        <input className="calc-input" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., Photosynthesis, Calculus, Industrial Revolution..." />
      </div>
      <button onClick={generate} className="btn-primary">Generate Study Notes</button>

      {notes && (
        <div className="space-y-4">
          <div className="flex gap-2 justify-end">
            <button onClick={copy} className="btn-secondary text-xs">{copied ? "Copied!" : "Copy All"}</button>
            <button onClick={printNotes} className="btn-secondary text-xs">Print</button>
          </div>

          <div className="result-card">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Study Notes: {topic}</h3>
            <p className="text-xs text-gray-400 mb-4">{subject} | {level}</p>

            <div className="mb-4">
              <h4 className="font-semibold text-indigo-700 mb-2">Key Concepts</h4>
              <ol className="list-decimal ml-5 space-y-1">
                {notes.keyConcepts.map((c, i) => <li key={i} className="text-sm text-gray-700">{c}</li>)}
              </ol>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold text-indigo-700 mb-2">Important Definitions</h4>
              <ul className="space-y-1">
                {notes.definitions.map((d, i) => <li key={i} className="text-sm text-gray-700 flex items-start gap-2"><span className="text-indigo-400">&#8226;</span>{d}</li>)}
              </ul>
            </div>

            {notes.formulas.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold text-indigo-700 mb-2">Formulas</h4>
                <div className="bg-gray-50 rounded p-3 space-y-1">
                  {notes.formulas.map((f, i) => <p key={i} className="text-sm font-mono text-gray-800">{f}</p>)}
                </div>
              </div>
            )}

            <div className="mb-4">
              <h4 className="font-semibold text-indigo-700 mb-2">Mnemonics & Memory Tricks</h4>
              <ul className="space-y-1">
                {notes.mnemonics.map((m, i) => <li key={i} className="text-sm text-gray-700 flex items-start gap-2"><span className="text-yellow-500">&#9733;</span>{m}</li>)}
              </ul>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold text-indigo-700 mb-2">Common Questions</h4>
              <ol className="list-decimal ml-5 space-y-1">
                {notes.commonQuestions.map((q, i) => <li key={i} className="text-sm text-gray-700">{q}</li>)}
              </ol>
            </div>

            <div>
              <h4 className="font-semibold text-indigo-700 mb-2">Quick Revision Points</h4>
              <ul className="space-y-1">
                {notes.revisionPoints.map((r, i) => <li key={i} className="text-sm text-gray-700 flex items-start gap-2"><span className="text-green-500">&#10003;</span>{r}</li>)}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
