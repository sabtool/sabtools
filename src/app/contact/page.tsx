"use client";

import { useState, FormEvent } from "react";
import Breadcrumb from "@/components/Breadcrumb";

/* ── SEO metadata (exported from a separate file for static export compatibility) ── */
// Note: metadata must be in a server component. We move it to layout or use generateMetadata.
// For static export with "use client", we set <title> and <meta> via <head> below.

const SUBJECTS = [
  "General Inquiry",
  "Tool Request",
  "Bug Report",
  "Feedback",
  "Business / Partnership",
] as const;

const FAQ_ITEMS = [
  {
    q: "Are all the tools on SabTools.in really free?",
    a: "Yes, every tool on SabTools.in is 100% free to use with no hidden charges, no signup required, and no usage limits.",
  },
  {
    q: "How do I request a new tool?",
    a: "Use the contact form above and select \"Tool Request\" as the subject. Describe the tool you need and we will try to add it as soon as possible.",
  },
  {
    q: "I found a bug or incorrect calculation. How do I report it?",
    a: "Please select \"Bug Report\" in the form above and describe the issue in detail including the tool name, your inputs, and the expected vs actual output.",
  },
  {
    q: "How long does it take to get a response?",
    a: "We typically respond within 24-48 hours on business days. For urgent issues, please mention it in the subject line.",
  },
  {
    q: "Can I use SabTools.in tools for commercial purposes?",
    a: "Our tools are designed for personal and educational use. For commercial or enterprise inquiries, please reach out via the Business / Partnership option.",
  },
  {
    q: "Is my data safe when I use the calculators?",
    a: "Absolutely. All calculations run directly in your browser. We do not store, transmit, or collect any data you enter into our tools.",
  },
];

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("https://formsubmit.co/ajax/sabtools.ltd@gmail.com", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });

      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      {/* SEO head tags for client component */}
      <title>Contact Us — SabTools.in | Free Online Tools for India</title>
      <meta
        name="description"
        content="Get in touch with the SabTools.in team. Report bugs, request new tools, share feedback, or explore business partnerships. We typically respond within 24-48 hours."
      />
      <link rel="canonical" href="https://sabtools.in/contact" />
      <meta property="og:title" content="Contact Us — SabTools.in" />
      <meta
        property="og:description"
        content="Get in touch with the SabTools.in team. Report bugs, request new tools, share feedback, or explore business partnerships."
      />
      <meta property="og:url" content="https://sabtools.in/contact" />
      <meta property="og:type" content="website" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Contact Us" }]} />

        {/* ── Hero ── */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
            Contact Us
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Have a question, suggestion, or found something broken? We would love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* ── Form ── */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
              {status === "success" ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h2>
                  <p className="text-gray-500 mb-6">
                    Thank you for reaching out. We will get back to you within 24-48 hours.
                  </p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Hidden fields for formsubmit.co */}
                  <input type="hidden" name="_subject" value="New Contact Form Submission — SabTools.in" />
                  <input type="hidden" name="_captcha" value="false" />
                  <input type="hidden" name="_template" value="table" />
                  <input type="text" name="_honey" className="hidden" />

                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="Your full name"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      defaultValue=""
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition appearance-none"
                    >
                      <option value="" disabled>
                        Select a subject
                      </option>
                      {SUBJECTS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      placeholder="Tell us what's on your mind..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-y"
                    />
                  </div>

                  {/* Error Banner */}
                  {status === "error" && (
                    <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Something went wrong. Please try again or email us directly at <strong>sabtools.ltd@gmail.com</strong>.</span>
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition disabled:opacity-60 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                  >
                    {status === "sending" ? (
                      <>
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* ── Sidebar Info ── */}
          <div className="space-y-6">
            {/* Email Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Get in Touch</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-700">Email</div>
                    <a
                      href="mailto:sabtools.ltd@gmail.com"
                      className="text-indigo-600 hover:text-indigo-700 text-sm break-all transition"
                    >
                      sabtools.ltd@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-700">Response Time</div>
                    <p className="text-gray-500 text-sm">Within 24-48 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-700">Website</div>
                    <p className="text-gray-500 text-sm">sabtools.in</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 p-6">
              <h3 className="text-sm font-bold text-indigo-900 mb-3">Tips for Faster Help</h3>
              <ul className="space-y-2 text-sm text-indigo-800">
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Include the tool name when reporting bugs
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Share expected vs actual results
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Mention your browser and device
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* ── FAQ Section ── */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-500">Quick answers to common questions about SabTools.in</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {FAQ_ITEMS.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition"
                >
                  <span className="font-semibold text-gray-900 pr-4">{item.q}</span>
                  <svg
                    className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${
                      openFaq === idx ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-200 ${
                    openFaq === idx ? "max-h-48 pb-4" : "max-h-0"
                  }`}
                >
                  <p className="px-6 text-gray-600 text-sm leading-relaxed">{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── JSON-LD for Contact Page ── */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ContactPage",
              name: "Contact SabTools.in",
              description:
                "Get in touch with the SabTools.in team for feedback, bug reports, tool requests, or business inquiries.",
              url: "https://sabtools.in/contact",
              mainEntity: {
                "@type": "Organization",
                name: "SabTools.in",
                url: "https://sabtools.in",
                email: "sabtools.ltd@gmail.com",
                contactPoint: {
                  "@type": "ContactPoint",
                  email: "sabtools.ltd@gmail.com",
                  contactType: "customer support",
                  availableLanguage: ["English", "Hindi"],
                },
              },
            }),
          }}
        />

        {/* FAQ JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: FAQ_ITEMS.map((item) => ({
                "@type": "Question",
                name: item.q,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: item.a,
                },
              })),
            }),
          }}
        />
      </div>
    </>
  );
}
