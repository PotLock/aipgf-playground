import { NextRequest, NextResponse } from 'next/server';
export const maxDuration = 300;

export async function GET(req: NextRequest) {
  const account = req.nextUrl.searchParams.get('account') || '';

  try {
    const response = await fetch(`https://api.mainnet.aptoslabs.com/v1/accounts/${account}/modules?limit=1000`);
    const data = await response.json();
    const res = await data.map((data: any) => data.abi);
    return NextResponse.json(res, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}
