'use client';

import { useState } from 'react';
import { Search, Filter, MessageSquare, Clock, CheckCircle2, XCircle } from 'lucide-react';
import type { Inquiry } from '@/lib/types';

interface InquiriesTabProps {
  inquiries: Inquiry[];
  onSelectInquiry: (inquiry: Inquiry) => void;
}

export default function InquiriesTab({ inquiries, onSelectInquiry }: InquiriesTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'contacted' | 'completed'>('all');

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
      pending: { label: '대기중', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20' },
      contacted: { label: '연락완료', color: 'bg-blue-500/20 text-blue-400 border-blue-500/20' },
      completed: { label: '상담완료', color: 'bg-green-500/20 text-green-400 border-green-500/20' },
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
            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="all">전체 상태</option>
          <option value="pending">대기중</option>
          <option value="contacted">연락완료</option>
          <option value="completed">상담완료</option>
        </select>
      </div>

      {/* Inquiry List */}
      <div className="rounded-3xl border border-white/5 bg-white/2 p-6">
        <div className="space-y-4">
          {filteredInquiries.length > 0 ? (
            filteredInquiries.map((inquiry) => (
              <div
                key={inquiry.id}
                onClick={() => onSelectInquiry(inquiry)}
                className="group flex items-center justify-between rounded-2xl border border-white/5 bg-black/20 p-4 transition-all hover:bg-white/5 cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-linear-to-br from-gray-700 to-gray-800 flex items-center justify-center font-bold text-xs">
                    {inquiry.name[0]}
                  </div>
                  <div>
                    <div className="font-bold text-white">{inquiry.name}</div>
                    <div className="text-xs text-gray-500">{inquiry.email} | {inquiry.phone}</div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-300">{(inquiry as any).plan || '프로젝트 문의'}</div>
                    <div className="text-xs text-gray-500">{new Date(inquiry.createdAt).toLocaleString()}</div>
                  </div>
                  {getStatusBadge(inquiry.status)}
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-gray-500">
              {searchTerm || statusFilter !== 'all' ? '검색 결과가 없습니다.' : '접수된 문의가 없습니다.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
