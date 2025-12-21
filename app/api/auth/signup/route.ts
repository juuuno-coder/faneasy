import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminFirestore } from "@/lib/firebaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, name, role = "fan", subdomain } = body;

    if (!process.env.FIREBASE_PRIVATE_KEY) {
      return NextResponse.json(
        {
          success: false,
          error:
            "서비스 계정이 설정되어 있지 않아 회원가입을 처리할 수 없습니다.",
        },
        { status: 503 }
      );
    }

    if (!email || !password || !name) {
      return NextResponse.json(
        { success: false, error: "이메일, 비밀번호, 이름이 필요합니다." },
        { status: 400 }
      );
    }

    // Delegate to authServer helper which centralizes admin behavior
    const { signupWithAdmin } = await import("@/lib/authServer");
    const result = await signupWithAdmin({
      email,
      password,
      name,
      role,
      subdomain,
    });

    return NextResponse.json({
      success: true,
      token: result.token,
      user: result.user,
    });
  } catch (err: any) {
    console.error("Signup error:", err?.message || err);
    return NextResponse.json(
      {
        success: false,
        error: err?.message || "회원가입 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
