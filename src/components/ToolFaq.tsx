"use client";

import { useState } from "react";

interface ToolFaqProps {
  toolName: string;
  description: string;
  category?: string;
  keywords?: string[];
  customFaqs?: { question: string; answer: string }[];
}

interface FaqItem {
  question: string;
  answer: string;
}

export default function ToolFaq({ toolName, description, customFaqs }: ToolFaqProps) {
  const faqs: FaqItem[] = customFaqs && customFaqs.length > 0
    ? customFaqs
    : [
        {
          question: `What is ${toolName}?`,
          answer: `${toolName} is a free online tool on SabTools.in. ${description}. It runs entirely in your browser with no downloads or installations needed.`,
        },
        {
          question: `Is ${toolName} free to use?`,
          answer: `Yes, ${toolName} is completely free to use. No signup, no registration, and no hidden charges. You can use it unlimited times without any restrictions.`,
        },
        {
          question: `How to use ${toolName}?`,
          answer: `Simply enter your values in the input fields provided and get instant results. The tool processes everything in your browser in real-time.`,
        },
        {
          question: `Is my data safe with ${toolName}?`,
          answer: `Absolutely. ${toolName} processes all data locally in your browser. Your information never leaves your device and is not stored on any server.`,
        },
        {
          question: `Can I use ${toolName} on my mobile phone?`,
          answer: `Yes, ${toolName} is fully responsive and works perfectly on all devices including mobile phones, tablets, and desktop computers.`,
        },
      ];

  return (
    // Stable id/class used by the SpeakableSpecification cssSelector on the
    // page's WebPage node — so Google Assistant knows which DOM nodes are
    // the canonical Q&A pairs to read aloud (Strategy §2.4).
    <section id="faq-speakable" className="mt-12 faq-speakable">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <FaqAccordionItem
            key={index}
            question={faq.question}
            answer={faq.answer}
            // First two answers open by default: visible text for users
            // AND for AI text-extraction pipelines that skip JS (2026-08
            // GEO audit — accordion-hidden answers were invisible to
            // GPTBot/ClaudeBot-style extractors).
            defaultOpen={index < 2}
          />
        ))}
      </div>
      {/*
        FAQPage JSON-LD is intentionally NOT emitted here — it is rendered
        server-side as part of the unified @graph in ToolPageLayout.tsx so
        the structured data is one cohesive block and crawlers don't have
        to reconcile a separate, anonymous FAQPage with the page entity.
      */}
    </section>
  );
}

function FaqAccordionItem({
  question,
  answer,
  defaultOpen = false,
}: {
  question: string;
  answer: string;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden faq-item">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-gray-50 transition"
        aria-expanded={isOpen}
      >
        {/* `faq-q` / `faq-a` classes are addressed by the page's
            speakable cssSelector. Answer is always rendered (under
            hidden until expanded) so crawlers can read it without
            executing the open-state JS. */}
        <span className="font-semibold text-gray-800 text-sm sm:text-base pr-4 faq-q">{question}</span>
        <svg
          className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {/* ALWAYS rendered — collapsed via CSS, never removed from the DOM.
          The previous `{isOpen && ...}` meant the answer text did not
          exist in the server HTML at all: the Speakable selector `.faq-a`
          matched zero nodes and AI/text extractors saw questions with no
          answers (confirmed by three independent audit agents). */}
      <div
        className={`px-5 pb-4 text-sm text-gray-600 leading-relaxed bg-gray-50 faq-a ${
          isOpen ? "" : "hidden"
        }`}
      >
        {answer}
      </div>
    </div>
  );
}
