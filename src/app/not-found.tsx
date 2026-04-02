"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { tools, categories } from "@/lib/tools";
import ToolCard from "@/components/ToolCard";

const popularToolSlugs = [
  "emi-calculator",
  "sip-calculator",
  "gst-calculator",
  "income-tax-calculator",
  "age-calculator",
  "percentage-calculator",
  "salary-calculator",
  "bmi-calculator",
  "word-counter",
  "json-formatter",
];

const popularTools = popularToolSlugs
  .map((slug) => tools.find((t) => t.slug === slug))
  .filter(Boolean) as typeof tools;

const featuredCategories = categories.slice(0, 12);

export default function NotFound() {
  const [query, setQuery] = useState("");

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return tools
      .filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.slug.includes(q) ||
          t.keywords.some((k) => k.toLowerCase().includes(q))
      )
      .slice(0, 8);
  }, [query]);

  const showSearch = query.trim().length > 0;

  return (
    <div className="min-h-[80vh]">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-16 pb-12 text-center relative">
          {/* 404 Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 font-semibold text-sm mb-6">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Error 404
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Page Not Found
          </h1>
          <p className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto">
            The page you&apos;re looking for doesn&apos;t exist or may have been moved.
            Try searching for the tool you need or explore our popular tools below.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto relative mb-4">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search 300+ free tools... (e.g. EMI, GST, password)"
              className="w-full pl-12 pr-5 py-4 rounded-2xl border border-gray-200 shadow-lg shadow-indigo-100/50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-lg bg-white"
              autoFocus
            />
          </div>

          {/* Go Home Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z" />
            </svg>
            Go to Homepage
          </Link>
        </div>
      </div>

      {/* Search Results */}
      {showSearch && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {searchResults.length > 0
              ? `Found ${searchResults.length} tool${searchResults.length !== 1 ? "s" : ""} for "${query}"`
              : `No tools found for "${query}"`}
          </h2>
          {searchResults.length === 0 && (
            <p className="text-gray-500 mb-6">
              Try different keywords or browse the popular tools and categories below.
            </p>
          )}
          {searchResults.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              {searchResults.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Popular Tools */}
      {!showSearch && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Popular Tools</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {popularTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </div>
      )}

      {/* Category Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Browse by Category</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {featuredCategories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="group flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-white hover:border-indigo-200 hover:shadow-md hover:shadow-indigo-50 transition-all duration-200"
            >
              <span className="text-2xl shrink-0">{cat.icon}</span>
              <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors leading-tight">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
        <div className="text-center mt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
          >
            View all {categories.length} categories
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
