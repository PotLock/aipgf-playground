import { NextRequest, NextResponse } from 'next/server';
import { HexString, Types } from 'aptos';
import pako from 'pako';
import { executeTool } from '@/modules/ai/chain';

export const maxDuration = 300;
const transformCode = (source: string): string => {
  try {
    return pako.ungzip(new HexString(source).toUint8Array(), {
      to: 'string'
    });
  } catch (e: any) {
    return e;
  }
};
export async function GET(req: NextRequest) {
  const account = req.nextUrl.searchParams.get('account') || '';
  const functions = req.nextUrl.searchParams.get('functions') || '';
  const moduleName = req.nextUrl.searchParams.get('module') || '';
  const packageReq = req.nextUrl.searchParams.get('package') || '';

  const response = await fetch(
    `https://api.mainnet.aptoslabs.com/v1/accounts/${account}/resource/0x1::code::PackageRegistry`
  );
  const data = await response.json();

  let bytecode: any = '';

  for (const packageData of data.data.packages) {
    if (packageData.name == packageReq) {
      const findSource = packageData.modules.find((module: any) => module.name == moduleName);
      if (findSource) {
        bytecode = findSource;
      }
    }
  }
  const sourceCode = bytecode.source === '0x' ? undefined : transformCode(bytecode.source);
  try {
    if (sourceCode) {
      const result = await executeTool({ sourceCode, account, moduleName, functions });
      return NextResponse.json(JSON.parse(result), { status: 200 });
    } else {
      return NextResponse.json({ error: 'source is not complie' }, { status: 500 });
    }
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}
