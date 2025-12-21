import { adminAuth, adminFirestore } from "@/lib/firebaseAdmin";

async function run() {
  if (!process.env.FIREBASE_PRIVATE_KEY) {
    console.error(
      "Service account not configured. Set FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL, FIREBASE_PROJECT_ID"
    );
    process.exit(1);
  }

  try {
    console.log("Admin auth ready:", typeof adminAuth);
    const collections = await adminFirestore.listCollections();
    console.log(
      "Firestore collections sample:",
      collections.map((c) => c.id).slice(0, 5)
    );
    console.log("Firebase admin check OK");
    process.exit(0);
  } catch (err) {
    console.error("Firebase check failed:", err);
    process.exit(1);
  }
}

run();
