"use client";
import { useState, useRef, useCallback, useMemo } from "react";

type Template = "corporate" | "school" | "hospital";
type Side = "front" | "back";

const templateConfig: Record<Template, { primary: string; secondary: string; accent: string; label: string }> = {
  corporate: { primary: "#1E3A5F", secondary: "#2980B9", accent: "#ECF0F1", label: "Corporate Blue" },
  school: { primary: "#1B5E20", secondary: "#43A047", accent: "#E8F5E9", label: "School Green" },
  hospital: { primary: "#B71C1C", secondary: "#E53935", accent: "#FFEBEE", label: "Hospital Red" },
};

export default function IdCardGenerator() {
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [company, setCompany] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [photo, setPhoto] = useState<HTMLImageElement | null>(null);
  const [template, setTemplate] = useState<Template>("corporate");
  const [side, setSide] = useState<Side>("front");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 3.375 x 2.125 inches at 300 DPI
  const CARD_W = 1013; // 3.375 * 300
  const CARD_H = 638;  // 2.125 * 300

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const img = new Image();
    img.onload = () => setPhoto(img);
    img.src = URL.createObjectURL(file);
  };

  const roundRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  };

  const drawCard = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = CARD_W;
    canvas.height = CARD_H;
    const cfg = templateConfig[template];

    if (side === "front") {
      // Background
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, CARD_W, CARD_H);

      // Header strip
      const grad = ctx.createLinearGradient(0, 0, CARD_W, 0);
      grad.addColorStop(0, cfg.primary);
      grad.addColorStop(1, cfg.secondary);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, CARD_W, 130);

      // Company name
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 42px Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(company || "Company Name", CARD_W / 2, 55);

      // ID label
      ctx.font = "20px Arial, sans-serif";
      ctx.fillStyle = "rgba(255,255,255,0.8)";
      ctx.fillText("IDENTITY CARD", CARD_W / 2, 90);

      // Accent line
      ctx.fillStyle = cfg.accent;
      ctx.fillRect(0, 130, CARD_W, 6);

      // Photo area
      const photoX = 50, photoY = 160, photoW = 230, photoH = 290;
      if (photo) {
        ctx.save();
        roundRect(ctx, photoX, photoY, photoW, photoH, 12);
        ctx.clip();
        const pAspect = photo.width / photo.height;
        const aAspect = photoW / photoH;
        let sx = 0, sy = 0, sw = photo.width, sh = photo.height;
        if (pAspect > aAspect) { sw = photo.height * aAspect; sx = (photo.width - sw) / 2; }
        else { sh = photo.width / aAspect; sy = (photo.height - sh) / 2; }
        ctx.drawImage(photo, sx, sy, sw, sh, photoX, photoY, photoW, photoH);
        ctx.restore();
      } else {
        ctx.fillStyle = "#E0E0E0";
        roundRect(ctx, photoX, photoY, photoW, photoH, 12);
        ctx.fill();
        ctx.fillStyle = "#999";
        ctx.font = "16px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Photo", photoX + photoW / 2, photoY + photoH / 2);
      }

      // Photo border
      ctx.strokeStyle = cfg.secondary;
      ctx.lineWidth = 3;
      roundRect(ctx, photoX, photoY, photoW, photoH, 12);
      ctx.stroke();

      // Info section
      const infoX = 320;
      const drawField = (label: string, value: string, y: number) => {
        ctx.fillStyle = "#888888";
        ctx.font = "16px Arial, sans-serif";
        ctx.textAlign = "left";
        ctx.fillText(label, infoX, y);
        ctx.fillStyle = "#222222";
        ctx.font = "bold 24px Arial, sans-serif";
        ctx.fillText(value || "---", infoX, y + 28);
      };

      drawField("NAME", name, 180);
      drawField("DESIGNATION", designation, 250);
      drawField("ID NUMBER", idNumber, 320);
      drawField("BLOOD GROUP", bloodGroup, 390);

      // Bottom strip
      const bottomGrad = ctx.createLinearGradient(0, CARD_H - 60, CARD_W, CARD_H);
      bottomGrad.addColorStop(0, cfg.primary);
      bottomGrad.addColorStop(1, cfg.secondary);
      ctx.fillStyle = bottomGrad;
      ctx.fillRect(0, CARD_H - 60, CARD_W, 60);

      // Bottom text
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.font = "16px Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(phone ? `Phone: ${phone}` : "", CARD_W / 2, CARD_H - 25);

    } else {
      // BACK SIDE
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, CARD_W, CARD_H);

      // Header
      const grad = ctx.createLinearGradient(0, 0, CARD_W, 0);
      grad.addColorStop(0, cfg.primary);
      grad.addColorStop(1, cfg.secondary);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, CARD_W, 80);

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 32px Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(company || "Company Name", CARD_W / 2, 50);

      // Terms
      ctx.fillStyle = "#333";
      ctx.font = "18px Arial, sans-serif";
      ctx.textAlign = "left";

      const terms = [
        "1. This card is the property of the organization.",
        "2. Must be worn at all times within premises.",
        "3. Report lost cards immediately.",
        "4. Non-transferable. Misuse will be penalized.",
      ];
      terms.forEach((t, i) => {
        ctx.fillText(t, 50, 140 + i * 40);
      });

      // Address
      if (address) {
        ctx.fillStyle = "#666";
        ctx.font = "16px Arial, sans-serif";
        ctx.textAlign = "center";
        const lines = address.split("\n");
        lines.forEach((line, i) => {
          ctx.fillText(line, CARD_W / 2, 340 + i * 24);
        });
      }

      // Emergency contact
      ctx.fillStyle = cfg.primary;
      ctx.font = "bold 18px Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("EMERGENCY CONTACT", CARD_W / 2, 440);
      ctx.fillStyle = "#333";
      ctx.font = "20px Arial, sans-serif";
      ctx.fillText(phone || "---", CARD_W / 2, 470);

      // Signature line
      ctx.strokeStyle = "#999";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(CARD_W - 300, CARD_H - 80);
      ctx.lineTo(CARD_W - 60, CARD_H - 80);
      ctx.stroke();
      ctx.fillStyle = "#999";
      ctx.font = "14px Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Authorized Signature", CARD_W - 180, CARD_H - 55);

      // Bottom bar
      const bottomGrad = ctx.createLinearGradient(0, CARD_H - 30, CARD_W, CARD_H);
      bottomGrad.addColorStop(0, cfg.primary);
      bottomGrad.addColorStop(1, cfg.secondary);
      ctx.fillStyle = bottomGrad;
      ctx.fillRect(0, CARD_H - 30, CARD_W, 30);
    }

    // Border
    ctx.strokeStyle = cfg.primary;
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, CARD_W - 4, CARD_H - 4);
  }, [name, designation, company, idNumber, bloodGroup, phone, address, photo, template, side, CARD_W, CARD_H]);

  useMemo(() => { drawCard(); }, [drawCard]);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `id-card-${side}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Form */}
      <div className="result-card">
        <h3 className="text-sm font-bold text-gray-800 mb-4">ID Card Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className="calc-input w-full" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Designation</label>
            <input type="text" value={designation} onChange={(e) => setDesignation(e.target.value)} placeholder="Software Engineer" className="calc-input w-full" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Company / School</label>
            <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Acme Corp" className="calc-input w-full" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">ID Number</label>
            <input type="text" value={idNumber} onChange={(e) => setIdNumber(e.target.value)} placeholder="EMP-001234" className="calc-input w-full" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Blood Group</label>
            <select value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} className="calc-input w-full">
              <option value="">Select</option>
              {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((bg) => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Phone</label>
            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" className="calc-input w-full" />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-gray-600 block mb-1">Address (for back side)</label>
            <textarea value={address} onChange={(e) => setAddress(e.target.value)} placeholder="123 Main St, City, State" className="calc-input w-full" rows={2} />
          </div>
        </div>
      </div>

      {/* Photo Upload */}
      <div
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition"
      >
        <div className="text-3xl mb-2">📷</div>
        <div className="text-sm font-semibold text-gray-700">{photo ? "Photo loaded! Click to change" : "Upload Photo"}</div>
        <input ref={inputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
      </div>

      {/* Template & Side */}
      <div className="result-card">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-2">Template</label>
            <div className="flex gap-2">
              {(Object.entries(templateConfig) as [Template, typeof templateConfig.corporate][]).map(([key, cfg]) => (
                <button key={key} onClick={() => setTemplate(key)} className={template === key ? "btn-primary" : "btn-secondary"}>
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
          ID card is generated at 300 DPI (3.375 x 2.125 inches) for professional printing quality.
        </p>
      </div>
    </div>
  );
}
