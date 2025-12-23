import { db } from './firebaseClient';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ActivityLog } from './types';

export async function logActivity(data: Omit<ActivityLog, 'id' | 'timestamp'>) {
    try {
        const logsRef = collection(db, 'activity_logs');
        await addDoc(logsRef, {
            ...data,
            timestamp: new Date().toISOString(),
            serverAt: serverTimestamp()
        });
    } catch (e) {
        console.error("Failed to log activity:", e);
    }
}
