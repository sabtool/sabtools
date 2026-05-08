/**
 * Step 1: Generate YouTube Short script using Gemini AI
 */

const config = require("./config");

async function generateScript(tool) {
  // Try Gemini API with retries, fall back to template if unavailable
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const script = await callGemini(tool);
      if (script.hook && script.title) return script;
      console.log(`   Attempt ${attempt}: Empty response, retrying...`);
    } catch (err) {
      console.log(`   Attempt ${attempt} failed: ${err.message}`);
    }
    if (attempt < 3) await new Promise((r) => setTimeout(r, 6000)); // Wait for rate limit
  }

  // Fallback: Generate script from templates
  console.log("   Using template fallback (Gemini unavailable)");
  return generateFallbackScript(tool);
}

function generateFallbackScript(tool) {
  const hooks = {
    finance: `Yeh ${tool.name} aapke hazaaron rupaye bacha sakta hai!`,
    math: `${tool.name} se koi bhi calculation 2 second mein!`,
    text: `Content creators ke liye best tool — ${tool.name}!`,
    health: `Apni health track karo FREE mein — ${tool.name}!`,
    tax: `Tax bachana hai? Yeh ${tool.name} use karo!`,
    developer: `Developers, yeh tool aapka time bachayega!`,
    image: `Image editing FREE mein? Haan, ${tool.name} se!`,
    converter: `Koi bhi conversion 1 second mein — ${tool.name}!`,
    default: `Yeh FREE tool har Indian ko pata hona chahiye!`,
  };

  const hook = hooks[tool.category] || hooks.default;

  // Tutorial-style narration that explains step by step
  const narration1 = `Aaj main aapko dikhata hoon ${tool.name} kaise use karte hain. Sabtools.in pe jaao aur yeh tool open karo. Koi signup nahi chahiye, bilkul free hai.`;
  const narration2 = `Bas apne values enter karo aur dekho result turant aa jaata hai! Yeh tool 100% free hai, aapka data safe rehta hai, sab kuch browser mein hota hai. Koi app download nahi karna padta.`;
  const cta = `Abhi try karo sabtools.in pe! 460 se zyada free tools available hain — calculators, converters, aur bahut kuch! Link comment section mein hai, abhi click karo!`;

  // Tool-specific demo values for popular tools
  const demoValuesMap = {
    "emi-calculator": { loanAmount: "2500000", interestRate: "8.5", tenure: "20" },
    "sip-calculator": { monthlyInvestment: "5000", expectedReturn: "12", timePeriod: "10" },
    "gst-calculator": { amount: "10000", gstRate: "18" },
    "fd-calculator": { principal: "100000", interestRate: "7.5", tenure: "5" },
    "rd-calculator": { monthlyDeposit: "5000", interestRate: "7", tenure: "3" },
    "ppf-calculator": { yearlyInvestment: "150000", tenure: "15" },
    "income-tax-calculator": { annualIncome: "1200000" },
    "percentage-calculator": { number: "750", percentage: "25" },
    "bmi-calculator": { height: "170", weight: "70" },
    "age-calculator": { dateOfBirth: "1995-06-15" },
    "compound-interest-calculator": { principal: "100000", rate: "8", time: "5" },
    "discount-calculator": { originalPrice: "2999", discountPercent: "30" },
    "home-loan-calculator": { loanAmount: "5000000", interestRate: "8.5", tenure: "20" },
    "salary-calculator": { monthlySalary: "50000" },
    "love-calculator": { name1: "Rahul", name2: "Priya" },
  };

  return {
    hook,
    scene1: `Open ${tool.name} on sabtools.in`,
    narration1,
    scene2: `Enter values and see instant results`,
    narration2,
    cta,
    title: `${tool.name} — How to Use FREE! ${tool.icon} #shorts`,
    description: `Learn how to use ${tool.name} for free at sabtools.in\nStep-by-step tutorial — no signup needed!\n450+ Free Online Tools for India\n#FreeTools #India #SabTools #HowTo #Tutorial`,
    tags: [tool.name.toLowerCase(), "free tools", "india", "sabtools", "how to", "tutorial", tool.category, "free", "online tool", "step by step"],
    demoValues: demoValuesMap[tool.slug] || {},
    fullText: "",
  };
}

async function callGemini(tool) {
  const prompt = `You are a viral Indian YouTube Shorts scriptwriter. Write a 30-second YouTube Short script for this free online tool.

Tool: ${tool.name}
Description: ${tool.description}
Category: ${tool.category}
Website: sabtools.in

FORMAT (follow exactly):
HOOK: [1 punchy line to grab attention in first 2 seconds — use Hindi-English mix like Indians actually speak. Examples: "Yeh calculator aapke lakhs bacha sakta hai!", "Stop wasting money on apps!"]

SCENE_1: [What to show on screen — describe the tool being used with SPECIFIC demo values]
NARRATION_1: [What to say — 2-3 sentences explaining the tool, mix Hindi-English naturally]

SCENE_2: [Show the result/output with specific numbers]
NARRATION_2: [React to the result, explain why it's useful — 2 sentences]

CTA: [Call to action — mention sabtools.in, "Link comment section mein hai", and "450+ free tools"]

TITLE: [YouTube Short title — catchy, under 60 chars, include emoji]
DESCRIPTION: [2-3 lines with hashtags — #FreeTools #India #SabTools]
TAGS: [comma-separated relevant tags, 8-10 tags]

DEMO_VALUES: [JSON object with input field names and values to type into the tool for the demo. Example for EMI calculator: {"loanAmount": "2500000", "interestRate": "8.5", "tenure": "20"}]

RULES:
- Keep it NATURAL — speak like a real Indian YouTuber, not a robot
- Use Hindi-English mix (Hinglish) for narration
- Include specific numbers in the demo (not generic)
- Make the hook surprising or relatable to Indian audience
- Total speaking time should be ~30 seconds
- DEMO_VALUES must be valid JSON`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${config.GEMINI_MODEL}:generateContent?key=${config.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.9, maxOutputTokens: 1000 },
      }),
    }
  );

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

  // Parse the script
  const script = {
    hook: extractField(text, "HOOK"),
    scene1: extractField(text, "SCENE_1"),
    narration1: extractField(text, "NARRATION_1"),
    scene2: extractField(text, "SCENE_2"),
    narration2: extractField(text, "NARRATION_2"),
    cta: extractField(text, "CTA"),
    title: extractField(text, "TITLE"),
    description: extractField(text, "DESCRIPTION"),
    tags: extractField(text, "TAGS").split(",").map((t) => t.trim()),
    demoValues: extractDemoValues(text),
    fullText: text,
  };

  return script;
}

function extractField(text, field) {
  const regex = new RegExp(`${field}:\\s*(.+?)(?=\\n[A-Z_]+:|$)`, "s");
  const match = text.match(regex);
  return match ? match[1].trim().replace(/^\[|\]$/g, "") : "";
}

function extractDemoValues(text) {
  const regex = /DEMO_VALUES:\s*\[?\s*(\{[\s\S]*?\})\s*\]?/;
  const match = text.match(regex);
  if (match) {
    try {
      return JSON.parse(match[1]);
    } catch {
      return {};
    }
  }
  return {};
}

module.exports = { generateScript };
