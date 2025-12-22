"use client";

import { Monitor, Smartphone, ArrowRight, CheckCircle2 } from "lucide-react";
import { EditableText, EditableContent } from "@/components/editable";
import HeaderActions from "./header-actions";
import InquiryForm from "./inquiry-form";

export default function MZMarketing({ site }: { site: string }) {
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
                여러분의 비즈니스를 확실한 성공으로 이끌어드립니다.
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
