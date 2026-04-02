"use client";
import { useState, useMemo, useRef } from "react";

const NOTICE_TYPES = [
  { value: "cheque_bounce", label: "Cheque Bounce (Section 138 NI Act)" },
  { value: "eviction", label: "Eviction Notice" },
  { value: "recovery", label: "Recovery of Money" },
  { value: "defamation", label: "Defamation Notice" },
  { value: "consumer", label: "Consumer Complaint" },
];

export default function LegalNoticeGenerator() {
  const [noticeType, setNoticeType] = useState("cheque_bounce");
  const [senderName, setSenderName] = useState("");
  const [senderAddress, setSenderAddress] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [noticeDate, setNoticeDate] = useState(new Date().toISOString().split("T")[0]);
  const [amount, setAmount] = useState("");
  const [chequeNo, setChequeNo] = useState("");
  const [chequeDate, setChequeDate] = useState("");
  const [bankName, setBankName] = useState("");
  const [propertyDetails, setPropertyDetails] = useState("");
  const [issueDescription, setIssueDescription] = useState("");
  const [productService, setProductService] = useState("");
  const outputRef = useRef<HTMLDivElement>(null);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  const formatDate = (d: string) => {
    if (!d) return "___________";
    return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
  };

  const notice = useMemo(() => {
    if (!senderName || !recipientName) return null;

    const sender = senderName || "[SENDER NAME]";
    const recipient = recipientName || "[RECIPIENT NAME]";
    const sAddr = senderAddress || "[SENDER ADDRESS]";
    const rAddr = recipientAddress || "[RECIPIENT ADDRESS]";
    const dt = formatDate(noticeDate);
    const amt = amount ? fmt(parseFloat(amount)) : "[AMOUNT]";

    let subject = "";
    let body = "";
    let legalRef = "";
    let demand = "";

    switch (noticeType) {
      case "cheque_bounce":
        subject = `LEGAL NOTICE UNDER SECTION 138 OF THE NEGOTIABLE INSTRUMENTS ACT, 1881`;
        legalRef = `This notice is being served upon you under Section 138 read with Section 141 of the Negotiable Instruments Act, 1881.`;
        body = `That you had issued a cheque bearing No. ${chequeNo || "[CHEQUE NO.]"} dated ${chequeDate ? formatDate(chequeDate) : "[DATE]"} for an amount of ${amt} drawn on ${bankName || "[BANK NAME]"} in favour of my client ${sender} towards discharge of your legally enforceable debt/liability.

That when the said cheque was presented for encashment before the bank of my client, the same was returned unpaid/dishonoured with the remark "Insufficient Funds" / "Account Closed" / "Payment Stopped".

That by the dishonour of the said cheque, you have committed an offence punishable under Section 138 of the Negotiable Instruments Act, 1881.`;
        demand = `You are hereby called upon to make the payment of the said amount of ${amt} within 15 (Fifteen) days from the receipt of this notice, failing which my client shall be constrained to initiate appropriate legal proceedings against you under Section 138 of the Negotiable Instruments Act, 1881, at your risk, cost and consequences.`;
        break;

      case "eviction":
        subject = `LEGAL NOTICE FOR EVICTION`;
        legalRef = `This notice is being served upon you under the provisions of the Transfer of Property Act, 1882 and the applicable State Rent Control Act.`;
        body = `That my client ${sender} is the owner/landlord of the property situated at ${propertyDetails || "[PROPERTY ADDRESS/DETAILS]"}.

That you have been occupying the said premises as a tenant. However, you have ${issueDescription || "failed to pay rent regularly / violated the terms of the tenancy agreement / caused damage to the property / used the premises for unauthorized purposes"}.

That despite repeated oral requests and reminders, you have failed to rectify the situation, leaving my client with no option but to serve this legal notice upon you.`;
        demand = `You are hereby directed to vacate and hand over the peaceful possession of the said premises within 30 (Thirty) days from the receipt of this notice, failing which my client shall be compelled to initiate eviction proceedings before the competent court of law at your risk, cost and consequences.`;
        break;

      case "recovery":
        subject = `LEGAL NOTICE FOR RECOVERY OF MONEY`;
        legalRef = `This notice is being served upon you under the provisions of the Indian Contract Act, 1872 and the Code of Civil Procedure, 1908.`;
        body = `That you had borrowed/taken a sum of ${amt} from my client ${sender} on ${issueDescription || "[DATE/OCCASION]"} with a promise to repay the same within the agreed time period.

That despite the expiry of the agreed time period and repeated requests for repayment, you have willfully and deliberately failed and neglected to repay the said amount.

That the said amount of ${amt} along with interest thereon is legally due and payable by you to my client.`;
        demand = `You are hereby called upon to pay the outstanding amount of ${amt} along with interest at the rate of 18% per annum within 15 (Fifteen) days from the receipt of this notice, failing which my client shall be constrained to file a civil suit for recovery of money with interest and costs before the competent court at your risk, cost and consequences.`;
        break;

      case "defamation":
        subject = `LEGAL NOTICE FOR DEFAMATION`;
        legalRef = `This notice is being served upon you under Sections 499 and 500 of the Indian Penal Code, 1860 (now Bharatiya Nyaya Sanhita, 2023) and the provisions of the Code of Civil Procedure, 1908.`;
        body = `That you have made false, defamatory, and baseless statements/allegations against my client ${sender} by ${issueDescription || "[DESCRIBE THE DEFAMATORY ACT - e.g., publishing/stating/circulating false information]"}.

That the said defamatory statements have caused immense damage to the reputation, goodwill, and social standing of my client, causing mental agony and emotional distress.

That the aforesaid acts on your part constitute the offence of defamation as defined under the law.`;
        demand = `You are hereby called upon to immediately cease and desist from making any further defamatory statements, issue a public apology, and pay compensation of ${amt} for the damages caused, within 15 (Fifteen) days from the receipt of this notice, failing which my client shall initiate criminal and civil proceedings for defamation at your risk, cost and consequences.`;
        break;

      case "consumer":
        subject = `LEGAL NOTICE UNDER THE CONSUMER PROTECTION ACT, 2019`;
        legalRef = `This notice is being served upon you under the provisions of the Consumer Protection Act, 2019.`;
        body = `That my client ${sender} had purchased/availed the product/service "${productService || "[PRODUCT/SERVICE]"}" from you on ${issueDescription || "[DATE]"} for a sum of ${amt}.

That the said product/service was found to be defective/deficient in the following manner: ${issueDescription || "[DESCRIBE THE DEFECT/DEFICIENCY]"}.

That despite multiple complaints and requests for replacement/refund/rectification, you have failed to address the grievance of my client, constituting unfair trade practice and deficiency in service.`;
        demand = `You are hereby called upon to provide a full refund of ${amt} along with compensation for mental agony and harassment within 15 (Fifteen) days from the receipt of this notice, failing which my client shall file a complaint before the appropriate Consumer Disputes Redressal Commission at your risk, cost and consequences.`;
        break;
    }

    return { subject, legalRef, body, demand, sender, recipient, sAddr, rAddr, dt };
  }, [noticeType, senderName, senderAddress, recipientName, recipientAddress, noticeDate, amount, chequeNo, chequeDate, bankName, propertyDetails, issueDescription, productService]);

  const handleCopy = () => {
    if (outputRef.current) {
      const text = outputRef.current.innerText;
      navigator.clipboard.writeText(text);
    }
  };

  const handlePrint = () => {
    if (outputRef.current) {
      const printWin = window.open("", "_blank");
      if (printWin) {
        printWin.document.write(`<html><head><title>Legal Notice</title><style>body{font-family:Georgia,serif;max-width:800px;margin:40px auto;line-height:1.8;font-size:14px;color:#000}h2{text-align:center;text-decoration:underline}p{text-align:justify;margin-bottom:12px}.header{text-align:right;margin-bottom:20px}.subject{font-weight:bold;text-align:center;margin:20px 0}</style></head><body>${outputRef.current.innerHTML}</body></html>`);
        printWin.document.close();
        printWin.print();
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Notice Type</label>
          <select value={noticeType} onChange={(e) => setNoticeType(e.target.value)} className="calc-input">
            {NOTICE_TYPES.map((nt) => <option key={nt.value} value={nt.value}>{nt.label}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Sender (Client) Name</label>
            <input type="text" placeholder="Your full name" value={senderName} onChange={(e) => setSenderName(e.target.value)} className="calc-input" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Recipient Name</label>
            <input type="text" placeholder="Recipient full name" value={recipientName} onChange={(e) => setRecipientName(e.target.value)} className="calc-input" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Sender Address</label>
            <textarea placeholder="Full address" value={senderAddress} onChange={(e) => setSenderAddress(e.target.value)} className="calc-input" rows={2} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Recipient Address</label>
            <textarea placeholder="Full address" value={recipientAddress} onChange={(e) => setRecipientAddress(e.target.value)} className="calc-input" rows={2} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Notice Date</label>
            <input type="date" value={noticeDate} onChange={(e) => setNoticeDate(e.target.value)} className="calc-input" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Amount (if applicable)</label>
            <input type="number" placeholder="Amount in ₹" value={amount} onChange={(e) => setAmount(e.target.value)} className="calc-input" />
          </div>
        </div>

        {/* Conditional fields based on notice type */}
        {noticeType === "cheque_bounce" && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Cheque Number</label>
              <input type="text" placeholder="e.g. 000123" value={chequeNo} onChange={(e) => setChequeNo(e.target.value)} className="calc-input" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Cheque Date</label>
              <input type="date" value={chequeDate} onChange={(e) => setChequeDate(e.target.value)} className="calc-input" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Bank Name</label>
              <input type="text" placeholder="e.g. SBI" value={bankName} onChange={(e) => setBankName(e.target.value)} className="calc-input" />
            </div>
          </div>
        )}

        {noticeType === "eviction" && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Property Details / Address</label>
            <textarea placeholder="Property address and details" value={propertyDetails} onChange={(e) => setPropertyDetails(e.target.value)} className="calc-input" rows={2} />
          </div>
        )}

        {noticeType === "consumer" && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Product / Service Name</label>
            <input type="text" placeholder="e.g. Samsung Galaxy S24" value={productService} onChange={(e) => setProductService(e.target.value)} className="calc-input" />
          </div>
        )}

        {(noticeType === "eviction" || noticeType === "recovery" || noticeType === "defamation" || noticeType === "consumer") && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Key Details / Issue Description</label>
            <textarea placeholder="Describe the key issue or details..." value={issueDescription} onChange={(e) => setIssueDescription(e.target.value)} className="calc-input" rows={3} />
          </div>
        )}
      </div>

      {notice && (
        <>
          <div className="flex gap-2">
            <button onClick={handleCopy} className="btn-primary">Copy to Clipboard</button>
            <button onClick={handlePrint} className="btn-secondary">Print Notice</button>
          </div>

          <div ref={outputRef} className="result-card bg-white border border-gray-200 p-6 sm:p-8" style={{ fontFamily: "Georgia, serif", lineHeight: "1.8" }}>
            <div style={{ textAlign: "right", marginBottom: 20 }}>
              <p><strong>Date:</strong> {notice.dt}</p>
              <p><strong>From:</strong></p>
              <p>{notice.sender}</p>
              <p>{notice.sAddr}</p>
            </div>

            <div style={{ marginBottom: 20 }}>
              <p><strong>To,</strong></p>
              <p>{notice.recipient}</p>
              <p>{notice.rAddr}</p>
            </div>

            <h2 style={{ textAlign: "center", textDecoration: "underline", fontWeight: "bold", margin: "20px 0" }}>
              {notice.subject}
            </h2>

            <p><strong>Sir/Madam,</strong></p>

            <p>Under the instructions and on behalf of my client, <strong>{notice.sender}</strong>, residing at {notice.sAddr}, I do hereby serve upon you the following Legal Notice:</p>

            <p style={{ fontSize: "0.85em", color: "#555" }}><em>{notice.legalRef}</em></p>

            {notice.body.split("\n\n").map((para, i) => (
              <p key={i} style={{ textAlign: "justify" }}>{para}</p>
            ))}

            <p style={{ textAlign: "justify", fontWeight: "bold" }}>{notice.demand}</p>

            <p>Please treat this notice as urgent and act accordingly.</p>

            <div style={{ marginTop: 40 }}>
              <p><strong>Yours faithfully,</strong></p>
              <p>[Advocate Name]</p>
              <p>[Enrollment No.]</p>
              <p>Counsel for {notice.sender}</p>
            </div>
          </div>
        </>
      )}

      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-xs text-yellow-800">
        <strong>Disclaimer:</strong> This is a template for reference purposes only. Legal notices should be drafted and sent through a qualified advocate. The template should be customized based on the specific facts and circumstances of each case.
      </div>
    </div>
  );
}
