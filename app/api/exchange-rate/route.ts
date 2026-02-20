import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const base = req.nextUrl.searchParams.get("base") || "USD";
  const apiKey = process.env.EXCHANGE_RATE_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  }

  try {
    const res = await fetch(
      `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${base}`,
      { next: { revalidate: 300 } } // cache 5 min
    );

    if (!res.ok) {
      return NextResponse.json({ error: "Exchange rate API error" }, { status: 502 });
    }

    const data = await res.json();

    if (data.result !== "success") {
      return NextResponse.json({ error: "Exchange rate API returned an error" }, { status: 502 });
    }

    return NextResponse.json({
      result: data.result,
      base_code: data.base_code,
      conversion_rates: data.conversion_rates,
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch exchange rates" }, { status: 500 });
  }
}
