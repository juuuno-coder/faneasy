import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  CreditCard, 
  Check, 
  Clock,
  ChevronRight,
  Download,
  AlertCircle
} from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { db } from '@/lib/firebaseClient';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';

interface Plan {
  id: string;
  name: string;
  price: number;
  period: string;
  features: string[];
  recommended?: boolean;
}

const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'FREE',
    price: 0,
    period: '월',
    features: [
      '초기세팅한 홈페이지 유지',
      '기본형 고객 DB 유지',
      '하단 배너 광고 삽입',
      '직접 이미지/문구 수정 불가'
    ]
  },
  {
    id: 'basic',
    name: 'BASIC',
    price: 22000,
    period: '월',
    features: [
      '타사 랜딩 페이지 수준 베이직 디자인',
      '기본형 DB 수집 폼',
      '반응형 웹 지원 (PC/모바일)',
      '도메인 연결 대행',
      '보안 서버(SSL) 적용',
      '직접 이미지/문구 수정 가능'
    ]
  },
  {
    id: 'pro',
    name: 'PRO',
    price: 33000,
    period: '월',
    recommended: true,
    features: [
      '모든 BASIC 기능 포함',
      '프리미엄 랜딩페이지 디자인',
      '고급형 DB 모집 섹션',
      '마케팅 효율 최적화 레이아웃',
      '카카오톡 알림톡 연동',
      '검색 엔진 최적화(SEO) 기본 세팅',
      '월 2회 콘텐츠 수정/업데이트 지원'
    ]
  },
  {
    id: 'master',
    name: 'MASTER',
    price: 55000,
    period: '월',
    features: [
      '모든 PRO 기능 포함',
      '마케팅 자동화 도구 연동',
      'AI 채팅봇 기본 세팅',
      '고객 관리 마스터 대시보드',
      '정기 데이터 분석 리포트',
      '우선 순위 기술 지원'
    ]
  }
];

