import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Influencer, Fan, UserRole } from "./types";
import { firebaseAuth } from "./firebaseClient";
import { onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { getInfluencer, mockInfluencers, mockFans } from "./data";

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  subdomain?: string;
  slug?: string;
}

interface AuthStore {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;

  login: (user: AuthUser, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<AuthUser>) => void;

  // firebase helpers
  initAuthListener: () => void;
  signOutClient: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (user, token) =>
        set({
          user,
          token,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        }),

      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),

      initAuthListener: () => {
        if (typeof window === "undefined") return;
        
        const { doc, getDoc, setDoc } = require("firebase/firestore");
        const { db } = require("./firebaseClient");

        onAuthStateChanged(firebaseAuth, async (fbUser) => {
          if (!fbUser) {
            get().logout();
            return;
          }

          try {
            const token = await fbUser.getIdToken();
            const userRef = doc(db, "users", fbUser.uid);
            const userSnap = await getDoc(userRef);

            let user: AuthUser;

            if (userSnap.exists()) {
              const userData = userSnap.data();
              user = {
                id: fbUser.uid,
                name: userData.name || fbUser.displayName || fbUser.email?.split("@")[0] || "User",
                email: fbUser.email || "",
                role: userData.role || "user",
                subdomain: userData.subdomain,
                slug: userData.slug,
              };

              // Emergency Fix: If specific email, ensure they have Super Admin (if DB is somehow wrong)
              if (fbUser.email === "kgw2642@gmail.com" && user.role !== "super_admin") {
                 user.role = "super_admin";
              }

            } else {
              // Create default profile if not exists
              const defaultName = fbUser.displayName || fbUser.email?.split("@")[0] || "User";
              const defaultRole = (fbUser.email === "kgw2642@gmail.com" || fbUser.email === "juuuno@naver.com") ? "super_admin" : "user";
              
              user = {
                id: fbUser.uid,
                name: defaultName,
                email: fbUser.email || "",
                role: defaultRole as UserRole,
              };

              await setDoc(userRef, {
                ...user,
                createdAt: new Date(),
                uid: fbUser.uid
              });
            }

            get().login(user, token);
          } catch (e) {
            console.error("Auth listener error", e);
            // Fallback for network issues (use simple info)
            get().login({
                id: fbUser.uid,
                name: fbUser.displayName || fbUser.email || "User",
                email: fbUser.email || "",
                role: "user"
            }, "");
          }
        });
      },

      signOutClient: async () => {
        try {
          await firebaseSignOut(firebaseAuth);
          get().logout();
        } catch (err) {
          console.error("Sign out error", err);
          get().logout();
        }
      },
    }),
    {
      name: "faneasy-auth",
    }
  )
);

// 페이지 데이터 스토어
interface PageStore {
  influencers: Map<string, Influencer>;
  fans: Map<string, Fan>;

  addInfluencer: (influencer: Influencer) => void;
  addFan: (fan: Fan) => void;
  getInfluencer: (subdomain: string) => Influencer | undefined;
  getFan: (influencerId: string, slug: string) => Fan | undefined;
}

export const usePageStore = create<PageStore>((set, get) => ({
  influencers: new Map(),
  fans: new Map(),

  addInfluencer: (influencer) =>
    set((state) => {
      const newInfluencers = new Map(state.influencers);
      newInfluencers.set(influencer.subdomain, influencer);
      return { influencers: newInfluencers };
    }),

  addFan: (fan) =>
    set((state) => {
      const newFans = new Map(state.fans);
      newFans.set(`${fan.influencerId}-${fan.slug}`, fan);
      return { fans: newFans };
    }),

  getInfluencer: (subdomain) => {
    return get().influencers.get(subdomain);
  },

  getFan: (influencerId, slug) => {
    return get().fans.get(`${influencerId}-${slug}`);
  },
}));
