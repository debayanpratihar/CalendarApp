import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import Communication from '@/app/models/Communication';

export async function GET() {
  await dbConnect();
  const communications = await Communication.find({}).populate('companyId').populate('methodId');
  return NextResponse.json(communications);
}

export async function POST(request: Request) {
  await dbConnect();
  const data = await request.json();
  const communication = new Communication(data);
  await communication.save();
  return NextResponse.json(communication);
}
