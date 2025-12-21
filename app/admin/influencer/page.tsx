"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { useDataStore } from "@/lib/data-store";
import { getFansByInfluencer } from "@/lib/data";
import type { Fan, Inquiry, Order } from "@/lib/types";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Settings,
  LogOut,
  Search,
  CheckCircle2,
  Clock,
  MoreHorizontal,
  CreditCard,
  ShoppingBag,
} from "lucide-react";
import dynamic from "next/dynamic";
const AdminProfile = dynamic(() => import("@/components/admin-profile"), {
  ssr: false,
});

export default function InfluencerDashboard() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { getInquiriesByOwner, getOrdersByOwner } = useDataStore();
  
  const [activeTab, setActiveTab] = useState<
    "overview" | "orders" | "fans" | "inquiries" | "settings"
  >("overview");
  const [fans, setFans] = useState<Fan[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Hydration safety for localStorage
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (!user || user.role !== "influencer") {
      router.push("/login");
      return;
    }

    // Load data
    const myFans = getFansByInfluencer(user.id);
    const myInquiries = getInquiriesByOwner(user.id);
    const myOrders = getOrdersByOwner(user.id);
    
    setFans(myFans);
    setInquiries(myInquiries);
    setOrders(myOrders);
  }, [user, router, mounted, getInquiriesByOwner, getOrdersByOwner]);

  if (!mounted || !user) return null;

  return (
    <div className="flex h-screen bg-white text-black admin-surface">
      {/* Sidebar */}
      <aside
        className="w-64 border-r border-gray-200 bg-white"
        aria-label="관리자 사이드바"
      >
        <div className="flex h-16 items-center border-b px-6">
          <span className="text-lg font-bold">관리자 대시보드</span>
        </div>
        <nav className="p-4 space-y-1">
          <button
            onClick={() => setActiveTab("overview")}
            aria-pressed={activeTab === "overview"}
            aria-current={activeTab === "overview" ? "page" : undefined}
            className={`flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-indigo-500 ${
              activeTab === "overview"
                ? "admin-accent-bg-soft admin-accent"
                : "text-gray-600 hover:bg-gray-50 hover:text-black"
            }`}
          >
            <LayoutDashboard className="h-5 w-5" />
            개요
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            aria-pressed={activeTab === "orders"}
            aria-current={activeTab === "orders" ? "page" : undefined}
            className={`flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-indigo-500 ${
              activeTab === "orders"
                ? "bg-gray-100 text-black"
                : "text-gray-600 hover:bg-gray-50 hover:text-black"
            }`}
          >
            <ShoppingBag className="h-5 w-5" />
            주문
            {orders.filter((o) => o.status === "pending_payment").length >
              0 && (
              <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                {orders.filter((o) => o.status === "pending_payment").length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("inquiries")}
            aria-pressed={activeTab === "inquiries"}
            aria-current={activeTab === "inquiries" ? "page" : undefined}
            className={`flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-indigo-500 ${
              activeTab === "inquiries"
                ? "bg-gray-100 text-black"
                : "text-gray-600 hover:bg-gray-50 hover:text-black"
            }`}
          >
            <MessageSquare className="h-5 w-5" />
            문의
          </button>
          <button
            onClick={() => setActiveTab("fans")}
            aria-pressed={activeTab === "fans"}
            aria-current={activeTab === "fans" ? "page" : undefined}
            className={`flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-indigo-500 ${
              activeTab === "fans"
                ? "bg-gray-100 text-black"
                : "text-gray-600 hover:bg-gray-50 hover:text-black"
            }`}
          >
            <Users className="h-5 w-5" />팬
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            aria-pressed={activeTab === "settings"}
            aria-current={activeTab === "settings" ? "page" : undefined}
            className={`flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-indigo-500 ${
              activeTab === "settings"
                ? "bg-gray-100 text-black"
                : "text-gray-600 hover:bg-gray-50 hover:text-black"
            }`}
          >
            <Settings className="h-5 w-5" />
            설정
          </button>
        </nav>
        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={() => {
              logout();
              router.push("/login");
            }}
            aria-label="로그아웃"
            className="flex w-full items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-indigo-500"
          >
            <LogOut className="h-5 w-5" />
            로그아웃
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-8" role="main">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              {activeTab === "overview" && "대시보드 개요"}
              {activeTab === "orders" && "주문 관리"}
              {activeTab === "inquiries" && "문의 및 리드"}
              {activeTab === "fans" && "팬 정보"}
              {activeTab === "settings" && "페이지 설정"}
            </h1>
            <p className="text-gray-600">환영합니다, {user.name}님!</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden md:block text-sm text-gray-500">
              {user.subdomain}.faneasy.kr
            </span>
            {/* Admin profile dropdown */}
            <div>
              <AdminProfile />
            </div>
          </div>
        </header>

        {activeTab === "overview" && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            <div
              className="rounded-xl admin-card p-6 shadow-sm"
              role="region"
              aria-labelledby="stat-fans"
            >
              <div className="flex items-center gap-4">
                <div
                  className="rounded-full bg-gray-100 p-3 text-gray-800"
                  aria-hidden="true"
                >
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <p
                    id="stat-fans"
                    className="text-sm font-medium text-gray-600"
                  >
                    팬 수
                  </p>
                  <h3 className="text-2xl font-bold">{fans.length}</h3>
                </div>
              </div>
            </div>
            <div
              className="rounded-xl admin-card p-6 shadow-sm"
              role="region"
              aria-labelledby="stat-inquiries"
            >
              <div className="flex items-center gap-4">
                <div
                  className="rounded-full bg-gray-100 p-3 text-gray-800"
                  aria-hidden="true"
                >
                  <MessageSquare className="h-6 w-6" />
                </div>
                <div>
                  <p
                    id="stat-inquiries"
                    className="text-sm font-medium text-gray-600"
                  >
                    문의
                  </p>
                  <h3 className="text-2xl font-bold">{inquiries.length}</h3>
                </div>
              </div>
            </div>
            <div
              className="rounded-xl admin-card p-6 shadow-sm"
              role="region"
              aria-labelledby="stat-orders"
            >
              <div className="flex items-center gap-4">
                <div
                  className="rounded-full bg-gray-100 p-3 text-gray-800"
                  aria-hidden="true"
                >
                  <ShoppingBag className="h-6 w-6" />
                </div>
                <div>
                  <p
                    id="stat-orders"
                    className="text-sm font-medium text-gray-600"
                  >
                    총 주문
                  </p>
                  <h3 className="text-2xl font-bold">{orders.length}</h3>
                </div>
              </div>
            </div>
            <div
              className="rounded-xl admin-card p-6 shadow-sm"
              role="region"
              aria-labelledby="stat-revenue"
            >
              <div className="flex items-center gap-4">
                <div
                  className="rounded-full bg-gray-100 p-3 text-gray-800"
                  aria-hidden="true"
                >
                  <CreditCard className="h-6 w-6" />
                </div>
                <div>
                  <p
                    id="stat-revenue"
                    className="text-sm font-medium text-gray-600"
                  >
                    수익
                  </p>
                  <h3 className="text-2xl font-bold">
                    ₩
                    {orders
                      .reduce((acc, cur) => acc + cur.amount, 0)
                      .toLocaleString()}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
            <div className="p-4 border-b flex items-center gap-4">
              <div className="relative flex-1">
                <Search
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                  aria-hidden="true"
                />
                <input
                  aria-label="주문 검색"
                  className="w-full rounded-lg border px-10 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-indigo-500"
                  placeholder="주문 검색 (이름, 전화, 도메인)..."
                />
              </div>
              <div className="flex gap-2">
                <select
                  aria-label="주문 상태 필터"
                  className="rounded-lg border px-3 py-2 text-sm"
                >
                  <option>전체 상태</option>
                  <option>결제 대기</option>
                  <option>결제 완료</option>
                  <option>활성</option>
                </select>
              </div>
            </div>
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 font-medium">
                    주문 ID
                  </th>
                  <th scope="col" className="px-6 py-3 font-medium">
                    고객
                  </th>
                  <th scope="col" className="px-6 py-3 font-medium">
                    상품 / 도메인
                  </th>
                  <th scope="col" className="px-6 py-3 font-medium">
                    금액
                  </th>
                  <th scope="col" className="px-6 py-3 font-medium">
                    상태
                  </th>
                  <th scope="col" className="px-6 py-3 font-medium">
                    날짜
                  </th>
                  <th scope="col" className="px-6 py-3 font-medium">
                    동작
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">
                      {order.id.toUpperCase()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {order.buyerName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {order.buyerPhone}
                      </div>
                      <div className="text-xs text-gray-400">
                        {order.businessName}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium admin-accent uppercase">
                        {order.productId} PLAN
                      </div>
                      <div className="text-xs text-gray-500">
                        {order.domainRequest || "도메인 요청 없음"}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {order.amount.toLocaleString()}원
                      <div className="text-xs font-normal text-gray-500">
                        무통장 입금
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {order.status === "pending_payment" && (
                        <span className="flex items-center gap-1.5 text-gray-700 bg-gray-100 px-2 py-1 rounded text-xs font-medium w-fit">
                          <Clock className="h-3 w-3" /> 결제 대기
                        </span>
                      )}
                      {order.status === "paid" && (
                        <span className="flex items-center gap-1.5 text-gray-700 bg-gray-100 px-2 py-1 rounded text-xs font-medium w-fit">
                          <CheckCircle2 className="h-3 w-3" /> 결제 완료
                        </span>
                      )}
                      {order.status === "active" && (
                        <span className="flex items-center gap-1.5 text-gray-700 bg-gray-100 px-2 py-1 rounded text-xs font-medium w-fit">
                          <CheckCircle2 className="h-3 w-3" /> 활성
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        aria-label={`주문 ${order.id} 더보기`}
                        className="p-1 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-indigo-500"
                      >
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Keeping existing Tabs */}
        {activeTab === "inquiries" && (
          <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
            <div className="p-12 text-center text-gray-500">
              문의 내역 목록 (여기서 확인 가능)
            </div>
          </div>
        )}

        {/* Other Tabs Placeholder */}
        {activeTab === "fans" && (
          <div className="rounded-xl border bg-white p-8 text-center text-gray-500 shadow-sm">
            팬 관리 기능이 이곳에 표시됩니다.
          </div>
        )}
        {activeTab === "settings" && (
          <div className="rounded-xl border bg-white p-8 text-center text-gray-500 shadow-sm">
            페이지 설정 기능이 이곳에 표시됩니다.
          </div>
        )}
      </main>
    </div>
  );
}
