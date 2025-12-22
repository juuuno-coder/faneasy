'use client';

import {
  Rocket,
  Palette,
  Monitor,
  Star,
  CheckCircle2,
  Code2,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import InquiryForm from "./inquiry-form";
import FAQSection from "./faq-section";
import HeaderActions from "./header-actions";
import TemplateShowcase from "@/components/template-showcase";
import MobileBottomNav from "@/components/mobile-bottom-nav";

export default function AgencyLandingPage({ site }: { site: string }) {
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
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
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
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="mx-auto mt-8 max-w-2xl text-lg text-gray-400 md:text-xl"
          >
            디자인부터 세팅까지 올인원. 전문 개발팀과 깡대표가 협업하여{" "}
            <br className="hidden md:block" />
            여러분의 비즈니스를 가장 프로페셔널하게 완성해드립니다.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
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
            <div className="group rounded-3xl border border-white/5 bg-white/2 p-8 transition-all hover:border-purple-500/30 hover:bg-white/5">
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
            <div className="group rounded-3xl border border-white/5 bg-white/2 p-8 transition-all hover:border-purple-500/30 hover:bg-white/5">
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
            <div className="rounded-3xl border border-white/5 bg-white/2 p-8 flex flex-col transition-all hover:bg-white/4">
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
                href={`/sites/${site}/checkout?plan=basic`}
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
                href={`/sites/${site}/checkout?plan=pro`}
                className="mt-8 block w-full rounded-2xl bg-purple-500 py-4 text-center text-sm font-bold transition-all hover:bg-purple-600 shadow-lg"
              >
                가장 많이 선택하는 플랜<br />지금 시작하기
              </Link>
            </div>

            {/* Master */}
            <div className="rounded-3xl border border-white/5 bg-white/2 p-8 flex flex-col transition-all hover:bg-white/4">
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
                href={`/sites/${site}/checkout?plan=master`}
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
