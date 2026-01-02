import { storage } from './firebaseClient';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

export type StoragePlatform = 'dearz' | 'influencer' | 'faneasy' | 'common';
export type StorageCategory = 'profiles' | 'campaigns' | 'banners' | 'products' | 'documents';

/**
 * Uploads a file to Firebase Storage under a structured path:
 * {platform}/{category}/{uuid}.{ext}
 * 
 * @param file The file object to upload
 * @param platform The platform this file belongs to (dearz, influencer, faneasy)
 * @param category The category of the file (profiles, banners, etc.)
 * @param customName Optional custom filename (without extension)
 * @returns Promise resolving to the download URL
 */
export async function uploadFile(
  file: File,
  platform: StoragePlatform,
  category: StorageCategory,
  customName?: string
): Promise<string> {
  if (!file) throw new Error("No file header provided");

  const ext = file.name.split('.').pop();
  const filename = customName ? `${customName}.${ext}` : `${uuidv4()}.${ext}`;
  const fullPath = `${platform}/${category}/${filename}`;
  
  const storageRef = ref(storage, fullPath);
  
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  
  return url;
}

/**
 * Deletes a file from Firebase Storage
 * 
 * @param url The full download URL of the file
 */
export async function deleteFile(url: string): Promise<void> {
  // simple parser to extract reference from URL
  // This is a basic implementation. Ideally, store the fullPath in DB too.
  try {
    const storageRef = ref(storage, url);
    await deleteObject(storageRef);
  } catch (error) {
    console.error("Error deleting file:", error);
    // Suppress error if file not found?
    throw error;
  }
}
