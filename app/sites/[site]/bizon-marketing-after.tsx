'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { 
  Phone, 
  MapPin, 
  Star, 
  CheckCircle, 
  ArrowRight,
  ArrowDown,
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
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-48px)] max-w-lg px-4">
        <button 
          onClick={() => scrollToSection('contact-form')}
          className="w-full py-4 md:py-5 bg-linear-to-r from-orange-600 to-red-600 text-white text-lg md:text-2xl font-black rounded-3xl shadow-[0_20px_50px_-10px_rgba(234,88,12,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 border border-white/20"
        >
          매장에서 새는 구멍 3개 찾기
          <ArrowRight className="h-6 w-6 md:h-8 md:w-8" />
        </button>
      </div>

      {/* 2. Reason - Adjusted Images */}
      <section id="reason" className="min-h-screen snap-start flex flex-col justify-center bg-white px-6 pt-24 pb-16">
        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-5xl font-black leading-tight text-gray-900 tracking-tight">
              프랜차이즈라서<br />
              <span className="text-orange-600">마케팅이 의미 없다고 생각하시나요?</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-[1fr_auto_1fr] gap-4 md:gap-6 items-center mb-8">
            <div className="text-center group">
              <div className="relative aspect-video rounded-3xl overflow-hidden shadow-xl border border-gray-100 mb-3 bg-gray-50 group-hover:scale-[1.01] transition-transform duration-500">
                <Image src="/assets/bizon/a1.jpg" alt="검색시 누가봐도 가고 싶은곳" fill className="object-cover" unoptimized />
              </div>
              <h3 className="text-lg md:text-2xl font-black text-gray-900">검색시 누가봐도 가고 싶은곳<span className="text-orange-600">?</span></h3>
            </div>
            
            <div className="hidden md:flex items-center justify-center">
              <ArrowRight className="w-12 h-12 text-orange-600" strokeWidth={3} />
            </div>
            
            <div className="text-center group">
              <div className="relative aspect-video rounded-3xl overflow-hidden shadow-xl border border-gray-100 mb-3 bg-gray-50 group-hover:scale-[1.01] transition-transform duration-500">
                <Image src="/assets/bizon/a2.jpg" alt="리뷰가 많고 후기가 좋은 곳" fill className="object-cover" unoptimized />
              </div>
              <h3 className="text-lg md:text-2xl font-black text-gray-900">리뷰가 많고 후기가 좋은 곳<span className="text-orange-600">!</span></h3>
            </div>
          </div>

          <div className="text-center p-6 md:p-10 rounded-[32px] bg-linear-to-br from-gray-900 to-black text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-orange-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <p className="text-base md:text-xl lg:text-2xl font-black leading-tight relative z-10">
              지점 별로 <span className="text-orange-500 underline decoration-2 underline-offset-4">플레이스 마케팅</span> 관리를<br />
              <span className="text-xl md:text-3xl lg:text-4xl mt-4 block font-black">제대로 해주는 본사는 <span className="text-yellow-400">'없습니다'</span></span>
            </p>
          </div>
        </div>
      </section>

      {/* 3. Stats - Before/After Vertical Comparison - Strictly Compact */}
      <section className="min-h-screen snap-start flex flex-col justify-center bg-gray-50 px-6 pt-12 pb-8">
        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center mb-4">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-gray-900 leading-tight tracking-tight">
              마케팅의 부재로 인해 새고 있던 잠재 고객들,<br />
              <span className="text-orange-600">비즈온이 숫자로 증명합니다.</span>
            </h2>
          </div>

          <div className="flex flex-col items-center gap-2 md:gap-4">
             {/* Before Card - Much Smaller */}
             <div className="relative rounded-2xl overflow-hidden shadow-md border border-gray-200 bg-white w-full max-w-sm">
                <div className="absolute top-2 left-4 z-20">
                  <span className="px-2.5 py-0.5 bg-gray-900 text-white rounded-full text-[10px] md:text-xs font-black">비즈온 도입 전</span>
                </div>
                <div className="relative h-[140px] md:h-[180px]">
                   <Image src="/assets/bizon/b3.jpg" alt="Before Background" fill className="object-cover opacity-20" unoptimized />
                   <Image src="/assets/bizon/1.jpg" alt="Before" fill className="object-cover mix-blend-multiply opacity-80" unoptimized />
                   <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/80 to-transparent z-10" />
                   <div className="absolute inset-x-5 bottom-3 z-20 text-white">
                      <p className="text-xs md:text-sm font-bold opacity-90">관리가 절실했던 상태</p>
                   </div>
                </div>
             </div>

             {/* Decorative Arrow - Tiny */}
             <div className="flex items-center justify-center -my-3 z-30">
                <div className="relative">
                  <div className="absolute inset-0 bg-linear-to-b from-orange-500 to-red-600 rounded-full blur-lg opacity-40 animate-pulse" />
                  <div className="relative bg-linear-to-b from-orange-500 to-red-600 rounded-full p-2 shadow-xl border-2 border-white">
                    <ArrowDown className="w-4 h-4 md:w-5 md:h-5 text-white" strokeWidth={3} />
                  </div>
                </div>
             </div>

             {/* After Card - Compact & Wide */}
             <div className="relative rounded-[32px] overflow-hidden shadow-[0_15px_60px_-15px_rgba(234,88,12,0.3)] bg-white w-full max-w-4xl border border-gray-100">
                <div className="absolute top-4 left-6 z-20">
                  <span className="px-4 py-1.5 bg-orange-600 text-white rounded-full text-xs font-black shadow-lg">비즈온 도입 후</span>
                </div>
                <div className="relative h-[200px] md:h-[280px]">
                   <Image src="/assets/bizon/2.jpg" alt="After" fill className="object-contain p-2" unoptimized />
                   
                   <div className="absolute right-6 md:right-10 bottom-4 md:bottom-8 z-20 text-right bg-white/80 backdrop-blur-sm p-3 rounded-2xl md:bg-transparent md:p-0 md:backdrop-blur-none border border-orange-100/50 md:border-none shadow-sm md:shadow-none">
                      <p className="text-lg md:text-xl font-bold text-orange-600 mb-0 md:mb-1 shadow-sm">핵심 지표 폭발적 성장</p>
                      <h3 className="text-4xl md:text-7xl font-black tracking-tighter leading-none text-gray-900">842% <span className="text-2xl md:text-4xl text-orange-600">성장</span></h3>
                   </div>
                </div>
             </div>
          </div>

        </div>
      </section>

      {/* 4. Differentiation - Redesigned with Tighter Spacing */}
      <section className="min-h-screen snap-start flex flex-col justify-center bg-black px-6 pt-20 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(234,88,12,0.08),transparent_70%)]" />
        
        <div className="max-w-5xl mx-auto w-full relative z-10">
           <div className="text-center mb-10">
              <h2 className="text-blue-500 text-2xl md:text-4xl lg:text-5xl font-black mb-6 tracking-tight">마케팅도 똑같습니다</h2>
              
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 max-w-2xl mx-auto shadow-2xl">
                <p className="text-lg md:text-2xl lg:text-3xl font-black text-white leading-tight tracking-tight">
                  가짜 마케팅 전문가가 판치는<br />
                  자영업 마케팅 시장,<br />
                  <span className="text-orange-500 underline decoration-2 underline-offset-4">진짜 전문가인지 확인해 보세요.</span>
                </p>
              </div>
           </div>

           <div className="grid md:grid-cols-2 gap-5 px-2 mb-12">
              {[
                { txt: '우리의 목표는 단순히\n순위를 올리는 게 아닙니다.', bg: '/uploads/meeting-1.png' },
                { txt: '고객이 올 수밖에 없는\n구조를 만들고\n\n그 경험을 매출로 전환하는 것.', bg: '/uploads/meeting-2.png' }
              ].map((b, i) => (
                <div key={i} className={`relative h-[200px] md:h-[240px] rounded-3xl overflow-hidden border border-white/10 group ${i === 1 ? 'md:translate-y-6' : ''}`}>
                  <Image src={b.bg} alt="bg" fill className="object-cover opacity-20 group-hover:opacity-35 transition-all duration-500" unoptimized />
                  <div className="absolute inset-0 flex items-center justify-center p-5 bg-black/40">
                    <h3 className="text-base md:text-xl font-black text-white text-center whitespace-pre-line leading-relaxed">
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

           <div className="text-center">
              <button 
                onClick={() => scrollToSection('contact-form')} 
                className="group relative px-8 py-4 bg-orange-600 text-white rounded-3xl text-lg md:text-xl font-black shadow-2xl hover:bg-orange-700 transition-all overflow-hidden"
              >
                <span className="relative z-10">진짜 전문가에게 문의하세요.</span>
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </button>
           </div>
        </div>
      </section>

      {/* 5. Certificates - Original Images Only */}
      <section className="h-screen snap-start flex flex-col justify-center bg-white overflow-hidden">
        <div className="text-center mb-10 px-6">
          <h2 className="text-3xl md:text-6xl font-black text-gray-900 tracking-tighter">
            실제 운영 경험과<br />성과로 증명합니다.
          </h2>
        </div>
        <div className="relative w-full overflow-hidden bg-gray-50 py-10 border-y border-gray-100">
           <div className="flex animate-scroll-left-fast w-max">
             {[...Array(24)].map((_, i) => {
                const certImages = [
                  `/uploads/certificates/cert1.png`,
                  `/uploads/certificates/cert2.png`,
                  `/uploads/certificates/cert3.png`,
                  `/uploads/certificates/cert4.png`,
                  `/uploads/certificates/cert5.png`,
                  `/uploads/certificates/cert6.png`,
                  `/uploads/certificates/cert7.png`,
                  `/uploads/certificates/cert8.png`,
                ];
                const img = certImages[i % certImages.length];
                return (
                  <div key={i} className="relative w-[200px] md:w-[320px] aspect-3/4 mx-3 md:mx-6 bg-white shadow-xl rounded-[32px] overflow-hidden border border-gray-100/50">
                      <Image 
                        src={img} 
                        alt="cert" 
                        fill 
                        className="object-cover" 
                        unoptimized 
                        onError={(e) => (e.currentTarget.style.opacity='0.2')}
                      />
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="relative w-1/2 h-1/4 opacity-[0.05] grayscale">
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
                );
             })}
           </div>
        </div>
      </section>

      <section className="min-h-screen snap-start flex flex-col justify-center bg-gray-50 px-6 pt-24 pb-20">
        <div className="max-w-6xl mx-auto w-full">
            <div className="text-center mb-8 md:mb-12">
               <p className="text-lg md:text-2xl font-bold text-gray-500 mb-2">대표님! 아직도 플레이스 순위에만 집중하시나요?</p>
               <h3 className="text-2xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-2 tracking-tighter">
                '플레이스 노출 순위' 물론 중요합니다.<br />
                다만! <span className="text-orange-600 underline">효율적인 마케팅</span>을 해야합니다.
               </h3>
            </div>
            <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-center">
               <div className="md:col-span-5 flex flex-col justify-center">
                  <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter leading-tight">
                    그래서<br />비즈온은<br /><span className="text-orange-600">4가지 약속</span>을<br />만들었습니다.
                  </h2>
               </div>
               <div className="md:col-span-7 grid grid-cols-1 gap-3 md:gap-4">
                  {[
                    { t: '영업광고 전화는 일절 안 합니다.', d: '저희와 함께 해주는 광고주님 관리에 더 집중합니다.' },
                    { t: '불법/트래픽은 절대 사용하지 않습니다.', d: '잠깐의 노출보다 더 값진 건강한 플레이스를 만들어 지속되는 성과를 만듭니다.' },
                    { t: '가게에 꼭 필요한 마케팅만 집중적으로 진행합니다.', d: '지역상권과 업종에 맞춘 고효율의 마케팅만 진행합니다.' },
                    { t: '온라인 마케팅이 다가 아닙니다.', d: '오프라인 매장에 도움이 되는 마케팅까지 함께 도와드립니다. (단골관리팁, 포스터 디자인 등 매장 컨디션 관리를 함께 합니다)' },
                  ].map((p, i) => (
                    <div key={i} className="p-4 md:p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                       <h4 className="font-black text-base md:text-xl text-gray-900 mb-1">{p.t}</h4>
                       <p className="text-gray-500 text-sm md:text-base font-medium leading-relaxed break-keep">{p.d}</p>
                    </div>
                  ))}
               </div>
            </div>
        </div>
      </section>

      {/* 7. Process - Success Cycle Slimmed */}
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
            {/* Rotating Outer Ring - BEHIND cards */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-5">
               <div className="relative w-[320px] h-[320px] md:w-[600px] md:h-[600px] opacity-30">
                 <RotatingOuterRing />
               </div>
            </div>

            {/* Center Logo - IN FRONT of everything */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
               <div className="relative w-[200px] h-[200px] md:w-[350px] md:h-[350px] opacity-100 drop-shadow-[0_0_40px_rgba(255,255,255,0.9)]">
                 <RotatingBizonO />
               </div>
            </div>

            {/* Success Steps - MIDDLE layer */}
            <div className="relative z-20 w-full grid grid-cols-1 md:grid-cols-2 gap-x-12 md:gap-x-56 gap-y-12 md:gap-y-20">
                {[
                  { id: '01', t: '매장 점검 및 진단', color: 'from-blue-500/20 to-blue-600/20' },
                  { id: '02', t: '맞춤형 마케팅 설계', color: 'from-amber-500/20 to-amber-600/20' },
                  { id: '03', t: '마케팅 상품 실행', color: 'from-purple-500/20 to-purple-600/20' },
                  { id: '04', t: '성과 분석 및 전략 조정', color: 'from-orange-500/20 to-orange-600/20' },
                ].map((item, i) => (
                  <div 
                    key={i} 
                    className="group bg-white/95 backdrop-blur-xl p-10 md:p-16 rounded-[40px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] border border-gray-100/50 flex flex-col justify-center hover:scale-105 hover:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.25)] transition-all duration-500 min-h-[180px] md:min-h-[220px]"
                  >
                    <div className="flex items-center gap-6">
                      <div className={`text-4xl md:text-5xl font-black bg-linear-to-r ${item.color} bg-clip-text text-transparent opacity-40`}>
                        {item.id}
                      </div>
                      <h3 className="text-2xl md:text-4xl font-black text-gray-900 leading-tight">
                        {item.t}
                      </h3>
                    </div>
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
          <div className="text-center mb-12 md:mb-16">
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

      {/* 9. Chat Gallery - Optimized for Screen Fit */}
      <section className="min-h-screen snap-start flex flex-col justify-center bg-gray-50 overflow-hidden px-6 relative pt-20 pb-12">
        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center mb-8">
             <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-3 tracking-tight text-gray-900">
               수많은 사장님들과의<br />
               진한 <span className="text-orange-600">소통 기록</span>
             </h2>
             <p className="text-base md:text-lg text-gray-600 font-bold">비즈온마케팅은 '결과'만큼 '과정'에서의 소통을 중요시합니다</p>
          </div>

          <div className="relative h-[350px] md:h-[450px] overflow-hidden rounded-[40px] border border-gray-100 bg-white/50 backdrop-blur-sm p-4">
             <div className="absolute top-0 left-0 right-0 h-16 bg-linear-to-b from-gray-50 to-transparent z-10 pointer-events-none" />
             <div className="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-gray-50 to-transparent z-10 pointer-events-none" />

             <div className="flex gap-3 md:gap-6 h-full px-2 overflow-hidden">
                {[...Array(4)].map((_, colIdx) => (
                  <div 
                    key={colIdx} 
                    className={`flex-1 flex flex-col gap-3 md:gap-4 animate-scroll-up ${colIdx % 2 === 0 ? '' : 'mt-16'}`}
                    style={{ animationDuration: `${22 + colIdx * 2}s` }}
                  >
                    {[...Array(2)].map((_, setIdx) => (
                      <div key={setIdx} className="flex flex-col gap-3 md:gap-4">
                        {[
                          { msg: '대표님! 네이버 순위가 눈에 띄게 올랐어요 대박!!', initial: '박', color: 'bg-orange-100 text-orange-600' },
                          { msg: '이번 주 매출 최고 찍었습니다 고생하셨어요', initial: '김', color: 'bg-blue-100 text-blue-600' },
                          { msg: '리뷰 답글 달아주신거 보고 단골분이 칭찬하시네요 ㅎㅎ', initial: '최', color: 'bg-green-100 text-green-600' },
                          { msg: '믿고 맡기길 잘했네요 다음 달도 고고!', initial: '이', color: 'bg-purple-100 text-purple-600' },
                          { msg: '전화 문의가 지난주보다 2배는 많아진거 같아요', initial: '정', color: 'bg-indigo-100 text-indigo-600' },
                          { msg: '상권분석 해주신게 진짜 신의 한수였네요', initial: '강', color: 'bg-rose-100 text-rose-600' },
                        ].map((item, i) => (
                          <div key={`${setIdx}-${i}-${colIdx}`} className="bg-white rounded-2xl p-4 shadow-lg border border-gray-50/50 hover:scale-105 transition-transform">
                            <div className="flex items-start gap-3">
                              <div className={`h-8 w-8 rounded-full ${item.color} flex items-center justify-center text-[10px] md:text-sm font-black shrink-0 shadow-inner`}>{item.initial}</div>
                              <div className="flex-1">
                                <p className="text-xs md:text-sm text-gray-800 font-medium leading-relaxed break-keep">{item.msg}</p>
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

      {/* 10. Contact - Final Diagnosis Form */}
      <section id="contact-form" className="min-h-screen snap-start flex flex-col md:flex-row bg-white overflow-hidden">
        <div className="w-full md:w-5/12 bg-black text-white p-10 md:p-16 flex flex-col justify-center relative">
          <Image src="/uploads/meeting-1.png" alt="bg" fill className="object-cover opacity-20 grayscale" unoptimized />
          <div className="relative z-10 space-y-8">
            <h3 className="text-orange-600 font-bold tracking-widest text-lg">CONTACT US</h3>
            <div className="space-y-4">
               <h2 className="text-2xl font-black text-gray-400">비즈온마케팅 주식회사</h2>
               <p className="text-lg md:text-xl font-bold leading-relaxed text-gray-100 break-keep">
                 실전 운영경험과 전문성으로<br />
                 진짜 매출상승을 도와드리겠습니다.
               </p>
            </div>
            <div className="pt-10 border-t border-white/10">
               <p className="text-gray-400 font-bold mb-2">대표번호</p>
               <p className="text-4xl md:text-6xl font-black text-white">1666-0865</p>
            </div>
          </div>
        </div>
        
        <div className="w-full md:w-7/12 p-8 md:p-16 flex flex-col justify-center bg-gray-50/30 overflow-y-auto">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6 max-w-xl mx-auto w-full">
                <div className="mb-6 md:mb-8">
                  <h3 className="text-2xl md:text-4xl font-black text-gray-900 mb-2 leading-tight">
                    상담이 아니라<br />
                    <span className="text-orange-600">진단부터 받으세요.</span>
                  </h3>
                  <p className="text-gray-600 font-medium text-base md:text-lg">대표님 매장에 맞는 실행 우선순위 1장으로 답합니다.</p>
                </div>
                
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-900 ml-1">상호명 *</label>
                      <input type="text" required placeholder="예: 비즈온 마케팅" value={formData.brandName} onChange={(e) => setFormData({...formData, brandName: e.target.value})} className="w-full p-4 bg-white border border-gray-200 rounded-2xl outline-none focus:border-orange-600 text-gray-900 font-medium placeholder:text-gray-400 shadow-sm" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-900 ml-1">지역 *</label>
                      <input type="text" required placeholder="예: 서울시 강남구" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full p-4 bg-white border border-gray-200 rounded-2xl outline-none focus:border-orange-600 text-gray-900 font-medium placeholder:text-gray-400 shadow-sm" />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-900 ml-1">성함 *</label>
                      <input type="text" required placeholder="성함을 입력해주세요" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-4 bg-white border border-gray-200 rounded-2xl outline-none focus:border-orange-600 text-gray-900 font-medium placeholder:text-gray-400 shadow-sm" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-900 ml-1">연락처 *</label>
                      <input type="tel" required placeholder="010-0000-0000" value={formData.contact} onChange={(e) => setFormData({...formData, contact: e.target.value})} className="w-full p-4 bg-white border border-gray-100 rounded-2xl outline-none focus:border-orange-600 text-gray-900 font-medium placeholder:text-gray-400 shadow-sm" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-900 ml-1">상세 문의내용 *</label>
                    <textarea required placeholder="구체적인 고민이나 궁금하신 점을 남겨주세요." value={formData.concern} onChange={(e) => setFormData({...formData, concern: e.target.value})} className="w-full p-4 bg-white border border-gray-100 rounded-2xl outline-none focus:border-orange-600 text-gray-900 font-medium placeholder:text-gray-400 h-32 md:h-40 resize-none shadow-sm" />
                  </div>
                </div>

                <div className="pt-4">
                  <button type="submit" disabled={isSubmitting} className="w-full py-5 bg-orange-600 text-white rounded-2xl font-black text-xl hover:bg-orange-700 transition-all shadow-xl hover:shadow-orange-600/40 flex items-center justify-center gap-2">
                    {isSubmitting ? '진단 요청 중...' : '우리 매장 지역장악 플랜 받기'}
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
                  <p className="text-gray-500 text-xl font-medium leading-relaxed">진단 리포트 작성을 위해<br />담당자가 곧 연락드리겠습니다.</p>
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
