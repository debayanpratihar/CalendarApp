import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import CommunicationMethod from '@/app/models/CommunicationMethod';

export async function GET() {
  await dbConnect();
  const methods = await CommunicationMethod.find({});
  return NextResponse.json(methods);
}

export async function POST(request: Request) {
  await dbConnect();
  const data = await request.json();
  const method = new CommunicationMethod(data);
  await method.save();
  return NextResponse.json(method);
}
