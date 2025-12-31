'use client';

import { useState, useEffect } from 'react';
import { 
  Clock, 
  User, 
  Settings, 
  MessageSquare, 
  LogIn,
  ShieldAlert,
  Edit,
  Package
} from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { db } from '@/lib/firebaseClient';
import { collection, query, orderBy, limit, onSnapshot, where } from 'firebase/firestore';
import { ActivityLog } from '@/lib/types';

interface ActivityTabProps {
  isDarkMode: boolean;
}

const getIcon = (type: string) => {
  switch (type) {
    case 'reply': return MessageSquare;
    case 'settings': return Settings;
    case 'login': return LogIn;
    case 'inquiry': return User;
    case 'update': return Edit;
    case 'security': return ShieldAlert;
    case 'order': return Package;
    default: return Clock;
  }
};

const getColor = (type: string, isDark: boolean) => {
  switch (type) {
    case 'reply': return { color: 'text-green-500', bg: isDark ? 'bg-green-500/10' : 'bg-green-50 border-green-100' };
    case 'settings': return { color: 'text-purple-500', bg: isDark ? 'bg-purple-500/10' : 'bg-purple-50 border-purple-100' };
    case 'login': return { color: 'text-blue-500', bg: isDark ? 'bg-blue-500/10' : 'bg-blue-50 border-blue-100' };
    case 'inquiry': return { color: 'text-yellow-500', bg: isDark ? 'bg-yellow-500/10' : 'bg-yellow-50 border-yellow-100' };
    case 'update': return { color: 'text-gray-400', bg: isDark ? 'bg-white/5' : 'bg-gray-100 border-gray-200' };
    case 'security': return { color: 'text-red-500', bg: isDark ? 'bg-red-500/10' : 'bg-red-50 border-red-100' };
    case 'order': return { color: 'text-emerald-500', bg: isDark ? 'bg-emerald-500/10' : 'bg-emerald-50 border-emerald-100' };
    default: return { color: 'text-gray-400', bg: isDark ? 'bg-white/5' : 'bg-gray-50' };
  }
};

export default function ActivityTab({ isDarkMode }: ActivityTabProps) {
  const { user } = useAuthStore();
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const isDark = isDarkMode;

  useEffect(() => {
    if (!user) return;

    let q = query(
      collection(db, 'activity_logs'),
      limit(50) // Increased limit since we sort locally
    );

    // If not super_admin, only see logs for their subdomain
    if (user.role !== 'super_admin' && user.subdomain) {
      q = query(
        collection(db, 'activity_logs'),
        where('subdomain', '==', user.subdomain),
        limit(50)
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const logs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ActivityLog[];
      
      // Client-side Sort
      logs.sort((a, b) => {
        const timeA = new Date(a.timestamp).getTime();
        const timeB = new Date(b.timestamp).getTime();
        return timeB - timeA;
      });

      setActivities(logs);
      setLoading(false);
    }, (error) => {
      console.error("Activity Log Listen Error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const theme = {
    card: isDark ? 'bg-white/2 border-white/5' : 'bg-white border-gray-200 shadow-sm',
    textHeader: isDark ? 'text-white' : 'text-slate-900',
    textStrong: isDark ? 'text-gray-200' : 'text-slate-800',
    textWeak: isDark ? 'text-gray-400' : 'text-slate-500',
    border: isDark ? 'border-white/5' : 'border-gray-100',
    timeline: isDark ? 'bg-white/10' : 'bg-gray-100',
    itemHover: isDark ? 'hover:bg-white/5' : 'hover:bg-purple-50/50',
    iconBgBase: isDark ? 'bg-[#0A0A0B]' : 'bg-white', // Timeline line blocker
    button: isDark ? 'text-gray-500 hover:text-white' : 'text-gray-500 hover:text-purple-600',
  };

  if (loading) {
    return <div className={`py-20 text-center ${theme.textWeak}`}>활동로그를 불러오고 있습니다...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className={`text-xl font-bold flex items-center gap-2 ${theme.textHeader}`}>
          <Clock className={`h-5 w-5 ${theme.textWeak}`} />
          활동 로그
        </h3>
        <span className={`text-xs ${theme.textWeak}`}>최근 활동 내역입니다.</span>
      </div>

      <div className={`rounded-3xl border overflow-hidden ${theme.card}`}>
        <div className="relative">
          {/* Timeline Line */}
          <div className={`absolute left-8 top-0 bottom-0 w-px z-0 ${theme.timeline}`} />

          <div className="space-y-0 z-10 relative">
            {activities.length > 0 ? (
              activities.map((activity) => {
                const Icon = getIcon(activity.type);
                const styles = getColor(activity.type, isDark);
                return (
                  <div 
                    key={activity.id}
                    className={`flex items-start gap-4 p-6 transition-colors border-b last:border-0 ${theme.itemHover} ${theme.border}`}
                  >
                    <div className={`
                      h-10 w-10 flex-shrink-0 rounded-full flex items-center justify-center 
                      border ${theme.border} ${styles.bg} ${styles.color} z-10 ${theme.iconBgBase}
                    `}>
                      <Icon className="h-5 w-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className={`font-bold text-sm ${theme.textStrong}`}>
                          {activity.userName} ({activity.userEmail})
                          <span className={`font-normal mx-2 ${theme.textWeak}`}>•</span>
                          <span className={`font-normal ${theme.textWeak}`}>{activity.action}</span>
                        </p>
                        <time className={`text-xs whitespace-nowrap ${theme.textWeak}`}>
                          {new Date(activity.timestamp).toLocaleString('ko-KR', {
                             month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                          })}
                        </time>
                      </div>
                      <p className={`text-sm truncate ${theme.textWeak}`}>{activity.target}</p>
                    </div>
                  </div>
                );
              })
            ) : (
                <div className={`py-20 text-center ${theme.textWeak}`}>활동 기록이 없습니다.</div>
            )}
          </div>
        </div>
      </div>
      
      {activities.length >= 20 && (
        <div className="text-center">
            <button className={`text-sm underline-offset-4 hover:underline transition-colors ${theme.button}`}>
            이전 내역 더보기
            </button>
        </div>
      )}
    </div>
  );
}
