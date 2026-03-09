"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";

export default function AuthControls() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 shrink-0">
        <div className="w-[52px] h-[22px] rounded-md animate-pulse" style={{ background: "var(--color-b2)" }} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center gap-1.5 shrink-0">
        <Link
          href="/login"
          className="px-2.5 py-[3px] rounded text-[10px] font-medium transition-opacity hover:opacity-80"
          style={{ color: "var(--color-t1)" }}
        >
          Log in
        </Link>
        <Link
          href="/signup"
          className="px-2.5 py-[3px] rounded text-[10px] font-semibold transition-opacity hover:opacity-80"
          style={{
            background: "var(--color-ac)",
            color: "#000",
          }}
        >
          Sign up
        </Link>
      </div>
    );
  }

  // Logged in state
  const initial = (user.name || user.email)[0].toUpperCase();

  const handleLogout = async () => {
    setMenuOpen(false);
    await logout();
    router.push("/");
  };

  return (
    <div className="relative shrink-0" ref={menuRef}>
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold transition-opacity hover:opacity-80 cursor-pointer"
        style={{
          background: "var(--color-ac)",
          color: "#000",
        }}
        aria-label="Account menu"
      >
        {initial}
      </button>

      {menuOpen && (
        <div
          className="absolute right-0 top-full mt-1.5 w-48 rounded-lg border shadow-xl z-50 overflow-hidden"
          style={{ background: "var(--color-b1)", borderColor: "var(--color-bd)" }}
        >
          {/* User info */}
          <div className="px-3 py-2.5 border-b" style={{ borderColor: "var(--color-bd)" }}>
            <p className="text-[11px] font-semibold truncate" style={{ color: "var(--color-t0)" }}>
              {user.name || "User"}
            </p>
            <p className="text-[9px] truncate mt-0.5" style={{ color: "var(--color-t2)" }}>
              {user.email}
            </p>
          </div>

          {/* Menu items */}
          <div className="py-1">
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-1.5 text-[10px] font-medium transition-colors cursor-pointer"
              style={{ color: "var(--color-rd)" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-b2)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
