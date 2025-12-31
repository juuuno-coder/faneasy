'use client';

import { useState } from 'react';
import { db } from '@/lib/firebaseClient';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { Loader2, CheckCircle, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function FixUsersPage() {
  const [status, setStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');
  const [logs, setLogs] = useState<string[]>([]);
  
  // Form State
  const [targetSite, setTargetSite] = useState('kkang.designd.co.kr');
  const [targetUserIds, setTargetUserIds] = useState('');

  const addLog = (msg: string) => setLogs(prev => [...prev, `${new Date().toLocaleTimeString()} - ${msg}`]);

  const runUserFix = async () => {
    if (!targetSite || !targetUserIds) {
        alert('사이트 주소와 유저 ID(UID)들을 입력해주세요.');
        return;
    }

    setStatus('running');
    setLogs([]);
    addLog(`🚀 유저 데이터 복구 시작: Target Site -> ${targetSite}`);

    const userIds = targetUserIds.split(/[\n,]+/).map(id => id.trim()).filter(id => id);
    addLog(`총 ${userIds.length}명의 유저를 처리합니다.`);

    try {
      for (const uid of userIds) {
        addLog(`Processing user: ${uid}...`);
        const userRef = doc(db, 'users', uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            addLog(`⚠️ WARNING: User ${uid} does not exist in Firestore 'users' collection. Creating basic record...`);
            // If it doesn't exist, we might want to create it if we have more info, 
            // but for now let's just update if exists.
            // Actually, let's create a minimal record so they show up.
            await setDoc(userRef, {
                id: uid,
                joinedSite: targetSite,
                role: 'user',
                updatedAt: new Date(),
                createdAt: new Date(),
                note: `Automatically registered to ${targetSite} via fix tool`
            }, { merge: true });
            addLog(`✅ SUCCESS: Created & Linked user ${uid} to ${targetSite}`);
            continue;
        }

        await updateDoc(userRef, {
            joinedSite: targetSite,
            updatedAt: new Date(),
            note: `Manually linked to ${targetSite} by Admin Fix Tool`
        });
        addLog(`✅ SUCCESS: Linked existing user ${uid} to ${targetSite}`);
      }

      setStatus('success');
      addLog('--- 모든 작업이 성공적으로 완료되었습니다 ---');

    } catch (error: any) {
      console.error(error);
      addLog(`❌ CRITICAL ERROR: ${error.message}`);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 p-8 flex items-center justify-center font-sans">
      <div className="w-full max-w-2xl border border-gray-200 rounded-2xl p-8 bg-white shadow-2xl">
        <h1 className="text-2xl font-bold mb-2 flex items-center gap-2 text-purple-600">
            <ShieldCheck className="w-7 h-7" /> 회원 데이터 복구 도구
        </h1>
        <p className="text-gray-500 text-sm mb-8">특정 유저들을 특정 사이트의 회원 목록으로 강제 할당합니다.</p>

        <div className="mb-8 space-y-6">
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">대상 사이트 (Subdomain/Domain)</label>
                <input 
                    type="text" 
                    value={targetSite}
                    onChange={e => setTargetSite(e.target.value)}
                    placeholder="e.g. kkang.designd.co.kr"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-purple-500 transition-colors"
                />
            </div>

            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">유저 UID 목록 (엔터 또는 쉼표 구분)</label>
                <textarea 
                    value={targetUserIds}
                    onChange={e => setTargetUserIds(e.target.value)}
                    placeholder="UID를 입력하세요. 예: n9cWBeg9L6OkLUqzJXkwP2GmAqv2..."
                    className="w-full h-48 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-purple-500 transition-colors font-mono text-sm"
                />
                <p className="mt-2 text-xs text-gray-400">
                    * 파이어베이스 Authentication 탭의 '사용자 UID' 열 값을 복사해서 넣어주세요.
                </p>
            </div>
        </div>

        {status === 'idle' || status === 'success' || status === 'error' ? (
            <button 
                onClick={runUserFix}
                className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
            >
                <ArrowRight className="w-5 h-5" />
                회원 데이터 업데이트 실행
            </button>
        ) : (
            <div className="w-full py-4 bg-gray-100 text-gray-400 font-bold rounded-xl flex items-center justify-center gap-2 cursor-wait font-sans">
                <Loader2 className="animate-spin w-5 h-5" />
                처리 중... 잠시만 기다려주세요.
            </div>
        )}

        {/* Console Output */}
        <div className="mt-8 bg-slate-900 rounded-xl p-4 h-64 overflow-y-auto border border-slate-800 text-xs font-mono">
            {logs.length === 0 ? (
                <span className="text-gray-600 select-none">작업 대기 중... 로그가 여기에 표시됩니다.</span>
            ) : (
                logs.map((log, i) => (
                    <div key={i} className={`mb-1 pb-1 border-b border-slate-800 last:border-0 ${
                        log.includes('❌') || log.includes('ERROR') ? 'text-red-400' : 
                        log.includes('✅') || log.includes('SUCCESS') ? 'text-green-400' : 
                        log.includes('⚠️') ? 'text-amber-400' : 'text-slate-400'
                    }`}>
                        {log}
                    </div>
                ))
            )}
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <Link href="/admin" className="text-sm font-bold text-gray-400 hover:text-purple-600 transition-colors">
                어드민 대시보드로 돌아가기
            </Link>
        </div>
      </div>
    </div>
  );
}
