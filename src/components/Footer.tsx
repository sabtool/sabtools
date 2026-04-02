import Link from "next/link";
import { categories } from "@/lib/tools";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <svg width="36" height="36" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" className="rounded-xl">
                <defs>
                  <linearGradient id="footerLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#7C3AED" />
                    <stop offset="50%" stopColor="#6366F1" />
                    <stop offset="100%" stopColor="#3B82F6" />
                  </linearGradient>
                </defs>
                <rect width="512" height="512" rx="128" fill="url(#footerLogoGrad)"/>
                <rect x="80" y="80" width="155" height="155" rx="32" fill="white" opacity="0.9"/>
                <rect x="277" y="80" width="155" height="155" rx="32" fill="white" opacity="0.6"/>
                <rect x="80" y="277" width="155" height="155" rx="32" fill="white" opacity="0.6"/>
                <rect x="277" y="277" width="155" height="155" rx="32" fill="white" opacity="0.35"/>
                <text x="157" y="185" fontFamily="Arial, Helvetica, sans-serif" fontSize="120" fontWeight="bold" fill="#7C3AED" textAnchor="middle">S</text>
              </svg>
              <span className="text-xl font-bold text-white">
                Sab<span className="text-purple-400">Tools</span><span className="text-purple-300 text-sm font-light">.in</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              India&apos;s #1 free online tools website. 318+ calculators, converters, AI tools, PDF tools, developer tools and more. No signup, no limits, 100% free.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/category/${cat.slug}`} className="text-sm text-gray-400 hover:text-indigo-400 transition">
                    {cat.icon} {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Tools */}
          <div>
            <h3 className="text-white font-semibold mb-4">Popular Tools</h3>
            <ul className="space-y-2">
              {[
                { name: "EMI Calculator", slug: "emi-calculator" },
                { name: "SIP Calculator", slug: "sip-calculator" },
                { name: "GST Calculator", slug: "gst-calculator" },
                { name: "Word Counter", slug: "word-counter" },
                { name: "JSON Formatter", slug: "json-formatter" },
                { name: "Image Compressor", slug: "image-compressor" },
              ].map((t) => (
                <li key={t.slug}>
                  <Link href={`/tools/${t.slug}`} className="text-sm text-gray-400 hover:text-indigo-400 transition">
                    {t.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-sm text-gray-400 hover:text-indigo-400 transition">About Us</Link></li>
              <li><Link href="/blog" className="text-sm text-gray-400 hover:text-indigo-400 transition">Blog</Link></li>
              <li><Link href="/privacy" className="text-sm text-gray-400 hover:text-indigo-400 transition">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm text-gray-400 hover:text-indigo-400 transition">Terms of Service</Link></li>
              <li><Link href="/contact" className="text-sm text-gray-400 hover:text-indigo-400 transition">Contact Us</Link></li>
              <li><Link href="/disclaimer" className="text-sm text-gray-400 hover:text-indigo-400 transition">Disclaimer</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} SabTools.in. All rights reserved. Made with ❤️ in India
          </p>
          <p className="text-xs text-gray-600">
            Free online tools for calculators, converters, text utilities & developer tools
          </p>
        </div>
      </div>
    </footer>
  );
}
