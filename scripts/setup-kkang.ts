
import { adminFirestore, adminAuth } from "../lib/firebaseAdmin";

async function run() {
  const email = "kgw2642@gmail.com";
  const password = "kgw2642!";
  const subdomain = "kkang";

  console.log(`Setting up owner: ${email} for site: ${subdomain}...`);

  try {
    let uid;
    try {
      const userRecord = await adminAuth.getUserByEmail(email);
      uid = userRecord.uid;
      console.log(`User already exists: ${email} (UID: ${uid})`);
      
      // Update password just in case
      await adminAuth.updateUser(uid, { 
        password,
        displayName: "Kkang Owner" 
      });
      console.log("Updated password and profile.");
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') {
        const userRecord = await adminAuth.createUser({
          email,
          password,
          displayName: "Kkang Owner",
        });
        uid = userRecord.uid;
        console.log(`Created new user: ${email} (UID: ${uid})`);
      } else {
        throw err;
      }
    }

    if (!uid) throw new Error("Failed to get UID");

    // Update Firestore 'users' collection
    const userDoc = {
      uid,
      name: "Kkang Owner",
      email,
      role: "owner",
      subdomain,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await adminFirestore.collection("users").doc(uid).set(userDoc, { merge: true });
    console.log(`Updated Firestore [users/${uid}] with role='owner', subdomain='${subdomain}'`);

    // Create Dummy Fans for Tree View Visualization
    console.log("Creating dummy fans for Tree View...");
    const dummyFans = [
      { name: "Fan 1", email: "fan1@example.com" },
      { name: "Fan 2", email: "fan2@example.com" },
      { name: "Kim Fan", email: "kim@example.com" },
    ];

    for (const fan of dummyFans) {
      const fanRef = adminFirestore.collection("users").doc();
      await fanRef.set({
        uid: fanRef.id,
        name: fan.name,
        email: fan.email,
        role: "user",
        joinedSite: subdomain, 
        createdAt: new Date(),
      });
      console.log(` -> Created dummy fan: ${fan.name}`);
    }

    console.log("✅ Setup completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Setup failed:", err);
    process.exit(1);
  }
}

run();
