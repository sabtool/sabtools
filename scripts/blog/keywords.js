#!/usr/bin/env node

/**
 * Keyword Research Module
 * Fetches trending keywords from Google Autocomplete + pre-built category pools
 * Returns 15-25 high-value keywords per tool for blog SEO
 */

const https = require("https");

// ─── Google Autocomplete (free, no API key) ───
function fetchAutocompleteSuggestions(query) {
  return new Promise((resolve) => {
    const url = `https://suggestqueries.google.com/complete/search?client=firefox&gl=in&hl=en&q=${encodeURIComponent(query)}`;
    https
      .get(url, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            const parsed = JSON.parse(data);
            resolve(parsed[1] || []);
          } catch {
            resolve([]);
          }
        });
      })
      .on("error", () => resolve([]));
  });
}

// ─── Fetch keywords from multiple query patterns ───
async function fetchTrendingKeywords(toolName, category) {
  const queries = [
    toolName,
    `${toolName} online`,
    `${toolName} free`,
    `${toolName} India`,
    `best ${toolName}`,
    `how to use ${toolName}`,
  ];

  const allSuggestions = [];
  for (const q of queries) {
    try {
      const suggestions = await fetchAutocompleteSuggestions(q);
      allSuggestions.push(...suggestions);
    } catch {
      // Skip failed queries
    }
    // Small delay to avoid rate limiting
    await new Promise((r) => setTimeout(r, 200));
  }

  // Deduplicate and clean
  const unique = [...new Set(allSuggestions.map((s) => s.toLowerCase().trim()))];
  return unique.filter((s) => s.length > 3 && s.length < 80).slice(0, 15);
}

