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
  Cpu,
  Layers,
  Zap,
  BarChart3,
  ShieldCheck,
  Globe,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import InquiryForm from "./inquiry-form";
import FAQSection from "./faq-section";
import HeaderActions from "./header-actions";
import { EditableText, EditableContent } from "@/components/editable";
import TemplateShowcase from "@/components/template-showcase";
import { Spotlight } from "@/components/ui/spotlight";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import MobileBottomNav from "@/components/mobile-bottom-nav";
import { motion } from "framer-motion";

import type { Metadata, ResolvingMetadata } from 'next';

export async function generateMetadata(
  { params }: { params: Promise<{ site: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { site } = await params;
  const creator = getCreator(site);

  if (!creator) return {};

  const title = site === 'kkang' ? '깡대표 x 디어스 | 프리미엄 랜딩페이지' : `${creator.name} 공식 팬페이지`;
  const description = site === 'kkang' 
    ? '빠르게 사업을 시작하는 프리미엄 랜딩페이지' 
    : creator.bio;
  const ogImage = site === 'kkang' ? '/og-kkang.png' : creator.image;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [ogImage],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

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
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h1 className="mx-auto max-w-4xl text-5xl font-black leading-[1.1] tracking-tight md:text-8xl">
                빠르게 사업을 시작하는 <br />
                <span className="bg-linear-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  프리미엄 랜딩페이지
                </span>
              </h1>
            </motion.div>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="mx-auto mt-8 max-w-2xl text-lg text-gray-400 md:text-xl"
            >
              디자인부터 세팅까지 올인원. 전문 개발팀과 깡대표가 협업하여{" "}
              <br className="hidden md:block" />
              여러분의 비즈니스를 가장 프로페셔널하게 완성해드립니다.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
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
            </motion.div>
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
                  평범한 마케팅 레퍼런스 이상의 세련되고 트렌디한 디자인으로 브랜드
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
                  href="checkout?plan=basic"
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
                  href="checkout?plan=pro"
                  className="mt-8 block w-full rounded-2xl bg-purple-500 py-4 text-center text-sm font-bold transition-all hover:bg-purple-600 shadow-lg"
                >
                  가장 많이 선택하는 플랜<br />지금 시작하기
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
                  href="checkout?plan=master"
                  className="mt-8 block w-full rounded-2xl border border-white/10 bg-white/5 py-4 text-center text-sm font-bold transition-all hover:bg-white/10"
                >
                  지금 시작하기
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* References / Templates Section */}
        <TemplateShowcase />

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
                    <li>duscontactus@gmail.com</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="mt-20 border-t border-white/5 pt-8 text-center text-xs text-gray-600">
              © 2025 FanEasy Inc. All rights reserved.
            </div>
          </div>
        </footer>

        <MobileBottomNav site={site} />
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
              LIMITED<span className="text-[#FFE400]">MARKETING</span>
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
        <section className="pt-32 pb-20 px-6 relative overflow-hidden">
          <Spotlight
            className="-top-40 left-0 md:left-60 md:-top-20"
            fill="white"
          />
          <div className="mx-auto max-w-7xl relative z-10">
            <EditableText
              subdomain={site}
              field="heroTitle"
              as="h2"
              className="text-[10vw] leading-[0.9] font-black text-white mix-blend-difference mb-12 uppercase"
              defaultValue={
                <>
                  LIMITED MARKETING <br />
                  <span className="text-transparent bg-clip-text bg-linear-to-r from-[#FFE400] to-orange-500">
                    SOLUTION
                  </span>
                </>
              }
            />
            <EditableText
              subdomain={site}
              field="heroDescription"
              as="p"
              className="max-w-xl text-xl text-gray-400 font-light border-l-2 border-[#FFE400] pl-6 ml-2"
              defaultValue={
                <>
                  오직 소수의 클라이언트만을 위한 프리미엄 솔루션. <br />
                  귀사의 비즈니스를 확실한 성공으로 이끌어드립니다.
                </>
              }
            />
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

        {/* Solutions Section (Editable Body) */}
        <section id="solutions" className="py-20 border-t border-white/10 px-6 bg-white/5">
          <div className="mx-auto max-w-7xl">
             <EditableContent
                subdomain={site}
                defaultContent={
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
                }
             />
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
                    <InquiryForm influencerId="inf-1" variant="bold" />
                </div>
             </div>
        </section>

        {/* Footer */}
        <footer className="py-12 text-center text-xs text-gray-600 border-t border-white/10 bg-black">
          <p className="font-bold text-gray-500 mb-2">LIMITED MARKETING</p>
          <p>Copyright ⓒ 2025 Limited Marketing. All rights reserved.</p>
        </footer>
      </div>
    );
  }
 
  // Custom Design for 'fan2' (Growth Marketing - Bburi Theme)
  if (site === "fan2") {
    return (
      <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-green-100 selection:text-green-900">
        {/* Clean Professional Header */}
        <header className="fixed top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
          <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-green-600 rounded-tr-xl rounded-bl-xl flex items-center justify-center">
                 <span className="text-white font-bold text-lg">G</span>
              </div>
              <h1 className="text-xl font-bold tracking-tight text-gray-900">
                GROWTH<span className="text-green-600">MARKETING</span>
              </h1>
            </div>
            
            <nav className="hidden md:flex gap-8 text-sm font-semibold text-gray-500">
              <a href="#about" className="hover:text-green-600 transition-colors">ABOUT</a>
              <a href="#services" className="hover:text-green-600 transition-colors">SERVICES</a>
              <a href="#portfolio" className="hover:text-green-600 transition-colors">PORTFOLIO</a>
              <a href="#contact" className="hover:text-green-600 transition-colors">CONTACT</a>
            </nav>
            <HeaderActions site={site} />
          </div>
        </header>

        {/* Hero Section */}
        <section className="pt-32 pb-24 px-6 bg-slate-900 relative overflow-hidden">
          {/* Background Image Overlay */}
          <div className="absolute inset-0 z-0">
             <img 
               src="https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2670&auto=format&fit=crop" 
               alt="Background" 
               className="w-full h-full object-cover opacity-20"
             />
             <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent"></div>
          </div>

          <div className="mx-auto max-w-7xl relative z-10">
            <div className="max-w-3xl">
              <span className="inline-block px-3 py-1 bg-green-100/80 backdrop-blur text-green-700 rounded-full text-xs font-bold mb-6 tracking-wide border border-green-200">
                DATA-DRIVEN MARKETING AGENCY
              </span>
              <EditableText
                subdomain={site}
                field="heroTitle"
                as="h2"
                className="text-5xl md:text-7xl font-bold leading-tight text-gray-900 mb-8"
                defaultValue={
                  <>
                    데이터로 증명하는 <br />
                    <span className="text-green-600 relative inline-block">
                       확실한 성장의 파트너
                       <svg className="absolute -bottom-2 left-0 w-full h-3 text-green-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                         <path d="M0 5 Q 50 10 100 5 L 100 0 Q 50 5 0 0 Z" fill="currentColor"/>
                       </svg>
                    </span>
                  </>
                }
              />
              <EditableText
                subdomain={site}
                field="heroDescription"
                as="p"
                className="text-xl text-gray-600 leading-relaxed max-w-2xl border-l-4 border-green-500 pl-6"
                defaultValue={
                    "단순한 노출이 아닌, 실제 매출 성장으로 이어지는 퍼포먼스 마케팅."
                }
              />
              
              <div className="mt-10 flex gap-4">
                 <a href="#contact" className="px-8 py-4 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 transition-all shadow-lg shadow-gray-200">
                   무료 진단 신청하기
                 </a>
                 <a href="#services" className="px-8 py-4 bg-white border border-gray-200 text-gray-700 font-bold rounded-lg hover:border-gray-400 transition-all">
                   서비스 소개
                 </a>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Grid */}
        <section className="py-12 bg-white border-b border-gray-100">
           <div className="mx-auto max-w-7xl px-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
                 {[
                    { label: "누적 집행액", value: "300억+" },
                    { label: "마케팅 프로젝트", value: "1,500+" },
                    { label: "평균 ROAS", value: "450%" },
                    { label: "클라이언트 유지율", value: "92%" }
                 ].map((stat, i) => (
                    <div key={i} className="text-center md:text-left">
                       <div className="text-3xl lg:text-4xl font-black text-gray-900 mb-2">{stat.value}</div>
                       <div className="text-sm font-bold text-gray-500 uppercase tracking-widest">{stat.label}</div>
                    </div>
                 ))}
              </div>

              <div className="mt-12">
                 <h4 className="text-center text-sm font-bold text-gray-400 mb-8 uppercase tracking-widest">Trusted by Industry Leaders</h4>
                 <div className="h-[20rem] rounded-md flex flex-col antialiased bg-white dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
                    <InfiniteMovingCards
                        items={[
                          { quote: "매출이 300% 성장했습니다. 놀라운 성과입니다.", name: "김대표", title: "스타트업 CEO" },
                          { quote: "가장 신뢰할 수 있는 파트너입니다.", name: "이이사", title: "마케팅 총괄" },
                          { quote: "데이터 기반의 분석이 탁월합니다.", name: "박팀장", title: "브랜드 매니저" },
                          { quote: "ROAS 효율이 획기적으로 개선되었습니다.", name: "최대표", title: "쇼핑몰 운영" },
                          { quote: "투명한 리포팅 덕분에 안심하고 맡깁니다.", name: "정대표", title: "프랜차이즈 본사" },
                        ]}
                        direction="right"
                        speed="slow"
                    />
                 </div>
              </div>
           </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-24 px-6 bg-white">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-16 max-w-2xl mx-auto">
               <h3 className="text-green-600 font-bold tracking-widest text-sm mb-3">OUR SERVICES</h3>
               <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">성공을 위한 프로세스</h2>
               <p className="mt-4 text-gray-500">
                 체계적인 분석부터 실행, 그리고 성과 측정까지. <br/>
                 모든 과정이 데이터에 기반하여 투명하게 진행됩니다.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[
                 { title: "시장 정밀 분석", desc: "경쟁사 및 타겟 오디언스 분석을 통한 전략 수립", icon: "01" },
                 { title: "맞춤형 매체 운영", desc: "SA, DA, SNS 등 최적의 매체 믹스 제안 및 운영", icon: "02" },
                 { title: "성과/데이터 최적화", desc: "GA4 기반의 정밀한 데이터 트래킹 및 리포팅", icon: "03" },
                 { title: "콘텐츠 크리에이티브", desc: "고효율 소재 기획 및 디자인/영상 제작", icon: "04" },
                 { title: "CRM 마케팅", desc: "충성 고객 확보를 위한 알림톡/뉴스레터 관리", icon: "05" },
                 { title: "SEO/검색최적화", desc: "사이트 구조 개선 및 오가닉 트래픽 증대", icon: "06" },
               ].map((item, i) => (
                 <div key={i} className="group p-8 border border-gray-100 rounded-2xl hover:border-green-200 hover:shadow-xl hover:shadow-green-500/5 transition-all bg-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 text-6xl font-black text-gray-50 opacity-50 group-hover:text-green-50 transition-colors select-none">
                       {item.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 relative z-10">{item.title}</h3>
                    <p className="text-gray-500 relative z-10">{item.desc}</p>
                 </div>
               ))}
            </div>
          </div>
        </section>

        {/* Solutions Section (Editable Body) - Reusing content structure but different style */}
        <section id="solutions" className="py-24 px-6 bg-slate-50">
          <div className="mx-auto max-w-7xl">
             <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100">
                 <EditableContent
                    subdomain={site}
                    defaultContent={
                        <div className="flex flex-col lg:flex-row gap-16 items-center">
                          <div className="lg:w-1/2">
                            <h3 className="text-3xl font-bold text-gray-900 mb-6 leading-tight">
                              온라인 마케팅, <br />
                              <span className="text-green-600">제대로 된 전문가</span>와 시작하세요.
                            </h3>
                            <p className="text-gray-600 mb-8 leading-relaxed">
                               이제 마케팅은 선택이 아닌 필수입니다. <br/>
                               수많은 성공 사례가 증명하는 그로스 마케팅의 힘을 경험해보세요.
                            </p>
                            <ul className="space-y-4">
                                {[
                                  "전담 퍼포먼스 마케터 매칭",
                                  "월간 상세 리포트 제공",
                                  "실시간 커뮤니케이션 채널 운영",
                                  "매체비 투명 공개 원칙"
                                ].map((item, i) => (
                                   <li key={i} className="flex items-center gap-3 text-gray-700 font-medium">
                                      <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                         <CheckCircle2 className="h-4 w-4" />
                                      </div>
                                      {item}
                                   </li>
                                ))}
                            </ul>
                          </div>
                          <div className="lg:w-1/2 w-full">
                            <div className="relative group overflow-hidden rounded-2xl shadow-2xl shadow-gray-200">
                               <img 
                                 src="https://images.unsplash.com/photo-1551288049-bbbda536ad0a?q=80&w=2670&auto=format&fit=crop" 
                                 alt="Marketing Dashboard" 
                                 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                               />
                               <div className="absolute inset-0 bg-green-900/10 group-hover:bg-transparent transition-colors"></div>
                            </div>
                          </div>
                        </div>
                    }
                 />
             </div>
          </div>
        </section>

        {/* Contact Section - Clean Style */}
        <section id="contact" className="py-24 px-6 bg-white">
             <div className="mx-auto max-w-3xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">함께 성장을 만들어볼까요?</h2>
                    <p className="text-gray-500">
                       간단한 정보만 남겨주시면, 담당자가 비즈니스 진단을 도와드립니다.
                    </p>
                </div>
                {/* Reusing InquiryForm but in default clean style */}
                <div className="bg-white p-0 md:p-8">
                    <InquiryForm influencerId="inf-1" variant="clean" />
                </div>
             </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 bg-gray-50 border-t border-gray-200">
           <div className="mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-center md:text-left">
                <p className="font-bold text-gray-900 text-lg mb-1">GROWTH MARKETING</p>
                <p className="text-sm text-gray-500">당신의 비즈니스, 그 이상의 가치</p>
              </div>
              <div className="flex gap-6 text-sm text-gray-500">
                 <a href="#" className="hover:text-gray-900">이용약관</a>
                 <a href="#" className="hover:text-gray-900">개인정보처리방침</a>
                 <a href="#" className="hover:text-gray-900">고객센터</a>
              </div>
              <div className="text-xs text-gray-400">
                Copyright ⓒ 2025 Growth Marketing. All rights reserved.
              </div>
           </div>
        </footer>
      </div>
    );
  }

  // Custom Design for 'fan3' (AD-TECH Solution - DDMKT Theme)
  if (site === "fan3") {
    return (
      <div className="min-h-screen bg-[#050614] text-white font-sans selection:bg-indigo-500 selection:text-white">
        {/* Modern Tech Header */}
        <header className="fixed top-0 z-50 w-full bg-[#050614]/80 backdrop-blur-md border-b border-white/5">
          <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.5)]">
                 <Zap className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-black tracking-tighter uppercase">
                 도도<span className="text-indigo-400">마케팅</span>
              </h1>
            </div>
            
            <nav className="hidden md:flex gap-10 text-sm font-bold tracking-tight text-gray-400 transition-all">
              <a href="#about" className="hover:text-white">회사소개</a>
              <a href="#solutions" className="hover:text-white">서비스</a>
              <a href="#portfolio" className="hover:text-white">성공사례</a>
              <a href="#contact" className="hover:text-white bg-indigo-600 px-6 py-2.5 rounded-full text-white hover:bg-indigo-700 shadow-lg shadow-indigo-600/20">상담신청</a>
            </nav>
            <HeaderActions site={site} />
          </div>
        </header>

        {/* Hero Section */}
        <section className="pt-48 pb-32 px-6 relative overflow-hidden">
           <div className="absolute inset-0 bg-[#050614] z-0" />
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 z-0" />
           <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/20 blur-[150px] rounded-full z-0" />
           <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-600/20 blur-[150px] rounded-full z-0" />
           
           <div className="mx-auto max-w-7xl relative z-10 flex flex-col items-center text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl text-indigo-400 text-xs font-bold tracking-wide mb-10 uppercase transition-all hover:bg-white/10">
                 <Zap className="h-3.5 w-3.5 fill-indigo-400" />
                 데이터로 증명하는 퍼포먼스 마케팅
              </div>
              
              <EditableText
                subdomain={site}
                field="heroTitle"
                as="h2"
                className="text-6xl md:text-[7rem] font-black leading-[1.05] tracking-tighter mb-12"
                defaultValue={
                  <>
                    <span className="block opacity-50 text-[0.35em] tracking-tight mb-4">비즈니스 성공을 위한</span>
                    최적의 <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 via-purple-500 to-cyan-400">성장 엔진</span>
                  </>
                }
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center text-left max-w-5xl">
                 <EditableText
                  subdomain={site}
                  field="heroDescription"
                  as="p"
                  className="text-xl text-gray-400 leading-relaxed font-medium border-l-4 border-indigo-500 pl-8"
                  defaultValue={
                      "단순한 광고 집행을 넘어, 고객의 비즈니스를 깊이 있게 이해하고 분석합니다. 우리는 숫자의 이면에서 기회를 찾아내어 확실한 성과로 연결합니다."
                  }
                />
                <div className="flex gap-4">
                   <a href="#contact" className="px-10 py-5 bg-indigo-600 text-white font-black rounded-full hover:bg-indigo-500 transition-all shadow-[0_0_40px_rgba(79,70,229,0.4)] hover:scale-105 active:scale-95">
                      무료 상담 신청
                   </a>
                   <a href="#solutions" className="px-10 py-5 bg-white/5 border border-white/20 text-white font-black rounded-full hover:bg-white/10 transition-all backdrop-blur-md">
                      서비스 소개
                   </a>
                </div>
              </div>
           </div>
        </section>

        {/* Business Partnership Image Section */}
        <section className="py-24 px-6 bg-black/50">
           <div className="mx-auto max-w-7xl">
              <div className="relative aspect-video rounded-[3rem] overflow-hidden border border-white/10 group">
                 <img 
                   src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2670&auto=format&fit=crop" 
                   alt="Business Meeting" 
                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                 />
                 <div className="absolute inset-0 bg-linear-to-t from-[#050614] via-transparent to-transparent" />
                 <div className="absolute bottom-0 left-0 p-12 w-full flex justify-between items-end">
                    <div className="max-w-xl">
                       <h3 className="text-4xl font-black mb-4 tracking-tighter">함께 성장하는 파트너십</h3>
                       <p className="text-gray-300 font-medium leading-relaxed">도도마케팅은 수많은 클라이언트의 성공을 함께 만들어왔습니다. 전문 마케터들이 직접 소통하며 최상의 마케팅 믹스를 제안합니다.</p>
                    </div>
                    <div className="flex gap-4">
                       <div className="px-6 py-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 flex flex-col items-center justify-center">
                          <span className="text-xs text-indigo-400 font-black uppercase tracking-widest mb-1">ROAS</span>
                          <span className="text-2xl font-black">450%</span>
                       </div>
                       <div className="px-6 py-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 flex flex-col items-center justify-center">
                          <span className="text-xs text-indigo-400 font-black uppercase tracking-widest mb-1">Retain</span>
                          <span className="text-2xl font-black">92%</span>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* Tech Stats Grid */}
        <section className="py-12 bg-black/40 border-y border-white/5">
           <div className="mx-auto max-w-7xl px-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                 {[
                    { label: "Real-time Data", value: "24/7", desc: "실시간 모니터링", icon: BarChart3 },
                    { label: "AI Optimization", value: "98.9%", desc: "정밀 타켓팅", icon: Cpu },
                    { label: "Security Cloud", value: "Secure", desc: "데이터 보안", icon: ShieldCheck },
                    { label: "Global Traffic", value: "Infinite", desc: "트래픽 관리", icon: Globe }
                 ].map((stat, i) => (
                    <div key={i} className="group relative p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-indigo-500/30 transition-all">
                       <stat.icon className="h-5 w-5 text-indigo-400 mb-4 opacity-50 group-hover:opacity-100 transition-all" />
                       <div className="text-2xl font-black mb-1">{stat.value}</div>
                       <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">{stat.label}</div>
                       <div className="text-[10px] text-gray-600">{stat.desc}</div>
                    </div>
                 ))}
              </div>
           </div>
        </section>

        {/* Marketing Solutions Section */}
        <section id="solutions" className="py-32 px-6 relative">
           <div className="mx-auto max-w-7xl">
              <div className="flex flex-col lg:flex-row gap-20">
                 <div className="lg:w-2/5 space-y-12">
                    <div>
                       <h3 className="text-indigo-500 font-bold tracking-[0.2em] text-xs mb-4 uppercase">Advanced Solutions</h3>
                       <h2 className="text-5xl font-black mb-8 leading-tight tracking-tighter">
                          데이터로 앞서가는 <br/>
                          도도한 전략.
                       </h2>
                       <p className="text-gray-300 text-lg leading-relaxed font-medium">
                          마케팅은 과학입니다. 도도마케팅은 직관이 아닌 데이터를 근거로 움직입니다. 고객의 행동 하나하나를 분석하여 가장 완벽한 성과를 도출합니다.
                       </p>
                    </div>

                    <div className="space-y-6">
                       {[
                         { title: "검색 광고 최적화", desc: "고효율 키워드 발굴부터 구매 전환까지 완벽한 동선 설계", icon: BarChart3 },
                         { title: "타겟 오디언스 분석", desc: "빅데이터를 통한 정밀한 타겟팅으로 광고 효율 극대화", icon: Users }
                       ].map((feat, i) => (
                          <div key={i} className="flex gap-6 p-8 rounded-3xl bg-white/5 border border-white/10 group hover:bg-indigo-600/10 transition-all">
                             <div className="h-12 w-12 rounded-2xl bg-indigo-600/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                <feat.icon className="h-6 w-6 text-indigo-500" />
                             </div>
                             <div>
                                <h4 className="text-lg font-black mb-2">{feat.title}</h4>
                                <p className="text-sm text-gray-500 leading-relaxed font-medium">{feat.desc}</p>
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>
                 
                 <div className="lg:w-3/5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 h-full">
                       <div className="relative rounded-[3rem] overflow-hidden border border-white/10 h-full min-h-[450px]">
                          <img 
                            src="https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2670&auto=format&fit=crop" 
                            alt="Data Analysis" 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-indigo-900/40" />
                          <div className="absolute inset-0 p-10 flex flex-col justify-end">
                             <h3 className="text-2xl font-black mb-4">정밀 분석 솔루션</h3>
                             <p className="text-sm text-gray-200 leading-relaxed font-medium">
                                도도마케팅만의 분석 툴을 통해 단순 노출 이상의 가치, 즉 '매출'이라는 명확한 결과물을 가져다 드립니다.
                             </p>
                          </div>
                       </div>
                       <div className="flex flex-col gap-8">
                          <div className="flex-1 p-10 rounded-[3rem] bg-linear-to-br from-indigo-600 to-purple-700 font-black relative overflow-hidden group shadow-2xl shadow-indigo-600/20">
                             <Zap className="absolute top-10 right-10 h-20 w-20 text-white/10 group-hover:scale-125 transition-transform" />
                             <div className="text-5xl mb-4 italic">No.1</div>
                             <div className="text-lg opacity-80 uppercase tracking-widest leading-none">Global <br/> Marketing Agency</div>
                          </div>
                          <div className="flex-1 p-10 rounded-[3rem] bg-white text-black font-black flex flex-col justify-end shadow-2xl">
                             <EditableContent
                               subdomain={site}
                               defaultContent={
                                 <>
                                   <div className="text-3xl tracking-tighter leading-tight mb-4">성장의 끝이 아닌 <br/> 새로운 시작</div>
                                   <p className="text-sm text-gray-500 font-bold">도도마케팅과 함께라면 <br/> 비즈니스의 한계는 없습니다.</p>
                                 </>
                               }
                             />
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </section>


        {/* Contact Section */}
        <section id="contact" className="py-32 px-6 relative overflow-hidden">
             <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] -z-10" />
             <div className="mx-auto max-w-3xl">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter uppercase">LET'S CONNECT</h2>
                    <p className="text-gray-400 font-bold text-lg">
                       상상하던 이상의 성장, <br/>
                       지금 도도마케팅과 바로 시작하세요. 
                    </p>
                </div>
                <div className="bg-[#0A0B1E] border border-white/10 p-10 md:p-16 rounded-[4rem] shadow-2xl relative">
                    <div className="absolute top-0 right-0 p-12">
                       <Zap className="h-8 w-8 text-indigo-500 opacity-20" />
                    </div>
                    <InquiryForm influencerId="inf-1" variant="clean" />
                </div>
             </div>
        </section>

        {/* Footer */}
        <footer className="py-16 border-t border-white/5 px-6 bg-black">
           <div className="mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center gap-10">
              <div className="flex items-center gap-3">
                 <div className="h-9 w-9 bg-indigo-600 rounded-lg flex items-center justify-center">
                    <Zap className="h-5 w-5 text-white" />
                 </div>
                 <span className="text-xl font-black tracking-tighter italic">도도마케팅</span>
              </div>
              <div className="flex gap-10 text-xs font-bold tracking-widest text-gray-500">
                 <a href="#" className="hover:text-white transition-colors">이용약관</a>
                 <a href="#" className="hover:text-white transition-colors">개인정보처리방침</a>
                 <a href="#" className="hover:text-white transition-colors">고객지원</a>
              </div>
              <div className="text-xs text-gray-600 font-bold">
                 &copy; 2025 (주)도도커뮤니케이션. ALL RIGHTS RESERVED.
              </div>
           </div>
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
        <Image
          src={creator.image}
          alt={creator.name}
          width={1920}
          height={1080}
          priority
          className="h-full w-full object-cover opacity-80 scale-105 animate-slow-zoom"
        />

        <div className="absolute bottom-0 left-0 z-20 w-full p-8 md:p-12">
          <div className="mx-auto max-w-4xl space-y-4">
            <span className="inline-block rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-md">
              Official Fan Page
            </span>
            <div className="flex items-end justify-between">
              <div>
                <h1 className="text-6xl font-black uppercase tracking-tighter md:text-8xl">
                  {creator.name}
                </h1>
                <p className="mt-4 max-w-xl text-lg text-gray-300 md:text-xl">
                  {creator.bio}
                </p>
              </div>
              <div className="hidden text-right md:block">
                <div className="text-4xl font-bold">{creator.stats.fans}</div>
                <div className="text-sm text-gray-400">Monthly Visitors</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* Quick Actions */}
        <div className="mb-12 flex flex-wrap gap-4">
          <button className="flex-1 rounded-2xl bg-white py-4 text-center font-bold text-black transition-transform hover:scale-[1.02] active:scale-95">
            <Heart className="mx-auto mb-1 h-5 w-5" />
            Join Fan Club
          </button>
          <button className="flex-1 rounded-2xl bg-[#1A1A1A] py-4 text-center font-bold text-white transition-transform hover:bg-[#2A2A2A] active:scale-95">
            <MessageCircle className="mx-auto mb-1 h-5 w-5" />
            Community
          </button>
          <button className="flex-1 rounded-2xl bg-[#1A1A1A] py-4 text-center font-bold text-white transition-transform hover:bg-[#2A2A2A] active:scale-95">
            <Share2 className="mx-auto mb-1 h-5 w-5" />
            Share
          </button>
        </div>

        {/* Live News Feed */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-2xl font-bold">
              <Newspaper className="h-5 w-5 text-gray-500" />
              Live Updates
            </h2>
            <span className="flex items-center gap-1 text-xs text-green-500">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
              </span>
              Real-time
            </span>
          </div>

          <div className="space-y-4">
            {news.map((item) => (
              <a
                href={item.url}
                key={item.id}
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-2xl border border-white/10 bg-[#111] p-6 transition-all hover:bg-[#1A1A1A] hover:border-white/20"
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="text-lg font-bold leading-snug group-hover:text-blue-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm text-gray-400 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="mt-4 flex items-center gap-3 text-xs text-gray-500">
                      <span>{item.source}</span>
                      <span>•</span>
                      <span>{item.date}</span>
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-gray-600 group-hover:text-white transition-colors" />
                </div>
              </a>
            ))}
          </div>
        </section>
      </div>

      {/* Admin Quick Action (Only Visible to Admin - Mock) */}
      <HeaderActions site={site} />
    </div>
  );
}
