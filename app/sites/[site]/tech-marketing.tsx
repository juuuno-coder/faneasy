"use client";

import { Zap, BarChart3, Cpu, ShieldCheck, Globe, Users, ArrowRight } from "lucide-react";
import { EditableText, EditableContent } from "@/components/editable";
import HeaderActions from "./header-actions";
import InquiryForm from "./inquiry-form";
import { Spotlight } from "@/components/ui/spotlight";
import { useAOS } from '@/hooks/use-aos';

export default function TechMarketing({ site }: { site: string }) {
  // AOS 스크롤 애니메이션 초기화
  useAOS();

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
          
          <nav className="hidden md:flex items-center gap-10 text-sm font-bold tracking-tight text-gray-400 transition-all">
            <a href="#about" className="hover:text-white transition-colors">회사소개</a>
            <a href="#solutions" className="hover:text-white transition-colors">서비스</a>
            <a href="#portfolio" className="hover:text-white transition-colors">성공사례</a>
            <a href="#contact" className="hover:text-white bg-indigo-600 px-6 py-2.5 rounded-full text-white hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center">상담신청</a>
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl text-indigo-400 text-xs font-bold tracking-wide mb-10 uppercase transition-all hover:bg-white/10" data-aos="fade-down">
               <Zap className="h-3.5 w-3.5 fill-indigo-400" />
               데이터로 증명하는 퍼포먼스 마케팅
            </div>
            
            <EditableText
              subdomain={site}
              field="heroTitle"
              as="h2"
              className="text-4xl md:text-[7rem] font-black leading-[1.05] tracking-tighter mb-12"
              data-aos="fade-up"
              data-aos-delay="100"
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
                className="text-lg md:text-xl text-gray-400 leading-relaxed font-medium border-l-4 border-indigo-500 pl-8"
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
                     <h3 className="text-2xl md:text-4xl font-black mb-4 tracking-tighter">함께 성장하는 파트너십</h3>
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
                  <div key={i} className="group relative p-6 rounded-2xl bg-white/2 border border-white/5 hover:border-indigo-500/30 transition-all">
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
                     <h2 className="text-3xl md:text-5xl font-black mb-8 leading-tight tracking-tighter">
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
                           <h3 className="text-xl md:text-2xl font-black mb-4">정밀 분석 솔루션</h3>
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
                                 <div className="text-xl md:text-3xl tracking-tighter leading-tight mb-4">성장의 끝이 아닌 <br/> 새로운 시작</div>
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
                  <h2 className="text-2xl md:text-6xl font-black mb-8 tracking-tighter uppercase">LET'S CONNECT</h2>
                  <p className="text-gray-400 font-bold text-lg">
                     상상하던 이상의 성장, <br/>
                     지금 도도마케팅과 바로 시작하세요. 
                  </p>
              </div>
              <div className="bg-[#0A0B1E] border border-white/10 p-10 md:p-16 rounded-[4rem] shadow-2xl relative">
                  <div className="absolute top-0 right-0 p-12">
                     <Zap className="h-8 w-8 text-indigo-500 opacity-20" />
                  </div>
                  <InquiryForm influencerId="inf-1" variant="tech" />
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
