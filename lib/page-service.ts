import { db } from './firebaseClient';
import { doc, getDoc } from 'firebase/firestore';
import { SiteBlock } from './types';

export async function getPageBlocks(subdomain: string): Promise<SiteBlock[] | null> {
  try {
    const docRef = doc(db, 'page_blocks', subdomain);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data().blocks as SiteBlock[];
    }
    return null;
  } catch (err) {
    console.error('Error fetching page blocks:', err);
    return null;
  }
}
