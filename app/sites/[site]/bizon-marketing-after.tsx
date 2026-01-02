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
      className="min-h-screen bg-black overflow-x-hidden snap-y snap-proximity h-screen overflow-y-scroll scroll-smooth select-none">
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
          <div className="text-center mb-16 md:mb-24" data-aos="fade-up">
            <h2 className="text-4xl md:text-6xl lg:text-8xl font-black mb-4 leading-tight">
              <span className="text-gray-900">프랜차이즈라서</span><br />
              <span className="text-orange-700">마케팅이 의미 없다고 생각하시나요?</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-10 md:gap-20 mb-16 md:mb-24">
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
                <div className="relative aspect-video max-w-2xl mx-auto rounded-[40px] overflow-hidden shadow-2xl border border-gray-100 mb-10">
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-50 text-gray-400">
                    <div className="text-center p-4">
                      <item.fallbackIcon className="h-20 w-20 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg">세팅 잘된 플레이스 사진<br/>(/uploads/place-example-{i+1}.png)</p>
                    </div>
                  </div>
                  <Image 
                    src={item.img}
                    alt={item.text}
                    fill
                    className="object-cover hover:scale-110 transition-transform duration-700"
                    unoptimized
                    onError={(e) => e.currentTarget.style.display = 'none'} 
                  />
                </div>
                <h3 className="text-3xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-tight break-keep">
                  {item.text}
                </h3>
              </div>
            ))}
          </div>

          <div 
            className="text-center p-12 md:p-16 lg:p-20 rounded-[50px] bg-linear-to-r from-orange-700 to-red-500 text-white max-w-6xl mx-auto shadow-3xl"
            data-aos="zoom-in"
          >
            <p className="text-2xl md:text-4xl lg:text-5xl font-black leading-tight">
              지점 별로 <span className="underline decoration-2 underline-offset-8">플레이스 마케팅</span> 관리를<br />
              <span className="text-3xl md:text-6xl lg:text-8xl mt-10 block px-4 font-black">제대로 해주는 본사는 <span className="text-yellow-300">'없습니다'</span></span>
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: Main Message (Success Cycle) */}
      <section className="h-screen snap-start flex flex-col justify-center bg-slate-950 overflow-hidden px-6 text-white">
        <div className="max-w-7xl mx-auto w-full">
          {/* Main Copy */}
          <div className="text-center mb-16 md:mb-24" data-aos="fade-up">
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight mb-8 break-keep">
              지역 장악 마케팅으로<br />
              대표님의 프랜차이즈 매장을<br />
              <span className="text-orange-600 underline">지역 1등 업체</span>로 만들겠습니다.
            </h2>
          </div>

          {/* Service Stats (Trust Indicators) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 max-w-6xl mx-auto">
             <div className="bg-white/5 backdrop-blur-md p-10 md:p-14 rounded-[40px] border border-white/10 flex flex-col items-center justify-center text-center transform hover:scale-105 transition-all hover:bg-white/10" data-aos="fade-up" data-aos-delay="0">
               <div className="text-4xl md:text-6xl font-black text-orange-600 mb-4 tracking-tighter">300+</div>
               <div className="text-white font-bold text-xl md:text-2xl mb-2">프랜차이즈 지점</div>
               <div className="text-gray-400 text-sm md:text-lg">현재 진행 중</div>
             </div>
             <div className="bg-white/5 backdrop-blur-md p-10 md:p-14 rounded-[40px] border border-white/10 flex flex-col items-center justify-center text-center transform hover:scale-105 transition-all hover:bg-white/10" data-aos="fade-up" data-aos-delay="100">
               <div className="text-4xl md:text-6xl font-black text-orange-600 mb-4 tracking-tighter">4.8/5.0</div>
               <div className="text-white font-bold text-xl md:text-2xl mb-2">고객 만족도</div>
               <div className="text-gray-400 text-sm md:text-lg">평균 평점</div>
             </div>
             <div className="bg-white/5 backdrop-blur-md p-10 md:p-14 rounded-[40px] border border-white/10 flex flex-col items-center justify-center text-center transform hover:scale-105 transition-all hover:bg-white/10" data-aos="fade-up" data-aos-delay="200">
               <div className="text-4xl md:text-6xl font-black text-orange-600 mb-4 tracking-tighter">평균 2배</div>
               <div className="text-white font-bold text-xl md:text-2xl mb-2">매출 증가율</div>
               <div className="text-gray-400 text-sm md:text-lg">6개월 기준</div>
             </div>
          </div>
        </div>
      </section>

      {/* Section 4: Bizon Differentiation - Redesigned One Page Style */}
      <section className="h-screen snap-start flex flex-col justify-center bg-black overflow-hidden px-6 relative">
        <div className="absolute inset-0 bg-linear-to-b from-orange-600/5 to-transparent"></div>
        <div className="max-w-6xl mx-auto w-full relative z-10">
           
           <div className="text-center mb-12 md:mb-16">
              <p className="text-blue-500 font-bold text-xl md:text-2xl mb-4 tracking-tight">마케팅도 똑같습니다</p>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight break-keep">
                가짜 마케팅 전문가가 판치는<br />
                자영업 마케팅 시장,<br />
                진짜 전문가인지 확인해 보세요.
              </h2>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
              {/* Box 1 */}
              <div className="bg-gray-900/40 backdrop-blur-md rounded-[50px] p-12 md:p-16 border border-white/10 relative overflow-hidden flex flex-col justify-center group h-[280px] md:h-[350px]">
                <Image 
                  src="/uploads/meeting-1.png" 
                  alt="Background" 
                  fill 
                  className="object-cover opacity-20 group-hover:opacity-10 transition-opacity"
                />
                <div className="relative z-10">
                   <h3 className="text-2xl md:text-4xl font-black text-white leading-tight break-keep text-center">
                     우리의 목표는 단순히<br />
                     <span className="text-orange-600">순위를 올리는 게</span> 아닙니다.
                   </h3>
                </div>
              </div>

              {/* Box 2 */}
              <div className="bg-gray-900/40 backdrop-blur-md rounded-[50px] p-12 md:p-16 border border-white/10 relative overflow-hidden flex flex-col justify-center group h-[280px] md:h-[350px]">
                 <Image 
                  src="/uploads/meeting-2.png" 
                  alt="Background" 
                  fill 
                  className="object-cover opacity-20 group-hover:opacity-10 transition-opacity"
                />
                <div className="relative z-10 space-y-4">
                   <h3 className="text-2xl md:text-4xl font-black text-white leading-tight break-keep text-center">
                     고객이 올 수밖에 없는<br />
                     <span className="text-orange-600">구조를 만들고</span>
                   </h3>
                   <div className="h-px w-20 bg-white/20 mx-auto" />
                   <h3 className="text-2xl md:text-4xl font-black text-white leading-tight break-keep text-center">
                     그 경험을 <span className="text-orange-600 font-bold">매출로 전환</span>하는 것.
                   </h3>
                </div>
              </div>
           </div>

           <div className="mt-16 text-center">
              <div className="inline-block relative px-14 py-8 bg-orange-600 text-white rounded-[40px] shadow-3xl overflow-hidden transform hover:scale-110 transition-all cursor-pointer">
                <div className="absolute inset-0 bg-linear-to-r from-orange-700 to-orange-500" />
                <h3 className="relative z-10 text-2xl md:text-4xl font-black">
                  진짜 전문가에게 문의하세요.
                </h3>
              </div>
           </div>
        </div>
      </section>

      {/* Section 5: Certificates Showcase - Faster Scrolling & Larger Text */}
      <section className="h-screen snap-start flex flex-col justify-center bg-white overflow-hidden py-24">
        <div className="max-w-screen-2xl mx-auto w-full px-6">
          <div className="text-center mb-16 md:mb-24">
            <h2 className="text-4xl md:text-7xl lg:text-9xl font-black text-gray-900 leading-tight mb-4 tracking-tighter">
              실제 운영 경험과<br />
              성과로 증명합니다.
            </h2>
          </div>

          <div className="relative w-screen left-1/2 -translate-x-1/2 overflow-hidden bg-gray-50/50 py-12 md:py-20 border-y border-gray-100">
            <div className="flex animate-scroll-left-fast py-10 w-fit">
              {[...Array(4)].map((_, setIdx) => (
                <div key={setIdx} className="flex gap-8 md:gap-14 px-4 md:px-7">
                  {[...Array(8)].map((_, i) => (
                    <div 
                      key={`${setIdx}-${i}`} 
                      className="relative w-[300px] md:w-[500px] aspect-3/4 bg-white border border-gray-200 flex flex-col items-center justify-center overflow-hidden shadow-2xl rounded-[40px] transform hover:scale-105 transition-transform"
                    >
                      <Image 
                        src={`/uploads/certificates/cert${i + 1}.png`}
                        alt={`인증자료 ${i + 1}`}
                        fill
                        className="object-cover md:p-4"
                        unoptimized
                        onError={(e) => {
                          (e.target as any).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%23ea580c" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"%3E%3Cpath d="M12 15l-3-3 3-3"/%3E%3Cpath d="M15 12H9"/%3E%3Crect x="3" y="3" width="18" height="18" rx="2"/%3E%3C/svg%3E';
                        }}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: Efficiency & Promises (Unified based on 7page feedback) */}
      <section className="h-screen snap-start flex flex-col justify-center bg-gray-50 overflow-hidden px-6">
        <div className="max-w-7xl mx-auto w-full">
            <div className="text-center mb-16 md:mb-24">
               <h3 className="text-3xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-gray-900 mb-6">
                '플레이스 노출 순위' 물론 중요합니다.<br />
                다만! <span className="text-orange-600 underline decoration-orange-300 decoration-8 underline-offset-12">효율적인 마케팅</span>을 해야합니다.
               </h3>
            </div>

            <div className="flex flex-col md:flex-row gap-12 items-stretch">
               {/* Left: Headline */}
               <div className="w-full md:w-5/12 flex flex-col justify-center">
                  <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-gray-900 mb-8 leading-none tracking-tighter">
                    그래서<br />
                    비즈온은<br />
                    <span className="text-orange-600">5가지 약속</span>을<br />
                    만들었습니다.
                  </h2>
               </div>

               {/* Right: Promises Grid */}
               <div className="w-full md:w-7/12 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { title: '과장·허위 광고 전화 X', desc: '무작정 영업 대신, 기존 광고주 관리에 집중합니다.' },
                    { title: '가게에 꼭 맞는 견적 제안', desc: '상권과 업종에 딱 맞는 합리적 비용만 제안합니다.' },
                    { title: '불법·편법 트래픽 X', desc: '지속 가능한 성과를 위해 편법을 절대 쓰지 않습니다.' },
                    { title: '온라인 넘어 오프라인까지', desc: '매장 컨디션까지 현장 전문가가 함께 고민합니다.' },
                    { title: '운영 시간 이후에도 책임', desc: '필요할 때 언제든 1:1 전담 소통이 가능합니다.' },
                  ].map((p, i) => (
                    <div key={i} className={`p-8 rounded-[32px] bg-white border border-gray-200 shadow-sm hover:shadow-xl transition-all ${i === 4 ? 'sm:col-span-2' : ''}`}>
                       <h4 className="text-xl md:text-2xl font-black text-gray-900 mb-3">{p.title}</h4>
                       <p className="text-gray-500 md:text-lg font-medium leading-relaxed">{p.desc}</p>
                    </div>
                  ))}
               </div>
            </div>
        </div>
      </section>

      {/* Section SUCCESS CYCLE (Graphic restored if requested previously, but simplified per feedback flow) */}
       <section id="process" className="h-screen snap-start flex flex-col justify-center bg-white overflow-hidden px-6">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center mb-16 px-4">
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">
              비즈온의 마케팅 성공방식
            </h2>
            <p className="text-xl md:text-2xl text-gray-500 font-bold">
              멈추지 않고 계속 돌아가는 <span className="text-orange-600">성공의 수레바퀴</span>
            </p>
          </div>

          <div className="relative py-12 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 md:opacity-100">
              <div className="relative w-[300px] h-[300px] md:w-[500px] md:h-[500px]">
                <RotatingOuterRing />
                <RotatingBizonO />
              </div>
            </div>

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-x-56 md:gap-y-24 max-w-6xl mx-auto w-full px-4">
                <div className="bg-white/95 backdrop-blur-md p-10 md:p-12 rounded-[40px] shadow-2xl border border-gray-100 flex items-center justify-between hover:scale-105 transition-transform">
                  <div className="text-4xl font-black text-blue-500/20">01</div>
                  <h3 className="text-2xl md:text-4xl font-black text-gray-900">매장 점검 및 진단</h3>
                </div>
                <div className="bg-white/95 backdrop-blur-md p-10 md:p-12 rounded-[40px] shadow-2xl border border-gray-100 flex items-center justify-between hover:scale-105 transition-transform">
                  <div className="text-4xl font-black text-amber-500/20">02</div>
                  <h3 className="text-2xl md:text-4xl font-black text-gray-900">맞춤형 마케팅 설계</h3>
                </div>
                 <div className="bg-white/95 backdrop-blur-md p-10 md:p-12 rounded-[40px] shadow-2xl border border-gray-100 flex items-center justify-between hover:scale-105 transition-transform">
                  <div className="text-4xl font-black text-purple-500/20">03</div>
                  <h3 className="text-2xl md:text-4xl font-black text-gray-900">마케팅 상품 실행</h3>
                </div>
                <div className="bg-white/95 backdrop-blur-md p-10 md:p-12 rounded-[40px] shadow-2xl border border-gray-100 flex items-center justify-between hover:scale-105 transition-transform">
                  <div className="text-4xl font-black text-orange-600/20">04</div>
                  <h3 className="text-2xl md:text-4xl font-black text-gray-900">성과 분석 및 조정</h3>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Review & Chat (As Archive from Previous Steps) */}
      <section id="review" className="min-h-screen snap-start flex flex-col justify-center py-24 px-6 bg-gray-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-5 py-2 bg-orange-700/20 text-orange-600 rounded-full text-sm font-bold mb-6 border border-orange-700/30 tracking-widest uppercase">
              Real Review
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black">
              실제 <span className="text-orange-600">사장님들</span>의 이야기
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: '이OO 대표님', business: '프랜차이즈 가맹점주', quote: '피드백과 자영업 맞춤 케어 해주셔서 비즈온과 함께할 생각입니다. 매출이 실제로 30% 이상 상승했습니다.', rating: 5 },
              { name: '김사장님', business: '음식점 운영 12년차', quote: '대표님! 매달 신경쓸수록 방문 고객이 늘었어요. 플레이스 장악이 이렇게 중요한지 이제야 알았습니다.', rating: 5 },
              { name: '박대표님', business: '수도권 카페 브랜딩', quote: '막연했던 어려움을 잘 이끌어주셔서 이제야 방향키를 제대로 잡아갑니다! 역시 전문가는 다릅니다.', rating: 5 },
            ].map((review, i) => (
              <div key={i} className="bg-gray-800 rounded-[40px] p-12 border border-gray-700 hover:border-orange-700/50 transition-all h-full flex flex-col">
                <p className="text-gray-300 text-xl md:text-2xl leading-relaxed mb-10 flex-1 italic italic-quote">"{review.quote}"</p>
                <div className="flex gap-1 mb-8">
                  {[...Array(review.rating)].map((_, j) => <Star key={j} className="h-6 w-6 text-yellow-500 fill-yellow-500" />)}
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full bg-orange-700/20 flex items-center justify-center">
                    <Users className="w-8 h-8 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-xl">{review.name}</p>
                    <p className="text-lg text-gray-500">{review.business}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact-form" className="min-h-screen snap-start flex flex-col md:flex-row">
        <div className="w-full md:w-5/12 bg-black text-white p-12 md:p-20 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute inset-0 z-0">
             <Image src="/uploads/meeting-1.png" alt="Background" fill className="object-cover opacity-20 grayscale" unoptimized />
             <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/40 to-black/80" />
          </div>
          <div className="relative z-10 space-y-8">
            <h3 className="text-orange-500 font-bold tracking-widest text-lg">BIZON MARKETING</h3>
            <h2 className="text-5xl md:text-7xl font-black leading-tight tracking-tighter">
              어렵게 느껴지는 마케팅,<br />
              <span className="text-orange-600">전문가에게<br />맡기세요.</span>
            </h2>
            <div className="pt-12">
               <p className="text-gray-400 font-bold text-xl mb-3 underline decoration-orange-600 decoration-4 underline-offset-8">문의 전화</p>
               <p className="text-5xl md:text-7xl font-black text-white tracking-tight">1666-0865</p>
            </div>
          </div>
        </div>

        <div className="w-full md:w-7/12 bg-white px-8 md:px-24 flex flex-col justify-center relative py-20 md:py-0">
            <div className="w-full max-w-2xl mx-auto relative z-10">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="space-y-4">
                  <h3 className="text-4xl md:text-5xl font-black text-gray-900">무료 진단 신청</h3>
                  <p className="text-xl text-gray-500 font-medium">
                    지금 바로, <span className="text-orange-600 font-bold underline">우리 매장의 문제</span>를 진단받으세요.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <label className="text-lg font-bold text-gray-700">상호명 <span className="text-orange-600">*</span></label>
                      <input type="text" required placeholder="운영중인 매장명을 입력해주세요" value={formData.brandName} onChange={(e) => setFormData({...formData, brandName: e.target.value})} className="w-full py-5 px-6 bg-gray-50 border-2 border-gray-100 text-gray-900 text-xl placeholder-gray-400 focus:border-orange-600 focus:bg-white outline-none transition-all rounded-[20px]" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-lg font-bold text-gray-700">지역 <span className="text-orange-600">*</span></label>
                      <input type="text" required placeholder="예) 서울 강남구, 경기 분당 등" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full py-5 px-6 bg-gray-50 border-2 border-gray-100 text-gray-900 text-xl placeholder-gray-400 focus:border-orange-600 focus:bg-white outline-none transition-all rounded-[20px]" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-lg font-bold text-gray-700">신청자 성함 <span className="text-orange-600">*</span></label>
                      <input type="text" required placeholder="성함을 입력해주세요" value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full py-5 px-6 bg-gray-50 border-2 border-gray-100 text-gray-900 text-xl placeholder-gray-400 focus:border-orange-600 focus:bg-white outline-none transition-all rounded-[20px]" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-lg font-bold text-gray-700">연락처 <span className="text-orange-600">*</span></label>
                       <input type="tel" required placeholder="'-' 없이 숫자만 입력해주세요" value={formData.contact} onChange={(e) => setFormData({...formData, contact: e.target.value})} className="w-full py-5 px-6 bg-gray-50 border-2 border-gray-100 text-gray-900 text-xl placeholder-gray-400 focus:border-orange-600 focus:bg-white outline-none transition-all rounded-[20px]" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-lg font-bold text-gray-700">문의내용 <span className="text-orange-600">*</span></label>
                      <textarea required placeholder="현재 겪고 계신 어려움을 자유롭게 적어주세요." value={formData.concern} onChange={(e) => setFormData({...formData, concern: e.target.value})} className="w-full py-5 px-6 bg-gray-50 border-2 border-gray-100 text-gray-900 text-xl placeholder-gray-400 focus:border-orange-600 focus:bg-white outline-none transition-all resize-none h-44 rounded-[20px]" />
                    </div>
                </div>

                <div className="pt-6">
                  <button type="submit" disabled={isSubmitting} className="w-full py-6 bg-orange-600 text-white rounded-[24px] text-2xl font-black hover:bg-orange-700 transition-all shadow-2xl hover:shadow-orange-600/40 transform hover:-translate-y-2">
                    {isSubmitting ? '접수 중...' : '무료 진단 신청하기'}
                  </button>
                </div>
              </form>
            ) : (
                <div className="text-center py-24">
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                    <CheckCircle className="w-12 h-12 text-green-600" />
                  </div>
                  <h3 className="text-4xl font-black mb-6 text-gray-900">신청이 완료되었습니다!</h3>
                  <p className="text-gray-500 text-2xl leading-relaxed">
                    1영업일 이내에 연락드리겠습니다.
                  </p>
                </div>
            )}
           </div>
        </div>
      </section>

      <footer className="snap-start py-24 px-6 bg-black text-gray-500 text-center border-t border-white/5 relative z-10">
        <h2 className="text-4xl font-black text-white mb-8 tracking-tighter">BizOn<span className="text-orange-600">.</span></h2>
        <div className="max-w-3xl mx-auto space-y-6 text-lg">
          <p>© 2025 비즈온마케팅 주식회사. All rights reserved.</p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
             <span>대표: 양승협</span>
             <span>사업자등록번호: 565-81-03594</span>
          </div>
          <p className="text-gray-400">주소: 경기도 수원시 장안구 화산로 213번길 15, 2층 201-B66</p>
          <p className="text-orange-700 font-black text-2xl mt-16 tracking-tight italic">우리는 '대행'이 아니라 매출 실험을 설계합니다.</p>
        </div>
      </footer>
    </div>
  );
}
