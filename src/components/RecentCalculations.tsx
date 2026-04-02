"use client";

import { useState, useEffect, useCallback } from "react";

const TOOLS = [
  "EMI Calculator",
  "SIP Calculator",
  "FD Calculator",
  "RD Calculator",
  "PPF Calculator",
  "Gratuity Calculator",
  "HRA Calculator",
  "Income Tax Calculator",
  "GST Calculator",
  "Loan Calculator",
  "Compound Interest Calculator",
  "Simple Interest Calculator",
  "Salary Calculator",
  "Age Calculator",
  "Percentage Calculator",
  "BMI Calculator",
  "Mutual Fund Calculator",
  "NPS Calculator",
  "EPF Calculator",
  "Home Loan Calculator",
];

const CITIES = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Chennai",
  "Hyderabad",
  "Pune",
  "Kolkata",
  "Ahmedabad",
  "Jaipur",
  "Lucknow",
  "Chandigarh",
  "Indore",
  "Kochi",
  "Bhopal",
  "Nagpur",
];

const EMOJIS = ["🔥", "📊", "💰", "📈", "✅", "⚡"];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateEntry() {
  const tool = randomItem(TOOLS);
  const city = randomItem(CITIES);
  const emoji = randomItem(EMOJIS);
  const minutes = Math.floor(Math.random() * 15) + 1;
  return `${emoji} Someone just used ${tool} from ${city} — ${minutes} min ago`;
}

export default function RecentCalculations() {
  const [visible, setVisible] = useState(true);
  const [message, setMessage] = useState("");
  const [fading, setFading] = useState(false);

  const cycleMessage = useCallback(() => {
    setFading(true);
    const fadeTimer = setTimeout(() => {
      setMessage(generateEntry());
      setFading(false);
    }, 400);
    return fadeTimer;
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (sessionStorage.getItem("rc_dismissed") === "1") {
      setVisible(false);
      return;
    }

    // Initial message after a short delay
    const initTimer = setTimeout(() => {
      setMessage(generateEntry());
    }, 3000);

    // Cycle every 4 seconds
    const interval = setInterval(() => {
      cycleMessage();
    }, 4000);

    return () => {
      clearTimeout(initTimer);
      clearInterval(interval);
    };
  }, [cycleMessage]);

  const dismiss = () => {
    setVisible(false);
    sessionStorage.setItem("rc_dismissed", "1");
  };

  if (!visible || !message) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "1rem",
        left: "1rem",
        zIndex: 50,
        maxWidth: "360px",
        width: "calc(100% - 2rem)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          background: "var(--rc-bg, #ffffff)",
          color: "var(--rc-text, #1f2937)",
          border: "1px solid var(--rc-border, #e5e7eb)",
          borderRadius: "0.75rem",
          padding: "0.625rem 0.75rem",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          fontSize: "0.8125rem",
          lineHeight: 1.4,
          opacity: fading ? 0 : 1,
          transform: fading ? "translateY(4px)" : "translateY(0)",
          transition: "opacity 0.4s ease, transform 0.4s ease",
        }}
      >
        <span style={{ flex: 1 }}>{message}</span>
        <button
          onClick={dismiss}
          aria-label="Dismiss notification"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--rc-text, #6b7280)",
            fontSize: "1rem",
            lineHeight: 1,
            padding: "0.125rem",
            flexShrink: 0,
            opacity: 0.6,
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
