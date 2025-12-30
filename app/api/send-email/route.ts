import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, brandName, address, concern, userEmail } = body;

    // TODO: Replace with actual SMTP credentials via Environment Variables
    // For now, this is a structure ready to be connected.
    const transporter = nodemailer.createTransport({
      service: 'gmail',  // or your SMTP host
      auth: {
        user: process.env.EMAIL_USER, // e.g., 'your-email@gmail.com'
        pass: process.env.EMAIL_PASS, // App Password
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'juuuno1116@gmail.com', // Admin Email (Temporary default)
      subject: `[비즈온] 새로운 문의가 접수되었습니다 (${brandName})`,
      html: `
        <h2>새로운 마케팅 진단/문의 요청</h2>
        <p><strong>상호명:</strong> ${brandName}</p>
        <p><strong>담당자:</strong> ${name}</p>
        <p><strong>연락처:</strong> ${phone}</p>
        <p><strong>지역:</strong> ${address}</p>
        <hr />
        <h3>문의 내용</h3>
        <p style="white-space: pre-wrap;">${concern}</p>
        <hr />
        <p>관리자 페이지에서 처리 상태를 확인하세요.</p>
      `,
    };

    // Only attempt to send if credentials exist, otherwise mock success for dev
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      await transporter.sendMail(mailOptions);
      return NextResponse.json({ success: true, message: 'Email sent successfully' });
    } else {
      console.log('Skipping email send: No credentials provided in .env');
      return NextResponse.json({ success: true, message: 'Mock success: Add EMAIL_USER/PASS to env to enable.' });
    }

  } catch (error) {
    console.error('Email send failed:', error);
    return NextResponse.json({ success: false, error: 'Failed to send email' }, { status: 500 });
  }
}
