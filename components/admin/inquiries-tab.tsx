'use client';

import { useState } from 'react';
import { Search, Filter, MessageSquare, Clock, CheckCircle2, XCircle } from 'lucide-react';
import type { Inquiry } from '@/lib/types';
import { useAuthStore } from '@/lib/store';

interface InquiriesTabProps {
  inquiries: Inquiry[];
  onSelectInquiry: (inquiry: Inquiry) => void;
}

export default function InquiriesTab({ inquiries, onSelectInquiry }: InquiriesTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'contacted' | 'completed'>('all');
  
  const { user } = useAuthStore();
  const isDark = user?.role === 'owner';

  const theme = {
    input: isDark ? 'bg-white/5 border-white/10 text-white placeholder-gray-500' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 shadow-sm',
    select: isDark ? 'text-white' : 'text-gray-900',
    card: isDark ? 'bg-white/2 border-white/5' : 'bg-white/60 backdrop-blur-xl border-white/40 shadow-xl',
    item: isDark ? 'bg-black/20 border-white/5 hover:bg-white/5' : 'bg-white border-gray-200 hover:bg-purple-50/50 hover:border-purple-200 shadow-sm',
    text: isDark ? 'text-white' : 'text-gray-900',
    textSub: isDark ? 'text-gray-500' : 'text-gray-500',
    textDim: isDark ? 'text-gray-300' : 'text-gray-600',
    avatar: isDark ? 'text-black' : 'text-white', // 
  };

  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesSearch = 
      inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.phone.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || inquiry.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: { label: '대기중', color: isDark ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20' : 'bg-yellow-100 text-yellow-700 border-yellow-200' },
      contacted: { label: '연락완료', color: isDark ? 'bg-blue-500/20 text-blue-400 border-blue-500/20' : 'bg-blue-100 text-blue-700 border-blue-200' },
      completed: { label: '상담완료', color: isDark ? 'bg-green-500/20 text-green-400 border-green-500/20' : 'bg-green-100 text-green-700 border-green-200' },
    };
    const badge = badges[status as keyof typeof badges] || badges.pending;
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${badge.color}`}>
        {badge.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="이름, 이메일, 전화번호로 검색..."
            className={`w-full pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 ${theme.input}`}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className={`px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 ${theme.input}`}
        >
          <option value="all">전체 상태</option>
          <option value="pending">대기중</option>
          <option value="contacted">연락완료</option>
          <option value="completed">상담완료</option>
        </select>
      </div>

      {/* Inquiry List */}
      <div className={`rounded-3xl border p-6 ${theme.card}`}>
        <div className="space-y-4">
          {filteredInquiries.length > 0 ? (
            filteredInquiries.map((inquiry) => (
              <div
                key={inquiry.id}
                onClick={() => onSelectInquiry(inquiry)}
                className={`group flex items-center justify-between rounded-2xl border p-4 transition-all cursor-pointer ${theme.item}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-xs bg-linear-to-br from-gray-700 to-gray-800 text-white shadow-sm`}>
                    {inquiry.name[0]}
                  </div>
                  <div>
                    <div className={`font-bold ${theme.text}`}>{inquiry.name}</div>
                    <div className={`text-xs ${theme.textSub}`}>{inquiry.email} | {inquiry.phone}</div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className={`text-sm font-medium ${theme.textDim}`}>{(inquiry as any).plan || '프로젝트 문의'}</div>
                    <div className={`text-xs ${theme.textSub}`}>{new Date(inquiry.createdAt).toLocaleString()}</div>
                  </div>
                  {getStatusBadge(inquiry.status)}
                </div>
              </div>
            ))
          ) : (
            <div className={`py-12 text-center ${theme.textSub}`}>
              {searchTerm || statusFilter !== 'all' ? '검색 결과가 없습니다.' : '접수된 문의가 없습니다.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
