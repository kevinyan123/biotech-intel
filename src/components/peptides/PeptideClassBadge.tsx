"use client";

const CLASS_COLORS: Record<string, { bg: string; fg: string }> = {
  Therapeutic: { bg: "rgba(0,230,118,0.1)", fg: "#00e676" },
  Diagnostic: { bg: "rgba(100,181,246,0.1)", fg: "#64b5f6" },
  Research: { bg: "rgba(206,147,216,0.1)", fg: "#ce93d8" },
};

const DEFAULT_COLOR = { bg: "rgba(255,171,102,0.1)", fg: "#ffab66" };

export default function PeptideClassBadge({ classification }: { classification: string }) {
  const c = CLASS_COLORS[classification] || DEFAULT_COLOR;
  return (
    <span className="inline-flex items-center text-[8px] font-semibold font-mono px-1.5 py-[1px] rounded-sm"
      style={{ background: c.bg, color: c.fg, border: `1px solid ${c.fg}20` }}>
      {classification}
    </span>
  );
}
