"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Home", icon: "H" },
  { href: "/companies", label: "Companies", icon: "C" },
  { href: "/drugs", label: "Drugs", icon: "D" },
  { href: "/trials", label: "Trials", icon: "T" },
  { href: "/sources", label: "Sources", icon: "S" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-56 border-r border-gray-200 bg-white">
      <div className="flex h-14 items-center border-b border-gray-200 px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded bg-blue-600 text-xs font-bold text-white">
            BI
          </span>
          <span className="text-sm font-semibold text-gray-900">
            BiotechIntel
          </span>
        </Link>
      </div>
      <nav className="p-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                    isActive
                      ? "bg-blue-50 font-medium text-blue-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded text-xs font-medium ${
                      isActive
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="mt-6 border-t border-gray-200 pt-4">
          <p className="px-3 text-xs font-medium uppercase tracking-wider text-gray-400">
            Data Sources
          </p>
          <ul className="mt-2 space-y-1">
            <li>
              <a
                href="https://clinicaltrials.gov"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-md px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              >
                ClinicalTrials.gov
              </a>
            </li>
            <li>
              <a
                href="https://api.fda.gov"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-md px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              >
                OpenFDA
              </a>
            </li>
            <li>
              <a
                href="https://pubmed.ncbi.nlm.nih.gov"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-md px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              >
                PubMed
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </aside>
  );
}