// ─── Category-specific high-traffic keyword pools (Indian market) ───
const categoryKeywordPools = {
  finance: [
    "emi calculator", "loan calculator india", "sip returns calculator",
    "fd interest calculator", "ppf calculator 2026", "income tax calculator india",
    "gst calculator online", "home loan emi", "car loan emi calculator",
    "mutual fund calculator", "compound interest calculator", "salary calculator india",
    "gratuity calculator", "nps calculator", "rd calculator online",
    "personal loan emi", "education loan calculator", "lumpsum calculator",
    "inflation calculator india", "cagr calculator", "sukanya samriddhi calculator",
    "epf calculator", "hra exemption calculator", "tds calculator",
    "stamp duty calculator", "investment calculator", "loan eligibility",
    "monthly installment calculator", "interest rate calculator", "tax saving calculator",
  ],
  math: [
    "percentage calculator", "age calculator", "bmi calculator",
    "discount calculator", "average calculator online", "number to words converter",
    "random number generator", "scientific calculator online",
    "margin calculator", "profit calculator", "fraction calculator",
    "square root calculator", "percentage increase calculator",
  ],
  text: [
    "word counter online", "character counter", "case converter online",
    "text to speech online", "speech to text online", "plagiarism checker free",
    "grammar checker free", "readability checker", "lorem ipsum generator",
    "text repeater", "fancy text generator", "paragraph rewriter online",
    "remove duplicate lines", "word count tool", "sentence counter",
  ],
  developer: [
    "json formatter online", "json validator", "base64 encode decode",
    "url encoder decoder", "html encoder", "color picker online",
    "hash generator md5 sha256", "regex tester online", "css minifier",
    "javascript minifier", "sql formatter online", "cron expression generator",
    "jwt decoder online", "csv to json converter", "xml to json",
  ],
  image: [
    "image compressor online", "image resizer", "image to pdf converter",
    "png to jpg converter", "jpg to png online", "webp converter",
    "image cropper online", "background remover free", "image format converter",
    "compress image for government form", "passport photo maker",
    "bulk image resizer", "image to base64", "heic to jpg converter",
  ],
  seo: [
    "meta tag generator", "sitemap generator", "robots txt generator",
    "schema markup generator", "keyword density checker", "serp preview tool",
    "open graph generator", "backlink checker free", "page speed checker",
    "structured data generator", "redirect checker", "domain age checker",
  ],
  health: [
    "bmi calculator", "bmr calculator", "calorie calculator",
    "ideal weight calculator", "body fat calculator", "water intake calculator",
    "heart rate zone calculator", "pregnancy calculator", "sleep calculator",
    "protein intake calculator", "blood pressure checker",
  ],
  tax: [
    "income tax calculator 2026", "hra calculator", "tds calculator india",
    "professional tax calculator", "stamp duty calculator", "gst calculator",
    "epf calculator", "nps tax benefit", "80c deduction calculator",
    "old vs new tax regime", "advance tax calculator", "capital gains tax",
  ],
  converters: [
    "unit converter online", "currency converter inr", "temperature converter",
    "length converter", "weight converter", "speed converter",
    "data storage converter", "area converter", "volume converter",
    "feet to meters", "kg to pounds", "celsius to fahrenheit",
  ],
  security: [
    "password generator", "password strength checker", "hash generator",
    "ssl checker online", "dns lookup tool", "whois lookup",
    "email leak checker", "ip address lookup", "http header checker",
  ],
  pdf: [
    "merge pdf online free", "split pdf", "compress pdf online",
    "pdf to image converter", "image to pdf", "pdf to word converter",
    "word to pdf converter", "pdf page remover", "pdf tools online free",
  ],
  social: [
    "instagram bio generator", "hashtag generator", "social media image resizer",
    "twitter character counter", "linkedin post generator", "instagram grid maker",
  ],
  education: [
    "cgpa to percentage", "gpa calculator", "grade calculator",
    "study planner", "assignment word counter", "flashcard maker",
    "timetable generator", "marks percentage calculator",
  ],
  business: [
    "gst invoice generator", "profit loss calculator", "roi calculator",
    "break even calculator", "business name generator", "privacy policy generator",
    "terms conditions generator",
  ],
  css: [
    "css gradient generator", "box shadow generator", "border radius generator",
    "glassmorphism generator", "flexbox playground", "css grid generator",
    "tailwind generator", "text shadow generator",
  ],
  fun: [
    "love calculator", "flip a coin", "roll a dice",
    "typing speed test", "truth or dare", "would you rather",
    "lucky number generator", "nickname generator",
  ],
  realestate: [
    "plot area calculator", "carpet area calculator", "paint calculator",
    "tile calculator", "brick calculator", "cement calculator",
    "home loan affordability", "rent vs buy calculator", "stamp duty calculator",
  ],
  electrical: [
    "voltage drop calculator", "wire size calculator", "power consumption calculator",
    "ohms law calculator", "solar panel calculator", "electrical load calculator",
    "transformer calculator",
  ],
  cooking: [
    "recipe unit converter", "cooking time calculator", "gas cylinder calculator",
    "water tds calculator", "calorie counter indian food",
  ],
  wedding: [
    "wedding budget calculator", "wedding date finder", "wedding food calculator",
    "guest list manager", "gift registry calculator",
  ],
  agriculture: [
    "crop yield calculator", "fertilizer calculator", "irrigation calculator",
    "seed rate calculator", "farm profit calculator", "land measurement converter",
  ],
  exam: [
    "neet score predictor", "jee rank predictor", "gate score calculator",
    "cat percentile calculator", "board percentage calculator",
  ],
  vehicle: [
    "mileage calculator", "car insurance estimator", "road trip planner",
    "toll calculator india", "vehicle depreciation calculator",
    "tyre size calculator", "fuel cost calculator",
  ],
  astrology: [
    "kundli calculator", "rashi calculator", "nakshatra calculator",
    "panchang calculator", "numerology calculator", "name numerology",
    "gemstone recommendation",
  ],
  legal: [
    "court fee calculator", "legal notice generator", "rti application generator",
    "affidavit generator",
  ],
  ai: [
    "ai writing tools free", "ai email writer", "ai essay writer",
    "ai paragraph rewriter", "ai resume builder", "ai cover letter generator",
    "ai bio generator", "ai story generator", "ai poem generator",
    "chatgpt alternative free", "ai content writer india",
  ],
  science: [
    "graphing calculator online", "matrix calculator", "quadratic solver",
    "statistics calculator", "probability calculator", "trigonometry calculator",
  ],
  construction: [
    "concrete calculator", "steel weight calculator", "plywood calculator",
    "flooring cost calculator", "water tank calculator", "staircase calculator",
    "roof area calculator", "pipe size calculator",
  ],
  charts: [
    "chart maker online", "table generator", "flowchart maker",
    "mind map generator", "csv editor online", "sql table generator",
  ],
  career: [
    "resume builder free", "salary comparison tool", "notice period calculator",
    "experience calculator", "appraisal hike calculator",
  ],
  shopping: [
    "discount calculator", "cashback calculator", "price per unit comparator",
    "emi affordability calculator", "gst inclusive exclusive calculator",
  ],
  student: [
    "graph paper generator", "flashcard maker", "timetable generator",
    "handwriting page generator", "assignment word counter",
  ],
  indiaguide: [
    "aadhaar card masking", "indian festival calendar", "train seat layout",
    "pin code directory india", "ration card info", "voter id info",
    "government scheme checker india",
  ],
  datetime: [
    "date calculator", "countdown timer", "timezone converter",
    "stopwatch online", "pomodoro timer", "world clock",
    "working days calculator", "unix timestamp converter",
  ],
  whatsapp: [
    "whatsapp link generator", "whatsapp formatter", "upi qr generator",
    "ifsc code lookup", "mobile number tracker", "pan card validator",
  ],
  data: [
    "json to csv converter", "csv to json", "json to table viewer",
    "csv viewer editor", "yaml to json", "xml to json converter",
  ],
};

