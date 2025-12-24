'use client';

import { useState } from 'react';
import { db } from '@/lib/firebaseClient';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Loader2, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function FixDataPage() {
  const [status, setStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');
  const [logs, setLogs] = useState<string[]>([]);
  
  // Form State
  const [targetEmail, setTargetEmail] = useState('');
  const [targetInquiryIds, setTargetInquiryIds] = useState('');

  const addLog = (msg: string) => setLogs(prev => [...prev, `${new Date().toLocaleTimeString()} - ${msg}`]);

  const runManualFix = async () => {
    if (!targetEmail || !targetInquiryIds) {
        alert('이메일과 문의 ID를 모두 입력해주세요.');
        return;
    }

    setStatus('running');
    setLogs([]);
    addLog(`Starting manual link to Email: ${targetEmail}`);

    const inquiryIds = targetInquiryIds.split(',').map(id => id.trim()).filter(id => id);

    try {
      for (const inqId of inquiryIds) {
        addLog(`Checking inquiry ${inqId}...`);
        const inqRef = doc(db, 'inquiries', inqId);
        const inqSnap = await getDoc(inqRef);

        if (!inqSnap.exists()) {
            addLog(`ERROR: Inquiry ${inqId} does not exist in Firestore! Skipping.`);
            continue;
        }

        const currentData = inqSnap.data();
        addLog(`Found Inquiry. Current Email: ${currentData.email || '(none)'}`);

        await updateDoc(inqRef, {
            email: targetEmail,
            updatedAt: new Date().toISOString(),
            note: `Manually linked to ${targetEmail} by Admin Tool`
        });
        addLog(`SUCCESS: Updated ${inqId} -> ${targetEmail}`);
      }

      setStatus('success');
      addLog('--- Operation Completed ---');

    } catch (error: any) {
      console.error(error);
      addLog(`CRITICAL ERROR: ${error.message}`);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 font-mono flex items-center justify-center">
      <div className="w-full max-w-2xl border border-white/20 rounded-2xl p-8 bg-[#111]">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2 text-purple-400">
            <span className="text-2xl">🔧</span> Manual Inquiry Linker
        </h1>

        <div className="mb-8 space-y-4">
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Target User Email</label>
                <input 
                    type="email" 
                    value={targetEmail}
                    onChange={e => setTargetEmail(e.target.value)}
                    placeholder="user@example.com (연결할 회원의 이메일)"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                />
                <p className="mt-1 text-xs text-gray-600">* 해당 회원의 마이페이지 계정 이메일을 입력하세요.</p>
            </div>

            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Inquiry IDs (Comma Separated)</label>
                <textarea 
                    value={targetInquiryIds}
                    onChange={e => setTargetInquiryIds(e.target.value)}
                    placeholder="e.g. 87FlgArRqhT8SVuxOi7e, xHKCgvPKIzyJ6BV2xZEg"
                    className="w-full h-24 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors font-mono text-sm"
                />
                <p className="mt-1 text-xs text-gray-600">* 연결할 문의 ID를 쉼표로 구분해서 입력하세요.</p>
            </div>
        </div>

        {status === 'idle' || status === 'success' || status === 'error' ? (
            <button 
                onClick={runManualFix}
                className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-900/20 flex items-center justify-center gap-2"
            >
                <ArrowRight className="w-5 h-5" />
                Update Inquiries Now
            </button>
        ) : (
            <div className="w-full py-4 bg-gray-800 text-gray-400 font-bold rounded-xl flex items-center justify-center gap-2 cursor-wait">
                <Loader2 className="animate-spin w-5 h-5" />
                Processing...
            </div>
        )}

        {/* Console Output */}
        <div className="mt-8 bg-black rounded-xl p-4 h-48 overflow-y-auto border border-white/10 text-xs font-mono">
            {logs.length === 0 ? (
                <span className="text-gray-700 select-none">Ready to process... logs will appear here.</span>
            ) : (
                logs.map((log, i) => (
                    <div key={i} className={`mb-1 pb-1 border-b border-gray-900 last:border-0 ${
                        log.includes('ERROR') ? 'text-red-400' : 
                        log.includes('SUCCESS') ? 'text-green-400' : 'text-gray-400'
                    }`}>
                        {log}
                    </div>
                ))
            )}
        </div>
        
        <div className="mt-6 text-center">
            <Link href="/admin" className="text-sm text-gray-600 hover:text-white transition-colors underline decoration-gray-700 underline-offset-4">
                Return to Admin
            </Link>
        </div>
      </div>
    </div>
  );
}
