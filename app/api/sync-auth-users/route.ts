import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebaseAdmin';

export async function POST(request: Request) {
  try {
    const { targetSite } = await request.json();
    
    console.log('Starting Auth -> Firestore sync...');
    
    // Fetch all users from Firebase Authentication
    const listUsersResult = await adminAuth.listUsers(1000); // Max 1000 users per call
    const authUsers = listUsersResult.users;
    
    console.log(`Found ${authUsers.length} users in Firebase Auth`);
    
    let syncedCount = 0;
    let skippedCount = 0;
    
    for (const authUser of authUsers) {
      try {
        const userRef = adminDb.collection('users').doc(authUser.uid);
        const userDoc = await userRef.get();
        
        if (!userDoc.exists) {
          // User doesn't exist in Firestore, create it
          await userRef.set({
            id: authUser.uid,
            email: authUser.email || '',
            name: authUser.displayName || authUser.email?.split('@')[0] || 'User',
            role: 'user',
            createdAt: authUser.metadata.creationTime ? new Date(authUser.metadata.creationTime) : new Date(),
            joinedSite: targetSite || 'kkang.designd.co.kr',
            updatedAt: new Date(),
            syncedFromAuth: true
          });
          syncedCount++;
          console.log(`✅ Created Firestore doc for: ${authUser.email}`);
        } else {
          // User exists, optionally update name if missing
          const data = userDoc.data();
          if (!data?.name || data.name === 'Unknown') {
            await userRef.update({
              name: authUser.displayName || authUser.email?.split('@')[0] || 'User',
              updatedAt: new Date()
            });
            console.log(`📝 Updated name for: ${authUser.email}`);
          }
          skippedCount++;
        }
      } catch (error) {
        console.error(`Error syncing user ${authUser.email}:`, error);
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `동기화 완료: ${syncedCount}명 추가, ${skippedCount}명 기존 회원`,
      synced: syncedCount,
      skipped: skippedCount,
      total: authUsers.length
    });
    
  } catch (error: any) {
    console.error('Sync error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
