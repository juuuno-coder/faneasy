import { NextResponse } from 'next/server';
import { sendEmailNotification } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const inquiry = await req.json();
    
    await sendEmailNotification(inquiry);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email API Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to send email' }, { status: 500 });
  }
}
