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
  Sun,
  Moon,
  Clock,
  Copy,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import ProfileModal from '@/components/profile-modal';
import PageBuilder from '@/components/admin/page-builder';
import SiteTreeView from '@/components/admin/site-tree-view';
import InquiriesTab from '@/components/admin/inquiries-tab';
import UsersTab from '@/components/admin/users-tab';
import ActivityTab from '@/components/admin/activity-tab';
import SettingsTab from '@/components/admin/settings-tab';
import InquiryManagementModal from '@/components/admin/inquiry-management-modal';
import AnalyticsCharts from '@/components/admin/analytics-charts';
import { toast } from 'react-hot-toast';
import type { Inquiry, SiteNode } from '@/lib/types';

export default function SiteAdminPage({
  params,
}: {
  params: Promise<{ site: string }>;
}) {
  const { site } = use(params);
  const siteSlug = site.toLowerCase().trim();
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'builder' | 'users' | 'inquiries' | 'activity' | 'settings'>('dashboard');
  const [mounted, setMounted] = useState(false);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [sites, setSites] = useState<SiteNode[]>([]);
  const [totalFans, setTotalFans] = useState(0);
  const [totalSubSites, setTotalSubSites] = useState(0);
  const [totalVisits, setTotalVisits] = useState(0);
  const [todayVisits, setTodayVisits] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [chartData, setChartData] = useState<any[]>([]);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [siteTitle, setSiteTitle] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !siteSlug) return;
    
    const fetchSiteTitle = async () => {
        try {
            const settingRef = doc(db, 'site_settings', siteSlug);
            const settingSnap = await getDoc(settingRef);
            if (settingSnap.exists() && settingSnap.data().siteName) {
                setSiteTitle(`${settingSnap.data().siteName.toUpperCase()} ADMIN`);
            } else {
                setSiteTitle(`${siteSlug.toUpperCase()} ADMIN`);
            }
        } catch (e) {
            setSiteTitle(`${siteSlug.toUpperCase()} ADMIN`);
        }
    };
    fetchSiteTitle();
  }, [mounted, siteSlug]);

  // Auth & RBAC Protection
  useEffect(() => {
    if (!mounted) return;

    if (!user) {
      toast.error('로그인이 필요합니다.');
      router.push('/login');
      return;
    }

    // RBAC: Allow Super Admin OR Site Owner
    const isSuperAdmin = user.role === 'super_admin' || user.email === 'designd@designd.co.kr'; // fallback check
    const isSiteOwner = user.subdomain === siteSlug || user.id === siteSlug || (user.role === 'owner' && user.subdomain === siteSlug);

    if (!isSuperAdmin && !isSiteOwner) {
       toast.error('접근 권한이 없습니다.');
       router.push('/');
    }
  }, [mounted, user, router, siteSlug]);

  // Fetch Site specific data
  useEffect(() => {
    if (!mounted || !siteSlug) return;

    // 1. Inquiries for this site (Fixed: siteDomain & remove orderBy)
    const qInq = query(
        collection(db, 'inquiries'),
        where('siteDomain', '==', siteSlug)
    );
    const unsubInq = onSnapshot(qInq, (snap) => {
        const fetched = snap.docs.map(d => ({ 
            id: d.id, 
            ...d.data(),
            createdAt: d.data().createdAt || new Date().toISOString()
        } as Inquiry));
        
        // Client-side Sort
        fetched.sort((a, b) => {
             const dateA = new Date((a as any).createdAt?.toDate ? (a as any).createdAt.toDate() : a.createdAt);
             const dateB = new Date((b as any).createdAt?.toDate ? (b as any).createdAt.toDate() : b.createdAt);
             return dateB.getTime() - dateA.getTime();
        });
        setInquiries(fetched);
    });

    // 2. Fans who joined this site
    const qFans = query(collection(db, 'users'), where('joinedSite', '==', siteSlug));
    const unsubFans = onSnapshot(qFans, (snap) => setTotalFans(snap.docs.length));

    // 3. Sub-sites of this site
    const qSitesList = query(collection(db, 'sites'), where('parentSiteId', '==', siteSlug));
    const unsubSites = onSnapshot(qSitesList, (snap) => {
        const fetchedSites = snap.docs.map(d => ({ id: d.id, ...d.data() } as SiteNode));
        setSites(fetchedSites);
        setTotalSubSites(fetchedSites.length);
    });

    // 4. Detailed Users list for charts
    const qUsersList = query(collection(db, 'users'), where('joinedInfluencerId', '==', siteSlug));
    const unsubUsers = onSnapshot(qUsersList, (snap) => {
        setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        setTotalFans(snap.docs.length);
    });

    // 5. Fetch Visitor Stats (Unified)
    const fetchStats = async () => {
        try {
            const today = new Date().toISOString().split('T')[0];
            
            // Fetch Total
            const statsRef = doc(db, 'site_stats', siteSlug);
            const statsSnap = await getDoc(statsRef);
            if (statsSnap.exists()) setTotalVisits(statsSnap.data().totalVisits || 0);

            // Fetch Today
            const todayRef = doc(db, 'site_stats', siteSlug, 'daily_stats', today);
            const todaySnap = await getDoc(todayRef);
            if (todaySnap.exists()) setTodayVisits(todaySnap.data().visits || 0);
        } catch (e) {
            console.error(e);
        }
    };
    fetchStats();

    return () => {
        unsubInq();
        unsubFans();
        unsubSites();
        unsubUsers();
    };
  }, [mounted, siteSlug]);

  // Chart Data Calculation Effect
  useEffect(() => {
      if (!mounted || !siteSlug) return;
      
      const calculateChart = async () => {
          // 1. Fetch Daily Visits (Last 7 Days)
          const sevenDays: string[] = [...Array(7)].map((_, i) => {
              const d = new Date();
              d.setDate(d.getDate() - i);
              return d.toISOString().split('T')[0];
          }).reverse();

          const visitsMap: Record<string, number> = {};
          
          // Parallel fetch for 7 days (Optimization: Maybe query range if possible, but subcollections don't support range query easily without Collection Group)
          // For < 10 docs, parallel getDoc is fine.
          await Promise.all(sevenDays.map(async (date) => {
              const dRef = doc(db, 'site_stats', siteSlug, 'daily_stats', date);
              const snap = await getDoc(dRef);
              visitsMap[date] = snap.exists() ? snap.data().visits || 0 : 0;
          }));

          // 2. Map Inquiries
          const inquiryMap: Record<string, number> = {};
          inquiries.forEach(inq => {
              let dKey = '';
              const created = inq.createdAt as any;
              
              if(created?.toDate) {
                  dKey = created.toDate().toISOString().split('T')[0];
              } else if(typeof created === 'string') {
                  dKey = created.split('T')[0];
              } else if(created instanceof Date) {
                  dKey = created.toISOString().split('T')[0];
              }
              
              if(dKey) inquiryMap[dKey] = (inquiryMap[dKey] || 0) + 1;
          });

          // 3. Merge
          const merged = sevenDays.map(date => ({
              name: date.slice(5),
              visitors: visitsMap[date] || 0,
              inquiries: inquiryMap[date] || 0
          }));
          
          setChartData(merged);
      };
      
      calculateChart();
  }, [inquiries, siteSlug, mounted]);

  if (!mounted) return null;

  const tabs = [
    { id: 'dashboard', label: '대시보드', icon: LayoutDashboard },
    { id: 'builder', label: '디자인 편집', icon: Palette },
    { id: 'users', label: '팬 관리', icon: Users },
    { id: 'inquiries', label: '문의 내역', icon: MessageSquare },
    { id: 'activity', label: '활동 로그', icon: Clock },
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
              {siteTitle || `${siteSlug.toUpperCase()} ADMIN`}
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
                <button 
                  onClick={() => setShowProfileModal(true)}
                  className="h-10 w-10 rounded-full bg-purple-500/20 border border-purple-500/50 flex items-center justify-center font-bold text-purple-500 hover:scale-105 transition-transform"
                >
                   {siteSlug[0].toUpperCase()}
                </button>
                <div className="text-left hidden sm:block">
                   <div className={`text-sm font-bold uppercase ${theme.text} flex items-center gap-2`}>
                       {siteSlug}
                       <button 
                           onClick={() => {
                               navigator.clipboard.writeText(`https://${siteSlug}.faneasy.kr`);
                               toast.success('주소가 복사되었습니다.');
                           }}
                           className={`p-1 rounded-md transition-all ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
                           title="사이트 주소 복사"
                       >
                           <Copy className="h-3 w-3 text-purple-400" />
                       </button>
                   </div>
                   <div className="text-[10px] text-gray-500">Site Management</div>
                </div>
             </div>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className={`${theme.card} p-6 rounded-3xl border`}>
                    <div className={`${theme.mutedText} text-[10px] font-bold uppercase mb-2`}>전체 문의</div>
                    <div className={`text-3xl font-bold ${theme.text}`}>{inquiries.length.toLocaleString()}건</div>
                </div>
                <div className={`${theme.card} p-6 rounded-3xl border`}>
                    <div className={`${theme.mutedText} text-[10px] font-bold uppercase mb-2`}>오늘 방문자</div>
                    <div className={`text-3xl font-bold ${theme.text}`}>{todayVisits.toLocaleString()}명</div>
                </div>
                <div className={`${theme.card} p-6 rounded-3xl border border-purple-500/20`}>
                    <div className={`${theme.mutedText} text-[10px] font-bold uppercase mb-2`}>누적 방문자</div>
                    <div className={`text-3xl font-bold ${theme.text}`}>{totalVisits.toLocaleString()}명</div>
                </div>
                <div className={`${theme.card} p-6 rounded-3xl border`}>
                    <div className={`${theme.mutedText} text-[10px] font-bold uppercase mb-2`}>문의 전환율</div>
                    <div className="text-3xl font-bold text-purple-400">
                        {totalVisits > 0 ? ((inquiries.length / totalVisits) * 100).toFixed(1) : '0'}%
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-80">
                <div className={`${theme.card} p-4 rounded-2xl border flex items-center justify-between`}>
                    <div className={`${theme.mutedText} text-xs font-bold`}>가입 팬 수</div>
                    <div className={`text-xl font-bold ${theme.text}`}>{totalFans.toLocaleString()}명</div>
                </div>
                <div className={`${theme.card} p-4 rounded-2xl border flex items-center justify-between`}>
                    <div className={`${theme.mutedText} text-xs font-bold`}>하위 사이트</div>
                    <div className={`text-xl font-bold ${theme.text}`}>{totalSubSites}개</div>
                </div>
            </div>

            {/* Analytics Charts */}
            <div className="mt-8">
                <AnalyticsCharts 
                    users={users} 
                    sites={sites} 
                    isDarkMode={isDarkMode} 
                    chartData={chartData}
                />
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
          <PageBuilder subdomain={siteSlug} isDarkMode={isDarkMode} />
        )}

        {activeTab === 'users' && (
          <UsersTab isDarkMode={isDarkMode} influencerId={siteSlug} />
        )}

        {activeTab === 'inquiries' && (
          <InquiriesTab 
            inquiries={inquiries} 
            isDarkMode={isDarkMode} 
            onSelectInquiry={setSelectedInquiry} 
          />
        )}

        {activeTab === 'activity' && (
          <ActivityTab isDarkMode={isDarkMode} />
        )}

        {activeTab === 'settings' && (
           <SettingsTab isDarkMode={isDarkMode} />
        )}

        {/* Inquiry Management Modal */}
        {selectedInquiry && (
          <InquiryManagementModal
            inquiry={selectedInquiry}
            isDarkMode={isDarkMode}
            onClose={() => setSelectedInquiry(null)}
            onUpdate={(updated) => {
              setInquiries(prev => prev.map(inq => 
                inq.id === updated.id ? updated : inq
              ));
              setSelectedInquiry(null);
            }}
          />
        )}

        {/* Profile Modal */}
        {showProfileModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
             <div className="bg-white rounded-2xl w-[400px] overflow-hidden">
                <ProfileModal 
                    isOpen={showProfileModal}
                    onClose={() => setShowProfileModal(false)}
                    user={user}
                    onSave={async (updated) => {
                      useAuthStore.getState().updateUser(updated);
                      setShowProfileModal(false);
                      toast.success('프로필이 업데이트되었습니다.');
                    }}
                />
             </div>
          </div>
        )}
      </main>
    </div>
  );
}
