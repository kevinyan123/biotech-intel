const phaseColors: Record<string, { b: string; f: string }> = {
  Preclinical: { b: "#12121f", f: "#6c7a89" },
  "Phase 1": { b: "#0d1f30", f: "#4fc3f7" },
  "Phase 1/2": { b: "#0d1f30", f: "#4fc3f7" },
  "Phase 2": { b: "#142e12", f: "#81c784" },
  "Phase 2/3": { b: "#2a2a0d", f: "#fff176" },
  "Phase 3": { b: "#2e1a0d", f: "#ffb74d" },
  "NDA/BLA": { b: "#2e0d1f", f: "#f48fb1" },
  Approved: { b: "#0d2e1a", f: "#00e676" },
};

export default function PhaseBadge({ phase, small }: { phase: string; small?: boolean }) {
  const c = phaseColors[phase] || { b: "#12121f", f: "#999" };
  return (
    <span
      className="inline-block rounded font-mono font-semibold whitespace-nowrap"
      style={{
        padding: small ? "1px 5px" : "2px 7px",
        background: c.b,
        color: c.f,
        fontSize: small ? 8 : 9,
        border: `1px solid ${c.f}33`,
      }}
    >
      {phase}
    </span>
  );
}
