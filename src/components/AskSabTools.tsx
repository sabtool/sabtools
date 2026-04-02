"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";

interface Message {
  type: "bot" | "user";
  text: string;
  tools?: { slug: string; name: string }[];
}

const GEMINI_API_KEY = "AIzaSyCSIMV-VmC4XODdx8QhsZcxA5e2H3ehLH4";

const SYSTEM_PROMPT = `You are SabTools Assistant — a friendly, helpful AI chatbot for SabTools.in, India's largest free online tools website with 424+ tools.

Your job is to:
1. Help users find the right tool for their needs
2. Answer questions about tools, calculations, and general topics related to our tools
3. Give brief, helpful explanations when users ask "how to" questions
4. Always recommend relevant SabTools tools when applicable

IMPORTANT RULES:
- Keep responses SHORT (2-4 sentences max). Be concise and friendly.
- When recommending tools, include the tool slug in this exact format: [TOOL:tool-slug-here:Tool Name Here]
- You can recommend multiple tools using multiple [TOOL:slug:name] tags
- Speak naturally like a helpful human assistant
- If someone greets you, greet back warmly and ask how you can help
- Use simple English. Many users are Indian and may not speak perfect English.
- If asked about pricing — ALL tools are 100% free, no signup needed
- Don't make up tools that don't exist. Only recommend from the list below.
- For general knowledge questions unrelated to tools, give a brief answer and suggest a relevant tool if possible

Here are the main tool categories and popular tools (slug | name):

FINANCE: emi-calculator | EMI Calculator, sip-calculator | SIP Calculator, fd-calculator | FD Calculator, ppf-calculator | PPF Calculator, rd-calculator | RD Calculator, income-tax-calculator | Income Tax Calculator, gst-calculator | GST Calculator, salary-calculator | Salary Calculator, hra-calculator | HRA Calculator, gratuity-calculator | Gratuity Calculator, epf-calculator | EPF Calculator, nps-calculator | NPS Calculator, tds-calculator | TDS Calculator, home-loan-calculator | Home Loan Calculator, car-loan-calculator | Car Loan Calculator, education-loan-calculator | Education Loan Calculator, loan-eligibility-calculator | Loan Eligibility Calculator, compound-interest-calculator | Compound Interest Calculator, simple-interest-calculator | Simple Interest Calculator, lumpsum-calculator | Lumpsum Calculator, swp-calculator | SWP Calculator, cagr-calculator | CAGR Calculator, inflation-calculator | Inflation Calculator, roi-calculator | ROI Calculator, mutual-fund-calculator | Mutual Fund Calculator, elss-tax-calculator | ELSS Tax Calculator, sukanya-samriddhi-calculator | Sukanya Samriddhi Calculator, salary-hike-calculator | Salary Hike Calculator, fd-comparison | FD Comparison, discount-calculator | Discount Calculator, split-bill-calculator | Split Bill Calculator

HEALTH: bmi-calculator | BMI Calculator, calorie-calculator | Calorie Calculator, sleep-calculator | Sleep Calculator, pregnancy-calculator | Pregnancy Calculator, bmr-calculator | BMR Calculator, body-fat-calculator | Body Fat Calculator, water-intake-calculator | Water Intake Calculator, blood-alcohol-calculator | Blood Alcohol Calculator

IMAGE: image-compressor | Image Compressor, image-resizer | Image Resizer, image-cropper | Image Cropper, image-format-converter | Image Format Converter, background-remover | Background Remover, passport-photo-maker | Passport Photo Maker, image-watermark | Image Watermark, blur-background | Blur Background, image-to-text | Image to Text (OCR), meme-generator | Meme Generator, qr-code-generator | QR Code Generator

PDF: merge-pdf | Merge PDF, split-pdf | Split PDF, compress-pdf | Compress PDF, image-to-pdf | Image to PDF, pdf-to-word | PDF to Word

TEXT: word-counter | Word Counter, case-converter | Case Converter, lorem-ipsum-generator | Lorem Ipsum Generator, text-to-speech | Text to Speech, speech-to-text | Speech to Text, ai-email-writer | AI Email Writer, ai-essay-writer | AI Essay Writer, ai-story-generator | AI Story Generator, ai-cover-letter-generator | AI Cover Letter Generator, ai-wedding-invitation | AI Wedding Invitation, ai-resume-bullet-points | AI Resume Bullet Points

MATH: percentage-calculator | Percentage Calculator, age-calculator | Age Calculator, scientific-calculator | Scientific Calculator, number-to-words | Number to Words, date-difference-calculator | Date Difference Calculator

STUDENT: cgpa-to-percentage | CGPA to Percentage, gpa-calculator | GPA Calculator, typing-speed-test | Typing Speed Test

DEVELOPER: json-formatter | JSON Formatter, regex-tester | Regex Tester, base64-encoder-decoder | Base64 Encoder/Decoder, color-picker | Color Picker, css-gradient-generator | CSS Gradient Generator, meta-tag-generator | Meta Tag Generator

CONVERTER: currency-converter | Currency Converter, length-converter | Length Converter, weight-converter | Weight Converter, temperature-converter | Temperature Converter

SECURITY: password-generator | Password Generator, password-strength-checker | Password Strength Checker, aadhaar-validator | Aadhaar Validator, pan-card-validator | PAN Card Validator

UTILITY: electricity-bill-calculator | Electricity Bill Calculator, fuel-cost-calculator | Fuel Cost Calculator, gold-price-calculator | Gold Price Calculator, stamp-duty-calculator | Stamp Duty Calculator, rent-receipt-generator | Rent Receipt Generator, ifsc-bank-details | IFSC Bank Details, whatsapp-link-generator | WhatsApp Link Generator, upi-qr-generator | UPI QR Generator, solar-panel-calculator | Solar Panel Calculator, credit-score-estimator | Credit Score Estimator, countdown-timer | Countdown Timer, pomodoro-timer | Pomodoro Timer, love-calculator | Love Calculator

FUN: love-calculator | Love Calculator, meme-generator | Meme Generator, typing-speed-test | Typing Speed Test`;

