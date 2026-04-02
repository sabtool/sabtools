import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { categories, tools } from "@/lib/tools";
import ToolCard from "@/components/ToolCard";
import Breadcrumb from "@/components/Breadcrumb";
import AdBanner from "@/components/AdBanner";

/* ── Unique category descriptions for SEO (avoids thin/duplicate content) ── */
const categoryDescriptions: Record<string, { intro: string; whoUses: string; whyUse: string }> = {
  finance: {
    intro: "Financial planning is the foundation of a secure future. Our finance calculators cover everything from EMI calculations for home loans, car loans, and personal loans to SIP and mutual fund returns, FD and RD maturity values, PPF projections, and loan comparison tools. Each calculator follows RBI guidelines and Indian banking standards, supporting all major banks including SBI, HDFC, ICICI, Axis, and Kotak.",
    whoUses: "Salaried professionals planning home loans, investors comparing SIP vs FD returns, students calculating education loan EMI, and business owners estimating working capital needs.",
    whyUse: "Get bank-accurate calculations instantly. Compare multiple scenarios side by side. All calculations use Indian financial year, INR formatting, and current interest rate benchmarks.",
  },
  math: {
    intro: "Mathematics is everywhere — from splitting bills to calculating discounts, measuring rooms to solving homework problems. Our math tools handle percentages, age calculations, BMI, number conversions, and advanced mathematical operations. Designed to be simple enough for school students yet precise enough for professionals.",
    whoUses: "Students from Class 6 to post-graduation, teachers preparing worksheets, shopkeepers calculating discounts, and professionals doing quick number crunching.",
    whyUse: "Step-by-step solutions help you learn the method. High decimal precision for accurate results. Covers the full range from basic arithmetic to advanced calculations.",
  },
  text: {
    intro: "Text processing tools for writers, bloggers, students, and content creators. Count words and characters for essays and social media posts, convert text case, generate Lorem Ipsum placeholder text, remove duplicate lines, and format text for any purpose. Full support for English, Hindi, and other Indian languages.",
    whoUses: "Bloggers writing SEO-optimized articles, students checking essay word counts, social media managers crafting posts within character limits, and developers cleaning up text data.",
    whyUse: "Handles text in any language including Hindi and other Indian scripts. No word limits — process even 50,000+ words instantly. One-click copy for immediate use.",
  },
  converters: {
    intro: "Unit conversion tools covering length, weight, temperature, currency, data storage, speed, area, volume, and more. Includes Indian-specific units like bigha, guntha, tola, and ser that you won't find on international converter tools. Essential for cooking, construction, shopping, and academic work.",
    whoUses: "Home cooks converting recipe measurements, engineers converting technical units, students solving physics problems, and shoppers comparing international product sizes.",
    whyUse: "Includes uniquely Indian units alongside international standards. Real-time conversion as you type. Supports bidirectional conversion with a single click.",
  },
  developer: {
    intro: "Essential developer utilities for coding, debugging, and data processing. Format and validate JSON, encode/decode Base64 and URLs, generate MD5/SHA hashes, test regular expressions, minify CSS/JavaScript, and convert between data formats. Built for speed — handles large inputs without lag.",
    whoUses: "Web developers debugging API responses, backend engineers processing data, DevOps professionals working with configurations, and computer science students learning data formats.",
    whyUse: "100% client-side processing means your API keys, tokens, and code never leave your device. Handles inputs up to 10MB+. Syntax highlighting and error detection included.",
  },
  image: {
    intro: "Browser-based image processing tools that respect your privacy. Compress images for faster websites, resize photos to exact dimensions, crop to specific aspect ratios, convert between JPG/PNG/WebP/SVG formats, and optimize images for social media. All processing happens locally — your photos never leave your device.",
    whoUses: "Web developers optimizing site images, social media managers resizing posts, bloggers compressing header images, and photographers converting between formats.",
    whyUse: "Zero server uploads — complete privacy for personal photos. Reduce image sizes by 60-80% without visible quality loss. Supports all major formats including modern WebP.",
  },
  seo: {
    intro: "Search engine optimization tools for website owners, bloggers, and digital marketers. Generate meta tags, create XML sitemaps, build robots.txt files, analyze Open Graph tags, and validate structured data. Following Google's latest 2026 guidelines for maximum search visibility.",
    whoUses: "WordPress bloggers improving their rankings, small business owners managing their website SEO, digital marketing agencies auditing client sites, and web developers adding SEO elements.",
    whyUse: "Generated code follows Google's official guidelines. Copy-paste ready output for any platform — WordPress, Blogger, Wix, Shopify, or custom HTML sites.",
  },
  datetime: {
    intro: "Date and time calculation tools for everyday needs and business use. Calculate exact age down to days and hours, find differences between dates, set countdown timers for events, convert between timezones, and work with Indian financial year calculations. Supports Indian public holidays and bank holidays.",
    whoUses: "HR professionals calculating employee tenure, event planners setting countdown timers, students calculating exact age for applications, and businesses tracking financial year dates.",
    whyUse: "Defaults to IST (Indian Standard Time). Knows Indian public holidays and bank holidays. Supports the Indian financial year (April-March) for tax and business calculations.",
  },
  security: {
    intro: "Digital security tools for protecting your online presence. Generate strong passwords that meet bank-grade requirements, check if your email appears in known data breaches, verify SSL certificates, perform DNS lookups, and generate cryptographic hashes. All security operations run locally in your browser for maximum safety.",
    whoUses: "Anyone creating accounts online, IT administrators checking domain security, developers implementing authentication, and security-conscious users auditing their digital footprint.",
    whyUse: "All processing is 100% local — passwords and sensitive data never leave your device. Uses industry-standard encryption algorithms. Generates passwords that meet RBI digital banking security guidelines.",
  },
  whatsapp: {
    intro: "Tools for India's most popular apps — WhatsApp and UPI. Generate WhatsApp direct message links for business marketing, create UPI QR codes for payment collection, look up IFSC codes for any Indian bank branch, format bulk WhatsApp messages, and trace mobile number details. Essential for small businesses and shopkeepers.",
    whoUses: "Small business owners using WhatsApp for customer communication, shopkeepers collecting UPI payments, freelancers sharing payment QR codes, and users sending messages without saving numbers.",
    whyUse: "WhatsApp links work without saving contacts. UPI QR codes work with Google Pay, PhonePe, Paytm, and all UPI apps. IFSC database covers every bank branch in India.",
  },
  health: {
    intro: "Health and fitness calculators based on WHO and ICMR (Indian Council of Medical Research) standards. Calculate BMI with Indian-specific categories, estimate daily calorie needs, track pregnancy milestones, compute BMR for weight management, and assess body fat percentage. Calibrated for Indian body types and dietary patterns.",
    whoUses: "Health-conscious individuals tracking fitness goals, expecting parents monitoring pregnancy progress, doctors explaining health metrics to patients, and fitness enthusiasts planning nutrition.",
    whyUse: "Uses ICMR standards which differ from Western BMI categories for Indian body types. All health data stays on your device — complete privacy for sensitive personal information.",
  },
  tax: {
    intro: "Indian tax and salary calculators updated for FY 2025-26 with the latest Union Budget changes. Compare old vs new tax regime, calculate HRA exemptions, compute TDS, estimate EPF contributions, and plan NPS investments. Covers income tax for salaried individuals, freelancers, and businesses with state-wise professional tax rates.",
    whoUses: "Salaried employees estimating take-home pay, CAs advising clients on tax regime selection, HR professionals processing payroll, and freelancers calculating advance tax payments.",
    whyUse: "Updated with the latest Union Budget changes and tax slabs. Compare both tax regimes side by side. Includes state-wise professional tax and all Section 80C/80D deductions.",
  },
  fun: {
    intro: "Entertainment and utility tools for everyday fun. Flip a coin for decisions, roll dice for board games, test your typing speed, check love compatibility, generate random numbers, and play quick games. All tools use cryptographically secure randomization for truly fair results.",
    whoUses: "Friends settling debates with coin flips, families playing board games, students testing typing speed for competitive exams, and teachers running classroom activities.",
    whyUse: "Genuine randomization using Web Crypto API — every result is truly unpredictable. Works offline after loading. Fun animations and instant sharing to WhatsApp and social media.",
  },
  css: {
    intro: "Visual CSS code generators for front-end developers and designers. Create gradients, box shadows, border radius combinations, text effects, and animations by adjusting visual controls — then copy clean, production-ready CSS code. Real-time preview shows exactly how your styles will look.",
    whoUses: "Front-end developers creating UI components, web design students learning CSS properties, UI/UX designers prototyping visual styles, and full-stack developers who need quick CSS snippets.",
    whyUse: "Visual interface eliminates CSS syntax guesswork. Cross-browser compatible output with vendor prefixes. One-click copy of clean, minified CSS ready for production use.",
  },
  data: {
    intro: "Data format conversion and comparison tools for developers and analysts. Convert between JSON, CSV, TSV, XML, YAML, and SQL formats. Compare text files to find differences. Clean and restructure messy data. Handles large datasets with thousands of rows efficiently in your browser.",
    whoUses: "Data analysts converting database exports, developers transforming API responses, QA engineers comparing file versions, and students working with data formats for assignments.",
    whyUse: "Preserves data types, Unicode, and special characters during conversion. Handles 100,000+ row datasets. All processing is local — safe for sensitive business data.",
  },
  social: {
    intro: "Social media optimization tools for creators, influencers, and businesses. Generate Instagram bios with emojis, find trending hashtags for Indian audiences, resize images to exact platform dimensions, create YouTube thumbnails, and format Twitter/X threads. Covers all major platforms used in India.",
    whoUses: "Instagram influencers optimizing their profile, YouTube creators designing thumbnails, small businesses managing social media presence, and digital marketers running campaigns.",
    whyUse: "Knows exact image dimensions for every platform (Instagram, YouTube, Twitter, LinkedIn, Facebook). Suggests hashtags trending in India. Bio generator with emoji and formatting support.",
  },
  education: {
    intro: "Academic calculators for Indian students across all boards and universities. Calculate GPA, CGPA, percentages, and grade points. Convert between different grading systems. Plan study schedules and track academic performance. Supports CBSE, ICSE, all state boards, and major Indian universities.",
    whoUses: "School students calculating board exam percentages, college students converting CGPA to percentage, university applicants comparing grades, and teachers evaluating student performance.",
    whyUse: "Supports grading systems of Anna University, Mumbai University, Delhi University, VTU, JNTU, and more. CBSE and ICSE grade conversion built in. Competitive exam score predictors included.",
  },
  business: {
    intro: "Business and commerce calculators for Indian entrepreneurs and accountants. Calculate GST amounts across all rate slabs, generate compliant invoices, analyze profit margins, compute ROI and break-even points, and estimate business costs. Follows current GST Council regulations and Indian business practices.",
    whoUses: "Small shopkeepers calculating GST, startup founders analyzing ROI, accountants preparing invoices, freelancers estimating project profitability, and MSMEs managing business finances.",
    whyUse: "All GST rate slabs (5%, 12%, 18%, 28%) with cess calculations. Invoice generator meets GST compliance requirements. Simple enough for shopkeepers, detailed enough for accountants.",
  },
  pdf: {
    intro: "PDF manipulation tools that work entirely in your browser. Compress PDFs to reduce file size, convert between PDF and other formats, merge multiple PDFs into one document, split PDFs by page range, and rotate pages. Your documents never leave your device — essential for handling sensitive Indian government forms and financial documents.",
    whoUses: "Students compressing assignment PDFs for upload, professionals merging contract documents, government job applicants combining certificates, and businesses converting invoices to PDF.",
    whyUse: "100% browser-based — documents never uploaded to any server. Perfect for sensitive files like Aadhaar, PAN, bank statements. No file size limits. Compress PDFs by up to 80%.",
  },
  utility: {
    intro: "India-specific verification and lookup tools every citizen needs. Validate PAN card numbers, check IFSC codes for bank transfers, find PIN codes for any post office, verify GST registration numbers, decode vehicle registration details, and validate Aadhaar card formats. Uses official formatting rules and check digit algorithms.",
    whoUses: "Anyone filling government forms, bankers verifying customer KYC details, logistics companies looking up PIN codes, and taxpayers validating GST numbers of vendors.",
    whyUse: "Validates using official formatting rules and check digit algorithms. IFSC database covers every bank branch in India. All verification is instant and completely private.",
  },
  realestate: {
    intro: "Real estate and property calculators designed for Indian home buyers, builders, and interior designers. Calculate plot areas in Indian units, estimate construction material quantities, plan paint and tile requirements, and budget renovation costs. Supports bigha, guntha, cent, ground, kanal, and all regional land measurement units.",
    whoUses: "Home buyers calculating plot areas, contractors estimating material quantities, interior designers planning room renovations, and property investors comparing land measurements.",
    whyUse: "Supports all Indian land units that standard calculators miss. Construction cost estimates based on current Indian material prices. Helps avoid over-ordering materials and wasting money.",
  },
  electrical: {
    intro: "Electrical engineering calculators for Indian power systems. Calculate wire sizes for safe installation, estimate voltage drops across cable runs, compute power consumption for homes and offices, apply Ohm's law, size solar panel systems, and plan electrical load distribution. Based on Indian 230V/50Hz power supply and IS standards.",
    whoUses: "Licensed electricians planning wiring jobs, homeowners estimating electricity bills, solar panel installers sizing systems, and engineering students solving circuit problems.",
    whyUse: "Designed for Indian 230V/50Hz power system. Follows IS (Indian Standard) electrical codes. Includes safety margins in all calculations. Solar calculator accounts for Indian sunlight conditions.",
  },
  cooking: {
    intro: "Kitchen and cooking tools built for the Indian home cook. Convert recipe measurements between katori, chamach, cups, grams, and ml. Scale recipes up or down for any number of guests. Track gas cylinder usage and estimate refill dates. Count calories for Indian dishes from dal-chawal to biryani.",
    whoUses: "Home cooks scaling family recipes, health-conscious Indians tracking calories in Indian food, bachelors converting recipe measurements, and families tracking LPG cylinder usage.",
    whyUse: "Understands Indian measurements (katori, chamach, glass) that international tools ignore. Calorie database includes hundreds of Indian dishes. Gas cylinder tracker prevents surprise empty cylinders.",
  },
  wedding: {
    intro: "Indian wedding planning tools for the biggest celebration of your life. Plan budgets across all ceremonies (engagement, mehendi, sangeet, baraat, reception), manage guest lists for 100 to 2000+ guests, find auspicious muhurat dates, and estimate vendor costs by city tier. Covers Hindu, Muslim, Christian, and Sikh wedding traditions.",
    whoUses: "Couples planning their wedding, parents managing wedding budgets, wedding planners coordinating events, and families finding auspicious dates for ceremonies.",
    whyUse: "Budget categories cover every Indian wedding expense. Auspicious date finder based on Hindu Panchang. Vendor cost estimates adjusted for metro, Tier-1, Tier-2, and Tier-3 cities.",
  },
  agriculture: {
    intro: "Agricultural calculators for Indian farmers and agronomists. Estimate crop yields based on land area and variety, calculate fertilizer NPK ratios, plan irrigation water requirements, convert between Indian land measurement units, and project farm profitability including MSP (Minimum Support Price) comparisons.",
    whoUses: "Farmers planning crop seasons, agricultural extension officers advising farmers, agri-business entrepreneurs estimating costs, and agriculture students studying crop management.",
    whyUse: "Covers major Indian crops (wheat, rice, sugarcane, cotton, pulses). Includes latest MSP prices announced by the government. Land units include bigha, guntha, acre, and hectare as used locally.",
  },
  exam: {
    intro: "Competitive exam score calculators for Indian entrance tests. Predict your NEET, JEE Main, JEE Advanced, GATE, CAT, SSC, and Banking exam scores with negative marking factored in. Compare with previous year cutoffs across General, OBC, SC, ST, and EWS categories. Plan your preparation with target score analysis.",
    whoUses: "NEET aspirants checking expected scores, JEE students comparing cutoffs, GATE candidates estimating ranks, CAT takers predicting percentiles, and SSC/Banking exam candidates tracking preparation.",
    whyUse: "Official marking schemes for every major Indian competitive exam. Category-wise cutoff data from previous years. Negative marking automatically calculated. Rank prediction based on historical patterns.",
  },
  vehicle: {
    intro: "Vehicle and transport calculators for Indian car and bike owners. Calculate real-world mileage and fuel costs, plan road trips with toll estimates, estimate insurance premiums, check tyre compatibility, calculate vehicle depreciation for resale, and track service schedules. Based on Indian fuel prices, toll rates, and RTO norms.",
    whoUses: "Car owners tracking fuel expenses, road trip planners estimating total costs, used vehicle buyers checking depreciation values, and two-wheeler riders comparing mileage figures.",
    whyUse: "Uses Indian fuel price ranges and highway toll data. Insurance estimates follow Indian motor vehicle regulations. Depreciation calculated per Indian insurance and tax department standards.",
  },
  astrology: {
    intro: "Vedic astrology (Jyotish) tools based on traditional Indian astrological calculations. Generate Kundli birth charts, determine Rashi and Nakshatra from birth details, check Panchang for auspicious timings, explore numerology meanings, and find gemstone recommendations. Based on centuries-old Vedic astronomical methods.",
    whoUses: "Individuals checking their Rashi and Nakshatra, families finding muhurat for ceremonies, astrology enthusiasts exploring birth charts, and parents seeking auspicious names for newborns.",
    whyUse: "Uses traditional Vedic Jyotish calculation methods. Supports both North Indian and South Indian chart formats. Panchang data for daily auspicious timings. Cultural and educational astrology tools.",
  },
  legal: {
    intro: "Legal and government fee calculators for Indian citizens. Estimate court fees by state and case type, calculate stamp duty and registration charges for property transactions, understand RTI application processes, generate legal notice formats, and access voter ID tools. Based on current Indian legal fee structures.",
    whoUses: "Citizens buying property and calculating stamp duty, lawyers estimating court fees for clients, RTI activists filing applications, and first-time voters checking eligibility.",
    whyUse: "State-specific fee calculations because rates differ across India. Stamp duty calculator covers all Indian states. Legal templates follow proper Indian legal formatting. Saves time researching government fee structures.",
  },
  ai: {
    intro: "AI-powered writing and content generation tools. Rewrite paragraphs while maintaining meaning, compose professional emails, generate creative stories, build LinkedIn and Instagram bios, and create content outlines. Powered by advanced AI to help you write better and faster in both English and Hindi.",
    whoUses: "Students improving essay writing, professionals drafting business emails, bloggers generating content ideas, job seekers crafting LinkedIn bios, and social media creators writing captions.",
    whyUse: "AI generates unique content every time — no plagiarism concerns. Supports both English and Hindi. Multiple tone options (formal, casual, professional, creative). Perfect for overcoming writer's block.",
  },
  science: {
    intro: "Advanced science and mathematics calculators for students, engineers, and researchers. Plot interactive graphs, perform matrix operations, run statistical analysis, solve equations, calculate probability distributions, and work with complex numbers. Step-by-step solutions help you understand the method, not just the answer.",
    whoUses: "Engineering students solving matrix problems, statistics students analyzing data sets, researchers plotting graphs, and competitive exam aspirants practicing advanced math.",
    whyUse: "Interactive graphing with zoom and pan. Step-by-step working shown for learning. Covers topics from basic algebra to advanced calculus and linear algebra. Precision up to 15 decimal places.",
  },
  construction: {
    intro: "Construction material calculators for Indian building projects. Estimate exact quantities of concrete (M10 to M40 grade), steel reinforcement, bricks, cement, sand, tiles, paint, plumbing pipes, and electrical wiring. Based on IS (Indian Standard) construction codes and current Indian material prices. Prevents over-ordering and saves lakhs on material costs.",
    whoUses: "Civil engineers designing structures, contractors estimating project costs, home builders planning construction, and architecture students learning material estimation.",
    whyUse: "Follows IS 456 (concrete), IS 1786 (steel), and other Indian Standard codes. Material prices based on current Indian market rates. Includes standard wastage percentages. Covers everything from foundation to finishing.",
  },
};

