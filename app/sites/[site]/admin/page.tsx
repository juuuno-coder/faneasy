'use client';

import { use } from 'react';
import DesignEditor from '@/app/admin/influencer/design-editor';
import { useDataStore } from '@/lib/data-store';
import { Layout, Settings, Eye, LogOut } from 'lucide-react';
import Link from 'next/link';

export default function SiteAdminPage({
  params,
}: {
  params: Promise<{ site: string }>;
}) {
  const { site } = use(params);
  const siteSlug = site.toLowerCase().trim();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-900 text-white min-h-screen p-6 hidden md:block">
        <div className="mb-10 text-xl font-black tracking-tight flex items-center gap-2">
          <div className="w-8 h-8 bg-white text-indigo-900 rounded flex items-center justify-center text-xs">F</div>
          FanEasy Admin
        </div>
        
        <nav className="space-y-4">
          <div className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2">Management</div>
          <a href="#" className="flex items-center gap-3 px-4 py-2 bg-indigo-800 rounded-lg">
            <Layout className="h-5 w-5" />
            Page Design
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-2 hover:bg-indigo-800 rounded-lg transition-colors">
            <Settings className="h-5 w-5" />
            Site Settings
          </a>
          
          <div className="pt-10 text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2">View</div>
          <Link href={`/sites/${siteSlug}`} target="_blank" className="flex items-center gap-3 px-4 py-2 hover:bg-indigo-800 rounded-lg transition-colors">
            <Eye className="h-5 w-5" />
            Check Site
          </Link>
          <Link href="/login" className="flex items-center gap-3 px-4 py-2 text-red-300 hover:bg-red-900/20 rounded-lg transition-colors mt-20">
            <LogOut className="h-5 w-5" />
            Logout
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        <header className="mb-10 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-gray-900 uppercase">{siteSlug} 관리자</h1>
            <p className="text-gray-500 mt-1">실시간으로 사이트 콘텐츠를 수정하고 관리하세요.</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">Logged in as {siteSlug}_admin</span>
            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
              {siteSlug[0].toUpperCase()}
            </div>
          </div>
        </header>

        <section className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-100 px-8 py-4 bg-gray-50/50 flex items-center justify-between">
            <h2 className="font-bold text-gray-700 flex items-center gap-2">
              <Layout className="h-4 w-4 text-indigo-500" />
              메인 히어로/콘텐츠 편집
            </h2>
            <span className="text-xs text-gray-400 font-medium">Last updated: Just now</span>
          </div>
          <div className="p-8">
            <DesignEditor subdomain={siteSlug} />
          </div>
        </section>
      </main>
    </div>
  );
}
