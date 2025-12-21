'use client';

import { Home, LayoutGrid, CreditCard, MessageSquare, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function MobileBottomNav({ site }: { site: string }) {
  const pathname = usePathname();

  const navItems = [
    { label: '홈', icon: Home, href: `/` },
    { label: '요금제', icon: CreditCard, href: `#pricing` },
    { label: '템플릿', icon: LayoutGrid, href: `#references` }, // Links to TemplateShowcase
    { label: '문의', icon: MessageSquare, href: `#contact` },
    { label: '마이', icon: User, href: `/mypage` },
  ];

  return (
    <div className="fixed bottom-0 left-0 z-[100] w-full border-t border-white/5 bg-black/80 p-2 backdrop-blur-xl md:hidden">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 rounded-xl px-4 py-2 transition-all active:scale-90",
                isActive ? "text-purple-500" : "text-gray-500 hover:text-white"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
