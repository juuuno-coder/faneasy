import admin from "firebase-admin";

if (!admin.apps.length) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (projectId && clientEmail && privateKey) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey: privateKey.replace(/\\n/g, "\n"),
        }),
        projectId,
      });
    } catch (error) {
      console.error("Firebase Admin initialization error:", error);
    }
  } else {
    // Log warning only in development or if strict mode isn't needed during build
    if (process.env.NODE_ENV !== 'production') {
        console.warn("Firebase Admin credentials missing. Skipping initialization.");
    }
  }
}

// Use Proxy to prevent top-level errors if initialization skipped
export const adminAuth = new Proxy({} as admin.auth.Auth, {
  get: (_target, prop) => {
    if (!admin.apps.length) throw new Error("Firebase Admin not initialized. Check environment variables.");
    const auth = admin.auth();
    const value = (auth as any)[prop];
    return typeof value === 'function' ? value.bind(auth) : value;
  }
});

export const adminFirestore = new Proxy({} as admin.firestore.Firestore, {
  get: (_target, prop) => {
    if (!admin.apps.length) throw new Error("Firebase Admin not initialized. Check environment variables.");
    const firestore = admin.firestore();
    const value = (firestore as any)[prop];
    return typeof value === 'function' ? value.bind(firestore) : value;
  }
});

// Alias for convenience
export const adminDb = adminFirestore;

export async function verifyIdToken(idToken: string) {
  return adminAuth.verifyIdToken(idToken);
}

export async function createCustomToken(
  uid: string,
  additionalClaims?: Record<string, any>
) {
  return adminAuth.createCustomToken(uid, additionalClaims);
}
