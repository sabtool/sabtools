"use client";
import { useState, useMemo } from "react";

type SchemaType = "Article" | "Product" | "FAQ" | "HowTo" | "LocalBusiness" | "Event" | "Recipe" | "Organization";

interface FAQItem { question: string; answer: string; }
interface HowToStep { text: string; }

export default function StructuredDataGenerator() {
  const [schemaType, setSchemaType] = useState<SchemaType>("Article");
  const [copied, setCopied] = useState(false);

  // Article
  const [articleTitle, setArticleTitle] = useState("How to Build a Website");
  const [articleDesc, setArticleDesc] = useState("A complete guide to building your first website");
  const [articleAuthor, setArticleAuthor] = useState("John Doe");
  const [articleDate, setArticleDate] = useState("2024-01-15");
  const [articleImage, setArticleImage] = useState("https://example.com/image.jpg");

  // Product
  const [productName, setProductName] = useState("Wireless Headphones");
  const [productDesc, setProductDesc] = useState("Premium noise-cancelling wireless headphones");
  const [productPrice, setProductPrice] = useState("2999");
  const [productCurrency, setProductCurrency] = useState("INR");
  const [productBrand, setProductBrand] = useState("TechBrand");
  const [productRating, setProductRating] = useState("4.5");
  const [productReviewCount, setProductReviewCount] = useState("150");

  // FAQ
  const [faqItems, setFaqItems] = useState<FAQItem[]>([
    { question: "What is SEO?", answer: "SEO stands for Search Engine Optimization." },
    { question: "Why is SEO important?", answer: "SEO helps your website rank higher in search results." },
  ]);

  // HowTo
  const [howToName, setHowToName] = useState("How to Make Coffee");
  const [howToDesc, setHowToDesc] = useState("Simple steps to brew perfect coffee");
  const [howToSteps, setHowToSteps] = useState<HowToStep[]>([
    { text: "Boil water" }, { text: "Add coffee powder" }, { text: "Pour water and stir" },
  ]);

  // LocalBusiness
  const [bizName, setBizName] = useState("My Restaurant");
  const [bizAddress, setBizAddress] = useState("123 Main St, Mumbai, India");
  const [bizPhone, setBizPhone] = useState("+91-9876543210");
  const [bizUrl, setBizUrl] = useState("https://example.com");

  // Event
  const [eventName, setEventName] = useState("Tech Conference 2024");
  const [eventDate, setEventDate] = useState("2024-06-15");
  const [eventLocation, setEventLocation] = useState("Convention Center, Delhi");
  const [eventDesc, setEventDesc] = useState("Annual technology conference");

  // Recipe
  const [recipeName, setRecipeName] = useState("Butter Chicken");
  const [recipeDesc, setRecipeDesc] = useState("Classic North Indian butter chicken recipe");
  const [recipePrepTime, setRecipePrepTime] = useState("PT30M");
  const [recipeCookTime, setRecipeCookTime] = useState("PT45M");
  const [recipeYield, setRecipeYield] = useState("4 servings");

  // Organization
  const [orgName, setOrgName] = useState("My Company");
  const [orgUrl, setOrgUrl] = useState("https://example.com");
  const [orgLogo, setOrgLogo] = useState("https://example.com/logo.png");

  const jsonLd = useMemo(() => {
    let data: Record<string, unknown> = {};
    switch (schemaType) {
      case "Article":
        data = { "@context": "https://schema.org", "@type": "Article", headline: articleTitle, description: articleDesc, author: { "@type": "Person", name: articleAuthor }, datePublished: articleDate, image: articleImage };
        break;
      case "Product":
        data = { "@context": "https://schema.org", "@type": "Product", name: productName, description: productDesc, brand: { "@type": "Brand", name: productBrand }, offers: { "@type": "Offer", price: productPrice, priceCurrency: productCurrency, availability: "https://schema.org/InStock" }, aggregateRating: { "@type": "AggregateRating", ratingValue: productRating, reviewCount: productReviewCount } };
        break;
      case "FAQ":
        data = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqItems.map(f => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) };
        break;
      case "HowTo":
        data = { "@context": "https://schema.org", "@type": "HowTo", name: howToName, description: howToDesc, step: howToSteps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, text: s.text })) };
        break;
      case "LocalBusiness":
        data = { "@context": "https://schema.org", "@type": "LocalBusiness", name: bizName, address: bizAddress, telephone: bizPhone, url: bizUrl };
        break;
      case "Event":
        data = { "@context": "https://schema.org", "@type": "Event", name: eventName, startDate: eventDate, location: { "@type": "Place", name: eventLocation }, description: eventDesc };
        break;
      case "Recipe":
        data = { "@context": "https://schema.org", "@type": "Recipe", name: recipeName, description: recipeDesc, prepTime: recipePrepTime, cookTime: recipeCookTime, recipeYield };
        break;
      case "Organization":
        data = { "@context": "https://schema.org", "@type": "Organization", name: orgName, url: orgUrl, logo: orgLogo };
        break;
    }
    return JSON.stringify(data, null, 2);
  }, [schemaType, articleTitle, articleDesc, articleAuthor, articleDate, articleImage, productName, productDesc, productPrice, productCurrency, productBrand, productRating, productReviewCount, faqItems, howToName, howToDesc, howToSteps, bizName, bizAddress, bizPhone, bizUrl, eventName, eventDate, eventLocation, eventDesc, recipeName, recipeDesc, recipePrepTime, recipeCookTime, recipeYield, orgName, orgUrl, orgLogo]);

  const scriptTag = `<script type="application/ld+json">\n${jsonLd}\n</script>`;

  const copy = () => {
    navigator.clipboard?.writeText(scriptTag);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const Input = ({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) => (
    <div>
      <label className="text-xs font-semibold text-gray-600 block mb-1">{label}</label>
      <input value={value} onChange={e => onChange(e.target.value)} className="calc-input !py-1.5 text-sm" placeholder={placeholder} />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Schema type selector */}
      <div className="flex flex-wrap gap-2">
        {(["Article", "Product", "FAQ", "HowTo", "LocalBusiness", "Event", "Recipe", "Organization"] as SchemaType[]).map(t => (
          <button key={t} onClick={() => setSchemaType(t)} className={`text-xs px-3 py-1.5 rounded-lg border-2 font-medium ${schemaType === t ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "border-gray-200 hover:border-gray-400"}`}>{t}</button>
        ))}
      </div>

      {/* Form fields per type */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {schemaType === "Article" && <>
          <Input label="Headline" value={articleTitle} onChange={setArticleTitle} />
          <Input label="Author" value={articleAuthor} onChange={setArticleAuthor} />
          <Input label="Date Published" value={articleDate} onChange={setArticleDate} placeholder="YYYY-MM-DD" />
          <Input label="Image URL" value={articleImage} onChange={setArticleImage} />
          <div className="sm:col-span-2"><label className="text-xs font-semibold text-gray-600 block mb-1">Description</label><textarea value={articleDesc} onChange={e => setArticleDesc(e.target.value)} className="calc-input text-sm" rows={2} /></div>
        </>}
        {schemaType === "Product" && <>
          <Input label="Product Name" value={productName} onChange={setProductName} />
          <Input label="Brand" value={productBrand} onChange={setProductBrand} />
          <Input label="Price" value={productPrice} onChange={setProductPrice} />
          <Input label="Currency" value={productCurrency} onChange={setProductCurrency} />
          <Input label="Rating (0-5)" value={productRating} onChange={setProductRating} />
          <Input label="Review Count" value={productReviewCount} onChange={setProductReviewCount} />
          <div className="sm:col-span-2"><label className="text-xs font-semibold text-gray-600 block mb-1">Description</label><textarea value={productDesc} onChange={e => setProductDesc(e.target.value)} className="calc-input text-sm" rows={2} /></div>
        </>}
        {schemaType === "FAQ" && <div className="sm:col-span-2 space-y-3">
          {faqItems.map((f, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
              <div className="flex gap-2 mb-2"><input value={f.question} onChange={e => { const c = [...faqItems]; c[i] = { ...c[i], question: e.target.value }; setFaqItems(c); }} className="calc-input !py-1 flex-1 text-sm" placeholder="Question" /><button onClick={() => setFaqItems(faqItems.filter((_, idx) => idx !== i))} className="text-red-500 text-lg">&times;</button></div>
              <textarea value={f.answer} onChange={e => { const c = [...faqItems]; c[i] = { ...c[i], answer: e.target.value }; setFaqItems(c); }} className="calc-input text-sm" rows={2} placeholder="Answer" />
            </div>
          ))}
          <button onClick={() => setFaqItems([...faqItems, { question: "", answer: "" }])} className="btn-secondary text-xs !py-1.5">+ Add FAQ</button>
        </div>}
        {schemaType === "HowTo" && <>
          <Input label="Title" value={howToName} onChange={setHowToName} />
          <div><label className="text-xs font-semibold text-gray-600 block mb-1">Description</label><textarea value={howToDesc} onChange={e => setHowToDesc(e.target.value)} className="calc-input text-sm" rows={2} /></div>
          <div className="sm:col-span-2 space-y-2">
            <label className="text-xs font-semibold text-gray-600">Steps</label>
            {howToSteps.map((s, i) => (
              <div key={i} className="flex gap-2 items-center">
                <span className="text-xs text-gray-500 w-6">{i + 1}.</span>
                <input value={s.text} onChange={e => { const c = [...howToSteps]; c[i] = { text: e.target.value }; setHowToSteps(c); }} className="calc-input !py-1 flex-1 text-sm" />
                <button onClick={() => setHowToSteps(howToSteps.filter((_, idx) => idx !== i))} className="text-red-500">&times;</button>
              </div>
            ))}
            <button onClick={() => setHowToSteps([...howToSteps, { text: "" }])} className="btn-secondary text-xs !py-1.5">+ Add Step</button>
          </div>
        </>}
        {schemaType === "LocalBusiness" && <>
          <Input label="Business Name" value={bizName} onChange={setBizName} />
          <Input label="Phone" value={bizPhone} onChange={setBizPhone} />
          <Input label="Website URL" value={bizUrl} onChange={setBizUrl} />
          <Input label="Address" value={bizAddress} onChange={setBizAddress} />
        </>}
        {schemaType === "Event" && <>
          <Input label="Event Name" value={eventName} onChange={setEventName} />
          <Input label="Date" value={eventDate} onChange={setEventDate} placeholder="YYYY-MM-DD" />
          <Input label="Location" value={eventLocation} onChange={setEventLocation} />
          <div className="sm:col-span-2"><label className="text-xs font-semibold text-gray-600 block mb-1">Description</label><textarea value={eventDesc} onChange={e => setEventDesc(e.target.value)} className="calc-input text-sm" rows={2} /></div>
        </>}
        {schemaType === "Recipe" && <>
          <Input label="Recipe Name" value={recipeName} onChange={setRecipeName} />
          <Input label="Prep Time (ISO 8601)" value={recipePrepTime} onChange={setRecipePrepTime} placeholder="PT30M" />
          <Input label="Cook Time (ISO 8601)" value={recipeCookTime} onChange={setRecipeCookTime} placeholder="PT45M" />
          <Input label="Yield" value={recipeYield} onChange={setRecipeYield} />
          <div className="sm:col-span-2"><label className="text-xs font-semibold text-gray-600 block mb-1">Description</label><textarea value={recipeDesc} onChange={e => setRecipeDesc(e.target.value)} className="calc-input text-sm" rows={2} /></div>
        </>}
        {schemaType === "Organization" && <>
          <Input label="Organization Name" value={orgName} onChange={setOrgName} />
          <Input label="Website URL" value={orgUrl} onChange={setOrgUrl} />
          <Input label="Logo URL" value={orgLogo} onChange={setOrgLogo} />
        </>}
      </div>

      {/* Output */}
      <div>
        <div className="flex justify-between mb-2">
          <label className="text-sm font-semibold text-gray-700">JSON-LD Output</label>
          <button onClick={copy} className="text-xs text-indigo-600 font-medium hover:underline">{copied ? "Copied!" : "Copy"}</button>
        </div>
        <pre className="result-card font-mono text-xs whitespace-pre-wrap bg-gray-900 text-green-400 p-4 rounded-xl overflow-x-auto">{scriptTag}</pre>
      </div>

      {/* How to use */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
        <strong>How to add to your website:</strong> Copy the script tag above and paste it in the <code>&lt;head&gt;</code> section of your HTML page, or just before the closing <code>&lt;/body&gt;</code> tag. You can validate your structured data using Google&apos;s Rich Results Test.
      </div>
    </div>
  );
}
