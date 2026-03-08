"use client";

import Link from "next/link";

interface Props {
  title: string;
  count: number;
  description: string;
  href: string;
  icon: React.ReactNode;
  preview: string[];
}

export default function PeptideCategoryCard({ title, count, description, href, icon, preview }: Props) {
  return (
    <Link href={href} className="block group">
      <div className="rounded-lg p-4 transition-all duration-150 h-full"
        style={{
          background: "var(--color-b1)",
          border: "1px solid var(--color-bd)",
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(100,181,246,0.4)"; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--color-bd)"; }}>

        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
            style={{ background: "rgba(100,181,246,0.1)" }}>
            {icon}
          </div>
          <div>
            <div className="text-[11px] font-semibold" style={{ color: "var(--color-t0)" }}>{title}</div>
            <div className="text-[9px] font-mono" style={{ color: "var(--color-a2)" }}>{count} entries</div>
          </div>
        </div>

        <div className="text-[9px] mb-3 leading-relaxed" style={{ color: "var(--color-t2)" }}>
          {description}
        </div>

        <div className="flex flex-col gap-1">
          {preview.map((item, i) => (
            <div key={i} className="text-[8px] font-mono px-1.5 py-[2px] rounded"
              style={{ background: "var(--color-b2)", color: "var(--color-t1)" }}>
              {item}
            </div>
          ))}
        </div>
      </div>
    </Link>
  );
}
