import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { to, subject, html, replyTo } = await req.json();

    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;

    // If credentials are not set, Simulate sending (for dev)
    if (!user || !pass) {
      console.log('---------------------------------------------------');
      console.log('⚠️ No EMAIL_USER/PASS provided. Simulating email send.');
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`HTML: ${html.substring(0, 50)}...`);
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

    await transporter.sendMail({
      from: `"FanEasy Admin" <${user}>`,
      to,
      replyTo,
      subject,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email send error:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
