'use client';

import { useState, useEffect, useRef } from 'react';
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
  Eye,
  Clock,
  AlertTriangle,
  Play,
  Volume2,
  VolumeX,
  Calendar,
  FileText
} from 'lucide-react';
import { useAOS } from '@/hooks/use-aos';

export default function Fan4Marketing({ site }: { site: string }) {
  // AOS 스크롤 애니메이션 초기화
  useAOS();

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
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLIFrameElement>(null);

  // 배경 영상 - 자영업자 장사 준비 영상 (유튜브 - 요리/카페 오픈 준비)
  // 클라이언트가 별도 링크 주시면 교체. 현재는 임시 영상.
  const heroVideoId = 'dQw4w9WgXcQ'; // 임시 - 추후 클라이언트 제공 영상으로 교체

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
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
          <span className="text-xl font-black text-gray-900">FAN4 MARKETING</span>
          <a 
            href="#contact-form"
            className="px-5 py-2.5 bg-linear-to-r from-orange-500 to-red-500 text-white rounded-full text-sm font-bold hover:shadow-lg hover:shadow-orange-500/30 transition-all"
          >
            진단 요청하기
          </a>
        </div>
      </header>

      {/* ============================================= */}
      {/* VIDEO HERO Section (매듭컴퍼니 스타일) */}
      {/* ============================================= */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/60 z-10" /> {/* Overlay */}
          <iframe
            ref={videoRef}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[177.78vh] min-w-full min-h-[56.25vw] h-screen"
            src={`https://www.youtube.com/embed/${heroVideoId}?autoplay=1&mute=1&loop=1&playlist=${heroVideoId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`}
            title="Background Video"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-20 max-w-5xl mx-auto px-6 text-center">
          <span className="inline-block px-4 py-2 bg-orange-500/20 backdrop-blur-sm text-orange-300 rounded-full text-sm font-bold mb-6 border border-orange-500/30 animate-pulse" data-aos="fade-down">
            🔥 현재 300개 프랜차이즈 지점 마케팅 진행 중
          </span>
          
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black leading-tight mb-6 text-white" data-aos="fade-up" data-aos-delay="100">
            <span className="text-gray-400">사장님, 장사하세요.</span><br />
            <span className="bg-linear-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              마케팅은 저희가 매듭짓겠습니다.
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-4">
            프랜차이즈도 <span className="font-bold text-white">지점별 성과가 다릅니다.</span><br />
            우리는 <span className="text-orange-400 font-bold">지역 1등 전환 구조</span>를 만듭니다.
          </p>
          
          <p className="text-gray-500 mb-10">
            국내에서 가장 투명한 자영업자 마케팅 회사
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="#contact-form"
              className="group px-10 py-5 bg-linear-to-r from-orange-500 to-red-500 text-white rounded-2xl text-xl font-bold hover:shadow-2xl hover:shadow-orange-500/40 transition-all flex items-center justify-center gap-3"
            >
              <Play className="h-6 w-6" />
              지금 바로 진단받기
              <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
          
          <p className="mt-6 text-sm text-gray-500">
            🔒 강압적 영업 없이, 가능/불가능 먼저 안내
          </p>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
          <ChevronDown className="h-10 w-10 text-white/50" />
        </div>
      </section>

      {/* ============================================= */}
      {/* 시장의 문제점 경고 (매듭컴퍼니 Pain Point - 업그레이드) */}
      {/* ============================================= */}
      <section className="py-24 px-6 bg-gray-950 text-white relative overflow-hidden">
        {/* Blurred News Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzMzMyIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] blur-[2px]" />
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          {/* Top Quoted Scam Messages */}
          <div className="text-center mb-8 space-y-2">
            <p className="text-gray-500 text-sm">"네이버 공식 대행사 입니다..."</p>
            <p className="text-gray-500 text-sm">"정부 지원사업에 선정되셔서 연락드렸어요..."</p>
          </div>

          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl md:text-5xl font-black mb-4">
              어디 하나 <span className="text-blue-400">믿을 곳 없는</span> 마케팅 시장
            </h2>
            <p className="text-gray-400 text-lg">매듭컴퍼니는 소통을 가장 중요하게 생각합니다</p>
          </div>

          {/* Blurred News Image Area */}
          <div className="relative mb-8 rounded-2xl overflow-hidden">
            <div className="bg-gray-800/50 backdrop-blur-md p-8 flex items-center justify-center min-h-[200px]">
              <div className="text-center opacity-60 blur-[1px]">
                <p className="text-xl font-bold text-gray-400">📰 뉴스 기사 영역</p>
                <p className="text-sm text-gray-500">(실제 사기 피해 기사 이미지로 교체 예정)</p>
              </div>
            </div>
          </div>

          {/* News Headline Cards */}
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

          {/* Warning Cards Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {[
              { text: '"저희는 네이버 공식 대행사입니다"', warn: '네이버 공식 대행사는 존재하지 않습니다.' },
              { text: '"정부 지원 사업으로 50% 무료입니다"', warn: '정부 마케팅 지원금 사기입니다.' },
              { text: '"지금 계약하시면 50% 할인입니다"', warn: '조급함을 유도하는 전형적인 수법입니다.' },
              { text: '"월 5만원으로 1등 할 수 있습니다"', warn: '비현실적인 가격은 결과도 비현실적입니다.' },
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-red-500/30 transition-colors group" data-aos="fade-up" data-aos-delay={i * 100}>
                <p className="text-lg font-bold text-white mb-2 flex items-start gap-3">
                  <ShieldAlert className="h-5 w-5 text-red-400 shrink-0 mt-1" />
                  {item.text}
                </p>
                <p className="text-sm text-gray-500 ml-8">→ {item.warn}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <a 
              href="#contact-form"
              className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full text-lg font-bold transition-all shadow-lg shadow-emerald-500/30"
            >
              매듭지으러 가기(상담문의)
              <ArrowRight className="h-5 w-5" />
            </a>
          </div>
        </div>
      </section>

      {/* ============================================= */}
      {/* 투명성 업무 프로세스 시각화 (매듭컴퍼니 스타일) */}
      {/* ============================================= */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-orange-500 font-bold text-sm tracking-wider mb-2 block">TRANSPARENCY</span>
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              모든 진행 과정을 <span className="text-orange-500">투명하게</span> 공개합니다
            </h2>
            <p className="text-gray-600">우리는 "일하고 있습니다"가 아니라, "이렇게 진행 중입니다"를 보여드립니다.</p>
          </div>

          {/* Fake Dashboard Preview */}
          <div className="relative rounded-3xl overflow-hidden border border-gray-200 shadow-2xl bg-gray-50">
            {/* Dashboard Header */}
            <div className="bg-gray-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <div className="h-3 w-3 rounded-full bg-green-500" />
              </div>
              <span className="text-sm font-medium text-gray-400">FAN4 Marketing Dashboard</span>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Clock className="h-4 w-4" />
                실시간 업데이트
              </div>
            </div>
            
            {/* Dashboard Content */}
            <div className="p-6 grid md:grid-cols-3 gap-4">
              {/* Task List */}
              <div className="md:col-span-2 space-y-3">
                {[
                  { status: 'done', task: '네이버 플레이스 사진 최적화', date: '12/23' },
                  { status: 'done', task: '키워드 분석 및 설정 완료', date: '12/22' },
                  { status: 'progress', task: '블로그 포스팅 3건 작성 중', date: '12/24' },
                  { status: 'pending', task: '리뷰 관리 시스템 적용 예정', date: '12/26' },
                ].map((item, i) => (
                  <div key={i} className={`flex items-center gap-4 p-4 rounded-xl border ${
                    item.status === 'done' ? 'bg-green-50 border-green-200' :
                    item.status === 'progress' ? 'bg-orange-50 border-orange-200' :
                    'bg-gray-50 border-gray-200'
                  }`}>
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      item.status === 'done' ? 'bg-green-500 text-white' :
                      item.status === 'progress' ? 'bg-orange-500 text-white' :
                      'bg-gray-300 text-gray-600'
                    }`}>
                      {item.status === 'done' ? <CheckCircle className="h-4 w-4" /> :
                       item.status === 'progress' ? <Clock className="h-4 w-4" /> :
                       <Calendar className="h-4 w-4" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900">{item.task}</p>
                    </div>
                    <span className="text-sm text-gray-500">{item.date}</span>
                  </div>
                ))}
              </div>
              
              {/* Stats Sidebar */}
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-orange-500 text-white">
                  <p className="text-xs font-bold uppercase opacity-70">이번 주 완료</p>
                  <p className="text-4xl font-black">12건</p>
                </div>
                <div className="p-4 rounded-xl bg-gray-900 text-white">
                  <p className="text-xs font-bold uppercase opacity-70">전환율 개선</p>
                  <p className="text-4xl font-black text-green-400">+32%</p>
                </div>
                <div className="p-4 rounded-xl border border-gray-200">
                  <p className="text-xs font-bold uppercase text-gray-500">다음 리포트</p>
                  <p className="text-xl font-black text-gray-900">3일 후</p>
                </div>
              </div>
            </div>
          </div>

          <p className="text-center text-gray-500 mt-8 text-sm">
            * 고객 전용 대시보드를 통해 모든 작업 현황을 실시간으로 확인하실 수 있습니다.
          </p>
        </div>
      </section>

      {/* Section 2: 프랜차이즈도 꼭 해야 하는 이유 */}
      <section className="py-20 px-6 bg-gray-50">
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
              <div key={i} className="text-center p-8 rounded-3xl bg-white hover:bg-orange-50 transition-colors group shadow-lg border border-gray-100">
                <div className="h-16 w-16 mx-auto rounded-2xl bg-orange-100 shadow-lg flex items-center justify-center mb-6 group-hover:bg-orange-500 transition-all">
                  <item.icon className="h-8 w-8 text-orange-500 group-hover:text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center p-8 rounded-3xl bg-linear-to-r from-orange-500 to-red-500 text-white shadow-xl">
            <p className="text-xl md:text-2xl font-bold">
              그래서 지점 성과는 결국<br />
              <span className="text-3xl md:text-4xl">노출 → 확신 → 전화/길찾기/예약</span>에서 갈립니다.
            </p>
          </div>
        </div>
      </section>

      {/* Section 4: 전문가 신뢰 섹션 */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-orange-500 font-bold text-sm tracking-wider mb-2 block">WHY FAN4</span>
            <h2 className="text-3xl md:text-4xl font-black">
              진짜 전문가에게 맡기세요.
            </h2>
          </div>

          {/* Stats Grid - 매듭컴퍼니 스타일 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { num: '15+', label: '자영업 경력 (년)' },
              { num: '300+', label: '마케팅 진행 지점' },
              { num: '92%', label: '재계약율' },
              { num: '30억', label: '연매출 매장 운영' },
            ].map((stat, i) => (
              <div key={i} className="text-center p-6 rounded-2xl bg-gray-50 border border-gray-100">
                <p className="text-4xl md:text-5xl font-black text-orange-500 mb-2">{stat.num}</p>
                <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
              </div>
            ))}
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
                        <span className="text-white font-black text-2xl">FAN4</span>
                    </div>
                </div>
             </div>

             {/* 4 Steps - Positioned Absolute */}
             <div className="absolute top-0 left-0 md:top-4 md:left-4 max-w-[160px] text-center md:text-right">
                 <div className="text-5xl md:text-6xl font-black text-gray-100 mb-2 absolute -z-10 -top-4 -right-4 md:relative md:text-gray-100/50">01</div>
                 <h3 className="text-xl font-bold mb-1 text-gray-900">진단</h3>
                 <p className="text-sm text-gray-500">현재 상태를<br/>객관적으로 분석</p>
             </div>

             <div className="absolute top-0 right-0 md:top-4 md:right-4 max-w-[160px] text-center md:text-left">
                 <div className="text-5xl md:text-6xl font-black text-gray-100 mb-2 absolute -z-10 -top-4 -left-4 md:relative md:text-gray-100/50">02</div>
                 <h3 className="text-xl font-bold mb-1 text-gray-900">설계</h3>
                 <p className="text-sm text-gray-500">지점 맞춤형<br/>전략 수립</p>
             </div>

             <div className="absolute bottom-0 left-0 md:bottom-4 md:left-4 max-w-[160px] text-center md:text-right">
                 <div className="text-5xl md:text-6xl font-black text-gray-100 mb-2 absolute -z-10 -top-4 -right-4 md:relative md:text-gray-100/50">03</div>
                 <h3 className="text-xl font-bold mb-1 text-gray-900">실행</h3>
                 <p className="text-sm text-gray-500">고민 없이<br/>즉시 적용</p>
             </div>

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
      {/* REAL REVIEW - 고객 후기 캐러셀 */}
      {/* ============================================= */}
      <section className="py-24 px-6 bg-gray-900 text-white overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 bg-teal-500/20 text-teal-400 rounded-full text-sm font-bold mb-6 border border-teal-500/30">
              REAL REVIEW
            </span>
            <h2 className="text-3xl md:text-4xl font-black">
              실제 <span className="text-teal-400">사장님들</span>의 이야기
            </h2>
          </div>

          {/* Review Carousel */}
          <div className="relative">
            {/* Review Cards Grid */}
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { 
                  name: '이영진 대표님', 
                  business: '피드백과 자영업 맞춤 케어',
                  quote: '피드백과 자영업 맞춤 케어 해주셔서 도 매듭과 함께할 생각입니다',
                  rating: 5
                },
                { 
                  name: '김사장님', 
                  business: '음식점 마케팅',
                  quote: '대표님! 저도 매달 신경쓰라 할수록 방문 고객이 늘었어요. 기분도 좋습니다',
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
                  {/* Card */}
                  <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-teal-500/50 transition-all">
                    {/* Brand Badge */}
                    <span className="inline-block px-3 py-1 bg-teal-500 text-white text-xs font-bold rounded mb-4">
                      FAN4
                    </span>
                    
                    {/* Quote */}
                    <p className="text-gray-300 leading-relaxed mb-4">
                      "{review.quote}"
                    </p>
                    
                    {/* Rating */}
                    <div className="flex gap-1 mb-4">
                      {[...Array(review.rating)].map((_, j) => (
                        <Star key={j} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    
                    {/* Customer Info */}
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-teal-500/20 flex items-center justify-center">
                        <Users className="h-5 w-5 text-teal-400" />
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

            {/* Video Play Button (Centered Overlay - Optional) */}
            <div className="mt-8 text-center">
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-full text-white font-medium transition-all">
                <Play className="h-5 w-5" />
                영상 후기 보기
              </button>
            </div>
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
              Fan4 Marketing과 함께한<br />
              수 많은 사장님들과의 <span className="text-blue-500">소통</span>
            </h2>
            <p className="text-gray-600">Fan4 Marketing은 소통을 가장 중요하게 생각합니다</p>
          </div>

          {/* Infinite Scroll Chat Gallery */}
          <div className="relative h-[500px] overflow-hidden rounded-2xl">
            {/* Top Fade */}
            <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-gray-50 to-transparent z-10 pointer-events-none" />
            {/* Bottom Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-50 to-transparent z-10 pointer-events-none" />

            {/* Scrolling Columns */}
            <div className="flex gap-4 h-full">
              {/* Column 1 - Slow */}
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
                          <div className="h-8 w-8 rounded-full bg-yellow-400 flex items-center justify-center text-sm">
                            😊
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-800">{msg}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Column 2 - Medium */}
              <div className="flex-1 flex flex-col gap-4 animate-[scrollUp_20s_linear_infinite]">
                {[...Array(2)].map((_, setIdx) => (
                  <div key={setIdx} className="flex flex-col gap-4">
                    {[
                      '저희 가게 지역에서 1등이 됐어요!',
                      '손님들이 네이버 보고 왔다고 해요 😄',
                      '전화 문의가 확실히 늘었어요',
                      '투명하게 진행해주셔서 믿음이 갑니다',
                      '다음 달도 계속 진행할게요!',
                    ].map((msg, i) => (
                      <div key={`${setIdx}-${i}`} className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
                        <div className="flex items-start gap-3">
                          <div className="h-8 w-8 rounded-full bg-green-400 flex items-center justify-center text-sm">
                            🎉
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-800">{msg}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Column 3 - Fast */}
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
                          <div className="h-8 w-8 rounded-full bg-blue-400 flex items-center justify-center text-sm">
                            💙
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-800">{msg}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Column 4 - Slowest */}
              <div className="hidden md:flex flex-1 flex-col gap-4 animate-[scrollUp_28s_linear_infinite]">
                {[...Array(2)].map((_, setIdx) => (
                  <div key={setIdx} className="flex flex-col gap-4">
                    {[
                      '솔직하게 말씀해주셔서 좋았어요',
                      '다른 업체랑 달라요!',
                      '결과가 눈에 보이니까 좋네요',
                      '사장님들 필수입니다 ㅎㅎ',
                      '만족합니다 👍👍',
                    ].map((msg, i) => (
                      <div key={`${setIdx}-${i}`} className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
                        <div className="flex items-start gap-3">
                          <div className="h-8 w-8 rounded-full bg-purple-400 flex items-center justify-center text-sm">
                            💜
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-800">{msg}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <a 
              href="#contact-form"
              className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full text-lg font-bold transition-all shadow-lg shadow-emerald-500/30"
            >
              매듭지으러 가기(상담문의)
              <ArrowRight className="h-5 w-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 bg-black text-gray-500 text-center text-sm">
        <p className="text-xl font-black text-gray-600 mb-4">FAN4 MARKETING</p>
        <p>© 2024 Fan4 Marketing. All rights reserved.</p>
        <p className="mt-2">우리는 '대행'이 아니라 매출 실험을 설계합니다.</p>
      </footer>
    </div>
  );
}
