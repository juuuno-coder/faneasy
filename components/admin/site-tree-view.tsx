'use client';

import { ChevronRight, ChevronDown, Globe, Users, MessageSquare, ExternalLink, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebaseClient';
import { UserRole } from '@/lib/types';

interface SiteTreeViewProps {
  userRole: UserRole;
  userId?: string;
}

interface UserNode {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  subdomain?: string;
  joinedSite?: string; // Fan joined via this site
  createdAt?: any;
}

export default function SiteTreeView({ userRole, userId }: SiteTreeViewProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['root']));
  const [users, setUsers] = useState<UserNode[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch real data from users collection
  useEffect(() => {
    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedUsers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as UserNode[];
      
      setUsers(fetchedUsers);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  // 1. Get Owners (Sites)
  const owners = users.filter(u => u.role === 'owner' && u.subdomain);
  
  // 2. Filter owners based on logged-in user role
  const filteredOwners = userRole === 'owner' 
    ? owners.filter(o => o.id === userId)
    : owners;

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
      </div>
    );
  }

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
              {(userRole === 'super_admin' || userRole === 'admin') && '전체 플랫폼 트리 구조'}
              {userRole === 'owner' && '내 팬페이지 구조'}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {/* Root Node - FanEasy Platform (Only for Admin) */}
          {(userRole === 'super_admin' || userRole === 'admin') && (
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
                  {filteredOwners.length} 인플루언서
                </span>
              </button>
            </div>
          )}

          {/* Owner Nodes */}
          {(userRole === 'owner' || expandedNodes.has('root')) && filteredOwners.map((owner) => {
            // Find fans who joined this owner's site
            const siteFans = users.filter(u => 
              u.role === 'user' && u.joinedSite === owner.subdomain
            );
            const isExpanded = expandedNodes.has(owner.id);

            return (
              <div key={owner.id} className="ml-6 space-y-2">
                <button
                  onClick={() => toggleNode(owner.id)}
                  className="flex items-center gap-2 w-full p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group"
                >
                  {siteFans.length > 0 ? (
                    isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    )
                  ) : (
                    <span className="w-4" /> // Spacer
                  )}
                  
                  <div className="h-8 w-8 rounded-full bg-blue-500/20 border border-blue-500/50 flex items-center justify-center font-bold text-blue-400 text-sm">
                    {owner.name?.[0] || 'O'}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-bold text-white">{owner.name}</div>
                    <div className="text-xs text-gray-500">{owner.subdomain}.faneasy.kr</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded-full flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {siteFans.length} 팬
                    </span>
                    <Link
                      href={`/sites/${owner.subdomain}`}
                      target="_blank"
                      onClick={(e) => e.stopPropagation()}
                      className="p-1.5 hover:bg-white/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                    </Link>
                  </div>
                </button>

                {/* Fan Nodes (Children) */}
                {isExpanded && siteFans.length > 0 && (
                  <div className="ml-6 space-y-2 relative">
                    {/* Connecting Line */}
                    <div className="absolute left-[-12px] top-0 bottom-4 w-px bg-white/10" />
                    
                    {siteFans.map((fan) => (
                      <div
                        key={fan.id}
                        className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group ml-2 relative"
                      >
                         {/* Horizontal Line */}
                         <div className="absolute left-[-20px] top-1/2 w-4 h-px bg-white/10" />

                        <div className="h-6 w-6 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center font-bold text-green-400 text-xs">
                          {fan.name?.[0] || 'U'}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-white text-sm">{fan.name}</div>
                          <div className="text-xs text-gray-500">{fan.email}</div>
                        </div>
                        
                        {/* 
                          Note: Since user-specific pages logic (slugs) is not securely persisted in DB yet, 
                          we link to generic user page or just show data. 
                          Assuming /sites/[subdomain]/user/[userId] or similar might exist later.
                        */}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {filteredOwners.length === 0 && (
            <div className="py-8 text-center text-gray-500">
              등록된 사이트가 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
