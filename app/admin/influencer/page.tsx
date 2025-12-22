'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function InfluencerAdminRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to unified admin dashboard
    router.replace('/admin');
  }, [router]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
        <p className="text-gray-400">통합 관리자 페이지로 이동 중...</p>
      </div>
    </div>
  );
}
