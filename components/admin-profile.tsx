"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Settings, User } from "lucide-react";
import { useAuthStore } from "@/lib/store";

export default function AdminProfile() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    function handleClick(e: MouseEvent) {
      if (open && ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  if (!user) return null;

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <div ref={ref} className="relative">
      <button
        id="profile-button"
        aria-haspopup="true"
        aria-controls="profile-menu"
        aria-expanded={open}
        aria-label={`${user.name} 님 메뉴 열기`}
        onClick={() => setOpen((s) => !s)}
        className="flex items-center gap-3 rounded-full px-3 py-2 hover:bg-gray-100 transition-colors text-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-indigo-500"
      >
        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-800">
          {user.name?.[0] ?? "U"}
        </div>
        <div className="hidden md:block text-left">
          <div className="text-sm font-medium">{user.name}</div>
          <div className="text-xs text-gray-500">
            {user.role === "owner"
              ? `${user.subdomain}.faneasy.kr`
              : user.email}
          </div>
        </div>
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-48 rounded-md border bg-white shadow-md z-50"
          role="dialog"
          aria-modal="false"
          aria-labelledby="profile-button"
        >
          <ul
            id="profile-menu"
            role="menu"
            className="py-1"
            aria-label="프로필 메뉴"
          >
            <li>
              <button
                role="menuitem"
                tabIndex={0}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:bg-gray-100"
                onClick={() => {
                  setOpen(false);
                  router.push("/profile");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setOpen(false);
                    router.push("/profile");
                  }
                }}
              >
                <User className="h-4 w-4" /> <span>프로필</span>
              </button>
            </li>
            <li>
              <button
                role="menuitem"
                tabIndex={0}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:bg-gray-100"
                onClick={() => {
                  setOpen(false);
                  router.push("/settings");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setOpen(false);
                    router.push("/settings");
                  }
                }}
              >
                <Settings className="h-4 w-4" /> <span>설정</span>
              </button>
            </li>
            <li>
              <button
                role="menuitem"
                tabIndex={0}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-50 focus:outline-none focus-visible:bg-gray-100"
                onClick={handleLogout}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") handleLogout();
                }}
              >
                <LogOut className="h-4 w-4" /> <span>로그아웃</span>
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
