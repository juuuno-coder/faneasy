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
  MessageSquare,
  ChevronRight,
  LogOut,
  Files,
  Zap,
  Edit,
  X,
  CheckCircle2
} from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { Order, Inquiry } from "@/lib/types";
import ProfileModal from "@/components/profile-modal";
import { db, firebaseAuth } from "@/lib/firebaseClient";
import { doc, setDoc, collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { updateProfile } from "firebase/auth";

// Helper to map plan IDs to names
const PLAN_NAMES: Record<string, string> = {
  basic: 'BASIC Plan',
  pro: 'PRO Plan',
  master: 'MASTER Plan'
};

export default function SiteMyPageContent() {
  const router = useRouter();
  const { user, logout, updateUser } = useAuthStore();
  const { orders: allLocalOrders, inquiries: allLocalInquiries, updateOrder } = useDataStore(); 
  
  const [loading, setLoading] = useState(true);
  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const [myInquiries, setMyInquiries] = useState<Inquiry[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'inquiries'>('overview');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  
  // Order Editing State
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [isEditOrderModalOpen, setIsEditOrderModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ domainRequest: '', buyerPhone: '' });

  useEffect(() => {
    async function fetchData() {
        if (!user || !user.email) {
            setLoading(false);
            return;
        }

        try {
            // 1. Fetch Orders (Firestore)
            const ordersQuery = query(
                collection(db, 'orders'),
                where('buyerEmail', '==', user.email)
            );
            
            // 2. Fetch Inquiries (Firestore)
            const inquiriesQuery = query(
                collection(db, 'inquiries'),
                where('email', '==', user.email)
            );

            const [ordersSnapshot, inquiriesSnapshot] = await Promise.all([
                getDocs(ordersQuery).catch(err => {
                    console.warn("Failed to fetch orders from DB:", err);
                    return { docs: [] };
                }),
                getDocs(inquiriesQuery).catch(err => {
                    console.warn("Failed to fetch inquiries from DB:", err);
                    return { docs: [] };
                })
            ]);

            const dbOrders = (ordersSnapshot.docs?.map(doc => ({ id: doc.id, ...doc.data() })) || []) as Order[];
            const dbInquiries = (inquiriesSnapshot.docs?.map(doc => ({ id: doc.id, ...doc.data() })) || []) as Inquiry[];

            // 3. Merge with Local Store (Deduplicate by createdAt)
            // Filter local items for current user
            const localOrders = allLocalOrders.filter(o => o.buyerEmail === user.email);
            const localInquiries = allLocalInquiries.filter(i => i.email === user.email);

            // Merge Orders
            const mergedOrders = [...dbOrders];
            localOrders.forEach(local => {
                // If no DB record exists with the same createdAt, add the local one
                if (!mergedOrders.some(dbOrder => dbOrder.createdAt === local.createdAt)) {
                    mergedOrders.push(local);
                }
            });
            // Re-sort
            mergedOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

            // Merge Inquiries
            const mergedInquiries = [...dbInquiries];
            localInquiries.forEach(local => {
                if (!mergedInquiries.some(dbInq => dbInq.createdAt === local.createdAt)) {
                    mergedInquiries.push(local);
                }
            });
            mergedInquiries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

            setMyOrders(mergedOrders);
            setMyInquiries(mergedInquiries);

        } catch (error) {
            console.error("Error fetching user data:", error);
            // Fallback to local data only if DB fails completely
            const localOrders = allLocalOrders.filter(o => o.buyerEmail === user.email);
            const localInquiries = allLocalInquiries.filter(i => i.email === user.email);
            setMyOrders(localOrders);
            setMyInquiries(localInquiries);
            
            toast.error("일부 데이터를 불러오는 중 문제가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    }

    fetchData();
  }, [user, allLocalOrders, allLocalInquiries]);

  // Sync edit form when editingOrder changes
  useEffect(() => {
    if (editingOrder) {
        setEditForm({
            domainRequest: editingOrder.domainRequest || '',
            buyerPhone: editingOrder.buyerPhone || ''
        });
    }
  }, [editingOrder]);

  const handleUpdateOrder = async () => {
    if (!editingOrder) return;
    
    try {
        // Update Firestore
        await setDoc(doc(db, 'orders', editingOrder.id), {
            domainRequest: editForm.domainRequest,
            buyerPhone: editForm.buyerPhone,
            updatedAt: new Date().toISOString()
        }, { merge: true });

        // Optimistic UI update
        setMyOrders(prev => prev.map(o => o.id === editingOrder.id ? { 
            ...o, 
            domainRequest: editForm.domainRequest,
            buyerPhone: editForm.buyerPhone 
        } : o));

        toast.success('주문 정보가 수정되었습니다.');
        setIsEditOrderModalOpen(false);
        setEditingOrder(null);
    } catch (error) {
        console.error("Failed to update order:", error);
        toast.error("주문 수정 실패");
    }
  };

  const handleSaveProfile = async (data: { name: string; email: string }) => {
    if (!user) return;
    
    // 1. Check for Active Firebase Session
    if (!firebaseAuth.currentUser) {
         console.error("No active firebase session found.");
         throw new Error("보안 세션이 만료되었습니다. 새로고침 하거나 다시 로그인 해주세요.");
    }

    try {
        // 2. Update Firestore (Source of Truth)
        // Use setDoc with merge: true to CREATE the doc if it doesn't exist (fixing the "No document to update" error)
        const userRef = doc(db, 'users', user.id);
        await setDoc(userRef, {
            name: data.name,
            updatedAt: new Date().toISOString()
        }, { merge: true });
        
        // 3. Update Client Store (Optimistic UI)
        updateUser({ name: data.name });

        // 4. Update Firebase Auth Profile (For Console & Globals)
        await updateProfile(firebaseAuth.currentUser, { displayName: data.name });

    } catch (error: any) {
        console.error("Profile update failed:", error);
        if (error.code === 'permission-denied') {
            throw new Error("변경 권한이 없습니다. 다시 로그인 해주세요.");
        }
        throw error;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(168,85,247,0.5)]"></div>
            <p className="text-gray-400 font-medium">프리미엄 정보를 불러오는 중입니다...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex flex-col items-center justify-center text-white p-6">
        <div className="w-full max-w-sm rounded-[32px] border border-white/5 bg-white/5 p-8 text-center backdrop-blur-2xl">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-500">
            <User className="h-8 w-8" />
          </div>
          <h2 className="mb-2 text-2xl font-bold">로그인이 필요합니다</h2>
          <p className="mb-8 text-gray-400">
            주문 내역 및 서비스 현황 확인을 위해 <br /> 로그인이 필요합니다.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => router.push('/login')}
              className="w-full rounded-2xl bg-white py-4 font-bold text-black transition-all hover:bg-gray-200 active:scale-95 shadow-xl"
            >
              로그인하기
            </button>
            <button
              onClick={() => router.back()}
              className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 font-bold text-gray-400 hover:text-white hover:bg-white/10 transition-all active:scale-95"
            >
              뒤로가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white font-sans selection:bg-purple-500 selection:text-white pb-24">
      {/* Background decoration */}
      <div className="fixed top-0 left-0 w-full h-[500px] pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] h-[600px] w-[600px] rounded-full bg-purple-600/10 blur-[120px] animate-pulse" />
        <div className="absolute top-[-10%] left-[-10%] h-[400px] w-[400px] rounded-full bg-blue-600/10 blur-[100px] animate-pulse" />
      </div>

      {/* Modern Compact Header */}
      <header className="border-b border-white/5 bg-black/40 backdrop-blur-2xl sticky top-0 z-50 overflow-x-auto no-scrollbar">
        <div className="mx-auto max-w-6xl px-6 h-20 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-bold tracking-tight hover:opacity-80 transition-opacity"
          >
            <Zap className="h-5 w-5 text-purple-500" />
            <span>My Page</span>
          </Link>
          
          <div className="flex items-center gap-4">
            {/* User Profile Info - Clickable */}
            <button 
                onClick={() => setIsProfileModalOpen(true)}
                className="flex items-center gap-3 group transition-all"
            >
                <div className="h-10 w-10 rounded-2xl bg-linear-to-br from-purple-500 to-blue-600 p-[1px] shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform">
                    <div className="h-full w-full rounded-[14px] bg-black flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                    </div>
                </div>
                <div className="text-left hidden sm:block">
                    <div className="text-sm font-bold leading-none group-hover:text-purple-400 transition-colors">{user.name} 님</div>
                    <div className="text-[10px] text-purple-400 font-medium mt-1">VIP MEMBER</div>
                </div>
            </button>

            <div className="h-8 w-px bg-white/10 mx-2"></div>
            
            {/* Logout on far right */}
            <button 
                onClick={() => { logout(); router.push('/'); }}
                className="p-2 text-gray-500 hover:text-red-400 transition-all hover:scale-110"
                title="로그아웃"
            >
                <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Profile Modal */}
      <ProfileModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
        user={user} 
        onSave={handleSaveProfile}
      />

      <main className="mx-auto max-w-6xl px-6 py-12">
        {/* Profile Card */}
        <div className="relative mb-12 rounded-[40px] border border-white/5 bg-linear-to-b from-white/10 to-transparent p-8 md:p-12 overflow-hidden backdrop-blur-xl shadow-2xl">
            <div className="absolute top-0 right-0 p-8 opacity-5">
                <User size={200} />
            </div>
            
            <div className="relative z-10">
                <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-xs font-bold text-purple-400 mb-6">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    인증된 회원
                </div>
                <h1 className="text-4xl md:text-5xl font-black mb-4">안녕하세요, {user.name}님</h1>
                <p className="text-gray-400 text-lg max-w-xl">
                    호스팅 서비스를 이용해 주셔서 감사합니다. <br />
                    신청하신 프로젝트의 진행 현황을 여기서 확인하실 수 있습니다.
                </p>
                
                <div className="mt-10 flex flex-wrap gap-4">
                    <Link href="#orders" onClick={() => setActiveTab('orders')} className="flex items-center gap-2 rounded-2xl bg-white px-6 py-3 font-bold text-black transition-all hover:bg-gray-200 active:scale-95">
                        내 주문서 확인
                        <ChevronRight className="h-4 w-4" />
                    </Link>
                    <Link href="/" className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-3 font-bold text-gray-300 transition-all hover:bg-white/10 active:scale-95">
                        메인으로 가기
                    </Link>
                </div>
            </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-8 border-b border-white/5 mb-10 overflow-x-auto no-scrollbar">
            {(['overview', 'orders', 'inquiries'] as const).map((tab) => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 text-sm font-bold transition-all relative ${
                        activeTab === tab ? 'text-purple-500' : 'text-gray-500 hover:text-gray-300'
                    }`}
                >
                    {tab === 'overview' ? '전체 요약' : tab === 'orders' ? '주문 내역' : '1:1 문의'}
                    {activeTab === tab && (
                        <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 w-full h-[2px] bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
                    )}
                </button>
            ))}
        </div>

        {/* Content Sections */}
        <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
                <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-12"
                >
                    {/* My Owned Site Section (For Sub-owners) */}
                    {(user.role === 'owner' || (user as any).subdomain) && (user as any).subdomain && (
                         <div className="rounded-[32px] border border-purple-500/30 bg-purple-500/5 p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                             <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 blur-[100px] pointer-events-none" />
                             
                             <div className="relative z-10 flex items-center gap-6 w-full md:w-auto">
                                <div className="h-16 w-16 rounded-2xl bg-purple-500 flex flex-shrink-0 items-center justify-center text-white shadow-lg shadow-purple-500/30">
                                   <Monitor className="h-8 w-8" />
                                </div>
                                <div>
                                   <div className="text-sm font-bold text-purple-400 mb-1 uppercase tracking-wider">My Active Site</div>
                                   <h3 className="text-2xl font-black text-white">{(user as any).subdomain.toUpperCase()} PAGE</h3>
                                   <p className="text-gray-400 text-sm">현재 정상적으로 운영되고 있는 나만의 사이트입니다.</p>
                                </div>
                             </div>

                             <div className="relative z-10 flex items-center gap-3 w-full md:w-auto">
                                <button 
                                  onClick={() => router.push(`/sites/${(user as any).subdomain}`)}
                                  className="flex-1 md:flex-none px-6 py-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold transition-all flex items-center justify-center gap-2"
                                >
                                   <Globe className="h-4 w-4" />
                                   사이트 보기
                                </button>
                                <button 
                                  onClick={() => router.push('/admin')}
                                  className="flex-1 md:flex-none px-6 py-4 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition-all shadow-lg flex items-center justify-center gap-2"
                                >
                                   <Settings className="h-4 w-4" />
                                   관리자 접속
                                </button>
                             </div>
                         </div>
                    )}

                    {/* Dashboard Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="group rounded-[32px] border border-white/5 bg-white/2 p-8 transition-all hover:border-purple-500/30 hover:bg-white/4 shadow-lg">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-500 group-hover:scale-110 transition-transform">
                                <ShoppingBag className="h-6 w-6" />
                            </div>
                            <div className="text-3xl font-black mb-1">{myOrders.length}</div>
                            <div className="text-sm font-bold text-gray-500 uppercase tracking-wider">전체 신청 내역</div>
                        </div>
                        <div className="group rounded-[32px] border border-white/5 bg-white/2 p-8 transition-all hover:border-blue-500/30 hover:bg-white/4 shadow-lg">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500 group-hover:scale-110 transition-transform">
                                <Layout className="h-6 w-6" />
                            </div>
                            <div className="text-3xl font-black mb-1">{myOrders.filter(o => o.status === 'active').length}</div>
                            <div className="text-sm font-bold text-gray-500 uppercase tracking-wider">정상 운영중인 사이트</div>
                        </div>
                        <div className="group rounded-[32px] border border-white/5 bg-white/2 p-8 transition-all hover:border-purple-500/30 hover:bg-white/4 shadow-lg">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-500 group-hover:scale-110 transition-transform">
                                <MessageSquare className="h-6 w-6" />
                            </div>
                            <div className="text-3xl font-black mb-1">{myInquiries.length}</div>
                            <div className="text-sm font-bold text-gray-500 uppercase tracking-wider">진행중인 1:1 상담</div>
                        </div>
                    </div>

                    {/* Quick Access */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="rounded-[40px] border border-white/5 bg-linear-to-br from-purple-500/20 to-blue-600/20 p-8 md:p-10 flex flex-col justify-between group cursor-pointer hover:shadow-2xl hover:shadow-purple-500/10 transition-all">
                            <div>
                                <h3 className="text-2xl font-bold mb-4">프로젝트 추가 신청하기</h3>
                                <p className="text-gray-400 mb-8 max-w-xs">다른 템플릿이나 추가 서비스가 필요하신가요?</p>
                            </div>
                            <Link href="/" className="inline-flex items-center gap-2 text-white font-bold group-hover:gap-4 transition-all uppercase tracking-widest text-xs">
                                서비스 둘러보기
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                        <div className="rounded-[40px] border border-white/5 bg-white/5 p-8 md:p-10 flex flex-col justify-between group border-dashed">
                            <div>
                                <h3 className="text-2xl font-bold mb-4">궁금한 점이 있으신가요?</h3>
                                <p className="text-gray-400 mb-8 max-w-xs">운영팀이 친절하게 답변해 드립니다.</p>
                            </div>
                            <Link href="#inquiries" onClick={() => setActiveTab('inquiries')} className="inline-flex items-center gap-2 text-purple-400 font-bold group-hover:gap-4 transition-all uppercase tracking-widest text-xs">
                                1:1 고객센터 바로가기
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </motion.div>
            )}

            {activeTab === 'orders' && (
                <motion.div
                    key="orders"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                >
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-2xl font-bold flex items-center gap-3">
                            <Files className="h-6 w-6 text-purple-500" />
                            내 주문 내역
                        </h2>
                        <span className="text-sm text-gray-500 font-medium">총 {myOrders.length}건</span>
                    </div>

                    <div className="grid gap-6">
                        {myOrders.length === 0 ? (
                            <div className="rounded-[32px] border border-dashed border-white/10 bg-white/2 p-24 text-center">
                                <div className="mx-auto w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-gray-600 mb-4">
                                    <ShoppingBag size={32} />
                                </div>
                                <p className="text-gray-500 font-bold">아직 신청하신 내역이 없습니다.</p>
                                <a href="https://kkang.designd.co.kr/#pricing" target="_blank" rel="noopener noreferrer" className="mt-6 inline-block text-purple-500 hover:text-purple-400 font-bold underline">첫 서비스 신청하기</a>
                            </div>
                        ) : (
                            myOrders.map((order) => (
                                <div
                                    key={order.id}
                                    className="rounded-[32px] border border-white/5 bg-white/3 overflow-hidden hover:border-purple-500/20 transition-all p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 group"
                                >
                                    <div className="flex-1 space-y-4">
                                        <div className="flex items-center gap-4">
                                            <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${
                                                order.status === 'pending_payment' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                                                order.status === 'paid' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                                'bg-green-500/10 text-green-500 border-green-500/20'
                                            }`}>
                                                {order.status === 'pending_payment' ? '입금 대기' :
                                                 order.status === 'paid' ? '결제 완료/사이트 구축중' : '서비스 이용중'}
                                            </div>
                                            <span className="text-xs text-gray-600 font-mono">
                                                {new Date(order.createdAt).toLocaleDateString()} | {order.id}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black group-hover:text-purple-400 transition-colors uppercase tracking-tight">
                                                {PLAN_NAMES[order.productId] || order.productId}
                                            </h3>
                                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mt-1">
                                                <span className="font-bold text-gray-300">{order.amount.toLocaleString()}원</span>
                                                <span className="w-1 h-1 rounded-full bg-gray-700 hidden sm:block"></span>
                                                <span className="flex items-center gap-1">
                                                    <CreditCard className="h-3 w-3" />
                                                    {order.paymentMethod === 'card' ? '신용카드' : '무통장입금'}
                                                </span>
                                                {order.imp_uid && (
                                                    <>
                                                        <span className="w-1 h-1 rounded-full bg-gray-700 hidden sm:block"></span>
                                                        <span className="text-[10px] text-gray-600 font-mono">ID: {order.imp_uid}</span>
                                                    </>
                                                )}
                                                {order.domainRequest && (
                                                    <>
                                                        <span className="w-1 h-1 rounded-full bg-gray-700 hidden sm:block"></span>
                                                        <span className="flex items-center gap-1">
                                                            <Globe className="h-3 w-3" />
                                                            요청 도메인: <span className="text-purple-400 font-mono">{order.domainRequest}</span>
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {/* Project Progress Steps */}
                                        <div className="pt-4 flex items-center gap-2 max-w-md">
                                            {[
                                                { label: '주문접수', active: true },
                                                { label: '입금확인', active: order.status !== 'pending_payment' },
                                                { label: '디자인/세팅', active: order.status === 'paid' || order.status === 'active' },
                                                { label: '최종오픈', active: order.status === 'active' }
                                            ].map((step, idx, arr) => (
                                                <div key={idx} className="flex-1 flex flex-col gap-2">
                                                    <div className={`h-1 rounded-full ${step.active ? 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]' : 'bg-white/10'}`} />
                                                    <span className={`text-[9px] font-bold ${step.active ? 'text-gray-300' : 'text-gray-600'}`}>{step.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 w-full md:w-auto">
                                        <div className="flex-1 md:flex-none">
                                            {order.status === 'pending_payment' ? (
                                                <div className="flex flex-col gap-2">
                                                    <div className="p-4 rounded-2xl bg-yellow-500/5 border border-yellow-500/10 text-center">
                                                        <div className="text-[10px] text-yellow-500 font-bold mb-1 uppercase">Action Required</div>
                                                        <div className="text-sm font-bold text-yellow-500/80">입금 확인 대기중</div>
                                                    </div>
                                                    <button 
                                                        onClick={() => { setEditingOrder(order); setIsEditOrderModalOpen(true); }}
                                                        className="w-full px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all"
                                                    >
                                                        <Edit className="h-3.5 w-3.5" />
                                                        주문 정보 수정
                                                    </button>
                                                </div>
                                            ) : order.status === 'active' ? (
                                                <button onClick={() => window.open(`https://${order.domainRequest || 'kkang.designd.co.kr'}`, '_blank')} className="w-full md:w-auto px-6 py-4 rounded-2xl bg-green-500/10 text-green-500 font-bold border border-green-500/20 flex items-center justify-center gap-2 hover:bg-green-500/20 transition-all">
                                                    <ExternalLink className="h-4 w-4" />
                                                    사이트 바로가기
                                                </button>
                                            ) : (
                                                <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10 text-center">
                                                    <div className="text-[10px] text-blue-500 font-bold mb-1 uppercase">In Progress</div>
                                                    <div className="text-sm font-bold text-blue-500/80">관리자가 세팅 중입니다</div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </motion.div>
            )}

            {activeTab === 'inquiries' && (
                <motion.div
                    key="inquiries"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                >
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-2xl font-bold flex items-center gap-3">
                            <MessageSquare className="h-6 w-6 text-purple-500" />
                            내 문의 내역
                        </h2>
                        <button onClick={() => router.push('/#contact')} className="text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors uppercase tracking-[0.2em]">
                            + 새 문의하기
                        </button>
                    </div>

                    <div className="grid gap-6">
                        {myInquiries.length === 0 ? (
                            <div className="rounded-[32px] border border-dashed border-white/10 bg-white/2 p-24 text-center">
                                <p className="text-gray-500 font-bold">문의 내역이 없습니다.</p>
                            </div>
                        ) : (
                            myInquiries.map((inq, idx) => (
                                <div
                                    key={idx}
                                    className="rounded-[32px] border border-white/5 bg-white/3 p-8 flex flex-col md:flex-row justify-between gap-6 hover:border-purple-500/10 transition-all"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 bg-white/5 px-3 py-1 rounded-full">Support Ticket</span>
                                            <span className="text-xs text-gray-600 font-mono">{new Date(inq.createdAt).toLocaleString()}</span>
                                        </div>
                                        <p className="text-gray-300 text-lg font-medium leading-relaxed">{inq.message}</p>
                                        {inq.plan && <div className="mt-2 text-sm text-purple-400 font-bold">#{inq.plan.toUpperCase()} PLAN</div>}
                                    </div>
                                    <div className="flex items-center">
                                        <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${
                                            inq.status === 'completed' 
                                                ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                                                : 'bg-gray-800/50 text-gray-500 border-white/5'
                                        }`}>
                                            <div className={`w-2 h-2 rounded-full ${inq.status === 'completed' ? 'bg-green-500' : 'bg-gray-600'}`}></div>
                                            <span className="text-xs font-black uppercase tracking-tighter">
                                                {inq.status === 'completed' ? '답변 완료' : '답변 대기중'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
      </main>

      {/* Edit Order Modal */}
      <AnimatePresence>
        {isEditOrderModalOpen && editingOrder && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
                    onClick={() => setIsEditOrderModalOpen(false)}
                />
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#121212] p-8 shadow-2xl"
                >
                    <button 
                        onClick={() => setIsEditOrderModalOpen(false)}
                        className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
                    >
                        <X className="h-6 w-6" />
                    </button>
                    
                    <h2 className="text-2xl font-bold mb-2">주문 정보 수정</h2>
                    <p className="text-gray-400 text-sm mb-6">입금 전 상태에서만 정보를 수정할 수 있습니다.</p>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">연락처</label>
                            <input 
                                type="text" 
                                value={editForm.buyerPhone}
                                onChange={(e) => setEditForm(prev => ({ ...prev, buyerPhone: e.target.value }))}
                                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all font-mono"
                                placeholder="010-0000-0000"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">희망 도메인</label>
                            <input 
                                type="text" 
                                value={editForm.domainRequest}
                                onChange={(e) => setEditForm(prev => ({ ...prev, domainRequest: e.target.value }))}
                                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all font-mono"
                                placeholder="example.com"
                            />
                            <p className="text-xs text-gray-600">
                                * 확정된 도메인이 아니라면 비워두셔도 됩니다.
                            </p>
                        </div>
                        
                        <div className="pt-4 flex gap-3">
                            <button 
                                onClick={() => setIsEditOrderModalOpen(false)}
                                className="flex-1 rounded-xl bg-white/5 py-3 font-bold text-gray-400 hover:bg-white/10 hover:text-white transition-all"
                            >
                                취소
                            </button>
                            <button 
                                onClick={handleUpdateOrder}
                                className="flex-1 rounded-xl bg-purple-600 py-3 font-bold text-white hover:bg-purple-500 transition-all shadow-lg shadow-purple-600/20"
                            >
                                수정 완료
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>
      
      {/* Footer link back */}
      <footer className="mt-20 border-t border-white/5 py-12 text-center">
          <p className="text-gray-600 text-xs">© 2025 FanEasy Inc. - Premium Partner of 깡대표</p>
      </footer>
    </div>
  );
}
