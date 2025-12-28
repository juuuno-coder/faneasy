import { NextResponse } from 'next/server';
import { adminFirestore } from '@/lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(req: Request) {
  try {
    const { siteId } = await req.json();
    
    if (!siteId) {
      return NextResponse.json({ error: 'Missing siteId' }, { status: 400 });
    }

    const today = new Date().toISOString().split('T')[0];
    const batch = adminFirestore.batch();

    // 1. Site Specific Stats
    const statsRef = adminFirestore.collection('site_stats').doc(siteId);
    const dailyRef = statsRef.collection('daily_stats').doc(today);

    batch.set(statsRef, {
      totalVisits: FieldValue.increment(1),
      lastUpdated: new Date().toISOString()
    }, { merge: true });

    batch.set(dailyRef, {
      visits: FieldValue.increment(1),
      date: today
    }, { merge: true });

    // 2. Platform Wide Stats (Aggregator for Super Admin)
    const platformRef = adminFirestore.collection('site_stats').doc('platform');
    const platformDailyRef = platformRef.collection('daily_stats').doc(today);

    batch.set(platformRef, {
      totalVisits: FieldValue.increment(1),
      lastUpdated: new Date().toISOString()
    }, { merge: true });

    batch.set(platformDailyRef, {
      visits: FieldValue.increment(1),
      date: today
    }, { merge: true });

    await batch.commit();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Track view error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
