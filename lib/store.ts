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
        // avoid multiple listeners
        try {
          onAuthStateChanged(firebaseAuth, async (fbUser) => {
            if (!fbUser) {
              get().logout();
              return;
            }

            const token = await fbUser.getIdToken();
            const email = fbUser.email || "";
            const name = fbUser.displayName || email;

            // Try to map role using mock data until server-side profiles exist
            const influencer = mockInfluencers.find((i) => i.email === email);
            const fan = mockFans.find((f) => f.email === email);

            let user: AuthUser;

            if (influencer) {
              user = {
                id: fbUser.uid,
                name: influencer.name || name,
                email,
                role: "influencer",
                subdomain: influencer.subdomain,
              };
            } else if (fan) {
              user = {
                id: fbUser.uid,
                name: fan.name || name,
                email,
                role: "fan",
                slug: fan.slug,
              };
            } else {
              user = { id: fbUser.uid, name, email, role: "fan" };
            }

            get().login(user, token);
          });
        } catch (e) {
          // ignore
        }
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
