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
  ChevronDown
} from 'lucide-react';

export default function BizonMarketing({ site }: { site: string }) {
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
            className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full text-sm font-bold hover:shadow-lg hover:shadow-orange-500/30 transition-all"
          >
            진단 요청하기
          </a>
        </div>
      </header>

      {/* HERO Section */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
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
              <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
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
                className="group px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl text-lg font-bold hover:shadow-xl hover:shadow-orange-500/30 transition-all flex items-center justify-center gap-2"
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

          <div className="text-center p-8 rounded-3xl bg-gradient-to-r from-orange-500 to-red-500 text-white">
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
            <div className="p-8 rounded-3xl bg-gradient-to-br from-orange-50 to-red-50 border border-orange-100">
              <Building2 className="h-10 w-10 text-orange-500 mb-4" />
              <h3 className="text-2xl font-bold mb-3">직접 운영 경험</h3>
              <p className="text-gray-600 leading-relaxed">
                연매출 30억 규모의 요식업 매장 <strong className="text-gray-900">3곳 직접 운영</strong><br />
                (현재도 성업 중)
              </p>
            </div>
            
            <div className="p-8 rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
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
      <section id="contact-form" className="py-20 px-6 bg-gradient-to-b from-gray-900 to-black text-white">
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
                  className="flex-1 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl text-lg font-bold hover:shadow-lg hover:shadow-orange-500/30 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
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
