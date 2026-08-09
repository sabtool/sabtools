export interface Author {
  slug: string;
  name: string;
  role: string;
  initials: string;
  color: string;
  bio: string;
  expertise: string[];
  categories: string[];
  longBio: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
  };
}

export const authors: Author[] = [
  {
    slug: "rakesh-seervi",
    name: "Rakesh Seervi",
    role: "Founder & Lead Developer",
    initials: "RK",
    color: "#4f46e5",
    bio: "Full-stack developer with a passion for building tools that simplify everyday tasks for millions of Indians. Started SabTools.in with the belief that essential digital utilities should be free and accessible to everyone — from students in small towns to professionals in metro cities.",
    expertise: [
      "Full-Stack Web Development",
      "JavaScript & TypeScript",
      "React & Next.js",
      "Browser-Based Computation",
      "Performance Optimization",
      "SEO & Web Standards",
      "Open Source Development",
      "Product Architecture",
    ],
    categories: [
      "developer",
      "seo",
      "css",
      "data",
      "image",
      "pdf",
      "charts",
      "security",
    ],
    longBio:
      "Rakesh Seervi is the founder and lead developer of SabTools.in, India's largest free online tools platform. A self-taught full-stack developer from Uttar Pradesh, Rakesh began coding during his engineering studies and quickly developed a deep interest in building browser-based utilities that require zero server dependency.\n\nBefore launching SabTools.in in 2025, Rakesh worked with multiple Indian startups and freelance clients, building web applications focused on performance and accessibility. He noticed a persistent gap in the Indian digital ecosystem: most online tool websites were either behind paywalls, filled with intrusive ads, or simply did not cater to Indian formats like lakhs, crores, and GST slabs. This frustration became the founding motivation for SabTools.in.\n\nRakesh personally architects the platform's static-first approach, ensuring every tool runs entirely in the user's browser with zero data sent to any server. He leads the development of all developer tools, SEO utilities, CSS generators, data processing tools, and image processors on the platform. Under his technical leadership, SabTools.in achieves sub-second load times across India, even on budget Android devices and 2G connections.\n\nHe is passionate about making technology accessible to Bharat — not just India's metro cities but also tier-2 and tier-3 towns where internet speeds are inconsistent and devices are often entry-level. Every architectural decision on SabTools.in reflects this commitment to inclusivity and performance.",
    socialLinks: {
      twitter: "Sabtoolsin",
      linkedin: "rakeshseervi",
    },
  },
];

export function getAuthorBySlug(slug: string): Author | undefined {
  return authors.find((a) => a.slug === slug);
}

export function getAllAuthors(): Author[] {
  return authors;
}

/**
 * Resolve the most appropriate Author for a given tool-category slug.
 *
 * The `authors[]` array already declares which categories each expert
 * reviews via `Author.categories`. Returns the first author whose list
 * includes the slug — otherwise undefined, in which case callers should
 * fall back to the founder.
 *
 * Used by the blog Article schema (E-E-A-T author attribution per post)
 * and could replace the parallel `reviewerMap` in `components/ReviewedBy.tsx`
 * over time so the two stay in sync from a single source of truth.
 */
export function getAuthorByCategory(categorySlug: string): Author | undefined {
  if (!categorySlug) return undefined;
  const lc = categorySlug.toLowerCase();
  return authors.find((a) =>
    a.categories.some((c) => c.toLowerCase() === lc)
  );
}