interface ConversationMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

async function callGemini(userMessage: string, history: ConversationMessage[]): Promise<string> {
  const contents = [
    { role: "user" as const, parts: [{ text: SYSTEM_PROMPT }] },
    { role: "model" as const, parts: [{ text: "Understood! I'm SabTools Assistant. I'll help users find the right tools from SabTools.in's 424+ free tools. I'll keep responses short, friendly, and recommend tools using the [TOOL:slug:name] format. Ready to help!" }] },
    ...history,
    { role: "user" as const, parts: [{ text: userMessage }] },
  ];

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 300,
          },
        }),
      }
    );

    if (!res.ok) throw new Error("API call failed");

    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't process that. Try asking about a specific tool!";
  } catch {
    return "I'm having trouble connecting right now. In the meantime, try searching for tools on the homepage!";
  }
}

function parseResponse(text: string): { message: string; tools: { slug: string; name: string }[] } {
  const tools: { slug: string; name: string }[] = [];
  const toolRegex = /\[TOOL:([a-z0-9-]+):([^\]]+)\]/g;
  let match;

  while ((match = toolRegex.exec(text)) !== null) {
    tools.push({ slug: match[1], name: match[2] });
  }

  const message = text.replace(toolRegex, "").replace(/\n{3,}/g, "\n\n").trim();
  return { message, tools };
}

export default function AskSabTools() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { type: "bot", text: "Hi! I'm SabTools AI Assistant. Ask me anything — I can help you find the right tool, explain calculations, or answer your questions!" },
  ]);
  const [history, setHistory] = useState<ConversationMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    setInput("");
    setMessages((prev) => [...prev, { type: "user", text: trimmed }]);
    setIsLoading(true);

    const aiResponse = await callGemini(trimmed, history);
    const { message, tools } = parseResponse(aiResponse);

    setMessages((prev) => [...prev, { type: "bot", text: message, tools: tools.length > 0 ? tools : undefined }]);
    setHistory((prev) => [
      ...prev,
      { role: "user", parts: [{ text: trimmed }] },
      { role: "model", parts: [{ text: aiResponse }] },
    ]);
    setIsLoading(false);
  }, [input, isLoading, history]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed left-6 bottom-6 z-40 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 px-5 rounded-full shadow-lg hover:shadow-xl hover:from-indigo-700 hover:to-purple-700 transition-all active:scale-95 flex items-center gap-2 text-sm"
          aria-label="Ask SabTools"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <span className="hidden sm:inline">Ask SabTools AI</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed left-0 bottom-0 sm:left-6 sm:bottom-6 z-50 w-full sm:w-[380px] h-[65vh] sm:h-[500px] bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="font-semibold text-sm">SabTools AI Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/20 rounded-full transition-colors" aria-label="Close chat">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                    msg.type === "user"
                      ? "bg-indigo-600 text-white rounded-br-md"
                      : "bg-gray-100 text-gray-800 rounded-bl-md"
                  }`}
                >
                  {msg.text.split("\n").map((line, j) => (
                    <p key={j} className={j > 0 ? "mt-1" : ""}>{line}</p>
                  ))}
                  {msg.tools && msg.tools.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {msg.tools.map((tool, j) => (
                        <Link
                          key={j}
                          href={`/tools/${tool.slug}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1.5 rounded-full hover:bg-indigo-100 transition-colors border border-indigo-100"
                        >
                          {tool.name} &rarr;
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-500 px-4 py-2.5 rounded-2xl rounded-bl-md text-sm flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions */}
          {messages.length <= 1 && (
            <div className="px-4 pb-2 flex flex-wrap gap-1.5">
              {["Calculate EMI", "Compress image", "Income tax help", "Sleep calculator", "PDF tools"].map((q) => (
                <button
                  key={q}
                  onClick={() => { setInput(q); }}
                  className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors border border-indigo-100"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="px-3 py-3 border-t border-gray-100 shrink-0">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything..."
                disabled={isLoading}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                aria-label="Send message"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up { animation: slide-up 0.25s ease-out; }
      `}</style>
    </>
  );
}
