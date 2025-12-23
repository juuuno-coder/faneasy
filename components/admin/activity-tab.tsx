'use client';

import { 
  Clock, 
  User, 
  Settings, 
  MessageSquare, 
  LogOut, 
  LogIn,
  ShieldAlert,
  Edit
} from 'lucide-react';

export default function ActivityTab() {
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
      bg: 'bg-green-500/10'
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
      bg: 'bg-purple-500/10'
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
      bg: 'bg-blue-500/10'
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
      bg: 'bg-yellow-500/10'
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
      bg: 'bg-white/5'
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
      bg: 'bg-red-500/10'
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Clock className="h-5 w-5 text-gray-400" />
          활동 로그
        </h3>
        <span className="text-xs text-gray-500">최근 30일간의 활동 내역입니다.</span>
      </div>

      <div className="rounded-3xl border border-white/5 bg-white/2 overflow-hidden">
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-white/10 z-0" />

          <div className="space-y-0 z-10 relative">
            {activities.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <div 
                  key={activity.id}
                  className="flex items-start gap-4 p-6 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                >
                  <div className={`
                    h-10 w-10 flex-shrink-0 rounded-full flex items-center justify-center 
                    border border-white/5 ${activity.bg} ${activity.color} z-10 bg-[#1A1A1A]
                  `}>
                    <Icon className="h-5 w-5" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-bold text-sm text-gray-200">
                        {activity.user}
                        <span className="font-normal text-gray-500 mx-2">•</span>
                        <span className="text-gray-400 font-normal">{activity.action}</span>
                      </p>
                      <time className="text-xs text-gray-500 whitespace-nowrap">{activity.timestamp}</time>
                    </div>
                    <p className="text-sm text-gray-400 truncate">{activity.target}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      <div className="text-center">
        <button className="text-sm text-gray-500 hover:text-white hover:underline transition-colors">
          이전 내역 더보기
        </button>
      </div>
    </div>
  );
}
