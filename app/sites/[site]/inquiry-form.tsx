"use client";

import { useState, useEffect } from "react";
import { Send } from "lucide-react";
import { useAuthStore } from "@/lib/store";
import { useDataStore } from "@/lib/data-store";

export default function InquiryForm({
  influencerId,
}: {
  influencerId: string;
}) {
  const { user } = useAuthStore();
  const { addInquiry } = useDataStore();
  
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
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

    // Simulate Network
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newInquiry = {
      id: `inq-${Date.now()}`,
      ownerId: influencerId,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      company: formData.company,
      message: formData.message,
      plan: formData.plan,
      status: 'pending' as const,
      createdAt: new Date(),
      // Add optional userId field logic if type supports it, otherwise keep minimal
    };

    addInquiry(newInquiry);
    setStatus("success");
    
    setFormData({
      name: user?.name || "", 
      email: user?.email || "",
      phone: "",
      company: "",
      message: "",
      plan: "pro",
    });
  };

  if (status === "success") {
    return (
      <div className="rounded-2xl bg-green-500/10 border border-green-500/20 p-8 text-center animate-in fade-in zoom-in duration-500">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-white">
          <Send className="h-8 w-8" />
        </div>
        <h3 className="text-2xl font-bold text-white">
          상담 신청이 완료되었습니다!
        </h3>
        <p className="mt-2 text-gray-400">
          깡대표팀에서 확인 후 빠르게 연락드리겠습니다.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm text-green-400 hover:text-green-300 underline"
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
          <label className="text-sm font-medium text-gray-400">성함</label>
          <input
            required
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
            placeholder="홍길동"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-400">연락처</label>
          <input
            required
            type="tel"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
            placeholder="010-0000-0000"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-400">이메일</label>
        <input
          required
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
          placeholder="email@example.com"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-400">
          업체명 (선택)
        </label>
        <input
          type="text"
          value={formData.company}
          onChange={(e) =>
            setFormData({ ...formData, company: e.target.value })
          }
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
          placeholder="마케팅 컴퍼니"
        />
      </div>

      <div className="space-y-4">
        <label className="text-sm font-medium text-gray-400">
          구매 희망 플랜
        </label>
        <div className="grid grid-cols-3 gap-4">
          {(["basic", "pro", "master"] as const).map((plan) => (
            <button
              key={plan}
              type="button"
              onClick={() => setFormData({ ...formData, plan })}
              className={`rounded-xl border py-4 text-center transition-all ${
                formData.plan === plan
                  ? "border-purple-500 bg-purple-500/20 text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                  : "border-white/10 bg-white/5 text-gray-400 hover:bg-white/10"
              }`}
            >
              <div className="text-sm font-bold uppercase">{plan}</div>
              <div className="text-xs mt-1">
                {plan === "basic"
                  ? "30만원"
                  : plan === "pro"
                  ? "50만원"
                  : "70만원"}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-400">문의내용</label>
        <textarea
          required
          rows={4}
          value={formData.message}
          onChange={(e) =>
            setFormData({ ...formData, message: e.target.value })
          }
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all resize-none"
          placeholder="요청사항이나 궁금하신 점을 자유롭게 적어주세요."
        />
      </div>

      <button
        disabled={status === "loading"}
        type="submit"
        className="w-full rounded-xl bg-purple-500 py-4 font-bold text-white transition-all hover:bg-purple-600 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_20px_rgba(139,92,246,0.4)]"
      >
        {status === "loading" ? (
          <div className="flex items-center justify-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            <span>처리 중...</span>
          </div>
        ) : user ? (
          "제작 의뢰하기"
        ) : (
          "제작 의뢰하기 (비로그인)"
        )}
      </button>

      <p className="text-center text-lg text-gray-500 mt-4">
        * 상담 신청 후 24시간 이내에 개별 연락 드립니다.
      </p>
    </form>
  );
}
