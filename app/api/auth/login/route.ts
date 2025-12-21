import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { mockInfluencers, mockFans } from "@/lib/data";
import { verifyIdToken, adminFirestore } from "@/lib/firebaseAdmin";
import type { LoginRequest, LoginResponse, JWTPayload } from "@/lib/types";

const JWT_SECRET =
  process.env.JWT_SECRET || "faneasy-secret-key-change-in-production";

export async function POST(req: NextRequest) {
  try {
    const body: LoginRequest = await req.json();
    const { email, password, subdomain, idToken } = body;

    if (!idToken && (!email || !password)) {
      return NextResponse.json<LoginResponse>(
        { success: false, error: "이메일과 비밀번호를 입력해주세요." },
        { status: 400 }
      );
    }

    // If client provides an ID token (Firebase auth), verify it using admin SDK
    if (idToken && process.env.FIREBASE_PRIVATE_KEY) {
      try {
        const authServer = await import("@/lib/authServer");
        const result = await authServer.loginWithIdToken(idToken as string);
        return NextResponse.json<LoginResponse>({
          success: true,
          token: result.token,
          user: result.user,
        });
      } catch (err) {
        // fall through to mock logic if verification fails
        console.warn(
          "ID token verification failed, falling back to mock login"
        );
      }
    }

    // 1. 인플루언서 계정 확인
    const influencer = mockInfluencers.find((inf) => inf.email === email);
    if (influencer) {
      // 실제로는 bcrypt.compare를 사용해야 하지만, mock 데이터이므로 간단히 처리
      // const isValid = await bcrypt.compare(password, influencer.passwordHash);
      const isValid = password === "password123"; // Mock용

      if (isValid) {
        const payload: JWTPayload = {
          userId: influencer.id,
          email: influencer.email,
          role: "influencer",
          subdomain: influencer.subdomain,
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

        return NextResponse.json<LoginResponse>({
          success: true,
          token,
          user: {
            id: influencer.id,
            name: influencer.name,
            email: influencer.email,
            role: "influencer",
            subdomain: influencer.subdomain,
          },
        });
      }
    }

    // 2. 팬 계정 확인
    const fan = mockFans.find((f) => f.email === email);
    if (fan) {
      const isValid = password === "password123"; // Mock용

      if (isValid) {
        const payload: JWTPayload = {
          userId: fan.id,
          email: fan.email,
          role: "fan",
          slug: fan.slug,
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

        return NextResponse.json<LoginResponse>({
          success: true,
          token,
          user: {
            id: fan.id,
            name: fan.name,
            email: fan.email,
            role: "fan",
            slug: fan.slug,
          },
        });
      }
    }

    // 3. 인증 실패
    return NextResponse.json<LoginResponse>(
      { success: false, error: "이메일 또는 비밀번호가 올바르지 않습니다." },
      { status: 401 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json<LoginResponse>(
      { success: false, error: "로그인 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
