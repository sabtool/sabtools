import { NextRequest, NextResponse } from "next/server";

// Proxy for India Post area-name → post-office lookup.
// See /api/pincode/[code]/route.ts for the rationale (CSP + reliability).

export const runtime = "edge";
export const revalidate = 86400; // 24h

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ area: string }> }
) {
  const { area } = await params;
  const trimmed = decodeURIComponent(area || "").trim();

  if (trimmed.length < 3) {
    return NextResponse.json(
      { error: "Area name must be at least 3 characters." },
      { status: 400 }
    );
  }

  // Defensive cap — the India Post API doesn't accept absurdly long inputs
  // and we don't want to forward user-controlled strings unbounded.
  if (trimmed.length > 60) {
    return NextResponse.json(
      { error: "Area name too long. Please shorten the query." },
      { status: 400 }
    );
  }

  try {
    const upstream = await fetch(
      `https://api.postalpincode.in/postoffice/${encodeURIComponent(trimmed)}`,
      {
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
