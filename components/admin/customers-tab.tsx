'use client';

import { Search, Mail, Phone, Building, Calendar, Download } from 'lucide-react';
import { useState, useMemo } from 'react';
import type { Inquiry } from '@/lib/types';

interface CustomersTabProps {
  inquiries: Inquiry[];
}

export default function CustomersTab({ inquiries }: CustomersTabProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Extract unique customers from inquiries
  const customers = useMemo(() => {
    const uniqueCustomers = new Map();

    inquiries.forEach((inquiry) => {
      if (!uniqueCustomers.has(inquiry.email)) {
        uniqueCustomers.set(inquiry.email, {
          id: inquiry.id, // Use the first inquiry ID as a proxy ID
          name: inquiry.name,
          email: inquiry.email,
          phone: inquiry.phone,
          company: (inquiry as any).company || '-',
          firstInteraction: inquiry.createdAt,
          totalInquiries: 1,
        });
      } else {
        // Update existing customer stats
        const existing = uniqueCustomers.get(inquiry.email);
        existing.totalInquiries += 1;
        // Keep the earliest date as 'firstInteraction' or update 'lastInteraction' if we had that field
      }
    });

    return Array.from(uniqueCustomers.values());
  }, [inquiries]);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  const handleExport = () => {
    // CSV Export Logic
    const headers = ['이름', '이메일', '연락처', '회사/단체', '최초 문의일', '총 문의 수'];
    const csvContent = [
      headers.join(','),
      ...filteredCustomers.map(c => 
        [c.name, c.email, c.phone, c.company, new Date(c.firstInteraction).toLocaleDateString(), c.totalInquiries].join(',')
      )
    ].join('\n');

    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `customers_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Search Bar & Export */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="고객 이름, 이메일, 전화번호로 검색..."
            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <button 
          onClick={handleExport}
          className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-colors flex items-center gap-2"
        >
          <Download className="h-5 w-5" />
          내보내기
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <div className="text-gray-400 text-sm mb-1">총 고객 수</div>
          <div className="text-2xl font-bold">{customers.length}명</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <div className="text-gray-400 text-sm mb-1">금월 신규 고객</div>
          <div className="text-2xl font-bold text-green-400">
            {customers.filter(c => new Date(c.firstInteraction).getMonth() === new Date().getMonth()).length}명
          </div>
        </div>
      </div>

      {/* Customer List */}
      <div className="rounded-3xl border border-white/5 bg-white/2 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">고객명</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">이메일</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">연락처</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">회사/단체</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">관심도(문의)</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">최초 접속일</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-purple-500/20 border border-purple-500/50 flex items-center justify-center font-bold text-purple-500">
                        {customer.name[0]}
                      </div>
                      <span className="font-medium text-white">{customer.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-300">
                      <Mail className="h-4 w-4 text-gray-500" />
                      {customer.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-300">
                      <Phone className="h-4 w-4 text-gray-500" />
                      {customer.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-300">
                      <Building className="h-4 w-4 text-gray-500" />
                      {customer.company}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs font-bold border border-purple-500/30">
                      {customer.totalInquiries}회
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <Calendar className="h-4 w-4" />
                      {new Date(customer.firstInteraction).toLocaleDateString()}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCustomers.length === 0 && (
          <div className="py-12 text-center text-gray-500">
            검색 결과가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
