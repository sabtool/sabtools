"use client";
import { useState, useRef, useCallback } from "react";

type TemplateStyle = "classic-gold" | "modern-blue" | "elegant-purple";

export default function CertificateGenerator() {
  const [recipientName, setRecipientName] = useState("");
  const [certificateTitle, setCertificateTitle] = useState("Certificate of Achievement");
  const [issuerName, setIssuerName] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [description, setDescription] = useState("");
  const [template, setTemplate] = useState<TemplateStyle>("classic-gold");
  const [format, setFormat] = useState<"png" | "jpg">("png");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const templates: { id: TemplateStyle; name: string; desc: string }[] = [
    { id: "classic-gold", name: "Classic Gold Border", desc: "Traditional gold border with serif fonts" },
    { id: "modern-blue", name: "Modern Blue", desc: "Clean modern design with blue accents" },
    { id: "elegant-purple", name: "Elegant Purple", desc: "Sophisticated purple gradient style" },
  ];

  const getColors = (t: TemplateStyle) => {
    if (t === "classic-gold") return { bg: "#FFFDF5", border: "#C5A028", accent: "#8B7018", text: "#333333", titleColor: "#6B4F12" };
    if (t === "modern-blue") return { bg: "#F0F7FF", border: "#2563EB", accent: "#1D4ED8", text: "#1E293B", titleColor: "#1E40AF" };
    return { bg: "#FAF5FF", border: "#7C3AED", accent: "#6D28D9", text: "#1E1B4B", titleColor: "#5B21B6" };
  };

  const renderCertificate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = 1200, H = 900;
    canvas.width = W;
    canvas.height = H;

    const c = getColors(template);

    // Background
    ctx.fillStyle = c.bg;
    ctx.fillRect(0, 0, W, H);

    // Outer border
    ctx.strokeStyle = c.border;
    ctx.lineWidth = 8;
    ctx.strokeRect(20, 20, W - 40, H - 40);

    // Inner border
    ctx.strokeStyle = c.accent;
    ctx.lineWidth = 3;
    ctx.strokeRect(35, 35, W - 70, H - 70);

    // Decorative corners
    if (template === "classic-gold") {
      ctx.strokeStyle = c.border;
      ctx.lineWidth = 2;
      const cornerSize = 60;
      const positions = [
        [50, 50], [W - 50, 50], [50, H - 50], [W - 50, H - 50]
      ];
      positions.forEach(([x, y]) => {
        ctx.beginPath();
        ctx.arc(x, y, cornerSize / 2, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(x, y, cornerSize / 4, 0, Math.PI * 2);
        ctx.stroke();
      });
    }

    if (template === "modern-blue") {
      ctx.fillStyle = c.border;
      ctx.fillRect(50, 50, 100, 4);
      ctx.fillRect(W - 150, 50, 100, 4);
      ctx.fillRect(50, H - 54, 100, 4);
      ctx.fillRect(W - 150, H - 54, 100, 4);
    }

    if (template === "elegant-purple") {
      const grad = ctx.createLinearGradient(0, 0, W, 0);
      grad.addColorStop(0, "rgba(124,58,237,0.1)");
      grad.addColorStop(0.5, "rgba(124,58,237,0)");
      grad.addColorStop(1, "rgba(124,58,237,0.1)");
      ctx.fillStyle = grad;
      ctx.fillRect(40, 40, W - 80, H - 80);
    }

    // Certificate title
    ctx.textAlign = "center";
    ctx.fillStyle = c.titleColor;
    ctx.font = "bold 48px Georgia, serif";
    ctx.fillText(certificateTitle, W / 2, 180);

    // Decorative line under title
    ctx.strokeStyle = c.border;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(W / 2 - 200, 200);
    ctx.lineTo(W / 2 + 200, 200);
    ctx.stroke();

    // "This is presented to"
    ctx.fillStyle = c.text;
    ctx.font = "italic 22px Georgia, serif";
    ctx.fillText("This is proudly presented to", W / 2, 280);

    // Recipient name
    ctx.fillStyle = c.titleColor;
    ctx.font = "bold 56px Georgia, serif";
    ctx.fillText(recipientName || "Recipient Name", W / 2, 370);

    // Decorative line under name
    ctx.strokeStyle = c.accent;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(W / 2 - 250, 395);
    ctx.lineTo(W / 2 + 250, 395);
    ctx.stroke();

    // Description
    if (description) {
      ctx.fillStyle = c.text;
      ctx.font = "20px Georgia, serif";
      const words = description.split(" ");
      let line = "";
      let y = 450;
      for (const word of words) {
        const test = line + word + " ";
        if (ctx.measureText(test).width > 800) {
          ctx.fillText(line.trim(), W / 2, y);
          line = word + " ";
          y += 30;
        } else {
          line = test;
        }
      }
      ctx.fillText(line.trim(), W / 2, y);
    }

    // Date
    ctx.fillStyle = c.text;
    ctx.font = "18px Georgia, serif";
    const formattedDate = date ? new Date(date + "T00:00:00").toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "";
    ctx.fillText(formattedDate, W / 2, 580);

    // Issuer section
    if (issuerName) {
      ctx.fillStyle = c.text;
      ctx.font = "italic 18px Georgia, serif";
      ctx.fillText("Issued by", W / 2, 680);
      ctx.font = "bold 24px Georgia, serif";
      ctx.fillStyle = c.titleColor;
      ctx.fillText(issuerName, W / 2, 720);
    }

    // Signature lines
    ctx.strokeStyle = c.accent;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(200, 800);
    ctx.lineTo(450, 800);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(750, 800);
    ctx.lineTo(1000, 800);
    ctx.stroke();

    ctx.fillStyle = c.text;
    ctx.font = "14px Georgia, serif";
    ctx.fillText("Signature", 325, 820);
    ctx.fillText("Date", 875, 820);
  }, [recipientName, certificateTitle, issuerName, date, description, template]);

  const download = () => {
    renderCertificate();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `certificate.${format}`;
    link.href = canvas.toDataURL(format === "png" ? "image/png" : "image/jpeg", 0.95);
    link.click();
  };

  // Re-render when any input changes
  useState(() => {
    const timer = setTimeout(renderCertificate, 100);
    return () => clearTimeout(timer);
  });

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">Recipient Name</label>
          <input
            type="text"
            value={recipientName}
            onChange={(e) => { setRecipientName(e.target.value); setTimeout(renderCertificate, 50); }}
            placeholder="John Doe"
            className="calc-input"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">Certificate Title</label>
          <input
            type="text"
            value={certificateTitle}
            onChange={(e) => { setCertificateTitle(e.target.value); setTimeout(renderCertificate, 50); }}
            placeholder="Certificate of Achievement"
            className="calc-input"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">Issuer / Organization</label>
          <input
            type="text"
            value={issuerName}
            onChange={(e) => { setIssuerName(e.target.value); setTimeout(renderCertificate, 50); }}
            placeholder="Acme Corp"
            className="calc-input"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => { setDate(e.target.value); setTimeout(renderCertificate, 50); }}
            className="calc-input"
          />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm font-semibold text-gray-700 block mb-1">Description / Reason</label>
          <textarea
            value={description}
            onChange={(e) => { setDescription(e.target.value); setTimeout(renderCertificate, 50); }}
            placeholder="For outstanding performance in..."
            className="calc-input"
            rows={2}
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Template Style</label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {templates.map((t) => (
            <button
              key={t.id}
              onClick={() => { setTemplate(t.id); setTimeout(renderCertificate, 50); }}
              className={`p-3 rounded-xl border-2 text-left transition ${template === t.id ? "border-indigo-500 bg-indigo-50" : "border-gray-200 hover:border-gray-300"}`}
            >
              <div className="font-semibold text-sm">{t.name}</div>
              <div className="text-xs text-gray-500 mt-0.5">{t.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="result-card">
        <h3 className="text-lg font-bold text-gray-800 mb-3">Preview</h3>
        <canvas
          ref={canvasRef}
          className="w-full rounded-xl border border-gray-200"
          style={{ maxWidth: 720 }}
        />
      </div>

      <div className="flex gap-3 items-center">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">Format</label>
          <select value={format} onChange={(e) => setFormat(e.target.value as "png" | "jpg")} className="calc-input">
            <option value="png">PNG</option>
            <option value="jpg">JPG</option>
          </select>
        </div>
        <button onClick={download} className="btn-primary mt-5">
          Download Certificate
        </button>
      </div>
    </div>
  );
}
