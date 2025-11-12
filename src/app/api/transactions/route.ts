import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const address = searchParams.get('address');
    const chainId = searchParams.get('chainId');
    const limit = searchParams.get('limit') || '10';

    if (!address) {
      return NextResponse.json({ error: 'Address parameter is required' }, { status: 400 });
    }

    if (!chainId) {
      return NextResponse.json({ error: 'ChainId parameter is required' }, { status: 400 });
    }

    const chainIdNum = parseInt(chainId);
    let apiUrl: string;

    // Route to appropriate API based on chain
    if (chainIdNum === 1) {
      // Mainnet - use Etherscan V2
      const apiKey = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY;
      if (!apiKey) {
        return NextResponse.json({ error: 'Etherscan API key not configured' }, { status: 500 });
      }
      apiUrl = `https://api.etherscan.io/v2/api?chainid=${chainId}&module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=${limit}&sort=desc&apikey=${apiKey}`;
    } else if (chainIdNum === 11155111) {
      // Sepolia - use Blockscout (no API key required)
      apiUrl = `https://eth-sepolia.blockscout.com/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=${limit}&sort=desc`;
    } else {
      return NextResponse.json({ error: 'Unsupported chain ID' }, { status: 400 });
    }

    console.log('🔍 Fetching transactions from API:', apiUrl);

    const response = await fetch(apiUrl, {
      next: { revalidate: 0 }, // No caching for transactions
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    console.log('📊 API Response:', data);

    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ Failed to fetch transactions:', error);
    return NextResponse.json(
      {
        status: '0',
        message: 'Failed to fetch transactions',
        result: [],
      },
      { status: 500 }
    );
  }
}
