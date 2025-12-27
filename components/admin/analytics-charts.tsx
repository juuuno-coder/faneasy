'use client';

import { useMemo } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar
} from 'recharts';
import { TrendingUp, Users, Globe } from 'lucide-react';

interface AnalyticsChartsProps {
  users: any[];
  sites?: any[];
  isDarkMode: boolean;
}

export default function AnalyticsCharts({ users, sites = [], isDarkMode }: AnalyticsChartsProps) {
  const isDark = isDarkMode;

  const theme = {
    card: isDark ? 'bg-white/5 border-white/5' : 'bg-white border-gray-200 shadow-sm',
    text: isDark ? 'text-white' : 'text-slate-900',
    textMuted: isDark ? 'text-gray-500' : 'text-slate-500',
    grid: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
    accent: '#A855F7', // Purple-500
    accentSecondary: '#3B82F6', // Blue-500
  };

  // Process data for User Growth (Last 7 Days)
  const growthData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
    });

    const dayCounts = last7Days.reduce((acc, date) => ({ ...acc, [date]: 0 }), {} as any);

    users.forEach(u => {
      const date = u.createdAt?.seconds 
        ? new Date(u.createdAt.seconds * 1000).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })
        : null;
      if (date && dayCounts[date] !== undefined) {
        dayCounts[date]++;
      }
    });

    let cumulative = 0;
    return last7Days.map(date => {
      cumulative += dayCounts[date];
      return {
        date,
        newUsers: dayCounts[date],
        totalUsers: cumulative
      };
    });
  }, [users]);

  // Process data for Site Distribution (Super Admin only usually)
  const siteDistributionData = useMemo(() => {
    if (!sites.length) return [];
    
    return sites.map(s => {
      const fanCount = users.filter(u => u.joinedSite === s.id || u.subdomain === s.id).length;
      return {
        name: s.name || s.id,
        fans: fanCount
      };
    }).sort((a, b) => b.fans - a.fans).slice(0, 5); // Top 5 sites
  }, [users, sites]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* User Growth Chart */}
      <div className={`p-6 rounded-3xl border ${theme.card}`}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className={`font-bold flex items-center gap-2 ${theme.text}`}>
              <TrendingUp className="h-4 w-4 text-purple-500" />
              네트워크 성장 추이
            </h3>
            <p className={`text-xs mt-1 ${theme.textMuted}`}>최근 7일간의 신규 팬 가입 현황입니다.</p>
          </div>
          <div className={`px-3 py-1 rounded-full text-[10px] font-bold border ${isDark ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' : 'bg-purple-50 border-purple-100 text-purple-600'}`}>
            LIVE UPDATING
          </div>
        </div>

        <div className="h-[300px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={growthData}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={theme.accent} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={theme.accent} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.grid} />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                className="text-[10px]" 
                stroke={theme.textMuted}
                tick={{ fontSize: 10 }}
                interval="preserveStartEnd"
                minTickGap={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                className="text-[10px]" 
                stroke={theme.textMuted}
                tick={{ fontSize: 10 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: isDark ? '#1A1A1C' : '#FFFFFF',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                  borderRadius: '12px',
                  fontSize: '11px',
                  color: isDark ? '#FFFFFF' : '#000000'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="newUsers" 
                name="신규 팬"
                stroke={theme.accent} 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorUsers)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Site Performance Chart */}
      <div className={`p-6 rounded-3xl border ${theme.card}`}>
         <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className={`font-bold flex items-center gap-2 ${theme.text}`}>
              <Globe className="h-4 w-4 text-blue-500" />
              사이트별 성과 (Top 5)
            </h3>
            <p className={`text-xs mt-1 ${theme.textMuted}`}>팬이 가장 많이 모인 상위 사이트입니다.</p>
          </div>
        </div>

        <div className="h-[300px] w-full mt-4">
           {siteDistributionData.length > 0 ? (
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={siteDistributionData} layout="vertical">
                 <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={theme.grid} />
                 <XAxis type="number" hide />
                 <YAxis 
                   dataKey="name" 
                   type="category" 
                   axisLine={false} 
                   tickLine={false} 
                   width={80}
                   tick={{ fontSize: 11, fontWeight: 'bold' }}
                   stroke={theme.text}
                 />
                 <Tooltip 
                   cursor={{ fill: 'transparent' }}
                   contentStyle={{ 
                    backgroundColor: isDark ? '#1A1A1C' : '#FFFFFF',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                    borderRadius: '12px',
                    fontSize: '11px'
                  }}
                 />
                 <Bar 
                   dataKey="fans" 
                   name="보유 팬"
                   fill={theme.accentSecondary} 
                   radius={[0, 10, 10, 0]}
                   barSize={32}
                 />
               </BarChart>
             </ResponsiveContainer>
           ) : (
             <div className="flex flex-col items-center justify-center h-full gap-4">
                <Users className="h-12 w-12 text-gray-700 opacity-20" />
                <p className={`text-sm ${theme.textMuted}`}>성과를 보여줄 데이터가 충분하지 않습니다.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