// ─── Long-tail keyword generator ───
function generateLongTailKeywords(toolName, category) {
  const year = new Date().getFullYear();
  const patterns = [
    `${toolName} online free`,
    `${toolName} online free india`,
    `${toolName} ${year}`,
    `best ${toolName} online`,
    `free ${toolName} no signup`,
    `${toolName} for india`,
    `how to use ${toolName}`,
    `${toolName} step by step guide`,
    `${toolName} calculator online`,
    `${toolName} tool free`,
  ];
  return patterns.map((p) => p.toLowerCase());
}

// ─── Main: Get all keywords for a tool ───
async function getKeywordsForTool(tool) {
  const { name, slug, keywords: existingKeywords, category } = tool;

  // 1. Google Autocomplete (live trending)
  let autocompleteKw = [];
  try {
    autocompleteKw = await fetchTrendingKeywords(name, category);
  } catch (e) {
    console.log("  Autocomplete failed, using fallback keywords");
  }

  // 2. Category keyword pool
  const poolKw = categoryKeywordPools[category] || [];
  // Pick 5-8 from pool that are most relevant (contain part of tool name or category)
  const nameParts = name.toLowerCase().split(/\s+/);
  const relevantPool = poolKw
    .filter((kw) => nameParts.some((part) => kw.includes(part)) || kw.includes(category))
    .slice(0, 8);
  const randomPool = poolKw
    .filter((kw) => !relevantPool.includes(kw))
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  // 3. Tool's existing keywords
  const toolKw = (existingKeywords || []).map((k) => k.toLowerCase());

  // 4. Long-tail auto-generated
  const longTailKw = generateLongTailKeywords(name, category);

  // Combine and deduplicate
  const allKw = [
    ...toolKw,
    ...autocompleteKw,
    ...relevantPool,
    ...randomPool,
    ...longTailKw,
  ];

  const unique = [...new Set(allKw.map((k) => k.trim().toLowerCase()))].filter(
    (k) => k.length > 2 && k.length < 80
  );

  // Pick top 20-25
  const finalKeywords = unique.slice(0, 25);

  // Pick primary keyword (tool name + main action)
  const primaryKeyword = `${name.toLowerCase()} online free`;

  // Pick top 8 for meta keywords
  const metaKeywords = finalKeywords.slice(0, 8);

  return {
    all: finalKeywords,
    primary: primaryKeyword,
    meta: metaKeywords,
    autocomplete: autocompleteKw,
    longTail: longTailKw.slice(0, 5),
    categoryPool: [...relevantPool, ...randomPool],
  };
}

module.exports = { getKeywordsForTool, categoryKeywordPools, fetchTrendingKeywords };
