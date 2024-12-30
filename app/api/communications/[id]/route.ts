import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import Communication from '@/app/models/Communication';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const communication = await Communication.findById(params.id).populate('companyId').populate('methodId');
  if (!communication) {
    return NextResponse.json({ error: 'Communication not found' }, { status: 404 });
  }
  return NextResponse.json(communication);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const data = await request.json();
  const communication = await Communication.findByIdAndUpdate(params.id, data, { new: true });
  if (!communication) {
    return NextResponse.json({ error: 'Communication not found' }, { status: 404 });
  }
  return NextResponse.json(communication);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const communication = await Communication.findByIdAndDelete(params.id);
  if (!communication) {
    return NextResponse.json({ error: 'Communication not found' }, { status: 404 });
  }
  return NextResponse.json({ message: 'Communication deleted successfully' });
}
