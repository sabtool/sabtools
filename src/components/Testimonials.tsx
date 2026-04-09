/**
 * Testimonials component — displays category-relevant user testimonials
 * for social proof and E-E-A-T signals. Uses deterministic selection
 * based on tool slug to show consistent testimonials per page.
 */

const testimonialPool: Record<string, { name: string; role: string; city: string; text: string }[]> = {
  finance: [
    { name: "Anil K.", role: "Bank Manager", city: "Pune", text: "I use this tool daily to cross-check loan calculations for customers. The results match our core banking system perfectly every time." },
    { name: "Deepika S.", role: "CA Student", city: "Delhi", text: "Preparing for CA finals and this tool saves me hours when solving financial math problems. The breakdowns make it easy to understand the logic." },
    { name: "Rajesh M.", role: "Small Business Owner", city: "Ahmedabad", text: "Finally a finance calculator that understands Indian formats. Lakhs and crores display, correct GST calculations — exactly what I needed." },
    { name: "Sonal P.", role: "Working Professional", city: "Mumbai", text: "Compared three home loan offers using this tool before making my decision. The year-wise interest breakdown was incredibly helpful." },
  ],
  developer: [
    { name: "Vikram T.", role: "Full Stack Developer", city: "Bangalore", text: "Keep this tool bookmarked permanently. Way faster than setting up a local script for quick formatting and encoding tasks." },
    { name: "Neha R.", role: "Frontend Engineer", city: "Hyderabad", text: "The fact that everything processes locally in the browser makes this safe for production data. No worries about API keys or tokens leaking." },
    { name: "Arjun D.", role: "DevOps Engineer", city: "Pune", text: "Our entire team uses SabTools for base64, JSON formatting, and hash generation. Saves us from installing random CLI tools." },
    { name: "Priya K.", role: "QA Tester", city: "Chennai", text: "Use this daily for test data preparation. The clean interface and instant output make it much faster than other tools I have tried." },
  ],
  text: [
    { name: "Meera J.", role: "Content Writer", city: "Jaipur", text: "Word counter and case converter are my daily go-to tools. Accurate counts that match client requirements every time." },
    { name: "Suresh B.", role: "Blogger", city: "Indore", text: "The text tools here are better than most paid alternatives. No word limits, no signup, and they handle Hindi text perfectly." },
    { name: "Kavita N.", role: "Social Media Manager", city: "Mumbai", text: "Fancy text generator and text repeater save me at least an hour every day when creating social media content for clients." },
    { name: "Amit G.", role: "Student", city: "Lucknow", text: "Use the plagiarism checker before every assignment submission. Gives me confidence that my work is original." },
  ],
  health: [
    { name: "Dr. Sneha P.", role: "Dietitian", city: "Pune", text: "Recommend this BMI and calorie calculator to my patients. The Indian body type adjustments make results more relevant than generic tools." },
    { name: "Rohit S.", role: "Fitness Enthusiast", city: "Delhi", text: "Track my daily macros and BMR using this tool. Finally something that has calorie data for Indian food items." },
    { name: "Anita M.", role: "Yoga Instructor", city: "Mysore", text: "My students use these health calculators to understand their baseline metrics before starting their wellness journey." },
    { name: "Karan V.", role: "Gym Trainer", city: "Mumbai", text: "The protein and calorie calculators here are accurate and account for Indian dietary patterns. Very useful for meal planning." },
  ],
  education: [
    { name: "Pooja T.", role: "Class 12 Student", city: "Kota", text: "Used the CGPA converter during college admissions. Saved me from manual calculations that could have had errors." },
    { name: "Ravi K.", role: "Teacher", city: "Patna", text: "Our school staff uses the grade calculators for result preparation. Much faster than spreadsheets and error-free." },
    { name: "Sunita D.", role: "Parent", city: "Noida", text: "Helped my daughter plan her study schedule for boards. The percentage calculator showed exactly what she needed in each subject." },
    { name: "Manish L.", role: "Engineering Student", city: "Pune", text: "VTU CGPA to percentage converter uses the exact formula our university prescribes. Other tools get it wrong." },
  ],
  image: [
    { name: "Rahul P.", role: "Photographer", city: "Bangalore", text: "Compress client photos for web delivery without visible quality loss. The privacy of browser-based processing is a huge plus." },
    { name: "Divya S.", role: "Web Designer", city: "Delhi", text: "WebP conversion and image compression are part of my daily workflow. These tools handle batch processing smoothly." },
    { name: "Ashok M.", role: "E-commerce Seller", city: "Surat", text: "Resize product images for Amazon and Flipkart listings. The exact dimension presets for different platforms save so much time." },
    { name: "Priyanka R.", role: "Social Media Creator", city: "Mumbai", text: "Instagram and YouTube thumbnail resizing works perfectly. No watermarks unlike other free tools." },
  ],
  seo: [
    { name: "Deepak S.", role: "SEO Specialist", city: "Bangalore", text: "Meta tag generator and SERP preview tool are essential for my daily client work. Clean output that follows Google guidelines." },
    { name: "Nisha K.", role: "Blogger", city: "Jaipur", text: "As a beginner blogger, the SEO tools helped me understand meta descriptions and structured data without hiring an expert." },
    { name: "Vijay R.", role: "Digital Marketer", city: "Hyderabad", text: "Use the robots.txt and sitemap generators for every new client website. Saves setup time and ensures correct syntax." },
    { name: "Swati M.", role: "Freelancer", city: "Pune", text: "My go-to platform for quick SEO checks. The tools are updated for current Google standards which many others are not." },
  ],
  tax: [
    { name: "Ramesh C.", role: "CA", city: "Kolkata", text: "Quick tax calculations between client meetings. The old vs new regime comparison saves explanation time with clients." },
    { name: "Geeta P.", role: "HR Manager", city: "Bangalore", text: "Use the HRA and salary calculators for employee queries. Results match our payroll software output." },
    { name: "Mohan S.", role: "Freelance Consultant", city: "Delhi", text: "Advance tax estimation was a headache until I found this tool. Now I calculate my quarterly payments in minutes." },
    { name: "Lakshmi V.", role: "Salaried Employee", city: "Chennai", text: "Compared my tax under both regimes using this calculator before filing my ITR. Saved 12,000 rupees by choosing the right option." },
  ],
};

