"use client";

import { useEffect, useState, useCallback, useRef } from "react";

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  const rafId = useRef<number>(0);

  const updateProgress = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight > 0) {
      setProgress(Math.min((scrollTop / docHeight) * 100, 100));
    }
  }, []);

  const handleScroll = useCallback(() => {
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
    }
    rafId.current = requestAnimationFrame(updateProgress);
  }, [updateProgress]);

  useEffect(() => {
    updateProgress();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [handleScroll, updateProgress]);

  return (
    <div className="fixed top-0 left-0 w-full h-[3px] z-50 bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
