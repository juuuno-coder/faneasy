import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, brandName, address, concern, site, id } = body;

    // Determine recipient based on site slug
    const siteSlug = site?.toLowerCase() || '';
    let targetEmail = 'juuuno1116@gmail.com'; // Default admin

    if (siteSlug === 'kkang' || siteSlug === 'bizon' || siteSlug === 'bizonmarketing') {
      targetEmail = 'juuuno@naver.com';
    }

    // TODO: Replace with actual SMTP credentials via Environment Variables
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: targetEmail,
      subject: `[비즈온] 새로운 문의가 접수되었습니다 (${brandName})`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
          <h2 style="color: #ea580c; border-bottom: 2px solid #f97316; padding-bottom: 10px;">새로운 마케팅 진단/문의 요청</h2>
          <p><strong>DB 문서 ID:</strong> <span style="font-family: monospace; color: #666;">${id || 'N/A'}</span></p>
          <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>상호명:</strong> ${brandName}</p>
            <p style="margin: 5px 0;"><strong>담당자:</strong> ${name}</p>
            <p style="margin: 5px 0;"><strong>연락처:</strong> ${phone}</p>
            <p style="margin: 5px 0;"><strong>지역:</strong> ${address}</p>
          </div>
          <h3 style="color: #334155;">문의 내용</h3>
          <div style="background: #fff; border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; white-space: pre-wrap; color: #475569;">
            ${concern}
          </div>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
          <p style="font-size: 12px; color: #94a3b8; text-align: center;">어드민 대시보드에서 처리 상태를 업데이트할 수 있습니다.</p>
        </div>
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
