"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { Lock, Mail, LogIn, UserPlus } from "lucide-react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { firebaseAuth } from "@/lib/firebaseClient";
import { mockInfluencers, mockFans } from "@/lib/data";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useAuthStore((state) => state.login);
  const initAuthListener = useAuthStore((state) => state.initAuthListener);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    initAuthListener();
    if (searchParams.get("mode") === "signup") {
      setShowSignup(true);
    }
  }, [initAuthListener, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const cred = await signInWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      );
      const fbUser = cred.user;
      const token = await fbUser.getIdToken();

      // Map role using mock data for now
      const influencer = mockInfluencers.find((i) => i.email === fbUser.email);
      const fan = mockFans.find((f) => f.email === fbUser.email);

      const user = influencer
        ? {
            id: fbUser.uid,
            name: influencer.name || fbUser.displayName || fbUser.email || "",
            email: fbUser.email || "",
            role: "influencer" as const,
            subdomain: influencer.subdomain,
          }
        : fan
        ? {
            id: fbUser.uid,
            name: fan.name || fbUser.displayName || fbUser.email || "",
            email: fbUser.email || "",
            role: "fan" as const,
            slug: fan.slug,
          }
        : {
            id: fbUser.uid,
            name: fbUser.displayName || fbUser.email || "",
            email: fbUser.email || "",
            role: "fan" as const,
          };

      login(user, token);

      if (user.role === "influencer") router.push("/admin/influencer");
      else router.push("/admin/fan");
    } catch (err: any) {
      setError(err?.message || "로그인 중 오류가 발생했습니다.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const cred = await createUserWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      );
      if (name) {
        await updateProfile(cred.user, { displayName: name });
      }

      const token = await cred.user.getIdToken();

      // default new users to 'fan' role until server-side profile exists
      const user = {
        id: cred.user.uid,
        name: cred.user.displayName || name || email,
        email: cred.user.email || "",
        role: "fan" as const,
      };

      login(user, token);
      router.push("/admin/fan");
    } catch (err: any) {
      setError(err?.message || "회원가입 중 오류가 발생했습니다.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-pink-900 flex items-center justify-center px-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            FanEasy<span className="text-purple-400">.</span>
          </h1>
          <p className="text-gray-400">로그인</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
          <form
            onSubmit={showSignup ? handleSignup : handleSubmit}
            className="space-y-6"
          >
            {/* Name (signup only) */}
            {showSignup && (
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-200 mb-2"
                >
                  이름
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-4 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="홍길동"
                  required={showSignup}
                />
              </div>
            )}

            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-200 mb-2"
              >
                이메일
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-200 mb-2"
              >
                비밀번호
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {showSignup ? (
                    <UserPlus className="h-5 w-5" />
                  ) : (
                    <LogIn className="h-5 w-5" />
                  )}
                  {showSignup ? "회원가입" : "로그인"}
                </>
              )}
            </button>

            {/* Toggle Login / Signup */}
            <div className="text-center text-sm mt-2">
              {showSignup ? (
                <p className="text-gray-300">
                  이미 계정이 있으신가요?{" "}
                  <button
                    type="button"
                    onClick={() => setShowSignup(false)}
                    className="text-purple-300 underline"
                  >
                    로그인
                  </button>
                </p>
              ) : (
                <p className="text-gray-300">
                  계정이 없으신가요?{" "}
                  <button
                    type="button"
                    onClick={() => setShowSignup(true)}
                    className="text-purple-300 underline"
                  >
                    회원가입
                  </button>
                </p>
              )}
            </div>
          </form>


        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <button
            onClick={() => router.push("/")}
            className="text-gray-400 hover:text-white transition-colors text-sm"
          >
            ← 홈으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}
