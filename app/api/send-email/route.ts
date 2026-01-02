import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Destructure correct fields from UnifiedInquiryForm
    const { 
      name, 
      email, 
      phone, 
      company, 
      desiredDomain, 
      message, 
      plan, 
      siteDomain = 'kkang.designd.co.kr',
      id
    } = body;

    // Target Email (Site Owner)
    // TODO: Dynamically fetch owner email based on siteDomain if needed.
    // For now, hardcode to the main admin.
    const targetEmails = ['kgw2642@gmail.com', 'designd@designd.co.kr', 'juuuno@naver.com']; 

    // SMTP Configuration
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Set this in Vercel env
        pass: process.env.EMAIL_APP_PASSWORD, // Set this in Vercel env (App Password)
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: targetEmails.join(', '),
      subject: `[문의접수] ${name}님 - ${plan?.toUpperCase()} 플랜 문의 (${siteDomain})`,
      html: `
        <div style="font-family: 'Apple SD Gothic Neo', sans-serif; max-width: 600px; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
          <div style="background-color: #000; padding: 20px; text-align: center;">
            <h2 style="color: #fff; margin: 0; font-size: 18px;">새로운 프로젝트 문의 도착</h2>
          </div>
          
          <div style="padding: 24px;">
            <div style="margin-bottom: 24px;">
              <p style="color: #64748b; font-size: 14px; margin-bottom: 8px;">문의 정보</p>
              <h1 style="color: #0f172a; font-size: 24px; margin: 0;">${plan?.toUpperCase() || '일반'} 플랜 신청</h1>
              <p style="color: #334155; margin-top: 4px;">접수일시: ${new Date().toLocaleString('ko-KR')}</p>
            </div>

            <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px; width: 80px;">지원자</td>
                  <td style="padding: 8px 0; color: #0f172a; font-weight: bold;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">연락처</td>
                  <td style="padding: 8px 0; color: #0f172a; font-weight: bold;">
                    <a href="tel:${phone}" style="color: #0f172a; text-decoration: none;">${phone}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">이메일</td>
                  <td style="padding: 8px 0; color: #0f172a; font-weight: bold;">
                    <a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a>
                  </td>
                </tr>
                ${company ? `
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">업체명</td>
                  <td style="padding: 8px 0; color: #0f172a;">${company}</td>
                </tr>` : ''}
                ${desiredDomain ? `
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">희망도메인</td>
                  <td style="padding: 8px 0; color: #0f172a;">${desiredDomain}</td>
                </tr>` : ''}
              </table>
            </div>

            <div style="margin-top: 24px;">
              <p style="color: #64748b; font-size: 14px; margin-bottom: 8px;">문의 상세 내용</p>
              <div style="background-color: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; color: #334155; line-height: 1.6; white-space: pre-wrap;">${message}</div>
            </div>

            <div style="margin-top: 32px; text-align: center;">
              <a href="https://${siteDomain}/admin" style="display: inline-block; background-color: #000; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; font-size: 14px;">관리자 페이지 바로가기</a>
            </div>
          </div>
        </div>
      `,
    };

    // Check environment variables
    if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
      console.warn('⚠️ EMAIL_USER or EMAIL_APP_PASSWORD is missing in environment variables. Email will NOT be sent.');
      return NextResponse.json({ 
        success: true, 
        message: 'Mock Success (ENV missing)', 
        warning: 'Configure EMAIL_USER and EMAIL_APP_PASSWORD to send real emails.' 
      });
    }

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true, message: 'Email sent successfully' });

  } catch (error) {
    console.error('Email send failed:', error);
    return NextResponse.json({ success: false, error: 'Failed to send email' }, { status: 500 });
  }
}
