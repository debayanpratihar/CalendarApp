import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import CommunicationMethod from '@/app/models/CommunicationMethod';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const method = await CommunicationMethod.findById(params.id);
  if (!method) {
    return NextResponse.json({ error: 'Communication method not found' }, { status: 404 });
  }
  return NextResponse.json(method);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const data = await request.json();
  const method = await CommunicationMethod.findByIdAndUpdate(params.id, data, { new: true });
  if (!method) {
    return NextResponse.json({ error: 'Communication method not found' }, { status: 404 });
  }
  return NextResponse.json(method);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const method = await CommunicationMethod.findByIdAndDelete(params.id);
  if (!method) {
    return NextResponse.json({ error: 'Communication method not found' }, { status: 404 });
  }
  return NextResponse.json({ message: 'Communication method deleted successfully' });
}
