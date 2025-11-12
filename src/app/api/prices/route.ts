import { NextResponse } from 'next/server';

export const runtime = 'edge';

// Cache for 30 seconds to avoid hitting rate limits
let priceCache: { data: any; timestamp: number } | null = null;
const CACHE_DURATION = 30000; // 30 seconds

export async function GET() {
  try {
    // Check if we have a valid cache
    if (priceCache && Date.now() - priceCache.timestamp < CACHE_DURATION) {
      return NextResponse.json(priceCache.data);
    }

    // Fetch fresh data from CoinGecko
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=eur,usd&include_24hr_change=true',
      {
        next: { revalidate: 30 },
      }
    );

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data = await response.json();

    // Update cache
    priceCache = {
      data,
      timestamp: Date.now(),
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch prices:', error);

    // Return fallback data if API fails
    return NextResponse.json(
      {
        ethereum: {
          eur: 3250.5,
          usd: 3500.0,
          usd_24h_change: 2.5,
        },
      },
      { status: 200 }
    );
  }
}
