import Link from "next/link";
import NewsletterSignup from "@/components/NewsletterSignup";
import { tools, categories } from "@/lib/tools";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      {/* Newsletter Banner */}
      <div className="border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
          <NewsletterSignup />
        </div>
      </div>

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
              India&apos;s leading free online tools platform. {tools.length}+ calculators, converters, AI tools, PDF tools, developer tools and more. No signup, no limits, 100% free.
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
              <li><Link href="/author/rakesh-kushwaha" className="text-sm text-gray-400 hover:text-indigo-400 transition">Our Team</Link></li>
              <li><Link href="/blog" className="text-sm text-gray-400 hover:text-indigo-400 transition">Blog</Link></li>
              <li><Link href="/privacy" className="text-sm text-gray-400 hover:text-indigo-400 transition">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm text-gray-400 hover:text-indigo-400 transition">Terms of Service</Link></li>
              <li><Link href="/disclaimer" className="text-sm text-gray-400 hover:text-indigo-400 transition">Disclaimer</Link></li>
              <li><Link href="/contact" className="text-sm text-gray-400 hover:text-indigo-400 transition">Contact Us</Link></li>
              <li><Link href="/sitemap.xml" className="text-sm text-gray-400 hover:text-indigo-400 transition">Sitemap</Link></li>
              <li><Link href="/hi" className="text-sm text-gray-400 hover:text-indigo-400 transition">हिंदी (Hindi)</Link></li>
            </ul>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-sm text-gray-500">
                &copy; {new Date().getFullYear()} SabTools.in. All rights reserved. Made with ❤️ in India
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Free online tools for calculators, converters, text utilities & developer tools
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-gray-500 mr-1">Follow us:</span>
              <a href="https://twitter.com/sabtools" target="_blank" rel="nofollow noopener noreferrer" aria-label="Twitter" className="text-gray-500 hover:text-blue-400 transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://youtube.com/@sabtools" target="_blank" rel="nofollow noopener noreferrer" aria-label="YouTube" className="text-gray-500 hover:text-red-500 transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              <a href="https://linkedin.com/company/sabtools" target="_blank" rel="nofollow noopener noreferrer" aria-label="LinkedIn" className="text-gray-500 hover:text-blue-500 transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <a href="https://github.com/sabtool" target="_blank" rel="nofollow noopener noreferrer" aria-label="GitHub" className="text-gray-500 hover:text-white transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
