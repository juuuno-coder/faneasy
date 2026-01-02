'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { 
  Phone, 
  MapPin, 
  Star, 
  CheckCircle, 
  ArrowRight,
  Building2,
  Target,
  Zap,
  BarChart3,
  Users,
  Award,
  Palette,
  TrendingUp,
  MessageSquare,
  ChevronDown,
  Store,
  CheckCircle2,
  ShieldAlert,
  Shield,
  Smartphone,
  Play
} from 'lucide-react';
import { useDataStore } from '@/lib/data-store';
import { HeroTextSequence } from '@/components/hero-text-sequence';
import { RotatingBizonO, RotatingOuterRing } from '@/components/rotating-bizon-o';
import { db } from "@/lib/firebaseClient";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { logActivity } from "@/lib/logger";

export default function BizonMarketingAfter({ site }: { site: string }) {
  const { getPageContent } = useDataStore();
  const pageContent = getPageContent(site);
  
  // 스크롤 상태 관리
  const [isScrolled, setIsScrolled] = useState(false);

  /* Scroll Snap Container Ref */
  const mainContainerRef = useRef<HTMLDivElement>(null);

  // 스크롤 이벤트 리스너 (for Navbar style)
  const handleScroll = () => {
    if (mainContainerRef.current) {
      const scrollTop = mainContainerRef.current.scrollTop;
      setIsScrolled(scrollTop > 50);
    }
  };

  /* State Updates */
  const [formData, setFormData] = useState({
    name: '',
    brandName: '',
    address: '',
    goal: [] as string[],
    currentMarketing: [] as string[],
    concern: '',
    contact: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Zustand Store
  const { addInquiry } = useDataStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const newInquiry = {
        ownerId: 'bizon-admin', // Default owner for Bizon
        siteDomain: site || 'bizon',
        name: formData.name, // Correctly map User Name
        email: '', // Not collected in this form
        phone: formData.contact,
        company: formData.brandName,
        address: formData.address,
        goals: formData.goal,
        currentMarketing: formData.currentMarketing,
        message: formData.concern, // Map concern to message
        plan: 'custom' as const, 
        status: 'pending',
        createdAt: new Date(),
      };

      // Save to Firestore
      const docRef = await addDoc(collection(db, "inquiries"), {
        ...newInquiry,
        serverCreatedAt: serverTimestamp(),
      });
      
      console.log("Inquiry successfully saved to Firestore with ID:", docRef.id);

      // Log Activity (Non-blocking)
      logActivity({
        type: 'inquiry',
        userName: formData.brandName,
        userEmail: formData.contact,
        action: '비즈온 마케팅 진단 요청',
        target: '진단 요청',
        subdomain: site || 'bizon'
      }).catch(err => console.error("Activity logging failed:", err));

      // Send Email Notification (Non-blocking)
      fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.contact,
          brandName: formData.brandName,
          address: formData.address,
          concern: formData.concern,
          site: site || 'bizon',
          id: docRef.id
        }),
      }).catch(err => console.error("Email notification failed:", err));

      // Local store update for UI
      addInquiry({
        ...newInquiry,
        id: docRef.id,
        status: 'pending' as any,
        workflowStatus: 'received',
        notes: [],
        timeline: [{
          status: 'received',
          timestamp: new Date().toISOString(),
          note: '마케팅 진단 자동 접수'
        }]
      });

      setSubmitted(true);
    } catch (error: any) {
      console.error("Submission fatal error:", error);
      alert(`접수 중 오류가 발생했습니다: ${error.message || '잠시 후 다시 시도해주세요.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el && mainContainerRef.current) {
        // Since we are using a custom snap container, we scroll the container
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div 
      ref={mainContainerRef}
      onScroll={handleScroll}
      className="h-screen bg-black overflow-x-hidden overflow-y-auto snap-y snap-mandatory scroll-smooth select-none">
      
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md border-b border-gray-100 h-[70px] md:h-[80px]' 
          : 'bg-transparent h-[80px] md:h-[100px]'
      }`}>
        <div className="w-full md:w-[90%] max-w-[1400px] mx-auto px-6 h-full flex items-center justify-between">
            <div 
              className="relative flex items-center cursor-pointer"
              onClick={() => mainContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <div className="relative w-[180px] h-[50px] md:w-[240px] md:h-[60px]">
                <Image 
                  src={isScrolled ? `/bizon-logo.png?v=12` : `/bizon-logo-dark.png?v=12`} 
                  alt="비즈온" 
                  fill
                  priority
                  className="object-contain object-left transition-opacity duration-300"
                  unoptimized
                />
              </div>
            </div>

          <div className="flex items-center gap-6">
            <nav className={`hidden md:flex items-center gap-8 text-sm md:text-base font-bold transition-colors ${
              isScrolled ? 'text-gray-600' : 'text-white'
            }`}>
              <button onClick={() => scrollToSection('reason')} className="hover:text-orange-600">서비스 특징</button>
              <button onClick={() => scrollToSection('process')} className="hover:text-orange-600">진행 방식</button>
              <button onClick={() => scrollToSection('review')} className="hover:text-orange-600">고객 후기</button>
            </nav>
            <button 
              onClick={() => scrollToSection('contact-form')}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
                isScrolled 
                  ? 'bg-orange-600 text-white hover:bg-orange-700' 
                  : 'bg-white text-gray-900 hover:bg-gray-100'
              }`}
            >
              문의하기
            </button>
          </div>
        </div>
      </header>

      {/* 1. Hero */}
      <section className="relative h-screen snap-start flex items-center justify-center bg-black">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/60 z-10" />
          <video autoPlay muted loop playsInline className="w-full h-full object-cover">
            <source src="/videos/bizon-main.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="relative z-20 w-full">
          <HeroTextSequence />
        </div>
      </section>

      {/* Sticky Bottom CTA */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-48px)] max-w-lg px-4">
        <button 
          onClick={() => scrollToSection('contact-form')}
          className="w-full py-4 bg-linear-to-r from-orange-600 to-red-600 text-white text-base md:text-xl font-bold rounded-2xl shadow-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2 border border-white/20"
        >
          매장에서 새는 구멍 3개 찾기
          <ArrowRight className="h-5 w-5 md:h-6 md:w-6" />
        </button>
      </div>

      {/* 2. Reason */}
      <section id="reason" className="h-screen snap-start flex flex-col justify-center bg-white px-6">
        <div className="max-w-5xl mx-auto w-full">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black leading-tight text-gray-900">
              프랜차이즈라서<br />
              <span className="text-orange-600">마케팅이 의미 없다고 생각하시나요?</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12 mb-10">
            {[
              { text: '검색시 누가봐도 가고 싶은곳', img: '/uploads/place-example-1.png' },
              { text: '리뷰가 많고 후기가 좋은 곳', img: '/uploads/place-example-2.png' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="relative aspect-video rounded-3xl overflow-hidden shadow-lg border border-gray-100 mb-4 bg-gray-50">
                  <Image src={item.img} alt={item.text} fill className="object-cover" unoptimized 
                  onError={(e) => (e.currentTarget.style.opacity = '0')} />
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-bold">플레이스 예시</div>
                </div>
                <h3 className="text-xl md:text-3xl font-black text-gray-900">{item.text}</h3>
              </div>
            ))}
          </div>

          <div className="text-center p-8 md:p-12 rounded-[40px] bg-linear-to-r from-orange-700 to-red-500 text-white shadow-xl">
            <p className="text-lg md:text-2xl lg:text-3xl font-black leading-tight">
              지점 별로 <span className="underline decoration-2 underline-offset-4">플레이스 마케팅</span> 관리를<br />
              <span className="text-2xl md:text-4xl lg:text-5xl mt-6 block font-black">제대로 해주는 본사는 <span className="text-yellow-300">'없습니다'</span></span>
            </p>
          </div>
        </div>
      </section>

      {/* 3. Stats */}
      <section className="h-screen snap-start flex flex-col justify-center bg-slate-950 px-6 text-white">
        <div className="max-w-5xl mx-auto w-full">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black leading-tight break-keep">
              지역 장악 마케팅으로<br />
              대표님의 프랜차이즈 매장을<br />
              <span className="text-orange-600 underline">지역 1등 업체</span>로 만들겠습니다.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {[
               { val: '300+', label: '프랜차이즈 지점', sub: '현재 진행 중' },
               { val: '4.8/5.0', label: '고객 만족도', sub: '평균 평점' },
               { val: '평균 2배', label: '매출 증가율', sub: '6개월 기준' },
             ].map((s, i) => (
               <div key={i} className="bg-white/5 backdrop-blur-md p-8 md:p-10 rounded-3xl border border-white/10 text-center">
                 <div className="text-3xl md:text-5xl font-black text-orange-600 mb-2">{s.val}</div>
                 <div className="text-white font-bold text-lg">{s.label}</div>
                 <div className="text-gray-500 text-xs md:text-sm">{s.sub}</div>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* 4. Differentiation */}
      <section className="h-screen snap-start flex flex-col justify-center bg-black px-6 relative">
        <div className="max-w-5xl mx-auto w-full relative z-10">
           <div className="text-center mb-12">
              <p className="text-blue-500 font-bold mb-2">마케팅도 똑같습니다</p>
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-white leading-tight">
                가짜 마케팅 전문가가 판치는<br />
                자영업 마케팅 시장,<br />
                진짜 전문가인지 확인해 보세요.
              </h2>
           </div>

           <div className="grid md:grid-cols-2 gap-6">
              {[
                { txt: '우리의 목표는 단순히\n순위를 올리는 게 아닙니다.', bg: '/uploads/meeting-1.png' },
                { txt: '고객이 올 수밖에 없는\n구조를 만들고\n\n그 경험을 매출로 전환하는 것.', bg: '/uploads/meeting-2.png' }
              ].map((b, i) => (
                <div key={i} className="relative h-[240px] md:h-[300px] rounded-[40px] overflow-hidden border border-white/10 group">
                  <Image src={b.bg} alt="bg" fill className="object-cover opacity-20 group-hover:opacity-30 transition-opacity" unoptimized />
                  <div className="absolute inset-0 flex items-center justify-center p-6 bg-black/40">
                    <h3 className="text-lg md:text-2xl font-black text-white text-center whitespace-pre-line leading-relaxed">
                      {b.txt.split('\n').map((l, j) => (
                        <span key={j} className={l.includes('순위') || l.includes('구조') || l.includes('매출') ? 'text-orange-500' : ''}>
                          {l}<br/>
                        </span>
                      ))}
                    </h3>
                  </div>
                </div>
              ))}
           </div>

           <div className="mt-12 text-center">
              <button onClick={() => scrollToSection('contact-form')} className="px-10 py-5 bg-orange-600 text-white rounded-3xl text-xl md:text-2xl font-black shadow-xl hover:scale-105 transition-all">
                진짜 전문가에게 문의하세요.
              </button>
           </div>
        </div>
      </section>

      {/* 5. Certificates */}
      <section className="h-screen snap-start flex flex-col justify-center bg-white overflow-hidden">
        <div className="text-center mb-10 px-6">
          <h2 className="text-3xl md:text-6xl font-black text-gray-900 tracking-tighter">
            실제 운영 경험과<br />성과로 증명합니다.
          </h2>
        </div>
        <div className="relative w-full overflow-hidden bg-gray-50 py-10 border-y border-gray-100">
           <div className="flex animate-scroll-left-fast w-max">
             {[...Array(24)].map((_, i) => (
               <div key={i} className="relative w-[180px] md:w-[280px] aspect-[3/4] mx-2 md:mx-4 bg-white shadow-md rounded-2xl overflow-hidden">
                  <Image src={`/uploads/certificates/cert${(i % 8) + 1}.png`} alt="cert" fill className="object-cover p-2" unoptimized 
                  onError={(e) => (e.currentTarget.style.opacity='0.2')}/>
                  <div className="absolute inset-0 flex items-center justify-center text-[10px] text-gray-300 pointer-events-none">CERTIFICATE</div>
               </div>
             ))}
           </div>
        </div>
      </section>

      {/* 6. Promises */}
      <section className="h-screen snap-start flex flex-col justify-center bg-gray-50 px-6">
        <div className="max-w-5xl mx-auto w-full">
            <div className="text-center mb-10 md:mb-16">
               <h3 className="text-2xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-4">
                '플레이스 노출 순위' 물론 중요합니다.<br />
                다만! <span className="text-orange-600 underline">효율적인 마케팅</span>을 해야합니다.
               </h3>
            </div>
            <div className="grid md:grid-cols-5 gap-4">
               <div className="md:col-span-2 flex flex-col justify-center">
                  <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter leading-tight">
                    그래서<br />비즈온은<br /><span className="text-orange-600">5가지 약속</span>을<br />만들었습니다.
                  </h2>
               </div>
               <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { t: '과장·허위 광고 NO', d: '무작정 영업 대신, 기존 광고주 관리에 집중합니다.' },
                    { t: '상권 맞춘 견적', d: '상권과 업종에 딱 맞는 합리적 비용만 제안합니다.' },
                    { t: '불법 트래픽 NO', d: '지속 가능한 성과를 위해 편법을 절대 쓰지 않습니다.' },
                    { t: '오프라인 케어', d: '매장 컨디션까지 현장 전문가가 함께 고민합니다.' },
                    { t: '24/7 전담 소통', d: '필요할 때 언제든 1:1 전담 소통이 가능합니다.' },
                  ].map((p, i) => (
                    <div key={i} className={`p-6 rounded-2xl bg-white border border-gray-200 shadow-sm ${i === 4 ? 'sm:col-span-2' : ''}`}>
                       <h4 className="font-black text-gray-900 mb-1">{p.t}</h4>
                       <p className="text-gray-500 text-sm leading-snug">{p.d}</p>
                    </div>
                  ))}
               </div>
            </div>
        </div>
      </section>

      {/* 7. Process */}
      <section id="process" className="h-screen snap-start flex flex-col justify-center bg-white px-6">
        <div className="max-w-5xl mx-auto w-full">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-2">마케팅 성공방식</h2>
            <p className="text-gray-500 font-bold text-lg">성공의 <span className="text-orange-600 text-xl">수레바퀴</span></p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
              {[
                  { id: '01', t: '매장 점검 및 진단' },
                  { id: '02', t: '맞춤형 마케팅 설계' },
                  { id: '03', t: '마케팅 상품 실행' },
                  { id: '04', t: '성과 분석 및 조정' },
              ].map((item, i) => (
                <div key={i} className="bg-gray-50 p-8 rounded-3xl border border-gray-100 flex items-center gap-6">
                  <div className="text-3xl font-black text-orange-600/30">{item.id}</div>
                  <h3 className="text-xl md:text-2xl font-black text-gray-900">{item.t}</h3>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* 8. Review */}
      <section id="review" className="h-screen snap-start flex flex-col justify-center bg-gray-900 px-6 text-white text-center">
        <div className="max-w-5xl mx-auto w-full">
          <h2 className="text-3xl md:text-5xl font-black mb-12">사장님들의 <span className="text-orange-600">진짜 후기</span></h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { n: '이OO 대표님', b: '가맹점주', q: '매출이 30% 이상 상승했습니다.' },
              { n: '김사장님', b: '음식점 운영', q: '플레이스 장악이 이렇게 중요한지 처음 알았어요.' },
              { n: '박대표님', b: '카페 운영', q: '역시 전문가는 다릅니다. 방향키를 잡았어요.' },
            ].map((r, i) => (
              <div key={i} className="bg-white/5 p-8 rounded-3xl border border-white/10 flex flex-col items-center">
                <p className="text-lg italic mb-6 flex-1">"{r.q}"</p>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 text-yellow-500 fill-yellow-500" />)}
                </div>
                <div className="text-sm">
                  <span className="font-bold">{r.n}</span>
                  <span className="text-gray-500 ml-2">{r.b}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Contact */}
      <section id="contact-form" className="h-screen snap-start flex flex-col md:flex-row bg-white overflow-hidden">
        <div className="w-full md:w-5/12 bg-black text-white p-10 flex flex-col justify-center relative">
          <Image src="/uploads/meeting-1.png" alt="bg" fill className="object-cover opacity-20 grayscale" unoptimized />
          <div className="relative z-10 space-y-4">
            <h2 className="text-4xl md:text-6xl font-black leading-tight text-orange-600">진짜 전문가에게<br />맡기세요.</h2>
            <div className="pt-6">
               <p className="text-gray-400 font-bold mb-1">문의 전화</p>
               <p className="text-4xl md:text-5xl font-black">1666-0865</p>
            </div>
          </div>
        </div>
        <div className="w-full md:w-7/12 p-10 flex flex-col justify-center overflow-y-auto">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto w-full">
                <h3 className="text-2xl font-black">무료 진단 신청</h3>
                <input type="text" required placeholder="상호명" value={formData.brandName} onChange={(e) => setFormData({...formData, brandName: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-orange-600" />
                <input type="text" required placeholder="지역" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-orange-600" />
                <input type="text" required placeholder="이름" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-orange-600" />
                <input type="tel" required placeholder="연락처" value={formData.contact} onChange={(e) => setFormData({...formData, contact: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-orange-600" />
                <textarea required placeholder="상세 문의" value={formData.concern} onChange={(e) => setFormData({...formData, concern: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-orange-600 h-24" />
                <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-orange-600 text-white rounded-xl font-bold text-lg hover:bg-orange-700 transition-all">신청하기</button>
              </form>
            ) : (
                <div className="text-center py-10">
                  <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-black">신청 완료!</h3>
                </div>
            )}
        </div>
      </section>

      {/* Footer */}
      <footer className="snap-start py-12 px-6 bg-black text-gray-500 text-center text-sm">
        <p>© 2025 비즈온마케팅. All rights reserved.</p>
        <p className="mt-2 text-orange-900">우리는 매출 실험을 설계합니다.</p>
      </footer>
    </div>
  );
}
