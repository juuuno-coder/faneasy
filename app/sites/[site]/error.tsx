'use client';

import { useEffect } from 'react';
import { RotateCcw, Home, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0A0A0B] p-4 text-white font-sans">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-red-500/10 p-4 text-red-500">
            <AlertCircle className="h-12 w-12" />
          </div>
        </div>
        
        <h2 className="mb-2 text-2xl font-bold">앗! 오류가 발생했습니다</h2>
        <p className="mb-8 text-gray-400">
          페이지를 불러오는 중에 예상치 못한 문제가 발생했습니다. <br />
          다시 시도하거나 홈으로 이동해 주세요.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => reset()}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-4 font-bold text-black transition-all hover:bg-gray-200 active:scale-95"
          >
            <RotateCcw className="h-5 w-5" />
            다시 시ed하기
          </button>
          
          <Link
            href="/"
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 py-4 font-bold text-white transition-all hover:bg-white/10 active:scale-95"
          >
            <Home className="h-5 w-5" />
            홈으로 이동
          </Link>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 rounded-xl bg-black/50 p-4 text-left font-mono text-xs text-red-400">
            <p className="mb-1 font-bold">Error Details:</p>
            {error.message}
          </div>
        )}
      </div>
    </div>
  );
}
