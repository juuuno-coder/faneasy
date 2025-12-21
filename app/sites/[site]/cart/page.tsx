'use client';

import { useParams, useRouter } from "next/navigation";
import { useCartStore } from "@/lib/cart-store";
import { Trash2, ArrowLeft, ArrowRight, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CartPage() {
  const router = useRouter();
  const params = useParams();
  const site = params?.site as string;
  const { items, removeItem, totalPrice, totalMonthly } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isEmpty = items.length === 0;

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white selection:bg-purple-500 selection:text-white pt-24 pb-20 px-4">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors cursor-pointer w-fit" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
            <span>돌아가기</span>
        </div>

        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
            <ShoppingCart className="h-8 w-8 text-purple-500" />
            장바구니
            <span className="text-lg text-gray-500 font-normal">({items.length}개)</span>
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items List */}
            <div className="flex-1 space-y-4">
                {isEmpty ? (
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
                        <ShoppingCart className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold mb-2">장바구니가 비어있습니다.</h3>
                        <p className="text-gray-400 mb-8">원하시는 서비스를 담아보세요.</p>
                        <Link 
                            href={`/sites/${site}/store`}
                            className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-bold text-black hover:bg-gray-200 transition-colors"
                        >
                            상품 보러가기
                        </Link>
                    </div>
                ) : (
                    items.map((item) => (
                        <div key={item.id} className="group relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="h-16 w-16 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 font-bold text-2xl">
                                    {item.name[0]}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold">{item.name}</h3>
                                    <div className="text-sm text-gray-400">
                                        월 관리비: {item.monthly.toLocaleString()}원
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                                <div className="text-right">
                                    <div className="font-bold text-lg">{item.price.toLocaleString()}원</div>
                                </div>
                                <button 
                                    onClick={() => removeItem(item.id)}
                                    className="p-2 rounded-lg text-gray-500 hover:text-red-500 hover:bg-red-500/10 transition-all"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Summary Sidebar */}
            {!isEmpty && (
                <div className="w-full lg:w-[360px]">
                    <div className="sticky top-24 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                        <h3 className="font-bold text-lg mb-6">결제 금액</h3>
                        
                        <div className="space-y-3 mb-6 pb-6 border-b border-white/10 text-sm text-gray-400">
                            <div className="flex justify-between">
                                <span>총 상품 금액</span>
                                <span>{totalPrice().toLocaleString()}원</span>
                            </div>
                            <div className="flex justify-between">
                                <span>총 월 관리비</span>
                                <span>{totalMonthly().toLocaleString()}원/월</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-end mb-8">
                            <span className="font-bold">최종 결제 금액</span>
                            <div className="text-right">
                                <span className="block text-2xl font-bold text-purple-400">{totalPrice().toLocaleString()}원</span>
                            </div>
                        </div>

                        <button 
                            onClick={() => router.push(`/sites/${site}/checkout?mode=cart`)}
                            className="w-full py-4 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-500/25"
                        >
                            결제하기
                            <ArrowRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
