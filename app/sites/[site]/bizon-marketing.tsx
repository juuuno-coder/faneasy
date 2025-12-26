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
  ShieldAlert,
  Shield,
  Smartphone,
  Play
} from 'lucide-react';
import { useAOS } from '@/hooks/use-aos';
import { useDataStore } from '@/lib/data-store';
import { HeroTextSequence } from '@/components/hero-text-sequence';
import { RotatingBizonO, RotatingOuterRing } from '@/components/rotating-bizon-o';

export default function BizonMarketing({ site }: { site: string }) {
  // AOS 스크롤 애니메이션 초기화
  useAOS();

  const { getPageContent } = useDataStore();
  const pageContent = getPageContent(site);
  const videoRef = useRef<HTMLIFrameElement>(null);
  
  // 스크롤 상태 관리
  const [isScrolled, setIsScrolled] = useState(false);

  // 스크롤 이벤트 리스너
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // 유튜브 영상 ID 추출 및 설정
  const defaultVideoId = 'homsIWrbeo0';
  
  // URL에서 ID 추출 로직 (v=id 또는 youtu.be/id 형식 지원)
  const getVideoId = (url: string | undefined) => {
    if (!url) return defaultVideoId;
    if (url.includes('v=')) return url.split('v=')[1].split('&')[0];
    if (url.includes('youtu.be/')) return url.split('youtu.be/')[1].split('?')[0];
    return url; // ID만 입력된 경우
  };

  const heroVideoId = getVideoId(pageContent?.heroVideoUrl);

  /* State Updates */
  const [formData, setFormData] = useState({
    brandName: '',
    address: '',
    goal: [] as string[],
    currentMarketing: [] as string[],
    concern: '',
    contact: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setSubmitted(true);
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
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {/* Fixed Header - Scroll-based styling */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md border-b border-gray-100' 
          : 'bg-transparent backdrop-blur-sm border-b border-white/10'
      }`}>
        <div className="max-w-[1440px] mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo - Left */}
          <div 
            className="relative cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <Image 
              src="/bizon-logo.png" 
              alt="비즈온" 
              width={160} 
              height={45}
              className={`object-contain transition-all duration-300 ${
                isScrolled ? '' : 'brightness-0 invert'
              }`}
              style={{
                clipPath: 'inset(0 0 35% 0)' // 하단 35% 잘라내기 (마케팅 텍스트 제거)
              }}
            />
          </div>

          {/* Navigation & CTA - Right */}
          <div className="flex items-center gap-8">
            <nav className={`hidden lg:flex items-center gap-8 text-base font-bold transition-colors ${
              isScrolled ? 'text-gray-600' : 'text-white'
            }`}>
              <a href="#reason" className={isScrolled ? 'hover:text-orange-500' : 'hover:text-orange-400'}>서비스 특징</a>
              <a href="#process" className={isScrolled ? 'hover:text-orange-500' : 'hover:text-orange-400'}>진행 방식</a>
              <a href="#review" className={isScrolled ? 'hover:text-orange-500' : 'hover:text-orange-400'}>고객 후기</a>
            </nav>
            <a 
              href="#contact-form"
              className={`px-6 py-3 rounded-full text-sm font-bold transition-all ${
                isScrolled 
                  ? 'bg-linear-to-r from-orange-500 to-red-500 text-white hover:shadow-lg hover:shadow-orange-500/30' 
                  : 'bg-white text-gray-900 hover:bg-gray-100'
              }`}
            >
              문의하기
            </a>
          </div>
        </div>
      </header>

      {/* VIDEO HERO Section - Full Screen */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/85 z-10" /> {/* Dark Overlay for Readability */}
          <iframe
            ref={videoRef}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[177.78vh] min-w-full min-h-[56.25vw] h-[100.1%] pointer-events-none scale-110"
            src={`https://www.youtube.com/embed/${heroVideoId}?autoplay=1&mute=1&loop=1&playlist=${heroVideoId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`}
            title="Background Video"
            allow="autoplay; encrypted-media"
          />
        </div>

        {/* Hero Content - Animated Text Sequence */}
        <div className="relative z-20 max-w-7xl mx-auto px-6 text-center">
          <HeroTextSequence />
        </div>
      </section>

      {/* Sticky Bottom Buttons - Swapped Order */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-t border-gray-100 md:bg-transparent md:backdrop-blur-none md:border-none">
        <div className="max-w-7xl mx-auto px-4 py-3 md:py-4 flex flex-col md:flex-row gap-2 md:gap-3">
          <a 
            href="#contact-form"
            className="flex-1 py-3.5 md:py-4 bg-white border-2 border-gray-200 text-gray-700 text-center text-base md:text-lg font-bold rounded-xl hover:border-orange-500 hover:text-orange-500 transition-all shadow-sm"
          >
            우리 매장 새는 구멍 3개만 찾기
          </a>
          <a 
            href="#contact-form"
            className="flex-1 py-3.5 md:py-4 bg-linear-to-r from-orange-500 to-red-500 text-white text-center text-base md:text-lg font-bold rounded-xl shadow-lg hover:shadow-orange-500/50 transition-all flex items-center justify-center gap-2"
          >
            상담이 아니라 진단 요청하기
            <ArrowRight className="h-5 w-5" />
          </a>
        </div>
      </div>

      {/* Kakao Button - Aligned with CTA */}
      <a 
        href="https://pf.kakao.com/_xxxx"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-[#FAE100] rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all"
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
            <h2 className="text-3xl md:text-5xl font-black mb-4">
              프랜차이즈도 <span className="text-orange-500">꼭 마케팅을 해야 하는 이유</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              { icon: MapPin, title: '가까운 곳', desc: '고객은 브랜드보다 가까운 곳을 먼저 찾습니다.' },
              { icon: Star, title: '후기 좋은 곳', desc: '같은 브랜드라도 리뷰 점수가 다르면 선택이 달라집니다.' },
              { icon: Phone, title: '지금 가능한 곳', desc: '영업 중이고, 바로 예약/전화가 되는 곳을 선택합니다.' },
            ].map((item, i) => (
              <div 
                key={i} 
                className="text-center p-12 rounded-3xl bg-gray-50 hover:bg-orange-50 transition-colors group"
                data-aos="fade-up"
                data-aos-delay={i * 100}
              >
                <div className="h-20 w-20 mx-auto rounded-2xl bg-white shadow-lg flex items-center justify-center mb-8 group-hover:bg-orange-500 group-hover:text-white transition-all">
                  <item.icon className="h-10 w-10 text-orange-500 group-hover:text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-gray-600 text-lg">{item.desc}</p>
              </div>
            ))}
          </div>

          <div 
            className="text-center p-12 rounded-3xl bg-linear-to-r from-orange-500 to-red-500 text-white"
            data-aos="zoom-in"
          >
            <p className="text-2xl md:text-3xl font-bold leading-tight">
              고객은 브랜드보다 <span className="underline decoration-2 underline-offset-8">가까운 곳, 후기 좋은 곳, 지금 가능한 곳</span>을 고릅니다.<br />
              <span className="text-4xl md:text-5xl lg:text-5xl mt-6 block">결국 성과는 <span className="text-yellow-300">노출 → 확신 → 행동</span>으로 결정됩니다.</span>
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: 지역장악마케팅 선언 - Full Screen */}
      <section className="min-h-screen flex items-center justify-center py-24 px-6 bg-gray-900 text-white">
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
                <item.icon className="h-10 w-10 text-orange-400" />
                <span className="text-sm font-bold text-center">{item.label}</span>
              </div>
            ))}
          </div>

          {/* Middle: Main Message */}
          <div className="text-center mb-16" data-aos="fade-up" data-aos-delay="400">
            <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">
              우리는 "노출"이 아니라<br />
              <span className="text-orange-400">지역 1등 전환 구조</span>를 만듭니다.
            </h2>
            
            <p className="text-2xl text-gray-300 mb-12">
              사장님 매장을 <span className="text-white font-bold">지역 1등 업체</span>로 만들어드리겠습니다.
            </p>
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
              { number: '평균 3배', label: '매출 증가율', sublabel: '6개월 기준' },
            ].map((stat, i) => (
              <div 
                key={i} 
                className="text-center p-8 rounded-2xl bg-white/5 border border-white/10"
                data-aos="zoom-in"
                data-aos-delay={700 + i * 100}
              >
                <div className="text-4xl md:text-5xl font-black text-orange-400 mb-3">
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
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16" data-aos="fade-up">
            <div className="inline-block px-6 py-2 bg-orange-100 text-orange-600 rounded-full text-sm font-bold mb-4">
              Why BIZON
            </div>
            <h2 className="text-4xl md:text-5xl font-black">
              진짜 전문가에게 맡기세요.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            <div 
              className="p-12 rounded-3xl bg-linear-to-br from-orange-50 to-red-50 border border-orange-100"
              data-aos="fade-right"
            >
              <Building2 className="h-14 w-14 text-orange-500 mb-6" />
              <h3 className="text-3xl font-bold mb-5">직접 운영 경험</h3>
              <p className="text-gray-600 text-xl leading-relaxed">
                연매출 30억 규모의 요식업 매장 <strong className="text-gray-900">3곳 직접 운영</strong><br />
                (현재도 성업 중)
              </p>
            </div>
            
            <div 
              className="p-12 rounded-3xl bg-linear-to-br from-blue-50 to-indigo-50 border border-blue-100"
              data-aos="fade-left"
            >
              <Award className="h-14 w-14 text-blue-500 mb-6" />
              <h3 className="text-3xl font-bold mb-5">검증된 자격</h3>
              <ul className="text-gray-600 space-y-4 text-lg">
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 shrink-0" />
                  성균관대학교 경영학 석사
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 shrink-0" />
                  브랜드관리사 1급 / 브랜드매니저 1급
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 shrink-0" />
                  한국브랜드마케팅협회 정회원
                </li>
              </ul>
            </div>
          </div>

          <div 
            className="mt-12 p-10 bg-gray-900 rounded-3xl text-center"
            data-aos="zoom-in"
            data-aos-delay="200"
          >
            <p className="text-white text-xl md:text-2xl font-medium">
              "<span className="text-orange-400">말</span>"이 아니라 "<span className="text-orange-400">근거와 결과</span>"로 증명합니다.
            </p>
          </div>
        </div>
      </section>


      {/* Section 5: 핵심 서비스 */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              핵심 서비스
            </h2>
            <p className="text-xl text-gray-600">프랜차이즈 지점에 딱 맞는 실행형 서비스</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                icon: Target, 
                title: '플레이스 주력', 
                desc: '노출 구조 + 전환 동선 (전화/길찾기/예약) 설계',
                color: 'orange'
              },
              { 
                icon: Palette, 
                title: '디자인물 제작', 
                desc: '메뉴/배너/이벤트/리뷰 유도물 (매장 실사용)',
                color: 'blue'
              },
              { 
                icon: BarChart3, 
                title: '프랜차이즈 컨설팅', 
                desc: '지점별 KPI 기준 우선순위 실행',
                color: 'green'
              },
            ].map((service, i) => (
              <div 
                key={i} 
                className="p-10 rounded-3xl bg-white shadow-xl hover:shadow-2xl transition-all border border-gray-100 group"
              >
                <div className={`h-16 w-16 rounded-2xl bg-${service.color}-100 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                  <service.icon className={`h-8 w-8 text-${service.color}-500`} />
                </div>
                <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                <p className="text-gray-600 text-lg leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 6: 비즈온의 마케팅 성공방식 - Redesigned */}
      <section id="process" className="py-32 px-6 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-20" data-aos="fade-up">
            <div className="inline-block px-6 py-2 bg-orange-100 text-orange-600 rounded-full text-sm font-bold mb-4">
              SUCCESS CYCLE
            </div>
            <h2 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-gray-900 via-orange-600 to-gray-900 bg-clip-text text-transparent">
              비즈온의 마케팅 성공방식
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
              멈추지 않고 계속 돌아가는 <span className="text-orange-500 font-black">성공의 수레바퀴</span>
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
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg">
                  01
                </div>
                
                {/* 3D Icon */}
                <div className="w-20 h-20 mb-6 relative">
                  <div className="absolute inset-0 bg-linear-to-br from-blue-400 to-cyan-500 rounded-3xl blur-sm opacity-30 transform translate-y-2"></div>
                  <div className="absolute inset-0 bg-linear-to-br from-blue-400 to-cyan-500 rounded-3xl shadow-xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
                    <span className="text-5xl filter drop-shadow-lg">🔍</span>
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
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg">
                  02
                </div>
                
                {/* 3D Icon */}
                <div className="w-20 h-20 mb-6 relative ml-auto">
                  <div className="absolute inset-0 bg-linear-to-br from-amber-400 to-orange-500 rounded-3xl blur-sm opacity-30 transform translate-y-2"></div>
                  <div className="absolute inset-0 bg-linear-to-br from-amber-400 to-orange-500 rounded-3xl shadow-xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
                    <span className="text-5xl filter drop-shadow-lg">📋</span>
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
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg">
                  03
                </div>
                
                {/* 3D Icon */}
                <div className="w-20 h-20 mb-6 relative ml-auto">
                  <div className="absolute inset-0 bg-linear-to-br from-purple-400 to-pink-500 rounded-3xl blur-sm opacity-30 transform translate-y-2"></div>
                  <div className="absolute inset-0 bg-linear-to-br from-purple-400 to-pink-500 rounded-3xl shadow-xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
                    <span className="text-5xl filter drop-shadow-lg">⚡</span>
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
                className="group relative bg-gradient-to-br from-orange-50 to-red-50 p-10 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-orange-200 hover:border-orange-300 md:order-3"
                data-aos="fade-right"
                data-aos-delay="400"
              >
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg">
                  04
                </div>
                
                {/* 3D Icon */}
                <div className="w-20 h-20 mb-6 relative">
                  <div className="absolute inset-0 bg-linear-to-br from-orange-400 to-red-500 rounded-3xl blur-sm opacity-30 transform translate-y-2"></div>
                  <div className="absolute inset-0 bg-linear-to-br from-orange-400 to-red-500 rounded-3xl shadow-xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
                    <span className="text-5xl filter drop-shadow-lg">📊</span>
                  </div>
                </div>

                <h3 className="text-3xl font-black mb-4 text-orange-600">주간 개선</h3>
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                  데이터 기반 지속적 성장
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                    성과 분석
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                    전략 조정
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Bottom CTA */}
          <div className="mt-20 text-center" data-aos="zoom-in">
            <div className="inline-block px-12 py-6 bg-gray-900 text-white rounded-2xl text-2xl md:text-3xl font-bold shadow-2xl hover:shadow-orange-500/20 transition-all hover:scale-105 leading-relaxed">
              🚀 한 번으로 끝나는 게 아닙니다.<br />
              우리는 매주 성장합니다.
            </div>
          </div>
        </div>
      </section>

      {/* Section 8: REAL REVIEW */}
      <section id="review" className="py-24 px-6 bg-gray-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-5 py-2 bg-orange-500/20 text-orange-400 rounded-full text-sm font-bold mb-6 border border-orange-500/30 tracking-widest uppercase">
              Real Review
            </span>
            <h2 className="text-4xl md:text-6xl font-black">
              실제 <span className="text-orange-400">사장님들</span>의 이야기
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
                <div className="bg-gray-800 rounded-3xl p-10 border border-gray-700 hover:border-orange-500/50 transition-all h-full flex flex-col">
                  <span className="inline-block px-4 py-1 bg-orange-500 text-white text-xs font-bold rounded mb-6 w-fit">
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
                    <div className="h-12 w-12 rounded-full bg-orange-500/20 flex items-center justify-center">
                      <Users className="h-6 w-6 text-orange-400" />
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
              수 많은 사장님들과의 <span className="text-orange-500">소통 메세지</span>
            </h2>
            <p className="text-gray-600">비즈온마케팅은 소통을 가장 중요하게 생각합니다</p>
          </div>

          <div className="relative h-[500px] overflow-hidden rounded-2xl">
            <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-gray-50 to-transparent z-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-50 to-transparent z-10 pointer-events-none" />

            <div className="flex gap-4 h-full">
              <div className="flex-1 flex flex-col gap-4 animate-[scrollUp_25s_linear_infinite]">
                {[...Array(2)].map((_, setIdx) => (
                  <div key={setIdx} className="flex flex-col gap-4">
                    {[
                      '대표님! 제가 네이버에서 찾아보니까 정말 좋아지고 있어요 👍',
                      '매출이 확 올랐어요! 감사합니다 🙏',
                      '리뷰 관리 시스템 너무 좋습니다',
                      '기대 이상의 결과였어요',
                    ].map((msg, i) => (
                      <div key={`${setIdx}-${i}`} className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
                        <div className="flex items-start gap-3">
                          <div className="h-8 w-8 rounded-full bg-yellow-400 flex items-center justify-center text-sm">😊</div>
                          <div className="flex-1"><p className="text-sm text-gray-800">{msg}</p></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <div className="flex-1 flex flex-col gap-4 animate-[scrollUp_20s_linear_infinite]">
                {[...Array(2)].map((_, setIdx) => (
                  <div key={setIdx} className="flex flex-col gap-4">
                    {[
                      '저희 가게 지역에서 1등이 됐어요!',
                      '손님들이 네이버 보고 왔다고 해요 😄',
                      '전화 문의가 확실히 늘었어요',
                      '투명하게 진행해주셔서 믿음이 갑니다',
                    ].map((msg, i) => (
                      <div key={`${setIdx}-${i}`} className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
                        <div className="flex items-start gap-3">
                          <div className="h-8 w-8 rounded-full bg-green-400 flex items-center justify-center text-sm">🎉</div>
                          <div className="flex-1"><p className="text-sm text-gray-800">{msg}</p></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <div className="flex-1 flex flex-col gap-4 animate-[scrollUp_22s_linear_infinite]">
                {[...Array(2)].map((_, setIdx) => (
                  <div key={setIdx} className="flex flex-col gap-4">
                    {[
                      '대표님 덕분에 장사가 잘 됩니다!',
                      '예약률이 3배나 올랐어요',
                      '주변에도 추천하고 있어요',
                      '꼼꼼하게 관리해주셔서 감사해요',
                    ].map((msg, i) => (
                      <div key={`${setIdx}-${i}`} className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
                        <div className="flex items-start gap-3">
                          <div className="h-8 w-8 rounded-full bg-blue-400 flex items-center justify-center text-sm">💙</div>
                          <div className="flex-1"><p className="text-sm text-gray-800">{msg}</p></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <div className="hidden md:flex flex-1 flex-col gap-4 animate-[scrollUp_28s_linear_infinite]">
                {[...Array(2)].map((_, setIdx) => (
                  <div key={setIdx} className="flex flex-col gap-4">
                    {[
                      '솔직하게 말씀해주셔서 좋았어요',
                      '다른 업체랑 달라요!',
                      '결과가 눈에 보이니까 좋네요',
                      '사장님들 필수입니다 ㅎㅎ',
                    ].map((msg, i) => (
                      <div key={`${setIdx}-${i}`} className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
                        <div className="flex items-start gap-3">
                          <div className="h-8 w-8 rounded-full bg-purple-400 flex items-center justify-center text-sm">💜</div>
                          <div className="flex-1"><p className="text-sm text-gray-800">{msg}</p></div>
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

      {/* Section 10: 문의폼 */}
      <section id="contact-form" className="py-24 px-6 bg-gradient-to-b from-gray-900 to-black text-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1 bg-orange-500/10 text-orange-500 rounded-full text-sm font-bold mb-4">
              초간단 6가지 질문
            </div>
            <h2 className="text-4xl md:text-6xl font-black mb-6">
              상담이 아니라 <span className="text-orange-400">진단</span>부터 받으세요.
            </h2>
            <p className="text-gray-400 text-xl">
              대표님 매장에 맞는 <span className="text-white font-bold">실행 우선순위 1장</span>으로 답합니다.
            </p>
          </div>

          {submitted ? (
            <div className="text-center p-16 rounded-3xl bg-white/5 border border-white/10">
              <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-8" />
              <h3 className="text-3xl font-bold mb-4">진단 요청이 접수되었습니다!</h3>
              <p className="text-xl text-gray-400">영업일 기준 1일 내로 담당자가 연락드립니다.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-12">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="flex items-center gap-3 text-sm font-medium text-gray-300 mb-3">
                    <span className="flex items-center justify-center w-7 h-7 bg-orange-500 text-white rounded-full text-xs font-black shadow-lg shadow-orange-500/40">1</span>
                    브랜드/지점명 *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.brandName}
                    onChange={(e) => setFormData({...formData, brandName: e.target.value})}
                    placeholder="예: 맘스터치 강남역점"
                    className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition text-lg"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-3 text-sm font-medium text-gray-300 mb-3">
                    <span className="flex items-center justify-center w-7 h-7 bg-orange-500 text-white rounded-full text-xs font-black shadow-lg shadow-orange-500/40">2</span>
                    주소 (상권 파악) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    placeholder="예: 서울시 강남구 역삼동"
                    className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition text-lg"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-3 text-sm font-medium text-gray-300 mb-3">
                  <span className="flex items-center justify-center w-7 h-7 bg-orange-500 text-white rounded-full text-xs font-black shadow-lg shadow-orange-500/40">3</span>
                  목표 (중복 선택 가능)
                </label>
                <div className="flex flex-wrap gap-3">
                  {['전화', '길찾기', '예약', '방문', '리뷰'].map(item => (
                    <button
                      type="button"
                      key={item}
                      onClick={() => toggleGoal(item)}
                      className={`px-6 py-3 rounded-full text-base font-medium border transition ${
                        formData.goal.includes(item) 
                          ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/30' 
                          : 'bg-transparent border-white/20 text-gray-300 hover:border-orange-500'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="flex items-center gap-3 text-sm font-medium text-gray-300 mb-4">
                  <span className="flex items-center justify-center w-7 h-7 bg-orange-500 text-white rounded-full text-xs font-black shadow-lg shadow-orange-500/40">4</span>
                  현재 운영 중인 마케팅 (중복 선택 가능)
                </label>
                <div className="flex flex-wrap gap-3">
                  {['플레이스', '블로그', '광고', 'SNS', '없음'].map(item => (
                    <button
                      type="button"
                      key={item}
                      onClick={() => toggleMarketing(item)}
                      className={`px-6 py-3 rounded-full text-base font-medium border transition ${
                        formData.currentMarketing.includes(item) 
                          ? 'bg-blue-500 border-blue-500 text-white shadow-lg shadow-blue-500/30' 
                          : 'bg-transparent border-white/20 text-gray-300 hover:border-blue-500'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="flex items-center gap-3 text-sm font-medium text-gray-300 mb-3">
                  <span className="flex items-center justify-center w-7 h-7 bg-orange-500 text-white rounded-full text-xs font-black shadow-lg shadow-orange-500/40">5</span>
                  가장 큰 고민 (한 줄)
                </label>
                <input
                  type="text"
                  value={formData.concern}
                  onChange={(e) => setFormData({...formData, concern: e.target.value})}
                  placeholder="예: 노출은 되는데 전화가 안 와요"
                  className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition text-lg"
                />
              </div>

              <div>
                <label className="flex items-center gap-3 text-sm font-medium text-gray-300 mb-3">
                  <span className="flex items-center justify-center w-7 h-7 bg-orange-500 text-white rounded-full text-xs font-black shadow-lg shadow-orange-500/40">6</span>
                  연락처 *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.contact}
                  onChange={(e) => setFormData({...formData, contact: e.target.value})}
                  placeholder="010-0000-0000"
                  className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition text-lg"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-5 bg-linear-to-r from-orange-500 to-red-500 text-white rounded-2xl text-xl font-bold hover:shadow-2xl hover:shadow-orange-500/40 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? '접수 중...' : '우리 매장 지역장악 플랜 받기'}
                  {!isSubmitting && <ArrowRight className="h-6 w-6" />}
                </button>
                <button
                  type="button"
                  className="flex-1 py-5 border-2 border-white/20 text-white rounded-2xl text-xl font-bold hover:border-orange-500 transition-all bg-white/5"
                >
                  디자인+플레이스 패키지 문의
                </button>
              </div>

              <p className="text-center text-sm text-gray-500 pt-6">
                🔒 가능/불가능을 먼저 말씀드립니다. 불필요한 비용을 권하지 않습니다.
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
          height={50}
          className="object-contain mx-auto mb-4 brightness-0 invert opacity-30"
          style={{
            clipPath: 'inset(0 0 35% 0)' // 하단 35% 잘라내기 (마케팅 텍스트 제거)
          }}
        />
        <div className="max-w-3xl mx-auto space-y-4">
          <p>© 2025 비즈온마케팅. All rights reserved.</p>
          <p className="text-gray-400 text-base">
            대표: 양승환 | 사업자등록번호: 565-81-03594
          </p>
          <p className="text-gray-400 text-sm">
            주소: 경기도 수원시 영통구 광산로213번길 15, 2층 201-B66(월드타운)
          </p>
          <p className="text-orange-500/50 mt-10 text-xl font-bold">우리는 '대행'이 아니라 매출 실험을 설계합니다.</p>
        </div>
      </footer>
    </div>
  );
}
