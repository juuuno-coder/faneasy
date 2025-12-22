import { adminFirestore } from "../lib/firebaseAdmin";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function checkInquiries() {
  try {
    console.log("Fetching inquiries from Firestore...");
    const snapshot = await adminFirestore.collection("inquiries").orderBy("createdAt", "desc").get();
    
    if (snapshot.empty) {
      console.log("No inquiries found in Firestore.");
    } else {
      console.log(`Found ${snapshot.size} inquiries:`);
      snapshot.forEach(doc => {
        const data = doc.data();
        console.log(`- [${data.createdAt}] ${data.name} (${data.email}): ${data.message.substring(0, 50)}...`);
      });
    }
  } catch (error) {
    console.error("Error fetching inquiries:", error);
  }
  process.exit(0);
}

checkInquiries();
