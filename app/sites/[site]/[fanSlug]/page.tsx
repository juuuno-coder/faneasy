import { getInfluencer, getFan } from "@/lib/data";
import { notFound } from "next/navigation";
import { 
  ArrowRight, 
  CheckCircle2, 
  Layout, 
  MessageSquare, 
  Monitor, 
  Smartphone, 
  Zap,
  Menu
} from "lucide-react";
import Link from "next/link";
import InquiryForm from "../inquiry-form";

export default async function FanSubPage({ 
  params 
}: { 
  params: Promise<{ site: string; fanSlug: string }> 
}) {
  const { site, fanSlug } = await params;
  
  // 인플루언서 및 고객(Fan) 정보 가져오기
  const influencer = getInfluencer(site);
  if (!influencer) notFound();

  const fan = getFan(influencer.id, fanSlug);
  if (!fan) notFound();

  // Mock Data for the Customer's Agency Site
  const portfolio = [
    { title: "Brand Identity Redesign", category: "Branding", image: "https://images.unsplash.com/photo-1600607686527-6fb886090705?w=800&q=80" },
    { title: "E-commerce Platform", category: "Web Development", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80" },
    { title: "Social Media Campaign", category: "Marketing", image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80" },
  ];

  return (
    <div className={`min-h-screen font-sans ${fan.pageSettings.theme === 'light' ? 'bg-white text-black' : 'bg-[#111] text-white'}`}>
      
      {/* 1. Header & Navigation */}
      <header className={`fixed top-0 z-50 w-full border-b backdrop-blur-md ${fan.pageSettings.theme === 'light' ? 'border-black/5 bg-white/70' : 'border-white/5 bg-black/70'}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className={`h-8 w-8 rounded-lg ${fan.pageSettings.theme === 'light' ? 'bg-black' : 'bg-white'} flex items-center justify-center`}>
              <span className={`font-bold ${fan.pageSettings.theme === 'light' ? 'text-white' : 'text-black'}`}>{fan.name[0]}</span>
            </div>
            <span className="text-xl font-bold tracking-tight">{fan.pageSettings.title}</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium opacity-80">
            <a href="#services" className="hover:opacity-100 transition-opacity">Services</a>
            <a href="#portfolio" className="hover:opacity-100 transition-opacity">Portfolio</a>
            <a href="#about" className="hover:opacity-100 transition-opacity">About</a>
          </nav>

          <div className="flex items-center gap-4">
            <a 
              href="#contact"
              className={`rounded-full px-6 py-2.5 text-sm font-bold transition-all hover:scale-105 active:scale-95 ${
                fan.pageSettings.theme === 'light' 
                  ? 'bg-black text-white hover:bg-gray-800' 
                  : 'bg-white text-black hover:bg-gray-200'
              }`}
            >
              Contact Us
            </a>
            {/* Mobile Menu Button - Visual Only */}
            <button className="md:hidden">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden">
        {fan.pageSettings.banner && (
          <div className="absolute inset-0 -z-10">
            <div className={`absolute inset-0 z-10 ${fan.pageSettings.theme === 'light' ? 'bg-white/90' : 'bg-black/80'}`} />
            <img src={fan.pageSettings.banner} alt="Banner" className="h-full w-full object-cover" />
          </div>
        )}
        
        <div className="mx-auto max-w-7xl text-center">
          <span className={`inline-block mb-6 rounded-full border px-4 py-1.5 text-xs font-semibold tracking-wider uppercase ${
            fan.pageSettings.theme === 'light' ? 'border-black/10 bg-black/5' : 'border-white/10 bg-white/5'
          }`}>
            Creative Digital Agency
          </span>
          <h1 className="mx-auto max-w-4xl text-5xl font-extrabold leading-[1.1] tracking-tight md:text-7xl lg:text-8xl">
            We Build Digital <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-500 to-purple-600">
              Experiences.
            </span>
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-lg md:text-xl opacity-60 leading-relaxed">
            {fan.pageSettings.description}
          </p>
          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a 
              href="#contact"
              className={`h-14 px-10 rounded-full flex items-center justify-center gap-2 font-bold text-lg transition-all hover:-translate-y-1 hover:shadow-xl ${
                fan.pageSettings.theme === 'light' 
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20' 
                  : 'bg-white text-black hover:bg-gray-200 shadow-white/10'
              }`}
            >
              Start Project
              <ArrowRight className="h-5 w-5" />
            </a>
            <a 
              href="#portfolio"
              className={`h-14 px-10 rounded-full flex items-center justify-center font-bold text-lg border transition-all hover:bg-opacity-10 ${
                fan.pageSettings.theme === 'light' 
                  ? 'border-black/10 hover:bg-black' 
                  : 'border-white/10 hover:bg-white'
              }`}
            >
              View Work
            </a>
          </div>
        </div>
      </section>

      {/* 3. Services Section */}
      <section id="services" className={`py-24 px-6 ${fan.pageSettings.theme === 'light' ? 'bg-gray-50' : 'bg-white/5'}`}>
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 md:flex items-end justify-between">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold md:text-5xl mb-6">Our Expertise</h2>
              <p className="text-lg opacity-60">
                디지털 비즈니스 성공을 위한 최적의 솔루션을 제공합니다.
              </p>
            </div>
            <a href="#contact" className="hidden md:flex items-center gap-2 font-bold hover:underline">
              All Services <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Layout, title: "Web Design", desc: "사용자 경험을 최우선으로 고려한 모던하고 직관적인 웹사이트를 디자인합니다." },
              { icon: Smartphone, title: "Mobile App", desc: "iOS 및 Android 환경에 최적화된 네이티브 및 하이브리드 앱을 개발합니다." },
              { icon: Zap, title: "Marketing", desc: "데이터 기반의 퍼포먼스 마케팅으로 비즈니스의 성장을 가속화합니다." }
            ].map((service, i) => (
              <div key={i} className={`p-8 rounded-3xl transition-all hover:-translate-y-2 border ${
                fan.pageSettings.theme === 'light' 
                  ? 'bg-white border-gray-100 hover:shadow-xl hover:shadow-gray-200/50' 
                  : 'bg-[#1A1A1A] border-white/5 hover:border-purple-500/50'
              }`}>
                <div className="h-14 w-14 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-6">
                  <service.icon className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                <p className="opacity-60 leading-relaxed">
                  {service.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Portfolio Section */}
      <section id="portfolio" className="py-24 px-6 overflow-hidden">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold md:text-5xl mb-16">Selected Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolio.map((item, i) => (
              <div key={i} className="group relative cursor-pointer">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                </div>
                <div className="mt-6 flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                    <p className="text-sm opacity-60 uppercase tracking-widest">{item.category}</p>
                  </div>
                  <div className={`h-10 w-10 rounded-full border flex items-center justify-center transition-all group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white ${
                    fan.pageSettings.theme === 'light' ? 'border-black/10' : 'border-white/10'
                  }`}>
                    <ArrowRight className="h-4 w-4 -rotate-45 group-hover:rotate-0 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Contact Section */}
      <section id="contact" className={`py-24 px-6 relative ${fan.pageSettings.theme === 'light' ? 'bg-black text-white' : 'bg-white text-black'}`}>
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-blue-500 font-bold tracking-widest uppercase mb-4 block">Contact Us</span>
              <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
                Let's Build Something <br /> Amazing Together.
              </h2>
              <p className="text-xl opacity-60 mb-12 max-w-md">
                프로젝트에 대해 궁금한 점이 있으신가요? <br />
                언제든 편하게 문의주세요. 24시간 이내 답변드립니다.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm opacity-60">Email Us</div>
                    <div className="font-bold text-lg">{fan.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center">
                    <Smartphone className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm opacity-60">Call Us</div>
                    <div className="font-bold text-lg">010-0000-0000</div>
                  </div>
                </div>
              </div>
            </div>

            <div className={`p-8 md:p-12 rounded-3xl ${fan.pageSettings.theme === 'light' ? 'bg-[#111]' : 'bg-gray-100 text-black'}`}>
               <InquiryForm influencerId={fan.id} />
            </div>
          </div>
        </div>
      </section>

      {/* 6. Footer */}
      <footer className={`py-12 px-6 border-t ${fan.pageSettings.theme === 'light' ? 'border-black/5' : 'border-white/5 bg-[#050505]'}`}>
        <div className="mx-auto max-w-7xl md:flex justify-between items-center text-sm opacity-50">
          <p>&copy; 2024 {fan.pageSettings.title}. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
             <a href="#" className="hover:opacity-100">Privacy Policy</a>
             <a href="#" className="hover:opacity-100">Terms of Service</a>
          </div>
        </div>
         {/* System Link for Demo Purpose */}
        <div className="fixed bottom-4 right-4 z-[100]">
           <Link 
             href={`http://${site}.localhost:3500`} 
             className="flex items-center gap-2 px-4 py-2 bg-black text-white text-xs rounded-full shadow-lg hover:bg-gray-800 transition-all opacity-50 hover:opacity-100"
           >
             <ArrowRight className="h-3 w-3" />
             Go to FanEasy Main
           </Link>
        </div>
      </footer>
    </div>
  );
}
