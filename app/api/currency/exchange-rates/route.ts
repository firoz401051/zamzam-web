import { NextRequest, NextResponse } from "next/server";

// Using multiple APIs for better reliability
const API_ENDPOINTS = [
  "https://api.exchangerate-api.com/v4/latest/USD",
  "https://open.er-api.com/v6/latest/USD",
  "https://api.fxratesapi.com/latest?base=USD",
];

// Fallback rates in case all APIs fail
const fallbackRates = {
  USD: 1.0,
  EUR: 0.85,
  GBP: 0.73,
  CAD: 1.25,
  AUD: 1.35,
  JPY: 110.0,
  INR: 74.0,
  BDT: 85.0,
  PKR: 155.0,
  CNY: 6.45,
};

// Helper function to try multiple APIs
async function fetchExchangeRates(base = "USD") {
  for (const apiUrl of API_ENDPOINTS) {
    try {
      console.log(`Trying API: ${apiUrl}`);

      // Create timeout controller
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(apiUrl, {
        next: { revalidate: 3600 }, // Cache for 1 hour
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        console.log(`Successfully fetched from: ${apiUrl}`);
        return data;
      }
    } catch (error) {
      console.warn(`API ${apiUrl} failed:`, error);
      continue;
    }
  }
  throw new Error("All exchange rate APIs failed");
}

export async function GET(request: NextRequest) {
  try {
    console.log("Exchange rates API called");

    // Get the base currency from query params (default to USD)
    const { searchParams } = new URL(request.url);
    const base = searchParams.get("base") || "USD";
    const targetCurrencies = searchParams.get("currencies")?.split(",") || [
      "USD",
      "EUR",
      "GBP",
      "CAD",
      "AUD",
      "JPY",
      "INR",
      "BDT",
      "PKR",
      "CNY",
    ];

    console.log(
      `Fetching exchange rates for base: ${base}, targets: ${targetCurrencies.join(
        ","
      )}`
    );

    // Try to fetch live rates, fallback to static rates if failed
    let data;
    let source = "fallback";

    try {
      data = await fetchExchangeRates(base);
      source = "live";
    } catch (error) {
      console.error("Live API failed, using fallback rates:", error);
      data = { rates: fallbackRates };
    }

    // Filter rates to only include our supported currencies
    const filteredRates: Record<string, number> = {};

    for (const currency of targetCurrencies) {
      if (data.rates && data.rates[currency]) {
        filteredRates[currency] = data.rates[currency];
      } else {
        // Use fallback rate if not available in API
        filteredRates[currency] =
          fallbackRates[currency as keyof typeof fallbackRates] || 1.0;
      }
    }

    return NextResponse.json({
      success: true,
      base: data.base || base,
      date: data.date || new Date().toISOString().split("T")[0],
      rates: filteredRates,
      source,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in exchange rates API:", error);

    // Return fallback rates if everything fails
    return NextResponse.json({
      success: true,
      base: "USD",
      date: new Date().toISOString().split("T")[0],
      rates: fallbackRates,
      source: "fallback",
      lastUpdated: new Date().toISOString(),
      error: "Using fallback rates due to API error",
    });
  }
}

// POST endpoint to get rates for specific currencies
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { base = "USD", currencies = [] } = body;

    if (!currencies || currencies.length === 0) {
      return NextResponse.json(
        { error: "Please provide currencies array" },
        { status: 400 }
      );
    }

    // Fetch rates for specific currencies with fallback
    const data = await fetchExchangeRates(base);

    // Filter to requested currencies only
    const requestedRates: Record<string, number> = {};

    for (const currency of currencies) {
      if (data.rates[currency]) {
        requestedRates[currency] = data.rates[currency];
      } else {
        requestedRates[currency] =
          fallbackRates[currency as keyof typeof fallbackRates] || 1.0;
      }
    }

    return NextResponse.json({
      success: true,
      base: data.base,
      date: data.date,
      rates: requestedRates,
      source: "live",
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in POST exchange rates:", error);

    return NextResponse.json(
      { error: "Failed to fetch exchange rates" },
      { status: 500 }
    );
  }
}
