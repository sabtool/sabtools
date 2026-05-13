import { NextRequest, NextResponse } from "next/server";

// Proxy for India Post PIN-code lookup.
// Browser → /api/pincode/{code} (same-origin, passes CSP)
//        → server-side fetch to api.postalpincode.in (no CORS / CSP issues)
//        → response cached 24h at edge (PIN codes never change)
//
// Why a proxy: the global CSP on sabtools.in restricts connect-src to
// 'self' + analytics + adsense. Hitting api.postalpincode.in directly
// from the browser was being blocked silently by the browser. Routing
// through this server-side handler is the durable fix.

export const runtime = "edge";
export const revalidate = 86400; // 24h

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const clean = (code || "").replace(/\D/g, "");

  if (clean.length !== 6) {
    return NextResponse.json(
      { error: "Invalid PIN code. Must be exactly 6 digits." },
      { status: 400 }
    );
  }

  try {
    const upstream = await fetch(
      `https://api.postalpincode.in/pincode/${clean}`,
      {
        // Cache successful responses at the edge for 24h.
        next: { revalidate: 86400 },
        headers: { Accept: "application/json" },
      }
    );

    if (!upstream.ok) {
      return NextResponse.json(
        { error: "Upstream service unavailable. Please try again later." },
        { status: 502 }
      );
    }

    const data = await upstream.json();
    return NextResponse.json(data, {
      headers: {
        "Cache-Control":
          "public, s-maxage=86400, stale-while-revalidate=604800",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to reach PIN-code service. Please try again later." },
      { status: 503 }
    );
  }
}
