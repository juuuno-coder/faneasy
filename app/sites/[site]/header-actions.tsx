'use client';

import { useAuthStore } from '@/lib/store';
import { useCartStore } from '@/lib/cart-store';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ShoppingBag } from 'lucide-react';

export default function HeaderActions({ site }: { site: string }) {
  const { user } = useAuthStore();
  const { items } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid hydration mismatch by rendering nothing until mounted
  if (!mounted) {
    return (
      <div className="flex items-center gap-4">
        <div className="w-16 h-8 bg-white/5 rounded animate-pulse" />
        <div className="w-24 h-9 bg-white/10 rounded-full animate-pulse" />
      </div>
    );
  }

  // Determine if we are on a subdomain to handle links correctly
  const getSiteLink = (path: string) => {
    if (typeof window !== 'undefined') {
       const host = window.location.hostname;
       // If hostname is exactly the site or ends with the site subdomain patterns, and NOT localhost/www
       const isSubdomain = (host.includes('faneasy.kr') || host.includes('designd.co.kr')) && !host.startsWith('www.') && !host.includes('localhost');
       if (isSubdomain) return path;
    }
    return `/sites/${site}${path}`;
  };

  return (
    <div className="flex items-center gap-4">
      {items.length > 0 && (
            <Link 
                href={getSiteLink('/cart')}
                className="relative p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all"
            >
                <ShoppingBag className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-4 h-4 bg-purple-600 text-[10px] text-white flex items-center justify-center rounded-full border border-black">
                    {items.length}
                </span>
            </Link>
        )}


      {user ? (
        <>
          {/* Admin Dashboard Link - Only for Super Admins, Admins, or the Site Owner (Email-based matching as requested) */}
          {(
            user.role === 'super_admin' || 
            user.role === 'admin' || 
            (user.role === 'owner' && (user as any).subdomain === site) || 
            ['kgw2642@gmail.com', 'juuuno@naver.com', 'designd@designd.co.kr', 'duscontactus@gmail.com'].includes(user.email)
          ) && (
            <Link 
              href="/admin" 
              className="text-sm font-bold text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              관리자
            </Link>
          )}
          <Link 
            href={getSiteLink('/mypage')} 
            className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
          >
            마이페이지
          </Link>
        </>
      ) : (
        <>
          <Link 
            href="/login" 
            className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
          >
            로그인
          </Link>
          <Link 
            href="/login?mode=signup" 
            className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
          >
            회원가입
          </Link>
        </>
      )}
      
      <a 
        href="#contact" 
        className="rounded-full bg-white px-5 py-2 text-sm font-bold text-black transition-all hover:bg-gray-200 active:scale-95"
      >
        상담 신청
      </a>
    </div>
  );
}
