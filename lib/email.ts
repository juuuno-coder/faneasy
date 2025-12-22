import nodemailer from 'nodemailer';

export async function sendEmailNotification(inquiry: {
  name: string;
  email: string;
  phone: string;
  company?: string;
  message: string;
  plan?: string;
}) {
  // Create transporter using Gmail SMTP
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Your Gmail address
      pass: process.env.EMAIL_APP_PASSWORD, // Gmail App Password
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'juuuno1116@gmail.com',
    subject: `🚀 새로운 프로젝트 문의 - ${inquiry.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">새로운 프로젝트 문의</h1>
        </div>
        <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #1f2937; margin-top: 0;">문의자 정보</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">성함</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${inquiry.name}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">이메일</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #1f2937;"><a href="mailto:${inquiry.email}" style="color: #667eea;">${inquiry.email}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">연락처</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${inquiry.phone}</td>
            </tr>
            ${inquiry.company ? `
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">회사/단체</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${inquiry.company}</td>
            </tr>
            ` : ''}
            ${inquiry.plan ? `
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">희망 플랜</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #1f2937;"><span style="background-color: #ede9fe; color: #7c3aed; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: bold; text-transform: uppercase;">${inquiry.plan}</span></td>
            </tr>
            ` : ''}
          </table>
          
          <h2 style="color: #1f2937; margin-top: 30px; margin-bottom: 15px;">문의 내용</h2>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; color: #374151; line-height: 1.6; white-space: pre-wrap;">
${inquiry.message}
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
            <a href="https://kkang.designd.co.kr/admin/dashboard" style="display: inline-block; background-color: #667eea; color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: bold;">관리자 페이지에서 확인하기</a>
          </div>
        </div>
        <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px;">
          <p>이 메일은 FanEasy 플랫폼에서 자동으로 발송되었습니다.</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email notification sent successfully');
    return true;
  } catch (error) {
    console.error('Failed to send email notification:', error);
    return false;
  }
}
