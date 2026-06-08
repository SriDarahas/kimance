import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from") || "USD";

  try {
    const apiKey = process.env.EXCHANGE_RATE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    const res = await fetch(
      `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${from}`
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch rates" },
        { status: res.status }
      );
    }

    const data = await res.json();

    if (data.result !== "success") {
      return NextResponse.json(
        { error: "API error" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      result: data.result,
      conversion_rates: data.conversion_rates,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
