import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import Company from '@/app/models/Company';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const company = await Company.findById(params.id);
  if (!company) {
    return NextResponse.json({ error: 'Company not found' }, { status: 404 });
  }
  return NextResponse.json(company);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const data = await request.json();
  const company = await Company.findByIdAndUpdate(params.id, data, { new: true, runValidators: true });
  if (!company) {
    return NextResponse.json({ error: 'Company not found' }, { status: 404 });
  }
  return NextResponse.json(company);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const company = await Company.findByIdAndDelete(params.id);
  if (!company) {
    return NextResponse.json({ error: 'Company not found' }, { status: 404 });
  }
  return NextResponse.json({ message: 'Company deleted successfully' });
}

