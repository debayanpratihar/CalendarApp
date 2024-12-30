import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import Company from '@/app/models/Company';

export async function GET() {
  await dbConnect();
  try {
    const companies = await Company.find({});
    return NextResponse.json(companies);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch companies' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  await dbConnect();
  try {
    const data = await request.json();
    const company = new Company(data);
    await company.save();
    return NextResponse.json(company);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create company' }, { status: 500 });
  }
}
