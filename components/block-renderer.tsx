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
  site: string; 
  isEditable?: boolean;
  activeBlockId?: string | null;
  onUpdateBlock?: (id: string, content: any) => void;
  onSelectBlock?: (id: string) => void;
}

export default function BlockRenderer({ 
  blocks, 
  site, 
  isEditable = false,
  activeBlockId = null,
  onUpdateBlock,
  onSelectBlock
}: BlockRendererProps) {
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
          const animationProps = isEditable ? {} : getAnimationProps(block.settings?.animation);
          const isActive = activeBlockId === block.id;
          
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
              onClick={() => isEditable && onSelectBlock?.(block.id)}
              style={{
                backgroundColor: block.settings?.backgroundColor || 'transparent',
                color: block.settings?.textColor || 'inherit',
              }}
              className={`${block.settings?.className || ''} w-full transition-all duration-500 relative cursor-default ${
                isEditable && isActive ? 'ring-2 ring-purple-500 ring-inset' : ''
              } ${isEditable ? 'hover:ring-1 hover:ring-purple-500/50 hover:ring-inset' : ''}`}
            >
                {isEditable && isActive && (
                  <div className="absolute top-0 right-0 bg-purple-600 text-white text-[10px] font-bold px-2 py-1 z-50 rounded-bl-lg shadow-xl">
                    현재 편집 중: {block.type.toUpperCase()}
                  </div>
                )}
                <div 
                  className="w-full [--padding-y:40px] md:[--padding-y:inherit]"
                  style={{
                    paddingTop: `var(--padding-y, ${block.settings?.paddingTop || '80px'})`,
                    paddingBottom: `var(--padding-y, ${block.settings?.paddingBottom || '80px'})`,
                  }}
                >
                    <div className={`${maxWidthClass} mx-auto px-6`}>
                      <BlockItem 
                        block={block} 
                        site={site} 
                        isEditable={isEditable}
                        onUpdate={(content) => onUpdateBlock?.(block.id, content)}
                      />
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

function EditableText({ 
  value, 
  onChange, 
  className, 
  element: Element = 'div', 
  isEditable = false,
  placeholder = '내용을 입력하세요...'
}: any) {
  if (!isEditable) return <Element className={className} dangerouslySetInnerHTML={{ __html: value?.replace(/\n/g, '<br/>') }} />;
  
  return (
    <Element
      contentEditable
      suppressContentEditableWarning
      onBlur={(e: any) => onChange(e.target.innerText)}
      className={`${className} outline-hidden focus:ring-2 focus:ring-purple-500 rounded-lg px-2 -mx-2 transition-all hover:bg-white/5 cursor-text min-h-[1.5em]`}
      data-placeholder={placeholder}
    >
      {value}
    </Element>
  );
}

function BlockItem({ 
  block, 
  site, 
  isEditable, 
  onUpdate 
}: { 
  block: SiteBlock; 
  site: string;
  isEditable: boolean;
  onUpdate: (content: any) => void;
}) {
  const accentColor = 'var(--accent, #8b5cf6)';

  switch (block.type) {
    case 'hero':
      return (
        <section className="text-center">
          <EditableText
            isEditable={isEditable}
            element="h1"
            value={block.content.title}
            onChange={(title: string) => onUpdate({ ...block.content, title })}
            className="text-4xl md:text-8xl font-black mb-6 tracking-tight leading-[1.2] md:leading-[1.1]"
          />
          <EditableText
            isEditable={isEditable}
            element="p"
            value={block.content.description}
            onChange={(description: string) => onUpdate({ ...block.content, description })}
            className="text-lg md:text-xl opacity-70 mb-10 max-w-2xl mx-auto leading-relaxed"
          />
          {block.content.buttonText && (
            <div className="flex justify-center">
              <EditableText
                isEditable={isEditable}
                element="button"
                value={block.content.buttonText}
                onChange={(buttonText: string) => onUpdate({ ...block.content, buttonText })}
                className="px-10 py-5 text-white font-bold rounded-2xl transition-all shadow-2xl hover:scale-105 active:scale-95 shadow-purple-500/30"
                style={{ backgroundColor: accentColor }}
              />
            </div>
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
        <div className={`max-w-4xl mx-auto prose prose-invert lg:prose-xl prose-purple ${isEditable ? 'ring-1 ring-white/10 p-4 rounded-3xl' : ''}`}>
          {isEditable ? (
            <div className="opacity-50 text-xs mb-4 flex items-center gap-2">
              <QuoteIcon size={12} /> 리치 텍스트는 사이드바 에디터를 이용해주세요.
            </div>
          ) : null}
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      );

    case 'image':
      return (
        <div className="relative group">
          <img 
            src={block.content.url} 
            alt={block.content.alt || ''} 
            className="w-full h-auto rounded-3xl shadow-2xl border border-white/10"
          />
          {isEditable && (
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-3xl">
              <span className="text-white font-bold">이미지 URL은 사이드바에서 수정 가능합니다.</span>
            </div>
          )}
        </div>
      );

    case 'features':
      return (
        <section>
          <div className="text-center mb-20">
            <EditableText
              isEditable={isEditable}
              element="h2"
              value={block.content.title}
              onChange={(title: string) => onUpdate({ ...block.content, title })}
              className="text-2xl md:text-5xl font-black mb-6 tracking-tight"
            />
            {block.content.description && (
              <EditableText
                isEditable={isEditable}
                element="p"
                value={block.content.description}
                onChange={(description: string) => onUpdate({ ...block.content, description })}
                className="opacity-60 max-w-xl mx-auto text-lg"
              />
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {block.content.items?.map((item: any, idx: number) => (
              <div key={idx} className="p-10 rounded-3xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition-all hover:bg-white/10 group">
                <div 
                  style={{ backgroundColor: `${accentColor}20` }}
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform"
                >
                   <Check style={{ color: accentColor }} />
                </div>
                <EditableText
                  isEditable={isEditable}
                  element="h3"
                  value={item.title}
                  onChange={(val: string) => {
                    const newItems = [...block.content.items];
                    newItems[idx].title = val;
                    onUpdate({ ...block.content, items: newItems });
                  }}
                  className="text-xl md:text-2xl font-bold mb-4"
                />
                <EditableText
                  isEditable={isEditable}
                  element="p"
                  value={item.description}
                  onChange={(val: string) => {
                    const newItems = [...block.content.items];
                    newItems[idx].description = val;
                    onUpdate({ ...block.content, items: newItems });
                  }}
                  className="opacity-50 leading-relaxed"
                />
              </div>
            ))}
          </div>
        </section>
      );

    case 'pricing':
      return (
        <section>
          <div className="text-center mb-20">
            <EditableText
              isEditable={isEditable}
              element="h2"
              value={block.content.title}
              onChange={(title: string) => onUpdate({ ...block.content, title })}
              className="text-2xl md:text-5xl font-black mb-6 tracking-tight"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {block.content.plans?.map((plan: any, idx: number) => (
              <div key={idx} 
                className={`p-10 rounded-3xl border transition-all ${plan.popular ? 'scale-105 shadow-2xl' : 'bg-white/5 border-white/10'}`}
                style={plan.popular ? { backgroundColor: accentColor, borderColor: accentColor, boxShadow: `0 25px 50px -12px ${accentColor}33` } : {}}
              >
                <EditableText
                  isEditable={isEditable}
                  element="h3"
                  value={plan.name}
                  onChange={(val: string) => {
                    const newPlans = [...block.content.plans];
                    newPlans[idx].name = val;
                    onUpdate({ ...block.content, plans: newPlans });
                  }}
                  className="text-xl font-bold mb-2"
                />
                <EditableText
                  isEditable={isEditable}
                  element="div"
                  value={plan.price}
                  onChange={(val: string) => {
                    const newPlans = [...block.content.plans];
                    newPlans[idx].price = val;
                    onUpdate({ ...block.content, plans: newPlans });
                  }}
                  className="text-3xl md:text-4xl font-black mb-8"
                />
                <ul className="space-y-4 mb-10 text-left">
                  {plan.features?.filter((f:string) => f.trim() !== '').map((feat: string, fidx: number) => (
                    <li key={fidx} className="flex items-start gap-3 opacity-80">
                      <Check size={18} className="mt-1 shrink-0" style={{ color: plan.popular ? 'white' : accentColor }} />
                      <span className="text-sm leading-relaxed">{feat}</span>
                    </li>
                  ))}
                </ul>
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
                <div style={{ color: accentColor }} className="text-3xl md:text-5xl font-black mb-2 tracking-tighter">{item.value}</div>
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
                  <p className="text-xl md:text-3xl font-medium leading-relaxed mb-8 italic">
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
              <h2 className="text-2xl md:text-4xl font-bold mb-4">{block.content.title || '문의하기'}</h2>
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
      <h2 className="text-2xl md:text-4xl font-bold mb-16 text-center">{content.title || '자주 묻는 질문'}</h2>
      <div className="space-y-4">
        {content.items?.map((item: any, idx: number) => (
          <div key={idx} className="border border-white/10 rounded-3xl overflow-hidden bg-white/5 transition-colors hover:border-white/20">
            <button 
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              className="w-full px-8 py-6 flex items-center justify-between text-left"
            >
              <span className="font-bold text-base md:text-lg">{item.question}</span>
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
