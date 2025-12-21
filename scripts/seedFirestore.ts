import { mockInfluencers, mockFans } from "@/lib/data";
import { adminFirestore, adminAuth } from "@/lib/firebaseAdmin";

async function run() {
  if (!process.env.FIREBASE_PRIVATE_KEY) {
    console.error(
      "서비스 계정이 설정되어 있지 않습니다. 먼저 FIREBASE_* env를 설정하세요."
    );
    process.exit(1);
  }

  try {
    console.log("Seeding influencers...");
    for (const inf of mockInfluencers) {
      // create a user if not exists
      let userRecord;
      try {
        userRecord = await adminAuth.getUserByEmail(inf.email);
        console.log(`User exists: ${inf.email}`);
      } catch (err) {
        // create with random password (admin-only)
        userRecord = await adminAuth.createUser({
          email: inf.email,
          password: Math.random().toString(36).slice(-8),
          displayName: inf.name,
        });
        console.log(`Created user: ${inf.email}`);
      }

      const doc = {
        uid: userRecord.uid,
        id: inf.id,
        subdomain: inf.subdomain,
        name: inf.name,
        email: inf.email,
        role: "influencer",
        pageSettings: inf.pageSettings,
        revenueShare: inf.revenueShare,
        createdAt: inf.createdAt.toISOString(),
      };

      await adminFirestore
        .collection("influencers")
        .doc(userRecord.uid)
        .set(doc, { merge: true });
      console.log(`Seeded influencer doc for uid=${userRecord.uid} (merged)`);
    }

    console.log("Seeding fans...");
    for (const fan of mockFans) {
      let userRecord;
      try {
        userRecord = await adminAuth.getUserByEmail(fan.email);
        console.log(`User exists: ${fan.email}`);
      } catch (err) {
        userRecord = await adminAuth.createUser({
          email: fan.email,
          password: Math.random().toString(36).slice(-8),
          displayName: fan.name,
        });
        console.log(`Created user: ${fan.email}`);
      }

      const doc = {
        uid: userRecord.uid,
        id: fan.id,
        influencerId: fan.influencerId,
        slug: fan.slug,
        name: fan.name,
        email: fan.email,
        role: "fan",
        pageSettings: fan.pageSettings,
        permissions: fan.permissions,
        createdAt: fan.createdAt.toISOString(),
      };

      await adminFirestore
        .collection("fans")
        .doc(userRecord.uid)
        .set(doc, { merge: true });
      console.log(`Seeded fan doc for uid=${userRecord.uid} (merged)`);
    }

    console.log("Seeding completed.");
    process.exit(0);
  } catch (err) {
    console.error("Seed failed:", err);
    process.exit(1);
  }
}

run();
