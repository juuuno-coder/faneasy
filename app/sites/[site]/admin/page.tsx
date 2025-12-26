'use client';

import { use, useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebaseClient';
import { collection, query, orderBy, onSnapshot, where, doc, getDoc } from 'firebase/firestore';
import { 
  Users, 
  MessageSquare, 
  Settings, 
  LogOut, 
  LayoutDashboard,
  Globe,
  Palette,
  Shield,
  Bell,
  ArrowLeft,
  Sun,
  Moon
} from 'lucide-react';
import Link from 'next/link';
import DesignEditor from '@/app/admin/influencer/design-editor';
import SiteTreeView from '@/components/admin/site-tree-view';
import InquiriesTab from '@/components/admin/inquiries-tab';
import UsersTab from '@/components/admin/users-tab';
import type { Inquiry } from '@/lib/types';

export default function SiteAdminPage({
  params,
}: {
  params: Promise<{ site: string }>;
}) {
  const { site } = use(params);
  const siteSlug = site.toLowerCase().trim();
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'builder' | 'users' | 'inquiries' | 'settings'>('dashboard');
  const [mounted, setMounted] = useState(false);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [totalFans, setTotalFans] = useState(0);
  const [totalSubSites, setTotalSubSites] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch Site specific data
  useEffect(() => {
    if (!mounted || !siteSlug) return;

    // 1. Inquiries for this site or site owner's network
    const qInq = query(
        collection(db, 'inquiries'),
        where('subdomain', '==', siteSlug),
        orderBy('createdAt', 'desc')
    );
    const unsubInq = onSnapshot(qInq, (snap) => {
        setInquiries(snap.docs.map(d => ({ id: d.id, ...d.data() } as Inquiry)));
    });

    // 2. Fans who joined this site
    const qFans = query(collection(db, 'users'), where('joinedSite', '==', siteSlug));
    const unsubFans = onSnapshot(qFans, (snap) => setTotalFans(snap.docs.length));

    // 3. Sub-sites of this site
    const qSites = query(collection(db, 'sites'), where('parentSiteId', '==', siteSlug));
    const unsubSites = onSnapshot(qSites, (snap) => setTotalSubSites(snap.docs.length));

    return () => {
        unsubInq();
        unsubFans();
        unsubSites();
    };
  }, [mounted, siteSlug]);

  if (!mounted) return null;

  const tabs = [
    { id: 'dashboard', label: '대시보드', icon: LayoutDashboard },
    { id: 'builder', label: '디자인 편집', icon: Palette },
    { id: 'users', label: '팬 관리', icon: Users },
    { id: 'inquiries', label: '문의 내역', icon: MessageSquare },
    { id: 'settings', label: '설정', icon: Settings },
  ];

  const theme = {
    bg: isDarkMode ? 'bg-[#0A0A0B]' : 'bg-gray-50',
    text: isDarkMode ? 'text-white' : 'text-slate-900',
    sidebar: isDarkMode ? 'bg-black/50 border-white/5' : 'bg-white border-slate-200',
    card: isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-gray-200 shadow-sm',
    itemBg: isDarkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100',
    navActive: isDarkMode ? 'bg-white/10 text-white' : 'bg-purple-100 text-purple-700',
    navInactive: isDarkMode ? 'text-gray-400 hover:bg-white/5 hover:text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900',
    divider: isDarkMode ? 'border-white/5' : 'border-slate-200',
    mutedText: isDarkMode ? 'text-gray-400' : 'text-slate-500'
  };

  return (
    <div className={`flex min-h-screen transition-colors duration-300 ${theme.bg} ${theme.text}`}>
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full w-64 border-r backdrop-blur-xl transition-all ${theme.sidebar}`}>
        <div className={`flex h-16 items-center flex-col justify-center border-b px-6 ${theme.divider}`}>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-purple-500" />
            <span className={`font-bold tracking-tight text-sm uppercase ${theme.text}`}>
              {siteSlug} ADMIN
            </span>
          </div>
        </div>
        
        <nav className="p-4 space-y-2">
          {tabs.map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all ${
                activeTab === tab.id ? theme.navActive : theme.navInactive
              }`}
            >
              <tab.icon className={`h-5 w-5 ${activeTab === tab.id ? 'text-purple-400' : 'text-gray-500'}`} />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-4 w-full px-4 space-y-2">
            {/* Theme Toggle */}
            <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                  isDarkMode ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-500 hover:text-black hover:bg-gray-100'
                }`}
            >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                {isDarkMode ? '라이트 모드' : '다크 모드'}
            </button>
            <button 
                onClick={() => { logout(); router.push('/'); }}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                    isDarkMode ? 'text-gray-500 hover:text-red-400 hover:bg-red-400/5' : 'text-slate-500 hover:text-red-600 hover:bg-red-50'
                }`}
            >
                <LogOut className="h-5 w-5" />
                로그아웃
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-8">
        <header className="mb-12 flex justify-between items-start">
          <div>
            <h1 className={`text-3xl font-bold mb-2 ${theme.text}`}>
                {tabs.find(t => t.id === activeTab)?.label}
            </h1>
            <p className={theme.mutedText}>
                {siteSlug} 사이트의 전용 관리 환경입니다.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
             <button className={`relative p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-100'}`}>
               <Bell className={`h-5 w-5 ${theme.mutedText}`} />
               {inquiries.filter(i => i.status === 'pending').length > 0 && (
                 <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full animate-pulse" />
               )}
             </button>
             <div className={`h-8 w-px mx-2 ${theme.divider}`} />
             <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-purple-500/20 border border-purple-500/50 flex items-center justify-center font-bold text-purple-500">
                   {siteSlug[0].toUpperCase()}
                </div>
                <div className="text-left hidden sm:block">
                   <div className={`text-sm font-bold uppercase ${theme.text}`}>{siteSlug}</div>
                   <div className="text-[10px] text-gray-500">Site Management</div>
                </div>
             </div>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className={`${theme.card} p-6 rounded-3xl border`}>
                    <div className={`${theme.mutedText} text-xs font-bold uppercase mb-2`}>가입 팬 수</div>
                    <div className={`text-3xl font-bold ${theme.text}`}>{totalFans.toLocaleString()}명</div>
                </div>
                <div className={`${theme.card} p-6 rounded-3xl border`}>
                    <div className={`${theme.mutedText} text-xs font-bold uppercase mb-2`}>하위 사이트</div>
                    <div className={`text-3xl font-bold ${theme.text}`}>{totalSubSites}개</div>
                </div>
                <div className={`${theme.card} p-6 rounded-3xl border`}>
                    <div className={`${theme.mutedText} text-xs font-bold uppercase mb-2`}>대기 중인 문의</div>
                    <div className="text-3xl font-bold text-orange-400">
                        {inquiries.filter(i => i.status === 'pending').length}건
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className={`${theme.card} rounded-3xl border p-6`}>
                    <h3 className={`text-lg font-bold mb-6 flex items-center gap-2 ${theme.text}`}>
                        <Globe className="h-5 w-5 text-blue-400" />
                        사이트 구조
                    </h3>
                    <SiteTreeView userRole="owner" currentSubdomain={siteSlug} isDarkMode={isDarkMode} />
                </div>
                <div className={`${theme.card} rounded-3xl border p-6`}>
                    <h3 className={`text-lg font-bold mb-6 flex items-center gap-2 ${theme.text}`}>
                        <MessageSquare className="h-5 w-5 text-purple-400" />
                        최근 문의
                    </h3>
                    <div className="space-y-3">
                        {inquiries.slice(0, 5).map(inq => (
                            <div key={inq.id} className={`p-4 rounded-xl border flex items-center justify-between ${theme.itemBg}`}>
                                <div>
                                    <div className={`font-bold text-sm ${theme.text}`}>{inq.name}</div>
                                    <div className={`text-xs truncate max-w-[200px] ${theme.mutedText}`}>{(inq as any).subject || inq.message}</div>
                                </div>
                                <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                                    inq.status === 'pending' ? 'bg-orange-500/20 text-orange-400' : 'bg-green-500/20 text-green-400'
                                }`}>
                                    {inq.status === 'pending' ? '대기' : '완료'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
          </div>
        )}

        {activeTab === 'builder' && (
          <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">
            <div className="border-b border-gray-100 px-8 py-4 bg-gray-50 flex items-center justify-between">
              <h2 className="font-bold text-gray-900 flex items-center gap-2">
                <Palette className="h-4 w-4 text-purple-500" />
                메인 콘텐츠 편집
              </h2>
            </div>
            <div className="p-8">
              <DesignEditor subdomain={siteSlug} />
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <UsersTab isDarkMode={isDarkMode} influencerId={siteSlug} />
        )}

        {activeTab === 'inquiries' && (
          <InquiriesTab inquiries={inquiries} isDarkMode={isDarkMode} onSelectInquiry={() => {}} />
        ) /* Tab Contents End */}

        {activeTab === 'settings' && (
           <div className={`${theme.card} rounded-3xl border p-12 text-center`}>
              <Settings className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <h3 className={`text-xl font-bold mb-2 ${theme.text}`}>사이트 설정</h3>
              <p className={theme.mutedText}>기본 정보 및 도메인 설정 준비 중입니다.</p>
           </div>
        )}
      </main>
    </div>
  );
}