export default function SubscriptionTab({ isDarkMode }: { isDarkMode: boolean }) {
  const { user } = useAuthStore();
  const [currentPlan, setCurrentPlan] = useState('free');
  const [nextPaymentDate, setNextPaymentDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user) return;
      
      try {
        const docId = user.subdomain || user.id;
        const docRef = doc(db, 'site_settings', docId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setCurrentPlan(data.subscriptionPlan || 'free');
          setNextPaymentDate(data.nextPaymentDate || '');
        }
      } catch (error) {
        console.error("Error fetching subscription:", error);
      } finally {
        setInitializing(false);
      }
    };

    fetchSubscription();
  }, [user]);

  const router = useRouter();

  // Redirect to Checkout
  const handleSubscribe = (plan: Plan) => {
    if (plan.id === currentPlan || !user) return;
    
    // Determine site identifier (subdomain takes precedence)
    const siteId = user.subdomain || user.id;
    
    // Redirect to checkout with subscription mode
    router.push(`/sites/${siteId}/checkout?plan=${plan.id}&mode=subscription`);
  };

  const t = {
    cardMain: isDarkMode ? 'bg-gradient-to-br from-white/5 to-white/2 border-white/5' : 'bg-white border-slate-200 shadow-sm',
    cardPlan: isDarkMode ? 'bg-white/2 border-white/5 hover:border-white/10 hover:bg-white/5' : 'bg-white border-slate-200 shadow-sm hover:shadow-md hover:border-purple-200',
    cardActive: isDarkMode ? 'bg-purple-600/10 border-purple-50' : 'bg-purple-50 border-purple-200',
    text: isDarkMode ? 'text-white' : 'text-slate-900',
    textMuted: isDarkMode ? 'text-gray-400' : 'text-slate-500',
    textDim: isDarkMode ? 'text-gray-300' : 'text-slate-600',
    buttonOutline: isDarkMode ? 'bg-white/5 hover:bg-white/10 text-white border-white/10' : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-sm',
    buttonSolid: isDarkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-slate-900 text-white hover:bg-black',
    historyItem: isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100',
    infoBox: isDarkMode ? 'bg-blue-500/10 border-blue-500/20' : 'bg-blue-50 border-blue-100',
  };

  if (initializing) return <div className={`p-8 text-center ${t.textMuted}`}>정보를 불러오는 중...</div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className={`rounded-3xl border p-8 overflow-hidden relative ${t.cardMain}`}>
        <div className="absolute top-0 right-0 p-32 bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-500 text-xs font-bold border border-green-500/30 flex items-center gap-1">
                <Check className="h-3 w-3" />
                구독 중 (Active)
              </span>
              <span className={`${t.textMuted} text-sm`}>다음 결제일: {nextPaymentDate || '-'}</span>
            </div>
            <h2 className={`text-3xl font-bold mb-2 ${t.text}`}>
              {PLANS.find(p => p.id === currentPlan)?.name} Plan
            </h2>
            <p className={t.textMuted}>
              현재 {currentPlan === 'free' ? '기본 기능을' : '프리미엄 기능을'} 이용하고 계십니다.
            </p>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={() => setShowHistory(!showHistory)}
              className={`px-5 py-3 rounded-xl font-medium transition-colors border ${t.buttonOutline}`}
            >
              결제 내역
            </button>
            <button className={`px-5 py-3 rounded-xl font-bold transition-colors ${t.buttonSolid}`}>
              카드 관리
            </button>
          </div>
        </div>
      </div>

      {/* Payment History (Collapsible) */}
      {showHistory && (
        <div className={`rounded-3xl border p-6 ${t.historyItem}`}>
          <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${t.text}`}>
            <Clock className="h-5 w-5 text-gray-400" />
            최근 결제 내역
          </h3>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`flex items-center justify-between p-4 rounded-xl border ${t.historyItem}`}>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                    <Check className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <div className={`font-bold ${t.text}`}>Pro Plan 월간 구독</div>
                    <div className={`text-xs ${t.textMuted}`}>2023. 12. 23 • 카카오페이</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`font-bold ${t.text}`}>₩33,000</span>
                  <button className={`p-2 hover:bg-white/10 rounded-lg transition-colors ${t.textMuted}`}>
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Plan Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {PLANS.map((plan) => (
          <div 
            key={plan.id}
            className={`
              relative rounded-3xl p-8 border transition-all duration-300
              ${currentPlan === plan.id 
                ? t.cardActive 
                : t.cardPlan}
            `}
          >
            {plan.recommended && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-xs font-bold text-white shadow-lg">
                BEST CHOICE
              </div>
            )}

            <div className="mb-6">
              <h3 className={`text-xl font-bold mb-2 ${t.text}`}>{plan.name}</h3>
              <div className="flex items-baseline gap-1">
                <span className={`text-4xl font-bold ${t.text}`}>
                  {plan.price === 0 ? '무료' : `₩${plan.price.toLocaleString()}`}
                </span>
                <span className={`${t.textMuted} text-sm`}>/{plan.period}</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              {plan.features.map((feature, idx) => (
                <li key={idx} className={`flex items-start gap-3 text-sm ${t.textDim}`}>
                  <div className={`mt-0.5 h-4 w-4 rounded-full flex items-center justify-center ${currentPlan === plan.id ? 'bg-purple-500' : 'bg-gray-400'}`}>
                    <Check className="h-2 w-2 text-white" />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSubscribe(plan)}
              disabled={currentPlan === plan.id || loading}
              className={`
                w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2
                ${currentPlan === plan.id 
                  ? 'bg-purple-100 text-purple-400 cursor-default' 
                  : t.buttonSolid}
              `}
            >
              {loading && currentPlan !== plan.id ? (
                <span className="animate-pulse">처리 중...</span>
              ) : (
                <>
                  {currentPlan === plan.id ? '이용 중' : '시작하기'}
                  {currentPlan !== plan.id && <ChevronRight className="h-4 w-4" />}
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      <div className={`rounded-2xl p-6 flex items-start gap-4 border ${t.infoBox}`}>
        <AlertCircle className="h-6 w-6 text-blue-400 flex-shrink-0" />
        <div>
          <h4 className="font-bold text-blue-500 mb-1">포트원(PortOne) 결제 연동 안내</h4>
          <p className={`text-sm leading-relaxed ${t.textMuted}`}>
            현재는 시뮬레이션 모드입니다. 실제 결제 연동을 위해서는 포트원 관리자 콘솔에서 
            API 키를 발급받아 환경 변수에 설정해야 합니다. 
            PG사는 토스페이먼츠, 카카오페이 등을 선택할 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
