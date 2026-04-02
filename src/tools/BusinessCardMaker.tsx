"use client";
import { useState, useRef, useCallback, useMemo } from "react";

type CardStyle = "minimal" | "dark" | "corporate" | "gradient";
type CardSide = "front" | "back";

const styleConfigs: Record<CardStyle, { bg1: string; bg2: string; text: string; accent: string; subtxt: string; label: string }> = {
  minimal: { bg1: "#FFFFFF", bg2: "#FFFFFF", text: "#222222", accent: "#333333", subtxt: "#888888", label: "Minimal White" },
  dark: { bg1: "#1A1A2E", bg2: "#16213E", text: "#EAEAEA", accent: "#E94560", subtxt: "#8A8A9A", label: "Dark Elegant" },
  corporate: { bg1: "#1E3A5F", bg2: "#2C5F8A", text: "#FFFFFF", accent: "#F5C518", subtxt: "#B8D4E8", label: "Corporate Blue" },
  gradient: { bg1: "#667EEA", bg2: "#764BA2", text: "#FFFFFF", accent: "#FFECD2", subtxt: "#E0D0FF", label: "Creative Gradient" },
};

export default function BusinessCardMaker() {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [address, setAddress] = useState("");
  const [logo, setLogo] = useState<HTMLImageElement | null>(null);
  const [style, setStyle] = useState<CardStyle>("minimal");
  const [side, setSide] = useState<CardSide>("front");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 3.5 x 2 inches at 300 DPI
  const CARD_W = 1050;
  const CARD_H = 600;

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const img = new Image();
    img.onload = () => setLogo(img);
    img.src = URL.createObjectURL(file);
  };

  const drawCard = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = CARD_W;
    canvas.height = CARD_H;
    const cfg = styleConfigs[style];

    // Background
    const bgGrad = ctx.createLinearGradient(0, 0, CARD_W, CARD_H);
    bgGrad.addColorStop(0, cfg.bg1);
    bgGrad.addColorStop(1, cfg.bg2);
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, CARD_W, CARD_H);

    if (side === "front") {
      // Decorative element based on style
      if (style === "minimal") {
        ctx.fillStyle = "#F5F5F5";
        ctx.fillRect(0, CARD_H - 4, CARD_W, 4);
        ctx.fillStyle = "#333333";
        ctx.fillRect(0, CARD_H - 4, 200, 4);
      } else if (style === "dark") {
        ctx.fillStyle = cfg.accent;
        ctx.fillRect(0, 0, 8, CARD_H);
        // Subtle pattern
        ctx.globalAlpha = 0.05;
        for (let i = 0; i < 20; i++) {
          ctx.fillStyle = "#FFFFFF";
          ctx.beginPath();
          ctx.arc(CARD_W - 100 + i * 20, CARD_H - 100 + i * 10, 80, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      } else if (style === "corporate") {
        // Golden accent bar
        ctx.fillStyle = cfg.accent;
        ctx.fillRect(0, CARD_H - 8, CARD_W, 8);
        // Subtle diagonal
        ctx.globalAlpha = 0.08;
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.moveTo(CARD_W - 300, 0);
        ctx.lineTo(CARD_W, 0);
        ctx.lineTo(CARD_W, CARD_H);
        ctx.lineTo(CARD_W - 500, CARD_H);
        ctx.closePath();
        ctx.fill();
        ctx.globalAlpha = 1;
      } else if (style === "gradient") {
        // Floating circles
        ctx.globalAlpha = 0.1;
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.arc(CARD_W - 120, 120, 150, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(100, CARD_H - 50, 80, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // Logo
      const logoSize = 80;
      if (logo) {
        const lx = 60, ly = 50;
        const aspect = logo.width / logo.height;
        const lw = aspect > 1 ? logoSize : logoSize * aspect;
        const lh = aspect > 1 ? logoSize / aspect : logoSize;
        ctx.drawImage(logo, lx, ly, lw, lh);
      }

      // Company name next to logo
      if (companyName) {
        ctx.fillStyle = cfg.text;
        ctx.font = `bold 28px Arial, sans-serif`;
        ctx.textAlign = "left";
        ctx.fillText(companyName, logo ? 160 : 60, 100);
      }

      // Name
      ctx.fillStyle = cfg.text;
      ctx.font = "bold 42px Arial, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(name || "Your Name", 60, 240);

      // Title
      ctx.fillStyle = cfg.accent;
      ctx.font = "22px Arial, sans-serif";
      ctx.fillText(title || "Your Title", 60, 280);

      // Separator
      ctx.fillStyle = cfg.accent;
      ctx.fillRect(60, 310, 100, 3);

      // Contact info
      ctx.fillStyle = cfg.subtxt;
      ctx.font = "18px Arial, sans-serif";
      let y = 350;
      if (phone) { ctx.fillText(`Phone: ${phone}`, 60, y); y += 32; }
      if (email) { ctx.fillText(`Email: ${email}`, 60, y); y += 32; }
      if (website) { ctx.fillText(`Web: ${website}`, 60, y); y += 32; }

      // QR code area placeholder (right side)
      if (website || email) {
        ctx.fillStyle = style === "minimal" ? "#F0F0F0" : "rgba(255,255,255,0.1)";
        ctx.fillRect(CARD_W - 180, CARD_H - 180, 130, 130);
        ctx.fillStyle = cfg.subtxt;
        ctx.font = "11px Arial, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("QR Code", CARD_W - 115, CARD_H - 40);
      }

    } else {
      // BACK SIDE
      // Center content
      ctx.textAlign = "center";

      // Logo large
      if (logo) {
        const lSize = 120;
        const aspect = logo.width / logo.height;
        const lw = aspect > 1 ? lSize : lSize * aspect;
        const lh = aspect > 1 ? lSize / aspect : lSize;
        ctx.drawImage(logo, (CARD_W - lw) / 2, 80, lw, lh);
      }

      // Company name
      ctx.fillStyle = cfg.text;
      ctx.font = "bold 36px Arial, sans-serif";
      ctx.fillText(companyName || "Company Name", CARD_W / 2, logo ? 240 : 180);

      // Tagline
      ctx.fillStyle = cfg.subtxt;
      ctx.font = "italic 20px Arial, sans-serif";
      ctx.fillText(title ? `"${title}"` : "", CARD_W / 2, 280);

      // Separator
      ctx.fillStyle = cfg.accent;
      ctx.fillRect(CARD_W / 2 - 60, 310, 120, 2);

      // Address
      if (address) {
        ctx.fillStyle = cfg.subtxt;
        ctx.font = "16px Arial, sans-serif";
        const lines = address.split("\n");
        lines.forEach((line, i) => {
          ctx.fillText(line, CARD_W / 2, 350 + i * 28);
        });
      }

      // Website
      if (website) {
        ctx.fillStyle = cfg.accent;
        ctx.font = "bold 18px Arial, sans-serif";
        ctx.fillText(website, CARD_W / 2, CARD_H - 60);
      }

      // Decorative border
      ctx.strokeStyle = cfg.accent;
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 4]);
      ctx.strokeRect(30, 30, CARD_W - 60, CARD_H - 60);
      ctx.setLineDash([]);
    }

    // Outer border
    ctx.strokeStyle = style === "minimal" ? "#E0E0E0" : "rgba(255,255,255,0.2)";
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, CARD_W - 2, CARD_H - 2);
  }, [name, title, companyName, phone, email, website, address, logo, style, side, CARD_W, CARD_H]);

  useMemo(() => { drawCard(); }, [drawCard]);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `business-card-${side}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Form */}
      <div className="result-card">
        <h3 className="text-sm font-bold text-gray-800 mb-4">Business Card Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className="calc-input w-full" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Title / Position</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="CEO & Founder" className="calc-input w-full" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Company Name</label>
            <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Acme Inc." className="calc-input w-full" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Phone</label>
            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" className="calc-input w-full" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" className="calc-input w-full" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Website</label>
            <input type="text" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="www.example.com" className="calc-input w-full" />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-gray-600 block mb-1">Address</label>
            <textarea value={address} onChange={(e) => setAddress(e.target.value)} placeholder="123 Business St, City, State" className="calc-input w-full" rows={2} />
          </div>
        </div>
      </div>

      {/* Logo Upload */}
      <div
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition"
      >
        <div className="text-3xl mb-2">🏢</div>
        <div className="text-sm font-semibold text-gray-700">{logo ? "Logo loaded! Click to change" : "Upload Company Logo"}</div>
        <input ref={inputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
      </div>

      {/* Style & Side */}
      <div className="result-card">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-2">Card Style</label>
            <div className="flex flex-wrap gap-2">
              {(Object.entries(styleConfigs) as [CardStyle, typeof styleConfigs.minimal][]).map(([key, cfg]) => (
                <button key={key} onClick={() => setStyle(key)} className={style === key ? "btn-primary" : "btn-secondary"}>
                  {cfg.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-2">Side</label>
            <div className="flex gap-2">
              <button onClick={() => setSide("front")} className={side === "front" ? "btn-primary" : "btn-secondary"}>Front</button>
              <button onClick={() => setSide("back")} className={side === "back" ? "btn-primary" : "btn-secondary"}>Back</button>
            </div>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="result-card">
        <h3 className="text-sm font-bold text-gray-800 mb-3">Preview ({side === "front" ? "Front Side" : "Back Side"})</h3>
        <div className="flex justify-center overflow-auto">
          <canvas ref={canvasRef} className="border rounded-xl shadow-lg" style={{ maxWidth: "100%", height: "auto" }} />
        </div>
      </div>

      {/* Download */}
      <div className="flex gap-3">
        <button onClick={download} className="btn-primary">Download {side === "front" ? "Front" : "Back"} (PNG)</button>
        <button onClick={() => setSide(side === "front" ? "back" : "front")} className="btn-secondary">
          Flip to {side === "front" ? "Back" : "Front"}
        </button>
      </div>

      <div className="result-card bg-blue-50/50">
        <p className="text-xs text-gray-500">
          Business card is generated at 300 DPI (3.5 x 2 inches) for professional printing quality.
        </p>
      </div>
    </div>
  );
}
