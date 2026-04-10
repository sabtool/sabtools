"use client";
import { useState, useMemo } from "react";

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa",
  "Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala",
  "Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland",
  "Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura",
  "Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Jammu & Kashmir",
  "Ladakh","Chandigarh","Puducherry","Andaman & Nicobar Islands",
  "Dadra & Nagar Haveli and Daman & Diu","Lakshadweep"
];

interface SchemeInput {
  age: number;
  gender: string;
  income: number;
  category: string;
  occupation: string;
  state: string;
  hasBankAccount: boolean;
  ownsHouse: boolean;
  isBPL: boolean;
}

interface Scheme {
  name: string;
  description: string;
  benefit: string;
  url: string;
  checkEligibility: (input: SchemeInput) => { eligible: boolean; reason: string };
}

const SCHEMES: Scheme[] = [
  {
    name: "PM Kisan Samman Nidhi",
    description: "Direct income support of Rs 6,000/year to small and marginal farmer families.",
    benefit: "Rs 6,000 per year in 3 instalments",
    url: "https://pmkisan.gov.in",
    checkEligibility: (i) => {
      if (i.occupation !== "Farmer") return { eligible: false, reason: "Only for farmers" };
      return { eligible: true, reason: "Eligible as a farmer" };
    },
  },
  {
    name: "PM Awas Yojana",
    description: "Affordable housing for economically weaker sections and low-income groups.",
    benefit: "Up to Rs 2.67 lakh subsidy for home construction",
    url: "https://pmaymis.gov.in",
    checkEligibility: (i) => {
      if (i.ownsHouse) return { eligible: false, reason: "Already owns a house" };
      if (i.income > 600000) return { eligible: false, reason: "Annual income exceeds Rs 6 lakh" };
      return { eligible: true, reason: "Eligible (no house, income within limit)" };
    },
  },
  {
    name: "PM Jan Dhan Yojana",
    description: "Financial inclusion scheme providing zero-balance bank accounts with RuPay debit card.",
    benefit: "Zero-balance account, Rs 2 lakh accident insurance, Rs 30,000 life cover",
    url: "https://pmjdy.gov.in",
    checkEligibility: (i) => {
      if (i.hasBankAccount) return { eligible: false, reason: "Already has a bank account" };
      return { eligible: true, reason: "Eligible (no bank account)" };
    },
  },
  {
    name: "Ayushman Bharat (PM-JAY)",
    description: "Health insurance cover of Rs 5 lakh per family for secondary and tertiary hospitalization.",
    benefit: "Rs 5 lakh health insurance cover per family per year",
    url: "https://pmjay.gov.in",
    checkEligibility: (i) => {
      if (i.income > 500000) return { eligible: false, reason: "Annual income exceeds Rs 5 lakh" };
      return { eligible: true, reason: "Eligible (income below Rs 5 lakh)" };
    },
  },
  {
    name: "PM Ujjwala Yojana",
    description: "Free LPG connections to women from BPL households to reduce indoor air pollution.",
    benefit: "Free LPG connection + first refill and stove",
    url: "https://www.pmuy.gov.in",
    checkEligibility: (i) => {
      if (i.gender !== "Female") return { eligible: false, reason: "Only for women" };
      if (!i.isBPL) return { eligible: false, reason: "Only for BPL card holders" };
      return { eligible: true, reason: "Eligible (female + BPL)" };
    },
  },
  {
    name: "Sukanya Samriddhi Yojana",
    description: "Savings scheme for the girl child with high interest rate and tax benefits.",
    benefit: "~8% interest rate, tax-free maturity, 21-year tenure",
    url: "https://www.nsiindia.gov.in/InternalPage.aspx?Id_Pk=89",
    checkEligibility: (i) => {
      if (i.gender !== "Female") return { eligible: false, reason: "Only for girls" };
      if (i.age >= 10) return { eligible: false, reason: "Only for girls below 10 years of age" };
      return { eligible: true, reason: "Eligible (girl child below 10)" };
    },
  },
  {
    name: "Atal Pension Yojana",
    description: "Guaranteed pension of Rs 1,000 to Rs 5,000/month after age 60 for unorganized sector.",
    benefit: "Rs 1,000-5,000 monthly pension after 60",
    url: "https://www.npscra.nsdl.co.in/scheme-details.php",
    checkEligibility: (i) => {
      if (i.age < 18 || i.age > 40) return { eligible: false, reason: "Age must be 18-40 years" };
      if (!i.hasBankAccount) return { eligible: false, reason: "Bank account required" };
      return { eligible: true, reason: "Eligible (age 18-40, has bank account)" };
    },
  },
  {
    name: "PM Mudra Yojana",
    description: "Collateral-free loans up to Rs 10 lakh for non-corporate small business enterprises.",
    benefit: "Loans up to Rs 10 lakh (Shishu/Kishore/Tarun)",
    url: "https://www.mudra.org.in",
    checkEligibility: (i) => {
      if (i.occupation !== "Self-Employed") return { eligible: false, reason: "Only for self-employed / small business owners" };
      return { eligible: true, reason: "Eligible (self-employed)" };
    },
  },
  {
    name: "Stand Up India",
    description: "Bank loans between Rs 10 lakh to Rs 1 crore for SC/ST and women entrepreneurs.",
    benefit: "Loans Rs 10 lakh to Rs 1 crore for enterprise setup",
    url: "https://www.standupmitra.in",
    checkEligibility: (i) => {
      if (i.occupation !== "Self-Employed") return { eligible: false, reason: "Only for entrepreneurs / self-employed" };
      const isSCST = i.category === "SC" || i.category === "ST";
      const isFemale = i.gender === "Female";
      if (!isSCST && !isFemale) return { eligible: false, reason: "Only for SC/ST or women entrepreneurs" };
      return { eligible: true, reason: `Eligible (${isFemale ? "woman" : "SC/ST"} entrepreneur)` };
    },
  },
  {
    name: "PM Vishwakarma",
    description: "Support for traditional artisans and craftspersons with training, toolkit, and credit.",
    benefit: "Up to Rs 3 lakh loan, free toolkit, stipend during training",
    url: "https://pmvishwakarma.gov.in",
    checkEligibility: (i) => {
      if (i.occupation !== "Self-Employed") return { eligible: false, reason: "Primarily for self-employed artisans/craftspersons" };
      return { eligible: true, reason: "Eligible (self-employed artisan/craftsperson)" };
    },
  },
  {
    name: "National Pension Scheme (NPS)",
    description: "Voluntary retirement savings scheme with market-linked returns and tax benefits.",
    benefit: "Tax deduction up to Rs 2 lakh, pension corpus at retirement",
    url: "https://www.npscra.nsdl.co.in",
    checkEligibility: (i) => {
      if (i.age < 18 || i.age > 70) return { eligible: false, reason: "Age must be 18-70 years" };
      if (i.occupation !== "Salaried" && i.occupation !== "Self-Employed") return { eligible: false, reason: "For salaried or self-employed individuals" };
      return { eligible: true, reason: "Eligible (age 18-70, working individual)" };
    },
  },
  {
    name: "PM Scholarship Scheme",
    description: "Scholarships for wards of ex-servicemen and Central Armed Police Forces personnel.",
    benefit: "Rs 3,000/month (boys), Rs 3,000/month (girls) for professional courses",
    url: "https://scholarships.gov.in",
    checkEligibility: (i) => {
      if (i.occupation !== "Student") return { eligible: false, reason: "Only for students" };
      return { eligible: true, reason: "Eligible (student)" };
    },
  },
  {
    name: "National Apprenticeship Promotion Scheme",
    description: "Stipend support for apprentices in establishments across India.",
    benefit: "Up to Rs 1,500/month stipend support during apprenticeship",
    url: "https://www.apprenticeshipindia.gov.in",
    checkEligibility: (i) => {
      if (i.occupation !== "Student") return { eligible: false, reason: "Only for students / trainees" };
      if (i.age < 16 || i.age > 25) return { eligible: false, reason: "Age must be 16-25 years" };
      return { eligible: true, reason: "Eligible (student, age 16-25)" };
    },
  },
  {
    name: "PM SVANidhi",
    description: "Micro-credit facility for street vendors to resume livelihood activities.",
    benefit: "Working capital loan up to Rs 50,000",
    url: "https://pmsvanidhi.mohua.gov.in",
    checkEligibility: (i) => {
      if (i.occupation !== "Self-Employed") return { eligible: false, reason: "Only for street vendors / self-employed" };
      return { eligible: true, reason: "Eligible (self-employed / street vendor)" };
    },
  },
  {
    name: "Mahatma Gandhi NREGA",
    description: "Guaranteed 100 days of wage employment per year to rural households.",
    benefit: "100 days guaranteed employment per year",
    url: "https://nrega.nic.in",
    checkEligibility: (i) => {
      if (i.occupation !== "Unemployed" && i.occupation !== "Farmer") return { eligible: false, reason: "Primarily for unemployed / rural workers" };
      return { eligible: true, reason: "Eligible (rural employment guarantee)" };
    },
  },
  {
    name: "PM Garib Kalyan Anna Yojana",
    description: "Free food grains (5 kg/person/month) to economically vulnerable families.",
    benefit: "5 kg free food grains per person per month",
    url: "https://nfsa.gov.in",
    checkEligibility: (i) => {
      if (!i.isBPL) return { eligible: false, reason: "Only for BPL card holders" };
      return { eligible: true, reason: "Eligible (BPL card holder)" };
    },
  },
  {
    name: "Pradhan Mantri Jeevan Jyoti Bima Yojana",
    description: "Low-cost life insurance scheme with Rs 2 lakh death cover at Rs 436/year premium.",
    benefit: "Rs 2 lakh life insurance cover at Rs 436/year",
    url: "https://www.jansuraksha.gov.in/Forms-PMJJBY.aspx",
    checkEligibility: (i) => {
      if (i.age < 18 || i.age > 50) return { eligible: false, reason: "Age must be 18-50 years" };
      if (!i.hasBankAccount) return { eligible: false, reason: "Bank account required" };
      return { eligible: true, reason: "Eligible (age 18-50, has bank account)" };
    },
  },
  {
    name: "Pradhan Mantri Suraksha Bima Yojana",
    description: "Accident insurance cover of Rs 2 lakh at just Rs 20/year premium.",
    benefit: "Rs 2 lakh accident insurance at Rs 20/year",
    url: "https://www.jansuraksha.gov.in/Forms-PMSBY.aspx",
    checkEligibility: (i) => {
      if (i.age < 18 || i.age > 70) return { eligible: false, reason: "Age must be 18-70 years" };
      if (!i.hasBankAccount) return { eligible: false, reason: "Bank account required" };
      return { eligible: true, reason: "Eligible (age 18-70, has bank account)" };
    },
  },
  {
    name: "Senior Citizens Savings Scheme",
    description: "High-interest savings scheme exclusively for senior citizens with quarterly payouts.",
    benefit: "~8.2% interest, quarterly payouts, max Rs 30 lakh deposit",
    url: "https://www.nsiindia.gov.in/InternalPage.aspx?Id_Pk=55",
    checkEligibility: (i) => {
      if (i.age < 60) return { eligible: false, reason: "Only for senior citizens (age 60+)" };
      return { eligible: true, reason: "Eligible (senior citizen)" };
    },
  },
  {
    name: "PM Vaya Vandana Yojana",
    description: "Pension scheme for senior citizens providing assured returns through LIC.",
    benefit: "Assured pension for 10 years on lump sum investment",
    url: "https://www.licindia.in",
    checkEligibility: (i) => {
      if (i.age < 60) return { eligible: false, reason: "Only for senior citizens (age 60+)" };
      return { eligible: true, reason: "Eligible (senior citizen)" };
    },
  },
  {
    name: "Startup India Scheme",
    description: "Tax benefits, funding support, and ease of compliance for recognized startups.",
    benefit: "3-year tax holiday, self-certification, seed fund up to Rs 50 lakh",
    url: "https://www.startupindia.gov.in",
    checkEligibility: (i) => {
      if (i.occupation !== "Self-Employed") return { eligible: false, reason: "Only for self-employed / entrepreneurs" };
      if (i.age < 18 || i.age > 50) return { eligible: false, reason: "Age should be 18-50 years" };
      return { eligible: true, reason: "Eligible (self-employed, age 18-50)" };
    },
  },
  {
    name: "National Education Policy Scholarships",
    description: "Merit-based and need-based scholarships for students under the National Education Policy.",
    benefit: "Tuition fee support and monthly stipend for meritorious students",
    url: "https://scholarships.gov.in",
    checkEligibility: (i) => {
      if (i.occupation !== "Student") return { eligible: false, reason: "Only for students" };
      return { eligible: true, reason: "Eligible (student)" };
    },
  },
  {
    name: "Ladli Behna Yojana",
    description: "Monthly financial assistance to women in select states (MP, Maharashtra).",
    benefit: "Rs 1,250/month direct transfer to eligible women",
    url: "https://cmladlibahna.mp.gov.in",
    checkEligibility: (i) => {
      if (i.gender !== "Female") return { eligible: false, reason: "Only for women" };
      const validStates = ["Madhya Pradesh", "Maharashtra"];
      if (!validStates.includes(i.state)) return { eligible: false, reason: "Only available in Madhya Pradesh and Maharashtra" };
      return { eligible: true, reason: `Eligible (woman in ${i.state})` };
    },
  },
  {
    name: "PM Matru Vandana Yojana",
    description: "Cash incentive for pregnant and lactating women for first live birth.",
    benefit: "Rs 11,000 in instalments for first child (Rs 6,000 for second girl child)",
    url: "https://pmmvy.wcd.gov.in",
    checkEligibility: (i) => {
      if (i.gender !== "Female") return { eligible: false, reason: "Only for women" };
      if (i.age < 19) return { eligible: false, reason: "Age must be 19 or above" };
      return { eligible: true, reason: "Eligible (woman, age 19+)" };
    },
  },
  {
    name: "Agniveer Scheme",
    description: "Short-term military recruitment for youth in Indian Armed Forces for 4 years.",
    benefit: "Rs 30,000-40,000/month salary + Rs 11.71 lakh Seva Nidhi package",
    url: "https://agnipathvayu.cdac.in",
    checkEligibility: (i) => {
      if (i.age < 17.5 || i.age > 21) return { eligible: false, reason: "Age must be 17.5-21 years" };
      return { eligible: true, reason: "Eligible (age 17.5-21)" };
    },
  },
  {
    name: "PM Kaushal Vikas Yojana",
    description: "Free skill training and certification for Indian youth to improve employability.",
    benefit: "Free training, certification, and placement assistance",
    url: "https://www.pmkvyofficial.org",
    checkEligibility: (i) => {
      if (i.occupation !== "Student" && i.occupation !== "Unemployed") return { eligible: false, reason: "For students and unemployed youth" };
      if (i.age < 15 || i.age > 45) return { eligible: false, reason: "Age must be 15-45 years" };
      return { eligible: true, reason: "Eligible (student/unemployed, age 15-45)" };
    },
  },
  {
    name: "PM Free Silai Machine Yojana",
    description: "Free sewing machines for economically weaker women to promote self-employment.",
    benefit: "Free sewing machine for skill-based livelihood",
    url: "https://www.india.gov.in",
    checkEligibility: (i) => {
      if (i.gender !== "Female") return { eligible: false, reason: "Only for women" };
      if (i.income > 300000) return { eligible: false, reason: "Annual income must be below Rs 3 lakh" };
      return { eligible: true, reason: "Eligible (woman, income below Rs 3 lakh)" };
    },
  },
];

