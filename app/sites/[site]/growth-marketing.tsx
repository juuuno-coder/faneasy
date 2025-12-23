"use client";

import { ArrowRight, CheckCircle2 } from "lucide-react";
import { EditableText, EditableContent } from "@/components/editable";
import HeaderActions from "./header-actions";
import InquiryForm from "./inquiry-form";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";

export default function GrowthMarketing({ site }: { site: string }) {
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
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-500">
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
           <div className="absolute inset-0 bg-linear-to-r from-white via-white/80 to-transparent"></div>
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
               <div className="h-80 rounded-md flex flex-col antialiased bg-white dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
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
                <div key={i} className="group p-8 border border-gray-100 rounded-2xl hover:border-green-200 hover:shadow-[0_20px_40px_rgba(34,197,94,0.1)] transition-all bg-white relative overflow-hidden active:scale-[0.98]">
                   <div className="absolute top-0 right-0 p-6 text-6xl font-black text-gray-50 opacity-50 group-hover:text-green-50 transition-colors select-none">
                      {item.icon}
                   </div>
                   <h3 className="text-xl font-bold text-gray-900 mb-3 relative z-10 group-hover:text-green-600 transition-colors">{item.title}</h3>
                   <p className="text-gray-500 relative z-10">{item.desc}</p>
                </div>
             ))}
          </div>
        </div>
      </section>

      {/* Solutions Section (Editable Body) */}
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
                           <div className="relative group overflow-hidden rounded-2xl shadow-2xl shadow-gray-200 aspect-video lg:aspect-[4/3]">
                             <img 
                               src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop" 
                               alt="Marketing Dashboard" 
                               className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                             />
                             <div className="absolute inset-0 bg-green-900/5 group-hover:bg-transparent transition-colors"></div>
                           </div>
                        </div>
                      </div>
                  }
               />
           </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-6 bg-white">
           <div className="mx-auto max-w-3xl">
              <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">함께 성장을 만들어볼까요?</h2>
                  <p className="text-gray-500">
                     간단한 정보만 남겨주시면, 담당자가 비즈니스 진단을 도와드립니다.
                  </p>
              </div>
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
