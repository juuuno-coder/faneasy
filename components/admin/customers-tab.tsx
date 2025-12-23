'use client';

import { Search, Mail, Phone, Building, Calendar, Download } from 'lucide-react';
import { useState, useMemo } from 'react';
import type { Inquiry } from '@/lib/types';

interface CustomersTabProps {
  inquiries: Inquiry[];
  isDarkMode: boolean;
}

export default function CustomersTab({ inquiries, isDarkMode }: CustomersTabProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const t = {
    bg: isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm',
    itemBg: isDarkMode ? 'bg-white/2 border-white/5' : 'bg-white border-slate-200 shadow-sm',
    tableHeader: isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-b border-slate-200',
    text: isDarkMode ? 'text-white' : 'text-slate-900',
    textMuted: isDarkMode ? 'text-gray-400' : 'text-slate-600',
    textDim: isDarkMode ? 'text-gray-300' : 'text-slate-800',
    input: isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm focus:border-purple-500',
    button: isDarkMode ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 shadow-sm',
  };
  // ... (rest of filtering logic remains same)
  const customers = useMemo(() => {
    const uniqueCustomers = new Map();

    inquiries.forEach((inquiry) => {
      if (!uniqueCustomers.has(inquiry.email)) {
        uniqueCustomers.set(inquiry.email, {
          id: inquiry.id,
          name: inquiry.name,
          email: inquiry.email,
          phone: inquiry.phone,
          company: (inquiry as any).company || '-',
          firstInteraction: inquiry.createdAt,
          totalInquiries: 1,
        });
      } else {
        const existing = uniqueCustomers.get(inquiry.email);
        existing.totalInquiries += 1;
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
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 ${isDarkMode ? 'text-gray-500' : 'text-slate-400'}`} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="고객 이름, 이메일, 전화번호로 검색..."
            className={`w-full pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${t.input}`}
          />
        </div>
        <button 
          onClick={handleExport}
          className={`px-4 py-3 rounded-xl font-bold transition-colors flex items-center gap-2 ${t.button}`}
        >
          <Download className="h-5 w-5" />
          내보내기
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`rounded-2xl p-6 transition-colors border ${t.bg}`}>
          <div className={`${t.textMuted} text-xs mb-1 font-bold uppercase tracking-wider`}>총 고객 수</div>
          <div className={`text-3xl font-bold ${t.text}`}>{customers.length}명</div>
        </div>
        <div className={`rounded-2xl p-6 transition-colors border ${t.bg}`}>
          <div className={`${t.textMuted} text-xs mb-1 font-bold uppercase tracking-wider`}>금월 신규 고객</div>
          <div className="text-3xl font-bold text-green-500">
            {customers.filter(c => new Date(c.firstInteraction).getMonth() === new Date().getMonth()).length}명
          </div>
        </div>
      </div>

      <div className={`rounded-3xl border overflow-hidden transition-colors ${t.bg}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b transition-colors ${t.tableHeader}`}>
                <th className={`px-6 py-5 text-left text-xs font-bold uppercase tracking-wider ${t.textDim}`}>고객명</th>
                <th className={`px-6 py-5 text-left text-xs font-bold uppercase tracking-wider ${t.textDim}`}>이메일</th>
                <th className={`px-6 py-5 text-left text-xs font-bold uppercase tracking-wider ${t.textDim}`}>연락처</th>
                <th className={`px-6 py-5 text-left text-xs font-bold uppercase tracking-wider ${t.textDim}`}>회사/단체</th>
                <th className={`px-6 py-5 text-left text-xs font-bold uppercase tracking-wider ${t.textDim}`}>관심도(문의)</th>
                <th className={`px-6 py-5 text-left text-xs font-bold uppercase tracking-wider ${t.textDim}`}>최초 접속일</th>
              </tr>
            </thead>
            <tbody className={`divide-y transition-colors ${isDarkMode ? 'divide-white/5' : 'divide-gray-100'}`}>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className={`transition-colors ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-purple-50/50'}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-purple-500/20 border border-purple-500/50 flex items-center justify-center font-bold text-purple-500">
                        {customer.name[0]}
                      </div>
                      <span className={`font-bold ${t.text}`}>{customer.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`flex items-center gap-2 font-medium ${t.textDim}`}>
                      <Mail className="h-4 w-4 text-gray-500" />
                      {customer.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`flex items-center gap-2 font-medium ${t.textDim}`}>
                      <Phone className="h-4 w-4 text-gray-500" />
                      {customer.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`flex items-center gap-2 font-medium ${t.textDim}`}>
                      <Building className="h-4 w-4 text-gray-500" />
                      {customer.company}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold border ${isDarkMode ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : 'bg-purple-100 text-purple-700 border-purple-200'}`}>
                      {customer.totalInquiries}회
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`flex items-center gap-2 text-sm ${t.textMuted}`}>
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
          <div className={`py-12 text-center ${t.textMuted}`}>
            검색 결과가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
