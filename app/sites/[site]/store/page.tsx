'use client';

import { useParams, useRouter } from "next/navigation";
import { getCreator } from "@/lib/data";
import { useCartStore } from "@/lib/cart-store";
import { Check, ShoppingCart, ArrowRight, Star, Monitor, Rocket } from "lucide-react";
import { useState } from "react";

const PRODUCTS = [
  {
    id: 'basic',
    name: 'BASIC Plan',
    desc: '개인 / 포트폴리오 / 블로그',
    price: 300000,
    monthly: 20000,
    features: ['반응형 웹사이트', '기본 SEO 최적화', '콘텐츠 수정/보완', '고객 문의폼 제공'],
    icon: Rocket,
    highlight: false,
  },
  {
    id: 'pro',
    name: 'PRO Plan',
    desc: '소상공인 / 스타트업 / 홍보형',
    price: 500000,
    monthly: 30000,
    features: ['베이직 플랜 기능 포함', '회원 DB / 뉴스레터', '포트폴리오 / 고객후기', '채팅봇 상담'],
    icon: Monitor,
    highlight: true,
  },
  {
    id: 'master',
    name: 'MASTER Plan',
    desc: '쇼핑몰 / 예약 / 비즈니스',
    price: 700000,
    monthly: 50000,
    features: ['프로 플랜 기능 포함', '쇼핑몰 / 전자결제', 'PG사 연동 지원', '예약 / 커뮤니티'],
    icon: Star,
    highlight: false,
  },
];

export default function StorePage() {
  const params = useParams();
  const router = useRouter();
  const site = params?.site as string;
  const creator = getCreator(site);
  const { addItem, items } = useCartStore();
  const [toast, setToast] = useState<string | null>(null);

  const handleAddToCart = (product: typeof PRODUCTS[0]) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      monthly: product.monthly,
    });
    setToast(`${product.name}이 장바구니에 담겼습니다.`);
    setTimeout(() => setToast(null), 2000);
  };

  const isInCart = (id: string) => items.some(item => item.id === id);

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white selection:bg-purple-500 selection:text-white pt-24 pb-20">
        
      {/* Header */}
      <div className="mx-auto max-w-7xl px-6 mb-16 text-center">
        <h1 className="text-4xl font-bold mb-4">서비스 구매하기</h1>
        <p className="text-gray-400">비즈니스 성공을 위한 최적의 플랜을 선택하세요.</p>
      </div>

      <div className="mx-auto max-w-7xl px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {PRODUCTS.map((product) => (
          <div 
            key={product.id}
            className={`relative flex flex-col rounded-3xl border p-8 transition-all ${
                product.highlight 
                ? 'border-purple-500 bg-purple-500/10 shadow-[0_0_40px_rgba(139,92,246,0.15)] scale-105 z-10' 
                : 'border-white/10 bg-white/5 hover:bg-white/10'
            }`}
          >
            {product.highlight && (
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 md:translate-x-0 md:right-8 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    BEST CHOICE
                </div>
            )}

            <div className="mb-6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                    product.highlight ? 'bg-purple-500 text-white' : 'bg-white/10 text-gray-400'
                }`}>
                    <product.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">{product.name}</h3>
                <p className="text-sm text-gray-400 mt-1">{product.desc}</p>
            </div>

            <div className="mb-6">
                <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold">{product.price.toLocaleString()}</span>
                    <span className="text-gray-400 mb-1">원</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                    월 관리비 {product.monthly.toLocaleString()}원 별도
                </p>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
                {product.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                        <Check className="h-4 w-4 text-purple-500 shrink-0" />
                        {feature}
                    </li>
                ))}
            </ul>

            <div className="flex flex-col gap-3">
                {isInCart(product.id) ? (
                    <button 
                        onClick={() => router.push(`/sites/${site}/cart`)}
                        className="w-full py-3 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                    >
                        <Check className="h-4 w-4" />
                        장바구니 확인
                    </button>
                ) : (
                    <button 
                        onClick={() => handleAddToCart(product)}
                        className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                            product.highlight 
                            ? 'bg-purple-500 hover:bg-purple-600 text-white shadow-lg' 
                            : 'bg-white text-black hover:bg-gray-100'
                        }`}
                    >
                        <ShoppingCart className="h-4 w-4" />
                        장바구니 담기
                    </button>
                )}
            </div>
          </div>
        ))}
      </div>

      {/* Floating Cart Button if items exist */}
      {items.length > 0 && (
        <div className="fixed bottom-8 right-8 z-50 animate-in slide-in-from-bottom-5 fade-in">
             <button 
                onClick={() => router.push(`/sites/${site}/cart`)}
                className="flex items-center gap-3 px-6 py-4 bg-white text-black rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.5)] hover:scale-105 transition-transform font-bold"
            >
                <div className="relative">
                    <ShoppingCart className="h-6 w-6" />
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-purple-600 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white">
                        {items.length}
                    </span>
                </div>
                <span className="pr-1">구매하러 가기</span>
                <ArrowRight className="h-4 w-4" />
            </button>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-gray-800 text-white px-6 py-3 rounded-xl shadow-xl animate-in fade-in slide-in-from-bottom-2">
            {toast}
        </div>
      )}

    </div>
  );
}
