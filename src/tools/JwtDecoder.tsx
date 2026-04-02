"use client";
import { useState, useMemo } from "react";

export default function JwtDecoder() {
  const [token, setToken] = useState("");

  const result = useMemo(() => {
    if (!token.trim()) return null;
    const parts = token.trim().split(".");
    if (parts.length !== 3) return { error: "Invalid JWT format. A JWT must have 3 parts separated by dots." };

    try {
      const decodeBase64Url = (str: string) => {
        let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
        while (base64.length % 4) base64 += "=";
        return JSON.parse(atob(base64));
      };

      const header = decodeBase64Url(parts[0]);
      const payload = decodeBase64Url(parts[1]);

      let expiryInfo: string | null = null;
      if (payload.exp) {
        const expiryDate = new Date(payload.exp * 1000);
        const now = new Date();
        const isExpired = expiryDate < now;
        expiryInfo = `${expiryDate.toLocaleString("en-IN")} (${isExpired ? "EXPIRED" : "Valid"})`;
      }

      let issuedInfo: string | null = null;
      if (payload.iat) {
        issuedInfo = new Date(payload.iat * 1000).toLocaleString("en-IN");
      }

      return { header, payload, signature: parts[2], expiryInfo, issuedInfo, error: null };
    } catch {
      return { error: "Failed to decode JWT. The token appears to be malformed." };
    }
  }, [token]);

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 mb-2 block">Paste JWT Token</label>
        <textarea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="calc-input w-full h-28 font-mono text-sm"
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0..."
        />
      </div>

      {result?.error && (
        <div className="bg-red-50 text-red-700 rounded-xl p-4 text-sm font-medium">{result.error}</div>
      )}

      {result && !result.error && (
        <div className="result-card space-y-4">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 rounded bg-red-100 text-red-700 text-xs font-bold">HEADER</span>
              <span className="text-xs text-gray-500">Algorithm & Token Type</span>
            </div>
            <pre className="bg-red-50 rounded-xl p-4 text-sm font-mono text-red-800 overflow-x-auto">
              {JSON.stringify(result.header, null, 2)}
            </pre>
          </div>

          {/* Payload */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 rounded bg-purple-100 text-purple-700 text-xs font-bold">PAYLOAD</span>
              <span className="text-xs text-gray-500">Data & Claims</span>
            </div>
            <pre className="bg-purple-50 rounded-xl p-4 text-sm font-mono text-purple-800 overflow-x-auto">
              {JSON.stringify(result.payload, null, 2)}
            </pre>
          </div>

          {/* Signature */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 rounded bg-cyan-100 text-cyan-700 text-xs font-bold">SIGNATURE</span>
              <span className="text-xs text-gray-500">Verification (cannot verify without secret)</span>
            </div>
            <div className="bg-cyan-50 rounded-xl p-4 text-sm font-mono text-cyan-800 break-all">
              {result.signature}
            </div>
          </div>

          {/* Token Info */}
          {(result.expiryInfo || result.issuedInfo) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {result.issuedInfo && (
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="text-xs font-medium text-gray-500 mb-1">Issued At (iat)</div>
                  <div className="text-sm font-semibold text-gray-800">{result.issuedInfo}</div>
                </div>
              )}
              {result.expiryInfo && (
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="text-xs font-medium text-gray-500 mb-1">Expires (exp)</div>
                  <div className={`text-sm font-semibold ${result.expiryInfo.includes("EXPIRED") ? "text-red-600" : "text-green-600"}`}>
                    {result.expiryInfo}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
