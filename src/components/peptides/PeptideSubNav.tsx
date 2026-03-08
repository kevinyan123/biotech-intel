"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const subNavItems = [
  { label: "Overview", href: "/peptides", exact: true },
  { label: "Dictionary", href: "/peptides/dictionary" },
  { label: "Targets", href: "/peptides/targets" },
  { label: "Manufacturers", href: "/peptides/manufacturers" },
];

export default function PeptideSubNav() {
  const pathname = usePathname();

  return (
    <div className="sticky top-[44px] z-40 border-b -mx-3 px-3 mb-4 backdrop-blur-xl"
      style={{ background: "var(--color-b1)ee", borderColor: "var(--color-bd)" }}>
      <div className="flex items-center gap-1 py-1.5 overflow-x-auto scrollbar-hide">
        {/* Section pill */}
        <span className="text-[7px] font-mono font-bold px-1.5 py-[1px] rounded-sm mr-2 shrink-0 uppercase tracking-widest"
          style={{ background: "rgba(100,181,246,0.12)", color: "var(--color-a2)", border: "1px solid rgba(100,181,246,0.2)" }}>
          Peptides
        </span>

        {subNavItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="px-2.5 py-[3px] rounded text-[9px] font-medium transition-colors whitespace-nowrap shrink-0"
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
      </div>
    </div>
  );
}
