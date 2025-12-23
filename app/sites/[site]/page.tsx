import { getCreator } from "@/lib/data";
import { getLiveNews } from "@/lib/news";
import { notFound } from "next/navigation";
import {
  Heart,
  MessageCircle,
  Share2,
  Newspaper,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";
import HeaderActions from "./header-actions";
import ViewTracker from "@/components/analytics/view-tracker";
import AgencyLandingPage from "./agency-landing-page";
import TechMarketing from "./tech-marketing";
import GrowthMarketing from "./growth-marketing";
import MZMarketing from "./mz-marketing";
import type { Metadata, ResolvingMetadata } from 'next';

export async function generateMetadata(
  { params }: { params: Promise<{ site: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { site } = await params;
  const siteSlug = site.toLowerCase().trim();
  const creator = getCreator(siteSlug);

  if (!creator) return {};

  const title = site === 'kkang' ? '깡대표 x 디어스 | 프리미엄 랜딩페이지' : `${creator.name} 공식 팬페이지`;
  const description = site === 'kkang' 
    ? '빠르게 사업을 시작하는 프리미엄 랜딩페이지' 
    : creator.bio;
  const ogImage = site === 'kkang' ? '/og-kkang.png' : creator.image;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [ogImage],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

import ThemeWrapper from "./theme-wrapper";

export default async function SitePage({
  params,
}: {
  params: Promise<{ site: string }>;
}) {
  const { site } = await params;
  const siteSlug = site.toLowerCase().trim();
  const creator = getCreator(siteSlug);
  
  // Custom Live News: Fetch specific news for the site if available, otherwise generic
  const news = await getLiveNews(siteSlug);

  if (!creator) {
    notFound();
  }

  // If it's bizon, show the BizonMarketing Landing Page
  if (siteSlug === "bizon") {
    const BizonMarketing = (await import("./bizon-marketing")).default;
    return (
      <>
        <ThemeWrapper site={siteSlug} />
        <ViewTracker siteId={siteSlug} />
        <BizonMarketing site={siteSlug} />
      </>
    );
  }

  // If it's kkang, show the Agency Landing Page
  if (siteSlug === "kkang") {
    return (
      <>
        <ThemeWrapper site={siteSlug} />
        <ViewTracker siteId={siteSlug} />
        <AgencyLandingPage site={siteSlug} />
      </>
    );
  }

  // Custom Design for 'fan1' (MZ Marketing Reference)
  if (siteSlug === "fan1") {
    return (
      <>
        <ThemeWrapper site={siteSlug} />
        <ViewTracker siteId={siteSlug} />
        <MZMarketing site={siteSlug} />
      </>
    );
  }
 
  // Custom Design for 'fan2' (Growth Marketing - Bburi Theme)
  if (siteSlug === "fan2") {
    return (
      <>
        <ThemeWrapper site={siteSlug} />
        <ViewTracker siteId={siteSlug} />
        <GrowthMarketing site={siteSlug} />
      </>
    );
  }

  // Custom Design for 'fan3' (AD-TECH Solution - DDMKT Theme)
  if (siteSlug === "fan3") {
    return (
      <>
        <ThemeWrapper site={siteSlug} />
        <ViewTracker siteId={siteSlug} />
        <TechMarketing site={siteSlug} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      <ThemeWrapper site={siteSlug} />
      {/* Hero Section */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/50 to-black z-10" />
        <Image
          src={creator.image}
          alt={creator.name}
          width={1920}
          height={1080}
          priority
          className="h-full w-full object-cover opacity-80 scale-105 animate-slow-zoom"
        />

        <div className="absolute bottom-0 left-0 z-20 w-full p-8 md:p-12">
          <div className="mx-auto max-w-4xl space-y-4">
            <span className="inline-block rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-md">
              Official Fan Page
            </span>
            <div className="flex items-end justify-between">
              <div>
                <h1 className="text-6xl font-black uppercase tracking-tighter md:text-8xl">
                  {creator.name}
                </h1>
                <p className="mt-4 max-w-xl text-lg text-gray-300 md:text-xl">
                  {creator.bio}
                </p>
              </div>
              <div className="hidden text-right md:block">
                <div className="text-4xl font-bold">{creator.stats.fans}</div>
                <div className="text-sm text-gray-400">Monthly Visitors</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* Quick Actions */}
        <div className="mb-12 flex flex-wrap gap-4">
          <button className="flex-1 rounded-2xl bg-white py-4 text-center font-bold text-black transition-transform hover:scale-[1.02] active:scale-95">
            <Heart className="mx-auto mb-1 h-5 w-5" />
            Join Fan Club
          </button>
          <button className="flex-1 rounded-2xl bg-[#1A1A1A] py-4 text-center font-bold text-white transition-transform hover:bg-[#2A2A2A] active:scale-95">
            <MessageCircle className="mx-auto mb-1 h-5 w-5" />
            Community
          </button>
          <button className="flex-1 rounded-2xl bg-[#1A1A1A] py-4 text-center font-bold text-white transition-transform hover:bg-[#2A2A2A] active:scale-95">
            <Share2 className="mx-auto mb-1 h-5 w-5" />
            Share
          </button>
        </div>

        {/* Live News Feed */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-2xl font-bold">
              <Newspaper className="h-5 w-5 text-gray-500" />
              Live Updates
            </h2>
            <span className="flex items-center gap-1 text-xs text-green-500">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
              </span>
              Real-time
            </span>
          </div>

          <div className="space-y-4">
            {news.map((item) => (
              <a
                href={item.url}
                key={item.id}
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-2xl border border-white/10 bg-[#111] p-6 transition-all hover:bg-[#1A1A1A] hover:border-white/20"
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="text-lg font-bold leading-snug group-hover:text-blue-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm text-gray-400 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="mt-4 flex items-center gap-3 text-xs text-gray-500">
                      <span>{item.source}</span>
                      <span>•</span>
                      <span>{item.date}</span>
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-gray-600 group-hover:text-white transition-colors" />
                </div>
              </a>
            ))}
          </div>
        </section>
      </div>

      <HeaderActions site={siteSlug} />
    </div>
  );
}
