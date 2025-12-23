
import { adminAuth, adminFirestore } from "../lib/firebaseAdmin";

async function main() {
  console.log("=== 🔍 Firebase Auth Users (가입된 계정) ===");
  try {
    const listUsersResult = await adminAuth.listUsers(100);
    const users = listUsersResult.users;
    
    if (users.length === 0) {
        console.log("  (가입된 계정이 없습니다)");
    } else {
        users.forEach((userRecord) => {
          console.log(`  - [Auth] Email: ${userRecord.email} | Name: ${userRecord.displayName} | UID: ${userRecord.uid}`);
        });
    }
    
    console.log("\n=== 📂 Firestore 'users' Collection (관리자 명단 데이터) ===");
    const snapshot = await adminFirestore.collection('users').get();
    if (snapshot.empty) {
      console.log("  (DB에 저장된 유저 데이터가 없습니다)");
    } else {
      snapshot.forEach(doc => {
        const data = doc.data();
        console.log(`  - [DB] Name: ${data.name} | Email: ${data.email} | Role: ${data.role} | Subdomain: ${data.subdomain || 'N/A'}`);
      });
    }

  } catch (e) {
    console.error("Error during check:", e);
  }
  process.exit(0);
}

main();
