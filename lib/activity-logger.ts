import { db } from './firebaseClient';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export interface ActivityLogParams {
  userId: string;
  userName?: string; 
  userEmail?: string;
  userRole?: string;
  subdomain?: string;
  action: string;
  target?: string;
  type: 'login' | 'settings' | 'update' | 'create' | 'delete' | 'reply' | 'security' | 'order' | 'info';
  details?: any;
}

export async function logActivity(params: ActivityLogParams) {
  try {
    await addDoc(collection(db, 'activity_logs'), {
      ...params,
      timestamp: serverTimestamp() // Firestore server timestamp
    });
    console.log(`[Activity Logged] ${params.action} by ${params.userEmail}`);
  } catch (error) {
    console.error("Failed to log activity:", error);
    // Don't throw, we don't want to break the app flow if logging fails
  }
}
