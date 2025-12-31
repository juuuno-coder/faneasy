'use client';


import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebaseClient';
import { collection, query, orderBy, onSnapshot, where, doc, getDoc, writeBatch, getDocs, setDoc } from 'firebase/firestore';
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
  Sun,
  Moon,
  CreditCard,
  Bell,
  Bot,
  Menu,
  X,
  Palette
} from 'lucide-react';
import Link from 'next/link';
import ProfileModal from '@/components/profile-modal';
import PageBuilder from '@/components/admin/page-builder';
import CustomersTab from '@/components/admin/customers-tab';
import InquiriesTab from '@/components/admin/inquiries-tab';
import SettingsTab from '@/components/admin/settings-tab';
import ActivityTab from '@/components/admin/activity-tab';
import UsersTab from '@/components/admin/users-tab';
import SubscriptionTab from '@/components/admin/subscription-tab';
import SiteTreeView from '@/components/admin/site-tree-view';
import InquiryManagementModal from '@/components/admin/inquiry-management-modal';
import AnalyticsCharts from '@/components/admin/analytics-charts';
import type { SiteNode } from '@/lib/types';
import { logActivity } from '@/lib/activity-logger';
import { toast } from 'react-hot-toast';
import { Copy } from 'lucide-react';

export default function AdminDashboard() {
  const { user, logout, updateUser } = useAuthStore();
  const router = useRouter();


  const [mounted, setMounted] = useState(false);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'structure' | 'builder' | 'customers' | 'inquiries' | 'settings' | 'activity' | 'subscription' | 'users'>('dashboard');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const [users, setUsers] = useState<any[]>([]);
  const [sites, setSites] = useState<SiteNode[]>([]);
  const [stats, setStats] = useState({
    totalVisits: 0,
    todayVisits: 0,
    totalSites: 0,
    totalFans: 0,
    chartData: [] as any[]
  });
  
  const [siteTitle, setSiteTitle] = useState('');

  useEffect(() => {
    if (!user) return;
    const fetchSiteTitle = async () => {
        if (user.role === 'super_admin') {
            setSiteTitle('DUS ADMIN');
            return;
        }

        try {
            const docId = user.subdomain || (user.email === 'kgw2642@gmail.com' ? 'kkang' : user.id);
            const settingRef = doc(db, 'site_settings', docId);
            const settingSnap = await getDoc(settingRef);
            
            if (settingSnap.exists()) {
                const data = settingSnap.data();
                // If siteName is "Kkang" -> "KKANG ADMIN"
                // If siteName is "나만의 팬페이지" -> "나만의 팬페이지 ADMIN" (maybe english is better, but user asked for DB site name)
                if (data.siteName) {
                    // Check if siteName is English-like to uppercase, or just use as is? 
                    // User example: "KKANG ADMIN". Likely they want the site name.
                    // If the site Name is just "Kkang", we can uppercase it.
                    // Let's try to just use the siteName + " ADMIN" and uppercase if it looks like a simple id/name.
                    // For now, let's Uppercase it to match style.
                    setSiteTitle(`${data.siteName.toUpperCase()} ADMIN`);
                } else {
                    setSiteTitle(`${(user.subdomain || 'FANEASY').toUpperCase()} ADMIN`);
                }
            } else {
                 setSiteTitle(`${(user.subdomain || 'FANEASY').toUpperCase()} ADMIN`);
            }
        } catch (e) {
            console.error(e);
            setSiteTitle('FANEASY ADMIN');
        }
    };
    fetchSiteTitle();
  }, [user]);
  
  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Fetch Visit Stats & Calculate Chart Data
  useEffect(() => {
    const fetchAndCalculate = async () => {
      if (!mounted || !user) return;
      
      const docId = user.subdomain || (user.email === 'kgw2642@gmail.com' ? 'kkang' : user.id);
      const isSuperAdmin = user.role === 'super_admin' || user.email === 'designd@designd.co.kr';
      const today = new Date().toISOString().split('T')[0];
      const sevenDays = [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toISOString().split('T')[0];
      }).reverse();

      let totalV = 0;
      let todayV = 0;
      const visitsMap: Record<string, number> = {};

      try {
        if (isSuperAdmin) {
           // Super Admin: Aggregate Top Sites or Platform General Stats
           // For now, let's fetch the 'platform' stats or sum up top 5 sites
           const platformSnap = await getDoc(doc(db, 'site_stats', 'platform'));
           if (platformSnap.exists()) {
             totalV = platformSnap.data().totalVisits || 0;
             todayV = platformSnap.data().todayVisits || 0;
           }
           
           // Fetch daily stats for platform
           await Promise.all(sevenDays.map(async (date) => {
             const dRef = doc(db, 'site_stats', 'platform', 'daily_stats', date);
             const snap = await getDoc(dRef);
             visitsMap[date] = snap.exists() ? snap.data().visits || 0 : 0;
           }));
        } else {
           // Site Owner: Fetch site-specific
           const statsRef = doc(db, 'site_stats', docId);
           const statsSnap = await getDoc(statsRef);
           if (statsSnap.exists()) totalV = statsSnap.data().totalVisits || 0;

           await Promise.all(sevenDays.map(async (date) => {
             const dRef = doc(db, 'site_stats', docId, 'daily_stats', date);
             const snap = await getDoc(dRef);
             visitsMap[date] = snap.exists() ? snap.data().visits || 0 : 0;
           }));
           todayV = visitsMap[today] || 0;
        }
      } catch (e) {
        console.error("Stats fetch error:", e);
      }

      // Process Inquiries
      const inquiryMap: Record<string, number> = {};
      inquiries.forEach(inq => {
        let dKey = '';
        if ((inq as any).createdAt?.toDate) dKey = (inq as any).createdAt.toDate().toISOString().split('T')[0];
        else if (typeof inq.createdAt === 'string') dKey = (inq.createdAt as string).split('T')[0];
        if (dKey) inquiryMap[dKey] = (inquiryMap[dKey] || 0) + 1;
      });

      const newChartData = sevenDays.map(date => ({
        name: date.slice(5),
        visitors: visitsMap[date] || 0,
        inquiries: inquiryMap[date] || 0
      }));

      // Counts
      let tSites = 0;
      let tFans = 0;
      if (!isSuperAdmin) {
        const subdomain = user.subdomain || docId;
        const qSites = query(collection(db, 'sites'), where('parentSiteId', '==', subdomain));
        const sitesSnap = await getDocs(qSites);
        tSites = sitesSnap.docs.length;

        const qFans = query(collection(db, 'users'), where('joinedInfluencerId', '==', subdomain));
        const fansSnap = await getDocs(qFans);
        tFans = fansSnap.docs.length;
      } else {
        tSites = sites.length;
        tFans = users.length;
      }

      setStats({
        totalVisits: totalV,
        todayVisits: todayV,
        totalSites: tSites,
        totalFans: tFans,
        chartData: newChartData
      });
    };

    fetchAndCalculate();
  }, [user, inquiries, mounted, sites.length, users.length]);


  useEffect(() => {
    setMounted(true);
    
    // 1. One-time DB fix for specific user (Rename 깡대표 -> 디어스)
    const fixProfile = async () => {
        if (user?.email === 'kgw2642@gmail.com') {
            try {
                const userRef = doc(db, 'users', user.id);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists() && userSnap.data().name !== '디어스') {
                    await setDoc(userRef, { 
                        name: '디어스',
                        role: 'super_admin',
                        updatedAt: new Date() 
                    }, { merge: true });
                    // Also update local store immediately
                    updateUser({ name: '디어스', role: 'super_admin' });
                    console.log('Profile fixed: Renamed to 디어스');
                }
            } catch (err) {
                console.error("Profile fix error:", err);
            }
        }
    };
    if (mounted && user) fixProfile();

    // 2. 권한 체크
    if (mounted && user) {
      const allowedRoles = ['super_admin', 'owner', 'admin', 'user'];
      if (!allowedRoles.includes(user.role)) {
        toast.error('접근 권한이 없습니다.');
        router.push('/');
        return;
      }
    }
  }, [user, mounted, router]);

  // Real-time Firestore listener with role-based filtering
  useEffect(() => {
    if (!mounted || !user) return;

    // Build query based on user role
    let q;
    if (user.role === 'super_admin' || user.email === 'kgw2642@gmail.com') {
      // 최고관리자 및 깡대표는 모든 문의 조회
      q = query(
        collection(db, "inquiries"),
        orderBy("createdAt", "desc")
      );
    } else if (user.subdomain === 'bizon' || user.id === 'bizon') {
       // Bizon 관리자는 ownerId 대신 siteDomain으로 조회
        q = query(
        collection(db, "inquiries"),
        where("siteDomain", "==", "bizon")
        // orderBy("createdAt", "desc") // Removed to avoid index issues
      );
    } else {
      // owner, admin, user는 본인(또는 소속) 데이터만 조회
      // user(팬페이지 주인)도 본인의 문의/데이터만 봄
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
      
      // Client-side sort to ensure order even without index
      firestoreInquiries.sort((a, b) => {
        const dateA = new Date((a as any).createdAt?.toDate ? (a as any).createdAt.toDate() : a.createdAt);
        const dateB = new Date((b as any).createdAt?.toDate ? (b as any).createdAt.toDate() : b.createdAt);
        return dateB.getTime() - dateA.getTime();
      });
      
      if (firestoreInquiries.length > 0) {
        setInquiries(firestoreInquiries);
      } else {
        setInquiries([]);
      }
    }, (error) => {
      console.error("Firestore listener error:", error);
      setInquiries([]);
    });

    return () => unsubscribe();
  }, [mounted]);

  // Real-time Users & Sites listener for analytics
  useEffect(() => {
    if (!mounted || !user) return;

    // Fetch Users
    const qUsers = user.role === 'super_admin' 
        ? query(collection(db, 'users'))
        : query(collection(db, 'users'), where('joinedInfluencerId', '==', user.subdomain || user.id));
    
    const unsubUsers = onSnapshot(qUsers, (snap) => {
        setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    // Fetch Sites
    const qSites = user.role === 'super_admin'
        ? query(collection(db, 'sites'))
        : query(collection(db, 'sites'), where('parentSiteId', '==', user.subdomain || user.id));
    
    const unsubSites = onSnapshot(qSites, (snap) => {
        setSites(snap.docs.map(d => ({ id: d.id, ...d.data() } as SiteNode)));
    });

    return () => {
        unsubUsers();
        unsubSites();
    };
  }, [mounted, user]);

  // Theme Configuration
  const role = user?.role || 'user';
  const isDark = isDarkMode; // Use dynamic state instead of static check

  const theme = {
    bg: isDark ? 'bg-[#0A0A0B]' : role === 'super_admin' ? 'bg-linear-to-br from-indigo-50 via-white to-purple-50' : 'bg-gray-50',
    text: isDark ? 'text-white' : 'text-slate-900',
    sidebar: isDark ? 'bg-black/50 border-white/5' : role === 'super_admin' ? 'bg-white/40 backdrop-blur-xl border-white/20 shadow-2xl z-50' : 'bg-white border-slate-200',
    divider: isDark ? 'border-white/5' : 'border-slate-200',
    navActive: isDark ? 'bg-white/10 text-white' : 'bg-purple-100 text-purple-700 shadow-sm',
    navInactive: isDark ? 'text-gray-400 hover:bg-white/5 hover:text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900',
    iconActive: isDark ? 'text-white' : 'text-purple-600',
    iconInactive: isDark ? 'text-gray-400' : 'text-slate-400',
    card: isDark ? 'rounded-3xl border border-white/5 bg-white/5 hover:bg-white/10' : 'rounded-3xl border border-gray-200 bg-white shadow-sm hover:shadow-md hover:border-purple-200',
    chartGrid: isDark ? 'rgba(255,255,255,0.1)' : '#E5E7EB',
    tooltipBg: isDark ? '#1A1A1A' : '#FFFFFF',
    tooltipBorder: isDark ? '#333' : '#E5E7EB',
    tooltipText: isDark ? '#FFF' : '#111827',
    itemBg: isDark ? 'border border-white/5 bg-black/20 hover:bg-white/5' : 'border border-gray-100 bg-gray-50 hover:bg-white hover:border-purple-200 hover:shadow-sm',
  };

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
    <div className={`flex min-h-screen font-sans ${theme.bg} ${theme.text}`}>
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full w-64 border-r backdrop-blur-xl transition-colors duration-300 ${theme.sidebar} ${theme.divider}`}>
        <div className={`flex h-16 items-center flex-col justify-center border-b px-6 ${theme.divider}`}>
          <div className="flex items-center gap-2">
            <Shield className={`h-5 w-5 ${theme.iconActive}`} />
            <span className={`font-bold tracking-tight ${theme.text}`}>
              {siteTitle || 'LOADING...'}
            </span>
          </div>
        </div>
        
        <nav className="p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all ${
              activeTab === 'dashboard' ? theme.navActive : theme.navInactive
            }`}
          >
            <LayoutDashboard className={`h-5 w-5 ${activeTab === 'dashboard' ? theme.iconActive : theme.iconInactive}`} />
            대시보드
          </button>
          <button 
            onClick={() => setActiveTab('structure')}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
              activeTab === 'structure' ? theme.navActive : theme.navInactive
            }`}
          >
            <Globe className={`h-5 w-5 ${activeTab === 'structure' ? theme.iconActive : theme.iconInactive}`} />
            사이트 개설 현황
          </button>
          <button 
            onClick={() => setActiveTab('builder')}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
              activeTab === 'builder' ? theme.navActive : theme.navInactive
            }`}
          >
            <Palette className={`h-5 w-5 ${activeTab === 'builder' ? theme.iconActive : theme.iconInactive}`} />
            페이지 디자인
          </button>
          <button 
            onClick={() => setActiveTab('customers')}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
              activeTab === 'customers' ? theme.navActive : theme.navInactive
            }`}
          >
            <Users className={`h-5 w-5 ${activeTab === 'customers' ? theme.iconActive : theme.iconInactive}`} />
            고객 관리
          </button>
          <button 
            onClick={() => setActiveTab('inquiries')}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
              activeTab === 'inquiries' ? theme.navActive : theme.navInactive
            }`}
          >
            <MessageSquare className={`h-5 w-5 ${activeTab === 'inquiries' ? theme.iconActive : theme.iconInactive}`} />
            문의 내역
          </button>
          <button 
            onClick={() => { setActiveTab('subscription'); setShowMobileMenu(false); }}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
              activeTab === 'subscription' ? theme.navActive : theme.navInactive
            }`}
          >
            <CreditCard className={`h-5 w-5 ${activeTab === 'subscription' ? theme.iconActive : theme.iconInactive}`} />
            구독 관리
          </button>
          <button 
            onClick={() => { setActiveTab('activity'); setShowMobileMenu(false); }}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
              activeTab === 'activity' ? theme.navActive : theme.navInactive
            }`}
          >
            <Clock className={`h-5 w-5 ${activeTab === 'activity' ? theme.iconActive : theme.iconInactive}`} />
            활동 로그
          </button>
          
          {/* User Management (Super Admin Only) */}
          {user?.role === 'super_admin' && (
            <button 
              onClick={() => { setActiveTab('users'); setShowMobileMenu(false); }}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                activeTab === 'users' ? theme.navActive : theme.navInactive
              }`}
            >
              <Users className={`h-5 w-5 ${activeTab === 'users' ? theme.iconActive : theme.iconInactive}`} />
              사용자 관리
            </button>
          )}

          <button 
            onClick={() => { setActiveTab('settings'); setShowMobileMenu(false); }}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
              activeTab === 'settings' ? theme.navActive : theme.navInactive
            }`}
          >
            <Settings className={`h-5 w-5 ${activeTab === 'settings' ? theme.iconActive : theme.iconInactive}`} />
            사이트 설정
          </button>
        </nav>

        <div className="absolute bottom-4 w-full px-4">
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
              <h1 className={`text-3xl font-bold ${theme.text}`}>
                {activeTab === 'dashboard' && '대시보드'}
                {activeTab === 'structure' && '사이트 개설 현황'}
                {activeTab === 'builder' && '페이지 디자인'}
                {activeTab === 'customers' && '고객 관리'}
                {activeTab === 'inquiries' && '문의 내역'}
                {activeTab === 'settings' && '사이트 설정'}
                {activeTab === 'subscription' && '구독 관리'}
                {activeTab === 'activity' && '활동 로그'}
                {activeTab === 'users' && '사용자 관리'}
              </h1>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                isDark 
                  ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' 
                  : 'bg-purple-100 text-purple-700 border-purple-200'
              }`}>
                {user?.role === 'user' && '일반 회원'}
              </span>
              <button 
                  onClick={() => {
                      const url = user?.role === 'super_admin' ? 'https://faneasy.kr' : `https://${user?.subdomain}.faneasy.kr`;
                      navigator.clipboard.writeText(url);
                      toast.success('주소가 복사되었습니다.');
                  }}
                  className={`p-1.5 rounded-md transition-all ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
                  title="사이트 주소 복사"
              >
                  <Copy className="h-4 w-4 text-purple-400" />
              </button>
            </div>
            <p className="text-gray-400 text-sm mt-1">
              {activeTab === 'dashboard' && '실시간 문의 현황 및 통계를 확인하세요.'}
              {activeTab === 'structure' && '계열사 및 하위 사이트의 개설 상태와 관리 구조를 확인하세요.'}
              {activeTab === 'builder' && '블록을 배치하여 나만의 사이트를 디자인하세요.'}
              {activeTab === 'customers' && '고객 정보를 관리하고 분석하세요.'}
              {activeTab === 'inquiries' && '모든 문의 내역을 확인하고 관리하세요.'}
              {activeTab === 'settings' && '사이트 설정을 변경하고 최적화하세요.'}
              {activeTab === 'subscription' && '요금제를 관리하고 결제 내역을 확인하세요.'}
              {activeTab === 'activity' && '관리자 활동 및 보안 로그를 확인하세요.'}
            </p>
            </div>
          </div>
          <div className="flex items-center gap-4">

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
             
             <div className="h-8 w-px bg-white/10 mx-2" />
             
             {/* Profile Info - Clickable User Area */}
             <button 
               onClick={() => setShowProfileModal(true)}
               className="flex items-center gap-3 group transition-all"
             >
                <div className="h-10 w-10 rounded-full bg-purple-500/20 border border-purple-500/50 flex items-center justify-center font-bold text-purple-500 group-hover:scale-110 transition-transform">
                   {user?.name?.[0] || 'A'}
                </div>
                <div className="text-left hidden sm:block">
                   <div className="text-sm font-bold group-hover:text-purple-400 transition-colors">{user?.name || 'Admin'}</div>
                   <div className="text-[10px] text-gray-500">{user?.email}</div>
                </div>
             </button>

             <div className="h-8 w-px bg-white/10 mx-2" />

             {/* Logout Button */}
             <button 
               onClick={() => { logout(); router.push('/'); }}
               className="p-2 text-gray-400 hover:text-red-400 transition-all hover:scale-110"
               title="로그아웃"
             >
               <LogOut className="h-5 w-5" />
             </button>
          </div>
          </div>
        </header>

        {/* Dashboard Tab Content */}
        {activeTab === 'dashboard' && (
          <>
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4 mb-12">
          {user?.role === 'super_admin' ? (
            // Super Admin Stats (Global)
            [
              { label: '전체 문의', value: inquiries.length, icon: MessageSquare, color: 'blue' },
              { label: '오늘 방문자', value: stats.todayVisits.toLocaleString(), icon: Globe, color: 'green' },
              { label: '누적 방문자', value: stats.totalVisits.toLocaleString(), icon: Users, color: 'amber' },
              { label: '문의 전환율', value: stats.totalVisits > 0 ? ((inquiries.length / stats.totalVisits) * 100).toFixed(1) + '%' : '0%', icon: CheckCircle2, color: 'purple' },
            ].map((stat, i) => (
                <StatCard key={i} stat={stat} theme={theme} isDark={isDark} />
            ))
          ) : (
            // Influencer/Owner Stats (Network)
            [
              { label: '제작한 사이트 현황', value: stats.totalSites, icon: Globe, color: 'blue' },
              { label: '고객 회원', value: stats.totalFans.toLocaleString(), icon: Users, color: 'green' },
              { label: '문의내역', value: inquiries.length, icon: MessageSquare, color: 'amber' },
              { label: '문의 전환율', value: stats.totalVisits > 0 ? ((inquiries.length / stats.totalVisits) * 100).toFixed(1) + '%' : '0%', icon: CheckCircle2, color: 'purple' },
            ].map((stat, i) => (
                <StatCard key={i} stat={stat} theme={theme} isDark={isDark} />
            ))
          )}
        </div>

        {/* Analytics Charts Section */}
        <div className="mb-12">
           <AnalyticsCharts users={users} sites={sites} isDarkMode={isDarkMode} chartData={stats.chartData} />
        </div>

        {/* Recent Inquiries Section */}
        <div id="inquiries-section" className={`${theme.card} p-8`}>
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
                  className={`group flex items-center justify-between rounded-2xl p-4 transition-all cursor-pointer ${theme.itemBg}`}>
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
                       <div className="text-sm font-medium text-gray-300">
                         {/* Traffic Control: Show Site Origin for Super Admins */}
                         {user?.role === 'super_admin' && (inquiry as any).siteDomain && (
                           <span className={`inline-block mr-2 px-1.5 py-0.5 rounded text-[10px] uppercase font-black tracking-wider ${
                             (inquiry as any).siteDomain === 'bizon' 
                               ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                               : 'bg-gray-700 text-gray-400 border border-gray-600'
                           }`}>
                             {(inquiry as any).siteDomain}
                           </span>
                         )}
                         {(inquiry as any).plan || '프로젝트 문의'}
                       </div>
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
            userRole={user?.role || 'user'} 
            currentSubdomain={user?.subdomain || (user?.role === 'super_admin' ? 'kkang' : 'faneasy')}
            isDarkMode={isDarkMode}
          />
        )}

        {/* Page Builder Tab Content */}
        {activeTab === 'builder' && (
          <PageBuilder 
            subdomain={user?.subdomain || (user?.role === 'super_admin' ? 'kkang' : user?.id || 'temp')} 
            isDarkMode={isDark}
          />
        )}

        {/* Customers Tab Content */}
        {activeTab === 'customers' && <CustomersTab inquiries={inquiries} sites={sites} users={users} isDarkMode={isDark} />}

        {/* Inquiries Tab Content */}
        {activeTab === 'inquiries' && (
          <InquiriesTab 
            inquiries={inquiries} 
            onSelectInquiry={setSelectedInquiry}
            isDarkMode={isDark}
          />
        )}

        {/* Settings Tab Content */}
        {activeTab === 'settings' && <SettingsTab isDarkMode={isDark} />}
        {/* Subscription Tab Content */}
        {activeTab === 'subscription' && <SubscriptionTab isDarkMode={isDark} />}
        {activeTab === 'activity' && <ActivityTab isDarkMode={isDark} />}
        {activeTab === 'users' && <UsersTab isDarkMode={isDark} />}


        {/* Inquiry Management Modal */}
        {selectedInquiry && (
          <InquiryManagementModal
            inquiry={selectedInquiry}
            onClose={() => setSelectedInquiry(null)}
            onUpdate={(updated) => {
              // Update local state
              setInquiries(prev => prev.map(inq => 
                inq.id === updated.id ? updated : inq
              ));
              setSelectedInquiry(updated);
            }}
            isDarkMode={isDarkMode}
          />
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
                      toast.error('메시지를 입력해주세요.');
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
                        toast.success('답장이 성공적으로 발송되었습니다!');
                        
                        // Log Activity
                        logActivity({
                            userId: user?.id || 'unknown',
                            userName: user?.name,
                            userEmail: user?.email,
                            userRole: user?.role,
                            subdomain: user?.subdomain || 'kkang',
                            action: '문의 답장 발송',
                            target: selectedInquiry.email,
                            type: 'reply',
                            details: { inquiryId: selectedInquiry.id, subject: `[FanEasy] ${selectedInquiry.name}님의 문의에 대한 답변입니다.` }
                        });

                        setShowReplyModal(false);
                        setReplyMessage('');
                        setSelectedInquiry(null);
                      } else {
                        throw new Error('Failed to send reply');
                      }
                    } catch (error) {
                      console.error('Reply error:', error);
                      toast.error('답장 발송에 실패했습니다. 다시 시도해주세요.');
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
          onSave={async (data) => {
            // 1. Update Firestore User Doc (Permanently save name)
            if (user?.id) {
                try {
                    await setDoc(doc(db, 'users', user.id), {
                        name: data.name,
                        email: data.email
                    }, { merge: true });
                } catch (e) {
                    console.error("DB Save Fail:", e);
                    throw e; // Let ProfileModal handle the error toast
                }
            }

            // 2. Update Local Store (Immediate UI update)
            await updateUser(data);
            setProfileData(data);

            // Log Activity
            logActivity({
                userId: user?.id || 'unknown',
                userName: data.name,
                userEmail: data.email,
                userRole: user?.role,
                subdomain: user?.subdomain || 'kkang',
                action: '프로필 정보 변경',
                target: '본인 계정',
                type: 'update', // or security
                details: { oldName: user?.name, newName: data.name }
            });

            // 3. Batch update Inquiries to sync name/email
            try {
                if (!user?.id) return;
                
                const batch = writeBatch(db);
                const q = query(
                    collection(db, 'inquiries'), 
                    where('ownerId', '==', user.id)
                );
                const snapshot = await getDocs(q);
                
                if (!snapshot.empty) {
                    snapshot.forEach((doc) => {
                        batch.update(doc.ref, { 
                            name: data.name,
                            email: data.email,
                        });
                    });
                    await batch.commit();
                    console.log('Inquiries updated with new profile info');
                }
            } catch (error) {
                console.error("Failed to sync profile to inquiries:", error);
            }
          }}
        />
      </main>
    </div>
  );
}

// Helper components for streamlined UI
function StatCard({ stat, theme, isDark }: { stat: any, theme: any, isDark: boolean }) {
    return (
        <div className={`${theme.card} p-6 text-left transition-all border shadow-sm`}>
            <div className="flex items-center justify-between mb-4">
                <div className={`rounded-xl bg-${stat.color}-500/10 p-2 text-${stat.color}-500`}>
                    <stat.icon className="h-5 w-5" />
                </div>
            </div>
            <div className={`text-3xl font-bold mb-1 ${theme.text}`}>{stat.value}</div>
            <div className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-slate-500'}`}>
                {stat.label}
            </div>
        </div>
    );
}
