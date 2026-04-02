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
    <section className="mt-12">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <FaqAccordionItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>
      {/* FAQ Schema JSON-LD for Google Rich Results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            })),
          }),
        }}
      />
    </section>
  );
}

function FaqAccordionItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-gray-50 transition"
        aria-expanded={isOpen}
      >
        <span className="font-semibold text-gray-800 text-sm sm:text-base pr-4">{question}</span>
        <svg
          className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed bg-gray-50">
          {answer}
        </div>
      )}
    </div>
  );
}
