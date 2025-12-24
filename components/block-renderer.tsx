'use client';

import { SiteBlock } from '@/lib/types';
import InquiryForm from '@/app/sites/[site]/inquiry-form';
import { generateHTML } from '@tiptap/html';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Youtube from '@tiptap/extension-youtube';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Plus, Minus, Star, Quote as QuoteIcon } from 'lucide-react';

interface BlockRendererProps {
  blocks: SiteBlock[];
  site: string; // subdomain for InquiryForm
}

export default function BlockRenderer({ blocks, site }: BlockRendererProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="flex flex-col w-full overflow-hidden">
      {blocks
        .filter(b => !b.settings?.isHidden)
        .sort((a, b) => a.order - b.order)
        .map((block) => {
          const animationProps = getAnimationProps(block.settings?.animation);
          const maxWidthClass = block.settings?.maxWidth ? {
            sm: 'max-w-3xl',
            md: 'max-w-5xl',
            lg: 'max-w-7xl',
            xl: 'max-w-screen-xl',
            full: 'max-w-full'
          }[block.settings.maxWidth] : 'max-w-full';

          return (
            <motion.div 
              key={block.id}
              {...(animationProps as any)}
              style={{
                backgroundColor: block.settings?.backgroundColor || 'transparent',
                color: block.settings?.textColor || 'inherit',
              }}
              className={`${block.settings?.className || ''} w-full transition-colors duration-500`}
            >
                <div 
                  className="w-full"
                  style={{
                    paddingTop: block.settings?.paddingTop || '80px',
                    paddingBottom: block.settings?.paddingBottom || '80px',
                  }}
                >
                    <div 
                       className={`${maxWidthClass} mx-auto px-6`}
                       style={{
                         // We can handle mobile padding better here if needed via dynamic style attributes
                         // but standard responsive classes like px-6 are often enough.
                         // For true dynamic mobile padding, we'd need a more complex strategy.
                       }}
                    >
                      <BlockItem block={block} site={site} />
                    </div>
                </div>
            </motion.div>
          );
        })}
    </div>
  );
}

function getAnimationProps(animation?: string) {
  const transition = { duration: 0.6 };
  switch (animation) {
    case 'fade':
      return { initial: { opacity: 0 }, whileInView: { opacity: 1 }, viewport: { once: true }, transition };
    case 'slide-up':
      return { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { ...transition, ease: 'easeOut' } };
    case 'zoom':
      return { initial: { opacity: 0, scale: 0.95 }, whileInView: { opacity: 1, scale: 1 }, viewport: { once: true }, transition };
    default:
      return {};
  }
}

