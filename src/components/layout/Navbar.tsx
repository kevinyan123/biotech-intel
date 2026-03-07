"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/" },
  { label: "Companies", href: "/companies" },
  { label: "Pipeline", href: "/drugs" },
  { label: "Trials", href: "/trials" },
  { label: "Catalysts", href: "/catalysts" },
  { label: "Targets", href: "/targets" },
  { label: "Diseases", href: "/diseases" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b backdrop-blur-xl"
      style={{ background: "var(--color-b1)ee", borderColor: "var(--color-bd)" }}>
      <div className="flex items-center gap-2 px-3 h-11 overflow-x-auto scrollbar-hide"
        style={{ WebkitOverflowScrolling: "touch" }}>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-1.5 shrink-0">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--color-ac)" }}>
            <path d="M2 15c6.667-6 13.333 0 20-6"/>
            <path d="M9 22c1.798-1.998 2.518-3.995 2.807-5.993"/>
            <path d="M15 2c-1.798 1.998-2.518 3.995-2.807 5.993"/>
          </svg>
          <span className="font-serif font-[800] text-[15px] tracking-tight whitespace-nowrap">KBY Biotech Index</span>
          <span className="text-[7px] font-mono font-semibold px-[3px] rounded-sm border"
            style={{ color: "var(--color-ac)", background: "var(--color-acd)", borderColor: "rgba(0,223,162,0.15)" }}>
            v0.0.12
          </span>
        </Link>

        {/* Nav */}
        <nav className="flex gap-0.5 ml-3 shrink-0">
          {navItems.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className="px-2 py-0.5 rounded text-[10px] font-medium transition-colors whitespace-nowrap shrink-0"
                style={{
                  background: isActive ? "var(--color-b3)" : "transparent",
                  color: isActive ? "var(--color-t0)" : "var(--color-t2)",
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex-1 min-w-2" />

        {/* Search */}
        <Link href="/search"
          className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[9px] border shrink-0"
          style={{ background: "var(--color-b2)", borderColor: "var(--color-bd)", color: "var(--color-t2)" }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <span className="hidden sm:inline">Search 600+ orgs…</span>
          <span className="sm:hidden">Search</span>
          <span className="ml-auto text-[7px] font-mono opacity-40 hidden sm:inline">⌘K</span>
        </Link>
      </div>
    </header>
  );
}
