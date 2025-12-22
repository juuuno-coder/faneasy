'use client';

import { useDataStore } from '@/lib/data-store';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebaseClient';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import type { Inquiry } from '@/lib/types';
import { 
  Users, 
  MessageSquare, 
  Settings, 
  LogOut, 
  LayoutDashboard,
  CheckCircle2,
  Clock,
  ChevronRight,
  Shield
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const { user, logout } = useAuthStore();
  const { inquiries: localInquiries } = useDataStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  useEffect(() => {
    setMounted(true);
    if (mounted && (!user || user.role !== 'influencer')) {
      // router.push('/login'); // Temporarily disabled for dev convenience or strictly enforce:
    }
  }, [user, mounted, router]);

  // Real-time Firestore listener
  useEffect(() => {
    if (!mounted) return;

    const q = query(
      collection(db, "inquiries"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const firestoreInquiries = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt || new Date().toISOString()
      })) as Inquiry[];
      
      if (firestoreInquiries.length > 0) {
        setInquiries(firestoreInquiries);
      } else {
        setInquiries(localInquiries);
      }
    }, (error) => {
      console.error("Firestore listener error:", error);
      setInquiries(localInquiries);
    });

    return () => unsubscribe();
  }, [mounted, localInquiries]);

  if (!mounted) return null;

  return (
    <div className="flex min-h-screen bg-[#0A0A0B] text-white font-sans">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 border-r border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="flex h-16 items-center flex-col justify-center border-b border-white/5 px-6">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-purple-500" />
            <span className="font-bold tracking-tight">FANEASY ADMIN</span>
          </div>
        </div>
        
        <nav className="p-4 space-y-2">
          <Link href="/admin/dashboard" className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 text-sm font-bold text-white">
            <LayoutDashboard className="h-5 w-5" />
            대시보드
          </Link>
          <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white transition-all">
            <Users className="h-5 w-5" />
            고객 관리
          </button>
          <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white transition-all">
            <MessageSquare className="h-5 w-5" />
            문의 내역
          </button>
          <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white transition-all">
            <Settings className="h-5 w-5" />
            사이트 설정
          </button>
        </nav>

        <div className="absolute bottom-4 w-full px-4">
          <button 
            onClick={() => { logout(); router.push('/'); }}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-400/10 transition-all"
          >
            <LogOut className="h-5 w-5" />
            로그아웃
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-8">
        <header className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">대시보드</h1>
            <p className="text-gray-400 text-sm mt-1">실시간 문의 현황 및 통계를 확인하세요.</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-right">
                <div className="text-sm font-bold">{user?.name || 'Admin'}</div>
                <div className="text-xs text-gray-500">{user?.email}</div>
             </div>
             <div className="h-10 w-10 rounded-full bg-purple-500/20 border border-purple-500/50 flex items-center justify-center font-bold text-purple-500">
                {user?.name?.[0] || 'A'}
             </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4 mb-12">
          {[
            { label: '전체 문의', value: inquiries.length, icon: MessageSquare, color: 'blue' },
            { label: '오늘 새 문의', value: inquiries.filter(i => new Date(i.createdAt).toDateString() === new Date().toDateString()).length, icon: Clock, color: 'purple' },
            { label: '상담 완료', value: 0, icon: CheckCircle2, color: 'green' },
            { label: '누적 방문자', value: '1.2k', icon: Users, color: 'amber' },
          ].map((stat, i) => (
            <div key={i} className="rounded-3xl border border-white/5 bg-white/2 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`rounded-xl bg-${stat.color}-500/10 p-2 text-${stat.color}-500`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <span className="text-xs text-green-500 font-medium">+12%</span>
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Recent Inquiries Section */}
        <div className="rounded-3xl border border-white/5 bg-white/2 p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold">최근 문의 내역</h2>
            <button className="text-sm text-purple-400 hover:underline">전체보기</button>
          </div>

          <div className="space-y-4">
            {inquiries.length > 0 ? (
              inquiries.slice(0, 10).map((inquiry, i) => (
                <div 
                  key={inquiry.id || i} 
                  onClick={() => setSelectedInquiry(inquiry)}
                  className="group flex items-center justify-between rounded-2xl border border-white/5 bg-black/20 p-4 transition-all hover:bg-white/5 cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-linear-to-br from-gray-700 to-gray-800 flex items-center justify-center font-bold text-xs">
                        {inquiry.name[0]}
                    </div>
                    <div>
                      <div className="font-bold">{inquiry.name}</div>
                      <div className="text-xs text-gray-500">{inquiry.email} | {inquiry.phone}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                       <div className="text-sm font-medium text-gray-300">{(inquiry as any).plan || '프로젝트 문의'}</div>
                       <div className="text-xs text-gray-500">{new Date(inquiry.createdAt).toLocaleString()}</div>
                    </div>
                    <div className="rounded-full bg-purple-500/10 px-3 py-1 text-[10px] font-bold text-purple-400 border border-purple-500/20">
                      NEW
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-600 group-hover:text-white transition-colors" />
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-gray-500">
                접수된 문의가 없습니다.
              </div>
            )}
          </div>
        </div>

        {/* Inquiry Detail Modal */}
        {selectedInquiry && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedInquiry(null)}>
            <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200" onClick={(e) => e.stopPropagation()}>
              <div className="p-8 border-b border-gray-100 flex justify-between items-start bg-gradient-to-r from-purple-50 to-indigo-50">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">문의 상세 내용</h3>
                  <p className="text-sm text-gray-500">{new Date(selectedInquiry.createdAt).toLocaleString()}</p>
                </div>
                <button 
                  onClick={() => setSelectedInquiry(null)}
                  className="p-2 hover:bg-white rounded-full transition-colors"
                >
                  <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
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
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-700 uppercase">
                      {(selectedInquiry as any).plan || 'N/A'}
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
                  className="flex-1 py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-center transition-colors"
                >
                  답장하기
                </a>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