function BlockItem({ block, site }: { block: SiteBlock; site: string }) {
  const accentColor = 'var(--accent, #8b5cf6)';

  switch (block.type) {
    case 'hero':
      return (
        <section className="text-center">
          <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tight leading-[1.1]">
            {block.content.title}
          </h1>
          <p className="text-xl opacity-70 mb-10 max-w-2xl mx-auto leading-relaxed">
            {block.content.description}
          </p>
          {block.content.buttonText && (
            <button 
              style={{ backgroundColor: accentColor }}
              className="px-10 py-5 text-white font-bold rounded-2xl transition-all shadow-2xl hover:scale-105 active:scale-95 shadow-(--accent)/30"
            >
              {block.content.buttonText}
            </button>
          )}
        </section>
      );

    case 'text':
      const html = generateHTML(block.content.json, [
        StarterKit,
        Image,
        Link,
        Youtube,
      ]);
      return (
        <div className="max-w-4xl mx-auto prose prose-invert lg:prose-xl prose-purple" dangerouslySetInnerHTML={{ __html: html }} />
      );

    case 'image':
      return (
        <div>
           <img 
             src={block.content.url} 
             alt={block.content.alt || ''} 
             className="w-full h-auto rounded-4xl shadow-2xl border border-white/10"
           />
        </div>
      );

    case 'features':
      return (
        <section>
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">{block.content.title}</h2>
            {block.content.description && <p className="opacity-60 max-w-xl mx-auto text-lg">{block.content.description}</p>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {block.content.items?.map((item: any, idx: number) => (
              <div key={idx} className="p-10 rounded-[2.5rem] bg-white/5 border border-white/10 hover:border-(--accent)/30 transition-all hover:bg-white/10 group">
                <div 
                  style={{ backgroundColor: `${accentColor}20` }}
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform"
                >
                   <Check style={{ color: accentColor }} />
                </div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="opacity-50 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </section>
      );

    case 'pricing':
      return (
        <section>
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">{block.content.title}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {block.content.plans?.map((plan: any, idx: number) => (
              <div key={idx} 
                className={`p-10 rounded-[3rem] border transition-all ${plan.popular ? 'scale-105 shadow-2xl' : 'bg-white/5 border-white/10'}`}
                style={plan.popular ? { backgroundColor: accentColor, borderColor: accentColor, boxShadow: `0 25px 50px -12px ${accentColor}33` } : {}}
              >
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="text-4xl font-black mb-8">{plan.price}</div>
                <ul className="space-y-4 mb-10">
                  {plan.features?.filter((f:string) => f.trim() !== '').map((feat: string, fidx: number) => (
                    <li key={fidx} className="flex items-start gap-3 opacity-80 decoration-0">
                      <Check size={18} className="mt-1 shrink-0" style={{ color: plan.popular ? 'white' : accentColor }} />
                      <span className="text-sm leading-relaxed">{feat}</span>
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-4 rounded-2xl font-bold transition-all ${plan.popular ? 'bg-white text-black hover:bg-gray-100' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                  {plan.buttonText || '선택하기'}
                </button>
              </div>
            ))}
          </div>
        </section>
      );

    case 'faq':
      return <FaqSection content={block.content} />;

    case 'stats':
      return (
        <section className="border-y border-white/5 bg-white/2 -mx-6 md:-mx-12 px-6 md:px-12 py-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 max-w-6xl mx-auto text-center">
            {block.content.items?.map((item: any, idx: number) => (
              <div key={idx}>
                <div style={{ color: accentColor }} className="text-5xl font-black mb-2 tracking-tighter">{item.value}</div>
                <div className="text-sm font-bold uppercase tracking-widest opacity-40">{item.label}</div>
              </div>
            ))}
          </div>
        </section>
      );

    case 'testimonials':
      return (
        <section>
           <div className="max-w-4xl mx-auto">
              {block.content.items?.map((item: any, idx: number) => (
                <div key={idx} className="text-center mb-16 last:mb-0">
                  <div className="flex justify-center mb-6">
                    <QuoteIcon size={40} style={{ color: `${accentColor}4d` }} />
                  </div>
                  <p className="text-2xl md:text-3xl font-medium leading-relaxed mb-8 italic">
                    "{item.quote}"
                  </p>
                  <div className="flex items-center justify-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/10 border border-white/10" />
                    <div className="text-left">
                       <div className="font-bold">{item.author}</div>
                       <div className="text-xs opacity-40">{item.role}</div>
                    </div>
                  </div>
                </div>
              ))}
           </div>
        </section>
      );

    case 'form':
      return (
        <section className="max-w-4xl mx-auto">
           <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">{block.content.title || '문의하기'}</h2>
              <p className="opacity-50">{block.content.description || '궁금하신 점을 남겨주시면 빠르게 답변 드리겠습니다.'}</p>
           </div>
           <InquiryForm influencerId="inf-1" variant={block.content.variant || 'default'} />
        </section>
      );

    case 'spacer':
      return <div style={{ height: block.content.height || '50px' }} />;

    case 'divider':
      return <div className="h-px bg-white/10 w-full" />;

    default:
      return <div>Unknown block type: {block.type}</div>;
  }
}

function FaqSection({ content }: { content: any }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const accentColor = 'var(--accent, #8b5cf6)';

  return (
    <section className="max-w-3xl mx-auto">
      <h2 className="text-4xl font-bold mb-16 text-center">{content.title || '자주 묻는 질문'}</h2>
      <div className="space-y-4">
        {content.items?.map((item: any, idx: number) => (
          <div key={idx} className="border border-white/10 rounded-3xl overflow-hidden bg-white/5 transition-colors hover:border-white/20">
            <button 
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              className="w-full px-8 py-6 flex items-center justify-between text-left"
            >
              <span className="font-bold text-lg">{item.question}</span>
              {openIndex === idx ? <Minus size={20} style={{ color: accentColor }} /> : <Plus size={20} className="text-gray-500" />}
            </button>
            <AnimatePresence>
              {openIndex === idx && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="px-8 pb-8 text-gray-400 leading-relaxed">
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}
