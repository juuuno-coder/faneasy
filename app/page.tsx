'use client';

import { useDataStore } from "@/lib/data-store";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Globe, Shield, Zap, Menu, Loader2 } from "lucide-react";
import { creators } from "@/lib/data";

export default function Home() {
  const { getPageContent } = useDataStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  // Fetch dynamic content for 'faneasy' root site
  const pageContent = getPageContent('faneasy');
  const heroTitle = pageContent?.heroTitle || "One Platform. Infinite Fandoms.";
  const heroSub = pageContent?.heroDescription || "Create a stunning dedicated page for your favorite celebrity. Manage content, sell memberships, and connect with fans — all under your own unique domain.";
  const ctaText = "Start Your Fanpage";

  return (
    <div className="min-h-screen bg-black text-white selection:bg-purple-500 selection:text-white">
      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="text-xl font-bold tracking-tighter">FanEasy.</div>
          <div className="flex gap-4 items-center">
            <Link
              href="#features"
              className="text-sm font-medium text-gray-400 hover:text-white hidden sm:block"
            >
              Features
            </Link>
            <Link
              href="/login"
              className="px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg text-sm font-medium transition-colors"
            >
              로그인
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 pt-20 text-center">
        <div className="absolute top-1/2 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-600/20 blur-[100px]" />

        <h1 className="mb-6 max-w-4xl text-5xl font-bold tracking-tighter md:text-8xl">
          {heroTitle.includes('.') ? (
            <>
              {heroTitle.split('.')[0]}.<br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-600">
                {heroTitle.split('.')[1]}
              </span>
            </>
          ) : heroTitle}
        </h1>
        <p className="mb-10 max-w-2xl text-lg text-gray-400 md:text-xl">
          {heroSub}
        </p>

        <Link href="/login" className="group flex items-center gap-2 rounded-full bg-white px-8 py-4 text-lg font-bold text-black transition-all hover:bg-gray-200">
          {ctaText}
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </Link>

        {/* Demo Links */}
        <div className="mt-20 w-full max-w-5xl">
          <p className="mb-6 text-sm font-medium text-gray-500 uppercase tracking-widest">
            LIVE DEMO SITES
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {creators.map((c) => (
              <a
                key={c.subdomain}
                href={`http://${c.subdomain}.localhost:3600`}
                className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-6 text-left transition-all hover:-translate-y-1 hover:border-purple-500/50 hover:bg-white/10"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-gray-800 to-black">
                  <span className="font-bold text-white">{c.name[0]}</span>
                </div>
                <h3 className="text-lg font-bold group-hover:text-purple-400">
                  {c.name}
                </h3>
                <p className="text-sm text-gray-400">
                  {c.subdomain}.faneasy.kr
                </p>
                <div className="absolute right-4 top-4 opacity-0 transition-opacity group-hover:opacity-100">
                  <ArrowRight className="h-5 w-5 -rotate-45" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </main>

      {/* Features Grid */}
      <section id="features" className="bg-zinc-900 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="space-y-4 rounded-2xl bg-black p-8 border border-white/5">
              <Globe className="h-8 w-8 text-purple-500" />
              <h3 className="text-xl font-bold">Custom Subdomains</h3>
              <p className="text-gray-400">
                Every fanpage gets its own unique identity like iu.faneasy.kr
                automatically.
              </p>
            </div>
            <div className="space-y-4 rounded-2xl bg-black p-8 border border-white/5">
              <Zap className="h-8 w-8 text-yellow-500" />
              <h3 className="text-xl font-bold">Instant Setup</h3>
              <p className="text-gray-400">
                Launch a fully functional community site in less than 30
                seconds.
              </p>
            </div>
            <div className="space-y-4 rounded-2xl bg-black p-8 border border-white/5">
              <Shield className="h-8 w-8 text-green-500" />
              <h3 className="text-xl font-bold">Managed Security</h3>
              <p className="text-gray-400">
                We handle SSL, hosting, and payments. You focus on the content.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
