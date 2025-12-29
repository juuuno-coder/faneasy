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

export default function BizonMarketing({ site }: { site: string }) {
  // AOS 스크롤 애니메이션 초기화
  useAOS();

  const { getPageContent } = useDataStore();
  const pageContent = getPageContent(site);
  
  // 스크롤 상태 관리
  const [isScrolled, setIsScrolled] = useState(false);

  // 스크롤 이벤트 리스너
  useEffect(() => {
    // 초기 스크롤 위치 확인 (새로고침 시 대응)
    if (window.scrollY > 50) setIsScrolled(true);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
        name: formData.brandName, // Map brandName to name
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
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
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
      <section className="relative h-[100dvh] flex items-center justify-center overflow-hidden bg-black">
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
      <div className="fixed bottom-6 left-4 md:left-1/2 md:-translate-x-1/2 z-50 w-[calc(100%-84px)] md:w-[calc(100%-48px)] max-w-2xl md:px-0">
        <a 
          href="#contact-form"
          className="w-full py-4 bg-linear-to-r from-orange-600 to-red-600 text-white text-center text-sm md:text-xl font-bold rounded-2xl shadow-[0_10px_40px_-10px_rgba(234,88,12,0.5)] hover:scale-[1.02] hover:shadow-orange-600/50 transition-all flex items-center justify-center gap-2 md:gap-3 pr-8 md:pr-4 border border-white/20"
        >
          매장에서 새는 구멍 3개 찾기(상담문의)
          <ArrowRight className="h-5 w-5 md:h-6 md:w-6" />
        </a>
      </div>

      {/* Kakao Button - Adjusted position for mobile to avoid overlap */}
      <a 
        href="https://pf.kakao.com/_xxxx"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-4 z-50 w-14 h-14 md:w-16 md:h-16 bg-[#FAE100] rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all"
        title="카카오톡 상담"
      >
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="#371717">
          <path d="M12 3C6.5 3 2 6.6 2 11c0 2.8 1.9 5.3 4.8 6.7-.3 1.1-1 3.7-1.1 4.2 0 0 0 .1.1.2.1.1.2.1.3 0 .5-.4 3.6-2.4 4.8-3.2.7.1 1.4.2 2.1.2 5.5 0 10-3.6 10-8S17.5 3 12 3z"/>
        </svg>
      </a>

      {/* Section 2: 프랜차이즈도 꼭 마케팅을 해야 하는 이유 */}
      <section id="reason" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-2xl md:text-5xl font-black mb-4">
              프랜차이즈도 <br className="md:hidden" /><span className="text-orange-700">꼭 마케팅을 해야 하는 이유</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {[
              { icon: MapPin, title: '검색시 노출이 되는 곳', desc: '고객은 브랜드보다 가까운 곳을 먼저 찾습니다.' },
              { icon: Star, title: '후기 좋은 곳', desc: '같은 브랜드라도 리뷰 점수가 다르면 선택이 달라집니다.' },
                          ].map((item, i) => (
              <div 
                key={i} 
                className="text-center p-12 rounded-3xl bg-gray-50 hover:bg-orange-50 transition-colors group"
                data-aos="fade-up"
                data-aos-delay={i * 100}
              >
                <div className="h-20 w-20 mx-auto rounded-2xl bg-white shadow-lg flex items-center justify-center mb-8 group-hover:bg-orange-700 group-hover:text-white transition-all">
                  <item.icon className="h-10 w-10 text-orange-700 group-hover:text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-gray-600 text-lg">{item.desc}</p>
              </div>
            ))}
          </div>

          <div 
            className="text-center p-12 rounded-3xl bg-linear-to-r from-orange-700 to-red-500 text-white"
            data-aos="zoom-in"
          >
            <p className="text-lg md:text-3xl font-bold leading-tight">
              지점 별로 <span className="underline decoration-2 underline-offset-8">플레이스 마케팅</span> 관리를<br />
              <span className="text-xl md:text-5xl mt-6 block px-4">제대로 해주는 본사는 <span className="text-yellow-300">'없습니다'</span></span>
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: 지역장악마케팅 선언 - Full Screen */}
      <section className="min-h-screen flex items-center justify-center py-24 px-6 bg-slate-950 text-white">
        <div className="max-w-6xl mx-auto w-full">
          
          {/* Top: 4 Key Differentiators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16" data-aos="fade-up">
            {[
              { icon: Target, label: '지역 1등 전략' },
              { icon: BarChart3, label: '데이터 기반 분석' },
              { icon: Shield, label: '투명한 보고' },
              { icon: Zap, label: '빠른 성과' },
            ].map((item, i) => (
              <div 
                key={i} 
                className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                data-aos="fade-up"
                data-aos-delay={i * 100}
              >
                <item.icon className="h-10 w-10 text-orange-600" />
                <span className="text-sm font-bold text-center">{item.label}</span>
              </div>
            ))}
          </div>

          {/* Middle: Main Message */}
          <div className="text-center mb-16 font-sans" data-aos="fade-up" data-aos-delay="400">
            <h2 className="text-3xl md:text-5xl font-bold mb-8 leading-tight tracking-tight">
              우리는 지역장악 마케팅을 합니다.<br />
              사장님 업체를 <span className="text-orange-600">지역 1등 업체</span>로<br className="md:hidden" /> 만들어 드리겠습니다.
            </h2>
          </div>

          {/* Bottom: Trust Indicators */}
          <div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            data-aos="fade-up"
            data-aos-delay="600"
          >
            {[
              { number: '300+', label: '프랜차이즈 지점', sublabel: '현재 진행 중' },
              { number: '4.8/5.0', label: '고객 만족도', sublabel: '평균 평점' },
              { number: '평균 2배', label: '매출 증가율', sublabel: '6개월 기준' },
            ].map((stat, i) => (
              <div 
                key={i} 
                className="text-center p-8 rounded-2xl bg-white/5 border border-white/10"
                data-aos="zoom-in"
                data-aos-delay={700 + i * 100}
              >
                <div className="text-3xl md:text-5xl font-black text-orange-600 mb-3">
                  {stat.number}
                </div>
                <div className="text-xl font-bold mb-1">{stat.label}</div>
                <div className="text-sm text-gray-400">{stat.sublabel}</div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Section 4: 비즈온마케팅이 다른 이유 (신뢰) */}
      <section className="py-24 px-6 bg-white font-sans">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16" data-aos="fade-up">
            <div className="inline-block px-6 py-2 bg-orange-100 text-orange-600 rounded-full text-sm font-bold mb-4">
              Why BIZON
            </div>
            <h2 className="text-2xl md:text-5xl font-bold leading-tight tracking-tight">
              가짜 비전공 마케팅 전문가가 판치는 <br />
              자영업 마케팅 시장, <br className="md:hidden" />
              진짜 전문가인지 확인해 보세요.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            <div 
              className="p-12 rounded-3xl bg-linear-to-br from-orange-50 to-red-50 border border-orange-100"
              data-aos="fade-right"
            >
              <Building2 className="h-14 w-14 text-orange-700 mb-6" />
              <h3 className="text-2xl md:text-3xl font-bold mb-5">직접 운영 경험</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-orange-700 shrink-0 mt-1" />
                  <p className="text-gray-600 text-xl leading-relaxed">
                    연매출 30억 규모의 요식업 매장 <strong className="text-gray-900">3곳 직접 운영</strong><br />
                    (현재도 성업 중)<br />
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-orange-700 shrink-0 mt-1" />
                  <p className="text-gray-600 text-xl leading-relaxed">
                    자영업자이기에 누구보다 <strong className="text-gray-900">자영업자의 마음</strong>을 잘 이해합니다.<br />
                  </p>
                </div>
              </div>
            </div>
            
            <div 
              className="p-12 rounded-3xl bg-linear-to-br from-blue-50 to-indigo-50 border border-blue-100"
              data-aos="fade-left"
            >
              <Award className="h-14 w-14 text-blue-500 mb-6" />
              <h3 className="text-2xl md:text-3xl font-bold mb-5">검증된 자격</h3>
              <ul className="text-gray-600 space-y-4 text-lg">
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-blue-600 shrink-0" />
                  성균관대학교 경영학 석사
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-blue-600 shrink-0" />
                  브랜드관리사 1급 / 브랜드매니저 1급
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-blue-600 shrink-0" />
                  한국브랜드마케팅협회 정회원
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-blue-600 shrink-0" />
                  성균관대학교 14대 창업연구회 회장
                </li>
              </ul>
            </div>
          </div>

          {/* Certificates Section (Full Width Showcase - 8 Unique Items) */}
          <div className="mt-24 relative w-screen left-1/2 -translate-x-1/2 overflow-hidden bg-white/50 border-y border-gray-100/50">
            <div className="flex animate-scroll-left py-20 w-fit">
              {[...Array(4)].map((_, setIdx) => (
                <div key={setIdx} className="flex gap-4 md:gap-6 px-2 md:px-3">
                  {[...Array(8)].map((_, i) => {
                    const isPhoto = i >= 5; // cert6, cert7, cert8 (indices 5, 6, 7)
                    return (
                      <div 
                        key={`${setIdx}-${i}`} 
                        className="relative w-[180px] md:w-[260px] aspect-3/4 bg-white border border-gray-100 flex flex-col items-center justify-center overflow-hidden shadow-sm rounded-xl"
                      >
                        <Image 
                          src={`/uploads/certificates/cert${i + 1}.png`}
                          alt={`인증자료 ${i + 1}`}
                          fill
                          className={`${isPhoto ? 'object-cover' : 'object-contain p-3 md:p-5'}`}
                          unoptimized
                          onError={(e) => {
                            (e.target as any).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%23ea580c" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"%3E%3Cpath d="M12 15l-3-3 3-3"/%3E%3Cpath d="M15 12H9"/%3E%3Crect x="3" y="3" width="18" height="18" rx="2"/%3E%3C/svg%3E';
                          }}
                        />
                        {!isPhoto && <Award className="h-10 w-10 text-gray-200 absolute opacity-10" />}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          
          <div 
            className="mt-16 p-10 bg-slate-950 rounded-3xl text-center"
            data-aos="zoom-in"
            data-aos-delay="200"
          >
            <p className="text-white text-xl md:text-3xl font-medium leading-relaxed">
              "<span className="text-orange-600 font-bold">말</span>"이 아니라 "<span className="text-orange-600 font-bold">실제 운영 경험과 결과</span>"로 증명합니다.
            </p>
          </div>
        </div>


      </section>

      {/* Unified Core Services & Bizon Logic Section */}
      <section className="py-24 px-6 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative bg-white rounded-[60px] md:rounded-[100px] p-8 md:p-24 shadow-[0_50px_150px_rgba(0,0,0,0.06)] border border-gray-50 overflow-hidden" data-aos="fade-up">
            {/* Background Accent Gradients */}
            <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-radial-at-tr from-orange-50/50 to-transparent pointer-events-none" />
            
            {/* 1. The 3 Strategic Pillars - Unifying the top part */}
            <div className="relative z-10 text-center mb-16 font-sans">
              
              <div className="mb-12">
                <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">핵심 서비스</h2>
                <p className="text-gray-500 text-lg md:text-xl font-medium leading-tight">
                  프랜차이즈 지점에 최적화된 <br className="md:hidden" />
                  <span className="text-orange-600 font-bold">토탈 마케팅 시스템</span>
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-10">
                {[
                  { title: '플레이스 주력', desc: '검색 노출을 넘어 방문 전환까지 설계된 압도적인 플레이스 구축', icon: Target },
                  { title: '고감도 브랜딩', desc: '고객의 무의식을 자극해 첫인상에서 승기를 잡는 고퀄리티 디자인', icon: Palette },
                  { title: '매출 최적화 컨설팅', desc: '데이터 기반 상권 분석을 통한 지점별 맞춤형 성장 로드맵 제시', icon: BarChart3 }
                ].map((pillar, i) => (
                  <div key={i} className="flex flex-col items-center text-center p-8 rounded-[40px] bg-orange-50/30 border border-orange-100/50">
                    <div className="h-16 w-16 rounded-3xl bg-white shadow-lg flex items-center justify-center mb-6 text-orange-600">
                      <pillar.icon className="h-8 w-8" />
                    </div>
                    <h4 className="text-2xl font-bold mb-4">{pillar.title}</h4>
                    <p className="text-gray-500 leading-relaxed font-medium">{pillar.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Detailed Execution Logic */}
            <div className="relative z-10 text-center font-sans">
              
              <h3 className="text-3xl md:text-5xl font-bold tracking-tight mb-16">
                로직이 다르면 <br className="md:hidden" />
                <span className="text-orange-600 underline decoration-orange-200 underline-offset-10">본질</span>이 달라집니다.
              </h3>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
                {[
                  { title: '심층 고객 페르소나 설계', desc: '상권 내 실질 방문 고객의 행동 패턴 분석' },
                  { title: '고감도 미디어 고도화', icon: '📸', desc: '매장의 무드를 압도적으로 표현하는 촬영/보정' },
                  { title: '트래픽 선순환 최적화', desc: '검색부터 유입까지 정교한 로직 알고리즘 적용' },
                  { title: '체류 시간 극대화 로직', desc: '정보 전달을 넘어 머물게 만드는 정보 설계' },
                  { title: '문의/예약 전환 장치', icon: '📱', desc: '톡톡/예약으로 이어지는 버튼 동선 정밀화' },
                  { title: '브랜드 팬덤 리뷰 관리', desc: '단순 평점이 아닌 팬을 만드는 리뷰 솔루션' }
                ].map((item, i) => (
                  <div key={i} className="group p-10 rounded-[48px] bg-gray-50 border border-transparent hover:border-orange-200 hover:bg-white hover:shadow-2xl transition-all duration-500 text-left">
                     <div className="h-14 w-14 rounded-2xl bg-white shadow-lg flex items-center justify-center mb-8 border border-gray-100 group-hover:bg-orange-600 transition-colors duration-500">
                       <CheckCircle className="h-6 w-6 text-orange-600 group-hover:text-white" />
                     </div>
                     <h4 className="text-2xl font-bold mb-4 group-hover:text-orange-600 transition-colors tracking-tight">{item.title}</h4>
                     <p className="text-gray-500 font-medium leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>

              {/* Messaging */}
              <div className="space-y-16 mb-32">
                <div className="h-px w-32 bg-orange-600 mx-auto" />
                <h4 className="text-3xl md:text-6xl font-black leading-tight tracking-tighter">
                  <span className="text-orange-600 font-bold">1등은 당연한 수치</span>일 뿐, <br />
                  비즈온은 그 너머의 <br className="md:hidden" /><span className="bg-orange-600 text-white px-4 py-1 inline-block mt-2 md:mt-0">압도적 매출</span>을 만듭니다.
                </h4>
              </div>

              {/* 3. Re-designed Stats Comparison */}
              <div className="max-w-6xl mx-auto">
                <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
                   <div className="space-y-8 md:space-y-10" data-aos="fade-up">
                     <div className="text-left space-y-3 md:space-y-4">
                       <h5 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight italic">비즈온 도입 전</h5>
                       <p className="text-gray-400 text-sm md:text-lg font-medium">마케팅의 부재로 인해 새고 있던 잠재 고객들</p>
                     </div>
                     <div className="p-6 md:p-10 rounded-[30px] md:rounded-[48px] bg-gray-100/50 border border-gray-200">
                       <div className="space-y-6 md:space-y-8">
                         <div className="flex justify-between items-center bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl border border-gray-100">
                           <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px] md:text-xs">월간 유입량</span>
                           <span className="text-xl md:text-2xl font-black text-gray-400 italic">412 회</span>
                         </div>
                         <div className="flex justify-between items-center bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl border border-gray-100">
                           <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px] md:text-xs">방문 전환율</span>
                           <span className="text-xl md:text-2xl font-black text-gray-400 italic">2.41%</span>
                         </div>
                       </div>
                     </div>
                   </div>

                   <div className="relative group" data-aos="fade-up">
                     <div className="absolute -inset-4 bg-orange-600/30 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                     <div className="relative p-8 md:p-12 rounded-[40px] md:rounded-[60px] bg-orange-600 text-white shadow-[0_30px_60px_rgba(234,88,12,0.3)] md:shadow-[0_50px_100px_rgba(234,88,12,0.4)] border border-orange-500 overflow-hidden">
                       <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                       <div className="relative z-10 space-y-8 md:space-y-12 text-left">
                         <div className="flex justify-between items-start">
                           <div>
                             <div className="px-3 py-1 bg-white text-orange-600 text-[8px] md:text-[10px] font-black rounded-md mb-2 md:mb-4 inline-block">성과 분석 리포트</div>
                             <h5 className="text-2xl md:text-4xl font-black italic">비즈온 도입 후</h5>
                           </div>
                           <div className="text-right">
                             <div className="text-2xl md:text-4xl font-black text-yellow-100">↑ 842%</div>
                             <div className="text-[8px] md:text-xs font-bold text-orange-100 tracking-widest">핵심 지표 성장</div>
                           </div>
                         </div>
                         <div className="space-y-4 md:space-y-6">
                           <div className="space-y-1 md:space-y-2">
                             <div className="flex justify-between text-[10px] md:text-xs font-black text-orange-100 uppercase tracking-widest">유입 트래픽</div>
                             <div className="text-4xl md:text-6xl font-black tracking-tighter">3,892 <span className="text-lg md:text-2xl font-medium opacity-60">회</span></div>
                           </div>
                           <div className="h-2 md:h-3 w-full bg-black/20 rounded-full overflow-hidden">
                             <div className="h-full bg-white w-full shadow-[0_0_20px_rgba(255,255,255,1)]" />
                           </div>
                         </div>
                         <div className="grid grid-cols-2 gap-4 md:gap-8 pt-6 md:pt-8 border-t border-white/20">
                            <div>
                              <div className="text-[8px] md:text-[10px] font-bold text-orange-200 mb-1">전화 연결 수</div>
                              <div className="text-xl md:text-3xl font-black">112 <span className="text-sm opacity-60">+</span></div>
                            </div>
                            <div>
                              <div className="text-[8px] md:text-[10px] font-bold text-orange-200 mb-1">예약 요청 수</div>
                              <div className="text-xl md:text-3xl font-black">165 <span className="text-sm opacity-60">+</span></div>
                            </div>
                         </div>
                       </div>
                     </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>




      {/* Section 6: 비즈온의 마케팅 성공방식 - Redesigned */}
      <section id="process" className="py-32 px-6 bg-linear-to-b from-gray-50 to-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-20" data-aos="fade-up">
            <div className="inline-block px-6 py-2 bg-orange-100 text-orange-600 rounded-full text-sm font-bold mb-4">
              SUCCESS CYCLE
            </div>
            <h2 className="text-3xl md:text-7xl font-black mb-6 bg-linear-to-r from-gray-900 via-orange-600 to-gray-900 bg-clip-text text-transparent">
              비즈온의 마케팅 성공방식
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
              멈추지 않고 계속 돌아가는 <span className="text-orange-700 font-black">성공의 수레바퀴</span>
            </p>
          </div>

          {/* Main Process Diagram */}
          <div className="relative max-w-6xl mx-auto">
            {/* 1. Background Rotating Ring - Hidden on Mobile */}
            <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0">
              <RotatingOuterRing />
            </div>

            {/* 2. Center Rotating Logo - Hidden on Mobile */}
            <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <RotatingBizonO />
            </div>

            {/* Connecting circle path */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] md:w-[650px] md:h-[650px]">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="48"
                  fill="none"
                  stroke="url(#processGradient)"
                  strokeWidth="0.3"
                  strokeDasharray="1 2"
                  opacity="0.4"
                />
                <defs>
                  <linearGradient id="processGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FF6B35" />
                    <stop offset="50%" stopColor="#F7931E" />
                    <stop offset="100%" stopColor="#FF6B35" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* 4 Process Cards - Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
              {/* Card 1 - 진단 */}
              <div 
                className="group relative bg-white p-10 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-gray-100 hover:border-blue-200"
                data-aos="fade-right"
                data-aos-delay="100"
              >
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-12 bg-linear-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg">
                  01
                </div>
                
                {/* 3D Icon - Removed Emoji */}
                <div className="w-20 h-20 mb-6 relative">
                  <div className="absolute inset-0 bg-linear-to-br from-blue-400 to-cyan-500 rounded-3xl blur-sm opacity-30 transform translate-y-2"></div>
                  <div className="absolute inset-0 bg-linear-to-br from-blue-400 to-cyan-500 rounded-3xl shadow-xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
                    <Target className="h-10 w-10 text-white" />
                  </div>
                </div>

                <h3 className="text-3xl font-black mb-4 text-gray-900">진단</h3>
                <p className="text-lg text-gray-600 leading-relaxed mb-4">
                  현재 상태를 객관적으로 분석
                </p>
                <ul className="space-y-2 text-gray-500">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                    경쟁사 분석
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                    상권 파악
                  </li>
                </ul>
              </div>

              {/* Card 2 - 설계 */}
              <div 
                className="group relative bg-white p-10 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-gray-100 hover:border-amber-200"
                data-aos="fade-left"
                data-aos-delay="200"
              >
                 <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-12 bg-linear-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg">
                  02
                </div>
                
                {/* 3D Icon - Removed Emoji */}
                <div className="w-20 h-20 mb-6 relative ml-auto">
                  <div className="absolute inset-0 bg-linear-to-br from-amber-400 to-orange-600 rounded-3xl blur-sm opacity-30 transform translate-y-2"></div>
                  <div className="absolute inset-0 bg-linear-to-br from-amber-400 to-orange-600 rounded-3xl shadow-xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
                    <Palette className="h-10 w-10 text-white" />
                  </div>
                </div>

                <h3 className="text-3xl font-black mb-4 text-gray-900 text-right">설계</h3>
                <p className="text-lg text-gray-600 leading-relaxed mb-4 text-right">
                  지점 맞춤형 전략 수립
                </p>
                <ul className="space-y-2 text-gray-500 text-right">
                  <li className="flex items-center justify-end gap-2">
                    <span>실행 우선순위</span>
                    <div className="w-1.5 h-1.5 bg-amber-400 rounded-full"></div>
                  </li>
                  <li className="flex items-center justify-end gap-2">
                    <span>예산 최적화</span>
                    <div className="w-1.5 h-1.5 bg-amber-400 rounded-full"></div>
                  </li>
                </ul>
              </div>

              {/* Card 3 - 실행 */}
              <div 
                className="group relative bg-white p-10 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-gray-100 hover:border-purple-200 md:order-4"
                data-aos="fade-left"
                data-aos-delay="300"
              >
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-12 bg-linear-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg">
                  03
                </div>
                
                {/* 3D Icon - Removed Emoji */}
                <div className="w-20 h-20 mb-6 relative ml-auto">
                  <div className="absolute inset-0 bg-linear-to-br from-purple-400 to-pink-500 rounded-3xl blur-sm opacity-30 transform translate-y-2"></div>
                  <div className="absolute inset-0 bg-linear-to-br from-purple-400 to-pink-500 rounded-3xl shadow-xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
                    <Zap className="h-10 w-10 text-white" />
                  </div>
                </div>

                <h3 className="text-3xl font-black mb-4 text-gray-900 text-right">실행</h3>
                <p className="text-lg text-gray-600 leading-relaxed mb-4 text-right">
                  고민 없이 즉시 적용
                </p>
                <ul className="space-y-2 text-gray-500 text-right">
                  <li className="flex items-center justify-end gap-2">
                    <span>콘텐츠 제작</span>
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                  </li>
                  <li className="flex items-center justify-end gap-2">
                    <span>광고 운영</span>
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                  </li>
                </ul>
              </div>

              {/* Card 4 - 주간 개선 */}
              <div 
                className="group relative bg-linear-to-br from-orange-50 to-red-50 p-10 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-orange-200 hover:border-orange-300 md:order-3"
                data-aos="fade-right"
                data-aos-delay="400"
              >
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-12 bg-linear-to-br from-orange-600 to-red-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg">
                  04
                </div>
                
                {/* 3D Icon - Removed Emoji */}
                <div className="w-20 h-20 mb-6 relative">
                  <div className="absolute inset-0 bg-linear-to-br from-orange-700 to-red-600 rounded-3xl blur-sm opacity-30 transform translate-y-2"></div>
                  <div className="absolute inset-0 bg-linear-to-br from-orange-700 to-red-600 rounded-3xl shadow-xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
                    <BarChart3 className="h-10 w-10 text-white" />
                  </div>
                </div>

                <h3 className="text-3xl font-black mb-4 text-orange-700">주간 개선</h3>
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                  데이터 기반 지속적 성장
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-orange-600 rounded-full"></div>
                    성과 분석
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-orange-600 rounded-full"></div>
                    전략 조정
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Bottom CTA */}
          <div className="mt-20 text-center" data-aos="zoom-in">
            <div className="inline-block px-14 py-8 md:px-20 md:py-12 bg-gray-900 text-white rounded-[32px] text-xl md:text-4xl font-black shadow-[0_30px_60px_rgba(0,0,0,0.3)] hover:shadow-orange-700/20 transition-all hover:scale-[1.03] leading-tight md:leading-relaxed">
              뻔한 마케팅으로 인한 뻔한 결과는 보여드리지 않겠습니다.<br />
              <span className="text-orange-600 block mt-2">차별화된 전략으로 소통해 나가겠습니다.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 8: REAL REVIEW */}
      <section id="review" className="py-24 px-6 bg-gray-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-5 py-2 bg-orange-700/20 text-orange-600 rounded-full text-sm font-bold mb-6 border border-orange-700/30 tracking-widest uppercase">
              Real Review
            </span>
            <h2 className="text-4xl md:text-6xl font-black">
              실제 <span className="text-orange-600">사장님들</span>의 이야기
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                name: '이영진 대표님', 
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
      <section className="py-24 px-6 bg-gray-50 overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              비즈온과 함께한<br />
              수 많은 사장님들과의 <br className="md:hidden" /><span className="text-orange-700">소통 메세지</span>
            </h2>
            <p className="text-gray-600">비즈온마케팅은 소통을 가장 중요하게 생각합니다</p>
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

      <section id="contact-form" className="py-24 px-6 bg-linear-to-b from-gray-900 to-black text-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1 bg-orange-700/10 text-orange-700 rounded-full text-sm font-bold mb-4">
              초간단 질문
            </div>
            <h2 className="text-4xl md:text-6xl font-black mb-6">
              상담이 아니라 <span className="text-orange-600">진단</span>부터 받으세요.
            </h2>
            <p className="text-gray-400 text-xl">
              대표님 매장에 맞는 <span className="text-white font-bold">실행 우선순위 1장</span>으로 답합니다.
            </p>
          </div>

          {submitted ? (
            <div className="text-center p-16 rounded-3xl bg-white/5 border border-white/10" data-aos="zoom-in">
              <CheckCircle className="h-20 w-20 text-green-700 mx-auto mb-8" />
              <h3 className="text-3xl font-bold mb-4">진단 요청이 접수되었습니다!</h3>
              <p className="text-xl text-gray-400">영업일 기준 1일 내로 담당자가 연락드립니다.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-base font-bold text-gray-200 mb-3">상호명 *</label>
                  <input
                    type="text"
                    required
                    value={formData.brandName}
                    onChange={(e) => setFormData({...formData, brandName: e.target.value})}
                    placeholder="예: 비즈온 마케팅"
                    className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-orange-700 outline-none transition text-lg font-medium"
                  />
                </div>
                <div>
                  <label className="block text-base font-bold text-gray-200 mb-3">지역 *</label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    placeholder="예: 서울시 강남구"
                    className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-orange-700 outline-none transition text-lg font-medium"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-base font-bold text-gray-200 mb-3">성함 *</label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="성함을 입력해주세요"
                    className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-orange-700 outline-none transition text-lg font-medium"
                  />
                </div>
                <div>
                   <label className="block text-base font-bold text-gray-200 mb-3">연락처 *</label>
                   <input
                     type="tel"
                     required
                     value={formData.contact}
                     onChange={(e) => setFormData({...formData, contact: e.target.value})}
                     placeholder="010-0000-0000"
                     className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-orange-700 outline-none transition text-lg font-medium"
                   />
                </div>
              </div>

              <div>
                <label className="block text-base font-bold text-gray-200 mb-3">문의내용 *</label>
                <textarea
                  required
                  value={formData.concern}
                  onChange={(e) => setFormData({...formData, concern: e.target.value})}
                  placeholder="구체적인 고민이나 궁금하신 점을 남겨주세요"
                  className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-orange-700 outline-none transition text-lg font-medium h-40 resize-none"
                />
              </div>

              {/* Privacy Agreement Checkbox */}
              <div className="flex items-center gap-3 py-0">
                <input 
                  type="checkbox" 
                  id="privacy-agree" 
                  required 
                  className="w-5 h-5 rounded border-gray-100 bg-white/5 accent-orange-700 cursor-pointer"
                />
                <label htmlFor="privacy-agree" className="text-gray-400 text-sm md:text-base cursor-pointer hover:text-gray-200 transition-colors">
                  <span className="text-orange-500 font-bold">[필수]</span> 개인정보 수집 및 이용에 동의합니다.
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-6 bg-linear-to-r from-orange-700 to-orange-500 text-white rounded-2xl text-xl md:text-2xl font-black hover:shadow-2xl hover:shadow-orange-700/40 transition-all disabled:opacity-70 flex items-center justify-center gap-3 group"
                >
                  {isSubmitting ? '접수 중...' : '우리 매장 지역장악 플랜 받기'}
                  {!isSubmitting && <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />}
                </button>
              </div>

              <p className="text-center text-sm text-gray-500">
                가능/불가능을 먼저 말씀드립니다. <br className="md:hidden" />불필요한 비용을 권하지 않습니다.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 pb-48 px-6 bg-black text-gray-500 text-center text-base border-t border-white/5">
        <Image 
          src="/bizon-logo.png" 
          alt="비즈온" 
          width={180} 
          height={60}
          className="object-contain mx-auto mb-6 brightness-0 invert opacity-20"
        />
        <div className="max-w-3xl mx-auto space-y-4">
          <p>© 2025 비즈온마케팅 주식회사. All rights reserved.</p>
          <p className="text-gray-400 text-base">
            대표: 양승협 | 사업자등록번호: 565-81-03594
          </p>
          <p className="text-gray-400 text-sm leading-relaxed">
            주소: 경기도 수원시 장안구 화산로 213번길 15, 2층 201-B66
          </p>
          <p className="text-orange-700/50 mt-10 text-xl font-bold">우리는 '대행'이 아니라 매출 실험을 설계합니다.</p>
        </div>
      </footer>
    </div>
  );
}
