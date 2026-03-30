import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // Headers & redirects handled by vercel.json (required for static export)
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  trailingSlash: false,
};

export default nextConfig;
