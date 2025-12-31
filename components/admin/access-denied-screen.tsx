'use client';

import { useState } from 'react';
import { useAuthStore } from '@/lib/store';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { firebaseAuth, db } from '@/lib/firebaseClient';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { ShieldAlert, LogIn, Loader2, Home, UserCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface AccessDeniedScreenProps {
  isDarkMode: boolean;
  siteSlug: string;
}

export default function AccessDeniedScreen({ isDarkMode, siteSlug }: AccessDeniedScreenProps) {
  const { user, login } = useAuthStore();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const theme = {
    bg: isDarkMode ? 'bg-[#09090b]' : 'bg-gray-50',
    card: isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-xl',
    text: isDarkMode ? 'text-white' : 'text-slate-900',
    textSub: isDarkMode ? 'text-gray-400' : 'text-slate-500',
    input: isDarkMode ? 'bg-black/20 border-white/10 text-white' : 'bg-white border-gray-200 text-slate-900',
    button: isDarkMode ? 'bg-purple-600 hover:bg-purple-500' : 'bg-purple-600 hover:bg-purple-700',
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const cred = await signInWithEmailAndPassword(firebaseAuth, email, password);
      
      const userRef = doc(db, 'users', cred.user.uid);
      const userDoc = await getDoc(userRef);
      
      let finalUser: any = {
        id: cred.user.uid,
        email: cred.user.email || '',
        name: cred.user.displayName || cred.user.email?.split('@')[0] || 'User',
        role: 'user',
        ...userDoc.data()
      };

      // Force Super Admin for specific emails
      if (['kgw2642@gmail.com', 'designd@designd.co.kr', 'juuuno@naver.com'].includes(cred.user.email || '')) {
        finalUser.role = 'super_admin';
      }

      const token = await cred.user.getIdToken();
      login(finalUser, token);
      
      toast.success('관리자 계정으로 로그인되었습니다.');
      // Page will re-render and check permissions automatically
      
    } catch (error: any) {
      console.error(error);
      toast.error('로그인 실패: ' + (error.message || '정보를 확인해주세요.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${theme.bg}`}>
      <div className={`w-full max-w-md p-8 rounded-2xl border ${theme.card}`}>
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
            <ShieldAlert className="w-8 h-8 text-red-500" />
          </div>
          <h1 className={`text-2xl font-bold mb-2 ${theme.text}`}>접근 권한이 없습니다</h1>
          <p className={`text-sm ${theme.textSub} mb-4`}>
             <span className="font-bold">{siteSlug}</span> 관리자 페이지 접근 권한이<br/>확인되지 않았습니다.
          </p>
          
          {user && (
            <div className={`flex items-center justify-center gap-2 p-3 rounded-lg text-sm ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`}>
                <UserCircle2 className="w-4 h-4" />
                <span className={theme.textSub}>현재 로그인:</span>
                <span className={`font-bold ${theme.text}`}>{user.name}</span>
            </div>
          )}
        </div>

        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div className={`text-xs font-bold uppercase tracking-wider mb-2 ${theme.textSub} border-t ${isDarkMode ? 'border-white/10' : 'border-gray-200'} pt-4`}>
            관리자 계정으로 전환 (로그인)
          </div>
          
          <div>
            <input
              type="email"
              placeholder="관리자 이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full pl-4 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${theme.input} placeholder-gray-500`}
              required
            />
          </div>
          
          <div>
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full pl-4 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${theme.input} placeholder-gray-500`}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 ${theme.button} ${loading ? 'opacity-50' : ''}`}
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogIn className="w-5 h-5" />}
            관리자 ID로 로그인
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-white/5 text-center">
          <button
            onClick={() => router.push('/')}
            className={`text-sm hover:underline flex items-center justify-center gap-2 mx-auto ${theme.textSub}`}
          >
            <Home size={14} />
            홈으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}
