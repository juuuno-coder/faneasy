import { useState, useEffect } from 'react';
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
    id: 'basic',
    name: 'BASIC',
    price: 20000,
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
    price: 30000,
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
    price: 50000,
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

export default function SubscriptionTab() {
  const { user } = useAuthStore();
  const [currentPlan, setCurrentPlan] = useState('basic');
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
          setCurrentPlan(data.subscriptionPlan || 'basic');
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

  // Mock Payment Function (Simulating PortOne)
  const handleSubscribe = async (plan: Plan) => {
    if (plan.id === currentPlan || !user) return;
    
    if (confirm(`'${plan.name}' 요금제로 변경하시겠습니까?\n월 ${plan.price.toLocaleString()}원이 결제됩니다.`)) {
      setLoading(true);
      
      // Simulate API call / PortOne Window open
      setTimeout(async () => {
        try {
          const docId = user.subdomain || user.id;
          const docRef = doc(db, 'site_settings', docId);
          
          // Calculate next month date
          const nextDate = new Date();
          nextDate.setMonth(nextDate.getMonth() + 1);
          const nextDateStr = nextDate.toISOString().split('T')[0];

          await updateDoc(docRef, {
            subscriptionPlan: plan.id,
            nextPaymentDate: nextDateStr,
            updatedAt: new Date().toISOString()
          }).catch(async (e) => {
            // Document might not exist, create it if update fails
            await setDoc(docRef, {
               ownerId: user.id,
               subscriptionPlan: plan.id,
               nextPaymentDate: nextDateStr,
               updatedAt: new Date().toISOString()
            }, { merge: true });
          });

          setCurrentPlan(plan.id);
          setNextPaymentDate(nextDateStr);
          alert(`결제가 성공적으로 완료되었습니다!\n이제 '${plan.name}' 멤버십이 적용됩니다.`);
        } catch (error) {
          console.error("Payment Error:", error);
          alert("결제 처리 중 오류가 발생했습니다.");
        } finally {
          setLoading(false);
        }
      }, 1500);
    }
  };

  if (initializing) return <div className="p-8 text-center text-gray-500">정보를 불러오는 중...</div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Current Subscription Status */}
      <div className="rounded-3xl border border-white/5 bg-gradient-to-br from-white/5 to-white/2 p-8 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-32 bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold border border-green-500/30 flex items-center gap-1">
                <Check className="h-3 w-3" />
                구독 중 (Active)
              </span>
              <span className="text-gray-400 text-sm">다음 결제일: {nextPaymentDate || '-'}</span>
            </div>
            <h2 className="text-3xl font-bold mb-2">
              {PLANS.find(p => p.id === currentPlan)?.name} Plan
            </h2>
            <p className="text-gray-400">
              현재 {currentPlan === 'free' ? '기본 기능을' : '프리미엄 기능을'} 이용하고 계십니다.
            </p>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={() => setShowHistory(!showHistory)}
              className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors border border-white/10"
            >
              결제 내역
            </button>
            <button className="px-5 py-3 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition-colors">
              카드 관리
            </button>
          </div>
        </div>
      </div>

      {/* Payment History (Collapsible) */}
      {showHistory && (
        <div className="rounded-3xl border border-white/5 bg-black/20 p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-gray-400" />
            최근 결제 내역
          </h3>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                    <Check className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <div className="font-bold">Pro Plan 월간 구독</div>
                    <div className="text-xs text-gray-500">2023. 12. 23 • 카카오페이</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-white">₩9,900</span>
                  <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 transition-colors">
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Plan Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLANS.map((plan) => (
          <div 
            key={plan.id}
            className={`
              relative rounded-3xl p-8 border transition-all duration-300
              ${currentPlan === plan.id 
                ? 'bg-purple-600/10 border-purple-500 ring-1 ring-purple-500/50' 
                : 'bg-white/2 border-white/5 hover:border-white/10 hover:bg-white/5'}
            `}
          >
            {plan.recommended && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-xs font-bold text-white shadow-lg">
                BEST CHOICE
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white">
                  {plan.price === 0 ? '무료' : `₩${plan.price.toLocaleString()}`}
                </span>
                <span className="text-gray-400 text-sm">/{plan.period}</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-gray-300">
                  <div className={`mt-0.5 h-4 w-4 rounded-full flex items-center justify-center ${currentPlan === plan.id ? 'bg-purple-500' : 'bg-gray-700'}`}>
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
                  ? 'bg-white/10 text-gray-400 cursor-default' 
                  : 'bg-white text-black hover:bg-gray-200 hover:scale-[1.02]'}
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

      <div className="rounded-2xl bg-blue-500/10 border border-blue-500/20 p-6 flex items-start gap-4">
        <AlertCircle className="h-6 w-6 text-blue-400 flex-shrink-0" />
        <div>
          <h4 className="font-bold text-blue-400 mb-1">포트원(PortOne) 결제 연동 안내</h4>
          <p className="text-sm text-gray-400 leading-relaxed">
            현재는 시뮬레이션 모드입니다. 실제 결제 연동을 위해서는 포트원 관리자 콘솔에서 
            API 키를 발급받아 환경 변수에 설정해야 합니다. 
            PG사는 토스페이먼츠, 카카오페이 등을 선택할 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
