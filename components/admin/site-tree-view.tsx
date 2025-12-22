'use client';

import { ChevronRight, ChevronDown, Globe, Users, MessageSquare, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { mockInfluencers, mockFans } from '@/lib/data';

interface SiteTreeViewProps {
  userRole: 'admin' | 'influencer' | 'fan';
  userId?: string;
}

export default function SiteTreeView({ userRole, userId }: SiteTreeViewProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['root']));

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  // Filter data based on user role
  const getFilteredData = () => {
    if (userRole === 'admin') {
      return mockInfluencers;
    } else if (userRole === 'influencer') {
      return mockInfluencers.filter(inf => inf.id === userId);
    }
    return [];
  };

  const influencers = getFilteredData();

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-white/5 bg-white/2 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
            <Globe className="h-5 w-5 text-purple-500" />
          </div>
          <div>
            <h3 className="text-xl font-bold">사이트 구조</h3>
            <p className="text-sm text-gray-400">
              {userRole === 'admin' && '전체 플랫폼 트리 구조'}
              {userRole === 'influencer' && '내 팬페이지 구조'}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {/* Root Node - FanEasy Platform */}
          {userRole === 'admin' && (
            <div className="mb-4">
              <button
                onClick={() => toggleNode('root')}
                className="flex items-center gap-2 w-full p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 transition-colors"
              >
                {expandedNodes.has('root') ? (
                  <ChevronDown className="h-4 w-4 text-purple-400" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-purple-400" />
                )}
                <Globe className="h-5 w-5 text-purple-400" />
                <span className="font-bold text-white">FanEasy Platform</span>
                <span className="ml-auto text-xs text-purple-300 bg-purple-500/20 px-2 py-1 rounded-full">
                  {influencers.length} 인플루언서
                </span>
              </button>
            </div>
          )}

          {/* Influencer Nodes */}
          {expandedNodes.has('root') && influencers.map((influencer) => {
            const influencerFans = mockFans.filter(fan => fan.influencerId === influencer.id);
            const isExpanded = expandedNodes.has(influencer.id);

            return (
              <div key={influencer.id} className="ml-6 space-y-2">
                <button
                  onClick={() => toggleNode(influencer.id)}
                  className="flex items-center gap-2 w-full p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group"
                >
                  {influencerFans.length > 0 && (
                    isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    )
                  )}
                  <div className="h-8 w-8 rounded-full bg-blue-500/20 border border-blue-500/50 flex items-center justify-center font-bold text-blue-400 text-sm">
                    {influencer.name[0]}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-bold text-white">{influencer.name}</div>
                    <div className="text-xs text-gray-500">{influencer.subdomain}.faneasy.kr</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded-full flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {influencerFans.length} 팬
                    </span>
                    <Link
                      href={`/sites/${influencer.subdomain}`}
                      target="_blank"
                      onClick={(e) => e.stopPropagation()}
                      className="p-1.5 hover:bg-white/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                    </Link>
                  </div>
                </button>

                {/* Fan Nodes */}
                {isExpanded && influencerFans.length > 0 && (
                  <div className="ml-6 space-y-2">
                    {influencerFans.map((fan) => (
                      <div
                        key={fan.id}
                        className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group"
                      >
                        <div className="h-6 w-6 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center font-bold text-green-400 text-xs">
                          {fan.name[0]}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-white text-sm">{fan.name}</div>
                          <div className="text-xs text-gray-500">{influencer.subdomain}/{fan.slug}</div>
                        </div>
                        <Link
                          href={`/sites/${influencer.subdomain}/${fan.slug}`}
                          target="_blank"
                          className="p-1.5 hover:bg-white/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <ExternalLink className="h-4 w-4 text-gray-400" />
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {influencers.length === 0 && (
            <div className="py-8 text-center text-gray-500">
              등록된 사이트가 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
