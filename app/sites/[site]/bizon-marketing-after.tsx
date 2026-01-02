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
              <div className="relative w-[260px] h-[80px] md:w-[460px] md:h-[120px]">
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
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="relative w-2/3 h-1/3 opacity-[0.08] grayscale">
                      <Image 
                        src="/bizon-logo.png" 
                        alt="watermark" 
                        fill 
                        className="object-contain" 
                        unoptimized 
                      />
                    </div>
                  </div>
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

      {/* 7. Process - Success Cycle Redesign */}
      <section id="process" className="h-screen snap-start flex flex-col justify-center bg-white overflow-hidden px-6 relative">
        <div className="max-w-6xl mx-auto w-full relative">
          
          <div className="text-center mb-12 relative z-20">
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-4 tracking-tight">
              마케팅 성공방식
            </h2>
            <p className="text-xl md:text-2xl text-gray-500 font-bold uppercase tracking-widest">
              멈추지 않는 성공의 <span className="text-orange-600">수레바퀴</span>
            </p>
          </div>

          <div className="relative flex items-center justify-center min-h-[500px] md:min-h-[600px]">
            {/* Background Rotating Logo */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
               <div className="relative w-[320px] h-[320px] md:w-[580px] md:h-[580px] opacity-[0.35]">
                 <RotatingOuterRing />
                 <RotatingBizonO />
               </div>
            </div>

            {/* Staggered Grid of Success Steps */}
            <div className="relative z-10 w-full grid grid-cols-1 md:grid-cols-2 gap-x-12 md:gap-x-56 gap-y-12 md:gap-y-20">
                {[
                  { id: '01', t: '매장 점검 및 진단', desc: '현재 상태를 철저히 분석하여\n근본적인 문제점을 파악합니다.', color: 'from-blue-500/20 to-blue-600/20' },
                  { id: '02', t: '맞춤형 마케팅 설계', desc: '전담 기획팀이 상권과 업종에\n최적화된 전략을 수립합니다.', color: 'from-amber-500/20 to-amber-600/20' },
                  { id: '03', t: '마케팅 상품 실행', desc: '검색 노출부터 브랜딩까지\n즉각적인 실행에 착수합니다.', color: 'from-purple-500/20 to-purple-600/20' },
                  { id: '04', t: '성과 분석 및 조정', desc: '실데이터 기반 분석을 통해\n성과를 끊임없이 최적화합니다.', color: 'from-orange-500/20 to-orange-600/20' },
                ].map((item, i) => (
                  <div 
                    key={i} 
                    className="group bg-white/95 backdrop-blur-xl p-8 md:p-12 rounded-[40px] shadow-[0_30px_70px_-20px_rgba(0,0,0,0.12)] border border-gray-100 flex flex-col justify-center hover:scale-105 transition-all duration-500"
                  >
                    <div className="flex items-center gap-6 mb-4">
                      <div className={`text-4xl md:text-5xl font-black bg-linear-to-r ${item.color} bg-clip-text text-transparent opacity-40`}>
                        {item.id}
                      </div>
                      <h3 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight">
                        {item.t}
                      </h3>
                    </div>
                    <p className="text-gray-500 text-lg md:text-xl font-medium whitespace-pre-line leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* 8. Review - Premium Design */}
      <section id="review" className="h-screen snap-start flex flex-col justify-center bg-gray-900 px-6 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/40 pointer-events-none" />
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="text-center mb-16 md:mb-20">
            <span className="inline-block px-5 py-2 bg-orange-700/20 text-orange-600 rounded-full text-sm font-black mb-6 border border-orange-700/30 tracking-widest uppercase">
              Real Review
            </span>
            <h2 className="text-4xl md:text-6xl font-black">
              사장님들의 <span className="text-orange-600">진짜 이야기</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                name: '이OO 대표님', 
                business: '프랜차이즈 가맹점주',
                quote: '피드백과 자영업 맞춤 케어 해주셔서 비즈온과 함께할 생각입니다. 매출이 실제로 30% 이상 상승했습니다.',
                rating: 5
              },
              { 
                name: '김사장님', 
                business: '음식점 운영 12년차',
                quote: '대표님! 매달 신경쓸수록 방문 고객이 늘었어요. 플레이스 장악이 이렇게 중요한지 이제야 알았습니다.',
                rating: 5
              },
              { 
                name: '박대표님', 
                business: '수도권 카페 브랜딩',
                quote: '막연했던 어려움을 잘 이끌어주셔서 이제야 방향키를 제대로 잡아갑니다! 역시 전문가는 다릅니다.',
                rating: 5
              },
            ].map((review, i) => (
              <div key={i} className="group">
                <div className="bg-white/5 backdrop-blur-md rounded-[40px] p-10 md:p-12 border border-white/10 hover:border-orange-600/50 transition-all h-full flex flex-col hover:translate-y-[-10px] duration-500">
                  <span className="inline-block px-4 py-1 bg-orange-600 text-white text-[10px] font-black rounded mb-8 w-fit tracking-tighter">
                    BIZON SUCCESS
                  </span>
                  <p className="text-gray-200 text-xl md:text-2xl font-bold leading-relaxed mb-10 flex-1 break-keep">
                    "{review.quote}"
                  </p>
                  <div className="flex gap-1.5 mb-10">
                    {[...Array(review.rating)].map((_, j) => (
                      <Star key={j} className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                  <div className="flex items-center gap-5">
                    <div className="h-14 w-14 rounded-2xl bg-orange-600/20 flex items-center justify-center border border-orange-600/30">
                      <Users className="h-7 w-7 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-black text-white text-xl">{review.name}</p>
                      <p className="text-gray-500 font-bold">{review.business}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Chat Gallery - Scrolling Owner Messages */}
      <section className="h-screen snap-start flex flex-col justify-center bg-gray-50 overflow-hidden px-6 relative">
        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center mb-16 md:mb-20">
             <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
               수많은 사장님들과의<br />
               진한 <span className="text-orange-600">소통 기록</span>
             </h2>
             <p className="text-xl md:text-2xl text-gray-500 font-bold">비즈온마케팅은 '결과'만큼 '과정'에서의 소통을 중요시합니다</p>
          </div>

          <div className="relative h-[450px] md:h-[550px] overflow-hidden rounded-[50px] border border-gray-100 bg-white/50 backdrop-blur-sm p-4">
             <div className="absolute top-0 left-0 right-0 h-24 bg-linear-to-b from-gray-50 to-transparent z-10 pointer-events-none" />
             <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-gray-50 to-transparent z-10 pointer-events-none" />

             <div className="flex gap-4 md:gap-8 h-full px-4 overflow-hidden">
                {[...Array(4)].map((_, colIdx) => (
                  <div 
                    key={colIdx} 
                    className={`flex-1 flex flex-col gap-4 md:gap-6 animate-scroll-up ${colIdx % 2 === 0 ? '' : 'mt-20'}`}
                    style={{ animationDuration: `${20 + colIdx * 2}s` }}
                  >
                    {[...Array(2)].map((_, setIdx) => (
                      <div key={setIdx} className="flex flex-col gap-4 md:gap-6">
                        {[
                          { msg: '대표님! 네이버 순위가 눈에 띄게 올랐어요 대박!!', initial: '박', color: 'bg-orange-100 text-orange-600' },
                          { msg: '이번 주 매출 최고 찍었습니다 고생하셨어요', initial: '김', color: 'bg-blue-100 text-blue-600' },
                          { msg: '리뷰 답글 달아주신거 보고 단골분이 칭찬하시네요 ㅎㅎ', initial: '최', color: 'bg-green-100 text-green-600' },
                          { msg: '믿고 맡기길 잘했네요 다음 달도 고고!', initial: '이', color: 'bg-purple-100 text-purple-600' },
                          { msg: '전화 문의가 지난주보다 2배는 많아진거 같아요', initial: '정', color: 'bg-indigo-100 text-indigo-600' },
                          { msg: '상권분석 해주신게 진짜 신의 한수였네요', initial: '강', color: 'bg-rose-100 text-rose-600' },
                        ].map((item, i) => (
                          <div key={`${setIdx}-${i}-${colIdx}`} className="bg-white rounded-3xl p-5 shadow-xl border border-gray-50/50 hover:scale-105 transition-transform">
                            <div className="flex items-start gap-4">
                              <div className={`h-10 w-10 rounded-full ${item.color} flex items-center justify-center text-sm font-black shrink-0 shadow-inner`}>{item.initial}</div>
                              <div className="flex-1">
                                <p className="text-sm md:text-base text-gray-800 font-medium leading-relaxed break-keep">{item.msg}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                ))}
             </div>
          </div>
        </div>
      </section>

      {/* 9. Contact - High Visibility Form */}
      <section id="contact-form" className="h-screen snap-start flex flex-col md:flex-row bg-white overflow-hidden">
        <div className="w-full md:w-5/12 bg-black text-white p-12 md:p-20 flex flex-col justify-center relative">
          <Image src="/uploads/meeting-1.png" alt="bg" fill className="object-cover opacity-20 grayscale" unoptimized />
          <div className="relative z-10 space-y-6">
            <h3 className="text-orange-600 font-bold tracking-widest text-lg">CONTACT US</h3>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight text-white mb-8">
              진짜 전문가에게<br />
              <span className="text-orange-600">맡기세요.</span>
            </h2>
            <div className="pt-10 border-t border-white/10">
               <p className="text-gray-400 font-bold mb-2">문의 전화</p>
               <p className="text-4xl md:text-6xl font-black text-white">1666-0865</p>
            </div>
          </div>
        </div>
        
        <div className="w-full md:w-7/12 p-8 md:p-20 flex flex-col justify-center bg-gray-50/30 overflow-y-auto">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6 max-w-xl mx-auto w-full">
                <div className="mb-8">
                  <h3 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">무료 진단 신청</h3>
                  <p className="text-gray-600 font-medium">상담을 통해 가능/불가능을 정직하게 말씀드립니다.</p>
                </div>
                
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-sm font-bold text-gray-900 ml-1">상호명</label>
                      <input type="text" required placeholder="매장명을 입력해주세요" value={formData.brandName} onChange={(e) => setFormData({...formData, brandName: e.target.value})} className="w-full p-4 bg-white border border-gray-200 rounded-2xl outline-none focus:border-orange-600 text-gray-900 font-medium placeholder:text-gray-400 shadow-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-bold text-gray-900 ml-1">지역</label>
                      <input type="text" required placeholder="예) 서울 강북구" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full p-4 bg-white border border-gray-200 rounded-2xl outline-none focus:border-orange-600 text-gray-900 font-medium placeholder:text-gray-400 shadow-sm" />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-sm font-bold text-gray-900 ml-1">신청자 성함</label>
                      <input type="text" required placeholder="이름을 입력해주세요" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-4 bg-white border border-gray-200 rounded-2xl outline-none focus:border-orange-600 text-gray-900 font-medium placeholder:text-gray-400 shadow-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-bold text-gray-900 ml-1">연락처</label>
                      <input type="tel" required placeholder="휴대폰 번호 입력" value={formData.contact} onChange={(e) => setFormData({...formData, contact: e.target.value})} className="w-full p-4 bg-white border border-gray-200 rounded-2xl outline-none focus:border-orange-600 text-gray-900 font-medium placeholder:text-gray-400 shadow-sm" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-gray-900 ml-1">상세 문의내용</label>
                    <textarea required placeholder="현재 고민이신 부분을 자유롭게 적어주세요." value={formData.concern} onChange={(e) => setFormData({...formData, concern: e.target.value})} className="w-full p-4 bg-white border border-gray-200 rounded-2xl outline-none focus:border-orange-600 text-gray-900 font-medium placeholder:text-gray-400 h-32 md:h-40 resize-none shadow-sm" />
                  </div>
                </div>

                <div className="pt-4">
                  <button type="submit" disabled={isSubmitting} className="w-full py-5 bg-orange-600 text-white rounded-2xl font-black text-xl hover:bg-orange-700 transition-all shadow-xl hover:shadow-orange-600/40 flex items-center justify-center gap-2">
                    {isSubmitting ? '접수 중...' : '우리 매장 지역장악 플랜 받기'}
                    {!isSubmitting && <ArrowRight className="h-6 w-6" />}
                  </button>
                </div>
              </form>
            ) : (
                <div className="text-center py-10 md:py-20">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-3xl font-black mb-4 text-gray-900">신청이 완료되었습니다!</h3>
                  <p className="text-gray-500 text-xl">담당자가 확인 후 순차적으로 연락드리겠습니다.</p>
                </div>
            )}
        </div>
      </section>

      {/* Footer - Restored Original Content */}
      <footer className="snap-start py-20 pb-40 px-6 bg-black text-gray-500 text-center text-base border-t border-white/5">
        <Image 
          src="/bizon-logo.png" 
          alt="비즈온" 
          width={180} 
          height={60}
          className="object-contain mx-auto mb-8 brightness-0 invert opacity-20"
          unoptimized
        />
        <div className="max-w-3xl mx-auto space-y-4">
          <p>© 2025 비즈온마케팅 주식회사. All rights reserved.</p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 text-gray-400">
             <span>대표: 양승협</span>
             <span className="hidden md:inline opacity-30">|</span>
             <span>사업자등록번호: 565-81-03594</span>
          </div>
          <p className="text-gray-400 text-sm md:text-base">
            주소: 경기도 수원시 장안구 화산로 213번길 15, 2층 201-B66
          </p>
          <p className="text-orange-700/60 mt-16 text-xl md:text-2xl font-black italic tracking-tight">
            우리는 '대행'이 아니라 매출 실험을 설계합니다.
          </p>
        </div>
      </footer>
    </div>
  );
}
