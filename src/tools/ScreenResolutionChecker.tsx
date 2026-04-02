"use client";
import { useState, useEffect } from "react";

interface ScreenInfo {
  width: number;
  height: number;
  availWidth: number;
  availHeight: number;
  colorDepth: number;
  pixelRatio: number;
  orientation: string;
  innerWidth: number;
  innerHeight: number;
}

export default function ScreenResolutionChecker() {
  const [info, setInfo] = useState<ScreenInfo | null>(null);

  useEffect(() => {
    const detect = () => {
      setInfo({
        width: window.screen.width,
        height: window.screen.height,
        availWidth: window.screen.availWidth,
        availHeight: window.screen.availHeight,
        colorDepth: window.screen.colorDepth,
        pixelRatio: window.devicePixelRatio,
        orientation: window.screen.orientation?.type || "unknown",
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
      });
    };

    detect();
    window.addEventListener("resize", detect);
    return () => window.removeEventListener("resize", detect);
  }, []);

  if (!info) return <div className="text-center text-gray-500 py-8">Detecting screen info...</div>;

  const items = [
    { label: "Screen Width", value: `${info.width}px`, color: "text-indigo-600" },
    { label: "Screen Height", value: `${info.height}px`, color: "text-indigo-600" },
    { label: "Viewport Width", value: `${info.innerWidth}px`, color: "text-blue-600" },
    { label: "Viewport Height", value: `${info.innerHeight}px`, color: "text-blue-600" },
    { label: "Available Width", value: `${info.availWidth}px`, color: "text-green-600" },
    { label: "Available Height", value: `${info.availHeight}px`, color: "text-green-600" },
    { label: "Device Pixel Ratio", value: `${info.pixelRatio}x`, color: "text-orange-600" },
    { label: "Color Depth", value: `${info.colorDepth}-bit`, color: "text-purple-600" },
    { label: "Orientation", value: info.orientation.replace("-", " "), color: "text-gray-700" },
  ];

  const aspectGcd = (a: number, b: number): number => (b === 0 ? a : aspectGcd(b, a % b));
  const gcd = aspectGcd(info.width, info.height);
  const aspectRatio = `${info.width / gcd}:${info.height / gcd}`;

  return (
    <div className="space-y-6">
      {/* Main resolution display */}
      <div className="result-card text-center space-y-2">
        <div className="text-sm text-gray-500">Your Screen Resolution</div>
        <div className="text-4xl sm:text-5xl font-extrabold text-indigo-600">
          {info.width} x {info.height}
        </div>
        <div className="text-lg font-semibold text-gray-500">Aspect Ratio: {aspectRatio}</div>
      </div>

      {/* Detailed info grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {items.map((item) => (
          <div key={item.label} className="bg-white rounded-xl p-4 text-center shadow-sm border">
            <div className="text-xs font-medium text-gray-500 mb-1">{item.label}</div>
            <div className={`text-xl font-extrabold ${item.color}`}>{item.value}</div>
          </div>
        ))}
      </div>

      {/* Visual representation */}
      <div className="result-card">
        <div className="text-sm font-semibold text-gray-500 mb-3 text-center">Screen vs Viewport</div>
        <div className="flex justify-center items-end gap-6">
          <div className="text-center">
            <div
              className="border-2 border-indigo-400 bg-indigo-50 rounded-lg flex items-center justify-center mx-auto"
              style={{
                width: `${Math.min(120, info.width / 16)}px`,
                height: `${Math.min(80, info.height / 16)}px`,
              }}
            >
              <span className="text-xs text-indigo-600 font-bold">{info.width}x{info.height}</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">Screen</div>
          </div>
          <div className="text-center">
            <div
              className="border-2 border-blue-400 bg-blue-50 rounded-lg flex items-center justify-center mx-auto"
              style={{
                width: `${Math.min(100, info.innerWidth / 16)}px`,
                height: `${Math.min(70, info.innerHeight / 16)}px`,
              }}
            >
              <span className="text-xs text-blue-600 font-bold">{info.innerWidth}x{info.innerHeight}</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">Viewport</div>
          </div>
        </div>
      </div>
    </div>
  );
}
