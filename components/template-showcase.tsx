"use client";

import { useDataStore } from "@/lib/data-store";
import { ArrowRight, Monitor, Smartphone, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Template } from "@/lib/data-store";

export default function TemplateShowcase() {
  const { templates } = useDataStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section id="references" className="py-24 bg-white/5 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-sm font-semibold text-purple-400 backdrop-blur-md mb-6">
            <Monitor className="h-4 w-4" />
            <span>PREMIUM TEMPLATES</span>
          </div>
          <h2 className="text-3xl font-black md:text-5xl mb-6">
            빠르게 수정하는 템플릿
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            내용만 충실히 준비해 주세요. 디자인 고민없이 검증된 레이아웃으로 즉시 시작하세요.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((template) => (
            <div
              key={template.id}
              className="group relative rounded-3xl border border-white/10 bg-black/40 overflow-hidden hover:border-purple-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(139,92,246,0.15)]"
            >
              {/* Thumbnail Area - Simulating a Screenshot */}
              <div className="aspect-4/3 bg-gray-900 relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                {template.thumbnailUrl ? (
                  <img
                    src={template.thumbnailUrl}
                    alt={template.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  // CSS-based Mockup if no image
                  <div className="w-full h-full relative cursor-pointer">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-neutral-900">
                      {/* Abstract Site Content */}
                      <div className="absolute top-0 left-0 w-full h-12 bg-black border-b border-white/10 flex items-center px-4 justify-between">
                         <div className="h-4 w-24 bg-white/20 rounded"></div>
                         <div className="flex gap-2">
                            <div className="h-3 w-8 bg-white/10 rounded"></div>
                            <div className="h-3 w-8 bg-white/10 rounded"></div>
                         </div>
                      </div>
                      
                      {/* Hero Content Mockup */}
                      <div className="absolute top-12 left-0 w-full h-full p-8 flex flex-col justify-center">
                         <div className={`text-4xl font-black mb-4 uppercase leading-none opacity-90 ${template.layoutId === 'limited-marketing' ? 'text-white' : 'text-gray-200'}`}>
                           {template.layoutId === 'limited-marketing' ? (
                             <>LIMITED<br/><span className="text-[#FFE400]">MARKETING</span></>
                           ) : template.name}
                         </div>
                         <div className="h-2 w-32 bg-white/20 rounded mb-2"></div>
                         <div className="h-2 w-48 bg-white/20 rounded"></div>
                         
                         {/* Button Mockup */}
                         <div className={`mt-6 w-32 h-10 rounded flex items-center justify-center text-xs font-bold ${template.layoutId === 'limited-marketing' ? 'bg-[#FFE400] text-black' : 'bg-purple-500 text-white'}`}>
                            CONTACT US
                         </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
                   <a 
                     href={template.demoUrl?.includes('localhost') ? `https://kkang.designd.co.kr/sites/${template.demoUrl.includes('//') ? template.demoUrl.split('//')[1].split('.')[0] : 'fan1'}` : (template.demoUrl || '#')} 
                     target="_blank"
                     rel="noopener noreferrer"
                     className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition-colors"
                   >
                     <Monitor className="h-4 w-4" />
                     PC 미리보기
                   </a>
                </div>
              </div>

              {/* Template Info */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 rounded text-[10px] font-bold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/20">
                      {template.category}
                    </span>
                    {template.layoutId === 'limited-marketing' && (
                        <span className="px-2 py-1 rounded text-[10px] font-bold uppercase bg-[#FFE400]/20 text-[#FFE400] border border-[#FFE400]/20">
                        BEST
                        </span>
                    )}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                  {template.name}
                </h3>
                <p className="text-sm text-gray-400 mb-6 line-clamp-2 h-10">
                  {template.description}
                </p>

                <div className="flex items-center justify-between border-t border-white/10 pt-4">
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Monitor className="h-3 w-3" /> PC
                    </span>
                    <span className="flex items-center gap-1">
                      <Smartphone className="h-3 w-3" /> Mobile
                    </span>
                  </div>
                  <Link
                    href={`/sites/${template.demoUrl?.split('//')[1]?.split('.')[0] || 'fan1'}`}
                    className="flex items-center gap-1 text-sm font-bold text-white hover:text-purple-400 transition-colors"
                  >
                    자세히 보기 <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {/* Add Template Placeholder (Only visible to admin potentially, but showing empty state for now if empty) */}
          {templates.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-500 border border-dashed border-white/10 rounded-2xl">
              등록된 템플릿이 없습니다.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
