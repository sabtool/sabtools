"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { categories } from "@/lib/tools";
import ThemeToggle from "@/components/ThemeToggle";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHindi = pathname.startsWith("/hi");

  // Build the toggle URL
  const getToggleUrl = () => {
    if (isHindi) {
      // Hindi → English: remove /hi prefix
      return pathname.replace(/^\/hi/, "") || "/";
    }
    // English → Hindi: add /hi prefix
    if (pathname.startsWith("/tools/")) {
      return "/hi" + pathname;
    }
    return "/hi";
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <svg width="36" height="36" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" className="shadow-md rounded-xl">
              <defs>
                <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7C3AED" />
                  <stop offset="50%" stopColor="#6366F1" />
                  <stop offset="100%" stopColor="#3B82F6" />
                </linearGradient>
              </defs>
              <rect width="512" height="512" rx="128" fill="url(#logoGrad)"/>
              <rect x="80" y="80" width="155" height="155" rx="32" fill="white" opacity="0.9"/>
              <rect x="277" y="80" width="155" height="155" rx="32" fill="white" opacity="0.6"/>
              <rect x="80" y="277" width="155" height="155" rx="32" fill="white" opacity="0.6"/>
              <rect x="277" y="277" width="155" height="155" rx="32" fill="white" opacity="0.35"/>
              <text x="157" y="185" fontFamily="Arial, Helvetica, sans-serif" fontSize="120" fontWeight="bold" fill="#7C3AED" textAnchor="middle">S</text>
            </svg>
            <span className="text-xl font-bold tracking-tight"><span className="text-gray-900">Sab</span><span className="text-purple-600">Tools</span><span className="text-purple-400 text-base font-normal">.in</span></span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Link href="/" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition">
              Home
            </Link>
            <div className="relative group">
              <button className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition flex items-center gap-1">
                Tools
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute top-full left-0 mt-1 w-72 max-h-96 overflow-y-auto bg-white rounded-2xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-2">
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/category/${cat.slug}`}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-indigo-50 transition"
                  >
                    <span className="text-xl">{cat.icon}</span>
                    <div>
                      <div className="text-sm font-semibold text-gray-800">{cat.name}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            <Link href="/blog" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition">
              Blog
            </Link>
            <Link href="/about" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition">
              About
            </Link>

            {/* Language Toggle — Smooth Slide */}
            <Link
              href={getToggleUrl()}
              className="ml-2 flex items-center bg-gray-100 rounded-full p-0.5 cursor-pointer hover:bg-gray-200 transition-colors"
              title={isHindi ? "Switch to English" : "हिंदी में देखें"}
            >
              <span
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
                  !isHindi
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-gray-500"
                }`}
              >
                EN
              </span>
              <span
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
                  isHindi
                    ? "bg-orange-500 text-white shadow-sm"
                    : "text-gray-500"
                }`}
              >
                हिंदी
              </span>
            </Link>
            <ThemeToggle />
          </nav>

          {/* Mobile: Language Toggle + Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            {/* Mobile Language Toggle */}
            <Link
              href={getToggleUrl()}
              className="flex items-center bg-gray-100 rounded-full p-0.5"
            >
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all duration-300 ${
                  !isHindi
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-gray-400"
                }`}
              >
                EN
              </span>
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all duration-300 ${
                  isHindi
                    ? "bg-orange-500 text-white shadow-sm"
                    : "text-gray-400"
                }`}
              >
                हि
              </span>
            </Link>

            <ThemeToggle />

            {/* Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 max-h-[70vh] overflow-y-auto">
          <Link href="/" className="block py-2 text-gray-700 font-medium" onClick={() => setMenuOpen(false)}>
            Home
          </Link>
          <Link href="/blog" className="block py-2 text-gray-700 font-medium" onClick={() => setMenuOpen(false)}>
            Blog
          </Link>
          <Link href="/about" className="block py-2 text-gray-700 font-medium" onClick={() => setMenuOpen(false)}>
            About
          </Link>
          <div className="border-t border-gray-100 mt-2 pt-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Categories</p>
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="flex items-center gap-2 py-2 text-gray-600"
                onClick={() => setMenuOpen(false)}
              >
                <span>{cat.icon}</span>
                <span className="text-sm">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
