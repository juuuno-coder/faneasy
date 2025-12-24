'use client';

import { useState, Suspense, useEffect } from 'react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { useDataStore } from '@/lib/data-store';
import { useCartStore } from '@/lib/cart-store';
import { Loader2, ArrowLeft, CheckCircle2, CreditCard } from 'lucide-react';
import { getCreator } from '@/lib/data';
import { toast } from 'react-hot-toast';

// Define IMP on window for TypeScript
declare global {
  interface Window {
    IMP: any;
  }
}

import { 
  calculatePriceWithVAT, 
  calculateTotalWithVAT, 
  INITIAL_SETUP_PRICES, 
  MONTHLY_SUBSCRIPTION_PLANS 
} from '@/lib/pricing';

// Pricing Data Configuration
const PLANS = {
  basic: {
    name: 'BASIC',
    price: INITIAL_SETUP_PRICES.basic, // VAT 별도
    monthly: MONTHLY_SUBSCRIPTION_PLANS.basic, // VAT 포함
  },
  pro: {
    name: 'PRO',
    price: INITIAL_SETUP_PRICES.pro, // VAT 별도
    monthly: MONTHLY_SUBSCRIPTION_PLANS.pro, // VAT 포함
  },
  master: {
    name: 'MASTER',
    price: INITIAL_SETUP_PRICES.master, // VAT 별도
    monthly: MONTHLY_SUBSCRIPTION_PLANS.master, // VAT 포함
  }
};