export default function GovtSchemeEligibilityFinder() {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [income, setIncome] = useState("");
  const [category, setCategory] = useState("");
  const [occupation, setOccupation] = useState("");
  const [state, setState] = useState("");
  const [hasBankAccount, setHasBankAccount] = useState("");
  const [ownsHouse, setOwnsHouse] = useState("");
  const [isBPL, setIsBPL] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [showIneligible, setShowIneligible] = useState(false);

  const isFormComplete =
    age !== "" &&
    gender !== "" &&
    income !== "" &&
    category !== "" &&
    occupation !== "" &&
    state !== "" &&
    hasBankAccount !== "" &&
    ownsHouse !== "" &&
    isBPL !== "";

  const results = useMemo(() => {
    if (!showResults || !isFormComplete) return null;

    const input: SchemeInput = {
      age: parseFloat(age),
      gender,
      income: parseFloat(income),
      category,
      occupation,
      state,
      hasBankAccount: hasBankAccount === "Yes",
      ownsHouse: ownsHouse === "Yes",
      isBPL: isBPL === "Yes",
    };

    const eligible: { scheme: Scheme; reason: string }[] = [];
    const ineligible: { scheme: Scheme; reason: string }[] = [];

    for (const scheme of SCHEMES) {
      const result = scheme.checkEligibility(input);
      if (result.eligible) {
        eligible.push({ scheme, reason: result.reason });
      } else {
        ineligible.push({ scheme, reason: result.reason });
      }
    }

    return { eligible, ineligible };
  }, [showResults, isFormComplete, age, gender, income, category, occupation, state, hasBankAccount, ownsHouse, isBPL]);

  const handleCheck = () => {
    setShowResults(true);
  };

  const handleReset = () => {
    setAge("");
    setGender("");
    setIncome("");
    setCategory("");
    setOccupation("");
    setState("");
    setHasBankAccount("");
    setOwnsHouse("");
    setIsBPL("");
    setShowResults(false);
    setShowIneligible(false);
  };

  return (
    <div className="space-y-6">
      {/* Questionnaire */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Age */}
        <div>
          <label htmlFor="scheme-age" className="text-sm font-semibold text-gray-700 block mb-2">
            Age (in years)
          </label>
          <input
            id="scheme-age"
            type="number"
            min="0"
            max="120"
            placeholder="e.g. 28"
            value={age}
            onChange={(e) => { setAge(e.target.value); setShowResults(false); }}
            className="calc-input"
          />
        </div>

        {/* Gender */}
        <div>
          <label htmlFor="scheme-gender" className="text-sm font-semibold text-gray-700 block mb-2">
            Gender
          </label>
          <select
            id="scheme-gender"
            value={gender}
            onChange={(e) => { setGender(e.target.value); setShowResults(false); }}
            className="calc-input"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Annual Income */}
        <div>
          <label htmlFor="scheme-income" className="text-sm font-semibold text-gray-700 block mb-2">
            Annual Income (INR)
          </label>
          <input
            id="scheme-income"
            type="number"
            min="0"
            placeholder="e.g. 250000"
            value={income}
            onChange={(e) => { setIncome(e.target.value); setShowResults(false); }}
            className="calc-input"
          />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="scheme-category" className="text-sm font-semibold text-gray-700 block mb-2">
            Category
          </label>
          <select
            id="scheme-category"
            value={category}
            onChange={(e) => { setCategory(e.target.value); setShowResults(false); }}
            className="calc-input"
          >
            <option value="">Select Category</option>
            <option value="General">General</option>
            <option value="OBC">OBC</option>
            <option value="SC">SC</option>
            <option value="ST">ST</option>
            <option value="EWS">EWS</option>
          </select>
        </div>

        {/* Occupation */}
        <div>
          <label htmlFor="scheme-occupation" className="text-sm font-semibold text-gray-700 block mb-2">
            Occupation
          </label>
          <select
            id="scheme-occupation"
            value={occupation}
            onChange={(e) => { setOccupation(e.target.value); setShowResults(false); }}
            className="calc-input"
          >
            <option value="">Select Occupation</option>
            <option value="Farmer">Farmer</option>
            <option value="Student">Student</option>
            <option value="Salaried">Salaried</option>
            <option value="Self-Employed">Self-Employed</option>
            <option value="Unemployed">Unemployed</option>
            <option value="Senior Citizen">Senior Citizen</option>
          </select>
        </div>

        {/* State */}
        <div>
          <label htmlFor="scheme-state" className="text-sm font-semibold text-gray-700 block mb-2">
            State / UT
          </label>
          <select
            id="scheme-state"
            value={state}
            onChange={(e) => { setState(e.target.value); setShowResults(false); }}
            className="calc-input"
          >
            <option value="">Select State</option>
            {INDIAN_STATES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Bank Account */}
        <div>
          <label htmlFor="scheme-bank" className="text-sm font-semibold text-gray-700 block mb-2">
            Do you have a bank account?
          </label>
          <select
            id="scheme-bank"
            value={hasBankAccount}
            onChange={(e) => { setHasBankAccount(e.target.value); setShowResults(false); }}
            className="calc-input"
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        {/* Own House */}
        <div>
          <label htmlFor="scheme-house" className="text-sm font-semibold text-gray-700 block mb-2">
            Do you own a house?
          </label>
          <select
            id="scheme-house"
            value={ownsHouse}
            onChange={(e) => { setOwnsHouse(e.target.value); setShowResults(false); }}
            className="calc-input"
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        {/* BPL */}
        <div>
          <label htmlFor="scheme-bpl" className="text-sm font-semibold text-gray-700 block mb-2">
            Are you a BPL card holder?
          </label>
          <select
            id="scheme-bpl"
            value={isBPL}
            onChange={(e) => { setIsBPL(e.target.value); setShowResults(false); }}
            className="calc-input"
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleCheck}
          disabled={!isFormComplete}
          className={`flex-1 py-3 rounded-xl font-bold text-white transition ${
            isFormComplete
              ? "bg-indigo-600 hover:bg-indigo-700 cursor-pointer"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          Check Eligibility
        </button>
        <button
          onClick={handleReset}
          className="px-6 py-3 rounded-xl font-bold bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
        >
          Reset
        </button>
      </div>

      {/* Results */}
      {results && (
        <div className="space-y-6">
          {/* Eligible Count Banner */}
          <div className="result-card text-center py-6">
            <div className="text-lg text-gray-500 mb-1">You are eligible for</div>
            <div className="text-5xl font-extrabold text-green-600 mb-1">
              {results.eligible.length}
            </div>
            <div className="text-lg font-semibold text-gray-700">
              government scheme{results.eligible.length !== 1 ? "s" : ""}!
            </div>
          </div>

          {/* Eligible Schemes */}
          {results.eligible.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-green-700">Eligible Schemes</h3>
              {results.eligible.map(({ scheme, reason }) => (
                <div
                  key={scheme.name}
                  className="border-2 border-green-200 bg-green-50 rounded-xl p-4 space-y-2"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="font-bold text-gray-900 text-base">{scheme.name}</h4>
                    <span className="shrink-0 text-xs font-bold bg-green-600 text-white px-2.5 py-1 rounded-full">
                      Eligible
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{scheme.description}</p>
                  <div className="text-sm">
                    <span className="font-semibold text-gray-700">Benefit: </span>
                    <span className="text-gray-600">{scheme.benefit}</span>
                  </div>
                  <div className="text-xs text-green-700 font-medium">{reason}</div>
                  <a
                    href={scheme.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-sm font-semibold text-indigo-600 hover:text-indigo-800 underline"
                  >
                    Visit Official Website &rarr;
                  </a>
                </div>
              ))}
            </div>
          )}

          {/* Ineligible Schemes */}
          {results.ineligible.length > 0 && (
            <div className="space-y-3">
              <button
                onClick={() => setShowIneligible(!showIneligible)}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-700 font-semibold text-sm transition"
              >
                <svg
                  className={`w-4 h-4 transition-transform ${showIneligible ? "rotate-90" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                {showIneligible ? "Hide" : "Show"} {results.ineligible.length} non-eligible scheme
                {results.ineligible.length !== 1 ? "s" : ""}
              </button>

              {showIneligible && (
                <div className="space-y-2">
                  {results.ineligible.map(({ scheme, reason }) => (
                    <div
                      key={scheme.name}
                      className="border border-gray-200 bg-gray-50 rounded-xl p-4 opacity-70 space-y-1"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <h4 className="font-bold text-gray-500 text-sm">{scheme.name}</h4>
                        <span className="shrink-0 text-xs font-semibold bg-gray-300 text-gray-600 px-2.5 py-1 rounded-full">
                          Not Eligible
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">{scheme.description}</p>
                      <div className="text-xs text-red-500 font-medium">Reason: {reason}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
