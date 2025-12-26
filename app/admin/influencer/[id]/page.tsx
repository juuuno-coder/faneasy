'use client';

import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebaseClient';
import { collection, query, where, onSnapshot, orderBy, doc, getDoc } from 'firebase/firestore';
import { 
  Users, 
  Globe, 
  MessageSquare, 
  LayoutDashboard, 
  Shield, 
  ArrowLeft,
  Settings,
  Clock,
  LogOut
} from 'lucide-react';
import SiteTreeView from '@/components/admin/site-tree-view';
import CustomersTab from '@/components/admin/customers-tab';
import InquiriesTab from '@/components/admin/inquiries-tab';
import UsersTab from "@/components/admin/users-tab";
import type { Inquiry } from '@/lib/types';

export default function InfluencerAdminDashboard() {
  const { id: influencerId } = useParams();
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'sites' | 'users' | 'inquiries'>('dashboard');
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [siteTitle, setSiteTitle] = useState('인플루언서 관리자');

  useEffect(() => {
    setMounted(true);
    if (mounted && user) {
      // 권한 체크: super_admin이거나 해당 인플루언서 본인이어야 함
      const isAuthorized = user.role === 'super_admin' || (user.role === 'owner' && user.subdomain === influencerId);
      if (!isAuthorized) {
        alert('해당 관리자 페이지에 접근할 권한이 없습니다.');
        router.push('/admin');
      }
    }
  }, [mounted, user, influencerId, router]);

  // 해당 인플루언서의 사이트 정보 가져오기
  useEffect(() => {
    if (!influencerId) return;
    const fetchSiteInfo = async () => {
      try {
        const siteRef = doc(db, 'site_settings', influencerId as string);
        const siteSnap = await getDoc(siteRef);
        if (siteSnap.exists()) {
          setSiteTitle(`${siteSnap.data().siteName?.toUpperCase() || influencerId.toString().toUpperCase()} ADMIN`);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchSiteInfo();
  }, [influencerId]);

  // 해당 인플루언서 산하의 문의 내역 필터링해서 가져오기
  useEffect(() => {
    if (!mounted || !influencerId) return;

    // 인플루언서 사이트 자체의 문의 + 산하 팬페이지들의 문의를 가져와야 함?
    // 일단은 이 인플루언서가 소유한(ownerId) 문의들만 가져오도록 설정
    // 더 발전시킨다면 parentInfluencerId 등을 쿼리에 넣을 수 있음
    const q = query(
      collection(db, "inquiries"),
      where("parentInfluencerId", "==", influencerId), // 팬페이지 가입 시 이 필드를 넣어줘야 함
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt || new Date().toISOString()
      })) as Inquiry[];
      setInquiries(data);
    });

    return () => unsubscribe();
  }, [mounted, influencerId]);

  // 실시간 데이터 가져오기 (사이트 수, 팬 수)
  const [totalSites, setTotalSites] = useState(0);
  const [totalFans, setTotalFans] = useState(0);

  useEffect(() => {
    if (!influencerId) return;

    // 1. 산하 사이트 개수
    const qSites = query(collection(db, 'sites'), where('parentSiteId', '==', influencerId));
    const unsubSites = onSnapshot(qSites, (snap) => setTotalSites(snap.docs.length));

    // 2. 가입한 팬 수
    const qFans = query(collection(db, 'users'), where('joinedInfluencerId', '==', influencerId));
    const unsubFans = onSnapshot(qFans, (snap) => setTotalFans(snap.docs.length));

    return () => {
        unsubSites();
        unsubFans();
    };
  }, [influencerId]);

  if (!mounted || !user) return null;

  const tabs = [
    { id: 'dashboard', label: '대시보드', icon: LayoutDashboard },
    { id: 'sites', label: '팬페이지 개설 현황', icon: Globe },
    { id: 'users', label: '가입 팬 관리', icon: Users },
    { id: 'inquiries', label: '통합 문의 내역', icon: MessageSquare },
  ];

  return (
    <div className="flex min-h-screen bg-[#0A0A0B] text-white">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 border-r border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="flex h-16 items-center flex-col justify-center border-b border-white/5 px-6">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-purple-500" />
            <span className="font-bold tracking-tight text-sm uppercase">
              {siteTitle}
            </span>
          </div>
        </div>
        
        <nav className="p-4 space-y-2">
          {tabs.map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all ${
                activeTab === tab.id ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <tab.icon className={`h-5 w-5 ${activeTab === tab.id ? 'text-purple-400' : 'text-gray-500'}`} />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-4 w-full px-4 space-y-2">
            <button 
                onClick={() => router.push('/admin')}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-500 hover:text-white hover:bg-white/5 transition-all"
            >
                <ArrowLeft className="h-5 w-5" />
                마스터 관리자로
            </button>
            <button 
                onClick={() => { logout(); router.push('/'); }}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-500 hover:text-red-400 hover:bg-red-400/5 transition-all"
            >
                <LogOut className="h-5 w-5" />
                로그아웃
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-8">
        <header className="mb-12">
          <h1 className="text-3xl font-bold mb-2">
            {tabs.find(t => t.id === activeTab)?.label}
          </h1>
          <p className="text-gray-400">
            {influencerId} 인플루언서의 독립 채널 데이터입니다.
          </p>
        </header>

        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
             <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                <div className="text-gray-400 text-xs font-bold uppercase mb-2">총 팬페이지</div>
                <div className="text-3xl font-bold">{totalSites}개</div>
             </div>
             <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                <div className="text-gray-400 text-xs font-bold uppercase mb-2">가입 팬 수</div>
                <div className="text-3xl font-bold">{totalFans.toLocaleString()}명</div>
             </div>
             <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                <div className="text-gray-400 text-xs font-bold uppercase mb-2">문의 전환율</div>
                <div className="text-3xl font-bold text-purple-400">
                    {totalFans > 0 ? ((inquiries.length / totalFans) * 100).toFixed(1) : 0}%
                </div>
             </div>
          </div>
        )}

        {activeTab === 'sites' && (
          <SiteTreeView 
            userRole="owner" 
            currentSubdomain={influencerId as string} 
            isDarkMode={true} 
          />
        )}

        {activeTab === 'users' && (
          <UsersTab isDarkMode={true} influencerId={influencerId as string} />
        )}

        {activeTab === 'inquiries' && (
          <InquiriesTab inquiries={inquiries} isDarkMode={true} onSelectInquiry={() => {}} />
        )}
      </main>
    </div>
  );
}
