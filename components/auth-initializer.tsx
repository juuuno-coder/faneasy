'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/store';

export default function AuthInitializer() {
  const initAuthListener = useAuthStore((state) => state.initAuthListener);

  useEffect(() => {
    // Initialize Firebase Auth listener on app mount
    initAuthListener();
  }, [initAuthListener]);

  return null;
}
