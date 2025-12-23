'use client';

import { 
  Clock, 
  User, 
  Settings, 
  MessageSquare, 
  LogIn,
  ShieldAlert,
  Edit
} from 'lucide-react';
import { useAuthStore } from '@/lib/store';

export default function ActivityTab() {
  const { user } = useAuthStore();
  const isDark = user?.role === 'owner';

  const theme = {
    card: isDark ? 'bg-white/2 border-white/5' : 'bg-white/60 border-white/40 shadow-xl backdrop-blur-xl',
    textHeader: isDark ? 'text-white' : 'text-gray-900',
    textStrong: isDark ? 'text-gray-200' : 'text-gray-800',
    textWeak: isDark ? 'text-gray-400' : 'text-gray-500',
    border: isDark ? 'border-white/5' : 'border-gray-100',
    timeline: isDark ? 'bg-white/10' : 'bg-gray-200',
    itemHover: isDark ? 'hover:bg-white/5' : 'hover:bg-purple-50/50',
    iconBgBase: isDark ? 'bg-[#0A0A0B]' : 'bg-white', // Timeline line blocker
    button: isDark ? 'text-gray-500 hover:text-white' : 'text-gray-500 hover:text-purple-600',
  };

  const activities = [
    {
      id: 1,
      type: 'reply',
      user: '관리자 (You)',
      action: '문의 답변 발송',
      target: '김철수님의 문의',
      timestamp: '방금 전',
      icon: MessageSquare,
      color: 'text-green-500',
      bg: isDark ? 'bg-green-500/10' : 'bg-green-50 border-green-100'
    },
    {
      id: 2,
      type: 'settings',
      user: '관리자 (You)',
      action: '사이트 설정 변경',
      target: '메인 컬러 및 SEO 정보',
      timestamp: '15분 전',
      icon: Settings,
      color: 'text-purple-500',
      bg: isDark ? 'bg-purple-500/10' : 'bg-purple-50 border-purple-100'
    },
    {
      id: 3,
      type: 'login',
      user: '관리자 (You)',
      action: '관리자 로그인',
      target: '192.168.1.1',
      timestamp: '1시간 전',
      icon: LogIn,
      color: 'text-blue-500',
      bg: isDark ? 'bg-blue-500/10' : 'bg-blue-50 border-blue-100'
    },
    {
      id: 4,
      type: 'inquiry',
      user: 'System',
      action: '새로운 문의 접수',
      target: '이영희님 (팬페이지 제작 문의)',
      timestamp: '2시간 전',
      icon: User,
      color: 'text-yellow-500',
      bg: isDark ? 'bg-yellow-500/10' : 'bg-yellow-50 border-yellow-100'
    },
    {
      id: 5,
      type: 'update',
      user: '관리자 (You)',
      action: '회원 정보 수정',
      target: '프로필 이미지 변경',
      timestamp: '어제',
      icon: Edit,
      color: 'text-gray-400',
      bg: isDark ? 'bg-white/5' : 'bg-gray-100 border-gray-200'
    },
    {
      id: 6,
      type: 'security',
      user: 'System',
      action: '비정상 접근 차단',
      target: 'IP 211.234.xx.xx',
      timestamp: '2일 전',
      icon: ShieldAlert,
      color: 'text-red-500',
      bg: isDark ? 'bg-red-500/10' : 'bg-red-50 border-red-100'
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className={`text-xl font-bold flex items-center gap-2 ${theme.textHeader}`}>
          <Clock className={`h-5 w-5 ${theme.textWeak}`} />
          활동 로그
        </h3>
        <span className={`text-xs ${theme.textWeak}`}>최근 30일간의 활동 내역입니다.</span>
      </div>

      <div className={`rounded-3xl border overflow-hidden ${theme.card}`}>
        <div className="relative">
          {/* Timeline Line */}
          <div className={`absolute left-8 top-0 bottom-0 w-px z-0 ${theme.timeline}`} />

          <div className="space-y-0 z-10 relative">
            {activities.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <div 
                  key={activity.id}
                  className={`flex items-start gap-4 p-6 transition-colors border-b last:border-0 ${theme.itemHover} ${theme.border}`}
                >
                  <div className={`
                    h-10 w-10 flex-shrink-0 rounded-full flex items-center justify-center 
                    border ${theme.border} ${activity.bg} ${activity.color} z-10 ${theme.iconBgBase}
                  `}>
                    <Icon className="h-5 w-5" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className={`font-bold text-sm ${theme.textStrong}`}>
                        {activity.user}
                        <span className={`font-normal mx-2 ${theme.textWeak}`}>•</span>
                        <span className={`font-normal ${theme.textWeak}`}>{activity.action}</span>
                      </p>
                      <time className={`text-xs whitespace-nowrap ${theme.textWeak}`}>{activity.timestamp}</time>
                    </div>
                    <p className={`text-sm truncate ${theme.textWeak}`}>{activity.target}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      <div className="text-center">
        <button className={`text-sm underline-offset-4 hover:underline transition-colors ${theme.button}`}>
          이전 내역 더보기
        </button>
      </div>
    </div>
  );
}