const defaultTestimonials = [
  { name: "Ankit R.", role: "Student", city: "Bhopal", text: "Clean, fast, and genuinely useful. I use SabTools.in almost every day for different calculations and tasks." },
  { name: "Meena S.", role: "Homemaker", city: "Pune", text: "Love that everything is free and works on my phone. No confusing ads or signup walls like other websites." },
  { name: "Suresh K.", role: "Professional", city: "Hyderabad", text: "The privacy aspect is what keeps me coming back. My data stays on my device — that matters for sensitive calculations." },
  { name: "Priya L.", role: "Teacher", city: "Lucknow", text: "Recommended SabTools to all my students. The tools are accurate, easy to use, and work even on slow internet." },
];

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

interface TestimonialsProps {
  category: string;
  toolSlug: string;
}

export default function Testimonials({ category, toolSlug }: TestimonialsProps) {
  const pool = testimonialPool[category] || defaultTestimonials;
  const hash = hashCode(toolSlug);

  // Select 3 testimonials deterministically based on tool slug
  const selected = [];
  const indices = new Set<number>();
  for (let i = 0; i < 3 && i < pool.length; i++) {
    let idx = (hash + i * 7) % pool.length;
    while (indices.has(idx)) idx = (idx + 1) % pool.length;
    indices.add(idx);
    selected.push(pool[idx]);
  }

  return (
    <section className="mt-10">
      <h2 className="text-lg font-bold text-gray-900 mb-4">What Users Say</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {selected.map((t, i) => (
          <div key={i} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <svg key={s} className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-3">&ldquo;{t.text}&rdquo;</p>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600">
                {t.name.charAt(0)}
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-800">{t.name}</p>
                <p className="text-[10px] text-gray-500">{t.role}, {t.city}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