function CheckoutForm() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode');
  
  // Single Plan Mode
  const planId = searchParams.get('plan') as 'basic' | 'pro' | 'master' || 'basic';
  const singlePlan = PLANS[planId];

  // Cart Mode
  const { items: cartItems, totalPrice: getCartTotal, totalMonthly: getCartMonthly, clearCart } = useCartStore();
  const isCartMode = mode === 'cart';

  // Calculate Prices using Utility
  let subtotal = 0;
  let totalMonthly = 0;

  if (isCartMode) {
    subtotal = getCartTotal(); 
    totalMonthly = getCartMonthly();
  } else {
    subtotal = singlePlan.price;
    totalMonthly = singlePlan.monthly;
  }

  // Apply VAT Calculation
  const { vat, total: totalPrice } = calculatePriceWithVAT(subtotal);
  
  // Cart Items Setup
  const checkoutItems = isCartMode ? cartItems : [{
    id: planId,
    name: singlePlan.name,
    price: singlePlan.price,
    monthly: singlePlan.monthly
  }];

  const site = params?.site as string;
  const creator = getCreator(site);
  
  const { user } = useAuthStore();
  const { addOrder } = useDataStore();

  const [formData, setFormData] = useState({
    buyerName: '',
    buyerPhone: '',
    buyerEmail: '',
    businessName: '',
    domainRequest: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'bank_transfer' | 'card'>('bank_transfer');
  const [paymentResult, setPaymentResult] = useState<{ imp_uid?: string; merchant_uid?: string } | null>(null);

  // Pre-fill if logged in
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        buyerName: user.name || '',
        buyerEmail: user.email || '',
      }));
    }
  }, [user]);

  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    const merchant_uid = `ord-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    if (paymentMethod === 'card') {
        const { IMP } = window;
        if (!IMP) {
            toast.error('결제 모듈을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.');
            setStatus('idle');
            return;
        }

        // Initialize with test code or env variable
        IMP.init('imp76413247'); // Replace with your PortOne User Code

        const data = {
            pg: 'html5_inicis', 
            pay_method: 'card',
            merchant_uid,
            name: isCartMode ? `FanEasy 결제 (${checkoutItems.length}건)` : `${singlePlan.name} Package`,
            amount: totalPrice,
            buyer_email: formData.buyerEmail,
            buyer_name: formData.buyerName,
            buyer_tel: formData.buyerPhone,
        };

        IMP.request_pay(data, async (rsp: any) => {
            if (rsp.success) {
                // Payment Success
                setPaymentResult({ imp_uid: rsp.imp_uid, merchant_uid: rsp.merchant_uid });
                
                // Create Order Object(s)
                checkoutItems.forEach(item => {
                    const newOrder = {
                        id: merchant_uid, // Use same UID for grouped orders or unique if preferred
                        productId: item.id as any,
                        ownerId: 'inf-1', 
                        buyerName: formData.buyerName,
                        buyerEmail: formData.buyerEmail,
                        buyerPhone: formData.buyerPhone,
                        businessName: formData.businessName,
                        amount: item.price,
                        paymentMethod: 'card' as const, 
                        status: 'paid' as const,
                        imp_uid: rsp.imp_uid,
                        merchant_uid: rsp.merchant_uid,
                        domainRequest: formData.domainRequest,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    };
                    addOrder(newOrder);
                });

                if (isCartMode) clearCart();
                setStatus('success');
            } else {
                // Payment Failed
                toast.error(`결제에 실패했습니다: ${rsp.error_msg}`);
                setStatus('idle');
            }
        });
    } else {
        // Bank Transfer (Existing flow)
        await new Promise(resolve => setTimeout(resolve, 800));

        checkoutItems.forEach(item => {
            const newOrder = {
                id: merchant_uid,
                productId: item.id as any,
                ownerId: 'inf-1',
                buyerName: formData.buyerName,
                buyerEmail: formData.buyerEmail,
                buyerPhone: formData.buyerPhone,
                businessName: formData.businessName,
                amount: item.price,
                paymentMethod: 'bank_transfer' as const, 
                status: 'pending_payment' as const,
                domainRequest: formData.domainRequest,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            addOrder(newOrder);
        });

        if (isCartMode) clearCart();
        setStatus('success');
    }
  };

  if (status === 'success') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A0A0B] p-4 text-white">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-purple-500/20 p-4 text-purple-500">
              <CheckCircle2 className="h-12 w-12" />
            </div>
          </div>
          <h2 className="mb-2 text-2xl font-bold">주문이 접수되었습니다!</h2>
          <p className="mb-8 text-gray-400">
            접수하신 연락처({formData.buyerPhone})로 <br />
            입금 계좌 및 향후 절차를 안내해 드리겠습니다.
          </p>
          <div className="mb-8 rounded-xl bg-black/30 p-4 text-left text-sm">
            <div className="mb-2 flex justify-between">
              <span className="text-gray-500">주문 상품</span>
              <span className="font-bold">
                {isCartMode ? `총 ${checkoutItems.length}개 상품` : `${singlePlan.name} Package`}
              </span>
            </div>
            {isCartMode && (
                <div className="mb-2 pl-2 text-xs text-gray-400 border-l-2 border-white/10">
                    {checkoutItems.map(i => <div key={i.id}>{i.name}</div>)}
                </div>
            )}
            <div className="mb-2 flex justify-between">
              <span className="text-gray-500">총 결제 금액</span>
              <span className="font-bold text-purple-400">{totalPrice.toLocaleString()}원</span>
            </div>
             <div className="flex justify-between">
              <span className="text-gray-500">결제 방식</span>
              <span>{paymentMethod === 'card' ? '신용카드' : '무통장 입금'}</span>
            </div>
            {paymentResult?.imp_uid && (
                <div className="mt-2 flex justify-between text-[10px] text-gray-600">
                    <span>거래 번호</span>
                    <span>{paymentResult.imp_uid}</span>
                </div>
            )}
          </div>
          <div className="flex flex-col gap-3">
             <button 
                onClick={() => router.push('/')}
                className="w-full rounded-xl bg-white py-3 font-bold text-black hover:bg-gray-200 transition-colors"
                >
                홈으로 돌아가기
            </button>
            <button 
                onClick={() => router.push('/mypage')}
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 font-bold text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                마이페이지에서 확인
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Authentication Check
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A0A0B] p-4 text-white">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-purple-500/20 p-4 text-purple-500">
                <CreditCard className="h-12 w-12" />
            </div>
          </div>
          <h2 className="mb-2 text-2xl font-bold">로그인이 필요합니다</h2>
          <p className="mb-8 text-gray-400">
            주문서 작성을 위해 회원가입 및 로그인이 필요합니다. <br />
            기존 회원이시라면 로그인 후 이용해주세요.
          </p>
          <div className="flex flex-col gap-3">
             <button 
                onClick={() => router.push('/login')}
                className="w-full rounded-xl bg-white py-3 font-bold text-black hover:bg-gray-200 transition-colors"
                >
                로그인하기
            </button>
            <button 
                onClick={() => router.push('/login?mode=signup')}
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 font-bold text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                회원가입하기
            </button>
            <button 
                onClick={() => router.back()}
                className="mt-4 text-sm text-gray-500 hover:text-gray-300 underline"
                >
                뒤로가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Redirect if cart is empty in cart mode
  if (isCartMode && checkoutItems.length === 0) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-[#0A0A0B] text-white">
            <p>장바구니가 비어있습니다.</p>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white p-4 lg:p-8 font-sans selection:bg-purple-500 selection:text-white">
      <div className="mx-auto max-w-6xl">
        <button 
          onClick={() => router.back()}
          className="mb-8 flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          뒤로가기
        </button>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Order Form */}
          <div className="flex-1">
             <div className="mb-8">
                <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-400 backdrop-blur-md mb-4">
                    {creator?.name || 'Partner'} Official 
                </div>
                <h1 className="mb-2 text-3xl font-bold">주문서 작성</h1>
                <p className="text-gray-400">제작에 필요한 고객 정보를 입력해주세요.</p>
             </div>

             <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">성함 (대표자)</label>
                    <input
                      required
                      type="text"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
                      placeholder="홍길동"
                      value={formData.buyerName}
                      onChange={e => setFormData({...formData, buyerName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">연락처</label>
                    <input
                      required
                      type="tel"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
                      placeholder="010-1234-5678"
                      value={formData.buyerPhone}
                      onChange={e => setFormData({...formData, buyerPhone: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">이메일</label>
                  <input
                    required
                    type="email"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
                    placeholder="example@company.com"
                    value={formData.buyerEmail}
                    onChange={e => setFormData({...formData, buyerEmail: e.target.value})}
                  />
                  <p className="text-xs text-gray-500">* 주문 내역 및 진행 상황이 이메일로 발송됩니다.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">사업체명 (선택)</label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
                    placeholder="주식회사 팬이지"
                    value={formData.businessName}
                    onChange={e => setFormData({...formData, businessName: e.target.value})}
                  />
                </div>

                 <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">희망 도메인 (선택)</label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
                    placeholder="example.com"
                    value={formData.domainRequest}
                    onChange={e => setFormData({...formData, domainRequest: e.target.value})}
                  />
                  <p className="text-xs text-gray-500">* 아직 정하지 않으셨다면 비워두셔도 됩니다.</p>
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-medium text-gray-400">결제 방법 선택</label>
                  <div className="grid grid-cols-1 gap-4">
                     <button
                        type="button"
                        onClick={() => setPaymentMethod('card')}
                        className={`hidden items-center justify-center gap-2 rounded-xl border p-4 transition-all ${
                          paymentMethod === 'card' 
                            ? 'border-purple-500 bg-purple-500/10 text-white' 
                            : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20'
                        }`}
                     >
                        <CreditCard className="h-5 w-5" />
                        <span className="font-bold">신용카드</span>
                     </button>
                     <button
                        type="button"
                        onClick={() => setPaymentMethod('bank_transfer')}
                        className={`flex items-center justify-center gap-2 rounded-xl border p-4 transition-all ${
                          paymentMethod === 'bank_transfer' 
                            ? 'border-purple-500 bg-purple-500/10 text-white' 
                            : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20'
                        }`}
                     >
                        <div className="flex h-5 w-5 items-center justify-center rounded-md border border-current text-[10px] font-bold">₩</div>
                        <span className="font-bold">무통장입금</span>
                     </button>
                  </div>
                </div>

                {paymentMethod === 'bank_transfer' && (
                  <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-6 animate-in fade-in slide-in-from-top-2">
                    <h3 className="mb-4 font-bold text-lg flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      무통장 입금 정보
                    </h3>
                    <div className="space-y-2 text-sm text-gray-300">
                      <div className="flex justify-between">
                        <span>은행명</span>
                        <span className="font-bold text-white">카카오뱅크</span>
                      </div>
                      <div className="flex justify-between">
                        <span>계좌번호</span>
                        <span className="font-bold text-white">3333-07-9016494</span>
                      </div>
                      <div className="flex justify-between">
                        <span>예금주</span>
                        <span className="font-bold text-white">위로(김정원)</span>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-purple-500/20 text-xs text-purple-300 leading-relaxed">
                      * '결제하기' 버튼을 누르시면 주문이 접수되며, 위 계좌로 입금해 주시면 담당자가 확인 후 제작이 시작됩니다. <br/>
                      * 세금계산서 발행이 필요하신 경우 입금 후 고객센터로 연락주세요.
                    </div>
                  </div>
                )}

                {paymentMethod === 'card' && (
                  <div className="rounded-xl border border-white/10 bg-white/5 p-6 animate-in fade-in slide-in-from-top-2">
                    <p className="text-sm text-gray-400 leading-relaxed">
                      * 신용카드 결제는 실시간으로 승인되며 승인 즉시 제작 대기 상태로 전환됩니다. <br/>
                      * 법인카드로 결제 시 매출전표를 이메일로 받아보실 수 있습니다.
                    </p>
                  </div>
                )}

                <button
                  disabled={status === 'loading'}
                  type="submit"
                  className="w-full rounded-xl bg-white py-4 font-bold text-black transition-all hover:bg-gray-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-lg"
                >
                  {status === 'loading' ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>주문 처리 중...</span>
                    </div>
                  ) : (
                    `${totalPrice.toLocaleString()}원 결제하기`
                  )}
                </button>
             </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:w-[380px]">
             <div className="sticky top-8 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all hover:border-purple-500/20">
               <h3 className="mb-6 text-xl font-bold">주문 요약</h3>
               
               <div className="mb-6 space-y-4 border-b border-white/10 pb-6">
                 {checkoutItems.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-start mb-2">
                        <div>
                            <div className="font-bold text-lg">{item.name}</div>
                            {!isCartMode && <div className="text-sm text-gray-400">1인 마케팅 사이트 제작</div>}
                        </div>
                        <div className="font-bold">{item.price.toLocaleString()}원</div>
                    </div>
                 ))}
                 
                 {/* Show Plan Features only for Single Item or handle generally */}
                 {!isCartMode && (
                    <ul className="text-sm text-gray-500 space-y-2 mt-4 bg-black/20 p-4 rounded-lg">
                    {planId === 'basic' && (
                        <>
                            <li>✅ 타사 대비 합리적인 가격</li>
                            <li>✅ 반응형 웹 기본 지원</li>
                            <li>✅ 기본 DB 수집 폼 제공</li>
                        </>
                    )}
                    {planId === 'pro' && (
                        <>
                            <li className="text-purple-300">💜 <strong>BEST CHOICE</strong></li>
                            <li>✅ 프리미엄 디자인 템플릿</li>
                            <li>✅ 알림톡 연동 무상 지원</li>
                            <li>✅ SEO (검색최적화) 세팅</li>
                        </>
                    )}
                    {planId === 'master' && (
                        <>
                            <li className="text-amber-300">👑 <strong>High-End Quality</strong></li>
                            <li>✅ 100% 맞춤형 풀 커스텀</li>
                            <li>✅ 마케팅 자동화 도구 연동</li>
                            <li>✅ 전담 매니저 배정</li>
                        </>
                    )}
                    </ul>
                 )}
               </div>

               <div className="mb-6 space-y-2">
                 <div className="flex justify-between text-gray-400">
                   <span>제작 비용 (일회성)</span>
                   <span>{subtotal.toLocaleString()}원</span>
                 </div>
                 <div className="flex justify-between text-gray-400">
                   <span>부가가치세 (VAT 10%)</span>
                   <span>{vat.toLocaleString()}원</span>
                 </div>
                 <div className="flex justify-between text-gray-400 pt-2 border-t border-white/5">
                   <span>월 관리비 (결제)</span>
                   <span>{totalMonthly.toLocaleString()}원/월</span>
                 </div>
                 <p className="text-xs text-green-400 pl-2 border-l-2 border-green-500/30 bg-green-500/5 p-2 rounded">
                   💡 월 관리비는 사이트 배포가 시작되면 청구됩니다.
                 </p>
               </div>

               <div className="flex justify-between border-t border-white/10 pt-6 text-xl font-bold">
                 <span>총 결제금액</span>
                 <span className="text-purple-400">{totalPrice.toLocaleString()}원</span>
               </div>
               <p className="mt-2 text-right text-xs text-gray-500">초기 개발비 + VAT 포함</p>
             </div>
             
             {/* Security Badge */}
             <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500">
                <div className="h-1 w-1 rounded-full bg-green-500"></div>
                SSL 보안 서버가 적용되어 안전합니다.
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>}>
      <CheckoutForm />
    </Suspense>
  );
}

