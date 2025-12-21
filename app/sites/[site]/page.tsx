import { getCreator } from "@/lib/data";
import { getLiveNews } from "@/lib/news";
import { notFound } from "next/navigation";
import {
  Heart,
  MessageCircle,
  Share2,
  Star,
  Users,
  Newspaper,
  ExternalLink,
  CheckCircle2,
  Code2,
  Rocket,
  Palette,
  ArrowRight,
  Monitor,
} from "lucide-react";
import Link from "next/link";
import InquiryForm from "./inquiry-form";
import FAQSection from "./faq-section";
import HeaderActions from "./header-actions";

export default async function SitePage({
  params,
}: {
  params: Promise<{ site: string }>;
}) {
  const { site } = await params;
  const creator = getCreator(site);

  if (!creator) {
    notFound();
  }

  // If it's kkang, show the Agency Landing Page
  if (site === "kkang") {
    return (
      <div className="min-h-screen bg-[#0A0A0B] text-white selection:bg-purple-500 selection:text-white font-sans">
        {/* Modern Glassy Header */}
        <header className="fixed top-0 z-50 w-full border-b border-white/5 bg-black/50 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-linear-to-br from-purple-500 to-blue-500 p-1.5">
                <Code2 className="h-full w-full text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                깡대표 x 디어스
              </span>
            </div>
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
              <a href="#about" className="hover:text-white transition-colors">
                서비스 소개
              </a>
              <a href="#pricing" className="hover:text-white transition-colors">
                요금제
              </a>
              <a
                href="#references"
                className="hover:text-white transition-colors"
              >
                레퍼런스
              </a>
            </nav>
            <div className="flex items-center gap-4">
              <HeaderActions site={site} />
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative overflow-hidden pt-32 pb-20 md:pt-48 md:pb-32">
          {/* Animated Background Orbs */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10">
            <div className="absolute top-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-purple-600/20 blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-blue-600/20 blur-[120px] animate-pulse" />
          </div>

          <div className="mx-auto max-w-7xl px-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-xl font-semibold text-purple-400 backdrop-blur-md mb-8">
              <Rocket className="h-4 w-3.5" />
              <span>1인 마케팅 대행사를 위한 가장 완벽한 시작</span>
            </div>
            <h1 className="mx-auto max-w-4xl text-5xl font-black leading-[1.1] tracking-tight md:text-8xl">
              빠르게 사업을 시작하는 <br />
              <span className="bg-linear-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                프리미엄 랜딩페이지
              </span>
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-lg text-gray-400 md:text-xl">
              디자인부터 세팅까지 올인원. 전문 개발팀과 깡대표가 협업하여{" "}
              <br className="hidden md:block" />
              여러분의 비즈니스를 가장 프로페셔널하게 완성해드립니다.
            </p>
            <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="#contact"
                className="group relative flex h-14 items-center justify-center gap-2 rounded-2xl bg-purple-500 px-10 font-bold transition-all hover:bg-purple-600 hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] active:scale-95"
              >
                지금 프로젝트 시작하기
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#pricing"
                className="flex h-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-10 font-bold backdrop-blur-md transition-all hover:bg-white/10 active:scale-95"
              >
                요금제 확인하기
              </a>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section id="about" className="py-20 bg-black/40">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="group rounded-3xl border border-white/5 bg-white/[0.02] p-8 transition-all hover:border-purple-500/30 hover:bg-white/[0.05]">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-500 group-hover:scale-110 transition-transform">
                  <Palette className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">하이엔드 디자인</h3>
                <p className="text-gray-400 leading-relaxed">
                  MZ마케팅 레퍼런스 이상의 세련되고 트렌디한 디자인으로 브랜드
                  신뢰도를 즉각적으로 높여드립니다.
                </p>
              </div>
              <div className="group rounded-3xl border border-white/5 bg-white/2 p-8 transition-all hover:border-blue-500/30 hover:bg-white/5">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500 group-hover:scale-110 transition-transform">
                  <Monitor className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">DB 자동 수집 시스템</h3>
                <p className="text-gray-400 leading-relaxed">
                  유입된 고객의 정보를 놓치지 않고 관리할 수 있는 맞춤형 DB 수집
                  폼과 알림톡 연동을 지원합니다.
                </p>
              </div>
              <div className="group rounded-3xl border border-white/5 bg-white/[0.02] p-8 transition-all hover:border-purple-500/30 hover:bg-white/[0.05]">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-500 group-hover:scale-110 transition-transform">
                  <Star className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">구독형 유지보수</h3>
                <p className="text-gray-400 leading-relaxed">
                  초기 제작비 부담을 낮추고, 전문가의 지속적인 터치를 받을 수
                  있는 합리적인 구독형 서비스를 제공합니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-24 relative overflow-hidden">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black md:text-5xl">
                합리적인 비용으로 비즈니스를 가속하세요
              </h2>
              <p className="mt-4 text-gray-400">
                초기 세팅비와 월 관리비로 구성된 투명한 가격 정책
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {/* Basic */}
              <div className="rounded-3xl border border-white/5 bg-white/[0.02] p-8 flex flex-col transition-all hover:bg-white/[0.04]">
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-400 mb-2">
                    BASIC
                  </h3>
                  <div className="flex items-baseline gap-2">
                    초기 세팅비
                    <span className="text-lg text-gray-500 line-through decoration-red-500/50 decoration-2">
                      50
                    </span>
                    <span className="text-4xl font-black">30</span>
                    <span className="text-lg text-gray-500">만원</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    매월 유지관리비 2만원
                  </p>
                </div>
                <ul className="space-y-4 flex-1">
                  {[
                    "타사 랜딩 페이지 수준 베이직 디자인",
                    "기본형 DB 수집 폼",
                    "반응형 웹 지원 (PC/모바일)",
                    "도메인 연결 대행",
                    "보안 서버(SSL) 적용",
                    "직접 이미지/문구 수정 가능",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-sm text-gray-300"
                    >
                      <CheckCircle2 className="h-4 w-4 text-purple-500" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/sites/kkang/checkout?plan=basic"
                  className="mt-8 block w-full rounded-2xl border border-white/10 bg-white/5 py-4 text-center text-sm font-bold transition-all hover:bg-white/10"
                >
                  지금 시작하기
                </Link>
              </div>

              {/* Pro */}
              <div className="relative rounded-3xl border border-purple-500/50 bg-purple-500/5 p-8 flex flex-col shadow-[0_0_40px_rgba(139,92,246,0.2)] md:scale-110 z-10">
                <div className="absolute top-0 right-8 -translate-y-1/2 rounded-full bg-purple-500 px-4 py-1 text-xs font-bold text-white">
                  BEST CHOICE
                </div>
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-purple-400 mb-2">
                    PRO
                  </h3>
                  <div className="flex items-baseline gap-2">
                    초기 세팅비
                    <span className="text-lg text-purple-300/60 line-through decoration-white/50 decoration-2">
                      70
                    </span>
                    <span className="text-5xl font-black text-white">50</span>
                    <span className="text-lg text-gray-400 font-bold">
                      만원
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-purple-300">
                    매월 유지관리비 3만원
                  </p>
                </div>
                <ul className="space-y-4 flex-1">
                  {[
                    "프리미엄 랜딩페이지 디자인",
                    "고급형 DB 모집 섹션",
                    "마케팅 효율 최적화 레이아웃",
                    "카카오톡 알림톡 연동",
                    "검색 엔진 최적화(SEO) 기본 세팅",
                    "월 2회 콘텐츠 수정 / 업데이트 지원",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-sm text-white"
                    >
                      <CheckCircle2 className="h-4 w-4 text-purple-500" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/sites/kkang/checkout?plan=pro"
                  className="mt-8 block w-full rounded-2xl bg-purple-500 py-4 text-center text-sm font-bold transition-all hover:bg-purple-600 shadow-lg"
                >
                  가장 많이 선택하는 플랜<br>지금 시작하기</br>
                </Link>
              </div>

              {/* Master */}
              <div className="rounded-3xl border border-white/5 bg-white/[0.02] p-8 flex flex-col transition-all hover:bg-white/[0.04]">
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-400 mb-2">
                    MASTER
                  </h3>
                  <div className="flex items-baseline gap-2">
                    초기 세팅비
                    <span className="text-lg text-gray-500 line-through decoration-red-500/50 decoration-2">
                      100
                    </span>
                    <span className="text-4xl font-black">70</span>
                    <span className="text-lg text-gray-500">만원 ~</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    매월 유지관리비 5만원
                  </p>
                </div>
                <ul className="space-y-4 flex-1">
                  {[
                    "풀 커스텀 하이엔드 디자인",
                    "마케팅 자동화 도구 연동",
                    "AI 채팅봇 기본 세팅",
                    "고객 관리 마스터 대시보드",
                    "정기 데이터 분석 리포트",
                    "우선 순위 기술 지원",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-sm text-gray-300"
                    >
                      <CheckCircle2 className="h-4 w-4 text-purple-500" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/sites/kkang/checkout?plan=master"
                  className="mt-8 block w-full rounded-2xl border border-white/10 bg-white/5 py-4 text-center text-sm font-bold transition-all hover:bg-white/10"
                >
                  지금 시작하기
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* References
        <section id="references" className="py-20 bg-white/1">
          <div className="mx-auto max-w-7xl px-6 text-center">
            <h2 className="text-3xl font-bold mb-12">검증된 레퍼런스</h2>
            <div className="flex flex-wrap justify-center gap-8 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
              <div className="flex flex-col items-center gap-2 group cursor-pointer">
                <div className="h-16 w-32 bg-white/10 rounded-xl flex items-center justify-center font-bold text-white group-hover:bg-purple-500/20 transition-colors">
                  MZ마케팅
                </div>
              </div>
              <div className="flex flex-col items-center gap-2 group cursor-pointer">
                <div className="h-16 w-32 bg-white/10 rounded-xl flex items-center justify-center font-bold text-white group-hover:bg-purple-500/20 transition-colors">
                  ART HYUN
                </div>
              </div>
              <div className="flex flex-col items-center gap-2 group cursor-pointer">
                <div className="h-16 w-32 bg-white/10 rounded-xl flex items-center justify-center font-bold text-white group-hover:bg-purple-500/20 transition-colors">
                  VENTUTION
                </div>
              </div>
            </div>
            <p className="mt-12 text-gray-500 text-sm">
              실제 결과로 증명하는 깡대표 x 개발자들(디어스) 프로젝트 연합
            </p>
          </div>
        </section> */}

        {/* FAQ Section */}
        <FAQSection />

        {/* Inquiry Form Section */}
        <section id="contact" className="py-24 relative">
          <div className="mx-auto max-w-3xl px-6">
            <div className="rounded-[40px] border border-white/5 bg-linear-to-b from-white/5 to-transparent p-8 md:p-16 backdrop-blur-xl">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold md:text-5xl">
                  함께 비즈니스를 <br />
                  시작해볼까요?
                </h2>
                <p className="mt-4 text-gray-400">
                  간단한 정보만 남겨주시면 전문가가 직접 연락드립니다.
                </p>
              </div>
              <InquiryForm influencerId="inf-1" />
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/5 py-20 px-6">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-wrap justify-between gap-12">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-6 w-6 rounded bg-purple-500 flex items-center justify-center">
                    <Code2 className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-bold tracking-tight">
                    깡대표 x 디어스
                  </span>
                </div>
                <p className="text-sm text-gray-500 max-w-xs">
                  1인 마케팅 대행사의 디지털 성장을 돕는 <br /> No.1 홈페이지
                  솔루션 파트너입니다.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-12 sm:grid-cols-3">
                <div className="space-y-4">
                  <h4 className="text-sm font-bold">Service</h4>
                  <ul className="space-y-2 text-sm text-gray-500">
                    <li>
                      <a href="#" className="hover:text-white">
                        Homepages
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-white">
                        Marketing DB
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-white">
                        AI Automation
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="text-sm font-bold">Contact</h4>
                  <ul className="space-y-2 text-sm text-gray-500">
                    <li>kkang@faneasy.kr</li>
                    <li>010-XXXX-XXXX</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="mt-20 border-t border-white/5 pt-8 text-center text-xs text-gray-600">
              © 2025 FanEasy Inc. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    );
  }


  // Custom Design for 'fan1' (MZ Marketing Reference)
  if (site === "fan1") {
    return (
      <div className="min-h-screen bg-black text-white font-sans selection:bg-[#FFE400] selection:text-black">
        {/* Simple Header */}
        <header className="fixed top-0 z-50 w-full bg-black/80 backdrop-blur-md border-b border-white/10">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
            <h1 className="text-xl font-black tracking-tighter italic">
              MZ<span className="text-[#FFE400]">MARKETING</span>
            </h1>
            <nav className="hidden md:flex gap-6 text-sm font-bold text-gray-400">
              <a href="#services" className="hover:text-white transition-colors">SERVICES</a>
              <a href="#solutions" className="hover:text-white transition-colors">SOLUTIONS</a>
              <a href="#contact" className="hover:text-white transition-colors">CONTACT</a>
            </nav>
            <HeaderActions site={site} />
          </div>
        </header>

        {/* Hero Section */}
        <section className="pt-32 pb-20 px-6">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-[12vw] leading-[0.9] font-black text-white mix-blend-difference mb-12">
              MZ MARKETING <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-[#FFE400] to-orange-500">
                SERVICE
              </span>
            </h2>
            <p className="max-w-xl text-xl text-gray-400 font-light border-l-2 border-[#FFE400] pl-6 ml-2">
              가장 젊고 감각적인 마케팅 솔루션. <br />
              귀사의 비즈니스를 MZ세대와 연결해드립니다.
            </p>
          </div>
        </section>

        {/* Marketing Media Section */}
        <section id="services" className="py-20 border-t border-white/10 px-6">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col md:flex-row gap-12">
              <div className="md:w-1/3">
                <h3 className="text-3xl font-bold sticky top-24">
                  진행가능한 <br />
                  <span className="text-[#FFE400]">마케팅 매체</span>
                </h3>
              </div>
              <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "키워드광고", "배너광고", "SNS광고", "바이럴광고",
                  "인플루언서 공동구매", "인플루언서 마케팅", "라이브커머스",
                  "CRM마케팅", "영상광고", "오픈마켓광고"
                ].map((item, i) => (
                  <div key={i} className="group flex items-center justify-between p-6 border border-white/10 bg-white/5 hover:bg-[#FFE400] hover:text-black transition-all duration-300 cursor-default">
                    <span className="font-bold text-lg">{item}</span>
                    <ArrowRight className="opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-2" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Solutions Section */}
        <section id="solutions" className="py-20 border-t border-white/10 px-6 bg-white/5">
          <div className="mx-auto max-w-7xl">
             <div className="flex flex-col md:flex-row gap-12">
              <div className="md:w-1/3 order-1 md:order-2">
                <h3 className="text-3xl font-bold sticky top-24 text-right md:text-left">
                  온라인 <br />
                  <span className="text-blue-500">마케팅 솔루션</span>
                </h3>
              </div>
              <div className="md:w-2/3 order-2 md:order-1 grid grid-cols-1 gap-4">
                {[
                  "구글 애널리틱스 (GA4) 세팅 및 분석",
                  "구글 태그매니저 (GTM) 설치",
                  "자사/경쟁사 광고 문제점 정밀 분석",
                  "웹사이트 UX/UI 사용자 경험 분석",
                  "상세페이지 셀링포인트 도출",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-6 border-l-4 border-blue-500 bg-black/20 hover:pl-8 transition-all">
                    <CheckCircle2 className="text-blue-500 h-6 w-6 shrink-0" />
                    <span className="font-bold text-lg">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Promo Banner */}
        <section className="py-12 bg-[#FFE400] text-black overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
          <div className="mx-auto max-w-7xl px-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div>
              <h4 className="text-3xl font-black mb-2">LIMITED EVENT</h4>
              <p className="font-bold text-lg opacity-80">신규 고객 전용 50% 할인 이벤트가 진행중입니다.</p>
            </div>
            <div className="bg-black text-[#FFE400] px-8 py-4 rounded-full font-bold text-xl animate-pulse">
              D-3 종료임박
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-24 px-6 relative">
             <div className="mx-auto max-w-3xl">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4">프로젝트 문의하기</h2>
                    <p className="text-gray-400">성공적인 마케팅, 지금 바로 시작하세요.</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-8 md:p-12 rounded-3xl backdrop-blur-sm">
                    <InquiryForm influencerId="inf-1" />
                </div>
             </div>
        </section>

        {/* Footer */}
        <footer className="py-12 text-center text-xs text-gray-600 border-t border-white/10 bg-black">
          <p className="font-bold text-gray-500 mb-2">MZ MARKETING</p>
          <p>Copyright ⓒ 2025 MZ Marketing. All rights reserved.</p>
        </footer>
      </div>
    );
  }
 
  // Fetch Live News (Legacy/Generic)
  const news = await getLiveNews(creator.name);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      {/* Hero Section */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/50 to-black z-10" />
        <img
          src={creator.image}
          alt={creator.name}
          className="h-full w-full object-cover opacity-80 scale-105 animate-slow-zoom"
        />

        <div className="absolute bottom-0 left-0 z-20 w-full p-8 md:p-12">
          <div className="mx-auto max-w-4xl space-y-4">
            <span className="inline-block rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-md">
              {creator.name}의 공식 팬페이지
            </span>
            <h1 className="text-5xl font-bold tracking-tight md:text-7xl">
              {creator.name}의 팬페이지
            </h1>
            <p className="max-w-xl text-lg text-gray-300 md:text-xl">
              {creator.bio}
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <button
                className={`group flex items-center gap-2 rounded-full px-8 py-3 font-semibold transition-all hover:scale-105 active:scale-95 bg-white text-black`}
              >
                <Heart className="h-5 w-5 fill-current text-red-500" />
                <span>Join Fandom</span>
              </button>
              <button className="flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-8 py-3 font-semibold backdrop-blur-md transition-all hover:bg-white/10">
                <Share2 className="h-5 w-5" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="border-y border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl justify-around py-6 text-center">
          <div>
            <div className="flex items-center justify-center gap-2 text-2xl font-bold">
              <Users className="h-6 w-6 text-gray-400" />
              {creator.stats.fans}
            </div>
            <div className="text-xs uppercase tracking-widest text-gray-400">
              Fans
            </div>
          </div>
          <div>
            <div className="flex items-center justify-center gap-2 text-2xl font-bold">
              <Star className="h-6 w-6 text-yellow-500" />
              Top 1%
            </div>
            <div className="text-xs uppercase tracking-widest text-gray-400">
              Ranking
            </div>
          </div>
          <div>
            <div className="flex items-center justify-center gap-2 text-2xl font-bold">
              <MessageCircle className="h-6 w-6 text-gray-400" />
              {creator.stats.posts}
            </div>
            <div className="text-xs uppercase tracking-widest text-gray-400">
              Posts
            </div>
          </div>
        </div>
      </div>

      {/* Live News Section */}
      <div className="mx-auto max-w-4xl px-4 py-20">
        <div className="mb-8 flex items-center gap-2">
          <Newspaper className="h-6 w-6 text-purple-400" />
          <h2 className="text-2xl font-bold">Live News</h2>
        </div>

        <div className="grid gap-4">
          {news.length > 0 ? (
            news.map((item, i) => (
              <a
                key={i}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-6 transition-all hover:bg-white/10 hover:border-purple-500/30"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold leading-tight group-hover:text-purple-400">
                      {item.title}
                    </h3>
                    <div className="mt-2 flex items-center gap-3 text-sm text-gray-400">
                      <span>{item.source}</span>
                      <span className="h-1 w-1 rounded-full bg-gray-600" />
                      <span>{item.pubDate}</span>
                    </div>
                  </div>
                  <ExternalLink className="h-5 w-5 shrink-0 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </a>
            ))
          ) : (
            <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center text-gray-400">
              No recent news found.
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 text-center text-sm text-gray-500">
        <p>
          Powered by <span className="font-bold text-white">FanEasy</span>
        </p>
        <p>The #1 Fandom Monetization Solution</p>
      </footer>
    </div>
  );
}
