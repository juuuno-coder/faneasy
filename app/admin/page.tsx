'use client';

import { useDataStore } from '@/lib/data-store';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebaseClient';
import { collection, query, orderBy, onSnapshot, where } from 'firebase/firestore';
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
  Shield,
  Globe,
  Bell,
  Bot,
  Menu,
  X
} from 'lucide-react';
import Link from 'next/link';
import ProfileModal from '@/components/profile-modal';
import CustomersTab from '@/components/admin/customers-tab';
import InquiriesTab from '@/components/admin/inquiries-tab';
import SettingsTab from '@/components/admin/settings-tab';
import ActivityTab from '@/components/admin/activity-tab';
import SiteTreeView from '@/components/admin/site-tree-view';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

export default function AdminDashboard() {
  const { user, logout, updateUser } = useAuthStore();
  const { inquiries: localInquiries } = useDataStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'structure' | 'customers' | 'inquiries' | 'settings' | 'activity'>('dashboard');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  useEffect(() => {
    setMounted(true);
    // Allow all roles to access admin dashboard
  }, [user, mounted, router]);

  // Real-time Firestore listener with role-based filtering
  useEffect(() => {
    if (!mounted || !user) return;

    // Build query based on user role
    let q;
    if (user.role === 'admin') {
      // Admin sees all inquiries
      q = query(
        collection(db, "inquiries"),
        orderBy("createdAt", "desc")
      );
    } else if (user.role === 'influencer') {
      // Influencer sees only their inquiries
      q = query(
        collection(db, "inquiries"),
        where("ownerId", "==", user.id),
        orderBy("createdAt", "desc")
      );
    } else {
      // Fan sees only their inquiries
      q = query(
        collection(db, "inquiries"),
        where("ownerId", "==", user.id),
        orderBy("createdAt", "desc")
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const firestoreInquiries = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt || new Date().toISOString()
      })) as Inquiry[];
      
      if (firestoreInquiries.length > 0) {
        setInquiries(firestoreInquiries);
      } else {
        // Filter local inquiries by role as well
        const filteredLocal = user.role === 'admin' 
          ? localInquiries 
          : localInquiries.filter(inq => inq.ownerId === user.id);
        setInquiries(filteredLocal);
      }
    }, (error) => {
      console.error("Firestore listener error:", error);
      setInquiries(localInquiries);
    });

    return () => unsubscribe();
  }, [mounted, localInquiries]);

  if (!mounted) {
    return (
      <div className="flex h-screen bg-[#0E0E0E] text-white overflow-hidden">
        {/* Skeleton Sidebar */}
        <div className="w-64 border-r border-white/5 bg-black/50 p-6 hidden md:block">
          <div className="h-8 w-32 bg-white/10 rounded-lg mb-10 animate-pulse" />
          <div className="space-y-4">
             {[1, 2, 3, 4, 5].map(i => (
               <div key={i} className="h-12 w-full bg-white/5 rounded-xl animate-pulse" />
             ))}
          </div>
        </div>
        {/* Skeleton Main */}
        <div className="flex-1 p-8">
           <div className="flex justify-between items-center mb-12">
             <div>
               <div className="h-8 w-48 bg-white/10 rounded-lg mb-2 animate-pulse" />
               <div className="h-4 w-64 bg-white/5 rounded-lg animate-pulse" />
             </div>
             <div className="h-10 w-10 rounded-full bg-white/10 animate-pulse" />
           </div>
           <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
             {[1, 2, 3, 4].map(i => (
               <div key={i} className="h-32 bg-white/5 rounded-3xl animate-pulse" />
             ))}
           </div>
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="h-64 bg-white/5 rounded-3xl animate-pulse" />
              <div className="h-64 bg-white/5 rounded-3xl animate-pulse" />
           </div>
        </div>
      </div>
    );
  }

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
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all ${
              activeTab === 'dashboard' ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <LayoutDashboard className="h-5 w-5" />
            대시보드
          </button>
          <button 
            onClick={() => setActiveTab('structure')}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
              activeTab === 'structure' ? 'bg-white/10 text-white font-bold' : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Globe className="h-5 w-5" />
            사이트 구조
          </button>
          <button 
            onClick={() => setActiveTab('customers')}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
              activeTab === 'customers' ? 'bg-white/10 text-white font-bold' : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Users className="h-5 w-5" />
            고객 관리
          </button>
          <button 
            onClick={() => setActiveTab('inquiries')}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
              activeTab === 'inquiries' ? 'bg-white/10 text-white font-bold' : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <MessageSquare className="h-5 w-5" />
            문의 내역
          </button>
          <button 
            onClick={() => { setActiveTab('activity'); setShowMobileMenu(false); }}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
              activeTab === 'activity' 
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20' 
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Clock className="h-5 w-5" />
            활동 로그
          </button>
          <button 
            onClick={() => { setActiveTab('settings'); setShowMobileMenu(false); }}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
              activeTab === 'settings' ? 'bg-white/10 text-white font-bold' : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
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
      <main className="ml-0 md:ml-64 flex-1 p-4 md:p-8 transition-all duration-300">
        <header className="mb-8 md:mb-12 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowMobileMenu(true)}
              className="md:hidden p-2 hover:bg-white/10 rounded-lg text-white"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div>
              <div className="flex items-center gap-3 mb-1 md:mb-2">
              <h1 className="text-3xl font-bold">
                {activeTab === 'dashboard' && '대시보드'}
                {activeTab === 'structure' && '사이트 구조'}
                {activeTab === 'customers' && '고객 관리'}
                {activeTab === 'inquiries' && '문의 내역'}
                {activeTab === 'settings' && '사이트 설정'}
                {activeTab === 'activity' && '활동 로그'}
              </h1>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">
                {user?.role === 'admin' && '전체 플랫폼'}
                {user?.role === 'influencer' && `${user?.subdomain || '인플루언서'} 관리`}
                {user?.role === 'fan' && '팬 페이지'}
              </span>
            </div>
            <p className="text-gray-400 text-sm mt-1">
              {activeTab === 'dashboard' && '실시간 문의 현황 및 통계를 확인하세요.'}
              {activeTab === 'structure' && '사이트 계층 구조와 연결 관계를 확인하세요.'}
              {activeTab === 'customers' && '고객 정보를 관리하고 분석하세요.'}
              {activeTab === 'inquiries' && '모든 문의 내역을 확인하고 관리하세요.'}
              {activeTab === 'settings' && '사이트 설정을 변경하고 최적화하세요.'}
              {activeTab === 'activity' && '관리자 활동 및 보안 로그를 확인하세요.'}
            </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <button 
               onClick={() => setActiveTab('inquiries')}
               className="relative p-2 hover:bg-white/5 rounded-full transition-colors"
               title="새 문의 내역"
             >
               <Bell className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
               {inquiries.filter(i => i.status === 'pending').length > 0 && (
                 <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
               )}
             </button>
             <div className="h-8 w-[1px] bg-white/10 mx-2" />
             <div className="text-right">
                <div className="text-sm font-bold">{user?.name || 'Admin'}</div>
                <div className="text-xs text-gray-500">{user?.email}</div>
             </div>
             <button
               onClick={() => setShowProfileModal(true)}
               className="h-10 w-10 rounded-full bg-purple-500/20 border border-purple-500/50 flex items-center justify-center font-bold text-purple-500 hover:bg-purple-500/30 transition-colors cursor-pointer"
             >
                {user?.name?.[0] || 'A'}
             </button>
          </div>
        </header>

        {/* Dashboard Tab Content */}
        {activeTab === 'dashboard' && (
          <>
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4 mb-12">
          {[
            { label: '전체 문의', value: inquiries.length, icon: MessageSquare, color: 'blue', action: 'inquiries' },
            { label: '오늘 새 문의', value: inquiries.filter(i => new Date(i.createdAt).toDateString() === new Date().toDateString()).length, icon: Clock, color: 'purple', action: 'inquiries' },
            { label: '상담 완료', value: 0, icon: CheckCircle2, color: 'green', action: null },
            { label: '누적 방문자', value: '1.2k', icon: Users, color: 'amber', action: null },
          ].map((stat, i) => (
            <button
              key={i}
              onClick={() => {
                if (stat.action === 'inquiries') {
                  document.getElementById('inquiries-section')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className={`rounded-3xl border border-white/5 bg-white/2 p-6 text-left transition-all ${
                stat.action ? 'hover:bg-white/5 hover:border-purple-500/30 cursor-pointer active:scale-95' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`rounded-xl bg-${stat.color}-500/10 p-2 text-${stat.color}-500`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <span className="text-xs text-green-500 font-medium">+12%</span>
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </button>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Visitor Trend Chart */}
          <div className="rounded-3xl border border-white/5 bg-white/2 p-6">
             <h3 className="text-lg font-bold mb-4">주간 방문자 및 문의 추이</h3>
             <div className="h-64 w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={[
                   { name: '월', visitors: 400, inquiries: 24 },
                   { name: '화', visitors: 300, inquiries: 18 },
                   { name: '수', visitors: 550, inquiries: 35 },
                   { name: '목', visitors: 450, inquiries: 28 },
                   { name: '금', visitors: 600, inquiries: 42 },
                   { name: '토', visitors: 350, inquiries: 15 },
                   { name: '일', visitors: 420, inquiries: 20 },
                 ]}>
                   <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                   <XAxis dataKey="name" stroke="#6b7280" />
                   <YAxis stroke="#6b7280" />
                   <Tooltip 
                     contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#333' }}
                     itemStyle={{ color: '#fff' }}
                   />
                   <Legend wrapperStyle={{ paddingTop: '20px' }} />
                   <Line type="monotone" dataKey="visitors" name="방문자" stroke="#8B5CF6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                   <Line type="monotone" dataKey="inquiries" name="문의" stroke="#10B981" strokeWidth={2} dot={{ r: 4 }} />
                 </LineChart>
               </ResponsiveContainer>
             </div>
          </div>

          {/* Inquiry Status Chart */}
          <div className="rounded-3xl border border-white/5 bg-white/2 p-6">
             <h3 className="text-lg font-bold mb-4">문의 현황 분석</h3>
             <div className="h-64 w-full flex items-center justify-center">
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Pie
                     data={[
                       { name: '대기중', value: inquiries.filter(i => i.status === 'pending').length || 5 },
                       { name: '상담중', value: inquiries.filter(i => (i as any).status === 'contacted').length || 3 },
                       { name: '완료', value: inquiries.filter(i => (i as any).status === 'completed').length || 8 },
                     ]}
                     cx="50%"
                     cy="50%"
                     innerRadius={60}
                     outerRadius={80}
                     paddingAngle={5}
                     dataKey="value"
                   >
                     {[ '#EF4444', '#F59E0B', '#10B981' ].map((color, index) => (
                       <Cell key={`cell-${index}`} fill={color} />
                     ))}
                   </Pie>
                   <Tooltip contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#333' }} itemStyle={{ color: '#fff' }} />
                   <Legend wrapperStyle={{ paddingTop: '20px' }} />
                 </PieChart>
               </ResponsiveContainer>
             </div>
          </div>
        </div>

        {/* Recent Inquiries Section */}
        <div id="inquiries-section" className="rounded-3xl border border-white/5 bg-white/2 p-8">
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
          </>
        )}

        {/* Site Structure Tab Content */}
        {activeTab === 'structure' && (
          <SiteTreeView 
            userRole={(user?.role as 'admin' | 'influencer' | 'fan') || 'admin'} 
            userId={user?.id}
          />
        )}

        {/* Customers Tab Content */}
        {activeTab === 'customers' && <CustomersTab inquiries={inquiries} />}

        {/* Inquiries Tab Content */}
        {activeTab === 'inquiries' && (
          <InquiriesTab 
            inquiries={inquiries} 
            onSelectInquiry={setSelectedInquiry}
          />
        )}

        {/* Settings Tab Content */}
        {activeTab === 'settings' && <SettingsTab />}
        {activeTab === 'activity' && <ActivityTab />}

        {/* Inquiry Detail Modal */}
        {selectedInquiry && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedInquiry(null)}>
            <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200" onClick={(e) => e.stopPropagation()}>
              <div className="p-8 border-b border-gray-100 flex justify-between items-start bg-linear-to-r from-purple-50 to-indigo-50">
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
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">희망 도메인</p>
                    <p className="text-gray-900 font-medium">{(selectedInquiry as any).desiredDomain || '정보 없음'}</p>
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
                <button 
                  onClick={() => {
                    setShowReplyModal(true);
                    setReplyMessage(`안녕하세요 ${selectedInquiry.name}님,\n\n문의 주셔서 감사합니다.\n\n`);
                  }}
                  className="flex-1 py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-center transition-colors"
                >
                  답장하기
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reply Modal */}
        {showReplyModal && selectedInquiry && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
              <div className="p-8 border-b border-gray-100 flex justify-between items-start bg-linear-to-r from-purple-50 to-indigo-50">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">답장 작성</h3>
                  <p className="text-sm text-gray-500">받는 사람: {selectedInquiry.email}</p>
                </div>
                <button 
                  onClick={() => {
                    setShowReplyModal(false);
                    setReplyMessage('');
                  }}
                  className="p-2 hover:bg-white rounded-full transition-colors"
                >
                  <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-8">
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-bold text-gray-700">메시지</label>
                    <div className="flex gap-2">
                      <select 
                        className="px-2 py-1.5 bg-gray-100 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        onChange={(e) => {
                          if (e.target.value) setReplyMessage(e.target.value.replace('{name}', selectedInquiry?.name || '고객'));
                        }}
                      >
                        <option value="">템플릿 선택...</option>
                        <option value="안녕하세요, {name}님.&#13;&#10;&#13;&#10;문의해주신 내용은 현재 담당 부서에서 확인 중입니다.&#13;&#10;최대한 빠른 시일 내에 답변 드리겠습니다.&#13;&#10;&#13;&#10;감사합니다.">접수 안내</option>
                        <option value="안녕하세요, {name}님.&#13;&#10;&#13;&#10;요청하신 사항 처리가 완료되었습니다.&#13;&#10;이용해 주셔서 감사합니다.&#13;&#10;&#13;&#10;FanEasy 드림">처리 완료</option>
                        <option value="안녕하세요, {name}님.&#13;&#10;&#13;&#10;정확한 안내를 위해 추가 정보가 필요합니다.&#13;&#10;번거로우시겠지만 회신 부탁드립니다.&#13;&#10;&#13;&#10;감사합니다.">정보 요청</option>
                      </select>
                      <button 
                        onClick={() => setReplyMessage(`안녕하세요, ${selectedInquiry?.name}님.\n\n문의 주셔서 감사합니다. 보내주신 내용은 담당자가 확인 후 신속하게 답변 드리겠습니다.\n\n추가로 궁금하신 점이 있다면 언제든지 문의해 주세요.\n\n감사합니다.\nFanEasy 드림`)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-xs font-bold hover:bg-purple-200 transition-colors border border-purple-200"
                      >
                        <Bot className="h-3 w-3" />
                        AI 자동 완성
                      </button>
                    </div>
                  </div>
                  <textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    rows={10}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none text-gray-900 bg-white"
                    placeholder="답장 내용을 입력하세요..."
                  />
                </div>
              </div>
              <div className="p-6 bg-gray-50 flex gap-3">
                <button 
                  onClick={() => {
                    setShowReplyModal(false);
                    setReplyMessage('');
                  }}
                  className="flex-1 py-3 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-bold transition-colors"
                  disabled={sendingReply}
                >
                  취소
                </button>
                <button 
                  onClick={async () => {
                    if (!replyMessage.trim()) {
                      alert('메시지를 입력해주세요.');
                      return;
                    }
                    
                    setSendingReply(true);
                    try {
                      const response = await fetch('/api/send-email', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          to: selectedInquiry.email,
                          subject: `[FanEasy] ${selectedInquiry.name}님의 문의에 대한 답변입니다.`,
                          html: `
                            <div style="font-family: sans-serif; line-height: 1.6;">
                              <p>안녕하세요, ${selectedInquiry.name}님.</p>
                              <p>FanEasy 관리자입니다.</p>
                              <br/>
                              <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px;">
                                ${replyMessage.replace(/\n/g, '<br/>')}
                              </div>
                              <br/>
                              <p>추가 문의사항이 있으시면 언제든지 연락주세요.</p>
                              <p>감사합니다.</p>
                            </div>
                          `,
                          replyTo: user?.email // Admin's email as reply-to
                        }),
                      });

                      if (response.ok) {
                        alert('답장이 성공적으로 발송되었습니다!');
                        setShowReplyModal(false);
                        setReplyMessage('');
                        setSelectedInquiry(null);
                      } else {
                        throw new Error('Failed to send reply');
                      }
                    } catch (error) {
                      console.error('Reply error:', error);
                      alert('답장 발송에 실패했습니다. 다시 시도해주세요.');
                    } finally {
                      setSendingReply(false);
                    }
                  }}
                  className="flex-1 py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={sendingReply}
                >
                  {sendingReply ? '발송 중...' : '발송하기'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Profile Modal */}
        <ProfileModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          user={user}
          onSave={(data) => {
            updateUser(data);
            setProfileData(data);
          }}
        />
      </main>
    </div>
  );
}
