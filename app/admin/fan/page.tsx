"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { useDataStore } from "@/lib/data-store";
import { getFan } from "@/lib/data";
import { db } from "@/lib/firebaseClient";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import type { Fan, Inquiry } from "@/lib/types";
import {
  LayoutDashboard,
  MessageSquare,
  Settings,
  LogOut,
  PenTool,
  CheckCircle2,
  Globe,
  CreditCard,
  Users,
  Palette,
} from "lucide-react";
import dynamic from "next/dynamic";
const AdminProfile = dynamic(() => import("@/components/admin-profile"), {
  ssr: false,
});
const DesignEditor = dynamic(() => import("../influencer/design-editor"), { ssr: false });

export default function FanAdminDashboard() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { inquiries: allInquiries, getInquiriesByOwner } = useDataStore();
  const [activeTab, setActiveTab] = useState<
    "overview" | "inquiries" | "domain" | "billing" | "design"
  >("overview");
  const [fan, setFan] = useState<Fan | undefined>(undefined);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [myInquiries, setMyInquiries] = useState<Inquiry[]>([]);

  useEffect(() => {
    if (!user || user.role !== "fan") {
      router.push("/login");
      return;
    }
    const foundFan = getFan("inf-1", user.slug || "fan1");
    setFan(foundFan);

    // 1. Listen to real-time inquiries from Firestore
    if (user.id) {
      const q = query(
        collection(db, "inquiries"),
        where("ownerId", "==", user.id),
        orderBy("createdAt", "desc")
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const firestoreInquiries = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as any[];
        
        // Merge or replace local list
        // For the best "Real-time" effect, we prefer Firestor data
        if (firestoreInquiries.length > 0) {
          setMyInquiries(firestoreInquiries);
        } else {
          // Fallback to local mock data if Firestore is empty (optional)
          setMyInquiries(getInquiriesByOwner(user.id));
        }
      }, (error) => {
        console.error("Firestore listener error:", error);
        setMyInquiries(getInquiriesByOwner(user.id)); // Fallback on error
      });

      return () => unsubscribe();
    }
  }, [user, router, getInquiriesByOwner]);

  if (!user || !fan) return null;

  return (
    <div className="flex h-screen bg-white text-black font-sans admin-surface">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-black/50 backdrop-blur-xl flex flex-col">
        <div className="flex h-16 items-center border-b border-white/10 px-6 gap-3">
          <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-sm text-white shadow-lg shadow-indigo-500/20 shrink-0">
            A
          </div>
          <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
            전시관
          </span>
          <div className="ml-auto hidden md:block">
            {/* dynamic client component */}
            <AdminProfile />
          </div>
        </div>

        <div className="p-4">
          <div className="mb-6 px-4 py-3 rounded-xl admin-card">
            <div className="text-xs text-gray-400 mb-1">현재 플랜</div>
            <div className="text-lg font-bold text-white flex items-center justify-between">
              PRO 플랜
              <span className="text-[10px] bg-white/5 text-white px-1.5 py-0.5 rounded uppercase">
                Active
              </span>
            </div>
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === "overview"
                  ? "bg-white/10 text-white"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <LayoutDashboard className="h-5 w-5" />
              개요
            </button>
            <button
              onClick={() => setActiveTab("inquiries")}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === "inquiries"
                  ? "bg-white/10 text-white"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Users className="h-5 w-5" />
              리드·문의
              {myInquiries.length > 0 && (
                <span className="ml-auto bg-indigo-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                  {myInquiries.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("design")}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === "design"
                  ? "bg-white/10 text-white"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Palette className="h-5 w-5" />
              페이지 디자인
            </button>
            <button
              onClick={() => setActiveTab("domain")}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === "domain"
                  ? "bg-white/10 text-white"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Globe className="h-5 w-5" />
              도메인 설정
            </button>
            <button
              onClick={() => setActiveTab("billing")}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === "billing"
                  ? "bg-white/10 text-white"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <CreditCard className="h-5 w-5" />
              구독
            </button>
          </nav>
        </div>

        <div className="mt-auto p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-2 mb-4">
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-800">
              {fan.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold truncate">{fan.name}</div>
              <div className="text-xs text-gray-500 truncate">{fan.email}</div>
            </div>
          </div>
          <button
            onClick={() => {
              logout();
              router.push("/login");
            }}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
          >
            <LogOut className="h-4 w-4" />
            로그아웃
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-8">
        <header className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {activeTab === "overview" && "비즈니스 개요"}
              {activeTab === "inquiries" && "문의 관리"}
              {activeTab === "design" && "페이지 디자인 편집"}
              {activeTab === "domain" && "도메인 설정"}
              {activeTab === "billing" && "구독 및 결제"}
            </h1>
            <p className="text-gray-400">
              에이전시 비즈니스 설정 및 성과를 관리하세요.
            </p>
          </div>

          <div className="flex gap-3">
            <a
              href={`/sites/kkang/${fan.slug}`}
              target="_blank"
              className="px-4 py-2 rounded-lg border admin-accent-border text-admin-accent hover:bg-admin-accent-bg-soft text-sm font-bold transition-colors flex items-center gap-2"
            >
              <Globe className="h-4 w-4" />
              라이브 사이트 보기
            </a>
          </div>
        </header>

        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="rounded-2xl admin-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-400">
                    총 방문자 (월간)
                  </h3>
                  <div className="p-2 bg-white/5 rounded-lg text-white">
                    <Globe className="h-4 w-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-white">2,405</p>
                  <span className="text-sm text-gray-400 flex items-center">
                    ↑ 12.5%
                  </span>
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-400">
                    신규 리드
                  </h3>
                  <div className="p-2 bg-white/5 rounded-lg text-white">
                    <MessageSquare className="h-4 w-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-white">48</p>
                  <span className="text-sm text-gray-400 flex items-center">
                    ↑ 5명
                  </span>
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-400">
                    전환율
                  </h3>
                  <div className="p-2 bg-white/5 rounded-lg text-white">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-white">2.4%</p>
                  <span className="text-sm text-gray-500">안정적</span>
                </div>
              </div>
            </div>

            {/* Recent Inquiries Preview */}
            <div className="rounded-2xl admin-card overflow-hidden">
              <div className="p-6 border-b border-white/10 flex justify-between items-center">
                <h3 className="font-bold">최근 문의</h3>
                <button
                  onClick={() => setActiveTab("inquiries")}
                  className="text-sm admin-accent hover:text-admin-accent"
                >
                  전체 보기
                </button>
              </div>
              <div className="divide-y divide-white/5">
                {myInquiries.length > 0 ? (
                  myInquiries.slice(0, 5).map((inquiry) => (
                    <div
                      key={inquiry.id}
                      onClick={() => setSelectedInquiry(inquiry)}
                      className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-sm text-white">
                          {inquiry.name[0]}
                        </div>
                        <div>
                          <p className="font-bold text-sm group-hover:text-indigo-400 transition-colors">{inquiry.name}</p>
                          <p className="text-xs text-gray-400">
                            {inquiry.plan?.toUpperCase()} 플랜 문의 • {new Date(inquiry.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span className="px-2 py-1 bg-indigo-500/10 text-indigo-400 text-[10px] font-bold rounded border border-indigo-500/20 uppercase">
                        신규
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center text-gray-500 text-sm">
                    최근 문의가 없습니다.
                  </div>
                )}
              </div>
            </div>

            {/* Inquiry Detail Modal Overlay */}
            {selectedInquiry && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                  <div className="p-8 border-b border-gray-100 flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">문의 상세 내용</h3>
                      <p className="text-sm text-gray-500">{new Date(selectedInquiry.createdAt).toLocaleString()}</p>
                    </div>
                    <button 
                      onClick={() => setSelectedInquiry(null)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <LogOut className="h-5 w-5 text-gray-400 rotate-180" />
                    </button>
                  </div>
                  <div className="p-8 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">신청인</p>
                        <p className="text-gray-900 font-medium">{selectedInquiry.name}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">연락처</p>
                        <p className="text-gray-900 font-medium">{selectedInquiry.phone}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">이메일</p>
                        <p className="text-gray-900 font-medium">{selectedInquiry.email}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">회사/단체</p>
                        <p className="text-gray-900 font-medium">{selectedInquiry.company || '정보 없음'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">선택 플랜</p>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700 uppercase">
                          {selectedInquiry.plan}
                        </span>
                      </div>
                    </div>
                    <div className="pt-6 border-t border-gray-100">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">문의 내용</p>
                      <div className="bg-gray-50 rounded-2xl p-4 text-gray-700 leading-relaxed whitespace-pre-wrap min-h-[100px]">
                        {selectedInquiry.message}
                      </div>
                    </div>
                  </div>
                  <div className="p-6 bg-gray-50 flex gap-3">
                    <button 
                      onClick={() => setSelectedInquiry(null)}
                      className="flex-1 py-3 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-bold transition-colors"
                    >
                      닫기
                    </button>
                    <a 
                      href={`mailto:${selectedInquiry.email}`}
                      className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-center transition-colors"
                    >
                      답장하기
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "inquiries" && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/5 text-gray-400 uppercase text-[10px] tracking-wider font-bold">
                  <tr>
                    <th className="px-6 py-4">신청인 / 정보</th>
                    <th className="px-6 py-4">플랜</th>
                    <th className="px-6 py-4">문의 요약</th>
                    <th className="px-6 py-4">날짜</th>
                    <th className="px-6 py-4">동작</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {myInquiries.length > 0 ? (
                    myInquiries.map((inquiry) => (
                      <tr key={inquiry.id} className="hover:bg-white/5 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="font-bold text-white">{inquiry.name}</div>
                          <div className="text-xs text-gray-500">{inquiry.email}</div>
                          <div className="text-xs text-gray-500">{inquiry.phone}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase">
                            {inquiry.plan}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-gray-300 truncate max-w-xs">{inquiry.message}</div>
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {new Date(inquiry.createdAt).toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <button 
                            onClick={() => setSelectedInquiry(inquiry)}
                            className="text-xs font-bold text-indigo-400 hover:text-indigo-300 underline"
                          >
                            상세보기
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                        문의 내역이 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "design" && (
          <div className="text-black text-left">
             <DesignEditor subdomain={fan.slug} />
          </div>
        )}

        {activeTab === "domain" && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 max-w-2xl">
            <h3 className="text-lg font-bold mb-6">커스텀 도메인 연결</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  현재 도메인
                </label>
                <div className="flex gap-2">
                  <input
                    disabled
                    value={`${fan.slug}.faneasy.kr`}
                    className="bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-gray-400 flex-1"
                  />
                  <button className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-sm font-bold">
                    복사
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <h4 className="font-bold text-gray-900 mb-2">
                  보유 도메인 연결하기
                </h4>
                <p className="text-sm text-gray-400 mb-4">
                  보유하고 계신 도메인(예: myagency.com)을 입력하여 사이트와 연결하세요.
                </p>
                <div className="flex gap-2">
                  <input
                    placeholder="example.com"
                    className="bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white flex-1 focus:outline-none focus:border-white/20"
                  />
                  <button className="px-4 py-2 admin-accent-bg text-white rounded-lg hover:brightness-90 transition-colors text-sm font-bold">
                    연결
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "billing" && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 max-w-2xl">
            <h3 className="text-lg font-bold mb-6">구독 및 결제 관리</h3>
            <div className="flex items-center justify-between p-4 rounded-xl admin-card mb-6">
              <div>
                <div className="text-sm text-gray-400">현재 플랜</div>
                <div className="text-2xl font-bold text-white">
                  PRO 에이전시 플랜
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-400">다음 결제일</div>
                <div className="text-xl font-bold">2025년 1월 21일</div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-4 border-b border-white/5">
                <div>
                  <div className="font-bold">결제 수단</div>
                  <div className="text-sm text-gray-400">
                    카카오뱅크 **** 1234
                  </div>
                </div>
                <button className="text-sm text-gray-400 font-bold hover:text-white hover:underline">
                  업데이트
                </button>
              </div>
              <div className="flex justify-between items-center py-4 border-b border-white/5">
                <div>
                  <div className="font-bold">결제 내역</div>
                  <div className="text-sm text-gray-400">
                    지난 결제 영수증 확인
                  </div>
                </div>
                <button className="text-sm text-gray-400 font-bold hover:text-white hover:underline">
                  보기
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
