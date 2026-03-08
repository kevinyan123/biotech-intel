"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const sectionNavItems = [
  { label: "Overview", href: "/peptides", exact: true },
  { label: "Dictionary", href: "/peptides/dictionary" },
  { label: "Targets", href: "/peptides/targets" },
  { label: "Manufacturers", href: "/peptides/manufacturers" },
];

export default function PeptideHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-[36px] z-40 border-b backdrop-blur-xl -mx-3 px-3"
      style={{ background: "var(--color-b1)ee", borderColor: "var(--color-bd)" }}>
      <div className="flex items-center gap-3 h-11 overflow-x-auto scrollbar-hide"
        style={{ WebkitOverflowScrolling: "touch" }}>

        {/* KBY Peptide Index branding */}
        <Link href="/peptides" className="flex items-center gap-1.5 shrink-0">
          {/* DNA double helix icon */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64b5f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 15c6.667-6 13.333 0 20-6"/>
            <path d="M9 22c1.798-1.998 2.518-3.995 2.807-5.993"/>
            <path d="M15 2c-1.798 1.998-2.518 3.995-2.807 5.993"/>
            <path d="M8 9h8"/>
            <path d="M8 15h8"/>
          </svg>
          <span className="font-serif font-[800] text-[15px] tracking-tight whitespace-nowrap"
            style={{ color: "var(--color-t0)" }}>
            KBY Peptide Index
          </span>
          <span className="text-[7px] font-mono font-semibold px-[3px] rounded-sm border"
            style={{ color: "var(--color-a2)", background: "rgba(100,181,246,0.08)", borderColor: "rgba(100,181,246,0.2)" }}>
            BETA
          </span>
        </Link>

        {/* Divider */}
        <div className="h-4 w-px shrink-0" style={{ background: "var(--color-bd)" }} />

        {/* Section navigation */}
        <nav className="flex gap-0.5 shrink-0">
          {sectionNavItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="px-2.5 py-[3px] rounded text-[10px] font-medium transition-colors whitespace-nowrap shrink-0"
                style={{
                  background: isActive ? "rgba(100,181,246,0.12)" : "transparent",
                  color: isActive ? "var(--color-a2)" : "var(--color-t2)",
                  border: isActive ? "1px solid rgba(100,181,246,0.15)" : "1px solid transparent",
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
