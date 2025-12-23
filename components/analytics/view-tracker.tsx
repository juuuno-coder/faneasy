'use client';

import { useEffect } from 'react';
import { db } from '@/lib/firebaseClient';
import { doc, runTransaction, setDoc, increment } from 'firebase/firestore';

export default function ViewTracker({ siteId }: { siteId: string }) {
  useEffect(() => {
    const trackView = async () => {
      // Prevent duplicate counting in same session
      const sessionKey = `viewed_${siteId}`;
      if (sessionStorage.getItem(sessionKey)) return;

      try {
        const today = new Date().toISOString().split('T')[0];
        const statsRef = doc(db, 'site_stats', siteId);
        const dailyRef = doc(db, 'site_stats', siteId, 'daily_stats', today);

        // Update Total Visits (Simple increment)
        await setDoc(statsRef, { 
          totalVisits: increment(1),
          lastUpdated: new Date().toISOString()
        }, { merge: true });

        // Update Daily Visits
        await setDoc(dailyRef, {
          visits: increment(1),
          date: today
        }, { merge: true });

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
