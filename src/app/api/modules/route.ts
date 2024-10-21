import { NextRequest, NextResponse } from 'next/server';
export const maxDuration = 300;

export async function GET(req: NextRequest) {
  const account = req.nextUrl.searchParams.get('account') || '';

  try {
    const response = await fetch(
      `https://api.mainnet.aptoslabs.com/v1/accounts/${account}/resource/0x1::code::PackageRegistry`
    );
    const data = await response.json();
    const res = await data.data.packages.map((data: any) => {
      const modules = data.modules.map((data: any) => data.name);
      return { name: data.name, modules: modules };
    });
    return NextResponse.json(res, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}
