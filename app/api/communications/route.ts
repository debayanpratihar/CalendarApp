import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import Communication from '@/app/models/Communication';

export async function GET() {
  try {
    await dbConnect();
    const communications = await Communication.find({}).populate('companyId').populate('methodId');
    return NextResponse.json(communications);
  } catch (error) {
    console.error('Error fetching communications:', error);
    return NextResponse.json({ error: 'Failed to fetch communications' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const data = await request.json();
    const communication = new Communication(data);
    await communication.save();
    return NextResponse.json(communication);
  } catch (error) {
    console.error('Error creating communication:', error);
    return NextResponse.json({ error: 'Failed to create communication' }, { status: 500 });
  }
}
