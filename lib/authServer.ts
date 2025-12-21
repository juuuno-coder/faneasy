import { mockInfluencers, mockFans } from "@/lib/data";
import { adminAuth, adminFirestore, verifyIdToken } from "@/lib/firebaseAdmin";
import jwt from "jsonwebtoken";
import type { JWTPayload } from "./types";

const JWT_SECRET =
  process.env.JWT_SECRET || "faneasy-secret-key-change-in-production";

export async function loginWithIdToken(idToken: string) {
  if (!process.env.FIREBASE_PRIVATE_KEY) {
    throw new Error("Firebase service account not configured");
  }

  const decoded = await verifyIdToken(idToken as any);
  const doc = await adminFirestore.collection("users").doc(decoded.uid).get();
  const profile = doc.exists ? doc.data() : null;

  return {
    token: idToken,
    user: profile
      ? {
          id: profile.uid || decoded.uid,
          name: profile.name || decoded.name || decoded.email || "User",
          email: profile.email || decoded.email || "",
          role: (profile.role as any) || "fan",
          subdomain: profile.subdomain,
          slug: profile.slug,
        }
      : { 
          id: decoded.uid, 
          name: decoded.name || decoded.email || "User",
          email: decoded.email || "",
          role: "fan" as const
        },
  };
}

export function loginWithMock(email: string, password: string) {
  // Influencer check
  const influencer = mockInfluencers.find((inf) => inf.email === email);
  if (influencer && password === "password123") {
    const payload: JWTPayload = {
      userId: influencer.id,
      email: influencer.email,
      role: "influencer",
      subdomain: influencer.subdomain,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

    return {
      token,
      user: {
        id: influencer.id,
        name: influencer.name,
        email: influencer.email,
        role: "influencer",
        subdomain: influencer.subdomain,
      },
    };
  }

  const fan = mockFans.find((f) => f.email === email);
  if (fan && password === "password123") {
    const payload: JWTPayload = {
      userId: fan.id,
      email: fan.email,
      role: "fan",
      slug: fan.slug,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

    return {
      token,
      user: {
        id: fan.id,
        name: fan.name,
        email: fan.email,
        role: "fan",
        slug: fan.slug,
      },
    };
  }

  return null;
}

export async function signupWithAdmin(opts: {
  email: string;
  password: string;
  name: string;
  role?: string;
  subdomain?: string;
}) {
  if (!process.env.FIREBASE_PRIVATE_KEY) {
    throw new Error("Firebase service account not configured");
  }

  const { email, password, name, role = "fan", subdomain } = opts;

  const userRecord = await adminAuth.createUser({
    email,
    password,
    displayName: name,
  });

  const profile: any = {
    uid: userRecord.uid,
    email,
    name,
    role,
    createdAt: new Date().toISOString(),
  };

  if (role === "influencer" && subdomain) profile.subdomain = subdomain;

  await adminFirestore.collection("users").doc(userRecord.uid).set(profile);

  const customToken = await adminAuth.createCustomToken(userRecord.uid);

  return { token: customToken, user: profile };
}
