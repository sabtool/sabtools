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
      twitter: "sabtools",
      linkedin: "rakeshseervi",
    },
  },
  {
    slug: "priya-sharma",
    name: "Priya Sharma",
    role: "Financial Content Head",
    initials: "PS",
    color: "#059669",
    bio: "Certified Financial Planner with over 8 years of experience in personal finance and investment advisory. Ensures all finance calculators on SabTools.in follow RBI guidelines and use the exact formulas that Indian banks apply.",
    expertise: [
      "Personal Finance & Investment Planning",
      "RBI Guidelines & Banking Regulations",
      "Mutual Funds & SIP Strategy",
      "Tax Planning (Old & New Regime)",
      "Loan & EMI Structuring",
      "Insurance Advisory",
      "SEBI Compliance",
      "Financial Literacy Education",
    ],
    categories: [
      "finance",
      "tax",
      "business",
      "realestate",
      "shopping",
    ],
    longBio:
      "Priya Sharma serves as the Financial Content Head at SabTools.in, where she oversees the accuracy and regulatory compliance of every finance-related tool on the platform. A SEBI-registered investment advisor and Certified Financial Planner (CFP) from the Financial Planning Standards Board India (FPSB India), Priya brings over eight years of hands-on experience in personal finance advisory to the team.\n\nAfter completing her MBA in Finance from Symbiosis International University, Pune, Priya worked with leading Indian financial institutions including a top mutual fund house and a prominent wealth management firm. During her career, she advised hundreds of Indian families on investment planning, retirement corpus building, and tax-efficient wealth creation strategies.\n\nAt SabTools.in, Priya ensures that every finance calculator — from EMI and SIP calculators to income tax and gratuity tools — uses the exact formulas applied by Indian banks and follows current RBI, SEBI, and Income Tax Department guidelines. She personally validates each calculation against real bank outputs and updates tools whenever policy changes occur, such as new tax slabs, revised PPF interest rates, or changes to GST rates.\n\nPriya is a strong advocate for financial literacy in India. She believes that access to accurate, easy-to-use financial calculators can empower crores of Indians to make informed decisions about loans, investments, and tax planning — without needing to pay for expensive financial advisory services. Her work at SabTools.in directly supports this mission by putting bank-grade calculation tools in the hands of every Indian, free of charge.",
    socialLinks: {
      linkedin: "priyasharma-finance",
    },
  },
  {
    slug: "vikram-mehta",
    name: "Vikram Mehta",
    role: "Senior Software Engineer",
    initials: "VM",
    color: "#0891b2",
    bio: "Software engineer specializing in web performance and browser-based computation. Responsible for ensuring every tool on SabTools.in runs instantly in the browser with zero server dependency, even on low-end Android devices.",
    expertise: [
      "Web Performance Engineering",
      "Client-Side Computation",
      "Progressive Web Apps",
      "Mobile-First Development",
      "Image & PDF Processing",
      "WebAssembly & Canvas API",
      "Cross-Browser Compatibility",
      "Accessibility (WCAG)",
    ],
    categories: [
      "image",
      "pdf",
      "converters",
      "text",
      "data",
      "charts",
      "social",
      "whatsapp",
    ],
    longBio:
      "Vikram Mehta is the Senior Software Engineer at SabTools.in, responsible for the platform's core performance architecture and browser-based processing engine. With a B.Tech in Computer Science from NIT Surat and over six years of experience in frontend engineering, Vikram specializes in building web applications that deliver desktop-class performance on mobile devices.\n\nBefore joining SabTools.in, Vikram worked at a Bangalore-based SaaS company where he built real-time collaboration tools used by thousands of Indian businesses. His expertise in client-side computation, WebAssembly, and the Canvas API made him the ideal engineer to tackle SabTools.in's core technical challenge: making every tool run entirely in the browser with zero server calls.\n\nAt SabTools.in, Vikram leads the development of image processing tools, PDF utilities, data conversion tools, and text processors. He engineered the platform's image compression pipeline that reduces file sizes by up to 80 percent without visible quality loss — all running locally in the user's browser. He also built the PDF merge, split, and conversion tools using client-side libraries, ensuring that sensitive documents never leave the user's device.\n\nVikram is particularly focused on performance for India's diverse device landscape. He regularly tests every tool on budget Android smartphones with limited RAM, ensuring smooth operation on devices like the Redmi Note series and Samsung Galaxy M series that dominate the Indian market. His work on progressive loading and efficient memory management means SabTools.in tools work reliably even on devices with just 2GB of RAM and intermittent 3G connections.\n\nHe is an active contributor to open-source web performance projects and regularly shares his insights on building fast, privacy-respecting web tools for emerging markets.",
    socialLinks: {
      twitter: "vikrammehta_dev",
      linkedin: "vikrammehta",
    },
  },
  {
    slug: "anita-desai",
    name: "Prof. Anita Desai",
    role: "Education & Mathematics Advisor",
    initials: "AD",
    color: "#7c3aed",
    bio: "Mathematics educator with 15 years of teaching experience across CBSE, ICSE, and state board curricula. Reviews all math, science, and exam-related tools for accuracy and educational value.",
    expertise: [
      "Mathematics Education (CBSE, ICSE, State Boards)",
      "Competitive Exam Preparation (JEE, NEET, GATE)",
      "Curriculum Design & Pedagogy",
      "Statistical Analysis",
      "Academic Grading Systems",
      "STEM Education Policy",
      "Educational Technology",
      "Student Assessment Methods",
    ],
    categories: [
      "math",
      "education",
      "exam",
      "science",
      "student",
      "datetime",
    ],
    longBio:
      "Prof. Anita Desai is the Education and Mathematics Advisor at SabTools.in, bringing fifteen years of teaching experience across India's major education boards to ensure every academic and mathematical tool on the platform meets the highest standards of accuracy and pedagogical value.\n\nProf. Desai holds an M.Sc. in Mathematics from the University of Delhi and a B.Ed. from Jamia Millia Islamia. She has taught mathematics at both secondary and senior secondary levels across CBSE, ICSE, and Maharashtra State Board schools in Mumbai and Pune. Her students have consistently achieved top ranks in board examinations and competitive entrance tests including JEE Main, JEE Advanced, and various state-level olympiads.\n\nAt SabTools.in, Prof. Desai reviews and validates all mathematics tools, education calculators, exam score predictors, and grading utilities. She ensures that GPA and CGPA calculators follow the exact grading scales used by Indian universities including the CBSE 10-point CGPA system, Anna University's grading pattern, and Mumbai University's credit-based system. She also verifies that exam score predictors for NEET, JEE, GATE, and CAT use current marking schemes and cutoff methodologies.\n\nBeyond calculation accuracy, Prof. Desai focuses on educational value. She ensures that math tools show step-by-step solutions wherever possible, helping students understand the methodology rather than just getting an answer. Her philosophy is that a calculator should teach as much as it computes. She has been instrumental in designing the platform's study planner, timetable generator, and academic calendar tools that help students across India organize their preparation more effectively.\n\nProf. Desai actively consults with coaching institutes in Kota and Delhi to keep SabTools.in's exam tools aligned with the latest patterns and marking schemes set by NTA, CBSE, and state education boards.",
    socialLinks: {
      linkedin: "profanitadesai",
    },
  },
  {
    slug: "rajesh-kumar",
    name: "Dr. Rajesh Kumar",
    role: "Health Content Reviewer",
    initials: "DK",
    color: "#dc2626",
    bio: "MBBS with specialization in preventive medicine. Reviews all health and fitness calculators to ensure they follow WHO and ICMR guidelines, with specific calibration for Indian body types and dietary patterns.",
    expertise: [
      "Preventive Medicine & Public Health",
      "WHO & ICMR Health Guidelines",
      "Nutrition & Dietetics (Indian Context)",
      "BMI & Body Composition for South Asians",
      "Maternal & Child Health",
      "Lifestyle Disease Prevention",
      "Health Data Interpretation",
      "Clinical Research Methodology",
    ],
    categories: [
      "health",
      "cooking",
      "fun",
      "agriculture",
      "utility",
    ],
    longBio:
      "Dr. Rajesh Kumar is the Health Content Reviewer at SabTools.in, where he ensures that every health and fitness calculator on the platform adheres to clinical standards set by the World Health Organization (WHO) and the Indian Council of Medical Research (ICMR), with specific calibration for Indian populations.\n\nDr. Kumar completed his MBBS from Maulana Azad Medical College, New Delhi, one of India's premier medical institutions, followed by an MD in Community Medicine from AIIMS, New Delhi. He has over ten years of clinical and research experience in preventive medicine, with a focus on lifestyle diseases that disproportionately affect the Indian population — including Type 2 diabetes, cardiovascular disease, and obesity.\n\nAt SabTools.in, Dr. Kumar reviews all health calculators including BMI, BMR, calorie counters, pregnancy trackers, and fitness planners. He is particularly focused on ensuring that these tools use India-specific reference values rather than Western standards. For example, the platform's BMI calculator uses the WHO Asia-Pacific classification, which sets lower thresholds for overweight and obesity categories for South Asian populations. Similarly, calorie and nutrition tools account for common Indian dietary patterns including vegetarian and regional cuisines.\n\nDr. Kumar also oversees the accuracy of cooking and kitchen tools that involve nutritional calculations, ensuring calorie counts and macronutrient breakdowns reflect actual Indian food compositions as documented in the Indian Food Composition Tables published by the National Institute of Nutrition, Hyderabad.\n\nHis mission at SabTools.in is to bridge the gap between clinical health information and everyday Indians who may not have easy access to healthcare professionals. He believes that accurate, culturally calibrated health tools can play a meaningful role in preventive health awareness across India, particularly in rural and semi-urban areas where access to trained dietitians and doctors remains limited.",
    socialLinks: {
      linkedin: "drrajeshkumar-health",
    },
  },
];

export function getAuthorBySlug(slug: string): Author | undefined {
  return authors.find((a) => a.slug === slug);
}

export function getAllAuthors(): Author[] {
  return authors;
}
