import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { to, subject, html, replyTo } = await req.json();

    // Try to find credentials from various common environment variable names
    const user = process.env.EMAIL_USER || process.env.GMAIL_USER || process.env.GMAIL_ID || process.env.NEXT_PUBLIC_EMAIL_USER;
    const pass = process.env.EMAIL_PASS || process.env.GMAIL_PASS || process.env.GMAIL_PASSWORD || process.env.GMAIL_APP_PASSWORD || process.env.NEXT_PUBLIC_EMAIL_PASS;

    // Debug logging
    console.log('📧 Attempting to send email...');
    console.log(`User Env Check: ${user ? '✅ Found' : '❌ Missing'} (${user?.substring(0, 3)}***)`);
    console.log(`Pass Env Check: ${pass ? '✅ Found' : '❌ Missing'}`);
    
    // If credentials are not set, Simulate sending (for dev)
    if (!user || !pass) {
      console.log('---------------------------------------------------');
      console.log('⚠️ No EMAIL_USER/PASS provided. Simulating email send.');
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log('---------------------------------------------------');
      return NextResponse.json({ success: true, message: 'Simulated email sent' });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user,
        pass,
      },
    });

    const info = await transporter.sendMail({
      from: `"FanEasy Admin" <${user}>`,
      to,
      replyTo,
      subject,
      html,
    });
    
    console.log('✅ Email sent successfully:', info.messageId);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('❌ Email send error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send email' },
      { status: 500 }
    );
  }
}
