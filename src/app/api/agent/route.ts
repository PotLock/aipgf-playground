import { MongoClient } from 'mongodb';
import { NextResponse, NextRequest } from 'next/server';

export const maxDuration = 300;

export async function GET(req: NextRequest) {
  try {
    const user_id = req.nextUrl.searchParams.get('userId') || req.nextUrl.searchParams.get('user_id') || '';
    let client = new MongoClient(process.env.MONGO_DB as string);
    let clientPromsie = await client.connect();
    let db = clientPromsie.db('prompt');
    let col = await db.collection('agent');

    const data = await col.find({ user_id: user_id }).toArray();

    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data: any = await req.json();
    console.log('data', data);
    let client = new MongoClient(process.env.MONGO_DB as string);
    let clientPromsie = await client.connect();
    let db = clientPromsie.db('prompt');
    let col = await db.collection('agent');
    const updata = await col.updateOne(data, { $set: { user_id: data.user_id } }, { upsert: true });

    return NextResponse.json(updata);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}
