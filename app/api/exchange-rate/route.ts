import { NextResponse } from "next/server";

// DEMO ONLY: Illustrative values, not market rates.
// All values represent units of currency per 1 USD.
const demoUsdRates: Record<string, number> = {
  USD: 1,
  CAD: 1.38,
  EUR: 0.92,
  GBP: 0.79,

  // African currencies
  CDF: 2850,
  XAF: 605,
  XOF: 605,
  KES: 130,
  NGN: 1450,
  RWF: 1380,
  BIF: 2950,
  TZS: 2600,
  UGX: 3650,
  ZAR: 18.5,
  GHS: 15.5,
  ETB: 130,
  MAD: 9.8,
  EGP: 50,
  MZN: 64,
  AOA: 920,
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const from = (
    searchParams.get("from") || "USD"
  ).trim().toUpperCase();

  const apiKey =
    process.env.EXCHANGE_RATE_API_KEY?.trim();

  // DEMO MODE: No sponsor API key
  if (!apiKey) {
    const baseRate = demoUsdRates[from];

    if (baseRate === undefined) {
      return NextResponse.json(
        {
          result: "error",
          mode: "demo",
          error: "Unsupported demo currency",
        },
        { status: 400 }
      );
    }

    const conversion_rates = Object.fromEntries(
      Object.entries(demoUsdRates).map(
        ([currency, usdRate]) => [
          currency,
          usdRate / baseRate,
        ]
      )
    );

    return NextResponse.json({
      result: "success",
      mode: "demo",
      base_code: from,
      conversion_rates,
      notice:
        "Demonstration rates, not live market data",
    });
  }

  // LIVE MODE: Sponsor API key is configured
  try {
    const response = await fetch(
      `https://v6.exchangerate-api.com/v6/${encodeURIComponent(apiKey)}/latest/${encodeURIComponent(from)}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        {
          result: "error",
          mode: "live",
          error: "Exchange rate provider unavailable",
        },
        { status: 502 }
      );
    }

    const data = await response.json();

    if (
      data.result !== "success" ||
      !data.conversion_rates
    ) {
      return NextResponse.json(
        {
          result: "error",
          mode: "live",
          error: "Invalid exchange rate response",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      result: "success",
      mode: "live",
      base_code: from,
      conversion_rates: data.conversion_rates,
      last_update_utc: data.time_last_update_utc,
    });
  } catch (error) {
    console.error("Exchange rate API error:", error);

    return NextResponse.json(
      {
        result: "error",
        mode: "live",
        error: "Unable to connect to exchange rate provider",
      },
      { status: 502 }
    );
  }
}
