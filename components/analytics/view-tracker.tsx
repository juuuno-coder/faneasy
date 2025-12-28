'use client';

import { useEffect } from 'react';
import { db } from '@/lib/firebaseClient';
import { doc, runTransaction, setDoc, increment } from 'firebase/firestore';

export default function ViewTracker({ siteId }: { siteId: string }) {
  useEffect(() => {
    const trackView = async () => {
      // Prevent duplicate counting in same session
      const sessionKey = `viewed_${siteId}_${new Date().toISOString().split('T')[0]}`;
      if (sessionStorage.getItem(sessionKey)) return;

      try {
        await fetch('/api/track-view', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ siteId })
        });

        // Mark as viewed in session
        sessionStorage.setItem(sessionKey, 'true');
        console.log(`View tracked for ${siteId}`);

      } catch (error) {
        console.error("Failed to track view:", error);
      }
    };

    if (siteId) {
      trackView();
    }
  }, [siteId]);

  return null;
}
