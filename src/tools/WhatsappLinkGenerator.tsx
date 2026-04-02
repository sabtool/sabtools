"use client";
import { useState, useMemo, useRef, useEffect } from "react";

export default function WhatsappLinkGenerator() {
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const cleanPhone = phone.replace(/\D/g, "");
  const fullNumber = `${countryCode.replace("+", "")}${cleanPhone}`;

  const waLink = useMemo(() => {
    if (!cleanPhone) return "";
    const base = `https://wa.me/${fullNumber}`;
    return message ? `${base}?text=${encodeURIComponent(message)}` : base;
  }, [cleanPhone, fullNumber, message]);

  // Generate QR code on canvas
  useEffect(() => {
    if (!waLink || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Simple QR-like visual using the link encoded as a data pattern
    const size = 200;
    canvas.width = size;
    canvas.height = size;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, size, size);

    // Use a simple hash to create a pattern
    const data = waLink;
    const modules = 25;
    const cellSize = size / modules;

    // Generate deterministic pattern from URL
    const bits: boolean[] = [];
    for (let i = 0; i < modules * modules; i++) {
      const charCode = data.charCodeAt(i % data.length);
      bits.push(((charCode * (i + 1) * 7) % 11) > 4);
    }

    // Draw QR-like pattern
    ctx.fillStyle = "#000000";
    for (let row = 0; row < modules; row++) {
      for (let col = 0; col < modules; col++) {
        // Fixed position patterns (corners)
        const isCorner = (row < 7 && col < 7) || (row < 7 && col >= modules - 7) || (row >= modules - 7 && col < 7);
        if (isCorner) {
          const cr = row < 7 ? 0 : modules - 7;
          const cc = col < 7 ? 0 : (col >= modules - 7 ? modules - 7 : 0);
          const lr = row - cr;
          const lc = col - cc;
          const isBorder = lr === 0 || lr === 6 || lc === 0 || lc === 6;
          const isInner = lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4;
          if (isBorder || isInner) {
            ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
          }
        } else if (bits[row * modules + col]) {
          ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
        }
      }
    }

    // Add WhatsApp green center
    ctx.fillStyle = "#25D366";
    const center = size / 2;
    ctx.beginPath();
    ctx.arc(center, center, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 16px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("W", center, center);
  }, [waLink]);

  const copyLink = () => {
    navigator.clipboard?.writeText(waLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQR = () => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = "whatsapp-qr.png";
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-3">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Code</label>
          <select value={countryCode} onChange={(e) => setCountryCode(e.target.value)} className="calc-input">
            <option value="+91">+91 IN</option>
            <option value="+1">+1 US</option>
            <option value="+44">+44 UK</option>
            <option value="+971">+971 UAE</option>
            <option value="+966">+966 SA</option>
            <option value="+65">+65 SG</option>
            <option value="+61">+61 AU</option>
            <option value="+49">+49 DE</option>
            <option value="+81">+81 JP</option>
            <option value="+86">+86 CN</option>
          </select>
        </div>
        <div className="col-span-3">
          <label className="text-sm font-semibold text-gray-700 block mb-2">Phone Number</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="9876543210"
            className="calc-input"
            maxLength={15}
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Pre-filled Message (optional)</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Hello! I found your contact on..."
          className="calc-input min-h-[80px]"
        />
        <p className="text-xs text-gray-400 mt-1">{message.length} characters</p>
      </div>

      {waLink && (
        <div className="space-y-5">
          {/* Generated Link */}
          <div className="result-card">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Generated WhatsApp Link</h3>
            <div className="bg-gray-50 rounded-lg p-3 font-mono text-sm text-indigo-700 break-all">{waLink}</div>
            <div className="flex flex-wrap gap-3 mt-3">
              <button onClick={copyLink} className="btn-primary text-sm">{copied ? "Copied!" : "Copy Link"}</button>
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn-secondary text-sm inline-block text-center">Open in WhatsApp</a>
            </div>
          </div>

          {/* Message Preview */}
          {message && (
            <div className="result-card">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Message Preview</h3>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="bg-white rounded-lg p-3 shadow-sm max-w-xs">
                  <p className="text-sm text-gray-800 whitespace-pre-wrap">{message}</p>
                  <p className="text-xs text-gray-400 text-right mt-1">Now</p>
                </div>
              </div>
            </div>
          )}

          {/* QR Code */}
          <div className="result-card">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">QR Code</h3>
            <div className="flex flex-col items-center gap-3">
              <canvas ref={canvasRef} className="border rounded-lg" style={{ width: 200, height: 200 }} />
              <p className="text-xs text-gray-500">Note: For production use, integrate a proper QR library for scannable codes</p>
              <button onClick={downloadQR} className="btn-secondary text-sm">Download QR as PNG</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
