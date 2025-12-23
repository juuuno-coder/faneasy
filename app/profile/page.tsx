"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { updateProfile } from "firebase/auth";
import { useAuthStore } from "@/lib/store";
import { firebaseAuth } from "@/lib/firebaseClient";

export default function ProfilePage() {
  const router = useRouter();
  const { user, updateUser } = useAuthStore();
  const [name, setName] = useState<string>(user?.name ?? "");
  const [subdomain, setSubdomain] = useState<string>(user?.subdomain ?? "");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setName(user.name);
    setSubdomain(user.subdomain ?? "");
  }, [user]);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      // Try to update Firebase auth profile if available
      if (firebaseAuth?.currentUser) {
        await updateProfile(firebaseAuth.currentUser, {
          displayName: name,
        });
      }

      // Update local store
      updateUser({ name, subdomain });
      setMsg("저장되었습니다.");
    } catch (err) {
      console.error(err);
      setMsg("저장 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(null), 4000);
    }
  }

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">프로필 편집</h1>
      <p className="text-gray-600 mb-6">계정 정보를 편집하고 저장하세요.</p>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white rounded-xl p-6 shadow-sm"
      >
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            표시 이름
          </label>
          <input
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-indigo-500"
            required
            aria-required="true"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            이메일
          </label>
          <input
            id="email"
            name="email"
            value={user.email}
            readOnly
            className="mt-1 block w-full rounded-md border bg-gray-50 px-3 py-2 text-sm text-gray-600"
            aria-readonly="true"
          />
        </div>

        {user.role === "owner" && (
          <div>
            <label
              htmlFor="subdomain"
              className="block text-sm font-medium text-gray-700"
            >
              서브도메인
            </label>
            <div className="mt-1 flex gap-2">
              <input
                id="subdomain"
                name="subdomain"
                value={subdomain}
                onChange={(e) => setSubdomain(e.target.value)}
                className="block w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-indigo-500"
              />
              <span className="inline-flex items-center rounded-md bg-gray-50 px-3 text-sm text-gray-500">
                .faneasy.kr
              </span>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="rounded-md bg-admin-accent px-4 py-2 text-white font-medium hover:opacity-95 disabled:opacity-50"
            disabled={saving}
          >
            {saving ? "저장 중..." : "저장"}
          </button>

          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-md border px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            취소
          </button>

          {msg && (
            <div aria-live="polite" className="text-sm text-gray-700">
              {msg}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
