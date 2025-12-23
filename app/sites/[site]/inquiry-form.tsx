'use client';

import { useState, useEffect } from "react";
import { Send } from "lucide-react";
import { useAuthStore } from "@/lib/store";
import { useDataStore } from "@/lib/data-store";
import { db } from "@/lib/firebaseClient";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useParams } from "next/navigation";

export default function InquiryForm({
  influencerId,
  variant = "default",
}: {
  influencerId: string;
  variant?: "default" | "bold" | "clean";
}) {
  const { user } = useAuthStore();
  const { addInquiry } = useDataStore();
  const params = useParams();
  const currentSite = params?.site as string;
  
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    desiredDomain: "",
    message: "",
    plan: "pro" as "basic" | "pro" | "master",
  });

  // Pre-fill user data if logged in
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const newInquiry = {
        ownerId: influencerId,
        siteDomain: currentSite || 'unknown', // Track origin site
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        desiredDomain: formData.desiredDomain,
        message: formData.message,
        plan: formData.plan,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      // 1. Save to Firebase Firestore
      await addDoc(collection(db, "inquiries"), {
        ...newInquiry,
        serverCreatedAt: serverTimestamp(),
      });

      // 2. Send email notification (Optional)
      try {
        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newInquiry),
        });
      } catch (emailError) {
        console.error('Email notification failed:', emailError);
      }

      // 3. Sync to local store for immediate UI updates
      addInquiry({
        ...newInquiry,
        id: `inq-${Date.now()}`,
        createdAt: new Date(),
        status: 'pending' as any,
        workflowStatus: 'received',
        notes: [],
        timeline: [{
          status: 'received',
          timestamp: new Date().toISOString(),
          note: '문의 폼 자동 접수'
        }]
      });

      setStatus("success");
      
      setFormData({
        name: user?.name || "", 
        email: user?.email || "",
        phone: "",
        company: "",
        desiredDomain: "",
        message: "",
        plan: "pro",
      });

    } catch (error) {
      console.error("Inquiry submission failed:", error);
      setStatus("error");
    }
  };

  const isBold = variant === "bold";
  const isClean = variant === "clean";
  
  // Theme classes
  const inputClass = isBold
    ? "w-full rounded-none border-2 border-white/20 bg-black/50 px-4 py-3 text-white focus:border-[#FFE400] focus:outline-none transition-all placeholder:text-gray-600 font-bold"
    : isClean
    ? "w-full rounded-2xl border border-gray-100 bg-gray-50/50 px-6 py-4 text-gray-900 focus:border-green-500 focus:bg-white focus:outline-none transition-all placeholder:text-gray-400 font-medium shadow-sm hover:border-gray-200"
    : "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all";
    
  const labelClass = isBold
    ? "text-sm font-bold text-[#FFE400] uppercase tracking-wider"
    : isClean
    ? "text-xs font-black text-gray-400 uppercase tracking-widest pl-2"
    : "text-sm font-medium text-gray-400";
    
  const buttonClass = isBold
    ? "w-full rounded-none bg-[#FFE400] py-4 font-black text-black transition-all hover:bg-yellow-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed border-2 border-[#FFE400]"
    : isClean
    ? "w-full rounded-2xl bg-gray-900 py-5 font-black text-white transition-all hover:bg-gray-800 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-gray-200"
    : "w-full rounded-xl bg-purple-500 py-4 font-bold text-white transition-all hover:bg-purple-600 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_20px_rgba(139,92,246,0.4)]";

  if (status === "success") {
    return (
      <div className={`p-12 text-center animate-in fade-in zoom-in duration-500 ${isBold ? "border-2 border-[#FFE400] bg-black/80" : isClean ? "rounded-3xl bg-white shadow-2xl shadow-gray-200 border border-gray-100" : "rounded-2xl bg-green-500/10 border border-green-500/20"}`}>
        <div className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full ${isBold ? "bg-[#FFE400] text-black" : isClean ? "bg-green-600 text-white" : "bg-green-500 text-white"}`}>
          <Send className="h-10 w-10" />
        </div>
        <h3 className={`text-2xl font-black mb-3 ${isBold ? "text-[#FFE400]" : isClean ? "text-gray-900" : "text-white"}`}>
          성공적으로 전달되었습니다!
        </h3>
        <p className={`${isClean ? "text-gray-500" : "text-gray-400"}`}>
          담당자가 확인 후 영업일 기준 24시간 이내에 <br/> 연락드리겠습니다. 감사합니다.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className={`mt-8 text-sm font-bold transition-all ${isBold ? "text-white hover:text-[#FFE400] underline" : isClean ? "text-green-600 hover:text-green-700" : "text-green-400 hover:text-green-300 underline"}`}
        >
          추가 문의하기
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className={labelClass}>성함</label>
          <input
            required
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={inputClass}
            placeholder="홍길동"
          />
        </div>
        <div className="space-y-2">
          <label className={labelClass}>연락처</label>
          <input
            required
            type="tel"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            className={inputClass}
            placeholder="010-0000-0000"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className={labelClass}>이메일</label>
        <input
          required
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className={inputClass}
          placeholder="email@example.com"
        />
      </div>

      <div className="space-y-2">
        <label className={labelClass}>
          업체명 (선택)
        </label>
        <input
          type="text"
          value={formData.company}
          onChange={(e) =>
            setFormData({ ...formData, company: e.target.value })
          }
          className={inputClass}
          placeholder="마케팅 컴퍼니"
        />
      </div>

      <div className="space-y-2">
        <label className={labelClass}>
          희망 도메인 (선택)
        </label>
        <input
          type="text"
          value={formData.desiredDomain}
          onChange={(e) =>
            setFormData({ ...formData, desiredDomain: e.target.value })
          }
          className={inputClass}
          placeholder="예: mybrand.com"
        />
      </div>

      <div className="space-y-4">
        <label className={labelClass}>
          구매 희망 플랜
        </label>
        <div className="grid grid-cols-3 gap-4">
          {(["basic", "pro", "master"] as const).map((plan) => (
            <button
              key={plan}
              type="button"
              onClick={() => setFormData({ ...formData, plan })}
              className={`py-4 text-center transition-all ${
                isBold
                    ? formData.plan === plan
                        ? "border-2 border-[#FFE400] bg-[#FFE400] text-black font-black"
                        : "border-2 border-white/20 bg-transparent text-gray-500 hover:border-[#FFE400] hover:text-[#FFE400]"
                    : formData.plan === plan
                        ? "rounded-xl border border-purple-500 bg-purple-500/20 text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                        : "rounded-xl border border-white/10 bg-white/5 text-gray-400 hover:bg-white/10"
              }`}
            >
              <div className="text-sm font-bold uppercase">{plan}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className={labelClass}>문의내용</label>
        <textarea
          required
          rows={6}
          value={formData.message}
          onChange={(e) =>
            setFormData({ ...formData, message: e.target.value })
          }
          className={inputClass}
          placeholder="[추가 요청사항]&#10;1. &#10;2. &#10;3. "
        />
      </div>

      <button
        disabled={status === "loading"}
        type="submit"
        className={buttonClass}
      >
        {status === "loading" ? (
          <div className="flex items-center justify-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
            <span>처리 중...</span>
          </div>
        ) : (
          "프로젝트 의뢰하기"
        )}
      </button>

      <p className="text-center text-sm text-gray-500 mt-4">
        * 상담 신청 후 24시간 이내에 개별 연락 드립니다.
      </p>
    </form>
  );
}