const defaultCategoryDesc = {
  intro: "Specialized tools designed to simplify your everyday tasks. Each tool in this category is 100% free, works instantly in your browser, and requires no signup. Built with Indian users in mind, supporting local formats, standards, and requirements.",
  whoUses: "Students, professionals, business owners, and home users across India who need quick, accurate results without installing software or creating accounts.",
  whyUse: "All tools are free forever with no usage limits. Processing happens in your browser for complete privacy. Mobile-friendly design works on any device.",
};

export function generateStaticParams() {
  return categories.map((cat) => ({ slug: cat.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cat = categories.find((c) => c.slug === slug);
  if (!cat) return {};
  const toolCount = tools.filter((t) => t.category === slug).length;
  const desc = categoryDescriptions[slug] || defaultCategoryDesc;
  return {
    title: `${cat.name} — ${toolCount} Free Online Tools for India | SabTools.in`,
    description: `${desc.intro.slice(0, 155)}...`,
    keywords: [cat.name.toLowerCase(), ...cat.description.toLowerCase().split(", ").slice(0, 5), "free tools", "online tools", "sabtools", "india"],
    alternates: { canonical: `https://sabtools.in/category/${slug}` },
    openGraph: {
      title: `${cat.name} — ${toolCount} Free Online Tools | SabTools.in`,
      description: `${cat.description}. ${toolCount} free tools available. No signup, instant results.`,
      url: `https://sabtools.in/category/${slug}`,
      type: "website",
      locale: "en_IN",
      siteName: "SabTools.in",
    },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cat = categories.find((c) => c.slug === slug);
  if (!cat) notFound();

  const catTools = tools.filter((t) => t.category === slug);
  const desc = categoryDescriptions[slug] || defaultCategoryDesc;

  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${cat.name} - Free Online Tools`,
    description: desc.intro,
    url: `https://sabtools.in/category/${slug}`,
    numberOfItems: catTools.length,
    hasPart: catTools.slice(0, 10).map((t) => ({
      "@type": "WebApplication",
      name: t.name,
      url: `https://sabtools.in/tools/${t.slug}`,
    })),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://sabtools.in" },
      { "@type": "ListItem", position: 2, name: cat.name, item: `https://sabtools.in/category/${slug}` },
    ],
  };

  // FAQ schema for category page
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What ${cat.name.toLowerCase()} are available on SabTools.in?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `SabTools.in offers ${catTools.length} free ${cat.name.toLowerCase()} including ${catTools.slice(0, 5).map(t => t.name).join(", ")}, and more. All tools are free with no signup required.`,
        },
      },
      {
        "@type": "Question",
        name: `Are these ${cat.name.toLowerCase()} free to use?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Yes, all ${catTools.length} ${cat.name.toLowerCase()} on SabTools.in are completely free. No signup, no hidden charges, and no usage limits. Use them as many times as you need.`,
        },
      },
      {
        "@type": "Question",
        name: `Who uses these ${cat.name.toLowerCase()}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: desc.whoUses,
        },
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: cat.name }]} />

      <div className="mb-10">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${cat.color} text-white text-3xl shadow-lg mb-4`}>
          {cat.icon}
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">{cat.name}</h1>
        <p className="text-lg text-gray-700 leading-relaxed max-w-3xl">{desc.intro}</p>
        <p className="text-sm text-gray-500 mt-3">{catTools.length} free tools available — no signup required</p>
      </div>

      <AdBanner format="horizontal" className="mb-8" />

      <h2 className="text-xl font-bold text-gray-900 mb-4">All {cat.name} ({catTools.length} Tools)</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {catTools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>

      <AdBanner format="horizontal" className="mt-10" />

      {/* Unique SEO content section */}
      <div className="mt-12 prose prose-gray max-w-none">
        <h2 className="text-xl font-bold text-gray-900">Who Uses These {cat.name}?</h2>
        <p className="text-gray-600">{desc.whoUses}</p>

        <h2 className="text-xl font-bold text-gray-900 mt-6">Why Use {cat.name} on SabTools.in?</h2>
        <p className="text-gray-600">{desc.whyUse}</p>

        <h2 className="text-xl font-bold text-gray-900 mt-6">Popular Tools in This Category</h2>
        <ul className="text-gray-600">
          {catTools.slice(0, 8).map((t) => (
            <li key={t.slug}>
              <Link href={`/tools/${t.slug}`} className="text-indigo-600 hover:underline font-medium">{t.name}</Link>
              {" — "}{t.description}
            </li>
          ))}
        </ul>

        {catTools.length > 8 && (
          <p className="text-gray-500 mt-2">
            ...and {catTools.length - 8} more tools. Explore all {catTools.length} {cat.name.toLowerCase()} above.
          </p>
        )}
      </div>
    </div>
  );
}
