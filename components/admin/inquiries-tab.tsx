'use client';

import { useState } from 'react';
import { Search, Filter, MessageSquare, Clock, CheckCircle2, XCircle, Download, Copy } from 'lucide-react';
import type { Inquiry } from '@/lib/types';
import { useAuthStore } from '@/lib/store';
import { toast } from 'react-hot-toast';

interface InquiriesTabProps {
  inquiries: Inquiry[];
  onSelectInquiry: (inquiry: Inquiry) => void;
  isDarkMode: boolean;
}

export default function InquiriesTab({ inquiries, onSelectInquiry, isDarkMode }: InquiriesTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'contacted' | 'completed'>('all');
  
  const isDark = isDarkMode;

  const theme = {
    input: isDark ? 'bg-white/5 border-white/10 text-white placeholder-gray-500' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 shadow-sm',
    select: isDark ? 'text-white' : 'text-gray-900',
    card: isDark ? 'bg-white/2 border-white/5' : 'bg-white border-gray-200 shadow-sm',
    item: isDark ? 'bg-black/20 border-white/5 hover:bg-white/5' : 'bg-white border-gray-100 hover:bg-purple-50/50 hover:border-purple-200',
    text: isDark ? 'text-white' : 'text-gray-900',
    textSub: isDark ? 'text-gray-500' : 'text-gray-500',
    textDim: isDark ? 'text-gray-300' : 'text-gray-600',
    avatar: isDark ? 'text-black' : 'text-white',
    badge: isDark ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : 'bg-purple-100 text-purple-600 border-purple-200',
  };

  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesSearch = 
      inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.phone.includes(searchTerm) ||
      ((inquiry as any).siteDomain || '').toLowerCase().includes(searchTerm.toLowerCase()); // Search by site
    
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

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} 복사되었습니다.`);
  };

  const exportToCSV = () => {
    const listToExport = filteredInquiries;
    const headers = ["Name", "Email", "Phone", "Status", "Plan", "Site", "Created At"];
    const rows = listToExport.map(inq => [
      inq.name,
      inq.email,
      inq.phone,
      inq.status,
      (inq as any).plan || "-",
      (inq as any).siteDomain || "-",
      new Date(inq.createdAt).toISOString()
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `faneasy_inquiries_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV 파일이 생성되었습니다.");
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="이름, 검색어, 사이트 도메인 검색..."
            className={`w-full pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 ${theme.input}`}
          />
        </div>
        <div className="flex gap-2">
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
            <button 
                onClick={exportToCSV}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold border transition-all ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white' : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-700 shadow-sm'}`}
            >
                <Download size={18} />
                <span className="hidden sm:inline">CSV 추출</span>
            </button>
        </div>
      </div>

      {/* Inquiry List */}
      <div className={`rounded-3xl border p-6 ${theme.card}`}>
        <div className="space-y-4">
          {filteredInquiries.length > 0 ? (
            filteredInquiries.map((inquiry) => (
              <div
                key={inquiry.id}
                onClick={() => onSelectInquiry(inquiry)}
                className={`group flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-2xl border p-4 transition-all cursor-pointer gap-4 ${theme.item}`}
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-xs bg-linear-to-br from-gray-700 to-gray-800 text-white shadow-sm shrink-0`}>
                    {inquiry.name[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                         <div className={`font-bold truncate ${theme.text}`}>{inquiry.name}</div>
                         {/* Site Badge */}
                         {(inquiry as any).siteDomain && (
                             <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase border ${theme.badge}`}>
                                {(inquiry as any).siteDomain}
                             </span>
                         )}
                    </div>
                    <div className={`text-xs truncate ${theme.textSub} flex items-center gap-2 mt-1`}>
                      <span className="hover:text-purple-500 cursor-pointer" onClick={(e) => { e.stopPropagation(); copyToClipboard(inquiry.email, '이메일이'); }}>{inquiry.email}</span>
                      <span className="opacity-30">|</span>
                      <span className="hover:text-purple-500 cursor-pointer" onClick={(e) => { e.stopPropagation(); copyToClipboard(inquiry.phone, '연락처가'); }}>{inquiry.phone}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                  <div className="text-left sm:text-right">
                    <div className={`text-sm font-medium ${theme.textDim}`}>{(inquiry as any).plan || '프로젝트 문의'}</div>
                    <div className={`text-[10px] sm:text-xs ${theme.textSub}`}>{new Date(inquiry.createdAt).toLocaleString()}</div>
                  </div>
                  {getStatusBadge(inquiry.status)}
                </div>
              </div>
            ))
          ) : (
            <div className={`py-12 text-center ${theme.textSub}`}>
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-10" />
              {searchTerm || statusFilter !== 'all' ? '검색 결과가 없습니다.' : '접수된 문의가 없습니다.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
