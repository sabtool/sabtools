"use client";
import { useState, useMemo } from "react";

type CategoryType = "general" | "obc" | "sc" | "st";
type Gender = "male" | "female";
type Employment = "employed" | "unemployed" | "self-employed" | "farmer";

interface Scheme {
  name: string;
  description: string;
  benefits: string;
  howToApply: string;
  check: (p: Profile) => boolean;
}

interface Profile {
  age: number;
  gender: Gender;
  income: number;
  category: CategoryType;
  state: string;
  employment: Employment;
  bpl: boolean;
}

const SCHEMES: Scheme[] = [
  {
    name: "PM Kisan Samman Nidhi",
    description: "Direct income support to farmer families with cultivable land holding",
    benefits: "Rs 6,000/year in 3 installments of Rs 2,000 each",
    howToApply: "Apply at pmkisan.gov.in or through local agriculture office",
    check: (p) => p.employment === "farmer",
  },
  {
    name: "Ayushman Bharat (PM-JAY)",
    description: "Health insurance cover for economically weaker families",
    benefits: "Rs 5 lakh/year health coverage per family for hospitalization",
    howToApply: "Check eligibility at pmjay.gov.in or nearest Ayushman Mitra center",
    check: (p) => p.income <= 500000 || p.bpl,
  },
  {
    name: "PM Ujjwala Yojana",
    description: "Free LPG connections for women from BPL households",
    benefits: "Free LPG connection + first refill + stove (for eligible women)",
    howToApply: "Apply at nearest LPG distributor with BPL card",
    check: (p) => p.gender === "female" && (p.bpl || p.income <= 200000),
  },
  {
    name: "PM Awas Yojana (Urban/Rural)",
    description: "Affordable housing scheme for economically weaker sections",
    benefits: "Subsidy up to Rs 2.67 lakh on home loan interest for EWS/LIG",
    howToApply: "Apply at pmaymis.gov.in (Urban) or pmayg.nic.in (Rural)",
    check: (p) => p.income <= 600000 || p.bpl,
  },
  {
    name: "Sukanya Samriddhi Yojana",
    description: "Savings scheme for girl child education and marriage",
    benefits: "High interest rate (8.2% p.a.), tax benefits under 80C",
    howToApply: "Open account at any Post Office or bank for girl child below 10 years",
    check: (p) => p.gender === "female" && p.age < 10,
  },
  {
    name: "MGNREGA",
    description: "Guaranteed 100 days of wage employment per year to rural households",
    benefits: "100 days guaranteed employment at minimum wage (Rs 250-350/day)",
    howToApply: "Register at local Gram Panchayat with job card",
    check: (p) => p.employment === "unemployed" || p.income <= 300000,
  },
  {
    name: "PM Mudra Yojana",
    description: "Micro-loans for small business and self-employment",
    benefits: "Loans from Rs 50,000 (Shishu) to Rs 10 lakh (Tarun) without collateral",
    howToApply: "Apply at any bank, NBFC, or MFI with business plan",
    check: (p) => p.employment === "self-employed" || p.employment === "unemployed",
  },
  {
    name: "PM Vishwakarma Yojana",
    description: "Support for traditional artisans and craftspeople",
    benefits: "Skill training + toolkit + Rs 3 lakh collateral-free loan + digital transaction incentive",
    howToApply: "Register at pmvishwakarma.gov.in with Aadhaar",
    check: (p) => p.employment === "self-employed",
  },
  {
    name: "Atal Pension Yojana",
    description: "Pension scheme for workers in unorganized sector (age 18-40)",
    benefits: "Guaranteed monthly pension of Rs 1,000-5,000 after age 60",
    howToApply: "Apply at any bank with savings account and Aadhaar",
    check: (p) => p.age >= 18 && p.age <= 40 && p.income <= 600000,
  },
  {
    name: "PM Jeevan Jyoti Bima Yojana",
    description: "Life insurance cover for people aged 18-50",
    benefits: "Rs 2 lakh life insurance cover at Rs 436/year premium",
    howToApply: "Enroll through any bank with savings account",
    check: (p) => p.age >= 18 && p.age <= 50,
  },
  {
    name: "PM Suraksha Bima Yojana",
    description: "Accidental death and disability insurance",
    benefits: "Rs 2 lakh (death) / Rs 1 lakh (partial disability) at Rs 20/year",
    howToApply: "Enroll through any bank with savings account",
    check: (p) => p.age >= 18 && p.age <= 70,
  },
  {
    name: "National Pension System (NPS)",
    description: "Voluntary retirement savings for all citizens",
    benefits: "Tax benefits under 80CCD, pension after 60, partial withdrawal allowed",
    howToApply: "Open NPS account at any PoP bank or enps.nsdl.com",
    check: (p) => p.age >= 18 && p.age <= 65,
  },
  {
    name: "PM Kaushal Vikas Yojana",
    description: "Free skill training for youth to enhance employability",
    benefits: "Free industry-relevant skill training + certification + placement support",
    howToApply: "Register at pmkvyofficial.org or nearest Skill India center",
    check: (p) => p.age >= 15 && p.age <= 45 && (p.employment === "unemployed" || p.income <= 300000),
  },
  {
    name: "Stand Up India",
    description: "Bank loans for SC/ST and women entrepreneurs",
    benefits: "Loans from Rs 10 lakh to Rs 1 crore for new enterprise",
    howToApply: "Apply at standupmitra.in or any scheduled commercial bank",
    check: (p) => (p.category === "sc" || p.category === "st" || p.gender === "female") && p.age >= 18,
  },
  {
    name: "National Social Assistance Programme",
    description: "Pension for elderly, widows and disabled in BPL families",
    benefits: "Rs 200-500/month pension (state may add more)",
    howToApply: "Apply at local district social welfare office",
    check: (p) => p.bpl && (p.age >= 60 || (p.gender === "female" && p.age >= 40)),
  },
  {
    name: "Pradhan Mantri Matru Vandana Yojana",
    description: "Maternity benefit for pregnant and lactating women",
    benefits: "Rs 5,000 in installments for first live birth",
    howToApply: "Register at nearest Anganwadi Centre or health facility",
    check: (p) => p.gender === "female" && p.age >= 18 && p.age <= 45,
  },
  {
    name: "PM Fasal Bima Yojana",
    description: "Crop insurance for farmers against natural calamities",
    benefits: "Insurance cover for crops at low premium (1.5-5% of sum insured)",
    howToApply: "Enroll through bank or CSC before sowing season",
    check: (p) => p.employment === "farmer",
  },
  {
    name: "Startup India",
    description: "Benefits for DPIIT-recognized startups",
    benefits: "Tax exemption for 3 years, easy compliance, funding support, IPR benefits",
    howToApply: "Register at startupindia.gov.in with business incorporation",
    check: (p) => p.employment === "self-employed" && p.age >= 18,
  },
  {
    name: "National Scholarship Portal",
    description: "Scholarships for students from economically weaker sections and reserved categories",
    benefits: "Various scholarships covering tuition fees and maintenance",
    howToApply: "Apply at scholarships.gov.in with academic and income documents",
    check: (p) => p.age >= 5 && p.age <= 35 && (p.income <= 600000 || p.category === "sc" || p.category === "st" || p.category === "obc"),
  },
  {
    name: "PM SVANidhi (Street Vendor)",
    description: "Micro-credit for street vendors affected by COVID-19",
    benefits: "Working capital loan of Rs 10,000-50,000 at subsidized rate",
    howToApply: "Apply at pmsvanidhi.mohua.gov.in with vendor certificate",
    check: (p) => p.employment === "self-employed" && p.income <= 300000,
  },
  {
    name: "Beti Bachao Beti Padhao",
    description: "Awareness and incentives for education of girl child",
    benefits: "Various educational and financial incentives for girls (state-dependent)",
    howToApply: "Contact local Women & Child Development office or school",
    check: (p) => p.gender === "female" && p.age <= 18,
  },
  {
    name: "PM Garib Kalyan Anna Yojana",
    description: "Free food grains for eligible households",
    benefits: "5 kg free food grains per person per month for eligible families",
    howToApply: "Through PDS ration shop with ration card",
    check: (p) => p.bpl || p.income <= 200000,
  },
  {
    name: "Soil Health Card Scheme",
    description: "Soil testing and nutrition recommendations for farmers",
    benefits: "Free soil health card with crop-wise recommendations",
    howToApply: "Contact local agriculture extension office or Krishi Vigyan Kendra",
    check: (p) => p.employment === "farmer",
  },
  {
    name: "PM Jan Dhan Yojana",
    description: "Zero balance bank account for financial inclusion",
    benefits: "Zero balance account + RuPay card + Rs 1 lakh accident insurance + Rs 10,000 overdraft",
    howToApply: "Visit any bank branch with Aadhaar/identity proof",
    check: () => true,
  },
  {
    name: "Digital India - Free WiFi (PM-WANI)",
    description: "Public WiFi access points across the country",
    benefits: "Affordable or free WiFi access at public places",
    howToApply: "Connect to PM-WANI enabled WiFi hotspots",
    check: () => true,
  },
  {
    name: "Free Ration Scheme (AAY/PHH)",
    description: "Subsidized/free ration for Antyodaya and Priority households",
    benefits: "35 kg grain/month (AAY) or 5 kg/person/month (PHH) at Rs 1-3/kg",
    howToApply: "Apply for ration card at local food and supply office",
    check: (p) => p.bpl || p.income <= 300000,
  },
  {
    name: "Senior Citizen Savings Scheme",
    description: "High-interest savings for citizens aged 60+",
    benefits: "8.2% interest p.a., quarterly payment, tax benefit under 80C (up to Rs 30L)",
    howToApply: "Open account at any Post Office or bank with age proof",
    check: (p) => p.age >= 60,
  },
  {
    name: "Post-Matric Scholarship for SC/ST",
    description: "Scholarship for SC/ST students pursuing post-matric education",
    benefits: "Tuition fee reimbursement + monthly maintenance allowance",
    howToApply: "Apply through state scholarship portal or National Scholarship Portal",
    check: (p) => (p.category === "sc" || p.category === "st") && p.age >= 15 && p.age <= 35 && p.income <= 250000,
  },
  {
    name: "Pradhan Mantri Rojgar Protsahan Yojana",
    description: "Employment generation incentive for employers",
    benefits: "Govt pays employer's EPF contribution (12%) for new employees",
    howToApply: "Employer registers at epfindia.gov.in (employee salary < Rs 15,000/month)",
    check: (p) => p.employment === "employed" && p.income <= 180000,
  },
  {
    name: "Kisan Credit Card",
    description: "Credit facility for farmers at subsidized interest rates",
    benefits: "Short-term crop loan at 4% interest (after subsidy), up to Rs 3 lakh",
    howToApply: "Apply at any bank with land records and identity proof",
    check: (p) => p.employment === "farmer",
  },
];

const STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
  "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
];

export default function GovtSchemeChecker() {
  const [age, setAge] = useState(30);
  const [gender, setGender] = useState<Gender>("male");
  const [income, setIncome] = useState(300000);
  const [category, setCategory] = useState<CategoryType>("general");
  const [state, setState] = useState("Maharashtra");
  const [employment, setEmployment] = useState<Employment>("employed");
  const [bpl, setBpl] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const profile: Profile = { age, gender, income, category, state, employment, bpl };

  const eligible = useMemo(() => {
    if (!showResults) return [];
    return SCHEMES.filter((s) => s.check(profile));
  }, [showResults, profile]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">Age</label>
          <input className="calc-input" type="number" min={0} max={120} value={age} onChange={(e) => setAge(+e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">Gender</label>
          <select className="calc-input" value={gender} onChange={(e) => setGender(e.target.value as Gender)}>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">Annual Income (Rs)</label>
          <input className="calc-input" type="number" min={0} step={10000} value={income} onChange={(e) => setIncome(+e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">Category</label>
          <select className="calc-input" value={category} onChange={(e) => setCategory(e.target.value as CategoryType)}>
            <option value="general">General</option>
            <option value="obc">OBC</option>
            <option value="sc">SC</option>
            <option value="st">ST</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">State</label>
          <select className="calc-input" value={state} onChange={(e) => setState(e.target.value)}>
            {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">Employment Status</label>
          <select className="calc-input" value={employment} onChange={(e) => setEmployment(e.target.value as Employment)}>
            <option value="employed">Employed</option>
            <option value="unemployed">Unemployed</option>
            <option value="self-employed">Self-Employed</option>
            <option value="farmer">Farmer</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <input type="checkbox" id="bpl" checked={bpl} onChange={(e) => setBpl(e.target.checked)} className="w-4 h-4" />
        <label htmlFor="bpl" className="text-sm font-semibold text-gray-700">BPL Card Holder</label>
      </div>

      <button className="btn-primary w-full" onClick={() => setShowResults(true)}>Check Eligible Schemes</button>

      {showResults && (
        <div className="space-y-4">
          <div className="result-card bg-indigo-50 border border-indigo-200 text-center">
            <div className="text-xs text-indigo-500 font-semibold">You may be eligible for</div>
            <div className="text-3xl font-extrabold text-indigo-700">{eligible.length} Government Schemes</div>
          </div>

          {eligible.map((scheme, i) => (
            <div key={i} className="result-card">
              <div className="text-lg font-bold text-gray-800 mb-1">{scheme.name}</div>
              <div className="text-sm text-gray-600 mb-3">{scheme.description}</div>
              <div className="space-y-2">
                <div className="bg-green-50 rounded-lg p-3">
                  <div className="text-xs font-semibold text-green-700">Benefits</div>
                  <div className="text-sm text-green-800">{scheme.benefits}</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="text-xs font-semibold text-blue-700">How to Apply</div>
                  <div className="text-sm text-blue-800">{scheme.howToApply}</div>
                </div>
              </div>
            </div>
          ))}

          {eligible.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              No matching schemes found for the given profile. Try adjusting your inputs.
            </div>
          )}
        </div>
      )}

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
        <div className="flex items-start gap-2">
          <span className="text-lg">{"\u2139\uFE0F"}</span>
          <div>
            <p className="font-semibold mb-1">Disclaimer</p>
            <p>Scheme details as of March 2026. Verify eligibility on myscheme.gov.in</p>
          </div>
        </div>
      </div>
    </div>
  );
}
