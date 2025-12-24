'use client';

import { useState } from 'react';
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
  Play
} from 'lucide-react';
import { useAOS } from '@/hooks/use-aos';

export default function BizonMarketing({ site }: { site: string }) {
  // AOS 스크롤 애니메이션 초기화
  useAOS();

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
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Image 
            src="/bizon-logo.png" 
            alt="비즈온마케팅" 
            width={140} 
            height={40}
            className="object-contain"
          />
          <a 
            href="#contact-form"
            className="px-5 py-2.5 bg-linear-to-r from-orange-500 to-red-500 text-white rounded-full text-sm font-bold hover:shadow-lg hover:shadow-orange-500/30 transition-all"
          >
            진단 요청하기
          </a>
        </div>
      </header>

      {/* HERO Section */}
      <section className="pt-32 pb-20 px-6 bg-linear-to-b from-gray-50 to-white relative overflow-hidden">
        <div className="absolute top-20 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
        
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 bg-orange-100 text-orange-600 rounded-full text-sm font-bold mb-6">
              현재 300개 프랜차이즈 지점 마케팅 진행 중
            </span>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-6">
              <span className="text-gray-400">프랜차이즈 매장이라</span><br />
              <span className="text-gray-400">마케팅이 불필요하다고요?</span><br />
              <span className="bg-linear-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                절대 아닙니다.
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-4">
              브랜드는 같아도, <span className="font-bold text-gray-900">성과는 지점마다 다릅니다.</span><br />
              승부는 네이버 플레이스에서 <span className="text-orange-500 font-bold">'선택'받는 구조</span>입니다.
            </p>
            
            <p className="text-gray-500 mb-10">
              검증된 방식으로 <strong className="text-gray-700">지역장악마케팅</strong>을 실행합니다.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="#contact-form"
                className="group px-8 py-4 bg-linear-to-r from-orange-500 to-red-500 text-white rounded-2xl text-lg font-bold hover:shadow-xl hover:shadow-orange-500/30 transition-all flex items-center justify-center gap-2"
              >
                상담이 아니라 진단 요청하기
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a 
                href="#contact-form"
                className="px-8 py-4 border-2 border-gray-200 text-gray-700 rounded-2xl text-lg font-bold hover:border-orange-500 hover:text-orange-500 transition-all"
              >
                우리 매장 새는 구멍 3개만 찾기
              </a>
            </div>
            
            <p className="mt-6 text-sm text-gray-400">
              불필요한 영업 없이, 가능/불가능 먼저 안내
            </p>
          </div>

          {/* Scroll Indicator */}
          <div className="flex justify-center animate-bounce">
            <ChevronDown className="h-8 w-8 text-gray-300" />
          </div>
        </div>
      </section>

      {/* Section 2: 프랜차이즈도 꼭 해야 하는 이유 */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              프랜차이즈도 <span className="text-orange-500">꼭 해야 하는 이유</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              { icon: MapPin, title: '가까운 곳', desc: '고객은 브랜드보다 가까운 곳을 먼저 찾습니다.' },
              { icon: Star, title: '후기 좋은 곳', desc: '같은 브랜드라도 리뷰 점수가 다르면 선택이 달라집니다.' },
              { icon: Phone, title: '지금 가능한 곳', desc: '영업 중이고, 바로 예약/전화가 되는 곳을 선택합니다.' },
            ].map((item, i) => (
              <div key={i} className="text-center p-8 rounded-3xl bg-gray-50 hover:bg-orange-50 transition-colors group">
                <div className="h-16 w-16 mx-auto rounded-2xl bg-white shadow-lg flex items-center justify-center mb-6 group-hover:bg-orange-500 group-hover:text-white transition-all">
                  <item.icon className="h-8 w-8 text-orange-500 group-hover:text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center p-8 rounded-3xl bg-linear-to-r from-orange-500 to-red-500 text-white">
            <p className="text-xl md:text-2xl font-bold">
              그래서 지점 성과는 결국<br />
              <span className="text-3xl md:text-4xl">노출 → 확신 → 전화/길찾기/예약</span>에서 갈립니다.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: 지역장악마케팅 선언 */}
      <section className="py-20 px-6 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-8">
            <Image 
              src="/bizon-icon.png" 
              alt="비즈온" 
              width={80} 
              height={80}
              className="mx-auto"
            />
          </div>
          
          <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight">
            우리는 "노출"이 아니라<br />
            <span className="text-orange-400">지역 1등 전환 구조</span>를 만듭니다.
          </h2>
          
          <p className="text-xl text-gray-300 mb-10">
            사장님 매장을 <span className="text-white font-bold">지역 1등 업체</span>로 만들어드리겠습니다.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            {['네이버 플레이스 최적화', '전환 동선 설계', '지역 키워드 장악', '리뷰 관리 시스템'].map((tag, i) => (
              <span key={i} className="px-5 py-2 bg-white/10 rounded-full text-sm font-medium border border-white/20">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: 비즈온마케팅이 다른 이유 (신뢰) */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-orange-500 font-bold text-sm tracking-wider mb-2 block">WHY BIZON</span>
            <h2 className="text-3xl md:text-4xl font-black">
              진짜 전문가에게 맡기세요.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 rounded-3xl bg-linear-to-br from-orange-50 to-red-50 border border-orange-100">
              <Building2 className="h-10 w-10 text-orange-500 mb-4" />
              <h3 className="text-2xl font-bold mb-3">직접 운영 경험</h3>
              <p className="text-gray-600 leading-relaxed">
                연매출 30억 규모의 요식업 매장 <strong className="text-gray-900">3곳 직접 운영</strong><br />
                (현재도 성업 중)
              </p>
            </div>
            
            <div className="p-8 rounded-3xl bg-linear-to-br from-blue-50 to-indigo-50 border border-blue-100">
              <Award className="h-10 w-10 text-blue-500 mb-4" />
              <h3 className="text-2xl font-bold mb-3">검증된 자격</h3>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  성균관대학교 경영학 석사
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  브랜드관리사 1급 / 브랜드매니저 1급
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  한국브랜드마케팅협회 정회원
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 p-6 bg-gray-900 rounded-2xl text-center">
            <p className="text-white text-lg font-medium">
              "<span className="text-orange-400">말</span>"이 아니라 "<span className="text-orange-400">근거와 결과</span>"로 증명합니다.
            </p>
          </div>
        </div>
      </section>

      {/* Section 5: 핵심 서비스 */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              핵심 서비스
            </h2>
            <p className="text-gray-600">프랜차이즈 지점에 딱 맞는 실행형 서비스</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
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
                className="p-8 rounded-3xl bg-white shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
              >
                <div className={`h-14 w-14 rounded-2xl bg-${service.color}-100 flex items-center justify-center mb-6`}>
                  <service.icon className={`h-7 w-7 text-${service.color}-500`} />
                </div>
                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                <p className="text-gray-600">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 6: 진행 방식 (Spinning Process) */}
      <section className="py-24 px-6 bg-white overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-6">
              진행 방식
            </h2>
            <p className="text-xl text-gray-600">멈추지 않고 계속 돌아가는 <span className="text-orange-500 font-bold">성공의 수레바퀴</span></p>
          </div>

          <div className="relative max-w-3xl mx-auto h-[400px] md:h-[500px] flex items-center justify-center">
             {/* Spinning Core */}
             <div className="absolute inset-0 flex items-center justify-center">
                 {/* Rotating Border Ring */}
                <div className="w-[280px] h-[280px] md:w-[350px] md:h-[350px] border-2 border-dashed border-orange-200 rounded-full animate-[spin_20s_linear_infinite]" />
                
                {/* Center Logo with Arrow */}
                <div className="absolute bg-white p-4 rounded-full shadow-2xl z-20">
                    <div className="w-24 h-24 md:w-32 md:h-32 bg-linear-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center relative shadow-inner">
                        <div className="absolute inset-0 border-4 border-white/20 rounded-full animate-[spin_3s_linear_infinite]" style={{ borderTopColor: 'white' }}></div>
                        <Image 
                          src="/bizon-icon-white.png" 
                          alt="BIZON" 
                          width={60} 
                          height={60} 
                          className="object-contain"
                        />
                    </div>
                </div>
             </div>

             {/* 4 Steps - Positioned Absolute */}
             {/* Step 01 - Top Left */}
             <div className="absolute top-0 left-0 md:top-4 md:left-4 max-w-[160px] text-center md:text-right">
                 <div className="text-5xl md:text-6xl font-black text-gray-100 mb-2 absolute -z-10 -top-4 -right-4 md:relative md:text-gray-100/50">01</div>
                 <h3 className="text-xl font-bold mb-1 text-gray-900">진단</h3>
                 <p className="text-sm text-gray-500">현재 상태를<br/>객관적으로 분석</p>
             </div>

             {/* Step 02 - Top Right */}
             <div className="absolute top-0 right-0 md:top-4 md:right-4 max-w-[160px] text-center md:text-left">
                 <div className="text-5xl md:text-6xl font-black text-gray-100 mb-2 absolute -z-10 -top-4 -left-4 md:relative md:text-gray-100/50">02</div>
                 <h3 className="text-xl font-bold mb-1 text-gray-900">설계</h3>
                 <p className="text-sm text-gray-500">지점 맞춤형<br/>전략 수립</p>
             </div>

             {/* Step 03 - Bottom Left */}
             <div className="absolute bottom-0 left-0 md:bottom-4 md:left-4 max-w-[160px] text-center md:text-right">
                 <div className="text-5xl md:text-6xl font-black text-gray-100 mb-2 absolute -z-10 -top-4 -right-4 md:relative md:text-gray-100/50">03</div>
                 <h3 className="text-xl font-bold mb-1 text-gray-900">실행</h3>
                 <p className="text-sm text-gray-500">고민 없이<br/>즉시 적용</p>
             </div>

             {/* Step 04 - Bottom Right */}
             <div className="absolute bottom-0 right-0 md:bottom-4 md:right-4 max-w-[160px] text-center md:text-left">
                 <div className="text-5xl md:text-6xl font-black text-gray-100 mb-2 absolute -z-10 -top-4 -left-4 md:relative md:text-gray-100/50">04</div>
                 <h3 className="text-xl font-bold mb-1 text-orange-500">주간 개선</h3>
                 <p className="text-sm text-gray-500">데이터 기반<br/>지속적 성장</p>
             </div>
          </div>
          
          <div className="mt-12 text-center">
            <span className="inline-block px-6 py-3 bg-gray-900 text-white rounded-full text-sm font-bold shadow-lg animate-bounce">
                🚀 한 번으로 끝나는 게 아닙니다. 매주 성장합니다.
            </span>
          </div>
        </div>
      </section>

      {/* Section 7 & 8: CTA + Form */}
      <section id="contact-form" className="py-20 px-6 bg-linear-to-b from-gray-900 to-black text-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              상담이 아니라 <span className="text-orange-400">진단</span>부터 받으세요.
            </h2>
            <p className="text-gray-400 text-lg">
              대표님 매장에 맞는 실행 우선순위 1장으로 답합니다.
            </p>
          </div>

          {submitted ? (
            <div className="text-center p-12 rounded-3xl bg-white/5 border border-white/10">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
              <h3 className="text-2xl font-bold mb-2">진단 요청이 접수되었습니다!</h3>
              <p className="text-gray-400">영업일 기준 1일 내로 담당자가 연락드립니다.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">브랜드/지점명 *</label>
                  <input
                    type="text"
                    required
                    value={formData.brandName}
                    onChange={(e) => setFormData({...formData, brandName: e.target.value})}
                    placeholder="예: 맘스터치 강남역점"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">주소 (상권 파악) *</label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    placeholder="예: 서울시 강남구 역삼동"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">목표 (중복 선택 가능)</label>
                <div className="flex flex-wrap gap-2">
                <div className="flex flex-wrap gap-2">
                  {['전화', '길찾기', '예약', '방문', '리뷰'].map(item => (
                    <button
                      type="button"
                      key={item}
                      onClick={() => toggleGoal(item)}
                      className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
                        formData.goal.includes(item) 
                          ? 'bg-orange-500 border-orange-500 text-white' 
                          : 'bg-transparent border-white/20 text-gray-300 hover:border-orange-500'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">현재 운영 중인 마케팅 (중복 선택 가능)</label>
                <div className="flex flex-wrap gap-2">
                  {['플레이스', '블로그', '광고', 'SNS', '없음'].map(item => (
                    <button
                      type="button"
                      key={item}
                      onClick={() => toggleMarketing(item)}
                      className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
                        formData.currentMarketing.includes(item) 
                          ? 'bg-blue-500 border-blue-500 text-white' 
                          : 'bg-transparent border-white/20 text-gray-300 hover:border-blue-500'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">가장 큰 고민 (한 줄)</label>
                <input
                  type="text"
                  value={formData.concern}
                  onChange={(e) => setFormData({...formData, concern: e.target.value})}
                  placeholder="예: 노출은 되는데 전화가 안 와요"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">연락처 *</label>
                <input
                  type="tel"
                  required
                  value={formData.contact}
                  onChange={(e) => setFormData({...formData, contact: e.target.value})}
                  placeholder="010-0000-0000"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-4 bg-linear-to-r from-orange-500 to-red-500 text-white rounded-xl text-lg font-bold hover:shadow-lg hover:shadow-orange-500/30 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? '접수 중...' : '우리 지점 지역장악 플랜 받기'}
                  {!isSubmitting && <ArrowRight className="h-5 w-5" />}
                </button>
                <button
                  type="button"
                  className="flex-1 py-4 border-2 border-white/20 text-white rounded-xl text-lg font-bold hover:border-orange-500 transition-all"
                >
                  디자인+플레이스 패키지 문의
                </button>
              </div>

              <p className="text-center text-sm text-gray-500 pt-4">
                🔒 가능/불가능을 먼저 말씀드립니다. 불필요한 비용을 권하지 않습니다.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* ============================================= */}
      {/* 시장의 문제점 경고 (매듭컴퍼니 스타일) */}
      {/* ============================================= */}
      <section className="py-24 px-6 bg-gray-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzMzMyIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] blur-[2px]" />
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-8 space-y-2">
            <p className="text-gray-500 text-sm">"네이버 공식 대행사 입니다..."</p>
            <p className="text-gray-500 text-sm">"정부 지원사업에 선정되셔서 연락드렸어요..."</p>
          </div>

          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black mb-4">
              어디 하나 <span className="text-blue-400">믿을 곳 없는</span> 마케팅 시장
            </h2>
            <p className="text-gray-400 text-lg">비즈온마케팅은 투명함을 가장 중요하게 생각합니다</p>
          </div>

          <div className="relative mb-8 rounded-2xl overflow-hidden">
            <div className="bg-gray-800/50 backdrop-blur-md p-8 flex items-center justify-center min-h-[200px]">
              <div className="text-center opacity-60 blur-[1px]">
                <p className="text-xl font-bold text-gray-400">📰 뉴스 기사 영역</p>
                <p className="text-sm text-gray-500">(실제 사기 피해 기사 이미지로 교체 예정)</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-12">
            <div className="bg-black/80 backdrop-blur px-6 py-4 rounded-xl border border-white/10 inline-block">
              <p className="text-white font-bold text-lg">
                중소상공인 노리는 '온라인 광고 사기' 피해 심각
              </p>
            </div>
            <div className="bg-black/80 backdrop-blur px-6 py-4 rounded-xl border border-white/10">
              <p className="text-white font-bold text-lg">
                "네이버 광고대행 월4만원대라더니, 264만원 결제"
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {[
              { text: '"저희는 네이버 공식 대행사입니다"', warn: '네이버 공식 대행사는 존재하지 않습니다.' },
              { text: '"정부 지원 사업으로 50% 무료입니다"', warn: '정부 마케팅 지원금 사기입니다.' },
              { text: '"지금 계약하시면 50% 할인입니다"', warn: '조급함을 유도하는 전형적인 수법입니다.' },
              { text: '"월 5만원으로 1등 할 수 있습니다"', warn: '비현실적인 가격은 결과도 비현실적입니다.' },
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-red-500/30 transition-colors group">
                <p className="text-lg font-bold text-white mb-2 flex items-start gap-3">
                  <ShieldAlert className="h-5 w-5 text-red-400 shrink-0 mt-1" />
                  {item.text}
                </p>
                <p className="text-sm text-gray-500 ml-8">→ {item.warn}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <a 
              href="#contact-form"
              className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full text-lg font-bold transition-all shadow-lg shadow-emerald-500/30"
            >
              비즈온과 함께하기
              <ArrowRight className="h-5 w-5" />
            </a>
          </div>
        </div>
      </section>

      {/* ============================================= */}
      {/* REAL REVIEW - 고객 후기 */}
      {/* ============================================= */}
      <section className="py-24 px-6 bg-gray-900 text-white overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 bg-orange-500/20 text-orange-400 rounded-full text-sm font-bold mb-6 border border-orange-500/30">
              REAL REVIEW
            </span>
            <h2 className="text-3xl md:text-4xl font-black">
              실제 <span className="text-orange-400">사장님들</span>의 이야기
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { 
                name: '이영진 대표님', 
                business: '피드백과 자영업 맞춤 케어',
                quote: '피드백과 자영업 맞춤 케어 해주셔서 비즈온과 함께할 생각입니다',
                rating: 5
              },
              { 
                name: '김사장님', 
                business: '음식점 마케팅',
                quote: '대표님! 매달 신경쓸수록 방문 고객이 늘었어요. 기분도 좋습니다',
                rating: 5
              },
              { 
                name: '박대표님', 
                business: '카페 브랜딩',
                quote: '막연했던 어려움을 잘 이끌어주셔서 이제야 방향키를 제대로 잡아갑니다!',
                rating: 5
              },
            ].map((review, i) => (
              <div key={i} className="relative group">
                <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-orange-500/50 transition-all">
                  <span className="inline-block px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded mb-4">
                    BIZON
                  </span>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    "{review.quote}"
                  </p>
                  <div className="flex gap-1 mb-4">
                    {[...Array(review.rating)].map((_, j) => (
                      <Star key={j} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                      <Users className="h-5 w-5 text-orange-400" />
                    </div>
                    <div>
                      <p className="font-bold text-white">{review.name}</p>
                      <p className="text-sm text-gray-500">{review.business}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-full text-white font-medium transition-all">
              <Play className="h-5 w-5" />
              영상 후기 보기
            </button>
          </div>
        </div>
      </section>

      {/* ============================================= */}
      {/* 무한 스크롤 채팅 갤러리 */}
      {/* ============================================= */}
      <section className="py-24 px-6 bg-gray-50 overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              비즈온마케팅과 함께한<br />
              수 많은 사장님들과의 <span className="text-orange-500">소통</span>
            </h2>
            <p className="text-gray-600">비즈온마케팅은 소통을 가장 중요하게 생각합니다</p>
          </div>

          <div className="relative h-[500px] overflow-hidden rounded-2xl">
            <div className="absolute top-0 left-0 right-0 h-20 bg-linear-to-b from-gray-50 to-transparent z-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-linear-to-t from-gray-50 to-transparent z-10 pointer-events-none" />

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

          <div className="mt-12 text-center">
            <a 
              href="#contact-form"
              className="inline-flex items-center gap-2 px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-full text-lg font-bold transition-all shadow-lg shadow-orange-500/30"
            >
              비즈온과 함께하기
              <ArrowRight className="h-5 w-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 bg-black text-gray-500 text-center text-sm">
        <Image 
          src="/bizon-logo.png" 
          alt="비즈온마케팅" 
          width={120} 
          height={35}
          className="object-contain mx-auto mb-4 opacity-50"
        />
        <p>© 2024 비즈온마케팅. All rights reserved.</p>
        <p className="mt-2">우리는 '대행'이 아니라 매출 실험을 설계합니다.</p>
      </footer>
    </div>
  );
}
