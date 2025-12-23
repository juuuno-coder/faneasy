"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { Lock, Mail, LogIn, UserPlus } from "lucide-react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { firebaseAuth, db } from "@/lib/firebaseClient";
import { getInfluencer, getFan } from "@/lib/data";
import { doc, setDoc } from "firebase/firestore";

export default function SiteLoginPage() {
  const router = useRouter();
  const params = useParams();
  const site = params?.site as string; // subdomain

  const login = useAuthStore((state) => state.login);
  const initAuthListener = useAuthStore((state) => state.initAuthListener);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [name, setName] = useState("");

  // Fetch influencer data for branding
  const influencer = getInfluencer(site);
  const themeColor = influencer?.pageSettings?.primaryColor || "#8B5CF6"; // Default purple

  useEffect(() => {
    initAuthListener();
  }, [initAuthListener]);

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

      // In a real app, successful Firebase login means they are authenticated globally.
      // But we might want to check if they have a profile on THIS site.
      // For now, we allow access but we should try to fetch their role specific to this site.
      
      // Ideally, we fetch user profile from Firestore: users/{uid}
      // If the user document says they are a fan of 'site', then good.
      
      const user = {
        id: fbUser.uid,
        name: fbUser.displayName || fbUser.email || "",
        email: fbUser.email || "",
        role: "user" as const, // Default to user for site login
        // In real implementation, check if they are the influencer owner
        ...(influencer?.email === fbUser.email ? { role: 'owner' as const, subdomain: site } : {})
      };
      
      // If user is the influencer logging into their own page
      if (influencer?.email === fbUser.email) {
          user.role = 'owner';
      }

      // Backdoor for Kkang Owner
      if (fbUser.email === 'kgw2642@gmail.com') {
         try {
           await setDoc(doc(db, 'users', fbUser.uid), {
             role: 'owner',
             subdomain: 'kkang',
             name: user.name
           }, { merge: true });
           
           user.role = 'owner';
           (user as any).subdomain = 'kkang';
         } catch (e) {
           console.error("Backdoor failed", e);
         }
      }

      login(user, token);

      // Redirect based on role or back to home
      if (user.role === "owner") {
         router.push("/admin");
      } else {
         // Redirect to the site home or fan dashboard
         router.push(`/`); 
      }

    } catch (err: any) {
      setError("로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.");
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

      // Create a user object that is associated with THIS site
      const userInfo = {
        id: cred.user.uid,
        name: cred.user.displayName || name || email,
        email: cred.user.email || "",
        role: "user" as const,
        joinedSite: site, // Mark them as joined from this site
      };

      // Firestore Save
      try {
        const isKkangOwner = email === 'kgw2642@gmail.com';
        await setDoc(doc(db, 'users', cred.user.uid), {
          uid: cred.user.uid,
          name: userInfo.name,
          email: userInfo.email,
          role: isKkangOwner ? 'owner' : 'user',
          subdomain: isKkangOwner ? 'kkang' : undefined,
          joinedSite: isKkangOwner ? undefined : site,
          createdAt: new Date(),
        }, { merge: true });

        if (isKkangOwner) {
            userInfo.role = 'owner';
            (userInfo as any).subdomain = 'kkang';
        }
      } catch (e) {
        console.error("Firestore save failed", e);
      }

      login(userInfo, token);
      
      if (userInfo.role === 'owner') {
          router.push('/admin');
      } else {
          router.push(`/`); 
      }
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
          setError("이미 가입된 이메일입니다.");
      } else {
          setError(err?.message || "회원가입 중 오류가 발생했습니다.");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!influencer) {
      return <div className="min-h-screen flex items-center justify-center text-white">Site not found</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden" 
         style={{ background: influencer.pageSettings?.theme === 'light' ? '#f3f4f6' : '#111827' }}>
      
      {/* Dynamic Background Effects based on themeColor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
             style={{ backgroundColor: themeColor }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
             style={{ backgroundColor: themeColor }} />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo / Branding */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: influencer.pageSettings?.theme === 'light' ? '#1f2937' : 'white' }}>
            {influencer.pageSettings?.title || influencer.name}
          </h1>
          <p style={{ color: influencer.pageSettings?.theme === 'light' ? '#4b5563' : '#9ca3af' }}>
             {showSignup ? `${influencer.name}님의 팬이 되어보세요!` : `${influencer.name}님 페이지 로그인`}
          </p>
        </div>

        {/* Login Card */}
        <div className={`backdrop-blur-xl border rounded-2xl p-8 shadow-2xl ${
            influencer.pageSettings?.theme === 'light' 
            ? 'bg-white/80 border-gray-200' 
            : 'bg-white/10 border-white/20'
        }`}>
          <form
            onSubmit={showSignup ? handleSignup : handleSubmit}
            className="space-y-6"
          >
            {/* Name (signup only) */}
            {showSignup && (
              <div>
                <label
                  htmlFor="name"
                  className={`block text-sm font-medium mb-2 ${influencer.pageSettings?.theme === 'light' ? 'text-gray-700' : 'text-gray-200'}`}
                >
                  이름 (닉네임)
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full pl-4 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      influencer.pageSettings?.theme === 'light' 
                      ? 'bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500' 
                      : 'bg-white/5 border border-white/10 text-white placeholder-gray-500'
                  }`}
                  style={{ '--tw-ring-color': themeColor } as any}
                  placeholder="홍길동"
                  required={showSignup}
                />
              </div>
            )}

            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className={`block text-sm font-medium mb-2 ${influencer.pageSettings?.theme === 'light' ? 'text-gray-700' : 'text-gray-200'}`}
              >
                이메일
              </label>
              <div className="relative">
                <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${influencer.pageSettings?.theme === 'light' ? 'text-gray-400' : 'text-gray-400'}`} />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-11 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      influencer.pageSettings?.theme === 'light' 
                      ? 'bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500' 
                      : 'bg-white/5 border border-white/10 text-white placeholder-gray-500'
                  }`}
                  style={{ '--tw-ring-color': themeColor } as any}
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className={`block text-sm font-medium mb-2 ${influencer.pageSettings?.theme === 'light' ? 'text-gray-700' : 'text-gray-200'}`}
              >
                비밀번호
              </label>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${influencer.pageSettings?.theme === 'light' ? 'text-gray-400' : 'text-gray-400'}`} />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-11 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      influencer.pageSettings?.theme === 'light' 
                      ? 'bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500' 
                      : 'bg-white/5 border border-white/10 text-white placeholder-gray-500'
                  }`}
                  style={{ '--tw-ring-color': themeColor } as any}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-500 text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
              style={{ backgroundColor: themeColor }}
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
                  {showSignup ? "가입하고 시작하기" : "로그인"}
                </>
              )}
            </button>

            {/* Toggle Login / Signup */}
            <div className="text-center text-sm mt-2">
              {showSignup ? (
                <p className={`${influencer.pageSettings?.theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                  이미 계정이 있으신가요?{" "}
                  <button
                    type="button"
                    onClick={() => setShowSignup(false)}
                    className="underline font-medium"
                    style={{ color: themeColor }}
                  >
                    로그인
                  </button>
                </p>
              ) : (
                <p className={`${influencer.pageSettings?.theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                  아직 회원이 아니신가요?{" "}
                  <button
                    type="button"
                    onClick={() => setShowSignup(true)}
                    className="underline font-medium"
                    style={{ color: themeColor }}
                  >
                    회원가입
                  </button>
                </p>
              )}
            </div>
          </form>
        </div>

        {/* Home Link */}
         <div className="text-center mt-6">
          <button
            onClick={() => router.push("/")}
            className={`transition-colors text-sm ${
                influencer.pageSettings?.theme === 'light' ? 'text-gray-500 hover:text-gray-800' : 'text-gray-400 hover:text-white'
            }`}
          >
            ← {influencer.name} 홈으로
          </button>
        </div>
      </div>
    </div>
  );
}
