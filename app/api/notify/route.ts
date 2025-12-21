import { NextResponse } from 'next/server';
import { sendAdminNotification } from '@/lib/notifications';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, data } = body;

    let message = '';
    if (type === 'inquiry') {
      message = `*새로운 프로젝트 문의가 접수되었습니다!*\n\n*성함:* ${data.name}\n*연락처:* ${data.phone}\n*이메일:* ${data.email}\n*희망플랜:* ${data.plan}\n*문의내용:* ${data.message}`;
    } else {
      message = `새로운 이벤트 발생: ${type}`;
    }

    await sendAdminNotification(message, data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API Notification Error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
