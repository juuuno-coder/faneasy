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
import { useAOS } from '@/hooks/use-aos';
import { useDataStore } from '@/lib/data-store';
import { HeroTextSequence } from '@/components/hero-text-sequence';
import { RotatingBizonO, RotatingOuterRing } from '@/components/rotating-bizon-o';
import { db } from "@/lib/firebaseClient";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { logActivity } from "@/lib/logger";

export default function BizonMarketingAfter({ site }: { site: string }) {
  // AOS 스크롤 애니메이션 초기화
  useAOS();

  const { getPageContent } = useDataStore();
  const pageContent = getPageContent(site);
  
  // 스크롤 상태 관리
  const [isScrolled, setIsScrolled] = useState(false);

  /* Scroll Snap Container Ref */
  const mainContainerRef = useRef<HTMLDivElement>(null);

  // AOS 직접 가져오기 (수동 갱신용)
  const refreshAOS = () => {
    try {
      const AOS = require('aos');
      AOS.refresh();
    } catch (e) {}
  };

  // 스크롤 이벤트 리스너 (for Navbar style)
  const handleScroll = () => {
    if (mainContainerRef.current) {
      setIsScrolled(mainContainerRef.current.scrollTop > 50);
      refreshAOS();
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
      await addDoc(collection(db, "inquiries"), {
        ...newInquiry,
        serverCreatedAt: serverTimestamp(),
      });

      // Log Activity
      await logActivity({
        type: 'inquiry',
        userName: formData.brandName,
        userEmail: formData.contact,
        action: '비즈온 마케팅 진단 요청',
        target: '진단 요청',
        subdomain: site || 'bizon'
      });

      // Send Email Notification
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.contact,
          brandName: formData.brandName,
          address: formData.address,
          concern: formData.concern,
          // userEmail is not collected, so we omit it or pass empty
        }),
      });

      // Local store update for UI
      addInquiry({
        ...newInquiry,
        id: `inq-${Date.now()}`,
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
    } catch (error) {
      console.error("Submission failed:", error);
      alert("접수 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMarketing = (item: string) => {
    setFormData(prev => ({
      ...prev,
      currentMarketing: prev.currentMarketing.includes(item)
        ? prev.currentMarketing.filter(i => i !== item)
        : [...prev.currentMarketing, item]
    }));
  };

  const toggleGoal = (item: string) => {
      setFormData(prev => ({
        ...prev,
        goal: prev.goal.includes(item)
          ? prev.goal.filter(i => i !== item)
          : [...prev.goal, item]
      }));
  };

  return (
    <div 
      ref={mainContainerRef}
      onScroll={handleScroll}
      className="min-h-screen bg-black overflow-x-hidden snap-y snap-proximity h-screen overflow-y-scroll scroll-smooth">
      {/* Fixed Header - Scroll-based styling */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md border-b border-gray-100' 
          : 'bg-transparent backdrop-blur-sm border-b border-white/10'
      }`}>
        <div className="w-full md:w-[80%] max-w-[1500px] mx-auto px-6 md:px-0 h-[80px] md:h-[100px] flex items-center justify-between transition-all duration-300">
          {/* Logo - Left */}
            <div 
              className="relative flex items-center cursor-pointer transition-all hover:scale-105 active:scale-95"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <div className="relative w-[260px] h-[80px] md:w-[460px] md:h-[120px]">
                <Image 
                  src={isScrolled ? `/bizon-logo.png?v=10` : `/bizon-logo-dark.png?v=10`} 
                  alt="비즈온" 
                  fill
                  priority
                  className="object-contain object-left transition-opacity duration-300"
                  unoptimized
                />
              </div>
            </div>

          {/* Navigation & CTA - Right */}
          <div className="flex items-center gap-8">
            <nav className={`hidden lg:flex items-center gap-8 text-base font-bold transition-colors ${
              isScrolled ? 'text-gray-600' : 'text-white'
            }`}>
              <a href="#reason" className={isScrolled ? 'hover:text-orange-700' : 'hover:text-orange-600'}>서비스 특징</a>
              <a href="#process" className={isScrolled ? 'hover:text-orange-700' : 'hover:text-orange-600'}>진행 방식</a>
              <a href="#review" className={isScrolled ? 'hover:text-orange-700' : 'hover:text-orange-600'}>고객 후기</a>
            </nav>
            <a 
              href="#contact-form"
              className={`px-6 py-3 rounded-full text-sm font-bold transition-all ${
                isScrolled 
                  ? 'bg-linear-to-r from-orange-700 to-red-500 text-white hover:shadow-lg hover:shadow-orange-700/30' 
                  : 'bg-white text-gray-900 hover:bg-gray-100'
              }`}
            >
              문의하기
            </a>
          </div>
        </div>
      </header>

      {/* VIDEO HERO Section - Full Screen */}
      <section className="relative h-screen snap-start flex items-center justify-center overflow-hidden bg-black">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/80 z-10" /> {/* Dark Overlay for Readability */}
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full object-cover scale-110"
            style={{ opacity: 0.7 }}
          >
            <source src="/videos/bizon-main.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Hero Content - Animated Text Sequence */}
        <div className="relative z-20 max-w-7xl mx-auto px-6 text-center">
          <HeroTextSequence />
        </div>
      </section>

      {/* Sticky Bottom Button - Single & Balanced */}
      <div className="fixed bottom-6 left-4 md:left-1/2 md:-translate-x-1/2 z-50 w-[calc(100%-105px)] md:w-[calc(100%-48px)] max-w-2xl md:px-0">
        <a 
          href="#contact-form"
          className="w-full py-4 bg-linear-to-r from-orange-600 to-red-600 text-white text-center text-[13px] tracking-tight md:text-xl font-bold rounded-2xl shadow-[0_10px_40px_-10px_rgba(234,88,12,0.5)] hover:scale-[1.02] hover:shadow-orange-600/50 transition-all flex items-center justify-center gap-1 md:gap-3 pr-2 md:pr-4 border border-white/20"
        >
          매장에서 새는 구멍 3개 찾기(상담문의)
          <ArrowRight className="h-4 w-4 md:h-6 md:w-6" />
        </a>
      </div>

      {/* Section 2: 프랜차이즈도 꼭 마케팅을 해야 하는 이유 */}
      <section id="reason" className="h-screen snap-start flex flex-col justify-center px-6 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center mb-12 md:mb-16" data-aos="fade-up">
            <h2 className="text-3xl md:text-5xl font-black mb-4 leading-tight">
              <span className="text-gray-900">프랜차이즈라서</span><br />
              <span className="text-orange-700">마케팅이 의미 없다고 생각하시나요?</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-12 mb-12 md:mb-16">
            {[
              { 
                text: '검색시 누가봐도 가고 싶은곳', 
                img: '/uploads/place-example-1.png',
                fallbackIcon: MapPin
              },
              { 
                text: '리뷰가 많고 후기가 좋은 곳', 
                img: '/uploads/place-example-2.png',
                fallbackIcon: Star 
              },
            ].map((item, i) => (
              <div 
                key={i} 
                className="text-center group"
                data-aos="fade-up"
                data-aos-delay={i * 100}
              >
                {/* Image Placeholder Area */}
                  <div className="relative aspect-video max-w-md mx-auto rounded-2xl overflow-hidden shadow-lg border border-gray-100 mb-4">
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-50 text-gray-400">
                    <div className="text-center p-4">
                      <item.fallbackIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                      <p className="text-sm">이미지 등록 필요<br/>(/uploads/place-example-{i+1}.png)</p>
                    </div>
                  </div>
                  <Image 
                    src={item.img}
                    alt={item.text}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                    unoptimized
                    onError={(e) => e.currentTarget.style.display = 'none'} // Hide if not found so fallback shows
                  />
                </div>
                <h3 className="text-xl md:text-3xl font-black text-gray-900 leading-tight break-keep">
                  {item.text}
                </h3>
              </div>
            ))}
          </div>

          <div 
            className="text-center p-8 md:p-10 rounded-3xl bg-linear-to-r from-orange-700 to-red-500 text-white max-w-4xl mx-auto"
            data-aos="zoom-in"
          >
            <p className="text-lg md:text-2xl font-bold leading-tight">
              지점 별로 <span className="underline decoration-2 underline-offset-8">플레이스 마케팅</span> 관리를<br />
              <span className="text-xl md:text-4xl mt-4 block px-4">제대로 해주는 본사는 <span className="text-yellow-300">'없습니다'</span></span>
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: Main Message (Success Cycle) */}
      <section className="h-screen snap-start flex flex-col justify-center bg-gray-50 overflow-hidden px-6">
        <div className="max-w-7xl mx-auto w-full">
          {/* Main Copy */}
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl md:text-5xl font-black leading-tight text-gray-900 mb-6 break-keep">
              <span className="text-orange-600">지역 장악 마케팅</span>으로<br />
              대표님의 프랜차이즈 매장을<br />
              <span className="bg-orange-100 px-2 rounded-lg">지역 1등 업체</span>로 만들겠습니다.
            </h2>
          </div>

          {/* Service Stats (Trust Indicators) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
             <div className="bg-white p-8 md:p-10 rounded-[30px] shadow-xl border border-gray-100 flex flex-col items-center justify-center text-center transform hover:scale-105 transition-transform" data-aos="fade-up" data-aos-delay="0">
               <div className="text-3xl md:text-5xl font-black text-gray-900 mb-2">300<span className="text-orange-600 text-2xl md:text-4xl">+</span></div>
               <div className="text-gray-900 font-bold text-lg md:text-xl mb-1">프랜차이즈 지점</div>
               <div className="text-gray-500 text-sm md:text-base">현재 진행 중</div>
             </div>
             <div className="bg-white p-8 md:p-10 rounded-[30px] shadow-xl border border-gray-100 flex flex-col items-center justify-center text-center transform hover:scale-105 transition-transform" data-aos="fade-up" data-aos-delay="100">
               <div className="text-3xl md:text-5xl font-black text-gray-900 mb-2">4.8<span className="text-orange-600 text-2xl md:text-4xl">/5.0</span></div>
               <div className="text-gray-900 font-bold text-lg md:text-xl mb-1">고객 만족도</div>
               <div className="text-gray-500 text-sm md:text-base">평균 평점</div>
             </div>
             <div className="bg-white p-8 md:p-10 rounded-[30px] shadow-xl border border-gray-100 flex flex-col items-center justify-center text-center transform hover:scale-105 transition-transform" data-aos="fade-up" data-aos-delay="200">
               <div className="text-3xl md:text-5xl font-black text-gray-900 mb-2">평균 <span className="text-orange-600">2</span>배</div>
               <div className="text-gray-900 font-bold text-lg md:text-xl mb-1">매출 증가율</div>
               <div className="text-gray-500 text-sm md:text-base">6개월 기준</div>
             </div>
          </div>
        </div>
      </section>

      {/* Section 4: Why Bizon? (Differentiation) - Bento Grid Style */}
      <section className="h-screen snap-start flex flex-col justify-center bg-black overflow-hidden px-6 relative">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
        <div className="max-w-7xl mx-auto w-full relative z-10 px-4">
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {/* 1. Header Box */}
             <div className="md:col-span-2 bg-gray-900 rounded-3xl p-6 md:p-8 flex flex-col justify-center items-center text-center border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-orange-500 to-red-500" />
                <h3 className="text-sm md:text-base font-bold text-gray-400 mb-1">가짜 마케팅 전문가가 판치는 시장</h3>
                <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">
                  <span className="text-orange-600">진짜 전문가</span>인지 확인해 보세요.
                </h2>
             </div> 

             {/* 2. Content Cards */}
             <div className="bg-gray-900 rounded-3xl overflow-hidden border border-white/10 relative group h-40 md:h-64">
                <Image 
                  src="/uploads/certificates/cert6.png" 
                  alt="직접 운영 경험" 
                  fill 
                  className="object-cover opacity-50 group-hover:opacity-30 transition-opacity"
                />
                <div className="absolute inset-0 p-6 flex flex-col justify-end bg-linear-to-t from-black/95 via-black/70 to-transparent">
                  <h4 className="text-lg md:text-xl font-bold text-white mb-2">직접 운영 경험</h4>
                  <p className="text-gray-300 text-xs md:text-sm leading-relaxed">
                    연매출 30억 규모 매장 <strong className="text-white">3곳 직접 운영</strong><br />
                    사장님의 마음을 누구보다 잘 이해합니다.
                  </p>
                </div>
             </div>

             <div className="bg-gray-900 rounded-3xl overflow-hidden border border-white/10 relative group h-40 md:h-64">
                <Image 
                  src="/uploads/certificates/cert1.png" 
                  alt="검증된 자격" 
                  fill 
                  className="object-cover opacity-50 group-hover:opacity-30 transition-opacity"
                />
                <div className="absolute inset-0 p-6 flex flex-col justify-end bg-linear-to-t from-black/95 via-black/70 to-transparent">
                  <h4 className="text-lg md:text-xl font-bold text-white mb-2">검증된 자격</h4>
                  <p className="text-gray-300 text-xs md:text-sm leading-relaxed">
                    성균관대 경영학 석사 & <strong className="text-white">브랜드관리사 1급</strong><br />
                    검증된 전문가가 직접 설계합니다.
                  </p>
                </div>
             </div>

             {/* 3. Quote Box */}
              <div 
                className="md:col-span-2 py-6 md:py-8 bg-slate-950 rounded-3xl border border-white/10 text-center shadow-2xl relative overflow-hidden flex items-center justify-center" 
              >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-orange-600/10 blur-[60px] rounded-full pointer-events-none" />
                  <h3 className="relative z-10 text-xl md:text-2xl font-black text-white leading-tight whitespace-nowrap px-4">
                    실제 운영 경험과 결과, <span className="text-orange-600">전문성으로 증명합니다.</span>
                  </h3>
              </div>
           </div>
        </div>
      </section>

      {/* Unified Core Services & Bizon Logic Section */}
      <section className="h-screen snap-start flex flex-col justify-center bg-gray-50 overflow-hidden px-6">
        <div className="max-w-7xl mx-auto w-full">
            {/* Quote */}
            <div className="text-center mb-12 md:mb-16" data-aos="zoom-in">
              <div className="inline-block relative">
                 <p className="text-base md:text-lg font-bold text-gray-500 mb-2">
                   대표님! 아직도 플레이스 순위에만 집중하시나요?
                 </p>
                 <h3 className="relative text-2xl md:text-4xl font-black leading-tight tracking-tight text-gray-900">
                  <span className="text-orange-600">'플레이스 노출 순위'</span> 물론 중요합니다.<br />
                  다만! <span className="underline decoration-orange-400 decoration-3 underline-offset-4">효율적인 마케팅</span>을 해야합니다.
                 </h3>
              </div>
            </div>

            {/* 4 Promises - Expanded Grid */ }
            <div className="flex-1 flex flex-col justify-center">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-black mb-8 tracking-tight">
                  비즈온마케팅의 <span className="text-orange-600">4가지 약속</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 text-left max-w-6xl mx-auto w-full">
                  <div className="p-8 md:p-10 rounded-[30px] bg-white border border-gray-100 shadow-xl flex flex-col md:flex-row items-start md:items-center gap-6 hover:scale-[1.02] transition-transform duration-300">
                    <div className="text-orange-100 font-black text-5xl md:text-6xl leading-none">01</div>
                    <div>
                        <h4 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">과장·허위 광고 전화 X</h4>
                        <p className="text-base text-gray-500 font-medium">무작정 영업 대신, 기존 광고주 관리에 집중합니다.</p>
                    </div>
                  </div>
                  <div className="p-8 md:p-10 rounded-[30px] bg-white border border-gray-100 shadow-xl flex flex-col md:flex-row items-start md:items-center gap-6 hover:scale-[1.02] transition-transform duration-300">
                    <div className="text-orange-100 font-black text-5xl md:text-6xl leading-none">02</div>
                    <div>
                        <h4 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">불법 트래픽 절대 X</h4>
                        <p className="text-base text-gray-500 font-medium">지속 가능한 성과를 위해 편법을 쓰지 않습니다.</p>
                    </div>
                  </div>
                  <div className="p-8 md:p-10 rounded-[30px] bg-white border border-gray-100 shadow-xl flex flex-col md:flex-row items-start md:items-center gap-6 hover:scale-[1.02] transition-transform duration-300">
                    <div className="text-orange-100 font-black text-5xl md:text-6xl leading-none">03</div>
                    <div>
                        <h4 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">꼭 맞는 견적 제안</h4>
                        <p className="text-base text-gray-500 font-medium">상권과 업종에 딱 맞는 합리적 비용만 제안합니다.</p>
                    </div>
                  </div>
                  <div className="p-8 md:p-10 rounded-[30px] bg-white border border-gray-100 shadow-xl flex flex-col md:flex-row items-start md:items-center gap-6 hover:scale-[1.02] transition-transform duration-300">
                     <div className="text-orange-100 font-black text-5xl md:text-6xl leading-none">04</div>
                     <div>
                        <h4 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">오프라인까지 케어</h4>
                        <p className="text-base text-gray-500 font-medium">매장 컨디션까지 함께 고민하는 파트너입니다.</p>
                     </div>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </section>




      {/* Section 6: Process (Success Cycle) */}
      <section id="process" className="h-screen snap-start flex flex-col justify-center bg-linear-to-b from-gray-50 to-white overflow-hidden px-6">
        <div className="max-w-7xl mx-auto w-full">
          {/* Header */}
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-black mb-4 text-gray-900">
              비즈온의 마케팅 성공방식
            </h2>
            <p className="text-lg md:text-xl text-gray-600">
              멈추지 않고 계속 돌아가는 <span className="text-orange-700 font-black">성공의 수레바퀴</span>
            </p>
          </div>

          {/* Success Cycle Graphic Assembly */}
          <div className="relative py-8 flex items-center justify-center" data-aos="zoom-in">
            {/* Background Rotating Rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative w-[300px] h-[300px] md:w-[450px] md:h-[450px]">
                <RotatingOuterRing />
                <RotatingBizonO />
              </div>
            </div>

            {/* Cards Grid around the center */}
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-x-40 md:gap-y-16 max-w-6xl mx-auto w-full">
                <div className="group bg-white/80 backdrop-blur-sm p-8 md:p-10 rounded-[30px] shadow-sm hover:shadow-xl transition-all border border-gray-100 flex items-center justify-between">
                  <div className="text-3xl md:text-4xl font-black text-blue-500 opacity-30">01</div>
                  <h3 className="text-xl md:text-3xl font-black text-gray-900">매장 점검 및 진단</h3>
                </div>
                <div className="group bg-white/80 backdrop-blur-sm p-8 md:p-10 rounded-[30px] shadow-sm hover:shadow-xl transition-all border border-gray-100 flex items-center justify-between">
                  <div className="text-3xl md:text-4xl font-black text-amber-500 opacity-30">02</div>
                  <h3 className="text-xl md:text-3xl font-black text-gray-900">맞춤형 마케팅 설계</h3>
                </div>
                 <div className="group bg-white/80 backdrop-blur-sm p-8 md:p-10 rounded-[30px] shadow-sm hover:shadow-xl transition-all border border-gray-100 flex items-center justify-between">
                  <div className="text-3xl md:text-4xl font-black text-purple-500 opacity-30">03</div>
                  <h3 className="text-xl md:text-3xl font-black text-gray-900">마케팅 상품 실행</h3>
                </div>
                <div className="group bg-white/80 backdrop-blur-sm p-8 md:p-10 rounded-[30px] shadow-sm hover:shadow-xl transition-all border border-gray-100 flex items-center justify-between">
                  <div className="text-3xl md:text-4xl font-black text-orange-600 opacity-30">04</div>
                  <h3 className="text-xl md:text-3xl font-black text-gray-900">성과 분석 및 전략 조정</h3>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 8: REAL REVIEW */}
      <section id="review" className="min-h-screen snap-start flex flex-col justify-center py-24 px-6 bg-gray-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-5 py-2 bg-orange-700/20 text-orange-600 rounded-full text-sm font-bold mb-6 border border-orange-700/30 tracking-widest uppercase">
              Real Review
            </span>
            <h2 className="text-4xl md:text-5xl font-black">
              실제 <span className="text-orange-600">사장님들</span>의 이야기
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
              <div key={i} className="relative group">
                <div className="bg-gray-800 rounded-3xl p-10 border border-gray-700 hover:border-orange-700/50 transition-all h-full flex flex-col">
                  <span className="inline-block px-4 py-1 bg-orange-700 text-white text-xs font-bold rounded mb-6 w-fit">
                    BIZON SUCCESS
                  </span>
                  <p className="text-gray-300 text-xl leading-relaxed mb-8 flex-1">
                    "{review.quote}"
                  </p>
                  <div className="flex gap-1 mb-8">
                    {[...Array(review.rating)].map((_, j) => (
                      <Star key={j} className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-orange-700/20 flex items-center justify-center">
                      <Users className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-bold text-white text-lg">{review.name}</p>
                      <p className="text-base text-gray-500">{review.business}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 9: 무한 스크롤 채팅 갤러리 */}
      <section className="min-h-screen snap-start flex flex-col justify-center py-24 px-6 bg-gray-50 overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black mb-4 leading-tight text-gray-900">
              비즈온과 함께한<br />
              수 많은 사장님들과의 <br className="md:hidden" /><span className="text-orange-600">소통 메세지</span>
            </h2>
          </div>
          <div className="relative h-[400px] md:h-[500px] overflow-hidden rounded-2xl">
            <div className="absolute top-0 left-0 right-0 h-20 bg-linear-to-b from-gray-50 to-transparent z-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-linear-to-t from-gray-50 to-transparent z-10 pointer-events-none" />

            <div className="flex gap-4 md:gap-6 h-full px-2">
              <div className="flex-1 flex flex-col gap-4 animate-scroll-up">
                {[...Array(2)].map((_, setIdx) => (
                  <div key={setIdx} className="flex flex-col gap-4">
                    {[
                      { msg: '대표님! 제가 네이버에서 찾아보니까 정말 좋아지고 있어요', initial: '박', color: 'bg-orange-100 text-orange-600' },
                      { msg: '매출이 확 올랐어요! 감사합니다', initial: '김', color: 'bg-blue-100 text-blue-600' },
                      { msg: '리뷰 관리 시스템 너무 좋습니다', initial: '최', color: 'bg-green-100 text-green-600' },
                      { msg: '기대 이상의 결과였어요', initial: '이', color: 'bg-purple-100 text-purple-600' },
                    ].map((item, i) => (
                      <div key={`${setIdx}-${i}`} className="bg-white rounded-xl md:rounded-2xl p-3 md:p-4 shadow-md md:shadow-lg border border-gray-100">
                        <div className="flex items-start gap-2 md:gap-3">
                          <div className={`h-6 w-6 md:h-8 md:w-8 rounded-full ${item.color} flex items-center justify-center text-[10px] md:text-sm font-bold shrink-0`}>{item.initial}</div>
                          <div className="flex-1"><p className="text-xs md:text-sm text-gray-800 leading-snug">{item.msg}</p></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Column 2 - Responsive */}
              <div className="flex-1 flex flex-col gap-4 animate-scroll-up">
                {[...Array(2)].map((_, setIdx) => (
                  <div key={setIdx} className="flex flex-col gap-4">
                    {[
                      { msg: '저희 가게 지역에서 1등이 됐어요!', initial: '정', color: 'bg-blue-100 text-blue-600' },
                      { msg: '손님들이 네이버 보고 왔다고 해요', initial: '안', color: 'bg-orange-100 text-orange-600' },
                      { msg: '전화 문의가 확실히 늘었어요', initial: '강', color: 'bg-emerald-100 text-emerald-600' },
                      { msg: '투명하게 진행해주셔서 믿음이 갑니다', initial: 'A', color: 'bg-indigo-100 text-indigo-600' },
                      { msg: '다음 달도 계속 진행할게요!', initial: 'J', color: 'bg-rose-100 text-rose-600' },
                    ].map((item, i) => (
                      <div key={`${setIdx}-${i}`} className="bg-white rounded-xl md:rounded-2xl p-3 md:p-4 shadow-md md:shadow-lg border border-gray-100">
                        <div className="flex items-start gap-2 md:gap-3">
                          <div className={`h-6 w-6 md:h-8 md:w-8 rounded-full ${item.color} flex items-center justify-center text-[10px] md:text-sm font-bold shrink-0`}>{item.initial}</div>
                          <div className="flex-1"><p className="text-xs md:text-sm text-gray-800 leading-snug">{item.msg}</p></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Column 3 - Fast (Hidden on Mobile) */}
              <div className="hidden md:flex flex-1 flex-col gap-4 animate-[scrollUp_22s_linear_infinite]">
                {[...Array(2)].map((_, setIdx) => (
                  <div key={setIdx} className="flex flex-col gap-4">
                    {[
                      { msg: '대표님 덕분에장사가 잘 됩니다!', initial: 'S', color: 'bg-purple-100 text-purple-600' },
                      { msg: '예약률이 3배나 올랐어요', initial: '송', color: 'bg-cyan-100 text-cyan-600' },
                      { msg: '주변에도 추천하고 있어요', initial: 'H', color: 'bg-pink-100 text-pink-600' },
                      { msg: '꼼꼼하게 관리해주셔서 감사해요', initial: '백', color: 'bg-orange-100 text-orange-600' },
                    ].map((item, i) => (
                      <div key={`${setIdx}-${i}`} className="bg-white rounded-xl md:rounded-2xl p-4 shadow-lg border border-gray-100">
                        <div className="flex items-start gap-3">
                          <div className={`h-8 w-8 rounded-full ${item.color} flex items-center justify-center text-sm font-bold shrink-0`}>{item.initial}</div>
                          <div className="flex-1"><p className="text-sm text-gray-800">{item.msg}</p></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <div className="hidden lg:flex flex-1 flex-col gap-4 animate-scroll-up">
                {[...Array(2)].map((_, setIdx) => (
                  <div key={setIdx} className="flex flex-col gap-4">
                    {[
                      { msg: '솔직하게 말씀해주셔서 좋았어요', initial: '윤', color: 'bg-yellow-100 text-yellow-700' },
                      { msg: '다른 업체랑 달라요!', initial: '최', color: 'bg-indigo-100 text-indigo-600' },
                      { msg: '결과가 눈에 보이니까 좋네요', initial: 'K', color: 'bg-emerald-100 text-emerald-600' },
                      { msg: '사장님들 필수입니다 ㅎㅎ', initial: 'P', color: 'bg-violet-100 text-violet-600' },
                    ].map((item, i) => (
                      <div key={`${setIdx}-${i}`} className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
                        <div className="flex items-start gap-3">
                          <div className={`h-8 w-8 rounded-full ${item.color} flex items-center justify-center text-sm font-bold shrink-0`}>{item.initial}</div>
                          <div className="flex-1"><p className="text-sm text-gray-800">{item.msg}</p></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>


        </div>
      </section>

      {/* Section 8: Contact Form - Split Layout (Snap) */}
      <section id="contact-form" className="min-h-screen snap-start flex flex-col md:flex-row">
        {/* Left Column: Brand & Info (Dark) */}
        <div className="w-full md:w-5/12 bg-black text-white p-12 md:p-16 flex flex-col justify-center relative overflow-hidden">
          {/* Background Image & Overlay */}
          <div className="absolute inset-0 z-0">
             <Image 
                src="/uploads/meeting-1.png" 
                alt="Background" 
                fill 
                className="object-cover opacity-30 grayscale"
             />
             <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/40 to-black/80" />
          </div>

          <div className="relative z-10 space-y-6">
            <h3 className="text-orange-500 font-bold tracking-widest text-sm">BIZON MARKETING</h3>
            <h2 className="text-4xl md:text-5xl font-black leading-tight">
              어렵게 느껴지는 마케팅,<br />
              <span className="text-orange-600">전문가에게 맡기세요.</span>
            </h2>
          </div>
           <div className="relative z-10 pt-12 space-y-2">
             <p className="text-gray-400 text-sm font-bold mb-1">문의 전화</p>
             <p className="text-4xl md:text-5xl font-black text-white tracking-tight">1666-0865</p>
          </div>
        </div>

        {/* Right Column: Contact Form (White) */}
        <div className="w-full md:w-7/12 bg-white px-8 md:px-16 flex flex-col justify-center relative py-12 md:py-0">
           <div className="w-full max-w-xl mx-auto relative z-10">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-3">
                  <h3 className="text-3xl font-black text-gray-900">무료 진단 신청</h3>
                  <p className="text-gray-500 font-medium">
                    무료 상권 분석부터 마케팅 전략까지,<br className="md:hidden" /> 비즈온이 함께 고민해 드립니다.<br />
                    지금, <span className="text-orange-600 font-bold">우리 매장의 문제</span>를 진단받아보세요.
                  </p>
                </div>

                <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-bold text-gray-500 mb-2">상호명 <span className="text-orange-600">*</span></label>
                      <input
                        type="text"
                        required
                        placeholder="운영중인 매장명을 입력해주세요"
                        value={formData.brandName}
                        onChange={(e) => setFormData({...formData, brandName: e.target.value})}
                        className="w-full py-3 px-4 bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-orange-600 focus:bg-white focus:ring-1 focus:ring-orange-600 outline-none transition-all rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-500 mb-2">지역 <span className="text-orange-600">*</span></label>
                      <input
                        type="text"
                        required
                        placeholder="예) 서울 강남구, 경기 분당 등"
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        className="w-full py-3 px-4 bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-orange-600 focus:bg-white focus:ring-1 focus:ring-orange-600 outline-none transition-all rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-500 mb-2">신청자 성함 <span className="text-orange-600">*</span></label>
                      <input
                        type="text"
                        required
                        placeholder="대표님 성함을 입력해주세요"
                        value={formData.name || ''}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full py-3 px-4 bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-orange-600 focus:bg-white focus:ring-1 focus:ring-orange-600 outline-none transition-all rounded-xl"
                      />
                    </div>
                    <div>
                       <label className="block text-sm font-bold text-gray-500 mb-2">연락처 <span className="text-orange-600">*</span></label>
                       <input
                         type="tel"
                         required
                         placeholder="'-' 없이 숫자만 입력해주세요"
                         value={formData.contact}
                         onChange={(e) => setFormData({...formData, contact: e.target.value})}
                         className="w-full py-3 px-4 bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-orange-600 focus:bg-white focus:ring-1 focus:ring-orange-600 outline-none transition-all rounded-xl"
                       />
                    </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-500 mb-2">문의내용 <span className="text-orange-600">*</span></label>
                    <textarea
                      required
                      placeholder="현재 겪고 계신 어려움이나 궁금한 점을 자유롭게 적어주세요."
                      value={formData.concern}
                      onChange={(e) => setFormData({...formData, concern: e.target.value})}
                      className="w-full py-3 px-4 bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-orange-600 focus:bg-white focus:ring-1 focus:ring-orange-600 outline-none transition-all resize-none h-32 rounded-xl"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-orange-600 text-white rounded-xl text-lg font-bold hover:bg-orange-700 transition-all shadow-lg hover:shadow-orange-600/30 disabled:opacity-70 transform hover:-translate-y-1"
                  >
                    {isSubmitting ? '접수 중...' : '무료 진단 신청하기'}
                  </button>
                  <p className="text-center text-xs text-gray-400 mt-4">
                    보내주신 정보는 상담 목적으로만 활용되며, 절대 외부로 유출되지 않습니다.
                  </p>
                </div>
              </form>
            ) : (
               <div className="text-center py-20">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-3xl font-black mb-4 text-gray-900">신청이 완료되었습니다!</h3>
                <p className="text-gray-500 text-lg">
                  담당자가 내용을 확인 후<br />
                  <span className="text-orange-600 font-bold">1영업일 이내</span>에 빠르게 연락드리겠습니다.
                </p>
              </div>
            )}
           </div>
        </div>
      </section>

      {/* Footer (Integrated to avoid scroll snap issues) */}
      <footer className="snap-start py-20 pb-48 px-6 bg-black text-gray-500 text-center text-base border-t border-white/5 relative z-10">
        <div className="flex justify-center mb-8 opacity-30 invert">
            {/* Simple Text Logo instead of Image to prevent layout shift or broken link issues if image missing */}
             <h2 className="text-3xl font-black tracking-tighter text-white">BizOn<span className="text-orange-600">.</span></h2>
        </div>
        <div className="max-w-3xl mx-auto space-y-4">
          <p className="text-sm">© 2025 비즈온마케팅 주식회사. All rights reserved.</p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 text-sm text-gray-400">
             <span>대표: 양승협</span>
             <span className="hidden md:inline text-gray-700">|</span>
             <span>사업자등록번호: 565-81-03594</span>
          </div>
          <p className="text-gray-500 text-xs leading-relaxed">
            주소: 경기도 수원시 장안구 화산로 213번길 15, 2층 201-B66
          </p>
          <p className="text-orange-900/60 mt-12 text-lg font-bold">우리는 '대행'이 아니라 <br className="md:hidden" />매출 실험을 설계합니다.</p>
        </div>
      </footer>
    </div>
  );
}
