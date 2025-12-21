"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { useDataStore } from "@/lib/data-store";
import {
  Monitor,
  ExternalLink,
  Settings,
  CreditCard,
  Globe,
  Layout,
  ArrowRight,
  User,
  ShoppingBag,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare
} from "lucide-react";
import Link from "next/link";
import type { Order, Inquiry } from "@/lib/types";

// Helper to map plan IDs to names
const PLAN_NAMES: Record<string, string> = {
  basic: 'BASIC Plan',
  pro: 'PRO Plan',
  master: 'MASTER Plan'
};

export default function MyPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { getOrdersByBuyerEmail, getInquiriesByOwner } = useDataStore(); // Use ownerId query actually, but we need email for orders
  
  // Note: getInquiriesByOwner expects ownerId (influencerId). 
  // But here we want inquiries *submitted by* this user. 
  // The current data store interface might need a tweak or we filter manually.
  // actually, useDataStore only has getInquiriesByOwner (influencer). 
  // Let's just fetch all global inquiries and filter manually for now since it's client side demo.
  // Wait, I can't access all inquiries from the hook directly comfortably if I didn't verify it.
  // I'll stick to displaying Orders which is the critical part for "Checkout" flow result.
  // I will check `data-store` export again mentally. storedInquiries is internal? NO, the hook returns `inquiries` array directly in state.
  
  const { orders: allOrders, inquiries: allInquiries } = useDataStore(); 

  const [loading, setLoading] = useState(true);
  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const [myInquiries, setMyInquiries] = useState<Inquiry[]>([]);

  useEffect(() => {
    // Simulate loading/auth check
    if (user) {
        // Filter orders by email
        const userOrders = allOrders.filter(o => o.buyerEmail === user.email);
        setMyOrders(userOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));

        // Filter inquiries by email (assuming inquiry has email field, which it does)
        const userInquiries = allInquiries.filter(i => i.email === user.email);
        setMyInquiries(userInquiries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    }
    setLoading(false);
  }, [user, allOrders, allInquiries]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-400">정보를 불러오는 중입니다...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex flex-col items-center justify-center text-white gap-4">
        <p className="text-gray-400">로그인이 필요한 서비스입니다.</p>
        <Link
          href="/login"
          className="px-6 py-3 bg-purple-600 rounded-xl hover:bg-purple-700 font-bold transition-colors"
        >
          로그인하러 가기
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white font-sans selection:bg-purple-500 selection:text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
          <Link
            href="/sites/kkang"
            className="text-xl font-bold tracking-tight hover:text-gray-300 transition-colors"
          >
            깡대표 x 디어스
          </Link>
          <div className="flex items-center gap-4">
            <Link 
                href="/sites/kkang/store"
                className="text-sm text-gray-400 hover:text-white transition-colors hidden sm:block"
            >
                서비스 더보기
            </Link>
            <div className="h-6 w-px bg-white/10 hidden sm:block"></div>
            <span className="text-sm text-white font-bold">{user.name}님</span>
            <div className="h-8 w-8 rounded-full bg-linear-to-br from-purple-500 to-blue-500 p-[1px]">
              <div className="h-full w-full rounded-full bg-black flex items-center justify-center">
                <User className="h-4 w-4 text-purple-400" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12">
        <div className="flex items-end justify-between mb-8">
            <div>
                <h1 className="text-3xl font-bold mb-2">마이페이지</h1>
                <p className="text-gray-400">
                신청하신 서비스와 주문 내역을 한눈에 확인하세요.
                </p>
            </div>
            <Link href="/sites/kkang/store" className="hidden md:flex items-center gap-2 text-purple-400 hover:text-purple-300 font-bold text-sm bg-purple-500/10 px-4 py-2 rounded-lg border border-purple-500/20 transition-all hover:bg-purple-500/20">
                <ShoppingBag className="h-4 w-4" />
                추가 서비스 신청
            </Link>
        </div>

        {/* Dashboard Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="text-sm text-gray-400 mb-2">총 주문</div>
                <div className="text-3xl font-bold">{myOrders.length}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="text-sm text-gray-400 mb-2">진행중</div>
                <div className="text-3xl font-bold text-purple-400">
                    {myOrders.filter(o => o.status === 'pending_payment' || o.status === 'paid').length}
                </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="text-sm text-gray-400 mb-2">완료된 서비스</div>
                <div className="text-3xl font-bold text-green-400">
                    {myOrders.filter(o => o.status === 'active').length}
                </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="text-sm text-gray-400 mb-2">문의 내역</div>
                <div className="text-3xl font-bold">{myInquiries.length}</div>
            </div>
        </div>

        {/* Order History */}
        <section className="mb-12">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
            <CreditCard className="h-5 w-5 text-purple-500" />
            주문 내역
          </h2>

          <div className="grid gap-4">
            {myOrders.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center text-gray-400">
                    아직 주문 내역이 없습니다.
                </div>
            ) : (
                myOrders.map((order) => (
                <div
                    key={order.id}
                    className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden hover:border-purple-500/30 transition-all p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                >
                    <div className="space-y-1">
                        <div className="flex items-center gap-3 mb-2">
                             <div className={`px-2 py-0.5 rounded text-xs font-bold border ${
                                order.status === 'pending_payment' ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/20' :
                                order.status === 'paid' ? 'bg-blue-500/20 text-blue-500 border-blue-500/20' :
                                'bg-green-500/20 text-green-500 border-green-500/20'
                             }`}>
                                {order.status === 'pending_payment' ? '입금 대기' :
                                 order.status === 'paid' ? '결제 완료' : '서비스 이용중'}
                             </div>
                             <span className="text-xs text-gray-500">
                                {new Date(order.createdAt).toLocaleDateString()}
                             </span>
                        </div>
                        <h3 className="text-xl font-bold">{PLAN_NAMES[order.productId] || order.productId}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                             <span>{order.amount.toLocaleString()}원</span>
                             {order.domainRequest && (
                                 <>
                                    <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                                    <span>요청 도메인: {order.domainRequest}</span>
                                 </>
                             )}
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        {order.status === 'pending_payment' && (
                            <div className="px-4 py-2 rounded-lg bg-yellow-500/10 text-yellow-500 text-sm font-medium border border-yellow-500/20 flex items-center gap-2">
                                <AlertCircle className="h-4 w-4" />
                                입금 확인중
                            </div>
                        )}
                        {order.status === 'active' && (
                            <div className="px-4 py-2 rounded-lg bg-green-500/10 text-green-500 text-sm font-medium border border-green-500/20 flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4" />
                                정상 운영중
                            </div>
                        )}
                    </div>
                </div>
                ))
            )}
          </div>
        </section>

        {/* Inquiry History */}
        <section>
          <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
            <MessageSquare className="h-5 w-5 text-gray-400" />
            문의 내역
          </h2>

          <div className="grid gap-4">
            {myInquiries.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center text-gray-400">
                    문의 내역이 없습니다.
                </div>
            ) : (
                myInquiries.map((inq, idx) => (
                    <div
                        key={idx} // using idx as basic unique key for now if id missing
                        className="rounded-xl border border-white/10 bg-white/5 p-6 flex flex-col md:flex-row justify-between gap-4"
                    >
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs font-bold text-gray-500 border border-white/10 px-2 py-0.5 rounded">상담문의</span>
                                <span className="text-xs text-gray-500">{new Date(inq.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p className="text-gray-300 line-clamp-2">{inq.message}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                                inq.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-gray-800 text-gray-400'
                            }`}>
                                {inq.status === 'completed' ? '답변 완료' : '답변 대기중'}
                            </span>
                        </div>
                    </div>
                ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
