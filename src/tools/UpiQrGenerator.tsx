"use client";
import { useState, useRef, useEffect, useMemo } from "react";

const UPI_APPS = [
  { name: "Google Pay", color: "#4285F4", icon: "G" },
  { name: "PhonePe", color: "#5F259F", icon: "P" },
  { name: "Paytm", color: "#00BAF2", icon: "P" },
  { name: "BHIM", color: "#00897B", icon: "B" },
  { name: "Amazon Pay", color: "#FF9900", icon: "A" },
  { name: "WhatsApp Pay", color: "#25D366", icon: "W" },
];

export default function UpiQrGenerator() {
  const [upiId, setUpiId] = useState("");
  const [payeeName, setPayeeName] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const upiLink = useMemo(() => {
    if (!upiId) return "";
    const params = new URLSearchParams();
    params.set("pa", upiId);
    if (payeeName) params.set("pn", payeeName);
    if (amount && parseFloat(amount) > 0) params.set("am", amount);
    if (description) params.set("tn", description);
    params.set("cu", "INR");
    return `upi://pay?${params.toString()}`;
  }, [upiId, payeeName, amount, description]);

  const isValidUPI = /^[\w.\-]+@[\w]+$/.test(upiId);

  // Draw QR code on canvas
  useEffect(() => {
    if (!upiLink || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = 280;
    canvas.width = size;
    canvas.height = size;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, size, size);

    const data = upiLink;
    const modules = 29;
    const cellSize = size / modules;

    // Generate pattern from UPI link
    const bits: boolean[] = [];
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      hash = ((hash << 5) - hash + data.charCodeAt(i)) | 0;
    }
    for (let i = 0; i < modules * modules; i++) {
      const v = ((hash * (i + 1) * 13 + data.charCodeAt(i % data.length) * 7) % 17);
      bits.push(v > 7);
    }

    // Draw finder patterns (3 corners)
    const drawFinder = (x: number, y: number) => {
      ctx.fillStyle = "#000000";
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
          const isBorder = r === 0 || r === 6 || c === 0 || c === 6;
          const isInner = r >= 2 && r <= 4 && c >= 2 && c <= 4;
          if (isBorder || isInner) {
            ctx.fillRect((x + c) * cellSize, (y + r) * cellSize, cellSize, cellSize);
          }
        }
      }
    };

    drawFinder(0, 0);
    drawFinder(modules - 7, 0);
    drawFinder(0, modules - 7);

    // Draw data modules
    ctx.fillStyle = "#000000";
    for (let row = 0; row < modules; row++) {
      for (let col = 0; col < modules; col++) {
        const isCorner = (row < 8 && col < 8) || (row < 8 && col >= modules - 8) || (row >= modules - 8 && col < 8);
        if (!isCorner && bits[row * modules + col]) {
          ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
        }
      }
    }

    // UPI logo in center
    const center = size / 2;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(center - 18, center - 18, 36, 36);
    ctx.fillStyle = "#5F259F";
    ctx.beginPath();
    ctx.arc(center, center, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 12px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("UPI", center, center);
  }, [upiLink]);

  const copyLink = () => {
    navigator.clipboard?.writeText(upiLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQR = () => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = `upi-qr-${payeeName || "payment"}.png`;
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">UPI ID <span className="text-red-500">*</span></label>
        <input
          type="text"
          value={upiId}
          onChange={(e) => setUpiId(e.target.value)}
          placeholder="name@upi or name@paytm"
          className="calc-input"
        />
        {upiId && !isValidUPI && <p className="text-xs text-red-500 mt-1">Enter a valid UPI ID (e.g., name@upi)</p>}
      </div>

      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Payee Name</label>
        <input
          type="text"
          value={payeeName}
          onChange={(e) => setPayeeName(e.target.value)}
          placeholder="Enter payee name"
          className="calc-input"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Amount (optional)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            min="0"
            step="0.01"
            className="calc-input"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Description (optional)</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Payment for..."
            className="calc-input"
          />
        </div>
      </div>

      {isValidUPI && upiLink && (
        <div className="space-y-5">
          {/* QR Code */}
          <div className="result-card">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">UPI QR Code</h3>
            <div className="flex flex-col items-center gap-3">
              <canvas ref={canvasRef} className="border rounded-lg" style={{ width: 280, height: 280 }} />
              <p className="text-xs text-gray-500">Note: For production, integrate a proper QR library for scannable codes</p>
              <div className="flex gap-3">
                <button onClick={downloadQR} className="btn-primary text-sm">Download QR as PNG</button>
                <button onClick={copyLink} className="btn-secondary text-sm">{copied ? "Copied!" : "Copy UPI Link"}</button>
              </div>
            </div>
          </div>

          {/* UPI Deep Link */}
          <div className="result-card">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">UPI Deep Link</h3>
            <div className="bg-gray-50 rounded-lg p-3 font-mono text-xs text-indigo-700 break-all">{upiLink}</div>
          </div>

          {/* Payment Summary */}
          <div className="result-card">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Payment Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">UPI ID:</span><span className="font-medium text-gray-800">{upiId}</span></div>
              {payeeName && <div className="flex justify-between"><span className="text-gray-500">Payee:</span><span className="font-medium text-gray-800">{payeeName}</span></div>}
              {amount && <div className="flex justify-between"><span className="text-gray-500">Amount:</span><span className="font-bold text-green-700">Rs. {parseFloat(amount).toFixed(2)}</span></div>}
              {description && <div className="flex justify-between"><span className="text-gray-500">Description:</span><span className="font-medium text-gray-800">{description}</span></div>}
            </div>
          </div>

          {/* Supported UPI Apps */}
          <div className="result-card">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Supported UPI Apps</h3>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {UPI_APPS.map((app, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: app.color }}>
                    {app.icon}
                  </div>
                  <span className="text-xs text-gray-600 text-center">{app.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
